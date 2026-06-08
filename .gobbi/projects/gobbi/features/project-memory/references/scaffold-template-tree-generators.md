---
name: scaffold-template-tree-generators
description: Scaffolding generators use a template dir + questionnaire + placeholder substitution; copier adds in-place re-stamp of an existing project.
type: references
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [generator, scaffolding, cookiecutter, copier, session-skeleton]
title: Project templating tools — Cookiecutter / Copier / Yeoman
source: https://www.cookiecutter.io/article-post/cookiecutter-alternatives
accessed: 2026-06-08
ref_type: docs
---

# Project templating tools — Cookiecutter / Copier / Yeoman

## Insight
Scaffolding generators share one shape: a declarative template directory whose file contents and paths carry placeholders (e.g. `{{property}}`), a small questionnaire of values, and a render step that substitutes placeholders to produce a ready tree. Copier extends this with in-place template *updates* — re-stamping an existing project when the template evolves.

## Related
- design decision D7 (bash+jq template-tree generator)
- design decision D2 (loop-symmetric notes/ record the generator stamps)

## Why it applies
D7's session-skeleton generator should be a declarative template-tree with `{{ssid}}`/`{{date}}`/`{{slug}}` substitution (cookiecutter-shaped), not imperative `mkdir` calls — so the canonical structure is visible as a template and re-stampable (copier-style) when it evolves. Implemented in bash+jq to match the in-tree hook/script stack with no new runtime dependency.

## Source
- https://www.cookiecutter.io/article-post/cookiecutter-alternatives
- https://copier.readthedocs.io/en/stable/comparisons/

## Excerpt
"During project generation, Cookiecutter replaces all placeholders like `{{cookiecutter.property-name}}` in all files with values provided by a user." "Copier is the evolution of cookiecutter, adding a killer feature: template updates."
