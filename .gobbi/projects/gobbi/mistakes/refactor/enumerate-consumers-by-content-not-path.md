---
name: enumerate-consumers-by-content-not-path
description: Three consecutive Planning iterations missed consumers because every sweep enumerated by literal path inside skills/ only, blind to prose attributions and the entire agents/ directory.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process, refactor]
keywords: [consumer-inventory, literal-path-sweep, prose-attribution, agents-directory, blind-spot]
author: claude
priority: high
domain: refactor
---

# Enumerate consumers by the moved content's name, not by literal path

## What happened

Building the consumer inventory for the `planning`-skill split — the list of every file that must be
repointed once content moves out of `planning/SKILL.md` — three consecutive enumeration passes
(across Planning iterations and the manager's own sweeps) all searched for the literal path
`planning/SKILL.md` inside `skills/` only. Iteration 4 finally found an EIGHTH consumer the prior
three passes had all missed: `agents/leader.md:85-86`, which attributes the moved content to "the
planning skill" in PROSE, with no literal path at all — and which lives in `agents/`, a directory none
of the prior literal-path sweeps had covered. The producer's own greps, the manager's greps, and an
earlier Codex inventory pass all independently missed this same file for the same structural reason.

## Why it happens

A literal-path search (`rg 'planning/SKILL\.md'`) is precise but structurally blind to two whole
classes of legitimate reference: (a) PROSE attribution, where a document names the concept by role
("the planning skill", "per the planning skill's requirements") rather than by file path; and (b) any
directory the search was never pointed at — here, `agents/`, which the sweeps scoped to `skills/`
never covered, even though `agents/` docs (leader, executor, manager role contracts) routinely
attribute behavior to a named skill in prose. Each individual sweep "worked" in the sense that it
found real, genuine literal-path consumers — the false confidence came from treating "the literal-path
sweep found N consumers" as "the consumer inventory is complete," without separately asking "what
OTHER forms could a reference to this content take, and what OTHER directories could carry them?"

## How to recognize it

Any consumer/blast-radius/co-touch enumeration built from a single search FORM (one literal string, one
regex) over a SUBSET of the tree that "seems like" the natural scope (here: `skills/` only, because the
moved content itself lives under `skills/`). The concrete tell in this session: the SAME missing
consumer was independently missed by three separate actors (producer, manager, an earlier Codex pass)
using structurally similar literal-path searches — convergent agreement between independent searches
using the SAME method is not corroboration of completeness; it is evidence the method itself has a
blind spot every instance of it shares.

## Corrected approach

Enumerate consumers by the MOVED CONTENT's names and roles, not solely by the source file's literal
path: build a search covering (1) literal path in every relative form, (2) prose attribution phrases
("the X skill", "per the X skill", "X skill's"), (3) directory-name form, (4) bare backticked token
form, and (5) the moved primitives' own NAMES (heading titles, field names, section labels) with no
path or attribution at all. Run this FULL five-form search across every directory that could
plausibly hold a consumer — explicitly including `agents/` (role-contract docs), `rules/`, `scripts/`,
and root-level docs, not just the directory the moved content itself lives under. Then verify the
inventory INDEPENDENTLY: this session's iter-6 evaluator re-ran the full five-form sweep from scratch
and confirmed the plan's 9-consumer inventory had no tenth omission — an independent re-derivation,
not a re-read of the producer's own list, is what actually closes this class of gap.

## Related

- `mistakes/refactor/cotouch-enumeration-must-cover-semantic-equivalents.md` — the pre-existing
  project trap naming the semantic-equivalents form of this exact gap; it was not applied at the time
  this session's first three sweep passes were built
- `mistakes/refactor/sweep-grep-literal-loop-name-blindspot.md` — the pre-existing project trap on a
  form-specific grep missing other-form occurrences, the general pattern this session's `agents/`
  directory miss instantiates
- `mistakes/refactor/blast-radius-map-from-named-files-not-exhaustive-grep.md` — the pre-existing
  project trap this session's method-defect is a third witness of
