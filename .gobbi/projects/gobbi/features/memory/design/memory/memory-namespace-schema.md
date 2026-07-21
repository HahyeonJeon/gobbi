---
name: memory-namespace-schema
description: Area-namespace schema for Gobbi memory: path shape, per-type vocabularies, selection, enforcement, and refactors.
type: design
scope: feature
feature: memory
status: active
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [memory, schema, design, docs-sync, validation]
keywords: [area-namespace, slug-hierarchy, categorize-on-write, symmetric, user-decision]
author: claude
supersedes: null
superseded_by: null
related: []
---

# Area namespace schema for Gobbi memory

## Context

A memory type directory without an area axis becomes hard to scan and hard to refactor as records accumulate. Type alone is not enough structure for mistakes, decisions, designs, backlogs, notes, references, learnings, reviews, reports, rules, plans, changelogs, discussions, scenarios, and checklists.

The current memory owner now implements the area namespace on the live tree. This design records that accepted shape and its verification boundary. It does not define lifecycle status enums; `skills/memory/rules.md` owns those.

## Approach

### Path shape

Every by-area record has one real area directory:

- bare-slug types: `{type}/{area}/{slug}.md`;
- date-prefixed types: `{type}/{area}/{YYYY-MM-DD}-{slug}.md`; and
- feature scope: `features/{feature}/{type}/{area}/...` with the same rule.

`features/{feature}/README.md` is the sole structural exception. The feature directory is already its identity axis.

### Per-type vocabularies

Each type owns an independent closed area list at `skills/memory/memory-vocabulary.json` under `.types.{type}.areas`. There is no shared spine and no catch-all area.

Subsystem types use their declared subsystem areas. Mistakes use trap classes. Reviews and reports use their required kind enum as the area. Archive is a destination and mirrors the source type's area; it is not a memory type.

### Deterministic selection

Record and Wrap-up apply one priority order:

1. A valid staging-only `area:` override wins.
2. Otherwise scan that type's ordered `.tagAreaMap.{type}` entries and choose the first match.
3. If no area matches, stop with `NEEDS_CONTEXT`. The manager asks the user to choose an existing area or authorize a vocabulary extension.

There is no fallback bucket. A new area is an Always-Ask edit to the vocabulary and its routing map. Feature-directory normalization occurs before tag matching through the owner-defined normalization map.

### Write and promotion boundary

Record stages typed candidates under session `staging/`. Wrap-up WORK is the sole durable writer. It resolves the destination area, strips staging-only `area:`, applies the frozen staging-only promotion manifest inside the isolated worktree, and verifies the actual changed paths. Productive-step agents, Startup, RECORD, and ad hoc commands do not write durable memory directly.

### Enforcement

The current enforcement set is:

1. `skills/memory/rules.md` for naming, area selection, frontmatter, structure, and refactor policy.
2. `skills/memory/memory-vocabulary.json` for each type's area and tag vocabulary.
3. `skills/memory/scripts/validate-frontmatter.sh` for required area depth, per-type allowlists, frontmatter, and name/path identity.
4. `scripts/check-markdown-links.sh` for scoped changed-file Markdown links.
5. Scoped tracked semantic searches for old paths, old labels, and every reference-class equivalent.

The deleted residual-vocabulary command is not part of the current gate. A whole-file allowlist is also insufficient; search results are classified line by line.

### Refactor procedure

An authorized area split, merge, or rename moves complete records and repoints every inbound path-bearing reference. The semantic union includes:

1. Markdown and relative path references.
2. Prose path and label references.
3. Skill load and `required-mistakes:` path references.
4. Inventories, manifests, and lists.
5. Agent-wrapper descriptions and runtime labels.
6. Paths inside fenced examples and cross-document mentions.

Plain slug identity survives a path move: `name`, body `[[slug]]`, and `supersedes`, `superseded_by`, and `related` stay stable unless the concept itself is renamed. `required-mistakes:` entries are path references and must change.

After the move, run frontmatter validation over every moved record, skill-mistake validation over each changed skill companion, the root scoped Markdown-link validator over every changed Markdown file, and scoped tracked searches for each old path and label. Every residual receives a line-level classification.

The user-approved namespace-refactor carve-out permits moving an active mistake only as this explicit, verified refactor operation. Ordinary active mistakes do not move.

## Rationale

One area level keeps records scannable without arbitrary depth. Independent per-type vocabularies keep a tag or area meaningful for the type that uses it. A no-match user gate prevents silent category proliferation. Staging-only selection and path-encoded durable state avoid duplicating `area` in frontmatter.

The owner-based enforcement set avoids a second large literal baseline. Frontmatter, link integrity, and semantic residual classification prove different properties and remain separate checks.

## Alternatives considered

### Keep each type flat

Rejected because record growth remains unbounded and later moves become wider.

### Use one shared area spine

Rejected because review kind, report kind, mistake class, and subsystem types do not share one useful category axis.

### Fall back to `_shared`

Rejected because a catch-all hides missing classification and grows without an owner decision.

### Keep `area:` in durable frontmatter

Rejected because the durable path already encodes the resolved area. Keeping both creates two writers for one fact.

## Consequences

- Every by-area record is categorized from its first durable write.
- Project and feature tiers use the same shape.
- A no-match area pauses for the user instead of inventing a bucket.
- Path moves require a complete inbound-reference inventory and owner checks.
- Empty typed staging remains valid and creates no durable record.

## Validation

- A nested, on-vocabulary record passes `validate-frontmatter.sh`.
- A bare by-area record, off-vocabulary area, stray `area:` key, or name/path mismatch fails.
- A feature README passes the structural exception.
- A no-match selector reaches the user-decision route.
- A dry-run area move passes frontmatter, skill-mistake where applicable, root scoped links, and line-level old-path searches.
- Promotion maps every durable destination to one typed staging source and changes only the isolated worktree.

## Related

- [[file-move-needs-link-resolution-check]] — the link-resolution check required by refactors.
- [[plan-rename-must-enumerate-all-ref-classes]] — the inbound reference-class inventory.
- [[label-rename-missed-in-fence-and-cross-doc]] — fenced examples and cross-document labels.
