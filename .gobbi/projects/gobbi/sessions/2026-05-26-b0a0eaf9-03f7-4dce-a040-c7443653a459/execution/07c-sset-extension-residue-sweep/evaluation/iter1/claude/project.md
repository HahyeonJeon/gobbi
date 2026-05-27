# Project Perspective — T7c S-set Extension + Residue Sweep (commit 5630aa4)

**Evaluator:** Claude (adversarial) — verified with own git/grep, did NOT trust executor report.

## Contract
- Part A: amend canonical `memorization/rules.md` §4.4/§4.5 to add session-routing residue keys (task/loop/scenario/iter/slug/finding[-_]source) to set S.
- Part B: strip those keys from 31 conformed docs across agents/git-workflow/guardrails/install-runtime.
- Principles in scope: P4 (scope bounded by contract), P8 (impl change reflected in docs), P11 (no tool-gaming).

## Verification (own commands)
- `git show --stat 5630aa4`: 32 files = rules.md + 5 agents + 5 git-workflow + 1 guardrails + 20 install-runtime. Matches Part B feature set exactly. **PASS**
- Part A present: §4.4 adds session-routing residue table (both spellings) + explicit KEEP list (related/supersedes/superseded_by/source/design-id/domain/priority/ref_type); §4.5 gate regex extended with `task|loop|scenario|iter|slug|finding[-_]source` + comment + safety-invariant sentence. **PASS**
- Part B: 39 residue-key deletions, all in the 4 targeted features. **PASS**
- Evaluation feature (named in gate list) correctly absent from diff — verified at parent af06a1a it had no residue to strip (not an omission). **PASS**

## Principle compliance
- P4 (scope): Deliverable confined to the 4 contracted features + canonical rules.md. No main-tree edit (worktree only), rules.md is a real file not a symlink. **PASS**
- P8 (docs reflect change): The standard (§4.4/§4.5) was amended in the same commit that performs the strip — gate definition and data are co-consistent. **PASS**
- P11 (no tool-gaming): The conformance gate was extended to genuinely catch the stripped keys, not narrowed to hide residue. Gate over the 4 conformed features = 0 by real removal, not by exclusion. **PASS**

## Findings
None at Project severity ≥ Medium that block. One scope observation deferred to Consistency perspective (sibling residue keys + out-of-scope features).

## Must-preserve
- The amended §4.4 KEEP list — it codifies the exact legit keys that prior T7 evals false-stripped. Keep verbatim.
- Pure-deletion shape (zero added body lines).

VERDICT: PASS
