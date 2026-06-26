---
name: background-codex-exec-must-redirect-stdin-from-devnull
description: A backgrounded `codex exec` inherits an open stdin and blocks forever reading it — always redirect stdin from /dev/null.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-25
session: 6cf13813-a002-4e55-96b9-a5d65f619ef8
tags: [codex, process]
keywords: [codex-exec, stdin, dev-null, background-hang, files-as-truth, proposer-wrapper]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
---

# A backgrounded `codex exec` must redirect stdin from /dev/null or it hangs reading stdin

## What happened

A `codex exec --cd … --sandbox workspace-write "@prompt-file"` launched in a background shell HUNG — its log showed `Reading additional input from stdin...` and the process sat alive until killed. The prompt was correctly passed via `@file`, but codex ALSO read stdin (it appends stdin to the prompt when stdin is not a TTY), and the background shell's stdin was an open fd, so codex blocked forever waiting for EOF. This burned ~minutes of a 20-minute timeout window before it was caught (no output files appeared — caught by the files-as-truth check, not by trusting the process).

## Why it happens

`codex exec` reads stdin as additional prompt input when stdin is a non-TTY pipe. In an interactive/foreground or separately-written-prompt launch, stdin happens to be `/dev/null`-like and EOFs immediately; but when the heredoc that writes the prompt and the `codex exec` run in the SAME backgrounded shell, the shell's stdin is left open and codex blocks on it. This is a sibling of `codex-exec-prompt-via-background-heredoc-hangs`: same hang, different trigger (stdin inheritance, not a stdin-heredoc).

## Correct approach

ALWAYS redirect stdin from `/dev/null` on a backgrounded `codex exec`: `timeout 1200 codex exec --cd <root> --sandbox <mode> "@<prompt-file>" < /dev/null > <log> 2>&1`. Write the prompt file in a SEPARATE foreground step (write+verify), then launch codex reading only `@file` with stdin closed. Kill a hung run by EXPLICIT PID (never `pkill -f codex` — it matches your own shell, per `pkill-f-pattern-matches-own-shell`). The `codex/SKILL.md` § Dual-System Production proposer `codex exec` block added this session shows `< /dev/null` on the backgrounded invocation — a concrete hardening of the proposer wrapper the feature ships.

## How to detect

A backgrounded `codex exec` that produces no output and whose log's last line is `Reading additional input from stdin...`. The process is alive (`pgrep`), not crashed.

## Related

- [[codex-exec-prompt-via-background-heredoc-hangs]] — the sibling hang with a different trigger (stdin-heredoc, not stdin inheritance)
