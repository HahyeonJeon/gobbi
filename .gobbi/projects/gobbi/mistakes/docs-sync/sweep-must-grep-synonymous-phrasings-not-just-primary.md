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

## Second witness (2026-07-14, count-sweep variant)

The same pattern recurred one layer down — not in a prose contract's phrasing, but in a **hardcoded
count's** semantic-equivalent forms. A `startup` skill design (branch count 44→46) stated the change
in prose and named the files to update (a §6 CRUD map), but the map enumerated FILES, not literal
occurrences. When the Consistency evaluator grepped the current skill for `\b44\b`, it found NINE
hardcoded occurrences the CRUD map had not itemized — spread across the authoritative coverage check
(`checklist.md`), a self-ratio phrasing ("44/44" in `scenario.md`), and several branch/topic-summary
counts in `evaluation.md`. A fuller re-grep at RECORD time (against the corrected draft) found a
TENTH occurrence — an illustrative "43/44" example ratio — that even the evaluator's own finding had
not itemized. The same root cause as the prose-sweep case above: a completeness check that scans for
FILES-that-mention-the-concept (or the single primary numeral) is structurally blind to a form it did
not pattern for — a self-ratio, an "all N" phrase, or an adjacent illustrative number. The fix is the
literal-plus-equivalents version of the correct approach above: grep every co-touched file for the
literal changed value AND its semantic equivalents (self-ratios, "all N" phrasing, illustrative
near-number examples), not just the bare number, and cite line numbers in the CRUD map so the
executor cannot silently miss one.

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
