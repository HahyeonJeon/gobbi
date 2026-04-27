# CLAUDE.md

Gobbi is an open-source ClaudeX (Claude Experience) tool for Claude Code.

MUST load this at session start, resume, and compaction. MUST follow the core principles below. MUST reload skills `/gobbi`

---

## Core Principles

> **The logic of good work: Ideation → Planning → Execution → Memorization → Handoff.**

Every non-trivial task follows these 5 productive steps. Evaluation runs as a sub-phase inside Ideation, Planning, and Execution — mandatory after Execution, optional at the earlier steps. The 6-step state machine (Configuration as the CLI init phase, plus the 5 productive steps) lives in `packages/cli/src/specs/` and is driven by `gobbi workflow init`. Workflow events write to per-session `gobbi.db` at `.gobbi/projects/<name>/sessions/<id>/gobbi.db`; cross-session memory lives in `.gobbi/gobbi.db` (workspace memories projection, git-tracked). Note: `prompt.patch.applied` events write to workspace `.gobbi/state.db` — full workspace consolidation of workflow events is Wave A.1 work, partially shipped.

**Ideation** — Explore what to do. PI agents (innovative + best stances) investigate the problem space with the user. Discuss until the approach is concrete enough to plan against. Optional evaluation.

**Planning** — Decompose the chosen approach into narrow, specific, ordered tasks with clear scope and verification criteria. Optional evaluation.

**Execution** — Implement one task at a time. Complete, verify, then move to the next. Scope is bounded by the plan; no improvisation. Optional evaluation.

**Memorization** — Read the conversation log, extract decisions, state, open questions, and gotchas. Write them where the next session can find them. Without Memorization, every session restarts from zero.

**Handoff** — Write a tight summary for the next session: what was shipped, open threads, decisions to respect, and pointers to key artifacts. Emits `workflow.finish` and closes the session.

> **Evaluation must be separated, multi-perspective, and discussed.**

The agent that creates must never evaluate its own output. Evaluation MUST be performed by independent perspective evaluator agents — the orchestrator selects 2-5 perspectives based on task type, with Project and Overall always included. The evaluator's job is to find problems, not to confirm success. After evaluation, always discuss the findings with the user before improving — the user decides what to address, defer, or disagree with. At every evaluation point: spawn evaluators, discuss findings with user, then improve based on agreed direction — never auto-apply evaluation findings.

> **Detailed prompt first. Vague prompts produce vague work.**

MUST use AskUserQuestion to discuss with the user at every stage — ideation, plan, execution, and completion. Discuss until the prompt becomes a fully detailed specification. Ask about ambiguous requirements, missing constraints, edge cases, and priorities. Give critical opinions — challenge vague ideas, flag potential problems, and suggest alternatives. Never act on assumptions. Every subagent prompt MUST include specific requirements, constraints, expected output, and context — never a one-liner, never ambiguous, never a summary. A subagent that has to guess is a subagent that guesses wrong.

> **Never repeat the same mistake. Read gotchas before acting, write gotchas after feedback.**

Every agent MUST load `_gotcha` skill before starting work. When the user corrects any approach, immediately record it as a gotcha. During an active workflow session, gotchas are written to `.gobbi/projects/{name}/learnings/gotchas/` and promoted to permanent storage in the workspace-level skill storage via `gobbi gotcha promote` outside the session — promotion does not cause context reload. A correction not recorded is a correction repeated across sessions. Gotchas are the highest-value knowledge in this system.

> **Split into narrow tasks. Execute step by step, not all at once.**

MUST decompose work into small, specific tasks and track them with TaskCreate. Each task must be narrow enough that its scope is unambiguous. Execute tasks one at a time — complete one, verify it, then move to the next. Broad parallel execution produces broad shallow mistakes.

---

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [gobbi skill](skills/gobbi/SKILL.md) | Entry point, session setup questions, skill map |
| [_claude skill](skills/_claude/SKILL.md) | Documentation standard for `.claude/` authoring |
| [`v050-overview.md`](../../../.gobbi/projects/gobbi/design/v050-overview.md) | v0.5.0 state machine, 6-step workflow, per-session/workspace DB split — authoritative architecture doc |
| [`v050-cli.md`](../../../.gobbi/projects/gobbi/design/v050-cli.md) | CLI command surface, `gobbi workflow *` and `gobbi project *` commands |
| [rules/](rules/) | Naming conventions and project rules |
