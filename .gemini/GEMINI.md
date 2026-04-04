# GEMINI.md

Gobbi is an open-source tool for Gemini CLI.

MUST load this at session start, resume, and compaction. MUST follow the core principles below. MUST reload skills `/gobbi`

---

## Core Principles

> **The logic of good work: ideate → (evaluate) → improve → plan → (evaluate) → improve → execute → evaluate → fix or next.**

Every non-trivial task must follow this cycle. Each stage produces output, evaluation catches problems before they propagate, and improvement refines before moving forward. Evaluation is a user choice at ideation and planning — always ask before spawning evaluators. Evaluation findings must be discussed with the user before acting on them.

1. **Ideation** — generate concrete options for the approach. Think through alternatives, trade-offs, and risks. Do not commit to the first idea.
2. **Ask to evaluate** — evaluation is optional at ideation. Ask the user whether to evaluate or move forward.
3. **Evaluation** (if requested) — independent perspective evaluator agents (selected by the orchestrator based on task type) assess the ideas independently.
4. **Discuss evaluation** — present findings to the user. Discuss which to address vs defer. Evaluation findings are input to a conversation, not automatic marching orders.
5. **Improved idea** — refine based on the agreed-upon direction. Merge strengths, discard weak options, fill gaps.
6. **Plan** — use EnterPlanMode. Decompose the improved idea into narrow, specific, ordered tasks with clear scope and verification criteria.
7. **Ask to evaluate** — evaluation is optional at planning. Ask the user whether to evaluate or approve.
8. **Evaluation** (if requested) — independent perspective evaluator agents (selected by the orchestrator based on task type) assess the plan independently.
9. **Discuss evaluation** — present findings to the user. Discuss which to revise vs accept.
10. **Improved plan** — use EnterPlanMode to revise. Refine the plan based on the agreed-upon direction and track tasks. Each task must be unambiguous in scope.
11. **Execution** — implement one task at a time. Complete, verify, then move to the next.
12. **Evaluation** — independent perspective evaluator agents (selected by the orchestrator based on task type) assess the output against the task criteria and the original goal.
13. **Fix or next step** — if evaluation finds issues, fix them before proceeding. If clean, move to the next task.

> **Evaluation must be separated, multi-perspective, and discussed.**

The agent that creates must never evaluate its own output. Evaluation MUST be performed by independent perspective evaluator agents — the orchestrator selects 2-5 perspectives based on task type, with Project and Overall always included. The evaluator's job is to find problems, not to confirm success. After evaluation, always discuss the findings with the user before improving — the user decides what to address, defer, or disagree with.

> **Detailed prompt first. Vague prompts produce vague work.**

MUST use ask_user to discuss with the user at every stage — ideation, plan, execution, and completion. Discuss until the prompt becomes a fully detailed specification. Ask about ambiguous requirements, missing constraints, edge cases, and priorities. Give critical opinions — challenge vague ideas, flag potential problems, and suggest alternatives. Never act on assumptions. Every subagent prompt MUST include specific requirements, constraints, expected output, and context — never a one-liner, never ambiguous, never a summary. A subagent that has to guess is a subagent that guesses wrong.

> **Never repeat the same mistake. Read gotchas before acting, write gotchas after feedback.**

Every agent MUST load _gotcha skill before starting work. When the user corrects any approach, immediately record it as a gotcha. A correction not recorded is a correction repeated across sessions. Gotchas are the highest-value knowledge in this system.

> **Split into narrow tasks. Execute step by step, not all at once.**

MUST decompose work into small, specific tasks and track them with Plan Mode. Each task must be narrow enough that its scope is unambiguous. Execute tasks one at a time — complete one, verify it, then move to the next. Broad parallel execution produces broad shallow mistakes.

---

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [gobbi skill](skills/gobbi/SKILL.md) | Entry point, session setup questions, skill map |
| [_claude skill](skills/_claude/SKILL.md) | Documentation standard for `.gemini/` authoring |
| [rules/](rules/) | Naming conventions and project rules |