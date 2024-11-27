import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { TComment, TUserProfile } from "~~/types/spotlight";
import { getAvatarURL } from "~~/utils/spotlight";

const Comment = ({ comment }: { comment: TComment }) => {
  // Format timestamp to readable date
  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const { data: commentorProfile } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "getProfile",
    args: [comment.commenter],
  }) as { data: TUserProfile };

  const commenterRep = Number(commentorProfile?.reputation) / 10 ** 18;
  const shortenedCommenterAddr =
    comment.commenter.substring(0, 6) + "..." + comment.commenter.substring(comment.commenter.length - 4);

  return (
    <>
      {/* User Avatar */}
      <img
        alt="User avatar"
        src={getAvatarURL(commentorProfile?.avatarCID)}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />

      {/* Comment Content */}
      <div className="flex flex-col gap-1">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="tooltip tooltip-neutral cursor-pointer" data-tip={`${commenterRep.toFixed(4)} RPT`}>
            <div className="grid-col-1">
              <div>
                <p className="font-medium text-left text-black">{commentorProfile?.username}</p>
              </div>
              <div>
                <p className="hidden sm:block font-medium text-sm text-left text-black">{comment.commenter}</p>
                <p className="sm:hidden font-medium  text-sm text-left text-black">{shortenedCommenterAddr}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Text */}
        <p className="text-[#111624] text-base">{comment.content}</p>

        {/* Timestamp */}
        <p className="text-[#575757] text-sm">{formatDate(comment.createdAt)}</p>
      </div>
    </>
  );
};

export default Comment;
