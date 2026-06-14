# Workflow — Record (Orchestration)

How the **manager** orchestrates the RECORD sub-phase that runs at the end of every loop iteration. This document is loaded by the manager — the `assistant` agent that actually performs the synthesis loads [`record/SKILL.md`](../../record/SKILL.md) and [`memory/memory-map.md`](../../memory/memory-map.md) instead.

The manager's job at RECORD is to **spawn the assistant, deliver the right inputs, validate the assistant's output mechanically, and advance the loop** — not to do the synthesis itself. RECORD runs **after every EVALUATION verdict** (`PASS`, `REVISE`, or `FAIL`) and **before** the `ITER / EXIT` decision: every iteration's evidence must be preserved before the loop either re-enters DISCUSSION or exits.

All assistant writes are **session-scoped** under `sessions/{date}-{session-id}/{N}-{loop}/...` plus own-loop fields in `session.json`. The assistant **never** writes to memory; Wrap-up is the sole writer there. The manager validates this invariant via post-write snapshot diff. For the canonical session-tree shape — the `{N}-{loop}/` ordinal map, the 4-slot loop interior (`working/`, `evaluation/`, `staging/`, `outputs/`), and the single session-root `transcripts/` — see [`record/record-map.md`](../../record/record-map.md), the single source of truth.

---

## Why every-iter RECORD is mandatory

Skipping RECORD on `REVISE` iterations is a tempting "optimization" — the canonical artifact isn't written yet, so why preserve anything? The answer is **audit completeness**:

1. **Stage 1 inheritance** at iter `n` requires reading iter `(n-1)` per-perspective files directly. Those files are written by evaluators, not by RECORD — but RECORD is what preserves the transcript and the `session.json.workflow.{loop}.iterations[]` entry that makes "what happened at iter (n-1)" reconstructable for the user, for review, and for evidence-of-process when a session is paused and resumed days later.
2. **Crash recovery** depends on every iter having a written `iterations[]` entry. A REVISE iter that skipped RECORD leaves a hole — the next session-start cannot know whether iter (n-1) actually completed or partially crashed.
3. **Cumulative staging on PASS** sources from iter 1..n's evaluation files. The PASS-iter RECORD reads prior iters as inputs; if prior iters skipped persistence, the union is incomplete.

The cost (writing one jsonl + upserting one JSON entry) is trivial; the audit and recovery guarantees from running on every verdict are not.

---

## Spawning the Assistant

The manager spawns **one** `assistant` agent per RECORD run — there is no dual-system parallelism here (RECORD is deterministic synthesis, not adversarial review). The assistant runs once per loop iteration.

### Delegation prompt fields

Every RECORD delegation prompt MUST declare the following — a one-liner or missing field forces the assistant to guess, and a guessing assistant guesses wrong:

| Field | Value |
|---|---|
| **Loop identity** | `ideation` / `preparation` / `planning` / `execution` / `wrap-up` |
| **Iter number `n`** | From `session.json.workflow.{loop}.iterations.length + 1` for a fresh run, or the existing iter for a re-run |
| **Verdict** | `PASS` / `REVISE` / `FAIL` from EVALUATION (the RECORD procedure branches on this) |
| **Outputs directory target path** | e.g., `sessions/{date}-{session-id}/1-ideation/outputs/` — only written on `PASS`. Assistant decomposes the loop's output into one or more frontmatter-tagged files inside this directory; filenames and counts are free (see [`record/SKILL.md` § Artifact frontmatter schema](../../record/SKILL.md#artifact-frontmatter-schema)) |
| **Type + Domain → staging-subdir routing** | Link to [`evaluation/SKILL.md` § Finding Metadata](../../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity) — disposition values, routing table, slug + collision policy are sourced from here, not duplicated |
| **Memory access matrix** | Link to [`memory/memory-map.md`](../../memory/memory-map.md) — every path the assistant may READ + WRITE, plus FORBIDDEN paths |
| **READ-ONLY paths to consult** | Prior loops' canonical outputs (for cross-loop synthesis); the discussion log; **all** prior-iter per-perspective evaluation files for `m ∈ 1..n` (cumulative staging requirement) |
| **FORBIDDEN write surfaces** | `.gobbi/projects/{project-name}/features/**`, `.gobbi/projects/{project-name}/{mistakes,rules,design,notes,backlogs,decisions,plans,references,reviews,reports,learnings,archive}/**`, other loops' session directories, other systems' evaluation directories. Wrap-up owns memory; loop RECORD never touches it |
| **Discussion-log handling** | Read-only — assistant reads `working/discussion-log.md` at Step 1 (input load) and Step 7 (discussions staging). The **manager** owns appends during DISCUSSION; the assistant never writes to it |

