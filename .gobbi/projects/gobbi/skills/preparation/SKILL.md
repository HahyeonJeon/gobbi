---
name: preparation
description: MUST load for Preparation. Checks memory and workspace skills against locked Ideation and stages approved gap fixes.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion
---

# Preparation

Skill for the **Preparation Loop**. Defines what each of the four phases (DISCUSSION → WORK → EVALUATION → RECORD) does, which agent owns it, what inputs it consumes, and what artifacts it produces. Loaded by every agent participating in the loop — the manager for orchestration context, and each specialist for the procedural contract of the phase it owns.

The Preparation Loop runs **between Ideation and Planning**. Its job is to verify that memory and the workspace skill set are **ready** for the planning and execution that follow. If Ideation's locked design calls for TypeScript work, does the project's TypeScript-conventions skill exist? If Ideation produced scenarios, did the prior RECORD actually stage them? Any missing item that would block downstream work is surfaced; the user decides how to close the gap before Planning starts.

The leader's role spans **both** DISCUSSION and WORK — same shape as Ideation. The assistant owns RECORD (loaded via [`record/SKILL.md`](../record/SKILL.md)). The evaluator owns EVALUATION (loaded via [`evaluation/SKILL.md`](../evaluation/SKILL.md)).

The manager's orchestration of the Preparation Loop (when to spawn each specialist, perspective selection for EVALUATION, RECORD delegation, ITER/EXIT decision including the `RE-IDEATE` upstream re-entry) is in [`orchestration/workflow/preparation.md`](../orchestration/workflow/preparation.md).

---

## Memory Access Matrix

The agent in the leader role MUST observe these tier boundaries. The only write surfaces are the loop's own session subdirectories.

| Memory tier | Path root | Access from leader role |
|---|---|---|
| **Session record — own loop working** | `sessions/{date}-{session-id}/2-preparation/working/` | **READ + WRITE** — leader drafts, scan outputs, transcripts |
| **Session record — own loop staging** | `sessions/{date}-{session-id}/2-preparation/staging/{scenarios,checklists,decisions,references,design,discussions,skills,backlogs/{feature,project}}/` | **READ + WRITE (WORK only)** — approved gap fixes stage here per the routing table; Wrap-up promotes to memory |
| **Session record — prior loop (Ideation)** | `sessions/{date}-{session-id}/1-ideation/{outputs,staging}/` | **READ-ONLY** — required input for readiness scanning; the artifacts are the locked design and Scope Contract |
| **Session record — `session.json`** | `sessions/{date}-{session-id}/session.json` | **FORBIDDEN** — the leader never reads or writes session.json; the manager owns it (iter `n` is supplied as an input) |
| **Feature memory** | `.gobbi/projects/{project-name}/features/{feature-name}/` | **READ-ONLY** — required for readiness scanning (existing scenarios / checklists / design / mistakes). Never written; Wrap-up owns feature-memory writes |
| **Memory** | `.gobbi/projects/{project-name}/{mistakes,rules,design,notes,backlogs,references,decisions,plans,reviews,reports,learnings,archive,skills}/` | **READ-ONLY** — required for readiness scanning (project skills, mistakes, rules). Never written; Wrap-up owns memory writes |

**Delete semantics**: the leader NEVER deletes any file in any tier. Supersession is recorded via frontmatter (`status: superseded`, `superseded_by:`); physical deletion is forbidden. Once an artifact reaches a terminal state, Wrap-up moves the full file (`git mv`) to `archive/{type}/` per the move-on-terminal model — never deletes it.

**Write enforcement**: any write attempted outside the WRITE rows above is a constraint violation. Code attempting writes to memory or feature memory must be revoked and Preparation restarted with a corrected scope.

---

## Core Principles

Cross-cutting principles for every agent participating in this loop.

> **Fail fast on gaps.**

Preparation exists to prevent downstream loops from running on incomplete inputs. A missing project skill discovered in Planning forces a Planning REVISE, which is more expensive than catching it here. Surface every gap; never silently work around them.

> **The leader proposes; the user decides.**

For each gap, the leader **proposes** a resolution (`generate-now` / `defer` / `re-ideate` / `skip`). The manager presents proposals through the active runtime's user-decision primitive and the user chooses. The leader does not autonomously create skills or memory entries — only the user approves what gets generated, and even then writes go to session staging, not memory.

> **Disagree when you disagree.**

