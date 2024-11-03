"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Viewer from "./richTextEditor/Viewer";
import { NextPage } from "next";
import { Hex } from "viem";
import { useAccount, useConfig } from "wagmi";
import { UserProfileContext } from "~~/contexts/UserProfile";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { TPost, TUserProfile } from "~~/types/spotlight";

const Post = ({
  post,
  selectedPostId,
  setSelectedPostId,
  deleting,
  refreshPosts,
}: {
  post: TPost;
  selectedPostId: Hex | null;
  setSelectedPostId: React.Dispatch<React.SetStateAction<Hex | null>>;
  deleting: boolean;
  refreshPosts: () => void;
}) => {
  const { address } = useAccount();
  const router = useRouter();
  const { refetchProfile } = useContext(UserProfileContext);
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");
  const { data: creatorProfile } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "getProfile",
    args: [post.creator],
  }) as { data: TUserProfile };

  const { data: hasUpvoted, refetch: refetchHasUpvoted } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "upvotedBy",
    args: [post.signature, address],
  });

  const { data: hasDownvoted, refetch: refetchHasDownvoted } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "downvotedBy",
    args: [post.signature, address],
  });

  if (creatorProfile === undefined) {
    return;
  }

  const deletingPost = deleting && selectedPostId !== null && selectedPostId === post.id;
  const shortenedCreatorAddr = post.creator.substring(0, 6) + "..." + post.creator.substring(post.creator.length - 4);
  const creatorRep = Number(creatorProfile.reputation) / 10 ** 18;

  const onClickViewPost = () => {
    const query = new URLSearchParams({ postSig: String(post.id) }).toString();
    router.push(`/feed/viewPost?${query}`);
  };

  const onClickDeletePost = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    setSelectedPostId(post.id);
  };

  const onUpvoteClick = async (evt: React.MouseEvent<HTMLAnchorElement>) => {
    evt.stopPropagation();
    console.log("upvote clicked for", post.id);
    try {
      await writeSpotlightContractAsync({ functionName: "upvote", args: [post.id] });
      refreshPosts();
      refetchHasUpvoted();
      refetchHasDownvoted();
      refetchProfile();
    } catch (e: any) {
      console.log(e);
    }
  };

  const onDownvoteClick = async (evt: React.MouseEvent<HTMLAnchorElement>) => {
    evt.stopPropagation();
    console.log("downvote clicked for", post.id);
    try {
      await writeSpotlightContractAsync({ functionName: "downvote", args: [post.id] });
      refreshPosts();
      refetchHasDownvoted();
      refetchHasUpvoted();
      refetchProfile();
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <>
      <div
        className="flex flex-col w-full p-4 gap-4 justify-start
            transition-all duration-300 ease-in-out
            hover:bg-gray-200 hover:shadow-lg hover:scale-105"
      >
        <div className="flex justify-between items-center">
          <div className="tooltip tooltip-neutral cursor-pointer" data-tip={`${creatorRep.toFixed(4)} RPT`}>
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-10 h-10 rounded-full">
                  <img alt="" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <p className="text-sm font-semibold text-left text-black">
                <a>
                  {creatorProfile.username} @ {shortenedCreatorAddr}
                </a>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {address === post.creator && (
              <>
                <button className="btn btn-danger btn-sm">
                  <Image alt="Edit Post" className="cursor-pointer" width="20" height="25" src="/pencil.svg" />
                </button>
                <button className="btn btn-danger btn-sm" onClick={e => onClickDeletePost(e)} disabled={deletingPost}>
                  <Image alt="Delete Post" className="cursor-pointer" width="20" height="25" src="/trash.svg" />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="cursor-pointer flex flex-col w-full p-4 gap-4" onClick={() => onClickViewPost()}>
          <p className="w-[100%] text-lg font-bold text-left text-black">{post.title}</p>
          <Viewer data={post.content} />
        </div>
        <div>
          <div className="flex justify-start gap-4 w-[100%] h-5">
            <a onClick={e => onUpvoteClick(e)}>
              <Image
                alt="Upvote"
                className="cursor-pointer"
                width="20"
                height="25"
                src={`/upvote-${hasUpvoted ? "filled" : "outline"}.svg`}
              />
            </a>
            <p className="[font-family:'Inter-Medium',Helvetica] font-medium text-gray-500 text-[13px]">
              ({Number(post.upvoteCount)})
            </p>
            <p className="[font-family:'Inter-Medium',Helvetica] font-medium text-gray-500 text-[13px]">|</p>
            <a onClick={e => onDownvoteClick(e)}>
              <Image
                alt="Downvote"
                className="cursor-pointer"
                width="20"
                height="25"
                src={`/downvote-${hasDownvoted ? "filled" : "outline"}.svg`}
              />
            </a>
            <p className="[font-family:'Inter-Medium',Helvetica] font-medium text-gray-500 text-[13px]">
              ({Number(post.downvoteCount)})
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const ContentPage: NextPage = function () {
  const [deleting, setDeleting] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<Hex | null>(null);
  const { address } = useAccount();
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");
  const { data, refetch } = useScaffoldReadContract({
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

  // Refresh posts after delete
  const refreshPosts = () => {
    refetch();
  };

  const handleDelete = async (postId: Hex) => {
    try {
      setDeleting(true);
      await writeSpotlightContractAsync({
        functionName: "deletePost",
        args: [postId],
      });
      console.log(`Deleted post with ID: ${postId}`);
      refreshPosts(); // Refetch or update local state to remove the deleted post
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setDeleting(false);
      setSelectedPostId(null);
    }
  };

  return (
    <>
      {data.map((post: TPost) => (
        <Post
          key={post.id}
          post={post}
          selectedPostId={selectedPostId}
          setSelectedPostId={setSelectedPostId}
          deleting={deleting}
          refreshPosts={refreshPosts}
        />
      ))}

      {selectedPostId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p>Are you sure you want to delete this post?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button className="btn btn-danger" onClick={() => handleDelete(selectedPostId)} disabled={deleting}>
                Confirm
              </button>
              <button className="btn btn-secondary" onClick={() => setSelectedPostId(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContentPage;
