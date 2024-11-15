import { useContext, useEffect, useState } from "react";
import PostDeleteModal from "./DeleteModal";
import PostEditModal from "./EditModal";
import PostFooter from "./Footer";
import PostHeader from "./Header";
import { Hex, fromHex } from "viem";
import { useAccount } from "wagmi";
import Viewer from "~~/app/feed/richTextEditor/Viewer";
import { PostDisplayContext } from "~~/contexts/Post";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { TIPFSPost } from "~~/types/spotlight";
import { bigintDeserializer } from "~~/utils/spotlight";

const Post = ({ postId }: { postId: Hex }) => {
  const [post, setPost] = useState<TIPFSPost>();
  const { address } = useAccount();
  const { compactDisplay, showPostMgmt, onProfile } = useContext(PostDisplayContext);
  const { data: contractPost } = useScaffoldReadContract({
    account: address,
    contractName: "Spotlight",
    functionName: "getPost",
    args: [postId],
    watch: true,
  });

  useEffect(() => {
    const getPostContent = async (cid: string) => {
      const res = await fetch(`https://${cid}.ipfs.w3s.link`);
      if (!res.ok) {
        // TODO: Better error handling!
        console.log(res.status, res.statusText);
        return;
      }
      const text = await res.text();
      const w3Post = JSON.parse(text, bigintDeserializer);
      // console.log(text);
      // console.log(w3Post);
      setPost(w3Post);
    };

    if (contractPost) {
      const w3cid = fromHex(contractPost.w3cid, "string");
      console.log("post.w3cid", w3cid);
      getPostContent(w3cid).catch(e => {
        // TODO: Better error handling!
        console.log(e);
      });
    }
  }, [contractPost]);

  if (address === undefined || contractPost === undefined || post === undefined) {
    return;
  }

  return (
    <>
      {!onProfile && (
        <div className="flex justify-between items-center">
          <PostHeader post={post} contractPost={contractPost} />
        </div>
      )}

      {onProfile ? (
        <div className="cursor-pointer flex flex-col w-full">
          <p className="w-[100%] text-lg font-bold text-left text-black">{post.title}</p>
          <Viewer data={post.content} />
        </div>
      ) : compactDisplay ? (
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
        <PostFooter post={post} contractPost={contractPost} />
      </div>

      {showPostMgmt && (
        <>
          <PostDeleteModal post={post} contractPost={contractPost} />
          <PostEditModal post={post} contractPost={contractPost} />
        </>
      )}
    </>
  );
};

export default Post;
