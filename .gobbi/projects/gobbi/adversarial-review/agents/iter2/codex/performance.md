## Artifact Summary + W/W/H

Artifact bundle: iter2 docs-only taxonomy plus delegation/evaluator-template/mistake updates. What: model and workflow-cost policy for five roles. Why: make the role taxonomy operational without wasteful or conflicting dispatch behavior. How: delegation model defaults, evaluator perspective count, fresh-context spawning, and assistant/leader/executor boundaries. W/W/H gate: clear; performance lens is token/model cost and iteration latency, not CPU.

## Memory reads

- Required docs: `evaluation/SKILL.md`, `ideation/evaluation.md`, `principles/SKILL.md`, `delegation/SKILL.md`, `delegation/templates/evaluator.md`, `mistake/SKILL.md`.
- Artifact reads: all role docs, delegation docs, evaluator template, mistake skill.
- Supporting reads: `memorization/SKILL.md`, `wrap-up/SKILL.md`, project mistake `codex-overall-perspective-hangs.md` via grep hits, and `delegation-discipline.md`.
- Iter1 Codex inheritance read before Stage 1: `iter1/codex/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`.
- Iter1 Claude cross-reference read: `iter1/claude/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`.

## Locked Frame (Stage 1)

Scenario PF2-1 - Model defaults and fanout are cost-realistic.
- Check PF2-1.1: Role docs and delegation model table agree for in-scope docs.
- Check PF2-1.2: Runtime spec drift is deferred by user lock. Inherits Codex `PF-001`.
- Check PF2-1.3: Opus evaluator fanout has a cap or explicit budget tradeoff. Inherits Codex `PF-002`, `R-004`.

Scenario PF2-2 - Evaluation count is not ambiguous.
- Check PF2-2.1: Evaluation skill and delegation agree whether every review runs all seven + Overall or only a minimum subset.
- Check PF2-2.2: Any model override path is explicit and documented.

Scenario PF2-3 - Executor/assistant spawn scaling has combining guidance.
- Check PF2-3.1: Related tasks can be combined when same role/context/files. Inherits Codex `PF-003`.
- Check PF2-3.2: Known large-review hang/timebox lessons are surfaced. Inherits Codex `PF-004`.

Scenario PF2-4 (adversarial) - A REVISE loop multiplies evaluator cost without bounded exit.
- Check PF2-4.1: Iteration fanout cost is named.
- Check PF2-4.2: Time-box or downgrade options exist before a review hangs or balloons.

Coverage: Cost is applicable. Error-budget and CPU/memory are not applicable for this text-only taxonomy.

## Stage 2 Findings

### Inherited Codex findings

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence |
|---|---|---|---|---|---|---|
| PF-001 | design_flaw | cost | deferred | 100 | High | Executor runtime model drift depends on `packages/cli/src/specs/*.json`, user-locked out of scope. Rationale: runtime spec drift deferred. |
| PF-002 | assumption_risk | cost | open, stuck | 75 | High | Evaluator remains opus (`delegation/SKILL.md:184`), `evaluation/SKILL.md:96` requires all seven + Overall, and no budget cap/timebox is added. |
| PF-003 | assumption_risk | performance | addressed | 75 | Medium | Delegation now gives combining guidance: related tasks with same role/context/files should be combined (`delegation/SKILL.md:201`). |
| PF-004 | checklist_gap | cost | open, stuck | 75 | Medium | No time-box or breadth cap appears in `evaluator.md`, `delegation/SKILL.md`, or `delegation/templates/evaluator.md`; the Codex Overall hang mistake remains only project memory, not delegation guidance. |

### New/current findings

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| PF2-001 | design_flaw | cost | open | 100 | High | `evaluation/SKILL.md:96` says every evaluation runs all seven perspectives + Overall. `delegation/SKILL.md:47`, `delegation/SKILL.md:222`, and `evaluator.md:12` say spawned evaluators are at least two perspectives with Project + Overall minimum. | The manager cannot estimate or bound evaluator cost because the authoritative docs disagree on review fanout. It also risks under-review if delegation follows the smaller count. |

Checklist verdict: PF2-1 fails on cost cap, PF2-2 fails on fanout ambiguity, PF2-3 partly passes, PF2-4 fails.

Per-perspective verdict: REVISE. `PF-002` and `PF2-001` are High with confidence >= 50.

## Low-confidence appendix

- LC-PF2-001 | Type: assumption_risk | Domain: cost | Disposition: open | Confidence: 25 | Severity: Low | Evidence: Assistant lookup overuse could become costly, but no artifact text encourages broad assistant fanout beyond independent lookups.
