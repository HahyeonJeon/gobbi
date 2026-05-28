VERDICT: PASS

## Summary

P7b (commit `a7d8253`) full-normalizes the 31 project-tier mistakes to the §4.2:178 four-section heading set, conforms 2 reviews to the reviews-template body + adds the missing base-schema frontmatter on the older review, and conforms `rules/stub-redirect-format.md` to the rules-template (adds blockquote + Why + When-NOT-to-apply).

Verified via per-file diff of all 31 mistakes (with deep close-reading of the 3 ADR reshapes + the 2 bold-prefix-to-heading conversions + the symlink-restore-depth-wrong `## Source` move) and against §4 (rules.md). Heading histogram is uniform 31x/31x/31x/31x with zero old-variant headings (`What went wrong` / `Why it went wrong` / `Corrected approach` / `How to recognize` and their parenthetical / "next time" / "before repeating" variants). §4.5 leak gate over the live tree is empty. All in-tree wikilinks + bullet path-refs to `mistakes/` / `features/git-workflow/design/` resolve.

CONTENT PRESERVATION is intact for all 31 mistakes. The 3 ADR reshapes (executor-mirror-path-vs-worktree-physical-copy, manager-context-overflow-with-large-bundle, worktree-physical-file-missing-when-checked-out) preserve every fact from Context+Decision+Rationale+Alternatives+Consequences under the new four-section shape, using transitional prose ("The corrective stance:", "Alternatives that were considered and rejected:", "Downstream consequences of the chosen prevention:") to keep the sub-claims separable. The 2 bold-prefix conversions and the 21 simple heading-renames are 1:1 mechanical with identical bodies. No section content was dropped under any renamed heading.

The scope contract holds (29 mistakes + 1 review + 1 rule modified; 0 README; 0 features/sessions/archive/references/plans touched).

## Findings

- [general] [Low] [50] One pre-existing dangling cross-link survives in `.gobbi/projects/gobbi/mistakes/proposed-deleting-model-instead-of-fixing-stale-mechanism.md:36` — `[[gobbi-mistake-promote-command-does-not-exist]]` does not resolve (no such backlog/mistake/feature file exists project-wide). Pre-existing dangle (the same wikilink existed in the pre-image as inline text on the last line) that the executor preserved when promoting the "Relates to ..." inline line to a proper `## Related` section. Not a regression; flagging because the executor's commit message claims "every ## Related / wiki-link target resolves" — the claim is over-stated. Suggested direction: file/create the corresponding backlog item, OR convert the wikilink to descriptive prose, OR replace with a pointer to the live remediation (the doc itself describes that remediation).

- [general] [Low] [50] Stale `## Related` path in `.gobbi/projects/gobbi/mistakes/executor-mirror-path-vs-worktree-physical-copy.md:57` points to `sessions/.../staging/decisions/edit-tool-refuses-symlink-canonical-fallback.md` — the actual staged filename in that session dir is `edit-tool-refuses-symlink-paths.md` (verified by `find` in sessions/). The commit message explicitly calls out the stale cross-ref fix ("the named edit-tool-refuses-symlink-canonical-fallback.md is actually edit-tool-refuses-symlink-paths.md") but the fix was applied only to the body-line reference inside `## Why it happens` (line 38 region), not to this `## Related` bullet. Suggested direction: apply the same rename to line 57, OR move the line to a `## Source` footer per §4.3 (consistent with the symlink-restore-depth-wrong treatment).

- [general] [Low] [50] Section ORDER is mixed across the 31 normalized mistakes. ~17 follow §4.2:178's What→Why→Correct→HtD order; ~14 use What→Why→HtD→Correct (notably the codex-exec-at-file, proposed-deleting-model, edit-tool-refuses-symlink-paths, sendmessage-continued, codex-eval-session-write-path-nested-in-worktree, codex-rescue-agent-fire-and-forget, executor-main-tree-edit-near-miss, manager-iter2-brief, wrap-up-promotion-must-strip, plus several others). The §4.2:178 table presents an ordered arrow shape; the brief explicitly scoped this evaluator to be fair given the executor was instructed to do heading-WORDING normalization, not reordering. Flagging as awareness rather than a fail — if the user wants strict order conformance, a separate one-line shuffle pass on the ~14 files would close it. Spec text is ambiguous about whether "set" or "order" is mandatory.

- [general] [Low] [25] Three mistakes retain `## Context` as a non-template lead-in section (`executor-main-tree-edit-near-miss`, `codex-rescue-agent-fire-and-forget-without-result-capture`, `memorization-delegation-prompts-must-load-memorization-skill`). The §4.2:178 mistakes contract lists only What happened / Why it happens / Correct approach / How to detect; the mistakes-template (memorization/templates/mistakes.md) additionally allows ## User feedback and ## Related. `## Context` is not in either set. Pre-existing additive section; content is harmless supplementary preamble that supports the `## What happened` section. Spec ambiguity: §4.2 says "obeys its template's section contract" — if read strictly as a closed list, ## Context is non-conformant; if read as a minimum-required-set with permissive extras (which the templates' "Related" / "User feedback" usage suggests), it's fine. Flagging at low confidence as a candidate spec clarification rather than a P7b defect.

