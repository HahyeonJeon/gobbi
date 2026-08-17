# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Fixed

- Each runtime now loads its own plugin hook file, and the Claude Code command resolves again through
  `${CLAUDE_PLUGIN_ROOT}`. Claude Code keeps the default `hooks/hooks.json` on `UserPromptSubmit`, while
  `.codex-plugin`, `.grok-plugin`, and `.cursor-plugin` point Codex, Grok, and Cursor at
  `hooks/codex-hooks.json` (`UserPromptSubmit`), `hooks/grok-hooks.json` (`Stop`), and
  `hooks/cursor-hooks.json` (`sessionStart`). The package's `stop-remind.sh` becomes `hooks/remind.sh`, taking
  the runtime name as its first argument instead of probing for its host, and drops the per-turn lock. The
  Grok install section no longer tells users to copy hook files into `~/.grok/hooks/`.

## 1.2.0 - 2026-08-16

### Changed

- Role contracts are now identity-and-load maps. Each of the 20 canonical files keeps frontmatter,
  identity, characteristics, skills to load, out of scope, and status. Procedure lives in the owning
  skills. Plugin agents remain the five Claude-fronted Markdown files for Claude Code and Grok.
  Canonical folders are `.gobbi/projects/gobbi/agents/{claude,grok,codex,cursor}`.
- Delegation now owns the specialist root-pair protocol. A brief supplies both Gobbi roots as
  absolute expanded paths or supplies neither. Specialists validate the three sentinels and stop on
  `NO_GOBBI_ROOT` tokens. Gobbi 1.1 remains the manager entry owner.
- Git now owns continuation write-safety. Specialists re-`cd` to the worktree, write with the
  absolute worktree path, run `git -C <worktree-abs>`, re-anchor by naming the changed file,
  re-state scope and status each continuation turn, and never push from a specialist continuation.
- Gobbi now presents four runtimes: Claude Code, Codex, Cursor, and Grok. Cursor participants are
  checkout-local `.cursor/agents` and `.cursor/skills`. Start the parent as `grok-4.6[effort=xhigh]`.
  The binary is `cursor-agent`, never bare `agent`; official help uses `agent`. No Cursor
  marketplace plugin is added. Agent Teams stays Claude-only.
- Partner policy now accepts `cursor` under the existing one-or-two cap: `disabled` or one or two of
  `{claude-code,codex,cursor,grok}`. Cursor is a named partner and Unavailable. Do not invoke `agent`
  as Gobbi Partner.
- Plugin skill wording now names Cursor. Plugin agents remain Claude Code and Grok. Stop-hook headers
  name currently wired consumers and do not claim Cursor hook support.
- The plugin `agents/` directory is a flat Claude Code and Grok projection (`{role}.md` only).
  Canonical runtime folders stay under `.gobbi/projects/gobbi/agents/{claude,grok,codex,cursor}/`.
  Codex custom agents remain repository-local `.codex/agents/{role}.toml` and are not a plugin
  component. Plugin descriptions name skills for all four runtimes and plugin agents only for
  Claude Code and Grok.
- Gobbi now includes a read-only project prerequisite checker for Claude Code team, role, skill, and
  permission settings; Codex agent, feature, skill, and instruction settings; Grok agent, skill, and
  `.agents/agents` sibling settings; Cursor agent, skill, and `.cursor` pair settings; the
  project-keyed `.gobbi/` layout; effective `.gitignore` ownership; and installed `claude`, `codex`,
  `cursor-agent`, and `grok` CLIs.
- Gobbi, Partner, and Agent Teams now follow the compact Gobbi Skill structures. Gobbi retains only entry and
  routing, Partner is a write-capable Tool Manual that requires one exact session directory and writing path
  in every Delegation prompt, and Agent Teams prefers re-delegating coherent follow-up work to a context-ready
  teammate under a fresh complete brief.
- Partner now saves one authoritative result inside the caller's session directory and returns a separate
  compact final Handoff. The caller starts each launch through one local wrapper subagent so remaining
  runtimes can run in parallel. Codex, Claude Code, and Grok launches use the measured write-capable
  commands, and any unexpected session or project write, invalid result, or Handoff mismatch stops
  acceptance.
