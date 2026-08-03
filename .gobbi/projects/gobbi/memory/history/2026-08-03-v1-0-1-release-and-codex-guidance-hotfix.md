# Gobbi v1.0.1 released and Codex guidance corrected

**Completed at:** 2026-08-03T06:18:53Z

## Changes

- Released the approved accumulated development line as Gobbi plugin v1.0.1. PR #373 integrated the
  239-file candidate into `develop`; PR #374 promoted it to `main`; annotated tag object
  `9790927ebdcb227a3132abd1276c9bb538bcaefa` peels to release commit
  `7e44b5831eb59eaf8d7cf8e19a1d73f19efcbf0d`. The user accepted version 1.0.1 and the disclosed inclusion
  of 17 canonical skill files. Semantic review of the accumulated skill and agent behavior was excluded.
- Examined legacy PR #370, found it incomplete, conflicting, and superseded, then closed it without merge.
- An independent Codex evaluation returned `REVISE`. The user fixed only blocking finding `REL-CONS-001`
  and accepted `REL-PLAN-002` and `REL-GIT-003` without correction. The frozen findings, waiver, and limits
  are preserved in the
  [v1.0.1 release evaluation](../reports/review/2026-08-03-v1-0-1-release-evaluation.md).
- Corrected the stale Codex install guidance and strengthened the installed-cache smoke. The verified fix
  was published from a clean branch through PR #376 into `develop` and PR #377 into `main`; the current
  default-branch tree is `7f02c3dd1e25eeb4d26cda3efc963034029c7ac5` and all version owners remain
  1.0.1. The immutable v1.0.1 tag intentionally remains on the original pre-hotfix release commit.
- Retained the Cowork and hotfix branches and worktrees, created no GitHub Release page, and performed no
  cleanup. No fresh independent evaluation covers the post-evaluation hotfix; Cowork requires another
  explicit `evaluate` call to obtain one.
