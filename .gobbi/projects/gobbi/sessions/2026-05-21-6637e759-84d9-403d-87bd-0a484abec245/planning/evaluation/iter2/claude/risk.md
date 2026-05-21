# Planning iter2 — Risk perspective (Claude)

## Stage 0 — Artifact summary

Target: iter2 draft Plan. Perspective: what destructive failure modes are not yet bounded?

## Stage 1 — Locked frame

- S-R1 Rollback coverage of `pre-reset-2026-05-21` tag is documented (covers what; does not cover what).
- S-R2 `git branch -D` use is bounded by a pre-authorization citation.
- S-R3 Stage E.2 FS delete is gated against the kept session dir's tree-presence.
- S-R4 Atomic-guard merge `--match-head-commit` is the terminal gate; no retry on failure.
- S-R5 Worktree-remove uses safe (`no --force`) form with status precheck.

## Stage 2 — Findings against iter1 ledger

| iter1 ID | iter1 verdict | iter2 disposition | Confidence | Evidence |
|---|---|---|---|---|
| F-CL-R-01 (`-D` rollback coverage gap, Medium/75) | open | **addressed** | 95 | § Not in scope item 15 (lines 593) explicit: "the `pre-reset-2026-05-21` tag at `487fc35` preserves the develop tip ONLY. The 4 branch tips deleted in Manager §5b … live in the local reflog for ~30-90 days post-deletion; after reflog expiry their tip SHAs are unreachable. This is the accepted irreversibility of Stage F per user lock Q-G." Self-review § 8 mirrors. main.md line 33 mirrors. |
| F-CL-R-02 (E.2 FS delete gated only by `git log`+`git ls-tree`, Medium/50) | open | **partial** | 50 | The gate semantics are unchanged from iter1; F-CL-R-02 was a deferred concern about content-equivalence of bare-UUID vs date-prefixed dir. iter2 did not add a content-equivalence assertion. This is acceptable per the iter3 Q-Gate-Redesign user-lock which explicitly chose the lightweight `ls-tree`-presence gate over SHA-equivalence. |
| F-CL-R-03 (`find -mindepth 1 -type d -empty -delete` order risk, Low/25) | open | **partial** | 40 | Manager §5a line 346 still uses the same find invocation; the order risk is a misread on my part — `-mindepth 1` plus `-empty` makes this idempotent. Acceptable. |
| F-CL-R-04 (Manager-ops "no retry, no rationalization" lacks recovery procedure, Low/25) | open | **partial** | 40 | Lines 380 + 699 say "no retry, no rationalization … responsible role re-contracts with the user". The "re-contract" semantic is the recovery procedure (NEEDS_CONTEXT to user); acceptable. |

**New iter2-only findings:**

### F-CL2-R-01 — Stage F worktree-remove on TWO non-sweep worktrees has no clean-tree precheck

- Type: scenario_gap
- Domain: process / git-discipline
- Disposition: open
- Confidence: 85
- Severity: Medium
- Evidence: Manager §5a (lines 341-348) prescribes:
  ```
  git worktree remove .gobbi/projects/gobbi/worktrees/redesign-v050-ideation         # NO --force
  git worktree remove .gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules  # NO --force
  ```
  `git/SKILL.md` Procedure P5 step 3 (line 198) is explicit: "Before removing the worktree: run `git status` inside it to confirm a clean working tree AND that the branch is merged into base". The two worktrees being removed are NOT the sweep worktree — they predate this session, are not part of the current PR scope, and might contain uncommitted work. The Forbidden Operations row (line 121) on `--force` is the same hazard: removing a worktree with uncommitted changes silently loses work.
