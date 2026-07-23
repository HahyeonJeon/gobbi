---
name: point-dont-restate-workflow-docs
description: In orchestration/workflow/*.md, reference a peer-owned SSOT concept by one typed owner pointer; never restate it as a block, tree, or list.
type: rules
scope: project
feature: null
status: active
created: 2026-07-07
session: 5a0709c2-4f59-448c-8aab-88619c33fb90
tags: [docs-sync, process]
keywords: [workflow-docs, pointer, ssot, hoist-then-point, compaction, drift-guard]
author: claude
priority: high
established: 2026-07-07
supersedes: null
---

# Point, don't restate, in workflow docs

> In `orchestration/workflow/*.md`, any concept whose SSOT is a peer skill, `record-map.md`, `production.md`, `evaluation/SKILL.md`, or `record/SKILL.md` is referenced by **exactly one typed owner pointer** (single, or one of the two named split-owners: Evaluation, Record) and MUST NOT be reproduced as a fenced block, a redrawn session/output tree, an enumerated value list, or a restated peer procedure. **Hoist-then-point:** never point at content the owner does not yet hold — establish the SSOT first.

> **Enforcement:** `orchestration/scripts/check-workflow-pointer-drift.sh` (+ `pointer-drift-manifest.txt`) is the runnable companion — a *literal* guard (doc-kind drift, missing typed pointers on compacted docs, fenced/box-char tree redraws, the no-commit phrase family incl. the removed block's own heading, the dual-system heading, and the manifest-authorized local-procedure allowance — invariant-(iii)/#8: a doc claiming the annex without the `local-procedure` flag, or an authorized doc copying a generic-SOP section heading, fails closed). A literal grep is NOT a full semantic proof (e.g. a plain-indent tree redraw is a known bounded gap). The prose rule is the normative contract; the guard is the automated partial check.

## Reason

Restated content drifts from its SSOT. Before this rule, the 8 `orchestration/workflow/*.md` docs re-copied concepts their real owners already held — the no-commit git-mechanics rule, the session-record tree, the dual-system production block, the perspective table. Every copy inflated the manager's recurring read load and let the copy fall out of sync as the owner changed. A single typed pointer removes the copy: one place to read, one place to change, so the concept cannot drift.

## When to apply

- Editing or authoring any `orchestration/workflow/*.md` doc.
- The content reproduces a concept whose single source of truth lives in a peer skill, `record-map.md`, `production.md`, `evaluation/SKILL.md`, or `record/SKILL.md` — a git-mechanics rule, a session/output directory tree, an enumerated value set, or a peer procedure.
- Compacting a workflow doc: replace each restated block with one typed owner pointer, and establish the SSOT in the owner FIRST (hoist-then-point) before any loop doc points at it.

## When NOT to apply

- Loop-specific **(M)** content that only that workflow doc owns is NOT a restatement — keep it (e.g. `wrap-up.md`'s inverted promotion-commit boundary, `execution.md`'s implementation-commit-is-real note, `preparation.md`'s `generate-now` `chore(skills)` exception).
- A **manifest-authorized locally-owned operational procedure** (D2 Option D). A workflow doc flagged `local-procedure` in `pointer-drift-manifest.txt` MAY carry its own Gobbi-specific operational procedure for that loop — this is genuine local ownership, not a restatement. The authorization is narrow and fail-closed: it covers ONLY that doc's local operations. General planning craft stays sole-owned by the planning SOP (reached by one typed pointer, never restated), and every peer-owned shared mechanism keeps its single typed owner pointer. A doc that claims the annex WITHOUT the flag, or a flagged doc that copies a generic-SOP section heading (`## Principles` / `Rules` / `Procedure` / `References`), is still a restatement violation — `check-workflow-pointer-drift.sh` invariant-(iii) (#8) fails it closed. Only Planning holds the flag today.
- Outside `orchestration/workflow/*.md` — the rule governs the workflow-doc surface only; other surfaces follow their own authoring conventions.
- A single short in-line phrase naming a concept in passing (not a reproduced block, tree, list, or procedure) is a reference, not a restatement.

## Related

- [[two-doc-kind-compaction-model]] — the loop-orchestration / gate-orchestration model this pointer discipline enforces
- [[workflow-compaction-two-doc-kind]] — the locked design (hoist-then-point + drift guard) this rule was promoted from
