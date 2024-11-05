import { useEffect } from "react";
import Viewer from "../feed/richTextEditor/Viewer";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { TPost, TUserProfile } from "~~/types/spotlight";

function PostCard({ post }: { post: TPost }) {
  return (
    <div className="w-[100%] border rounded-xl p-4">
      <h1 className="text-lg text-left font-bold">{post.title}</h1>
      <Viewer data={post.content} />
    </div>
  );
}

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

  const { data: userPosts } = useScaffoldReadContract({
    account: connectedAddress,
    contractName: "Spotlight",
    functionName: "getPostsOfAddress",
    args: [connectedAddress],
    watch: true,
  });

  useEffect(() => {
    console.log("userPosts", userPosts);
  }, [userPosts]);

  return (
    <div>
      <h1 className="text-4xl text-left mt-10">My Posts</h1>
      <div className="flex flex-col w-[100%] gap-4 mt-10">
        {userPosts?.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
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
