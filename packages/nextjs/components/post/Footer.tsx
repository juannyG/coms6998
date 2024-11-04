import { useContext } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { UserProfileContext } from "~~/contexts/UserProfile";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { TPost } from "~~/types/spotlight";

const PostFooter = ({ post }: { post: TPost }) => {
  const { address } = useAccount();
  const { refetchProfile } = useContext(UserProfileContext);
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");

  // TODO: refetch this INDIVIDUAL post

  // TODO: Refetch the post should be conditional based on where the post is being rendered...
  //   const { refetch: refetchPosts } = useScaffoldReadContract({
  //     contractName: "Spotlight",
  //     functionName: "getCommunityPosts",
  //   });

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

  const onUpvoteClick = async (evt: React.MouseEvent<HTMLAnchorElement>) => {
    evt.stopPropagation();
    console.log("upvote clicked for", post.id);
    try {
      await writeSpotlightContractAsync({ functionName: "upvote", args: [post.id] });
      //   refetchPosts();
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
      //   refetchPosts();
      refetchHasDownvoted();
      refetchHasUpvoted();
      refetchProfile();
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <>
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
    </>
  );
};

export default PostFooter;
