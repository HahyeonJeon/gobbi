# Ideation iter4 — Structure (claude)

## Stage 0 — Target Understanding

iter4 substitutes one mechanism inside Stage G (the merge gate). The rest of the structural shape — Stage 0/A–G ordering, E.1/E.2 split, the non-circular gate at E.2, 7 critical-ordering invariants — must survive unchanged.

## Stage 1 Locked Frame (Structure perspective)

- Scenario S1: ordering invariants intact — only invariant #7 is rewritten; the other 6 are unchanged.
- Scenario S2: E.1/E.2 split + non-circular gate intact (iter3 fix preserved).
- Scenario S3 (adversarial): does the `--match-head-commit` substitution break any sequence assumption (e.g., does it interact with the `--delete-branch` flag, with the post-merge `git branch -d <sweep-branch>` step, or with the `git pull` between)?
- Scenario S4: D1 deletion-order bullet still encodes the full pipeline.

## Stage 2 — Walked checklists

- **Stage 0/A–F unchanged** — diff confirms.
- **Stage E.1/E.2 split preserved verbatim** — iter4 lines 311-336 match iter3 contents (the diff has zero touches to Stage E).
- **Non-circular gate (iter3 Q-Gate-Redesign) preserved** — D2 #15 explicitly marked "unchanged at iter4". D9 narrative intact.
- **Critical ordering invariants** — 7 invariants enumerated (lines 363-371); #1–#6 textually identical to iter3; #7 rewritten for atomic-guard semantics. Sequence rationale (line 383) updated coherently.
- **`--match-head-commit` interaction with `--delete-branch` and `--squash`** — gh CLI documents these as independent FLAGS at the same level; the atomic API call is: enforce head-match → squash merge → delete branch, all in one server-side transaction. If head-match fails, the merge does not happen AND the branch is NOT deleted (server-side merge call is the trigger for branch-delete). D11 line 499 captures this: "exit code 0 ⇒ GitHub confirmed head-match at merge time AND completed the squash-merge AND deleted the remote branch (all atomic)". The post-merge M-2 step `git checkout develop && git pull && git branch -d <sweep-branch>` is correctly sequenced AFTER the merge succeeds.
- **D1 deletion-order bullet** — updated to "(G) HEAD_SHA capture (audit-log) → `gh pr merge --match-head-commit "$HEAD_SHA"` atomic guard → local sweep-branch delete." Pipeline order is coherent.
- **No new ordering risk** — the substitution is at-merge-time; there is no new dependency on any earlier stage's output that wasn't already there.

## Findings

None at Structure perspective. The structural shape is preserved; the one invariant change is properly scoped and the interaction with surrounding steps is sound.

## Must-preserve list

- 7 ordering invariants, with #1–#6 untouched and #7 rewritten precisely for atomic-guard semantics.
- E.1/E.2 split + non-circular gate (the iter3 Q-Gate-Redesign fix).
- Stage F worktree-remove-before-branch-delete invariant.
- Stage 0 tag-before-sweep invariant.
- Stage D gitignore-commit-before-Stage-E.1 invariant.
- D1 deletion-order bullet captures the full pipeline accurately.

## Verdict

**PASS**.
