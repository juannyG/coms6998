import { useContext } from "react";
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
  const { compactDisplay, showPostMgmt, showHeader } = useContext(PostDisplayContext);
  const { data: post } = useScaffoldReadContract({
    account: address,
    contractName: "Spotlight",
    functionName: "getPost",
    args: [postId],
    watch: true,
  });

  if (address === undefined || post === undefined) {
    return;
  }

  return (
    <>
      {showHeader && (
        <div className="flex justify-between items-center">
          <PostHeader post={post} />
        </div>
      )}

      {compactDisplay ? (
        <div className="cursor-pointer flex flex-col w-full p-4 gap-4">
          <p className="w-[100%] text-lg font-bold text-left text-black">{post.title}</p>
          <Viewer data={post.content} />
        </div>
      ) : (
        <>
          <div className="p-[10px]">
            <p className="text-2xl font-bold">{post.title}</p>
          </div>
          <Viewer data={post.content} />
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
