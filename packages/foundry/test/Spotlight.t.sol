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
    spotlight.registerProfile("testUser", "Hi, I am a software engineer at CU", "New York, NY", 25);

     // Retrieve the profile
     // Retrieve the Profile struct
    Spotlight.Profile memory profile = spotlight.getProfile(newUser);

    // Check each field of the Profile struct
    assertEq(profile.username, "testUser");
    assertEq(profile.bio, "Hi, I am a software engineer at CU");
    assertEq(profile.location, "New York, NY");
    assertEq(profile.age, 25);
  }

  function testCannotRegisterEmptyUsername() public {
      vm.expectRevert();
      spotlight.registerProfile("", "", "", 0);
  }

  function testCannotRegisterUsernameMoreThan32bytes() public {
      // NOTE: bytes vs chars is important distinction...
      vm.expectRevert();
      spotlight.registerProfile("abcdefghijklmnopqrstuvwxyz-abcdefg", "", "", 0);
  }

  function testCannotRegisterIfUsernameAlreadyExists_CaseInsensitive() public {
      address first_u = vm.addr(1);
      vm.prank(first_u);
      spotlight.registerProfile("userNAME1", "", "", 0);

      address second_u = vm.addr(2);
      vm.prank(second_u);
      vm.expectRevert();
      spotlight.registerProfile("USERname1", "", "", 0);
  }
}
