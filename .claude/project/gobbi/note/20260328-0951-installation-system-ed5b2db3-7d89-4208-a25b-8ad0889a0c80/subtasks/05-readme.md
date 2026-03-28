# Subtask 05: README.md

## What was done

Rewrote `/playinganalytics/git/gobbi/README.md` with all specified sections: header with Korean meaning, what-is description, quick start, git manual install, commands (init/update), hooks (core and notification tables), required permissions JSON block, development commands, and MIT license.

## What changed

- **README.md** — full rewrite from a 3-line stub to a complete package README with 9 sections. All content derived from the source files (cli.js, init.js, update.js, hooks.js, SKILL.md, GOBBI.md, package.json). No code files were modified.

## What was learned

- The hooks configuration in settings.json uses a specific structure with `matcher` patterns and array-of-objects format — this was pulled directly from `hooks.js` CORE_HOOK_ENTRIES to ensure the manual install instructions match what the CLI generates.
- Notification hooks write to `settings.local.json` (not `settings.json`) — this distinction matters for the manual install path but was kept implicit since manual install users would need to configure notification hooks separately anyway.

## Open items

- The git clone URL (`https://github.com/playinganalytics/gobbi.git`) is assumed — should be verified before publishing.
- The manual install section does not cover notification hook settings.json configuration (only core hooks). Users wanting notifications via manual install would need to configure those entries in settings.local.json themselves.
