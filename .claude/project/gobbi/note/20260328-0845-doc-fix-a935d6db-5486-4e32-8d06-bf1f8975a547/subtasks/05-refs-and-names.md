# Subtask 05: Fix Stale Skill/Agent References and Frontmatter Name Mismatches

## Summary

Fixed stale references and frontmatter name mismatches across 4 files. All prose content unchanged.

## Changes Per File

### File 1: `.claude/project/gobbi/design/distribution.md`

**Agent list replaced** (lines 94-98):
- Removed: `orchestrator.md`, `planner.md`, `executor.md`, `evaluator.md`
- Added: `gobbi-pi.md`, `gobbi-planner.md`, `gobbi-evaluator-positive.md`, `gobbi-evaluator-moderate.md`, `gobbi-evaluator-critical.md`

**Skill directory names fixed:**
- `gobbi-orchestrate/` -> `gobbi-orchestration/`
- `gobbi-task/` -> `gobbi-execution/`
- `gobbi-task-evaluation/` -> `gobbi-execution-evaluation/`

**Missing skills added to directory tree:**
- `gobbi-discuss/`
- `gobbi-delegation/`
- `gobbi-note/`
- `gobbi-collection/`
- `gobbi-notification/`

### File 2: `.claude/project/gobbi/design/hacks.md`

**Isolation Model code block (lines 52-61):**
- `gobbi-orchestrate` -> `gobbi-orchestration` (2 occurrences: comment and standalone line)
- `gobbi-task-evaluation` -> `gobbi-execution-evaluation` (2 occurrences: comment and standalone line)

### File 3: `.claude/skills/gobbi-delegation/SKILL.md`

- Frontmatter `name: delegate` -> `name: gobbi-delegation`

### File 4: `.claude/skills/gobbi-claude/SKILL.md`

- Frontmatter `name: claude` -> `name: gobbi-claude`

## Verification

Grep confirmed zero remaining references to any of:
- `gobbi-orchestrate` (without the `ion` suffix)
- `gobbi-task` (as standalone skill name)
- `gobbi-task-evaluation`
- `orchestrator.md`
- `executor.md`
- `evaluator.md` (as standalone old agent filename)

## Total References Fixed

- **distribution.md**: 4 stale skill names replaced, 4 stale agent names replaced, 5 missing skills added
- **hacks.md**: 4 stale references replaced (2 skill names x 2 occurrences each)
- **gobbi-delegation/SKILL.md**: 1 frontmatter name fixed
- **gobbi-claude/SKILL.md**: 1 frontmatter name fixed
- **Grand total**: 14 references fixed, 5 skills added
