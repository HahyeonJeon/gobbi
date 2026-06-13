---
name: ideation
description: MUST load when entering or revising the Ideation Loop. Covers research-backed discussion of What/Why/How and authoring of the loop.s outputs/ files.
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch, Write, Edit, AskUserQuestion
---

# Ideation

Skill for the **Ideation Loop**. Defines what each of the four phases (DISCUSSION → WORK → EVALUATION → RECORD) does, which agent owns it, what inputs it consumes, and what artifacts it produces. Loaded by every agent participating in the loop — the manager for orchestration context, and each specialist for the procedural contract of the phase it owns.

The Ideation Loop concentrates on **What, Why, and How**:
- **What** — what is the idea, what problem does it solve, what is in scope
- **Why** — motivation, root cause, success criteria, prior attempts
- **How** — approach, scenarios, design layers, validation strategy

The manager's orchestration of the Ideation Loop (when to spawn each specialist, perspective selection for EVALUATION, RECORD delegation, ITER/EXIT decision) is in [`orchestration/workflow/ideation.md`](../orchestration/workflow/ideation.md).

---

## Memory Access Matrix

The agent in the leader role MUST observe these tier boundaries. The only write surfaces are the loop's own session subdirectories.

| Memory tier | Path root | Access from leader role |
|---|---|---|
| **Session record — own loop working** | `sessions/{date}-{session-id}/1-ideation/working/` | **READ + WRITE** — leader drafts, transcripts, discussion log |
| **Session record — own loop staging** | `sessions/{date}-{session-id}/1-ideation/staging/{scenarios,checklists,decisions,references,design,discussions,backlogs/{feature,project}}/` | **READ + WRITE (WORK only)** — DISCUSSION-approved decisions stage here; Wrap-up promotes to memory |
| **Session record — `session.json`** | `sessions/{date}-{session-id}/session.json` | **FORBIDDEN** — the leader never reads or writes session.json; the manager owns it (iter `n` is supplied as an input) |
| **Feature memory** | `.gobbi/projects/{project-name}/features/{feature-name}/` | **READ-ONLY** — required for overlap detection (Sub-step A) and reuse of prior decisions / scenarios / checklists. Never written; Wrap-up owns feature-memory writes |
| **Memory** | `.gobbi/projects/{project-name}/{mistakes,rules,design,notes,backlogs,references,decisions,plans,reviews,reports,learnings,archive,skills}/` | **READ-ONLY** — required for context (project mistakes, rules, prior designs). Never written; Wrap-up owns memory writes |

**Delete semantics**: the leader NEVER deletes any file in any tier. Supersession is recorded via frontmatter (`status: superseded`, `superseded_by:`); physical deletion is forbidden. Once an artifact reaches a terminal state, Wrap-up moves the full file (`git mv`) to `archive/{type}/` per the move-on-terminal model — never deletes it.

**Write enforcement**: any write attempted outside the WRITE rows above is a constraint violation. Code attempting writes to memory or feature memory must be revoked and Ideation restarted with a corrected scope.

---

## Core Principles

Cross-cutting principles for every agent participating in this loop.

> **Disagree when you disagree.**

If something in the manager's framing or the user's intent is factually wrong, contradicted by the codebase, or based on a flawed assumption, surface it explicitly with evidence. The participating agent's authority is **technical correctness and codebase reality**; the user's authority is **intent and priorities**. Anti-sycophancy is mandatory.

> **Protect contribution points.**

A contribution point is a decision where the user's domain knowledge produces a better outcome than agent discretion. When such a decision surfaces — in DISCUSSION research, an EVALUATION finding, or RECORD routing — the participating agent **raises it to the manager** so the manager can use the active runtime's user-decision primitive. The user's answer becomes a constraint, not a suggestion.

> **The artifact is the program.**

The loop.s `outputs/` produced in RECORD becomes the Planning Loop's input. Reasoning, dead ends, and alternatives explored live in the transcripts; the artifact is what survives. Spell out What / Why / How in the artifact — anything that is "obvious from the discussion" but not written down will be lost.

> **Stay in scope.**

The Scope Contract locked in DISCUSSION is binding. If any phase drifts beyond the contract, the participating agent **refuses** rather than absorbing. Out-of-scope items get logged as backlog entries or re-enter DISCUSSION via REVISE — they never silently graduate into the canonical artifact.

> **NEEDS_CONTEXT escalation.**

This loop's DISCUSSION phase is manager-direct (the manager uses the active runtime's user-decision primitive when user input is needed); subagents do not run DISCUSSION here. NEEDS_CONTEXT escalation primitive applies to subagents during the WORK phase only — the leader returns NEEDS_CONTEXT in its final report; the manager handles the user-question block per `discussion/SKILL.md`. See `agents/leader.md` § Status Contract for the leader's NEEDS_CONTEXT pattern.

---

## DISCUSSION Phase

