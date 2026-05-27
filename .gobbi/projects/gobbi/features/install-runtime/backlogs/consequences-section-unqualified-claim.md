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

The `mirror-propagation-policy-mirror-canonical-symlinks.md` decision file's "## Consequences" section was not updated when the symlink-preservation edit contract was added. It still contains the broad statement "A single `Edit` against either path updates the canonical file; no second write is needed." while the "## Symlink-preservation edit contract" section immediately below qualifies this claim — specifying it is true only for inode-preserving edit methods.

## Decision

Accepted as a non-blocking Low-severity residual. The operational discovery path for Planning briefs is: Planning brief → the Symlink-preservation edit contract section (not Consequences). The contract section immediately follows Consequences in the same file. A follow-up cleanup of Consequences section is warranted but deferred to a later session.

## Rationale

The surgical scope of the originating session was to add the edit contract, not rewrite Consequences. A careful reader reconciles within one document. Confidence 75 (not 100) because a careful reader reconciles within one document.

## Consequences

A reader who stops at the "## Consequences" section without continuing to "## Symlink-preservation edit contract" gets the unqualified claim. Planning briefs should directly point executors to the edit contract section, not to Consequences.

## When to pick up

Any session that edits `mirror-propagation-policy-mirror-canonical-symlinks.md` for any reason should fold in the Consequences section cleanup.

## Related

- `preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md`
- `preparation/evaluation/iter3/claude/consistency.md` (CL-CONS-PREP3-001)
- `preparation/evaluation/iter3/claude/project.md` (CL-PROJ-PREP3-001)
- `preparation/evaluation/iter3/claude/structure.md` (CL-STRUCT-PREP3-001)

## Source

Surfaced during install-runtime preparation evaluation (session 1b26cf20).
