import * as Delegation from "@ucanto/core/delegation";
import * as Client from "@web3-storage/w3up-client";
import { encodePacked } from "viem";
import { TPostSig } from "~~/types/spotlight";

export const encodePostDataForSignature = (title: string, content: string, nonce: bigint) => {
  return encodePacked(["string", "string", "uint256"], [title, content, nonce]);
};

export const createPostSignature = async ({ signMessageAsync, title, content, nonce }: TPostSig) => {
  const msgToSign = encodePostDataForSignature(title, content, nonce);
  return await signMessageAsync({ message: { raw: msgToSign } });
};

export const getW3StorageClient = async () => {
  const client = await Client.create();
  const apiUrl = `/api/w3d?did=${client.agent.did()}`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  // Deserialize the delegation
  // NOTE: This deviates from web3.storage/storacha examples. Reason: my hunch is
  // because of the NextJS NextApiResponse is forcefully coercing JSON responses
  const delegation = await Delegation.extract(Uint8Array.from(Object.values(data)));
  if (!delegation.ok) {
    throw new Error("Failed to extract delegation", { cause: delegation.error });
  }

  // Add proof that this agent has been delegated capabilities on the space
  const space = await client.addSpace(delegation.ok);
  client.setCurrentSpace(space.did());
  console.log("space set - ready for upload");
  return client;
};

export const getAvatarURL = (cid: string | undefined) => {
  return cid
    ? `https://${cid}.ipfs.w3s.link`
    : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
};

/**
 * JSON.stringify cannot handle bigint - so...here's one way to
 * be able to de/serialize it to and from web3.storage
 */
export const bigintSerializer = (k: string, v: any) => {
  if (typeof v === "bigint") {
    return JSON.stringify({ t: "bigint", [k]: v.toString() });
  }
  return v;
};

export const bigintDeserializer = (k: string, v: any) => {
  try {
    const j = JSON.parse(v);
    if (j.t === "bigint") {
      return BigInt(j[k]);
    }
  } catch (err) {}
  return v;
};
