---
name: workflow-compaction-doc-broken-links
description: 23 broken relative links in the workflow-compaction-two-doc-kind design doc, pre-existing from PR #339, need a repair pass.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-13
session: 2026-07-13-0bbb7c63-919c-45c2-81ea-b86406c8b75b
tags: [docs-sync, links]
keywords: [broken-links, relative-paths, pr-339, design-doc]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Repair broken relative links in workflow-compaction-two-doc-kind.md

## Context

`features/workflow/design/workflow/workflow-compaction-two-doc-kind.md` was promoted from
PR #339 (the review Point 2 two-doc-kind model). Its body carries relative markdown links
written for a different source location (patterns like `../../record/SKILL.md`,
`production.md`, `evaluation.md`) that no longer resolve from the file's promoted memory
path (`features/workflow/design/workflow/`).

This session (2026-07-13, startup-skill build) surfaced the breakage while auditing the
memory tree, but the broken links are pre-existing from PR #339 and out of this session's
scope to fix.

## Why deferred

Out of scope for the startup-skill session — fixing the links is a self-contained doc-repair
task unrelated to the startup/interview work this session shipped. Verified count via
`check-markdown-links.sh` scoped to the file: **23 broken link(s) across 25 checked**
(not the ~32 first estimated at hand-off time — the verified number is 23).

## When to pick up

No prerequisites — can run any time. A future session (or the next doc-consistency sweep)
can pick this up standalone.

## Suggested approach

Re-run `skills/orchestration/scripts/check-markdown-links.sh` scoped to the file to get the
current broken-link list, then for each `BROKEN:` line either (a) rewrite the relative path
to resolve from the file's actual directory (`features/workflow/design/workflow/`), or (b)
if the link target no longer exists at any path, replace it with a `[[slug]]` wikilink to
the memory-tier equivalent or drop it if genuinely stale. Re-run the guard to zero broken
links for this file afterward.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-13-0bbb7c63-919c-45c2-81ea-b86406c8b75b/`

## Related

- [[workflow-compaction-two-doc-kind]] — the design doc carrying the broken links
