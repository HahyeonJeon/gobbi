---
name: core-principle-framed-as-action-not-documentation
description: A documentation template's core principle was authored as a principle for the underlying activity, not for documenting that activity
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-20
session: 8bdd12ad-9d28-4293-a38f-881db184c465
tags: [docs-sync, memory, process]
keywords: [core-principle, documentation-discipline, template-authoring, layer-2-candidate]
author: claude
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
---

# A documentation template's core principle was framed as an action principle, not a documentation principle

## What happened

When adding a `## Core principle` to each memory-template, the principles were first
authored as principles for the **activity** the type represents — not for documenting
that activity. Examples:

- `plans`: "Decompose the approach into ordered, verifiable sub-tasks" — that is *how to
  plan*, not how to write a plan doc.
- `reviews`: "Assess an artifact across perspectives, then reach a verdict" — that is
  *how to review*, not how to write a review doc.

The user corrected this: a memory-type's core principle must be a principle for the
**documentation** of that type, not for the underlying action. It took three passes to
land — a shape fix (blockquote + body), then a shallow reframe, then a deep per-type
research pass — before the principles read as documentation disciplines.

## User feedback

The principle on each template must govern the *documentation* of the type, not the
activity the type is about. A `plans/` core principle states what a plan doc must
capture so a future reader is served — not how to do the planning.

## Why it happens

Asked to add a "principle" to a documentation template, the natural reach is the
discipline of the underlying activity (planning, reviewing, deciding) — not the
discipline of **producing the document**. The two are easy to conflate because the doc
is *about* that activity, so the activity's discipline feels like the obvious principle
to state.

## Correct approach

A documentation principle states what the `{type}/` doc must **capture** and how to
write it so a future reader is served. The directive verb names *producing the doc* —
Record / Write / Capture / Keep / State [what the doc holds] — never the activity verb
(Decompose / Assess / Decide). Derive the principle from two things:

1. The doc's **reader** — who opens this doc later, and what they need from it.
2. The **failure mode of a bad doc** of that type — what is lost when the doc is written
   poorly.

State the principle so it serves the reader and forecloses that failure mode.

## How to detect

Two trigger signals — either one means the principle is action-framed and needs
reframing to a documentation discipline:

- The principle's verb is an **activity verb** — decompose / assess / decide / review /
  plan — rather than a producing-the-doc verb (Record / Write / Capture / Keep / State).
- The principle would read **identically** in a "how to DO X" guide and a "how to
  DOCUMENT X" template. If you could paste it into either with no change, it is about
  the action, not the document.

## Layer-2 (cross-project) candidate

This generalizes beyond gobbi's memory templates: it applies to authoring principles or
guidance for **any** documentation artifact (templates, doc standards, contribution
guides). The trap — reaching for the activity's discipline instead of the document's —
is project-independent, so this is a **Layer-2 promotion candidate** for workspace-level
skill storage.

## Related

- [[label-rename-missed-in-fence-and-cross-doc]] — a sibling docs-sync trap from the same
  template-redesign session
- [[memory-template-redesign]] — the session journal that records this iteration
