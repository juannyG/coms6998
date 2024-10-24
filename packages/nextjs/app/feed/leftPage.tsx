import { NextPage } from "next";

const LeftPage: NextPage = () => {
  return (
    <div className="flex flex-col items-end gap-20">
      <div className="flex flex-col justify-start items-start w-[70%] border rounded p-5 gap-4">
        <p className="flex-grow-0 flex-shrink-0 w-[100%] text-lg text-left">
          <span className="flex-grow-0 flex-shrink-0 w-[100%] text-lg font-bold text-left text-[#3466f6]">
            spotlight
          </span>
          <span className="flex-grow-0 flex-shrink-0 w-[100%] text-lg font-semibold text-left text-black">
            , a decentralized social media that pays you
          </span>
        </p>
        <p className="flex-grow-0 flex-shrink-0 w-[100%] text-base text-left text-[#575757]">
          we are better than X and Reddit hehe
        </p>
        <div className="flex w-full justify-center">
          <button className="btn btn-outline rounded text-[#3466f6] border border-[#3466f6]">about spotlight</button>
        </div>
      </div>

      <div className="flex flex-col justify-start items-start w-[70%] border rounded p-5 gap-4">
        <div className="flex-grow-0 flex-shrink-0 text-sm font-bold text-left text-black">Popular Communities</div>
        <div className="flex justify-between items-center flex-grow-0 flex-shrink-0 w-[100%] h-5">
          <p className="text-base text-left text-black">ETH</p>
          <div className="flex justify-center w-10 h-5 rounded-[20px] bg-gray-100 border border-[#e6ebf1]">
            <p className="text-[13px] font-semibold text-left text-gray-500">+99</p>
          </div>
        </div>
        <div className="flex justify-between items-center flex-grow-0 flex-shrink-0 w-[100%] h-5">
          <p className="text-base text-left text-black">Javascript</p>
          <div className="flex justify-center w-10 h-5 rounded-[20px] bg-gray-100 border border-[#e6ebf1]">
            <p className="text-[13px] font-semibold text-left text-gray-500">+99</p>
          </div>
        </div>
        <div className="flex justify-between items-center flex-grow-0 flex-shrink-0 w-[100%] h-5">
          <p className="text-base text-left text-black">Solidity</p>
          <div className="flex justify-center w-10 h-5 rounded-[20px] bg-gray-100 border border-[#e6ebf1]">
            <p className="text-[13px] font-semibold text-left text-gray-500">+99</p>
          </div>
        </div>
        <div className="flex justify-between items-center flex-grow-0 flex-shrink-0 w-[100%] h-5">
          <p className="text-base text-left text-black">Python</p>
          <div className="flex justify-center w-10 h-5 rounded-[20px] bg-gray-100 border border-[#e6ebf1]">
            <p className="text-[13px] font-semibold text-left text-gray-500">+99</p>
          </div>
        </div>
        <div className="flex justify-between items-center flex-grow-0 flex-shrink-0 w-[100%] h-5">
          <p className="text-base text-left text-black">React</p>
          <div className="flex justify-center w-10 h-5 rounded-[20px] bg-gray-100 border border-[#e6ebf1]">
            <p className="text-[13px] font-semibold text-left text-gray-500">+99</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPage;
