---
name: new-gate-needs-known-good-and-known-bad-witness
description: A new gate can reject every input and still look correct when tested only on a planted violation.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-26
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [verification, execution]
keywords: [acceptance-gate, witness, reject-all, shell-range]
author: codex
priority: high
domain: verification
supersedes: adversarially-test-a-newly-authored-acceptance-predicate
superseded_by: null
---

# Prove every new gate with good and bad witnesses

## What happened

A proposed gate used an embedded hyphen in a `tr` deletion set. The command returned empty and
would have rejected every subject while still rejecting the planted defect.

## Why it happens

Testing only a violation proves that rejection occurs. It cannot distinguish a sound predicate
from a broken predicate that rejects everything.

## Correct approach

Prove one known-good subject is accepted and one known-bad subject is rejected for the exact
named reason. Assert both status and diagnosis.

## How to detect

A new check has a negative fixture but no positive witness, or its negative test accepts any
non-zero exit without checking the cause.

## Related

- [[adversarially-test-a-newly-authored-acceptance-predicate]] — the predecessor preserved in archive.
