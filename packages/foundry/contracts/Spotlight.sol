// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Forge debugging tool, useful for testing purposes. Remove before deploying to live network.
import "forge-std/console.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./Posts.sol";
import "./PostLib.sol";
import "./Events.sol";
import "./Reputation.sol";
import "./SpotlightErrors.sol";

////////////////////////////////////////////////////////////
// TODO: All writes must validate msg.sender != address(0)
////////////////////////////////////////////////////////////

/// @title Spotlight - A decentralized reddit
/// @author Team
/// @notice You can use this contract to manage user profiles and create posts.
/// @dev This contract is intended to be deployed on Ethereum-compatible networks.
contract Spotlight is ReentrancyGuard, SpotlightErrors {
  uint256 public constant PAYWALL_COST = 0.1 ether;

  /// @notice The owner of the contract.
  address public owner;

  /// @notice Reputation token contract
  Reputation private reputationToken;

  /// @notice Posts contract
  Posts private postsContract;

  /// @notice Structure to store profile information.
  struct Profile {
    // TODO: avatar, bio, etc.
    string username;
    string avatarCID; // IPFS CID
    uint256 reputation;
  }

  /// @dev Mapping from an address to its associated profile.
  mapping(address => Profile) internal profiles;

  /// @dev Mapping to keep track of the hashes of normalized usernames to ensure uniqueness.
  mapping(bytes32 => bool) internal normalized_username_hashes;

  /// @notice Constructor sets the contract owner during deployment.
  /// @param _owner The address of the owner.
  constructor(address _owner, address _rtpContract) {
    owner = _owner;
    reputationToken = Reputation(_rtpContract);
    postsContract = new Posts(address(this), _rtpContract);
    reputationToken.setSpotlightContract(address(this));
    reputationToken.setPostsContract(address(postsContract));
  }

  /// @notice Modifier to ensure that only registered users can perform certain actions.
  modifier onlyRegistered() {
    if (!isRegistered(msg.sender)) revert SpotlightErrors.ProfileNotExist();
    _;
  }

  /// @notice Modifier to ensure that a username meets the length requirements.
  /// @param _username The username to be validated.
  modifier usernameValid(string memory _username) {
    if (bytes(_username).length == 0) revert SpotlightErrors.UsernameCannotBeEmpty();
    if (bytes(_username).length > 32) revert SpotlightErrors.UsernameTooLong();
    _;
  }

  /// @notice Register a new profile with a unique username.
  /// @dev The username is checked for uniqueness after normalization (case-insensitive).
  /// @param _username The desired username for the profile.
  function registerProfile(string memory _username) public usernameValid(_username) {
    // TODO: Ensure msg.sender != address(0)
    if (isRegistered(msg.sender)) revert SpotlightErrors.ProfileAlreadyExist();

    bytes32 usernameHash = _getUsernameHash(_username);
    if (normalized_username_hashes[usernameHash]) revert SpotlightErrors.UsernameTaken();

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
    if (bytes(profiles[a].username).length == 0) revert SpotlightErrors.ProfileNotExist();

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
    if (normalized_username_hashes[newHash]) revert SpotlightErrors.UsernameTaken();

    // Remove the old username hash.
    bytes32 oldHash = _getUsernameHash(profiles[msg.sender].username);
    normalized_username_hashes[oldHash] = false;

    // Update the username and set the new hash.
    profiles[msg.sender].username = _newUsername;
    normalized_username_hashes[newHash] = true;

    emit ProfileUpdated(msg.sender, _newUsername);
  }

  function updateAvatarCID(string calldata _cid) public onlyRegistered {
    if (bytes(_cid).length == 0) revert SpotlightErrors.AvatarCIDCannotBeEmpty();
    profiles[msg.sender].avatarCID = _cid;
  }

  /// @notice Delete the caller's profile.
  /// @dev The profile is removed and its associated username is freed.
  function deleteProfile() public onlyRegistered {
    bytes32 oldHash = _getUsernameHash(profiles[msg.sender].username);
    normalized_username_hashes[oldHash] = false;

    postsContract.deleteProfile(msg.sender);
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
  function createPost(
    string memory _title,
    string memory _content,
    uint256 _nonce,
    bytes calldata _sig,
    bool _paywalled
  ) public onlyRegistered {
    postsContract.createPost(msg.sender, _title, _content, _nonce, _sig, _paywalled);
    reputationToken.engagementReward(msg.sender);
    emit PostCreated(msg.sender, _sig);
  }

  /// @notice Get all posts for a given address
  /// @param _addr Wallet address of the registered user whose posts we wish to retrieve
  function getPostsOfAddress(address _addr) public view returns (PostLib.Post[] memory) {
    if (!isRegistered(_addr)) revert SpotlightErrors.AddressNotRegistered();
    return postsContract.getPostsOfAddress(_addr);
  }

  function getPost(bytes calldata _post_sig) public view returns (PostLib.Post memory) {
    return postsContract.getPost(_post_sig);
  }

  // TODO: add community ID argument - what community are you trying to get posts for?
  /// @notice Get all posts from a community
  function getCommunityPosts() public view returns (PostLib.Post[] memory) {
    // TODO: Add pagination - https://programtheblockchain.com/posts/2018/04/20/storage-patterns-pagination/
    return postsContract.getCommunityPosts();
  }

  function editPost(bytes calldata _id, string calldata newContent) public onlyRegistered {
    postsContract.editPost(msg.sender, _id, newContent);
    emit PostEdited(msg.sender, _id);
  }

  function deletePost(bytes memory _id) public onlyRegistered {
    postsContract.deletePost(msg.sender, _id);
    emit PostDeleted(msg.sender, _id);
  }

  function upvote(bytes calldata _id) public onlyRegistered {
    postsContract.upvote(msg.sender, _id);
    reputationToken.engagementReward(msg.sender);
    emit PostUpvoted(msg.sender, _id);
  }

  function upvotedBy(bytes calldata _id, address _addr) public view returns (bool) {
    return postsContract.upvotedBy(_id, _addr);
  }

  function downvote(bytes calldata _id) public onlyRegistered {
    postsContract.downvote(msg.sender, _id);
    reputationToken.engagementReward(msg.sender);
    emit PostDownvoted(msg.sender, _id);
  }

  function downvotedBy(bytes calldata _id, address _addr) public view returns (bool) {
    return postsContract.downvotedBy(_id, _addr);
  }

  function addComment(bytes calldata _id, string calldata _content) public onlyRegistered {
    postsContract.addComment(msg.sender, _id, _content);
    reputationToken.engagementReward(msg.sender);
    emit CommentAdded(msg.sender, _id, _content, block.timestamp);
  }

  /// @notice Get comments for a given post ID
  function getComments(bytes calldata _id) public view returns (PostLib.Comment[] memory) {
    return postsContract.getComments(_id);
  }

  function isPurchasePending(bytes calldata _id) public view returns (bool) {
    return postsContract.isPurchasePending(msg.sender, _id);
  }

  function purchasePost(bytes calldata _id, string calldata _pubkey) public payable onlyRegistered nonReentrant {
    if (msg.value < PAYWALL_COST) revert SpotlightErrors.InsufficentPostFunds();
    postsContract.purchasePost(msg.sender, _id, _pubkey);
    if (msg.value > PAYWALL_COST) {
      // Refund any excess ether back to the user
      uint256 excess = msg.value - PAYWALL_COST;
      payable(msg.sender).transfer(excess);
    }
    reputationToken.engagementReward(msg.sender);
    emit PostPurchased(msg.sender, _id);
  }

  function getPendingPurchases() public view returns (Posts.PendingPurchase[] memory) {
    return postsContract.getPendingPurchases(msg.sender);
  }

  function declinePurchase(bytes calldata _id, address payable _purchaser) public onlyRegistered nonReentrant {
    postsContract.declinePurchase(msg.sender, _id, _purchaser);
    // TODO: Make sure the contract has the funds to handle the refund of the decline
    _purchaser.transfer(PAYWALL_COST);
  }

  function acceptPurchase(bytes calldata _id, address _purchaser, string memory _content)
    public
    onlyRegistered
    nonReentrant
  {
    postsContract.acceptPurchase(msg.sender, _id, _purchaser, _content);
    // TODO: Make sure the contract has the funds to handle the refund of the decline
    payable(msg.sender).transfer(PAYWALL_COST);
  }

  function getPurchasedPost(bytes calldata _id) public view returns (PostLib.Post memory) {
    return postsContract.getPurchasedPost(msg.sender, _id);
  }
}
