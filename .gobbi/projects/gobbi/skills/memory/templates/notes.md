# `notes/`

> Development journal entries — the running narrative of each session, like a developer's daily diary. One entry per session: what was attempted, what shipped, what got stuck, what shifted, what to pick up next.

## Core principle
Record what happened and what to pick up next — so the next session continues the work instead of reconstructing it.

## Write it

| Field | Value |
|---|---|
| When | Wrap-up RECORD of every session writes one journal entry — the default. A loop's RECORD writes its own entry only when the loop's content warrants one separate from the session-level note (rare). |
| Stage to | `sessions/{date}-{id}/{N}-{loop}/staging/notes/{slug}.md` |
| Promotes to | `notes/` (project-only — no `features/{f}/notes/` tier) |
| Filename | `{YYYY-MM-DD}-{slug}.md` — date prefix; slug answers "what did this session do?" in 3–6 words (`2026-05-11-mistakes-rename-sweep.md`) |

Loop RECORD stages; Wrap-up promotes ([routing](../../wrap-up/SKILL.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter plus the notes extensions — `notes/` keeps the **richer set**: `features_touched` (the value-feature slugs this session promoted into), plus `loops_completed` and `shipped` ([rules §2.2](../rules.md#22-per-type-extension-fields--the-status-model)). `notes/` is project-only, so `status` stays `active`.

```markdown
---
name: {slug — session dominant theme}
description: {one-line what this session did}
type: notes
scope: project
feature: null
status: active
created: YYYY-MM-DD
session: {session-id}
tags: [refactor, docs-sync]          # controlled vocabulary (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
features_touched: [{value-feature slugs this session promoted into}]
loops_completed: [{ideation, preparation, planning, execution, wrap-up}]
shipped: [{slugs of artifacts that landed in memory this session}]
---

# {Session dominant theme}

## What happened
{Chronological narrative of the session. 1–3 paragraphs. What was attempted, in what order, with what outcome. Read this and a future reader knows what the session was about.}

## What shipped
{Concrete artifacts that landed in memory this session — decisions, plans, mistakes, learnings, reviews, reports. Cite paths. If nothing shipped, state "nothing shipped — session was {discussion-only / blocked / aborted}".}

## What got stuck
{Threads that didn't resolve. The "I tried X but" moments. Distinct from backlog (the deferred work); this is the in-flight stuck — useful for the next session to pick up cleanly.}

## What shifted
{Direction changes during the session — decisions reconsidered, plans rescoped, assumptions that broke. The journal captures *motion*, not just outcomes.}

## Decisions to respect
{The standing decisions a future session must not silently re-litigate — locks the user ratified, constraints accepted, directions chosen. The handoff shortlist: "these are settled; build on them, do not reopen them without cause." Cite the `decisions/` slug where one exists.}

## Next session
{Pointer to what the next session should pick up — "continue {feature}", "evaluate {plan}", "react to {finding}". Keep terse; detail belongs in backlogs / handoff summary.}

## Related
{Navigable `[[slug]]` links to the artifacts this session produced or built on — the journal's index, mirroring the `shipped` frontmatter ([rules §2.4](../rules.md#24-cross-references-and-the-doc-graph)).}

- [[2026-05-11-use-redis-not-memcached]] — decision shipped this session
```

## Notes

- **Append-only history.** Journal entries are never edited after the session closes — even if a later session reveals the understanding was wrong, the journal preserves what was thought at the time. The correction is captured in the *new* session's note.
- **Vs other types.** A note carries the session narrative; the durable artifacts it references live in their own types:

  | Type | Holds | The note holds |
  |---|---|---|
  | `decisions/` | the conclusion ("we chose X") | the surrounding story ("we considered X/Y/Z, chose X") |
  | `learnings/` | the takeaway ("do this in future") | the raw experience that produced it |
  | `discussions/` | one user-decision topic + answer | the session narrative that references many discussions |
  | `design/` | the architecture / intent | what actually happened building toward it |
  | handoff (`5-wrap-up/outputs/`) | forward-looking ("what the next session needs") | backward-looking ("what this session did") |
