---
name: mistakes-trap-class-axis
description: Mistakes use a universal trap-class axis (HOW it fails) instead of project-subsystem areas, with a separate dispatch.
type: design
scope: feature
feature: memory
status: active
created: 2026-06-23
session: d0185dba-cd9b-45ad-93f6-7814c4f0ef4a
tags: [memory, schema]
keywords: [trap-class, mistakes-area, orthogonal-axis, process-dissolved]
author: claude
supersedes: null
superseded_by: null
related: [universal-base-layer, project-defined-vocab-config-as-data]
---

# Mistakes trap-class axis

## Problem

Mistakes need a different area axis than other types. A mistake's relevant dimension is HOW it fails (trap-class: verification, rename-sweep, tooling, assumption), not WHERE in the codebase it happened (subsystem: memory, git, workflow). Using the same subsystem axis for mistakes would force confusing cross-cutting: a rename-sweep mistake in git logic belongs to `rename-sweep`, not `git`.

## Scope

In-scope: defining the trap-class axis as the mistakes area and the separate dispatch that governs it. Out-of-scope: the `process` area (dissolved into trap-classes per existing rules.md).

## Approach

Per-type dispatch (extends existing `validate-frontmatter.sh:218-221`):
- `mistakes` → universal trap-class core: `verification`, `rename-sweep`, `tooling`, `assumption`. Projects MAY add subsystem trap-class areas on top.
- All other by-area types → project-subsystem areas (the spine).

gobbi's mistakes areas = universal core + gobbi additions (`git`, `codex`, `docs-sync`, `memory`). Together these reproduce today's `mistakes` set, now SPLIT into universal core + gobbi additions. The `process` trap-class is DISSOLVED (existing rule).

This extends the existing per-type dispatch (I-INT-5); no new dispatch mechanism is needed — only the vocabulary layer changes.

## Scenarios

- Any project records a `verification` mistake: universal trap-class core accepts it with no project config needed.
- gobbi records a `git` mistake: passes the gobbi subsystem additions.
- A cross-subsystem mistake (rename sweep in git): correctly goes to `rename-sweep`, not `git`.

## Validation

gobbi's existing trap-class mistakes (`mistakes/{verification,rename-sweep,tooling}/`) all still validate. A non-gobbi project records a `verification` trap without declaring any subsystem area.

## Trade-offs

Gains: trap-class is universal and project-independent; the same trap patterns recur across projects. Costs: two dispatch paths (trap-class for mistakes, subsystem for others) must stay in sync when adding types.

## Open issues

None.

## Related

- [[universal-base-layer]] — where the universal trap-class core lives
- [[project-defined-vocab-config-as-data]] — the config mechanism
