---
name: plan-verification-as-contract-not-must-pass-now-shell
description: Plan verification gates written as must-pass-now shell over files with pre-existing breakage can never pass — specify a contract + method instead.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-25
session: 6cf13813-a002-4e55-96b9-a5d65f619ef8
tags: [verification, process]
keywords: [verification-gate, baseline-diff, set-e-negation, whole-file-linter, plan-contract]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Plan verification gates must be a contract + method, not must-pass-now shell

## What happened

A Planning task plan wrote each task's `verifies:` gate as runnable shell intended to exit 0 *as written in the plan*. Two failures followed, surviving two REVISE iterations: (1) the gates ran a whole-file `check-markdown-links.sh` over target files that carry **pre-existing, out-of-scope broken links** (e.g. `.claude/CLAUDE.md → skills/claude/SKILL.md`, workflow docs → stale `../delegation/...`), so the gate exits 1 regardless of whether the edit is correct — it can NEVER pass; (2) shell-mechanic bugs — a `! grep …` drift check is inert under `set -e` (the negation's exit is ignored), and the cross-file contract block was unreachable (chained after a failing link check). The leader tried to fix it by patching the shell twice; both REVISEs failed.

## Why it happens

An altitude error: the plan treated verification as must-exit-0-NOW shell, before the edits exist and against files with pre-existing breakage the feature will not fix. A plan cannot carry a passing run of a gate whose subject content does not exist yet, and a whole-file guard conflates "did my edit succeed" with "is the entire pre-existing file clean."

## Correct approach

Specify verification as a **CONTRACT + METHOD the executor runs at its Verify phase** against the real edited files, not must-pass-now shell:

- **(A) Content assertions** — `grep -q '<exact string the edit adds>' <abs-path>` proves the edit landed.
- **(B) Baseline-diff for linters/guards on files with pre-existing issues** — capture the guard's failing-line baseline BEFORE editing; after editing assert `comm -13 before after` is empty (NO NEW failures vs baseline). Never "absolute zero failures" when the file has out-of-scope pre-existing breakage.
- **(C) Standalone, correctly-failing contract gates** — run independently (never chained after a gate that can fail on out-of-scope conditions); use `if grep -rIlE '<drift>' <files>; then exit 1; fi` (has teeth), not `! grep` under `set -e`; scope drift patterns (e.g. path-prefix) to avoid matching pre-existing prose.

The plan states WHAT must be true + the METHOD; the executor runs the actual commands at Verify against real files and pastes real exit codes — the self-review never claims a green run it did not perform.

## How to detect

(a) A `verifies:` gate that runs a whole-file linter/guard over a file you did not fully author (pre-existing issues will block it). (b) `! grep …` used as a failing assertion under `set -e` (it never fails). (c) A gate chained after another that can fail on out-of-scope conditions (unreachable). (d) **Two REVISEs on the same verification axis** — the `guard-revises-twice-means-scope-model-wrong` signal: stop patching, fix the model.

## Related

- [[guard-revises-twice-means-scope-model-wrong]] — the two-REVISE-on-one-axis signal that the model, not the shell, is wrong
- [[verification-gate-must-be-runnable-not-placeholder]] — the complementary trap (a gate that is a placeholder, not runnable)
