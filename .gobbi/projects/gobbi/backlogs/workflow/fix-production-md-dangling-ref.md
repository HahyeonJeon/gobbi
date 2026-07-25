---
name: fix-production-md-dangling-ref
description: Fix the 9 pre-existing broken agents/*.md links (4 production.md targets + 5 broken anchors) that survive the orchestration to workflow rename
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-25
session: 69314d61-5a03-4ad7-9672-64031832463a
tags: [docs-sync, links]
keywords: [broken-links, production-md, agent-docs, dangling-anchor, check-markdown-links]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Fix the 9 broken agent-doc links

## Context

The agent role docs (`agents/*.md`) carry 9 broken markdown links that predate the
orchestration to workflow rename. The rename repointed only the path portion
(`orchestration/workflow/` to `workflow/steps/`); the targets and anchors were already broken, so
repointing preserved the broken state. `scripts/check-markdown-links.sh` reports exactly these 9,
which the rename session's link gates document as the sole permitted baseline.

The 9 broken links, in post-rename form:

- `../skills/workflow/steps/production.md` — from `agents/{assistant,executor,leader,manager}.md` (4x). `production.md` never existed under the skill tree.
- `../skills/workflow/delegation.md#continue-vs-fresh` — from `agents/{assistant,executor,leader}.md` (3x). `delegation.md` has no "Continue vs Fresh" heading.
- `../skills/workflow/delegation.md#the-status-contract` — from `agents/evaluator.md` (1x). The actual heading is `### 12. Status contract`, slug `#12-status-contract`.
- `../skills/workflow/SKILL.md#harness-todo-list` — from `agents/manager.md` (1x). No such anchor exists.

## Why deferred

Fixing these is outside the rename plus redesign scope for this session. The 4 `production.md` refs
need either a created target doc or dropped references; the 5 anchors need the correct anchor slug or
a created section. Both are content decisions distinct from the mechanical rename, so the session
tracked them as a documented link baseline rather than fixing them.

## When to pick up

No hard prerequisite. Natural trigger: the next time the agent role docs, `workflow/delegation.md`,
or `workflow/SKILL.md` are edited for another reason. Handle it before any change that requires a
clean full-tree `check-markdown-links.sh` with zero broken links.

## Suggested approach

For each of the 9: either create the missing target/section, repoint the link to the correct
existing anchor (e.g. `#12-status-contract`), or drop the reference where the doc no longer needs it.
Decide the `production.md` question first — whether a production step doc is intended to exist — since
it drives 4 of the 9. Then re-run `scripts/check-markdown-links.sh` over `skills` + `agents` and
confirm zero broken links.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-24-69314d61-5a03-4ad7-9672-64031832463a/`

## Related

- [[rename-point-dont-restate-rule-file]] — a sibling documentation-cleanup deferral surfaced by the same rename session
