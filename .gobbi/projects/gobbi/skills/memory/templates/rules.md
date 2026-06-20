# `rules/`

> Load-bearing behavioral constraints every agent must follow. Stronger than a mistake: a mistake records "this approach fails reliably"; a rule records "this is how it must be done, period". Rules are rare — every rule increases the project's surface area.

## Core principles

> **State the constraint, its rationale, and its scope.**

A rule without its reason is obeyed blindly or discarded; a rule without its scope is over- or under-applied.

## Write it

| Field | Value |
|---|---|
| When | Wrap-up identifies an invariant the team wants enforced going forward (naming conventions, layering constraints, banned patterns). Promotion **requires explicit user confirmation** through the active runtime's user-decision primitive — Wrap-up never promotes a rule unilaterally. |
| Written by | Wrap-up RECORD (direct write — no staging). There is no `staging/rules/` subdir and no `rule-candidate:` upstream flag; loop RECORD never writes here. |
| Promotes to | `rules/` (project-wide) · `features/{f}/rules/` (feature-specific — the canonical home; the retired `decisions/` + `precedent: true` workaround is superseded) |
| Filename | `{slug}.md` — bare-slug (evergreen, no date prefix); short, imperative, names the rule (`evaluator-read-only-boundary.md`) |

Wrap-up writes directly to memory ([routing](../../wrap-up/SKILL.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter plus the rules extensions (`priority`, `established`). `supersedes` is a **global plain-slug base field** (§2.1), not a rules extension. Frontmatter is mandatory on every memory file, `rules/` included — the older "plain markdown, frontmatter forbidden" prohibition is rescoped to stub-redirect TARGET docs only, NOT memory files ([rules §2.2](../rules.md#22-per-type-extension-fields--the-status-model)).

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
tags: [process, docs-sync]           # controlled vocabulary (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
priority: critical | high | medium | low
established: YYYY-MM-DD
supersedes: {prior rule slug if this replaces an existing rule} | null   # plain slug, not a path
---

# {Rule title}

> **{One-line rule statement, blockquoted.}**

{Two-to-four-sentence elaboration: the principle behind the rule.}

## Reason
{The motivation. What concrete failure or cost does this rule prevent?}

## When to apply
{Conditions under which the rule binds. Be specific — under-scoping makes rules dead letters, over-scoping makes them inflexible.}

## When NOT to apply
{Counter-conditions. Genuine exceptions, not weasel words. If there are no exceptions, state "always applies" explicitly.}

## Related
{Navigable `[[slug]]` links to mistakes, decisions, design docs, or other rules that interact with this one ([`rules.md` § 2.4](../rules.md#24-cross-references-and-the-doc-graph)).}

- [[evaluator-read-only-boundary]] — a related rule it interacts with
```

## Notes

- **Promotion contract.** Wrap-up is the only writer to `rules/` — no loop RECORD writes directly. New rules require user confirmation through the active runtime's user-decision primitive ("Promote this session's recurring invariant to project rules as `{slug}`?").
- **Update by supersede, never delete.** Updating an existing rule uses the `supersedes:` frontmatter field; the prior file is preserved for audit. When the superseded rule reaches a terminal state (`status: superseded`), Wrap-up moves the full file (`git mv`) to `archive/rules/{YYYY-MM-DD}-{slug}.md` per the move-on-terminal model — never deleted.