- Why it matters: If `redesign-v050-ideation` worktree has pending changes (it's been the session-workdir for v0.5.0 redesign work), the `git worktree remove` will FAIL without `--force` (which is correctly forbidden). The Plan does not say what the manager does next — does it commit, discard, or NEEDS_CONTEXT? Under pressure to complete the cleanup, the manager might reach for `--force` despite the "NO --force" annotation. The hazard is real; the safeguard is paper-thin.
- Suggested direction: prepend each worktree-remove with `cd <worktree-path> && git status --porcelain`; if non-empty → NEEDS_CONTEXT to user with options [commit, discard, skip-remove]. This mirrors `git/SKILL.md` Failure Modes table line 236.

### F-CL2-R-02 — Manager §5b force-delete of `redesign/v050-ideation` while its worktree (§5a) might still exist

- Type: scenario_gap
- Domain: process / ordering
- Disposition: open
- Confidence: 70
- Severity: Medium
- Evidence:
  - Manager §5a removes the two stale worktrees.
  - Manager §5b force-deletes the branches.
  - Order: §5a runs before §5b (correct order — branches with worktrees attached can't be deleted).
  - BUT: if §5a fails on the `redesign-v050-ideation` worktree (per F-CL2-R-01's unclean-tree scenario), §5b's `git branch -D redesign/v050-ideation` will ALSO fail ("branch is checked out at <path>"). The Plan does not enumerate this conditional failure mode.
- Why it matters: The two stale worktrees + their branches are correlated: failure of §5a propagates to §5b. The Plan treats §5a and §5b as if they're independent steps, but they're linked.
- Suggested direction: add an explicit ordering invariant: "§5b is conditional on §5a returning success for the corresponding worktree; if §5a fails on a worktree, do NOT proceed to §5b for that branch — NEEDS_CONTEXT instead".

### F-CL2-R-03 — Tag `-a` form (line 448) without `-m` hangs sonnet executor on editor prompt

- Type: design_flaw
- Domain: process / git-discipline
- Disposition: open
- Confidence: 95
- Severity: Medium
- Evidence: Line 448 (Task 01 Special discipline cell): "The executor stops at `git tag -a pre-reset-2026-05-21 487fc35`" — `-a` is annotated tag form; without `-m "<msg>"` git opens `$EDITOR`. A headless sonnet executor will hang or error.
- Why it matters: This is a NEW iter2 regression introduced by the Fix-1 rewrite of the Special-discipline cell. Same defect surfaced under different lenses by Project (F-CL2-P-01), Aesthetics (F-CL2-A-02), Consistency (F-CL2-C-01). Risk perspective views it as an EXECUTION HAZARD — the executor doesn't merely "fail consistency check"; it gets stuck on a shell prompt.

## Stage 3 — Risk verdict

iter1 Risk findings: 1 Medium addressed (F-CL-R-01), 3 deferred-with-explanation (F-CL-R-02, -03, -04). All defensible.

NEW iter2 Risk findings: 3 Medium-severity hazards introduced by the Fix-1 rewrite. F-CL2-R-01 (worktree-remove precheck gap) and F-CL2-R-03 (tag -a hangs executor) are both Medium/85-95. F-CL2-R-02 (ordering between §5a and §5b conditional failures) is Medium/70.

Verdict thresholds: 3 Medium-severity findings, none High, none Critical. Per the threshold spec (High ≥ 50 → REVISE), no individual finding crosses High. BUT the convergent signal (3 perspectives — Project, Consistency, Risk — all flag the tag-form issue) means the issue meets the spirit of "must-fix before Execution". Conservative call: **REVISE** for risk hardening of the iter2-introduced regressions.

Verdict: **REVISE** (driven by the convergent F-CL2-R-03 tag-form defect + F-CL2-R-01 worktree-remove precheck gap, both introduced by the Fix-1 rewrite itself)

## Must-preserve list

- § Not in scope item 15 rollback-coverage explainer.
- D-PLAN-04 Stage E.2 ownership analysis (executor gate is two read-only invocations + FS rm).
- Manager §9 atomic-guard merge `--match-head-commit "$HEAD_SHA"` shape.
- Manager §10 develop sync sequence.

```
STATUS: DONE
VERDICT: REVISE
```
