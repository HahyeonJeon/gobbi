> **⚠ v0.5.0 in progress** — PRs A–F are building the state-driven workflow (`gobbi workflow init`) that will replace the current skill-based orchestration. During this transition, both systems coexist in the repo but the current workflow continues to use the skill-based cycle. Track progress in #77.

# CLAUDE.md

Gobbi is an open-source ClaudeX (Claude Experience) tool for Claude Code.

MUST load this at session start, resume, and compaction. MUST follow the core principles below. MUST reload skills `/gobbi`

---

## Core Principles

> **The logic of good work: ideate (stances) → plan → research (stances) → execute → collect → memorize → review (stances). Evaluate after each creative step.**

Every non-trivial task must follow this cycle. Each stage produces output, evaluation catches problems before they propagate. Evaluation is optional after ideation, planning, research, and execution — always ask before spawning evaluators. Evaluation findings must be discussed with the user before acting on them.

1. **Ideation** — PI agents (innovative + best stances) explore what to do. Orchestrator discusses with user first, then synthesizes options. Optional evaluation.
2. **Plan** — use EnterPlanMode. Decompose the chosen idea into narrow, specific, ordered tasks with clear scope and verification criteria. Optional evaluation.
3. **Research** — Researcher agents (innovative + best stances) investigate how to implement the approved plan. Orchestrator synthesizes findings. Optional evaluation.
4. **Execution** — Executors read research first, then implement one task at a time. Complete, verify, then move to the next. Optional evaluation.
5. **Collection** — verify notes, write README, record gotchas. Ensure project documentation reflects what was done.
6. **Memorization** — save context for session continuity. Capture decisions, state, and open questions so the next session can resume without re-discovery.
7. **Review** — PI agents assess the work with verdict and documentation. Then FEEDBACK (return to earlier step) or FINISH.

> **Evaluation must be separated, multi-perspective, and discussed.**

The agent that creates must never evaluate its own output. Evaluation MUST be performed by independent perspective evaluator agents — the orchestrator selects 2-5 perspectives based on task type, with Project and Overall always included. The evaluator's job is to find problems, not to confirm success. After evaluation, always discuss the findings with the user before improving — the user decides what to address, defer, or disagree with. At every evaluation point: spawn evaluators, discuss findings with user, then improve based on agreed direction — never auto-apply evaluation findings.

> **Detailed prompt first. Vague prompts produce vague work.**

MUST use AskUserQuestion to discuss with the user at every stage — ideation, plan, execution, and completion. Discuss until the prompt becomes a fully detailed specification. Ask about ambiguous requirements, missing constraints, edge cases, and priorities. Give critical opinions — challenge vague ideas, flag potential problems, and suggest alternatives. Never act on assumptions. Every subagent prompt MUST include specific requirements, constraints, expected output, and context — never a one-liner, never ambiguous, never a summary. A subagent that has to guess is a subagent that guesses wrong.

> **Never repeat the same mistake. Read gotchas before acting, write gotchas after feedback.**

Every agent MUST load _gotcha skill before starting work. When the user corrects any approach, immediately record it as a gotcha. A correction not recorded is a correction repeated across sessions. Gotchas are the highest-value knowledge in this system.

> **Split into narrow tasks. Execute step by step, not all at once.**

MUST decompose work into small, specific tasks and track them with TaskCreate. Each task must be narrow enough that its scope is unambiguous. Execute tasks one at a time — complete one, verify it, then move to the next. Broad parallel execution produces broad shallow mistakes.

---

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [gobbi skill](skills/gobbi/SKILL.md) | Entry point, session setup questions, skill map |
| [_claude skill](skills/_claude/SKILL.md) | Documentation standard for `.claude/` authoring |
| [rules/](rules/) | Naming conventions and project rules |