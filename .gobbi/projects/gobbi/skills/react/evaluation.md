# React — Idiom Review Frame

Child doc for the evaluator, and for the executor's pre-handoff self-check, grading a React change-set for
**idiom** quality. It is the React-specific companion to [`../coding/evaluation.md`](../coding/evaluation.md),
which grades the language-agnostic property of good code, and to
[`../typescript/evaluation.md`](../typescript/evaluation.md), which grades the language idiom when the source is
TypeScript. `REACT-CHECK-51` resolves that language switch before this count is graded.

**Three axes, and their count is itself a check.** `../coding/evaluation.md` grades the property,
`../typescript/evaluation.md` the language idiom, and this file the React idiom. Where the source is TypeScript a
review produces three verdicts; where it is plain JavaScript the language-idiom axis does not apply and a review
produces two, which is a complete review rather than a reduced one. `REACT-CHECK-23` resolves on that count. The
axes are independent: a change can satisfy every property and still be wrong React — an Effect deriving state, an
index key, a client store holding server data — and it can be fluent React and still fail a property.

**This frame points; it does not restate.** The good, bad, and adversarial cases live in
[`scenarios.md`](scenarios.md) (`REACT-SCENARIO-*`), the binary items in [`checklists.md`](checklists.md)
(`REACT-CHECK-*`), and the rules, principles, and steps they exercise live in [`SKILL.md`](SKILL.md). This file
owns the seven idiom lenses, the case and check selection procedure, the recommended verifications, the
per-perspective anti-patterns, the Overall anchors, the preserve list, and the rule-key legend.

**It defines no evaluator output, path, or storage.** How an evaluation's results are shaped, named, validated,
aggregated, and stored belongs to the active workflow adapter and the session record contract; a library skill
does not restate that contract and cannot extend it. Read it from its owner. This frame contributes selected
cases, selected checks, lenses, and anchors to the general method in
[`../evaluation/SKILL.md`](../evaluation/SKILL.md), and changes nothing in it.

It loads through `SKILL.md` Procedure step P2 and applies at Procedure step P8.

---

## Derived source frame

Derive this frame from the live companion sources before selecting a case or check. Do not preserve a count,
identifier, or result merely because this file states it.

| Source | Live derived result |
|---|---|
| [`scenarios-components.md`](scenarios-components.md) | categories 1–10 exactly once; 47 selected cells; 9 families |
| [`scenarios-boundaries.md`](scenarios-boundaries.md) | categories 1–10 exactly once; 30 selected cells; 2 families |
| [`scenarios-operation.md`](scenarios-operation.md) | categories 1–10 exactly once; 27 selected cells; 2 families |
| [`checklists.md`](checklists.md) | 65 items: 36 gates, 29 required; 51 conditional, 14 unconditional; 13 family rows |

The three child registers contain 23 `selected` and 7 complete `covered-elsewhere` dispositions. Their
selected family union is `REACT-SCENARIO-01` through `REACT-SCENARIO-13`. The Activated lines in the seven
perspectives below must select that complete scenario union and `REACT-CHECK-01` through `REACT-CHECK-65`.
An absent identifier, a second occurrence in a source register, a false `n/a`, a bare pointer, a stale input
digest, or a mismatch between a claimed count and its live source blocks selection.

`REACT-CHECK-30` and `REACT-CHECK-37` retain separate Consistency and Structure routes. The four
non-assumable contract switches retain separate owners: `REACT-CHECK-25`, `-49`, `-50`, and `-51`.

---

## Rule-key legend — the single crosswalk

Every `scenarios.md` case and `checklists.md` item names its source by `H1`–`H18` (a `SKILL.md` Rule), `P1`–`P7`
(a `SKILL.md` Principle), or `Procedure P1`–`Procedure P8` (a `SKILL.md` Procedure step). This legend resolves
each one to the verbatim opening of the rule, principle, or step it names — the **sole crosswalk**, so a
rule change propagates through one legend rather than three copies.

`SKILL.md` **stamps** these identifiers; this legend **resolves** them and never renumbers them. Every "Resolves
to" clause below is a live substring of `SKILL.md`. Each bold H-rule span below is copied byte-for-byte from
the bold source heading, including its source line wrapping. Edit this legend in the same change that edits the
heading it quotes.

