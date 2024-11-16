import { useContext, useEffect, useState } from "react";
import { EditorContext } from "../context";
import "../richTextEditor/styles.css";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import EditorContentPlugin from "./plugins/EditorContentPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ExampleTheme from "./themes/ExampleTheme";
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
import { useAccount } from "wagmi";

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

const editorConfig = {
  // The editor theme
  theme: ExampleTheme,
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

export default function Editor() {
  const { confirmPost, confirmPaywallPost } = useContext(EditorContext);
  const [showPaywallOption, setShowPaywallOption] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    const checkIfEncryptionSupported = async () => {
      try {
        const ethAccounts = await window.ethereum.request({
          "method": "eth_accounts",
          "params": [],
        });

        // This checks if the metamask account is ACTUALLY the account being used in Spotlight
        // (i.e. you can have MetaMask installed, but you're using a burner wallet/ledger/etc)
        // We need to normalize the account addresses to make sure we can compare them
        if (ethAccounts?.length > 0 && ethAccounts[0].toLowerCase() == address?.toLowerCase()) {
          setShowPaywallOption(true);
        } else {
          setShowPaywallOption(false);
        }
      } catch {
        setShowPaywallOption(false);
      }
    };

    checkIfEncryptionSupported().catch((err) => console.log(err));
  }, [address, window.ethereum, setShowPaywallOption])

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <EditorContentPlugin />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
        <div className="flex justify-end pt-2">
          <button className="btn btn-outline rounded text-[#3466f6] border border-[#3466f6]" onClick={confirmPost}>
            Post
          </button>
          {showPaywallOption && 
            <button className="btn btn-outline rounded text-[#3466f6] border border-[#3466f6]" onClick={confirmPaywallPost}>
              Paywall Post
            </button>
          }
        </div>
      </div>
    </LexicalComposer>
  );
}
