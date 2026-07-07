---
name: clean-verdict-unreliable-without-edge-case-stress
description: A review that reports "clean / no findings" is unreliable unless it stressed the edge-case classes (portability, parser corners, fail-open); cross-check with an independent reviewer before trusting a clean verdict.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-06
session: 0d898156-8d5b-4142-9b93-308d3b692995
tags: [verification, evaluation, process]
keywords: [code-review, dual-system, portability, fail-open, parser-edge-cases]
author: claude
priority: high
domain: process
---

# A "clean" verdict is unreliable without edge-case stress

## What happened
In Point 3's adversarial script review, the leader reported `check-markdown-links.sh` + `validate-integration-log.sh` as "clean (counter-evidence, no findings)." The independent Codex pass found real MEDIUM issues in both — a non-portable `\b` ERE word-boundary (breaks on BSD/macOS grep) and a `find` without `-L` that skips symlink mirrors plus a parser that breaks on link titles / nested parens. On verification the leader CONCEDED: its "clean" checked systemic patterns + happy-path + bash-3.2-safety but did not stress regex portability or parser edge cases.

## Why it happens
A single reviewer's "clean" verdict reflects only the axes it happened to check. A happy-path + systemic-pattern pass misses whole edge-case classes: cross-platform tool/regex portability, parser corner cases, and fail-open-on-missing-dependency. "No findings" is easily a coverage gap, not a real absence — and it reads as reassurance while hiding one.

## Correct approach
Treat a "clean" verdict skeptically. Before trusting it: (1) run an INDEPENDENT reviewer (dual-system) and reconcile — divergence on "clean" is the signal (this is exactly what caught it this session); (2) explicitly stress the edge-case classes the happy-path pass skips — cross-platform tool/regex portability, parser corner cases, and fail-open-on-missing-dependency; a verification gate especially must be checked for fail-closed behavior. Relates to [[teammate-finalize-brief-crosses-with-in-progress-turn]] and [[blast-radius-map-from-named-files-not-exhaustive-grep]] — all verify-don't-assume disciplines.

## How to detect
Any review concluding "clean / no findings / looks fine" on a non-trivial artifact — especially shell scripts (portability), parsers (edge inputs), and verification gates (fail-open modes). The reassuring verdict is the smell.

## Related
- [[teammate-finalize-brief-crosses-with-in-progress-turn]] — sibling verify-don't-assume discipline from this session
- [[blast-radius-map-from-named-files-not-exhaustive-grep]] — build the map from exhaustive evidence, don't trust a partial pass
