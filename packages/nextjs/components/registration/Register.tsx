"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { notification } from "~~/utils/scaffold-eth";

const Register = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");

  const handleSubmit = async () => {
    if (username === undefined || username === null) {
      notification.error("Please populate the username field");
      return;
    }

    try {
      await writeSpotlightContractAsync({
        functionName: "registerProfile",
        args: [username],
      });
      router.push("/home");
    } catch (e: any) {
      console.error(e);
      if (e.message.includes("Username is already taken")) {
        notification.error("Username is already taken. Please choose a different username.");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
        <label className="form-control flex self-stretch">
          <div className="label">
            <span className="label-text text-sm font-medium text-left text-gray-700">Username</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered min-h-11 h-11 rounded-md w-full self-stretch"
            onChange={e => setUsername(e.target.value)}
          />
        </label>
      </div>
      <button
        className="btn rounded-md bg-indigo-600 hover:bg-indigo-400 flex self-stretch text-white font-normal min-h-10 h-10"
        onClick={handleSubmit}
      >
        Enter Spotlight
      </button>
    </>
  );
};

export default Register;
