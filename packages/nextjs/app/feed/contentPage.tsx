"use client";

import React, { useState } from "react";
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

  // Fetch posts
  const { data } = useScaffoldReadContract({
    account: address,
    contractName: "Spotlight",
    functionName: "getCommunityPosts",
    watch: true,
  });

  console.log("community posts:", data);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // Number of posts per page

  if (data === undefined) {
    return <>Loading...</>;
  }

  if (data.length == 0) {
    return <>No posts yet (To be styled!)</>;
  }

  // Calculate pagination
  const totalPages = Math.ceil(data.length / postsPerPage);
  const currentPosts = data.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const onClickViewPost = (postId: Hex) => {
    const query = new URLSearchParams({ postSig: String(postId) }).toString();
    router.push(`/feed/viewPost?${query}`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPageButtons = 5;
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1); // Always show first page

      if (currentPage - 2 >= 3) pages.push("...");

      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage + 2 < totalPages - 2) pages.push("...");

      pages.push(totalPages); // Always show last page
    }

    return pages;
  };

  return (
    <div className="mb-4">
      <PostDisplayContext.Provider value={{ compactDisplay: true, showPostMgmt: false, onProfile: false }}>
        <div className="flex flex-col items-center w-full gap-6">
          {currentPosts.map((post: TPost) => (
            <div
              key={post.id}
              className="flex flex-col w-[95%] p-4 gap-4 justify-start
                        transition-all duration-300 ease-in-out
                        hover:bg-gray-200 hover:shadow-lg hover:scale-105 cursor-pointer"
              onClick={() => onClickViewPost(post.id)}
            >
              <Post key={post.id} postId={post.id} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="w-full join justify-center mt-4">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                className={`join-item btn ${currentPage === page ? "btn-active" : ""}`}
                onClick={() => typeof page === "number" && handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </PostDisplayContext.Provider>
    </div>
  );
};

export default ContentPage;
