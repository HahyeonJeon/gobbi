# Gobbi Project

> gobbi (고삐) — Korean for reins, the essential equipment for handling a horse.

Gobbi is an open-source ClaudeX (Claude Experience) tool for Claude Code. It benchmarks [GSD (get-shit-done)](https://github.com/gsd-build/get-shit-done) but takes a fundamentally different approach.

## v0.5.0 Note Structure

Gobbi v0.5.0 separates runtime state from retrospective records. `.gobbi/sessions/{id}/` holds per-session state written during an active workflow — event store, heartbeats, and mid-session notes. `.claude/project/gobbi/note/` is the retrospective archive: completed-task notes written after the session, gitignored, stored in the main tree rather than the feature branch.

## Directory

- [design/](design/) — Design docs: vision, architecture, workflow, agents, evaluation, state, hacks, distribution, GSD analysis
- [rules/](rules/) — Project-specific rules and conventions
- [gotchas/](gotchas/) — Project-specific gotchas (not cross-project)
- [note/](note/) — Retrospective workflow notes per completed task (gitignored, main tree only)
- [reference/](reference/) — External references, API docs, research
- [docs/](docs/) — Other project documents
