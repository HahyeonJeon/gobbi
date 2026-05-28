---
name: codex-wrapper-relative-path-wrong-session-write
description: Codex wrapper used relative ellipsis paths in the prompt; Codex resolved them against the wrong session directory and produced a false PASS.
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [process, codex, evaluation, session-lifecycle]
domain: process
supersedes: null
superseded_by: null
---

# Codex wrapper used relative paths — wrote to wrong session directory

## What happened

Codex assistant-wrapper for Planning iter2 evaluation was composed with relative ellipsis paths (e.g., `sessions/.../planning/...`) rather than absolute paths. Codex's sandbox CWD resolved these paths against a different session directory from yesterday's session (`2026-05-23-7ea62d36-...`). The wrapper wrote nothing to the correct current-session directory but validated against stale files from that prior session and reported PASS — a false PASS against wrong files.

## Why it happens

The wrapper assumed Codex would inherit the parent session's working context (specifically the session ID and the base path). It omitted absolute path discipline in the prompt. Relative paths in Codex invocations are CWD-resolved, and CWD is the Codex sandbox root, not the gobbi session directory. This created a silent path mismatch with no error output, producing a confident but wrong PASS.

## Correct approach

1. Every path passed to Codex MUST be absolute. Never use relative paths, never use `...` ellipsis shorthand in path arguments.
2. Wrapper writes a `.wrapper-marker` file with the current timestamp AND current session ID to the correct target directory BEFORE Codex invocation. Instructions to Codex: verify `.wrapper-marker` exists and write `.codex-marker` alongside it as the first action — this proves Codex is operating in the right directory.
3. Wrapper validate-step after Codex completion: list the absolute target directory; grep for current-iter draft reference in the output files; verify `.codex-marker` exists at the absolute path. If any check fails, the wrapper treats the run as void and re-dispatches.
4. Pattern proven in the retry that produced the correct Planning iter2 PASS: absolute paths + marker verification + validate-step.

## How to detect

- Codex output files are timestamped before the current session's start time.
- Codex evaluation findings reference content from a different session (e.g., mentioning features or decisions from yesterday's session that are not in the current iter's draft).
- Codex per-perspective files appear in the wrong session directory path (prior session ID in the path).
- Codex reports PASS on a plan that has known High findings which were not resolved.
- The `.codex-marker` file (written as a first action) is absent in the expected current-session directory but present in a prior-session directory.

## Related

- Session `2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac` Planning iter2
- The stale-session PASS was detected because Claude evaluator independently verified Codex's claimed empirical checks and found them to reference prior-session artifacts
