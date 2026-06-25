---
name: sweep-executor-verification-steps
description: Checklist items the executor must run after the vocabulary sweep to verify completeness
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [vocabulary-sweep, verification]
keywords: [executor]
author: claude
---

# Vocabulary sweep executor verification — implementation checklist

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Exhaustive-vocabulary alternation grep returns zero survivors in the 71 in-scope files | INT-2; mistake `sweep-grep-literal-loop-name-blindspot` | pending | `grep -rilE "memoriz\|session[ -]memor\|project[ -]memor" <in-scope-files>` → 0 (after known intentional retentions filtered) |
| 2 | `workflow/record.md` exists on disk and `workflow/memorization.md` does not | INT-3 | pending | `test -f workflow/record.md && test ! -f workflow/memorization.md` |
| 3 | No-broken-symlink gate: `find -L . -type l -print` returns zero broken links | INT-1 | pending | `find -L <worktree> -type l -print` → 0 |
| 4 | Presence gate: `.agents/skills/{memory,record}` exist; `.claude/skills/{memory,record}/` exist; `Skill(memory)` + `Skill(record)` in `.claude/settings.json`; `workflow/record.md` reachable via `.claude/skills/orchestration/` | INT-1 | pending | `ls .agents/skills/memory .agents/skills/record .claude/skills/memory .claude/skills/record` → all present; grep `settings.json` |
| 5 | 21 EXCLUDE files are untouched (diff check) | D-e EXCLUDE list | pending | `git diff HEAD -- features/workflow/ notes/ backlogs/workflow/persist-session-memory-past-cleanup.md mistakes/ skills/mistake/layer2-* CHANGELOG.md` → 0 changes |

## Item details

### 1. Exhaustive-vocabulary grep
The alternation must use the corrected ERE form after the dialect fix (item from `checklists/process/manifest-verbatim-rerun-reproducibility.md`). Run against the B1..B7 file set, not the whole repo.

**Anchor reasoning**: mistake `sweep-grep-literal-loop-name-blindspot` — the recorded mistake mandates exhaustive alternation, not form-specific grep.

### 4. Presence gate rationale
The no-broken-symlink gate (item 3) proves existing links resolve but does NOT prove new links were CREATED. The presence gate is the direct evidence that a Codex user dispatched after the split can load `skills/memory/` and `skills/record/`.
