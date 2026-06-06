---
name: codex-exec-background-stdin-and-sandbox-pitfalls
description: "`codex exec` backgrounded with an open stdin hangs forever on 'Reading additional input from stdin...'; and `--sandbox read-only` silently blocks a prompt that tells codex to WRITE a file. Run foreground with `< /dev/null` + `timeout 600`, and capture stdout instead of having codex write under read-only."
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-05
session: ca2231b3-9567-4cf9-b0d6-f9bd3e2e78ee
tags: [codex, tooling, evaluation, hang]
domain: tooling
supersedes: null
superseded_by: null
---

# `codex exec` backgrounded with open stdin hangs; `--sandbox read-only` blocks write-prompt

## What happened

A dual-system Codex evaluator was launched via manager-direct `Bash(run_in_background:true)` running `codex exec --sandbox read-only ... | tail`. It hung — `run.log` showed only `Reading additional input from stdin...`. Two compounding bugs:

1. Backgrounded codex kept stdin open and blocked waiting for EOF.
2. The `--sandbox read-only` mode would have blocked the prompt's instruction to write `overall.md` to disk even if the stdin hang had not occurred first.

Neither failure is visible at launch time. The hang produces no error; the sandbox write-block produces no error at the time of the write instruction — both fail silently.

## Why it happens

`codex exec` reads stdin even when given a prompt argument; with no EOF (open pipe in background) it blocks indefinitely. The read-only sandbox restricts codex from writing any files, but the prompt may ask codex to write its output — that instruction is silently ignored. Running in background hides both the stdin wait and any sandbox-write-block feedback.

The codex skill already warns against manager-direct-background-then-idle (lazy notifications); the stdin-EOF cause and the read-only-blocks-write trap are the additional concrete failure modes documented here.

## Correct approach

Run codex FOREGROUND with:

```
timeout 600 codex exec --sandbox read-only --cd <root> "<prompt>" < /dev/null > out.md 2>&1
```

Key points:
- `< /dev/null`: closes stdin immediately so codex cannot block waiting for input.
- `> out.md 2>&1`: captures stdout to the file rather than instructing codex to write it under read-only.
- `timeout 600`: bounds a hung invocation.
- Foreground: the caller sees the output and can detect hangs.

Alternatively, use the assistant-wrapper pattern (codex skill §2d) for parallel dual-system evaluation.

Always verify by file existence + VERDICT grep after codex returns — do not trust exit code alone.

## How to detect

Symptoms: codex exits but produces no output files; `run.log` or stdout contains `Reading additional input from stdin...` as the last or only line; no codex child process remains. Any time `codex exec` is launched in background via `Bash(run_in_background:true)` and the contracted output directory is empty, suspect both the stdin-open hang and the sandbox-write-block before investigating further.
