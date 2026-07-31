---
name: electron
description: "Use when writing or reviewing an Electron desktop application — owns the main/preload/renderer process model, the sandboxed bridge and IPC contract, the code-only security items, window lifecycle and native integration, the three-target build, and packaging."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# Electron

Operation skill for building and reviewing an Electron desktop application. It carries an ordinary
main / preload / renderer feature from first read to review, and routes to a child doc when the change
reaches a deeper fork.

Load it before writing or reviewing any Electron code — a window, a preload bridge, an IPC handler, a
security guard, the build split, a packaging step, or a version upgrade. It sits under `coding` for the
language-agnostic property and under `typescript` for the language idiom, and owns only what the
multi-process desktop runtime adds: if the advice would still hold in a plain Node + browser app, it
belongs to one of those two and not here.

---

## Principles

> **1. The process is the first design decision, and it is a trust boundary.**

Main, preload, and renderer are three runtimes with three module surfaces, not three layers of one
program. Decide which process a unit belongs to before designing the unit, because the decision fixes
what it may import, what it may reach, and who may call it. A renderer is a browser tab that an
attacker may already control; main holds the machine. Code placed on the wrong side of that line is
not a style defect, it is a privilege grant.

> **2. The dangerous mistakes are silent.**

Electron's characteristic failures produce code that exists, compiles, and runs: a guard on the wrong
event, a handler that fails open on a null sender, a bridge that widened by one line. Nothing throws
and nothing logs. So evidence of *presence* is never evidence of *correctness*, and every check in this
skill is written to reject a wrong-but-conformant implementation, not an absent one.

> **3. Everything crossing into main is untrusted input.**

The renderer sends the message, but a compromised or navigated frame sends it too. Prove the sender
before the payload: read the sender frame synchronously, reject when it cannot be proven, then narrow
the payload at runtime. TypeScript erases, so a channel's type annotation validates nothing at the
moment the message arrives.

> **4. The secure defaults are the posture; changing one is a decision that needs a reason.**

Context isolation on, sandbox on, Node integration off — these carry most of the security property for
free, and the failure mode is an author quietly setting one key to get something working. Treat every
key present in a `webPreferences` object as a claim that needs justification against its documented
default, not just the keys a summary table happens to list.

> **5. The bridge is the application's public API, and its width is its attack surface.**

Whatever `contextBridge` exposes is callable by any script the renderer ever runs. Design it as an
explicit contract — one method per message, arguments written out, nothing derived from the internal
event handed back — and treat every widening as an API change that needs review, not as plumbing.

> **6. A green type-check must mean the process boundary held.**

One combined `tsconfig` certifies exactly the cross-process violations this skill exists to prevent: a
main module importing `ipcRenderer` compiles clean when every process shares one `lib`, one `types`,
and one `electron` module view. Verification is per process or it is not verification.

> **7. Electron facts expire; anchor every one of them.**

A major ships every eight weeks and only three are supported at a time, so "current" is a word with a
two-month shelf life. Carry a version qualifier on every behavior claim and a verification stamp on
every claim about what a document says or what does not exist, and teach a supported-majors window
rather than a pinned version.

> **8. Development and production are different runtimes — prove the property on the shipped artifact.**

Renderer security warnings fire only in unpackaged builds, fuses are flipped only at packaging time,
deep links arrive only in a packaged app, and the renderer's origin changes with the load path. A
property demonstrated in `bun run dev` has been demonstrated in the one runtime nobody ships.

---

## Rules

These Rules are the floor for every Electron change. Apply them to new and changed code; they are not a
mandate to rewrite an existing application in one pass.

### How every rule's check is written

Every hard rule below states three things:

1. the **observable evidence** — what a reviewer or a command looks at;
2. the **pass condition** — what that evidence must show;
3. the **defeater** — one concrete *wrong-but-conformant* result the check must reject.

A check with no defeater is a description, not a check.

**The strength bar.** A defeater counts only when all three hold:

- it is a result a **reasonable, complete-looking implementation could actually produce** — not a
  contrived one and not an obviously broken one;
- it is **conformant** with the check *as written*, or with the naive check a careful
  implementer would plausibly substitute for it. When the defeater reads against a naive check rather
  than the written one, it says so;
- it is **not the negation of the pass condition**, and not a case the check text already names.
  "Check: X is present. Defeater: X is absent" carries no discriminating power and is banned.

If the only candidate defeater you can find is the defect the check was written to fix, that is the
signal to look harder — not to write it down. Where a defeater genuinely cannot be written, state the
**residue** instead: what the check cannot see, and who must look at it. A stated residue is honest; a
silent one is the defect.

This bar is a rule and not a style note because of Principle 2. A check that asks whether a guard
*exists* asks a question every silent failure answers "yes", and the three-part form alone can be
satisfied by restatement.

### Must-Follow

- **EL-R-01 — MUST declare the process of every module and every taught example.** Main, preload, or
  renderer, stated before the code is written. *Check:* every source file and every fenced `ts` block
  carries a process word, and the build type-checks it in that process's pass, under that process's
  `lib`, `types`, **and `electron` module view**. *Defeater:* a `main`-tagged unit containing
  `import { ipcRenderer } from 'electron'` — against the naive check, a per-process `lib`/`types` split
  alone, this compiles clean; only the per-process module view rejects it. *Residue:* a block that
  touches neither an ambient global nor the `electron` module cannot be discriminated by the compiler;
  a reviewer confirms its tag against the module's role. Depth: [`process-model.md`](process-model.md).
