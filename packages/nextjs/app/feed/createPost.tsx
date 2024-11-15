"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EditorContext } from "./context";
import Editor from "./richTextEditor/Editor";
import { Client } from "@web3-storage/w3up-client";
import { NextPage } from "next";
import { toHex } from "viem";
import { useAccount, useSignMessage } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { TW3Post } from "~~/types/spotlight";
import { bigintSerializer, createPostSignature, getW3StorageClient } from "~~/utils/spotlight";

const CreatePage: NextPage = () => {
  const [w3client, setW3Client] = useState<Client>();
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
    const getClient = async () => {
      const c = await getW3StorageClient();
      setW3Client(c);
    };

    getClient().catch(e => {
      console.error(e);
    });
  }, [setW3Client]);

  useEffect(() => {
    if (clickPost && postSig) {
      const query = new URLSearchParams({ postSig: postSig }).toString();
      router.push(`/feed/viewPost?${query}`);
      setClickPost(false);
    }
  }, [clickPost, router, postSig]);

  const value = {
    setContent,
    confirmPost: async () => {
      if (!address) {
        return;
      }
      if (w3client === undefined) {
        console.log("No web3.storage client available"); // TODO - better error handling
        return;
      }
      try {
        const nonce = BigInt(Math.ceil(Math.random() * 10 ** 17));
        const postSig = await createPostSignature({ signMessageAsync, title, content, nonce });
        setPostSig(postSig);

        console.log("Signature of post:", postSig);

        const postStruct = {
          title,
          content,
          nonce,
          signature: postSig,
        } as TW3Post;
        const json = JSON.stringify(postStruct, bigintSerializer);
        const blob = new Blob([json], { type: "application/json" });

        // TODO: Need an overlay - this is slow...
        const res = await w3client.uploadFile(new File([blob], `${postSig}.json`));
        const cid = res.toString();
        console.log("Post w3 CID:", toHex(cid));

        await writeSpotlightContractAsync({
          functionName: "createPost",
          args: [title, content, nonce, postSig, toHex(cid)],
        });
      } catch (e: any) {
        console.log(e);
      }

      setClickPost(true);
    },
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
