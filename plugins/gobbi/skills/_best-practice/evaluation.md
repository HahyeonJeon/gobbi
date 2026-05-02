# Best-Practice Stance Evaluation

Evaluation criteria for user-created best-practice stance skills. Load when creating, reviewing, or auditing project-specific best-practice knowledge.



---

## Failure Modes

Ordered by severity. These are the ways user-created best-practice stance skills fail in practice. Universal failures apply to all user-created `.claude/` documentation. Type-specific failures are unique to stance skills that govern how agents reason about proven patterns.

### Universal

> **Duplication — restates gobbi's best-practice principles instead of adding project-specific domain knowledge.**

Gobbi's `_best-practice` skill already teaches evidence over opinion, context-dependent evaluation, and proven-pattern reasoning. A project skill that re-teaches these principles competes with gobbi's version. The test: if this paragraph appeared in gobbi's own `_best-practice` SKILL.md, would it fit? If yes, it is duplication. The project skill must add knowledge gobbi does not have — which frameworks, libraries, and patterns constitute best practice for this specific project.

> **Generic content — best-practice guidance not grounded in the project's actual technology stack.**

"Follow SOLID principles" is generic — it applies to any object-oriented project. "In this Django project, prefer fat models over fat views because the existing codebase uses model methods for business logic — see `orders/models.py` for the established pattern" is grounded. A best-practice stance skill earns its existence by naming the specific documentation, community standards, and codebase patterns that define best practice for this project.

> **Staleness — references outdated community standards, deprecated patterns, or superseded framework recommendations.**

Best practices evolve. A skill that recommends React class components when the community and the React documentation have moved to hooks actively misleads agents. Worse, best-practice skills carry extra authority because agents treat them as vetted guidance. A stale best-practice recommendation is more dangerous than a stale implementation skill because agents follow it with higher confidence.

### Type-Specific

> **Unsourced recommendation — presents opinion as best practice without citing documentation, community consensus, or evidence.**

The core principle of the best-practice stance is evidence over opinion. A project skill that says "always use repository pattern for data access" without citing the framework documentation, a community standard, or a demonstrated track record in the codebase is opinion dressed as best practice. Every recommendation must trace to a source — a documentation link, a well-known community reference, or an established codebase pattern with history.

> **Context-blind practice — applies patterns from one context to a fundamentally different one.**

Best practice is context-dependent — gobbi's core principle. A project skill that recommends enterprise-scale patterns for a startup MVP, microservices patterns for a monolith, or high-availability patterns for a development tool wastes engineering effort and adds complexity without benefit. Each recommendation must match the project's actual constraints: team size, performance requirements, maintenance expectations, and deployment environment.

> **Codebase-inconsistent — recommends patterns that conflict with established project conventions without justification.**

Consistency with the existing codebase is itself a best practice. A project skill that recommends a different error handling pattern from what the codebase already uses creates two competing conventions. If the skill recommends changing an established pattern, the justification must be explicit — what is wrong with the current approach, what evidence supports the new one, and how will the migration happen. Without that justification, the skill produces agents that fight the codebase.

---

## Evaluation Dimensions

Diagnostic questions for assessing best-practice stance skill quality. Each dimension targets a different aspect. Because this is a stance skill — governing how agents think rather than what tools they use — Purpose/Scope and Content Quality carry the most weight.

### Purpose and Scope

- Does the skill add domain-specific best-practice knowledge that gobbi's `_best-practice` does not already provide?
- Is every recommendation tied to the project's actual technology stack — named frameworks, specific libraries, concrete codebase patterns?
- Does the skill distinguish between universal best practices (which gobbi handles) and project-specific best practices (which the project skill should teach)?
- Is the scope matched to the project's real constraints — team size, performance requirements, deployment environment — not an assumed enterprise or startup context?

### Content Quality

- Does every recommendation cite a source — documentation link, community standard, codebase pattern with history, or well-known reference?
- Does the skill explain why each practice is best for this project's context, not just assert that it is best in general?
- When multiple valid approaches exist, does the skill compare trade-offs against the project's actual constraints rather than declaring one universally superior?
- Does the skill acknowledge where the existing codebase's patterns are the best practice, rather than only recommending external standards?
- Would an agent applying this skill's guidance produce output consistent with the project's established conventions?

### Structural Compliance

Stance skills are thin structurally — they govern thinking, not tool usage or file layout. The structural checks that apply are the universal ones from `_claude`.

- Does the frontmatter include `name`, `description`, and `allowed-tools`?
- Is the file under the line budget — must stay under 500 lines, should target under 200?
- Does the file avoid `_claude` anti-patterns: no code examples, no BAD/GOOD comparisons, no step-by-step recipes?

### Integration

- Does the skill supplement gobbi's `_best-practice` without contradicting its core principles (evidence over opinion, context-dependent, proven patterns)?
- Can the orchestrator load both gobbi's `_best-practice` and this project skill together without conflicting instructions?
- Does the skill reference the project's codebase as the ground truth for what patterns are already established?
- Does the skill avoid duplicating content from other project skills — domain knowledge that is not specific to the best-practice lens belongs in domain skills, not here?

---

## Verification Checklist

Items tagged `[structural]` are machine-verifiable — `_doctor` or a linter can check them without understanding the content. Items tagged `[semantic]` require agent judgment to assess.

- `[structural]` Frontmatter has `name`, `description`, and `allowed-tools` fields
- `[structural]` `name` field matches the skill's directory name
- `[structural]` File is under 500 lines
- `[structural]` No code blocks or BAD/GOOD comparison blocks present
- `[structural]` JSON source file exists alongside the `.md` and both are in sync
- `[semantic]` Every recommendation cites a source — documentation, community standard, or codebase pattern
- `[semantic]` Guidance is project-specific — could not apply to any project using the same language without modification
- `[semantic]` No duplication with gobbi's `_best-practice` core principles (evidence over opinion, context-dependent, proven patterns)
- `[semantic]` Recommendations match the project's actual constraints — not aspirational enterprise or startup patterns misapplied
- `[semantic]` Where recommendations diverge from existing codebase patterns, justification is explicit
- `[semantic]` Trade-offs between competing practices are evaluated against the project's real context, not declared universally
- `[semantic]` Skill supplements gobbi's `_best-practice` without contradicting it
- `[semantic]` No domain knowledge that belongs in a separate domain skill rather than the best-practice stance
