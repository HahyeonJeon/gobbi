# Risk Evaluation - Planning iter2

## Artifact Summary + Memory Reads

Evaluated `draft-iter2.md` for blast radius, rollback, verification risk, and interruption safety. The risk lens focuses on whether iter2 removed the two Codex High risks from iter1: wrong rollback behavior and a required unavailable shellcheck executable.

Memory reads: `draft-iter2.md`; Ideation `draft-iter3.md:275-295`; iter1 Codex `risk.md`; iter1 Claude `risk.md`; empirical checks for shellcheck, symlink depth, stub rule/mistake location, `git -C.*rm`, and `requires:`; project rule and listed mistakes.

## Locked Frame (Stage 1)

Scenario R1: Promote-now rollback failure is reversible.
- Check: copied skill body is removed after failed commit.
- Check: user is asked before re-attempt or abort.
- Check: plan does not promise git checkout restoration for a file that did not pre-exist.

Scenario R2: Shell-script verification cannot fail solely because shellcheck is absent.
- Check: shellcheck is empirically absent.
- Check: Tasks 07/08 have an always-run fallback.

Scenario R3: Orthogonal shared-file edits are sequenced to reduce lost-edit risk.
- Check: Task 07 is gated behind 05 and 06.
- Check: Task 10 is gated behind 06, 07, and 08.

Scenario R4 (adversarial): Fixes could introduce a broader blast radius than the iter1 problem.
- Check: no task adds destructive commands outside the specific rollback path.
- Check: no dependency change makes unrelated tasks depend on scripts unnecessarily.

## Per-scenario Per-check Results

R1: yes. `draft-iter2.md:173` requires `git -C "$worktreePath" rm <copied-paths>` before AskUserQuestion and explicitly rejects git checkout/auto-revert.

R2: yes. Empirical shellcheck check returned `shellcheck-exit: 1`; `draft-iter2.md:285-286` and `:309-310` make `bash -n` the always-run gate and shellcheck conditional.

R3: yes. `draft-iter2.md:276`, `:347`, `:388`, `:391`, and `:399` now graph-enforce the previously prose-only ordering.

R4: yes. The only new destructive command is scoped to removing copied paths in the rollback sequence (`draft-iter2.md:173`). Task 09 remains dependent only on Task 07 (`draft-iter2.md:323`), so unrelated settings work is not blocked by Task 08.

## Typed Findings

### rollback-semantics-drift-from-ideation

- finding-id: rollback-semantics-drift-from-ideation
- type: design_flaw
- domain: docs-sync
- disposition: addressed
- confidence: 98
- severity: High
- evidence: The old "no auto-rm" risk is gone; `draft-iter2.md:173` requires copied-file removal via `git -C "$worktreePath" rm <copied-paths>` before AskUserQuestion, matching Ideation `draft-iter3.md:283`.
- surfaced-by: codex
- inherited-from: iter1/risk-rollback-semantics-drift-from-ideation

### shellcheck-verifier-not-runnable

- finding-id: shellcheck-verifier-not-runnable
- type: design_flaw
- domain: test
- disposition: addressed
- confidence: 98
- severity: High
- evidence: shellcheck is absent (`shellcheck-exit: 1`), but Tasks 07 and 08 now always run `bash -n` and gate shellcheck behind `command -v shellcheck` at `draft-iter2.md:285-286` and `:309-310`.
- surfaced-by: codex
- inherited-from: iter1/risk-shellcheck-verifier-not-runnable

## Low-confidence Appendix

Claude iter1 risk concerns about shared-delegation rollback boundaries and hook self-failure noise are still worth a manager note, but they are pre-existing Medium concerns outside the five surgical fixes and are not new High/Critical risks introduced by `draft-iter2.md`.

VERDICT: PASS
