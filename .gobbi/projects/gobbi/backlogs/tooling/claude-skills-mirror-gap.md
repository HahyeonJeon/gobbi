---
name: claude-skills-mirror-gap
description: Decide whether the .claude/skills/ missing gobbi-hook-authoring mirror is intentional and whether sync-plugin-package.sh should manage it.
type: backlogs
scope: project
feature: null
status: closed
created: 2026-06-24
session: 2026-06-24-bb4eb896-bed0-42d6-9a3c-f74547df2611
tags: [process]
keywords: [sync-plugin-package, mirror, gobbi-hook-authoring, claude-skills, agents-skills, asymmetry]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# `.claude/skills/` missing `gobbi-hook-authoring` mirror

## Resolution

Closed by the R1 doc-sweep (session `2026-06-27-b5601d38`). The standalone hook-authoring
skill was removed — its content folded into the `hook-authoring.md` child-doc under
`gobbi/SKILL.md`. With no standalone hook-authoring skill dir left to mirror, the
`.claude/skills/` vs `.agents/skills/` asymmetry described below no longer exists: there is
nothing left to mirror, so the mirror-parity question is moot. The historical context below
is retained per the no-delete rule for backlogs.

## Context

Verified during the `skill-writing` Ideation session (2026-06-24): `.agents/skills/` has 20 skill symlinks but `.claude/skills/` has 19. The `gobbi-hook-authoring` skill is mirrored on the Codex side (`.agents/skills/`) but not on the Claude side (`.claude/skills/`). The asymmetry was found incidentally; whether it is intentional is unknown.

`scripts/sync-plugin-package.sh` currently manages `.agents/skills/` + plugin dirs + `.claude/hooks/`. It does NOT manage `.claude/skills/`.

## Why deferred

Out of scope for the skill-writing/agent-writing session (DD-6). The asymmetry does not block any in-session work.

## When to pick up

No hard prerequisite. Pick up when auditing `.claude/skills/` mirror parity or when adding/removing skills and the asymmetry would compound.

## Suggested approach

1. Decide intent: is `gobbi-hook-authoring` intentionally Claude-side-excluded (e.g., hook authoring is Codex-only by design) or was the mirror entry simply missed?
2. If missed: add the `.claude/skills/gobbi-hook-authoring` symlink and update `scripts/sync-plugin-package.sh` to manage `.claude/skills/` mirror going forward.
3. If intentional: document the exclusion in the skill's frontmatter or a comment in `sync-plugin-package.sh` so future audits know it is deliberate.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-24-bb4eb896-bed0-42d6-9a3c-f74547df2611/`

## Related

- [[skill-loadability-and-map-placement]] — session that surfaced the asymmetry
