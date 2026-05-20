# Consistency Perspective — 5-Role Agent Taxonomy (iter1, claude)

## Artifact Summary + W/W/H

See `project.md`. Consistency = sync between the 5 agent files AND between the bundle and adjacent sources of truth (CLAUDE.md, delegation/SKILL.md, evaluation/SKILL.md, workflow phase docs, principles).

## Memory reads

- `agents/*.md` (full, all 5)
- `.claude/CLAUDE.md` (workflow phase list, Iron Laws)
- `delegation/SKILL.md` § Agent Roster (line 217), § Model Selection (line 174)
- `evaluation/SKILL.md` § Perspectives (line 85), § Finding Metadata (line 294)
- `principles/SKILL.md` Principle 2, 4, 12
- `rules/__gobbi-convention.md`

## Locked Frame (Stage 1)

### S-C-1: The 5 agent files use the same vocabulary for the same concepts
- [ ] Same status enum names across files (DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED)
- [ ] Same load-directive structure
- [ ] Same lifecycle sub-section names

### S-C-2: Each agent file is consistent with delegation/SKILL.md Agent Roster (line 217)
- [ ] Role names match
- [ ] Model defaults match (manager/leader/evaluator=opus; executor/assistant=sonnet)
- [ ] "When to use" descriptions don't contradict

### S-C-3: Each agent file is consistent with evaluation/SKILL.md
- [ ] evaluator.md's perspective vocabulary matches evaluation/SKILL.md's 7+Overall canon
- [ ] evaluator.md's Finding metadata (Type, Severity, Confidence) matches evaluation/SKILL.md schema
- [ ] evaluator.md's verdict thresholds match (`PASS`/`REVISE`/`FAIL` rules)

### S-C-4: Each agent file is consistent with CLAUDE.md workflow list
- [ ] All workflow phases each agent claims to handle exist in CLAUDE.md
- [ ] No agent claims a phase not in CLAUDE.md
- [ ] All CLAUDE.md phases have at least one role assigned

### S-C-5: Each agent file is consistent with principles/SKILL.md
- [ ] No agent file's behavior contradicts the 12 Iron Laws
- [ ] Where agent files cite a Principle number, the principle text supports the claim

### S-C-6 (adversarial): Cross-file references resolve
- [ ] `orchestration/workflow/{phase}.md` files referenced from manager.md/leader.md exist
- [ ] `mistake` skill referenced — exists
- [ ] `evaluation` skill referenced — exists
- [ ] Tool surfaces declared in frontmatter match tool-use mentions in prose

### S-C-7: Cross-cutting (Privacy + Licensing — Coverage Matrix Risk+Consistency)
- not-applicable: agent definition files do not handle PII or external IP; no privacy/licensing surface

## Per-scenario per-check results (Stage 2)

### S-C-1
- (a) Status enum: **YES** — all 4 spawnable agents use `DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED`; manager uses translated `PROCEED / PROCEED_WITH_CONCERNS / NEEDS_DECISION / BLOCKED` — consistent translation per delegation/SKILL.md
- (b) Load directives: **MOSTLY** — all 5 list principles + rules + mistake; manager adds gobbi/orchestration; leader/executor/evaluator/assistant add domain skills. Consistent
- (c) Lifecycle sub-sections: **YES** — all 5 use Study/Plan/Execute (or equivalent)/Verify (or Assess/Report)/Memorize

### S-C-2 (vs delegation/SKILL.md Agent Roster line 217)
- (a) Role names: **YES** — `manager / leader / executor / evaluator / assistant` match exactly
- (b) Model defaults: **YES** — opus/opus/sonnet/opus/sonnet matches table at delegation/SKILL.md:179-186
- (c) Descriptions don't contradict: **MOSTLY YES** — but Roster line 220 says executor "Reads brief + research, implements within scope boundary, returns one of 4 statuses with verification evidence" — consistent with executor.md

### S-C-3 (vs evaluation/SKILL.md)
- (a) Perspective vocabulary: **NO** — already F-A-02/F-U-02. evaluator.md:12 uses `architecture` and `user`; evaluation/SKILL.md:85 uses `Structure` and `Usage`. Direct lexical mismatch
- (b) Finding metadata schema: **NO — Critical** — evaluator.md:77 defines Type as `correctness / scope / process / convention / risk` (5 values). evaluation/SKILL.md:306 defines Type as `scenario_gap / checklist_gap / design_flaw / assumption_risk / general` (5 different values). **Completely disjoint taxonomies.** Also evaluator.md never mentions the required **Domain** field nor the **Disposition** field — both mandatory per evaluation/SKILL.md:294 → **F-C-01** (Critical)
- (c) Verdict thresholds: **MOSTLY** — evaluator.md:87 says "PASS = no Critical or High findings; REVISE = ≥1 High and resolvable; FAIL = ≥1 Critical or fundamental approach is wrong". evaluation/SKILL.md:242 says "any Critical with confidence ≥75 → FAIL; any High with confidence ≥50 → REVISE; otherwise PASS". evaluator.md drops the **confidence threshold** entirely from the verdict rule → **F-C-02** (High)