**Disambiguation:** `P{n}` is a `SKILL.md` Principle — one of the seven `## Principles` blockquotes.
`Procedure P{n}` is a `SKILL.md` Procedure step. A bare `P{n}` never means a Procedure step; the Procedure keys
always carry the word `Procedure`.

### Rules (`H{n}` — Must-Follow `H1`–`H10` and `H18`, Must-Not-Follow `H11`–`H17`)

- **H1 — MUST keep every component and hook pure.** — no effect, mutation, or subscription in
  render outside deterministic one-time initialization guarded by `ref.current === null`; the
  construction must be stable, replay-equivalent, free of I/O, and externally unobservable.
- **H2 — MUST call hooks only at the top level of a component or another hook.** — hook identity is positional.
- **H3 — MUST name every custom hook `use` followed by a capital letter.** — enforcement, not style.
- **H4 — MUST give every list item a key that is a stable identity from the data.** — identity, not position.
- **H5 — MUST use an Effect only to synchronize with a system outside React.** — the escape hatch, not the mechanism.
- **H6 — MUST clean up what an Effect starts, and stop or discard every async result the render no
  longer needs.** — cleanup, plus cancel or ignore for work already in flight.
- **H7 — MUST keep every value crossing the server/client boundary serializable in the direction it
  crosses.** — the sets are not symmetric.
- **H8 — MUST read the recorded compiler switch before memoizing, then follow the branch it selects and
  keep both branches inside H1 and H2.** — the compiler is the baseline where it is enabled, and
  criteria-driven manual memoization is the mechanism where it is not.
- **H9 — MUST render the element that carries the meaning, add ARIA only where no native element
  provides it, and move focus deliberately when a dialog opens and closes.** — the markup is part of the contract.
- **H10 — MUST prove behavior through the user-visible surface.** — the seam a user and an assistive technology reach.
- **H11 — NEVER mutate props, state, context values, hook arguments or return values, or a value already
  passed to JSX.** — they are snapshots for their render.
- **H12 — NEVER use an array index, or a value generated during render, as a key in a list that can
  reorder, insert, or delete.** — state follows the key.
- **H13 — NEVER chain Effects where each one sets state the next one watches.** — compute the cascade in the handler.
- **H14 — NEVER strip existing manual memoization while adopting the compiler without testing the
  result.** — removal can change compilation output.
- **H15 — NEVER hold server-owned data on the client without a named trigger that refreshes or discards
  it.** — **ecosystem convention**, the one rule here with no primary source; local state is a slot like any other.
- **H16 — NEVER expose a raw process bridge to a renderer, and never run one with Node integration
  enabled, context isolation disabled, or the sandbox off.** — a content bug must not become execution, and the
  three settings are independent.
- **H17 — NEVER infer producer architecture from the presentation surface.** — server-dependent features need an
  identified producer implementation, independently of browser or Electron presentation.
- **H18 — MUST treat every Server Function argument as untrusted input and authorize the mutation on the
  server side.** — marking a function `'use server'` publishes an endpoint.

### Principles (`P{n}` — the seven `## Principles`)

- `P1` — Resolves to "Study the React contract before you design." — version, compiler, presentation surface, producer architecture, language, lint preset.
- `P2` — Resolves to "Render is a pure function of props and state; an Effect is an escape hatch, not the mechanism."
- `P3` — Resolves to "Give every piece of state exactly one owner, at the narrowest scope that serves it."
- `P4` — Resolves to "Compose units, keep the prop surface narrow, and treat the rendered markup as part of the contract."
- `P5` — Resolves to "Memoize by the recorded compiler switch, not by habit." — which mechanism applies is a fact about the codebase, read before the decision.
- `P6` — Resolves to "Know which boundary the code sits on, and what may cross it."
- `P7` — Resolves to "Prove behavior the way a user reaches it."

### Procedure steps (`Procedure P{n}` — cited where a case or check grades operation, not a single rule)

