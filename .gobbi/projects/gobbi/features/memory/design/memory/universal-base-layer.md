---
name: universal-base-layer
description: Two-tier vocabulary — universal base (inherited by all projects) + project-specific areas on top.
type: design
scope: feature
feature: memory
status: active
created: 2026-06-23
session: d0185dba-cd9b-45ad-93f6-7814c4f0ef4a
tags: [memory, schema]
keywords: [universal-areas, universal-tags, two-tier-vocabulary, _shared]
author: claude
supersedes: null
superseded_by: null
related: [project-defined-vocab-config-as-data, mistakes-trap-class-axis]
---

# Universal base layer

## Problem

When de-hardcoding the vocabulary to project-defined, some areas and tags are genuinely domain-agnostic and belong in every project without re-declaration. A project that must re-declare `_shared` or `docs` gains nothing. The question is which items are truly universal vs gobbi-specific.

## Scope

In-scope: defining the universal base layer for areas and the universal trap-class core for mistakes. Out-of-scope: the exact universal tag baseline values (Execution deliverable).

## Approach

Two-tier vocabulary (Q2): universal base (inherited, always valid) + project-specific areas on top.

Universal area base:
- `_shared` — mandatory terminal (no-match destination); universal, cannot be removed by any project.
- `docs`, `tooling`, `tests` — ratified as genuinely domain-agnostic (a CLI tool, a web app, and gobbi all use these); now part of the universal base (new additions, not previously in rules.md).

Universal mistakes trap-class core (Q3):
- `verification`, `refactor`, `tooling`, `assumption` — how the failure happens, independent of project subsystem. `assumption` is a new ratified addition (not currently in `rules.md:107`).

For gobbi specifically, the project-specific additions to the spine are: `memory`, `git`, `workflow`, `wrap-up`, `evaluation`, `codex`, `process`. The mistakes subsystem additions are: `git`, `codex`, `docs-sync`, `memory` (on top of the universal trap core).

## Scenarios

- Any project records a `verification` mistake without subsystem declaration: universal trap-class core accepts it.
- gobbi records a `wrap-up` decision: passes universal spine check + gobbi project additions.
- A candidate universal area that fails the domain-agnostic test (e.g., `auth`) is demoted to project-specific.

## Validation

Each universal area is genuinely domain-agnostic (CLI tool, web app, AND gobbi all use it). Run the non-gobbi golden scenario: a project declaring only universal areas can record any mistake type without declaring subsystem areas.

## Trade-offs

Gains: zero-config projects get sensible defaults; trap-class mistakes work universally. Costs: the universal base must be genuinely stable — adding to it later is a write-set change across all projects.

## Open issues

None. Universal base is ratified (Q2/Q3). Exact universal tag baseline deferred (Execution).

## Related

- [[project-defined-vocab-config-as-data]] — the config mechanism that carries this layer
- [[mistakes-trap-class-axis]] — the trap-class axis that makes mistakes orthogonal
