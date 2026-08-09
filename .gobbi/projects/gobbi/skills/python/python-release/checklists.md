# Python Release Evaluation Checklist

## Scenario Hierarchy

### Design lifecycle

- Immutable release-subject design
  - Artifact and version identity
    - One version decision is bound to one unchanged package artifact
  - Evidence change boundary
    - Stale or changed inputs invalidate release conclusions
- External coordination design
  - Separate release facts
    - Readiness, authority, executor, and external observation remain distinct

### Development lifecycle

- Readiness record construction
  - Unchanged artifact assessment
    - Readiness remains local coordination evidence
- Authorized handoff preparation
  - Exact external action boundary
    - Current authority is checked before a named owner receives the action
  - Release execution exclusion
    - Coordination performs no artifact or destination action

### Product lifecycle

- Publication verification consumption
  - External consumer observation
    - Returned evidence remains bound to the unchanged artifact
- Release recovery
  - Incomplete or conflicting observation
    - Recovery keeps external state and future mutation authority explicit
- Release record trust
  - Maintainer and consumer review
    - Labels cannot replace release evidence

## Checklist Conditions

### Design lifecycle > Immutable release-subject design > Artifact and version identity > One version decision is bound to one unchanged package artifact

- [ ] The release record binds an unchanged artifact path, kind, checksum or equivalent byte identity, distribution metadata, version, source or build input identity, and installed-consumer evidence.
- [ ] The version decision identifies its project authority and does not infer a value from a filename, destination, or mutable artifact.

### Design lifecycle > Immutable release-subject design > Evidence change boundary > Stale or changed inputs invalidate release conclusions

- [ ] Missing, stale, ambiguous, inconsistent, or recreated artifact evidence remains a named blocked obligation.
- [ ] A changed artifact, version decision, or consumer assumption invalidates dependent readiness and verification evidence.

### Design lifecycle > External coordination design > Separate release facts > Readiness, authority, executor, and external observation remain distinct

- [ ] Readiness, action specification, current authority, named executor or reader, returned state, and external-consumer observation are recorded as separate facts.
- [ ] Every requested external effect or read identifies the exact artifact, destination, expected states, credential and network scope, executor or reader, and required returned evidence.

### Development lifecycle > Readiness record construction > Unchanged artifact assessment > Readiness remains local coordination evidence

- [ ] A readiness record is not represented as publication, authorization, executor acknowledgment, or external verification.

### Development lifecycle > Authorized handoff preparation > Exact external action boundary > Current authority is checked before a named owner receives the action

- [ ] The current authority is bound to the unchanged action and artifact immediately before coordination.

### Development lifecycle > Authorized handoff preparation > Release execution exclusion > Coordination performs no artifact or destination action

- [ ] The release operation performs no artifact build or rebuild, tag action, credential use, publication, external destination read, or external mutation.

### Product lifecycle > Publication verification consumption > External consumer observation > Returned evidence remains bound to the unchanged artifact

- [ ] Returned evidence identifies the same immutable artifact, version, destination, requested effect, executor or reader, expected state, actual state, and evidence limits as the release record.
- [ ] An external-consumer observation is bound to the unchanged artifact rather than a rebuilt copy or local receipt.

### Product lifecycle > Release recovery > Incomplete or conflicting observation > Recovery keeps external state and future mutation authority explicit

- [ ] An absent, stale, ambiguous, mismatched, or partial observation retains known state, first failure, affected obligation, recovery owner, and first non-mutating recovery action.
- [ ] Recovery coordination names no inferred retry, rebuild, tag, credential use, publication, deletion, overwrite, rollback, or broader external action.

### Product lifecycle > Release record trust > Maintainer and consumer review > Labels cannot replace release evidence

- [ ] No version label, ready status, approval, or polished release record substitutes for immutable identity, current authority, returned state, and required external observation.
