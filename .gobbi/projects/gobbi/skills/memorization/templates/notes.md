# `notes/`

**Development journal entries** — the running narrative of what was worked on in each session, akin to a developer's daily diary. One entry per session captures the session's work-log: what was attempted, what shipped, what got stuck, what shifted, what to pick up next time.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Loop MEMORIZATION** (`ideation` / `planning` / `execution`): stage at `sessions/{date}-{session-id}/{loop}/staging/notes/{slug}.md`. Loop MEMORIZATION **never** writes directly to project memory.
2. **Wrap-up's MEMORIZATION**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to project memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Project-memory routing](../../wrap-up/SKILL.md#staging--project-memory-routing).

---

`notes/` is **not** a soft-landing zone for unstructured observations (that role belonged to a prior interpretation that has been retired). It is the **chronological work log** of the project. A reader scanning `notes/` chronologically reconstructs the day-by-day / session-by-session history of how the project actually progressed.

## When to write

- **During Wrap-up MEMORIZATION** of every session: the Wrap-up assistant writes one journal entry summarizing the session's work. This is the default — every session gets a notes entry.
- **During a loop's MEMORIZATION** when the loop's content is substantial enough to warrant its own journal entry separate from the session-level note (rare; most loops fold into the session's single note).

The journal is **session-paced**: one entry per session is the norm, regardless of how long the session ran or how many loops it contained.

## Location

- Project-level only: `.gobbi/projects/{project-name}/notes/`

`notes/` is the project's timeline. Feature-specific journal content is summarized in the session note and cross-linked from `features/{feature-name}/README.md`'s Recent activity table — there is no `features/{feature-name}/notes/` tier.

## File naming

`{YYYY-MM-DD}-{slug}.md` — date prefix; slug describes the session's dominant theme.

Examples:
- `2026-05-11-memorization-skill-refactor.md`
- `2026-05-11-orchestration-redesign-day-3.md`
- `2026-05-11-mistakes-rename-sweep.md`

When multiple sessions occur on the same date, the slug differentiates them. The journal slug should answer "what did this session do?" in 3–6 words.

## Item template

Carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file) plus the notes-type extension (`features_touched` — the value-feature slugs this session promoted into, the L2 session→feature link). `notes/` is project-only and immutable, so base `status` stays `active`.

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
tags: [{tag1}, {tag2}]
features_touched: [{value-feature slugs this session promoted into}]
loops_completed: [{ideation, preparation, planning, execution, wrap-up}]
shipped: [{slugs of artifacts that landed in project memory this session}]
---

# {Session dominant theme}

## What happened
{Chronological narrative of the session. 1–3 paragraphs. What was attempted, in what order, with what outcome. Read this and a future reader knows what the session was about.}

## What shipped
{Concrete artifacts that landed in project memory during this session — decisions, plans, mistakes, learnings, reviews, reports. Cite paths. If nothing shipped, state "nothing shipped — session was {discussion-only / blocked / aborted}".}

## What got stuck
{Threads that didn't resolve. The "I tried X but" moments. Distinct from backlog — backlog is the deferred work; this is the in-flight stuck. Useful for the next session to pick up cleanly.}

## What shifted
{Direction changes during the session — decisions that were reconsidered, plans that were rescoped, assumptions that broke. The journal captures *motion*, not just outcomes.}

## Next session
{Pointer to what the next session should pick up. Could be "continue {feature}", "evaluate {plan}", "react to {finding}". Keep terse — detail belongs in backlogs / handoff summary.}
```

## Distinguishing notes from neighbors

- **`notes/` vs `decisions/`**: a decision is the *conclusion* — "we chose X". A note is the *narrative* — "during this session we considered X / Y / Z and ended up choosing X". The decision lives durably as a load-bearing artifact; the note is the surrounding story.
- **`notes/` vs `learnings/`**: a learning is the *takeaway* extracted from one or many sessions ("do this in future"). A note is the *raw experience* of one session. Many notes might produce one learning.
- **`notes/` vs `discussions/`**: a discussion is one AskUserQuestion topic with the user's answer. A note is the session-level narrative that may *reference* multiple discussions.
- **`notes/` vs `design/`**: design is the architecture / intent. Notes is what actually happened while building toward / away from that intent.
- **`notes/` vs handoff summary in `wrap-up/artifacts/`**: the handoff is forward-looking ("what the next session needs to know to continue"). The note is backward-looking ("what this session did"). Both can exist for the same session; they serve different consumers.

## Lifecycle

Journal entries are **append-only history**. They are never edited after the session closes — even if a later session reveals the session's understanding was wrong, the journal preserves what was thought at the time. The correction is captured in the *new* session's note ("we learned that the 2026-05-11 approach was wrong; here is the revised model").

## Cross-references

- Session canonical artifacts: a note may cite paths in `sessions/{date}-{session-id}/{loop}/artifacts/` for readers who want full detail.
- Feature READMEs: `features/{feature-name}/README.md`'s Recent activity table includes a row per relevant note for cross-navigation.
- Decisions / plans / mistakes / learnings produced this session are listed in the `shipped` frontmatter so the journal is a navigable index of the session's outputs.
