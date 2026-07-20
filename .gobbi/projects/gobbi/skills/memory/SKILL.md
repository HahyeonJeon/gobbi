---
name: memory
description: MUST load when identifying, staging, promoting, superseding, or verifying durable-memory candidates.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Memory

Use this skill when evidence may deserve a durable life beyond the current session. The operation identifies candidate material, filters it for durable value, assigns one authorized type and scope, prepares a typed candidate, and follows it through staging, promotion, lifecycle change, and final verification.

Memory owns the candidate policy and durable lifecycle. [Record](../record/SKILL.md) owns session-record writes and typed staging mechanics. [Wrap-up](../wrap-up/SKILL.md) owns inventory, manifest, apply, and handoff mechanics. [Memory rules](rules.md) and the matching [templates](templates/) own durable file shape.

## Principles

### Evidence before persistence

Durable memory preserves supported facts, decisions, constraints, and reusable lessons. It does not preserve speculation merely because a directory exists.

### Empty is a complete result

An empty candidate set and empty typed staging are valid. A clean result is evidence that nothing durable was justified, not a gap to fill.

### Type and scope carry meaning

The selected type states what job the record does. Scope states who must keep using it. A convenient path never substitutes for either decision.

### Lifecycle changes preserve history

New understanding may supersede an older record, but it does not erase it. Reciprocal references and the complete terminal record keep the change auditable.

## Rules

### M-1

**Require an authoritative source.** Every candidate cites exact accepted evidence, a user decision, a verified result, or a supported correction. Unsupported recollection is not a candidate.

### M-2

**Filter for durable value and permit an empty set.** Keep only material that will change a future decision, action, verification, or understanding. Never add filler to make a candidate set or typed staging non-empty.

### M-3

**Select one authorized type and scope.** Choose from the current typed staging and durable-home map. Apply the type boundary and project-versus-feature scope deliberately. If evidence cannot resolve a legal choice, return `NEEDS_CONTEXT` through the manager.

### M-4

**Author a complete typed candidate.** Use the matching memory template, one stable concept slug, required durable content, exact sources, and only authorized routing fields. A label or directory alone does not make a candidate valid.

### M-5

**Give session writes to Record.** Record stages the candidate under the authorized typed `staging/` directory and preserves earlier staged evidence. Memory policy never grants a working-step actor direct durable-tree write authority.

### M-6

**Give promotion mechanics to Wrap-up and accept typed staging only.** Every promotion input is a regular file below an authorized `staging/` type. Scratch work, evaluations, outputs, and direct ad hoc inputs are ineligible. Wrap-up accounts for every eligible source, including a valid empty inventory.

### M-7

**Keep one evaluated handoff body.** The handoff candidate originates as typed notes staging. On acceptance, the same body appears at `4-wrap-up/outputs/handoff.md` and `notes/{area}/{YYYY-MM-DD}-{slug}.md`; only the durable frontmatter wrapper may differ.

### M-8

**Make ordinary supersession reciprocal.** The new record names the old record in `supersedes`. The old record changes to its terminal status and names the new record in `superseded_by`. One-sided linkage is invalid.

### M-9

**Move terminal records whole and never delete them.** Move the complete terminal record to `archive/{type}/{area}/{YYYY-MM-DD}-{slug}.md`, preserve its original type and body, and repoint inbound path references. Plain-slug lifecycle references remain stable.

### M-10

**Verify the final lifecycle, not the intended change.** Confirm source eligibility, type and scope, template conformance, path mapping, reciprocal references, archive state, inbound links, unchanged prior evidence, handoff-body equality when applicable, and exact changed-path scope. A failed check halts completion.

## Procedure

### 1. Establish the memory decision boundary

Read the accepted artifact, finding dispositions, relevant user decisions, verification results, and current durable records. Confirm which actor has authority to stage, promote, supersede, or move the material.

If the evidence or authority is missing, stop with the exact missing input. Do not infer a durable claim from a task summary.

Evidence: a source register with exact paths or decision identifiers. Apply M-1.

### 2. Identify candidate material

List each distinct fact that may help a future session: an approved decision, reusable reference, architecture choice, durable discussion outcome, deferred item, independent assessment, shipped change, verified lesson, handoff, or accepted plan.

Keep one row per concept. Record its source, intended future consumer, and the future action or understanding it changes. Do not choose a path yet.

Evidence: a candidate inventory that may contain zero rows. Apply M-1 and M-2.

### 3. Apply the durable-value filter

For each row, ask whether the content remains useful after the current session and whether its source supports the durable claim. Drop session-only detail, duplicated evidence, tentative thought, and material already represented by the same durable record.

