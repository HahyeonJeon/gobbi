---
name: post-split-gate-both-required
description: Both the no-broken-symlink gate and the presence gate are required after the skill-dir split
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [verification, codex]
keywords: [skill-restructure, symlinks]
author: claude
archived_at: 2026-07-20
archive_reason: addressed
---

# Post-split gate coverage — implementation checklist

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | No-broken-symlink gate passes after skill-dir split | INT-1 | pending | `find -L . -type l -print` → 0 output |
| 2 | Presence gate passes: `.agents/skills/memory` exists as a dir-level symlink | INT-1 | pending | `readlink .agents/skills/memory` → non-empty |
| 3 | Presence gate passes: `.agents/skills/record` exists as a dir-level symlink | INT-1 | pending | `readlink .agents/skills/record` → non-empty |
| 4 | Presence gate passes: `.claude/skills/memory/` directory exists with per-file symlinks | INT-1 | pending | `ls .claude/skills/memory/` → non-empty |
| 5 | Presence gate passes: `.claude/skills/record/` directory exists with per-file symlinks | INT-1 | pending | `ls .claude/skills/record/` → non-empty |
| 6 | `Skill(memory)` in `.claude/settings.json` | INT-1 | pending | `grep "Skill(memory)" .claude/settings.json` → found |
| 7 | `Skill(record)` in `.claude/settings.json` | INT-1 | pending | `grep "Skill(record)" .claude/settings.json` → found |

## Item details

### Why both gates are required
Gate 1 (no-broken-symlink) verifies that no EXISTING symlink points at a now-missing target. It does NOT verify that NEW symlinks were created. Gate 2-7 (presence) verify that each new link was created. A split that passes only gate 1 can have missing `.agents/skills/memory` — which would leave native Codex unable to load the new skill.

**Anchor reasoning**: INT-1 (tool-verified three-surface granularity); codex-ideation-structure-002.
