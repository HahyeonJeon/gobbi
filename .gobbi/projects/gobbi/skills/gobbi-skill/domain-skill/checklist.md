# Domain Skill Checklist

> **Document role:** Reusable unchecked evaluation source<br>
> **Subject:** Domain skill families authored or substantively revised through Domain Skill<br>
> **Applicability:** One complete current domain root, its direct children, and any allowed Tool Skill grandchildren; Evaluation binds the exact files, bytes, names, types, applicability sentences, and routes under review<br>
> **Purpose:** Evaluate whether a domain root remains navigation-only and routes every applicable capability to one valid child owner<br>
> **Scope:** Family boundary, child ownership, root shape, topology, naming, applicability conditions, routing rows, Tool Skill handoff, and reconciliation<br>
> **Exclusions:** Shared Gobbi Skill requirements; type-specific child quality beyond family integration; execution of child skills; operating product behavior<br>
> **Governing sources:** [Checklist](../../checklist/SKILL.md), [Gobbi Skill](../SKILL.md), [Domain Skill](SKILL.md), [Naming Standard](naming-standard.md), the applicable child type-writing skills, and the accepted family design<br>
> **Context:** Apply the [Gobbi Skill checklist](../checklist.md) to the family and each applicable child checklist to its owner. Add domain-specific items after study.<br>
> **Checkbox meaning:** Check an item when evidence shows the problem is present.

## Project Lifecycle

### Family Boundary

#### The domain family has an unclear or incomplete navigation purpose

- [ ] The domain cannot be identified.
- [ ] The intended readers cannot be identified.
- [ ] The supported work cannot be identified.
- [ ] The navigation boundary cannot be identified.
- [ ] One ordinary skill could own the complete capability without selective child loading.
- [ ] A material operation lacks an independently loadable owner.
- [ ] A material named tool or platform lacks an independently loadable owner.
- [ ] A material judgment area lacks an independently loadable owner.
- [ ] The family has fewer than two independently loadable direct children.
- [ ] A child mixes capability types that need separate skills.
- [ ] A child mixes policy owners that need separate skills.
- [ ] A child mixes applicability boundaries that need separate skills.
- [ ] Two children repeat the same contract because they lack distinct boundaries.

## Design and Development Lifecycle

### Navigation Root

#### The root contains structure or guidance beyond navigation

- [ ] The root has a tool surface other than `Read`.
- [ ] The root contains domain policy.
- [ ] The root contains operating instructions.
- [ ] The root contains tool guidance.
- [ ] The root contains preferences.
- [ ] The root lacks a `## Child Skills` section.
- [ ] Child Skills uses a structure other than the required routing table.
- [ ] A top-level section appears before Child Skills after the Intro.
- [ ] A top-level section appears after Child Skills.
- [ ] Body content appears after the Child Skills table.
- [ ] The root Intro does not identify the domain.
- [ ] The root Intro does not provide a navigation instruction.

### Child Ownership and Topology

#### Children are missing, misplaced, duplicated, or deeper than the family permits

- [ ] A direct child path differs from `{domain}/{domain}-{capability}/SKILL.md`.
- [ ] A direct child `name` differs from its directory.
- [ ] A direct child has a type other than operation, tool, or preference.
- [ ] A direct child is absent from the routing table.
- [ ] A routing row has no direct child.
- [ ] A direct child directory appears more than once.
- [ ] A routing row appears more than once for the same child.
- [ ] A nested domain-routing child exists.
- [ ] A non-tool child owns a nested skill.
- [ ] A Tool Skill child owns a tool descendant deeper than one direct level.
- [ ] Family-owned supporting material sits outside the child that uses and maintains it.

### Naming

#### Child names use unstable, conflicting, or unregistered capability words

- [ ] A reserved capability word is used with a meaning different from the Naming Standard.
- [ ] A free word duplicates a reserved meaning.
- [ ] A free word lacks a distinct domain-owned meaning.
- [ ] A free word lacks support from authoritative domain vocabulary.
- [ ] A new or changed capability word is absent from the Naming Standard register.
- [ ] A concrete platform name falls outside the closed `windows`, `macos`, and `linux` set.
- [ ] A concrete platform child has a type other than tool.
- [ ] A concrete platform child covers a subject other than that exact external platform.
- [ ] A concrete platform child lacks an explicit compatibility boundary.
- [ ] A sibling reference uses a name inconsistent with the child.
- [ ] A sibling reference does not use the backticked child slug.

### Applicability and Routing

#### Applicability text does not define one complete routing condition

- [ ] The root Intro has more or less than one canonical applicability sentence.
- [ ] The root applicability sentence does not begin with `Use`.
- [ ] The root applicability sentence neither names the skill nor uses `it`.
- [ ] The root applicability sentence lacks `when`, `before`, or `after`.
- [ ] A child Intro has more or less than one canonical applicability sentence.
- [ ] A child applicability sentence does not begin with `Use`.
- [ ] A child applicability sentence neither names the skill nor uses `it`.
- [ ] A child applicability sentence lacks `when`, `before`, or `after`.
- [ ] A routing row differs byte for byte from its child's canonical applicability sentence.
- [ ] A routing row reports a type different from its child.
- [ ] A routing row points to a path different from its child.
- [ ] A child applicability condition is not equivalent to its canonical sentence.
- [ ] The root applicability condition is not equivalent to its canonical sentence.
- [ ] A true child applicability condition does not make the root condition true.
- [ ] The root condition can be true while every child condition is false.
- [ ] A single-child case selects the wrong child set.
- [ ] A multi-child case selects the wrong child set.
- [ ] An outside-family case selects a child.
- [ ] Routing rows are not ordered by stable child name.

### Child Integration

#### A changed child leaves the family inconsistent or undiscoverable

- [ ] The supplied family evidence does not identify the type-writing guidance applied to a child.
- [ ] A changed child leaves its routing-row applicability text stale.
- [ ] A changed child leaves its routing-row type stale.
- [ ] A changed child leaves its routing-row name stale.
- [ ] A changed child leaves its routing-row path stale.
- [ ] A family-owned route points to a missing path.
- [ ] A material child capability has no clear owner.
- [ ] An applicable direct child cannot be discovered from the root.
- [ ] An applicable tool below a Tool Skill collection cannot be discovered through its collection parent.

## Product Lifecycle

No supported coverage for this lifecycle.
