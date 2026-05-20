# Overall (Stage 3) — 5-Role Agent Taxonomy (iter1, claude)

## Cross-perspective verdict summary

| Perspective | Verdict | Top finding |
|---|---|---|
| Project | FAIL | F-P-05 (Critical/100) — Wrap-up phase has no role assignment |
| Structure | FAIL | F-S-04 (Critical/100) — no drift-detector keeps the 5 files + Agent Roster + CLAUDE.md in sync |
| Performance | REVISE | F-Pf-01 (Medium/50) — opus-default evaluator cost across iterations |
| Aesthetics | REVISE | F-A-02 (High/100) — perspective vocab `architecture`/`user` vs canon `Structure`/`Usage` |
| Usage | FAIL | F-U-02 (High/100) — evaluator perspective lookup fails at runtime |
| Consistency | FAIL | F-C-01 (Critical/100) — evaluator Type enum disjoint from evaluation/SKILL.md |
| Risk | FAIL | F-R-04/06/07 (High/75) — multiple two-week-smell failure modes |

## Cross-perspective divergence summary

The 7 perspectives converged unusually tightly: **5 of 7 returned FAIL**, two returned REVISE. The divergences:

- **Performance vs Risk on cost**: Performance flagged cost as REVISE-level Medium; Risk treated cost as out-of-scope (handled by Performance). No real disagreement — Performance owns it.
- **Aesthetics vs Usage on perspective-vocab**: Aesthetics graded the same lexical mismatch (F-A-02) as REVISE/High; Usage graded it FAIL because the operator-facing consequence is a runtime delegation break. Same evidence, different lens — Usage is the more severe lens here.
- **Structure vs Project on memorization owner**: Structure F-S-01 calls it a "design_flaw / High"; Project F-P-04/F-P-05 calls it Critical. Project lens correct: it's not a structural elegance issue, it's "the phase has no owner".

## Cross-cutting findings (Stage 3 native)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-O-01** | `design_flaw` | `process` | open | **100** | **Critical** | Three files claim authority on workflow phases (CLAUDE.md, delegation/SKILL.md, leader.md) — three different lists | The bundle ships without a single source of truth for "what phases exist". Every other gap (F-P-05, F-P-06, F-C-03, F-C-04) cascades from this. The right fix is one canonical phase list referenced by all three |
| **F-O-02** | `design_flaw` | `docs-sync` | open | **100** | **Critical** | Evaluator agent's Type enum, Domain field, Disposition field, verdict-rule thresholds **all** diverge from evaluation/SKILL.md. This is not a minor lexical drift — the entire finding-metadata contract is alien | The 5-role taxonomy was authored without re-reading the evaluation skill. The evaluator role file was written from intuition rather than from the skill it depends on. This is the highest-impact gap because evaluation is mandatory after Execution |
| **F-O-03** | `process` | `process` | open | 75 | High | F-C-05 `mistake` skill mandated by every agent + CLAUDE.md, absent from the worktree's `skills/` directory | The mandatory load step every spawned agent runs first will fail. This is more than docs-sync — it's load-bearing infrastructure missing |
| **F-O-04** | `general` | `process` | open | 75 | High | F-P-05 + F-U-01 — Memorization and Wrap-up phases have no fixed owner; "(or leader)" ambiguity | The two final phases of a productive session have no agent contract. This is exactly the structural problem the v0.4→v0.5 refactor was supposed to solve |

## Karpathy's four failure modes — explicit check

### Wrong assumptions
**HIT** (`F-O-02`, `F-C-01`, `F-A-02`). The bundle assumes evaluator output schema can be defined inside the agent file without re-reading the evaluation skill. The assumption: "the agent file is a self-contained behavioral spec." The reality: the evaluator's output must conform to evaluation/SKILL.md's Finding metadata contract — the agent file is downstream of the skill, not parallel to it.

Also (`F-C-05`): assumes `mistake` skill exists in the worktree. It doesn't.

### Overcomplexity
**NOT HIT** in the agent file content itself — 5 files at 130 lines each is appropriately small. **PARTIAL HIT** in the *system* the bundle composes into: 3 places declare phase lists, 4 places (CLAUDE.md, Agent Roster, agent files, evaluation skill) must stay in sync with no drift detector — that's complexity-from-redundancy. The fix is collapse, not addition.

### Orthogonal edits
**HIT** (`F-R-03`). gitStatus shows .claude/agents/__pi.toml, __executor.toml, etc. + .codex/AGENTS.md + .codex/config.toml + .claude/settings.json all modified on the same branch. The bundle "5 agent files" is reviewed in isolation but the branch bundles unrelated config + plugin agent + Codex changes. A reviewer of the 5 files cannot independently judge whether the branch is coherent — the bundle is broader than the review window admits.

### Imperative-over-declarative
**PARTIAL HIT**. The agent files prescribe lifecycle mechanism (Study→Plan→Execute→Verify→Memorize) rather than stating the verifiable goal ("the role produces X conforming to Y, verified by Z"). This is partly justified because subagents need procedural anchors, but the Stage-2 walks revealed several places where the procedural prescription drifts from the underlying goal (e.g., evaluator.md defines a 5-Type Finding schema rather than saying "use the evaluation skill's schema"). The declarative version would have prevented `F-C-01`.

## Preserve list

Things done well that must not be touched in REVISE iterations:

1. **Status enum 4-state contract** (DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED) — clean, parseable, ratified by delegation/SKILL.md. Preserve.
2. **Out-of-scope-before-lifecycle structure** in all 5 files — sets boundaries before procedure. Preserve.
3. **Model selection rationale** at delegation/SKILL.md:179-186 + matching frontmatter `model:` fields — opus/sonnet split is defensible and consistently applied. Preserve.
4. **Read-only tool surface for evaluator and assistant** — minimum-privilege correctly applied. Preserve.
5. **Anti-pattern callouts inside each agent file** — "Red Flags / Anti-Patterns" lists are concrete and operator-actionable. Preserve.
6. **Principle 2 enforcement at the bundle level** — manager never evaluates own output, evaluator never sees author transcript. Preserve the principle even if F-P-07's small-edits hole needs closing.
7. **3-strike rule citation** in executor.md:101 — explicit principle citation, anti-rationalization-aware. Preserve.

## Overall verdict

**FAIL**

Five of seven perspective verdicts are FAIL with Critical/100 evidence; one of the other two (Aesthetics) carries a High/100. The bundle has:

- **Two Critical schema mismatches** (F-C-01 evaluator metadata, F-C-03/F-O-01 workflow phase lists) that break delegation/evaluation at runtime.
- **One Critical missing dependency** (F-C-05 `mistake` skill absent — every agent fails mandatory load).
- **One Critical missing role assignment** (F-P-05 Wrap-up phase has no owner; Memorization ambiguous).
- **One Critical absence of a drift-detector** (F-S-04) that would prevent further drift from accumulating.

The Iron Law violations are not present in the agent prose itself — the prose adheres to the principles. The failures are at the **integration seams** between the agent files and the rest of the system. This is recoverable; the agent files individually are well-structured. REVISE focuses on three lockable fixes: (a) one canonical phase list across CLAUDE.md + delegation + agent files; (b) evaluator.md's finding schema imported from evaluation/SKILL.md verbatim (or a load directive that delegates the schema entirely); (c) every Memorization / Wrap-up reference names a specific role (or a new memorizer role is added).

Recommend REVISE iter2 against the Preserve list above, with all 8 Critical findings (F-O-01, F-O-02, F-C-01, F-C-03, F-C-05, F-P-05, F-S-04, F-A-02 promoted) addressed before re-review.
