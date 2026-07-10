---
name: exit-in-command-substitution-fails-open
description: A shell `exit N` inside `$(...)` only exits the subshell — a fail-closed guard built this way silently fails OPEN
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-08
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [verification]
keywords: [command-substitution, subshell-exit, fail-open, set-euo-pipefail, empty-inventory]
author: claude
priority: high
domain: verification
supersedes: null
superseded_by: null
related: [hardcoded-baseline-guard-is-an-edit-target-of-the-structure-it-guards, guard-cited-as-runtozero-without-matching-vocab]
---

# A shell `exit` inside a command substitution only exits the subshell, and can leave a fail-closed guard failing OPEN

## What happened

`check-eval-childdocs.sh` resolved the project dir with `PROJ="$(resolve_proj)"`, where `resolve_proj` calls `exit 2` on failure. `exit` inside a command substitution `$(...)` exits ONLY the subshell, not the script. With no `set -e` and no check of the substitution's exit status, main continued with `PROJ=""`, `find "/skills"` returned zero files, and both `--classify-only` and `--enforce-inclusion` printed **PASS with exit 0 on an EMPTY inventory**. The dual-system Claude evaluator caught it by running the guard from a non-git dir and with `--root /nonexistent`; the Codex evaluator missed it (it only exercised the happy path).

## Why it happens

The author assumed `exit N` inside `resolve_proj` would terminate the whole script. In bash, a function called inside `$(...)` runs in a subshell, so its `exit` only ends that subshell; the parent keeps going with an empty capture. A guard designed to be fail-CLOSED thereby fails OPEN — the most dangerous outcome, because its output (here, the certified Family-9 inventory) is load-bearing for a downstream consumer that would then act on an empty set.

## Correct approach

Propagate the failure to the top level: either resolve WITHOUT a subshell, or capture and check the status (`PROJ="$(resolve_proj)" || exit 2`), and add a fail-closed empty-result guard (an empty inventory is itself an ERROR, never a PASS, when the real tree is known non-empty). Add regression tests for the failure path (bad root → exit 2; non-git CWD → exit 2). Prefer `set -euo pipefail` in new bash guards. General rule: a fail-closed guard must be TESTED on its failure path, or it may be silently fail-open.

## How to detect

A guard/validator captures a critical value via `VALUE="$(resolver_that_can_exit)"`. The resolver signals failure with `exit`/`return` but the caller never checks `$?` and there is no `set -euo pipefail`. Ask: "if resolution fails, does the script HARD-STOP, or continue with an empty/default value?" Test the failure path explicitly (bad `--root`, run from an unexpected CWD), not just the happy path.

## Related

- [[hardcoded-baseline-guard-is-an-edit-target-of-the-structure-it-guards]] — sibling guard-correctness trap
- [[guard-cited-as-runtozero-without-matching-vocab]] — another guard fail-open family
</content>
