# Ideation iter4 — Overall (codex)

## Stage 0 Artifact Summary

Iter4 is the user-authorized fourth Ideation iteration for the gobbi destructive reset, created solely to repair F-CX-OV-02 after iter3 dual-system convergence. It preserves the reset scope and all 19 locks, keeps the iter3 F-CX-OV-01 non-circular E.2 gate intact, and replaces iter3's empirically false squash-body verification with `gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"` after immediately capturing `HEAD_SHA`.

Memory reads: all seven iter4 perspective passes above; `draft-iter4.md`; `draft-iter3.md`; `discussion-log.md`; `settings.json`; iter3 codex `{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`; iter3 claude `overall.md` and `usage.md`; `.gobbi/projects/gobbi/mistakes/executor-rationalized-failing-verification-gate.md`; local `gh pr merge --help` / `gh --version`; GitHub CLI manual; GitHub REST merge endpoint docs.

## Locked Frame (Stage 1)

- Scenario O1: Primary F-CX-OV-02 fix is complete.
  - Checklist: pre-merge `HEAD_SHA` capture preserved; merge command includes `--match-head-commit "$HEAD_SHA"`; body-grep success gate deleted; D11 no longer claims squash bodies contain source SHAs; D2 #20/#21 collapse to one guarded-merge exit-code check.
- Scenario O2: Secondary F-CX-OV-01 fix remains intact.
  - Checklist: Stage E.2 still uses `git log` + `git ls-tree`; no tracked file stores the sweep SHA; NEEDS_CONTEXT on failure remains.
- Scenario O3: All 19 locks and settings override are traceable.
  - Checklist: discussion-log Round 6 authorizes iter4; `settings.json` has `maxIterations: 4` plus reason; Scope Contract lists Q-iter4-Override.
- Scenario O4 (adversarial): `--match-head-commit` only works for merge commits, not squash.
  - Checklist: local CLI exposes both `--match-head-commit` and `--squash`; REST docs bind `sha` to the merge endpoint and allow `merge_method: squash`.
- Scenario O5 (adversarial): A moved head or other merge error is rationalized.
  - Checklist: any non-zero guarded merge returns NEEDS_CONTEXT; executor reports old head/current head/stderr; no retry.
- Scenario O6 (adversarial): The surgical fix introduces cleanup/process regression elsewhere.
  - Checklist: worktree/branch ordering remains correct; no new scope surface; local cleanup assumptions are checked against `gh` help.

## Stage 2 Findings

### F-CX-O4-01 — `--delete-branch` local cleanup wording mismatch is a non-blocking process risk

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence with line numbers**: Local `gh pr merge --help` says `--delete-branch` deletes the local and remote branch after merge. Iter4 says it handles "remote only" at `draft-iter4.md:360`, with similar assumptions at `draft-iter4.md:64` and `draft-iter4.md:78`, and then asks for `git branch -d <sweep-branch>` after merge at `draft-iter4.md:360`.
- **Why-it-matters**: The explicit local delete may fail if the branch is already gone, creating a cleanup false alarm after a successful merge. This is not a regression introduced by `--match-head-commit`, does not weaken head-match protection, and is below the REVISE threshold, but Planning/Execution should normalize the cleanup command to the actual local `gh` behavior.

## Stage 2 Step 3 — Disposition Of Every Iter3 Inherited Finding

