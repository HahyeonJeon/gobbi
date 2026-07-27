# Skill Writing — Scenario Source

Scenario source for testing whether the skill-writing operation produces the right semantic type, load
contract, wireframe, skeleton, body shape, language, disciplined Rules, and complete operation evidence. Load
for a pre-handoff self-check or through `evaluation.md` during independent review. Every case exercises a
parent clause and names checklist IDs from `checklists.md`; this file introduces no skill-writing policy.

## Coverage register

| Category | Disposition | Coverage |
|---|---|---|
| 1 Purpose / outcomes / scope | selected | Classification follows the capability and preserves one coherent outcome. |
| 2 Actors / stakeholders / use-context | selected | Skill authors, evaluators, and later readers are exercised. |
| 3 Behavior / state / data | selected | Frontmatter, Intro, skeleton-first construction, section shape, Rules, operation bundle, and reclassification transitions are exercised. |
| 4 Interfaces / dependencies / structure | selected | Parent/child ownership, operation-shaped type children, canonical editing, local References, and companion traceability are exercised. |
| 5 Quality attributes / resource economics | selected | One-child disclosure, operation-shaped child SOPs, a visible skeleton, exact language, and bounded, non-duplicative Rules limit unnecessary reading. |
| 6 Failure / recovery / operations | selected | Wrong classification, prose-first construction, missing companions, stale owners, failed guards, and rule overflow are exercised. |
| 7 Trust / harm / governance | selected | Permission scope, unverified commands, and unauthorized state changes are exercised. |
| 8 Inclusion / locale | `n/a: the skill emits repository markdown with no locale-dependent interaction` | — |
| 9 Change / compatibility / reversibility | selected | Legacy untyped skills, substantive revision, deletion dependencies, and rule refactors are exercised. |
| 10 Evidence / traceability / clarity | selected | Load descriptions, aligned Intros, literal language, inline claim owners, local References, scenario/check mappings, rule inventories, and binary evidence are exercised. |

## Family SW-SCENARIO-F1 — Capability-first classification

**Primary category:** 1 Purpose / outcomes / scope — the defining discrimination is which capability the
skill owns. **Secondary:** 3 Behavior / state / data, 10 Evidence / traceability / clarity.

### SW-SCENARIO-01 — Preference with hard and contextual guidance

- **Primary type:** Positive.
- **Coverage role:** positive.
- **Given:** a skill teaches review judgment with binding prohibitions plus contextual defaults, but no ordered
  work outcome and no named-tool manual.
- **When:** the author runs P1–P5.
- **Then:** it is stamped `skill-type: preference` and uses Frontmatter → Intro → Principles → Rules →
  Preferences → References, with no Procedure or Manual. Rules are binding; Preferences are overridable
  defaults and cannot override Rules.
- **Failure oracle:** the author treats `MUST` as proof of operation type, adds a token Procedure, omits or
  empties Preferences, leaves a contextual default in Rules, lets a Preference override a Rule, or forces every
  preference into one rigid entry schema.
- **Evidence:** frontmatter and heading inspection plus a normal/exception/conflict judgment probe.
- **Obligation:** the design must classify by capability rather than statement force and keep the preference
  shape non-procedural.
- **Exercises:** P2 classifier; preference child Intro, Rules, S4–S9.
- **Checklist IDs:** `SW-CHECK-02`, `SW-CHECK-05`, `SW-CHECK-06`, `SW-CHECK-07`, `SW-CHECK-18`.

### SW-SCENARIO-02 — Named tool with a local sequence

- **Primary type:** Alternative-valid.
- **Coverage role:** alternative-valid.
- **Given:** a skill documents one command-line tool, including setup and three steps that demonstrate one
  capability.
- **When:** the author distinguishes local use from a broader work outcome.
- **Then:** it is stamped `skill-type: tool` and uses Manual, not Procedure.
- **Failure oracle:** the local example alone causes operation classification, or an end-to-end deployment
  workflow is hidden inside Manual.
- **Evidence:** boundary explanation, heading inspection, and capability/syntax/setup lookup probes.
- **Obligation:** the design must permit capability-local sequences while rejecting broader normative
  workflows from tool skills.
- **Exercises:** P2 classifier; tool child Intro, Rules, S6–S9.
- **Checklist IDs:** `SW-CHECK-02`, `SW-CHECK-05`, `SW-CHECK-06`, `SW-CHECK-08`.

