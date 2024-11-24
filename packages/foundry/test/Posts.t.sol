// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "../contracts/Spotlight.sol";
import "../contracts/Events.sol";
import "../contracts/PostLib.sol";
import "../contracts/Error.sol";
import "../contracts/Posts.sol";

// Set of tests to validate certain calls can only be made from certain addresses
contract PostContractCallerValidationTest is Test {
  function testPostsContractRevertsIfSpotlightAddressIsZero() public {
    vm.expectRevert(SpotlightAddressCannotBeZero.selector);
    new Posts(address(0), address(0));
  }

  function testPostsContractRevertsIfReputationAddressIsZero() public {
    vm.expectRevert(ReputationAddressCannotBeZero.selector);
    new Posts(vm.addr(1), address(0));
  }

  function testNonSpotlightAddrCannotCreatePost() public {
    Posts pContract = new Posts(vm.addr(1), vm.addr(1));
    vm.expectRevert(OnlySpotlightCanManagePosts.selector);
    pContract.createPost(vm.addr(1), "title", "content", 1, "sig", false);
  }

  function testNonSpotlightAddrCannotEditPost() public {
    Posts pContract = new Posts(vm.addr(1), vm.addr(1));
    vm.expectRevert(OnlySpotlightCanManagePosts.selector);
    pContract.editPost(vm.addr(1), "id", "newContent");
  }

  function testNonSpotlightAddrCannotDeletePost() public {
    Posts pContract = new Posts(vm.addr(1), vm.addr(1));
    vm.expectRevert(OnlySpotlightCanManagePosts.selector);
    pContract.deletePost(vm.addr(1), "id");
  }

  function testNonSpotlightAddrCannotDeleteProfile() public {
    Posts pContract = new Posts(vm.addr(1), vm.addr(1));
    vm.expectRevert(OnlySpotlightCanManagePosts.selector);
    pContract.deleteProfile(vm.addr(1));
  }

  function testNonSpotlightAddrCannotUpvote() public {
    Posts pContract = new Posts(vm.addr(1), vm.addr(1));
    vm.expectRevert(OnlySpotlightCanManagePosts.selector);
    pContract.upvote(vm.addr(1), "id");
  }

  function testNonSpotlightAddrCannotDownVote() public {
    Posts pContract = new Posts(vm.addr(1), vm.addr(1));
    vm.expectRevert(OnlySpotlightCanManagePosts.selector);
    pContract.downvote(vm.addr(1), "id");
  }

  function testNonSpotlightAddrCannotAddComment() public {
    Posts pContract = new Posts(vm.addr(1), vm.addr(1));
    vm.expectRevert(OnlySpotlightCanManagePosts.selector);
    pContract.addComment(vm.addr(1), "id", "comment");
  }

  function testNonSpotlightAddrCannotPurchasePost() public {
    Posts pContract = new Posts(vm.addr(1), vm.addr(1));
    vm.expectRevert(OnlySpotlightCanManagePosts.selector);
    pContract.purchasePost(vm.addr(1), "id", "pubkey");
  }

  function testNonSpotlightAddrCannotDeclinePurchase() public {
    Posts pContract = new Posts(vm.addr(1), vm.addr(1));
    vm.expectRevert(OnlySpotlightCanManagePosts.selector);
    pContract.declinePurchase(vm.addr(1), "id", payable(vm.addr(1)));
  }
}

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
    vm.expectRevert(ProfileNotExist.selector);
    PostLib.Post memory p = createTestPost();
    spotlight.createPost(p.title, p.content, p.nonce, "not a sig", false);
  }

  function testRegisteredAddressCanCreatePostAndEmitsAPostCreatedEvent() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("Username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);

    vm.expectEmit();
    emit PostCreated(wallet.addr, signature);
    spotlight.createPost(post.title, post.content, post.nonce, signature, false);
  }

  function testSignatureThatCannotBeVerifiedResultsInRevertingPostCreation() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    vm.expectRevert(InvalidSignature.selector);
    PostLib.Post memory p = createTestPost();
    spotlight.createPost(p.title, p.content, p.nonce, "Fake signature", false);
  }

  function testCreatePostWithEmptyContentIsRejected() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory p = createTestPost();
    p.content = "";
    vm.expectRevert(ContentCannotBeEmpty.selector);
    spotlight.createPost(p.title, p.content, p.nonce, "Sig won't be checked here", false);
  }

  function testCreatePostWithEmptyTitleIsRejected() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory p = createTestPost();
    p.title = "";
    vm.expectRevert(TitleCannotBeEmpty.selector);
    spotlight.createPost(p.title, p.content, p.nonce, "Sig won't be checked here", false);
  }

  function testPostCanBeRetrievedBySignature() public {
    vm.startPrank(wallet.addr);
    PostLib.Post memory p1 = createTestPost("1");
    PostLib.Post memory p2 = createTestPost("2");
    PostLib.Post memory p3 = createTestPost("3");
    spotlight.registerProfile("username");
    spotlight.createPost(p1.title, p1.content, p1.nonce, signContentViaWallet(wallet, p1), false);
    spotlight.createPost(p2.title, p2.content, p2.nonce, signContentViaWallet(wallet, p2), false);
    spotlight.createPost(p3.title, p3.content, p3.nonce, signContentViaWallet(wallet, p3), false);

    PostLib.Post memory retreivedP2 = spotlight.getPost(signContentViaWallet(wallet, p2));
    assertEq("2", string(retreivedP2.content));
    assertEq(wallet.addr, retreivedP2.creator);
    assertEq(signContentViaWallet(wallet, p2), retreivedP2.id);
    assertFalse(retreivedP2.paywalled);
  }

  function testGettingNonexistentPostReverts() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    vm.expectRevert(PostNotFound.selector);
    spotlight.getPost(bytes("sig-does-not-exist"));
  }

  function testUserCanGetListOfSpecificUserPosts() public {
    Vm.Wallet memory _w = vm.createWallet(100);
    PostLib.Post memory _wPost = createTestPost("_w");
    vm.startPrank(_w.addr);
    spotlight.registerProfile("_w");
    spotlight.createPost(_wPost.title, _wPost.content, _wPost.nonce, signContentViaWallet(_w, _wPost), false);
    vm.stopPrank();

    PostLib.Post memory p0 = createTestPost("0");
    PostLib.Post memory p1 = createTestPost("1");
    PostLib.Post memory p2 = createTestPost("2");
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");
    spotlight.createPost(p0.title, p0.content, p0.nonce, signContentViaWallet(wallet, p0), false);
    spotlight.createPost(p1.title, p1.content, p1.nonce, signContentViaWallet(wallet, p1), false);
    spotlight.createPost(p2.title, p2.content, p2.nonce, signContentViaWallet(wallet, p2), false);

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
    spotlight.createPost(p0.title, p0.content, p0.nonce, signContentViaWallet(wallets[0], p0), false);
    vm.stopPrank();

    PostLib.Post memory p1 = createTestPost("1");
    wallets[1] = vm.createWallet(11);
    vm.startPrank(wallets[1].addr);
    spotlight.registerProfile("1");
    spotlight.createPost(p1.title, p1.content, p1.nonce, signContentViaWallet(wallets[1], p1), false);
    vm.stopPrank();

    PostLib.Post memory p2 = createTestPost("2");
    wallets[2] = vm.createWallet(12);
    vm.startPrank(wallets[2].addr);
    spotlight.registerProfile("2");
    spotlight.createPost(p2.title, p2.content, p2.nonce, signContentViaWallet(wallets[2], p2), false);
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

    vm.expectRevert(AddressNotRegistered.selector);
    address _addr = vm.addr(2);
    spotlight.getPostsOfAddress(_addr);
  }

  function testUserCanEditPostSuccess() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, false);

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
    spotlight.createPost(post.title, post.content, post.nonce, signature, false);
    vm.stopPrank();

    address otherUser = vm.addr(2);
    vm.startPrank(otherUser);
    spotlight.registerProfile("username2");
    vm.expectRevert(OnlyCreatorCanEdit.selector);
    spotlight.editPost(signature, "Updated content by another user");
    vm.stopPrank();
  }

  function testCannotEditEmptyPost() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, false);

    vm.expectRevert(ContentCannotBeEmpty.selector);
    spotlight.editPost(signature, "");
    vm.stopPrank();
  }

  function testUserCanDeletePost() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, false);

    vm.expectEmit();
    emit PostDeleted(wallet.addr, signature);
    spotlight.deletePost(signature);

    vm.expectRevert(PostNotFound.selector);
    spotlight.getPost(signature);
    vm.stopPrank();
  }

  function testCannotDeletePostIfNotCreator() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, false);
    vm.stopPrank();

    address otherUser = vm.addr(2);
    vm.startPrank(otherUser);
    spotlight.registerProfile("username2");
    vm.expectRevert(OnlyCreatorCanEdit.selector);
    spotlight.deletePost(signature);

    vm.stopPrank();
  }

  function testDeletingProfileDeletesUsersPost() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, false);
    vm.stopPrank();

    address otherUser = vm.addr(2);
    vm.startPrank(otherUser);
    spotlight.registerProfile("username2");
    PostLib.Post[] memory communityPosts = spotlight.getCommunityPosts();
    assertEq(1, communityPosts.length);
    vm.stopPrank();

    vm.startPrank(wallet.addr);
    spotlight.deleteProfile();
    vm.stopPrank();

    vm.startPrank(otherUser);
    communityPosts = spotlight.getCommunityPosts();
    assertEq(0, communityPosts.length);
    vm.stopPrank();
  }

  function testAddAndGetComments() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, false);

    // Add multiple comments
    spotlight.addComment(signature, "First comment.");
    spotlight.addComment(signature, "Second comment.");
    vm.stopPrank();

    // Verify the comments
    PostLib.Comment[] memory comments = spotlight.getComments(signature);
    assertEq(comments.length, 2, "Expected 2 comments");

    assertEq(comments[0].commenter, wallet.addr, "First comment: commenter mismatch");
    assertEq(comments[0].content, "First comment.", "First comment: content mismatch");

    assertEq(comments[1].commenter, wallet.addr, "Second comment: commenter mismatch");
    assertEq(comments[1].content, "Second comment.", "Second comment: content mismatch");
  }

  function testCannotAddEmptyComment() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, false);

    vm.expectRevert(CommentCannotBeEmpty.selector);
    spotlight.addComment(signature, "");
  }

  function testCannotPurchasePostIfPostDoesNotExist() public {
    startHoax(wallet.addr);
    spotlight.registerProfile("username");

    vm.expectRevert(PostNotFound.selector);
    spotlight.purchasePost{ value: 1 ether }("does-not-exist", "pubkey");
  }

  function testCannotPurchasePostIfNotRegistered() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, true);
    vm.stopPrank();

    vm.startPrank(vm.addr(2));
    vm.expectRevert(ProfileNotExist.selector);
    spotlight.purchasePost(signature, "pubkey");
  }

  function testCannotPurchasePostIfPostIsNotPaywalled() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, false);
    vm.stopPrank();

    address otherUser = vm.addr(2);
    startHoax(otherUser);
    spotlight.registerProfile("username2");
    vm.expectRevert(PostNotPaywalled.selector);
    spotlight.purchasePost{ value: 1 ether }(signature, "pubkey");
  }

  function testCreatorCannotPayForTheirOwnContent() public {
    startHoax(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, true);
    vm.expectRevert(CreatorCannotPayForOwnContent.selector);
    spotlight.purchasePost{ value: 1 ether }(signature, "pubkey");
  }

  function testUserCannotPurchasePostWithoutProperFunds() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, true);

    address otherUser = vm.addr(2);
    vm.startPrank(otherUser);
    spotlight.registerProfile("username2");
    vm.expectRevert(InsufficentPostFunds.selector);
    spotlight.purchasePost(signature, "pubkey");
  }

  function testUserCannotDoublePurchaseAPost() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, true);

    address otherUser = vm.addr(2);
    startHoax(otherUser); // prank, but w/ a balance
    spotlight.registerProfile("username2");

    vm.expectEmit();
    emit PostPurchased(otherUser, signature);
    spotlight.purchasePost{ value: 1 ether }(signature, "pubkey");
    assertTrue(spotlight.isPurchasePending(signature));

    vm.expectRevert(PostAlreadyPurchased.selector);
    spotlight.purchasePost{ value: 1 ether }(signature, "pubkey");
  }

  function testCannotDeclinePurchaseIfNotRegistered() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, true);
    vm.stopPrank();

    vm.startPrank(vm.addr(2));
    vm.expectRevert(ProfileNotExist.selector);
    spotlight.declinePurchase("id", payable(vm.addr(2)));
  }

  function testCannotDeclinePurchaseIfPostDoesNotExist() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    vm.expectRevert(PostNotFound.selector);
    spotlight.declinePurchase("id", payable(wallet.addr));
  }

  function testOnlyPostCreatorCanDeclinePurchase() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, true);
    vm.stopPrank();

    address purchaser = vm.addr(2);
    startHoax(purchaser); // prank, but w/ a balance
    spotlight.registerProfile("username2");
    spotlight.purchasePost{ value: 1 ether }(signature, "pubkey");
    vm.stopPrank();

    vm.startPrank(vm.addr(3));
    spotlight.registerProfile("username3");
    vm.expectRevert(OnlyCreatorCanDeclinePurchase.selector);
    spotlight.declinePurchase(signature, payable(vm.addr(2)));
  }

  function testCannotDeclinePurchaseIfPostNotPaywalled() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, false);

    vm.expectRevert(PostNotPaywalled.selector);
    spotlight.declinePurchase(signature, payable(vm.addr(2)));
  }

  function testCannotDeclinePurchaseIfPurchaseNotPending() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, true);

    vm.expectRevert(NoPendingPurchaseFound.selector);
    spotlight.declinePurchase(signature, payable(vm.addr(2)));
  }

  function testFundTransfersWhenCreatorDeclinesPurchase() public {
    vm.startPrank(wallet.addr);
    spotlight.registerProfile("username");

    PostLib.Post memory post = createTestPost();
    bytes memory signature = signContentViaWallet(wallet, post);
    spotlight.createPost(post.title, post.content, post.nonce, signature, true);

    address purchaser = vm.addr(2);
    startHoax(purchaser); // prank, but w/ a balance
    spotlight.registerProfile("username2");

    // After paying for post, Spotlight holds balance
    uint256 startingBalance = purchaser.balance;
    spotlight.purchasePost{ value: 1 ether }(signature, "pubkey");
    assertTrue(spotlight.isPurchasePending(signature));
    assertEq(startingBalance - spotlight.PAYWALL_COST(), purchaser.balance);
    assertEq(spotlight.PAYWALL_COST(), address(spotlight).balance);
    vm.stopPrank();

    // After declining, Spotlight releases balance back to purchaser
    vm.startPrank(wallet.addr);
    spotlight.declinePurchase(signature, payable(purchaser));
    assertEq(startingBalance, purchaser.balance);
  }
}
