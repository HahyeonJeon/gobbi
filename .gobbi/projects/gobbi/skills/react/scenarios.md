# React — Implementation Scenario Library

Good, bad, and adversarial React implementation cases. Load it when a React change-set is being
evaluated, or when an executor runs a pre-handoff idiom self-check. This library deepens, it does not
restate: every family exercises a `SKILL.md` rule, principle, or procedure step and teaches nothing new.

**Anchor convention.** An `Exercises:` line names `H{n}` for a Rule, a bare `P{n}` for a Principle, and
`Procedure P{n}` for a procedure step; each resolves to its verbatim clause in `SKILL.md`, which is where
those identifiers are stamped. This file cites them and never renumbers them. `Checklist IDs:` reserves
slots in `checklists.md`, which owns the check text; no verification check is constructed here.

Families group under **Hard invariants**, **Design judgment**, and **Bottom-up operation**.

---

## Set frame

**Purpose.** Prove that a React change-set satisfies the `SKILL.md` floor, in situations where a wrong
change still looks right.

**Target.** One React change-set — components, hooks, and the modules they touch. **Consumers.** An
evaluator entering through `evaluation.md`, and an executor self-checking at Procedure P8.

**Lifecycle mode.** Evaluation mode is primary; design mode is secondary, where a family is read before
the decision it governs. No case is exploratory: every one traces to an obligation.

### Scope and non-goals

In scope: the eighteen Rules, the seven Principles, and the eight Procedure steps of `SKILL.md`.

Not in scope, and deliberately so: constructing or reading verification checks, which `checklists.md`
owns; teaching any React fact `SKILL.md` does not already state; UI and UX design craft; language,
locale, and format handling; React Native.

### Coverage register

Every one of the ten coverage categories carries exactly one disposition. All ten are `selected`, so no
`covered-elsewhere` ledger is required.

| # | Category | Disposition | Families |
|---|---|---|---|
| 1 | Purpose / outcomes / scope | `selected` | 11 (primary), 12 |
| 2 | Actors / stakeholders / use-context | `selected` — secondary-only; its families are the tag-carriers | 09, 11, 12 |
| 3 | Behavior / state / data | `selected` | 01, 02, 03, 04, 08 (primary); 06, 09 |
| 4 | Interfaces / dependencies / structure | `selected` | 06 (primary); 02, 10 |
| 5 | Quality attributes / resource economics | `selected` — secondary-only | 04, 07 |
| 6 | Failure / recovery / operations | `selected` | 05 (primary); 06, 10 |
| 7 | Trust / harm / governance | `selected` | 10 (primary); 06 |
| 8 | Inclusion / locale | `selected` — the access-need property only; language, format, and culture are out of this skill's scope | 09 (primary) |
| 9 | Change / compatibility / reversibility | `selected` | 07 (primary); 12 |
| 10 | Evidence / traceability / clarity | `selected` | 12 (primary); 07 |

### Category by case type

A cell is one distinct `(selected category, triggered case type)` pair, counted once. Positive, negative,
and adversarial are present in every family by construction, so they are recorded once per category.

| Category | Positive | Negative | Adversarial | Boundary | Failure/recovery | Alt-valid | Change | Counterfactual |
|---|---|---|---|---|---|---|---|---|
| 1 Purpose | 11 | 11 | 11 | 11 | — | 11 | — | — |
| 2 Actors | 09 | 09 | 09 | — | — | 11, 12 | — | — |
| 3 Behavior | 01–04, 08 | 01–04, 08 | 01–04, 08 | 01, 02, 03, 08 | — | — | — | 04 |
| 4 Interfaces | 06 | 06 | 06 | 06 | 06 | — | — | — |
| 5 Quality | 07 | 07 | 07 | — | — | — | 07 | 07 |
| 6 Failure | 05 | 05 | 05 | 05 | 05 | — | — | — |
| 7 Trust | 10 | 10 | 10 | — | 10 | — | — | 10 |
| 8 Inclusion | 09 | 09 | 09 | 09 | — | — | — | — |
| 9 Change | 07 | 07 | 07 | — | — | — | 07 | 07 |
| 10 Evidence | 12 | 12 | 12 | — | — | 12 | 12 | — |

