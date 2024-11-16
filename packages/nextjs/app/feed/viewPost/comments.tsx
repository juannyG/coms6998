import { useEffect, useState } from "react";
import { Hex } from "viem";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { TComment } from "~~/types/spotlight";

// TODO: we should consider adding pagination if there are too many comments
// And add support to edit or delete comments
// And add support to upvote or downvote comments
function Comments({ postId }: { postId: Hex }) {
  const [comments, setComments] = useState<TComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  const { writeContractAsync: writeCommentContractAsync } = useScaffoldWriteContract("Spotlight");

  const { data: fetchedCommments, refetch: refreshComments } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "getComments",
    args: [postId],
    watch: true,
  });

  useEffect(() => {
    setComments(fetchedCommments as TComment[]);
  }, [fetchedCommments]);

  const handleAddComment = async () => {
    if (!newComment) return;

    setIsLoading(true);
    try {
      await writeCommentContractAsync({
        functionName: "addComment",
        args: [postId, newComment],
      });

      setNewComment(""); // Clear input after successful submission

      // Re-fetch comments to ensure everything is up-to-date
      refreshComments();
    } catch (e) {
      console.error("Failed to add comment:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamp to readable date
  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const totalPages = comments ? Math.ceil(comments.length / commentsPerPage) : 0;
  const currentComments = comments
    ? comments.slice((currentPage - 1) * commentsPerPage, currentPage * commentsPerPage)
    : [];

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
    <div className="flex flex-col h-dvh bg-[url(/rectangle-6.svg)] bg-[100%_100%]">
      {/* Comments Header */}
      <div className="px-10 pt-[30px] font-bold text-black text-lg">Comments ({comments?.length})</div>

      {/* Comment Input Section */}
      <div className="flex items-start gap-5 px-10 mt-3">
        <img alt="User avatar" src="/avatar.png" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        <div className="flex-grow">
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className="w-full h-20 bg-white rounded border-2 border-solid border-[#eeeeee] p-2.5"
            disabled={isLoading}
          />
          <button
            onClick={handleAddComment}
            disabled={isLoading || !newComment}
            className="mt-2 bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Render Comments */}
      <div className="flex flex-col px-10 mt-5 space-y-4">
        {currentComments?.map((comment, index) => (
          <div key={index} className="flex gap-5">
            {/* User Avatar */}
            <img alt="User avatar" src="/avatar.png" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />

            {/* Comment Content */}
            <div className="flex flex-col gap-1">
              {/* User Info */}
              <div className="flex items-center gap-4">
                {/* TODO: Get profile of comment to show avatar */}
                <span className="font-medium text-black text-base">{comment.commenter}</span>
              </div>

              {/* Comment Text */}
              <p className="text-[#111624] text-base">{comment.content}</p>

              {/* Timestamp */}
              <p className="text-[#575757] text-sm">{formatDate(comment.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="join justify-center mt-4">
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
    </div>
  );
}

export default Comments;
