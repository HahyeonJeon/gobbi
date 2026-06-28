---
name: review-communication-principle-trace
description: Point #13 (Review Communication) principle trace must be unambiguous — bare P7 is ambiguous between coding/SKILL.md P7 and principles/SKILL.md P7
type: checklists
scope: feature
feature: review
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [docs-sync, verification]
keywords: [principle-trace, P7, disambiguation, review-communication, taxonomy-point-13]
author: claude
---

# Checklist: review-communication point principle trace must be unambiguous

## Purpose

Point #13 (Review Communication) in the `review.md` taxonomy currently says `Trace P7`. In `coding/SKILL.md`, P7 is "Build Bottom-Up" — unrelated to review-comment communication. This checklist guards against ambiguous principle traces in the taxonomy, specifically for point #13.

## Checks

- [ ] **Point #13 trace label is unambiguous.** If the trace references `P7`, it MUST qualify WHICH P7: e.g., "behavioral P7 (Say/Write Plainly — `principles/SKILL.md`)" vs "coding P7 (`coding/SKILL.md`)". The two principle sets use the same numbering independently.
- [ ] **Alternative: trace to a relevant coding principle.** If Review Communication maps to a coding principle in `coding/SKILL.md` (e.g., P11 — Docstrings, or P13 — Comments, or a behavioral principle from `principles/SKILL.md`), cite that number explicitly with the source skill.
- [ ] **The authoritative-source rule depends on unambiguous traces.** All 13 taxonomy points must have traces of the form `(coding/SKILL.md P{N})` for `coding/SKILL.md` principles, or `(principles/SKILL.md P{N})` for behavioral principles. Mixed numbering without source attribution fails the authoritative-source rule.
- [ ] **Suggested resolution for Point #13:**
  - Option A: `Trace coding/SKILL.md P13 (comments/docs), coding/SKILL.md P7 (say plainly — behavioral)` — if "review communication" maps partially to coding P13 (comments principle) and partially to the behavioral "say plainly" discipline.
  - Option B: `Trace principles/SKILL.md P7 (Say/Write Plainly, Briefly, and Literally)` — if the intent was the behavioral principle, not the coding one.
  - Option C: Trace to Google "Code review comments" + Conventional Comments as external references only (no coding principle number), if no coding principle maps cleanly.
  - The Execution author picks the trace that is most accurate; the key constraint is no ambiguous bare `P7`.

## Context

This finding (`codex-structure-002`, Med/100, open) is not a blocker for the Ideation PASS — the ambiguity is in the design doc's principle-trace annotation, which Execution must correct before `review.md` is authored. The checklist is staged here so the Planning loop carries it into Execution as a pre-condition.

## Verification method

Grep the finished `review.md` taxonomy for bare `Trace P{N}` citations; for each, verify it names the source skill (`coding/SKILL.md` or `principles/SKILL.md`) so both principle sets can be distinguished.
