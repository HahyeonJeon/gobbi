# Plan: Gobbi Installation System

## Context

Gobbi is a Claude Code harness (18 skill directories, 5 agents, 8 hooks, ~183 KB of markdown + shell scripts) with no installation mechanism. Users currently cannot install gobbi into their projects. This plan builds an npm package (`gobbi`) with `npx gobbi init` and `npx gobbi update` commands, plus a documented git manual install path.

Key design decisions from ideation:
- CLAUDE.md gets only a trigger line, not marker-bounded sections
- All gobbi skill files are gobbi-owned, fully replaced on update (except gobbi-hack/)
- Core hooks (reload-gobbi.sh, session-metadata.sh) → settings.json (committed, always installed, replaced on update)
- Notification hooks → settings.local.json (local, interactive selection, preserved on update)
- No permission management — document required permissions only
- Project dir: ask for project name (skippable), create structure if provided
- Zero npm dependencies — use Node.js built-ins (util.parseArgs, readline, fs.cp)
- Target Node.js >= 18
- CLI flag: `--non-interactive` (skip all prompts, use safe defaults)

## Package Structure

The npm package source lives at the repo root alongside `.claude/`:

```
gobbi/                          (repo root)
├── package.json
├── bin/gobbi.js                CLI entry point (shebang + dispatch)
├── src/
│   ├── cli.js                  Command parser (util.parseArgs)
│   ├── commands/
│   │   ├── init.js             Init flow
│   │   └── update.js           Update flow
│   └── lib/
│       ├── detect.js           Installation detection
│       ├── files.js            File/directory copy operations
│       ├── claude-md.js        CLAUDE.md trigger line management
│       ├── settings.js         settings.json hook config merge
│       ├── hooks.js            Hook group selection + installation
│       └── project.js          Project dir initialization
├── scripts/
│   └── build-templates.sh      Copies .claude/ → templates/ for publish
├── templates/                  (build artifact, .gitignored)
├── .claude/                    (gobbi development, NOT published)
└── README.md
```

The `templates/` directory is a build artifact populated by `scripts/build-templates.sh` from `.claude/` before npm publish. This avoids file duplication — `.claude/` is the single source of truth.

## Tasks

### Wave 1 — Foundation (parallel)

**Task 1: Package scaffolding + build system**

- Agent: general-purpose
- Skills: gobbi-execution, gobbi-gotcha
- Deliverable: package.json, bin/gobbi.js, src/cli.js, scripts/build-templates.sh, .gitignore update
- Files modified:
  - `package.json` (new) — name: gobbi, version: 0.1.0, type: module, bin: ./bin/gobbi.js, engines: >=18, files: [bin, src, templates], prepublishOnly: scripts/build-templates.sh
  - `bin/gobbi.js` (new) — shebang + import src/cli.js
  - `src/cli.js` (new) — parse command (init/update) using util.parseArgs, handle --non-interactive flag, dispatch to command modules, show usage/help on unknown
  - `scripts/build-templates.sh` (new) — copy .claude/skills/gobbi → templates/skills/gobbi (entry-point skill, no hyphen), .claude/skills/gobbi-* → templates/skills/, .claude/agents/gobbi-* → templates/agents/, .claude/hooks/ → templates/hooks/, .claude/GOBBI.md → templates/GOBBI.md, .claude/settings.json → templates/settings.json
  - `.gitignore` (new) — templates/, node_modules/
- Scope boundary: Do NOT write command implementations or lib modules. Only the dispatch skeleton.
- Verification: `node bin/gobbi.js` shows usage. `node bin/gobbi.js init --non-interactive` dispatches (can log "init called" stub). `bash scripts/build-templates.sh` populates templates/ including templates/skills/gobbi/ (entry-point).

**Task 2: Library modules**