If the Ideation output has a contradiction or gap that makes Preparation impossible (e.g., the Scope Contract references a feature directory that does not exist and cannot be bootstrapped), surface it explicitly with evidence and recommend `re-ideate` rather than papering over. Technical correctness is the leader's authority.

> **Stay in scope.**

Preparation only verifies readiness for the **current** Ideation-locked task. Project-wide gaps that exist but are unrelated to this task are recorded in the canonical draft's "Out of scope gaps" section — they are not acted on this loop. Backlog the unrelated items; do not absorb them.

> **Staging, not direct promotion — except for generated skills promoted before Planning.**

All gap fixes that execute during WORK write to session staging at `sessions/{date}-{session-id}/2-preparation/staging/{type}/{slug}.md`. Wrap-up promotes staging → memory after the workflow completes.

**Exception — generated skills:** when a `generate-now` decision produces a project-specific skill, that skill is **promoted to memory before Planning starts**. This is a narrow, user-approved exception to the sole-writer rule: Planning and Execution must be able to load the generated skill from `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` in-session — if promotion waits until Wrap-up, in-session consumers are left without the skill. Promotion path: on EVALUATION PASS, copy `sessions/{date}-{session-id}/2-preparation/staging/skills/{slug}/SKILL.md` → `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` (lazy parent dir creation). The manager owns this copy step as part of the Preparation ITER/EXIT → Planning transition. All other staging types remain Wrap-up-only.

**Commit-on-branch (worktree sessions only):** after the copy step, the manager (or proxied executor) runs:

1. `git -C "$worktreePath" add <relative-paths>` — stage the skill body and both symlinks.
2. Commit with the subject + required `AI-Provenance-Record:` trailer (per `git/conventions.md:118`) in a single invocation using a heredoc so the trailer actually lands in the commit body:

   ```
   git -C "$worktreePath" commit -m "$(cat <<'EOF'
   chore(skills): promote {slug} generated by preparation iter{n}

   AI-Provenance-Record: gobbi://session/{session-id}/task/preparation-promote-now-iter{n}
   EOF
   )"
   ```

   `{slug}` / `{session-id}` / `{n}` are substituted from session state. Verify the trailer landed with `git -C "$worktreePath" log -1 --format=%B` before proceeding.

This commit lands on the worktree branch and is absorbed into the PR at merge.

**Rollback (commit failure):** if `git commit` fails after the file copy, the manager MUST run `git -C "$worktreePath" rm <copied-paths>` to remove the copied file from the worktree (not `git checkout` — the file did not exist before the copy, so removal is the correct inverse), then surface the failure to the user through the active runtime's user-decision primitive (re-attempt or abort) before retrying.

> **NEEDS_CONTEXT escalation.**

This loop's DISCUSSION phase is manager-direct (the manager uses the active runtime's user-decision primitive when user input is needed); subagents do not run DISCUSSION here. NEEDS_CONTEXT escalation primitive applies to subagents during the WORK phase only — the leader returns NEEDS_CONTEXT in its final report; the manager handles the user-question block per `discussion/SKILL.md`. See `agents/leader.md` § Status Contract for the leader's NEEDS_CONTEXT pattern.

---

## DISCUSSION Phase

**Purpose**
Verify readiness of memory and workspace skills against the locked Ideation output, identify every gap that would block Planning / Execution / EVALUATION, and lock a user-approved gap-resolution plan. Each sub-step pushes the readiness picture toward concreteness — by the end of DISCUSSION, every gap has a binding resolution decision recorded.

**Inputs**
- `sessions/{date}-{session-id}/1-ideation/outputs/` (canonical, just produced by Ideation RECORD)
- `sessions/{date}-{session-id}/1-ideation/staging/` (everything Ideation staged for Wrap-up to promote, but not yet promoted)
- Memory: `.gobbi/projects/{project-name}/features/{feature-name}/{scenarios,checklists,decisions,design,mistakes,plans,references}/`
- Memory: `.gobbi/projects/{project-name}/{mistakes,rules,design,skills,notes}/`
- Workspace skills under the active runtime's skill root (`.claude/skills/` in Claude Code, `.agents/skills/` in Codex), when discoverable
- On `REVISE` iterations: prior iteration's evaluator findings — the leader reads cited issues before re-engaging the user

**Procedure**
Run sub-steps A → B → C → D in order. Each sub-step's procedure block is below.

