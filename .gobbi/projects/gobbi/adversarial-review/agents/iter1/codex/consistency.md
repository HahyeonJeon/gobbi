## Artifact Summary + W/W/H (Stage 0)

Artifact bundle: five role docs plus the delegation skill/templates that realize the taxonomy. What: source-of-truth role taxonomy. Why: replace v0.4.x agent names and dual-stance dispatch with five functional roles. How: mirrored docs, runtime specs, settings, templates, and `.claude` guidance must all agree. W/W/H gate: clear; consistency is the dominant failure surface.

## Memory reads register

- Loaded `.claude/CLAUDE.md`, `.claude/README.md`, required skills, all five role docs, delegation templates, project rule, and relevant mistakes.
- Ran `rg` for old/new role names and perspective names across `.gobbi/projects/gobbi/agents`, `delegation`, `.claude/CLAUDE.md`, `packages/cli/src/specs`, `packages/cli/src/workflow`, `.claude/settings.json`, and `plugins/gobbi`.
- Ran `find` against `.claude/agents`, `.gobbi/projects/gobbi/agents`, and `plugins/gobbi/agents` to check symlink targets.
- Prior iteration: not applicable for ITER 1.

## Locked Frame (Stage 1)

Frame additions emitted:
- CO-SG-001 | Type: scenario_gap | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: Medium | Evidence: Stage 1 added 4-layer mirror scenario from `skills-agents-3-layer-mirror.md`.
- CO-CG-001 | Type: checklist_gap | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: Medium | Evidence: Stage 1 added canonical `.claude` and runtime-spec checks because AGENTS.md says `.claude` is source of truth for Codex agents.

Scenario CO-1 - Source role docs and delegation skill agree.
- Check CO-1.1: Delegation roster names the same five roles.
- Check CO-1.2: Model table agrees with role frontmatter.
- Check CO-1.3: Template perspective/status schema agrees with role docs and evaluation skill.

Scenario CO-2 - `.claude` guidance agrees with the new taxonomy.
- Check CO-2.1: `.claude/agents` mirrors the new five role docs.
- Check CO-2.2: `.claude/CLAUDE.md` no longer describes v0.4 dual PI stances.
- Check CO-2.3: `.claude/settings.json` does not authorize retired agents.

Scenario CO-3 - Runtime specs agree with the new taxonomy.
- Check CO-3.1: Productive specs no longer allow `pi`.
- Check CO-3.2: Evaluation specs no longer allow old evaluator agent types.
- Check CO-3.3: Predicates no longer look for old agent types.

Scenario CO-4 (adversarial) - Plugin mirror keeps distributing old agents.
- Check CO-4.1: `plugins/gobbi/agents` symlinks point to existing new role files.
- Check CO-4.2: No dangling old-agent symlinks remain.

Coverage declarations: Privacy/licensing not applicable; docs-sync is primary. License/IP risk is N/A because no external dependency or copied code introduced.

## Stage 2 Findings

Scenario CO-1 results:
- CO-1.1: Yes. Evidence: `delegation/SKILL.md:217-221` lists manager, leader, executor, evaluator, assistant.
- CO-1.2: Mostly yes in source docs: manager/leader/evaluator opus and executor/assistant sonnet match `delegation/SKILL.md:181-185`; runtime execution spec still conflicts.
- CO-1.3: No. Evidence: evaluator role/template schema and perspective names conflict with `evaluation/SKILL.md`.

Scenario CO-2 results:
- CO-2.1: Yes. Evidence: `.claude/agents/{manager,leader,executor,evaluator,assistant}.md` symlink to `.gobbi/projects/gobbi/agents/...`.
- CO-2.2: No. Evidence: `.claude/CLAUDE.md:15` still instructs PI agents with innovative + best stances.
- CO-2.3: Yes for settings. Evidence: `.claude/settings.json:20-24` authorizes only new five roles.

Scenario CO-3 results:
- CO-3.1: No. Evidence: `packages/cli/src/specs/ideation/spec.json:7` allows `pi`.
- CO-3.2: No. Evidence: `packages/cli/src/specs/evaluation/spec.json:6` allows `project-evaluator`, `agent-evaluator`, `skills-evaluator`.
- CO-3.3: No. Evidence: `packages/cli/src/workflow/predicates.ts:137-142` still checks `agentType === 'pi'`.

Scenario CO-4 results:
- CO-4.1: No. Evidence: plugin symlinks point to `.claude/agents/gobbi-agent.md`, `pi.md`, `agent-evaluator.md`, `researcher.md`, `project-evaluator.md`, `skills-evaluator.md`.
- CO-4.2: No. Evidence: `find -L plugins/gobbi/agents -maxdepth 1 -type l` reports those six old symlinks as dangling.

Typed findings:
- C-001 | Type: design_flaw | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: Critical | Evidence: new source docs exist, but canonical `.claude/CLAUDE.md:15`, runtime specs (`ideation/spec.json:7`, `evaluation/spec.json:6`), predicate code (`workflow/predicates.ts:137-142`), and plugin symlinks still encode v0.4 roles. FP-check: project mistake `skills-agents-3-layer-mirror.md` says source, Claude mirror, plugin mirror, and runtime layer must all update together.
- C-002 | Type: design_flaw | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: High | Evidence: evaluator schema mismatch: `evaluator.md:75-82` and `templates/evaluator.md:88-101` vs `evaluation/SKILL.md:294-314`. FP-check: direct contradiction.
- C-003 | Type: design_flaw | Domain: docs-sync | Disposition: open | Confidence: 100 | Severity: High | Evidence: perspective-name drift: `evaluator.md:12` and `templates/evaluator.md:8` include architecture/user, while canonical evaluation names Structure/Usage (`evaluation/SKILL.md:87-94`). FP-check: exact terminology mismatch.
- C-004 | Type: design_flaw | Domain: cost | Disposition: open | Confidence: 100 | Severity: High | Evidence: source default for executor is sonnet (`executor.md:5`), but execution runtime config is opus/max (`execution/spec.json:23-25`). FP-check: tool-verified config drift.

Per-perspective verdict: FAIL. C-001 is Critical with confidence 100.

## Low-confidence appendix

- LC-C-001 | Type: assumption_risk | Domain: regression | Disposition: open | Confidence: 25 | Severity: Medium | Evidence: The migration test fixtures still mention old agent names, but some may intentionally cover historical migration compatibility.
