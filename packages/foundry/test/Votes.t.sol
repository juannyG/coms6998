// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/Spotlight.sol";
import "../contracts/Events.sol";
import "../contracts/PostLib.sol";
import "../contracts/Error.sol";

contract VotesTest is Test {
  Spotlight public spotlight;
  Vm.Wallet public wallet1;
  Vm.Wallet public wallet2;
  bytes public postSig;

  function setUp() public {
    spotlight = new Spotlight(vm.addr(1));
    wallet1 = vm.createWallet(1);
    wallet2 = vm.createWallet(2);

    PostLib.Post memory post;
    post.content = "Hello, world!";
    post.title = "Title";
    post.nonce = 123;

    bytes memory encodedPost = PostLib.abiEncodePost(post.title, post.content, post.nonce);
    bytes32 data_hash = MessageHashUtils.toEthSignedMessageHash(encodedPost);
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(wallet1, data_hash);
    postSig = abi.encodePacked(r, s, v);

    vm.startPrank(wallet1.addr);
    spotlight.registerProfile("username");
    spotlight.createPost(post.title, post.content, post.nonce, postSig);
    vm.stopPrank();
  }

  ////////////////////////////////
  // UPVOTE TESTS
  ////////////////////////////////
  function testNonRegisteredUserCannotUpvoteAPost() public {
    vm.startPrank(wallet2.addr);
    vm.expectRevert(ProfileNotExist.selector);
    spotlight.upvote(postSig);
  }

  function testSpotlightEmitsEventWhenAUserUpvotesAPost() public {
    vm.startPrank(wallet2.addr);
    spotlight.registerProfile("u2");

    vm.expectEmit();
    emit PostUpvoted(wallet2.addr, postSig);
    spotlight.upvote(postSig);
  }

  function testSpotlightTracksWhenAUserUpvotesAPost() public {
    vm.startPrank(wallet2.addr);
    spotlight.registerProfile("u2");
    assertFalse(spotlight.upvotedBy(postSig, wallet2.addr));
    spotlight.upvote(postSig);
    assertTrue(spotlight.upvotedBy(postSig, wallet2.addr));
  }

  function testPostMetadataUpdatesUpvoteCounts() public {
    vm.startPrank(wallet2.addr);
    spotlight.registerProfile("u2");
    PostLib.Post memory p = spotlight.getPost(postSig);
    assertEq(0, p.upvoteCount);

    spotlight.upvote(postSig);
    p = spotlight.getPost(postSig); // refresh data from contract
    assertEq(1, p.upvoteCount);
  }

  function testWhenAUserUpvotesAPostASecondTimeItUndoesTheFirstUpvote() public {
    vm.startPrank(wallet2.addr);
    spotlight.registerProfile("u2");
    PostLib.Post memory p = spotlight.getPost(postSig);

    spotlight.upvote(postSig);
    p = spotlight.getPost(postSig); // refresh data from contract
    assertEq(1, p.upvoteCount);
    assertTrue(spotlight.upvotedBy(postSig, wallet2.addr));

    // This should undo the upvote
    spotlight.upvote(postSig);
    p = spotlight.getPost(postSig); // refresh data from contract
    assertEq(0, p.upvoteCount);
    assertFalse(spotlight.upvotedBy(postSig, wallet2.addr));
  }

  ////////////////////////////////
  // DOWNVOTE TESTS
  ////////////////////////////////
  function testNonRegisteredUserCannotDownvoteAPost() public {
    vm.startPrank(wallet2.addr);
    vm.expectRevert(ProfileNotExist.selector);
    spotlight.downvote(postSig);
  }

  function testSpotlightTracksWhenAUserDownvotesAPost() public {
    vm.startPrank(wallet2.addr);
    spotlight.registerProfile("u2");
    assertFalse(spotlight.downvotedBy(postSig, wallet2.addr));
    spotlight.downvote(postSig);
    assertTrue(spotlight.downvotedBy(postSig, wallet2.addr));
  }

  function testPostMetadataUpdatesDownvoteCounts() public {
    vm.startPrank(wallet2.addr);
    spotlight.registerProfile("u2");
    PostLib.Post memory p = spotlight.getPost(postSig);
    assertEq(0, p.downvoteCount);

    spotlight.downvote(postSig);
    p = spotlight.getPost(postSig); // refresh data from contract
    assertEq(1, p.downvoteCount);
  }

  function testWhenAUserDownvotesAPostASecondTimeItUndoesTheFirstDownvote() public {
    vm.startPrank(wallet2.addr);
    spotlight.registerProfile("u2");
    PostLib.Post memory p = spotlight.getPost(postSig);

    spotlight.downvote(postSig);
    p = spotlight.getPost(postSig); // refresh data from contract
    assertEq(1, p.downvoteCount);
    assertTrue(spotlight.downvotedBy(postSig, wallet2.addr));

    spotlight.downvote(postSig);
    p = spotlight.getPost(postSig); // refresh data from contract
    assertEq(0, p.downvoteCount);
    assertFalse(spotlight.downvotedBy(postSig, wallet2.addr));
  }

  ////////////////////////////////
  // MIXED UP & DOWNVOTE TESTS
  ////////////////////////////////
  function testAnUpvoteWillUndoAPreviousDownvote() public {
    vm.startPrank(wallet2.addr);
    spotlight.registerProfile("u2");
    spotlight.downvote(postSig);
    PostLib.Post memory p = spotlight.getPost(postSig);
    assertEq(1, p.downvoteCount);
    assertEq(0, p.upvoteCount);
    assertTrue(spotlight.downvotedBy(postSig, wallet2.addr));
    assertFalse(spotlight.upvotedBy(postSig, wallet2.addr));

    spotlight.upvote(postSig);
    p = spotlight.getPost(postSig); // refresh data from contract
    assertEq(0, p.downvoteCount);
    assertEq(1, p.upvoteCount);
    assertFalse(spotlight.downvotedBy(postSig, wallet2.addr));
    assertTrue(spotlight.upvotedBy(postSig, wallet2.addr));

    spotlight.downvote(postSig);
    p = spotlight.getPost(postSig); // refresh data from contract
    assertEq(1, p.downvoteCount);
    assertEq(0, p.upvoteCount);
    assertTrue(spotlight.downvotedBy(postSig, wallet2.addr));
    assertFalse(spotlight.upvotedBy(postSig, wallet2.addr));
  }
}
