---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
feature: repo-reset
topic: non-circular-e2-gate
rounds: [5]
locks: ["Q-Gate-Redesign"]
---

# Q-Gate-Redesign: Non-Circular Stage E.2 Gate (iter3)

## Discussion Summary

**Background (Round 5)**

iter2 Codex evaluator (run independently as dual-system anti-groupthink check) returned REVISE with finding F-CX-OV-01. Claude had accepted the Q-StageE SHA gate as written; Codex identified that a commit cannot contain its own SHA in a file within its own tree (Merkle property). The gate was logically impossible.

**Q-Gate-Redesign — How to rewrite the E.2 gate (Round 5)**

Manager surfaced F-CX-OV-01 and asked the user to choose from three options: (A) drop the session.json SHA requirement entirely; (B) use a two-step ceremony (SHA committed first in a separate micro-commit, then bare-UUID delete); (C) redesign gate to not depend on writing anything to tracked files.

User chose: drop the SHA-in-session.json requirement entirely (Option A, recommended). The gate is rewritten to just "sweep commit exists on branch." iter3 implements two non-circular pre-conditions:

1. `git log --format=%H -1 <sweep-branch>` returns a non-empty SHA (the sweep commit exists on the branch)
2. `git ls-tree <sweep-branch> .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../` shows the kept session dir is part of the committed tree

If either fails: NEEDS_CONTEXT (per `executor-rationalized-failing-verification-gate.md`). The SHA is NOT written into any tracked file. Audit traceability uses `git log` rather than `session.json`.

**Secondary finding (F-CX-OV-02, Medium/50)**

Codex iter2 also flagged that Stage G merged without capturing the PR head SHA first. Below the REVISE threshold but trivial to add. iter3 adds a Stage G pre-merge step capturing `HEAD_SHA=$(gh pr view <num> --json headRefOid -q .headRefOid)`. (The post-merge verification mechanism was later found to be defective in iter3 evaluation and redesigned in iter4 — see Q-iter4-Override discussion.)

## Locked Decision

| Lock | Decision |
|------|----------|
| Q-Gate-Redesign | Replace SHA-in-session.json gate with two non-circular `git` pre-conditions; SHA NOT written to any tracked file |

## Significance

This is the dual-system anti-groupthink payoff for Round 5: Claude accepted the gate; Codex found the logical impossibility. The finding drove iter3 and was the sole reason the iter2 verdict was REVISE.

## Related

- `ideation/staging/decisions/sha-gate-self-referential.md` (F-CX-OV-01, the finding)
- `ideation/artifacts/implementation-checklist.md` § Stage E.2 gate
- `ideation/artifacts/design-direction.md` § D9
- `ideation/rawdata/discussion-log.md` § Round 5
