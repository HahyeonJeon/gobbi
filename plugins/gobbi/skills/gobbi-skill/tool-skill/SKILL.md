---
name: tool-skill
description: "Tool Skill guides writing the interface facts of a named tool, platform, or tool collection. Use it after Gobbi Skill classifies a target as `tool`."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Tool Skill

Tool Skill defines how to author or substantively revise an authoritative manual for a named tool, platform,
or cohesive tool collection. Use it after Gobbi Skill classifies the target as `tool` and readers need direct
answers about that surface rather than an end-to-end SOP.

## Principles

### Keep one cohesive surface as the subject

A tool skill covers one named tool, platform, or cohesive collection within an explicit compatibility
boundary. For a collection, give each independently loadable tool one direct Tool Skill child and keep shared
guidance in the collection parent.

### Organize the Manual for direct lookup

Readers arrive with specific questions about capabilities, setup, syntax, inputs, outputs, limits, or
failures. Arrange the Manual so they can reach an answer without following an unrelated workflow.

### Use authoritative and live evidence

Prefer official docs, built-in help, schemas, source, and observed supported behavior over recollection or
summaries. Recheck behavior that can change with versions, configuration, permissions, or environment.

### Write only what the agent cannot get elsewhere

A capable agent already knows common tools and can read built-in help and error messages. Write the interface
facts it would otherwise get wrong: version-specific behavior, limits, side effects, permissions, and failures
whose cause is not obvious.

## Rules

- **Use the tool shape.** Frontmatter → Intro → Principles → Rules → Manual → References, with no Procedure,
  so readers find answers by lookup rather than by following a workflow.
- **Keep one named tool, platform, or cohesive collection inside a stated compatibility boundary.** For a
  collection, use `{collection}/{collection}-{tool}/SKILL.md` routed from the parent Manual, with no deeper level.
- **Include only facts an agent would otherwise get wrong.** Leave out usage the tool's help, its errors, or
  general knowledge already supply, and leave workflows to the operations that use the tool.
- **Use the Manual hierarchy.** A `###` capability title, a `####` lookup subtitle, and at most three
  one-or-two-sentence detail bullets under each subtitle, with the answer first.
- **Verify every taught behavior against its owner or the live tool.** State the limitation when evidence
  conflicts, because a wrong tool fact fails silently in every task that uses it.

## Procedure

### Phase 1 — Design the Manual

Know the named surface and what readers look up. Done when the surface and its boundaries are stated and the
inventory is grouped by lookup question, with conflicting evidence resolved or recorded.

#### 1.1 Define the named surface

- Name the exact tool, platform, or cohesive collection, supported versions or compatibility range, intended
  readers, and lookup tasks.
- For a collection, identify shared lookup guidance and each tool that needs a direct Tool Skill child. Make
  the collection Intro applicable to its shared guidance and every child, and make each child's applicability
  sentence tell readers to load the parent first.
- State adjacent tools, broader workflows, and unsupported versions as boundaries or non-goals.

#### 1.2 Select evidence and coverage

- Gather official docs, built-in help, schemas, source, and observed supported behavior for the approved tasks.
- Inventory only the capabilities, setup, syntax, inputs, outputs, side effects, defaults, limits, examples,
  errors, diagnosis, and recovery readers need.
- Resolve conflicting evidence or record the limitation, then group the inventory by stable question or
  capability and remove topics that do not apply.

### Phase 2 — Write the Tool Skill

Write direct answers to the approved lookup tasks. Done when every approved lookup task has an entry, every
example is run or traced, and the remaining sections are complete.

#### 2.1 Start with the Manual structure

- Use the parent skill to write the top-level sections, then write Manual first. Use this minimal pattern:

```markdown
## Manual

### {Capability category title}

#### {Lookup subcategory subtitle}

- {State the direct answer or instruction.}
- {State necessary syntax, inputs, outputs, defaults, or limits.}
- {State a relevant failure, diagnosis, or recovery detail.}
```

- Repeat category titles and subcategory subtitles only as the approved lookup tasks require, with no more
  than three details per subtitle. Keep a needed code block, table, or link with its owning detail; it does not
  create another semantic detail.
- For a collection, place `### Child Tools` first, give each direct child one `####` subtitle, and add one
  detail linking the child with its exact Intro applicability sentence. Author each through a fresh Gobbi Skill
  pass with Tool Skill; match its `name` to its directory, link the collection parent in its References, and do
  not copy shared guidance into the child.

#### 2.2 Write direct lookup details

- Arrange category titles in lookup order and use stable capability names. Arrange each subtitle under its
  owning category.
- Put each answer before its explanation, syntax beside its meaning, and inputs, outputs, side effects,
  defaults, and limits beside the capability they qualify.
- Keep setup local to the named surface and refer end-to-end work to an operation skill.

#### 2.3 Add examples and failure guidance

- Run or trace each command, snippet, and API example against the supported surface.
- State the expected output, side effects, prerequisites, permissions, cost, and compatibility conditions needed
  to interpret the example.
- Safely reproduce or trace an expected failure and give direct diagnosis or recovery. Otherwise, verify it
  against authoritative evidence and label it source-verified but not live-reproduced; use `illustrative` only
  when exact behavior lacks authoritative support.

#### 2.4 Complete the remaining sections

- Write Principles for durable usage judgment and Rules for binding safety, correctness, permission, or
  compatibility constraints.
- Write the Intro from the completed Manual without adding unsupported instructions or compatibility claims.
- Use the parent's fixed `Name | Description` table in References for relevant internal parent, type, child,
  or supporting documents. Cite external owners beside their claims.

### Phase 3 — Review and Improve the Tool Skill

Give each question one direct answer. Done when each approved question has one direct answer in a predictable
place, retained claims match their evidence, and the parent stopping condition holds.

#### 3.1 Improve structure, sentences, and vocabulary

- Apply parent Phase 3, then reshape Manual headings and entries instead of only marking lookup problems.
  Remove, merge, split, or reorder category titles, subcategory subtitles, and details until each approved
  question has one direct answer in a predictable place.
- Limit each subtitle to three details and each detail to one or two sentences. Split a subtitle or rewrite its
  details whenever either limit is exceeded, then put each answer first and replace vague or inconsistent
  words with the tool's precise vocabulary.
- Reconcile retained claims with controlling evidence, and reach one complete answer for each approved lookup
  question without following unrelated sections. For a collection, match every direct child to one `Child
  Tools` entry, reject missing, stale, duplicate, orphan, or deeper children, and check shared-parent-only,
  single-child, multi-child, and outside-collection cases before applying the parent stopping condition.

## References

| Name | Description |
|---|---|
| [`Gobbi Skill`](../SKILL.md) | Parent guidance for type classification and shared skill-writing rules. |
