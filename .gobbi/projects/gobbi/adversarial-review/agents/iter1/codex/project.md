## Artifact Summary + W/W/H (Stage 0)

Artifact bundle: `.gobbi/projects/gobbi/agents/{manager,leader,executor,evaluator,assistant}.md`, read as one v0.5.0 5-role agent taxonomy. What: define the manager, leader, executor, evaluator, and assistant roles plus their model defaults and operational boundaries. Why: replace the v0.4.x PI/researcher/evaluator/gobbi-agent taxonomy with fewer functional roles that are dispatched through delegation templates. How: each role doc declares identity, out-of-scope boundaries, load order, lifecycle, status contract, red flags, and quality expectations; `.gobbi/projects/gobbi/skills/delegation/SKILL.md` and its templates are the intended dispatch realization. W/W/H gate: What clear; Why clear from the review brief plus delegation roster; How mostly clear in prose, but downstream runtime/mirror realization is materially inconsistent and is evaluated below.

## Memory reads register

- Loaded repository guidance: `.claude/CLAUDE.md`, `.claude/README.md`; `.claude/rules/` does not exist in this worktree.
- Loaded required skills: `.gobbi/projects/gobbi/skills/evaluation/SKILL.md`, `.gobbi/projects/gobbi/skills/ideation/evaluation.md`, `.gobbi/projects/gobbi/skills/principles/SKILL.md`, `.gobbi/projects/gobbi/skills/delegation/SKILL.md`.
- Read artifact bundle in full: `.gobbi/projects/gobbi/agents/manager.md`, `leader.md`, `executor.md`, `evaluator.md`, `assistant.md`.
- Read realization templates: `.gobbi/projects/gobbi/skills/delegation/templates/{leader,executor,evaluator,assistant}.md`.
- Read project rule: `.gobbi/projects/gobbi/rules/stub-redirect-format.md`.
- Read applicable mistakes: `delegation-discipline.md`, `spec-delegation-agents-metadata-only.md`, `executor-boundary-extension-without-asking.md`, `codex-overall-perspective-hangs.md`, `verdict-events-only-from-eval-steps.md`, `historical-context-block-must-use-functional-naming.md`, `skills-agents-3-layer-mirror.md`.
- Verification reads: `packages/cli/src/specs/{ideation,evaluation,execution}/spec.json`, `packages/cli/src/workflow/predicates.ts`, `.claude/settings.json`, `plugins/gobbi/agents/`, `.claude/agents/`.
- Prior iteration: not applicable; ITER 1, no prior-iter inheritance.

## Locked Frame (Stage 1)

Frame additions emitted:
- PJ-SG-001 | Type: scenario_gap | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: Medium | Evidence: Stage 1 added cross-layer retirement scenario because the artifact claims replacement of v0.4.x agents while the ideation seed requires checking adjacent feature/scope overlap.
- PJ-CG-001 | Type: checklist_gap | Domain: process | Disposition: open | Confidence: 100 | Severity: Medium | Evidence: Stage 1 added evaluator-recursion and dead-end escalation checks from adversarial probes 1, 2, 5, and 10.

Scenario PJ-1 - Replacement scope is actually realized across live surfaces.
- Check PJ-1.1: New role docs exist for exactly manager, leader, executor, evaluator, assistant.
- Check PJ-1.2: Old v0.4.x roles are not still authorized by runtime specs, mirrors, or plugin entrypoints.
- Check PJ-1.3: Runtime model defaults match the taxonomy statement.

Scenario PJ-2 - Manager/Leader boundary handles a Leader dead-end without silent scope drift.
- Check PJ-2.1: Leader has a clear route for wrong premise, contradictory evidence, or missing context.
- Check PJ-2.2: Manager is responsible for re-contracting rather than letting the Leader continue ad hoc.
- Check PJ-2.3: The artifact says what happens if a single Leader creates a weak or one-sided direction.

Scenario PJ-3 - Evaluator independence has a second-order closure.
- Check PJ-3.1: Evaluator cannot evaluate its own work.
- Check PJ-3.2: At least one path exists to review evaluator outputs or evaluator role docs without circular self-review.

Scenario PJ-4 (adversarial) - A stale old-role contract quietly wins over the new taxonomy.
- Check PJ-4.1: Grep of runtime specs finds no `pi`, `project-evaluator`, `agent-evaluator`, `skills-evaluator`, `researcher`, or `gobbi-agent` live routing.
- Check PJ-4.2: Plugin and Claude mirror symlinks point to the new five role docs.
- Check PJ-4.3: Canonical `.claude/CLAUDE.md` no longer teaches the retired dual-stance PI path.

Coverage declarations: Accessibility/i18n/privacy/licensing/supply chain/error budget are not directly Project-owned for this text-only taxonomy. Cost is handled under Performance/Risk; docs-sync is Project-relevant because replacement scope includes cross-layer docs/runtime coherence.

