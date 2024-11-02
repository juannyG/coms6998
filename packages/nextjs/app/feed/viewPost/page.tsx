"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import FeedHeaderPage from "../header";
import Viewer from "../richTextEditor/Viewer";
import "../richTextEditor/styles.css";
import Comments from "./comments";
import EditPost from "./editPost";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { TPost } from "~~/types/spotlight";

const ViewPostPage: NextPage = () => {
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");

  const [liked, setLiked] = useState(false);
  const [openEditPage, setOpenEditPage] = useState(false);
  const imgSrc = liked ? "/liked.png" : "/not-liked.png";

  const searchParams = useSearchParams();
  const postSig = searchParams.get("postSig") || "";
  const { address } = useAccount();

  const { data, refetch } = useScaffoldReadContract({
    account: address,
    contractName: "Spotlight",
    functionName: "getPost",
    args: [postSig as `0x${string}`],
    watch: true,
  }) as {
    data: TPost | undefined;
    refetch: ReturnType<typeof useScaffoldReadContract>["refetch"];
  };

  const onclickEdit = () => {
    setOpenEditPage(true);
  };

  const closeEditPage = () => {
    setOpenEditPage(false);
    refetch();
  };

  // TODO: Disable clickability until tx complete!
  const handleLike = async () => {
    // intent of click === inversion of state, hence "!liked"
    console.log(!liked);
    if (!liked === true) {
      try {
        await writeSpotlightContractAsync({
          functionName: "upvote",
          args: [postSig as `0x${string}`],
        });
      } catch (e: any) {
        console.log(e);
      }
    }
    setLiked(!liked);
  };

  return (
    <>
      <div className="w-full h-full  relative  bg-white box-border">
        <FeedHeaderPage />
        <div className="w-full flex gap-6 justify-center">
          <div className="w-[50%] mt-6 flex flex-col ">
            <div className="mb-4">
              <a
                onClick={() => window.history.back()}
                className="inline-flex items-center border border-indigo-300 px-3 py-1.5 rounded-md text-indigo-500 hover:bg-indigo-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  ></path>
                </svg>
                <span className="ml-1 font-bold text-lg">Back</span>
              </a>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-row items-center justify-between gap-4">
                <img alt="" src="/avatar.png" className="w-10 h-10 rounded-[40px] object-cover ml-2" />
                <p className="text-lg  text-left text-black">{data?.creator}</p>
              </div>
              <div className="flex gap-2">
                {address === data?.creator && (
                  <button className="btn btn-danger btn-sm" onClick={onclickEdit}>
                    Edit
                  </button>
                )}
              </div>
            </div>
            <div className="p-[10px]">
              <h1 className="text-2xl font-bold">{data?.title}</h1>
            </div>
            <Viewer data={data?.content} />
            <div className="flex">
              <div className="columns-2 text-xs text-left">
                <div className="pl-2">
                  <Image
                    alt="Like"
                    className="cursor-pointer"
                    width="20"
                    height="20"
                    src={imgSrc}
                    onClick={handleLike}
                  />
                </div>
                <div className="items-right text-right">
                  <div className="pr-2">12345 likes</div>
                </div>
              </div>
            </div>
            <Comments />
          </div>
        </div>
      </div>

      {openEditPage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <div className="mt-4 flex justify-center gap-4">
              <EditPost tPost={data!} closeEditPage={closeEditPage} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewPostPage;
