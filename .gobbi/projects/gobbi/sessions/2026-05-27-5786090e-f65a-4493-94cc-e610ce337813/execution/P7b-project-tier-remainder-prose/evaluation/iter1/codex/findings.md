VERDICT: REVISE

## Summary

Commit `a7d8253` did the mechanical old-heading rename work and I did not find broad content deletion across the high-risk reshapes. However, the result is not PASS-clean. One high-risk ADR reshape weakened a source witness by removing the only correct prior-session coordinate from the body while leaving a stale placeholder Related path. More broadly, 26 of 31 active mistakes still violate the exact `mistakes` section order mandated by `memorization/rules.md` line 178, five active mistakes retain non-contract H2 sections, and Related/cross-reference checks still have unresolved targets.

## Findings

- [general] [HIGH] [100] `manager-context-overflow-with-large-bundle.md` lost the correct prior-session witness during the ADR reshape. Pre-image line 19 named `Prior session 2026-05-23-7ea62d36`; the post-image now says only "A prior session" at `.gobbi/projects/gobbi/mistakes/manager-context-overflow-with-large-bundle.md:20`, and the remaining Related pointer is a non-resolving placeholder with the wrong date at `.gobbi/projects/gobbi/mistakes/manager-context-overflow-with-large-bundle.md:50`. `find .gobbi/projects/gobbi/sessions -maxdepth 1 -type d -name '*7ea62d36*'` resolves the real session as `.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068`. This is a content-preservation/source degradation in one of the three highest-risk reshapes.

- [checklist_gap] [HIGH] [100] The active mistakes mostly do not obey the exact section order in the §4.2 contract. The standard says `## What happened -> ## Why it happens -> ## Correct approach -> ## How to detect` at `.gobbi/projects/gobbi/skills/memorization/rules.md:178`, but 26 of 31 files are ordered `What happened -> Why it happens -> How to detect -> Correct approach`. Example: `.gobbi/projects/gobbi/mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md:32` has `## How to detect` before `.gobbi/projects/gobbi/mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md:40` `## Correct approach`. The arrowed §4.2 table is an ordered contract, not only a set of allowed headings.

- [checklist_gap] [MEDIUM] [95] Five active mistake records still carry non-contract actual H2 sections after the "full-normalize" pass. Ignoring fenced code blocks, the non-contract sections are `## Context` at `.gobbi/projects/gobbi/mistakes/codex-rescue-agent-fire-and-forget-without-result-capture.md:19`, `.gobbi/projects/gobbi/mistakes/executor-main-tree-edit-near-miss.md:19`, and `.gobbi/projects/gobbi/mistakes/memorization-delegation-prompts-must-load-memorization-skill.md:19`; `## Ground truth...` at `.gobbi/projects/gobbi/mistakes/skills-mirror-symlinks-not-copies.md:23`; and `## Witness` at `.gobbi/projects/gobbi/mistakes/evaluator-returned-verdict-inline-no-per-perspective-files.md:48`. The user-ratified heading set allowed the four mistake sections plus Related, optional User feedback, and legitimate Source footer; these sections should be folded under the contract sections or demoted.

- [general] [MEDIUM] [95] Cross-reference verification is still failing in touched live docs. `.gobbi/projects/gobbi/mistakes/executor-mirror-path-vs-worktree-physical-copy.md:57` points to non-existent `sessions/.../edit-tool-refuses-symlink-canonical-fallback.md`; the existing staging file is `edit-tool-refuses-symlink-paths.md`. `.gobbi/projects/gobbi/mistakes/manager-context-overflow-with-large-bundle.md:50` contains unresolved placeholder path `sessions/2026-05-22-7ea62d36-.../HANDOFF.md`. `.gobbi/projects/gobbi/mistakes/proposed-deleting-model-instead-of-fixing-stale-mechanism.md:36` wiki-links `[[gobbi-mistake-promote-command-does-not-exist]]`, but the actual file is date-prefixed under `archive/backlogs/`. `.gobbi/projects/gobbi/rules/stub-redirect-format.md:102` references `_claude/SKILL.md`, which does not exist in this worktree.

## Section-order assessment

§4.2:178 mandates order. The table uses explicit arrows for each type contract, and the task brief repeated the mistake contract in arrow order: `What happened -> Why it happens -> Correct approach -> How to detect`. That makes the order part of the conformance bar, not merely a wording set. The brief also said "full-normalize all 31 mistakes to this heading set"; leaving 26 files with `How to detect` before `Correct approach` is therefore a real REVISE finding even if the original executor scope may have emphasized wording over reordering.

## Verification outputs

### Mistake heading histogram

Command:

