// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Reputation is ERC20 {
    // Events to track token issuance
    event TokenIssued(address indexed receiver, uint256 amount);
    
    // Mapping to track if an address has already received their token
    mapping(address => bool) private _hasReceivedToken;
    
    constructor() ERC20("Reputation", "RPT") {}
    
    /**
     * @dev Internal function to issue tokens, can only be called by contract functions
     * @param receiver The address that will receive the token
     */
    function _issueToken(address receiver) internal {
        require(receiver != address(0), "Cannot issue to zero address");
        require(!_hasReceivedToken[receiver], "Address has already received a token");
        
        // Issue exactly 1 token (considering decimals)
        uint256 amount = 1 * 10 ** decimals();
        _mint(receiver, amount);
        
        // Mark this address as having received their token
        _hasReceivedToken[receiver] = true;
        
        emit TokenIssued(receiver, amount);
    }
    
    /**
     * @dev Example function that could trigger token issuance
     * You would replace this with your actual business logic
     */
    function exampleContractFunction(address user) internal {
        // Add your conditions here for when a token should be issued
        // For example:
        // require(someCondition, "Condition not met");
        
        _issueToken(user);
    }
    
    /**
     * @dev Checks if an address has already received their token
     * @param account The address to check
     * @return bool Whether the address has received a token
     */
    function hasReceivedToken(address account) public view returns (bool) {
        return _hasReceivedToken[account];
    }
}
