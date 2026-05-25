# Workflow — Evaluation (Orchestration)

How the **manager** orchestrates the EVALUATION sub-phase that runs inside every workflow loop (Ideation, Planning, Execution, Wrap-up). This document is loaded by the manager — the evaluator agents that actually perform the per-perspective review load [`evaluation/SKILL.md`](../../evaluation/SKILL.md) instead.

The manager's job at EVALUATION is to **spawn the dual-system evaluators, collect their per-perspective outputs, reconcile the two systems, and emit a verdict** — not to do the evaluation itself. The verdict (`PASS` / `REVISE` / `FAIL`) is the gate after which `MEMORIZATION` runs; `MEMORIZATION` runs **after every verdict** so each iteration's evidence is preserved regardless of outcome (see [`workflow/ideation.md` § MEMORIZATION Phase](ideation.md#memorization-phase-delegated-to-assistant-runs-every-iter)).

All evaluator output is **session-scoped** under `sessions/{date}-{session-id}/{loop}/evaluation/`. Evaluators never write to project memory.

---

## Why dual-system is mandatory

Self-enhancement bias alone disqualifies single-system evaluation: a model judging artifacts produced by its own family systematically over-rates them. Position, verbosity, sentiment, and fallacy-oversight biases compound the problem. Running both Claude Code and Codex evaluators in parallel forces disagreement to surface and prevents one backend's blind spots from passing unchecked.

The two systems do **not** see each other's output during evaluation. Inter-system communication would re-introduce bandwagon and position biases that the dual-system mandate was designed to eliminate. Divergence is the signal; silent averaging would destroy it.

---

## Perspective Selection

The evaluator runs **seven perspectives** + a final holistic **Overall** stage. The seven are the per-perspective rotation (Stage 2 in the evaluator skill); Overall is its own stage (Stage 3).

| Perspective | Asks |
|---|---|
| **Project** | Does the output solve the right problem? Stays inside the locked Scope Contract? Any scope drift? (Scope Contract schema canonical at `evaluation/SKILL.md` § Scope Contract Schema) |
| **Structure** | Is the organization / decomposition / coupling sound? Boring-by-default? Testable? Two-week smell test? |
| **Performance** | Efficiency, resource use, scalability risks? |
| **Aesthetics** | Readability, naming, style conventions, polish — does every element earn its place? |
| **Usage** | Can the next consumer (agent / user / operator / future-self) use this correctly at 3am? |
| **Consistency** | Did everything that should change together, change together? Code ↔ docs ↔ tests ↔ types ↔ comments ↔ indexes. Internal contradictions? Cross-loop trace coherent? |
| **Risk** | Blast radius, reversibility, security surface, rollback, irreversible operations? |
| **Overall** (Stage 3) | Cross-perspective gaps, strengths to preserve, Karpathy's 4 failure modes (wrong assumptions / overcomplexity / orthogonal edits / imperative-over-declarative) |

Every evaluation runs **all seven perspectives + Overall** for every loop. No pruning. A perspective that produces zero findings for a given artifact is still walked — its empty result is itself a recorded outcome, not a license to skip.

The phase child doc loaded at evaluator Stage 0 (`ideation/evaluation.md` / `preparation/evaluation.md` / `planning/evaluation.md` / `execution/evaluation.md` / `wrap-up/evaluation.md`) supplies the per-perspective seed scenarios + seed checklist the evaluator builds Stage 1 from. The manager passes the phase tag in the delegation prompt; the evaluator loads the matching child doc automatically.

---

## Spawning the Evaluators

The manager spawns **exactly two evaluator agents in parallel** — one per system. Both receive identical input:

- The artifact under evaluation (the prior phase's `WORK` output, e.g., `sessions/{date}-{session-id}/{loop}/rawdata/draft-iter{n}.md`)
- Any artifact-embedded evaluation criteria the creator provided (context for Stage 1 frame-build, not a separate measurement pass)
- The perspective set (always all seven + Overall; no pruning)
- The workflow phase (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`) — selects which evaluation child doc the evaluator loads at Stage 0

Each evaluator is **one agent** that handles **all four stages (Target Understanding → Scenario & Checklist Build → Per-Perspective Sequential Evaluation → Overall) sequentially** — the manager does not spawn one evaluator per perspective. Perspectives iterate inside the agent in the documented order (Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk → Overall). Per-perspective output files come from one agent's sequential pass, not from N parallel spawns.

Model selection follows `settings.json` `models.{system}.evaluator`:
- Claude Code evaluator: `models.claude.evaluator` (default `opus`)
- Codex evaluator: `models.codex.evaluator` (default `gpt-5`)

---

## Collecting Outputs

After both evaluators complete, the manager finds:

```
sessions/{date}-{session-id}/{loop}/evaluation/
├── iter1/
│   ├── claude/
│   │   ├── project.md       ← per-perspective output from Claude Code (iter 1)
│   │   ├── structure.md
│   │   ├── performance.md
│   │   ├── aesthetics.md
│   │   ├── usage.md
│   │   ├── consistency.md
│   │   ├── risk.md
│   │   └── overall.md       ← Stage 3 holistic output (iter 1)
│   └── codex/
│       └── (same 8 files)
├── iter2/                    ← only exists if iter 1 verdict was REVISE
│   ├── claude/
│   │   └── (same 8 files; inherits open findings from iter 1 via Stage 1)
│   └── codex/
│       └── (same 8 files)
└── ...                       ← additional iter directories as REVISE continues
```

Each per-iter directory contains exactly the 8 files (7 perspectives + overall.md) per system. Prior iter directories are **preserved** as the audit trail; iter n reads iter (n-1) directly via Stage 1 inheritance — no separate ledger file exists.

Each per-perspective file contains: Artifact Summary + W/W/H (Stage 0) → locked Frame, scenarios-with-attached-checklists (Stage 1) → per-scenario per-check yes/no results → typed findings with `disposition:` field (Stage 2) → Low-confidence appendix section. The `overall.md` file contains Stage 3 cross-cutting findings, Karpathy-mode checks, and Preserve list.

---

## Cross-System Reconciliation

The manager reconciles the two systems' outputs **side-by-side**, never averaging.

### Aggregation rule — pessimistic union

Per perspective:

- **Findings**: the union of both systems' findings. If both flagged the same issue **with the same root cause**, recorded once with the higher confidence and higher severity. If only one flagged it, recorded with that system's values, tagged with the surfacing system.
- **Verdict**: the worst of the two per-perspective verdicts.

> Example: Claude says `PASS` on Structure; Codex says `REVISE` on Structure, citing a missed concurrency edge case. Reconciled Structure verdict is `REVISE`. The concurrency finding is recorded with Codex as the surfacing system.

### Same symptom, different root cause — do not collapse

When both systems flag the **same symptom** but propose **different root causes**, do NOT collapse into a single record. A symptom resolved against the wrong cause leaves the actual cause un-fixed and the high-severity finding persists across iterations.

| Pattern | Manager action |
|---|---|
| Both systems: same symptom + same root cause + same remediation | Collapse into one record (standard pessimistic union) |
| Both systems: same symptom + **different root causes** | Treat as a reconciliation divergence. Preserve both cause hypotheses, both evidence chains, both proposed remediations. Flag for user resolution via AskUserQuestion before DISCUSSION re-entry. The user's decision (or "explore both") is recorded in the manager's discussion-log and reflected in the next iter's per-perspective files via the `disposition:` field |
| Same symptom + one system has cause, other has none | Use the cause hypothesis; tag the surfacing system; record explicitly that the other system flagged the symptom only |

### Severity-gated divergence handling

Not all divergences are equal:

| Divergence | Example | Manager action |
|---|---|---|
| **Minor** | `PASS` ↔ `REVISE` | Auto-proceed with pessimistic union; the divergence summary is captured at MEMORIZATION in the canonical artifact's Evaluation summary section |
| **Major** | `PASS` ↔ `FAIL`, `REVISE` ↔ `FAIL` | **Stop-the-line**: surface divergence to user via AskUserQuestion before any further loop progress; user decides which verdict to honor. The user's decision is captured in the manager's AskUserQuestion transcript and in the canonical Evaluation summary at MEMORIZATION |

Major divergences mean the two systems disagree on whether the artifact is acceptable at all. That is exactly the signal the dual-system mandate exists to surface.

### Where divergence is recorded

Per-system per-perspective files already capture each system's findings and verdict — **no separate `divergence.md` is written**. The cross-system reconciliation summary (which perspective verdicts diverged, how the pessimistic union resolved, and the user's decision in major-divergence cases) is written into the canonical artifact's **Evaluation summary** section by the `assistant` during `MEMORIZATION` (PASS only). The user's decision in major-divergence cases is also captured in the manager's AskUserQuestion transcript, which is preserved at MEMORIZATION via the per-iter transcript jsonl.

---

## Verdict Aggregation Across Perspectives

After per-perspective reconciliation across the seven perspectives **and Stage 3 (Overall)**, the manager aggregates across all eight verdicts (7 perspectives + Overall) to produce the loop's verdict:

| Across all eight | Loop verdict | Post-MEMORIZATION transition |
|---|---|---|
| All `PASS` | `PASS` | Exit the loop; advance to the next step |
| Otherwise (any `REVISE`, no `FAIL`) | `REVISE` | Re-enter `DISCUSSION` with findings as new input; iter increments |
| Any `FAIL` | `FAIL` | Escalate to user via AskUserQuestion |

Overall (Stage 3) is given equal weight in aggregation — a `REVISE` from Overall is a `REVISE` for the loop, even if all seven per-perspective verdicts pass. Cross-cutting issues that only emerge holistically are exactly what Stage 3 is designed to surface.

**Every verdict — `PASS`, `REVISE`, or `FAIL` — advances to MEMORIZATION first.** MEMORIZATION preserves the iteration's transcript and updates `session.json.workflow.{loop}.iterations[]` regardless of outcome; only on `PASS` does it additionally write the canonical artifact and staging directories. The `Post-MEMORIZATION transition` column above describes what happens **after** MEMORIZATION runs.

---

## Routing Findings to MEMORIZATION

The manager passes all evaluator findings to the `assistant` agent in the next `MEMORIZATION` phase. Per the [Finding Metadata](../../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity) defined in the evaluator skill, the assistant routes on `PASS` to session staging:

| Finding type | Session staging destination (`PASS` only) |
|---|---|
| `scenario_gap` | `sessions/{date}-{session-id}/{loop}/staging/scenarios/{slug}.md` |
| `checklist_gap` | `sessions/{date}-{session-id}/{loop}/staging/checklists/{slug}.md` |
| `design_flaw`, `assumption_risk` | `sessions/{date}-{session-id}/{loop}/staging/decisions/{slug}.md` |
| `general` with citable external pattern | `sessions/{date}-{session-id}/{loop}/staging/references/{slug}.md` |

On `REVISE`, MEMORIZATION preserves the transcript + iter entry in `session.json` but does **not** stage findings — those wait for the eventual `PASS` iteration's MEMORIZATION run. On `FAIL`, the loop halts before staging.

Wrap-up later promotes the `staging/` directory to project memory at `features/{feature-name}/...`. The manager never writes directly to project memory.

---

## Dual-system failure handling

Both evaluators are expected to produce 8 well-formed files (7 perspectives + `overall.md`) within a bounded time and cost budget. Real evaluations face timeouts, malformed outputs, partial outputs, and budget exhaustion. The manager applies the following gates **after** spawning the two evaluators in parallel:

### Output validation (mechanical)

For each system, the manager verifies:
- Exactly 8 files written at the expected paths
- Each file > 0 bytes
- Each per-perspective file parses for the required sections (Artifact Summary + W/W/H + locked Frame + per-check results + typed findings + low-confidence appendix)
- Each finding carries Type + Domain + Confidence + Severity + Evidence (no malformed records)

Failure → retry once, then trigger degraded-mode policy below.

### Budget gates

- **Wall-clock budget** per evaluator (default: 30 min; configurable via `workflow.{loop}.evaluate.timeoutMinutes`)
- **Cost/token budget** per evaluator (configurable via `workflow.{loop}.evaluate.tokenBudget`)
- Budget exhaustion → halt that system, retry once if the run was clearly stuck early; otherwise trigger degraded-mode policy

### Retry policy

- One retry per system on: transient error / wall-clock exhaustion before first finding produced / malformed output
- No retry on: explicit "no findings" verdict / structurally-complete output that the manager rejects on content review
- Retries inherit the same prompt + inputs; no parameter tuning

### Degraded-mode policy (single-system fallback)

If after retry one system still fails or produces unusable output:

| Scenario | Manager action |
|---|---|
| One system succeeds, one fails | **Stop-the-line**: AskUserQuestion: "System X failed (reason). Single-system fallback would weaken the dual-system guarantee. Proceed with system Y only, or halt the loop?" |
| Single-system fallback approved | Use the surviving system's outputs. Loop verdict **floor is `REVISE`** regardless of the surviving system's verdict (the dual-system guarantee was weakened; cannot exit on PASS without both systems). Record a `process` finding (domain: `process`, severity: `High`) noting the fallback |
| Both systems fail | **Halt the loop.** AskUserQuestion the user with diagnostic outputs; user decides retry / different model / abort |
| Cost budget approaching cap | Surface to user proactively before exhaustion: "system X used 80% of budget — continue / abort / raise cap?" |

The dual-system mandate exists to surface divergence. A silent single-system fallback would undermine it; explicit degraded mode preserves auditability.

---

## Iteration Inheritance (no ledger — read prior iter directly)

There is **no separate iter-ledger file**. Per-iter scoping of `evaluation/iter{n}/{system}/{perspective}.md` files means iter (n-1)'s findings, frames, and verdicts are preserved verbatim and read directly by iter n.

### `disposition:` field on findings

Each finding (Stage 1 gap, Stage 2 finding, Stage 3 finding) carries a `disposition:` metadata field in addition to Type / Domain / Confidence / Severity / Evidence:

| Disposition value | Meaning |
|---|---|
| `open` | Finding is unresolved and persists from earlier iter, or newly surfaced in current iter |
| `addressed` | Finding was resolved by a change between iters (commit / diff / section reference cited as evidence) |
| `deferred` | Finding is acknowledged but explicitly deferred (with backlog pointer or rationale) |
| `disputed` | Creator / user disputes the finding (rationale cited; finding remains in record) |
| `superseded` | Finding is replaced by a later finding (cite the superseding finding's ID) |

Iter 1 findings default to `disposition: open`. Iter ≥ 2 must judge a disposition for every prior-iter finding inherited at Stage 1.

### Stage 1 inheritance procedure (iter ≥ 2)

Iter n Stage 1 reads prior iter findings **directly** from `sessions/.../{loop}/evaluation/iter{n-1}/{system}/{perspective}.md`:

| # | Read source | Action |
|---|---|---|
| 1 | iter (n-1) per-system per-perspective files (all 8 × N systems) | Enumerate all `open` findings from iter (n-1); also collect all `scenario_gap` and `checklist_gap` findings regardless of disposition |
| 2 | Per finding | Carry forward as Stage 1 seed input — `open` findings become Frame scenarios / checklist items in iter n's Frame; `scenario_gap` / `checklist_gap` findings become first-class scenarios / checks |
| 3 | iter n Stage 1 output | Frame includes inherited content + new CRUD on top |
| 4 | iter n Stage 2 output | For each inherited prior-iter finding, judge its new `disposition:` — typically `open` (still present) / `addressed` (resolved) / `disputed` (creator pushed back) |

A prior-iter `open` or `gap` finding that does NOT show up in iter n's per-perspective file is a **Frame-inheritance failure** — manager's validation step catches this before reconciliation.

### Regression marking (manager-side, post-reconciliation)

After iter n reconciliation, the manager compares iter n findings vs iter (n-1) reconciled findings:

- Findings present in iter n but absent in iter (n-1) → tag `domain: regression` (a REVISE introduced a new finding the prior iter didn't have)
- A regression at any iter triggers user awareness via AskUserQuestion: "iter n REVISE introduced regressions; the previous fix may have been wrong."

### Stuck detection (manager-side, post-reconciliation)

If the same finding (same Type / Domain / symptom signature) appears in 2 consecutive iters with `disposition: open` in both:

- Tag both records as `stuck` (a finding-level annotation, added by the manager during reconciliation)
- **Escalate to user BEFORE reaching the iteration cap** via AskUserQuestion: "iter n finding F is unchanged from iter (n-1). The current approach is not converging on this finding. Options: revise differently / accept-with-deferral / abort / change scope."
- User resolution is captured in the manager's discussion log and reflected as the finding's `disposition:` in iter (n+1)'s file (`addressed` / `deferred` / `disputed` / aborted = loop halt)

This prevents wasted iter-3 cycles on issues the agent cannot resolve and surfaces architecture-level problems that look like fix-loops.

---

## Iteration Caps

The manager tracks the loop's revision count. Settings define:
- `workflow.{loop}.maxIterations` (default 3 for Ideation/Planning/Execution, 1 for Wrap-up)

When the cap is reached without `PASS`, the manager **escalates to the user** rather than continuing to revise. The escalation is a stop-the-line AskUserQuestion with three options: revise one more time, accept the artifact as-is despite findings, or abort the loop and reframe.

---

## Output paths

All evaluator writes are **session-scoped**. Evaluators never touch project memory.

| Path | Written by | Written |
|---|---|---|
| `sessions/{date}-{session-id}/{loop}/evaluation/iter{n}/{system}/{perspective}.md` | evaluator | One per perspective per system; contains Artifact Summary + W/W/H (Stage 0), locked Frame (Stage 1), per-scenario per-check yes/no results, typed findings (Stage 2), low-confidence appendix |
| `sessions/{date}-{session-id}/{loop}/evaluation/iter{n}/{system}/overall.md` | evaluator | One per system; contains Stage 3 cross-cutting findings, Karpathy-4 mode checks, Preserve list |

```
sessions/{date}-{session-id}/{loop}/evaluation/
└── iter{n}/                  ← one directory per iteration; iter 1 always; iter ≥ 2 only on REVISE
    ├── claude/
    │   ├── project.md
    │   ├── structure.md
    │   ├── performance.md
    │   ├── aesthetics.md
    │   ├── usage.md
    │   ├── consistency.md
    │   ├── risk.md
    │   └── overall.md
    └── codex/
        └── (same shape — 8 files: 7 perspectives + overall.md)
```

**Mechanical completeness check** — before reconciliation, the manager verifies each system produced exactly these 8 files at `iter{n}/{system}/`: `project.md` / `structure.md` / `performance.md` / `aesthetics.md` / `usage.md` / `consistency.md` / `risk.md` / `overall.md`. Any deviation (missing file, extra file, file ≤ 0 bytes) triggers the dual-system failure handling (see § Dual-system failure handling below).

**Path conventions**

- `{date}` — session start date in `YYYY-MM-DD`
- `{session-id}` — Claude Code session ID supplied by the delegation prompt's `session-id:` header field (the parent session's id). Do NOT read `$CLAUDE_CODE_SESSION_ID` for this value: in a spawned-subagent context that env-var holds the subagent's own UUID, not the parent session's.
- `{loop}` — the workflow loop being evaluated (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`)
- `{system}` — `claude` or `codex` (the system running this evaluator instance)
- `{perspective}` — the perspective slug (`project` / `structure` / `performance` / `aesthetics` / `usage` / `consistency` / `risk`); the holistic Stage 3 output uses the fixed filename `overall.md`

The directory `sessions/{date}-{session-id}/{loop}/evaluation/iter{n}/{system}/` is bootstrapped by the manager before spawning evaluators. Cross-system divergence is **derived at MEMORIZATION** by comparing per-system files; no separate divergence file is written.

---

## Cross-references

- Evaluator agent procedure (Stage 0 Target Understanding → Stage 1 Scenario-Checklist Frame Build → Stage 2 Per-Perspective Sequential Evaluation → Stage 3 Overall) → [`evaluation/SKILL.md`](../../evaluation/SKILL.md)
- Per-loop orchestration → [`workflow/ideation.md`](ideation.md), [`workflow/preparation.md`](preparation.md), [`workflow/planning.md`](planning.md), [`workflow/execution.md`](execution.md), [`workflow/wrap-up.md`](wrap-up.md)
- Memorization synthesis → [`workflow/memorization.md`](memorization.md), [`memorization/SKILL.md`](../../memorization/SKILL.md)
- Wrap-up's project-memory promotion → [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md)
- Verdict aggregation rules in the state machine → [orchestration `SKILL.md` § Verdict aggregation](../SKILL.md#verdict-aggregation)
