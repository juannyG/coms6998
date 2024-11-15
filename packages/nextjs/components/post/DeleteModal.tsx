import { useContext } from "react";
import { useRouter } from "next/navigation";
import { PostDeleteContext } from "~~/contexts/Post";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { TPost, TW3Post } from "~~/types/spotlight";

const PostDeleteModal = ({ post, contractPost }: { post: TW3Post; contractPost: TPost }) => {
  const router = useRouter();
  const { writeContractAsync: writeSpotlightContractAsync } = useScaffoldWriteContract("Spotlight");
  const { showDeleteConfirmation, setShowDeleteConfirmation, deleting, setDeleting } = useContext(PostDeleteContext);

  const handleDelete = async () => {
    try {
      setDeleting(true);

      // TODO: Delete from web3.storage
      console.log("TODO: delete from web3.storage", post.signature);

      await writeSpotlightContractAsync({
        functionName: "deletePost",
        args: [contractPost.id],
      });
      console.log(`Deleted post with ID: ${contractPost.id}`);
      router.push("/feed");
    } catch (error) {
      console.error("Error showDeleteConfirmation post:", error);
    } finally {
      setShowDeleteConfirmation(false);
      setDeleting(false);
    }
  };
  return (
    showDeleteConfirmation && (
      <>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p>Are you sure you want to delete this post?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button className="btn btn-danger" onClick={() => handleDelete()} disabled={deleting}>
                Confirm
              </button>
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirmation(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default PostDeleteModal;
