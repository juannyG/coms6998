// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Forge debugging tool, useful for testing purposes. Remove before deploying to live network.
import "forge-std/console.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

import "./PostLib.sol";
import "./Events.sol";
import "./Reputation.sol";
import "./Error.sol";

/// @title Spotlight - A decentralized reddit
/// @author Team
/// @notice You can use this contract to manage user profiles and create posts.
/// @dev This contract is intended to be deployed on Ethereum-compatible networks.
contract Spotlight {
  /// @notice The owner of the contract.
  address public owner;

  /// @notice Reputation token contract
  Reputation private reputationToken;

  // @notice Mappings of post IDs to the addresses that up/downvoted them
  mapping(bytes => mapping(address => bool)) public upvotedBy;
  mapping(bytes => mapping(address => bool)) public downvotedBy;

  // TODO: Move to off-chain storage - sig => off-chain storage location
  /// @dev Mapping from signature of post (post ID) to post content
  mapping(bytes => PostLib.Post) internal postStore;

  // TODO: Support >1 community
  /* TODO:
       We should probably uses openzeppelin's DoubleEndedQueue here
       https://docs.openzeppelin.com/contracts/5.x/api/utils#DoubleEndedQueue

       An array adds to the end, so newer items are in the "back", forcing full traversal for
       "the latest" posts.

       Where as with a DoubleEndedQueue, all ops are O(1) and would work nicely with pagination
    */
  /// @dev Array of all post signatures in the community
  bytes[] internal communityPostIDs;

  /// @notice Structure to store profile information.
  struct Profile {
    // TODO: avatar, bio, etc.
    string username; // The username of the profile
    uint256 reputation;
  }

  /// @dev Mapping from address to it's post IDs
  mapping(address => bytes[]) internal profilePostIDs;

  /// @dev Mapping from an address to its associated profile.
  mapping(address => Profile) internal profiles;

  /// @dev Mapping to keep track of the hashes of normalized usernames to ensure uniqueness.
  mapping(bytes32 => bool) internal normalized_username_hashes;

  /// @notice Constructor sets the contract owner during deployment.
  /// @param _owner The address of the owner.
  constructor(address _owner) {
    owner = _owner;
    reputationToken = new Reputation(address(this));
  }

  /// @notice Modifier to ensure that only registered users can perform certain actions.
  modifier onlyRegistered() {
    if (!isRegistered(msg.sender)) revert ProfileNotExist();
    _;
  }

  modifier postExists(bytes memory _id) {
    PostLib.Post memory post = postStore[_id];
    if (bytes(post.content).length == 0) {
      revert PostNotFound();
    }
    _;
  }

  /// @notice Modifier to ensure that a username meets the length requirements.
  /// @param _username The username to be validated.
  modifier usernameValid(string memory _username) {
    if (bytes(_username).length == 0) revert UsernameCannotBeEmpty();
    if (bytes(_username).length > 32) revert UsernameTooLong();
    _;
  }

  /// @notice Register a new profile with a unique username.
  /// @dev The username is checked for uniqueness after normalization (case-insensitive).
  /// @param _username The desired username for the profile.
  function registerProfile(string memory _username) public usernameValid(_username) {
    // TODO: Ensure msg.sender != address(0)
    if (isRegistered(msg.sender)) revert ProfileAlreadyExist();

    bytes32 usernameHash = _getUsernameHash(_username);
    if (normalized_username_hashes[usernameHash]) revert UsernameTaken();

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
  function getProfile(address a) public view returns (Profile memory) {
    if (bytes(profiles[a].username).length == 0) revert ProfileNotExist();

    // We want to update this on the way out and NOT the storage state - that costs gas!
    Profile memory profile = profiles[a];
    profile.reputation = reputationToken.balanceOf(a);
    return profile;
  }

  /// @notice Update the username of the caller's profile.
  /// @dev The new username must be unique and meet length requirements.
  /// @param _newUsername The new username to set for the profile.
  function updateUsername(string memory _newUsername) public onlyRegistered usernameValid(_newUsername) {
    bytes32 newHash = _getUsernameHash(_newUsername);
    if (normalized_username_hashes[newHash]) revert UsernameTaken();

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

    for (uint256 i = 0; i < profilePostIDs[msg.sender].length; ++i) {
      bytes memory id = profilePostIDs[msg.sender][i];
      deleteCommunityPost(id);
      delete postStore[id];
    }

    // TODO: Burn remaining reputation of user

    delete profilePostIDs[msg.sender];
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
    if (bytes(_content).length == 0) revert ContentCannotBeEmpty();
    if (bytes(_title).length == 0) revert TitleCannotBeEmpty();
    if (!PostLib.isValidPostSignature(msg.sender, _title, _content, _nonce, _sig)) revert InvalidSignature();

    // TODO: Check that the signature doesn't already exist in the postStore!

    PostLib.Post memory p = PostLib.Post({
      creator: msg.sender,
      title: _title,
      content: _content,
      id: _sig,
      signature: _sig,
      nonce: _nonce,
      createdAt: block.timestamp,
      lastUpdatedAt: block.timestamp,
      upvoteCount: 0,
      downvoteCount: 0
    });

    postStore[_sig] = p;
    communityPostIDs.push(_sig);
    profilePostIDs[msg.sender].push(_sig);
    emit PostCreated(msg.sender, _sig);
  }

  /// @notice Get all posts for a given address
  /// @param _addr Wallet address of the registered user whose posts we wish to retrieve
  function getPostsOfAddress(address _addr) public view onlyRegistered returns (PostLib.Post[] memory) {
    // TODO: Add pagination - https://programtheblockchain.com/posts/2018/04/20/storage-patterns-pagination/
    if (!isRegistered(_addr)) revert AddressNotRegistered();

    bytes[] memory sigs = profilePostIDs[_addr];
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
    if (p.creator == address(0)) revert PostNotFound();
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

  function editPost(bytes calldata _id, string calldata newContent) public onlyRegistered postExists(_id) {
    // Ensure post exists
    PostLib.Post storage post = postStore[_id];
    if (post.creator != msg.sender) revert OnlyCreatorCanEdit();
    if (bytes(newContent).length == 0) revert ContentCannotBeEmpty();

    // TODO: Accept newSig arg and verify it against newContent

    post.content = newContent;
    post.lastUpdatedAt = block.timestamp;

    emit PostEdited(msg.sender, _id);
  }

  function deletePost(bytes memory _id) public onlyRegistered postExists(_id) {
    // Ensure the post exists
    PostLib.Post storage post = postStore[_id];
    if (post.creator != msg.sender) revert OnlyCreatorCanEdit();

    // TODO: Burn RPT associated with the post (or at least burn some amount of RPT...)

    // Remove post from user's profile
    bytes[] storage userPosts = profilePostIDs[msg.sender];
    for (uint256 i = 0; i < userPosts.length; i++) {
      // Solidity doesn’t have native string comparison, so keccak256 is often used to compare strings by hashing them
      if (keccak256(userPosts[i]) == keccak256(_id)) {
        userPosts[i] = userPosts[userPosts.length - 1]; // Efficient gas usage: O(1) rather than O(n).
        userPosts.pop();
        break;
      }
    }

    deleteCommunityPost(_id);
    delete postStore[_id];
    emit PostDeleted(msg.sender, _id);
  }

  function deleteCommunityPost(bytes memory _id) internal postExists(_id) {
    // Remove post from communityPostIDs
    for (uint256 i = 0; i < communityPostIDs.length; i++) {
      // Solidity doesn’t have native string comparison, so keccak256 is often used to compare strings by hashing them
      if (keccak256(communityPostIDs[i]) == keccak256(_id)) {
        communityPostIDs[i] = communityPostIDs[communityPostIDs.length - 1]; // Efficient gas usage: O(1) rather than O(n).
        communityPostIDs.pop();
        break;
      }
    }
  }

  function upvote(bytes calldata _id) public onlyRegistered postExists(_id) {
    PostLib.Post storage p = postStore[_id];
    if (upvotedBy[_id][msg.sender]) {
      p.upvoteCount--;
      reputationToken.revertUpvotePost(p.creator);
      delete upvotedBy[_id][msg.sender];
      return;
    }

    if (downvotedBy[_id][msg.sender]) {
      p.downvoteCount--;
      reputationToken.revertDownvotePost(p.creator);
      delete downvotedBy[_id][msg.sender];
    }

    p.upvoteCount++;
    upvotedBy[_id][msg.sender] = true;
    reputationToken.upvotePost(p.creator);
    emit PostUpvoted(msg.sender, _id);
  }

  function downvote(bytes calldata _id) public onlyRegistered postExists(_id) {
    PostLib.Post storage p = postStore[_id];
    if (downvotedBy[_id][msg.sender]) {
      p.downvoteCount--;
      reputationToken.revertDownvotePost(p.creator);
      delete downvotedBy[_id][msg.sender];
      return;
    }

    if (upvotedBy[_id][msg.sender]) {
      // TODO: undo upvote in reputationToken
      p.upvoteCount--;
      reputationToken.revertUpvotePost(p.creator);
      delete upvotedBy[_id][msg.sender];
    }

    p.downvoteCount++;
    downvotedBy[_id][msg.sender] = true;
    reputationToken.downvotePost(p.creator);
    emit PostDownvoted(msg.sender, _id);
  }

  // TODO
  // function clearVote(bytes calldata _sig) public onlyRegistered() postExists(_sig) {
  // }
}
