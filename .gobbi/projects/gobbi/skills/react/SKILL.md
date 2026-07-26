---
name: react
description: "MUST load before writing or reviewing React code. The React-idiom layer above the language layer — purity and the render model, the compiler memoization baseline, state placement, the server/client boundary, host deltas, accessibility mechanics, and testing through the user-visible surface."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# React

The React-idiom layer. It sits UNDER `coding`, which states the language-agnostic properties of good
software, and BESIDE `typescript` rather than under it: React source is usually TypeScript, so this
skill assumes the TypeScript contract is already in context and never restates it.

React can also be written in plain JavaScript. That fork is real and it is declared here: on a
plain-JavaScript codebase `typescript` is not loaded and no typing rule applies, and every other rule
in this skill still holds. Nothing below depends on the source being TypeScript unless it says so.

Load this skill before writing or reviewing any React code. The Principles, Rules, and Procedure below
carry an ordinary component or hook from first read to review without opening anything else. A
Procedure step (P2) routes to a companion only when a decision needs depth this floor does not carry.

---

## Principles

> **1. Study the React contract before you design.**

The parent's Study First discipline (`coding` Principle 1) says read the code and the prior art. The
React delta is that "the contract" is a set of concrete switches, not the abstract problem: the React
version, whether the React Compiler is enabled, which host the code runs on, whether a server tier and
RSC are real targets, whether the source is TypeScript or plain JavaScript, and which lint preset is in
force. The same component is correct under one contract and wrong under another, so those switches —
not intuition about React — decide which mechanism is even available.

> **2. Render is a pure function of props and state; an Effect is an escape hatch, not the mechanism.**

The parent's Control State and Side Effects (`coding` Principle 16) says minimize mutable state and make
side effects explicit. The React delta is that render is not a place where effects may happen at all:
React may render a component many times, interrupt a render, or discard its result, so anything
observable during render is a defect rather than a style choice. An Effect exists to synchronize with a
system outside React. Reaching for one to derive a value, to react to a prop, or to stand in for an
event handler produces extra render passes and causality no reader can trace.

> **3. Give every piece of state exactly one owner, at the narrowest scope that serves it.**

The parent's Don't Repeat Knowledge (`coding` Principle 12) says one authoritative home per decision;
Control State and Side Effects says keep sharing explicit. The React delta is that React offers a ladder
of homes — local, lifted, context, an external client store, a server cache — and the defect is almost
never the rung, it is holding the same fact on two rungs. A value that can be computed during render has
no home at all: compute it.

> **4. Compose units, keep the prop surface narrow, and treat the rendered markup as part of the contract.**

The parent's Build Deep Units (`coding` Principle 3) and Narrow the Input Surface (`coding` Principle 17)
say a simple interface over a substantial implementation, requiring only what the unit uses. The React
delta is that a component has two surfaces, not one: the props it accepts and the markup it produces. A
component that takes a whole record to read two fields is as defective as one that renders a clickable
`div`. Both are contract failures, and only one of them is visible in the type.

> **5. Memoize by the recorded compiler switch, not by habit.**

The parent's Make It Efficient Enough (`coding` Principle 14) says optimize on evidence. The React delta
is that which mechanism applies is a fact about the codebase, read before the decision, not a matter of
taste. Where the React Compiler is enabled it is the memoization baseline: memoization is applied
automatically and, in most cases, as precisely as or more precisely than hand-written memoization
manages, so scattering `useMemo`, `useCallback`, and `memo` over new code is not caution, it is noise the
compiler already handles. Where the compiler is not enabled, manual memoization is the mechanism, and it
carries criteria of its own that decide where it pays and where it is merely cost. The two are different
mechanisms, not different degrees of caution, so the switch is read first.

> **6. Know which boundary the code sits on, and what may cross it.**

