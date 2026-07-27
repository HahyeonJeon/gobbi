---
name: restoration-must-not-join-a-frozen-set
description: Restoring an item as another member can contradict a protected set whose cardinality is frozen elsewhere.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-25
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [docs-sync, process]
keywords: [restoration, frozen-set, cardinality, re-description]
author: codex
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
---

# Keep restorations outside frozen sets

## What happened

A restored mechanism was first described as a fourth member of a nearby set. A protected passage
elsewhere fixed that set at exactly three mechanisms.

## Why it happens

Restoration is naturally written as an addition to the nearest list, while the cardinality
constraint may live in another section and be under a must-preserve instruction.

## Correct approach

Before describing a restored item as a member, search every protected set it could join. When the
set is frozen, describe the restored item by its distinct role rather than renumbering the set.

## How to detect

An exception restores deleted behavior and the edit uses ordinal language such as "fourth" or
adds it to an enumerated set whose size is owned elsewhere.
