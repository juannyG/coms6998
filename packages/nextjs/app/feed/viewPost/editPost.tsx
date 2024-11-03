"use client";

import { useState } from "react";
import Editor from "../richTextEditor/EditPostEditor";
import "../richTextEditor/styles.css";
import { EditPostEditorContext } from "./editPostContext";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { TPost } from "~~/types/spotlight";

const EditPost = ({ tPost, closeEditPage }: { tPost: TPost; closeEditPage: () => void }) => {
  const [content, setContent] = useState(tPost.content);
  const { address } = useAccount();
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");

  const value = {
    setContent,
    cancel: () => {
      closeEditPage();
    },
    confirmPost: async () => {
      if (!address) {
        return;
      }
      try {
        const postId = tPost.signature; // use old signature as post id

        console.log("Edited Post Id", postId);

        await writeSpotlightContractAsync({ functionName: "editPost", args: [postId, content] });
      } catch (e: any) {
        console.log(e);
      }
      closeEditPage();
    },
  };

  return (
    <EditPostEditorContext.Provider value={value}>
      <div className="w-full h-[30%] flex flex-col justify-between px-4 border border-[#e6ebf1]">
        <div className="w-full flex flex-row items-center justify-start gap-4 pt-2">
          <p className="text-lg font-semibold text-left text-black">Title</p>
          <input type="text" className="input input-bordered rounded-lg w-full max-w-xs" value={tPost.title} readOnly />
        </div>
        <div className="divider"></div>
        <div className="w-full flex flex-col">
          <p className="text-lg font-semibold text-left text-black ">Description</p>
          <Editor data={tPost.content} />
        </div>
      </div>
    </EditPostEditorContext.Provider>
  );
};

export default EditPost;
