# Workflow — Evaluation (Orchestration)

How the **manager** orchestrates the EVALUATION sub-phase that runs inside every workflow loop (Ideation, Planning, Execution, Wrap-up). This document is loaded by the manager — the evaluator agents that actually perform the per-perspective review load [`evaluation/SKILL.md`](../../evaluation/SKILL.md) instead.

**The manager MUST NOT evaluate. It spawns exactly two evaluator subagents (one per system), collects their per-perspective outputs, reconciles the two systems, and emits a verdict** — it never does the evaluation itself (reinforced at § Spawning the Evaluators: "spawns exactly two evaluator agents in parallel"). Writing findings or stamping a verdict without two evaluator outputs is a workflow breach (see `mistakes/manager-skipped-dual-system-eval.md`). The verdict (`PASS` / `REVISE` / `FAIL`) is the gate after which `RECORD` runs; `RECORD` runs **after every verdict** so each iteration's evidence is preserved regardless of outcome (see [`workflow/ideation.md` § RECORD Phase](ideation.md#record-phase-delegated-to-assistant-runs-every-iter)).

All evaluator output is **session-scoped** under `sessions/{date}-{session-id}/{N}-{loop}/evaluation/`. Evaluators never write to memory.

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

- The artifact under evaluation (the prior phase's `WORK` output, e.g., `sessions/{date}-{session-id}/{N}-{loop}/working/draft-iter{n}.md`)
- Any artifact-embedded evaluation criteria the creator provided (context for Stage 1 frame-build, not a separate measurement pass)
- The perspective set (always all seven + Overall; no pruning)
- The workflow phase (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`) — selects which evaluation child doc the evaluator loads at Stage 0

Each evaluator is **one agent** that handles **all four stages (Target Understanding → Scenario & Checklist Build → Per-Perspective Sequential Evaluation → Overall) sequentially** — the manager does not spawn one evaluator per perspective. Perspectives iterate inside the agent in the documented order (Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk → Overall). Per-perspective output files come from one agent's sequential pass, not from N parallel spawns.

Model selection follows `settings.json` `models.{system}.evaluator`:
- Claude Code evaluator: `models.claude.evaluator` (default `opus`)
- Codex evaluator: `models.codex.evaluator`; `null` means inherit the parent Codex session model and reasoning effort.

### Pre-spawn independence classification — Codex evaluator (D6.2)

Before spawning the **Codex evaluator**, the manager classifies its prompt for proposer↔evaluator independence: the Codex proposal must NOT leak into the Codex evaluator prompt, or the self-preference bias the dual-system mandate removes is re-introduced (see [`production.md` § Proposer ↔ evaluator independence](production.md)).

**This is a manual/semantic classification, NOT a grep gate.** The manager READS the prompt and judges it against the property's meaning. A literal path-grep (e.g. `grep -rl 'working/proposals/' <prompt>`) is allowed ONLY as **non-gating advisory evidence** — it never decides the outcome. A correct prompt may name `working/proposals/` inside an off-limits warning ("do NOT read `working/proposals/`"), which is a PASS but which a literal grep would false-fail. Gate on the meaning, not the substring.

The manager answers each question by reading the prompt; **ALL must PASS before spawn**:

1. Does the prompt contain any **proposal body text** — sentences or blocks copied from `working/proposals/codex/draft-iter{n}.md`? → must be **NO**.
2. Does it carry **proposal framing** — "the proposer suggested…", "the alternative approach was…", "Codex proposed…"? → must be **NO**.
3. Is the artifact under review the **Claude-authored canonical** `working/draft-iter{n}.md` (re-expressed during integration), NOT the Codex proposal file? → must be **YES**.
4. If a `working/proposals/` path appears at all, is it ONLY inside an **off-limits warning**? A bare off-limits path is a **PASS** — it does NOT fail the gate. → must be **YES** (or the path is absent).
5. Did the classification come from **reading** the prompt (semantic judgment), with any path-grep used as advisory evidence only, never as the gate? → must be **YES**.

A failing answer means proposal content leaked into the evaluator prompt — the manager fixes the prompt before spawn, never spawns and hopes. The classification outcome is recorded in the manager's pre-spawn log. This is the manual, semantic counterpart to the brittle literal path-grep that false-fails a correct off-limits warning.

---

## Collecting Outputs

After both evaluators complete, the manager finds:

```
sessions/{date}-{session-id}/{N}-{loop}/evaluation/
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

> **Escalations in this document fall into two classes; the boundary is binding.** **Routine-triage** escalations are mode-split: Chat escalates to the user; Auto auto-iterates within budget, records the tag/finding, and surfaces it at Wrap-up (per [`auto-mode.md §6/§7.3`](../auto-mode.md)) — Auto never interrupts mid-loop for these. There are **three routine-triage sites**: § Iteration Caps, § Stuck detection, § Regression marking. **Safety-gate** escalations interrupt in BOTH modes (NOT mode-split) — they are the dual-system guarantee, not routine triage. There are **six safety-gate sites**: § Severity-gated divergence handling (Major divergence) and the same-symptom-different-root-cause divergence in § Same symptom, different root cause; § Verdict Aggregation Across Perspectives (any `FAIL`); and in § Degraded-mode policy the one-system-fails, both-systems-fail, and cost-budget-approaching-cap gates. Do not over-apply the no-interrupt rule and silence a safety gate, and do not leave a routine-triage path mode-agnostic.

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
| Both systems: same symptom + **different root causes** | Treat as a reconciliation divergence. Preserve both cause hypotheses, both evidence chains, both proposed remediations. Flag for user resolution through the active runtime's user-decision primitive before DISCUSSION re-entry. This is a **safety gate — it interrupts in BOTH modes (NOT mode-split)**. The user's decision (or "explore both") is recorded in the manager's discussion-log and reflected in the next iter's per-perspective files via the `disposition:` field |
| Same symptom + one system has cause, other has none | Use the cause hypothesis; tag the surfacing system; record explicitly that the other system flagged the symptom only |

### Severity-gated divergence handling

Not all divergences are equal:

| Divergence | Example | Manager action |
|---|---|---|
| **Minor** | `PASS` ↔ `REVISE` | Auto-proceed with pessimistic union; the divergence summary is captured at RECORD in the canonical artifact's Evaluation summary section |
| **Major** | `PASS` ↔ `FAIL`, `REVISE` ↔ `FAIL` | **Stop-the-line**: surface divergence to user through the active runtime's user-decision primitive before any further loop progress; user decides which verdict to honor. The user's decision is captured in the manager's user-decision transcript and in the canonical Evaluation summary at RECORD |

Major divergences mean the two systems disagree on whether the artifact is acceptable at all. That is exactly the signal the dual-system mandate exists to surface. Major divergence is a **safety gate — it interrupts in BOTH modes (NOT mode-split)**; contrast the routine-triage sites (§ Iteration Caps / § Stuck detection / § Regression marking). The Minor (`PASS` ↔ `REVISE`) row keeps auto-proceeding.

### Where divergence is recorded

Per-system per-perspective files already capture each system's findings and verdict — **no separate `divergence.md` is written**. The cross-system reconciliation summary (which perspective verdicts diverged, how the pessimistic union resolved, and the user's decision in major-divergence cases) is written into the canonical artifact's **Evaluation summary** section by the `assistant` during `RECORD` (PASS only). The user's decision in major-divergence cases is also captured in the manager's user-decision transcript, which is preserved at RECORD via the per-iter transcript jsonl.

---

## Verdict Aggregation Across Perspectives

After per-perspective reconciliation across the seven perspectives **and Stage 3 (Overall)**, the manager aggregates across all eight verdicts (7 perspectives + Overall) to produce the loop's verdict:

| Across all eight | Loop verdict | Post-RECORD transition |
|---|---|---|
| All `PASS` | `PASS` | Exit the loop; advance to the next step |
| Otherwise (any `REVISE`, no `FAIL`) | `REVISE` | Re-enter `DISCUSSION` with findings as new input; iter increments |
| Any `FAIL` | `FAIL` | Escalate to user through the active runtime's user-decision primitive |

The any-`FAIL` escalation is a **safety gate — it interrupts in BOTH modes (NOT mode-split)**.

Overall (Stage 3) is given equal weight in aggregation — a `REVISE` from Overall is a `REVISE` for the loop, even if all seven per-perspective verdicts pass. Cross-cutting issues that only emerge holistically are exactly what Stage 3 is designed to surface.

**Every verdict — `PASS`, `REVISE`, or `FAIL` — advances to RECORD first.** RECORD preserves the iteration's transcript and updates `session.json.workflow.{loop}.iterations[]` regardless of outcome; only on `PASS` does it additionally write the canonical artifact and staging directories. The `Post-RECORD transition` column above describes what happens **after** RECORD runs.

---

## Routing Findings to RECORD

The manager passes all evaluator findings to the `assistant` agent in the next `RECORD` phase. Per the [Finding Metadata](../../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity) defined in the evaluator skill, the assistant routes on `PASS` to session staging:

| Finding type | Session staging destination (`PASS` only) |
|---|---|
| `scenario_gap` | `sessions/{date}-{session-id}/{N}-{loop}/staging/scenarios/{slug}.md` |
| `checklist_gap` | `sessions/{date}-{session-id}/{N}-{loop}/staging/checklists/{slug}.md` |
| `design_flaw`, `assumption_risk` | `sessions/{date}-{session-id}/{N}-{loop}/staging/decisions/{slug}.md` |
| `general` with citable external pattern | `sessions/{date}-{session-id}/{N}-{loop}/staging/references/{slug}.md` |

On `REVISE`, RECORD preserves the transcript + iter entry in `session.json` but does **not** stage findings — those wait for the eventual `PASS` iteration's RECORD run. On `FAIL`, the loop halts before staging.

Wrap-up later promotes the `staging/` directory to memory at `features/{feature-name}/...`. The manager never writes directly to memory.

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

Degraded mode (single-system / "claude-only") is reachable ONLY here — after a system fails and its one retry fails. It is never a pre-evaluation option and is never offered in Auto Mode as an evaluate-mode choice. The user-decision gates in this section are dual-system **safety gates — they interrupt in BOTH modes (NOT mode-split)**.

If after retry one system still fails or produces unusable output:

| Scenario | Manager action |
|---|---|
| One system succeeds, one fails | **Stop-the-line** (safety gate — interrupts in both modes): active runtime user decision: "System X failed (reason). Single-system fallback would weaken the dual-system guarantee. Proceed with system Y only, or halt the loop?" |
| Single-system fallback approved | Use the surviving system's outputs. Loop verdict **floor is `REVISE`** regardless of the surviving system's verdict (the dual-system guarantee was weakened; cannot exit on PASS without both systems). Record a `process` finding (domain: `process`, severity: `High`) noting the fallback |
| Both systems fail | **Halt the loop** (safety gate — interrupts in both modes). Ask the user with diagnostic outputs through the active runtime's user-decision primitive; user decides retry / different model / abort |
| Cost budget approaching cap | Surface to user proactively before exhaustion (safety gate — interrupts in both modes): "system X used 80% of budget — continue / abort / raise cap?" |

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

Iter n Stage 1 reads prior iter findings **directly** from `sessions/.../{N}-{loop}/evaluation/iter{n-1}/{system}/{perspective}.md`:

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
- A regression's response is mode-specific (routine triage). **In Chat mode** it triggers user awareness through the active runtime's user-decision primitive: "iter n REVISE introduced regressions; the previous fix may have been wrong." **In Auto mode** the manager does NOT interrupt: it keeps the regression tag and surfaces it in the Wrap-up finding set — per [`auto-mode.md §6/§7.3`](../auto-mode.md). (Chat behavior here is evaluation.md's own existing behavior; chat-mode.md is silent on regression.)

### Stuck detection (manager-side, post-reconciliation)

If the same finding (same Type / Domain / symptom signature) appears in 2 consecutive iters with `disposition: open` in both:

- Tag both records as `stuck` (a finding-level annotation, added by the manager during reconciliation)
- The stuck response is mode-specific (routine triage). **In Chat mode** the manager **escalates to the user BEFORE reaching the iteration cap** through the active runtime's user-decision primitive: "iter n finding F is unchanged from iter (n-1). The current approach is not converging on this finding. Options: revise differently / accept-with-deferral / abort / change scope." **In Auto mode** the manager does NOT interrupt mid-loop: it keeps the `stuck` tag, continues to iterate within the `maxIterations` budget (and aborts at the cap per § Iteration Caps), and surfaces the stuck finding in the Wrap-up finding set — per [`auto-mode.md §6/§7.3`](../auto-mode.md). (Chat behavior here is evaluation.md's own existing behavior; chat-mode.md is silent on stuck detection.)
- User resolution (Chat) is captured in the manager's discussion log and reflected as the finding's `disposition:` in iter (n+1)'s file (`addressed` / `deferred` / `disputed` / aborted = loop halt)

This prevents wasted iter-3 cycles on issues the agent cannot resolve and surfaces architecture-level problems that look like fix-loops.

---

## Iteration Caps

The manager tracks the loop's revision count. Settings define:
- `workflow.{loop}.maxIterations` (default 5 for Ideation/Planning/Execution, 5 for Wrap-up)

When the cap is reached without `PASS`, the manager's response is mode-specific (routine triage). **In Chat mode** the manager **escalates to the user** rather than continuing to revise — a stop-the-line user-decision primitive with three options: revise one more time, accept the artifact as-is despite findings, or abort the loop and reframe (consistent with chat-mode.md's "Budget exhausted → escalate to user"). **In Auto mode** the manager does NOT interrupt the user mid-session: it records the abort, continues to the next step if continuing is safe, and surfaces the failure at Wrap-up — per [`auto-mode.md §6`](../auto-mode.md). The one exception is `auto-mode.md §6`'s "unsound to proceed" case (e.g., Planning aborted with no deliverable plan), where the Auto manager MUST surface through the active runtime's user-decision primitive before proceeding.

