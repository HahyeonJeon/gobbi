---
name: typed-skill-authoring-contract
description: Gobbi skills use three semantic types; operation skills own SOPs and a plural verification bundle.
type: decisions
scope: feature
feature: agents
status: accepted
created: 2026-07-19
session: 019f790a-59de-7f40-aa29-99b7356ca704
tags: [process, docs-sync, schema]
keywords: [skill-writing, skill-type, preference-skill, tool-skill, operation-skill, sop]
author: codex
supersedes: skill-loadability-and-map-placement
superseded_by: null
---

# Use three semantic skill types and keep operations SOP-first

## Context

The first Gobbi authoring contract made `skill-writing` and `agent-writing` standalone `SKILL.md` files. It
settled runtime loadability and skill-map placement correctly, but its file-shape clause could not express
different authoring procedures for behavioral preferences, named tools, and operational outcomes. The
replacement contract must add type-specific procedures without turning every existing skill into an immediate
migration project.

## Decision

Gobbi recognizes exactly three semantic skill types:

- `preference` — non-procedural judgment, behavior, constraints, conventions, and defaults;
- `tool` — a manual for one named tool or platform; and
- `operation` — an ordered SOP that produces one observable work outcome.

Classification uses first-match precedence: `operation` → `tool` → `preference`. The former domain category
is absorbed into `operation`; domain knowledge is part of the operational contract when it supports an
outcome. An operation may contain tool facts and preferences, but `SKILL.md` stays focused on the SOP and
keeps those concerns subordinate.

Every new or substantively revised skill stamps one top-level `skill-type` after `allowed-tools` and follows
the matching direct child procedure owned by `skill-writing`. Every new or substantively revised operation
also ships four direct siblings:

```text
SKILL.md
scenarios.md
checklists.md
evaluation.md
```

The parent `SKILL.md` is the sole policy owner. The plural companions exercise and verify parent clauses; they
do not add policy and they do not replace the active workflow phase's singular evaluation bundle. Existing
untyped skills are legacy-compatible until they are substantively revised. No repository-wide type retrofit is
part of this decision.

The still-valid clauses of the superseded contract carry forward unchanged: both runtimes remain mirrored and
model-loadable under the existing loadability rules, and the authoring skills remain in the Gobbi
value-features prose rather than gaining a workflow skill-map table row.

## Rationale

Three types describe the actual job a loader needs to perform. Precedence gives mixed-content skills one
deterministic home: an outcome-producing flow remains an operation even when it invokes a CLI or embeds
preferences. Direct type children keep the parent classifier compact, while the operation bundle makes happy
paths, boundaries, failures, recovery, adversarial behavior, and acceptance evidence independently checkable.

Limiting mandatory migration to new or substantively revised skills avoids a broad mechanical rewrite that
would add metadata without improving the untouched skills' procedures.

## Alternatives considered

- **Keep principle, domain, operation, tool, and preference as five types** — rejected. Principle content is
  preference guidance, and domain content has no independent authoring procedure once an operational outcome
  owns it.
- **Let the dominant amount of prose choose a mixed skill's type** — rejected. Text volume is unstable and
  can flip during editing; ordered-outcome precedence is observable and deterministic.
- **Keep operations single-file** — rejected. A complex SOP needs explicit scenario coverage, binary
  acceptance checks, and an evaluation entrypoint without making its parent unreadable.
- **Retrofit every existing skill immediately** — rejected. The user authorized a going-forward contract and
  substantive-revision gate, not a repository-wide migration.

## Consequences

- `skill-writing/SKILL.md` is itself `skill-type: operation` and dispatches to exactly one of
  `preference-skill.md`, `tool-skill.md`, or `operation-skill.md`.
- New and substantively revised operation skills must close parent ↔ scenario ↔ checklist ↔ evaluation
  traceability before handoff.
- Operation `SKILL.md` files remain SOP-first even when named tools and operating preferences are necessary.
- Untouched legacy skills may remain untyped; their next substantive revision must classify and conform.
- Runtime loadability, canonical-source mirroring, and value-feature map placement retain the behavior accepted
  in the superseded record.

## Related

- [[skill-loadability-and-map-placement]] — historical contract superseded by this complete replacement
- [[skill-writing-agent-writing-shipped]] — session journal for the original authoring guides
