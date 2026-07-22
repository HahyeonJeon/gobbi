---
name: skill-writing
description: "Use when authoring, revising, migrating, or splitting a project skill — classifies preference, tool, and operation skills, dispatches the matching writing procedure, and verifies wiring and cold use."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Skill Writing

Operation skill for producing one cold-load-sufficient project skill. It classifies the target as a
preference, tool, or operation skill, applies the matching type-owned writing procedure, then proves the
canonical source, runtime wiring, and fresh-agent use.

Load it for a new skill and for any substantive revision, migration, or split. A legacy skill may remain
untyped until it is substantively revised; narrow compatibility corrections alone do not trigger migration.

---

## Principles

> **Type follows the capability, not the topic.**

The same topic can support judgment, tool lookup, or an executable outcome. Classification by subject name
hides that difference; classification by what the agent must do makes the document shape predictable.

> **One document kind has one dominant job.**

A preference skill improves judgment, a tool skill explains a named tool, and an operation skill directs an
outcome. Supporting material is useful only while it remains subordinate to that dominant job.

> **Shared gates belong in the parent; type decisions belong with the type.**

Evidence, ownership, affected-file mapping, wiring, and cold-load proof apply to every skill. Section shape
and writing order differ by type, so they stay in direct child procedures instead of being flattened into one
universal form.

> **An operation is incomplete without evidence that the operation works.**

An ordered procedure can look plausible while failing at a branch, boundary, or recovery path. Its scenario,
checklist, and evaluation companions turn the procedure into observable obligations and binary evidence.

> **A borrowed fact has one owner.**

Copying another surface's policy makes the copy stale as soon as the owner changes. A skill states the local
action or consequence and records the single validating owner in References.

---

## Rules

### Must-Follow

- **MUST classify every new or substantively revised skill as `preference`, `tool`, or `operation` and stamp
  `skill-type` after `allowed-tools`.** The type is the body-shape contract, so leaving it implicit makes both
  authoring and evaluation ambiguous.
- **MUST carry the four required frontmatter keys plus optional keys only from P2's named allowlist.** Omit an
  optional key when its default behavior is intended, and reject keys owned by memory, workflow, or another
  schema.
- **MUST classify in precedence order: operation, then tool, then preference.** If the skill owns an ordered
  SOP, it is an operation even when it contains preferences or named-tool facts; otherwise a named-tool manual
  is a tool; the remaining judgment guidance is a preference.
- **MUST load exactly one type child at P5.** The selected child owns the final section shape, type-specific
  writing order, boundary tests, and reclassification triggers.
- **MUST keep the selected type's dominant section dominant.** Preference centers Principles and Rules; tool
  centers Manual; operation centers Procedure.
- **MUST ship every new or substantively revised operation with `scenarios.md`, `checklists.md`, and
  `evaluation.md`.** The operation-writing child authors them last through the scenario, checklist, and
  evaluation skills.
- **MUST edit the canonical project skill directory only.** Runtime paths are generated or symlinked views;
  editing them by hand creates drift or destroys the mirror topology.
- **MUST verify mechanism claims from their owner and verify taught examples against the live surface.** A
  plausible command, path, field, or wiring statement is not evidence.
- **MUST finish with structural guards, runtime cold loads, and a fresh-agent proof.** A readable source file
  that a target runtime cannot load or a fresh agent cannot follow is unfinished.

### Must-Not-Follow

- **NEVER classify from a topic label such as language, domain, workflow, or reference.** Fix: ask whether the
  skill owns an outcome SOP, a named-tool manual, or non-procedural judgment.
- **NEVER add `Procedure` to a preference skill or `Manual` as a peer of `Procedure` in an operation skill.**
  Fix: reclassify an ordered preference as operation; keep only step-local tool facts in an operation and route
  larger tool material to a child reference or tool skill.
- **NEVER force every preference entry into a rigid mini-schema.** Fix: write enough rationale, force, scope,
  and exceptions for the judgment at hand, using the lightest clear structure.
