---
name: enumerate-every-live-policy-site
description: "Policy changes must enumerate every live semantic site within each named file."
type: scenarios
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [codex, verification]
keywords: [docs-sync, form-covering, model-policy]
author: codex
---

# Enumerate every live policy site

**Category:** failure-mode
**Coverage:** covered

## Situation
A policy appears in several prose blocks and role tables inside the same current file, while a plan names only the file.

## Inputs
The named owner documents, their current consumers, all semantic equivalents, and the validator or schema boundaries coupled to them.

## Expected behavior
Planning and Execution start from the owner map, then use scoped tracked searches over every mutable current surface. Each hit is classified line by line as owner, consumer, protected exception, immutable history, lifecycle-pending carrier, or defect. A file-level allowlist cannot hide another stale line in the same file.

## Verification
Run the scoped tracked semantic searches, compare the union with the owner-and-consumer inventory, and require each owner-specific validator plus the final topology and link checks to pass.

## Related
- [[deterministic-codex-policy-authorities]] — the design whose authorities require complete coverage.
