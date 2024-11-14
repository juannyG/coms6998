import { createContext } from "react";

type EditPostEditorContextType = {
  setContent: (content: string) => void;
  cancel: () => void;
  confirmPost: () => void;
};
const EditPostEditorContext = createContext<EditPostEditorContextType | undefined>(undefined);

export { EditPostEditorContext };
