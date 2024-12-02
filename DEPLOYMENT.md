# Deploying to Sepolia

## Prerequisites
* An address private key with sufficient Sepolia ETH
* [Etherscan](https://etherscan.io/login) API key for verifying contract on Etherscan
* [Alchemy API key](https://docs.alchemy.com/docs/alchemy-quickstart-guide) (API access to Sepolia miner node)
* Create a new app in Alchemy
  * Chose Ethereum testnet Sepolia to get the API key

## Manual deployment to Sepolia
* Populate vars in `packages/foundry/.env` - these are the values you prepared in the Prerequisites section
  * `DEPLOYER_PRIVATE_KEY`
  * `ETHERSCAN_API_KEY`
  * `ALCHEMY_API_KEY`
* `yarn deploy --network sepolia` - Deploy the contract to Sepolia
* `yarn verify --network sepolia` - [Verify the contract on Sepolia](https://book.getfoundry.sh/forge/deploying?highlight=verify#verifying-a-pre-existing-contract)

## Configure NextJS to interact with contract on Sepolia testnet
Update [scaffold.config.ts](packages/nextjs/scaffold.config.ts) and modify the `targetNetworks` key as described in the comments.

From:
```
  targetNetworks: [chains.foundry],
  // targetNetworks: [chains.foundry, chains.sepolia],
```
To:
```
  // targetNetworks: [chains.foundry],
  targetNetworks: [chains.foundry, chains.sepolia],
```

## Import RPT into Metamask wallet
* Click "Import tokens"
* Drop in RPT token address on Sepolia (currently here: https://sepolia.etherscan.io/token/0xd5af0c2c5db2249dfc4a912c536fdfe1ef8ab52a?a=0x1292D9741379cFb7E26F918761E88EF7930b8468)

# IPFS and web3.storage

We have a primary key/proof in the NextJS app we use to delegate permissions out to the client's browser.

The commands for how to generate a key/proof pair can be found here: https://web3.storage/docs/how-to/upload/#bring-your-own-delegations

The docs refer to `KEY` and `PROOF` vars - we prepend `W3S_` to them in `packages/nextjs/.env` for better namespacing.