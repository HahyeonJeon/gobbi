---
name: stamp-coupling-example-must-show-unused-fields
description: A stamp-coupling teaching example whose "bad" aggregate carries only the used fields teaches the opposite; show every good branch as code.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-14
session: 6a9e0963-2ca1-4d07-83d3-1889aa16bcf4
tags: [docs-sync, verification]
keywords: [stamp-coupling, teaching-example, interface-narrowness, bad-to-good, example-fidelity, compaction]
author: claude
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
related: [union-diff-must-reach-named-primitive-granularity, dual-system-caught-broken-teaching-example, gate-c-structural-mapping-is-not-semantic-union-preservation]
---

# A stamp-coupling teaching example must show the aggregate carrying unused fields

## What happened

The python `design.md` §2 interface-narrowness act shipped a bad→good API example that
taught the opposite of its point. The "bad" `AppConfig` aggregate carried exactly the two
fields the unit used — so it was a *cohesive value used in full*, i.e. the act's OWN
"purpose-built value object" GOOD form, not stamp coupling. Labelling it "bad" was
incoherent. Separately, only two of the three contracted good branches were SHOWN as code
(the narrow-params branch and the `Protocol` branch); the value-object branch was left in
prose. The fix made `AppConfig` carry five fields with the unit using two (three unused →
genuine stamp coupling) and added a shown `RetryBudget` frozen value with exactly the used
surface. All four mechanical gates (word-count, AST, anchor, union-diff) and the Claude
evaluator PASSED this; the Codex evaluator caught it (2 High/100 findings, REVISE→PASS).

## Why it happens

Stamp coupling is defined by UNUSED demand: an aggregate is stamp coupling only when the
unit ignores some of its fields. An example author picks the smallest plausible aggregate
(just the used fields) to keep the snippet short — which accidentally makes the "bad" case a
cohesive value, the exact GOOD form. And a bad→good contract that names three good branches
is easy to satisfy in prose while only coding two, because prose reads as "covered."

## Correct approach

In any "narrow the input surface" / stamp-coupling teaching example, make the BAD aggregate
carry at least one field the unit does NOT use (ideally several), so the demand is genuinely
wider than the use. Show EVERY contracted good branch as actual code, not prose — a good
branch named but not shown is not demonstrated. Keep the used-vs-declared field gap visible
in the snippet so a reader can see the coupling.

## How to detect

For any bad→good API example: count the fields the BAD aggregate declares versus the fields
the unit actually reads — equal counts mean it is a cohesive value, NOT stamp coupling, and
the example teaches the opposite. And diff the contracted good-branch list against the
branches actually shown as code — any branch named but only prose-described is an unshown
branch. This is a SEMANTIC example defect that word-count / AST / anchor / union-diff gates
and a structural review do not catch — an independent close-read (the Codex evaluator here)
does.

## Related

- [[union-diff-must-reach-named-primitive-granularity]] — the sibling compaction-fidelity trap: a union-diff must reach named-primitive granularity
- [[dual-system-caught-broken-teaching-example]] — the learning this catch produced
- [[gate-c-structural-mapping-is-not-semantic-union-preservation]] — structural gates are necessary, not sufficient, for semantic fidelity
