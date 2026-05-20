## Artifact Summary + W/W/H

Artifact bundle: iter2 role taxonomy plus delegation/evaluator-template/mistake updates. What: operational docs that govern who may ask the user, write memory, evaluate work, and close sessions. Why: make the five-role taxonomy safe after iter1 failed. How: manager-owned decisions, assistant-owned Memorization/Wrap-up, read-only evaluation, and staged mistake promotion. W/W/H gate: clear; risk centers on blast radius if docs are followed literally.

## Memory reads

- Required and artifact reads: `evaluation/SKILL.md`, `ideation/evaluation.md`, `principles/SKILL.md`, `delegation/SKILL.md`, `delegation/templates/evaluator.md`, `mistake/SKILL.md`, all five role docs.
- Supporting reads: `memorization/SKILL.md`, `wrap-up/SKILL.md`, project mistake grep hits including `delegation-discipline.md`, `skills-agents-3-layer-mirror.md`, `codex-overall-perspective-hangs.md`.
- Iter1 Codex inheritance read before Stage 1: `iter1/codex/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`.
- Iter1 Claude cross-reference read: `iter1/claude/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`.

## Locked Frame (Stage 1)

Scenario RI2-1 - Memory-write blast radius is bounded and executable.
- Check RI2-1.1: The only project-memory writer is Wrap-up assistant.
- Check RI2-1.2: The assistant has tools to write where it is made owner. Inherits Codex `R-002`, `U-004`.
- Check RI2-1.3: Non-Wrap-up loops remain session-scoped.

Scenario RI2-2 - Escalation cannot bypass the manager.
- Check RI2-2.1: Subagents use `NEEDS_CONTEXT` + `user-question:`.
- Check RI2-2.2: No assistant exception grants direct AskUserQuestion in conflict with tools or manager ownership.

Scenario RI2-3 - Missing docs and drift do not create runtime hard-fail paths.
- Check RI2-3.1: Target evaluation docs exist or fallback is stated. Inherits Codex/Claude target-doc findings.
- Check RI2-3.2: Runtime drift is deferred by user lock, not counted.

Scenario RI2-4 (adversarial) - Mistake capture survives interrupted or non-PASS sessions.
- Check RI2-4.1: A correction recorded in a REVISE/FAIL iteration is not lost.
- Check RI2-4.2: Read-only evaluators are not asked to write directly.

Coverage: Privacy/data-retention N/A beyond memory-write tiers; security surface is tool/write authority. Cost is applicable via evaluator fanout.

## Stage 2 Findings

### Inherited Codex findings

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence |
|---|---|---|---|---|---|---|
| R-001 | design_flaw | regression | deferred | 100 | Critical | Stale runtime specs/plugin symlinks are user-locked out of scope. Rationale: runtime drift deferred. |
| R-002 | design_flaw | process | open, stuck | 100 | High | Assistant write-surface conflict persists and is worse: `assistant.md:4` is read-only, while `assistant.md:17-18` makes it session/project-memory writer. Superseded in severity by `RI2-REG-001`. |
| R-003 | assumption_risk | process | open, stuck | 50 | Medium | No second-order evaluator-output review path found in the in-scope docs; evaluator independence remains one-way (`evaluator.md:10-12`). |
| R-004 | assumption_risk | cost | open, stuck | 75 | High | Evaluator remains opus (`delegation/SKILL.md:184`), evaluation requires all seven + Overall (`evaluation/SKILL.md:96`), and no cap/timebox appears. |
| R-005 | checklist_gap | docs-sync | open, stuck | 75 | Medium | No cross-layer drift detector/checklist was added inside the reviewed in-scope docs; runtime-layer enforcement is user-locked but the in-scope docs still rely on manual sync. |

### New/current findings

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| RI2-REG-001 | design_flaw | regression | open | 100 | Critical | Assistant lacks write tools (`assistant.md:4`) but owns MEMORIZATION writes (`assistant.md:17`, `assistant.md:93`) and Wrap-up project-memory writes (`assistant.md:18`, `wrap-up/SKILL.md:116-140`). | A literal spawned assistant cannot execute the final two workflow safety phases. This blocks durable memory and handoff, so session closure fails. |
| RI2-REG-002 | design_flaw | regression | open | 100 | High | `mistake/SKILL.md:76-80` requires immediate candidate writing after correction, but `mistake/SKILL.md:82-90` and `:117` make candidate file creation PASS-only during assistant MEMORIZATION. | Corrections in failed/revise iterations are exactly when durable mistake capture matters; the skill can lose them or ask the wrong role to write. |
| RI2-REG-003 | design_flaw | regression | open | 100 | High | Assistant says AskUserQuestion is manager-owned, then grants a Wrap-up WORK exception (`assistant.md:27`); assistant does not list AskUserQuestion in tools (`assistant.md:4`); Wrap-up routes confirmation via manager (`wrap-up/SKILL.md:137`). | Escalation behavior is contradictory at the point where permanent project-memory routing decisions are made. |
| RI2-001 | design_flaw | docs-sync | open | 100 | High | Missing target evaluation docs remain: `evaluator.md:41-44` names target-type paths; repository file check found only phase child evaluation docs. | A missing-doc hard fail can stop evaluation of agent/rule/project docs before findings are produced. |

Checklist verdict: RI2-1 fails, RI2-2 fails, RI2-3 partly deferred/open, RI2-4 fails.

Per-perspective verdict: FAIL. `RI2-REG-001` is Critical/100.

## Low-confidence appendix

- LC-RI2-001 | Type: assumption_risk | Domain: security | Disposition: open | Confidence: 25 | Severity: Medium | Evidence: Manager still has `tools: "*"` (`manager.md:4`), but root-session broad tools may be intentional and the user did not target this in A-G.
