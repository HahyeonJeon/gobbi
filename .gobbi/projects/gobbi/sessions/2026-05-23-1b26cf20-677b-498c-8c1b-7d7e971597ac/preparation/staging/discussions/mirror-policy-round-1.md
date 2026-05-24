---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
loop: preparation
feature: session-foundations-bundle-b
topic: Mirror-propagation policy — iter1 lock (workspace canonical)
outcome: "Workspace canonical only — mirror auto-syncs (SUPERSEDED iter2 on corrected empirical evidence)"
status: superseded
superseded_by: mirror-policy-round-2-re-lock.md
---

# Mirror-propagation policy — iter1 lock (superseded)

## Context

During Preparation iter1 Sub-step D round 2 (post-base-9), the leader had identified a potential mirror-propagation concern: both `.claude/skills/` (workspace) and `.gobbi/projects/gobbi/skills/` (mirror) contain skill files, and it was unclear which was canonical and how changes propagated between them. An incomplete empirical scan (directory-level only) was presented.

## Question

Which path is canonical for skill files: the workspace `.claude/skills/` or the mirror `.gobbi/projects/gobbi/skills/`? How do changes propagate?

## Options considered

1. Workspace canonical; mirror auto-syncs.
2. Mirror canonical; workspace auto-syncs.
3. Both independent copies; manual sync required.

## User decision

Workspace canonical only — mirror auto-syncs. Decision staged at `staging/decisions/mirror-propagation-policy-workspace-canonical.md`.

## Implication

SUPERSEDED in iter2. The iter1 empirical scan missed 53 file-level symlinks under `.claude/skills/` that resolve to the canonical mirror files. The "workspace canonical" lock was based on a false premise (directory-level scan only). See `mirror-policy-round-2-re-lock.md` for the corrected decision.

## Related

- `preparation/staging/decisions/mirror-propagation-policy-workspace-canonical.md` (superseded)
- `preparation/staging/discussions/mirror-policy-round-2-re-lock.md` (superseding)
