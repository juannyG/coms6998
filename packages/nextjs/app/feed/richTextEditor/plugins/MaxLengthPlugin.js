import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";

export default function MaxLengthPlugin({ maxLength }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerNodeTransform($getRoot(), (rootNode) => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          return;
        }

        const textContent = rootNode.getTextContent();
        if (textContent.length > maxLength) {
          const anchor = selection.anchor;
          trimTextContentFromAnchor(editor, anchor, textContent.length - maxLength);
        }
      });
    });
  }, [editor, maxLength]);

  return null;
}
