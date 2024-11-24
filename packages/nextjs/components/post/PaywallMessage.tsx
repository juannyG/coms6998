import { useAccount } from "wagmi";
import { TPost } from "~~/types/spotlight";

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

  const showPaywalMsg = () => {
    const unsupportedMsg = `This post is currently paywalled, but you are using a wallet \
      that does not support the required features to engage with our \
      payment procotol.`;
    const purchasePendingMsg = "You have purchased this post. Please wait for review by it's creator.";
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
    <>
      <div className="italic">
        <div>{trimId} is paywalled.</div>
        <div>{showPaywalMsg()}</div>
      </div>
    </>
  );
};

export default PaywallMessage;
