# Evaluation Operation Review Entry

Use this entrypoint to audit one use of [SKILL.md](SKILL.md). The parent owns the complete perspective method, finding schema, checklist semantics, scoring, and report shape. This file supplies only operation-conformance targets and does not restate those contracts.

## Required inputs

- evaluator dispatch, identity, system, assignment, step, iteration, and frozen subject digest;
- complete evidence-input ledger and all artifacts promised by the step entrypoint;
- selected step and operation scenarios plus their source checklists;
- evaluator report JSON, rendered Markdown, validator output, and safe check results;
- worktree diff proving review-only authority; and
- prior subject digest and reports when material revision is in scope.

## Operation-conformance targets

| Review section | Evaluation-operation target |
|---|---|
| Project | The report covers the right complete subject and the agreed review objective. |
| Structure | The required ordered sections, finding fields, checklist rows, machine JSON, and rendered Markdown are complete and unique. |
| Performance | Evidence volume or runtime pressure did not narrow required rigor, and safe verification is proportionate. |
| Aesthetics | Findings, evidence, consequences, and recommendations are plain, exact, and scan-friendly. |
| Usage | The manager and creator can reproduce each issue and act after the user disposition gate without private context. |
| Consistency | Identity, digest, provenance, fingerprints, checklist links, section results, and report verdict agree everywhere. |
| Risk | Independence, read-only authority, uncertainty, invalid-report blocking, and missing-evidence behavior are safe. |
| Overall | Direct evidence supports the integrated conclusion, and a material revision received a complete fresh report. |

## Required operation checks

Run [scenarios.md](scenarios.md) and a fresh filled copy of [checklists.md](checklists.md) in addition to the target step's frame. Recompute finding fingerprints and verdicts. Verify exact section uniqueness, single-system provenance, selected-case coverage, completed checks, and subject digest. Treat any failed operation gate as an invalid evaluator report, even if its substantive conclusions seem correct.

## Rule crosswalk

| Parent rules | Primary operation audit |
|---|---|
| E-1, E-7, E-11 | identity, independence, provenance, and read-only authority |
| E-2, E-4 | complete frozen subject and direct evidence |
| E-3, E-5 | required review coverage and target-specific frame |
| E-6, E-10 | complete visible finding ledger |
| E-8, E-9 | derived verdicts and completed checklist |
| E-12, E-14 | complete fresh repeat without cost-based narrowing |
| E-13 | schema, render, identity, and validator validity |

Every applicable EVAL-CK item appears in the operation audit. This entrypoint evaluates report conformance; it never repairs the evaluator report or the evaluated subject.