Cells: 48 across 12 families. An empty cell means the category's families do not turn on that type's
trigger property; each family's `Minimums:` line names the property that makes it inapplicable.

### Set scale

Thresholds for splitting this set under a parent index: 12 families or 50 cells. The set is at 12
families and 48 cells, so it stays single. A thirteenth family splits it.

### Source register

`SKILL.md` is the only source: its Rules `H1`–`H18`, its Principles `1`–`7`, and its Procedure steps
`P1`–`P8`. No case introduces a fact from outside it, and no primary source is quoted here — the rules
carry their own citations. No sensitive evidence is referenced or inlined by any case.

### Stable IDs and traceability

Family IDs are `REACT-SCENARIO-{nn}` and are stable once published; a retired family keeps its number.
`checklists.md` owns check text and may add items beyond the reserved IDs below, but never renumbers a
reserved one.

The mandatory traces run both ways and are swept for orphans: every `SKILL.md` rule, principle, and
procedure step reaches at least one family through an `Exercises:` line, and every family yields one
obligation. Scenario-to-check links are the reserved `Checklist IDs:` slots.

### Coverage gaps and decisions

- **Locale, language, and format** are not covered. Category 8 is selected for the access-need property
  only, because `SKILL.md` scopes accessibility to markup mechanics and leaves design and locale
  judgment to other owners.
- **The `H15` family exercises an ecosystem-convention rule.** A finding from family 08 is a violation of
  this skill's house default. It must never be reported as a React-team position; every other family
  exercises a rule with a primary source.
- **Depth belongs to the content children**, not here. Family 06 tests that the direction was established
  and the value checked against the set for that direction; it does not enumerate the sets, which the
  server and client boundary child owns.
- **Taught-example fidelity is covered by family 12 only.** Examples are cite-and-review, with no
  mechanical gate, so that family carries the whole obligation.

---

## Hard invariants

### REACT-SCENARIO-01 — A side effect or mutation during render
- **Axis:** Hard invariant.
- **Primary category:** 3 Behavior / state / data — the defining discrimination is what render itself
  does to state. **Secondary:** 10.
- **Situation:** Given a component that computes its view from props and context. When it also sorts a
  prop array in place, writes to a module-level cache, increments a counter, or subscribes, on the way to
  returning JSX.
- **Good handling:** render reads props, state, and context and returns; the sort works on a copy; the
  cache write moves to an event handler or an Effect; the subscription becomes an external-store
  subscription or an Effect with cleanup; any value already passed to JSX is left alone.
- **Bad handling:** `items.sort()` on the prop array; a counter or cache written in the component body; an
  object mutated after it was handed to JSX so the committed tree disagrees with what was rendered.
- **Boundary:** exactly two renders with identical props — a pure component produces identical output and
  leaves no external difference between the first and the second.
- **Adversarial probe:** the mutation is invisible in the fixture because the array is already sorted, so
  review passes and real data corrupts. **Cosmetic form:** the mutation is "made pure" by wrapping it in a
  `useMemo`, which still runs during render.
- **Minimums:** boundary see above · adversarial see above · failure/recovery `n/a: no external
  dependency, persistence, or partial mutation` · change `n/a: no version or lifecycle event` ·
  counterfactual `n/a: no load-bearing premise to invert`.
- **Oracle:** render twice with the same props and compare the output and any external state touched; a
  difference between the two renders is the defect, observed directly, and confirmed by the absence of an
  external write.
- **Obligation:** the design must place every mutation and subscription outside render, and must treat a
  value passed to JSX as frozen from that point.
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

### REACT-SCENARIO-06 — What crosses the server and client boundary, in the direction it crosses
- **Axis:** Hard invariant.
- **Primary category:** 4 Interfaces / dependencies / structure — the defining discrimination is the
  contract of a module boundary. **Secondary:** 3, 6, 7.
- **Situation:** Given a server-rendered component passing data to a client component, and client code
  calling a server function with a value taken from a form or an event. When a value is designed once and
  assumed to travel both ways.
