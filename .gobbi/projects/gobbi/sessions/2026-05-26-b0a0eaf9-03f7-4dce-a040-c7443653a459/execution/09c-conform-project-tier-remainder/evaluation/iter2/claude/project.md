# Project — T9c iter2 re-run (commit c001694)

## Artifact Summary
- **What:** Frontmatter + title conformance to §4 of `memorization/rules.md` over the project-tier remainder — references/, reviews/, rules/, plans/, mistakes/ (maxdepth 1) + features/README.md + root README.md. Commit c001694 on chore/session-2026-05-25-a10c82d6.
- **Why:** Prior iter1 attempt (14041db) was committed to develop (main tree) via the cwd-reset bug and discarded; this is the clean re-run on the worktree chore branch (witness: iter1 codex/claude Critical RISK-1 wrong-branch FAIL).
- **How:** Prepend 9-key base frontmatter to 6 placeholder READMEs; add missing keys + de-crypt title on the reviews dual-system-eval doc; strip cryptic prefixes/coords from 4 mistake titles; add missing `tags:` on naming-standard.
- **Scope Contract:** rawdata/draft-iter2.md (28-doc scope; `rules/stub-redirect-format.md` already conformant → not touched).
- **W/W/H:** all clear.

## Memory reads
- `.claude/skills/memorization/rules.md` §1.3 + §2.1 + §4.4 + §4.5 (spec)
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- iter1 claude/*.md (project PASS … risk FAIL); iter1 codex/overall.md (Critical KEEP-strip on 14041db)
- mistakes: executor-main-tree-edit-near-miss, sendmessage-continued-cwd-resets-to-main-tree, design-literal-retire, supersede-never-delete (via codex-subprocess)

## Locked Frame (Stage 1)
- **S-PROJ-1** Right problem: re-run conforms only the T9c remainder, not adjacent tiers.
  - [x] Only T9c paths in diff — verified `git show --name-only`: 11 files, all in mistakes/plans/references/reviews/features/README/root README.
- **S-PROJ-2** Scope contract honored: rules/stub-redirect already conformant, correctly untouched.
  - [x] `rules/stub-redirect-format.md` carries 9 base keys + concept title, absent from diff.
- **S-PROJ-3 (adversarial)** Scope creep — did the re-run "while here" touch develop, or non-memory surfaces (skills/agents/sessions)?
  - [x] No develop/main commit; no skills/agents/sessions files in diff. Untracked session-runtime files are not part of the deliverable.

## Stage 2 findings
No open findings. The commit solves exactly the stated problem (re-run on chore branch) and stays inside the locked scope. The prior iter1 RISK-1 (wrong-branch) is structurally resolved: `git branch --contains c001694` = chore only; `git merge-base --is-ancestor 14041db c001694` = false (clean re-run from cedd0cd, not built on the discarded develop commit).

- **Inherited iter1 RISK-1 (wrong-branch FAIL)** → **disposition: addressed**. Evidence: commit on chore branch, parent cedd0cd, 14041db not ancestor.
- **Inherited iter1 codex KEEP-strip Critical** → **disposition: addressed**. Evidence: frontmatter key-set diff parent→commit identical for all 4 mistake files (naming-standard gained `tags:` only); reviews file `date:`→`created:` rename preserves value; no `title`/`project` keys existed to strip.

VERDICT: PASS
