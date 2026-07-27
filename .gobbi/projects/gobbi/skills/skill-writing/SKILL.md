---
name: skill-writing
description: "MUST load when authoring, substantively revising, migrating, or splitting a project skill. Skill Writing is an operation skill that classifies the target as preference, tool, or operation, then directs evidence-backed, skeleton-first writing and verification."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Skill Writing

Skill Writing is the authoring operation for creating or substantively changing one self-contained project
skill. Load it for a new skill, a material revision, a migration, or a split. It turns an intended capability
into an evidence-backed, correctly typed, clearly written, and verified artifact.

The operation first decides what kind of help the agent needs. A preference skill standardizes judgment, a
tool skill is an authoritative usage manual for one named tool or platform, and an operation skill is a
standard operating procedure (SOP) for one observable outcome. Each type has its own dominant section and
writing procedure.

Skill Writing studies the user, consumers, prior art, mistakes, and mechanism owners before design closes. It
designs the document top-down as a skill wireframe, translates that wireframe into a complete skeleton, then
builds and reconciles the content from the smallest owned units upward. A legacy skill may remain untyped
until it is substantively revised; a narrow compatibility correction alone does not trigger migration.

---

## Principles

### A preference skill standardizes judgment

A preference skill helps an agent choose well when more than one valid path may exist. Principles supply the
mental model, Rules define the binding choice boundary, and Preferences name contextual defaults plus the
evidence that earns an exception. It does not turn judgment into an artificial execution sequence.

### A tool skill is an authoritative usage manual

A tool skill helps an agent understand and use one named tool or platform correctly. Its Manual organizes
capabilities, syntax, inputs, outputs, side effects, limits, failures, and verified examples for lookup. It
does not prescribe a broader outcome merely because that outcome uses the tool.

### An operation skill is a standard operating procedure

An operation skill directs an actor through ordered decisions and actions to one observable outcome. Its SOP
owns triggers, preconditions, branches, authority boundaries, failures, recovery, evidence, and completion.
Scenarios, checks, and evaluation then prove that the procedure works rather than merely looking plausible.

### Design top-down with a wireframe and build bottom-up from a skeleton

Design begins with a skill wireframe that maps the whole capability top-down into its type, section roles,
child materials, and claim slots. Translate that wireframe into a complete skeleton of frontmatter slots,
ordered headings, and planned child files. Build bottom-up from the skeleton by writing the smallest owned
units, assembling them into sections, and reconciling the finished sections with the whole capability.
Separating the wireframe from the skeleton keeps design decisions visible before prose makes them expensive
to change.

### Write each section to match its role

Section placement is part of meaning. The Intro orients; Principles explain how to think; Rules define
mandatory, testable boundaries; Preferences recommend overridable defaults; Manual supports lookup for one
named tool or platform; Procedure directs ordered work; and References navigates owned child material. Put
each statement in the section whose role matches it. When section roles stay distinct, readers can infer a
statement's purpose and force from its location, and rationale, requirements, defaults, lookup facts, and
actions do not blur together.

### Write for a cold reader in plain, exact language

A reader should not need the author's conversation or vocabulary to recover the skill. Language is part of
operational correctness: the wrong word changes a boundary, a crowded sentence hides a condition, and a
stylized expression invites interpretation. Concrete actors, actions, conditions, and evidence let the cold
reader reach the intended understanding directly.

---

## Rules

### Must-Follow

- **MUST stamp the exact P2 frontmatter contract on every new or substantively revised skill.** Keep the four
  required keys in order and use only evidenced non-default keys from the named optional allowlist. Begin the
  description with `MUST load`, state the exact load condition, and identify what the skill is.
- **MUST apply the P2 classifier in order: operation, then tool, then preference.** Record the selected branch
  and rejected alternatives before writing.
- **MUST load exactly one type child at P5.** Record the selected and loaded child; multiple-child synthesis
  invalidates the P5 run.
- **MUST render the complete skill skeleton before writing substantive prose.** Include the exact frontmatter
  slots, required heading order, and every planned direct child or operation companion; populate it only after
  the skill wireframe is complete.
- **MUST keep the complete Rules section to at most nine semantic rule items.** A multi-clause item counts once
  only when all clauses define one indivisible pass/fail contract. Unrelated constraints grouped in one bullet
  count separately.
