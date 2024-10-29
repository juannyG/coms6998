import React from "react";
import type { NextPage } from "next";

const Comments: NextPage = () => {
  return (
    <div className="flex flex-col h-dvh bg-[url(/rectangle-6.svg)] bg-[100%_100%]">
      {/* Comments Header */}
      <div className="px-10 pt-[30px] [font-family:'Inter-Bold',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal]">
        Comments (1)
      </div>

      {/* Comment Input Section */}
      <div className="flex items-start gap-5 px-10 mt-3">
        <img alt="" src="/avatar.png" className="w-10 h-10 rounded-[40px] object-cover ml-2 flex-shrink-0" />
        <div className="flex-grow">
          <div className="w-full h-20 bg-white rounded border-2 border-solid border-[#eeeeee] p-2.5">
            <div className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#8f8f8f] text-base tracking-[0] leading-[normal] whitespace-nowrap">
              Should be text input box
            </div>
          </div>
        </div>
      </div>

      {/* Comment Item */}
      <div className="flex flex-col px-10 mt-5">
        <div className="flex gap-[52px]">
          {/* User Avatar */}
          <img alt="" src="/avatar.png" className="w-10 h-10 rounded-[40px] object-cover ml-2 flex-shrink-0" />
          {/* Comment Content */}
          <div className="flex flex-col gap-1">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <span className="[font-family:'Inter-Medium',Helvetica] font-medium text-black text-base tracking-[0] leading-[normal] whitespace-nowrap">
                Fake User 1
              </span>
              <span className="[font-family:'Inter-Regular',Helvetica] font-normal text-gray-500 text-base tracking-[0] leading-[normal] whitespace-nowrap" />
            </div>

            {/* Comment Text */}
            <p className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#111624] text-base tracking-[0] leading-[normal] whitespace-nowrap">
              This deserves more upvotes.
            </p>
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="[font-family:'Inter-Medium',Helvetica] font-medium text-gray-500 text-[13px] tracking-[0] leading-[normal]">
                Upvote (2)
              </button>
              <button className="[font-family:'Inter-Medium',Helvetica] font-medium text-gray-500 text-[13px] tracking-[0] leading-[normal]">
                Downvote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
