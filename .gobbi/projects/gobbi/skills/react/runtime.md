# React — Host Deltas

**Ownership** — what actually differs across the hosts this skill covers: a browser application, a
framework server, and an Electron renderer. It owns the delta matrix, the per-host constraints, and the
negative space — which web-React assumptions stop being true when the same components move.

**Split criterion** — `skill-writing` P4, category *a long lookup reference*: a reader opens it at
Procedure P1 to answer "what does my host support", or when moving code between hosts. P4's other three
categories do not describe it — it owns no artifact set, orchestrates no per-unit work, and is not a
sub-procedure another consumer loads.

**The testable line for what belongs here.** A fact that is identical on all three hosts is not a host
delta and belongs to whichever child owns its topic. This file states a fact only where the answer changes
by host.

This doc **deepens, and does not restate,** `SKILL.md` Rules `H16` and `H17` and Principle 6, and the
`runtime.md` row of the P2 router. What the server/client boundary *is* belongs to
[`server-client.md`](server-client.md); this file says which hosts have one. Effect cleanup for a
subscription is `H6`'s and is pointed at, not repeated. A claim with no primary source is labelled
*ecosystem convention* where it is made; §6 lists every source and every open item.

**Three hosts, and that is a decision.** React Native is out of scope. No successor covers it, this skill
promises no future coverage of it, and its absence is a recorded decision rather than an omission — §5
says so in full so that a reader does not read the gap as an oversight.

---

## The delta matrix

| | Browser application | Framework server | Electron renderer |
|---|---|---|---|
| **Anything here implements RSC?** | No | Yes — that is what the framework or bundler provides | No |
| **Server Components / Server Functions** | Not available | Available | Not available |
| **Streaming server render and hydration** | Not available | Available | Not available |
| **Where React renders** | The browser page | The client tree in the browser; Server Components render in the separate server environment | The renderer process only — never the main process |
| **Data access** | `fetch` | Server Components and Server Functions, plus client fetching | The preload bridge (`invoke`), plus `fetch` for genuinely remote data |
| **Routing** | History API | The framework's router | Hash or custom-protocol routing, not path routing against `file://` — *ecosystem convention* |
| **Trust boundary that matters** | The browser origin model | The server boundary — `H18` lives here | The preload allowlist, with context isolation and the sandbox on |
| **Build gate that catches host defects** | The production build | The framework's production build | The packaged build, not the dev server |

The first row is worded deliberately. The question is never "is there a server" — `server-client.md` §7
shows the "server" in Server Components is a separate *environment* that can be a build step on a CI
machine rather than a running web server. The question is whether anything in this host **implements**
RSC, which is what `H17` requires when it says these features need a framework or bundler that implements
them. react.dev's own framing is on the implementer's side rather than the application's — *"To support
React Server Components as a bundler or framework, we recommend pinning to a specific React version, or
using the Canary release"* — and `use-client` describes the mechanism: *"When a file marked with `'use
client'` is imported from a Server Component, compatible bundlers will treat the module import as a
boundary between server-run and client-run code."* A browser application bundled without such a bundler
has no target no matter how many servers the product operates.

## 1. Browser application

The baseline the rest of this skill assumes. Everything in `SKILL.md` applies unchanged; there is nothing
host-specific to learn except what is absent.

- **No RSC target** unless a framework or bundler that implements it is added — at which point the second
  column applies instead. This is the same fact `H17` states, read from the host's side.
- **Data access is `fetch`**, from an event handler or an Effect under `H5`, with `H6`'s cleanup and
  staleness guard.
- **Routing uses the History API**, which works because a server resolves an arbitrary path back to the
  application shell. That assumption is exactly what fails in the third column.

## 2. Framework server

The only host where the server-dependent surface exists, and it exists because the framework or bundler
implements it, not because a server is running.

- **RSC, Server Functions, and streaming SSR are available.** Their mechanics — the directives, the three
  serialization sets, the Actions family, the hydration contract — are [`server-client.md`](server-client.md)'s
  and are not repeated here.
- **`H18` is a host-specific obligation in practice.** A Server Function is only reachable on this host, so
  this is the column where "validate the arguments and authorize the mutation inside the function" has
  something to guard.
- **The framework owns more of the surface than React does.** Routing, caching, revalidation, and the
  transport of the rendered tree are the framework's, and react.dev does not publish the division — see
  `server-client.md` §7, where that gap is carried as an open item rather than guessed.

## 3. Electron renderer

Electron appears here as a host row, not as a chapter. The valuable material is what stops being true.

### The process model, in the three facts React depends on

- **The main process is Node, and nothing React-shaped renders there.** *"Each Electron app has a single
  main process, which acts as the application's entry point. The main process runs in a Node.js
  environment, meaning it has the ability to require modules and use all of Node.js APIs."* It manages
  windows; it has no DOM, so React never mounts in it.
