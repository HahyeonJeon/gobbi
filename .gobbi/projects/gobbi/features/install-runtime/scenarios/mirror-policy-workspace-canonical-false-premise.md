---
scenario: mirror-policy-workspace-canonical-false-premise
feature: install-runtime
last_updated: 2026-05-24
finding-id: COD-PROJ-PREP1-002
type: scenario_gap
domain: mirror-policy
disposition: addressed
confidence: 100
severity: High
addressed-by: preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md
---

# Mirror-policy workspace-canonical false premise — scenario gap

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Verify file-level symlink topology before locking mirror-canonical policy | COD-PROJ-PREP1-002 (iter1 Codex Project) | implemented | `find .claude/skills/ -type l -name "*.md" | wc -l` → 53 |
| 2 | Lock: mirror IS canonical, workspace is symlink runtime layer | iter2 user re-lock via AskUserQuestion | implemented | Decision file `mirror-propagation-policy-mirror-canonical-symlinks.md` status=accepted |
| 3 | Guard against rewrite-by-rename edit methods breaking symlink layer | iter3 edit contract | implemented | New H2 "## Symlink-preservation edit contract" in decision file |

## Item details

### 1. Verify file-level symlink topology

The iter1 Preparation WORK phase performed a directory-level-only empirical scan, missing 53 file-level symlinks. This scenario gap ensures any future lock on mirror/workspace topology is preceded by a file-level (`-type l`) check.

**Anchor reasoning**: COD-PROJ-PREP1-002 specifically called out the missing file-level scan as a scenario gap.

**Verification approach**: `find .claude/skills/ -type l -name "*.md" | wc -l` returns 53; `ls -la .claude/skills/orchestration/SKILL.md` shows symlink to `../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md`.
