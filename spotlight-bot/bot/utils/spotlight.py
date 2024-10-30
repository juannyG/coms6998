import json
import random
import time

from eth_abi.packed import encode_packed
from eth_account.messages import encode_defunct


def prep_create_post_args():
    ts = int(time.time())
    title = f"title #-{int(random.random() * 10 ** 6)}"
    content = f"content #-{int(random.random() * 10 ** 6)}"
    editor_json = json.dumps(
        {
            "root": {
                "children": [
                    {
                        "children": [
                            {
                                "detail": 0,
                                "format": 0,
                                "mode": "normal",
                                "style": "",
                                "text": content,
                                "type": "text",
                                "version": 1,
                            }
                        ],
                        "direction": "ltr",
                        "format": "",
                        "indent": 0,
                        "type": "paragraph",
                        "version": 1,
                        "textFormat": 0,
                        "textStyle": "",
                    }
                ],
                "direction": "ltr",
                "format": "",
                "indent": 0,
                "type": "root",
                "version": 1,
            }
        }
    )
    msg_p = encode_packed(['string', 'string', 'uint256', 'uint256'], [title, editor_json, ts, ts])
    msg = encode_defunct(hexstr=f"{msg_p.hex()}")
    return editor_json, title, ts, ts, msg
