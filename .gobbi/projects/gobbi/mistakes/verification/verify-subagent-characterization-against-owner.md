---
name: verify-subagent-characterization-against-owner
description: A reproduced count does not prove a subagent's interpretation of what the counted owner means.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-25
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [verification, process]
keywords: [subagent-claim, owner, characterization, count]
author: codex
priority: high
domain: verification
supersedes: null
superseded_by: null
---

# Verify a subagent characterization against the owner

## What happened

A nonexistent "nine-output contract" and a false interpretation of the repository's `skeleton`
vocabulary were propagated into later artifacts. The second claim carried accurate occurrence
counts, which made its wrong interpretation look verified.

## Why it happens

Counts prove quantity, not sense. Reproducing a report's number can suppress the separate check
of what the named owner actually says.

## Correct approach

Open the named owner before building on a subagent's characterization. Verify the meaning
separately from the count, and sample where corpus occurrences live when the claim is semantic.

## How to detect

A claim says an owner or corpus "means" something, cites a subagent report, and offers a count
without a direct owner quotation or representative sample.
