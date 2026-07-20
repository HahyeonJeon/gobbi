# `rules/`

> Load-bearing behavioral constraints every agent must follow. Stronger than a mistake: a mistake records "this approach fails reliably"; a rule records "this is how it must be done, period". Rules are rare — every rule increases the project's surface area.

## Core principles

> **State the constraint, its rationale, and its scope.**

A rule without its reason is obeyed blindly or discarded; a rule without its scope is over- or under-applied.

## Write it

| Field | Value |
|---|---|
| When | Startup-close establishes a baseline invariant with explicit user confirmation. The normal productive-step workflow has no authorized rule candidate or promotion route. |
| Written by | The startup skill's distinct user-approved startup-close behavior. Record defines no `staging/rules/` type, and ordinary Wrap-up cannot write a rule directly. |
| Durable home | `rules/{area}/` for a project-wide startup baseline or `features/{f}/rules/{area}/` for a feature-specific startup baseline. `{area}` follows the [§1.5 selection rule](../rules.md#15-area-namespace-the-second-category-axis-under-each-type). |
| Filename | `{slug}.md` — bare-slug (evergreen, no date prefix); short, imperative, names the rule (`evaluator-read-only-boundary.md`) |

[`memory-map.md`](../memory-map.md) intentionally lists no typed rule source. Adding ordinary rule promotion requires a prior user-approved change to the Record staging vocabulary, validators, Memory map, and Wrap-up contract; this template cannot create that route.

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
tags: [process, docs-sync]           # this type's controlled pool (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
priority: critical | high | medium | low
established: YYYY-MM-DD
supersedes: {prior rule slug if this replaces an existing rule} | null   # one plain slug, not a path
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

- **Normal Wrap-up boundary.** Ordinary Wrap-up accepts typed staging only. It does not turn a decision, finding, working file, or user comment into a rule and has no special direct-write exception.
- **Startup-close exception.** Startup-close is distinct from the productive loop. It may write a user-approved baseline rule through its own contract before normal workflow promotion begins.
- **Update by supersede, never delete.** A separately authorized rule-maintenance change uses the global `supersedes:` field and preserves the prior complete file. A terminal superseded rule moves whole to `archive/rules/{area}/{YYYY-MM-DD}-{slug}.md` under the Memory lifecycle owner.
