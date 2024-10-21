// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "../contracts/Spotlight.sol";
import "../contracts/Events.sol";

contract PostManagementTest is Test {
    Spotlight public spotlight;
    Vm.Wallet public wallet;

    function setUp() public {
        spotlight = new Spotlight(vm.addr(1));
        wallet = vm.createWallet(1);
    }

    function signContentViaWallet(Vm.Wallet memory _w, string memory _content) internal returns (bytes memory) {
        bytes32 digest = MessageHashUtils.toEthSignedMessageHash(bytes(_content));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(_w, digest);
        bytes memory signature = abi.encodePacked(r, s, v);
        return signature;
    }

    function testCannotCreatePostIfAddressNotRegistered() public {
        vm.expectRevert("Profile does not exist");
        spotlight.createPost("Hello, world!", "not a sig");
    }

    function testRegisteredAddressCanCreatePostAndEmitsAPostCreatedEvent() public {
        vm.startPrank(wallet.addr);
        spotlight.registerProfile("Username");

        vm.expectEmit();
        bytes memory signature = signContentViaWallet(wallet, "Hello, world!");
        emit PostCreated(wallet.addr, signature);
        spotlight.createPost("Hello, world!", signature);
    }

    function testSignatureThatCannotBeVerifiedResultsInRevertingPostCreation() public {
        vm.startPrank(wallet.addr);
        spotlight.registerProfile("username");

        vm.expectRevert("Invalid signature");
        spotlight.createPost("Hello, world!", "Fake signature");
    }

    function testEmptyPostIsRejected() public {
        vm.startPrank(wallet.addr);
        spotlight.registerProfile("username");

        vm.expectRevert("Post content cannot be empty");
        spotlight.createPost("", "Sig won't be checked here");
    }

    function testPostCanBeRetrievedBySignature() public {
        vm.startPrank(wallet.addr);
        spotlight.registerProfile("username");
        spotlight.createPost("1", signContentViaWallet(wallet, "1"));
        spotlight.createPost("2", signContentViaWallet(wallet, "2"));
        spotlight.createPost("3", signContentViaWallet(wallet, "3"));

        Spotlight.Post memory p = spotlight.getPost(signContentViaWallet(wallet, "2"));
        assertEq("2", string(p.content));
        assertEq(wallet.addr, p.creator);
        assertEq(signContentViaWallet(wallet, "2"), p.signature);
    }

    function testGettingNonexistentPostReverts() public {
        vm.startPrank(wallet.addr);
        spotlight.registerProfile("username");

        vm.expectRevert("Requested post not found");
        spotlight.getPost(bytes("sig-does-not-exist"));
    }

    function testUserCanGetListOfSpecificUserPosts() public {
        Vm.Wallet memory _w = vm.createWallet(100);
        vm.startPrank(_w.addr);
        spotlight.registerProfile("_w");
        spotlight.createPost("_w", signContentViaWallet(_w, "_w"));
        vm.stopPrank();

        vm.startPrank(wallet.addr);
        spotlight.registerProfile("username");
        spotlight.createPost("0", signContentViaWallet(wallet, "0"));
        spotlight.createPost("1", signContentViaWallet(wallet, "1"));
        spotlight.createPost("2", signContentViaWallet(wallet, "2"));

        Spotlight.Post[] memory posts = spotlight.getPostsOfAddress(wallet.addr);
        assertEq(3, posts.length);

        // NOTE: These assertions will need to be updated when we start "sorting" by latest posts
        assertEq(wallet.addr, posts[0].creator);
        assertEq(wallet.addr, posts[1].creator);
        assertEq(wallet.addr, posts[2].creator);

        assertEq("0", string(posts[0].content));
        assertEq("1", string(posts[1].content));
        assertEq("2", string(posts[2].content));

        assertEq(signContentViaWallet(wallet, "0"), posts[0].signature);
        assertEq(signContentViaWallet(wallet, "1"), posts[1].signature);
        assertEq(signContentViaWallet(wallet, "2"), posts[2].signature);

        // We can also get the post of the first user, right?
        posts = spotlight.getPostsOfAddress(_w.addr);
        assertEq(1, posts.length);
        assertEq(_w.addr, posts[0].creator);
        assertEq(bytes("_w"), posts[0].content);
        assertEq(signContentViaWallet(_w, "_w"), posts[0].signature);
    }

    function testUserCanGetListOfAllPostsInCommunity() public {
        // Create 3 wallets and for each wallet, register and create a post
        Vm.Wallet[] memory wallets = new Vm.Wallet[](3);

        // NOTE: Cannot create a wallet @ address 0
        wallets[0] = vm.createWallet(10);
        vm.startPrank(wallets[0].addr);
        spotlight.registerProfile("0");
        spotlight.createPost(bytes("0"), signContentViaWallet(wallets[0], "0"));
        vm.stopPrank();

        wallets[1] = vm.createWallet(11);
        vm.startPrank(wallets[1].addr);
        spotlight.registerProfile("1");
        spotlight.createPost(bytes("1"), signContentViaWallet(wallets[1], "1"));
        vm.stopPrank();

        wallets[2] = vm.createWallet(12);
        vm.startPrank(wallets[2].addr);
        spotlight.registerProfile("2");
        spotlight.createPost(bytes("2"), signContentViaWallet(wallets[2], "2"));
        vm.stopPrank();

        // We're expecting 3 posts to be returned
        vm.startPrank(wallets[0].addr);
        Spotlight.Post[] memory posts = spotlight.getCommunityPosts();
        assertEq(3, posts.length);

        assertEq(wallets[0].addr, posts[0].creator);
        assertEq(wallets[1].addr, posts[1].creator);
        assertEq(wallets[2].addr, posts[2].creator);

        assertEq(signContentViaWallet(wallets[0], "0"), posts[0].signature);
        assertEq(signContentViaWallet(wallets[1], "1"), posts[1].signature);
        assertEq(signContentViaWallet(wallets[2], "2"), posts[2].signature);

        assertEq(bytes("0"), posts[0].content);
        assertEq(bytes("1"), posts[1].content);
        assertEq(bytes("2"), posts[2].content);
    }

    function testGettingPostsOfUnregisteredUserReverts() public {
        vm.startPrank(wallet.addr);
        spotlight.registerProfile("username");

        vm.expectRevert("Requested address is not registered");
        address _addr = vm.addr(2);
        spotlight.getPostsOfAddress(_addr);
    }

    function testUnregisteredUserCannotGetPostsOfAnotherUser() public {
        vm.startPrank(wallet.addr);
        spotlight.registerProfile("username");
        spotlight.createPost("post", signContentViaWallet(wallet, "post"));
        vm.stopPrank();

        address _addr = vm.addr(2);
        vm.startPrank(_addr);
        vm.expectRevert("Profile does not exist");
        spotlight.getPostsOfAddress(wallet.addr);
    }

    function testUnregisteredUserCannotSeePostsOfACommunity() public {
        vm.startPrank(wallet.addr);
        spotlight.registerProfile("username");
        spotlight.createPost("post", signContentViaWallet(wallet, "post"));
        vm.stopPrank();

        address _addr = vm.addr(2);
        vm.startPrank(_addr);
        vm.expectRevert("Profile does not exist");
        spotlight.getCommunityPosts();
    }
}
