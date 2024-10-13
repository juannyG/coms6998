"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { UserProfileContext } from "~~/contexts/UserProfile";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { notification } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const router = useRouter();
  const { userProfile, setUserProfile } = useContext(UserProfileContext);

  // TODO: What if they navigate directly to "/" but have no account?

  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");
  const handleDeleteProfile = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
    if (!confirmDelete) return;

    try {
      await writeSpotlightContractAsync({
        functionName: "deleteProfile",
      });
      setUserProfile({ username: "" });
      router.push("/");
    } catch (e: any) {
      console.error(e);
      notification.error("Failed to delete profile");
    }
  };

  return (
    <div className="w-full h-[842px] relative overflow-hidden">
      <div className="flex flex-col justify-start items-center w-full h-dvh absolute left-0 top-0 gap-8 px-8 py-12 bg-gray-50">
        <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0">
          <div>Welcome back {userProfile.username}!</div>
          <div className="flex space-x-4 mt-4">
            <button className="btn btn-error" onClick={handleDeleteProfile}>
              Delete Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