- **MUST make every Rule an unmistakable, binding, self-contained, testable boundary distinct from every
  Principle.** Start each item with a bold `MUST`, `MUST NOT`, `ALWAYS`, or `NEVER` lead; move rationale,
  defaults, lookup content, and ordered work to their owning sections.
- **MUST use plain, literal, type-appropriate language throughout the skill.** Use one stable term for each
  concept, expand unfamiliar abbreviations at first use, state the actor and condition, and replace vague
  synonyms, implied force, filler, and ornamental expressions with exact claims.
- **MUST ship every new or substantively revised operation with `scenarios.md`, `checklists.md`, and
  `evaluation.md`.** Author them in that order through their owning skills after parent policy closes.
- **MUST keep References local to the skill.** Every link in the section must resolve to a Markdown child
  document or child-skill entrypoint beneath the directory containing that skill's `SKILL.md`. Sibling skills,
  parent or project documents, scripts, data files, URLs, self-links, and other outside targets are invalid.
  Leave the required heading empty when the skill has no allowed child material.

---

## Procedure

Run six steps in order: **FRAME (P1–P4) → WRITE (P5) → PROVE (P6)**. Do not draft the target skill before
P1–P4 lock its capability, type, evidence, ownership, and file set.

### P1 — Frame one capability

State:

- the narrowest actor that always needs the skill;
- its deterministic or on-demand load trigger;
- the observable outcome or judgment it enables;
- its non-goals;
- the first intended consumer when the capability is new.

Draft the frontmatter description from the frame. Begin with `MUST load for …` for a named workflow stage or
deterministic event, or `MUST load when …` for an evidence-based trigger. Follow the trigger with a short,
complete sentence that identifies the skill by its capability and type. Do not use `Use when`, `Load when`, a
topic label, a sentence fragment, or a feature list in place of the load contract.

### P2 — Classify and stamp the type

Apply the first matching branch:

1. **Operation:** Does the skill own ordered actions that produce one observable work outcome? If yes, choose
   `operation` even when the procedure uses a named tool or carries preferences.
2. **Tool:** Otherwise, is its dominant job helping an agent understand and use one named tool or platform?
   If yes, choose `tool`. Short setup and one-capability sequences do not turn it into an operation.
3. **Preference:** Otherwise, choose `preference` for judgment, behavior, conventions, constraints, and
   defaults that do not require ordered execution.

Record the decision and the rejected alternatives. Stamp four required frontmatter keys in this exact order:

```yaml
---
name: {skill-directory-name}
description: {one line from P1}
allowed-tools: {smallest surface the skill's own work needs}
skill-type: preference|tool|operation
---
```

`name` equals the directory. `allowed-tools` describes the target skill's work, not the tools used to research
it. The named optional allowlist is:

- `user-invocable: false` when the skill must be hidden from user invocation;
- `disable-model-invocation: true` when the model must not auto-load the skill; and
- the rare official `license`, `compatibility`, or `metadata` keys only with a stated, verified need.

User-visible and model-loadable are the invocation defaults, so omit both invocation keys when those defaults
are intended. Plain `type`, memory fields, and workflow provenance such as `session`, `stage`, `status`, or
`iteration` are not skill frontmatter.

### P3 — Study evidence and pass the user design gate

Before locking the shape:

1. Read two or three same-type skills when they exist; use them for structure, never verbatim policy.
2. Read the consumers that will load the skill.
3. Study established external practice that improves the capability.
4. Read applicable project, domain, and target-skill mistakes from their current owners.
5. Read every mechanism that owns a behavior, command, path, schema, permission, or wiring claim.
6. Present reference-backed direction at the user design gate. An explicit user or task decision already
   satisfies the gate; record it and do not ask again.

Verify every mechanism claim from its owner and every taught example against the live surface. A plausible
command, path, field, or behavior is not evidence.

### P4 — Map ownership, blast radius, and document altitude

Build five planning artifacts before writing:

- **Skill wireframe:** map the whole capability top-down into actor, load trigger, outcome or judgment,
  non-goals, selected type, section roles, direct child materials, and claim slots. Treat the wireframe as a
  design artifact, not draft prose; do not build the skeleton while the wireframe is unresolved.
- **Claim-owner ledger:** every borrowed fact and its one owner. Cite an outside owner beside the claim it
  validates. Reserve References for child documents and child skills inside the target skill directory.
