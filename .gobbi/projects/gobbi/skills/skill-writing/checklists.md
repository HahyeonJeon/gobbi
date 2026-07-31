# Skill Writing — Operational Checklist

Unchecked source for running and evaluating the skill-writing operation. Each run works a fresh filled copy;
never mark this source. Mode: **operational**. Default use style at every pause point: **do-confirm**.

Coverage closure means every applicable item has a terminal resolution. Acceptance requires every applicable
gate and required item to be `PASS`; a recorded owner, deferral, or failed item does not pass the operation.

## Resolution legend

- `PASS` — the pass condition was verified from the named evidence.
- `FAIL:<finding-id>` — the pass condition was verified false and the finding is cited.
- `n/a:<property>` — inspected evidence proves the applicability predicate false.
- `recorded-open:<owner+resolution-method>` — operational coverage is closed but acceptance is not granted.

## Pause point A — Frame, classify, and map

- [ ] **SW-CHECK-01 [GATE, do-confirm] — One capability is framed.**
  - Applicability: unconditional.
  - Pass: actor, load trigger, outcome or judgment, and non-goals describe one coherent capability.
  - Evidence: P1 frame and intended-consumer record.
  - On fail: stop drafting and return to P1.
  - Source: `SKILL.md` P1; `SW-SCENARIO-06`.
- [ ] **SW-CHECK-02 [GATE, do-confirm] — The first matching classifier branch selected the type.**
  - Applicability: unconditional.
  - Pass: operation was tested first, then named tool, then preference; selected and rejected branches are
    recorded from capability evidence rather than topic words.
  - Evidence: classification record plus target outcome and proposed headings.
  - On fail: stop and return to P2.
  - Source: `SKILL.md` P2; `SW-SCENARIO-01`–`06`.
- [ ] **SW-CHECK-03 [REQUIRED, do-confirm] — Evidence and owner mechanisms were read.**
  - Applicability: unconditional.
  - Pass: same-type examples, consumers, applicable mistakes, external practice, and every owner mechanism
    behind a taught claim were inspected or marked not applicable with evidence; every mechanism claim and
    taught example was verified against its owner or live surface.
  - Evidence: research/read register, claim-owner ledger, and exact example-verification results.
  - On fail: return to P3.
  - Source: `SKILL.md` P3; `SW-SCENARIO-13`.
- [ ] **SW-CHECK-04 [GATE, do-confirm] — The affected-file map covers lifecycle and propagation.**
  - Applicability: unconditional.
  - Pass: exhaustive searches cover authored, generated, conditional, read-only, moved, and deleted surfaces;
    concurrent owner changes and live consumers are resolved before design; index placement and tool-permission
    surfaces are included only when their owners require a deliberate change.
  - Evidence: search manifest, CRUD/5W1H map, and live owner checks.
  - On fail: stop edits and return to P4.
  - Source: `SKILL.md` P4; `SW-SCENARIO-13`.
- [ ] **SW-CHECK-27 [GATE, do-confirm] — Authored changes stay in the canonical skill directory.**
  - Applicability: the target has a generated, discovery, plugin, or runtime view.
  - Pass: the affected-file map names the canonical project skill directory as the sole authored source, the
    merge-base diff contains no hand-written mirror change, and every other view remains read-only evidence.
  - Evidence: owner mechanism, affected-file map, and merge-base diff grouped by surface class.
  - On fail: restore the non-canonical surface and return to P4.
  - Source: `SKILL.md` P4; `SW-SCENARIO-22`.
- [ ] **SW-CHECK-19 [REQUIRED, do-confirm] — Staged migration stays within scope.**
  - Applicability: a repository containing untyped legacy skills.
  - Pass: only new or substantively revised skills are typed; narrow compatibility edits remain narrow; no
    inferred mass migration or false repository-wide completeness claim appears.
  - Evidence: merge-base diff and legacy-frontmatter inventory.
  - On fail: remove out-of-scope migrations and return them to a later type-specific plan.
  - Source: `SKILL.md` Intro; `SW-SCENARIO-08`.

## Pause point B — Write the selected type

