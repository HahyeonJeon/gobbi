# Project Perspective — Loop Skills Batch 2 iter1 (Claude)

## Artifact Summary + Memory reads

**What**: 5 loop SKILL.md files (`ideation`, `preparation`, `planning`, `execution`, `wrap-up`) + 5 evaluation.md children — the manuals defining each workflow loop's 4-phase contract (DISCUSSION → WORK → EVALUATION → MEMORIZATION).

**Why**: PR #257 refactor introduced the 6-step workflow with Preparation as a new phase; loop skills must agree on phase contracts, NEEDS_CONTEXT escalation, sole-writer (Wrap-up) contract, and per-loop identity.

**How**: review each SKILL + child evaluation.md for (a) per-loop lifecycle clarity, (b) inter-skill consistency on shared concepts, (c) per-loop evaluator handoff match, (d) state-transition entry/exit, (e) distinct loop identity, (f) hidden assumptions, (g) REVISE re-entry semantics, (h) maxIterations cap, (i) subagent role assignments, (j) memory access enforcement.

**Memory reads**:
- `evaluation/SKILL.md` (4-stage procedure, finding metadata)
- `ideation/evaluation.md` (phase child for adversarial reference)
- `principles/SKILL.md` (Iron Laws, esp. P12 W/W/H, P2 separation, P6 specificity)
- `orchestration/SKILL.md` (manager + 5-role taxonomy + step-machine)
- Each loop SKILL.md + evaluation.md (in-scope artifacts)

**Scope Contract**: 5 loop SKILL.md + 5 evaluation.md only. CLAUDE.md, specs/*.json, agents/, .codex/, plugin mirror are out-of-scope per user lock; cross-layer drift is `disposition: deferred` to issue #258.

## Locked Frame (Stage 1)

Seed scenarios from `ideation/evaluation.md` Project perspective (closest fit) + Stage 1 Creates derived from probes.

**S-P1: Each loop's What/Why/How is clear and unambiguous**
- Every loop SKILL.md states the loop's purpose in one sentence at the top — checked
- Every loop names its input, output, and what triggers entry/exit — checked
- Every loop's identity is distinguishable from adjacent loops — checked

**S-P2: Loop scope contract is sharp — no overlap, no gaps**
- Ideation produces design direction; Preparation closes readiness gaps; Planning produces tasks; Execution implements per task; Wrap-up promotes
- Each loop's outputs feed exactly the next loop's inputs — chain is complete

**S-P3: Loops do not silently absorb work outside their scope**
- WORK discipline rules forbid new content beyond DISCUSSION-approved decisions
- Out-of-scope items are routed to backlog explicitly

**S-P4 (adversarial): The Preparation loop's identity is muddled with Ideation/Planning (NEW)**
- Preparation has clear distinct purpose vs Ideation (which produces design) and Planning (which produces tasks)
- Preparation does not duplicate Ideation's research or Planning's task slicing

**S-P5 (adversarial): A loop quietly produces work the next loop expects but the SKILL doesn't promise (NEW)**
- Every loop's `Outputs` section lists exactly what the next loop's `Inputs` section consumes

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| S-P1 | Loop purpose stated | YES (all 5) | Each SKILL.md opens with a 1-line purpose |
| S-P1 | Input/output stated | YES | Each has Inputs/Outputs blocks per phase |
| S-P1 | Identity distinguishable | YES | Ideation = design; Prep = gap-stamping; Plan = tasks; Exec = per-task code; Wrap = sole-writer promotion |
| S-P2 | Output→next-input chain | PARTIAL | Ideation → Prep (Prep reads `ideation/artifacts/` ✓). Prep → Plan (Plan reads `preparation/artifacts/` ✓). Plan → Exec (Exec reads `planning/artifacts/` ✓). But: planning task schema in Planning SKILL ({ID,What,Anchor,Files,Acceptance}) ≠ planning evaluation.md field schema ({traces-to,verifies,outputs,inputs,requires,files}) — Execution evaluator will check fields Planning never told the leader to write. See finding F-P-01 |
| S-P3 | WORK discipline forbids new content | YES | Each SKILL.md has a "WORK discipline" block stating "No new content" |
| S-P4 | Preparation distinct from Ideation/Planning | YES | Preparation SKILL.md L7-13 explicitly differentiates |
| S-P5 | Output→next-input contract complete | NO | Planning SKILL.md never names `outputs:` / `inputs:` / `verifies:` / `requires:` as task fields, but evaluation.md, execution evaluation.md, AND execution SKILL.md all assume those fields exist. See F-P-01 |

## Typed findings

### F-P-01 — Planning task schema mismatch between SKILL and evaluation child (Critical / 100)

- **Type**: `design_flaw`
- **Domain**: `docs-sync`
- **Disposition**: `open`
- **Severity**: Critical
- **Confidence**: 100
- **Evidence**:
  - `planning/SKILL.md:184`: "Per task, record: **Task ID**, **What**, **Anchor**, **Files touched**, **Acceptance**" — 5 fields, prose names
  - `planning/SKILL.md:315`: required-sections template Tasks section reads `Task ID / What / Anchor / Files touched / Acceptance`
  - `planning/evaluation.md:18,66,69,73,177,180,205,214,244,253`: evaluator enforces `traces-to:`, `requires:`, `verifies:`, `files:`, `outputs:`, `inputs:` — YAML-style field schema
  - `execution/SKILL.md:142`: "task's `files:` scope" and L184: "files outside `files:` set" — assumes the YAML schema
  - `execution/evaluation.md:17,21,29`: "task's `outputs:` field", "`verifies:` command", "`inputs:` are respected" — also assumes YAML schema
- **Impact**: a Planner who writes the SKILL-prescribed schema will FAIL evaluation; an Execution evaluator running `git diff` to compare scope will demand a `files:` field that Planning never told the leader to write. This is a contract break at every Planning → Execution → Evaluation handoff.
- **Remediation**: pick one — either (a) update Planning SKILL.md to define the YAML schema with all fields (`traces-to`, `files`, `requires`, `verifies`, `outputs`, `inputs`, `acceptance`), or (b) update both evaluation.md children to use the prose schema. Option (a) preferred — YAML fields are mechanically checkable.

### F-P-02 — Ideation lacks FAIL verdict (Medium / 100)

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: `open`
- **Severity**: Medium
- **Confidence**: 100
- **Evidence**: `ideation/SKILL.md:326,346,354,378` consistently say "`PASS` or `REVISE`"; all four other loop SKILL.md files (preparation/planning/execution/wrap-up) say "`PASS` / `REVISE` / `FAIL`"
- **Impact**: if Ideation evaluator produces a FAIL (which the evaluation skill permits — Critical/75 finding → FAIL), the Ideation SKILL.md has no documented routing for it. Manager either improvises or treats FAIL as REVISE (lossy).
- **Remediation**: add `FAIL` to Ideation SKILL.md EVALUATION procedure rows + MEMORIZATION inputs + transition table.

## Low-confidence appendix

(none)
