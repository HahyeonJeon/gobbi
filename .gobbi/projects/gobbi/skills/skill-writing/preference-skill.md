# Writing a Preference Skill

Operation-shaped child procedure for producing one preference skill. Load it only at P5 after the parent
Skill Writing operation classifies the target as `skill-type: preference`. Its observable outcome is a
self-contained skill that improves judgment through Principles, binding Rules, and overridable Preferences
without inventing ordered execution or a named-tool manual.

The Procedure in this document belongs to the authoring operation; the target preference skill has no
Procedure. This file remains a direct child document rather than an independently loadable skill, so the
parent owns its loading, verification bundle, and frontmatter.

## Principles

### Keep judgment as the target

A preference skill helps an agent choose well when more than one valid path may exist. Its value comes from
making the decision surface, valid boundaries, defaults, and exceptions understandable without turning
judgment into a mechanical sequence.

### Define the valid choice space before recommending defaults

Binding constraints establish which choices are allowed. Contextual defaults operate only inside that valid
space, so Rules precede Preferences and always win when the two conflict.

### Let Principles resolve legitimate tension

Principles provide the durable mental model behind the guidance. When two Preferences favor different valid
choices, the Principles should help the reader reason through the tension without requiring private author
context.

## Rules

### Must-Follow

- **MUST run this procedure only after P2 classifies the target as `preference`.** Return to P2 when the target
  owns ordered actions for a work outcome or primarily explains one named tool or platform.
- **MUST produce the exact preference target shape.** Use Frontmatter → Intro → Principles → Rules →
  Preferences → References; keep Principles, Rules, and Preferences dominant; and add neither Procedure nor
  Manual.
- **MUST keep every target Rule within the parent Rules contract.** Begin it with a bold normative lead, make
  it binding, self-contained, testable, and distinct from every Principle, keep the complete Rules section to
  at most nine semantic items, and let every Rule override every conflicting Preference.
- **MUST include at least one real Preference.** Each Preference states a recommended default, when it applies,
  and the evidence or condition that permits departure; it neither duplicates a Rule, hides a binding
  requirement, nor uses padding to satisfy a rigid entry schema.

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
- binding constraints imposed by an owner; and
- contextual defaults that admit exceptions.

### S3 — Create the complete skeleton

Render the four frontmatter slots and the required headings in their exact order. Stamp
`skill-type: preference`, name every planned direct child, and use placeholders only to expose the intended
structure. Do not write substantive prose until the skeleton is complete.

### S4 — Write Principles

Write self-standing mental models that explain why the preferences exist and how to reason when legitimate
preferences pull in different directions. Keep each Principle universal enough to survive a tool or
implementation change.

Do not force a fixed count or per-Principle field schema. Use the amount and structure the judgment needs.
Move a binding statement to Rules when it is directly gradable on a finished artifact or behavior. Move an
overridable default to Preferences. Before S5, compare every candidate Rule with the Principles and separate
the general rationale from the distinct pass/fail boundary.

### S5 — Write Rules as binding constraints

Place only binding requirements and prohibitions in Rules. Use `MUST`, `MUST NOT`, `ALWAYS`, or `NEVER`, and
begin every item with that normative verb in a bold lead. Make each Rule self-contained and checkable. Do not
use `SHOULD`, `PREFER`, or `AVOID` for contextual defaults here. A Rule always takes precedence over a
conflicting Preference.

Apply the parent rule-count and non-duplication contract. Inventory semantic rule items rather than bullets.
If the inventory exceeds the limit, relocate rationale to Principles, defaults to Preferences, and ordered
work to an operation skill. Do not merge unrelated constraints or drop a condition merely to reduce the
count.

### S6 — Write Preferences as overridable defaults

Place recommended defaults in Preferences. Use `SHOULD`, `PREFER`, `AVOID`, or equally explicit default
language. Every entry states the preferred choice, when it applies, and the evidence or condition that permits
departure. Include enough rationale for a new reader to weigh the exception.

The section is required and contains at least one real default. Do not duplicate a Rule, hide a binding
requirement here, or pad entries to satisfy a rigid mini-schema. Examples, counterexamples, and tensions are
optional structures. If the capability has no genuine overridable default, return to P1 and P2 instead of
inventing preference content.

### S7 — Finish Frontmatter and Intro

Complete the four-key frontmatter contract from the parent. Begin the description with `MUST load`, state the
exact load condition, and identify the skill as a preference skill for the judgment it improves.

Write the Intro from the completed body. In a little more detail than the description, explain the judgment,
actor, load condition, boundary, and kind of guidance the reader will find. It may summarize the body but may
not introduce policy, instructions, owner citations, or rationale absent from the owning section.

### S8 — Write References and run the language pass

Keep the required References heading. Link only to Markdown child documents and child-skill entrypoints whose
resolved paths stay beneath the directory containing the target `SKILL.md`. Cite an outside owner beside the
claim it validates, never in References. Leave the heading empty when the skill has no allowed child material.

Read the whole skill as a cold reader. Use one stable term for each concept, expand unfamiliar abbreviations
at first use, keep one main claim per sentence, and replace vague, ornamental, or implied expressions with
literal actors, conditions, choices, and evidence.

### S9 — Stress and accept the preference skill

Test at least:

1. an ordinary case where the default should win;
2. an exception where evidence should override a contextual Preference;
3. a Rule and Preference conflict where the Rule must win;
4. a conflict between two Preferences that the Principles must resolve; and
5. a cosmetically compliant artifact that violates the underlying intent.

Then inspect the complete artifact. Confirm the frontmatter and description, skeleton-first record, aligned
Intro, exact section shape, semantic Rule inventory, Principle-to-Rule separation, real Preferences,
claim-owner citations, local References, and cold-reader language all satisfy the parent and child contracts.
Return to the owning step on any failure.

Revise until a new reader reaches the intended judgment from the skill alone. Return to the parent classifier
if the repair introduces ordered execution or a named-tool manual.

## References
