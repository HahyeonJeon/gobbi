# Subtask 06: Write gobbi-hack SKILL.md

## What was written

`/playinganalytics/git/gobbi/.claude/skills/gobbi-hack/SKILL.md` — 92 lines covering the user override layer for gobbi customization via patch files.

## Line count

92 lines (well under both the 200-line should-target and 500-line must-limit).

## How design doc content was distilled

The design doc (`hacks.md`, 92 lines) contained several anti-patterns that needed elimination:

- **Three code blocks removed:** A patch file format example, a directory tree showing isolation model, and implicit numbered workflow steps. All converted to principle statements and table entries. The patch format example became a "read existing patches in this directory for the current format" codebase reference — following the gobbi-claude principle of codebase over examples.
- **Two numbered step sequences removed:** The "How Patches Work" 5-step sequence and "Generating Patches" 6-step sequence were both converted to principle-based prose explaining what matters (understand the target first, discuss with user, user reviews before writing) without prescribing a rigid order.
- **Isolation model converted to a constraint:** The directory tree showing core vs hack separation became the opening principle and the final constraints section — "never modify core skill files" and "patch files live directly in this directory."

## Judgment calls

1. **No navigation table:** The skill has no child documents, so no "Navigate deeper from here:" section was included. If child docs are added later (e.g., a patch authoring guide), this should be revisited.
2. **Frontmatter fields in a table, not a template:** The design doc showed exact YAML frontmatter as a code block. I converted this to a table describing the four fields and their purposes, avoiding the template anti-pattern while still giving agents enough to generate correct frontmatter.
3. **"Read existing patches" as codebase reference:** Rather than showing a patch example, I directed agents to read existing patches in the directory. This follows codebase-over-examples but depends on at least one patch existing to be useful. If the directory is empty, agents will need to derive format from the design doc or this skill's description of the fields.
4. **Flat structure preference applied:** Per the memory note on skill structure preference ("No nested subdirs in skills, SKILL.md goes directly in skill dir"), the constraints section explicitly states "no nested subdirectories except disabled/" — the disabled/ directory is an inherent part of the patch management design.
5. **Gotcha file was empty:** No gobbi-hack gotchas existed to incorporate. The skill was written to be consistent with the gobbi-claude gotchas (no code blocks, no recipes, no BAD/GOOD).
