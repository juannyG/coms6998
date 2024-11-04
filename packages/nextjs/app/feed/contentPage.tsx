"use client";

import React, { useState } from "react";
import { NextPage } from "next";
import { Hex } from "viem";
import { useAccount } from "wagmi";
import Post from "~~/components/post/Post";
import { PostContext } from "~~/contexts/Post";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { TPost } from "~~/types/spotlight";

const ContentPage: NextPage = function () {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
  const [postId, setPostId] = useState<Hex | null>(null);
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
      console.error("Error showDeleteConfirmation post:", error);
    } finally {
      setShowDeleteConfirmation(false);
      setDeleting(false);
      setPostId(null);
    }
  };

  return (
    <>
      <PostContext.Provider value={{ setShowDeleteConfirmation, setShowEditPage, setPostId, deleting, editing }}>
        {data.map((post: TPost) => (
          <Post key={post.id} post={post} />
        ))}
      </PostContext.Provider>

      {postId && showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p>Are you sure you want to delete this post?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button className="btn btn-danger" onClick={() => handleDelete(postId)} disabled={deleting}>
                Confirm
              </button>
              <button className="btn btn-secondary" onClick={() => setPostId(null)}>
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
