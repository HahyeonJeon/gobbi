---
name: cotouch-enumeration-must-cover-semantic-equivalents
description: Co-touch enumeration scoped to one phrase misses semantically-identical assertions phrased differently — survivors override the redesign
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [process, docs-sync, evaluation, co-touch, grep-scope]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Co-touch enumeration must cover semantic equivalents, not one phrasing

## What happened

During Ideation for the subagent-continuation redesign, the co-touch enumeration for "which docs assert a rule the redesign contradicts" was scoped to a single phrasing — the literal word **"inherit"**. The redesign edited every `inherit`-phrased site (manager.md, CLAUDE.md, delegation tenet) but MISSED every semantically-identical assertion phrased differently: "fresh executor per task", "one executor per task", "no cross-task subagent memory", "full set of leader transcripts", "spawn a fresh executor". The Execution dual-system evaluation caught these as REVISE-level survivors (Codex rated the operative Auto/Chat mode-doc survivors High/100 — they would have OVERRIDDEN the new continuation path in the live workflow). One survivor (`execution/SKILL.md:112`) was even caught mid-Execution by an executor. A whole 6th remediation task (sweep) + an extra eval round were needed.

## Why it happens

A contradiction is a SEMANTIC relationship, not a string match. Enumerating co-touch sites by one keyword finds only the sites that happen to use that keyword. The same rule was expressed across the skill set in at least five different phrasings; grepping "inherit" found one family and silently missed the rest. The downstream executors faithfully implemented an under-enumerated checklist — the gap was in the enumeration, not the implementation.

## Correct approach

When enumerating co-touch sites for a rule change, build a *phrase set* covering every way the rule is stated (synonyms, the inverse, the operative/dispatch phrasing, the diagram/table phrasing), grep the WHOLE canonical tree (`.gobbi/projects/*/skills` + `agents` + `CLAUDE.md`, not just `.claude/`), and treat the union as the co-touch list. Prefer enumerating by the *concept* (e.g., "executor reuse policy", "subagent context inheritance", "audit-trail completeness") and finding all its expressions, over enumerating by one token.

## How to detect

Red flag: the design's "co-touch list" or "checklist" is built from a single grep term. If the enumeration step greps for ONE phrase, it is almost certainly incomplete. The Execution EVALUATION's repo-wide contradiction-survivor hunt is the safety net — but the enumeration should not rely on it to find the obvious equivalents.

## Related

- `mistakes/false-missing-file-grep-scoped-to-wrong-dir.md` — both are grep-scope failures (wrong directory there, wrong phrase-coverage here)
- `mistakes/leader-iter2-verification-claim-without-evidence.md` — verification claims stated without fresh evidence
