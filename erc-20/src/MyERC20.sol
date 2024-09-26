// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MyERC20 is ERC20, Ownable {
    constructor() ERC20("MyERC20", "MyERC20") Ownable(msg.sender) {
    }

    function mint(address account, uint256 value) public onlyOwner {
        _mint(account, value);
    }
}