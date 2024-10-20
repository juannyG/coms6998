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
        spotlight.createPost("Hello, world!");
    }

    function testRegisteredAddressCanCreatePostAndEmitsAPostCreatedEvent() public {
        address user = vm.addr(1);
        vm.prank(user);
        spotlight.registerProfile("Username");

        vm.prank(user);
        spotlight.createPost("Hello, world!");

        vm.expectEmit(true, true, false, true);
        emit PostCreated(user, "Hello, world!");
        vm.prank(user);
        spotlight.createPost("Hello, world!");
    }

    // TODO: check storage of post
    // How though? Need a way to provide a pointer to posts that can be stored
    // in different data structures --- aka a foreign key
}