- Agent: general-purpose
- Skills: gobbi-execution, gobbi-gotcha
- Deliverable: All src/lib/ modules
- Dependencies: None (Wave 1 parallel)
- Files modified:
  - `src/lib/detect.js` (new) — `isInstalled(targetDir)` → checks `{targetDir}/.claude/skills/gobbi/SKILL.md` existence. Returns boolean.
  - `src/lib/files.js` (new) — `copySkills(templatesDir, targetDir)` copies the `gobbi` entry-point dir AND all `gobbi-*` dirs from templates/skills/ to targetDir/.claude/skills/ using fs.cp recursive. Must handle both `gobbi` (no hyphen) and `gobbi-*` (with hyphen). `copyAgents(templatesDir, targetDir)` copies templates/agents/gobbi-* to targetDir/.claude/agents/. `copyGobbiMd(templatesDir, targetDir)` copies templates/GOBBI.md to targetDir/.claude/GOBBI.md. All functions create parent dirs if needed (fs.mkdir recursive).
  - `src/lib/claude-md.js` (new) — `ensureTriggerLine(targetDir)`. Trigger line: `MUST load this at session start, resume, and compaction. MUST reload skills /gobbi`. If .claude/CLAUDE.md doesn't exist, create with `# CLAUDE.md\n\n{trigger}\n`. If exists, check if the substring `MUST reload skills /gobbi` is already present anywhere in the file (resilient to minor wording differences). If not found, prepend trigger line before existing content.
  - `src/lib/settings.js` (new) — `mergeHookConfig(targetDir, hookEntries)`. Reads targetDir/.claude/settings.json (or starts with {}). For each hook entry {event, config}, adds config to hooks[event] array. Avoids duplicates by checking if a hook with the same command string already exists. Writes back with JSON.stringify(obj, null, 2).
  - `src/lib/hooks.js` (new) — Defines two hook groups:
    **CORE group** (always installed, settings.json):
    - `reload-gobbi.sh` → PostCompact, matcher: "manual|auto", timeout: 5
    - `session-metadata.sh` → SessionStart, matcher: "startup|resume|compact", timeout: 5
    **NOTIFICATION group** (interactive, settings.local.json):
    - `load-notification-env.sh` → SessionStart, matcher: "startup|resume", timeout: 5 (env loader, required for all notifications)
    - `notify-send.sh` → no settings entry (shared sender utility, called by other scripts)
    - `notify-completion.sh` → Stop, no matcher, timeout: 10, async: true
    - `notify-attention.sh` → Notification, matcher: "permission_prompt|idle_prompt|elicitation_dialog", timeout: 5, async: true
    - `notify-error.sh` → StopFailure, matcher: "rate_limit|authentication_failed|billing_error|server_error", timeout: 5, async: true
    - `notify-subagent.sh` → SubagentStop, no matcher, timeout: 5, async: true
    - `notify-session.sh` → SessionStart (matcher: "startup|resume") AND SessionEnd (matcher: "logout|prompt_input_exit"), timeout: 5, async: true
    `installCoreHooks(templatesDir, targetDir)` copies both core scripts, merges their entries into settings.json.
    `promptNotificationHooks(templatesDir, targetDir, nonInteractive)` uses readline to ask yes/no (skip if nonInteractive — do NOT install notifications when non-interactive), copies all notification scripts as a group, merges all notification hook entries into settings.local.json. Sets executable permission (chmod +x via fs.chmod).
  - `src/lib/project.js` (new) — `initProjectDir(targetDir, nonInteractive)`. Uses readline to ask for project name. If non-interactive, skip project dir creation entirely (safer default — gobbi creates on first use). If user provides a name, creates `.claude/project/{name}/` with subdirs: gotchas/, rules/, reference/, docs/, design/, note/. If user skips (empty input), does nothing.
- Scope boundary: Pure utility functions. No command orchestration. No CLI concerns. Export named functions only.
- Verification: Each module can be imported without errors. Functions have correct signatures. File operations use fs/promises consistently. All paths use path.join for cross-platform safety.

### Wave 2 — Commands (parallel, depends on Wave 1)

**Task 3: Init command**

- Agent: general-purpose
- Skills: gobbi-execution, gobbi-gotcha
- Deliverable: src/commands/init.js
- Dependencies: Task 1 (cli.js), Task 2 (all lib modules)
- Files modified:
  - `src/commands/init.js` (new) — `runInit(targetDir, options)` where options = { nonInteractive: boolean }. Flow:
    1. Check detect.isInstalled(targetDir) → if true, print "Gobbi is already installed. Run `npx gobbi update` to update." and exit(1)
    2. Print "Installing gobbi..."
    3. Call files.copySkills → print progress (copies gobbi/ entry-point + all gobbi-* dirs)
    4. Call files.copyAgents → print progress
    5. Call files.copyGobbiMd → print progress
    6. Call claudeMd.ensureTriggerLine → print progress
    7. Call hooks.installCoreHooks → print "Installed core hooks: reload-gobbi.sh, session-metadata.sh"
    8. Call hooks.promptNotificationHooks(nonInteractive) → interactive or skip
    9. Call project.initProjectDir(nonInteractive) → interactive or skip
    10. Print summary: "Gobbi installed successfully!" with next steps (configure permissions, start claude)
