---
name: references-author-comment-inconsistency
description: references.md's frontmatter author: comment is shorter than the other 16 templates' (# claude | codex | user vs the fuller "— the runtime that authored it"); normalize as a PR #305 follow-up.
type: backlogs
scope: project
feature: null
status: deferred
created: 2026-06-19
session: 8bdd12ad-9d28-4293-a38f-881db184c465
tags: [memory, docs-sync, frontmatter]
keywords: [references-md, author-comment, template-consistency, pr-305-followup]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Normalize the references.md author: comment to match the other templates

## Context

Across the 17 memory templates, the frontmatter `author:` field carries an inline
comment. Sixteen templates use the fuller form
(`# claude | codex | user — the runtime that authored it`); `references.md` carries a
shorter variant (`# claude | codex | user`) without the trailing
"— the runtime that authored it" clause. It is a cosmetic inconsistency in the comment
text, not in the field's value or the frontmatter contract.

## Why deferred

This is pre-existing from PR #305 (it predates the template-redesign session), and the
frontmatter blocks are **locked** from #305 — this redesign deliberately did not touch
frontmatter. So the normalization belongs as a #305 follow-up rather than smuggled into
the redesign, and it is purely cosmetic, hence low priority.

## When to pick up

After (or alongside) any sanctioned frontmatter-comment touch-up that lifts the #305
frontmatter lock for this kind of cosmetic edit. No functional prerequisite — the only
gate is the "don't touch locked frontmatter outside its own follow-up" discipline.

## Suggested approach

Append `— the runtime that authored it` to the `author:` comment in
`memory/templates/references.md` so all 17 templates carry the identical comment text.
One-line edit; verify with a grep that all 17 templates' `author:` comment lines match.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-19-8bdd12ad-9d28-4293-a38f-881db184c465/`

## Related

- [[2026-06-19-memory-template-redesign]] — the session that surfaced this deferral.
