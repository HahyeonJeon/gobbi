---
name: build-tool-deterministic-output
description: Fixed known-in-advance output locations (Maven Surefire) and stable-input canonicalization (reproducible builds) are the pattern for deterministic init scripts.
type: references
scope: feature
feature: workflow
status: active
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: []
keywords: [determinism, scaffold, directory-structure]
author: claude
title: Build/test tool output trees and reproducible-build determinism
source: https://maven.apache.org/surefire/maven-surefire-plugin/examples/logging.html
accessed: 2026-06-08
ref_type: docs
---

# Build/test tool output trees and reproducible-build determinism

## Insight

Two transferable patterns: (1) fixed, predictable output locations beat configurable ones — Maven Surefire always writes to `target/surefire-reports/` so any tool finds results without configuration; (2) determinism comes from controlling inputs and canonicalizing outputs — reproducible builds achieve bit-identical output by ensuring stable inputs, stable outputs, and fixed ordering.

## Related

- decisions/2026-06-08-scaffold-script-mechanism.md
- design/session-memory-tree.md

## Why it applies

gobbi's D1 (deterministic init) maps directly: a scaffold script can only be deterministic if the tree it writes is fully specified in advance (like `target/surefire-reports/`), with no "the agent infers the right subdir" steps. Today the per-loop staging shape varies by loop and is prose-defined — that variance blocks a single deterministic init script. The fixed-spec + normalize-before-writing model grounds the embedded-manifest approach in the scaffold script.

## Source

- https://maven.apache.org/surefire/maven-surefire-plugin/examples/logging.html
- https://reproducible-builds.org/docs/deterministic-build-systems/

## Excerpt

> Surefire's value is that `target/surefire-reports/` is known in advance — no inference. Reproducible builds get determinism by stable inputs + canonicalized outputs + fixed ordering.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-08 | 1abeb43f-6389-4abf-b098-b2b3e68d79b2 | Grounded D1 (deterministic init) and the embedded-manifest approach in the scaffold-script design (EXT-2) |
