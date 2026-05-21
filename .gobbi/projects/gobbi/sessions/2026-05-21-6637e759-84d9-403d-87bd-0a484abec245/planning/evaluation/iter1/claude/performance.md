# Planning iter1 — Performance perspective (Claude)

## Artifact Summary + Memory reads (Stage 0)

**Target**: Plan's performance commitments + plan-execution scalability + perf-sensitive verifications.

**Memory reads**: `principles`, `skills/planning/evaluation.md` § Performance, Scope Contract success criteria (no perf budget called out).

## Locked Frame (Stage 1)

Scenarios:
1. Tasks touching perf-sensitive paths have benchmark-based verification.
2. IO / network calls name retry / timeout / caching policy.
3. The plan does not bundle a perf-regression-risk task with unrelated changes.
4. (Adversarial) Reasonable-looking task hides an N+1 in its verification setup.

## Per-scenario per-check results

**S1 — perf-sensitive paths**
Scope Contract lists no perf budgets. The work is destructive cleanup (deletes, gitignore edits, stub README writes, 1 surgical 2-line edit). No code execution paths are modified — `packages/` is deleted wholesale. No CI runtime is benchmarked. N/A.

**S2 — IO / network policy**
Plan calls `gh pr checks <pr-num> --watch` (Manager-ops §7) and `gh pr merge --match-head-commit "$HEAD_SHA"` (§8) and `git push -u origin <sweep-branch>` (§5). All are bounded, single-shot invocations with documented failure modes (§7: "if checks fail, no merge"; §8: "non-zero exit → no retry, no rationalization"). The `gh pr checks --watch` is the only long-running call; it has no timeout cap declared. ACCEPTABLE under solo-user / CI-driven semantics (the user can ^C if it stalls).

**S3 — bundling perf with unrelated changes**
Task 02 is the bundled mega-task by user-lock. No perf-specific gate is bundled inside it (none exist). N/A.

**S4 — N+1 hidden in verification setup**
Stage E.1's `find … -print0 | xargs -0 rm -rf` (52 dir candidates, screened by name predicate). Single-pass, no N+1. Stage C's per-subdir `git rm -r <subdir>/* + rm -rf <subdir>/* + write README + git add` runs 13 times — predictable linear pass with bounded constants. No N+1. PASS.

## Typed findings

### F-CL-PF-01 — `gh pr checks --watch` has no declared timeout / poll interval
- **Type**: assumption_risk
- **Domain**: process
- **Disposition**: open
- **Confidence**: 25
- **Severity**: Low
- **Evidence**: Manager-ops §7 (draft-iter1.md line 327): "`gh pr checks <pr-num> --watch`. If checks fail, no merge; investigate." No timeout cap, no policy on what to do if `--watch` stalls (e.g., CI rate-limit, network hiccup, GitHub status incident).
- **Why it matters**: Manager-ops has no graceful fallback if `--watch` never returns. The Plan implicitly relies on `gh` exiting eventually. For a destructive single-PR sweep, this is acceptable; flagging as Low.
- **Suggested direction**: Add a one-line "If `gh pr checks --watch` stalls > 30 min, escalate to user via AskUserQuestion before retrying" rider in Manager-ops §7. Not a blocker.

## Low-confidence appendix

- Stage E.1's xargs pass is FS-bound (52 dirs, ~few MB each). Wall-clock probably <5s. No perf concern.
- Stage C's 13-subdir loop: 13 × 4 ops = 52 git/FS calls. Fast. No concern.

## Must-preserve list

- The single-PR atomic-guard merge is the perf-correct primitive (no multi-roundtrip merge dance).
- Bounded single-shot `gh` invocations (no polling loops within executor scope).

## Verdict: PASS

No perf gate is violated; no benchmark commitment is silently dropped (none exist). F-CL-PF-01 is Low/25 — informational only.
