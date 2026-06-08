---
name: 2026-06-08-session-staging-flatten-scope
description: User chose full flatten + naming standard extension to the session staging tier; accept the blast radius
type: discussions
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [session-staging, naming, d3, flatten]
loop: ideation
outcome: Full flatten + extend rules.md §1.3 to session tier; scope moves from path into frontmatter
---

# Session staging: flatten + naming standard extension

## Context

The current session staging structure uses a deep nested path for backlogs: `staging/backlogs/{feature,project}/{slug}.md`. Real sessions hold positional slugs like `item-1-2-skill-loading-discipline.md` — exactly the anti-pattern `rules.md § 1.3` forbids. However, `rules.md § 1.3` only governs project-memory slugs, not session-staging slugs.

## Question

Should the naming standard be extended to the session staging tier, and should the deep nested path be flattened? What blast radius is acceptable?

## Options considered

1. **Full flatten + extend naming standard:** collapse `staging/backlogs/{feature,project}/{slug}` → `staging/backlogs/{slug}` with `scope:` frontmatter; extend `rules.md § 1.3` to the session tier; accept the blast radius (8 SKILL.md files + backlogs template + memory-map + wrap-up routing).
2. **Partial fix:** fix the positional slug anti-pattern only, keep the `feature/project` path split.
3. **No change now:** defer to a future session.

## User decision

**Full flatten + extend naming standard.** Accept the blast radius. The backlogs template already carries `scope:` in frontmatter and already forbids `item-N-M-` slugs — the path just never aligned. D3 aligns it.

## Implication

- D3 blast radius: `ideation/SKILL.md` (7 refs), `preparation/SKILL.md` (2), `planning/SKILL.md` (2), `wrap-up/SKILL.md` (2), `memorization/SKILL.md` (4), `memorization/memory-map.md` (2), `memorization/templates/backlogs.md` (lifecycle § lines ~9-10), `memorization/rules.md § 1.3` (extension).
- The wrap-up router currently splits on path (`backlogs/feature/`→feature, `backlogs/project/`→project); flattening means it reads `scope:` frontmatter instead — a real co-change.
- `execution/SKILL.md` has 0 backlog-split refs — verify no hidden refs before closing D3.

## Related

- Design § D3, Research insight I5, Scenario S7