- **EL-R-02 — MUST type-check each process target separately, with its own `lib`, `types`, `electron`
  module view, and `skipLibCheck: true`.** Main gets Node types and no DOM; renderer gets DOM and no
  Node types; preload gets DOM without Node types. *Check:* the build runs one `tsc` pass per declared
  target; each config sets `skipLibCheck: true` with a comment stating the reason, and maps `electron`
  to its own generated view; correct process-local `import type` fixtures compile; and the guard signals
  `TS2584`, `TS2591` and `TS2305` are each observed at least once from a deliberate fixture. *Defeater:*
  a three-config set that passes all three targets while every config leaves `electron` resolving to the
  vendor's un-scoped typings — the ambient guards fire, the module boundary is unchecked, and the run
  looks green. A second generated view exports a `const` typed as `typeof Electron.Main`: wrong-process
  values still fail, but the namespace's type side is gone and correct `import type` statements also raise
  `TS2305`. Depth:
  [`tooling-config.md`](tooling-config.md).
- **EL-R-03 — MUST leave every secure `webPreferences` default at its default.** The closed property:
  **no `webPreferences` key is set to a value less safe than its documented default.** *Check:* at every
  `BrowserWindow` / `BaseWindow` / `webContents` construction site, diff **every key present** in the
  `webPreferences` object against `api/structures/web-preferences.md`, which documents all 44 options —
  not against the security tutorial, which carries no defaults table, and not against a twelve-row
  summary. *Defeater:* `enableBlinkFeatures: 'CSSVariables'` — it is checklist item 10, it sits outside
  the twelve most-cited keys, and it passes any check scoped to that twelve while violating this rule.
  *Residue:* the diff needs each key's documented default; twelve are summarized in `security.md` and
  the other 32 must be read from the structures doc at review time. Depth:
  [`security.md`](security.md).
- **EL-R-04 — MUST write all nine code-only security items so that each denies by default, and scope
  every origin-sensitive one to the requesting origin.** The nine: permission request **and** check
  handlers, `webview` guard, navigation allowlist, window-open handler, `openExternal` allowlist, sender
  validation, custom protocol over `file://`, fuses, and a narrow bridge surface. *Check:* for each of
  the nine, the guard's default branch denies and is reachable, and a test drives one disallowed input
  through it and observes the denial; **and for the origin-sensitive items — 5, 13, 14, 15, 17 — a
  second test drives an *allowed* input from a *disallowed origin* and observes the denial.** *Defeater:*
  `setPermissionRequestHandler((wc, permission, cb) => cb(ALLOWED.has(permission)))` with
  `ALLOWED = new Set(['notifications','media'])`, registered together with its check-handler twin. Its
  default branch denies, it is reachable, a disallowed-permission test observes the denial — and it
  grants microphone and camera to **any** origin in that session. The existence of a named guard module
  is never evidence for this rule. *`DERIVED` — the permission **pair**:* the request handler and the
  check handler must both be registered, derived from the two handlers being separate documented entry
  points to the same capability, so registering one leaves the other at its default path. Depth:
  [`security.md`](security.md).
- **EL-R-05 — MUST attach the navigation guard to the event that covers the frames at risk, and decide
  from a parsed URL identity against a closed allowlist, denying on parse failure.** *Check:* the guard
  is registered on **`will-frame-navigate`**, and on `will-redirect` for redirect coverage; it parses
  with `new URL(...)`; it compares `.origin` against a literal allowlist for tuple-origin schemes such
  as `https:`, or compares a literal `.protocol` + `.host` pair for an explicitly allowed non-special
  custom scheme; and its parse-failure path **denies**. It never allowlists the serialized opaque-origin
  sentinel `"null"`. *Defeater:* a flawless `.origin` allowlist attached to **`will-navigate` alone** —
  `will-navigate` fires for the main frame only, so every subframe navigation is admitted, and this is
  the shape of the vendor's own item-13 sample. A second:
  `try { return ALLOW.has(new URL(u).origin) } catch { return true }` — it parses with `new URL`,
  compares `.origin` against a literal allowlist, and returns *allow* for every malformed or relative
  URL. A third derives an allowlist from `new URL('app://bundle/index.html').origin`: the value is
  `"null"`, so the resulting set also admits opaque-origin `file:`, `data:`, and `about:` URLs. *Residue:*
  neither event emits for programmatic navigation (`webContents.loadURL`, `back`) or for in-page
  navigation; that hole is not closable by event choice, so the paired obligation is that main-process
  code never passes an untrusted URL to `loadURL` / `loadFile`. *`DERIVED` — preserve scheme and
  authority:* the docs prescribe `origin` for navigation while the item-17 sender sample compares
  `.host`; `.host` drops the scheme and the port, so an `http://` peer passes it. A tuple `.origin`
  preserves those fields for special schemes. A non-special custom scheme has an opaque origin instead,
  so its safe equivalent is an exact `.protocol` + `.host` pair, never `"null"`. Depth:
  [`security.md`](security.md).
- **EL-R-06 — MUST default `setWindowOpenHandler` to `{ action: 'deny' }`, on every `webContents` that
  can open a window.** *Check:* the handler's fall-through branch denies, a test opens a non-allowlisted
  URL and observes the denial, **and every `webContents` the app creates — including child windows and
  `WebContentsView`s created after startup — has a handler registered.** *Defeater:* a correct
  deny-by-default handler registered once on the first `BrowserWindow`'s `webContents`, in an app that
  later creates a second window; the second window has no handler and opens anything, and the
  single-window test passes. Depth: [`security.md`](security.md).
