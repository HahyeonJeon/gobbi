---
name: disposition-preservation-missing-t1-t5
description: "Checklist gap: T1 and T5 conformance tasks must verify that FIX-1 strip preserves legitimate disposition keys in feature backlog files."
tags: [checklist, disposition, backlog, conformance]
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
type: checklists
domain: docs-sync
status: accepted
scope: feature
feature: project-memory
supersedes: null
superseded_by: null
---

# `disposition` preservation verification on backlog-touching conformance tasks — implementation checklist

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | A conformance task that touches a feature dir containing `backlogs/` must assert `disposition` is preserved on each backlog file | type-aware-strip-disposition-not-blanket-leak | implemented | After edits, each backlog file still carries its original `disposition:` value; the verify gate names the check explicitly rather than inferring it from the leak gate |
| 2 | The `features/agents` conformance task asserts `disposition` preserved on its 1 backlog file | novel | implemented | `disposition` present on `features/agents/backlogs/privacy-retention-agents-metadata-deferred.md` after the strip |
| 3 | The `features/guardrails` conformance task asserts `disposition` preserved on all 3 of its backlog files | novel | implemented | `disposition` present on the 3 guardrails backlog files after the strip |

## Item details

### 1. Backlog-touching conformance tasks must assert disposition preservation

The original verify gates checked only: leak count = 0, the 9 base keys present, and git-diff scope. None asserted `disposition` preservation. A blanket strip could therefore pass "0 leaks + 9 base keys" while silently deleting a legitimate `disposition` key from a backlog file — `disposition: open|deferred` is a legitimate per-type extension on `backlogs/` and is explicitly out of scope for the staging-key strip.

**Anchor reasoning:** anchored to the [type-aware-strip-disposition-not-blanket-leak](../decisions/type-aware-strip-disposition-not-blanket-leak.md) decision, which establishes that `disposition` is preserved on `backlogs/` and only stripped elsewhere.

**Verification approach:** enumerate the backlog files in the feature dir before edits; after edits, confirm each still carries its original `disposition:` value; the verify gate must name this check explicitly.

## Related

- [type-aware-strip-disposition-not-blanket-leak](../decisions/type-aware-strip-disposition-not-blanket-leak.md) — the decision establishing `disposition` is a legitimate backlog extension, not a leak
- [`memorization/rules.md` §4.4](../../../skills/memorization/rules.md) — the conditional-`disposition` rule (leak everywhere except `backlogs/`)
