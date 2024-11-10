import * as DID from "@ipld/dag-ucan/did";
import * as Signer from "@ucanto/principal/ed25519";
import * as Client from "@web3-storage/w3up-client";
import * as Proof from "@web3-storage/w3up-client/proof";
import { StoreMemory } from "@web3-storage/w3up-client/stores";
import { ServiceAbility } from "@web3-storage/w3up-client/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (process.env.W3S_KEY === undefined || process.env.W3S_PROOF === undefined) {
    res.status(400).json({ message: "App not configured for w3 upload delgation", delegation: undefined });
    return;
  }

  if (!req.query.did) {
    res.status(400).json({ message: "Missing DID", delegation: undefined });
    return;
  }

  // Load client with specific private key
  const principal = Signer.parse(process.env.W3S_KEY);
  const store = new StoreMemory();
  const client = await Client.create({ principal, store });

  // Add proof that this agent has been delegated capabilities on the space
  const proof = await Proof.parse(process.env.W3S_PROOF);
  const space = await client.addSpace(proof);
  await client.setCurrentSpace(space.did());

  // Create a delegation for a specific DID
  const audience = DID.parse(req.query.did as string);
  const abilities = ["space/blob/add", "space/index/add", "filecoin/offer", "upload/add"];
  const expiration = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours from now
  const delegation = await client.createDelegation(audience, abilities as ServiceAbility[], {
    expiration,
  });

  // Serialize the delegation and send it to the client
  const archive = await delegation.archive();
  console.log(archive.ok);
  res.status(200).send(archive.ok);
}
