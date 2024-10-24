"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { UserProfileContext } from "~~/contexts/UserProfile";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { notification } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const router = useRouter();
  const [deleted, setDeleted] = useState(false);
  const [isChangingUsername, setIsChangingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState<string>("");
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");
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

  const { userProfile } = useContext(UserProfileContext);
  if (userProfile.isRegistered === undefined && userProfile.username === undefined) {
    // We cannot render anything
    return;
  }

  if (userProfile.isRegistered === false) {
    // They need to go register first...
    router.push("/");
  }

  return (
    <div className="w-full h-[842px] relative overflow-hidden">
      <div className="flex flex-col justify-start items-center w-full h-dvh absolute left-0 top-0 gap-8 px-8 py-12 bg-gray-50">
        <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0">
          {deleted ? (
            <>Deleting profile...</>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome back, {userProfile.username}!</h2>
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
    </div>
  );
};

export default Home;
