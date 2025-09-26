export type Cleanup = () => void;
type Subscriber = () => void;

let CURRENT: Subscriber | null = null;

export interface Signal<T> {
  get(): T;
  set(v: T): void;
  sub(fn: Subscriber): () => void;
}

export function signal<T>(v: T): Signal<T> {
  let val = v;
  const subs = new Set<Subscriber>();
  const s: Signal<T> = {
    get() {
      if (CURRENT) subs.add(CURRENT);
      return val;
    },
    set(n: T) {
      if (Object.is(n, val)) return;
      val = n;
      subs.forEach(fn => fn());
    },
    sub(fn: Subscriber) {
      subs.add(fn);
      return () => subs.delete(fn);
    }
  };
  return s;
}

export function effect(fn: () => void): Cleanup {
  let cleanups: Cleanup[] = [];
  const run = () => {
    // cleanup before rerun
    for (const c of cleanups) c();
    cleanups = [];
    const prev = CURRENT;
    CURRENT = rerun;
    try { fn(); } finally { CURRENT = prev; }
  };
  const rerun = () => queueMicrotask(run);
  run();
  return () => { cleanups.forEach(c => c()); cleanups = []; };
}

export function computed<T>(calc: () => T): { get(): T; sub: Signal<T>["sub"] } {
  const s = signal<T>(undefined as unknown as T);
  effect(() => s.set(calc()));
  return { get: () => s.get(), sub: s.sub };
}
