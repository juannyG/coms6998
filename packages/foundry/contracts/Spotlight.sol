//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";

contract Spotlight {
    address public owner;

    struct Profile {
        string username;
    }

    mapping(address => Profile) private profiles;
    mapping(bytes32 => bool) private normalized_username_hashes;
    mapping(address => string[]) private address_to_comments;

    event ProfileRegistered(address indexed user, string username);
    event ProfileUpdated(address indexed user, string newUsername);
    event ProfileDeleted(address indexed user);
    event CommentPosted(address indexed user, string comment);

    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyRegistered() {
        require(isRegistered(msg.sender), "Profile does not exist");
        _;
    }

    modifier usernameValid(string memory _username) {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(bytes(_username).length < 32, "Username too long");
        _;
    }

    function registerProfile(string memory _username) public usernameValid(_username) {
        require(!isRegistered(msg.sender), "Profile already exists");

        bytes32 usernameHash = _getUsernameHash(_username);
        require(!normalized_username_hashes[usernameHash], "Username is already taken");

        normalized_username_hashes[usernameHash] = true;
        profiles[msg.sender] = Profile({username: _username});
        emit ProfileRegistered(msg.sender, _username);
    }

    function isRegistered(address a) public view returns (bool) {
        return bytes(profiles[a].username).length > 0;
    }

    function getProfile(address a) public view returns (string memory) {
        require(bytes(profiles[a].username).length > 0, "Profile does not exist");
        return profiles[a].username;
    }

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

    function deleteProfile() public onlyRegistered {
        bytes32 oldHash = _getUsernameHash(profiles[msg.sender].username);
        normalized_username_hashes[oldHash] = false;

        delete profiles[msg.sender];
        emit ProfileDeleted(msg.sender);
    }

    function postComment(string memory _comment) public onlyRegistered {
        address_to_comments[msg.sender].push(_comment);
        emit CommentPosted(msg.sender, _comment);
    }

    // New functions added
    function getCommentsLength(address user) public view returns (uint256) {
        return address_to_comments[user].length;
    }

    function getCommentByIndex(address user, uint256 index) public view returns (string memory) {
        require(index < address_to_comments[user].length, "Index out of bounds");
        return address_to_comments[user][index];
    }

    function _getUsernameHash(string memory _username) private pure returns (bytes32) {
        string memory lowercaseUsername = _toLower(_username);
        return keccak256(abi.encodePacked(lowercaseUsername));
    }

    function _toLower(string memory _s) private pure returns (string memory) {
        bytes memory orig_s = bytes(_s);
        bytes memory new_s = new bytes(orig_s.length);

        for (uint256 i = 0; i < orig_s.length; i++) {
            bytes1 char = orig_s[i];

            // If character is uppercase A-Z.
            if (char >= 0x41 && char <= 0x5A) {
                new_s[i] = bytes1(uint8(char) + 32);
            } else {
                new_s[i] = char;
            }
        }
        return string(new_s);
    }
}
