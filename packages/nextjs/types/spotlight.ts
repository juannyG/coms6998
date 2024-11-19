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
  paywalled: boolean;
  createdAt: bigint;
  lastUpdatedAt: bigint;
  upvoteCount: bigint;
  downvoteCount: bigint;
  comments?: TComment[]; // Optional field to store comments
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
  avatarCID: string;
};

export interface TComment {
  commenter: Address;
  content: string;
  createdAt: bigint;
}
