# Gobbi Vision: v0.3.0

> gobbi (고삐) — Korean for reins, the essential equipment for handling a horse.

---

## What is ClaudeX (Claude Experience)?

Just as UX optimizes user interfaces and DX optimizes developer tooling, ClaudeX — the Claude Experience — optimizes the human-AI collaboration layer. It is the ecosystem of tools, skills, agents, workflows, and plugins that change how humans work with Claude Code.

The ClaudeX ecosystem has five components:

**Skills** — specialized knowledge Claude loads for specific tasks. A skill on data modeling gives Claude the vocabulary and constraints of that domain without requiring the user to explain it every session.

**Agents** — role-specific subagent definitions with scoped capabilities. An agent is Claude wearing a particular hat: senior engineer, evaluator, documentation writer. Its scope is narrow, its instructions precise.

**Workflows** — structured processes that guide complex task execution. Not rigid scripts — adaptive flows that shape themselves to the task at hand.

**Plugins** — distributable packages of skills, agents, and hooks. The unit of sharing across projects and teams.

**Tools** — CLI utilities for evaluation, benchmarking, and improvement. The feedback loops that make the rest of the ecosystem better over time.

ClaudeX is not a product or a platform. It is a category — the layer of infrastructure that determines how effective your collaboration with Claude Code actually is.

---

## Where Gobbi Fits

Gobbi is an open-source ClaudeX tool. It is one tool in the ecosystem, not the ecosystem itself.

Gobbi's focus is two technical pillars:

**Workflow orchestration** — the adaptive ideation → plan → execute → evaluate cycles that structure how gobbi works through complex tasks. Gobbi detects intent, decides the appropriate depth, and routes to the right internal workflow without requiring the user to learn anything. The system is sophisticated inside, invisible outside.

**Claude docs management** — gobbi maintains its own source of truth in `.gobbi/` and outputs structured `.claude/` files (CLAUDE.md, skills, agent definitions, hooks). This separation means gobbi's internals can be updated, patched, and distributed without overwriting user customizations.

What gobbi does not try to be: the only ClaudeX tool, a general AI orchestration platform, or a multi-runtime abstraction layer. Gobbi does one thing well for one runtime — Claude Code.

---

## v0.3.0 Roadmap

The v0.3.0 release is organized into five steps, each building on the previous.

**Step 0: Identity** — Establish gobbi as a ClaudeX tool. Define what ClaudeX means, where gobbi fits, and what the roadmap commits to. That is this document.

**Step 1: Claude docs** — Analyze, update, and improve gobbi's own claude docs. Gobbi must be a credible example of ClaudeX-quality documentation before teaching others to build it.

**Step 2: Domain expertise** — Create domain-specific agents and skills: Python, TypeScript, data engineering, and others. This is where gobbi's ClaudeX role becomes concrete — distributable expertise that raises the quality ceiling on what Claude can do in a given domain.

**Step 3: Distribution** — Publish gobbi via the Claude Code plugin marketplace. The packaging step: making gobbi installable by any Claude Code user without manual setup.

**Step 4: CLI** — Ship `@gobbi/cli` with evaluation tools, improvement tools, and ClaudeX utilities. The feedback loop tooling that lets teams measure and improve their ClaudeX quality over time.

---

## What Changed from v0.2 to v0.3

The v0.2 framing was accurate but narrow: gobbi as a "workflow harness and claude docs management tool." That description covered the mechanics but not the purpose.

v0.3 introduces the ClaudeX framing. The technical pillars — orchestration and docs management — are unchanged. What changes is the scope of gobbi's role: not just managing workflows for a single user, but building and distributing the infrastructure that makes human-AI collaboration more effective across projects and teams.

The identity shift is not a pivot. Gobbi has always been doing ClaudeX work. v0.3 names it.

---

## What Makes Gobbi's Approach Distinct

Three principles separate how gobbi approaches ClaudeX from how other tools approach it.

**No study required.** Users just talk. Gobbi detects intent, categorizes complexity, and routes to the right internal workflow. There are no commands to memorize, no phases to understand, no config to manage. The sophistication stays inside the system, not in the user's head.

**Claude Code only.** Gobbi does not abstract across runtimes. Claude Code only. This allows gobbi to exploit every Claude Code feature without lowest-common-denominator compromises: the native Agent tool, TaskCreate, the memory system, hooks, worktrees. Depth over breadth.

**Safe hacking.** Core gobbi skills live in protected directories and are never touched by users. User customizations live as patch files generated by gobbi from natural conversation. Patches overlay core behavior without modifying it. Users can customize freely — gobbi's core remains intact and updatable.

These are not features. They are the reasoning behind every design decision gobbi makes.
