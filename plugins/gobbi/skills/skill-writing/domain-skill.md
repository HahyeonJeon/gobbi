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
guidance. A root must activate exactly when at least one direct child activates, and its routing table must
then load every applicable child and no other child.

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
- **MUST keep root activation and child routing complete, current, and bidirectional.** List every direct
  child exactly once, copy its load trigger from child frontmatter, load every applicable child and no other
  child, and require the root predicate `R` to be true if and only if at least one direct-child predicate
  `Ci` is true; reject stale rows, orphan children, missing routes, child-without-root cases, and
  root-without-child cases.

## Naming Standard

This section adds a capability vocabulary that this document did not define before. It binds every child named
or substantively revised from now on. An unchanged legacy child is not invalidated solely because a reserved
meaning becomes narrower.

### Reserved words

Each word below carries one meaning across the whole project. Use the word only for that meaning, and use no
other word for that meaning.

| Reserved word | Fixed meaning |
|---|---|
| `development` | The operation that realizes an accepted change for a domain and coordinates its implementation handoffs; it does not own protected independent review, Evaluation, or acceptance. |
| `review` | The protected read-only operation that produces scoped evidence and findings without an Evaluation verdict or acceptance. |
| `testing` | The evidence operation |
| `conventions` | The project-overridable cross-capability preference for domain names, written forms, canonical, generated, and local-only topology, role and branch vocabulary, handoffs, and evidence forms, including authority and departure boundaries. |
| `source` | The source-file organization, formatter layout, import-form, and generated provenance preference. |
| `documentation` | The public documentation and implementation-comment preference. |
| `design` | The domain-specific capability for creating or judging structure, behavior, boundaries, and interfaces |
| `platform` | A standard or engine you did not write |
| `runtime` | A framework runtime you execute inside |
| `toolchain` | Tooling you invoke |
| `release` | Shipping, at either operation or preference granularity |

### Concrete platform names

Use `windows`, `macos`, and `linux` as lowercase slug words only for a `skill-type: tool` child whose subject
is that exact external platform and whose compatibility boundary is explicit. This closed list admits no
other platform name, general proper-name or brand-name class, free synonym for `platform`, or identifier
alias; `platform` keeps its reserved generic meaning.

### Free words

A capability the domain genuinely owns may take a word that the domain's own authoritative literature uses,
provided the word collides with no reserved meaning above. A word collides when the capability it names is
already a reserved meaning; use the reserved word instead. A reserved word and a free synonym for one meaning
would restore the overload the two tiers remove.

These words qualify today: `semantics`, `typing`, `async`, `packaging`, `modules`, `concurrency`, `security`,
`architecture`, `feature`, `delivery`, `frontend`, `backend`, `topology`, `contract`, `server`, `typescript`,
`interface`, `interaction`, `motion`, `observability`, `configuration`, `deployment`, `localization`,
`app-lifecycle`, `operations`, `project-structure`, `debugging`, `performance`, and `compiler` as the
proper noun React Compiler.

### Maintaining the register

The reserved-word table, closed concrete-platform-name rule, and free-word list above are the register. Update
this section in the same change that changes a reserved meaning, changes the closed concrete-platform list,
or admits a new free word, and record the change beside the others. Without that update the register drifts
and each family invents its own vocabulary again.

### Relation to globally unique identity

The Principle "Keep identity shallow and globally unique" stays true and is not narrowed here. Two domains may
use one capability word: `go-testing` and `web-testing` are both correct, because each names the same meaning
inside its own domain. This standard forbids something else — one word carrying two meanings, and one meaning
carrying two words. The domain prefix keeps identity unique; the tier keeps meaning singular.

### Trigger and routing form

These four form rules bind every child and every root routing table.

