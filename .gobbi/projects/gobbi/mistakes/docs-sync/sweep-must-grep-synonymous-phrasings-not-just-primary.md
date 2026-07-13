---
name: sweep-must-grep-synonymous-phrasings-not-just-primary
description: A completeness sweep for a cross-cutting contract restatement must grep every synonymous phrasing, not just the primary term.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-13
session: 2026-07-13-0bbb7c63-919c-45c2-81ea-b86406c8b75b
tags: [docs-sync, verification]
keywords: [completeness-sweep, phrasing-synonyms, grep-coverage, contract-restatement]
author: claude
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
related: [enumerate-all-restatements-and-classify-deferral-before-claiming-map-complete, atomic-flip-must-propagate-to-cotouch-prose-and-active-mistakes]
---

# A contract-restatement sweep must grep MULTIPLE synonymous phrasings, not just the primary one

## What happened

The "sole-writer" amendment (adding the startup-close exception to every "Wrap-up is the sole
writer to memory" statement) was declared complete three times, and each time a residual
survived. The original PR-#350 §6.5 amendment missed `memory/rules.md:45`. The next sweep
missed `memory/templates/rules.md:67`. A third sweep — which grepped `sole writer|only
writer` — still missed `orchestration/workflow/record.md:255`, `agents/assistant.md:20` ("sole
memory write surface in the entire workflow"), `record/SKILL.md:47`, and
`session-record.md:24` ("the only step that writes memory"). The dual-system evaluation
caught this last cluster. Only a later sweep that grepped several synonymous phrasings
finally drove the residual to zero.

## Why it happens

Each sweep grepped the one phrasing the sweeper had in mind ("sole writer"). But the same
contract is restated in different words across a large doc tree — "only writer", "only step
that writes memory", "sole memory write surface in the entire workflow", "exclusively during
Wrap-up", "durable memory only via Wrap-up". A grep for the primary phrase confirms the known
sites are fixed but is structurally blind to a synonym it did not pattern for — so it reports
"complete" while a paraphrase survives. This is the
[[enumerate-all-restatements-and-classify-deferral-before-claiming-map-complete]] pattern at
the phrasing level: not a new site class, but the same claim in different words.

## Correct approach

Before declaring a contract-restatement sweep complete: (1) brainstorm the set of synonymous
phrasings the contract could take (subject synonyms x verb synonyms x scope synonyms —
"sole/only/exclusive" x "writer/writes/write surface" x "memory/durable memory"); (2) grep
case-insensitively for each, tree-wide (excluding `sessions/` and `archive/`); (3) classify
every hit as fix / qualify / justified-leave; (4) re-run the full synonym set to zero
unqualified survivors.

## How to detect

Any cross-cutting contract restated in prose recurs in synonyms, not one canonical phrase. If
a completeness grep uses a single pattern (e.g. `sole writer`), it cannot be a completeness
proof — it only proves that one phrasing is clean. A sweep declared "complete" after a
one-pattern grep is unproven; re-check with the full synonym set before trusting the result.

## Related

- [[enumerate-all-restatements-and-classify-deferral-before-claiming-map-complete]] — the same
  "enumerate before claiming complete" discipline, applied here at the phrasing level rather
  than the site-class level
- [[atomic-flip-must-propagate-to-cotouch-prose-and-active-mistakes]] — sibling trap: a
  structural guard's green does not prove a semantic repoint (or a phrasing sweep) fully
  propagated
