---
name: notes-mixed-shape-coexistence
description: notes/ holds both flat journal files and per-session record directories; the two shapes coexist by design
type: decisions
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [notes, session-record, docs-structure]
decision_status: accepted
supersedes: null
superseded_by: null
---

# notes/ mixed-shape: flat journal files + record directories coexist

## Context

Before this redesign, `notes/` held only flat per-session journal files (`notes/{date}-{slug}.md`), written by `wrap-up/SKILL.md` Step 6 and described in `memory-map.md` with naming `{date}-{slug}.md`. The redesign adds per-session record directories (`notes/{date}-{slug}-{ssid}/`).

Claude evaluator (F-U1) flagged this as a discoverability concern: a future agent listing `notes/` would see two shapes with overlapping names and unclear ownership.

## Decision

Both shapes coexist. The disambiguator is the `-{ssid}` segment in the directory name:
- **Flat file** `notes/{date}-{slug}.md` — the narrative session journal, written directly by Wrap-up Step 6. This is the dev-diary.
- **Record directory** `notes/{date}-{slug}-{ssid}/` — the finalized full session memory, promoted at Wrap-up with the D2 loop-symmetric file set. This is the durable structured record.

The flat journal is NOT made redundant by the record directory's `README.md`. The two have different types: the journal is narrative (type: notes); the record directory is structured (typed per-loop files). They serve different readers.

## Rationale

The active-vs-finalized axis (user-ratified pre-Ideation) requires a finalized record in `notes/` at Wrap-up. The flat journal is the existing Wrap-up Step 6 output; removing it would require changing an existing stable mechanism. Adding the directory record alongside it is the least-disruptive extension.

The `-{ssid}` suffix on directory names guarantees no filesystem collision (a directory `foo-{ssid}/` and a file `foo.md` are distinct entries; the directory has the longer name with the session-id suffix).

## Alternatives considered

- Replace flat journal with record directory: rejected. The flat journal is a narrative (type: notes); the record directory is structured per-loop memory. Replacing one with the other loses the narrative type-job.
- Rename flat journal to use `-{ssid}` suffix too: rejected. Would break the existing naming convention for all prior flat journals.

## Consequences

`memory-map.md` + `wrap-up/SKILL.md` must explicitly document both `notes/` shapes so a reader does not treat them as duplicates. The distinction rule: file vs directory; file has no session-id suffix; directory has `-{ssid}` suffix.

## Related

- Scenario S1, Design § D2, `memorization/templates/session-record.md` (new template)
