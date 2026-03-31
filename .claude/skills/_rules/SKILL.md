---
name: _rules
description: Guide for authoring rule files in .claude/rules/. Covers verifiability, structure, when to create a rule.
---

# Claude Rules

Guide for authoring rule files in `.claude/rules/`. Rules live alongside other project documentation and define verifiable standards that apply across all work in the project. Load this skill when creating or reviewing rule files.

Load `_claude` for the general documentation writing standard before authoring rules.

---

## Core Principle

> **A rule is a verifiable standard enforced across all work in the project.**

Unlike skills (loaded on demand for specific domains), rules define what is required, what is forbidden, and the boundary conditions for work in a specific project. Rules apply universally — they are always active, not loaded on demand.

> **If an agent or linter cannot check it mechanically, it is guidance — not a rule.**

The threshold for creating a rule is verifiability. Rules that rely on judgment calls are not rules — they are documentation. A rule must be checkable: either by reading a file and confirming a property, or by running a command and checking the result.

> **Rules are project-specific standards, not general domain knowledge.**

Rules enforce conventions for this project — formatting configs, commit conventions, library policies. General domain knowledge (how to think about Python, how to design charts) belongs in skills, not rules.

> **Gobbi rules vs project rules — know the boundary.**

Gobbi already provides rules for its own conventions (naming, formatting). Users do NOT need to create rules for `.claude/` documentation standards, skill naming, or gobbi workflow conventions — gobbi serves those. Project rules should enforce project-specific standards: code style for the project's language, testing requirements for the project's framework, deployment conventions for the project's infrastructure. When helping create a rule, first check if gobbi already covers the standard.

---

## When to Create a Rule

Create a rule when:
- The standard applies to all code or all work in the project
- Violation causes real problems that require rework or break things
- The convention is not obvious from reading the codebase alone

Do not create rules for preferences, tooling-enforced standards (the tool already enforces it), or domain-specific guidance (use a skill instead).

---

## Writing Pattern

**One clear statement.** The rule itself, the rationale, what is forbidden, what is required, and how compliance is verified. Everything in one coherent document.

**Verifiable criteria.** "All code formatted with Black, line-length 100" — not "Write clean code". The verifiability criterion is the test: can an agent or linter confirm compliance without interpretation?

**Flat structure.** Rules should not need deep nesting. If a rule requires extensive explanation, it is either too broad (split it) or better suited as a skill.

**Descriptive naming.** Name by topic: `code-style.md`, `git.md`. Not by action: `how-to-test.md`. The filename tells the agent what domain the rule covers without reading it.

**Front-load importance.** Agents read less carefully as files get longer. Put the most critical constraints first — the parts where violation causes the most damage.

---

## Anti-Patterns

### Must Avoid

**Rule too vague to enforce.** "Handle errors properly" is a preference, not a standard. Make it mechanically verifiable or move it to a skill.

**Rule covers a domain.** Scope too broad — domain expertise belongs in a skill, not a rule. A rule covers a specific, narrow standard within a project.

### Should Avoid

**Rule duplicates tooling.** If a linter already catches it, only document the tool configuration. Do not write a rule for something the toolchain enforces automatically.

**Rule has too many exceptions.** If every application of the rule requires judgment about whether an exception applies, the rule is too rigid. Narrow the scope or split into separate rules.

---

## Review Checklist

Before publishing a rule:

**Core Principle**
- [ ] Standard is mechanically verifiable by agent or linter
- [ ] Project-specific — not general domain knowledge (that belongs in a skill)

**Writing Pattern**
- [ ] Rule stated as one clear, unambiguous statement
- [ ] Verifiable criteria, not subjective guidance
- [ ] Flat structure — no deep nesting
- [ ] Most critical constraints front-loaded

**Anti-Pattern**
- [ ] Not too vague to enforce (must avoid)
- [ ] Does not duplicate what linters or tooling already catch (should avoid)
