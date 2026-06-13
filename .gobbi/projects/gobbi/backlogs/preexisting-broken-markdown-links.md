---
name: preexisting-broken-markdown-links
description: Approximately 12 pre-existing broken markdown links in the project tree surfaced by check-markdown-links.sh; not defects introduced by the vocabulary-rename session
type: backlogs
scope: project
feature: null
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [docs-sync, broken-links, maintenance]
priority: low
disposition: open
project-scope: true
shipped_in: null
---

# Pre-existing broken markdown links

## Context

The `check-markdown-links.sh` guard added in session `7e00f98e` (commit `1c1c0362`) scans all markdown files in the project tree and reports links that do not resolve to an existing file. When run against the pre-session baseline (before any vocabulary-rename changes), it surfaced approximately 12 broken links that existed before this session began.

These broken links are NOT defects introduced by the vocabulary-rename redesign; they are pre-existing drift. The session's post-split gates confirmed zero NEW broken links were introduced (all nets from the baseline were fixed), but did not fix the pre-existing ones because they were out of scope (D12 scope lock).

## Why deferred

The session `7e00f98e` scope contract (D12) was limited to the workflow feature vocabulary rename. Fixing pre-existing broken links across other files would have violated the 21-EXCLUDE list and expanded scope beyond the user-ratified contract.

## When to pick up

After the session `7e00f98e` PR merges to develop. Run `check-markdown-links.sh` against the merged state to get the current broken-link list (the exact set may shift as other sessions land). No other prerequisites.

## Suggested approach

Run `skills/orchestration/scripts/check-markdown-links.sh` from the project root to get the full list of currently broken links. Group them by directory. Fix by updating link targets to the correct paths — most are expected to be stale relative paths from file moves in earlier sessions. Run the guard again to confirm zero broken links remain.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-12-7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4/`
