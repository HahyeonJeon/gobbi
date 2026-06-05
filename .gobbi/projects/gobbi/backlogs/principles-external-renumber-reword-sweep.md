---
name: principles-external-renumber-reword-sweep
description: Reconcile Iron Law tables, live cross-references, and principle counts across all instruction docs to the final 8-principle set shipped in session 2026-06-02-9fe7bd7c. The branch docs/principles-skill-improvements MUST NOT merge until this lands.
type: backlogs
scope: project
status: active
created: 2026-06-05
session: 9fe7bd7c-1507-4ef2-88ed-e6111e7e6d10
tags: [principles, docs-sync, renumber, iron-law, high-urgency]
priority: high
disposition: open
---

# Deferred: Reconcile External Surface to the Final 8-Principle Set

Session 2026-06-02-9fe7bd7c redesigned `principles/SKILL.md` from 14 principles to 8. The file-only changes landed across 16 tasks (~19 commits on `docs/principles-skill-improvements`). ALL external revisions — Iron Law tables, live cross-references, principle counts in prose — were deferred at the user's direction.

**The repo is intentionally inconsistent until this follow-up lands. The branch `docs/principles-skill-improvements` MUST NOT merge to develop until this sweep is complete — otherwise develop gets a guardrail where the Iron Law tables and the principles file disagree.**

---

## The final 8-principle order (what to reconcile TO)

1. Think and Study Before Acting
2. Bottom-Up Construction
3. Design With the User, Based on References
4. Refine the Task With the User
5. Scope Is a Contract With the User
6. Start With Docs, Finish With Docs — Documents Are the Team's Memory
7. Say/Write Plainly, Briefly, and Literally
8. Fix the Root Cause, Not the Symptom

Count: **8** (down from 14 at the start of the session).

---

## What still needs doing (the full scope)

### 1. Rebuild the Iron Law tables → 8 rows

Both `.claude/CLAUDE.md` AND `.codex/AGENTS.md` carry a parallel Iron Law summary table in `| N | <title>: <TAGLINE>. |` row format. Both must be rebuilt to the final 8-principle order above. Specific changes:

- Remove the 6 rows for the principles that were merged-away or removed (old P2/Single-Perspective, old P5/Reference-First, old P7/Verification, old P9/User-POV, old P10/Real-Trigger, old P11/Improve-the-Property).
- Update the rows for the principles that were rewritten (P1, P2/old-P3, P5/old-P4, P6/old-P8+P13, P7/old-P14).
- Insert the new row for P8 (Fix the Root Cause, Not the Symptom — added in task 16, no prior row exists).
- Renumber all rows to the final 1-8 sequence.

### 2. Re-point live cross-references in instruction docs

Re-point every "Principle N" reference in LIVE instruction files (NOT historical project memory) per the old→new map below. Known live files from the task-7 quantification: `orchestration/SKILL.md`, `delegation/SKILL.md`, `delegation/templates/{evaluator,executor,assistant}.md`, `execution/SKILL.md`, `evaluation/SKILL.md`, `discussion/SKILL.md`, `gobbi/SKILL.md`, `orchestration/{auto-mode,chat-mode}.md`, `agents/{manager,executor,evaluator,assistant}.md`, plus prose refs in CLAUDE.md/AGENTS.md.

Do NOT renumber historical project memory (`mistakes/`, `decisions/`, `notes/`, `plans/`, `archive/`, dated design docs) — those are point-in-time records; their as-of-then numbers are correct history. (This is the key scope correction; see mistake `renumber-distinguish-live-pointers-from-historical-records`.)

Quantify the live-only subset before executing. The full repo count is ~64 "Principle N" refs; roughly half are historical (leave them). The live subset is the actual worklist.

### 3. Reconcile principle counts in prose → 8

CLAUDE.md ("14 principles", "14 behavioral principles") and AGENTS.md ("14 principles") must become 8. NOTE: there is a pre-existing "13 vs 14" tangle in some docs; reconcile live docs carefully to 8, and do NOT touch historical records that describe past states.

### 4. Reword references to REMOVED principles

Four principles were removed entirely this session: old P2 (Single Perspective per Agent), old P7 (Verification Is a Hard Gate), old P10 (Change Only With a Real Trigger), old P11 (Improve the Property Not the Metric). External references to these cannot be renumbered — the principle no longer exists. The sweep must REWORD them to point at the owning skill instead of a principle number:

- "Principle 2 governs your independence" (evaluator.md, producer≠evaluator) → point at `evaluation/SKILL.md` or `delegation/SKILL.md`
- "Verification Is a Hard Gate" / ~18 Principle-7 refs → point at the Execution Verify phase + `execution/SKILL.md`
- "Change Only With a Real Trigger" refs → absorbed into Scope contract (P5); reword accordingly
- "Improve the Property Not the Metric" refs → fold into verification guidance

This is the hardest part — it is not a mechanical renumber. It requires reading each ref in context and choosing the right replacement phrase.

---

## Old → new number map (for LIVE references only)

```
{1→1, 2→2, 3→4, 4→5, 5→3, 6→6, 7→7, 8→6, 9→3, 10→5, 11→removed, 12→4, 13→6, 14→7}
```

Task summary of intermediate states (do NOT reconcile to intermediate states — reconcile to the FINAL 8):

- Task 7: old P5 (Reference-First) + old P9 (User-POV) → new P3 "Design With the User, Based on References"
- Task 8: old P6 (Refine Vague) + old P12 (What/Why/How) → new P4 "Refine the Task With the User"
- Task 9: old P4 (Scope) rewritten + promoted to P5
- Task 10: old P8 (Documentation) + old P13 (Spec/CRUD-Think) → new P6 "Start With Docs, Finish With Docs"
- Task 11: old P2 (Single Perspective) REMOVED
- Task 12: old P7 (Verification) + old P10 (Real-Trigger) + old P11 (Improve-Property) REMOVED
- Task 14: old P14 (Write Plainly) rewritten as P7 "Say/Write Plainly, Briefly, and Literally"
- Task 16: new P8 "Fix the Root Cause, Not the Symptom" ADDED (no prior principle)

---

## HIGH-URGENCY stale live refs (fix first)

These are actively misdirecting spawned agents right now:

- **F-CON-01 (most urgent):** `skills/evaluation/SKILL.md` lines ~57, ~581 say "Principle 12 = What/Why/How" — now wrong (P12 no longer exists; the What/Why/How discipline is now P4). EVERY evaluator loads `evaluation/SKILL.md`, so this actively misdirects spawned evaluators. Map What/Why/How references to Principle 4.
- **F-CON-02:** `skills/orchestration/SKILL.md` ~line 44; `agents/assistant.md` ~lines 35, 115; `skills/delegation/templates/assistant.md` ~line 37 — all name "Principle 6 = Refine Vague Requirements"; now P6 = Scope. The Refine-Vague discipline is now P4.
- **F-CON-03:** The `CLAUDE.md` + `.codex/AGENTS.md` Iron Law tables are still the old 14-row layout — rebuild to 8 rows in the final order above.

---

## Shipping note

This backlog item BLOCKS the merge of `docs/principles-skill-improvements` into develop. Either:
1. Land this sweep in the SAME PR (next session) before merging, or
2. Hold the PR as draft until a follow-up PR lands this sweep first.

Do NOT merge the branch as-is — develop would then have a guardrail where the Iron Law tables reference 14 principles but `principles/SKILL.md` defines 8.
