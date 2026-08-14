# Gobbi Skill Checklist

> **Document role:** Reusable unchecked evaluation source<br>
> **Subject:** Gobbi-compatible project skills and skill families created or substantively revised through Gobbi Skill<br>
> **Applicability:** One complete current skill target and its accepted design evidence; Evaluation binds the exact files, bytes, owners, and intended consumers under review<br>
> **Purpose:** Evaluate whether a skill is correctly classified, necessary, compact, readable, and coherent before type-specific checks are added<br>
> **Scope:** Design authority, evidence, classification, ownership, shared structure, minimality, language, references, source boundaries, and improvement work<br>
> **Exclusions:** Type-specific quality owned by the selected child checklist; execution of the authored skill; operating product behavior; correctness of external sources beyond their use as evidence<br>
> **Governing sources:** [Checklist](../checklist/SKILL.md), [Gobbi Skill](SKILL.md), the applicable type-writing skill, the accepted request and decisions, and the target's internal and external owners<br>
> **Context:** Evaluate the complete current target and its supporting documents as one subject. Apply the checklist for the selected skill type in parallel and add target-specific items after study.<br>
> **Checkbox meaning:** Check an item when evidence shows the problem is present.

## Project Lifecycle

### Design Authority

#### The skill design lacks accepted context or evidence

- [ ] The intended actor cannot be identified from the accepted design evidence.
- [ ] The intended consumer cannot be identified from the accepted design evidence.
- [ ] The skill's applicability is undefined.
- [ ] The event that should trigger the skill is undefined.
- [ ] The capability the skill provides is undefined.
- [ ] The expected result of applying the skill is undefined.
- [ ] The skill boundary is undefined.
- [ ] A material non-goal is undefined.
- [ ] No concrete use case identifies the first intended consumer.
- [ ] The supplied design evidence omits the current target it studied.
- [ ] The supplied design evidence omits the relevant internal skills it studied.
- [ ] A material governing owner is absent from the supplied design evidence.
- [ ] A material claim about an owned mechanism lacks evidence from its live owner.
- [ ] Meaningful alternatives existed without an accepted user choice.
- [ ] A material disagreement remains unresolved while the target presents it as settled.
- [ ] A material design choice remains open while the target presents it as settled.
- [ ] The accepted scope cannot be recovered.
- [ ] The affected-file boundary cannot be recovered.
- [ ] A required compatibility decision cannot be recovered.
- [ ] A required semantic-change decision cannot be recovered.

#### The target contains unsupported material or omits required material

- [ ] Guidance exists without a present requirement, observed failure, or evidence-backed material risk.
- [ ] A necessary in-scope capability is absent.
- [ ] A necessary in-scope boundary is absent.
- [ ] A supporting document exists without a separate maintenance need.
- [ ] A child exists without a separate loading need.
- [ ] A supporting element serves no distinct decision, action, or safety need.
- [ ] A speculative case adds complexity without changing correct present use.

## Design and Development Lifecycle

### Classification and Ownership

#### The selected type or policy owner does not match the target

- [ ] The target's first matching type differs from its `skill-type`.
- [ ] One skill mixes independently owned operation, tool, preference, or domain-routing roles.
- [ ] A binding constraint without an overridable default appears as a standalone constraint-only skill.
- [ ] A binding constraint belongs to a different governed operation, tool, or preference.
- [ ] The same material policy appears under more than one owner.

### Shared Structure

#### The target breaks the shared frontmatter, Intro, Principle, or Rule contract

- [ ] The frontmatter `name` differs from the skill directory name.
- [ ] A required frontmatter field is missing.
- [ ] `allowed-tools` includes a tool the skill's own work does not need.
- [ ] The description has fewer than one or more than two sentences.
- [ ] The description does not state what the skill is.
- [ ] The description omits the H1 title.
- [ ] The description contains content beyond skill identity.
- [ ] The Intro has fewer than one or more than three sentences.
- [ ] The Intro has more than two paragraphs.
- [ ] The Intro does not state what the skill is.
- [ ] The Intro does not state when the skill is used.
- [ ] The Intro contains content that belongs in another section.
- [ ] The top-level section set conflicts with the selected type-writing skill.
- [ ] The top-level section order conflicts with the selected type-writing skill.
- [ ] Principles contains more than four distinct mental models.
- [ ] A Principle has more than two sentences.
- [ ] A Principle contains detail owned by another section.
- [ ] Rules contains more than six distinct constraints.
- [ ] A Rule does not begin with its own bold `MUST` or `NEVER` expression.
- [ ] A Rule has more than two sentences.
- [ ] A Rule is not binding.
- [ ] A Rule depends on another Rule for its complete meaning.
- [ ] A Rule cannot be checked against observable evidence.
- [ ] A paragraph delays its main sentence behind supporting detail.
- [ ] A list item delays its main point behind supporting detail.
- [ ] A table description delays its main point behind supporting detail.

### References and Evidence

#### References obscure ownership or violate the selected type contract

- [ ] A non-domain skill lacks a References section.
- [ ] A domain navigation root contains a References section.
- [ ] References uses a structure other than a `Name | Description` table.
- [ ] A References row points to an external document.
- [ ] A References row points to an internal document not needed to use or maintain the skill.
- [ ] An internal owner needed to use or maintain the skill is absent from References.
- [ ] A References name lacks a resolving internal link.
- [ ] A References description does not state what the linked document supplies.
- [ ] An external claim lacks a citation beside the claim it supports.
- [ ] A reference copies policy that should remain in the linked owner.

### Skill System

#### The skill system has unclear ownership, drift, or needless indirection

- [ ] A noncanonical view was edited as an independent source.
- [ ] A projected view differs from its canonical owner without an explained projection state.
- [ ] The same instruction must be reconciled across multiple files without one clear owner.
- [ ] A reference adds indirection without separating ownership or maintenance.
- [ ] A required navigation edge is missing.
- [ ] A navigation edge points to stale content.
- [ ] A navigation entry appears more than once.
- [ ] A child exists without a route from its owning family.
- [ ] Different terms describe the same concept without a necessary distinction.
- [ ] A cold reader needs private author context to find the applicable guidance.
- [ ] A cold reader needs private author context to understand the skill boundary.

### Compactness and Improvement

#### The target remains verbose, complicated, or superficially improved

- [ ] Content repeats a point already stated by its owner.
- [ ] One section mixes content with different owners.
- [ ] Separate sections divide content with one owner and purpose.
- [ ] A long or multi-clause sentence obscures its main meaning.
- [ ] Vocabulary obscures the intended meaning.
- [ ] The supplied review record identifies an in-scope problem that remains unchanged in the target.
- [ ] A structural element has no distinct present value.

## Product Lifecycle

No supported coverage for this lifecycle.
