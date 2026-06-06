# Codex adversarial evaluation — Task 02: executor default model → opus

You are an independent adversarial evaluator. DO NOT TRUST claims — verify by reading files + running commands. Find problems; do not fix them.

## What changed (verify, don't trust)
Commit `98c91b8` on worktree branch `chore/session-2026-06-05-0a9c813f` sets the executor agent's default model to **opus** everywhere it was `sonnet`, and reframes the model-selection rationale so ONLY the read-only `assistant` is sonnet (all substantive roles — manager/leader/executor/evaluator — are opus). This closes the executor-half of a model-assignment drift; the templates already had `claude.executor: opus`.

## Verify (semantic sweep — the iter1 of the prior task missed files via narrow grep)
1. `git show 98c91b8` / `git diff develop..HEAD -- skills/ agents/`.
2. Confirm executor=opus is now stated consistently in: `skills/delegation/SKILL.md` (principle ~:280, rationale ~:282, model table ~:288, roster ~:326), `skills/gobbi/SKILL.md` (taxonomy ~:148, operating bullets ~:238-239), `skills/planning/SKILL.md:248`, and `agents/executor.md` frontmatter `model:`.
3. **Completeness sweep:** `grep -rniE "executor" skills/ agents/ | grep -iE "sonnet|opus|model"` — read every hit. Is there ANY remaining place (outside immutable `notes/`/`sessions/`/`archive/`/`mistakes/`/`backlogs/`) that still says executor=sonnet, or any leftover "contract-bounded … executor" framing, or any sentence implying executor is sonnet/contract-bounded that the reframe missed?
4. **Internal consistency:** does the reframed rationale read coherently — no self-contradiction (e.g. a principle sentence saying "contract-bounded gets sonnet" while the table says executor=opus)? Plain-language (Principle 14)?
5. **Invariants:** `assistant` must STILL be sonnet everywhere (delegation table/roster, gobbi, planning, `agents/assistant.md`). `evaluator`/`leader`/`manager` unchanged (opus). Settings templates NOT modified by this commit (`git show 98c91b8 --stat` shows no `templates/*.json`).

## Output (workspace-write under this worktree)
Write `.gobbi/projects/gobbi/sessions/2026-06-05-0a9c813f-c83b-48d7-925d-0075ce818d54/execution/task-02/evaluation/iter1/codex/overall.md` with `VERDICT: PASS|REVISE|FAIL`, rationale, and findings (type ∈ {scenario_gap, checklist_gap, design_flaw, assumption_risk, general}, severity, file:line). PASS if executor=opus is consistent everywhere, assistant stays sonnet, rationale is coherent, and no file was missed. Be specific with evidence.
