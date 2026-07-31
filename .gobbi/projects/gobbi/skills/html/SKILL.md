---
name: html
description: "MUST load before writing or reviewing HTML. HTML is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# HTML

HTML covers creating and reviewing markup consumed as browser documents, fragments, or Electron renderer
documents. Its children separate artifact work, platform lookup, and semantic judgment.

This root owns navigation only. Load every child whose trigger applies; every supported HTML task must select
at least one row.

Electron renderer work also routes through [`electron`](../electron/SKILL.md), whose root selects every
applicable Electron child; HTML children own only the emitted markup.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`html-authoring`](html-authoring/SKILL.md) | operation | MUST load when creating, repairing, or accepting an emitted HTML artifact. |
| [`html-platform`](html-platform/SKILL.md) | tool | MUST load when looking up HTML conformance, parsing, target support, or evidence meaning. |
| [`html-semantics`](html-semantics/SKILL.md) | preference | MUST load when choosing or reviewing HTML elements, names, states, language, direction, or accessibility semantics. |
