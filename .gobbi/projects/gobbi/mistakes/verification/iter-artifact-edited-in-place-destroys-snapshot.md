---
name: iter-artifact-edited-in-place-destroys-snapshot
description: Editing a prior iter's draft file in-place destroys its frozen snapshot and drifts the evaluators' line references — write each iter as a new draft-iter{n}.md
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [verification, process, docs-sync]
keywords: [iter-snapshot, draft-freeze, in-place-edit, audit-trail, CONSIST-NEW-1]
author: claude
priority: medium
domain: process
---

# Iter artifact edited in-place destroys its frozen snapshot

## What happened

The iter2 remediation was applied by editing `draft-iter1.md` in-place rather than writing a new
`draft-iter2.md`. This destroyed iter1's frozen snapshot — iter1's content is gone, unrecoverable. It
also broke the iter1 evaluators' line references (both Claude and Codex evaluators cited specific line
numbers in iter1 that now resolve to iter2 content). The iter2 Claude evaluator flagged this as
CONSIST-NEW-1 (Medium/100).

## Why it happens

The producer assumed that keeping a single working file (edit in-place, increment the header) is
sufficient — the artifact's content at iter2 supersedes iter1, so why preserve the old file? The
assumption misses two things: (1) evaluators' line citations become stale and unreliable as soon as
the target file mutates; and (2) the session record's job is to provide a durable audit trail of each
iteration's state, not just the final state. Editing in-place merges two iterations' evidence into one
unresolvable blob — the same violation the freeze-race (D9) discipline guards against at production
time.

## Correct approach

Write each iteration's canonical artifact as a NEW file: `draft-iter2.md` for iter2, `draft-iter3.md`
for iter3, never editing a prior iter's file. The new file carries `iter: N` in its frontmatter and
the prior file's frontmatter flips `status: superseded` + `superseded_by: draft-iter{N}.md`. The prior
file's body is preserved verbatim (no body edits on a superseded artifact). This is the same two-phase
freeze discipline the frame itself teaches for proposal artifacts (D9), applied to working drafts.

## How to detect

When preparing to apply eval findings to a working draft: if the plan is to open `draft-iter{n-1}.md`
for edit, stop. That file's content is the iter{n-1} frozen snapshot — evaluators have already cited
line numbers in it. Opening it for edit is the trigger signal.

## Related

- [[freeze-producer-artifact-before-evaluating]] — the production-time origin of this freeze discipline
- [[iter-artifact-snapshot-frozen-not-mutated]] — the scenario that covers this trap