**Purpose**
Take the user's initial idea — typically vague, partial, or loosely framed — and **clarify and concretize** it into user-approved decisions on What / Why / How: framed problem, locked scope, research insights (internal + external), scenarios, design decisions. Each sub-step pushes the idea toward more specificity, so that by the end of DISCUSSION no downstream phase has to guess at user intent. The four sub-steps below run in order.

**Inputs**
- User's initial framing of the problem
- Memory (`.gobbi/projects/{project}/{features/, mistakes/, references/, design/, decisions/}`)
- Codebase and recent git log for the area being touched
- Manager's framing notes
- On `REVISE` iterations: prior iteration's evaluator findings (`scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`) — the leader researches the cited issues before re-engaging the user

**Procedure**
Run sub-steps A → B → C → D in order. Each sub-step's procedure block is below.

**Outputs**
- Approved drafts (captured in transcript) for: Framed Problem, Scope Contract, Internal Insights, External Insights, Scenarios, Implementation Checklist, Design Decisions
- External reference promotion list — slugs + external insights ready for WORK to stage at `sessions/{date}-{session-id}/1-ideation/staging/references/`
- Backlog decision list — slugs ready for WORK to stage at `sessions/{date}-{session-id}/1-ideation/staging/backlogs/feature/` and `sessions/{date}-{session-id}/1-ideation/staging/backlogs/project/`
- Discussion log (manager-captured user-decision exchanges)

**Exit checklist**
- [ ] All four sub-steps (A–D) completed
- [ ] Scope Contract approved by the user through the active runtime's user-decision primitive
- [ ] Research produced sufficient internal AND external insights (target: 3–5 each; deeper coverage may yield more)
- [ ] Every checklist item anchored to a confirmed internal or external insight
- [ ] Every design decision has a validation method

---

### Sub-step A — Frame What and Why

**Purpose**
Establish the root cause, impact, success criteria, prior attempts, the strongest argument against the proposed approach, and whether a more ambitious framing hides inside the literal ask — so downstream work has a confirmed problem statement to act on.

**Inputs**
- User's initial framing
- Memory + codebase + git log

**Memory reads required at this sub-step** (READ-ONLY, enumerate explicitly in Decisions Log):

| Path | Purpose |
|---|---|
| `.gobbi/projects/{project-name}/features/` (enumerate feature dirs) | Detect overlap with existing feature scopes |
| `.gobbi/projects/{project-name}/features/{feature-name}/{design,decisions,scenarios,checklists}/` (for each candidate feature) | Reuse prior decisions; avoid contradicting design |
| `.gobbi/projects/{project-name}/mistakes/` | Surface project-wide mistakes relevant to the framed problem |
| `.gobbi/projects/{project-name}/rules/` | Identify any project rules that constrain the framing |
| `.gobbi/projects/{project-name}/design/` | Project-wide design context |
| `.gobbi/projects/{project-name}/notes/` | Recent handoff / investigation notes for context |
| `.gobbi/projects/{project-name}/backlogs/` | Confirm the problem is not already deferred |
| Codebase + `git log` | Identify prior attempts, related commits |

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Framed problem; memory paths above; codebase | Read enumerated memory + codebase; record exact paths consumed in Decisions Log | Context notes + Memory reads register |
| 2 | Leader | Step 1 context | Investigate the likely causal chain | Proposed deepest plausible root cause |
| 3 | Leader | Steps 1–2 | Pull impact evidence | Who is affected / severity / cost of inaction |
| 4 | Leader | Steps 1–3 | Draft success criteria | 2–4 concrete measurable criteria |
| 5 | Leader | Framed-problem keywords | Grep git log + memory | Prior attempts list (what was tried / outcome) |
| 6 | Leader | Steps 1–5; codebase patterns; external prior art | Build a **steel-man counterfactual** — the strongest argument against the proposed approach, with counter-evidence | Steel-man argument + counter-evidence, or `none plausible` |
| 7 | Leader | Steps 1–5; Framed Problem context | Apply the **re-framing check** — is the user's literal ask the right framing, or does a more ambitious framing hide inside? Surface possibilities only (no scope-creep) | Re-framing notes, or `none plausible` |
| 8a | Leader | Steps 1–7 outputs | Surface findings to the manager | Findings package |
| 8b | Manager | 8a findings package | Run the six forcing questions through the active runtime's user-decision primitive | User answers |
| 8c | User | Forcing questions | Decide | Confirmed Framed Problem (per template below) |

Forcing questions the manager runs (research-backed draft answers provided before each):

| # | Question |
|---|---|
| 1 | Root cause vs symptom — "why" until the chain stops moving |
| 2 | Impact — who, how severe, what if nothing changes |
| 3 | Success criteria — concrete, measurable |
| 4 | Prior attempts — what was tried, what worked, what failed |
| 5 | Counterfactual / steel-man — what's the strongest argument against this approach |
| 6 | Re-framing check — is the literal ask the right framing, or does a more ambitious framing hide inside? Surface only; user decides whether to chase or reject (no scope-creep without explicit approval) |

**Outputs**

