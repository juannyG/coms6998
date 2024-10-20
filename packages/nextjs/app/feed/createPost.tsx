"use client";

import { useEffect, useState } from "react";
import { EditorContext } from "./context";
import Editor from "./richTextEditor/Editor";
import "./richTextEditor/styles.css";
import { NextPage } from "next";

const CreatePage: NextPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [clickPost, setClickPost] = useState(false);

  function handleTitleChange(e: any) {
    setTitle(e.target.value);
  }

  useEffect(() => {
    // We can get the editor content.
    // console.log("TITLE: ", title);
    // console.log("CONTENT: ", content);
    // console.log("CLICK POST: ", clickPost);
    // if(clickPost) {
    //     // console.log("Post is clicked");
    //     setClickPost(false);
    // }
  }, [title, content, clickPost]);

  const value = {
    setContent,
    confirmPost: () => {
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