| Form rule | Statement |
|---|---|
| FR-1 | Every child `description` contains one trigger sentence beginning `MUST load when`. Every root `description` contains one trigger sentence beginning `MUST load before`, followed by the stable domain identity sentence. Define each `Ci` from its child trigger after removing only `MUST load when`, and define `R` from the root trigger after removing only `MUST load before`; `R` must be true if and only if at least one `Ci` is true. |
| FR-2 | Every child `description` is exactly one sentence and carries no second identity sentence. |
| FR-3 | Every root routing row copies its child's `description` byte for byte, so string equality checks it. |
| FR-4 | Every cross-reference to a sibling child uses the backticked slug, never a prose display name. |

## Procedure

### Phase 1 — Design the Domain Family

#### 1.1 Partition child ownership and routing

- Use the approved domain frame to inventory the operations, named tool or platform surfaces, and judgment
  areas the family must support.
- Partition the inventory by independently useful trigger, outcome or judgment, policy owner, and required
  evidence; require at least one operation, one tool, and one preference child.
- Assign every material claim to one child, split mixed triggers or types, and merge children that cannot
  explain their boundaries without repeating the same contract.
- Derive each child predicate `Ci` from its stable child trigger, then define the root predicate `R` as the
  semantic union of all direct-child predicates.
- Prove both implications: every true `Ci` makes `R` true, and every true `R` has at least one true `Ci`.
  Route all true children for each supported task.

#### 1.2 Lock the family skeleton

- Give the root the domain slug and name every direct child `{domain}-{capability}`, using the same value for
  its directory and frontmatter `name`. Take each `{capability}` from the
  [Naming Standard](#naming-standard), which admits a reserved word for its fixed meaning and a free word its
  domain's authoritative literature uses.
- Write each child trigger from the approved routing design and reserve a universal trigger only for a
  genuine domain-wide floor. Build the root trigger only after every child trigger is stable: use a broad
  domain trigger only when it is proved equivalent to their union; otherwise use a grammatical semantic
  union that preserves every child's actors, scope, conditions, and force without adding another case.
- Apply form rules FR-1 through FR-4 to every child `description`, root routing row, and sibling
  cross-reference.
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

- Use this broad root shape only when a genuine universal child floor proves the broad trigger equivalent to
  the union of all child triggers:

```yaml
---
name: {domain}
description: "MUST load before working in {domain}. {Domain} is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---
```

- Otherwise use this semantic-union root shape, listing the stable child triggers in stable child-name order
  and joining them as one grammatical alternative list:

```yaml
---
name: {domain}
description: "MUST load before {C1}; {C2}; ...; or {Cn}. {Domain} is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---
```

  Each `{Ci}` is the meaning of its child trigger after removing only `MUST load when`. Remove repeated words
  or conjunctions only when that grammatical edit leaves the meaning unchanged.

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
- Exercise one positive case per child, multi-child, universal-floor when present, outside-every-child,
  child-without-root, root-without-child, unjustified-broad-root, stale-row, orphan-child, and duplicate-owner
  cases. Require `R` if and only if at least one `Ci` is true, and require the routing table to select every
  true child and no false child.
- When this trigger contract or its register changes, audit every existing domain family and propagate only
  root corrections proved necessary by the audit.
- Confirm that every child passed its ordinary type review, owns its policy, and that the complete family
  passes parent Phase 3 plus structural, relative-link, topology, discovery, and compatibility checks.

#### 3.2 Correct and re-review the family

- Trace each finding to the earliest incorrect domain boundary, partition, child type, owner, name, child
  predicate, root predicate, implication, skeleton, child pass, or root row and propagate the correction
  through every affected projection.
- Repeat the affected child review and the complete family review before returning a complete, selective,
  policy-free, and independently usable family.

## References

- [`SKILL.md`](SKILL.md) owns the parent Skill Writing operation, its type classification at Step 1.3, and the
  Principle and Rule limits every child skill in the family must meet.
- [`operation-skill.md`](operation-skill.md) owns writing each operation child of the family.
- [`tool-skill.md`](tool-skill.md) owns writing each tool child of the family.
- [`preference-skill.md`](preference-skill.md) owns writing each preference child of the family.
