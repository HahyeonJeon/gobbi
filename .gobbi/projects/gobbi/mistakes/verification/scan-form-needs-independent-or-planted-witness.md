---
name: scan-form-needs-independent-or-planted-witness
description: A single scan can return a plausible wrong result unless another derivation or planted defect tests the instrument.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-26
session: bb2794ce-bc3d-422a-b011-f8b4750c6eed
tags: [verification, tooling]
keywords: [scan-form, independent-derivation, planted-witness, count]
author: codex
priority: high
domain: verification
supersedes: null
superseded_by: null
related: [claimed-count-not-reproduced-by-scan]
---

# Prove a scan independently or with a planted witness

## What happened

Seven manager scans produced zero or wrong counts against correct artifacts. Four recurred after
the scan-unit rule had been documented.

## Why it happens

A single pattern can be internally consistent while measuring the wrong structure. Re-running
the same form adds no independent evidence.

## Correct approach

For a count or absence claim that will drive action, compare two independently derived results or
prove the instrument rejects a known-bad subject first.

## How to detect

An actionable result comes from one search form with no independent derivation and no planted witness.

## Related

- [[claimed-count-not-reproduced-by-scan]] — the final-count reproduction discipline this strengthens.