### SW-SCENARIO-03 — Operation with supporting preferences and tools

- **Primary type:** Positive.
- **Coverage role:** positive.
- **Given:** a skill coordinates a release outcome, applies release preferences, and uses a named command-line
  tool.
- **When:** the author applies classification precedence.
- **Then:** it is stamped `skill-type: operation`; Procedure remains dominant; preferences stay in Principles
  and Rules; only step-local tool facts remain inline.
- **Failure oracle:** the topic is classified as tool, a peer Manual competes with Procedure, or tool reference
  material overwhelms the SOP.
- **Evidence:** classifier record, heading inspection, Procedure-to-outcome trace, and supporting-content audit.
- **Obligation:** operation precedence and subordinate supporting content must hold for mixed skills.
- **Exercises:** P2 classifier; operation child Intro, Rules, S4–S6.
- **Checklist IDs:** `SW-CHECK-02`, `SW-CHECK-06`, `SW-CHECK-09`, `SW-CHECK-10`.

## Family SW-SCENARIO-F2 — Reclassification boundaries

**Primary category:** 3 Behavior / state / data — each case crosses a semantic type boundary during writing.
**Secondary:** 1 Purpose / outcomes / scope, 6 Failure / recovery / operations.

### SW-SCENARIO-04 — Preference grows an execution sequence

- **Primary type:** Change / regression / compat.
- **Coverage role:** change/regression.
- **Given:** a preference draft begins as judgment guidance.
- **When:** revision adds ordered actions, branches, and completion evidence for one outcome.
- **Then:** the author returns to P2, records reclassification, and rewrites it as operation rather than adding
  Procedure to the preference shape.
- **Failure oracle:** the author keeps `skill-type: preference` because that was the initial decision.
- **Evidence:** before/after capability frame and heading/frontmatter comparison.
- **Obligation:** a type decision must be revisited when the dominant capability changes.
- **Exercises:** P5 reclassification rule; preference child S9.
- **Checklist IDs:** `SW-CHECK-02`, `SW-CHECK-06`.

### SW-SCENARIO-05 — Tool manual grows a broader workflow

- **Primary type:** Change / regression / compat.
- **Coverage role:** change/regression.
- **Given:** a tool manual documents setup, commands, and errors.
- **When:** revision adds a normative sequence coordinating those capabilities toward migration completion.
- **Then:** the author reclassifies it as operation and routes large lookup material to a tool skill or direct
  reference child.
- **Failure oracle:** the broader workflow remains buried in Manual under `skill-type: tool`.
- **Evidence:** outcome statement, command-to-workflow boundary analysis, and final heading inspection.
- **Obligation:** tool-to-operation boundary changes must result in explicit reclassification.
- **Exercises:** P5 reclassification rule; tool child S6–S9; operation child S6.
- **Checklist IDs:** `SW-CHECK-02`, `SW-CHECK-06`, `SW-CHECK-08`, `SW-CHECK-10`.

### SW-SCENARIO-06 — Classification by topic instead of capability

- **Primary type:** Adversarial / abuse / gaming.
- **Coverage role:** adversarial.
- **Given:** an author labels every language skill a tool, every workflow-named skill an operation, or every
  authoring skill a reference.
- **When:** the artifact is reviewed without reading its owned outcome.
- **Then:** the cosmetic label fails and the author must apply the ordered capability classifier.
- **Failure oracle:** topic words are accepted as type evidence.
- **Evidence:** compare the actor/outcome/non-goal frame with the selected type contract.
- **Obligation:** cosmetic topic labels must not satisfy classification.
- **Exercises:** P2 ordered capability classifier.
- **Checklist IDs:** `SW-CHECK-01`, `SW-CHECK-02`.

## Family SW-SCENARIO-F3 — Schema and Rules boundaries

**Primary category:** 3 Behavior / state / data — frontmatter schema and Rules constraints are exact,
observable boundaries. **Secondary:** 5 Quality attributes / resource economics, 9 Change / compatibility /
reversibility, 10 Evidence / traceability / clarity.

### SW-SCENARIO-07 — Required type field, optional allowlist, and exact order

- **Primary type:** Boundary / edge.
- **Coverage role:** boundary.
- **Given:** a new or substantively revised skill that either uses the invocation defaults or has a verified
  reason for non-default skill behavior.