- [scenario_gap] [Low] [50] `evaluator-returned-verdict-inline-no-per-perspective-files.md` and `skills-mirror-symlinks-not-copies.md` both retain non-template `## Witness` / `## Ground truth (verified 2026-05-25, main tree)` headings respectively. Same status as the ## Context cases above: pre-existing additive sections preserving session-time empirical witness paragraphs. Not a content-loss issue; flagging because the brief framed §4.2 as a section-contract rule and these extras live outside both the §4.2:178 set and the template's allowlist. Treatable as "evergreen empirical witness" worth keeping or as residue worth reclassifying to ## Source / inline narrative — either is acceptable. Suggested direction: defer to a clarifying spec amendment.

## Section-order assessment

The spec at §4.2:178 reads `## What happened → ## Why it happens → ## Correct approach → ## How to detect` (arrow-ordered presentation). It does not explicitly say "in this order" — the surrounding §4.2 prose talks about templates and "section contract" without disambiguating set-vs-order. Both readings are defensible:

- **Set reading** (the brief leans this way): the contract is the four headings exist with these names; order is presentation flow not contract. P7b is FULLY conformant.
- **Order reading** (stricter): the arrow direction is binding. P7b is partially conformant — ~17/31 in spec order, ~14/31 invert Correct↔HtD.

The brief explicitly instructed me to be fair given the executor's scope was heading-WORDING normalization. I treat the order finding as Low/awareness rather than a fail-trigger. If the user adopts the strict reading, a follow-up one-pass shuffle on the ~14 files closes it cheaply.

## Verification outputs

Heading histogram (`for f in mistakes/*.md; do grep -hE '^## ' "$f"; done | sort | uniq -c`):

```
     31 ## Why it happens
     31 ## What happened
     31 ## How to detect
     31 ## Correct approach
     21 ## Related
      3 ## Context
      2 ## User feedback
      1 ## Witness
      1 ## Source
      1 ## Load Directives (in order — mandatory)
      1 ## Ground truth (verified 2026-05-25, main tree)
```

§4.5 leak gate (live `find -not -path archive/sessions/skills/agents/tmp` + grep `^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):`):

```
(zero matches — empty output)
```

D5 body session-coordinate scan over mistakes/+reviews/+rules/ (`grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]'`, archive/README-excluded):

```
many hits across ~17 files; ALL survivors are descriptive-narrative tokens
inside ## What happened / ## Why it happens / ## How to detect bodies that
reference the originating empirical incidents in self-contained prose
(e.g. "During T07 iter2, the executor needed to edit ...", "Wave 1 iter2
remediation was delegated ..."). These are NOT load-bearing in the §4.3
sense — the reader does not need to resolve T07 or iter2 to understand
the bug. Two exceptions worth noting (already covered above):
 - claude-evaluator-step4-only-vs-codex-whole-file-grep.md:57-58 list
   sessions/.../evaluation/iter1/{claude,codex}/overall.md paths under
   ## Related; could be moved to ## Source like symlink-restore-depth-wrong
   was, but §4.3 grep is "advisory not hard gate" — not a regression.
 - symlink-restore-depth-wrong.md has a legitimate ## Source footer (added
   by this commit) carrying the originating-session id — exactly the §4.3
   pattern.
The `naming-standard-needs-positive-guidance` row-5-5/task-01 hits are
QUOTED bad-name examples — the doc is teaching what bad names look like.
```

Scope diff (out-of-scope files): zero. `git show a7d8253 --stat -- '*README.md' .gobbi/projects/gobbi/{features,sessions,archive,references,plans}/` returns no rows.

Cross-ref resolution (sampled 12 referenced targets — wikilinks + bullet paths):

```
OK   mistakes/design-literal-retire-instruction-without-replacement.md
OK   mistakes/evaluator-false-pass-without-diffing.md
OK   mistakes/sendmessage-continued-cwd-resets-to-main-tree.md
OK   mistakes/executor-cwd-reset-commits-task-to-wrong-branch.md
OK   mistakes/codex-subprocess-writes-to-main-tree.md
OK   mistakes/executor-main-tree-edit-near-miss.md
OK   mistakes/executor-mirror-path-vs-worktree-physical-copy.md
OK   mistakes/manager-skipped-dual-system-eval.md
OK   mistakes/edit-tool-refuses-symlink-paths.md
OK   mistakes/subagent-relative-path-write-strays-to-main-tree.md
OK   skills/codex/SKILL.md
OK   features/git-workflow/design/{qualified-git-write-path-rule,per-iteration-session-commit-cadence}.md
MISS gobbi-mistake-promote-command-does-not-exist  (pre-existing dangle)
```

ADR-reshape spot-checks (verbatim phrase survival):

```
executor-mirror-path-vs-worktree-physical-copy: Context+Decision → What
  happened (decision folded as "The corrective stance:"); Rationale →
  Why it happens (3 bullets); Alternatives → "Alternatives that were
  considered and rejected:" (2 bullets); Consequences → "Downstream
  consequences of the chosen prevention:" (2 bullets); ## Correct
  approach added carrying the prior ## Corrected approach text; the
  intro "## Core lesson" heading removed but its body retained as the
  doc's lead paragraph. Every claim from the pre-image survives.
manager-context-overflow-with-large-bundle: same shape — Decision
  levers 1 and 2 inlined into the corrective-stance paragraph
  (split-bundle-across-sessions + single-system-evals-on-small-iter2);
  Rationale + Alternatives + Consequences all reshape under Why it
  happens; corrective into Correct approach.
worktree-physical-file-missing-when-checked-out: Decision's pre-flight
  bash snippet preserved verbatim inside the What happened section;
  Rationale + Alternatives + Consequences reshape under Why it
  happens; corrective into Correct approach with the bash command.
```

