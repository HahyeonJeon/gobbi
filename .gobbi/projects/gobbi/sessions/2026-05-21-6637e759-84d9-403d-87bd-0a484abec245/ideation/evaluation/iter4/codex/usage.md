# Ideation iter4 — Usage perspective (codex)

## Stage 0 Artifact Summary

The users are the Planning loop, the Execution agent, and future maintainers reading why the destructive reset happened. The primary usage question is whether a tired executor can run Stage G without interpreting a failing gate, and whether all non-zero guarded-merge outcomes are handled as NEEDS_CONTEXT.

Memory reads: `draft-iter4.md`, iter3 codex `usage.md`, iter3 claude `usage.md`, `.gobbi/projects/gobbi/mistakes/executor-rationalized-failing-verification-gate.md`, local `gh pr merge --help`, GitHub CLI manual, and GitHub REST merge docs.

## Locked Frame (Stage 1)

- Scenario U1: The executor can run the atomic merge guard literally.
  - Checklist: command is copyable; `HEAD_SHA` variable is captured immediately before use; success is exit code 0.
- Scenario U2: Failure handling is non-rationalizable.
  - Checklist: any non-zero `gh pr merge` exit returns NEEDS_CONTEXT; report includes old head, current head, and stderr; no retry.
- Scenario U3: The guard works for squash merge.
  - Checklist: CLI exposes `--squash` and `--match-head-commit`; REST API accepts `sha` and `merge_method: squash`; mismatch produces a documented conflict.
- Scenario U4 (adversarial): A non-head API/auth error is misdiagnosed as a head move.
  - Checklist: artifact asks the executor to report stderr and current head so the manager can distinguish causes.
- Scenario U5: Consumer-facing audit trail remains sufficient.
  - Checklist: captured `HEAD_SHA` is logged to session log and Wrap-up handoff, but not treated as post-merge proof.

## Stage 2 Findings

No new usage finding. Stage G is executor-actionable: capture at `draft-iter4.md:353-355`, guarded merge at `draft-iter4.md:356`, failure report at `draft-iter4.md:358`, and D11 repeats the same non-zero handling at `draft-iter4.md:499-500`. GitHub REST docs specify `sha` as the PR-head match parameter, permit `merge_method` values including `squash`, and document 409 Conflict when the provided SHA does not match the PR head.

## Stage 2 Step 3 — Disposition Of Every Iter3 Inherited Finding

- F-CX-U-03: addressed, Confidence 100, Severity Medium. The executor now has the stronger available head guard at `draft-iter4.md:356`.
- F-CX-U-01: addressed, Confidence 100, Severity High. E.2 still uses branch/tree checks, not session JSON mutation.
- F-CX-U-02: addressed enough for PASS, Confidence 75, Severity Low. "Terminal" still means terminal for the bare-UUID runtime dir; later writes route to the date-prefixed dir at `draft-iter4.md:335`.
- F-CX-OV-02: addressed, Confidence 100, Severity Medium. The race is guarded before merge.
- Claude F-U3-02: addressed, Confidence 100, Severity High. The empirically false body-grep mechanism is removed from live Stage G.
- Claude F-U3-03: addressed, Confidence 75, Severity Low. The old D11 parenthetical/gittip verify procedure is gone; local update is now a post-merge cleanup step at `draft-iter4.md:360`.

## Per-perspective Verdict

PASS. No Critical>=75 or High>=50 usage finding.

## Must-Preserve

- Preserve NEEDS_CONTEXT for every non-zero guarded merge exit.
- Preserve logging of captured `HEAD_SHA` for audit without treating logs as enforcement.
- Preserve executor report requirements: old head, current head, and `gh pr merge` stderr.
- Preserve the date-prefixed write route after E.2.

