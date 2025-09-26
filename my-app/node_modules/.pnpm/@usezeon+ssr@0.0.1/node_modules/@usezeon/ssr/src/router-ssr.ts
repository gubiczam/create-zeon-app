import { renderToString } from "./render";
import type { PageModule } from "@usezeon/router";


type Match = {
  mod: PageModule;
  data?: any;
};

export async function renderRoute(
  routes: Record<string, () => Promise<PageModule>>,
  urlStr: string
): Promise<{ html: string; match?: Match }> {
  const url = new URL(urlStr, "http://localhost");
  const path = url.pathname || "/";
  for (const fsPath of Object.keys(routes)) {
    if (fsPath.endsWith("index.ts") && path === "/") {
      const mod = await routes[fsPath]();
      const data = mod.loader ? await mod.loader({ params: {}, url }) : undefined;
      const node = mod.default({ params: {}, data });
      return { html: renderToString(node), match: { mod, data } };
    }
    if (fsPath.includes("[id].ts") && path.startsWith("/users/")) {
      const param = path.split("/")[2];
      const mod = await routes[fsPath]();
      const data = mod.loader ? await mod.loader({ params: { id: param }, url }) : undefined;
      const node = mod.default({ params: { id: param }, data });
      return { html: renderToString(node), match: { mod, data } };
    }
    if (fsPath.endsWith("about.ts") && path === "/about") {
      const mod = await routes[fsPath]();
      const data = mod.loader ? await mod.loader({ params: {}, url }) : undefined;
      const node = mod.default({ params: {}, data });
      return { html: renderToString(node), match: { mod, data } };
    }
  }
  return { html: "<h1>404</h1>" };
}
