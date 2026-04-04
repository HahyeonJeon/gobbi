# FEEDBACK Phase

How iterative feedback works after Review completes. Load this when entering FEEDBACK to understand iteration tracking, stagnation detection, and when to escalate. FEEDBACK always returns to Review — the cycle is FEEDBACK → Review → (FEEDBACK or FINISH).

---

## Core Principle

> **Speed over structure.**

FEEDBACK exists to refine, not to redesign. The architecture and research are established — skip Ideation, Planning, and Research. Fix directly or delegate small scoped tasks.

> **Every correction is a memorization opportunity.**

User feedback is the richest source of gotchas, rules, and project knowledge. Don't just fix the task — record corrections as gotchas in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/gotchas/`, stated preferences as rules in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/rules/`, and new knowledge in project docs. A feedback round that only fixes code without updating project memory wastes the learning.

---

## What FEEDBACK Does

- **Skip Ideation, Planning, and Research** — the architecture and research are established from the main workflow
- **Fix directly or delegate small scoped tasks** — no full decomposition needed
- **Record gotchas from corrections** — user corrections become "must avoid" entries in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/gotchas/`
- **Record rules from preferences** — user-stated standards become "must follow" entries in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/rules/`
- **Update project docs** — if feedback reveals new knowledge about architecture, conventions, or decisions, update `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/`
- **Write feedback.md** after each feedback round to persist the iteration trail

After FEEDBACK fixes are applied, return to Review (Step 7). PI agents re-review the updated work with innovative + best stances. After the new Review, ask the user again via AskUserQuestion: FEEDBACK or FINISH?

---

## Flow

The FEEDBACK cycle is:

1. User selects FEEDBACK (after Review verdict)
2. User provides feedback or orchestrator addresses Review findings
3. Delegate small fixes to executors
4. Record gotchas from corrections
5. Write `feedback.md`
6. Return to Review (Step 7) — PI agents re-review
7. After Review: ask user FEEDBACK or FINISH?

FEEDBACK never leads directly to FINISH. It always passes through Review first. This ensures that every fix is independently assessed before the workflow concludes.

---

## Iteration Tracking

> **Number each feedback round.**

Append to `feedback.md` with the round number, what the user said, what changed, and what remains unresolved.

This makes the iteration history explicit. When feedback spans many rounds, the numbered trail prevents context loss and makes stagnation visible. Without it, the orchestrator loses track of what was already attempted.

---

## Stagnation Detection

> **If 3 consecutive rounds address the same finding without convergence, surface the stagnation pattern to the user via AskUserQuestion.**

The user decides whether to continue iterating, accept the current state, or change approach entirely.

Stagnation means the fix strategy is not working — repeating it will not produce a different result. The orchestrator's role is to detect the pattern and surface it, not to decide the resolution. The user may have context the orchestrator lacks about why convergence is difficult or whether "good enough" is acceptable.

---

## Feedback Round Cap

> **After 5 feedback rounds, surface AskUserQuestion recommending FINISH.**

The user can override and continue — this is a recommendation, not a hard stop.

Five rounds is a signal that the scope of changes may have grown beyond what incremental fixes can address. The cap exists to prompt reflection, not to gate progress. If the user has clear remaining items, continuing is the right call.

---

## Targeted Re-evaluation

> **When a feedback fix is narrow and well-scoped, a single evaluator suffices for verification.**

Full perspective spawn is unnecessary for small targeted fixes.

The multi-perspective evaluation model exists for complex, multi-faceted outputs where blind spots are likely. A typo fix, a single-file correction, or a formatting adjustment does not need multiple independent assessments. Match evaluation cost to fix complexity — use a single evaluator (Haiku or Sonnet tier) for targeted fixes, reserve the full perspective spawn (Project + Overall + task-relevant perspectives) for substantial changes.

Note: targeted re-evaluation during FEEDBACK is for verifying individual fixes. The full Review (Step 7) that follows FEEDBACK provides the comprehensive multi-perspective assessment.

---

## Constraints

- MUST number each feedback round in `feedback.md`
- MUST record user corrections as gotchas in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/gotchas/`
- MUST record user-stated standards as rules in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/rules/`
- MUST update project docs when feedback reveals new knowledge worth persisting
- MUST return to Review (Step 7) after FEEDBACK fixes are applied — FEEDBACK never leads directly to FINISH
- MUST surface stagnation pattern after 3 consecutive rounds on the same finding — via AskUserQuestion, not automatic action
- MUST recommend FINISH after 5 rounds — via AskUserQuestion, user can override
- MUST use AskUserQuestion at every transition — never prose transitions
- Never skip gotcha recording — a correction not recorded is a correction repeated
- Never run full workflow (Steps 1–3) during FEEDBACK — that is what the main workflow is for
