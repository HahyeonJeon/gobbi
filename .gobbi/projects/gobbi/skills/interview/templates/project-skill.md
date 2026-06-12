# `project-skill.md`

Template the manager stamps when the Interview skill approves a project-specific skill codification. The stamped file lives at `.gobbi/projects/{project-name}/skills/{skill-name}/SKILL.md` and is loaded by downstream workflows when they touch the area the skill covers.

## When to stamp

At each wave close in the Interview procedure, the manager uses the active runtime's user-decision primitive to offer skill codification candidates (e.g., `{project-name}-typescript-conventions`, `{project-name}-testing`, `{project-name}-mistakes`). When the user approves, the manager stamps this template — never leaves a skeleton with TODOs.

## Location

`.gobbi/projects/{project-name}/skills/{slug}/SKILL.md`

The slug starts with the project name to avoid collision with workspace-level skills. Slug is lowercase, hyphenated, descriptive. Examples:
- `webapp-typescript-conventions`
- `webapp-testing`
- `webapp-build-system`
- `webapp-mistakes`
- `webapp-feature-glossary`

## Template

```markdown
---
name: {skill-slug}
description: {one-line description — what this skill teaches and when to load it}
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
---

# {Skill display title}

{One-paragraph purpose statement. What the skill teaches, who loads it, when. Example: "Loaded when an agent is writing or reviewing TypeScript code in the {project} codebase. Captures the project's specific conventions on discriminated unions, naming, JSDoc density, and AJV usage."}

---

## When to load

{Concrete triggers. Example:
- When editing any `.ts` file in `src/`
- When constructing a delegation prompt for an executor whose task touches TypeScript
- When evaluating a TypeScript-heavy artifact}

---

## Conventions

{Bulleted rules the user articulated during the Interview. Each rule is a single statement, ideally with a one-line "why" if non-obvious.}

- **Rule 1**: {Statement.} *Why:* {short rationale if non-obvious.}
- **Rule 2**: {Statement.}
- **Rule 3**: {Statement.}

---

## Examples

{Pointers to real files in the codebase that exemplify the conventions. The leader surfaced these during the Interview's research; the manager records the paths.}

- {path:line} — illustrates Rule 1
- {path:line} — illustrates Rule 2

---

## Anti-patterns

{Things that newcomers reliably get wrong, sourced from the Interview's "what do newcomers reliably get wrong?" question (Wave 5) plus Wave 2/3 devil's-advocate answers.}

- **{Anti-pattern title}** — {What it looks like.} *Correct approach:* {What to do instead.}

---

## Constraints

{Mandatory rules — what the skill enforces with "MUST" / "NEVER" language. These rules cannot be overridden by individual judgment; they reflect non-negotiable project policy.}

- **MUST** {rule}
- **NEVER** {forbidden behavior}
- **ALWAYS** {required behavior}
```

## Stamping discipline

The Interview skill must produce **a complete file** when it stamps this template — every section filled in with content from the interview. Specifically:

- **Frontmatter** — `name` matches the slug; `description` is one specific sentence (not generic); `allowed-tools` is the standard set unless the skill needs different tools.
- **Purpose** — written in the manager's own words from the user's wave answers, not pasted verbatim.
- **When to load** — at least 2 concrete triggers. "Whenever you touch the project" is not concrete enough.
- **Conventions** — at least 3 rules from the interview. If the wave surfaced fewer rules, the skill candidate was probably not worth codifying; the manager should re-offer with the user.
- **Examples** — at least 2 codebase pointers (path:line). If the leader's research didn't surface examples, the manager surfaces this gap to the user before stamping.
- **Anti-patterns** — at least 1 anti-pattern (Wave 5's "newcomer mistakes" answer usually provides this).
- **Constraints** — at least 2 MUST / NEVER / ALWAYS rules. Skills without constraints don't have teeth.

If any required content is missing after the wave's interview, the manager does **not** stamp a partial skill. Instead, the manager runs an additional probing question to fill the gap, or records the candidate as an `open question` in the decisions log for a future interview pass.
