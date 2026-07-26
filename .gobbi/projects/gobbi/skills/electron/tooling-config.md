# Electron — Tooling and Configuration

**Owns** — how the three targets are built: the build-tool decision with its provenance stated beside it; the
`main` / `preload` / `renderer` config keys, the output directory, and the `package.json` main pointer; the
three-target project layout; the three-target tsconfig split and the false-pass argument for it; the
per-process `electron` module views; and the **single** dev-vs-production renderer load-path switch.

**Split criterion** — an owned artifact set (`../skill-writing/SKILL.md`): the build config, the project
layout and the three `tsconfig` targets are one set of files that change together, and a reader opens this
doc to configure them, not to learn the runtime model behind them.

This doc **deepens, and does not restate,** SKILL.md rules EL-R-02, EL-R-11 and EL-N-08. SKILL.md states the
invariants — check each process separately, switch the load path from one provably dead branch, never use one
combined config. This doc owns the mechanics: what the three targets actually differ in, why a `lib` and
`types` split alone leaves the boundary unchecked, and what the load-path switch looks like.

| Borrowed fact | Its one owner |
|---|---|
| What each `tsconfig` flag *means* — `verbatimModuleSyntax`, `moduleResolution`, the strict base | [`../typescript/modules-tooling.md`](../typescript/modules-tooling.md) |
| The runtime constraint that forces the split, and the sandboxed preload surface | [`process-model.md`](process-model.md) |
| What React must do under the packaged origin | [`renderer-react.md`](renderer-react.md) |
| Why a custom protocol beats `file://` for the packaged renderer | [`security.md`](security.md) |
| What happens to the build output — packaging, ASAR, signing | [`packaging-distribution.md`](packaging-distribution.md) |

## Contents

