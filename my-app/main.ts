import { signal } from "@usezeon/core";
import { h, mount } from "@usezeon/runtime";

const count = signal(0);
const view = h("div", {},
  h("p", {}, () => "Count: " + count.get()),
  h("button", { onClick: () => count.set(count.get()+1) }, "Inc")
);
mount(document.getElementById("app")!, view);