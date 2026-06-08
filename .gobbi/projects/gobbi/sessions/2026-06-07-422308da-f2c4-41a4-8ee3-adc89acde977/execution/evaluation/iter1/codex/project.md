## Artifact Summary + Memory reads

Artifact: docs-only implemented diff `HEAD~3..HEAD` on branch `claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977`.

What: harden Auto-mode evaluation discipline across `.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md`, `.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`, and `.claude/CLAUDE.md`.

Why: fix three manager misbehaviors from the locked Idea: invented evaluation-policy question, manager self-evaluation, and Auto-mode defer/idling on routine findings.

How: T1 sharpened and mode-split `workflow/evaluation.md`; T2 appended `auto-mode.md` section 7 and pointers; T3 reconciled the `.claude/CLAUDE.md` evaluation paragraph; T4 verified cross-file consistency.

Memory reads: `planning/artifacts/plan.md`, `ideation/artifacts/idea.md`, `.agents/skills/evaluation/SKILL.md`, `.agents/skills/execution/evaluation.md`, `.agents/skills/principles/SKILL.md`, `.agents/skills/mistake/SKILL.md`, `.gobbi/projects/gobbi/mistakes/*.md`, `.gobbi/projects/gobbi/rules/stub-redirect-format.md`. Applicable mistakes included `evaluator-false-pass-without-diffing.md`, `dual-system-codex-caught-template-form-gaps-claude-missed.md`, `section-order-is-part-of-the-contract-not-just-the-set.md`, `cotouch-enumeration-must-cover-semantic-equivalents.md`, and `principle-text-lead-with-imperative-not-agent-psychology.md`. No prior execution iter existed.

## Locked Frame (Stage 1)

Scenario: the diff matches the locked Plan scope.
- Check: only the three in-scope files are in `git diff HEAD~3..HEAD`.
- Check: out-of-scope `orchestration/SKILL.md`, `chat-mode.md`, and `principles/SKILL.md` are not in the diff.
- Check: no unrelated cleanup appears.

Scenario: the three root problems are fixed.
- Check: pre-evaluation `dual-system / claude-only / skip` is forbidden.
- Check: the manager cannot self-evaluate and must spawn exactly two evaluators.
- Check: Auto-mode REVISE routine triage auto-iterates, records, and surfaces at Wrap-up.

Scenario: the Plan acceptance criteria T1-T4 are met.
- Check: T1(a)-(h), T2(a)-(g), T3(a)-(e), and T4(a)-(i) are verified against the final files.

Adversarial scenario: the executor report claims PASS but the actual diff has scope drift.
- Check: `git diff --name-only HEAD~3..HEAD` and full diff were read directly.

## Per-scenario per-check results

Scope: PASS. `git diff --name-only HEAD~3..HEAD` returned only `.claude/CLAUDE.md`, `.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`, and `.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md`.

Root fixes: PASS. `auto-mode.md:281-289` forbids asking whether/how to evaluate and says `claude-only` is post-failure only. `auto-mode.md:291-299` and `workflow/evaluation.md:5,40-49` forbid manager self-evaluation and require exactly two evaluator agents. `auto-mode.md:301-327`, `workflow/evaluation.md:245,252,264`, and `.claude/CLAUDE.md:27` mode-split routine triage and Auto REVISE behavior.

Plan criteria: PASS. The requested grep checks were run. Section order is `auto-mode.md:14,44,158,198,232,253,275`. The `orchestration/SKILL.md` pointer remains at line 266 and still names `auto-mode.md §3` and `§6`. `chat-mode.md` is unedited; its only grep hit for `regression` is generic prose at line 564, not the evaluation Regression-marking rule.

Adversarial scope drift: PASS. `git diff --check HEAD~3..HEAD` passed. `git status --porcelain` before writing these outputs showed only the session directory as untracked; targeted out-of-scope status checks were empty.

## Typed findings

No Project findings.

## Low-confidence appendix

None.

Verdict: PASS
