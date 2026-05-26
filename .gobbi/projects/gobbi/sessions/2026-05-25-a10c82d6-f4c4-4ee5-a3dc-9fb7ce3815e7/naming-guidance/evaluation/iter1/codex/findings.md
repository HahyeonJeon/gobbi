# Codex Adversarial Evaluation - Naming Guidance Iter 1

Target range: `f8a89cb..HEAD` (`5b5b0d8` guidance, `8e42fe2` renames).

Verification context:
- Confirmed target range has 2 commits and 28 renames.
- Confirmed `grep -c '## Principle 13' .gobbi/projects/gobbi/skills/principles/SKILL.md` returns `1`.
- Confirmed Principle 13 Iron Law and Iron Law Index row 13 remain `NO DOCUMENT WORK WITHOUT A SPEC AND A CRUD PLAN.`
- Confirmed `skills/memorization/rules.md` changes are confined to section 1.3; sections 1.1, 1.2, and section 2+ are unchanged.
- Confirmed no hard regex/blocklist gate was introduced; the text says "no regex gate" and allows content-word suffixes and date prefixes.
- Confirmed target range has 0 delete-only entries and no `sessions/` paths in `git diff --name-only f8a89cb..HEAD`.
- Confirmed main tree `develop` is still `82a51373ec14a669d6d0bd3ef184ba526a3e12f4`.

## Findings

[HIGH|design_flaw|95]
Residual positional task token remains in a new renamed filename.

Evidence:
- Running the requested residual scan from `.gobbi/projects/gobbi` returns exactly:
  - `features/agents/discussions/t2-scope-literal-vs-broader-verifier.md`
- The file frontmatter repeats the same residual token: `.gobbi/projects/gobbi/features/agents/discussions/t2-scope-literal-vs-broader-verifier.md:7` has `slug: t2-scope-literal-vs-broader-verifier`.
- The heading also keeps the positional label: line 14 begins `# T2 scope - ...`.

Why this matters:
The design and user brief explicitly require every new name to name the subject with no positional/sequence index or cryptic internal reference, and the brief specifically called out `t2-scope-literal-vs-broader-verifier` as a suspected residual. `t2-` is a task-code address from the old session context, not the subject. The subject appears to be the literal-ask scope decision versus broader verifier framing.

Required revision:
Rename the file and matching `slug:` to a subject-only name, for example `literal-ask-scope-vs-broader-verifier.md` or `delegation-verifier-scope-decision.md`, and update any references.

[HIGH|general|95]
Active inbound references to old slugs were not repointed.

Evidence from `rg` over active project memory excluding `sessions/` and `archive/`:
- `.gobbi/projects/gobbi/notes/2026-05-24-session-foundations-bundle-b.md:34` still points to `reviews/2026-05-24-execution-task-01-dual-system-eval.md`, but the review was renamed to `reviews/2026-05-24-worktree-create-config-step-dual-system-eval.md`.
- `.gobbi/projects/gobbi/features/workflow/changelogs/2026-05-26-bundle-a-rehome.md:24` still says `1 plan: 2026-05-23-main`, but the plan was renamed to `2026-05-23-orch-workflow-improvements.md`.
- `.gobbi/projects/gobbi/features/evaluation/discussions/eval-fail-revise-escalation.md:30` still references `staging/design/d-1-worktree-row-5-5.md` and `staging/design/d-3-3-resolver.md`.
- `.gobbi/projects/gobbi/features/install-runtime/discussions/mirror-policy-workspace-canonical-superseded.md:40` still references `preparation/staging/discussions/mirror-policy-round-2-re-lock.md`.
- `.gobbi/projects/gobbi/features/install-runtime/discussions/mirror-policy-mirror-canonical-relock.md:45` still references `preparation/staging/discussions/mirror-policy-round-1.md`.

Why this matters:
The design explicitly lists inbound reference repointing as part of the CRUD blast radius for the review, design, mirror-policy pair, and workflow plan rename. These are active project-memory files, not frozen session artifacts. Leaving active readers pointed at old slugs preserves exactly the stale positional/cryptic names this change is meant to remove.

Required revision:
Repoint these active references to the new subject-named files, or add an explicit historical-source wording if any reference intentionally points to a frozen staging artifact rather than the current promoted memory file.

[MEDIUM|general|90]
Renamed design files still carry cryptic `design-id: D-*` frontmatter instead of moving that identifier out of routable metadata.

Evidence:
- `.gobbi/projects/gobbi/features/git-workflow/design/worktree-create-before-session-stamp.md:6` has `design-id: D-1`.
- `.gobbi/projects/gobbi/features/git-workflow/design/qualified-git-write-path-rule.md:6` has `design-id: D-2`.
- `.gobbi/projects/gobbi/features/git-workflow/design/promote-now-commit-on-branch.md:6` has `design-id: D-3`.
- `.gobbi/projects/gobbi/features/git-workflow/design/per-iteration-session-commit-cadence.md:6` has `design-id: D-4`.
- `.gobbi/projects/gobbi/features/git-workflow/design/direct-mode-retained-opt-out.md:6` has `design-id: D-5`.
- The same pattern remains on all six renamed install-runtime design files: `D-3-1` through `D-3-6`.

Why this matters:
The rename design says frontmatter `slug:` and `design-id` fields are part of the blast radius, and that `design-id: D-*` may be kept only as a body historical marker, not as the routable identifier driving the file. The `slug:` fields were updated, but the cryptic D-family identifier remains in frontmatter across the renamed design set.

Required revision:
Either remove `design-id:` from frontmatter and preserve the old D-code only in body prose, or update the field to a subject-named identifier if the type still requires a frontmatter design identifier.

VERDICT: REVISE
