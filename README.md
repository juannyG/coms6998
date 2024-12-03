# Spotlight
A web3 reddit.

## Final Deliverables

TODO: Render final report to PDF, add to repo, link to it here

TODO: TOC


# Local Setup

This dApp was built using the [scaffold-eth2](https://docs.scaffoldeth.io/quick-start/installation) framework. Base
depency versions are as follows:
* Node v18.19.1
* Yarn v3.2.3
* Git

Our local testnet tool of choice was [foundry](https://book.getfoundry.sh/getting-started/installation).

After cloning the repo and taking care of the above dependencies, install the DApp's dependencies:
```sh
yarn install
```

To run Spotlight locally, you'll need to 
1. `cp packages/foundry/.env.example packages/foundry/.env`
2. `yarn chain` - Bring up the local testnet. This accepts arguments for [forge's anvil](https://book.getfoundry.sh/reference/anvil/)
3. `yarn deploy` - Deploy the contract to the local testnet
4. `yarn start` - Bring up the local NextJS development server

You may now open a web browser and navigate to http://localhost:3000 to interact with the DApp locally.

**NOTE**: port 3000 is the default port used by NextJS for serving content. If it is not available, it will increment the port number
until it finds a free port. Please double check the output of `yarn start`.