- Cowork now uses only Fast and Light delivery. Fast skips Ideation and Planning, while Light runs bounded
  canonical Ideation and Planning before Execution. Cowork and Workflow now share session-root and
  configuration vocabulary, use aligned owner-local configuration templates, and reference the skills that
  own discussion, delegation, shaping, and runtime mechanics instead of repeating their procedures.
- Cowork session records now use topic-owned `1-ideation/`, `2-planning/`, and `3-execution/` directories plus
  a session `wrap-up/`; Workflow uses the same lifecycle directories without the topic wrapper. Both modes
  write drafts and other unfinished inputs to caller-named paths below `tmp/`, then organize accepted results
  and required evidence into the owning phase without a fixed temporary-package shape or filename.
- Workflow now owns its three phase procedures in one skill instead of separate phase children. Each phase
  applies `DISCUSSION → WORK → EVALUATION → RECORD` and writes a fixed `handoff.md` for completion or a safe
  terminal stop. Phase 1 studies and designs with the user, available subagents or teammates, and the remaining
  Partner launch set; after its Complete handoff, the manager proceeds autonomously from the accepted design
  or stops without asking another Workflow question. Continuation and recovery stay in the worktree and
  session directory recorded by Configuration and the latest handoff.
- Renamed `skill-writing` to `gobbi-skill` with no compatibility alias. Its domain, operation, tool, and
  preference type guides are now direct child skills with their own `SKILL.md` files.
- Gobbi Skill and each direct type-writing child now own a reusable checklist. The parent covers shared skill
  design, compactness, and source ownership with independently answerable signs; the child checklists cover
  exact operation SOPs, preference consistency, tool manuals and collections, and domain-family routing. The
  shared References contract now explicitly exempts navigation-only domain roots.
- The canonical Gobbi Skill source now includes a project-local helper that links every top-level skill into
  `.claude/skills/`, `.agents/skills/`, `.grok/skills/`, and `.cursor/skills/`. It accepts only one exact project-owned source
  tree, creates missing relative directory links, and stops on conflicts without migrating existing
  directories or writing to plugin or user-level locations.
- Skill descriptions now identify what each skill is in one or two short sentences. Each Intro states what
  the skill is and when to use it in one to three sentences across no more than two paragraphs.
- Evaluation now uses four phases and a short report template: understand the target, prepare an
  evidence-backed checklist, evaluate the target, and report the results. Checklist is now a standalone root
  skill, and its old nested path has no compatibility alias. Reports state evidence and uncertainty without a
  numeric certainty score. Its checklist template renders Project, Design and Development, and Product lifecycle
  sections with categories, broad mistake-oriented scenarios, and unchecked problem signs. Checklist defines
  the categories first, the scenarios second, and the observable problem signs third before assembling the source.
  Each review step checks coverage; checklist items avoid unnecessary subject-specific detail and use heading
  paths instead of IDs. Design and Development owns work-artifact creation, handoff, project use, maintenance,
  and change; Product is reserved for operating apps, services, libraries, and comparable products. A bundled
  evaluation checklist covers generated checklist documents.
- Evaluation now consumes general code and documentation checklist sources owned by Execution and
  operation-specific baselines owned by Ideation and Planning. Execution applies its matching checklist during
  self-review; the separate Code Review and Documentation Review operations remain removed.
- Execution keeps its evidence-led, bottom-up task procedure while strengthening YAGNI and incremental growth.
  Executors study the project's vision, philosophy, design, architecture, and live evidence before choosing an
  implementation, verify each smallest complete unit before expanding it, and add complexity only for a
  current requirement or observed failure. Each task returns a compact response-only handoff for its result,
  changes, verification, local delivery, concerns, and limits.
- Ideation now records one indexed result with an `ideation-index.md` locator, coherent numbered design
  parts, and optional nested requirements and topics snapshots. Workflow and Cowork freeze, evaluate, recover,
  and hand off the complete listed result while retaining evidence-proved legacy single-file results without
  migration.
- Planning now records one indexed result with a `plan-index.md` locator, direct numbered plan parts, and a
  numbered task hierarchy. Workflow and Cowork consume and freeze the complete listed result while retaining
  an evidence-proved legacy `tasks.md` and `plan.md` pair without migration.
