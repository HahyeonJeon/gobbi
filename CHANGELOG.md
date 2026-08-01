# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-01

First stable release of Gobbi, an open-source ClaudeX system for Claude Code and Codex.

### Added

- Three session modes the user selects at every fresh entry: General for ordinary assistance,
  Cowork for user-led topic-by-topic implementation, and Workflow for durable
  `Configuration → Ideation → Planning → Execution → Wrap-up` orchestration.
- Canonical skills under `.gobbi/projects/gobbi/skills/`, covering the behavioral principles, the
  three modes, delegation, evaluation, git, memory, record, wrap-up, and per-language and
  per-platform implementation domains.
- Canonical agent role prompts under `.gobbi/projects/gobbi/agents/` for manager, leader, executor,
  evaluator, and assistant, with native Codex wrappers under `.codex/agents/`.
- A dual-system quality contract that keeps independent Claude and Codex drafts, reciprocal
  cross-reviews, and fresh independent evaluators, and applies no finding before the user resolves
  its disposition.
- A hookless shared plugin package at `plugins/gobbi/` that carries both runtime manifests and
  symlinked views of the canonical skills and agents.
- Repo-local runtime entry contracts at `.claude/CLAUDE.md` for Claude Code and `AGENTS.md` for
  Codex.
- Repository checks under `scripts/`: `sync-plugin-package.sh`, `test-sync-plugin-package.sh`,
  `check-codex-plugin-smoke.sh`, and `check-markdown-links.sh`.
