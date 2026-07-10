---
name: verifies-must-be-self-failing
description: A plan's verifies gate must exit non-zero on failure — a bare grep-piped-to-wc-l, a printed exit=$?, or "executor confirms" all return success regardless of the checked condition
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-08
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [verification, process]
keywords: [verifies-gate, self-failing, exit-code, false-pass, USAGE-01]
author: claude
priority: high
domain: verification
supersedes: null
superseded_by: null
related: [execution-bundle-source-before-trim, dual-system-plan-integration]
---

# Every plan `verifies:` gate must exit non-zero on failure

## What happened

Planning iter1's canonical plan (`draft-iter1.md`) wrote several `verifies:` lines that LOOKED like checks but could never fail the shell command: `grep ... | wc -l` (the pipeline's exit code is `wc -l`'s, which is 0 whenever `wc` itself ran, regardless of the count printed), `echo exit=$?` (prints the prior command's exit code as text, but the `echo` itself exits 0), and prose like "executor confirms ==" (a human-eyeball instruction, not a runnable gate). Codex's independent Planning evaluation caught this as a High-severity finding (`COD-PLAN-USAGE-01`) — one of the plan's core coverage gates (a per-perspective scenario-count check, an adversarial-count-equality check) used exactly this false-pass shape.

## Why it happens

Writing a verifies line that visibly SHOWS the check's result — a printed count, a printed `exit=$?` value, a comment saying what the executor should confirm — feels like verification, because a human reading the output can eyeball whether the number looks right. But an automated gate (CI, a downstream re-run, a future agent replaying the plan) only checks the shell command's own exit code, not the printed text. Printing a fact and gating on a fact are different mechanisms, and only the second one can fail the task.

## Correct approach

Every `verifies:` line must end in a construct that exits non-zero on failure: `command || exit 1`, `if <condition>; then echo "<reason>"; exit 1; fi`, `[ "$(command)" -eq N ] || exit 1`, or `diff a b || exit 1`. A count check compares the actual value against the expected value explicitly inside a test — never just prints the count and calls it done. This makes every gate mechanically re-runnable: a future agent can execute the exact `verifies:` block and trust that a non-zero exit means the property genuinely failed.

## How to detect

Scan every `verifies:` line for: a bare `| wc -l` with no subsequent numeric comparison; a bare `echo exit=$?` or `echo $?` with no consuming `||` or `if`; any prose phrase like "executor confirms", "should show", "visually check" with no runnable command attached. Any of these three patterns can print an apparent failure while the shell block still exits 0, so a plan that "runs the verifies and reports PASS" can be lying.

## Related

- [[execution-bundle-source-before-trim]] — the sibling defect from the same Planning iter1 evaluation round
- [[dual-system-plan-integration]] — the integration log this defect was caught against