The parent's Make Failure Explicit, Guard the Trust Boundary (`coding` Principle 10) says validate what
crosses a trust boundary. The React delta is that a React tree can span several boundaries that look
like ordinary function calls: a server/client module boundary, a process bridge in a desktop renderer, a
network hop hidden behind an `await`. Each one restricts what may cross it and each fails at run time,
not at the call site, so the boundary has to be known before the value is designed.

> **7. Prove behavior the way a user reaches it.**

The parent's Design for Verification (`coding` Principle 6) says build seams so behavior can be tested.
The React delta is which seam: a test that reaches into state, instances, or the rendered tree structure
pins the implementation and breaks on every refactor, while a test that finds an element the way a user
or an assistive technology does keeps working. The user-visible surface is the seam React gives you.

---

## Rules

These Rules are the house default for new and changed React code. When reviewing or maintaining an
existing codebase, apply them to what the change touches; they are not a mandate to migrate the whole
tree.

**Rule identity.** Each rule carries a stable `H{n}` identifier, and this file is where those
identifiers are stamped. `scenarios.md`, `checklists.md`, and `evaluation.md` cite them, resolve them,
and never renumber them.

**Evidence.** Every rule below names its evidence in its own text: either the primary source that states
it, or the explicit label *ecosystem convention* where no primary source exists. A rule labelled
ecosystem convention is this skill's house default and must never be presented as a React-team position.
Full source locations are in References.

**Exceptions.** An exception condition is policy, so it lives here, in the rule it qualifies. A rule with
no stated exception has none. A companion doc may show how to recognize a violation and what evidence an
exception needs; it never introduces an exception this file does not state.

### Must-Follow

- **H1 — MUST keep every component and hook pure.** Same output for the same props, state, and context,
  with no side effect, mutation, or subscription during render. React may render a component many times,
  interrupt a render, or discard its result, so an effect during render runs an unknown number of times.
  Fix: move the effect to an event handler, to an Effect, or outside React entirely. No exception.
  Source: react.dev Rules of React.
- **H2 — MUST call hooks only at the top level of a component or another hook.** Never inside a loop, a
  condition, a nested function, or after an early return; hook identity is positional, so a conditional
  call shifts every later hook. Fix: hoist the call and make the condition part of its arguments or its
  result. No exception. Source: react.dev Rules of React.
- **H3 — MUST name every custom hook `use` followed by a capital letter.** This is enforcement, not
  style: React's linter identifies a hook by its name, and a function that calls hooks without the prefix
  is rejected. Fix: rename it, or — if it genuinely calls no hook — make it a plain function. No
  exception. Source: react.dev, Reusing Logic with Custom Hooks.
- **H4 — MUST give every list item a key that is a stable identity from the data.** The key is how React
  matches an item to its previous instance across a render, so it must not be invented during render.
  Fix: carry an ID in the data and use it. Exception: a list that is never reordered, inserted into, or
  deleted from, and whose items hold no state, may use the index — the source states position-derived
  keys fail exactly when order changes, so a list whose order cannot change is outside the failure mode.
  Source: react.dev, Rendering Lists.
- **H5 — MUST use an Effect only to synchronize with a system outside React.** A network request, a
  subscription, a timer, the browser DOM, a non-React widget, a process bridge. If no external system is
  involved, the answer is not an Effect: derive the value during render, do the work in the event handler
  that caused it, or reset state with a `key`. No exception — the alternatives above are the mechanism,
  not a waiver. Source: react.dev, You Might Not Need an Effect.
- **H6 — MUST clean up what an Effect starts, and guard every async result against a stale render.**
  Every subscription, timer, and listener gets a cleanup function, and every awaited result is discarded
  when its render is no longer current — the documented pattern is an `ignore` flag set in cleanup.
  Without it, responses that arrive out of order overwrite newer state. No exception. Source: react.dev,
  You Might Not Need an Effect.
