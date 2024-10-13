"use client";

import Loading from "./Loading";
import Register from "./Register";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";

const RegistrationForm = () => {
  const { address: connectedAddress } = useAccount();
  //const { data: isRegistered, refetch } = useScaffoldReadContract({
  const { data: isRegistered } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "isRegistered",
    args: [connectedAddress],
  });

  /**
     if (connectedAddress === undefined) {
     return <>Awaiting wallet connection...</>;
     }
     if (isRegistered === false) {
     return <Registration connectedAddress={connectedAddress} actionType="register" />;
     }
     if (isRegistered === true) {
     return <Welcome connectedAddress={connectedAddress} refetchIsRegistered={refetch} />;
     }
     return <>Checking registration status...</>;
  */
  return (
    <div
      className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-6 px-10 py-8 rounded-lg bg-white"
      style={{ boxShadow: "0px 1px 3px 0 rgba(0,0,0,0.1), 0px 1px 2px 0 rgba(0,0,0,0.06)" }}
    >
      {!connectedAddress && <Loading />}
      {connectedAddress && !isRegistered && <Register />}
      <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 w-[368px] h-5 gap-2" />
    </div>
  );
};

export default RegistrationForm;
