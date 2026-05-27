---
name: mirror-policy-workspace-canonical-false-premise
description: Scenario — verifying file-level symlink topology before locking mirror-canonical policy
type: scenarios
scope: feature
feature: install-runtime
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [mirror-policy, symlink, topology, false-premise, scenario]
---

# Mirror-policy workspace-canonical false premise — scenario gap

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Verify file-level symlink topology before locking mirror-canonical policy | mirror-policy empirical evaluation | implemented | `find .claude/skills/ -type l -name "*.md" | wc -l` → 53 |
| 2 | Lock: mirror IS canonical, workspace is symlink runtime layer | user-confirmed re-lock via AskUserQuestion | implemented | Decision file `mirror-propagation-policy-mirror-canonical-symlinks.md` status=accepted |
| 3 | Guard against rewrite-by-rename edit methods breaking symlink layer | edit contract | implemented | "## Symlink-preservation edit contract" in decision file |

## Item details

### 1. Verify file-level symlink topology

A previous empirical scan of `.claude/skills/` had been performed at directory level only, missing 53 file-level symlinks. This scenario gap ensures any future lock on mirror/workspace topology is preceded by a file-level (`-type l`) check.

**Anchor reasoning**: The missing file-level scan was surfaced as a scenario gap by the Codex evaluator during install-runtime preparation.

**Verification approach**: `find .claude/skills/ -type l -name "*.md" | wc -l` returns 53; `ls -la .claude/skills/orchestration/SKILL.md` shows symlink to `../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md`.
