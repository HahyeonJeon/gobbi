# React — Asynchronous Work

**Ownership** — asynchronous work on the client: whether an Effect is the right mechanism at all, what
cleanup owes to work already in flight, the choice between cancelling and ignoring it, reading an external
store, what activates Suspense and how it reveals, `use` as a read primitive, and pending state for an
async action.

**Split criterion** — `skill-writing` P4, category *a long lookup reference*: it is opened at one decision
— does this need an Effect, and what has to be undone — and read a section at a time. P4's other three
categories do not describe it: no artifact set, no per-unit orchestration, not a sub-procedure another
consumer loads.

This doc **deepens, and does not restate,** `SKILL.md` Principle 2 and Rules `H5`, `H6`, and `H13`, and
the `async.md` row of the P2 router.

**The seam with the server boundary, in the words already committed.** [`server-client.md`](server-client.md)
§8 states the criterion and this file adopts it unchanged, with only the referent made explicit:
**"if deleting the server would delete the question, it belongs to [`server-client.md`]."** Streaming
SSR and hydration, a promise crossing the RSC boundary, and pending state through `useActionState` and
`useFormStatus` are that file's and are not repeated here. What survives deleting the server is this
file's: Suspense activation and reveal, `use` as a read primitive, pending state through
`useTransition`, and cleanup, staleness, and cancellation.

Two more neighbours: where a value lives, and what a client copy of server data must carry, is
[`state.md`](state.md) — its §5 puts the fetch, its cleanup, and its refresh trigger in one custom hook
and leaves *how* they are written to this file. What a transition does to rendering — non-blocking,
interruptible, deprioritizing rather than removing work — is [`rendering.md`](rendering.md) §8. A claim
with no primary source is labelled *ecosystem convention* where it is made; §8 lists every source.

---

## 1. First question: does this need an Effect at all?

`H5` says an Effect synchronizes with a system outside React. react.dev states the same boundary and then
the consequence: *"Effects are an escape hatch from the React paradigm. They let you 'step outside' of
React and synchronize your components with some external system like a non-React widget, network, or the
browser DOM. If there is no external system involved (for example, if you want to update a component's
state when some props or state change), you shouldn't need an Effect."*

The catalogue of cases that look like Effects and are not, with what each actually is:

| Looks like | Actually |
|---|---|
| Transforming data for rendering | Compute it during render — react.dev: *"You don't need Effects to transform data for rendering"* |
| Handling a user event | Do it in the event handler that caused it |
| Resetting state when a prop changes | Change the `key`; the mechanism is [`rendering.md`](rendering.md) §4 |
| Adjusting some state when a prop changes | Compute it during render, or reset with a `key` |
| Chaining state updates | One handler computes the whole cascade — `H13` |
| Caching an expensive computation | Memoize it; the branch depends on the compiler switch, [`rendering.md`](rendering.md) §5–§6 |

The cost of getting this wrong is mechanical, and react.dev spells it out: *"When you update the state,
React will first call your component functions to calculate what should be on the screen. Then React will
'commit' these changes to the DOM, updating the screen. Then React will run your Effects."* An Effect that
sets state therefore adds a whole extra pass, and the user sees the intermediate frame.

## 2. Cleanup: what "clean up" actually owes

Every Effect that starts something states how it stops. react.dev's pairing is exact, and it is a
disjunction on the last one: *"For example, 'connect' needs 'disconnect', 'subscribe' needs 'unsubscribe',
and 'fetch' needs either 'cancel' or 'ignore'."*

`H6` requires one of the two for in-flight work, and this section is how to choose. They are not
equivalent:

| | What it does | What it leaves behind |
|---|---|---|
| **Ignore** | Discards the answer when it arrives | The request runs to completion — bandwidth, a server round trip, and whatever the response allocates |
| **Cancel** | Stops the work | Nothing, beyond what the server already did |

react.dev is explicit that ignoring is a real answer and about its limit: *"You can't 'undo' a network
request that already happened, but your cleanup function should ensure that the fetch that's not relevant
anymore does not keep affecting your application."* Ignoring satisfies the correctness property — the
stale answer never lands — and that is why it is the pattern most often shown.

**Choose `cancel` over `ignore` on any of three conditions**, which is where the correctness-only reading
starts costing:

1. **The input changes rapidly.** A field that refetches per keystroke, or a selector the operator clicks
   through, starts a request per change. Ignoring them all means every one of them still runs.
2. **The surface is long-lived.** The accumulation has time to matter; [`runtime.md`](runtime.md) §3 makes
   the same point about a desktop window that stays open for days.
3. **The request is expensive** — for the server, for the user's connection, or in what it allocates.

Otherwise ignoring is enough, and saying so is part of the decision rather than a gap in it.

**The mechanism for cancelling a `fetch` is the platform's, not React's.** react.dev says "cancel" and
does not name an API. On the web that API is `AbortController`: MDN — *"The AbortController interface
represents a controller object that allows you to abort one or more Web requests as and when desired."*
Its signal is passed to the request and aborted from the Effect's cleanup. Evidence class: web-platform
standard, not a React-team position, and not every async primitive accepts one — work that cannot be
cancelled is the case where ignoring is the answer and the reason should be recorded.

**The dev-time detector.** react.dev names the behavior and its purpose in one sentence: *"To help you
spot them quickly, in development React remounts every component once immediately after its initial
mount."* An Effect whose cleanup is missing or empty shows itself as doubled work on the very first
mount.

## 3. Reading an external store

*"`useSyncExternalStore` is a React Hook that lets you subscribe to an external store."* It is the
sanctioned way to read a value that lives outside React — a browser API, or the client-store rung in
[`state.md`](state.md) §2 — without the tearing that an ad-hoc `useState`-plus-Effect subscription
produces during concurrent rendering.

