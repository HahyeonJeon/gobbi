# Codex Adversarial Eval — T9a iter2 (commit fc17c34): restore KEEP keys + de-crypt titles + codify KEEP list

Independent adversarial evaluator. Diff/inspect yourself; do NOT trust reports. iter1 (1287e88) was REVISE (2-3 cryptic titles + stripped project/title); iter2 (fc17c34) remediates + adds a KEEP list to §4.4. Standard = §4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`. Evaluate the CURRENT HEAD state of features/workflow.

## Verify yourself (worktree root = CWD; re-cd every call)
1. **0 cryptic-led titles** (broadened, incl LOCK/Task): `grep -rnE '^#{1,3} +(T[0-9]|Task [0-9]|D-[0-9]|W[0-9]-T|COD-|F-[A-Z]|iter[0-9]|CP-|LOCK)' features/workflow --include='*.md' | grep -v /archive/` = EMPTY.
2. **KEEP keys restored** — features/workflow/README.md has `project:`; decisions/wrap-up-step-2-5-anchor-placement.md has `title:`.
3. **§4.5 full gate over features/workflow (archive-safe) = 0** (no regression).
4. **§4.4 KEEP list** — `git show fc17c34 -- rules.md`: a KEEP-list subsection added enumerating base + cross-ref + provenance + per-type + backlog keys + "when in doubt KEEP"; the strip-set S unchanged; §1-3 + rest untouched.
5. **No regression / no new loss** — `git show fc17c34`: title de-crypts are heading-line changes; key restores are frontmatter additions; NO body section reshaping; NO KEEP key newly stripped; NO narrative deleted.
6. **Scope** — only rules.md + features/workflow/ paths (+ allowed rawdata note).

## Output (write to ABSOLUTE path)
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6/.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/09a-conform-workflow/evaluation/iter2/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = 0 cryptic titles + project/title restored + gate 0 + KEEP list added + no regression + scope clean. If sound, PASS.
