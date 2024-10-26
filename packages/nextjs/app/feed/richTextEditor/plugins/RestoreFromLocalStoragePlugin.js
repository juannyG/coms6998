import { useSessionStorage } from 'react-use'
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin'
import {EditorState} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useRef, useEffect, useCallback } from 'react';

export default function RestoreFromLocalStoragePlugin() {
  const [editor] = useLexicalComposerContext()
  const [serializedEditorState, setSerializedEditorState] = useSessionStorage('postContent', null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
        isFirstRender.current = false;

      if (serializedEditorState) {
        const initialEditorState = editor.parseEditorState(serializedEditorState)
        editor.setEditorState(initialEditorState)
      }
    }
  }, [isFirstRender.current, serializedEditorState, editor])

  const onChange = useCallback(
    (editorState) => {
      setSerializedEditorState(JSON.stringify(editorState.toJSON()))
    },
    [setSerializedEditorState]
  )

  return <OnChangePlugin onChange={onChange} />
}