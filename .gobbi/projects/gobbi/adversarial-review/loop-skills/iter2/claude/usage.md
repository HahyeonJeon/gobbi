# Usage Perspective — Loop Skills Batch 2 iter2 (Claude)

## Artifact Summary + Memory reads

(See `project.md` for the shared Stage 0 summary.)

## Locked Frame (Stage 1)

Inherited from iter1.

**S-U1: Each loop SKILL usable standalone by the owning agent** (inherited)
**S-U2: Each evaluation.md usable standalone by an evaluator at Stage 0** (inherited)
**S-U3: Cross-references resolve** (inherited)
**S-U4 (adversarial): Wrong mental model from reading** (inherited)
**S-U5 (NEW iter2): Fix E's 3-file promotion contract is operationally complete**
- An Execution executor reading planning/SKILL.md needs to know whether a generated-skill exists in project memory — verify the contract is discoverable from Execution's perspective

**Accessibility / I18n**: `not-applicable:` (workflow docs)
**Observability**: each loop traces failure modes; FAIL escalation now uniformly documented across all 5 loops (Fix A + Fix B)

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| S-U1 | Standalone usability | YES | Unchanged |
| S-U2 | Evaluator Stage 0 readiness | YES | F-S-03 (execution evaluation.md path) addressed; all 5 evaluator children now write to consistent paths |
| S-U3 | Cross-references resolve | YES (sample-verified) | Spot-checked Fix E links: wrap-up/SKILL.md → preparation/SKILL.md, orchestration/SKILL.md → preparation/SKILL.md — all reach valid sections |
| S-U4 | Mental model unambiguous | YES | Unchanged |
| S-U5 | Generated-skill discoverable | YES | Promoted skills land at `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` — standard Skill load path; in-session Execution executors invoke them via the Skill tool just like other project-level skills. No additional doc needed in execution/SKILL.md |

## Typed findings (iter2)

### F-U-01 (iter1: per-task vs loop-wide iter counter ambiguity) — Disposition update

- **Disposition**: `open` (not addressed in iter2 fix list; ambiguity persists — cross-layer concern with orchestration spec)
- **Severity**: Medium / **Confidence**: 75 (unchanged)
- **Note**: execution/SKILL.md L215 still names per-task iter; orchestration/SKILL.md retains loop-wide iter shape. Partly out-of-scope per #258 but the asymmetry persists in scope-eligible artifacts.

### F-U-02 (iter1: discussion-log lifecycle documented only in Ideation) — Disposition update

- **Disposition**: `addressed`
- **Evidence**: ideation/SKILL.md L411 explicitly declares the lifecycle canonical for all 5 loops: "All five workflow loops use the same discussion-log pattern; this is the canonical description. Loops that defer to 'manager-captured AskUserQuestion exchanges' in their MEMORIZATION procedure follow the same mechanics without re-specifying them." The orphaned-input concern is resolved by promoting Ideation's spec to canonical-for-all.

## Low-confidence appendix

(none new)

## Verdict

**REVISE** — F-U-01 (Medium/75) persists; not addressed by iter2 fix batch. Per-perspective verdict floor: REVISE until F-U-01 closed or explicitly deferred to #258.