- **The renderer is a web page, and that is where React lives.** *"Each Electron app spawns a separate
  renderer process for each open BrowserWindow (and each web embed)"*, and *"code run in renderer
  processes should behave according to web standards (insofar as Chromium does, at least). Therefore, all
  user interfaces and app functionality within a single browser window should be written with the same
  tools and paradigms that you use on the web."* The consequence that surprises people arriving from a
  Node background: *"the renderer has no direct access to require or other Node.js APIs."*
- **The preload script is the only sanctioned seam.** *"Preload scripts contain code that executes in a
  renderer process before its web content begins loading."* It is where the bridge is built.

So a React component in Electron is a React component in a browser tab that has been given one extra,
narrow capability. Everything in `SKILL.md` still applies to it unchanged.

### Nothing here implements RSC

A packaged renderer loads a built bundle. No framework or bundler in that path implements Server
Components, no request-time server produces an RSC payload, and there is no server render to hydrate. By
`H17` that settles it: Server Components, Server Functions, and streaming SSR have no target in this host.

The migration consequence is worth stating once, because it is the expensive one: an application built
around Server Components does not move into a renderer as-is. Every server component becomes a client
component, and the work it was doing on the server moves into the main process behind a bridge call.

### The bridge, and why its shape is not negotiable

The renderer reaches privileged capability only through the preload bridge, and `H16` states the rule. Two
mechanics behind it:

- **Never expose the raw IPC surface.** *"Exposing raw APIs like `ipcRenderer.on` is dangerous because it
  gives renderer processes direct access to the entire IPC event system, allowing them to listen for any
  IPC events, not just the ones intended for them."* And the subtler half, which a "narrow" wrapper still
  gets wrong if it forwards the callback: *"The first argument to IPC event callbacks is an
  `IpcRendererEvent` object, which includes properties like `sender` that provide access to the underlying
  `ipcRenderer` instance. Even if you only listen for specific events, passing the callback directly means
  the renderer gets access to this event object."* Expose a named function per capability and pass the
  callback only the value.
- **The defaults are the protection, and one of them switches off another.** Node integration off, context
  isolation on, and the sandbox on are Electron's defaults. *"Sandboxing is a Chromium feature that uses
  the operating system to significantly limit what renderer processes have access to. You should enable
  the sandbox in all renderers."* The coupling to watch: *"Disabling context isolation (see above) also
  disables process sandboxing, regardless of the default, `sandbox: false` or globally enabled
  sandboxing!"* — one flag turns off two protections.
- **Why any of it matters to a React author.** *"A cross-site-scripting (XSS) attack is more dangerous if
  an attacker can jump out of the renderer process and execute code on the user's computer."* The same
  unsanitized-markup defect that is a display bug in a browser tab is a different class of incident here,
  which is why `H16` has no exception.

### Two IPC shapes, and how they land in React

- **Request/response** — `ipcRenderer.invoke` paired with `ipcMain.handle`. *"The return value is then
  returned as a Promise to the original `invoke` call."* Being a promise is the whole integration story: a
  bridge call composes with `await` exactly like `fetch`, so it fits the same Effect, event-handler, and
  loading-state patterns `SKILL.md` already governs. No new React idiom is needed.
- **Push events** — the main process sends, and the preload exposes a named subscribe function. In a
  component that is a **subscription**, so it is `H6`'s territory: create it in an Effect and remove it in
  the cleanup. The cleanup discipline is not restated here; what is host-specific is only that the
  subscription exists at all.

### What may cross the bridge

Only structured-cloneable data: *"you can't send custom prototypes or symbols over the bridge."* A class
instance arrives as a plain object with its prototype gone, a function does not cross, and a symbol does
not cross. This is a second, independent serialization contract from the one in
[`server-client.md`](server-client.md) §3 — same discipline, different boundary, and the two sets are not
the same. Do not carry an answer from one to the other.

### Loading the application, and the routing constraint

Electron's own guidance is to avoid `file://` altogether: *"You should serve local pages from a custom
protocol instead of the `file://` protocol"*, because *"pages running on `file://` have unilateral access
to every file on your machine meaning that XSS issues can be used to load arbitrary files from the users
machine."*

*Ecosystem convention* — that path-based routing breaks in a packaged build loaded from `file://`, and
that hash-based or custom-protocol routing is the repair, is community consensus. It is corroborated
across router and boilerplate project discussions but is not stated by Electron or by any router's
maintainers as an official position, and this skill names no router library. The evidence class is
community consensus, not a vendor position.

What follows from it is not convention, and it is the reason `SKILL.md` Procedure P7 gates on the packaged
build: a dev server resolves paths, a packaged renderer does not, so routing and asset resolution can be
green in development and broken in the shipped application. Verify against the packaged build, early.

