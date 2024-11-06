import { useContext } from "react";
import { Address } from "viem";
import { PostDisplayContext } from "~~/contexts/Post";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { TPost, TUserProfile } from "~~/types/spotlight";

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
  return (
    <>
      <div className="grid-col-1">
        <div>
          <p className="text-lg text-left text-black">{username}</p>
        </div>
        <div>
          <p className="text-sm text-left text-black">{address}</p>
        </div>
      </div>
    </>
  );
};

const CreatorDisplay = ({ post }: { post: TPost }) => {
  const { compactDisplay } = useContext(PostDisplayContext);
  const { data: creatorProfile } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "getProfile",
    args: [post.creator],
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
              <img alt="" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          {compactDisplay ? (
            <SmallCreatorDisplay username={creatorProfile.username} address={post.creator} />
          ) : (
            <FullCreatorDisplay username={creatorProfile.username} address={post.creator} />
          )}
        </div>
      </div>
    </>
  );
};

export default CreatorDisplay;