- **EL-R-07 — MUST expose one bridge method per IPC message, with an explicit argument list.** *Check:*
  every exposed function names its own channel as a **literal in its own body**, and the exposed key set
  is written out, not computed. *Defeater:* a bridge built by iterating a channel manifest —
  `for (const c of CHANNELS) api[c.name] = (...a) => ipcRenderer.invoke(c.channel, ...a)`. Every
  generated function does close over a channel literal and no key takes a channel name as a parameter,
  so it satisfies a check read as "one method per message"; but the exposed surface is whatever the
  manifest holds, and adding a channel silently widens the bridge with no review. The older shape
  `open: (name) => ipcRenderer.invoke(CHANNELS[name])` is the naive-check version of the same defect.
  Depth: [`ipc.md`](ipc.md).
- **EL-R-08 — MUST wrap every listener callback so nothing derived from the internal `event` reaches the
  renderer.** The correct form is `(cb) => ipcRenderer.on('ch', (_e, ...a) => cb(...a))`. *Check:* no
  exposed callback receives the event or any value read from it. *Defeater:* against the naive check —
  "no exposed listener forwards its first parameter" —
  `(cb) => ipcRenderer.on('ch', (e, ...a) => cb(e.senderFrame, ...a))` forwards no first parameter and
  still hands the renderer a `WebFrameMain`. Depth: [`ipc.md`](ipc.md).
- **EL-R-09 — MUST reject the message whenever the sender cannot be proven, and validate every payload
  at runtime on the main side.** In every `ipcMain.handle` / `.on` body, in this order: (a) read
  `event.senderFrame` **synchronously, before the first `await`**; (b) **reject when it is `null`**;
  (c) **reject when `detached === true`**; (d) reject when its parsed `origin` is not in the allowlist;
  (e) narrow the payload at runtime before use; (f) the rejection path **returns without performing the
  action** — it does not throw past the handler and does not fall through. *Check — two conjuncts, both
  required.* **Static:** in every handler, every `event.senderFrame` read is lexically before the first
  `await`. **Behavioral:** drive four inputs through each handler — a null frame, a frame with
  `detached === true`, an off-allowlist origin, and a malformed payload — and observe that the action is
  not performed in any of the four. *Defeater — one per conjunct.* For the static conjunct: a handler
  that reads `senderFrame` inside a `.then()` callback or after an `await` in a `try` block; the
  behavioral check alone passes it, because producing the null outcome requires a real cross-origin
  navigation between the send and the read, which a test does not stage. For the behavioral conjunct:
  `if (e.senderFrame && !validateSender(e.senderFrame)) return null` — it fails open on null, and any
  guard that only null-checks accepts a detached frame. The vendor's item-17 sample copied verbatim
  fails both ways: it throws on null and it accepts detached. *`DERIVED` — deny on `detached`:* a
  detached frame is non-null and its `.url` still reads as the pre-navigation origin, so it passes both
  a null check and an origin allowlist; denying it follows from that observable pair, not from a vendor
  sentence. *`DERIVED` — runtime payload validation:* it follows from checklist item 17 combined with
  TypeScript's erasure at runtime — a channel's parameter types are gone when the message arrives — and
  no single vendor sentence states it. Depth: [`ipc.md`](ipc.md); the seam that produces a null and a
  detached frame is owned by [`testing.md`](testing.md).
- **EL-R-10 — MUST bundle the preload to a single file and keep the emitted bundle inside the sandboxed
  module surface.** *Check:* the preload build emits one file, and **the emitted bundle** — not the
  source import list — references nothing outside `contextBridge`, `crashReporter`, `ipcRenderer`,
  `nativeImage`, `webFrame`, `webUtils`, the Node `events` / `timers` / `url` modules, and the `Buffer`,
  `process`, `clearImmediate` and `setImmediate` globals. *Defeater:* a helper module that imports
  `path` — the preload's own source is clean, so a grep of the preload passes and only the bundle
  inspection fails. Depth: [`process-model.md`](process-model.md).
- **EL-R-11 — MUST switch the renderer load path explicitly between development and production, from one
  branch that is provably dead in the packaged build.** *Check:* exactly one branch decides the load
  path, it branches on `app.isPackaged` or an equivalent build-time constant, **and the packaged artifact
  contains no dev-server URL literal**. *Defeater:* a single, correct `app.isPackaged` branch whose
  development arm still ships a `http://localhost:5173` literal into the package — the branch is dead but
  the string is present, and a reviewer checking "exactly one branch" sees nothing wrong. Depth:
  [`tooling-config.md`](tooling-config.md), the single owner of the load path.
- **EL-R-12 — MUST flip the production fuse posture at packaging time, before code signing, and enable
  `embeddedAsarIntegrityValidation` together with `onlyLoadAppFromAsar`.** *Check:* run
  `npx @electron/fuses read --app <path>` **on the signed, shipped artifact for every platform and
  architecture that ships**, and compare each fuse in the intended posture against the read output,
  treating a posture entry the read does not report as a **failure**, not as a match. *Defeater:* a green
  posture check run against the x64 build while the arm64 build ships unflipped — one artifact was read,
  the shipped set was not. A second: scoring the comparison over the fuses the tool happened to report,
  so a posture entry missing from the output is silently counted as satisfied. Depth: the posture is
  owned by [`security.md`](security.md), the flip and its verification by
  [`packaging-distribution.md`](packaging-distribution.md).
