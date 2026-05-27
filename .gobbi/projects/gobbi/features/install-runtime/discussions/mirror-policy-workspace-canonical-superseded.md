---
name: mirror-policy-workspace-canonical-superseded
description: First-iteration mirror-propagation policy lock (workspace canonical) — superseded by corrected empirical evidence confirming file-level symlinks make mirror canonical.
type: discussions
scope: feature
feature: install-runtime
status: superseded
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [mirror-policy, symlinks, preparation, superseded]
loop: preparation
topic: Mirror-propagation policy — first-iteration lock (workspace canonical, superseded)
outcome: "Workspace canonical only — mirror auto-syncs (SUPERSEDED on corrected empirical evidence)"
superseded_by: mirror-policy-mirror-canonical-relock.md
---

# Mirror-propagation policy — iter1 lock (superseded)

## Context

During the first Preparation loop iteration, the leader identified a potential mirror-propagation concern: both `.claude/skills/` (workspace) and `.gobbi/projects/gobbi/skills/` (mirror) contain skill files, and it was unclear which was canonical and how changes propagated between them. An incomplete empirical scan (directory-level only) was presented.

## Question

Which path is canonical for skill files: the workspace `.claude/skills/` or the mirror `.gobbi/projects/gobbi/skills/`? How do changes propagate?

## Options considered

1. Workspace canonical; mirror auto-syncs.
2. Mirror canonical; workspace auto-syncs.
3. Both independent copies; manual sync required.

## User decision

Workspace canonical only — mirror auto-syncs. Decision now captured in `decisions/2026-05-24-mirror-propagation-policy-workspace-canonical.md` (status: superseded).

## Implication

SUPERSEDED by the second-iteration corrected lock. The first-iteration empirical scan missed 53 file-level symlinks under `.claude/skills/` that resolve to the canonical mirror files. The "workspace canonical" lock was based on a false premise (directory-level scan only). See `mirror-policy-mirror-canonical-relock.md` for the corrected decision.

## Related

- `decisions/2026-05-24-mirror-propagation-policy-workspace-canonical.md` (superseded decision)
- `mirror-policy-mirror-canonical-relock.md` (superseding discussion)
