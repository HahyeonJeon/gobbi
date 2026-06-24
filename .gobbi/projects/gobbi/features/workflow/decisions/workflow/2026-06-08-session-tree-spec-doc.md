---
name: session-tree-spec-doc
description: Create orchestration/templates/session-tree.md as the single source of truth for the session-memory tree; all loop/orchestration docs point here for shape.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: []
keywords: [session-memory, spec-doc, documentation]
author: claude
supersedes: null
superseded_by: null
---

# Dedicated session-tree spec doc at orchestration/templates/session-tree.md (D-spec)

## Context

The previous "canonical" session tree was described in-line in `orchestration/SKILL.md` and repeated (with variations) in roughly 16 other skill docs. This was the root cause of shape drift: the shape was prose-defined in multiple places with no single authoritative reference, so any agent reading a different doc might infer a different shape. The user confirmed a dedicated spec doc in the D-spec design gate.

## Decision

Create `orchestration/templates/session-tree.md` as the single source of truth for the session-memory tree. This file lives beside the other session templates (`session.template.json`, `state.template.json`) — the natural home per `memorization/SKILL.md`.

All loop and orchestration docs replace their inline tree descriptions with a pointer to this spec doc. Each per-loop doc states only its own write rows; the shared shape lives exclusively in the spec doc.

Contents: the complete ASCII tree, the `{N}` ordinal map, per-role dir contracts (writer, lifecycle, committed/promoted/ephemeral), per-loop staging-subdir vocabulary, transcript rules (single root `{role}-{agentId}.jsonl`), spec-to-script binding + sync-check description, SEAM-3 rule (bare JSON keys), D7 lifecycle property, Wrap-up promotion-inventory rule, interview bootstrap-exception note, path-validation contract for the scaffold script.

## Rationale

Having ~16 prose definitions was the root cause of drift. Collapsing them into one spec closes that root cause. The spec becomes the verified-against source for the scaffold script's embedded manifest — the sync-check diffs the script's output against the tree this doc declares. Every doc that previously re-described the tree structure now instead points here; the pointer is a one-line reference, not a repeated tree block.

## Alternatives considered

- Spec lives inside `orchestration/SKILL.md` §Workflow Session Memory rather than a separate file: possible but makes the section very long and harder to link to directly. The separate file is cleaner and fits the existing `orchestration/templates/` convention.

## Consequences

- `orchestration/SKILL.md` §Workflow Session Memory inline tree is replaced with a pointer.
- `memorization/SKILL.md` Output-paths table and Memory Access Matrix point here for shape.
- `memorization/memory-map.md` session-memory path index points here.
- Every loop skill's Output-paths / Memory-Access-Matrix section references the spec doc for shape and states only its own write rows.
- The spec doc is what the sync-check (`verify-session-tree.sh --check`) diffs against.

## Related

- design/workflow/session-memory-tree.md
- decisions/workflow/2026-06-08-scaffold-script-mechanism.md
