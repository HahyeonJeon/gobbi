---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-P-01
Type: design_flaw
Domain: docs-sync
Disposition: addressed
Confidence: 100
Severity: High
supersedes: null
superseded_by: null
---

# `.claude/CLAUDE.md` Table Rows 61-62 Will Become Dangling Links After Placeholder Reset

## Context

During Ideation iter1, the Claude evaluator (Project perspective) found that `.claude/CLAUDE.md` lines 61-62 contain table rows pointing to `.gobbi/projects/gobbi/design/{v050-overview,v050-cli}.md`. Q-A places `design/` in the PLACEHOLDER list. After the sweep, those two target files will not exist. CLAUDE.md is loaded at every session start and every `/clear` / `/compact`.

## Decision

iter2 H-1 adds a Stage B step to surgically remove those two table rows from `.claude/CLAUDE.md` in the same sweep commit. The two design files are deleted in Stage C via the `design/` placeholder reset. The user opted NOT to expand the survivor set (Q-Survivor: "fix citations, don't expand survivor set").

## Rationale

Two table rows referencing deleted files would break CLAUDE.md's "Navigate deeper from here" table on the first session post-sweep. Iron Law 8 requires implementation changes to be reflected in documentation. Surgical edit is less disruptive than expanding the survivor set.

## Alternatives considered

- (a) Re-scope to include the two design files in the survivor set — rejected per Q-Survivor.
- (b) Accept the breakage with an explicit Scope Contract acknowledgement — rejected; the surgical edit is trivial.

## Consequences

The "Navigate deeper from here" table in CLAUDE.md retains the `gobbi skill`, `claude skill`, and `principles` rows; the two `v050-overview.md` and `v050-cli.md` rows are removed. Future sessions loading CLAUDE.md will not encounter broken links.

## Related

- `ideation/artifacts/scope-contract.md` (Stage B, Success Criterion #12, D10)
- iter1 `evaluation/iter1/claude/project.md` § F-P-01
