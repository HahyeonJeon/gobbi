# Desktop — Process Model and the Privilege Boundary

Fix the main / renderer / preload / utility split and the IPC contract as a trust boundary. Policy lives in
[`SKILL.md`](SKILL.md); this child owns the mechanics.

The boundary between the privileged process and the presentation process is the product's real perimeter, and
it presents as an ordinary typed function call. Everything in this file exists because a declared type states
a shape and never validates one.

Every version-dependent statement below names the behaviour whose availability version
[`runtime-deltas.md`](runtime-deltas.md) owns, and points there instead of restating the literal.

## The four execution contexts and their privileges

| Context | Privilege | What it owns | What it must not do |
|---|---|---|---|
| **Main** | full — a Node.js environment | windows, application lifecycle, and every native operating-system interface | block. It owns the interface thread across every window at once, so one synchronous file read or parse freezes the whole application |
| **Renderer** | none beyond web standards | one window's document, its rendering, and its own event loop | reach a privileged interface directly. It has no direct access to `require` or other Node.js interfaces, so a package from the registry needs a bundler |
| **Preload** | narrow and deliberate | the single sanctioned bridge between a renderer and the privileged side | expose a broad surface. It executes in a renderer before that renderer's web content begins loading, which is the whole reason it can install a contract the page cannot tamper with |
| **Utility** | isolated | work that must not run in main and must not run in a renderer | be treated as a renderer. It is the platform's own equivalent of the runtime's `fork`, built on the browser engine's services layer, and it communicates over `MessagePort` |

State which context each unit of the outcome runs in. A unit whose context is unstated is a unit whose
privilege is unstated.

### The three defaults, and what they mean

Three security defaults define the shape above. Each has been the default since the version
[`runtime-deltas.md`](runtime-deltas.md) records for it, under *Renderer runtime integration off by default*,
*Context isolation on by default*, and *Renderer sandbox on by default*. The renderer sandbox is on unless
runtime integration is switched on or the sandbox is switched off explicitly.

The platform's own guidance is stronger than it is usually read to be: enable the sandbox in **all**
renderers, and do not load, read, or process untrusted content in an unsandboxed process — **including the
privileged process**. The privileged process is not exempt from that instruction.

A sandboxed renderer can freely use processor cycles and memory and nothing else; every privileged operation
is delegated across the boundary.

### What a sandboxed preload actually gets

A sandboxed preload does not get the runtime. It gets a **polyfill with limited functionality**: a `require`
restricted to `contextBridge`, `crashReporter`, `ipcRenderer`, `nativeImage`, `webFrame`, and `webUtils`, plus
`events`, `timers`, `url`, and the `Buffer`, `process`, `setImmediate`, and `clearImmediate` globals.

The direct consequence is a build fact, not a style preference: **preload code cannot be split across
CommonJS files**, so preload is a bundling target. A preload that grows past one file needs the bundler, not
a second `require`.

**No rationale is written here for the removal of the former remote-access module.** The governing document
gives none and no primary statement was found — **UNVERIFIED**, and the gap is recorded in `SKILL.md`'s gap
register rather than filled with a plausible story. Two adjacent verified facts do the teaching work instead:
passing the whole `ipcRenderer` module across `contextBridge` yields an **empty object** on the receiving
side from the version [`runtime-deltas.md`](runtime-deltas.md) records under *Whole `ipcRenderer` module sent
across the bridge yields an empty object*, and `ipcRenderer.sendTo()` was removed at the version recorded under
*Direct renderer-to-renderer messaging removed*.

## The IPC pattern table

| Direction | Mechanism | Status |
|---|---|---|
| Renderer to main, one-way | `ipcRenderer.send` with `ipcMain.on` | fire-and-forget only; no result reaches the caller |
| Renderer to main, two-way | `ipcRenderer.invoke` with `ipcMain.handle` | **the documented recommendation** — use it whenever possible |
| Main to renderer | `webContents.send` | the only direction from the privileged side |
| Renderer to renderer | none directly | broker through main, or hand over a `MessagePort` |

`ipcRenderer.sendSync` is cautioned against for performance reasons: it blocks the renderer that calls it.
Reach for `invoke` instead, and treat a synchronous crossing as a decision that needs a reason.

