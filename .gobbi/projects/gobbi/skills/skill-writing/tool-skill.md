# Writing a Tool Skill

Operation-shaped child procedure for producing one tool skill. Load it only at P5 after the parent Skill
Writing operation classifies the target as `skill-type: tool`. Its observable outcome is a self-contained,
authoritative manual that helps agents understand and use one named tool or platform correctly.

The Procedure in this document belongs to the authoring operation; the target tool skill uses Manual rather
than Procedure as its dominant section. This file remains a direct child document rather than an independently
loadable skill, so the parent owns its loading, verification bundle, and frontmatter.

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

### Must-Follow

- **MUST run this procedure only after P2 classifies the target as `tool`.** Return to P2 when the target owns a
  broader ordered work outcome or mainly states tool-independent judgment and defaults.
- **MUST produce the exact tool target shape.** Use Frontmatter → Intro → Principles → Rules → Manual →
  References; keep Manual dominant; and add no Procedure.
- **MUST keep one named tool or platform inside an explicit compatibility boundary.** Fence adjacent tools and
  broader workflows as non-goals, and keep setup or local sequences scoped to one tool capability.
- **MUST keep every target Rule within the parent Rules contract.** Begin it with a bold normative lead, make
  it binding, self-contained, testable, and distinct from every Principle, and keep the complete Rules section
  to at most nine semantic items.
- **MUST include only applicable Manual material.** Omit empty template headings and organize every retained
  capability, setup, syntax, input, output, side effect, default, limit, example, error, diagnosis, or recovery
  item for direct lookup.
- **MUST verify every taught command, snippet, application programming interface example, output, side effect,
  expected failure, and version-sensitive fact.** Use its authoritative owner or the live supported surface
  and state every prerequisite, permission, cost, or compatibility condition needed to interpret the result.

## Procedure

### S1 — Lock the named tool and consumer tasks

Name the exact tool or platform, supported versions or compatibility range, intended consumers, and the lookup
tasks the skill must answer. Fence adjacent tools and broader workflows as non-goals.

### S2 — Read authoritative and live surfaces

Prefer official documentation, built-in help, schemas, source, and the installed version over recollection or
third-party summaries. Record version-sensitive facts and any difference between documented and observed
behavior. Inspect permission, cost, network, and mutation boundaries before running examples.

### S3 — Inventory the Manual

Select only applicable material:

- prerequisites and setup;
- capabilities and when each applies;
- commands, syntax, options, or application programming interfaces;
- inputs, outputs, state, and side effects;
- defaults and precedence;
- limits, compatibility, and unsupported cases;
- examples; and
- errors, diagnosis, and recovery.

The list is a menu, not mandatory boilerplate. Omit a subsection the tool does not need.

### S4 — Create the complete skeleton

Render the four frontmatter slots and the required headings in their exact order. Stamp `skill-type: tool`,
name every planned direct child, and use placeholders only to expose the intended structure. Do not write
substantive prose until the skeleton is complete.

### S5 — Write Principles and Rules

Principles explain durable usage judgment. Rules hold safety, correctness, permission, or compatibility
invariants.

Apply the parent rule-count and non-duplication contract. Inventory semantic rule items rather than bullets.
Keep only binding, self-contained, testable constraints in Rules. A Rule may enforce a boundary motivated by
a Principle, but it must not repeat the Principle's claim. Begin every item with a bold `MUST`, `MUST NOT`,
`ALWAYS`, or `NEVER` lead.

### S6 — Write Manual

Organize Manual for lookup. Use stable capability names and the tool's own vocabulary. Put syntax beside its
semantics, name required inputs and observable outputs, and distinguish defaults from configured behavior.

Short setup instructions and capability-local sequences are allowed. Stop before prescribing a broader work
outcome. Point to an operation skill when the consumer needs an end-to-end workflow.

### S7 — Verify examples and failure guidance

For every command, snippet, or application programming interface example:

1. run or trace it safely against the supported version;
2. confirm its output and side effects;
3. exercise at least one expected failure; and
4. state any prerequisite, permission, cost, or compatibility condition needed to interpret the result.

Do not present an unverified illustrative example as a tested fact.

### S8 — Finish Frontmatter and Intro

Complete the four-key frontmatter contract from the parent. Begin the description with `MUST load`, state the
exact load condition, and identify the skill as a tool skill for the named surface and consumer tasks.

Write the Intro from the completed body. In a little more detail than the description, explain the named
tool, consumers, load condition, supported task boundary, and kind of lookup material the reader will find.
It may summarize the body but may not introduce instructions, compatibility claims, or owner facts absent
from their owning sections.

### S9 — Write References, test lookup, and accept the tool skill

Keep the required References heading. Link only to Markdown child documents and child-skill entrypoints whose
resolved paths stay beneath the directory containing the target `SKILL.md`. Cite an outside owner beside the
claim it validates, never in References. Leave the heading empty when the skill has no allowed child material.

Read the whole skill as a cold reader. Use one stable term for each concept, expand unfamiliar abbreviations
at first use, keep one main claim per sentence, and replace vague, ornamental, or implied expressions with
literal actors, conditions, tool vocabulary, and evidence.

Give the reader lookup tasks for capability discovery, setup, syntax, input/output interpretation, expected
failure, and diagnosis. Revise any answer that requires unstated session context.

Then inspect the complete artifact. Confirm the frontmatter and description, skeleton-first record, aligned
Intro, exact section shape, named-tool boundary, semantic Rule inventory, Principle-to-Rule separation,
applicable Manual structure, example-verification evidence, claim-owner citations, local References, and
cold-reader language all satisfy the parent and child contracts. Return to the owning step on any failure.

Return to the parent classifier if the repair grows into a normative end-to-end workflow or tool-independent
preference guidance.

## References
