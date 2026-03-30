# FEEDBACK Phase

How iterative feedback works after TASK or REVIEW completes. Load this when entering Phase 2 (FEEDBACK) to understand iteration tracking, stagnation detection, and when to escalate.

---

## Core Principle

> **Speed over structure.** FEEDBACK exists to refine, not to redesign. The architecture is established — skip planning, fix directly or delegate small scoped tasks.

The user inspects results and provides corrections. Each correction is a signal: fix it, record it as a gotcha, and move forward. FEEDBACK is optimized for rapid iteration, not full workflow cycles.

---

## What FEEDBACK Does

- **Skip planning** — the architecture is established from TASK
- **Fix directly or delegate small scoped tasks** — no full decomposition needed
- **Record gotchas from corrections** — user corrections become gotchas via _gotcha, preventing the same mistake across sessions
- **Write feedback.md** after each feedback round to persist the iteration trail

After FEEDBACK completes, use AskUserQuestion to ask: REVIEW, or FINISH?

---

## Iteration Tracking

> **Number each feedback round.** Append to feedback.md with the round number, what the user said, what changed, and what remains unresolved.

This makes the iteration history explicit. When feedback spans many rounds, the numbered trail prevents context loss and makes stagnation visible. Without it, the orchestrator loses track of what was already attempted.

---

## Stagnation Detection

> **If 3 consecutive rounds address the same finding without convergence, surface the stagnation pattern to the user via AskUserQuestion.** The user decides whether to continue iterating, accept the current state, or change approach entirely.

Stagnation means the fix strategy is not working — repeating it will not produce a different result. The orchestrator's role is to detect the pattern and surface it, not to decide the resolution. The user may have context the orchestrator lacks about why convergence is difficult or whether "good enough" is acceptable.

---

## Feedback Round Cap

> **After 5 feedback rounds, surface AskUserQuestion recommending REVIEW or FINISH.** The user can override and continue — this is a recommendation, not a hard stop.

Five rounds is a signal that the scope of changes may warrant a structured pass (REVIEW) rather than continued incremental fixes. The cap exists to prompt reflection, not to gate progress. If the user has clear remaining items, continuing is the right call.

---

## Targeted Re-evaluation

> **When a feedback fix is narrow and well-scoped, a single evaluator suffices for verification.** Full perspective spawn is unnecessary for small targeted fixes.

The multi-perspective evaluation model exists for complex, multi-faceted outputs where blind spots are likely. A typo fix, a single-file correction, or a formatting adjustment does not need multiple independent assessments. Match evaluation cost to fix complexity — use a single evaluator (Haiku or Sonnet tier) for targeted fixes, reserve the full perspective spawn (Project + Overall + task-relevant perspectives) for substantial changes.

---

## Constraints

- MUST number each feedback round in feedback.md
- MUST record user corrections as gotchas via _gotcha
- MUST surface stagnation pattern after 3 consecutive rounds on the same finding — via AskUserQuestion, not automatic action
- MUST recommend REVIEW or FINISH after 5 rounds — via AskUserQuestion, user can override
- MUST use AskUserQuestion at every phase boundary — never prose transitions
- Never skip gotcha recording — a correction not recorded is a correction repeated
- Never run full workflow (Step 1-4) during FEEDBACK — that is what REVIEW is for
