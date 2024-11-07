"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import { Hex } from "viem";
import { useAccount } from "wagmi";
import Post from "~~/components/post/Post";
import { PostDisplayContext } from "~~/contexts/Post";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { TPost } from "~~/types/spotlight";

const ContentPage: NextPage = function () {
  const router = useRouter();
  const { address } = useAccount();

  // TODO: Just fetch the IDs - not all the posts
  const { data } = useScaffoldReadContract({
    account: address,
    contractName: "Spotlight",
    functionName: "getCommunityPosts",
    watch: true,
  });

  console.log("community posts:", data);

  if (data === undefined) {
    return <>Loading...</>;
  }

  if (data.length == 0) {
    return <>No posts yet (To be styled!)</>;
  }

  const onClickViewPost = (postId: Hex) => {
    const query = new URLSearchParams({ postSig: String(postId) }).toString();
    router.push(`/feed/viewPost?${query}`);
  };

  return (
    <>
      <PostDisplayContext.Provider value={{ compactDisplay: true, showPostMgmt: false, showHeader: true }}>
        {data.map((post: TPost) => (
          <div
            key={post.id}
            className="flex flex-col w-full p-4 gap-4 justify-start
                      transition-all duration-300 ease-in-out
                      hover:bg-gray-200 hover:shadow-lg hover:scale-105 cursor-pointer"
            onClick={() => onClickViewPost(post.id)}
          >
            <Post key={post.id} postId={post.id} />
          </div>
        ))}
      </PostDisplayContext.Provider>
    </>
  );
};

export default ContentPage;
