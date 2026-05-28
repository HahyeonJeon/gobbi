# Planning Evaluation — Consistency (Claude, iter1)

## Artifact Summary + Memory reads
(Shared summary in project.md.) Consistency focus: inputs/outputs name-match, traces-to resolves, counts cross-foot, internal contradictions.
**Memory reads:** design-options.md (D6 predicate + 59/63 baselines), scope-contract.md (SC2), carry-forward.

## Locked Frame (Stage 1)
- **S1 inputs name-match upstream outputs** — every consumed token produced upstream.
- **S2 traces-to resolves to real Ideation text.**
- **S3 Counts cross-foot** — 222/18/204/63; per-task sums; T9 split 26+35+33=93.
- **S4 Task field schema uniform.**
- **S5 (adversarial) An internal contradiction between sections** — count vs glob, ceiling vs prose, archive-in vs archive-out.

## Per-scenario per-check results
- **S1:** YES — T0→`dev-doc-quality-standard-section` consumed by all retrofit; T3→`git-workflow-a-conformant`→T4; T6→`install-runtime-a-conformant`→T7; T9a/b/c→three outputs; T11 consumes all 10 `*-conformant` (all produced); each Pk consumes its `*-conformant` and emits `*-prose-quality`; N1 consumes all 7 (P6 emits both pm + workflow prose-quality). 0 dangling.
- **S2:** YES — traces-to spot-checked against scope-contract.md / idea.md verbatim text; all resolve.
- **S3:** YES (under the plan's own predicate) — **independently re-verified at HEAD d2b5b37:** total=222 ✓, READMEs=18 ✓, content=204 ✓. Per-feature: T1=14,T2=15,T3=20,T4=21,T5=10,T6=24,T7=20,T8=4,T9a=26 → 154 ✓. Project-tier T9b=35, T9c=33 → 68 ✓. 154+68=222 ✓. T9 split 26+35+33=93 ✓. git-workflow A+B=41 ✓, install-runtime A+B=44 ✓. **Leak baseline 63 ✓:** reproduced exactly — buggy `*/agents/*` filter + literal D6 key-set = 59; corrected filter = 63; the 4 agents leak files match the plan's named 4 exactly. Partition is complete (0 uncaptured P_live docs) and disjoint (features/README correctly routed to T9c, not double-counted).
- **S4:** YES — uniform 8-field schema across 22 tasks.
- **S5:** **NO — two real internal contradictions found** (DOC-CONS-1, DOC-CONS-2).

## Typed findings

### DOC-CONS-1 — Archive: NOT-in-scope (line 710) contradicts the `**` files: globs (T9a/P5/P6/N1)
- **Type:** design_flaw · **Domain:** docs-sync · **Disposition:** open · **Confidence:** 100 · **Severity:** High
- **Evidence:** Line 710 + D10 + every gate exclude nested `features/*/archive/`; the gate/count commands use `-not -path "*/archive/*"`. But T9a/P5/P6 `files:` `**/*.md` and N1 `**/README.md` carry no exclusion and match the 2 nested-archive content docs + 5 archive READMEs (empirically verified). The edit surface and the verify/count surface are internally inconsistent. (Primary scope statement of this is DOC-PROJECT-1; here it is the consistency contradiction.)
- **Why it matters:** Same finding tagged from the cross-artifact-coherence lens: the plan says one thing in its scope sections and another in its task fields. Whichever an executor follows, the other is violated.
- **Suggested direction:** align the `files:` glob with the gate's archive exclusion.

### DOC-CONS-2 — Underscore-spelled staging keys are invisible to the literal D6 leak predicate (gate gives a false 0)
- **Type:** design_flaw · **Domain:** docs-sync · **Disposition:** open · **Confidence:** 100 · **Severity:** Medium
- **Evidence:** The locked D6 key-set S enumerates only HYPHENATED keys: `finding-id, confidence, severity, surfaced-by, promoted-from, promoted-at, mistake-candidate` (design-options.md lines 34-36; plan Counts note lines 130-132). Empirically, 5 files in `features/install-runtime/` carry ONLY underscore-spelled staging keys (`promoted_from`, `promoted_at`) and NO hyphenated leak key: `discussions/env-var-audit-scope-discussion.md`, `decisions/{session-start-hook-script,env-file-load-semantics,task-decomposition,pre-planning-readiness}-decisions.md`. Under the literal D6 predicate these 5 score as CONFORMANT (0 leak) — but they still carry illegitimate staging-routing keys. SC2's "0 illegitimate staging-key leaks" would be reported satisfied while 5 leaks remain. design-options.md D6 lists "one spelling per key" as a target, acknowledging the spelling hazard, yet the predicate S does not include underscore variants.
- **Why it matters:** The grep gate (T11) and per-task leak gates can pass at "0 leaks" while 5 docs retain `promoted_from`/`promoted_at`. The verification gate is the success-criterion proof; a gate that misses a known spelling variant under-measures conformance. This is a Goodhart risk (Iron Law 11 territory): the metric reads 0 but the underlying condition is not met.
- **Suggested direction:** (manager+user) — extend S to include underscore variants of each key (or normalize spelling first), so the gate catches all 5. Confirm whether `promoted_from/at` are intended as the canonical spelling anywhere (frontmatter schema in rules.md §2.2).

## Low-confidence appendix
- (none)

## Verdict
Consistency: **REVISE** — DOC-CONS-1 High/100 open; DOC-CONS-2 Medium/100. Counts/handoffs/traces otherwise fully verified and exact.
