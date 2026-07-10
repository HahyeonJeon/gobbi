---
name: cotouch-classifier-must-model-exclusion-flips
description: A co-touch/refactor classifier must enumerate ALL flip-types (add / remove / count-change / leave), not just include-vs-leave — an exclusion-flip surface mis-classified as an inclusion surface leaks
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-08
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [refactor]
keywords: [cotouch-classifier, exclusion-flip, family-9, family-8, glob-count]
author: claude
priority: high
domain: refactor
supersedes: null
superseded_by: null
related: [hardcoded-baseline-guard-is-an-edit-target-of-the-structure-it-guards, cotouch-enumeration-must-cover-semantic-equivalents]
---

# A co-touch classifier must model exclusion flips, not just inclusion flips

## What happened

The `check-eval-childdocs.sh` two-family model (Family-9 = must ADD a `checklist.md` reference; Family-8 = count stays 8; verified-leave = not edited) had no slot for a surface whose correct flip is to EXCLUDE the new file. `codex/SKILL.md:387` (a finding-file `*.md`-glob count) must, post-split, EXCLUDE `checklist.md` from the glob so the FINDING count stays 8 — a real edit, but an exclusion, not an inclusion. It was mis-classified Family-9-inclusion. That forced a leaky "same-system checklist.md satisfies the surface" rule in the enforcement gate, which then MASKED a stale sibling count (`:383 # must be 8`) once any `checklist.md` appeared in the fence — a reachable false-PASS on the gate's core job.

## Why it happens

The classifier design assumed every surface that reacts to the new file reacts by INCLUDING it, so the taxonomy was include-vs-count-vs-leave. Real refactors have a fourth reaction: a surface that must EXCLUDE the new artifact to stay correct (globs, counts, allowlists, "N files" assertions where the new file is not one of the N). Collapsing exclusion-flips into the inclusion family makes the "did it get the new reference?" gate satisfiable by the wrong evidence.

## Correct approach

Enumerate every flip-TYPE up front — add-reference / count 8→9 / count-stays-8-exclude-new / leave-untouched — and give each its own gate predicate. An exclusion-flip surface is verified by "the new name is now excluded / the count is unchanged," NOT by "the new name appears near it." Keep exclusion-flip surfaces SURFACED for the edit pass (they still need editing) under their own label, distinct from the inclusion set the mechanical gate enforces.

## How to detect

Building a completeness/co-touch classifier for a refactor that adds a file/field/case. A surface COUNTS or GLOBS the set the new artifact is adjacent to but NOT a member of (finding files, a fixed-N assertion, a vocab glob). The enforcement gate keys on "the new name appears near the surface" — ask: is there a surface whose CORRECT flip is the new name appearing and being EXCLUDED? If so, "name appears" is the wrong gate for it.

## Related

- [[hardcoded-baseline-guard-is-an-edit-target-of-the-structure-it-guards]]
- [[cotouch-enumeration-must-cover-semantic-equivalents]]
