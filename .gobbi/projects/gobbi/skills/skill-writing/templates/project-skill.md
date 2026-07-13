# `project-skill.md`

Template stamped when Preparation's `generate-now` flow approves a project-specific skill. The stamped file lives at `.gobbi/projects/{project-name}/skills/{skill-name}/SKILL.md` and is loaded by downstream workflows when they touch the area the skill covers.

This template is owned by the `skill-writing` skill: a skill stamped from it conforms to `skill-writing`'s six-section standard — Frontmatter → Intro → Principles → Rules → Procedure → References.

## When to stamp

During Preparation's execution-skills readiness check, the manager uses the active runtime's user-decision primitive to offer skill-codification candidates (e.g., `{project-name}-typescript-conventions`, `{project-name}-testing`, `{project-name}-mistakes`). On a `generate-now` decision the manager stamps this template into staging — always a **complete** file, never a skeleton with TODOs.

## Location

`.gobbi/projects/{project-name}/skills/{slug}/SKILL.md`

The slug starts with the project name to avoid collision with workspace-level skills. Slug is lowercase, hyphenated, descriptive. Examples:
- `webapp-typescript-conventions`
- `webapp-testing`
- `webapp-build-system`
- `webapp-mistakes`
- `webapp-feature-glossary`

## Template

A stamped skill carries the six sections in fixed order. A project-conventions skill is read-only (reads-and-informs), so it omits the conditional Memory Access Matrix and Output paths sub-sections; a state-writing skill adds `Write, Edit` to `allowed-tools` and places those two sub-sections under Procedure.

```markdown
---
name: {skill-slug}
description: {Use when … — one line stating what this skill standardizes AND when to load it (its triggers). On-demand grammar; never first- or second-person.}
allowed-tools: Read, Grep, Glob, Bash
---

# {Skill Display Title}

{One or two short paragraphs: what this skill is and when to load it. Example: "Standardizes how {project} TypeScript is written and reviewed — discriminated-union usage, naming, JSDoc density, and AJV validation. Load it when a task edits or reviews the project's TypeScript." Orient a cold-loading agent; do not instruct, do not name other files — ownership links live in References.}

---

## Principles

{Three to six entries. Each is a one-line concept in a blockquote followed by a short WHY paragraph — the mental model behind the conventions, judgment not compliance. No MUST / NEVER here; a gradable rule belongs in Rules.}

> **{Principle one-liner.}**

{Why it matters — one short paragraph.}

> **{Principle one-liner.}**

{Why it matters — one short paragraph.}

---

## Rules

The enforceable floor, in two labeled sub-groups. Each bullet is self-contained — it carries its own terse rationale, and each anti-pattern its one-line fix.

### Must-Follow

- **MUST** {rule} — {why, one clause}.
- **ALWAYS** {required behavior} — {why}.

### Must-Not-Follow

{The things newcomers reliably get wrong, as NEVER bullets with a fix.}

- **NEVER** {forbidden behavior} — {why}. Fix: {what to do instead}.

---

## Procedure

{The operational how-to: the project conventions as ordered, followable steps so a fresh agent works the one specified way instead of improvising. Pin fragile steps to exact commands or paths; leave judgment steps as prose that trusts the agent.}

1. {Step — what to do, in what order, and how to know it is done.}
2. {Step.}
3. {Step.}

---

## References

{Ownership register plus the codebase exemplars. One entry per codebase file that exemplifies a convention, and one per external fact this skill borrows (naming its single owner). A skill that owns all its content writes the one-line: "No borrowed claims; this skill owns its content."}

- {path:line} — exemplifies {rule / convention}.
- {owner path § section} — validates {the borrowed claim in this skill}.
```

## Stamping discipline

The `generate-now` flow must produce **a complete file** when it stamps this template — every section filled with content from the readiness discussion. Specifically:

- **Frontmatter** — `name` matches the slug; `description` is one specific `Use when …` sentence (on-demand grammar, not generic); `allowed-tools` is the read set `Read, Grep, Glob, Bash` unless the skill's own work writes (then add `Write, Edit`).
- **Intro** — the H1 title plus one or two short paragraphs stating what the skill is and when to load it, in the author's own words. Source-free: no other-file names (those live in References).
- **Principles** — at least three conceptual entries. Each teaches a mental model; none reads as a gradable MUST/NEVER rule.
- **Rules** — at least two `Must-Follow` bullets and at least one `Must-Not-Follow` bullet, each self-contained with its inline rationale (and a fix on each anti-pattern). Skills without enforceable rules don't have teeth.
- **Procedure** — the conventions as ordered, followable steps. "Whenever you touch the project" is not concrete enough; state how each convention is actually applied.
- **References** — at least the codebase exemplars (`path:line`) for the key conventions, plus one owner entry per borrowed fact; or the explicit "No borrowed claims" line when the skill owns all its content.

If any required content is missing at stamping time, the manager does **not** stamp a partial skill. Instead the manager runs an additional probing question to fill the gap, or records the candidate as an open question in the decisions log for a later pass.
