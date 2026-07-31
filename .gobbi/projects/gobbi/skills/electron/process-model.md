# Electron — Process Model

**Owns** — what runs where: the three-process map and the decision rule for placing code; the sandboxed
preload's module surface and its bundle-to-one-file consequence; the per-process ESM matrix;
`utilityProcess.fork()` as the sanctioned offload target; and which `electron` module surface each process
may import. **Owns no `webPreferences` table.**

**Split criterion** — an independently consumed lookup reference (`../skill-writing/SKILL.md`): the placement
rule and the three matrices below are consulted at a decision point — before a unit is written, or when a
review asks whether a unit sits on the right side of the line — not read narratively.

This doc **deepens, and does not restate,** SKILL.md Principle 1 (*the process is the first design decision,
and it is a trust boundary*) and rules EL-R-01 and EL-R-10. SKILL.md states each as a one-line invariant.
This doc owns what a reader needs to satisfy them: which of the three a unit belongs in, what each one can
actually reach at runtime, and what happens when a unit reaches for something its process does not have.

| Borrowed fact | Its one owner |
|---|---|
| The `webPreferences` defaults, and what the `sandbox` flag means for security | [`security.md`](security.md) |
| Compiler and module-resolution semantics — what the settings mean in TypeScript | [`typescript-compiler`](../typescript/typescript-compiler/SKILL.md) |
| How the preload bundling and the per-process module views are configured | [`tooling-config.md`](tooling-config.md) |
| The bridge's shape, its serialization tables, and sender validation | [`ipc.md`](ipc.md) |

## Contents

