# Ideation Loop — Evaluation Checklist

> **Copy-then-tick — this file is the source; the evaluator copies it.** At Stage 0 the
> evaluator COPIES this file to
> `sessions/{date}-{session-id}/1-ideation/evaluation/iter{n}/{system}/checklist.md`. The
> filled copy is a real **9th evaluation-output file**, alongside the seven per-perspective
> files + `overall.md`. The source here ships with every box UNCHECKED.
>
> **A ticked box = VERIFIED, not "done".** `- [x]` means the evaluator VERIFIED the check
> against the Ideation draft with the strongest verification the check admits (close-read the
> section / cross-reference a cited insight / `grep` a term across the draft / confirm a cited
> path resolves) — never that work merely happened.
>
> **Fill procedure.** Stage 0: copy (boxes unchecked). Stage 1: append a `## Stage 1 Additions`
> section for any scenario or check the Frame added that is not seeded here. Stage 2: tick each
> box `[x]` and annotate its outcome — `PASS:` (verified satisfied), `FAIL: {finding-id}`
> (verified violated, cite the finding), or `n/a: {reason}` (not applicable to this draft). The
> completeness gate requires every box resolved to exactly one of the three.
>
> **Legend.** `- [ ]` unresolved · `- [x] … PASS:` verified satisfied · `- [x] … FAIL: {finding-id}`
> verified violated · `- [x] … n/a: {reason}` not applicable. Record per-perspective counts
> (PASS / FAIL / n/a / total) in the filled copy's compact per-scenario results table.

The scenario families, their lenses, and the adversarial cases these checks discriminate live
in the sibling `scenario.md`; the evaluation procedure lives in `evaluation.md`. The heading
tree below is 1:1 with `scenario.md`.

---

## Project

### IDEA-PROJ-SCENARIO-01 — Root cause, not a symptom
- [ ] IDEA-PROJ-SCENARIO-01-CHECK-01 — The "Why?" chain terminates at a cause that, if absent, would obviate the work.
- [ ] IDEA-PROJ-SCENARIO-01-CHECK-02 — Prior attempts are documented, or a confirmed "None on record" is stated.
- [ ] IDEA-PROJ-SCENARIO-01-CHECK-03 — The Design section solves the same problem the Framed Problem states (no framing-vs-design drift).

### IDEA-PROJ-SCENARIO-02 — Scope Contract is enumerated and refusable
- [ ] IDEA-PROJ-SCENARIO-02-CHECK-01 — The Scope Contract names explicit, non-overlapping Project / Feature / Task boundaries.
- [ ] IDEA-PROJ-SCENARIO-02-CHECK-02 — Every non-chosen candidate from Sub-step B has a backlog routing.
- [ ] IDEA-PROJ-SCENARIO-02-CHECK-03 — No "etc." or "and related" phrasing softens the boundary; In-Scope / Out-of-Scope / Deferred enumerate.
- [ ] IDEA-PROJ-SCENARIO-02-CHECK-04 — The idea was checked against existing feature scopes under `.gobbi/projects/{project-name}/features/`, and any overlap is made explicit rather than deferred.

### IDEA-PROJ-SCENARIO-03 — Trigger, success criteria, and counterfactual are concrete
- [ ] IDEA-PROJ-SCENARIO-03-CHECK-01 — The trigger (a specific failure / request / deadline / opportunity) is named with a concrete reference, not generic.
- [ ] IDEA-PROJ-SCENARIO-03-CHECK-02 — Success criteria are observable pass/fail from artifacts, not vibes.
- [ ] IDEA-PROJ-SCENARIO-03-CHECK-03 — The counterfactual presents the strongest "do nothing" argument, and the reason it was rejected is stated with evidence.
- [ ] IDEA-PROJ-SCENARIO-03-CHECK-04 — The re-framing check (6th forcing question) recorded a confirmed re-frame or a defensible "no change" with reasoning.

