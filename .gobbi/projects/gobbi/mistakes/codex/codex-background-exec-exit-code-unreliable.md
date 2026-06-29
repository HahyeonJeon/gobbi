---
name: codex-background-exec-exit-code-unreliable
description: "A backgrounded `codex exec` reports an unreliable bash exit code even on success — validate the output file, not the code."
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-29
session: 0305008a-4073-428a-8094-fbb6d0808dea
tags: [codex, verification]
keywords: [background-exec, exit-code, dual-system, proposer, reviewer]
author: claude
priority: high
domain: codex
---

# Background `codex exec` exit code is unreliable — validate the output file, not the code

## What happened

In dual-system passes, the manager launches `codex exec ... -o <outfile>` as a backgrounded job
(the Codex reviewer / proposer). When the process detaches, the wrapping bash reports an exit code
of `-1` ("exit code unknown") **even when the codex run completed successfully and wrote a full,
valid output file**. Treating that exit code as the success signal would either falsely mark a good
run BLOCKED, or — if the code were trusted in the other direction — falsely mark an empty run DONE.

## Why it happens

A backgrounded / detached process does not deliver its real exit status back to the launching shell
the way a foreground command does. The shell sees the detach, not the child's completion, so it
surfaces `-1` / "unknown" regardless of the actual outcome. The exit code is therefore orthogonal to
whether codex produced usable output — it carries no signal about success.

## Correct approach

Validate the `-o` **output file**, never the exit code, before treating a background codex run as
DONE:
1. `test -s <outfile>` — the file exists and is non-empty.
2. Confirm a content/finding marker is present (e.g. a findings header, the expected ID prefix,
   or a closing summary line) — proving the run wrote real content, not a truncated stub.
Only report BLOCKED when the file is **missing, empty, or malformed**. A non-zero / `-1` exit code
on a file that passes both checks is expected and ignorable.

## How to detect

You are about to hit this trap when: a background `codex exec` returns exit code `-1` or "exit code
unknown"; you are tempted to branch DONE/BLOCKED on `$?` from a detached job; or the run "looks
failed" by exit code but `<outfile>` is sized and well-formed. Any of these means: stop reading the
exit code and read the file instead.

## Related

- [[codex-exec-timeout-exceeds-bash-cap]] — a related background-codex timing trap
- [[codex-proposer-must-be-source-read-only]] — a related dual-system codex discipline
