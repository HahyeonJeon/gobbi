# TypeScript — Runtime Deltas

**Ownership** — the single locked doc isolating what truly differs across runtimes: Node, Bun, Deno, and the
browser (both the bundler-less import-map path and the bundler path) — module resolution, the import-extension
mode, built-in APIs, `lib` selection, the test runner, `Symbol.dispose` polyfill availability, and
type-stripping vs a `tsc` build.

**Split criterion** — skill-writing P3 (d): an independent-audience doc (a reader targeting one runtime opens
only this) and a user-locked single-doc boundary that quarantines runtime churn.

This doc **deepens, and does not restate,** the SKILL.md Rule *pick the import extension by consumption mode*
and the `runtime-deltas.md` row of the P2 router. The language core is runtime-agnostic: the types, the ESM
hygiene, and every idiom in the other child docs are identical on all four runtimes. What changes is a small,
bounded surface — how a specifier resolves, which built-in APIs exist, which `lib` is in scope, and how the
`.ts` reaches execution. `modules-tooling.md` §4 owns the `.js`-vs-`.ts` import-extension **mechanics**; this
doc says which mode each runtime is in and points there.

Most blocks below are configuration — a `tsconfig`, a `deno.json`, an import map, an HTML shell — shown in
`jsonc` / `json` / `html` for their shape; a config object is not TypeScript and is not compiled. A snippet
that calls a runtime-specific global (`Bun.*`, `Deno.*`, a `node:` built-in) is shown as `text`: those APIs
need a type package this skill does not own (`@types/node`, `@types/bun`, Deno's bundled lib), so the skill
does not claim they compile under its examples baseline. The fenced `ts` blocks are the runtime-**agnostic**,
web-standard facts that are identical on every runtime — the point this doc makes — and they type-check under
that baseline.

## The delta matrix

| Runtime | Resolution / config | Runs `.ts` directly? | Import extension (§4) | Built-in namespace | Default `lib` | Test runner |
|---|---|---|---|---|---|---|
| **Node** | `nodenext` in `tsconfig` | 24+ strips types | `.js` when emitted, `.ts` when stripped | `node:*` (+ `@types/node`) | `ES2023` (no DOM) | `node:test` |
| **Bun** | `bundler` (its default) or `nodenext` for libs | yes, native | `.ts` | `Bun.*` + Web + node-compat | via `@types/bun` | `bun test` |
| **Deno** | `deno.json` `compilerOptions` | yes, native | `.ts` + URL / JSR | `Deno.*` + Web | `deno.window` | `Deno.test` |
| **Browser** | `nodenext`-approx or `bundler` | no — ships `.js` | `.js` (explicit) | Web / `DOM` | `DOM`, `DOM.Iterable`, `ES2023` | vitest / web-test-runner |

---

## Node

Node is the `nodenext` baseline the SKILL.md Rules assume by default. Set the resolver and give it a server
`lib` plus the Node ambient types:

```jsonc
// tsconfig for Node: nodenext resolution, node types, a server lib (no DOM).
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "lib": ["ES2023"],
    "types": ["node"]     // @types/node — a devDependency
  }
}
```

- **Import extension** — the fork from `modules-tooling.md` §4 applies here directly: a `tsc`-emitted library
  writes `.js` on relative imports; a directly type-stripped source writes `.ts` with
  `rewriteRelativeImportExtensions`. Node is the runtime that hosts BOTH modes.
- **Type-stripping** — Node 24+ runs `.ts` by stripping types with no build step (on by default; the 22.6–23.5
  line needed `--experimental-strip-types`). Stripping does not type-check, so a separate `tsc --noEmit` stays
  the correctness gate (see cross-cutting, below). `erasableSyntaxOnly` guarantees the file strips cleanly.
- **Built-ins** — imported under the `node:` prefix and typed by `@types/node`. Under this skill's DOM-only
  examples baseline they do not resolve, so the shape is shown, not compiled:

```text
// Node: node: built-ins need @types/node (a devDep); not resolvable under the
// skill's examples baseline, so this is shown as text, not a compiled `ts` fact.
import { readFile } from "node:fs/promises";
const data = await readFile("./data.json", "utf8");
```

- **Test runner** — `node:test` with `node --test`; no dependency.

## Bun

Bun executes `.ts` natively (no build step to run) and its `bun init` writes a `tsconfig` tuned for a
bundler-style workflow — `"module": "esnext"`, `"moduleResolution": "bundler"`. That default is fine for an
**app** Bun itself runs; for a **library** you publish, keep the `nodenext` model from `modules-tooling.md` §3
so the emitted `.d.ts` resolves for non-Bun consumers.

- **Import extension** — `.ts` specifiers, since Bun resolves the real on-disk file.
- **Built-ins** — the `Bun` global (`Bun.serve`, `Bun.file`, `Bun.$`) plus the Web platform and a Node-compat
  layer. The `Bun` global is typed by `@types/bun`, outside this baseline:

```text
// Bun: the Bun global needs @types/bun; shown as text, not compiled here.
const server = Bun.serve({ port: 3000, fetch: () => new Response("ok") });
const config = await Bun.file("./config.json").json();
```

- **Test runner** — `bun test` is built in and Jest-compatible; the bundler (`bun build`) is built in too.

## Deno

Deno is the biggest departure: it is configured by `deno.json`, not `tsconfig`, and its `compilerOptions` are a
SUBSET of the compiler's. It resolves imports by URL and by the `jsr:` / `npm:` specifiers, with an `imports`
map for bare names:

```jsonc
// deno.json — Deno's own config: a compilerOptions subset, an import map, tasks.
{
  "compilerOptions": { "lib": ["deno.window", "dom"] },
  "imports": {
    "@std/assert": "jsr:@std/assert@^1",
    "zod": "npm:zod@^3"
  },
  "tasks": { "test": "deno test" }
}
```

- **Import extension** — `.ts` specifiers, plus remote `https://` URLs and `jsr:` / `npm:` specifiers that Deno
  caches on first fetch.
- **Code slot vs type slot** — Deno's module graph resolves each import to a *code* specifier and, separately, a
  *types* specifier. A `// @deno-types="./mod.d.ts"` pragma (or an `X-TypeScript-Types` response header) points
  the type slot at a `.d.ts` while the code slot loads the JavaScript — so a plain-JS or remote module can carry
  external types.
- **Built-ins** — the `Deno` global (`Deno.readTextFile`, `Deno.serve`) alongside first-class Web APIs; typed by
  Deno's bundled lib, not an `@types` package:

```text
// Deno: the Deno global + std come from Deno's bundled lib / JSR, not @types.
const text = await Deno.readTextFile("./data.json");
import { assertEquals } from "jsr:@std/assert";
Deno.test("adds", () => assertEquals(1 + 1, 2));
```

- **Test runner** — `Deno.test` with `deno test`, built in.

## Browser

The browser has two real delivery paths, and a bundler is **not** required for either. Both ship JavaScript —
the `.ts` is compiled or type-stripped before it ever loads — and both need a `DOM` `lib` and no `node:`
built-ins.

### (a) No bundler — native ESM + import maps

A `<script type="module">` loads ESM directly; an import map resolves bare specifiers; relative imports must
carry a real, fetchable extension:

```html
<!-- No bundler: the import map resolves bare specifiers, the module script
     loads ESM. Relative imports need a real extension the browser can fetch. -->
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3" } }
</script>
<script type="module" src="./app.js"></script>
```

Type-check it by resolving like Node ESM (explicit relative extensions the browser can fetch) with the server
`lib` swapped for `DOM` — the TS module guide's "ES modules for the browser, with no bundler or module
compiler" recipe:

```jsonc
// Browser, no bundler: NodeNext-approximation resolution + a DOM lib.
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "types": []
  }
}
```

### (b) With a bundler

An application that owns its build may use `moduleResolution: bundler`, which the bundler (Vite, esbuild,
webpack) then honors. Keep this to apps — a published library stays on `nodenext` so its `.d.ts` resolves for
consumers (`modules-tooling.md` §3):

```jsonc
// Browser WITH a bundler: the bundler owns resolution, so `bundler` is valid.
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "noEmit": true
  }
}
```

DOM globals resolve under the `DOM` `lib`, so ordinary browser code IS a compiled taught fact:

```ts
// Browser: the DOM lib types `document` and events; no `node:` built-ins exist.
const button = document.querySelector<HTMLButtonElement>("button");
button?.addEventListener("click", () => {
  console.log("clicked");
});
```

## Cross-cutting deltas

Three concerns cut across every runtime.

**`lib` selection.** The `lib` is the switch between a server and a browser type surface: Node (and Bun on its
server default) take `ES2023` with no `DOM`; Deno instead uses its bundled `deno.window`, adding `dom` when it
needs web globals (see its config above); the browser takes `DOM` + `DOM.Iterable`. Add `ESNext.Disposable`
wherever `using` is used (below). The `lib` types what EXISTS; it never adds a runtime API — `@types/node`,
`@types/bun`, and Deno's bundled lib are separate.

**`Symbol.dispose` availability.** `using` / `await using` type-checks whenever the `lib` includes
`ESNext.Disposable` (it defines `Symbol.dispose`, `Symbol.asyncDispose`, and the `Disposable` interface). At
RUNTIME the well-known symbols must also exist: Node 24+, Bun, Deno, and current browsers define them; an older
target needs a one-line polyfill before any `using`. Because `ESNext.Disposable` is in this skill's examples
baseline, disposal is a compiled taught fact:

```ts
// Web-standard disposal: `using` binds release to scope on every runtime whose
// lib carries ESNext.Disposable and whose runtime defines Symbol.dispose.
class Lease implements Disposable {
  [Symbol.dispose](): void {
    // release here
  }
}

function run(): void {
  using lease = new Lease();
  void lease; // disposed at end of scope, including the throwing path
}
```

**Type-stripping vs a `tsc` build.** Node 24+ STRIPS types; Bun and Deno TRANSPILE — either way all three RUN
`.ts` directly and none type-check. So a `tsc --noEmit` pass is the correctness gate on every stripping runtime, exactly as SKILL.md P7
and `modules-tooling.md` §8 require: stripping runs the code, `tsc` judges it, and a green run is never a green
type-check. The runtime-agnostic core proves the thesis — this web-standard code type-checks under the baseline,
and once its annotations are erased to JavaScript (Node 24+/Bun/Deno strip or transpile it directly; a browser
runs the emitted JS from a build step, never the `.ts` itself) the resulting code runs on all of them; only the
built-ins and config around it differ:

```ts
// Runtime-agnostic: fetch + AbortSignal are web standards on Node 18+, Bun,
// Deno, and the browser. The algorithm is portable; a browser runs the emitted JS.
async function getJson(url: string, timeoutMs: number): Promise<unknown> {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}
```