Confirmed Framed Problem stamped to the template below (field values are confirmed during this sub-step's user-decision exchanges; the leader writes the document in WORK):

```markdown
## Framed Problem

**Root cause**
{Deepest plausible cause + evidence: codebase ref / git commit / prior mistake / memory note}

**Impact**
- **Who is affected**: {personas, components, downstream consumers}
- **Severity**: {minor inconvenience / blocker / regression / data loss / etc.}
- **Cost of inaction**: {what happens if we don't address this}

**Success criteria**
- {2–4 concrete measurable criteria — yes/no question or quantitative threshold}

**Prior attempts**
- {what was tried, when, by whom, outcome; or "None on record."}

**Counterfactual / steel-man**
{Strongest argument against the proposed approach with counter-evidence. If the steel-man stands, document why we proceed anyway, or what mitigations are required. Or `None plausible — no compelling argument against`.}

**Re-framing conclusion**
{More ambitious framing if it plausibly exists inside the literal ask, or `None — literal ask is the right framing.`}
```

---

### Sub-step B — Lock Scope (Project-Feature-Task contract)

**Purpose**
Narrow the framed problem to a single workflow-sized `{Project, Feature, Task}` triplet via a user-locked Scope Contract, and defer non-picked candidates to backlog decisions. After this sub-step the loop has a binding boundary; nothing outside the contract enters the canonical artifact.

**Inputs**
- Sub-step A output (Framed Problem)
- Existing feature directories under `features/`

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Sub-step A output (Framed Problem); existing `features/` | Enumerate candidate tasks as `{Project, Feature, Task}` triplets at one-workflow-sized granularity | Candidate list |
| 2 | Leader | Candidate list | Dependency analysis — propose first candidate (fewest prereqs, most downstream unblocked) | Recommended first candidate + rationale |
| 3a | Leader | Recommended candidate | Identify feature directory bootstrapping requirements | Required feature directory paths |
| 3b | Manager | Required session paths | Bootstrap the session loop tree at `sessions/{date}-{session-id}/1-ideation/{working,staging,evaluation}/` | Created session directory tree |
| 4a | Leader | Recommended candidate; research | Provide field values for the Scope Contract template | Scope Contract draft |
| 4b | Manager | Scope Contract draft | Run the active runtime's user-decision primitive | User decision |
| 4c | User | Scope Contract draft | Lock the contract | Locked Scope Contract |
| 5 | Leader | Candidate list minus picked candidate | Record deferred candidates as backlog **decisions** (paths + slugs) — tasks → staged at `sessions/{date}-{session-id}/1-ideation/staging/backlogs/feature/{slug}.md`; features → staged at `sessions/{date}-{session-id}/1-ideation/staging/backlogs/project/{slug}.md`. Wrap-up promotes to `features/{feature-name}/backlogs/` and top-level `backlogs/` respectively | Backlog decision list |

Decisions happen here; the **files** are written in WORK.

**Outputs**

- Locked Scope Contract emitted using the canonical schema (field values provided from research; the manager writes the contract into the discussion)
- Backlog decision list (paths and slugs ready for WORK)

Emit the canonical Scope Contract schema verbatim per `evaluation/SKILL.md § Scope Contract Schema`. The frontmatter requires `artifact_type: scope-contract`, `feature`, `goal`, `created-by`, `created-at`; body sections are `In-Scope` / `Out-of-Scope` / `Decisions Locked` / `Success Criteria` / `Deferred`. Do not introduce local field names.

Example shape:

```yaml
artifact_type: scope-contract
feature: <feature-name or null>
goal: <one-line user-facing outcome>
created-by: <ideation-loop-session-id>
created-at: <ISO-8601 timestamp>
```

```markdown
## In-Scope
- <specific work authorized>

## Out-of-Scope
- <specific work excluded; backlog pointer if applicable>

## Decisions Locked
- <decision>: <one-line rationale>

## Success Criteria
- <verifiable criterion>

## Deferred
- <item> — pointer (e.g., #258, backlog/foo.md)
```

---

### Sub-step C — Research

**Purpose**
Research internal codebase and external prior art deeply enough that every downstream design choice in Sub-step D can be anchored to a confirmed insight. Internal and external surfaces are researched **independently** per the [research skill](../research/SKILL.md); each must be sufficiently deep on its own before Design begins. The core thinking pattern is **research → consult → design**: insights are not just collected, they actively inform every downstream choice.

**Inputs**
- Framed Problem from Sub-step A
- Locked Scope Contract from Sub-step B

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Locked Scope Contract; Framed Problem | Load the [research skill](../research/SKILL.md). Run **Internal Research** per the research skill's Internal Research procedure | Internal insights |
| 2 | Leader | Locked Scope Contract; Framed Problem | Run **External Research** per the research skill's External Research procedure | External insights |
| 3a | Leader | Internal + external insights | Present internal and external insights to the manager **separately** (target: 3–5 each; deeper research may yield more — coverage is the bar, not the count) | Insights package |
| 3b | Manager | Insights package | Surface to user | User reaction |
| 3c | User | Insights | Push back where applicable | Pushback notes |
| 3d | Leader | Pushback notes | Revise insights | Confirmed internal + external insights |
| 4 | Leader | Confirmed external insights | Decide reference slug per external insight for WORK to **stage** at `sessions/{date}-{session-id}/1-ideation/staging/references/{slug}.md`. Internal insights inform design but do not stage as reference files; they live in the Decisions Log and design rationale | External reference promotion list |

**Outputs**

- Confirmed **internal insights** (per the Insight format defined in the [research skill](../research/SKILL.md))
- Confirmed **external insights** (per the Insight format defined in the [research skill](../research/SKILL.md))
- **External reference promotion list** — `{slug}.md` per confirmed external insight, ready for WORK to stage at `sessions/{date}-{session-id}/1-ideation/staging/references/{slug}.md`. Internal insights do not stage as reference files; they live in the Decisions Log and design rationale. Wrap-up promotes staged references to `features/{feature-name}/references/` after the session completes

---

### Sub-step D — Design

**Purpose**
Convert confirmed research insights — together with the locked Scope Contract and Framed Problem — into approved scenarios, an implementation checklist, and a set of **directional design decisions** (library / framework / design pattern / API shape / etc.). Every scenario, checklist item, and design decision is anchored to a confirmed insight from Sub-step C. Detailed mechanism (function signatures, internal logic, file-level structure) is deferred to Execution; this sub-step decides direction only. By the end of this sub-step, the design direction is concrete enough that Planning can decompose it into tasks.

**Inputs**
- Confirmed internal + external insights from Sub-step C
- Locked Scope Contract from Sub-step B
- Framed Problem from Sub-step A

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Locked Scope Contract; confirmed insights | Propose **scenarios** the result must handle — golden path / edge cases / failure modes / adversarial (for security-sensitive code). Each scenario consults the insight pool | Scenario set |
| 2 | Leader | Scenario set; confirmed insights | Propose an **implementation checklist** — every item anchored to a confirmed internal or external insight | Anchored checklist |
| 3 | Leader | Scenarios; checklist; confirmed insights | **Enumerate directional design decisions** — the high-level choices the implementation will make. Examples: library / framework choice, design pattern, API shape (config object vs positional parameters), persistence model, error-handling strategy, concurrency model | Decision points list |
| 4 | Leader | Decision points list; confirmed insights | **For each decision point, choose a direction** with rationale anchored to a confirmed insight (internal or external). Detailed mechanism (function signatures, internal logic, file-level structure) is deferred to Execution | Design decision list — `{decision point, chosen direction, rationale, anchored insight}` per decision |
| 5 | Leader | Design decision list | Assign a **validation method** per design decision (e.g., automated test, manual check, metric, user demo) | Validation strategy |
| 6a | Leader | Scenarios + checklist + design decisions + validation strategy | Surface to the manager | Package |
| 6b | Manager | Package | Run the active runtime's user-decision primitive | User decision |
| 6c | User | Package | Approve or request iteration | Approved set, or revise instruction |

**Outputs**

- Approved scenario set
- Approved implementation checklist (every item anchored to a confirmed internal or external insight)
- Approved **design decision list** — directional choices (library / framework / design pattern / API shape / persistence model / error-handling strategy / etc.) with rationale anchored to a confirmed insight, plus a validation method per decision. Detailed mechanism (function signatures, internal logic, file-level structure) is deferred to Execution.

---

## WORK Phase

**Purpose**
Persist every DISCUSSION decision into durable session artifacts — the working draft, **staged** reference files for every confirmed external research insight, **staged** backlog entries for everything deferred — so the loop's decisions survive into session record. A **documentation pass plus session-record staging**: no new design content, every decision was approved during DISCUSSION. (Internal insights do not stage as reference files; they live in the Decisions Log and design rationale.) Memory is **not** written here; Wrap-up promotes staged artifacts to `features/{feature-name}/...` after the session completes.

**Inputs**
- DISCUSSION outputs (approved drafts captured in the parent transcript)
- Reference promotion list from Sub-step C
- Backlog decision list from Sub-step B
- Existing session directory tree at `sessions/{date}-{session-id}/1-ideation/` (bootstrapped by the manager)

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | DISCUSSION outputs (in parent transcript); required-sections template | Write the working draft using the required-sections template | `sessions/{date}-{session-id}/1-ideation/working/draft-iter{n}.md` |
| 2 | Leader | Reference promotion list (Sub-step C output) | For each external insight, stamp the [`references.md`](../memory/templates/references.md) template at `sessions/{date}-{session-id}/1-ideation/staging/references/{slug}.md` — fill `title`, `source`, `type`, `accessed`, `session`, `tags`, Insight, Why-it-applies, Source, and Excerpt (if applicable). Skip duplicates with reason in the Decisions Log | One staged reference file per insight |
| 3 | Leader | Backlog decision list (Sub-step B output) | Stamp the [`backlogs.md`](../memory/templates/backlogs.md) template at `sessions/{date}-{session-id}/1-ideation/staging/backlogs/feature/{slug}.md` (task backlog) and `sessions/{date}-{session-id}/1-ideation/staging/backlogs/project/{slug}.md` (feature backlog) | Staged backlog files |
| 4 | Leader | All DISCUSSION user-decision outcomes from transcript | Stamp the Decisions Log section in the working draft — summarize forcing-question answers, scope confirmation, contribution-point answers, scenarios / checklist / design approvals, reference and backlog decisions | Populated Decisions Log |
| 5 | Leader | Working draft + staged references + staged backlogs | Verify the WORK exit checklist | Completion signal, or gap surfaced to the manager |

**Outputs**

- `sessions/{date}-{session-id}/1-ideation/working/draft-iter{n}.md` — canonical working draft, stamped to the required-sections template below
- `sessions/{date}-{session-id}/1-ideation/staging/references/{slug}.md` — staged; one file per confirmed Sub-step C **external** insight (zero only if external research produced no insights — record the reason in Decisions Log). Wrap-up promotes these to `features/{feature-name}/references/`
- `sessions/{date}-{session-id}/1-ideation/staging/backlogs/feature/{slug}.md` — staged; zero or more (task backlog within the picked feature). Wrap-up promotes to `features/{feature-name}/backlogs/`
- `sessions/{date}-{session-id}/1-ideation/staging/backlogs/project/{slug}.md` — staged; zero or more (deferred features). Wrap-up promotes to project-level `backlogs/`

Required-sections template for the working draft:

```markdown
## Scope Contract
{Sub-step B output: Project / Feature / Task / In scope / Out of scope}

## Framed Problem
{Sub-step A output per the Framed Problem template: root cause + impact + success criteria + prior attempts + counterfactual + re-framing conclusion}

## Research Insights
{Sub-step C output: confirmed internal + external insights with Source / Insight / Why. External insights link to their staged `sessions/{date}-{session-id}/1-ideation/staging/references/{slug}.md`; internal insights are inline.}

## Scenarios
{Sub-step D output: golden / edge / failure / (adversarial) scenarios}

## Implementation Checklist
{Sub-step D output: per scenario, anchored items}

## Design
{Sub-step D output: directional design decisions (library / pattern / API shape / etc.) with rationale anchored to insights + validation strategy. Detailed mechanism deferred to Execution.}

## Decisions Log
{Summary of user choices made through the active runtime's user-decision primitive during DISCUSSION, plus the reference and backlog promotion log}
```

**Exit checklist**
- [ ] Working draft has all 7 required sections populated, no `TODO` / `TBD` / `<...>` placeholders
- [ ] Every Sub-step C external insight has a corresponding `sessions/{date}-{session-id}/1-ideation/staging/references/{slug}.md` (or a skip reason logged in Decisions Log)
- [ ] Every Sub-step B deferred decision has a backlog entry at the correct level
- [ ] Decisions Log cites every user-decision outcome
- [ ] No content beyond what was approved in DISCUSSION

### WORK discipline

- **No new content.** WORK does not introduce decisions the user did not approve in DISCUSSION. If a gap surfaces during persistence, raise it to the manager — re-entering DISCUSSION is preferred over silent invention.
- **Cite the discussion.** Each section's content must be traceable to a DISCUSSION exchange in the parent transcript. The Decisions Log makes this explicit.
- **Stay terse.** The working draft is a record of decisions, not a re-derivation. Reasoning and alternatives live in transcripts; the artifact is the conclusion.

---

## EVALUATION Phase

**Purpose**
Find the problems WORK missed. Two independent systems (Claude Code + Codex) evaluate the artifact across all seven perspectives + Overall; the manager reconciles their findings and produces a single `PASS` / `REVISE` / `FAIL` verdict. Every verdict advances to RECORD so each iteration's evidence is preserved; only the post-RECORD transition differs (`PASS` exits the loop, `REVISE` re-enters DISCUSSION, `FAIL` escalates through the active runtime's user-decision primitive).

