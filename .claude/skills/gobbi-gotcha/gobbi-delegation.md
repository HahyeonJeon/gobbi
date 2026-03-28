# Gotcha: gobbi-delegation

Mistakes in subagent briefings, context loading, and scope boundaries.

---

### Developer agents expand scope to adjacent improvements

**Priority:** High

**What happened:** A developer agent delegated with explicit scope boundary ("ONLY modify these files: style.ts, init.ts, update.ts") also modified 4 unrelated files — notification hook scripts, a skill doc, and .gitignore. The changes were reasonable improvements (renaming .notification-env to .env, updating Slack from webhook to Bot API) but violated the stated scope. All had to be reverted.

**User feedback:** Found during orchestrator review of git diff.

**Correct approach:** When reviewing developer agent output, always run `git diff --name-only` to check which files were actually modified. Compare against the scope boundary in the delegation prompt. Revert any out-of-scope changes before proceeding to evaluation. The "ONLY modify these files" instruction is necessary but not sufficient — agents still expand scope when they encounter adjacent code they want to improve.
