---
name: preference-skill
description: "Preference Skill is guidance for writing rules, conventions, preferred styles, and defaults that keep agent results consistent."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Preference Skill

Preference Skill defines how to author or substantively revise guidance that standardizes recurring agent
choices and results through binding rules, conventions, preferred styles, and defaults. Use it after Gobbi
Skill classifies the target as `preference` and consistent results matter without an end-to-end SOP.

## Principles

### Make equivalent cases converge

Equivalent choices under the same authority and context should lead agents to the same result. Differences
should follow a named condition instead of taste, habit, or chance.

### Let project authority lead

Use configured tools, accepted decisions, and established project conventions before a generic default. Add
skill guidance only for recurring choices those owners leave open.

### Separate required boundaries from preferred forms

Rules define non-negotiable requirements and required conventions. Preferences define preferred conventions,
styles, and defaults; an exception may change a Preference but never a Rule.

### Standardize only useful consistency

Standardize a result when arbitrary variation makes work harder to read, compare, combine, review, or maintain.
Preserve meaningful variation when context, evidence, accessibility, safety, or user need changes the result.

## Rules

- **MUST produce the exact preference target shape.** Use Frontmatter → Title → Intro → Principles → Rules →
  Preferences → References, keep consistency guidance dominant, and add no Procedure or Manual.
- **MUST make Preferences own at least one recurring consistency choice.** State a concrete convention,
  preferred style, or default for an agent result instead of generic advice or an ordered task.
- **MUST keep non-negotiable requirements and required conventions in Rules, and guidance that admits valid
  variation in Preferences.** Every Rule overrides every conflicting preferred convention, style, or default.
- **MUST make each Preference concrete and applicable.** State the expected or recommended result first, name
  its context, and add an exception or decision criterion only when valid variation exists.
- **MUST use the Preference hierarchy.** Use a `###` category title for one consistency area, a `####`
  consistency-choice subtitle for one recurring choice, and at most three one-or-two-sentence detail bullets
  under each subtitle.

## Procedure

### Phase 1 — Design the Consistency Guidance

#### 1.1 Identify the consistency need

- Name the agents or other consumers, the recurring decision or artifact, and the context in which results
  should be consistent. Use this non-exhaustive list as prompts, and include only subjects that recur:
  - **Rules and constraints:** Define required boundaries, prohibited results, authority, and precedence.
  - **Naming and terminology conventions:** Standardize identifiers, filenames, headings, fields, and shared
    vocabulary.
  - **Preferred code style:** Guide code form, organization, APIs, comments, errors, and patterns not owned by
    configured tools.
  - **Preferred documentation and communication style:** Guide tone, structure, templates, examples, reports,
    and messages.
  - **Structure and placement:** Standardize grouping, ordering, colocation, directories, and document homes.
  - **Design and output style:** Guide presentation, interaction, accessibility, formatting, and result shape.
  - **Defaults and exceptions:** Select among valid approaches and name when another result is appropriate.
- Inspect current examples, configured behavior, prior decisions, and failures. Separate harmful arbitrary
  variation from differences required by context, evidence, accessibility, safety, or user need.
- Return to parent Phase 1 when the target is primarily ordered work, named-tool lookup, domain navigation, or
  a one-time decision with no reusable consistency value.

#### 1.2 Establish authority and guidance classes

- Gather governing project rules, configured tools, accepted decisions, owned facts, and established examples.
  Record which source controls when they disagree.
- Classify each retained claim as a borrowed fact, binding Rule, durable Principle, required or preferred
  convention, preferred style, default, or valid exception; keep each fact and policy with one owner.
- Define representative ordinary, permitted-variation, authority-conflict, and outside-scope cases before
  writing the guidance.

### Phase 2 — Write the Preference Skill

#### 2.1 Start with the Preferences structure

- Use the parent skill to write the top-level sections, then write Preferences first. Use this minimal pattern:

```markdown
## Preferences

### {Consistency category title}

#### {Consistency choice subtitle}

- {State the expected or recommended result and its context.}
- {State a real exception or decision criterion when needed.}
- {Add only the rationale, example, or owner needed for consistent use.}
```

- Repeat categories only for distinct consistency areas and subtitles only for distinct choices. Treat each
  subtitle block and its details as one Preference, with no more than three details.
- Use prose, bullets, tables, examples, or code only inside the detail they support. Omit unused placeholders
  and do not force unlike preferences into one rigid entry form.

#### 2.2 Write each consistency choice

- Put the expected or recommended result first. Use observable terms such as exact names, forms, locations,
  order, templates, or output properties when they improve repeatability.
- State where the guidance applies and which authority controls it. Add a departure condition only when a
  different result can be valid, and name the evidence or context that permits it.
- Add only rationale, contrast, or an example that helps agents reproduce the choice. Replace subjective words
  such as `clean`, `simple`, or `best` with concrete criteria.

#### 2.3 Write Principles and Rules

- Write Principles that explain why consistency matters, identify meaningful variation, and resolve tension
  between valid Preferences.
- Write Rules as self-contained constraints for validity, authority, precedence, ownership, or non-negotiable
  consistency. Put required conventions in Rules and preferred conventions, styles, and defaults in Preferences.
- Remove copied owner policy, duplicated automation, and any Principle or Rule that adds no mental model or
  binding boundary.

#### 2.4 Complete the remaining sections

- Write the Intro from the completed consistency guidance without adding new policy.
- Use the parent's fixed `Name | Description` table in References for relevant internal parent, type, or
  supporting documents. Cite external owners beside their claims.
- Read the target as a cold agent and confirm that each recurring choice can produce a consistent result
  without private author context.

### Phase 3 — Review and Improve the Preference Skill

#### 3.1 Improve structure, sentences, and vocabulary

- Apply parent Phase 3, then reshape Principles, Rules, and Preferences instead of only marking judgment
  problems. Make each category a coherent consistency area, each subtitle one recurring choice, and each
  detail necessary support for that choice; then remove, merge, split, or reorder them as needed.
- Limit each subtitle to three details and each detail to one or two sentences. Split a subtitle or rewrite its
  details whenever either limit is exceeded, then put the expected result first and replace vague or
  inconsistent words with plain, precise, stable terms.
- Exercise equivalent ordinary cases, permitted variation, authority conflicts, and outside-scope cases. If
  equivalent cases can produce different results, improve the expected form, context, authority, or example;
  if valid differences are suppressed, narrow the guidance before applying the parent stopping condition.

## References

| Name | Description |
|---|---|
| [`Gobbi Skill`](../SKILL.md) | Parent guidance for type classification and shared skill-writing rules. |
