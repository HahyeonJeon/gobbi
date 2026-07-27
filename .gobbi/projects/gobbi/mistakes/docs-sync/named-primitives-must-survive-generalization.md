---
name: named-primitives-must-survive-generalization
description: Generalizing a source condition can silently drop the named interfaces that make the condition executable.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-26
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [docs-sync, verification]
keywords: [named-primitives, generalization, union-diff, source-fidelity]
author: codex
priority: high
domain: docs-sync
supersedes: union-diff-must-reach-named-primitive-granularity
superseded_by: null
---

# Preserve named primitives through generalization

## What happened

A desktop child generalized roughly forty required platform interfaces into broad phrases.
Link, count, anchor, and condition-level gates passed while named mechanisms disappeared.

## Why it happens

Generalization reads as clean prose. When the comparison unit is only the parent condition, it
does not test whether the executable API, parameter, switch, or property survived.

## Correct approach

Enumerate every named primitive in the source and diff that set against the result. Preserve each
name unless a user-approved scope decision explicitly removes it.

## How to detect

The source names concrete mechanisms, the result retains only their heading or general category,
and the verification cites structural coverage rather than a primitive-level diff.

## Related

- [[union-diff-must-reach-named-primitive-granularity]] — the compaction-specific predecessor preserved in archive.
