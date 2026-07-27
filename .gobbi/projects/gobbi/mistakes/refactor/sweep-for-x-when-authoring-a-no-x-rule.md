---
name: sweep-for-x-when-authoring-a-no-x-rule
description: A pass can author a no-X rule and leave X in the same file unless the rule immediately runs its own sweep.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-25
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [refactor, verification]
keywords: [no-x-rule, self-sweep, residual, acceptance-predicate]
author: codex
priority: high
domain: refactor
supersedes: null
superseded_by: null
related: [sweep-every-occurrence-when-fixing-a-multi-surface-claim]
---

# Sweep for X when authoring a no-X rule

## What happened

A refactor added a rule that a hoistable file must contain no policy identifiers, rewrote most
sites, and left three identifiers in the same pass.

## Why it happens

The author treats the new prohibition as prose about future edits instead of an acceptance
predicate over the bytes just written.

## Correct approach

Run the complete X sweep immediately after writing a no-X rule. Record the exact subject and
result beside the rule, and prove the predicate with a planted residual when it is load-bearing.

## How to detect

One edit introduces both a prohibition and the cleanup intended to satisfy it, but no final
whole-subject scan proves the new state.

## Related

- [[sweep-every-occurrence-when-fixing-a-multi-surface-claim]] — the broader multi-surface sweep discipline.
