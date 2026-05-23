# Codex Evaluation Iter2 - Structure

## Artifact Summary + Memory reads

Artifact: `ideation/rawdata/draft-iter2.md`, Bundle A Ideation draft. The draft is structurally organized as Scope Contract, Framed Problem, Research Insights, Scenarios, Implementation Checklist, Design A-G, and Decisions Log. Memory reads included the required principles, project rule, mistake file, evaluation rubric, ideation evaluation child doc, iter1 Codex Structure findings, and the target draft. Fresh canonical check: `nl -ba /playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/evaluation/SKILL.md | sed -n '329,393p'`.

## Locked Frame (Stage 1)

Scenario S1: Step 2.5 classification uses canonical evaluation metadata.
- Check: Type vocabulary matches the live `evaluation/SKILL.md`.
- Check: Mechanical versus judgment-required routing is implementable.
- Check: Deprecated or non-existent Type names are not introduced.

Scenario S2 (adversarial): A reader can implement Step 2.5 without inventing missing semantics.
- Check: Routing decisions have a real destination in the current rubric.
- Check: Collision behavior references the existing slug policy.

## Per-scenario per-check results

S1: FAIL. The live canonical Type set at `evaluation/SKILL.md` lines 344-352 is `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, and `general`. Iter2 lines 32, 224, 307, 363, 488-491, 506, 512, and 570 instead claim the actual 5 Types are `improvement`, `bug`, `scenario_gap`, `checklist_gap`, and `design_flaw`. `improvement` and `bug` are not Type values in the loaded rubric. `assumption_risk` and `general` are omitted.

S2: PARTIAL. Iter2 did add the slug collision pre-write policy at lines 492-498, matching `evaluation/SKILL.md` lines 385-393. But the Step 2.5 routing remains structurally unsound because it is built on non-existent Type values and mentions destinations such as `staging/improvements/{slug}.md` at line 489, which are not destinations in the live routing table.

## Typed findings

### COD-STRUCT-001 - Step 2.5 classification uses non-existent finding types
- Type: `design_flaw`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: Live `evaluation/SKILL.md` lines 344-352 define the Type set as `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`. Iter2 lines 32, 224, 307, 363, 488-491, and 570 assert `improvement` and `bug` as canonical Types and omit `assumption_risk` / `general`.
- Impact: Planning/Execution would implement Step 2.5 against a taxonomy that does not exist, so the wrap-up auto-backfill contract would need rework.
- Resolution status: UNRESOLVED.

Counts: Critical 0 / High 1 / Medium 0 / Low 0 / Nit 0.

Verdict: REVISE

## Low-confidence appendix

None.
