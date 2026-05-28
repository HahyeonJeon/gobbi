# Planning Eval iter2 — Structure perspective (Claude)

**Frame:** Task decomposition, ≤35 budget ceiling, DAG soundness, partition completeness/disjointness.

## iter1 finding under this lens
- **DOC-STRUCT-1 (prose tasks exceed ≤35 ceiling, High/100): CLOSED.** iter1 P3=41/P5=44/P7=68. iter2 splits along the SAME conformance A/B boundaries: P3→P3a(20)/P3b(21), P5→P5a(24)/P5b(20), P7→P7a(35)/P7b(33). Re-counted on filesystem: gw-A=20, gw-B=21, ir-A=24, ir-B=20, pt-high=35, pt-rem=33 — all confirmed. Prose set now {14,15,20,21,10,24,20,30,35,33}, max=35. Every prose task ≤~35.

## Fresh pass — DAG soundness after splits
- **Conformance-before-prose on shared files preserved:** P3a→T3, P3b→T4, P5a→T6, P5b→T7, P7a→T9b, P7b→T9c (each prose requires its matching conformance). A→B chaining serializes same-tree edits (P3b requires P3a; P5b requires P5a; P7b requires P7a) — verified in requires lists.
- **New P*a/P*b outputs→inputs connected, 0 dangling:** P3a emits git-workflow-a-prose-quality (consumed by P3b + N1); P3b emits git-workflow-b-prose-quality (N1). Same for P5/P7. N1 inputs list 11 prose-quality refs, all produced (verified line 637). T11 requires 10 leaf conformance records (T3 via T4, T6 via T7 transitive closure) — sound.
- **Partition complete + disjoint:** 154 feature + 68 project-tier = 222; prose partition identical. No P_live doc double-assigned; features/README→T9c only.
- Task total 22→25, consistent in draft + staged main.md (task_count: 25).

**Verdict: PASS** — splits honor the ceiling; DAG and partition survive the restructure.
