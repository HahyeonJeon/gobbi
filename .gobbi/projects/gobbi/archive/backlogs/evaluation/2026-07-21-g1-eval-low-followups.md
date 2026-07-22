---
name: g1-eval-low-followups
description: "3 Low-severity doc-tightening follow-ups from the G1 dual-system Execution evaluation (non-blocking; shipped as-is)."
type: backlogs
scope: project
feature: null
status: closed
archived_at: 2026-07-21
archive_reason: addressed
created: 2026-06-30
session: 0dc5cf75-54c5-4b52-82fa-b18750bdaade
tags: [evaluation, process]
keywords: [deployment, docs, g1, low-followups]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# G1 Execution-eval — 3 Low follow-ups (non-blocking)

From the dual-system Execution evaluation of G1 (session 0dc5cf75). All Low; G1 shipped with them open.

- **F1 (assumption_risk / tooling):** `sync-plugin-package.sh agent_exposed_files()` operationalizes "exclude generated/cache" as "exclude dot-prefixed". A future NON-dot build artifact in a skill dir would be over-mirrored. No impact today (0 non-md/json/sh files). → note the dotfile assumption in the script comment, or add an extension whitelist if non-dot generated files appear.
- **F2 (general / process):** the additive build does NOT auto-prune a stale mirror leaf when a canonical child is removed — only `--check` flags it (manual `git rm`). Matches existing `.agents`/`plugins` behavior (consistent). → optionally emit the exact `git rm` for stale leaves, or document the manual-prune in `skill-writing` P5.
- **F3 (general / docs-sync):** `validate-plugin-hooks-fire-once.sh` header overstates auto-coverage — a future event is auto-covered for allow-listing + assert-if-present but NOT strict fire-once (the `OPERATOR_TRIGGERED_EVENTS` subset stays fixed). → tighten the comment to "auto-covered for allow-listing + assert-if-present; strict fire-once stays the operator-triggered subset".

## Also surfaced (already fixed in G1, recorded for the record)
- The fire-once validator was **non-runnable at baseline** (`printf '--- …'` crashed under `set -euo pipefail`) — a pre-existing bug the review campaign missed; fixed in commit 9c84d5ff. Lesson: a "validator" the review never RAN can hide a crash; run guards, don't just read them.
