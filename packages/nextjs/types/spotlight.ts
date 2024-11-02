import { Address } from "viem";
import { Hex } from "viem";
import { SignMessageMutateAsync } from "wagmi/query";

export interface TPost {
  id: Hex;
  signature: Hex;
  creator: Address;
  title: string;
  content: string;
  nonce: bigint;
  createdAt: bigint;
  lastUpdatedAt: bigint;
  upvoteCount: bigint;
  downvoteCount: bigint;
}

export interface TPostSig {
  signMessageAsync: SignMessageMutateAsync;
  title: string;
  content: string;
  nonce: bigint;
}

export type TUserProfile = {
  username: string;
  reputation: bigint;
};
