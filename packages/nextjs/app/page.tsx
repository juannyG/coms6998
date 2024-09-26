"use client";

import { useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";

const PostTitle = () => {
  return (
    <>
      <div className="text-left">My awesome post! - username</div>
    </>
  );
};

const PostBody = () => {
  return (
    <>
      <div className="text-left text-sm text-wrap">
        Lorem impsum lorem. Lorem impsum lorem. Lorem impsum lorem. Lorem impsum lorem. Lorem impsum lorem.
      </div>
    </>
  );
};

const PostFooter = () => {
  const [liked, setLiked] = useState(false);
  const imgSrc = liked ? "/liked.png" : "/not-liked.png";

  return (
    <>
      <div className="columns-2 text-xs text-left">
        <div className="pl-2">
          <Image
            alt="Like"
            className="cursor-pointer"
            width="20"
            height="20"
            src={imgSrc}
            onClick={() => {
              console.log(!liked);
              setLiked(!liked);
            }}
          />
        </div>
        <div className="items-right text-right">
          <div className="pr-2">12345 likes</div>
        </div>
      </div>
    </>
  );
};

const PostsCard = () => {
  return (
    <div className="card bg-secondary text-primary-content">
      <div className="px-5 card-body items-center text-center">
        <div className="card bg-accent">
          <div className="px-5 card-body items-left text-left">
            <PostTitle />
            <div className="divider p-0 m-0"></div>
            <PostBody />
            <div className="divider p-0 m-0"></div>
            <PostFooter />
          </div>
        </div>
      </div>
      <div className="px-5 pt-2 card-body items-center text-center">
        <div className="card bg-accent">
          <div className="px-5 card-body items-left text-left">
            <PostTitle />
            <div className="divider p-0 m-0"></div>
            <PostBody />
            <div className="divider p-0 m-0"></div>
            <PostFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

const WelcomeCard = () => {
  return (
    <>
      <div className="card bg-secondary text-primary-content">
        <div className="px-5 card-body items-center text-center">
          <div className="">Welcome to</div>
          <div>
            <Image alt="Spotlight-Logo" className="" width="500" height="500" src="/spotlight-logo.png" />
          </div>
        </div>
      </div>
    </>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="p-5">
          <WelcomeCard />
        </div>
        <div className="p-5 w-lg max-w-lg">
          <PostsCard />
        </div>
      </div>
    </>
  );
};

export default Home;
