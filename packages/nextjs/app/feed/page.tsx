import type { NextPage } from "next";

const FeedPage: NextPage = () => {
  return (
    <>
      <div className="w-[1440px] h-[1187px] relative overflow-hidden bg-white">
        <div className="w-[1440px] h-[77px]">
          <div
            className="w-[1440px] h-[77px] absolute left-[-0.5px] top-[-0.5px] bg-white"
            style={{ boxShadow: "0px 1px 0px 0 #e8edf3" }}
          />
          <p className="absolute left-[190px] top-6 text-2xl font-bold text-left text-black">Spotlight</p>
          <div className="w-[520px] h-10">
            <div className="w-[520px] h-10 absolute left-[459.5px] top-[17.5px] rounded-[40px] bg-[#f5f7fa] border border-[#e8edf3]" />
            <p className="absolute left-[474px] top-7 text-base text-left text-[#c5cad2]">
              whatever you wanna search about
            </p>
            <svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 absolute left-[950px] top-[30px]"
              preserveAspectRatio="xMidYMid meet"
            >
              <g clip-path="url(#clip0_13_1178)">
                <path
                  d="M7.33325 1.33334C10.6453 1.33334 13.3333 4.02134 13.3333 7.33334C13.3333 10.6453 10.6453 13.3333 7.33325 13.3333C4.02125 13.3333 1.33325 10.6453 1.33325 7.33334C1.33325 4.02134 4.02125 1.33334 7.33325 1.33334ZM7.33325 12C9.91125 12 11.9999 9.91134 11.9999 7.33334C11.9999 4.75468 9.91125 2.66668 7.33325 2.66668C4.75459 2.66668 2.66659 4.75468 2.66659 7.33334C2.66659 9.91134 4.75459 12 7.33325 12ZM12.9899 12.0473L14.8759 13.9327L13.9326 14.876L12.0473 12.99L12.9899 12.0473Z"
                  fill="#C5CAD2"
                />
              </g>
              <defs>
                <clipPath id="clip0_13_1178">
                  <rect width={16} height={16} fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <img
            src="avatar.png"
            className="w-10 h-10 absolute left-[1209.5px] top-[17.5px] rounded-[40px] object-cover"
          />
          <div className="w-10 h-10">
            <div className="w-10 h-10 absolute left-[1161.5px] top-[17.5px] rounded-[40px]" />
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 absolute left-[1170px] top-[26px]"
              preserveAspectRatio="none"
            >
              <g clip-path="url(#clip0_13_1184)">
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
            <div className="w-4 h-4">
              <div className="w-4 h-4 absolute left-[1181.5px] top-[20.5px] rounded-2xl bg-[#ff4f4f]" />
              <p className="absolute left-[1187px] top-[21px] text-xs font-bold text-left text-white">1</p>
            </div>
          </div>
          <div className="w-10 h-10">
            <div className="w-10 h-10 absolute left-[1113.5px] top-[17.5px] rounded-[40px]" />
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 absolute left-[1122px] top-[26px]"
              preserveAspectRatio="none"
            >
              <g clip-path="url(#clip0_13_1192)">
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
            <div className="w-4 h-4">
              <div className="w-4 h-4 absolute left-[1133.5px] top-[20.5px] rounded-2xl bg-[#ff4f4f]" />
              <p className="absolute left-[1139px] top-[21px] text-xs font-bold text-left text-white">1</p>
            </div>
          </div>
        </div>
        <div className="w-[250px] h-[522px]">
          <div className="flex flex-col justify-start items-start w-[250px] h-56 absolute left-[190px] top-[405px] gap-3 p-5 rounded bg-white border border-[#e8edf3]">
            <p className="flex-grow-0 flex-shrink-0 text-sm font-bold text-left text-black">Popular Communities</p>
            <div className="flex-grow-0 flex-shrink-0 w-[210px] h-5">
              <p className="absolute left-5 top-[50px] text-base text-left text-black">ETH</p>
              <div className="w-10 h-5">
                <div className="w-10 h-5 absolute left-[189.5px] top-[48.5px] rounded-[20px] bg-gray-100 border border-[#e6ebf1]" />
                <p className="absolute left-[197px] top-[51px] text-[13px] font-semibold text-left text-gray-500">
                  +99
                </p>
              </div>
            </div>
            <div className="flex-grow-0 flex-shrink-0 w-[210px] h-5">
              <p className="absolute left-5 top-[82px] text-base text-left text-black">Javascript</p>
              <div className="w-10 h-5">
                <div className="w-10 h-5 absolute left-[189.5px] top-[80.5px] rounded-[20px] bg-gray-100 border border-[#e6ebf1]" />
                <p className="absolute left-[197px] top-[83px] text-[13px] font-semibold text-left text-gray-500">
                  +99
                </p>
              </div>
            </div>
            <div className="flex-grow-0 flex-shrink-0 w-[210px] h-5">
              <p className="absolute left-5 top-[114px] text-base text-left text-black">Solidity</p>
              <div className="w-10 h-5">
                <div className="w-10 h-5 absolute left-[189.5px] top-[112.5px] rounded-[20px] bg-gray-100 border border-[#e6ebf1]" />
                <p className="absolute left-[197px] top-[115px] text-[13px] font-semibold text-left text-gray-500">
                  +99
                </p>
              </div>
            </div>
            <div className="flex-grow-0 flex-shrink-0 w-[210px] h-5">
              <p className="absolute left-5 top-[146px] text-base text-left text-black">Python</p>
              <div className="w-10 h-5">
                <div className="w-10 h-5 absolute left-[189.5px] top-[144.5px] rounded-[20px] bg-gray-100 border border-[#e6ebf1]" />
                <p className="absolute left-[197px] top-[147px] text-[13px] font-semibold text-left text-gray-500">
                  +99
                </p>
              </div>
            </div>
            <div className="flex-grow-0 flex-shrink-0 w-[210px] h-5">
              <p className="absolute left-5 top-[178px] text-base text-left text-black">React</p>
              <div className="w-10 h-5">
                <div className="w-10 h-5 absolute left-[189.5px] top-[176.5px] rounded-[20px] bg-gray-100 border border-[#e6ebf1]" />
                <p className="absolute left-[197px] top-[179px] text-[13px] font-semibold text-left text-gray-500">
                  +99
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start w-[250px] h-[233px] absolute left-[190px] top-[107px] gap-4 p-5 rounded bg-white border border-[#e8edf3]">
            <p className="flex-grow-0 flex-shrink-0 w-[210px] text-lg text-left">
              <span className="flex-grow-0 flex-shrink-0 w-[210px] text-lg font-bold text-left text-[#3466f6]">
                spotlight
              </span>
              <span className="flex-grow-0 flex-shrink-0 w-[210px] text-lg font-semibold text-left text-black">
                , a decentralized social media that pays you
              </span>
            </p>
            <p className="flex-grow-0 flex-shrink-0 w-[210px] text-base text-left text-[#575757]">
              we are better than X and Reddit hehe
            </p>
            <div className="flex-grow-0 flex-shrink-0 w-[210px] h-10">
              <div className="w-[210px] h-10 absolute left-[19.5px] top-[171.5px] rounded bg-white border border-[#3466f6]" />
              <p className="absolute left-[67px] top-[182px] text-base font-medium text-center text-[#3466f6]">
                about spotlight
              </p>
            </div>
          </div>
        </div>
        <div className="w-[520px] h-[1015px]">
          <div className="w-[520px] h-[187px] absolute left-[460px] top-[107px]">
            <div className="w-[520px] h-[187px] absolute left-[-1px] top-[-1px] rounded bg-white border border-[#e8edf3]" />
            <div className="w-[141px] h-[42px]">
              <div className="w-[97px] h-9">
                <p className="absolute left-16 top-5 text-sm font-semibold text-left text-black">janedoe</p>
                <p className="absolute left-16 top-[41px] text-xs text-left text-gray-500">3 minutes before</p>
                <svg
                  width={10}
                  height={10}
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-2.5 h-2.5 absolute left-[123px] top-[25px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clip-path="url(#clip0_13_1268)">
                    <path
                      d="M4.99992 9.16666C2.69867 9.16666 0.833252 7.30125 0.833252 5C0.833252 2.69875 2.69867 0.833328 4.99992 0.833328C7.30117 0.833328 9.16659 2.69875 9.16659 5C9.16659 7.30125 7.30117 9.16666 4.99992 9.16666ZM4.5845 6.66666L7.53034 3.72041L6.94117 3.13124L4.5845 5.48833L3.40575 4.30958L2.81659 4.89875L4.5845 6.66666Z"
                      fill="#3466F6"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_13_1268">
                      <rect width={10} height={10} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="w-9 h-[42px]">
                <img
                  src="avatar-2.png"
                  className="w-9 h-9 absolute left-[19.5px] top-[19.5px] rounded-[36px] object-cover"
                />
                <div className="w-7 h-3">
                  <div className="w-7 h-3 absolute left-[23.5px] top-[49.5px] rounded-sm bg-gray-500" />
                  <p className="absolute left-[31px] top-[52px] text-[7px] font-semibold text-left text-white">PRO</p>
                </div>
              </div>
            </div>
            <p className="w-[480px] absolute left-5 top-[74px] text-lg font-bold text-left text-black">hihi</p>
            <div className="w-[90px] h-[17px]">
              <p className="absolute left-[19px] top-[108px] text-sm text-left text-gray-500">#web3</p>
              <p className="absolute left-[78px] top-[108px] text-sm text-left text-gray-500">#eth</p>
            </div>
            <div className="w-[480px] h-[30px]">
              <div className="w-[37px] h-[18px]">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[18px] absolute left-[69px] top-[143px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clip-path="url(#clip0_13_1282)">
                    <path
                      d="M10.95 6H15.75C16.1478 6 16.5294 6.15804 16.8107 6.43934C17.092 6.72064 17.25 7.10218 17.25 7.5V9.078C17.2502 9.27402 17.212 9.46818 17.1375 9.6495L14.8162 15.2858C14.7596 15.4232 14.6634 15.5407 14.5399 15.6233C14.4164 15.706 14.2711 15.7501 14.1225 15.75H1.5C1.30109 15.75 1.11032 15.671 0.96967 15.5303C0.829018 15.3897 0.75 15.1989 0.75 15V7.5C0.75 7.30109 0.829018 7.11032 0.96967 6.96967C1.11032 6.82902 1.30109 6.75 1.5 6.75H4.1115C4.23157 6.75003 4.3499 6.72123 4.45653 6.66603C4.56315 6.61082 4.65497 6.53082 4.72425 6.43275L8.814 0.6375C8.8657 0.564235 8.94194 0.511921 9.0289 0.490043C9.11586 0.468165 9.20778 0.478173 9.288 0.51825L10.6485 1.1985C11.0314 1.38987 11.3372 1.70649 11.5153 2.09574C11.6933 2.48499 11.7329 2.92344 11.6273 3.33825L10.95 6ZM5.25 7.941V14.25H13.62L15.75 9.078V7.5H10.95C10.7215 7.49997 10.4961 7.44775 10.2909 7.34734C10.0857 7.24693 9.90617 7.10098 9.76596 6.92062C9.62575 6.74025 9.52859 6.53025 9.48189 6.30662C9.43519 6.08299 9.44019 5.85165 9.4965 5.63025L10.1737 2.96925C10.1949 2.88625 10.1871 2.79849 10.1515 2.72057C10.1159 2.64266 10.0546 2.57929 9.978 2.541L9.48225 2.2935L5.94975 7.2975C5.76225 7.563 5.52225 7.7805 5.25 7.941ZM3.75 8.25H2.25V14.25H3.75V8.25Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_13_1282">
                      <rect width={18} height={18} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="absolute left-[91px] top-[143px] text-sm font-medium text-left text-black">17</p>
              </div>
              <div className="w-8 h-[18px]">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[18px] absolute left-5 top-[143px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clip-path="url(#clip0_13_1287)">
                    <path
                      d="M7.5 2.25H10.5C12.0913 2.25 13.6174 2.88214 14.7426 4.00736C15.8679 5.13258 16.5 6.6587 16.5 8.25C16.5 9.8413 15.8679 11.3674 14.7426 12.4926C13.6174 13.6179 12.0913 14.25 10.5 14.25V16.875C6.75 15.375 1.5 13.125 1.5 8.25C1.5 6.6587 2.13214 5.13258 3.25736 4.00736C4.38258 2.88214 5.9087 2.25 7.5 2.25ZM9 12.75H10.5C11.0909 12.75 11.6761 12.6336 12.2221 12.4075C12.768 12.1813 13.2641 11.8498 13.682 11.432C14.0998 11.0141 14.4313 10.518 14.6575 9.97208C14.8836 9.42611 15 8.84095 15 8.25C15 7.65905 14.8836 7.07389 14.6575 6.52792C14.4313 5.98196 14.0998 5.48588 13.682 5.06802C13.2641 4.65016 12.768 4.31869 12.2221 4.09254C11.6761 3.8664 11.0909 3.75 10.5 3.75H7.5C6.30653 3.75 5.16193 4.22411 4.31802 5.06802C3.47411 5.91193 3 7.05653 3 8.25C3 10.9575 4.8465 12.7245 9 14.61V12.75Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_13_1287">
                      <rect width={18} height={18} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="absolute left-[42px] top-[143px] text-sm font-medium text-left text-black">3</p>
              </div>
              <div className="w-14 h-[30px]">
                <img
                  src="rectangle-11.png"
                  className="w-[30px] h-[30px] absolute left-[443px] top-[136px] rounded-[30px] object-cover border-2 border-white"
                />
                <img
                  src="rectangle-12.png"
                  className="w-[30px] h-[30px] absolute left-[469px] top-[136px] rounded-[30px] object-cover border-2 border-white"
                />
              </div>
              <div className="w-[41px] h-[18px]">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[18px] absolute left-[118px] top-[143px]"
                  preserveAspectRatio="none"
                >
                  <g clip-path="url(#clip0_13_1295)">
                    <path
                      d="M3.75 1.5H14.25C14.4489 1.5 14.6397 1.57902 14.7803 1.71967C14.921 1.86032 15 2.05109 15 2.25V16.6073C15.0001 16.6743 14.9822 16.7402 14.9482 16.7979C14.9142 16.8557 14.8653 16.9033 14.8066 16.9358C14.7479 16.9683 14.6816 16.9844 14.6146 16.9826C14.5476 16.9807 14.4823 16.9609 14.4255 16.9252L9 13.5225L3.5745 16.9245C3.51778 16.9601 3.45254 16.9799 3.38558 16.9818C3.31861 16.9837 3.25236 16.9676 3.19372 16.9352C3.13508 16.9029 3.08618 16.8554 3.05211 16.7977C3.01804 16.74 3.00005 16.6742 3 16.6073V2.25C3 2.05109 3.07902 1.86032 3.21967 1.71967C3.36032 1.57902 3.55109 1.5 3.75 1.5ZM13.5 3H4.5V14.574L9 11.7533L13.5 14.574V3Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_13_1295">
                      <rect width={18} height={18} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="absolute left-[140px] top-[143px] text-sm font-medium text-left text-black">48</p>
              </div>
            </div>
          </div>
          <div className="w-[520px] h-[187px] absolute left-[460px] top-[314px]">
            <div className="w-[520px] h-[187px] absolute left-[-1px] top-[-1px] rounded bg-white border border-[#e8edf3]" />
            <div className="w-[141px] h-[42px]">
              <div className="w-[97px] h-9">
                <p className="absolute left-16 top-5 text-sm font-semibold text-left text-black">janedoe</p>
                <p className="absolute left-16 top-[41px] text-xs text-left text-gray-500">3 minutes before</p>
                <svg
                  width={10}
                  height={10}
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-2.5 h-2.5 absolute left-[123px] top-[25px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clip-path="url(#clip0_34_8)">
                    <path
                      d="M4.99992 9.16667C2.69867 9.16667 0.833252 7.30125 0.833252 5C0.833252 2.69875 2.69867 0.833332 4.99992 0.833332C7.30117 0.833332 9.16659 2.69875 9.16659 5C9.16659 7.30125 7.30117 9.16667 4.99992 9.16667ZM4.5845 6.66667L7.53034 3.72042L6.94117 3.13125L4.5845 5.48833L3.40575 4.30958L2.81659 4.89875L4.5845 6.66667Z"
                      fill="#3466F6"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_8">
                      <rect width={10} height={10} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="w-9 h-[42px]">
                <img
                  src="avatar-2.png"
                  className="w-9 h-9 absolute left-[19.5px] top-[19.5px] rounded-[36px] object-cover"
                />
                <div className="w-7 h-3">
                  <div className="w-7 h-3 absolute left-[23.5px] top-[49.5px] rounded-sm bg-gray-500" />
                  <p className="absolute left-[31px] top-[52px] text-[7px] font-semibold text-left text-white">PRO</p>
                </div>
              </div>
            </div>
            <p className="w-[480px] absolute left-5 top-[74px] text-lg font-bold text-left text-black">hihi</p>
            <div className="w-[90px] h-[17px]">
              <p className="absolute left-[19px] top-[108px] text-sm text-left text-gray-500">#web3</p>
              <p className="absolute left-[78px] top-[108px] text-sm text-left text-gray-500">#eth</p>
            </div>
            <div className="w-[480px] h-[30px]">
              <div className="w-[37px] h-[18px]">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[18px] absolute left-[69px] top-[143px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clip-path="url(#clip0_34_22)">
                    <path
                      d="M10.95 6H15.75C16.1478 6 16.5294 6.15804 16.8107 6.43934C17.092 6.72065 17.25 7.10218 17.25 7.5V9.078C17.2502 9.27402 17.212 9.46818 17.1375 9.6495L14.8162 15.2858C14.7596 15.4232 14.6634 15.5407 14.5399 15.6233C14.4164 15.706 14.2711 15.7501 14.1225 15.75H1.5C1.30109 15.75 1.11032 15.671 0.96967 15.5303C0.829018 15.3897 0.75 15.1989 0.75 15V7.5C0.75 7.30109 0.829018 7.11033 0.96967 6.96967C1.11032 6.82902 1.30109 6.75 1.5 6.75H4.1115C4.23157 6.75003 4.3499 6.72124 4.45653 6.66603C4.56315 6.61082 4.65497 6.53082 4.72425 6.43275L8.814 0.637504C8.8657 0.564239 8.94194 0.511924 9.0289 0.490047C9.11586 0.468169 9.20778 0.478176 9.288 0.518254L10.6485 1.1985C11.0314 1.38988 11.3372 1.70649 11.5153 2.09574C11.6933 2.48499 11.7329 2.92345 11.6273 3.33825L10.95 6ZM5.25 7.941V14.25H13.62L15.75 9.078V7.5H10.95C10.7215 7.49997 10.4961 7.44776 10.2909 7.34735C10.0857 7.24694 9.90617 7.10098 9.76596 6.92062C9.62575 6.74026 9.52859 6.53025 9.48189 6.30662C9.43519 6.08299 9.44019 5.85166 9.4965 5.63025L10.1737 2.96925C10.1949 2.88625 10.1871 2.79849 10.1515 2.72058C10.1159 2.64266 10.0546 2.57929 9.978 2.541L9.48225 2.2935L5.94975 7.2975C5.76225 7.563 5.52225 7.7805 5.25 7.941ZM3.75 8.25H2.25V14.25H3.75V8.25Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_22">
                      <rect width={18} height={18} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="absolute left-[91px] top-[143px] text-sm font-medium text-left text-black">17</p>
              </div>
              <div className="w-8 h-[18px]">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[18px] absolute left-5 top-[143px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clip-path="url(#clip0_34_27)">
                    <path
                      d="M7.5 2.25H10.5C12.0913 2.25 13.6174 2.88214 14.7426 4.00736C15.8679 5.13258 16.5 6.6587 16.5 8.25C16.5 9.8413 15.8679 11.3674 14.7426 12.4926C13.6174 13.6179 12.0913 14.25 10.5 14.25V16.875C6.75 15.375 1.5 13.125 1.5 8.25C1.5 6.6587 2.13214 5.13258 3.25736 4.00736C4.38258 2.88214 5.9087 2.25 7.5 2.25ZM9 12.75H10.5C11.0909 12.75 11.6761 12.6336 12.2221 12.4075C12.768 12.1813 13.2641 11.8498 13.682 11.432C14.0998 11.0141 14.4313 10.518 14.6575 9.97208C14.8836 9.42611 15 8.84095 15 8.25C15 7.65905 14.8836 7.07389 14.6575 6.52792C14.4313 5.98196 14.0998 5.48588 13.682 5.06802C13.2641 4.65016 12.768 4.31869 12.2221 4.09254C11.6761 3.8664 11.0909 3.75 10.5 3.75H7.5C6.30653 3.75 5.16193 4.22411 4.31802 5.06802C3.47411 5.91193 3 7.05653 3 8.25C3 10.9575 4.8465 12.7245 9 14.61V12.75Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_27">
                      <rect width={18} height={18} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="absolute left-[42px] top-[143px] text-sm font-medium text-left text-black">3</p>
              </div>
              <div className="w-14 h-[30px]">
                <img
                  src="rectangle-11.png"
                  className="w-[30px] h-[30px] absolute left-[443px] top-[136px] rounded-[30px] object-cover border-2 border-white"
                />
                <img
                  src="rectangle-12.png"
                  className="w-[30px] h-[30px] absolute left-[469px] top-[136px] rounded-[30px] object-cover border-2 border-white"
                />
              </div>
              <div className="w-[41px] h-[18px]">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[18px] absolute left-[118px] top-[143px]"
                  preserveAspectRatio="none"
                >
                  <g clip-path="url(#clip0_34_35)">
                    <path
                      d="M3.75 1.5H14.25C14.4489 1.5 14.6397 1.57902 14.7803 1.71967C14.921 1.86032 15 2.05109 15 2.25V16.6073C15.0001 16.6743 14.9822 16.7402 14.9482 16.7979C14.9142 16.8557 14.8653 16.9033 14.8066 16.9358C14.7479 16.9683 14.6816 16.9844 14.6146 16.9826C14.5476 16.9807 14.4823 16.9609 14.4255 16.9252L9 13.5225L3.5745 16.9245C3.51778 16.9601 3.45254 16.9799 3.38558 16.9818C3.31861 16.9837 3.25236 16.9676 3.19372 16.9352C3.13508 16.9029 3.08618 16.8554 3.05211 16.7977C3.01804 16.74 3.00005 16.6742 3 16.6073V2.25C3 2.05109 3.07902 1.86032 3.21967 1.71967C3.36032 1.57902 3.55109 1.5 3.75 1.5ZM13.5 3H4.5V14.574L9 11.7533L13.5 14.574V3Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_35">
                      <rect width={18} height={18} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="absolute left-[140px] top-[143px] text-sm font-medium text-left text-black">48</p>
              </div>
            </div>
          </div>
          <div className="w-[520px] h-[187px] absolute left-[460px] top-[521px]">
            <div className="w-[520px] h-[187px] absolute left-[-1px] top-[-1px] rounded bg-white border border-[#e8edf3]" />
            <div className="w-[141px] h-[42px]">
              <div className="w-[97px] h-9">
                <p className="absolute left-16 top-5 text-sm font-semibold text-left text-black">janedoe</p>
                <p className="absolute left-16 top-[41px] text-xs text-left text-gray-500">3 minutes before</p>
                <svg
                  width={10}
                  height={10}
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-2.5 h-2.5 absolute left-[123px] top-[25px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clip-path="url(#clip0_34_86)">
                    <path
                      d="M4.99992 9.16666C2.69867 9.16666 0.833252 7.30125 0.833252 5C0.833252 2.69875 2.69867 0.833328 4.99992 0.833328C7.30117 0.833328 9.16659 2.69875 9.16659 5C9.16659 7.30125 7.30117 9.16666 4.99992 9.16666ZM4.5845 6.66666L7.53034 3.72041L6.94117 3.13124L4.5845 5.48833L3.40575 4.30958L2.81659 4.89875L4.5845 6.66666Z"
                      fill="#3466F6"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_86">
                      <rect width={10} height={10} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="w-9 h-[42px]">
                <img
                  src="avatar-2.png"
                  className="w-9 h-9 absolute left-[19.5px] top-[19.5px] rounded-[36px] object-cover"
                />
                <div className="w-7 h-3">
                  <div className="w-7 h-3 absolute left-[23.5px] top-[49.5px] rounded-sm bg-gray-500" />
                  <p className="absolute left-[31px] top-[52px] text-[7px] font-semibold text-left text-white">PRO</p>
                </div>
              </div>
            </div>
            <p className="w-[480px] absolute left-5 top-[74px] text-lg font-bold text-left text-black">hihi</p>
            <div className="w-[90px] h-[17px]">
              <p className="absolute left-[19px] top-[108px] text-sm text-left text-gray-500">#web3</p>
              <p className="absolute left-[78px] top-[108px] text-sm text-left text-gray-500">#eth</p>
            </div>
            <div className="w-[480px] h-[30px]">
              <div className="w-[37px] h-[18px]">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[18px] absolute left-[69px] top-[143px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clip-path="url(#clip0_34_100)">
                    <path
                      d="M10.95 5.99999H15.75C16.1478 5.99999 16.5294 6.15802 16.8107 6.43933C17.092 6.72063 17.25 7.10216 17.25 7.49999V9.07799C17.2502 9.27401 17.212 9.46817 17.1375 9.64949L14.8162 15.2857C14.7596 15.4232 14.6634 15.5406 14.5399 15.6233C14.4164 15.706 14.2711 15.7501 14.1225 15.75H1.5C1.30109 15.75 1.11032 15.671 0.96967 15.5303C0.829018 15.3897 0.75 15.1989 0.75 15V7.49999C0.75 7.30108 0.829018 7.11031 0.96967 6.96966C1.11032 6.82901 1.30109 6.74999 1.5 6.74999H4.1115C4.23157 6.75002 4.3499 6.72122 4.45653 6.66601C4.56315 6.61081 4.65497 6.53081 4.72425 6.43274L8.814 0.637489C8.8657 0.564223 8.94194 0.511909 9.0289 0.490032C9.11586 0.468154 9.20778 0.478161 9.288 0.518239L10.6485 1.19849C11.0314 1.38986 11.3372 1.70647 11.5153 2.09573C11.6933 2.48498 11.7329 2.92343 11.6273 3.33824L10.95 5.99999ZM5.25 7.94099V14.25H13.62L15.75 9.07799V7.49999H10.95C10.7215 7.49996 10.4961 7.44774 10.2909 7.34733C10.0857 7.24692 9.90617 7.10097 9.76596 6.9206C9.62575 6.74024 9.52859 6.53023 9.48189 6.30661C9.43519 6.08298 9.44019 5.85164 9.4965 5.63024L10.1737 2.96924C10.1949 2.88623 10.1871 2.79847 10.1515 2.72056C10.1159 2.64265 10.0546 2.57927 9.978 2.54099L9.48225 2.29349L5.94975 7.29749C5.76225 7.56299 5.52225 7.78049 5.25 7.94099ZM3.75 8.24999H2.25V14.25H3.75V8.24999Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_100">
                      <rect width={18} height={18} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="absolute left-[91px] top-[143px] text-sm font-medium text-left text-black">17</p>
              </div>
              <div className="w-8 h-[18px]">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[18px] absolute left-5 top-[143px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clip-path="url(#clip0_34_105)">
                    <path
                      d="M7.5 2.25H10.5C12.0913 2.25 13.6174 2.88214 14.7426 4.00736C15.8679 5.13258 16.5 6.6587 16.5 8.25C16.5 9.8413 15.8679 11.3674 14.7426 12.4926C13.6174 13.6179 12.0913 14.25 10.5 14.25V16.875C6.75 15.375 1.5 13.125 1.5 8.25C1.5 6.6587 2.13214 5.13258 3.25736 4.00736C4.38258 2.88214 5.9087 2.25 7.5 2.25ZM9 12.75H10.5C11.0909 12.75 11.6761 12.6336 12.2221 12.4075C12.768 12.1813 13.2641 11.8498 13.682 11.432C14.0998 11.0141 14.4313 10.518 14.6575 9.97208C14.8836 9.42611 15 8.84095 15 8.25C15 7.65905 14.8836 7.07389 14.6575 6.52792C14.4313 5.98196 14.0998 5.48588 13.682 5.06802C13.2641 4.65016 12.768 4.31869 12.2221 4.09254C11.6761 3.8664 11.0909 3.75 10.5 3.75H7.5C6.30653 3.75 5.16193 4.22411 4.31802 5.06802C3.47411 5.91193 3 7.05653 3 8.25C3 10.9575 4.8465 12.7245 9 14.61V12.75Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_105">
                      <rect width={18} height={18} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="absolute left-[42px] top-[143px] text-sm font-medium text-left text-black">3</p>
              </div>
              <div className="w-14 h-[30px]">
                <img
                  src="rectangle-11.png"
                  className="w-[30px] h-[30px] absolute left-[443px] top-[136px] rounded-[30px] object-cover border-2 border-white"
                />
                <img
                  src="rectangle-12.png"
                  className="w-[30px] h-[30px] absolute left-[469px] top-[136px] rounded-[30px] object-cover border-2 border-white"
                />
              </div>
              <div className="w-[41px] h-[18px]">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[18px] absolute left-[118px] top-[143px]"
                  preserveAspectRatio="none"
                >
                  <g clip-path="url(#clip0_34_113)">
                    <path
                      d="M3.75 1.5H14.25C14.4489 1.5 14.6397 1.57902 14.7803 1.71967C14.921 1.86032 15 2.05109 15 2.25V16.6073C15.0001 16.6743 14.9822 16.7402 14.9482 16.7979C14.9142 16.8557 14.8653 16.9033 14.8066 16.9358C14.7479 16.9683 14.6816 16.9844 14.6146 16.9826C14.5476 16.9807 14.4823 16.9609 14.4255 16.9252L9 13.5225L3.5745 16.9245C3.51778 16.9601 3.45254 16.9799 3.38558 16.9818C3.31861 16.9837 3.25236 16.9676 3.19372 16.9352C3.13508 16.9029 3.08618 16.8554 3.05211 16.7977C3.01804 16.74 3.00005 16.6742 3 16.6073V2.25C3 2.05109 3.07902 1.86032 3.21967 1.71967C3.36032 1.57902 3.55109 1.5 3.75 1.5ZM13.5 3H4.5V14.574L9 11.7533L13.5 14.574V3Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_113">
                      <rect width={18} height={18} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="absolute left-[140px] top-[143px] text-sm font-medium text-left text-black">48</p>
              </div>
            </div>
          </div>
          <div className="w-[520px] h-[187px] absolute left-[460px] top-[728px]">
            <div className="w-[520px] h-[187px] absolute left-[-1px] top-[-1px] rounded bg-white border border-[#e8edf3]" />
            <div className="w-[141px] h-[42px]">
              <div className="w-[97px] h-9">
                <p className="absolute left-16 top-5 text-sm font-semibold text-left text-black">janedoe</p>
                <p className="absolute left-16 top-[41px] text-xs text-left text-gray-500">3 minutes before</p>
                <svg
                  width={10}
                  height={10}
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-2.5 h-2.5 absolute left-[123px] top-[25px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clip-path="url(#clip0_34_48)">
                    <path
                      d="M4.99992 9.16668C2.69867 9.16668 0.833252 7.30126 0.833252 5.00001C0.833252 2.69876 2.69867 0.833344 4.99992 0.833344C7.30117 0.833344 9.16659 2.69876 9.16659 5.00001C9.16659 7.30126 7.30117 9.16668 4.99992 9.16668ZM4.5845 6.66668L7.53034 3.72043L6.94117 3.13126L4.5845 5.48834L3.40575 4.30959L2.81659 4.89876L4.5845 6.66668Z"
                      fill="#3466F6"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_48">
                      <rect width={10} height={10} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="w-9 h-[42px]">
                <img
                  src="avatar-2.png"
                  className="w-9 h-9 absolute left-[19.5px] top-[19.5px] rounded-[36px] object-cover"
                />
                <div className="w-7 h-3">
                  <div className="w-7 h-3 absolute left-[23.5px] top-[49.5px] rounded-sm bg-gray-500" />
                  <p className="absolute left-[31px] top-[52px] text-[7px] font-semibold text-left text-white">PRO</p>
                </div>
              </div>
            </div>
            <p className="w-[480px] absolute left-5 top-[74px] text-lg font-bold text-left text-black">hihi</p>
            <div className="w-[90px] h-[17px]">
              <p className="absolute left-[19px] top-[108px] text-sm text-left text-gray-500">#web3</p>
              <p className="absolute left-[78px] top-[108px] text-sm text-left text-gray-500">#eth</p>
            </div>
            <div className="w-[480px] h-[30px]">
              <div className="w-[37px] h-[18px]">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[18px] absolute left-[69px] top-[143px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clip-path="url(#clip0_34_62)">
                    <path
                      d="M10.95 5.99999H15.75C16.1478 5.99999 16.5294 6.15802 16.8107 6.43933C17.092 6.72063 17.25 7.10216 17.25 7.49999V9.07799C17.2502 9.27401 17.212 9.46817 17.1375 9.64949L14.8162 15.2857C14.7596 15.4232 14.6634 15.5406 14.5399 15.6233C14.4164 15.706 14.2711 15.7501 14.1225 15.75H1.5C1.30109 15.75 1.11032 15.671 0.96967 15.5303C0.829018 15.3897 0.75 15.1989 0.75 15V7.49999C0.75 7.30108 0.829018 7.11031 0.96967 6.96966C1.11032 6.82901 1.30109 6.74999 1.5 6.74999H4.1115C4.23157 6.75002 4.3499 6.72122 4.45653 6.66601C4.56315 6.61081 4.65497 6.53081 4.72425 6.43274L8.814 0.637489C8.8657 0.564223 8.94194 0.511909 9.0289 0.490032C9.11586 0.468154 9.20778 0.478161 9.288 0.518239L10.6485 1.19849C11.0314 1.38986 11.3372 1.70647 11.5153 2.09573C11.6933 2.48498 11.7329 2.92343 11.6273 3.33824L10.95 5.99999ZM5.25 7.94099V14.25H13.62L15.75 9.07799V7.49999H10.95C10.7215 7.49996 10.4961 7.44774 10.2909 7.34733C10.0857 7.24692 9.90617 7.10097 9.76596 6.9206C9.62575 6.74024 9.52859 6.53023 9.48189 6.30661C9.43519 6.08298 9.44019 5.85164 9.4965 5.63024L10.1737 2.96924C10.1949 2.88623 10.1871 2.79847 10.1515 2.72056C10.1159 2.64265 10.0546 2.57927 9.978 2.54099L9.48225 2.29349L5.94975 7.29749C5.76225 7.56299 5.52225 7.78049 5.25 7.94099ZM3.75 8.24999H2.25V14.25H3.75V8.24999Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_62">
                      <rect width={18} height={18} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="absolute left-[91px] top-[143px] text-sm font-medium text-left text-black">17</p>
              </div>
              <div className="w-8 h-[18px]">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[18px] absolute left-5 top-[143px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clip-path="url(#clip0_34_67)">
                    <path
                      d="M7.5 2.25H10.5C12.0913 2.25 13.6174 2.88214 14.7426 4.00736C15.8679 5.13258 16.5 6.6587 16.5 8.25C16.5 9.8413 15.8679 11.3674 14.7426 12.4926C13.6174 13.6179 12.0913 14.25 10.5 14.25V16.875C6.75 15.375 1.5 13.125 1.5 8.25C1.5 6.6587 2.13214 5.13258 3.25736 4.00736C4.38258 2.88214 5.9087 2.25 7.5 2.25ZM9 12.75H10.5C11.0909 12.75 11.6761 12.6336 12.2221 12.4075C12.768 12.1813 13.2641 11.8498 13.682 11.432C14.0998 11.0141 14.4313 10.518 14.6575 9.97208C14.8836 9.42611 15 8.84095 15 8.25C15 7.65905 14.8836 7.07389 14.6575 6.52792C14.4313 5.98196 14.0998 5.48588 13.682 5.06802C13.2641 4.65016 12.768 4.31869 12.2221 4.09254C11.6761 3.8664 11.0909 3.75 10.5 3.75H7.5C6.30653 3.75 5.16193 4.22411 4.31802 5.06802C3.47411 5.91193 3 7.05653 3 8.25C3 10.9575 4.8465 12.7245 9 14.61V12.75Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_67">
                      <rect width={18} height={18} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="absolute left-[42px] top-[143px] text-sm font-medium text-left text-black">3</p>
              </div>
              <div className="w-14 h-[30px]">
                <img
                  src="rectangle-11.png"
                  className="w-[30px] h-[30px] absolute left-[443px] top-[136px] rounded-[30px] object-cover border-2 border-white"
                />
                <img
                  src="rectangle-12.png"
                  className="w-[30px] h-[30px] absolute left-[469px] top-[136px] rounded-[30px] object-cover border-2 border-white"
                />
              </div>
              <div className="w-[41px] h-[18px]">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[18px] absolute left-[118px] top-[143px]"
                  preserveAspectRatio="none"
                >
                  <g clip-path="url(#clip0_34_75)">
                    <path
                      d="M3.75 1.5H14.25C14.4489 1.5 14.6397 1.57902 14.7803 1.71967C14.921 1.86032 15 2.05109 15 2.25V16.6073C15.0001 16.6743 14.9822 16.7402 14.9482 16.7979C14.9142 16.8557 14.8653 16.9033 14.8066 16.9358C14.7479 16.9683 14.6816 16.9844 14.6146 16.9826C14.5476 16.9807 14.4823 16.9609 14.4255 16.9252L9 13.5225L3.5745 16.9245C3.51778 16.9601 3.45254 16.9799 3.38558 16.9818C3.31861 16.9837 3.25236 16.9676 3.19372 16.9352C3.13508 16.9029 3.08618 16.8554 3.05211 16.7977C3.01804 16.74 3.00005 16.6742 3 16.6073V2.25C3 2.05109 3.07902 1.86032 3.21967 1.71967C3.36032 1.57902 3.55109 1.5 3.75 1.5ZM13.5 3H4.5V14.574L9 11.7533L13.5 14.574V3Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_75">
                      <rect width={18} height={18} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="absolute left-[140px] top-[143px] text-sm font-medium text-left text-black">48</p>
              </div>
            </div>
          </div>
          <div className="w-[520px] h-[187px] absolute left-[460px] top-[935px]">
            <div className="w-[520px] h-[187px] absolute left-[-1px] top-[-1px] rounded bg-white border border-[#e8edf3]" />
            <div className="w-[141px] h-[42px]">
              <div className="w-[97px] h-9">
                <p className="absolute left-16 top-5 text-sm font-semibold text-left text-black">janedoe</p>
                <p className="absolute left-16 top-[41px] text-xs text-left text-gray-500">3 minutes before</p>
                <svg
                  width={10}
                  height={10}
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-2.5 h-2.5 absolute left-[123px] top-[25px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clip-path="url(#clip0_34_123)">
                    <path
                      d="M4.99992 9.16665C2.69867 9.16665 0.833252 7.30123 0.833252 4.99998C0.833252 2.69873 2.69867 0.833313 4.99992 0.833313C7.30117 0.833313 9.16659 2.69873 9.16659 4.99998C9.16659 7.30123 7.30117 9.16665 4.99992 9.16665ZM4.5845 6.66665L7.53034 3.7204L6.94117 3.13123L4.5845 5.48831L3.40575 4.30956L2.81659 4.89873L4.5845 6.66665Z"
                      fill="#3466F6"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_123">
                      <rect width={10} height={10} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="w-9 h-[42px]">
                <img
                  src="avatar-2.png"
                  className="w-9 h-9 absolute left-[19.5px] top-[19.5px] rounded-[36px] object-cover"
                />
                <div className="w-7 h-3">
                  <div className="w-7 h-3 absolute left-[23.5px] top-[49.5px] rounded-sm bg-gray-500" />
                  <p className="absolute left-[31px] top-[52px] text-[7px] font-semibold text-left text-white">PRO</p>
                </div>
              </div>
            </div>
            <p className="w-[480px] absolute left-5 top-[74px] text-lg font-bold text-left text-black">hihi</p>
            <div className="w-[90px] h-[17px]">
              <p className="absolute left-[19px] top-[108px] text-sm text-left text-gray-500">#web3</p>
              <p className="absolute left-[78px] top-[108px] text-sm text-left text-gray-500">#eth</p>
            </div>
            <div className="w-[480px] h-[30px]">
              <div className="w-[37px] h-[18px]">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[18px] absolute left-[69px] top-[143px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clip-path="url(#clip0_34_137)">
                    <path
                      d="M10.95 5.99999H15.75C16.1478 5.99999 16.5294 6.15802 16.8107 6.43933C17.092 6.72063 17.25 7.10216 17.25 7.49999V9.07799C17.2502 9.27401 17.212 9.46817 17.1375 9.64949L14.8162 15.2857C14.7596 15.4232 14.6634 15.5406 14.5399 15.6233C14.4164 15.706 14.2711 15.7501 14.1225 15.75H1.5C1.30109 15.75 1.11032 15.671 0.96967 15.5303C0.829018 15.3897 0.75 15.1989 0.75 15V7.49999C0.75 7.30108 0.829018 7.11031 0.96967 6.96966C1.11032 6.82901 1.30109 6.74999 1.5 6.74999H4.1115C4.23157 6.75002 4.3499 6.72122 4.45653 6.66601C4.56315 6.61081 4.65497 6.53081 4.72425 6.43274L8.814 0.637489C8.8657 0.564223 8.94194 0.511909 9.0289 0.490032C9.11586 0.468154 9.20778 0.478161 9.288 0.518239L10.6485 1.19849C11.0314 1.38986 11.3372 1.70647 11.5153 2.09573C11.6933 2.48498 11.7329 2.92343 11.6273 3.33824L10.95 5.99999ZM5.25 7.94099V14.25H13.62L15.75 9.07799V7.49999H10.95C10.7215 7.49996 10.4961 7.44774 10.2909 7.34733C10.0857 7.24692 9.90617 7.10097 9.76596 6.9206C9.62575 6.74024 9.52859 6.53023 9.48189 6.30661C9.43519 6.08298 9.44019 5.85164 9.4965 5.63024L10.1737 2.96924C10.1949 2.88623 10.1871 2.79847 10.1515 2.72056C10.1159 2.64265 10.0546 2.57927 9.978 2.54099L9.48225 2.29349L5.94975 7.29749C5.76225 7.56299 5.52225 7.78049 5.25 7.94099ZM3.75 8.24999H2.25V14.25H3.75V8.24999Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_137">
                      <rect width={18} height={18} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="absolute left-[91px] top-[143px] text-sm font-medium text-left text-black">17</p>
              </div>
              <div className="w-8 h-[18px]">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[18px] absolute left-5 top-[143px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g clip-path="url(#clip0_34_142)">
                    <path
                      d="M7.5 2.25H10.5C12.0913 2.25 13.6174 2.88214 14.7426 4.00736C15.8679 5.13258 16.5 6.6587 16.5 8.25C16.5 9.8413 15.8679 11.3674 14.7426 12.4926C13.6174 13.6179 12.0913 14.25 10.5 14.25V16.875C6.75 15.375 1.5 13.125 1.5 8.25C1.5 6.6587 2.13214 5.13258 3.25736 4.00736C4.38258 2.88214 5.9087 2.25 7.5 2.25ZM9 12.75H10.5C11.0909 12.75 11.6761 12.6336 12.2221 12.4075C12.768 12.1813 13.2641 11.8498 13.682 11.432C14.0998 11.0141 14.4313 10.518 14.6575 9.97208C14.8836 9.42611 15 8.84095 15 8.25C15 7.65905 14.8836 7.07389 14.6575 6.52792C14.4313 5.98196 14.0998 5.48588 13.682 5.06802C13.2641 4.65016 12.768 4.31869 12.2221 4.09254C11.6761 3.8664 11.0909 3.75 10.5 3.75H7.5C6.30653 3.75 5.16193 4.22411 4.31802 5.06802C3.47411 5.91193 3 7.05653 3 8.25C3 10.9575 4.8465 12.7245 9 14.61V12.75Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_142">
                      <rect width={18} height={18} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="absolute left-[42px] top-[143px] text-sm font-medium text-left text-black">3</p>
              </div>
              <div className="w-14 h-[30px]">
                <img
                  src="rectangle-11.png"
                  className="w-[30px] h-[30px] absolute left-[443px] top-[136px] rounded-[30px] object-cover border-2 border-white"
                />
                <img
                  src="rectangle-12.png"
                  className="w-[30px] h-[30px] absolute left-[469px] top-[136px] rounded-[30px] object-cover border-2 border-white"
                />
              </div>
              <div className="w-[41px] h-[18px]">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[18px] h-[18px] absolute left-[118px] top-[143px]"
                  preserveAspectRatio="none"
                >
                  <g clip-path="url(#clip0_34_150)">
                    <path
                      d="M3.75 1.5H14.25C14.4489 1.5 14.6397 1.57902 14.7803 1.71967C14.921 1.86032 15 2.05109 15 2.25V16.6073C15.0001 16.6743 14.9822 16.7402 14.9482 16.7979C14.9142 16.8557 14.8653 16.9033 14.8066 16.9358C14.7479 16.9683 14.6816 16.9844 14.6146 16.9826C14.5476 16.9807 14.4823 16.9609 14.4255 16.9252L9 13.5225L3.5745 16.9245C3.51778 16.9601 3.45254 16.9799 3.38558 16.9818C3.31861 16.9837 3.25236 16.9676 3.19372 16.9352C3.13508 16.9029 3.08618 16.8554 3.05211 16.7977C3.01804 16.74 3.00005 16.6742 3 16.6073V2.25C3 2.05109 3.07902 1.86032 3.21967 1.71967C3.36032 1.57902 3.55109 1.5 3.75 1.5ZM13.5 3H4.5V14.574L9 11.7533L13.5 14.574V3Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_150">
                      <rect width={18} height={18} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="absolute left-[140px] top-[143px] text-sm font-medium text-left text-black">48</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[250px] h-[372px]">
          <div className="w-[250px] h-[372px]">
            <div className="w-[250px] h-[372px] absolute left-[999.5px] top-[106.5px] rounded bg-white border border-[#e8edf3]" />
            <div className="w-[70px] h-[17px]">
              <p className="absolute left-[1020px] top-[127px] text-sm font-bold text-left text-black">Hot Today</p>
            </div>
            <div className="flex flex-col justify-start items-start absolute left-[1020px] top-[164px] gap-[11px]">
              <p className="flex-grow-0 flex-shrink-0 w-[210px] text-sm font-medium text-left text-black">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
              </p>
              <svg
                width={210}
                height={1}
                viewBox="0 0 210 1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-grow-0 flex-shrink-0"
                preserveAspectRatio="none"
              >
                <line x1="-0.0012207" y1="0.5" x2="209.999" y2="0.5" stroke="black" stroke-opacity="0.1" />
              </svg>
            </div>
            <div className="flex flex-col justify-start items-start absolute left-[1020px] top-[245px] gap-[11px]">
              <p className="flex-grow-0 flex-shrink-0 w-[210px] text-sm font-medium text-left text-black">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <svg
                width={210}
                height={1}
                viewBox="0 0 210 1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-grow-0 flex-shrink-0"
                preserveAspectRatio="none"
              >
                <line x1="-0.0012207" y1="0.5" x2="209.999" y2="0.5" stroke="black" stroke-opacity="0.1" />
              </svg>
            </div>
            <div className="flex flex-col justify-start items-start absolute left-[1020px] top-[306px] gap-[11px]">
              <p className="flex-grow-0 flex-shrink-0 w-[210px] text-sm font-medium text-left text-black">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <svg
                width={210}
                height={1}
                viewBox="0 0 210 1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-grow-0 flex-shrink-0"
                preserveAspectRatio="none"
              >
                <line x1="-0.0012207" y1="0.5" x2="209.999" y2="0.5" stroke="black" stroke-opacity="0.1" />
              </svg>
            </div>
            <div className="flex flex-col justify-start items-start absolute left-[1020px] top-[367px] gap-[11px]">
              <p className="flex-grow-0 flex-shrink-0 w-[210px] text-sm font-medium text-left text-black">
                Lorem ipsum dolor sit amet.
              </p>
              <svg
                width={210}
                height={1}
                viewBox="0 0 210 1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-grow-0 flex-shrink-0"
                preserveAspectRatio="none"
              >
                <line x1="-0.0012207" y1="0.5" x2="209.999" y2="0.5" stroke="black" stroke-opacity="0.1" />
              </svg>
            </div>
            <div className="flex flex-col justify-start items-start absolute left-[1020px] top-[408px] gap-[11px]">
              <p className="flex-grow-0 flex-shrink-0 w-[210px] text-sm font-medium text-left text-black">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. consectetur adipiscing elit.
              </p>
              <div className="flex-grow-0 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedPage;
