import { useContext, useState } from "react";
import { useAccount } from "wagmi";
import Editor from "~~/app/feed/richTextEditor/EditPostEditor";
import { EditPostEditorContext } from "~~/app/feed/viewPost/editPostContext";
import { PostEditContext } from "~~/contexts/Post";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { TPost } from "~~/types/spotlight";

const PostEditModal = ({ post }: { post: TPost }) => {
  const { setEditing, setShowEditModal, showEditModal } = useContext(PostEditContext);
  const [content, setContent] = useState(post.content);
  const { address } = useAccount();
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");
  const { refetch: refetchPost } = useScaffoldReadContract({
    account: address,
    contractName: "Spotlight",
    functionName: "getPost",
    args: [post.id],
    watch: true,
  });

  const value = {
    setContent,
    cancel: () => {
      setShowEditModal(false);
    },
    confirmPost: async () => {
      if (!address) {
        return;
      }
      setEditing(true);
      try {
        const postId = post.signature; // use old signature as post id
        console.log("Edited Post Id", postId);
        await writeSpotlightContractAsync({ functionName: "editPost", args: [postId, content] });
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
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <div className="mt-4 flex justify-center gap-4">
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
