---
name: documented-session-path-must-be-scaffolded-and-verified
description: A documented session path is not live until the Record owner creates and verifies it.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process, docs-sync]
keywords: [session-record, eager-scaffold, path-contract, record-verify, docs-sync]
author: claude
priority: high
domain: docs-sync
---

# A documented session path must be scaffolded and verified

## What happened

A historical workflow document introduced a new staging destination before the session-record
materializer and verifier recognized it. The prose described a writable path, but a fresh session
could not create it through the canonical command and the shape gate could not prove it belonged to
the record tree. Multiple reviews rediscovered the same mismatch.

## Why it happens

Documentation and filesystem mechanics were planned as separate edits even though they defined one
public contract. A path in prose is only an assertion until the Record owner creates it at the right
time, constrains it to the session root, and verifies its placement.

## Correct approach

Before documenting a new session path, add it to the Record owner's executable shape in the same
change. `session-record.sh init` creates every predictable root, step, configured iteration, staging
type, and outputs directory. `scaffold-tasks` creates every plan-known Execution task and its
configured iterations. `verify` rejects missing, extra, misplaced, or root-escaping paths and checks
task coverage. A later cap extension creates only the newly authorized iteration.

If the current Record command cannot create and verify the path, stop and change the owner contract
or narrow the proposed documentation. Do not describe an interim manual materializer or defer the
mechanical half of the same path contract.

## How to detect

A document names a session path that is absent from a fresh `session-record.sh init` or
`scaffold-tasks` fixture, or `session-record.sh verify` does not reject a malformed version of that
path. Another signal is prose assigning directory creation to the manager instead of the Record
owner.

## Related

- [[resume-detection-must-read-only-pre-branch-persisted-facts]] — a sibling boundary requiring executable evidence before mutation
