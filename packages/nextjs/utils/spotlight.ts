import { encodePacked } from "viem";
import { TPostSig } from "~~/types/spotlight";

export const createPostSignature = async ({ signMessageAsync, post }: TPostSig) => {
  const msgToSign = encodePacked(
    ["string", "string", "uint256", "uint256"],
    [post.title, post.content, post.createdAt, post.lastUpdatedAt],
  );

  return await signMessageAsync({ message: { raw: msgToSign } });
};
