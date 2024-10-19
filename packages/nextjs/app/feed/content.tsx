import { NextPage } from "next";

const ContentPage: NextPage = function () {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col justify-start gap-4 p-4 w-[100%] border boder-[#3466f6]">
        <div className="flex justify-start items-center gap-4">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <p className="text-sm font-semibold text-left text-black">Garfield</p>
        </div>
        <p className="w-[100%]text-lg font-bold text-left text-black">hihi</p>
        <div className="flex justify-start gap-4 w-[100%] h-5">
          <p className="text-sm text-left text-gray-500">#web3</p>
          <p className="text-sm text-left text-gray-500">#eth</p>
        </div>
      </div>
      <div className="flex flex-col justify-start gap-4 p-4 w-[100%] border boder-[#3466f6]">
        <div className="flex justify-start items-center gap-4">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <p className="text-sm font-semibold text-left text-black">Garfield</p>
        </div>
        <p className="w-[100%]text-lg font-bold text-left text-black">hihi</p>
        <div className="flex justify-start gap-4 w-[100%] h-5">
          <p className="text-sm text-left text-gray-500">#web3</p>
          <p className="text-sm text-left text-gray-500">#eth</p>
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