- **H7 — MUST keep every value crossing the server/client boundary serializable in the direction it
  crosses.** The supported sets are not symmetric: what may be a Server Function argument is not the same
  set as what may be a Server Function return value or a Server-to-Client prop. Fix: check the direction
  first, then the value; pass an identifier and re-read on the other side when the value cannot cross. No
  exception. Source: react.dev `use server` and `use client`. Depth: `server-client.md`, which carries the
  three sets themselves.
- **H8 — MUST read the recorded compiler switch before memoizing, then follow the branch it selects and
  keep both branches inside H1 and H2.** The switch is recorded at Procedure P1, and the branches are
  different mechanisms rather than different degrees of caution. **Compiler enabled.** The React Compiler
  is the memoization baseline: it applies the equivalent of manual memoization automatically, so new code
  is written without manual memoization. That optimization is sound only while components and hooks obey
  the Rules of React, and its lint layer — the `recommended` config of `eslint-plugin-react-hooks` — is
  what enforces them. Exceptions, each requiring the named reason to be recorded at the call site: (a) the
  memoized value is an Effect dependency whose identity must be held stable; (b) precise control the
  compiler's analysis cannot express is genuinely needed. **Compiler not enabled.** `useMemo`,
  `useCallback`, and `memo` are the mechanism, applied on evidence and never by default: without them a
  state change re-renders that component and all of its children. Three independent criteria select a
  site. *Render cost* — `memo` is worth adding where a component re-renders often with the same props and
  its render work is expensive. *Referential identity* — a `memo`'d child skips a render only while every
  prop it receives keeps its identity, so an object or function created during render defeats it, and
  `useCallback` or `useMemo` on that prop is what makes the `memo` real. *A held identity* — a value an
  Effect depends on is memoized to stop the Effect re-firing on an identity change that means nothing,
  which is exception (a) above applying on this branch too. Three consequences follow:
  wrapping a function that is neither a prop of a `memo`'d component nor another hook's dependency buys
  nothing; a `useState` setter already has a stable identity and never needs wrapping; and `memo` on a
  child whose props differ on every render is cost with no benefit. Source: react.dev React Compiler 1.0,
  the compiler introduction, `memo`, `useCallback`, and `useState`. Depth: `rendering.md`.
- **H9 — MUST render the element that carries the meaning, add ARIA only where no native element
  provides it, and move focus deliberately when a dialog opens and closes.** In React every `aria-*`
  attribute is written exactly as in HTML, so this is a component's output contract, not a separate
  concern. When a dialog opens, focus moves to an element inside it; when it closes, focus returns to the
  element that invoked it. Exceptions, taken verbatim from the First Rule of ARIA Use: an ARIA role,
  state, or property is warranted where the native element exists but is not implemented or lacks
  accessibility support, or where a visual design constraint rules out the element that carries the
  semantics. Source: W3C Using ARIA §2.1; W3C WAI-ARIA Authoring Practices, modal dialog pattern;
  react.dev common component props.
- **H10 — MUST prove behavior through the user-visible surface.** Find elements by role and accessible
  name, interact the way a user would, and import `act` from `react`. A test that reads component state,
  instances, or tree structure asserts the implementation, so it fails on a correct refactor and passes
  on a broken rewrite. Exception: a unit whose entire contract is a pure computation may be tested
  directly as a function. Source: react.dev `act`; the query-priority order is Testing Library's own
  guidance, named here as its owner.
- **H18 — MUST treat every Server Function argument as untrusted input and authorize the mutation on the
  server side.** Marking a function `'use server'` publishes an endpoint: its arguments are fully
  client-controlled, so it can be called with values no component of yours ever produced, and by a caller
  that never rendered your UI. Fix: validate each argument and check the caller's authority inside the
  function body, before the mutation — a check in the component that calls it guards nothing, because an
  attacker does not have to run that component, and a type annotation guards nothing either, because it is
  erased before the call arrives. No exception. Source: react.dev `use server`, security considerations
  and caveats. Depth: `server-client.md`.