**Outputs**
- Readiness signal list — files / domains / perspectives downstream loops will need
- Design + memory gap list — each item with name, severity, proposed resolution
- Execution skills gap list — each missing project-specific skill with proposed resolution
- Locked gap-resolution plan (user-approved): per gap, one of `generate-now` / `defer` / `re-ideate` / `skip`
- Discussion log (manager-captured user-decision exchanges)

**Exit checklist**
- [ ] All four sub-steps (A–D) completed
- [ ] Every identified gap has a user-locked resolution
- [ ] No `re-ideate` decisions remain unrouted (a `re-ideate` halts Preparation and re-enters Ideation; the manager owns the routing)
- [ ] Discussion log captures every gap-resolution user-decision outcome

---

### Sub-step A — Read Ideation Output

**Purpose**
Read the locked Ideation output end-to-end, extract a readiness signal list of what downstream loops will need, and surface any Ideation-output contradictions before scanning memory.

**Inputs**
- `sessions/{date}-{session-id}/1-ideation/outputs/` — every file
- `sessions/{date}-{session-id}/1-ideation/staging/` — references, backlogs, scenarios, checklists, decisions, design, discussions
- Existing feature directory at `.gobbi/projects/{project-name}/features/{feature-name}/` (the feature named in the Scope Contract)

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Ideation artifacts | Read every file in `1-ideation/outputs/` (framed problem, scope contract, design decisions, scenarios, checklist, decisions log, memory-reads register) | Loaded Ideation context |
| 2 | Leader | Loaded context + Scope Contract | Confirm the feature directory referenced in the Scope Contract exists (or is plausibly bootstrappable by Wrap-up) | Feature directory status |
| 3 | Leader | Loaded context | Extract the **readiness signal list**: (a) files / subsystems the design will touch → execution skills needed; (b) scenarios / checklist items expected at feature memory → memory completeness; (c) decisions / conventions referenced but not yet recorded → memory completeness | Readiness signal list |
| 4 | Leader | Readiness signal list + Ideation context | Identify any Ideation-output contradictions that block Preparation (e.g., the design references an undefined component, the Scope Contract names a feature directory that cannot be created) | Contradiction findings (zero or more) |
| 5a | Leader | Steps 3–4 | Surface to the manager: readiness signal list + any contradictions | Findings package |
| 5b | Manager | 5a | Confirm Ideation output is sound enough to proceed through the active runtime's user-decision primitive | User confirmation |
| 5c | User | Confirmation prompt | Approve advance, OR direct re-Ideate | Decision |

**Outputs**
- Readiness signal list — files / domains / perspectives downstream loops will need (consumed by Sub-steps B and C)
- Contradiction findings — empty on the happy path; non-empty cases trigger `re-ideate` discussion in Sub-step D

---

### Sub-step B — Design + Memory Readiness Check

**Purpose**
Verify that every artifact the downstream loops will read is staged or already in memory. Surface every missing item as a gap with severity and proposed resolution.

**Inputs**
- Readiness signal list (Sub-step A output)
- `sessions/{date}-{session-id}/1-ideation/staging/` — everything Ideation staged
- Feature memory at `.gobbi/projects/{project-name}/features/{feature-name}/{scenarios,checklists,decisions,design,mistakes}/`
- Memory at `.gobbi/projects/{project-name}/{mistakes,rules,design}/`

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Readiness signal list | Verify `sessions/{date}-{session-id}/1-ideation/staging/design/` contains a design file per substantive design topic from the Ideation Sub-step D output | Design-staging gap list |
| 2 | Leader | Readiness signal list | Verify `sessions/{date}-{session-id}/1-ideation/staging/scenarios/` has every `scenario_gap` finding's scenario from Ideation EVALUATION | Scenario-staging gap list |
| 3 | Leader | Readiness signal list | Verify `sessions/{date}-{session-id}/1-ideation/staging/checklists/` has every implementation checklist item, anchored to its scenario | Checklist-staging gap list |
| 4 | Leader | Readiness signal list | Verify `sessions/{date}-{session-id}/1-ideation/staging/decisions/` has records for every substantive choice in the discussion log + every `design_flaw` / `assumption_risk` finding | Decisions-staging gap list |
| 5 | Leader | Readiness signal list | Verify accessible feature mistakes at `.gobbi/projects/{project-name}/features/{feature-name}/mistakes/` and project mistakes at `.gobbi/projects/{project-name}/mistakes/` cover the domains the design will touch | Mistakes-readiness gap list |
| 6 | Leader | Aggregated gap lists from steps 1–5 | For each gap: record name + severity (would this gap block Planning / Execution / EVALUATION?) + proposed resolution (`generate-now` if RECORD skipped a write; `re-ideate` if a design choice is missing; `skip` if not in scope) | Design + memory gap list |
| 7a | Leader | Gap list | Surface to the manager | Findings package |
| 7b | Manager | 7a | Defer per-gap decision to Sub-step D | (no decision yet) |

