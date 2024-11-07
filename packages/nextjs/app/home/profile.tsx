import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Hex } from "viem";
import { useAccount } from "wagmi";
import Post from "~~/components/post/Post";
import { PostDisplayContext } from "~~/contexts/Post";
import { UserProfileContext } from "~~/contexts/UserProfile";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { TPost } from "~~/types/spotlight";
import { notification } from "~~/utils/scaffold-eth";

function LeftColumn() {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  const shortenedUserAddress = connectedAddress
    ? connectedAddress.slice(0, 6) + "..." + connectedAddress.slice(-4)
    : "";

  const [deleted, setDeleted] = useState(false);
  const [isChangingUsername, setIsChangingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState<string>("");
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");
  const { userProfile } = useContext(UserProfileContext);

  useEffect(() => {
    if (userProfile && userProfile.username === "") {
      // They need to go register first...
      router.push("/");
    }
  }, [userProfile, router]);

  const handleDeleteProfile = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
    if (!confirmDelete) return;

    try {
      await writeSpotlightContractAsync({
        functionName: "deleteProfile",
      });
      setDeleted(true);
    } catch (e: any) {
      console.error(e);
      notification.error("Failed to delete profile");
    }
  };

  const handleChangeUsername = async () => {
    if (!newUsername) {
      notification.error("Please enter a new username.");
      return;
    }

    try {
      await writeSpotlightContractAsync({
        functionName: "updateUsername",
        args: [newUsername],
      });
      notification.success("Username updated successfully!");
      setIsChangingUsername(false); // Hide the form once successful
    } catch (e: any) {
      console.error(e);
      notification.error("Failed to update username");
    }
  };

  if (userProfile === undefined) {
    // We cannot render anything
    return;
  }

  return (
    <div className="w-[100%] flex flex-col items-center">
      <img
        alt=""
        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
        className="w-80 h-80 rounded-full object-cover ml-2"
      />
      <div className="flex w-[100%] flex-col pl-4">
        <h1 className="text-left text-2xl font-bold text-gray-800">{userProfile?.username}</h1>
        <div>Address: {shortenedUserAddress}</div>
        <div>Reputation: {Number(userProfile.reputation)} RPT</div>
      </div>
      <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 sm:mt-4 mb-4">
        {deleted ? (
          <>Deleting profile...</>
        ) : (
          <>
            {isChangingUsername ? (
              // Render the form for changing username
              <div className="w-full flex flex-col items-center">
                <div className="mb-4 center">
                  <input
                    type="text"
                    placeholder="Enter new username"
                    className="input input-bordered"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                  />
                </div>
                <div className="flex justify-center space-x-4">
                  <button className="btn btn-primary" onClick={handleChangeUsername}>
                    Submit New Username
                  </button>
                  <button className="btn btn-error" onClick={() => setIsChangingUsername(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4 mt-4">
                <button className="btn btn-secondary" onClick={() => setIsChangingUsername(true)}>
                  Change Username
                </button>
                <button className="btn btn-error" onClick={handleDeleteProfile}>
                  Delete Profile
                </button>
              </div>
            )}
          </>
        )}
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
      <div className="flex flex-col items-center gap-4 pt-4 overflow-x-hidden overflow-scroll sm:h-[100%] w-[100%]">
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
    <div className="sm:flex sm:flex-row w-full sm:w-[60%] justify-center">
      <div className="w-full sm:w-[33%] pt-10 ">
        <LeftColumn />
      </div>
      <div className="w-full sm:w-[66%]">
        <RightColumn />
      </div>
    </div>
  );
}
