## Artifact Summary + Memory reads

What: Overall synthesizes Codex Preparation iter3 across Project, Structure, Performance, Aesthetics, Usage, Consistency, and Risk. Why: this is the final Preparation iteration, so the loop-conclusive Codex verdict must decide whether the edit-contract addition closes the iter2 blocker set without creating a new scope, consistency, or risk problem. How: I read the iter3 draft, the modified mirror-policy decision, the new CI backlog, iter2/iter1 evaluation inheritance, project rule/mistakes, and ran the requested empirical checks. Scope: final Preparation readiness for Bundle B T1/T3; no Execution, no CI implementation, no project-memory writes.

Memory reads: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/rawdata/draft-iter3.md`; `draft-iter2.md`; `draft-iter1.md`; `sub-steps-a-d-iter1.md`; all 8 per-perspective files under iter1/claude, iter1/codex, iter2/claude, and iter2/codex; `preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md`; `preparation/staging/backlogs/project/ci-symlink-integrity-check.md`; full `preparation/staging/` file list; `.gobbi/projects/gobbi/rules/stub-redirect-format.md`; project mistakes `codex-rescue-agent-fire-and-forget-without-result-capture.md`, `codex-eval-session-write-path-nested-in-worktree.md`, and `evaluator-returned-verdict-inline-no-per-perspective-files.md`; `.agents/skills/evaluation/SKILL.md`; `.agents/skills/preparation/evaluation.md`; `.agents/skills/orchestration/workflow/evaluation.md`.

## Cross-perspective synthesis

Project: PASS. Iter3 solves the right Preparation problem and stays inside the surgical scope.

Structure: PASS. The new contract is in the accepted decision file, correctly positioned, tabled, and routable; the CI guard is a project backlog.

Performance: PASS. The edit contract removes the downstream-cost ambiguity without adding immediate CI work.

Aesthetics: PASS. The new material is discoverable through the header, summary, mirror-policy section, Planning intake, checklist, and coverage map.

Usage: PASS. A Planning leader or executor can now tell which tool to use, what to avoid, how to handle bulk rewrites, and how to recover.

Consistency: PASS. The broad iter2 claim is consistently qualified across the draft and decision file; old superseded artifacts remain intact.

Risk: PASS. The symlink replacement hazard is prevented, detectable, reversible, and backstopped by a deferred durable guard.

Cross-perspective tension: The only real tension is Risk vs Principle 10 for the CI guard. Iter3 resolves it correctly by making the per-edit runtime guard current scope and staging the CI/pre-commit guard as deferred because the repo has zero actual bad commits.

## Per-fix verification

Fix 1, symlink-preservation edit contract: PASS.
- Section exists: `grep -c "Symlink-preservation edit contract"` returned `1`.
- Position is correct: H2 line check returned `54:## Consequences`, `63:## Symlink-preservation edit contract`, `111:## Empirical reference`.
- H2 count remains 8: Context, Decision, Rationale, Alternatives considered, Consequences, Symlink-preservation edit contract, Empirical reference, Related.
- Safety table present: `rg` found `Claude Code `Edit` tool | YES`, `Claude Code `Write` tool | YES`, `vim` YES, `sed -i` NO, and `perl -i` NO.
- Four-point discipline present: prefer `Edit`; canonical mirror path for bulk rewrites; `test -L` gate with restore; deferred CI/pre-commit backlog.
- Empirical witness verified: `git ls-files -s` returned `120000 ... .claude/skills/orchestration/SKILL.md` and `100644 ... .gobbi/projects/gobbi/skills/orchestration/SKILL.md`; local reproduction returned `test-L-exit=1`, `link-content=beta`, `canonical-content=alpha`.

Fix 2, iter3 draft update: PASS.
- `draft-iter3.md` has `iter3 net deltas vs iter2`, generated-output and deferred CI backlog entries, mirror-policy qualifier, row 20, Planning intake note, extended WORK checklist, and coverage map.
- Decisions log row count command returned `20`; row-20 count returned `1`.
- The coverage map cites the five named Codex iter2 blockers and maps each to the edit contract.
- The prompt's scope-discipline diff review showed only expected iter3 additions and wording changes tied to those additions.

Fix 3, CI symlink-integrity backlog: PASS.
- File exists and status grep returned `status: deferred`.
- Body has three pick-up triggers: first real defect, `N>=2 future bundles`, and tooling change.
- Body includes pseudocode using `git diff --cached --name-only -- '.claude/'`.
- Principle 10 rationale is present: zero current witnesses and CI infrastructure out of Bundle B scope.

## Karpathy 4 failure modes

Wrong assumptions: Not present after iter3. The wrong iter2 assumption was universal edit equivalence across symlink paths. The new contract correctly distinguishes symlink-following writes from rewrite-by-rename writes, and the `/tmp` reproduction confirms the root cause.

Overcomplexity: Not present. The current defense is a small table plus a single `test -L` gate for non-Edit workspace modifications. The heavier CI/pre-commit guard is deferred.

Orthogonal edits: Not present. The CI backlog is adjacent but directly tied to the same symlink-integrity failure mode and is staged as deferred rather than implemented.

Imperative-over-declarative: Acceptable. The discipline list is procedural, but it also states verifiable invariants: workspace skill paths must remain symlinks (`test -L` exit code 0), tracked workspace symlink mode must remain `120000`, and bulk rewrites should hit canonical regular files directly.

## Preserve list

Preserve the iter2 mirror-canonical policy: `.gobbi/projects/gobbi/skills/` is canonical storage and `.claude/skills/` is the symlink runtime layer.

Preserve the iter3 qualifier: the "same physical file" claim applies to inode-preserving edit methods, not rewrite-by-rename tools.

Preserve the safety table and the four-point executor discipline in the mirror-policy decision.

Preserve the deferred CI/pre-commit backlog and its Principle 10 rationale; do not implement it inside Bundle B unless a trigger fires.

Preserve the old mirror decision and sync backlog as superseded/moot audit records.

Preserve the D-4 5-vs-7 workflow-doc clarification from iter2.

## Findings

No new Overall-stage iter3 findings.

## Iter2 Overall finding disposition

ID: COD-OVERALL-PREP2-001
disposition: addressed
evidence: Planning now has the requested surgical clarification: safe inode-preserving default (`Edit`), canonical mirror path for bulk rewrites, unsafe rewrite-by-rename warning, `test -L` verification, restore guidance, and deferred durable CI guard. The fix addresses the same root cause behind Structure, Usage, Consistency, Risk, and Overall iter2 findings.

VERDICT: PASS
