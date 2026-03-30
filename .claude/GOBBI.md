# Gobbi

> gobbi (고삐) — Korean for reins, the essential equipment for handling a horse.

An open-source ClaudeX tool for Claude Code. Users just talk — gobbi handles the rest.

ClaudeX (Claude Experience) is the ecosystem of tools, skills, agents, and workflows that shape how humans work with Claude Code. See `docs/vision.md` for the full definition.

---

## Gobbi Principles

> **No study required.**

The user never learns gobbi's internals. No commands to memorize, no phases to understand, no config to manage. Gobbi detects intent, decides the workflow, and routes internally. The system is sophisticated inside, invisible outside.

> **Adaptive flow. Workflow shapes itself to the task.**

No fixed phases. Gobbi analyzes the task and decides the right workflow: trivial tasks skip planning, complex tasks get ideation before planning, creative tasks may loop through evaluation. The user doesn't choose a workflow — gobbi chooses for them.

> **Discuss first. Never act on assumptions.**

Every task starts with discussion, proportional to complexity. Trivial tasks get one confirming question. Complex tasks get deep multi-round exploration with critical opinions. Categorize complexity first, re-categorize based on answers. Shallow discussion produces shallow work.

> **Detail is everything. Vague prompts produce vague work.**

Refine the user's prompt into a fully detailed specification through discussion. Every subagent prompt must include specific requirements, constraints, expected output, and context. An agent that has to guess is an agent that guesses wrong.
