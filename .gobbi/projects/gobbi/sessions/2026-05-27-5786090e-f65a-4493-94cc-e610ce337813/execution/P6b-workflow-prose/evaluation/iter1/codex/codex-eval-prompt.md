# Codex evaluator — P6b prose wave (features/workflow, 26 docs)

Independent adversarial evaluator, dual-system gobbi eval. A Claude executor reshaped 26 docs under `features/workflow/` to §4 (commit `fddc040`; 1 already-conformant doc untouched). Find what is wrong. DO NOT trust the executor summary — diff the commit and read the files.

## Spec (§4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`)
- §4.2 per-type COMPLETE section contract vs template `.gobbi/projects/gobbi/skills/memorization/templates/{type}.md`. CRITICAL: `decisions` AND `design` → ADR (Context/Decision-or-Approach/Rationale/Alternatives considered/Consequences + Related). The `templates/design.md` 8-section shape (Problem/Scope/Approach/Scenarios/Validation/Trade-offs/Open-issues) is STALE vs the standard — design docs MUST be ADR per §4.2:177 + the dev-doc-standard's own self-reference. Do NOT flag an ADR-shaped design doc as wrong for "not matching templates/design.md". checklists→ONE form (A: title+table+Item details; B: What/Why/Verification/Status notes; additive `## Related`/`## Source` OK). discussions→Context/Question/Options considered/User decision/Implication/Related. changelogs→`**Task:**`+5. backlogs→Context/Why deferred/When to pick up/Suggested approach/Originating session. README→Overview/Status/Subdirectories(=live dirs)/Recent activity/Open items/Related.
- §4.3: no LOAD-BEARING body session coords (frontmatter `tags:`/`topic:`/`description:` values are NOT body; a `## Source`/`## Related` path to an EXISTING session artifact is legitimate provenance, not a leak). Reclassification → project-level notes only.
- §4.4 KEEP keys never stripped. (This was a pure body pass — frontmatter should be unchanged except a load-bearing `description:` de-crypt.)

## Procedure (evidence-based — mandatory)
1. `cd` worktree `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6`; `git show fddc040 --stat`; `git show fddc040 -- <each file>`.
2. CONTENT PRESERVATION (highest priority — prior tasks had false-PASS + weakened-pointer + over-strip + removed-existing-ref defects): every reshape (esp. the 6 design docs ADR-reshaped from 8-section, the 5 decisions, the 4 checklists) keeps ALL facts; grep key tokens in post-images. A correctly-stripped session coordinate with provenance preserved in `## Source`/frontmatter is §4.3-CONFORMANT, NOT loss.
3. §4.2 COMPLETE contract per doc (design=ADR; checklists one form).
4. CROSS-REF RESOLUTION (whole tree): every `## Related`/inline path-link resolves to an existing file; flag dangling, removed-existing-target, weakened-to-parent.
5. D5 BODY scan: `grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' .gobbi/projects/gobbi/features/workflow/ --include='*.md' | grep -vE '/archive/'` — survivors legitimate (frontmatter lines; `## Source`/`## Related` paths to existing artifacts; literal mistake filenames; live structural refs like `orchestration/SKILL.md § Step 1`)?
6. §4.5 leak gate (0): `find .gobbi/projects/gobbi/features/workflow -name '*.md' -not -path '*/archive/*' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'`
7. Scope: only features/workflow touched; no archive, no features/project-memory.

## Output (write this file, workspace-write)
Write to `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P6b-workflow-prose/evaluation/iter1/codex/findings.md`:
```
VERDICT: <PASS|REVISE|FAIL>
## Summary
## Findings  (each: [type] [severity] [confidence] finding + file:line evidence)
## Cross-ref resolution check
## Verification outputs  (paste D5 + leak gate + git stat)
```
Type vocab: scenario_gap, checklist_gap, design_flaw, assumption_risk, general. Confidence ≥ 75 requires verified evidence. PASS honest if clean; don't invent or rubber-stamp.
