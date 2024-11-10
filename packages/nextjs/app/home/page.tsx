"use client";

import { useEffect } from "react";
import Profile from "./profile";
import * as Delegation from "@ucanto/core/delegation";
import * as Client from "@web3-storage/w3up-client";
import type { NextPage } from "next";

const x = async () => {
  const client = await Client.create();
  const apiUrl = `/api/w3d?did=${client.agent.did()}`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  // Deserialize the delegation
  const delegation = await Delegation.extract(Uint8Array.from(Object.values(data)));
  console.log("delegation", delegation);
  if (!delegation.ok) {
    throw new Error("Failed to extract delegation", { cause: delegation.error });
  }

  // Add proof that this agent has been delegated capabilities on the space
  const space = await client.addSpace(delegation.ok);
  client.setCurrentSpace(space.did());
  console.log("space set - ready for upload");
};

const Home: NextPage = () => {
  useEffect(() => {
    x();
  });

  return (
    <div className="w-full sm:h-[80dvh] flex justify-center">
      <Profile />
    </div>
  );
};

export default Home;
