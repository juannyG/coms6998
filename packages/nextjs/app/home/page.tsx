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
              <div>Welcome back {userProfile.username}!</div>
              <div className="flex space-x-4 mt-4">
                <button className="btn btn-error" onClick={handleDeleteProfile}>
                  Delete Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
