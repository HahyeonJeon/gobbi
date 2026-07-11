---
name: prove-security-and-alias-preservation
description: "Prove security values and alias topology against the fixed base before PASS."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [security, verification]
keywords: [sandbox, symlink, inode, mode-120000]
author: codex
---

# Prove security and alias preservation

## Context

Claude Risk finding `R-LC1` could see the expected values but could not prove equality to
base or tracked symlink mode without shell execution.

## Decision

Require parser equality for every non-policy value and live readlink, realpath, inode,
and tracked-mode checks for every role alias.

## Rationale

Security posture and alias topology are properties of the live repository state. Exact
commands provide stronger evidence than visual comparison or content hashes alone.

## Alternatives considered

Close reading and draft assertions were rejected as incomplete proof. Content-only alias
comparison was rejected because a copied file can match bytes while losing symlink
identity.

## Consequences

The finding is addressed. Evaluator read-only posture, repository sandbox and approval
values, network settings, and alias mode `120000` were all preserved.

## Related

- [[task-01-native-defaults-adversarial-review]] - the dual-system review carrying the evidence.
