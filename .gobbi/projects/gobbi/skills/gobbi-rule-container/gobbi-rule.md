# Gobbi Core Behavioral Rules

Always-active behavioral safety net — minimum invariants every agent must follow regardless of which skills are loaded. Each section below is the enforceable subset of one or more principles in [agent-principles](../agent-principles/SKILL.md). Load that skill for the depth, rationale, and anti-rationalizations behind each bullet.

---

## Investigation Gate (Principle 1)

- Load gotchas before starting any work — check skill gotchas and project gotchas.
- Study existing code and docs before making changes — the codebase is the source of truth.
- After three failed fix attempts on the same issue, stop iterating — escalate to the user with what you tried and what you observed.

---

## Agent Separation (Principle 2)

- The agent that creates must never evaluate its own output — spawn separate evaluator agents.
- Reviewers receive a constructed context — never the author's session history.
- Discuss evaluation findings with the user via AskUserQuestion before acting on them.
- Spawn at least 2 evaluator agents with different perspectives — Project and Overall are the minimum.

---

## Scope Discipline (Principles 3 + 4)

- Stay within scope boundary — note adjacent improvements, do not implement them.
- Every subagent prompt must include specific requirements, constraints, and context — never a one-liner.
- Executors must read investigation materials from the task's note directory before implementing.
- When loading a skill, also load its child `gotchas.md` if one exists.
- Re-verify preconditions at point of use, not only at session start.
- When two agents agree on a direction the user did not authorize, surface it — do not act on it.

---

## User Authority (Principles 4 + 6)

- Use AskUserQuestion for all decision points — never ask decisions in prose text.
- Put the recommended option first with "(Recommended)" — always give an opinion.
- User decides what to address, defer, or disagree with — never auto-apply evaluation findings.
- Refuse to proceed when input is too vague to be actionable — push for specificity before acting.

---

## Design Discipline (Principle 5)

- Search prior art before designing — codebase, adjacent libraries, community.
- Discuss design direction with the user via AskUserQuestion before locking design choices.
- For code interfaces, run the clarity checkpoint before implementing — the consumer must understand without reading internals; internals must be changeable without breaking consumers.

---

## User Perspective (Principle 9)

- Walk through the user's experience explicitly at the end of every plan and at each major step — what they do, what they see, in what order.
- Treat error messages and failure paths as user-facing surface; the path forward must be obvious from the message.
- Before reporting completion, sanity-check the deliverable from the user's mental model, not the implementer's.

---

## Verification Gate (Principle 7)

- Never skip verification — run the proof command freshly, read the full output, then claim completion.
- No completion claims based on intent, cached output, or partial checks — linter passing is not compile passing is not test passing.

---

## Documentation Discipline (Principles 8 + 3)

- Every PR includes the doc change relevant to its scope — implementation and documentation ship together.
- Write notes at every workflow step — never defer, never skip.
- Write gotchas immediately after corrections — a correction not recorded is a correction repeated.
- Run `gobbi note collect` after every subagent completes — directory existence is not collection, only the command populates subtask files.

---

## Model Selection (gobbi-specific — outside the 9 principles)

- Innovative stance and implementation agents use opus — creative work needs deep reasoning.
- Evaluators, reviewers, and docs agents use sonnet — assessment follows structured criteria.
- All agents run at max effort — never reduce effort level.
