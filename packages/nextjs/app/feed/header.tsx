"use client";

import { NextPage } from "next";

const FeedHeaderPage: NextPage = () => {
  return (
    <div className="w-full h-20 relative">
      <div className="w-full h-20 absolute top-[-0.5px] bg-white" style={{ boxShadow: "0px 1px 0px 0 #e8edf3" }} />

      <div className="grid grid-cols-3 grid-cols-[1fr_50%_1fr] items-center w-full h-20 relative">
        <div className="col-span-1 h-full">
          <p className="absolute left-60 top-6 text-2xl font-bold text-left text-black">Spotlight</p>
        </div>
        <div className="col-span-1 w-full h-full flex justify-center items-center">
          <label className="w-[80%] input input-bordered flex justify-center items-center gap-2">
            <input type="text" className="grow" placeholder="Search" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>

        <div className="col-span-1 h-full relative flex items-center justify-center gap-4">
          <div className="indicator">
            <span className="indicator-item badge bg-red-500 text-white">1</span>
            <div className="grid h-8 w-8 place-items-center">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 "
                preserveAspectRatio="none"
              >
                <g clipPath="url(#clip0_13_1184)">
                  <path
                    d="M22 20H2V18H3V11.031C3 6.043 7.03 2 12 2C16.97 2 21 6.043 21 11.031V18H22V20ZM5 18H19V11.031C19 7.148 15.866 4 12 4C8.134 4 5 7.148 5 11.031V18ZM9.5 21H14.5C14.5 21.663 14.2366 22.2989 13.7678 22.7678C13.2989 23.2366 12.663 23.5 12 23.5C11.337 23.5 10.7011 23.2366 10.2322 22.7678C9.76339 22.2989 9.5 21.663 9.5 21Z"
                    fill="#374151"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_13_1184">
                    <rect width={24} height={24} fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <div className="indicator">
            <span className="indicator-item badge bg-red-500 text-white">1</span>
            <div className="grid h-8 w-8 place-items-center">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 "
                preserveAspectRatio="none"
              >
                <g clipPath="url(#clip0_13_1192)">
                  <path
                    d="M7.29101 20.824L2.00001 22L3.17601 16.709C2.40154 15.2604 1.99754 13.6426 2.00001 12C2.00001 6.477 6.47701 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C10.3574 22.0025 8.73963 21.5985 7.29101 20.824ZM7.58101 18.711L8.23401 19.061C9.39256 19.6801 10.6864 20.0027 12 20C13.5823 20 15.129 19.5308 16.4446 18.6518C17.7602 17.7727 18.7855 16.5233 19.391 15.0615C19.9965 13.5997 20.155 11.9911 19.8463 10.4393C19.5376 8.88743 18.7757 7.46197 17.6569 6.34315C16.538 5.22433 15.1126 4.4624 13.5607 4.15372C12.0089 3.84504 10.4004 4.00346 8.93854 4.60896C7.47674 5.21447 6.22731 6.23984 5.34825 7.55544C4.4692 8.87103 4.00001 10.4177 4.00001 12C4.00001 13.334 4.32501 14.618 4.94001 15.766L5.28901 16.419L4.63401 19.366L7.58101 18.711Z"
                    fill="#374151"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_13_1192">
                    <rect width={24} height={24} fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <img alt="" src="/avatar.png" className="w-10 h-10 rounded-[40px] object-cover ml-2" />
        </div>
      </div>
    </div>
  );
};

export default FeedHeaderPage;
