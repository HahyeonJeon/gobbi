# Writing a Preference Skill

Use this child document at Step 2.1 after the parent Skill Writing operation classifies the target as
`skill-type: preference`. It produces a self-contained skill that improves judgment through Principles,
binding Rules, and overridable Preferences without inventing ordered execution or a named-tool manual.

This document owns the authoring Procedure, while the target preference skill has no Procedure. The parent
owns this direct child's loading, type selection, and frontmatter contract.

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

- **MUST run this procedure only after Step 1.3 classifies the target as `preference`.** Return to Step 1.3
  when the target owns ordered actions for a work outcome, primarily explains one named tool or platform, or
  only navigates a mixed domain child-skill family.
- **MUST produce the exact preference target shape.** Use Frontmatter → Intro → Principles → Rules →
  Preferences → References; keep Principles, Rules, and Preferences dominant; and add neither Procedure nor
  Manual.
- **MUST let every target Rule override every conflicting Preference.** A Preference cannot weaken or create
  an exception to a Rule.
- **MUST include at least one real Preference.** Each Preference states a recommended default, when it applies,
  and the evidence or condition that permits departure; it neither duplicates a Rule, hides a binding
  requirement, nor uses padding to satisfy a rigid entry schema.

## Procedure

### Phase 1 — Model the Judgment

#### 1.1 Define the choice space

- Use the approved design to name the decisions the skill must improve, the actors making them, the contexts
  in which they arise, and the consequences of a poor choice.
- Define the valid-choice boundary, non-goals, and judgments owned by another skill.
- Return to parent Phase 1 when the capability instead requires ordered execution, a named-tool manual, or a
  domain navigation family.

#### 1.2 Separate constraints, defaults, exceptions, and evidence

- Classify the evidence as borrowed facts, binding constraints, durable mental models, overridable defaults,
  justified exceptions, or unresolved tensions.
- Assign every borrowed fact and binding constraint to its owner, and keep local Preferences inside the valid
  choice space established by Rules.
- Confirm that the capability contains at least one genuine default with a meaningful exception; otherwise
  return to the parent classifier.

### Phase 2 — Write the Preference Skill

#### 2.1 Create the complete skeleton

- Render the approved frontmatter, Intro, Principles, Rules, Preferences, References, and planned direct
  children in their exact order.
- Stamp `skill-type: preference`, use placeholders only to expose the approved structure, and write no
  substantive prose until the skeleton is complete.

#### 2.2 Write Preferences as the core

- Write each Preference as an overridable default with its applicability condition, departure evidence or
  condition, and enough rationale to weigh the exception.
- Use `SHOULD`, `PREFER`, `AVOID`, or equally explicit default language and keep binding requirements in Rules.
- Include at least one real Preference; do not duplicate a Rule, hide a prohibition, or pad the section with
  artificial defaults or a rigid entry schema.

#### 2.3 Complete Principles, Rules, Intro, and References

- Write Principles that explain the durable judgment model and resolve legitimate tension between valid
  Preferences.
- Write Rules as self-contained constraints that establish the valid choice space and override every
  conflicting Preference; apply the parent limits and normative expressions.
- Write the Intro from the completed body without adding new policy, and keep References limited to owned
  Markdown children while citing outside owners beside their claims.
- Re-read the target as a cold decision-maker and confirm that it supports sound judgment without private
  author context.

### Phase 3 — Review and Improve the Preference Skill

#### 3.1 Review the judgment behavior

- Confirm the exact preference shape, a real Preferences section, clear separation between Principles, Rules,
  and Preferences, and the target's compliance with parent Phase 3.
- Test an ordinary default, a justified exception, a Rule-and-Preference conflict, tension between two
  Preferences, and a cosmetically compliant choice that violates the intended judgment.
- Require Rules to win binding conflicts and Principles to resolve legitimate tension without turning the
  skill into ordered execution.
- Confirm that borrowed claims resolve to their owners and that internal References remain local.

#### 3.2 Correct and re-review the preference skill

- Trace each finding to the earliest incorrect choice boundary, evidence class, skeleton section, Principle,
  Rule, or Preference and propagate the correction through the complete target.
- Repeat the affected judgment cases and the complete preference review; return to parent Phase 1 if the
  correction changes the skill type.

## References
