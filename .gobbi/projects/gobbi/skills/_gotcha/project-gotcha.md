# Project Gotcha

Project-specific gotchas capture mistakes that only matter in one project's context. They live alongside the project's documentation, not in the shared `_gotcha/` skill files.

---

## Core Principle

> **A gotcha is project-specific if it would mislead agents on other projects.**

The test is confusion, not domain. If recording a mistake in `_gotcha/` would cause agents on unrelated projects to second-guess a correct approach, it belongs in the project's own gotcha files instead. Project gotchas are scoped to one project; they cannot produce false positives elsewhere.

> **Project context creates project gotchas.**

Choices that are correct in one project and wrong in another are project-specific by definition. Naming conventions, framework idioms, deployment quirks, team preferences — these are context-dependent. A cross-project gotcha that says "always use X" breaks the project that uses Y.

---

## Where Project Gotchas Live

Project-specific gotchas go in `$CLAUDE_PROJECT_DIR/.gobbi/projects/{project-name}/gotchas/{category}.md`.

The `{category}` groups related mistakes — use the same categories as the central `_gotcha/` files when the domain matches, or invent a category when the mistake is unique to the project. Read the existing project directory for context before choosing a category name.

---

## Deciding Where to Record

**Record in the project's `gotchas/`** when:
- The mistake only applies because of this project's choices (framework, architecture, conventions, tooling)
- The correct approach differs from what agents would do in a generic context
- Recording it centrally would confuse agents on unrelated projects

**Record in `_gotcha/{skill}.md`** when:
- The mistake can happen on any project using the same skill
- The correct approach is universally better, regardless of project context
- The pattern recurs across projects, not just this one

**When unsure:** default to project-specific. It is easier to escalate a gotcha upward than to clean up false positives that have already misled agents elsewhere.

---

## Escalating to Cross-Project

A project gotcha becomes cross-project when the same mistake appears on multiple unrelated projects — meaning the root cause is the skill or workflow, not the project's specific context.

Before escalating, check whether the existing project gotcha has a broader lesson. Sometimes the project-specific version captures one symptom and the cross-project version captures the pattern that caused it. Both can coexist: the central file holds the universal principle, the project file holds the concrete instance.

Escalation is a deliberate act — move the entry, do not duplicate it. Duplication creates two sources of truth that drift apart.
