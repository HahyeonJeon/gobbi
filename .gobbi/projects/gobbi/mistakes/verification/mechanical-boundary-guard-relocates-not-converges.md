---
name: mechanical-boundary-guard-relocates-not-converges
description: A mechanical (regex) guard over ambiguous markdown-structure boundaries hits a limit where each fix RELOCATES the gap to an adjacent boundary — it is necessary-not-sufficient; pair it with a reviewer read and cap the iterations
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-08
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [verification]
keywords: [mechanical-guard, markdown-boundary, structural-segmentation, iteration-cap, zero-live-corner]
author: claude
priority: medium
domain: verification
supersedes: null
superseded_by: null
related: [exit-in-command-substitution-fails-open, cotouch-classifier-must-model-exclusion-flips, guard-revises-twice-means-scope-model-wrong]
---

# A mechanical structure-boundary guard relocates the gap instead of converging past a point — treat it as necessary-not-sufficient

## What happened

`check-eval-childdocs.sh`'s `--enforce-inclusion` gate (does each Family-9 surface reference `checklist.md`?) took **8 iterations** to converge, and the last (zero-live) corner still relocated rather than closing. The dual-system evaluation caught a real defect at EVERY round: fail-open → whole-block-too-loose → same-line count → inline-count dead-code → mirror table → block-scan over-reach → separator under-reach. Each fix was correct-in-direction but exposed an ADJACENT markdown-boundary corner (count vs table vs prose vs fenced vs block-extent vs GFM-delimiter shape).

## Why it happens

The mistaken assumption is that a mechanical (bash/regex) predicate can EXACTLY decide, per line, "is this an eval-output enumeration that must gain checklist.md, and was it flipped?" — over free-form markdown where count/table/prose/tree boundaries are genuinely ambiguous and NON-mutually-exclusive (a `wc -l` count contains a `|`; a table cell can contain a count phrase; a GFM delimiter may omit its leading pipe). Disambiguating non-exclusive predicates by ORDER or WINDOW just moves the gap; even STRUCTURAL segmentation leaves adjacent shape corners. Two sub-traps seen: (1) coupling two searches that need OPPOSITE boundaries onto one boundary (the separator-search wants loose, the checklist-scan wants tight) reopens a fixed defect; (2) fixtures covering only ONE structural form (all fenced) give false assurance and hide a dead-code path.

## Correct approach

1. Treat a mechanical structure-boundary gate as **necessary-not-sufficient** — pair it with a human reviewer read of each flipped surface, and SAY SO in the gate's own output. Do not chase 100% mechanical precision over ambiguous markdown.
2. When the gap relocates, STEP BACK to a STRUCTURAL segmentation (mutually-exclusive predicates by shape), not another order/window tweak — but also recognise that even structural segmentation has adjacent corners over free-form text, and cap the iteration count.
3. Never couple two searches with OPPOSITE ideal boundaries onto one boundary.
4. Test EVERY structural variant (fenced AND inline AND table AND the boundary-adjacency shapes) — single-form fixtures are false assurance.
5. Weigh severity by REACHABILITY on the live corpus: a zero-live corner (0 instances of the shape in the tree) is not worth an Nth iteration — accept + document it as a precondition for the consumer.

## How to detect

A guard's classification/enforcement keeps producing a NEW finding each iteration, and each fix RELOCATES the symptom to a neighbouring shape (the `guard-revises-twice-means-scope-model-wrong` signature, escalating past 2-3 touches). The predicate operates over free-form prose/markdown structure with non-exclusive shapes. You catch yourself tuning a window/order a 3rd+ time.

## Related

- [[exit-in-command-substitution-fails-open]]
- [[cotouch-classifier-must-model-exclusion-flips]]
- [[guard-revises-twice-means-scope-model-wrong]]
</content>
