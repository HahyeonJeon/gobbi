## Artifact Summary + Memory reads

What: Preparation iter2 is the corrected readiness draft and staging-file set for Bundle B after iter1 failed on a false mirror-policy premise. Why: Planning needs a structurally consumable, audit-preserving set of decisions, backlogs, and design notes before task decomposition. How: iter2 supersedes the old mirror decision, adds a corrected mirror-canonical symlink decision, marks the sync backlog moot, and updates D-4 for mirror topology plus 5-vs-7 workflow-doc rationale. Scope: T1 and T3 from `ideation/artifacts/bundle-b-ideation-pass.md`; T2 and broader Memory Access Matrix cleanup are out of scope. Consumers: Planning, executors touching skill files, and Wrap-up promotion.

Memory reads: `draft-iter2.md`; five iter2 target staging files; full iter1 Codex and Claude evaluation directories; `draft-iter1.md`; `sub-steps-a-d-iter1.md`; `stub-redirect-format.md`; all eight listed project mistakes; evaluation, preparation/evaluation, and orchestration/evaluation docs. Tool checks run: `find /playinganalytics/git/gobbi/.claude/skills/ -type l -name "*.md" | wc -l` -> 53; `ls /playinganalytics/git/gobbi/.claude/skills/orchestration/workflow/ | wc -l` -> 7; workflow contents list; status greps for superseded/updated files; `git ls-files -s` showing `.claude/skills/...` entries are tracked symlinks mode `120000` while `.gobbi/projects/gobbi/skills/...` entries are regular files mode `100644`; a `/tmp` symlink rewrite check showing `sed -i` replaces the symlink with a regular file and leaves the real target unchanged.

## Locked Frame (Stage 1)

Scenario S1: Staged artifact structure remains routable.
- Check S1.1: Decisions live under `staging/decisions/`.
- Check S1.2: Project backlogs live under `staging/backlogs/project/`.
- Check S1.3: The D-4 design file lives under `staging/design/`.

Scenario S2: Supersession structure is explicit and audit-preserving.
- Check S2.1: The old mirror decision has supersession frontmatter.
- Check S2.2: The new mirror decision has reciprocal `supersedes` frontmatter.
- Check S2.3: The sync backlog is closed as moot without deleting the iter1 body.

Scenario S3: D-4 structurally resolves the 5-vs-7 directory ambiguity.
- Check S3.1: The five target docs are enumerated.
- Check S3.2: The two excluded sub-phase docs are enumerated.
- Check S3.3: The Planning gate checks both presence in five and absence in two.

Scenario S4 (adversarial): Correct symlink topology can still be structurally unsafe if the edit method is underspecified.
- Check S4.1: The policy distinguishes canonical storage from runtime symlink paths.
- Check S4.2: It tells Planning whether workspace-path edits must preserve symlinks.
- Check S4.3: It includes a verification check that symlinks remain symlinks after edits.

## Per-scenario per-check results

S1.1: Yes. `mirror-propagation-policy-mirror-canonical-symlinks.md`, `mirror-propagation-policy-workspace-canonical.md`, and `planning-brief-mistake-load-directives-for-t1.md` are under `staging/decisions/`.
S1.2: Yes. The four project backlog files remain under `staging/backlogs/project/`, including the moot sync backlog.
S1.3: Yes. `workflow-phase-doc-set-for-per-iter-cadence.md` is under `staging/design/`.
S2.1: Yes. The old mirror decision has `status: superseded`, `superseded_by: mirror-propagation-policy-mirror-canonical-symlinks.md`, and `## Supersession reason`.
S2.2: Yes. The new decision has `status: accepted` and `supersedes: mirror-propagation-policy-workspace-canonical.md`.
S2.3: Yes. The sync backlog has `status: superseded`, a moot `superseded_by` string, and `## Moot reason`; its original body is preserved above the note.
S3.1: Yes. The D-4 target table names the five loop docs.
S3.2: Yes. The excluded-files table names `evaluation.md` and `memorization.md`.
S3.3: Yes. The Planning gate asks for five positive matches and zero sub-phase matches.
S4.1: Yes. The corrected decision says mirror canonical, workspace symlink runtime layer.
S4.2: No. The decision and D-4 say editing either path edits the same physical file, but they do not constrain tools that replace symlinks rather than follow them.
S4.3: No. No post-edit check such as `test -L .claude/skills/...` or "edit the canonical mirror path for bulk rewrites" is included.

## Iter1 finding dispositions

ID: COD-STRUCT-PREP1-001
disposition: superseded
evidence: The broad wrong-topology finding is corrected by Fix 2, but its symlink-preservation sub-risk remains as COD-STRUCT-PREP2-001.

ID: COD-STRUCT-PREP1-002
disposition: superseded
evidence: S4.2/S4.3 are now inherited explicitly; they reveal the narrower edit-method gap recorded as COD-STRUCT-PREP2-001.

ID: COD-STRUCT-PREP1-003
disposition: open
evidence: Decisions log row 13 in `draft-iter2.md` still says "5 staging files" while describing seven total artifacts; this is Low severity and non-blocking.

## Typed findings

ID: COD-STRUCT-PREP2-001
Type: design_flaw
Domain: edit-surface
Disposition: open
Confidence: 100
Severity: High
Evidence: The corrected decision says "Editing either path edits the same physical file" and recommends workspace `.claude/skills/...` citations. `git ls-files -s` shows workspace skill paths are tracked symlinks (`120000`) and mirror paths are regular files (`100644`). A local verification using a temporary symlink showed `sed -i` on the symlink path converted the symlink into a regular file and left the real target unchanged (`regular file .../linkdir/file.md`, real target still `alpha`, link path `beta`). Planning therefore needs an explicit symlink-preserving edit contract or canonical mirror-path edit rule.
surfaced-by: codex

## Low-confidence appendix

None.

VERDICT: REVISE
