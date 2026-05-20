# Structure Perspective — 5-Role Agent Taxonomy (iter1, claude)

## Artifact Summary + W/W/H

See `project.md` for full Stage 0. Structure focuses on whether the 5-file decomposition is sound: cohesion, coupling, abstraction granularity, testability of the role contract, and adversarial: hidden circular dependencies between roles.

## Memory reads

- `agents/manager.md`, `leader.md`, `executor.md`, `evaluator.md`, `assistant.md` (full)
- `skills/delegation/SKILL.md` (cross-reference for templates + Agent Roster)
- `skills/evaluation/SKILL.md` (cross-reference for evaluator schema)
- `skills/principles/SKILL.md` Principle 2 (perspective separation)
- Skills directory listing

## Locked Frame (Stage 1)

### S-S-1: Each role file has a single coherent concern
- [ ] Each file's "what you are" is one role, not two
- [ ] No two files own the same concern

### S-S-2: Inter-role dependencies are unidirectional (no cycles)
- [ ] Manager spawns leader/executor/evaluator/assistant; none of those spawn back
- [ ] Evaluator never depends on the agent it evaluates (Principle 2)

### S-S-3: Uniform shape across the 5 files (testable structure)
- [ ] All 5 files share the same section ordering (frontmatter / intro / Out of scope / Before You Start / Lifecycle / Status Contract / Red Flags / Quality Expectations)
- [ ] Frontmatter fields (`name`/`description`/`tools`/`model`) are consistent
- [ ] Lifecycle sub-sections (Study/Plan/Execute/Verify/Memorize) are consistent

