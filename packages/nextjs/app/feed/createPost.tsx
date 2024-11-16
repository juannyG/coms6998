"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EditorContext } from "./context";
import Editor from "./richTextEditor/Editor";
import { decrypt, encrypt } from "@metamask/eth-sig-util";
import { NextPage } from "next";
import { toHex } from "viem";
import { useAccount, useSignMessage } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { createPostSignature } from "~~/utils/spotlight";

const CreatePage: NextPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [clickPost, setClickPost] = useState(false);
  const [postSig, setPostSig] = useState("");
  const router = useRouter();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");

  function handleTitleChange(e: any) {
    setTitle(e.target.value);
  }

  useEffect(() => {
    if (clickPost && postSig) {
      const query = new URLSearchParams({ postSig: postSig }).toString();
      router.push(`/feed/viewPost?${query}`);
      setClickPost(false);
    }
  }, [clickPost, router, postSig]);

  const confirmPost = async (paywalled = false) => {
    if (!address) {
      return;
    }
    console.log("confirmPost.paywalled", paywalled);
    if (paywalled) {
      // TODO: The check for paywalling is buried in the editor right now. Make that a more global context
      const publicKey = await window.ethereum.request({
        method: "eth_getEncryptionPublicKey",
        params: [address.toLowerCase()],
      });
      console.log("pubKey for encryption:", publicKey);
      const encryptedPost = encrypt({ publicKey, data: content, version: "x25519-xsalsa20-poly1305" });
      console.log(encryptedPost);
      console.log(toHex(encryptedPost.ciphertext));

      // sleep for 500ms - metamask gets unhappy if you hammer it with back-2-back reqs
      await new Promise(f => setTimeout(f, 500));
      const x = await window.ethereum.request({
        method: "eth_decrypt",
        params: [`0x${Buffer.from(JSON.stringify(encryptedPost), "utf8").toString("hex")}`, address],
      });
      console.log(x);
    }
    try {
      // const nonce = BigInt(Math.ceil(Math.random() * 10 ** 17));
      // const postSig = await createPostSignature({ signMessageAsync, title, content, nonce });
      // setPostSig(postSig);
      // console.log("Signature of post:", postSig);
      // await writeSpotlightContractAsync({ functionName: "createPost", args: [title, content, nonce, postSig] });
      // setClickPost(true);
    } catch (e: any) {
      console.log(e);
    }
  };

  const value = {
    setContent,
    confirmPaywallPost: async () => {
      confirmPost(true);
    },
    confirmPost,
  };

  return (
    <EditorContext.Provider value={value}>
      <div className="w-full h-[30%] flex flex-col justify-between px-4 border border-[#e6ebf1]">
        <div className="w-full flex flex-row items-center justify-start gap-4 pt-2">
          <p className="text-lg font-semibold text-left text-black">Title</p>
          <input
            type="text"
            placeholder="Enter your title"
            className="input input-bordered rounded-lg w-full max-w-xs"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="divider"></div>
        <div className="w-full flex flex-col">
          <p className="text-lg font-semibold text-left text-black ">Description</p>
          <Editor />
        </div>
      </div>
    </EditorContext.Provider>
  );
};

export default CreatePage;
