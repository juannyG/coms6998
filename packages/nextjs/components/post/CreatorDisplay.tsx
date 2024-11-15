import { useContext } from "react";
import { Address } from "viem";
import { PostDisplayContext } from "~~/contexts/Post";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { TIPFSPost, TPost, TUserProfile } from "~~/types/spotlight";
import { getAvatarURL } from "~~/utils/spotlight";

const SmallCreatorDisplay = ({ username, address }: { username: string; address: Address }) => {
  const shortenedCreatorAddr = address.substring(0, 6) + "..." + address.substring(address.length - 4);
  return (
    <>
      <p className="text-sm font-semibold text-left text-black">
        <a>
          {username} @ {shortenedCreatorAddr}
        </a>
      </p>
    </>
  );
};

const FullCreatorDisplay = ({ username, address }: { username: string; address: Address }) => {
  const shortenedCreatorAddr = address.substring(0, 6) + "..." + address.substring(address.length - 4);
  return (
    <>
      <div className="grid-col-1">
        <div>
          <p className="text-lg text-left text-black">{username}</p>
        </div>
        <div>
          <p className="hidden sm:block text-sm text-left text-black">{address}</p>
          <p className="sm:hidden text-sm text-left text-black">{shortenedCreatorAddr}</p>
        </div>
      </div>
    </>
  );
};

const CreatorDisplay = ({ post, contractPost }: { post: TIPFSPost; contractPost: TPost }) => {
  console.log("do we still need this:", post);
  const { compactDisplay } = useContext(PostDisplayContext);
  const { data: creatorProfile } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "getProfile",
    args: [contractPost.creator],
  }) as { data: TUserProfile };

  if (creatorProfile === undefined) {
    return null; // Cannot render until we have their profile
  }

  const creatorRep = Number(creatorProfile.reputation) / 10 ** 18;

  return (
    <>
      <div className="tooltip tooltip-neutral cursor-pointer" data-tip={`${creatorRep.toFixed(4)} RPT`}>
        <div className="flex items-center justify-between gap-4">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img alt="" src={getAvatarURL(creatorProfile?.avatarCID)} />
            </div>
          </div>
          {compactDisplay ? (
            <SmallCreatorDisplay username={creatorProfile.username} address={contractPost.creator} />
          ) : (
            <FullCreatorDisplay username={creatorProfile.username} address={contractPost.creator} />
          )}
        </div>
      </div>
    </>
  );
};

export default CreatorDisplay;
