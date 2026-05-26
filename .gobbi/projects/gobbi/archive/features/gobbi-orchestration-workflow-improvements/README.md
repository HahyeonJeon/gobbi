---
feature: gobbi-orchestration-workflow-improvements
title: "Gobbi Orchestration Workflow Improvements (Bundle A)"
status: retired
first-session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
last-session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
pr: 266
branch: feat/266-orch-workflow-improvements
head-commit: b9970dc
issue: 266
archived_at: 2026-05-26
archive_reason: retired
---

# Feature: Gobbi Orchestration Workflow Improvements

Bundle A: six discipline gaps in gobbi orchestration/workflow repaired in a single PR.
Session `2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068`. Branch `feat/266-orch-workflow-improvements` HEAD `b9970dc`. 8 commits, +522/-38, 10 files.

## What was shipped

1. **gobbi/SKILL.md Step 4 polish + Glossary move** (T01) — Rewrote Step 4 to 1-question mode; added customizable gate instruction; moved Glossary to standalone section; fixed 6 stale cross-references.

2. **Memorization moment-of-capture principle** (T02) — New Core Principle "Write immediately after correction" in `memorization/SKILL.md` with reciprocal cross-link in `mistake/SKILL.md`.

3. **Delegation memorization hard gate** (T03) — New Core Principle in `delegation/SKILL.md`; Load Directives block updated in all 3 delegation templates (assistant/leader/executor) to include memorization skill with hard-gate instruction.

4. **Wrap-up Step 2.5 prior-loop compliance check** (T04) — New `### Step 2.5` H3 inserted in `wrap-up/SKILL.md` between `### WORK discipline` and `## Staging → Project-memory routing`. Auto-backfill mechanical gaps; NEEDS_CONTEXT for judgment-required.

5. **Coverage Ownership row + Path conventions H3** (T05) — New "Memorization staging shape + naming" row in `evaluation/SKILL.md`'s Coverage Ownership Matrix; `**Path conventions**` promoted to `### Path conventions` H3 in `memorization/SKILL.md` for stable anchor.

6. **Codex skill content** (T06) — 415-line `codex/SKILL.md` with 8 H2 sections: invocation syntax, assistant-wrapper dual-system topology, sandbox/CWD discipline, timeout discipline, 5 use cases, cost/budget awareness, anti-patterns. All 12 empirical witnesses cited (I1-I14, E1-E5). Symlinks wired.

7. **Cross-link sweep** (T07) — Verification-only; 10/10 cross-links confirmed wired.

## Session activity

| Loop | Iters | Verdict | Notes |
|---|---|---|---|
| Ideation | 3 | PASS | REVISE→FAIL(REVISE)→PASS |
| Preparation | 3 | PASS | REVISE→REVISE→PASS |
| Planning | 2 | PASS | REVISE→PASS |
| Execution | 7 tasks | PASS | T01 2-iter, T02 1-iter (manager override), T03-T05 1-iter each, T06 2-iter, T07 1-iter |
| Wrap-up | 1 | — | In progress |

## Design decisions

- `decisions/wrap-up-step-2-5-escalation-default.md` — Post-iter1 redirect, Step 2.5 escalation shape (split from the iter1 user-redirects bundle, Decision 1)
- `decisions/codex-exec-universal-invocation-pattern.md` — Post-iter1 redirect, codex invocation priority (split from the iter1 user-redirects bundle, Decision 2); full bundle context archived at `archive/decisions/2026-05-23-iter1-user-redirects.md`
- `decisions/codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md` — Codex assistant-wrapper topology for dual-system eval
- `decisions/wrap-up-step-2-5-anchor-placement.md` — Step 2.5 anchor placement (new H3 after WORK discipline)
- `decisions/coverage-ownership-matrix-row-text.md` — Coverage Ownership Matrix row exact cell text (Draft A selected)
- `decisions/plan-diff-scope-gate-semantics-under-bundled-pr.md` — Plan diff-scope gate semantics under bundled PR

## Designs

7 Ideation designs captured in `design/` (`codex-skill-structure.md`, `memorization-moment-of-capture.md`, `memorization-delegation-hard-gate.md`, `wrap-up-step-2-5-compliance-check.md`, `naming-convention-enforcement.md`, `glossary-placement.md`, `drop-legacy-setup-questions.md`).

## Open follow-ups

- Normalize `**Path conventions**` to H3 at `mistake/SKILL.md:126` and `planning/SKILL.md:459` (backlogged at project level)
- `evaluator-returned-verdict-inline-no-per-perspective-files.md` — evaluator agent definition needs `Write` tool OR evaluator brief must mandate Bash-heredoc writes
- Deferred scope items: 1-2 (skill-loading discipline), 1-3 (worktree-first architecture), 2-1 (Auto-mode silence), 2-2 (Chat mode redesign), 4-1 (subagent metadata hook)
