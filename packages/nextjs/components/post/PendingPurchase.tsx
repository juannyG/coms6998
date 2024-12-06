import { encrypt } from "@metamask/eth-sig-util";
import { toHex } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { TPendingPurchase, TPost } from "~~/types/spotlight";
import { notification } from "~~/utils/scaffold-eth";

const PendingPurchase = ({ post, pendingPurchase }: { post: TPost; pendingPurchase: TPendingPurchase }) => {
  const { address } = useAccount();
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");

  if (!address) {
    return;
  }

  const acceptPurchase = async () => {
    try {
      const decryptedContent = await window.ethereum.request({
        method: "eth_decrypt",
        params: [toHex(Buffer.from(post.content, "utf8")), address],
      });

      await new Promise(f => setTimeout(f, 500));
      const encryptedForPurchaser = encrypt({
        publicKey: pendingPurchase.pubkey,
        data: decryptedContent,
        version: "x25519-xsalsa20-poly1305",
      });

      console.log(encryptedForPurchaser);
      const strEncryptedPost = JSON.stringify(encryptedForPurchaser);
      await new Promise(f => setTimeout(f, 500));
      await writeSpotlightContractAsync({
        functionName: "acceptPurchase",
        args: [post.id, pendingPurchase.purchaser, strEncryptedPost],
      });
    } catch (e: any) {
      console.log(e);
      notification.error("Could not accept purchase!");
    }
  };

  const decline = async () => {
    try {
      await writeSpotlightContractAsync({
        functionName: "declinePurchase",
        args: [post.id, pendingPurchase.purchaser],
      });
    } catch (e: any) {
      console.log(e);
      notification.error("Could not decline purchase!");
    }
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
