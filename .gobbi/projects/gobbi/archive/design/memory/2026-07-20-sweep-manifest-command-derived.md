---
name: sweep-manifest-command-derived
description: D-e sweep manifest with command-derived counts and exhaustive-vocabulary alternation; note on dialect fix needed
type: design
scope: feature
feature: workflow
status: retired
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [vocabulary-sweep, verification, design]
keywords: [manifest]
author: claude
supersedes: null
superseded_by: null
related: [manifest-command-grep-dialect-bug, manifest-verbatim-rerun-reproducibility]
archived_at: 2026-07-20
archive_reason: retired
---

# Sweep manifest: command-derived counts (D-e)

## Problem
The iter1 sweep strategy relied on hand-counted figures that drifted from the codebase. The form-blindness mistake means a grep for one form of a term misses other forms. The result: the iter1 draft had wrong counts (12 prose sites instead of 49) and missed a file category entirely.

## Scope
In: define the 71-file in-scope manifest with command-derived counts; define the 21-file EXCLUDE list; define the exhaustive-vocabulary alternation. Out: the actual sweep execution (Execution phase).

## Approach

**In-scope manifest (71 files):**

| Bucket | Count | Command |
|---|---|---|
| B1 `skills/memorization/` | 20 | `find $ROOT/skills/memorization -type f \| wc -l` |
| B2 `skills/wrap-up/` | 2 | `grep -ril "$T" $ROOT/skills/wrap-up \| wc -l` |
| B3 other live skills (incl `workflow/memorization.md`) | 35 | `grep -ril "$T" $ROOT/skills \| grep -v "/memorization/\|/wrap-up/\|skills/mistake/layer2-" \| wc -l` |
| B4 `agents/` | 6 | `grep -ril "$T" $ROOT/agents \| wc -l` |
| B5 `hooks/` | 2 | `grep -ril "$T" $ROOT/hooks \| wc -l` |
| B6 root `scripts/` | 1 | `grep -ril "$T" scripts \| wc -l` |
| B7 real wrapper files | 5 | `grep -ril "$T" .claude/CLAUDE.md .claude/settings.json .codex/AGENTS.md .claude-plugin/marketplace.json plugins/gobbi/.codex-plugin/plugin.json \| wc -l` |
| **TOTAL** | **71** | sum B1..B7 |

**EXCLUDE list (21 files):** `features/workflow/**` (15), `notes/` (1), `backlogs/` (1), `mistakes/` (1), `skills/mistake/layer2-*` (2), `CHANGELOG.md` (1).

**Exhaustive-vocabulary pattern** `T` (ERE, for `grep -rilE`):
```
T="memoriz|session[ -]memor|project[ -]memor"
```

Note: the D-e manifest printed BRE `\|` under `grep -E` — this is the dialect bug (PROJ-1/CONS-1). Fix to `|` (ERE) before running verification. The COUNTS are all ground-truth-correct; only the printed syntax was wrong.

## Scenarios
- Regenerate the manifest: re-run each B-bucket command; expected output matches the stated count.
- Post-sweep verification: exhaustive-vocabulary grep → 0 survivors in the 71 in-scope files (intentional retentions filtered).

## Validation
- Each manifest row command → stated count (after dialect fix).
- 92-file union (71 + 21) = `grep -rilE "$T" . --include='*.md' --include='*.json' --include='*.sh' --include='*.toml' | grep -v /sessions/ | grep -v /worktrees/ | wc -l` → 92.

## Trade-offs
Command-derived manifest adds one re-run step before the sweep. The cost is low; the benefit is a single authoritative figure every downstream actor can regenerate.

## Open issues
Dialect fix needed: change `T="memoriz\|..."` to `T="memoriz|..."` (ERE) in the D-e manifest before Execution's verification run.
