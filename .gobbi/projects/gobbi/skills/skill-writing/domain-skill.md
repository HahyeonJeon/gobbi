# Writing a Domain Skill

Use this child document at Step 2.1 after the parent Skill Writing operation classifies the target as
`skill-type: domain`. It produces one policy-free navigation root and a selectively loaded family containing
operation, tool, and preference child skills.

The root owns discovery and routing only. Each direct child owns one independently loadable capability and
follows its ordinary type-writing procedure in a separate Skill Writing pass.

## Principles

### Keep the root as navigation

A domain root exists because one broad trigger needs several independently loadable capabilities. It should
help the reader select those capabilities without restating their principles, rules, manuals, or procedures.

### Give every policy one child owner

Each operation, tool surface, and preference belongs to one self-contained child skill. Clear ownership keeps
the family composable and lets one child change without forcing the root or its siblings to duplicate policy.

### Route selectively with complete coverage

Loading every child wastes context, while an uncovered root trigger leaves the reader without domain
guidance. The routing table should load every applicable child, no others, and always select at least one
child for a task that activates the root.

### Keep identity shallow and globally unique

One direct child level makes the complete family visible from the root. Domain-prefixed directory names keep
child identities globally unique when different domains use the same capability word.

## Rules

- **MUST run this procedure only after Step 1.3 classifies the target as `domain`.** The family must represent
  one specific domain and contain at least one operation, one tool, and one preference child skill; otherwise
  return to Step 1.3.
- **MUST produce the exact navigation-root shape.** Use Frontmatter → Title → two-or-three-paragraph Intro →
  Child Skills table, set `allowed-tools: Read`, and add no Principles, Rules, Preferences, Manual, Procedure,
  References, or domain policy to the root.
- **MUST keep child skills direct and globally namespaced.** Use
  `{domain}/{domain}-{capability}/SKILL.md`, make each child `name` equal its directory, and create no
  independently loadable grandchild skill.
- **MUST make every child an ordinary self-contained skill.** Give it its own four-key frontmatter,
  two-or-three-paragraph Intro, one `skill-type: operation|tool|preference`, matching type shape, and locally
  owned supporting documents when needed.
- **MUST author every child in a separate fresh Skill Writing pass.** Keep `domain-skill.md` as the only type
  guide in the root pass and load exactly one matching ordinary type guide in each child pass.
- **MUST keep the routing table complete and current.** List every direct child exactly once, copy its load
  trigger from child frontmatter, select every applicable child, cover every root-triggered task, and reject
  stale rows, orphan children, and missing routes.

## Procedure

### Phase 1 — Design the Domain Family

#### 1.1 Partition child ownership and routing

- Use the approved domain frame to inventory the operations, named tool or platform surfaces, and judgment
  areas the family must support.
- Partition the inventory by independently useful trigger, outcome or judgment, policy owner, and required
  evidence; require at least one operation, one tool, and one preference child.
- Assign every material claim to one child, split mixed triggers or types, and merge children that cannot
  explain their boundaries without repeating the same contract.
- Define the root tasks that activate each child, select every applicable child, and prove that every
  supported root task selects at least one child.

#### 1.2 Lock the family skeleton

- Give the root the domain slug and name every direct child `{domain}-{capability}`, using the same value for
  its directory and frontmatter `name`.
- Write each child trigger from the approved routing design and reserve a universal trigger only for a
  genuine domain-wide floor.
- Render the root skeleton, every direct child `SKILL.md` skeleton, supporting-document paths, and one routing
  row per child before writing substantive prose.
- Keep all independently loadable children direct and create no `SKILL.md` beneath a direct child.

### Phase 2 — Write the Domain Family

#### 2.1 Write and review each child

- Run one fresh Skill Writing pass for each child and load exactly its matching `operation-skill.md`,
  `tool-skill.md`, or `preference-skill.md` procedure.
- Complete the child's core, supporting sections, and type-specific review before starting the next child.
- Keep the root as a skeleton until every child path, name, type, trigger, and policy owner is stable.
- Return to Phase 1 when a child changes type, splits, merges, exposes an ownership conflict, or invalidates
  the required operation-tool-preference coverage.

#### 2.2 Write the navigation root

- Write the stable child metadata into this exact root shape:

```yaml
---
name: {domain}
description: "MUST load before working in {domain}. {Domain} is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---
```

- Write the root with this exact body shape:

```markdown
# {Domain Name}

{In one short paragraph, identify the domain, actors, broad trigger, supported capability, and boundary.}

{In one short paragraph, state that the root owns navigation only. Direct the reader to load every row whose
trigger applies.}

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`{domain}-{operation}`]({domain}-{operation}/SKILL.md) | operation | {Exact child load trigger} |
| [`{domain}-{tool}`]({domain}-{tool}/SKILL.md) | tool | {Exact child load trigger} |
| [`{domain}-{preference}`]({domain}-{preference}/SKILL.md) | preference | {Exact child load trigger} |
```

- Keep the Intro to two or three short orientation-and-routing paragraphs.
- Add one stable-name-ordered row per direct child, no row for a supporting document, and copy each type and
  trigger from the child's frontmatter.
- Add no policy or body section after Child Skills.

### Phase 3 — Review and Improve the Domain Family

#### 3.1 Review the complete family

- Confirm the exact navigation-root shape and verify that the root contains no domain policy, Principles,
  Rules, Preferences, Manual, Procedure, References, or body after Child Skills.
- Require a one-to-one match between direct child directories and routing rows; verify direct globally unique
  names, types, triggers, paths, no grandchildren, and at least one child of each ordinary type.
- Exercise ordinary, multi-child, universal-floor, no-match, stale-row, orphan-child, and duplicate-owner
  cases, requiring every supported root task to select at least one applicable child.
- Confirm that every child passed its ordinary type review, owns its policy, and that the complete family
  passes parent Phase 3 plus structural, relative-link, topology, discovery, and compatibility checks.

#### 3.2 Correct and re-review the family

- Trace each finding to the earliest incorrect domain boundary, partition, child type, owner, name, trigger,
  skeleton, child pass, or root row and propagate the correction through every affected projection.
- Repeat the affected child review and the complete family review before returning a complete, selective,
  policy-free, and independently usable family.

## References
