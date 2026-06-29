---
name: review-md-finding-mapping-schema-fixed
description: review.md per-point finding-mappings used forbidden general+general combo — caught by Codex evaluator (High/100), fixed in iter2
type: decisions
scope: feature
feature: coding
status: accepted
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [evaluation, docs-sync, codex]
keywords: [general-general, finding-mapping, schema-violation, REVISE, iter2-fix, codex-review-md-usage-001]
author: claude
supersedes: null
superseded_by: null
---

# review.md finding-mapping schema violation — caught and fixed

## Context

`skills/coding/review.md` in iter1 contained per-point finding-mapping guidance for points 3a, 3b, 6a, and 6b that directed reviewers to use `Type general` + `Domain general` for certain craft findings (naming, import style, file placement). `evaluation/SKILL.md` explicitly forbids this combination: a finding with BOTH Type and Domain equal to `general` violates the metadata contract.

The Claude executor ran V-checks and the Claude evaluator ran all 7 perspectives — both returned PASS. The Codex evaluator independently returned REVISE with a High/100 finding (`codex-review-md-overall-001`, root cluster also appearing in structure, usage, consistency perspectives).

## Decision

Fix the 4 mapping violations in iter2. Do not ship the doc with schema-invalid mappings. The iter2 fix is the correct approach.

## Rationale

- High/100 severity and confidence: the finding is correct, verifiable, and directly contradicts the schema the doc claims to implement.
- The forbidden combo would teach future reviewers to emit findings that fail the `evaluation/SKILL.md` metadata contract — a latent defect in every review produced with this playbook.
- Fix is minimal: one central-rule paragraph + 4 one-line rewrites. No structural change.

## What changed (iter2 fix, commit de5b1e99)

1. Added "Craft findings and the Domain rule" paragraph at line 54 (the "Code-Review Taxonomy" intro): craft findings (naming, imports, structure) → `design_flaw`/`assumption_risk` with Domain `general` when actively misleading; `Type general` + `Domain general` together → contract violation, never emit.
2. Point 3a finding-mapping: was `design_flaw` / `general` framed as `general`+`general` → rewritten to `design_flaw`+`general`(tag, valid).
3. Point 3b finding-mapping: same fix.
4. Point 6a finding-mapping: was ambiguous `general`+`general` → `design_flaw`+`dependency`/`general` (cycle → `dependency`; other craft → `general` tag).
5. Point 6b finding-mapping: was ambiguous → `design_flaw`+`docs-sync`/`general`.
6. Point #13: resolved as a meta-point that produces no Type/Domain mapping (review-comment phrasing is not a code defect; a `process`-domain finding would mislabel it).

## Alternatives considered

- Map craft findings to `process` domain — rejected. Review-comment phrasing is not a code process finding; `process` would mislabel the defect type.
- Add a `craft` domain to `evaluation/SKILL.md` — out of scope for this task; rejected as scope creep.

## Consequences

- review.md is now schema-valid. Every finding-mapping in the 13-point taxonomy produces a valid `evaluation/SKILL.md` finding.
- The central craft-findings rule (line 54) is a forward contract: any future addition to the taxonomy must follow it.
- Learning staged: `learnings/evaluation/dual-system-caught-schema-violation-single-system-missed.md` — for any future doc that teaches a schema, add a schema-validity V-check to the executor's checklist.