- **When:** its frontmatter is inspected.
- **Then:** `name`, `description`, `allowed-tools`, and `skill-type` appear in that order, and the type value is
  one of the three enum members. Invocation-default skills omit both invocation flags; any optional key is one
  of `user-invocable`, `disable-model-invocation`, `license`, `compatibility`, or `metadata` and carries the P2
  non-default value or a stated, verified need.
- **Failure oracle:** a required field is missing or misordered; another type value, explicit invocation
  default, unreasoned rare key, plain `type`, workflow provenance, or an unlisted optional key is accepted.
- **Evidence:** parsed frontmatter key order and enum validation, optional-key allowlist comparison, and the
  stated-reason record for every optional key.
- **Obligation:** typed skill frontmatter must preserve its required prefix and permit only evidenced
  non-default behavior from the named optional allowlist.
- **Exercises:** P2 schema and optional allowlist; frontmatter Must-Follow rule.
- **Checklist IDs:** `SW-CHECK-05`.

### SW-SCENARIO-08 — Legacy skill remains untouched

- **Primary type:** Alternative-valid.
- **Coverage role:** alternative-valid.
- **Given:** a legacy skill without `skill-type` receives no substantive content or shape revision.
- **When:** the typed standard is introduced.
- **Then:** it remains migration debt rather than being mass-stamped from topic guesses.
- **Failure oracle:** the implementation infers types for the entire repository or claims migration is complete.
- **Evidence:** change-set scope and unchanged legacy frontmatter.
- **Obligation:** staged migration must not convert legacy skills without type-specific review.
- **Exercises:** Intro legacy exception; P1 non-goals.
- **Checklist IDs:** `SW-CHECK-19`.

### SW-SCENARIO-09 — Rules exceed the semantic-item limit

- **Primary type:** Boundary / edge.
- **Coverage role:** boundary, failure/recovery.
- **Given:** a draft Rules section contains ten independent normative constraints across its positive and
  negative subsections.
- **When:** the author inventories semantic rule items during P5.
- **Then:** the draft fails the limit. Rationale, defaults, steps, and lookup facts move to their owning
  sections; unrelated constraints are not merged and no condition is dropped merely to reach nine.
- **Failure oracle:** the author counts only bullets, merges unrelated constraints, or deletes behavior to
  satisfy the number.
- **Evidence:** before/after semantic-item inventory and a condition-preservation map.
- **Obligation:** the complete Rules section must contain no more than nine semantic rule items without losing
  the original capability contract.
- **Exercises:** Rules count Must-Follow item; P5 type procedures; P6.
- **Checklist IDs:** `SW-CHECK-16`, `SW-CHECK-22`.

## Family SW-SCENARIO-F4 — Operation verification bundle

**Primary category:** 4 Interfaces / dependencies / structure — four sibling files form one traced operation
contract. **Secondary:** 6 Failure / recovery / operations, 10 Evidence / traceability / clarity.

### SW-SCENARIO-10 — Complete plural bundle

- **Primary type:** Positive.
- **Coverage role:** positive.
- **Given:** a new operation `SKILL.md` is complete.
- **When:** the author runs operation child S8–S11.
- **Then:** `scenarios.md`, `checklists.md`, and `evaluation.md` are written in that order through their owning
  skills and remain direct siblings.
- **Failure oracle:** any companion is absent, nested, written before parent policy closes, or authored without
  loading its owner skill.
- **Evidence:** file existence, ordered authoring record, and sibling topology.
- **Obligation:** every operation must ship the required plural bundle after its parent SOP is complete.
- **Exercises:** operation child S7–S11.
- **Checklist IDs:** `SW-CHECK-11`, `SW-CHECK-13`, `SW-CHECK-14`, `SW-CHECK-15`.

### SW-SCENARIO-11 — Companion invents missing policy

- **Primary type:** Adversarial / abuse / gaming.
- **Coverage role:** adversarial.
- **Given:** a scenario, check, or evaluator route contains a requirement absent from `SKILL.md`.
- **When:** the four-file trace is closed.
- **Then:** the check fails; the requirement is either added to the parent through the normal design gate or
  removed from the companion.
- **Failure oracle:** a companion is accepted as an independent policy owner.
- **Evidence:** reverse trace from every scenario obligation and checklist item to a live parent clause.
- **Obligation:** cosmetic file presence cannot substitute for sole-parent policy ownership.
- **Exercises:** P6 companion reverse trace; operation child parent-ownership contract and S11.
- **Checklist IDs:** `SW-CHECK-12`, `SW-CHECK-13`, `SW-CHECK-14`, `SW-CHECK-15`.