- [ ] **SW-CHECK-05 [GATE, do-confirm] — Frontmatter has the required ordered schema.**
  - Applicability: new or substantively revised skill.
  - Pass: keys begin `name`, `description`, `allowed-tools`, `skill-type`; the name matches the directory; the
    type is `preference`, `tool`, or `operation`; invocation-default skills omit both invocation flags; every
    optional key is on P2's allowlist and carries the required non-default value or a stated, verified need;
    no foreign schema or workflow provenance key appears.
  - Evidence: parsed frontmatter, key-order and allowlist inspection, plus the stated-reason record for each
    optional key.
  - On fail: return to P2 and the selected child.
  - Source: `SKILL.md` P2; `SW-SCENARIO-01`–`03`, `07`.
- [ ] **SW-CHECK-24 [GATE, do-confirm] — Description and Intro expose one aligned orientation contract.**
  - Applicability: every new or substantively revised skill.
  - Pass: the description begins `MUST load`, states the exact load condition, and identifies the skill by
    capability and type in a complete sentence; the Intro expands it from the completed body with the actor,
    boundary, outcome or judgment, and content model without becoming a second policy owner.
  - Evidence: parsed description and a description-to-Intro-to-body claim map.
  - On fail: return to P1 and the selected type child's Frontmatter and Intro step.
  - Source: `SKILL.md` P1 and P5; `SW-SCENARIO-19`.
- [ ] **SW-CHECK-25 [GATE, do-confirm] — The skill was designed top-down with a wireframe and built bottom-up from its skeleton.**
  - Applicability: every P5 run.
  - Pass: P4 maps the whole capability top-down into a skill wireframe of type, section roles, children, and
    claim slots; the first P5 writing artifact translates it into the complete frontmatter, heading,
    direct-child, and applicable operation-sibling skeleton with no substantive prose; later content grows
    bottom-up from owned units into sections, and the final orientation is reconciled from the body.
  - Evidence: skill wireframe, initial P5 skeleton, authoring sequence, and final reconciliation record.
  - On fail: discard the prose-first draft and restart P5 from the selected type child's skeleton step.
  - Source: `SKILL.md` skeleton Rule and P4–P5; `SW-SCENARIO-20`.
- [ ] **SW-CHECK-06 [GATE, do-confirm] — The body has exactly the selected type's section contract.**
  - Applicability: unconditional.
  - Pass: preference has Principles → Rules → Preferences with no Procedure/Manual; tool has Manual and no
    Procedure; operation has Procedure and no peer Manual; the type's defining content is actually dominant.
  - Evidence: heading tree and semantic content inspection.
  - On fail: return to P2 or P5; reclassify when the capability changed.
  - Source: `SKILL.md` P5; `SW-SCENARIO-01`–`05`.
- [ ] **SW-CHECK-07 [REQUIRED, do-confirm] — Preference guidance communicates force without rigid padding.**
  - Applicability: `skill-type: preference`.
  - Pass: Principles teach judgment; Rules contain only binding constraints; required Preferences contains at
    least one real default whose applicability and exception evidence are clear; Rules override Preferences;
    normal, exception, Rule-precedence, Preference-conflict, and cosmetic-compliance probes are decidable; no
    per-entry boilerplate is forced.
  - Evidence: preference child Rules audit and S9 probe results.
  - On fail: return to preference child S4–S9.
  - Source: `preference-skill.md`; `SW-SCENARIO-01`.
- [ ] **SW-CHECK-08 [REQUIRED, do-confirm] — Tool Manual is authoritative, scoped, and verified.**
  - Applicability: `skill-type: tool`.
  - Pass: one named tool is covered; only applicable Manual subsections exist; examples, outputs, failures, and
    version facts are verified; no broader normative workflow is hidden in Manual.
  - Evidence: owner/live-tool register and lookup probe results.
  - On fail: return to tool child S1–S9 or reclassify as operation.
  - Source: `tool-skill.md`; `SW-SCENARIO-02`, `05`.
