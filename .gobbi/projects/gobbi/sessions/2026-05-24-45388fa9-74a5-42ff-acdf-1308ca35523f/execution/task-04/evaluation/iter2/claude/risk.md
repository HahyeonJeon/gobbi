# Risk Evaluation — T04 iter2 (commit 5d2a7c6), gobbi-hook-authoring SKILL.md

Perspective: risk (regression + new-defect + must-preserve). The iter2 mistake
`leader-iter2-verification-claim-without-evidence.md` warns: do NOT substitute one wrong
form for another and claim a fix without verbatim source verification. Every claim below was
re-checked verbatim against the authoritative file, not the author's changelog.

## Regression check — no NEW defect introduced

PASS. Confidence: 100.
- Scope: `git diff --name-only 5d2a7c6~1 5d2a7c6` = exactly 2 files (staged + promoted twin SKILL.md). No collateral edits. Matches the contract.
- Diff is +46/-12 across the 2 files (review-sized). All four hunks map to the four findings; no unrelated content touched.
- The regression-pattern trap from the mistake file (wrong→different-wrong substitution) does NOT apply here: each replacement value was confirmed present verbatim in the authoritative source —
  - `"type": "command"` + bare path: present in settings.json:36,44,52.
  - top-level `source`: present in session-start.sh:55 (`\(.source)`), distinct from line 54 `\(.hook_event_name)`.
  - three exit-1 conditions: present at session-start.sh:32-40, 46, and via set -euo pipefail line 27.
  This is the corrected approach the mistake file prescribes (grep the new value against the cited source).

## Must-preserve check

PASS. Confidence: 100.
- M2 — no `{session-id}` path-convention row citing `$CLAUDE_CODE_SESSION_ID`: grep finds CCSI only at SKILL.md:113 (a literal `jq` export line from the real script) and SKILL.md:131 (an explicit note that this is hook-mechanics and "do not confuse it with the delegation-prompt `session-id:` field used for file-path construction"). Both are factual hook-mechanics mentions — explicitly allowed by M2. No path-convention table row. `grep '{session-id}'` → NONE.
- Twins byte-identical: md5 match (see consistency.md).
- Witness-grounded sections intact: jq @sh (SKILL.md:37-39,113), flock (41-43,133-176,230), agents[] upsert (P4 133-177), two-tier extraction (P5 179-193), P6 resolver (195-202) — all present and unmodified by this commit (diff touched only lines 31, 54-83, 205-218).
- ≥4 canonical H2s: `grep -cE '^## (Core Principles|Procedures|Constraints|Output paths)'` = 4. Full H2 set (6) intact: When to load, Core Principles, Procedures, Constraints, Anti-patterns, Output paths.

## New-defect sweep
None found. The new JSON example (SessionStart block) and the two smoke-test payloads were checked for field fidelity against the real scripts and settings.json — all accurate.

VERDICT (risk): PASS — no regression, no new defect, all must-preserve invariants intact.
