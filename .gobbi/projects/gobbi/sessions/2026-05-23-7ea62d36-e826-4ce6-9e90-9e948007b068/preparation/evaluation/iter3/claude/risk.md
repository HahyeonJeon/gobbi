# Preparation iter3 — Risk perspective (Claude)

**Verdict: PASS** | Findings: 0

## Risk surface scanned
- **Locked-spec drift** — H2 list verified verbatim against Design A lines 15-23. Risk: closed.
- **Frontmatter convention drift** — `allowed-tools` confirmed against 16/16 project skills. Risk: closed.
- **Audit-trail destruction** — iter1 + iter2 snapshots preserved at `rawdata/skill-stub-iter{1,2}.md`. Iron Law 7 satisfied. Risk: closed.
- **Manager-brief regression** — staged mistake candidate at `staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` captures the iter2 process failure. Promotion at Wrap-up. Risk: tracked, closed for this iter.
- **Constraints H2-vs-body tension** — brief-flagged Low; deferred to Planning DISCUSSION. Risk: bounded.
- **Symlink semantics post-ship** — open concern #5 carried forward unchanged from iter2; addressed by Execution + Wrap-up gates. Risk: deferred, contained.

## Project-mistake cross-reference
- `.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md` cited in Sandbox + CWD discipline comment (line 68) — mistake is encoded in the stub itself.

## FINAL-iter abort risk
This is the terminal budget iter. A REVISE here would abort the prep loop. The 6 gates pass, no Critical/High findings, no manufactured nitpicks — PASS is correct.

## Findings
None.

## Verdict
**PASS** — risk surface is scanned, closed where actionable, and bounded where deferred.
