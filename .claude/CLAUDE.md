# CLAUDE.md

Gobbi is an open-source ClaudeX (Claude Experience) tool for Claude Code.

MUST load this at session start, resume, and compaction. MUST follow the core principles below. MUST reload skills `/gobbi`

---

## Core Principles

> **The logic of good work: Ideation → Plan → Execution → Evaluation → Memorization.**

Every non-trivial task must follow this cycle. Research is absorbed into Ideation's internal loop — it surfaces as discussion and investigation, not as a separate step. Evaluation is a first-class step, mandatory after Execution and optional at earlier steps. The state machine lives in `packages/cli/src/specs/` and is driven by `gobbi workflow init`.

**Ideation** — Explore what to do. PI agents (innovative + best stances) investigate the problem space with the user. Discuss until the approach is concrete enough to plan against. Optional evaluation.

**Plan** — Decompose the chosen approach into narrow, specific, ordered tasks with clear scope and verification criteria. Optional evaluation.

**Execution** — Implement one task at a time. Complete, verify, then move to the next. Scope is bounded by the plan; no improvisation. Optional evaluation.

**Evaluation** — Assess the work. Mandatory after Execution; optional at Ideation and Plan. Can loop back to any prior step. The creating agent never evaluates its own output.

**Memorization** — Read the conversation log, extract decisions, state, open questions, and gotchas. Write them where the next session can find them. Without Memorization, every session restarts from zero.

> **Evaluation must be separated, multi-perspective, and discussed.**

The agent that creates must never evaluate its own output. Evaluation MUST be performed by independent perspective evaluator agents — the orchestrator selects 2-5 perspectives based on task type, with Project and Overall always included. The evaluator's job is to find problems, not to confirm success. After evaluation, always discuss the findings with the user before improving — the user decides what to address, defer, or disagree with. At every evaluation point: spawn evaluators, discuss findings with user, then improve based on agreed direction — never auto-apply evaluation findings.

> **Detailed prompt first. Vague prompts produce vague work.**

MUST use AskUserQuestion to discuss with the user at every stage — ideation, plan, execution, and completion. Discuss until the prompt becomes a fully detailed specification. Ask about ambiguous requirements, missing constraints, edge cases, and priorities. Give critical opinions — challenge vague ideas, flag potential problems, and suggest alternatives. Never act on assumptions. Every subagent prompt MUST include specific requirements, constraints, expected output, and context — never a one-liner, never ambiguous, never a summary. A subagent that has to guess is a subagent that guesses wrong.

> **Never repeat the same mistake. Read gotchas before acting, write gotchas after feedback.**

Every agent MUST load `_gotcha` skill before starting work. When the user corrects any approach, immediately record it as a gotcha. During an active workflow session, gotchas are written to `.gobbi/project/gotchas/` and promoted to permanent storage in `.claude/skills/_gotcha/` via `gobbi gotcha promote` outside the session — promotion does not cause context reload. A correction not recorded is a correction repeated across sessions. Gotchas are the highest-value knowledge in this system.

> **Split into narrow tasks. Execute step by step, not all at once.**

MUST decompose work into small, specific tasks and track them with TaskCreate. Each task must be narrow enough that its scope is unambiguous. Execute tasks one at a time — complete one, verify it, then move to the next. Broad parallel execution produces broad shallow mistakes.

---

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [gobbi skill](skills/gobbi/SKILL.md) | Entry point, session setup questions, skill map |
| [_claude skill](skills/_claude/SKILL.md) | Documentation standard for `.claude/` authoring |
| [design/v050-overview.md](project/gobbi/design/v050-overview.md) | v0.5.0 state machine, 5-step cycle, directory split |
| [design/v050-cli.md](project/gobbi/design/v050-cli.md) | CLI command surface, `gobbi workflow *` commands |
| [rules/](rules/) | Naming conventions and project rules |
