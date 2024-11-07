"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import FeedHeaderPage from "../header";
import BackButton from "./BackButton";
import Comments from "./comments";
import type { NextPage } from "next";
import { Hex } from "viem";
import Post from "~~/components/post/Post";
import { PostDeleteContext, PostDisplayContext, PostEditContext } from "~~/contexts/Post";

const ViewPostPage: NextPage = () => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const searchParams = useSearchParams();
  const postSig = searchParams.get("postSig") || "";

  if (!postSig) {
    return <div>Loading...</div>; // Handle case where postSig is not yet available
  }

  const deleteContext = { deleting, setDeleting, showDeleteConfirmation, setShowDeleteConfirmation };
  const editContext = { editing, setEditing, showEditModal, setShowEditModal };

  return (
    <>
      <div className="w-full h-full relative bg-white box-border">
        <FeedHeaderPage />
        <div className="w-full flex gap-6 justify-center">
          <div className="w-[50%] mt-6 flex flex-col ">
            <BackButton />

            <PostDisplayContext.Provider value={{ compactDisplay: false, showPostMgmt: true, showHeader: true }}>
              <PostDeleteContext.Provider value={deleteContext}>
                <PostEditContext.Provider value={editContext}>
                  <Post postId={postSig as Hex} />
                </PostEditContext.Provider>
              </PostDeleteContext.Provider>
            </PostDisplayContext.Provider>

            <Comments />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPostPage;
