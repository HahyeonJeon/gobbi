<h1 align="center">gobbi</h1>
<p align="center">Open-source ClaudeX tool for Claude Code</p>
<p align="center"><sub>고삐 (gobbi) — Korean for reins, the essential equipment for handling a horse</sub></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@gobbitools/cli"><img src="https://img.shields.io/npm/v/@gobbitools/cli" alt="npm version"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/HahyeonJeon/gobbi" alt="License: MIT"></a>
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/bun-%3E%3D1.2.0-orange" alt="Bun version"></a>
</p>

---

## What is ClaudeX

ClaudeX (Claude Experience) is the ecosystem of tools, skills, agents, workflows, and plugins that change how humans work with Claude Code — the same way UX optimizes interfaces and DX optimizes developer tooling. It is infrastructure for human-AI collaboration, not a product or a platform.

Gobbi is an open-source ClaudeX tool.

---

## What gobbi does

**Just talk, gobbi handles the rest** — No commands to learn. Gobbi detects intent and routes to the right workflow automatically. Trivial tasks get a direct path. Complex tasks get ideation, planning, and multi-stance evaluation. The sophistication stays inside the system.

**Quality through structured evaluation** — Multi-perspective evaluation examines your work through independent lenses — project scope, architecture, performance, aesthetics, and holistic quality — catching problems no single viewpoint would find.

**Claude docs managed, not scattered** — Skills, agents, and hooks organized with a clear separation between static knowledge and runtime state. `.claude/` is the static knowledge layer — skills, rules, agents, and hooks that Claude Code reads on every session. `.gobbi/` is the runtime layer — active session state, event store, heartbeats, and mid-session notes written during workflow execution.

**Domain expertise built in** — Domain-specific skills (Python, TypeScript, data engineering) bring specialized knowledge to your sessions without requiring you to explain the domain each time.

**CLI tools for improvement** — Evaluate your Claude Code setup, benchmark skills, identify gaps. The feedback loops that let you measure and improve your ClaudeX quality over time.

---

## Quick Start

Install the plugin from inside Claude Code:

```
/plugin install gobbi
```

The plugin includes the CLI. Once installed, start a workflow with:

```
gobbi workflow init
```

Then run `/gobbi` to begin.

### Direct CLI Install

To install the CLI without the plugin:

```bash
npm install -g @gobbitools/cli
```

---

## License

[MIT](./LICENSE)
