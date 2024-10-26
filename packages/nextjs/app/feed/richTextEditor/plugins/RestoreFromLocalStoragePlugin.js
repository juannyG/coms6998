import { useSessionStorage } from 'react-use'
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin'
import {EditorState} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useRef, useEffect, useCallback } from 'react';

export default function RestoreFromLocalStoragePlugin({data}) {
  const [editor] = useLexicalComposerContext()
  // const [serializedEditorState, setSerializedEditorState] = useSessionStorage('postContent', null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {

      if (data && editor && editor.parseEditorState) {
        const initialEditorState = editor.parseEditorState(data)
        editor.setEditorState(initialEditorState)
        isFirstRender.current = false;
      }
    }
  }, [isFirstRender.current, data, editor])

  return <OnChangePlugin  />
}