---
name: cotouch-enumeration-must-cover-semantic-equivalents
description: Co-touch enumeration by one phrase misses semantically-identical assertions phrased differently
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [refactor, docs-sync, process]
keywords: [co-touch, grep-scope, semantic-equivalents, phrase-family, enumeration]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Co-touch enumeration must cover semantic equivalents, not one phrasing

## What happened

During Ideation for a doc-set redesign, the co-touch enumeration for "which docs assert a rule the redesign contradicts" was scoped to a single phrasing — one literal keyword. The redesign edited every site using that keyword but MISSED every semantically-identical assertion phrased differently. The Execution dual-system evaluation caught these as REVISE-level survivors — one rated High/100 — that would have OVERRIDDEN the new behavior in the live workflow. A whole extra remediation task and eval round were needed.

## Why it happens

A contradiction is a SEMANTIC relationship, not a string match. Enumerating co-touch sites by one keyword finds only the sites that happen to use that keyword. The same rule may be expressed across a doc set in many different phrasings; grepping for one token finds one family and silently misses the rest.

## Correct approach

When enumerating co-touch sites for a rule change, build a *phrase set* covering every way the rule is stated (synonyms, the inverse, the operative/dispatch phrasing, the diagram/table phrasing), grep the WHOLE canonical tree, and treat the union as the co-touch list. Prefer enumerating by the *concept* (e.g., "executor reuse policy", "subagent context inheritance") and finding all its expressions over enumerating by one token.

## How to detect

Red flag: the design's "co-touch list" or "checklist" is built from a single grep term. If the enumeration step greps for ONE phrase, it is almost certainly incomplete. The Execution EVALUATION's repo-wide contradiction-survivor hunt is the safety net — but the enumeration should not rely on it to find the obvious equivalents.
