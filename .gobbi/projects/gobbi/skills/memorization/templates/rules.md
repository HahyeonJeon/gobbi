# `rules/`

**Project-wide behavioral rules** — load-bearing constraints that every agent working on this project must follow. Rules are stronger than mistakes: a mistake records "this approach fails reliably", while a rule records "this is how it must be done, period". Rules are referenced by skills, agent definitions, and CLAUDE.md, and they should be rare — every rule increases the project's surface area for new contributors.

## Lifecycle (Wrap-up direct write)

This template is written **directly by Wrap-up's MEMORIZATION** to its project-memory destination — there is no loop-MEMORIZATION staging path. Wrap-up authors the content (e.g., on first promotion to a new feature, on supersession, or from cross-session synthesis) and stamps this template.

Wrap-up is the sole writer; loop MEMORIZATION (Ideation / Planning / Execution) never writes to this destination.

---

## When to write

- Wrap-up identifies a candidate rule when the session's discussion produced an invariant the team wants enforced going forward (e.g., naming conventions, layering constraints, banned patterns). Rules are authored directly by Wrap-up + maintainer; there is no `staging/rules/` subdirectory and no `rule-candidate: true` upstream flag.
- Rule promotion **requires explicit user confirmation** via AskUserQuestion during Wrap-up — Wrap-up never promotes a rule unilaterally.

## Location

- Project-level: `.gobbi/projects/{project-name}/rules/`

Rules are project-wide by definition. There is no feature-scoped rules tier — feature-scoped rules belong in `features/{feature-name}/decisions/` with a `precedent: true` marker.

## File naming

`{slug}.md` — short, imperative, names the rule. No date prefix (bare-slug; evergreen). See [`rules.md` § 1 naming standard](../rules.md).

Examples: `docs-cleanup-parallelism.md`, `evaluator-read-only-boundary.md`.

## Frontmatter

Every rule file carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file) plus the rules-type extensions (`priority`, `established`, `supersedes`). **Frontmatter is mandatory on every memory file, the `rules/` type included** — the older "the project uses plain markdown, frontmatter is forbidden" prohibition is rescoped to **stub-redirect TARGET docs only** (the published `.claude/` redirect stubs), NOT to project-memory files.

## Item template

```markdown
---
name: {slug — the rule, in imperative form}
description: {one-line what-this-rule-enforces}
type: rules
scope: project
feature: null
status: active
created: YYYY-MM-DD
session: {session-id that established the rule}
tags: [{tag1}, {tag2}]
priority: critical | high | medium | low
established: YYYY-MM-DD
supersedes: {prior rule slug if this replaces an existing rule} | null
---

# {Rule title}

> **{One-line rule statement, blockquoted.}**

{Two-to-four-sentence elaboration: the principle behind the rule.}

---

## Why

{The motivation. What concrete failure or cost does this rule prevent?}

---

## When to apply

{Conditions under which the rule binds. Be specific — under-scoping makes rules dead letters, over-scoping makes them inflexible.}

---

## When NOT to apply

{Counter-conditions. Genuine exceptions, not weasel words. If there are no exceptions, state "always applies" explicitly.}

---

## Related

{Cross-references to mistakes, decisions, design docs, or other rules that interact with this one. Each entry: `[link](path) — one-line relevance note`.}
```

## Promotion contract

- Wrap-up is the **only** writer to `rules/` — no loop MEMORIZATION writes directly
- New rules require user confirmation via AskUserQuestion ("Promote this session's recurring invariant to project rules as `{slug}`?")
- Updating an existing rule uses the `supersedes:` frontmatter field; the prior rule file is preserved for audit
- Never delete a rule file; supersession + frontmatter is the lifecycle mechanism. When the superseded rule reaches a terminal state (`status: superseded`), Wrap-up moves the full file (`git mv`) to `archive/rules/{YYYY-MM-DD}-{slug}.md` per the move-on-terminal model — never deleted, just relocated out of the active `rules/` directory.
