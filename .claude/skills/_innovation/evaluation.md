# Innovation Stance Evaluation

Evaluation criteria for user-created innovation stance skills. Load when creating, reviewing, or auditing project-specific innovation patterns.

---

## Failure Modes

Ordered by severity. Each failure mode describes a way a user-created innovation stance skill can degrade agent thinking quality. The Evaluation Dimensions section below provides diagnostic questions to detect them.

### Universal

> **Duplication — restates gobbi's innovation principles instead of adding domain-specific thinking patterns.**

Gobbi's `_innovation` skill already defines the core innovative stance: think beyond established patterns, depth over breadth, innovation serves the goal. A project skill that re-teaches these principles competes with gobbi's version. The test: remove every sentence that gobbi's `_innovation` already covers — does meaningful content remain? If not, the skill is a restatement.

> **Generic content — innovation guidance not grounded in the project's actual technology stack or domain.**

"Explore unconventional approaches" could apply to any project. "Explore CRDT-based state management as an alternative to Redux for the component tree" teaches a real domain-specific innovation direction. Project innovation skills earn their existence by encoding creative directions that require knowledge of the project's specific technology, architecture, or problem space.

> **Staleness — references innovative approaches that the project has already adopted, rejected, or that the ecosystem has moved past.**

Innovation is relative to the current state. A skill suggesting "consider using TypeScript instead of JavaScript" after the project already migrated to TypeScript is not innovative — it is stale. Similarly, suggesting abandoned or discredited approaches wastes agent reasoning on dead ends. Innovation skills rot faster than other skills because the frontier moves.

### Type-Specific

> **Shallow novelty — lists many alternative approaches without depth or stress-testing any of them.**

A skill that says "consider event sourcing, CQRS, actor model, or microservices" without analyzing trade-offs, feasibility, or fit for the project's context produces agents that brainstorm lists instead of thinking deeply. Gobbi's core principle is depth over breadth — a project innovation skill that encourages breadth directly undermines the stance's purpose.

> **Ungrounded speculation — suggests innovative directions without feasibility constraints or integration reality.**

Innovation must be implementable. A skill that encourages agents to explore "AI-powered automatic schema migration" without acknowledging the project's deployment constraints, team capabilities, or maintenance burden produces ideas that cannot survive contact with reality. Every innovative direction in a project skill should be grounded in what the team could actually build, test, and maintain.

> **Missing conventional comparison — innovation not justified against the proven alternative.**

Gobbi's `_innovation` skill requires that the innovative approach be compared to the conventional one. A project skill that directs agents toward novel patterns without requiring them to explain why the conventional approach is insufficient produces unjustified novelty. The conventional comparison is what separates innovation from novelty-seeking.

---

## Evaluation Dimensions

Each dimension provides diagnostic questions that surface the failure modes above. Since stance skills govern how agents think rather than what they produce structurally, Content Quality and Purpose/Scope carry the most weight.

### Purpose and Scope

- Does this skill add domain-specific innovative thinking directions that gobbi's `_innovation` does not already cover? If the content overlaps, would it be better to rely on the built-in skill?
- Are the innovation directions tied to the project's actual technology stack and problem space — specific enough that they would not apply to a different project?
- Does the skill focus on where innovation has the highest leverage in this project — areas where conventional approaches are genuinely limiting?
- Is the scope bounded to innovation within the project's domain, not general creativity guidance that applies everywhere?

### Content Quality

- Does the skill teach deep innovation reasoning — cross-domain patterns adapted to this project, trade-off analysis of unconventional approaches — or does it list novel ideas without depth?
- Are innovative directions grounded in feasibility? Does the skill acknowledge integration constraints, team capabilities, and maintenance implications?
- Does the skill require comparison against conventional alternatives, so agents produce justified innovation rather than novelty for its own sake?
- Are the innovation patterns concrete enough to guide agent thinking? The test: given this skill, would an agent explore a meaningfully different direction than it would without it?

### Structural Compliance

- Does the skill follow the `_claude` writing standard — principles over procedures, constraints over templates, codebase references over examples?
- Is the file under the line budget — must stay under 500 lines, should target under 200?

### Integration

- Does the skill supplement gobbi's `_innovation` without contradicting its core principles — depth over breadth, innovation serves the goal, not novelty?
- Does the skill compose correctly when loaded alongside the project's `_best-practice` skill? Innovation directions should not undermine the best-practice stance's valid recommendations without explicit justification.
- Does the description trigger accurately for tasks where domain-specific innovation guidance is needed, without loading on tasks that only need gobbi's built-in innovation stance?

---

## Verification Checklist

Items tagged `[structural]` are machine-verifiable — `_audit` or a linter can check them without understanding the content. Items tagged `[semantic]` require agent judgment to assess.

### Purpose and Scope

- `[semantic]` Skill adds domain-specific innovation directions beyond what gobbi's `_innovation` already provides
- `[semantic]` Innovation guidance is tied to the project's actual technology stack, architecture, or problem space
- `[semantic]` Scope targets areas where conventional approaches are genuinely limiting in this project

### Content Quality

- `[semantic]` Innovative directions include depth — trade-off analysis, feasibility assessment, cross-domain adaptation — not just idea lists
- `[semantic]` Every innovation direction requires comparison against the conventional alternative
- `[semantic]` Innovation patterns are grounded in implementation reality — team capabilities, deployment constraints, maintenance burden
- `[semantic]` No inert content — every section shifts agent thinking in a direction it would not have explored otherwise

### Structural Compliance

- `[structural]` File is under 500 lines
- `[structural]` No code blocks or BAD/GOOD comparison blocks present
- `[structural]` Follows `_claude` writing standard — principles over procedures, no step-by-step recipes in teaching content
- `[structural]` JSON source file exists alongside the `.md` and both are in sync

### Integration

- `[semantic]` Does not contradict gobbi's `_innovation` core principles — depth over breadth, innovation serves the goal
- `[semantic]` Does not undermine the `_best-practice` stance without explicit justification for each case
- `[semantic]` Description triggers on domain-specific innovation tasks, not on all innovation-related prompts
