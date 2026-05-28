---
name: mirror-policy-mirror-canonical-relock
description: User re-locked mirror-propagation policy on corrected empirical evidence — mirror canonical, workspace is symlink runtime layer, 53 file-level symlinks confirmed; supersedes workspace-canonical lock.
type: discussions
scope: feature
feature: install-runtime
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [mirror-policy, symlinks, preparation]
topic: Mirror-propagation policy — re-lock on corrected empirical evidence
outcome: "Mirror canonical, workspace = symlink runtime layer; no sync needed — 53 file-level symlinks confirmed"
---

# Mirror-propagation policy — re-lock on corrected empirical evidence

## Context

The first Preparation evaluation iteration (both Claude and Codex) challenged the "workspace canonical only" lock as Critical/FAIL. The leader performed a full file-level empirical scan and found 53 `.md` symlinks under `.claude/skills/` that resolve to canonical files in `.gobbi/projects/gobbi/skills/`. The first-iteration lock was based on an incomplete directory-level-only scan.

## Question

Given the corrected empirical evidence (53 file-level symlinks), which path is canonical: the mirror or the workspace?

## Options considered

1. Mirror canonical; workspace is the symlink runtime layer (both paths resolve to the same physical file via symlinks). No sync mechanism needed.
2. Workspace canonical; workspace symlinks are incorrect and should be replaced with real files. Manual mirror copies needed.
3. Both independent; full sync tooling needed.

## User decision

**Mirror canonical, workspace = symlink runtime layer; no sync needed.** Both paths resolve to the same physical file via 53 file-level symlinks. No new sync mechanism needed (the symlink layer IS the sync mechanism). The earlier workspace-canonical lock is superseded.

Evidence: `find .claude/skills/ -type l -name "*.md" | wc -l` → 53; sample: `.claude/skills/orchestration/SKILL.md -> ../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md`.

## Implication

- New decision file: `mirror-propagation-policy-mirror-canonical-symlinks.md` (status: accepted, supersedes the workspace-canonical file).
- Workspace-canonical file `mirror-propagation-policy-workspace-canonical.md` marked superseded + body appended with supersession reason.
- Conditional backlog for workspace-to-mirror sync mechanism marked superseded as moot (symlink layer IS the sync).
- "Manual mirror-edit recommended" interim discipline rescinded.
- Both `.claude/skills/` and `.gobbi/projects/gobbi/skills/` paths can be cited in Planning briefs — both resolve to the same file for inode-preserving edit methods.

## Related

- `decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md` — the corrected decision this discussion locked.
- `decisions/2026-05-24-mirror-propagation-policy-workspace-canonical.md` — the superseded workspace-canonical decision.
- `discussions/mirror-policy-workspace-canonical-superseded.md` — the superseded first-iteration discussion.
- `discussions/edit-contract-addition.md` — follow-on discussion about the symlink-preservation edit contract.
