---
name: mirror-policy-empirical-verification
description: Checklist — empirical verification steps required before locking mirror-canonical policy
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-05-24
last_updated: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [mirror-canonical, symlink, empirical, checklist, verification]
---

# Mirror-policy empirical verification — implementation checklist

The empirical checks that must pass before the mirror-canonical policy (mirror file is canonical, the `.claude/` workspace is a symlink runtime layer) is locked. Each row was run and confirmed before the policy was accepted.

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Run file-level symlink scan before locking mirror-canonical policy | mirror-policy evaluation (Codex Consistency) | implemented | `find .claude/skills/ -type l -name "*.md" \| wc -l` → 53 |
| 2 | Verify sample symlink target resolves to canonical mirror file | mirror-policy evaluation | implemented | `ls -la .claude/skills/orchestration/SKILL.md` → symlink to `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` |
| 3 | Verify `git ls-files -s` mode is 120000 for workspace symlinks | empirical check | implemented | mode 120000 confirmed for `.claude/skills/orchestration/SKILL.md` |
| 4 | Reproduce symlink-replacement failure mode with unsafe edit tool | empirical check | implemented | `sed -i` against `/tmp` symlink confirms: link.md → regular file; canonical unchanged |

## Item details

### 1. File-level symlink scan
A directory-level scan misses file-level symlinks. The file-level (`-type l`) scan is the one that establishes how many workspace files are symlinks (53 here) before any policy assumes the topology.

### 4. Reproduce the symlink-replacement failure mode
The failure mode is a rewrite-by-rename edit method (e.g. `sed -i`) silently replacing a symlink with a regular file. Reproducing it against a throwaway `/tmp` symlink confirms the hazard is real (the link becomes a regular file while the canonical target is untouched), which is what motivates the symlink-preservation edit contract.
