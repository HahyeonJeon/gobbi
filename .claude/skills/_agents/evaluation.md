# Agent Definition Evaluation

Evaluation criteria for user-created agent definitions. Load when creating, reviewing, or auditing project-specific agents.

---

## Failure Modes

Ordered by severity. Universal failures apply to all `.claude/` documentation but are framed here for agent definitions specifically. Type-specific failures are unique to agent definitions.

### Universal

> **Duplication — restates gobbi agent capabilities instead of adding project-specific domain expertise.**

Gobbi already provides orchestration (`gobbi-agent`), evaluation (`_skills-evaluator`, `_agent-evaluator`, `_project-evaluator`), ideation (`__pi`), research (`__researcher`), and execution (`__executor`). A project agent that duplicates these roles adds routing ambiguity without adding value. Project agents must bring domain knowledge that gobbi agents lack — a security reviewer who knows the project's auth stack, not a generic security reviewer.

> **Generic content — not grounded in the project's actual technology stack and domain.**

An agent definition that could apply to any project is too generic. "Reviews code for quality" is generic. "Reviews Django views for N+1 queries, checks DRF serializer validation coverage, and verifies Celery task idempotency" is grounded. The definition must reference actual frameworks, patterns, and conventions the project uses.

> **Staleness — references deprecated patterns, outdated APIs, or removed project conventions.**

Agent definitions that reference patterns the codebase no longer uses produce agents that fight the current architecture. The codebase is the source of truth — if the definition contradicts what the codebase shows, the definition is stale.

### Type-Specific

> **Identity blur — unclear who the agent is, so the orchestrator cannot decide when to delegate here.**

The identity paragraph must answer: what does this agent think like, what tasks should the orchestrator route here, and what is explicitly not this agent's job? If two agents' descriptions could match the same incoming task, one or both have identity blur.

> **Scope overlap — boundaries with other agents are unclear, creating routing ambiguity.**

Every agent must have sharp boundaries with its neighbors. The "Out of scope" section must name specific agents that handle adjacent work. Vague scope creates a situation where the orchestrator guesses which agent to use — and guesses wrong half the time.

> **Tool scope creep — unnecessary tool grants that expand the agent's attack surface beyond its role.**

Tools should match the agent's actual work. A review agent that receives Write and Edit can modify what it is supposed to assess. An investigation agent that receives Agent can delegate when it should report back. Grant only the tools the agent needs for its defined role.

> **Lifecycle mismatch — Study/Plan/Execute/Verify phases not adapted to the agent's actual domain.**

The universal lifecycle (Study, Plan, Execute, Verify, Memorize) must be adapted per domain. A database migration agent needs deep Study (read schema history, check foreign keys) and strict Verify (reversibility, data integrity). A test writer needs shallow Study but thorough Execute. Copying the generic lifecycle without domain adaptation produces an agent that follows motions without domain awareness.

---

## Evaluation Dimensions

Diagnostic questions for assessing agent definition quality. Not every question applies to every agent — select the ones relevant to the specific definition under review.

### Purpose and Scope

- Is this agent distinct from gobbi's built-in agents? Does it fill a role that `gobbi-agent`, `__pi`, `__researcher`, `__executor`, or the evaluator agents do not cover?
- Does the agent bring genuine project-specific domain expertise, or could this definition apply to any project?
- Can the orchestrator unambiguously route a task to this agent based on its description? Is there any task where the orchestrator would hesitate between this agent and another?
- Is "Out of scope" explicit and does it name specific agents that handle adjacent work?

### Content Quality

- Does the identity establish within the first 20 lines — who the agent is, what it thinks like, when it receives work?
- Are quality expectations concrete and checkable, or vague aspirations? Could a reviewer verify whether output meets them?
- Is the lifecycle adapted to this agent's domain, or is it the generic Study/Plan/Execute/Verify copied without modification?
- Does "Before You Start" list only essential context, or does it front-load skills and docs the agent may never need?

### Structural Compliance

- Does frontmatter include `name`, `description`, `tools`, and `model`?
- Are tools tightly scoped to the agent's actual needs? Would removing any tool prevent the agent from doing its job?
- Is the model tier justified — opus for creative/investigative work, sonnet for structured assessment? Is the rationale explicit?
- Does the definition follow `_claude` writing principles — principles over procedures, constraints over templates, codebase over examples?

### Integration

- Does this agent compose with the gobbi orchestration model? Can the orchestrator delegate to it using the standard delegation pattern?
- Are boundaries with neighboring agents sharp enough that the orchestrator never hesitates on routing?
- Does the agent know how to handle work that falls outside its scope — report back, note it, or defer to a named agent?
- If the agent produces output for other agents (e.g., research for executors), is the handoff format clear?

---

## Verification Checklist

Two categories of checks. Structural checks are mechanically verifiable — a linter could catch them. Semantic checks require reading comprehension and judgment.

### Structural

- `[structural]` Frontmatter contains `name`, `description`, `tools`, and `model` fields
- `[structural]` Agent filename follows naming convention: `^gobbi-[a-z]|^_[a-z]|^__[a-z]` with hyphens as word separators
- `[structural]` `tools` field lists only tools the agent actively uses in its defined role
- `[structural]` Definition is under 500 lines (must), targeting under 200 (should)
- `[structural]` No code examples, BAD/GOOD comparison blocks, or duplicated codebase patterns
- `[structural]` JSON source file exists alongside the `.md` and both are in sync

### Semantic

- `[semantic]` Identity is established within the first 20 lines — who, what-thinks-like, when-receives-work
- `[semantic]` "Out of scope" section is present and names specific agents for adjacent work
- `[semantic]` Description field answers "when should the orchestrator send work here?" without ambiguity
- `[semantic]` Lifecycle phases are adapted to the domain, not copied generically
- `[semantic]` Quality expectations are concrete enough that a reviewer could verify output against them
- `[semantic]` Agent brings project-specific domain expertise that gobbi built-in agents do not cover
- `[semantic]` Model tier matches the agent's cognitive demands — creative/investigative work on opus, structured assessment on sonnet
- `[semantic]` "Before You Start" lists minimal essential context, not a comprehensive reading list
