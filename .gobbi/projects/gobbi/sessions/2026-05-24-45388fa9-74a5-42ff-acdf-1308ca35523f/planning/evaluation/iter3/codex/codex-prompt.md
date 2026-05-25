# Planning iter3 EVAL — Codex Adversarial Review

## Context

You are the Codex leg of a dual-system Planning evaluation. Your purpose is to independently verify claimed fixes to 2 High findings from iter2 and to run a fresh adversarial pass for any NEW Critical/High issues introduced in iter3.

**Plan under review** (iter3 FINAL):
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/planning/rawdata/draft-iter3.md`

**Session ID**: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
**Worktree root**: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9`
**Output dir (ALL files go here)**: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/planning/evaluation/iter3/codex/`

**IMPORTANT**: Write ALL output files to the absolute path above. Do NOT use relative paths. Do NOT write to `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/...` (that is the main tree path — wrong). The worktree path includes the segment `worktrees/chore/session-2026-05-24-45388fa9/` — that is the correct output location.

---

## iter2 High findings iter3 claims to fix

**Codex-H1** (design_flaw/test, Confidence 100):
iter2 found literal `<worktreePath>` macro embedded inside executable `test -f` (T02 SC-8.3) and `jq` (T04 SC-2.3.b) verify commands. The macro does not substitute at runtime, so the literal command fails even though the real files exist.

**iter3 claimed fix**: removed `<worktreePath>/` prefix from both commands; replaced with worktree-relative paths. Also added `§ Path-macro discipline` section documenting this rule.

**Codex-H2** (checklist_gap/consistency, Confidence 75):
iter2 found T06 SC-5 spot-check extracted its reference string (REF1/REF2) from `wrap-up/SKILL.md` — one of the 10 files T06 itself edits. Pre-edit, that file holds the OLD `$CLAUDE_CODE_SESSION_ID` wording (extraction returns empty/stale); the check would only prove internal consistency, not correctness against the locked M2 source.

**iter3 claimed fix**: replaced the self-referential extraction with hardcoded locked-M2-clause grep sourced from idea.md DL-5. The 3 locked clauses are:
- CLAUSE-1: "from the delegation prompt's `session-id:` field"
- CLAUSE-2: "do NOT read `$CLAUDE_CODE_SESSION_ID` for this value"
- CLAUSE-3: "subagent's own UUID, not the parent session's"

---

## Your verification tasks

### Task 1: Verify H1 fix — no `<worktreePath>`/`<sessionDir>` macros in executable positions

Read the iter3 plan file. Grep for literal `<worktreePath>` and `<sessionDir>` strings. Classify each occurrence:
- Executable position (inside a `verifies:` command, a `test -f`, `jq`, `grep -c`, `awk`, or any shell command that would run at verification time) — these should be ZERO after the fix
- Non-executable position (prose, headers, `why:` blocks, `memory-reads register`, `§ Path-macro discipline` section, comments) — these are allowed

Expected: Zero occurrences in executable positions.

Then run T02 SC-8.3 from the worktree root:
```
cd /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9
test -f .gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/staging/decisions/session-dir-placed-outside-worktree.md && echo "SC-8.3 PASS" || echo "SC-8.3 FAIL"
```

Then run T04 SC-2.3.b from the worktree root:
```
cd /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9
len=$(jq '.agents | length' .gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/session.json 2>/dev/null)
echo "SC-2.3.b agents length: $len"
test "$len" -ge 1 && echo "SC-2.3.b PASS" || echo "SC-2.3.b FAIL"
```

Report: H1 fixed or still broken, with evidence.

### Task 2: Verify H2 fix — T06 SC-5 spot-check hardcoded vs self-referential

Read T06's second `verifies` entry (the SC-5 locked-M2-wording spot-check) in the iter3 plan. Confirm:
1. It does NOT extract reference strings from `wrap-up/SKILL.md` or any other sweep target.
2. It DOES contain the 3 hardcoded clause patterns targeting idea.md DL-5 semantics.

Then verify the CURRENT (pre-execution, un-swept) baseline behavior — run the spot-check against the actual current skill files from the worktree root. Expected: `matches=0` (< 7 threshold) because the files haven't been swept yet. This proves the check is a real gate.

Run the spot-check script from the plan (the second SC-5 verifies entry, lines 710-733) verbatim from the worktree root. Report the matches count.

Also verify the check would FAIL the pre-edit files (matches < 7), proving it's not a tautology.

Report: H2 fixed or still broken, with evidence.

### Task 3: Confirm 3 prior fixes preserved

Read the iter3 plan. Verify the following 3 fixes from iter1+iter2 are still present:

**Fix A (iter2 H1 — awk H3)**: In T03 SC-3.2, T04 SC-2.2, and BOTH T06 SC-5 entries, the awk start pattern must include `^### Path conventions|^### Path Conventions` in addition to the bold and H2 variants. Look for the exact awk pattern string.

