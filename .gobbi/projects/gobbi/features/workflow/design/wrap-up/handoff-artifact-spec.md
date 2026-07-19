---
name: handoff-artifact-spec
description: Handoff artifact location, naming, template, and "shown to session" mechanic
type: design
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [wrap-up, design]
keywords: [handoff, artifact]
author: claude
supersedes: null
superseded_by: null
related: [wrap-up-5-stage-pipeline]
---

# Handoff artifact spec (D-d)

## Problem
The wrap-up procedure produces a handoff summary but its location, naming, template, and "shown to the session" mechanic were not explicitly specified, leaving each session to infer these from context.

## Scope
In: specify the handoff artifact; define the "shown to session" mechanic. Out: handoff content (already exists at `wrap-up/SKILL.md:155`).

## Approach
- **Location/naming**: `sessions/{date}-{session-id}/4-wrap-up/outputs/handoff.md` (`artifact_type: handoff`). Session-scoped (gitignored). The ordinal follows the v0.5.3 four-loop session shape.
- **Durable cross-session handoff**: the per-session journal `notes/{date}-{slug}.md` — written at WORK Step 6, promoted to memory. Survives across sessions via memory promotion. `handoff.md` itself is session-ephemeral.
- **Template**: the `notes` section contract from `memory/rules.md` §4.2 for the journal (What happened / What shipped / What got stuck / What shifted / Decisions to respect / Next session). `handoff.md` keeps its required sections (Summary / Shipped / Deferred-Open / Decisions to respect / Pointers / Promotion summary).
- **"Shown to the session" mechanic**: the manager reads `outputs/handoff.md` back to the session as the final message before `workflow.finish`. Explicit stage-4 step: assistant writes `handoff.md`; manager surfaces its contents to the session. Respects manager-owns-the-user-relationship role boundary.

## Scenarios
- Normal wrap-up: assistant writes `handoff.md`; manager reads it back to the user; user acknowledges; `workflow.finish`.
- Handoff missing a required section: stage 4 → REVISE before manager reads back.

## Validation
`handoff.md` exists with all required sections + frontmatter; the manager's final session message contains the handoff summary; the journal note exists.

## Trade-offs
Minimal: the mechanic just makes explicit what was implicit (manager reads back the handoff). No behavioral change beyond naming the step.

## Open issues
None. D-d was an uncontested auto-decide.