1. [Three processes, one placement rule](#1-three-processes-one-placement-rule)
2. [Which `electron` modules each process may import](#2-which-electron-modules-each-process-may-import)
3. [The sandboxed preload surface, and the one-file consequence](#3-the-sandboxed-preload-surface-and-the-one-file-consequence)
4. [ESM, per process](#4-esm-per-process)
5. [`utilityProcess.fork()` — the sanctioned offload target](#5-utilityprocessfork--the-sanctioned-offload-target)
6. [What `nodeIntegration: true` does to this map](#6-what-nodeintegration-true-does-to-this-map)

---

## 1. Three processes, one placement rule

Three runtimes, not three layers of one program:

| Process | Runtime | Holds | Trust |
|---|---|---|---|
| **main** | Node | the app lifecycle, windows, the filesystem, the OS, every secret | trusted — it holds the machine |
| **renderer** | Chromium, one per window | the DOM and the UI | untrusted — a browser tab an attacker may already control |
| **preload** | Chromium, alongside its renderer, before page scripts | only the bridge between the two | trusted code in an untrusted process |

A preload is not a fourth trust level. It runs **in the renderer process** — that is why it has the DOM, and
why the only thing it should contain is the bridge. Everything it exposes becomes callable by any script the
page ever loads (EL-R-07).

**The placement rule, in the order the questions have to be asked:**

1. Does the unit need the OS, the filesystem, a secret, or app state that outlives a window? → **main**.
2. Does it need the DOM? → **renderer**.
3. Is it the wiring that lets the renderer ask main for something? → **preload**, and nothing else.
4. Is it CPU-heavy or crash-prone? → a **utility process** (§ 5), not main. Main is single-threaded and its
   crash takes the app with it.

Ask these before the unit is designed, not after. The answer fixes what the unit may import, what it may
reach, and who may call it — so a unit written first and placed later has already made the decision by
accident.

Main owns the machine, so a main unit reads a path from the OS and acts on it:

```ts main
import { app, shell } from 'electron';

export async function revealLogFolder(): Promise<void> {
  await shell.openPath(app.getPath('logs'));
}
```

A renderer unit imports **no** `electron` module at all — it reaches main only through the bridge the preload
exposed:

```ts renderer
declare global {
  interface Window {
    readonly runtime: {
      ping(): Promise<number>;
    };
  }
}

export async function showLatency(target: HTMLElement): Promise<void> {
  target.textContent = String(await window.runtime.ping());
}
```

## 2. Which `electron` modules each process may import

The `electron` package exports every process's API from one module, so importing a main-process module in a
renderer unit is not an error the bare package can report. Electron's own typings do partition the surface,
into three process-scoped namespaces — read from the declaration file (`verified-against
node_modules/electron/electron.d.ts@v43.2.0 on 2026-07-25`):

| Namespace | Value exports |
|---|---|
| `Electron.Main` | `app`, `autoUpdater`, `contentTracing`, `desktopCapturer`, `dialog`, `globalShortcut`, `inAppPurchase`, `ipcMain`, `nativeTheme`, `net`, `netLog`, `powerMonitor`, `powerSaveBlocker`, `protocol`, `pushNotifications`, `safeStorage`, `screen`, `session`, `systemPreferences`, `utilityProcess`, `webContents`, `webFrameMain` |
| `Electron.Renderer` | `contextBridge`, `ipcRenderer`, `webFrame`, `webUtils` |
| `Electron.Common` | `clipboard`, `crashReporter`, `nativeImage`, `sharedTexture`, `shell` |

Read that as a per-process allowlist:

| Process | May import | May not import |
|---|---|---|
| **main** | `Electron.Main` + `Electron.Common` | anything in `Electron.Renderer` |
| **preload** | `Electron.Renderer` + `Electron.Common`, narrowed further by § 3 | anything in `Electron.Main` |
| **renderer** | nothing from `electron` | all of it |

`Electron.Renderer` + `Electron.Common` is exactly the six-module Electron surface the sandbox documentation
lists in § 3 — the typings and the sandbox doc agree.

**Do not write the namespace as an import specifier.** `electron@43.2.0` ships no `exports` map and no
`typesVersions` (`verified-against the electron@43.2.0 package manifest on 2026-07-25`), so under
`module: nodenext` a subpath import such as `import { app } from 'electron/main'` fails with `TS2307: Cannot
find module 'electron/main'` — on-disk resolution is attempted, nothing is there, and TypeScript does not
fall back to the ambient declaration. Application code keeps the bare `electron` specifier; the split is
enforced by giving each process's type-check its own view of that specifier, which
[`tooling-config.md`](tooling-config.md) owns. Under that configuration a wrong-process import is `TS2305`.

## 3. The sandboxed preload surface, and the one-file consequence

A sandboxed preload does not get Node. It gets a polyfilled `require` that reaches **nine modules**, plus four
globals (`verified-against docs/tutorial/sandbox.md@v43.2.0 on 2026-07-25`):

| Kind | Available |
|---|---|
| Electron modules (6) | `contextBridge`, `crashReporter`, `ipcRenderer`, `nativeImage`, `webFrame`, `webUtils` |
| Node modules (3) | `events`, `timers`, `url` |
| Globals (4) | `Buffer`, `process`, `clearImmediate`, `setImmediate` |

Everything else is absent at runtime. `fs`, `path` and `child_process` in a preload are a **silent failure**:
the specifier resolves at build time, the type-check is clean if the preload is checked with Node types, and
the call fails only when a user runs the app.

A preload does have the DOM, because it runs in the renderer process:

```ts preload
import { contextBridge, ipcRenderer, webUtils } from 'electron';

contextBridge.exposeInMainWorld('runtime', {
  ping: (): Promise<number> => ipcRenderer.invoke('runtime:ping'),
  pathForDroppedFile: (file: File): string => webUtils.getPathForFile(file),
});
```

**The one-file consequence.** The sandbox documentation states it directly: *"You will not be able to use
CommonJS modules to separate your preload script into multiple files."* So a preload that grows past one file
must be **bundled to a single emitted file** — that is EL-R-10, and it is a build obligation, not a style
preference. Two consequences follow that a reviewer has to check separately:

- The rule binds the **emitted bundle**, not the source import list. A preload whose own source is clean but
  which imports a helper that imports `path` produces a bundle referencing `path`. Grepping the preload source
  passes; only inspecting the bundle fails.
- The four globals have **no published type surface** for the sandboxed subset. `@types/node` types the whole
  of Node, so checking a preload against it types `fs`, `__dirname` and `process.exit` as available and lets a
  unit that fails at runtime compile clean. Typing them needs a small hand-written ambient declaration; no
  vendor `.d.ts` for the subset exists (`verified-against docs/tutorial/sandbox.md@v43.2.0 on 2026-07-25`).

## 4. ESM, per process

Electron gained ESM support in **28**. The three processes do not share one module system, and the
differences are runtime facts, not configuration choices:

| Process | Loader | ESM? | The constraint |
|---|---|---|---|
| **main** | Node's ESM loader | yes | Node's rules apply, including its own `"type": "module"` handling |
| **renderer** | Chromium's | yes | **no Node built-ins and no `node_modules`** — it is a browser, so a bundler must resolve every bare specifier |
| **preload, sandboxed** | — | **no** | a sandboxed preload cannot use ESM at all; it is emitted as a single non-ESM file |
| **preload, unsandboxed** | Node's | yes | the file must be named **`.mjs`** — *"Preload scripts will ignore `"type": "module"` fields"* |

All four rows are `verified-against docs/tutorial/esm.md@v43.2.0 on 2026-07-25`.

The renderer row is the one that surprises. A renderer is a browser page, so an ESM import of `node:fs` there
is not merely disallowed by policy — there is nothing to resolve it against. For compiler, module-resolution,
and import-specifier semantics, read
[`typescript-compiler`](../typescript/typescript-compiler/SKILL.md); this doc says only which mode each
process is in.

## 5. `utilityProcess.fork()` — the sanctioned offload target

`utilityProcess.fork()` starts a child process with a Node environment and talks to it over `MessagePort`s. It
is the sanctioned target for two different problems, and both reasons matter:

- **CPU-heavy work**, because main is single-threaded, and a busy main process stalls window creation, IPC and
  the menu;
- **crash-prone work**, because a utility process that dies takes only itself with it. Work that crashes main
  ends the application.

The second reason is the stronger one, and it is the one usually dropped. "Offload for performance" leaves an
author who has no performance problem parsing an untrusted file format on the main process.

```ts main
import { utilityProcess } from 'electron';

export function startIndexer(scriptPath: string): Electron.UtilityProcess {
  const child = utilityProcess.fork(scriptPath);
  child.on('exit', (code: number) => {
    console.error(`indexer exited with code ${code}`);
  });
  return child;
}
```

A utility process is not a place for work that needs the DOM, and it is not a renderer. It is a Node child
with a message channel — treat everything arriving over that channel the way main treats everything arriving
from a renderer ([`ipc.md`](ipc.md)).

The typings declare a fourth namespace, `Electron.Utility`, for code running **inside** a utility process.
Its membership is not reproduced in § 2's table; read it from the declaration file before importing an
`electron` module in a forked script.

## 6. What `nodeIntegration: true` does to this map

Setting `nodeIntegration: true` does not add one capability to the renderer. It collapses the map this doc
describes, in **three** places at once — Node in the renderer, context isolation off, **and** sandboxing off
for that process, *regardless of the `sandbox` setting*. The third is the one that is missed, and it is the
one that matters here: with the sandbox off, § 3's nine-module surface stops describing the preload, and the
renderer is no longer a page that has to ask main for anything.

The parent's EL-N-02 states the prohibition; [`security.md`](security.md) owns the setting, its documented
default and the checklist framing. This section owns only the process-model consequence: a renderer with Node
is not the renderer any of the placement rules above were written for.

---

## References

One owner per borrowed fact: the sections above state the local consequence, and these entries name the
source that validates it.

- `docs/tutorial/sandbox.md@v43.2.0` — the polyfilled `require` list, the four globals, and the quoted
  no-CommonJS-split sentence behind § 3. `verified-against docs/tutorial/sandbox.md@v43.2.0 on 2026-07-25`.
- `docs/tutorial/esm.md@v43.2.0` — the four ESM rows in § 4, including the `.mjs` requirement and the ignored
  `"type": "module"` field. ESM support dates from Electron 28.
- `node_modules/electron/electron.d.ts@v43.2.0` — the three process-scoped namespaces and their membership in
  § 2, read from the declaration file; the absent `exports` map and `typesVersions` are read from the
  `electron@43.2.0` package manifest. `verified-against both on 2026-07-25`.
- `docs/tutorial/security.md@v43.2.0` — the § 6 coupling rule, quoted there as *"Disabling context isolation
  … also disables process sandboxing, regardless of the default."* [`security.md`](security.md) is this
  skill's owner for it.
- [`tooling-config.md`](tooling-config.md) — the per-process `electron` module views that turn § 2's
  allowlist into a compiler error, and the preload bundling that satisfies § 3.
- [`SKILL.md`](SKILL.md) — EL-R-01, EL-R-10 and EL-N-02, which this doc deepens and does not restate.
