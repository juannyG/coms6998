import type { NextPage } from "next";
import RegistrationForm from "~~/components/registration/RegistrationForm";
import RegistrationHeader from "~~/components/registration/RegistrationHeader";

const Home: NextPage = () => {
  return (
    <>
      <div className="w-full h-[842px] relative overflow-hidden">
        <div className="flex flex-col justify-start items-center w-full h-dvh absolute left-0 top-0 gap-8 px-8 py-12 bg-gray-50">
          <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0">
            <RegistrationHeader />
            <RegistrationForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
