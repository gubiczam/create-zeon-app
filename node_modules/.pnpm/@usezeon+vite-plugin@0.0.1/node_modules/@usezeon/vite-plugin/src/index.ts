import path from "node:path";
import { fileURLToPath } from "node:url";

function rootDir(metaUrl: string) {
  return path.resolve(path.dirname(fileURLToPath(metaUrl)), "../../..");
}

export function xyzPlugin() {
  const root = rootDir(import.meta.url);
  const alias = {
    "@usezeon/core": path.join(root, "packages/core/src/index.ts"),
    "@usezeon/runtime": path.join(root, "packages/runtime/src/index.ts"),
    "@usezeon/router": path.join(root, "packages/router/src/index.ts"),
    "@usezeon/ssr": path.join(root, "packages/ssr/src/index.ts")
  };
  return {
    name: "xyz-plugin",
    config() {
      return { resolve: { alias } };
    }
  };
}

export default xyzPlugin;