- `Procedure P1` — Resolves to "Study and lock the task and the React contract" — the switches, before the design.
- `Procedure P2` — Resolves to "Load the companion for the fork in play" — read the depth before the decision.
- `Procedure P3` — Resolves to "Design the units and the boundaries, decomposed" — six ordered design acts.
- `Procedure P4` — Resolves to "Confirm the design with the user" — the React design packet.
- `Procedure P5` — Resolves to "Build the skeleton first" — it renders and type-checks with no behavior.
- `Procedure P6` — Resolves to "Grow in minimal verified slices" — the whole affected set moves per slice.
- `Procedure P7` — Resolves to "Verify the whole change" — the fixed self-failing gate order on the final tree.
- `Procedure P8` — Resolves to "Review on three axes, then trace" — the axes, then traceability.

---

## Two independent source gates

Both gates are mandatory before an evaluation can use this frame. They prove different properties.

### Gate A — semantic full-scope cited-owner comparison

Re-open every current source named by `SKILL.md`. Build one row for every H rule with the rule ID, source URL
and version or retrieval date, every compared source clause, the complete current rule policy, its exception
and applicability result, every dependent scenario/check/evaluation surface, and PASS or the exact mismatch.
Compare the whole rule, not its opening. Fail a narrowing, broadening, missing or added exception, false
applicability, stale dependent, or unsupported source claim. Record `H15` as an ecosystem convention with no
primary-source claim. Record `H9`'s discontinued Using ARIA material as provenance for a house default, not a
current W3C position.

This is a freshness gate: a prior ledger is an input, not a result. Re-open the cited owner and bind the accepted
row to the current source and dependent digests. A changed source or rule invalidates the row until the complete
comparison is repeated.

### Gate B — literal legend-opening comparison

Parse the raw bold H headings from `SKILL.md` and from this legend. Require IDs H1 through H18 exactly once in
each parsed heading set, byte-equal heading spans for each ID, no untracked H heading in the legend, and zero
missing, duplicate, or nonliteral openings. Preserve source line endings and Markdown when comparing; whitespace
normalization is not evidence. Principle and Procedure quotations remain direct live substrings and keep their
distinct key namespaces.

### Independence probes

| Controlled defect | Semantic gate | Literal gate |
|---|---|---|
| Keep an H heading byte-identical but narrow a later policy or exception in a temporary `SKILL.md` copy | must FAIL | must PASS |
| Keep `SKILL.md` and the semantic ledger unchanged but paraphrase one H heading in a temporary legend copy | must PASS | must FAIL |

If both probes do not produce those opposite results, the gates are coupled or cosmetic and this frame is not
accepted. Neither PASS can mask the other's failure.

---

## Selecting cases and checks

Run this after the target read and before the frame is locked.

1. **Validate the three child registers first.** Resolve the accepted components, boundaries, and operation
   identities and digests through their predecessor handoffs, then independently check categories 1–10,
   dispositions, covered-elsewhere ledgers, exact case-type labels, source-backed carriers, cell counts, and
   family counts against the current files. Reject stale, parent-only, mechanically incomplete, or semantically
   false evidence before deriving any selector, count, crosswalk, or metric.
2. **Load all evaluation sources** — this file, [`scenarios.md`](scenarios.md), its three child sets, and
   [`checklists.md`](checklists.md) — plus [`../coding/evaluation.md`](../coding/evaluation.md), and
   [`../typescript/evaluation.md`](../typescript/evaluation.md) when the source is TypeScript.
3. **Run both source gates.** Complete the fresh full-scope cited-owner ledger and the raw literal-opening
   comparison. Run both independence probes. Stop on either failure.
4. **Read the recorded React contract first.** Fifty-one of the sixty-five items are conditional on a
   stated predicate. Most predicates read the presentation surface, producer architecture, compiler
   switch, source language, or the claimed failure boundary. Resolve `REACT-CHECK-25`, `-49`, `-50`, and
   `-51` before the items that depend on those four independent contract facts. If any required fact is
   unrecorded, that is itself the finding — do not infer it from the diff. The compiler switch
   partitions three of those items rather than gating one: `REACT-CHECK-13` on the enabled branch, `-32` and
   `-33` on the not-enabled branch, so `H8` is covered either way and all three resolving `n/a` means the switch
   was never read.
5. **Map the diff to its React surfaces** — render paths and hook call sites; lists and their keys; Effects, their
   cleanups, and their awaited results; the server and client boundary; the compiler's enablement and any
   memoization change; state placement; interactive markup and focus; the presentation surface, producer architecture, and any privileged bridge; the
   build order and the tests.
