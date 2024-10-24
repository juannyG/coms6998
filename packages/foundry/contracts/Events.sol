// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/// @notice Emitted when a new profile is registered.
/// @param user The address of the user who registered the profile.
/// @param username The username associated with the profile.
event ProfileRegistered(address indexed user, string username);

/// @notice Emitted when a profile's username is updated.
/// @param user The address of the user who updated the profile.
/// @param newUsername The new username associated with the profile.
event ProfileUpdated(address indexed user, string newUsername);

/// @notice Emitted when a profile is deleted.
/// @param user The address of the user whose profile was deleted.
event ProfileDeleted(address indexed user);

/// @notice Emitted when a post is created
/// @param user The address of the user who created the post.
/// @param signature The signature of the post.
event PostCreated(address indexed user, bytes indexed signature);
