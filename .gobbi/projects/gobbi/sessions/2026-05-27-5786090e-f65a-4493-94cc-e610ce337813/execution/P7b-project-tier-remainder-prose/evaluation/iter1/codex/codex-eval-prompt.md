# Codex evaluator — P7b (project-tier remainder: 31 mistakes + 2 reviews + 1 rule)

Independent adversarial evaluator, dual-system gobbi eval. A Claude executor (commit `a7d8253`, 31 files) normalized 31 active mistake records to the §4.2:178+template heading set, reshaped 3 ADR-shaped mistakes, fixed 1 review's missing base-schema frontmatter, and reshaped 1 rule. Find what is wrong. DO NOT trust the executor summary — diff the commit and read the files (these are ACTIVE trap records — content-preservation is the #1 check).

## Spec (§4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`)
- §4.2:178 mistakes contract: `## What happened` → `## Why it happens` → `## Correct approach` → `## How to detect` (+ Related; optional User feedback). USER-RATIFIED for this task: full-normalize all 31 mistakes to this heading set (template + §4.2 agree).
- Reviews: `## Subject` → `## Reviewer + scope` → `## Method` → `## Findings` → `## Cross-system divergence` (if applicable) → `## Outcome`.
- Rules: rules template shape.
- §4.3: no LOAD-BEARING body session coords (frontmatter values NOT body; `## Source` footer + literal existing-file paths legitimate).
- §4.4 KEEP keys never stripped.

## Procedure (evidence-based — mandatory)
1. `cd` worktree `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6`; `git show a7d8253 --stat`; `git show a7d8253 -- <each file>`.
2. **CONTENT PRESERVATION (highest priority)** — 31 ACTIVE mistake records were normalized. For every renamed heading (What went wrong→What happened etc.), confirm ALL facts under the old heading survived under the new one. The 3 ADR-reshapes (executor-mirror-path-vs-worktree, manager-context-overflow, worktree-physical-file-missing) are highest risk. Grep distinctive tokens in post-images. A heading-rename that drops content is a CRITICAL failure (this is what the false-preservation mistake guards against on active traps).
3. Heading-set uniformity: confirm ZERO `What went wrong`/`Why it went wrong`/`Corrected approach`/`How to recognize` (+ variants) headings remain in mistakes. Histogram: `for f in $(find .gobbi/projects/gobbi/mistakes -maxdepth 1 -name '*.md' -not -name 'README.md'); do grep -hE '^## ' "$f"; done | sort | uniq -c`.
4. **Section ORDER:** ~10 mistakes may have order `What happened/Why it happens/How to detect/Correct approach` instead of the §4.2:178 order `What happened/Why it happens/Correct approach/How to detect`. ASSESS: does §4.2:178 mandate the exact order, or just the section SET? (Be fair — the brief explicitly limited scope to wording normalization, not reordering; flag only if the standard mandates the order.)
5. Reviews: 2 docs match the reviews template; the previously-empty-type review has full base-schema frontmatter (`name`/`description`/`type: reviews`/`scope`/`feature`/`created`/`tags`).
6. Rule: stub-redirect-format matches the rules template.
7. CROSS-REF (whole tree): every `## Related`/inline path-link resolves; flag dangling/removed-existing/weakened.
8. D5 BODY scan: `grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' .gobbi/projects/gobbi/mistakes/ .gobbi/projects/gobbi/reviews/ .gobbi/projects/gobbi/rules/ --include='*.md' | grep -vE '/archive/|README.md'` — survivors legitimate?
9. §4.5 leak gate (0): `find .gobbi/projects/gobbi/mistakes .gobbi/projects/gobbi/reviews .gobbi/projects/gobbi/rules -maxdepth 1 -name '*.md' -not -name 'README.md' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'`
10. Scope: only mistakes/reviews/rules content docs touched; NO README.md; no features/, no sessions/, no archive/.

## Output (write this file, workspace-write)
Write to `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P7b-project-tier-remainder-prose/evaluation/iter1/codex/findings.md`:
```
VERDICT: <PASS|REVISE|FAIL>
## Summary
## Findings  (each: [type] [severity] [confidence] finding + file:line evidence)
## Section-order assessment (does §4.2:178 mandate order?)
## Verification outputs  (paste histogram + D5 + leak gate + git stat)
```
Type vocab: scenario_gap, checklist_gap, design_flaw, assumption_risk, general. Confidence ≥ 75 requires verified evidence. PASS honest if clean; don't invent or rubber-stamp. Active-records content-loss is severity HIGH or CRITICAL.
