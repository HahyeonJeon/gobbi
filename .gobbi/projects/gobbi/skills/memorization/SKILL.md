---
name: memorization
description: MUST load when performing synthesis during a loop's MEMORIZATION sub-phase. Defines the staging→Wrap-up promotion model, the idempotent every-iter / PASS-only procedure, cumulative finding staging on PASS, and per-staging-subdirectory templates.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Memorization

Skill for any agent performing synthesis during a loop's MEMORIZATION sub-phase. Whoever loads this skill takes on the **assistant role** for the duration of the synthesis — the role, not a fixed agent type. The agent preserves loop artifacts in **session memory only**: the canonical synthesized artifact, the raw inputs that fed it, and typed-finding stagings that Wrap-up will later promote to project memory.

The model is **staging → Wrap-up promotion**. Loop MEMORIZATION writes **only** to session memory under `sessions/{date}-{session-id}/{loop}/`. Project memory writes happen exclusively during Wrap-up, which reads accumulated session staging across loops and promotes deterministically to `features/{feature-name}/...` + project-tier directories per the routing table in [`wrap-up/SKILL.md`](../wrap-up/SKILL.md).

Inputs to a MEMORIZATION run:
- The loop identity (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`)
- The iter number `n` (supplied by the manager from `session.json.workflow.{loop}.iterations.length`)
- The EVALUATION verdict (`PASS`, `REVISE`, or `FAIL`)
- Leader / executor drafts at `sessions/.../{loop}/rawdata/draft-iter{n}.md`
- Evaluator per-perspective files at `sessions/.../{loop}/evaluation/iter{m}/{system}/{perspective}.md` for `m ∈ 1..n`
- The discussion log at `sessions/.../{loop}/rawdata/discussion-log.md`
- The agent transcript (`session.json.transcriptPath`, tilde-expand `$HOME` on read; or `$CLAUDE_TRANSCRIPT_PATH` if reading directly from env; or harness equivalent)
- Prior-iter staging (if `n ≥ 2` AND verdict is `PASS`) — findings carried forward per cumulative-staging rule

The job of MEMORIZATION: **make every iteration's evidence durable, and on PASS make the loop's decisions promotable**. It is not a re-derivation step — every decision was already approved in DISCUSSION / surfaced in EVALUATION; MEMORIZATION persists what survived.

Orchestration concerns — spawn, brief, collect, ITER/EXIT advancement — are defined separately in [`orchestration/workflow/memorization.md`](../orchestration/workflow/memorization.md).

For the complete inventory of memory paths (every session-memory and project-memory location, description, writer, when written, and matching template), see [`memory-map.md`](memory-map.md). This SKILL.md defines the assistant's procedure; `memory-map.md` is the path / template reference.

---

## Memory Access Matrix

The agent in the assistant role MUST observe these tier boundaries. The only write surfaces are the loop's own session subdirectories and own-loop fields in `session.json`.

| Memory tier | Path root | Access from assistant role |
|---|---|---|
| **Session memory — own loop rawdata** | `sessions/{date}-{session-id}/{loop}/rawdata/` | **READ + WRITE** — transcript preservation; leader / executor drafts already exist and are preserved untouched |
| **Session memory — own loop artifacts** | `sessions/{date}-{session-id}/{loop}/artifacts/` | **WRITE (PASS only)** — directory holding the loop's PASS-iter output artifacts. Filenames and counts are free; every file MUST carry the artifact frontmatter (see § Artifact frontmatter schema) |
| **Session memory — staging** | `sessions/{date}-{session-id}/{loop}/staging/{scenarios,checklists,decisions,references,design,discussions,reviews,reports,backlogs/{feature,project},changelogs,learnings,notes}/` | **READ + WRITE (PASS only)** — typed-finding stagings + design + discussions + backlogs + reviews + reports + (Planning-only) plans |
| **Session memory — own loop evaluation per-iter** | `sessions/{date}-{session-id}/{loop}/evaluation/iter{m}/{system}/{perspective}.md` (m ≤ n) | **READ-ONLY** — input for canonical synthesis (Step 5) and cumulative staging (Step 6); walks iter `1..n` |
| **Session memory — prior loops** | `sessions/{date}-{session-id}/{prior-loop}/artifacts/` | **READ-ONLY** — cross-loop context for canonical synthesis (e.g., Planning MEMORIZATION reads the full `ideation/artifacts/` directory) |
| **Session memory — `session.json`** | `sessions/{date}-{session-id}/session.json` | **UPSERT** — own loop's `workflow.{loop}.iterations[]` entries + `workflow.{loop}.finishedAt` + `workflow.{loop}.verdict`. All other fields preserved verbatim |
| **Feature memory** | `.gobbi/projects/{project-name}/features/{feature-name}/` | **FORBIDDEN for Ideation / Planning / Execution loops** — never written by these loops; Wrap-up owns feature-memory writes. **PERMITTED for Wrap-up loop's own MEMORIZATION** — see "Wrap-up loop exception" row below |
| **Project memory** | `.gobbi/projects/{project-name}/{mistakes,rules,design,notes,backlogs,references,decisions,plans,reviews,reports,learnings,archive}/` | **FORBIDDEN for Ideation / Planning / Execution loops** — never written by these loops; Wrap-up owns project-memory writes. **PERMITTED for Wrap-up loop's own MEMORIZATION** — see "Wrap-up loop exception" row below |
| **Wrap-up loop exception** | `.gobbi/projects/{project-name}/features/{feature-name}/...` + `.gobbi/projects/{project-name}/{...project-memory dirs...}/` when `loop = wrap-up` | **WRITE + UPSERT** — Wrap-up's MEMORIZATION is the sole writer to project memory across the whole workflow. Wrap-up's procedure (in [`wrap-up/SKILL.md`](../wrap-up/SKILL.md)) details the staging→destination promotion routing. The "FORBIDDEN" rows above apply only when `loop ∈ {preparation, ideation, planning, execution}` |
| **Interview bootstrap exception** | `.gobbi/projects/{project-name}/{README.md,design/,decisions/,features/{feature-name}/,mistakes/,references/,backlogs/,skills/}` when the Interview skill runs in bootstrap mode (empty project memory) | **WRITE** — Interview is the one additional exception to the Wrap-up sole-writer rule. During bootstrap, Interview writes user-confirmed facts directly to project memory because there is no prior loop to wrap up from and no REVISE cycle to invalidate the writes. **Validation gate 5 is suspended in Interview bootstrap mode** — the gate that prohibits project-memory writes from loop MEMORIZATION does not apply here. In mature-project reruns, Interview writes to session staging (`sessions/.../interview/staging/`) and Wrap-up promotes; gate 5 is restored. See [`interview/SKILL.md` § Memory Access Matrix](../interview/SKILL.md#memory-access-matrix) and [`interview/SKILL.md` § Mature-project rerun](../interview/SKILL.md#mature-project-rerun) for the authoritative access rules. |

**Delete semantics**: the assistant NEVER deletes any file in any tier. Supersession is recorded via `disposition: superseded` on the staged finding's frontmatter (citing the superseding finding's ID); physical deletion is forbidden.

**Write enforcement**: any write attempted outside the WRITE / UPSERT rows above is a constraint violation. Code attempting writes to feature or project memory must be revoked and MEMORIZATION restarted.

---

## Core Principles

Cross-cutting principles for any agent that loads this skill while in the assistant role.

> **Staging, not immediate promote.**

Loop MEMORIZATION never writes to project memory (`features/{feature-name}/...`, `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/`). It writes to session memory's `staging/` subdirectories. Wrap-up reads accumulated staging across all loops and promotes deterministically per the routing table in [`wrap-up/SKILL.md`](../wrap-up/SKILL.md). This boundary is non-negotiable — a loop's MEMORIZATION touching project memory is a constraint violation.

> **Run after every EVALUATION verdict — PASS, REVISE, or FAIL.**

Every iteration preserves a transcript + iter entry in `session.json` regardless of outcome, so each iteration leaves a durable audit trail before the loop either restarts, escalates, or completes. Only `PASS` additionally writes the artifacts/ files and stages typed-finding artifacts. `REVISE` and `FAIL` stop after the transcript + session.json upsert; the FAIL path is the same as REVISE for persistence purposes — the manager escalates after MEMORIZATION runs.

> **Cumulative staging on PASS.**

When iter `n` reaches `PASS`, staging covers the **union** of (a) all `disposition: addressed` and `disposition: open` findings from this iter, and (b) findings carried forward from iter `1..n-1`. This guarantees no earlier-iter constructive finding silently disappears at PASS.

> **Idempotent CREATE / UPSERT operations.**

All `CREATE` operations write-or-overwrite the target path; all `session.json` updates use upsert keyed by `iter`. Re-running MEMORIZATION on the same iter produces identical results, never duplicates.

> **Constructive findings grow the artifact; adversarial findings drive REVISE.**

`scenario_gap` and `checklist_gap` findings from EVALUATION are staged for Wrap-up to append to feature memory. `design_flaw` and `assumption_risk` findings stage as deferred risks (or feed back into DISCUSSION on REVISE). See [evaluation/SKILL.md § Finding Metadata](../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity) for the complete Type + Domain → staging-subdir routing table.

> **Store what survives, not what's transient.**

`rawdata/` holds the unfiltered audit trail (drafts, transcripts, discussion-log). The `artifacts/` directory holds the distilled outputs the next loop reads. Staging is what Wrap-up will promote — be selective about what becomes a `staging/decisions/{slug}.md` vs noise.

> **Moment-of-capture, not end-of-loop.**

Corrections, decisions, and mistake-candidates are staged at the moment they occur during WORK — not deferred to the MEMORIZATION sub-phase. Deferral silently loses them when a session is interrupted. Empirical witness: session `2026-05-22-bac669ad` — T1 (8 eval files), T2 (13 eval files), T5 (9 eval files) each had full evaluations but empty staging, because capture was deferred and never completed. See [`mistake/SKILL.md` § P2](../mistake/SKILL.md#p2----detect-a-correction-during-work) for the moment-of-capture write procedure.

> **Templates over freeform — for staging. Frontmatter over freeform — for artifacts.**

Every staging subdirectory has a template at [`templates/{directory-name}.md`](templates/) — stamping the template ensures the artifact is structured enough for Wrap-up to promote without parsing prose. The `artifacts/` directory uses a lighter contract: filenames and content are free; only the frontmatter schema is mandatory (see § Artifact frontmatter schema below).

---

## Artifact frontmatter schema

Every file under `sessions/{date}-{session-id}/{loop}/artifacts/` MUST carry this YAML frontmatter. Filenames, file counts, and body content are free — the assistant picks whatever decomposition fits the loop's output best (`idea.md`, `framed-problem.md`, `scope-contract.md`, `design-options.md`, `task-list.md`, `handoff.md`, `memory-reads.md`, etc.). The frontmatter is the only structural constraint.

```yaml
---
loop: ideation | preparation | planning | execution | wrap-up
iter: {iter number that produced this artifact}
artifact_type: {short kebab-case label for this artifact's role — e.g., framed-problem, scope-contract, design-options, task-list, handoff, memory-reads}
created_at: YYYY-MM-DD
status: draft | final | superseded
supersedes: [{paths to prior-iter artifacts this replaces}]   # optional, empty when not applicable
related: [{related artifact paths inside or outside this dir}] # optional
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
| `related` | No | Cross-references inside `artifacts/` or to other session paths (staging entries, evaluation files) |

**Reserved artifact_type values** (assistant uses these when applicable; otherwise picks free labels):

| `artifact_type` | When written | Body |
|---|---|---|
| `memory-reads` | Every PASS iter | Enumerates every prior-iter evaluation file path the assistant consumed at Step 6 (`evaluation/iter{m}/{system}/{perspective}.md` for `m ∈ 1..n`, every system, every perspective). The manager validates this file's contents at MEMORIZATION-exit gate 4 |
| `handoff` | Wrap-up PASS only | The session's handoff summary — what shipped, open threads, decisions to respect, pointers to key artifacts. Wrap-up's principal output |
| `resolution-log` | Optional, PASS | Per-finding closure audit listing each evaluator finding across all iters with its final `disposition:` value |
| `cross-system-divergence` | PASS only when ≥ 2 systems ran evaluation | Records per-perspective disagreements between Claude / Codex evaluators (derived by comparing `evaluation/iter{n}/{system}/{perspective}.md` files). Filterable by downstream consumers via `artifact_type: cross-system-divergence` |

**Filename + collision policy for `artifacts/`**:

- Filenames are free-form kebab-case (e.g., `framed-problem.md`, `design-options.md`). Assistant picks based on content decomposition.
- **Same-iter re-run** (idempotent): assistant rewrites the same filename. `status` may stay `final`; content is deterministic from same sources. Overwriting is safe.
- **Re-iter rewrite (new iter on a topic the prior iter already covered)**: the new iter's MEMORIZATION writes a **new artifact file with a distinct filename** (e.g., `framed-problem-iter2.md` or `framed-problem-v2.md`) carrying `iter: n` and `supersedes: <path-to-prior-iter-file>`. The prior iter's file is updated in place: only its frontmatter changes (`status: superseded` + `superseded_by: <new-path>`); the body is preserved. **The prior-iter file is the only cross-iter mutation the assistant is authorized to make**, and it is mechanically a frontmatter-only update (no body rewrite).
- **Same-filename collision across iters** is forbidden — every iter's variant of a topic gets its own filename, never overwriting a different iter's file content. This is the contract that makes the audit history navigable both forward (`supersedes` → old) and backward (`superseded_by` → new).

**Promotion**: artifacts in `sessions/.../{loop}/artifacts/` stay session-scoped. Wrap-up does NOT promote them to project memory wholesale — instead, Wrap-up reads the artifacts to understand what shipped and may stage derivative project-memory entries (notes, decisions, learnings) through the standard staging→promotion route. The artifacts themselves remain in the session for audit.

---

## MEMORIZATION Phase

**Purpose**
Persist every iteration's evidence into session memory, and — on the final `PASS` iteration — also emit the loop's `artifacts/` files + cumulative typed-finding stagings. MEMORIZATION runs after **every** EVALUATION (whether `PASS`, `REVISE`, or `FAIL`) so each iteration leaves a durable audit trail before the loop either restarts or completes. Project memory is **not** written here.

**Inputs**
- Loop identity (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`) and iter number `n` (from manager)
- EVALUATION verdict (`PASS`, `REVISE`, or `FAIL`)
- `sessions/{date}-{session-id}/{loop}/rawdata/draft-iter{n}.md` — current iteration's WORK output
- `sessions/{date}-{session-id}/{loop}/evaluation/iter{m}/{system}/{perspective}.md` for `m ∈ 1..n` (cross-system divergence is derived by comparing per-system files; no separate divergence file is read)
- `session.json.transcriptPath` (tilde-expand `$HOME` on read) — manager-stamped transcript path; use `$CLAUDE_TRANSCRIPT_PATH` if reading directly from env (or harness equivalent under Codex). Claude Code transcript jsonl for the iteration window
- `sessions/{date}-{session-id}/{loop}/rawdata/discussion-log.md` — manager-captured AskUserQuestion exchanges
- Prior-iter staging (if `n ≥ 2` AND verdict is `PASS`) — findings carried forward per the cumulative-staging rule

**Procedure**

| # | When | Agent | Operation | Source | Target | Action |
|---|---|---|---|---|---|---|
| 1 | every iter | Assistant | **VERIFY** | Inputs above | — | Confirm `session.json` has `project`, `feature`, `task` set (Lock Scope completed during Ideation). Confirm `sessions/.../{loop}/{rawdata,staging,evaluation}/` exists; if a required subdir is missing, surface to manager and halt. Read all inputs (drafts, evaluator findings across all iters and systems, discussion log, transcript) |
| 2 | every iter | Assistant | **CREATE** | `session.json.transcriptPath` (tilde-expand `$HOME` on read; `$CLAUDE_TRANSCRIPT_PATH` if reading directly from env) | `sessions/{date}-{session-id}/{loop}/rawdata/transcript-iter{n}.jsonl` | Preserve raw transcript turns from this iteration's window (DISCUSSION start through verdict). Filter to this loop's turns; drop unrelated lines if the transcript spans multiple loops. Write-or-overwrite (idempotent on re-run). If `session.json.transcriptPath` (or `$CLAUDE_TRANSCRIPT_PATH`) is absent, record a Critical `general` finding (domain: `unevaluable`) at this step and continue |
| 3 | every iter | Assistant | **UPSERT** | This iter's verdict + iter number | `sessions/{date}-{session-id}/session.json` | Upsert `workflow.{loop}.iterations[]` entry keyed by `iter` with full schema `{iter, verdict, finishedAt, evaluation_dir: "evaluation/iter{n}/"}`. Idempotent on re-run: re-running for the same iter overwrites the entry, never appends a duplicate. Preserve all other session.json fields. Do **not** set `workflow.{loop}.finishedAt` (loop-level) yet — that is PASS-only, Step 8 |
| 4 | every iter | Assistant | **GUARD** | This iter's verdict | — | If verdict is `REVISE`: stop here. The loop re-enters DISCUSSION with this iter's evaluator findings as input. Steps 5–8 are skipped because there is no PASS-iter output yet. If verdict is `FAIL`: stop here. The manager will escalate to the user via AskUserQuestion (revise / abort / re-frame) after MEMORIZATION returns. Steps 5–8 are skipped. If verdict is `PASS`: continue to Step 5 |
| 5 | PASS only | Assistant | **CREATE** | Rawdata draft + all iters' evaluator findings + discussion log + cross-system divergence (derived by comparing per-system files) | `sessions/{date}-{session-id}/{loop}/artifacts/{free-filename}.md` (one or more files) | Decompose the loop's PASS-iter output into one or more artifact files inside `artifacts/`. Filenames are free; every file MUST stamp the [Artifact frontmatter schema](#artifact-frontmatter-schema). Typical content split: framed-problem, scope-contract, design-options for Ideation; task-list, dependencies, agent-assignments for Planning; change-summary, verification-report for Execution; handoff, shipped-summary for Wrap-up. Two artifacts are MANDATORY: (a) one `artifact_type: memory-reads` file enumerating every prior-iter evaluation file path consumed at Step 6 (manager validates at gate 4), and (b) for loops with adversarial evaluator findings, one `artifact_type: resolution-log` file listing each finding's final `disposition:` value. Cross-system divergence summary lives in whichever artifact most relevant (e.g., design-options or handoff). The artifacts collectively are the next loop's briefing source |
| 6 | PASS only | Assistant | **CREATE** | All typed findings, cumulative across iters `1..n` | `sessions/{date}-{session-id}/{loop}/staging/{type}/{slug}.md` per the deterministic Type + Domain routing in [`evaluation/SKILL.md` § Finding Metadata](../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity) | **Pre-step**: for every iter `m ∈ 1..n`, every system (claude + codex), every perspective (7 + overall), READ `sessions/.../{loop}/evaluation/iter{m}/{system}/{perspective}.md`. Enumerate every finding's `(Type, Domain, Disposition, slug, finding-id)`. For any `disposition: superseded` whose citation points to iter `m < n-1`, also READ that earlier iter's file. Then: stage `open` + `addressed` + `disputed` + `superseded` findings per the routing table; `deferred` findings stage at `staging/decisions/` with frontmatter `disposition: deferred` so Wrap-up can route to backlogs. **No shortcut routing** — every Type + Domain uses the canonical table; `general/general` is a contract violation |
| 7 | PASS only | Assistant | **CREATE** | Canonical draft's Design section + discussion-log substantive topics + in-loop review activities + in-loop substantive reports | `sessions/{date}-{session-id}/{loop}/staging/{design,discussions,reviews,reports}/{slug}.md` | One staging file per substantive design topic (`staging/design/`) + per substantive AskUserQuestion topic (`staging/discussions/`) + per review/evaluation/audit activity the loop performed (`staging/reviews/` per [`templates/reviews.md`](templates/reviews.md)) + per substantive `status` / `post-mortem` / `analytics` report the loop produced (`staging/reports/` per [`templates/reports.md`](templates/reports.md)). The reviews/reports stagings are loop-conditional — most loops produce none, but when present they MUST be staged for Wrap-up promotion |
| 8 | PASS only | Assistant | **UPDATE** | Loop completion | `sessions/{date}-{session-id}/session.json` | Set `workflow.{loop}.finishedAt`; set `workflow.{loop}.verdict: PASS`; preserve `iterations[]` history |
| 9 | every iter | Assistant | **VERIFY** | All outputs above | — | Transcript preserved at `rawdata/transcript-iter{n}.jsonl`; `session.json` iter entry upserted; no writes to project memory (manager validates). PASS additionally: canonical artifact exists; staging directories populated per finding-type routing; loop completion flagged in session.json. Failure of any check is reported to the manager |

**Finding routing** — see [`evaluation/SKILL.md` § Finding Metadata](../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity) for the complete Type + Domain → staging-subdir routing table. MEMORIZATION applies the routing table without improvisation; all destinations are session staging (Wrap-up moves them to project memory).

**Research rawdata promotion** — if the calling loop loaded the `research` skill, the leader will have written external insights to `rawdata/research/{slug}.md` during WORK. At Step 6 (PASS only), MEMORIZATION reads `rawdata/research/` and promotes each file to `staging/references/{slug}.md` per the [references template](templates/references.md). This is separate from the typed-finding routing above — these are WORK-time external references, not evaluation findings.

**Cumulative staging across iterations**: when iter `n` reaches `PASS`, MEMORIZATION stages the **union** of (a) all `disposition: addressed` and `disposition: open` findings from this iter, and (b) all `disposition: addressed` and `disposition: open` findings carried forward from iter `1..n-1` (sourced by reading prior iter per-perspective files). `disposition: superseded` findings stage with frontmatter `superseded_by: <new-finding-id>` (pointing forward at the replacing finding); the replacing finding's frontmatter has `supersedes: <old-finding-id>` (pointing back at what it replaces). `disposition: disputed` findings stage to `staging/decisions/` with dispute rationale. `disposition: deferred` findings stage to `staging/decisions/` with frontmatter `disposition: deferred` so Wrap-up routes them to `backlogs/`. This guarantees no `PASS`-iter staging silently drops earlier-iter findings.

**Slug + collision policy**: per [`evaluation/SKILL.md` § Slug + collision policy](../evaluation/SKILL.md#slug--collision-policy). Slug derived from finding's primary symptom; finding-id is the idempotency key for re-runs and collisions.

**Discussion-log lifecycle**: `sessions/.../{loop}/rawdata/discussion-log.md` is created by the **manager** during DISCUSSION and appended after each AskUserQuestion exchange — one section per exchange with format `## YYYY-MM-DD HH:MM — Q: ... | A: ... | Decision: ...`. REVISE iterations preserve the prior discussion-log; new iter exchanges are appended in chronological order in the same file. MEMORIZATION reads this file at Step 1 (input load) and Step 7 (discussions staging); MEMORIZATION never writes to discussion-log.

**Outputs**

Every iteration produces:
- `sessions/{date}-{session-id}/{loop}/rawdata/transcript-iter{n}.jsonl` — preserved transcript window
- `sessions/{date}-{session-id}/session.json` — upserted `workflow.{loop}.iterations[]` entry keyed by `iter`

Only the `PASS` iteration also produces:
- `sessions/{date}-{session-id}/{loop}/artifacts/{free-filename}.md` — one or more artifact files (the loop's PASS-iter output; collectively serve as the next loop's briefing source). Mandatory: at least one `artifact_type: memory-reads` file. Loop-conditional: `artifact_type: resolution-log` when there were findings to close out
- `sessions/{date}-{session-id}/{loop}/staging/{scenarios,checklists,decisions,references,design,discussions,reviews,reports,changelogs,learnings,notes}/{slug}.md` — typed-finding artifacts + design / discussions / reviews / reports / changelogs / learnings / notes stagings for Wrap-up to promote
- `sessions/{date}-{session-id}/{loop}/staging/backlogs/{feature,project}/{slug}.md` — backlog entries with feature-scope vs project-scope subdirs
- `sessions/{date}-{session-id}/planning/staging/plans/{slug}.md` — Planning-loop only (plan artifact for Wrap-up to promote to `features/{feature-name}/plans/`)
- `sessions/{date}-{session-id}/session.json` — `workflow.{loop}.finishedAt` and `workflow.{loop}.verdict: PASS` set

**No writes to project memory.** All `features/{feature-name}/...`, `.gobbi/projects/{project-name}/{mistakes,rules,design,notes,backlogs,references,decisions,plans,reviews,reports,learnings,archive}/` writes are Wrap-up's responsibility per [`wrap-up/SKILL.md`](../wrap-up/SKILL.md).

**Exit checklist**

Every iteration:
- [ ] Transcript jsonl preserved at `rawdata/transcript-iter{n}.jsonl`
- [ ] `session.json.workflow.{loop}.iterations[]` includes this iter's `{iter, verdict, finishedAt, evaluation_dir: "evaluation/iter{n}/"}` (full schema; do not omit `evaluation_dir`)
- [ ] No writes to feature memory or project memory

`PASS` iteration additionally:
- [ ] `artifacts/` directory contains one or more files, each carrying valid frontmatter per [Artifact frontmatter schema](#artifact-frontmatter-schema)
- [ ] At least one artifact has `artifact_type: memory-reads` (the cumulative-staging audit surface)
- [ ] Every evaluator finding across iters `1..n` staged to the correct `staging/` destination per Type + Domain routing
- [ ] Design / discussions derivables staged under `staging/`
- [ ] `session.json.workflow.{loop}.finishedAt` and final `verdict: PASS` set
- [ ] Cumulative-staging union (current iter + prior iters) verified — no earlier-iter constructive finding dropped

---

## Idempotency contract

Re-running MEMORIZATION on the same iter (after a crash, partial write, or explicit re-invocation) MUST produce identical results:

| Operation | Idempotent because |
|---|---|
| CREATE `transcript-iter{n}.jsonl` | Write-or-overwrite. Deterministic source + filter |
| UPSERT `session.json.iterations[]` | Keyed by `iter` — re-runs replace, never duplicate |
| CREATE `artifacts/{free-filename}.md` (PASS) | Write-or-overwrite per filename. Deterministic synthesis from same sources — same iter, same decomposition. Filenames stay stable across re-runs of the same iter; only `iter` + `status` frontmatter increment across re-iters |
| CREATE `staging/{type}/{slug}.md` (PASS) | Slug derived from finding's primary symptom + finding-id idempotency key. Collision policy adds `-2`/`-3` suffix for distinct finding-ids, overwrites for matching finding-ids |
| UPDATE `session.json` `finishedAt` + `verdict` (PASS) | Set, not append |

---

## Output paths

All writes during MEMORIZATION are **session-scoped**. Wrap-up promotes the `staging/` directory to project memory after the workflow completes — see [`wrap-up/SKILL.md`](../wrap-up/SKILL.md). For the full inventory across both tiers (session + project), see [`memory-map.md`](memory-map.md).

**Path conventions**

- `{date}` — session start date in `YYYY-MM-DD`
- `{session-id}` — Claude Code session ID from `$CLAUDE_CODE_SESSION_ID` (or the Codex session ID under Codex). Must be the harness-emitted session ID, not an arbitrary hash
- `{loop}` — the workflow loop being persisted (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`)
- `{feature-name}` — feature slug (only used by Wrap-up when promoting to project memory; not used inside session paths)
- `{slug}` — slug for a specific artifact, set by the writer at stage time
- `{n}` — iter number, supplied by the manager from `session.json.workflow.{loop}.iterations.length`

| Path | Written by | Written |
|---|---|---|
| `sessions/{date}-{session-id}/{loop}/rawdata/transcript-iter{n}.jsonl` | assistant (MEMORIZATION) | every iteration — preserved transcript window |
| `sessions/{date}-{session-id}/session.json` | assistant (MEMORIZATION) | every iteration — upserted iter entry; PASS additionally sets `finishedAt` + `verdict` |
| `sessions/{date}-{session-id}/{loop}/artifacts/{free-filename}.md` | assistant (MEMORIZATION) | PASS only — one or more artifact files. Each MUST carry the Artifact frontmatter schema. Mandatory: ≥ 1 file with `artifact_type: memory-reads` |
| `sessions/{date}-{session-id}/{loop}/staging/scenarios/{slug}.md` | assistant (MEMORIZATION) | PASS only — per `scenario_gap` finding |
| `sessions/{date}-{session-id}/{loop}/staging/checklists/{slug}.md` | assistant (MEMORIZATION) | PASS only — per `checklist_gap` finding |
| `sessions/{date}-{session-id}/{loop}/staging/decisions/{slug}.md` | assistant (MEMORIZATION) | PASS only — per `design_flaw` / `assumption_risk` / `disputed` / `deferred` finding + Domain-routed `general` findings |
| `sessions/{date}-{session-id}/{loop}/rawdata/research/{slug}.md` | leader (WORK — research) | Written by leader during WORK when the research skill is loaded; one per confirmed external insight. READ by MEMORIZATION at Step 6 for promotion. |
| `sessions/{date}-{session-id}/{loop}/staging/references/{slug}.md` | assistant (MEMORIZATION) | PASS only — promoted from `rawdata/research/{slug}.md` (research externals) + per `general` finding with Domain = `dependency` |
| `sessions/{date}-{session-id}/{loop}/staging/design/{slug}.md` | assistant (MEMORIZATION) | PASS only — per substantive design topic |
| `sessions/{date}-{session-id}/{loop}/staging/discussions/{slug}.md` | assistant (MEMORIZATION) | PASS only — per substantive AskUserQuestion topic |
| `sessions/{date}-{session-id}/{loop}/staging/backlogs/feature/{slug}.md` | assistant (MEMORIZATION) | PASS only — feature-scope backlog candidates |
| `sessions/{date}-{session-id}/{loop}/staging/backlogs/project/{slug}.md` | assistant (MEMORIZATION) | PASS only — project-scope backlog candidates |
| `sessions/{date}-{session-id}/{loop}/staging/reviews/{slug}.md` | assistant (MEMORIZATION) | PASS only — review/evaluation/audit activity result documents (loop-conditional) |
| `sessions/{date}-{session-id}/{loop}/staging/reports/{slug}.md` | assistant (MEMORIZATION) | PASS only — `status` / `post-mortem` / `analytics` reports (loop-conditional) |
| `sessions/{date}-{session-id}/{loop}/staging/changelogs/{slug}.md` | assistant (MEMORIZATION) | PASS only — shipped-work changelog entries (Execution loop typical) |
| `sessions/{date}-{session-id}/{loop}/staging/learnings/{slug}.md` | assistant (MEMORIZATION) | PASS only — durable cross-cutting insights (loop-conditional) |
| `sessions/{date}-{session-id}/{loop}/staging/notes/{slug}.md` | assistant (MEMORIZATION) | PASS only — loop-scope journal entry (rare; per-session journal is written at Wrap-up) |
| `sessions/{date}-{session-id}/planning/staging/plans/{slug}.md` | assistant (MEMORIZATION) | Planning loop only, PASS only — plan artifact for Wrap-up to promote to `features/{feature-name}/plans/`. **Not in other loops' staging trees** |

The session directory tree at `sessions/{date}-{session-id}/{loop}/{rawdata,staging,evaluation}/` is bootstrapped by the manager during the loop's DISCUSSION (Lock Scope for Ideation; equivalent setup point for downstream loops). MEMORIZATION assumes the tree exists on entry and surfaces an error to the manager if it does not.

---

## Templates

Staging subdirectory templates live at [`templates/`](templates/). Each template defines required fields, "when to stage" trigger, and frontmatter schema. The assistant MUST stamp the matching template for every staging file — freeform writes are forbidden. For a template-→-directories cross-index (which directories each template stamps), see [`memory-map.md` § Templates index](memory-map.md#templates-index).

| Staging subdirectory | Template |
|---|---|
| `staging/scenarios/` | [`templates/scenarios.md`](templates/scenarios.md) |
| `staging/checklists/` | [`templates/checklists.md`](templates/checklists.md) |
| `staging/decisions/` | [`templates/decisions.md`](templates/decisions.md) |
| `staging/references/` | [`templates/references.md`](templates/references.md) |
| `staging/design/` | [`templates/design.md`](templates/design.md) |
| `staging/discussions/` | [`templates/discussions.md`](templates/discussions.md) |
| `staging/backlogs/feature/` | [`templates/backlogs.md`](templates/backlogs.md) |
| `staging/backlogs/project/` | [`templates/backlogs.md`](templates/backlogs.md) |
| `staging/reviews/` | [`templates/reviews.md`](templates/reviews.md) |
| `staging/reports/` | [`templates/reports.md`](templates/reports.md) |
| `staging/changelogs/` | [`templates/changelogs.md`](templates/changelogs.md) |
| `staging/learnings/` | [`templates/learnings.md`](templates/learnings.md) |
| `staging/notes/` | [`templates/notes.md`](templates/notes.md) |
| `staging/plans/` (Planning-loop only) | [`templates/plans.md`](templates/plans.md) |

Project-memory directory templates (consumed by Wrap-up, not by loop MEMORIZATION) also live under [`templates/`](templates/) — they are the destination schemas Wrap-up stamps when promoting staging content:

| Project-memory directory | Template |
|---|---|
| `.gobbi/projects/{project-name}/features/{feature-name}/README.md` | [`templates/feature-readme.md`](templates/feature-readme.md) |
| `.gobbi/projects/{project-name}/mistakes/` and `features/{feature-name}/mistakes/` | [`templates/mistakes.md`](templates/mistakes.md) |
| `.gobbi/projects/{project-name}/rules/` | [`templates/rules.md`](templates/rules.md) |

Session-level templates: see [`orchestration/templates/`](../orchestration/templates/) for `settings.default.json` and `session.template.json`.

---

## Constraints

- **MUST run on every EVALUATION verdict** (PASS, REVISE, and FAIL) — REVISE and FAIL iterations still preserve transcript + session.json entry. The FAIL persistence branch is identical to REVISE: every-iter outputs only, no Steps 5–8.
- **MUST be idempotent** — per the contract above; re-running on the same iter produces identical results.
- **MUST stage findings cumulatively on PASS** — union across iters `1..n`; no earlier-iter constructive finding silently dropped.
- **MUST stamp templates** — never write freeform to a staging subdirectory; see [`templates/`](templates/).
- **MUST preserve all iterations' rawdata** — earlier iter drafts and transcripts remain alongside the current iter's.
- **MUST be read-only against the artifact AND all memory tiers except own write surfaces** — never modify leader / executor drafts; never write to feature memory, project memory, prior loops' session dirs, or other systems' evaluation dirs. The ONLY allowed write surfaces are listed in § Memory Access Matrix.
- **MUST NEVER write to project memory when `loop ∈ {preparation, ideation, planning, execution}`** — no `features/{feature-name}/...`, `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/`, `references/`, `decisions/`, `plans/`, `reviews/`, `reports/`, `learnings/`, `archive/` writes from those loops' MEMORIZATION. Wrap-up's MEMORIZATION owns those writes (see Memory Access Matrix § Wrap-up loop exception).
- **MUST NEVER create feature directories when `loop ∈ {preparation, ideation, planning, execution}`** — `features/{feature-name}/` is bootstrapped by Wrap-up at promotion time, not earlier.
- **MUST NEVER delete** — supersession via `disposition: superseded` field; physical deletion of any file in any tier is forbidden.
- **MUST extend `session.json` only via UPSERT keyed by `iter`** — own loop's fields only; all other session.json fields preserved verbatim.
- **MUST apply Type + Domain routing without improvisation** — every staging destination follows the canonical table in `evaluation/SKILL.md`; `general/general` is a contract violation.
