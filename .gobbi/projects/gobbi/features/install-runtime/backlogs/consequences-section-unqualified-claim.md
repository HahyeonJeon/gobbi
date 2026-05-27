---
name: consequences-section-unqualified-claim
description: Unqualified "editing either path" claim in mirror-canonical decision file Consequences section
type: backlogs
scope: feature
feature: install-runtime
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [mirror-canonical, docs-sync, consequences, symlink]
disposition: open
supersedes: null
superseded_by: null
---

# Mirror-canonical decision file — Consequences section contains unqualified edit-path claim

## Context

The mirror-canonical decision file's `## Consequences` section was not updated when the symlink-preservation edit contract was added to the same file. Consequences still carries the broad, unqualified statement "A single `Edit` against either path updates the canonical file; no second write is needed." The `## Symlink-preservation edit contract` section immediately below qualifies that claim — it holds only for inode-preserving edit methods (rewrite-by-rename methods such as `sed -i` break the symlink). So the file states an absolute in one section and the correct qualified version in the next, and a reader who stops at Consequences walks away with the wrong rule.

## Why deferred

Accepted as a non-blocking Low-severity residual. The originating session's surgical scope was to *add* the edit contract, not to rewrite Consequences, and a careful reader reconciles the two sections within one document (the contract section directly follows Consequences). Planning briefs are already pointed at the edit-contract section rather than at Consequences, so the operational discovery path does not depend on the stale wording. The cleanup is real but small, so it rides along with the next edit to that file rather than justifying a standalone session.

## When to pick up

Any session that edits the mirror-canonical decision file for any reason should fold in the Consequences-section cleanup at the same time.

## Suggested approach

Replace the unqualified Consequences sentence with the qualified form (a single `Edit` updates the canonical file *only via inode-preserving edit methods*; rewrite-by-rename methods sever the symlink), or have Consequences point forward to the `## Symlink-preservation edit contract` section so the two cannot drift again.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

## Related

- [`../decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md`](../decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md) — the decision file whose Consequences section this entry flags for cleanup

## Source

Surfaced during install-runtime preparation evaluation (session 1b26cf20).
