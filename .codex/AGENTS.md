# AGENTS.md

Gobbi is an open-source ClaudeX (Claude Experience) tool. In this repository, Gobbi is exposed to Codex through the official repo-local Codex paths:

- Skills: `.agents/skills/<skill-name>/SKILL.md`
- Custom agents: `.codex/agents/<role>.toml`
- Shared plugin package: `plugins/gobbi/`
- Codex plugin manifest: `plugins/gobbi/.codex-plugin/plugin.json`
- Claude Code plugin manifest: `plugins/gobbi/.claude-plugin/plugin.json`
- Canonical plugin skill sources: `.gobbi/projects/gobbi/skills/<skill-name>/SKILL.md`
- Canonical Gobbi sources: `.gobbi/projects/gobbi/skills/` and `.gobbi/projects/gobbi/agents/`

MUST read this at session start, resume, `/clear`, and compaction. MUST follow the core principles below. MUST load Gobbi skills from the repo-local canonical source `.gobbi/projects/gobbi/skills/` (the single source of truth for both runtimes; the Codex discovery symlink points to it, per § Codex Entry Points), not user-level skill locations.

The repo also exposes Gobbi as a local Claude Code and Codex plugin through one bounded package at `plugins/gobbi/`. The package carries both manifests: `plugins/gobbi/.claude-plugin/plugin.json` for Claude Code and `plugins/gobbi/.codex-plugin/plugin.json` for Codex. `.claude-plugin/marketplace.json` and `.agents/plugins/marketplace.json` both point at `./plugins/gobbi`, using their ecosystem-specific marketplace schemas.

---

## Codex Entry Points

`.agents/skills` contains symlinked skill folders pointing to `.gobbi/projects/gobbi/skills/`.

`plugins/gobbi/skills`, `plugins/gobbi/agents`, and `plugins/gobbi/hooks` are symlinks to the canonical Gobbi directories at `.gobbi/projects/gobbi/{skills,agents,hooks}`. The development hook scripts under `.claude/hooks/` are also symlinks to the canonical hook directory. Run `scripts/sync-plugin-package.sh` to restore the symlink topology, and `scripts/sync-plugin-package.sh --check` to verify it.

Codex source-package support and Codex installed-cache support are separate. This repository keeps the source package symlinked. Use `scripts/check-codex-plugin-smoke.sh` to register the repo root in an isolated Codex home, add `gobbi@gobbi-workspace`, and report whether the installed cache includes symlinked skills and hooks. If the installed cache omits symlinked component directories, treat that as a Codex plugin-install limitation; do not materialize the repo package to work around it.

`plugins/gobbi/.codex-plugin/plugin.json` is the Gobbi Codex plugin manifest for local plugin installation from this workspace. It declares plugin-distributed skills and Codex-safe hooks. Native Codex custom agents remain repo-local under `.codex/agents/*.toml`; they are not installed as Codex plugin components.

`plugins/gobbi/.claude-plugin/plugin.json` is the Gobbi Claude Code plugin manifest for local plugin installation from this workspace.

For a real local Codex plugin install, run `codex plugin marketplace add <repo-root>`, then `codex plugin add gobbi@gobbi-workspace`, then start a new Codex thread. The project must be trusted before project config, hooks, and rules are loaded.

`.codex/agents` contains symlinked TOML custom-agent wrappers pointing to `.gobbi/projects/gobbi/agents/*.toml`. Each wrapper instructs the spawned Codex agent to read the corresponding canonical Markdown role prompt in the same directory.

Available role prompts:

| Custom agent | Codex wrapper | Canonical prompt |
|--------------|---------------|------------------|
| `manager` | `.gobbi/projects/gobbi/agents/manager.toml` | `.gobbi/projects/gobbi/agents/manager.md` |
| `leader` | `.gobbi/projects/gobbi/agents/leader.toml` | `.gobbi/projects/gobbi/agents/leader.md` |
| `executor` | `.gobbi/projects/gobbi/agents/executor.toml` | `.gobbi/projects/gobbi/agents/executor.md` |
| `evaluator` | `.gobbi/projects/gobbi/agents/evaluator.toml` | `.gobbi/projects/gobbi/agents/evaluator.md` |
| `assistant` | `.gobbi/projects/gobbi/agents/assistant.toml` | `.gobbi/projects/gobbi/agents/assistant.md` |

When Codex subagents are explicitly authorized by the user, use these custom agents by role and include explicit load directives for `principles`, project rules, `mistake`, and any phase-specific skills. Fresh subagents do not inherit loaded skills.

---

## Core Principles

> **The logic of good work: Configuration -> Ideation -> Planning -> Execution -> Wrap-up.**

Every session runs this 5-step state machine — Configuration plus four productive steps — governed by the `orchestration` skill and its per-step `workflow/` sub-documents (markdown-driven, no CLI). Each productive step runs as a 4-sub-phase **loop**: DISCUSSION -> WORK -> EVALUATION -> **RECORD**. RECORD is the per-loop capture sub-phase — it stages findings, decisions, and mistake-candidates to the worktree-local session record; it never writes durable memory. Durable promotion happens in **Wrap-up**, whose 5-stage pipeline includes the **promotion** stage (stage 2 — promote the session record into memory) and the **handoff** stage (stage 4 — the next-session summary). The canonical loop / sub-phase / stage vocabulary — including the stage names — lives in one place: the gobbi skill Glossary at `.gobbi/projects/gobbi/skills/gobbi/SKILL.md`. This top-block defers to it rather than restating the enum. Per-session telemetry lives in `<sessionDir>/session.json`. Cross-session durable memory lives directly under `.gobbi/projects/<name>/` as plain markdown trees (`features/{f}/...`, `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/`, etc.).

