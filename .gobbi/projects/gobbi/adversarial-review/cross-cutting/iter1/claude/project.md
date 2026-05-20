# Project Perspective — Cross-cutting Batch (iter1, claude)

## Stage 0 — Target Understanding

**Artifacts under evaluation**: 7 cross-cutting skills + child docs.
- `orchestration/SKILL.md` (state-machine + 6-step workflow) + `orchestration/workflow/{ideation,preparation,planning,execution,wrap-up,memorization,evaluation}.md`
- `discussion/SKILL.md` (Question Card + Decision Classification + Anti-Sycophancy)
- `delegation/SKILL.md` + 4 templates (leader/executor/evaluator/assistant)
- `evaluation/SKILL.md` (551-line 4-stage procedure)
- `memorization/SKILL.md` + `memory-map.md` + 16 templates
- `research/SKILL.md` (internal + external surfaces)
- `interview/SKILL.md` (5-wave bootstrap)

**What/Why/How (extracted)**:
- W: 7 cross-cutting skills that govern how the 5 work-loop skills (ideation/preparation/planning/execution/wrap-up) coordinate across the 6-step workflow.
- W: Refactor PR #257 — replace v0.4.x dual-stance with 5-role taxonomy; lock 6-step workflow including Preparation; institutionalize manager-only AskUserQuestion + sole-writer + dual-system evaluation.
- H: Each skill owns one cross-cutting concern; orchestration is the state-machine governor; delegation is the spawn contract; evaluation/memorization are the EVAL/MEM sub-phase contracts; discussion is the user-interface contract; research/interview are special-purpose.

All three axes clear. **No W/W/H gate failure.** Phase tag `cross-cutting` accepted (no phase-mismatch — these are skill artifacts, not loop outputs).

**Memory reads**: Batch 1+2 carryover assumptions trusted per task brief.

## Stage 1 — Locked Frame

### Seed scenarios (all carry attached checklists)

**S1. The 6-step workflow definition is the same everywhere it's named**
- [ ] `orchestration/SKILL.md` enumerates: Configuration / Ideation / Preparation / Planning / Execution / Wrap-up
- [ ] Every workflow/{loop}.md cross-references the same enum
- [ ] Per-loop sibling skills' phase-tag enums match
- [ ] No "5-step" or "7-step" residue from v0.4 or earlier

**S2. The Scope Contract is named-and-locked at one canonical point and consumed downstream**
- [ ] One canonical Scope Contract location named (ideation Sub-step B)
- [ ] Preparation / Planning / Execution / Wrap-up explicitly cite it as input
- [ ] Out-of-scope work routing is uniform across loops

**S3. The right problem this PR solves shows up in each skill's own framing** (adversarial — does each skill solve its own piece, or smuggle scope from neighbors?)
- [ ] orchestration solves *state machine + role-of-manager*, not delegation prompt structure
- [ ] delegation solves *spawn contract*, not state machine
- [ ] evaluation solves *4-stage review*, not memorization staging
- [ ] memorization solves *staging + idempotency*, not finding taxonomy (defers to evaluation)
- [ ] discussion solves *AskUserQuestion template*, not orchestration choreography
- [ ] research solves *insight extraction*, not destination promotion
- [ ] interview solves *bootstrap*, not the 6-step workflow

**S4. (adversarial) Interview's bootstrap-mode exception is bounded and discoverable**
- [ ] Interview is reachable from orchestration's entry (manager session)
- [ ] Bootstrap end-condition is stated (when does interview-mode stop applying?)
- [ ] memorization/SKILL.md's "Wrap-up sole writer" claim accommodates interview's direct writes

## Stage 2 — Findings

### F-P-01 — Discoverability gap: Interview is invisible to orchestration

**Type**: `general` / **Domain**: `process` / **Confidence**: 75 / **Severity**: High / **Disposition**: open

**Evidence**: `orchestration/SKILL.md` (entire file) never mentions `interview`. `memorization/SKILL.md:43-45` Memory Access Matrix declares feature/project memory FORBIDDEN for loops `{preparation, ideation, planning, execution}` + Wrap-up exception — but says nothing about Interview, which writes directly to project memory in 11 different paths per `interview/SKILL.md:303-315`. The Interview's "auto-recommendation from Configuration" trigger (`interview/SKILL.md:44-45`) requires Configuration step to know about Interview, but `orchestration/SKILL.md` Step 1 Configuration table (rows 1-6) does not mention any project-memory-sparseness check or interview branch.

**Why it matters**: An agent loading `orchestration/SKILL.md` to drive a session has no entry point to invoke Interview. The "auto-recommendation" cannot fire because Step 1 does not specify it. This breaks the bootstrap path on greenfield projects.

### F-P-02 — Scope Contract has no canonical anchor

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 75 / **Severity**: High / **Disposition**: open

**Evidence**: "Scope Contract" is referenced as a load-bearing input by 5 skills:
- `evaluation/SKILL.md:39` reads it from "prior-loop artifact tagged `artifact_type: scope-contract`"
- `orchestration/workflow/preparation.md:38` "Read Ideation Output"
- `orchestration/workflow/planning.md:43` "Confirm scope is still valid"
- `research/SKILL.md:64` "Locked Scope Contract" listed as input
- `ideation/evaluation.md:9-13` seed scenarios

But no skill in scope defines what fields the Scope Contract has, what its artifact_type slug is, or which schema it uses. `evaluation/SKILL.md:39` references "or equivalent" (a soft contract). Six dependent skills, zero canonical definition.

**Why it matters**: The W/W/H gate at `evaluation/SKILL.md:135` requires reading the Scope Contract; downstream verification can't confirm "the contract is sharp" if the contract's own schema is undefined. This is the load-bearing "What" the whole 6-step workflow operates on.

### F-P-03 — Configuration step does not include sparse-memory check (interview trigger)

**Type**: `general` / **Domain**: `process` / **Confidence**: 50 / **Severity**: Medium / **Disposition**: open

**Evidence**: `interview/SKILL.md:44-45` claims "during the workflow's Configuration step, the manager checks the project memory tree at `.gobbi/projects/{project-name}/`. If the manager judges memory sparse..."  But `orchestration/SKILL.md` Step 1 Configuration's 6-row procedure (lines 76-82) contains zero rows for this check. The check is owned by Interview, but its trigger lives in Configuration — neither side has the row.

### F-P-04 — `feature` set "during Ideation" but no specific sub-step or step responsible

**Type**: `general` / **Domain**: `process` / **Confidence**: 50 / **Severity**: Medium / **Disposition**: open

**Evidence**: `orchestration/SKILL.md:82` says "leave `feature` as `null` if not yet clear and stamp later, typically during Ideation". `orchestration/workflow/ideation.md:48` says "After Sub-step B, the manager stamps `project`, `feature`, `task`". But `memorization/SKILL.md` Step 1 "VERIFY" gate (line 153) requires `feature` to be set — and `memorization/memory-map.md:30-31` per-loop subtree uses `{loop}` not `{feature-name}`. If Ideation doesn't actually set `feature` (because the broader feature was unclear), Preparation's verification gate fails.

## Stage 2 Verdict

**REVISE** — F-P-01 (High, conf 75) gates the verdict per the threshold rule. Interview discoverability is a real coverage gap, not a polish nit.

## Low-confidence appendix

- LC-P-1 (conf 25, Low): The 7-skill set could be reduced by merging `discussion` into `orchestration` (discussion is already framed as "sub-document of orchestration"). Worth considering but the current separation aids loading economy.