6. **Select the activated families and their items.** Take every applicable `REACT-SCENARIO-*` and the
   `REACT-CHECK-*` identifiers it reserves, plus any item whose `H{n}`, `P{n}`, or `Procedure P{n}` applies
   directly with no close family match. For a conditional item the surface could plausibly activate, record the
   `n/a:<property>` form with the inspected evidence that its predicate is false — never omit it silently, and
   never relabel an applicable item `n/a` to avoid resolving it.
7. **Stage, do not copy prose.** Carry the selected identifiers and their wording as `checklists.md` states them,
   editing neither source. Walk all seven perspectives even where the change exercises few of them; a walked
   perspective may legitimately record zero findings.
8. **Demand direct evidence for the operation items.** One green final run proves final state only.
   `REACT-CHECK-21`, `-45`, `-46`, and `-47` need the pre-behavior state itself,
   `REACT-CHECK-22` needs the per-slice history, and
   `REACT-CHECK-31` needs fresh output from the tree being accepted. Evidence that first appears after a
   whole-feature pass fails those items.
9. **Report a finding against `H15` as a house default.** It is the one rule with no primary source, labelled
   ecosystem convention in `SKILL.md`. State that in the finding; never present it as a React-team position.

---

## Perspectives

Each lens names its activated identifiers and its anti-patterns. The verifications follow in one consolidated
section.

### Project

**Lens**: Does the approach fit the **recorded React contract** — the presentation surface, producer
architecture, compiler enablement, and source language — rather than a contract the author assumed from
an example?

**Activated**: `REACT-SCENARIO-10`, `-11` · `REACT-CHECK-19`, `-21`, `-22`, `-25`, `-45`, `-46`,
`-47`, `-49`, `-50`, `-51`, `-55`.

| Anti-pattern | Correction |
|---|---|
| **Presentation used as producer evidence** | Record browser or Electron presentation separately from client-only, build-time, or request-time/remote production; require an identified implementer for server-dependent behavior |
| **The contract inferred from the diff** | Read the version, compiler configuration, presentation surface, producer architecture, and source language from the codebase; the switches decide which mechanisms exist |
| **The whole feature in one pass** | Build the skeleton, then grow verified slices; a structural mistake found after every body is written costs the whole pass |

### Structure

**Lens**: Are the **units, their state, and their boundaries** idiomatic — pure render, unconditional hooks,
identity-keyed lists, Effects only for external systems, one owner per datum, and a boundary whose direction is
known?

**Activated**: `REACT-SCENARIO-01`, `-02`, `-03`, `-04`, `-06`, `-08`, `-13` · `REACT-CHECK-01`,
`-02`, `-03`, `-04`, `-05`, `-06`, `-07`, `-08`, `-11`, `-12`, `-15`, `-37`, `-38`, `-55`,
`-58`, `-59`, `-62`.

| Anti-pattern | Correction |
|---|---|
| **An Effect used as the mechanism** | Derive during render, handle in the event handler, or reset with `key`; an Effect is for synchronizing with a system outside React |
| **A key that encodes position** | Carry an identity in the data; an index key attaches state to a slot, so user input moves to the wrong row on reorder |
| **A datum with two homes** | Name one owner per value; a copy that is also a source of truth diverges as soon as either side changes |
| **A boundary value designed once for both directions** | Establish the direction, then check the value against the set for that direction |

### Performance

**Lens**: Is the change **efficient enough in idiomatic React** — the compiler trusted where it is enabled, manual
memoization reasoned rather than reflexive, and no avoidable extra render passes?

**Activated**: `REACT-SCENARIO-04`, `-05`, `-07` · `REACT-CHECK-07`, `-08`, `-13`, `-14`, `-32`,
`-33`, `-57`.

| Anti-pattern | Correction |
|---|---|
| **Memo hooks scattered "to be safe"** | Under an enabled compiler, write new code without manual memoization; keep a manual memo only with its reason at the call site |
| **A `memo` whose child is fed a prop built during render** | With no compiler, give the prop a stable identity or drop the `memo`; the comparison runs, always fails, and the render happens anyway |
| **Legacy memoization stripped during adoption** | Leave it, or remove it behind a test that observes the identity a downstream Effect depends on |
| **An extra commit per user action** | Compute during render; each derived-state Effect adds a render pass and a frame of stale data |

