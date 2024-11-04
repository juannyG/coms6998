"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContentPage from "./contentPage";
import CreatePage from "./createPost";
import FeedHeaderPage from "./header";
import LeftPage from "./leftPage";
import RightPage from "./rightPage";
import type { NextPage } from "next";
import { UserProfileContext } from "~~/contexts/UserProfile";

const FeedPage: NextPage = () => {
  const router = useRouter();
  const { userProfile } = useContext(UserProfileContext);
  useEffect(() => {
    if (userProfile && userProfile.username === "") {
      // They need to go register first...
      router.push("/");
    }
  });

  if (userProfile === undefined) {
    // We cannot render anything
    return;
  }

  return (
    <>
      <div className="w-full h-full relative bg-white box-border">
        <FeedHeaderPage />
        <div className="w-full flex gap-6 ">
          <div className="w-[24%] mt-6">
            <LeftPage />
          </div>
          <div className="w-[50%] mt-6">
            <div className="flex flex-col gap-10">
              <CreatePage />
              <ContentPage />
            </div>
          </div>
          <div className="w-[20%] mt-6">
            <RightPage />
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedPage;
