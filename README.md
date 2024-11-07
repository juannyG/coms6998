# Setup

First, install [foundry](https://book.getfoundry.sh/getting-started/installation)

Next, install the app dependencies
```sh
yarn install
```

To run Spotlight locally, you
1. `yarn chain` - Bring up the local testnet. This accepts arguments for [forge's anvil](https://book.getfoundry.sh/reference/anvil/)
2. `yarn start` - Bring up the local NextJS development server
3. `yarn deploy` - Deploy the contract to the local testnet

# Deploying to Sepolia

## Prerequisites
* An address private key with sufficient Sepolia ETH
* Alchemy API key (API access to Sepolia miner node)
* Create a new app in Alchemy
  * Chose Ethereum testnet Sepolia to get the API key
* Etherscan API key for verifying contract on Etherscan

## Manual deployment to Sepolia
* Populate vars in `packages/foundry/.env` - these are the values you prepared in the Prerequisites section
  * `DEPLOYER_PRIVATE_KEY`
  * `ETHERSCAN_API_KEY`
  * `ALCHEMY_API_KEY`
* `yarn deploy --network sepolia` - Deploy the contract to Sepolia
* `yarn verify --network sepolia` - [Verify the contract on Sepolia](https://book.getfoundry.sh/forge/deploying?highlight=verify#verifying-a-pre-existing-contract)

## Configure NextJS to interact with contract on Sepolia testnet
If you did NOT deploy the changes to Sepolia or you have since done a `yarn deploy` to deploy the
Spotlight contract to your local foundry network, you will not have the Spotlight contract address
in `contracts/deployedContracts.ts`.

To point the NextJS app at Sepolia, we need to change the chain ID and Spotlight address in `contracts/deployedContracts.ts` to
* `11155111` - Chain ID for Sepolia
* `0x...`    - The deployed address of the contract on Sepolia testnet.

Example, the MVP Spotlight contract deployed to Sepolia is located @ `0xe4C755d54319F934B3D1ff420C97017A0DAee652`, so we would
need to update `contracts/deployedContracts.ts` from
```
  31337: {
    Spotlight: {
      address: "0x0000111122223333444455556666777788889999",
```
to
```
 11155111: {
    Spotlight: {
      address: "0xe4C755d54319F934B3D1ff420C97017A0DAee652",
```

## Import RPT into Metamask wallet
* Click "Import tokens"
* Drop in RPT token address on Sepolia (currently here: https://sepolia.etherscan.io/token/0xd5af0c2c5db2249dfc4a912c536fdfe1ef8ab52a?a=0x1292D9741379cFb7E26F918761E88EF7930b8468)

# VSCode

Helpful Extensions

```
Name: Solidity
Id: NomicFoundation.hardhat-solidity
Description: Solidity and Hardhat support by the Hardhat team
Version: 0.8.5
Publisher: Nomic Foundation
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity
```
