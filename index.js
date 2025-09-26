#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("🚀 Creating a new Zeon app...");

const targetDir = process.argv[2] || "my-zeon-app";
const targetPath = path.resolve(process.cwd(), targetDir);

if (!fs.existsSync(targetPath)) {
  fs.mkdirSync(targetPath);
}

fs.writeFileSync(
  path.join(targetPath, "package.json"),
  JSON.stringify(
    {
      name: targetDir,
      version: "0.0.1",
      private: true,
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
      },
      dependencies: {
        "@usezeon/core": "^0.0.1",
        "@usezeon/runtime": "^0.0.1",
        "@usezeon/router": "^0.0.1",
        "@usezeon/ssr": "^0.0.1"
      },
      devDependencies: {
        vite: "^5.4.0"
      }
    },
    null,
    2
  )
);

fs.writeFileSync(
  path.join(targetPath, "index.html"),
  `<!DOCTYPE html>
<html>
  <head><title>Zeon App</title></head>
  <body>
    <div id="app"></div>
    <script type="module" src="/main.ts"></script>
  </body>
</html>`
);

fs.writeFileSync(
  path.join(targetPath, "main.ts"),
  `import { signal } from "@usezeon/core";
import { h, mount } from "@usezeon/runtime";

const count = signal(0);
const view = h("div", {},
  h("p", {}, () => "Count: " + count.get()),
  h("button", { onClick: () => count.set(count.get()+1) }, "Inc")
);
mount(document.getElementById("app")!, view);`
);

console.log("✅ Done! Next steps:");
console.log(`cd ${targetDir}`);
console.log("pnpm install");
console.log("pnpm dev");
