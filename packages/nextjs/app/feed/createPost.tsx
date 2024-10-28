"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EditorContext } from "./context";
import Editor from "./richTextEditor/Editor";
import "./richTextEditor/styles.css";
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

  const value = {
    setContent,
    confirmPost: async () => {
      if (!address) {
        return;
      }
      try {
        const nonce = BigInt(Math.random() * 10 ** 17);
        const postSig = await createPostSignature({ signMessageAsync, title, content, nonce });
        setPostSig(postSig);

        console.log("Signature of post:", postSig);

        await writeSpotlightContractAsync({ functionName: "createPost", args: [title, content, nonce, postSig] });
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
