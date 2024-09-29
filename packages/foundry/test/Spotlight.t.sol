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

  function testCannotRegisterEmptyUsername() public {
      vm.expectRevert();
      spotlight.registerProfile("");
  }

  function testCannotRegisterUsernameMoreThan32bytes() public {
      // NOTE: bytes vs chars is important distinction...
      vm.expectRevert();
      spotlight.registerProfile("abcdefghijklmnopqrstuvwxyz-abcdefg");
  }

  function testCannotRegisterIfUsernameAlreadyExists_CaseInsensitive() public {
      address first_u = vm.addr(1);
      vm.prank(first_u);
      spotlight.registerProfile("userNAME1");

      address second_u = vm.addr(2);
      vm.prank(second_u);
      vm.expectRevert();
      spotlight.registerProfile("USERname1");
  }
}
