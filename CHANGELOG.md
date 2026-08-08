# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.1.1 - 2026-08-08

### Changed

- Gobbi entry now loads Principles, Discussion, and Delegation before governed routing and uses the active
  structured user-question control for mode, slug, and partner policy decisions.
- Cowork routes topic discussion through Ideation without a separate `CW · Topic · DISCUSSION` TODO item.
- Workflow Agent Teams continuity guidance now lives inside the shared Agent Teams tool skill, and runtime
  entrypoints keep only the generated Principles content.

### Fixed

- Removed the obsolete Workflow Agent Teams child and stale references from generated package and runtime views.
- Cropped `assets/logo.png` to its alpha-visible content with a small antialiasing margin while preserving the
  original RGBA pixels.

## 1.1.0 - 2026-08-04

### Changed

- Removed the standalone `record` skill with no compatibility alias. Use Memory `Temporary Record` for
  ignored, uncommitted session evidence and Memory `Memorize` for tracked project memory. Workflow retains
  its `RECORD` stage name.
- Renamed three web skills with no compatibility aliases. Direct or explicit invocation of `web-feature`
  now breaks; use `web-development`. Direct or explicit invocation of `web-interface` now breaks; use
  `web-design`. Direct or explicit invocation of `web-topology` now breaks; use `web-project-structure`.
- Added `scripts/sync-runtime-entrypoints.sh`, which keeps the Principles section in both runtime entry
  documents generated from the canonical Principles skill.
- Removed standalone skill-specific checkers and tests. Repository scripts now cover project-level topology,
  package, smoke, link, and runtime-entry validation.

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
