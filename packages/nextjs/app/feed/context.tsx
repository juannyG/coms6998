import { createContext } from "react";

type EditorContextType = {
  setContent: (content: string) => void;
  confirmPost: (evt: React.MouseEventHandler<HTMLButtonElement>, paywalled: boolean) => void;
};
const EditorContext = createContext<EditorContextType | undefined>(undefined);

export { EditorContext };
