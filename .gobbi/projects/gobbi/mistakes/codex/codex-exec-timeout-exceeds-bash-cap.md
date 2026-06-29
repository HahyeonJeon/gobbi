---
name: codex-exec-timeout-exceeds-bash-cap
description: codex skill documents codex exec timeout 1200 but the Claude Code Bash tool kills any foreground call past ~10 min
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: [codex, process]
keywords: [codex-exec, timeout-1200, bash-10-min-cap, foreground, background-restart, harness-mismatch]
author: claude
priority: high
domain: codex
supersedes: null
superseded_by: null
---

# codex exec timeout (1200s) exceeds the Claude Code Bash ~10-minute cap

## What happened
During an Ideation WORK dual-system step, the Codex proposer was launched as a foreground
`codex exec` per `codex/SKILL.md` § Dual-System Production, which specifies `timeout 1200` (20
minutes). The Claude Code Bash tool has a hard cap near 10 minutes per call, which KILLED the
foreground `codex exec` before it finished. The proposer only succeeded after being restarted as
a BACKGROUND command. The documented invocation pattern assumes a runtime budget (20 min) the
host harness does not grant to a single foreground Bash call (~10 min).

## Why it happens
`codex/SKILL.md` was written assuming `timeout 1200` is the binding limit, but in Claude Code the
Bash tool's own wall-clock cap is the tighter constraint and it is invisible to the skill doc. A
`timeout 1200` in a foreground Bash call is dead code past ~10 min — the harness terminates the
call first. This is a codex-skill ↔ host-harness mismatch: the skill's documented budget
contradicts the runtime's actual budget, and nothing in the doc tells the operator to background
long codex runs.

## Correct approach
Long `codex exec` runs (anything that can exceed ~10 min) MUST be launched as BACKGROUND commands
in Claude Code, not foreground — the Bash ~10-min cap, not `timeout 1200`, is the binding limit.
`codex/SKILL.md` § Dual-System Production should state the per-runtime cap explicitly: in Claude
Code, background any codex run that may exceed the Bash cap; `timeout 1200` only governs
Codex-native/CLI contexts where the host grants the budget. The adversarial-review charter's
plugin/codex area should add a check that every documented runtime budget is reconciled against
the host harness's actual per-call cap.

## How to detect
Any documented `codex exec` (or other long subprocess) invocation that states a `timeout` /
runtime budget greater than ~10 minutes AND is described as a foreground call in Claude Code.
Trigger signal: a foreground `codex exec` that returns no output and exits around the 10-minute
mark, then succeeds when re-run in the background. Grep `codex/SKILL.md` and any wrapper for
`timeout 1200` / `timeout [6-9][0-9][0-9]` paired with a foreground launch.

## Related

- [[research-ideation-reference-staging-conflict]] — a sibling skill↔harness / between-skill mismatch surfaced by dogfooding the same session
