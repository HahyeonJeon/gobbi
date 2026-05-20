# Structure Perspective — Cross-cutting Batch (iter1, claude)

## Stage 0 — Target Understanding

W/W/H clear (see project.md). Frame: organization, decomposition, dependencies, testability, maintainability across 7 skills.

## Stage 1 — Locked Frame

**S1. Each skill owns one concern; cross-references go in one direction**
- [ ] orchestration -> {discussion, delegation, evaluation, memorization} (consumes them)
- [ ] delegation references evaluation only via templates (no circular dep)
- [ ] evaluation -> {memorization} only via finding-routing table
- [ ] memorization -> {evaluation, wrap-up} as read-only references
- [ ] No circular dependency in the load graph

**S2. The 4-stage evaluation procedure is self-consistent; stages have non-overlapping purposes**
- [ ] Stage 0 W/W/H gate distinct from Stage 1 Frame build
- [ ] Stage 1 CRUD is a single owner; Stage 2 doesn't re-do Stage 1's work
- [ ] Stage 3 has its own job (cross-perspective gaps); not just "Stage 2 summary"

**S3. (adversarial) `evaluation/SKILL.md` (551 lines) is bloated — could it be split without losing the integrated procedure?**
- [ ] Sections that don't refer to each other in the 4-stage flow are candidates for separation
- [ ] The Anti-patterns + Verification + Finding Metadata sections could be sub-docs

**S4. Inter-template consistency: 4 delegation templates follow the same slot pattern**
- [ ] Each template has: Identity / Task / Context / Load Directives / Inputs / Constraints / Job / Reference Materials / Escape Hatch / Report Format
- [ ] Slot order is identical
- [ ] Role-specific tails are additive only

**S5. (adversarial) Sub-document hierarchy is single-rooted (no orphan docs)**
- [ ] Every workflow/{loop}.md is reachable from orchestration/SKILL.md
- [ ] Every skill SKILL.md is reachable from CLAUDE.md or another loaded skill
- [ ] interview/templates/project-skill.md is referenced from interview/SKILL.md

## Stage 2 — Findings

### F-S-01 — Broken links: workflow/{execution,wrap-up}.md reference non-existent `delegation.md`

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: High / **Disposition**: open

**Evidence** (verified via grep):
- `orchestration/workflow/wrap-up.md:17`: `Constructs the assistant delegation prompt per [delegation prompt requirements](delegation.md#what-every-delegation-prompt-needs)`
- `orchestration/workflow/execution.md:17`: same pattern, same broken link

No file `orchestration/workflow/delegation.md` exists in the worktree. Sibling docs `ideation.md`, `planning.md`, `wrap-up.md` correctly use `../../delegation/SKILL.md#...` form. The anchor target `#what-every-delegation-prompt-needs` also does not exist — actual anchor is `#what-every-delegation-prompt-contains` (verified line 56 of `delegation/SKILL.md` is "What Every Delegation Prompt Contains").

**Why it matters**: Both execution and wrap-up's DISCUSSION-phase procedures point an executor/assistant-spawning manager at a 404 link to find the contract for delegation prompts. The wrap-up's own EVALUATION docs depend on a delegation prompt that may be malformed because the reference resolves to nothing.

### F-S-02 — Evaluator spawn topology contradicts itself across skills (perspective-per-agent vs sequential-perspectives-in-one-agent)

**Type**: `design_flaw` / **Domain**: `process` / **Confidence**: 100 / **Severity**: Critical / **Disposition**: open

**Evidence**:
- `delegation/SKILL.md:47` (Per-role Templates): "Evaluation sub-phase. Spawn ≥2 perspectives in parallel; Project + Overall always included."
- `delegation/SKILL.md:225` (Agent Roster): "Spawned ≥2 in parallel with distinct perspectives — Project + Overall always included."
- `delegation/templates/evaluator.md:8`: `Your perspective: <<project | structure | performance | aesthetics | usage | consistency | risk | overall>>` — one perspective slot per agent
- `orchestration/workflow/evaluation.md:42-49`: **contradicts directly** — "The manager spawns **exactly two evaluator agents in parallel** — one per system. ... Each evaluator is **one agent** that handles **all four stages** ... sequentially — the manager does not spawn one evaluator per perspective."
- `evaluation/SKILL.md:9`: "Stage 2 (Per-Perspective Sequential Evaluation across seven perspectives)" — sequential, one agent

This is a hard contradiction. The delegation skill says N agents × 1 perspective each. The orchestration/workflow doc and evaluation/SKILL.md say 2 agents (one per system), each walking all 7+Overall perspectives sequentially. The evaluator template's slot supports the wrong story.

**Why it matters**: A manager reading `delegation/SKILL.md` will spawn 8+ evaluator agents per system per iter (16+ total parallel evaluators per iter, per loop). The actual contract is 2 agents total per iter — a 8× wasted spawn budget. Worse: the per-agent-per-perspective topology breaks Stage 3 Overall (which needs to see all 7 perspectives together) and breaks `evaluation/SKILL.md:234`'s mandatory ordering "Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk".

### F-S-03 — `mistake` skill referenced by every delegation template but not in scope of this batch's load list

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 50 / **Severity**: Medium / **Disposition**: open

**Evidence**: All 4 delegation templates mandate "`mistake` skill (mandatory)" at Load Directives row 3. `mistake/SKILL.md` exists (per task brief, created Batch 1 iter2) but its own constitution isn't part of this batch — so I can't verify subagents will actually find it. The reference path inside templates is just `mistake` (no full path), relying on Claude Code's skill-name resolution.

### F-S-04 — `evaluation/SKILL.md` is bloated (551 lines) — natural split points exist

**Type**: `general` / **Domain**: `general` (per task brief: not a substantive design issue; polish)
- Marked as Low-confidence

Moved to appendix.

## Stage 2 Verdict

**FAIL** — F-S-02 (Critical, conf 100) — the dual-system spawn contract directly contradicts itself across the three load-bearing docs (delegation/SKILL.md + workflow/evaluation.md + evaluator template). This is a process-design break, not a polish issue. F-S-01 (High, conf 100) compounds — 2 broken links to a non-existent file with wrong anchor in canonical orchestration child docs.

## Low-confidence appendix

- LC-S-1 (conf 25, Low): `evaluation/SKILL.md` at 551 lines is at the upper bound of comfortable single-file context budget. A future split into 4 docs (one per stage) would improve discoverability but would also break the "integrated procedure" framing per task brief carryover — defer.
