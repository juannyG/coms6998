import { useAccount } from "wagmi";
import { TPost } from "~~/types/spotlight";

const PaywallMessage = ({
  post,
  paywallSupported,
  purchasePending,
}: {
  post: TPost;
  paywallSupported: boolean;
  purchasePending: boolean | undefined;
}) => {
  const { address } = useAccount();

  const trimId = post.id.substring(0, 6) + "..." + post.id.substring(post.id.length - 4);
  const unsupportedMsg = `This post is currently paywalled, but you are using a wallet \
    that does not support the required features to engage with our \
    payment procotol.`;
  const purchasePendingMsg = "You have purchased this post. Please wait for review by it's creator.";
  const purchaseMsg = "Please click the unlock icon to purchase this post from it's creator.";
  const creatorMsg = "Click the unlock button to decrypt your post.";

  return (
    <>
      <div className="italic">
        <div>{trimId} is paywalled.</div>
        {!paywallSupported && unsupportedMsg}
        {paywallSupported && post.creator != address && purchasePending && purchasePendingMsg}
        {paywallSupported && post.creator != address && !purchasePending && purchaseMsg}
        {paywallSupported && post.creator == address && creatorMsg}
      </div>
    </>
  );
};

export default PaywallMessage;
