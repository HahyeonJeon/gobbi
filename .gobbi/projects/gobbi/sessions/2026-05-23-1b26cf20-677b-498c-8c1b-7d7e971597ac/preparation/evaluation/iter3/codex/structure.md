## Artifact Summary + Memory reads

What: Structure evaluates whether iter3's staged artifacts are organized, routable, and testable for downstream Planning and Wrap-up. Why: iter2's corrected topology still lacked an operational edit contract; a structurally complete Preparation output must include where the rule lives, how consumers find it, and what verification proves it. How: iter3 adds one H2 section inside the accepted mirror-policy decision and one project backlog file under the correct staging path. Scope and consumers match `project.md`.

Memory reads: `draft-iter3.md`; `draft-iter2.md`; `preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md`; `preparation/staging/backlogs/project/ci-symlink-integrity-check.md`; prior iter1/iter2 evaluation files for both systems; the three project mistakes listed in `project.md`; `stub-redirect-format.md`; evaluation and preparation child docs.

Tool evidence used: H2 list returned exactly 8 H2s including `## Symlink-preservation edit contract`; `grep -c "Symlink-preservation edit contract"` returned `1`; `grep -c "test -L"` returned `1`; `git ls-files -s .claude/skills/orchestration/SKILL.md .gobbi/projects/gobbi/skills/orchestration/SKILL.md` returned modes `120000` and `100644`; local `/tmp` reproduction returned `test-L-exit=1`, `link-content=beta`, `canonical-content=alpha`.

## Locked Frame (Stage 1)

Scenario S1: The new edit contract is structurally placed where consumers will find it.
- Check S1.1: It is in the accepted mirror-policy decision file, not a detached note.
- Check S1.2: It is positioned between `## Consequences` and `## Empirical reference`.
- Check S1.3: The decision file still has 8 H2 sections, not a sprawling restructure.

Scenario S2: The contract decomposes the edit-surface problem into actionable parts.
- Check S2.1: It distinguishes inode-preserving and rewrite-by-rename methods.
- Check S2.2: It supplies a safety table with the required columns.
- Check S2.3: It supplies a four-point discipline list.

Scenario S3: The deferred CI guard is structurally routable.
- Check S3.1: It lives under `staging/backlogs/project/`.
- Check S3.2: Frontmatter has `status: deferred`.
- Check S3.3: Body contains pseudocode or an equivalent baseline-comparison approach.

Scenario S4 (adversarial): The fix is too procedural to be testable.
- Check S4.1: It names the invariant: workspace skill paths must remain symlinks.
- Check S4.2: It provides a post-edit command that verifies the invariant.
- Check S4.3: It provides a recovery path if the invariant is broken.

## Per-scenario per-check results

S1.1: Yes. The new section is in `mirror-propagation-policy-mirror-canonical-symlinks.md`, the accepted decision file.
S1.2: Yes. `grep -n "Symlink-preservation edit contract|Consequences|Empirical reference"` returned line 54 `## Consequences`, line 63 `## Symlink-preservation edit contract`, line 111 `## Empirical reference`.
S1.3: Yes. `grep "^## "` returned 8 H2s: Context, Decision, Rationale, Alternatives considered, Consequences, Symlink-preservation edit contract, Empirical reference, Related.
S2.1: Yes. The section says the broad edit claim is true only for methods that follow the symlink and false for methods that replace it by renaming.
S2.2: Yes. The table header separates edit method, inode-preserving status, and workspace symlink-path safety.
S2.3: Yes. The discipline list covers: prefer `Edit`; canonical mirror path for bulk rewrites; `test -L` verification plus restore; deferred CI/pre-commit hook.
S3.1: Yes. The staged-file list contains `/preparation/staging/backlogs/project/ci-symlink-integrity-check.md`.
S3.2: Yes. Status grep returned `status: deferred`.
S3.3: Yes. The backlog includes `git diff --cached --name-only -- '.claude/' | while read path; do` pseudocode and a baseline-file alternative.
S4.1: Yes. The decision says any tracked workspace symlink flipping from `120000` to `100644` is a defect.
S4.2: Yes. The contract requires `test -L .claude/skills/<path>` after non-Edit-tool modifications touching workspace paths.
S4.3: Yes. It gives `rm .claude/skills/<path> && ln -sfn ...` recovery guidance and says to re-apply the intended edit through the Edit tool or canonical mirror path.

## Iter2 finding dispositions

ID: COD-STRUCT-PREP2-001
disposition: addressed
evidence: The new H2 section gives the explicit symlink-preserving edit contract and canonical mirror-path rule that iter2 requested. Evidence includes the safety table, point 2's "Never run `sed -i` or `perl -i` against workspace `.claude/skills/...` paths", and point 3's `test -L` gate.

Inherited note: COD-STRUCT-PREP1-003 remained a Low count-wording issue in iter2. disposition: deferred/non-blocking. Evidence: it concerns row 13's historical wording and was outside the iter3 user-locked surgical scope.

## Typed findings

No new iter3 Structure findings.

## Low-confidence appendix

None.

VERDICT: PASS
