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
**Coverage:** partial

## Situation
A policy appears in several prose blocks and role tables inside the same current file, while a plan names only the file.

## Inputs
The seven current policy documents, their semantic equivalents, and the validator strings coupled to them.

## Expected behavior
Planning and Execution use a form-covering per-site inventory. No live policy statement or table is omitted because its file was already named once.

## Verification
Run the scoped semantic searches, reconcile every hit with the locked inventory, and require the final compatibility check to pass.

## Related
- [[deterministic-codex-policy-authorities]] — the design whose authorities require complete coverage.
