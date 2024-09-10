# COMS6998 Eng Web3 and Blockchain Applications

# Getting started

First, we need to build our images so that we'll have a container with the [foundry tools](https://book.getfoundry.sh) and a python container for dApp experimentation.
```
docker-compose build
docker-compose up
```

This will run the `test_conn.py` file here which simply tests the connection to the container running `anvil` and list out the accounts that `anvil` setup.

Useful commands
* `docker-compose run --rm dapp bash` - drops you into a bash shell

# References
* Project
  * [Running doc for ideas](https://docs.google.com/document/d/1F2TTU--XKvRfTHGBtdtGcGrCxYsJBWgz-0Gvoo-NarA/edit?usp=sharing)
* [Solidity Language Manual](https://docs.soliditylang.org)
* [Foundry docs](https://book.getfoundry.sh)
* [Python web3 docs](https://web3py.readthedocs.io)
* Getting started resources
  * https://marmooz.hashnode.dev/hello-world-web3-app-or-full-stack
  * https://medium.com/@jtriley15/the-foundry-evm-development-environment-f198f2e4c372
  * https://medium.com/@natelapinski/run-your-own-ethereum-testnet-using-anvil-and-python-7e18c93a4315
