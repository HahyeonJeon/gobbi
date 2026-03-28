# Subtask 02: Library Modules

All utility modules for the gobbi installer, created under `src/lib/`.

---

## Modules Created

### `src/lib/detect.js`

```
export async function isInstalled(targetDir) → boolean
```

Checks for `{targetDir}/.claude/skills/gobbi/SKILL.md` existence using `fs.access`. Returns `false` on missing file without throwing.

### `src/lib/files.js`

```
export async function copySkills(templatesDir, targetDir) → number
export async function copyAgents(templatesDir, targetDir) → number
export async function copyGobbiMd(templatesDir, targetDir) → number
```

- `copySkills`: Reads `{templatesDir}/skills/`, copies directories starting with "gobbi" to `{targetDir}/.claude/skills/` via `fs.cp({ recursive: true })`. Returns count.
- `copyAgents`: Copies files matching `gobbi-*` from `{templatesDir}/agents/` to `{targetDir}/.claude/agents/`. Returns count.
- `copyGobbiMd`: Copies `{templatesDir}/GOBBI.md` to `{targetDir}/.claude/GOBBI.md`. Returns 1.

All functions create destination directories if needed.

### `src/lib/claude-md.js`

```
export async function ensureTriggerLine(targetDir) → { created, modified, alreadyPresent }
```

Ensures `CLAUDE.md` contains the gobbi trigger line. Detection uses substring `MUST reload skills /gobbi` for resilience. Creates file if missing, prepends trigger line if not present. Returns status object.

### `src/lib/settings.js`

```
export async function mergeHookConfig(settingsPath, hookEntries) → void
```

Merges hook entries into a settings JSON file. Deduplicates by comparing hook `command` strings within each event array. Preserves all existing JSON keys. Creates parent directory and file if needed. Writes with 2-space indent + trailing newline.

### `src/lib/hooks.js`

```
export async function installCoreHooks(templatesDir, targetDir) → void
export async function promptNotificationHooks(templatesDir, targetDir, nonInteractive) → { installed }
```

- `installCoreHooks`: Copies `reload-gobbi.sh` and `session-metadata.sh`, sets chmod 755, merges two entries into `settings.json` (PostCompact and SessionStart).
- `promptNotificationHooks`: If non-interactive, returns `{ installed: false }`. Otherwise asks via readline. If yes, copies all 7 notification scripts, chmod +x, merges 7 hook entries (across 6 events) into `settings.local.json`. `notify-send.sh` is copied but has no settings entry (shared utility).

Hook entries match the exact structure from `.claude/settings.json` and the notification SKILL.md example.

### `src/lib/project.js`

```
export async function initProjectDir(targetDir, nonInteractive) → { created, name? }
```

If non-interactive, skips. Otherwise asks project name via readline. Creates `{targetDir}/.claude/project/{name}/` with subdirs: `gotchas/`, `rules/`, `reference/`, `docs/`, `design/`, `note/`.

---

## Verification Results

All 6 modules pass:

| Module | Importable | Named exports | fs/promises only | path.join only |
|--------|-----------|---------------|-----------------|---------------|
| detect.js | Yes | `isInstalled` | Yes | Yes |
| files.js | Yes | `copySkills`, `copyAgents`, `copyGobbiMd` | Yes | Yes |
| claude-md.js | Yes | `ensureTriggerLine` | Yes | Yes |
| settings.js | Yes | `mergeHookConfig` | Yes | Yes |
| hooks.js | Yes | `installCoreHooks`, `promptNotificationHooks` | Yes | Yes |
| project.js | Yes | `initProjectDir` | Yes | Yes |

No default exports. No sync fs operations. No string path concatenation. No npm dependencies.

---

## Design Decisions

1. **Deduplication in `mergeHookConfig`**: Checks the first hook's `command` string within each event array entry. This handles the common case where the same script is registered twice. It compares `config.hooks[0].command` rather than deep-comparing the entire config object, which is simpler and sufficient since each script has a unique command path.

2. **Helper `askQuestion` duplicated in hooks.js and project.js**: Each module has its own private `askQuestion` helper rather than extracting to a shared util. This keeps each module self-contained with no cross-dependencies beyond `settings.js` (which `hooks.js` imports for `mergeHookConfig`). The duplication is minimal (8 lines) and avoids coupling.

3. **`notify-session.sh` produces TWO hook entries**: One for `SessionStart` and one for `SessionEnd`, matching the notification SKILL.md spec. Both use the same script but fire on different events.

4. **`load-notification-env.sh` has no `async: true`**: This is intentional — it loads environment variables synchronously before the session starts, so the env vars are available for all subsequent notification hooks.