### SW-SCENARIO-12 — Missing recovery and cosmetic SOP compliance

- **Primary type:** Adversarial / abuse / gaming.
- **Coverage role:** adversarial, failure/recovery.
- **Given:** an operation has numbered steps and all four filenames but omits failure recovery and observable
  completion.
- **When:** the evaluator runs a failing branch and a cosmetically conformant probe.
- **Then:** the operation fails despite matching headings and filenames.
- **Failure oracle:** section and file presence alone produce acceptance.
- **Evidence:** parent clause audit, failure-path scenario, binary checklist result, and Overall finding.
- **Obligation:** evaluation must grade operational substance, not labels or topology alone.
- **Exercises:** operation child S1–S5, S11.
- **Checklist IDs:** `SW-CHECK-09`, `SW-CHECK-11`, `SW-CHECK-12`.

## Family SW-SCENARIO-F5 — Ownership, deletion, and rule discipline

**Primary category:** 6 Failure / recovery / operations — authoring must stop or recover when owners or
consumers disagree. **Secondary:** 4 Interfaces / dependencies / structure, 7 Trust / harm / governance,
9 Change / compatibility / reversibility.

### SW-SCENARIO-13 — Dependent artifact owner is being removed

- **Primary type:** Counterfactual / assumption.
- **Coverage role:** counterfactual, change/regression.
- **Given:** an affected generator is currently referenced, but its owning workflow is being removed in a
  concurrent change.
- **When:** the author maps the blast radius.
- **Then:** the owner lifecycle is verified before redesign; deletion waits for the owner-removal dependency and
  live references to clear.
- **Failure oracle:** the dead generator is redesigned from its current references alone or deleted while still
  consumed.
- **Evidence:** live branch/file/reference checks and the integration precondition.
- **Obligation:** affected-file design must account for the owner's destination, not only current presence.
- **Exercises:** P3 owner mechanisms; P4 affected-file map.
- **Checklist IDs:** `SW-CHECK-03`, `SW-CHECK-04`.

### SW-SCENARIO-14 — A Rule duplicates a Principle

- **Primary type:** Adversarial / abuse / gaming.
- **Coverage role:** adversarial, change/regression.
- **Given:** a Principle and a Rule express the same semantic claim, with no additional observable boundary in
  the Rule.
- **When:** the author compares the principle and rule claim sets.
- **Then:** the duplicate is removed or rewritten so the Principle carries the durable rationale and the Rule
  adds a distinct binding pass/fail condition. Any retained condition remains traceable.
- **Failure oracle:** wording changes while the two claims remain semantically identical, or the duplicate is
  deleted together with a unique condition.
- **Evidence:** Principle-to-Rule claim map and before/after condition trace.
- **Obligation:** Rules must not duplicate Principles, and deduplication must preserve unique constraints.
- **Exercises:** Rule-quality Must-Follow item; P5 type procedures; P6.
- **Checklist IDs:** `SW-CHECK-17`, `SW-CHECK-22`.

## Family SW-SCENARIO-F6 — Verification and type-child integrity

**Primary category:** 4 Interfaces / dependencies / structure — the selected type child and the artifact guards
define exact verification boundaries. **Secondary:** 5 Quality attributes / resource economics, 6 Failure /
recovery / operations, 10 Evidence / traceability / clarity.

### SW-SCENARIO-15 — Multiple type children are loaded before synthesis

- **Primary type:** Adversarial / abuse / gaming.
- **Coverage role:** adversarial, failure/recovery.
- **Given:** P2 selected one type and recorded its direct child path.
- **When:** the author loads two or all three type children and synthesizes a final document whose headings
  happen to match the selected type.
- **Then:** the P5 run fails despite cosmetic output compliance; the draft is discarded and P5 restarts in a
  clean agent context with only the recorded child.
- **Failure oracle:** final headings or prose quality are accepted without inspecting the type-child load
  record, or a multiple-child synthesis reaches P6.
- **Evidence:** P2 classification record plus the P5 load registers from the original and restarted runs.
- **Obligation:** progressive disclosure and the anti-synthesis boundary require exactly one selected type
  child per P5 run.
- **Exercises:** Rules one-child Must-Follow item; P5 selected-child record and invalid-run recovery.
- **Checklist IDs:** `SW-CHECK-20`.

