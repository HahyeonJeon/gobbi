<h1 align="center">gobbi</h1>
<p align="center">Open-source ClaudeX tool for Claude Code</p>
<p align="center"><sub>고삐 (gobbi) — Korean for reins, the essential equipment for handling a horse</sub></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gobbi/cli"><img src="https://img.shields.io/npm/v/@gobbi/cli" alt="npm version"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/HahyeonJeon/gobbi" alt="License: MIT"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/node/v/@gobbi/cli" alt="Node version"></a>
</p>

---

## What is ClaudeX

ClaudeX (Claude Experience) is the ecosystem of tools, skills, agents, workflows, and plugins that change how humans work with Claude Code — the same way UX optimizes interfaces and DX optimizes developer tooling. It is infrastructure for human-AI collaboration, not a product or a platform.

Gobbi is an open-source ClaudeX tool.

---

## What gobbi does

**Just talk, gobbi handles the rest** — No commands to learn. Gobbi detects intent and routes to the right workflow automatically. Trivial tasks get a direct path. Complex tasks get ideation, planning, and multi-stance evaluation. The sophistication stays inside the system.

**Quality through structured evaluation** — Multi-perspective evaluation examines your work through independent lenses — project scope, architecture, performance, aesthetics, and holistic quality — catching problems no single viewpoint would find.

**Claude docs managed, not scattered** — Skills, agents, and hooks organized with source-of-truth separation. The `.gobbi/` directory is the authoritative source; `.claude/` is generated output. Install plugins or create your own through Claude Code.

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
| `npx @gobbi/cli sync` | Manually sync `.gobbi/` to `.claude/` |

---

## Migration from v0.2.0

```bash
npx @gobbi/cli install
```

Automatically detects existing `.claude/` gobbi files, migrates them to `.gobbi/`, and syncs back. No manual intervention needed.

---

## License

[MIT](./LICENSE)