When no row passes, declare the candidate set empty and continue with no staged file. Do not invent a note or finding.

Evidence: a keep/drop decision and reason for every row. Apply M-2.

### 4. Select type, scope, and lifecycle intent

Use [memory-map.md](memory-map.md) to select one authorized typed source and durable home. Use [rules.md](rules.md) and the matching template to test the type boundary. Select project scope only for cross-feature material; otherwise use feature scope when the type permits it.

Compare the concept with existing durable records. Choose create, same-source no-op, or ordinary supersession. A collision without clear identity or authority returns `NEEDS_CONTEXT`.

Evidence: type, scope, area input, preferred slug, lifecycle intent, and existing-record comparison. Apply M-3, M-8, and M-9.

### 5. Author the typed candidate

Prepare one candidate from the selected template. Include the stable slug, durable body, exact evidence, scope, type-specific fields, and the smallest authorized routing data needed by Record and Wrap-up. Reference or redact sensitive source material instead of copying it.

Challenge cosmetic compliance: remove the source evidence or the substantive body and confirm the candidate would fail.

Evidence: a candidate that satisfies its template and source trace before staging. Apply M-1 and M-4.

### 6. Stage through Record

Hand the candidate to [Record](../record/SKILL.md). Record writes it beneath the exact authorized typed `staging/` path, or records the empty candidate result. It preserves earlier staged files and uses explicit supersession rather than rewriting prior evidence.

Reread the staged file and confirm its path, bytes, source identity, and type agree with the candidate decision. Filesystem shape, output placement, and command use remain Record-owned.

Evidence: one typed staging path and hash per kept candidate, or an explicit empty result. Apply M-4 and M-5.

### 7. Prepare Wrap-up inputs

Before promotion, enumerate every authorized typed staging source across expected step and task roots. Reject any source outside an authorized `staging/` type. An empty inventory proceeds as a valid input.

For the handoff, author one evidence-backed body through the notes template and stage it at the Wrap-up notes source. Bind both intended handoff destinations to that body before review.

Evidence: a complete typed-source inventory and, when closing a session, one handoff-body identity. Apply M-6 and M-7.

### 8. Promote through Wrap-up

Hand the immutable inventory to [Wrap-up](../wrap-up/SKILL.md). Wrap-up resolves destinations from the frozen mapping, validates complete candidates, captures destination preimages, applies the authorized durable changes inside the isolated worktree, and proves every changed path has one typed source.

Memory supplies type, scope, lifecycle, and history-preservation policy. Wrap-up supplies manifest and filesystem mechanics. If the durable target changes before apply, halt and rebuild through the Wrap-up owner.

Evidence: source-to-destination mapping, validated durable candidates, and actual-tree results. Apply M-3, M-6, and M-10.

### 9. Complete ordinary supersession and terminal moves

When a new record replaces one existing record, write the new `supersedes` reference and the old `superseded_by` reference as one authorized change. Move the complete old record to its typed archive home after it reaches terminal status.

Enumerate and repoint inbound path references. Do not hard-delete the old file, reduce it to a pointer, or leave it active beside the replacement.

Evidence: both lifecycle directions, the full archive record, and resolved inbound references. Apply M-8 and M-9.

### 10. Verify and close the lifecycle

Inspect the final files and actual diff. Trace every durable change back to one typed staging source and every source to one accounted outcome. Run the current memory-shape and scoped-link validators from their owners. Confirm prior staged evidence is unchanged.

When a handoff exists, compare the session and durable bodies byte-for-byte after removing the durable frontmatter wrapper. Report exact paths, checks, results, empty sets, and unresolved concerns.

Completion evidence: all applicable checks in [checklists.md](checklists.md) pass, the scenario frame in [scenarios.md](scenarios.md) has no uncovered applicable obligation, and independent review enters through [evaluation.md](evaluation.md). Apply M-7 and M-10.

## References

- [Memory map](memory-map.md) owns the thin typed-source-to-durable-home mapping and ownership boundaries.
- [Memory rules](rules.md) own durable naming, frontmatter, type constraints, scope, area, and archive form.
- [Memory templates](templates/) own the per-type candidate and durable body shapes.
- [Record](../record/SKILL.md) and its [record map](../record/record-map.md) own typed staging writes and the complete session tree.
- [Wrap-up](../wrap-up/SKILL.md) owns typed-source inventory, frozen mapping, apply, actual-tree verification, and matching handoff mechanics.
- [Evaluation](../evaluation/SKILL.md) owns independent review, findings, checklist completion, and verdict derivation.
- [Scenario](../scenario/SKILL.md) and [Checklist](../checklist/SKILL.md) own the companion authoring contracts used by this operation.
