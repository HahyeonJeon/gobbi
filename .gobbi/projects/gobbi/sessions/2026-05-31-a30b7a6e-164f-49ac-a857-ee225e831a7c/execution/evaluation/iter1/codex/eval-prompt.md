You are the independent Codex-system evaluator in a dual-system review. Review a committed documentation change in this repo. Do NOT modify any file except writing your single findings file. Findings only — do not propose or apply fixes.

## The change under review (two commits on the current branch HEAD, vs develop)
- `eb09158` — merged each of the 14 principles' descriptive name and its Iron Law into ONE heading line of the form `## Principle N — <Name>: <IRON LAW>`, removed the 14 standalone `**Iron Law:**` lines from `.gobbi/projects/gobbi/skills/principles/SKILL.md`, and rewrote both summary tables (`.claude/CLAUDE.md` and `.codex/AGENTS.md`) so the header column is `| # | Principle |` and each row is `| N | <Name>: <LAW> |`.
- `3c45c47` — renamed three prose references from "Iron Law table"/"Iron Law summary" to "principle table"/"principle summary": `.claude/CLAUDE.md` intro, `.codex/AGENTS.md` intro, and `.gobbi/projects/gobbi/skills/principles/SKILL.md` closing paragraph.

## Deliberately OUT OF SCOPE (do NOT report these as defects)
- Principle 13's body still references "the CLAUDE.md Iron Law table" (two places in SKILL.md). This was deliberately left out of the locked 3-reference prose-rename scope; the table still lists the iron laws, so the reference is not false. Do not flag it.
- The intro count already reads "Fourteen principles" (shipped earlier in #275); no count change was in this branch. Confirm it is "Fourteen" but do not expect a diff for it.
- `plugins/gobbi/skills/principles/SKILL.md` (if present) is a one-time #274 snapshot already drifting independently; it is outside this change's scope. You may note it as a pre-existing follow-up but not as a blocker for this branch.

## Your task — verify the final state. Read the actual files (use `git show develop:<path>` for the baseline).
1. Consistency — for all 14 principles, the SKILL.md heading payload after `## Principle N — ` must be character-identical to the matching row cell in BOTH `.claude/CLAUDE.md` and `.codex/AGENTS.md`. Extract all three and diff them yourself. Confirm the two tables are identical to each other. Confirm `grep -c "^\*\*Iron Law:\*\*" SKILL.md` == 0. Confirm the 3 prose renames landed (no "Iron Law table is the always-visible" / "Iron Law summary in CLAUDE" remain; "principle table"/"principle summary" present). Confirm intro says "Fourteen principles".
2. Structure — each merged heading is a single `## Principle N — …: ….` line followed by one blank line then `**Why:**`; 14 headings in order 1..14; both tables have the renamed header, intact separator row, exactly 14 data rows; valid markdown.
3. Risk — whole-tree grep across LIVE docs (`.claude`, `.codex`, `.agents`, `skills/`, `agents/`, `rules/`; exclude `sessions/`/`archive/`/`worktrees/`) for: broken markdown anchor links `#principle-N-...` (headings changed so anchors changed — are there any inbound anchor links that would now 404?), any other live doc that called these tables "the Iron Law table" by that name and is now stale, or any heading where name and law concatenated without the `: ` separator or a table row that lost its law. Confirm no regression.

Run real greps; do not trust any claim. Diff the heading payloads against both tables — that is the core check.

## Output
Write your findings to this exact relative path (you are anchored at the repo root via --cd):
`.gobbi/projects/gobbi/sessions/2026-05-31-a30b7a6e-164f-49ac-a857-ee225e831a7c/execution/evaluation/iter1/codex/findings.md`

Format: per perspective give a verdict (PASS / REVISE / FAIL) with exact file:line evidence for any finding. End with a single line `AGGREGATE: PASS` or `AGGREGATE: REVISE` or `AGGREGATE: FAIL`. If genuinely clean, PASS is correct — be adversarial and concrete.
