import { useVerifyMessage } from "wagmi";
import { TPost, TW3Post } from "~~/types/spotlight";
import { encodePostDataForSignature } from "~~/utils/spotlight";

const VerificationBadge = ({ post, contractPost }: { post: TW3Post; contractPost: TPost }) => {
  const { data: isValid } = useVerifyMessage({
    address: contractPost.creator,
    signature: contractPost.signature,
    message: { raw: encodePostDataForSignature(post.title, post.content, post.nonce) },
  });

  if (isValid === undefined) {
    return;
  }

  // TODO: Triple check post.signature === contractPost.signature

  return (
    <>
      {isValid ? (
        <div className="tooltip tooltip-success cursor-pointer" data-tip="This post has been verified.">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5 fill-green-700">
            <path
              fillRule="evenodd"
              d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ) : (
        <div
          className="tooltip tooltip-error cursor-pointer"
          data-tip="Warning! The signature of this content is invalid!"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5 fill-red-600"
          >
            <path
              fillRule="evenodd"
              d="M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.515 12.74 12.74 0 0 1 .635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 0 1-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 0 1 .722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75ZM12 15a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75H12Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </>
  );
};

export default VerificationBadge;
