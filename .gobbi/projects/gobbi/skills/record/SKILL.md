---
name: record
description: MUST load for the RECORD sub-phase. Defines staging, PASS-only artifacts, cumulative findings, and session-record templates.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Record

Skill for any agent performing the per-loop RECORD capture during a loop's RECORD sub-phase — this `record/SKILL.md` is the canonical capture procedure. Whoever loads this skill takes on the **assistant role** for the duration of the capture — the role, not a fixed agent type. The agent preserves loop artifacts in the **session record only**: the canonical synthesized artifact, the raw inputs that fed it, and typed-finding stagings that Wrap-up will later promote to memory.

The model is **staging → Wrap-up promotion**. Loop RECORD writes **only** to the session record under `sessions/{date}-{session-id}/{N}-{loop}/`. Memory writes happen exclusively during Wrap-up, which reads accumulated session-record staging across loops and promotes deterministically to `features/{feature-name}/...` + project-tier directories per the routing table in [`wrap-up/SKILL.md`](../wrap-up/SKILL.md). For the canonical session-tree shape the assistant writes into — the `{N}-{loop}/` ordinal map, the 4-slot loop interior (`working/`, `evaluation/`, `staging/`, `outputs/`), and the single session-root `transcripts/` — see [`record-map.md`](record-map.md), the single source of truth.

