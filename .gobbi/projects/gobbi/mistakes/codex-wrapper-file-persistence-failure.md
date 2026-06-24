---
name: codex-wrapper-file-persistence-failure
description: The codex-wrapper assistant pattern fails to persist evaluation files because it backgrounds codex exec instead of blocking foreground
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [process, codex, evaluation, assistant-wrapper]
priority: high
domain: process
---

# Codex-wrapper assistant pattern fails to persist evaluation files

## What happened

During the planning loop, the codex evaluator ran successfully twice (iter1 and iter2) but failed to persist its 8 per-perspective evaluation files both times. The manager-proxy reconstruction had to be used from codex stdout. The root cause: the sonnet assistant wrapper delegated to run `codex exec` used a Bash call that did not block foreground, so the codex process was killed when the assistant's turn ended.

## Why it happens

The assistant-wrapper pattern (`codex/SKILL.md § Use cases (a)`) delegates codex exec to a sonnet assistant via Bash. When the assistant's turn ends, any still-running subprocesses (including the codex exec) are killed. The wrapper must either: (a) call `codex exec` in a way that blocks the entire turn until completion, or (b) verify that output files exist after the call before returning. Neither guard was in place.

## Correct approach

For gobbi codex evaluations that must write files, the manager runs `codex exec` directly via Bash foreground (not via a delegated assistant wrapper). The manager verifies the 8 per-perspective files exist after the exec completes before proceeding. If files are absent despite a codex FAIL/REVISE verdict in stdout, the manager writes the proxy-reconstruction `overall.md` immediately and stages this as a process error.

## How to detect

- Codex evaluation runs but per-perspective files are absent from `evaluation/iter{n}/codex/`
- Codex stdout ends with a verdict but shows a "zsh quoting error" or cuts off mid-command
- The assistant wrapper returns a "still running" or similar message without confirming file output

## Layer-2 candidate

This mistake generalizes beyond the gobbi project: any workflow that uses the assistant-wrapper pattern to run a file-persisting codex eval is vulnerable to the same foreground-kill issue. Applicable to all gobbi projects using the codex evaluation workflow.

## Related

- `3-planning/evaluation/iter1/codex/overall.md` — proxy reconstruction from stdout (iter1)
- `3-planning/evaluation/iter2/codex/overall.md` — proxy reconstruction from stdout (iter2)
- `3-planning/working/discussion-log.md` § "Process mistake-candidate #2"
