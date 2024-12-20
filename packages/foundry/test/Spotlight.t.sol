// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/Spotlight.sol";
import "../contracts/Reputation.sol";
import "../contracts/Events.sol";
import "../contracts/SpotlightErrors.sol";

contract SpotlightTest is Test {
  Spotlight public spotlight;

  function setUp() public {
    Reputation rpt = new Reputation();
    spotlight = new Spotlight(vm.addr(1), address(rpt));
  }

  function testDeploymentState() public view {
    assertEq(vm.addr(1), spotlight.owner());
  }

  function testCannotGetProfileIfNotRegistered() public {
    vm.expectRevert(SpotlightErrors.ProfileNotExist.selector);
    spotlight.getProfile(vm.addr(2));
  }

  function testRegisterNewUser() public {
    address newUser = vm.addr(2);
    vm.prank(newUser);
    spotlight.registerProfile("newUser");

    Spotlight.Profile memory p = spotlight.getProfile(newUser);
    assertEq("newUser", p.username);
    assertEq(0, p.reputation);
  }

  function testCannotRegisterEmptyUsername() public {
    vm.expectRevert(SpotlightErrors.UsernameCannotBeEmpty.selector);
    spotlight.registerProfile("");
  }

  function testCannotRegisterUsernameMoreThan32bytes() public {
    // Username too long
    vm.expectRevert(SpotlightErrors.UsernameTooLong.selector);
    spotlight.registerProfile("abcdefghijklmnopqrstuvwxyz-abcdefg");
  }

  function testCannotRegisterIfUsernameAlreadyExists_CaseInsensitive() public {
    address first_u = vm.addr(1);
    vm.prank(first_u);
    spotlight.registerProfile("userNAME1");

    address second_u = vm.addr(2);
    vm.prank(second_u);
    vm.expectRevert(SpotlightErrors.UsernameTaken.selector);
    spotlight.registerProfile("USERname1");
  }

  function testUpdateUsername() public {
    address user = vm.addr(1);
    vm.prank(user);
    spotlight.registerProfile("OldUsername");

    vm.prank(user);
    spotlight.updateUsername("NewUsername");

    Spotlight.Profile memory p = spotlight.getProfile(user);
    assertEq("NewUsername", p.username);

    // Old username should now be available
    address anotherUser = vm.addr(2);
    vm.prank(anotherUser);
    spotlight.registerProfile("OldUsername");
    p = spotlight.getProfile(anotherUser);
    assertEq("OldUsername", p.username);
  }

  function testCannotUpdateUsernameIfNotRegistered() public {
    vm.expectRevert(SpotlightErrors.ProfileNotExist.selector);
    spotlight.updateUsername("NewUsername");
  }

  function testCannotUpdateUsernameToExistingUsername() public {
    address user1 = vm.addr(1);
    vm.prank(user1);
    spotlight.registerProfile("Username1");

    address user2 = vm.addr(2);
    vm.prank(user2);
    spotlight.registerProfile("Username2");

    vm.prank(user2);
    vm.expectRevert(SpotlightErrors.UsernameTaken.selector);
    spotlight.updateUsername("Username1");
  }

  function testDeleteProfile() public {
    address user = vm.addr(1);
    vm.prank(user);
    spotlight.registerProfile("Username");

    vm.prank(user);
    spotlight.deleteProfile();

    // Now, getProfile should revert
    vm.expectRevert(SpotlightErrors.ProfileNotExist.selector);
    spotlight.getProfile(user);

    // Username should now be available
    address anotherUser = vm.addr(2);
    vm.prank(anotherUser);
    spotlight.registerProfile("Username");
    Spotlight.Profile memory p = spotlight.getProfile(anotherUser);
    assertEq("Username", p.username);
  }

  function testCannotDeleteProfileIfNotRegistered() public {
    vm.expectRevert(SpotlightErrors.ProfileNotExist.selector);
    spotlight.deleteProfile();
  }

  function testIsRegistered() public {
    address user = vm.addr(1);
    assertFalse(spotlight.isRegistered(user));

    vm.prank(user);
    spotlight.registerProfile("Username");

    assertTrue(spotlight.isRegistered(user));
  }

  function testReRegisterAfterDeletion() public {
    address user = vm.addr(1);
    vm.prank(user);
    spotlight.registerProfile("Username");

    vm.prank(user);
    spotlight.deleteProfile();

    assertFalse(spotlight.isRegistered(user));

    vm.prank(user);
    spotlight.registerProfile("NewUsername");

    assertTrue(spotlight.isRegistered(user));
    Spotlight.Profile memory p = spotlight.getProfile(user);
    assertEq("NewUsername", p.username);
  }

  function testEventsEmitted() public {
    address user = vm.addr(1);

    // Test ProfileRegistered event
    vm.expectEmit(true, true, false, true);
    emit ProfileRegistered(user, "Username");
    vm.prank(user);
    spotlight.registerProfile("Username");

    // Test ProfileUpdated event
    vm.expectEmit(true, true, false, true);
    emit ProfileUpdated(user, "NewUsername");
    vm.prank(user);
    spotlight.updateUsername("NewUsername");

    // Test ProfileDeleted event
    vm.expectEmit(true, true, false, true);
    emit ProfileDeleted(user);
    vm.prank(user);
    spotlight.deleteProfile();
  }

  function testAvatarCIDCannotBeEmpty() public {
    address user = vm.addr(1);

    vm.startPrank(user);
    spotlight.registerProfile("Username");
    vm.expectRevert(SpotlightErrors.AvatarCIDCannotBeEmpty.selector);
    spotlight.updateAvatarCID("");
  }

  function testUpdatingAvatarCID() public {
    address user = vm.addr(1);

    vm.startPrank(user);
    spotlight.registerProfile("Username");
    Spotlight.Profile memory profile = spotlight.getProfile(user);
    assertEq("", profile.avatarCID);

    spotlight.updateAvatarCID("abcd.ipfs.w3s.link");
    profile = spotlight.getProfile(user);
    assertEq("abcd.ipfs.w3s.link", profile.avatarCID);
  }
}
