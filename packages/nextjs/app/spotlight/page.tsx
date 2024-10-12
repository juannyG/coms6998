"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { notification } from "~~/utils/scaffold-eth";

function Registration({
  connectedAddress,
  actionType,
  onSuccess,
}: {
  connectedAddress: string;
  actionType: "register" | "update";
  onSuccess?: () => void;
}) {
  const [username, setUsername] = useState<string | null>(null);
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");

  if (connectedAddress === undefined) {
    return null;
  }

  const handleSubmit = async () => {
    if (username === undefined || username === null) {
      // TODO: Get toasty
      alert("Please populate username");
      return;
    }
    console.log(username);
    const functionName = actionType === "register" ? "registerProfile" : "updateUsername";

    try {
      await writeSpotlightContractAsync({
        functionName,
        args: [username],
      });
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (e: any) {
      console.error(e);
      if (e.message.includes("Username is already taken")) {
        notification.error("Username is already taken. Please choose a different username.");
      }
    }
  };

  return (
    <div>
      <div>
        <label className="px-2">Username</label>
        <input
          className="input bg-primary"
          type="text"
          onChange={e => {
            // TODO: Validate username length < 32 char/bytes
            setUsername(e.target.value);
          }}
        />
      </div>
      <div className="py-5">
        <button className="btn btn-primary" onClick={handleSubmit}>
          {actionType === "register" ? "Register" : "Change Username"}
        </button>
      </div>
    </div>
  );
}

function Welcome({
  connectedAddress,
  refetchIsRegistered,
}: {
  connectedAddress: string;
  refetchIsRegistered: () => void;
}) {
  const [isChangingUsername, setIsChangingUsername] = useState(false);
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");

  const { data: username } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "getProfile",
    args: [connectedAddress],
  });

  if (username === undefined) {
    return null;
  }

  const handleDeleteProfile = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
    if (!confirmDelete) return;

    try {
      await writeSpotlightContractAsync({
        functionName: "deleteProfile",
      });
      notification.success("Profile deleted successfully");
      // Refetch registration status
      refetchIsRegistered();
    } catch (e: any) {
      console.error(e);
      notification.error("Failed to delete profile");
    }
  };

  if (isChangingUsername) {
    return (
      <Registration
        connectedAddress={connectedAddress}
        actionType="update"
        onSuccess={() => setIsChangingUsername(false)}
      />
    );
  }
  return (
    <>
      <p>Welcome {username}!</p>
      <div className="flex space-x-4 mt-4">
        <button className="btn btn-secondary" onClick={() => setIsChangingUsername(true)}>
          Change Username
        </button>
        <button className="btn btn-danger" onClick={handleDeleteProfile}>
          Delete Profile
        </button>
      </div>
    </>
  );
}

function CheckIn() {
  const { address: connectedAddress } = useAccount();
  const { data: isRegistered, refetch } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "isRegistered",
    args: [connectedAddress],
  });

  if (connectedAddress === undefined) {
    return <>Awaiting wallet connection...</>;
  }
  if (isRegistered === false) {
    return <Registration connectedAddress={connectedAddress} actionType="register" />;
  }
  if (isRegistered === true) {
    return <Welcome connectedAddress={connectedAddress} refetchIsRegistered={refetch} />;
  }
  return <>Checking registration status...</>;
}

const SpotlightLanding: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col pt-10">
        <h3>Welcome to Spotlight!</h3>
      </div>
      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w rounded-3xl">
            <CheckIn />
          </div>
        </div>
      </div>
    </>
  );
};

export default SpotlightLanding;
