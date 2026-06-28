---
name: wire-review-doc-into-workflow
description: Wire the new coding/review.md into the workflow — Load Directives, runtime mirrors, evaluation-phase integration, reverse back-links
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: []
keywords: [review, coding-skill, wiring, load-directives, runtime-mirror, evaluation-integration, back-links]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Wire coding/review.md into the workflow

## Context
This session authors `skills/coding/review.md` standalone (a child doc of the `coding` skill, with a comprehensive review-points taxonomy + a review procedure). The locked scope deliberately defers WIRING the new doc into the gobbi workflow. This backlog tracks that follow-up so the doc does not stay an orphan reference.

## Why deferred
The user locked scope to authoring the doc only (discussion-log 2026-06-27). Wiring touches multiple surfaces and risks scope creep into runtime config and edits to other skill docs; it is a distinct piece of work with its own review surface.

## When to pick up
After `review.md` ships and passes evaluation. No hard prerequisite beyond the doc existing. Pick up when the team wants review.md to be loaded/applied automatically rather than read manually.

## Suggested approach
Enumerate the wiring surfaces with a CRUD plan (Principle 9):
- **Load Directives** — add `review.md` to the relevant delegation prompts / phase docs where a code review runs (e.g., Execution evaluation, or a standalone review task), so reviewing agents load it.
- **Runtime mirrors** — mirror the doc into the active runtime surfaces if required: `.claude/` (note the claude-skills mirror is a symlink, not a copy — see `mistakes/docs-sync/claude-skills-mirror-is-symlink-not-copy.md`), `.codex/`, and `plugins/gobbi/`.
- **Evaluation-phase integration** — decide whether `coding/evaluation.md` should reference `review.md` as the reader-facing playbook above its executable frame, and whether the `/code-review` built-in should be pointed at `review.md`'s points + procedure.
- **Reverse back-links (the deferred edit to existing skill docs)** — editing `coding/SKILL.md` and `coding/evaluation.md` to point BACK to `review.md` is deferred wiring and lives here. (Authoring `review.md` to cite those docs ONE-WAY is part of the authoring scope and is NOT in this backlog — only the reverse edits to the existing docs are.) This was explicitly removed from `review.md`'s own acceptance gate so authoring stays decoupled from wiring.

## Originating session
`.gobbi/projects/gobbi/sessions/2026-06-27-d45128ad-6a6c-4bb7-9925-343cd3b826c8/`

## Related
- [[scrub-stack-idioms-when-adapting-to-general-doc]] — keep wiring claims out of the doc body until wiring actually ships
