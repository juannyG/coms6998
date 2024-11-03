import json
import random

from web3 import Web3
from web3.middleware import SignAndSendRawMiddlewareBuilder

FUND_AMT = 1000
LOCAL_CHAIN_ADDR = 'http://127.0.0.1:8545'

# These paths assume the CWD is the top of the repo
SPOTLIGHT_ABI_PATH = 'packages/foundry/out/Spotlight.sol/Spotlight.json'
SPOTLIGHT_CONTRACT_ADDR_PATH = 'packages/foundry/broadcast/Deploy.s.sol/31337/run-latest.json'


def get_spotlight_abi():
    with open(SPOTLIGHT_ABI_PATH, 'r') as f:
        j = json.loads(f.read())
        return j['abi']


def get_spotlight_contract_addr():
    with open(SPOTLIGHT_CONTRACT_ADDR_PATH, 'r') as f:
        j = json.loads(f.read())
        for tx in j['transactions']:
            if tx['transactionType'] == "CREATE" and tx['contractName'] == "Spotlight":
                return tx['contractAddress']


def setup_bot_deps():
    w3 = Web3(Web3.HTTPProvider(LOCAL_CHAIN_ADDR))
    if not w3.is_connected():
        print(f"Could not connect to local chain @ {LOCAL_CHAIN_ADDR}. Shutting down...")
        exit(1)
    w3 = w3

    # Create the bot account, fund it, and connect to the contract
    # Make the bot the default tx signer of the w3 context
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
    print(f"Bot account balance: {Web3.from_wei(w3.eth.get_balance(bot_acct.address), 'ether')}")
    print(f"txID: {Web3.to_hex(tx_hash)}\n")

    spotlight_abi = get_spotlight_abi()
    spotlight_contract_addr = get_spotlight_contract_addr()
    spotlight = w3.eth.contract(address=Web3.to_checksum_address(spotlight_contract_addr), abi=spotlight_abi)

    username = f'botAccount-{int(random.random() * 10 ** 6)}'
    print(f"Registering profile: {username}")
    tx_hash = spotlight.functions.registerProfile(username).transact()
    print(f"txID: {Web3.to_hex(tx_hash)}\n")
    w3.eth.wait_for_transaction_receipt(tx_hash)

    print("Getting community posts...")
    spotlight.functions.getCommunityPosts().call()

    print(f"\nSetup complete!")
    print("#" * 50)
    print("")

    return w3, bot_acct, spotlight