### SW-SCENARIO-16 — Nine bullets hide more than nine Rules

- **Primary type:** Adversarial / abuse / gaming.
- **Coverage role:** adversarial, failure/recovery.
- **Given:** a Rules section contains nine bullets, but one bullet combines three unrelated normative
  constraints.
- **When:** P6 verifies the artifact.
- **Then:** the semantic inventory counts eleven Rules and blocks acceptance. The author must restructure the
  content without hiding independent constraints inside compound prose.
- **Failure oracle:** a nine-bullet count is accepted without inspecting independent normative clauses.
- **Evidence:** clause-level rule inventory and the failed P6 checklist result.
- **Obligation:** the limit applies to semantic rule items rather than formatting.
- **Exercises:** Rules count Must-Follow item; P6.
- **Checklist IDs:** `SW-CHECK-16`.

### SW-SCENARIO-17 — An artifact guard fails

- **Primary type:** Failure / recovery.
- **Coverage role:** failure/recovery.
- **Given:** the skill passes its semantic writing checks, but a structural, link, reference, compatibility, or
  retired-vocabulary guard fails.
- **When:** P6 verifies the artifact.
- **Then:** acceptance blocks and returns to the owning P-step with the exact failed guard.
- **Failure oracle:** a semantically plausible skill is accepted despite a failed artifact guard.
- **Evidence:** exact guard output and its owning clause.
- **Obligation:** every applicable artifact guard must pass before the skill is accepted.
- **Exercises:** P6.
- **Checklist IDs:** `SW-CHECK-21`.

### SW-SCENARIO-18 — References links outside the skill

- **Primary type:** Boundary / edge.
- **Coverage role:** boundary, adversarial, change/regression.
- **Given:** a skill's References section links one local child document, a sibling skill, a repository
  document, a script, and a web source.
- **When:** the author resolves every target against the directory containing the target `SKILL.md`.
- **Then:** only the Markdown child document remains in References. Outside owners move beside the claims they
  validate. If no child document or child-skill entrypoint remains, the required heading stays empty.
- **Failure oracle:** an authoritative or useful target is accepted merely because it resolves, a parent path
  or URL escapes the skill directory, an internal non-document file is accepted, or the empty heading is
  removed.
- **Evidence:** extracted References links, normalized targets, target file types, and the inline owner-citation
  audit.
- **Obligation:** References is local navigation for child documents and child skills, never an outside-owner
  or related-reading list.
- **Exercises:** References-locality Must-Follow rule; P4; selected type child's References step; P6.
- **Checklist IDs:** `SW-CHECK-23`.

## Family SW-SCENARIO-F7 — Orientation, construction, and language

**Primary category:** 10 Evidence / traceability / clarity — a cold reader must recover when to load the skill,
what it is, and how its force is expressed. **Secondary:** 3 Behavior / state / data, 4 Interfaces /
dependencies / structure, 5 Quality attributes / resource economics.

### SW-SCENARIO-19 — Description and Intro obscure the load contract

- **Primary type:** Boundary / edge.
- **Coverage role:** boundary, change/regression.
- **Given:** a substantively revised skill whose description begins `Use when`, uses a sentence fragment,
  lists features without naming its type or capability, or whose Intro merely repeats the description or adds
  policy absent from the body.
- **When:** the orientation surfaces are compared with the completed skill.
- **Then:** the description begins `MUST load`, states the exact load condition, and identifies what the skill
  is. The Intro expands that description with the actor, boundary, outcome or judgment, and content model
  supported by the finished body.
- **Failure oracle:** an optional-sounding load phrase, topic label, feature list, duplicated one-line Intro, or
  Intro-only contract is accepted.
- **Evidence:** frontmatter parse and a description-to-Intro-to-body claim map.
- **Obligation:** orientation must make loading and identity unambiguous without becoming a second policy
  owner.
- **Exercises:** P1; P5; selected type child's Frontmatter and Intro step.
- **Checklist IDs:** `SW-CHECK-24`.

### SW-SCENARIO-20 — Polished prose precedes the skill skeleton

- **Primary type:** Adversarial / abuse / gaming.
- **Coverage role:** adversarial, failure/recovery.
- **Given:** an author drafts complete paragraphs, then retrofits frontmatter, headings, children, and
  companions around them.
- **When:** the P4 skill wireframe and P5 authoring record are inspected.
- **Then:** the run fails and restarts from a top-down skill wireframe plus a complete frontmatter, heading,
  direct-child, and applicable operation-sibling skeleton. Substantive units are then built upward, and
  orientation is finished from the real body.
