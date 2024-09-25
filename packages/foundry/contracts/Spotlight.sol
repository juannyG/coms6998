//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";

contract Spotlight {
    address public owner;

    struct Profile {
        // TODO: avatar img?
        string username; // TODO: validate 32 byte len for EVM packing
    }

    Profile[] profiles;
    mapping(address => uint256) profile_idx_map;

    constructor(address _owner) {
        owner = _owner;

        // push an empty profile into the 0 position - no one can every occupy this
        profiles.push(Profile({username: ""}));
        profile_idx_map[address(0)] = 0;
    }

    function registerProfile(string memory _username) public {
        // Make sure they don't exist
        require(profile_idx_map[msg.sender] == 0);
        profile_idx_map[msg.sender] = profiles.length;
        profiles.push(Profile({username: _username}));
    }

    function isRegistered(address a) public view returns (bool) {
        if (profile_idx_map[a] == 0) {
            return false;
        }
        return true;
    }

    function getProfile(address a) public view returns (string memory) {
        // Make sure they do exist
        require(profile_idx_map[a] > 0);
        return profiles[profile_idx_map[a]].username;
    }
}
