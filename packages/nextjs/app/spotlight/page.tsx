"use client";

import { ChangeEvent, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";

function Registration({ connectedAddress }: { connectedAddress: string }) {
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");

  if (connectedAddress === undefined) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <label className="px-2 w-1/3 text-right pr-4">Username</label>
          <TextField
            id="outlined-username"
            label=""
            variant="outlined"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex items-center mt-4">
          <label className="px-2 w-1/3 text-right pr-4">Bio</label>
          <TextField
            id="outlined-bio"
            label=""
            variant="outlined"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setBio(e.target.value)}
          />
        </div>
        <div className="flex items-center mt-4">
          <label className="px-2 w-1/3 text-right pr-4">Location</label>
          <TextField
            id="outlined-location"
            label=""
            variant="outlined"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
          />
        </div>
        <div className="flex items-center my-4">
          <label className="px-2 w-1/3 text-right pr-4">Age</label>
          <TextField
            id="outlined-age"
            label=""
            variant="outlined"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAge(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="py-5">
        <Button
          variant="contained"
          onClick={async () => {
            if (username === undefined || username === null) {
              alert("Please populate username");
              return;
            }

            try {
              await writeSpotlightContractAsync({
                functionName: "registerProfile",
                args: [username, bio, location, age],
              });
            } catch (e) {
              console.log(e);
            }
          }}
        >
          Register
        </Button>
      </div>
    </div>
  );
}

function Welcome({ connectedAddress }: { connectedAddress: string }) {
  const { data: profile } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "getProfile",
    args: [connectedAddress],
  });

  if (profile === undefined) {
    return null;
  }
  return (
    <>
      Welcome
      <span style={{ color: "green" }} className="text-3xl">
        {profile.username}{" "}
      </span>
      at
      <span style={{ color: "green" }}>{connectedAddress.slice(0, 6) + "..." + connectedAddress.slice(-4)}</span>
      <div>BIO: {profile.bio}</div>
      Location: <span style={{ color: "purple" }}>{profile.location}</span>
    </>
  );
}

function CheckIn() {
  const { address: connectedAddress } = useAccount();
  const { data: isRegistered } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "userRegistered",
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