- [ ] **SW-CHECK-09 [GATE, do-confirm] — Operation Procedure owns the complete executable outcome.**
  - Applicability: `skill-type: operation`.
  - Pass: actor, trigger, preconditions, inputs, outputs, order, branches, failure, recovery, evidence, and
    completion are explicit and followable.
  - Evidence: parent Procedure trace plus passing/failing/boundary/recovery probes.
  - On fail: return to operation child S1–S5.
  - Source: `operation-skill.md`; `SW-SCENARIO-03`, `12`.
- [ ] **SW-CHECK-10 [REQUIRED, do-confirm] — Supporting preferences and tool facts remain subordinate.**
  - Applicability: `skill-type: operation` with preference or named-tool content.
  - Pass: preferences stay in Principles/Rules, tool facts are step-local, larger manuals are routed, and no
    top-level Manual competes with Procedure.
  - Evidence: heading tree and content-owner audit.
  - On fail: return to operation child S4–S6.
  - Source: `operation-skill.md`; `SW-SCENARIO-03`, `05`.
- [ ] **SW-CHECK-20 [GATE, do-confirm] — Exactly one selected type child was loaded.**
  - Applicability: every P5 run.
  - Pass: the P2 record names one direct type child and the P5 load register contains that child and no other
    type child.
  - Evidence: P2 classification record and P5 load register from the accepted run.
  - On fail: stop acceptance, discard the P5 draft, and restart P5 in a clean author context with only the
    selected child.
  - Source: `SKILL.md` P5; `SW-SCENARIO-15`.
- [ ] **SW-CHECK-28 [GATE, do-confirm] — Every type child is an operation-shaped direct SOP.**
  - Applicability: unconditional.
  - Pass: `preference-skill.md`, `tool-skill.md`, and `operation-skill.md` each use Intro → Principles → Rules
    → Procedure → References, keep Procedure dominant, contain at most nine valid and non-duplicative Rules,
    and distinguish their authoring SOP from the target artifact. None has skill frontmatter, its own
    verification bundle, or peer Boundary, Required shape, or Completion checks sections.
  - Evidence: three heading trees, semantic Rule inventories, Intro ownership statements, and target-shape
    traces.
  - On fail: return to P5 and reshape the affected direct child without changing its target type contract.
  - Source: `SKILL.md` P5; all three type children; `SW-SCENARIO-23`.
- [ ] **SW-CHECK-16 [GATE, do-confirm] — Rules stay within the semantic-item limit.**
  - Applicability: unconditional.
  - Pass: a semantic inventory counts at most nine rule items across the complete Rules section; clauses that
    jointly define one indivisible pass/fail contract count once, while unrelated constraints in one bullet
    count separately.
  - Evidence: annotated Rules inventory with the total and each counted constraint.
  - On fail: return to the selected type procedure and restructure the Rules without hiding constraints.
  - Source: `SKILL.md` Rules; `SW-SCENARIO-09`, `16`.
- [ ] **SW-CHECK-17 [GATE, do-confirm] — Rules do not duplicate Principles.**
  - Applicability: unconditional.
  - Pass: no Rule repeats a Principle's semantic claim; when both address one topic, the Rule adds a distinct,
    observable pass/fail boundary.
  - Evidence: Principle-to-Rule claim map with every apparent overlap dispositioned.
  - On fail: return to the selected type procedure and separate durable rationale from the binding boundary.
  - Source: `SKILL.md` Rules; `SW-SCENARIO-14`.
- [ ] **SW-CHECK-18 [REQUIRED, do-confirm] — Every Rule is a valid rule.**
  - Applicability: unconditional.
  - Pass: every Rules item begins with a bold `MUST`, `MUST NOT`, `ALWAYS`, or `NEVER` lead and is binding,
    self-contained, and testable; no artifact-level mandatory boundary relies on Intro, Principles,
    Preferences, Manual, or Procedure alone; rationale, defaults, ordered work, and lookup facts remain in
    their owning sections.
  - Evidence: semantic Rules inventory, normative-lead inspection, and section-ownership classification.
  - On fail: return to the selected type procedure and relocate or rewrite the invalid item.
  - Source: `SKILL.md` Rules; `SW-SCENARIO-01`, `21`.
