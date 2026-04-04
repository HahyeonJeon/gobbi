# Project Documentation Evaluation

Evaluation criteria for user-created project documentation. Load when creating, reviewing, or auditing project-specific docs in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/`.

---

## Failure Modes

Project docs fail in predictable ways. Ordered by severity — the first failure modes cause the most damage because agents act on wrong information with high confidence.

> **Stale misdirection — references that look valid but point to removed or changed code.**

The most dangerous failure mode. A doc that references `src/auth/middleware.py` when that file was renamed to `src/auth/handlers.py` three sprints ago doesn't just fail to help — it actively sends agents down wrong paths. Unlike missing docs (where agents fall back to codebase exploration), stale docs create false confidence. The agent reads the doc, assumes the reference is current, and builds on a wrong foundation.

> **Duplication — project docs restate general domain knowledge instead of project-specific context.**

A design doc that explains how dependency injection works in general rather than documenting why this project chose constructor injection over a DI container wastes context window and creates maintenance burden. General knowledge belongs in skills; project docs capture what is unique to this project. The test: could this paragraph appear in a tutorial for the framework? If yes, it does not belong in project docs.

> **Generic content — docs could apply to any project, not grounded in this project's actual stack.**

"We use a microservices architecture for scalability" tells an agent nothing actionable. "Orders service calls Inventory service synchronously via gRPC; payment is async via SQS" gives the agent a concrete mental model. Generic content signals that the author described aspirations rather than reality. Every statement in a project doc should be falsifiable against the codebase.

> **Staleness — outdated references to deleted files, renamed modules, or abandoned architecture decisions.**

Distinct from stale misdirection in that staleness is passively wrong rather than actively misleading. A doc describing a feature that was built differently than planned is stale. It wastes agent time when loaded but is less dangerous than a doc that points to specific files or APIs that no longer exist. Staleness accumulates silently — each session that touches related code without updating the doc increases drift.

> **Missing navigation — no README.md entry point, agents cannot find or orient within the docs.**

Without a README.md, agents must scan every file in the directory to determine relevance. This wastes tokens and produces unreliable results — the agent may read the wrong doc first and form an incorrect mental model before finding the right one. README.md is the routing table for project documentation.

> **Scope bleed — general domain knowledge captured as project docs instead of skills or rules.**

When a team member documents "how we write tests" in project docs rather than as a skill, the knowledge is locked to one project. Other projects on the same stack cannot benefit. Worse, the project doc format lacks the trigger mechanism that skills have — agents in other contexts will never discover it. Knowledge that applies across projects belongs in skills; conventions that apply across projects belong in rules.

---

## Evaluation Dimensions

Diagnostic questions for assessing project doc quality. Each dimension targets a different aspect of usefulness. A doc can score well on one dimension and fail on another — evaluate all four.

### Purpose and Scope

Does this project doc capture context an agent could not derive from the codebase alone?

Design rationale, rejected alternatives, external constraints, team conventions, and cross-system dependencies are examples of context that lives outside the code. If a doc merely describes what the code does — something an agent can determine by reading the code — it adds no value and will drift from reality as the code changes.

Is the scope narrow enough that the doc stays current? A doc covering "the entire backend architecture" is a staleness magnet. A doc covering "why we chose event sourcing for the orders domain" is narrow enough to remain accurate until that decision is revisited.

### Content Quality

Are references to code files, paths, and APIs current? Spot-check by verifying that referenced files exist and that described behaviors match what the code actually does.

Would a returning agent — one that has not seen the codebase in several sessions — build a correct mental model from this doc? The test is not whether the doc is comprehensive, but whether what it states is accurate. Incomplete but correct is acceptable. Incomplete and wrong is the worst outcome.

Does the doc distinguish between current state and planned state? Mixing "we do X" with "we plan to do Y" without clear markers causes agents to treat plans as facts.

### Structural Compliance

Does each directory under `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/` have a README.md? The README is the entry point — without it, agents cannot navigate.

Does the project follow the standard subdirectory structure (`design/`, `rules/`, `gotchas/`, `note/`, `reference/`, `docs/`)? Non-standard directories are not forbidden, but agents expect the standard layout and will look there first.

Is each doc self-contained? An agent should understand the doc's scope and key points without reading sibling docs. Cross-references are fine for depth, but the doc must stand alone for its core purpose.

### Integration

Does the project doc compose with gobbi's conventions? Project-specific gotchas belong in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/gotchas/`, not in the cross-project `_gotcha` skill. Project-specific rules belong in `$CLAUDE_PROJECT_DIR/.claude/project/{project-name}/rules/`, not in `.claude/rules/`.

Are there duplicate docs covering the same topic? Search before creating. Two docs about the same system create two sources of truth that will diverge.

Does the doc avoid duplicating content from skills or rules? If the same guidance exists in a skill, the project doc should reference the skill rather than restating the content.

---

## Verification Checklist

Items tagged `[structural]` are machine-verifiable — `_audit` or a linter can check them without understanding the content. Items tagged `[semantic]` require agent judgment to assess.

- `[structural]` README.md exists in each project subdirectory that contains docs
- `[structural]` Standard subdirectories used where applicable — non-standard dirs are justified
- `[structural]` Each doc is self-contained — understandable without reading siblings first
- `[structural]` Referenced file paths and module names exist in the current codebase
- `[structural]` No duplicate docs covering the same topic within the project
- `[structural]` Project-specific gotchas live in the project gotchas directory, not in `_gotcha`
- `[semantic]` Design docs capture rationale and trade-offs, not just inventory of what exists
- `[semantic]` Every factual claim is falsifiable against the codebase — no aspirational statements presented as current state
- `[semantic]` Content is project-specific — could not appear in a generic tutorial for the framework
- `[semantic]` Described behaviors match what the code actually does — spot-check at least two references
- `[semantic]` No references to planned features that were already built, abandoned, or changed
- `[semantic]` Cross-project knowledge lives in skills or rules, not project docs
