# Ideation iter3 — Usage (claude)

## Stage 0 Artifact Summary

iter3 rewrites the Stage E.2 gate to two deterministic `git` pre-conditions, and adds Stage G `HEAD_SHA` capture+verify around `gh pr merge`. Executor-facing concreteness improves for E.2; for Stage G the situation is more complex.

## Stage 1 Locked Frame (Usage)

- S-U1: Every executor step is concrete and testable.
- S-U2 (adversarial): Verification gates produce binary pass/fail outcomes; failure paths are non-rationalizable.
- S-U3 (adversarial): Stage G verify step's expected behavior matches actual `gh pr merge --squash` behavior on this repo.

## Inherited Findings Dispositions

| ID | iter2 verdict | iter3 disposition | Evidence |
|---|---|---|---|
| F-U-01 (bare-UUID gate ambiguity) | addressed | **addressed (re-fixed at iter3)** | Stage E.2 gate at lines 318-323 — non-circular `git log` + `git ls-tree` pre-conditions. |
| F-U-02 (stub-redirect rule mis-cite) | addressed | **addressed (preserved)** | D4 inline template |
| F-U-03 (SHA gate session.json divergence) | open Medium/50 | **superseded** | session.json mutation removed entirely by Q-Gate-Redesign |
| F-U-04 (E.2 ownership for Planning) | open Low | **open** | not addressed at iter3 |

## Stage 2 Findings (Usage)

### F-U3-01 — Stage E.2 gate is now non-rationalizable and executor-actionable

- **Type**: general
- **Domain**: process
- **Disposition**: addressed (no finding)
- **Confidence**: 100
- **Severity**: n/a
- **Evidence**: Lines 318-326. Two binary git checks; explicit NEEDS_CONTEXT on failure citing `executor-rationalized-failing-verification-gate.md`. The gate output is the exact `git` command output, so the executor cannot "match an adjacent SHA" — there is no SHA to match.

### F-U3-02 — Stage G post-merge verification (D11) relies on a `gh pr merge --squash` behavior that this repo's history shows does NOT occur

- **Type**: design_flaw
- **Domain**: process
- **Disposition**: open
- **Confidence**: 100
- **Severity**: High
- **Evidence**: 
  - iter3 line 486-487 (D11 Option A): "GitHub's default squash-merge commit body includes the source commit short-SHAs in a trailer block ('* <short-sha> <commit-subject>'); `grep -F "$HEAD_SHA"` against `--format=%B` matches when the head SHA is present (full or short)."
  - iter3 line 488 (D11 Option B): "match `${HEAD_SHA:0:7}` (first 7 chars) against the merge commit body, which GitHub's squash trailer always includes."
  - **Empirical refutation**: I ran `git log -1 --format=%B 487fc35 | grep -oE '[a-f0-9]{7,}' | sort -u` against this repo's most recent squash-merged PR (#262). Output: only `c676684d` and `10855c60a42a` — both from the `AI-Provenance-Record` session-id, NOT a source-commit SHA. Full `git log -1 --format=%B 487fc35 | grep -oE '[a-f0-9]{40}'` returns empty.
  - Other recent squashes (228fbdc, adae51e, f3769cc) similarly contain only commit subjects/bodies, no source-SHA trailer.
- **Why-it-matters**: Iter3's Stage G "verify" step (lines 348-350) will return NO MATCH on EVERY happy-path merge in this repo. The executor will then hit "NEEDS_CONTEXT — the merged commit may not correspond to the reviewed tip" on every single sweep, including the perfectly-fine case where no force-push happened. This makes the gate a false-alarm machine, which violates the `executor-rationalized-failing-verification-gate.md` discipline by *forcing* rationalization at the manager level: the manager will inevitably waive the check after the first false alarm, defeating the purpose.
- **Suggested direction**: Replace Option A/B grep-based verification with the more reliable `gh pr view <pr-num> --json mergeCommit -q .mergeCommit.oid` (which DOES exist) compared against `git rev-parse develop` post-pull. The actual safety check is "did the PR's mergeCommit field get populated and does it match the develop tip?" The HEAD_SHA capture is still useful for the audit log, but the post-merge "body grep" verification is empirically unsupported on this repo's squash-merge style.

### F-U3-03 — D11 Option A's "(after `git pull origin develop`)" parenthetical is operationally significant but tucked inline

- **Type**: general
- **Domain**: process
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: Line 486 buries the `git pull origin develop` requirement mid-sentence. An executor running the verify step from the sweep branch's worktree may not have the merge commit locally and would get `unknown revision <merge-sha>`.

## Karpathy Failure Modes (Usage lens)

- **Wrong assumptions**: YES (carried into iter3 via D11). iter3 corrects iter2's self-reference wrong-assumption only to introduce a different wrong-assumption about GitHub squash-merge body format. The gate triggers NEEDS_CONTEXT in the happy path on this repo.
- **Overcomplexity**: NO.
- **Orthogonal edits**: NO.
- **Imperative-over-declarative**: NO.

## Must-Preserve list (Usage lens)

1. Stage E.2's non-circular two-pre-condition gate (lines 318-323).
2. NEEDS_CONTEXT discipline on gate failure.
3. The HEAD_SHA capture step (lines 344-345) — it's cheap and useful for the audit log even if the body-grep verify is unreliable.
4. The Audit traceability note at line 326 (sweep SHA recoverable via `git log`).

## Verdict

**REVISE**.

Driver: F-U3-02 — High/100. The D11 post-merge verify mechanism is empirically defective: `gh pr merge --squash` on this repo (4 recent merges checked) produces commit bodies that do NOT contain the source SHA. The "fallback Option B" claim that GitHub's squash trailer "always includes" the short-SHA is also empirically refuted. As a result, Stage G's verify step will fire NEEDS_CONTEXT on every happy-path merge, training the manager to ignore the check — which is itself the failure mode `executor-rationalized-failing-verification-gate.md` warns against.
