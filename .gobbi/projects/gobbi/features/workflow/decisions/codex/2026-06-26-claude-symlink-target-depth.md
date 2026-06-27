---
name: claude-symlink-target-depth
description: The .claude/ symlink for production.md must use a 4-level ../ target, matching its verified siblings, not the 3-level path the backlog suggested
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [codex, verification]
keywords: [C1, claude-mirror, symlink-target, production-md, relative-path]
author: claude
---

# The `.claude/` symlink for production.md needs a 4-level relative target (C1)

## Context

C1 adds `production.md` to `.claude/skills/orchestration/workflow/` as a symlink matching its seven
siblings. The staged backlog `mirror-production-md-to-claude-skills` § Suggested approach wrote the
target as `../../../.gobbi/projects/gobbi/skills/orchestration/workflow/production.md` (**three**
`../`). That is one level too shallow.

## Decision

Use a **four-level** relative target:
`production.md -> ../../../../.gobbi/projects/gobbi/skills/orchestration/workflow/production.md`.

## Rationale

Verified this session with `readlink .claude/skills/orchestration/workflow/evaluation.md` →
`../../../../.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md` (**four** `../`). From
`workflow/`, reaching the repo root is `workflow → orchestration → skills → .claude → repo-root` = 4
levels. The backlog's 3-level path resolves above the repo root and yields a **dangling symlink** that
the D2.5 gate would still flag as missing (`test -e` follows the link and fails). Match the verified
sibling exactly.

## Alternatives considered

- **Copy the file instead of symlinking** — rejected: every sibling is a symlink; a copy diverges from
  the established `.claude/` mirror convention and would drift from canonical on the next edit.
- **Use an absolute target** — rejected: siblings use relative targets; stay consistent.

## Consequences

Execution used the 4-level target and verified with `readlink` + the D2.5 gate (emits nothing) before
committing. Shipped as commit `f51f8d27` (C1/F1). The staged backlog's suggested-path line is
superseded by this correction.

## Related

- [[dual-system-verification-frame]] — the frame whose D2.5 gate this fix satisfies
- [[2026-06-26-verification-frame-phase-b-shipped]] — the changelog recording C1's ship
