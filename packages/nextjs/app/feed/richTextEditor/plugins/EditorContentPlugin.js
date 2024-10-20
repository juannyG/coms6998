import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useContext } from "react";
import { EditorContext } from "../../context";

export default function EditorContentPlugin() {
    const [editor] = useLexicalComposerContext();
    const {setContent} = useContext(EditorContext);
    
    useEffect(() => {
      return editor.registerUpdateListener(({ editorState }) => {
        const json = JSON.stringify(editorState.toJSON());
        if(setContent){
            setContent(json);
        }
      });
    }, [editor]);
    
    return null;
  }