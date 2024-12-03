# [Spotlight](https://35.208.181.51/)
A web3 reddit

## Final Deliverables

### Final Project Report
[Please review our final project report](final-project-deliverables/COMS6998%20Fall%202024%20-%20Group%2011%20-%20Spotlight%20Final%20Project%20Report.pdf) for
a comprehensive overview of our team, available Spotlight features, how they work, the tokenomics of our project, and further features we would have
liked to have implemented.

### Try it out yourself
https://35.208.181.51/

**NOTE**: The certificate warning is expected. HTTPS was necessary for usage with our IPFS gateway. It is perfectly safe.

This is a GCP instance hosting the frontend NextJS UI and also our own Ethereum testnet through [forge's anvil](https://book.getfoundry.sh/reference/anvil/)
where the contract is deployed. We also deployed it on Polygon, but due to transaction times taking so much time, the user experience feels terrible.

Because we're using a local testnet, there's a faucet available and a "burner wallet." However, to access all of Spotlight's features you'll need
to use a [MetaMask](https://metamask.io/) wallet.

Here's how to get it setup:
* Install the MetaMask browser extension
* Setup your MetaMask account if you don't already have one
* Head on over to [Spotlight](https://35.208.181.51/)
* The burner wallet may automatically get connected. If so, go ahead and disconnect the wallet.
* Open the MetaMask extension, click on the top left icon to Select a Network, and click on "Add a custom network"
* Click on the dropown under the "Default RPC URL" field, and click "Add RPC URL"
* Copy & paste https://35.208.181.51:9545 in the "RPC URL" field
* Click "Add URL"
* Under "Chain ID", type 31337
* You should now see suggestions for the "Currency symbol" and "Network name" fields. You may use them.
![add-spotlight-to-metamask](https://github.com/user-attachments/assets/521cdb13-664d-4083-87b2-27ce23391775)

# Local Setup

This DApp was built using the [scaffold-eth2](https://docs.scaffoldeth.io/quick-start/installation) framework. Base
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
