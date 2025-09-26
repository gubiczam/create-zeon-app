export type SSRBundle = { html: string; state?: any; islands?: any[] };

function safeJson(x: any) { return JSON.stringify(x).replace(/</g, "\\u003c"); }

export function inject(html: string, state: any = {}, islands: any[] = []): string {
  const s = `<script id="__STATE__" type="application/json">${safeJson(state)}</script>`;
  const i = `<script id="__ISLANDS__" type="application/json">${safeJson(islands)}</script>`;
  return html.replace("</body>", `${s}${i}</body>`);
}
export function readState<T=any>(): T {
  const el = document.getElementById("__STATE__");
  return el ? JSON.parse(el.textContent || "{}") as T : ({} as T);
}
export function readIslands<T=any[]>(): T {
  const el = document.getElementById("__ISLANDS__");
  return el ? JSON.parse(el.textContent || "[]") as T : ([] as unknown as T);
}