**Configuration** - Session start: settings, memory check, workflow configuration. Not a loop.

**Ideation** - Explore what to do. PI agents investigate the problem space with the user. Discuss until the approach is concrete enough to plan against. Optional evaluation.

**Planning** - Begin DISCUSSION with a readiness gate over locked Ideation, memory, skills, authority, and staging; then decompose the chosen approach into narrow, specific, ordered tasks with clear scope and verification criteria. Non-skippable; optional evaluation.

**Execution** - Implement one task at a time. Complete, verify, then move to the next. Scope is bounded by the plan; no improvisation. Mandatory evaluation.

**Wrap-up** - Consolidate the session through a 5-stage pipeline: session-record validation, **promotion** (write the session record into memory), memory validation (the dual-system evaluation gate), **handoff** (the next-session summary), then git finalization. Emits `workflow.finish` and closes the session. Mandatory evaluation. (The Glossary at `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` holds the canonical name for each stage; this top-block uses plain descriptive words and defers to the Glossary.)

> **Evaluation is a mandatory sub-phase in the Gobbi workflow.**

Evaluation runs inside Ideation, Planning, and Execution. The orchestrator spawns exactly two evaluators in parallel — one per system (Claude + Codex) — and each covers all seven perspectives + Overall; cross-system divergence is the anti-groupthink signal. After evaluation, discuss findings with the user before improving. Never auto-apply evaluation findings. Producer/evaluator separation and perspective discipline live in `.gobbi/projects/gobbi/skills/evaluation/SKILL.md`.

> **MUST load `.gobbi/projects/gobbi/skills/principles/SKILL.md` at session start, resume, /clear, and /compact.**

The 10 principles below are the enforceable behavioral discipline for every agent. The principle table is the always-visible summary; load the skill for the full rationale and detail behind each principle.

| # | Principle |
|---|---|
| 1 | Think and Study Before Acting: NO ACTION WITHOUT THINKING AND STUDYING IT THROUGH FIRST. |
| 2 | Bottom-Up Construction: BUILD THE FOUNDATION FIRST, THEN GROW IT ONE MINIMAL STEP AT A TIME. |
| 3 | Design With the User, Based on References: NO DESIGN WITHOUT PRIOR ART AND USER ALIGNMENT. |
| 4 | Refine the Task With the User: A PROMPT IS A TRIGGER, NOT A SPEC — ASK FOR WHAT / WHY / HOW UNTIL THE TASK IS CONCRETE. |
| 5 | Scope Is a Contract With the User: OUT-OF-SCOPE WORK WITHOUT THE USER'S DECISION IS A BREACH OF CONTRACT. |
| 6 | Start With Docs, Finish With Docs — Documents Are the Team's Memory: PLAN DOC WORK WITH A SPEC AND A CRUD PLAN, AND KEEP IT CURRENT. |
| 7 | Say/Write Plainly, Briefly, and Literally: SIMPLE WORDS, SHORT SENTENCES, NO FILLER, NO METAPHOR. |
| 8 | Fix the Root Cause, Not the Symptom: KEEP ASKING WHY UNTIL YOU REACH THE ROOT; A FIX YOU CAN'T EXPLAIN IS A GUESS. |
| 9 | Think CRUD-and-5W1H Before Editing: NO EDIT WITHOUT CHECKING ITS CRUD AND 5W1H ACROSS TARGET AND AFFECTED FILES. |
| 10 | Finish In-Scope Work — Do Not Defer It: COMPLETE EVERYTHING WITHIN THE AGREED SCOPE; DO NOT DEFER IN-SCOPE WORK. |

> **Gobbi-specific tooling: the `mistake` skill and Wrap-up-phase promotion.**

Every agent MUST load `.gobbi/projects/gobbi/skills/mistake/SKILL.md` before starting work. When the user corrects any approach, immediately record it as a mistake-candidate in session staging. During the Wrap-up phase, the Wrap-up assistant promotes each staged candidate to one of two homes (Always-Ask routing): a **skill-owned** trap becomes a `## ` section in `skills/{skill}/mistakes.md`, loaded in that skill's context via the delegation Load-Directives companion path; a **cross-cutting / no-owner** trap stays in the project `mistakes/` tier (`.gobbi/projects/{name}/mistakes/`), loaded at session start. No CLI command. Promotion does not cause context reload.

---

## Navigate Deeper

| Document | Covers |
|----------|--------|
| `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` | Entry point, session setup questions, skill map |
| `plugins/gobbi/.codex-plugin/plugin.json` | Local Gobbi Codex plugin manifest |
| `plugins/gobbi/.claude-plugin/plugin.json` | Local Gobbi Claude Code plugin manifest |
| `plugins/gobbi/` | Shared bounded plugin package |
| `.gobbi/projects/gobbi/skills/` | Canonical Gobbi skills directory |
| `.gobbi/projects/gobbi/skills/principles/SKILL.md` | 10 behavioral principles every agent must follow |
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | Workflow state machine and delegation contracts |
| `.gobbi/projects/gobbi/skills/evaluation/SKILL.md` | Evaluation perspectives, finding metadata, verdict rules |
| `.codex/agents/manager.toml` | Root session manager custom-agent wrapper |
| `.codex/agents/leader.toml` | Ideation, research, and planning custom-agent wrapper |
| `.codex/agents/executor.toml` | Scoped implementation custom-agent wrapper |
| `.codex/agents/evaluator.toml` | Independent adversarial evaluation custom-agent wrapper |
| `.codex/agents/assistant.toml` | Narrow lookup and RECORD support custom-agent wrapper |
