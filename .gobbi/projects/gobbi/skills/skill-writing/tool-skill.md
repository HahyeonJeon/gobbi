# Writing a Tool Skill

Type-owned procedure for a manual that helps agents understand and use one named tool or platform correctly.
Load only after the parent skill-writing procedure classifies the target as `skill-type: tool`.

## Boundary

A tool skill answers lookup questions about a named surface: what it can do, how it is configured or invoked,
what inputs and outputs mean, what side effects occur, and how failures are diagnosed. It may contain setup
steps and a short sequence demonstrating one capability.

It does not own a broader normative workflow. If the document coordinates capabilities toward an outcome such
as release, migration, incident response, or project delivery, return to the parent classifier and make it an
operation. If it mainly states tool-independent choices, make it a preference skill.

## Required shape

```text
Frontmatter
Intro
Principles
Rules
Manual
References
```

Manual replaces Procedure and is the dominant content.

## Procedure

### S1 — Lock the named tool and consumer tasks

Name the exact tool or platform, supported versions or compatibility range, intended consumers, and the lookup
tasks the skill must answer. Fence adjacent tools and broader workflows as non-goals.

### S2 — Read authoritative and live surfaces

Prefer official documentation, built-in help, schemas, source, and the installed version over recollection or
third-party summaries. Record version-sensitive facts and any difference between documented and observed
behavior. Inspect permission, cost, network, and mutation boundaries before running examples.

### S3 — Inventory the manual

Select only applicable material:

- prerequisites and setup;
- capabilities and when each applies;
- commands, syntax, options, or APIs;
- inputs, outputs, state, and side effects;
- defaults and precedence;
- limits, compatibility, and unsupported cases;
- examples;
- errors, diagnosis, and recovery.

The list is a menu, not mandatory boilerplate. Omit a subsection the tool does not need.

### S4 — Write Frontmatter, Intro, Principles, and Rules

Use the four-key frontmatter contract from the parent and stamp `skill-type: tool`. The Intro names the tool,
the consumer tasks, and the load trigger. Principles explain durable usage judgment. Rules hold safety,
correctness, permission, or compatibility invariants.

### S5 — Write Manual

Organize Manual for lookup. Use stable capability names and the tool's own vocabulary. Put syntax beside its
semantics, name required inputs and observable outputs, and distinguish defaults from configured behavior.

Short setup instructions and capability-local sequences are allowed. Stop before prescribing a broader work
outcome. Point to an operation skill when the consumer needs an end-to-end workflow.

### S6 — Verify examples and failure guidance

For every command, snippet, or API example:

1. run or trace it safely against the supported version;
2. confirm its output and side effects;
3. exercise at least one expected failure;
4. state any prerequisite, permission, cost, or compatibility condition needed to interpret the result.

Do not present an unverified illustrative example as a tested fact.

### S7 — Write References and test lookup

Map every borrowed claim to one authoritative owner. Then give a cold reader lookup tasks for capability
discovery, setup, syntax, input/output interpretation, expected failure, and diagnosis. Revise any answer that
requires unstated session context.

Return to the parent classifier if the repair grows into a normative end-to-end workflow.

## Completion checks

- `skill-type` is `tool` and appears after `allowed-tools`.
- One named tool or platform is the subject.
- Manual is present and dominant; Procedure is absent.
- Manual contains only applicable subsections and no empty template headings.
- Setup and local sequences remain capability-scoped.
- Commands, examples, outputs, failures, and version-sensitive facts were verified against owner or live evidence.
- Capability, syntax, setup, and diagnosis lookup tasks are answerable from a cold load.
