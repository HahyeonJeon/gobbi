---
name: stale-layer2-source-refs
description: Three of six layer2-source frontmatter refs in skills/mistake/layer2-*.md point at nonexistent target files — fix or remove the dangling refs.
type: backlogs
scope: project
feature: null
status: closed
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [memory, links, docs-sync]
keywords: [layer2-source, dangling-ref, stale-path, mistake-promotion]
author: claude
priority: low
project-scope: true
shipped_in: null
archived_at: 2026-07-20
archive_reason: addressed
---

# Stale layer2-source refs — three point at nonexistent files

## Resolution (closed)

Closed: the Layer-2 model was removed. The mistakes redesign deletes the 9
`skills/mistake/layer2-*.md` copies and drops the `layer2-source:` frontmatter
field wholesale (the guard `PATH_FIELDS` no longer carries it). With no
`layer2-source:` refs left in the tree, the dangling-ref subject this backlog
tracked no longer exists. The 3 ghost lessons were re-homed first (route-before-
delete, R1), so no lesson was lost.

## Context

The six Layer-2 promoted mistake docs under `skills/mistake/layer2-*.md` each carry a `layer2-source:` frontmatter field naming the project-mistake(s) they were promoted from. Three of the six refs point at target files that DO NOT EXIST in the tree (verified 2026-06-21):

- `layer2-cotouch-enumeration-must-cover-semantic-equivalents.md` → `mistakes/cotouch-enumeration-must-cover-semantic-equivalents.md` — MISSING
- `layer2-verify-state-from-authoritative-source-not-proxy.md` → `mistakes/asserted-git-drift-direction-without-running-git.md` + `mistakes/carried-stale-anchor-despite-upstream-correction.md` — BOTH MISSING
- `layer2-planning-leader-asserted-file-type-without-verifying.md` → `mistakes/planning-leader-asserted-file-type-without-verifying.md` — MISSING

The other three refs resolve correctly (`planning-asserted-skill-without-verifying`, `sweep-grep-literal-loop-name-blindspot`, `file-move-needs-link-resolution-check` all exist).

This is pre-existing debt, not introduced by the namespace work — it was surfaced while sampling memory refs during the namespace ideation.

## Why deferred

Out of scope for the area-namespace redesign (design-only session, no data edits). The dangling refs are a pre-existing provenance-link defect. Note: `layer2-source:` lives in `skills/mistake/` — a non-memory authoring surface excluded from the validator's `P_live` scope — so the frontmatter validator does NOT flag it; this needs a deliberate fix pass.

## When to pick up

No hard prerequisites. Natural to fold into any link-integrity sweep or the `memory-namespace-migration` pass (which also moves mistake files and must repoint refs). Decide per ref: either the source mistake was renamed (repoint the path) or it never landed / was superseded (remove or correct the `layer2-source:` value).

## Suggested approach

1. For each of the three dangling refs, search the tree (and `git log`) for the intended source mistake under a different slug.
2. If found, repoint `layer2-source:` to the live path. If the source was superseded/archived, point at the archive path or drop the ref.
3. Run a path-existence check over all six `layer2-source:` values to confirm zero dangling refs remain.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-21-c3ac1c53-6741-49cf-8856-cdb3fcd6bec0/`

## Related

- [[memory-namespace-migration]] — the migration pass this link-fix can fold into
- [[file-move-needs-link-resolution-check]] — the link-resolution discipline a repoint must follow
