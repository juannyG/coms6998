import Image from "next/image";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { TPost } from "~~/types/spotlight";
import { notification } from "~~/utils/scaffold-eth";

const PaywallMessage = ({
  post,
  paywallSupported,
  purchasePending,
  purchasedPost,
}: {
  post: TPost;
  paywallSupported: boolean;
  purchasePending: boolean;
  purchasedPost: TPost;
}) => {
  const { address } = useAccount();
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");

  const decline = async () => {
    try {
      await writeSpotlightContractAsync({
        functionName: "declinePurchase",
        args: [post.id, address],
      });
    } catch (e: any) {
      console.log(e);
      notification.error("Could not decline purchase!");
    }
  };

  const showPaywalMsg = () => {
    const unsupportedMsg = `This post is currently paywalled, but you are using a wallet \
      that does not support the required features to engage with our \
      payment procotol.`;
    const purchasePendingMsg = (
      <>
        You have purchased this post. Please wait for review by it&apos;s creator.
        <br />
        <div className="grid place-content-center">
          <div>
            <button className="btn btn-warning" onClick={decline}>
              Cancel Purchase
            </button>
          </div>
        </div>
      </>
    );
    const purchaseMsg = "Please click the unlock icon to purchase this post from it's creator.";
    const creatorMsg = "Click the unlock button to decrypt your post.";
    const purchasedMsg = (
      <>
        You have purchased this post and it is available for viewing.
        <br />
        Click the unlock button to decrypt your post.
      </>
    );

    if (!paywallSupported) return unsupportedMsg;
    if (post.creator == address) return creatorMsg;
    if (purchasedPost.content.length > 0) return purchasedMsg;
    if (purchasePending) return purchasePendingMsg;
    return purchaseMsg;
  };

  const trimId = post.id.substring(0, 6) + "..." + post.id.substring(post.id.length - 4);

  return (
    <div className="bg-gray-200 my-4 p-4 rounded-lg">
      <div className="italic flex flex-col w-full items-center backdrop-blur-md bg-blue-100/30 rounded-lg">
        <Image height={40} width={40} src="/padlock.png" alt="lock" className="py-2" />
        <div>{trimId} is paywalled.</div>
        <div>{showPaywalMsg()}</div>
      </div>
    </div>
  );
};

export default PaywallMessage;