There is no direct renderer-to-renderer channel. `ipcRenderer.sendTo()`, which once provided one, is gone as
of the version [`runtime-deltas.md`](runtime-deltas.md) records under *Direct renderer-to-renderer messaging
removed*, so a design that assumes it is broken on every supported version.

**Enumerate the channels.** The run's channel inventory names, per channel, its payload type, its runtime
validation, its sender rule, and the privileged effect it reaches. A channel absent from the inventory is a
channel nobody has reasoned about.

## Sender and payload validation

Both validations are mandatory at every privileged crossing, and they defend against different things.

### The caller

**Validate the sender of all inter-process messages by default.** This is the platform's own instruction, not
a hardening option, and the reason is structural: all web frames can in theory send messages to the
privileged process, including iframes and child windows in some scenarios. Context isolation does **not**
prevent it — isolation separates the page's world from the preload's world, and says nothing about which
frame a message came from.

The documented pattern checks `event.senderFrame` before any privileged effect. Check it in the handler, not
in a wrapper the handler can be reached around.

### The payload

Runtime-validate every payload into a domain type before the privileged effect. A declared type is erased at
the boundary: the compiler checks the caller it can see, and the value arriving at the handler came from a
process the compiler never checked.

This is the shape `DESK-N06` names — trusting a payload or its sender because the declared type says it is
safe. The two failures pair: a valid payload from an unexpected frame and an invalid payload from the
expected frame are both reachable, and each needs its own check.

Parsing an untrusted value into a domain type is a language concern, and
[`typescript/typing.md`](../typescript/typing.md) owns the declaration-versus-verification distinction that
makes it work. This file states where the parse must happen; that file states how to write one.

## The `contextBridge` crossable-type boundary

The bridge is a real type boundary, not a transparent channel. What crosses is enumerated:

`string`, `number`, `boolean`, `Object`, `Array`, `Error`, `Promise`, `Function`, cloneable types, `Element`,
`Blob`, and `VideoFrame`.

What does **not** survive:

- **`Symbol` cannot cross.** A `Symbol`-keyed member is not merely dropped from the copy; the value cannot
  make the crossing at all.
- **Prototype modifications are dropped, and sending classes or constructors does not work.** An instance
  arrives as data. Its methods do not arrive with it.
- **`Error` properties may be lost**, because the error is thrown in a different context from the one that
  will catch it.
- **The whole `ipcRenderer` module** yields an empty object on the receiving side from the version
  [`runtime-deltas.md`](runtime-deltas.md) records for it. Expose named methods, never the module.

`exposeInIsolatedWorld(worldId, …)` addresses isolated worlds by number, and `999` is the platform's own
preload default. A custom world uses `1000` or above so it cannot collide with that default.

### Why this is the highest-value teaching point in the skill

The declared type says `Foo`. The runtime delivers a prototype-stripped object shaped like `Foo` and missing
everything `Foo`'s prototype carried. The compiler cannot see the difference, because from its side this is
an ordinary in-process call against a declared interface.

So the boundary presents as a fully typed function call while carrying data an attacker can shape. There is
no analogue for that in ordinary language use, which is why the language skill does not name it and why this
skill has to. `DESK-R16` is the rule: one source-of-truth contract type, imported type-only by both sides,
carrying only structured-cloneable values and plain asynchronous functions.

**Design the contract for what survives.** A contract typed in terms of classes will type-check and fail at
run time. A contract typed in terms of plain data and asynchronous functions returning plain data will not.

## `MessagePort` lifetime

Ports come in pairs, and the pair is the unit.

- **The ordinary send and invoke methods cannot transfer a port.** Only the `postMessage` methods can. A
  design that plans to hand a port over an ordinary channel does not work.
- **The privileged-side classes are `MessageChannelMain` and `MessagePortMain`,** and they are runtime-style
  rather than web-style: `.on('message')`, not `.onmessage`. Code copied from a browser example needs this
  change.
- **A port can be implicitly closed by being garbage-collected.** That is the trap. A port held only by a
  local variable in a function that returns will close at a time nothing in the code names.

