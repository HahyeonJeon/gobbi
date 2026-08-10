---
name: python-release
description: "MUST load when immutable Python artifact evidence is used to coordinate version readiness, authorized publication verification, or recovery."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Python Release

Python Release consumes immutable Python artifact evidence to coordinate version readiness, authorized publication
verification, and recovery. It returns a readiness record, an evidence-backed verification record, or a blocked
state without changing the artifact or an external destination.

This operation owns release readiness and recovery coordination only. `python-packaging` owns artifact creation
and installed-consumer evidence. A separately authorized external owner performs every tag, credential use,
publication, destination read, or external mutation.

## Principles

### Release evidence must identify unchanged bytes

A release decision concerns one exact artifact, not a filename, rebuilt copy, or remembered build. Version,
artifact identity, source inputs, and consumer evidence must remain connected through the entire record.

### Readiness is not authority

An artifact can be ready without permission to publish, and an authorization record can be invalid for a changed
artifact. Keep readiness, external action authority, executor, and returned state as separate facts.

### Preserve a recoverable stop

Missing evidence, conflicting destination state, or withdrawn authority remains visible. Coordination protects
the immutable subject and names the next owner instead of retrying, rebuilding, or mutating external state.

## Rules

- **MUST bind immutable artifact evidence before a release decision.** Record the artifact's byte identity,
  distribution metadata and version, source or build input identity, installed-consumer evidence, and limits.
- **MUST keep readiness, authorization, execution, and verification separate.** Each external effect needs one
  exact authorized executor and returned evidence for the unchanged artifact.
- **MUST treat missing, stale, ambiguous, or conflicting evidence as a blocked state.** Retain the known state,
  affected obligation, recovery owner, and first non-mutating recovery action.
- **MUST verify publication only through authorized returned evidence or a named authorized reader.** A local
  receipt, version label, or executor acknowledgment does not prove the external consumer state.
- **NEVER build or rebuild an artifact, tag, use credentials, publish, or perform an external action.** Release
  coordination has no direct external authority and cannot inherit it from readiness or an executor.

## Procedure

### Phase 1 — Bind the Immutable Release Subject

#### 1.1 Inspect the artifact evidence

- Receive an unchanged record from `python-packaging` that identifies the artifact path, kind, checksum or
  equivalent byte identity, distribution name and metadata version, source or build input identity, configured
  packaging facts, installed-consumer observation, compatibility assumptions, and evidence limits.
- Check that version representation follows the project's policy and, where applicable, the version identifier
  rules in PEP 440. Do not select, rewrite, or infer a version from a filename or an external destination.
- Block readiness when any required identity or consumer evidence is absent, stale, inconsistent, or recreated.
  Preserve the received facts and request the earliest missing packaging or decision evidence.

#### 1.2 Bind the release request and authority boundary

- Record the requested readiness or publication-verification outcome, the decision owner, intended destination,
  expected consumer observation, and the exact immutable artifact identity to which every later claim applies.
- For a requested external effect or read, require a separately supplied action specification, current authority,
  named executor or reader, expected before and after state, credential and network scope, and returned-evidence
  fields. This operation neither fills missing values nor receives credentials.
- Stop before coordination when authority is missing, stale, withdrawn, broader or narrower than the requested
  effect, or bound to a different artifact, version, destination, executor, or expected state.

### Phase 2 — Assess Readiness and Coordinate Verification

#### 2.1 Produce a readiness record

- Compare the requested release outcome with the unchanged artifact record, version decision, compatibility and
  installed-consumer evidence, and known limits. Keep an unobserved destination fact outside the readiness claim.
- Record every accepted condition, evidence limit, requested external observation, and blocked obligation. A
  readiness record is local coordination evidence, not a tag, publication request, or destination mutation.
- If the artifact or decision changes, invalidate dependent readiness evidence and restart from the changed input.
  Do not reuse a prior record for a similar-looking build or version.

#### 2.2 Hand off only to the named authorized owner

- Recheck the immutable artifact identity, requested effect, expected states, executor or reader, and current
  authority immediately before the handoff. A changed value cancels the handoff until a new exact record exists.
- Supply the named owner with the action specification and required expected observation. The owner alone performs
  any external publication, tag, credential use, destination read, or mutation under its separate authority.
- Await the returned evidence. An intent, acknowledgment, or locally recorded request does not establish that an
  external effect occurred.

### Phase 3 — Verify Returned Evidence and Recover Safely

#### 3.1 Compare returned state with the bound subject

- Confirm that returned evidence names the same immutable artifact, version, destination, requested effect,
  executor or reader, expected state, actual state, and evidence limits that the release record bound.
- Mark the result blocked or recoverable when a required observation is missing, stale, ambiguous, mismatched, or
  partial. Keep local and reported external state distinct; do not reconstruct evidence from a new artifact.
- State publication verification only when the authorized returned observation matches the unchanged subject and
  the required external consumer behavior.

#### 3.2 Record recovery without mutation

- Retain the artifact identity, readiness record, action specification, authority facts, returned evidence, first
  failure, affected obligation, and known before and after state.
- Name the recovery owner and first non-mutating action, such as obtaining missing packaging evidence, resolving
  an external conflict through its authorized owner, or requesting new authority for an unchanged exact action.
- Never direct a retry, rebuild, tag, credential use, publish, deletion, overwrite, rollback, or broader external
  operation from this skill. A later mutation needs separate exact authority and its own executor.

## References

- [Evaluation checklist](checklists.md) supplies local unchecked evaluation conditions.
- [PEP 440](https://peps.python.org/pep-0440/) specifies version identifiers.
- [PyPA packaging flow](https://packaging.python.org/en/latest/flow/) describes package distribution flow.
