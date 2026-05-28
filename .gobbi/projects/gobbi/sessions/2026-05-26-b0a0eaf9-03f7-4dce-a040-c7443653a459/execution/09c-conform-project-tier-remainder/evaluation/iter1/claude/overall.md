# Evaluation — Overall (Claude) — T9c iter1

**Target:** commit `14041db` — conform 28 project-tier-remainder docs to dev-doc standard §4 (the LAST conformance task).
**Method:** adversarial diff-read of `14041db` vs parent `82a5137`; own commands; reports untrusted; 7 perspectives + Overall.

## Per-perspective verdicts
| Perspective | Verdict |
|---|---|
| Project | PASS |
| Structure | PASS |
| Performance | PASS |
| Aesthetics | PASS |
| Usage | PASS |
| Consistency | PASS |
| Risk | **FAIL** |

## Contract gate summary (the 8 mandated checks)
1. **§4.5 full gate over T9c scope (archive-safe, all S keys) = 0:** PASS — 0 leaks, per-file at `14041db` and full P_live. Conditional `disposition` non-backlogs leak = 0.
2. **All T9c docs carry 9 base keys:** PASS — 28/28, programmatically verified, zero missing.
3. **scope/feature per §2.1:** PASS-with-nit — `scope: project` on all 28; `feature` non-null only where feature-bound (permitted). EXCEPTION: `features/README.md` = `scope: feature` + `feature: null` (PROJ-1, Low).
4. **0 cryptic-led titles (§1.3):** PASS — all 28 H1s subject-named; the 2 declared de-crypts (edit-tool prefix strip, reviews concept-first H1 + H3) landed. Residual `(addressed in iter2)` in symlink-restore H1 is not cryptic-led (CONS-1/USAGE-1, Low).
5. **No KEEP key stripped (CRITICAL, diff-read):** PASS — every removed `-` line is S-set residue or a base/KEEP key re-added in canonical order. ALL review-specific KEEP keys survived (`review_kind`/`reviewed_artifact`/`reviewer`/`perspectives`/`overall_verdict`/`related_reports`/`related_decisions`). `related`/`supersedes`/`superseded_by`/`source`/`priority`/`domain` all preserved. `discovered:` value folded into `created` (value-preserving).
6. **No body reshaping:** PASS — body line counts identical parent↔`14041db` for all 20 mistakes + reviews (48=48); stub-redirect = +12/-0 pure frontmatter. Only the 2 declared title de-crypts + reviews H3/cross-system/outcome iter→review de-cryption touched bodies.
7. **26 mistakes intact, none deleted:** PASS — the 20 mistakes/*.md the commit touches are byte-stable in body; `--diff-filter=D` empty; count 20→20. (Brief said "26"; T9c scope contains 20 mistake docs — all intact.)
8. **Scope clean (only T9c paths):** PASS — every file in `14041db` is within references/reviews/rules/plans/mistakes + features/README.md + README.md.

## Cross-perspective tension — the decisive issue
Six perspectives PASS: as a *conformance edit*, `14041db` is essentially flawless — gate 0, all base keys, zero KEEP-strips, zero body damage, zero deletions, clean scope, subject-named titles. If the only question were "did the author conform the 28 docs correctly?", the answer is yes.

But the **Risk perspective surfaces a Critical, Confidence-100 integration defect (RISK-1): the commit under evaluation is NOT on the working branch.**
- `14041db` is a direct child of `82a5137` on the `#271/main` lineage and is NOT an ancestor of HEAD (`git merge-base --is-ancestor 14041db HEAD` → false).
- The working branch `chore/session-2026-05-25-a10c82d6` (HEAD `cedd0cd`) reaches the SAME conformance goal through a DIFFERENT lineage (`90c46fd ... 8e42fe2 rename ... 2e24dfe conform 35 ... cedd0cd T9b iter2`).
- The two lineages DISAGREE on outcomes: at HEAD, `README.md` has NO frontmatter, `edit-tool` H1 still says "Mistake Candidate:", and the reviews file is un-renamed/un-de-crypted — i.e. NONE of T9c's hallmark changes are present on the branch the session will ship.

A PASS verdict on `14041db` in isolation would be technically defensible on content but dangerously misleading on deliverable state: it could be read as "the branch is T9c-conformant," which the evidence flatly contradicts. The Karpathy failure mode here is **evaluating the wrong artifact** — grading a detached commit while the shippable branch carries a conflicting parallel implementation.

## Must-preserve list (what remediation must not break)
- The clean S-set strip with zero KEEP collateral — this is the hardest part of conformance and it was done correctly.
- All review-specific KEEP keys on the reviews doc.
- The byte-stable mistake/review bodies.
- The 2 correct title de-cryptions (edit-tool, reviews) and the reviews H3 iter→review de-cryption.
- The value-preserving `discovered:`→`created` fold.

## Overall verdict
Per threshold rules: any Critical finding with Confidence ≥ 75 → FAIL. RISK-1 is Critical / Confidence 100. The conformance content is excellent, but the deliverable is on the wrong branch and conflicts with the live branch's parallel conformance — the manager must reconcile lineage with the user before this can be considered shippable. This is not a content-remediation REVISE (the content is clean); it is a provenance/integration FAIL requiring a user decision on which lineage is canonical.

VERDICT: FAIL
