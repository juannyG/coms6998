import { CarReader } from "@ipld/car";
import * as DID from "@ipld/dag-ucan/did";
import { importDAG } from "@ucanto/core/delegation";
import * as Signer from "@ucanto/principal/ed25519";
import * as Client from "@web3-storage/w3up-client";
import { ServiceAbility } from "@web3-storage/w3up-client/types";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

/** @param {string} data Base64 encoded CAR file */
async function parseProof(data: string) {
  const b = Buffer.from(data, "base64");
  const blocks = [];
  const reader = await CarReader.fromBytes(b.buffer as Uint8Array);
  for await (const block of reader.blocks()) {
    blocks.push(block);
  }
  return importDAG(blocks as Iterable<Signer.Signer.Transport.Block>);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (process.env.W3S_KEY === undefined || process.env.W3S_PROOF === undefined) {
    res.status(400).json({ message: "App not configured for w3 upload delgation" });
    return;
  }

  if (!req.query.did) {
    res.status(400).json({ message: "Missing DID" });
    return;
  }

  const principal = Signer.parse(process.env.W3S_KEY);
  const client = await Client.create({ principal });

  // Add proof that this agent has been delegated capabilities on the space
  const proof = await parseProof(process.env.W3S_PROOF);
  const space = await client.addSpace(proof);
  await client.setCurrentSpace(space.did());

  // Create a delegation for a specific DID
  const audience = DID.parse(req.query.did as string);
  const abilities = ["blob/add", "index/add", "filecoin/offer", "upload/add"];
  const expiration = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours from now
  const delegation = await client.createDelegation(audience, abilities as ServiceAbility[], {
    expiration,
  });

  // Serialize the delegation and send it to the client
  const archive = await delegation.archive();
  return archive.ok;
}
