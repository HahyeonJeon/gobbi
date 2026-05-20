# Risk Perspective — Loop Skills Batch 2 iter1 (Claude)

## Artifact Summary + Memory reads

(See `project.md` for the shared Stage 0 summary.)

## Locked Frame (Stage 1)

**S-R1: Sole-writer contract is enforceable — no leakage path to project memory before Wrap-up**

**S-R2: REVISE re-entry preserves work — prior iter's artifacts not destroyed**

**S-R3 (adversarial): A scope-creep or schema-drift exists that lets a bad write into project memory**

**S-R4: Each loop's `MUST never delete` discipline preserves audit trail**

**S-R5: Evaluation-output path drift could silently lose evaluator findings**

**Privacy / data retention** (Coverage Matrix: Risk + Consistency): `not-applicable:` — loop skills define design contracts, contain no PII or sensitive payload requirements directly.

**License / IP risk** (Coverage Matrix: Risk + Consistency): `not-applicable:` — pure design docs.

**Cost / budget impact** (Coverage Matrix: Performance + Risk): two-system evaluation runs per loop iteration impose 2× LLM cost; bounded by maxIterations (default 3). Acceptable for an evaluation-first redesign.

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| S-R1 | Sole-writer enforceable | YES (mostly) | Each loop's Constraints includes "MUST never write to project memory"; Wrap-up Memory Access Matrix is the only `WRITE + UPSERT` row to project memory. But: Wrap-up SKILL.md:286 says MEMORIZATION is also permitted to write to project memory — undermines the strict statement at L48. See F-A-01 (already filed) |
| S-R2 | REVISE preserves prior iter | YES | Planning L122-134 Restore Point procedure preserves prior draft byte-for-byte. Other loops: rawdata/draft-iter{n}.md is per-iter so prior iters preserved on disk; no SKILL says to overwrite |
| S-R3 | Schema-drift leakage | YES (RISK PRESENT) | F-P-01 — Planning's schema mismatch creates Execution evaluator confusion that could lead to incomplete scope enforcement: if Planner doesn't write `files:` field, Execution evaluator's "git diff --name-only confirms scope adherence" check fails (no source for "task-scoped files") |
| S-R4 | Never-delete discipline | YES | All 5 SKILLs include "MUST never delete" constraint with supersession-via-frontmatter; physical deletion forbidden |
| S-R5 | Evaluator path drift risk | YES (RISK) | F-S-03 — Execution evaluator following the child doc's stated path writes to `execution/evaluation/iter{n}/...` but the SKILL expects `execution/{task-id}/evaluation/iter{n}/...`. Findings could be silently overwritten across tasks |

## Typed findings

### F-R-01 — Wrap-up sole-writer contract has implicit carveout that weakens the strict claim (High / 75)

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: `open`
- **Severity**: High
- **Confidence**: 75
- **Evidence**:
  - `wrap-up/SKILL.md:3`: "Wrap-up is the SOLE writer to project memory in the workflow"
  - `wrap-up/SKILL.md:48`: "No other phase writes to feature memory or project memory. This is the single boundary that makes session work safely reversible — until Wrap-up runs, nothing in the project's permanent memory has changed"
  - `wrap-up/SKILL.md:286`: "Wrap-up's MEMORIZATION is permitted (but not required) to perform additional project-memory writes — typically only when an evaluator finding from Wrap-up's own EVALUATION surfaces a new mistake or learning that itself needs promotion. This is the 'Wrap-up loop exception' in action."
- **Impact**: the carveout at L286 creates a Wrap-up internal exception: WORK writes are bounded by the routing table, but MEMORIZATION can write anything per evaluator finding. The "deterministic routing — no improvisation" principle (L52) explicitly disallows ad-hoc destinations during WORK, but the MEMORIZATION carveout does not have a corresponding restriction. A Wrap-up evaluator finding could trigger an ad-hoc project-memory write that bypasses the routing table.
- **Remediation**: tighten L286 — either remove the MEMORIZATION write carveout (require all promotions to flow through WORK with re-entry via REVISE), or document the carveout's own routing constraints (which destinations are permitted from MEMORIZATION; which require NEEDS_CONTEXT user confirmation).

### F-R-02 — Execution loop's per-task isolation is implicit; cross-task contamination risk (Medium / 50)

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: `open`
- **Severity**: Medium
- **Confidence**: 50
- **Evidence**: `execution/SKILL.md:32-33`: per-task `staging/` and `rawdata/` paths are correctly scoped under `{task-id}/`. But L33 says "prior tasks" memory tier is READ-ONLY, citing `execution/{prior-task-id}/artifacts/`. There is no explicit prohibition on cross-task READING of `staging/` from prior tasks — so task-3 executor reading task-1 staging is permitted, which could lead to scope drift.
- **Impact**: when a later task's executor reads earlier task staging, it may pick up assumptions or "while I was in there" candidates from the earlier task. The SKILL allows this read but doesn't gate it with discipline. Hard to enforce purely via docs but worth a note.
- **Remediation**: tighten the "prior tasks staging" guidance in execution Memory Access Matrix — clarify that staging is for Wrap-up's promotion, not for downstream task READ. The cross-task source of truth is the prior task's `artifacts/` (already noted), not its staging.

## Low-confidence appendix

### F-R-03 — `evaluate.mode == 'skip'` is referenced in orchestration but never named in loop SKILLs (Low / 25)

- **Type**: `general`
- **Domain**: `process`
- **Disposition**: `deferred`
- **Severity**: Low
- **Confidence**: 25
- Cross-layer with orchestration spec; out-of-scope per #258. orchestration/SKILL.md L264 mentions `evaluate.mode == 'skip'`; loop SKILLs don't acknowledge this skip path explicitly.
