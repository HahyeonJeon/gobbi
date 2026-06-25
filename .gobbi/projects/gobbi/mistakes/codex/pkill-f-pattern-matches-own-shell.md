---
name: pkill-f-pattern-matches-own-shell
description: pkill -f matches the full command line of every process including the shell issuing pkill, so a pattern that is a substring of the pkill invocation kills its own shell.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-19
session: 8bdd12ad-9d28-4293-a38f-881db184c465
tags: [process, codex]
keywords: [pkill, shell, self-match, signal-exit-144, process-kill]
author: claude
priority: medium
domain: process
supersedes: null
superseded_by: null
related: [codex-exec-prompt-via-background-heredoc-hangs]
---

# pkill -f matches its own shell and kills the script

## What happened

To clean up a hung codex run, the session issued `pkill -f 'codex exec'`. The command
killed its own shell (exit 144), because the literal pattern string `codex exec`
appears in the `pkill` command's own command line. `pkill -f` matched the `pkill`
process itself (whose argv contains the pattern) and signalled the shell that issued
it, so the cleanup step terminated mid-run instead of killing only the target.

## Why it happens

`pkill -f` matches against the **full command line** of every running process — not
just the process name. The shell running `pkill -f '<pattern>'` has `<pattern>` in its
own argv, so when `<pattern>` is a substring of the invocation, `pkill` matches and
kills itself (and its parent shell). The match is correct behavior; the pattern was
just not self-exclusive.

## Correct approach

- Prefer killing by **explicit PID**: `ps -ef | grep <pattern>` (or capture the PID
  when the process is launched), then `kill <pid>` the specific target.
- If using `pkill -f`, choose a pattern that **cannot match the pkill invocation**
  itself — e.g. match a unique argument only the target carries, not the literal
  command name that also appears in the `pkill` line — or exclude self with the
  process's own PID.
- Treat any `pkill -f` whose pattern is a substring of the issuing command as a
  self-kill hazard.

## How to detect

A `pkill -f '<pattern>'` where `<pattern>` is a substring of the very command issuing
it (most obviously when the pattern is the target's command name). The symptom: the
script dies mid-run with a signal exit code (e.g. 143/144 = terminated by signal)
right at the cleanup step, before the next command runs.

## Related

- [[codex-exec-prompt-via-background-heredoc-hangs]] — the hung-codex trap whose
  cleanup attempt triggered this self-kill.