- F-CX-OV-01: addressed, Confidence 100, Severity High. Stage E.2 is still non-circular at `draft-iter4.md:328-336` and D9 at `draft-iter4.md:471-480`.
- F-CX-OV-02: addressed, Confidence 100, Severity Medium. Stage G uses `--match-head-commit "$HEAD_SHA"` at `draft-iter4.md:356`, D2 #20 verifies the guarded exit code at `draft-iter4.md:411-413`, and D11 is rewritten at `draft-iter4.md:490-504`.
- F-CX-S-03 / F-CX-U-03 / F-CX-C-03 / F-CX-R-04: addressed, Confidence 100, Severity Medium. The same atomic merge-time guard replaces post-hoc body grep in Structure, Usage, Consistency, and Risk.
- F-CX-A-01: addressed, Confidence 100, Severity Low. Overclaimed proof language is gone from live instructions.
- F-CX-C-04: addressed, Confidence 75, Severity Low. Detailed Stage G order is correct; D1 abbreviates but no longer states capture before PR open.
- F-CX-S-01 / F-CX-U-01 / F-CX-C-01 / F-CX-R-01: addressed, Confidence 100, Severity High. These remain the F-CX-OV-01 non-circular gate family.
- F-CX-S-02: addressed, Confidence 100, Severity Medium. E.2 waits for the kept session dir in the branch tree.
- F-CX-U-02: addressed enough for PASS, Confidence 75, Severity Low. Later writes route to the preserved date-prefixed dir.
- F-CX-R-02: open/deferred, Confidence 75, Severity Medium. Failed `git worktree remove` recovery remains implied, not fully specified; below threshold and unrelated to iter4.
- F-PF-01 and prior aesthetics low carryovers: deferred/unchanged, Confidence 75, Severity Low.
- Claude F-U3-02 / F-C3-01 / F-C3-02 / F-R3-01: addressed, Confidence 100, Severity High. All were rooted in iter3's body-grep mechanism; iter4 removes it from the live gate and replaces it with the atomic guard.
- Claude F-U3-03 / F-A3-01 / F-A3-02: addressed or deferred below threshold, Confidence 75, Severity Low. No blocking residue.

## Cross-perspective Synthesis

The atomic guard is implemented correctly. The local toolchain confirms gh 2.45.0 supports `--match-head-commit`, and GitHub's REST docs confirm the underlying merge endpoint accepts `sha`, supports `merge_method: squash`, and returns conflict when the provided SHA does not match the PR head. The executor discipline is also correct: iter4 treats any non-zero guarded merge exit as NEEDS_CONTEXT and requires reporting stderr plus current head, so API/auth failures are not silently retried or rationalized.

The only new issue found is not in the atomic guard. It is a cleanup wording mismatch around `--delete-branch` local branch deletion. It should be cleaned up during Planning/Execution, but it is Medium and pre-existing from the M-2 local cleanup thread.

## Per-perspective Verdict Summary

| Perspective | Verdict | Driver |
|---|---|---|
| Project | PASS | Q-iter4-Override is in scope and all 19 locks remain honored. |
| Structure | PASS | Atomic guard is placed at merge time; E.2 remains non-circular. |
| Performance | PASS | Fix is one flag on an existing command and removes post-merge checks. |
| Aesthetics | PASS | Live wording now consistently describes atomic guard semantics. |
| Usage | PASS | Executor can follow exit-code/NEEDS_CONTEXT discipline literally. |
| Consistency | PASS | One Medium cleanup wording mismatch; no threshold issue. |
| Risk | PASS | Wrong-head merge is prevented; one Medium cleanup false-alarm risk remains. |

## Karpathy Four Failure Modes

| Mode | Present? | Evidence |
|---|---|---|
| Wrong assumptions | No blocking instance. The iter3 squash-body assumption is explicitly refuted and removed at `draft-iter4.md:227-230` and `draft-iter4.md:490-504`. The `--delete-branch` local cleanup assumption remains Medium/non-blocking. |
| Overcomplexity | No. The fix is one flag on an existing command. |
| Orthogonal edits | No new instance. Q-iter4-Override is the only new lock and is scoped to F-CX-OV-02. |
| Imperative-over-declarative | No. The artifact states the invariant, then gives one command that enforces it. |

## Must-Preserve

- Preserve all 19 locks and the Round 6 settings override.
- Preserve Stage E.2's non-circular `git log` + `git ls-tree` gate.
- Preserve pre-merge `HEAD_SHA` capture as audit log.
- Preserve `--match-head-commit "$HEAD_SHA"` on the squash merge.
- Preserve NEEDS_CONTEXT on any non-zero guarded merge exit.
- Preserve iter1/iter2/iter3 drafts as audit trail.

## Aggregate Verdict

PASS. The F-CX-OV-02 surgical fix is implemented correctly and the prior High/100 iter3 Claude findings are addressed. The only open finding is Medium/75 cleanup wording around `--delete-branch`, below the High>=50 REVISE threshold.

One-paragraph summary: Iter4 does what Round 6 authorized: it removes the false post-merge body-grep verification, keeps the useful `HEAD_SHA` capture, and moves the head-stability invariant into the merge transaction with `--match-head-commit`. F-CX-OV-01 remains intact, all 19 locks are honored, `settings.json` documents the max-iteration override, and the old drafts remain separate audit artifacts. Planning/Execution should normalize the redundant local branch-delete wording against `gh --delete-branch`, but that does not block Ideation PASS.
