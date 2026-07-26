# React — Rendering and Memoization

**Ownership** — the single doc that owns how a React tree reaches the screen and what that costs: the
trigger/render/commit pipeline, what actually causes a re-render, purity as an operational property rather
than a slogan, how position and `key` decide which state survives, both memoization branches with the
criteria that select a site in each, the hazard of removing memoization while adopting the compiler, what
scheduling work as a transition does and does not save, and where React stops and a third-party library
begins for very long lists.

**Split criterion** — `skill-writing` P4, category *a long lookup reference*: this is material a reader
opens at one decision — will this re-render, does this need memoizing, will this state survive — and not
end to end. P4's other three categories do not describe it: it owns no artifact set, orchestrates no
per-unit work, and is not a sub-procedure another consumer loads.

This doc **deepens, and does not restate,** `SKILL.md` Principles 2 and 5, Rules `H1`, `H4`, `H8`, `H11`,
`H12`, and `H14`, and the `rendering.md` row of the P2 router. Every normative statement and every
exception condition lives in `SKILL.md`; what follows is the mechanism behind them, the recognition
signals, and the sources. A claim with no primary source is labelled *ecosystem convention* where it is
made; §10 lists every source used here and the date it was read.

---

## 1. Trigger, render, commit

Any screen update happens in three steps, and separating them is what makes the rest of this doc
measurable.

| Step | What happens |
|---|---|
| **Trigger** | Something asks for a render: the initial render of the app, or a state update through a `set` function. |
| **Render** | React *calls* your components. On the initial render it calls the root component; on a re-render it calls the component whose state update triggered it. The process is recursive: whatever a component returns is rendered next, and so on down. |
| **Commit** | React modifies the DOM — and only where it must: *"React does not touch the DOM if the rendering result is the same as last time"* |
| *Epilogue* | The browser repaints. react.dev calls this "painting" to keep it distinct from React's own rendering. |

The word "render" therefore means *calling a function*, not writing to the DOM. A re-render that produces
the same output costs a call and a comparison, not a paint. That is why `H8` treats an extra render as a
cost to be named rather than a fault to be eliminated by default, and why "it re-rendered" is never on its
own a defect report — the question is how often, and how expensive the call is.

## 2. What triggers a re-render

| Trigger | What re-renders |
|---|---|
| The initial render | The whole tree, from the root down |
| A state update through a `set` function | The component that owns the state, and its children |
| A context value change | Every component reading that context, starting from the provider that received a different value |
| A parent re-rendering | Its children — unless memoization stops the cascade |

The last two rows are the ones that surprise readers.

- The child cascade is the default, not an accident: *"when a component's state changes, React will
  re-render that component and all of its children — unless you have applied some form of manual
  memoization with `useMemo()`, `useCallback()`, or `React.memo`"*. This single sentence is why §6 exists
  at all: with no compiler and no manual memoization, one state update at the top re-renders everything
  beneath it.
- `memo` does not stand between a component and its context: *"Skipping re-renders with `memo` does not
  prevent the children receiving fresh context values."* A component that reads a fast-changing context
  re-renders on every change no matter how it is wrapped, so the fix is where the value lives, not how the
  reader is memoized.

## 3. Purity in practice

React assumes every component is a pure function: same inputs, same output, and no mutation of anything
created before the call. `H1` states the rule; this is how the violation shows itself.

- **Strict Mode is the detector.** React *"calls each component's function twice during development"*, and
  *"by calling the component functions twice, Strict Mode helps find components that break these rules."*
  It *"has no effect in production"*. A component that is right the first time and wrong the second — a
  doubled counter, a duplicated list entry, two subscriptions — has an impure render path, and the double
  call is the surface that makes it visible before a user finds it.
- **The common impure shapes** are mutating a prop or a value created before the call (a sort in place, a
  push into an array that arrived as a prop), writing to a module-level variable during render, and
  starting a subscription on the way to returning JSX. The first two are also `H11`.
- **`useMemo` runs during render**, so an impure `useMemo` factory is an impure render. Memoizing an
  effectful computation hides the impurity behind an optimization; it does not remove it.
- **Purity is the compiler's precondition.** The compiler's optimization is sound only while the Rules of
  React hold, so on a codebase with the compiler enabled an impurity is not a local defect — it is a
  licence for the compiler to cache something it should not.

## 4. Identity: position, `key`, and what resets state

*"React keeps state for as long as the same component is rendered at the same position."* Two consequences
carry most of the everyday cases.

- **Same component, same position → state is preserved.** Two different `<Counter />` JSX tags in the same
  slot are the same counter to React, even when the surrounding markup differs by a condition.
- **Different component, same position → state is discarded**, for the whole subtree: *"when you render a
  different component in the same position, it resets the state of its entire subtree."*

