---
name: dual-system-verification-frame
description: The canonical verification frame for the Claude–Codex dual-system — a scenario set plus six per-dimension pass/fail checklists that tell a future session whether the Codex co-worker is sharpening Claude's artifact or adding noise
type: design
scope: feature
feature: workflow
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [codex, evaluation, verification]
keywords: [verification-frame, dual-system, proposer, integration-log, six-dimensions, D1-topology]
author: claude
related: [codex-proposer-model]
---

# Dual-system verification frame

> **Status — locked and shipped.** This frame is the locked Ideation deliverable of session
> babc6f3b (iter1 FAIL → iter2 Claude-PASS/Codex-REVISE → iter3 PASS). Its Phase-B improvement
> candidates **C1–C6 plus the live F1 fix all shipped this same session** — see the changelog
> [[2026-06-26-verification-frame-phase-b-shipped]]. The model it verifies is the D1–D9 proposer model
> in [[codex-proposer-model]]. The guiding principle for every judgment below: **Claude teammates are
> the MAIN workers; Codex is the CO-WORKER** — the dual-system earns its keep only when the Codex
> co-worker sharpens Claude's artifact without displacing Claude as the author.

## Problem

Gobbi's anti-groupthink discipline was, until PR #316, present only at EVALUATION. Production added a
Codex proposer at WORK so a second model family shapes the artifact at creation. But "added a second
model" is not the same as "the second model helps." The selection-bottleneck result is blunt: a diverse
two-system team **wins** only under selection-based integration (0.810 win rate) and **loses to a single
model** under synthesis (synthesis loses >80% of the time)
([arXiv 2603.20324](https://arxiv.org/abs/2603.20324)). So the dual-system can silently be worse than
Claude-alone if the integration step, the independence, or the exec reliability degrade. There is no
frame that tells a future session whether the Codex co-worker is actually sharpening Claude's work or
just adding noise and cost.

**Impact.** Every session runs production default-`dual` at all five steps; the user pays ~1 extra
`codex exec` per enabled WORK sub-phase and trusts the result is genuinely cross-family. A degraded
dual-system is a **silent quality + cost regression** — the worst kind, because the artifact still
"looks dual-system-produced." Precedent: the Codex-side assistant that *faked* an eval on timeout
(`mistakes/codex/codex-side-assistant-faked-eval-on-codex-timeout.md`) — a Claude-family output wearing
a Codex label, nearly shipped as a clean dual-system PASS.

**Counterfactual / steel-man.** *"The dual EVALUATION already reviews every canonical artifact every
loop, so a separate production verification frame is redundant."* Counter: the evaluators review the
**integrated** artifact, not the **integration process**. They cannot see (a) that the proposer silently
timed out and the loop ran Claude-only un-labeled, (b) that integration naive-blended instead of
selecting, (c) that the proposer anchored on a leaked Claude frame, or (d) that cost ran away on a
low-yield step. Those are process properties; the frame verifies them.

**Re-framing conclusion.** "Best Codex usage" is precisely **"does the co-worker sharpen the main
worker's artifact at acceptable cost, with independence intact"** — six measurable dimensions, not a
single global verdict. The frame is therefore per-dimension.

## Scope

**In-scope:** a 3-part verification frame for the dual-system at all five productive steps — (1) a
scenario set, (2) per-dimension pass/fail checklists across six named dimensions, (3) the framing of the
D1 topology decision.

**Out-of-scope:** running the verification (this frame is what a future session or evaluator runs);
changing the dual-system EVALUATION mechanism; native-Codex-runtime proposer symmetry (deferred:
`native-codex-proposer-symmetry`).

## Research basis

### Internal anchors

- `codex-proposer-model` (D1–D9): the model is a *generate-then-SELECT* pipeline whose dominant lever
  is the integration step's quality, not the proposer's presence (D8). The frame weights
  integration-quality (Dimension 2) as heavily as exec-reliability.
- `skills/orchestration/workflow/production.md`: states the SELECT-not-synthesize rule, the LARGE/SMALL
  gap ladder (LARGE = safety gate in both modes), and the three structural independence facts — exactly
  the assertions the checklists make runnable.
- `mistakes/codex/*.md` (6 traps): every known way the `codex exec` bridge fails has a recorded scar —
  Dimension 5 is a direct checklist of these six.
- `mistakes/verification/*.md`: the project's hardest-won lesson is that a verification gate must run
  as-is and a claim must be verified, not asserted — the source of the step-specific scenarios and the
  runnable checklists.

### External anchors

- [arXiv 2603.20324 — The Selection Bottleneck](https://arxiv.org/abs/2603.20324): judge-based
  **selection** beats MoA-style **synthesis** by +0.631 win rate; selection = 0.810 vs single-model
  baseline, synthesis **loses >80%** of the time. Evidence anchor for Dimension 2 (integration must
  SELECT, never blend).
- [arXiv 2410.21819 — Self-Preference Bias](https://arxiv.org/abs/2410.21819): an LLM over-rates its own
  generations; using **different model families** for generation vs evaluation mitigates it. Evidence
  anchor for Dimension 6 (independence).
- multi-agent debate literature (e.g. [arXiv 2510.07517](https://arxiv.org/pdf/2510.07517)):
  sequential / mutually-visible setups suffer **conformity and anchoring bias**. Parallel-**blind**
  generation removes the bandwagon/anchoring signal — the central evidence for the D1 decision.
- [arXiv 2604.02460 — multi-agent cost](https://arxiv.org/html/2604.02460v1): multi-agent costs 4–220×
  input tokens with gains plateauing past a small team; two agents + a single brief round is the
  practical default. Evidence anchor for Dimension 4.

> **Evidence caveat.** The two future-dated arXiv IDs (`2603.20324`, `2604.02460`) are 2026 papers;
> their URLs resolve and the figures matched this session's web-search summaries, but a network-enabled
> reader should re-confirm the exact numbers. The *mechanism* reasoning (independence/anchoring,
> selection-preserves-variance) stands on its own.

## Scenarios

`<S>` = the loop's session dir; `{N}-{loop}` / `{n}` = the step / iter. Each scenario states (a) the
situation, (b) GOOD co-worker behavior, (c) the observable shortfall signal.

### Part 1A — Cross-cutting scenarios (instantiate at EVERY step)

| Scenario · type | (a) Situation | (b) GOOD co-worker behavior | (c) Shortfall signal (runnable) |
|---|---|---|---|
| **Golden path** · golden | Claude producer and Codex proposer generate in parallel, blind. Proposer writes `working/proposals/codex/draft-iter{n}.md` with a `PROPOSAL:` header. | Both frozen pre-integration. Producer SELECTs principle-better elements into canonical `working/draft-iter{n}.md`, logs each delta in `working/reconciliation-iter{n}.md`, freezes canonical, then evaluators spawn on the **canonical** artifact. Claude stays author. | `test -f working/reconciliation-iter{n}.md && grep -cE '(took-codex\|kept-own\|merged-selective\|escalated)' working/reconciliation-iter{n}.md` ≥ 1; a log of only `kept-own` across many deltas = proposer added nothing. |
| **Degraded / timeout** · degraded fallback | The Codex proposer times out (`timeout 1200`, exit 124) or writes empty. | Wrapper reports `STATUS: BLOCKED`, never self-authors. Producer proceeds Claude-only and stamps `production_mode: claude-only` + `codex_proposal_absent_reason: <timeout\|empty\|error>`; RECORD preserves both into `outputs/`. Not a safety gate — the step continues. | Whole-tree check: when the proposal is empty, every `outputs/*.md` must carry the label — `[ ! -s working/proposals/codex/draft-iter{n}.md ] && grep -L 'production_mode: claude-only' <S>/{N}-{loop}/outputs/*.md` lists any file → **fail**. |
| **Freeze race** · freeze race (D9) | Producer reports `DONE` but is idle-resumable; a queued delta rewrites the canonical draft AFTER evaluators were dispatched. | Two-phase freeze holds: integrate only against a terminal proposal (present, `PROPOSAL:` header, stable size); confirm the canonical draft is terminal and pin the version before spawning evaluators; re-pin + re-evaluate if it changes. | `find working/draft-iter{n}.md -newer evaluation/iter{n}/claude/project.md` → any hit = target moved under the evaluator. |
| **Proposer ↔ evaluator independence** · independence | The same step runs a Codex proposer (WORK) and a Codex evaluator (EVALUATION). | Distinct, stateless `codex exec` runs. The evaluator prompt references only the Claude-authored canonical artifact — never the proposal file, never the proposer transcript. | **[auditor — manual classification, see D6.2]** The eval prompt embeds **no proposal CONTENT**. This is a manual/semantic check, **not** a path-grep. Breach = the prompt quotes proposal text or carries a "Codex proposed…" reference. |
| **Cost-control single-mode** · cost single-mode | A low-yield step (the two drafts always converge) is set `workflow.{loop}.propose.mode: single`. | Manager spawns ONLY the Claude producer. Deliberate Claude-only run — carries **no** degraded label. | A `single`-mode artifact carrying `codex_proposal_absent_reason` → fail. A `dual` step that never spawned Codex yet carries no degraded label = silent degrade masquerading as single. |

### Part 1B — Step-specific scenarios

- **Ideation** (fork-prone): large-gap fork → the producer names the fork as a LARGE gap (Always-Ask
  Design), keeps both positions intact, logs it `escalated`, and the manager escalates to the user;
  shortfall = the fork resolved silently (`took-codex`/`merged-selective`), or locked "DECIDED" with no
  matching `discussion-log.md` entry. Additive union → a proposal-only scenario silently dropped.
- **Preparation** (additive): readiness additive gap; false-ready from output-only check (read the
  source owner, not an `ls`/`readlink`); cost-toggle candidate.
- **Planning** (fork-prone): task-decomposition fork; verification-gate hardening (runnable contracts,
  zero placeholders); guard-source audit (hardcoded vs derived baseline); skill-path validation
  (`test -e` every declared skill path).
- **Execution** (per task): implementation alternative within scope; additive test gap; stash/baseline
  trap (use `git show HEAD:<path>`/`git diff`, never `git stash` in a worktree); disk persistence
  (verify on disk before reporting DONE).
- **Wrap-up**: promotion integrity (no stripped required field; no leftover `mistake-candidate`);
  standing-guard rerun (re-run ALL standing guards post-promotion, not only the frontmatter validator);
  memory compaction Always-Ask for `mistakes`/`rules`; handoff value (a concrete "next session must
  verify X").

## The six-dimension checklist

Each item is a concrete, checkable assertion. Items are tagged by WHO may run them: **`[evaluator-safe]`**
(default) reads ONLY the Claude-authored canonical artifact + the `working/` Integration Log and is
FORBIDDEN from reading `working/proposals/`; **`[auditor]`** requires reading the proposal or the eval
prompt and is run by the manager / RECORD, never the Codex evaluator. The only angle-bracket tokens
permitted in a GATE line are the documented constants: `<WT>` worktree root, `<S>` session dir,
`<main-tree>`, `<eval-prompt>`, `{N}-{loop}`/`{n}`, and the value-enum `<timeout|empty|error>`.

### Dimension 1 — Per-step value (does the proposal sharpen the artifact, or add noise?)
- **D1.1** `working/reconciliation-iter{n}.md` exists and has ≥1 row: `test -s <S>/{N}-{loop}/working/reconciliation-iter{n}.md`.
- **D1.2** At least one `took-codex`, `merged-selective`, OR `escalated` row exists. A log of only `kept-own` across many deltas is a noise signal (flag for Dim 4).
- **D1.3** Every `codex_origin: true` section is traceable to a real passage in the canonical artifact (close-read; the element is actually present). *(evaluator-safe)*
- **D1.4** No proposal element was adopted that violates the Scope Contract (re-read each `took-codex` row's `why` against the In-Scope list).
- **D1.5** Per-step value criterion met (Ideation independent framing/scenario/checklist; Preparation a readiness fact with source path; Planning task order + deps + skills + gates vs live paths; Execution within task scope; Wrap-up promotion routing + frontmatter + guards + handoff).
- **D1.6 `[Phase-B · C6]`** For any step with two consecutive no-value proposals, record a candidate to set `propose.mode: single`. *(Now runnable: C6 telemetry shipped.)*

### Dimension 2 — Integration quality (principled SELECT, complete Integration Log)
- **D2.1** Every row has all four fields: `delta`, `decision` ∈ {took-codex, kept-own, merged-selective, escalated}, `why`, `codex_origin` (bool).
- **D2.2** No decision is a synthesis/blend. **Check the `decision` COLUMN against the enum, not a body-wide substring grep** (a body grep false-fails legitimate anti-synthesis prose like "SELECT, never blend"). Column-scoped: `awk -F'|' 'NR>2 && NF>5 {gsub(/ /,"",$4); print $4}' reconciliation-iter{n}.md | grep -vxE 'took-codex|kept-own|merged-selective|escalated|decision|:?-+:?'` → expect no output.
- **D2.3** Every `why` cites a specific principle # / Scope clause / mistake path, not a vague "better".
- **D2.4 `[auditor]`** Every proposal-only element appears as a logged `kept-own` or `escalated` row — no silent drops. Requires reading the proposal → manager / RECORD only.
- **D2.5 (F1 — runtime-mirror consistency)** Every `orchestration/workflow/*.md` doc resolves through the `.claude/` mirror: `for f in $(ls <WT>/.gobbi/projects/gobbi/skills/orchestration/workflow/); do test -e <WT>/.claude/skills/orchestration/workflow/$f || echo "MISSING MIRROR: $f"; done`. *(Was failing on `production.md`; fixed by C1; now a standing guard via C2.)*
- **D2.6** `merged-selective` is used only when the row names the selected element from each side.
- **D2.7** An evaluator can review selector quality from the Integration Log alone (the `why` citations are self-contained).

### Dimension 3 — Gap-classification correctness (LARGE vs SMALL routed right)
- **D3.1** Every `escalated` row's delta is genuinely LARGE (Always-Ask category, mutually-exclusive core fork, or principle equipoise).
- **D3.2** Every LARGE gap has a matching user-decision in `working/discussion-log.md`. A "DECIDED/LOCKED" claim with no matching log entry is the CONSIST-1 contradiction.
- **D3.3** No mutually-exclusive core fork is marked `took-codex`/`kept-own`/`merged-selective` (silently resolved).
- **D3.4** No `mistakes`/`rules` change from the Codex proposal landed without a user-decision.
- **D3.5** Principle equipoise is classified LARGE — "I like mine better" is not a valid selector reason.
- **D3.6** The manager adjudicates only LARGE gaps and never blends or rewrites producer output directly.

### Dimension 4 — Cost-vs-benefit (~1 extra exec/step worth it; when is single-mode right?)
- **D4.1 `[Phase-B · C6]`** For each enabled `dual` step, the Integration Log shows ≥1 artifact-changing row over a rolling window (N=3); a step producing only `kept-own` for N sessions is a single-mode candidate — surface to the user. *(Now runnable: C6 telemetry shipped.)*
- **D4.2** Production ran a single round (exactly one `proposals/codex/draft-iter{n}.md` per iter).
- **D4.3** Execution per-task cost is visible: count of `task-*/working/proposals/codex/` equals the task count under `dual`.
- **D4.4** A `single`-mode step spent zero `codex exec` calls.
- **D4.5** A timeout is treated as degraded output, NOT as evidence Codex has no value (degraded ≠ low-value).
- **D4.6** The cost review distinguishes "Codex added nothing" from "Claude failed to integrate useful Codex content" (a low-adoption step may be a weak selector, not a low-value proposer).

### Dimension 5 — Codex exec reliability (the recorded bridge traps)
- **D5.1** Foreground-blocking: output files exist after the call (`codex-wrapper-file-persistence-failure`).
- **D5.2** `timeout ≥ 1200s`, not the 600s evaluation-bridge default (`codex-side-assistant-faked-eval-on-codex-timeout`).
- **D5.3** Structural validation only: gate DONE on {file exists, >0 bytes, `PROPOSAL:` header}, NOT a finding-vocab grep.
- **D5.4** stdin from `/dev/null` on a backgrounded exec; prompt written + verified (`test -s`) in a separate foreground step first.
- **D5.5** PID-kill, never `pkill -f 'codex exec'`.
- **D5.6** BLOCKED-on-empty, never self-author.
- **D5.7** Main-tree absolute write path via `--cd <main-tree>` + `--add-dir`, not a worktree-nested or `pwd`-derived path.
- **D5.8** The proposer ran `--sandbox workspace-write`, NOT `read-only`.

### Dimension 6 — Independence (proposer ≠ evaluator; Claude-main preserved)
- **D6.1** The Codex proposer and Codex evaluator are distinct `codex exec` processes.
- **D6.2 `[auditor]` (manual/semantic classification — NOT a grep gate)** Confirm the Codex evaluator received no proposal CONTENT. A literal path-grep is explicitly NOT the gate — it false-fails a correct prompt that names the path inside an off-limits warning, and being literal it misses content embedded without the path. The auditor READS `<eval-prompt>` and classifies PASS iff it quotes no proposal body text, echoes no proposal framing, and carries no "Codex proposed…" reference; a bare path inside an off-limits instruction is PASS.
- **D6.3** The two generators did not see each other while generating.
- **D6.4 `[auditor]`** Claude-main preserved: the canonical draft was authored by the Claude producer; Codex's only artifact is the proposal file. The bedrock co-worker invariant.
- **D6.5** Evaluator verdicts are not origin-weighted.
- **D6.6** The Codex evaluator reviews the Claude-authored canonical artifact, not the original proposal.

## The D1 topology decision (locked)

> **LOCKED (user decision, 2026-06-26): keep Option A (parallel-blind-integrate) as the default; DEFER
> the consult sub-mode (Option C) to an evidence-gated future; reject pure interactive-advisor (B).**
> Phase B scope was the C1–C6 hardening candidates, NOT a topology change.

- **Option A — Parallel-blind-integrate (CHOSEN).** Two blind generators → freeze → producer selects →
  dual evaluation. Independence is the whole point (sequential/mutually-visible setups suffer anchoring;
  [2510.07517]). The selection lever is where the value is (selection beats synthesis; [2603.20324]).
  Self-preference stays bounded — the reviewed artifact is Claude-authored ([2410.21819]).
- **Option B — Interactive-advisor (REJECTED).** The moment Codex sees Claude's framing to advise on it,
  independence collapses into the anchoring/conformity regime. It also re-introduces freeze complexity
  D9 cleanly avoids and makes Claude-main harder to protect.
- **Option C — Hybrid (parallel-blind default + a labeled `consult` sub-mode) (DEFERRED, evidence-gated).**
  A labeled `production_mode: consult` for low-yield steps, plus large-gap consult on user request. The
  label requirement (prevents a consult artifact masquerading as `dual`) is the principle-better element
  Codex added.

**Re-open condition for the consult sub-mode** — across several sessions running this frame: (i) blind
Codex proposals are repeatedly low-yield with evaluators confirming the omissions are noise; (ii)
LARGE-gap equipoise escalations are a recurring, user-time-expensive fraction; (iii) integration logs
show weak selector quality even after checklist hardening; **and** (iv) consult-mode runs preserve
independence through labeling + prompt hygiene. Absent that evidence, the locked Option-A default stands.

## Phase-B improvement candidates (all shipped 2026-06-26)

> **STATUS UPDATE.** Every candidate below shipped this session — see
> [[2026-06-26-verification-frame-phase-b-shipped]] for the commit map. The table is retained as the
> rationale record.

| ID | Candidate | Dimension | Shipped |
|---|---|---|---|
| C1 | Mirror `production.md` into `.claude/skills/orchestration/workflow/` (the live F1 fix) | D2.5 | `f51f8d27` |
| C2 | Runnable mirror-consistency standing guard | D2.5 | `93d83498` |
| C3 | Degraded-mode label-preservation gate at RECORD | Dim 5 | `64c16ffb` |
| C4 | Integration-Log structural validator | Dim 2 | `fbbefcd4` (+`7fea07ef`) |
| C5 | Proposer↔evaluator independence classification gate (manual, in `evaluation.md`) | Dim 6 / D6.2 | `36b37f4f` (+`94bdef34`) |
| C6 | Per-step value telemetry in `session.json` (unblocks D1.6/D4.1) | Dim 4 | `5ee953f2` (+`7fea07ef`) |

## Trade-offs

The frame is per-dimension, not a single global verdict — heavier to run but it localizes WHERE the
dual-system degraded. It deliberately does NOT re-verify artifact *content* (the dual EVALUATION does
that); it verifies the integration *process* the evaluators cannot see. It accepts that the two
meaning-level gates (D2.2 column-scope, D6.2 independence) cannot be reduced to a one-liner grep —
brittleness there is worse than a manual read.

## Source

Locked Ideation deliverable: `sessions/2026-06-26-babc6f3b-e845-4ed3-9625-c14ea9237fd8/1-ideation/outputs/verification-frame.md`
(the full per-iter production/revision provenance and Integration-Log detail live there).

## Related

- [[codex-proposer-model]] — the D1–D9 dual-system model this frame verifies
- [[dual-system-eval-catches-defects]] — the EVALUATION-side learning the frame extends to creation
- [[2026-06-26-verification-frame-phase-b-shipped]] — the changelog recording C1–C6 + F1 shipped
- [[literal-grep-gate-false-fails-legitimate-usage]] — the brittleness lesson behind D2.2 / D6.2
