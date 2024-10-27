import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

export default function RestoreFromLocalStoragePlugin({ data }) {
  const [editor] = useLexicalComposerContext();
  // const [serializedEditorState, setSerializedEditorState] = useSessionStorage('postContent', null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      if (data && editor && editor.parseEditorState) {
        const initialEditorState = editor.parseEditorState(data);
        editor.setEditorState(initialEditorState);
        isFirstRender.current = false;
      }
    }
  }, [data, editor]);

  return <OnChangePlugin />;
}
