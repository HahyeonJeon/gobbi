# Evaluation — Risk Perspective (Claude) — T9c iter1

**Target:** commit `14041db`. **Method:** adversarial diff-read; ancestry + branch-state verification; data-loss audit.

## Checks
- **Data-loss audit:** zero body content lost (line counts identical), zero files deleted, zero KEEP keys stripped. The only removals are S-set residue + obsolete `type:` values. Safe.
- **KEEP-strip safety invariant (§4.4):** held — no base/extension/cross-ref key stripped. `discovered:` value preserved into `created`.

## Findings

### RISK-1 (Critical, process) — Target commit `14041db` is NOT on the working branch; it is a divergent/orphan commit not reachable from HEAD
- **Type:** assumption_risk · **Domain:** process · **Disposition:** open · **Confidence:** 100 · **Severity:** Critical
- **Evidence:**
  - `git merge-base --is-ancestor 14041db HEAD` → **NO (not ancestor).**
  - `git merge-base HEAD 14041db` → `82a5137` (the divergence point). `14041db` is a direct child of `82a5137` on the `main`/`#271` lineage.
  - HEAD = `cedd0cd` (T9b iter2) descends through an ENTIRELY DIFFERENT lineage: `90c46fd feat(memory): ship memory-system standard core` → ... → `cedd0cd`. This branch does the SAME conformance campaign via different commits (`26646e7 strip staging-only frontmatter`, `8e42fe2 rename 28 positional files`, `2e24dfe conform 35 project-tier docs`, `cedd0cd T9b iter2`).
  - The working tree does NOT contain T9c's changes: `README.md` at HEAD has NO frontmatter; `edit-tool` H1 at HEAD still reads `# Mistake Candidate: Edit Tool Refuses Symlink Paths`; the reviews file at HEAD is still named `2026-05-24-execution-task-01-dual-system-eval.md` with H1 `# Execution Task 01 — Dual-System Adversarial Review`. ALL three of T9c's hallmark de-crypts are ABSENT from the live branch.
- **Why it matters:** the commit-under-evaluation is detached from the branch the session is working on. If the session intends to ship T9c's work on `chore/session-2026-05-25-a10c82d6`, that work is currently NOT present on the branch — `14041db` would need to be cherry-picked/rebased in, and doing so would collide with the parallel conformance commits already on the branch (which already conform the same 28 docs by a different route, e.g. README.md frontmatter was added then is absent at HEAD — the two lineages disagree on the README outcome). Evaluating `14041db` in isolation says nothing about the state the user will actually ship. This is a CRITICAL integration/provenance risk: a PASS on the orphan commit could be misread as "the branch is conformant," which is false.
- **Suggested direction:** the manager must clarify with the user: (a) is `14041db` the intended deliverable, to be integrated onto the working branch? (b) or is the working-branch lineage (the `cedd0cd`-descended commits) the real T9c, and `14041db` a stray/experimental commit? The two lineages produce DIFFERENT outcomes for `README.md`/`features/README.md` (orphan adds frontmatter; branch HEAD has none). Reconcile before shipping. (Not prescriptive — user decides which lineage is canonical.)

### RISK-2 — `features/README.md` scope/feature contradiction could propagate if used as a template
- **Type:** assumption_risk · **Domain:** docs-sync · **Disposition:** open · **Confidence:** 50 · **Severity:** Low
- **Evidence:** see PROJ-1. `scope: feature` + `feature: null` violates §2.1's "non-null feature when scope=feature."
- **Why it matters:** if a future author copies the features index README as a starting template for a real feature dir, the null-feature pattern carries forward. Low likelihood.

## Verdict reasoning
RISK-1 is a Critical, Confidence-100 process/integration finding: the evaluated commit is off-branch and the live branch reflects a different, conflicting conformance lineage. Per the verdict thresholds (any Critical ≥75 → FAIL), the risk perspective cannot pass. The conformance *content* of `14041db` is itself clean — but the deliverable's relationship to the working branch is broken, which is exactly the class of defect the risk lens exists to catch.

VERDICT: FAIL
