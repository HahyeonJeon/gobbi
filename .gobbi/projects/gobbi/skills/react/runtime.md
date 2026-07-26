# React — Presentation and Producer Deltas

**Ownership** — what actually differs across the presentation surfaces and producer architectures this
skill covers. Presentation is a browser page or an Electron renderer. Production is client-only,
build-time, or request-time/remote. This file owns their six combinations, the surface-specific
constraints, and the negative space — which web-React assumptions stop being true when the same
components move.

**Split criterion** — `skill-writing` P4, category *a long lookup reference*: a reader opens it at
Procedure P1 to answer "what does this presentation/producer combination support", or when changing
either axis. P4's other three
categories do not describe it — it owns no artifact set, orchestrates no per-unit work, and is not a
sub-procedure another consumer loads.

**The testable line for what belongs here.** A fact that is identical across both presentation surfaces
and all three producer architectures is not a runtime delta and belongs to whichever child owns its
topic. This file states a fact only where the answer changes by surface or producer.

This doc **deepens, and does not restate,** `SKILL.md` Rules `H16` and `H17` and Principle 6, and the
`runtime.md` row of the P2 router. What the server/client boundary *is* belongs to
[`server-client.md`](server-client.md); this file says which producer combinations have one. Effect cleanup for a
subscription is `H6`'s and is pointed at, not repeated. A claim with no primary source is labelled
*ecosystem convention* where it is made; §6 lists every source and every open item.

**Two presentation surfaces, and that is a decision.** React Native is out of scope. No successor covers it, this skill
promises no future coverage of it, and its absence is a recorded decision rather than an omission — §5
says so in full so that a reader does not read the gap as an oversight.

---

## The six-combination matrix

The presentation surface does not decide the producer. Each row records the six fields required at
Procedure P1.

| Presentation surface | Producer architecture | Output | Production timing | Hydration | Security boundary |
|---|---|---|---|---|---|
| Browser page | Client-only bundle | Client JavaScript and browser-rendered DOM | Application build, then browser execution | None: no producer-rendered initial HTML | Browser origin and every remote API boundary |
| Browser page | Identified build-time framework or bundler | Generated HTML or RSC payload plus client assets | Build or CI | Required when producer-rendered HTML becomes the initial React tree; client-only islands attach normally | Browser origin plus the server/client serialization and trust boundaries |
| Browser page | Identified request-time or remote framework/server | Per-request HTML or RSC payload, or remote data consumed by the client tree | Per request or remote call | Required when server-rendered HTML becomes the initial React tree; otherwise follow the payload's named integration | Browser origin plus the remote and server/client boundaries |
| Electron renderer | Client-only bundle | Packaged client assets and renderer DOM | Package build, then renderer execution | None: no producer-rendered initial HTML | Finite preload API, Node integration off, context isolation on, sandbox on |
| Electron renderer | Identified build-time framework or bundler | Generated HTML or RSC payload plus packaged client assets | Build or CI before packaging | Required when generated HTML becomes the initial React tree | The same finite isolated, sandboxed preload boundary; producer output grants no privilege |
| Electron renderer | Identified request-time or remote framework/server | Remotely served HTML or RSC payload, or remote data consumed by the renderer | Per request or remote call | Required when server-rendered HTML becomes the initial React tree; otherwise follow the payload's named integration | Remote origin plus the same finite isolated, sandboxed preload boundary |

The question is never "is there a server" — `server-client.md` §7 shows the "server" in Server
Components is a separate *environment* that can be a build step on a CI machine rather than a running
web server. The question is whether an identified producer **implements** RSC or streaming SSR.
react.dev's own framing is on the implementer's side rather than the application's — *"To support React
Server Components as a bundler or framework, we recommend pinning to a specific React version, or using
the Canary release"* — and `use-client` describes the mechanism: *"When a file marked with `'use
client'` is imported from a Server Component, compatible bundlers will treat the module import as a
boundary between server-run and client-run code."* A client-only bundle has no target on either
presentation surface, however many servers the product operates. Conversely, neither the word browser
nor the word Electron forbids consuming output from a producer that actually implements the feature.

## 1. Browser presentation

Everything in `SKILL.md` applies unchanged. A browser page may receive any of the three producer
architectures in the matrix; the page alone does not say which one exists.

- **A client-only bundle has no RSC target.** Data access is `fetch`, from an event handler or an Effect
  under `H5`, with `H6`'s cleanup and staleness guard.