- [ ] **SW-CHECK-26 [REQUIRED, do-confirm] — Language is plain, literal, stable, and type-appropriate.**
  - Applicability: unconditional.
  - Pass: one stable term names each concept, unfamiliar abbreviations expand at first use, each sentence has
    one main claim, actors and conditions are explicit, normative verbs match their force, and no vague
    synonym, implied context, filler, or ornamental expression carries meaning.
  - Evidence: cold-reader pass plus a sentence-level terminology, abbreviation, force, and expression audit.
  - On fail: return to P5 and the selected type child's language pass.
  - Source: `SKILL.md` language Rule and P5; `SW-SCENARIO-21`.
- [ ] **SW-CHECK-22 [GATE, do-confirm] — Rule reduction preserves the capability contract.**
  - Applicability: a draft exceeded the limit, duplicated a Principle, or hid multiple constraints in one item.
  - Pass: every original subject, condition, exception, hazard, and recovery boundary maps to a retained Rule
    or its correct owning section; unrelated constraints were not merged and no condition was deleted merely
    to reduce the count. Any change in force is explicit and justified by the destination section's semantics.
  - Evidence: before/after semantic-union map.
  - On fail: restore the lost condition and return to P4 or P5.
  - Source: `SKILL.md` P4–P6; `SW-SCENARIO-09`, `14`.
- [ ] **SW-CHECK-23 [GATE, do-confirm] — The References section stays inside the skill.**
  - Applicability: every new or substantively revised skill.
  - Pass: the required References heading exists; every link resolves to a Markdown child document or
    child-skill entrypoint beneath the directory containing the target `SKILL.md`; no sibling skill, parent or
    project document, script, data file, URL, self-link, or other outside target appears. Outside owners are
    cited beside their claims, and a skill with no allowed child material has an empty References placeholder.
  - Evidence: extracted References section, normalized target paths, target file types, and inline
    claim-owner audit.
  - On fail: return to P4 and the selected type child's References step.
  - Source: `SKILL.md` References-locality Rule and P4–P6; selected type child's References step;
    `SW-SCENARIO-18`.

## Pause point C — Verify the artifact and close the operation bundle

- [ ] **SW-CHECK-21 [GATE, do-confirm] — Artifact guards pass.**
  - Applicability: unconditional.
  - Pass: structural, link, reference, compatibility, and retired-vocabulary guards all pass.
  - Evidence: exact guard output.
  - On fail: return to the owning P-step and do not accept the artifact.
  - Source: `SKILL.md` P6; `SW-SCENARIO-17`.
- [ ] **SW-CHECK-11 [GATE, do-confirm] — Every operation has the complete plural bundle.**
  - Applicability: `skill-type: operation`.
  - Pass: direct siblings `scenarios.md`, `checklists.md`, and `evaluation.md` exist and were authored after
    `SKILL.md` in scenario → checklist → evaluation order through their owning skills.
  - Evidence: file topology, load record, and authoring sequence.
  - On fail: stop handoff and return to operation child S8–S10.
  - Source: `operation-skill.md` S8–S10; `SW-SCENARIO-10`, `12`.
- [ ] **SW-CHECK-12 [GATE, do-confirm] — The parent is the sole policy owner.**
  - Applicability: `skill-type: operation`.
  - Pass: every scenario obligation, checklist claim, and evaluator rule resolves to a live parent clause; no
    companion introduces policy absent from `SKILL.md`.
  - Evidence: reverse trace and literal clause check.
  - On fail: revise the parent through the design gate or remove the unsupported companion claim.
  - Source: `operation-skill.md` S7, S11; `SW-SCENARIO-11`, `12`.
- [ ] **SW-CHECK-13 [REQUIRED, do-confirm] — Scenarios cover applicable success and stress classes.**
  - Applicability: `skill-type: operation`.
  - Pass: the coverage register is fully dispositioned, triggered minima have cases, each case is observable and
    fail-able, and every obligation maps to a parent clause and checklist ID.
  - Evidence: scenario coverage register, source sweep, and obligation map.
  - On fail: return to operation child S8.
  - Source: `operation-skill.md` S8, S11; `SW-SCENARIO-10`, `11`.
