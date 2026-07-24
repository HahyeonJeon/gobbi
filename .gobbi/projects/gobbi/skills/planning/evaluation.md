# Planning Loop — Evaluation Frame

Phase child doc loaded by the evaluator at Stage 0 when the workflow phase is `planning`. It
provides the per-perspective evaluation **procedure** for a Planning working draft: each
perspective's **lens**, its **recommended verifications**, and its **perspective-specific
anti-patterns**, plus the **Overall (Stage 3)** anchors. The concrete scenario families live in the
sibling `scenario.md`, and their yes/no checks live in the sibling `checklist.md`; each perspective
below points to its seed families in both.

## Stage 0 — what to load and read

Before Stage 1, the evaluator loads and reads, in addition to the working draft itself:

- The **generic planning SOP** `planning/SKILL.md` — [§ Principles](SKILL.md#principles) and
  [§ Rules](SKILL.md#rules) — the workflow-agnostic plan-quality craft the `SOP-*` families judge
  against.
- The **folded workflow doc** `orchestration/workflow/planning.md` — its
  [§ Operating principles](../orchestration/workflow/planning.md#operating-principles),
  [§ USER CHALLENGE](../orchestration/workflow/planning.md#user-challenge), the canonical task
  schema, and the agent-assignment sub-step — the Gobbi Planning mechanics the `WF-*` families judge
  against.
- The **Scope Contract** — the locked Ideation boundary the plan must stay inside (schema canonical
  at [`evaluation/SKILL.md`](../evaluation/SKILL.md) § Scope Contract Schema).
- The **working plan** under evaluation:
  `sessions/{date}-{session-id}/3-planning/working/draft-iter{n}.md` — the ordered task list, the
  dependency graph, and the per-task agent assignment.
- The **scenario source** `scenario.md` (Stage 1 seed families) and the **checklist source**
  `checklist.md` (Stage 1 seed checks + the copy-then-tick source).

A plan is judged against the idea it implements, so the Ideation working plan and its Scope Contract
are required inputs — without them every perspective's evaluation is shallow. Planning is a process
loop: the artifact is a plan, not code, so the scenario families already bake in adversarial cases
(mis-ordered tasks, dangling traces, hidden coupling, silent scope expansion), and Stage 2 walks
each locked Frame once without a separate adversarial pass.

## Three separated reports — generic-plan quality, workflow-compliance, seam-consistency

Findings are grouped and reported by the three concern layers the family prefixes encode, so a
draft that is a strong generic plan but breaks a Gobbi mechanic (or the reverse) is never masked:

- **Generic-plan quality (`SOP-*`)** — does the draft satisfy the workflow-agnostic craft in
  `planning/SKILL.md`?
- **Workflow-compliance (`WF-*`)** — does the draft follow the Gobbi Planning mechanics in
  `orchestration/workflow/planning.md`?
- **Seam-consistency (`SEAM-*`)** — do the generic craft and the Gobbi mechanics agree at the
  boundary (one `traces-to` per package, every generic field representable in the schema, `requires:`
  matching the DAG, signposts mapped to the re-plan responses)?

Each finding **cites the failed check plus its owning stable anchor** — the `checklist.md` CHECK ID
it failed and the owning SOP / WF heading (for example SOP § Rules or WF § USER CHALLENGE) — never a
line number, so the citation survives future edits to those documents.

---

## Project

**Lens**: does the plan implement the **right idea**, the whole idea, and **only** the idea?

**Scenario source:** `scenario.md` § SOP-COVERAGE, § WF-TRACE
**Checklist source:** `checklist.md` § SOP-COVERAGE, § WF-TRACE

### Recommended verifications

| Tool | Use for |
|---|---|
| Diff Ideation outcome list vs task `traces-to:` union | Detect an orphaned outcome or scope expansion mechanically |
| Read the Scope Contract alongside the plan | Confirm no task introduces an unsourced requirement |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"While we're here" tasks** | An adjacent-but-unrelated improvement is scope creep. Re-route to backlog; do not include it |
| **Re-framing the idea during planning** | If the plan reveals the idea was wrong, return to Ideation — do not silently re-frame inside Planning |

---

## Structure

**Lens**: is the **task decomposition** sound? Are dependencies ordered correctly, task sizes
bounded, and agent-type assignments right?

**Scenario source:** `scenario.md` § SOP-SLICE, § SOP-DAG, § WF-SCHEMA, § SEAM-SCHEMA-FIT
**Checklist source:** `checklist.md` § SOP-SLICE, § SOP-DAG, § WF-SCHEMA, § SEAM-SCHEMA-FIT

### Recommended verifications

| Tool | Use for |
|---|---|
| Count files-touched + `verifies:` steps per task | Quantify task size mechanically against the stop rule |
| Topologically sort `requires:` and diff vs the documented order | Detect cycles and false ordering |
| Intersect parallel lanes' `files:` sets | Detect a conflicting shared mutation |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"This task is trivial, no decomposition needed"** | If the `verifies:` is multi-step, the task is multi-step. Size by readiness, not by label |
| **Implicit task ordering** | If a reader must infer order from context, `requires:` is missing. Flag a `checklist_gap` |
| **One mega-task** | A non-trivial idea planned as fewer than three tasks is suspect — re-check the slice |

---

## Performance

**Lens**: does the plan **preserve** the Ideation performance commitments, and is the plan's own
execution cost bounded?

**Scenario source:** `scenario.md` § SOP-PERF
**Checklist source:** `checklist.md` § SOP-PERF

### Recommended verifications

| Tool | Use for |
|---|---|
| Map each Ideation perf budget to a task's `verifies:` | Confirm a measurement step exists per budget |
| Count tasks issuing paid / external calls and multiply by per-task cost | Detect unbounded cumulative cost |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Performance is for later"** | If Ideation committed to a budget, Planning must commit to measuring it, or the budget is fiction |
| **Per-task cost only** | Task-local cost does not aggregate. Bound cumulative cost across the plan |

---

## Aesthetics

**Lens**: is the **plan document itself** readable, consistent, and free of placeholders?

**Scenario source:** `scenario.md` § SOP-CLARITY (secondary), § SOP-CONTRACT (secondary), § SEAM-TRACES (secondary)
**Checklist source:** `checklist.md` § SOP-CLARITY, § SOP-CONTRACT, § SEAM-TRACES

### Recommended verifications

| Tool | Use for |
|---|---|
| Grep for placeholder strings | Mechanical placeholder check |
| Diff field names across tasks | Detect an inconsistent schema |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Aesthetics confused with personal style** | Project conventions are not preferences. Deviation from the required-sections template is a finding |

---

## Usage

**Lens**: can the **executor** use this plan without coming back to the user or the leader?

**Scenario source:** `scenario.md` § WF-ASSIGN, § WF-FRESH-EXEC, § SOP-CLARITY (accessibility)
**Checklist source:** `checklist.md` § WF-ASSIGN, § WF-FRESH-EXEC, § SOP-CLARITY

### Recommended verifications

| Tool | Use for |
|---|---|
| Pick a random task and read it in isolation | Test the fresh-executor, task-alone requirement |
| Attempt each `verifies:` command verbatim | Detect a placeholder or non-runnable gate |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"The executor can figure it out"** | Anything the plan delegates to executor "figure-out" is a planning gap |

---

## Consistency

**Lens**: do task hand-offs match, do task fields mutually agree, and does the plan trace coherently
back to Ideation?

**Scenario source:** `scenario.md` § SOP-CONTRACT, § SOP-CLARITY, § SEAM-TRACES, § SEAM-SCHEMA-FIT, § SEAM-TRIGGER-MAP, § WF-GOVERNANCE (secondary)
**Checklist source:** `checklist.md` § SOP-CONTRACT, § SOP-CLARITY, § SEAM-TRACES, § SEAM-SCHEMA-FIT, § SEAM-TRIGGER-MAP

### Recommended verifications

| Tool | Use for |
|---|---|
| Diff `outputs:` vs downstream `inputs:` across hand-offs | Detect a silent field rename |
| Cross-reference each `traces-to:` against Ideation text | Detect a dangling trace |
| Map each generic contract field to a task-schema field | Detect a dropped generic field at the seam |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Paraphrased hand-offs** | Different names for one artifact across a hand-off cannot be verified mechanically. Force a literal name match |
| **Dangling traces** | A `traces-to:` referencing an item Ideation does not have. Re-anchor or drop it |

---

## Risk

**Lens**: what breaks if **the plan itself** is wrong? Order risk, dependency risk, rollback
granularity, cross-task governance, and re-plan control.

**Scenario source:** `scenario.md` § SOP-FORECAST, § SOP-REVERSIBILITY, § WF-GOVERNANCE, § SEAM-TRIGGER-MAP, § SOP-PERF (secondary)
**Checklist source:** `checklist.md` § SOP-FORECAST, § SOP-REVERSIBILITY, § WF-GOVERNANCE, § SEAM-TRIGGER-MAP

### Recommended verifications

| Tool | Use for |
|---|---|
| Enumerate each stop-after-task-N snapshot | Detect an incoherent intermediate state |
| Scan tasks for a bundled high-blast change with no go/no-go step | Detect an ungated migration / upgrade |
| Diff task `outputs:` against the project's external interface surface | Detect an inadvertent public-interface change |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Each task is small, total risk is fine"** | Task-local risk does not aggregate to plan risk. Weigh cumulative blast radius |
| **Judgment-only re-plan triggers** | "Re-plan if needed" cannot control re-planning. Require an observable signpost and a gobbi response route |

---

## Overall (Stage 3) — phase-specific anchors

| Karpathy mode | What it looks like in a Planning artifact |
|---|---|
| **Wrong assumptions** | A task's `verifies:` assumes infrastructure or state that does not exist |
| **Overcomplexity** | The plan introduces an abstraction Ideation did not mandate ("while we're here, extract a helper") |
| **Orthogonal edits** | A task bundles two distinct Ideation outcomes because they touch one file. Split them |
| **Imperative-over-declarative** | A task prescribes the exact diff instead of stating the verifiable goal — robbing the executor of judgment |

At Stage 3, also confirm the three separated reports are internally coherent: a draft that passes
generic-plan quality but fails seam-consistency (or workflow-compliance) is a genuine cross-layer
finding, not a wash.

**Preserve-list anchors specific to Planning**: well-drawn task-decomposition boundaries; concrete,
runnable verification commands; explicit dependency orderings.

---

## Output reminder — the nine-output-file contract

The evaluator writes **nine** output files per system: the seven per-perspective files + one
`overall.md` + the filled `checklist.md` (copied from the sibling `checklist.md` at Stage 0 and
ticked through Stage 2), all under
`sessions/{date}-{session-id}/3-planning/evaluation/iter{n}/{system}/`:

- Seven per-perspective files at `.../{project,structure,performance,aesthetics,usage,consistency,risk}.md`
- One `overall.md`
- One filled `checklist.md` — the copy-then-tick coverage register (Stage 0 copy → Stage 1
  `## Stage 1 Additions` → Stage 2 tick with `PASS:` / `FAIL:<finding-id>` / `n/a:<property>`)

Each per-perspective file carries the mandatory headers: `## Artifact Summary + Memory reads`
(Stage 0) → `## Locked Frame (Stage 1)` → `## Per-scenario per-check results` → `## Typed findings`
(Stage 2, each with Type / Domain / Disposition / Confidence / Severity / Evidence) →
`## Low-confidence appendix`. This nine-output contract is owned by
[`evaluation/SKILL.md`](../evaluation/SKILL.md#evaluation-child-doc-bundle-and-the-copy-then-tick-checklist);
this doc does not restate its mechanics, only its per-loop paths.
