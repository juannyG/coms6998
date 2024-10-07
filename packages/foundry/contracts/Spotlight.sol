//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";

contract Spotlight {
    address public owner;

    struct Profile {
        string username;
        string bio;
        string location;
        uint8 age;
        bool isRegistered;
    }

    mapping(address => Profile) profiles;
    mapping(bytes32 => bool) normalized_username_hashes;

    event ProfileRegistered(address indexed _address, string _username, string _bio, string _location, uint8 _age);

    constructor(address _owner) {
        owner = _owner;// msg.sender;

        profiles[address(0)] = Profile({username: "", bio: "", location: "", age: 0, isRegistered: false});
    }
    
    /**
     * Register a profile for a user
     * @param _username username of the user
     * @param _bio description
     * @param _location location
     * @param _age age
     */
    function registerProfile(string memory _username, string memory _bio, string memory _location, uint8 _age) public {
        // Make sure the address is not registered
        require(!profiles[msg.sender].isRegistered, "Profile already registered");

        // Integrity Check
        require(bytes(_username).length > 0);
        require(bytes(_username).length < 32);
        require(bytes(_bio).length < 512);
        require(bytes(_location).length < 256);
        require(_age > 0);
        require(_age < 150);

        string memory lowercase_username = toLower(_username);
        bytes32 hash = keccak256(abi.encodePacked(lowercase_username));
        require(normalized_username_hashes[hash] == false);

        normalized_username_hashes[hash] = true;
        profiles[msg.sender] = Profile({username: _username, bio: _bio, location: _location, age: _age, isRegistered: true});
        
        emit ProfileRegistered(msg.sender, _username, _bio, _location, _age);
    }

    /**
     * Check if a user is registered
     * @param a address of the user
     */
    function userRegistered(address a) public view returns (bool) {
        return profiles[a].isRegistered;
    }

    /**
     * Get the profile of a user
     * @param a address of the user
     */
    function getProfile(address a) public view returns (Profile memory) {
        // Make sure they do exist
        require(profiles[a].isRegistered == true);
        return profiles[a];
    }

    /**
     * Get the address of the owner
     */
    function getOwner() public view returns (address) {
        return owner;
    }

    function authenticate() public view returns (bool) {
        return msg.sender == owner;
    }

    function getAccount() public view returns (address) {
        return msg.sender;
    }


    // -------------- private methods ----------------

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
}
