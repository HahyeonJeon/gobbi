---
name: versioned-restatement-needs-owner-discriminator
description: A restatement sweep over-flags platform divergence unless it tests whether a sentence characterizes a versioned row.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-26
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [verification, docs-sync]
keywords: [restatement, version-owner, platform-divergence]
author: codex
priority: high
domain: verification
supersedes: null
superseded_by: null
---

# Use the owner discriminator for versioned restatements

## What happened

A description-based sweep produced twelve apparent restatement defects. The owner's boundary
showed that all twelve were valid unversioned operating-system divergences.

## Why it happens

Similar wording is treated as the predicate instead of asking which fact the owner actually
owns.

## Correct approach

Call a sentence a restatement defect only when it characterizes the state of a versioned owner
row. Preserve a sibling sentence that names an unversioned platform divergence.

## How to detect

A restatement finding does not identify the versioned row whose state is allegedly copied.