See [evaluation skill](../evaluation/SKILL.md) for the full Stage 0 / 1 / 2 / 3 procedure, and [`orchestration/workflow/evaluation.md`](../orchestration/workflow/evaluation.md) for the manager's spawn / reconciliation orchestration.

**Inputs** (consumed from the WORK phase output)
- `sessions/{date}-{session-id}/1-ideation/working/draft-iter{n}.md`
- `sessions/{date}-{session-id}/1-ideation/staging/references/{slug}.md` files just staged in WORK
- `sessions/{date}-{session-id}/1-ideation/staging/backlogs/{feature,project}/{slug}.md` files just staged in WORK
- The locked Scope Contract (for scope-creep checks)
- The discussion log (manager-captured user-decision exchanges, for decisions traceability)

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Manager | WORK outputs (working draft + references + backlogs); Scope Contract; discussion log | Spawn one evaluator per system (Claude Code + Codex); each handles all seven perspectives + Overall sequentially | Two evaluator agent instances |
| 2 | Evaluator | All step-1 inputs | Run the four-stage procedure (Stage 0 Target Understanding → Stage 1 Scenario-Checklist Frame Build → Stage 2 Per-Perspective Sequential Evaluation → Stage 3 Overall) per `evaluation/SKILL.md` | `evaluation/iter{n}/{claude,codex}/{perspective}.md` + `evaluation/iter{n}/{claude,codex}/overall.md` |
| 3a | Manager | Both systems' per-perspective files | Cross-system reconciliation: pessimistic union of findings; severity-gated divergence handling | Reconciled findings + per-perspective verdicts |
| 3b | Manager | Major divergence (if any) | Run the active runtime's user-decision primitive | (skipped if no major divergence) |
| 3c | User | Divergence question | Decide which verdict to honor | User-confirmed verdict |
| 4 | Manager | Reconciled findings + verdicts | Record aggregated verdict: `PASS` / `REVISE` / `FAIL`. **All verdicts advance to RECORD first** (so each iteration preserves a transcript + iter entry in `session.json` regardless of outcome). After RECORD, `PASS` exits the loop with the loop's `outputs/`; `REVISE` re-enters DISCUSSION (iter increments; findings — `scenario_gap` / `checklist_gap` / `design_flaw` / `assumption_risk` — feed into the next DISCUSSION as input); `FAIL` escalates through the active runtime's user-decision primitive — manager presents options: (a) **revise** (accept as a REVISE re-entry if budget allows), (b) **abort ideation** (exit without a deliverable; document findings in RECORD), or (c) **accept with deferral** (accept the artifact as-is with deferral of the unevaluable finding to the backlog, user assumes responsibility) | Workflow-state verdict |

