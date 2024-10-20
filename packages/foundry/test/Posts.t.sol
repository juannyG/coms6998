// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/Spotlight.sol";
import "../contracts/Events.sol";

contract PostManagementTest is Test {
    Spotlight public spotlight;

    function setUp() public {
        spotlight = new Spotlight(vm.addr(1));
    }

    function testCannotCreatePostIfAddressNotRegistered() public {
        vm.expectRevert("Profile does not exist");
        spotlight.createPost("Hello, world!", "not a sig");
    }

    function testRegisteredAddressCanCreatePostAndEmitsAPostCreatedEvent() public {
        address user = vm.addr(1);
        vm.prank(user);
        spotlight.registerProfile("Username");

        vm.expectEmit();
        emit PostCreated(user, "TODO sig");
        vm.prank(user);
        spotlight.createPost("Hello, world!", "TODO sig");
    }

    function testSignatureThatCannotBeVerifiedIsRejected() public {}
    function testEmptySignatureIsRejected() public {}
    function testEmptyPostIsRejected() public {}
    function testPostCanBeRetrievedBySignature() public {}
    function testUserCanGetListOfTheirPosts() public {}
    function testUserCanGetListOfAllPosts() public {}
}
