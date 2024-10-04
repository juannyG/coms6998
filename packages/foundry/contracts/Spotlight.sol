//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";

contract Spotlight {
    address public owner;

    struct Profile {
        // TODO: avatar img?
        string username; // TODO: Could we store bytes instead for better for EVM packing
    }

    mapping(address => Profile) profiles;
    mapping(bytes32 => bool) normalized_username_hashes;

    constructor(address _owner) {
        owner = _owner;
    }

    function registerProfile(string memory _username) public {
        // Make sure they don't exist
        require(bytes(profiles[msg.sender].username).length == 0);
        require(bytes(_username).length > 0);
        require(bytes(_username).length < 32);

        string memory lowercase_username = toLower(_username);
        bytes32 hash = keccak256(abi.encodePacked(lowercase_username));
        require(normalized_username_hashes[hash] == false);

        normalized_username_hashes[hash] = true;
        profiles[msg.sender] = Profile({username: _username});
    }

    function toLower(string memory _s) private pure returns (string memory) {
        // Create new bytes so we don't modify memory reference of _s
        bytes memory orig_s = bytes(_s);
        bytes memory new_s = new bytes(orig_s.length);

        for (uint8 i = 0; i < orig_s.length; i++) {
            new_s[i] = orig_s[i];

            // If A <= s[i] <= Z
            if (uint8(orig_s[i]) >= 65 && uint8(orig_s[i]) <= 90) {
                new_s[i] = bytes1(uint8(orig_s[i]) + 32);
            }
        }
        return string(new_s);
    }

    function isRegistered(address a) public view returns (bool) {
        return bytes(profiles[a].username).length > 0;
    }

    function getProfile(address a) public view returns (string memory) {
        // Make sure they do exist
        require(bytes(profiles[a].username).length > 0);
        return profiles[a].username; // TODO: return Profile object
    }
}
