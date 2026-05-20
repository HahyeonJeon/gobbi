# Structure Perspective — Loop Skills Batch 2 iter1 (Claude)

## Artifact Summary + Memory reads

(See `project.md` for the shared Stage 0 summary; same artifacts under evaluation; same memory reads.)

## Locked Frame (Stage 1)

**S-S1: All 5 loop SKILL.md files share the same skeleton**
- Each has: frontmatter, intro, Core Principles, DISCUSSION, WORK, EVALUATION, MEMORIZATION, Output paths, Constraints
- Each has a Memory Access Matrix block (or equivalent in-line memory-read enumeration)

**S-S2: All 5 evaluation.md children share the same skeleton**
- Each has: 7 perspectives in fixed order (Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk) + Overall + Output reminder
- Each per-perspective block has: scenarios w/ checklists + recommended verifications + perspective-specific anti-patterns

**S-S3: Phase block structure is uniform across loops**
- Each phase block has: Purpose, Inputs, Procedure (numbered table with Agent/Input/Action/Output cols), Outputs, Exit checklist

**S-S4 (adversarial): A loop's SKILL is structurally singular — diverges from the family**
- Compare top-level headers across 5 SKILL.md — flag any missing block

**S-S5: Memory Access Matrix is uniform across loops**
- Same column shape; same enforcement language; same delete semantics block

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| S-S1 | Skeleton uniformity | NO | Ideation SKILL.md has NO top-level `## Memory Access Matrix` section (other 4 do). Ideation has only sub-step-A "Memory reads required" table at L81-92. See F-S-01 |
| S-S2 | Evaluation.md skeleton uniformity | YES | All 5 have 7 perspectives + Overall + Output reminder |
| S-S3 | Phase block uniformity | YES | Procedure tables use Agent/Input/Action/Output cols throughout |
| S-S4 | Structural singularity check | YES (per S-S1) | Ideation diverges |
| S-S5 | Memory Access Matrix uniformity | PARTIAL | Of the 4 that have it: Preparation/Planning/Execution use "leader role"/"executor role" + tier table + delete semantics + write enforcement. Wrap-up has the same shape but called "assistant role". Ideation absent. See F-S-01 |

## Typed findings

### F-S-01 — Ideation SKILL.md missing top-level Memory Access Matrix (High / 100)

- **Type**: `design_flaw`
- **Domain**: `docs-sync`
- **Disposition**: `open`
- **Severity**: High
- **Confidence**: 100
- **Evidence**: `grep -n "Memory Access Matrix"` returns hits for preparation/SKILL.md:19, planning/SKILL.md:24, execution/SKILL.md:22, wrap-up/SKILL.md:22 — but zero hits for ideation/SKILL.md. The Ideation skill instead embeds memory-read enumeration only inside Sub-step A at L81-92, with no overarching tier table, no write-enforcement clause, no delete semantics block.
- **Impact**: an Ideation leader has no canonical reference for the full session-memory tier matrix. The Constraints block at L457 says "Never write to project memory" but does not cite the tier table that authorizes the staging writes leader does perform. New writers / evaluators cannot mechanically check Ideation memory boundaries against the same shape as the other four loops.
- **Remediation**: add a `## Memory Access Matrix` section after the intro of `ideation/SKILL.md` mirroring the table shape from `preparation/SKILL.md:19-35`. Tier rows for: own loop rawdata, own loop staging, session.json (FORBIDDEN for leader), feature memory (READ-ONLY), project memory (READ-ONLY).

### F-S-02 — Planning/Ideation lack NEEDS_CONTEXT escalation for leader (High / 75)

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: `open`
- **Severity**: High
- **Confidence**: 75
- **Evidence**: only `execution/SKILL.md` and `wrap-up/SKILL.md` describe `NEEDS_CONTEXT` as the subagent escalation primitive (execution L53,144,280,288; wrap-up L39,53,137,172,351,357). Ideation, Preparation, and Planning leaders escalate via "surface to manager" + manager runs AskUserQuestion — but never name the structured `NEEDS_CONTEXT` mechanism.
- **Impact**: leaders in Ideation/Preparation/Planning have no documented status-enum to return when a decision exceeds their authority (e.g., USER CHALLENGE per Planning's principle). The asymmetry violates Principle 6 — when subagents hit unresolvable decisions, the manual specifies "return NEEDS_CONTEXT with a user-question: block" only for executors and Wrap-up assistants, not leaders.
- **Remediation**: add `NEEDS_CONTEXT` escalation contract to Ideation/Preparation/Planning Core Principles or a parallel Reporting block. Either name the same primitive consistently or document why leader-managed escalation is different.

### F-S-03 — Execution evaluation output path drift between SKILL and child doc (Critical / 100)

- **Type**: `design_flaw`
- **Domain**: `docs-sync`
- **Disposition**: `open`
- **Severity**: Critical
- **Confidence**: 100
- **Evidence**:
  - `execution/SKILL.md:182,207,266`: evaluation files at `sessions/.../execution/{task-id}/evaluation/iter{n}/{system}/...`
  - `execution/evaluation.md:425`: "seven per-perspective files + one overall file under `sessions/{date}-{session-id}/execution/evaluation/iter{n}/{system}/`" — MISSING the `{task-id}/` segment
- **Impact**: an evaluator loading `execution/evaluation.md` at Stage 0 will write to the wrong path (loop-scoped, not task-scoped). MEMORIZATION will then fail to find the per-perspective files where the parent SKILL says they should be. This is a hard runtime contract break.
- **Remediation**: update `execution/evaluation.md:425` to insert `{task-id}/` into the path.

## Low-confidence appendix

### F-S-04 — Phase block ordering inside evaluation.md children deviates from SKILL.md order (Low / 50)

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: `deferred` (per user lock to issue #258 if cross-layer; otherwise minor polish)
- **Severity**: Low
- **Confidence**: 50
- Polish-level — both files render perspectives in the same order; SKILL.md doesn't re-order phases.
