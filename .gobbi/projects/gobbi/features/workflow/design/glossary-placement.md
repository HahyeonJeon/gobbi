---
name: glossary-placement
description: Move the Glossary block in gobbi/SKILL.md from before the bootstrap steps to after them, so a fresh manager's first read is the actionable bootstrap.
type: design
scope: feature
feature: workflow
status: active
created: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [gobbi-skill, glossary, session-bootstrap, doc-structure]
topic: glossary-placement
---

# Move glossary below session bootstrap order in `gobbi/SKILL.md`

## Context

In `gobbi/SKILL.md`, the `## Glossary` block sits between the Introduction and the `## Session Bootstrap Order` steps. A fresh manager opening the skill must scroll past vocabulary definitions before reaching the actionable bootstrap — env vars, settings, project-memory check, workflow entry — which is the manager's actual first need.

## Decision

Move the `## Glossary` block to a new position immediately before `## Workflow Overview` and after `## Session Bootstrap Order` ends. Execution is a single Edit: cut the Glossary block, paste it at the new location.

## Rationale

A fresh manager's first need is to run the bootstrap; the Glossary is a vocabulary anchor that is most useful *after* bootstrap, just before entering the substantive workflow. Placing the bootstrap first puts the actionable content at the top of the reader's path and relocates the reference material to where it is consulted.

## Alternatives considered

- **Leave the Glossary before the bootstrap.** Rejected: it interrupts the flow from Introduction to the actionable bootstrap, forcing the reader to skip vocabulary before doing anything.
- **Delete the Glossary.** Rejected: the vocabulary anchor is still valuable once bootstrapped; the issue is placement, not the content.

## Consequences

The bootstrap steps lead the document; the Glossary follows them and precedes the Workflow Overview. Validation: `awk '/^## Glossary/{a=NR}/^## Workflow Overview/{b=NR}/^## Session Bootstrap Order/{s=NR}END{print s, a, b}' gobbi/SKILL.md` shows the Session Bootstrap Order line < Glossary line < Workflow Overview line.

## Related

- `design/drop-legacy-setup-questions.md` — the sibling `gobbi/SKILL.md` bootstrap-content change shipped in the same Bundle A pass.
