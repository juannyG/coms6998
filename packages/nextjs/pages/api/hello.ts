import * as Client from "@web3-storage/w3up-client";
import { Signer } from "@web3-storage/w3up-client/principal/ed25519";
import * as Proof from "@web3-storage/w3up-client/proof";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (process.env.W3S_KEY === undefined || process.env.W3S_PROOF === undefined) {
    res.status(400).json({ message: "App not configured for w3 uploads" });
    return;
  }

  const principal = Signer.parse(process.env.W3S_KEY);
  const store = new StoreMemory();
  const client = await Client.create({ principal, store });
  // // Add proof that this agent has been delegated capabilities on the space
  const proof = await Proof.parse(process.env.W3S_PROOF);
  const space = await client.addSpace(proof);
  await client.setCurrentSpace(space.did());
  // // READY to go!

  // const x = client.uploadFile(new File(["testing"], "jgtestupload-1"));
  // console.log(x);

  res.status(200).json({ message: "Hello from Next.js!" });
}
