// @ts-nocheck
export default function App() {
  const root = document.createElement("div");
  root.className = "min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white text-center gap-6";

  const title = document.createElement("h1");
  title.textContent = "🚀 Welcome to Zeon";
  title.className = "text-5xl font-bold";

  const subtitle = document.createElement("p");
  subtitle.textContent = "The ultra-light framework with signals, islands and SSR.";
  subtitle.className = "text-gray-400";

  const btnRow = document.createElement("div");
  btnRow.className = "flex gap-4";

  const docs = document.createElement("a");
  docs.href = "https://github.com/gubiczam/zeonjs";
  docs.textContent = "Docs";
  docs.className = "px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition";

  const github = document.createElement("a");
  github.href = "https://github.com/gubiczam/zeonjs";
  github.textContent = "GitHub";
  github.className = "px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition";

  btnRow.append(docs, github);
  root.append(title, subtitle, btnRow);
  return root;
}
