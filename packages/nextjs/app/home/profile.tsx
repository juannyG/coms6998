import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hex } from "viem";
import { useAccount } from "wagmi";
import Post from "~~/components/post/Post";
import { PostDisplayContext } from "~~/contexts/Post";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { TPost, TUserProfile } from "~~/types/spotlight";

function LeftColumn() {
  const { address: connectedAddress } = useAccount();
  const { data: userProfile } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "getProfile",
    args: [connectedAddress],
    watch: true,
  }) as {
    data: TUserProfile | undefined;
  };
  const shortenedUserAddress = connectedAddress
    ? connectedAddress.slice(0, 6) + "..." + connectedAddress.slice(-4)
    : "";

  return (
    <div className="w-[100%]">
      <img alt="" src="/avatar.png" className="w-80 h-80 rounded-full object-cover ml-2" />
      <div className="flex w-[100%] flex-col">
        <h1 className="text-4xl  text-left">{userProfile?.username}</h1>
        <div>Address: {shortenedUserAddress}</div>
      </div>
    </div>
  );
}

function RightColumn() {
  const { address: connectedAddress } = useAccount();
  const router = useRouter();

  const { data: userPosts } = useScaffoldReadContract({
    account: connectedAddress,
    contractName: "Spotlight",
    functionName: "getPostsOfAddress",
    args: [connectedAddress],
    watch: true,
  });

  const onClickViewPost = (postId: Hex) => {
    const query = new URLSearchParams({ postSig: String(postId) }).toString();
    router.push(`/feed/viewPost?${query}`);
  };

  return (
    <PostDisplayContext.Provider value={{ compactDisplay: true, showPostMgmt: false, onProfile: true }}>
      <div className="flex flex-col items-center gap-4 pt-4 overflow-scroll h-[100%] w-[100%]">
        {userPosts?.map((post: TPost) => (
          <div
            key={post.id}
            className="flex flex-col w-[95%] p-4 gap-4 justify-start
                        transition-all duration-300 ease-in-out
                        hover:bg-gray-200 hover:shadow-lg hover:scale-105 cursor-pointer truncate-text border rounded-lg"
            onClick={() => onClickViewPost(post.id)}
          >
            <Post key={post.id} postId={post.id} />
          </div>
        ))}
      </div>
    </PostDisplayContext.Provider>
  );
}

export default function Profile() {
  return (
    <div className="flex flex-row w-100% justify-center w-[60%]">
      <div className="w-[33%] pt-10">
        <LeftColumn />
      </div>
      <div className="w-[66%]">
        <RightColumn />
      </div>
    </div>
  );
}
