## Artifact Summary + W/W/H (Stage 0)

Artifact bundle: `.gobbi/projects/gobbi/agents/{manager,leader,executor,evaluator,assistant}.md`, plus delegation realization docs. What: a five-role taxonomy with default models manager/leader/evaluator opus and executor/assistant sonnet. Why: reduce and clarify v0.5.0 agent roles. How: use deterministic delegation templates, fresh-context subagents, single Leader dispatch, per-task Executors, multi-perspective Evaluators, and read-only Assistants. W/W/H gate: clear enough for performance/cost review; the key performance dimension is token/model cost, not runtime CPU.

## Memory reads register

- Loaded `.claude/CLAUDE.md`, `.claude/README.md`, required evaluation/ideation/principles/delegation skills, all five role docs, four delegation templates, project rule, and applicable mistakes listed in `project.md`.
- Additional performance evidence: `packages/cli/src/specs/execution/spec.json`, `packages/cli/src/specs/evaluation/spec.json`, `packages/cli/src/specs/execution/README.md`, `packages/cli/src/lib/settings.ts`, and `codex-overall-perspective-hangs.md`.
- Prior iteration: not applicable for ITER 1.

## Locked Frame (Stage 1)

Frame additions emitted:
- PF-SG-001 | Type: scenario_gap | Domain: cost | Disposition: open | Confidence: 100 | Severity: Medium | Evidence: Stage 1 added explicit token/model-cost scenario from Coverage Matrix cost ownership and adversarial probes 4 and 6.
- PF-CG-001 | Type: checklist_gap | Domain: performance | Disposition: open | Confidence: 100 | Severity: Medium | Evidence: Stage 1 added scale checks for 20+ task plans and seven-perspective evaluation.

Scenario PF-1 - Model defaults are cost-realistic.
- Check PF-1.1: Source role defaults match runtime spec defaults.
- Check PF-1.2: Expensive opus defaults are scoped to decision-heavy work with a concrete override path.
- Check PF-1.3: The docs name cost/budget impact for all-opus evaluation.

Scenario PF-2 - Executor fresh-per-task cost scales with large plans.
- Check PF-2.1: Per-task executor policy is explicit.
- Check PF-2.2: There is a batching or chunking rule for 20+ tasks that avoids waste without parallel implementation.
- Check PF-2.3: Each executor reload burden is acknowledged.

Scenario PF-3 (adversarial) - Evaluation fans out into an avoidable cost runaway.
- Check PF-3.1: Evaluation perspective count is bounded.
- Check PF-3.2: If all seven perspectives are required, model tier policy accounts for token budget.
- Check PF-3.3: Known Codex Overall hang/cost mistake is reflected where relevant.

Scenario PF-4 - Cost settings actually reach dispatch.
- Check PF-4.1: Settings comments distinguish schema-reserved fields from consumed fields.
- Check PF-4.2: Agent-routing rendered prompt visibility is accounted for before claiming overrides work.

Coverage declarations: Cost/budget and error-budget impact are applicable and covered. CPU/memory/network performance is not applicable to text-only role docs except where runtime dispatch cost is affected.

## Stage 2 Findings

Scenario PF-1 results:
- PF-1.1: No. Evidence: `executor.md:5` sets sonnet, but `execution/spec.json:23-25` uses opus/max for executor.
- PF-1.2: Partial. Evidence: `delegation/SKILL.md:175-189` explains opus for manager/leader/evaluator and sonnet for executor/assistant, with explicit dispatch-time overrides. But runtime specs still disagree for executor.
- PF-1.3: No. Evidence: no cost/budget language appears in the role docs; cost is only implicit in model choices.

Scenario PF-2 results:
- PF-2.1: Yes. Evidence: `delegation/SKILL.md:46` says one executor per task and never parallelize implementation; `execution/spec.json:6-7` allows executor only with `maxParallelAgents: 1`.
- PF-2.2: No. Evidence: no role doc or template names a large-plan threshold, chunking rule, or "20+ tasks" handling.
- PF-2.3: No. Evidence: executor mandatory load includes principles, rules, mistake, execution workflow, execution skill, project/language/domain skills, and research materials (`executor.md:24-35`), but no cost acknowledgement is attached.

Scenario PF-3 results:
- PF-3.1: Partial. Evidence: `evaluation/SKILL.md:96` says all seven perspectives + Overall, while `delegation/SKILL.md:47` says spawn >=2 perspectives with Project + Overall always included. The taxonomy is internally mixed between all-seven and selected subset.
- PF-3.2: No. Evidence: `delegation/SKILL.md:181-185` makes evaluator opus, and `evaluation/SKILL.md:96` requires all seven perspectives + Overall. No exception threshold is stated.
- PF-3.3: No. Evidence: `codex-overall-perspective-hangs.md` advises explicit time-boxes and avoiding Codex Overall for very large diffs, but evaluator role/template does not surface any time-box or breadth cap.

Scenario PF-4 results:
- PF-4.1: Yes. Evidence: `settings.ts:132-135` says some discuss-agent settings are schema-reserved and not yet consumed; `settings.ts:150-155` defines evaluate-agent override fields.
- PF-4.2: Partial. Evidence: `spec-delegation-agents-metadata-only.md` records the rendered-prompt requirement, but the role docs themselves do not tell managers to verify rendered agent-routing when relying on overrides.

Typed findings:
- PF-001 | Type: design_flaw | Domain: cost | Disposition: open | Confidence: 100 | Severity: High | Evidence: executor default contradicts runtime: `executor.md:5`/`delegation/SKILL.md:183` say sonnet, but `execution/spec.json:23-25` says opus/max. FP-check: tool-verified drift in model config.
- PF-002 | Type: assumption_risk | Domain: cost | Disposition: open | Confidence: 75 | Severity: High | Evidence: evaluator defaults to opus (`delegation/SKILL.md:184`), while evaluation requires all seven perspectives + Overall (`evaluation/SKILL.md:96`) and no cost budget or downgrade rule is stated. FP-check: high because text directly combines expensive model default with full fan-out.
- PF-003 | Type: assumption_risk | Domain: performance | Disposition: open | Confidence: 75 | Severity: Medium | Evidence: one executor per task is explicit (`delegation/SKILL.md:46`, `execution/spec.json:6-7`), but no chunking/large-plan guidance exists for 20+ tasks. FP-check: impact is scale-dependent, so Medium.
- PF-004 | Type: checklist_gap | Domain: cost | Disposition: open | Confidence: 75 | Severity: Medium | Evidence: `codex-overall-perspective-hangs.md` contains concrete time-box guidance for Codex reviews, but evaluator role/template has no time-box or breadth cap. FP-check: advisory mistake, not universal runtime defect.

Per-perspective verdict: REVISE. PF-001 and PF-002 are High with confidence >= 50.

## Low-confidence appendix

- LC-PF-001 | Type: assumption_risk | Domain: cost | Disposition: open | Confidence: 25 | Severity: Low | Evidence: Assistant sonnet may still be overused if managers delegate many narrow lookups instead of batching, but no artifact evidence shows that pattern.