- **Build-time and request-time/remote producers are separate architectures.** When an identified
  framework or bundler implements them, the browser consumes their output under
  [`server-client.md`](server-client.md)'s serialization and hydration contracts.
- **Routing uses the History API**, which works because a server resolves an arbitrary path back to the
  application shell. That assumption is exactly what can fail in a packaged Electron presentation.

## 2. Producer architectures

Producer architecture answers who creates the delivered React artifacts and when. It is independent of
whether the presentation surface is a browser page or an Electron renderer.

- **Client-only** means the delivered client bundle is the only React producer. RSC, Server Functions,
  streaming server rendering, and hydration of producer-rendered HTML have no target.
- **Build-time** means an identified framework or bundler runs the server environment during the build or
  in CI and emits the artifacts the presentation surface consumes. There need not be a running web
  server.
- **Request-time or remote** means an identified framework or server produces output per request or
  behind a remote boundary. The presentation surface consumes that output; it does not become the
  producer.
- **RSC, Server Functions, streaming SSR, and hydration apply only where their producer implements
  them.** Their mechanics — the directives, the three serialization sets, the Actions family, and the
  hydration contract — are [`server-client.md`](server-client.md)'s and are not repeated here.
- **`H18` follows the Server Function endpoint, not the presentation surface.** Wherever such an endpoint
  exists, validate its arguments and authorize the mutation inside the function.
- **The framework owns more of the surface than React does.** Routing, caching, revalidation, and the
  transport of the rendered tree are the framework's, and react.dev does not publish the division — see
  `server-client.md` §7, where that gap is carried as an open item rather than guessed.

## 3. Electron presentation

Electron appears here as a presentation surface, not as a producer architecture. The valuable material
is what stops being true.

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

### The packaged client-only default

A typical packaged renderer loads a built client bundle. When no identified build-time,
request-time, or remote framework/bundler produces server output, Server Components, Server Functions,
streaming SSR, and hydration have no target. This is the default architecture, not a property of the
renderer container.

An Electron renderer may instead consume build-time or request-time/remote output when an identified
producer implements and delivers it. The renderer remains the presentation surface: Server Components
still run in the producer's separate environment, and hydration attaches client behavior only when the
producer supplies matching initial HTML. Delivery does not grant Node access, relax serialization, or
weaken the bridge.

The migration consequence follows the architecture rather than the word Electron. Moving a
framework-backed application to a client-only packaged bundle requires replacing its server-dependent
work. Moving the same presentation while retaining a compatible build-time or remote producer instead
requires preserving that producer's output and boundary contracts.

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
  the cleanup. The cleanup discipline is not restated here; what is presentation-specific is only that
  the subscription exists at all.

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

### Two presentation-specific hygiene facts

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

## 4. What presentation changes, and what it does not

The negative space is presentation-specific. Producer-dependent behavior stays in the six-row matrix.

| Presentation property | Browser page | Electron renderer |
|---|---|---|
| Where React mounts | The browser DOM | The renderer DOM, never the main process |
| Local privileged capability | None beyond browser APIs | Only through the finite preload API |
| Node APIs in rendered code | Unavailable | Unavailable |
| Arbitrary path resolves to the application shell | Normally, with server fallback | Not under packaged `file://`; use hash or custom-protocol routing — *ecosystem convention* |
| Surface lifetime | Often a shorter-lived tab | Commonly a long-lived window — *ecosystem convention* |
| Shipped-build gate | Production web build | Packaged build, not only the development server |

Server Components, Server Functions, streaming SSR, and hydration are absent on either surface under a
client-only producer and available only to the extent an identified build-time or request-time/remote
producer implements them. That producer choice does not change the presentation row above.

Everything else transfers unchanged: hooks, composition, context, purity, keys, state placement, and the
whole of `SKILL.md`'s floor are identical. Electron security is additive and independent of delivery
architecture.

## 5. React Native

**Out of scope, by decision.** This skill covers React on the two presentation surfaces and three
producer architectures above. React Native is not
covered here, no other file in this skill covers it, and no future coverage is promised or scheduled. The
gap is deliberate, not an oversight: the rules in `SKILL.md` were written and evidenced against the two
DOM surfaces, and several of them — the markup contract in `H9`, the browser and renderer specifics in this file
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
| [Server Components](https://react.dev/reference/rsc/server-components) | The matrix and §1–§3 — that RSC needs a bundler or framework implementing it, and can run at build time or per request |

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