- **EL-R-13 — MUST register `open-url` / `open-file` during initial module evaluation, before
  `app.whenReady()` is awaited, and take `requestSingleInstanceLock()` before handling a deep link.**
  *Check:* the listener is attached during the first synchronous evaluation of the entry module, and the
  lock call precedes any URL handling. *Defeater:* the registration written at the top level of a module
  that is itself loaded by a dynamic `import()` inside `whenReady()` — the listener is textually at
  module top level and it still attaches after ready. Against the naive check, "outside `whenReady()`", a
  registration inside a helper function called after ready passes the same way. Depth:
  [`windows-native.md`](windows-native.md).

### Must-Not-Follow

- **EL-N-01 — NEVER treat a clean dev console as an acceptance signal.** Renderer security warnings cover
  only checklist items 1, 2, 6, 7, 8, 9, 10 and 11, fire only in unpackaged dev builds, and are disjoint
  from the nine code-only items. *Check:* the security evidence for a change names the nine individually,
  each with its own result. *Defeater:* a review record that lists all nine and marks every one "not
  applicable to this change" with no reason given — the list is present and the property is unexamined.
  *Fix:* run the nine as an explicit review pass and record why any one is genuinely out of the change's
  reach.
- **EL-N-02 — NEVER set `nodeIntegration: true`.** It is a **triple** regression — Node in the renderer,
  context isolation off, **and** sandbox off, regardless of the `sandbox` setting. *Check:* EL-R-03's
  key-by-key diff over all 44 options. *Defeater:* `nodeIntegration: false` with
  `nodeIntegrationInWorker: true` — the named prohibition is honored, a grep for `nodeIntegration: true`
  finds nothing, and Node is back in a worker. *Fix:* move the capability behind a bridge method.
- **EL-N-03 — NEVER expose `ipcRenderer`, a `send` / `invoke` passthrough, or a channel-parameterized
  generic across the bridge.** Wholesale exposure has silently yielded an empty object since Electron 29.
  *Check:* EL-R-07's channel-literal test over every exposed key, applied to the object actually passed to
  `exposeInMainWorld`. *Defeater:* a façade assembled with
  `Object.assign({}, pick(ipcRenderer, ['invoke','send']))` — no exposed key is literally named
  `ipcRenderer`, and a grep for that identifier in the exposed object finds nothing. *Fix:* EL-R-07.
- **EL-N-04 — NEVER assume one serialization table.** IPC uses Structured Clone and **functions cannot
  cross it**; `contextBridge` uses a wider, different table where functions do cross but prototypes are
  dropped and `Symbol` fails. *Check:* every value crossing a boundary is checked against the table for
  **that** direction. *Defeater:* a callback that legally crosses the bridge, then passed by the renderer
  as part of an `invoke` payload — the same value, legal in one direction and silently dropped in the
  other. *Fix:* read the direction's own table in [`ipc.md`](ipc.md).
- **EL-N-05 — NEVER use `remote`, `enableRemoteModule`, or `ipcRenderer.sendTo()`.** Removed in 14, a dead
  option, and removed in 28. Their presence is a reliable tell for stale training data. *Check:* grep the
  application **and its bundled dependency tree** for `remote`, `enableRemoteModule` and `sendTo(`; expect
  zero. *Defeater:* a dependency that uses the removed API internally — the application's own source is
  clean, the grep passes, and the app breaks at runtime on a supported Electron. *Fix:* `ipcMain.handle` /
  `invoke`, or a `MessagePort`; replace or pin the dependency.
- **EL-N-06 — NEVER treat ASAR as a security or secret boundary.** `original-fs` reads straight through it
  and its `fs.stat` results are generated by guessing. *Check:* no credential or secret is recoverable
  from the shipped app, packed or unpacked, **or from anything the app writes at runtime**. *Defeater:* a
  token fetched on first run and cached in plaintext under `app.getPath('userData')` — the bundle
  contains no secret literal, a bundle-scoped check passes, and the exposure is identical. *Fix:* keep
  secrets out of the bundle; use `safeStorage`, checking its backend.
- **EL-N-07 — NEVER fix a native-module ABI mismatch by changing the Node version.** *Check:* the fix
  names `@electron/rebuild` or an N-API module, and the artifact is rebuilt against Electron's ABI, not
  the system Node's. *Defeater:* `npm rebuild` run on the developer's machine — it names no Node-version
  change, it succeeds locally against system Node, and it produces a binary that fails only on the user's
  machine. *Fix:* `@electron/rebuild`, or choose an N-API module.
- **EL-N-08 — NEVER type-check the whole application under one combined tsconfig.** It certifies exactly
  the process-boundary violations this skill exists to prevent. *Check:* EL-R-02's per-target pass count
  and per-target module view, observed in the command CI actually runs. *Defeater:* three per-target
  configs that all `extend` a shared base which resolves `electron` to the vendor's un-scoped typings —
  three passes run, the ambient guards fire, and every wrong-process `electron` import compiles. *Fix:*
  EL-R-02 plus the per-process module views in [`tooling-config.md`](tooling-config.md).

### Judgment defaults

Soft rules. Each states the default, the condition that overrides it, and the check that its caveat
survived into the text.

- **Prefer `BrowserWindow` for a single full-size web view.** Reach for `BaseWindow` + `WebContentsView`
  only when several web views must be composed — and then own the child-`webContents` cleanup, because
  closing the window does not do it. *Check:* the text states `BrowserWindow` is **not** deprecated and
  cites `api/base-window.md`; the `BaseWindow` branch states the manual-cleanup obligation. *Defeater:*
  against the naive check — "the file recommends `BrowserWindow`" — a paragraph that recommends it *and*
  describes `BaseWindow` as "the newer API", leaving the reader believing `BrowserWindow` is legacy.
