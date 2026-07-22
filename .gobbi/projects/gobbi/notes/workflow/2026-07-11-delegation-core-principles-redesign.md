---
name: delegation-core-principles-redesign
description: "Direct-fix session redesigned delegation/SKILL.md Core Principles to 5 universal, self-standing principles + 3 removals; #344 had merged mid-session so work re-applied on a fresh PR off develop; dual-system eval caught one blast-radius miss (F4)."
type: notes
scope: project
feature: null
status: active
created: 2026-07-11
session: 67cf54c5-f8f6-43a3-a62b-3c948151e926
tags: [docs-sync, process]
keywords: [delegation-skill, core-principles, dual-system-eval, codex-proposer, worktree-divergence, next-session-orchestration-split]
author: claude
features_touched: [agents]
steps_completed: [wrap-up]
---

# Delegation Core Principles Redesign — session journal (2026-07-11)

## What this session did
A **direct discuss-and-fix** session (not the full dual-system workflow — per the user's `direct-fix-small-followups` preference) on `skills/delegation/SKILL.md`. Four user-fed points, then a batched evaluation + wrap-up:

1. **Removed** the top "Runtime mapping" preamble (sub-doc/when-loaded line + Claude/Codex primitive table + "same across runtimes" invariant).
2. **Removed** the "Tell specialists what to do, not how to do it" Core Principle, and de-cited it in `planning/SKILL.md:51` (the only external named citation).
3. **Redesigned** the whole Core Principles section into **5 generalized, tool-agnostic, self-standing principles** — no internal jargon in the statements, no "See §" body citations:
   1. Make the brief self-contained from the receiver's point of view.
   2. Make the required preparation explicit, ordered, and checkable.
   3. Define the contract: one clear objective, boundaries, the evidence for "done," and the escape hatch.
   4. Steer the outcome without smothering judgment.
   5. Protect independent judgment when the point is to check or compare.
4. **Removed** the entire `## Hook Integration` section (hook mechanics + Structured-Header Convention table + flock serialization) and the stale `(§ Hook Integration)` pointer. User chose "accept the loss" of the prose header value-shape contract (it survives in the template slots + hook script).

## How point 3 was produced (dual-system)
Two research leaders (external field prior-art + internal audit) → a re-frame to universal altitude → an **independent Codex proposer** (`codex exec`) → selective integration (Codex's "preparation + contract" structure + the Anthropic objective emphasis grafted in). Codex independently converged on the two hardest calls (keep BOTH an altitude principle AND an independent-judgment principle) — the anti-groupthink signal that held the direction.

## Key deviation — #344 merged mid-session
The session began adding these edits to the open PR **#344** (worktree `claude-2026-07-08-14fbc122-…`). By wrap-up (07-11), **#344 had already been squash-merged to develop** by a concurrent session, and develop's `delegation/SKILL.md` had **diverged** (newer Model Selection Codex-effort columns + Agent Roster). The 4 edits were **re-applied onto a fresh branch off current develop** (`claude-2026-07-11-67cf54c5-…`), preserving develop's newer content; the stale `14fbc122` worktree was cleaned up.

## Batched evaluation
Dual-system: **Claude PASS / Codex REVISE**. Reconciled to one in-scope fix — **F4** (`delegation/mistakes.md:77/79` still called the removed load-order a "Core Principle"; a Principle-9 blast-radius miss) — **fixed** by re-pointing to § The Load Directives Block. Codex's other findings: F1 (checklist sub-step conditionality) pre-existing + minor; F2 (iteration value-shape) accepted-loss per user; F3 (`gobbi/SKILL.md:256` status-placement wrong side) pre-existing + out-of-scope → backlogged (`archive/backlogs/docs/2026-07-20-gobbi-skill-status-line-placement.md`).

## Mistakes promoted
- `git/mistakes.md` ← **Manager Edited Main Checkout Not The Session Worktree** (hit at point 1; multi-worktree write-path discipline).
- `skill-writing/mistakes.md` ← **Skill Core Principles Must Be Universal And Self-Standing** (the two point-3 corrections + the F4 blast-radius lesson).

## Next session (user directive) — HIGH PRIORITY
> Redesign the **boundary** of the delegation skill so it is **independent of the gobbi workflow**, by **splitting the delegation skill into `orchestration/delegation.md`** (a child doc under the orchestration skill).

The 5 generalized principles shipped this session are the intended base for that split — they are already workflow-agnostic. The gobbi-workflow-specific mechanics (Load Directives tiers, RECORD/memory/git gates, dual-system Producer Dispatch, the status-contract wire format) are what would move under orchestration. See `backlogs/` / this journal as the starting brief.
