import { useContext, useEffect, useState } from "react";
import PostDeleteModal from "./DeleteModal";
import PostEditModal from "./EditModal";
import PostFooter from "./Footer";
import PostHeader from "./Header";
import { Hex } from "viem";
import { useAccount } from "wagmi";
import Viewer from "~~/app/feed/richTextEditor/Viewer";
import { PostDisplayContext } from "~~/contexts/Post";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Post = ({ postId }: { postId: Hex }) => {
  const { address } = useAccount();
  const { compactDisplay, showPostMgmt, onProfile } = useContext(PostDisplayContext);
  const [content, setContent] = useState("");
  const [decrypted, setDecrypted] = useState(false);
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
      // sleep for 500ms - metamask gets unhappy if you spam it with back-2-back reqs
      // await new Promise(f => setTimeout(f, 500));
      try {
        const decryptedContent = await window.ethereum.request({
          method: "eth_decrypt",
          params: [`0x${Buffer.from(post.content, "utf8").toString("hex")}`, address],
        });
        setContent(decryptedContent);
        setDecrypted(true);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Purchasing paywalled content coming soon...");
    }
  };

  const trimId = post.id.substring(0, 6) + "..." + post.id.substring(post.id.length - 4);
  const TEMP_PAYWALL_MSG = `${trimId} is paywalled - support coming soon`;

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
          {post.paywalled && !decrypted ? TEMP_PAYWALL_MSG : <Viewer data={content} />}
        </div>
      ) : compactDisplay ? (
        <div className="cursor-pointer flex flex-col w-full p-4 gap-4">
          <p className="w-[100%] text-lg font-bold text-left text-black">{post.title}</p>
          {post.paywalled && !decrypted ? TEMP_PAYWALL_MSG : <Viewer data={content} />}
        </div>
      ) : (
        <>
          <div className="p-[10px]">
            <p className="text-2xl font-bold">{post.title}</p>
          </div>
          {post.paywalled && !decrypted ? TEMP_PAYWALL_MSG : <Viewer data={content} />}
        </>
      )}

      <div>
        <PostFooter post={post} />
      </div>

      {showPostMgmt && (
        <>
          <PostDeleteModal post={post} />
          <PostEditModal post={post} />
        </>
      )}
    </>
  );
};

export default Post;