A `key` overrides position: *"Specifying a key tells React to use the key itself as part of the position,
instead of their order within the parent."* That makes `key` the mechanism `H5` points at when a component
must forget what it knew — no Effect is involved.

```jsx
// Switching customers must not carry the previous customer's panel state.
// The key makes each customer a distinct position, so React discards the old state.
function Workspace({ customerId }) {
  return <OrdersPanel key={customerId} customerId={customerId} />;
}
```

*Source for this example:* react.dev, Preserving and Resetting State, "Option 2: Resetting state with a
key" — *"Specifying a key tells React to use the key itself as part of the position, instead of their order
within the parent."* The reset in the snippet is that sentence applied: a new key is a new position, and a
new position gets fresh state.

Two riders that prevent the usual misreadings:

- **Keys are not globally unique** — *"Remember that keys are not globally unique."* They distinguish
  siblings, so the same key value under two different parents is fine.
- **Remounting is not free.** A key change discards the subtree's state, and with it any work in flight
  that lives in that state. Where a component is keyed on a value the user changes rapidly, every change is
  a full remount — that is the intended behavior, and it is also the reason `H6`'s cleanup and staleness
  guard matter most exactly there.

In a list the same mechanism explains `H4` and `H12`: an index key *is* a position key, so state follows
the slot rather than the item, and a key generated during render matches nothing on the next render.

## 5. Memoization, branch 1 — the compiler is enabled

Read the switch first (`SKILL.md` Procedure P1). Where the React Compiler is enabled it is the baseline,
and this branch is short because the mechanism is automatic.

- **What it does.** It *"automatically applies the equivalent of manual memoization, ensuring that only the
  relevant parts of an app re-render as state changes"*, and it also memoizes expensive calculations made
  during render inside a component or hook — but not a plain function outside one. By default it works from
  its own analysis and heuristics, and *"in most cases, this memoization will be as precise, or moreso, than
  what you may have written."*
- **What it depends on.** The Rules of React. The compiler *"understands the Rules of React"* and its
  rollout *"will depend on the health of your codebase and how well you've followed"* them — which is why
  `H8` binds both branches to `H1` and `H2`.
- **What enforces that dependency.** The lint layer: *"Compiler-powered lint rules ship in
  `eslint-plugin-react-hooks`'s `recommended` and `recommended-latest` preset."* The linter does not
  require the compiler to be installed, so a codebase can adopt the enforcement before the optimization.
  The recognition signal for a hollow adoption is the reverse: the compiler is on and the preset is not, so
  nothing checks the purity the optimization rests on.
- **When a manual memo still earns its place.** `useMemo` and `useCallback` remain *"an escape hatch to
  provide control over which values are memoized"*, and the documented case is the first exception `H8`
  states: *"if a memoized value is used as an effect dependency, in order to ensure that an effect does not
  fire repeatedly even when its dependencies do not meaningfully change."* The second exception — precise
  control the analysis cannot express — is the same escape hatch used deliberately. Both require the reason
  at the call site; that requirement is `SKILL.md`'s, not this doc's.

The React Compiler's first stable release is dated 2025-10-07. That date and the React line are the only
version facts this skill pins, for the reason `SKILL.md` states.

## 6. Memoization, branch 2 — the compiler is not enabled

This branch is the mechanism, not a fallback. Work it in order; the first question that answers "no" ends
the decision.

1. **Is anything re-rendering often enough to matter?** The default is no memoization. §2's cascade tells
   you what re-renders; measure or reason about frequency before optimizing.
2. **Calculation cost — the case that needs no `memo`'d child at all.** *"By default, React will re-run
   the entire body of your component every time that it re-renders"*, and *"usually, this isn't a problem
   because most calculations are very fast. However, if you're filtering or transforming a large array, or
   doing some expensive computation, you might want to skip doing it"* — which is what `useMemo` is for:
   *"a React Hook that lets you cache the result of a calculation between re-renders."* The saving applies
   only while the dependencies are unchanged, so a dependency that changes every render buys nothing.
   **Measure rather than guess**: *"In general, unless you're creating or looping over thousands of
   objects, it's probably not expensive"*, and the source's own method is to time it —
   `console.time('filter array')` around the call, then perform the interaction and read the log.
3. **Render cost.** *"Optimizing with `memo` is only valuable when your component re-renders often with the
   same exact props, and its re-rendering logic is expensive."* Both halves are required: frequent
   re-renders with cheap output are not worth a comparison, and expensive output that renders once is not
   worth caching.
