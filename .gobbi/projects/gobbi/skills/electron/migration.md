# Electron — Migration

**Owns** — the upgrade lookup: an opening coverage ceiling and freshness stamp; the single
removed-in-vN → use-X table that is the only home for every removal, deprecation, and rename; the
stale-training-data tells; and the behavior-claim register. This file is a lookup index, not a tutorial.

**Split criterion** — an independently consumed lookup reference
([`../skill-writing/SKILL.md`](../skill-writing/SKILL.md)): every entry below is read at the moment an API
is questioned, in any order, by grep. Nothing here is read narratively, and nothing here teaches the
replacement — the owning child does that.

This doc **deepens, and does not restate,** SKILL.md rules EL-N-05 and EL-R-14: which stale APIs exist,
which major took each one away, and where the correct pattern lives.

| Borrowed fact | Its one owner |
|---|---|
| How to write the bridge, the sender check, and the replacement transports | [`ipc.md`](ipc.md) |
| The navigation event surface, the origin comparison, the window-open handler, custom protocols | [`security.md`](security.md) |
| The window classes and what `WebContentsView` costs you | [`windows-native.md`](windows-native.md) |
| The end-to-end runner that replaced Spectron | [`testing.md`](testing.md) |
| Native-module rebuilds and the packaging-time consequences of a removal | [`packaging-distribution.md`](packaging-distribution.md) |
| The supported-majors window every qualifier below is read against | [`SKILL.md`](SKILL.md) |

## Contents

