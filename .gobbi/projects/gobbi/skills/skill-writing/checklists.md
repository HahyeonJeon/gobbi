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
    behind a taught claim were inspected or marked not applicable with evidence.
  - Evidence: research/read register and claim-owner ledger.
  - On fail: return to P3.
  - Source: `SKILL.md` P3; `SW-SCENARIO-13`.
- [ ] **SW-CHECK-04 [GATE, do-confirm] — The affected-file map covers lifecycle and propagation.**
  - Applicability: unconditional.
  - Pass: exhaustive searches cover authored, generated, conditional, read-only, moved, and deleted surfaces;
    concurrent owner changes and live consumers are resolved before design.
  - Evidence: search manifest, CRUD/5W1H map, and live owner checks.
  - On fail: stop edits and return to P4.
  - Source: `SKILL.md` P4; `SW-SCENARIO-13`.

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
- [ ] **SW-CHECK-06 [GATE, do-confirm] — The body has exactly the selected type's section contract.**
  - Applicability: unconditional.
  - Pass: preference has no Procedure/Manual; tool has Manual and no Procedure; operation has Procedure and no
    peer Manual; the type's dominant content is actually dominant.
  - Evidence: heading tree and semantic content inspection.
  - On fail: return to P2 or P5; reclassify when the capability changed.
  - Source: `SKILL.md` P5; `SW-SCENARIO-01`–`05`.
- [ ] **SW-CHECK-07 [REQUIRED, do-confirm] — Preference guidance communicates force without rigid padding.**
  - Applicability: `skill-type: preference`.
  - Pass: Principles teach judgment; Rules distinguish binding constraints from contextual defaults; normal,
    exception, conflict, and cosmetic-compliance probes are decidable; no per-entry boilerplate is forced.
  - Evidence: filled preference child completion checks and probe results.
  - On fail: return to preference child S4–S7.
  - Source: `preference-skill.md`; `SW-SCENARIO-01`.
- [ ] **SW-CHECK-08 [REQUIRED, do-confirm] — Tool Manual is authoritative, scoped, and verified.**
  - Applicability: `skill-type: tool`.
  - Pass: one named tool is covered; only applicable Manual subsections exist; examples, outputs, failures, and
    version facts are verified; no broader normative workflow is hidden in Manual.
  - Evidence: owner/live-tool register and lookup probe results.
  - On fail: return to tool child S1–S7 or reclassify as operation.
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
  - Pass: the P2 record names one direct type child; the P7 `cold-load-result` names the same
    `selected_type_child`; `loaded_type_children` contains only that child; and
    `no_extra_type_child_proof` proves one loaded child with no unexpected child.
  - Evidence: P2 classification record and the P7 `cold-load-result`.
  - On fail: stop acceptance, discard the P5 draft, and restart P5 in a clean agent context with only the
    selected child.
  - Source: `SKILL.md` P5; `SW-SCENARIO-15`.

## Pause point C — Close the operation bundle

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
    a causal finding ledger, and a completed checklist without imposing a workflow format.
  - Evidence: evaluation route trace, a trial selection, and the complete evaluation result.
  - On fail: return to operation child S10.
  - Source: `operation-skill.md` S10–S11; `SW-SCENARIO-10`, `11`.

## Pause point D — Wire and prove cold use

- [ ] **SW-CHECK-16 [REQUIRED, do-confirm] — Canonical wiring and structural guards pass.**
  - Applicability: unconditional.
  - Pass: only canonical files were authored; project sync/check mechanisms pass; links, mirrors, compatibility,
    and retired vocabulary are clean; runtime mirrors retain their owned topology.
  - Evidence: fresh command output and mirror-path inspection.
  - On fail: return to P4 or P7; never patch a generated mirror.
  - Source: `SKILL.md` P7; `SW-SCENARIO-14`.
- [ ] **SW-CHECK-17 [GATE, do-confirm] — Every target runtime cold-loads the typed skill.**
  - Applicability: unconditional for each declared target runtime.
  - Pass: a clean runtime finds and loads the skill, including top-level `skill-type`, through its normal entry.
  - Evidence: each runtime's P7 `cold-load-result`, including the runtime-loading check and its evidence.
  - On fail: block completion and return the compatibility decision to the user.
  - Source: `SKILL.md` P7; `SW-SCENARIO-09`, `14`.
- [ ] **SW-CHECK-18 [GATE, do-confirm] — A fresh agent performs the capability from normal load context.**
  - Applicability: unconditional for each declared target runtime.
  - Pass: the agent selects the correct type, follows the selected child, and produces or evaluates the expected
    artifact without author-session context.
  - Evidence: each runtime's P7 `cold-load-result`, including its `fixture`, `output`, and completed `checks`.
  - On fail: return to the authoring step that withheld required context.
  - Source: `SKILL.md` P6–P7; `SW-SCENARIO-09`, `14`.
- [ ] **SW-CHECK-19 [REQUIRED, do-confirm] — Staged migration stays within scope.**
  - Applicability: a repository containing untyped legacy skills.
  - Pass: only new or substantively revised skills are typed; narrow compatibility edits remain narrow; no
    inferred mass migration or false repository-wide completeness claim appears.
  - Evidence: merge-base diff and legacy-frontmatter inventory.
  - On fail: remove out-of-scope migrations and return them to a later type-specific plan.
  - Source: `SKILL.md` Intro; `SW-SCENARIO-08`.

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
| `SW-CHECK-16` | `SW-SCENARIO-14` |
| `SW-CHECK-17` | `SW-SCENARIO-09`, `SW-SCENARIO-14` |
| `SW-CHECK-18` | `SW-SCENARIO-09`, `SW-SCENARIO-14` |
| `SW-CHECK-19` | `SW-SCENARIO-08` |
| `SW-CHECK-20` | `SW-SCENARIO-15` |