---

## Output paths

All evaluator writes are **session-scoped**. Evaluators never touch memory.

| Path | Written by | Written |
|---|---|---|
| `sessions/{date}-{session-id}/{N}-{loop}/evaluation/iter{n}/{system}/{perspective}.md` | evaluator | One per perspective per system; contains Artifact Summary + W/W/H (Stage 0), locked Frame (Stage 1), per-scenario per-check yes/no results, typed findings (Stage 2), low-confidence appendix |
| `sessions/{date}-{session-id}/{N}-{loop}/evaluation/iter{n}/{system}/overall.md` | evaluator | One per system; contains Stage 3 cross-cutting findings, Karpathy-4 mode checks, Preserve list |

```
sessions/{date}-{session-id}/{N}-{loop}/evaluation/
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
- `{session-id}` — runtime session ID resolved by the manager during Configuration and supplied by the delegation prompt's `session-id:` header field (the parent session's id). Use `CLAUDE_CODE_SESSION_ID` for Claude Code and `CODEX_THREAD_ID` for native Codex. Do NOT read runtime env vars from spawned subagents for this value: in a spawned-subagent context that env-var holds the subagent's own UUID, not the parent session's — use the parent session id supplied by the manager.
- `{N}-{loop}` — the number-prefixed on-disk loop dir being evaluated (`1-ideation` / `2-preparation` / `3-planning` / `4-execution` / `5-wrap-up`). The `workflow.{loop}` JSON keys stay **bare** (no `{N}-` prefix) — see [`record/record-map.md` § SEAM-3](../../record/record-map.md)
- `{system}` — `claude` or `codex` (the system running this evaluator instance)
- `{perspective}` — the perspective slug (`project` / `structure` / `performance` / `aesthetics` / `usage` / `consistency` / `risk`); the holistic Stage 3 output uses the fixed filename `overall.md`

The directory `sessions/{date}-{session-id}/{N}-{loop}/evaluation/iter{n}/{system}/` is bootstrapped by the manager before spawning evaluators. Cross-system divergence is **derived at RECORD** by comparing per-system files; no separate divergence file is written.

---

## Cross-references

- Evaluator agent procedure (Stage 0 Target Understanding → Stage 1 Scenario-Checklist Frame Build → Stage 2 Per-Perspective Sequential Evaluation → Stage 3 Overall) → [`evaluation/SKILL.md`](../../evaluation/SKILL.md)
- Per-loop orchestration → [`workflow/ideation.md`](ideation.md), [`workflow/preparation.md`](preparation.md), [`workflow/planning.md`](planning.md), [`workflow/execution.md`](execution.md), [`workflow/wrap-up.md`](wrap-up.md)
- RECORD synthesis → [`workflow/record.md`](record.md), [`record/SKILL.md`](../../record/SKILL.md)
- Wrap-up's memory promotion → [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md)
- Verdict aggregation rules in the state machine → [orchestration `SKILL.md` § Verdict aggregation](../SKILL.md#verdict-aggregation)
- Auto-Mode evaluation discipline (manager-never-asks / manager-never-evaluates / auto-iterate-no-routine-triage / safety-gate carve-out) → [`auto-mode.md` § Evaluation discipline (§7)](../auto-mode.md)
