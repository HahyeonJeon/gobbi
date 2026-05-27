---
name: consumer-mental-model-symlink-topology
description: Scenario — executor must understand workspace-is-symlink-layer to safely edit workspace paths
type: scenarios
scope: feature
feature: install-runtime
status: active
created: 2026-05-24
last_updated: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [symlink, mental-model, executor, workspace, consumer]
---

# Consumer mental model — executor must understand workspace-is-symlink-layer topology

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Planning briefs must convey the workspace-is-symlink-layer mental model to executors | mirror-canonical decision file (symlink-preservation edit contract) | implemented | Edit contract H2 in `decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md` |
| 2 | Executors understand which edit methods are safe vs unsafe for workspace paths | symlink-preservation edit contract | implemented | Safety table (10 rows, YES/NO/verify) in decision file |
| 3 | Executor knows how to verify symlink integrity post-edit | `test -L` gate | implemented | Point 3 of discipline list in decision file |

## Item details

### 1. Planning brief conveys symlink-layer mental model

**Anchor reasoning**: The planning consumer (leader copying from preparation output) could carry the wrong mental model about the dual-path topology — believing workspace paths are independent files rather than symlinks to canonical mirror files.

**Verification approach**: Planning briefs cite the edit contract section in the mirror-canonical decision file and specify Edit tool as the default edit method.