- **Failure oracle:** a cosmetically correct final heading tree is accepted without evidence that the skeleton
  preceded substantive prose.
- **Evidence:** skill wireframe, initial skeleton, authoring sequence, and final reconciliation record.
- **Obligation:** the wireframe and skeleton must expose the design before prose can conceal its weaknesses.
- **Exercises:** skeleton Must-Follow Rule; P4–P5; selected type child's skeleton step.
- **Checklist IDs:** `SW-CHECK-25`.

### SW-SCENARIO-21 — Mandatory guidance and language require interpretation

- **Primary type:** Adversarial / abuse / gaming.
- **Coverage role:** adversarial, change/regression.
- **Given:** an artifact-level pass/fail invariant appears only in Intro, Principles, Preferences, Manual, or
  Procedure; its force is implied by tone; and the document uses crowded sentences, unexplained
  abbreviations, or shifting names for the same concept.
- **When:** a cold reader and the semantic Rules inventory interpret the skill.
- **Then:** every artifact-level mandatory boundary appears as a Rule with a bold normative lead, while
  rationale, defaults, lookup content, and ordered actions remain in their sections. The whole document uses
  stable, literal, type-appropriate language.
- **Failure oracle:** a reviewer must infer whether a statement is binding, expand private shorthand, split
  several claims mentally, or guess whether two terms mean the same thing.
- **Evidence:** section-ownership inventory and a sentence-level language pass.
- **Obligation:** force and meaning must be visible in the document rather than reconstructed from style or
  author context.
- **Exercises:** Rule-quality and language Must-Follow Rules; selected type child's language pass.
- **Checklist IDs:** `SW-CHECK-18`, `SW-CHECK-26`.

### SW-SCENARIO-22 — A discovery or runtime view is edited as the source

- **Primary type:** Failure / recovery.
- **Coverage role:** failure/recovery, change/regression.
- **Given:** the repository exposes a generated, discovery, plugin, or runtime view of the target skill.
- **When:** the author prepares the affected-file map and change set.
- **Then:** authored changes stay in the canonical project skill directory and the other surfaces remain
  read-only propagation evidence.
- **Failure oracle:** a mirror is hand-edited to make a check pass while the canonical owner remains stale.
- **Evidence:** affected-file map, owner mechanism, and merge-base diff by surface class.
- **Obligation:** the canonical owner must remain the only authored source.
- **Exercises:** P4 canonical-editing clause.
- **Checklist IDs:** `SW-CHECK-27`.

## Family SW-SCENARIO-F8 — Type-child SOP structure

**Primary category:** 4 Interfaces / dependencies / structure — each type child is itself an authoring SOP
while producing a target with a different type-owned shape. **Secondary:** 5 Quality attributes / resource
economics, 10 Evidence / traceability / clarity.

### SW-SCENARIO-23 — A type child is not shaped as an authoring SOP

- **Primary type:** Change / regression / compat.
- **Coverage role:** change/regression, boundary.
- **Given:** one type child still uses peer Boundary, Required shape, or Completion checks sections, lacks
  Principles or Rules, or presents its target shape as though it were the child document's own shape.
- **When:** the three direct type-child heading trees and semantics are inspected.
- **Then:** the child fails until it uses Intro → Principles → Rules → Procedure → References, keeps Procedure
  dominant, expresses type-specific invariants in no more than nine valid Rules, and clearly distinguishes the
  authoring SOP from the target artifact it produces.
- **Failure oracle:** an instruction list is accepted as an operation-shaped child merely because it contains
  numbered steps, or the child receives skill frontmatter and an independent companion bundle despite
  remaining a parent-owned direct document.
- **Evidence:** heading trees, semantic Rule inventories, Intro ownership statements, and target-shape traces
  for all three type children.
- **Obligation:** every type child must be an operation-shaped direct SOP without becoming a separately loaded
  nested skill.
- **Exercises:** P5 child-SOP contract; all three child Intros, Principles, Rules, Procedures, and References.
- **Checklist IDs:** `SW-CHECK-28`.

## Guaranteed coverage map

Every scenario obligation maps to at least one checklist item, and every checklist item is activated by at
least one scenario. The authoritative item-to-scenario reverse map is in `checklists.md`; this source supplies
the scenario-to-item direction through each case's Checklist IDs.
