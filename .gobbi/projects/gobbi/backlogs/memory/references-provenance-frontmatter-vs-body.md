---
name: references-provenance-frontmatter-vs-body
description: R17 added references provenance to the template BODY, not frontmatter, because the references extension set is a closed allowlist — decide if provenance should be frontmatter-queryable.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-06
session: 1faa4e51-9395-4d58-87b8-e7f47f59f81b
tags: [memory, frontmatter, docs-sync]
keywords: [references, provenance, allowlist, R17, GEN-D8-001, source-authority]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Decide whether references provenance belongs in frontmatter (allowlist extension) vs body

## Context

R17 (review finding GEN-D8-001) asked the references template to carry provenance —
source-authority, stable-anchor, version-or-commit, license, and similar fields. The
2026-07-01 doc-consistency sweep (session 1faa4e51) shipped R17 by adding these provenance
fields to the references template **BODY** — a `## Source` section in
`skills/memory/templates/references.md` — NOT to the frontmatter.

The reason: the `references` frontmatter extension set is a **CLOSED allowlist**
(`memory/rules.md § 2.2`): `references` may carry only `title`, `source`, `accessed`, `ref_type`
on top of base. Adding `source_authority` / `stable_anchor` / `version_or_commit` / `license`
as frontmatter fields would fail the validator's per-type no-stray-keys check (§ 4.4) until the
allowlist is extended. So the sweep placed provenance in the body, where it is human-readable
and validator-safe, without touching the closed allowlist.

## Why deferred

Extending the `references` frontmatter allowlist is a deliberate standard change (the same
discipline as extending an area list or a tag pool — § 2.5 / § 1.5), out of scope for a doc
row that only needed provenance CAPTURED. Whether provenance should also be
frontmatter-QUERYABLE is a separate decision the sweep correctly did not make unilaterally.

## When to pick up

When a future need arises to QUERY references by provenance (e.g. "find every reference whose
`license` is X" or "every reference pinned to a commit"). Body prose is not machine-queryable;
if provenance must be filterable, promote the fields into frontmatter.

## Suggested approach

1. Decide which provenance fields (if any) need to be frontmatter-queryable vs body-documented.
2. If frontmatter: extend `.types.references` in `skills/memory/memory-vocabulary.json` and the
   §2.2 extension row in `memory/rules.md` (Always-Ask standard change), add the fields to
   `validate-frontmatter.sh`'s references allowlist, then migrate the body `## Source` fields up
   into frontmatter across live `references/` files.
3. If body-only stays sufficient: close this with a note that provenance is intentionally
   body-documented, not queryable.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-06-1faa4e51-9395-4d58-87b8-e7f47f59f81b/` — R17 shipped
provenance-in-body in `skills/memory/templates/references.md`.

## Related

- [[remaining-review-fixes-reconciliation]] — R17 is a shipped row in this backbone (§3, marked "SHIPPED (body, not frontmatter)")
