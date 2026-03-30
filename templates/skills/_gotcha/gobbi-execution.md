# Gotcha: _execution

Mistakes in task implementation and verification.

---

### Hook script copy without settings entry = dead hook

**Priority:** High

**What happened:** The update command's "install new hooks" feature copied hook scripts to `.claude/hooks/` and set chmod +x, but did not call `mergeHookConfig` to add the corresponding settings.json/settings.local.json entries. The hooks existed on disk but Claude Code never fired them because there was no configuration.

**User feedback:** Found during execution evaluation. Hooks require BOTH the script file AND the settings entry to function.

**Correct approach:** Whenever copying hook scripts, always pair it with a `mergeHookConfig` call to add the corresponding event/matcher/command entry to the appropriate settings file. Never copy a hook without its settings entry.

---

### parseArgs strict mode crashes on unknown flags

**Priority:** High

**What happened:** `util.parseArgs` in strict mode (the default) throws `ERR_PARSE_ARGS_UNKNOWN_OPTION` for any flag not in the options config. The CLI crashed with a raw stack trace when users ran `gobbi --help` or `gobbi --version`.

**User feedback:** Found during execution evaluation.

**Correct approach:** Always define `--help` and `--version` in the parseArgs options config for any CLI tool. Handle them with early-exit before command dispatch.

---

### User input used in path construction without validation

**Priority:** High

**What happened:** The project name prompt accepted arbitrary input including `../../pwned`, which when used in `path.join(targetDir, '.claude/project/', name)` resolved to a path outside the intended directory.

**User feedback:** Found during execution evaluation as a path traversal vulnerability.

**Correct approach:** Validate user-provided strings before using them in path construction. Reject names containing `..`, `/`, `\`, or other path separators. Also verify the resolved path stays within the expected parent directory.
