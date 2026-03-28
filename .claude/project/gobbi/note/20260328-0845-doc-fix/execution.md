# Execution: Fix Doc Review Findings

## Overview

7 agents in 1 wave fixing all remaining doc review findings across 10 files.

## Wave 1 (7 agents in parallel)

### Task 1: Reframe gobbi-orchestration/SKILL.md

**Agent:** general-purpose
**Result:** Replaced numbered substeps in Step 1 (5 steps) and Step 2 (6 steps) with blockquote principle statements. Step 3 and Step 4 already used bullet points — no changes needed. All tables and Constraints section preserved. 143 lines → 149 lines. Zero numbered recipes remain.

### Task 2: Reframe gobbi-plan/SKILL.md + fix name

**Agent:** general-purpose
**Result:** Fixed frontmatter `name: plan` → `name: gobbi-plan`. Replaced "How to Plan" 5-step list with 4 principle blockquotes: "Always start in plan mode", "Explore before decomposing", "Decomposition is the core act", "Exit plan mode to present, not to finish" (incorporates the EnterPlanMode revision gotcha). 87 lines → 90 lines.

### Task 3: Reframe gobbi-execution/SKILL.md + fix name

**Agent:** general-purpose
**Result:** Fixed frontmatter `name: task` → `name: gobbi-execution`. Replaced numbered list in Study subsection with principle-based intro + unnumbered bullet points. Plan/Execute/Verify subsections unchanged. 89 lines → 90 lines.

### Task 4: Reframe gobbi-collection/SKILL.md

**Agent:** general-purpose
**Result:** Replaced "What to Do" 4 numbered steps with 4 named responsibility descriptions (note persistence, subtask preservation, gotcha recording, phase transition). Preserves the per-wave subtask writing gotcha. 77 lines → 75 lines.

### Task 5: Fix stale references and frontmatter names

**Agent:** general-purpose
**Result:** distribution.md: replaced 3 renamed skills, replaced 4 stale agent file names with 5 actual agents, added 5 missing skills to directory tree. hacks.md: fixed 4 stale references (2 gobbi-orchestrate, 2 gobbi-task-evaluation). gobbi-delegation: name delegate → gobbi-delegation. gobbi-claude: name claude → gobbi-claude.

### Task 6: Write gobbi-hack/SKILL.md

**Agent:** general-purpose
**Result:** Wrote 92-line skill file. Covers: core principle (patches over core edits), patch structure (frontmatter fields in table), generation through conversation, validation checks (table), management operations (table), and constraints. Zero code blocks — all design doc examples converted to principle statements and tables.

### Task 7: Write gobbi-planner.md

**Agent:** general-purpose
**Result:** Wrote 81-line agent definition (matches gobbi-pi.md length). Identity-first design, "Before You Start" section, full lifecycle (Study/Plan/Execute/Verify/Memorize), out-of-scope boundaries, quality expectations. No model field (planning doesn't require Opus). AskUserQuestion excluded from tools (out of scope for planner).

## Verification

- Grep for stale references: zero matches in skill/design files (only in historical note files)
- Frontmatter names: zero mismatches
- New files: gobbi-hack/SKILL.md (92 lines), gobbi-planner.md (81 lines)
- All modified files under 200 lines

## Issues Encountered

None. All 7 agents completed successfully on first attempt. All subtask docs written by agents directly.

## Deviations from Plan

None.