- Wrap-up now uses a compact three-phase closure procedure that reconciles durable memory through
  category-owned CRUD, commits closure changes, rejects base drift, proves the accepted and resulting base
  trees agree, and returns one response-only development, research, or work Note for every terminal state from
  `wrap-up/templates/note.md`. Its reusable checklist covers closure governance, Memory reconciliation,
  exact-tree integration, recovery, and factual Note reporting.
- Memory now permits durable updates only on an explicit user call or a caller skill's named Memory stage.
  Mid-session discoveries use one ignored change-point record, while Memorize reconciles category-owned CRUD,
  merges, reorganization, stale content, and duplicates before creating new memory. No-slug legacy session
  identities and their recovery routes are removed from the active Gobbi, Cowork, Workflow, Agent Teams,
  Memory, and Git contracts.
- Discussion now understands the user's intent within the relevant project vision, roadmap, design,
  architecture, and current state, using Who, What, When, Where, Why, and How to identify material gaps. It
  studies evidence before proposing options and recommends the best-supported direction so the user can make a
  concrete decision. Material design and decision advice actively uses available subagent, teammate, and enabled
  Partner input through the active owner's participant contract, avoiding duplicate or out-of-policy runs.
  Material decisions use one shared question template through `AskUserQuestion` in Claude Code,
  `request_user_input` in Codex, the official Ask questions tool in Cursor, or
  `ask_user_question` in Grok.
- Delegation no longer classifies subagent results as `file`, `commit`, or `response-only`. Every brief now
  names one authoritative result and its acceptance evidence directly. Its `Return` section requires the
  subagent to write a final, verifiable Handoff for every terminal status and distinguishes durable locators from
  response subjects without a result-kind field.
- Study now frames reliable internal and external materials around the design, development approach, or
  decision they must improve. It remains advisory, returns a defined concise response by default, or writes one
  caller-authorized result from a compact template while keeping every studied material read-only.
- Git is now a preference skill for common repository inspection, purpose-based branches, optional worktrees,
  focused commits, explicit integration and publication, tags, recovery, and cleanup. Cowork and Workflow own
  session Git actions, Execution owns task commits, Wrap-up owns closure integration, Go Release owns tag
  specification and verification, and its named executor owns mutation. Compact issue and pull-request
  templates provide repository-agnostic fallback bodies when a project supplies no applicable template.
- New branches use `<type>/<slug>` or `<type>/<issue>-<slug>`; runtime-specific prefixes, date and session
  identifiers, agent provenance trailers, their legacy recovery paths, the separate Git conventions document,
  and the runtime posture probe are removed without migration.
- Gobbi skill dependencies now preserve policy ownership instead of using a stale isolated-skill allowlist.
  Internal References do not load their targets, and task triggers still control loading.
- Removed the repository-level `scripts/` automation. Its hard-coded synchronization, smoke, link, and fixture
  operations will be redesigned before they are reintroduced.

## 1.1.3 - 2026-08-09

### Added

- Added a navigation-only Python skill family with eleven focused children covering conventions,
  debugging, design, development, packaging, performance, project structure, release, testing,
  toolchain, and typing.
- Added a navigation-only CLI skill family for line-oriented TypeScript and Bun tools with six
  focused children covering architecture, development, interface, platform, release, and security.
  The family keeps semantic results separate from terminal presentation and requires named evidence
  for Node.js compatibility.
- Materialized both families in the Claude Code and Codex package views and verified canonical,
  discovery, package, and installed-cache parity.

## 1.1.2 - 2026-08-08

### Changed

- Cowork and Workflow now treat architecture, strategy, naming, vocabulary, functions, classes, interfaces,
  data shapes, and other structure or contract choices as design work, including small local choices. They
  require named independent input and one synthesizer; Partner-enabled design packages also require an
  independent draft and cross-review.
- Delegation now requires exactly one `file`, `commit`, or `response-only` result kind. Durable design and
  evaluation results use exact caller-named files, while intentional commit and response-only flows remain
  valid.
- Claude Plugin repository references now use depth-independent literal paths. Markdown directory checks use
  Git-ignore-aware, NUL-safe product discovery with focused checker coverage.

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
