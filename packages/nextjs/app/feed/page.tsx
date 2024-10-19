import ContentPage from "./content";
import FeedHeaderPage from "./header";
import LeftPage from "./leftPage";
import RightPage from "./rightPage";
import type { NextPage } from "next";

const FeedPage: NextPage = () => {
  return (
    <>
      <div className="w-full h-full  relative  bg-white box-border">
        <FeedHeaderPage />
        <div className="w-full flex gap-6 ">
          <div className="w-[24%] mt-6">
            <LeftPage />
          </div>
          <div className="w-[50%] mt-6">
            <ContentPage />
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
