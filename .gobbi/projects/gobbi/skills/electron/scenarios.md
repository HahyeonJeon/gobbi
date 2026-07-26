# Electron — Implementation Scenario Library

**Owns** — the probe set: the ten-category coverage frame dispositioned for this skill, twelve scenario
families derived from the `electron` P1–P8 flow, and for every case a failure oracle plus the design
obligation it proves. Each case reserves the `EL-CHECK-*` slot its binary item will occupy.

**Split criterion** — an independently consumed set
([`../skill-writing/SKILL.md`](../skill-writing/SKILL.md)): a reader opens one family to challenge a change
that is already written, in any order, and reads nothing else. Nothing here is narrative.

This doc **deepens, and does not restate,** the Rules. A rule states its check and one defeater; a case here
states the *situation* that produces such a defeater, the artifact a reasonable author actually ships, and
what a reviewer or a test observes instead. It adds no policy: every case exercises a live `SKILL.md` clause,
and a case that traces to no clause is a defect in this file, not a missing rule.

| Borrowed fact | Its one owner |
|---|---|
| Every rule, its check, its defeater, and the strength bar every oracle below is written to | [`SKILL.md`](SKILL.md) |
| The coverage categories, the case types, the coverage-role model, and the primary-declaration rule | [`../evaluation/scenario/SKILL.md`](../evaluation/scenario/SKILL.md) |
| The binary items the reserved slots will carry, and coverage closure versus acceptance | [`checklists.md`](checklists.md) |
| The perspectives these families are graded through | [`evaluation.md`](evaluation.md) |
| The Electron depth behind every probe | the nine content children, named per family |
| The Electron major each version-sensitive behavior below is qualified against | [`migration.md`](migration.md) |

## Contents

