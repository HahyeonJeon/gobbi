# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- gobbi-project-context skill for session-start project detection
- gobbi-skills-grader, gobbi-skills-comparator, gobbi-skills-analyzer agents for skill evaluation
- Skill verification system with two-track verification and benchmark scenarios
- YAML frontmatter for gotcha entries with priority, enforcement, and pattern fields
- Security gotcha file (gobbi-security.md) for evaluator security signals
- Contribution point identification at ideation-to-plan boundary
- Decision annotation and pre-resolved decisions guidance in delegation
- False positive rubric, stance-focus matrix, and deep mode in evaluation
- Pre-action re-verification and severity tiers in execution and delegation
- Three-tier task routing mental model in orchestration
- Report-before-act constraint for assess-then-modify delegated tasks
- Audit command verification script for shell code blocks in docs
- Skill-update learning capture in collection to close the learning loop
- Benchmark `--roster` flag for description overlap detection
- Directory-name/frontmatter-name cross-validation in validate

### Changed

- Reversed symlink direction — `.claude/` is now source of truth, plugins symlink to it
- Split gobbi-claude into gobbi-claude-skills and gobbi-claude-agents
- Restructured gobbi-orchestration with child docs (feedback.md, finish.md)
- Made step-by-step anti-pattern context-dependent in gobbi-claude
- Improved gobbi-claude-skills with skill-creator knowledge and authoring guide
- Hardened notification delivery from channel plugin review

### Fixed

- Re-applied git gotchas lost during symlink reversal merge
- Removed invalid hooks and agents fields from plugin.json
- Moved skill eval agents to plugin and fixed data contract consistency

## [0.2.1] - 2026-03-29

### Added

- gobbi-git skill for worktree-isolated git/GitHub workflow
- Git prerequisites check system (gh CLI, authentication, remote, base branch)
- Worktree conventions (branch naming, commit messages, PR template)
- Claude Code plugin marketplace with gobbi-core as first plugin
- Plugin manifest, marketplace.json, and distributable plugin structure

### Fixed

- Recorded 4 gotchas from first git workflow test (unpushed commits in PR, closing keywords on non-default branch, nested worktree directories, merge-and-cleanup tracking)

## [0.2.0] - 2026-03-29

### Added

- LICENSE (MIT), badges, and metadata for professional GitHub presentation
- Styled CLI output with Unicode banner and ANSI colors

### Changed

- Major redesign: `.gobbi/` as source of truth with copy-on-sync to `.claude/`
- Switched Slack notifications from webhook to Bot API
- Renamed env file to `.env`
- Converted CLI to TypeScript
- Moved gobbi permissions to settings.json with auto-configure on install

## [0.1.0] - 2026-03-28

### Added

- Gobbi harness — orchestration workflow with skills, agents, and evaluation
- 16 core skills: gobbi, gobbi-orchestration, gobbi-claude, gobbi-gotcha, gobbi-discuss, gobbi-ideation, gobbi-plan, gobbi-delegation, gobbi-execution, gobbi-evaluation, gobbi-ideation-evaluation, gobbi-plan-evaluation, gobbi-execution-evaluation, gobbi-note, gobbi-collection, gobbi-notification
- Agent definitions: gobbi-pi, gobbi-planner, gobbi-developer, gobbi-evaluator-positive, gobbi-evaluator-moderate, gobbi-evaluator-critical
- Note metadata system with SessionStart hook and naming convention
- npm installer (`npx gobbi init/update`)
- Slack notification hooks
- Project state directory (`.claude/project/`) with design docs, gotchas, rules, and notes

[Unreleased]: https://github.com/HahyeonJeon/gobbi/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/HahyeonJeon/gobbi/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/HahyeonJeon/gobbi/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/HahyeonJeon/gobbi/commits/v0.1.0
