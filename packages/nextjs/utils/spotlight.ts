import { encodePacked } from "viem";
import { TPostSig } from "~~/types/spotlight";

export const createPostSignature = async ({ signMessageAsync, title, content, nonce }: TPostSig) => {
  const msgToSign = encodePacked(["string", "string", "uint256"], [title, content, nonce]);
  return await signMessageAsync({ message: { raw: msgToSign } });
};
