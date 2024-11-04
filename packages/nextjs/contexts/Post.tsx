import { createContext } from "react";
import { Hex } from "viem";

interface IPostContext {
  deleting: boolean;
  editing: boolean;
  setShowDeleteConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditPage: React.Dispatch<React.SetStateAction<boolean>>;
  setPostId: React.Dispatch<React.SetStateAction<Hex | null>>;
}

export const PostContext = createContext<IPostContext>({
  deleting: false,
  editing: false,
  setShowDeleteConfirmation: () => {
    return false;
  },
  setShowEditPage: () => {
    return false;
  },
  setPostId: () => {
    return null;
  },
});
