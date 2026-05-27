# Planning Evaluation — Overall (Stage 3, Claude, iter1)

## Per-perspective verdicts
| Perspective | Verdict | Driving finding(s) |
|---|---|---|
| Project | REVISE | DOC-PROJECT-1 (archive-glob scope leak) High/100 |
| Structure | REVISE | DOC-STRUCT-1 (prose tasks > ≤35 ceiling) High/100 |
| Performance | REVISE | DOC-PERF-1 (P7=68 overflow risk) High/75 |
| Aesthetics | PASS | DOC-AESTH-1 Low/75 only |
| Usage | PASS | DOC-USAGE-1/2 Medium |
| Consistency | REVISE | DOC-CONS-1 High/100; DOC-CONS-2 Medium/100 |
| Risk | REVISE | DOC-RISK-2 High/100; DOC-RISK-1 Medium/100 |

## Count re-verification (independent, at HEAD d2b5b37)
All headline counts CONFIRMED under the plan's own predicate:
- Total P_live = **222** ✓; READMEs = **18** ✓; content = **204** ✓.
- Per-feature: 14/15/20/21/10/24/20/4/26 → feature-tier **154** ✓; project-tier T9b **35** + T9c **33** = **68** ✓; 154+68 = **222** ✓.
- T9 split 26+35+33 = **93** ✓. git-workflow A+B = 41 ✓; install-runtime A+B = 44 ✓.
- Leak baseline **63** ✓ — reproduced EXACTLY: buggy `*/agents/*` filter + literal D6 key-set = 59; corrected filter (keeps features/agents) = 63; the 4 named agents leak files match.
- Partition complete (0 uncaptured P_live docs) and disjoint (features/README → T9c, not double-counted).
- Schema: all 22 tasks carry all 8 YAML fields; 0 placeholders; inputs/outputs chain 0-dangling; agent table 22 rows.

The count work is **excellent and survives adversarial re-verification**. The count-correction narrative (208→222) is a genuine measurement fix, not scope drift.

## Cross-perspective tensions
- Structure/Performance/Consistency/Risk/Project ALL independently land on the SAME two root issues: (1) the `**` `files:` globs leak into frozen archive (DOC-PROJECT-1 = DOC-CONS-1 = DOC-RISK-2), and (2) prose tasks abandon the ≤35 ceiling that conformance honors (DOC-STRUCT-1 = DOC-PERF-1). Convergence of 5 perspectives on 2 roots is a strong REVISE signal.
- Aesthetics/Usage PASS but their findings (DOC-AESTH-1, DOC-USAGE-1/2) are the readability/executor-confusion facets of the same two roots — they do not contradict the REVISE perspectives.

## Cross-cutting findings (no single perspective owns)
- **DOC-CONS-2 (underscore staging keys, Medium/100):** spans Consistency + Risk — the gate reports a false "0 leaks" while 5 install-runtime docs retain `promoted_from`/`promoted_at`. This is the only finding that touches the SUCCESS-CRITERION VALIDITY itself (SC2 "0 leaks" could be falsely certified). Worth elevating in the user discussion even though it is Medium, because it is a Goodhart/Iron-Law-11 risk: the metric passes without the condition being met.

## Karpathy failure-mode check
- **Wrong assumptions:** YES (minor) — T10 assumes AGENTS.md and .codex/AGENTS.md are two independent files; they are one file + a symlink (DOC-USAGE-2/DOC-RISK-1). Also the gate assumes only hyphenated staging keys exist (DOC-CONS-2).
- **Overcomplexity:** NO — the wave/group decomposition is appropriately boring; T9 3-way split is justified, not gold-plating.
- **Orthogonal edits:** NO — tasks are cleanly partitioned by feature/tier; no task bundles unrelated checklist items. (The `**`-glob archive leak is a glob-precision bug, not an orthogonal-edit bundle.)
- **Imperative-over-declarative:** NO — tasks state verifiable goals (leak-gate = 0, 9 base keys, git-diff scope) rather than prescribing exact diffs. Good declarative shape.

## Preserve list (do NOT break on REVISE)
- The independently-verified count system (222/18/204/63) and the buggy-vs-corrected filter reproduction — this is the plan's strongest asset; the remediation must NOT re-touch the counts.
- The DAG / `requires` ordering: Pk-requires-Tk (conformance-before-prose-on-shared-file) HONORS the carry-forward exactly; T3→T4, T6→T7 chaining; T11-requires-all-10; N1-last. Sound — preserve.
- The complete + disjoint partition (every P_live doc → exactly one Wave-1 task and one Wave-2 task).
- T0/T11 rules.md canonical-vs-symlink handling and the D9 never-delete injection into every prose task.
- T10's WORKTREE-physical edit target (the main-tree hazard mitigation is correct; only the symlink mismodel needs fixing).
- Uniform 8-field schema; 0 placeholders; 0-dangling inputs/outputs chain.

## Overall findings summary (open, contributing)
| ID | Type | Domain | Sev | Conf | Root |
|---|---|---|---|---|---|
| DOC-PROJECT-1 / DOC-CONS-1 / DOC-RISK-2 | design_flaw | process/docs-sync | High | 100 | `**` files: globs leak into frozen archive (contradicts D10 + line 710); count vs glob asymmetry |
| DOC-STRUCT-1 / DOC-PERF-1 | design_flaw / assumption_risk | process/performance | High | 100/75 | prose tasks P3=41/P5=44/P7=68 exceed the plan's own ≤35 ceiling that conformance honors |
| DOC-CONS-2 | design_flaw | docs-sync | Medium | 100 | literal D6 predicate misses 5 underscore-key leaks → false "0 leaks" (SC2 validity) |
| DOC-USAGE-2 / DOC-RISK-1 | design_flaw / assumption_risk | docs-sync/process | Medium | 100 | T10 treats AGENTS.md (a symlink) as a 2nd real file |
| DOC-USAGE-1 | checklist_gap | process | Medium | 100 | task stated count ≠ glob match count (archive) |
| DOC-AESTH-1 | general | docs-sync | Low | 75 | ≤35 ceiling header not scoped to Wave 1 |

## Aggregated reasoning
The plan is rigorous, well-decomposed, and its counts survive hostile re-verification exactly — a genuinely strong artifact on the dimensions the brief stressed most (counts, anchors, ordering, schema). It is NOT a FAIL: no Critical-with-confidence-≥75 finding exists; the ordering invariant the carry-forward demanded is correctly enforced; the partition is complete and disjoint; every task is anchored and schema-complete.

However three open findings cross the High threshold (≥ High at ≥50 confidence), so the verdict is **REVISE**:
1. The `**` `files:` globs (T9a/P5/P6/N1) would edit frozen `archive/` docs that D10 + the Out-of-Scope section explicitly exclude — verified empirically (2 archive content docs + 5 archive READMEs match), and the per-task git-diff verify cannot catch it. High/100.
2. The prose tasks (P3=41, P5=44, P7=68) abandon the ≤35-doc context ceiling that conformance was split to honor — the carry-forward's named overflow hazard, applied to the MORE context-heavy prose wave. High/100 (structural) / 75 (perf risk).

Plus the Medium DOC-CONS-2 (underscore staging keys → false "0 leaks") is worth raising because it touches SC2 validity directly. The fixes are surgical (add archive exclusion to globs; split 3 prose tasks; extend the D6 key-set), and none requires re-doing the count work.

VERDICT: REVISE
