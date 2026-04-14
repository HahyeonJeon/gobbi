# CLI Setup



---

## Core Principle

> **Gobbi CLI must be available before the workflow can proceed.**

The gobbi CLI (`gobbi` command) powers note initialization, subtask collection, config management, and validation. Without it, hooks fail silently and notes can't be initialized. Check availability at the start of every session before asking setup questions.

---

## Detection

Run `gobbi --version` at session start. Three outcomes:

| Outcome | Meaning | Action |
|---|---|---|
| Version prints (e.g., `0.4.0`) | CLI is installed and in PATH | Proceed to setup questions |
| Command outputs version via `node packages/cli/bin/gobbi.js --version` | CLI is available locally but not installed globally | Usable for development — proceed, but suggest global install for convenience |
| Command not found | CLI is not installed | Help the user install before proceeding |

---

## Installation

There are three ways to install the gobbi CLI, depending on the user's setup:

### Option 1: npm global install (Recommended)

Install globally so `gobbi` is available in all terminals:

```
npm install -g @gobbi/cli
```

Verify: `gobbi --version`

This is the recommended approach for users who want `gobbi` available across all projects.

### Option 2: npm link (for development)

If working on the gobbi repository itself, link the local builds:

```
npm link --workspace=packages/cli
npm link --workspace=packages/media
```

This creates global symlinks to the local bin scripts. Changes to the source are immediately available after `npm run build`.

Verify: `gobbi --version`

### Option 3: Local execution (no install)

Run directly from the project:

```
node packages/cli/bin/gobbi.js <command>
```

This works without any installation but requires being in the gobbi project root. Hooks in `settings.json` use the bare `gobbi` command, so this option only works for manual CLI usage — hooks will fail without a global install or link.

---

## Prerequisites

- **Node.js >= 18** — required for the TypeScript CLI. Check with `node --version`.
- **npm** — for installing the package. Bundled with Node.js.
- **TypeScript build** — if using npm link, run `npm run build` first to compile TypeScript to `dist/`.

---

## What the CLI Provides

The gobbi CLI replaces the shell scripts that were previously in `.claude/skills/_note/scripts/` and `.claude/hooks/`. Key commands:

| Command | Purpose |
|---|---|
| `gobbi note init <project> <slug>` | Initialize a note directory with per-step subdirectories |
| `gobbi note collect <agent-id> <num> <slug> <dir> [--phase]` | Extract subagent results from JSONL transcripts |
| `gobbi config set <session> <key> <value>` | Set session configuration in gobbi.json |
| `gobbi config get <session> [key]` | Read session configuration |
| `gobbi session metadata` | Output session metadata (used by SessionStart hook) |
| `gobbi notify <event>` | Send notifications (used by hooks) |
| `gobbi validate <type> <path>` | Validate agent, skill, or gotcha definitions |

---

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| `gobbi: command not found` | Not installed globally or not linked | Run `npm install -g @gobbi/cli` or `npm link` in the gobbi directory |
| `gobbi note init` fails with CLAUDE_SESSION_ID not set | SessionStart hook didn't run | Check `.claude/settings.json` hooks — the `gobbi session metadata` hook must fire on startup |
| Hooks fail silently | `gobbi` not in PATH when hooks execute | Ensure global install or link — hooks run in a shell that may not have local node_modules/.bin in PATH |
