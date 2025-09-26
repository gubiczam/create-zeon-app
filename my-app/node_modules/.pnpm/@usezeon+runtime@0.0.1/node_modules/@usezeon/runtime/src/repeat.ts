import { effect } from "@usezeon/core";

export function repeat<T>(
  read: () => T[],
  render: (item: T, key: string | number, idx: number) => Node,
  keyOf: (item: T, idx: number) => string | number
) {
  const anchor = document.createComment("repeat");
  const map = new Map<string | number, Node>();
  effect(() => {
    const parent = anchor.parentNode!;
    const items = read() ?? [];
    const next = new Map<string | number, Node>();
    let cursor: Node = anchor;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const k = keyOf(it, i);
      let node = map.get(k);
      if (!node) node = render(it, k, i);
      next.set(k, node);
      if (node.previousSibling !== cursor) parent.insertBefore(node, cursor.nextSibling);
      cursor = node;
    }
    for (const [k, n] of map) if (!next.has(k)) n.parentNode?.removeChild(n);
    map.clear(); for (const [k, n] of next) map.set(k, n);
  });
  return anchor;
}
