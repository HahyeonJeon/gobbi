# Ideation: Gobbi Installation System

## Initial Prompt

User requested development of an installation system for gobbi, to be worked on in parallel with doc updates.

## Discussion Points

### Distribution Mechanism
- **Options presented**: npx CLI (as designed in distribution.md), shell script installer, both
- **User decision**: npx CLI + git support (git = documented manual path, not CLI feature)
- **Rationale**: npm is the most discoverable channel for developer tools; git manual path serves users who want to understand what they're installing

### CLAUDE.md Management
- **Options presented**: Minimal reference (one-liner), marker-bounded sections (as in distribution.md), full gobbi-managed
- **User decision**: Minimal reference — CLAUDE.md gets only `MUST reload skills /gobbi` trigger line
- **Rationale**: The /gobbi skill chain loads everything (gobbi -> gobbi-orchestration -> gobbi-gotcha -> gobbi-claude). No content needs to live in CLAUDE.md. Reduces merge complexity and coupling.
- **Note**: This contradicts the existing distribution.md design doc which describes marker-bounded sections. Design doc needs updating.

### Scope
- **Options presented**: Minimal init only, init + update, full matrix
- **User decision**: Init + update
- **Rationale**: Update is essential for version lifecycle. Full matrix (settings merge, hooks) deferred where appropriate.

### Update Strategy
- **Options presented**: Overwrite core/skip user, diff-based, replace everything
- **User decision**: Overwrite core, skip user. All gobbi files are gobbi-owned and not user-editable. gobbi-gotcha content replaced on update (user gotchas go in project/gotchas/).
- **Key principle**: ALL files within gobbi-* skill directories are gobbi-owned. User customizations go through gobbi-hack/ (patch overlay) or .claude/project/ (project state).

### Settings Management
- **Options presented**: Merge permissions, separate settings file, skip settings
- **User decision**: Skip settings entirely for permissions. Document required permissions for manual configuration. Hook configurations ARE managed (see hook split below).
- **Rationale**: settings.local.json contains project-specific absolute paths that can't be templated generically.

### Hook Installation
- **Options presented**: Skip hooks, install with confirmation, always install
- **User decision**: Install with confirmation. Show each hook group, ask user.
- **Hook ownership split (agreed)**: Core hooks (reload-gobbi.sh) -> settings.json (committed, always installed, replaced on update). Notification hooks (notify-*.sh) -> settings.local.json (local, interactive, preserved on update).

### Git Support
- **Options presented**: Documented manual path, CLI --from-git flag, both
- **User decision**: Documented manual path only. CLI doesn't use git.

### Conflict Detection
- **Options presented**: Detect and redirect, ask and proceed, always overwrite
- **User decision**: Detect and redirect. Init refuses if installed, suggests update. Update refuses if not installed, suggests init.
- **Detection mechanism**: Presence of `.claude/skills/gobbi/SKILL.md`

### GOBBI.md
- **User decision**: Install it. GOBBI.md is part of the gobbi harness.

### Project Directory
- **Options presented**: Skip and let gobbi create on first use, ask for project name, use directory name
- **User decision**: Ask for project name (skippable). If provided, create `.claude/project/{name}/` with subdirs. If skipped, gobbi creates on first use.

### Package Name
- **User decision**: `gobbi` (availability unverified)

## Evaluation Rounds

### Round 1 (3 evaluators: positive, moderate, critical)
- **Positive**: PASS. Core decisions sound — CLAUDE.md one-liner, update boundary, interactive hooks, settings merge, detection mechanism.
- **Moderate**: REVISE. 4 must-fix items: settings.json vs settings.local.json handling, detection mechanism, multi-file skills on update, design doc contradiction.
- **Critical**: REVISE. 4 blocking issues: CLAUDE.md contradiction with design docs, settings file conflation, detection unspecified, cross-project gotcha destruction.

All 5 blocking issues were resolved:
1. Settings split: hooks in settings.json, permissions in settings.local.json
2. Detection: `.claude/skills/gobbi/SKILL.md` presence
3. Multi-file skills: ALL files in gobbi-* dirs replaced (all gobbi-owned)
4. Gotcha content: replaced on update (gobbi-owned, user gotchas in project/gotchas/)
5. CLAUDE.md: skill chain loads everything, CLAUDE.md is just trigger

### Round 2 (3 evaluators on revised idea)
- **Positive**: PASS. All issues resolved. Detection, ownership model, settings split, CLAUDE.md, hooks, package structure all sound.
- **Moderate**: PASS. Minor items for planning: mandatory reload hook, path templating, design doc reconciliation, GOBBI.md role.
- **Critical**: REVISE. 3 new blocking issues:
  - B1: Hardcoded absolute paths in permissions -> Resolved: skip settings.local.json permissions entirely
  - B2: .claude/project/ needs project name -> Resolved: ask for name (skippable), create if provided
  - B3: Hook ownership undefined for update -> Resolved: core hooks replaced, notification hooks preserved

## Final Refined Idea

### Distribution
npm package `gobbi` with `npx gobbi init` and `npx gobbi update`. Git manual path in README.

### Detection
Check `.claude/skills/gobbi/SKILL.md` existence. Init refuses if present. Update refuses if absent.

### `npx gobbi init`
1. Detect -> refuse if installed
2. Copy all `gobbi-*` skill directories (entire dirs) -> `.claude/skills/`
3. Copy agent definitions -> `.claude/agents/`
4. Copy `GOBBI.md` -> `.claude/`
5. CLAUDE.md: Create with trigger if absent, prepend if exists
6. Project dir: Ask for project name (skippable). If provided, create `.claude/project/{name}/` with subdirs
7. Core hooks: Always install reload-gobbi.sh + PostCompact entry in settings.json
8. Notification hooks: Interactive group selection. Scripts to `.claude/hooks/`, entries to `settings.local.json`
9. No permission management. Document required permissions.
10. Support `--yes` flag

### `npx gobbi update`
1. Detect -> refuse if not installed
2. Replace ALL files in every `gobbi-*` dir. Exception: gobbi-hack/ preserved.
3. Replace agent definitions, GOBBI.md
4. Verify CLAUDE.md trigger
5. Replace core hook scripts. Re-merge settings.json hook entries.
6. Preserve notification hooks and settings.local.json entries.
7. Offer new hooks interactively.
8. Preserve `.claude/project/`

### Hook Ownership
- Core (reload-gobbi.sh): settings.json, always installed, replaced on update
- Notification (notify-*.sh): settings.local.json, interactive, preserved on update

### Package Structure
```
gobbi/
├── package.json
├── bin/gobbi.js
├── src/commands/{init,update}.js
├── src/lib/{detect,settings,claude-md,hooks}.js
└── templates/{skills/gobbi-*/, agents/, hooks/, GOBBI.md}
```
