---
name: sync-regenerate-blocked-by-topology-gate-and-agents-prune-gap
description: Two sync-plugin-package.sh gaps a skill rename exposes — the topology gate aborts regenerate on any failure, and .agents/skills prune is check-only
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-25
session: 69314d61-5a03-4ad7-9672-64031832463a
tags: [process, rename-sweep, validation]
keywords: [sync-plugin-package, validate-source-topology, mirror-regenerate, agents-prune, stale-symlink, F-RISK-01]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Close the two sync-tool gaps a skill rename exposes

## Context

From the rename session's T1 finding F-RISK-01: `scripts/sync-plugin-package.sh` has two gaps that a
skill rename (canonical `<oldname>` to `<newname>`) surfaces.

- **(a) Topology gate aborts regenerate on any failure.** `validate_source_topology` runs first
  (script line ~643) and `exit 1`s on ANY topology failure — including the unrelated plugin version
  mismatch — before BOTH the `--check` branch and the regenerate branch. So a rename cannot
  regenerate the mirrors through the sanctioned owner while any topology check fails. This session
  worked around it with a temporary version flip-and-revert to let regenerate run.
- **(b) `.agents/skills` prune is check-only.** Regenerate mode fully prunes stale `.claude/skills`
  dirs (`preflight_/apply_claude_skills_reconciliation`) but only `ensure_link`s
  `.agents/skills/<name>` for each CURRENT canonical skill (line ~688-690); it never prunes a stale
  `.agents/skills/<oldname>` symlink whose canonical skill is gone. Stale `.agents` detection exists
  only in `--check` mode (`check_agents_skill_mirror`, line ~649), not in regenerate. This session
  worked around it with a direct `git rm` of the stale `.agents/skills/orchestration` symlink.

## Why deferred

Hardening the sync tool is outside the rename plus redesign scope. Both gaps had safe, session-local
workarounds (the temp version flip and the direct `git rm`), so the mirror end-state is correct; the
tool gaps remain for a future skill rename to hit again.

## When to pick up

Before the next skill rename, or when hardening `scripts/sync-plugin-package.sh`. Either trigger
would otherwise re-require the same two manual workarounds.

## Suggested approach

- **(a)** Separate the version-equality check from the mirror-regeneration path, or let regenerate
  proceed on a non-fatal topology finding, so a rename can regenerate mirrors through the owner while
  an unrelated topology issue is open.
- **(b)** Extend regenerate to prune a stale `.agents/skills/<oldname>` symlink the same way it
  prunes `.claude/skills`, so `.agents` reaches full set-equality in regenerate mode, not only in
  check mode.
- Add positive and negative fixtures to `scripts/test-sync-plugin-package.sh` for both: a rename that
  regenerates cleanly despite an unrelated topology failure, and a stale `.agents/skills/<oldname>`
  that regenerate prunes.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-24-69314d61-5a03-4ad7-9672-64031832463a/`

## Related

- [[plugin-version-mismatch-blocks-sync-check]] — the unrelated topology failure that gap (a) currently blocks regenerate on
- [[non-dot-skill-artifact-policy]] — another deferred sync-plugin-package.sh source-policy follow-up