4. **Referential identity.** This is the criterion the render-cost sentence does not cover, and it is the
   one most decisions actually turn on. A `memo`'d child compares its props, so it skips a render only
   while those props keep their identity: *"Keep in mind that `memo` is completely useless if the props
   passed to your component are always different, such as if you pass an object or a plain function defined
   during rendering."* The pairing is deliberate — *"this is why you will often need `useMemo` and
   `useCallback` together with `memo`."*
5. **Where `useCallback` pays, and where it does not.** *"Caching a function with `useCallback` is only
   valuable in a few cases: You pass it as a prop to a component wrapped in `memo` … The function you're
   passing is later used as a dependency of some Hook."* Outside those two, *"there is no benefit to
   wrapping a function in `useCallback`"*.
6. **What is already stable.** *"The set function has a stable identity, so you will often see it omitted
   from Effect dependencies, but including it will not cause the Effect to fire."* A `useState` setter
   passed down needs no `useCallback`, and listing one as a dependency changes nothing.
7. **What memoization cannot reach.** A context value: see §2. Wrapping the reader does not stop it.

### The pair, defeated and repaired

```jsx
import { memo } from 'react';

// Defeated: Row is memoized, but onSelect is a new function on every render of
// List, so Row's prop comparison always fails and Row re-renders anyway — the
// memo now costs a comparison and saves nothing.
const Row = memo(function Row({ order, onSelect }) {
  return <li><button onClick={() => onSelect(order.id)}>{order.reference}</button></li>;
});

function List({ orders, select }) {
  return orders.map((order) => (
    <Row key={order.id} order={order} onSelect={() => select(order.id)} />
  ));
}
```

```jsx
import { memo, useCallback } from 'react';

// Repaired: one callback keeps its identity across List's renders, so Row's
// comparison can succeed. `select` here is a useState setter, whose identity is
// already stable, so the dependency is honest and never changes.
const Row = memo(function Row({ order, onSelect }) {
  return <li><button onClick={() => onSelect(order.id)}>{order.reference}</button></li>;
});

function List({ orders, select }) {
  const onSelect = useCallback((id) => select(id), [select]);
  return orders.map((order) => (
    <Row key={order.id} order={order} onSelect={onSelect} />
  ));
}
```

*Source for this example:* react.dev, React Compiler introduction, the Note under "Before React Compiler",
which shows the same `onClick={() => handleClick(item)}` prop and states *"This means that `Item` will
always receive a new `onClick` prop, breaking memoization."* The defeat and its repair are that sentence
and react.dev `memo`'s *"completely useless if the props passed to your component are always different"*
applied to a list row.

Note what did **not** change: the arrow inside `Row`'s own `onClick` is fine. It is a DOM event handler on
a host element, not a prop handed to a memoized component, so its identity is never compared. The rule is
about props crossing into a `memo`'d boundary, not about arrow functions in general.

### The decision, in one table

| Situation | Answer |
|---|---|
| A `memo`'d child receives an inline arrow or object literal | Give the prop a stable identity (`useCallback` / `useMemo`, or declare it outside the component) — or drop the `memo`, which is currently buying nothing |
| A function is passed to an ordinary child, and no hook depends on it | Leave it alone |
| A `useState` setter is passed down | Leave it alone — its identity is already stable |
| A value is an Effect dependency whose identity must not churn | Memoize it; this is the exception `H8` names in both branches |
| A calculation in this component's own body is measurably slow | `useMemo` it — and check the dependencies actually hold still, or it saves nothing |
| A child re-renders often with the same props and its render is expensive | `memo` it |
| A child's props are rebuilt on every render anyway | Fix the props first; `memo` alone changes nothing |
| A component reads a fast-changing context | Memoization will not help; move the value, not the reader |

## 7. Removing legacy memoization while adopting the compiler

`H14` forbids stripping existing manual memoization without testing the result. The reason is in the
source: for existing code, react.dev recommends *"either leaving existing memoization in place (removing it
can change compilation output) or carefully testing before removing the memoization."*

"Carefully testing" has a specific meaning here, because most tests cannot see the difference. A test that
asserts rendered output will pass either way; what changes is *identity*, so the test has to observe
something identity-sensitive — an Effect's firing count where the removed value was a dependency, a render
count on a formerly memoized child, or a subscription that is torn down and recreated. If no test in the
affected tree observes identity, the removal is unverified no matter how green the suite is, and `H14`'s
exception has not been met.

## 8. Scheduling: a transition deprioritizes, it does not remove work

A transition changes *when* work interrupts the user, not *how much* work there is.

- *"State updates marked as Transitions will be non-blocking and will not display unwanted loading
  indicators."*
- *"A state update marked as a Transition will be interrupted by other state updates."* The background
  render restarts rather than blocking the keystroke that interrupted it: *"if there's another update to
  the value, React will restart the background re-render from scratch"*, and *"any updates caused by events
  (like typing) will interrupt the background re-render and get prioritized over it."*