### Two host-specific hygiene facts

Both are *ecosystem convention* — this skill's house defaults, with no Electron or React position behind
them:

- **A renderer window can stay open for days.** A browser tab is closed and reloaded often, which hides
  leaks; a desktop window is not. A subscription that `H6` would have caught anyway accumulates visibly
  here, so memory is worth profiling over a long session rather than over a page load.
- **Guard the bridge object before using it.** A component that reaches for the exposed API throws
  wherever the preload has not run — a unit test, a component workshop, a web preview build. Read the
  capability through a boundary the component can be given a substitute for, rather than reaching for a
  global that only exists inside the shipped application.

### Versions are deliberately absent

This file pins no Electron, Chromium, or Node version, and neither does any other file in this skill. The
reason is cadence: *"Electron's cadence between major version releases is 8 weeks long"*, and *"the latest
three stable major versions are supported by the Electron team."* A number written here would be wrong
within a release or two and wrong in a way that reads authoritative. Read the current version, its
Chromium and Node pairing, and the support window from Electron's own release and timeline pages at the
moment you need them.

## 4. What does not transfer

The negative space, in one table. "No" means the assumption is false on that host, not merely unusual.

| Web-React assumption | Browser application | Framework server | Electron renderer |
|---|---|---|---|
| Server Components can render some of this tree | No | Yes | No |
| A Server Function can be called from a component | No | Yes | No |
| The initial HTML is server-rendered and hydrated | No | Yes | No |
| An arbitrary path resolves to the application shell | Yes | Yes | No — *ecosystem convention* |
| Privileged capability is unreachable from page code | Yes | Yes | Only while the bridge stays narrow |
| Node APIs are unavailable to the rendered code | Yes | Yes, in the client tree | Yes, in the renderer |
| The tab is short-lived, so a leak is masked | Usually | Usually | No |
| The dev server and the shipped build behave alike | Mostly | Mostly | No — the packaged build is the gate |

Everything not in this table transfers unchanged, which is the larger truth about all three hosts: hooks,
composition, context, purity, keys, state placement, and the whole of `SKILL.md`'s floor are identical
everywhere. The deltas are a short list, and this is it.

## 5. React Native

**Out of scope, by decision.** This skill covers React on the three hosts above. React Native is not
covered here, no other file in this skill covers it, and no future coverage is promised or scheduled. The
gap is deliberate, not an oversight: the rules in `SKILL.md` were written and evidenced against the DOM
hosts, and several of them — the markup contract in `H9`, the browser and renderer specifics in this file
— do not transfer to a native renderer without work this skill has not done. A reader targeting React
Native should not read this skill's silence as approval of applying it there.

## 6. Sources and evidence classes

Read on 2026-07-26; every quoted sentence located in these pages on that date. `SKILL.md`'s References
register owns the rule-level citations.

| Source | What it supports here |
|---|---|
| [Electron process model](https://www.electronjs.org/docs/latest/tutorial/process-model) | §3 — the single main process in a Node environment, a renderer per window behaving to web standards, no direct `require` or Node APIs in the renderer, and what a preload script is |
| [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security) | §3 — the raw-`ipcRenderer` and callback-forwarding hazards, the sandbox's purpose and its coupling to context isolation, the XSS escalation framing, and the `file://` guidance |
| [Electron context isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation) | §3 — custom prototypes and symbols cannot cross the bridge |
| [Electron IPC](https://www.electronjs.org/docs/latest/tutorial/ipc) | §3 — `invoke` paired with `handle`, and the return value arriving as a promise |
| [Electron timelines](https://www.electronjs.org/docs/latest/tutorial/electron-timelines) | §3 — the eight-week major cadence and the latest-three support window |
| [Server Components](https://react.dev/reference/rsc/server-components) | The matrix and §1–§3 — that RSC needs a bundler or framework implementing it, which is what makes the first matrix row an implementation question rather than a hosting question |

**Ecosystem convention here**, named as such where it appears and never as a vendor position: the
`file://` routing constraint and its hash-or-custom-protocol repair; the long-lived-renderer memory
observation; and guarding the bridge object.

**Open items, not asserted as fact.** The typing pattern for the bridged API — declaring the exposed
surface once and merging it onto the global window type — is in wide community use and is consistent with
the shape the bridge exposes, but no Electron document states it as the canonical pattern, so this skill
does not present it as one; a project should decide and document its own. Also open, and for the same
reason: how an error's stack behaves when a handler rejects across the process boundary, whether any
cancellation primitive exists for an in-flight bridge call, cross-window state synchronization patterns,
and the relative standing of the Electron build and packaging tools — Electron endorses none of them.