### Must-Not-Follow

- **H11 — NEVER mutate props, state, context values, hook arguments or return values, or a value already
  passed to JSX.** They are immutable snapshots for the render that received them; mutating one produces
  a tree that disagrees with what React committed. Fix: build the new value and set it, and move any
  mutation to before the JSX is created. No exception. Source: react.dev Rules of React.
- **H12 — NEVER use an array index, or a value generated during render, as a key in a list that can
  reorder, insert, or delete.** An index key re-associates state with the wrong item; a render-time key
  such as a random value matches nothing on the next render, so React recreates every item and loses
  user input. Fix: a stable ID from the data. The one narrow exception is H4's static-list condition.
  Source: react.dev, Rendering Lists.
- **H13 — NEVER chain Effects where each one sets state the next one watches.** The tree re-renders
  between every step, and the chain re-fires whenever any input is set from elsewhere. Fix: compute the
  whole cascade in the one event handler that started it. Exception: a step that genuinely synchronizes
  with an external system is an Effect by H5, and its being downstream of another Effect does not make it
  a chain. Source: react.dev, You Might Not Need an Effect.
- **H14 — NEVER strip existing manual memoization while adopting the compiler without testing the
  result.** Removing it can change compilation output, and a value elsewhere in the tree may depend on
  the old identity. Fix: leave existing memoization in place, or remove it behind test coverage that
  would show the difference. Exception: removal is allowed once tests that exercise the affected tree
  pass with it gone. Source: react.dev React Compiler 1.0.
- **H15 — NEVER hold server-owned data on the client without a named trigger that refreshes or discards
  it.** Server-owned data goes stale on its own, so a client copy silently diverges from the source of
  truth the moment anything else writes it — and that is true wherever the copy sits: a client store,
  Context, or a component's own state. Fix: put it in a server cache, which is the layer whose job is
  invalidation, refetching, and staleness. Where no such layer exists, the obligation does not disappear
  with it: name the trigger that refreshes or discards the copy, make sure that trigger is in the code,
  and keep the fetch and the trigger together in one unit so the policy has an owner and can be replaced
  later. Exception: a snapshot deliberately copied for local editing — a form draft — is client state, and
  it is client state until it is submitted. *Ecosystem convention*: no React-team position states this
  rule; it is this skill's house default. Depth: `state.md`.
- **H16 — NEVER expose a raw process bridge to a renderer, and never run one with Node integration
  enabled or context isolation disabled.** Exposing a raw IPC surface gives page content access to the
  whole event system, and without context isolation a single content-injection bug becomes code
  execution. Fix: expose a narrow, named API from the preload script and validate every message. No
  exception. Source: electronjs.org security checklist, items 2, 3, 4, and 20.
- **H17 — NEVER assume a server tier exists.** Server Components, Server Functions, and streaming SSR
  require a framework or bundler that implements them; a plain browser SPA and a desktop renderer have no
  target for them at all. Fix: establish the host at P1, and use client-side data access where there is
  no server. No exception. Source: react.dev Server Components. Depth: `runtime.md` for which hosts
  implement them; `server-client.md` for what the boundary is.

**Version facts this skill pins, and the ones it does not.** React 19.2 as the documented line, and the
React Compiler's first stable release on 2025-10-07, are pinned above and in References, because they are
the facts a stale model gets wrong and they move on a multi-year cadence. Runtime, bundler, and library
versions are deliberately not pinned anywhere in this skill: they move on a scale of weeks, so a number
written here would be wrong within months and wrong in a way that reads authoritative. Point at the live
release page instead.

**Rules this skill deliberately does not carry.** Typing discipline, assertion versus annotation, module
and import mechanics, and strict-flag sets belong to `typescript`. Deep units, blast radius, naming, and
root-cause repair belong to `coding`. Restating either here would create a second owner and the two would
drift.

---

## Procedure

