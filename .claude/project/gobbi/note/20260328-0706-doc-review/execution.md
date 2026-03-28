# Execution: Claude Docs Review

## Overview

14 agent spawns across 4 waves reviewing 53 `.claude/` documentation files.

## Wave 1 (8 agents in parallel)

### Section 1: Internal Consistency Audit

**1A: Skills — Core/Workflow** (Explore agent)
- Audited 8 SKILL.md files against gobbi-claude standards
- Key findings: Step-by-step recipe violations in gobbi-orchestration (numbered Steps 1-4), gobbi-plan (5-step "How to Plan"), gobbi-delegation (lifecycle recipe), gobbi-execution (lifecycle recipe), gobbi-collection (3-step "What to Do"). gobbi/SKILL.md and gobbi-discuss/SKILL.md were compliant.
- 7 blocking, 4 important, 3 minor findings across 8 files

**1B: Skills — Eval/Utility/Special** (Explore agent)
- Audited 7 SKILL.md files
- Key findings: gobbi-hack/SKILL.md empty (blocking). gobbi-notification/SKILL.md at 335 lines with 10 code blocks and step-by-step recipes (exception candidate + violations). gobbi-note/SKILL.md has format templates and bash commands (minor). Three stage-specific evaluation skills fully compliant.
- 1 blocking, 2 important, 1 minor

**1C: Gobbi-Claude + Gotcha** (Explore agent)
- Audited gobbi-claude parent + 4 children + gobbi-gotcha + 13 gotcha files
- Key findings: Navigate table accurate. Children cross-consistent. Only finding: project.md has a code block showing directory structure (minor). 10 empty gotcha files are expected stubs.
- 1 minor finding. Standards docs follow their own standards.

**1D: Agent Definitions** (Explore agent)
- Audited 5 agent files
- Key findings: gobbi-planner.md empty (blocking). All 4 populated agents (pi, 3 evaluators) fully compliant — strong identity-first definitions.
- 1 blocking

**1E: Design + Root Docs** (Explore agent)
- Audited 9 design docs + CLAUDE.md + GOBBI.md + README
- Key findings: CLAUDE.md says "single evaluator with critical attitude" but system uses 3 evaluators (blocking cross-reference error). distribution.md has 3+ renamed skill references (blocking staleness). hacks.md has renamed skill references (important). 4 project subdirectories missing READMEs (important). CLAUDE.md references deprecated TodoWrite (important).
- 2 blocking, 3 important, 1 minor

### Section 2: GSD Comparison

**2A: State & Context Engineering** (gobbi-pi agent)
- 5 sub-topics: session state, context budget, session recovery, cross-session memory, work trail
- Key gaps: context.md designed but not implemented (high, prompt-achievable), no context budget monitoring (high, needs-infrastructure), no crash/compaction recovery (high, prompt-achievable for basic handoff)
- Gobbi strength: work trail via notes is well-designed and thorough

**2B: Agent Architecture** (gobbi-pi agent)
- 5 sub-topics: specialization depth, tool permissions, dispatch, fresh context, growth model
- Key gaps: planner agent empty, no codebase scout/mapper, evaluator Bash not truly read-only, no explicit routing rules, growth model unexercised
- All gaps prompt-achievable. GSD v2's consolidation from 18→5 agents validates gobbi's lean approach.

**2C: Quality Gates & Verification** (gobbi-pi agent)
- 5 sub-topics: plan verification, execution verification, evaluation model, regression prevention, escalation
- Key gaps: no structured plan dimension checklist, evaluators don't run verification commands, zero cross-task regression checking (critical gap), no structured failure output
- Gobbi strength: 3-stance evaluation model is more sophisticated than GSD's single-stance approach

## Wave 2 (2 agents)

**2D: Workflow Automation & Resilience** (gobbi-pi agent)
- 5 sub-topics: phase transitions, crash recovery, stuck detection, parallel execution, workflow customization
- Key gaps: no auto-advance mechanism, zero crash/compaction recovery, no stuck/loop detection, no dependency-based parallel dispatch, hack system has no defined flags
- Crash recovery is the highest-priority gap (prompt-achievable via handoff file)

**2E: Documentation & Planning Structure** (gobbi-pi agent)
- 5 sub-topics: project knowledge hierarchy, plan format, template vs principle approach, dependency modeling, doc maintenance
- Key gaps: no standardized PROJECT.md, prose-only plan format (no structured fields), no dependency model, no lifecycle triggers for doc maintenance
- GSD v2's hybrid approach (required fields, not rigid templates) aligns well with gobbi's philosophy

## Wave 3: Synthesis (1 agent)

- Combined findings into structured report (11-synthesis-report.md)
- Note: synthesis agent did fresh audit instead of reading subtask files (files weren't pre-written to disk). This caused it to miss step-by-step recipe violations that Wave 1 agents caught.
- Report structure: executive summary, S1 findings by severity, S2 comparison by dimension, cross-references, top 15, statistics

## Wave 4: Evaluation (3 agents)

**Positive: PASS** — Evidence strong, cross-references insightful, prioritization defensible
**Moderate: REVISE** — File count off-by-one, I4 incomplete (2 more TodoWrite refs), M1 should be Important
**Critical: REVISE** — Major miss: step-by-step recipe violations in 5 "compliant" files (orchestration, plan, execution, notification, collection). The gobbi-claude gotcha already records this exact pattern at High priority.

## Corrections Needed on Synthesis Report

1. Add step-by-step recipe findings for gobbi-orchestration (blocking), gobbi-plan (blocking), gobbi-execution (important), gobbi-notification (important), gobbi-collection (minor)
2. Move M1 (EnterPlanMode/ExitPlanMode) from Minor to Important
3. Fix file count: 53 → 52
4. Add TodoWrite references in vision.md and gsd-analysis.md to I4
5. Clarify I1 count: 4 skills have name mismatches, not 3
6. Recalculate summary statistics (compliant count drops, violation count increases)

## Issues Encountered

- Subtask files not pre-written to disk before synthesis agent ran, causing it to do a fresh audit instead of combining Wave 1-2 outputs. This led to missed findings that the individual audits had caught.
- Gotcha recorded: always write subtask files to disk BEFORE launching synthesis.

## Deviations from Plan

- Plan called for writing subtask files after each wave. Files were not written in time for synthesis. The synthesis agent compensated by doing independent analysis.
- Plan evaluation per individual subtask was skipped in favor of evaluating the final synthesis. This was a deliberate choice per the plan.