Inputs to a RECORD run:
- The loop identity (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`)
- The iter number `n` (supplied by the manager from `session.json.workflow.{loop}.iterations.length`)
- The EVALUATION verdict (`PASS`, `REVISE`, or `FAIL`)
- Leader / executor drafts at `sessions/.../{N}-{loop}/working/draft-iter{n}.md`
- Evaluator per-perspective files at `sessions/.../{N}-{loop}/evaluation/iter{m}/{system}/{perspective}.md` for `m ∈ 1..n`
- The discussion log at `sessions/.../{N}-{loop}/working/discussion-log.md`
- The dual-system integration log at `sessions/.../{N}-{loop}/working/reconciliation-iter{n}.md` (Execution: the per-task `4-execution/task-{NN}-{slug}/working/reconciliation-iter{n}.md`) — the source of the value-telemetry integration counts; absent for a `single`-mode loop
- The runtime + agent transcript (`session.json.system` + `session.json.transcriptPath`, tilde-expand `$HOME` on read; or `$CLAUDE_TRANSCRIPT_PATH` if reading directly from env; or harness equivalent). `session.json.system` selects the Step-2 transcript branch (`claude-code` vs `codex`)
- Prior-iter staging (if `n ≥ 2` AND verdict is `PASS`) — findings carried forward per cumulative-staging rule

The job of RECORD: **make every iteration's evidence durable, and on PASS make the loop's decisions promotable**. It is not a re-derivation step — every decision was already approved in DISCUSSION / surfaced in EVALUATION; RECORD persists what survived.

Orchestration concerns — spawn, brief, collect, ITER/EXIT advancement — are defined separately in [`orchestration/workflow/record.md`](../orchestration/workflow/record.md).

For the complete inventory of memory paths (every session-record and memory location, description, writer, when written, and matching template), see [`memory-map.md`](../memory/memory-map.md). This SKILL.md defines the assistant's procedure; `memory-map.md` is the path / template reference. For the naming convention, the frontmatter base+extension standard, and the structure rules that govern every staged file, see [`rules.md`](../memory/rules.md) — the consolidated memory-rules reference. Staging files stamp the same base frontmatter those rules define; the staging-only fields they additionally carry (e.g. `mistake-candidate`) are stripped by Wrap-up on promotion (see § Staging-field stripping on promotion below).

---

## Memory Access Matrix

The agent in the assistant role MUST observe these tier boundaries. The only write surfaces are the loop's own session subdirectories and own-loop fields in `session.json`.

| Memory tier | Path root | Access from assistant role |
|---|---|---|
| **Session record — own loop working** | `sessions/{date}-{session-id}/{N}-{loop}/working/` | **READ + WRITE** — mutable scratch (drafts, discussion-log, research); leader / executor drafts already exist and are preserved untouched |
| **Session record — session-root transcripts** | `sessions/{date}-{session-id}/transcripts/` | **WRITE when a runtime transcript exists** — single transcript surface; one immutable `{role}-{agentId}.jsonl` per agent run, copied at Step 2, accumulating across all loops. Runtime-aware (Step 2): a `codex` session with a null `transcriptPath` skips the copy and records a `process`-domain `audit-coverage-degraded` note; a `claude-code` absent transcript is Critical/`unevaluable`. Gitignored, never promoted |
| **Session record — own loop outputs** | `sessions/{date}-{session-id}/{N}-{loop}/outputs/` | **WRITE (PASS only)** — directory holding the loop's PASS-iter output artifacts. Filenames and counts are free; every file MUST carry the artifact frontmatter (see § Artifact frontmatter schema) |
| **Session record — staging** | `sessions/{date}-{session-id}/{N}-{loop}/staging/{scenarios,checklists,decisions,references,design,discussions,reviews,reports,backlogs/{feature,project},changelogs,learnings,notes}/` | **READ + WRITE (PASS only)** — typed-finding stagings + design + discussions + backlogs + reviews + reports + (Planning-only) plans |
| **Session record — own loop evaluation per-iter** | `sessions/{date}-{session-id}/{N}-{loop}/evaluation/iter{m}/{system}/{perspective}.md` (m ≤ n) | **READ-ONLY** — input for canonical synthesis (Step 5) and cumulative staging (Step 6); walks iter `1..n` |
| **Session record — prior loops** | `sessions/{date}-{session-id}/{N}-{prior-loop}/outputs/` | **READ-ONLY** — cross-loop context for canonical synthesis (e.g., Planning RECORD reads the full `1-ideation/outputs/` directory) |
| **Session record — `session.json`** | `sessions/{date}-{session-id}/session.json` | **UPSERT** — own loop's `workflow.{loop}.iterations[]` entries + `workflow.{loop}.finishedAt` + `workflow.{loop}.verdict`. All other fields preserved verbatim |
| **Feature memory** | `.gobbi/projects/{project-name}/features/{feature-name}/` | **FORBIDDEN for Ideation / Planning / Execution loops** — never written by these loops; Wrap-up owns feature-memory writes. **PERMITTED for Wrap-up loop's own RECORD** — see "Wrap-up loop exception" row below |
| **Memory** | `.gobbi/projects/{project-name}/{mistakes,rules,design,notes,backlogs,references,decisions,plans,reviews,reports,learnings,archive}/` | **FORBIDDEN for Ideation / Planning / Execution loops** — never written by these loops; Wrap-up owns memory writes. **PERMITTED for Wrap-up loop's own RECORD** — see "Wrap-up loop exception" row below |
| **Wrap-up loop exception** | `.gobbi/projects/{project-name}/features/{feature-name}/...` + `.gobbi/projects/{project-name}/{...memory dirs...}/` when `loop = wrap-up` | **WRITE + UPSERT** — Wrap-up's RECORD is the sole writer to memory across the whole workflow. Wrap-up's procedure (in [`wrap-up/SKILL.md`](../wrap-up/SKILL.md)) details the staging→destination promotion routing. The "FORBIDDEN" rows above apply only when `loop ∈ {preparation, ideation, planning, execution}` |
| **Wrap-up skill-surface mistakes write** | `.gobbi/projects/{project-name}/skills/{skill}/mistakes.md` when `loop = wrap-up` | **WRITE (Wrap-up promotion only)** — the skill-owned fork of mistake routing (the hybrid model) appends a promoted trap as a `## ` section to the owning skill's `mistakes.md`. A skill-surface doc, OUT of the memory frontmatter standard ([`memory/rules.md` § Scope boundary](../memory/rules.md)); consistent with [`mistake/SKILL.md` § Memory Access Matrix](../mistake/SKILL.md). Working-loop RECORD never writes it |
| **Interview bootstrap exception** | `.gobbi/projects/{project-name}/{README.md,design/,decisions/,features/{feature-name}/,mistakes/,references/,backlogs/,skills/}` when the Interview skill runs in bootstrap mode (empty memory) | **WRITE** — Interview is the one additional exception to the Wrap-up sole-writer rule. During bootstrap, Interview writes user-confirmed facts directly to memory because there is no prior loop to wrap up from and no REVISE cycle to invalidate the writes. **Validation gate 5 is suspended in Interview bootstrap mode** — the gate that prohibits memory writes from loop RECORD does not apply here. In mature-project reruns, Interview writes to session-record staging (`sessions/.../interview/staging/`) and Wrap-up promotes; gate 5 is restored. See [`interview/SKILL.md` § Memory Access Matrix](../interview/SKILL.md#memory-access-matrix) and [`interview/SKILL.md` § Mature-project rerun](../interview/SKILL.md#mature-project-rerun) for the authoritative access rules. |

**Delete semantics**: the assistant NEVER deletes any file in any tier. Supersession is recorded via `disposition: superseded` on the staged finding's frontmatter (citing the superseding finding's ID); physical deletion is forbidden. Once a memory artifact reaches a terminal state, Wrap-up moves the full file (`git mv`) to `archive/{type}/` per the move-on-terminal model — never deletes it.

**Write enforcement**: any write attempted outside the WRITE / UPSERT rows above is a constraint violation. Code attempting writes to feature or memory must be revoked and RECORD restarted.

---

## Core Principles

Cross-cutting principles for any agent that loads this skill while in the assistant role.

> **Staging, not immediate promote.**

Loop RECORD never writes to memory (`features/{feature-name}/...`, `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/`). It writes to session record's `staging/` subdirectories. Wrap-up reads accumulated staging across all loops and promotes deterministically per the routing table in [`wrap-up/SKILL.md`](../wrap-up/SKILL.md). This boundary is non-negotiable — a loop's RECORD touching memory is a constraint violation.

> **RECORD never compacts.**

Memory compaction — folding an over-cap `{type}/{area}/` directory into one consolidated Map-of-Content file — is a durable-memory operation owned by **Wrap-up's Stage-2c**, not the per-loop RECORD. RECORD stages findings; it never merges, caps, or archives memory records. The standard is [`memory/rules.md` § 5](../memory/rules.md#5-memory-compaction-the-consolidated--map-of-content-carve-out); the procedure is [`wrap-up/SKILL.md`](../wrap-up/SKILL.md).

> **Run after every EVALUATION verdict — PASS, REVISE, or FAIL.**

Every iteration preserves a transcript + iter entry in `session.json` regardless of outcome, so each iteration leaves a durable audit trail before the loop either restarts, escalates, or completes. Only `PASS` additionally writes the `outputs/` files and stages typed-finding artifacts. `REVISE` and `FAIL` stop after the transcript + session.json upsert; the FAIL path is the same as REVISE for persistence purposes — the manager escalates after RECORD runs.

> **Cumulative staging on PASS.**

When iter `n` reaches `PASS`, staging covers the **union** of (a) all `disposition: addressed` and `disposition: open` findings from this iter, and (b) findings carried forward from iter `1..n-1`. This guarantees no earlier-iter constructive finding silently disappears at PASS.

> **Idempotent CREATE / UPSERT operations.**

All `CREATE` operations write-or-overwrite the target path; all `session.json` updates use upsert keyed by `iter`. Re-running RECORD on the same iter produces identical results, never duplicates.

> **Constructive findings grow the artifact; adversarial findings drive REVISE.**

`scenario_gap` and `checklist_gap` findings from EVALUATION are staged for Wrap-up to append to feature memory. `design_flaw` and `assumption_risk` findings stage as deferred risks (or feed back into DISCUSSION on REVISE). See [evaluation/SKILL.md § Finding Metadata](../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity) for the complete Type + Domain → staging-subdir routing table.

> **Store what survives, not what's transient.**

`working/` holds the unfiltered audit trail (drafts, discussion-log, research). Raw transcripts live in the single session-root `transcripts/`. The `outputs/` directory holds the distilled outputs the next loop reads. Staging is what Wrap-up will promote — be selective about what becomes a `staging/decisions/{slug}.md` vs noise.

> **Moment-of-capture, not end-of-loop.**

Corrections, decisions, and mistake-candidates are staged at the moment they occur during WORK — not deferred to the RECORD sub-phase. Deferral silently loses them when a session is interrupted. Empirical witness: session `2026-05-22-bac669ad` — T1 (8 eval files), T2 (13 eval files), T5 (9 eval files) each had full evaluations but empty staging, because capture was deferred and never completed. See [`mistake/SKILL.md` § P2](../mistake/SKILL.md#p2----detect-a-correction-during-work) for the moment-of-capture write procedure.

> **Templates over freeform — for staging. Frontmatter over freeform — for artifacts.**

Every staging subdirectory has a template at [`templates/{directory-name}.md`](../memory/templates/) — stamping the template ensures the artifact is structured enough for Wrap-up to promote without parsing prose. The `outputs/` directory uses a lighter contract: filenames and content are free; only the frontmatter schema is mandatory (see § Artifact frontmatter schema below).

---

## Artifact frontmatter schema

Every file under `sessions/{date}-{session-id}/{N}-{loop}/outputs/` MUST carry this YAML frontmatter. Filenames, file counts, and body content are free — the assistant picks whatever decomposition fits the loop's output best (`idea.md`, `framed-problem.md`, `scope-contract.md`, `design-options.md`, `task-list.md`, `handoff.md`, `memory-reads.md`, etc.). The frontmatter is the only structural constraint.

```yaml
---
loop: ideation | preparation | planning | execution | wrap-up
iter: {iter number that produced this artifact}
artifact_type: {short kebab-case label for this artifact's role — e.g., framed-problem, scope-contract, design-options, task-list, handoff, memory-reads}
created_at: YYYY-MM-DD
status: draft | final | superseded
supersedes: [{paths to prior-iter artifacts this replaces}]   # optional, empty when not applicable
related: [{related artifact paths inside or outside this dir}] # optional
production_mode: dual | claude-only                           # optional — claude-only marks a DEGRADED dual loop (propose.mode: dual but the Codex proposer failed); omit for a configured propose.mode: single run
codex_proposal_absent_reason: timeout | empty | error         # optional — present only with production_mode: claude-only (never for a propose.mode: single run)
---
```

Field semantics:

| Field | Required | Purpose |
|---|---|---|
| `loop` | Yes | Which loop produced this artifact. Allows manager + downstream loops to filter cross-loop reads |
| `iter` | Yes | The iter number at write time. Same artifact rewritten at iter (n+1) gets `iter: n+1`; if it supersedes the iter `n` version, list the prior path in `supersedes` |
| `artifact_type` | Yes | Free-form kebab-case label. The assistant picks based on content. Allows downstream consumers to group artifacts semantically (e.g., evaluator's Stage 0 reads all `loop: ideation` files and groups by `artifact_type`) |
| `created_at` | Yes | ISO 8601 date (YYYY-MM-DD) for chronological ordering |
| `status` | Yes | `draft` (in-progress), `final` (PASS-iter output), `superseded` (later-iter file replaced this) |
| `supersedes` | No | Path list of prior-iter artifacts this file replaces. The superseded files are NOT deleted — their own frontmatter `status` flips to `superseded` |
| `related` | No | Cross-references inside `outputs/` or to other session paths (staging entries, evaluation files) |
| `production_mode` | No | `dual` (a Codex proposer ran under `propose.mode: dual` and the producer integrated its proposal) or `claude-only` (`propose.mode: dual` was set but the Codex proposal was absent / failed, so the loop ran in **degraded mode**). Set by the producer during dual-system production (see [`orchestration/workflow/production.md`](../orchestration/workflow/production.md)); RECORD preserves it into `outputs/` so a degraded artifact cannot look dual-system-produced. **Omit when the loop ran `propose.mode: single`** — a deliberate, configured Claude-only run is NOT degraded mode and does NOT stamp the degraded-mode label |
| `codex_proposal_absent_reason` | No | Why the Codex proposal was absent — `timeout` / `empty` / `error`. Present ONLY with `production_mode: claude-only` (the degraded dual case); RECORD preserves it alongside `production_mode`. Never present for a `propose.mode: single` run |

**Reserved artifact_type values** (assistant uses these when applicable; otherwise picks free labels):

| `artifact_type` | When written | Body |
|---|---|---|
| `memory-reads` | Every PASS iter | Enumerates every prior-iter evaluation file path the assistant consumed at Step 6 (`evaluation/iter{m}/{system}/{perspective}.md` for `m ∈ 1..n`, every system, every perspective). The manager validates this file's contents at RECORD-exit gate 4 |
| `handoff` | Wrap-up PASS only | The session's handoff summary — what shipped, open threads, decisions to respect, pointers to key artifacts. Wrap-up's principal output |
| `resolution-log` | Optional, PASS | Per-finding closure audit listing each evaluator finding across all iters with its final `disposition:` value |
| `cross-system-divergence` | PASS only when ≥ 2 systems ran evaluation | Records per-perspective disagreements between Claude / Codex evaluators (derived by comparing `evaluation/iter{n}/{system}/{perspective}.md` files). Filterable by downstream consumers via `artifact_type: cross-system-divergence` |

**Filename + collision policy for `outputs/`**:

- Filenames are free-form kebab-case (e.g., `framed-problem.md`, `design-options.md`). Assistant picks based on content decomposition.
- **Same-iter re-run** (idempotent): assistant rewrites the same filename. `status` may stay `final`; content is deterministic from same sources. Overwriting is safe.
- **Re-iter rewrite (new iter on a topic the prior iter already covered)**: the new iter's RECORD writes a **new artifact file with a distinct filename** (e.g., `framed-problem-iter2.md` or `framed-problem-v2.md`) carrying `iter: n` and `supersedes: <path-to-prior-iter-file>`. The prior iter's file is updated in place: only its frontmatter changes (`status: superseded` + `superseded_by: <new-path>`); the body is preserved. **The prior-iter file is the only cross-iter mutation the assistant is authorized to make**, and it is mechanically a frontmatter-only update (no body rewrite).
- **Same-filename collision across iters** is forbidden — every iter's variant of a topic gets its own filename, never overwriting a different iter's file content. This is the contract that makes the audit history navigable both forward (`supersedes` → old) and backward (`superseded_by` → new).

**Promotion**: artifacts in `sessions/.../{N}-{loop}/outputs/` stay session-scoped. Wrap-up does NOT promote them to memory wholesale — instead, Wrap-up reads the artifacts to understand what shipped and may stage derivative memory entries (notes, decisions, learnings) through the standard staging→promotion route. The artifacts themselves remain in the session for audit.

---

## Staging-field stripping on promotion

Staged files carry the base frontmatter ([`rules.md` § 2.1](../memory/rules.md)) plus, when relevant, **staging-only fields** that exist purely to route or annotate the file during the session. These staging-only fields are **stripped by Wrap-up when it promotes the file to memory** — they never persist into durable memory. The assistant stamps them at stage time; the promotion allowlist (one per type) drops them. The mechanism lives in [`wrap-up/SKILL.md`](../wrap-up/SKILL.md):

- **`mistake-candidate: true`** — the flag that routes a `staging/decisions/{slug}.md` file to a mistake home. At promotion, Wrap-up applies the **skill-vs-project routing modifier** (Always-Ask — [`mistake/SKILL.md` § P4](../mistake/SKILL.md)): a skill-owned trap → a `## ` section in `skills/{skill}/mistakes.md`; a cross-cutting trap → the project `mistakes/{area}/` tier. Its routing job done, Wrap-up strips the flag from the promoted file.
- **`finding-id`, `disposition`** (when used purely as eval routing), **`promoted-from`, `promoted-at`** — session-provenance. `git log` + the base `session` field already carry provenance, so the extra keys are dropped on promotion; any durable provenance folds into base `session` + `created`.

The promoted file carries ONLY base + that type's extension fields ([`rules.md` § 2.2](../memory/rules.md)). See [`rules.md` § 2.6](../memory/rules.md#26-staging-field-stripping-on-promotion) for the standard and [`wrap-up/SKILL.md`](../wrap-up/SKILL.md) for the per-type promotion allowlist.

---

## Per-perspective evaluation file naming + the Execution per-task quartet

The canonical session-tree shapes the assistant reads at RECORD:

- **Per-perspective evaluation filenames.** Evaluation outputs live at `sessions/{date}-{session-id}/{N}-{loop}/evaluation/iter{n}/{system}/{perspective}.md`, where `{system} ∈ {claude, codex}` and `{perspective}` is the **bare** perspective name from the fixed 7-vocabulary — `project`, `structure`, `performance`, `aesthetics`, `usage`, `consistency`, `risk` — plus `overall.md`. Bare names only: no `pN-` positional prefix, and the same 7-perspective vocabulary on both systems so cross-system reconciliation can pair files 1:1. The 7-perspective vocabulary is owned by [`evaluation/SKILL.md`](../evaluation/SKILL.md).
- **Execution per-task quartet.** In the Execution loop, each task lives under `4-execution/task-{NN}-{slug}/` and carries the full `{working, evaluation, staging, outputs}` quartet — `4-execution/task-{NN}-{slug}/{working/draft-iter{n}.md, staging/{...}/, evaluation/iter{n}/{claude,codex}/{perspective}.md, outputs/{free-filename}.md}`. There is no per-task `transcripts/` dir — every agent's transcript lives in the single session-root `transcripts/`. Loop-level (cross-task) staging lives at `4-execution/staging/`. A task with only `evaluation/` (missing working/staging/outputs) is an incomplete task layout; the quartet is required unless a task is documented eval-only.

---

## RECORD Phase

**Purpose**
Persist every iteration's evidence into session record, and — on the final `PASS` iteration — also emit the loop's `outputs/` files + cumulative typed-finding stagings. RECORD runs after **every** EVALUATION (whether `PASS`, `REVISE`, or `FAIL`) so each iteration leaves a durable audit trail before the loop either restarts or completes. Memory is **not** written here.

**Inputs**
- Loop identity (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`) and iter number `n` (from manager)
- EVALUATION verdict (`PASS`, `REVISE`, or `FAIL`)
- `sessions/{date}-{session-id}/{N}-{loop}/working/draft-iter{n}.md` — current iteration's WORK output
- `sessions/{date}-{session-id}/{N}-{loop}/evaluation/iter{m}/{system}/{perspective}.md` for `m ∈ 1..n` (cross-system divergence is derived by comparing per-system files; no separate divergence file is read)
- `session.json.system` + `session.json.transcriptPath` (tilde-expand `$HOME` on read) — manager-stamped runtime + transcript path; use `$CLAUDE_TRANSCRIPT_PATH` if reading directly from env (or harness equivalent under Codex). Claude Code guarantees a transcript jsonl for the iteration window; a `codex` null `transcriptPath` is the degraded-audit branch (Step 2)
- `sessions/{date}-{session-id}/{N}-{loop}/working/discussion-log.md` — manager-captured user-decision exchanges
- `sessions/{date}-{session-id}/{N}-{loop}/working/reconciliation-iter{n}.md` — the dual-system integration log RECORD parses for the value-telemetry counts (Execution: per-task; absent for a `single`-mode loop)
- Prior-iter staging (if `n ≥ 2` AND verdict is `PASS`) — findings carried forward per the cumulative-staging rule

**Procedure**

| # | When | Agent | Operation | Source | Target | Action |
|---|---|---|---|---|---|---|
| 1 | every iter | Assistant | **VERIFY** | Inputs above | — | Confirm `session.json` has `project`, `feature`, `task` set (Lock Scope completed during Ideation). Confirm `sessions/.../{N}-{loop}/{working,staging,evaluation}/` exists; if a required subdir is missing, surface to manager and halt. Read all inputs (drafts, evaluator findings across all iters and systems, discussion log, transcript) |
| 2 | every iter | Assistant | **CREATE** | `session.json.transcriptPath` (tilde-expand `$HOME` on read; `$CLAUDE_TRANSCRIPT_PATH` if reading directly from env) + each subagent transcript at `${transcript%.jsonl}/subagents/agent-<agentId>.jsonl` | `sessions/{date}-{session-id}/transcripts/{role}-{agentId}.jsonl` (manager = `transcripts/manager-{sessionId}.jsonl`) | Copy each agent's raw transcript into the **single session-root** `transcripts/` dir — one immutable file per agent run, named `{role}-{agentId}.jsonl`. Each agent's file **accumulates across all loops** by its distinct `agentId`; it is never overwritten with a filtered window, and there is **no** per-loop or per-iter transcript snapshot. Write-or-overwrite per file (idempotent on re-run). **Runtime-aware absent-transcript branch (on `session.json.system`):** if `session.json.transcriptPath` (or `$CLAUDE_TRANSCRIPT_PATH`) is absent, branch on `session.json.system` — for `claude-code` (which guarantees a transcript; `gobbi/SKILL.md` gate 2 blocks an empty one), an absent path is unexpected: record a Critical `general` finding (domain: `unevaluable`) and continue. For `codex` (where a null `transcriptPath` is a permitted rollout-lookup outcome per `codex/SKILL.md` + `gobbi/SKILL.md`), skip the raw transcript copy, record a LOWER-severity `general` finding (domain: `process`, slug `audit-coverage-degraded`) noting audit coverage is degraded (transcript unavailable), and continue — a degraded-pass, not a Critical. This degraded-audit note is a RECORD-emitted operational audit record, NOT an evaluator finding routed through the evaluation Type+Domain table — so it is NOT a `mistake-candidate` and is never promoted to `mistakes/` |
| 3 | every iter | Assistant | **UPSERT** | This iter's verdict + iter number | `sessions/{date}-{session-id}/session.json` | Upsert `workflow.{loop}.iterations[]` entry keyed by `iter` with full schema `{iter, verdict, finishedAt, evaluation_dir: "evaluation/iter{n}/"}`. Idempotent on re-run: re-running for the same iter overwrites the entry, never appends a duplicate. **Also write the value-telemetry counts**: parse this iter's integration log `working/reconciliation-iter{n}.md` per the [count rule](#value-telemetry-integration-counts) and set `workflow.{loop}.integration` (`changing_rows` / `kept_own_rows` / `total_rows` / `escalated_rows`); for the Execution loop, append this task's `{taskNo, slug, iter, ...counts}` element to `workflow.execution.integration.tasks[]` (idempotent — keyed by `taskNo`), then recompute the loop-level four counts as the sum across `tasks[]` (the roll-up invariant below). A `single`-mode loop has no integration log, so its counts stay seeded `0`. Preserve all other session.json fields. Do **not** set `workflow.{loop}.finishedAt` (loop-level) yet — that is PASS-only, Step 8 |
| 4 | every iter | Assistant | **GUARD** | This iter's verdict | — | If verdict is `REVISE`: stop here. The loop re-enters DISCUSSION with this iter's evaluator findings as input. Steps 5–8 are skipped because there is no PASS-iter output yet. If verdict is `FAIL`: stop here. The manager will escalate to the user through the active runtime's user-decision primitive (revise / abort / re-frame) after RECORD returns. Steps 5–8 are skipped. If verdict is `PASS`: continue to Step 5 |
| 5 | PASS only | Assistant | **CREATE** | Rawdata draft + all iters' evaluator findings + discussion log + cross-system divergence (derived by comparing per-system files) | `sessions/{date}-{session-id}/{N}-{loop}/outputs/{free-filename}.md` (one or more files) | Decompose the loop's PASS-iter output into one or more artifact files inside `outputs/`. Filenames are free; every file MUST stamp the [Artifact frontmatter schema](#artifact-frontmatter-schema). Typical content split: framed-problem, scope-contract, design-options for Ideation; task-list, dependencies, agent-assignments for Planning; change-summary, verification-report for Execution; handoff, shipped-summary for Wrap-up. Two artifacts are MANDATORY: (a) one `artifact_type: memory-reads` file enumerating every prior-iter evaluation file path consumed at Step 6 (manager validates at gate 4), and (b) for loops with adversarial evaluator findings, one `artifact_type: resolution-log` file listing each finding's final `disposition:` value. Cross-system divergence summary lives in whichever artifact most relevant (e.g., design-options or handoff). The artifacts collectively are the next loop's briefing source |
| 6 | PASS only | Assistant | **CREATE** | All typed findings, cumulative across iters `1..n` | `sessions/{date}-{session-id}/{N}-{loop}/staging/{type}/{slug}.md` per the deterministic Type + Domain routing in [`evaluation/SKILL.md` § Finding Metadata](../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity) | **Pre-step**: for every iter `m ∈ 1..n`, every system (claude + codex), every perspective (7 + overall), READ `sessions/.../{N}-{loop}/evaluation/iter{m}/{system}/{perspective}.md`. Enumerate every finding's `(Type, Domain, Disposition, slug, finding-id)`. For any `disposition: superseded` whose citation points to iter `m < n-1`, also READ that earlier iter's file. Then: stage `open` + `addressed` + `disputed` + `superseded` findings per the routing table; `deferred` findings stage at `staging/decisions/` with frontmatter `disposition: deferred` so Wrap-up can route to backlogs. **No shortcut routing** — every Type + Domain uses the canonical table; `general/general` is a contract violation |
| 7 | PASS only | Assistant | **CREATE** | Canonical draft's Design section + discussion-log substantive topics + in-loop review activities + in-loop substantive reports | `sessions/{date}-{session-id}/{N}-{loop}/staging/{design,discussions,reviews,reports}/{slug}.md` | One staging file per substantive design topic (`staging/design/`) + per substantive user-decision topic (`staging/discussions/`) + per review/evaluation/audit activity the loop performed (`staging/reviews/` per [`templates/reviews.md`](../memory/templates/reviews.md)) + per substantive `status` / `post-mortem` / `analytics` report the loop produced (`staging/reports/` per [`templates/reports.md`](../memory/templates/reports.md)). The reviews/reports stagings are loop-conditional — most loops produce none, but when present they MUST be staged for Wrap-up promotion |
| 8 | PASS only | Assistant | **UPDATE** | Loop completion | `sessions/{date}-{session-id}/session.json` | Set `workflow.{loop}.finishedAt`; set `workflow.{loop}.verdict: PASS`; preserve `iterations[]` history |
| 9 | every iter | Assistant | **VERIFY** | All outputs above | — | Each agent transcript copied to the session-root `transcripts/{role}-{agentId}.jsonl` — **runtime-aware** per the Step-2 branch: a `codex` session with a permitted null `transcriptPath` is a degraded-pass here (audit coverage degraded, not a reported failure), while a `claude-code` session with an absent transcript stays a loud failure; `session.json` iter entry upserted; no writes to memory (manager validates). PASS additionally: canonical artifact exists; staging directories populated per finding-type routing; loop completion flagged in session.json. Failure of any non-degraded check is reported to the manager |

### Value-telemetry integration counts

Step 3 writes per-step **value telemetry** into `session.json.workflow.{loop}.integration`. The source is the loop's
dual-system integration log `working/reconciliation-iter{n}.md` (Execution: the per-task
`4-execution/task-{NN}-{slug}/working/reconciliation-iter{n}.md`). RECORD counts the log's decision column:

| Count | Rule |
|---|---|
| `total_rows` | Every data row in the integration delta table (one row per integration decision this loop). |
| `changing_rows` | Rows whose decision is `took-codex` **or** `merged-selective` — the Codex proposal changed the canonical artifact. |
| `kept_own_rows` | Rows whose decision is `kept-own` — the producer kept its own element (Codex added nothing here). |
| `escalated_rows` | Rows whose decision is `escalated` — a LARGE gap surfaced to the user, not self-decided. |

- These counts measure whether the dual run added value (D4.1 — distinguish "Codex added nothing" from an escalation-only loop) and feed the two-consecutive-no-value → single-mode-candidate signal (D1.6).
- For the **Execution** loop, RECORD additionally appends a per-task element to `workflow.execution.integration.tasks[]`: `{ taskNo, slug, iter, changing_rows, kept_own_rows, total_rows, escalated_rows }` — `taskNo` + `slug` identify the task, `iter` is the task's final loop count, then the four counts (D4.3 per-task value). The append is idempotent — keyed by `taskNo`, re-runs overwrite rather than duplicate.
- **Execution roll-up invariant.** The loop-level `workflow.execution.integration.{changing_rows, kept_own_rows, total_rows, escalated_rows}` is the SUM over `tasks[]` of each per-task count: `loop.changing_rows == Σ tasks[].changing_rows`, and likewise for `kept_own_rows`, `total_rows`, and `escalated_rows`. RECORD writes each task's counts into `tasks[]` (keyed by `taskNo`), then recomputes the four loop-level counts as the sum across `tasks[]`. The write MUST preserve this invariant. It is idempotent: a re-run recomputes the loop-level counts from `tasks[]` rather than incrementing, so re-running RECORD yields the same values. A `single`-mode task contributes a 0-count element, so it adds nothing to the sums.
- A `single`-mode loop runs Claude-only — there is no Codex proposal and no `reconciliation-iter{n}.md` — so the four counts stay seeded `0`.
- **Worked example.** An integration log with 16 rows split `took-codex 4 / merged-selective 9 / kept-own 2 / escalated 1` yields `changing_rows: 13`, `kept_own_rows: 2`, `total_rows: 16`, `escalated_rows: 1`.

**Finding routing** — see [`evaluation/SKILL.md` § Finding Metadata](../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity) for the complete Type + Domain → staging-subdir routing table. RECORD applies the routing table without improvisation; all destinations are session staging (Wrap-up moves them to memory).

**Research working-dir promotion** — if the calling loop loaded the `research` skill, the leader will have written external insights to `working/research/{slug}.md` during WORK. At Step 6 (PASS only), RECORD reads `working/research/` and promotes each file to `staging/references/{slug}.md` per the [references template](../memory/templates/references.md). This is separate from the typed-finding routing above — these are WORK-time external references, not evaluation findings.

**Transcript capture — the single session-root `transcripts/`** — Step 2 above is the only transcript surface. RECORD (not any hook) copies each agent's raw `.jsonl` transcript into the single `sessions/{date}-{session-id}/transcripts/` directory as `{role}-{agentId}.jsonl` (manager = `manager-{sessionId}.jsonl`), one immutable file per agent run, accumulating across all loops by distinct `agentId`. The copy is done in Step 2, NOT in the PostToolUse or SessionEnd hooks — the hooks stay lean to meet the hook-latency gate; bulk transcript copying belongs to RECORD. This copy is runtime-aware (Step 2): for a `codex` session with a null `transcriptPath` the raw copy is skipped and a `process`-domain `audit-coverage-degraded` note is recorded instead, while a `claude-code` absent transcript is Critical/`unevaluable`. What is copied: the manager's main transcript (`session.json.transcriptPath`) plus each subagent transcript at `${transcript%.jsonl}/subagents/agent-<agentId>.jsonl`. There is no per-loop or per-iter transcript snapshot — the single session-root `transcripts/` replaces it. See [`record-map.md` § Transcript rules](record-map.md) for the authoritative shape.

- **Purpose:** the session's raw-transcript record + in-session debugging. The durable audit signal survives in `session.json` (per-agent `tokensUsed`, routing, `turns[]`); `transcripts/` holds the full raw transcripts for a human or agent debugging the live session.
- **Sensitivity class — session-local debug data (highest care).** These are full raw transcripts. They are **gitignored and NEVER committed**, and they are **removed with the worktree at session end** — including on abort. Treat them as the most sensitive on-disk artifact: they hold unfiltered turn content.
- **Never copied into durable `notes/`.** The `transcripts/` directory is session-ephemeral and dies with the worktree. It is NEVER promoted to memory and NEVER copied into the durable `notes/` record (or any other memory tier). The durable signal survives via `session.json` — not via raw transcripts. Copying raw transcripts into `notes/` is a constraint violation.

**Cumulative staging across iterations**: when iter `n` reaches `PASS`, RECORD stages the **union** of (a) all `disposition: addressed` and `disposition: open` findings from this iter, and (b) all `disposition: addressed` and `disposition: open` findings carried forward from iter `1..n-1` (sourced by reading prior iter per-perspective files). `disposition: superseded` findings stage with frontmatter `superseded_by: <new-finding-id>` (pointing forward at the replacing finding); the replacing finding's frontmatter has `supersedes: <old-finding-id>` (pointing back at what it replaces). `disposition: disputed` findings stage to `staging/decisions/` with dispute rationale. `disposition: deferred` findings stage to `staging/decisions/` with frontmatter `disposition: deferred` so Wrap-up routes them to `backlogs/`. This guarantees no `PASS`-iter staging silently drops earlier-iter findings.

**Slug + collision policy**: per [`evaluation/SKILL.md` § Slug + collision policy](../evaluation/SKILL.md#slug--collision-policy). Slug derived from finding's primary symptom; finding-id is the idempotency key for re-runs and collisions.

**Discussion-log lifecycle**: `sessions/.../{N}-{loop}/working/discussion-log.md` is created by the **manager** during DISCUSSION and appended after each user-decision exchange — one section per exchange with format `## YYYY-MM-DD HH:MM — Q: ... | A: ... | Decision: ...`. REVISE iterations preserve the prior discussion-log; new iter exchanges are appended in chronological order in the same file. RECORD reads this file at Step 1 (input load) and Step 7 (discussions staging); RECORD never writes to discussion-log.

**Outputs**

Every iteration produces:
- `sessions/{date}-{session-id}/transcripts/{role}-{agentId}.jsonl` — each agent's transcript copied into the single session-root `transcripts/` dir (accumulating across loops); for a `codex` session with a null `transcriptPath` the raw copy is skipped and a `process`-domain `audit-coverage-degraded` note is written instead
- `sessions/{date}-{session-id}/session.json` — upserted `workflow.{loop}.iterations[]` entry keyed by `iter`

Only the `PASS` iteration also produces:
- `sessions/{date}-{session-id}/{N}-{loop}/outputs/{free-filename}.md` — one or more artifact files (the loop's PASS-iter output; collectively serve as the next loop's briefing source). Mandatory: at least one `artifact_type: memory-reads` file. Loop-conditional: `artifact_type: resolution-log` when there were findings to close out
- `sessions/{date}-{session-id}/{N}-{loop}/staging/{scenarios,checklists,decisions,references,design,discussions,reviews,reports,changelogs,learnings,notes}/{slug}.md` — typed-finding artifacts + design / discussions / reviews / reports / changelogs / learnings / notes stagings for Wrap-up to promote
- `sessions/{date}-{session-id}/{N}-{loop}/staging/backlogs/{feature,project}/{slug}.md` — backlog entries with feature-scope vs project-scope subdirs
- `sessions/{date}-{session-id}/3-planning/staging/plans/{slug}.md` — Planning-loop only (plan artifact for Wrap-up to promote to `features/{feature-name}/plans/`)
- `sessions/{date}-{session-id}/session.json` — `workflow.{loop}.finishedAt` and `workflow.{loop}.verdict: PASS` set

**No writes to memory.** All `features/{feature-name}/...`, `.gobbi/projects/{project-name}/{mistakes,rules,design,notes,backlogs,references,decisions,plans,reviews,reports,learnings,archive}/` writes are Wrap-up's responsibility per [`wrap-up/SKILL.md`](../wrap-up/SKILL.md).

**Exit checklist**

Every iteration:
- [ ] Each agent transcript copied to the session-root `transcripts/{role}-{agentId}.jsonl` — runtime-aware per Step 2 / Step 9: a `codex` session with a permitted null `transcriptPath` is a degraded-pass (not a failed gate); a `claude-code` absent transcript is a loud failure
- [ ] `session.json.workflow.{loop}.iterations[]` includes this iter's `{iter, verdict, finishedAt, evaluation_dir: "evaluation/iter{n}/"}` (full schema; do not omit `evaluation_dir`)
- [ ] No writes to feature memory or memory

> **Per-loop exit-checklists inherit this runtime-aware gate.** The "transcript copied" exit gate is restated near-verbatim in each loop's RECORD exit checklist (`ideation/SKILL.md`, `planning/SKILL.md`, `preparation/SKILL.md`, `execution/SKILL.md`). Each of those RECORD sections carries an explicit "Canonical procedure: `record/SKILL.md` … do not re-derive the shared procedure here" deferral, so they INHERIT this runtime-aware branch (Codex-null = degraded-pass; Claude-null = loud failure) with NO independent edit.

`PASS` iteration additionally:
- [ ] `outputs/` directory contains one or more files, each carrying valid frontmatter per [Artifact frontmatter schema](#artifact-frontmatter-schema)
- [ ] At least one artifact has `artifact_type: memory-reads` (the cumulative-staging audit surface)
- [ ] **Degraded-mode label gate** — when the loop ran `propose.mode: dual` but `working/proposals/codex/draft-iter{n}.md` is **absent or empty** (the Codex proposal failed), EVERY `outputs/*.md` MUST carry `production_mode: claude-only`. A degraded loop that ships an `outputs/*.md` WITHOUT the label is unlabeled degraded mode — a strip/preserve miss, not a valid PASS. AND `codex_proposal_absent_reason: <timeout|empty|error>` is valid ONLY alongside `production_mode: claude-only` — it MUST NOT appear on a `propose.mode: single` run (a configured single run is not degraded; see [`orchestration/workflow/production.md` § Degraded-mode policy](../orchestration/workflow/production.md)). Mechanically checkable: with an absent/empty proposal, `grep -L 'production_mode: claude-only' outputs/*.md` MUST list no files, and no `outputs/*.md` may carry `codex_proposal_absent_reason` without `production_mode: claude-only`
- [ ] Every evaluator finding across iters `1..n` staged to the correct `staging/` destination per Type + Domain routing
- [ ] Design / discussions derivables staged under `staging/`
- [ ] `session.json.workflow.{loop}.finishedAt` and final `verdict: PASS` set
- [ ] Cumulative-staging union (current iter + prior iters) verified — no earlier-iter constructive finding dropped

---

## Idempotency contract

Re-running RECORD on the same iter (after a crash, partial write, or explicit re-invocation) MUST produce identical results:

| Operation | Idempotent because |
|---|---|
| CREATE `transcripts/{role}-{agentId}.jsonl` | Write-or-overwrite per agent file. Deterministic source (the agent's full transcript) |
| UPSERT `session.json.iterations[]` | Keyed by `iter` — re-runs replace, never duplicate |
| CREATE `outputs/{free-filename}.md` (PASS) | Write-or-overwrite per filename. Deterministic synthesis from same sources — same iter, same decomposition. Filenames stay stable across re-runs of the same iter; only `iter` + `status` frontmatter increment across re-iters |
| CREATE `staging/{type}/{slug}.md` (PASS) | Slug derived from finding's primary symptom + finding-id idempotency key. Collision policy adds `-2`/`-3` suffix for distinct finding-ids, overwrites for matching finding-ids |
| UPDATE `session.json` `finishedAt` + `verdict` (PASS) | Set, not append |

---

## Output paths

All writes during RECORD are **session-scoped**. Wrap-up promotes the `staging/` directory to memory after the workflow completes — see [`wrap-up/SKILL.md`](../wrap-up/SKILL.md). For the full inventory across both tiers (session + project), see [`memory-map.md`](../memory/memory-map.md).

### Path conventions

See also: `evaluation/SKILL.md § Coverage Ownership Matrix § RECORD staging shape + naming` for the cross-cutting evaluation seed that covers staging shape and naming compliance.

- `{date}` — session start date in `YYYY-MM-DD`
- `{session-id}` — runtime session ID resolved by the manager during Configuration and supplied by the delegation prompt's `session-id:` header field (the parent session's id). Use `CLAUDE_CODE_SESSION_ID` for Claude Code and `CODEX_THREAD_ID` for native Codex. Do NOT read runtime env vars from spawned subagents for this value: in a spawned-subagent context that env-var holds the subagent's own UUID, not the parent session's — use the parent session id supplied by the manager.
- `{loop}` — the workflow loop being persisted (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`). On disk the loop dir carries the `{N}-` ordinal prefix (`1-ideation` … `5-wrap-up`); the `workflow.{loop}` keys in `session.json` stay **bare** (SEAM-3 — see [`record-map.md`](record-map.md))
- `{N}` — the loop's fixed ordinal (`1`=ideation, `2`=preparation, `3`=planning, `4`=execution, `5`=wrap-up); the on-disk loop-dir prefix
- `{role}` / `{agentId}` — agent role label and distinct agent run id, used for the session-root `transcripts/{role}-{agentId}.jsonl` files
- `{feature-name}` — feature slug (only used by Wrap-up when promoting to memory; not used inside session paths)
- `{slug}` — slug for a specific artifact, set by the writer at stage time
- `{n}` — iter number, supplied by the manager from `session.json.workflow.{loop}.iterations.length`

| Path | Written by | Written |
|---|---|---|
| `sessions/{date}-{session-id}/transcripts/{role}-{agentId}.jsonl` | assistant (RECORD) | every iteration — each agent's transcript copied into the single session-root `transcripts/`, accumulating across loops (manager = `manager-{sessionId}.jsonl`). For a `codex` session with a null `transcriptPath`, no raw transcript file is produced that iter — RECORD writes the `process`-domain `audit-coverage-degraded` note instead |
| `sessions/{date}-{session-id}/session.json` | assistant (RECORD) | every iteration — upserted iter entry; PASS additionally sets `finishedAt` + `verdict` |
| `sessions/{date}-{session-id}/{N}-{loop}/outputs/{free-filename}.md` | assistant (RECORD) | PASS only — one or more artifact files. Each MUST carry the Artifact frontmatter schema. Mandatory: ≥ 1 file with `artifact_type: memory-reads` |
| `sessions/{date}-{session-id}/{N}-{loop}/staging/scenarios/{slug}.md` | assistant (RECORD) | PASS only — per `scenario_gap` finding |
| `sessions/{date}-{session-id}/{N}-{loop}/staging/checklists/{slug}.md` | assistant (RECORD) | PASS only — per `checklist_gap` finding |
| `sessions/{date}-{session-id}/{N}-{loop}/staging/decisions/{slug}.md` | assistant (RECORD) | PASS only — per `design_flaw` / `assumption_risk` / `disputed` / `deferred` finding + Domain-routed `general` findings |
| `sessions/{date}-{session-id}/{N}-{loop}/working/research/{slug}.md` | leader (WORK — research) | Written by leader during WORK when the research skill is loaded; one per confirmed external insight. READ by RECORD at Step 6 for promotion. |
| `sessions/{date}-{session-id}/{N}-{loop}/staging/references/{slug}.md` | assistant (RECORD) | PASS only — promoted from `working/research/{slug}.md` (research externals) + per `general` finding with Domain = `dependency` |
| `sessions/{date}-{session-id}/{N}-{loop}/staging/design/{slug}.md` | assistant (RECORD) | PASS only — per substantive design topic |
| `sessions/{date}-{session-id}/{N}-{loop}/staging/discussions/{slug}.md` | assistant (RECORD) | PASS only — per substantive user-decision topic |
| `sessions/{date}-{session-id}/{N}-{loop}/staging/backlogs/feature/{slug}.md` | assistant (RECORD) | PASS only — feature-scope backlog candidates |
| `sessions/{date}-{session-id}/{N}-{loop}/staging/backlogs/project/{slug}.md` | assistant (RECORD) | PASS only — project-scope backlog candidates |
| `sessions/{date}-{session-id}/{N}-{loop}/staging/reviews/{slug}.md` | assistant (RECORD) | PASS only — review/evaluation/audit activity result documents (loop-conditional) |
| `sessions/{date}-{session-id}/{N}-{loop}/staging/reports/{slug}.md` | assistant (RECORD) | PASS only — `status` / `post-mortem` / `analytics` reports (loop-conditional) |
| `sessions/{date}-{session-id}/{N}-{loop}/staging/changelogs/{slug}.md` | assistant (RECORD) | PASS only — shipped-work changelog entries (Execution loop typical) |
| `sessions/{date}-{session-id}/{N}-{loop}/staging/learnings/{slug}.md` | assistant (RECORD) | PASS only — durable cross-cutting insights (loop-conditional) |
| `sessions/{date}-{session-id}/{N}-{loop}/staging/notes/{slug}.md` | assistant (RECORD) | PASS only — loop-scope journal entry (rare; per-session journal is written at Wrap-up) |
| `sessions/{date}-{session-id}/3-planning/staging/plans/{slug}.md` | assistant (RECORD) | Planning loop only, PASS only — plan artifact for Wrap-up to promote to `features/{feature-name}/plans/`. **Not in other loops' staging trees** |

The session directory tree at `sessions/{date}-{session-id}/{N}-{loop}/{working,staging,evaluation}/` is bootstrapped by the manager during the loop's DISCUSSION (Lock Scope for Ideation; equivalent setup point for downstream loops). RECORD assumes the tree exists on entry and surfaces an error to the manager if it does not.

---

## Templates

Staging subdirectory templates live at [`templates/`](../memory/templates/). Each template defines required fields, "when to stage" trigger, and frontmatter schema. The assistant MUST stamp the matching template for every staging file — freeform writes are forbidden. For a template-→-directories cross-index (which directories each template stamps), see [`memory-map.md` § Templates index](../memory/memory-map.md#templates-index).

| Staging subdirectory | Template |
|---|---|
| `staging/scenarios/` | [`templates/scenarios.md`](../memory/templates/scenarios.md) |
| `staging/checklists/` | [`templates/checklists.md`](../memory/templates/checklists.md) |
| `staging/decisions/` | [`templates/decisions.md`](../memory/templates/decisions.md) |
| `staging/references/` | [`templates/references.md`](../memory/templates/references.md) |
| `staging/design/` | [`templates/design.md`](../memory/templates/design.md) |
| `staging/discussions/` | [`templates/discussions.md`](../memory/templates/discussions.md) |
| `staging/backlogs/feature/` | [`templates/backlogs.md`](../memory/templates/backlogs.md) |
| `staging/backlogs/project/` | [`templates/backlogs.md`](../memory/templates/backlogs.md) |
| `staging/reviews/` | [`templates/reviews.md`](../memory/templates/reviews.md) |
| `staging/reports/` | [`templates/reports.md`](../memory/templates/reports.md) |
| `staging/changelogs/` | [`templates/changelogs.md`](../memory/templates/changelogs.md) |
| `staging/learnings/` | [`templates/learnings.md`](../memory/templates/learnings.md) |
| `staging/notes/` | [`templates/notes.md`](../memory/templates/notes.md) |
| `staging/plans/` (Planning-loop only) | [`templates/plans.md`](../memory/templates/plans.md) |

Memory directory templates (consumed by Wrap-up, not by loop RECORD) also live under [`templates/`](../memory/templates/) — they are the destination schemas Wrap-up stamps when promoting staging content:

| Memory directory | Template |
|---|---|
| `.gobbi/projects/{project-name}/features/{feature-name}/README.md` | [`templates/feature.md`](../memory/templates/feature.md) |
| `.gobbi/projects/{project-name}/mistakes/` and `features/{feature-name}/mistakes/` | [`templates/mistakes.md`](../memory/templates/mistakes.md) |
| `.gobbi/projects/{project-name}/rules/` | [`templates/rules.md`](../memory/templates/rules.md) |

Session-level templates: see [`orchestration/templates/`](../orchestration/templates/) for `settings.chat.json` / `settings.auto.json` (per-mode defaults; bootstrap loads the one matching the user-selected mode) and `session.template.json`.

---

## Constraints

- **MUST run on every EVALUATION verdict** (PASS, REVISE, and FAIL) — REVISE and FAIL iterations still preserve transcript + session.json entry. The FAIL persistence branch is identical to REVISE: every-iter outputs only, no Steps 5–8.
- **MUST be idempotent** — per the contract above; re-running on the same iter produces identical results.
- **MUST stage findings cumulatively on PASS** — union across iters `1..n`; no earlier-iter constructive finding silently dropped.
- **MUST stamp templates** — never write freeform to a staging subdirectory; see [`templates/`](../memory/templates/).
- **MUST preserve all iterations' working data** — earlier iter drafts in `working/` remain alongside the current iter's, and each agent's accumulating `transcripts/{role}-{agentId}.jsonl` is never overwritten with a filtered window.
- **MUST be read-only against the artifact AND all memory tiers except own write surfaces** — never modify leader / executor drafts; never write to feature memory, memory, prior loops' session dirs, or other systems' evaluation dirs. The ONLY allowed write surfaces are listed in § Memory Access Matrix.
- **MUST NEVER write to memory when `loop ∈ {preparation, ideation, planning, execution}`** — no `features/{feature-name}/...`, `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/`, `references/`, `decisions/`, `plans/`, `reviews/`, `reports/`, `learnings/`, `archive/` writes from those loops' RECORD. Wrap-up's RECORD owns those writes (see Memory Access Matrix § Wrap-up loop exception).
- **MUST NEVER create feature directories when `loop ∈ {preparation, ideation, planning, execution}`** — `features/{feature-name}/` is bootstrapped by Wrap-up at promotion time, not earlier.
- **MUST NEVER delete** — supersession via `disposition: superseded` field; physical deletion of any file in any tier is forbidden. Terminal memory artifacts are moved (never deleted) to `archive/{type}/` by Wrap-up at session close.
- **MUST extend `session.json` only via UPSERT keyed by `iter`** — own loop's fields only; all other session.json fields preserved verbatim.
- **MUST apply Type + Domain routing without improvisation** — every staging destination follows the canonical table in `evaluation/SKILL.md`; `general/general` is a contract violation.
