---
name: validation-schema-tightening
description: Three validation tightenings — property-based silo check, UPPERCASE verdicts, no blocking finding field
type: decisions
scope: feature
feature: coding
status: accepted
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [validation, docs-sync]
keywords: [language-silo, UPPERCASE-verdicts, blocking-field, schema-purity, validation-method]
author: claude
supersedes: null
---

# Decision: tighten validation and schema checks — property-based silo review, UPPERCASE verdicts, no blocking field

## Context

Several iter1 findings across both systems identified validation and schema gaps in the design doc:

- `codex-aesthetics-001` (checklist_gap/docs-sync, Med/100): the no-language-silo validation used grep-only `## Python` / `## TypeScript` as the check — too narrow; a language-siloed heading at a non-H2 level or in wording would pass.
- `codex-aesthetics-002` (design_flaw/process, Med/100): verdict values (PASS/REVISE/FAIL) were written in lowercase in some places, inconsistent with the canonical form.
- `C-3` (general/docs-sync, Low/75): the Write-Findings phase introduced a `blocking` field in the finding schema, but `evaluation/SKILL.md` defines no such field in the canonical schema.
- `codex-consistency-002` (design_flaw/process, Med/100): same as C-3 — `blocking` as a finding field contradicts the canonical schema.
- `codex-overall-002` (checklist_gap/docs-sync, Med/100): validation method needed tightening on these three checks together.

## Decision

Three tightening decisions bundled together:

**1. No-language-silo check → property-based review:**
The validation method replaces grep-only with: "no language-siloed section at any heading level OR in wording." A grep for `## Python` / `## TypeScript` is a fast pre-check only, not the complete check. The property is: all Python and TypeScript examples live inside property-led signal tables (columns: General | Python | TypeScript), organized by the review property, at every heading level and in wording.

**2. UPPERCASE verdicts everywhere canonical values appear:**
PASS / REVISE / FAIL are UPPERCASE wherever they appear as canonical verdict values. Lowercase "pass/revise/fail" may appear only as ordinary prose (not as canonical values). The review outcomes section and Phase 5 of the procedure use UPPERCASE throughout.

**3. No `blocking` finding field:**
`blocking` is NOT a canonical finding field and MUST NOT be added to the finding schema. The canonical finding schema (`evaluation/SKILL.md:339-426`) fields are: finding-id, Type, Domain, Severity, Confidence, Disposition, location, Issue, Evidence, Why-it-matters, Change-needed. The word "blocking" in inline review comments (e.g., Conventional Comments' `(blocking)` decoration) maps onto Severity + Disposition — it is a comment-level signal, not a stored field.

## Rationale

Each of the three clusters (silo-check, casing, schema purity) had Medium/100 findings from Codex — the highest non-blocking priority. They were bundled because each is a validation/schema precision fix with the same fix vector: make the design doc say the exact right thing about each convention, so Execution authors implement correctly.

## Alternatives considered

- **Keep grep-only for silo check**: Rejected. A language-siloed H3 or inline wording would not be caught by `## Python`/`## TypeScript` grep.
- **Allow lowercase verdict values where informal**: Rejected. Consistency with `evaluation/SKILL.md:430-452` requires canonical values to be UPPERCASE throughout.
- **Add a `blocking` field as an extension**: Rejected. Extending the canonical schema without an upstream change to `evaluation/SKILL.md` creates a fork. The decoration model (Conventional Comments → Severity+Disposition) is sufficient.

## Consequences

- Implementation Checklist item 4 (no-silo check) is now property-based, with grep only as a pre-check.
- Implementation Checklist item 7 (procedure) specifies no `blocking` finding field.
- Implementation Checklist confirms UPPERCASE verdicts.
- The checklist `features/coding/checklists/process/language-silo-validation-method.md` captures the property-based method for reference.
