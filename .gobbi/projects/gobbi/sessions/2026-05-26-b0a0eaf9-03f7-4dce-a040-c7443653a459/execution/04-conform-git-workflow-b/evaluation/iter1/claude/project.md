# Project — T4 conform git-workflow remaining 21 docs (commit 33340be)

## Artifact Summary + Memory reads
**What**: Conform features/git-workflow EXCEPT T3-subdirs (discussions/design/decisions) — i.e., backlogs, changelogs, checklists, plans, references, scenarios + README (21 docs) — to dev-doc standard §4. Cumulative gate over the full 41-doc feature.
**Why**: Memory-redesign retrofit; T4 is the cumulative-gate closing task for git-workflow per planning task-list.md line 66.
**How**: Add 9 base keys; strip S-set staging keys; preserve disposition on backlogs; normalize date→created, type→ref_type; de-crypt §4.3 body refs.
**Scope contract**: planning/artifacts/task-list.md line 66 — "leak gate over whole feature = 0; all 41 carry 9 base keys; disposition preserved; git diff only `features/git-workflow/`". T4 = git-workflow EXCEPT T3 subdirs + README. Other-feature leaks NOT T4 defects.

**Memory reads**: principles (P8,P11); rules/stub-redirect-format.md; mistakes/{executor-main-tree-edit-near-miss, design-literal-retire-instruction-without-replacement, naming-standard-needs-positive-guidance-not-just-blocklist}; skills/evaluation/SKILL.md; skills/execution/evaluation.md; skills/memorization/rules.md (§2,§4); planning/artifacts/task-list.md; rawdata/draft-iter1.md.

## Locked Frame (Stage 1)
- **S1 right-task**: change-set conforms exactly the 21 T4 docs + README. Checklist: 21 doc files touched (6 subdirs + README); each gains base schema. (adversarial) no T3 subdir re-touched.
- **S2 only-task**: `git show --name-only` confirms no out-of-scope path. Checklist: no other-feature edits; no skills/agents edits; rawdata note allowed.
- **S3 whole-task**: all 21 conformed (none skipped). Checklist: 21 of 21 carry base keys; cumulative 41 = full feature.
- **S4 (adversarial) scope creep**: a "while I was here" T3-subdir frontmatter touch slips in. Checklist: discussions/design/decisions diff = 0.
- Mistake-derived scenario (executor-main-tree-edit): commit must land on worktree branch, not main tree.

## Per-scenario per-check results
- S1: YES. `git show --numstat` lists exactly 21 git-workflow docs (backlogs×3, changelogs×3, checklists×5, plans×1, references×5, scenarios×3) + README + 1 rawdata note. All carry base schema (verified, see consistency.md).
- S2: YES. `git show --name-only 33340be | grep -vE "features/git-workflow/|sessions/.*/rawdata/"` → empty. No other-feature, no skills/agents edits.
- S3: YES. All 21 conformed; cumulative feature = 41 docs (T3's 20 + T4's 21 = 41, README counted once in the 41).
- S4: YES (adversarial clean). `grep "features/git-workflow/(discussions|design|decisions)/"` over changed paths → NONE. T3 subdirs untouched.
- Mistake check: YES. HEAD 33340be on branch `chore/session-2026-05-25-a10c82d6`; `git rev-parse --show-toplevel` = worktree root. No main-tree edit.

## Typed findings
None at Critical/High. Scope is exactly the contracted 21 + README; no creep; right task, whole task, only task.

## Low-confidence appendix
- (Low/25) `general`/`process`: rawdata/draft-iter1.md committed in the same commit as the doc conformance. Session rawdata in a conformance commit is conventional for this project's task commits; not a scope defect. FP-category: out-of-scope-but-conventional.

VERDICT: PASS
