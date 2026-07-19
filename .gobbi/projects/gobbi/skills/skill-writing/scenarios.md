# Skill Writing — Scenario Source

Scenario source for testing whether the skill-writing operation produces the right semantic type, correct body
shape, complete operation evidence, and usable runtime wiring. Load for a pre-handoff self-check or through
`evaluation.md` during independent review. Every case exercises a parent clause and names checklist IDs from
`checklists.md`; this file introduces no skill-writing policy.

## Coverage register

| Category | Disposition | Coverage |
|---|---|---|
| 1 Purpose / outcomes / scope | selected | Classification follows the capability and preserves one coherent outcome. |
| 2 Actors / stakeholders / use-context | selected | Cold-loading authors, evaluators, and fresh runtime consumers are exercised. |
| 3 Behavior / state / data | selected | Frontmatter, section shape, operation bundle, and reclassification transitions are exercised. |
| 4 Interfaces / dependencies / structure | selected | Parent/child ownership, companion traceability, mirrors, and runtime entrypoints are exercised. |
| 5 Quality attributes / resource economics | selected | One-child progressive disclosure prevents unnecessary type-manual context from entering a P5 run. |
| 6 Failure / recovery / operations | selected | Wrong classification, missing companions, stale owners, failed guards, and failed cold loads are exercised. |
| 7 Trust / harm / governance | selected | Permission scope, unverified commands, and unauthorized state changes are exercised. |
| 8 Inclusion / locale | `n/a: the skill emits repository markdown with no locale-dependent interaction` | — |
| 9 Change / compatibility / reversibility | selected | Legacy untyped skills, substantive revision, deletion dependencies, and two-runtime compatibility are exercised. |
| 10 Evidence / traceability / clarity | selected | Claim owners, scenario/check mappings, binary evidence, and fresh-agent proof are exercised. |

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
  References, with no Procedure or Manual.
- **Failure oracle:** the author treats `MUST` as proof of operation type, adds a token Procedure, or forces
  every preference into one rigid entry schema.
- **Evidence:** frontmatter and heading inspection plus a normal/exception/conflict judgment probe.
- **Obligation:** the design must classify by capability rather than statement force and keep the preference
  shape non-procedural.
- **Exercises:** P2 classifier; preference child Boundary, S4–S7.
- **Checklist IDs:** `SW-CHECK-02`, `SW-CHECK-05`, `SW-CHECK-06`, `SW-CHECK-07`.

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
- **Exercises:** P2 classifier; tool child Boundary, S5–S7.
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
- **Exercises:** P2 classifier; operation child Boundary, S4–S6.
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
- **Exercises:** P5 reclassification rule; preference child S7.
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
- **Exercises:** P5 reclassification rule; tool child S5–S7; operation child S6.
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
- **Exercises:** Rules Must-Not-Follow classification rule; P2.
- **Checklist IDs:** `SW-CHECK-01`, `SW-CHECK-02`.

## Family SW-SCENARIO-F3 — Frontmatter and runtime compatibility

**Primary category:** 9 Change / compatibility / reversibility — the field is a staged schema change across
legacy and two runtime consumers. **Secondary:** 3 Behavior / state / data, 4 Interfaces / dependencies /
structure, 10 Evidence / traceability / clarity.

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
- **Exercises:** P2 schema and optional allowlist; Rules first two Must-Follow items.
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

### SW-SCENARIO-09 — One runtime rejects the Gobbi extension

- **Primary type:** Failure / recovery.
- **Coverage role:** failure/recovery.
- **Given:** the canonical skill passes markdown checks but one target runtime rejects top-level `skill-type`.
- **When:** P7 cold loading runs.
- **Then:** completion blocks and returns to a user design decision; the implementer does not silently move the
  field, suppress the failure, or declare single-runtime success.
- **Failure oracle:** structural success is treated as runtime compatibility.
- **Evidence:** fresh cold-load transcript from each target runtime.
- **Obligation:** the extension must be proven in every target runtime and fail closed on incompatibility.
- **Exercises:** P7; final Must-Follow rule.
- **Checklist IDs:** `SW-CHECK-17`, `SW-CHECK-18`.

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
- **Exercises:** Rules no-new-policy prohibition; operation child S11.
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

## Family SW-SCENARIO-F5 — Ownership, deletion, and cold use

**Primary category:** 6 Failure / recovery / operations — authoring must stop or recover when owners, mirrors,
or consumers disagree. **Secondary:** 4 Interfaces / dependencies / structure, 7 Trust / harm / governance,
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

### SW-SCENARIO-14 — Structural guards pass but the fresh agent cannot use the skill

- **Primary type:** Failure / recovery.
- **Coverage role:** failure/recovery.
- **Given:** links, frontmatter, and mirrors pass their mechanical checks.
- **When:** a fresh agent loads the skill through the normal runtime entrypoint.
- **Then:** it must classify and author the intended capability without hidden session context; otherwise P7
  fails and returns to the owning authoring step.
- **Failure oracle:** mechanical green is accepted as proof of usable behavior.
- **Evidence:** per-runtime cold-load and fresh-agent transcripts.
- **Obligation:** structural checks and behavioral proof must both pass.
- **Exercises:** P6–P7.
- **Checklist IDs:** `SW-CHECK-16`, `SW-CHECK-17`, `SW-CHECK-18`.

## Family SW-SCENARIO-F6 — Type-child dispatch integrity

**Primary category:** 4 Interfaces / dependencies / structure — the selected type child is the only detailed
writing contract a P5 run may consume. **Secondary:** 5 Quality attributes / resource economics, 6 Failure /
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
- **Evidence:** P2 classification record, type-child read/load transcript, and the restarted P5 context's load
  record.
- **Obligation:** progressive disclosure and the anti-synthesis boundary require exactly one selected type
  child per P5 run.
- **Exercises:** Rules one-child Must-Follow item; P5 selected-child record and invalid-run recovery.
- **Checklist IDs:** `SW-CHECK-20`.

## Guaranteed coverage map

Every scenario obligation maps to at least one checklist item, and every checklist item is activated by at
least one scenario. The authoritative item-to-scenario reverse map is in `checklists.md`; this source supplies
the scenario-to-item direction through each case's Checklist IDs.
