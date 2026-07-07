---
name: compaction-prototype-scope-parameters
description: Lock the doc-kind marker form, drift-guard scope, prototype order, production.md scope, and DISCUSSION table retention for the workflow-doc compaction.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-07
session: 122609f7-3c4c-44ea-af90-efe1531a5cbf
tags: [design, docs-sync, process]
keywords: [doc-kind-marker, drift-guard, prototype-order, production-md, discussion-table]
author: claude
---

# Compaction prototype scope parameters (marker, guard scope, prototype order, `production.md` scope, sub-step table)

## Context

Once the two-doc-kind model was adopted, five smaller implementation-shape parameters had to
be locked before Planning could scope the compaction work: how the doc-kind is marked, how
strict the drift guard's tree-redraw check is, which doc gets prototyped first, how much of
`production.md` is touched this pass, and whether the DISCUSSION sub-step table survives
compaction.

## Decision

1. **Marker = visible prose.** The doc-kind is marked with `**Doc kind:** loop-orchestration.`
   / `**Doc kind:** gate-orchestration.` at the top of each doc — not frontmatter.
2. **Guard scope covers gate-doc trees too.** The drift guard's "no session-tree redraw" check
   applies to ALL `orchestration/workflow/*.md` fenced blocks, including `evaluation.md` and
   `record.md` — the two gate docs that keep compact path tables + gates but no ASCII tree.
   `record-map.md` stays the tree's sole owner everywhere.
3. **Prototype order: `ideation.md` first, then `execution.md`.** `ideation.md` is the
   most-duplicative loop doc and exercises all 8 skeleton points; `execution.md` is the
   toughest (M)-content stress via its executor-continuation gate.
4. **`production.md` — shape only this pass.** Its runtime-command guidance stays with the
   session's separate Point 3 runtime-matrix work; this compaction only applies the
   gate-orchestration skeleton shape to it.
5. **Keep the compressed DISCUSSION sub-step table** in every loop-orchestration doc — it is
   (M) orchestration content (the "which decisions require the user" gate), not
   restatable/pointable content.

## Rationale

Each parameter is a scope-boundary decision that keeps the compaction pattern from silently
expanding: a frontmatter marker would add a new machine-readable surface with no reader
benefit over visible prose; a narrower guard scope would leave `record.md`/`evaluation.md`
exactly where a stray ASCII tree would duplicate `record-map.md`'s SSOT; an unfixed prototype
order risks stressing the skeleton on the easiest doc first; touching `production.md`'s runtime
guidance here would overlap the session's separate runtime-matrix work; and dropping the
sub-step table would lose load-bearing user-escalation content, not restated boilerplate.

## Alternatives considered

- **Frontmatter-only doc-kind marker.** Rejected — less visible to a human scanning the doc,
  and the compaction pattern already carries its typed owner pointers as visible prose, so a
  frontmatter marker would be an inconsistent second mechanism.
- **Scope the "no tree redraw" guard check to only the 5 loop docs.** Rejected — the gate docs
  are exactly where a stray tree redraw would silently duplicate `record-map.md`.
- **Prototype `wrap-up.md` first.** Rejected — at 84 lines it is too simple to stress the
  skeleton.

## Consequences

Planning inherits these five parameters as fixed inputs — it applies them rather than
re-deciding them. Any change to one of the five (e.g., moving the drift guard's scope, or
reordering the prototype sequence) is itself a decision that needs the same user-ratification
this set received.

## Related

- [[two-doc-kind-compaction-model]] — the model these parameters implement
- [[workflow-doc-generalization-unproven]] — the Planning-time verification this prototype order feeds into
