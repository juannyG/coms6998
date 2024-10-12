// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Forge debugging tool, useful for testing purposes. Remove before deploying to live network.
import "forge-std/console.sol";

/// @title Spotlight - A decentralized user profile and comment system
/// @author Team
/// @notice You can use this contract to manage user profiles and post comments.
/// @dev This contract is intended to be deployed on Ethereum-compatible networks.
contract Spotlight {
    /// @notice The owner of the contract.
    address public owner;

    /// @notice Structure to store profile information.
    struct Profile {
        // TODO: avatar, bio, etc.
        
        string username; // The username of the profile
    }

    /// @dev Mapping from an address to its associated profile.
    mapping(address => Profile) private profiles;

    /// @dev Mapping to keep track of the hashes of normalized usernames to ensure uniqueness.
    mapping(bytes32 => bool) private normalized_username_hashes;

    /// @dev Mapping from an address to the array of comments it has posted.
    mapping(address => string[]) private address_to_comments;

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

    /// @notice Emitted when a comment is posted.
    /// @param user The address of the user who posted the comment.
    /// @param comment The content of the posted comment.
    event CommentPosted(address indexed user, string comment);

    /// @notice Constructor sets the contract owner during deployment.
    /// @param _owner The address of the owner.
    constructor(address _owner) {
        owner = _owner;
    }

    /// @notice Modifier to ensure that only registered users can perform certain actions.
    modifier onlyRegistered() {
        require(isRegistered(msg.sender), "Profile does not exist");
        _;
    }

    /// @notice Modifier to ensure that a username meets the length requirements.
    /// @param _username The username to be validated.
    modifier usernameValid(string memory _username) {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(bytes(_username).length < 32, "Username too long");
        _;
    }

    /// @notice Register a new profile with a unique username.
    /// @dev The username is checked for uniqueness after normalization (case-insensitive).
    /// @param _username The desired username for the profile.
    function registerProfile(string memory _username) public usernameValid(_username) {
        require(!isRegistered(msg.sender), "Profile already exists");

        bytes32 usernameHash = _getUsernameHash(_username);
        require(!normalized_username_hashes[usernameHash], "Username is already taken");

        normalized_username_hashes[usernameHash] = true;
        profiles[msg.sender] = Profile({username: _username});

        emit ProfileRegistered(msg.sender, _username);
    }

    /// @notice Check if an address is registered with a profile.
    /// @param a The address to check.
    /// @return True if the address has a registered profile, false otherwise.
    function isRegistered(address a) public view returns (bool) {
        return bytes(profiles[a].username).length > 0;
    }

    /// @notice Retrieve the username of a profile by address.
    /// @dev The profile must exist for the specified address.
    /// @param a The address of the profile owner.
    /// @return The username associated with the address.
    function getProfile(address a) public view returns (string memory) {
        require(bytes(profiles[a].username).length > 0, "Profile does not exist");
        return profiles[a].username;
    }

    /// @notice Update the username of the caller's profile.
    /// @dev The new username must be unique and meet length requirements.
    /// @param _newUsername The new username to set for the profile.
    function updateUsername(string memory _newUsername) public onlyRegistered usernameValid(_newUsername) {
        bytes32 newHash = _getUsernameHash(_newUsername);
        require(!normalized_username_hashes[newHash], "Username is already taken");

        // Remove the old username hash.
        bytes32 oldHash = _getUsernameHash(profiles[msg.sender].username);
        normalized_username_hashes[oldHash] = false;

        // Update the username and set the new hash.
        profiles[msg.sender].username = _newUsername;
        normalized_username_hashes[newHash] = true;

        emit ProfileUpdated(msg.sender, _newUsername);
    }

    /// @notice Delete the caller's profile.
    /// @dev The profile is removed and its associated username is freed.
    function deleteProfile() public onlyRegistered {
        bytes32 oldHash = _getUsernameHash(profiles[msg.sender].username);
        normalized_username_hashes[oldHash] = false;

        delete profiles[msg.sender];
        emit ProfileDeleted(msg.sender);
    }

    /// @notice Post a comment from the caller's address.
    /// @param _comment The content of the comment to post.
    function postComment(string memory _comment) public onlyRegistered {
        address_to_comments[msg.sender].push(_comment);
        emit CommentPosted(msg.sender, _comment);
    }

    /// @notice Get the number of comments posted by a given user.
    /// @param user The address of the user.
    /// @return The number of comments the user has posted.
    function getCommentsLength(address user) public view returns (uint256) {
        return address_to_comments[user].length;
    }

    /// @notice Get a specific comment by its index for a given user.
    /// @param user The address of the user.
    /// @param index The index of the comment.
    /// @return The content of the comment at the specified index.
    function getCommentByIndex(address user, uint256 index) public view returns (string memory) {
        require(index < address_to_comments[user].length, "Index out of bounds");
        return address_to_comments[user][index];
    }

    /// @dev Generate a hash from a normalized (lowercase) username.
    /// @param _username The original username.
    /// @return The keccak256 hash of the lowercase username.
    function _getUsernameHash(string memory _username) private pure returns (bytes32) {
        string memory lowercaseUsername = _toLower(_username);
        return keccak256(abi.encodePacked(lowercaseUsername));
    }

    /// @dev Convert a string to lowercase.
    /// @param _s The original string.
    /// @return The lowercase version of the input string.
    function _toLower(string memory _s) private pure returns (string memory) {
        bytes memory orig_s = bytes(_s);
        bytes memory new_s = new bytes(orig_s.length);

        // Convert each character to lowercase if it is uppercase.
        for (uint256 i = 0; i < orig_s.length; i++) {
            bytes1 char = orig_s[i];

            // If the character is between 'A' and 'Z', convert to lowercase.
            if (char >= 0x41 && char <= 0x5A) {
                new_s[i] = bytes1(uint8(char) + 32);
            } else {
                new_s[i] = char;
            }
        }
        return string(new_s);
    }
}
