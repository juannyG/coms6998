import { encodePacked } from "viem";
import { TPostSig } from "~~/types/spotlight";

export const encodePostDataForSignature = (title: string, content: string, nonce: bigint) => {
  return encodePacked(["string", "string", "uint256"], [title, content, nonce]);
};

export const createPostSignature = async ({ signMessageAsync, title, content, nonce }: TPostSig) => {
  const msgToSign = encodePostDataForSignature(title, content, nonce);
  return await signMessageAsync({ message: { raw: msgToSign } });
};
