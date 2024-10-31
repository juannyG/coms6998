// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Events.sol";

contract Reputation is ERC20 {
  address public immutable spotlightContract;
  uint256 private constant DECAY_INTERVAL = 15 minutes;
  uint256 private constant DECAY_RATE = 1; // 1% decay every 15 minutes
  mapping(address => uint256) private lastDecayTime;

  constructor(address _spotlightContract) ERC20("Reputation", "RPT") {
    require(_spotlightContract != address(0), "Spotlight address cannot be zero");
    spotlightContract = _spotlightContract;
  }

  /**
   * @dev Internal function to issue tokens
   * @param receiver The address that will receive the tokens
   * @param amount The number of tokens to issue (will be multiplied by 10^decimals)
   */
  function _issueToken(address receiver, uint256 amount) internal {
    require(receiver != address(0), "Cannot issue to zero address");

    uint256 tokenAmount = amount * 10 ** decimals();
    _mint(receiver, tokenAmount);

    emit TokenIssued(receiver, tokenAmount);
  }

  /**
   * @dev Internal function to burn tokens
   * @param account The address from which tokens will be burned
   * @param amount The number of tokens to burn
   */
  function _burnToken(address account, uint256 amount) internal {
    uint256 tokenAmount = amount * 10 ** decimals();
    uint256 currentBalance = balanceOf(account);

    if (currentBalance < tokenAmount) {
      // If burning would reduce balance below zero, burn all remaining tokens
      _burn(account, currentBalance);
    } else {
      _burn(account, tokenAmount);
    }

    emit TokenBurned(account, tokenAmount);
  }

  /**
   * @dev Issues 100 tokens for upvoting a post
   * @param receiver The address that will receive the tokens
   */
  function upvotePost(address receiver) external {
    require(msg.sender == spotlightContract, "Only Spotlight contract can issue tokens");
    _applyDecay(receiver); // Apply decay before issuing new tokens
    _issueToken(receiver, 100);
  }

  /**
   * @dev Issues 1 token for upvoting a comment
   * @param receiver The address that will receive the tokens
   */
  function upvoteComment(address receiver) external {
    require(msg.sender == spotlightContract, "Only Spotlight contract can issue tokens");
    _applyDecay(receiver); // Apply decay before issuing new tokens
    _issueToken(receiver, 10);
  }

  /**
   * @dev Burns 5 tokens for downvoting a post
   * @param account The address from which tokens will be burned
   */
  function downvotePost(address account) external {
    require(msg.sender == spotlightContract, "Only Spotlight contract can burn tokens");
    _applyDecay(account); // Apply decay before burning tokens
    _burnToken(account, 5);
  }

  /**
   * @dev Burns 1 token for downvoting a comment
   * @param account The address from which tokens will be burned
   */
  function downvoteComment(address account) external {
    require(msg.sender == spotlightContract, "Only Spotlight contract can burn tokens");
    _applyDecay(account); // Apply decay before burning tokens
    _burnToken(account, 1);
  }

  /**
   * Override balanceOf to apply decay
   * @dev Returns the balance of an account after applying decay
   * @param account The address to check balance for
   * @return The balance of the account after applying decay
   */
  function balanceOf(address account) public view override returns (uint256) {
    uint256 rawBalance = super.balanceOf(account);
    if (rawBalance == 0) return 0;

    uint256 timePassed = block.timestamp - lastDecayTime[account];
    if (timePassed < DECAY_INTERVAL) return rawBalance;

    uint256 periods = timePassed / DECAY_INTERVAL;
    uint256 decayedBalance = rawBalance;

    for (uint256 i = 0; i < periods; i++) {
      decayedBalance = (decayedBalance * (100 - DECAY_RATE)) / 100;
    }

    return decayedBalance;
  }

  /**
   * @dev Updates token balance with decay before any token operation
   * @param account The address to apply decay to
   */
  function _applyDecay(address account) internal {
    uint256 currentTime = block.timestamp;
    uint256 timePassed = currentTime - lastDecayTime[account];

    if (timePassed >= DECAY_INTERVAL) {
      uint256 periods = timePassed / DECAY_INTERVAL;
      uint256 currentBalance = balanceOf(account);

      if (currentBalance > 0) {
        // Calculate decay: (1 - DECAY_RATE/100)^periods
        uint256 newBalance = currentBalance;
        for (uint256 i = 0; i < periods; i++) {
          newBalance = (newBalance * (100 - DECAY_RATE)) / 100;
        }

        // Burn the decayed tokens
        if (newBalance < currentBalance) {
          _burn(account, currentBalance - newBalance);
        }
      }

      lastDecayTime[account] = currentTime - (timePassed % DECAY_INTERVAL);
    }
  }
}
