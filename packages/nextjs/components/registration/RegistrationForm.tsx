"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
import Register from "./Register";
import { useAccount } from "wagmi";
import { UserProfileContext } from "~~/contexts/UserProfile";

const RegistrationForm = () => {
  const { address: connectedAddress } = useAccount();
  const router = useRouter();
  const { userProfile } = useContext(UserProfileContext);
  console.log("connectedAddress:", connectedAddress);
  console.log("userProfile:", userProfile);

  useEffect(() => {
    if (userProfile && userProfile.username !== "") {
      // Already registered
      router.push("/feed");
    }
  }, [userProfile, router]);

  if (!connectedAddress) {
    return;
  }

  if (userProfile === undefined) {
    // We cannot render anything
    return;
  }

  return (
    <div
      className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-6 px-10 py-8 rounded-lg bg-white"
      style={{ boxShadow: "0px 1px 3px 0 rgba(0,0,0,0.1), 0px 1px 2px 0 rgba(0,0,0,0.06)" }}
    >
      {!connectedAddress && <Loading />}
      {connectedAddress && userProfile.username === "" && <Register />}
      {connectedAddress && userProfile.username !== "" && <>Redirecting...</>}
      <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 w-[368px] h-5 gap-2" />
    </div>
  );
};

export default RegistrationForm;