- **NEVER let a tool skill own a broader normative workflow.** Fix: keep short setup and capability-local
  sequences in Manual; move end-to-end outcome coordination into an operation skill.
- **NEVER add policy only to an operation companion.** Fix: put the rule or step in `SKILL.md`, then make its
  scenarios, checks, and evaluation routes trace back to that parent clause.
- **NEVER hand-create or hand-edit a runtime mirror or register a conventional skill through a plugin
  manifest.** Fix: run the project-owned sync mechanism and follow the owning index convention.
- **NEVER split by length alone or nest a child below another child.** Fix: split only for an independently
  consumed procedure, owned artifact set, or lookup reference; keep every child one hop from `SKILL.md`.

---

## Procedure

Run seven steps in order: **FRAME (P1–P4) → WRITE (P5) → PROVE (P6–P7)**. Do not draft the target skill
before P1–P4 lock its capability, type, evidence, ownership, and file set.

### P1 — Frame one capability

State:

- the narrowest actor that always needs the skill;
- its deterministic or on-demand load trigger;
- the observable outcome or judgment it enables;
- its non-goals;
- the first intended consumer when the capability is new.

Draft the frontmatter description from the frame. Use `MUST load …` for deterministic loading and `Use
when …` or `Load when …` for on-demand loading. The description says what the skill does and when to load it.

### P2 — Classify and stamp the type

Apply the first matching branch:

1. **Operation:** Does the skill own ordered actions that produce one observable work outcome? If yes, choose
   `operation` even when the procedure uses a named tool or carries preferences.
2. **Tool:** Otherwise, is its dominant job helping an agent understand and use one named tool or platform?
   If yes, choose `tool`. Short setup and one-capability sequences do not turn it into an operation.
3. **Preference:** Otherwise, choose `preference` for judgment, behavior, conventions, constraints, and
   defaults that do not require ordered execution.

Record the decision and the rejected alternatives. Stamp four required frontmatter keys in this exact order:

```yaml
---
name: {skill-directory-name}
description: {one line from P1}
allowed-tools: {smallest surface the skill's own work needs}
skill-type: preference|tool|operation
---
```

`name` equals the directory. `allowed-tools` describes the target skill's work, not the tools used to research
it. The named optional allowlist is:

- `user-invocable: false` when the skill must be hidden from user invocation;
- `disable-model-invocation: true` when the model must not auto-load the skill; and
- the rare official `license`, `compatibility`, or `metadata` keys only with a stated, verified need.

User-visible and model-loadable are the invocation defaults, so omit both invocation keys when those defaults
are intended. Plain `type`, memory fields, and workflow provenance such as `session`, `stage`, `status`, or
`iteration` are not skill frontmatter.

### P3 — Study evidence and pass the user design gate

Before locking the shape:

1. Read two or three same-type skills when they exist; use them for structure, never verbatim policy.
2. Read the consumers that will load the skill.
3. Study established external practice that improves the capability.
4. Load `mistakes.md` and applicable project or domain mistakes.
5. Read every mechanism that owns a behavior, command, path, schema, permission, or wiring claim.
6. Present reference-backed direction at the user design gate. An explicit user or task decision already
   satisfies the gate; record it and do not ask again.

### P4 — Map ownership, blast radius, and document altitude

Build four planning artifacts before writing:

- **Claim-owner ledger:** every borrowed fact and its one owner, which becomes References.
- **Affected-file map:** every authored, generated, conditionally updated, read-only, moved, or deleted
  surface. Discover it with exhaustive and synonymous searches, not a named-file guess.
- **CRUD and 5W1H pass:** what is created, read, updated, deleted, who consumes it, when it applies, where it
  propagates, why it exists, and how it is verified.
- **Altitude decision:** default to one `SKILL.md`; add direct children only for an owned artifact set, a long
  lookup reference, per-unit orchestration, or a self-contained sub-procedure another consumer loads.

When revising or splitting, preserve the semantic union of the old content. A structural section map alone
does not prove that no subject, exception, hazard, or recovery condition was lost.

### P5 — Run exactly one type-writing procedure

Load the child selected at P2 and follow it completely:

