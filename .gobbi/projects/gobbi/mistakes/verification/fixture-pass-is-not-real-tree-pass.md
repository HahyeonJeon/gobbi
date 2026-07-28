---
name: fixture-pass-is-not-real-tree-pass
description: A mechanism's fixture suite can pass while the same mechanism rejects the live repository.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-26
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [verification, tooling]
keywords: [fixture-suite, real-tree, sync, topology]
author: codex
priority: high
domain: verification
supersedes: null
superseded_by: null
---

# A fixture pass is not a real-tree pass

## What happened

The sync fixture suite passed while correctly rejecting version drift. The live repository
contained that drift, so the real sync failed.

## Why it happens

Controlled mechanism behavior and live-state readiness are folded into one green claim.

## Correct approach

Run the fixture suite and the mechanism against the real target as separate gates. Report each
result and its limit.

## How to detect

A report cites passing fixtures but does not show the same operation against the current real target.
