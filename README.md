# gobbi

> 고삐 (gobbi) — Korean for reins, the essential equipment for handling a horse.

An installable harness for Claude Code.

## What is gobbi

Gobbi orchestrates Claude Code's workflow — discussion, planning, execution, evaluation — so you just talk and gobbi handles routing. It detects intent, decides the right workflow for the task, and delegates to specialist agents automatically.

Installation adds 17 skill directories, 5 specialist agents, hook scripts, and project structure to your `.claude/` directory.

## Quick Start

```bash
npx gobbi init
```

This installs skills, agents, hooks, and adds the CLAUDE.md trigger that activates gobbi at session start.

For CI or automation:

```bash
npx gobbi init --non-interactive
```

This skips all prompts and installs core components only (no notification hooks, no project directory).

## Git Manual Install

If you want to understand what you're installing before it lands in your project:

1. Clone the repo:
   ```bash
   git clone https://github.com/playinganalytics/gobbi.git
   cd gobbi
   ```

2. Copy skills (both `gobbi` and `gobbi-*`):
   ```bash
   cp -r .claude/skills/gobbi .claude/skills/gobbi-* your-project/.claude/skills/
   ```

3. Copy agents:
   ```bash
   cp .claude/agents/gobbi-* your-project/.claude/agents/
   ```

4. Copy hooks:
   ```bash
   cp .claude/hooks/* your-project/.claude/hooks/
   ```

5. Copy GOBBI.md:
   ```bash
   cp .claude/GOBBI.md your-project/.claude/
   ```

6. Add the trigger to your project's CLAUDE.md:
   ```
   MUST load this at session start, resume, and compaction. MUST reload skills /gobbi
   ```

7. Configure hooks in `.claude/settings.json`:
   ```json
   {
     "hooks": {
       "PostCompact": [
         {
           "matcher": "manual|auto",
           "hooks": [{
             "type": "command",
             "command": "bash $CLAUDE_PROJECT_DIR/.claude/hooks/reload-gobbi.sh",
             "timeout": 5
           }]
         }
       ],
       "SessionStart": [
         {
           "matcher": "startup|resume|compact",
           "hooks": [{
             "type": "command",
             "command": "bash $CLAUDE_PROJECT_DIR/.claude/hooks/session-metadata.sh",
             "timeout": 5
           }]
         }
       ]
     }
   }
   ```

## Commands

### `npx gobbi init`

Installs gobbi into the current project.

- Detects existing installations and redirects to `update`
- Interactive mode asks about notification hooks and project name
- `--non-interactive` skips all prompts, installs core only

### `npx gobbi update`

Updates gobbi to the latest version.

- Replaces all skill files, agent definitions, GOBBI.md, and core hooks
- Preserves `gobbi-hack/` (user customizations), `.claude/project/` (project state), and notification hooks
- Offers to install any new hooks added since last update
- `--non-interactive` skips prompts for new hooks

## Hooks

### Core hooks (always installed)

| Script | Event | Purpose |
|--------|-------|---------|
| `reload-gobbi.sh` | PostCompact | Reloads gobbi skills after context compaction |
| `session-metadata.sh` | SessionStart | Injects session metadata on startup and resume |

### Notification hooks (optional)

Installed interactively during `init`. Supports Slack, Telegram, and desktop notifications.

| Script | Event | Purpose |
|--------|-------|---------|
| `notify-completion.sh` | Stop | Task completed |
| `notify-attention.sh` | Notification | Waiting for user input (permissions, prompts) |
| `notify-error.sh` | StopFailure | Rate limit, auth failure, billing, server error |
| `notify-subagent.sh` | SubagentStop | Subagent finished |
| `notify-session.sh` | SessionStart / SessionEnd | Session started, resumed, or ended |

## Required Permissions

After installation, add these to `.claude/settings.local.json` to auto-approve gobbi skill loading:

```json
{
  "permissions": {
    "allow": [
      "Skill(gobbi)",
      "Skill(gobbi-orchestration)",
      "Skill(gobbi-gotcha)",
      "Skill(gobbi-claude)",
      "Skill(gobbi-discuss)",
      "Skill(gobbi-ideation)",
      "Skill(gobbi-ideation-evaluation)",
      "Skill(gobbi-plan)",
      "Skill(gobbi-plan-evaluation)",
      "Skill(gobbi-delegation)",
      "Skill(gobbi-execution)",
      "Skill(gobbi-execution-evaluation)",
      "Skill(gobbi-evaluation)",
      "Skill(gobbi-note)",
      "Skill(gobbi-collection)",
      "Skill(gobbi-notification)",
      "Skill(gobbi-hack)",
      "WebSearch"
    ]
  }
}
```

## Development

Rebuild templates from `.claude/` source:

```bash
bash scripts/build-templates.sh
```

Publish to npm (runs `build-templates.sh` automatically via `prepublishOnly`):

```bash
npm publish
```

## License

MIT
