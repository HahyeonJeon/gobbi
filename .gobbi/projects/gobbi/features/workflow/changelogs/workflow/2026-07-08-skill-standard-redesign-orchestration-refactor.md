---
name: skill-standard-redesign-orchestration-refactor
description: New 6-section skill skeleton shipped; skill-writing + orchestration migrated, orchestration split into 4 workflow child docs.
type: changelogs
scope: feature
feature: workflow
status: active
created: 2026-07-08
session: 33de02b8-4dff-4768-bafa-c1f53ae81890
tags: [process, docs-sync, refactor]
keywords: [skill-standard, six-section, source-free-body, child-docs, orchestration]
author: claude
shipped_in: claude-2026-07-08-33de02b8-4dff-4768-bafa-c1f53ae81890
---

# Skill-standard redesign + orchestration refactor

**Task:** skill-standard-redesign (multi-task Execution: skill-writing rewrite, orchestration
child docs, orchestration skill rewrite, anchor repoints, final integration verification)

## Summary

This session redesigned the gobbi skill authoring standard to a new 6-section skeleton
(Frontmatter → Intro → Principles → Rules → Procedure → References), with a source-free body and
per-doc-local References sections. It migrated `skill-writing/SKILL.md` (the standard dogfooding
itself) and `orchestration/SKILL.md` to the new shape, and split orchestration's five heaviest
sections out into four new `orchestration/workflow/*.md` child docs, repointing every inbound
anchor to the new locations.

## What changed

- Authored the new 6-section skill skeleton and applied it to `skill-writing/SKILL.md`
  (dogfood — the standard is itself written in its own shape).
- Migrated `orchestration/SKILL.md` to the same skeleton.
- Split 5 heavy `orchestration/SKILL.md` sections into 4 child docs under `orchestration/workflow/`:
  status-display, session-record, state-machine, and metadata.
- Repointed every inbound anchor and cross-reference that pointed at the old
  `orchestration/SKILL.md` section headings to the new child-doc locations.
- Ran full dual-system production: Ideation (3 iterations, PASS), Execution task 01
  (skill-writing rewrite, dual eval) and task 05 (final integration verification, dual eval).
- Deferred the `agent-writing/SKILL.md` migration and the `interview/templates/project-skill.md`
  section-order realignment to backlog entries — lazy migration, per the standard's own
  going-forward wording; the ~15 remaining skills migrate the next time each is substantially
  edited.

## Verification

- Dual-system evaluation ran at every gate this session: Ideation iter1 caught an incomplete
  artifact; Ideation iter2 caught missed child-doc anchors and an anchor-blind guard; Execution
  task 01 caught an allowlist mismatch and a non-source-free Rules section; Execution task 05
  caught an evaluator flagging a user-approved content removal as a normative loss (dispositioned
  won't-fix — see the promoted evaluation mistake).
- 6 commits landed on branch `claude-2026-07-08-33de02b8-4dff-4768-bafa-c1f53ae81890`.

## Deferred

- `backlogs/workflow/agent-writing-six-section-migration.md` — `agent-writing/SKILL.md` migration
  to the new 6-section standard, deferred to its next substantial edit.
- `backlogs/workflow/project-skill-template-realign.md` — `interview/templates/project-skill.md`'s
  stamped section order, deferred pending a user decision on realign vs. document-as-exempt.

## Related

- `skills/skill-writing/mistakes.md#child-doc-extraction-breaks-relative-links-and-self-anchors` —
  skill-owned mistake promoted from this session's child-doc split
- [[merge-instruction-means-consolidate-not-concatenate]] — project mistake promoted from this
  session
- [[dual-system-eval-caught-real-defects-every-gate]] — learning promoted from this session