### Pre-spawn checks

Before spawning, the manager verifies:

- `sessions/{date}-{session-id}/{N}-{loop}/{working,staging,evaluation}/` subtree exists (scaffolded at the loop's entry). Missing subdir → surface to user; do not spawn
- `session.json` has `project`, `feature`, `task` set (Lock Scope completed during Ideation). Missing scope → surface to user; do not spawn
- The current iter's WORK output exists at `working/draft-iter{n}.md`. Missing draft → escalate; cannot synthesize without a draft
- The current iter's evaluator output exists at `evaluation/iter{n}/{system}/{perspective}.md` for every system × perspective. Missing eval files → cannot route findings; escalate

---

## Collecting Outputs

After the assistant completes, the manager finds — at minimum — this tree:

### Every iter (PASS or REVISE or FAIL)

```
sessions/{date}-{session-id}/
├── transcripts/{role}-{agentId}.jsonl  ← each agent's transcript copied into the single
│                                          session-root transcripts/ (accumulating across loops)
└── session.json (updated)              ← workflow.{loop}.iterations[] upserted entry
```

### Additionally on PASS

```
sessions/{date}-{session-id}/{N}-{loop}/
├── outputs/                        ← PASS-iter output files (free filenames + mandatory frontmatter)
│   ├── {free-filename-1}.md       ← e.g., framed-problem.md, scope-contract.md
│   ├── {free-filename-2}.md
│   └── memory-reads.md             ← mandatory: artifact_type: memory-reads
└── staging/
    ├── scenarios/{slug}.md        ← per scenario_gap finding (cumulative across iters)
    ├── checklists/{slug}.md       ← per checklist_gap finding
    ├── decisions/{slug}.md        ← per design_flaw, assumption_risk, disputed,
    │                                  deferred + Domain-routed general findings
    ├── references/{slug}.md       ← per dependency-domain general finding
    ├── design/{slug}.md           ← per substantive Design-section topic
    ├── discussions/{slug}.md      ← per substantive user-decision topic
    ├── reviews/{slug}.md          ← per review/evaluation/audit activity (loop-conditional)
    ├── reports/{slug}.md          ← per status/post-mortem/analytics report (loop-conditional)
    ├── backlogs/
    │   ├── feature/{slug}.md      ← feature-scope deferred work
    │   └── project/{slug}.md      ← project-scope deferred work
    ├── changelogs/{slug}.md       ← per shipped-work changelog entry (Execution loop typical)
    ├── learnings/{slug}.md        ← per durable insight (loop-conditional)
    └── notes/{slug}.md            ← per loop-scope journal entry (loop-conditional; the per-session note is written at Wrap-up)
```

Planning loop additionally produces `3-planning/staging/plans/{slug}.md` (the plan artifact Wrap-up promotes to `features/{feature-name}/plans/{date}-{slug}.md`); `plans/` is **Planning-only** and does not appear in other loops' staging trees. Wrap-up loop's RECORD is structurally different — see [`workflow/wrap-up.md`](wrap-up.md).

### Per-loop summary table

| Loop | Session outputs path (PASS only) | working path | staging path |
|---|---|---|---|
| Ideation | `1-ideation/outputs/` (typical files: framed-problem, scope-contract, design-options, memory-reads, resolution-log) | `1-ideation/working/` | `1-ideation/staging/{scenarios,checklists,decisions,references,design,discussions,reviews,reports,backlogs/{feature,project},changelogs,learnings,notes}/` |
| Planning | `3-planning/outputs/` (typical files: task-list, dependency-graph, agent-assignments, memory-reads) | `3-planning/working/` | `3-planning/staging/{plans,scenarios,checklists,decisions,references,design,discussions,reviews,reports,backlogs/{feature,project},changelogs,learnings,notes}/` |
| Execution | `4-execution/outputs/` (typical files: change-summary, verification-report, memory-reads) | `4-execution/working/` | `4-execution/staging/{scenarios,checklists,decisions,references,design,discussions,reviews,reports,backlogs/{feature,project},changelogs,learnings,notes}/` |
| Wrap-up | `5-wrap-up/outputs/` (typical files: handoff, shipped-summary, next-session-pointers, memory-reads) | `5-wrap-up/working/` | Wrap-up does not stage — it writes directly to memory per [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md) |

---

## Output Validation

Validation is **mechanical** and **comprehensive** — every assistant output passes through these gates before the manager advances to `ITER / EXIT`. A single failed gate triggers the failure-handling policy below.

### 1. File presence

Every iter:

- [ ] `sessions/{date}-{session-id}/transcripts/{role}-{agentId}.jsonl` exists for each agent that ran this iter and is > 0 bytes
- [ ] `session.json` exists and parses as valid JSON
- [ ] No new feature directory was created at `.gobbi/projects/{project-name}/features/{feature-name}/` (Wrap-up's territory)

`PASS` additionally:

- [ ] `outputs/` directory exists, contains ≥ 1 file, and every file is > 0 bytes
- [ ] At least one file in `outputs/` has `artifact_type: memory-reads` in its frontmatter (the cumulative-staging audit surface — see gate 4)
- [ ] At least one of the staging subdirectories is non-empty (every `PASS` iteration produces at least one staged artifact — even a clean PASS with no constructive findings stages the Design / Discussions derivatives)
- [ ] Planning loop only: `3-planning/staging/plans/{slug}.md` exists (the loop's principal output)

### 2. `session.json` integrity

Every iter:

- [ ] `workflow.{loop}.iterations[]` contains an entry whose `iter` equals the current iter number
- [ ] No duplicate `iter` keys in `iterations[]` (UPSERT idempotency)
- [ ] Each entry has the full schema: `{iter, verdict, finishedAt, evaluation_dir}` — no field missing, `evaluation_dir` matches `evaluation/iter{n}/`
- [ ] `project`, `feature`, `task` fields preserved verbatim (not overwritten by RECORD)
- [ ] All other top-level fields preserved verbatim

`PASS` additionally:

- [ ] `workflow.{loop}.finishedAt` is set (ISO 8601 timestamp)
- [ ] `workflow.{loop}.verdict` equals `PASS`
- [ ] `iterations[]` history retained — earlier entries not removed or rewritten

### 3. Routing compliance

Validation is split by **staging class**, determined by frontmatter — not by directory. The same directory (e.g., `staging/scenarios/`) can hold both **finding-routed** files (output of Type+Domain routing from evaluator findings) and **derivative** files (whole-document outputs the assistant produces directly, like an Ideation Step-4 scenario that didn't come from an evaluator finding). The discriminator is the **`finding-id` frontmatter field**:

- A staging file with `finding-id` in its frontmatter is **finding-routed** → gate 3a applies
- A staging file without `finding-id` is **derivative** → gate 3b applies
- Files under `outputs/` are validated by gate 3c

**3a. Finding-routed staging** (any file with `finding-id` frontmatter, in any staging subdirectory). For each such file produced on `PASS`:

- [ ] Frontmatter parses as YAML
- [ ] `Type` field is one of `scenario_gap` / `checklist_gap` / `design_flaw` / `assumption_risk` / `general` (5 values)
- [ ] `Domain` field is one of the 15+ canonical values from [`evaluation/SKILL.md` § Domain](../../evaluation/SKILL.md#domain-required-when-applicable). A `Type: general` + `Domain: general` pair is a contract violation
- [ ] `Disposition` field is one of `open` / `addressed` / `disputed` / `deferred` / `superseded` (5 values)
- [ ] Staging subdirectory matches the Type + Domain → routing table in [`evaluation/SKILL.md`](../../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity)
- [ ] `finding-id` is a stable identifier (UUID-like or content-hash); set on first creation, preserved across iterations
- [ ] Slug derived from the finding's primary symptom; collisions follow `-2` / `-3` suffix rule

**3b. Derivative staging** (any file WITHOUT `finding-id` frontmatter — i.e., assistant-authored domain artifacts such as Ideation-Step-4 scenarios, Planning-Step-2 design decisions, Wrap-up status reports). For each such file produced on `PASS`:

- [ ] Frontmatter parses as YAML and matches the corresponding template's required-frontmatter schema (see [`memory/templates/{type}.md`](../../memory/templates/))
- [ ] No `Type` / `Domain` / `Disposition` / `finding-id` fields are required — these are domain-specific staging, not finding-routed
- [ ] Slug is kebab-case ≤ 60 characters; collisions follow `-2` / `-3` suffix rule
- [ ] If the template declares a `status` enum (e.g., `status: open | acted-on | superseded`), the staged file's `status` is one of those values

**3c. Outputs directory** — files under `outputs/`. For each file:

- [ ] Frontmatter parses as YAML and contains all required fields from the [Artifact frontmatter schema](../../record/SKILL.md#artifact-frontmatter-schema): `loop` / `iter` / `artifact_type` / `created_at` / `status`
- [ ] `status` is one of `draft` / `final` / `superseded` (the artifact-frontmatter enum — distinct from template-specific `status` enums in 3b)
- [ ] `loop` matches the current loop identity
- [ ] `iter` matches the current or a prior iter number

**Why frontmatter-based not directory-based**: an Ideation RECORD run produces both finding-routed scenarios (from `scenario_gap` evaluator findings — these carry `finding-id`) AND derivative scenarios (the leader's Step-4 enumeration — these do NOT carry `finding-id`). Both live in `staging/scenarios/`. A directory-based gate would force the derivative scenarios to carry finding metadata they don't have, blocking a valid PASS. The frontmatter discriminator lets both coexist.

A file with `finding-id` lacking Type+Domain+Disposition is a gate 3a failure. A file without `finding-id` using Type/Domain frontmatter where the template doesn't declare it is a gate 3b failure (frontmatter contract violation).

### 4. Cumulative staging completeness

`PASS` only — manager verifies the assistant read every prior iter's evaluation files via the **`memory-reads` artifact** the assistant writes into `outputs/` at Step 5 (per [`record/SKILL.md`](../../record/SKILL.md) procedure):

- [ ] `outputs/` contains at least one file whose frontmatter declares `artifact_type: memory-reads`
- [ ] For every `m ∈ 1..n`, every **system that actually ran evaluation in iter `m`** (one or both of `claude` / `codex`), every perspective: the memory-reads artifact cites `sessions/.../{N}-{loop}/evaluation/iter{m}/{system}/{perspective}.md`. Expected path count = `Σ (systems_run_in_iter_m) × 8 (7 perspectives + overall)` for `m ∈ 1..n` (degraded-mode-aware; do not assume a fixed `16n` when single-system evaluation was used for some iters)
- [ ] Every cited path resolves to an existing file (manager runs `test -f` per cited path)
- [ ] Every prior-iter `disposition: open` finding is reflected somewhere — either staged (Type-routed), or staged with `disposition: addressed`, or staged with `disposition: superseded`, or referenced in an `artifact_type: resolution-log` file. A prior-iter `open` finding that vanishes silently is a Stage-1-inheritance failure (also caught at EVALUATION; this is the second gate)
- [ ] No constructive finding (`scenario_gap` / `checklist_gap`) from any prior iter is missing from the cumulative staging union

### 5. Memory untouched (system-wide invariant — applies only when `loop ∈ {preparation, ideation, planning, execution}`)

When `loop ∈ {preparation, ideation, planning, execution}` — the manager checks for unauthorized writes under `.gobbi/projects/{project-name}/` outside `sessions/`. **Scoped diff to avoid false positives** from concurrent git/worktree activity:

- [ ] List of paths the assistant **wrote** during RECORD (collected from the manager's spawn-time tool log, not from a raw filesystem snapshot) contains zero paths under `.gobbi/projects/{project-name}/{features,mistakes,rules,design,notes,backlogs,decisions,plans,references,reviews,reports,learnings,archive}/`
- [ ] As a corroborating check: `git diff --name-only` (worktree-only, excluding `sessions/`) shows no path under those memory subdirectories that wasn't already modified at RECORD-start (compare against the pre-spawn `git status` snapshot the manager captures)

The dual-check (write-log + git-diff) eliminates the false-positive class where unrelated filesystem activity (IDE auto-save, git worktree operations) coincides with RECORD runtime. Only the assistant's actual write log is the authoritative signal; the git diff is corroboration.

A non-empty assistant write log into forbidden paths is an **immediate stop-the-line** — the assistant violated the staging→Wrap-up boundary; the loop halts and the manager escalates to user through the active runtime's user-decision primitive before any further progress.

**Wrap-up loop exemption**: when `loop = wrap-up`, this gate is **inverted**. The assistant IS expected to write to memory (Wrap-up is the sole writer there). The manager validates Wrap-up's writes against [`wrap-up/SKILL.md` § Staging → Memory routing](../../wrap-up/SKILL.md#staging--memory-routing) instead — each write must trace back to a staged source per the routing table.

### 6. Templates stamped

Every staging file's frontmatter is compared against its template at [`memory/templates/{type}.md`](../../memory/templates/) — required fields present, no `TODO` / `TBD` / `<...>` placeholders. Missing template fields → routing-compliance failure (gate 3).

### 7. Discussion-log integrity (read-only invariant)

- [ ] `working/discussion-log.md`'s mtime is unchanged after RECORD (assistant must not write to it; only the manager appends during DISCUSSION)

---

## Failure Handling

Same shape as [`workflow/evaluation.md` § Dual-system failure handling](evaluation.md#dual-system-failure-handling). The RECORD assistant is single-system, but the validation-and-retry discipline is identical.

### Retry policy

- **One retry** on: transient error / wall-clock exhaustion before first file written / malformed output rejected at any validation gate
- **No retry** on: validation passed but content review revealed semantic problems (the assistant did the mechanical work right; semantics are a DISCUSSION concern, not a RECORD concern)
- **No retry** on: memory boundary violation (gate 5) — this is a contract violation, not a transient failure; the assistant is restarted with a corrected scope, not silently re-run
- Retries inherit the same prompt + inputs; no parameter tuning between attempts

### Degraded-mode policy

If after retry the assistant still fails:

| Scenario | Manager action |
|---|---|
| Validation fails at gates 1–4 or 6–7 (mechanical or routing) | **Stop-the-line — fail-closed**: active runtime user decision — "RECORD assistant failed validation gate X (details). Options: (a) manual repair + re-validate (assistant or user writes the minimal transcript + session.json iter entry by hand, then gate re-runs), (b) halt the loop and re-enter DISCUSSION. There is no skip-RECORD option — every iter must persist an audit trail per § Why every-iter RECORD is mandatory." User decides between (a) and (b) |
| Memory boundary violation (gate 5) | **Immediate stop-the-line**: active runtime user decision — "RECORD wrote to memory (details). This violates the staging→Wrap-up invariant. Diff shown. Options: (a) revert the unauthorized write + retry RECORD, (b) halt the loop for investigation." No fallback "accept the write" option — Wrap-up's sole-writer guarantee is non-negotiable |

The staging→Wrap-up boundary is the system-wide invariant; a silent acceptance of any violation would corrupt memory ownership. Explicit stop-the-line preserves auditability.

---

## Iteration Semantics

The assistant's procedure branches on verdict, and the manager validates the right branch ran:

| Verdict | Every-iter outputs | PASS-only outputs |
|---|---|---|
| **PASS** | Transcript + session.json upsert | `outputs/` files + cumulative staging across iters 1..n + `finishedAt` + `verdict: PASS` |
| **REVISE** | Transcript + session.json upsert (`verdict: REVISE`) | — (loop re-enters DISCUSSION; no canonical artifact, no staging) |
| **FAIL** | Transcript + session.json upsert (`verdict: FAIL`) | — (loop escalates to user; the active runtime's user-decision primitive decides revise / abort / re-frame) |

### Cumulative staging on PASS — the contract

When iter `n` reaches `PASS`, RECORD stages the **union** of:

- (a) Every `disposition: open` and `disposition: addressed` finding from this iter
- (b) Every `disposition: open` and `disposition: addressed` finding **carried forward from iter 1..n-1**, sourced by reading the prior iter per-perspective files directly
- (c) Every `disposition: superseded` finding (staged with `superseded_by: <new-finding-id>` frontmatter; the replacing finding has `supersedes: <old-finding-id>` for forward-and-backward navigability; the superseded record is preserved, not deleted)
- (d) Every `disposition: disputed` finding (staged with dispute rationale)
- (e) Every `disposition: deferred` finding (staged at `staging/decisions/` with `disposition: deferred` so Wrap-up routes to `backlogs/`)

This guarantees no earlier-iter constructive finding silently disappears at PASS. The manager validates the union via gate 4 above.

### REVISE → PASS arc

On a multi-iter `REVISE` → ... → `PASS` arc, the PASS iter's RECORD sources cumulatively from `evaluation/iter1/...` through `evaluation/iter{n}/...`. The assistant reads all prior per-perspective files at Step 6 pre-step; the manager validates the read register at gate 4.

---

## Iteration Inheritance

The disposition lifecycle (`open` / `addressed` / `disputed` / `deferred` / `superseded`), the prior-iter inheritance procedure, and the regression / stuck detection rules are defined in:

- [`evaluation/SKILL.md` § Finding Metadata](../../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity) — disposition values, routing table, slug + collision policy
- [`workflow/evaluation.md` § Iteration Inheritance](evaluation.md#iteration-inheritance-no-ledger--read-prior-iter-directly) — Stage 1 inheritance procedure, regression marking, stuck detection

This document does not duplicate those tables; it cites them. The manager applies the disposition contract at validation gate 4 (cumulative staging completeness).

---

## Idempotency

Re-running RECORD on the same iter (after a crash, partial write, or explicit re-invocation) MUST produce identical results — the manager validates idempotency by re-running on the same iter (crash recovery) without inserting duplicates.

| Operation | Idempotent because |
|---|---|
| CREATE `transcripts/{role}-{agentId}.jsonl` | Write-or-overwrite per agent file in the session-root `transcripts/`. Deterministic source; accumulates across loops by distinct `agentId`, never duplicated |
| UPSERT `session.json.iterations[]` | Keyed by `iter` — re-runs replace, never duplicate |
| CREATE `outputs/{free-filename}.md` (PASS) | Write-or-overwrite per filename. Deterministic synthesis — same iter + same decomposition produces same files. Re-iter rewrites flip prior files' frontmatter `status` to `superseded` rather than deleting |
| CREATE `staging/{type}/{slug}.md` (PASS) | Slug derived from finding's primary symptom + `finding-id` idempotency key. Same finding-id → overwrite. Different finding-id, same slug → `-2`/`-3` suffix per collision policy |
| UPDATE `session.json` `finishedAt` + `verdict` (PASS) | Set, not append |

---

## Iteration Caps

RECORD itself has no separate iteration cap — it runs once per EVALUATION verdict, and the loop's iteration cap (`workflow.{loop}.maxIterations`, default 5) is enforced by EVALUATION's ITER / EXIT decision.

The RECORD-level cap that matters is **retry**: one retry per iter on validation failure. After retry exhaustion the manager stops-the-line — there is no "iter 3 of RECORD" concept.

---

## Output paths

All RECORD writes are **session-scoped** plus own-loop fields in `session.json`. Assistant never touches memory.

| Path | Written by | When |
|---|---|---|
| `sessions/{date}-{session-id}/transcripts/{role}-{agentId}.jsonl` | assistant | every iteration — copied into the single session-root `transcripts/`, accumulating across loops |
| `sessions/{date}-{session-id}/session.json` | assistant (UPSERT) | every iteration; PASS additionally sets `finishedAt` + `verdict: PASS` |
| `sessions/{date}-{session-id}/{N}-{loop}/outputs/{free-filename}.md` | assistant | PASS only — one or more output files |
| `sessions/{date}-{session-id}/{N}-{loop}/staging/{scenarios,checklists,decisions,references,design,discussions,reviews,reports,backlogs/{feature,project},changelogs,learnings,notes}/{slug}.md` | assistant | PASS only |
| `sessions/{date}-{session-id}/3-planning/staging/plans/{slug}.md` | assistant | Planning loop, PASS only |

Path conventions, full path inventory across both tiers, and template-to-directory mappings → [`memory/memory-map.md`](../../memory/memory-map.md). The manager treats `memory-map.md` as the canonical reference for what's allowed where.

---

## Cross-references

- Assistant's full procedure (Steps 1–9, every iter vs PASS-only branches) → [`record/SKILL.md`](../../record/SKILL.md)
- Path inventory + tier access matrix + template index → [`memory/memory-map.md`](../../memory/memory-map.md)
- Type + Domain → staging routing, disposition values, slug + collision policy → [`evaluation/SKILL.md` § Finding Metadata](../../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity)
- Stage 1 inheritance / regression marking / stuck detection (read-once-here, applied-at-every-loop) → [`workflow/evaluation.md` § Iteration Inheritance](evaluation.md#iteration-inheritance-no-ledger--read-prior-iter-directly)
- Where staging eventually lands (memory) → [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md) (sole writer to memory)
- Per-loop orchestration → [`workflow/ideation.md`](ideation.md), [`workflow/preparation.md`](preparation.md), [`workflow/planning.md`](planning.md), [`workflow/execution.md`](execution.md), [`workflow/wrap-up.md`](wrap-up.md)
- Staging template inventory → [`memory/templates/`](../../memory/templates/)
- Verdict aggregation in the state machine → [orchestration `SKILL.md` § Verdict aggregation](../SKILL.md#verdict-aggregation)
