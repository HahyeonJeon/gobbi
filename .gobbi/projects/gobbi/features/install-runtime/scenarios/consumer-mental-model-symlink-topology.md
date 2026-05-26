---
scenario: consumer-mental-model-symlink-topology
scope: feature
feature: install-runtime
last_updated: 2026-05-24
finding-id: COD-USAGE-PREP1-003
type: scenario_gap
domain: consumer-mental-model
disposition: addressed
confidence: 100
severity: High
addressed-by: preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md
---

# Consumer mental model — symlink topology scenario gap

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Planning briefs must convey the workspace-is-symlink-layer mental model to executors | COD-USAGE-PREP1-003 (iter1 Codex Usage) | implemented | `staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` + iter3 edit contract H2 |
| 2 | Executors understand which edit methods are safe vs unsafe for workspace paths | iter3 symlink-preservation edit contract | implemented | Safety table (10 rows, YES/NO/verify) in decision file H2 #6 |
| 3 | Executor knows how to verify symlink integrity post-edit | iter3 `test -L` gate | implemented | Point 3 of discipline list in decision file H2 #6 |

## Item details

### 1. Planning brief conveys symlink-layer mental model

**Anchor reasoning**: COD-USAGE-PREP1-003 noted the consumer (Planning leader copying from the preparation output) could carry the wrong mental model about the dual-path topology.

**Verification approach**: Planning briefs for T1+T3 tasks cite the edit contract H2 in the mirror-canonical decision file and specify Edit tool as the default edit method.
