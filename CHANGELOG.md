# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.1 - 2026-08-03

This release repairs native Codex plugin delivery and includes the session and partner improvements
accumulated on the unreleased development line.

### Added

- A package generator and byte-equality guard that keep the materialized plugin package equal to its
  canonical skill and agent owners.
- An isolated Codex installed-cache smoke test that verifies nested package paths reach a real plugin
  installation and rejects missing, linked, or unsupported components.
- Canonical Gobbi root discovery, consumer-project configuration checks, partner selection, and dedicated
  partner and Agent Teams runtime guidance.

### Changed

- `plugins/gobbi/skills/` and `plugins/gobbi/agents/` now contain generated real files instead of component
  symlinks, while `.gobbi/projects/gobbi/` remains their only editable owner.
- Cowork and Workflow now route partner and Agent Teams work through their dedicated runtime contracts.

### Fixed

- Native Codex installs now receive the complete Gobbi package instead of only the two plugin manifests.
- Runtime role wrappers, Claude skill mirrors, and entry configuration resolve their canonical sources
  consistently and report missing prerequisites explicitly.
- Package checks now fail on incomplete installed caches, unsafe mirror drift, or unsupported hook content.

## 1.0.0 - 2026-08-01

First stable release of Gobbi, an open-source ClaudeX system for Claude Code and Codex.

### Added

- Three session modes the user selects at every fresh entry: General for ordinary assistance,
  Cowork for user-led topic-by-topic implementation, and Workflow for durable
  `Configuration → Ideation → Planning → Execution → Wrap-up` orchestration.
- Canonical skills under `.gobbi/projects/gobbi/skills/`, covering the behavioral principles, the
  three modes, delegation, evaluation, git, memory, record, wrap-up, and per-language and
  per-platform implementation domains: 28 skill roots and 62 children.
- Eight language and platform families — `css`, `desktop`, `electron`, `go`, `html`, `react`,
  `typescript`, and `web` — each routing work to the children that own its mechanics. Interface and
  experience obligations sit in the family that owns the surface, in `web/web-interface` and
  `desktop/desktop-interface`, rather than in a cross-surface skill.
- An unchecked `checklists.md` evaluation source for every child of those eight families: 52 sources
  carrying 2,196 rows under the `Perspective → Scenario → Checklist rows` hierarchy.
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

### Known gaps

- Command-line, voice, and mobile interface and experience design have no owner. No language or
  platform family hosts those surfaces, and `react/SKILL.md` states that React Native needs
  project-specific guidance.
- What a standalone Go server process should emit, and how it captures its own crashes, has no
  owner. `web/web-observability` owns the emission contracts, but its procedure covers web and
  Electron surfaces, and no `go` child took the server process. `go/SKILL.md` records this as an
  open gap.
