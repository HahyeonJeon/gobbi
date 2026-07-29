# React — State Placement

**Ownership** — where a value lives and what that costs: whether it should be stored at all, the ladder of
homes from local to a server cache, the condition that promotes a datum one rung, `useState` against
`useReducer`, refs as the non-rendering slot, and what a client copy of server-owned data has to carry
when no cache layer exists to carry it.

**Split criterion** — `skill-writing` P4, category *a long lookup reference*: it is opened at one decision
— "where does this value go" — and read a rung at a time. P4's other three categories do not describe it:
no artifact set, no per-unit orchestration, not a sub-procedure another consumer loads.

This doc **deepens, and does not restate,** `SKILL.md` Principle 3 and Rules `H5` and `H15`, and the
`state.md` row of the P2 router. Neighbours it points at rather than repeats: what happens when a value
changes, including how `key` resets state at a position, is [`rendering.md`](rendering.md) §2 and §4;
which hosts even have a server tier is [`runtime.md`](runtime.md); how a fetch and its cleanup are written
is `SKILL.md` `H5` and `H6`. A claim with no primary source is labelled *ecosystem convention* where it is
made; §7 lists every source and every open item.

**The line against the library question.** This file owns the slot taxonomy and the placement rule, which
are properties of React and do not move. Which library currently occupies a slot, and whether it is still
maintained, is a different and faster-moving question that this skill answers elsewhere; the test is that
**a sentence that could become false without React changing does not belong here.** No library and no
version is named in this file, deliberately.

---

## 1. First question: should it be state at all?

Most placement mistakes are one rung too high because the value should not have been stored in the first
place.

- **Anything derivable is derived.** *"If you can calculate some information from the component's props or
  its existing state variables during rendering, you should not put that information into that component's
  state."* The reason is not economy, it is correctness: *"Removing redundant and duplicate data from state
  helps ensure that all its pieces stay in sync."*
- **Do not mirror a prop into state.** react.dev calls this out by name as *"a common example of redundant
  state"*: initializing a state variable from a prop captures the prop's first value and then ignores it.
- **Do not duplicate one fact across two slots.** *"When the same data is duplicated between multiple state
  variables, or within nested objects, it is difficult to keep them in sync."* This is `SKILL.md`
  Principle 3's "one owner" read from the failure side: two homes means two answers, and nothing decides
  which is right.

A value survives to the ladder only if it is genuinely stored: it changes over time, it cannot be computed
from what the component already has, and something renders from it.

## 2. The ladder

Five rungs, lowest first. **Start at the bottom and promote only on the stated condition** — each rung
costs more than the one below it in reach, in coupling, and in what re-renders.

| Rung | Home | Promote to the next rung when |
|---|---|---|
| 1 | **Local** — `useState` in the component that renders from it | A sibling needs to read or write the same value |
| 2 | **Lifted** — the same state, moved to the closest common parent, passed down as props | The prop path is long enough that intermediate components carry data they do not use, *and* extracting components has not removed it |
| 3 | **Context** — a provider above the readers | The value is genuinely tree-wide, changes rarely, and props have been tried |
| 4 | **External client store** — a store outside React, read by subscription | Client-owned state is shared across distant parts of the tree, updates frequently enough that context re-renders hurt, or must live outside the React tree's lifetime |
| 5 | **Server cache** — the layer that owns fetching, invalidation, and staleness | The data is owned by a server. This rung is not reached by promotion; see §5 |

### Rung 1 → 2, lifting

The mechanic is exact: *"remove state from both of them, move it to their closest common parent"*, then
pass it back down. What makes this the second rung rather than the first is that lifting is cheap and
local — it moves one value up a short distance, and every reader still receives it explicitly.

### Rung 2 → 3, context, and why it is later than people expect

*"Context lets a parent component provide data to the entire tree below it."* That reach is the cost as
well as the feature, which is why react.dev puts a list of alternatives ahead of it: *"Context is very
tempting to use! However, this also means it's too easy to overuse it. Just because you need to pass some
props several levels deep doesn't mean you should put that information into context."*

The two alternatives it names, in order:

- ***"Start by passing props."*** *"If your components are not trivial, it's not unusual to pass a dozen
  props down through a dozen components. It may feel like a slog, but it makes it very clear which
  components use which data!"*
- ***"Extract components and pass JSX as children to them."*** *"If you pass some data through many layers
  of intermediate components that don't use that data (and only pass it further down), this often means
  that you forgot to extract some components along the way."*

The uses react.dev does endorse are the tree-wide, slow-moving ones — *"theming"*, *"current account"*,
and *"routing"*, which *"most routing solutions use context internally"* to hold.

