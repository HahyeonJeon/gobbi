---
name: delegation-briefs-reference-nonexistent-rules-dir
description: Delegation Load Directives cite .gobbi/projects/gobbi/rules/ which does not exist; the real rules live in skills/memory/rules.md
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-24
session: 1cd48095-d745-4868-a5ac-f48326eb447f
tags: [process]
keywords: [delegation, load-directives, rules-dir, nonexistent-path, briefing]
author: claude
priority: medium
domain: process
supersedes: null
superseded_by: null
related: [readiness-scan-must-disposition-out-of-worktree-writes]
---

# Delegation Briefs Must Not Reference a Nonexistent Rules Directory

## What happened

The manager's delegation prompts for the Preparation evaluation agents included a Load Directives block that said "all files under `.gobbi/projects/gobbi/rules/`." Both the iter1 and iter2 evaluators (Claude and Codex) flagged this: the directory `.gobbi/projects/gobbi/rules/` does not exist in this project. The Codex iter2 overall file noted it explicitly — "`.gobbi/projects/gobbi/rules/` is absent, so no project rules were loaded." The actual project rules are in `skills/memory/rules.md` (the memory standard) plus any in-skill rule sections. The `rules/` memory type directory has not been created for this project yet. Agents that follow the directive find nothing, load nothing, and proceed without project rules — and the brief surfaces no error, because a missing directory produces no output rather than an explicit failure.

## Why it happens

The Load Directives template likely originated from a project that had a populated `rules/` directory, or from a future-state expectation that `rules/` would be created. It was carried forward without verifying whether the path exists for this project. The error is silent: agents get a "no files" result and continue.

## Correct approach

Before issuing a delegation brief that references a rules or memory directory, confirm the path exists: `ls .gobbi/projects/{project-name}/rules/` (or `find`). If the directory does not exist, either:
- Remove the directive entirely, or
- Replace it with the actual rule source — for this project, `skills/memory/rules.md` is the canonical rules-bearing file. The template line should be: "Load `skills/memory/rules.md` (frontmatter/structure standard for staged files)" rather than "all files under `rules/`."

Do not keep a nonexistent-path Load Directive in a brief just because the template included it.

## How to detect

The situation has two signals:
1. A Load Directives block references a path with a glob like "all files under `.gobbi/projects/{project-name}/rules/`".
2. That directory does not exist on disk (verify with `ls` or `find`).

If both are true, the brief is sending agents to read from a nonexistent source. The agents load nothing from that directive — they do not error out.

## Related

- [[readiness-scan-must-disposition-out-of-worktree-writes]] — sibling Preparation-loop trap from the same loop
