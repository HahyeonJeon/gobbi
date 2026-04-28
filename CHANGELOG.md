# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- PR-FIN-1c — `GitSettings` reshaped: `mode`/`workflow`/`cleanup` sub-objects removed; flat shape with per-concern sub-objects (`baseBranch`, `issue.create`, `worktree.autoRemove`, `branch.autoRemove`, `pr.open`, `pr.draft`). Worktrees always created; PR and issue creation are independent opt-in fields. Cross-field check updated to `pr.open=true` requires `baseBranch !== null`; check exempts DEFAULTS-only case (fresh repos). `ProjectsRegistry` interface and `Settings.projects` field removed; project resolution is `basename(repoRoot)` + `--project` flag. `gobbi project list` runs filesystem scan; `gobbi project switch` removed. T2-v1 upgrader extended to also handle Pass-3-current-shape files in place. Workspace seed simplified to `{schemaVersion: 1}`. Closes #179, #212. (#212)

### Added

- Wave C.1 — Prompts-as-data: schema v7, `prompt_patches` table, `gobbi prompt patch` and `gobbi prompt render` commands, JSON Patch (RFC 6902) spec evolution, `fast-json-patch` library, `prompt.patch.applied` audit event written to workspace `state.db` (#156, #161)
- Wave B.1 — JIT step-completion footer data-driven: `blocks.footer` field in step specs, `_schema/v1.ts::StepBlocks`, JSON Schema mirror in `_schema/v1.json`, `assembly.ts::renderSpec` pipeline, footer snap tests, operator/agent verb-partition enforcement (#153, #154)
- Wave A.2 — 9-doc reconciliation: stub-redirect files for retired `deterministic-orchestration.md` and `just-in-time-prompt-injection.md`, reconciled `v050-prompts.md`, `v050-hooks.md`, `v050-cli.md`, `v050-session.md` to post-Wave-A.1 reality (#150, #151)
- Wave A.1 — Orchestration core: schema v6, `step.advancement.observed` audit event, explicit `EventStore` partition-key constructor params, WAL checkpoint after `workflow.step.exit`, handoff state-machine step (`specs/handoff/spec.json`), `gobbi maintenance migrate-state-db` + `restore-state-db`, memorization path-pointer manifest, `.gobbi/gobbi.db` git-tracked via `.gitignore` exception, 10 Wave A.1 integration tests (#146, #147)

## [0.5.0] - 2026-04-19

### Breaking

- Hook wiring replaced — `gobbi notify *` hooks removed; `gobbi workflow *` hooks registered in `plugins/gobbi/hooks/hooks.json` and `.claude/settings.json` (#83)
- `_orchestration` skill deprecated — see `.claude/skills/_orchestration/ARCHIVED.md` for the 7-step → 6-step mapping (#83)
- 7-step cycle replaced by 6-step workflow (Configuration → Ideation → Planning → Execution → Memorization → Handoff); see `.gobbi/projects/gobbi/design/v050-overview.md` (#78, #79, #80, #81, #82, #83)
- Directory split — `.claude/` is static knowledge (skills, rules, docs, gotchas); `.gobbi/` is runtime state (event store, sessions, heartbeats); `.gobbi/` is gitignored (#78, #83)

### Added

- `gobbi workflow` command group — 11 subcommands: `init`, `next`, `transition`, `guard`, `capture-subagent`, `capture-planning`, `stop`, `resume`, `status`, `validate`, `events` (#78, #80)
- Predicate registry — typed TS functions replacing JsonLogic; `gobbi workflow validate` enforces coverage (#79)
- Spec library — step specs as validated JSON under `packages/cli/src/specs/{ideation,planning,execution,evaluation,memorization}/spec.json` (#79)
- Event store + schema v1→v4 migrations — `packages/cli/src/workflow/migrations.ts` with lazy read-time migration (#78, #80, #81, #82)
- State reducer — `packages/cli/src/workflow/reducer.ts`, pure function state evolution (#78)
- Verification runner — synchronous serial execution wired into `next.ts`; results reduce to state (#82)
- Cost rollup — `gobbi workflow status --cost` aggregates token-derived dollar cost from `delegation.complete` events (#82)
- `stepStartedAt` state field — enables `workflow.step.timeout` emission from `stop.ts` (#82)
- `gobbi gotcha promote` — CLI to move session-local gotchas to tracked skill dirs (#80)
- `gobbi session events` — inspect and export the event log (#80)
- Error-state + resume compilers — 5 pathway variants (crash, timeout, feedbackCap, invalidTransition, unknown) (#81)
- `EvalSkipData.priorError` — CP11 reversibility snapshot on `resume --force-memorization` (#81)
- `workflow.invalid_transition` event + audit-emit refactor in `engine.ts` (#81)
- Verification-block prompt compiler — `packages/cli/src/specs/verification-block.ts` (#82)
- Property-based tests — fast-check v4 reducer idempotency + transition exhaustiveness (#82)
- End-to-end subprocess tests — `workflow-cycle.test.ts` (full cycle) + `migration-chain.test.ts` (v1→v4 replay) (#82, #83)
- `MIGRATION.md` at repo root — v0.4.x → v0.5.0 upgrade guide (#83)
- Phase 3 backlog — `.gobbi/projects/gobbi/design/v050-phase3-backlog.md` (#83)
- `_orchestration/ARCHIVED.md` — pedagogical mapping of 7-step to v0.5.0 equivalents (#83)

### Changed

- Runtime moved from Node to Bun (`engines.bun: ">=1.2.0"` in `packages/cli/package.json`) (#78)
- `@gobbitools/cli` version 0.4.5 → 0.5.0 (#83)
- `gobbi` plugin version 0.4.5 → 0.5.0 (`plugins/gobbi/.claude-plugin/plugin.json`) (#83)
- Directory layout — specs live at `packages/cli/src/specs/` (#79)
- `ajv` added as first production dependency for spec validation (#79)

### Removed

- `gobbi docs` CLI command and all subcommands (#64)
- `gobbi doctor` CLI command (#64)
- `gobbi audit` CLI command (#64)
- JSON-first documentation authoring system — Markdown is now the directly-editable format (#64)
- `_doctor` and `_audit` skill directories (#64)
- 8 v0.4.x hook entries in `plugins/gobbi/hooks/hooks.json` + `.claude/settings.json`: SessionStart×3 (`gobbi session metadata`, `gobbi session load-env`, `gobbi notify session`), Stop×1 (`gobbi notify completion`), Notification×1 (`gobbi notify attention`), StopFailure×1 (`gobbi notify error`), SubagentStop×1 (`gobbi notify subagent`), SessionEnd×1 (`gobbi notify session`) (#83)

### Fixed

- Plugin config path corrected — `plugins/gobbi/.claude-plugin/plugin.json`, not `plugins/gobbi/plugin.json` (see `phase2-planning.md` gotcha) (#79)
- Schema-version bump grep gates extended to rendered-output literals (`Schema: v[0-9]`) and `CURRENT_SCHEMA_VERSION).toBe(N)` canary pins (#81, #82)

## [0.4.0] - 2026-04-04

### Breaking

- Restructured as npm workspaces monorepo: `@gobbi/cli` (workflow commands) and `@gobbi/media` (image/video/web analysis)
- Renamed package from `@gobbi/core` to `@gobbi/cli` — install with `npm install -g @gobbi/cli`
- Media commands moved to separate `gobbi-media` binary — `gobbi image` is now `gobbi-media image`

### Added

- 7-step workflow with dedicated Research step and dual-stance agents (innovative + best) (#49)
- `_innovation` and `_best-practice` stance skills for PI and Researcher agents
- Agent guides: `pi.md`, `researcher.md`, `executor.md`, `evaluator.md` in `_agents`
- 6 `gobbi docs` utility subcommands: `list`, `tree`, `search`, `extract`, `stats`, `health` (#53)
- `evaluation.md` quality criteria to 8 skills: `_skills`, `_agents`, `_rules`, `_project`, `_gotcha`, `_evaluation`, `_innovation`, `_best-practice` (#52)
- Session config persistence via `gobbi config set/get` with `$CLAUDE_SESSION_ID` key (#45)
- Session settings check at startup — reuse saved settings on resume/compact
- CLI setup check and `cli-setup.md` installation guide
- Media analysis CLI tools: `image`, `video`, `web` (#41)
- JSON-template documentation system for `.claude/` authoring (#45)
- Notification control per session with Slack, Telegram, Discord channels (#45)
- Note metadata: orchestrator model ID, Claude Code version, token usage tracking
- `write-plan.sh` and improved `subtask-collect.sh` for note workflow
- Automated subtask collection via transcript extraction (#37)
- `transcripts.md` child doc for `_claude` skill
- Model and Effort section to `_agents` guide
- Gotchas: JSON-first authoring (`_claude`), `gh api` merge PUT method (`_git`), worktree dirty files

### Changed

- Restructured orchestration from 5-step to 7-step workflow with Research and Stances (#49)
- All review tasks override to sonnet model via Agent tool `model` parameter
- Stance skill allocation in `_delegation` and `_orchestration`
- Updated model tiers in delegation and agent mission guidance
- Rewritten `_gotcha` skill as general guide with mandatory read rule
- Migrated gotchas from `_gotcha/` directory to individual skill directories

### Removed

- Legacy npm-managed claude docs code (#43)
- Legacy market package and workspaces config
- Shell scripts replaced by TypeScript CLI commands (#48)

### Fixed

- `gh api` merge command requires `-X PUT` method in `_git` gotcha

## [0.3.2] - 2026-04-02

Internal version bump for session config, notification control, and JSON-template docs. Superseded by 0.4.0 — never published to npm.

## [0.3.1] - 2026-04-01

### Improved

- `_claude` skill: rewrite core principles — Chain-of-Docs, procedure vs non-procedure, first-line discoverability
- `_claude` skill: merge related skills into single Navigate deeper table
- `_evaluation` skill: add user perspective as core principle, clarify evaluator skill loading
- `_plan` skill: add core principles for subagent/skill specification and research before planning

### Added

- Gotcha: never reference internal (`__`) names in non-internal docs

## [0.3.0] - 2026-03-31

### Added

- `gobbi-agent` setup assistant — user-facing onboarding agent for the plugin
- 5-perspective evaluation model (project, architecture, performance, aesthetics, overall) replacing 3-stance model
- Underscore naming convention with 3 visibility tiers (interface, hidden, internal)
- `_memorization` skill for session continuity
- Telegram and Discord notification channels
- `_project-context` skill for session-start project detection
- `__skills-grader`, `__skills-comparator`, `__skills-analyzer` agents for skill evaluation
- Skill verification system with two-track verification and benchmark scenarios
- YAML frontmatter for gotcha entries with priority, enforcement, and pattern fields
- Security gotcha file for evaluator security signals
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

- Renamed `_developer`, `_pi`, `_planner` agents to internal tier (`__` prefix)
- Plugin now exposes only `gobbi-agent` instead of internal worker agents
- Added `"agents"` field to `plugin.json` manifest
- All skills and agents migrated from `gobbi-` prefix to underscore naming convention
- Reversed symlink direction — `.claude/` is now source of truth, plugins symlink to it
- Split `_claude` into `_claude-skills` and `_claude-agents`
- Restructured `_orchestration` with child docs (feedback.md, finish.md)
- Made step-by-step anti-pattern context-dependent in `_claude`
- Improved `_claude-skills` with skill-creator knowledge and authoring guide
- Hardened notification delivery from channel plugin review

### Removed

- `templates/` directory — dead code, both distribution paths read from `.claude/` directly
- Unused `installCoreHooks` and `installNotificationHooks` functions from hooks.ts
- Internal agents (`__evaluator-*`, `__skills-*`) removed from plugin distribution

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

[Unreleased]: https://github.com/HahyeonJeon/gobbi/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/HahyeonJeon/gobbi/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/HahyeonJeon/gobbi/compare/v0.3.1...v0.4.0
[0.3.2]: https://github.com/HahyeonJeon/gobbi/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/HahyeonJeon/gobbi/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/HahyeonJeon/gobbi/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/HahyeonJeon/gobbi/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/HahyeonJeon/gobbi/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/HahyeonJeon/gobbi/commits/v0.1.0