**Fix B (iter2 — CL-5=10 files)**: T06's file lists (both `set --` arrays in SC-5 and SC-5-spotcheck) must have exactly 10 files. Count them. gobbi/SKILL.md must NOT be present in these lists.

**Fix C (iter1 H2 — portable set-- loop)**: T06 SC-5 must use `set --` + `for F in "$@"` pattern, not an array variable like `FILES=(...)` that is zsh-unsafe. Confirm the loop pattern in both SC-5 entries.

Report: each fix preserved or broken.

### Task 4: Fresh adversarial pass — any NEW Critical/High in iter3?

Examine what iter3 CHANGED vs iter2. Focus specifically on:

1. **The new worktree-relative paths in T02 SC-8.3 and T04 SC-2.3.b** — are they correct paths? Do they resolve from the worktree root? Do they contain the correct session-id (2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f)?

2. **The hardcoded M2 clause regex patterns in T06 SC-5 spot-check** (lines 726-728 of plan):
   - `grep -qE "delegation prompt.?s? .session-id:. (header )?field"` — is this regex precise enough? Does it correctly match the canonical M2 wording while rejecting non-canonical wordings?
   - `grep -qE "[Dd]o NOT read .*CLAUDE_CODE_SESSION_ID.* for this value"` — is the `.*` between "read" and "CLAUDE_CODE_SESSION_ID" intentional (to tolerate backtick + $ punctuation)?
   - `grep -qE "subagent.?s? own UUID, not the parent session"` — does this match the locked clause?

3. **The threshold `>= 7 of 10`** — is this the right gate? Consider: if 3 files are allowed sentence-flow polish (the iter1 intent), what happens if 4 or more files have wrong wording? Does this threshold correctly reject that scenario?

4. **SC-3.2 in T03** — the awk terminator `^### [^P]` would stop the awk range if it hits a line like `### Procedures` or `### Constraints`. Are those H3 headers present in `mistake/SKILL.md` after the Path conventions block? If there's no such H3 after the block, the awk range would run to EOF — is that a problem?

5. **Any other NEW issues** introduced by iter3 edits that weren't present in iter2.

Report each finding with: ID / Type / Severity (Critical/High/Medium/Low) / Confidence (0/25/50/75/100) / Evidence / Why it matters / Suggested direction.

---

## Output files

Write exactly 3 files to the output directory `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/planning/evaluation/iter3/codex/`:

### overall.md
```
---
evaluator: codex
model: <resolved from your config>
iter: 3
verbatim: true
phase: planning-eval
perspective: overall
---

# Planning iter3 EVAL — Codex Overall

## H1 fix verification (worktree-relative paths)
[findings and evidence]

## H2 fix verification (hardcoded M2 clauses)
[findings and evidence]

## Prior fixes preserved
[findings and evidence for fixes A, B, C]

## Fresh adversarial findings
[any NEW Critical/High/Medium found]

## Summary
[finding count by severity]

VERDICT: <PASS|REVISE|FAIL>
```

### p2-consistency.md
```
---
evaluator: codex
model: <resolved>
iter: 3
verbatim: true
phase: planning-eval
perspective: p2-consistency
---

# Planning iter3 EVAL — Codex Consistency Perspective

## Findings
[consistency-framing of H1 fix, H2 fix, and any new findings]

VERDICT: <PASS|REVISE|FAIL>
```

### p4-specificity.md
```
---
evaluator: codex
model: <resolved>
iter: 3
verbatim: true
phase: planning-eval
perspective: p4-specificity
---

# Planning iter3 EVAL — Codex Specificity Perspective

## Findings
[specificity-framing of H1 fix, H2 fix, and any new findings]

VERDICT: <PASS|REVISE|FAIL>
```

---

## Verdict rules

- Any finding Severity Critical, Confidence >= 75 → FAIL
- Any finding Severity High, Confidence >= 50 → REVISE
- Otherwise → PASS

---

## IMPORTANT path discipline

ALL output files MUST go to:
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/planning/evaluation/iter3/codex/`

Verify each file exists at that absolute path after writing. If a file write fails, report BLOCKED with the error.