- **Prefer `invoke` / `handle` for request-response, `send` / `on` for one-way, `MessagePort` for a
  high-volume or peer channel.** *Check:* each of the four transports names its selection condition, and
  `sendSync` carries the vendor's *"avoid this API for performance reasons"* quote **with the avoid
  verdict attached**. *Defeater:* a paragraph that lists all four with conditions and mentions `sendSync`
  neutrally as "the synchronous option" — every named element is present, and the reader takes it as a
  fourth valid choice.
- **Prefer `utilityProcess.fork()` for CPU-heavy or crash-prone work.** *Check:* it is named as the
  sanctioned offload target **and the selecting condition names both CPU-heavy and crash-prone work**.
  *Defeater:* "prefer `utilityProcess.fork()` for performance" — a condition is stated, so a check reading
  "states its condition" passes, and the crash-isolation reason, which is the stronger one, is lost.
- **Prefer a custom protocol over `file://` for the packaged renderer.** *Check:* the recommendation cites
  checklist item 18 and states the origin problem it removes, **and says what the development path does
  differently**. *Defeater:* a correct, well-cited paragraph about the packaged path that never mentions
  development, leaving an author to serve the dev build over `file://` and meet a different origin surface
  in each mode.
- **Prefer Electron Forge as the default packaging path** — Electron's own tutorial uses it exclusively.
  *Check:* the text names Forge as the tutorial's path **and contains no claim that electron-builder is
  inferior, unsupported, or unofficial**. *Defeater:* "Forge is the official / recommended packager" — no
  page declares it recommended over electron-builder by name, and the code-signing page lists
  electron-builder among several tools.
- **Prefer electron-vite for a Vite-based three-target build.** *Check:* the sentence recommending it names
  `alex8088` and "community-maintained, not an Electron-org project" **in the same paragraph, attached to
  electron-vite**. *Defeater:* a paragraph recommending electron-vite that carries the
  community-maintenance caveat attached to *Vite* — every required word is present in the same paragraph,
  and the reader concludes electron-vite is first-party.
- **Prefer Playwright `_electron` for end-to-end tests.** *Check:* the recommending paragraph states that
  **Electron support specifically** is experimental, that the API is underscore-prefixed, and that
  stability is not guaranteed. *Defeater:* "Playwright is a mature tool; some newer APIs are experimental"
  — hedging is present, the subject is wrong, and the underscore prefix reads as a naming quirk rather
  than a stability signal.
- **Prefer N-API native modules over ABI-pinned ones.** *Check:* the preference states the upgrade cost it
  avoids — a rebuild on every Electron major. *Defeater:* "prefer N-API modules; they are smaller and
  faster" — a rationale is present, it is not the real one, and a reader trading it away for a faster
  ABI-pinned module inherits the rebuild treadmill.

### Rules for this skill's maintainer

These three bind whoever maintains `skills/electron/`, not the application author.

- **EL-R-14 (maintainer) — MUST state the Electron major each version-sensitive *behavior* claim was
  verified against, and list every such claim in the behavior-claim register.** A "since N", a "removed in
  N", or an explicit window. *Check:* grep the skill for `currently`, `latest version`, `the current` and
  `at present`; expect zero outside this rule's own token list. Then walk the **behavior-claim register** in [`migration.md`](migration.md)
  in both directions: every register entry's claim carries its qualifier in the file named, **and every
  version-sensitive behavior claim in the skill appears in the register.** *Defeater:* a behavior claim
  written into a child and never added to the register — a one-directional walk passes, every entry checks
  out, and the unregistered claim sits unqualified in the text, which is exactly how a register degrades
  into decoration.
- **EL-R-15 (maintainer) — MUST stamp every doc-state and absence claim, and the version window's own
  freshness, `verified-against <doc>@vN on <YYYY-MM-DD>`, and re-verify each at rotation with a fetch
  artifact.** This is the class EL-R-14 cannot police: a claim about what a document *says*, or about what
  does *not* exist, carries no "since N" and can stop being true without any text in the skill changing.
  The version window's rotation date is inside this rule's scope, so a rotation date in the past is a
  review failure here. *Check:* every such claim carries the stamp, **and each rotation entry carries a
  re-fetch artifact — the quoted sentence with its current line number in the re-fetched source.**
  *Defeater:* a rotation record naming all the sources with today's date and no quoted line; a
  self-reported "I re-fetched these" and an actual fetch produce the same observable, so the record alone
  cannot distinguish them, and the quoted line with its line number cannot be produced without the fetch.
- **EL-R-16 (maintainer) — MUST classify every fence in `skills/electron/` and verify every eligible code
  fence with `examples/electron/`.** Eligible code fences are `ts`, which the extractor places in a
  process-scoped compilation unit, and `tsx uncompiled`, which is counted but not compiled because the
  harness has no JSX runtime. Allowlisted non-code fences are counted separately. *Check:* a run of
  `examples/electron/run-examples.sh` over the skill directory exits 0 and reports both equalities:
  **compiled/extracted `ts` fences + counted `tsx uncompiled` fences = eligible code fences**, and
  **eligible code fences + allowlisted non-code fences = all fences**. *Defeater:* a skill whose examples
  are written in `js` fences — the vendor documentation this skill is built from writes its samples that
  way, so an author transcribing them writes `js`, and a lenient extractor discards every non-`ts` fence
  silently while three token `ts` blocks keep the count non-zero and the run green. The extractor makes an
  unsupported fence language a hard error for that reason; the two equalities make the loss visible.

