---
name: pointer-does-not-protect-stale-characterization
description: Pointing to an owner does not make a neighboring restatement update when the owned value changes.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-26
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [docs-sync, verification]
keywords: [single-owner, pointer, restatement, stale-characterization]
author: codex
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
---

# A pointer does not protect a stale characterization

## What happened

A sibling pointed at a version owner and also copied what the owner's row meant. When the owner
changed, the pointer remained correct and the neighboring characterization became false.

## Why it happens

Pointer text resolves to current owner bytes. A restatement beside it is a second copy whose
meaning does not update.

## Correct approach

Let the owner carry the value and its versioned meaning. At the pointer site, state only a
property that remains true when the owned value changes.

## How to detect

A sentence beside an owner pointer would become false if the referenced row changed.