- The work itself is untouched, and react.dev says so about the adjacent API: *"`useDeferredValue` does not
  by itself prevent extra network requests"* — *"what's being deferred here is displaying results (until
  they're ready), not the network requests themselves."*

Two consequences for a decision:

- **A transition is not a substitute for making the work cheaper.** If a render is expensive, deferring it
  keeps the input responsive while the same expensive render happens repeatedly in the background. Reduce
  the work — fewer rows, a cheaper row, a memoized subtree — and use the transition to keep the app
  responsive while what remains happens.
- **Deferring depends on branch 2's mechanism when the compiler is off.** The documented optimization works
  because the slow child's props did not change: *"during that re-render, `deferredText` still has its
  previous value, so `SlowList` is able to skip re-rendering (its props have not changed)"* — which only
  holds if that child is memoized and its other props keep their identity, exactly §6.
- **Not for controlled input state.** *"Transitions are non-blocking, but updating an input in response to
  the change event should happen synchronously."* The input's own value is set directly; only the expensive
  consequence is deferred.

## 9. Very long lists: virtualization is third-party

React has no first-party windowing or virtualization API. react.dev discusses it only as something that
does not exist yet — *"if React adds built-in support for virtualized lists in the future, it would make
sense to throw away the cache for items that scroll out of the virtualized table"*.

*Ecosystem convention*: rendering only the visible slice of a very long list is a library choice, and this
skill names no library and pins no version — the ecosystem moves faster than a skill can track, so read the
candidates' own current documentation. Two things are this skill's business rather than the library's:

- **Do the cheaper checks first.** A list that re-renders for a reason §2 explains, or whose rows carry an
  index key (`H12`), or whose row component does expensive work on every render (§6), does not need
  virtualization to get faster — it needs the defect fixed. Virtualization applied over any of those hides
  the cause and keeps the cost.
- **Virtualization changes the state contract.** A row that leaves the viewport is unmounted, so any state
  it held is discarded exactly as §4 describes. State that must survive scrolling belongs above the row.

## 10. Sources and evidence classes

Every claim above is either quoted from a primary source below or labelled *ecosystem convention* where it
is made. The pages were re-read on 2026-07-26 and the quoted sentences located in them on that date;
`SKILL.md`'s References register owns the rule-level citations, and this table records what this doc read.

| Source | What it supports here |
|---|---|
| [Render and Commit](https://react.dev/learn/render-and-commit) | §1 — the three steps, the recursion, "React does not touch the DOM if the rendering result is the same as last time", browser paint |
| [Keeping Components Pure](https://react.dev/learn/keeping-components-pure) | §3 — components as pure functions, the Strict Mode double call, its absence in production |
| [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state) | §4 — state follows position, a different component at the same position resets the subtree, `key` as part of the position, keys are not globally unique |
| [React Compiler introduction](https://react.dev/learn/react-compiler/introduction) | §2 and §5–§6 — the child cascade unless manually memoized, automatic memoization "as precise, or moreso", the effect-dependency escape hatch, the legacy-removal warning, and the `onClick` example whose Note states the broken memoization |
| [React Compiler 1.0](https://react.dev/blog/2025/10/07/react-compiler-1) | §5 — the first stable release and its date, the lint rules shipping in `eslint-plugin-react-hooks`'s `recommended` preset |
| [`memo`](https://react.dev/reference/react/memo) | §6 — "only valuable when your component re-renders often with the same exact props, and its re-rendering logic is expensive"; "completely useless if the props … are always different" |
| [`useMemo`](https://react.dev/reference/react/useMemo) | §6 — the whole-body re-run, what `useMemo` caches, the slow-calculation case, and how to measure whether a calculation is expensive |
| [`useCallback`](https://react.dev/reference/react/useCallback) | §6 — the two cases where caching a function is valuable; §9 — virtualized lists named as a possible future React feature |
| [`useState`](https://react.dev/reference/react/useState) | §6 — the set function's stable identity |
| [`useContext`](https://react.dev/reference/react/useContext) | §2 — every reader re-renders from the provider that received a different value; `memo` does not stop fresh context values |
| [`useTransition`](https://react.dev/reference/react/useTransition) | §8 — transitions are non-blocking and interruptible; not for controlled input state |
| [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue) | §8 — the interruptible background re-render, network requests not prevented, the memoized-child precondition |

**Ecosystem convention in this doc**, stated as such where it appears and never as a React-team position:
the recommendation in §9 to check the cheaper causes before reaching for virtualization, and the choice of
a windowing library at all. The evidence class for both is this skill's house default — React publishes no
guidance on either, which is what the `useCallback` sentence above records.
