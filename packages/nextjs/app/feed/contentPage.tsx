"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreatePage from "./createPost";
import Viewer from "./richTextEditor/Viewer";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { TPost } from "~~/types/spotlight";

const RenderPosts = ({ data, refreshPosts }: { data: any; refreshPosts: () => void }) => {
  const router = useRouter();
  const { address } = useAccount();
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [clickViewPost, setClickViewPost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<`0x${string}` | null>(null);

  useEffect(() => {
    if (clickViewPost) {
      const query = new URLSearchParams({ postSig: String(selectedPostId) }).toString();
      router.push(`/feed/viewPost?${query}`);
      setClickViewPost(false);
    }
  }, [clickViewPost, selectedPostId, router]);

  const handleDelete = async (postId: `0x${string}`) => {
    try {
      setLoading(true);
      await writeSpotlightContractAsync({
        functionName: "deletePost",
        args: [postId],
      });
      console.log(`Deleted post with ID: ${postId}`);
      refreshPosts(); // Refetch or update local state to remove the deleted post
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setLoading(false);
      setShowConfirm(false); // Close the confirmation popup
      setSelectedPostId(null); // Reset selected post
    }
  };

  const confirmDelete = (postId: `0x${string}`) => {
    setSelectedPostId(postId);
    setShowConfirm(true);
  };

  const onClickViewPost = (postId: `0x${string}`) => {
    setSelectedPostId(postId);
    setClickViewPost(true);
  };

  if (data === undefined) {
    return <>Loading...</>;
  }

  if (data.length == 0) {
    return <>No posts yet (To be styled!)</>;
  }

  return (
    <>
      {data.map((p: TPost) => (
        <div key={p.createdAt} className="flex flex-col justify-start gap-4 p-4 w-[100%]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-10 h-10 rounded-full">
                  <img alt="" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <p className="text-sm font-semibold text-left text-black">
                {p.creator.substring(0, 6) + "..." + p.creator.substring(p.creator.length - 4)}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-danger btn-sm" onClick={() => onClickViewPost(p.id)}>
                View
              </button>
            </div>
            {address === p.creator && (
              <div className="flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(p.id)} disabled={loading}>
                  {loading && selectedPostId === p.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
          <p className="w-[100%] text-lg font-bold text-left text-black">{p.title}</p>
          {/* <p className="w-[100%] text-lg text-left text-black" dangerouslySetInnerHTML={{ __html: p.content }} /> */}
          <Viewer data={p.content} />
          <div className="flex justify-start gap-4 w-[100%] h-5">
            <p className="text-sm text-left text-gray-500">#web3</p>
            <p className="text-sm text-left text-gray-500">#eth</p>
          </div>
        </div>
      ))}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p>Are you sure you want to delete this post?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                className="btn btn-danger"
                onClick={() => selectedPostId && handleDelete(selectedPostId)}
                disabled={loading}
              >
                Confirm
              </button>
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ContentPage: NextPage = function () {
  const { address } = useAccount();
  const { data, refetch } = useScaffoldReadContract({
    account: address,
    contractName: "Spotlight",
    functionName: "getCommunityPosts",
    watch: true,
  });

  console.log("community posts:", data);

  // Refresh posts after delete
  const refreshPosts = () => {
    refetch();
  };

  return (
    <div className="flex flex-col gap-10">
      <CreatePage />
      <RenderPosts data={data} refreshPosts={refreshPosts} />
    </div>
  );
};

export default ContentPage;
