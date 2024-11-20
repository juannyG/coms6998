import { encrypt } from "@metamask/eth-sig-util";
import { toHex } from "viem";
import { TPendingPurchase, TPost } from "~~/types/spotlight";

const PendingPurchase = ({ post, pendingPurchase }: { post: TPost; pendingPurchase: TPendingPurchase }) => {
  console.log("Pending purchaser:", pendingPurchase);

  const acceptPurchase = async () => {
    const decryptedContent = await window.ethereum.request({
      method: "eth_decrypt",
      params: [toHex(Buffer.from(post.content, "utf8")), post.creator], // TODO: don't use post.creator
    });

    await new Promise(f => setTimeout(f, 500));
    const encryptedForPurchaser = encrypt({
      publicKey: pendingPurchase.pubkey,
      data: decryptedContent,
      version: "x25519-xsalsa20-poly1305",
    });
    console.log(encryptedForPurchaser);
  };

  const decline = async () => {
    console.log("call declinePurchase contract method");
  };

  const shortendAddr =
    pendingPurchase.purchaser.substring(0, 6) +
    "..." +
    pendingPurchase.purchaser.substring(pendingPurchase.purchaser.length - 4);

  return (
    <>
      <div>
        {shortendAddr} would like to purchase your post{" "}
        <button className="btn btn-primary" onClick={acceptPurchase}>
          Accept
        </button>
        <button className="btn btn-warning" onClick={decline}>
          Decline
        </button>
      </div>
    </>
  );
};

export default PendingPurchase;