One placement consequence belongs here because it is about where the value lives, not about rendering: a
fast-changing value in context re-renders every reader, and memoizing the reader does not stop it —
*"skipping re-renders with `memo` does not prevent the children receiving fresh context values."* The
repair is placement, not memoization: move the fast-changing part down, or out to rung 4. Why that is so,
and what memoization can and cannot do, is [`rendering.md`](rendering.md) §2 and §6.

### Rung 3 → 4, an external client store

The promotion condition is about **client-owned** state that has outgrown context: shared across distant
branches, updated often enough that context's re-render behavior is the problem, or required to outlive
any particular tree. *Ecosystem convention* — the rung itself is a real architectural slot, but React
publishes no position on external stores, and the libraries occupying this rung are not named here.

What React does provide for reading one safely is `useSyncExternalStore`, and its subscription lifecycle
is the hook's rather than an Effect's: you call it at the top level and pass a subscribe function, and
*"the subscribe function should subscribe to the store and return a function that unsubscribes."* Do not
rebuild that as a `useState`-plus-Effect subscription — [`async.md`](async.md) §3 is why: that ad-hoc
shape is what the primitive exists to replace, and it tears during concurrent rendering.

`H6`'s create-and-clean-up model still governs an external subscription that has **no** React-consumable
adapter — a push channel from a host process, for instance, which [`runtime.md`](runtime.md) §3 handles
that way. The distinction is whether a subscribe/unsubscribe pair can be handed to the primitive, not
whether the value lives outside React.

## 3. `useState` or `useReducer`

Same rung, different shape. react.dev's own comparison, condensed to the axes it names and quoted where it
is decisive:

| Axis | `useState` | `useReducer` |
|---|---|---|
| Code size | *"with `useState` you have to write less code upfront"* | More upfront, but *"can help cut down on the code if many event handlers modify state in a similar way"* |
| Readability | *"very easy to read when the state updates are simple"* | *"lets you cleanly separate the how of update logic from the what happened of event handlers"* |
| Debugging | Hard to tell *"where the state was set incorrectly, and why"* | A log in the reducer shows *"every state update, and why it happened (due to which action)"* |
| Testing | — | *"A reducer is a pure function that doesn't depend on your component"*, so it can be exported and tested separately |

react.dev closes the comparison with *"personal preference: some people like reducers, others don't"* — so
this is a judgment, not a rule. The signal worth acting on is the one the axes agree about: several event
handlers changing the same state in related ways is when a reducer starts paying, and a single independent
value is when it does not.

## 4. Refs — the slot that does not render

A ref is state's non-rendering counterpart: retained across renders like state, but *"unlike state, setting
the ref's current value does not"* re-render — *"changing a ref does not!"* That makes it the right home
for a value the component must remember and never display: a timer id, a previous value kept for a
comparison, a stored DOM node.

The constraint that makes it a distinct rung rather than a cheaper `useState`: *"You shouldn't read (or
write) the current value during rendering"*, and *"if some information is needed during rendering, use
state instead."* The one documented render-time exception is deterministic initialization:
`if (ref.current === null) { ref.current = new StableValue(); }`. It is allowed only when the guard runs
during initialization, construction is stable, replay produces the same result, and construction performs
no I/O and has no user-visible or external side effect. Reading a changing ref into JSX, assigning on every
render, constructing an I/O resource, using time or randomness, or depending on a replay-varying value is
still a purity violation under `H1`, not merely a style preference.

## 5. Server-owned data — the rung you may not be able to reach

Rung 5 is not reached by promotion. Data is server-owned from the start, and `H15` states the obligation:
never hold it on the client without a named trigger that refreshes or discards it.

**Why a cache is the answer when one is available.** react.dev names the problems that a server-data layer
exists to solve, and the list is longer than most readers expect: *"Handling race conditions is not the
only difficulty with implementing data fetching. You might also want to think about caching responses (so
that the user can click Back and see the previous screen instantly), how to fetch data on the server (so
that the initial server-rendered HTML contains the fetched content instead of a spinner), and how to avoid
network waterfalls (so that a child can fetch data without waiting for every parent)."* And it says whose
problem that is: *"These issues apply to any UI library, not just React. Solving them is not trivial, which
is why modern frameworks provide more efficient built-in data fetching mechanisms than fetching data in
Effects."*

### When there is no cache layer and no framework

