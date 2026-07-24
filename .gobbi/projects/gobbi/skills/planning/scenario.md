# Planning Loop — Evaluation Scenarios

Coverage-framed scenario set for evaluating a **Planning working draft**. The evaluator loads
this file at Stage 1 (Scenario-Checklist Frame Build) as the per-perspective seed scenarios for
the seven perspectives. It conforms to the in-tree Scenario SOP — see
[the Scenario SOP § Rules](../scenario/SKILL.md#rules) for the category-and-case taxonomy, the
coverage frame, and the failability teeth this set is built to.

**Target.** The Planning working draft at
`sessions/{date}-{session-id}/3-planning/working/draft-iter{n}.md`: the locked Scope Contract
inherited from Ideation, the ordered task list (each task the canonical YAML record), the
dependency graph, and the per-task agent assignment. A plan is judged against the idea it
implements — the Ideation working draft is a required input.

**Consumer.** The Planning-loop evaluator (Claude + Codex), and, second-hand, the manager who
reconciles the two verdicts.

**Lifecycle mode.** Evaluation coverage. This set names its coverage axes up front, derives
families and cases from them, turns each case into a design obligation the plan-under-review must
satisfy, and states what it does not cover. It stops at design obligations; the concrete yes/no
checks live 1:1 in the sibling `checklist.md`, and the per-perspective procedure lives in the
sibling `evaluation.md`.

**The SOP / WF / SEAM family model.** Families carry one of three prefixes — a label, not a new
method:

- **`SOP-*`** — generic plan-quality: whether the draft is a good plan by the workflow-agnostic
  craft the [generic planning SOP § Rules](SKILL.md#rules) owns (coverage without gaps,
  outcome-slicing, bounded packages, DAG order, forecast-with-triggers, pre-anchored acceptance).
- **`WF-*`** — gobbi workflow-compliance: whether the draft follows the Gobbi Planning mechanics
  the folded workflow doc `orchestration/workflow/planning.md` owns (the canonical task schema,
  anchor-every-task, agent assignment, USER CHALLENGE, no test-writing task).
- **`SEAM-*`** — the SOP↔WF boundary: whether the generic craft and the gobbi mechanics agree
  (one gobbi `traces-to` per package; every generic contract field representable in the task
  schema; `requires:` edges matching the rendered DAG; assumption signposts mapped to the gobbi
  re-plan responses).

Each family declares its own primary coverage category, so it routes to an evaluation perspective
through the Scenario SOP's design-category → perspective map; the § Per-perspective seed index
below is the reverse lookup the evaluator uses at Stage 1.

---

## Set-level frame

### Author-declared primary category

Each family declares **one** primary category with a one-line justification (per
[the Scenario SOP § Rules](../scenario/SKILL.md#rules) SR-4). The author-declared primary is used
only for stable IDs, grouping, and primary-perspective routing — it **never** discharges
coverage. No mechanical order chooses it; the declared primary names the family's defining
discrimination, and the higher-order matches become secondary tags. Completeness is carried
independently, by the coverage register plus the per-family triggered minimums — never by the
primary label.

### Coverage register (SR-1 — all ten categories dispositioned)

Every one of the ten coverage categories is given exactly one disposition. A category matched only
as a secondary tag is still `selected`; its families are the tag-carriers.

| # | Category | Disposition | Where covered |
|---|---|---|---|
| 1 | `Purpose / outcomes / scope` | selected | SOP-COVERAGE, WF-TRACE (Project) |
| 2 | `Actors / stakeholders / use-context` | selected | WF-ASSIGN, WF-FRESH-EXEC (Usage) |
| 3 | `Behavior / state / data` | selected | secondary tag on SEAM-SCHEMA-FIT, SEAM-TRACES — the plan's inter-task `inputs:`/`outputs:` data-lifecycle and task-state ordering |
| 4 | `Interfaces / dependencies / structure` | selected | SOP-SLICE, SOP-DAG, WF-SCHEMA, SEAM-SCHEMA-FIT (Structure) |
| 5 | `Quality attributes / resource economics` | selected | SOP-PERF (Performance) |
| 6 | `Failure / recovery / operations` | selected | SOP-FORECAST, SOP-REVERSIBILITY, SEAM-TRIGGER-MAP (Risk) |
| 7 | `Trust / harm / governance` | selected | WF-GOVERNANCE (Risk) |
| 8 | `Inclusion / locale` | selected | secondary tag on SOP-CLARITY — a plan skip-friendly and scannable for a fresh executor (accessibility); i18n is `not-applicable` (see § Coverage-ownership matrix mapping) |
| 9 | `Change / compatibility / reversibility` | selected | secondary tag on SOP-REVERSIBILITY — isolating migrations / dependency upgrades / public-interface changes, and the whole change set being git-revertible |
| 10 | `Evidence / traceability / clarity` | selected | SOP-CONTRACT, SOP-CLARITY, SEAM-TRACES (Consistency / Aesthetics) |

No category is `covered-elsewhere`; every concern that can affect a plan is covered by this set's
own families.

### Per-perspective seed index

At Stage 1 the evaluator filters families to a perspective by this reverse lookup (primary and
secondary perspective, per the Scenario SOP's design-category → perspective map). Every one of the
seven perspectives has at least one seed family.

| Perspective | Seed families |
|---|---|
| Project | SOP-COVERAGE, WF-TRACE |
| Structure | SOP-SLICE, SOP-DAG, WF-SCHEMA, SEAM-SCHEMA-FIT (+ SOP-REVERSIBILITY, secondary) |
| Performance | SOP-PERF |
| Aesthetics | SOP-CLARITY (secondary), SOP-CONTRACT (secondary), SEAM-TRACES (secondary) |
| Usage | WF-ASSIGN, WF-FRESH-EXEC, SOP-CLARITY (secondary, accessibility) |
| Consistency | SOP-CONTRACT, SOP-CLARITY, SEAM-TRACES, SEAM-SCHEMA-FIT (secondary), SEAM-TRIGGER-MAP (secondary), WF-GOVERNANCE (secondary) |
| Risk | SOP-FORECAST, SOP-REVERSIBILITY, WF-GOVERNANCE, SEAM-TRIGGER-MAP, SOP-PERF (secondary) |

### Coverage-ownership matrix mapping

Each cross-cutting concern the evaluation skill assigns to a perspective gets a seed here, or an
explicit `not-applicable`.

| Concern | Owning perspective(s) | Seed |
|---|---|---|
| Accessibility | Usage | SOP-CLARITY — the plan is scannable / skip-friendly so a fresh executor can navigate it |
| Internationalization / localization | Usage | `not-applicable`: the plan is an internal English working document for a single solo user; there is no locale, sort-order, or input-method variation to serve |
| Privacy / data retention | Risk + Consistency | WF-GOVERNANCE — PII / data-flow boundaries from Ideation preserved across the decomposition |
| Licensing / IP | Risk + Consistency | WF-GOVERNANCE — new-dependency tasks name their license / IP surface |
| Dependency supply chain | Risk + Structure | WF-GOVERNANCE — new-dependency tasks flagged; dependency-manifest changes sequenced first |
| Observability / telemetry | Structure + Usage | WF-GOVERNANCE — the plan is observable mid-execution; long-running tasks emit intermediate signals |
| Cost / budget impact | Performance + Risk | SOP-PERF (per-task ceilings) + WF-GOVERNANCE (cross-task cost multiplication) |
| Error budget impact | Performance + Risk | SOP-PERF — where a task touches a runtime SLO path; `not-applicable` for pure-doc tasks with no runtime path |

### Stable-ID policy

Family IDs are `{SOP|WF|SEAM}-{NAME}`; case IDs are `{family-id}-CASE-{NN}`; check IDs are
`{family-id}-CHECK-{NN}` and live in `checklist.md`. IDs are stable across iterations — the
evaluator preserves an existing ID and never renumbers a surviving family.

### Set scale (SR-8)

Sixteen families across three groups, each exercising a small, bounded set of case types. The author
tunes the split thresholds for this evaluation register to **≤ 18 families / ≤ 60 cells** — higher
than the SOP default because one coverage register spans seven perspectives plus the
coverage-ownership matrix. This set's family count and its distinct (category, case-type) cell count
are both within the tuned thresholds, so it is not split under a parent index.

### Source register

- The generic planning SOP — [§ Rules](SKILL.md#rules) (11 Must-Follow + 10 Must-Not-Follow) and
  [§ Procedure](SKILL.md#procedure) (P1–P8). The SOP-* families derive from these.
- The folded workflow doc `orchestration/workflow/planning.md` — its
  [§ Operating principles](../orchestration/workflow/planning.md#operating-principles),
  [§ USER CHALLENGE](../orchestration/workflow/planning.md#user-challenge), the canonical task
  schema, and the agent-assignment sub-step. The WF-* families derive from these.
- The D3 minimum seam coverage (S8): one gobbi `traces-to` per package; every generic contract
  field representable in the task schema; `requires:` edges match the rendered DAG; assumption /
  signpost triggers map to REVISE / USER-CHALLENGE / re-entry. The SEAM-* families derive from
  these.
- The evaluation skill's Coverage Ownership Matrix (accessibility / i18n / privacy / licensing /
  supply-chain / observability / cost / error-budget).

Evidence is referenced by pointer, never inlined; a Planning draft carries no sensitive data, so
no redaction applies (SR-9).

---

## SOP-* — generic plan-quality families

### SOP-COVERAGE — the decomposition equals the approved scope, with no gap, overlap, or extra
**Primary category:** 1 `Purpose / outcomes / scope` — the defining discrimination is whether the
task set covers the right and whole and only scope. **Secondary tags:** 10 (traceability of the
coverage ledger). **Primary perspective:** Project.
**Source:** SOP § Rules (bidirectional source-to-deliverable ledger) + WF § Operating principles
(stay in scope).
**Situation / actor / outcome:** the leader claims the task list implements the locked Ideation
Scope Contract; the outcome is a two-way coverage ledger where every approved outcome maps to ≥1
task and every task maps back to an approved outcome.
**Triggered minimums:** adversarial **triggered** (trust of a full-looking list); boundary
`n/a: no quantity/ordering edge`; failure/recovery `n/a: no dependency/persistence surface`;
change/regression `n/a: no version event`; counterfactual `n/a: no premise inversion distinct from
the coverage-completeness adversarial probe`.
**Cases:**
- **SOP-COVERAGE-CASE-01 (Positive / Good; coverage-role {positive}).** Given the Scope Contract's
  outcome list and the task list. When each outcome is matched to its owning task and each task to
  its outcome. Then every outcome has exactly one accountable owner and no task is unanchored.
  *Failure oracle:* a coverage-ledger row with a blank owner or a task with a blank source.
  *Observable discrimination:* a correct plan produces a complete two-way ledger; a broken one
  leaves ≥1 blank cell. *Evidence tuple:* (diff Ideation outcome list vs task `traces-to:` set /
  set-difference of the two / an empty symmetric difference confirms it). *Design obligation:* the
  plan MUST carry a bidirectional coverage ledger with one accountable task per outcome.
- **SOP-COVERAGE-CASE-02 (Adversarial; coverage-role {adversarial}).** Given a task list that reads
  as a complete implementation. When one Ideation outcome is silently left with no task. Then the
  dropped requirement hides behind a full-looking list. *Failure oracle:* an Ideation outcome absent
  from the union of all `traces-to:`. *Observable discrimination:* the adversarial reader recomputes
  the set-difference rather than trusting the list's apparent completeness. *Evidence tuple:*
  (grep each Ideation outcome against the task list / set-difference / a non-empty difference is the
  drop). *Design obligation:* the plan MUST make an uncovered outcome visible, not hideable behind a
  tidy list.
**Checklist IDs:** `SOP-COVERAGE-CHECK-*`

### SOP-SLICE — packages are outcome-sliced and bounded enough to execute as one unit
**Primary category:** 4 `Interfaces / dependencies / structure` — the defining discrimination is
the decomposition's structural soundness. **Secondary tags:** 1 (scope). **Primary perspective:**
Structure.
**Source:** SOP § Rules (slice by observable outcome; the work-package stop rule) + SOP § Procedure
P3.
**Situation / actor / outcome:** the leader slices the file map into tasks; the outcome is each
leaf being an end-to-end observable increment, directly executable / assignable / estimable /
completable / verifiable as one unit.
**Triggered minimums:** boundary **triggered** (the size limit); adversarial **triggered** (a
mega-task disguised as trivial); failure/recovery `n/a: not a runtime failure surface`;
change/regression `n/a`; counterfactual `n/a`.
**Cases:**
- **SOP-SLICE-CASE-01 (Positive / Good; coverage-role {positive}).** Given the file map. When each
  task is checked against the stop rule. Then every leaf is an observable outcome a consumer can
  inspect, sized by readiness rather than by a fixed file count. *Failure oracle:* a leaf that is a
  pure layer slice with no independently inspectable result. *Observable discrimination:* a good
  slice accepts on its own; a layer slice looks done while nothing works end to end. *Evidence
  tuple:* (read each task's outcome + `files:` / judge independent observability / a
  consumer-visible result confirms it). *Design obligation:* each package MUST be an end-to-end
  observable outcome unless a named enabler makes it unavoidable.
- **SOP-SLICE-CASE-02 (Boundary; coverage-role {boundary}).** Given a task whose `verifies:` is
  multi-step over more than three files. When its size is judged at the exact stop-rule limit. Then
  it is treated as large regardless of how it is described. *Failure oracle:* a task at or above the
  size limit still labelled trivial. *Observable discrimination:* the judgment sits at the exact
  file-count / step-count edge, not near it. *Evidence tuple:* (count `files:` and `verifies:`
  steps / arithmetic at the limit / a count over the limit confirms oversize). *Design obligation:*
  the plan MUST size a package by its executable-and-verifiable readiness, not by a convenient
  label.
- **SOP-SLICE-CASE-03 (Adversarial; coverage-role {adversarial}).** Given a mega-task described as
  trivial with an implicitly small scope. When its real `verifies:` span and file-touch are
  measured. Then the disguised size surfaces. *Failure oracle:* a "trivial" task whose measured span
  exceeds the limit. *Observable discrimination:* the reader measures rather than trusting the
  "trivial" label. *Evidence tuple:* (measure span / compare to the limit / an over-limit measure is
  the disguise). *Design obligation:* the plan MUST NOT let a mega-task hide behind an
  implicitly-small description.
**Checklist IDs:** `SOP-SLICE-CHECK-*`

### SOP-DAG — dependencies form a DAG and order is derived from it, with genuine parallel lanes
**Primary category:** 4 `Interfaces / dependencies / structure` — the defining discrimination is
the dependency structure. **Secondary tags:** 6 (ordering as an operational risk). **Primary
perspective:** Structure.
**Source:** SOP § Rules (dependencies determine order; prove a parallel lane has no path or shared
mutation) + SOP § Procedure P5.
**Situation / actor / outcome:** the leader records `requires:` edges and parallel lanes; the
outcome is an acyclic graph whose topological order reproduces the documented order, and lanes with
neither a dependency path nor a shared mutation.
**Triggered minimums:** boundary **triggered** (a cycle / a self-edge); adversarial **triggered**
(false parallelism); failure/recovery `n/a`; change/regression `n/a`; counterfactual `n/a`.
**Cases:**
- **SOP-DAG-CASE-01 (Positive / Good; coverage-role {positive}).** Given the `requires:` fields.
  When a topological sort is run over them. Then the sort is defined (no cycle) and reproduces the
  documented task order. *Failure oracle:* a documented order that a topological sort cannot
  reproduce. *Observable discrimination:* a correct graph sorts to the stated order; a broken one
  contradicts it. *Evidence tuple:* (build the graph from `requires:` / topological sort / the sort
  equals the documented order). *Design obligation:* the plan MUST derive order from the dependency
  graph, not from list position.
- **SOP-DAG-CASE-02 (Boundary; coverage-role {boundary}).** Given the `requires:` edges. When the
  graph is checked for a cycle at the exact point two tasks require each other. Then any cycle is
  rejected as having no valid start order. *Failure oracle:* a cycle (direct or transitive) in
  `requires:`. *Observable discrimination:* the check sits at the exact edge where the graph stops
  being acyclic. *Evidence tuple:* (cycle-detect the graph / a detected back-edge / a cycle is the
  failure). *Design obligation:* the plan MUST reject a dependency cycle before execution.
- **SOP-DAG-CASE-03 (Adversarial; coverage-role {adversarial}).** Given two tasks in different lanes
  that touch the same file. When the lanes are called parallel-safe without comparing file-touch
  sets. Then a conflicting shared mutation runs in parallel. *Failure oracle:* two parallel-marked
  tasks whose `files:` sets intersect. *Observable discrimination:* the reader intersects the
  file-touch sets rather than trusting the parallel label. *Evidence tuple:* (intersect the lanes'
  `files:` / a non-empty intersection / the overlap is the false parallelism). *Design obligation:*
  the plan MUST prove a lane free of dependency paths and shared mutation before calling it
  parallel.
**Checklist IDs:** `SOP-DAG-CHECK-*`

### SOP-CONTRACT — every package has a complete contract and a pre-anchored objective acceptance
**Primary category:** 10 `Evidence / traceability / clarity` — the defining discrimination is
whether each package's acceptance is provable by named evidence. **Secondary tags:** 4 (contract
completeness). **Primary perspective:** Consistency. **Secondary perspective:** Aesthetics.
**Source:** SOP § Rules (complete package contract; acceptance as an observable pass/fail claim with
deciding evidence named before execution) + SOP § Procedure P4.
**Situation / actor / outcome:** the leader writes each task's contract; the outcome is every
package carrying its full field set and an acceptance condition stated as a binary claim with its
deciding evidence named before execution.
**Triggered minimums:** adversarial **triggered** (a gameable acceptance gate); boundary `n/a`;
failure/recovery `n/a`; change/regression `n/a`; counterfactual `n/a: no premise inversion distinct
from the cosmetic-gaming adversarial probe`.
**Cases:**
- **SOP-CONTRACT-CASE-01 (Positive / Good; coverage-role {positive}).** Given a task. When its
  acceptance condition is read. Then it is a binary pass/fail claim naming its deciding evidence and
  method before execution. *Failure oracle:* an acceptance criterion that needs interpretation to
  call pass/fail. *Observable discrimination:* a good acceptance can only pass one way; a vague one
  ("works", "tests pass") can be declared passed by anyone. *Evidence tuple:* (read the acceptance /
  test whether it admits a single yes/no / an interpretation-free claim confirms it). *Design
  obligation:* each package MUST state acceptance as an observable pass/fail claim with pre-named
  evidence.
- **SOP-CONTRACT-CASE-02 (Adversarial; coverage-role {adversarial}).** Given a plan whose gates read
  as strict. When a cosmetically-conformant plan supplies vague or placeholder acceptance ("run the
  tests", `<path>`). Then it satisfies the gate's words without its intent. *Failure oracle:* an
  acceptance line that a plan can satisfy by relabeling, or a placeholder token in a runnable gate.
  *Observable discrimination:* the reader tries to pass the gate cosmetically; a real gate resists,
  a decorative one yields. *Evidence tuple:* (attempt a cosmetic pass / inspect for a placeholder or
  relabel / a cosmetic pass is the gap). *Design obligation:* the plan MUST make a cosmetically
  conformant draft fail its acceptance gates.
**Checklist IDs:** `SOP-CONTRACT-CHECK-*`

### SOP-FORECAST — the plan is a forecast with observable signposts, named responses, and honest estimates
**Primary category:** 6 `Failure / recovery / operations` — the defining discrimination is whether
re-planning is controlled by observable triggers. **Secondary tags:** 5 (estimate economics).
**Primary perspective:** Risk.
**Source:** SOP § Rules (a plan is a forecast; pair every assumption with a signpost and a named
response; estimate from reference classes) + SOP § Procedure P6–P7.
**Situation / actor / outcome:** the leader records the elaboration horizon and the load-bearing
assumptions; the outcome is each assumption paired with an observable signpost and a named
continue / revise / stop / escalate response, and each estimate grounded in a reference class or
marked low-confidence.
**Triggered minimums:** counterfactual **triggered** (every load-bearing assumption); adversarial
**triggered** (a judgment-only trigger); boundary `n/a`; failure/recovery **triggered** (re-plan as
the recovery path); change/regression `n/a`.
**Cases:**
- **SOP-FORECAST-CASE-01 (Positive / Good; coverage-role {positive, failure/recovery}).** Given a
  load-bearing assumption. When its trigger is read. Then it names an observable signpost and a
  continue / revise / stop / escalate response. *Failure oracle:* an assumption with no observable
  signpost. *Observable discrimination:* a controlled forecast changes at explicit triggers; an
  uncontrolled one drifts. *Evidence tuple:* (read each assumption / check for a signpost + response
  / a named observable trigger confirms it). *Design obligation:* each load-bearing assumption MUST
  carry an observable signpost and a named response.
- **SOP-FORECAST-CASE-02 (Adversarial; coverage-role {adversarial}).** Given the re-plan triggers.
  When one is written as "re-plan if needed" or another judgment-only trigger dressed up as control.
  Then re-planning is uncontrollable because the trigger is not observable. *Failure oracle:* a
  trigger with no named signpost / threshold. *Observable discrimination:* the reader tries to fire
  the trigger from an observation — a judgment-only trigger has no observable to fire on. *Evidence
  tuple:* (grep for judgment-only trigger phrasings / check each for a threshold / a bare "if needed"
  is the defect). *Design obligation:* the plan MUST NOT rely on a judgment-only re-plan trigger.
- **SOP-FORECAST-CASE-03 (Counterfactual; coverage-role {counterfactual}).** Given a load-bearing
  assumption the plan depends on. When the assumption is inverted (assume it is false). Then the plan
  names a disconfirmation response — a signpost that would reveal the assumption is wrong and the
  re-plan action to take. *Failure oracle:* a load-bearing assumption with no named disconfirmation
  response. *Observable discrimination:* invert each premise and check for a named response; a plan
  that assumes-and-forgets has none. *Evidence tuple:* (list load-bearing assumptions / invert each /
  a missing disconfirmation response is the defect). *Design obligation:* every load-bearing
  assumption MUST carry a named disconfirmation response for the case it is wrong.
**Checklist IDs:** `SOP-FORECAST-CHECK-*`

### SOP-REVERSIBILITY — rollback boundaries are clear and high-blast changes are isolated
**Primary category:** 6 `Failure / recovery / operations` — the defining discrimination is whether a
failed or paused plan leaves a coherent state. **Secondary tags:** 9 (planned change events).
**Primary perspective:** Risk. **Secondary perspective:** Structure.
**Source:** SOP § Rules (a work package is completable and verifiable as one unit) + WF § Operating
principles (stay in scope); the D7 reversibility contract.
**Situation / actor / outcome:** the plan may fail a task mid-run or pause between tasks; the
outcome is each task independently revertible, every inter-task pause a coherent intermediate
state, and each high-blast change (migration / dependency upgrade / public-interface change) an
isolated task with a go/no-go step.
**Triggered minimums:** boundary **triggered** (the stop-after-task-N snapshot); failure/recovery
**triggered** (revert on failure, exercised by the positive discrimination in CASE-01); adversarial
**triggered** (a high-blast change bundled with ordinary work); change/regression `n/a: high-blast
change isolation is exercised by the adversarial case, with no separate before/after version
comparison`; counterfactual `n/a`.
**Cases:**
- **SOP-REVERSIBILITY-CASE-01 (Positive / Good; coverage-role {positive}).** Given the task
  sequence. When a failure is injected between two tasks. Then the project is left in a coherent,
  revertible state (an atomic commit per task or a concrete `rollback:` step). *Failure oracle:* a
  failed task that cannot be reverted without unwinding unrelated work. *Observable discrimination:*
  a well-bounded plan reverts one task cleanly; a coupled one drags in siblings. *Evidence tuple:*
  (read the commit boundary per task / test a single-task revert / a clean independent revert
  confirms it). *Design obligation:* each task MUST be independently revertible.
- **SOP-REVERSIBILITY-CASE-02 (Boundary; coverage-role {boundary}).** Given the plan paused at the
  exact stop-after-task-N snapshot. When the intermediate state is inspected at that precise
  inter-task boundary. Then it is a valid, coherent state. *Failure oracle:* a stop-after-N snapshot
  that is not a valid state. *Observable discrimination:* the check sits at the exact inter-task
  boundary (after task N, before task N+1), not merely near it. *Evidence tuple:* (enumerate each
  inter-task snapshot / test validity at each boundary / an incoherent snapshot is the defect).
  *Design obligation:* every inter-task pause MUST leave a coherent, recoverable state.
- **SOP-REVERSIBILITY-CASE-03 (Adversarial; coverage-role {adversarial}).** Given a high-blast task
  (migration / dependency upgrade / public-interface change). When it is bundled with ordinary work
  and carries no go/no-go gate. Then a large blast radius rides in unguarded. *Failure oracle:* a
  high-blast change sharing a task with unrelated ordinary work. *Observable discrimination:* the
  reader isolates the high-blast change; a good plan already isolated it with a gate. *Evidence
  tuple:* (scan tasks for a high-blast change bundled with other work / check for a go/no-go step / a
  bundled ungated change is the risk). *Design obligation:* the plan MUST isolate each high-blast
  change into its own task with an explicit go/no-go step.
**Checklist IDs:** `SOP-REVERSIBILITY-CHECK-*`

### SOP-PERF — perf-sensitive work is isolated with measurement, and plan-time cost is bounded
**Primary category:** 5 `Quality attributes / resource economics` — the defining discrimination is a
latency / capacity / cost bound. **Secondary tags:** 6 (external-call failure handling). **Primary
perspective:** Performance. **Secondary perspective:** Risk.
**Source:** SOP § Rules (ground estimates in comparable work) + the evaluation Coverage Ownership
Matrix (Cost / Error-budget).
**Situation / actor / outcome:** some tasks touch Ideation performance budgets or introduce
external calls; the outcome is perf-sensitive changes isolated with measurement-based `verifies:`,
external-call tasks naming batching / caching / failure handling, and plan-time cost bounded.
**Triggered minimums:** adversarial **triggered** (hidden per-item external call); boundary `n/a`;
failure/recovery **triggered** (slow / failed external call); change/regression `n/a`;
counterfactual `n/a`.
**Cases:**
- **SOP-PERF-CASE-01 (Positive / Good; coverage-role {positive, failure/recovery}).** Given a task
  touching an Ideation perf budget. When its `verifies:` is read. Then it carries an explicit
  measurement step, is isolated from non-perf work, and (for an external call) names batching /
  caching and its slow-or-failed behaviour with any inherited default cited. *Failure oracle:* a
  perf budget with no measurement step in any task's `verifies:`. *Observable discrimination:* a
  measured plan can fail a budget; an unmeasured one leaves the budget as fiction. *Evidence tuple:*
  (map each Ideation budget to a task's `verifies:` / check for a measurement step / an unmeasured
  budget is the gap). *Design obligation:* every Ideation perf budget MUST have a measurement step in
  some task's acceptance.
- **SOP-PERF-CASE-02 (Adversarial; coverage-role {adversarial}).** Given twenty tasks each running a
  paid evaluation during verification. When no per-task or plan-total cost ceiling is stated. Then
  cost multiplies twenty-fold on a path no single task flagged. *Failure oracle:* a plan-total cost
  with no ceiling where multiple tasks each issue a paid call. *Observable discrimination:* the
  reader sums the plan-wide call count rather than judging each task in isolation. *Evidence tuple:*
  (count tasks issuing paid calls / multiply by per-task cost / an unbounded product is the risk).
  *Design obligation:* the plan MUST bound cumulative cost, not only per-task cost.
**Checklist IDs:** `SOP-PERF-CHECK-*`

### SOP-CLARITY — the plan document is readable, placeholder-free, and scannable
**Primary category:** 10 `Evidence / traceability / clarity` — the defining discrimination is
whether a cold reader can follow the plan. **Secondary tags:** 8 (accessibility of the document
structure). **Primary perspective:** Consistency. **Secondary perspectives:** Aesthetics, Usage.
**Source:** WF § required-sections template + SOP § Procedure P8 self-review + the evaluation
Coverage Ownership Matrix (Accessibility).
**Situation / actor / outcome:** the leader writes the draft to the required-sections template; the
outcome is imperative task titles, no duplicate IDs, template-conformant headings, a uniform field
schema, zero placeholders, and a heading structure a fresh executor can skim.
**Triggered minimums:** adversarial **triggered** (an effectively-empty task that looks complete);
boundary `n/a`; failure/recovery `n/a`; change/regression `n/a`; counterfactual `n/a`.
**Cases:**
- **SOP-CLARITY-CASE-01 (Positive / Good; coverage-role {positive}).** Given the draft. When its
  titles, IDs, headings, and fields are read. Then titles are imperative and specific, IDs are
  unique, headings match the template, the field set is uniform across tasks, and the structure is
  skimmable. *Failure oracle:* a `TBD` / `TODO` / `???` in any field, a duplicate task ID, or a
  divergent field schema. *Observable discrimination:* a clean document reads top-to-bottom; a
  drifting one forces a re-scan. *Evidence tuple:* (grep placeholder strings + diff field names
  across tasks / mechanical scan / a placeholder or schema drift is the defect). *Design
  obligation:* the plan document MUST be placeholder-free with a uniform, template-conformant
  structure.
- **SOP-CLARITY-CASE-02 (Adversarial; coverage-role {adversarial}).** Given a plan that looks
  complete. When a task turns out to be only a "(see Ideation)" cross-reference with no `outputs:` /
  `verifies:`. Then an effectively-empty task passes as real. *Failure oracle:* a task whose body is
  a bare cross-reference with empty `outputs:` / `verifies:`. *Observable discrimination:* the reader
  opens each task rather than trusting the count; an empty one has no content. *Evidence tuple:*
  (read each task's `outputs:` / `verifies:` / flag any empty pair / an empty task is the defect).
  *Design obligation:* the plan MUST NOT carry an effectively-empty task behind a full-looking list.
**Checklist IDs:** `SOP-CLARITY-CHECK-*`

---

## WF-* — gobbi workflow-compliance families

### WF-TRACE — every task anchors to Ideation and the plan stays inside the Scope Contract
**Primary category:** 1 `Purpose / outcomes / scope` — the defining discrimination is whether each
task is authorized by the locked idea. **Secondary tags:** 10 (trace resolvability). **Primary
perspective:** Project.
**Source:** WF § Operating principles (anchor every task; stay in scope) + WF
[§ USER CHALLENGE](../orchestration/workflow/planning.md#user-challenge).
**Situation / actor / outcome:** the leader anchors each task to an Ideation scenario / checklist
item; the outcome is every task carrying a resolving `traces-to:` and no task introducing a
requirement absent from Ideation.
**Triggered minimums:** adversarial **triggered** (scope creep through a task spec); boundary `n/a`;
failure/recovery `n/a`; change/regression `n/a`; counterfactual `n/a`.
**Cases:**
- **WF-TRACE-CASE-01 (Positive / Good; coverage-role {positive}).** Given the task list. When each
  `traces-to:` is grepped against the Ideation artifact. Then every reference resolves to an item
  that exists verbatim and no task is anchorless. *Failure oracle:* a task with no `traces-to:`, or a
  `traces-to:` with no matching Ideation item. *Observable discrimination:* an anchored plan resolves
  every trace; a drifting one leaves a dangling or missing anchor. *Evidence tuple:* (grep each
  `traces-to:` against Ideation / exact-match check / a non-resolving trace is the defect). *Design
  obligation:* every task MUST anchor to a resolving Ideation item.
- **WF-TRACE-CASE-02 (Adversarial; coverage-role {adversarial}).** Given the Scope Contract. When a
  task introduces a requirement not present in Ideation through its own spec. Then scope expands
  without a user decision. *Failure oracle:* a task requirement with no Scope-Contract or Ideation
  source. *Observable discrimination:* the reader checks each task requirement against the contract;
  a smuggled one has no source. *Evidence tuple:* (diff task requirements vs Scope Contract / find
  the unsourced requirement / an unsourced requirement is the creep). *Design obligation:* the plan
  MUST NOT expand scope through a task spec; out-of-scope items route to backlog.
**Checklist IDs:** `WF-TRACE-CHECK-*`

### WF-SCHEMA — every task is the canonical YAML record and states what, not how
**Primary category:** 4 `Interfaces / dependencies / structure` — the defining discrimination is
the task record's contract shape. **Secondary tags:** 10 (schema uniformity). **Primary
perspective:** Structure.
**Source:** WF § Operating principles (the plan tells specialists what, not how; every task is
`{id, what, traces-to, requires, files, inputs, outputs, verifies}`).
**Situation / actor / outcome:** the leader records each task in the canonical schema; the outcome
is every task carrying the full field set with no embedded implementation code or step-by-step
recipe.
**Triggered minimums:** adversarial **triggered** (a task prescribes the diff); boundary `n/a`;
failure/recovery `n/a`; change/regression `n/a`; counterfactual `n/a`.
**Cases:**
- **WF-SCHEMA-CASE-01 (Positive / Good; coverage-role {positive}).** Given a task record. When its
  fields are read. Then it carries `{id, what, traces-to, requires, files, inputs, outputs,
  verifies}` and describes what to achieve, not how to code it. *Failure oracle:* a missing schema
  field, or embedded implementation code. *Observable discrimination:* a schema-conformant task
  leaves the how to the executor; a leaky one prescribes it. *Evidence tuple:* (check each task's
  field set / scan `what:` for embedded code / a missing field or embedded recipe is the defect).
  *Design obligation:* every task MUST be the canonical schema record without an embedded recipe.
- **WF-SCHEMA-CASE-02 (Adversarial; coverage-role {adversarial}).** Given a task. When its `what:`
  embeds the exact diff or a step-by-step command recipe. Then it robs the executor of judgment
  (imperative-over-declarative). *Failure oracle:* a `what:` field containing a literal diff or a
  numbered command recipe. *Observable discrimination:* the reader distinguishes a stated goal from a
  prescribed mechanism. *Evidence tuple:* (read `what:` for prescribed mechanism / judge
  goal-vs-recipe / an embedded recipe is the defect). *Design obligation:* the plan MUST state the
  verifiable goal, not the mechanism.
**Checklist IDs:** `WF-SCHEMA-CHECK-*`

### WF-ASSIGN — agent type, skills, and required mistakes fit the work and are justified
**Primary category:** 2 `Actors / stakeholders / use-context` — the defining discrimination is who
executes and with what loaded context. **Secondary tags:** 4 (capability structure). **Primary
perspective:** Usage. **Secondary perspective:** Project.
**Source:** WF [§ Agent assignment sub-step](../orchestration/workflow/planning.md#discussion-phase)
+ WF § Constraints (list required skills and required mistakes; justify any non-default).
**Situation / actor / outcome:** the leader assigns each task an agent type, required skills, and
required mistakes; the outcome is each assignment justified, `principles` always present, and the
skill / mistake set matching the files the task touches.
**Triggered minimums:** adversarial **triggered** (an under-capacity agent for a large task);
boundary `n/a`; failure/recovery `n/a`; change/regression `n/a`; counterfactual `n/a`.
**Cases:**
- **WF-ASSIGN-CASE-01 (Positive / Good; coverage-role {positive}).** Given a task. When its agent
  assignment is read. Then the agent type is justified by the work's nature, `principles` plus the
  domain skills for the files touched are listed, and the domain-filtered required mistakes are
  named. *Failure oracle:* a non-default agent type with no justification, or a task touching a
  domain whose skill / mistakes are unlisted. *Observable discrimination:* a fitted assignment names
  why; a mismatched one is asserted. *Evidence tuple:* (read each assignment vs the files touched /
  check the skill / mistake list / a missing skill or unjustified type is the defect). *Design
  obligation:* every task MUST carry a justified agent type with the required skills and mistakes for
  its domain.
- **WF-ASSIGN-CASE-02 (Adversarial; coverage-role {adversarial}).** Given a very large task. When it
  is assigned to a smaller-tier agent whose context window or tool surface cannot hold the work.
  Then the assignment reads plausible but the agent cannot complete it. *Failure oracle:* an
  artifact-size or tool need exceeding the assigned agent's budget. *Observable discrimination:* the
  reader sizes the work against the agent's budget rather than trusting the label. *Evidence tuple:*
  (compare task size to the agent's context / tool surface / an over-budget assignment is the
  defect). *Design obligation:* the plan MUST match each agent's capability to its task's size and
  tool needs.
**Checklist IDs:** `WF-ASSIGN-CHECK-*`

### WF-FRESH-EXEC — a fresh executor can run any task from the task alone
**Primary category:** 2 `Actors / stakeholders / use-context` — the defining discrimination is the
fresh-executor use-context. **Secondary tags:** 10 (self-contained clarity). **Primary
perspective:** Usage.
**Source:** WF § WORK discipline (anchor everything; each task self-contained) + WF § Operating
principles (no `Similar to Task N`).
**Situation / actor / outcome:** each task is spawned to a fresh subagent whose only context is its
own `inputs:` / `outputs:` / `verifies:`; the outcome is every task executable without the parent
session, with concrete runnable verification and no surprise prerequisite.
**Triggered minimums:** adversarial **triggered** (a placeholder verification / a surprise
dependency); boundary `n/a`; failure/recovery `n/a`; change/regression `n/a`; counterfactual `n/a`.
**Cases:**
- **WF-FRESH-EXEC-CASE-01 (Positive / Good; coverage-role {positive}).** Given one task in
  isolation. When it is read as a fresh executor would. Then its file paths, `inputs:`, `outputs:`,
  and runnable `verifies:` are enough to execute it, and every prerequisite is named in `requires:`
  or `inputs:`. *Failure oracle:* a task that cannot be executed from its own spec. *Observable
  discrimination:* a self-contained task runs alone; a dependent one stalls without parent context.
  *Evidence tuple:* (read one task in isolation / attempt to derive the full action / a missing
  input is the gap). *Design obligation:* every task MUST be executable from its own spec alone.
- **WF-FRESH-EXEC-CASE-02 (Adversarial; coverage-role {adversarial}).** Given a task with a
  verification command. When the command is a placeholder ("run the tests", `<your test path>`) or
  the task has a prerequisite named in neither `requires:` nor `inputs:`. Then a fresh executor
  cannot run it as-is or discovers the dependency only at runtime. *Failure oracle:* a non-runnable
  `verifies:` token, or a prerequisite absent from `requires:`/`inputs:`. *Observable
  discrimination:* the reader tries to run the gate verbatim and to trace every dependency; a
  placeholder or a surprise dependency breaks it. *Evidence tuple:* (attempt the `verifies:` as-is +
  trace dependencies / find the placeholder or unnamed prerequisite / either is the defect). *Design
  obligation:* the plan MUST NOT leave a placeholder verification or an unnamed prerequisite.
**Checklist IDs:** `WF-FRESH-EXEC-CHECK-*`

### WF-GOVERNANCE — authority, cross-task governance, and no test-writing task
**Primary category:** 7 `Trust / harm / governance` — the defining discrimination is authority and
cross-task governance of cost / privacy / dependencies. **Secondary tags:** 5 (cost), 6
(observability). **Primary perspective:** Risk. **Secondary perspective:** Consistency.
**Source:** WF [§ USER CHALLENGE](../orchestration/workflow/planning.md#user-challenge) + WF
§ Constraints (no test-writing task; disagree when you disagree) + the evaluation Coverage
Ownership Matrix (Privacy / Licensing / Supply-chain / Observability / Cost).
**Situation / actor / outcome:** the plan spans many tasks that may each carry cost, sensitive
data, or new dependencies, and the leader may disagree with the user's Ideation direction; the
outcome is USER CHALLENGE used for substantive disagreement, no task that authors tests, and the
cross-cutting governance concerns carried across the decomposition.
**Triggered minimums:** adversarial **triggered** (a compromise silently planned instead of
escalated); counterfactual `n/a`; boundary `n/a`; failure/recovery `n/a`; change/regression `n/a`.
**Cases:**
- **WF-GOVERNANCE-CASE-01 (Positive / Good; coverage-role {positive}).** Given the plan. When its
  governance surfaces are read. Then a substantive disagreement with the user's direction is raised
  through the USER CHALLENGE card (not silently compromised); no task authors tests; PII / data-flow
  boundaries and license / dependency surfaces are labelled and manifest changes sequenced first;
  and the plan is observable mid-execution. *Failure oracle:* a PII-touching or new-dependency task
  with no label, or a task that authors a test framework. *Observable discrimination:* a governed
  plan carries each label and escalates disagreement; an ungoverned one omits them. *Evidence tuple:*
  (scan tasks for PII / dependency / test-authoring / check labels and the challenge log / a missing
  label or a test task is the defect). *Design obligation:* the plan MUST carry the cross-task
  governance labels and MUST NOT slice a test-writing task.
- **WF-GOVERNANCE-CASE-02 (Adversarial; coverage-role {adversarial}).** Given a leader whose
  analysis contradicts the user's stated Ideation direction. When the leader silently plans a
  compromise instead of escalating. Then a substantive disagreement is buried. *Failure oracle:* a
  plan decision that departs from the locked user direction with no USER CHALLENGE record.
  *Observable discrimination:* the reader diffs the plan's direction against the locked Ideation
  direction; a silent compromise has no challenge record. *Evidence tuple:* (diff plan direction vs
  locked direction / check the discussion log for a challenge / a silent departure is the defect).
  *Design obligation:* the plan MUST escalate a substantive disagreement through USER CHALLENGE, not
  bury it in a compromise.
**Checklist IDs:** `WF-GOVERNANCE-CHECK-*`

---

## SEAM-* — SOP↔WF boundary families

### SEAM-TRACES — one gobbi `traces-to` per package realizes the generic anchor obligation
**Primary category:** 10 `Evidence / traceability / clarity` — the defining discrimination is
whether the generic "anchor every package" obligation is realized by the gobbi `traces-to:` field.
**Secondary tags:** 1 (scope), 3 (the trace as data). **Primary perspective:** Consistency.
**Secondary perspective:** Aesthetics.
**Source:** SOP § Rules (every package traces to an approved outcome) ↔ WF § Operating principles
(anchor every task); D3 seam minimum (one gobbi `traces-to` per package).
**Situation / actor / outcome:** the generic craft says anchor every package; gobbi realizes it as
the `traces-to:` field; the outcome is exactly one resolving `traces-to:` per package, with dangling
traces detected.
**Triggered minimums:** adversarial **triggered** (a dangling trace passes as an anchor); boundary
`n/a`; failure/recovery `n/a`; change/regression `n/a`; counterfactual `n/a`.
**Cases:**
- **SEAM-TRACES-CASE-01 (Positive / Good; coverage-role {positive}).** Given a package. When its
  generic anchor obligation is mapped to the gobbi schema. Then it is realized by exactly one
  resolving `traces-to:` field. *Failure oracle:* a package whose generic anchor has no `traces-to:`
  realization. *Observable discrimination:* a consistent seam maps every generic anchor to a schema
  field; a broken one leaves the obligation unrepresented. *Evidence tuple:* (map generic
  anchor-obligation to `traces-to:` / check one-to-one / an unrealized anchor is the gap). *Design
  obligation:* every package's generic anchor MUST be realized by exactly one gobbi `traces-to:`.
- **SEAM-TRACES-CASE-02 (Adversarial; coverage-role {adversarial}).** Given a `traces-to:` present
  in the schema. When it references an Ideation item that does not exist. Then a dangling trace
  passes as a satisfied anchor. *Failure oracle:* a `traces-to:` with no matching Ideation item.
  *Observable discrimination:* the reader resolves the trace rather than counting its presence.
  *Evidence tuple:* (grep `traces-to:` against Ideation / resolution check / a dangling trace is the
  defect). *Design obligation:* the seam MUST detect a dangling `traces-to:`, not accept its mere
  presence.
**Checklist IDs:** `SEAM-TRACES-CHECK-*`

### SEAM-SCHEMA-FIT — every generic contract field is representable in the task schema, and hand-offs match
**Primary category:** 4 `Interfaces / dependencies / structure` — the defining discrimination is
whether the generic contract fields fit the gobbi task schema without loss. **Secondary tags:** 3
(hand-off data), 10 (representation clarity). **Primary perspective:** Structure. **Secondary
perspective:** Consistency.
**Source:** SOP § Rules (complete package contract; `requires:` graph; outputs match downstream
inputs) ↔ WF § Tasks schema; D3 seam minimum (every generic field representable in the task schema;
`requires:` edges match the rendered DAG).
**Situation / actor / outcome:** the generic contract fields (outcome / boundary / inputs / outputs
/ assumptions / acceptance / evidence / estimate) must each map onto the gobbi schema (`what` /
`files` / `inputs` / `outputs` / `verifies` / `requires` / `traces-to`); the outcome is no generic
field silently dropped, `requires:` edges matching the rendered dependency table, and `outputs:` →
`inputs:` name-matching across hand-offs.
**Triggered minimums:** adversarial **triggered** (a silent field rename across a hand-off);
boundary `n/a`; failure/recovery `n/a`; change/regression `n/a: the rename is exercised as the
adversarial probe, with no separate before/after version case`; counterfactual `n/a`.
**Cases:**
- **SEAM-SCHEMA-FIT-CASE-01 (Positive / Good; coverage-role {positive}).** Given the generic
  contract fields and the gobbi task schema. When each generic field is mapped to a schema field.
  Then every generic field has a schema home, the `requires:` edges reproduce the dependency table,
  and each task's `outputs:` literally name-match the consuming task's `inputs:`. *Failure oracle:* a
  generic contract field (for example the estimate or the assumptions) with no schema home. *Observable
  discrimination:* a fitted seam represents every field; a lossy one drops one. *Evidence tuple:*
  (map generic fields to schema fields + diff `requires:` vs the dependency table / check coverage
  and name-match / a dropped field or a mismatched edge is the defect). *Design obligation:* every
  generic contract field MUST be representable in the task schema, and `requires:` MUST match the
  rendered DAG.
- **SEAM-SCHEMA-FIT-CASE-02 (Adversarial; coverage-role {adversarial}).**
  Given a hand-off where task N outputs `schema`. When task N+1 inputs `migrated-schema` under a
  silent rename. Then the match cannot be verified mechanically. *Failure oracle:* an `outputs:`
  name with no literal `inputs:` match downstream. *Observable discrimination:* the reader compares
  the literal field names before and after the rename; a paraphrase breaks the match. *Evidence
  tuple:* (diff `outputs:` vs downstream `inputs:` / literal name comparison / a paraphrased hand-off
  is the defect). *Design obligation:* the seam MUST force a literal `outputs:` → `inputs:`
  name-match across every hand-off.
**Checklist IDs:** `SEAM-SCHEMA-FIT-CHECK-*`

### SEAM-TRIGGER-MAP — assumption signposts map to the gobbi re-plan responses
**Primary category:** 6 `Failure / recovery / operations` — the defining discrimination is whether
the generic signpost responses map onto the gobbi re-plan machinery. **Secondary tags:** 9
(re-entry as a lifecycle change). **Primary perspective:** Risk. **Secondary perspective:**
Consistency.
**Source:** SOP § Rules (pair every assumption with a signpost and a named response) ↔ WF
[§ USER CHALLENGE](../orchestration/workflow/planning.md#user-challenge) and the ITER/EXIT
responses; D3 seam minimum (assumption / signpost triggers map to REVISE / USER-CHALLENGE /
re-entry).
**Situation / actor / outcome:** the generic craft says each assumption carries a
continue / revise / stop / escalate response; gobbi realizes those as REVISE / USER CHALLENGE /
re-enter-Ideation; the outcome is every load-bearing assumption's signpost routed to a concrete
gobbi response.
**Triggered minimums:** adversarial **triggered** (a signpost with no gobbi response route);
failure/recovery **triggered** (re-plan as recovery, exercised by the positive discrimination in
CASE-01); boundary `n/a`; change/regression `n/a`; counterfactual `n/a: assumption inversion is
owned by SOP-FORECAST; this seam family judges the signpost→response mapping, not the assumption`.
**Cases:**
- **SEAM-TRIGGER-MAP-CASE-01 (Positive / Good; coverage-role {positive, failure/recovery}).** Given
  a load-bearing assumption with an observable signpost. When its response is mapped to the gobbi
  machinery. Then the signpost routes to a concrete REVISE, USER CHALLENGE, or re-enter-Ideation
  response. *Failure oracle:* a signpost with a generic response but no gobbi route. *Observable
  discrimination:* a mapped seam names the gobbi response; an unmapped one leaves the generic
  response abstract. *Evidence tuple:* (map each signpost's generic response to a gobbi response /
  check for a concrete route / an unrouted signpost is the gap). *Design obligation:* every
  assumption signpost MUST map to a concrete gobbi re-plan response.
- **SEAM-TRIGGER-MAP-CASE-02 (Adversarial; coverage-role {adversarial}).** Given the assumption
  triggers. When one carries an observable signpost but no gobbi response route. Then a tripped
  signpost has no defined effect. *Failure oracle:* a signpost present with no REVISE / USER-CHALLENGE
  / re-entry mapping. *Observable discrimination:* the reader walks each signpost to its gobbi route;
  an unrouted signpost dead-ends. *Evidence tuple:* (enumerate signposts / check each for a gobbi
  route / an unrouted signpost is the defect). *Design obligation:* the seam MUST NOT leave a
  signpost without a gobbi response route.
**Checklist IDs:** `SEAM-TRIGGER-MAP-CHECK-*`

---

## Traceability and gaps

### Source → set omission sweep (SR-14)

Every load-bearing source obligation maps to ≥1 family; the reverse sweep confirms no family lacks a
source. No uncovered obligation remains open.

| Source obligation | Family |
|---|---|
| SOP: coverage without gaps or double ownership | SOP-COVERAGE |
| SOP: slice by observable outcome; work-package stop rule | SOP-SLICE |
| SOP: dependencies determine order; genuine parallel lanes | SOP-DAG |
| SOP: complete contract; pre-anchored objective acceptance | SOP-CONTRACT |
| SOP: a plan is a forecast; signpost + named response; reference-class estimate | SOP-FORECAST |
| SOP: package completable/verifiable as one unit (rollback) + D7 reversibility | SOP-REVERSIBILITY |
| SOP: reference-class estimate economics + Coverage Matrix (Cost / Error-budget) | SOP-PERF |
| SOP P8 self-review + WF template + Coverage Matrix (Accessibility) | SOP-CLARITY |
| WF: anchor every task; stay in scope | WF-TRACE |
| WF: canonical task schema; what-not-how | WF-SCHEMA |
| WF: agent assignment; required skills + required mistakes | WF-ASSIGN |
| WF: task self-contained for a fresh executor | WF-FRESH-EXEC |
| WF: USER CHALLENGE; no test-writing task + Coverage Matrix (Privacy / Licensing / Supply-chain / Observability) | WF-GOVERNANCE |
| D3 seam: one gobbi `traces-to` per package | SEAM-TRACES |
| D3 seam: every generic field representable in the schema; `requires:` matches the DAG | SEAM-SCHEMA-FIT |
| D3 seam: assumption signposts map to REVISE / USER-CHALLENGE / re-entry | SEAM-TRIGGER-MAP |

Every family traces forward to ≥1 design obligation (each case names its obligation) and back to a
source; the scenario→obligation and source→scenario links are orphan-swept both ways.

### Coverage gaps and decisions

- **i18n** — declared `not-applicable`: the plan is an internal English working document for a
  single solo user; there is no locale, sort-order, or input-method variation to serve.
- **Error budget** — covered by SOP-PERF only where a task touches a runtime SLO path;
  `not-applicable` for pure-doc tasks with no runtime path.
- No exploratory scenarios: every family traces to an approved obligation.
