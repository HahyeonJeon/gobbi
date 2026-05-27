---
name: naming-standard-needs-positive-guidance-not-just-blocklist
description: A naming/doc standard expressed only as a forbidden-pattern blocklist (or, worse, a blocklist later softened away with nothing put in its place) leaves agents no guidance on what a GOOD name is — so cryptic positional names (task-01, d-1, row-5-5, main) keep getting created. Standards must lead with positive "name the subject, here's what good looks like" guidance + good/bad examples, not just prohibitions.
type: mistakes
scope: project
feature: project-memory
status: active
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [docs-authoring, naming, process]
domain: docs-sync
priority: high
supersedes: null
superseded_by: null
---

# A naming standard must teach what GOOD looks like, not only forbid patterns

## What went wrong
The memory-redesign shipped a slug naming standard (`memorization/rules.md` §1) expressed as a **forbidden-pattern blocklist** (phase prefixes, positional indices). When the blocklist proved over-broad (it failed on legitimate content words like `-decisions`), it was **softened to a non-enforced preference** — but nothing positive replaced it. Result: the standard told agents what NOT to do (and then stopped even doing that), but never taught what a GOOD name IS. Cryptic, position-encoding names (`task-01`, `d-1-worktree-row-5-5`, `row-5-5`, `2026-05-23-main`, `reframing-1-3`) kept being created and survived the migration. The user had to point out the names were still "garbage information" to a reader.

## Why it went wrong (the mistaken assumption)
A blocklist of bad patterns was assumed to be sufficient guidance. It is not: a prohibition list does not teach the positive skill (naming the subject so a zero-context reader understands the file). And a regex blocklist is the wrong tool anyway — it false-positives on legitimate content words and gets softened away, leaving a vacuum.

## How to recognize before repeating
- A standard/principle whose naming/quality guidance is ALL "do not" / "forbidden" with no "here is what good looks like" + concrete good examples.
- A reviewer or user asking "what does this filename mean?" / "anyone can understand this?" — the name encodes a position in some list the author had open (task-N, d-N, iterN, row-N, checkpoint-N) rather than the subject.

## Corrected approach
- Lead the standard with a POSITIVE core rule: a name must let a zero-context reader understand the file's SUBJECT; name the concept in development-vibe kebab-case.
- Pair anti-patterns (positional/sequence index; cryptic internal ref; uninformative generic) WITH a good-vs-bad examples table using real before/after.
- Anchor the discipline in a principle (here: Principle 13's Create-operation facet) that POINTS to the standard's examples — don't rely on a mechanical regex gate.
- The redesign's own output must be exemplary: rename existing offenders so the tree matches the guidance (done — 29 files renamed to subject names).

Related: [[design-literal-retire-instruction-without-replacement]] (same shape: removing a thing without a replacement leaves a vacuum).
