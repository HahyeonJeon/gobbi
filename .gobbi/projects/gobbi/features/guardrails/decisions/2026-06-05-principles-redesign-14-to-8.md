---
name: 2026-06-05-principles-redesign-14-to-8
description: Session 2026-06-02-9fe7bd7c redesigned principles/SKILL.md from 14 principles to 8 across 16 tasks. Documents the final 8-principle set, the category of changes, and the deferred external sweep.
type: decisions
scope: feature
feature: guardrails
status: active
created: 2026-06-05
session: 9fe7bd7c-1507-4ef2-88ed-e6111e7e6d10
tags: [principles, redesign, 14-to-8, dual-system-eval]
decision_status: accepted
supersedes: features/guardrails/decisions/2026-06-01-principles-4field-template.md
superseded_by: null
---

# Principles Redesign: 14 → 8 (session 2026-06-02-9fe7bd7c)

## Context

The previous session (2026-06-01) had restructured all 14 principles to a uniform 4-field template (Why/What/How/Anti-pattern). This session's goal was a deeper redesign: reduce the principle count by merging overlapping principles, removing disciplines better owned by individual skills, and adding at least one research-backed new principle. The work ran in Chat mode across 16 tasks with approximately 19 commits on branch `docs/principles-skill-improvements`. All evaluations reached PASS.

## Decision

`principles/SKILL.md` is redesigned from 14 principles to **8 principles**. The external surfaces (Iron Law tables in `.claude/CLAUDE.md` and `.codex/AGENTS.md`, live cross-references in skills and agent specs) are DEFERRED to a follow-up sweep (see backlog `principles-external-renumber-reword-sweep`).

## The Final 8-Principle Set

| # | Title | Iron Law |
|---|---|---|
| 1 | Think and Study Before Acting | NO ACTION WITHOUT THINKING AND STUDYING IT THROUGH FIRST. |
| 2 | Bottom-Up Construction | BUILD THE FOUNDATION FIRST, THEN GROW IT ONE MINIMAL STEP AT A TIME. |
| 3 | Design With the User, Based on References | NO DESIGN WITHOUT PRIOR ART AND USER ALIGNMENT. |
| 4 | Refine the Task With the User | DO NOT START UNTIL THE TASK IS CONCRETE AND CONFIRMED. |
| 5 | Scope Is a Contract With the User | SCOPE IS BOUNDED BY THE CONTRACT WITH THE USER. |
| 6 | Start With Docs, Finish With Docs — Documents Are the Team's Memory | EVERY CHANGE STARTS WITH READING THE DOCS AND ENDS WITH UPDATING THEM. |
| 7 | Say/Write Plainly, Briefly, and Literally | USE PLAIN, BRIEF, LITERAL LANGUAGE. |
| 8 | Fix the Root Cause, Not the Symptom | ADDRESS THE ACTUAL CAUSE, NOT ITS SURFACE EXPRESSION. |

## Summary of Changes by Category

### STYLE CHANGE (all principles, tasks 1–3)

The 4-field Why/What/How/Anti-pattern template from the prior session was further revised. The "What" field was removed from all 14 principles and merged into a unified "Practice" block (combining the former What items and How detail into a single section). The Anti-pattern field was converted from rationalization-quote style ("The metaphor is punchier.") to action-failure style ("Stating a meaning through a metaphor the reader must decode, instead of saying it directly.") across all principles.

### REWRITES (tasks 2–6, 9, 14)

