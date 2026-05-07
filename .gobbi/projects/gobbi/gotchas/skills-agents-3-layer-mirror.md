# Skills and Agents Have 3 Mirror Layers — All Must Be Updated on Rename

**Priority:** High

**What happened:** When renaming skill directories and agent files, only the source layer (`.gobbi/projects/gobbi/skills/` and `.gobbi/projects/gobbi/agents/`) was considered. The mirror architecture actually has 3 layers:

1. **Source** — `.gobbi/projects/gobbi/skills/<name>/` and `.gobbi/projects/gobbi/agents/<name>.md`
2. **Claude Code mirror** — `.claude/skills/<name>/` (symlink dirs) and `.claude/agents/<name>.md` (symlinks)
3. **Plugin mirror** — `plugins/gobbi/skills/<name>` (dir symlinks) and `plugins/gobbi/agents/<name>.md` (symlinks)

Each symlink in layers 2 and 3 has a filename AND a target path. Both must be updated when renaming. Using `git mv` on the symlink files updates the filename, but the target path (stored inside the symlink) still points to the old location and must be explicitly retargeted with `rm` + `ln -s` + `git add`.

**Correct approach:** For any rename of skills or agents:
1. `git mv` the source files (layer 1)
2. `git mv` the mirror dirs/files (layers 2 and 3) — updates the symlink filenames
3. For every symlink whose target now points to an old path: `rm <symlink>; ln -s <new-target> <symlink>; git add <symlink>`
4. Verify with `find ... -xtype l` (dangling symlinks) — must return empty
