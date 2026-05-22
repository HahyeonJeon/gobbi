---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-OV-01
Type: assumption_risk
Domain: process
Disposition: addressed
Confidence: 75
Severity: High
supersedes: null
superseded_by: null
---

# Staged Backlog Promotion Target Is in the Delete Set

## Context

iter1 Claude evaluator (Overall/Stage 3) found that the staged backlog at `staging/backlogs/project/cli-regenerates-gobbi-gitignore.md` would be promoted by Wrap-up to `.gobbi/projects/gobbi/backlogs/` — which Q-A places in the PLACEHOLDER list. After Stage C's sweep, `backlogs/` is an empty dir with a README. Either Wrap-up runs before the sweep (but then the backlog lands in the dir the sweep wipes) or after (the PR has already merged and the backlog wasn't preserved).

## Decision

H-4 user-accepted resolution: the backlog is session-scoped. It stays in the session's staging dir (`ideation/staging/backlogs/project/cli-regenerates-gobbi-gitignore.md`), which is in the survivor set (current date-prefixed session dir is kept). The rebuild session reads the backlog item from session staging directly. Wrap-up promotion to `.gobbi/projects/gobbi/backlogs/` is SKIPPED this session.

## Rationale

The current session dir is in the Q-A survivor set. The staged backlog file is therefore safe. The rebuild session will re-assess the CLI regenerator risk and decide whether to file it in the new `backlogs/` directory. No information is lost — the backlog item persists in session staging.

## Consequences

Wrap-up for this session does NOT promote the staged backlog to project memory. The rebuild session is responsible for evaluating and re-filing the CLI regenerator backlog item.

## Related

- `ideation/staging/backlogs/project/cli-regenerates-gobbi-gitignore.md` (the surviving staged item)
- `ideation/artifacts/design-direction.md` § D8 (CLI regenerator deferred follow-up)
- iter1 `evaluation/iter1/claude/overall.md` § F-OV-01
