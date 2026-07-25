// sandboxed-preload-globals.d.ts — HAND-WRITTEN, not generated. Do not replace
// this file with @types/node.
//
// WHAT. The four Node.js primitives a SANDBOXED preload script gets as globals.
// `docs/tutorial/sandbox.md@v43.2.0` ("Preload scripts") says verbatim: "In
// addition, the preload script also polyfills certain Node.js primitives as
// globals:", and lists exactly four — `Buffer`, `process`, `clearImmediate`,
// `setImmediate`. The same section limits the polyfilled `require` to
// `electron`, `events`, `timers` and `url`, so `fs`, `path` and
// `child_process` are absent at runtime and `__dirname` is not a global here.
//
// WHY BY HAND. No published .d.ts describes the sandboxed subset. @types/node
// declares the whole Node surface, so installing it for the preload pass would
// type `fs`, `__dirname` and `process.exit` as available and let an example
// that fails at runtime type-check clean — the exact false pass this harness
// exists to catch.
//
// NARROW BY DESIGN. The vendor documents WHICH globals exist, not which members
// of `process` and `Buffer` survive the sandbox. This file therefore declares a
// deliberately small subset and biases toward the false NEGATIVE: an example
// using an undeclared member fails loudly and an author extends this file with
// the evidence, rather than a runtime failure passing silently. Every addition
// cites a primary source in a comment.

// ---- process ---------------------------------------------------------------

/**
 * `platform` and `arch` carry Node's values. `type`, `contextIsolated` and
 * `sandboxed` are Electron's own additions, declared on `NodeJS.Process` in
 * `node_modules/electron/electron.d.ts@43.2.0` (its `declare namespace NodeJS`
 * block); `versions.electron` and `versions.chrome` come from the
 * `NodeJS.ProcessVersions` interface in the same block.
 */
interface SandboxedPreloadProcess {
  readonly platform: "aix" | "darwin" | "freebsd" | "linux" | "openbsd" | "sunos" | "win32";
  readonly arch: string;
  readonly versions: SandboxedPreloadProcessVersions;
  /** `'renderer'` in a preload — a preload runs in the renderer process. */
  readonly type: "browser" | "renderer" | "service-worker" | "worker" | "utility";
  readonly contextIsolated: boolean;
  readonly sandboxed: boolean;
}

interface SandboxedPreloadProcessVersions {
  readonly node: string;
  readonly chrome: string;
  readonly electron: string;
}

declare const process: SandboxedPreloadProcess;

// ---- Buffer ----------------------------------------------------------------

/** Opaque handle plus the members a preload example plausibly needs. */
interface SandboxedPreloadBuffer {
  readonly length: number;
  toString(encoding?: string): string;
}

interface SandboxedPreloadBufferConstructor {
  from(value: string, encoding?: string): SandboxedPreloadBuffer;
  from(value: ArrayBuffer | ArrayBufferView | readonly number[]): SandboxedPreloadBuffer;
  alloc(size: number): SandboxedPreloadBuffer;
  concat(list: readonly SandboxedPreloadBuffer[]): SandboxedPreloadBuffer;
  isBuffer(value: unknown): value is SandboxedPreloadBuffer;
}

declare const Buffer: SandboxedPreloadBufferConstructor;

// ---- setImmediate / clearImmediate -----------------------------------------

declare const sandboxedPreloadImmediateBrand: unique symbol;

/** Opaque handle returned by `setImmediate`; only `clearImmediate` reads it. */
interface SandboxedPreloadImmediate {
  readonly [sandboxedPreloadImmediateBrand]: true;
}

declare function setImmediate<TArgs extends readonly unknown[]>(
  callback: (...args: TArgs) => void,
  ...args: TArgs
): SandboxedPreloadImmediate;

declare function clearImmediate(immediate: SandboxedPreloadImmediate): void;
