---
name: whole-file-allowlist-false-passes-same-file-residual
description: A guard allowlist keyed by file (not line) false-passes a new residual added inside an allowlisted file
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-24
session: 1cd48095-d745-4868-a5ac-f48326eb447f
tags: [verification]
keywords: [whole-file-allowlist, file-plus-line-predicate, residual-vocab-guard, same-file-regression, allowlist-baseline]
author: claude
priority: high
domain: verification
supersedes: null
superseded_by: null
related: [guard-cited-as-runtozero-without-matching-vocab]
---

# Whole-file allowlist false-passes a same-file residual

## What happened

A residual-vocab guard's allowlist whitelisted entire FILES (the 19 legitimate historical carriers) rather than the specific legitimate LINES. A NEW retired-form token added inside one of those allowlisted files false-passed — the guard returned "NO RESIDUAL" / exit 0. The executor's self-check verified the NON-allowlisted-file case (which worked) but not the same-file case; the Codex evaluator's adversarial probe (append a new `_shared` line to an allowlisted carrier) exposed it.

## Why it happens

Whole-file allowlisting assumes everything in a "trusted" file is legitimate forever. It cannot distinguish the historical legitimate occurrence from a NEW (illegitimate) occurrence in the same file — so the guard catches only outside-file residuals, defeating its purpose for in-file regressions.

## Correct approach

Use file-plus-line predicates — allowlist the EXACT legitimate line content (a `(basename, exact-line)` baseline derived from a fresh run), so a new or different token in the same file is still flagged. Verify with a same-file probe: a new token in an allowlisted carrier MUST fail the guard.

## How to detect

The allowlist predicate keys on filename / path / basename only, never on line content; a planted new token inside an allowlisted file passes the guard.

## Related

- [[guard-cited-as-runtozero-without-matching-vocab]] — the parent guard-false-PASS trap this sharpens with the file-plus-line predicate fix
