# Risk Perspective — T3 conform git-workflow (commit 2d01316)

## Frame
The high-risk probe: -334 deletions. Could mechanical conformance have destroyed durable knowledge? (mistakes `design-literal-retire-instruction-without-replacement`, `naming-standard-needs-positive-guidance`: never delete without replacement.) Secondary: dangling references introduced, wrong-tree edit, narrative reclassified vs deleted.

## Verified (own commands)
- **The -334 deletions are NOT net knowledge loss.** `git show 2d01316` shows the deletions are REPLACED by `+` lines on the same files (a diff renders a reworded line as -old/+new). Per-file inspection of the heaviest-delta docs (rollback-semantics, storage-bounds, plan-diff-scope, worktree-create, workflow-phase-doc-set) confirms: every deleted body line is either (a) a stripped staging-frontmatter key, (b) a cryptic coordinate replaced by self-contained prose, or (c) a `## Related`/`## Cite`/`## Anchored insights`/`## Implementation checklist anchor` block whose durable substance was folded into Rationale/Validation and whose vanished-session line-refs (`draft-iter3.md:439`, `evaluation/iter1/codex/performance.md`) were repointed to a `## Source` feature-memory footer.
- **Never-delete honored.** Durable knowledge survives: rollback `git rm`-not-`git checkout` reasoning intact; storage estimate (~10-50 KB, 15-commit upper bound) intact; commit-scope-vs-branch-vs-develop decision intact; worktree-before-stamp rationale + smoke-test regex intact; D-1 superseded note preserved (de-crypted, not dropped). The two removed design sections (`## Anchored insights` = cryptic coord list `T1-I-2, T1-E-1…`; `## Implementation checklist anchor` = `T1-I-T1.a…`) carried NO durable content beyond session-internal pointers — removing them is de-cryption, not narrative loss.
- **No narrative reclassified-to-delete.** No body paragraph of session narrative was deleted outright; narrative was reworded in place to self-contained voice (the §4.3-correct treatment for evergreen types).
- **Right-tree edit.** Commit 2d01316 is on branch `chore/session-2026-05-25-a10c82d6`; worktree clean of uncommitted T3 drift (only unrelated session-artifact untracked files). No main-tree leak (mistake `executor-main-tree-edit-near-miss` not triggered).

## Findings

### RISK-1 — Dangling `related:` cross-references in workflow-phase-doc-set design doc
- **Type**: design_flaw · **Domain**: docs-sync · **Disposition**: open · **Confidence**: 100 · **Severity**: Low
- **Evidence**: `features/git-workflow/design/workflow-phase-doc-set-for-per-iter-cadence.md` frontmatter `related:` was repointed from session-internal paths to `features/git-workflow/decisions/planning-brief-mistake-load-directives-for-t1.md` and `features/git-workflow/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md`. Neither target exists — `find` across the whole project (outside sessions/) returns nothing; `git-workflow/decisions/` holds only the 3 docs T3 touched.
- **Why it matters**: The repoint corrected the path FORM (session-relative → feature-memory) but the targets were never promoted into feature memory, so the links dangle. NOTE: the OLD `related:` (`decisions/planning-brief-mistake-load-directives-for-t1.md`) was ALSO dangling — the executor preserved a pre-existing dead link while normalizing its shape; it did not introduce the breakage. `related:` is advisory metadata, not load-bearing for the body. Not a T3 gate (leak=0 + 9 base keys both pass).
- **Suggested direction**: Either promote the two referenced decisions into `git-workflow/decisions/` (T4 scope?), or drop the dead `related:` entries. Flag for manager + user; not blocking for T3.

## Must-preserve
- The de-crypt-not-delete treatment of all durable knowledge (rollback semantics, storage bounds, diff-scope decision, worktree ordering, D-1 superseded note).
- Clean worktree / correct-branch commit.

VERDICT: PASS
