# Project Perspective — Task 06 iter1

**Target:** commit `32b9adc` — direct-mode opt-out footnote + smoke-test regex
**Scope:** alignment with plan acceptance criteria + LOCK #5 contract.

## Plan acceptance gates

| Gate (literal command from plan) | Result | Evidence |
|---|---|---|
| `grep -E 'direct.*mode\|workflow.git.mode' .claude/skills/orchestration/SKILL.md` returns ≥1 match co-located with row 5.5 | PASS | Multiple matches: lines 103, 109, 116. Row 5.5 (line 103) explicitly references the LOCK #5 footnote; footnote heading at line 107 names "Row 5.5 — Direct-mode opt-out (LOCK #5)". |
| `grep -E 'chore/session-\[0-9\]\{4\}'` (escaped brackets in plan) returns ≥1 match | PASS | Line 126 contains the literal string `chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}`. |

Both plan-spec gates pass on .claude/ symlink AND canonical path.

## LOCK #5 enforcement

LOCK #5: opt-out footnote home = orchestration/SKILL.md, NOT git/SKILL.md.

- `grep -nE 'opt-out|escape hatch|emergency hotfix|pure-read' .gobbi/projects/gobbi/skills/git/SKILL.md` → 0 matches. CONFIRMED — git/SKILL.md does NOT carry the opt-out footnote. LOCK #5 respected.
- git/SKILL.md only references `direct mode` in the Memory Access Matrix sense (write-root rules for worktreePath null), which is the legitimate cross-cutting concern, not a duplicate opt-out doc.

## Files touched

Only `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` modified — matches plan `files:` exactly. No scope creep.

## Findings

- **P-01** — Type: `general` / Domain: `process` / Disposition: `open` / Confidence: `100` / Severity: `Low`
  - Footnote heading anchors via text ("Row 5.5 — Direct-mode opt-out") not source-adjacency: the footnote sits at line 107, after row 6 (line 104) and row 7 (line 105). A reader scanning the table top-to-bottom hits row 7 before the opt-out footnote.
  - Why it matters: Plan said "co-located". Strict adjacency would place the footnote between rows 5.5 and 6. Current placement is the conventional "post-table footnote" style, and the heading + table-row reference make the linkage unambiguous. Acceptable per common documentation pattern but worth noting.
  - Evidence: orchestration/SKILL.md:103-107 (row 5.5 → row 6 → row 7 → blank → footnote).

## Verdict (project perspective)

**PASS.** Both plan gates pass; LOCK #5 home-of-doc enforced; no scope creep; single-file change consistent with plan.

## Preserve list

- The post-table footnote pattern with explicit "Row 5.5 — ..." anchor.
- The cross-link `git/SKILL.md#core-principles` (anchor exists, see consistency perspective for content depth note).
- The smoke-test command being a runnable `jq` one-liner against `session.json`.