---

## Procedure

**Load `principles/SKILL.md`, `coding/SKILL.md` and `typescript/SKILL.md` first** and keep them in
context — this Procedure operationalizes them for Electron; it does not restate them.

Run P1–P8 in **author mode**. In **review mode**, run P1–P4 read-only to reconstruct and grade the
existing design, skip P5–P6, and grade read-only at P7–P8, editing nothing unless the user authorizes a
fix. **P2 is the router** for depth this floor does not carry. These steps plus the Rules above are the
floor for an ordinary single-window feature.

### P1 — Study and lock the task, the process map, and the version window

*Deepens principles 1 and 4 and coding P1 — study first, refine the task.*

Lock What / Why / How, in and out of scope, and success with the user, or cite a scope contract. Read the
relevant specs, project rules, applicable mistakes, neighboring modules, callers and tests. Then read the
concrete **Electron contract**: which Electron major the app runs and whether it is inside the supported
window in References; the three-target build and which `tsconfig` governs each; the `webPreferences`
in force at every window construction site; the existing preload bridge surface and channel list;
the load path in each mode; the fuse posture if the app packages today. Record which process each affected
unit runs in, and which of those units sit on a trust boundary. **Declare author or review mode.** For an
edit, map the affected set — the other two processes included — with CRUD and 5W1H. For a bug, reproduce
first, then trace to the root.

**P1 is complete when** scope and success are explicit, the process of every affected unit is recorded,
the Electron major is checked against the version window, and the affected set or the reproduced root is
written down.

### P2 — Route to the child docs for the forks in play

*Deepens coding P1 — study the prior art the decision needs.*

Read the child **before** the decision it governs, and re-run routing when the design changes. An ordinary
single-window feature needs no child to be valid — the Rules above are the floor.

| Read | When the change involves |
|---|---|
| [`process-model.md`](process-model.md) | deciding what runs where, adding or changing a preload, an ESM decision in any process, which `electron` modules a process may import, or offloading work to a utility process |
| [`security.md`](security.md) | `webPreferences`, permissions, navigation or redirect guards, window-open, `openExternal`, `webview`, a custom protocol, a session partition, the fuse posture, or any security review |
| [`ipc.md`](ipc.md) | a new channel, a bridge method, a payload shape, a serialization question, sender validation, or a typed channel contract |
| [`windows-native.md`](windows-native.md) | window construction or lifecycle, a native dialog, tray, menus, global shortcuts, notifications, `shell.openPath` / `showItemInFolder`, `safeStorage`, `crashReporter` or the log path, deep links, single-instance behavior, or a platform delta |
| [`renderer-react.md`](renderer-react.md) | mounting React, routing under the packaged origin, or moving IPC data into React state |
| [`tooling-config.md`](tooling-config.md) | the build tool, the project layout, the tsconfig split, the per-process `electron` module views, path aliases, the dev server, or the dev-vs-production renderer load path |
| [`packaging-distribution.md`](packaging-distribution.md) | packaging, ASAR or integrity, signing, notarization, auto-update, or a native module |
| [`testing.md`](testing.md) | any behavior change, an end-to-end test, a main-process unit test, an IPC contract test, or an adversarial security test |
| [`migration.md`](migration.md) | an Electron major upgrade, or an API that may have been removed or renamed |
| [`scenarios.md`](scenarios.md) / [`checklists.md`](checklists.md) | self-review before handoff at P8 — the probes and the binary `EL-CHECK-*` items |
| [`evaluation.md`](evaluation.md) | grading the Electron idiom of a change-set; it routes the evaluator to the scenarios, checks and verifications |

**Design note 1 — the `security.md` / `ipc.md` seam.** They overlap on checklist items 17 and 20.
`security.md` owns the *checklist framing* — that the item exists, that it is code-only, that no warning
fires — and the *event surface*; `ipc.md` owns the *implementation depth*, how the sender check and the
bridge surface are written. Neither restates the other.

**Design note 2 — the load-path seam.** `tooling-config.md` is the **single owner** of the
dev-vs-production renderer load path, because it owns the dev server that produces the development URL and
the build output that produces the production one. `renderer-react.md` owns only what React must do under
the packaged origin and points at `tooling-config.md` for the switch. EL-R-11 lives here; its depth lives
in `tooling-config.md` and nowhere else.

**Design note 3 — the fuses seam.** `security.md` owns the fuse *posture* and why each fuse matters;
`packaging-distribution.md` owns *when and how* the posture is flipped and verified.

**P2 is complete when** every active fork has been read before its decision, and the pre-handoff or
evaluation path includes the triad routing above.

### P3 — Design the process placement, the bridge, and the window

*Deepens principles 3 and coding P2 / P3 — design the contract and the seams before any body.*

Design in this order, because each decision constrains the next:

1. **Place the code.** For every new unit, name its process and the reason. Work that needs the OS or a
   secret goes to main; work that needs the DOM goes to the renderer; the preload holds only the bridge.
   CPU-heavy or crash-prone work goes to a utility process, not to main.
2. **Design the bridge contract.** Name each channel, its direction, its transport, and its payload type
   on both sides — one exposed method per message, arguments written out. This is the API surface, so it
   gets the same care as a public library signature.