- **Good handling:** the direction is established before the value is designed, the value is checked
  against the set for that direction, and anything that cannot cross is replaced by an identifier that is
  re-read on the other side.
- **Bad handling:** one merged notion of "serializable" applied to both directions; a class instance, a
  function, or an event object handed across; a value legal in one direction assumed legal in the other.
- **Boundary:** exactly at the boundary module, with a value that is legal in one direction and not the
  other — the case where a single merged list gives the wrong answer.
- **Failure/recovery:** the non-serializable value fails on the network hop rather than at the call site;
  the design must state where that surfaces and what the user sees.
- **Adversarial probe:** the value serializes in development because the fixture is a plain object and
  arrives as a class instance in production; and the Server Function is called directly, with arguments no
  component would produce, by a caller that never rendered the form — the validation and the authority
  check have to be inside the function to survive that. **Cosmetic form:** the error is silenced by
  marking the module as client code, which moves the boundary instead of fixing the value.
- **Minimums:** boundary see above · failure/recovery see above · adversarial see above · change `n/a: no
  version or lifecycle event` · counterfactual covered by family 10's no-server-tier inversion.
- **Oracle:** pass the value across the real boundary in both directions and observe which direction
  rejects it and where the error surfaces.
- **Obligation:** every value crossing the boundary must have its direction and its legality recorded at
  design time, and every Server Function must validate its arguments and authorize its mutation in its own
  body.
- **Exercises:** H7, H18, P6, Procedure P1, Procedure P3.
- **Checklist IDs:** `REACT-CHECK-11`, `REACT-CHECK-12`.

### REACT-SCENARIO-10 — Host assumptions: the missing server tier and the renderer bridge
- **Axis:** Hard invariant.
- **Primary category:** 7 Trust / harm / governance — the defining discrimination is what page content can
  reach. **Secondary:** 4, 6.
- **Situation:** Given code written against a framework-server example. When it is moved into a plain
  browser application, and into a desktop renderer that talks to a privileged process.
- **Good handling:** the host is established at Procedure P1; where no server tier exists, data access is
  client-side; the renderer reaches the privileged side only through a narrow named API, with Node
  integration off and context isolation on, and every message validated on arrival.
- **Bad handling:** a server function or streaming render assumed where nothing implements it; a raw
  bridge handed to page content; context isolation disabled to make an import resolve.
- **Failure/recovery:** the privileged call rejects or the channel drops; the renderer surfaces the
  failure instead of hanging on a promise that never settles.
- **Counterfactual:** invert the premise that a server tier exists — the same feature must be designed
  with client-side data access, and the parts that assumed a server must be named.
- **Adversarial probe:** injected page content calls the exposed surface directly; a narrow API bounds
  what it reaches, a raw bridge does not. **Cosmetic form:** the API is "narrowed" to a single generic
  invoke-by-channel function, which re-exposes the whole surface under one name.
- **Minimums:** failure/recovery see above · counterfactual see above · adversarial see above · boundary
  `n/a: no quantity, ordering, or time-window property` · change `n/a: no version or lifecycle event`.
- **Oracle:** call the exposed surface from page-context code and enumerate what it can reach; read the
  window's Node-integration and context-isolation settings from the shipped configuration, not from the
  development one.
- **Obligation:** the design must name the host, and every privileged capability the renderer can reach
  must be enumerable.
- **Exercises:** H16, H17, P1, P6, Procedure P1.
- **Checklist IDs:** `REACT-CHECK-19`, `REACT-CHECK-20`.

---

## Design judgment

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

---

## Bottom-up operation

### REACT-SCENARIO-11 — Skeleton first, then verified slices
- **Axis:** Bottom-up operation.
- **Primary category:** 1 Purpose / outcomes / scope — the defining discrimination is whether the build
  order produced a design that could be checked before it was filled in. **Secondary:** 2, 3.
- **Situation:** Given a feature spanning several components, a custom hook, and their prop types. When it
  is built.
- **Good handling:** the components, hooks, and prop types are created with stub bodies that render and
  type-check before any behavior exists; then one verified slice at a time, with every affected caller,
  test, story, and type moving in the same slice.
