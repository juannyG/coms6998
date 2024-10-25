import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import EditorContentPlugin from "./plugins/EditorContentPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ExampleTheme from "./themes/ExampleTheme";
import RestoreFromLocalStoragePlugin from "./plugins/RestoreFromLocalStoragePlugin";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { use, useEffect } from "react";

const editorConfig = {
    editorState: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"你好，","type":"text","version":1},{"detail":0,"format":14,"mode":"normal","style":"","text":"这是","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"一个","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"测试","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"居中显示","type":"text","version":1}],"direction":"ltr","format":"center","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
  // The editor theme
  theme: ExampleTheme,
  editable: false,
  // Handling of errors during update
  onError(error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

export default function Viewer() {

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="view-editor-container">
        <div className="view-editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <RestoreFromLocalStoragePlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  );
}
