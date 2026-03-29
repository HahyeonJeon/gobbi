# Writing Rules

Guide for authoring rule files. Rules live in `.claude/project/{project-name}/rules/`, alongside other project documentation. Currently no rule files have been written in the codebase — the system supports rules but none exist yet.

---

## Core Principle

> **A rule is a verifiable standard enforced across all work in the project.**

Unlike skills (loaded on demand), rules define what's required, what's forbidden, and the boundary conditions for a specific project.

> **If an agent or linter can't check it mechanically, it's guidance — not a rule.**

Create a rule when: the standard applies to all code, violation causes real problems, and the convention isn't obvious from reading the codebase alone. Don't create rules for preferences, tooling-enforced standards, or domain-specific guidance (use a skill instead).

> **Rules are project-specific standards, not general domain knowledge.**

Rules enforce conventions for *this* project — formatting configs, commit conventions, library policies. General domain knowledge (how to think about Python, how to design charts) belongs in skills.

---

## Writing Pattern

| Pattern | Principle |
|---------|-----------|
| **One clear statement** | The rule itself, the rationale, what's forbidden, what's required, and how compliance is verified. |
| **Verifiable criteria** | "All code formatted with Black, line-length 100" not "Write clean code". |
| **Flat structure** | Rules shouldn't need deep nesting. If it requires extensive explanation, split it or make it a skill. |
| **Descriptive naming** | Name by topic: `code-style.md`, `git.md`. Not by action: `how-to-test.md`. |
| **Front-load importance** | Agents read less carefully as files get longer. Put the most critical rules first. |

---

## Anti-Pattern

### Must Avoid

| Anti-Pattern | Why It Fails |
|---|---|
| **Rule too vague to enforce** | "Handle errors properly" is a preference, not a standard. Make it verifiable. |
| **Rule covers a domain** | Scope too broad — move domain expertise to a skill. |

### Should Avoid

| Anti-Pattern | Why It Fails |
|---|---|
| **Rule duplicates tooling** | Linter already catches it. Only document the tool configuration. |
| **Rule has too many exceptions** | Rule is too rigid. Narrow the scope or split into separate rules. |

---

## Review Checklist

Before publishing a rule:

**Core Principle**
- [ ] Standard is mechanically verifiable by agent or linter
- [ ] Project-specific — not general domain knowledge (that's a skill)

**Writing Pattern**
- [ ] Rule stated as one clear, unambiguous statement
- [ ] Verifiable criteria, not subjective guidance
- [ ] Flat structure — no deep nesting
- [ ] Most critical rules front-loaded

**Anti-Pattern**
- [ ] Not too vague to enforce (must avoid)
- [ ] Doesn't duplicate what linters already catch (should avoid)
