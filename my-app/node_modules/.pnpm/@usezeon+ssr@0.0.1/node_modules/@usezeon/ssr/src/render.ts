export function renderToString(node: Node): string {
  if (node.nodeType === 3) return (node as Text).data;
  if (node.nodeType !== 1) return "";
  const el = node as Element;
  const attrs = Array.from(el.attributes).map(a => `${a.name}="${a.value}"`).join(" ");
  const inner = Array.from(el.childNodes).map(c => renderToString(c)).join("");
  return `<${el.tagName.toLowerCase()}${attrs ? " " + attrs : ""}>${inner}</${el.tagName.toLowerCase()}>`;
}
