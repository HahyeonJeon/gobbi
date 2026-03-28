# Subtask 02: Evaluation Verification-by-Running

## What was done

Added verification-by-running principles to two evaluation skill files, teaching evaluator agents to use their available tools (Bash, Grep, Glob, Read) to gather evidence rather than relying solely on reasoning.

## Changes

### gobbi-evaluation/SKILL.md

Added a new core principle: "Verify by running, not just reading." Placed as the 6th principle in the Core Principles section, after "Recurring issues become gotchas." The principle explains the spectrum — ideation evaluation is mostly reasoning, plan evaluation might grep to verify paths exist, execution evaluation should always attempt to verify by running. Frames tools as evidence-gathering, not mandatory checklists.

- **Before:** 113 lines
- **After:** 116 lines (+3)

### gobbi-execution-evaluation/SKILL.md

Added a new "Verification by Running" criteria section between "Integration" and "Deliverable Quality." Contains five verification expectations: running existing tests, grepping for expected patterns, grepping for unwanted patterns, checking file syntax validity, and checking for collateral damage outside scope. Closes with a judgment clause — the evaluator decides which checks are relevant based on the task type.

- **Before:** 63 lines
- **After:** 75 lines (+12)

## What was preserved

- All existing content, frontmatter, principles, criteria sections, and stance-specific focus tables in both files
- No evaluator agent definitions were modified

## Verification

- Both files under 200 lines (116 and 75)
- Zero code blocks
- Zero numbered step-by-step recipes
- Principles describe WHAT to verify, not HOW to verify
