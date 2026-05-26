---
scenario: mirror-policy-empirical-verification
feature: install-runtime
last_updated: 2026-05-24
finding-id: COD-CONS-PREP1-003
type: checklist_gap
domain: consistency
disposition: addressed
confidence: 100
severity: High
addressed-by: preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md
---

# Mirror-policy empirical verification — checklist

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Run file-level symlink scan before locking mirror-canonical policy | COD-CONS-PREP1-003 (iter1 Codex Consistency) | implemented | `find .claude/skills/ -type l -name "*.md" \| wc -l` → 53 (iter2) |
| 2 | Verify sample symlink target resolves to canonical mirror file | COD-CONS-PREP1-003 | implemented | `ls -la .claude/skills/orchestration/SKILL.md` → symlink to `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` |
| 3 | Verify `git ls-files -s` mode is 120000 for workspace symlinks | iter2 empirical check | implemented | mode 120000 confirmed for `.claude/skills/orchestration/SKILL.md` |
| 4 | Reproduce symlink-replacement failure mode with unsafe edit tool | iter3 empirical check | implemented | `sed -i` against `/tmp` symlink confirms: link.md → regular file; canonical unchanged |
