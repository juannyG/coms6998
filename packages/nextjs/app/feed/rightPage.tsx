import type { NextPage } from "next";

const RightPage: NextPage = function () {
  return (
    <div className="flex flex-col justify-start border border-[#e6ebf1] p-4 hidden sm:block">
      <div className="w-[80%] h-5 mb-5">
        <p className="text-sm font-bold text-left text-black">Hot Today</p>
      </div>
      <div className="w-[80%] flex flex-col justify-start items-start">
        <p className=" text-sm font-medium text-left text-black">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
        </p>
        <div className="divider"></div>
      </div>
      <div className="w-[80%] flex flex-col justify-start items-start">
        <p className="text-sm font-medium text-left text-black">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
        </p>
        <div className="divider"></div>
      </div>
      <div className="w-[80%] flex flex-col justify-start items-start">
        <p className="text-sm font-medium text-left text-black">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
        </p>
        <div className="divider"></div>
      </div>
      <div className="w-[80%] flex flex-col justify-start items-start">
        <p className="text-sm font-medium text-left text-black">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
        </p>
      </div>
    </div>
  );
};

export default RightPage;