| `skill-type` | Required child | Target shape |
|---|---|---|
| `preference` | [`preference-skill.md`](preference-skill.md) | Frontmatter → Intro → Principles → Rules → References |
| `tool` | [`tool-skill.md`](tool-skill.md) | Frontmatter → Intro → Principles → Rules → Manual → References |
| `operation` | [`operation-skill.md`](operation-skill.md) | Frontmatter → Intro → Principles → Rules → Procedure → References, plus the plural verification bundle |

Before loading, record the one selected child path from the P2 classification. Load that child and no other
type child. Loading two or all three type children invalidates the P5 run even when the resulting headings look
compliant: discard the P5 draft and restart P5 in a clean agent context with only the selected child. If the
selected child's boundary test fails while writing, return to P2 and reclassify explicitly.

### P6 — Run the skill-writing verification bundle

Use [`scenarios.md`](scenarios.md) to activate the cases that match the target. Work a fresh filled copy of
[`checklists.md`](checklists.md), inspect the named evidence for every applicable item, and compute coverage
closure separately from acceptance. A failed gate returns to its owning P-step.

For independent review, the evaluator enters through [`evaluation.md`](evaluation.md), which loads the
scenario and checklist sources and extends the productive step's EVALUATION without changing its report
schema.

### P7 — Wire and prove cold use

1. Run the project-owned sync mechanism; never build mirrors by hand.
2. Run mirror, link, reference, compatibility, and retired-vocabulary guards.
3. Verify a runtime mirror still resolves to the canonical directory and retains its expected symlink or
   generated topology.
4. Update a skill index only by that index's placement convention. Semantic `skill-type` does not replace a
   workflow-placement category.
5. Add a tool-permission entry only when zero-prompt preapproval is deliberately required.
6. Cold-load the skill through its normal entrypoint in every target runtime.
7. Give a fresh agent only the normal load context and verify it can perform the capability and complete the
   applicable checklist evidence.

The fresh agent writes one `cold-load-result` record for each target runtime. P7 is the sole owner of this
record and its field contract. The record contains exactly these fields and no others:

```yaml
runtime: claude-code | codex
canonical_path: .gobbi/projects/<project>/skills/<skill>/SKILL.md
selected_skill_type: preference | tool | operation
selected_type_child: preference-skill.md | tool-skill.md | operation-skill.md
loaded_type_children:
  - <the selected_type_child value>
fixture: <bounded cold-use input>
output: <produced result or artifact pointer>
checks:
  - id: <stable check ID>
    status: PASS | FAIL
    evidence: <inspected evidence>
no_extra_type_child_proof:
  loaded_child_count: 1
  unexpected_children: []
  evidence: <proof of the loaded child set>
```

`runtime` names the target runtime. `canonical_path` names the skill source. `selected_skill_type` and
`selected_type_child` record the classification and its matching child. `loaded_type_children` contains
exactly that selected child. `fixture` is the bounded cold-use input. `output` is the produced result or its
artifact pointer. `checks` records each stable check, its `PASS` or `FAIL` status, and inspected evidence.
`no_extra_type_child_proof` proves the exact-one-child boundary with `loaded_child_count: 1`, an empty
`unexpected_children` list, and direct evidence.

P7 passes only when structural checks, runtime loading, and fresh-agent use all pass. Reject the run when a
required record or field is missing, an unknown field is present, `loaded_type_children` omits the selected
child or contains another type child, `no_extra_type_child_proof` does not prove exactly one loaded child, or
any applicable check is `FAIL`.

---

## References

- [`../scenario/SKILL.md`](../scenario/SKILL.md) validates the scenario-set procedure used to author an
  operation skill's `scenarios.md` and this skill's own scenario source.
- [`../checklist/SKILL.md`](../checklist/SKILL.md) validates the operational checklist, evidence, coverage
  closure, and acceptance mechanics used by `checklists.md`.
- [`../evaluation/SKILL.md`](../evaluation/SKILL.md) validates the evaluator lenses, finding schema, scoring,
  and productive-step extension used by `evaluation.md`.
