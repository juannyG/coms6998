import { createContext } from "react";

interface IPostDeleteContext {
  deleting: boolean;
  showDeleteConfirmation: boolean;
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDeleteConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PostDeleteContext = createContext<IPostDeleteContext>({
  deleting: false,
  showDeleteConfirmation: false,
  setDeleting: () => {
    return false;
  },
  setShowDeleteConfirmation: () => {
    return false;
  },
});

interface IPostEditContext {
  editing: boolean;
  showEditModal: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PostEditContext = createContext<IPostEditContext>({
  editing: false,
  showEditModal: false,
  setEditing: () => {
    return false;
  },
  setShowEditModal: () => {
    return false;
  },
});

interface IPostDisplayContext {
  showPostMgmt: boolean;
  compactDisplay: boolean;
  showHeader: boolean;
}

export const PostDisplayContext = createContext<IPostDisplayContext>({
  showPostMgmt: false,
  compactDisplay: false,
  showHeader: true,
});
