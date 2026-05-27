# Evaluation — Consistency Perspective (Claude) — T9c iter1

**Target:** commit `14041db`. **Method:** cross-file frontmatter comparison + §4.5/§2.1/§1.3 conformance.

## Checks
- **Gate uniformity:** §4.5 gate = 0 over T9c scope and full P_live. Consistent with the prior conformance waves (T9a/T9b/T8 lineage) that also targeted gate 0.
- **Title de-cryption (§1.3 / §4.3):** 0 cryptic-led H1 titles among the 28. The 2 declared de-crypts landed: `edit-tool` stripped "Mistake Candidate:" prefix; reviews `# Execution Task 01...` → concept-first `# Configuration Step Worktree-Create Insertion...` + H3 `iter1/iter2 divergence/convergence` → `First/Second review`.
- **Base-key ordering consistency:** uniform 9-key order across all conformed files.

## Findings

### CONS-1 — `symlink-restore-depth-wrong.md` H1 retains `(addressed in iter2)` session-coordinate
- **Type:** general · **Domain:** docs-sync · **Disposition:** open · **Confidence:** 75 · **Severity:** Low
- **Evidence:** `14041db:.gobbi/.../mistakes/symlink-restore-depth-wrong.md` H1: `# Symlink restore recipe used wrong `../` prefix depth (addressed in iter2)`. §4.3 lists `iter2` as a session-only coordinate that should not be load-bearing in evergreen-type bodies.
- **Why it matters:** the title is NOT cryptic-led (it names the subject), so it passes the cryptic-title gate (gate 4). But the parenthetical `(addressed in iter2)` is a residual session-coordinate that a zero-context reader cannot resolve. It is mildly informative ("this was fixed") but the "iter2" reference is meaningless cross-session. This was not in T9c's declared 2-title de-crypt scope, so it is a pre-existing residual T9c did not touch — flagged for the user's awareness, not a T9c regression.
- **Suggested direction:** optionally drop the parenthetical or reword to "(fixed)" in a future pass. Not blocking.

### CONS-2 — Mixed `status` vocabulary across mistakes (`active` vs `accepted`)
- **Type:** general · **Domain:** docs-sync · **Disposition:** open · **Confidence:** 50 · **Severity:** Low
- **Evidence:** mistakes split between `status: active` (codex-eval, codex-exec, codex-subprocess, executor-mirror[no—accepted], handoff, proposed-deleting, session-dir, worktree-physical) and `status: accepted` (claude-evaluator, codex-rescue, codex-wrapper, edit-tool, executor-main-tree, leader-iter2, manager-iter2, memorization-delegation, symlink-restore). §2.2 lists mistakes' base `status` values as `active`/`superseded` — `accepted` is NOT in the documented set.
- **Why it matters:** `accepted` is a pre-existing value carried forward from the staged-decision lifecycle (not introduced by T9c — the parent files already had `status: accepted`). T9c preserved it rather than normalizing to `active`. This is a campaign-wide consistency drift, not a T9c-specific defect, but worth surfacing: the mistakes type's §2.2 status enum (`active`/`superseded`) does not include `accepted`.
- **Suggested direction:** decide whether `accepted` is a sanctioned mistakes status (then add to §2.2) or should normalize to `active`. Cross-feature decision — likely out of T9c scope. User decides.

## Verdict reasoning
The two findings are pre-existing residuals (session-coordinate in one title, `accepted` status vocabulary) that T9c neither introduced nor was scoped to fix. Both Low. T9c's own consistency (uniform base keys, gate 0, declared de-crypts landed) is clean. Consistency perspective: PASS.

VERDICT: PASS