## Stage 2 Findings

Scenario PJ-1 results:
- PJ-1.1: Yes. Evidence: `.gobbi/projects/gobbi/agents/` contains five source docs, and `.claude/agents/` points to `manager.md`, `leader.md`, `executor.md`, `evaluator.md`, `assistant.md`.
- PJ-1.2: No. Evidence: `packages/cli/src/specs/ideation/spec.json:7` still allows `["pi"]`; `packages/cli/src/specs/evaluation/spec.json:6` still allows `["project-evaluator", "agent-evaluator", "skills-evaluator"]`; `plugins/gobbi/agents/` still has dangling old-role symlinks to `gobbi-agent.md`, `pi.md`, `agent-evaluator.md`, `researcher.md`, `project-evaluator.md`, and `skills-evaluator.md`.
- PJ-1.3: No. Evidence: `.gobbi/projects/gobbi/agents/executor.md:5` sets `model: sonnet`, while `packages/cli/src/specs/execution/spec.json:23-25` configures executor as `modelTier: "opus", effort: "max"`.

Scenario PJ-2 results:
- PJ-2.1: Yes. Evidence: `leader.md:108-111` defines DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED, and `leader.md:82` says to trigger USER CHALLENGE when planning disagrees with the ideation direction.
- PJ-2.2: Yes. Evidence: `manager.md:95-97` says stop on conflict, never auto-apply evaluator findings, and use the 3-strike rule.
- PJ-2.3: No. Evidence: `delegation/SKILL.md:45` and `:218` say single leader per dispatch, while the bundle has no explicit compensating mechanism for lost innovative/best stance diversity beyond Leader self-stress-test language in `leader.md:64-67`.

Scenario PJ-3 results:
- PJ-3.1: Yes. Evidence: `evaluator.md:20-24` excludes implementing fixes, confirming success, multiple perspectives, and the author's transcript; `evaluation/SKILL.md:51-53` says creators never evaluate their own output.
- PJ-3.2: No. Evidence: `rg` for evaluator-review/meta-evaluation terms across the agent, delegation, and evaluation docs found only unrelated "leader self-review" text in `leader.md:92`; no contract says who reviews evaluator artifacts or evaluator role changes.

Scenario PJ-4 results:
- PJ-4.1: No. Evidence: old agent names remain in `packages/cli/src/specs/ideation/spec.json:7`, `packages/cli/src/specs/evaluation/spec.json:6`, and `packages/cli/src/workflow/predicates.ts:137-142`.
- PJ-4.2: No. Evidence: `find -L plugins/gobbi/agents -maxdepth 1 -type l` reports dangling old-role symlinks to `.claude/agents/{gobbi-agent,pi,agent-evaluator,researcher,project-evaluator,skills-evaluator}.md`.
- PJ-4.3: No. Evidence: `.claude/CLAUDE.md:15` still says "PI agents (innovative + best stances)" investigate ideation.

Typed findings:
- P-001 | Type: design_flaw | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: Critical | Evidence: v0.4 role names remain in live specs and plugin symlinks: `ideation/spec.json:7`, `evaluation/spec.json:6`, `workflow/predicates.ts:137-142`, and `plugins/gobbi/agents/*` dangling symlink output. FP-check: not out-of-scope because the review brief says the 5-role taxonomy replaces v0.4.x agents.
- P-002 | Type: design_flaw | Domain: process | Disposition: open | Confidence: 75 | Severity: High | Evidence: single Leader is mandated in `delegation/SKILL.md:45` and `:218`, but stale `.claude/CLAUDE.md:15` and `ideation/spec.json:29-44` still encode dual PI stances; no new single-Leader anti-groupthink acceptance criterion replaces them. FP-check: not a preference; it changes the ideation quality-control mechanism.
- P-003 | Type: assumption_risk | Domain: process | Disposition: open | Confidence: 50 | Severity: Medium | Evidence: evaluator independence is required (`evaluation/SKILL.md:51-53`), but no matching second-order evaluator-review route was found by `rg` across role/delegation/evaluation docs. FP-check: absence-based, so confidence capped at 50.
- P-004 | Type: design_flaw | Domain: cost | Disposition: open | Confidence: 100 | Severity: High | Evidence: executor source default is sonnet (`executor.md:5`) but execution runtime spec uses `modelTier: "opus"` (`execution/spec.json:23-25`). FP-check: tool-verified config drift, not speculative.

Per-perspective verdict: FAIL. P-001 is Critical with confidence 100.

## Low-confidence appendix

- LC-P-001 | Type: assumption_risk | Domain: process | Disposition: open | Confidence: 25 | Severity: Medium | Evidence: It is possible the runtime specs are intentionally deferred outside this artifact bundle, but the review brief states this taxonomy "replaces" the prior agents, and project mistake `skills-agents-3-layer-mirror.md` says all layers must update on rename. Suppressed because no implementation plan was provided with the role docs.
