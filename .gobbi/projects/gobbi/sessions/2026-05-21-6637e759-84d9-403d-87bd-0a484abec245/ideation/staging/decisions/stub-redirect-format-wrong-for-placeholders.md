---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-U-02
Type: assumption_risk
Domain: docs-sync
Disposition: addressed
Confidence: 75
Severity: Low
supersedes: null
superseded_by: null
---

# `stub-redirect-format.md` Does Not Cover Placeholder Stubs

## Context

iter1 Claude evaluator (Usage perspective) found that the artifact cited `rules/stub-redirect-format.md` as the authority for placeholder stub formatting. That rule file covers supersession stubs (where a file's content has moved) — not placeholder stubs (where content is wiped and the dir is kept as an empty seat).

## Decision

D4 now uses an inline stub template rather than citing `stub-redirect-format.md`. The inline template is the authoritative shape for placeholder stubs.

A deferred follow-up notes: extend `rules/stub-redirect-format.md` with "Variant C — placeholder stub after content wipe." This is a follow-on task in a later session; the `rules/` dir is in the survivor set (Q-A) so the edit can happen any time.

## Consequences

D4 inline template is the canonical reference. Planning inherits this and should not look for a template in `stub-redirect-format.md` for placeholder stubs.

## Related

- `ideation/artifacts/design-direction.md` § D4
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md` (to be extended in a later session)
- iter1 `evaluation/iter1/claude/usage.md` § F-U-02
