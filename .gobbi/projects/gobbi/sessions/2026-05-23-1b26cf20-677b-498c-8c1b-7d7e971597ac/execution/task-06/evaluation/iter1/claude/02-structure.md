# Structure Perspective — Task 06 iter1

**Target:** commit `32b9adc` — structural placement of footnote + smoke-test gate within orchestration/SKILL.md.

## Document layout review

The change adds two paragraph blocks at lines 107-128:
1. `**Row 5.5 — Direct-mode opt-out (LOCK #5)**` — narrative + bullet list (2 conditions) + cross-link paragraph.
2. `**Smoke-test gate (T1.h — verification for post-merge sessions)**` — narrative + fenced jq code block + regex expectation + worktreePath assertion.

The blocks land between the "Configuration" table (rows 1-7 ending at line 105) and the "3-tier bootstrap detection" subtable (line 130+). This is an interstitial footnote location consistent with the existing pattern (the surrounding doc uses bold-prefixed paragraph blocks as inline footnotes elsewhere).

## H-level hierarchy

- No new H2/H3 headings added — both blocks are bold-prefixed paragraphs. Consistent with sibling footnotes in the same skill (e.g., "**3-tier bootstrap detection**" at line 130 also uses bold-prefix).
- No TOC needed update because the skill uses table-of-rows navigation, not TOC.

## Code block fence

- jq command at lines 121-123 uses a triple-backtick fence with no language tag. Sibling code blocks in this skill (e.g., the regex `startup\|resume\|clear\|compact` in row 5.5) use inline code. The unannotated fence renders fine in GitHub-flavored Markdown but loses syntax highlighting. Minor.

## Findings

- **S-01** — Type: `general` / Domain: `docs-sync` / Disposition: `open` / Confidence: `75` / Severity: `Low`
  - Code fence missing language hint (`jq` or `bash`).
  - Why it matters: cosmetic; renderer-dependent highlighting absent. Not a correctness issue.
  - Evidence: orchestration/SKILL.md:121-123.

- **S-02** — Type: `general` / Domain: `docs-sync` / Disposition: `open` / Confidence: `50` / Severity: `Low`
  - The smoke-test gate refers to itself as "T1.h" in the heading. T1.h is a task identifier from the planning/ideation artifacts internal to the session — it carries no meaning for a reader landing on this doc from `develop` after merge.
  - Why it matters: A future reader will not know what T1.h is. Other in-skill references use semantic labels ("LOCK #5"). Consider whether T1.h is meant to survive the merge or be replaced with a semantic anchor (e.g., "Smoke-test gate — branch-name verification").
  - Evidence: orchestration/SKILL.md:119 — `**Smoke-test gate (T1.h — verification for post-merge sessions)**`.

- **S-03** — Type: `general` / Domain: `docs-sync` / Disposition: `open` / Confidence: `75` / Severity: `Low`
  - The footnote heading also leaks the task tracking label `(LOCK #5)`. LOCK #N is session-internal terminology from this Configuration foundations bundle. Same survivability concern as S-02.
  - Why it matters: A reader can guess LOCK refers to a locked design decision, but the convention is undocumented at this skill level.
  - Evidence: orchestration/SKILL.md:107 — `**Row 5.5 — Direct-mode opt-out (LOCK #5)**`.

## Verdict (structure perspective)

**PASS-with-concerns.** Layout is sound and consistent with sibling patterns. Three Low-severity polish concerns (S-01/S-02/S-03) about cosmetic + session-internal label leakage do not justify REVISE.

## Preserve list

- The interstitial-footnote pattern (bold-paragraph blocks between table sections).
- The compact, single-purpose smoke-test gate (one jq command, one regex, one assertion).
