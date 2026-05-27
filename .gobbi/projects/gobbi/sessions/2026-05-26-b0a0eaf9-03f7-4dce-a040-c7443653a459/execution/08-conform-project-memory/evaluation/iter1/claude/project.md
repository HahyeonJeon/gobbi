# Project — T8 conform features/project-memory (iter1, claude)

## Artifact Summary + Memory reads
**What**: Mechanical §4 dev-doc conformance of 4 content docs under features/project-memory/ (README, changelogs/bundle-a-rehome, decisions/path-conventions-anchor-casing, design/memorization-moment-of-capture). **Why**: bring the last feature dir into the §4 standard (gate was 3 failing files). **How**: add 9 base keys, strip §4.4 S-set incl session-routing residue, de-crypt cryptic title + inline session coords, preserve KEEP keys — no body reshaping, no narrative deletion. Scope contract: features/project-memory/ paths ONLY; mechanical conformance only. Downstream consumers: future-session readers, the §4.5 gate, gobbi memory tooling. CURRENT state = HEAD (T8 54c0cde + KEEP-restore dbe61c3).
**Memory reads**: principles (P4/P8/P9/P11); .gobbi/projects/gobbi/rules/stub-redirect-format.md; mistakes design-literal-retire / naming-standard / executor-main-tree-edit; skills/evaluation + execution/evaluation.md; memorization/rules.md §4; T8 rawdata draft-iter1.md.

## Locked Frame (Stage 1)
S1 change-set matches stated outputs 1:1 — [c] all 4 docs conformed; [c] only the 4 in-scope files touched.
S2 verifies command passes — [c] §4.5 gate over features/project-memory = 0 (was 3).
S3 no file outside scope touched — [c] git show 54c0cde + dbe61c3 stat.
S4 mechanical-only, no reshaping — [c] no §4.2 section restructuring.
S5 (adversarial) "while I was in there" cleanup slips in — [c] every hunk maps to add-base-key / strip-S-key / de-crypt.

## Per-scenario per-check results
- S1: PASS. `git show --stat 54c0cde` = exactly README + 3 content docs; dbe61c3 = README + decisions only (KEEP restore). All 4 docs now carry name/description/type/scope/feature/status/created/session/tags.
- S2: PASS. Ran the canonical §4.5 gate (archive-safe, underscore-aware, full S incl task/loop/iter/slug/scenario/finding-source/phase/sub-step/session-id) scoped to features/project-memory → **0 leak files** (baseline 3). Conditional `disposition` non-backlogs check → 0.
- S3: PASS. Both commits touch only `features/project-memory/**`. No out-of-scope path.
- S4: PASS. Headings unchanged in structure (decisions keeps Question/Resolution/Evidence/Action; design keeps bold-label paragraphs). Body edits are pure session-coord de-cryption, not section reshaping.
- S5: PASS. Diff scanned hunk-by-hunk: every body change is a de-cryption (W3-T2→redesign task, §8 rule 1→design §8 routing rule, T02/T04→secondary routing, Concern 2/Task 05→planning session, I6 line removed, Design B→Memorization, item B removed). No unrelated content edits.

## Typed findings
None at PASS threshold. Scope is clean and complete; the task solved the right problem (gate 0) inside the locked contract.

Note (FP, not a finding): the decisions/design docs are not ADR-shaped per §4.2 (Question/Resolution vs Context/Decision/Rationale). This is **pre-existing + out-of-scope** — T8 is mechanical-only and explicitly forbids body reshaping; reshaping would be the scope violation. Confidence 0 as a T8 finding.

## Low-confidence appendix
- §4.2 ADR-shape gap on decisions/design docs — Type: general, Domain: docs-sync, Confidence 25, Severity Low, Disposition: deferred (pre-existing; out of T8 scope).

VERDICT: PASS
