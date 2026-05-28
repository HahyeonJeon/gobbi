---
name: docs-as-code-linting
description: "Reference: docs-as-code approach — mechanical lint/CI gates catch schema defects; human review is reserved for prose quality and content judgment."
scope: feature
feature: project-memory
status: active
created: 2026-05-26
title: Docs-as-code — lint/CI gates schema, human review reserved for content judgment
source: https://www.netlify.com/blog/a-key-to-high-quality-documentation-docs-linting-in-ci-cd/
type: references
ref_type: blog
accessed: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [docs-as-code, linting, ci, enforcement, project-memory]
related: [frontmatter-as-schema]
---

# Docs-as-code — lint/CI gates schema, human review reserved for content judgment

## Insight
Treat docs like code: a mechanical lint/CI gate catches structural defects (schema, broken links, staleness tied to git "last updated"), while human (or agent) review is reserved for the judgment that machines cannot make — prose quality and content correctness. Split the cheap mechanical check from the expensive judgment check.

## Related

- [frontmatter-as-schema](frontmatter-as-schema.md) — the schema this lint gate enforces mechanically
- [`memorization/rules.md` §4.5](../../../skills/memorization/rules.md) — the gobbi leak gate this docs-as-code split informed

## Why it applies
Informs the self-enforcement tier. A mechanical frontmatter/section conformance check — extend gobbi's existing Final-Gate grep to `features/` — catches schema and staging-key-leak violations cheaply (the minimal grep gate, Locked Decision 4 / D8). The prose-quality / type-purity bar stays a judgment check; encoding it as a dedicated evaluation perspective is the heavier enforcement the user deferred. Invoke when shaping the minimal grep gate and the Deferred backlog.

## Source
- https://www.netlify.com/blog/a-key-to-high-quality-documentation-docs-linting-in-ci-cd/
- https://buildwithfern.com/post/docs-linting-guide
- https://fiberplane.com/blog/drift-documentation-linter/

## Excerpt
"Linters catch the mechanical issues so human reviewers can focus on what only humans can judge — the content."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-26 | b0a0eaf9-03f7-4dce-a040-c7443653a459 | Anchored D8 (minimal grep gate, no behavior change) + the Deferred heavier-enforcement backlog |