**MUST load `coding/SKILL.md` and `principles/SKILL.md` first**, and `typescript/SKILL.md` as well when
the source is TypeScript. This Procedure operationalizes those layers for React; it does not restate
them.

Run P1–P8 in **author mode**. In **review mode**, run P1–P4 read-only to reconstruct and grade the
existing design, skip P5–P6, and grade read-only at P7–P8, editing nothing unless the user authorizes a
fix. **P2 is the router**; these steps plus the Rules above are the floor for an ordinary component
or hook.

### P1 — Study and lock the task and the React contract

*Deepens `coding` Principle 1 and `principles` Principles 1 and 4 — study first, refine the task with the user.*

Lock What / Why / How, in and out of scope, and success with the user, or cite an existing scope
contract. Read the relevant specs, design notes, project rules, applicable mistakes, the neighboring
components, their callers, and the tests.

Then read the concrete **React contract**, which is the set of switches that decide which mechanisms are
available at all:

- the React version;
- whether the React Compiler is enabled, and with what configuration;
- **which host** — a browser SPA, a framework server, or a desktop renderer — and therefore whether a
  server tier, RSC, and streaming SSR are real targets;
- **whether the source is TypeScript or plain JavaScript** — this fork decides whether `typescript` is
  in context at all;
- the lint preset in force;
- the router, state-store, and server-cache libraries already present;
- the styling mechanism, and whether it is compatible with the rendering model in use.

**Declare author or review mode.** For an edit, map the affected set — callers, tests, stories, types,
and docs — with CRUD and 5W1H. For a bug, reproduce it before tracing it to the root.

**P1 is complete when** scope and success are explicit or a scope contract is cited, every switch above
has an answer, the mode is declared, and the affected set or the reproduced failure is recorded.

### P2 — Load the companion for the fork in play

*Deepens `coding` Principle 1 — study the prior art the decision needs.*

Read the companion **before** the decision it governs, and re-run this routing when the design changes.
An ordinary component needs no companion to be correct; the Rules above stay the floor after one loads.

| Read | When |
|---|---|
| `rendering.md` | Deciding what re-renders and why, whether a value needs memoizing under either compiler branch, how `key` and position decide what keeps state, or whether scheduling work as a transition is the right answer |
| `server-client.md` | Designing any value that crosses the server/client boundary, choosing or reading a directive, building on Server Functions and the Actions family, or working on streaming server rendering and hydration |
| `runtime.md` | Establishing the host at P1, moving code between hosts, or answering what a browser application, a framework server, and a desktop renderer each do and do not support |
| `state.md` | Placing a datum — which rung of the ladder owns it, when it is promoted, whether it should be stored at all, and what a client copy of server-owned data has to carry |
| `scenarios.md` | Self-review before handoff, or the good, bad, and adversarial probes for the area being changed |
| `checklists.md` | Answering the activated binary `REACT-CHECK-*` items at P8 |
| `evaluation.md` | Grading the React idiom of a change-set — it routes an evaluator to the scenarios, the checks, and the verifications |

**P2 is complete when** every active fork has been read before its decision, and the pre-handoff or
evaluation path is routed.

### P3 — Design the units and the boundaries, decomposed

*Deepens `coding` Principles 2, 3, and 4 and `principles` Principle 3 — design the contract, deep units, decompose by responsibility.*

Design as ordered acts, not one flat choice, and finish with no behavior body written:

1. **Fix the region and its boundaries.** Which part of the tree changes, which side of the
   server/client line it sits on, and which host it runs on.
2. **Place every datum and name its owner.** Local, lifted, context, client store, or server cache — and
   for each, the one thing that owns it. Anything derivable is computed, not stored.
3. **Pick the unit shape.** A component when it renders, a custom hook when stateful logic is reused, a
   plain function when neither is true. A hook that calls no hook is a plain function.
4. **Narrow and type the prop surface.** Pass the fields the unit reads. When the source is TypeScript,
   the props type is designed here, not inferred later.
