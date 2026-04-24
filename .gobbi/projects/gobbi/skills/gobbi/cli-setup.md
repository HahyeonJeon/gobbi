# CLI Setup

> Status: v0.5.0 stable — updated 2026-04-19

Check gobbi CLI availability at session start. If `gobbi --version` succeeds, proceed. If not, use this doc to install.

---

## Core Principle

> **Gobbi CLI must be available before the workflow can proceed.**

The gobbi CLI (`gobbi` command) powers workflow initialization, session management, config management, and validation. Without it, hooks fail silently and `gobbi workflow init` cannot run. Check availability at the start of every session before asking setup questions.

---

## Detection

Run `gobbi --version` at session start. Three outcomes:

| Outcome | Meaning | Action |
|---|---|---|
| Version prints (e.g., `0.5.0`) | CLI is installed and in PATH | Proceed to setup questions |
| Command outputs version via `bun packages/cli/bin/gobbi.js --version` | CLI is available locally but not installed globally | Usable for development — proceed, but suggest global install for convenience |
| Command not found | CLI is not installed | Help the user install before proceeding |

---

## Installation

There are three ways to install the gobbi CLI, depending on the user's setup:

### Option 1: npm global install (Recommended)

Install globally via npm so `gobbi` is available in all terminals. npm is the registry; Bun is the runtime. Installing via npm handles both:

`npm install -g @gobbitools/cli`

Verify: `gobbi --version`

This is the recommended approach for users who want `gobbi` available across all projects.

### Option 2: Claude Code plugin install

If using the gobbi plugin for Claude Code, install via the plugin system:

`/plugin install gobbi`

The plugin registers the CLI and the five v0.5.0 workflow hook entries (`gobbi workflow init`, `gobbi workflow guard`, `gobbi workflow capture-subagent`, `gobbi workflow capture-plan`, `gobbi workflow stop`) automatically.

Verify: `gobbi --version`

### Option 3: Local execution (development)

Run directly from the gobbi project root when working on the gobbi repository itself:

`bun packages/cli/bin/gobbi.js <command>`

This works without any installation but requires being in the gobbi project root. Hooks in `settings.json` use the bare `gobbi` command, so this option only works for manual CLI usage — hooks will fail without a global install.

---

## Prerequisites

- **Bun >= 1.2.0** — the v0.5.0 CLI runs on Bun, not Node.js. Check with `bun --version`. Install from `bun.sh` if missing.
- **npm** — for Option 1 global install. Bundled with Node.js or available standalone.

The `@gobbitools/cli` package is published to npm but the runtime is Bun. This means `npm install -g @gobbitools/cli` handles distribution while Bun executes the commands.

---

## What the CLI Provides

The gobbi CLI manages workflow state, session configuration, notes, and validation. Key commands:

| Command | Purpose |
|---|---|
| `gobbi workflow init` | Initialize a session directory under `.gobbi/sessions/{id}/`, write `metadata.json`, open `gobbi.db`, emit the first `workflow.start` event |
| `gobbi workflow guard` | Evaluate guard predicates against current workflow state before each tool call |
| `gobbi workflow capture-subagent` | Record subagent completion — called by the SubagentStop hook |
| `gobbi workflow capture-plan` | Record the current plan when ExitPlanMode fires |
| `gobbi workflow stop` | Write the final session event and flush state on Stop |
| `gobbi workflow status` | Show current workflow state for the active session |
| `gobbi workflow resume` | Resume an interrupted session, replaying events from `gobbi.db` |
| `gobbi config set <key> <value> [--level workspace|project|session] [--session-id <id>]` | Write a setting to the target level's `settings.json` |
| `gobbi config get <key> [--level workspace|project|session] [--session-id <id>]` | Read a setting from the cascade or a specific level |
| `gobbi notify send` | Send a notification (used inline by `gobbi workflow init` when channels are configured) |
| `gobbi validate <type> <path>` | Validate agent, skill, or gotcha definitions |

---

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| `gobbi: command not found` | Not installed globally | Run `npm install -g @gobbitools/cli` |
| `bun: command not found` | Bun not installed | Install from `bun.sh` |
| `gobbi workflow init` fails | CLI version mismatch or settings cascade error | Verify `gobbi --version` is `0.5.0`; reinstall if stale |
| Hooks fail silently | `gobbi` not in PATH when hooks execute | Ensure global install — hooks run in a shell that may not have local `node_modules/.bin` in PATH |
