"use client";

import Profile from "./profile";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="w-full sm:h-[80dvh] flex justify-center">
      <Profile />
    </div>
  );
};

export default Home;
