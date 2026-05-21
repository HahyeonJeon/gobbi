# Ideation iter4 — Performance (claude)

## Stage 0 — Target Understanding

Performance surface for an Ideation rawdata artifact = (a) work-to-do-volume implied by the plan, (b) wall-clock cost of the verification gates. iter4's substitution removes one shell roundtrip (`gh pr view --json mergeCommit` post-merge) and replaces it with one flag on an already-executing command. Net effect: faster, fewer commands, no regression.

## Stage 1 Locked Frame (Performance perspective)

- Scenario Pf1: gate-command count.
- Scenario Pf2: total verification-command count (D2).
- Scenario Pf3 (adversarial): does the atomic guard add any hidden cost (network call, rate-limit risk)?

## Stage 2 — Walked checklists

- **D2 verification command count**: iter3 listed 21 commands; iter4 lists 20 (the iter3 #20 + #21 body-grep pair collapsed into one atomic-guard exit-code check at #20). Line 448 documents this explicitly. Net reduction in operator load.
- **Stage G command count**: iter3 had pre-merge capture + merge + post-merge gh-view + post-merge `git log -1 --format=%B | grep -F`. iter4 has pre-merge capture + merge (with flag). Two commands removed, one flag added.
- **Atomic-guard hidden cost** — `--match-head-commit` is a single argument to the existing `gh pr merge` call; no extra network roundtrip, no rate-limit risk. Server-side it's a single comparison before the merge transaction begins; sub-millisecond.
- **Bisect-safety unchanged** — Stage E.1's "either Stage D's commit + E.1's in same commit, or follow-on bisect-safe commit" language preserved.
- **No new I/O or parallel-execution shape**.

## Findings

None at Performance perspective. The substitution is strictly faster and lighter than iter3's two-step verify.

## Must-preserve list

- D2 verification list at 20 commands (the iter3 → iter4 collapse).
- Stage G now has 2 gh commands (capture + merge-with-flag) instead of iter3's 4 (capture + merge + post-view + git-log-grep).
- Bisect-safety property of Stage E.1's commit options.

## Verdict

**PASS**.
