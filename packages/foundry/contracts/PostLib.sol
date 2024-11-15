// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

library PostLib {
  /// @notice Structure to store the reference to a post
  struct Post {
    bytes id;
    address creator;
    bytes signature;
    bytes w3cid;
    uint256 createdAt;
    uint256 lastUpdatedAt;
    uint256 upvoteCount;
    uint256 downvoteCount;
  }

  struct Comment {
    address commenter;
    string content;
    uint256 createdAt;
  }
  // TODO: Add a community pointer
  /* NICE TO HAVE: 
      If we want to get fancy, we can ensure uniqueness by requiring post creation to include a nonce that is equal to 
      exactly 1 + userProfile.postNonce
  */

  function abiEncodePost(string memory _title, string memory _content, uint256 _nonce)
    internal
    pure
    returns (bytes memory)
  {
    // Include everything EXCEPT `id` which is the signature itself and `creator`
    return abi.encodePacked(_title, _content, _nonce);
  }

  function isValidPostSignature(
    address _addr,
    string memory _title,
    string memory _content,
    uint256 _nonce,
    bytes memory _sig
  ) internal view returns (bool) {
    bytes32 data_hash = MessageHashUtils.toEthSignedMessageHash(abiEncodePost(_title, _content, _nonce));
    return SignatureChecker.isValidSignatureNow(_addr, data_hash, _sig);
  }
}
