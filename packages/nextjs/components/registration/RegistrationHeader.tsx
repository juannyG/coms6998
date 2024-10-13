import Image from "next/image";

const RegistrationHeader = () => {
  return (
    <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
      <Image height={48} width={54} alt="Spotlight logo" className="cursor-pointer" src="/spotlight-logo.svg" />
      <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
        <p className="flex-grow-0 flex-shrink-0 text-3xl font-bold text-center text-gray-900">Register</p>
        <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-1">
          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative">
            <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-indigo-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationHeader;