- Scope boundary: Orchestration only. No file operations directly — delegate to lib modules.
- Verification: Running `node bin/gobbi.js init` in a test directory creates the expected .claude/ structure. Running again shows "already installed" message.

**Task 4: Update command**

- Agent: general-purpose
- Skills: gobbi-execution, gobbi-gotcha
- Deliverable: src/commands/update.js
- Dependencies: Task 1 (cli.js), Task 2 (all lib modules)
- Files modified:
  - `src/commands/update.js` (new) — `runUpdate(targetDir, options)` where options = { nonInteractive: boolean }. Flow:
    1. Check detect.isInstalled(targetDir) → if false, print "Gobbi is not installed. Run `npx gobbi init` first." and exit(1)
    2. Print "Updating gobbi..."
    3. Replace gobbi/ entry-point skill dir: remove existing, copy fresh
    4. For each gobbi-* dir in templates/skills/ EXCEPT gobbi-hack: remove existing dir (fs.rm recursive), then copy fresh (fs.cp recursive). Print per-skill progress.
    5. Preserve gobbi-hack/: skip entirely during copy
    6. Replace agent definitions: remove existing gobbi-* agents, copy fresh
    7. Replace GOBBI.md
    8. Verify CLAUDE.md trigger line (add if missing)
    9. Replace core hook scripts (reload-gobbi.sh, session-metadata.sh), re-merge settings.json entries for PostCompact and SessionStart
    10. Preserve notification hook scripts and settings.local.json entries
    11. Check if templates/ has new hook scripts not present in target — offer interactively (skip if nonInteractive)
    12. Print summary: "Gobbi updated successfully!"
- Scope boundary: Orchestration only. Use lib modules. Do NOT touch .claude/project/.
- Verification: After init, modifying a skill file and running update restores the original. gobbi-hack/ content survives. .claude/project/ content survives.

### Wave 3 — Documentation (depends on Wave 2)

**Task 5: README**

- Agent: general-purpose
- Skills: gobbi-execution, gobbi-gotcha
- Deliverable: README.md (rewrite)
- Dependencies: Task 3, Task 4
- Files modified:
  - `README.md` (rewrite) — Sections: What is gobbi, Quick start (npx gobbi init), Git manual install, Commands (init, update with flags), Hooks, Required permissions (list all Skill() permissions users need to add), Development, License
- Scope boundary: Documentation only. No code changes.
- Verification: README accurately describes the CLI behavior as implemented.

## Execution Order

```
Wave 1:  [Task 1: scaffolding] ── [Task 2: lib modules]     (parallel)
Wave 2:  [Task 3: init cmd] ── [Task 4: update cmd]          (parallel, after Wave 1)
Wave 3:  [Task 5: README]                                     (after Wave 2)
```

## Expected Outcome

A working npm package where:
- `npx gobbi init` installs all gobbi files into a project
- `npx gobbi update` updates core files while preserving user state
- `scripts/build-templates.sh` syncs .claude/ → templates/ for publish
- README documents both npm and git install paths

## Verification

After all tasks complete:
1. Run `bash scripts/build-templates.sh` to populate templates/
2. Create a test directory, run `node bin/gobbi.js init` — verify all files installed
3. Run `node bin/gobbi.js init` again — verify "already installed" message
4. Modify a skill file in the test dir, run `node bin/gobbi.js update` — verify restored
5. Add a file to gobbi-hack/ in the test dir, run update — verify preserved
6. Add a file to .claude/project/ in the test dir, run update — verify preserved

## Collection Plan

Work docs go to `.claude/project/gobbi/note/20260328-0951-installation-system/`:
- `plan.md` — this plan
- `execution.md` — delegation outcomes
- `subtasks/01-scaffolding.md` through `subtasks/05-readme.md` — per-task results
