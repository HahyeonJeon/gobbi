# Consistency — T3 iter1

## Locked Frame
- C1: Idea §7.3 anchor set → applied edits are 1:1 (spec-coverage)
- C2: workflow.chat.tasks[] schema text in State persistence matches Workflow Metadata
- C3 (adversarial): Are there internal contradictions between the new sections?

## Stage 2 Findings

### Spec coverage (Idea §7.3 row-by-row)
| §7.3 row | Anchor | Applied? | Evidence |
|---|---|---|---|
| 1 | Lines 62–76 § Orchestration Mode | YES | CORRECTION at 66; Chat at 70; Auto at 74 |
| 2 | Lines 80–84 § Workflow header (mode-dispatch) | YES | Mode-dispatch paragraph 84–89 |
| 3 | Lines 234–241 § Inter-loop transition | YES | 3-col 3-row table at 241–245 |
| 4 | Line 241–242 lock | YES | strike-through + inline CORRECTION at 247 |
| 5 | Lines 245–290 § Workflow Status Display | YES | Chat-mode rendering at 298 |
| 6 | § Mode-specific gates (line 387–405) | YES | 4th gate at 405 + discuss-first at 409 |
| 7 | § Workflow State Machine (line 338+) | **PARTIAL** | State persistence got tasks[] row; the State Machine intro 346–348 got no mode-dispatch branch. May be acceptable if planner deems anchor 2 sufficient. |
| 8 | § Workflow Metadata (line 426+) + § State persistence (line 343+) | YES | workflow.chat.tasks[] at lines 363 + 469 |

### workflow.chat.tasks[] schema comparison (State persistence line 363 vs Workflow Metadata line 469)
- Both name: taskNo (zero-padded), slug (kebab-case), startedAt, finishedAt, ideation/preparation/planning/execution sub-records with same shape, taskRecord{path,writtenAt}, preparation default "Skipped" (R1). ✓ consistent
- State persistence row adds: "Templates" note + R3/R2 split sentence
- Workflow Metadata row adds: Update points sentence
- Both sub-sets correctly differ in scope (state.json vs session.json archive); not a contradiction.

### Findings
- **Finding C-1 — `scenario_gap` / `docs-sync`** (carried from Project P-1): Idea §7.3 row 7 (Workflow State Machine mode-dispatch branch + R1 mapping) is not realized inside § Workflow State Machine itself; only § Workflow at lines 84–89 carries it. The State Machine section's intro paragraph is unchanged from baseline. The planner may have intentionally consolidated; the executor may have under-applied. Confidence: 50. Severity: Medium. Disposition: open.
- **Finding C-2 — `general` / `docs-sync`**: "pauses at three points" stale lead-in (already covered in Structure S-1). Confidence: 100. Severity: Low. Disposition: open.

## Verdict: REVISE (single Medium finding to discuss with user — anchor 7 partial)