1. [The build tool](#1-the-build-tool)
2. [Project layout and the main pointer](#2-project-layout-and-the-main-pointer)
3. [The three-target tsconfig split](#3-the-three-target-tsconfig-split)
4. [Per-process `electron` module views](#4-per-process-electron-module-views)
5. [`skipLibCheck: true` is required, and the comment is part of the requirement](#5-skiplibcheck-true-is-required-and-the-comment-is-part-of-the-requirement)
6. [The dev-vs-production renderer load path](#6-the-dev-vs-production-renderer-load-path)

---

## 1. The build tool

An Electron app is three builds, not one: a Node bundle for main, a single-file bundle for the preload, and a
web bundle for the renderer. Whatever tool is chosen has to produce all three, and to keep them separate.

For a Vite-based project the default is **electron-vite** — one config with `main`, `preload` and `renderer`
keys that produces the three bundles, with hot-module replacement for the renderer and hot reload for main and
preload. Its provenance belongs next to the recommendation: electron-vite is **community-maintained by Alex
Wei (`alex8088`) and is not an Electron-org project**, and the facts in this section come from its own npm
registry entry and guide rather than from any Electron source — the lowest-confidence tier in this skill.
Re-verify them before adopting it, and expect them to move independently of Electron's own release schedule.
The alternative is to wire the three builds directly with whichever bundler the project already uses; it costs
more configuration and owes the same three outputs.

Recorded at **electron-vite 5.0.0**, which declares peer dependencies `vite ^5 || ^6 || ^7` and engines
`node ^20.19.0 || >=22.12.0` (`verified-against registry.npmjs.org/electron-vite/latest and
electron-vite.org/guide on 2026-07-25`).

Nothing in the rest of this doc depends on that choice. Sections 3 to 6 are obligations on **any** build
tool: three type-check passes, per-process module views, and one load-path branch.

## 2. Project layout and the main pointer

Three source roots, one per process, so that a per-process type-check has something to point at and a
misplaced file is visible in the tree:

```text
src/
  main/       # Node. Entry module, windows, IPC handlers, OS access.
    index.ts
  preload/    # Bridge only. Bundled to ONE emitted file (EL-R-10).
    index.ts
  renderer/   # DOM. Imports no `electron` module.
    index.html
    main.tsx
electron.vite.config.ts
tsconfig.main.json
tsconfig.preload.json
tsconfig.renderer.json
package.json
```

The build writes the three bundles under one output directory, and `package.json` points Electron at the
built main entry — not at the source:

```text
out/
  main/index.js
  preload/index.js      <- one file
  renderer/index.html

// package.json
{
  "main": "./out/main/index.js"
}
```

The preload row is a build obligation, not a convention: a sandboxed preload cannot split itself across
CommonJS modules, so the preload target must emit exactly one file
([`process-model.md`](process-model.md) § 3).

## 3. The three-target tsconfig split

**One combined config is a false-pass harness.** It is not merely weaker than three; it certifies exactly the
violations the split exists to catch. Measured with `typescript@5.9.3` and `@types/node@24.10.1` over three
fixtures — a main file using `__dirname` and `process`, a renderer file using `document` and `window`, and a
third using both:

| Config | Result |
|---|---|
| One combined — `lib: ["ES2023","DOM"]`, `types: ["node"]` | exit **0** — the mixed file **passes** |
| Main only — `lib: ["ES2023"]`, `types: ["node"]` | exit 2 — `TS2584: Cannot find name 'document'` |
| Renderer only — `lib: ["ES2023","DOM"]`, `types: []` | exit 2 — `TS2591: Cannot find name 'process'` |

So the split is what makes the type-check mean anything about the process boundary, and `TS2584` / `TS2591`
are its guard signals for **ambient globals**. A build that runs one `tsc` over everything has a green check
that says nothing about the property (EL-N-08).

The three targets share one strict base and differ in four settings:

| Target | `lib` | `types` | `electron` view (§ 4) | Also |
|---|---|---|---|---|
| **main** | `["ES2023"]` | `["node"]` | `Electron.Main` + `Electron.Common` | no DOM — `document` is `TS2584` |
| **preload** | `["ES2023","DOM"]` | `[]` | `Electron.Renderer` + `Electron.Common` | keeps the DOM; adds a hand-written sandboxed-globals declaration |
| **renderer** | `["ES2023","DOM"]` | `[]` | empty | no `electron` import resolves at all |

Two of those rows are easy to get wrong in the same direction:

- **The preload keeps `lib: ["DOM"]`.** A preload runs in the renderer process and legitimately touches
  `document`. Dropping the DOM there rejects correct preload code, which then gets "fixed" by widening
  something else.
- **The preload takes `types: []`, not `["node"]`.** A sandboxed preload gets four polyfilled globals, not
  Node ([`process-model.md`](process-model.md) § 3). `@types/node` types the whole of Node, so `fs`,
  `__dirname` and `process.exit` would all compile and fail at runtime. The four globals need a small
  hand-written ambient declaration instead; no vendor declaration for the subset exists.

For what each flag in the shared strict base *means*, read
[`../typescript/modules-tooling.md`](../typescript/modules-tooling.md). This doc owns only the split and the
per-target deltas.

## 4. Per-process `electron` module views

**What the `lib` / `types` split cannot see.** `electron.d.ts@v43.2.0` is one monolithic declaration whose
default export surface is `Electron.CrossProcessExports` — every main, preload and renderer API in one module.
No `lib` or `types` setting separates them, so under the three configs of § 3 a main unit importing
`ipcRenderer` and a renderer unit importing `app` **both compile clean** (`verified-against
node_modules/electron/electron.d.ts@v43.2.0 on 2026-07-25`). Using an Electron module in the wrong process is
the most Electron-specific boundary error there is, and § 3 alone does not detect it. That is why EL-R-02
requires a per-process **module view** and not only a per-process `lib` and `types`.

**The namespaces exist; the subpath specifier does not resolve.** The same declaration file declares
`electron/main`, `electron/renderer`, `electron/common` and `electron/utility` as ambient modules, but
`electron@43.2.0` ships no `exports` map and no `typesVersions`, so under `module: nodenext` writing
`import { app } from 'electron/main'` fails with `TS2307` — resolution goes to disk, finds nothing, and does
not fall back to the ambient declaration ([`process-model.md`](process-model.md) § 2).

**The mechanism.** Derive three views from the vendor declaration at install time and map the bare specifier
to the matching one per target. Two mechanical substitutions produce a view:

```text
1. Inside `declare module 'electron'`, replace
     export = Electron.CrossProcessExports;
   with a const of the scoped surface:
     main      -> typeof Electron.Main     & typeof Electron.Common
     preload   -> typeof Electron.Renderer & typeof Electron.Common
     renderer  -> a named empty interface

2. Strip the file's leading `/// <reference types="node" />`,
   so each target controls its own `types`.

Then, per target:
   "paths": { "electron": ["./generated/electron-<process>.d.ts"] }
```

Application code keeps the ordinary bare `import … from 'electron'` — which is what real Electron code
writes — and the views are regenerated from the vendor file on every install, so nothing is hand-maintained
and nothing drifts on an Electron bump. Under this configuration a wrong-process import is `TS2305`, which
joins `TS2584` and `TS2591` as the third guard signal. Behavior confirmed by running `tsc` against
`typescript@5.9.3`, `electron@43.2.0` and `@types/node@24.10.1` on 2026-07-25:

| Unit | Import | Result |
|---|---|---|
| main | `app`, `ipcMain`, `shell`, `nativeImage` | pass |
| main | `ipcRenderer`, `webFrame`, `contextBridge` | `TS2305` ×3 |
| preload | the six sandboxed Electron modules | pass |
| preload | `app`, `ipcMain` | `TS2305` ×2 |
| preload | `node:fs` | `TS2307` |
| renderer | any `electron` import | `TS2305` |

**A three-config set that skips this is the defeat case.** Three per-target configs that all extend a shared
base which leaves `electron` resolving to the vendor's un-scoped typings run three passes, fire the ambient
guards, and pass every wrong-process `electron` import. Three green passes are not evidence; three green
passes **with a per-target `paths` mapping** are.

## 5. `skipLibCheck: true` is required, and the comment is part of the requirement

`electron.d.ts` carries both main-process and renderer types in one file, and it references DOM types —
`HTMLElement`, `VideoFrame`, `MessagePort`, `EventListenerOrEventListenerObject` among them. Under the
**DOM-free main config** of § 3 it emits **13 errors inside Electron's own typings** before the compiler
reaches a single line of application code. `skipLibCheck: true` clears them, and the load-bearing part is
that the boundary guard survives: `document.title` in a main unit still fails `TS2584`.

So the flag is a required setting with a stated reason, not an inherited convenience — and EL-R-02 checks for
the **comment**, not only the flag. A maintainer tidying a config reads a bare `skipLibCheck: true` as a habit
carried over from another project and removes it; the main pass then breaks in a way that looks like a bug in
the application, not a bug in the config. Write the reason where the flag is:

```text
// REQUIRED, not an inherited convenience. `electron.d.ts` is one monolithic
// declaration that references DOM types. Under this DOM-free main config it
// emits ~13 errors inside Electron's own typings before reaching any app code.
// Removing this flag breaks the main pass and looks like an app bug.
"skipLibCheck": true
```

Installing `electron` as a devDependency for the type-check is cheap: `electron@43.2.0` declares no `scripts`
key, so there is no postinstall binary download — about 1.2 MB of typings (`verified-against the
electron@43.2.0 package manifest on 2026-07-25`).

## 6. The dev-vs-production renderer load path

This doc is the **single owner** of the switch, because it owns the dev server that produces the development
URL and the build output that produces the production one. [`renderer-react.md`](renderer-react.md) points
here and owns no part of it.

The renderer is loaded from two different places in the two modes, and EL-R-11 fixes how the choice is made:
**exactly one branch**, on `app.isPackaged` or an equivalent build-time constant, and **no dev-server URL
literal in the packaged artifact**.

```ts main
import { app, BrowserWindow } from 'electron';

const PACKAGED_ENTRY = 'app://bundle/index.html';

function devServerUrl(): string {
  // The variable name is the build tool's; read it from that tool's own
  // configuration docs. What matters here is that the URL arrives from the
  // environment, so no literal is compiled into the packaged bundle.
  const url = process.env['RENDERER_DEV_SERVER_URL'];
  if (url === undefined) {
    throw new Error('no dev server URL in the environment; is the dev server running?');
  }
  return url;
}

export function loadRenderer(window: BrowserWindow): void {
  if (app.isPackaged) {
    void window.loadURL(PACKAGED_ENTRY);
    return;
  }
  void window.loadURL(devServerUrl());
}
```

Two things that a "one branch" review passes and this rule does not:

- **A dead branch still ships its string.** If the development arm holds a literal such as
  `http://localhost:5173`, the branch is unreachable in the packaged build and the literal is still in the
  artifact. Grep the packaged output for the dev-server host; a hit is a failure even when the branch is
  provably dead. Reading the URL from the environment, as above, is what makes the grep come back empty.
- **A build-time inlined constant is a literal.** A bundler that substitutes an environment variable at build
  time puts the same string in the artifact. The environment read has to survive into the shipped code.

The packaged arm loads from a **custom protocol**, not `file://`; [`security.md`](security.md) owns why, and
[`renderer-react.md`](renderer-react.md) owns what a router has to do under that origin. The two modes give
the renderer two different origins, so any origin allowlist — navigation, permissions, sender validation —
has to cover both, or be built from the same constant this switch uses.

---

## References

One owner per borrowed fact: the sections above state the local consequence, and these entries name the
source that validates it.

- [electron-vite](https://electron-vite.org/) 5.0.0 — the config keys, the output directory and the dev-mode
  behavior in § 1 and § 2. **Ecosystem tier**: community-maintained by Alex Wei (`alex8088`), not an
  Electron-org project, and taken from the project's own npm registry entry and guide.
  `verified-against registry.npmjs.org/electron-vite/latest and electron-vite.org/guide on 2026-07-25`.
- `node_modules/electron/electron.d.ts@v43.2.0` — the monolithic `Electron.CrossProcessExports` surface and
  the four ambient process namespaces behind § 4. The absent `exports` map and `typesVersions`, and the
  absent `scripts` key in § 5, are read from the `electron@43.2.0` package manifest.
  `verified-against both on 2026-07-25`.
- The § 3 false-pass table and the § 4 probe table are **measured results**, run with `typescript@5.9.3`,
  `electron@43.2.0` and `@types/node@24.10.1` on 2026-07-25, not quoted from a document.
- [`process-model.md`](process-model.md) — the runtime constraints these configurations encode: the sandboxed
  preload surface, the one-file rule, and the per-process module allowlist.
- [`../typescript/modules-tooling.md`](../typescript/modules-tooling.md) — the meaning of every flag in the
  shared strict base. This doc owns only the split and the per-target deltas.
- [`SKILL.md`](SKILL.md) — EL-R-02, EL-R-11 and EL-N-08, which this doc deepens and does not restate.