5. **Decide what renders when.** What triggers each re-render, and which values, if any, need an Effect
   under H5.
6. **Place the failure and loading boundaries.** Where an error boundary catches, and where a loading
   state is revealed. An error boundary is a class component: React provides no function-component
   equivalent.

**P3 is complete when** every unit has one responsibility and an earned shape, every datum has exactly
one owner, the boundaries are placed, and no behavior exists yet.

### P4 — Confirm the design with the user

*Deepens `principles` Principle 3 — design with the user, from references.*

Present the React **design packet**: the component-tree sketch, the prop and type surface, the
state-placement table with owners, the boundary map (server/client and host), the error and loading
boundary placement, and one credible alternative from P3. Record the approval, or cite an
already-explicit decision.

**Author mode only.** In review mode, reconstruct the existing packet and grade it without editing.

**P4 is complete when** the packet is approved or a prior decision is cited, or — in review mode — the
existing design is reconstructed and graded.

### P5 — Build the skeleton first

*Deepens `coding` Principle 7 and `principles` Principle 2 — build bottom-up, skeleton first.*

Materialize the approved design before any behavior: the components, the custom hooks, and the prop
types, with stub bodies that render static markup. It must type-check, when the source is TypeScript, and
render without error before a single behavior exists. A structural mistake returns through P2–P4 rather
than being buried in a body.

**P5 is complete when** the skeleton matches the approved packet, renders, and type-checks green with no
behavior implemented.

### P6 — Grow in minimal verified slices

*Deepens `coding` Principles 7, 8, and 15 — grow verified, build only what is needed, move the whole affected set.*

Implement one slice at a time and verify it before starting the next. Apply the Rules as you write, and
follow the surrounding code where it does not contradict one. Every affected caller, test, story, type,
and doc moves in the **same slice**. Add nothing beyond the contract, and leave no placeholder.

**P6 is complete when** every in-scope path is implemented, each slice had fresh evidence before the
next, and every affected surface moved with it.

### P7 — Verify the whole change

*Deepens `coding` Principle 6 and `principles` Principle 8 — design for verification, prove the root cause is gone.*

Run these gates in order on the final tree, fixing each failure before the next. Each gate is
self-failing.

1. **Format** — the project formatter, in check mode.
2. **Lint** — including the `recommended` config of `eslint-plugin-react-hooks`, which is what enforces
   H1, H2, and H8.
3. **Type-check** — when the source is TypeScript.
4. **Component tests** — the ones covering the changed units.
5. **Full test suite.**
6. **End-to-end tests** — when a host boundary is in play.
7. **Build** — and for a desktop host, a check against the actual packaged build, not only the dev
   server: routing and asset resolution differ between the two, so a dev-server pass proves nothing about
   the shipped app.

For a bug, re-run the P1 reproducer last.

**P7 passes only when** every applicable gate exits clean on fresh output and the reproducer no longer
fires.

### P8 — Review on three axes, then trace

*Deepens `principles` Principle 9 and `coding` Principle 15 — CRUD and 5W1H, change with blast-radius awareness.*

Grade three independent axes. They are independent in practice: a change can satisfy both of the first
two and still be wrong React, and it can be fluent React and still fail a property.

| Axis | Graded with | Question |
|---|---|---|
| Property | `../coding/evaluation.md` | Is this good software, in any language? |
| Language idiom | `../typescript/evaluation.md` | Is this idiomatic TypeScript? Omitted on a plain-JavaScript codebase |
| React idiom | `evaluation.md` | Is this idiomatic current React? |

For a pre-handoff self-check, read `scenarios.md` for the probes that match the change, then answer the
activated binary `REACT-CHECK-*` items in `checklists.md`; a failed item returns to the step that owns
it. An evaluator enters through `evaluation.md`.