Therefore lifetime is owned explicitly. `DESK-R18` states the rule: every privileged resource held on behalf
of a renderer names the window or `webContents` lifecycle event that releases it, with `will-quit` as the
last-resort terminal. Key disposal to the lifecycle event, never to scope exit.
[`typescript/async-resources.md`](../typescript/async-resources.md) owns the disposal idiom itself.

A utility process communicates over these ports, so a utility process's lifetime is a port lifetime question
and inherits everything above.

## The three compilation targets

**INFERRED — the three-target split is derived, not documented.** No primary source states it. It follows
from the verified sentence that the preload context has the document interfaces plus a limited subset of the
runtime's and the platform's own interfaces, and following-from is not documented-as. `DESK-R17` carries this
marking, and the marking travels with the rule wherever it is restated, taught, or exercised — including
`P7`, which materialises these three projects. Teach the split; teach it as derived.

| Target | Ambient types | Document interfaces | Why |
|---|---|---|---|
| Main | the runtime's own types | none | it is a runtime environment with no document |
| Renderer | **none from the runtime** | yes | it is a web-standards context, and the sandbox rejects what runtime types would promise |
| Preload | the narrowest set of the three | yes | it has the document interfaces and only a limited subset of the rest |

Wire the three as separate projects with their own library, type, and module settings, joined by project
references over **one type-only shared layer**. [`typescript/modules-tooling.md`](../typescript/modules-tooling.md)
owns the flag set and the import-extension fork; this file states only which targets exist and why they
differ.

### Excluding the runtime's types from the renderer is a defect fix, not a preference

With renderer runtime integration off — the default recorded in [`runtime-deltas.md`](runtime-deltas.md) —
including the runtime's types in the renderer target makes `require`, `process`, and file-system calls
**type-check green over code that throws at run time**.

A green type-check over code the sandbox rejects is a correctness and security inversion: the one tool that
was supposed to catch the mistake now certifies it. `DESK-N07` prohibits it outright, and it is prohibited
because the failure is silent until a user hits the path.

### Sharing the contract without leaking the runtime's types

Two pieces, and the shape of each matters:

1. **A shared contract module holding only erasable type declarations, with no runtime import of the
   platform's own module.** Importing a type *from* the platform module inside a renderer file drags the
   runtime's ambient types into the browser target and reintroduces the defect above through the back door.
2. **A renderer-side declaration file** that augments the global window object with the contract type, so the
   renderer sees the bridge surface and nothing else.

Both sides import the contract type-only. That is what makes it one source of truth rather than two
declarations that agree today.

### Module-syntax asymmetry across the three targets

Module syntax arrived at the version [`runtime-deltas.md`](runtime-deltas.md) records under *Module syntax
support in the main process*, and it behaves differently in each of the three contexts. This is the single
largest source of surprise in the three-target build.

- **Main** uses the runtime's own module loader and needs either the module file extension or the module type
  declared in the manifest. Its imports load **asynchronously**, so only side effects from the entry point's
  own imports run before the ready event. Any registration that must happen before that event is subject to
  this, and [`windows-lifecycle.md`](windows-lifecycle.md) names the launch-event trap it produces.
- **Preload** is the constrained one. A **sandboxed preload cannot use module-syntax imports at all**. An
  unsandboxed preload requires the module file extension and **ignores** the module type declared in the
  manifest. An unsandboxed module-syntax preload runs after page load on pages with no content, and a dynamic
  runtime-module import in a preload requires context isolation.
- **Renderer** uses the browser engine's loader. It has no access to the runtime's built-in modules and
  cannot load packages from the installed dependency tree, so **a bundler is mandatory** — this is the same
  fact the context table states, reached from the module side.

### The entry-point question that stays open

**UNKNOWN — whether the privileged process can run a TypeScript entry directly through the runtime's own type
stripping.** This skill's rule is written so it does not depend on the answer: **require a compile or bundle
step**, which every current template assumes. The rule does not claim the alternative is impossible, because
that would be a claim about the world that nobody here has checked.

One test settles it: run a TypeScript main entry under the pinned runtime version and record the result.
`SKILL.md`'s gap register carries it with that closing condition. Neither assert nor hedge it in the
meantime — a hedge is a positive claim and fails the same way.
