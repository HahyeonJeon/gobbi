---
name: verify-state-from-authoritative-source-not-proxy
description: A claim about a codebase artifact's state must be verified by the authoritative source, not inferred from a proxy
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-08
session: 422308da-f2c4-41a4-8ee3-adc89acde977
tags: [verification, process, git]
keywords: [authoritative-source, proxy-inference, citation-fidelity, anchor-fidelity, upstream-correction]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Verify state from the authoritative source, not a proxy

## What happened

Two distinct instances of the same root failure:

**Instance 1 (git position).** A preparation leader stated a worktree was "clean / current" based on the harness system-reminder (which described the main tree's git status). The true state was that the worktree sat 1 commit behind `origin/develop`. The claim was inverted because the leader inferred the worktree's position from a proxy (the system-reminder) instead of running `git rev-list --left-right --count HEAD...origin/develop` inside the worktree.

**Instance 2 (line anchor).** A planning leader cited a stale line number (`SKILL.md:247`) in five places across a plan, even though the prior loop's readiness report had corrected the anchor to line 266. The leader copied the stale reference from the pre-verification idea artifact instead of reading the upstream-corrected value.

## Why it happens

Agents infer facts about codebase artifacts from available context (system-reminder text, prior artifacts, session memory) rather than re-reading the authoritative source. The inference feels correct because the context is present and plausible. The authoritative source often says something different — usually when the world has changed (a new commit, a readiness-report correction, a rebase).

## Correct approach

For any claim about a codebase artifact's current state, run the authoritative command or read the upstream-corrected value:

| Claim type | Authoritative source |
|---|---|
| Worktree git position (ahead/behind a base) | `git rev-list --left-right --count HEAD...origin/develop` run inside the worktree |
| File line number / anchor | re-read the readiness report's verified-anchors table, not the idea's approximate citations |
| File type (symlink vs real) | `ls -l <path>` or `test -L <path>` |
| Line content / section header | `grep -n "pattern" <file>` against the live file |
| File existence | `find . -name <filename>` from the repo root |

Never substitute system-reminder text, session-memory inferences, prior-loop artifacts, or "I know this is true." An upstream correction (a readiness report, an evaluation finding, a manager correction) is authoritative over ALL earlier-iteration artifacts that carried the stale reference.

## How to detect

- The agent states a fact about a codebase artifact without citing live command output.
- A plan or brief carries a line number the agent did not verify against the current readiness report.
- The agent says a worktree is "current" or "clean" without citing `git rev-list` output.
- Both evaluators independently flag the same stale value in iter 1 — a mechanical, not subtle, failure.
