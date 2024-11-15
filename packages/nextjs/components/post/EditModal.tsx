import { useContext, useEffect, useState } from "react";
import { Client } from "@web3-storage/w3up-client";
import { toHex } from "viem";
import { useAccount } from "wagmi";
import Editor from "~~/app/feed/richTextEditor/EditPostEditor";
import { EditPostEditorContext } from "~~/app/feed/viewPost/editPostContext";
import { PostEditContext } from "~~/contexts/Post";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { TPost, TW3Post } from "~~/types/spotlight";
import { bigintSerializer, getW3StorageClient } from "~~/utils/spotlight";

const PostEditModal = ({ post, contractPost }: { post: TW3Post; contractPost: TPost }) => {
  const [w3client, setW3Client] = useState<Client>();
  const { setEditing, setShowEditModal, showEditModal } = useContext(PostEditContext);
  const [content, setContent] = useState(post.content);
  const { address } = useAccount();
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");
  const { refetch: refetchPost } = useScaffoldReadContract({
    account: address,
    contractName: "Spotlight",
    functionName: "getPost",
    args: [contractPost.id],
    watch: true,
  });

  useEffect(() => {
    const getClient = async () => {
      const c = await getW3StorageClient();
      setW3Client(c);
    };

    getClient().catch(e => {
      console.error(e);
    });
  }, [setW3Client]);

  const value = {
    setContent,
    cancel: () => {
      setShowEditModal(false);
    },
    confirmPost: async () => {
      if (!address) {
        return;
      }
      if (w3client === undefined) {
        console.log("No web3.storage client available"); // TODO - better error handling
        return;
      }
      setEditing(true);
      try {
        // TODO: Delete web3.storage reference of contractPost.w3cid
        // TODO: Create new signature for updated title/content with a fresh nonce
        const postId = post.signature; // use old signature as post id
        console.log("Edited Post Id", postId);
        const postStruct = {
          title: post.title,
          content,
          nonce: post.nonce,
          signature: post.signature,
        } as TW3Post;
        const json = JSON.stringify(postStruct, bigintSerializer);
        const blob = new Blob([json], { type: "application/json" });

        // TODO: Need an overlay - this is slow...
        const res = await w3client.uploadFile(new File([blob], `${postId}.json`));
        const cid = res.toString();
        console.log("Post w3 CID:", toHex(cid));
        await writeSpotlightContractAsync({ functionName: "editPost", args: [postId, content, toHex(cid)] });
        refetchPost();
      } catch (e: any) {
        console.log(e);
      } finally {
        setShowEditModal(false);
        setEditing(false);
      }
    },
  };

  return (
    <>
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full mt-4 sm:mt-0 sm:w-[50%] bg-white p-6 rounded shadow-lg text-center">
            <div className="w-full mt-4 flex justify-center gap-4">
              <EditPostEditorContext.Provider value={value}>
                <div className="w-full h-[30%] flex flex-col justify-between px-4 border border-[#e6ebf1]">
                  <div className="w-full flex flex-row items-center justify-start gap-4 pt-2">
                    <p className="text-lg font-semibold text-left text-black">Title</p>
                    {/* TODO: Should this be an input if it's readonly? */}
                    <input
                      type="text"
                      className="input input-bordered rounded-lg w-full max-w-xs"
                      value={post.title}
                      readOnly
                    />
                  </div>
                  <div className="divider"></div>
                  <div className="w-full flex flex-col">
                    <p className="text-lg font-semibold text-left text-black ">Description</p>
                    <Editor data={post.content} />
                  </div>
                </div>
              </EditPostEditorContext.Provider>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostEditModal;
