# Skills and Agents Have 4 Layers — All Must Be Updated on Rename

**Priority:** High

**What happened:** When renaming skill directories and agent files, only the source layer (`.gobbi/projects/gobbi/skills/` and `.gobbi/projects/gobbi/agents/`) was considered. The architecture actually has 4 layers that all need updating:

1. **Source** — `.gobbi/projects/gobbi/skills/<name>/` and `.gobbi/projects/gobbi/agents/<name>.md`
2. **Claude Code mirror** — `.claude/skills/<name>/` (symlink dirs) and `.claude/agents/<name>.md` (symlinks)
3. **Plugin mirror** — `plugins/gobbi/skills/<name>` (dir symlinks) and `plugins/gobbi/agents/<name>.md` (symlinks)
4. **Runtime layer** — TypeScript source, spec.json files, settings.json permissions, and inline references in skill/agent body docs

Each symlink in layers 2 and 3 has a filename AND a target path. Both must be updated when renaming. Using `git mv` on the symlink files updates the filename, but the target path (stored inside the symlink) still points to the old location and must be explicitly retargeted with `rm` + `ln -s` + `git add`.

Layer 4 is the "invisible" layer that evaluation catches after the fact. It includes:
- `packages/cli/src/specs/*/spec.json` — `requiredSkills`, `optionalSkills`, `allowedAgentTypes` arrays
- `packages/cli/src/specs/skills.ts` — the `SkillName` union and `SKILL_NAMES` array
- `packages/cli/src/workflow/predicates.ts` — agentType string literals
- `.claude/settings.json` — the `permissions.allow` array entries like `Skill(old-name)` and `Agent(old-name)`
- All `SKILL.md` and child doc bodies that reference other skills by name (e.g., "load `gotcha` before starting")
- Test fixtures that use old string literals for agentType, allowedAgentTypes, skill IDs

**Correct approach:** For any rename of skills or agents:
1. `git mv` the source files (layer 1)
2. `git mv` the mirror dirs/files (layers 2 and 3) — updates the symlink filenames
3. For every symlink whose target now points to an old path: `rm <symlink>; ln -s <new-target> <symlink>; git add <symlink>`
4. Verify with `find ... -xtype l` (dangling symlinks) — must return empty
5. Update all layer 4 runtime references: `grep -rE 'old-name' packages/ .claude/ .gobbi/projects/gobbi/` — must return zero hits in live-instruction files
6. Regenerate stale snapshots: `bun test --update-snapshots` for overlay.test.ts and any compile snapshot tests
7. Run `bun test` — all tests must pass before the rename is considered complete
