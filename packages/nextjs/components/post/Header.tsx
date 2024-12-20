import { useContext } from "react";
import Image from "next/image";
import CreatorDisplay from "./CreatorDisplay";
import { useAccount } from "wagmi";
import { PaywallSupportContext } from "~~/contexts/PaywallSupport";
import { PostDeleteContext, PostDisplayContext, PostEditContext } from "~~/contexts/Post";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { TPost, TUserProfile } from "~~/types/spotlight";

const PostHeader = ({
  post,
  onClickUnlockPost,
  decrypted,
}: {
  post: TPost;
  onClickUnlockPost: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  decrypted: boolean;
}) => {
  const { address } = useAccount();
  const { showPostMgmt } = useContext(PostDisplayContext);
  const { setShowDeleteConfirmation, deleting } = useContext(PostDeleteContext);
  const { setShowEditModal, editing } = useContext(PostEditContext);
  const { paywallSupported } = useContext(PaywallSupportContext);
  const { data: creatorProfile } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "getProfile",
    args: [post.creator],
  }) as { data: TUserProfile };

  if (creatorProfile === undefined) {
    return null; // Cannot render until we have their profile
  }

  const onClickDeletePost = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    setShowDeleteConfirmation(true);
  };
  const onClickEditPost = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    setShowEditModal(true);
  };

  return (
    <>
      <CreatorDisplay post={post} />

      <div className="flex gap-2">
        <>
          {post.paywalled && paywallSupported && !decrypted && (
            <button className="btn btn-danger btn-sm" onClick={e => onClickUnlockPost(e)}>
              <Image alt="Unlock Post" className="cursor-pointer" width="20" height="25" src="/lock-open.svg" />
            </button>
          )}
        </>
        {address === post.creator && showPostMgmt && (
          <>
            {/* TODO: Think about support for editing paywalled post... */}
            {!post.paywalled && (
              <button className="btn btn-danger btn-sm" onClick={e => onClickEditPost(e)} disabled={editing}>
                <Image alt="Edit Post" className="cursor-pointer" width="20" height="25" src="/pencil.svg" />
              </button>
            )}
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
