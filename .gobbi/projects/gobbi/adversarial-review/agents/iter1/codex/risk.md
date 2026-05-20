## Artifact Summary + W/W/H (Stage 0)

Artifact bundle: five-role taxonomy docs plus delegation realization docs. What: operational role definitions that affect user contact, writes, evaluation, and workflow dispatch. Why: make v0.5.0 agent delegation safer and simpler. How: manager-mediated delegation with fresh subagents, status contracts, model defaults, and role scope boundaries. W/W/H gate: clear; risk centers on blast radius if the taxonomy is partially adopted.

## Memory reads register

- Loaded `.claude/CLAUDE.md`, `.claude/README.md`, required skills, role docs, delegation skill/templates, project rule, and relevant mistakes.
- Risk-specific memory: `executor-boundary-extension-without-asking.md`, `delegation-discipline.md`, `skills-agents-3-layer-mirror.md`, `codex-overall-perspective-hangs.md`, `verdict-events-only-from-eval-steps.md`.
- Verification reads: old-role grep, plugin dangling symlink find, evaluator-review rg, assistant write-surface rg, model/cost spec reads.
- Prior iteration: not applicable for ITER 1.

## Locked Frame (Stage 1)

Frame additions emitted:
- RI-SG-001 | Type: scenario_gap | Domain: process | Disposition: open | Confidence: 100 | Severity: Medium | Evidence: Stage 1 added blast-radius and rollback checks because agent taxonomy docs are loaded by future agents.
- RI-CG-001 | Type: checklist_gap | Domain: privacy | Disposition: open | Confidence: 100 | Severity: Low | Evidence: Coverage Matrix requires explicit privacy/data-retention rationale even for text artifacts; declared N/A below where appropriate.

Scenario RI-1 - Partial taxonomy adoption has bounded blast radius.
- Check RI-1.1: Live runtime/mirror layers do not keep old roles active.
- Check RI-1.2: Rollback or compatibility stance is named.
- Check RI-1.3: Cross-agent contract drift has a detection mechanism.

Scenario RI-2 - Write surfaces are least-privilege.
- Check RI-2.1: Assistant stays read-only.
- Check RI-2.2: Evaluator stays read-only and findings-only.
- Check RI-2.3: Leader Write access is limited to artifacts.

Scenario RI-3 - Evaluation cannot ratify its own weak evidence.
- Check RI-3.1: Anti-trust block is mandatory.
- Check RI-3.2: Evaluator schema supports disposition/confidence/severity routing.
- Check RI-3.3: Evaluator outputs have some review/appeal path.

Scenario RI-4 (adversarial) - Cost or stale-role runaway burns budget before failing.
- Check RI-4.1: Expensive model fan-out has a budget cap.
- Check RI-4.2: Known Codex Overall hang pattern is mitigated.
- Check RI-4.3: Stale plugin/runtime roles cannot be spawned accidentally.

Coverage declarations: Privacy/data retention not-applicable: no new PII/persistence is designed by the role docs. License/IP not-applicable: no external code/dependency. Cost is applicable and covered. Security surface is role/tool write authority rather than auth.

## Stage 2 Findings

Scenario RI-1 results:
- RI-1.1: No. Evidence: runtime specs and plugin symlinks still keep old roles present (`ideation/spec.json:7`, `evaluation/spec.json:6`, plugin symlink find output).
- RI-1.2: No. Evidence: no role doc or delegation doc states a rollback/compatibility policy for v0.4 agents.
- RI-1.3: Partial. Evidence: project mistake `skills-agents-3-layer-mirror.md` names the detection pattern, but the role/delegation artifact does not embed a contract-drift detector.

Scenario RI-2 results:
- RI-2.1: No. Evidence: assistant read-only scope conflicts with "New mistake discovered -> write it" (`assistant.md:15`, `assistant.md:82`).
- RI-2.2: Yes. Evidence: evaluator tools are read/search/bash only (`evaluator.md:4`), and `evaluator.md:20-21` forbids fixes.
- RI-2.3: Yes. Evidence: `leader.md:14-15` forbids source-code writes and limits Write to ideation/preparation/research/planning artifacts.

Scenario RI-3 results:
- RI-3.1: Yes. Evidence: `delegation/SKILL.md:161-169` makes the evaluator anti-trust block mandatory and says not to paraphrase it.
- RI-3.2: No. Evidence: evaluator role/template use old schema without Domain/Disposition, conflicting with `evaluation/SKILL.md:294-314`.
- RI-3.3: No. Evidence: `rg` found no evaluator-output review path in role/delegation/evaluation docs.

Scenario RI-4 results:
- RI-4.1: No. Evidence: evaluator=opus (`delegation/SKILL.md:184`) plus all-seven evaluation (`evaluation/SKILL.md:96`) has no budget cap.
- RI-4.2: No. Evidence: `codex-overall-perspective-hangs.md` advises time-boxing, but evaluator template has no time-box slot.
- RI-4.3: No. Evidence: stale runtime specs/plugin symlinks remain.

Typed findings:
- R-001 | Type: design_flaw | Domain: regression | Disposition: open | Confidence: 100 | Severity: Critical | Evidence: stale old-role runtime specs and plugin symlinks mean the replacement can fail or dispatch missing agents at runtime. Evidence: `ideation/spec.json:7`, `evaluation/spec.json:6`, `workflow/predicates.ts:137-142`, plugin symlink find output. FP-check: not speculative; paths were tool-verified.
- R-002 | Type: design_flaw | Domain: process | Disposition: open | Confidence: 100 | Severity: High | Evidence: assistant read-only contract conflict (`assistant.md:15` vs `assistant.md:82`) creates write-surface contention with memorization/evaluator processes. FP-check: direct contradiction.
- R-003 | Type: assumption_risk | Domain: process | Disposition: open | Confidence: 50 | Severity: Medium | Evidence: no second-order evaluator-output review path found by rg; evaluator independence is asserted in `evaluation/SKILL.md:51-53`. FP-check: absence-based.
- R-004 | Type: assumption_risk | Domain: cost | Disposition: open | Confidence: 75 | Severity: High | Evidence: all-seven evaluation plus evaluator opus has no cap (`evaluation/SKILL.md:96`, `delegation/SKILL.md:184`), and `codex-overall-perspective-hangs.md` documents runaway review behavior. FP-check: text and project-memory supported.
- R-005 | Type: checklist_gap | Domain: docs-sync | Disposition: open | Confidence: 75 | Severity: Medium | Evidence: project mistake `skills-agents-3-layer-mirror.md` requires all layers on rename, but role/delegation docs lack a checklist item for cross-agent contract drift detection. FP-check: process checklist gap.

Per-perspective verdict: FAIL. R-001 is Critical with confidence 100.

## Low-confidence appendix

- LC-R-001 | Type: assumption_risk | Domain: security | Disposition: open | Confidence: 25 | Severity: Medium | Evidence: Manager frontmatter has `tools: "*"` (`manager.md:4`), but the root session may legitimately require broad tools; no concrete misuse path is shown.
