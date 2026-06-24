---
name: legacy-frontmatter-migration-mistakes-domain
description: Two project mistakes carry no required domain field; normalize legacy frontmatter to pass the validator.
type: backlogs
scope: project
feature: null
status: deferred
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [memory, frontmatter, schema, validation]
keywords: [legacy-frontmatter, missing-domain, mistakes-extension, normalization]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Legacy frontmatter migration — mistakes missing required `domain:`

## Context

Two project-tier mistakes carry no `domain:` field, which is a REQUIRED `mistakes` extension per `rules.md` §2.2: `codex-wrapper-file-persistence-failure.md` and `planning-asserted-skill-without-verifying.md`. The validator's per-type required-extension check should already flag these. This was surfaced while sampling `domain:` keys during the namespace ideation (the skew analysis: 11/16 `process`, 2 with no `domain`).

> NOTE: A project backlog named `legacy-frontmatter-migration` ALREADY EXISTS in the durable tree (`backlogs/memory/legacy-frontmatter-migration.md`). This staged file uses a distinct slug (`legacy-frontmatter-migration-mistakes-domain`) to avoid a slug collision; at promotion, Wrap-up should reconcile — fold this into the existing backlog or keep it as the narrower mistakes-domain-specific entry. Do NOT create a duplicate flat slug.

## Why deferred

Out of scope for the namespace redesign (this session is design-only, no data edits). It is a pre-existing data defect, not introduced by the namespace work, and fixing it is a one-line frontmatter add per file — better batched with any other legacy-frontmatter normalization.

## When to pick up

No hard prerequisites — can run any time. Natural to fold into the `memory-namespace-migration` pass (both touch the same mistakes files) or any frontmatter-normalization sweep.

## Suggested approach

Add the correct `domain:` value to each file (likely `process` for both, judged from their tags), then run `validate-frontmatter.sh` over `mistakes/` to confirm zero violations.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-21-c3ac1c53-6741-49cf-8856-cdb3fcd6bec0/`

## Related

- [[memory-namespace-migration]] — the migration pass this normalization can fold into
