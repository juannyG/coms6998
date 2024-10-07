import { useState } from "react";
import { Profile } from "../definition";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { NextPage } from "next";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";

const SendTransaction: NextPage<{ address: string; profile: Profile }> = ({ address: connectedAddress, profile }) => {
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");
  const [authorizeResult, setAuthorizeResult] = useState<boolean>(false);
  const [targetAddress, setTargetAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const { data: isAuthorized } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "isAuthorized",
    args: [connectedAddress],
  });

  return (
    <div className="flex flex-col">
      <div>
        Welcome
        <span style={{ color: "green" }} className="text-3xl">
          {" "}
          {profile.username}{" "}
        </span>
        at
        <span style={{ color: "green" }}>
          {" " + connectedAddress.slice(0, 6) + "..." + connectedAddress.slice(-4)}
        </span>
      </div>
      <div>
        <div className="m-4" style={{ display: authorizeResult || isAuthorized ? "none" : "block" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              if (!isAuthorized) {
                await writeSpotlightContractAsync({
                  functionName: "authorizeUser",
                  args: [connectedAddress],
                });
              }
              setAuthorizeResult(true);
            }}
          >
            Authorize
          </Button>
        </div>
        <div
          className="flex flex-col space-y-4 mt-4"
          style={{ display: authorizeResult || isAuthorized ? "block" : "none" }}
        >
          <div className="space-x-4">
            <span>Address</span>
            <TextField
              id="outlined-address"
              label=""
              variant="outlined"
              onChange={e => {
                setTargetAddress(e.target.value);
              }}
            />
          </div>
          <div className="space-x-4">
            <span>Amount</span>
            <TextField
              id="outlined-amount"
              label="Wei"
              variant="outlined"
              onChange={e => {
                setAmount(e.target.value);
              }}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              await writeSpotlightContractAsync({
                functionName: "sendTransaction",
                args: [targetAddress],
                value: BigInt(amount),
              });
              setTargetAddress("");
              setAmount("");
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendTransaction;