```bash
for f in $(find .gobbi/projects/gobbi/mistakes -maxdepth 1 -name '*.md' -not -name 'README.md'); do grep -hE '^## ' "$f"; done | sort | uniq -c
```

Output:

```text
      3 ## Context
     31 ## Correct approach
      1 ## Ground truth (verified 2026-05-25, main tree)
     31 ## How to detect
      1 ## Load Directives (in order — mandatory)
     21 ## Related
      1 ## Source
      2 ## User feedback
     31 ## What happened
     31 ## Why it happens
      1 ## Witness
```

Note: `## Load Directives...` is inside a fenced code block, so I did not count it as an actual document section finding. The actual non-contract H2s ignoring fenced code are `Context`, `Ground truth`, and `Witness`.

### Mistake section order

Command:

```bash
awk '
FNR==1 { if (file) { print file ":" order } file=FILENAME; order="" }
/^## / { h=$0; sub(/^## /,"",h); if (h ~ /^(What happened|Why it happens|Correct approach|How to detect)$/) { order = order (order?" -> ":"") h } }
END { if (file) print file ":" order }' $(find .gobbi/projects/gobbi/mistakes -maxdepth 1 -name '*.md' -not -name 'README.md' | sort)
```

Output:

```text
.gobbi/projects/gobbi/mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/codex-exec-at-file-hangs-on-stdin-in-background.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/codex-rescue-agent-fire-and-forget-without-result-capture.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/codex-subprocess-writes-to-main-tree.md:What happened -> Why it happens -> Correct approach -> How to detect
.gobbi/projects/gobbi/mistakes/codex-wrapper-relative-path-wrong-session-write.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/conformance-executor-pre-executed-prose-wave-reshape.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/design-literal-retire-instruction-without-replacement.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/edit-tool-refuses-symlink-paths.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/evaluator-false-pass-without-diffing.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/evaluator-returned-verdict-inline-no-per-perspective-files.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/executor-cwd-reset-commits-task-to-wrong-branch.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/executor-main-tree-edit-near-miss.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/executor-mirror-path-vs-worktree-physical-copy.md:What happened -> Why it happens -> Correct approach -> How to detect
.gobbi/projects/gobbi/mistakes/handoff-verdict-claim-not-matched-to-on-disk-eval.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/leader-iter2-verification-claim-without-evidence.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/manager-context-overflow-with-large-bundle.md:What happened -> Why it happens -> Correct approach -> How to detect
.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/manager-rm-rf-without-investigating-tracked-files.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/manager-skipped-dual-system-eval.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/memorization-delegation-prompts-must-load-memorization-skill.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/naming-standard-needs-positive-guidance-not-just-blocklist.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/proposed-deleting-model-instead-of-fixing-stale-mechanism.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/reproducing-a-bugged-command-is-not-validation.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/sendmessage-continued-cwd-resets-to-main-tree.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/session-dir-placed-outside-worktree.md:What happened -> Why it happens -> Correct approach -> How to detect
.gobbi/projects/gobbi/mistakes/skills-mirror-symlinks-not-copies.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/subagent-relative-path-write-strays-to-main-tree.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/symlink-restore-depth-wrong.md:What happened -> Why it happens -> How to detect -> Correct approach
.gobbi/projects/gobbi/mistakes/worktree-physical-file-missing-when-checked-out.md:What happened -> Why it happens -> Correct approach -> How to detect
.gobbi/projects/gobbi/mistakes/wrap-up-promotion-must-strip-staging-frontmatter.md:What happened -> Why it happens -> How to detect -> Correct approach
```

Summary: 26 noncanonical, 5 canonical.

### Old-heading scan

Command:

```bash
grep -RniE '^## (What went wrong|Why it went wrong|Corrected approach|How to recognize|How to recognize next time|How to detect before repeating)|^\*\*(What went wrong|Why it went wrong|Corrected approach|How to recognize|How to recognize next time|How to detect before repeating)' .gobbi/projects/gobbi/mistakes --include='*.md' | grep -v '/README.md' || true
```

Output: clean, no matches.

### D5 body scan

Command:

```bash
grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' .gobbi/projects/gobbi/mistakes/ .gobbi/projects/gobbi/reviews/ .gobbi/projects/gobbi/rules/ --include='*.md' | grep -vE '/archive/|README.md'
```

Output was non-empty. Most survivors are legitimate witness/context examples for mistake records and review records. The problematic source/cross-ref survivors are captured in findings above, especially `manager-context-overflow-with-large-bundle.md:50` and unresolved Related targets.

### Leak gate

Command:

```bash
find .gobbi/projects/gobbi/mistakes .gobbi/projects/gobbi/reviews .gobbi/projects/gobbi/rules -maxdepth 1 -name '*.md' -not -name 'README.md' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):' || true
```

