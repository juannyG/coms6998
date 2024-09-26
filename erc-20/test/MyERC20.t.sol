// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {MyERC20} from "../src/MyERC20.sol";

contract MyERC20Test is Test {
    MyERC20 public myERC20;

    address alice = makeAddr("alice");
    
    function setUp() public {
        myERC20 = new MyERC20();
    }

    function test_Mint() public {
        uint256 value = 0.15 ether;
        myERC20.mint(alice, value);
        assertEq(myERC20.balanceOf(alice), value);
    }

    function test_MintFailIfSenderIsNotOwner() public {
        uint256 value = 0.15 ether;
        vm.expectRevert();
        vm.startPrank(alice);
        myERC20.mint(alice, value);
        vm.stopPrank();
    }
}