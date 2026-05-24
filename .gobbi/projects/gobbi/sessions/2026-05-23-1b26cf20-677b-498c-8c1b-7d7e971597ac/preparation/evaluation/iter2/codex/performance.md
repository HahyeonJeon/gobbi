## Artifact Summary + Memory reads

What: Preparation iter2 corrects the mirror-policy and D-4 ambiguity so Planning can proceed with less downstream rework. Why: a false source-of-truth model would amplify task-brief and execution cost across T1. How: the draft and staging files supersede the old mirror model, close the obsolete sync backlog, and document the five loop docs plus two excluded sub-phase docs. Scope: T1/T3 only; broader cleanup remains out of scope. Consumers: Planning decomposers and executors.

Memory reads: `draft-iter2.md`; five iter2 target files; all iter1 Codex/Claude evaluation files; `draft-iter1.md`; `sub-steps-a-d-iter1.md`; `stub-redirect-format.md`; all eight project mistakes; evaluation skill docs. Tool checks run: 53 symlink count, 7 workflow files, staging list, status greps, and a temporary symlink rewrite demonstration for edit-method cost risk.

## Locked Frame (Stage 1)

Scenario PF1: Iter2 removes the largest downstream rework source.
- Check PF1.1: The false mirror-canonical premise is gone.
- Check PF1.2: The sync mechanism backlog is no longer a future implementation task.
- Check PF1.3: The Planning intake note no longer instructs manual mirror edits.

Scenario PF2: The 5-vs-7 ambiguity no longer costs Planning time.
- Check PF2.1: The five target docs are named.
- Check PF2.2: The two non-target docs have rationale.
- Check PF2.3: The verification gate catches accidental over-edit.

Scenario PF3 (adversarial): A cheaper-looking workspace-path convention hides a later execution cost.
- Check PF3.1: The artifact names the edit method enough to prevent symlink breakage.
- Check PF3.2: Verification detects link replacement before a task reports success.
- Check PF3.3: Any remaining risk is smaller than the iter1 false-policy rework cost.

## Per-scenario per-check results

PF1.1: Yes. The accepted decision states mirror canonical and workspace symlink runtime layer.
PF1.2: Yes. The sync backlog is `status: superseded` and closed as moot.
PF1.3: Yes. The iter2 draft says no mirror-edit is needed and the old interim discipline is rescinded.
PF2.1: Yes. D-4 lists the five loop docs.
PF2.2: Yes. The excluded table covers `evaluation.md` and `memorization.md`.
PF2.3: Yes. The gate asks for five positive matches and zero sub-phase matches.
PF3.1: No. The artifact recommends workspace path citations but does not warn that symlink-replacing tools can split workspace from canonical mirror storage.
PF3.2: No. No `test -L` or equivalent symlink-preservation check is proposed.
PF3.3: Yes. The remaining issue is narrower than iter1's false mirror policy but still creates avoidable downstream cost.

## Iter1 finding dispositions

ID: COD-PERF-PREP1-001
disposition: addressed
evidence: Planning no longer receives the false workspace-canonical edit model; Fix 2 and the Planning intake note state the corrected topology.

ID: COD-PERF-PREP1-002
disposition: addressed
evidence: The iter2 artifact uses `find .claude/skills/ -type l -name "*.md" | wc -l` and records the 53-symlink result.

ID: COD-PERF-PREP1-003
disposition: addressed
evidence: Hook-authoring skill deferral remains correctly witness-bound and unchanged.

## Typed findings

ID: COD-PERF-PREP2-001
Type: assumption_risk
Domain: downstream-cost
Disposition: open
Confidence: 75
Severity: Medium
Evidence: The remaining edit-method ambiguity can push cost into Execution: a workspace-path mechanical rewrite that replaces symlinks will produce drift/debugging work even though the policy says the symlink layer prevents drift. This is supported by the temporary symlink rewrite check and by tracked symlink mode `120000` for `.claude/skills/...` paths.
surfaced-by: codex

## Low-confidence appendix

None.

VERDICT: PASS
