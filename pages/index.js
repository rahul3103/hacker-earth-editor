import Head from "next/head";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import styles from "../styles/Home.module.css";

function loadScript(src, id) {
  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(id);
    if (!existingScript) {
      const s = document.createElement("script");
      s.src = src;
      s.id = id;
      s.onload = resolve;
      s.onerror = reject;
      s.crossOrigin = "anonymous";
      document.head.appendChild(s);
    } else {
      resolve();
    }
  });
}

function addIframe() {}

const aceUrl = "https://pagecdn.io/lib/ace/1.4.12/ace.min.js";
const monokaiTheme = "https://pagecdn.io/lib/ace/1.4.12/theme-monokai.min.js";
const soloarizedLightTheme =
  "https://pagecdn.io/lib/ace/1.4.12/theme-solarized_light.min.js";
const htmlUrl = "https://pagecdn.io/lib/ace/1.4.12/mode-html.min.js";

export default function Home() {
  const [code, setCode] = useState("");
  const [editor, setEditor] = useState({});
  const [theme, setTheme] = useState("Monokai");

  function toggleTheme() {
    if (theme === "Monokai") editor.setTheme("ace/theme/solarized_light");
    else editor.setTheme("ace/theme/monokai");
    setTheme(theme === "Monokai" ? "Solarized" : "Monokai");
  }

  const iframeContainer = useRef(null);

  function play() {
    const editorValue = editor.getValue();
    const doc = iframeContainer.current.contentWindow.document;
    doc.open();
    doc.write(editorValue);
    doc.close();
    setCode(editorValue);
  }

  useEffect(() => {
    async function loadAllScripts() {
      await loadScript(aceUrl, "ace-editor");
      const scripts = [
        loadScript(monokaiTheme, "monokai"),
        loadScript(htmlUrl, "js-editor"),
        loadScript(soloarizedLightTheme, "soloarized-light"),
      ];
      await Promise.allSettled(scripts);
      const editor = ace.edit("editor");
      editor.session.setUseWorker(false);
      editor.setTheme("ace/theme/monokai");
      editor.session.setMode("ace/mode/html");
      // editor.session.on("change", function (delta) {
      //   setCode(() => editor.getValue());
      //   // delta.start, delta.end, delta.lines, delta.action
      // });
      setEditor(editor);
    }
    loadAllScripts();
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Editor</title>
        <meta name="description" content="Editor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.section}>
        <div className={styles.nav}>
          <button onClick={toggleTheme}>
            Switch to {theme === "Monokai" ? "Solarized" : "Monokai"}
          </button>
          <button onClick={play}>Play</button>
        </div>
        <div className={styles.editor} id="editor" />
        <div className={styles.view}>
          <iframe className={styles.iframe} ref={iframeContainer} />
        </div>
      </div>
    </div>
  );
}
