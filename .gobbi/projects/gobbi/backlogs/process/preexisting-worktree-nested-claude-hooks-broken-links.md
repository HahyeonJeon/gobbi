---
name: preexisting-worktree-nested-claude-hooks-broken-links
description: check-markdown-links.sh reports broken .claude/hooks|scripts links caused by worktree-nesting path resolution, not by this session's edits
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process]
keywords: [check-markdown-links, worktree-nesting, false-positive, orchestration-skill, tooling]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Pre-existing worktree-nested `.claude/hooks|scripts` broken links

## Context

During Execution iter2 verification, `check-markdown-links.sh` reported 4 broken links at
`orchestration/SKILL.md:113` (the row-5 cell) pointing at `.claude/hooks|scripts/*.sh` paths. The
Execution loop's iter2 evaluation confirmed these are a worktree-nesting artifact: the relative link
target resolves through `../../../../.claude/` from inside the nested
`.gobbi/projects/gobbi/skills/orchestration/` copy under the worktree, which is one directory level
off from where the checker expects to land. The targets exist and resolve correctly at the real repo
root; the same links are present identically on `develop`, unchanged by this session's edits.

## Why deferred

This is a pre-existing checker/path-resolution mismatch, not a defect introduced by the D7-001 /
D1-001 / D1-003 / D7-002 fixes in this session. Fixing it is either a `check-markdown-links.sh`
worktree-awareness improvement or a link-relativization fix in `orchestration/SKILL.md` — neither was
in this session's locked scope, and the false-positive does not block this session's PASS (the
Execution loop's Risk perspective explicitly verified no NEW broken links were introduced).

## When to pick up

No hard prerequisite. Natural trigger: the next session that does a broader `check-markdown-links.sh`
hygiene pass, or the next time `orchestration/SKILL.md`'s row-5 cell is edited for another reason.

## Suggested approach

Two candidate fixes, either sufficient: (a) make `check-markdown-links.sh` resolve relative links
against the repo root it detects (accounting for a worktree nested one level under
`.gobbi/projects/{name}/worktrees/{branch}/`) rather than the file's own directory chain; or (b)
change the link targets in `orchestration/SKILL.md:113` to a path form that resolves correctly from
both the main tree and a nested worktree copy. Verify with a clean `check-markdown-links.sh` run from
both a plain checkout and a worktree checkout before closing.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-03-bf4dc336-65bd-4a52-9055-d79fc82b7e2e/`

## Related

- [[resume-continue-target-must-include-ideation]] — a sibling Execution iter2 verification finding
  from the same evaluation pass (unrelated defect, same review round)