3. **Design the trust checks with the contract, not after it.** For each channel, state who may call it,
   which origin is allowed, and what the rejection path returns.
4. **Design the window and its session.** Window class, `webPreferences` (defaults unless a key is
   justified), partition, permission posture, and the load path in each mode.
5. **Keep one credible alternative** for the P4 gate — usually a different process placement or a
   different transport.

**P3 is complete when** every unit has a declared process, every channel has a two-sided typed contract
with its trust check, the window and session posture are decided, and no behavior body exists.

### P4 — Confirm the design with the user

*Deepens principles 3 — design with the user, from references.*

Run the design gate on the Electron **design packet**: the process placement map, the channel list with
payload types and trust checks, the bridge surface, the window and session posture, the load-path switch,
and the P3 alternative. A widened bridge surface and any `webPreferences` deviation are user decisions,
not implementation judgment. Record approval, or cite an already-explicit decision. **Author mode only:**
in review mode, reconstruct and grade the existing packet without editing.

**P4 is complete when** the author-mode packet is approved or a prior decision is cited, or the
review-mode packet is reconstructed and graded.

### P5 — Build the three-target skeleton first

*Deepens principles 2 and coding P7 — build bottom-up, skeleton first.*

Materialize the approved design before any behavior: the three tsconfig targets with their own `lib`,
`types` and `electron` module view; the entry module with its lifecycle listeners registered at initial
evaluation; the preload with its exposed keys stubbed; the renderer mount; and the shared channel type
declarations both sides import. Verify all three passes type-check green with no behavior implemented. A
structural defect returns through P2–P4 rather than hiding in a body.

**P5 is complete when** the three targets each type-check green, the skeleton matches the approved packet,
and no behavior is implemented.

### P6 — Grow in minimal verified slices

*Deepens coding P7 and P8 — grow verified, move the whole affected set.*

Grow one channel or one feature at a time, main side first, and verify each slice before the next: the
handler with its sender and payload checks, then the bridge method, then the renderer call. Apply the
Rules floor and the active child guidance as you write. Move every affected surface in the same slice —
the channel type declarations, the tests, and the docs. Add nothing beyond the contract and leave no
placeholder on an in-scope path.

The two shapes this floor is built around — the handler that proves its sender before it acts, and the
one bridge method that reaches it:

```ts main
import { ipcMain } from 'electron';

declare function readProjectFile(name: string): Promise<string>;

const ALLOWED_APP_AUTHORITIES = [
  { protocol: 'app:', host: 'bundle' },
] as const;

function senderIsTrusted(frame: Electron.WebFrameMain | null): frame is Electron.WebFrameMain {
  if (frame === null || frame.detached) {
    return false;
  }
  try {
    const parsed = new URL(frame.url);
    // `app:` is non-special, so `parsed.origin` is the opaque-origin sentinel
    // "null". Never put that sentinel in an allowlist: file:, data:, and
    // about: URLs serialize to the same value.
    return ALLOWED_APP_AUTHORITIES.some(
      (allowed) => parsed.protocol === allowed.protocol && parsed.host === allowed.host,
    );
  } catch {
    return false;
  }
}

ipcMain.handle('file:read', async (event, payload: unknown): Promise<string | null> => {
  const frame = event.senderFrame;
  if (!senderIsTrusted(frame)) {
    return null;
  }
  if (typeof payload !== 'string') {
    return null;
  }
  return await readProjectFile(payload);
});
```

`senderFrame` is read before the first `await`; `null` and `detached` both deny; the payload is narrowed
at runtime because the annotation is gone by then; and every rejection returns without performing the
action (EL-R-09). The bridge side names its channel as a literal, writes its arguments out, and hands the
renderer nothing derived from the internal event (EL-R-07, EL-R-08):

```ts preload
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('files', {
  read: (name: string): Promise<string | null> => ipcRenderer.invoke('file:read', name),
  onChanged: (listener: (name: string) => void): void => {
    ipcRenderer.on('file:changed', (_event, name: string) => listener(name));
  },
});
```

**P6 is complete when** every in-scope path is implemented with no placeholder, each slice had fresh
evidence before the next, and every affected surface moved with it.

### P7 — Verify the whole change, per process and on the packaged artifact

*Deepens coding P6 and principles 8 — design for verification, prove the property.*

Prove the whole change in this order, fixing a failure before moving on: **format and lint** → **one
`tsc` pass per process target**, each against its own module view → **focused tests** → **full tests** →
**the adversarial security tests** EL-R-04 requires, including the disallowed-origin case for each
origin-sensitive item and the null and detached sender frames for EL-R-09 → **an end-to-end run** →
**the packaged artifact**: no dev-server URL literal, the fuse posture read back from every signed
platform and architecture that ships, and the security review of the nine code-only items recorded
individually. For a bug, re-run the P1 reproducer.

**P7 passes only when** every applicable check exits clean on fresh output, the adversarial cases deny,
and the properties that only exist in a packaged build were checked on a packaged build — a clean dev
console is not one of them (EL-N-01).

### P8 — Review on three axes, then trace

*Deepens principles 9 and coding P15 — CRUD and 5W1H, change with blast-radius awareness.*

Review on three independent axes and route to each:

1. the language-agnostic **property**, with [`../coding/evaluation.md`](../coding/evaluation.md);
2. the **TypeScript idiom**, with general [`evaluation`](../evaluation/SKILL.md) applying
   [`typescript-conventions`](../typescript/typescript-conventions/SKILL.md) and
   [`typescript-typing`](../typescript/typescript-typing/SKILL.md);
