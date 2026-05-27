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

**Chosen direction**: Move the `## Glossary` block (currently at `gobbi/SKILL.md:15-29`) to a new position immediately before `## Workflow Overview` (currently line 128) and after `## Session Bootstrap Order` ends (~line 124). Execution: a single Edit (cut Glossary block, paste at new location).

**Rationale**: A fresh manager's first need is to run the bootstrap (env vars + settings + project-memory check + workflow entry). Once bootstrapped, the manager benefits from the Glossary as a quick vocabulary anchor before entering the substantive workflow. Currently the Glossary interrupts the flow between the Introduction and the bootstrap steps, forcing the reader to skip past vocabulary definitions before finding the actionable bootstrap.

**Anchored insight**: I9 — `gobbi/SKILL.md:15-29` (Glossary table) confirmed to appear before `gobbi/SKILL.md:32-124` (Session Bootstrap Order) via direct `cat` verification this session.

**Validation**: `awk '/^## Glossary/{a=NR}/^## Workflow Overview/{b=NR}/^## Session Bootstrap Order/{s=NR}END{print s, a, b}' gobbi/SKILL.md` shows Session Bootstrap Order line < Glossary line < Workflow Overview line.
