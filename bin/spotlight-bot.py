'''
Bot to 

usage:
python bin/spotlight-bot.py
'''

import json
import os
import pathlib
import random

from web3 import Web3
from web3.middleware import SignAndSendRawMiddlewareBuilder

LOCAL_CHAIN_ADDR = 'http://127.0.0.1:8545'
FUND_AMT = 1000
SPOTLIGHT_ABI_PATH = 'packages/foundry/out/Spotlight.sol/Spotlight.json'
SPOTLIGHT_CONTRACT_ADDR_PATH = 'packages/foundry/broadcast/Deploy.s.sol/31337/run-latest.json'


def set_cwd():
    """
    Helper to make sure the current working directory is the top of the repo
    """
    cwd = pathlib.Path.cwd()
    if cwd.parts[-1] == 'bin':
        os.chdir(cwd.parent)


def get_spotlight_abi():
    abi = None
    with open(SPOTLIGHT_ABI_PATH, 'r') as f:
        j = json.loads(f.read())
        return j['abi']


def get_spotlight_contract_addr():
    with open(SPOTLIGHT_CONTRACT_ADDR_PATH, 'r') as f:
        j = json.loads(f.read())
        for tx in j['transactions']:
            if tx['transactionType'] == "CREATE" and tx['contractName'] == "Spotlight":
                return tx['contractAddress']


class SpotlightBot:
    def __init__(self, spotlight, w3, bot_acct):
        self.bot_acct = bot_acct
        self.spotlight = spotlight
        self.w3 = w3


if __name__ == '__main__':
    set_cwd()

    w3 = Web3(Web3.HTTPProvider(LOCAL_CHAIN_ADDR))
    if not w3.is_connected():
        print(f"Could not connect to local chain @ {LOCAL_CHAIN_ADDR}. Shutting down...")
        exit(1)

    # Create the bot account, fund it, and connect to the contract
    # Make the bot the default tx signer
    # https://web3py.readthedocs.io/en/stable/middleware.html#web3.middleware.SignAndSendRawMiddlewareBuilder
    print("#" * 50)
    print("Initializing setup")
    bot_acct = w3.eth.account.create()
    w3.middleware_onion.inject(SignAndSendRawMiddlewareBuilder.build(bot_acct), layer=0)
    w3.eth.default_account = bot_acct.address
    print(f"Created bot account @ {bot_acct.address}\n")

    fund_source = w3.eth.accounts[random.randint(0, 9)]
    print(f"Funding bot from randomly selected source account")
    print(f"Amount: {FUND_AMT} ETH")
    print(f"Source account: {fund_source}")
    tx_hash = w3.eth.send_transaction(
        {"from": fund_source, "to": bot_acct.address, "value": Web3.to_wei(FUND_AMT, 'ether')}
    )
    res = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Bot account balance: {Web3.from_wei(w3.eth.get_balance(bot_acct.address), 'ether')}\n")

    spotlight_abi = get_spotlight_abi()
    spotlight_contract_addr = get_spotlight_contract_addr()
    spotlight = w3.eth.contract(address=Web3.to_checksum_address(spotlight_contract_addr), abi=spotlight_abi)

    username = f'botAccount-{int(random.random() * 10 ** 6)}'
    print(f"Registering profile: {username}")
    tx_hash = spotlight.functions.registerProfile(username).transact()
    w3.eth.wait_for_transaction_receipt(tx_hash)

    print("Getting community posts...")
    print(spotlight.functions.getCommunityPosts().call())

    print(f"\nSetup complete!")
    print("#" * 50)
    print("")

    print("Starting up bot operations...\n")
