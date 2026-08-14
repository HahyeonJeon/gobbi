---
name: gobbi-skill
description: "Gobbi Skill is guidance for designing and writing Gobbi-compatible project skills and skill families."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Gobbi Skill

Gobbi Skill guides authors when they create, substantively revise, migrate, or split a project skill. Use it to
classify the target as domain, operation, tool, or preference, define only the necessary structure, and route
the author to the matching type-writing skill.

## Principles

### Keep the skill minimal

Add each piece of guidance, structure, or supporting material only when a present requirement, observed
failure, or evidence-backed material risk shows it is necessary; leave it out until then. Keep the skill as
short, simple, and readable as correct and safe use allows, and never trade those qualities for speculative
completeness.

### Write for a cold reader in plain, exact language

A reader should not need the author's conversation or vocabulary to recover the skill, because wrong,
crowded, or stylized language can change or hide its contract. Use concrete actors, actions, conditions, and
evidence so the cold reader reaches the intended understanding directly.

---

## Rules

- **MUST write `description` as one or two short sentences that state only what the skill is.** Include the H1
  title and no trigger, applicability, routing command, policy, or procedure.
- **MUST keep the Intro to one to three sentences in no more than two paragraphs.** State what the skill is
  and when to use it without introducing policy or procedure absent from its owning section.
- **MUST put the main sentence first in every paragraph and list item, and the main point first in every table
  description.** Keep supporting sentences short and include only details needed to understand or apply that
  point.
- **MUST keep Principles to at most four semantic items and each Principle to at most two sentences.** Retain
  only the most important mental models and move supporting detail to its owning section.
- **MUST keep Rules to at most six semantic items and each Rule to at most two sentences.** Begin every Rule
  with a bold `MUST` or `NEVER` expression and keep it binding, self-contained, and testable.
- **MUST write `## References` only as the fixed two-column internal-document table `Name | Description`;
  omit it only from a domain navigation root.** Include only internal documents needed to use or maintain the
  skill, link each document from `Name`, and describe what it supplies in `Description`; cite external sources
  beside the claims they support.

---

## Procedure

### Phase 1 — Design the Skill with the User

#### 1.1 Study the skill context

- Read the request, current skill when one exists, intended consumers, prior decisions, applicable prior
  failures, and two or three relevant internal skills. Use concrete use cases to identify the capability,
  boundary, expected result, failure cases, and likely type without fixing the design yet.
- Study authoritative external practice when it can improve the capability. Read every mechanism that owns a
  behavior, command, path, schema, permission, or wiring claim. Verify claims and examples against their live
  owners instead of treating a plausible statement as evidence.

#### 1.2 Discuss the skill design with the user

- Discuss the evidence and proposed design with the user: actor, trigger, outcome, boundary, consumers, use
  cases, section roles, and necessary children.
- When meaningful alternatives exist, recommend a type, structure, and child set, explain the trade-offs,
  and resolve the choice with the user. Default an ordinary skill to one `SKILL.md`; add a child only when it
  needs separate loading.
- Resolve every material disagreement or open design choice with the user. Treat an explicit user or task
  decision that already resolves the same choice as approval and do not ask again.

#### 1.3 Frame, classify, and lock the design

- Frame the approved skill through its narrowest actor, applicability, observable outcome, consistency or routing
  result, non-goals, and first intended consumer.
- Use the first matching row to select the skill type, then lock the approved structure, affected files, and
  compatibility or semantic-change decisions.
- Attach a binding constraint without a real overridable default to the operation, tool, or preference it
  governs. Do not create a standalone constraint-only skill.

| `skill-type` | Description |
|---|---|
| `domain` | A navigation-only root for one domain with multiple independently loadable children, including at least one operation, tool, and preference. |
| `operation` | A repeatable end-to-end standard operating procedure with ordered Phases and Steps, even when it uses a tool or applies preferences. Local setup for lookup remains tool guidance. |
| `tool` | Guidance for one named tool, platform, or cohesive tool collection. Use direct Tool Skill children when tools in a collection need independent lookup. |
| `preference` | Rules, conventions, preferred styles, and defaults that make recurring agent choices and results consistent without an end-to-end SOP. |

### Phase 2 — Write the Skill

#### 2.1 Load the type-writing guidance

- Load only the `{skill-type}-skill` child skill matching Step 1.3. Apply its
  type-specific requirements in the writing order below; return to Phase 1 if it exposes an incorrect type or
  unresolved design.
- For a domain root, use only `domain-skill`. Write each child through a fresh Gobbi Skill pass with its
  matching ordinary type-writing skill before returning to the root.

#### 2.2 Write the canonical target

- After design is locked, edit only the canonical project skill directory and keep generated, discovery,
  plugin, and runtime views read-only. Begin with this exact frontmatter:

```yaml
---
name: {skill-directory-name}
description: "{one or two short sentences that state what the skill is and contain the H1 title}"
allowed-tools: {smallest surface the skill's own work needs}
skill-type: domain|operation|tool|preference
---
```

- Use the matching type-writing skill and approved evidence to write the type's core first: Procedure for an
  operation, Preferences for a preference, Manual for a tool, or the Child Skills table for a domain root.
- Keep discovery commands and applicability out of `description`; state applicability in the Intro and in a
  domain root's routing table.
- When the project needs local discovery entries, run
  [`link-project-skills.sh`](scripts/link-project-skills.sh) from the canonical Gobbi Skill. It creates missing
  top-level links for Claude Code and Codex and stops instead of migrating or replacing an existing entry.

### Phase 3 — Review and Improve the Skill

#### 3.1 Improve the section and system structure

- Reshape the skill instead of only marking structural problems. Remove anticipatory, empty, repeated, or
  one-use sections; merge sections with one owner; split sections with mixed owners or purposes; and reorder
  content so prerequisites appear before dependent guidance.
- Simplify the skill system by tracing every child and internal reference. Move each policy to one owner,
  remove copied guidance and needless indirection, and prefer one `SKILL.md` unless separate loading is
  necessary.

#### 3.2 Improve sentences and vocabulary

- Rewrite every paragraph, list item, and table description so its main sentence or point comes first. Split
  mixed claims, shorten supporting sentences, and remove repetition, filler, generic advice, speculative
  cases, redundant rationale, and examples that add no decision or action.
- Replace vague, inflated, uncommon, or inconsistent words with familiar, precise terms. Define necessary
  technical vocabulary once, use one stable term per concept, and name actors, actions, conditions, and
  normative force directly.
- Read the result as a cold consumer and run the applicable checks. Continue improving it until every remaining
  section, sentence, word, reference, and system boundary serves a distinct present need and no identified
  simplification preserves all required meaning, safety, ownership, evidence, and usability.

---

## References

| Name | Description |
|---|---|
| [Gobbi Skill checklist](checklist.md) | Reusable source for evaluating shared skill design, structure, minimality, language, references, and system boundaries. |
| [`domain-skill`](domain-skill/SKILL.md) | Guidance for writing a navigation-only domain skill and its selected child family. |
| [`operation-skill`](operation-skill/SKILL.md) | Guidance for writing a straightforward standard operating procedure with well-structured Phases and Steps. |
| [`tool-skill`](tool-skill/SKILL.md) | Guidance for writing a direct-lookup manual for a named tool, platform, or cohesive tool collection. |
| [`preference-skill`](preference-skill/SKILL.md) | Guidance for writing rules, conventions, preferred styles, and defaults that keep agent results consistent. |
