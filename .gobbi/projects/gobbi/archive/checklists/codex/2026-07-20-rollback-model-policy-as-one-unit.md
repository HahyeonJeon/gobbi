---
name: rollback-model-policy-as-one-unit
description: "Roll back content and version metadata together and rerun every gate."
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [codex, verification]
keywords: [rollback, plugin-version, corrective-patch]
author: codex
scenario: rollback-model-policy
item_status: pending
anchor: novel
implemented_in: null
archived_at: 2026-07-20
archive_reason: dropped
---

# Rollback model policy as one unit

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Before publication, revert all 19 files together. | novel | pending | Diff contains neither pinned content nor `0.5.2`. |
| 2 | Rerun JSON, compatibility, pointer, alias, plugin, and publish gates. | novel | pending | Full locked suite passes. |
| 3 | After publication, use a new corrective patch version. | novel | pending | Published versions are never reused or decremented. |

## Item details
The design-level rollback gap is addressed. Execution must still preserve the publication boundary.

## Related
- [[rollback-and-risk-boundaries]] — the rollback design.
