<h1 align="center">gobbi</h1>
<p align="center">Open-source ClaudeX tool for Claude Code</p>
<p align="center"><sub>고삐 (gobbi) — Korean for reins, the essential equipment for handling a horse</sub></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gobbi/core"><img src="https://img.shields.io/npm/v/@gobbi/core" alt="npm version"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/HahyeonJeon/gobbi" alt="License: MIT"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/node/v/@gobbi/core" alt="Node version"></a>
</p>

---

## What is ClaudeX

ClaudeX (Claude Experience) is the ecosystem of tools, skills, agents, workflows, and plugins that change how humans work with Claude Code — the same way UX optimizes interfaces and DX optimizes developer tooling. It is infrastructure for human-AI collaboration, not a product or a platform.

Gobbi is an open-source ClaudeX tool.

---

## What gobbi does

**Just talk, gobbi handles the rest** — No commands to learn. Gobbi detects intent and routes to the right workflow automatically. Trivial tasks get a direct path. Complex tasks get ideation, planning, and multi-stance evaluation. The sophistication stays inside the system.

**Quality through structured evaluation** — Multi-stance evaluation (positive, moderate, critical) catches problems before they propagate. Every significant decision gets challenged from three angles before execution proceeds.

**Claude docs managed, not scattered** — Skills, agents, and hooks organized with source-of-truth separation. The `.gobbi/` directory is the authoritative source; `.claude/` is generated output. Install from the marketplace or create your own.

**Domain expertise built in** — Domain-specific skills (Python, TypeScript, data engineering) bring specialized knowledge to your sessions without requiring you to explain the domain each time.

**CLI tools for improvement** — Evaluate your Claude Code setup, benchmark skills, identify gaps. The feedback loops that let you measure and improve your ClaudeX quality over time.

---

## Quick Start

In Claude Code:

```
/plugin install gobbi
```

Then run `/gobbi` to begin.

### CLI Install

```bash
npx @gobbi/cli install
```

This creates the `.gobbi/` directory with gobbi's skill and agent definitions, then syncs everything to `.claude/` where Claude Code reads them.

---

## Commands

| Command | Purpose |
|---------|---------|
| `npx @gobbi/cli install` | Install gobbi into the current project |
| `npx @gobbi/cli update` | Update gobbi core to the latest version |
| `npx @gobbi/cli create` | Create a new skill, agent, or hook (interactive wizard) |
| `npx @gobbi/cli sync` | Manually sync `.gobbi/` to `.claude/` |

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

### `.gobbi/` — source of truth (commit to git)

```
.gobbi/
  core/       # gobbi's built-in skills, agents, hooks
  market/     # installed marketplace packages
  user/       # your custom skills, agents, hooks
  gobbi.json  # manifest tracking versions and packages
```

### `.claude/` — generated output (add to .gitignore)

```
.claude/
  skills/     # populated by gobbi sync
  agents/     # populated by gobbi sync
  hooks/      # populated by gobbi sync
  CLAUDE.md   # populated by gobbi sync
```

`gobbi sync` reads from `.gobbi/` and writes to `.claude/`. Claude Code reads from `.claude/`. You edit in `.gobbi/`, never in `.claude/` directly.

---

## Migration from v0.2.0

```bash
npx @gobbi/cli install
```

Automatically detects existing `.claude/` gobbi files, migrates them to `.gobbi/`, and syncs back. No manual intervention needed.

---

## Creating Your Own Docs

```bash
npx @gobbi/cli create
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
