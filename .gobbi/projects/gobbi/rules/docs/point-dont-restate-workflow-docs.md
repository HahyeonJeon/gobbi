---
name: point-dont-restate-workflow-docs
description: In orchestration workflow docs, point to each peer-owned contract once; never restate its mechanics.
type: rules
scope: project
feature: null
status: active
created: 2026-07-07
session: 5a0709c2-4f59-448c-8aab-88619c33fb90
tags: [docs-sync, process]
keywords: [workflow-docs, pointer, ssot, hoist-then-point, ownership]
author: claude
priority: high
established: 2026-07-07
supersedes: null
---

# Point, don't restate, in workflow docs

> In `orchestration/workflow/*.md`, any concept whose single source of truth is a specialist skill, `record-map.md`, `dual-system-work.md`, `evaluation/SKILL.md`, or `record/SKILL.md` is referenced by one clear owner pointer and MUST NOT be reproduced as a fenced block, a redrawn session/output tree, an enumerated value list, or a restated peer procedure. **Hoist-then-point:** never point at content the owner does not yet hold — establish the owner contract first.

> **Enforcement:** review the complete changed workflow-doc set against the ownership map, run the root-owned Markdown-link validator over those files, and use scoped `rg` searches for copied headings, trees, value lists, and procedure language from each affected owner. Literal searches are supporting evidence, not semantic proof; the ownership review is the normative gate.

## Reason

Restated content drifts from its owner. Earlier workflow docs recopied concepts their real owners already held — session-record mechanics, the dual-system work protocol, evaluation perspectives, and RECORD procedures. Every copy inflated the manager's recurring read load and could fall out of sync as the owner changed. One owner pointer removes the copy: one place to read and one place to change.

## When to apply

- Editing or authoring any `orchestration/workflow/*.md` doc.
- The content reproduces a concept whose single source of truth lives in a peer skill, `record-map.md`, `dual-system-work.md`, `evaluation/SKILL.md`, or `record/SKILL.md` — a transition mechanic, a session/output directory tree, an enumerated value set, or a specialist procedure.
- Reducing duplication in a workflow doc: replace each restated block with one owner pointer, and establish the contract in the owner first before any adapter points at it.

## When NOT to apply

- Adapter-specific manager entry, dispatch inputs, user gates, completion proof, and state transition content owned by that workflow doc is not a restatement — keep it.
- Outside `orchestration/workflow/*.md` — the rule governs the workflow-doc surface only; other surfaces follow their own authoring conventions.
- A single short in-line phrase naming a concept in passing (not a reproduced block, tree, list, or procedure) is a reference, not a restatement.
