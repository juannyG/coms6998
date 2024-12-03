# Spotlight
A web3 reddit.

## Final Deliverables

### Final Project Report
[Please review our final project report](final-project-deliverables/COMS6998%20Fall%202024%20-%20Group%2011%20-%20Spotlight%20Final%20Project%20Report.pdf) for
a comprehensive overview of how Spotlight works, the tokenomics of our project, and further features we would have liked to have implemented.

### Try it out yourself!
If you'd like to try Spotlight out first hand, we currently have a GCP instance which is hosting the frontend NextJS UI and also our own Ethereum testnet through [forge's anvil](https://book.getfoundry.sh/reference/anvil/).

It is located here: https://35.208.181.51/

**NOTE**: The certificate warning is expected. HTTPS was necessary for usage with our IPFS gateway. It is perfectly safe.

Because this is a local testnet, the DApp comes with a "burner wallet." After registering, you may interact directly with the contract if you wish,
using the "Debug Contracts" link at the top of the navbar or dig more deeply into transactions and addresses using the "Block Explorer."
(_Both of these tools were provided by the [scaffold-eth2](https://docs.scaffoldeth.io/quick-start/installation) framework. We made some tweaks to it, but
these two things were NOT developed by the team._)

however, to interact with the "paywall post" features, you'll need to use a [MetaMask](https://metamask.io/) wallet.

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