**FAIL semantics for Ideation**: a `FAIL` verdict occurs when the artifact is unevaluable per the evaluation skill's W/W/H gate (Critical/75+ finding with no clear path to resolution by iteration alone) or when the evaluator's per-perspective aggregation yields a `FAIL` from a Critical finding at ≥ 75 confidence. Unlike `REVISE`, `FAIL` signals the artifact is **not improvable** by running another DISCUSSION iteration without a structural change to the framing or scope — the manager must escalate to the user to choose a resolution path. The three options above mirror the same FAIL escalation pattern used by Planning and Execution.

**Outputs**
- `sessions/{date}-{session-id}/1-ideation/evaluation/iter{n}/{claude,codex}/{perspective}.md` — one file per system × perspective
- Aggregated verdict recorded in workflow state (cross-system divergence is derived by comparing the per-system files at RECORD; no separate divergence file is written)

**Exit checklist**
- [ ] Both systems produced per-perspective files for every selected perspective
- [ ] Verdict aggregated and recorded; `REVISE` increments the iteration counter, `PASS` and `FAIL` advance to RECORD

---

## RECORD Phase

**Purpose**
Persist every iteration's evidence into session record, and — on the final `PASS` iteration — also emit the loop.s `outputs/` and stage typed-finding artifacts. RECORD runs after **every** EVALUATION (whether the verdict is `REVISE`, `PASS`, or `FAIL`) so each iteration leaves a durable audit trail before the loop either restarts, completes, or escalates. Memory is **not** written here; Wrap-up handles session → project promotion after the workflow completes.

