"use client";

import CreatePage from "./createPost";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { TPost } from "~~/types/spotlight";

const RenderPosts = ({ data }: { data: any }) => {
  if (data === undefined) {
    return <>Loading...</>;
  }

  if (data.length == 0) {
    return <>No posts yet (To be styled!)</>;
  }
  return (
    <>
      {data.map((p: TPost) => {
        return (
          <div key={p.createdAt} className="flex flex-col justify-start gap-4 p-4 w-[100%] border boder-[#3466f6]">
            <div className="flex justify-start items-center gap-4">
              <div className="avatar">
                <div className="w-10 h-10 rounded-full">
                  <img alt="" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <p className="text-sm font-semibold text-left text-black">{p.creator}</p>
            </div>
            <p className="w-[100%]text-lg font-bold text-left text-black">{p.title}</p>
            <p className="w-[100%]text-lg text-left text-black" dangerouslySetInnerHTML={{ __html: p.content }} />
            <div className="flex justify-start gap-4 w-[100%] h-5">
              <p className="text-sm text-left text-gray-500">#web3</p>
              <p className="text-sm text-left text-gray-500">#eth</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

const ContentPage: NextPage = function () {
  const { address } = useAccount();
  const { data } = useScaffoldReadContract({
    account: address,
    contractName: "Spotlight",
    functionName: "getCommunityPosts",
    watch: true,
  });

  console.log("community posts:", data);

  return (
    <div className="flex flex-col gap-10">
      <CreatePage />
      <RenderPosts data={data} />
    </div>
  );
};

export default ContentPage;
