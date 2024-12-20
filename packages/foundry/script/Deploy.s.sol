//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/Spotlight.sol";
import "../contracts/Reputation.sol";
import "./DeployHelpers.s.sol";

contract DeployScript is ScaffoldETHDeploy {
  error InvalidPrivateKey(string);

  function run() external {
    uint256 deployerPrivateKey = setupLocalhostEnv();
    if (deployerPrivateKey == 0) {
      revert InvalidPrivateKey(
        "You don't have a deployer account. Make sure you have set DEPLOYER_PRIVATE_KEY in .env or use `yarn generate` to generate a new random account"
      );
    }
    vm.startBroadcast(deployerPrivateKey);

    // Deploy RTP first
    Reputation rtp = new Reputation();
    console.logString(string.concat("Reputation deployed at: ", vm.toString(address(rtp))));

    // and then Spotlight
    Spotlight spotlight = new Spotlight(vm.addr(deployerPrivateKey), address(rtp));
    console.logString(string.concat("Spotlight deployed at: ", vm.toString(address(spotlight))));

    // Store deployments for export
    deployments.push(Deployment("Spotlight", address(spotlight)));
    vm.stopBroadcast();

    /**
     * This function generates the file containing the contracts Abi definitions.
     * These definitions are used to derive the types needed in the custom scaffold-eth hooks, for example.
     * This function should be called last.
     */
    exportDeployments();
  }

  function test() public { }
}
