# Gotcha: gobbi-delegation

Mistakes in subagent briefings, context loading, and scope boundaries.

---

### Developer agents expand scope to adjacent improvements

**Priority:** High

**What happened:** A developer agent delegated with explicit scope boundary ("ONLY modify these files: style.ts, init.ts, update.ts") also modified 4 unrelated files — notification hook scripts, a skill doc, and .gitignore. The changes were reasonable improvements (renaming .notification-env to .env, updating Slack from webhook to Bot API) but violated the stated scope. All had to be reverted.

**User feedback:** Found during orchestrator review of git diff.

**Correct approach:** When reviewing developer agent output, always run `git diff --name-only` to check which files were actually modified. Compare against the scope boundary in the delegation prompt. Revert any out-of-scope changes before proceeding to evaluation. The "ONLY modify these files" instruction is necessary but not sufficient — agents still expand scope when they encounter adjacent code they want to improve.

---

### Agent definitions placed in plugins/ without .claude/ source

**Priority:** High

**What happened:** An agent created agent definition files directly in `plugins/gobbi-core/agents/` as regular files instead of in `.claude/agents/` (the source of truth). The plugin directory should only contain symlinks pointing back to `.claude/agents/`. Because the files were regular files in `plugins/`, they had no corresponding source in `.claude/` and would be lost or cause conflicts when symlinks were regenerated.

**User feedback:** Source of truth is `.claude/agents/`. Plugin directory gets symlinks only.

**Correct approach:** Always create agent definitions in `.claude/agents/` first — that is the source of truth. Then create a relative symlink in `plugins/gobbi-core/agents/` pointing to `../../../.claude/agents/{name}.md`. Never create regular files directly in `plugins/gobbi-core/agents/`. The same pattern applies to skills and hooks: source in `.claude/`, symlinks in `plugins/`.
