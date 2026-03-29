<h1 align="center">gobbi</h1>
<p align="center">An installable harness for Claude Code</p>
<p align="center"><sub>고삐 (gobbi) — Korean for reins, the essential equipment for handling a horse</sub></p>

<p align="center">
  <a href="https://www.npmjs.com/package/claude-gobbi"><img src="https://img.shields.io/npm/v/claude-gobbi" alt="npm version"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/HahyeonJeon/gobbi" alt="License: MIT"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/node/v/claude-gobbi" alt="Node version"></a>
</p>

---

## What is gobbi

Gobbi orchestrates Claude Code's workflow — discussion, planning, execution, evaluation — so you just talk and gobbi handles routing. It detects intent, decides the right workflow for the task, and delegates to specialist agents automatically.

## Features

- **17 workflow skills** — ideation, planning, execution, evaluation, and more
- **5 specialist agents** — developer, planner, evaluators, explorer
- **Hook scripts** for session management and notifications (Slack, Telegram, desktop)
- **Hack system** for user customizations that survive updates
- **Automatic intent detection** and workflow routing

## Quick Start

```bash
npx gobbi init
```

This installs skills, agents, hooks, and adds the CLAUDE.md trigger that activates gobbi at session start.

For CI or automation:

```bash
npx gobbi init --non-interactive
```

This skips all prompts and installs all components without interactive project directory setup.

## Commands

### `npx gobbi init`

Installs gobbi into the current project.

- Detects existing installations and redirects to `update`
- Interactive mode asks about project name
- `--non-interactive` skips all prompts

### `npx gobbi update`

Updates gobbi to the latest version.

- Replaces all skill files, agent definitions, GOBBI.md, core hooks, and notification hooks
- Preserves `gobbi-hack/` (user customizations) and `.claude/project/` (project state)

## Manual Install

If you want to understand what you're installing before it lands in your project:

1. Clone the repo:
   ```bash
   git clone https://github.com/HahyeonJeon/gobbi.git
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

## Hooks

### Core hooks (always installed)

| Script | Event | Purpose |
|--------|-------|---------|
| `session-metadata.sh` | SessionStart | Injects session metadata on startup and resume |

### Notification hooks (always installed)

Supports Slack, Telegram, and desktop notifications. Run `/gobbi-notification` in Claude Code to configure notification credentials (Slack, Telegram, desktop).

| Script | Event | Purpose |
|--------|-------|---------|
| `notify-completion.sh` | Stop | Task completed |
| `notify-attention.sh` | Notification | Waiting for user input (permissions, prompts) |
| `notify-error.sh` | StopFailure | Rate limit, auth failure, billing, server error |
| `notify-subagent.sh` | SubagentStop | Subagent finished |
| `notify-session.sh` | SessionStart / SessionEnd | Session started, resumed, or ended |

## Permissions

Skill permissions are auto-configured in `.claude/settings.json` during `init` and `update`. No manual setup needed.

For manual installations, add the following to `.claude/settings.json` alongside the hooks config:

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
      "Skill(gobbi-note:*)",
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

[MIT](./LICENSE)
