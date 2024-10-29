"use client";

import { useSearchParams } from "next/navigation";
import FeedHeaderPage from "../header";
import Viewer from "../richTextEditor/Viewer";
import "../richTextEditor/styles.css";
import Comments from "./comments";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { TPost } from "~~/types/spotlight";

const ViewPostPage: NextPage = () => {
  const searchParams = useSearchParams();
  const postSig = searchParams.get("postSig") || "";
  const { address } = useAccount();

  const { data } = useScaffoldReadContract({
    account: address,
    contractName: "Spotlight",
    functionName: "getPost",
    args: [postSig as `0x${string}`],
    watch: true,
  }) as { data: TPost | undefined };

  if (!postSig) {
    return <div>Loading...</div>; // Handle case where postSig is not yet available
  }

  return (
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
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
              {address === data?.creator && <button className="btn btn-danger btn-sm">Edit</button>}
            </div>
          </div>
          <div className="p-[10px]">
            <h1 className="text-2xl font-bold">{data?.title}</h1>
          </div>
          <Viewer data={data?.content} />
          <Comments />
        </div>
      </div>
    </div>
  );
};

export default ViewPostPage;
