---
name: codex-exec-prompt-via-background-heredoc-hangs
description: A heredoc that writes a codex prompt file inside the SAME backgrounded Bash command that runs codex never writes the file, so codex gets an empty prompt and hangs reading stdin until timeout.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-19
session: 8bdd12ad-9d28-4293-a38f-881db184c465
tags: [process, codex, evaluation]
keywords: [codex-exec, heredoc, run-in-background, stdin-hang, prompt-file, dual-system]
author: claude
priority: high
domain: codex
supersedes: null
superseded_by: null
related: [codex-side-assistant-faked-eval-on-codex-timeout, codex-wrapper-file-persistence-failure]
---

# Codex-exec prompt via a backgrounded heredoc hangs on empty stdin

## What happened

A dual-system Execution evaluation ran `codex exec` through ONE
`Bash(run_in_background: true)` command that used an inline heredoc to write the
prompt file and then invoked codex against it — both steps in the same backgrounded
command. The heredoc body was mis-evaluated under the background + harness shell
wrapping: its content lines were eval'd as shell commands instead of being written to
the file, so the prompt file was never created. `codex exec` then started with no
prompt argument, fell back to reading the prompt from stdin, and hung on
`Reading additional input from stdin...` until the task timed out — producing no
evaluation.

## Why it happens

Two compounding causes:

1. **Heredoc + background + harness wrapping is unsafe.** A heredoc combined with
   `run_in_background: true` and the harness's own shell wrapping breaks heredoc
   handling — the lines between the delimiters are re-evaluated as commands rather
   than captured as file content, so the redirect that should write the prompt file
   never lands. The prompt file silently does not exist.
2. **`codex exec` falls back to stdin.** With no prompt argument, `codex exec` reads
   the prompt from stdin and blocks waiting for it. In a backgrounded, non-interactive
   context there is no stdin to deliver, so it hangs to the timeout boundary.

## Correct approach

- Write the codex prompt to a file in a **separate foreground** `Bash` step, then
  verify the file exists (`test -s <file>` / read it back) BEFORE invoking codex.
- Only after the prompt file is confirmed on disk, invoke codex — foreground, or
  backgrounded referencing the pre-written file (e.g. pass `"$(cat <file>)"` or the
  path the codex CLI expects). NEVER embed a heredoc in the same backgrounded command
  that runs codex.
- On any codex hang or timeout, report `STATUS: BLOCKED` with the exact failure.
  Never fabricate the evaluation to cover for a hang — an empty-prompt codex run
  produced no real cross-system pass.

## How to detect

A backgrounded codex task whose output shows `(eval):N: no such file` (the heredoc
body re-run as commands) or `Reading additional input from stdin...` (codex blocking
on an undelivered prompt). Either line means the prompt file was never written and
codex received nothing — the run is empty, not slow.

## Related

- [[codex-side-assistant-faked-eval-on-codex-timeout]] — the trap of fabricating a
  codex eval after codex produced no output; this trap is one cause of that no-output
  state.
- [[codex-wrapper-file-persistence-failure]] — a sibling codex-exec reliability trap
  (codex produced output but the file write was lost).
