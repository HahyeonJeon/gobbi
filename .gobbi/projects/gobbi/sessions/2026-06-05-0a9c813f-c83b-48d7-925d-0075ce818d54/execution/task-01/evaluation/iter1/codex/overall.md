VERDICT: REVISE

Rationale: The core settings-template changes landed and parse correctly: both templates contain the requested evaluator-model values, `skip` keys, and `maxIterations` values, and the `.claude/` template symlink repair is valid. However, the documentation reconciliation is incomplete. Live orchestration docs still expose old cap values (`3`, `2`, `1`) and the old Codex evaluator default (`gpt-5`), and the Configuration customize procedure still omits the new step-level `skip` setting even though Chat preparation opt-in now requires clearing it. These are docs/schema/usage defects against locked scope D and the usage checks, so the change should revise before passing.

## Findings

1. **COD-USAGE-001** — `checklist_gap`, Severity: High, Evidence: `.gobbi/projects/gobbi/skills/orchestration/SKILL.md:109`; `.gobbi/projects/gobbi/skills/orchestration/chat-mode.md:166`.
   The Configuration customize procedure still says the manager collects per-step evaluation policy, discussion policy, `maxIterations`, models, and git workflow, but it does not include the new per-step `skip` boolean. That conflicts with the Chat opt-in path, which says preparation requires `skip: false` and `maxIterations > 0`; the documented customize gate does not tell the manager/config author to collect the setting needed for that path.

2. **COD-CONS-001** — `checklist_gap`, Severity: Medium, Evidence: `.gobbi/projects/gobbi/skills/orchestration/SKILL.md:167`; `.gobbi/projects/gobbi/skills/orchestration/SKILL.md:292`; `.gobbi/projects/gobbi/skills/orchestration/chat-mode.md:76`; `.gobbi/projects/gobbi/skills/orchestration/chat-mode.md:99`; `.gobbi/projects/gobbi/skills/orchestration/chat-mode.md:105`; `.gobbi/projects/gobbi/skills/orchestration/chat-mode.md:121`.
   The changed docs still contain old cap literals in canonical display/state-machine prose and the Chat ASCII workflow diagram: `1 / 3`, default `3`, `maxIter=2`, and `maxIter=1`. This contradicts the templates and nearby updated prose that now say the relevant caps are `5`.

3. **COD-CONS-002** — `checklist_gap`, Severity: Medium, Evidence: `.gobbi/projects/gobbi/skills/orchestration/workflow/ideation.md:141`; `.gobbi/projects/gobbi/skills/orchestration/workflow/preparation.md:133`; `.gobbi/projects/gobbi/skills/orchestration/workflow/planning.md:130`; `.gobbi/projects/gobbi/skills/orchestration/workflow/execution.md:101`; `.gobbi/projects/gobbi/skills/orchestration/workflow/wrap-up.md:60`; `.gobbi/projects/gobbi/skills/orchestration/workflow/wrap-up.md:68`; `.gobbi/projects/gobbi/skills/orchestration/workflow/memorization.md:289`; `.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md:256`.
   The live workflow subdocs under `skills/orchestration/workflow/` still document default caps as `3` for Ideation/Preparation/Planning/Execution and `1` for Wrap-up. The producer only updated the top-level mode docs, leaving downstream workflow references inconsistent with the new settings templates.

4. **COD-CONS-003** — `checklist_gap`, Severity: Medium, Evidence: `.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md:53`; `.gobbi/projects/gobbi/skills/orchestration/templates/settings.auto.json:48`; `.gobbi/projects/gobbi/skills/orchestration/templates/settings.chat.json:48`.
   `workflow/evaluation.md` still documents `models.codex.evaluator` as default `gpt-5`, while both updated settings templates set the Codex evaluator to `gpt-5.5`. This leaves docs and templates disagreeing on evaluator model selection.

## Verification Evidence

- `git log --oneline develop..HEAD` showed a single commit: `9f77f0e feat(orchestration): add step-level skip key, raise maxIterations to 5, lift evaluator models`.
- `jq -e` assertions passed for both settings templates: auto has all five workflow steps `skip:false` and `maxIterations:5`; chat has preparation `skip:true`, `maxIterations:0`, and all other workflow steps `skip:false`, `maxIterations:5`; both templates have `models.claude.evaluator == "opus"`, `models.codex.evaluator == "gpt-5.5"`, `models.codex.assistant == "gpt-5"`, and `models.claude.executor == "opus"`.
- `find .claude/skills/orchestration/templates -xtype l -print` returned no broken symlinks; `readlink` showed `settings.auto.json` and `settings.chat.json` point at the canonical `.gobbi/projects/gobbi/skills/orchestration/templates/` files; `settings.default.json` is absent.
- `grep -rn "settings.default.json" .gobbi/projects/gobbi/skills .gobbi/projects/gobbi/features .gobbi/projects/gobbi/design .gobbi/projects/gobbi/rules .gobbi/projects/gobbi/notes .claude` returned only immutable `notes/` mentions.
- `grep -rn "maxIterations: 0\|R1 lock" .gobbi/projects/gobbi/skills/orchestration` returned non-zero matches, confirming the R1/maxIterations-zero path still exists.
