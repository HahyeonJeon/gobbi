---
name: language-stance-decision
description: Language stance for review.md — language-general with Python+TypeScript examples in property-led signal tables; no language-siloed sections at any level
type: discussions
scope: feature
feature: review
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [ideation, design]
keywords: [language-stance, language-general, property-led, signal-table, no-silo, Python, TypeScript]
author: claude
outcome: language-general points illustrated in Python and TypeScript via property-led signal tables; no language-siloed sections at any heading level or in wording
---

# Discussion: what is `review.md`'s language stance?

## Context

`coding/SKILL.md` is explicitly language-agnostic (it covers principles that apply to any language). The user requested `review.md` as a child doc. During the Ideation DISCUSSION sub-phase, the manager raised the language stance question: should `review.md` be purely language-agnostic, or should it include Python and TypeScript examples?

A related question: if examples are included, how should they be structured to avoid creating a language-specific doc?

## Question

Should `review.md`:

**Option A — Fully language-agnostic**: no language-specific examples at all; the doc applies equally to any codebase.

**Option B — Language-general with Python+TS illustrations (NO language-siloed sections)**: general points that cover any language, illustrated with Python and TypeScript examples, organized by review PROPERTY (not by language) in property-led signal tables. No language-specific sections at any heading level.

**Option C — Language-siloed sections**: separate sections for Python-specific and TypeScript-specific review concerns (e.g., `## Python` / `## TypeScript`).

## Options

| Option | Language coverage | Structure | Risk |
|---|---|---|---|
| A — Language-agnostic | Universal | No examples | Abstract; harder to apply |
| B — General + property-led examples | Universal, Python+TS illustrated | Property-led tables: General / Python / TypeScript | Silo risk if not structured carefully |
| C — Siloed sections | Python and TypeScript only | Language-named headings | Excludes other languages; creates per-language docs |

## User decision

**Option B — language-general with Python and TypeScript examples, NO language-siloed sections** — confirmed by user (direct discussion).

Specific constraints:
- Examples are organized by review PROPERTY, not by language. The signal table column header is the property (or "General / Python / TypeScript"), not the language.
- NO heading at any level (H1–H6) names a language as an organizing principle.
- The Scope section of `review.md` explicitly states: "general points illustrated with Python and TypeScript examples; no language-siloed sections."
- A third language (e.g., Go) is covered by the general points — Python/TS are illustrations, not gates.

## Implication

- Execution uses a property-led signal table shape: `| General signal | Python example | TypeScript example |` organized under the review property name.
- Execution must pass the language-silo validation method (see `checklists/process/language-silo-validation-method.md`): property-based review + grep pre-check.
- The known mistake (`scrub-stack-idioms-when-adapting-to-general-doc`) applies: Execution scrubs any language-siloed heading that accretes during authoring.
- Future per-language children (`skills/coding/python.md`, `skills/coding/typescript.md`) would carry language-specific idiom guidance — NOT in `review.md`.
