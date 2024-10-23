import { useContext, useEffect } from "react";
import { EditorContext } from "../../context";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function EditorContentPlugin() {
  const [editor] = useLexicalComposerContext();
  const { setContent: updateContent } = useContext(EditorContext);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      const json = JSON.stringify(editorState.toJSON());
      if (updateContent) {
        updateContent(json);
      }
    });
  }, [editor, updateContent]);

  return null;
}
