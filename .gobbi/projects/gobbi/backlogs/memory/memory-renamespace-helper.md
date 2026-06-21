---
name: memory-renamespace-helper
description: A helper that moves a memory record between areas and repoints every path-class reference atomically, for the refactor procedure.
type: backlogs
scope: project
feature: null
status: deferred
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [memory, refactor, links, docs-sync]
keywords: [renamespace, move-tool, ref-repoint, atomic, gobbi-memory-mv]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Memory re-namespace helper — atomic move + reference repoint

## Context

The refactorability story (core point 3) needs split/merge/rename of an area to be safe. Doing it by hand is exactly the four-rename-mistakes hazard. A `gobbi memory mv {slug} {new-area}`-style helper would: `git mv` the file into the target area, then find + repoint every PATH-class reference (prose links, routing rows, structured-data), then run the two existing guards and report any residual. Slug-identity links (`[[slug]]`, frontmatter pointers) need no change — the helper only touches path refs.

## Why deferred

The 2026-06-21 schema redesign only DEFINES the refactor procedure; building tooling for it is a separate effort and not required for the schema to ship. The procedure can be run manually with the existing guards in the interim.

## When to pick up

Prerequisites: the area-namespace schema + the manual refactor procedure have shipped. Highest value if picked up BEFORE `memory-namespace-migration` — the migration is the first large-scale user of this helper. No hard dependency; the migration can also run with the manual procedure.

## Suggested approach

Wrap the two existing guards (`check-markdown-links.sh`, `check-residual-vocab.sh`) plus a `git mv` + a path-ref rewriter. Reuse the four-reference-class enumeration from `plan-rename-must-enumerate-all-ref-classes` as the rewriter's coverage contract.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-21-c3ac1c53-6741-49cf-8856-cdb3fcd6bec0/`

## Related

- [[memory-namespace-migration]] — the migration arc that is this helper's first large user
- [[file-move-needs-link-resolution-check]] — the link-resolution check the helper automates
