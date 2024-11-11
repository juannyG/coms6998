import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@web3-storage/w3up-client";
import { Hex } from "viem";
import { useAccount } from "wagmi";
import Post from "~~/components/post/Post";
import { PostDisplayContext } from "~~/contexts/Post";
import { UserProfileContext } from "~~/contexts/UserProfile";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { TPost } from "~~/types/spotlight";
import { notification } from "~~/utils/scaffold-eth";
import { getAvatarURL, getW3StorageClient } from "~~/utils/spotlight";

function LeftColumn() {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  const shortenedUserAddress = connectedAddress
    ? connectedAddress.slice(0, 6) + "..." + connectedAddress.slice(-4)
    : "";

  // const [fileName, setFileName] = useState("");
  const [w3client, setW3Client] = useState<Client>();
  const [deleted, setDeleted] = useState(false);
  const [isChangingUsername, setIsChangingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState<string>("");
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");
  const { userProfile, refetchProfile } = useContext(UserProfileContext);

  useEffect(() => {
    const getClient = async () => {
      const c = await getW3StorageClient();
      setW3Client(c);
    };

    getClient().catch(e => {
      console.error(e);
    });
  }, [setW3Client]);

  useEffect(() => {
    if (userProfile && userProfile.username === "") {
      // They need to go register first...
      router.push("/");
    }
  }, [userProfile, router]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (w3client === undefined) {
      console.log("No web3.storage client available"); // TODO - better error handling
      return;
    }
    (document.getElementById("loading-modal") as HTMLFormElement).showModal();

    if (event.target.files && event.target.files.length > 0) {
      console.log("Uploading file:", event.target.files[0]);
      try {
        // TODO: useEstimateGas to check if the user can upload the file before actually uploading!
        const res = await w3client.uploadFile(event.target.files[0]);
        const cid = res.toString();
        await writeSpotlightContractAsync({
          functionName: "updateAvatarCID",
          args: [cid],
        });
        refetchProfile();
        notification.success("Avatar updated successfully!");
      } catch (e) {
        console.error(e);
      } finally {
        (document.getElementById("loading-modal") as HTMLFormElement).close();
      }
    }
  };

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
      <img alt="" src={getAvatarURL(userProfile.avatarCID)} className="w-80 h-80 rounded-full object-cover ml-2" />
      <div className="flex w-[100%] flex-col pl-4">
        <h1 className="text-left text-2xl font-bold text-gray-800">{userProfile.username}</h1>
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
              <>
                <div className="flex space-x-4 mt-4 pb-5">
                  <button className="btn btn-secondary" onClick={() => setIsChangingUsername(true)}>
                    Change Username
                  </button>
                  <div>
                    <label htmlFor="uploadFile1" className="btn btn-secondary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 mr-2 fill-black inline"
                        viewBox="0 0 32 32"
                      >
                        <path
                          d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                          data-original="#000000"
                        />
                        <path
                          d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                          data-original="#000000"
                        />
                      </svg>
                      Change Photo
                      <input
                        type="file"
                        id="uploadFile1"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
                <button className="btn btn-error" onClick={handleDeleteProfile}>
                  Delete Profile
                </button>
              </>
            )}
          </>
        )}
      </div>
      <dialog id="loading-modal" className="modal">
        <div className="modal-box [&&]:max-w-48">
          <h3 className="font-bold text-lg"></h3>
          <div className="flex justify-center">
            <p className="py-4">Uploading image...</p>
          </div>
          <div className="flex justify-center">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        </div>
      </dialog>
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
        {userPosts && userPosts.length > 0 ? (
          userPosts.map((post: TPost) => (
            <div
              key={post.id}
              className="flex flex-col w-full p-4 gap-4 justify-start
                      transition-all duration-300 ease-in-out
                      hover:bg-indigo-100 hover:shadow-lg cursor-pointer border rounded-lg"
              onClick={() => onClickViewPost(post.id)}
            >
              <Post key={post.id} postId={post.id} />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-8">No posts yet. Start sharing your thoughts!</div>
        )}
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