### IDEA-PROJ-SCENARIO-04 — Load-bearing premises and prior art are grounded
- [ ] IDEA-PROJ-SCENARIO-04-CHECK-01 — Each load-bearing assumption is named and tagged "if this is wrong, the design fails", and either cites supporting evidence or is surfaced as `assumption_risk`.
- [ ] IDEA-PROJ-SCENARIO-04-CHECK-02 — The design names an observable signal that would confirm the idea worked and one that would falsify it.
- [ ] IDEA-PROJ-SCENARIO-04-CHECK-03 — Prior-art search ran across memory, codebase, adjacent work, and the community, with negative results recorded so absence of citation is auditable.
- [ ] IDEA-PROJ-SCENARIO-04-CHECK-04 — The closest prior arts are characterized — why each is not a fit, or where each is borrowed from.

---

## Structure

### IDEA-STRUCT-SCENARIO-01 — Decomposition coheres and is boring-by-default
- [ ] IDEA-STRUCT-SCENARIO-01-CHECK-01 — Each proposed component / module / layer owns one named concern.
- [ ] IDEA-STRUCT-SCENARIO-01-CHECK-02 — Coupling runs in one direction; the proposed decomposition has no circular dependency.
- [ ] IDEA-STRUCT-SCENARIO-01-CHECK-03 — Alternatives considered are documented, or "no alternatives" is explicitly justified.
- [ ] IDEA-STRUCT-SCENARIO-01-CHECK-04 — Any novel structural choice spends an explicit innovation token with rationale; no novel pattern where an existing one suffices.

### IDEA-STRUCT-SCENARIO-02 — Design direction is concrete and maintainable
- [ ] IDEA-STRUCT-SCENARIO-02-CHECK-01 — Each directional design decision names the library / framework / design pattern / API shape explicitly.
- [ ] IDEA-STRUCT-SCENARIO-02-CHECK-02 — Each design decision has rationale anchored to a specific research insight (internal or external).
- [ ] IDEA-STRUCT-SCENARIO-02-CHECK-03 — Every element matches an existing project pattern, or its deviation is justified (no "magic" component).
- [ ] IDEA-STRUCT-SCENARIO-02-CHECK-04 — Non-obvious terms have an inline or referenced definition (two-week smell test).

### IDEA-STRUCT-SCENARIO-03 — Testability and acyclic data flow
- [ ] IDEA-STRUCT-SCENARIO-03-CHECK-01 — Testability hooks are identified — what gets stubbed / faked / observed for verification.
- [ ] IDEA-STRUCT-SCENARIO-03-CHECK-02 — A verification approach is named for each major component.
- [ ] IDEA-STRUCT-SCENARIO-03-CHECK-03 — Cross-module data flow direction is traced and confirmed acyclic.
- [ ] IDEA-STRUCT-SCENARIO-03-CHECK-04 — No "manager" / "coordinator" element touches every component (shared-state-hub check).

---

## Performance

### IDEA-PERF-SCENARIO-01 — Scale, dominant cost, and limits are stated
- [ ] IDEA-PERF-SCENARIO-01-CHECK-01 — The expected request / operation rate is stated, not implicit; scale assumptions are documented (not "should be fine").
- [ ] IDEA-PERF-SCENARIO-01-CHECK-02 — Order-of-magnitude / growth reasoning is present where repeated or large-scale work matters.
- [ ] IDEA-PERF-SCENARIO-01-CHECK-03 — The dominant cost (compute / IO / memory / network) is identified, and the external-call pattern is characterized (how many calls, whether they batch, and how the design behaves when an external call fails or is slow).
- [ ] IDEA-PERF-SCENARIO-01-CHECK-04 — Caching / memoization is an explicit yes / no / deferred-with-reason decision.
- [ ] IDEA-PERF-SCENARIO-01-CHECK-05 — The point at which the approach stops applying is named, with any latency / throughput / memory budget stated.

### IDEA-PERF-SCENARIO-02 — Hot paths carry a measurement commitment
- [ ] IDEA-PERF-SCENARIO-02-CHECK-01 — Each hot path has a measurement strategy committed for the Execution loop.
- [ ] IDEA-PERF-SCENARIO-02-CHECK-02 — There is no silent assumption that "the framework will handle it".
- [ ] IDEA-PERF-SCENARIO-02-CHECK-03 — Loops over potentially-large collections are checked for a hidden per-item external call.
- [ ] IDEA-PERF-SCENARIO-02-CHECK-04 — Recursive / nested structures are checked for combinatorial blow-up.

