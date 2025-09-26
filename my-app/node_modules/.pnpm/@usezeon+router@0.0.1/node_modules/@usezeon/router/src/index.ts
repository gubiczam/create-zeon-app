import { mount } from "@usezeon/runtime";

export type Loader = (ctx: { params: Record<string,string>; url: URL }) => Promise<any> | any;
export type PageModule = { default: (props: any) => Node; loader?: Loader };

type Route = { path: string; paramNames: string[]; re: RegExp; mod: () => Promise<PageModule> };

function pathToRe(path: string) {
  const names: string[] = [];
  const re = new RegExp("^" + path
    .replace(/\/\[(.*?)\]/g, (_m, p) => { names.push(p); return "/([^/]+)"; })
    .replace(/\/index$/,"/")
  + "$");
  return { re, names };
}

export function createRouter(opts: {
  root: Element;
  pages: Record<string, () => Promise<PageModule>>; // import.meta.glob eredménye
  base?: string;
}) {
  const base = (opts.base ?? "").replace(/\/$/,"");
  const routes: Route[] = Object.keys(opts.pages).map((fsPath) => {
    // pl: /src/routes/about.ts -> /about
    const web = fsPath
      .replace(/^.*\/routes/, "")
      .replace(/\.(t|j)sx?$/, "");
    const { re, names } = pathToRe(web);
    return { path: web, paramNames: names, re, mod: opts.pages[fsPath] };
  });

  async function render(urlStr: string) {
    const url = new URL(urlStr, location.origin);
    const path = url.pathname.replace(base, "") || "/";
    for (const r of routes) {
      const m = path.match(r.re);
      if (!m) continue;
      const params = Object.fromEntries(r.paramNames.map((n,i)=>[n, decodeURIComponent(m[i+1])]));
      const mod = await r.mod();
      const data = mod.loader ? await mod.loader({ params, url }) : undefined;
      const node = mod.default({ params, data });
      mount(opts.root, node);
      return;
    }
    mount(opts.root, document.createTextNode("404"));
  }

  async function navigate(to: string) {
    const href = to.startsWith("http") ? to : base + to;
    history.pushState({}, "", href);
    await render(location.href);
  }

  function linkInterceptor(e: MouseEvent) {
    const a = (e.target as Element).closest("a");
    if (!a) return;
    const href = a.getAttribute("href");
    const ext = a.getAttribute("target");
    if (!href || href.startsWith("http") || href.startsWith("mailto:") || ext === "_blank") return;
    e.preventDefault();
    navigate(href);
  }

  window.addEventListener("popstate", () => { render(location.href); });
  document.addEventListener("click", linkInterceptor);

  return { start: () => render(location.href), navigate };
}
