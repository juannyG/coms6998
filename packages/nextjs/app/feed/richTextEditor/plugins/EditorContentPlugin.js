import { useContext, useEffect } from "react";
import { EditorContext } from "../../context";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function EditorContentPlugin() {
  const [editor] = useLexicalComposerContext();
  const { setContent: updateContent } = useContext(EditorContext);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editor.update(() => {
        if (updateContent) {
          // TODO: Empty posts still have a parent node - can this be detected and avoided?
          updateContent($generateHtmlFromNodes(editor, null));
        }
      });
    });
  }, [editor, updateContent]);

  return null;
}
