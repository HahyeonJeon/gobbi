# Ideation iter4 — Consistency perspective (codex)

## Stage 0 Artifact Summary

Iter4 must keep the Scope Contract, scenarios, implementation checklist, D2 verification list, D6 summary table, D11 narrative, Decisions Log, preserve list, and settings override synchronized. The main consistency target is the replacement of iter3's body-grep proof with one atomic guarded merge command.

Memory reads: `draft-iter4.md`, iter3 codex `consistency.md`, iter3 claude `consistency` findings via `overall.md`, `discussion-log.md`, `settings.json`, and local `gh pr merge --help`.

## Locked Frame (Stage 1)

- Scenario C1: Every representation of F-CX-OV-02 uses the same mechanism.
  - Checklist: Scope, Success #14, S6b, Stage G, D2 #20, D6, D11, Decisions Log Round 6, and WORK checklist all point to `--match-head-commit`.
- Scenario C2: Iter3's body-grep mechanism is not live anywhere.
  - Checklist: body-grep references are only historical, out-of-scope, or refutation text.
- Scenario C3: F-CX-OV-01 remains synchronized.
  - Checklist: all E.2 references still say `git log` + `git ls-tree`, no SHA-in-session.
- Scenario C4 (adversarial): Cleanup semantics contradict local tool behavior.
  - Checklist: claims about `--delete-branch` match local `gh` help; local branch cleanup command cannot create a false failure after successful merge.

## Stage 2 Findings

### F-CX-C4-01 — `--delete-branch` local-branch wording conflicts with local `gh` help

- **Type**: `checklist_gap`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence with line numbers**: Local `gh pr merge --help` says `--delete-branch` will "Delete the local and remote branch after merge". The draft says the flag "handles remote only" at `draft-iter4.md:360` and earlier says the same remote-only assumption at `draft-iter4.md:64` and `draft-iter4.md:78`. The draft then asks the executor to run `git branch -d <sweep-branch>` after merge at `draft-iter4.md:360`.
- **Why-it-matters**: If `gh` has already deleted the local sweep branch, the explicit `git branch -d <sweep-branch>` can fail after a successful merge. This is not a regression from the iter4 `--match-head-commit` change and it does not weaken the atomic head guard, but it can create a post-merge cleanup false alarm.

## Stage 2 Step 3 — Disposition Of Every Iter3 Inherited Finding

- F-CX-C-03: addressed, Confidence 100, Severity Medium. The proof claim now aligns with `--match-head-commit` at `draft-iter4.md:494-500`.
- F-CX-C-04: addressed, Confidence 75, Severity Low. Stage G's detailed order is correct at `draft-iter4.md:350-356`; D1 no longer states capture before PR open, though it still abbreviates Stage G at `draft-iter4.md:381`.
- F-CX-C-01: addressed, Confidence 100, Severity High. E.2 references remain `git log` + `git ls-tree`.
- F-CX-C-02: addressed, Confidence 100, Severity Medium. Head capture plus atomic merge now represent the same invariant.
- Iter1 consistency fixes F-C-01 through F-C-04: remain addressed; no regression found in Success #2, post-merge branch cleanup intent, worktrees command, or gitignore policy.
- Claude F-C3-01 / F-C3-02: addressed, Confidence 100, Severity High. The body-shape claim is removed from live verification; see `draft-iter4.md:411-413` and `draft-iter4.md:490-500`.

## Per-perspective Verdict

PASS. F-CX-C4-01 is Medium/75, below the High>=50 REVISE threshold.

## Must-Preserve

- Preserve one atomic Stage G invariant across all sections.
- Preserve F-CX-OV-01's non-circular E.2 wording across all sections.
- Preserve explicit local sweep-branch cleanup as an intended success criterion, but align it with actual `gh --delete-branch` behavior in any future cleanup.
- Preserve symlink verification and post-merge develop commit-count checks.

