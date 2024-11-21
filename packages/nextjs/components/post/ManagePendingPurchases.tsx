import { useEffect, useState } from "react";
import PendingPurchase from "./PendingPurchase";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { TPendingPurchase, TPost } from "~~/types/spotlight";

const ManagePendingPurchases = ({ post }: { post: TPost }) => {
  const { address } = useAccount();
  const [pendingPurchases, setPendingPurchases] = useState<TPendingPurchase[]>([]);

  const { data } = useScaffoldReadContract({
    account: address,
    contractName: "Spotlight",
    functionName: "getPendingPurchases",
    watch: true,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    console.log("setting pending purchases");
    setPendingPurchases(data as TPendingPurchase[]);
  }, [data]);

  return (
    <>
      <div className="pt-5">
        <div className="collapse collapse-arrow bg-base-200">
          <input type="checkbox" name="my-accordion-2" />
          <div className="collapse-title text-l font-medium">Manage pending purchases</div>
          <div className="collapse-content">
            {pendingPurchases && pendingPurchases.length > 0 && (
              <>
                {pendingPurchases.map(pendingPurchase => {
                  if (post.id !== pendingPurchase.postId) {
                    console.log("post.id != pendingPurchase.postId");
                    return;
                  }
                  return <PendingPurchase post={post} pendingPurchase={pendingPurchase} key={post.id} />;
                })}
              </>
            )}
            {pendingPurchases && pendingPurchases.length == 0 && <>No purchases to review yet</>}
            {!pendingPurchases && <div className="loading"></div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagePendingPurchases;
