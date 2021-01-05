import * as React from "react";
import "./styles.css";
import ReactMarkdown from "react-markdown";
import RemarkGFM from "remark-gfm";
import IpfsHttpClient from "ipfs-http-client";
//import { useWallet, UseWalletProvider } from "use-wallet";
const ipfs = IpfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});

const onLoad = async (cid: string) => {
  const content = [];
  for await (const file of ipfs.get(cid)) {
    for await (const chunk of file.content) {
      content.push(chunk);
    }
  }
  return content.toString();
};

const onSave = async (content: string) => {
  const result = await ipfs.add(content);
  return result.path;
};

export default function App() {
  const [content, setContent] = React.useState("");
  const [cid, setCid] = React.useState("");
  const [path, setPath] = React.useState("");
  const contentRef = React.useRef<null | HTMLDivElement>(null);
  //const wallet = useWallet();
  return (
    <div className="App">
      {/*<button onClick={() => wallet.connect("injected")}>Connect</button> */}
      <input
        type="text"
        onChange={(event) => setCid((event.target as HTMLInputElement).value)}
      />
      <button
        onClick={async () => {
          const content = await onLoad(cid);
          setContent(content);
          contentRef.current!.innerText = content;
        }}
      >
        Load note
      </button>
      <section className="editor-preview__container">
        <div
          className="editor"
          contentEditable
          onKeyUp={(event) =>
            setContent((event.target as HTMLElement).innerText)
          }
          ref={contentRef}
        ></div>

        <ReactMarkdown
          plugins={[RemarkGFM]}
          source={content}
          className="preview"
        />
      </section>
      <button
        onClick={async () => {
          const cid = await onSave(content);
          setPath(cid);
        }}
      >
        Save{" "}
      </button>
      {path ? <p>CID: {path} </p> : null}
    </div>
  );
}

// Wrap everything in <UseWalletProvider />
/* 
export default () => (
  <UseWalletProvider
    chainId={1}
    connectors={{
      // This is how connectors get configured
      injected: {}
    }}
  >
    <App />
  </UseWalletProvider>
);
*/
