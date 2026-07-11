---
name: rollback-model-policy
description: "Revert the complete model-policy unit coherently before publication or ship a corrective patch afterward."
type: scenarios
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [codex, verification]
keywords: [rollback, version, publication]
author: codex
---

# Rollback model policy

**Category:** failure-mode
**Coverage:** partial

## Situation
A required gate fails after the 19-file policy unit is edited, either before or after version `0.5.2` is published.

## Inputs
The complete source diff, publication status, synchronized version fields, and full verification suite.

## Expected behavior
Before publication, revert all 19 files together and rerun every gate. After publication, issue a new synchronized corrective patch without reusing or decrementing the published version.

## Verification
Confirm the diff and version metadata are coherent and the full gate suite passes in the recovered state.

## Related
- [[rollback-and-risk-boundaries]] — the design governing recovery.
