## Artifact Summary + Memory reads

What: Consistency checks whether draft-iter2, the five staging changes, filesystem evidence, and inherited findings agree. Why: Planning should not consume an artifact that says one thing in the draft, another in staging, and a third on disk. How: I cross-read draft and staging files, inherited iter1 findings, project mistakes/rule, and ran required filesystem checks plus a symlink edit-method probe. Scope: T1/T3 Preparation readiness. Consumers: Planning, Execution, Wrap-up, and future memory readers.

Memory reads: `draft-iter2.md`; five iter2 target staging files; `draft-iter1.md`; `sub-steps-a-d-iter1.md`; all iter1 Codex and Claude perspective files; `.gobbi/projects/gobbi/rules/stub-redirect-format.md`; all eight listed project mistakes; evaluation docs. Tool checks: symlink count 53; workflow files count 7 and names; status greps; excluded-files grep; D-3 decision exists; full staging list; `git ls-files -s` symlink modes; temporary `sed -i` symlink replacement check.

## Locked Frame (Stage 1)

Scenario C1: Draft and staging agree on the corrected mirror policy.
- Check C1.1: Draft names the accepted mirror-canonical decision.
- Check C1.2: New decision frontmatter agrees with draft.
- Check C1.3: Old decision frontmatter agrees with draft.

Scenario C2: Draft and staging agree on sync-backlog mootness.
- Check C2.1: Draft says sync backlog is closed as moot.
- Check C2.2: Backlog frontmatter says `status: superseded`.
- Check C2.3: Body explains why old options are obsolete.

Scenario C3: D-4 and filesystem agree on 5-vs-7.
- Check C3.1: Filesystem has seven workflow files.
- Check C3.2: D-4 lists the five loop docs.
- Check C3.3: D-4 lists the two sub-phase docs as excluded.

Scenario C4 (adversarial): The corrected "same physical file" claim is too broad for actual write operations.
- Check C4.1: Disk evidence supports symlink resolution for normal reads.
- Check C4.2: Disk/tool evidence supports the claim for rewrite-by-rename operations.
- Check C4.3: The artifact distinguishes "both paths resolve" from "all edit tools preserve the link".

## Per-scenario per-check results

C1.1: Yes. Draft iter2 names `mirror-propagation-policy-mirror-canonical-symlinks.md`.
C1.2: Yes. New decision has `status: accepted` and `supersedes: mirror-propagation-policy-workspace-canonical.md`.
C1.3: Yes. Old decision has `status: superseded` and `superseded_by: mirror-propagation-policy-mirror-canonical-symlinks.md`.
C2.1: Yes. Draft iter2 says the symlink layer is the sync mechanism and no mechanism is needed.
C2.2: Yes. Backlog frontmatter has `status: superseded`.
C2.3: Yes. `## Moot reason` says the three suggested approaches are obsolete.
C3.1: Yes. `ls .../workflow/ | wc -l` returned 7 and listed the two sub-phase docs.
C3.2: Yes. D-4 lists the five loop docs.
C3.3: Yes. D-4 excludes `evaluation.md` and `memorization.md` with rationale.
C4.1: Yes. Reads and symlink targets support the corrected topology.
C4.2: No. A temporary `sed -i` check replaced the symlink and left the real target unchanged.
C4.3: No. The artifact repeatedly says editing either path edits the same physical file without limiting that statement to symlink-following edit tools.

## Iter1 finding dispositions

ID: COD-CONS-PREP1-001
disposition: addressed
evidence: The false workspace-canonical decision is superseded and the accepted decision matches the 53-symlink topology.

ID: COD-CONS-PREP1-002
disposition: addressed
evidence: The live iter2 premise no longer relies on the old V-1 no-hit wording; the old sync scan is labeled incomplete/superseded.

ID: COD-CONS-PREP1-003
disposition: superseded
evidence: Symlink-topology checks are now present, but they expose the narrower edit-method consistency finding COD-CONS-PREP2-001.

ID: COD-CONS-PREP1-004
disposition: open
evidence: Decisions log row 13 still has "5 staging files ... = 7 total" wording.

## Typed findings

ID: COD-CONS-PREP2-001
Type: design_flaw
Domain: empirical-evidence
Disposition: open
Confidence: 100
Severity: High
Evidence: The artifact's broad claim "Editing either path edits the same physical file" conflicts with direct tool evidence for rewrite-by-rename style edits: `sed -i` on a temp symlink path converted the link into a regular file and left the target unchanged. The repository has the same structural precondition: `.claude/skills/...` entries are tracked symlinks and `.gobbi/projects/gobbi/skills/...` entries are regular canonical files.
surfaced-by: codex

## Low-confidence appendix

None.

VERDICT: REVISE
