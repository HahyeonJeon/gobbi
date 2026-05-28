# Planning Evaluation — Structure (Claude, iter1)

## Artifact Summary + Memory reads
(See project.md for shared summary.) Structure focus: decomposition soundness, DAG correctness, per-task bounding, agent-type fit.
**Memory reads:** as project.md, plus manager-context-overflow-with-large-bundle (≤35-doc ceiling rationale).

## Locked Frame (Stage 1)
- **S1 Each task narrow + bounded** — files-touched per task is enumerated; doc-count per task ≤~35 (the context ceiling).
- **S2 Dependencies form a DAG, topo-sort = documented order** — `requires:` explicit; no cycle.
- **S3 Each task verification concrete** — runnable leak-gate / grep / git-diff.
- **S4 Agent type per task matches work nature** — executor for doc edits; justified.
- **S5 (adversarial) A mega-task hides behind small framing** — prose tasks spanning a whole feature tree (P3=41, P5=44, P7=68) exceed the ≤35 ceiling the plan itself sets.
- **S6 (adversarial) Two tasks modify same file with conflicting intent** — Pk vs Tk on the same file set; index READMEs across T9c/P7/N1.

## Per-scenario per-check results
- **S1:** PARTIAL — conformance tasks all ≤35 (verified empirically: T1=14,T2=15,T3=20,T4=21,T5=10,T6=24,T7=20,T8=4,T9a=26,T9b=35,T9c=33). But prose tasks exceed: P3=41, P5=44, P7=68 (verified: git-workflow 41, install-runtime 44, project-tier 68). See DOC-STRUCT-1.
- **S2:** YES — `requires:` edges form a DAG. Topo sort: T0 → {T1,T2,T3,T5,T6,T8,T9a,T9b,T9c,T10} → {T4(needs T3),T7(needs T6)} → T11(needs all 10 conformance) → P1-P7(each needs its conformance) → N1(needs all prose). No cycle. Documented execution order (line 553) matches.
- **S3:** YES — every task `verifies:` is a runnable leak-gate + base-key count + `git diff --name-only`. Concrete, binary.
- **S4:** YES — all 22 tasks executor+sonnet (22 table rows). Justified: single-category doc edits/authoring with runnable verification; split decisions made in-plan so no leader needed. Matches delegation defaults.
- **S5:** **NO** — P3/P5/P7 exceed the plan's own ≤35-doc ceiling. See DOC-STRUCT-1.
- **S6:** YES (mitigated) — Pk requires Tk (same file set) so conformance commits before prose; T9c→P7→N1 serialize the 2 index READMEs via `requires`; conflict flags section (lines 567-579) documents each. No concurrent edit.

## Typed findings

### DOC-STRUCT-1 — Prose tasks P3/P5/P7 exceed the plan's own ≤35-doc context ceiling
- **Type:** design_flaw · **Domain:** process · **Disposition:** open · **Confidence:** 100 · **Severity:** High
- **Evidence:** Plan line 79: "Each group ≤ ~35 docs (the context ceiling per `manager-context-overflow-with-large-bundle`)." Conformance honors this — that's exactly why T9 was split 3-way (DL-E) and git-workflow/install-runtime split into A/B halves (T3/T4, T6/T7). But the PROSE tasks revert to whole-tree scope: P3 = full git-workflow (41 docs, line 413), P5 = full install-runtime (44 docs, line 443), P7 = full project-tier (68 docs, line 475). Empirically confirmed: git-workflow 41, install-runtime 44, project-tier 68. Prose is explicitly the "judgment-heavier" wave (line 587) — i.e. MORE context per doc than mechanical conformance, not less. Yet conformance was bounded at 35 and prose is allowed up to 68 (≈2× the ceiling).
- **Why it matters:** The carry-forward (F5) and `manager-context-overflow-with-large-bundle` are the named reasons conformance was split. Prose rewrite holds more context per doc (read full body + apply D1/D4/D5 + reclassify), so a 68-doc prose task is a higher overflow risk than the 35-doc conformance task that was deemed too big and split. The asymmetry is internally inconsistent: the plan splits conformance for context budget but leaves prose unsplit. Mid-task overflow forces a re-split after partial edits — exactly the expensive failure the carry-forward warns against.
- **Suggested direction:** (manager+user decide) — split P3 (mirror T3/T4), P5 (mirror T6/T7), and P7 (mirror T9b/T9c) so each prose task is ≤~35 docs, OR record an explicit justification that prose-per-doc context is lower than conformance (with evidence) and accept the larger bound.

## Low-confidence appendix
- (none)

## Verdict
Structure: **REVISE** — DOC-STRUCT-1 High/100 open. Decomposition, DAG, agent-fit otherwise sound.
