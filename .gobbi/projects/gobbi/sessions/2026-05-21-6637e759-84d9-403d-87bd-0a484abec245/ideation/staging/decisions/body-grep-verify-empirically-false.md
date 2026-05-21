---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-U3-02
Type: design_flaw
Domain: process
Disposition: addressed
Confidence: 100
Severity: High
supersedes: null
superseded_by: null
---

# Stage G Post-Merge Verification Relies on Body-Grep That Does Not Match This Repo's Squash-Merge Style

## Context

iter3 Claude evaluator (Usage perspective) found that D11 Option A/B required `grep -F "$HEAD_SHA"` against the squash-merge commit body to verify the merged commit corresponded to the reviewed PR head. The evaluator ran `git log -1 --format=%B 487fc35 | grep -oE '[a-f0-9]{7,}'` against this repo's most recent squash-merged PR (#262) and found only session-id UUIDs, not source-commit SHAs. Five recent squash-merges (487fc35, 228fbdc, adae51e, f3769cc, cd9eb86) all confirmed: GitHub's squash-merge on this repo produces commit bodies with only commit subjects and `Closes #N` trailers — no source-SHA trailer block. The D11 claim "GitHub's default squash-merge commit body includes the source commit short-SHAs" is empirically false for this repo.

## Decision

Addressed by iter4 Q-iter4-Override. The body-grep verify step is completely removed. Stage G is replaced with `gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"`. The `--match-head-commit` flag performs server-side atomic head-match at merge transaction time. The I11 Research Insight is rewritten to retract the iter3 empirical claim and document the iter4 mechanism's basis.

## Rationale

The false-alarm nature of the body-grep verify was itself a meta-risk: an executor encountering NEEDS_CONTEXT on every happy-path merge learns to bypass the gate, exactly the failure mode documented in `executor-rationalized-failing-verification-gate.md`. The iter4 fix is strictly better — it not only removes the false alarm but provides stronger protection (atomic, race-free).

## Consequences

D11, I11, D2 #20, Success #14, S6b, Critical Invariant #7 all now describe the atomic-guard mechanism. The old body-grep mechanism is preserved in D11's historical preamble as an explicit "what we tried and why it failed" narrative (Iron Law 10 witness).

## Related

- `ideation/staging/decisions/merge-head-stability.md` (F-CX-OV-02, the parent finding)
- `ideation/artifacts/implementation-checklist.md` § Stage G
- `ideation/artifacts/design-direction.md` § D11
- iter3 `evaluation/iter3/claude/usage.md` § F-U3-02
