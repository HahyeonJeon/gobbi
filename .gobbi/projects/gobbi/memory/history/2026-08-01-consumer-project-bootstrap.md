# Consumer project bootstrap defined and shipped

**Completed at:** 2026-08-01T15:05:03Z

## Changes

- Defined the canonical `.gobbi/` layout for a consumer project inline in `gobbi/SKILL.md` Procedure Step
  1.1, closing a gap where Gobbi v1.0.0 never created `.gobbi/` in a fresh consumer project after the v0.5.0
  bootstrap CLI was deleted and no skill replaced it.
- Added a one-user-approved bootstrap commit to `git`, `cowork`, and `workflow`, resolving the ordering
  paradox between requiring the layout to exist and capturing it as the session's immutable base.
- Reduced the consumer repository's root `.gitignore` to `node_modules/` and `.claude/.env`, moved the Codex
  smoke-test scratch directory to an OS temp location, and fixed `.gobbi/.gitignore` to two correctly
  anchored patterns.
- Verified the fix end to end in a throwaway consumer repository (10 of 10 cases, twice) and swept every
  skill, agent, and root document for broken links, plugin drift, and stale references to retired v0.5.0
  state; none found. Full record:
  [`reports/analysis/2026-08-01-consumer-project-bootstrap-gap.md`](../reports/analysis/2026-08-01-consumer-project-bootstrap-gap.md).
- No independent dual-system evaluation ran over this change; see the report's Limits section.