This is the ordinary case in a plain client application, and it has an answer rather than a prescription
you cannot follow. react.dev's own: *"If you don't use a framework (and don't want to build your own) but
would like to make data fetching from Effects more ergonomic, consider extracting your fetching logic into
a custom Hook"*, because *"moving the data fetching logic into a custom Hook will make it easier to adopt
an efficient data fetching strategy later."*

So the honest answer to "I have no cache library" is not "hold it in `useState` and move on", and it is
not "adopt a library". It is:

1. **Put the fetch, its cleanup, and its refresh trigger in one custom hook.** The hook is the owner. That
   is what makes the policy findable, testable, and replaceable, and it is what the quoted advice above is
   for. Writing the fetch and its `H6` cleanup is `SKILL.md`'s, not repeated here.
2. **Name the trigger**, from §6. A copy with no trigger is what `H15` forbids and what `REACT-CHECK-16`
   and `REACT-CHECK-26` fail — and note that holding the data in the component's own state does not make
   either item inapplicable. Local state is a slot like any other.
3. **Write down what you are not doing.** If the hook has no response cache, no request deduplication, and
   no server-render story, those are the parts of the quoted list you are going without. Recording that is
   what makes a later decision to adopt a layer a decision rather than a rediscovery.

### The anti-pattern this rung exists to prevent

Fetching server data once and then treating the client copy as the source of truth — in a store, in
context, or in local state. It reads as clean code, and the divergence appears only when something else
writes the record: a second client, a background job, another window. *Ecosystem convention*, and `H15`'s
own evidence class: no React-team position states this rule, so a finding against it is a violation of
this skill's house default and must be reported as such, never as a React-team position.

## 6. Choosing a staleness trigger

`H15` and `REACT-CHECK-26` require a *named* trigger. This is the menu and the basis for choosing, which
the rules deliberately do not carry. Every entry is *ecosystem convention* — React publishes no policy
here — and the choice is driven by one question: **how long does the surface stay mounted, and how bad is
a stale read?**

| Trigger | Refreshes when | Fits | Does not fit |
|---|---|---|---|
| **Remount** — the component fetches on mount, and identity changes remount it via `key` | The user navigates in, or the identity changes | Short-lived surfaces; a detail pane keyed by the record it shows | A surface that stays mounted for hours — the only refresh is one that never comes |
| **After the mutation that changed it** — the code that writes re-reads, or discards the copy | Your own application changed the record | Anything you also mutate; the cheapest correct trigger, and the one most often skipped | A record other clients or a backend job change |
| **On focus or visibility** — refresh when the window or tab is looked at again | The user returns after being away | Desktop and long-lived surfaces, where "away" is the common staleness window | A surface nobody navigates away from |
| **Interval** — refresh on a timer | Time passes | Data with a known tolerable age; dashboards | Data that must be exact on read; it also costs requests whether or not anyone is looking |
| **Push** — the server or the host tells the client the record changed | The source of truth changes | The strongest answer where a channel already exists — a socket, or a desktop host's own event bridge | Where no channel exists; do not build one for this alone |

Two rules of thumb for using the table, both convention:

- **A long-lived surface needs a trigger that fires while it stays mounted.** Remount is not one. An
  operator console open all day, whose only refresh is remount-on-identity-change, has no refresh at all
  for the record it is already showing — that is the exact case `REACT-CHECK-26` is written to catch.
- **Triggers compose, and the cheap one is often enough.** Re-reading after your own mutation plus a
  focus refresh covers most surfaces without a timer or a channel. Add the expensive ones only when a
  named case needs them.

## 7. Sources and evidence classes

Sources other than `useRef` were read on 2026-07-26; `useRef` was read on 2026-07-27. Every quoted
sentence was located in its page on that date. `SKILL.md`'s References register owns the rule-level
citations.

| Source | What it supports here |
|---|---|
| [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure) | §1 — do not store what can be calculated during rendering, do not mirror a prop, and why duplication is the sync problem |
| [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components) | §2 — lifting removes state from both children and moves it to their closest common parent |
| [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context) | §2 — context's reach, the two alternatives to try first, and the endorsed tree-wide use cases |
| [`useContext`](https://react.dev/reference/react/useContext) | §2 — `memo` does not stop a context update reaching its readers |
| [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore) | §2 — the subscribe function subscribes to the store and returns the function that unsubscribes |
| [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer) | §3 — the four comparison axes and the closing "personal preference" |
| [Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs) | §4 — changing a ref does not re-render, and refs are not read or written during rendering |
| [`useRef`](https://react.dev/reference/react/useRef) | §4 — the narrow predictable initialization exception guarded by `ref.current === null` |
| [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) | §5 — the four difficulties a data layer solves, why frameworks provide one, and the custom-hook answer for a project with neither |

**Ecosystem convention in this file**, named where it appears and never as a React-team position: the
external-store rung and its promotion condition; the staleness-trigger menu in §6 and both rules of thumb;
and `H15` itself, which `SKILL.md` labels the same way.

**Deliberately absent.** No library and no version is named anywhere in this file, for the reason in the
header: which product occupies a rung is a claim that can go stale without React changing, and this file
carries only claims that cannot.
