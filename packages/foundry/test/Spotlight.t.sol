// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/Spotlight.sol";

contract SpotlightTest is Test {
  Spotlight public spotlight;

  function setUp() public {
    spotlight = new Spotlight(vm.addr(1));
  }

  function testDeploymentState() public view {
    assertEq(vm.addr(1), spotlight.owner());
  }

  function testCannotGetProfileIfNotRegistered() public {
    vm.expectRevert();
    spotlight.getProfile(vm.addr(2));
  }

  function testRegisterNewUser() public {
    address newUser = vm.addr(2);
    vm.prank(newUser);
    spotlight.registerProfile("newUser");

    assertEq("newUser", spotlight.getProfile(newUser));
  }
}
