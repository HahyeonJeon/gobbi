---
date: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
loop: preparation
scope: feature
feature: install-runtime
topic: Mirror-propagation policy — iter2 re-lock on corrected empirical evidence
outcome: "Mirror canonical, workspace = symlink runtime layer; no sync needed — 53 file-level symlinks confirmed"
---

# Mirror-propagation policy — iter2 re-lock (corrected)

## Context

iter1's "workspace canonical only" lock was challenged by iter1 evaluation (both Claude and Codex raised it as Critical/FAIL). The iter2 leader performed a full file-level empirical scan and found 53 `.md` symlinks under `.claude/skills/` that resolve to canonical files in `.gobbi/projects/gobbi/skills/`. The iter1 lock was based on an incomplete directory-level-only scan.

## Question

Given the corrected empirical evidence (53 file-level symlinks), which path is canonical: the mirror or the workspace?

## Options considered

1. Mirror canonical; workspace is the symlink runtime layer (both paths resolve to the same physical file via symlinks). No sync mechanism needed.
2. Workspace canonical; workspace symlinks are incorrect and should be replaced with real files. Manual mirror copies needed.
3. Both independent; full sync tooling needed.

## User decision

**Mirror canonical, workspace = symlink runtime layer; no sync needed.** Both paths resolve to the same physical file via 53 file-level symlinks. No new sync mechanism needed (the symlink layer IS the sync mechanism). The iter1 lock is superseded.

Evidence: `find .claude/skills/ -type l -name "*.md" | wc -l` → 53; sample: `.claude/skills/orchestration/SKILL.md -> ../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md`.

## Implication

- New decision file: `staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` (status: accepted, supersedes iter1 file).
- iter1 file `mirror-propagation-policy-workspace-canonical.md` marked superseded + body appended with "## Supersession reason".
- iter1 conditional `workspace-to-mirror-sync-mechanism.md` backlog marked superseded as moot (symlink layer IS the sync).
- iter1 "manual mirror-edit recommended" interim discipline rescinded.
- Both `.claude/skills/` and `.gobbi/projects/gobbi/skills/` paths can be cited in Planning briefs — both resolve to the same file for inode-preserving edit methods.

## Related

- `preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md`
- `preparation/staging/decisions/mirror-propagation-policy-workspace-canonical.md` (superseded)
- `mirror-policy-workspace-canonical-superseded.md` (superseded)
- `preparation/staging/discussions/edit-contract-addition.md` (iter3 follow-on)
