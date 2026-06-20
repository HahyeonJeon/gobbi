---
name: label-rename-missed-in-fence-and-cross-doc
description: A bulk section-label rename was applied to top-level headings but missed the same labels as body-field headings inside a template's fenced example block, plus a downstream contract and prose mention in other docs.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-19
session: 8bdd12ad-9d28-4293-a38f-881db184c465
tags: [process, docs-sync, rename-sweep, verification]
keywords: [label-rename, fenced-block, cross-doc, occurrence-classes, grep-gate]
author: claude
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
related: [plan-rename-must-enumerate-all-ref-classes, sweep-grep-literal-loop-name-blindspot]
---

# Label rename missed the labels inside fenced examples and in cross-docs

## What happened

A bulk label rename across the memory templates (`Why it matters` → `Reason`,
`How to apply` → `How`) was applied to each template's own top-level section
**headings**, but it MISSED the same labels where they appear as body-field
**headings inside a fenced ```markdown example block** (in `learnings.md`, whose
example shows the body shape). It also missed the same labels in two downstream
surfaces: the `rules.md §4.2` per-type section contract, and `ideation/SKILL.md`
prose that named the old labels. The Verify grep gate caught all three classes of
miss before the work shipped.

## Why it happens

"Rename the section labels" was read as "rename the document's own H2 headings." Two
occurrence classes fell outside that reading:

1. **In-fence example headings.** A template's fenced example block contains the same
   labels as `##`-prefixed lines that are *content*, not the document's own structure.
   An edit pass that targets the doc's real headings skips the ones inside the fence,
   because they look like example text, not headings to rename.
2. **Cross-doc references.** The label also lived in another doc's contract table
   (`rules.md §4.2`) and in a third doc's prose (`ideation/SKILL.md`). A per-template
   edit pass never visits those files, so their copies of the old label survive.

## Correct approach

A label rename MUST enumerate ALL occurrence classes up front, before editing:

1. **Top-level headings** — the doc's own `##` section headings.
2. **In-fence example headings** — the same labels appearing as content inside
   ```` ```markdown ```` (or other fenced) example blocks.
3. **Cross-doc anchor links** — `[text](other.md#old-label-slug)` links whose anchor
   is derived from the renamed heading.
4. **Cross-doc prose / contract mentions** — the label named in other docs' prose or
   in a contract table (e.g. a per-type section contract).

Then a **repo-wide grep verify gate** confirms ZERO occurrences of every old label
remain across all `.md` files — not just the renamed template.

## How to detect

A rename brief that says only "rename the sections" / "rename the headings" while the
same label also appears inside fenced example blocks and in other docs' contracts or
prose. The trigger signal: the old label is still grep-findable
(`grep -rn 'Why it matters\|How to apply' --include='*.md'`) after the "rename" is
reported done.

## Related

- [[plan-rename-must-enumerate-all-ref-classes]] — the broader rename trap (enumerate
  every reference class, not just paths and prose); this is its label-specific,
  inside-fence + cross-doc variant.
- [[sweep-grep-literal-loop-name-blindspot]] — a sibling sweep-completeness trap where
  a literal-string grep missed a class of occurrences.
