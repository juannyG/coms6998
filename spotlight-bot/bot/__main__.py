'''
pip install web3

yarn chain --balance 1000000

Usage: python3 spotlight-bot/bot

'''
import json
import os
import pathlib
import random
import signal
import time

from web3 import Web3

from utils.dep_setup import setup_bot_deps
from utils.spotlight import prep_create_post_args


TERMINATING = False


def signal_handler(sig, frame):
    global TERMINATING
    TERMINATING = True


signal.signal(signal.SIGINT, signal_handler)


def set_cwd():
    """
    Helper to make sure the current working directory is the top of the repo
    """
    cwd = pathlib.Path.cwd()
    while cwd.parts[-1] != 'coms6998':
        print(cwd)
        os.chdir(cwd.parent)
        cwd = pathlib.Path.cwd()


class SpotlightBot:
    CREATE_POST_OP = "createPost"
    DELETE_POST_OP = "deletePost"
    UPVOTE_POST_OP = "upvote"
    DOWNVOTE_POST_OP = "downvote"
    GET_PROFILE_OP = "getProfile"
    OPS = [CREATE_POST_OP, DELETE_POST_OP, UPVOTE_POST_OP, DOWNVOTE_POST_OP, GET_PROFILE_OP]

    def __init__(self, w3, bot_acct, spotlight):
        self.w3 = w3
        self.bot_acct = bot_acct
        self.spotlight = spotlight

        self._post_ids = []

    def run(self):
        print("Starting up bot operations...\n")
        try:
            while not TERMINATING:
                op = self.get_next_op()
                if op == self.CREATE_POST_OP or len(self._post_ids) == 0:
                    self.create_post()
                elif op == self.DELETE_POST_OP:
                    # We can only delete if there are posts to delete!
                    self.delete_post()
                elif op == self.UPVOTE_POST_OP:
                    self.upvote()
                elif op == self.DOWNVOTE_POST_OP:
                    self.downvote()
                elif op == self.GET_PROFILE_OP:
                    self.get_profile()
                else:
                    # Default case, just create a post
                    self.create_post()

                sleep_duration = random.randint(5, 10)
                print(f"sleeping for {sleep_duration}s...\n")
                time.sleep(sleep_duration)
        except Exception as exc:
            print("An unhandled exception occurred")
            print(exc)

        self.delete_profile()
        print("Shutting down")

    def get_next_op(self):
        return self.OPS[random.randint(0, len(self.OPS) - 1)]

    def create_post(self):
        print("Creating Post")
        title, editor_json, nonce, msg = prep_create_post_args()
        signed_msg = self.bot_acct.sign_message(msg)
        sig = Web3.to_hex(signed_msg.signature)
        tx_hash = self.spotlight.functions.createPost(title, editor_json, nonce, sig).transact()
        print(f"sig/postID: {sig}")
        print(f"txID: {Web3.to_hex(tx_hash)}\n")
        self._post_ids.append(sig)

    def delete_post(self):
        idx = random.randint(0, len(self._post_ids) - 1)
        post_sig = self._post_ids.pop(idx)
        print(f"Deleting post {post_sig}")
        tx_hash = self.spotlight.functions.deletePost(post_sig).transact()
        print(f"txID: {Web3.to_hex(tx_hash)}\n")

    def delete_profile(self):
        print("Deleting profile")
        tx_hash = self.spotlight.functions.deleteProfile().transact()
        print(f"txID: {Web3.to_hex(tx_hash)}\n")

    def upvote(self):
        idx = random.randint(0, len(self._post_ids) - 1)
        post_sig = self._post_ids.pop(idx)
        print(f"Upvoting {post_sig}")
        tx_hash = self.spotlight.functions.upvote(post_sig).transact()
        print(f"txID: {Web3.to_hex(tx_hash)}\n")

    def downvote(self):
        idx = random.randint(0, len(self._post_ids) - 1)
        post_sig = self._post_ids.pop(idx)
        print(f"Downvoting {post_sig}")
        tx_hash = self.spotlight.functions.upvote(post_sig).transact()
        print(f"txID: {Web3.to_hex(tx_hash)}\n")

    def get_profile(self):
        print("Getting profile")
        print(self.spotlight.functions.getProfile(self.bot_acct.address).call())


if __name__ == '__main__':
    set_cwd()

    w3, bot_acct, spotlight = setup_bot_deps()
    bot = SpotlightBot(w3, bot_acct, spotlight)
    bot.run()
