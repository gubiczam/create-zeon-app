import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execa } from "execa";
import type { Answers } from "./prompts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tplRoot = path.resolve(__dirname, "../templates");

async function copyDir(src: string, dest: string) {
  await fsp.mkdir(dest, { recursive: true });
  for (const e of await fsp.readdir(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) await copyDir(s, d);
    else await fsp.copyFile(s, d);
  }
}

function pmArgs(pm: "pnpm" | "yarn" | "npm", cmd: "install" | "dev" | "addDev", pkgs: string[] = []) {
  if (cmd === "install") return pm === "npm" ? ["install"] : ["i"];
  if (cmd === "dev") return pm === "npm" ? ["run", "dev"] : ["dev"];
  // add -D pkgs
  if (pm === "npm") return ["install", "-D", ...pkgs];
  if (pm === "yarn") return ["add", "-D", ...pkgs];
  return ["add", "-D", ...pkgs]; // pnpm
}

export async function scaffold(a: Answers, opts?: { run?: boolean }) {
  const run = opts?.run ?? true;
  const dest = path.resolve(process.cwd(), a.name);
  if (fs.existsSync(dest)) throw new Error(`Target exists: ${dest}`);

  console.log(`📂 Creating ${dest}`);
  await fsp.mkdir(dest, { recursive: true });

  // 1) template + shared + opcionális tailwind fájlok
  await copyDir(path.join(tplRoot, a.template), dest);
  await copyDir(path.join(tplRoot, "_shared"), dest);
  if (a.css === "tailwind") await copyDir(path.join(tplRoot, "_tailwind"), dest);

  // 2) package.json MERGE
  const pkgPath = path.join(dest, "package.json");
  let pkg: any = {};
  try { pkg = JSON.parse(await fsp.readFile(pkgPath, "utf8")); } catch {}
  pkg.name = a.name;
  pkg.version ||= "0.0.1";
  pkg.private = true;
  pkg.scripts ||= {};
  pkg.scripts.dev ||= "vite";
  pkg.scripts.build ||= "vite build";
  pkg.scripts.preview ||= "vite preview";
  pkg.dependencies ||= {};
  pkg.devDependencies ||= {};
  const ensure = (obj: any, name: string, ver: string) => { if (!obj[name]) obj[name] = ver; };

  // kötelezők
  ensure(pkg.dependencies, "@usezeon/core", "latest");
  ensure(pkg.dependencies, "@usezeon/runtime", "latest");
  ensure(pkg.dependencies, "@usezeon/vite-plugin", "latest");
  // sablon-specifikusak (ha kell)
  if (a.template === "islands") {
    ensure(pkg.dependencies, "@usezeon/router", "latest");
    ensure(pkg.dependencies, "@usezeon/ssr", "latest");
  }
  // dev deps
  ensure(pkg.devDependencies, "vite", "^5.4.0");
  ensure(pkg.devDependencies, "typescript", "^5.9.2");
  ensure(pkg.devDependencies, "@types/node", "20.19.17");
  if (a.css === "tailwind") {
    ensure(pkg.devDependencies, "tailwindcss", "^3.4.10");
    ensure(pkg.devDependencies, "postcss", "^8.4.38");
    ensure(pkg.devDependencies, "autoprefixer", "^10.4.20");
  }
  await fsp.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

  // 3) git init ha kell
  if (a.git) {
    await execa("git", ["init"], { cwd: dest, stdio: "ignore" }).catch(() => {});
    await execa("git", ["add", "-A"], { cwd: dest }).catch(() => {});
    await execa("git", ["commit", "-m", "chore: scaffold"], { cwd: dest }).catch(() => {});
  }

  // 4) install
  console.log("📦 Installing deps...");
  await execa(a.pm, pmArgs(a.pm, "install"), { cwd: dest, stdio: "inherit" });

  // Tailwind plusz: biztos import a main.ts elején
  if (a.css === "tailwind") {
    const main = path.join(dest, "src/main.ts");
    if (fs.existsSync(main)) {
      const code = await fsp.readFile(main, "utf8");
      if (!code.includes("./index.css")) {
        await fsp.writeFile(main, `import './index.css'\n` + code);
      }
    }
  }

  // 5) dev
  if (run) {
    console.log("🚀 Starting dev...");
    await execa(a.pm, pmArgs(a.pm, "dev"), { cwd: dest, stdio: "inherit" });
  }
}
