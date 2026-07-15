---
name: compaction-brief-must-not-list-example-primitives-absent-from-source
description: A compaction brief that lists example named primitives not present in the source makes the producer add them — a brief-caused scope creep.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-14
session: 6a9e0963-2ca1-4d07-83d3-1889aa16bcf4
tags: [docs-sync, process]
keywords: [compaction-brief, delegation, scope-add, named-primitive, source-fidelity, twine]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
related: [union-diff-must-reach-named-primitive-granularity, union-diff-occurrence-vs-distinct-primitive]
---

# A compaction brief must not list example primitives absent from the source

## What happened

The manager's T7 compaction brief (testing/packaging/interoperability) listed `twine` in its
example list of named primitives to preserve. `twine` was NOT in the source pre-trim, so the
producer, taking the brief's example list as in-scope, ADDED it to the compacted doc — a
scope creep the BRIEF caused, not the producer. The Codex evaluator flagged it (Medium); iter2
removed it.

## Why it happens

A compaction brief tries to be helpful by illustrating "preserve the source's named
primitives" with concrete examples. If any illustrative example is not actually in the source,
the producer cannot tell an illustration from an instruction — a named primitive in the brief
reads as a named primitive to keep, so the producer manufactures it. The brief author lists
examples from memory of the domain, not from a check of the specific source.

## Correct approach

When authoring a compaction brief, list ONLY named primitives verified present in the source
pre-trim — or say "preserve the source's named primitives" with NO invented example list at
all. Illustrations of a preservation rule must be drawn from the actual source, never from the
domain in general. Preserve fidelity by pointing at the source, not by seeding examples.

## How to detect

Any named primitive in the compacted doc that is ABSENT from the pre-trim source is a
scope-add — grep each compacted-doc primitive against the pre-trim. Tell (at brief-authoring
time): the brief's "preserve these primitives" list contains a token you did not confirm by
reading the source.

## Related

- [[union-diff-must-reach-named-primitive-granularity]] — the inverse trap: DROPPING a source primitive during compaction
- [[union-diff-occurrence-vs-distinct-primitive]] — adjudicating genuine drops versus over-flags at named-primitive granularity
