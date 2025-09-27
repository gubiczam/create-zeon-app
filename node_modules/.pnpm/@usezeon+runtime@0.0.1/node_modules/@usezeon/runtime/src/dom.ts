import { effect } from "@usezeon/core";

export function text(read: () => any): Text {
  const t = document.createTextNode("");
  effect(() => { t.data = String(read() ?? ""); });
  return t;
}

export function attr(el: Element, name: string, read: () => any) {
  effect(() => {
    const v = read();
    if (v == null || v === false) el.removeAttribute(name);
    else el.setAttribute(name, v === true ? "" : String(v));
  });
}

type Child = Node | string | (() => any);

export function h(tag: string, props?: Record<string, any>, ...children: Child[]) {
  const el = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (k.startsWith("on") && typeof v === "function") {
        el.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (typeof v === "function") {
        attr(el, k, v as () => any);
      } else if (v != null) {
        el.setAttribute(k, String(v));
      }
    }
  }
  for (const c of children) {
    if (typeof c === "function") el.append(text(c));
    else el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

export function mount(root: Element, node: Node) {
  root.replaceChildren(node);
}
