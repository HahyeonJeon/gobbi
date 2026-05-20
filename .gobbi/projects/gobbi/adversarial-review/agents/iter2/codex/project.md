## Artifact Summary + W/W/H

Artifact bundle: `.gobbi/projects/gobbi/agents/{manager,leader,executor,evaluator,assistant}.md`, `.gobbi/projects/gobbi/skills/delegation/SKILL.md`, `.gobbi/projects/gobbi/skills/delegation/templates/evaluator.md`, and new `.gobbi/projects/gobbi/skills/mistake/SKILL.md`. What: iter2 docs-only revision of the v0.5.0 five-role taxonomy and its delegation/evaluation/mistake support contracts. Why: iter1 failed; manager requested seven fixes A-G while explicitly locking runtime specs, `.claude/CLAUDE.md`, `.codex/*`, and related drift out of scope. How: align evaluator schema to `evaluation/SKILL.md`, add `mistake`, assign Memorization/Wrap-up to assistant, publish a canonical phase list, route subagent user questions through `NEEDS_CONTEXT`, narrow assistant writes, and align perspective vocabulary. W/W/H gate: clear enough to evaluate; out-of-scope runtime drift is recorded as `deferred`, not counted.

## Memory reads

- Required skills read in full: `skills/evaluation/SKILL.md`, `skills/ideation/evaluation.md`, `skills/principles/SKILL.md`, `skills/delegation/SKILL.md`, `skills/delegation/templates/evaluator.md`, `skills/mistake/SKILL.md`.
- Repository guidance: `.claude/CLAUDE.md`, `.claude/README.md`, project rule `rules/stub-redirect-format.md`.
- Artifact reads: all five role files, `delegation/SKILL.md`, `delegation/templates/evaluator.md`, `mistake/SKILL.md`.
- Project memory read/filter: `mistakes/delegation-discipline.md`, `mistakes/skills-agents-3-layer-mirror.md`, plus relevant grep hits across project mistakes.
- Iter1 Codex inheritance read before Stage 1: `iter1/codex/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`.
- Iter1 Claude cross-reference read: `iter1/claude/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`.

## Locked Frame (Stage 1)

Scenario PJ2-1 - Tasks A-G solve the contracted iter1 failures without relying on locked runtime surfaces.
- Check PJ2-1.1: Evaluator schema references `evaluation/SKILL.md` rather than redefining a parallel schema. Inherits Codex `S-002`, `C-002`, `C-003`, Claude `F-C-01`, `F-A-02`.
- Check PJ2-1.2: `mistake` skill exists and has peer-skill shape. Inherits Claude `F-C-05`.
- Check PJ2-1.3: Memorization and Wrap-up have explicit owners. Inherits Claude `F-P-05`, Codex assistant/write findings.
- Check PJ2-1.4: Runtime and `.claude` drift is not re-litigated; user-lock routes it to `deferred`.

Scenario PJ2-2 - The workflow phase contract is usable by the manager.
- Check PJ2-2.1: Manager has the canonical six-step list.
- Check PJ2-2.2: Delegation repeats the same canonical list.
- Check PJ2-2.3: No subordinate role introduces an extra phase that is absent from the canonical list. Inherits Claude `F-C-04`.

Scenario PJ2-3 - Subagents cannot bypass the manager for user decisions.
- Check PJ2-3.1: Leader, executor, evaluator, and assistant instruct `NEEDS_CONTEXT` with `user-question:` rather than direct AskUserQuestion. Inherits Codex `U-001`.
- Check PJ2-3.2: Any exception is manager-mediated and tool-compatible.

Scenario PJ2-4 (adversarial) - Single-Leader dispatch does not silently lose the retired dual-stance benefit.
- Check PJ2-4.1: A concrete alternative-divergence mechanism exists, not just "single leader thinks harder". Inherits Codex `P-002`, Claude `F-P-03`.
- Check PJ2-4.2: If not solved in this docs-only pass, the tradeoff remains explicitly open.

Coverage: Project owns scope/right-problem and user-lock routing here. Accessibility/i18n/privacy/licensing/supply-chain are not Project-owned for this docs-only taxonomy; they are covered or declared N/A in Usage/Risk/Consistency.

## Stage 2 Findings

### Inherited Codex findings

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence |
|---|---|---|---|---|---|---|
| P-001 | design_flaw | docs-sync | deferred | 100 | Critical | User lock explicitly excludes `.claude/CLAUDE.md`, `packages/cli/src/specs/*.json`, `.claude/agents/*.toml`, `.codex/*`, and runtime spec drift. Rationale: out-of-scope for this iter2 evaluator. |
| P-002 | design_flaw | process | open, stuck | 75 | High | `delegation/SKILL.md:45` and `:220` still say single leader per dispatch; `leader.md:67` only says "Stress-test alternatives" and does not restore independent orthogonal hypotheses. Same root cause as iter1. |
| P-003 | assumption_risk | process | open, stuck | 50 | Medium | Evaluator independence is still asserted (`evaluator.md:10-12`), but no second-order review route for evaluator artifacts or evaluator role changes is defined in the in-scope docs. |
| P-004 | design_flaw | cost | deferred | 100 | High | Runtime model drift depends on `packages/cli/src/specs/*.json`, which the user locked out of scope. Rationale: runtime-spec drift deferred. |

### Claude divergence carried into frame

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence |
|---|---|---|---|---|---|---|
| Claude F-P-05 | scenario_gap | process | addressed | 100 | Critical | Manager now assigns loop MEMORIZATION to assistant and Wrap-up to assistant: `manager.md:34-38`, `manager.md:84-87`; assistant declares MEMORIZATION/Wrap-up ownership: `assistant.md:10-18`. |
| Claude F-P-06 | design_flaw | docs-sync | addressed | 100 | High | Manager includes Preparation in the phase table and canonical list: `manager.md:35`, `manager.md:40`. `.claude/CLAUDE.md` drift is user-locked. |
| Claude F-C-04 | design_flaw | docs-sync | open, stuck | 100 | High | `leader.md:12`, `leader.md:33`, `delegation/SKILL.md:45`, and `delegation/SKILL.md:220` still treat Research as a phase/sub-phase while the canonical list omits it (`manager.md:40`, `delegation/SKILL.md:213`). |

### New/current findings

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| PJ2-001 | design_flaw | docs-sync | open | 100 | High | Canonical list is six phases at `manager.md:40` and `delegation/SKILL.md:213`; leader/delegation still accept `research` as a phase/sub-phase at `leader.md:12`, `leader.md:33`, `delegation/SKILL.md:45`, `delegation/SKILL.md:220`. | The manager can brief a non-canonical `research` phase even though the supposed canonical workflow has no such phase. This is a stuck version of Claude `F-C-04`. |

Checklist verdict: PJ2-1 partly passes, PJ2-2 fails on Research drift, PJ2-3 is mostly handled but has regressions covered in Usage/Risk, PJ2-4 remains open.

Per-perspective verdict: REVISE. PJ2-001 and inherited P-002 are High-confidence High findings.

## Low-confidence appendix

- LC-PJ2-001 | Type: assumption_risk | Domain: process | Disposition: open | Confidence: 25 | Severity: Low | Evidence: A future leader prompt could make single-Leader stress testing adequate, but that mechanism is not present in the reviewed artifact.