- [ ] **SW-CHECK-14 [REQUIRED, do-confirm] — Checklist items are atomic, evidenced, and scenario-traced.**
  - Applicability: `skill-type: operation`.
  - Pass: source is unchecked; mode/use style are declared; each applicable obligation has an atomic item with
    stable ID, pass condition, evidence, and on-fail route; acceptance and coverage closure are separate.
  - Evidence: checklist source, pilot filled copies, and two-way ID map.
  - On fail: return to operation child S9.
  - Source: `operation-skill.md` S9, S11; `SW-SCENARIO-10`, `11`.
- [ ] **SW-CHECK-15 [REQUIRED, do-confirm] — Evaluation selects the bundle without redefining the report.**
  - Applicability: `skill-type: operation`.
  - Pass: evaluator entrypoint loads both siblings, selects applicable cases/checks, supplies lenses and tool
    verification, and contributes them to one independent evaluation result with seven perspectives, Overall,
    separate problem and optional-improvement ledgers, verified strengths, and a completed checklist with
    applicable tests without imposing a workflow format.
  - Evidence: evaluation route trace, a trial selection, and the complete evaluation result.
  - On fail: return to operation child S10.
  - Source: `operation-skill.md` S10–S11; `SW-SCENARIO-10`, `11`.

## Guaranteed coverage map

| Check | Scenario source |
|---|---|
| `SW-CHECK-01` | `SW-SCENARIO-06` |
| `SW-CHECK-02` | `SW-SCENARIO-01`, `SW-SCENARIO-02`, `SW-SCENARIO-03`, `SW-SCENARIO-04`, `SW-SCENARIO-05`, `SW-SCENARIO-06` |
| `SW-CHECK-03` | `SW-SCENARIO-13` |
| `SW-CHECK-04` | `SW-SCENARIO-13` |
| `SW-CHECK-05` | `SW-SCENARIO-01`, `SW-SCENARIO-02`, `SW-SCENARIO-03`, `SW-SCENARIO-07` |
| `SW-CHECK-06` | `SW-SCENARIO-01`, `SW-SCENARIO-02`, `SW-SCENARIO-03`, `SW-SCENARIO-04`, `SW-SCENARIO-05` |
| `SW-CHECK-07` | `SW-SCENARIO-01` |
| `SW-CHECK-08` | `SW-SCENARIO-02`, `SW-SCENARIO-05` |
| `SW-CHECK-09` | `SW-SCENARIO-03`, `SW-SCENARIO-12` |
| `SW-CHECK-10` | `SW-SCENARIO-03`, `SW-SCENARIO-05` |
| `SW-CHECK-11` | `SW-SCENARIO-10`, `SW-SCENARIO-12` |
| `SW-CHECK-12` | `SW-SCENARIO-11`, `SW-SCENARIO-12` |
| `SW-CHECK-13` | `SW-SCENARIO-10`, `SW-SCENARIO-11` |
| `SW-CHECK-14` | `SW-SCENARIO-10`, `SW-SCENARIO-11` |
| `SW-CHECK-15` | `SW-SCENARIO-10`, `SW-SCENARIO-11` |
| `SW-CHECK-16` | `SW-SCENARIO-09`, `SW-SCENARIO-16` |
| `SW-CHECK-17` | `SW-SCENARIO-14` |
| `SW-CHECK-18` | `SW-SCENARIO-01` |
| `SW-CHECK-19` | `SW-SCENARIO-08` |
| `SW-CHECK-20` | `SW-SCENARIO-15` |
| `SW-CHECK-21` | `SW-SCENARIO-17` |
| `SW-CHECK-22` | `SW-SCENARIO-09`, `SW-SCENARIO-14` |
| `SW-CHECK-23` | `SW-SCENARIO-18` |
| `SW-CHECK-24` | `SW-SCENARIO-19` |
| `SW-CHECK-25` | `SW-SCENARIO-20` |
| `SW-CHECK-26` | `SW-SCENARIO-21` |
| `SW-CHECK-27` | `SW-SCENARIO-22` |
| `SW-CHECK-28` | `SW-SCENARIO-23` |