---

## Aesthetics

### IDEA-AESTH-SCENARIO-01 — Draft is self-evident and convention-matched
- [ ] IDEA-AESTH-SCENARIO-01-CHECK-01 — "What is this proposing?" is answerable from the first page without the leader's transcripts (Krug self-evidence).
- [ ] IDEA-AESTH-SCENARIO-01-CHECK-02 — Section ordering and heading style match prior Ideation drafts in this project; frontmatter, where applicable, is complete.
- [ ] IDEA-AESTH-SCENARIO-01-CHECK-03 — Headlines and first-paragraph claims accurately summarize the section that follows (no clickbait).

### IDEA-AESTH-SCENARIO-02 — Names are liftable, stable, and no section is filler
- [ ] IDEA-AESTH-SCENARIO-02-CHECK-01 — Names for proposed components / functions / paths are concrete enough that a Planner could lift them directly.
- [ ] IDEA-AESTH-SCENARIO-02-CHECK-02 — The same concept does not appear under two names.
- [ ] IDEA-AESTH-SCENARIO-02-CHECK-03 — No placeholder text remains (`TBD`, `TODO`, `...`, "see below" with no below).
- [ ] IDEA-AESTH-SCENARIO-02-CHECK-04 — No paragraph could be deleted without losing information (Rams).
- [ ] IDEA-AESTH-SCENARIO-02-CHECK-05 — Conclusions reached are supported by the artifact's own evidence, not waved at.

---

## Usage

### IDEA-USAGE-SCENARIO-01 — Planner and Executor can act without re-asking the user
- [ ] IDEA-USAGE-SCENARIO-01-CHECK-01 — Every directional design decision has enough specificity to start implementation (no "we'll figure out the library later").
- [ ] IDEA-USAGE-SCENARIO-01-CHECK-02 — Scenarios are concrete enough for Planning to map them to tasks 1:1.
- [ ] IDEA-USAGE-SCENARIO-01-CHECK-03 — Every scenario indicates what file / module / function it concerns.
- [ ] IDEA-USAGE-SCENARIO-01-CHECK-04 — Target names are stable across the document.
- [ ] IDEA-USAGE-SCENARIO-01-CHECK-05 — Every cited research insight has a path / URL / reference the consumer can follow.

### IDEA-USAGE-SCENARIO-02 — 3am maintainer, failure modes, and diagnosability
- [ ] IDEA-USAGE-SCENARIO-02-CHECK-01 — The artifact names its consumers (Planner / Executor / future-self) and confirms each can use it; glossary terms are defined inline or by reference.
- [ ] IDEA-USAGE-SCENARIO-02-CHECK-02 — Each named failure mode has a corresponding implementation expectation; no promised behavior the design cannot deliver.
- [ ] IDEA-USAGE-SCENARIO-02-CHECK-03 — The design names what would log and what would alert when something goes wrong (Coverage: Observability), or declares `not-applicable: <rationale>`.
- [ ] IDEA-USAGE-SCENARIO-02-CHECK-04 — A 3am maintainer has enough surface (logs / signals / paths) to identify the failing component without re-reading the whole design.

### IDEA-USAGE-SCENARIO-03 — Consumer mental model and accessibility / locale coverage
- [ ] IDEA-USAGE-SCENARIO-03-CHECK-01 — Terms borrowed from the project's existing vocabulary are used with the same meaning; any overloaded term states its local meaning.
- [ ] IDEA-USAGE-SCENARIO-03-CHECK-02 — If the idea affects a user-facing surface, accessibility / keyboard-nav / screen-reader needs are surfaced as scenarios (Coverage: Usage), or `not-applicable: <rationale>` is declared.
- [ ] IDEA-USAGE-SCENARIO-03-CHECK-03 — If the idea introduces user-facing strings, a localization strategy is named, or the monolingual-scope rationale is stated.

---

## Consistency

