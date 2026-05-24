## Artifact Summary + Memory reads

What: Preparation iter3 is the final Preparation correction for Bundle B. It preserves the iter1 and iter2 readiness record and adds the missing symlink-preservation edit contract before Planning consumes the mirror-canonical policy. Why: five convergent Codex iter2 findings showed that "editing either path edits the same physical file" was unsafe unless the edit method follows the symlink instead of replacing it. How: iter3 adds the `## Symlink-preservation edit contract` H2 to the accepted mirror-policy decision, updates `draft-iter3.md`, and stages the deferred `ci-symlink-integrity-check.md` backlog. Scope: T1 worktree-first session architecture and T3 PostToolUse hook/reconstructor; T2 and broader Memory Access Matrix cleanup remain out of scope. Consumers: Planning leaders, T1/T3 executors, Wrap-up, and future project-memory readers.

Memory reads: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/rawdata/draft-iter3.md`; `draft-iter2.md`; `draft-iter1.md`; `sub-steps-a-d-iter1.md`; `preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md`; `preparation/staging/backlogs/project/ci-symlink-integrity-check.md`; all iter1 and iter2 per-system evaluation directories; `.gobbi/projects/gobbi/rules/stub-redirect-format.md`; project mistakes `codex-rescue-agent-fire-and-forget-without-result-capture.md`, `codex-eval-session-write-path-nested-in-worktree.md`, and `evaluator-returned-verdict-inline-no-per-perspective-files.md`; `.agents/skills/evaluation/SKILL.md`; `.agents/skills/preparation/evaluation.md`; `.agents/skills/orchestration/workflow/evaluation.md`.

Tool evidence used: symlink count output `53`; mirror-policy H2 list output `## Context`, `## Decision`, `## Rationale`, `## Alternatives considered`, `## Consequences`, `## Symlink-preservation edit contract`, `## Empirical reference`, `## Related`; row-20 count output `1`; backlog status output `status: deferred`; staging list contains 9 files including the new CI backlog.

## Locked Frame (Stage 1)

Scenario P1: Iter3 solves the right Preparation problem.
- Check P1.1: The draft names the five Codex iter2 blocker findings and their shared root cause.
- Check P1.2: The added decision-file section directly addresses edit-method safety, not an unrelated mirror redesign.
- Check P1.3: The Scope Contract remains T1/T3 only, with T2 still deferred.

Scenario P2: Iter3 stays inside the user-locked surgical scope.
- Check P2.1: Draft changes are limited to the allowed iter3 additions and traceability sections.
- Check P2.2: No direct project-memory writes are introduced.
- Check P2.3: The CI guard is staged as deferred instead of absorbed into current work.

Scenario P3 (adversarial): A final-iter fix creates scope creep by turning a runtime discipline into new infrastructure work.
- Check P3.1: The durable CI guard has a backlog file, not an implementation change.
- Check P3.2: The backlog gives concrete pick-up triggers.
- Check P3.3: The draft states zero current repo defects, preserving Principle 10.

Rule coverage: `stub-redirect-format.md` is not applicable because iter3 edits session-staged decisions/backlogs, not superseded published docs.

## Per-scenario per-check results

P1.1: Yes. `draft-iter3.md` names `COD-STRUCT-PREP2-001`, `COD-USAGE-PREP2-001`, `COD-CONS-PREP2-001`, `COD-RISK-PREP2-001`, and `COD-OVERALL-PREP2-001` in the entry paragraph and coverage map.
P1.2: Yes. The decision file now contains `## Symlink-preservation edit contract`; the H2 ordering command returned `## Consequences`, then `## Symlink-preservation edit contract`, then `## Empirical reference` at lines 54, 63, and 111.
P1.3: Yes. The Scope reference still lists T1/T3 in scope and T2 out of scope; no re-Ideate trigger was added.
P2.1: Yes. The `diff -u draft-iter2.md draft-iter3.md` output showed targeted additions for the iter3 entry mode, iter3 net deltas, generated/deferred CI backlog entries, mirror-policy qualifier, row 20, Planning intake, WORK checklist, and coverage map.
P2.2: Yes. The staged-file list is under `/preparation/staging/`; no project-memory destination under `.gobbi/projects/gobbi/{features,design,backlogs}` was written by this iter.
P2.3: Yes. `grep "^status:" .../ci-symlink-integrity-check.md` returned `status: deferred`.
P3.1: Yes. The CI guard exists only at `preparation/staging/backlogs/project/ci-symlink-integrity-check.md`.
P3.2: Yes. The backlog names `First real defect`, `N>=2 future bundles`, and `Tooling change` as pick-up triggers.
P3.3: Yes. The backlog says witness count is currently zero in this repo and cites Principle 10 as the reason for deferral.

## Iter2 finding dispositions

No Project-perspective COD-PROJ-PREP2 blocker was opened in iter2. The cross-perspective project question is whether iter3 stayed inside scope; disposition: addressed. Evidence: the iter3 artifacts are the edit-contract section, draft update, and deferred CI backlog only.

## Typed findings

No new iter3 Project findings.

## Low-confidence appendix

None.

VERDICT: PASS
