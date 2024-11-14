"use client";

import { useContext, useState } from "react";
import { UserProfileContext } from "~~/contexts/UserProfile";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { notification } from "~~/utils/scaffold-eth";

const Register = () => {
  const { refetchProfile } = useContext(UserProfileContext);
  const [username, setUsername] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
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
      setCompleted(true);
      refetchProfile();
    } catch (e: any) {
      console.error(e);
      if (e.message.includes("Username is already taken")) {
        notification.error("Username is already taken. Please choose a different username.");
      }
    }
  };

  if (completed) {
    return <>Completing registration...</>;
  }

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
