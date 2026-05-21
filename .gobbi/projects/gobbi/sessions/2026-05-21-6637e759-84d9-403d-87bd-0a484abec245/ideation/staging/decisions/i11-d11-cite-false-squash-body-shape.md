---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-C3-01
Type: assumption_risk
Domain: process
Disposition: addressed
Confidence: 100
Severity: High
supersedes: null
superseded_by: null
---

# I11 Research Insight and D11 Design Decision Cite Empirically Incorrect Squash-Merge Body Format

## Context

iter3 Claude evaluator (Consistency perspective) found that D11's design and I11's research insight both stated "GitHub's default squash-merge commit body includes the source commit short-SHAs in a trailer block." The evaluator verified against this repo's last 5 squash-merged PRs (487fc35, 228fbdc, adae51e, f3769cc, cd9eb86) — none contain source-SHA trailers. This creates internal consistency breakage: D11 asserts a behavior, I11 cites it as observed, but the repo's actual history refutes it.

## Decision

Addressed by iter4. I11 is rewritten to explicitly retract the iter3 empirical claim and state the iter4 mechanism's basis (`gh pr merge --help` documenting `--match-head-commit`). D11 is rewritten with a historical preamble (what iter3 claimed, why it failed empirically) followed by the iter4 atomic-guard mechanism. The internal consistency is restored: I11 and D11 now describe the mechanism that actually works.

## Related

- `ideation/staging/decisions/body-grep-verify-empirically-false.md` (F-U3-02, same root)
- `ideation/staging/decisions/merge-head-stability.md` (F-CX-OV-02, parent)
- iter3 `evaluation/iter3/claude/consistency.md` § F-C3-01
