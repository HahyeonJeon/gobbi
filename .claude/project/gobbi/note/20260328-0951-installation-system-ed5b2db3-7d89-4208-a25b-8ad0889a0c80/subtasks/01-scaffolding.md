# Subtask 01: Package Scaffolding + Build System

## What was done

Created the npm package scaffolding for the `gobbi` CLI installer. This provides the packaging structure, CLI entry point, command dispatcher, and build script needed to publish gobbi as an npm package.

## Files created

| File | Purpose |
|------|---------|
| `package.json` | npm package manifest (name, version, bin, files, scripts) |
| `bin/gobbi.js` | CLI entry point with shebang, imports and calls `src/cli.js` |
| `src/cli.js` | Command dispatcher using `util.parseArgs`, routes `init`/`update` to dynamic imports |
| `scripts/build-templates.sh` | Pre-publish script that copies `.claude/` source files into `templates/` for distribution |
| `.gitignore` | Excludes `templates/` and `node_modules/` from version control |

## Verification results

| Check | Result |
|-------|--------|
| `node bin/gobbi.js` (no args) | Usage text printed, exit 0 |
| `node bin/gobbi.js help` (unknown cmd) | Usage text printed, exit 1 |
| `bash scripts/build-templates.sh` | All templates built, no errors |
| `templates/skills/gobbi/SKILL.md` exists | Yes (entry-point skill copied correctly) |
| `templates/skills/gobbi-orchestration/SKILL.md` exists | Yes (hyphenated skills copied) |
| `templates/agents/` file count | 5 files (all gobbi-* agents) |
| `templates/hooks/` file count | 9 files (all hook scripts) |
| `templates/GOBBI.md` exists | Yes |
| `templates/settings.json` exists | Yes |

## Design decisions

- **Unknown command exits with code 1**, no-command exits with code 0. Both print usage. This follows standard CLI conventions where running with no args is informational (exit 0) but a wrong command is an error (exit 1).
- **`build-templates.sh` uses `cd` to repo root** via `SCRIPT_DIR` detection, so it works regardless of the caller's working directory.
- **Entry-point skill copied separately** from hyphenated skills. `cp -r .claude/skills/gobbi` (no glob) copies the exact directory, while `cp -r .claude/skills/gobbi-*` copies all hyphenated variants. This avoids the glob `gobbi*` accidentally merging them or the glob `gobbi-*` missing the entry-point.

## Issues encountered

None.

## Open items

- `src/commands/init.js` and `src/commands/update.js` do not exist yet. The dispatcher will fail gracefully with an import error when these commands are invoked. These are handled by subtask 02.
- `src/lib/*.js` library modules are not created here. Handled by another subtask.
