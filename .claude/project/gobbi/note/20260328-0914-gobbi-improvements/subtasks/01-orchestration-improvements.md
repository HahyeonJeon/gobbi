# Subtask 01: Orchestration Skill Improvements

## What was added

### A. Resume and Recovery section (lines 42-52)

New `## Resume and Recovery` section with four blockquote principles:

1. **Notes are the state machine** — describes how note file existence maps to workflow progress (ideation.md, plan.md, execution.md). No note directory means fresh start.
2. **Resume by reading, not guessing** — read existing notes to recover context rather than reconstructing from memory.
3. **Ask the user how to proceed** — present recovered state via AskUserQuestion with options: continue, restart phase, or new task.
4. **TaskCreate to rebuild the checklist** — recreate Step 1-4 tasks and mark completed ones based on note files found.

Placed after the skill-loading table and "Must write note at every step" line, before Step 1 heading. Separated from subsequent content with a horizontal rule.

### B. Wave verification principle (line 90)

New bullet in Step 3 (Execution -- Delegation) after the existing "After all subtasks complete" bullet:

Describes reviewing combined wave outputs for consistency before launching the next wave. Specifically calls out: contradictory changes, file overlap between subtasks, and findings that affect subsequent waves. Explicitly scoped as "lightweight read-through, not a full evaluation spawn."

## Placement

- Resume section: between line 40 (note requirement) and the Step 1 heading
- Wave verification: appended as last bullet in Step 3's bullet list

## Line count

- Before: 148 lines
- After: 162 lines (under 200 limit)
- Net addition: 14 lines

## Judgment calls

- Used `##` heading level for Resume and Recovery (same level as "Workflow" and "Constraints") rather than `###` (step level). This is a cross-cutting concern that applies before any step runs, not a substep within the workflow.
- Added a horizontal rule (`---`) after the Resume section to visually separate it from the step-by-step workflow sections that follow. This matches the existing pattern where `---` separates major sections.
- Kept the wave verification as a bullet (matching Step 3's existing format) rather than a blockquote principle, since Step 3 uses bullet lists while Steps 1-2 use blockquote principles.
- Used en-dash (Step 1-4) in the TaskCreate principle to match the style used elsewhere in the file.
