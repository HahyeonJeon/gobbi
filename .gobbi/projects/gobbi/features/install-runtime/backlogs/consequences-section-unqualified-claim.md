---
date: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: deferred
feature: install-runtime
finding-id: CL-CONS-PREP3-001
type: design_flaw
domain: docs-sync
disposition: open
confidence: 75
severity: Low
supersedes: null
superseded_by: null
---

# Consequences section in mirror-canonical decision file still contains unqualified "editing either path" claim

## Context

The mirror-propagation-policy-mirror-canonical-symlinks.md decision file's "## Consequences" section (H2 #5) was not updated during iter3. It still contains the iter2 broad statement "A single `Edit` against either path updates the canonical file; no second write is needed." while the new H2 #6 (Symlink-preservation edit contract) immediately below qualifies this claim — specifying it is true only for inode-preserving edit methods.

## Decision

Accepted as a non-blocking Low-severity residual. The operational discovery path for Planning briefs is: Planning brief → new H2 #6 (not Consequences). The H2 #6 immediately follows Consequences in the same file. A follow-up cleanup of Consequences section is warranted but deferred to a later session.

## Rationale

iter3 was the final iter (maxIterations=3); the surgical scope was to add the H2 edit contract, not rewrite Consequences. The Coverage map in draft-iter3.md acknowledges the Implication-bullet rewrite in the draft but does not extend to the decision file's Consequences. Confidence 75 (not 100) because a careful reader reconciles within one document.

## Consequences

A reader who stops at the "## Consequences" H2 without continuing to "## Symlink-preservation edit contract" gets the unqualified claim. Planning briefs should directly point executors to the H2 #6 section, not to Consequences.

## Related

- `preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md`
- `preparation/evaluation/iter3/claude/consistency.md` (CL-CONS-PREP3-001)
- `preparation/evaluation/iter3/claude/project.md` (CL-PROJ-PREP3-001)
- `preparation/evaluation/iter3/claude/structure.md` (CL-STRUCT-PREP3-001)
