import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import PostFooter from "./Footer";
import PostHeader from "./Header";
import { useAccount } from "wagmi";
// TODO: Move this into components folder?
import Viewer from "~~/app/feed/richTextEditor/Viewer";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { TPost, TUserProfile } from "~~/types/spotlight";

const Post = ({ post }: { post: TPost }) => {
  const { address } = useAccount();
  const router = useRouter();
  const { data: creatorProfile } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "getProfile",
    args: [post.creator],
  }) as { data: TUserProfile };

  if (creatorProfile === undefined || address === undefined) {
    return;
  }

  // TODO: This needs to be conditional based on render context (i.e. list vs singleton)
  const onClickViewPost = () => {
    const query = new URLSearchParams({ postSig: String(post.id) }).toString();
    router.push(`/feed/viewPost?${query}`);
  };

  return (
    <>
      {/* TODO: This styling is different depending on render context (i.e. list vs singleton) */}
      <div
        className="flex flex-col w-full p-4 gap-4 justify-start
              transition-all duration-300 ease-in-out
              hover:bg-gray-200 hover:shadow-lg hover:scale-105"
      >
        <div className="flex justify-between items-center">
          <PostHeader post={post} creatorProfile={creatorProfile} />
        </div>
        {/* TODO: This styling is different depending on render context (i.e. list vs singleton) */}
        <div className="cursor-pointer flex flex-col w-full p-4 gap-4" onClick={() => onClickViewPost()}>
          <p className="w-[100%] text-lg font-bold text-left text-black">{post.title}</p>
          <Viewer data={post.content} />
        </div>
        <div>
          <PostFooter post={post} />
        </div>
      </div>
    </>
  );
};

export default Post;
