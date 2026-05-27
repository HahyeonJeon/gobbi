# T5 Conformance — Risk Perspective (Claude, iter1)

Scope: what could break downstream; what the conformance pass might have silently damaged.

## Adversarial probes run

- **Did the S-key strip violate the safety invariant?** Checked: `disposition` preserved on all 3 backlogs; `priority` preserved on backlogs; `ref_type`/`title`/`source`/`accessed` preserved on references; `value_proposition`/`subsystems` preserved on README. No legitimate per-type key stripped. PASS.
- **Did de-crypt / reshape DELETE any narrative or rationale?** Line-by-line diff of all 3 reshaped backlogs: every Decision/Rationale/Alternatives/Consequences proposition is carried into the new sections. The discussion's Options/Rationale/Implication all survive (T-codes de-crypted to descriptive prose). No deletion. This is the highest-risk probe in the brief and it comes back clean.
- **Provenance loss?** finding-id values (iter1-R3, COD-OVERALL-ITER3-001, F-PROJ-iter3-2, COD-RISK-004) were removed from frontmatter but re-stated in the body `## Related` / `## Originating session` as labeled provenance — consistent with §2.3 (fold provenance into body/session, strip the routing key). No provenance lost.
- **Wrong-tree edit?** `git show 8e6ae25` paths all under `features/guardrails/`; the commit is on the worktree branch `chore/session-2026-05-25-a10c82d6`. No main-tree leak (cf. mistake executor-main-tree-edit-near-miss). PASS.

## Findings

### F-RISK-1 — silent removal of `related:` on references is a (small) unbudgeted content change
- **Type:** assumption_risk | **Domain:** docs-sync | **Disposition:** open | **Confidence:** 100 | **Severity:** Low
- **Evidence:** both references lost their `related:` cross-link arrays (git show 8e6ae25). Brief said this observation is OUT of T5 scope / deferred.
- **Why it matters:** `related` is not in strip-set S, so its removal was not authorized by the mechanical mandate, and the brief flagged it for deferral. The risk is precedent: a mechanical pass that removes non-S keys "while in there" erodes the safety invariant's blanket-vs-allowlist discipline. Low severity because the link targets are git-recoverable and the keys were genuinely non-standard.
- **Suggested direction:** manager confirms whether the removal is accepted; recover from git if not.

### F-RISK-2 — deferred P4 prose wave partially pre-executed without a marker (see F-CONS-1)
- **Type:** scenario_gap | **Domain:** process | **Disposition:** open | **Confidence:** 100 | **Severity:** Medium
- **Evidence:** 3 backlogs + discussion reshaped to §4.2 contract (D4 = P4 wave's mandate, task-list:105) inside the mechanical T5.
- **Why it matters:** a future P4-prose-guardrails executor inherits partially-done work with no record of what remains, risking double-work or skipped files. No content harm.
- **Suggested direction:** mark P4-prose-guardrails' backlog/discussion portion as already-satisfied, or note the breach.

**Must-preserve:** the faithful content mapping and the intact per-type extension keys.

VERDICT: PASS