- **Bad handling:** the whole feature appears in one pass, so a structural mistake surfaces only after
  every body is written; callers and tests are updated in a follow-up change.
- **Alternative-valid:** review mode — the same steps run read-only to reconstruct and grade an existing
  design; the skeleton and growth steps are skipped and nothing is edited.
- **Boundary:** exactly at the skeleton gate — the tree renders and type-checks with zero behavior
  implemented.
- **Adversarial probe:** the "skeleton" already carries behavior in three components, so the gate passes
  and proves nothing about the structure. **Cosmetic form:** every stub returns nothing at all, so the
  tree renders trivially and the composition was never exercised.
- **Minimums:** boundary see above · alternative-valid see above · adversarial see above ·
  failure/recovery `n/a: no external dependency in the build sequence` · change `n/a: no version or
  lifecycle event` · counterfactual `n/a: no load-bearing premise to invert`.
- **Oracle:** check out the skeleton state alone, render it, and run the type-check; every unit exists,
  the composition is visible, and nothing behaves.
- **Obligation:** the approved design must be materializable as a rendering, type-checking skeleton before
  any behavior is written.
- **Exercises:** Procedure P4, Procedure P5, Procedure P6.
- **Checklist IDs:** `REACT-CHECK-21`, `REACT-CHECK-22`.

### REACT-SCENARIO-12 — Three-axis review, traceability, and taught-example fidelity
- **Axis:** Bottom-up operation.
- **Primary category:** 10 Evidence / traceability / clarity — the defining discrimination is whether a
  cold reader can follow each claim to its source. **Secondary:** 1, 2, 9.
- **Situation:** Given a completed change-set handed off for review, which also adds a documented React
  example to a project document. When one reviewer reads it end to end.
- **Good handling:** the property axis, the language-idiom axis, and the React-idiom axis are graded
  separately and produce three verdicts; the activated binary items are answered with outcomes; every
  approved design item maps to an implemented unit and every affected-set file is updated or recorded as a
  justified no-op; every taught example names the primary source that states what it shows.
- **Bad handling:** one pass conflates the three axes, so a change that is fluent React but shallow as
  software passes; an example reads plausibly and no source states it.
- **Alternative-valid:** a plain-JavaScript codebase — the language-idiom axis is omitted and exactly two
  axes remain, which is a complete review rather than a reduced one.
- **Change:** the affected set includes existing callers and tests, which move with the change rather than
  after it.
- **Adversarial probe:** a change-set satisfies every rule textually while the component does the wrong
  thing; the review must still fail it on the property axis. **Cosmetic form:** a checklist item is
  answered "reviewed" instead of with its outcome, and an example is labelled as coming from the
  documentation with no locatable statement behind it.
- **Minimums:** alternative-valid see above · change see above · adversarial see above · boundary `n/a: no
  exact limit or transition` · failure/recovery `n/a: no injected dependency failure` · counterfactual
  `n/a: covered by families 04, 07, and 10`.
- **Oracle:** run the three axes independently and compare what each finds; for every taught example,
  locate the sentence in the named source that states what the example shows.
- **Obligation:** review must produce one verdict per applicable axis, and every taught example must
  resolve to a statement in a named primary source.
- **Exercises:** H10, P7, Procedure P2, Procedure P8.
- **Checklist IDs:** `REACT-CHECK-23`, `REACT-CHECK-24`.

---

## Candidate additional cases

Not written, and each with the reason it is held back rather than dropped:

- **Suspense and transition scheduling** — a family on what a suspended boundary reveals and what a
  transition defers. Held until the child that owns asynchronous work exists, because the floor states no
  rule this family would exercise.
- **Context as dependency injection versus a state container** — currently reachable through family 08's
  placement ladder; it earns its own family only if the ladder proves too coarse in use.
- **Error and loading boundary placement** — Procedure P3 act 6 is exercised by family 11 structurally,
  but no family yet tests where a boundary is placed and what it catches.
- **A second alternative-valid host** — family 10 inverts the server tier; a materially different valid
  host pairing would strengthen category 2 beyond its current secondary-only standing.
