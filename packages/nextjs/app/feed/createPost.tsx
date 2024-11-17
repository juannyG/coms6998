"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EditorContext } from "./context";
import Editor from "./richTextEditor/Editor";
import { encrypt } from "@metamask/eth-sig-util";
import { NextPage } from "next";
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

  const confirmPost = async (evt: React.MouseEventHandler<HTMLButtonElement>, paywalled = false) => {
    if (!address) {
      return;
    }

    try {
      const nonce = BigInt(Math.ceil(Math.random() * 10 ** 17));

      console.log("confirmPost.paywalled", paywalled);
      if (paywalled) {
        const publicKey = await window.ethereum.request({
          method: "eth_getEncryptionPublicKey",
          params: [address.toLowerCase()],
        });
        // console.log("pubKey for encryption:", publicKey);

        // For more info on this encryption algo see: https://crypto.stackexchange.com/a/77074
        const encryptedPost = encrypt({ publicKey, data: content, version: "x25519-xsalsa20-poly1305" });
        const strEncryptedPost = JSON.stringify(encryptedPost);
        console.log("encrypted post content", strEncryptedPost);

        // sleep for 500ms - metamask gets unhappy if you spam it with back-2-back reqs after en/decrypt methods
        await new Promise(f => setTimeout(f, 500));
        const postSig = await createPostSignature({ signMessageAsync, title, content: strEncryptedPost, nonce });
        setPostSig(postSig);
        console.log("Signature of post:", postSig);

        await writeSpotlightContractAsync({
          functionName: "createPost",
          args: [title, strEncryptedPost, nonce, postSig, paywalled],
        });

        // EXAMPLE DECRYPTION
        // import { decrypt } from "@metamask/eth-sig-util";
        // sleep for 500ms - metamask gets unhappy if you spam it with back-2-back reqs
        // await new Promise(f => setTimeout(f, 500));
        // const x = await window.ethereum.request({
        //   method: "eth_decrypt",
        //   params: [`0x${Buffer.from(JSON.stringify(encryptedPost), "utf8").toString("hex")}`, address],
        // });
        // console.log(x);
      } else {
        // TODO: work on this duplication... bleh
        const postSig = await createPostSignature({ signMessageAsync, title, content, nonce });
        setPostSig(postSig);
        console.log("Signature of post:", postSig);

        await writeSpotlightContractAsync({
          functionName: "createPost",
          args: [title, content, nonce, postSig, paywalled],
        });
      }
      setClickPost(true);
    } catch (e: any) {
      console.log(e);
    }
  };

  const value = {
    setContent,
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
