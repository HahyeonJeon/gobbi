---
name: coding-skill-created
description: Built the new language-agnostic coding skill (16 principles + evaluation.md child doc); author-only scope, wiring deferred.
type: notes
scope: project
feature: null
status: active
created: 2026-06-24
session: e351aa58-de50-41b4-a147-a6ac33356c08
tags: [process, docs-sync]
keywords: [coding-skill, skill-authoring, language-agnostic, coding-principles, evaluation-child-doc]
author: claude
features_touched: []
steps_completed: [ideation, planning, execution, wrap-up]
shipped: [freeze-canonical-candidate-before-evaluating, scrub-stack-idioms-when-adapting-to-general-doc, coding-skill-created]
---

# coding skill created

## What happened

The session created the `coding` skill from scratch — a language-agnostic, development-native coding-principles skill intended to complement gobbi's behavioral discipline (which governs process) with engineering-quality discipline (which governs code).

Ideation opened with a dual-system evaluation of the v3 design. The evaluator returned REVISE on concurrency concerns and naming: both Claude and Codex flagged that the design's 11-principle v3 set lacked a principle for concurrency, and Codex flagged the eval brief named a stale "v2/11" artifact count (the producer had updated the design to 12 principles while evaluators were dispatched — a moving-target evaluation artifact; this produced mistake-candidate 1). The user locked v4 of the design: 15 principles in Design-first order, with the gobbi-projection lineage moved to Appendix A only.

Planning decomposed v4 into a 3-task plan: (1) draft SKILL.md, (2) draft evaluation.md, (3) verify consistency. Execution ran:

- iter 1 REVISE: dual-system evaluation found a JS/TS test idiom (`test.skip`) leaked into the language-agnostic `evaluation.md` (from mirroring `execution/evaluation.md` as a shape reference), and a present-tense wiring claim ("Loaded alongside execution/evaluation.md") that asserted a deferred load decision. Mistake-candidate 2 staged.
- iter 2 remediation: 7 fixes applied. Codex convergence found an orphaned concurrency teach/grade perspective in `evaluation.md` with no matching principle in `SKILL.md`.
- iter 3: added Principle 16 "Control State and Side Effects" to close the orphan. Dual-system evaluation returned PASS on both systems.

## What shipped

Two skill files landed on the session branch:

- `.gobbi/projects/gobbi/skills/coding/SKILL.md` — 16-principle language-agnostic coding skill. Principles: (1) Study First, (2) Design the Contract First, (3) Build Deep Units, (4) Decompose by Responsibility, (5) Name for Intent, (6) Design for Verification, (7) Build Bottom-Up, (8) Build Only What's Needed and Finish It, (9) Fix the Root Cause, (10) Make Failure Explicit / Guard the Trust Boundary, (11) Optimize for the Reader, (12) Don't Repeat Knowledge, (13) Comment the Why, (14) Make It Efficient Enough, (15) Change With Blast-Radius Awareness, (16) Control State and Side Effects. Prose-only; no code. Lean Why / Practice / Anti-pattern.
- `.gobbi/projects/gobbi/skills/coding/evaluation.md` — 7-perspective + Overall evaluation child doc.

Two mistakes promoted to project memory:

- `skills/evaluation/mistakes.md#freeze-canonical-candidate-before-evaluating` — manager dispatched evaluators while the producer was still writing the artifact.
- `mistakes/docs-sync/scrub-stack-idioms-when-adapting-to-general-doc.md` — shape-reference overreach dragged stack idioms and wiring claims into a general doc.

## What got stuck

Wiring the skill into the workflow was agreed out of scope for this session (D4). The follow-up tasks were not filed as formal backlogs but are noted in the handoff:
- Create `.claude/skills/coding` + `.agents/skills/coding` symlinks.
- Add `plugins/gobbi/skills/coding` mirror.
- Add `coding` to executor and evaluator Load Directives.
- Implement the Q4 decision (Execution evaluator loads BOTH `execution/evaluation.md` + `coding/evaluation.md`).

## What shifted

- v3 design had 11 principles (12 after in-flight update); the user locked v4 at 15 + Design-first ordering in Ideation.
- Principle 16 (Control State and Side Effects) was added at iter 3 of Execution to close an evaluation orphan — not in the original v4 plan.
- The gobbi-projection lineage (which gobbi behavioral principles each coding principle maps to) moved from the main body to Appendix A only, per D5 in the locked design.

## Decisions to respect

- **D4 — author-only scope:** the `coding` skill is NOT wired into executor or evaluator Load Directives. Wiring is a dedicated follow-up session. Do not add load instructions before that session runs.
- **Prose-only:** no code examples in `SKILL.md` or `evaluation.md`. The skill's language-neutrality depends on it.
- **16-principle set is locked:** adding, removing, or reordering principles requires a new Ideation pass with the user.
- **Gobbi-projection in Appendix A only:** the main body is development-native. The Appendix maps each principle to gobbi's behavioral principles for completeness only.

## Next session

Wire the `coding` skill into the workflow:

1. Create `.claude/skills/coding` + `.agents/skills/coding` symlinks + `plugins/gobbi/skills/coding` mirror entry.
2. Add `coding` skill to executor Load Directives.
3. Implement Q4: Execution evaluator loads both `execution/evaluation.md` + `coding/evaluation.md`.
4. Optionally, start the `typescript` or `python` language-specific child skill (concrete idioms the `coding` skill defers to those).

## Related

- `skills/evaluation/mistakes.md#freeze-canonical-candidate-before-evaluating` — mistake promoted this session
- [[scrub-stack-idioms-when-adapting-to-general-doc]] — mistake promoted this session
