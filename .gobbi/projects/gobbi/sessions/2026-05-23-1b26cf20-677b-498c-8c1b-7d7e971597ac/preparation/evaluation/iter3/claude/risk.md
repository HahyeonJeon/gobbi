## Artifact Summary + Memory reads

What/Why/How: see project.md. Risk lens: what breaks if iter3 is wrong — staging boundary, RE-IDEATE triggers missed, deferred items lost, write-safety gap reintroduced.

Memory reads: see project.md.

## Locked Frame (Stage 1)

Scenario R1: Wrap-up sole-writer contract holds.
- R1.1: All iter3 outputs at session staging paths only.
- R1.2: No iter3 write to `.gobbi/projects/gobbi/skills/`, `features/...`, or other project-memory dirs.
- R1.3: The decision file's new H2 was added in-place via the Edit tool (the canonical inode-preserving method), not via a rewrite-by-rename tool — staging file inode-preserved.

Scenario R2: RE-IDEATE trigger not present.
- R2.1: iter3 surgical scope does not surface any unworkable design premise.
- R2.2: All 5 Codex iter2 findings are mechanism-level (insert clarification), not design-level (need to rethink architecture).
- R2.3: Draft explicitly states no RE-IDEATE.

Scenario R3: Deferred CI backlog is not lost.
- R3.1: ci-symlink-integrity-check.md has a concrete pick-up condition (not "TBD/later").
- R3.2: Backlog file is wired into both the draft Deferred section AND the new H2's discipline point 4.
- R3.3: `status: deferred` frontmatter routes to project backlogs at Wrap-up.

Scenario R4 (adversarial): The iter3 fix itself creates a new failure mode the evaluator did not anticipate.
- R4.1: The 4-point discipline list creates no contradiction with existing skills' Memory Access Matrix wording (acknowledged as out-of-scope informal follow-up).
- R4.2: The new H2 does not invalidate any other iter1/iter2 decision file.
- R4.3: The deferred CI check's pseudocode is correct (would actually catch the failure mode).

Scenario R5: License/IP, Privacy, Cost (not-applicable for Preparation markdown).

Scenario R6: Slug collision risk — `ci-symlink-integrity-check` does not collide with any existing project backlog or skill.

## Per-scenario per-check results

R1.1: Yes. `find` confirms all 9 staged files at session paths.
R1.2: Yes. `git status` (clean) at session start; no untracked project-memory writes.
R1.3: Yes (mechanism check) — the decision file `git ls-files -s` mode is 100644 (regular file, expected for the canonical mirror file). The file's content was edited in place; no symlink involved at the staging path.
R2.1: Yes.
R2.2: Yes. Each of the 5 findings is "add this clarification" not "rethink premise". Confirmed against iter2 Codex finding bodies.
R2.3: Yes. Draft line 37: "0 re-Ideate. No Ideation contradiction surfaced. The Scope Contract is workable." (preserved from iter1+iter2).
R3.1: Yes. Backlog lines 27-32 enumerate 3 pick-up triggers.
R3.2: Yes. Draft Deferred (lines 155-157) cites + decision file line 94 cites + ci-backlog file body cites the cross-link.
R3.3: Yes. Frontmatter `status: deferred`, `project: gobbi`, `feature: null` — routes to project backlogs.
R4.1: Yes. The Memory Access Matrix follow-up is captured as Out-of-scope informal (draft line 258).
R4.2: Yes. The iter1 superseded decision + iter1 sync-mechanism backlog still moot; iter3 only adds, does not flip any iter2 lock.
R4.3: Substantially yes (cross-checked pseudocode logic: it diffs cached-mode against current-mode; trigger condition `old=120000 staged=100644` matches the failure pattern). One caveat: the pseudocode uses `git ls-files -s` for both old and staged modes which yields the same value (the staged mode); the original mode should come from `git diff --cached --raw` or similar. This is acknowledged inline as "Pseudocode — exact diff plumbing depends on the chosen pre-commit framework" so it does not block the deferral.
R5: not-applicable.
R6: Yes. No existing project backlog or skill named `ci-symlink-integrity-check`.

## Iter1+iter2 finding dispositions (inherited)

ID: COD-RISK-PREP2-001 (Codex iter2 Risk, Confidence 100 High)
disposition: addressed
evidence: The Codex finding: "If T1 task briefs copy the current guidance, an executor can accidentally create a divergent workspace file and break the runtime-link contract." iter3 closes this at three levels: (a) runtime — the discipline list (point 1: prefer Edit; point 2: canonical mirror path for bulk rewrites); (b) verification — point 3 (`test -L` post-edit gate with restore command); (c) durable — point 4 + the deferred CI backlog. The empirical witness on this evaluator's machine confirms the failure mode is real and the discipline is targeted.

ID: COD-RISK-PREP1-* (iter1 Risk)
disposition: addressed (already addressed in iter2; iter3 does not regress).

## Typed findings

ID: CL-RISK-PREP3-001
Type: assumption_risk
Domain: process
Disposition: open
Confidence: 25
Severity: Low
Evidence: The deferred CI backlog's pseudocode (lines 39-48) uses `git ls-files -s` for both old_mode and staged_mode, which would return the staged mode for both reads. A correct trigger needs `git diff --cached --raw` or `git ls-tree HEAD <path>` (for old) vs `git ls-files --stage` (for staged). The file acknowledges this as pseudocode and defers framework selection, so the deferral is not blocked — but a future pick-up will need to fix this.
Surfaced-by: claude
FP-check: this IS speculative (the backlog is deferred and the implementation hasn't been written). Confidence 25 reflects that. Marked as `process` not as an iter3 implementation defect.

## Low-confidence appendix

CL-RISK-PREP3-001 (Confidence 25 — kept here for transparency; does not block PASS).

Verdict: **PASS**
