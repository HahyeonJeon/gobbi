# gobbi

Workflow harness and claude docs management for Claude Code.

<sub>gobbi (고삐) — Korean for reins, the essential equipment for handling a horse.</sub>

---

## What is gobbi

Gobbi is dual-purpose: **workflow orchestration** and **claude docs management** for Claude Code.

**Workflow orchestration** -- gobbi routes your conversations through a structured cycle: ideate, plan, execute, evaluate. You just talk. Gobbi detects intent, picks the right workflow, and delegates to specialist agents automatically. Trivial tasks skip planning. Complex tasks get ideation and multi-stance evaluation. The workflow adapts to the task.

**Claude docs management** -- gobbi manages the skills, agents, hooks, and rules that Claude Code reads from `.claude/`. The `.gobbi/` directory is the source of truth where core, marketplace, and user-authored docs live. `gobbi sync` compiles them into `.claude/` where Claude Code picks them up.

---

## Quick Start

```bash
npx @gobbi/core install
```

This creates the `.gobbi/` directory with gobbi's skill and agent definitions, then syncs everything to `.claude/` where Claude Code reads them.

Start Claude Code and run `/gobbi` to begin.

---

## Commands

| Command | Purpose |
|---------|---------|
| `npx @gobbi/core install` | Install gobbi into the current project |
| `npx @gobbi/core update` | Update gobbi core to the latest version |
| `npx @gobbi/core create` | Create a new skill, agent, or hook (interactive wizard) |
| `npx @gobbi/core sync` | Manually sync `.gobbi/` to `.claude/` |

---

## Marketplace

Install community packages from the gobbi marketplace.

```bash
npx @gobbi/market install @gobbi/skill-example
npx @gobbi/market search <query>
npx @gobbi/market list
npx @gobbi/market uninstall @gobbi/skill-example
```

---

## Directory Structure

Gobbi separates source (`.gobbi/`) from output (`.claude/`).

### `.gobbi/` -- source of truth (commit to git)

```
.gobbi/
  core/       # gobbi's built-in skills, agents, hooks
  market/     # installed marketplace packages
  user/       # your custom skills, agents, hooks
  gobbi.json  # manifest tracking versions and packages
```

### `.claude/` -- generated output (add to .gitignore)

```
.claude/
  skills/     # populated by gobbi sync
  agents/     # populated by gobbi sync
  hooks/      # populated by gobbi sync
  CLAUDE.md   # populated by gobbi sync
```

`gobbi sync` reads from `.gobbi/` and writes to `.claude/`. Claude Code reads from `.claude/`. You edit in `.gobbi/`, never in `.claude/` directly.

---

## Migration from v0.1.0

```bash
npx @gobbi/core install
```

Automatically detects existing `.claude/` gobbi files, migrates them to `.gobbi/`, and syncs back. No manual intervention needed.

---

## Creating Your Own Docs

```bash
npx @gobbi/core create
```

Interactive wizard guides you through creating skills, agents, or hooks. Files are created in `.gobbi/user/` and synced to `.claude/`.

---

## Development

Build:

```bash
npm run build
```

Publish (auto-builds templates):

```bash
npm publish
```

---

## License

[MIT](./LICENSE)
