---
name: startup-skill-shipped
description: The startup skill (SKILL.md + topics.md + recording.md) replaces interview; 7 commits, dual-system evaluated, REVISE-then-PASS.
type: notes
scope: project
feature: null
status: active
created: 2026-07-13
session: 2026-07-13-0bbb7c63-919c-45c2-81ea-b86406c8b75b
tags: [refactor, docs-sync]
keywords: [startup, interview-removal, session-shape, bootstrap]
author: claude
features_touched: [workflow]
loops_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [reuse-target-must-be-invocable-at-needed-granularity, asserted-file-absent-from-a-mislisted-dir-used-proxy, removal-must-reclassify-active-design-docs-and-open-backlogs, workflow-compaction-doc-broken-links, startup-session-shape-and-promotion]
---

# startup skill shipped, interview removed

## What happened

This session built the `startup` skill (three files: `SKILL.md`, `topics.md`,
`recording.md`) to replace the `interview` bootstrap skill, then removed `interview`
entirely across both runtime mirrors (`.claude/skills/`, `.agents/skills/`) and the memory
tree. Seven commits landed: relocate/realign the project-skill template, author `startup`,
re-point memory/record/wrap-up authority + session shape from `interview` to `startup`,
re-point the bootstrap trigger + roles + settings, remove the `interview` skill, sync
mirrors + drive guards to zero with a fail-closed sweep, and close the five findings the
dual-system Execution evaluation raised.

Ideation locked the design over two iterations: iter1 proposed atomic startup-close
promotion "by reusing Wrap-up's promotion machinery"; both dual-system evaluators found
that infeasible (Wrap-up promotion is stage 2 of a non-callable, non-rollback-able 5-stage
phase, not a standalone invocable primitive), so iter2 re-designed `startup` to own its own
self-contained promotion procedure that follows the memory rules by reference instead.

## What shipped

- `.gobbi/projects/gobbi/skills/startup/{SKILL.md,topics.md,recording.md}` — the new
  bootstrap skill (11-topic product-shape-first interview tree; atomic startup-close
  promotion per `recording.md` § 9), mirrored to both `.claude/skills/startup/` and
  `.agents/skills/startup/`.
- `interview/` removed from both runtime mirrors and the memory skill tree
  (`skills/interview/SKILL.md` deleted; the skill-gen `project-skill.md` template
  relocated to `skill-writing/templates/`).
- `features/workflow/decisions/workflow/2026-07-13-startup-session-shape-and-promotion.md`
  — the new live decision (supersedes `interview-bootstrap-exception`).
- `archive/decisions/workflow/2026-06-08-interview-bootstrap-exception.md` — the
  superseded decision, moved (not deleted) this Wrap-up.
- Three mistakes promoted this Wrap-up: `[[reuse-target-must-be-invocable-at-needed-granularity]]`,
  `[[asserted-file-absent-from-a-mislisted-dir-used-proxy]]`,
  `[[removal-must-reclassify-active-design-docs-and-open-backlogs]]`.
- `backlogs/workflow/workflow-compaction-doc-broken-links.md` — a pre-existing (PR #339)
  broken-links backlog surfaced (not caused) by this session's audit.

## What got stuck

Nothing blocked outright. The dual-system Execution evaluation caught real gaps late in
the loop (see below), each requiring a fix-then-re-evaluate round rather than a clean first
pass.

## What shifted

- **Ideation iter1 → iter2**: the "reuse Wrap-up's promotion machinery" design was dropped
  for "startup owns its own self-contained promotion, following the memory rules by
  reference" — see `[[reuse-target-must-be-invocable-at-needed-granularity]]`.
- **Removal sweep re-scoped mid-Execution**: the first fail-closed `interview` sweep pass
  classified all ~89 residual hits as "historical-leave" by directory tier; Codex's
  Execution-loop evaluation found this wrong for an ACTIVE design doc and two OPEN
  backlogs that still named the deleted skill — see
  `[[removal-must-reclassify-active-design-docs-and-open-backlogs]]`.

## Decisions to respect

- **`startup` stays under the `install-runtime` value-feature** — no re-home. `gobbi/SKILL.md`'s
  value-feature map already reflects this; do not move it.
- **`startup`-close promotion is a second bounded pre-Wrap-up memory writer**, alongside
  Preparation's `generate-now` skill promotion — see
  `[[startup-session-shape-and-promotion]]` (supersedes `interview-bootstrap-exception`,
  now archived).
- **Wrap-up EXCLUDES `startup/` from its promotion inventory** — startup self-promotes at
  startup-close before any productive loop runs; re-including it would double-promote.
- **11-topic product-shape-first tree** is the locked shape of `startup/topics.md`; skill
  generation itself is handed to Preparation + `skill-writing`, not to `startup`.

## Next session

- Pick up `backlogs/workflow/workflow-compaction-doc-broken-links.md` whenever a
  doc-consistency sweep is convenient — 23 broken relative links (verified this session,
  not the ~32 first estimated), pre-existing from PR #339, unrelated to this session's work.
- The develop-divergence noted at session start (5 unpushed Codex commits) remains
  unreconciled — out of this session's scope, flagged for the manager.

## Related

- [[startup-session-shape-and-promotion]] — the live decision this session shipped
- [[reuse-target-must-be-invocable-at-needed-granularity]] — Ideation design-flaw mistake
- [[asserted-file-absent-from-a-mislisted-dir-used-proxy]] — Execution verification mistake
- [[removal-must-reclassify-active-design-docs-and-open-backlogs]] — Execution refactor mistake
- [[workflow-compaction-doc-broken-links]] — the deferred pre-existing links backlog
