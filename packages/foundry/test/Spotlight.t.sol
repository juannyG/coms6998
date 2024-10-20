// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/Spotlight.sol";
import "../contracts/Events.sol";

contract SpotlightTest is Test {
    Spotlight public spotlight;

    function setUp() public {
        spotlight = new Spotlight(vm.addr(1));
    }

    function testDeploymentState() public view {
        assertEq(vm.addr(1), spotlight.owner());
    }

    function testCannotGetProfileIfNotRegistered() public {
        vm.expectRevert("Profile does not exist");
        spotlight.getProfile(vm.addr(2));
    }

    function testRegisterNewUser() public {
        address newUser = vm.addr(2);
        vm.prank(newUser);
        spotlight.registerProfile("newUser");

        assertEq("newUser", spotlight.getProfile(newUser));
    }

    function testCannotRegisterEmptyUsername() public {
        vm.expectRevert("Username cannot be empty");
        spotlight.registerProfile("");
    }

    function testCannotRegisterUsernameMoreThan32bytes() public {
        // Username too long
        vm.expectRevert("Username too long");
        spotlight.registerProfile("abcdefghijklmnopqrstuvwxyz-abcdefg");
    }

    function testCannotRegisterIfUsernameAlreadyExists_CaseInsensitive() public {
        address first_u = vm.addr(1);
        vm.prank(first_u);
        spotlight.registerProfile("userNAME1");

        address second_u = vm.addr(2);
        vm.prank(second_u);
        vm.expectRevert("Username is already taken");
        spotlight.registerProfile("USERname1");
    }

    function testUpdateUsername() public {
        address user = vm.addr(1);
        vm.prank(user);
        spotlight.registerProfile("OldUsername");

        vm.prank(user);
        spotlight.updateUsername("NewUsername");

        assertEq("NewUsername", spotlight.getProfile(user));

        // Old username should now be available
        address anotherUser = vm.addr(2);
        vm.prank(anotherUser);
        spotlight.registerProfile("OldUsername");
        assertEq("OldUsername", spotlight.getProfile(anotherUser));
    }

    function testCannotUpdateUsernameIfNotRegistered() public {
        vm.expectRevert("Profile does not exist");
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
        vm.expectRevert("Username is already taken");
        spotlight.updateUsername("Username1");
    }

    function testDeleteProfile() public {
        address user = vm.addr(1);
        vm.prank(user);
        spotlight.registerProfile("Username");

        vm.prank(user);
        spotlight.deleteProfile();

        // Now, getProfile should revert
        vm.expectRevert("Profile does not exist");
        spotlight.getProfile(user);

        // Username should now be available
        address anotherUser = vm.addr(2);
        vm.prank(anotherUser);
        spotlight.registerProfile("Username");
        assertEq("Username", spotlight.getProfile(anotherUser));
    }

    function testCannotDeleteProfileIfNotRegistered() public {
        vm.expectRevert("Profile does not exist");
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
        assertEq("NewUsername", spotlight.getProfile(user));
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
}
