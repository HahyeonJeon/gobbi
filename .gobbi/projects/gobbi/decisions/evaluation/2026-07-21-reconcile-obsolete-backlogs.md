---
name: reconcile-obsolete-backlogs
description: Close five stale backlog records while preserving two still-valid sub-items as narrow successors.
type: decisions
scope: project
feature: null
status: accepted
created: 2026-07-21
session: 37d3c8ef-57dd-477a-b10c-dcbbc1c2327d
tags: [evaluation, memory, process]
keywords: [COD-CONSISTENCY-001, backlog-lifecycle, archive, split]
author: codex
---

# Reconcile the obsolete redesign backlogs

## Context

The fresh Codex Execution iteration 2 report returned `PASS` and opened Medium finding `COD-CONSISTENCY-001`: five active `status: open` backlog records still described missing-link, unmanaged-mirror, and hook work that the redesigned tree had removed or completed. Two mixed queues also contained one still-valid item each.

The user approved the recommended `open` disposition. Memory lifecycle rules require a terminal record to move whole to the project-root typed archive and require live sub-items to be split before a mixed source closes.

## Decision

Close and archive the five records now preserved, with `archive_reason: addressed`, at:

- `archive/backlogs/docs/2026-07-21-claude-doc-authoring-standard.md`;
- `archive/backlogs/process/2026-07-21-claude-skill-dangling-ref.md`;
- `archive/backlogs/tooling/2026-07-21-claude-skills-mirror-policy.md`;
- `archive/backlogs/evaluation/2026-07-21-g1-eval-low-followups.md`; and
- `archive/backlogs/evaluation/2026-07-21-fix-d6-review-findings.md`.

Before closing the mixed queues, preserve G1 F1 as `backlogs/tooling/non-dot-skill-artifact-policy.md` and D6-006 as `backlogs/tooling/plugin-version-cadence-policy.md`. Repoint every active inbound path reference to the archive destination and remove stale pickup wording from those active carriers. Plain-slug links remain unchanged.

## Rationale

The first two records duplicate dangling references that no longer exist. The mirror-policy premise is resolved by the sync-owned per-file Claude mirror. Hook-specific items are invalid because Gobbi now ships no hook component, while link and mirror gaps have current passing owners. The non-dot source-exposure assumption and version-cadence policy are not resolved, so splitting them avoids losing valid future work.

## Alternatives considered

- Leave all five records open, which would preserve stale pickup instructions and leave the approved finding unresolved.
- Close the mixed queues without successors, which would discard two still-valid questions.
- Rewrite the old bodies in place, which would destroy historical evidence.
- Split the live items, archive all five complete historical bodies, and repoint active paths. This is the selected option.

## Consequences

- The active backlog namespace stops presenting removed or completed work as actionable.
- Two current, independently pickable policy questions remain open under `backlogs/tooling/`.
- The five historical records remain recoverable under `archive/backlogs/{area}/2026-07-21-*.md`.
- Plugin version remains `0.5.3`; no release cadence is chosen by this decision.
- No Claude availability or Codex-only waiver is made durable beyond the evaluated session handoff.

## Related

- [[non-dot-skill-artifact-policy]] — surviving G1 F1 policy question
- [[plugin-version-cadence-policy]] — surviving D6-006 policy question
- [[g1-eval-low-followups]] — complete archived source queue
- [[fix-d6-review-findings]] — complete archived source queue
