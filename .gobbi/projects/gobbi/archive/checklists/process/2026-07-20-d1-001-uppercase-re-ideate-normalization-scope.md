---
name: d1-001-uppercase-re-ideate-normalization-scope
description: iter1 finding F-CONS-3 — the D1-001 optional uppercase-RE-IDEATE normalization must enumerate every surviving site, not just one
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [docs-sync]
keywords: [d1-001, re-ideate, normalization, uppercase]
author: claude
scenario: d1-001-drop-re-ideate-verdict
item_status: implemented
anchor: novel
implemented_in: null
archived_at: 2026-07-20
archive_reason: addressed
---

# D1-001 optional uppercase-`RE-IDEATE` normalization must enumerate every surviving site

> **v0.5.3 lifecycle note:** the Preparation paths below are frozen evidence of the original finding.
> The current contract permits `RE-IDEATE` only as a Planning-readiness routing result, never as an
> evaluator verdict; no Preparation path may exist.

## What

The iter1 draft normalized uppercase `RE-IDEATE` only in `preparation/evaluation.md`, reasoning "the
uppercase can imply a verdict." A tree-wide grep showed the same uppercase token also survives at
`preparation/SKILL.md:222` ("RE-IDEATE routing"), `:280`, and `:368` ("RE-IDEATE escalation(s)") —
un-enumerated in the draft.

## Why

These three sites are routing/escalation wording (legitimate, non-verdict usage), so the strict
LOCKED scope (delete the 3 verdict-framing sites) was still technically complete — but the
optional-normalization rationale, applied to one file and not the others, was internally
inconsistent. The draft's own validation grep #2 (`git grep -n 'RE-IDEATE' preparation orchestration`)
would surface these sites and require classification the map did not pre-stage, creating avoidable
friction for the FIX-phase executor.

## Verification

`git grep -ni 'RE-IDEATE' -- .gobbi/projects/gobbi/skills/planning .gobbi/projects/gobbi/skills/orchestration` → every hit is classified as Planning-readiness trigger/routing language, and no hit frames it as an evaluator verdict.

## Status notes

**Addressed at iter2**: `preparation/SKILL.md:222,280,368` were added to the normalization
enumeration; the iter2 evaluator verified all 3 lines carry the uppercase `RE-IDEATE` token.

## Related

- [[d1-001-drop-re-ideate-verdict]] — the design this finding shaped
