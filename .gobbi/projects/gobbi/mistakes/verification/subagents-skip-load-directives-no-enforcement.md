---
name: subagents-skip-load-directives-no-enforcement
description: Spawned subagents silently skip required Load-Directives skill reads — no Skill tool maps "load X", and nothing verifies the read happened.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-25
session: 463a1c96-f75c-4a14-80b4-f4d6815679cd
tags: [process, verification]
keywords: [load-directives, skill-loading, delegation, transcript-audit, grep-verify]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
related: [executor-wrote-to-main-tree-not-worktree]
---

# Subagents skip Load-Directives skills, and nothing enforces it

## What happened

A transcript audit of four Execution executors found that two of the four SKIPPED
a required Load-Directives skill. Executor 02 never Read `principles/SKILL.md` (the
behavioral floor); executor 03 never Read `execution/SKILL.md` (its own procedure
skill). The skips correlated with the tasks the executor judged lighter — the exact
Principle-1 failure (skip the foundation when the work looks easy). The output still
looked complete, so the skip was invisible without auditing the transcript.

## User feedback

The user explicitly asked that this be captured as a durable mistake: a subagent
that skips its principles floor produces work that looks done but was built without
the discipline the floor guarantees, and that gap repeats across every future
delegation until the briefing and verification change.

## Why it happens

Two independent causes compound:

1. **No Skill tool for subagents.** A spawned subagent's tools are
   Read/Grep/Glob/Bash/Write/Edit — there is no `Skill` tool. The manager's wording
   "load the `principles` skill" therefore maps to NO concrete action for the
   subagent. The only way it can "load" is to `Read` the SKILL.md file, but the
   instruction never says so.
2. **The Load Directives are an unenforced instruction.** Nothing makes the
   subagent Read the files before acting, and nothing verifies it did. A subagent
   that judges a task simple silently skips the "foundation" reads.

## Correct approach

The delegation-system fix (the one this session shipped):

- **Reword for subagents:** "Read these exact files IN ORDER as your FIRST actions —
  you have no Skill tool; 'load' = Read the file" instead of "load the X skill".
- **Require a `SKILLS LOADED` checklist** in the subagent's report, enumerating each
  path it Read.
- **Manager grep-verifies** the subagent transcript against the required set before
  accepting the task; re-dispatch on a miss.
- Optionally embed the principles floor in each agent's system prompt so it never
  depends on a Read.

## How to detect

Grep the subagent's transcript for each required skill path:

```bash
grep -oE '"file_path":"[^"]*"' <transcript> \
  | grep -E 'principles/SKILL.md|execution/SKILL.md'
```

A required path with zero Read occurrences = the skill was skipped. A report that
lacks the `SKILLS LOADED` checklist is the same signal at accept-time.

## Related

- [[executor-wrote-to-main-tree-not-worktree]] — another unverified-subagent-action trap caught only by a transcript / worktree audit
