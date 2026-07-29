# React scenarios — Component behavior

This bounded set covers component and hook behavior. Enter through the
[`scenarios.md`](scenarios.md) parent. It preserves stable families 01–05 and 07–09 and adds stable
Error Boundary family 13.

## Set frame

- **Purpose:** make component behavior, state, accessibility, compiler, async-effect, and boundary
  obligations independently fail-able.
- **Target and consumers:** one React change-set; executors and evaluators selected by the parent.
- **Lifecycle:** evaluation mode, with design-mode use before a component-shape decision.
- **Scope:** components and hooks. Presentation/producer boundaries and workflow operation live in sibling sets.
- **Threshold:** at most 12 families and 50 cells. This set has 9 families and 47 cells.
- **Stable IDs:** existing IDs remain fixed; family 13 is the next honest identity.

## Scenario Rule 1 coverage register

| # | Category | Disposition | Carrier or ledger |
|---|---|---|---|
| 1 | Purpose / outcomes / scope | `selected` | `REACT-SCENARIO-04`, `REACT-SCENARIO-13` |
| 2 | Actors / stakeholders / use-context | `selected` | `REACT-SCENARIO-09`, `REACT-SCENARIO-13` |
| 3 | Behavior / state / data | `selected` | `REACT-SCENARIO-01`, `REACT-SCENARIO-02`, `REACT-SCENARIO-03`, `REACT-SCENARIO-04`, `REACT-SCENARIO-05`, `REACT-SCENARIO-08`, `REACT-SCENARIO-13` |
| 4 | Interfaces / dependencies / structure | `selected` | `REACT-SCENARIO-02`, `REACT-SCENARIO-13` |
| 5 | Quality attributes / resource economics | `selected` | `REACT-SCENARIO-04`, `REACT-SCENARIO-07`, `REACT-SCENARIO-13` |
| 6 | Failure / recovery / operations | `selected` | `REACT-SCENARIO-05`, `REACT-SCENARIO-13` |
| 7 | Trust / harm / governance | `covered-elsewhere`: [host trust boundary](scenarios-boundaries.md#react-scenario-10--producer-assumptions-across-browser-and-renderer-presentation) | `SR7-7` |
| 8 | Inclusion / locale | `selected` | `REACT-SCENARIO-09` |
| 9 | Change / compatibility / reversibility | `selected` | `REACT-SCENARIO-07` |
| 10 | Evidence / traceability / clarity | `selected` | `REACT-SCENARIO-01`, `REACT-SCENARIO-02`, `REACT-SCENARIO-03`, `REACT-SCENARIO-04`, `REACT-SCENARIO-05`, `REACT-SCENARIO-07`, `REACT-SCENARIO-08`, `REACT-SCENARIO-09`, `REACT-SCENARIO-13` |

### Category by case type

A cell is one distinct `(selected category, triggered case type)` pair, counted once. Family lists make
the carrier set auditable without a second editable carrier table.

| Category | Positive | Negative | Adversarial | Boundary | Failure/recovery | Alt-valid | Change | Counterfactual |
|---|---|---|---|---|---|---|---|---|
| 1 Purpose | `REACT-SCENARIO-04`, `REACT-SCENARIO-13` | `REACT-SCENARIO-04`, `REACT-SCENARIO-13` | `REACT-SCENARIO-04`, `REACT-SCENARIO-13` | `REACT-SCENARIO-13` | `REACT-SCENARIO-13` | — | — | — |
| 2 Actors | `REACT-SCENARIO-09`, `REACT-SCENARIO-13` | `REACT-SCENARIO-09`, `REACT-SCENARIO-13` | `REACT-SCENARIO-09`, `REACT-SCENARIO-13` | — | `REACT-SCENARIO-13` | — | — | — |
| 3 Behavior | `REACT-SCENARIO-01`, `REACT-SCENARIO-02`, `REACT-SCENARIO-03`, `REACT-SCENARIO-04`, `REACT-SCENARIO-05`, `REACT-SCENARIO-08`, `REACT-SCENARIO-13` | `REACT-SCENARIO-01`, `REACT-SCENARIO-02`, `REACT-SCENARIO-03`, `REACT-SCENARIO-04`, `REACT-SCENARIO-05`, `REACT-SCENARIO-08`, `REACT-SCENARIO-13` | `REACT-SCENARIO-01`, `REACT-SCENARIO-02`, `REACT-SCENARIO-03`, `REACT-SCENARIO-04`, `REACT-SCENARIO-05`, `REACT-SCENARIO-08`, `REACT-SCENARIO-13` | `REACT-SCENARIO-01`, `REACT-SCENARIO-02`, `REACT-SCENARIO-03`, `REACT-SCENARIO-08`, `REACT-SCENARIO-13` | `REACT-SCENARIO-01`, `REACT-SCENARIO-05`, `REACT-SCENARIO-13` | `REACT-SCENARIO-13` | — | `REACT-SCENARIO-04` |
| 4 Interfaces | `REACT-SCENARIO-02`, `REACT-SCENARIO-13` | `REACT-SCENARIO-02`, `REACT-SCENARIO-13` | `REACT-SCENARIO-02`, `REACT-SCENARIO-13` | `REACT-SCENARIO-13` | — | `REACT-SCENARIO-13` | — | — |
| 5 Quality | `REACT-SCENARIO-04`, `REACT-SCENARIO-07`, `REACT-SCENARIO-13` | `REACT-SCENARIO-04`, `REACT-SCENARIO-07`, `REACT-SCENARIO-13` | `REACT-SCENARIO-04`, `REACT-SCENARIO-07`, `REACT-SCENARIO-13` | `REACT-SCENARIO-13` | — | — | `REACT-SCENARIO-07` | `REACT-SCENARIO-07` |
| 6 Failure | `REACT-SCENARIO-05`, `REACT-SCENARIO-13` | `REACT-SCENARIO-05`, `REACT-SCENARIO-13` | `REACT-SCENARIO-05`, `REACT-SCENARIO-13` | `REACT-SCENARIO-05`, `REACT-SCENARIO-13` | `REACT-SCENARIO-05`, `REACT-SCENARIO-13` | `REACT-SCENARIO-13` | — | — |
| 7 Trust | — | — | — | — | — | — | — | — |
| 8 Inclusion | `REACT-SCENARIO-09` | `REACT-SCENARIO-09` | `REACT-SCENARIO-09` | `REACT-SCENARIO-09` | — | — | — | — |
| 9 Change | `REACT-SCENARIO-07` | `REACT-SCENARIO-07` | `REACT-SCENARIO-07` | — | — | — | `REACT-SCENARIO-07` | `REACT-SCENARIO-07` |
| 10 Evidence | `REACT-SCENARIO-01`, `REACT-SCENARIO-02`, `REACT-SCENARIO-03`, `REACT-SCENARIO-04`, `REACT-SCENARIO-05`, `REACT-SCENARIO-07`, `REACT-SCENARIO-08`, `REACT-SCENARIO-09`, `REACT-SCENARIO-13` | `REACT-SCENARIO-01`, `REACT-SCENARIO-02`, `REACT-SCENARIO-03`, `REACT-SCENARIO-04`, `REACT-SCENARIO-05`, `REACT-SCENARIO-07`, `REACT-SCENARIO-08`, `REACT-SCENARIO-09`, `REACT-SCENARIO-13` | `REACT-SCENARIO-01`, `REACT-SCENARIO-02`, `REACT-SCENARIO-03`, `REACT-SCENARIO-04`, `REACT-SCENARIO-05`, `REACT-SCENARIO-07`, `REACT-SCENARIO-08`, `REACT-SCENARIO-09`, `REACT-SCENARIO-13` | — | `REACT-SCENARIO-13` | `REACT-SCENARIO-13` | — | — |

Cells: 47 across 9 families. An em dash means the category's in-child families do not turn on that
case-type property; each family's `Minimums:` line states why, and category 7 resolves through its
Scenario Rule 7 ledger. Family 07 is the sole category-9 carrier: Family 13's corrected-input retry is
failure/recovery, not a version or lifecycle event.

### Scenario Rule 7 covered-elsewhere ledger

| Ledger | Applicable families | Risk-triggered case types | Failure oracles | Actors | Exact target clause |
|---|---|---|---|---|---|
| SR7-7 | component code that reaches a server/client or Electron privilege boundary | adversarial, failure/recovery, counterfactual | an injected caller crosses unauthorized capability or a channel failure is hidden | page code, renderer user, server-function caller | [`REACT-SCENARIO-10`](scenarios-boundaries.md#react-scenario-10--producer-assumptions-across-browser-and-renderer-presentation), especially its adversarial probe, failure/recovery case, oracle, and obligation |

## Source register and trace closure

Sources are `SKILL.md` H1–H6, H8–H15, Principles P1–P7, Procedure P1–P8, and
[`design.md` §5](design.md#5-error-boundaries). Every family below names its source in `Exercises:` and
ends in an obligation. The parent maps every source to a child; this child has no orphan family or obligation.

## Families

### REACT-SCENARIO-01 — A side effect or mutation during render
- **Axis:** Hard invariant.
- **Primary category:** 3 Behavior / state / data — the defining discrimination is what render itself
  does to state. **Secondary:** 10.
- **Situation:** Given a component that computes its view from props and context. When it also sorts a
  prop array in place, writes to a module-level cache, increments a counter, subscribes, or initializes a
  ref on the way to returning JSX.
- **Good handling:** render reads props, state, and context and returns; the sort works on a copy; the
  cache write moves to an event handler or an Effect; the subscription becomes an external-store
  subscription or an Effect with cleanup; any value already passed to JSX is left alone. The sole
  render-time ref write tests `ref.current === null` and performs deterministic stable construction whose
  result is the same across replay, with no I/O and no user-visible or external side effect.
- **Bad handling:** `items.sort()` on the prop array; a counter or cache written in the component body; an
  object mutated after it was handed to JSX so the committed tree disagrees with what was rendered; a
  changing ref read into JSX; a ref assigned on every render; an I/O resource created in the null guard;
  initialization from time or randomness; or initialization from a replay-dependent value.
- **Boundary:** exactly two render attempts with identical props. Deterministic null-guard initialization
  produces the same component result and no external difference across replay. Each of the five negative
  ref cases fails independently.
- **Failure/recovery:** instrument the I/O dependency constructor and attempt to call it inside the null
  guard. Correct handling rejects the render-time path before invocation, with zero dependency calls and
  zero live handles requiring cleanup. If any handle opens, the case fails because H1 forbids starting I/O
  during render; closing it later earns no recovery credit.
- **Adversarial probe:** the mutation is invisible in the fixture because the array is already sorted, so
  review passes and real data corrupts. **Cosmetic form:** the mutation is "made pure" by wrapping it in a
  `useMemo`, which still runs during render; or an I/O, time-based, random, or replay-dependent ref write
  is placed behind `ref.current === null` and presented as initialization.
- **Minimums:** boundary see above · failure/recovery see above · adversarial see above · change `n/a: no
  version or lifecycle event` · counterfactual `n/a: no load-bearing premise to invert`.
- **Oracle:** run six ref cases separately: deterministic null-guard construction passes; changing-ref
  JSX, every-render assignment, I/O construction, time or randomness, and replay-dependent construction
  each fail for their own reason. Render twice with the same props and compare the output and any external
  state touched. For the I/O case, observe the constructor call count and live-handle set; both must remain
  zero, and an opened handle fails even if it is later closed.
- **Obligation:** the design must place every mutation and subscription outside render except the complete
  deterministic null-guard initialization case, and must treat a value passed to JSX as frozen from that
  point.
- **Exercises:** H1, H11, P2, Procedure P3.
- **Checklist IDs:** `REACT-CHECK-01`, `REACT-CHECK-02`.

### REACT-SCENARIO-02 — Hook call sites and hook naming
- **Axis:** Hard invariant.
- **Primary category:** 3 Behavior / state / data — the defining discrimination is call-site position and
  the state it binds. **Secondary:** 4.
- **Situation:** Given a component that grows a `if (!user) return null` early return. When some reusable
  stateful logic is extracted into a helper the component calls.
- **Good handling:** every hook is called at the top level before any early return; the extracted helper
  that calls hooks is named `useSomething`; a helper that calls no hook stays a plain function.
- **Bad handling:** a `useEffect` after the early return; a hook inside a loop, a condition, or a
  callback; the extracted helper named `getUserStatus` while calling `useState`.
- **Boundary:** exactly at the early-return line — a hook immediately before it is legal, the same hook
  immediately after it is not.
- **Adversarial probe:** a helper is renamed to `useThing` to satisfy the linter while still calling a
  hook inside a branch, so the name is now detectable and the call site is still conditional.
  **Cosmetic form:** the early return is replaced by rendering `null` from inside a conditional branch
  that still skips a hook.
- **Minimums:** boundary see above · adversarial see above · failure/recovery `n/a: no external
  dependency or async work` · change `n/a: no version or lifecycle event` · counterfactual `n/a: no
  load-bearing premise to invert`.
- **Oracle:** render the component through both branches in sequence and read which state each hook
  holds; a violation shows as a hook-order failure or as state bound to the wrong slot, and the
  rules-of-hooks lint rule flags the call site.
- **Obligation:** every hook call site must be unconditional, and every hook-calling function must be
  identifiable by name.
- **Exercises:** H2, H3, P2, Procedure P3.
- **Checklist IDs:** `REACT-CHECK-03`, `REACT-CHECK-04`.

### REACT-SCENARIO-03 — List identity under reorder, insert, and delete
- **Axis:** Hard invariant.
- **Primary category:** 3 Behavior / state / data — the defining discrimination is which item a piece of
  state stays attached to. **Secondary:** 10.
- **Situation:** Given a list of rows that each hold local state, such as an expanded toggle or a text
  input. When the list is reordered, filtered, or an item is deleted.
- **Good handling:** the key is an identity carried in the data, so state follows its row through every
  reorder.
- **Bad handling:** the key is the array index, or a value generated during render, so state stays with
  the position rather than the item, or every item is recreated on every render.
- **Boundary:** exactly one element moved from last to first, and the deletion of exactly the first of
  many — the transition where a position-derived key first mis-associates.
- **Adversarial probe:** the fixture list never reorders, so index keys pass every test and fail in
  production ordering. **Cosmetic form:** a key that looks stable but is not unique among siblings, such
  as a display name that repeats.
- **Minimums:** boundary see above · adversarial see above · failure/recovery `n/a: no external
  dependency or partial mutation` · change `n/a: no version or lifecycle event` · counterfactual `n/a: no
  load-bearing premise to invert`.
- **Oracle:** type into the third row's input, reorder the list, and read where the typed value now sits;
  with a data-derived key it travels with its row, with an index key it stays at position three.
- **Obligation:** the data must carry a stable per-item identity before the list is rendered.
- **Exercises:** H4, H12, P2, Procedure P3.
- **Checklist IDs:** `REACT-CHECK-05`, `REACT-CHECK-06`.

### REACT-SCENARIO-04 — An Effect standing in for derivation, an event, or a reset
- **Axis:** Hard invariant.
- **Primary category:** 3 Behavior / state / data — the defining discrimination is where a value is
  computed. **Secondary:** 5.
- **Situation:** Given a filtered view of a list, a form that must clear when the selected record changes,
  and a submit that updates three related values. When each is written as an Effect that watches state
  and sets more state.
- **Good handling:** the filtered view is computed during render; the form resets by keying the component
  on the record identity; the submit cascade runs in the handler that started it.
- **Bad handling:** an Effect that sets derived state from props; an Effect that resets state when a prop
  changes; Effects chained so each sets the state the next one watches.
- **Counterfactual:** invert the premise that no external system is involved — when the next value
  genuinely requires a network round trip or a subscription, an Effect is the mechanism, and this family
  must not be read as forbidding Effects.
- **Adversarial probe:** the derived-state Effect is "fixed" with a complete dependency list and an
  equality guard, so the lint is quiet and the extra render pass remains. **Cosmetic form:** the chain is
  collapsed into one Effect with several `set` calls, which hides the cascade rather than removing it.
- **Minimums:** counterfactual see above · adversarial see above · boundary `n/a: the defect is
  structural, not quantitative` · failure/recovery `n/a: no external dependency in the bad path` · change
  `n/a: no version or lifecycle event`.
- **Oracle:** count commits for one user action; derivation during render commits once, the Effect form
  commits twice or more, and the intermediate frame renders stale data.
- **Obligation:** every datum must be classed at design time as computed, handler-driven, key-reset, or
  externally synchronized.
- **Exercises:** H5, H13, P2, P3, Procedure P3.
- **Checklist IDs:** `REACT-CHECK-07`, `REACT-CHECK-08`.

### REACT-SCENARIO-05 — Effect cleanup and the stale-result race
- **Axis:** Hard invariant.
- **Primary category:** 6 Failure / recovery / operations — the defining discrimination is what happens
  when async work outlives the render that started it. **Secondary:** 3.
- **Situation:** Given a search field that fetches per keystroke and a component that opens a socket
  subscription and an interval. When responses arrive out of order and the component unmounts mid-flight.
- **Good handling:** the Effect returns a cleanup that removes the subscription and clears the interval;
  an ignore flag set during cleanup discards a response whose render is no longer current.
- **Bad handling:** no cleanup, so the listener and interval outlive the component; the last response to
  arrive wins regardless of which query it answers.
- **Boundary:** exactly two in-flight requests where the earlier resolves after the later — the precise
  interleave at which an unguarded Effect displays the older result.
- **Failure/recovery:** the request rejects or the socket drops mid-flight; cleanup still runs, nothing
  leaks, and the failure is surfaced rather than swallowed.
- **Adversarial probe:** only the first request is delayed, so the naive implementation passes every fast
  test and fails on a slow network; and the input changes ten times in quick succession, leaving ten
  requests running to completion while every discarded result is correctly ignored. **Cosmetic form:** a
  cleanup function is returned but does nothing, so the shape passes review while the subscription still
  leaks.
- **Minimums:** boundary see above · failure/recovery see above · adversarial see above · change `n/a: no
  version or lifecycle event` · counterfactual `n/a: no load-bearing premise to invert`.
- **Oracle:** issue two requests with inverted resolution order and read the rendered result; correct code
  shows the later query's result, and an unmount leaves no live listener.
- **Obligation:** every asynchronous Effect must define both its cancellation path and its staleness
  discriminator.
- **Exercises:** H6, P2, Procedure P6, Procedure P7.
- **Checklist IDs:** `REACT-CHECK-09`, `REACT-CHECK-10`.

### REACT-SCENARIO-07 — The compiler baseline, the named escape hatch, and legacy memoization
- **Axis:** Design judgment.
- **Primary category:** 9 Change / compatibility / reversibility — the defining discrimination is the
  adoption event and what removing existing memoization does across it. **Secondary:** 5, 10.
- **Situation:** Given a codebase adopting the React Compiler, with existing components already wrapped in
  manual memoization, one of whose memoized values feeds an Effect dependency. When new components are
  written and the old memoization is revisited.
- **Good handling:** new code is written without manual memoization; existing memoization is left in
  place, or removed only behind tests that would show the difference; a manual memo that stays carries its
  named reason at the call site.
- **Bad handling:** new code is sprinkled with memo hooks "to be safe"; existing memoization is stripped
  in the adoption commit because the compiler is assumed to cover it.
- **Change:** exactly the adoption commit — behavior before and after the compiler is enabled, on the
  component whose memoized value is an Effect dependency.
- **Counterfactual:** invert the premise that the compiler is enabled — on a codebase that cannot adopt
  it, manual memoization is the mechanism, applied where the evidence supports it. A reader on a
  non-adopting codebase must be able to act on this branch without first discounting the default.
- **Adversarial probe:** the removal passes the unit tests because nothing observes identity, and the
  regression appears only where a downstream Effect fired on identity change. **Cosmetic form:** the
  change claims the compiler is adopted while its lint enforcement is not enabled, so nothing checks the
  purity the optimization depends on.
- **Minimums:** change see above · counterfactual see above · adversarial see above · boundary `n/a: no
  exact limit or transition beyond the adoption event itself` · failure/recovery `n/a: no dependency or
  partial-mutation failure path`.
- **Oracle:** with the compiler enabled, compare render counts and Effect firings before and after the
  memoization change on the component whose memoized value feeds an Effect dependency.
- **Obligation:** the design must state whether the compiler is enabled, and every manual memo must carry
  a named reason.
- **Exercises:** H8, H14, P1, P5, Procedure P1, Procedure P7.
- **Checklist IDs:** `REACT-CHECK-13`, `REACT-CHECK-14`.

### REACT-SCENARIO-08 — State placement, and server-owned data held as client state
- **Axis:** Design judgment.
- **Primary category:** 3 Behavior / state / data — the defining discrimination is which slot owns a
  datum. **Secondary:** 5.
- **Evidence class:** this family exercises `H15`, which `SKILL.md` labels ecosystem convention. A finding
  here is a violation of this skill's house default and must never be reported as a React-team position.
- **Situation:** Given a list fetched from a server that several screens read, and a form that edits one
  of its records. When the fetched list is copied into a client store so every screen can reach it.
- **Good handling:** the server cache owns the fetched data and every screen reads it there; the form
  draft is client state until it is submitted; each datum's owner is named at design time.
- **Bad handling:** the fetched list is copied into a client store and treated as the source of truth, so
  two screens diverge as soon as one of them mutates.
- **Boundary:** exactly at submission — the moment the draft stops being client state and the server value
  becomes authoritative again.
- **Adversarial probe:** the copy refreshes on mount, so divergence appears only when a second client or a
  background job changes the server value; and the copy that has no store at all — the fetched list held
  in the component's own state, on a surface that stays open all day — survives a review that only looked
  for a store or a context. **Cosmetic form:** the store slice is renamed "cache" without gaining
  invalidation, so the label satisfies review and the behavior is unchanged.
- **Minimums:** boundary see above · adversarial see above · failure/recovery `n/a: the failure is
  divergence, not an injected dependency failure` · change `n/a: no version or lifecycle event` ·
  counterfactual `n/a: no load-bearing premise to invert`.
- **Oracle:** mutate the record from a second client and re-read the first; a server-cache owner converges
  after invalidation, a client-store copy does not.
- **Obligation:** every datum's owner is named at design time, and any client copy of server-owned data
  must state what invalidates it.
- **Exercises:** H15, P3, Procedure P3.
- **Checklist IDs:** `REACT-CHECK-15`, `REACT-CHECK-16`.

### REACT-SCENARIO-09 — The rendered markup as a contract: semantics, ARIA, and focus
- **Axis:** Design judgment.
- **Primary category:** 8 Inclusion / locale — the defining discrimination is whether the output is
  operable by someone not using a mouse. **Secondary:** 2, 3.
- **Situation:** Given a clickable card and a modal dialog it opens. When the card is styled from a
  generic element and the dialog is shown by toggling state.
- **Good handling:** the interactive element is the native one that carries the meaning; an ARIA role,
  state, or property is added only where no native element provides it, under one of the exceptions the
  rule states; focus moves into the dialog when it opens and returns to the control that invoked it when
  it closes.
- **Bad handling:** a generic element with a click handler and no role or keyboard behavior; a role bolted
  onto a generic element where a native one was available; a dialog that opens with focus left on the page
  behind it.
- **Boundary:** exactly at open and at close — the focused element immediately after the dialog opens, and
  immediately after it closes.
- **Adversarial probe:** the card was verified by clicking it, so the defect appears only to a keyboard or
  assistive-technology user. **Cosmetic form:** a role and a tab index are added to a generic element
  without keyboard activation, so a role-based query finds it and it still cannot be operated.
- **Minimums:** boundary see above · adversarial see above · failure/recovery `n/a: no dependency,
  persistence, or async failure path` · change `n/a: no version or lifecycle event` · counterfactual
  `n/a: no load-bearing premise to invert`.
- **Oracle:** operate the whole flow with the keyboard alone and read the focused element after open and
  after close; find each control by role and accessible name.
- **Obligation:** the design must name each interactive element's native semantics and state where focus
  goes on every open and close transition.
- **Exercises:** H9, P4, Procedure P3.
- **Checklist IDs:** `REACT-CHECK-17`, `REACT-CHECK-18`.

### REACT-SCENARIO-13 — Error Boundary fallback, recovery, and honest reach

- **Axis:** Component behavior.
- **Primary category:** 6 Failure / recovery / operations — the defining discrimination is whether a
  descendant render failure is contained, surfaced through useful fallback UI, and recoverable.
  **Secondary:** 1, 2, 3, 4, 5, 10.
- **Source:** `SKILL.md` Procedure P3 act 6 and
  [`design.md` §5](design.md#5-error-boundaries), including the documented class-component mechanism,
  useful-granularity guidance, unsupported error classes, and `startTransition` exception.
- **Situation:** Given a screen with independently useful regions and a class Error Boundary around the
  region whose descendant can fail during render. When the descendant throws, the same screen later
  receives corrected input, and separate event, timer, server-render, and transition callbacks throw.
- **Applicability and priority:** applicable whenever a design claims a React Error Boundary catches a
  component-region failure; critical when a full-page blank or unavailable recovery action would strand
  the user.
- **Cases:**
  1. **Descendant render failure and fallback.** Primary type `failure/recovery`; coverage-role
     `[failure/recovery]`. Actor: screen user. Given the descendant throws while rendering, when React
     renders the nearest boundary, then that region shows a specific usable fallback and unaffected
     siblings remain usable. Failure oracle: the exception escapes, the whole screen disappears, or the
     fallback is absent. Evidence tuple: observe the committed tree; inject a deterministic descendant
     render throw; confirm fallback content and sibling interaction. Obligation `EB-1`: provide observable
     containment and fallback for the claimed region.
  2. **Recovery after corrected input.** Primary type `failure/recovery`; coverage-role
     `[failure/recovery]`. Actor: screen user. Given the fallback is visible, when the documented reset,
     retry, route change, or boundary-key change supplies non-failing input, then the child region renders
     again without reloading an unrelated usable region. Failure oracle: the fallback is permanent or
     recovery destroys unrelated state. Evidence tuple: observe fallback and recovered tree; perform the
     named recovery action; confirm the child returns and an unaffected sibling retains state. Obligation
     `EB-2`: name and prove a recovery path, not only a catch path.
  3. **Useful granularity boundary.** Primary type `boundary`; coverage-role `[boundary]`. Actor: screen
     user. Given one failing message inside a usable conversation list, when that message fails, then the
     chosen boundary preserves the largest useful unaffected region while exposing an intelligible error
     at the failed region. Failure oracle: a boundary around every cosmetic leaf fragments the interface,
     or one page-wide boundary removes unrelated useful work. Evidence tuple: observe the region tree;
     inject the same throw at leaf, region, and page placements; confirm only the task-useful placement
     satisfies both containment and continued use. Obligation `EB-3`: justify boundary granularity by the
     usable failure region.
  4. **Unsupported event, ordinary async, and server-render failures.** Primary type `negative`;
     coverage-role `[negative]`. Actor: implementer and user. Given an event handler, a timer callback, and
     server rendering each throw under a nearby boundary, when each class is exercised independently, then
     none is credited to that boundary and each has its own handling route. Failure oracle: evaluation
     claims the boundary caught any unsupported class. Evidence tuple: observe each error channel; inject
     one throw per class; confirm the boundary fallback is not the asserted handler. Obligation `EB-4`:
     record the unsupported classes and their separate owners.
  5. **`startTransition` throw reaches the boundary.** Primary type `alternative-valid`;
     coverage-role `[alternative-valid]`. Actor: component user. Given work is invoked inside the
     `startTransition` function returned by `useTransition`, when that work throws, then the nearest Error
     Boundary handles the exception even though an ordinary asynchronous callback would not. Failure
     oracle: transition work is incorrectly grouped with unsupported timer callbacks. Evidence tuple:
     observe the boundary fallback; inject equivalent transition and timer throws; confirm only the
     transition throw follows the boundary route. Obligation `EB-5`: preserve the documented transition
     exception without generalizing it to async work.
  6. **Cosmetic boundary gaming.** Primary type `adversarial`; coverage-role `[adversarial]`. Actor:
     reviewer. Given a component is named `ErrorBoundary` and wraps the target, when its descendant throws
     and input is later corrected, then the artifact still fails unless it implements observable fallback,
     recovery, and useful granularity. Failure oracle: a name, wrapper, logging-only `componentDidCatch`,
     or fallback with no recovery earns a pass. Evidence tuple: inspect and run the component; plant each
     cosmetic form; confirm every one is rejected independently. Obligation `EB-6`: grade behavior, not
     boundary-shaped syntax.
- **Adversarial face:** case 6. A boundary component exists but lacks fallback or recovery and must fail.
- **Minimums:** failure/recovery cases 1–2 · boundary case 3 · negative case 4 · alternative-valid case 5 ·
  adversarial case 6 · change/regression `n/a: corrected input is failure recovery, not a version or
  lifecycle event` · counterfactual `n/a: no load-bearing premise beyond the independently tested reach
  classes`.
- **Oracle:** run cases 1–6 independently. A correct result distinguishes descendant render,
  `startTransition`, event, ordinary async, and server-render classes; shows fallback; recovers; preserves
  useful unaffected UI; and rejects the cosmetic component.
- **Obligation:** the design must state what the boundary catches, show what the user sees, name how the
  region recovers, justify its granularity, and route every unsupported class to its actual owner.
- **Exercises:** Procedure P3, especially act 6.
- **Checklist IDs:** reserved for Task 03's complete atomic audit; no check text is defined here.

---

## Bottom-up operation
