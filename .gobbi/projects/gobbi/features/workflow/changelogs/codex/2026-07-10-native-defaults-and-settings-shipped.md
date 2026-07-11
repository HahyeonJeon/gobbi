---
name: native-defaults-and-settings-shipped
description: "Pinned native Codex defaults and settings to gpt-5.6-sol with xhigh effort."
type: changelogs
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [codex, process]
keywords: [gpt-5.6-sol, xhigh, task-01]
author: codex
shipped_in: c70de262ed5baac75b88f82f19b551733ef1d15d
---

# Native defaults and settings shipped

**Task:** `01-native-defaults-and-settings`

## Summary

The repository config, all five native Codex role wrappers, and both workflow settings
templates now use one explicit `gpt-5.6-sol` policy. Native model and Plan effort is
uniformly `xhigh`, while security posture and settings shape remain unchanged.

## What changed

- Added the explicit model to `.codex/config.toml` and kept both reasoning settings at `xhigh`.
- Added the model and uniform `xhigh` effort to manager, leader, executor, evaluator, and assistant wrappers.
- Preserved evaluator `sandbox_mode = "read-only"` and every repository sandbox, approval, network, and agent-limit value.
- Replaced ten Codex template null leaves with `gpt-5.6-sol` strings without adding an effort field or changing Claude values.
- Preserved all alias targets, symlink modes, realpaths, and canonical inode identity.

## Verification

The exact Planning Task 01 gate exited `0` during executor work and again during RECORD.
Codex independently verified exact eight-file scope, TOML and JSON structure, base-value
equality, alias topology, immutable draft hash, exact target commit, and clean source.
Both dual-system Overall evaluations returned `PASS`.

## Deferred

Task 02 owns policy narration and validator alignment. Task 03 owns synchronized release
metadata and the full 19-file integration gate. These planned dependencies are not
unshipped Task 01 work and did not create a new backlog entry.

## Related

- [[task-01-native-defaults-adversarial-review]] - the dual-system acceptance review.
- [[replace-old-mixed-effort-narration]] - the Task 02 dependency exposed by review.
- [[uniform-xhigh-cost-remains-accepted]] - the accepted cost trade-off.
