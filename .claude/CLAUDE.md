# CLAUDE.md

Gobbi is an open-source ClaudeX (Claude Experience) tool for Claude Code.

MUST load this at session start, resume, `/clear`, and compaction. MUST follow the core principles below. MUST reload skills `/gobbi`

---

## Core Principles

> **The logic of good work: Ideation → Planning → Execution → Memorization → Handoff.**

Every non-trivial task follows these 5 productive steps. Evaluation runs as a sub-phase inside Ideation, Planning, and Execution — mandatory after Execution, optional at the earlier steps. The 6-step state machine (Configuration as the CLI init phase, plus the 5 productive steps) lives in `packages/cli/src/specs/` and is driven by `gobbi workflow init`. Workflow events write to per-session `gobbi.db` at `.gobbi/projects/<name>/sessions/<id>/gobbi.db`. Note: `prompt.patch.applied` events write to workspace `.gobbi/state.db` — full workspace consolidation of workflow events is Wave A.1 work, partially shipped. Per-session telemetry lives in `<sessionDir>/session.json` (one file per session, generated at Memorization STEP_EXIT). Cross-session memory lives in `.gobbi/projects/<name>/project.json` (per-project, git-tracked). The retired files (`state.json`, `state.json.backup`, per-session `metadata.json`, session-root `artifacts/`) were unified into the JSON-memory shape in PR-FIN-2a-ii.

**Ideation** — Explore what to do. PI agents (innovative + best stances) investigate the problem space with the user. Discuss until the approach is concrete enough to plan against. Optional evaluation.

**Planning** — Decompose the chosen approach into narrow, specific, ordered tasks with clear scope and verification criteria. Optional evaluation.

**Execution** — Implement one task at a time. Complete, verify, then move to the next. Scope is bounded by the plan; no improvisation. Optional evaluation.

**Memorization** — Read the conversation log, extract decisions, state, open questions, and gotchas. Write them where the next session can find them. Without Memorization, every session restarts from zero.

**Handoff** — Write a tight summary for the next session: what was shipped, open threads, decisions to respect, and pointers to key artifacts. Emits `workflow.finish` and closes the session.

> **Evaluation is a mandatory sub-phase in the gobbi workflow.**

Evaluation runs inside Ideation, Planning, and Execution — mandatory after Execution, optional at the earlier steps. The orchestrator selects 2-5 evaluator perspectives based on task type, with Project and Overall always included. After evaluation, discuss findings with the user before improving — the user decides what to address, defer, or disagree with. Never auto-apply evaluation findings. The principle-level discipline (who evaluates whom, perspective separation) lives in `agent-principles` Principle 2.

> **Agent behavioral principles apply on every task. Load [agent-principles](skills/agent-principles/SKILL.md).**

The 9 principles below are the enforceable behavioral discipline for every agent. The [agent-principles](skills/agent-principles/SKILL.md) skill holds the depth; `gobbi-rule` is the always-active enforcement subset.

| # | Iron Law |
|---|---|
| 1 | NO ACTION WITHOUT INVESTIGATION FIRST. |
| 2 | ONE AGENT, ONE PERSPECTIVE, ONE CATEGORY. |
| 3 | BUILD FROM THE BASE UP, ONE STEP AT A TIME, WITH THE USER IN THE LOOP. |
| 4 | SCOPE IS BOUNDED BY THE CONTRACT WITH THE USER. |
| 5 | NO DESIGN WITHOUT PRIOR ART AND USER ALIGNMENT. |
| 6 | REFUSE TO TRANSACT IN VAGUENESS. |
| 7 | NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE. |
| 8 | EVERY IMPLEMENTATION CHANGE MUST BE REFLECTED IN DOCUMENTATION. |
| 9 | EVERY DESIGN AND IMPLEMENTATION DECISION IS JUDGED FROM THE USER'S POINT OF VIEW. |

> **Gobbi-specific tooling: the `gotcha` skill and `gobbi gotcha promote` command.**

Every agent MUST load the `gotcha` skill before starting work. When the user corrects any approach, immediately record it as a gotcha in `.gobbi/projects/{name}/gotchas/`. After the session ends, run `gobbi gotcha promote` to promote corrections to permanent workspace-level skill storage — promotion does not cause context reload. A correction not recorded is a correction repeated across sessions. Gotchas are the highest-value knowledge in this system.

---

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [gobbi skill](skills/gobbi/SKILL.md) | Entry point, session setup questions, skill map |
| [claude skill](skills/claude/SKILL.md) | Documentation standard for `.claude/` authoring |
| [agent-principles](skills/agent-principles/SKILL.md) | 9 behavioral principles every agent must follow — depth behind each gobbi-rule bullet |
| [`v050-overview.md`](../../../.gobbi/projects/gobbi/design/v050-overview.md) | v0.5.0 state machine, 6-step workflow, workspace `state.db` + per-session `gobbi.db` + JSON memory (`session.json` + `project.json`) — authoritative architecture doc |
| [`v050-cli.md`](../../../.gobbi/projects/gobbi/design/v050-cli.md) | CLI command surface, `gobbi workflow *` and `gobbi project *` commands |
| [rules/](rules/) | Project rules |
