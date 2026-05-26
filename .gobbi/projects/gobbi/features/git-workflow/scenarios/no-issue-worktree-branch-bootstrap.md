---
scenario: Non-feature (no issue/task slug) session boots worktree on chore/session-* branch
category: edge-case
scope: feature
feature: git-workflow
added: 2026-05-23
added_by_session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: covered
finding-id: COD-PROJ-002
type: scenario_gap
domain: process
disposition: addressed
confidence: 100
severity: Medium
---

# Non-feature session: no issue/task slug dependency at row 5.5

## Situation

A session that is not associated with a GitHub issue or a task slug (e.g., investigation, mistake-promotion, doc-lookup, or refactor-only session) boots via `/gobbi`. Configuration Step 1 reaches row 5.5 and must create a worktree. Under the prior iter2 branch name `session/{date}-{ssid-short}`, the branch type `session/` is not in the `git/conventions.md:22` registry. The current iter3 locked form `chore/session-{date}-{ssid-short}` uses `chore` which does not require an issue number.

## Inputs

- Session started with `/gobbi` without a linked issue or task
- `session.json.git.issue` is null
- Row 5.5 is reached

## Expected behavior

Row 5.5 creates a worktree on branch `chore/session-{date}-{ssid-short}` (e.g., `chore/session-2026-05-23-1b26cf20`). No issue number prefix is expected or required. The branch name satisfies the `git/conventions.md:22` regex for `chore/` type and the slug `session-...` satisfies the 3-50 char length constraint.

## Verification

Post-merge smoke test: `jq '.git.branch' session.json` matches `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$`.

## Related

- `evaluation/iter1/codex/project.md` COD-PROJ-002
- `evaluation/iter3/codex/project.md` COD-PROJ-002
- `rawdata/draft-iter3.md` E-2 scenario (line 227)
- D-1 in draft-iter3.md (line 308-313)