See [record skill](../record/SKILL.md) for template-stamping conventions, and [`orchestration/workflow/record.md`](../orchestration/workflow/record.md) for the manager's spawn / collect orchestration.

**Inputs**
- `sessions/{date}-{session-id}/1-ideation/working/draft-iter{n}.md` — current iteration's WORK output
- `sessions/{date}-{session-id}/1-ideation/evaluation/iter{n}/{claude,codex}/{perspective}.md` (cross-system divergence derived by comparing these per-perspective files)
- `session.json.transcriptPath` (tilde-expand `$HOME` on read) — manager-stamped transcript path; use `$CLAUDE_TRANSCRIPT_PATH` if reading directly from env. Claude Code transcript jsonl for the iteration window
- `sessions/{date}-{session-id}/1-ideation/working/discussion-log.md` — manager-captured user-decision exchanges
- EVALUATION verdict for this iteration (`PASS` / `REVISE` / `FAIL`)

**Procedure**

| # | When | Agent | Operation | Source | Target | Action |
|---|---|---|---|---|---|---|
| 1 | every iter | Assistant | **CREATE** | `session.json.transcriptPath` (tilde-expand `$HOME` on read; `$CLAUDE_TRANSCRIPT_PATH` if reading directly from env) | `sessions/{date}-{session-id}/transcripts/{role}-{agentId}.jsonl` | Copy each agent.s raw transcript into the single session-root `transcripts/` dir — one immutable `{role}-{agentId}.jsonl` per agent run, accumulating across all loops by distinct `agentId`. No per-loop or per-iter snapshot. See [`orchestration/templates/session-tree.md` § Transcript rules](../orchestration/templates/session-tree.md) |
| 2 | every iter | Assistant | **UPSERT** | This iteration's verdict + iter number | `sessions/{date}-{session-id}/session.json` | Upsert (insert-or-replace) `workflow.ideation.iterations[]` entry keyed by `iter` with full schema `{iter, verdict, finishedAt, evaluation_dir: "evaluation/iter{n}/"}`. Idempotent on re-run: re-running RECORD on the same iter overwrites the entry, never appends a duplicate. Preserve all prior fields. Do **not** set `workflow.ideation.finishedAt` (loop-level) yet — that's PASS-only, Step 8 |
| 3 | every iter | Assistant | **GUARD** | This iteration's verdict | — | If verdict is `REVISE`: stop here. The loop re-enters DISCUSSION with this iter's evaluator findings as input. Steps 4–10 are skipped because there is no canonical artifact yet. If verdict is `FAIL`: stop here. The manager escalates through the active runtime's user-decision primitive (revise / abort-ideation / accept-with-deferral per the EVALUATION phase procedure); Steps 4–10 are skipped. If verdict is `PASS`: continue |
| 4 | PASS only | Assistant | **CREATE** | Working draft + both systems' evaluator findings + discussion log + cross-system divergence (derived by comparing per-system files) | `sessions/{date}-{session-id}/1-ideation/outputs/` | Integrate sources into canonical artifact per the required-sections template. Include cross-system divergence summary in the Evaluation summary section. This is the Planning Loop's briefing source |
| 5 | PASS only | Assistant | **CREATE** | All typed findings (cumulative across iters 1..n) | `sessions/{date}-{session-id}/1-ideation/staging/{type}/{slug}.md` per the deterministic Type + Domain routing in [`evaluation/SKILL.md` § Finding Metadata](../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity) | One staged file per finding, stamped to the matching template. **No shortcut routing** — every Type + Domain combination uses the canonical table; `general/general` is a contract violation |
| 6 | PASS only | Assistant | **CREATE** | Canonical draft Design section | `sessions/{date}-{session-id}/1-ideation/staging/design/{slug}.md` | Per design topic, stamped to the design template |
| 7 | PASS only | Assistant | **CREATE** | discussion-log substantive topics | `sessions/{date}-{session-id}/1-ideation/staging/discussions/{slug}.md` | Per substantive user-decision topic, stamped to the discussions template |
| 8 | PASS only | Assistant | **UPDATE** | Loop completion | `sessions/{date}-{session-id}/session.json` | Set `workflow.ideation.finishedAt`, set `workflow.ideation.verdict: PASS`, preserve `iterations[]` history |