### S-S-4: Boring-by-default — taxonomy uses existing conventions, not novel patterns
- [ ] Naming follows `__gobbi-convention.md` (role names are bare nouns, no prefix per convention's "interface" tier check — but the convention covers `gobbi-agent`/internal/hidden)
- [ ] No magic role names (e.g., "synthesizer", "memorizer") that need defining

### S-S-5: Testability — a reader can verify each role's contract from the file alone
- [ ] Each role names its mandatory loads (principles + rules + mistake + skills)
- [ ] Each role names its status enum
- [ ] Each role names its tool surface explicitly

### S-S-6 (adversarial): A "manager" role that touches every component is the textbook coordinator anti-pattern (ideation/evaluation.md:102-103)
- [ ] Manager's relationship to the other 4 is direction-only, not data-shuttling
- [ ] No hub-and-spoke fragility where a manager bug cascades to all 4 specialists

### S-S-7 (adversarial): Cross-agent contract drift detector
- [ ] When one role's behavior changes, a defined surface (CI, schema, lint) detects when peer agents become inconsistent
- [ ] Without a drift detector, the 5 files are silently coupled

### S-S-8: Cross-cutting (Observability + Dependency)
- [ ] Each role's status contract is observable/parseable (manager can grep "DONE"/"BLOCKED")
- [ ] Dependencies declared up-front (load directives in `Before You Start` are explicit, not inferred)

## Per-scenario per-check results (Stage 2)

### S-S-1
- (a) Single concern per file: **YES** with one caveat — manager.md mixes "orchestration" + "user discussion" + "phase loading" + "bookkeeping". Defensible bundling for a session chief, but the file is large and could split → minor structural smell, not a finding worth raising
- (b) No two files own the same concern: **NO** — Memorization is owned by both "executor or leader" (manager.md:84) and the `memorization` skill (which neither file specializes for) → **F-S-01**

### S-S-2
- (a) Unidirectional spawning: **YES** — assistant.md:14 forbids "Spawning other agents", executor.md:17 same, evaluator.md no spawn
- (b) Evaluator independence: **YES** — evaluator.md:12 forbids transcript; manager.md:70 surfaces findings before action

### S-S-3
- (a) Section ordering: **MOSTLY YES** — all 5 follow the same shape; manager has "Decision Discipline" as an extra section, executor has "TypeScript / Codebase Constraints" as an extra. Acceptable variance
- (b) Frontmatter consistency: **NO** — leader.md tools include `Write` (line 4) for artifact authoring; executor.md tools include `Write,Edit`; assistant.md tools exclude `Write` (good) but leader.md's `Write` is a tool-surface widening that depends on policy ("Write access is for ideation/preparation/research/planning artifacts only" — leader.md:15) to constrain. **Tool-vs-policy split**: tool permits more than policy allows → **F-S-02**
- (c) Lifecycle sub-sections: **YES** (all five Study/Plan/Execute/Verify/Memorize)

### S-S-4
- (a) Naming: **YES** — bare nouns, no tier prefix; user-facing-but-not-distributed-via-plugin so no `gobbi-` prefix
- (b) No magic names: **YES** — no undefined role-shaped terms

### S-S-5
- (a) Mandatory loads named: **YES** — all 5 have "Before You Start"
- (b) Status enum named: **YES** — all 5 have status contract section
- (c) Tool surface explicit: **YES** — all 5 frontmatter declare tools

### S-S-6 (adversarial)
- (a) Manager is direction-only: **MOSTLY** — manager.md:15 carves a "single-line edits" exception that lets the manager do executor-class work, which is data-shuttling on a small scale (see also F-P-07)
- (b) Hub-and-spoke fragility: **REAL** — every workflow path runs through manager. If the manager's phase load table (manager.md:33-38) is wrong (it is — Preparation missing per F-P-06), every Preparation phase breaks. No bypass. → **F-S-03**

### S-S-7 (adversarial)
- (a) Drift detector: **NO** — no CI, no schema, no lint. The 5 files coordinate by convention only. The Agent Roster table at delegation/SKILL.md:217 is a 6th place that must stay in sync; a 7th place (CLAUDE.md) too. **No mechanism prevents divergence.** → **F-S-04**

### S-S-8
- (a) Status observable: **YES**
- (b) Deps declared: **MOSTLY YES** — leader.md:33 says research skill is "loaded by ideation Sub-step C, or whenever the brief calls for it" — implicit dependency on the ideation skill structure → **F-S-05**

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-S-01** | `design_flaw` | `process` | open | 75 | High | Memorization phase is owned by `memorization` skill but the bundle assigns "executor (or leader)" (manager.md:84); neither file's lifecycle has Memorization-as-task content | Memorization will be done by a generalist role with no specialist guidance; quality degrades; cross-session memory rots |
| **F-S-02** | `assumption_risk` | `security` | open | 75 | Medium | leader.md:4 tools include `Write`; leader.md:15 restricts it by policy. No tool-level guard | A leader violating "no implementation" still runs; only the evaluator catches it post-hoc. Tool surface should match policy |
| **F-S-03** | `design_flaw` | `process` | open | 75 | High | All workflow phases route through manager's phase load table (manager.md:33-38); table is missing Preparation; no bypass | Single-point-of-failure structure. Combined with F-P-06: workflow breaks silently when manager hits a phase its table omits |
| **F-S-04** | `scenario_gap` | `docs-sync` | open | **100** | **Critical** | No CI/lint/schema syncs `agents/*.md` ↔ `delegation/SKILL.md` Agent Roster ↔ `CLAUDE.md` ↔ phase docs. Manual sync only | This is the *exact* failure mode the v0.4 → v0.5 refactor needed to prevent; the bundle re-introduces the drift surface |
| **F-S-05** | `assumption_risk` | `docs-sync` | open | 50 | Low | leader.md:33 "loaded by ideation Sub-step C" — implicit dependency on a skill's internal structure | Couples leader to internal sub-step naming inside the ideation skill; refactor of ideation can silently break leader behavior |

## Per-perspective verdict

**FAIL** — F-S-04 (Critical/100) is structural. The taxonomy ships without any mechanism to keep the 5 role files coherent with each other, the delegation skill's Agent Roster, the workflow phase docs, or CLAUDE.md. Combined with F-S-03 (High/75) hub fragility through manager, the structure is brittle. F-S-01 (High/75) memorization owner-blur reinforces.

## Low-confidence appendix

- F-S-05 (Low/50) — borderline. Keep for memorization in case the ideation skill is later restructured.
