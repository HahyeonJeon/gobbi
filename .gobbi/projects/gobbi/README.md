# Gobbi Project

> gobbi (고삐) — Korean for reins, the essential equipment for handling a horse.

Gobbi is an open-source ClaudeX (Claude Experience) tool for Claude Code. It benchmarks [GSD (get-shit-done)](https://github.com/gsd-build/get-shit-done) but takes a fundamentally different approach.

## v0.5.0 Note Structure

Gobbi v0.5.0 separates runtime state from retrospective records. `.gobbi/sessions/{id}/` holds per-session state written during an active workflow — event store, heartbeats, and mid-session notes. `.claude/project/gobbi/note/` is the retrospective archive: completed-task notes written after the session, gitignored, stored in the main tree rather than the feature branch.

## Directory

- [design/](design/) — Design docs: vision, architecture, workflow, agents, evaluation, state, hacks, distribution, GSD analysis
- [learnings/](learnings/) — Gotchas and decisions accumulated across sessions
- [references/](references/) — External references, API docs, research
- [rules/](rules/) — Project-specific rules and conventions
- [skills/](skills/) — Project-specific skill files (symlinked into `.claude/skills/` per-file)
- [agents/](agents/) — Project-specific agent definitions (symlinked into `.claude/agents/` per-file)
- [sessions/](sessions/) — Per-session runtime state: settings, event store, mid-session notes (gitignored)
- [README.md](README.md) — This file
