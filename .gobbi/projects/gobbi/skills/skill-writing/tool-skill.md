# Writing a Tool Skill

Use this child document at Step 2.1 after the parent Skill Writing operation classifies the target as
`skill-type: tool`. It produces a self-contained, authoritative manual for understanding and using one named
tool or platform correctly.

This document owns the authoring Procedure, while the target tool skill uses Manual as its dominant section.
The parent owns this direct child's loading, type selection, and frontmatter contract.

## Principles

### Keep one named surface as the subject

A tool skill is useful when its boundaries match a concrete tool or platform. Mixing adjacent tools or a
broader delivery outcome makes lookup unreliable and obscures which behavior, version, and vocabulary the
manual actually owns.

### Organize the Manual for lookup

Readers enter a tool skill with specific questions about capability, configuration, syntax, inputs, outputs,
side effects, limits, or failures. A lookup-oriented Manual should let them answer those questions without
following an unrelated end-to-end workflow.

### Prefer authoritative and live evidence

Tool behavior changes with versions, configuration, permissions, and environment. Official documentation,
built-in help, schemas, source, and observed behavior provide stronger teaching evidence than recollection or
third-party summaries.

### Teach failure as part of correct use

A successful example alone does not explain prerequisites, diagnosis, or recovery. Expected failures reveal
the boundaries that let a reader interpret both working and non-working behavior correctly.

## Rules

- **MUST run this procedure only after Step 1.3 classifies the target as `tool`.** Return to Step 1.3 when the
  target owns a broader ordered work outcome, mainly states tool-independent judgment and defaults, or only
  navigates a mixed domain child-skill family.
- **MUST produce the exact tool target shape.** Use Frontmatter → Intro → Principles → Rules → Manual →
  References; keep Manual dominant; and add no Procedure.
- **MUST keep one named tool or platform inside an explicit compatibility boundary.** Fence adjacent tools and
  broader workflows as non-goals, and keep setup or local sequences scoped to one tool capability.
- **MUST include only applicable Manual material.** Omit empty template headings and organize every retained
  capability, setup, syntax, input, output, side effect, default, limit, example, error, diagnosis, or recovery
  item for direct lookup.
- **MUST verify every taught command, snippet, application programming interface example, output, side effect,
  expected failure, and version-sensitive fact.** Use its authoritative owner or the live supported surface
  and state every prerequisite, permission, cost, or compatibility condition needed to interpret the result.

## Procedure

### Phase 1 — Model the Manual

#### 1.1 Lock the named surface, consumers, and evidence

- Use the approved design to name the exact tool or platform, supported versions or compatibility range,
  intended consumers, lookup tasks, adjacent-tool boundary, and non-goals.
- Prefer official documentation, built-in help, schemas, source, and observed supported behavior; record any
  material difference between documented and live behavior.
- Inspect permission, cost, network, mutation, and compatibility boundaries before teaching or running an
  example.

#### 1.2 Select applicable Manual coverage

- Inventory only the prerequisites, capabilities, syntax, inputs, outputs, state, side effects, defaults,
  limits, examples, errors, diagnosis, and recovery needed for the approved lookup tasks.
- Group retained material by stable capability or question and omit empty headings or topics that do not
  apply.
- Return to parent Phase 1 when the target expands into a broader work outcome, tool-independent judgment, or
  a domain navigation family.

### Phase 2 — Write the Tool Skill

#### 2.1 Create the complete skeleton

- Render the approved frontmatter, Intro, Principles, Rules, Manual, References, and planned direct children
  in their exact order.
- Stamp `skill-type: tool`, use placeholders only to expose the approved structure, and write no substantive
  prose until the skeleton is complete.

#### 2.2 Write Manual as the core

- Organize Manual for direct lookup using stable capability names and the tool's own vocabulary; place syntax
  beside semantics and name required inputs, outputs, side effects, defaults, and limits.
- Keep setup and local sequences scoped to the named tool capability, and point to an operation skill when
  the consumer needs an end-to-end work outcome.
- Run or trace every command, snippet, and application programming interface example against the supported
  surface; confirm its output and side effects, exercise an expected failure, and state its prerequisites,
  permissions, cost, and compatibility conditions.
- Mark an example as illustrative when it cannot be executed, and never present it as verified behavior.

#### 2.3 Complete Principles, Rules, Intro, and References

- Write Principles for durable usage judgment and Rules for distinct safety, correctness, permission, or
  compatibility invariants; apply the parent limits and normative expressions.
- Write the Intro from the completed body without adding instructions or compatibility claims absent from
  their owners.
- Keep References limited to owned Markdown children, cite outside owners beside their claims, and leave the
  heading empty when no internal child applies.
- Re-read the target as a cold user and confirm that its vocabulary and lookup structure answer the approved
  tasks without unstated context.

### Phase 3 — Review and Improve the Tool Skill

#### 3.1 Review lookup behavior and evidence

- Test direct lookup for capability discovery, setup, syntax, input and output interpretation, expected
  failure, and diagnosis; revise any answer that requires an unrelated workflow or private context.
- Confirm the named-tool and compatibility boundaries, applicable Manual coverage, and separation between
  Principles, Rules, and lookup material.
- Verify every taught command, example, output, side effect, failure, and version-sensitive claim against its
  stated owner or supported surface.
- Confirm that internal References remain local and that the complete target also passes parent Phase 3.

#### 3.2 Correct and re-review the tool skill

- Trace each finding to the earliest incorrect boundary, evidence source, coverage choice, skeleton section,
  Manual entry, Principle, or Rule and propagate the correction through the complete target.
- Repeat the affected lookup tasks and evidence checks; return to parent Phase 1 if the correction changes
  the skill type.

## References
