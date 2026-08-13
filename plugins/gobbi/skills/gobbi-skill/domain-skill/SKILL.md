---
name: domain-skill
description: "Domain Skill is guidance for writing a navigation-only skill that routes readers to applicable direct child skills."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Domain Skill

Domain Skill defines how to author or substantively revise one navigation-only domain root and its direct
operation, tool, and preference children. Use it after Gobbi Skill classifies the target as `domain` and one
broad area needs a selective family of independently loadable skills.

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

- **MUST produce the exact navigation-root shape.** Use Frontmatter → Title → Intro → Child Skills table, set
  `allowed-tools: Read`, and add no domain policy, Principles, Rules, Preferences, Manual, Procedure, or
  References to the root.
- **MUST keep children direct and globally namespaced.** Use `{domain}/{domain}-{capability}/SKILL.md`, make
  each child `name` match its directory, and create no nested domain-routing child; a Tool Skill child may own
  direct Tool Skill children under the Tool Skill contract.
- **MUST make every child an ordinary operation, tool, or preference skill.** Author each child through a fresh
  Gobbi Skill pass and give it one matching type shape with locally owned supporting documents only when
  needed.
- **MUST keep root activation and child routing complete and bidirectional.** List each direct child once and
  require root predicate `R` to be true if and only if at least one direct-child predicate `Ci` is true.
- **MUST keep applicability wording canonical.** Put identity only in each `description`, put one applicability
  sentence in each Intro, and copy that sentence byte for byte into the root routing row.
- **MUST use the [Naming Standard](naming-standard.md) for every child capability word.** Keep one fixed meaning per reserved word,
  use a free word only for a distinct domain-owned meaning, and update the register when its vocabulary
  changes.

## Procedure

### Phase 1 — Design the Domain Family

#### 1.1 Define the family boundary

- Name the domain, intended readers, supported work, and navigation boundary.
- Inventory the operations, named tools or platforms, and judgment areas that need independent loading.
- Return to parent Phase 1 when one ordinary skill can own the capability without a routing family.

#### 1.2 Assign child ownership

- Partition the inventory by independently useful applicability, type, and policy owner.
- Require at least one operation, one tool, and one preference child, and assign every material claim to one
  child.
- Split a child with mixed types or owners, and merge children that cannot state distinct boundaries without
  repeating the same contract.

#### 1.3 Design names and routing

- Name each child `{domain}-{capability}` with a capability word from the
  [Naming Standard](naming-standard.md).
- Write one canonical applicability sentence for each child and derive its predicate `Ci` from that sentence.
- Write the root applicability sentence, derive predicate `R` from it, and check both directions: every true
  `Ci` makes `R` true, and every true `R` has at least one true `Ci`.

### Phase 2 — Write the Domain Family

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
| [Naming Standard](naming-standard.md) | Reserved and free capability words plus canonical applicability and routing forms. |
| [`Operation Skill`](../operation-skill/SKILL.md) | Guidance for writing each operation child as a straightforward SOP. |
| [`Tool Skill`](../tool-skill/SKILL.md) | Guidance for writing each tool child and any direct Tool Skill children as direct-lookup manuals. |
| [`Preference Skill`](../preference-skill/SKILL.md) | Guidance for writing each preference child as consistency guidance for recurring agent choices and results. |
