import { useContext, useEffect, useState } from "react";
import PostDeleteModal from "./DeleteModal";
import PostEditModal from "./EditModal";
import PostFooter from "./Footer";
import PostHeader from "./Header";
import ManagePendingPurchases from "./ManagePendingPurchases";
import PaywallMessage from "./PaywallMessage";
import { Hex, parseEther, toHex } from "viem";
import { useAccount } from "wagmi";
import Viewer from "~~/app/feed/richTextEditor/Viewer";
import { PaywallSupportContext } from "~~/contexts/PaywallSupport";
import { PostDisplayContext } from "~~/contexts/Post";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const Post = ({ postId }: { postId: Hex }) => {
  const { address } = useAccount();
  const { compactDisplay, showPostMgmt, onProfile } = useContext(PostDisplayContext);
  const { paywallSupported } = useContext(PaywallSupportContext);
  const [content, setContent] = useState("");
  const [decrypted, setDecrypted] = useState(false);
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");
  const { data: purchasePending } = useScaffoldReadContract({
    account: address,
    contractName: "Spotlight",
    functionName: "isPurchasePending",
    args: [postId],
    watch: true,
  });

  const { data: post } = useScaffoldReadContract({
    account: address,
    contractName: "Spotlight",
    functionName: "getPost",
    args: [postId],
    watch: true,
  });

  useEffect(() => {
    if (post !== undefined) {
      if (!post.paywalled) {
        setContent(post.content);
        setDecrypted(true);
      }
    }
  }, [post]);

  if (address === undefined || post === undefined) {
    return;
  }
  const onClickUnlockPost = async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    if (address == post.creator) {
      try {
        // TODO: use a util for this
        const decryptedContent = await window.ethereum.request({
          method: "eth_decrypt",
          params: [toHex(Buffer.from(post.content, "utf8")), address],
        });
        setContent(decryptedContent);
        setDecrypted(true);
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        // TODO: !!!Check if user has already payed for post!!!
        if (purchasePending) {
          notification.info("You have already purchased this post. Please wait for the creator handle your request.");
          return;
        }

        // TODO: util for this
        const publicKey = await window.ethereum.request({
          method: "eth_getEncryptionPublicKey",
          params: [address.toLowerCase()],
        });

        // console.log("pubKey for encryption:", publicKey);
        // console.log("i want to pay for", post.id);

        // sleep for 500ms - metamask gets unhappy if you spam it with back-2-back reqs
        // console.log("calling Spotlight.purchasePost");
        await new Promise(f => setTimeout(f, 500));
        await writeSpotlightContractAsync({
          functionName: "purchasePost",
          args: [post.id, publicKey],
          value: parseEther("0.1"),
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      {!onProfile && (
        <div className="flex justify-between items-center">
          {/* TODO: avoid prop drilling */}
          <PostHeader post={post} onClickUnlockPost={onClickUnlockPost} decrypted={decrypted} />
        </div>
      )}

      {onProfile ? (
        <div className="cursor-pointer flex flex-col w-full">
          <p className="w-[100%] text-lg font-bold text-left text-black">{post.title}</p>
          {post.paywalled && !decrypted ? (
            <PaywallMessage post={post} paywallSupported={paywallSupported} purchasePending={purchasePending} />
          ) : (
            <Viewer data={content} />
          )}
        </div>
      ) : compactDisplay ? (
        <div className="cursor-pointer flex flex-col w-full p-4 gap-4">
          <p className="w-[100%] text-lg font-bold text-left text-black">{post.title}</p>
          {post.paywalled && !decrypted ? (
            <PaywallMessage post={post} paywallSupported={paywallSupported} purchasePending={purchasePending} />
          ) : (
            <Viewer data={content} />
          )}
        </div>
      ) : (
        <>
          <div className="p-[10px]">
            <p className="text-2xl font-bold">{post.title}</p>
          </div>
          {post.paywalled && !decrypted ? (
            <PaywallMessage post={post} paywallSupported={paywallSupported} purchasePending={purchasePending} />
          ) : (
            <Viewer data={content} />
          )}
        </>
      )}

      <div>
        <PostFooter post={post} />
      </div>

      {showPostMgmt && (
        <>
          <PostDeleteModal post={post} />
          <PostEditModal post={post} />

          {post.paywalled && post.creator == address && <ManagePendingPurchases post={post} />}
        </>
      )}
    </>
  );
};

export default Post;