Then run **traceability**: every approved P4 design item maps to an implemented unit; every scope item
maps to a diff line and nothing exceeds it; every file in the P1 affected set is updated or is a
justified no-op; every success criterion has fresh evidence; and no caller, test, story, or type is left
stale.

**P8 is complete when** all applicable axes pass, every activated check passes, the change traces to the
approved design and scope, and nothing in the affected set is stale.

---

## References

One owner per borrowed fact; the body states the fact and this register names its owner.

- [`coding/SKILL.md`](../coding/SKILL.md#scope--language-agnostic) — owns the language-agnostic
  properties of good software that this skill specializes into React idioms.
- [`typescript/SKILL.md`](../typescript/SKILL.md) and [`typescript/typing.md`](../typescript/typing.md) —
  own the TypeScript language and type-system mechanics this skill never restates.
- [`principles/SKILL.md`](../principles/SKILL.md) — owns the ten behavioral principles this Procedure
  operationalizes for React.
- [Rules of React](https://react.dev/reference/rules) — purity and idempotence, side effects outside
  render, the immutability of props, state, and values passed to JSX, and hooks only at the top level
  (H1, H2, H11).
- [Rendering Lists](https://react.dev/learn/rendering-lists) — keys must be stable, unique among
  siblings, and not generated during render; index keys fail when order changes (H4, H12).
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) — the Effect
  escape-hatch model, the catalogue of cases that need no Effect, the race condition and its `ignore`
  cleanup flag, and the chain-of-Effects anti-pattern (H5, H6, H13).
- [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks) — hook names
  must start with `use` followed by a capital letter, and the linter enforces it (H3).
- [React Compiler 1.0](https://react.dev/blog/2025/10/07/react-compiler-1) — the first stable release,
  dated 2025-10-07; `useMemo` and `useCallback` retained as escape hatches; the warning that removing
  existing memoization can change compilation output (H8, H14).
- [React Compiler introduction](https://react.dev/learn/react-compiler/introduction) — automatic
  memoization as the equivalent of manual memoization, and the compiler's dependence on the Rules of
  React (H8).
- [`memo`](https://react.dev/reference/react/memo) — memoization is a performance optimization and not a
  guarantee; it is only valuable for frequent re-renders with the same props and expensive render work,
  and it is useless when the props are always different because a prop was created during render (H8).
- [`useCallback`](https://react.dev/reference/react/useCallback) — caching a function is valuable only
  when it is passed to a component wrapped in `memo` or used as another hook's dependency (H8).
- [`useState`](https://react.dev/reference/react/useState) — the set function has a stable identity (H8).
- [`use server`](https://react.dev/reference/rsc/use-server) and
  [`use client`](https://react.dev/reference/rsc/use-client) — the serializable-argument set, the
  serializable-prop set, and the sentence that makes return values follow the prop set (H7); and the
  security considerations and caveats stating that Server Function arguments are fully client-controlled
  and that mutations must be authorized (H18).
- [Server Components](https://react.dev/reference/rsc/server-components) — Server Components render ahead
  of time in a separate environment, there is no directive for them, and they are implemented by a
  bundler or framework (H17).
- [`act`](https://react.dev/reference/react/act) — `act` is imported from `react` (H10).
- [Common component props](https://react.dev/reference/react-dom/components/common) — in React, every
  ARIA attribute name is exactly the same as in HTML (H9).
- [React versions](https://react.dev/versions) — the documented React line, currently 19.2.
- [Using ARIA](https://www.w3.org/TR/using-aria/) — the First Rule of ARIA Use and its four exception
  conditions (H9).
- [WAI-ARIA Authoring Practices, modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
  — focus moves into the dialog on open and returns to the invoking element on close (H9).
- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security) — Node
  integration disabled, context isolation and the sandbox enabled, and no raw Electron or IPC surface
  exposed to page content (H16).
- [Testing Library queries](https://testing-library.com/docs/queries/about/) — the query-priority order
  that puts role and accessible name first (H10).