1. [Coverage ceiling and freshness stamp](#1-coverage-ceiling-and-freshness-stamp)
2. [The removal and deprecation index](#2-the-removal-and-deprecation-index)
3. [Stale-training-data tells](#3-stale-training-data-tells)
4. [The behavior-claim register](#4-the-behavior-claim-register)

---

## 1. Coverage ceiling and freshness stamp

**Ceiling: Electron 44.** This index covers removals, deprecations and behavior changes announced through
Electron **44**. It is silent above that, and it is not exhaustive below it — it carries the entries this
skill teaches against, not every line of the vendor's file.

**Stamp:** every row's major, replacement and wording is
`verified-against docs/breaking-changes.md@v43.2.0 on 2026-07-26`. The heading line number of each source
section is recorded in [References](#references), so the next rotation can re-fetch and diff rather than
re-read this file.

> **A missing row is not a clean bill of health.** This is the one failure mode the rest of the file
> cannot catch, because absence has no text to check. If you query an API and find no row here, you have
> learned nothing about whether it survived. Before concluding that an API is current, read
> `docs/breaking-changes.md` at the major you are upgrading **to** — always for a major above the ceiling,
> and whenever the API is not named below.

Rotation is two edits: raise the ceiling to the new major, and add that major's rows. The full rotation
cost across the skill is in `SKILL.md`'s Version window.

---

## 2. The removal and deprecation index

Read the row, then read the file in the last column for the pattern that replaces it. Nothing here
teaches the replacement.

**How to read the Status column.** The major named is the one whose release notes announced the change, not
the one where your app breaks. **Removed** means the API is gone on every major at or above it — code
calling it fails, and on a supported major there is nothing to configure back on. **Deprecated** means it
still works and is scheduled not to: it is a fix to make on your schedule rather than at upgrade time, and
Electron's own practice is to remove one or two majors later. **Behavior changed** is the dangerous class,
because the call still exists and still returns: nothing throws, and the defect surfaces as a guard that
never fires or a value that is quietly empty.

**44 lands 2026-08-25.** Its rows are written now, from the `(44.0)` section of the v43.2.0 document, so
this index does not ship one rotation behind. They are announcements, not history: an app on 43 is not
broken by them yet, and will be the day it moves.

| Pattern | Status | Use instead | Depth |
|---|---|---|---|
| Renderer `clipboard` module | deprecated **40**, removed **44** | `navigator.clipboard` in the renderer, or a narrow preload helper over the bridge | [`ipc.md`](ipc.md) |
| macOS 12 (Monterey) | support removed **44** | macOS 13 (Ventura) or later; older Electron majors keep running on 12 | — |
| `win32-ia32` and `linux-armv7l` prebuilt binaries | removed **44** | 64-bit targets only; `chromedriver`, `mksnapshot`, `ffmpeg` and the x86 `node.lib` are unpublished with them | [`packaging-distribution.md`](packaging-distribution.md) |
| `ELECTRON_SKIP_BINARY_DOWNLOAD`, and any other `postinstall` download tuning | no-op since **42** | delete it — the `electron` package no longer downloads itself at install | [`packaging-distribution.md`](packaging-distribution.md) |
| Unsigned macOS builds that expect notifications to appear | behavior changed **42** | sign the app; macOS notifications moved to `UNNotification`, which requires a code-signed application | [`windows-native.md`](windows-native.md) |
| Native modules built with `--std=c++17` | behavior changed **33** | build with `--std=c++20`; gcc9 or lower may need gcc10 | [`packaging-distribution.md`](packaging-distribution.md) |
| Treating `event.senderFrame` as always present and always attached | behavior changed **33** | read it synchronously, then deny on `null` **and** on `detached === true` | [`ipc.md`](ipc.md) |
| `File.path` in the renderer | removed **32** | `webUtils.getPathForFile(file)` from the preload; do not hand the full path to web content | [`process-model.md`](process-model.md) |
| `webContents.canGoBack` / `goBack` / `canGoForward` / `goForward` / `goToIndex` / `canGoToOffset` / `goToOffset` / `clearHistory` | deprecated **32** | the same names under `webContents.navigationHistory` | [`windows-native.md`](windows-native.md) |
| `BrowserView` | deprecated **30** | `WebContentsView`, and own the child `webContents` cleanup it does not do for you | [`windows-native.md`](windows-native.md) |
| Exposing `ipcRenderer` wholesale over `contextBridge` | behavior changed **29** — the renderer now receives an **empty object** | one bridge method per message, each naming its own channel literal | [`ipc.md`](ipc.md) |
| `renderer-process-crashed` on `app` | deprecated 27, removed **29** | `render-process-gone` on `app` | [`windows-native.md`](windows-native.md) |
| `crashed` on `WebContents` and `<webview>` | deprecated 27, removed **29** | `render-process-gone` on `webContents` | [`windows-native.md`](windows-native.md) |
| `gpu-process-crashed` on `app` | deprecated 27, removed **29** | `child-process-gone` on `app` | [`windows-native.md`](windows-native.md) |
| `ipcRenderer.sendTo()` | deprecated 27, removed **28** | a `MessageChannel` between the two renderers | [`ipc.md`](ipc.md) |
| `protocol.registerFileProtocol` and its `{register,intercept}{Buffer,String,Stream,File,Http}Protocol` siblings, plus `protocol.isProtocol{Registered,Intercepted}` | deprecated **25** | `protocol.handle`, which registers or intercepts and returns any response type | [`security.md`](security.md) |
| WebContents `new-window` event | removed **22** | `webContents.setWindowOpenHandler()`, defaulting to `{ action: 'deny' }` | [`security.md`](security.md) |
| `<webview>` `new-window` event | removed **22** | no direct replacement — set a window-open handler on the `webview`'s `webContents` from main and forward what you need | [`security.md`](security.md) |
| Assuming a renderer is unsandboxed | default changed **20** | renderers without `nodeIntegration: true` are sandboxed; design for the sandboxed module surface | [`process-model.md`](process-model.md) |
| `nativeWindowOpen` | deprecated 17, option removed **18** (default `true` since 15) | nothing — delete the key; `window.open` is native and `setWindowOpenHandler` governs it | [`security.md`](security.md) |
| `remote` module | deprecated 12, removed **14** | `ipcMain.handle` / `ipcRenderer.invoke`, or a `MessagePort`. The external `@electron/remote` exists and reintroduces the same trust problem | [`ipc.md`](ipc.md) |
| `enableRemoteModule` | default `false` since 10; **inert since 14** | nothing — delete the key. Setting it `true` enables a module that is gone | [`security.md`](security.md) |
| Assuming `contextIsolation` is off | default changed **12** | it is on; every renderer-reachable capability comes across the bridge | [`security.md`](security.md) |

---

## 3. Stale-training-data tells

**Why this section exists.** Every pattern in § 2 was correct Electron once. It was written into tutorials,
answers and sample repositories while it was correct, and none of that text carries an expiry date. So a
generated or copied file reproduces a 2019 idiom with 2019's confidence, and the result compiles, runs, and
is wrong on a supported major. The tells below are the shapes that betray it, before a version check does.

| Tell | What it dates the source to | Where it goes wrong today |
|---|---|---|
| `require('electron').remote`, `@electron/remote`, `enableRemoteModule: true` | pre-14 | § 2's first two rows. `remote` is the single strongest tell — it cannot work on any supported major |
| `nodeIntegration: true`, or a renderer that calls `require` | pre-20 idiom, still writable today | a triple regression — Node in the renderer, context isolation off, sandbox off — see [`security.md`](security.md) |
| `webContents.on('new-window', …)`, `nativeWindowOpen: true` | pre-22 | § 2. A window-open guard written on `new-window` never fires |
| `ipcRenderer.sendTo(…)` | pre-28 | § 2 |
| `contextBridge.exposeInMainWorld('ipc', ipcRenderer)` | pre-29 | it no longer leaks the module; it silently exposes `{}`, so the renderer fails at the call site with no error at the bridge |
| `app.on('renderer-process-crashed', …)`, `webContents.on('crashed', …)` | pre-29 | § 2. The listener is simply never called |
| `new BrowserView(…)`, `win.setBrowserView(…)` | pre-30 | § 2 |
| `protocol.registerFileProtocol('app', …)` | pre-25 | § 2, and on Windows it no longer handles file-path URLs correctly |
| `file.path` on a renderer `File` | pre-32 | § 2 — the property is `undefined`, so string interpolation yields `"undefined"` rather than throwing |
| A navigation guard on `will-navigate` **only** | never right for subframes | `will-navigate` fires for the main frame only; use `will-frame-navigate` plus `will-redirect` — [`security.md`](security.md) |
| `url.startsWith('https://example.com')` as an origin check | never right | `https://example.com.attacker.com` passes it; parse with `new URL()` and compare `.origin` — [`security.md`](security.md) |
| `spectron` in `devDependencies`, `import { Application } from 'spectron'` | pre-2022 | Spectron was deprecated on 2022-02-01 and is unmaintained; use Playwright `_electron` or WebdriverIO — [`testing.md`](testing.md) |

A sweep that finds most of them, over the application **and** the dependency tree it bundles — a dependency
using a removed API breaks at runtime while the app's own source greps clean (EL-N-05):

```text
grep -rnE "\.remote\b|enableRemoteModule|sendTo\(|'new-window'|nativeWindowOpen|registerFileProtocol|\.files\[0\]\.path|spectron" src/ node_modules/ --include='*.js' --include='*.ts'
```

Zero hits is the pass condition. A hit inside `node_modules/` is a dependency to replace or pin, not a
line to edit.

---

## 4. The behavior-claim register

**What it is for.** EL-R-14 requires every version-sensitive *behavior* claim in this skill to carry a
qualifier, and requires this register to be walked **in both directions**: every row below resolves to a
qualified claim in the file named, and every version-sensitive behavior claim in the skill has a row. The
second direction is the one that matters — a claim written into a child and never registered leaves the
forward walk passing while the claim sits unqualified in the text.

**The register is not closed.** Adding a version-sensitive behavior claim to any file in this skill
includes adding its row here, in the same change.

| Behavior claim | Qualifier | Owning file(s) |
|---|---|---|
| The three secure `webPreferences` defaults — `nodeIntegration` `false`, `contextIsolation` `true`, `sandbox` `true` | since 5.0.0 / 12.0.0 / 20.0.0 | `security.md` |
| `remote` removed | in 14 | `migration.md` |
| `enableRemoteModule` defaults to `false`, and is inert once `remote` is gone | since 10 / inert since 14 | `migration.md` |
| `nativeWindowOpen` option removed | in 18 | `migration.md` |
| WebContents and `<webview>` `new-window` events removed | in 22 | `migration.md` |
| `protocol.register*Protocol` / `intercept*Protocol` deprecated | in 25 | `migration.md` |
| ESM support added | in 28 | `process-model.md` |
| `ipcRenderer.sendTo()` removed | in 28 | `ipc.md`, `migration.md`, `SKILL.md` |
| Wholesale `ipcRenderer` exposure yields an empty object | since 29 | `ipc.md`, `migration.md`, `SKILL.md` |
| `renderer-process-crashed`, `crashed` and `gpu-process-crashed` removed | in 29 | `migration.md` |
| `BrowserView` deprecated | in 30 | `windows-native.md`, `migration.md` |
| `File.path` removed | in 32 | `migration.md` |
| `webContents` navigation methods deprecated in favor of `navigationHistory` | in 32 | `migration.md` |
| `event.senderFrame` nullable **and** detachable | since 33 | `ipc.md`, `security.md`, `migration.md` |
| Native modules require C++20 | since 33 | `packaging-distribution.md`, `migration.md` |
| Renderer `clipboard` deprecated, then removed | deprecated 40, removed 44 | `migration.md` |
| The `electron` package no longer downloads itself at install, and `ELECTRON_SKIP_BINARY_DOWNLOAD` is unsupported | since 42 | `packaging-distribution.md`, `migration.md` |
| macOS notifications require a code-signed application and report failure with a `failed` event | since 42 | `windows-native.md`, `migration.md` |
| Windows code signing requires an EV or cloud-HSM certificate | since June 2023 | `packaging-distribution.md` |
| The 44.0.0 removals — macOS 12, `win32-ia32`, `linux-armv7l`, renderer `clipboard` | lands 2026-08-25 | `migration.md` |

**One open gap, recorded rather than hidden.** The macOS-notification row's owning file states the
requirement with a `verified-against docs/api/notification.md@v43.2.0` stamp and no major qualifier; the
`since 42` above comes from this file's own source. A both-directions walk should report that row as
carrying its qualifier here and not in `windows-native.md`. Closing it is a one-line edit to that file,
outside this file's ownership.

---

## References

One owner per borrowed fact. Every § 2 row and every § 4 qualifier is read from Electron's own
`docs/breaking-changes.md` at the anchor major; the section headings are named with the line numbers they
sat at in the fetched file, as the re-fetch artifact EL-R-15 requires.

- `docs/breaking-changes.md@v43.2.0`, `verified-against that document on 2026-07-26` — `(44.0)` at line 15
  (macOS 12 at 17, 32-bit binaries at 24, renderer `clipboard` at 37); `(42.0)` at line 126 (UNNotification
  at 128, the `postinstall` removal and the `ELECTRON_SKIP_BINARY_DOWNLOAD` sentence at 144 and 184);
  `(40.0)` at line 228 (clipboard deprecation at 230); `(33.0)` at line 548 (detached `WebFrameMain` at 559,
  C++20 at 631); `(32.0)` at line 653 (`File.path` at 655, the navigation methods at 685); `(30.0)` at line
  739 (`BrowserView` at 765); `(29.0)` at line 793 (`ipcRenderer` over the bridge at 795, the three crash
  events at 808, 821 and 836); `(28.0)` at line 849 (`sendTo` at 894); `(25.0)` at line 1108 (the protocol
  methods at 1110); `(22.0)` at line 1314 (`new-window` at 1358 and 1374); `(20.0)` at line 1495 (the
  sandbox default at 1504); `(18.0)` at line 1538 (`nativeWindowOpen` at 1540); `(14.0)` at line 1641
  (`remote` at 1643); `(12.0)` at line 1862 (`contextIsolation` at 1879); `(10.0)` at line 1971
  (`enableRemoteModule` at 2024).
- <https://www.electronjs.org/blog/spectron-deprecation-notice> — § 3's Spectron row, verbatim: *"Spectron
  will be deprecated on February 1st, 2022."* `verified-against that page on 2026-07-26`. This is an
  ecosystem-tier claim: it is not in `breaking-changes.md`, because Spectron was a separate project.
- [`SKILL.md`](SKILL.md) — the supported-majors window, the verification anchor, and EL-R-14 and EL-R-15,
  which this file's register and stamps exist to satisfy.
