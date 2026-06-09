---
name: sweep-grep-form-specific-blindspot
description: A rename/doc sweep verified with form-specific greps misses the same stale vocabulary in other syntactic forms — variable tokens, literal paths, brace sets, and prose are four distinct forms that each require their own grep.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: [process, docs-sync, rename-sweep, grep-scope]
priority: high
domain: process
layer: 2
layer2-source: .gobbi/projects/gobbi/mistakes/sweep-grep-literal-loop-name-blindspot.md
layer2-rationale: Generalizable across all projects — any rename/refactor sweep that verifies completeness with a form-specific grep is structurally blind to the same stale vocabulary in other syntactic forms.
supersedes: null
superseded_by: null
---

# Rename sweep verified with form-specific greps misses other-form occurrences

## Layer-2 note

This is a Layer-2 copy of `mistakes/sweep-grep-literal-loop-name-blindspot.md`. It lives in `skills/mistake/` so it persists and loads across all projects and future sessions. The canonical record is at the project mistakes path above; this copy exists only for cross-project recall.

---

## What happened

A doc sweep renamed a set of directory names and slot names across a large skill doc tree. The sweep's verification grep checked only the VARIABLE FORM of the renamed tokens (e.g., `{loop}/rawdata/`, `{loop}/artifacts/`). It missed every occurrence of the same stale vocabulary in THREE other syntactic forms:

1. **Variable form** — `{loop}/rawdata/` (the form the grep checked).
2. **Literal form** — hard-coded sibling names like `ideation/staging/` or `planning/staging/plans/` in cross-unit references. These do not carry the variable token; they are literal strings.
3. **Brace-set form** — `{ideation,preparation}/{artifacts,staging}/` (cross-loop input matrices), the 4-slot vocab `{rawdata,staging,evaluation,artifacts}/`.
4. **Prose form** — bare word mentions ("rawdata draft", "session-memory (rawdata, artifacts, staging)") that do not appear as a `/`-delimited path segment.

The same defect survived three passes — each pass verified with a grep shaped like the form it had just fixed, leaving the next form class intact.

## Why it happens

A form-specific grep is structurally blind to the same stale word in any other form. The verification step confirmed only what had been done (the form the editor touched), not the full target class (every reference to the old vocabulary). Cross-references between sibling units (module A's doc citing module B's path) typically use literal names, not variable tokens, so a variable-token grep misses all cross-unit references by construction.

## Correct approach

Do NOT verify a rename sweep with form-specific greps. Verify from an EXHAUSTIVE VOCABULARY of the renamed words, then MANUALLY CLASSIFY every hit.

1. Build the full old-vocabulary set: every renamed word AND every renamed structural name, in ALL forms — bare word, `/`-suffixed path, comma-adjacent in a brace set, inside `{...}` alternations, and as a prose word.
2. Grep the vocabulary union: a single grep alternation covering word-boundary, path, brace, and literal-prefix forms.
3. Classify every hit by hand. A grep cannot self-filter: some hits are intentional retentions (generic concept words, historical provenance citations, bootstrap exceptions).
4. After fixing, every remaining hit must be a known intentional retention.

Generalize: a rename sweep's verification is keyed to the renamed VOCABULARY (every word, every form) plus manual classification — never to the form of the references the editor touched.

## How to detect

- A rename/refactor sweep was completed and the verification step ran a grep keyed to one syntactic form (e.g., a variable token, a specific path pattern).
- The diff looks complete but a plain-word search for the old name still returns hits.
- The swept docs include cross-unit references (module A citing module B's path, enum-style brace sets, or prose descriptions of the renamed concept).

## Related

- `cotouch-enumeration-must-cover-semantic-equivalents.md` (same class: co-touch enumeration scoped to one phrasing misses semantically-identical assertions phrased differently)
