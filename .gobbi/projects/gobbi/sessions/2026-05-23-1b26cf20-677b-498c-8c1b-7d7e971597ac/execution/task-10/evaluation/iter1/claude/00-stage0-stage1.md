# Stage 0 — Target Understanding & Stage 1 — Frame Build

## Stage 0

**Target:** commit `ecfed11` (T10 iter1) on `chore/268-session-foundations-bundle-b`.

**What:** Three coordinated doc edits.
- (a) `skills/orchestration/SKILL.md` row 6 (~L104): replaces "manager hand-appends specialists" with hook+reconstructor narrative; cross-links to T07 hook and T08 reconstructor; cites matcher `Task|Agent` and the structured headers as the metadata source.
- (a-bis) Workflow-Metadata `agents` update points row (L415): updates the same narrative in the metadata table.
- (b) `skills/delegation/SKILL.md` new `## Hook Integration` + `### Structured-Header Convention` table (4 rows: phase / iteration / sub-step / step).
- (c) `### Serialization safety — flock -x on session.json` paragraph at the end of the same section.

**Why:** post-T07/T08/T09, the docs were stale — they described manager-driven append while reality is a hook-driven upsert. T10 closes the docs-vs-code drift.

**How:** Pure markdown edits, 2 files, +25/-2 LoC.

## Stage 1 — Frame (per perspective)

For each perspective the scenarios are anchored to "the doc as a reader's contract" — does the reader who has not read T07/T08/T09 source emerge with a correct mental model?

- **Project**: Contract = Plan T10 verifies + ideation D-3-* anchors. Scenarios: plan verifies pass; row 6 cites Task|Agent matcher; delegation cites the four header names; flock noted.
- **Structure**: Section ordering, header levels, link integrity, table shape.
- **Performance**: N/A for a docs-only edit beyond "does the row 6 sentence stay legible at this length".
- **Aesthetics**: Sentence length, table column count consistency, code-fence vs inline-code usage.
- **Usage**: Can a fresh reader build a correct mental model of the hook+reconstructor flow and write a hand-rolled delegation prompt with the right headers from this doc alone? Are template references accurate?
- **Consistency**: Does the documented regex match the regex T07 actually applies? Does the field list (`finishedAt/tokensUsed/endStatus`) match what the hook actually writes? Does the matcher mentioned match `.claude/settings.json`?
- **Risk**: Does the flock paragraph correctly state the safety property? Are failure modes (omitted headers, missing hook event, locked file) correctly named?

Mistake-skill load: `claude-evaluator-step4-only-vs-codex-whole-file-grep.md` (must whole-file grep, not just the edited rows) and `evaluator-returned-verdict-inline-no-per-perspective-files.md` (one file per perspective; verdict in 07).
