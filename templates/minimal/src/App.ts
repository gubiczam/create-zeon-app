// @ts-nocheck
export default function App() {
  const root = document.createElement("div");
  root.style.minHeight = "100vh";
  root.style.display = "flex";
  root.style.flexDirection = "column";
  root.style.justifyContent = "center";
  root.style.alignItems = "center";
  root.style.background = "#111";
  root.style.color = "white";
  root.style.fontFamily = "system-ui, sans-serif";
  root.style.textAlign = "center";
  root.style.gap = "1rem";

  const title = document.createElement("h1");
  title.textContent = "🚀 Welcome to Zeon";
  title.style.fontSize = "3rem";
  title.style.margin = "0";

  const subtitle = document.createElement("p");
  subtitle.textContent = "The ultra-light framework with signals, islands and SSR.";
  subtitle.style.color = "#aaa";

  const btnRow = document.createElement("div");
  btnRow.style.display = "flex";
  btnRow.style.gap = "1rem";

  const docs = document.createElement("a");
  docs.href = "https://github.com/gubiczam/zeonjs";
  docs.textContent = "Docs";
  Object.assign(docs.style, {
    padding: "0.5rem 1rem",
    background: "#2563eb",
    borderRadius: "0.5rem",
    textDecoration: "none",
    color: "white"
  });

  const github = document.createElement("a");
  github.href = "https://github.com/gubiczam/zeonjs";
  github.textContent = "GitHub";
  Object.assign(github.style, {
    padding: "0.5rem 1rem",
    background: "#333",
    borderRadius: "0.5rem",
    textDecoration: "none",
    color: "white"
  });

  btnRow.append(docs, github);
  root.append(title, subtitle, btnRow);
  return root;
}
