---
name: automated-cross-layer-drift-validator
description: Build the automated cross-layer drift validator (issue #258) that catches canonical-vs-mirror and doc-vs-script drift
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: [docs-sync, validation]
keywords: [cross-layer-drift, validator, mirror-sync, issue-258, doc-script-drift]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Automated cross-layer drift validator (#258)

## Context
`git/SKILL.md` already notes (line ~179) that "Cross-layer drift is not yet detected automatically. Until issue #258 lands, every PR that touches multiple layers ... must be hand-reviewed for drift." The seed findings (B/C) are exactly this class: canonical `skills/` vs `.claude/skills/` mirror drift, and doc-referenced script paths that do not resolve in a mirror.

## Why deferred
It is a build task (a new guard/validator), out of scope for a review-only charter-authoring session, and larger than one workflow. It is surfaced here so the charter's seed findings link to the systemic prevention rather than re-discovering it each review.

## When to pick up
After the deep review confirms the drift classes worth automating. A natural pairing with the seed-finding fixes (B/C).

## Suggested approach
Extend the existing guard suite (`orchestration/scripts/check-*.sh`) with a mirror-consistency + doc-script-path-resolution check: assert every `.claude/skills/` mirror carries the canonical's `scripts/` subdirs, and that every script path referenced in a skill doc resolves from each location the doc is read from (canonical, `.claude/` mirror, package symlink).

## Originating session
.gobbi/projects/gobbi/sessions/2026-06-29-40b9a93e-5ec4-43d7-bd16-075b0c7fa303/

## Related

- [[fix-confirmed-seed-findings]] — the manual fixes this validator would protect