- **Principle 1** redesigned in tasks 2–3: title became "Think and Study Before Acting"; Practice bullets expanded with research-anchored prior art (Cline, Claude Code plan mode, Aider, Superpowers, GSTACK, AGENTS.md); the 3-strike rule and the Enforcement clause removed (3-strike was during-execution, not pre-action; Enforcement was gobbi-workflow-specific).
- **Principle 2 (old P3)** revised in tasks 4–6: title changed to "Bottom-Up Construction" (dropped "with the User in the Loop"); content expanded with research-anchored prior art (Walking Skeleton, GOOS, Tracer Bullets, YAGNI, Osmani's one-shot failure-mode documentation).
- **Principle 5 (old P4)** rewritten and promoted to P5 in task 9: "Scope Is a Contract With the User" rewritten from scratch with fresh anti-patterns in action-failure style.
- **Principle 7 (old P14)** rewritten in task 14: "Say/Write Plainly, Briefly, and Literally" — kept the literal-not-metaphorical point, added research-anchored concision rules (caveman, Strunk & White, plain-language.gov, Flesch readability, Anthropic guidance).

### MERGES (tasks 1, 7–8, 10)

- **Task 1:** Merged the 4-field (Why/What/How/Anti-pattern) template into 3 fields (Why/Practice/Anti-pattern) across all 14 principles. The "What" bullet lists and "How" detail blocks were unified into a single "Practice" section.
- **Task 7:** Old P5 (Reference-First Design) + old P9 (Design from the User's Point of View) → new **P3 "Design With the User, Based on References"**. The two principles addressed the same axis (design must be anchored in prior art and aligned with the user's frame); merged into one with combined content.
- **Task 8:** Old P6 (Refine Vague Requirements Before Acting) + old P12 (Every Task Has Clear What/Why/How) → new **P4 "Refine the Task With the User"**. Both were about concretizing requirements before acting; P12 was the pre-task variant of P6's before-acting discipline.
- **Task 10:** Old P8 (Documentation Is a Deliverable) + old P13 (Spec+CRUD-Think for Documentation Work) → new **P6 "Start With Docs, Finish With Docs — Documents Are the Team's Memory"**. P13 was always a documentation-specific application of P8's principle; merged with emphasis on CRUD-think as the mechanism.

### REMOVALS (tasks 11–12)

- **Task 11:** Old P2 (Single Perspective per Agent / producer≠evaluator) REMOVED. The producer/evaluator separation discipline now lives exclusively in `evaluation/SKILL.md` and `delegation/SKILL.md`. The principle-level statement was a conceptual anchor; the operational rules are in the skills. (Note: two research artifacts — `new-principle-candidates-gstack-superpowers.md` and `new-principle-candidates-karpathy-others.md` — independently identified this as a "re-add" candidate from external harnesses; user chose to keep it removed, as the discipline survives in skills.)
- **Task 12:** Old P7 (Verification Is a Hard Gate) + old P10 (Change Only With a Real Trigger) + old P11 (Improve the Property Not the Metric) REMOVED. These three are execution-phase disciplines better owned by the execution/evaluation skills. (Note: the same research identified P7 as the strongest "re-add" candidate externally; user chose to keep it removed for now, acknowledging the gap.)

### ADDITION (task 16)

- New **P8 "Fix the Root Cause, Not the Symptom"** added. Research-backed addition from both superpowers (`systematic-debugging/SKILL.md:19` "NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST") and gstack (`/investigate` Iron Law). The discipline was present as the 3-strike tail in old P1 but not a first-class principle; elevated to standalone after research confirmed it is independently named as a behavioral law in current agent harnesses.

## Un-taken Strong Research Candidates

The research artifacts surfaced two candidates the user reviewed and chose not to re-add:

1. **Re-add Verification Is a Hard Gate (old P7):** The strongest re-add candidate across all research sources. Karpathy, Claude Code, Aider, OpenHands, and Superpowers all name it as an Iron Law. User decided: verification discipline lives in skills (execution/evaluation); not re-added as a principle.
2. **Re-add Producer≠Evaluator (old P2):** Claude Code states it near-verbatim; gobbi's own evaluation sub-phase depends on it. User decided: the mechanism is in the skills; not re-added as a principle.
3. **New: Deliberate context management:** Karpathy + Claude Code both emphasize it as a real gap; user noted it may be workflow-structural rather than a behavioral principle. Not adopted.

## Scope Notes

All changes are `principles/SKILL.md` ONLY. The external surfaces are DEFERRED:

- Iron Law tables in `.claude/CLAUDE.md` and `.codex/AGENTS.md` still show 14 rows.
- Live cross-references in skills and agent specs still cite old principle numbers.
- Principle counts in prose ("14 behavioral principles") still say 14.

See backlog `principles-external-renumber-reword-sweep` for the full deferred scope, the old→new number map, the REWORD-not-renumber guidance for the 4 removed principles, and the HIGH-URGENCY stale refs that are actively misdirecting agents.

**The branch `docs/principles-skill-improvements` MUST NOT merge until the external sweep lands.**
