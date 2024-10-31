// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Forge debugging tool, useful for testing purposes. Remove before deploying to live network.
import "forge-std/console.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

import "./PostLib.sol";
import "./Events.sol";

/// @title Spotlight - A decentralized reddit
/// @author Team
/// @notice You can use this contract to manage user profiles and create posts.
/// @dev This contract is intended to be deployed on Ethereum-compatible networks.
contract Spotlight {
  /// @notice The owner of the contract.
  address public owner;

  // TODO: Move to off-chain storage - sig => off-chain storage location
  /// @dev Mapping from signature of post (post ID) to post content
  mapping(bytes => PostLib.Post) private postStore;

  // TODO: Support >1 community
  /* TODO:
       We should probably uses openzeppelin's DoubleEndedQueue here
       https://docs.openzeppelin.com/contracts/5.x/api/utils#DoubleEndedQueue

       An array adds to the end, so newer items are in the "back", forcing full traversal for
       "the latest" posts.

       Where as with a DoubleEndedQueue, all ops are O(1) and would work nicely with pagination
    */
  /// @dev Array of all post signatures in the community
  bytes[] private communityPostIDs;

  /// @notice Structure to store profile information.
  struct Profile {
    // TODO: avatar, bio, etc.
    string username; // The username of the profile
    bytes[] postIDs; // Array of post signatures (aka - post IDs) made by the user
  }

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

  modifier postExists(bytes calldata _sig) {
    PostLib.Post memory post = postStore[_sig];
    require(bytes(post.content).length > 0, "Post does not exist");
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
  /// @param _title The title of the post.
  /// @param _content The content of the post.
  /// @param _nonce The nonce used for signature generation
  /// @param _sig The signature of the post.
  function createPost(string memory _title, string memory _content, uint256 _nonce, bytes calldata _sig)
    public
    onlyRegistered
  {
    require(bytes(_content).length > 0, "Content cannot be empty");
    require(bytes(_title).length > 0, "Title cannot be empty");
    require(PostLib.isValidPostSignature(msg.sender, _title, _content, _nonce, _sig), "Invalid signature");

    // TODO: Check that the signature doesn't already exist in the postStore!

    PostLib.Post memory p = PostLib.Post({
      creator: msg.sender,
      title: _title,
      content: _content,
      id: _sig,
      nonce: _nonce,
      createdAt: block.timestamp,
      lastUpdatedAt: block.timestamp,
      upvoteCount: 0,
      downvoteCount: 0
    });

    postStore[_sig] = p;
    communityPostIDs.push(_sig);
    profiles[msg.sender].postIDs.push(_sig);
    emit PostCreated(msg.sender, _sig);
  }

  /// @notice Get all posts for a given address
  /// @param _addr Wallet address of the registered user whose posts we wish to retrieve
  function getPostsOfAddress(address _addr) public view onlyRegistered returns (PostLib.Post[] memory) {
    // TODO: Add pagination - https://programtheblockchain.com/posts/2018/04/20/storage-patterns-pagination/
    require(isRegistered(_addr), "Requested address is not registered");

    bytes[] memory sigs = profiles[_addr].postIDs;
    console.log("Sigs length", sigs.length);
    PostLib.Post[] memory userPosts = new PostLib.Post[](sigs.length);
    for (uint256 i = 0; i < sigs.length; i++) {
      // NOTE: Cannot use userPosts.push because push is only for dynamic arrays in STORAGE
      userPosts[i] = postStore[sigs[i]];
    }
    return userPosts;
  }

  function getPost(bytes calldata _post_sig) public view onlyRegistered returns (PostLib.Post memory) {
    PostLib.Post memory p = postStore[_post_sig];
    require(p.creator != address(0), "Requested post not found");
    return p;
  }

  // TODO: add community ID argument - what community are you trying to get posts for?
  /// @notice Get all posts from a community
  function getCommunityPosts() public view onlyRegistered returns (PostLib.Post[] memory) {
    // TODO: Add pagination - https://programtheblockchain.com/posts/2018/04/20/storage-patterns-pagination/
    PostLib.Post[] memory p = new PostLib.Post[](communityPostIDs.length);
    for (uint256 i = 0; i < communityPostIDs.length; i++) {
      p[i] = postStore[communityPostIDs[i]];
    }
    return p;
  }

  function editPost(bytes calldata _sig, string calldata newContent) public onlyRegistered postExists(_sig) {
    // Ensure post exists
    PostLib.Post storage post = postStore[_sig];
    require(post.creator == msg.sender, "Only the creator can edit this post");
    require(bytes(newContent).length > 0, "Content cannot be empty");

    post.content = newContent;
    post.lastUpdatedAt = block.timestamp;

    emit PostEdited(msg.sender, _sig);
  }

  function deletePost(bytes calldata _sig) public onlyRegistered postExists(_sig) {
    // Ensure the post exists
    PostLib.Post storage post = postStore[_sig];
    require(post.creator == msg.sender, "Only the creator can delete this post");

    // Remove post from user's profile
    bytes[] storage userPosts = profiles[msg.sender].postIDs;
    for (uint256 i = 0; i < userPosts.length; i++) {
      // Solidity doesn’t have native string comparison, so keccak256 is often used to compare strings by hashing them
      if (keccak256(userPosts[i]) == keccak256(_sig)) {
        userPosts[i] = userPosts[userPosts.length - 1]; // Efficient gas usage: O(1) rather than O(n).
        userPosts.pop();
        break;
      }
    }

    // Remove post from communityPostIDs
    for (uint256 i = 0; i < communityPostIDs.length; i++) {
      // Solidity doesn’t have native string comparison, so keccak256 is often used to compare strings by hashing them
      if (keccak256(communityPostIDs[i]) == keccak256(_sig)) {
        communityPostIDs[i] = communityPostIDs[communityPostIDs.length - 1]; // Efficient gas usage: O(1) rather than O(n).
        communityPostIDs.pop();
        break;
      }
    }

    delete postStore[_sig];
    emit PostDeleted(msg.sender, _sig);
  }

  function upvote(bytes calldata _sig) public onlyRegistered postExists(_sig) {
    // TODO: check for previous downvoteCount and decrement if necessary
    // TODO: check for already upvoted - no-op in this case
    PostLib.Post storage p = postStore[_sig];
    p.upvoteCount++;
  }

  function downvote(bytes calldata _sig) public onlyRegistered postExists(_sig) {
    // TODO: check for already upvoted - no-op in this case
    // TODO: check for previous upvoteCount and decrement if necessary
    PostLib.Post storage p = postStore[_sig];
    p.downvoteCount++;
  }

  // TODO
  // function clearVote(bytes calldata _sig) public onlyRegistered() postExists(_sig) {
  // }
}