### S-C-4 (vs CLAUDE.md workflow list)
- CLAUDE.md lists Ideation → Planning → Execution → Memorization → Handoff (5 productive steps + Configuration). delegation/SKILL.md:45 + leader.md:32 add **Preparation**. The Cross-source consistency: CLAUDE.md (5 steps) ≠ leader.md (4 phases: ideation/preparation/research/planning) ≠ manager.md (5 phases visible in load table, omits Preparation). Three different phase lists across three files → **F-C-03** (Critical)
- "Research" appears in leader.md:33 as a phase but never as a workflow step in CLAUDE.md (it's listed there as a sub-phase of Ideation per CLAUDE.md "PI agents (innovative + best stances) investigate the problem space") → **F-C-04** (High)
- All CLAUDE.md phases assigned: **NO** — Wrap-up has no role (F-P-05). Memorization is ambiguous (F-P-04 + F-U-01). carry-forward

### S-C-5 (vs principles/SKILL.md)
- (a) No contradiction: **MOSTLY** — manager.md's "single-line edits" exception softens Principle 2 (see F-P-07). Otherwise consistent
- (b) Citations supported: **YES** — evaluator.md:12 "(Principle 2)" matches; executor.md:101 "(3-strike rule, Principle 1)" matches the principle text at principles/SKILL.md:40

### S-C-6 (adversarial cross-file references)
- (a) `orchestration/workflow/{phase}.md`: skills directory listing shows `orchestration` skill exists but the `workflow/` subdirectory contents not enumerated. Cannot verify — record as low-confidence
- (b) `mistake` skill: **MISSING from listing** — skills dir contains `evaluation, ideation, preparation, planning, execution, memorization, wrap-up, gobbi, delegation, discussion, git, interview, principles, research` — **no `mistake` skill**, yet every agent file mandates loading it. CLAUDE.md (worktree copy) line 56 also references "the `mistake` skill". **The skill does not exist in the bundle's worktree.** → **F-C-05** (Critical)
- (c) `evaluation` skill: **YES** exists
- (d) Tool surfaces match prose: **MOSTLY YES** — but assistant.md "Memorize" section (lines 80-83) discusses "writing a mistake" yet assistant frontmatter line 4 lacks `Write` tool. Hard contradiction → **F-C-06** (Medium)

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-C-01** | `design_flaw` | `docs-sync` | open | **100** | **Critical** | evaluator.md:77 Type enum = `correctness/scope/process/convention/risk`; evaluation/SKILL.md:306 Type enum = `scenario_gap/checklist_gap/design_flaw/assumption_risk/general`. Domain (mandatory) + Disposition (mandatory) fields absent from evaluator.md | Evaluator following the agent file produces findings that the evaluation skill's routing/MEMORIZATION cannot consume. Findings cannot be staged because Type doesn't match the staging-destination routing table |
| **F-C-02** | `design_flaw` | `process` | open | 75 | High | evaluator.md:87 verdict rule lacks confidence threshold; evaluation/SKILL.md:242 requires confidence ≥75 / ≥50 gates | Evaluator can return FAIL on low-confidence Critical or PASS on ≥75 Critical that the skill says is FAIL. Verdict inconsistency between systems |
| **F-C-03** | `design_flaw` | `docs-sync` | open | **100** | **Critical** | CLAUDE.md (5 productive steps), delegation/SKILL.md (5 phases + preparation) and leader.md (4 phases including research as standalone) all list workflow phases differently | Authoritative workflow list is unclear; manager, leader, evaluator each load different phase docs and the workflow state machine has no fixed shape |
| **F-C-04** | `design_flaw` | `docs-sync` | open | 75 | High | leader.md:33 lists Research as a phase; CLAUDE.md treats research as part of Ideation; ideation/evaluation.md confirms research is internal to Ideation | Spawning a "Research phase" leader has no canonical home; the leader will create artifacts at a path no other agent reads |
| **F-C-05** | `design_flaw` | `process` | open | **100** | **Critical** | `ls skills/` shows no `mistake/` directory; every agent file mandates loading it; CLAUDE.md mandates it | Every spawned subagent fails its Mandatory Load step at line 1. Bundle is non-functional at runtime against the worktree |
| **F-C-06** | `design_flaw` | `docs-sync` | open | 75 | Medium | assistant.md:81 "New mistake discovered → write it"; assistant.md:4 tools omit Write | Assistant cannot do what the file tells it to do; either the prose is wrong or the tool list is wrong |

## Per-perspective verdict

**FAIL** — Three Critical/100 findings (F-C-01, F-C-03, F-C-05) each independently sufficient for FAIL. The bundle is in serious de-sync with its dependencies: evaluator schema is alien to evaluation skill, workflow phase list disagrees between three authoritative files, and the `mistake` skill every agent depends on does not exist in the worktree.

## Low-confidence appendix

(none below threshold)
