import { Address } from "viem";
import { SignMessageMutateAsync } from "wagmi/query";

export interface TPost {
  id: `0x${string}`;
  creator: Address;
  title: string;
  content: string;
  createdAt: bigint;
  lastUpdatedAt: bigint;
}

export interface TPostSig {
  signMessageAsync: SignMessageMutateAsync;
  post: TPost;
}