### Aesthetics

**Lens**: Does the change read like **one current React codebase** — hooks named so the tooling can see them,
derived values computed where they are used, and no memoization noise the compiler already handles?

**Activated**: `REACT-SCENARIO-02`, `-04`, `-07` · `REACT-CHECK-04`, `-13`.

| Anti-pattern | Correction |
|---|---|
| **A hook-calling helper without the `use` prefix** | Name it `use` plus a capital letter; the linter identifies a hook by its name |
| **A stored value that could be computed** | Compute it during render; a stored derivation is a second home for a fact that has one |
| **Memoization as a style** | Reserve it for a named reason; under an enabled compiler it reads as noise a later reader cannot distinguish from load-bearing code |

### Usage

**Lens**: Can the people who meet this change **actually use it** — a keyboard or assistive-technology user, and
the reviewer who must grade it on the axes that apply?

**Activated**: `REACT-SCENARIO-09`, `-11`, `-12`, `-13` · `REACT-CHECK-17`, `-18`, `-23`, `-27`,
`-29`, `-39`, `-40`, `-41`, `-54`, `-58`, `-59`, `-60`, `-61`.

| Anti-pattern | Correction |
|---|---|
| **Verified by clicking** | Operate the flow with the keyboard alone; a generic element with a click handler is invisible to everything else |
| **A dialog that opens without focus** | Move focus into it on open and back to the invoking control on close, or the interaction cannot be completed |
| **A test that reads internals** | Query by role, accessible name, or visible text; an implementation test fails on a correct refactor and passes on a broken rewrite |
| **One conflated review pass** | Produce the verdict count the source language calls for — three under TypeScript, two under plain JavaScript |

### Consistency

**Lens**: Does the change stay **consistent with what already exists and with what it claims** — the affected set
moved together, an adoption event handled coherently, and every taught claim traceable?

**Activated**: `REACT-SCENARIO-07`, `-12` · `REACT-CHECK-14`, `-22`, `-24`, `-26`, `-30`, `-48`,
`-55`.

| Anti-pattern | Correction |
|---|---|
| **Callers and tests left for a follow-up** | Move the whole affected set in the slice that changes the behavior it covers |
| **A taught example nobody can locate** | Hold the source, the exact location, and the sentence that states what the example shows; the examples here have no harness behind them |
| **A client copy with no invalidation** | Name what refreshes or discards it, and confirm that trigger exists in the code |
| **A design item with no implementation** | Trace every approved item to a unit, and every affected file to a change or a stated no-op |
| **A packet silent on failure boundaries** | The placement is a named packet element; silence records no decision and `design.md` §5 states what a boundary does not catch |

### Risk

**Lens**: What can **fail, leak, or be reached** that the happy path hides — an outliving subscription, an
out-of-order response, a divergent copy, an exposed privileged surface, or an unverified claim of verification?

**Activated**: `REACT-SCENARIO-05`, `-06`, `-08`, `-10`, `-13` · `REACT-CHECK-09`, `-10`, `-16`,
`-20`, `-28`, `-31`, `-34`, `-35`, `-36`, `-42`, `-43`, `-44`, `-52`, `-53`, `-56`, `-57`,
`-60`, `-61`, `-62`, `-63`, `-64`, `-65`.

| Anti-pattern | Correction |
|---|---|
| **A cleanup that returns an empty function** | Remove what the Effect created; the shape passing review is exactly how the leak survives |
| **The last response wins** | Discard a result whose render is no longer current; the defect reproduces only on a slow network |
| **Ignoring where cancelling was needed** | Ignoring answers the race and leaves the work running; on a rapidly changing input or a long-lived surface, cancel in the cleanup |
| **A generic invoke-by-channel bridge** | Expose named operations and validate every message; one generic entry point re-exposes the whole surface |
| **A Server Function guarded by its caller** | Validate and authorize inside the function; the endpoint is reachable without the component that calls it |
| **Verification asserted, not run** | Require fresh output from the tree being accepted; an unverified claim of verification is worse than none |
| **A bug fixed without re-running its reproducer** | Re-run the P1 reproduction last; a green suite proves the suite, not that the reported defect is gone |