It is a subscription like any other, so `H6`'s pairing applies to it: the subscribe function returns its
own unsubscribe, and that is the cleanup.

## 4. Suspense: what activates it, and what it does

**The caveat first, because it is the one that surprises everyone:** *"Suspense does not detect when data
is fetched inside an Effect or event handler."* A component that fetches in an Effect and sets state does
not suspend, no matter how many boundaries wrap it. Suspense activates on data read through a
Suspense-enabled mechanism — *"reading a Promise with `use`, including data streamed from Server
Components or loaded through a Suspense-enabled framework"* — and react.dev describes what such a
framework does: *"A Suspense-enabled framework gives you a way to read data in your component in a way
that activates the closest Suspense boundary"*, and *"under the hood, a Suspense-enabled framework
maintains a cache of Promises and calls `use` to suspend on a Promise"*. Without one, the same primitive
is available directly: *"Without a framework, you can read a Promise with `use` directly, as long as the
Promise is cached so the same instance is reused across renders."*

Four reveal behaviors worth knowing before designing a loading state:

- **A suspended first mount keeps no state.** *"React does not preserve any state for renders that got
  suspended before they were able to mount for the first time. When the component has loaded, React will
  retry rendering the suspended tree from scratch."*
- **Re-suspending shows the fallback again — unless the update was a transition.** *"If Suspense was
  displaying content for the tree, but then it suspended again, the fallback will be shown again unless
  the update causing it was caused by `startTransition` or `useDeferredValue`."* That is the concrete
  reason to wrap a navigation or a filter change in a transition: it keeps the current content on screen
  instead of replacing it with a spinner.
- **Reveals are throttled and batched.** *"React reveals suspended content at most once every 300ms,
  measured from the last reveal. Boundaries that become ready within that window are revealed together
  rather than one at a time."*
- **Hiding content cleans up layout Effects.** *"If React needs to hide the already visible content
  because it suspended again, it will clean up layout Effects in the content tree."*

## 5. `use` as a read primitive

*"`use` is a React API that lets you read the value of a Promise or context."* Two properties make it
unlike everything else in this skill:

- **It suspends.** *"The component calling `use` suspends while the Promise is pending."* That is the
  bridge between §4 and an ordinary component: `use` is how a promise activates a boundary.
- **It is not a Hook, and `H2` does not constrain it.** *"Despite its name, `use` is not a Hook. Unlike
  Hooks, it can be called inside loops and conditional statements like `if`."* It still has a placement
  rule of its own: *"`use` must be called inside a Component or a Hook."* And reading context with it has
  one host restriction: *"Reading context with `use` is not supported in Server Components."*

Where the promise comes from is the part to design deliberately: a promise created during render is a new
promise on every render, which is the same identity trap [`rendering.md`](rendering.md) §6 describes for
props. A promise that crosses the RSC boundary as a prop is [`server-client.md`](server-client.md)'s.

## 6. Pending state for an async action

`useTransition` gives an async action a pending flag without a state variable of its own, and the
scheduling half of what it does — non-blocking, interruptible, deprioritizing rather than removing work —
is [`rendering.md`](rendering.md) §8's and is not repeated here.

What belongs to this file is the interaction with §4: a transition is what keeps a re-suspend from
replacing visible content with a fallback, per the quoted caveat above. So the pending flag and the reveal
behavior are one decision, not two.

Pending state through `useActionState` and `useFormStatus` is [`server-client.md`](server-client.md) §5's
by the seam criterion — those exist because a Server Function does.

## 7. The seam, stated once

| Question | Owner |
|---|---|
| What activates Suspense, and its reveal behavior | this file |
| `use(promise)` as a read primitive | this file |
| Pending state through `useTransition` | this file |
| Effect cleanup, stale-result guards, and cancellation | this file |
| Streaming SSR wiring and the hydration contract | [`server-client.md`](server-client.md) |
| A promise crossing the RSC boundary as a serializable prop | [`server-client.md`](server-client.md) |
| Pending state through `useActionState` and `useFormStatus` | [`server-client.md`](server-client.md) |

The criterion that produces this table is quoted at the top of this file and is stated in one place only.
No fact appears in both files.

## 8. Sources and evidence classes

Read on 2026-07-26; every quoted sentence located in these pages on that date. `SKILL.md`'s References
register owns the rule-level citations.

| Source | What it supports here |
|---|---|
| [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) | §1 — Effects as an escape hatch, the transform-for-rendering case, and the render-commit-Effect ordering that makes a state-setting Effect an extra pass |
| [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects) | §2 — the connect/subscribe/fetch pairing and its cancel-or-ignore disjunction, the limit of ignoring, and the development remount that exposes a missing cleanup |
| [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) (MDN) | §2 — the platform mechanism for cancelling a request; a web-standard fact, not a React-team position |
| [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore) | §3 — subscribing to an external store |
| [`<Suspense>`](https://react.dev/reference/react/Suspense) | §4 — the Effect and event-handler caveat, what activates a boundary, the first-mount state behavior, the transition exemption, the reveal throttle, and layout-Effect cleanup on hide |
| [`use`](https://react.dev/reference/react/use) | §5 — reading a Promise or context, suspending while pending, not being a Hook, and its placement and Server Component restrictions |

**Ecosystem convention in this file:** the three conditions in §2 that select `cancel` over `ignore`.
react.dev states the disjunction and does not say which to choose; the conditions are this skill's house
default and must never be reported as a React-team position. Everything else above is primary-sourced.
