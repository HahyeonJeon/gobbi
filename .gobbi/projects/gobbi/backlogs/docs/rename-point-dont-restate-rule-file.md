---
name: rename-point-dont-restate-rule-file
description: Rename the rule-file slug point-dont-restate-workflow-docs.md to name the steps/ directory instead of "workflow docs"
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-25
session: 69314d61-5a03-4ad7-9672-64031832463a
tags: [refactor, rename-sweep]
keywords: [rule-file, slug-rename, point-dont-restate, steps-dir, filename]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Rename the point-dont-restate rule file slug

## Context

The rule doc `.gobbi/projects/gobbi/rules/docs/point-dont-restate-workflow-docs.md` governs the
workflow step docs. The orchestration to workflow rename session repointed its internal path globs
(`orchestration/workflow/*.md` to `workflow/steps/*.md`) and its prose ("orchestration workflow docs"
to "workflow step docs") in scope. Only the filename slug was left unchanged: it still says
"workflow-docs" while the docs it governs now live in `workflow/steps/`.

## Why deferred

A rule-file slug rename is a distinct change from the mechanical reference sweep. The filename is a
path reference: renaming it breaks any inbound path reference (link consumers, and any
`required-*` path ref), which must be enumerated and repointed as its own bounded change. The rename
session's scope was the `orchestration` to `workflow` sweep plus the `gobbi` entry redesign, not a
rule-file slug refactor, so the slug rename was surfaced as a follow-up.

## When to pick up

No hard prerequisite. Natural trigger: the next time this rule file or its consumers are touched.

## Suggested approach

`git mv` the file to a slug that names `steps/` (for example `point-dont-restate-step-docs.md`),
enumerate and repoint every inbound path reference, then run `scripts/check-markdown-links.sh` and
`skills/memory/scripts/validate-frontmatter.sh` over the affected files to confirm no dangling
reference and valid frontmatter.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-24-69314d61-5a03-4ad7-9672-64031832463a/`

## Related

- [[fix-production-md-dangling-ref]] — a sibling documentation-cleanup deferral surfaced by the same rename session
