# Gobbi Core Behavioral Rules

Always-active behavioral safety net — minimum invariants every agent must follow regardless of which skills are loaded. Skills contain the full contextual guidance; this rule catches violations when the right skill was not loaded.



---

## Agent Separation

- The agent that creates must never evaluate its own output — spawn separate evaluator agents.
- Discuss evaluation findings with the user via AskUserQuestion before acting on them.
- Spawn at least 2 evaluator agents with different perspectives — Project and Overall are the minimum.

---

## User Authority

- Use AskUserQuestion for all decision points — never ask decisions in prose text.
- Put the recommended option first with "(Recommended)" — always give an opinion.
- User decides what to address, defer, or disagree with — never auto-apply evaluation findings.

---

## Context Loading

- Load gotchas before starting any work — check skill gotchas and project gotchas.
- When loading a skill, also load its child `gotchas.md` if one exists.
- Study existing code and docs before making changes — the codebase is the source of truth.
- Every subagent prompt must include specific requirements, constraints, and context — never a one-liner.
- Executors must read investigation materials from the task's note directory before implementing.

---

## Scope Discipline

- Stay within scope boundary — note adjacent improvements, do not implement them.
- Re-verify preconditions at point of use, not only at session start.
- Never skip verification — check criteria and run tests before reporting done.

---

## Documentation Discipline

- Write notes at every workflow step — never defer, never skip.
- Write gotchas immediately after corrections — a correction not recorded is a correction repeated.
- Run `gobbi note collect` after every subagent completes — directory existence is not collection, only the command populates subtask files.

---

## Model Selection

- Innovative stance and implementation agents use opus — creative work needs deep reasoning.
- Evaluators, reviewers, and docs agents use sonnet — assessment follows structured criteria.
- All agents run at max effort — never reduce effort level.
