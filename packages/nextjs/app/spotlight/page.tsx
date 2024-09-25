"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";

function Registration({ connectedAddress }: { connectedAddress: string }) {
  const [username, setUsername] = useState<string | null>(null);
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");

  if (connectedAddress === undefined) {
    return null;
  }

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
        <button
          className="btn btn-primary"
          onClick={async () => {
            if (username === undefined || username === null) {
              // TODO: Get toasty
              alert("Please populate username");
              return;
            }

            console.log(username);
            try {
              await writeSpotlightContractAsync({
                functionName: "registerProfile",
                args: [username],
              });
            } catch (e) {
              console.log(e);
            }
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}

function Welcome({ connectedAddress }: { connectedAddress: string }) {
  const { data: username } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "getProfile",
    args: [connectedAddress],
  });

  if (username === undefined) {
    return null;
  }
  return <>Welcome {username}!</>;
}

function CheckIn() {
  const { address: connectedAddress } = useAccount();
  const { data: isRegistered } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "isRegistered",
    args: [connectedAddress],
  });

  if (connectedAddress === undefined) {
    return <>Awaiting wallet connection...</>;
  }
  if (isRegistered === false) {
    return <Registration connectedAddress={connectedAddress} />;
  }
  if (isRegistered === true) {
    return <Welcome connectedAddress={connectedAddress} />;
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
