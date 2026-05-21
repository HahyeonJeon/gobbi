---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
feature: repo-reset
topic: iter4-max-iterations-override
rounds: [6]
locks: ["Q-iter4-Override"]
---

# Q-iter4-Override: maxIterations Override to Fix Stage G Atomic Guard (iter4)

## Discussion Summary

**Background (Round 6)**

iter3 dual-system evaluation produced a split: Claude REVISE, Codex PASS. Claude ran empirical verification: `git log -1 --format=%B 487fc35 | grep -oE '[a-f0-9]{40}'` against this repo's last 5 squash-merged PRs and confirmed NONE produced source-SHA trailers in the commit body. D11's body-grep verify step (F-U3-02 / F-C3-01 / F-C3-02 / F-R3-01) was empirically false and would fire NEEDS_CONTEXT on every happy-path merge.

Under the pessimistic-union rule, Claude REVISE wins — aggregate iter3 = REVISE. At iter3 of `maxIterations=3` the strict spec says abort and escalate.

Codex iter3 simultaneously prescribed the fix: `gh pr merge <num> --squash --delete-branch --match-head-commit "$HEAD_SHA"`. The `--match-head-commit` flag enforces head-match atomically at merge transaction time. Manager verified: `gh pr merge --help` on the local machine documents the flag at the same level as `--squash`/`--merge`/`--rebase`.

**Q-iter4-Override — How to dispose of iter3 (Round 6)**

Manager surfaced the split verdict and the Codex-prescribed fix. Offered options: (A) abort with the iter3 REVISE artifacts; (B) authorize iter4 with the surgical `--match-head-commit` fix. User chose: authorize iter4 (recommended).

Decision: Override `workflow.ideation.maxIterations` from 3 to 4 in `session.json`. iter4 applies a surgical fix to Stage G + D11 + D2:
- Replace iter3's body-grep post-merge verify with `--match-head-commit "$HEAD_SHA"` flag on the `gh pr merge` invocation.
- D11 rewritten to document the atomic-guard semantics and include the historical preamble (iter3 mechanism + Claude REVISE evidence + Codex prescription).
- D2 verifications #20/#21 collapsed to single gate: verify `gh pr merge` exit code 0.
- Preserve all other iter3 content verbatim.

## Locked Decision

| Lock | Decision |
|------|----------|
| Q-iter4-Override | Override maxIterations to 4; apply `--match-head-commit "$HEAD_SHA"` surgical fix |

## Significance

This is the dual-system anti-groupthink payoff fully realized: Claude found the empirical refutation (5 git log checks); Codex found the fix (`--match-head-commit`). Neither system alone would have reached the correct conclusion — Claude REVISE without a concrete fix, Codex PASS with the prescription but without empirical verification of the old mechanism.

## Related

- `ideation/staging/decisions/merge-head-stability.md` (F-CX-OV-02)
- `ideation/staging/decisions/body-grep-verify-empirically-false.md` (F-U3-02)
- `ideation/staging/decisions/false-alarm-gate-trains-bypass.md` (F-R3-01)
- `ideation/artifacts/cross-system-divergence.md` (full dual-system divergence log)
- `ideation/rawdata/discussion-log.md` § Round 6