Output: clean, no files.

### Cross-reference check

Related-section unresolved targets found:

```text
.gobbi/projects/gobbi/mistakes/executor-mirror-path-vs-worktree-physical-copy.md:57: missing: sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/execution/task-01/staging/decisions/edit-tool-refuses-symlink-canonical-fallback.md
.gobbi/projects/gobbi/mistakes/manager-context-overflow-with-large-bundle.md:50: unresolved-or-placeholder: sessions/2026-05-22-7ea62d36-.../HANDOFF.md
.gobbi/projects/gobbi/mistakes/proposed-deleting-model-instead-of-fixing-stale-mechanism.md:36: missing: gobbi-mistake-promote-command-does-not-exist
.gobbi/projects/gobbi/rules/stub-redirect-format.md:102: missing: _claude/SKILL.md
```

Control checks:

```text
find .gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac -name '*edit-tool*'
-> .gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/execution/task-01/staging/decisions/edit-tool-refuses-symlink-paths.md

find .gobbi/projects/gobbi -name '*gobbi-mistake-promote-command-does-not-exist*'
-> .gobbi/projects/gobbi/archive/backlogs/2026-05-25-gobbi-mistake-promote-command-does-not-exist.md

find .gobbi/projects/gobbi/sessions -maxdepth 1 -type d -name '*7ea62d36*'
-> .gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
```

### Scope and git stat

Command:

```bash
git show --stat --oneline --no-renames a7d8253
```

Output:

```text
a7d8253 docs(prose): P7b — project-tier mistakes+reviews+rule §4.2 contracts + self-contained prose
 ...valuator-step4-only-vs-codex-whole-file-grep.md |  8 ++---
 ...x-eval-session-write-path-nested-in-worktree.md |  8 ++---
 ...ex-exec-at-file-hangs-on-stdin-in-background.md | 16 ++++++---
 ...agent-fire-and-forget-without-result-capture.md |  8 ++---
 ...ex-wrapper-relative-path-wrong-session-write.md |  8 ++---
 ...nce-executor-pre-executed-prose-wave-reshape.md |  8 ++---
 ...teral-retire-instruction-without-replacement.md |  8 ++---
 .../mistakes/edit-tool-refuses-symlink-paths.md    |  8 ++---
 .../evaluator-false-pass-without-diffing.md        |  8 ++---
 ...rned-verdict-inline-no-per-perspective-files.md |  8 ++---
 ...cutor-cwd-reset-commits-task-to-wrong-branch.md |  8 ++---
 .../mistakes/executor-main-tree-edit-near-miss.md  | 15 ++++-----
 ...ecutor-mirror-path-vs-worktree-physical-copy.md | 34 +++++++++----------
 ...ff-verdict-claim-not-matched-to-on-disk-eval.md |  8 ++---
 ...er-iter2-verification-claim-without-evidence.md |  8 ++---
 .../manager-context-overflow-with-large-bundle.md  | 39 ++++++++++++----------
 ...rief-failed-iron-law-7-verbatim-spec-recheck.md |  8 ++---
 ...er-rm-rf-without-investigating-tracked-files.md |  8 ++---
 .../mistakes/manager-skipped-dual-system-eval.md   |  8 ++---
 ...egation-prompts-must-load-memorization-skill.md |  8 ++---
 ...d-needs-positive-guidance-not-just-blocklist.md | 12 ++++---
 ...ting-model-instead-of-fixing-stale-mechanism.md | 20 ++++++++---
 ...producing-a-bugged-command-is-not-validation.md |  8 ++---
 ...endmessage-continued-cwd-resets-to-main-tree.md |  8 ++---
 .../mistakes/skills-mirror-symlinks-not-copies.md  |  8 ++---
 ...gent-relative-path-write-strays-to-main-tree.md |  8 ++---
 .../gobbi/mistakes/symlink-restore-depth-wrong.md  | 16 +++++----
 ...ktree-physical-file-missing-when-checked-out.md | 35 +++++++++++--------
 ...-up-promotion-must-strip-staging-frontmatter.md |  8 ++---
 ...-05-26-dual-system-planning-eval-iter1-iter2.md | 12 +++++--
 .../projects/gobbi/rules/stub-redirect-format.md   | 14 +++++++-
 31 files changed, 213 insertions(+), 168 deletions(-)
```

Scope count from changed-file list:

```text
total=31 mistakes=29 reviews=1 rules=1 readme=0 features=0 sessions=0 archive=0
```

This matches the actual commit scope. The task-level "31 mistakes + 2 reviews + 1 rule" framing includes two active mistakes and one review that were already present on disk but not changed by this commit.
