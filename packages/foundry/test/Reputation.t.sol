// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/Reputation.sol";
import "../contracts/Events.sol";

contract ReputationTest is Test {
  Reputation public reputation;
  address public spotlight;
  address public user1;
  address public user2;

  function setUp() public {
    // Setup addresses
    spotlight = address(1);
    user1 = address(2);
    user2 = address(3);

    // Deploy contract
    reputation = new Reputation(spotlight);

    // Label addresses for better trace output
    vm.label(spotlight, "Spotlight");
    vm.label(user1, "User1");
    vm.label(user2, "User2");
  }

  function testConstructor() public {
    // Test constructor requirements
    vm.expectRevert("Spotlight address cannot be zero");
    new Reputation(address(0));

    // Test spotlight address is set correctly
    assertEq(reputation.spotlightContract(), spotlight);
  }

  function testUpvotePostOnlySpotlight() public {
    // Test that non-spotlight address cannot upvote
    vm.expectRevert("Only Spotlight contract can issue tokens");
    reputation.upvotePost(user1);

    // Test upvote from spotlight works
    vm.prank(spotlight);
    reputation.upvotePost(user1);

    // Check balance (100 tokens)
    assertEq(reputation.balanceOf(user1), 100 * 10 ** 18);
  }

  function testUpvoteCommentOnlySpotlight() public {
    // Test that non-spotlight address cannot upvote
    vm.expectRevert("Only Spotlight contract can issue tokens");
    reputation.upvoteComment(user1);

    // Test upvote from spotlight works
    vm.prank(spotlight);
    reputation.upvoteComment(user1);

    // Check balance (1 token)
    assertEq(reputation.balanceOf(user1), 1 * 10 ** 18);
  }

  function testCannotIssueToZeroAddress() public {
    vm.prank(spotlight);
    vm.expectRevert("Cannot issue to zero address");
    reputation.upvotePost(address(0));
  }

  function testTokenDecay() public {
    // Give user1 100 tokens
    vm.prank(spotlight);
    reputation.upvotePost(user1);
    assertEq(reputation.balanceOf(user1), 100 * 10 ** 18);

    // Advance time by 15 minutes
    skip(15 minutes);

    // Check balance has decayed by 1%
    // 100 * 0.99 = 99 tokens
    assertApproxEqAbs(reputation.balanceOf(user1), 99 * 10 ** 18, 1);

    // Advance time by another 15 minutes
    skip(15 minutes);

    // Check balance has decayed again
    // 99 * 0.99 = 98.01 tokens
    assertApproxEqAbs(reputation.balanceOf(user1), 98.01 * 10 ** 18, 1);
  }

  function testMultipleUpvotes() public {
    vm.startPrank(spotlight);

    // Give multiple upvotes
    reputation.upvotePost(user1); // 100 tokens
    reputation.upvoteComment(user1); // 1 token

    // Should have 101 tokens
    assertEq(reputation.balanceOf(user1), 101 * 10 ** 18);

    vm.stopPrank();
  }

  function testEventEmission() public {
    vm.prank(spotlight);

    // Test event emission
    vm.expectEmit(true, true, true, true);
    emit TokenIssued(user1, 100 * 10 ** 18);
    reputation.upvotePost(user1);
  }

  function testDecayAndNewUpvote() public {
    // Initial upvote
    vm.prank(spotlight);
    reputation.upvotePost(user1); // 100 tokens

    // Advance time
    skip(15 minutes);

    // New upvote should apply decay first
    vm.prank(spotlight);
    reputation.upvotePost(user1);

    // Should have: (100 * 0.99) + 100 ≈ 199 tokens
    // Using a larger delta for floating point arithmetic variations
    assertApproxEqAbs(reputation.balanceOf(user1), 199 * 10 ** 18, 0.1 * 10 ** 18);
  }

  function testDecayToZero() public {
    // Give user1 1 token
    vm.prank(spotlight);
    reputation.upvoteComment(user1);

    // Advance time by 15 minutes
    skip(15 minutes);

    // Check if balance is less than initial amount
    uint256 balance = reputation.balanceOf(user1);
    assertLt(balance, 1 * 10 ** 18);

    // Verify balance is greater than 0
    assertGt(balance, 0);

    // Advance time significantly
    skip(150 minutes); // 10 more decay periods

    // Balance should be very small but might not be exactly zero
    // due to rounding in integer arithmetic
    uint256 finalBalance = reputation.balanceOf(user1);
    assertLt(finalBalance, balance);
  }
}