**Outputs**
- Design + memory gap list — feeds into Sub-step D's consolidated resolution plan

---

### Sub-step C — Execution Skills Readiness Check

**Purpose**
Identify the project-specific skills an executor would need for the planned work, scan for their existence, and propose resolutions for any missing skill.

**Inputs**
- Readiness signal list (Sub-step A output) — files / domains the design will touch
- `.gobbi/projects/{project-name}/skills/` — project-specific skills inventory
- Active runtime skill root — `.claude/skills/` in Claude Code, `.agents/skills/` in Codex (when accessible)

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Readiness signal list | For each file / domain, enumerate the skills an executor would need to load — workspace-level (language / runtime) + project-specific (`{project-name}-typescript-conventions`, `{project-name}-testing`, etc.) | Required skills list |
| 2 | Leader | Required skills list | Scan `.gobbi/projects/{project-name}/skills/` for project-specific entries; check the active runtime's workspace skill root for workspace-level entries where accessible | Skills coverage report |
| 3 | Leader | Coverage report | For each missing project-specific skill: propose `generate-now` (trigger the [interview skill](../interview/SKILL.md)'s wave codification flow) / `defer` (Planning notes the gap; Execution consults code patterns directly) / `re-ideate` (the gap reveals the design itself is unworkable without the skill) | Execution skills gap list |
| 4a | Leader | Gap list | Surface to the manager | Findings package |
| 4b | Manager | 4a | Defer per-gap decision to Sub-step D | (no decision yet) |

**Outputs**
- Execution skills gap list — feeds into Sub-step D's consolidated resolution plan

---

### Sub-step D — Gap Resolution Plan

**Purpose**
Consolidate every gap from Sub-steps B and C into a single user-approved table, with one resolution decision per gap. Any `re-ideate` decision halts Preparation and re-enters the Ideation Loop.

**Inputs**
- Design + memory gap list (Sub-step B output)
- Execution skills gap list (Sub-step C output)
- Any contradiction findings from Sub-step A (these are effectively `re-ideate` candidates)

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | All gap lists | Consolidate into a single table — name, category (design / memory / skill), severity, proposed resolution | Consolidated gap table |
| 2a | Leader | Table | Surface to the manager | Findings package |
| 2b | Manager | Table | Run the active runtime's user-decision primitive per row | User decisions |
| 2c | User | Per-row question | Pick one of `generate-now` / `defer` / `re-ideate` / `skip` per gap | Locked decisions |
| 3 | Leader | Locked decisions | Record the resolution map as a binding constraint for WORK | Gap-resolution plan |
| 4 | Manager | Resolution plan | If any decision is `re-ideate`: halt Preparation, record the trigger in the discussion log, re-enter the Ideation Loop per the orchestration doc's RE-IDEATE routing | (Preparation halt if applicable) |

**Outputs**
- Locked gap-resolution plan — every gap with a user-approved resolution; consumed by WORK
- (If `re-ideate`) — Preparation halt signal; the manager re-routes upstream

---

## WORK Phase

**Purpose**
Persist the DISCUSSION outputs into a session draft and execute every `generate-now` decision as a staging write. Staging writes target `sessions/{date}-{session-id}/2-preparation/staging/{type}/{slug}.md`; Wrap-up promotes staging → memory after the workflow completes. WORK does NOT write directly to memory.

**Inputs**
- DISCUSSION outputs (approved gap-resolution plan + readiness signal list, all captured in the parent transcript)
- Existing session directory tree at `sessions/{date}-{session-id}/2-preparation/{working,staging,evaluation}/` (bootstrapped by the manager)
- Stamping templates: [`interview/templates/project-skill.md`](../interview/templates/project-skill.md) (for `generate-now` on skills), [`memory/templates/`](../memory/templates/) (for scenarios / checklists / decisions / etc.)

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | DISCUSSION outputs; required-sections template | Write the working draft using the required-sections template | `sessions/{date}-{session-id}/2-preparation/working/draft-iter{n}.md` |
| 2 | Leader | `generate-now` decisions where the gap is a missing project-specific skill | For each: stamp the full [`interview/templates/project-skill.md`](../interview/templates/project-skill.md) at `sessions/{date}-{session-id}/2-preparation/staging/skills/{slug}/SKILL.md`. Wrap-up promotes to `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` | One staged skill directory per approved generation |
| 3 | Leader | `generate-now` decisions where the gap is a missed memory promotion (scenario / checklist / decision / etc.) | For each: stamp the matching template from [`memory/templates/`](../memory/templates/) at `sessions/{date}-{session-id}/2-preparation/staging/{type}/{slug}.md` | One staged file per missed promotion |
| 4 | Leader | `defer` decisions | Record in the draft's "Out of scope gaps" section with severity + pointer; no staging write | Deferred list captured |
| 5 | Leader | `skip` decisions | Record in the draft's "Decisions log" section with the user's stated reason; no staging write | Skipped list captured |
| 6 | Leader | All DISCUSSION user-decision outcomes from transcript | Stamp the Decisions Log section — summarize per-gap resolutions, contradictions discussed, advance confirmation | Populated Decisions Log |
| 7 | Leader | Working draft + staged artifacts | Verify the WORK exit checklist | Completion signal, or gap surfaced to manager |

**Outputs**

- `sessions/{date}-{session-id}/2-preparation/working/draft-iter{n}.md` — canonical working draft, stamped to the required-sections template below
- `sessions/{date}-{session-id}/2-preparation/staging/skills/{slug}/SKILL.md` — staged; zero or more (per `generate-now` skill decisions). Wrap-up promotes to `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md`
- `sessions/{date}-{session-id}/2-preparation/staging/{scenarios,checklists,decisions,design,references}/{slug}.md` — staged; zero or more (per `generate-now` memory-promotion decisions). Wrap-up promotes to `features/{feature-name}/...` or project-tier directories per the routing table

Required-sections template for the working draft:

```markdown
## Scope reference
{Link to `1-ideation/outputs/` and the locked Scope Contract section.}

## Readiness summary
{One-paragraph status: how many gaps found, how many resolved this loop, how many deferred, how many skipped.}

## Design + memory readiness
{Sub-step B output: items checked, gaps found, per-gap resolution applied.}

## Execution skills readiness
{Sub-step C output: skills checked, missing skills, per-gap resolution (skills generated this loop listed with their staged path).}

## Generated this loop
{Concrete list of every staging artifact created during WORK: project-skill staging paths, memory-promotion staging paths.}

## Out of scope gaps
{Each gap deferred: name, severity, pointer to where it lives — backlog, known issues, follow-up note.}

## Decisions log
{Summary of user choices made through the active runtime's user-decision primitive during DISCUSSION, plus the gap-resolution map and any RE-IDEATE escalation.}
```

**Exit checklist**
- [ ] Working draft has all 7 required sections populated, no `TODO` / `TBD` / `<...>` placeholders
- [ ] Every `generate-now` decision has a corresponding staging artifact (or a skip reason logged with explicit rationale)
- [ ] Every `defer` decision is recorded in "Out of scope gaps"
- [ ] Every `skip` decision is recorded in "Decisions log" with the user's stated reason
- [ ] Decisions Log cites every user-decision outcome
- [ ] No writes to memory (`features/{feature-name}/...` or top-level project dirs)
- [ ] No content beyond what was approved in DISCUSSION

### WORK discipline

- **No new content beyond gap fixes.** WORK does not introduce design decisions, plans, or implementations beyond what the user approved in DISCUSSION. If a gap surfaces during persistence, raise it to the manager — re-entering DISCUSSION is preferred over silent invention.
- **Stamp full templates.** When generating a project-specific skill, stamp the full [`interview/templates/project-skill.md`](../interview/templates/project-skill.md) — never leave skeleton files.
- **Cite the discussion.** Each section's content must be traceable to a DISCUSSION exchange in the parent transcript. The Decisions Log makes this explicit.

---

## EVALUATION Phase

**Purpose**
Find the readiness gaps WORK missed. Two independent systems (Claude Code + Codex) evaluate the artifact across all seven perspectives + Overall; the manager reconciles their findings and produces a single `PASS` / `REVISE` / `FAIL` verdict. Every verdict advances to RECORD so each iteration's evidence is preserved; only the post-RECORD transition differs (`PASS` exits the loop, `REVISE` re-enters DISCUSSION, `FAIL` escalates).

See [evaluation skill](../evaluation/SKILL.md) for the full Stage 0 / 1 / 2 / 3 procedure, and [`orchestration/workflow/evaluation.md`](../orchestration/workflow/evaluation.md) for the manager's spawn / reconciliation orchestration.

**Inputs** (consumed from the WORK phase output)
- `sessions/{date}-{session-id}/2-preparation/working/draft-iter{n}.md`
- `sessions/{date}-{session-id}/2-preparation/staging/skills/{slug}/SKILL.md` — every staged skill from WORK
- `sessions/{date}-{session-id}/2-preparation/staging/{scenarios,checklists,decisions,design,references}/{slug}.md` — every staged memory-promotion fix
- The locked gap-resolution plan from DISCUSSION (for scope-creep checks)
- The discussion log (manager-captured user-decision exchanges, for decisions traceability)

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Manager | WORK outputs; gap-resolution plan; discussion log | Spawn one evaluator per system (Claude Code + Codex); each handles all seven perspectives + Overall sequentially | Two evaluator agent instances |
| 2 | Evaluator | All step-1 inputs | Run the four-stage procedure (Stage 0 Target Understanding → Stage 1 Scenario-Checklist Frame Build → Stage 2 Per-Perspective Sequential Evaluation → Stage 3 Overall) per `evaluation/SKILL.md` | `evaluation/iter{n}/{claude,codex}/{perspective}.md` + `evaluation/iter{n}/{claude,codex}/overall.md` |
| 3a | Manager | Both systems' per-perspective files | Cross-system reconciliation: pessimistic union of findings; severity-gated divergence handling | Reconciled findings + per-perspective verdicts |
| 3b | Manager | Major divergence (if any) | Run the active runtime's user-decision primitive | (skipped if no major divergence) |
| 3c | User | Divergence question | Decide which verdict to honor | User-confirmed verdict |
| 4 | Manager | Reconciled findings + verdicts | Record aggregated verdict: `PASS` / `REVISE` / `FAIL`. **All verdicts advance to RECORD first** so each iteration preserves a transcript + iter entry in `session.json` regardless of outcome. After RECORD, `PASS` exits the loop; `REVISE` re-enters DISCUSSION (iter increments; evaluator findings feed next DISCUSSION); `FAIL` escalates through the active runtime's user-decision primitive | Workflow-state verdict |

**Outputs**
- `sessions/{date}-{session-id}/2-preparation/evaluation/iter{n}/{claude,codex}/{perspective}.md` — one file per system × perspective
- Aggregated verdict recorded in workflow state (cross-system divergence is derived at RECORD by comparing the per-system files; no separate divergence file is written)

**Preparation-specific evaluation emphasis** (the phase child doc directs)
- Gap coverage — was every needed item actually checked at Sub-steps B and C?
- Generation quality — do staged skills meet the project-skill template bar that the [interview skill](../interview/SKILL.md) enforces?
- `re-ideate` triggering — is any gap actually unworkable (re-ideate) rather than just missing (generate-now)?

**Exit checklist**
- [ ] Both systems produced per-perspective files for every perspective
- [ ] Verdict aggregated and recorded; `REVISE` increments the iteration counter, `PASS` and `FAIL` advance to RECORD

---

## RECORD Phase

> **Canonical procedure: [`record/SKILL.md`](../record/SKILL.md).** RECORD is the per-loop capture sub-phase. Its mechanics — transcript copy, `session.json` iter upsert, PASS-only `outputs/` + typed-finding staging, cumulative-staging, idempotency — are defined once in [`record/SKILL.md`](../record/SKILL.md). This section states only what is specific to the Preparation loop; do not re-derive the shared procedure here.

**Purpose**
Persist every iteration's evidence into session record and — on the final `PASS` iteration — emit the loop's `outputs/` files and stage typed-finding artifacts. RECORD runs after **every** EVALUATION (whether the verdict is `PASS`, `REVISE`, or `FAIL`) so each iteration leaves a durable audit trail. Memory is **not** written here; Wrap-up handles session → project promotion.

See [record skill](../record/SKILL.md) for the every-iter / PASS-only procedure, template-stamping conventions, artifact frontmatter schema, and cumulative-staging rule. [`orchestration/workflow/record.md`](../orchestration/workflow/record.md) covers the manager's spawn / collect orchestration.

**Inputs**
- `sessions/{date}-{session-id}/2-preparation/working/draft-iter{n}.md` — current iteration's WORK output
- `sessions/{date}-{session-id}/2-preparation/evaluation/iter{m}/{claude,codex}/{perspective}.md` for `m ∈ 1..n`
- `session.json.transcriptPath` (tilde-expand `$HOME` on read) — manager-stamped transcript path; use `$CLAUDE_TRANSCRIPT_PATH` if reading directly from env. Claude Code transcript jsonl for the iteration window
- `sessions/{date}-{session-id}/2-preparation/working/discussion-log.md`
- EVALUATION verdict for this iteration (`PASS` / `REVISE` / `FAIL`)
- WORK-staged artifacts under `sessions/{date}-{session-id}/2-preparation/staging/` (already in place — RECORD supplements, never replaces)

**Procedure** — see [record/SKILL.md § RECORD Phase](../record/SKILL.md#record-phase) for the canonical step-by-step. Preparation-specific notes:

- On PASS, the artifact in `sessions/{date}-{session-id}/2-preparation/outputs/` should include at least one file with `artifact_type: handoff` summarizing readiness status (gaps closed, gaps deferred, skills generated, RE-IDEATE escalations if any).
- The `memory-reads` artifact enumerates every prior-iter evaluation file consumed (Step 6 of the RECORD procedure).
- WORK-staged `skills/`, `scenarios/`, `checklists/`, `decisions/`, etc. are NOT re-staged by RECORD — they already exist from WORK. RECORD supplements with evaluator-finding-driven staging (e.g., a `scenario_gap` from Stage 1 evaluation gets a new staging file under `staging/scenarios/`).

**Outputs**

Every iteration produces:
- `sessions/{date}-{session-id}/transcripts/{role}-{agentId}.jsonl` — preserved transcript
- `sessions/{date}-{session-id}/session.json` — upserted `workflow.preparation.iterations[]` entry

Only the `PASS` iteration also produces:
- `sessions/{date}-{session-id}/2-preparation/outputs/` — canonical artifact files (handoff + memory-reads, plus loop-specific decompositions)
- `sessions/{date}-{session-id}/2-preparation/staging/` — cumulative evaluator-finding stagings on top of the WORK-staged gap fixes
- `sessions/{date}-{session-id}/session.json` — `workflow.preparation.finishedAt` and `verdict: PASS` set

**Exit checklist**

Every iteration:
- [ ] Each agent transcript copied to session-root `transcripts/{role}-{agentId}.jsonl`
- [ ] `session.json.workflow.preparation.iterations[]` includes this iter's `{iter, verdict, finishedAt, evaluation_dir: "evaluation/iter{n}/"}`
- [ ] No writes to feature memory or memory

`PASS` iteration additionally:
- [ ] `outputs/` directory contains one or more files, each carrying valid frontmatter per the [Artifact frontmatter schema](../record/SKILL.md#artifact-frontmatter-schema)
- [ ] At least one artifact has `artifact_type: handoff`
- [ ] At least one artifact has `artifact_type: memory-reads`
- [ ] Every evaluator finding across iters `1..n` staged to the correct `staging/` destination per Type + Domain routing
- [ ] `session.json.workflow.preparation.finishedAt` and final `verdict: PASS` set

---

## Output paths

All writes during the Preparation Loop are **session-scoped**. Wrap-up promotes the `staging/` directory to memory after the workflow completes — see [wrap-up skill](../wrap-up/SKILL.md).

**Path conventions**

- `{date}` — the session start date in `YYYY-MM-DD` format
- `{session-id}` — runtime session ID resolved by the manager during Configuration. Use `CLAUDE_CODE_SESSION_ID` for Claude Code and `CODEX_THREAD_ID` for native Codex. Do NOT read runtime env vars from spawned subagents for this value; use the parent session id supplied by the manager.
- `{feature-name}` — feature slug (only used by Wrap-up when promoting to memory; not used inside session paths)
- `{slug}` — slug for a specific artifact, set by the writer at stage time
- `{n}` — iter number, supplied by the manager

| Path | Written by | Written |
|---|---|---|
| `sessions/{date}-{session-id}/2-preparation/working/draft-iter{n}.md` | leader (WORK) | every iteration |
| `sessions/{date}-{session-id}/2-preparation/staging/skills/{slug}/SKILL.md` | leader (WORK) | per `generate-now` skill decision |
| `sessions/{date}-{session-id}/2-preparation/staging/scenarios/{slug}.md` | leader (WORK) or assistant (RECORD) | leader: per `generate-now` missed-promotion / assistant: per `scenario_gap` finding |
| `sessions/{date}-{session-id}/2-preparation/staging/checklists/{slug}.md` | leader (WORK) or assistant (RECORD) | leader: per `generate-now` missed-promotion / assistant: per `checklist_gap` finding |
| `sessions/{date}-{session-id}/2-preparation/staging/decisions/{slug}.md` | leader (WORK) or assistant (RECORD) | leader: per `generate-now` missed-promotion / assistant: per `design_flaw` / `assumption_risk` / `disputed` / `deferred` finding |
| `sessions/{date}-{session-id}/2-preparation/staging/design/{slug}.md` | leader (WORK) or assistant (RECORD) | per substantive design topic carried into Preparation |
| `sessions/{date}-{session-id}/2-preparation/staging/references/{slug}.md` | leader (WORK) or assistant (RECORD) | per external reference (e.g., dependency citation from a finding) |
| `sessions/{date}-{session-id}/2-preparation/staging/discussions/{slug}.md` | assistant (RECORD) | per substantive user-decision topic |
| `sessions/{date}-{session-id}/2-preparation/staging/backlogs/feature/{slug}.md` | assistant (RECORD) | per `deferred` decision that lands in the feature backlog |
| `sessions/{date}-{session-id}/2-preparation/staging/backlogs/project/{slug}.md` | assistant (RECORD) | per `deferred` decision that lands in the project backlog |
| `sessions/{date}-{session-id}/2-preparation/evaluation/iter{n}/{claude,codex}/{perspective}.md` | evaluator (EVALUATION) | one per system × perspective |
| `sessions/{date}-{session-id}/transcripts/{role}-{agentId}.jsonl` | assistant (RECORD) | per iter — preserved transcript window |
| `sessions/{date}-{session-id}/2-preparation/outputs/{free-filename}.md` | assistant (RECORD) | PASS only — one or more artifact files; each carries the [Artifact frontmatter schema](../record/SKILL.md#artifact-frontmatter-schema) |
| `sessions/{date}-{session-id}/session.json` | assistant (RECORD) | loop completion timestamps, iter, verdict |

The session directory tree at `sessions/{date}-{session-id}/2-preparation/{working,staging,evaluation}/` is bootstrapped by the manager at Preparation Loop entry. WORK and RECORD assume the tree exists and surface an error if it does not. Feature directories under `features/{feature-name}/...` are **not** touched during Preparation; Wrap-up creates them as needed during memory promotion.

---

## Constraints

- **MUST never close a gap without explicit user approval** — the leader proposes, the user decides through the active runtime's user-decision primitive.
- **MUST stamp full templates** when generating a project-specific skill — never leave skeleton files. Use [`interview/templates/project-skill.md`](../interview/templates/project-skill.md).
- **MUST never silently ignore a missing item** — every gap goes to the Sub-step D consolidated table for user review.
- **MUST never expand scope** to address project-wide gaps unrelated to this task — note them as out-of-scope in the working draft.
- **MUST re-enter Ideation** if any gap reveals an unworkable design (a missing decision, not a missing artifact) — record the trigger, halt Preparation, signal the manager.
- **MUST record the user's gap-resolution decision per gap** in the Decisions Log.
- **MUST never write to memory or feature memory during the Preparation Loop** — all `generate-now` fixes stage at `sessions/{date}-{session-id}/2-preparation/staging/{type}/{slug}.md`. Wrap-up promotes.
- **MUST never delete** — supersession via frontmatter (`status: superseded`, `superseded_by:`); physical deletion of any file in any tier is forbidden. Terminal artifacts are moved (never deleted) to `archive/{type}/` by Wrap-up at session close.
- **MUST never read or write `session.json` from the leader role** — the manager owns it.
- **MUST disagree when you disagree** — surface technical conflicts with evidence; recommend `re-ideate` when the Ideation output is unworkable.
- **MUST cite the discussion** — every staged gap fix references the user-decision exchange that authorized it.