**Finding routing** — see [`evaluation/SKILL.md` § Finding Metadata](../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity) for the complete Type + Domain → staging-subdir routing table. Ideation RECORD applies the routing table without improvisation; all destinations are session staging (Wrap-up moves them to memory).

**Cumulative staging across iterations**: when iter `n` reaches `PASS`, RECORD stages the **union** of (a) all `disposition: addressed` and `disposition: open` findings from this iter, and (b) all `disposition: addressed` and `disposition: open` findings carried forward from iter 1..n-1 (sourced by reading prior iter per-perspective files at `sessions/.../1-ideation/evaluation/iter{m}/{system}/{perspective}.md` for m < n). `disposition: superseded` findings stage to `staging/decisions/` with a `supersedes:` field. `disposition: disputed` findings stage to `staging/decisions/` with the dispute rationale. This guarantees no `PASS`-iter staging silently drops earlier-iter constructive findings.

**Idempotency for CREATE operations**: all CREATE steps below write-or-overwrite the target file path. The path is deterministic per iter / per finding slug, so re-running RECORD on the same iter produces the same files with identical content. Slug collisions follow the rule in `evaluation/SKILL.md` § Slug + collision policy.

**Discussion-log lifecycle** *(Ideation-specific documentation)*: `sessions/.../1-ideation/working/discussion-log.md` is created by the **manager** (DISCUSSION live) and appended after each user-decision exchange — one section per exchange with format `## YYYY-MM-DD HH:MM — Q: ... | A: ... | Decision: ...`. REVISE iterations preserve the prior discussion-log; new iter exchanges are appended in chronological order in the same file. RECORD reads this file at Step 1 (input load) and Step 7 (discussions staging); RECORD never writes to discussion-log. All five workflow loops use the same discussion-log pattern; this is the canonical description. Loops that defer to "manager-captured user-decision exchanges" in their RECORD procedure follow the same mechanics without re-specifying them.

**Outputs**

Every iteration produces:
- `sessions/{date}-{session-id}/transcripts/{role}-{agentId}.jsonl` — preserved transcript
- `sessions/{date}-{session-id}/session.json` — appended `iterations[]` entry with this iter's verdict

Only the `PASS` iteration also produces:
- `sessions/{date}-{session-id}/1-ideation/outputs/` — canonical artifact (Planning Loop input)
- `sessions/{date}-{session-id}/1-ideation/staging/{scenarios,checklists,decisions,references,design,discussions}/{slug}.md` — staged session artifacts for Wrap-up to promote
- `sessions/{date}-{session-id}/session.json` — `workflow.ideation.finishedAt` and final `verdict: PASS` set

