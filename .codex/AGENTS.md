# AGENTS.md

Gobbi is an open-source ClaudeX (Claude Experience) tool. In this repository, Gobbi is exposed to Codex through the official repo-local Codex paths:

- Skills: `.agents/skills/<skill-name>/SKILL.md`
- Custom agents: `.codex/agents/<role>.toml`
- Shared plugin package: `plugins/gobbi/`
- Codex plugin manifest: `plugins/gobbi/.codex-plugin/plugin.json`
- Claude Code plugin manifest: `plugins/gobbi/.claude-plugin/plugin.json`
- Canonical plugin skill sources: `.gobbi/projects/gobbi/skills/<skill-name>/SKILL.md`
- Canonical Gobbi sources: `.gobbi/projects/gobbi/skills/` and `.gobbi/projects/gobbi/agents/`

MUST read this at session start, resume, `/clear`, and compaction. MUST follow the core principles below. MUST load Gobbi skills from `.agents/skills`, not user-level skill locations.

The repo also exposes Gobbi as a local Claude Code and Codex plugin through one bounded package at `plugins/gobbi/`. The package carries both manifests: `plugins/gobbi/.claude-plugin/plugin.json` for Claude Code and `plugins/gobbi/.codex-plugin/plugin.json` for Codex. `.claude-plugin/marketplace.json` and `.agents/plugins/marketplace.json` both point at `./plugins/gobbi`, using their ecosystem-specific marketplace schemas.

---

## Codex Entry Points

`.agents/skills` contains symlinked skill folders pointing to `.gobbi/projects/gobbi/skills/`.

`plugins/gobbi/skills` is the plugin-facing skills directory. It is a symlink to `.gobbi/projects/gobbi/skills/`; `plugins/gobbi/agents` is a symlink to `.gobbi/projects/gobbi/agents/`; `plugins/gobbi/hooks` is a symlink to `.gobbi/projects/gobbi/hooks/`. The development hook scripts under `.claude/hooks/` are also symlinks to the same canonical hook directory. Run `scripts/sync-plugin-package.sh --check` to verify this topology.

Claude marketplace install dereferences these repo-internal symlinks into a complete installed cache. Codex install currently registers `gobbi@gobbi-workspace` as installed and enabled, but its cache skips the symlinked component directories and keeps only the manifests; treat Codex plugin support as source-package valid but installed-cache incomplete until Codex symlink handling changes.

`plugins/gobbi/.codex-plugin/plugin.json` is the Gobbi Codex plugin manifest for local plugin installation from this workspace.

`plugins/gobbi/.claude-plugin/plugin.json` is the Gobbi Claude Code plugin manifest for local plugin installation from this workspace.

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

> **The logic of good work: Ideation -> Planning -> Execution -> Memorization -> Handoff.**

Every non-trivial task follows these 5 productive steps. Evaluation runs as a sub-phase inside Ideation, Planning, and Execution; it is mandatory after Execution and optional at the earlier steps. The 6-step state machine (Configuration plus the 5 productive steps) is governed by the `orchestration` skill and its per-step `workflow/` sub-documents — markdown-driven, no CLI. Per-session telemetry lives in `<sessionDir>/session.json`. Cross-session memory lives directly under `.gobbi/projects/<name>/` as plain markdown trees (`features/{f}/...`, `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/`, etc.).

**Ideation** - Explore what to do. PI agents investigate the problem space with the user. Discuss until the approach is concrete enough to plan against. Optional evaluation.

**Planning** - Decompose the chosen approach into narrow, specific, ordered tasks with clear scope and verification criteria. Optional evaluation.

**Execution** - Implement one task at a time. Complete, verify, then move to the next. Scope is bounded by the plan; no improvisation. Mandatory evaluation after execution.

**Memorization** - Read the conversation log, extract decisions, state, open questions, and mistakes. Write them where the next session can find them.

**Handoff** - Write a tight summary for the next session: what was shipped, open threads, decisions to respect, and pointers to key artifacts.

> **Evaluation is a mandatory sub-phase in the Gobbi workflow.**

Evaluation runs inside Ideation, Planning, and Execution. The orchestrator selects evaluator perspectives based on task type, with Project and Overall always included. After evaluation, discuss findings with the user before improving. Never auto-apply evaluation findings. Producer/evaluator separation and perspective discipline live in `.agents/skills/evaluation/SKILL.md`.

> **MUST load `.agents/skills/principles/SKILL.md` at session start, resume, /clear, and /compact.**

The 8 principles below are the enforceable behavioral discipline for every agent. The principle table is the always-visible summary; load the skill for the full rationale and detail behind each principle.

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

> **Gobbi-specific tooling: the `mistake` skill and Wrap-up-phase promotion.**

Every agent MUST load `.agents/skills/mistake/SKILL.md` before starting work. When the user corrects any approach, immediately record it as a mistake-candidate in session staging. During the Wrap-up phase, the Wrap-up assistant promotes staged candidates to project memory (`.gobbi/projects/{name}/mistakes/`) — Layer 1. The Wrap-up assistant also performs Layer-2 promotion: moving generalizable project-mistakes to workspace-level skill storage so they persist across all projects and future sessions. No CLI command. Promotion does not cause context reload.

---

## Navigate Deeper

| Document | Covers |
|----------|--------|
| `.agents/skills/gobbi/SKILL.md` | Entry point, session setup questions, skill map |
| `plugins/gobbi/.codex-plugin/plugin.json` | Local Gobbi Codex plugin manifest |
| `plugins/gobbi/.claude-plugin/plugin.json` | Local Gobbi Claude Code plugin manifest |
| `plugins/gobbi/` | Shared bounded plugin package |
| `.gobbi/projects/gobbi/skills/` | Canonical Gobbi skills directory |
| `.agents/skills/principles/SKILL.md` | 8 behavioral principles every agent must follow |
| `.agents/skills/orchestration/SKILL.md` | Workflow state machine and delegation contracts |
| `.agents/skills/evaluation/SKILL.md` | Evaluation perspectives, finding metadata, verdict rules |
| `.codex/agents/manager.toml` | Root session manager custom-agent wrapper |
| `.codex/agents/leader.toml` | Ideation, preparation, research, and planning custom-agent wrapper |
| `.codex/agents/executor.toml` | Scoped implementation custom-agent wrapper |
| `.codex/agents/evaluator.toml` | Independent adversarial evaluation custom-agent wrapper |
| `.codex/agents/assistant.toml` | Narrow lookup and memorization support custom-agent wrapper |
