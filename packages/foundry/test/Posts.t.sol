// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "../contracts/Spotlight.sol";
import "../contracts/Events.sol";
import "../contracts/PostLib.sol";

contract PostManagementTest is Test {
  Spotlight public spotlight;
  Vm.Wallet public wallet;

  function setUp() public {
    spotlight = new Spotlight(vm.addr(1));
    wallet = vm.createWallet(1);
  }

  function createTestPost() internal pure returns (PostLib.Post memory) {
    PostLib.Post memory p;
    p.content = "Hello, world!";
    p.title = "Title";
    p.nonce = 123;
    return p;
  }

  function createTestPost(string memory content) internal pure returns (PostLib.Post memory) {
    PostLib.Post memory p = createTestPost();
    p.content = content;
    return p;
  }

  function signContentViaWallet(Vm.Wallet memory _w, PostLib.Post memory _p) internal returns (bytes memory) {
    bytes32 data_hash = MessageHashUtils.toEthSignedMessageHash(PostLib.abiEncodePost(_p.title, _p.content, _p.nonce));
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(_w, data_hash);
    bytes memory signature = abi.encodePacked(r, s, v);
    return signature;
  }

  function testCannotCreatePostIfAddressNotRegistered() public {
    vm.expectRevert("Profile does not exist");
    PostLib.Post memory p = createTestPost();
    spotlight.createPost(p.title, p.content, p.nonce, "not a sig");
  }

  function testRegisteredAddressCanCreatePostAndEmitsAPostCreatedEvent() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("Username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);

    vm.expectEmit();
    emit PostCreated(wallet.addr, signature);
    spotlight.createPost(post.title, post.content, post.nonce, signature);
  }

  function testSignatureThatCannotBeVerifiedResultsInRevertingPostCreation() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    vm.expectRevert("Invalid signature");
    PostLib.Post memory p = createTestPost();
    spotlight.createPost(p.title, p.content, p.nonce, "Fake signature");
  }

  function testCreatePostWithEmptyContentIsRejected() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory p = createTestPost();
    p.content = "";
    vm.expectRevert("Content cannot be empty");
    spotlight.createPost(p.title, p.content, p.nonce, "Sig won't be checked here");
  }

  function testCreatePostWithEmptyTitleIsRejected() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory p = createTestPost();
    p.title = "";
    vm.expectRevert("Title cannot be empty");
    spotlight.createPost(p.title, p.content, p.nonce, "Sig won't be checked here");
  }

  function testPostCanBeRetrievedBySignature() public {
    vm.startPrank(wallet.addr);
    PostLib.Post memory p1 = createTestPost("1");
    PostLib.Post memory p2 = createTestPost("2");
    PostLib.Post memory p3 = createTestPost("3");
    spotlight.registerProfile("username");
    spotlight.createPost(p1.title, p1.content, p1.nonce, signContentViaWallet(wallet, p1));
    spotlight.createPost(p2.title, p2.content, p2.nonce, signContentViaWallet(wallet, p2));
    spotlight.createPost(p3.title, p3.content, p3.nonce, signContentViaWallet(wallet, p3));

    PostLib.Post memory retreivedP2 = spotlight.getPost(signContentViaWallet(wallet, p2));
    assertEq("2", string(retreivedP2.content));
    assertEq(wallet.addr, retreivedP2.creator);
    assertEq(signContentViaWallet(wallet, p2), retreivedP2.id);
  }

  function testGettingNonexistentPostReverts() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    vm.expectRevert("Requested post not found");
    spotlight.getPost(bytes("sig-does-not-exist"));
  }

  function testUserCanGetListOfSpecificUserPosts() public {
    Vm.Wallet memory _w = vm.createWallet(100);
    PostLib.Post memory _wPost = createTestPost("_w");
    vm.startPrank(_w.addr);
    spotlight.registerProfile("_w");
    spotlight.createPost(_wPost.title, _wPost.content, _wPost.nonce, signContentViaWallet(_w, _wPost));
    vm.stopPrank();

    PostLib.Post memory p0 = createTestPost("0");
    PostLib.Post memory p1 = createTestPost("1");
    PostLib.Post memory p2 = createTestPost("2");
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");
    spotlight.createPost(p0.title, p0.content, p0.nonce, signContentViaWallet(wallet, p0));
    spotlight.createPost(p1.title, p1.content, p1.nonce, signContentViaWallet(wallet, p1));
    spotlight.createPost(p2.title, p2.content, p2.nonce, signContentViaWallet(wallet, p2));

    PostLib.Post[] memory posts = spotlight.getPostsOfAddress(wallet.addr);
    assertEq(3, posts.length);

    // NOTE: These assertions will need to be updated when we start "sorting" by latest posts
    assertEq(wallet.addr, posts[0].creator);
    assertEq(wallet.addr, posts[1].creator);
    assertEq(wallet.addr, posts[2].creator);

    assertEq("0", string(posts[0].content));
    assertEq("1", string(posts[1].content));
    assertEq("2", string(posts[2].content));

    assertEq(signContentViaWallet(wallet, p0), posts[0].id);
    assertEq(signContentViaWallet(wallet, p1), posts[1].id);
    assertEq(signContentViaWallet(wallet, p2), posts[2].id);

    // We can also get the post of the first user, right?
    posts = spotlight.getPostsOfAddress(_w.addr);
    assertEq(1, posts.length);
    assertEq(_w.addr, posts[0].creator);
    assertEq("_w", posts[0].content);
    assertEq(signContentViaWallet(_w, _wPost), posts[0].id);

    assertTrue(PostLib.isValidPostSignature(_w.addr, posts[0].title, posts[0].content, posts[0].nonce, posts[0].id));
  }

  function testUserCanGetListOfAllPostsInCommunity() public {
    // Create 3 wallets and for each wallet, register and create a post
    Vm.Wallet[] memory wallets = new Vm.Wallet[](3);

    // NOTE: Cannot create a wallet @ address 0
    PostLib.Post memory p0 = createTestPost("0");
    wallets[0] = vm.createWallet(10);
    vm.startPrank(wallets[0].addr);
    spotlight.registerProfile("0");
    spotlight.createPost(p0.title, p0.content, p0.nonce, signContentViaWallet(wallets[0], p0));
    vm.stopPrank();

    PostLib.Post memory p1 = createTestPost("1");
    wallets[1] = vm.createWallet(11);
    vm.startPrank(wallets[1].addr);
    spotlight.registerProfile("1");
    spotlight.createPost(p1.title, p1.content, p1.nonce, signContentViaWallet(wallets[1], p1));
    vm.stopPrank();

    PostLib.Post memory p2 = createTestPost("2");
    wallets[2] = vm.createWallet(12);
    vm.startPrank(wallets[2].addr);
    spotlight.registerProfile("2");
    spotlight.createPost(p2.title, p2.content, p2.nonce, signContentViaWallet(wallets[2], p2));
    vm.stopPrank();

    // We're expecting 3 posts to be returned
    vm.startPrank(wallets[0].addr);
    PostLib.Post[] memory posts = spotlight.getCommunityPosts();
    assertEq(3, posts.length);

    assertEq(wallets[0].addr, posts[0].creator);
    assertEq(wallets[1].addr, posts[1].creator);
    assertEq(wallets[2].addr, posts[2].creator);

    assertEq(signContentViaWallet(wallets[0], p0), posts[0].id);
    assertEq(signContentViaWallet(wallets[1], p1), posts[1].id);
    assertEq(signContentViaWallet(wallets[2], p2), posts[2].id);

    assertEq("0", posts[0].content);
    assertEq("1", posts[1].content);
    assertEq("2", posts[2].content);
  }

  function testGettingPostsOfUnregisteredUserReverts() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    vm.expectRevert("Requested address is not registered");
    address _addr = vm.addr(2);
    spotlight.getPostsOfAddress(_addr);
  }

  function testUnregisteredUserCannotGetPostsOfAnotherUser() public {
    PostLib.Post memory p = createTestPost();
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");
    spotlight.createPost(p.title, p.content, p.nonce, signContentViaWallet(wallet, p));
    vm.stopPrank();

    address _addr = vm.addr(2);
    vm.startPrank(_addr);
    vm.expectRevert("Profile does not exist");
    spotlight.getPostsOfAddress(wallet.addr);
  }

  function testUnregisteredUserCannotSeePostsOfACommunity() public {
    PostLib.Post memory p = createTestPost();
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");
    spotlight.createPost(p.title, p.content, p.nonce, signContentViaWallet(wallet, p));
    vm.stopPrank();

    address _addr = vm.addr(2);
    vm.startPrank(_addr);
    vm.expectRevert("Profile does not exist");
    spotlight.getCommunityPosts();
  }

  function testUserCanEditPostSuccess() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature);

    vm.expectEmit();
    emit PostEdited(wallet.addr, signature);
    spotlight.editPost(signature, "Updated content");

    PostLib.Post memory editedPost = spotlight.getPost(signature);
    assertEq(editedPost.content, "Updated content");
    assertEq(editedPost.lastUpdatedAt, block.timestamp); // Ensure the timestamp was updated
    vm.stopPrank();
  }

  function testCannotEditPostIfNotCreator() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature);
    vm.stopPrank();

    address otherUser = vm.addr(2);
    vm.startPrank(otherUser);
    spotlight.registerProfile("username2");
    vm.expectRevert("Only the creator can edit this post");
    spotlight.editPost(signature, "Updated content by another user");
    vm.stopPrank();
  }

  function testCannotEditEmptyPost() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature);

    vm.expectRevert("Content cannot be empty");
    spotlight.editPost(signature, "");
    vm.stopPrank();
  }

  function testUserCanDeletePost() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature);

    vm.expectEmit();
    emit PostDeleted(wallet.addr, signature);
    spotlight.deletePost(signature);

    vm.expectRevert("Requested post not found");
    spotlight.getPost(signature);
    vm.stopPrank();
  }

  function testCannotDeletePostIfNotCreator() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature);
    vm.stopPrank();

    address otherUser = vm.addr(2);
    vm.startPrank(otherUser);
    spotlight.registerProfile("username2");
    vm.expectRevert("Only the creator can delete this post");
    spotlight.deletePost(signature);

    vm.stopPrank();
  }
}
