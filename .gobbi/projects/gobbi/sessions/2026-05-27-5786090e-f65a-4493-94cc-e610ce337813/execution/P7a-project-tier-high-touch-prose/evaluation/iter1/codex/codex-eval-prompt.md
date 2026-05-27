# Codex evaluator — P7a (project-tier decisions+design+learnings+notes+backlogs, 38 docs)

Independent adversarial evaluator, dual-system gobbi eval. A Claude executor (commit `a04e509`, 12 files edited) reshaped PROJECT-TIER docs under `.gobbi/projects/gobbi/{decisions,design,learnings,notes,backlogs}/` (top-level only) to §4. Find what is wrong. DO NOT trust the executor summary — diff the commit and read the files.

## Spec (§4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`)
- §4.2 per-type COMPLETE section contract vs template `.gobbi/projects/gobbi/skills/memorization/templates/{type}.md`: decisions/design→ADR (Context/Decision-or-Approach/Rationale/Alternatives considered/Consequences + Related; design=ADR per §4.2:177, the 8-section design template is STALE — do NOT flag ADR as wrong); learnings→Insight/Context/Why it matters/How to apply/Counter-cases (+Related); backlogs→Context/Why deferred/When to pick up/Suggested approach/Originating session (concrete `sessions/{anchor}/` path); notes→journal (see the KNOWN TENSION below).
- §4.3: strip LOAD-BEARING session coords from EVERGREEN bodies (decisions/design/learnings); provenance→`## Source`. A coordinate inside a `## Source` footer or a literal existing-file path is LEGITIMATE, not a leak. NOTES + BACKLOGS keep their provenance/narrative coordinates (not evergreen-strip targets).
- §4.4 KEEP keys never stripped.

## KNOWN judgment calls the executor flagged (assess fairly, don't blindly flag):
1. NOTES were NOT reshaped to the §4.2 canonical journal headings (What happened/What shipped/What got stuck/What shifted/Decisions to respect/Next session). The executor argues notes are append-only/immutable once a session closes + §4.3 forbids reshaping notes narrative + they read fine zero-context. ASSESS: is leaving old session-journal notes with their original (readable) headings acceptable, or is it a §4.2 miss? (Consider the notes-template's own immutability rule.)
2. `backlogs/memory-redesign-remaining-waves.md` is a CLOSED resume-anchor (`status: closed`) with a historical shape; the executor added the required `## Originating session` but did NOT re-prose the closed body, recommending Wrap-up ARCHIVE it instead. ASSESS: reasonable?
3. Index READMEs (5) left untouched — they are N1's scope (README nav accuracy), not P7a. (Do not flag READMEs.)

## Procedure (evidence-based — mandatory)
1. `cd` worktree `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6`; `git show a04e509 --stat`; `git show a04e509 -- <each file>`.
2. CONTENT PRESERVATION (highest priority): every reshape (3 design ADR, 5 learnings, 4 backlogs) keeps ALL facts; nothing dropped/weakened. Grep key tokens in post-images. A correctly-stripped coordinate with provenance in `## Source`/frontmatter is §4.3-CONFORMANT.
3. §4.2 COMPLETE contract per EDITED doc (design=ADR; learnings 5-section; backlogs concrete session path). For the UNEDITED notes, assess judgment-call #1.
4. CROSS-REF (whole tree): every `## Related`/inline path-link resolves; flag dangling/removed-existing/weakened.
5. D5 EVERGREEN-body scan: `for d in decisions design learnings; do grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' .gobbi/projects/gobbi/$d/ --include='*.md' 2>/dev/null | grep -vE '/archive/'; done` — survivors legitimate (Source footers, literal mistake filenames)?
6. §4.5 leak gate (0): `find .gobbi/projects/gobbi/decisions .gobbi/projects/gobbi/design .gobbi/projects/gobbi/learnings .gobbi/projects/gobbi/notes .gobbi/projects/gobbi/backlogs -maxdepth 1 -name '*.md' -not -path '*/archive/*' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'`
7. Scope: only the 5 project-tier top-level dirs touched; `mistakes/` UNTOUCHED; no features/, no sessions/.

## Output (write this file, workspace-write)
Write to `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P7a-project-tier-high-touch-prose/evaluation/iter1/codex/findings.md`:
```
VERDICT: <PASS|REVISE|FAIL>
## Summary
## Findings  (each: [type] [severity] [confidence] finding + file:line evidence)
## Judgment-call assessments (notes / closed-backlog / READMEs)
## Verification outputs  (paste D5 + leak gate + git stat)
```
Type vocab: scenario_gap, checklist_gap, design_flaw, assumption_risk, general. Confidence ≥ 75 requires verified evidence. PASS honest if clean; don't invent or rubber-stamp.
