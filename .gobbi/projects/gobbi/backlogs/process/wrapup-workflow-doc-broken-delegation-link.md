---
name: wrapup-workflow-doc-broken-delegation-link
description: orchestration/workflow/wrap-up.md:17 has a broken relative link to the delegation prompt-requirements anchor; fix the link target
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-16
session: 3596d7f1-ee88-4055-8e66-a67f977812ad
tags: [docs-sync]
keywords: [broken-links, maintenance]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Fix the broken delegation link in wrap-up.md:17

## Context

`.claude/skills/orchestration/workflow/wrap-up.md` line 17 contains:

```
4. Constructs the assistant delegation prompt per [delegation prompt requirements](../delegation/SKILL.md#what-every-delegation-prompt-contains).
```

The relative path is wrong. From `.claude/skills/orchestration/workflow/wrap-up.md`, `../delegation/SKILL.md` resolves to `.claude/skills/orchestration/delegation/SKILL.md`, which does not exist. The file is one directory higher, at `.claude/skills/delegation/SKILL.md`, so the link needs `../../delegation/SKILL.md` (one extra `../`). The anchor `#what-every-delegation-prompt-contains` itself is correct — it matches the heading `## What Every Delegation Prompt Contains` (delegation/SKILL.md:69). Only the path depth is wrong.

This was flagged by `check-markdown-links.sh`. It is **pre-existing**, NOT introduced this session: `git blame`/`git log` traces line 17 to commit `9cb50b17` ("refactor(.claude): merge 8 workflow skills into orchestration/workflow sub-docs"), a prior session that moved the workflow docs one level deeper without updating this relative path.

## Why deferred

Out of scope for the git-operation-completeness session (scope contract was the git + wrap-up + preparation git surface, not a general broken-link sweep). Fixing it inline would have been a Principle-5 scope breach.

## When to pick up

No prerequisites. Can run any time — it is a single-line edit. Best folded into a docs-link maintenance pass alongside the broader `backlogs/memory/preexisting-broken-markdown-links.md` (which covers ~12 pre-existing broken links from session 7e00f98e; this entry is the specific wrap-up.md:17 case).

## Suggested approach

Change `../delegation/SKILL.md#what-every-delegation-prompt-contains` to `../../delegation/SKILL.md#what-every-delegation-prompt-contains` on wrap-up.md:17. Re-run the markdown-link checker to confirm zero broken links remain for this file. While there, check the other `workflow/*.md` sub-docs for the same off-by-one `../delegation/` pattern introduced by the same `9cb50b17` move.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-16-3596d7f1-ee88-4055-8e66-a67f977812ad/`
