---
name: iter-artifact-snapshot-frozen-not-mutated
description: Each iter's working artifact must be written as a new file, never edited in-place — the freeze discipline applied to session working drafts
type: scenarios
scope: feature
feature: workflow
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [process, verification]
keywords: [iter-snapshot, freeze-discipline, draft-artifact, CONSIST-NEW-1]
author: claude
---

# Each iter's working artifact is a frozen snapshot, never mutated

**Category:** failure-mode
**Coverage:** uncovered (surfaced this session; design does not yet enforce it)

## Situation

A producer or leader runs a remediation iter (iter2) and applies the eval finding fix-list. Instead of writing a new `draft-iter2.md`, they edit `draft-iter1.md` in place. The iter1 content is overwritten. The iter1 evaluators' line references — which both Claude and Codex evaluators cited in their findings — now resolve to iter2 content. The session record's audit trail is broken.

## Inputs

- An existing `working/draft-iter{n-1}.md` from a prior iter whose evaluators have cited line numbers.
- A fix-list from the iter{n-1} evaluators requiring specific changes.
- The intent to produce iter{n}'s artifact.

## Expected behavior

The system (or the agent following the discipline) writes a NEW `draft-iter{n}.md` for iter{n}. The prior iter's file (`draft-iter{n-1}.md`) is left unchanged — its body is the frozen snapshot that the iter{n-1} evaluators reviewed. The prior file's frontmatter may be updated to add `status: superseded` + `superseded_by: draft-iter{n}.md`, but its body is never edited. The new file carries `iter: {n}` in its frontmatter.

## Verification

After a remediation iter completes: `diff working/draft-iter1.md <(git show HEAD:sessions/.../1-ideation/working/draft-iter1.md)` → no diff on the body (only frontmatter status field may change). A `draft-iter2.md` file exists alongside `draft-iter1.md`.

Or: `ls working/draft-iter*.md | wc -l` ≥ iter count → each iter produced its own file.

## Related

- [[iter-artifact-edited-in-place-destroys-snapshot]] — the mistake this scenario covers
