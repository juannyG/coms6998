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
    mapping(address => bool) authorizedUsers;

    event ProfileRegistered(address indexed _address, string _username, string _bio, string _location, uint8 _age);

    constructor(address _owner) {
        owner = _owner;// msg.sender;

        profiles[address(0)] = Profile({username: "", bio: "", location: "", age: 0, isRegistered: false});
    }

    // ----------------------------------------- Profile Management -----------------------------------------
    
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
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(bytes(_username).length < 32, "Username cannot be longer than 32 characters");
        require(bytes(_bio).length < 512, "Bio cannot be longer than 512 characters");
        require(bytes(_location).length < 256,  "Location cannot be longer than 256 characters");
        require(_age > 0, "Age cannot be less than 0");
        require(_age < 150, "Age cannot be greater than 150");

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

    // ----------------------------------------- Authorization -----------------------------------------

    /**
     * Authorize a user to interact with the contract
     * @param user address of the user
     */
    function authorizeUser(address user) public {
        // TODO: requirements for authorization.
        require(!authorizedUsers[user], "User is already authorized");
        require(profiles[user].isRegistered, "User must have a registered profile");
        authorizedUsers[user] = true;
    }

    /**
     * Revoke authorization from a user
     * @param user address of the user
     */
    function revokeAuthorization(address user) public {
        require(authorizedUsers[user], "User is not authorized");
        require(profiles[user].isRegistered, "User must have a registered profile");
        authorizedUsers[user] = false;
    }

    /**
     * Check if a user is authorized
     * @param user address of the user
     */
    function isAuthorized(address user) public view returns (bool) {
        return authorizedUsers[user];
    }

    
    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender], "Not an authorized user");
        _;
    }

    // ----------------------------------------- Transaction Management -----------------------------------------

    /**
     * Send a transaction to another address from msg.sender
     * @param _to address to send to
     */
    function sendTransaction(address payable _to) public payable onlyAuthorized {
        require(msg.value <= address(msg.sender).balance, "Insufficient balance");
        require(_to != address(0), "Cannot send to address 0");
        require(msg.value > 0, "Amount must be greater than 0");

        (bool success, ) = _to.call{value: msg.value}("");
        require(success, "Transfer failed");
    }

    /**
     * Get the balance of an account
     * @param _addr address of the account
     */
    function getAccountAmount(address _addr) public view returns (uint256) {
        return _addr.balance;
    }

    /**
     * Get the address of the owner
     */
    function getOwner() public view returns (address) {
        return owner;
    }

    function getAccount() public view returns (address) {
        return msg.sender;
    }

    receive() external payable {}
    fallback() external payable {}


    // ----------------------------------------- Utility Functions -----------------------------------------

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
