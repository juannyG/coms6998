// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Forge debugging tool, useful for testing purposes. Remove before deploying to live network.
import "forge-std/console.sol";
import "./Events.sol";

/// @title Spotlight - A decentralized reddit
/// @author Team
/// @notice You can use this contract to manage user profiles and create posts.
/// @dev This contract is intended to be deployed on Ethereum-compatible networks.
contract Spotlight {
    /// @notice The owner of the contract.
    address public owner;

    /// @notice Structure to store the reference to a post
    struct Post {
        address creator;
        bytes signature;
        bytes content;
    }

    /// @notice Structure to store profile information.
    struct Profile {
        // TODO: avatar, bio, etc.
        string username; // The username of the profile
        Post[] posts; // Array of post signatures (aka - post IDs) made by the user
    }

    /// @dev Mapping from signature of post to post content
    mapping(bytes => Post) private posts;

    /// @dev Mapping from an address to its associated profile.
    mapping(address => Profile) private profiles;

    /// @dev Mapping to keep track of the hashes of normalized usernames to ensure uniqueness.
    mapping(bytes32 => bool) private normalized_username_hashes;

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

        Profile memory profile;
        profile.username = _username;
        profiles[msg.sender] = profile;

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

    /// @notice Create a post from the caller's address.
    /// @param _content The content of the post.
    /// @param _sig The signature of the post.
    function createPost(bytes memory _content, bytes memory _sig) public onlyRegistered {
        // TODO: Require non empty post content & signature
        // TODO: Verify sig
        Post memory p = Post({
            creator: msg.sender,
            signature: _sig,
            content: _content
            });
        posts[_sig] = p;
        profiles[msg.sender].posts.push(p);
        emit PostCreated(msg.sender, _sig);
    }

    // TODO: Do we want posts to be completely public or only registered users can read?
    // Currently public
    function getPostsOfAddress(address ) public view {
    }
}
