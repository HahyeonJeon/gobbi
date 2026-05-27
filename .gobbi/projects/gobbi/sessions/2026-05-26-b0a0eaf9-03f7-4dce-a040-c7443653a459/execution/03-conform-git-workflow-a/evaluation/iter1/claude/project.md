# Project Perspective — T3 conform git-workflow {discussions,design,decisions} (commit 2d01316)

## Frame
T3 contract (plan row T3): "leak gate 0; 9 base keys on 20" over `features/git-workflow/{discussions,design,decisions}/`. Brief mandate: §4.5 leak gate = 0; all 20 docs carry 9 base keys; scope clean (paths only under the 3 subdirs); -334 deletions are mechanical-only (no narrative loss, never-delete honored); type corrections + related-repoint sensible.

## Verified (own commands)
- **§4.5 leak gate = 0** over the 3 subdirs: `find … -not -path '*/archive/*' | xargs grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by):'` printed nothing. Conditional `disposition:` scan also clean (these dirs are non-backlogs). PASS.
- **9 base keys on all 20 docs**: awk-extracted frontmatter; every doc carries name/description/type/scope/feature/status/created/session/tags. 20/20 OK, 0 missing. PASS.
- **Scope clean**: `git show --name-only 2d01316` = exactly 20 paths, all under `features/git-workflow/(discussions|design|decisions)/`; `grep -v` for out-of-scope paths returned empty. T4-owned subdirs (plans/backlogs/scenarios/references/checklists/changelogs/README) untouched — correct per T3≠T4 boundary. PASS.
- **Type corrections real + sensible**: 3 decisions docs had `type: design_flaw` / `type: checklist_gap` (evaluation-finding-type vocabulary, NOT valid memory `type` enum values per §2.1). All 3 corrected to `type: decisions` matching their directory (§1.1 rule 1). Not fabricated. PASS.

## Findings
None at Project severity. The T3 contract (leak=0, 9 base keys, scope clean) is fully satisfied. Principle 8 (docs reflect implementation) and Principle 11 (no tool-gaming) hold: the leak gate passes on genuine content, not by suppression.

## Must-preserve
- The leak-gate-0 + 9-base-keys conformance across all 20 docs.
- The type-enum corrections (design_flaw/checklist_gap → decisions).

VERDICT: PASS
