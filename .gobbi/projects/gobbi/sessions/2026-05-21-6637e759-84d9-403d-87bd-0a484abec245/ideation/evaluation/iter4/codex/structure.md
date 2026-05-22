# Ideation iter4 — Structure perspective (codex)

## Stage 0 Artifact Summary

Iter4 keeps the Stage 0/A-G structure from iter3 and changes only Stage G's merge-head invariant. The structural question is whether the new head guard is placed at the correct dependency point: after PR review, immediately after `HEAD_SHA` capture, and inside the merge command rather than after the merge.

Memory reads: same as project perspective, with structural focus on `draft-iter4.md:326-371`, `draft-iter4.md:379-413`, iter3 codex `structure.md`, and GitHub REST merge endpoint docs.

## Locked Frame (Stage 1)

- Scenario S1: The Stage E.2 non-circular gate survives unchanged.
  - Checklist: E.2 still uses `git log` plus `git ls-tree`; no tracked file embeds the sweep SHA; failure returns NEEDS_CONTEXT.
- Scenario S2: Stage G enforces the reviewed-head invariant at the merge boundary.
  - Checklist: `HEAD_SHA` is captured immediately before merge; the captured SHA is passed to the merge command; no post-merge message parsing is required.
- Scenario S3: The fix works with squash merges specifically.
  - Checklist: `gh pr merge` exposes both `--match-head-commit` and `--squash`; REST merge endpoint has body `sha` plus `merge_method` values including `squash`.
- Scenario S4 (adversarial): A post-merge or text-message check remains as a load-bearing structural gate.
  - Checklist: no `grep -F "$HEAD_SHA"` or `${HEAD_SHA:0:7}` fallback remains as success criterion.
- Scenario S5 (adversarial): Branch/worktree cleanup ordering regresses after Stage G changes.
  - Checklist: registered worktrees are removed before their branches; sweep branch cleanup remains post-merge.

## Stage 2 Findings

No new structural finding. Stage G now captures at `draft-iter4.md:353-355` and merges with `--match-head-commit "$HEAD_SHA"` at `draft-iter4.md:356`. The D2 verification is one exit-code check at `draft-iter4.md:411-413`. Official GitHub REST docs state the merge endpoint accepts `sha` as "SHA that pull request head must match to allow merge" and `merge_method` can be `merge`, `squash`, or `rebase`; the same docs specify 409 Conflict when `sha` is provided and the head does not match.

## Stage 2 Step 3 — Disposition Of Every Iter3 Inherited Finding

- F-CX-S-03: addressed, Confidence 100, Severity Medium. Iter3's post-hoc message grep is replaced by a merge-time head precondition at `draft-iter4.md:356-359`.
- F-CX-S-01: addressed, Confidence 100, Severity High. The self-referential `session.json` SHA condition remains removed; see `draft-iter4.md:328-336`.
- F-CX-S-02: addressed, Confidence 100, Severity Medium. The E.2 `git ls-tree` precondition still naturally waits for the kept session dir to exist in the branch tree at `draft-iter4.md:331-332`.
- F-CX-OV-02: addressed, Confidence 100, Severity Medium. The merge command now includes the atomic guard at `draft-iter4.md:356`.

## Per-perspective Verdict

PASS. No Critical>=75 or High>=50 structural finding.

## Must-Preserve

- Preserve the E.1/E.2 split and the two deterministic E.2 preconditions.
- Preserve Stage G ordering: PR review, immediate `HEAD_SHA` capture, guarded merge.
- Preserve `git worktree remove` before deleting worktree-owned branches at `draft-iter4.md:340-346`.
- Preserve `find .../worktrees/ -mindepth 1`.

