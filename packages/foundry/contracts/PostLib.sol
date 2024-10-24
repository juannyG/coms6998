// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

library PostLib {
  // TODO: Decouple the Post structure from it's signature primitives by creating a SignedPost struct
  /// @notice Structure to store the reference to a post
  struct Post {
    address creator;
    bytes id;
    string content;
    string title;
    uint256 createdAt;
    uint256 lastUpdatedAt;
  }
  // TODO: Add a community pointer
  // TODO: Add likes
  // TODO: Add comments
  /* NICE TO HAVE: 
      If we want to get fancy, we can ensure uniqueness by requiring post creation to include a nonce that is equal to 
      exactly 1 + userProfile.postNonce
  */

  function abiEncodePost(Post memory _p) internal pure returns (bytes memory) {
    // Include everything EXCEPT `id` which is the signature itself and `creator`
    return abi.encodePacked(_p.title, _p.content, _p.createdAt, _p.lastUpdatedAt);
  }

  function isValidPostSignature(address _addr, Post memory _p, bytes memory _sig) internal view returns (bool) {
    bytes32 data_hash = MessageHashUtils.toEthSignedMessageHash(abiEncodePost(_p));
    return SignatureChecker.isValidSignatureNow(_addr, data_hash, _sig);
  }
}
