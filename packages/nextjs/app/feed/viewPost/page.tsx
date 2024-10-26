"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import FeedHeaderPage from "../header";
import Viewer from "../richTextEditor/Viewer";
import "../richTextEditor/styles.css";
import type { NextPage } from "next";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { TPost } from "~~/types/spotlight";

const ViewPostPage: NextPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const searchParams = useSearchParams();
  const postSig = searchParams.get("postSig") || "";

  const { data } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "getPost",
    args: [postSig as `0x${string}`],
    watch: true,
  }) as { data: TPost | undefined };

  useEffect(() => {
    console.log("postSig", postSig);
    console.log("data", data);
    if (data) {
      setTitle(data.title);
      setContent(data.content);
    }
  }, [data]);

  if (!postSig) {
    return <div>Loading...</div>; // Handle case where postSig is not yet available
  }

  return (
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
          <Viewer data={content} />
        </div>
      </div>
    </div>
  );
};

export default ViewPostPage;
