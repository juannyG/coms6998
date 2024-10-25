"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import FeedHeaderPage from "../header";
import Viewer from "../richTextEditor/Viewer";
import "../richTextEditor/styles.css";
import type { NextPage } from "next";

const ViewPostPage: NextPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    // get the content from the session storage
    const sessionContent = sessionStorage.getItem("postContent");
    const sessionTitle = sessionStorage.getItem("postTitle");
    if (sessionContent && sessionTitle) {
      setTitle(sessionTitle);
      setContent(sessionContent);
    }
  }, []);

  return (
    <>
      <div className="w-full h-full  relative  bg-white box-border">
        <FeedHeaderPage />
        <div className="w-full flex gap-6 justify-center">
          <div className="w-[50%] mt-6 flex flex-col ">
            <div className="flex flex-row items-center gap-4">
              <img alt="" src="/avatar.png" className="w-10 h-10 rounded-[40px] object-cover ml-2" />
              <p className="text-lg  text-left text-black">Garfield</p>
            </div>
            <div className="p-[10px]">
              <h1 className="text-2xl font-bold">{title}</h1>
            </div>
            <Viewer />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPostPage;
