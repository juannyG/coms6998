import os

from web3 import Web3


if __name__ == '__main__':
    web3 = Web3(Web3.HTTPProvider(os.environ["ANVIL_HOST"]))
    
    if web3.is_connected():
        print("Connected to Anvil")
        print()
    else:
        print("Failed to connect to Anvil")
        exit(1)

    print('List of accounts')
    print('-' * 42)
    for acc in web3.eth.accounts:
        print(acc)
