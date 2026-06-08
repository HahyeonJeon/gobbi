---
name: exec-eval-low-doc-nits
description: Two Low doc-accuracy nits from Execution eval — stale file-header docstring (F-AES-1) and amendment grandTotal wording (F-CON-1, the underlying text already fixed in bb104d9f)
type: backlogs
scope: project
feature: null
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [docs, metadata, doc-accuracy, low, follow-up]
priority: low
disposition: open
project-scope: true
shipped_in: null
---

# Execution-eval Low doc-accuracy nits

## Context

Two Low-severity, non-blocking doc-accuracy findings from the Execution EVALUATION (Claude
Overall):

- **F-AES-1 (Aesthetics, Low/70)** — a stale file-header docstring on one of the metadata
  scripts no longer describes the post-rewrite behavior.
- **F-CON-1 (Consistency, Low/85)** — amendment grandTotal wording. The underlying
  grandTotal-formula text was already corrected mid-session in commit `bb104d9f`
  (task-03 Bug 2: "sum across input/output/cacheRead/cacheCreation" → "`sessionTotal +
  codex.total`"). This backlog records the residual sweep so nothing is silently dropped.

## Why deferred

Cosmetic doc-accuracy only; no behavioral impact. The eval explicitly recommended folding
these into a cheap follow-up sweep rather than a REVISE gate.

## When to pick up

Next time the metadata scripts/docs are touched — fold the docstring refresh into that edit.

## Suggested approach

Refresh the stale script file-header docstring (F-AES-1) to match the post-rewrite behavior;
confirm the grandTotal wording (F-CON-1) reads `sessionTotal + codex.total` everywhere (the
agents-decision amendment was already corrected in `bb104d9f` — verify no other copy lags).

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-08-c7673705-2d69-4be8-9bd4-436c3eb91be2/` — Execution eval iter1 (Claude Aesthetics + Consistency).
