# Ideation iter4 — Performance perspective (codex)

## Stage 0 Artifact Summary

The iter4 performance surface is operational: command count, network calls to GitHub, and whether the atomic guard adds expensive or fragile work. Iter4 replaces several post-merge body/metadata checks with one flag on an existing `gh pr merge` call, while preserving the cheap `gh pr view` capture.

Memory reads: `draft-iter4.md`, iter3 codex `performance.md`, local `gh pr merge --help`, and GitHub CLI/GitHub REST docs for merge flags and merge API parameters.

## Locked Frame (Stage 1)

- Scenario PF1: The reset remains a bounded single sweep.
  - Checklist: no full-history archive, clone, or diff of all PR contents is introduced.
- Scenario PF2: The merge-head fix reduces or preserves verification cost.
  - Checklist: one `gh pr view` remains; `--match-head-commit` is a flag on an already-required merge call; body-grep steps are deleted.
- Scenario PF3: E.2 gate remains cheap.
  - Checklist: `git log` and `git ls-tree` stay bounded git-plumbing checks.
- Scenario PF4 (adversarial): The new guard introduces retry loops or polling.
  - Checklist: non-zero exit returns NEEDS_CONTEXT; no automatic retry, polling, or re-review loop appears.

## Stage 2 Findings

No new performance finding. Iter4 collapses D2 from 21 to 20 commands at `draft-iter4.md:448`, and the relevant verification is a single guarded merge exit code at `draft-iter4.md:411-413`. There is no new hot path, no new dependency, and no additional repository scan.

## Stage 2 Step 3 — Disposition Of Every Iter3 Inherited Finding

- F-CX-OV-01: addressed, Confidence 100, Severity High. The impossible SHA write/amend cycle remains gone.
- F-CX-OV-02: addressed for correctness, Confidence 100, Severity Medium; no performance regression. The fix is a merge flag at `draft-iter4.md:356`.
- Prior performance carryover F-PF-01: deferred/unchanged, Confidence 75, Severity Low. Lightweight tag archival remains the chosen low-cost recovery mechanism at `draft-iter4.md:457-459`.

## Per-perspective Verdict

PASS. No Critical>=75 or High>=50 performance finding.

## Must-Preserve

- Preserve lightweight tag archival instead of expensive copy/archive work.
- Preserve bounded git plumbing checks for E.2.
- Preserve no-retry NEEDS_CONTEXT behavior on guarded merge failure.

