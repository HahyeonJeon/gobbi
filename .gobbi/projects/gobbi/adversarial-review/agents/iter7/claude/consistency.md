# Consistency Perspective — 5-Role Agent Taxonomy (iter7, claude — TRULY-TRULY-FINAL)

## Stage 0 — Artifact Summary + Memory reads

See `project.md`. Consistency = cross-doc / cross-section / cross-file sync.

**Memory reads**:
- `iter6/claude/consistency.md` (PASS — full 12-surface convergence on sole-writer invariant)
- `skills/orchestration/SKILL.md` lines 3 (frontmatter), 9 (intro), 65–172 (Step 1–6 procedure), 191–202 (status display), 217–221 (field rules), 250 (schema shape), 305–313 (loop↔agent-type mapping)
- All other SKILL files that reference "six" or "5-step" or similar workflow-count phrasing (Bash sweep returns 0 contradictory hits)

## Locked Frame (Stage 1)

### S-C-iter7-NEW-1 (adversarial — primary): Does every workflow-count reference inside orchestration/SKILL.md agree on "6"?
- Frontmatter (line 3): "six-step workflow (Configuration, Ideation, Preparation, Planning, Execution, Wrap-up)" ✓ baseline
- Intro (line 9): "the six-step workflow that every session executes" ✓ baseline
- Workflow heading (line 60): "The workflow runs six steps" ✓ baseline
- Status display header (line 191): "Step 2 of 6" — must match
- Status table (lines 194–201): 6 rows — must match
- Field rules (line 217): "fixed (1–6; ...)" — must match
- Field rules (line 221): "Step N of 6" — must match
- Schema shape (line 250): 6 keys, display order has 6 steps — must match

### S-C-iter7-NEW-2 (adversarial): Does the iter7 patch leave any sibling file (agents/*, other skills/*) referring to the workflow as 5-step?
- `grep -rn "Step N of 5\|of 5 steps\|5-step\|five-step" .gobbi/projects/gobbi/agents/ .gobbi/projects/gobbi/skills/` must return 0 hits

### S-C-iter7-NEW-3 (adversarial): Does the iter6 sole-writer convergence still hold (no iter7 collateral damage)?
- The 12 surfaces from iter6/claude/consistency.md S-C-iter6-NEW-1 must still agree (iter7 touched only status display + state persistence — should not have hit any sole-writer surface)

## Per-scenario per-check results (Stage 2)

### S-C-iter7-NEW-1 — verified, full intra-doc convergence

All workflow-count references in orchestration/SKILL.md agree on 6:
- Line 3 (frontmatter "six-step workflow") ✓
- Line 9 ("six steps that every session executes") ✓
- Line 60 ("The workflow runs six steps") ✓
- Line 191 ("Step 2 of 6") ✓
- Lines 195–200 (6 table rows) ✓
- Line 217 ("1–6") + step enumeration includes all 6 ✓
- Line 221 ("Step N of 6") ✓
- Line 250 (6 schema keys + 6 display-order steps) ✓
- Step procedure sections at lines 65 / 84 / 102 / 120 / 138 / 156 (6 headings) ✓

### S-C-iter7-NEW-2 — verified, no sibling-file 5-step residue

```
grep -rn "Step N of 5\|of 5 steps\|5-step\|five-step" .gobbi/projects/gobbi/agents/ .gobbi/projects/gobbi/skills/
→ 0 hits
```

### S-C-iter7-NEW-3 — verified, iter6 sole-writer convergence preserved

Re-grep of the iter6 12-surface invariant:
```
grep "Write session and project memory\|routes findings to project memory" .gobbi/projects/gobbi/agents/ .gobbi/projects/gobbi/skills/
→ exactly one hit: orchestration/SKILL.md:171 (Wrap-up MEMORIZATION row, authorized)
```
iter7 patch sites (lines 191, 197, 217, 221, 250) do not overlap with the 12 sole-writer surfaces (lines 99/117/135/153/171/258 + sibling files + agents/assistant.md:18 + wrap-up/SKILL.md:3 + gobbi/SKILL.md:132 + the four per-step "NOT touched during {step}" disclaimers). No collateral damage.

## Typed findings

No new in-scope findings.

## Disposition of inherited findings

| Finding | iter6 state | iter7 disposition |
|---|---|---|
| F-C-iter5-NEW-01 (cross-ref precision; same as F-S/U) | open (Low/50) | open (carry) — not in iter7 scope |
| F-C-iter4-NEW-01 / -02 | addressed (carry) | addressed (carry) |
| F-C-03 / F-C-05 / F-C-DEF-01/02 | deferred (user-locked CLAUDE.md / runtime symlink) | deferred (carry) |

## Verdict

**PASS** — every workflow-count reference inside orchestration/SKILL.md agrees on 6; zero 5-step residue across agents/ + skills/; iter6 sole-writer 12-surface convergence preserved with no iter7 collateral damage.

## Low-confidence appendix

- (none new in iter7)
