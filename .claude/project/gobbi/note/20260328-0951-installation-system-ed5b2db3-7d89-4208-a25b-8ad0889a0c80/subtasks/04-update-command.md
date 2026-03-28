# Subtask 04: Update Command

## Status: Complete

## What was done

Created `/playinganalytics/git/gobbi/src/commands/update.js` implementing the `runUpdate(targetDir, options)` function for updating existing gobbi installations.

## What changed

**Created:** `src/commands/update.js`

The update command implements a selective replacement flow:

1. **Detection gate** — calls `detect.isInstalled()`, exits with guidance if not installed
2. **Skill replacement** — reads template skills directory, replaces all `gobbi*` dirs except `gobbi-hack` (preserved for user customizations), using direct `fs/promises` operations (rm + cp)
3. **Agent replacement** — replaces all `gobbi-*` agent files using direct `fs/promises` operations
4. **GOBBI.md replacement** — copies fresh from templates
5. **CLAUDE.md trigger verification** — calls `claudeMd.ensureTriggerLine()`, reports whether verified or repaired
6. **Core hooks replacement** — calls `hooks.installCoreHooks()` for reload-gobbi.sh and session-metadata.sh
7. **Notification hooks preservation** — explicitly does NOT touch existing notification scripts or settings.local.json
8. **New hook detection** — compares template hooks against installed hooks (excluding core hooks), prompts to install if new ones found (skips in non-interactive mode)
9. **Summary** — lists what was preserved (gobbi-hack, project state, notification hooks)

## Design decisions

- **Direct fs operations for skills/agents** — the briefing specified these as update-specific logic not belonging in lib modules. Uses `readdir`, `rm({ recursive: true, force: true })`, `cp({ recursive: true })`.
- **Lib modules for shared operations** — detection, CLAUDE.md trigger, and core hooks use existing lib functions.
- **CORE_HOOK_SCRIPTS constant** — duplicated from hooks.js rather than importing it (it's not exported). Used to exclude core hooks from the "new hooks" detection logic.
- **askQuestion helper** — local to update.js, follows the same pattern as in hooks.js and project.js.

## What was learned

- The hooks.js module doesn't export its `CORE_SCRIPTS` constant, so update.js maintains its own list for the new-hook detection filter. If core hooks change, both places need updating.
- `Function.length` reports 1 for `runUpdate(targetDir, options = {})` because JS only counts parameters without defaults. This is correct behavior.

## Verification

- `node -e "import('./src/commands/update.js')"` — imports successfully
- Function signature matches: `runUpdate(targetDir, options)`
- All fs operations use `fs/promises` (readdir, rm, cp, chmod, access)
- ES module imports used throughout
- No modifications to lib modules, cli.js, or any other existing files

## Open items

- The `CORE_HOOK_SCRIPTS` list in update.js is a duplication of `CORE_SCRIPTS` in hooks.js. If hooks.js exported it, both could share the source of truth. This is a minor improvement for a future task.
