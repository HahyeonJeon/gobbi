---
name: language-silo-validation-method
description: Property-based language-silo validation method for review.md — grep pre-check + property-based review + wording scan
type: checklists
scope: feature
feature: coding
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [verification, validation]
keywords: [language-silo, property-led, signal-table, grep-precheck, validation-method]
author: claude
---

# Checklist: property-based language-silo validation method for `review.md`

## Purpose

Validate that `review.md` contains NO language-siloed section at any heading level or in wording. Python and TypeScript examples must live ONLY inside property-led signal tables (organized by the review property, not by language).

The previous validation (grep-only for `## Python` / `## TypeScript` at H2 level) was too narrow — a siloed H3, H4, or wording such as "for Python, …" / "in TypeScript, …" would pass the grep check but violate the property constraint.

## Method

**Step 1 — Fast pre-check (grep):**
```
grep -n '##\+ Python\|##\+ TypeScript\|##\+ python\|##\+ typescript' review.md
```
If any hits: examine each — is it a section heading organizing content by language? If yes → REVISE (silo at heading level). If no hits: proceed to Step 2.

**Step 2 — Property-based review (mandatory, not skippable):**
For each code example or language-specific claim in `review.md`:
- [ ] Does it appear inside a signal table with columns organized by PROPERTY (General | Python | TypeScript)?
- [ ] If not a table: is the phrasing property-first? ("A function with too many parameters..." not "In Python, avoid functions with too many parameters...")
- [ ] Is there NO heading at any level (H1–H6) that names a language as an organizing principle?

**Step 3 — Wording scan:**
- [ ] No sentence begins with "For Python, …" / "In TypeScript, …" / "Python developers should…" / "TypeScript requires…" as a section-level organizing statement.
- [ ] Language-specific observations appear inside tables or as inline parentheticals after a general statement: e.g., "avoid wildcard imports (Python: `from foo import *`; TypeScript: `export * from 'bar'`)."

## Checks (during Execution)

- [ ] Grep pre-check passes (no language-named headings at any level).
- [ ] Property-based review passes: all examples in property-led tables OR property-first wording.
- [ ] Wording scan passes: no language-organizing prose at section level.
- [ ] The `review.md` Scope section explicitly states: "general points illustrated with Python and TypeScript examples; no language-siloed sections."
