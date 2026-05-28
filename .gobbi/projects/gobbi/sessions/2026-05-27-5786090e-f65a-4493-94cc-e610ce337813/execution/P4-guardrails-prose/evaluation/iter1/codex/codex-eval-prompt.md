# Codex evaluator — P4 prose wave (features/guardrails, 10 docs)

Independent adversarial evaluator, dual-system gobbi eval. A Claude executor reshaped docs under `features/guardrails/` to the §4 standard (commit `d24c61c`, 9 files changed; 1 backlog was already conformant and untouched). Find what is wrong. DO NOT trust the executor summary — diff the commit and read the files.

## Spec (§4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`)
- §4.2 per-type COMPLETE section contract vs template `.gobbi/projects/gobbi/skills/memorization/templates/{type}.md` (references→body `## Related` between Insight and Why-it-applies; backlogs→Context/Why deferred/When to pick up/Suggested approach/Originating session; changelogs→`**Task:**`+Summary/What changed/Verification/Deferred/Related; discussions→Context/Question/Options considered/User decision/Implication/Related; checklists→template shape; README→Overview/Status/Subdirectories/Recent activity/Open items/Related).
- §4.3 self-contained prose: no LOAD-BEARING session coords in BODY (frontmatter `tags:` tokens are NOT body). Narrative reclassified to PROJECT-level notes only.
- §4.4 KEEP keys never stripped.

## Procedure (evidence-based — mandatory)
1. `cd` to worktree `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6`; `git show d24c61c --stat`; `git show d24c61c -- <each file>`.
2. CONTENT PRESERVATION (highest priority — a prior evaluator false-PASSed without diffing; another prose task weakened a precise pointer): confirm no fact/bullet/table/precise-path was deleted or weakened without relocation. Grep key facts in post-images. The executor claims it repaired 3 stale/broken cross-refs and preserved precise paths — VERIFY each.
3. §4.2 COMPLETE contract per doc against its template.
4. CROSS-REF RESOLUTION: every `## Related`/inline doc link must point to an EXISTING file (`ls`). Flag dangling links. The executor changed a broken companion-ref in `references/claude-code-posttooluse-hook-schema.md` to prose (claimed the target file doesn't exist) — verify the target truly doesn't exist.
5. D5 BODY scan: `grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' .gobbi/projects/gobbi/features/guardrails/ --include='*.md' | grep -vE '/archive/'` — survivors legitimate (literal existing-file paths / tags-line)?
6. §4.5 leak gate (0): `find .gobbi/projects/gobbi/features/guardrails -name '*.md' -not -path '*/archive/*' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'`
7. Scope: only features/guardrails touched; no archive, no other feature.

## Output (write this file, workspace-write)
Write to `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P4-guardrails-prose/evaluation/iter1/codex/findings.md`:
```
VERDICT: <PASS|REVISE|FAIL>
## Summary
## Findings  (each: [type] [severity] [confidence] finding + file:line evidence)
## Cross-ref resolution check
## Verification outputs  (paste D5 + leak gate + git stat)
```
Type vocab: scenario_gap, checklist_gap, design_flaw, assumption_risk, general. Confidence ≥ 75 requires verified evidence. PASS honest if clean; don't invent or rubber-stamp.
