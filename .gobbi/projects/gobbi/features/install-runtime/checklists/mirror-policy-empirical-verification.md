---
name: mirror-policy-empirical-verification
description: Checklist — empirical verification steps required before locking mirror-canonical policy
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [mirror-canonical, symlink, empirical, checklist, verification]
---

# Mirror-policy empirical verification — checklist

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Run file-level symlink scan before locking mirror-canonical policy | mirror-policy evaluation (Codex Consistency) | implemented | `find .claude/skills/ -type l -name "*.md" \| wc -l` → 53 |
| 2 | Verify sample symlink target resolves to canonical mirror file | mirror-policy evaluation | implemented | `ls -la .claude/skills/orchestration/SKILL.md` → symlink to `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` |
| 3 | Verify `git ls-files -s` mode is 120000 for workspace symlinks | empirical check | implemented | mode 120000 confirmed for `.claude/skills/orchestration/SKILL.md` |
| 4 | Reproduce symlink-replacement failure mode with unsafe edit tool | empirical check | implemented | `sed -i` against `/tmp` symlink confirms: link.md → regular file; canonical unchanged |