3. the **Electron idiom**, with the local [`evaluation.md`](evaluation.md).

All three run; none substitutes for another. For a pre-handoff check, read
[`scenarios.md`](scenarios.md) for the task-relevant good, bad, boundary and adversarial probes, then
answer the activated binary `EL-CHECK-*` items in [`checklists.md`](checklists.md); a failed item returns
to its owning step. An independent evaluator enters through [`evaluation.md`](evaluation.md), which loads
both siblings.

Then run **traceability**: every approved design item from P4 maps to an implemented unit, channel, trust
check and test seam; every scope item maps to a diff line and nothing exceeds it; every affected-set file
from P1 is updated or is a justified no-op; every version-sensitive claim added to a doc carries its
qualifier and its register row (EL-R-14); and no caller, test, type declaration or doc is left stale.

**P8 is complete when** all three reviews pass, every activated binary check passes, the change traces to
the approved design and scope with no stale dependent, and every success criterion has fresh evidence.

---

## References

One owner per borrowed fact: the body states the local Electron consequence and this register names the
single owner that validates it.

### Version window

Electron ships a major every eight weeks and supports the latest three, so this skill teaches a
**window**, never a pinned version.

| Field | Value |
|---|---|
| Supported majors | **43, 42, 41** |
| Verification anchor | Electron **43.2.0**, released 2026-07-21, `verified-against electronjs.org/docs@v43.2.0 on 2026-07-25` |
| Next rotation | the next `stableDate` in `releases.electronjs.org/schedule.json` — read against the anchor date, that is **2026-08-25** (44.0.0), and the one after is 2026-10-20 (45.0.0) |

The rotation date is **derived, not written once**: re-read the next `stableDate` from `schedule.json`
rather than trusting the number above. A written date expires silently and points nowhere the day after
it passes. The window's own freshness sits inside EL-R-15's scope, so a rotation date in the past is a
review failure. No other file in this skill repeats a specific version number: every behavior claim
carries its own qualifier and appears in the behavior-claim register in [`migration.md`](migration.md),
which also states its own coverage ceiling.

### Owners

- [`coding/SKILL.md`](../coding/SKILL.md) — owns the language-agnostic properties of good software that
  this skill specializes for the desktop runtime, and the boundary test: advice that would still hold in
  a plain Node and browser app belongs there, not here.
- [`typescript`](../typescript/SKILL.md) routes TypeScript language work.
  [`typescript-compiler`](../typescript/typescript-compiler/SKILL.md) owns strict-flag and ESM/module
  semantics, [`typescript-typing`](../typescript/typescript-typing/SKILL.md) owns `any` and `unknown`, and
  [`typescript-async`](../typescript/typescript-async/SKILL.md) owns promise handling. This skill owns only
  the three-target *split*.
- [`principles/SKILL.md`](../principles/SKILL.md) — owns the ten behavioral principles the Procedure
  above operationalizes.
- The nine content children own the Electron depth behind each Rule; the P2 router names which fork
  reaches which one, and [`security.md`](security.md) is the single home of the `webPreferences` defaults
  table.
- General React idioms — hooks, composition, state management, rendering behavior — are **out of scope**
  and have no owner in this project. [`renderer-react.md`](renderer-react.md) covers only the
  Electron↔React seam.

### Primary sources

Electron's own documentation at the anchor version is the primary tier; every claim above traces to one
of these unless it is marked `DERIVED`.

- [Security checklist](https://www.electronjs.org/docs/latest/tutorial/security) — the 20 items, the
  code-only partition, the two vendor samples EL-R-05 and EL-R-09 are deliberately stricter than.
- [`webPreferences` structure](https://www.electronjs.org/docs/latest/api/structures/web-preferences) —
  all 44 options and their documented defaults; the security tutorial carries no defaults table.
- [`contextBridge`](https://www.electronjs.org/docs/latest/api/context-bridge) and
  [`ipcMain`](https://www.electronjs.org/docs/latest/api/ipc-main) — the bridge and IPC surfaces, and the
  two different serialization tables.
- [`BaseWindow`](https://www.electronjs.org/docs/latest/api/base-window) — the window classes;
  `BrowserWindow` is not deprecated, `BrowserView` is.
- [Breaking changes](https://www.electronjs.org/docs/latest/breaking-changes) and
  [the release schedule](https://releases.electronjs.org/schedule.json) — the removal table behind
  `migration.md` and the rotation date rule above.
- [`@electron/fuses`](https://github.com/electron/fuses) — the fuse flags and the
  `npx @electron/fuses read --app <path>` invocation in EL-R-12. The invocation shape is verified against
  that README, `UNVERIFIED-AGAINST-ARTIFACT`: it has not been run against a packaged build here.

### Ecosystem tier

Lower-confidence than the Electron-org tier: these versions and claims come from each project's own
release pages, not from an Electron source, and the judgment defaults above carry the caveat that goes
with each.

- [electron-vite](https://electron-vite.org/) 5.0.0 — community-maintained by `alex8088`, not an
  Electron-org project.
- [Playwright](https://playwright.dev/docs/api/class-electron) 1.62.0 — Electron support is experimental
  and the API is underscore-prefixed.
- [React Router](https://reactrouter.com/) 8.3.0 — its documentation does not mention `file://` or
  Electron, so the routing consequence in `renderer-react.md` is marked `DERIVED`.
- [Electron Forge](https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging) — the packaging
  path Electron's own tutorial uses; no page declares it recommended over electron-builder by name.
