"use client";

import { useEffect, useState } from "react";
import { EditorContext } from "./context";
import Editor from "./richTextEditor/Editor";
import "./richTextEditor/styles.css";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const CreatePage: NextPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [clickPost, setClickPost] = useState(false);
  const { address } = useAccount();
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");

  function handleTitleChange(e: any) {
    setTitle(e.target.value);
  }

  useEffect(() => {
    // We can get the editor content.
    // console.log("TITLE: ", title);
    // console.log("CONTENT: ", content);
    // console.log("CLICK POST: ", clickPost);
    if (clickPost) {
      // console.log("Post is clicked");
      setClickPost(false);
    }
  }, [title, content, clickPost]);

  const value = {
    setContent,
    confirmPost: async () => {
      if (!address) {
        return;
      }
      console.log("Title to be posted", title);
      console.log("Content to be posted", content);
      console.log("Creator", address);
      const ts = BigInt(Date.now());
      try {
        await writeSpotlightContractAsync({
          functionName: "createPost",
          args: [
            {
              id: "0x0",
              creator: address,
              title: title,
              content: content,
              createdAt: ts,
              lastUpdatedAt: ts,
            },
            "0x0",
          ],
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
