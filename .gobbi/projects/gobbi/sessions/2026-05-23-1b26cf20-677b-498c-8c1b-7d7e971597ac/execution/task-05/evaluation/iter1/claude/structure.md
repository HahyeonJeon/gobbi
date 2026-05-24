# Structure — T05 iter1 (commit 9f5229d)

## Verdict: PASS

## Insertion structure

All 5 inserts conform to the same shape:

```
### Per-iteration session-memory commit cadence

<paragraph 1: when (after MEMORIZATION PASS/REVISE/FAIL), what (commit on worktree branch), what's captured>

<fenced subject line>

<paragraph 2: trailer per git/conventions.md:116-119 + heredoc form lead-in>

<fenced heredoc git commit example>

<paragraph 3: substitution, worktree-first cite, verify trailer landed; some loops add a distinguishing sentence>

**Direct mode opt-out:** <when, what's skipped, where memory still lives, cite to row 5.5 footnote>
```

Anchor placement (verified via grep):

| File | MEMORIZATION H2 line | Insert H3 line | ITER/EXIT H2 line |
|---|---|---|---|
| ideation.md | 90 | 105 | 130 |
| preparation.md | 87 | 96 | 121 |
| planning.md | 86 | 94 | 119 |
| execution.md | 62 | 66 | 91 |
| wrap-up.md | 37 | 41 | 66 |

Every insert sits inside its file's `## MEMORIZATION Phase` H2, immediately before `## ITER / EXIT Decision`. Heading level (H3) is consistent across all 5 files.

## Markdown well-formedness

- Heading levels uniform (`### Per-iteration session-memory commit cadence` at H3 in all 5).
- Fenced code blocks balanced; heredoc EOF closure correct in all 5 inserts.
- Inline-code spans on `$worktreePath`, `{session-id}`, `{task-id}`, `{n}`, `git.worktreePath`, `settings.git.workflow.mode` consistent.
- Cross-reference link styles match surrounding doc — uses backtick-quoted paths (e.g., `` `orchestration/SKILL.md § Configuration Step 1` ``), no relative markdown links, matching the style of the adjacent MEMORIZATION sections.
- Bold callout `**Direct mode opt-out:**` formatted uniformly in all 5.

## Section scope

Each insert is self-contained inside its file's MEMORIZATION H2 — no orphan content that would break the existing ITER/EXIT scaffolding. Both anchors (MEMORIZATION + ITER/EXIT) exist in all 5 files post-edit and are correctly ordered.

## Findings

None at Structure perspective.

## Preserve

- H3-under-H2 placement keeps the cadence rule as a sub-rule of MEMORIZATION (correct ownership; it's a MEMORIZATION-exit contract).
- Uniform template across 5 files makes future edits trivial.

## Verdict: PASS
