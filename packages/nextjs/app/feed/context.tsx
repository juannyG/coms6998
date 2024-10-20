import { createContext } from "react";

type EditorContextType = {
  setContent: (content: string) => void;
  confirmPost: () => void;
};
const EditorContext = createContext<EditorContextType | undefined>(undefined);

export { EditorContext };
