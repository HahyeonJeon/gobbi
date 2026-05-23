# Codex Evaluation Iter2 - Usage

## Artifact Summary + Memory reads

Artifact: `ideation/rawdata/draft-iter2.md`, Bundle A Ideation draft. Usage lens focuses on whether the Planner, Executor, and future Gobbi manager can follow the proposed behavior without re-asking avoidable questions. Memory reads included required Gobbi skill docs, iter1 Codex Usage finding, target draft, and `orchestration/templates/settings.default.json`.

Fresh verification:
- `jq '.mode' /playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json` returned `"auto"`.

## Locked Frame (Stage 1)

Scenario U1: Bootstrap mode question default matches real settings.
- Check: Draft reports `auto`, not `Chat`, as default.
- Check: Eval-mode and git-mode are moved to settings/customize, not standalone bootstrap questions.

Scenario U2 (adversarial): A future manager reads the draft and asks the wrong setup question.
- Check: Design G gives exact question shape.
- Check: The non-existent configuration child doc is not used as a required target.

## Per-scenario per-check results

U1: PASS. Iter2 lines 33, 67, 100, 542-544, 554, and 573 state mode default `auto` and remove standalone eval-mode/git-mode bootstrap questions. Fresh `jq '.mode'` confirms `"auto"`.

U2: PASS. Iter2 lines 550 and 575 explicitly replace the non-existent `workflow/configuration.md` reference with `orchestration/SKILL.md` Step 1. Fresh `find .claude/skills/orchestration/workflow -name 'configuration*'` returned no files.

## Typed findings

### COD-USAGE-001 - Mode question default conflicts with existing settings default
- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `addressed`
- Confidence: 100
- Severity: High
- Evidence: Iter2 Design G line 542 states default `auto`; `jq '.mode'` on the live settings template returns `"auto"`.
- Resolution status: RESOLVED.

Counts: Critical 0 / High 0 / Medium 0 / Low 0 / Nit 0.

Verdict: PASS

## Low-confidence appendix

None.
