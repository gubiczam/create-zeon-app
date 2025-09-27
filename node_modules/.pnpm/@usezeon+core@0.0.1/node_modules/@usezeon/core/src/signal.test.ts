import { describe, it, expect } from "vitest";
import { signal, effect } from "./signal";

describe("signal", () => {
  it("writes and reads", () => {
    const s = signal(0);
    expect(s.get()).toBe(0);
    s.set(1);
    expect(s.get()).toBe(1);
  });
  it("triggers effect", () => {
    const s = signal(0);
    let x = 0;
    effect(() => { x = s.get(); });
    s.set(2);
    // microtask queue
    return Promise.resolve().then(() => expect(x).toBe(2));
  });
});
