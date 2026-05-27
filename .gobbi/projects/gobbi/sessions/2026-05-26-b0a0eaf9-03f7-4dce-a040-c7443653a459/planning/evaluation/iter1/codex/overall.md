## Findings

### F1 - Wave 2 prose tasks violate the inherited context-budget bound
**Type:** design_flaw
**Severity:** High
**Confidence:** 95
**Evidence:** The Preparation carry-forward says Planning must "Bound each wave to a context budget" and define a maximum file-count or byte-ceiling before generating the task list (`preparation/staging/decisions/context-budget-wave-ordering-carry-forward.md:31-34`). The plan itself states each group is bounded to about 35 docs (`planning/rawdata/draft-iter1.md:78-80`) and later claims "Each retrofit task bounded <=~35 docs" (`planning/rawdata/draft-iter1.md:722-724`), but Wave 2 keeps oversized prose rewrites: P3 is 41 docs (`planning/rawdata/draft-iter1.md:413-425`), P5 is 44 docs (`planning/rawdata/draft-iter1.md:443-455`), and P7 is 68 docs (`planning/rawdata/draft-iter1.md:475-491`). These are judgment-heavy prose rewrites, not mechanical conformance passes, so the over-budget shape directly reintroduces the `manager-context-overflow-with-large-bundle` risk that Planning was required to absorb.
**Fix:** Split P3 along the T3/T4 boundary (20/21 docs), P5 along the T6/T7 boundary (24/20 docs), and P7 along the T9b/T9c boundary (35/33 docs), or into smaller typed-dir slices. Update task_count, dependency table, staged plan, inputs/outputs, and N1 prerequisites accordingly.

### F2 - T1 and T5 do not verify preservation of legitimate backlog disposition keys
**Type:** checklist_gap
**Severity:** Medium
**Confidence:** 90
**Evidence:** The locked FIX-1 predicate says `disposition` is stripped only when the file is not under `backlogs/` (`ideation/artifacts/design-options.md:34-42`), and the Scope Contract explicitly excludes stripping `disposition` from backlogs (`ideation/artifacts/scope-contract.md:49-51`). T1 includes `features/agents/**` and that tree has a backlog file with legitimate `disposition: deferred` (`features/agents/backlogs/privacy-retention-agents-metadata-deferred.md:1-11`), but T1's verify only checks leak count, base keys, and path diff (`planning/rawdata/draft-iter1.md:174-186`). T5 includes `features/guardrails/**` and guardrails has backlog files with legitimate `disposition` (`features/guardrails/backlogs/goodhart-factor-when-demanded-deferred.md:1-14`, `features/guardrails/backlogs/hook-event-count-31-vs-29-docs-sync.md:1-14`), but T5's verify also lacks a preservation check (`planning/rawdata/draft-iter1.md:240-252`). The plan's self-review lists disposition-preservation coverage only for T4, T7, T9a, and T9b (`planning/rawdata/draft-iter1.md:660`), confirming T1/T5 were missed. A blanket strip could still pass the current "0 leaks + 9 base keys" checks after deleting legitimate `disposition`.
**Fix:** Add explicit `disposition preserved on every backlogs file` verification to T1 and T5, and update the self-review coverage row to include T1/T5. The command should inspect backlog files specifically, not infer preservation from the leak gate.

### F3 - Task-count text contradicts the 22-task plan
**Type:** general
**Severity:** Low
**Confidence:** 100
**Evidence:** The staged plan frontmatter says `task_count: 22` (`planning/staging/plans/main.md:14`) and the staged dependency summary says all 22 sub-tasks ship this session (`planning/staging/plans/main.md:62-67`). The raw draft, however, says the plan defines "18 in-session tasks" (`planning/rawdata/draft-iter1.md:146-148`) and then says the executable list is "20 records" while enumerating 22 task IDs (`planning/rawdata/draft-iter1.md:149-150`). It also says T11 requires "all 10 Wave-1 conformance tasks" (`planning/rawdata/draft-iter1.md:544-545`, `planning/staging/plans/main.md:64`), while the conformance records are 11 after the T9 split; the direct T11 edge list has 10 entries only because T3 and T6 are transitive through T4 and T7 (`planning/rawdata/draft-iter1.md:368-380`).
**Fix:** Normalize all task-count prose to 22 executable records. Phrase the T11 dependency as "10 direct conformance prerequisites covering all 11 conformance records by transitive closure through T4 and T7" or add direct T3/T6 edges for readability.

VERDICT: REVISE
