// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

contract SpotlightErrors {
  error ProfileNotExist();

  error ProfileAlreadyExist();

  error UsernameTaken();

  error ContentCannotBeEmpty();

  error TitleCannotBeEmpty();

  error AddressNotRegistered();

  error PostNotFound();

  error OnlyCreatorCanEdit();

  error AlreadyVoted();

  error AlreadyDownvoted();

  error InvalidSignature();

  error UsernameCannotBeEmpty();

  error UsernameTooLong();

  error SpotlightAddressCannotBeZero();

  error CannotIssueToZeroAddress();

  error OnlySpotlightContractCanIssueTokens();

  error OnlySpotlightContractCanBurnTokens();

  error AvatarCIDCannotBeEmpty();

  error InsufficentPostFunds();

  error PostAlreadyPurchased();

  error PostNotPaywalled();

  error CreatorCannotPayForOwnContent();

  error OnlySpotlightCanManagePosts();

  error ReputationAddressCannotBeZero();

  error PostCreatorCannotBeZero();

  error CommentCannotBeEmpty();

  error OnlyCreatorCanDeclinePurchase();

  error NoPendingPurchaseFound();

  error OnlyCreatorCanAcceptPurchase();
}
