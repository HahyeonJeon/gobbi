# Planning Loop — Evaluation Checklist

Evidence-anchored coverage register for evaluating a **Planning working draft**. It conforms to the
in-tree Checklist SOP — see [the Checklist SOP § Rules](../checklist/SKILL.md#rules) for the modes,
the five item dimensions, the closed resolution state machine, and the two-gate acceptance rule.
The scenario families and their cases live 1:1 in the sibling `scenario.md`; the per-perspective
procedure lives in `evaluation.md`. The heading tree below (SOP / WF / SEAM groups and their
families) is 1:1 with `scenario.md`.

**Mode:** evaluation coverage register — gate and required items only, no advisory item. Every row
closes to exactly one of `PASS`, `FAIL:<finding-id>`, or `n/a:<property>`.

> **Copy-then-tick — this file is the source; the evaluator copies it.** At Stage 0 the evaluator
> COPIES this file to `sessions/{date}-{session-id}/3-planning/evaluation/iter{n}/{system}/checklist.md`.
> The filled copy is a real **9th evaluation-output file**, alongside the seven per-perspective
> files + `overall.md`. The source here ships with every box UNCHECKED.
>
> **A ticked box = VERIFIED, not "done".** `[x]` means the evaluator inspected the named evidence
> against the Planning draft with the strongest verification the check admits (close-read the task
> list / diff the Ideation checklist against the task list / `grep` a `traces-to:` against the
> Ideation artifact / compare `inputs:`/`outputs:` across hand-offs) — never that work merely
> happened, an owner was assigned, or a label matched.
>
> **Fill procedure.** Stage 0: copy (boxes unchecked). Stage 1: append a `## Stage 1 Additions`
> section for any scenario or check the Frame added that is not seeded here. Stage 2: tick each box
> and annotate its resolution — `PASS:` (verified satisfied), `FAIL:<finding-id>` (verified
> violated, cite the finding), or `n/a:<property>` (the applicability predicate is false, name the
> property). The coverage-closure gate requires every applicable box resolved to exactly one of the
> three.
>
> **Run-level use-style:** `do-confirm` (the whole register is read back to confirm work; an
> evaluation register has no runtime pause points, so it declares one run-level use-style).
> **Applicability default:** unconditional, unless a check declares `applies-if:` or resolves
> `n/a:<property>`.

**Legend.** `- [ ]` unresolved (non-terminal) · `- [x] … PASS:` verified satisfied ·
`- [x] … FAIL:<finding-id>` verified violated · `- [x] … n/a:<property>` applicability predicate
false. Record per-perspective counts (PASS / FAIL / n/a / total) in the filled copy.

**Two gates — coverage-closure vs acceptance.** These are separate outcomes.

- **Coverage-closure** — every applicable gate and required item has reached a terminal resolution
  (`PASS` / `FAIL:<finding-id>` / `n/a:<property>`). A `FAIL` closes coverage; it does not accept.
- **Acceptance** — a single positive condition: **every applicable gate and required item resolves
  `PASS`**. A `FAIL:<finding-id>` or an `n/a:<property>` is coverage-closed but NOT accepted.
  Ownership, a filed finding, or a pointer closes coverage, never acceptance — coverage-closure is
  computed separately from acceptance, and no coverage property is folded into the acceptance
  predicate. (An evaluation register has no operational waiver.)

**Item fields.** Each check carries: a stable CHECK ID, its family group, one criticality
(`GATE` = a load-bearing acceptance / trust-boundary / data-loss check whose miss opens a blocking
finding; `REQ` = required otherwise), one atomic binary claim, its pass condition, a named evidence
method, an on-fail route, a `source:` trace (its scenario case plus one stable SOP/WF heading — never
a line number), and one resolution slot. Source headings resolve to
[the generic planning SOP](SKILL.md#rules) and the folded workflow doc
`orchestration/workflow/planning.md`.

---

## SOP-* — generic plan-quality

### SOP-COVERAGE — decomposition equals approved scope
- [ ] SOP-COVERAGE-CHECK-01 [REQ] Every approved Ideation outcome maps to exactly one accountable task; pass: the source→deliverable ledger has one owner per outcome; evidence: diff Ideation outcome list vs task `traces-to:` union; on-fail: FAIL:<finding-id>; source: SOP-COVERAGE-CASE-01, SOP § Rules.
- [ ] SOP-COVERAGE-CHECK-02 [REQ] Every task maps back to an approved outcome; pass: no task has a blank source; evidence: read each task `traces-to:`; on-fail: FAIL:<finding-id>; source: SOP-COVERAGE-CASE-01, SOP § Rules.
- [ ] SOP-COVERAGE-CHECK-03 [GATE] No approved outcome is silently uncovered behind a full-looking list; pass: the set-difference of Ideation outcomes minus covered outcomes is empty; evidence: grep each outcome against the task list, compute the difference; on-fail: FAIL:<finding-id>, open a blocking finding; source: SOP-COVERAGE-CASE-02, SOP § Rules.

### SOP-SLICE — outcome-sliced, bounded packages
- [ ] SOP-SLICE-CHECK-01 [REQ] Each leaf is an end-to-end observable outcome (or names an unavoidable enabler); pass: each task's outcome is independently inspectable; evidence: read each task outcome + `files:`; on-fail: FAIL:<finding-id>; source: SOP-SLICE-CASE-01, SOP § Procedure.
- [ ] SOP-SLICE-CHECK-02 [REQ] A task with a multi-step `verifies:` over more than three files is treated as large regardless of its label; pass: the size judgment sits at the exact file/step limit; evidence: count `files:` and `verifies:` steps; on-fail: FAIL:<finding-id>; source: SOP-SLICE-CASE-02, SOP § Rules.
- [ ] SOP-SLICE-CHECK-03 [GATE] No mega-task hides behind an implicitly-small description; pass: every task's measured span matches its described size; evidence: measure span, compare to the limit; on-fail: FAIL:<finding-id>, open a blocking finding; source: SOP-SLICE-CASE-03, SOP § Rules.

### SOP-DAG — DAG order and genuine parallel lanes
- [ ] SOP-DAG-CHECK-01 [REQ] A topological sort over `requires:` reproduces the documented task order; pass: the sort equals the documented order; evidence: build the graph from `requires:`, topologically sort; on-fail: FAIL:<finding-id>; source: SOP-DAG-CASE-01, SOP § Procedure.
- [ ] SOP-DAG-CHECK-02 [GATE] The `requires:` graph is acyclic; pass: no cycle (direct or transitive); evidence: cycle-detect the graph; on-fail: FAIL:<finding-id>, open a blocking finding; source: SOP-DAG-CASE-02, SOP § Rules.
- [ ] SOP-DAG-CHECK-03 [GATE] No parallel-marked lane shares a mutated file or a dependency path; pass: every parallel lane pair has an empty `files:` intersection and no path; evidence: intersect the lanes' `files:` sets; on-fail: FAIL:<finding-id>, open a blocking finding; source: SOP-DAG-CASE-03, SOP § Rules.

### SOP-CONTRACT — complete contract, pre-anchored acceptance
- [ ] SOP-CONTRACT-CHECK-01 [REQ] Each task's acceptance is a binary pass/fail claim naming its deciding evidence before execution; pass: the acceptance admits a single yes/no answer; evidence: read each acceptance condition; on-fail: FAIL:<finding-id>; source: SOP-CONTRACT-CASE-01, SOP § Rules.
- [ ] SOP-CONTRACT-CHECK-02 [GATE] A cosmetically-conformant plan fails the acceptance gates (no vague "works"/"tests pass", no placeholder token in a runnable gate); pass: no gate can be passed by relabeling or a placeholder; evidence: attempt a cosmetic pass, scan for placeholder tokens; on-fail: FAIL:<finding-id>, open a blocking finding; source: SOP-CONTRACT-CASE-02, SOP § Rules.

### SOP-FORECAST — signposts, named responses, honest estimates
- [ ] SOP-FORECAST-CHECK-01 [REQ] Each load-bearing assumption carries an observable signpost and a continue/revise/stop/escalate response; pass: every assumption has a signpost + response; evidence: read each assumption; on-fail: FAIL:<finding-id>; source: SOP-FORECAST-CASE-01, SOP § Rules.
- [ ] SOP-FORECAST-CHECK-02 [GATE] No re-plan trigger is judgment-only ("re-plan if needed"); pass: every trigger names an observable signpost and threshold; evidence: grep for judgment-only trigger phrasings; on-fail: FAIL:<finding-id>, open a blocking finding; source: SOP-FORECAST-CASE-02, SOP § Rules.
- [ ] SOP-FORECAST-CHECK-03 [REQ] Each estimate is grounded in a reference class or marked low-confidence; pass: every estimate cites a reference class or an explicit low-confidence disposition; evidence: read each estimate; on-fail: FAIL:<finding-id>; source: SOP-FORECAST-CASE-01, SOP § Procedure.
- [ ] SOP-FORECAST-CHECK-04 [REQ] Each load-bearing assumption names a disconfirmation response for the case it is wrong; pass: inverting each assumption finds a named re-plan response; evidence: list load-bearing assumptions, invert each; on-fail: FAIL:<finding-id>; source: SOP-FORECAST-CASE-03, SOP § Rules.

### SOP-REVERSIBILITY — rollback boundaries, isolated high-blast changes
- [ ] SOP-REVERSIBILITY-CHECK-01 [REQ] Each task is independently revertible (atomic commit per task or a concrete `rollback:` step); pass: a single-task revert needs no unwinding of unrelated work; evidence: read the commit boundary per task; on-fail: FAIL:<finding-id>; source: SOP-REVERSIBILITY-CASE-01, SOP § Rules.
- [ ] SOP-REVERSIBILITY-CHECK-02 [GATE] Every inter-task pause, including on a high-blast change, leaves a coherent recoverable state; pass: each stop-after-task-N snapshot is a valid state; evidence: enumerate each inter-task snapshot, test validity at the migration boundary; on-fail: FAIL:<finding-id>, open a blocking finding; source: SOP-REVERSIBILITY-CASE-02, SOP § Rules.
- [ ] SOP-REVERSIBILITY-CHECK-03 [GATE] Each high-blast change (migration / dependency upgrade / public-interface change) is an isolated task with a go/no-go step; pass: no high-blast change is bundled with ordinary work and each has a gate; evidence: scan tasks for a bundled high-blast change; on-fail: FAIL:<finding-id>, open a blocking finding; source: SOP-REVERSIBILITY-CASE-03, SOP § Rules.

### SOP-PERF — measured perf work, bounded cost
- [ ] SOP-PERF-CHECK-01 [REQ] Every Ideation perf budget has a measurement step in some task's `verifies:`; pass: each budget maps to a measurement step; evidence: map each budget to a task's `verifies:`; on-fail: FAIL:<finding-id>; source: SOP-PERF-CASE-01, SOP § Rules.
- [ ] SOP-PERF-CHECK-02 [REQ] Each new external-call task names batching / caching and its slow-or-failed behaviour, citing any inherited default; pass: every external-call task states all three; evidence: read each external-call task; on-fail: FAIL:<finding-id>; source: SOP-PERF-CASE-01, SOP § Rules.
- [ ] SOP-PERF-CHECK-03 [GATE] Cumulative plan cost is bounded, not only per-task cost (Coverage: Cost); pass: a plan-total ceiling exists where multiple tasks issue paid calls; evidence: count paid-call tasks, multiply by per-task cost; on-fail: FAIL:<finding-id>, open a blocking finding; source: SOP-PERF-CASE-02, SOP § Rules.

### SOP-CLARITY — readable, placeholder-free, scannable
- [ ] SOP-CLARITY-CHECK-01 [REQ] Task titles are imperative and specific with no duplicate IDs, headings match the template, and the field set is uniform across tasks; pass: titles/IDs/headings/fields conform; evidence: read titles + IDs + headings, diff field names across tasks; on-fail: FAIL:<finding-id>; source: SOP-CLARITY-CASE-01, WF § required-sections template.
- [ ] SOP-CLARITY-CHECK-02 [GATE] No `TBD` / `TODO` / `???` placeholder remains in any task field; pass: a placeholder grep returns nothing; evidence: grep placeholder strings across the draft; on-fail: FAIL:<finding-id>, open a blocking finding; source: SOP-CLARITY-CASE-01, SOP § Procedure.
- [ ] SOP-CLARITY-CHECK-03 [REQ] No task is effectively empty (a bare "(see Ideation)" cross-reference with empty `outputs:` / `verifies:`); pass: every task has a non-empty `outputs:` and `verifies:`; evidence: read each task's `outputs:` / `verifies:`; on-fail: FAIL:<finding-id>; source: SOP-CLARITY-CASE-02, WF § required-sections template.
- [ ] SOP-CLARITY-CHECK-04 [REQ] The plan's heading structure is skimmable so a fresh executor can navigate it (Coverage: Accessibility); pass: sections are scannable with descriptive headings; evidence: skim the heading tree; on-fail: FAIL:<finding-id>; source: SOP-CLARITY-CASE-01, WF § required-sections template.

---

## WF-* — gobbi workflow-compliance

### WF-TRACE — anchored tasks, scope stays bound
- [ ] WF-TRACE-CHECK-01 [REQ] Every task carries a `traces-to:` that resolves to a verbatim Ideation item; pass: each `traces-to:` finds an exact Ideation match and no task is anchorless; evidence: grep each `traces-to:` against Ideation; on-fail: FAIL:<finding-id>; source: WF-TRACE-CASE-01, WF § Operating principles.
- [ ] WF-TRACE-CHECK-02 [GATE] No task introduces a requirement absent from Ideation / the Scope Contract; pass: every task requirement has a Scope-Contract or Ideation source; evidence: diff task requirements vs the Scope Contract; on-fail: FAIL:<finding-id>, open a blocking finding; source: WF-TRACE-CASE-02, WF § Operating principles.

### WF-SCHEMA — canonical record, what not how
- [ ] WF-SCHEMA-CHECK-01 [REQ] Every task is the canonical record `{id, what, traces-to, requires, files, inputs, outputs, verifies}`; pass: every schema field is present per task; evidence: check each task's field set; on-fail: FAIL:<finding-id>; source: WF-SCHEMA-CASE-01, WF § Tasks schema.
- [ ] WF-SCHEMA-CHECK-02 [GATE] No task embeds implementation code or a step-by-step recipe in `what:`; pass: each `what:` states a verifiable goal, not a mechanism; evidence: read `what:` for an embedded diff / command recipe; on-fail: FAIL:<finding-id>, open a blocking finding; source: WF-SCHEMA-CASE-02, WF § Operating principles.

### WF-ASSIGN — fitted, justified assignments
- [ ] WF-ASSIGN-CHECK-01 [REQ] Each task's agent type is justified and lists `principles` plus the domain skills for the files it touches; pass: every non-default type is justified and the skill list matches the files; evidence: read each assignment vs the files touched; on-fail: FAIL:<finding-id>; source: WF-ASSIGN-CASE-01, WF § Agent assignment.
- [ ] WF-ASSIGN-CHECK-02 [REQ] Each task names its domain-filtered required mistakes; pass: every task touching a domain lists that domain's mistakes; evidence: read each assignment's required-mistakes list; on-fail: FAIL:<finding-id>; source: WF-ASSIGN-CASE-01, WF § Agent assignment.
- [ ] WF-ASSIGN-CHECK-03 [GATE] No task exceeds its assigned agent's context or tool budget; pass: each task's size and tool needs fit the assigned agent; evidence: compare task size to the agent's context / tool surface; on-fail: FAIL:<finding-id>, open a blocking finding; source: WF-ASSIGN-CASE-02, WF § Agent assignment.

### WF-FRESH-EXEC — task-alone executability
- [ ] WF-FRESH-EXEC-CHECK-01 [REQ] Every task is executable from its own `inputs:` / `outputs:` / `verifies:` without parent-session context; pass: one task read in isolation yields its full action; evidence: read one task in isolation, derive the action; on-fail: FAIL:<finding-id>; source: WF-FRESH-EXEC-CASE-01, WF § WORK discipline.
- [ ] WF-FRESH-EXEC-CHECK-02 [GATE] No `verifies:` is a non-runnable placeholder and no prerequisite is unnamed in `requires:` / `inputs:`; pass: every gate runs verbatim and every dependency is named; evidence: attempt each `verifies:` as-is, trace dependencies; on-fail: FAIL:<finding-id>, open a blocking finding; source: WF-FRESH-EXEC-CASE-02, WF § WORK discipline.

### WF-GOVERNANCE — authority and cross-task governance
- [ ] WF-GOVERNANCE-CHECK-01 [REQ] PII / data-flow, license, and new-dependency surfaces are labelled and manifest changes are sequenced first (Coverage: Privacy / Licensing / Supply-chain); pass: each such task carries its label and dependency-manifest tasks precede consumers; evidence: scan tasks for PII / dependency / license surfaces; on-fail: FAIL:<finding-id>; source: WF-GOVERNANCE-CASE-01, WF § Constraints.
- [ ] WF-GOVERNANCE-CHECK-02 [REQ] The plan is observable mid-execution and long-running tasks emit intermediate signals (Coverage: Observability); pass: a stuck task is identifiable and long tasks are not all-or-nothing; evidence: read the plan's progress-signal surfaces; on-fail: FAIL:<finding-id>; source: WF-GOVERNANCE-CASE-01, WF § Constraints.
- [ ] WF-GOVERNANCE-CHECK-03 [GATE] No task authors a test framework (verification is anchored, not authored); pass: no task slices test-writing as its deliverable; evidence: scan task deliverables for test-authoring; on-fail: FAIL:<finding-id>, open a blocking finding; source: WF-GOVERNANCE-CASE-01, WF § Constraints.
- [ ] WF-GOVERNANCE-CHECK-04 [GATE] A substantive disagreement with the user's locked direction is raised through USER CHALLENGE, not silently compromised; pass: any plan departure from the locked direction has a USER CHALLENGE record; evidence: diff plan direction vs locked Ideation direction, check the discussion log; on-fail: FAIL:<finding-id>, open a blocking finding; source: WF-GOVERNANCE-CASE-02, WF § USER CHALLENGE.

---

## SEAM-* — SOP↔WF boundary

### SEAM-TRACES — one gobbi `traces-to` per package
- [ ] SEAM-TRACES-CHECK-01 [REQ] Each package's generic anchor obligation is realized by exactly one `traces-to:`; pass: one-to-one mapping from generic anchor to `traces-to:`; evidence: map the generic anchor-obligation to `traces-to:`; on-fail: FAIL:<finding-id>; source: SEAM-TRACES-CASE-01, SOP § Rules.
- [ ] SEAM-TRACES-CHECK-02 [GATE] A dangling `traces-to:` is detected, not accepted as an anchor; pass: every `traces-to:` resolves to an existing Ideation item; evidence: grep `traces-to:` against Ideation for resolution; on-fail: FAIL:<finding-id>, open a blocking finding; source: SEAM-TRACES-CASE-02, WF § Operating principles.

### SEAM-SCHEMA-FIT — generic fields fit the schema, hand-offs match
- [ ] SEAM-SCHEMA-FIT-CHECK-01 [REQ] Every generic contract field (outcome / boundary / inputs / outputs / assumptions / acceptance / evidence / estimate) has a task-schema home; pass: no generic field is dropped for lack of a schema slot; evidence: map generic fields to schema fields; on-fail: FAIL:<finding-id>; source: SEAM-SCHEMA-FIT-CASE-01, WF § Tasks schema.
- [ ] SEAM-SCHEMA-FIT-CHECK-02 [REQ] The `requires:` edges reproduce the rendered dependency table; pass: `requires:` and the dependency table agree; evidence: diff `requires:` vs the dependency table; on-fail: FAIL:<finding-id>; source: SEAM-SCHEMA-FIT-CASE-01, WF § Tasks schema.
- [ ] SEAM-SCHEMA-FIT-CHECK-03 [GATE] Each task's `outputs:` literally name-match the consuming task's `inputs:` (no silent rename); pass: every hand-off is a literal name match; evidence: diff `outputs:` vs downstream `inputs:`; on-fail: FAIL:<finding-id>, open a blocking finding; source: SEAM-SCHEMA-FIT-CASE-02, WF § Tasks schema.

### SEAM-TRIGGER-MAP — signposts map to gobbi responses
- [ ] SEAM-TRIGGER-MAP-CHECK-01 [REQ] Each assumption signpost maps to a concrete gobbi response (REVISE / USER CHALLENGE / re-enter Ideation); pass: every signpost names a gobbi route; evidence: map each signpost's generic response to a gobbi response; on-fail: FAIL:<finding-id>; source: SEAM-TRIGGER-MAP-CASE-01, WF § USER CHALLENGE.
- [ ] SEAM-TRIGGER-MAP-CHECK-02 [GATE] No signpost is left without a gobbi response route; pass: every observable signpost has a REVISE / USER-CHALLENGE / re-entry mapping; evidence: enumerate signposts, check each for a gobbi route; on-fail: FAIL:<finding-id>, open a blocking finding; source: SEAM-TRIGGER-MAP-CASE-02, WF § USER CHALLENGE.

---

## Completion

- **Coverage-closure:** every applicable gate and required check above (plus any `## Stage 1
  Additions`) resolves to exactly one of `PASS` / `FAIL:<finding-id>` / `n/a:<property>`.
- **Acceptance:** every applicable gate and required check resolves `PASS`. A `FAIL:<finding-id>` or
  an `n/a:<property>` closes coverage but not acceptance.
- Record per-perspective counts (PASS / FAIL / n/a / total) in the filled copy.