1. [Purpose, target, and scale](#1-purpose-target-and-scale)
2. [Coverage register](#2-coverage-register)
3. [The family and case-type matrix](#3-the-family-and-case-type-matrix)
4. [The five entry journeys](#4-the-five-entry-journeys)
5. [IDs, sources, and traces](#5-ids-sources-and-traces)
6. [The twelve families](#6-the-twelve-families)
7. [The six cosmetic-conformance cases](#7-the-six-cosmetic-conformance-cases)
8. [Coverage gaps, decisions, and candidates](#8-coverage-gaps-decisions-and-candidates)

---

## 1. Purpose, target, and scale

**Purpose** — to give an author, a reviewer, and an evaluator a set of situations this skill must handle,
each with an observable result a wrong implementation produces differently.

**Target** — the artifact under review: an Electron application change-set, and, for family `EL-SC-12`, a
change to this skill itself, which the maintainer rules govern.

**Consumer** — the executor running `electron` P8 before handoff, and an independent evaluator entering
through [`evaluation.md`](evaluation.md), which selects the applicable families.

**Lifecycle mode** — evaluation coverage. Every case is an approved constraint, so none is exploratory and
every one carries an obligation.

**Scale** — twelve families, 53 cases, 37 filled cells, where a cell is one distinct
(selected category, triggered case type) pair counted once. Both sit inside the recorded thresholds of ~12
families and ~40 cells, so the set stays whole rather than splitting under a parent index. The cell count
is close to its threshold: a thirteenth family is a split, not an addition.

---

## 2. Coverage register

Every one of the ten categories carries exactly one disposition. A category matched only as a secondary tag
is still `selected`, and its tag-carrying cases are named. For the bad-path categories — 6 and 7 — the
positive floor is the defining safe behavior *succeeding*: a rejection, a containment, or a detection that
works, not a happy path.

| # | Category | Disposition | Primary or tag-carrying families | Positive floor |
|---|---|---|---|---|
| 1 | Purpose / outcomes / scope | selected | `EL-SC-01` (primary) | `EL-SC-01a` |
| 2 | Actors / stakeholders / use-context | selected | tags on `EL-SC-01b`, `EL-SC-11a`, `EL-SC-12a` | `EL-SC-01b` |
| 3 | Behavior / state / data | selected | tags on `EL-SC-05e`, `EL-SC-08a`, `EL-SC-09g` | `EL-SC-08a` |
| 4 | Interfaces / dependencies / structure | selected | `EL-SC-02` (primary); tags on `EL-SC-03`, `EL-SC-04` | `EL-SC-02a` |
| 5 | Quality attributes / resource economics | selected | tags on `EL-SC-02b`, `EL-SC-02e` | `EL-SC-02b` |
| 6 | Failure / recovery / operations | selected | `EL-SC-09` (primary); tags on `EL-SC-02e`, `EL-SC-10c` | `EL-SC-09a` |
| 7 | Trust / harm / governance | selected | `EL-SC-04`, `EL-SC-05`, `EL-SC-06`, `EL-SC-07`, `EL-SC-08`, `EL-SC-10` (primary) | `EL-SC-06a` |
| 8 | Inclusion / locale | `n/a:` no live clause covers an access need, an input method, a language, a format, or a locale; platform accessibility is a recorded deferral, so no case here could trace to one | — | — |
| 9 | Change / compatibility / reversibility | selected | `EL-SC-11` (primary); tags on `EL-SC-04c`, `EL-SC-12a` | `EL-SC-11a` |
| 10 | Evidence / traceability / clarity | selected | `EL-SC-03`, `EL-SC-12` (primary) | `EL-SC-03a` |

No category is dispositioned `covered-elsewhere`: every selected axis is exercised by this set's own cases,
so no condition-to-clause ledger is owed.

---

## 3. The family and case-type matrix

A cell holds the case that exercises that type, or `n/a:` plus the property that makes the type
inapplicable to the family. `-> EL-SC-xx` means the family cannot exercise the type and its category's
minimum is discharged by that case in another family of the same category. Every family carries an
adversarial face.

| Family | Positive | Alt-valid | Negative | Boundary | Failure | Adversarial | Change | Counterfactual |
|---|---|---|---|---|---|---|---|---|
| 01 entry and route | a | b | `n/a:` routing consumes a task, not input data | `n/a:` no quantity, ordering, or time limit — a fork has one owner or none | `n/a:` no dependency, persistence, or async step | c | `n/a:` no version event — a route is re-derived per task, never migrated | d |
| 02 process placement | a | b | `n/a:` these units take no untrusted input; the input class is `EL-SC-05e`'s | d | e | c | -> `EL-SC-04c` | `n/a:` a unit's process is a decision, not a premise that can be wrong |
| 03 the type-check as proof | a | `n/a:` one target set per app | `n/a:` the pass consumes configs, not data | -> `EL-SC-12d` | d | b, c | -> `EL-SC-12a` | e |
| 04 the bridge surface | a | `n/a:` one exposed surface per app | `n/a:` the payload class is `EL-SC-05e`'s | e | f | b, d | c | -> `EL-SC-05d` |
| 05 the sender contract | a | `n/a:` every sender takes one path | e | b | -> `EL-SC-04f` | c | -> `EL-SC-04c` | d |
| 06 the nine code-only items | a | `n/a:` one posture per session | c | -> `EL-SC-07c` | -> `EL-SC-10c` | b | -> `EL-SC-04c` | -> `EL-SC-05d` |
| 07 navigation and window-open | a | `n/a:` one allowlist per app | d | c | -> `EL-SC-10c` | b | -> `EL-SC-04c` | -> `EL-SC-05d` |
| 08 the `webPreferences` posture | a | `n/a:` one posture per window class | c | -> `EL-SC-07c` | `n/a:` a key is read at construction; nothing fails partway | b | -> `EL-SC-04c` | -> `EL-SC-05d` |
| 09 development versus the artifact | a | b | g | f | e | c, d | `n/a:` the development-to-production difference is a mode, not a migration | `n/a:` no load-bearing premise to invert — the mode difference is observed, not assumed |
| 10 secrets and native returns | b | `n/a:` one storage path per secret | a | -> `EL-SC-07c` | c | a | -> `EL-SC-04c` | -> `EL-SC-05d` |
| 11 upgrading across a major | `n/a:` an upgrade with no removal to answer for exercises nothing | `n/a:` one supported window at a time | `n/a:` the input is a codebase, not a value class | c | `n/a:` no partial-mutation or retry step — a removed API is absent, not failing | b | a, d | c |
| 12 maintaining the skill | `n/a:` a maintenance pass that changes nothing proves nothing | `n/a:` one skill directory | `n/a:` the input is prose and fences, not a value class | d | -> `EL-SC-03d` | b, c | a | -> `EL-SC-03e` |

---

## 4. The five entry journeys

A reader arrives one of five ways. This maps the arrival to the families to run first. It is a reading
order, not a coverage claim.

| Arriving with | Run first | Then |
|---|---|---|
| An existing Electron codebase to review | `EL-SC-01b`, `EL-SC-11a`, `EL-SC-11b` | the whole of 04 to 08 |
| A new app to start | `EL-SC-01a`, `EL-SC-02`, `EL-SC-03` | 04, 05, then 09 before the first release |
| A major upgrade to perform | `EL-SC-11` | `EL-SC-02c`, `EL-SC-03d`, `EL-SC-09e` |
| A dev-works / production-breaks failure | `EL-SC-09` | `EL-SC-03b`, `EL-SC-10c` |
| A security review to run | `EL-SC-06`, `EL-SC-07`, `EL-SC-08` | 04, 05, 10, then `EL-SC-09a` for the shipped artifact |

---

## 5. IDs, sources, and traces

**Stable IDs.** A family is `EL-SC-NN`; a case is `EL-SC-NN` plus a letter. An ID is never reused and never
renumbered — a retired case keeps its ID and is struck in § 8. Each case reserves the matching
`EL-CHECK-NN` slot with the same letter; [`checklists.md`](checklists.md) may add further items under the
same family number, and never re-points a reserved slot at a different case.

**Sources.** The 13 `EL-R-*` author rules, the 3 `EL-R-*` maintainer rules, the 8 `EL-N-*` prohibitions, the
judgment defaults, and the P1 to P8 Procedure, all in [`SKILL.md`](SKILL.md); plus the nine content
children, each named in the family that reaches it.

**Traces, both ways.** Source to case: every family's **Exercises** line names the clauses its cases come
from, and § 8 records the source clauses that no case reaches. Case to obligation: every row's second half
ends in the `MUST` the case exists to prove. Case to check is the reserved slot, and is advisory — the
binary items are `checklists.md`'s to write.

---

## 6. The twelve families

### Group A — entry, placement, and proof

#### EL-SC-01 — Entry: mode, scope, and the route

**Primary** — 1 Purpose / outcomes / scope: the family turns on whether the change reaches the right owner
in the right mode before any code is read. **Secondary** — 2, 10.
**Exercises** — Procedure P1, P2, P4, P8, and the boundary test that sends language-agnostic advice to
[`../coding/SKILL.md`](../coding/SKILL.md) and language idiom to
[`../typescript/SKILL.md`](../typescript/SKILL.md) · **check slots** `EL-CHECK-01a` to `EL-CHECK-01d`.

| Case | Type · roles | Probe — given / when / then | Failure oracle → design obligation |
|---|---|---|---|
| **EL-SC-01a** one fork, one owner | positive · positive | Given a change adding one channel to a single-window app, when the author runs P1 and P2, then the mode is declared, the affected set names all three processes, and each active fork routes to exactly one child | Oracle: the recorded route resolves each fork to one child; a fork resolving to two, or to none, fails. → the design MUST route every plausible task to exactly one owner |
| **EL-SC-01b** the reviewer's read-only entry | alternative-valid · alternative-valid (actor: a reviewer of code they did not write) | Given an unfamiliar codebase, when the reader enters in review mode, then P1 to P4 reconstruct and grade the existing design packet, P5 and P6 are skipped, and nothing is edited without authorization | Oracle: a review that produced a diff without authorization, or that graded without reconstructing the packet, fails. → the design MUST carry a review mode that grades without editing |
| **EL-SC-01c** three axes named, one run | adversarial · adversarial | Given a review record listing the language-agnostic, the TypeScript, and the Electron axis, when only the Electron axis is actually run, then the record reads complete and two axes were never exercised | Oracle: each axis has its own findings list against a named artifact; an axis with no evidence and no finding fails, however plainly it is named. → the design MUST require per-axis evidence, not per-axis naming |
| **EL-SC-01d** the design moves after routing | counterfactual · counterfactual | Given the premise that a change's fork set is known at P2, when the design shifts at P6 — a channel becomes a `MessagePort`, a second window appears — then the fork governing the new design was never read | Oracle: invert the premise by re-reading the route after the shift; the disconfirmation response is a re-run of routing. → the design MUST re-run routing when the design changes, not once at entry |

#### EL-SC-02 — Process placement and the module surface

**Primary** — 4 Interfaces / dependencies / structure: the defining discrimination is which runtime a unit
belongs to and what that runtime may import. **Secondary** — 3, 5, 7.
**Exercises** — EL-R-01, EL-R-10, EL-N-02, Principle 1, Procedure P3 step 1 · depth
[`process-model.md` § 1](process-model.md#1-three-processes-one-placement-rule),
[`process-model.md` § 3](process-model.md#3-the-sandboxed-preload-surface-and-the-one-file-consequence),
[`process-model.md` § 5](process-model.md#5-utilityprocessfork--the-sanctioned-offload-target) ·
**check slots** `EL-CHECK-02a` to `EL-CHECK-02e`.

| Case | Type · roles | Probe — given / when / then | Failure oracle → design obligation |
|---|---|---|---|
| **EL-SC-02a** the placement is declared before the unit | positive · positive | Given a new unit that needs an OS secret, when the author names its process before writing it, then it is main-side, tagged, and it type-checks in the main pass | Oracle: every source file and every taught `ts` block carries a process word and compiles under that process's `lib`, `types` and `electron` view; an untagged block is a hard extractor error. → the design MUST fix each unit's process before the unit is written |
| **EL-SC-02b** CPU-heavy work leaves main | alternative-valid · alternative-valid (tags 5) | Given a document render that occupies the CPU for seconds, when it runs in `utilityProcess.fork()` instead of main, then window input and IPC stay responsive throughout | Oracle: measure main's loop latency during the workload; the same work in main shows the stall. → the design MUST name a sanctioned offload target for CPU-heavy work |
| **EL-SC-02c** a main module imports the renderer IPC module | adversarial · adversarial | Given a `main`-tagged module that imports `ipcRenderer` from `electron` — the shape a complete-looking implementation produces when one `electron` view serves all three processes — when the build runs, then it compiles and the failure waits until the call | Oracle: the main target raises `TS2305` against its own generated view; a green compile on this input is the false pass `EL-SC-03b` and `EL-SC-03c` describe. → the design MUST give each process its own `electron` module view, not only its own `lib` and `types` |
| **EL-SC-02d** the preload bundle leaves the sandboxed set | boundary · boundary | Given a preload whose own imports are all inside the sandboxed module surface, when a helper it imports pulls in `path`, then the emitted bundle sits one module outside that finite set | Oracle: read the emitted bundle, not the source import list; a grep over the preload source passes while the bundle references the module. → the design MUST check the emitted preload bundle, as one file, against the sandboxed surface |
| **EL-SC-02e** a crash-prone unit takes main down | failure / recovery · failure/recovery (tags 5) | Given a native parser that dies on a malformed input, when it runs in main, then the whole application goes with it; when it runs in a utility process, the parent observes the exit and reports the failure | Oracle: drive the malformed input and observe whether any window survives. → the design MUST state crash isolation, not only throughput, as a reason to offload |

#### EL-SC-03 — The per-target type-check as proof

**Primary** — 10 Evidence / traceability / clarity: the family turns on whether a green run is *proof* of the
process boundary; `EL-SC-02` owns the boundary itself. **Secondary** — 4, 9.
**Exercises** — EL-R-02, EL-N-08, EL-R-16, Principle 6 · depth
[`tooling-config.md` § 3](tooling-config.md#3-the-three-target-tsconfig-split),
[`tooling-config.md` § 4](tooling-config.md#4-per-process-electron-module-views),
[`tooling-config.md` § 5](tooling-config.md#5-skiplibcheck-true-is-required-and-the-comment-is-part-of-the-requirement) ·
**check slots** `EL-CHECK-03a` to `EL-CHECK-03e`.

| Case | Type · roles | Probe — given / when / then | Failure oracle → design obligation |
|---|---|---|---|
| **EL-SC-03a** each guard signal is shown to fire | positive · positive | Given three targets with their own `lib`, `types` and generated `electron` view, when a deliberate fixture is run through each, then `TS2584`, `TS2591` and `TS2305` are each observed at least once | Oracle: the three codes appear in the recorded output; a config set that has never made any of them fire proves only that clean code compiles. → the design MUST demonstrate each guard signal from a fixture rather than assert it |
| **EL-SC-03b** the combined config certifies the violation | adversarial · adversarial | Given `EL-SC-02c`'s module plus a renderer unit touching `process`, when the project type-checks under one config carrying every process's `lib` and `types`, then both compile clean and the run is green | Oracle: the same input under per-target passes goes red; a claim that the type-check passes, unable to state a pass count of three, fails. → the design MUST count one pass per declared target, never one combined pass |
| **EL-SC-03c** three passes, one module view | adversarial · adversarial | Given three per-target configs that all extend a shared base resolving `electron` to the vendor's un-scoped typings, when the build runs, then three passes run, the ambient guards fire, and every wrong-process `electron` import compiles | Oracle: each config's `paths` entry resolves to its own generated view; three identical entries fail even though three passes ran. → the design MUST scope the `electron` module view per config, not only the pass count |
| **EL-SC-03d** the view generator matches nothing | failure / recovery · failure/recovery | Given a generator that derives the three views by substituting into the vendor declaration, when an upstream reshuffle makes its substitution match zero lines, then it can emit an unscoped view and the boundary silently stops being checked | Oracle: the generator exits non-zero unless its substitution matches exactly one line; a run that emits on a zero match fails. → the design MUST make the view generator fail loudly rather than emit a permissive view |
| **EL-SC-03e** the block the compiler cannot see | counterfactual · counterfactual | Given the premise that the type-check sees every process violation, when a block touches neither an ambient global nor an `electron` import, then all three signals stay silent whatever process it is tagged with | Oracle: retag such a block to another process and observe that nothing changes; the disconfirmation response is a reviewer confirming the tag against the module's role. → the design MUST state this residue and name who covers it |

### Group B — the trust boundary

#### EL-SC-04 — The bridge surface

**Primary** — 7 Trust / harm / governance: the family turns on how much of the machine any script the
renderer runs can reach. **Secondary** — 4, 5, 9.
**Exercises** — EL-R-07, EL-R-08, EL-N-03, EL-N-04, Principle 5, Procedure P3 step 2 · depth
[`ipc.md` § 5](ipc.md#5-the-bridge-surface-one-method-per-message),
[`ipc.md` § 6](ipc.md#6-the-four-bridge-anti-patterns),
[`ipc.md` § 4](ipc.md#4-where-the-two-tables-disagree),
[`renderer-react.md` § 4](renderer-react.md#4-moving-an-ipc-push-into-react-state) ·
**check slots** `EL-CHECK-04a` to `EL-CHECK-04f`.

| Case | Type · roles | Probe — given / when / then | Failure oracle → design obligation |
|---|---|---|---|
| **EL-SC-04a** one method per message | positive · positive | Given four channels, when the preload exposes them, then each exposed function names its own channel as a literal in its own body and the exposed key set is written out | Oracle: adding a channel requires an edit to the exposed object; a surface where it does not fails. → the design MUST make the bridge an explicit, written-out contract |
| **EL-SC-04b** the bridge built from a manifest | adversarial · adversarial | Given a preload that builds its API by iterating a channel manifest, when a channel is added to the manifest, then the exposed surface widens with no edit to the preload and no line in the review diff | Oracle: diff the exposed key set across the change, not the preload source; every generated function does close over a channel literal, so a literal-in-the-body check alone passes it. → the design MUST make every widening of the surface an edit a reviewer sees |
| **EL-SC-04c** the wholesale exposure that reads as plumbing | change / regression · change/regression, adversarial | Given a preload written to a pre-29 idiom that hands the whole renderer IPC module across the bridge, when the renderer calls a method on it, then the call site fails and the bridge itself reported nothing — the behavior [`migration.md` § 2](migration.md#2-the-removal-and-deprecation-index) indexes and qualifies | Oracle: assert each exposed key is a function of the expected arity; a smoke test asserting only that the exposed object is defined passes against an empty object. → the design MUST forbid wholesale exposure and MUST check the exposed shape method by method |
| **EL-SC-04d** the listener that leaks the event | adversarial · adversarial | Given a listener wrapper that forwards no first parameter, when it passes a value read from the internal event as a later argument, then the renderer holds a main-process object | Oracle: no exposed callback argument is derived from the internal event; the naive check — "forwards no first parameter" — passes this shape. → the design MUST bound the wrapper by what it hands back, not by which parameter it drops |
| **EL-SC-04e** the value legal in one direction only | boundary · boundary | Given a callback that legally crosses `contextBridge`, when the renderer passes that same value inside an `invoke` payload, then it sits at the exact transition between the two serialization tables and does not survive | Oracle: assert the value's arrival on the far side of each direction separately; one round-trip test on the permissive direction passes. → the design MUST check every crossing value against the table for that direction |
| **EL-SC-04f** the subscription that outlives its owner | failure / recovery · failure/recovery | Given a main-to-renderer push consumed by a component, when the component unmounts without calling the disposer the bridge returned, then the listener keeps firing into a dead tree and accumulates across remounts | Oracle: mount, unmount, remount, and count live listeners; a single-mount test observes nothing. → the design MUST carry the disposer into the consumer's cleanup path |

#### EL-SC-05 — The sender contract on the main side

**Primary** — 7 Trust / harm / governance: the family turns on whether main can prove who sent a message
before it acts. **Secondary** — 3, 6.
**Exercises** — EL-R-09, Principle 3, Procedure P3 step 3, Procedure P7 · depth
[`ipc.md` § 7](ipc.md#7-the-sender-contract-two-failure-outcomes-two-deny-branches),
[`ipc.md` § 8](ipc.md#8-runtime-validation-lives-on-the-main-side),
[`testing.md` § 4](testing.md#4-the-sender-seam-producing-a-null-and-a-detached-frame) ·
**check slots** `EL-CHECK-05a` to `EL-CHECK-05e`.

| Case | Type · roles | Probe — given / when / then | Failure oracle → design obligation |
|---|---|---|---|
| **EL-SC-05a** four inputs, four denials | positive · positive | Given a handler that reads the sender frame synchronously and narrows its payload, when a null frame, a detached frame, an off-allowlist origin and a malformed payload are each driven through it, then the action is not performed in any of the four | Oracle: the verdict denies for all four and the action's effect is unobserved; a suite that drives only the off-allowlist origin proves one branch. → the design MUST require all four denials, per handler |
| **EL-SC-05b** the detached frame at a null check | boundary · boundary | Given a guard written as a null check, when the message arrives from a frame mid-navigation — non-null, with a `.url` still reading as the allowlisted origin — then it passes the null check and the origin allowlist and the action runs | Oracle: drive an allowlisted URL with `detached === true` and expect deny; every guard that only null-checks admits it. → the design MUST make the detached state its own deny branch, separate from null |
| **EL-SC-05c** the read that moved past the first `await` | adversarial · adversarial | Given a handler that reads the sender frame inside a `.then()` or after an `await` in a `try` block, when the behavioral suite runs, then all four inputs deny and the defect survives | Oracle: the read's lexical position, reviewed per handler; the behavioral conjunct cannot produce the failing state, because a real null needs a navigation raced against the read. → the design MUST carry a static conjunct beside the behavioral one, and MUST say why the tests cannot replace it |
| **EL-SC-05d** the renderer we wrote ourselves | counterfactual · counterfactual | Given the premise that the sender is known because the team wrote the renderer, when a frame is navigated or a dependency injects a script, then the same message arrives from a caller nobody wrote | Oracle: invert the premise and re-ask which check would have stopped it; if the premise held, every guard in this family would be dead code. → the design MUST treat everything crossing into main as untrusted, whoever wrote the renderer |
| **EL-SC-05e** the payload trusted through its annotation | negative · negative (tags 3) | Given a handler whose payload parameter carries the channel's type, when a message arrives with a different shape, then nothing narrows it and the wrong shape reaches the action | Oracle: send a payload that violates the annotation and observe the action; the build is green either way, because the annotation is gone by the time the message arrives. → the design MUST validate every payload at runtime, on the main side |

#### EL-SC-06 — The nine code-only security items

**Primary** — 7 Trust / harm / governance: the family turns on guards no warning will ever mention.
**Secondary** — 2, 10.
**Exercises** — EL-R-04, EL-N-01 · depth
[`security.md` § 4](security.md#4-bucket-b-the-ten-controls-you-must-write),
[`security.md` § 5](security.md#5-item-5-permissions-are-a-pair),
[`testing.md` § 5](testing.md#5-the-five-origin-sensitive-adversarial-tests) ·
**check slots** `EL-CHECK-06a` to `EL-CHECK-06c`.

| Case | Type · roles | Probe — given / when / then | Failure oracle → design obligation |
|---|---|---|---|
| **EL-SC-06a** nine items, nine results | positive · positive | Given a change that touches a window and a session, when the security pass runs, then each of the nine is named individually with its own result, and each origin-sensitive one carries a second, inverted test | Oracle: a per-item result with a reason; a record that lists all nine and marks each "not applicable" with no reason is the list present and the property unexamined. → the design MUST require an individual, reasoned result per item |
| **EL-SC-06b** the handler that denies the unknown and grants the known | adversarial · adversarial | Given a permission handler that answers from a set of allowed permission names, registered together with its check-handler twin, when a page at an unrelated origin requests an allowed permission, then it is granted | Oracle: drive an allowed permission from a disallowed origin and expect deny; the disallowed-permission test passes against this handler, its default branch denies, and it is reachable. → the design MUST scope every origin-sensitive guard to the requesting origin, and MUST test the inverted pair |
| **EL-SC-06c** one half of the pair | negative · negative | Given an app that registers the permission request handler only, when a web API runs its permission check first, then the check takes its default path and the request handler is never consulted | Oracle: grep for both registrations and drive a check-path capability; a suite exercising only the request path is green. → the design MUST require both handlers, deciding by the same verdict |

#### EL-SC-07 — Navigation, redirect, and window-open coverage

**Primary** — 7 Trust / harm / governance: the family turns on whether a correct decision is attached to the
events that carry the frames at risk. **Secondary** — 4, 6.
**Exercises** — EL-R-05, EL-R-06 · depth
[`security.md` § 6](security.md#6-item-13-the-navigation-event-surface),
[`security.md` § 7](security.md#7-items-14-and-15-opening-windows-and-opening-urls) ·
**check slots** `EL-CHECK-07a` to `EL-CHECK-07d`.

| Case | Type · roles | Probe — given / when / then | Failure oracle → design obligation |
|---|---|---|---|
| **EL-SC-07a** the guard covers the frames at risk | positive · positive | Given a guard registered on the frame-navigation event and on redirects, comparing a parsed `origin` against a literal allowlist, when a subframe and a redirect each attempt an off-allowlist navigation, then both are denied | Oracle: drive an in-allowlist URL from a subframe and from a redirect and confirm the guard is consulted at all; a main-frame-only test cannot tell the events apart. → the design MUST select the event by the frames it must cover, and MUST pair it with the rule that main never loads an untrusted URL itself |
| **EL-SC-07b** the flawless allowlist on the wrong event | adversarial · adversarial | Given an `origin` allowlist with no defect in it, attached to the main-frame navigation event alone — the shape of the vendor's own sample — when a subframe navigates off the allowlist, then it is admitted and the guard was never called | Oracle: navigate a subframe and observe the load; every test that drives the main frame passes. → the design MUST make event coverage part of the check, not only the comparison |
| **EL-SC-07c** the window created after startup | boundary · boundary | Given a deny-by-default window-open handler registered on the first window, when the app creates a second window or a `WebContentsView` later, then that `webContents` has no handler and opens anything | Oracle: open a non-allowlisted URL from the second surface; the single-window test is green. → the design MUST register the handler on every `webContents` the app creates, when it is created |
| **EL-SC-07d** the parse failure that allows | negative · negative | Given an allowlist check that parses with `new URL` and returns allow from its `catch`, when a malformed or relative URL arrives, then it is admitted | Oracle: drive a malformed URL and expect deny; the check parses, compares `.origin`, and reads as correct. → the design MUST make every parse-failure path deny |

#### EL-SC-08 — The `webPreferences` posture

**Primary** — 7 Trust / harm / governance: the family turns on keys whose defaults carry the security
property. **Secondary** — 3.
**Exercises** — EL-R-03, EL-N-02, Principle 4 · depth
[`security.md` § 3](security.md#3-the-webpreferences-defaults),
[`process-model.md` § 6](process-model.md#6-what-nodeintegration-true-does-to-this-map) ·
**check slots** `EL-CHECK-08a` to `EL-CHECK-08c`.

| Case | Type · roles | Probe — given / when / then | Failure oracle → design obligation |
|---|---|---|---|
| **EL-SC-08a** every present key is diffed | positive · positive (tags 3) | Given a window construction site with six keys set, when the review runs, then each of the six is compared against its documented default and each deviation carries a justification | Oracle: the diff covers every key present in the object, read against the structures document that carries all 44 defaults; a diff scoped to a summary table cannot see the rest. → the design MUST treat every present key as a claim needing justification |
| **EL-SC-08b** the deviation outside the summary | adversarial · adversarial | Given `enableBlinkFeatures` set to a feature string, when the review compares against the twelve most-cited keys, then the deviation is invisible and the posture reads clean | Oracle: the key appears in the diff because it is present, not because it is on a list. → the design MUST bound the diff by the object's own keys, never by a summary's rows |
| **EL-SC-08c** the prohibition honored, the capability restored | negative · negative | Given `nodeIntegration: false` beside `nodeIntegrationInWorker: true`, when a grep for the named prohibition runs, then it finds nothing and Node is available in a worker | Oracle: the key-by-key diff flags the second key; a name-scoped grep passes. → the design MUST express the prohibition as the closed posture, not as one forbidden line |

### Group C — the shipped artifact

#### EL-SC-09 — Development versus the shipped artifact

**Primary** — 6 Failure / recovery / operations: the family turns on failures that exist only in the runtime
nobody develops in, and on how they are detected. **Secondary** — 3, 5, 9.
**Exercises** — EL-R-11, EL-R-12, EL-R-13, EL-N-01, Principle 8, Procedure P7 · depth
[`tooling-config.md` § 6](tooling-config.md#6-the-dev-vs-production-renderer-load-path),
[`packaging-distribution.md` § 3](packaging-distribution.md#3-flipping-the-fuses-before-signing),
[`windows-native.md` § 2](windows-native.md#2-lifecycle-ordering-what-is-registered-before-ready),
[`windows-native.md` § 3](windows-native.md#3-deep-links-arrive-by-three-routes),
[`renderer-react.md` § 1](renderer-react.md#1-routing-under-the-packaged-origin),
[`renderer-react.md` § 3](renderer-react.md#3-__dirname-asar-and-the-paths-a-component-must-never-build) ·
**check slots** `EL-CHECK-09a` to `EL-CHECK-09g`.

| Case | Type · roles | Probe — given / when / then | Failure oracle → design obligation |
|---|---|---|---|
| **EL-SC-09a** the property proven where it ships | positive · positive | Given a release candidate, when the pre-release pass runs, then the packaged and signed artifact is the thing inspected: no dev-server literal, the fuse posture read back, the nine items recorded | Oracle: each result names the artifact it was read from; a result read from an unpackaged run is not evidence for a packaged property. → the design MUST make the packaged artifact the subject of every packaged-only property |
| **EL-SC-09b** the router that only works behind a server | alternative-valid · alternative-valid | Given a history router that reloads correctly behind the dev server, when the packaged app reloads at a nested route, then the load re-requests a path with nothing behind it | Oracle: reload the packaged app at a deep route, or open it by deep link; the dev server rewrites the same request and hides the failure. → the design MUST read the router choice off the load path, not off the development experience |
| **EL-SC-09c** the clean console read as a signal | adversarial · adversarial | Given a development run with no renderer security warning, when that is taken as the security result, then the code-only items, which no warning covers, are unexamined | Oracle: the security evidence names the nine individually; a record whose evidence is the absence of console output covers none of them. → the design MUST separate the warning surface from the code-only surface, by name |
| **EL-SC-09d** the dead branch that still ships a literal | adversarial · adversarial | Given exactly one correct build-time branch for the load path, when the development arm's dev-server URL is a literal in the shipped bundle, then the branch is dead and the string is present | Oracle: search the packaged artifact for the literal; a reviewer checking "exactly one branch" sees nothing wrong. → the design MUST require the literal's absence from the artifact, not only a correct branch in the source |
| **EL-SC-09e** the posture read on one artifact | failure / recovery · failure/recovery | Given a fuse posture flipped at packaging time, when the read runs against the x64 build only, then the arm64 build ships unflipped; and a posture entry the tool does not report is scored as a match | Oracle: one read per shipped platform and architecture, compared entry by entry, with an unreported entry counted as a failure. → the design MUST bound the comparison by the intended posture and by the shipped set, not by the tool's output |
| **EL-SC-09f** the listener that attaches after ready | boundary · boundary | Given a deep-link listener written at the top level of a module, when that module is loaded by a dynamic import inside the ready handler, then the registration lands after ready and the launching URL is lost | Oracle: cold-start the packaged app from a link and observe whether the handler fires; the listener is textually at module top level either way. → the design MUST place the registration in the entry module's first synchronous evaluation, and MUST take the single-instance lock before handling the link |
| **EL-SC-09g** the archive path handed to the view | negative · negative (tags 3) | Given a main-side path built from the module directory, when it is sent to a component that puts it in a URL, then the packaged path points inside the archive and the document's origin is not the filesystem | Oracle: load the packaged app and observe the asset; in development the same path resolves and looks correct. → the design MUST keep filesystem paths on the side that has a filesystem, and send bytes or an app-protocol URL instead |

#### EL-SC-10 — Secrets, the archive, and the returns that carry the failure

**Primary** — 7 Trust / harm / governance: the family turns on the retention of sensitive data and on
capabilities that fail without raising. **Secondary** — 6.
**Exercises** — EL-N-06, and the judgment default that a returned failure is the whole failure · depth
[`packaging-distribution.md` § 2](packaging-distribution.md#2-what-goes-into-the-artifact-and-what-asar-is-not),
[`windows-native.md` § 6](windows-native.md#6-the-four-platform-failure-modes) ·
**check slots** `EL-CHECK-10a` to `EL-CHECK-10c`.

| Case | Type · roles | Probe — given / when / then | Failure oracle → design obligation |
|---|---|---|---|
| **EL-SC-10a** the secret the bundle does not contain | negative · negative, adversarial | Given a build with no credential literal anywhere in it, when the app fetches a token on first run and caches it under the user-data directory, then the exposure is the same as shipping it | Oracle: inspect what the app writes at runtime as well as what it ships; a bundle-scoped check passes. → the design MUST bound the secret check by everything the app writes, and MUST reject the archive as a boundary |
| **EL-SC-10b** encryption whose backend was checked | positive · positive | Given a secret stored through the platform keystore API, when the app runs where no keystore backend is available, then the availability result is read and the app degrades deliberately instead of storing a falsely-encrypted blob | Oracle: run with the backend unavailable and inspect the stored bytes; a happy-path run on a machine with a keystore never reaches the branch. → the design MUST read the backend result before trusting encryption |
| **EL-SC-10c** the capability that failed by returning | failure / recovery · failure/recovery | Given a native registration whose failure is a return value rather than a throw, when it fails on one platform, then the feature does nothing, no error is raised, and the code path looks taken | Oracle: assert on the return value and drive the platform's failing condition; a `try`/`catch` around the call observes nothing. → the design MUST treat a returned failure as a handled error path, per platform |

#### EL-SC-11 — Upgrading across a major

**Primary** — 9 Change / compatibility / reversibility: the family turns on a version event and what it took
away. **Secondary** — 2, 4, 6.
**Exercises** — EL-N-05, EL-N-07, Principle 7 · depth
[`migration.md` § 2](migration.md#2-the-removal-and-deprecation-index),
[`migration.md` § 3](migration.md#3-stale-training-data-tells),
[`migration.md` § 1](migration.md#1-coverage-ceiling-and-freshness-stamp),
[`packaging-distribution.md` § 5](packaging-distribution.md#5-native-modules) ·
**check slots** `EL-CHECK-11a` to `EL-CHECK-11d`.

| Case | Type · roles | Probe — given / when / then | Failure oracle → design obligation |
|---|---|---|---|
| **EL-SC-11a** the idiom that was correct once | change / regression · change/regression (actor: a reader inheriting or generating code) | Given a module written to a removed or behavior-changed API, when it is built and run on a supported major, then it compiles, it runs, and the guard it contains never fires | Oracle: sweep for the tells and confirm the guard is reached at all; a successful build says nothing, because the failure is a listener that is never called. → the design MUST teach the tells that date a source, ahead of any version check |
| **EL-SC-11b** the clean source and the dependency | adversarial · adversarial | Given an application whose own source sweeps clean, when a bundled dependency uses a removed API internally, then the app breaks at runtime on a supported major | Oracle: run the sweep over the bundled dependency tree as well as the source; a hit there is a dependency to replace or pin, not a line to edit. → the design MUST scope the sweep to what ships, not to what is authored |
| **EL-SC-11c** the API with no row | counterfactual · counterfactual, boundary | Given the premise that an API absent from the removal index is current, when the reader queries an API the index never covered, then absence is read as a clean bill of health | Oracle: the index states its ceiling and its non-exhaustiveness and sends the reader to the vendor's own document at the target major; a lookup that returns nothing must be distinguishable from a lookup that answered. → the design MUST state the index's ceiling and MUST route an unmatched query outward |
| **EL-SC-11d** the ABI fixed on one machine | change / regression · change/regression | Given a native module that fails to load after the upgrade, when it is rebuilt with the system Node toolchain locally, then it loads on the developer's machine and fails on the user's | Oracle: check which runtime's ABI the artifact was built against; the local run succeeds and names no version change. → the design MUST rebuild against the Electron ABI, or choose a module whose ABI does not move |

### Group D — the skill itself

#### EL-SC-12 — Maintaining the skill

**Primary** — 10 Evidence / traceability / clarity: the family turns on whether this skill's own claims stay
followable to a source. **Secondary** — 9. Actor: the maintainer of `skills/electron/`.
**Exercises** — EL-R-14, EL-R-15, EL-R-16 · depth
[`migration.md` § 4](migration.md#4-the-behavior-claim-register),
[`migration.md` § 1](migration.md#1-coverage-ceiling-and-freshness-stamp) ·
**check slots** `EL-CHECK-12a` to `EL-CHECK-12d`.

| Case | Type · roles | Probe — given / when / then | Failure oracle → design obligation |
|---|---|---|---|
| **EL-SC-12a** the claim that never reached the register | change / regression · change/regression (actor: the maintainer) | Given a version-sensitive behavior claim added to a child, when the register is walked outward from the register, then every entry checks out and the new claim sits unqualified | Oracle: walk from the text as well — every such claim in the skill has a row; a one-directional walk cannot see this. → the design MUST require both directions, and MUST make adding a claim include adding its row in the same change |
| **EL-SC-12b** the examples the extractor discarded | adversarial · adversarial | Given examples transcribed from vendor samples into `js` fences, when the harness runs, then the few `ts` blocks keep the unit count non-zero and the run is green | Oracle: extracted units plus counted uncompiled blocks equal the fenced blocks in the skill, and an unsupported fence language is a hard error; a count with no denominator hides the loss. → the design MUST record the ratio, not the count |
| **EL-SC-12c** the stamp that outlived its fetch | adversarial · adversarial | Given a rotation record naming every source and stamped with the date of the rotation, when no source was actually re-fetched, then the record and a real rotation produce the same observable | Oracle: each rotation entry carries the quoted sentence with its line number in the re-fetched source, which cannot be produced without the fetch. → the design MUST require a re-fetch artifact, not a self-report |
| **EL-SC-12d** the window that expired quietly | boundary · boundary | Given a version window with a written next-rotation date, when that date passes, then nothing in the text changes and the window points at a rotation that already happened | Oracle: re-derive the rotation date from the published schedule rather than read it from the file; a date in the past is a review failure. → the design MUST derive the rotation date and MUST fail review once it has passed |

---

## 7. The six cosmetic-conformance cases

These six exist because a wrong Electron implementation compiles, runs, and looks complete. Each names the
conformant artifact it must reject; none is satisfied by the absence of a guard.

| # | Case | The conformant artifact it rejects | What the case observes instead |
|---|---|---|---|
| 1 | `EL-SC-03b` | one tsconfig whose `lib` and `types` cover every process; the project type-checks green | the same input under three per-target passes, and a stated pass count of three |
| 2 | `EL-SC-04c` | a preload that exposes the renderer IPC module wholesale; nothing throws at exposure time | each exposed key asserted to be a function of the expected arity |
| 3 | `EL-SC-06b` | a permission handler whose default branch denies, whose twin is registered, and which passes every disallowed-permission test | an allowed permission requested from a disallowed origin, denied |
| 4 | `EL-SC-07b` | a defect-free parsed-`origin` allowlist, attached to the main-frame navigation event alone | a subframe navigation and a redirect, each reaching the guard |
| 5 | `EL-SC-05b` | a sender guard that null-checks the frame and compares its origin against a literal allowlist | a non-null frame with `detached === true` and an allowlisted URL, denied |
| 6 | `EL-SC-02c` | a `main`-tagged module importing the renderer-side IPC module; three passes run and all are green | `TS2305` from the main target's own generated `electron` view |

---

## 8. Coverage gaps, decisions, and candidates

**Recorded gaps.**

1. **Most judgment defaults are graded, not probed.** Three of the eight are exercised here — the offload
   target by `EL-SC-02b`, the packaged renderer's origin by `EL-SC-09b`, and the N-API preference by
   `EL-SC-11d`. The other five are checks on this skill's own prose, and their caveats are graded through
   [`evaluation.md`](evaluation.md).
2. **`EL-SC-09e` inherits an unverified invocation.** The fuse read is its oracle, and the invocation shape
   carries `SKILL.md`'s `UNVERIFIED-AGAINST-ARTIFACT` marker. The case is runnable; its command has not been
   run against a packaged build by this skill.
3. **`EL-SC-05c` has no behavioral oracle, by construction.** Its conjunct is a review of one line per
   handler. That is stated rather than closed, because no runner can stage the navigation race.
4. **Accessibility and locale have no case.** No live clause covers an access need, an input method, or a
   locale, which is why category 8 is `n/a`. It becomes coverable when a clause exists.

**Orphan sweep.** Every `EL-R-*` and `EL-N-*` rule reaches at least one case through a family's
**Exercises** line. The eleven security items outside the code-only nine, and the two vendor samples this
skill is deliberately stricter than, are reached through `EL-SC-06a`, `EL-SC-07b` and `EL-SC-05a` rather
than through cases of their own. No case here traces to an obligation that no clause supports.

**Candidate additional cases.** One-liners, none duplicating a discrimination above: a session partition
shared between a trusted and an untrusted view, so one permission posture covers both (7); a custom
protocol handler that serves the entry document for any unknown path, including one that escapes the app's
own directory (7); a channel whose payload grows a field only the renderer side is updated for (9); an
`openExternal` allowlist checked on the URL while the calling frame is never checked (7); a window created
before the session's permission handlers are registered (6); a preload bundled per window, so one window's
surface widens without the other's (4).
