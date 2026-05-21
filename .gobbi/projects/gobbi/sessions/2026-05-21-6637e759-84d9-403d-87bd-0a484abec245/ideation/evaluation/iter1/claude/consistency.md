# Ideation iter1 — Consistency perspective (claude)

## Artifact Summary + Memory reads

See `project.md`. Consistency-specific: cross-checked Scope Contract claims against Implementation Checklist bullets and Success Criteria; re-ran each of the 15 verification commands in D2 mentally against the artifact's described post-state.

## Locked Frame (Stage 1)

Seed scenarios from `ideation/evaluation.md` § Consistency. Updates:

- **scenario_gap S-CON-NEW-1** (adversarial): "Each Implementation Checklist bullet maps to at least one Scope Contract In-Scope item AND at least one Success Criterion."
- **scenario_gap S-CON-NEW-2**: "Each D2 verification command, when run, would actually return the value the artifact promises."

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| Scope Contract / Framed / Design same problem | YES | All three frame "destructive pre-rebuild reset" |
| Design decisions cite real research insights | YES | I1–I10 all cited from Design D1–D9 |
| Scenarios ↔ Checklist aligned | YES (mostly) | S5→Stage D ordering, S6→Stage E LAST bullet, S4→Stage A worktree pre-flight, S7→Stage C, S11→Q-F tag |
| Glossary terms consistent | YES | "bare-UUID", "date-prefixed", "sweep commit", "Q-A through Q-G" used uniformly |
| Internal vs external research conflict | n/a — external skipped, justified |
| **S-CON-NEW-1 bullet ↔ contract/success mapping** | All 11 In-Scope items mapped | PARTIAL — see F-C-01 |
| **S-CON-NEW-2 D2 commands accuracy** | Each command's expected output matches | PARTIAL — see F-C-02 |

## Typed findings

### F-C-01 — Success Criterion #2 internally contradicts the worktree-PR sweep model

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 100
- **Severity**: Medium
- **Evidence**: Scope Contract Success Criterion #2 (line 82): "`git log --oneline -2` shows exactly one new sweep commit (squashed PR) plus the prior `487fc35` SOP commit on `develop`." But the artifact's Implementation Checklist Stages B/C/D/E/F describe **multiple sweep commits** (lines 215 "sweep commit 1", 228 "sweep commit 2", 239 "sweep commit 3", 246 "sweep commit 3 (continuation)", 253 "sweep commit 4 (or post-merge ops)"). On a worktree-PR workflow, those multiple commits exist on the sweep branch; the squash-merge into develop produces **one** new commit on develop. So Success #2 (`git log --oneline -2` showing exactly one new commit) is correct *post-merge*, but the artifact's per-stage labeling suggests 4 distinct commits exist on develop, which contradicts Success #2.
- **Why it matters**: The executor reading "sweep commit 1/2/3/4" labels may push 4 separate commits to develop OR push them to the sweep branch and not squash-merge. Either way, the executor's mental model diverges from Success #2.
- **Suggested direction**: rename "sweep commit N" to "sweep-branch commit N (squash-merged into develop as 1 commit)". Clarify in Stage G that the PR is squash-merged, and Success #2 measures *post-merge develop*.

### F-C-02 — D2 Verification #5 expected output contradicts Success Criterion #5

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 100
- **Severity**: Medium
- **Evidence**: D2 line 297: "`git branch | sed 's/^..//' | sort` → `develop\nmain\n<sweep-branch>` (or just `develop\nmain` post-merge)." Success Criterion #5 (line 85): "`git branch | grep -vE '^[* ] (main|develop)$'` returns no rows **post-merge**." Both are correct post-merge but D2's command produces 3 lines pre-merge and 2 lines post-merge, while the artifact also presumes the sweep branch is itself deleted at merge time. After squash-merge, GitHub does not auto-delete the local-side sweep branch — that's a manual `git branch -d` step the artifact does not list anywhere.
- **Why it matters**: Success #5 will fail if the sweep branch is not explicitly deleted post-merge. The artifact's 4-branch delete list (Stage F lines 258–261) names `fix/257-complete-mirror-sync`, `refactor/257-skills-agents-rules`, `pr-fin-2-decisions-hold`, `redesign/v050-ideation` — NOT the sweep branch itself.
- **Suggested direction**: add a Stage G or post-merge bullet: "After PR squash-merge, `git checkout develop && git pull && git branch -d <sweep-branch>`." Then Success #5 passes.

### F-C-03 — Scope Contract enumerates `worktrees/` as "becomes empty after worktree removal", but Success #3 says it survives

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 100
- **Severity**: Low
- **Evidence**: Line 30: "KEEP CONTENT (NO placeholdering): ... `worktrees/` (which becomes empty after worktree removal)". Success #3 (line 83) expects `worktrees/` (empty) to exist post-sweep. Consistent. But F-S-02 (Structure perspective) shows that `find ... -empty -delete` without `-mindepth 1` will delete `worktrees/` itself. So the artifact's text intention and command implementation diverge.
- **Why it matters**: cross-perspective consistency: this finding is *the same physical issue* as F-S-02, just framed as "design says preserve, command says delete". Recording here for cross-cutting visibility.
- **Suggested direction**: see F-S-02 (`-mindepth 1`).

### F-C-04 — `.gitignore` ordering claim is sound but the artifact's I6 misreads the file structure

- **Type**: `assumption_risk`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: Artifact line 158 (I6): "lines 9–18" of `.gitignore`. Verified the root `.gitignore` has the whitelist block; line numbers may have shifted from edit history. Not a functional issue — the deletion of `.gobbi/projects/*/sessions/` line is unambiguous via text, not line number. But the artifact cites lines and an executor that grep-by-line will find a stale anchor.
- **Why it matters**: minor — the executor will `grep` for the line content not the line number.
- **Suggested direction**: cite the line content not the number.

## Low-confidence appendix

(none)

## Must-preserve list

- The cross-reference between each Q-N lock and the In-Scope bullets / Success criteria / Implementation Checklist bullets is dense and verifiable — preserve this density.
- Decisions Log § Memory reads register provides traceability for Stage 1 evaluator inheritance.

## Verdict

REVISE — F-C-01 and F-C-02 are Medium/100; thresholds say PASS technically (no High≥50, no Critical≥75), but **the count of definite contradictions (3 findings @ Confidence 100)** is high. Calibrating against threshold rules: PASS. However flagging because: cross-perspective with F-S-01/F-S-02 in Structure, this is REVISE-worthy when seen holistically. Final per-perspective verdict per the strict rule: **PASS** (no Critical, no High). Overall stage will reconcile.
