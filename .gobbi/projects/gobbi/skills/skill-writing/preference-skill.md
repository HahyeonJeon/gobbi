# Writing a Preference Skill

Type-owned procedure for a skill that improves judgment, behavior, conventions, constraints, or defaults
without owning ordered execution or a named-tool manual. Load only after the parent skill-writing procedure
classifies the target as `skill-type: preference`.

## Boundary

A preference skill answers questions such as:

- What should an agent value or optimize for?
- Which choice is the default, and what evidence earns an exception?
- What behavior is mandatory or forbidden?
- How should competing concerns be judged?

It may use binding `MUST` and `NEVER` rules. Binding force does not make it an operation; ordered actions that
produce a work outcome do. If the draft needs an execution sequence, return to the parent classifier and make
it an operation. If it primarily explains one named tool, make it a tool skill.

## Required shape

```text
Frontmatter
Intro
Principles
Rules
References
```

There is no Procedure or Manual. Principles and Rules are the dominant content.

## Procedure

### S1 — Frame the judgment surface

List the decisions the skill must improve, the actors making them, the contexts in which the guidance applies,
and the consequences of a wrong choice. Name the non-goals and any judgment the skill deliberately leaves to a
different owner.

### S2 — Build the evidence map

Gather the governing requirements, accepted decisions, recurring failures, user preferences, and established
practice. Separate:

- facts borrowed from an owner;
- local preferences this skill owns;
- binding constraints imposed by an owner;
- contextual defaults that admit exceptions.

### S3 — Write Frontmatter and Intro

Use the four-key frontmatter contract from the parent and stamp `skill-type: preference`. The Intro states what
judgment the skill improves and when to load it. It does not instruct, cite sources, or defend individual rules.

### S4 — Write Principles

Write self-standing mental models that explain why the preferences exist and how to reason when obvious rules
pull in different directions. Keep each principle universal enough to survive a tool or implementation change.

Do not force a fixed count or per-principle field schema. Use the amount and structure the judgment needs.
Move a statement to Rules when it is directly gradable on a finished artifact or behavior.

### S5 — Write Rules with truthful force

Use force that matches the claim:

- `MUST`, `ALWAYS`, or `NEVER` for binding requirements and prohibitions;
- `SHOULD`, `PREFER`, or `AVOID` for defaults that valid evidence may override.

Make binding rules self-contained and checkable. For contextual guidance, state enough applicability, rationale,
and exception evidence for a cold reader to make the choice. Examples, counterexamples, and tensions are
optional structures, not required fields on every entry.

### S6 — Write References

Map every borrowed fact to exactly one owner and state which claim that owner validates. If the skill owns all
its preferences, say so explicitly. Do not turn References into a related-reading list.

### S7 — Stress the preferences

Test at least:

1. an ordinary case where the default should win;
2. an exception where evidence should override a contextual preference;
3. a conflict between two principles or rules;
4. a cosmetically compliant artifact that violates the underlying intent.

Revise until a cold reader reaches the intended judgment from the skill alone. Return to the parent classifier
if the repair introduces ordered execution or a named-tool manual.

## Completion checks

- `skill-type` is `preference` and appears after `allowed-tools`.
- Principles and Rules are the dominant content.
- The document contains neither Procedure nor Manual.
- Every hard statement is genuinely binding; every contextual statement communicates how exceptions are earned.
- No preference entry is padded to satisfy a rigid template.
- Borrowed facts have one owner each.
- Ordinary, exception, conflict, and cosmetic-compliance cases are decidable from the document.