- **Affected-file map:** every authored, generated, conditionally updated, read-only, moved, or deleted
  surface. Discover it with exhaustive and synonymous searches, not a named-file guess. Include a skill index
  only when the index owner's placement convention requires a change. Include a tool-permission surface only
  when zero-prompt preapproval is deliberately required. Complete any such owner-approved co-touch as part of
  the authored change set before P6.
- **CRUD and 5W1H pass:** what is created, read, updated, deleted, who consumes it, when it applies, where it
  propagates, why it exists, and how it is verified.
- **Altitude decision:** default to one `SKILL.md`; add direct children only for an owned artifact set, a long
  lookup reference, per-unit orchestration, or a self-contained sub-procedure another consumer loads.

Edit only the canonical project skill directory named by the affected-file map. Treat generated, discovery,
plugin, and runtime views as read-only.

When revising or splitting, preserve the semantic union of the old content. A structural section map alone
does not prove that no subject, exception, hazard, or recovery condition was lost. When reducing Rules, map
every original condition to a retained Rule or its correct owning section. State and justify any intentional
change in force from the destination section's semantics; the numeric limit never authorizes semantic loss.

### P5 — Run exactly one type-writing procedure

Each type child is an operation-shaped SOP with Intro → Principles → Rules → Procedure → References. Because
the children are direct documents owned by Skill Writing rather than independently loadable skills, they have
no skill frontmatter or separate verification bundles. Their Procedures direct authoring; the table's Target
shape describes the skill each child produces.

Load the child selected at P2 and follow it completely:

| `skill-type` | Required child | Target shape |
|---|---|---|
| `preference` | [`preference-skill.md`](preference-skill.md) | Frontmatter → Intro → Principles → Rules → Preferences → References |
| `tool` | [`tool-skill.md`](tool-skill.md) | Frontmatter → Intro → Principles → Rules → Manual → References |
| `operation` | [`operation-skill.md`](operation-skill.md) | Frontmatter → Intro → Principles → Rules → Procedure → References, plus the plural verification bundle |

Before loading, record the one selected child path from the P2 classification. Load that child and no other
type child, and record the loaded path in the P5 load register. Loading two or all three type children
invalidates the P5 run even when the resulting headings look compliant: discard the P5 draft and restart P5
in a clean author context with only the selected child. If the selected child's boundary test fails while
writing, return to P2 and reclassify explicitly.

Before substantive prose, translate the approved skill wireframe into a working skeleton with the four
frontmatter slots, the selected type's required headings in order, and every planned direct child filename.
For an operation, include the four-file sibling topology but leave companion policy empty until `SKILL.md`
closes. Fill the smallest owned units first, assemble them into their sections, and finish the description
and Intro from the completed body. Then reconcile every section and child against the whole capability and
remove placeholders that do not own real content.

### P6 — Run the skill-writing verification bundle

Use [`scenarios.md`](scenarios.md) to activate the cases that match the target. Work a fresh filled copy of
[`checklists.md`](checklists.md), inspect the named evidence for every applicable item, and compute coverage
closure separately from acceptance. A failed gate returns to its owning P-step.

For independent review, the evaluator enters through [`evaluation.md`](evaluation.md), which loads the
scenario and checklist sources and extends the general evaluation method without changing it or the
caller-owned output contract.

Run the target's structural, link, reference, compatibility, and retired-vocabulary guards. Confirm the P2
selected child equals the only child recorded in the P5 load register. P6 verifies the authored skill and its
operation bundle. For an operation, reverse-trace every scenario, check, and evaluator requirement to a live
parent clause; move missing policy into `SKILL.md` through the design gate or remove the unsupported companion
claim. P6 passes only when every applicable gate and required check passes.

---

## References

- [`preference-skill.md`](preference-skill.md) owns preference-skill writing.
- [`tool-skill.md`](tool-skill.md) owns tool-skill writing.
- [`operation-skill.md`](operation-skill.md) owns operation-skill writing and its verification bundle.
- [`scenarios.md`](scenarios.md) exercises the parent contract through observable cases.
- [`checklists.md`](checklists.md) owns the operational acceptance checks.
- [`evaluation.md`](evaluation.md) owns the skill-writing evaluation extension.