**Exit checklist**

Every iteration:
- [ ] Each agent transcript copied to session-root `transcripts/{role}-{agentId}.jsonl`
- [ ] `session.json.workflow.ideation.iterations[]` includes this iter's `{iter, verdict, finishedAt, evaluation_dir: "evaluation/iter{n}/"}` (full schema; do not omit `evaluation_dir`)
- [ ] No writes to memory

`PASS` iteration additionally:
- [ ] Canonical `1-ideation/outputs/` written and matches the required-sections shape
- [ ] Every evaluator finding staged to the correct `staging/` destination per finding type
- [ ] Design / discussions derivables staged under `staging/`
- [ ] `session.json.workflow.ideation.finishedAt` and final `verdict: PASS` set

---

## Output paths

All writes during the Ideation Loop are **session-scoped**. Wrap-up promotes the `staging/` directory to memory after the workflow completes — see [wrap-up skill](../wrap-up/SKILL.md).

**Path conventions**

- `{date}` — the session start date in `YYYY-MM-DD` format
- `{session-id}` — runtime session ID resolved by the manager during Configuration. Use `CLAUDE_CODE_SESSION_ID` for Claude Code and `CODEX_THREAD_ID` for native Codex. Do NOT read runtime env vars from spawned subagents for this value; use the parent session id supplied by the manager.
- `{feature-name}` — feature slug (only used by Wrap-up when promoting to memory; not used inside session paths)
- `{slug}` — slug for a specific artifact, set by the writer at stage time

| Path | Written by | Written |
|---|---|---|
| `sessions/{date}-{session-id}/1-ideation/working/draft-iter{n}.md` | leader (WORK) | every iteration |
| `sessions/{date}-{session-id}/1-ideation/staging/references/{slug}.md` | leader (WORK) | per confirmed Sub-step C external insight |
| `sessions/{date}-{session-id}/1-ideation/staging/backlogs/feature/{slug}.md` | leader (WORK) | per Sub-step B task-backlog decision |
| `sessions/{date}-{session-id}/1-ideation/staging/backlogs/project/{slug}.md` | leader (WORK) | per Sub-step B feature-backlog decision |
| `sessions/{date}-{session-id}/1-ideation/evaluation/iter{n}/{claude,codex}/{perspective}.md` | evaluator (EVALUATION) | one per system × perspective |
| `sessions/{date}-{session-id}/transcripts/{role}-{agentId}.jsonl` | assistant (RECORD) | per iter — preserved transcript window |
| `sessions/{date}-{session-id}/1-ideation/outputs/` | assistant (RECORD) | once per loop, integrating working draft + evaluator findings + cross-system divergence summary |
| `sessions/{date}-{session-id}/1-ideation/staging/scenarios/{slug}.md` | assistant (RECORD) | per `scenario_gap` finding |
| `sessions/{date}-{session-id}/1-ideation/staging/checklists/{slug}.md` | assistant (RECORD) | per `checklist_gap` finding |
| `sessions/{date}-{session-id}/1-ideation/staging/decisions/{slug}.md` | assistant (RECORD) | per `design_flaw` / `assumption_risk` finding |
| `sessions/{date}-{session-id}/1-ideation/staging/design/{slug}.md` | assistant (RECORD) | per design topic |
| `sessions/{date}-{session-id}/1-ideation/staging/discussions/{slug}.md` | assistant (RECORD) | per substantive user-decision topic |
| `sessions/{date}-{session-id}/1-ideation/staging/references/{slug}.md` (supplementary) | assistant (RECORD) | per `general` finding with citable external pattern (atop WORK-staged) |
| `sessions/{date}-{session-id}/session.json` | assistant (RECORD) | loop completion timestamps, iter, verdict |

The session directory tree at `sessions/{date}-{session-id}/1-ideation/{working,staging,evaluation}/` is bootstrapped by the manager at Sub-step B Lock Scope. WORK and RECORD assume the tree exists on entry and surface an error to the manager if it does not. Feature directories under `features/{feature-name}/...` are **not** touched during Ideation; Wrap-up creates them as needed during memory promotion.

---

## Constraints

- Never bring opinion to DISCUSSION without research backing it — opinions without evidence dilute the discussion.
- Never make a What / Why / How decision unilaterally — the manager and user approve every choice through the active runtime's user-decision primitive.
- Never expand scope during WORK — out-of-scope items go to backlog or re-enter DISCUSSION.
- Never silently drop a Sub-step C external insight in WORK — stage it at `sessions/{date}-{session-id}/1-ideation/staging/references/{slug}.md` or log the skip reason in the Decisions Log.
- Never write to memory (`features/{feature-name}/...` or top-level `backlogs/`) during Ideation — all writes are session-scoped under `sessions/{date}-{session-id}/1-ideation/`. Wrap-up handles session → project promotion.
- Always cite sources for research insights and anchor every checklist item to a confirmed internal or external insight.
- Always specify a validation method for every design decision.
- Always disagree when you disagree — surface technical conflicts with evidence.
