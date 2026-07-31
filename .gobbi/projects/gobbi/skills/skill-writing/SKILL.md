---
name: skill-writing
description: "MUST load when authoring, substantively revising, migrating, or splitting a project skill. Skill Writing is an operation skill that classifies the target as domain, operation, tool, or preference, then directs evidence-backed, skeleton-first writing and verification."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Skill Writing

Skill Writing creates or substantively revises one self-contained project skill or domain skill family. It
classifies the target as domain, operation, tool, or preference and produces an evidence-backed, clearly
written, and verified artifact set.

The operation studies consumers, prior art, mistakes, and mechanism owners before writing. It designs the
skill with the user, delegates writing to one type-specific procedure, then reviews and improves the complete
artifact set. A legacy skill may remain untyped until substantive revision; a narrow compatibility correction
does not require migration.

---

## Principles

### Design top-down with a wireframe and build bottom-up from a skeleton

Design the capability top-down as a wireframe of its type, section roles, child materials, and claim slots,
then translate it into a complete skeleton of frontmatter slots, ordered headings, and planned child files.
Build bottom-up from the smallest owned units and reconcile the finished sections with the whole capability
so design decisions remain visible before prose makes them expensive to change.

### Keep the skill minimal

Include only the guidance the current capability truly needs, and keep every step and paragraph simple enough
for a cold reader to understand quickly with little context. Add verification, guardrails, exceptions, and
supporting detail only when a current requirement, observed failure, or material risk justifies them, without
omitting guidance required for correct, safe, or complete use.

### Write for a cold reader in plain, exact language

A reader should not need the author's conversation or vocabulary to recover the skill, because wrong,
crowded, or stylized language can change or hide its contract. Use concrete actors, actions, conditions, and
evidence so the cold reader reaches the intended understanding directly.

---

## Rules

- **MUST keep the Intro to two or three short paragraphs.** Orient a cold reader to the actor, trigger,
  capability, boundary, outcome, and operating model without introducing policy or procedure absent from its
  owning section.
- **MUST render the complete target skeleton before writing substantive prose.** Include the exact frontmatter
  slots, required heading order, and every planned direct child document or skill; populate it only after the
  skill wireframe is complete.
- **MUST keep Principles to at most four semantic items and each Principle to at most two sentences.** Retain
  only the most important mental models and move supporting detail to its owning section.
- **MUST keep Rules to at most six semantic items and each Rule to at most two sentences.** Begin every Rule
  with a bold `MUST` or `NEVER` expression and keep it binding, self-contained, and testable.

---

## Procedure

### Phase 1 — Design the Skill with the User

#### 1.1 Study the skill context

- Read the request, current skill when one exists, intended consumers, prior decisions, applicable mistakes,
  and two or three relevant internal skills. Use concrete use cases to identify the capability, boundary,
  expected result, failure cases, and likely type without fixing the design yet.
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

- Frame the approved skill through its narrowest actor, load trigger, observable outcome, judgment or routing
  result, non-goals, and first intended consumer.
- Use the first matching row to select the skill type, record why the other types do not apply, and lock the
  approved wireframe, affected files, and compatibility or semantic-change decisions.

| `skill-type` | Description |
|---|---|
| `domain` | A navigation-only root for one domain with multiple independently loadable children, including at least one operation, tool, and preference. |
| `operation` | Ordered actions that produce one observable outcome, even when they use a tool or express preferences. |
| `tool` | Guidance for understanding and using one named tool or platform; a short setup sequence alone is not an operation. |
| `preference` | Judgments, behavior, conventions, constraints, or defaults that do not require ordered execution. |

### Phase 2 — Write the Skill

#### 2.1 Load the SOP and write from the core outward

- Load only the `{skill-type}-skill.md` standard operating procedure (SOP) matching Step 1.3. Apply its
  type-specific requirements in the writing order below; return to Phase 1 if it exposes an incorrect type or
  unresolved design.
- For a domain root, load only `domain-skill.md`. Write each child through a fresh Skill Writing pass with its
  matching ordinary SOP before returning to the root.
- After design is locked, edit only the canonical project skill directory and keep generated, discovery,
  plugin, and runtime views read-only. Build the complete skeleton, beginning with this exact frontmatter:

```yaml
---
name: {skill-directory-name}
description: {one line from the approved frame}
allowed-tools: {smallest surface the skill's own work needs}
skill-type: domain|operation|tool|preference
---
```

- Use the SOP and approved evidence to write the type's core first: Procedure for an operation, Preferences
  for a preference, Manual for a tool, or the Child Skills table for a domain root.

### Phase 3 — Review and Improve the Skill

#### 3.1 Review correctness, completeness, and writing

- **Review type and structure.** Confirm that the Step 1.3 type matches the only SOP loaded at Step 2.1.
  Verify the frontmatter, type shape, Intro, section roles, justified children, and semantic preservation.
  Enforce the Principle and Rule count and sentence limits, `MUST` or `NEVER` Rule expressions, distinct
  binding Rules, and applicable domain or operation shape requirements.
- **Review evidence and completeness.** Verify live commands, paths, fields, schemas, permissions, wiring,
  examples, compatibility claims, and version-sensitive facts against their owners. Run applicable checks,
  then read as a cold consumer and mark missing, duplicated, unsupported, or ambiguous content.
- **Review language.** Mark vague, inflated, uncommon, inappropriate, or inconsistent words; unfamiliar
  abbreviations or unstable terms; crowded sentences or mixed claims; missing actors, conditions, or force;
  and filler, metaphor, hedging, ornament, repetition, or indirect instructions.
- **Review necessity, placement, and meaning.** Mark content that does not help the reader route, decide, look
  up, act, recover, or verify; content outside its owning section; and wording that drops a condition, changes
  normative force, weakens a safety boundary, or hides an exception.

#### 3.2 Improve the reviewed skill

- Correct every Step 3.1 finding, including type, structure, evidence, completeness, language, necessity,
  placement, and meaning. Update every affected part of the skill.
- Use the smallest changes that make the skill correct, complete, concise, and clear. Preserve required
  boundaries, rationale, evidence, exceptions, recovery guidance, and normative force.

---

## References

- [`domain-skill.md`](domain-skill.md) owns domain-skill-family writing.
- [`operation-skill.md`](operation-skill.md) owns operation-skill writing.
- [`tool-skill.md`](tool-skill.md) owns tool-skill writing.
- [`preference-skill.md`](preference-skill.md) owns preference-skill writing.
