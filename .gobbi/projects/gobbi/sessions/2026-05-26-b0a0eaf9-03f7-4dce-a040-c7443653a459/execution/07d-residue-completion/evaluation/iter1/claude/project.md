# Project Perspective — T7d residue-completion (720ae9d)

**Target:** commit 720ae9d — extend §4.4 S-set with phase/loop-iter/sub-step/session-id + strip from 16 conformed docs.

**Contract:** Part A — rules.md §4.4 adds the 4 keys to session-routing-residue group S, §4.5 gate regex extended. Part B — strip those 4 keys (frontmatter-only) from 16 conformed docs across features/{agents,git-workflow,install-runtime}, archive-excluded.

## Verification (own commands)
- `git show 720ae9d -- rules.md`: §4.4 adds 4 table rows (phase same/loop-iter→loop_iter/sub-step→sub_step/session-id→session_id); §4.5 regex extended to `...|phase|loop[-_]iter|sub[-_]step|session[-_]id):`. KEEP list (line 231), §1-3, safety invariant all untouched. PASS.
- Residue grep over 5 conformed features (hyphen + underscore, archive-excluded): empty (exit 1). PASS.
- KEEP key count claim 163/163 not independently recomputed, but no KEEP key appears among the 26 deletions (diff-read), which is the binding invariant.

## Findings
None at Critical/High.

- **[general / docs-sync] Low / Confidence 75** — §4.5 gate inline comment (rules.md line 250: "Includes session-routing residue keys (task/loop/scenario/iter/slug/finding-source).") was NOT updated to mention the 4 newly-added keys, though the regex itself (line 258) was correctly extended. Cosmetic doc-vs-code drift inside the same gate block; the executable regex is correct so the gate behaves correctly. Why it matters: a future reader trusting the comment over the regex could mis-scope the gate. Suggested direction: append phase/loop-iter/sub-step/session-id to the comment. Not blocking — comment, not contract.

## Must-preserve
- The type-aware-allowlist framing and safety invariant in §4.4 (untouched).
- The 4 new S rows correctly model both spellings (phase same-spelling; others hyphen→underscore).

VERDICT: PASS