---

## Recommended verifications

Capabilities are binding; tool names are examples. First run the ordered gate sequence the scope activates, owned
by `SKILL.md` Procedure step P7. Then add the React-specific verifications below.

| Capability | Confirms |
|---|---|
| Render a changed component twice with identical props; compare output and any external state it touched | Purity and idempotence (`H1`, `H11`, `P2`) |
| Run the six ref cases separately: deterministic null guard, changing-ref JSX, every-render assignment, I/O construction, time or randomness, and replay-dependent construction | Only the complete initialization exception passes; each ordinary ref-purity violation fails independently (`H1`, `P2`) |
| Walk each changed component through both sides of every early return and conditional branch | Unconditional hook call sites (`H2`); a positional failure appears only on the skipped branch |
| List the functions in the diff that call a hook and read their names | Hook naming as enforcement (`H3`) |
| Type into a row's input, reorder the list, and read where the value now sits | List identity (`H4`, `H12`); an index key moves state to the wrong row |
| For each Effect, name the external system it synchronizes with, or the alternative it should have used | The escape-hatch model (`H5`, `P2`); a chain or a derivation has no external system to name |
| Unmount mid-flight and issue two requests whose responses resolve in inverted order | Cleanup and staleness (`H6`); leaks and last-response-wins |
| Pass each boundary value across the real boundary in the direction it crosses | Direction-specific serialization (`H7`, `P6`) |
| Compare render counts and Effect firings across a memoization change, on a value an Effect depends on | Compiler baseline and removal hazard (`H8`, `H14`, `P5`) |
| Mutate a record out of band and re-read every screen that shows it | Convergence after invalidation (`H15`, `P3`) — a house-default finding, not a React-team position |
| Operate the whole flow with the keyboard alone; read the focused element after a dialog opens and closes | Markup as contract (`H9`, `P4`) |
| Query each control by role and accessible name; read the test queries and the `act` import | The user-visible seam (`H10`, `P7`) |
| Enumerate the privileged surface from page-context code; read the shipped window configuration | Bridge containment (`H16`) — the packaged configuration, not the development one |
| Hold the presentation surface constant and swap client-only, build-time, and request-time/remote producers | Orthogonal producer applicability (`H17`, `Procedure P1`) |
| Inspect the pre-behavior state and the per-slice history, not only the final tree | Bottom-up construction (`Procedure P5`, `Procedure P6`); rejects a final-green-only claim |
| For each taught example, locate the sentence in the named source that states what it shows | Taught-example fidelity (`Procedure P8`); no harness exists, so this is the only guard |

---

## Overall (Stage 3) — React-specific anchors

Step back from the per-perspective passes and read the change-set against the four React failure modes, then
against what exists only **between** lenses — a pure-looking component whose state has two homes, a correct
boundary carrying a value the other direction rejects, or a green verification run hiding whole-feature-first
construction.

| Mode | What it looks like in a React change-set |
|---|---|
| **Purity broken** | A mutation, a subscription, or a side effect during render outside H1's deterministic null-guard initialization exception, or a value mutated after being passed to JSX — the assumption the compiler's optimization rests on, violated silently |
| **Effect as the mechanism** | An Effect deriving state, resetting state on a prop change, chaining into another Effect, or standing in for an event handler — extra render passes and causality nothing traces |
| **State in the wrong slot** | Server-owned data held as client state, a widely-read fast-changing value in context, or a derived value stored instead of computed |
| **Boundary assumed** | A server-dependent feature with no identified producer, a presentation label used as producer evidence, a value crossing in a direction that rejects it, or a renderer treated as an ordinary page with privileged reach |

**Preserve-list anchors specific to React idiom** — what a strong change already got right, which a revision must
not undo: pure render paths with effects pushed to their proper homes; unconditional hook call sites and
name-detectable hooks; identity-keyed lists; Effects that synchronize with a named external system and clean up
after themselves, with a staleness guard on every awaited result; a boundary whose direction is recorded per
value; the compiler trusted with manual memoization reasoned at the call site; one recorded owner per datum;
markup that carries its meaning natively with focus moved deliberately; tests that reach the user-visible
surface; and evidence produced bottom-up rather than asserted at the end. If none apply, state `none — every
React-idiom surface needs revision`.
