// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Error.sol";
import "./PostLib.sol";
import "./Reputation.sol";

contract Posts {
  address public immutable spotlightContract;
  /// @notice Reputation token contract
  Reputation private reputationToken;

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

  /// @dev Mapping from address to it's post IDs
  mapping(address => bytes[]) internal profilePostIDs;

  // TODO: Move to off-chain storage - sig => off-chain storage location
  /// @dev Mapping from signature of post (post ID) to post content
  mapping(bytes => PostLib.Post) internal postStore;
  mapping(bytes => PostLib.Comment[]) internal postComments;

  // @notice Mappings of post IDs to the addresses that up/downvoted them
  mapping(bytes => mapping(address => bool)) public upvotedBy;
  mapping(bytes => mapping(address => bool)) public downvotedBy;

  /// @dev post ID => wallet addr => pubKey for encryption
  mapping(bytes => mapping(address => string)) internal purchaserPublicKeys;

  /// @dev Pointer struct for traversal of purchaserPublicKeys
  struct PendingPurchase {
    address purchaser;
    bytes postId;
    string pubkey;
  }

  // Map of creator address => list of (users + posts) have they paid for?
  mapping(address => PendingPurchase[]) internal pendingPurchases;

  /// @dev Mapping of purchaser address => map of purchased Posts
  mapping(address => mapping(bytes => PostLib.Post)) purchasedPosts;

  constructor(address _spotlightContract, address _reputationContract) {
    if (_spotlightContract == address(0)) revert SpotlightAddressCannotBeZero();
    if (_reputationContract == address(0)) revert ReputationAddressCannotBeZero();
    spotlightContract = _spotlightContract;
    reputationToken = Reputation(_reputationContract);
  }

  function checkPostExists(bytes memory _id) internal view {
    PostLib.Post memory post = postStore[_id];
    if (bytes(post.content).length == 0) {
      revert PostNotFound();
    }
  }

  /// @notice Create a post from the caller's address.
  /// @param _title The title of the post.
  /// @param _content The content of the post.
  /// @param _nonce The nonce used for signature generation
  /// @param _sig The signature of the post.
  function createPost(
    address _addr,
    string memory _title,
    string memory _content,
    uint256 _nonce,
    bytes calldata _sig,
    bool _paywalled
  ) public {
    if (msg.sender != spotlightContract) revert OnlySpotlightCanManagePosts();
    if (bytes(_content).length == 0) revert ContentCannotBeEmpty();
    if (bytes(_title).length == 0) revert TitleCannotBeEmpty();
    if (!PostLib.isValidPostSignature(_addr, _title, _content, _nonce, _sig)) revert InvalidSignature();

    // TODO: Check that the signature doesn't already exist in the postStore!

    PostLib.Post memory p = PostLib.Post({
      creator: _addr,
      title: _title,
      content: _content,
      id: _sig,
      signature: _sig,
      nonce: _nonce,
      paywalled: _paywalled,
      createdAt: block.timestamp,
      lastUpdatedAt: block.timestamp,
      upvoteCount: 0,
      downvoteCount: 0
    });

    postStore[_sig] = p;
    communityPostIDs.push(_sig);
    profilePostIDs[_addr].push(_sig);
  }

  /// @notice Get all posts for a given address
  /// @param _addr Wallet address of the registered user whose posts we wish to retrieve
  function getPostsOfAddress(address _addr) public view returns (PostLib.Post[] memory) {
    // TODO: Add pagination - https://programtheblockchain.com/posts/2018/04/20/storage-patterns-pagination/
    bytes[] memory sigs = profilePostIDs[_addr];
    PostLib.Post[] memory userPosts = new PostLib.Post[](sigs.length);
    for (uint256 i = 0; i < sigs.length; i++) {
      // NOTE: Cannot use userPosts.push because push is only for dynamic arrays in STORAGE
      userPosts[i] = postStore[sigs[i]];
    }
    return userPosts;
  }

  function getPost(bytes calldata _post_sig) public view returns (PostLib.Post memory) {
    PostLib.Post memory p = postStore[_post_sig];
    if (p.creator == address(0)) revert PostNotFound();
    return p;
  }

  // TODO: add community ID argument - what community are you trying to get posts for?
  /// @notice Get all posts from a community
  function getCommunityPosts() public view returns (PostLib.Post[] memory) {
    // TODO: Add pagination - https://programtheblockchain.com/posts/2018/04/20/storage-patterns-pagination/
    PostLib.Post[] memory p = new PostLib.Post[](communityPostIDs.length);
    for (uint256 i = 0; i < communityPostIDs.length; i++) {
      p[i] = postStore[communityPostIDs[i]];
    }
    return p;
  }

  function editPost(address _addr, bytes calldata _id, string calldata newContent) public {
    // Ensure post exists
    if (msg.sender != spotlightContract) revert OnlySpotlightCanManagePosts();
    checkPostExists(_id);
    PostLib.Post storage post = postStore[_id];
    if (post.creator != _addr) revert OnlyCreatorCanEdit();
    if (bytes(newContent).length == 0) revert ContentCannotBeEmpty();

    // TODO: Accept newSig arg and verify it against newContent

    post.content = newContent;
    post.lastUpdatedAt = block.timestamp;
  }

  function deletePost(address _addr, bytes memory _id) public {
    // Ensure the post exists
    if (msg.sender != spotlightContract) revert OnlySpotlightCanManagePosts();
    checkPostExists(_id);
    PostLib.Post storage post = postStore[_id];
    if (post.creator != _addr) revert OnlyCreatorCanEdit();

    // TODO: Burn RPT associated with the post (or at least burn some amount of RPT...)

    // Remove post from user's profile
    bytes[] storage userPosts = profilePostIDs[_addr];
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
  }

  function deleteProfile(address _addr) public {
    if (msg.sender != spotlightContract) revert OnlySpotlightCanManagePosts();
    for (uint256 i = 0; i < profilePostIDs[_addr].length; ++i) {
      bytes memory id = profilePostIDs[_addr][i];
      deleteCommunityPost(id);
      delete postStore[id];
    }

    // TODO: Burn remaining reputation of user

    delete profilePostIDs[_addr];
  }

  function deleteCommunityPost(bytes memory _id) internal {
    // Remove post from communityPostIDs
    checkPostExists(_id);
    for (uint256 i = 0; i < communityPostIDs.length; i++) {
      // Solidity doesn’t have native string comparison, so keccak256 is often used to compare strings by hashing them
      if (keccak256(communityPostIDs[i]) == keccak256(_id)) {
        communityPostIDs[i] = communityPostIDs[communityPostIDs.length - 1]; // Efficient gas usage: O(1) rather than O(n).
        communityPostIDs.pop();
        break;
      }
    }
  }

  function upvote(address _addr, bytes calldata _id) public {
    if (msg.sender != spotlightContract) revert OnlySpotlightCanManagePosts();
    checkPostExists(_id);
    PostLib.Post storage p = postStore[_id];
    if (upvotedBy[_id][_addr]) {
      p.upvoteCount--;
      reputationToken.revertUpvotePost(p.creator);
      delete upvotedBy[_id][_addr];
      return;
    }

    if (downvotedBy[_id][_addr]) {
      p.downvoteCount--;
      reputationToken.revertDownvotePost(p.creator);
      delete downvotedBy[_id][_addr];
    }

    p.upvoteCount++;
    upvotedBy[_id][_addr] = true;
    reputationToken.upvotePost(p.creator);
  }

  function downvote(address _addr, bytes calldata _id) public {
    if (msg.sender != spotlightContract) revert OnlySpotlightCanManagePosts();
    checkPostExists(_id);
    PostLib.Post storage p = postStore[_id];
    if (downvotedBy[_id][_addr]) {
      p.downvoteCount--;
      reputationToken.revertDownvotePost(p.creator);
      delete downvotedBy[_id][_addr];
      return;
    }

    if (upvotedBy[_id][_addr]) {
      p.upvoteCount--;
      reputationToken.revertUpvotePost(p.creator);
      delete upvotedBy[_id][_addr];
    }

    p.downvoteCount++;
    downvotedBy[_id][_addr] = true;
    reputationToken.downvotePost(p.creator);
  }

  function addComment(address _addr, bytes calldata _id, string calldata _content) public {
    if (msg.sender != spotlightContract) revert OnlySpotlightCanManagePosts();
    checkPostExists(_id);
    if (bytes(_content).length == 0) revert CommentCannotBeEmpty();

    PostLib.Comment memory newComment =
      PostLib.Comment({ commenter: _addr, content: _content, createdAt: block.timestamp });

    postComments[_id].push(newComment);
  }

  function getComments(bytes calldata _id) public view returns (PostLib.Comment[] memory) {
    checkPostExists(_id);
    return postComments[_id];
  }

  function isPurchasePending(address _addr, bytes calldata _id) public view returns (bool) {
    /**
     * TODO: This needs to be modified, i.e. if the creator accepts your payment - it wouldn't be "PENDING"
     * anymore - it would be in the user's mapping storing their copy of the post, which they can decrypt.
     * That data structure doesn't exist yet...
     */
    checkPostExists(_id);
    return bytes(purchaserPublicKeys[_id][_addr]).length > 0;
  }

  function purchasePost(address _addr, bytes calldata _id, string calldata _pubkey) public {
    if (msg.sender != spotlightContract) revert OnlySpotlightCanManagePosts();
    checkPostExists(_id);
    if (!postStore[_id].paywalled) revert PostNotPaywalled();
    if (_addr == postStore[_id].creator) revert CreatorCannotPayForOwnContent();

    // TODO: This will need to be modified - same reason(s) stated in `hasPurchasedPost` above
    if (bytes(purchaserPublicKeys[_id][_addr]).length > 0) revert PostAlreadyPurchased();

    purchaserPublicKeys[_id][_addr] = _pubkey;
    pendingPurchases[postStore[_id].creator].push(PendingPurchase(_addr, _id, _pubkey));
  }

  function getPendingPurchases(address _addr) public view returns (PendingPurchase[] memory) {
    return pendingPurchases[_addr];
  }

  function declinePurchase(address _creator, bytes calldata _id, address _purchaser) public {
    purchaseSettlementValidations(_id, _purchaser);
    // TODO: Purchaser is allowed to decline the purchase!
    if (postStore[_id].creator != _creator) revert OnlyCreatorCanDeclinePurchase();
    removePurchaseFromPending(_creator, _id, _purchaser);
  }

  function acceptPurchase(address _creator, bytes calldata _id, address _purchaser, string memory _content) public {
    purchaseSettlementValidations(_id, _purchaser);
    PostLib.Post memory p = postStore[_id];
    if (p.creator != _creator) revert OnlyCreatorCanAcceptPurchase();

    // Create a copy of the post for the purchaser - content is encrypted with their pubkey
    purchasedPosts[_purchaser][_id] = PostLib.Post({
      creator: p.creator,
      title: p.title,
      content: _content,
      id: _id,
      signature: p.signature,
      nonce: p.nonce,
      paywalled: true,
      createdAt: p.createdAt,
      lastUpdatedAt: p.lastUpdatedAt,
      upvoteCount: 0, // This won't actually apply
      downvoteCount: 0 // This won't actually apply
     });
    removePurchaseFromPending(_creator, _id, _purchaser);
  }

  function purchaseSettlementValidations(bytes calldata _id, address _purchaser) internal view {
    if (msg.sender != spotlightContract) revert OnlySpotlightCanManagePosts();
    checkPostExists(_id);
    if (!postStore[_id].paywalled) revert PostNotPaywalled();
    if (!isPurchasePending(_purchaser, _id)) revert NoPendingPurchaseFound();
  }

  function removePurchaseFromPending(address _creator, bytes calldata _id, address _purchaser) internal {
    for (uint256 i = 0; i < pendingPurchases[_creator].length; i++) {
      if (keccak256(pendingPurchases[_creator][i].postId) == keccak256(_id)) {
        pendingPurchases[_creator][i] = pendingPurchases[_creator][pendingPurchases[_creator].length - 1];
        pendingPurchases[_creator].pop();
        break;
      }
    }
    delete purchaserPublicKeys[_id][_purchaser];
  }

  function getPurchasedPost(address _addr, bytes calldata _id) public view returns (PostLib.Post memory) {
    return purchasedPosts[_addr][_id];
  }
}
