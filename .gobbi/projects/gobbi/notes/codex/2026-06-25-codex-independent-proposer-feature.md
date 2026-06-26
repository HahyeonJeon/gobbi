---
name: codex-independent-proposer-feature
description: Designed + shipped the Codex independent-proposer (dual-system PRODUCTION) feature across all 5 productive WORK sub-phases.
type: notes
scope: project
feature: null
status: active
created: 2026-06-25
session: 6cf13813-a002-4e55-96b9-a5d65f619ef8
tags: [codex, process]
keywords: [dual-system-production, proposer, selective-integration, propose-mode, degraded-mode, freeze-boundary]
author: claude
features_touched: [workflow]
loops_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [codex-proposer-model, codex-proposer-decisions, integration-log-missing-from-record-map-row, success-criteria-proposal-path-wording, plan-verification-as-contract-not-must-pass-now-shell, hardcoded-baseline-guard-is-an-edit-target-of-the-structure-it-guards, background-codex-exec-must-redirect-stdin-from-devnull, proposer-evaluator-model-tier-guard, native-codex-proposer-symmetry]
---

# Codex independent-proposer feature — dual-system PRODUCTION

## What happened

The user directed a new feature: extend Codex from evaluation-only to an **independent proposer** at every productive WORK sub-phase, so gobbi's anti-groupthink signal exists at creation, not just at review. Ideation ran 2 iterations (iter1 REVISE → iter2 PASS) and locked a 9-decision design (D1–D9): a Claude producer and a Codex proposer generate **independently in parallel**; after a two-phase freeze the Claude producer **selectively integrates** the frozen Codex proposal (SELECT the principle-better element, never naive-blend), logging each delta to an Integration Log; the manager adjudicates only LARGE gaps and escalates those to the user. The design is anchored to external evidence (arXiv 2603.20324 Selection Bottleneck, 2406.04692 Mixture-of-Agents, the self-preference-bias and multi-agent-cost papers). Preparation, Planning, and a 10-task Execution followed in one session (user overrode the one-phase-per-session cadence). Execution shipped 11 commits touching exactly 32 files — the full D7 CRUD plan — and closed on a dual-system PASS after one remediation round.

## What shipped

Code/doc changeset (11 commits `1ca7e501`..`47eee764`, 32 non-session files):
- `skills/codex/SKILL.md` § Dual-System Production proposer wrapper; new `orchestration/workflow/production.md`; the 5 per-step `orchestration/workflow/{loop}.md`; the 5 loop skills' WORK phases; `orchestration/SKILL.md`, `auto-mode.md`, `chat-mode.md`; `delegation/SKILL.md` + 3 templates; `evaluation/SKILL.md` independence note; 4 agent docs; `.claude/CLAUDE.md`; `gobbi/SKILL.md`; per-step `propose.mode` in both settings templates; `scaffold-session-dir.sh` + `record/record-map.md` + `verify-record-map.sh` baseline.

Memory promoted this Wrap-up (13 staging files):
- design `features/workflow/design/workflow/codex-proposer-model.md`; discussion `features/workflow/discussions/workflow/2026-06-25-codex-proposer-decisions.md`; 4 references in `features/workflow/references/memory/`; 2 resolved decisions in `features/workflow/decisions/workflow/`; feature backlog `features/workflow/backlogs/codex/proposer-evaluator-model-tier-guard.md`; project backlog `backlogs/codex/native-codex-proposer-symmetry.md`; 3 process mistakes (`mistakes/verification/` ×2 + `mistakes/codex/` ×1).

## What got stuck

Planning verification stalled across two REVISE iterations before the model error was caught: gates were written as must-pass-now shell over files with pre-existing out-of-scope broken links (can never exit 0) plus `! grep` drift checks inert under `set -e`. Separately, Execution task 03 hit BLOCKED when the scaffold change turned `verify-record-map.sh` red — its hardcoded `expected_subtree()` baseline was a third, undocumented copy of the structure spec (the planned 2-file drift pair was actually 3 files). Both became promoted mistakes. A backgrounded `codex exec` also hung reading inherited stdin mid-session (third promoted mistake).

## What shifted

- **Master switch dropped.** D6 as locked named a global master switch alongside per-step `propose.mode`. Implementation shipped **per-step `propose.mode: "dual"` only** (×5 in both `settings.auto.json` and `settings.chat.json`); no global master switch exists in the skills tree. The promoted design doc preserves the as-locked D6 text; this is the shipped deviation.
- **Independence-control claim removed (iter1→iter2).** D4's "manager weighs the Codex verdict with awareness of proposer origin" was found non-operational by both Ideation evaluators (implies an out-of-scope eval-mechanism change). Replaced by: the independent dual EVALUATION itself is the control; the model-tier guard is a deferred backlog.
- **Producer-as-integrator, not manager-as-selector.** The user challenged the leader's manager-as-default-selector framing; the Claude producer became the default integrator, manager only adjudicates large gaps.

## Decisions to respect

- D1–D9 are locked; not open for redesign (see `discussions/workflow/2026-06-25-codex-proposer-decisions.md` + `design/workflow/codex-proposer-model.md`).
- `propose.mode` default-ON ("dual") for all 5 steps, per-step toggleable; user owns the Execution per-task cost.
- Integration is SELECT-not-SYNTHESIZE; never a third aggregator agent; never naive-blend.
- A missing Codex *proposer* is NOT a safety gate (degraded-mode label `production_mode: claude-only`); a missing Codex *evaluator* IS.
- Scope is the Claude-primary bridge only; native-Codex symmetry is the deferred project backlog.

## Next session

React to the deferred follow-ups: F-RISK-1 (evaluator filesystem-fence — accepted D4 residual, relates to `backlogs/codex/proposer-evaluator-model-tier-guard.md`); pull the model-tier guard only if residual self-preference is empirically observed; consider the native-Codex proposer symmetry (`backlogs/codex/native-codex-proposer-symmetry.md`) after this feature stabilizes.

## Related

- [[codex-proposer-model]] — the locked D1–D9 design shipped this session
- [[codex-proposer-decisions]] — the binding user decisions
- [[plan-verification-as-contract-not-must-pass-now-shell]] — verification mistake promoted this session
- [[hardcoded-baseline-guard-is-an-edit-target-of-the-structure-it-guards]] — drift-guard mistake promoted this session
- [[background-codex-exec-must-redirect-stdin-from-devnull]] — codex-exec hang mistake promoted this session
