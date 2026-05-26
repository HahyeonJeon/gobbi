---
name: feature-dir-frontmatter-full-normalization
description: feature-dir files received scope+feature keys in W3 but legacy non-base frontmatter keys (date, loop, slug, topic, promoted_from, promoted_at) and staging-only keys were not stripped; bounded normalization pass deferred.
type: backlogs
scope: project
feature: null
status: active
created: 2026-05-25
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [frontmatter, features, normalization, staging-keys, migration]
priority: medium
disposition: open
project-scope: true
---

# Feature-dir frontmatter full normalization (residual from W3)

## Context

Wave 3 (W3 iter2) of the memory-system redesign migration added `scope: feature` and `feature: <slug>` frontmatter to files under the sprint feature dirs (`features/env-var-audit/`, `features/gobbi-orchestration-workflow-improvements/`, `features/session-foundations-bundle-b/`, `features/session-foundations-bundle-c/`). However, those same files still carry OTHER legacy frontmatter keys that do not belong to the base+extension schema defined in `memorization/rules.md` §2.1:

- **Ad-hoc legacy keys**: `date:`, `loop:`, `slug:`, `topic:`, `related:` (bare, non-schema), `title:` (on non-README files).
- **Staging-only keys**: `promoted_from:`, `promoted_at:` — explicitly listed as staging-only in `memorization/rules.md` §2.3 and §5.3 of the design doc; the Final Gate staging-key strip check in `mistakes/` + `learnings/` + `design/` does NOT cover `features/` (W1 cat-C strip was scoped to those dirs only).

The Final Gate suite (`grep -rl 'promoted-from\|promoted-at' mistakes/ learnings/ design/`) explicitly excludes `features/` — so these staging-key leaks in feature-dir files are invisible to the gate.

## Scope of residual

Affected dirs (archived sprint features, now in `archive/features/`):
- `archive/features/env-var-audit/`
- `archive/features/gobbi-orchestration-workflow-improvements/`
- `archive/features/session-foundations-bundle-b/`
- `archive/features/session-foundations-bundle-c/`

Also affected: any files in the live `features/` value-feature dirs that were migrated from these sprints and carried legacy keys forward.

## Why deferred

No home wave in the current session's ratified scope. W3 was bounded to: (a) sprint-to-archive moves, (b) value-feature dir creation, (c) scope+feature key addition. Full frontmatter normalization was a known follow-up explicitly left out of W3 to avoid scope expansion. The Final Gate staging-key check excludes `features/` by design (the session lead confirmed this is the right scope boundary for W1). A separate bounded pass is cleaner.

## Suggested fix

1. Enumerate files under `archive/features/` and `features/` that carry non-base, non-extension keys (use `grep -rn 'promoted_from\|promoted_at\|^date:\|^loop:\|^slug:\|^topic:'`).
2. For each file: strip staging-only keys (`promoted_from`, `promoted_at`), remove ad-hoc keys with no base-schema equivalent, fold any durable provenance into base `session` + `created`.
3. Verify against the `memorization/rules.md` §2.1 base allowlist after normalization.
4. Extend the Final Gate staging-key check to include `features/` and `archive/features/`.

Estimated scope: ~20-40 files; no logic changes required; low risk.

## Originating session

`sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/` — W3 iter2 scope boundary + Final Gate §W5-T3 exclusion note.

---

AI-Provenance-Record: memory-redesign W5-T1, session 2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
