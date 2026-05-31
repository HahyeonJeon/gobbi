---
task: task-05-06
scripts:
  - scripts/validate-plugin-hooks-fire-once.sh
  - scripts/check-plugin-invocability.sh
status: DONE_WITH_CONCERNS
---

# Verification Evidence — task-05-06

## bash -n syntax check

```
bash -n scripts/validate-plugin-hooks-fire-once.sh   → exit 0 (PASS)
bash -n scripts/check-plugin-invocability.sh         → exit 0 (PASS)
```

## File permissions

```
-rwxrwxr-x validate-plugin-hooks-fire-once.sh   (+x confirmed)
-rwxrwxr-x check-plugin-invocability.sh         (+x confirmed)
```

## T5 grep evidence (all required elements present)

- `GOBBI_HOOK_MARKER_DIR`: present (marker mechanism, instrumented-copy approach)
- `check_marker "SessionStart"`: line 271
- `check_marker "PostToolUse"`: line 272
- `check_marker "PostToolUseFailure"`: line 273
- `ALLOW_SET=( ".claude-plugin" "skills" "agents" "hooks" )`: line 321
- `claude plugin install gobbi`: line 69
- `claude plugin marketplace add`: line 60
- `claude plugin uninstall gobbi`: line 186

## T6 grep evidence (all required elements present)

- `gobbi:codex`: lines 10, 61, 167, 179, 196 (targeted, invocation procedure, TRUE/FALSE)
- `gobbi:gobbi-hook-authoring`: lines 11, 62, 168, 180, 197 (targeted, invocation procedure, TRUE/FALSE)
- `gobbi:leader`: lines 13, 76, 170, 181 (agent under test)
- `AUTOGRANT_RESULT=TRUE|FALSE`: TRUE/FALSE extraction via env var
- `APPLY_FALSE=false` (default): settings.json edit guarded — no autonomous edit
- `--apply-false` flag: conditional edit requires explicit operator flag

## No live run / No settings.json edit / No commit

- No `claude plugin install` was executed during this task.
- `.claude/settings.json` is unchanged (git status --short exits 0 with empty output for that file).
- No new commit made (`git log` shows only pre-existing planning/preparation/ideation commits).

## Concern (DONE_WITH_CONCERNS)

The marker injection procedure documents using `patch` against specific line numbers in the installed-cache hook copies. These line numbers are derived from the current packaged hook scripts. If the hook scripts change before the operator runs this test, the patch hunks may not apply cleanly. The operator should verify the patch applies, or fall back to manual insertion of the marker block at the documented location (after the `payload="$(cat)"` line).

Additionally, the Claude CLI `plugin marketplace add` syntax (flags `--url`, `--branch`) is inferred from the DD design context; the operator should verify these flags match the actual installed claude CLI version.
