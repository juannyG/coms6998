import { useEffect} from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

export default function RestoreContentFromData({ data }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (data && editor && editor.parseEditorState) {
      const initialEditorState = editor.parseEditorState(data);
      editor.setEditorState(initialEditorState);
    }
  }, [data, editor]);

  return <OnChangePlugin />;
}
