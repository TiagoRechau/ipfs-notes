import * as React from "react";
import "./styles.css";
import ReactMarkdown from "react-markdown";
import RemarkGFM from "remark-gfm";
import IpfsHttpClient from "ipfs-http-client";
import { downloadToFile } from "../../lib/files";
import { useStorageState } from "react-storage-hooks";
import { useEffect } from "react";
import useInterval from "../../hooks/useInterval";
import { useHistory, useParams } from "react-router-dom";

const ipfs = IpfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
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

export default function Note() {
  const { id } = useParams<any>();
  const history = useHistory();
  const [note, setNote] = useStorageState(localStorage, `ipfs-notes-${id}`, "");
  const [content, setContent] = React.useState("");
  const [path, setPath] = React.useState("");
  const contentRef = React.useRef<null | HTMLDivElement>(null);

  useInterval(() => {
    setNote(content);
  }, 1000);

  useEffect(() => {
    if (note) {
      const loadBackup = confirm(
        "You have a local not, do you want to load it?"
      );
      if (loadBackup) {
        setContent(note);
        if (contentRef.current) contentRef.current.innerText = note;
        return;
      }
    }
    if (id) {
      onLoad(id)
        .then((content) => {
          setContent(content);
          if (contentRef.current) contentRef.current.innerText = content;
        })
        .catch(() => {
          console.debug("Error loading " + id);
        });
    }
  }, []);

  const loadLocalFile = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event: any) => {
      setContent(event.target.result);
      if (contentRef.current)
        contentRef.current.innerText = event.target.result;
    };
    reader.readAsText(file);
  };
  return (
    <div className="App">
      <div className="grid grid-cols-2 gap-4">
        {}
        <input type="file" onChange={loadLocalFile} />
      </div>

      <section className="editor-preview__container">
        <div
          className="editor"
          contentEditable
          onKeyUp={(event: any) => setContent(event.target.innerText)}
          ref={contentRef}
        ></div>

        <ReactMarkdown
          plugins={[RemarkGFM]}
          source={content}
          className="preview"
        />
      </section>
      <div className="grid grid-cols-2 gap-4">
        <button
          className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
          onClick={async () => {
            const cid = await onSave(content);
            setPath(cid);
            history.push(`/note/${cid}`);
          }}
        >
          Save
        </button>
        <button
          className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
          onClick={() => {
            downloadToFile(content, "note.md", "text/plain");
          }}
        >
          Download
        </button>
      </div>

      {path ? <p>CID: {path} </p> : null}
    </div>
  );
}
