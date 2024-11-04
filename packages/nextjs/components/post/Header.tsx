import { useContext } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { PostContext } from "~~/contexts/Post";
import { TPost, TUserProfile } from "~~/types/spotlight";

const PostHeader = ({ post, creatorProfile }: { post: TPost; creatorProfile: TUserProfile }) => {
  const { address } = useAccount();
  const { setPostId, setShowDeleteConfirmation, deleting } = useContext(PostContext);
  const shortenedCreatorAddr = post.creator.substring(0, 6) + "..." + post.creator.substring(post.creator.length - 4);
  const creatorRep = Number(creatorProfile.reputation) / 10 ** 18;

  const onClickDeletePost = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    setShowDeleteConfirmation(true);
    setPostId(post.id);
  };

  return (
    <>
      <div className="tooltip tooltip-neutral cursor-pointer" data-tip={`${creatorRep.toFixed(4)} RPT`}>
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img alt="" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          {/* TODO: This styling is different depending on render context (i.e. list vs singleton) */}
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
            <button className="btn btn-danger btn-sm" onClick={e => onClickDeletePost(e)} disabled={deleting}>
              <Image alt="Delete Post" className="cursor-pointer" width="20" height="25" src="/trash.svg" />
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default PostHeader;