### IDEA-CONS-SCENARIO-01 — Scope Contract, Framed Problem, and Design describe one problem
- [ ] IDEA-CONS-SCENARIO-01-CHECK-01 — The Design section solves the problem the Framed Problem states, not a different one.
- [ ] IDEA-CONS-SCENARIO-01-CHECK-02 — Scope Contract phrasing matches between the top of the document and any later restatement.

### IDEA-CONS-SCENARIO-02 — Design decisions match the insights they cite
- [ ] IDEA-CONS-SCENARIO-02-CHECK-01 — Design choices cite specific research-insight labels that actually exist in the Research Insights section.
- [ ] IDEA-CONS-SCENARIO-02-CHECK-02 — Cited insights actually say what the design claims (no over-citation).
- [ ] IDEA-CONS-SCENARIO-02-CHECK-03 — Where internal and external insights tension, the artifact states which prevails and why (not silently assumed compatible).

### IDEA-CONS-SCENARIO-03 — Scenarios, checklist, and terms align
- [ ] IDEA-CONS-SCENARIO-03-CHECK-01 — Every Implementation Checklist item is anchored to at least one scenario, or its absence is justified.
- [ ] IDEA-CONS-SCENARIO-03-CHECK-02 — Every scenario has at least one Implementation Checklist item that would verify it.
- [ ] IDEA-CONS-SCENARIO-03-CHECK-03 — A term used in the Scope Contract is the same term in Design (no synonym drift, e.g. "the Planner" vs "the Plan agent").

---

## Risk

### IDEA-RISK-SCENARIO-01 — Blast radius and rollback are bounded
- [ ] IDEA-RISK-SCENARIO-01-CHECK-01 — A rollback path is stated for each irreversible step, or "no irreversible steps" is confirmed.
- [ ] IDEA-RISK-SCENARIO-01-CHECK-02 — The rollback path does not require perfect coordination across the team.
- [ ] IDEA-RISK-SCENARIO-01-CHECK-03 — The blast radius is enumerated — files / modules / consumers / external systems impacted.
- [ ] IDEA-RISK-SCENARIO-01-CHECK-04 — Backwards-compat impact is stated for any external interface.

### IDEA-RISK-SCENARIO-02 — Security surface and irreversible steps are gated
- [ ] IDEA-RISK-SCENARIO-02-CHECK-01 — The security-surface delta is `none` or explicitly described (new auth boundary / data egress / untrusted-input path).
- [ ] IDEA-RISK-SCENARIO-02-CHECK-02 — Each new untrusted-input path names a validation strategy.
- [ ] IDEA-RISK-SCENARIO-02-CHECK-03 — Each irreversible step (data migration / public-interface change / external write) is flagged as such with a go/no-go decision point.
- [ ] IDEA-RISK-SCENARIO-02-CHECK-04 — Shared mutable state is identified (or "no shared mutable state" confirmed), with a synchronization decision named per surface.

### IDEA-RISK-SCENARIO-03 — Design stays inside the Scope Contract
- [ ] IDEA-RISK-SCENARIO-03-CHECK-01 — Diffing the Scope Contract against the Design section surfaces no file / module mention outside the contract.
- [ ] IDEA-RISK-SCENARIO-03-CHECK-02 — Any outside-scope change is re-scoped into the contract or backlogged, not silently absorbed.
- [ ] IDEA-RISK-SCENARIO-03-CHECK-03 — The Design avoids load-bearing future-self promises ("we'll improve this later") and names its maintenance burden (two-week smell test).

### IDEA-RISK-SCENARIO-04 — Privacy, license, and cost surfaces reviewed
- [ ] IDEA-RISK-SCENARIO-04-CHECK-01 — A new sensitive-data surface is identified (or explicit "no new sensitive data"), with a retention / scrubbing strategy for anything persisted (Coverage: Privacy).
- [ ] IDEA-RISK-SCENARIO-04-CHECK-02 — Borrowed code or patterns have a license verified compatible with project policy, and any new external-dependency decision names its license class (Coverage: License/IP).
- [ ] IDEA-RISK-SCENARIO-04-CHECK-03 — Recurring-cost dimensions (paid API / infra / storage) are named with order-of-magnitude estimates, and a cost-runaway scenario is identified or "no runaway possible" is stated (Coverage: Cost).
