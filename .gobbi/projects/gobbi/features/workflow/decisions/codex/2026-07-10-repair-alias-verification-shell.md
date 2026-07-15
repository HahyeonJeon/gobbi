---
name: repair-alias-verification-shell
description: "Keep each alias equality assertion on one complete shell command line."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, verification, codex]
keywords: [shell, alias, readlink, inode]
author: codex
---

# Repair the alias verification shell

## Context

Iter2 split two `test STRING = STRING` assertions after `=` without a continuation, making Task 01 fail on correct state.

## Decision

Keep the readlink and inode equality checks as complete one-line commands in both plan deliverables.

## Rationale

The alias method was correct; only the shell syntax was broken. The narrow fix preserves realpath, dereferenced inode, readlink, and Git symlink-mode checks.

## Alternatives considered

Removing the assertions or weakening them to syntax-only checks was rejected because it would lose alias-topology proof.

## Consequences

Claude and Codex iter3 confirm the commands are complete and the alias-only loop passes.

## Related

- [[plugin-delivery-and-alias-topology]] - the alias topology design.
- [[deterministic-codex-model-policy]] - the corrected gate.
