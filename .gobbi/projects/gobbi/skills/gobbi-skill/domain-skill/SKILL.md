---
name: domain-skill
description: "Domain Skill guides writing a navigation-only domain skill and its child family. Use it after Gobbi Skill classifies a target as `domain`."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Domain Skill

Domain Skill defines how to author or substantively revise one navigation-only domain root and its direct
children. Use it after Gobbi Skill classifies the target as `domain` and one broad area needs a selective family
of independently loadable skills.

## Principles

### Keep the root as navigation

A domain root helps the reader find and load the right children. Keep policy, instruction, tool guidance, and
preferences in their child owners.

### Give each capability one child owner

Each domain-routing capability belongs to one direct child. A collection's individual tool lookup belongs to
its Tool Skill child, which prevents copied guidance and isolates unrelated changes.

### Route selectively with complete coverage

The root applies exactly when at least one child applies. Its routing table selects every applicable child and
no other child.

### Keep names shallow and stable

One direct domain-routing level keeps the family visible. A Tool Skill child may own direct Tool Skill
children for independently loadable tools, while domain-prefixed names and one shared capability vocabulary
keep identities clear.

## Rules

- **Use the navigation-root shape.** Frontmatter → Title → Intro → Child Skills table with
  `allowed-tools: Read`, and no policy or other sections, because the root only routes.
- **Keep children direct and globally namespaced.** Use `{domain}/{domain}-{capability}/SKILL.md` with each
  child `name` matching its directory and no nested domain-routing child, so every child is found by one lookup.
- **Give the family at least two independently loadable children, each an operation, tool, or preference
  skill.** A family of one is a single skill and needs no root.
- **Route each child by when to load it, not by its rules.** List each child once with the one applicability
  sentence from its Intro, so the root applies exactly when some child applies and carries none of its policy.

## Procedure

### Phase 1 — Design the Domain Family

Settle the children and the routing before writing. Done when every material claim has one child owner and
the root and child predicates pass the two-direction check.

#### 1.1 Define the family boundary

- Name the domain, intended readers, supported work, and navigation boundary.
- Inventory the operations, named tools or platforms, and judgment areas that need independent loading.
- Return to parent Phase 1 when one ordinary skill can own the capability without a routing family.

#### 1.2 Assign child ownership

- Partition the inventory by independently useful applicability, type, and policy owner.
- Require at least two independently loadable direct children, truthfully classify each one, and assign every
  material claim to one child.
- Split a child with mixed types or owners, and merge children that cannot state distinct boundaries without
  repeating the same contract.

#### 1.3 Design names and routing

- Name each child `{domain}-{capability}`.
- Write one canonical applicability sentence for each child and derive its predicate `Ci` from that sentence.
- Write the root applicability sentence, derive predicate `R` from it, and check both directions: every true
  `Ci` makes `R` true, and every true `R` has at least one true `Ci`.

### Phase 2 — Write the Domain Family

Write every child, then the root that routes to them. Done when every child has passed its type-specific review
and the reconciled root routes every direct child through exactly one row.

#### 2.1 Write each child

- Run one fresh Gobbi Skill pass for each child with its matching Operation, Tool, or Preference Skill.
- Finish the child's type-specific review before starting the next child.
- Return to Phase 1 when a child changes type, splits, merges, or exposes an ownership conflict.

#### 2.2 Write the navigation root

- Write identity-only frontmatter, a short Intro, and the Child Skills table. Use this body pattern:

```markdown
# {Domain Name}

{State what the domain skill is.} {State the canonical applicability and navigation instruction.}

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`{child}`]({child}/SKILL.md) | operation|tool|preference | {Exact child applicability sentence} |
```

- Add one stable-name-ordered row per direct child and copy its type and applicability sentence from the
  child.
- End the root after the Child Skills table and add no supporting document row.

#### 2.3 Reconcile the family

- Match every direct child directory to exactly one routing row and reject missing, duplicate, stale, or
  orphan entries.
- Confirm unique direct names, valid types, resolving paths, exact applicability text, and no nested
  domain-routing children. For each Tool Skill child, apply the Tool Skill collection reconciliation.
- Confirm that the root selects every applicable child and no other child for single-child, multi-child, and
  outside-family cases.

### Phase 3 — Review and Improve the Domain Family

Improve the family without breaking its routing. Done when the complete family reconciles after the last
improvement and the parent stopping condition holds.

#### 3.1 Improve structure, routing, sentences, and vocabulary

- Apply parent Phase 3 and return every structural change to Phase 1. Return each affected child to Step 2.1
  before changing the root so the child remains the source of its name, type, and applicability sentence.
- Improve child Intros first, then copy their canonical applicability sentences into the routing rows. Rewrite
  the root Intro last, derive `R` from its actual sentence, and use short, direct, stable vocabulary throughout.
- Reconcile the complete family after every improvement. Verify child coverage, predicates, exact row text,
  paths, topology, and discovery before applying the parent stopping condition.

## References

| Name | Description |
|---|---|
| [`Gobbi Skill`](../SKILL.md) | Parent guidance for type classification and shared skill-writing rules. |
| [`Operation Skill`](../operation-skill/SKILL.md) | Guidance for writing each operation child as a straightforward SOP. |
| [`Tool Skill`](../tool-skill/SKILL.md) | Guidance for writing each tool child and any direct Tool Skill children as direct-lookup manuals. |
| [`Preference Skill`](../preference-skill/SKILL.md) | Guidance for writing each preference child as consistency guidance for recurring agent choices and results. |
