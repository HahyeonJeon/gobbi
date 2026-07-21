# UX Design — Scenario Set

Scenario source for one `ux` operation run. Its target is the parent contract in [`SKILL.md`](SKILL.md). Its
consumers are the operational checklist in [`checklists.md`](checklists.md) and the active Gobbi evaluation via
[`evaluation.md`](evaluation.md). The set tests whether one run produces a complete, evidence-led,
cross-surface experience specification and a directly tested disposable prototype. It exercises parent
obligations; it does not add UX policy. Lifecycle mode: design obligations plus evaluation coverage.

Scope is one complete observable experience outcome across one or more valid channels, actors, organizations,
or systems. Non-goals are adjacent outcomes, production implementation, exact child-owned platform mechanics,
and universal participant-count or prototype-fidelity rules. Sensitive participant evidence is referenced
through the active project's governed evidence records and retention policy, never copied here.

Scale limit: this source uses eight families and 28 cases, below the default split thresholds of about 12
families and 40 distinct category/type cells. Split a future larger set under a parent index rather than growing
this source without bound.

## Coverage register

All ten categories are selected because each can affect a cross-surface UX run. The named families are the
category carriers; no concern is delegated through `covered-elsewhere`.

| # | Category | Disposition | Family carriers |
|---|---|---|---|
| 1 | Purpose / outcomes / scope | selected | `UX-F1`, `UX-F3`, `UX-F5` |
| 2 | Actors / stakeholders / use-context | selected | `UX-F1`, `UX-F2`, `UX-F7` |
| 3 | Behavior / state / data | selected | `UX-F4`, `UX-F5`, `UX-F6` |
| 4 | Interfaces / dependencies / structure | selected | `UX-F1`, `UX-F4`, `UX-F6`, `UX-F8` |
| 5 | Quality attributes / resource economics | selected | `UX-F5`, `UX-F8` |
| 6 | Failure / recovery / operations | selected | `UX-F4`, `UX-F6`, `UX-F7` |
| 7 | Trust / harm / governance | selected | `UX-F2`, `UX-F3`, `UX-F8` |
| 8 | Inclusion / locale | selected | `UX-F2`, `UX-F3`, `UX-F6`, `UX-F7` |
| 9 | Change / compatibility / reversibility | selected | `UX-F7`, `UX-F8` |
| 10 | Evidence / traceability / clarity | selected | `UX-F1`–`UX-F5`, `UX-F7`, `UX-F8` |

## Category × case-type matrix

Each selected category has a positive carrier and every family has an adversarial face. Other minima appear
when the family's properties trigger them. An empty cell is `n/a` only with the property that makes the case
type inapplicable.

| Family | Good | Alternative-valid | Negative / Bad | Boundary | Failure / recovery | Adversarial | Change / regression | Counterfactual |
|---|---|---|---|---|---|---|---|---|
| `UX-F1` | `01` | `02` | n/a: scope pressure is adversarial, not a prohibited side effect | `04` | n/a: recovery is part of the exact scope boundary | `03` | n/a: no version event occurs | n/a: the outcome boundary is directly locked |
| `UX-F2` | `05` | n/a: method variation remains inside one direct-evidence path | n/a: missing preconditions require recovery rather than a prohibited action | n/a: sample size is risk-based, not a fixed edge | `07` | `08` | n/a: current-run evidence is not a version transition | `06` |
| `UX-F3` | `09` | n/a: the authority chain has one valid order | n/a: missing identity uses the positive fallback | n/a: the authority chain is ordinal, not a quantity limit | n/a: missing identity is resolved by the bounded fallback | `10` | n/a: identity is established for this run | n/a: authority sources are inspected directly |
| `UX-F4` | `11` | n/a: the parent chronology has one valid order | `13` | n/a: milestone order is categorical, not numeric | `14` | `12` | n/a: construction occurs within one run | n/a: chronology is evidenced, not assumed |
| `UX-F5` | `15`, `18` | n/a: material alternatives are compared inside the valid case | n/a: invalid divergence is adversarial rather than a prohibited side effect | `17` | n/a: no dependency or partial mutation is introduced | `16` | n/a: comparison precedes change-controlled handoff | n/a: the single-concept exception is tested at its boundary |
| `UX-F6` | `19` | n/a: channel variants belong to one continuity contract | n/a: unsafe partial state is exercised as recoverable failure | n/a: timeout is the failure transition, not a product limit | `20` | `21` | n/a: no version transition occurs | n/a: continuity is directly walked, not premised |
| `UX-F7` | `22` | n/a: prototype-method variation remains inside one evidence path | n/a: inaccessible evidence is an adversarial acceptance attempt | n/a: fidelity has no universal numeric limit | `24` | `23` | n/a: specification-first revision is recovery within the run | n/a: direct evaluation is inspected, not assumed |
| `UX-F8` | `25` | n/a: measures vary within one guarded measurement model | n/a: harmful proxy inversion is adversarial | n/a: measure thresholds are outcome-specific | `27` | `26` | `28` | n/a: proxy inversion is constructed directly |

## Source register and stable IDs

- `SRC-UX-PARENT` — [`SKILL.md`](SKILL.md), UX-R1–UX-R14 and P1–P9; sole policy owner.
- `SRC-UX-DECISIONS` — [`ideation.md`](ideation.md); D0–D15 questions and G1–G6 decision-gate trace.
- `SRC-UX-ISO` — ISO 9241-210 and ISO 9241-11 references named by the parent.
- `SRC-UX-RESEARCH` — Digital.gov user-research guidance and GOV.UK service/user-research guidance named by
  the parent; applicable only to their stated research claims.
- `SRC-UX-ACCESS` — W3C WAI accessibility and inclusive-design references named by the parent; applicable only
  to their stated surfaces, modalities, and evidence claims.
- `SRC-UX-MEASUREMENT` — GOV.UK service performance and outcome-measure references named by the parent.

Case IDs are permanent `UX-SCENARIO-NN` values. Family IDs remain permanent `UX-FN` values. Checklist
reservations use permanent `UX-CHECK-NN` values. Renaming a title does not change an ID. A changed
discrimination gets a new case ID.

## Family UX-F1 — One complete outcome across surfaces

- **Declared primary category:** 1 — Purpose / outcomes / scope. The defining discrimination is whether the run
  owns a whole observable outcome rather than a surface fragment or adjacent work.
- **Secondary categories:** 2, 4, 10.
- **Source / rationale:** `SRC-UX-PARENT` UX-R1, UX-R14, P1/P3/P5/P9; `SRC-UX-DECISIONS` D1–D5.
- **Actor + outcome:** a returning person completes one bounded authentication outcome with supporting actors.
- **Situation / invariant:** web, command-line, and support handoffs may differ mechanically while preserving
  one outcome, recovery, and explicit adjacent non-goals.
- **Applicability / priority:** every run; gate-bearing.
- **Cases:** `UX-SCENARIO-01`–`UX-SCENARIO-04`.
- **Obligations / check links:** complete outcome, valid cross-surface realization, scope-pressure rejection,
  and exact handoff boundary; `UX-CHECK-01`, `UX-CHECK-02`, `UX-CHECK-07`, `UX-CHECK-09`.

### UX-SCENARIO-01 — Returning user completes authentication

- **Primary type + justification:** Good — ordinary valid authentication reaches the observable signed-in outcome end to end.
- **Coverage-role set:** {Good} — exercises a complete valid outcome.
- **Actor:** eligible returning user.
- **Given:** an eligible returning user needs to authenticate and reach the intended signed-in destination.
- **When:** the run binds entry, actors, normal/alternative paths, states, errors, recovery, support, and
  observable completion.
- **Then:** the outcome is specified end to end without absorbing registration, password reset, account
  administration, or onboarding.
- **Failure oracle:** the design stops at a login screen, omits a recovery state, or claims success before the
  intended destination is verified.
- **Evidence tuple:** observe the feature document with a scope/path/state trace; confirm every required path
  reaches the completion signal.
- **Obligation:** the design must own one complete authentication outcome and explicit adjacent non-goals.
- **Source trace:** `SRC-UX-PARENT`; UX-R1; P1, P3–P6; cross-surface boundary example.
- **Checklist trace:** `UX-CHECK-01`, `UX-CHECK-02`, `UX-CHECK-07`, `UX-CHECK-09`.

### UX-SCENARIO-02 — Command-line authentication is an alternative-valid realization

- **Primary type + justification:** Alternative-valid — a materially different command-line channel satisfies the same outcome without copying web mechanics.
- **Coverage-role set:** {Alternative-valid} — exercises another valid channel for the same outcome.
- **Actor:** eligible returning terminal user.
- **Given:** `tool auth login` opens an external authorization handoff and returns control to the terminal.
- **When:** the experience specifies feedback, cancellation, timeout, recovery, and verified authenticated state.
- **Then:** the command-line path satisfies the same outcome obligations without copying web mechanics.
- **Failure oracle:** a URL is printed with no state continuity, timeout/recovery, or terminal completion proof.
- **Evidence tuple:** inspect the channel/path trace and test the specified handoff outcomes against the skeleton.
- **Obligation:** cross-surface variants must preserve the outcome while allowing platform-specific mechanics.
- **Source trace:** `SRC-UX-PARENT`; UX-R1, UX-R14; P3, P5, P9.
- **Checklist trace:** `UX-CHECK-01`, `UX-CHECK-09`, `UX-CHECK-17`.

### UX-SCENARIO-03 — Adjacent outcomes are pressured into the run

- **Primary type + justification:** Adversarial — scope expansion is disguised as completeness to pressure the bounded outcome.
- **Coverage-role set:** {Adversarial} — tests scope expansion disguised as completeness.
- **Actor:** stakeholder and UX designer.
- **Given:** a stakeholder asks to add registration, password reset, and account settings “while designing
  login.”
- **When:** the outcome contract is reviewed.
- **Then:** necessary login recovery remains, independent outcomes stay out, and any scope change returns to the
  user.
- **Failure oracle:** adjacent features enter because they share screens, identity, or implementation code.
- **Evidence tuple:** compare the request with the outcome sentence, completion signal, and locked non-goals.
- **Obligation:** shared surface or code must not silently broaden the outcome contract.
- **Source trace:** `SRC-UX-PARENT`; UX-R1; P1; `SRC-UX-DECISIONS` D3.
- **Checklist trace:** `UX-CHECK-01`.

### UX-SCENARIO-04 — The scope edge is stated exactly

- **Primary type + justification:** Boundary — the case exercises the exact transition between required login recovery and an independent reset outcome.
- **Coverage-role set:** {Boundary} — exercises the exact transition between required recovery and another outcome.
- **Actor:** returning user and recovery-service owner.
- **Given:** failed credentials need explanation and retry, while forgotten credentials require a separate reset
  outcome.
- **When:** scope is classified at the handoff boundary.
- **Then:** explanation, retry, and safe handoff are specified; the reset experience itself remains a named
  dependency/non-goal.
- **Failure oracle:** either required recovery is cut as “another feature,” or the entire reset outcome is
  absorbed.
- **Evidence tuple:** inspect the boundary clause and both sides of the handoff in the skeleton.
- **Obligation:** scope must include necessary continuity while excluding independent completion contracts.
- **Source trace:** `SRC-UX-PARENT`; UX-R1; P1, P3.
- **Checklist trace:** `UX-CHECK-01`, `UX-CHECK-07`.

## Family UX-F2 — Direct research, representativeness, and ethics

- **Declared primary category:** 2 — Actors / stakeholders / use-context. The defining discrimination is
  whether current behavior and context come directly from people representative of the claim.
- **Secondary categories:** 7, 8, 10.
- **Source / rationale:** `SRC-UX-PARENT` UX-R2–UX-R4, P1/P2/P8; `SRC-UX-DECISIONS` D0, D2, D5, G1/G6;
  `SRC-UX-RESEARCH`.
- **Actor + outcome:** representative participants supply new bounded generative evidence under ethical
  conditions, distinct from stakeholder authority.
- **Situation / invariant:** prior evidence and owners can frame questions but cannot replace current direct
  generative contact or the conditions that make its claims supportable.
- **Applicability / priority:** every run; acceptance-bearing and non-waivable for direct generative research,
  accessibility, and safety.
- **Cases:** `UX-SCENARIO-05`–`UX-SCENARIO-08`.
- **Obligations / check links:** new generative research, evidence authority, fail-closed preconditions, and
  anti-theater chronology; `UX-CHECK-03`, `UX-CHECK-04`, `UX-CHECK-14`, `UX-CHECK-20`.

### UX-SCENARIO-05 — New generative research shapes the run

- **Primary type + justification:** Good — new neutral generative contact changes the current run before concept convergence.
- **Coverage-role set:** {Good} — exercises new direct evidence before convergence.
- **Actor:** representative research participant and UX researcher.
- **Given:** prior research and analytics exist for related authentication behavior.
- **When:** the team conducts a new, neutral generative inquiry with representative users for this bounded run.
- **Then:** current behavior, barriers, workarounds, language, trust, and context inform the foundation with
  explicit limits.
- **Failure oracle:** the design converges from existing reports alone or research questions pitch the intended
  solution.
- **Evidence tuple:** inspect research dates, questions, participant-context rationale, observations, synthesis,
  and decision effects.
- **Obligation:** every run must add new representative-user generative evidence before convergence.
- **Source trace:** `SRC-UX-PARENT`; UX-R2, UX-R4; P1–P2.
- **Checklist trace:** `UX-CHECK-03`, `UX-CHECK-04`, `UX-CHECK-20`.

### UX-SCENARIO-06 — Prior evidence or the project owner is offered as a substitute

- **Primary type + justification:** Counterfactual — the premise that prior or owner knowledge is sufficient is inverted and tested against representativeness.
- **Coverage-role set:** {Counterfactual} — inverts the premise that prior or owner evidence is sufficient.
- **Actor:** project owner and UX researcher.
- **Given:** a project owner says they know users and a prior study already covered login.
- **When:** representativeness and recency are examined.
- **Then:** prior evidence frames the inquiry; the owner counts only for claims their real context represents;
  new direct research remains required.
- **Failure oracle:** seniority, domain knowledge, or document presence is treated as representative evidence.
- **Evidence tuple:** compare claimed population/context with the owner's actual context and the new research
  question.
- **Obligation:** evidence authority must come from representativeness, not ownership or familiarity.
- **Source trace:** `SRC-UX-PARENT`; UX-R2; P1–P2.
- **Checklist trace:** `UX-CHECK-03`, `UX-CHECK-20`.

### UX-SCENARIO-07 — Representative access or consent is unavailable

- **Primary type + justification:** Failure/recovery — required evidence conditions are unavailable and the correct recovery is a non-accepting status plus plan.
- **Coverage-role set:** {Failure/recovery} — exercises the required stop and recovery plan.
- **Actor:** UX researcher and product decision owner.
- **Given:** representative users cannot be reached, informed consent is absent, or needed accommodations are
  unavailable.
- **When:** the precondition gate runs.
- **Then:** the run returns `NEEDS_CONTEXT`, records assumptions and a research plan, and withholds accepted-final
  status.
- **Failure oracle:** stakeholder approval, a proxy participant, a disclaimer, or an operational waiver is used
  to bypass the direct-evidence, accessibility, safety, consent, or accommodation gate.
- **Evidence tuple:** inspect access/consent/accommodation records and final status language.
- **Obligation:** missing ethical or evidence preconditions must fail closed without pretending the design is
  accepted.
- **Source trace:** `SRC-UX-PARENT`; UX-R3, UX-R4; P1, P8.
- **Checklist trace:** `UX-CHECK-03`, `UX-CHECK-04`, `UX-CHECK-14`.

### UX-SCENARIO-08 — Research is performed after the solution is locked

- **Primary type + justification:** Adversarial — interview activity is used as confirmation theater after the solution is already locked.
- **Coverage-role set:** {Adversarial} — tests research used as validation theater.
- **Actor:** representative participant, UX researcher, and product decision owner.
- **Given:** one polished concept is already treated as final before participants are contacted.
- **When:** interviews are framed to confirm it, contrary observations cannot change the design, or an
  authorized operational waiver is offered in place of current direct generative research.
- **Then:** the earliest affected decision reopens and neutral generative research precedes convergence; the
  attempted waiver is invalid and cannot close or accept the protected item.
- **Failure oracle:** interview-session presence or a recorded authority/rationale is accepted despite a
  non-falsifiable plan or absent direct generative contact.
- **Evidence tuple:** inspect question neutrality, timing, decision status, disconfirming probes, and recorded
  changes from findings.
- **Obligation:** research must be able to change the direction rather than decorate a locked answer.
- **Source trace:** `SRC-UX-PARENT`; UX-R2, UX-R4; P2; Must-Not-Follow performative-research rule.
- **Checklist trace:** `UX-CHECK-03`, `UX-CHECK-20`.

## Family UX-F3 — Identity and reference foundation

- **Declared primary category:** 7 — Trust / harm / governance. The defining discrimination is whether identity
  authority remains bounded by evidence, accessibility, and safety.
- **Secondary categories:** 1, 8, 10.
- **Source / rationale:** `SRC-UX-PARENT` UX-R5, UX-R10, P2/P5/P6; `SRC-UX-DECISIONS` D6/D10;
  `SRC-UX-ACCESS`.
- **Actor + outcome:** the UX designer and product decision owner establish a bounded, evidence-backed identity
  foundation without excluding representative people.
- **Situation / invariant:** absent governing material triggers a run-scoped fallback; existing identity never
  outranks direct evidence, accessibility, or safety.
- **Applicability / priority:** every run; foundation gate and non-waivable access/safety floor.
- **Cases:** `UX-SCENARIO-09`, `UX-SCENARIO-10`.
- **Obligations / check links:** authority-chain fallback and visible identity conflict resolution;
  `UX-CHECK-05`, `UX-CHECK-06`, `UX-CHECK-10`.

### UX-SCENARIO-09 — No governing DESIGN material exists

- **Primary type + justification:** Good — the documented bounded fallback establishes identity when no governing material exists.
- **Coverage-role set:** {Good} — exercises the documented identity fallback.
- **Actor:** UX designer and product decision owner.
- **Given:** no adequate `DESIGN.md`, brand, product, or design-system document exists.
- **When:** the agent reads the live product and asks what those materials would define.
- **Then:** the user confirms a run-scoped identity brief in the feature design document; no project-wide file
  is invented.
- **Failure oracle:** identity is guessed, ignored until polish, or converted into an unauthorized global
  `DESIGN.md`.
- **Evidence tuple:** inspect the authority-chain search, live-product evidence, identity questions, and explicit
  confirmation.
- **Obligation:** missing identity material must trigger evidence gathering and a bounded confirmed brief.
- **Source trace:** `SRC-UX-PARENT`; UX-R5; P2; `SRC-UX-DECISIONS` D6.
- **Checklist trace:** `UX-CHECK-05`, `UX-CHECK-06`.

### UX-SCENARIO-10 — Identity conflicts with accessibility or direct evidence

- **Primary type + justification:** Adversarial — brand authority is used to pressure the non-waivable accessibility and safety floor.
- **Coverage-role set:** {Adversarial} — tests brand authority used to excuse exclusion.
- **Actor:** representative user, UX designer, and product decision owner.
- **Given:** an identity preference reduces comprehension, access, safety, or trust for representative users.
- **When:** the conflict reaches a decision gate.
- **Then:** evidence and trade-offs are shown to the user; the result stays above the accessibility and safety
  floor, and an attempted waiver on either protected class is invalid.
- **Failure oracle:** “on brand,” named authority, or a waiver rationale overrides direct evidence,
  accessibility, or safety, or the conflict is silently decided by the agent.
- **Evidence tuple:** inspect the conflict record, accessibility/safety evidence, options, and explicit decision.
- **Obligation:** identity conflicts must be visible and cannot waive access or safety.
- **Source trace:** `SRC-UX-PARENT`; UX-R5, UX-R10; P2, P5–P6.
- **Checklist trace:** `UX-CHECK-05`, `UX-CHECK-10`.

## Family UX-F4 — Top-down skeleton and bottom-up growth

- **Declared primary category:** 3 — Behavior / state / data. The defining discrimination is whether the
  specification follows the required chronology and keeps every local unit coherent with the whole.
- **Secondary categories:** 4, 6, 10.
- **Source / rationale:** `SRC-UX-PARENT` UX-R6, UX-R7, UX-R9, UX-R11, P3–P7; `SRC-UX-DECISIONS` G2–G5.
- **Actor + outcome:** the UX designer grows an approved skeleton into a complete specification before any
  prototype exists.
- **Situation / invariant:** a tangible or polished artifact cannot replace top-down skeleton, bottom-up growth,
  accumulated review, or whole-specification approval.
- **Applicability / priority:** every run; chronology is gate-bearing and whole-spec-before-prototype is
  non-waivable.
- **Cases:** `UX-SCENARIO-11`–`UX-SCENARIO-14`.
- **Obligations / check links:** ordered growth, big-bang rejection, premature-prototype rejection, and
  whole-to-unit repair; `UX-CHECK-06`–`UX-CHECK-12`.

### UX-SCENARIO-11 — Skeleton first, specification grows one unit at a time

- **Primary type + justification:** Good — the valid construction path establishes the whole before growing gated units.
- **Coverage-role set:** {Good} — exercises the required construction sequence.
- **Actor:** UX designer and product decision owner.
- **Given:** the foundation is approved.
- **When:** the agent maps the top-down skeleton, then grows the smallest meaningful unit into the core path and
  every remaining path/state.
- **Then:** each increment traces to the skeleton and passes its user gate before the whole specification closes.
- **Failure oracle:** local detail precedes the skeleton, or the complete specification appears in one ungated
  pass.
- **Evidence tuple:** inspect artifact timestamps/order, unit-to-skeleton traces, and gate decisions.
- **Obligation:** the design must grow top-down then bottom-up in observable increments.
- **Source trace:** `SRC-UX-PARENT`; UX-R6, UX-R7; P3–P6.
- **Checklist trace:** `UX-CHECK-06`, `UX-CHECK-07`, `UX-CHECK-08`, `UX-CHECK-09`.

### UX-SCENARIO-12 — A polished big-bang design is requested

- **Primary type + justification:** Adversarial — polish is used to bypass evidence, order, and approval gates.
- **Coverage-role set:** {Adversarial} — tests polish used to skip evidence and construction gates.
- **Actor:** stakeholder and UX designer.
- **Given:** a stakeholder requests a finished, polished design in one pass.
- **When:** the required sequence is compared with the request.
- **Then:** the run stays staged; polish cannot replace foundation, skeleton, unit growth, whole-spec, or test
  evidence.
- **Failure oracle:** a complete-looking artifact is accepted because review is easier after it exists.
- **Evidence tuple:** inspect decision/order records and attempt to locate every required gate before the final
  artifact.
- **Obligation:** cosmetic completeness must fail when the staged operating contract is absent.
- **Source trace:** `SRC-UX-PARENT`; UX-R6, UX-R7; Must-Not-Follow big-bang rule.
- **Checklist trace:** `UX-CHECK-06`.

### UX-SCENARIO-13 — Prototype is requested before the whole specification

- **Primary type + justification:** Negative/Bad — premature prototype creation is a prohibited side effect while the whole specification is incomplete.
- **Coverage-role set:** {Negative/Bad} — exercises safe rejection of an invalid precondition.
- **Actor:** UX designer and product decision owner.
- **Given:** the skeleton or core path is approved but the accumulated/whole specification is incomplete.
- **When:** someone asks for a prototype “to figure out the rest” or offers an authorized operational waiver for
  the incomplete whole-specification gate.
- **Then:** prototype work does not start; the waiver is invalid, and the run returns to specification growth
  and final approval.
- **Failure oracle:** a milestone prototype exists before the timestamped whole-spec gate, or a waiver token is
  treated as permission to create or retain it.
- **Evidence tuple:** compare prototype creation time and scope with the final approval record.
- **Obligation:** no prototype may precede whole-specification completion and approval.
- **Source trace:** `SRC-UX-PARENT`; UX-R6, UX-R9, UX-R11; P5–P7.
- **Checklist trace:** `UX-CHECK-11`, `UX-CHECK-12`.

### UX-SCENARIO-14 — A strong local unit breaks the experience skeleton

- **Primary type + justification:** Failure/recovery — a local success breaks the whole and must return to its owning layer.
- **Coverage-role set:** {Failure/recovery} — exercises detection and return to the owning layer.
- **Actor:** person attempting the outcome and UX designer.
- **Given:** one task or channel works well alone but creates a dead end, state loss, or conflicting handoff in
  the skeleton.
- **When:** the unit-to-skeleton trace is checked.
- **Then:** the unit or skeleton is revised, all affected paths are rechecked, and the user gate reruns.
- **Failure oracle:** local usability evidence is used to ignore whole-outcome failure.
- **Evidence tuple:** inspect the failed integration path, revision, regression sweep, and renewed decision.
- **Obligation:** local success cannot pass while the complete experience fails.
- **Source trace:** `SRC-UX-PARENT`; UX-R6, UX-R7; P3–P5.
- **Checklist trace:** `UX-CHECK-07`, `UX-CHECK-08`, `UX-CHECK-09`.

## Family UX-F5 — Concepts and whole-specification approval

- **Declared primary category:** 10 — Evidence / traceability / clarity. The defining discrimination is whether
  concept selection and prototype eligibility rest on an explicit, complete evidence trail.
- **Secondary categories:** 1, 3, 5.
- **Source / rationale:** `SRC-UX-PARENT` UX-R7–UX-R9, P6; `SRC-UX-DECISIONS` D11/D12, G4/G5;
  `SRC-UX-ISO`.
- **Actor + outcome:** the UX designer and product decision owner compare material concepts and approve one
  complete feature design document.
- **Situation / invariant:** cosmetic variants do not create divergence, and a bounded single-concept exception
  does not weaken the whole-specification gate.
- **Applicability / priority:** every run; concept gate plus non-waivable whole-specification approval.
- **Cases:** `UX-SCENARIO-15`–`UX-SCENARIO-18`.
- **Obligations / check links:** material comparison, anti-cosmetic probe, exception boundary, and document
  closure; `UX-CHECK-06`, `UX-CHECK-10`–`UX-CHECK-12`.

### UX-SCENARIO-15 — Two materially different concepts are compared

- **Primary type + justification:** Good — materially distinct concepts are compared before a user selects one.
- **Coverage-role set:** {Good} — exercises valid divergence and user selection.
- **Actor:** UX designer and product decision owner.
- **Given:** the accumulated specification admits different experience models.
- **When:** two concepts are compared across effort, control, access, trust, failure, recovery, and evidence.
- **Then:** a reference-backed recommendation and evidence-to-change precede the user's locked choice.
- **Failure oracle:** the first plausible pattern becomes the design without material comparison.
- **Evidence tuple:** inspect concept structures, trade-off matrix, references, recommendation, and decision.
- **Obligation:** design convergence must follow a material concept comparison by default.
- **Source trace:** `SRC-UX-PARENT`; UX-R8; P6.
- **Checklist trace:** `UX-CHECK-10`.

### UX-SCENARIO-16 — One concept is duplicated cosmetically

- **Primary type + justification:** Adversarial — cosmetic labels attempt to game the material-divergence gate.
- **Coverage-role set:** {Adversarial} — tests false divergence.
- **Actor:** design reviewer and UX designer.
- **Given:** two concepts differ only in naming, tone, layout polish, or minor sequence wording.
- **When:** their skeleton, control model, path/state behavior, and recovery are compared.
- **Then:** they count as one; a material alternative or the evidenced single-concept exception is required.
- **Failure oracle:** two labeled mockups satisfy the concept gate despite identical experience mechanics.
- **Evidence tuple:** remove cosmetic differences and compare the remaining experience models.
- **Obligation:** the concept gate must discriminate structure and behavior, not presentation labels.
- **Source trace:** `SRC-UX-PARENT`; UX-R8; P6.
- **Checklist trace:** `UX-CHECK-10`.

### UX-SCENARIO-17 — A real constraint permits one concept

- **Primary type + justification:** Boundary — real constraints plus direct evidence are tested at the exact one-concept exception threshold.
- **Coverage-role set:** {Boundary} — exercises the exact exception threshold.
- **Actor:** UX designer and product decision owner.
- **Given:** legal, safety, platform, or interoperability constraints plus direct evidence leave no truthful
  material alternative.
- **When:** the single-concept exception is proposed.
- **Then:** the constraint, evidence, rejected false divergence, and user decision are recorded.
- **Failure oracle:** convenience, deadline, or familiarity is accepted as proof that divergence is false.
- **Evidence tuple:** attempt to construct a materially different compliant concept and inspect why evidence
  rules it out.
- **Obligation:** the exception must be evidence-bearing and narrower than a preference for one option.
- **Source trace:** `SRC-UX-PARENT`; UX-R8; P6.
- **Checklist trace:** `UX-CHECK-10`.

### UX-SCENARIO-18 — Whole document is complete before approval

- **Primary type + justification:** Good — the complete feature design document closes and is approved before any prototype.
- **Coverage-role set:** {Good} — exercises whole-spec and document-schema closure.
- **Actor:** UX designer and product decision owner.
- **Given:** one concept is selected.
- **When:** every schema section, actor, path, state, recovery, conflict, measure, limitation, and trace is
  reviewed.
- **Then:** explicit whole-spec approval is recorded before prototype creation.
- **Failure oracle:** section headings, “mostly complete,” earlier milestone approvals, or a waiver are treated
  as the final whole-specification gate.
- **Evidence tuple:** inspect schema content, orphan sweep, explicit approval, and artifact chronology.
- **Obligation:** the complete evidence-bearing specification must pass as a whole before prototyping.
- **Source trace:** `SRC-UX-PARENT`; UX-R7, UX-R9; P6.
- **Checklist trace:** `UX-CHECK-06`, `UX-CHECK-11`, `UX-CHECK-12`.

## Family UX-F6 — Cross-channel state, failure, and recovery

- **Declared primary category:** 4 — Interfaces / dependencies / structure. The defining discrimination is
  whether state and completion remain coherent across actor, channel, and system boundaries.
- **Secondary categories:** 3, 6, 8.
- **Source / rationale:** `SRC-UX-PARENT` UX-R1, UX-R10, UX-R14, P3–P5/P9; `SRC-UX-DECISIONS` D3–D5/D15.
- **Actor + outcome:** a person crosses terminal, browser, system, or support boundaries and still completes or
  safely recovers from one outcome.
- **Situation / invariant:** locally polished channels do not prove the handoff, shared state, access path, or
  truthful completion.
- **Applicability / priority:** any multi-channel, multi-actor, organizational, or system handoff; high-risk
  when partial success can mislead or duplicate effects.
- **Cases:** `UX-SCENARIO-19`–`UX-SCENARIO-21`.
- **Obligations / check links:** coherent handoff, contained timeout recovery, and anti-local-compliance probe;
  `UX-CHECK-07`, `UX-CHECK-09`, `UX-CHECK-17`.

### UX-SCENARIO-19 — Cross-channel handoff preserves the outcome

- **Primary type + justification:** Good — a valid multi-channel handoff preserves intent, state, accessibility, and completion.
- **Coverage-role set:** {Good} — exercises a valid multi-channel path.
- **Actor:** person crossing channels and supporting actor.
- **Given:** authentication moves from a terminal to a browser or from self-service to supported recovery.
- **When:** intent, state, security, feedback, accessibility, return path, and completion evidence are specified.
- **Then:** the person can continue and verify completion without reconstructing hidden state.
- **Failure oracle:** each channel works alone but the transition loses context or leaves ambiguous completion.
- **Evidence tuple:** walk the handoff in both directions against the skeleton and state inventory.
- **Obligation:** required channels must form one coherent outcome, not separate local successes.
- **Source trace:** `SRC-UX-PARENT`; UX-R1, UX-R10; P3–P5.
- **Checklist trace:** `UX-CHECK-07`, `UX-CHECK-09`.

### UX-SCENARIO-20 — Handoff times out after partial progress

- **Primary type + justification:** Failure/recovery — a timeout after partial progress exercises containment and safe resumption.
- **Coverage-role set:** {Failure/recovery} — exercises interruption, containment, and safe resumption.
- **Actor:** authenticating person and channel owner.
- **Given:** the external authorization handoff times out after one channel shows progress.
- **When:** the person returns to the initiating channel.
- **Then:** the experience states what happened, preserves no unsafe partial success, and offers a clear retry,
  cancel, support, or safe exit path.
- **Failure oracle:** one channel claims success, the other waits indefinitely, or retry duplicates a harmful
  action.
- **Evidence tuple:** inject the specified timeout at each transition and inspect state, messaging intent,
  recovery, and completion evidence.
- **Obligation:** cross-channel failure must be detectable, contained, recoverable, and consistent.
- **Source trace:** `SRC-UX-PARENT`; UX-R1, UX-R10; P5.
- **Checklist trace:** `UX-CHECK-09`.

### UX-SCENARIO-21 — Separate channel specs hide a broken whole

- **Primary type + justification:** Adversarial — polished local channel sections attempt to pass without a shared handoff contract.
- **Coverage-role set:** {Adversarial} — tests cosmetic per-channel compliance.
- **Actor:** authenticating person and design reviewer.
- **Given:** web and command-line sections each list polished screens/commands and success states.
- **When:** the shared state and handoff contract are removed.
- **Then:** the design fails because no evidence proves end-to-end continuity.
- **Failure oracle:** present channel sections are accepted without a cross-channel path test.
- **Evidence tuple:** attempt the complete outcome using only stated interface contracts and observe the orphan.
- **Obligation:** local surface completeness cannot substitute for cross-channel integration evidence.
- **Source trace:** `SRC-UX-PARENT`; UX-R1, UX-R14; P3–P5.
- **Checklist trace:** `UX-CHECK-09`, `UX-CHECK-17`.

## Family UX-F7 — Disposable prototype and direct evaluation

- **Declared primary category:** 9 — Change / compatibility / reversibility. The defining discrimination is
  whether a disposable test artifact remains subordinate to the approved and revised specification.
- **Secondary categories:** 2, 6, 8, 10.
- **Source / rationale:** `SRC-UX-PARENT` UX-R3, UX-R4, UX-R11, UX-R12, P7/P8; `SRC-UX-DECISIONS` D13/D14,
  G5/G6; `SRC-UX-ACCESS`.
- **Actor + outcome:** representative participants directly use an accessible, uncertainty-sized prototype and
  supported findings repair the durable contract first.
- **Situation / invariant:** stakeholders, experts, prior evidence, future plans, and operational waivers cannot
  replace current representative use or the access/safety conditions of that use.
- **Applicability / priority:** every run seeking final acceptance; direct representative evaluation,
  accessibility, and safety are non-waivable.
- **Cases:** `UX-SCENARIO-22`–`UX-SCENARIO-24`.
- **Obligations / check links:** direct prototype evaluation, accessible evidence, and specification-first
  revision/retest; `UX-CHECK-04`, `UX-CHECK-12`–`UX-CHECK-15`.

### UX-SCENARIO-22 — Approved specification is tested with representative users

- **Primary type + justification:** Good — representative users directly evaluate a post-approval, question-sized prototype.
- **Coverage-role set:** {Good} — exercises proportionate prototype and direct evaluation gates.
- **Actor:** representative prototype participant and UX researcher.
- **Given:** the whole specification is approved and named uncertainties remain.
- **When:** the lowest sufficient prototype is evaluated directly with representative users under consent and
  accommodation conditions.
- **Then:** observations and bounded claims address completion, errors, recovery, trust, access, and harm.
- **Failure oracle:** stakeholder walkthrough, expert review, prior testing, prototype presence, or an
  operational waiver is called direct representative-user acceptance evidence.
- **Evidence tuple:** inspect chronology, participant rationale, consent, task method, observations, limits, and
  trace to test questions.
- **Obligation:** prototype acceptance must rest on new direct representative-user evaluation.
- **Source trace:** `SRC-UX-PARENT`; UX-R3, UX-R4, UX-R11; P7–P8.
- **Checklist trace:** `UX-CHECK-12`, `UX-CHECK-13`, `UX-CHECK-14`.

### UX-SCENARIO-23 — Prototype excludes the access path being claimed

- **Primary type + justification:** Adversarial — an inaccessible prototype or method attempts to support an accessibility claim it cannot expose.
- **Coverage-role set:** {Adversarial} — tests inaccessible evidence used to claim inclusion.
- **Actor:** participant requiring an access accommodation and UX researcher.
- **Given:** the specification claims an accessible path, but the prototype or study method prevents relevant
  participants from using it.
- **When:** the evidence claim is reviewed.
- **Then:** the claim fails, any accessibility or safety waiver is invalid, the prototype/method is corrected
  from the specification, and affected users test it.
- **Failure oracle:** a checklist note, expert opinion, planned future implementation, or waiver substitutes for
  usable and safe prototype evidence.
- **Evidence tuple:** compare claimed access needs with participant accommodations, modality, and observed use.
- **Obligation:** the prototype and method must permit direct evidence for each acceptance claim.
- **Source trace:** `SRC-UX-PARENT`; UX-R3, UX-R4, UX-R10; P7–P8.
- **Checklist trace:** `UX-CHECK-04`, `UX-CHECK-13`, `UX-CHECK-14`.

### UX-SCENARIO-24 — Finding changes only the mockup

- **Primary type + justification:** Failure/recovery — a mockup-only fix leaves the durable contract wrong and must be repaired in order.
- **Coverage-role set:** {Failure/recovery} — exercises specification-first repair and retest.
- **Actor:** UX designer and representative prototype participant.
- **Given:** prototype evaluation exposes a confusing recovery state.
- **When:** the mockup is edited without changing its owning requirement or path.
- **Then:** acceptance blocks; the specification changes first, the prototype follows, and affected assumptions
  and regressions are retested.
- **Failure oracle:** visual improvement is accepted while the handed-off contract remains wrong.
- **Evidence tuple:** inspect finding timestamps and trace specification revision → prototype revision → retest.
- **Obligation:** every supported finding must repair the durable experience contract before its test artifact.
- **Source trace:** `SRC-UX-PARENT`; UX-R12; P8.
- **Checklist trace:** `UX-CHECK-15`.

## Family UX-F8 — Measurement, co-loading, and handoff change control

- **Declared primary category:** 10 — Evidence / traceability / clarity. The defining discrimination is whether
  measures, parent conflicts, and future changes remain tied to observable outcome evidence.
- **Secondary categories:** 4, 5, 7, 9.
- **Source / rationale:** `SRC-UX-PARENT` UX-R10, UX-R13, UX-R14, P6/P9; `SRC-UX-DECISIONS` D15/G6;
  `SRC-UX-MEASUREMENT`.
- **Actor + outcome:** product, measurement, UI/UX, and child-skill owners preserve a cold-readable experience
  contract after handoff.
- **Situation / invariant:** a favorable proxy, load order, or platform specialization cannot silently override
  outcome, evidence, accessibility, safety, or recovery obligations.
- **Applicability / priority:** every handoff; conflict/change cases activate on co-loading or specialization.
- **Cases:** `UX-SCENARIO-25`–`UX-SCENARIO-28`.
- **Obligations / check links:** guarded measures, anti-gaming, evidence-led conflict resolution, and
  parent-preserving specialization; `UX-CHECK-16`–`UX-CHECK-18`.

### UX-SCENARIO-25 — Outcome measures include guardrails and reopen conditions

- **Primary type + justification:** Good — outcome measures include guardrails, owners, limits, and evidence-based reopen conditions.
- **Coverage-role set:** {Good} — exercises continued evidence after handoff.
- **Actor:** product decision owner and measurement owner.
- **Given:** the design reaches post-test approval.
- **When:** outcome, failure, recovery, access, trust, and harm measures are defined with owners and review
  cadence.
- **Then:** each measure states its interpretation limits, guardrails, and evidence that reopens the design.
- **Failure oracle:** success is a dashboard proxy with no relation to completed outcomes or user harm.
- **Evidence tuple:** trace each measure to an obligation and simulate an improving proxy with worsening user
  outcome.
- **Obligation:** measurement must support the outcome and expose harmful interpretations.
- **Source trace:** `SRC-UX-PARENT`; UX-R13, UX-R14; P6, P9.
- **Checklist trace:** `UX-CHECK-16`, `UX-CHECK-17`.

### UX-SCENARIO-26 — Metric improves while the user outcome worsens

- **Primary type + justification:** Adversarial — a favorable proxy is gamed while completion, access, or harm worsens.
- **Coverage-role set:** {Adversarial} — tests metric gaming and proxy inversion.
- **Actor:** affected user and measurement owner.
- **Given:** authentication completion rate rises because recovery exits and difficult users are excluded.
- **When:** the metric is read without failure, abandonment, accessibility, or harm guardrails.
- **Then:** the metric set fails and the design/measurement decision reopens.
- **Failure oracle:** a higher headline number alone is accepted as success.
- **Evidence tuple:** construct the counterexample and inspect whether guardrails detect it.
- **Obligation:** no gameable proxy may stand alone as outcome evidence.
- **Source trace:** `SRC-UX-PARENT`; UX-R13; P9.
- **Checklist trace:** `UX-CHECK-16`.

### UX-SCENARIO-27 — Co-loaded UI and UX guidance conflict

- **Primary type + justification:** Failure/recovery — conflicting parent guidance is surfaced and recovered through an evidence-led user decision.
- **Coverage-role set:** {Failure/recovery} — exercises conflict detection and user resolution.
- **Actor:** UX owner, UI owner, and product decision owner.
- **Given:** UX evidence requires one recovery model while UI guidance recommends a conflicting surface pattern.
- **When:** both skills are loaded.
- **Then:** the concrete conflict, evidence, and trade-offs are shown to the user; no precedence or load-order
  rule is invented, and the accessibility/safety floor remains.
- **Failure oracle:** one parent silently overrides the other or the implementation chooses by convenience.
- **Evidence tuple:** inspect both clauses, their evidence, the user decision, and preserved non-waivable floor.
- **Obligation:** co-loaded parent conflicts must be explicit, evidence-led user decisions.
- **Source trace:** `SRC-UX-PARENT`; UX-R10, UX-R14; Intro; Must-Not-Follow co-load rule.
- **Checklist trace:** `UX-CHECK-18`.

### UX-SCENARIO-28 — Future child silently changes the experience contract

- **Primary type + justification:** Change/regression — future specialization changes mechanics and is checked for parent-contract regression.
- **Coverage-role set:** {Change/regression} — exercises specialization without parent regression.
- **Actor:** child-skill author and product decision owner.
- **Given:** a future web, command-line, or desktop child skill specializes exact mechanics.
- **When:** it drops a parent actor, state, recovery, access, safety, evidence, or measure obligation.
- **Then:** the deviation fails and returns to the user before handoff; mechanics may differ, parent invariants may
  not disappear silently.
- **Failure oracle:** platform specificity is treated as authority to narrow the outcome contract.
- **Evidence tuple:** diff child obligations against parent traces and run the complete outcome scenarios.
- **Obligation:** child specialization must preserve parent evidence and experience invariants.
- **Source trace:** `SRC-UX-PARENT`; UX-R14; P9.
- **Checklist trace:** `UX-CHECK-17`, `UX-CHECK-18`.

## Source-to-scenario and obligation ledger

This ledger supplies the source→scenario direction. Every listed case supplies the reverse
scenario→obligation direction in its **Obligation**, **Source trace**, and **Checklist trace** fields. The
checklist's Guaranteed coverage map supplies check→scenario reversal.

| Source obligation | Scenario IDs | Obligation / reserved checks |
|---|---|---|
| UX-R1 — one complete observable outcome | `01`–`04`, `19`–`21` | Bound outcome, exact boundary, cross-channel continuity; `UX-CHECK-01`, `02`, `07`, `09` |
| UX-R2 — new direct generative research | `05`, `06`, `08` | Current representative generative evidence before convergence; `UX-CHECK-03`, `20` |
| UX-R3 — direct representative-user prototype evaluation | `07`, `22`, `23` | Current direct prototype-use evidence; `UX-CHECK-04`, `14` |
| UX-R4 — ethical evidence conditions / `NEEDS_CONTEXT` | `05`, `07`, `23` | Consent, accommodation, data protection, claim bounds, and fail-closed status; `UX-CHECK-04` |
| UX-R5 — identity authority chain and bounded fallback | `09`, `10` | Governed identity or user-confirmed run brief; `UX-CHECK-05` |
| UX-R6 — exact construction order | `11`–`14`, `18` | Skeleton, bottom-up growth, whole approval, then prototype; `UX-CHECK-06`–`09`, `11`, `12` |
| UX-R7 — explicit user gates | `11`, `12`, `18`, `24` | Observable approvals and revision decisions; `UX-CHECK-06`, `08`, `11`, `15` |
| UX-R8 — material concepts or evidenced exception | `15`–`17` | Consequential divergence or bounded exception proof; `UX-CHECK-10` |
| UX-R9 — whole feature document before prototype | `13`, `18` | Complete, approved document and valid chronology; `UX-CHECK-11`, `12` |
| UX-R10 — inclusion, trust, safety, harm, agency | `10`, `19`, `20`, `23`, `27` | Protected floor and visible conflict resolution; `UX-CHECK-05`, `09`, `13`, `18` |
| UX-R11 — disposable, proportionate prototype | `13`, `22`, `23` | Question-sized, specification-traced artifact; `UX-CHECK-12`, `13` |
| UX-R12 — specification-first revision and retest | `24` | Durable-contract repair before artifact and retest; `UX-CHECK-15` |
| UX-R13 — measures resist gaming | `25`, `26` | Outcome guardrails and proxy-inversion detection; `UX-CHECK-16` |
| UX-R14 — no-silent-change handoff/specialization | `02`, `21`, `27`, `28` | Evidence-led conflict and parent-preserving change; `UX-CHECK-17`, `18` |

## Failability and protected-waiver audit

- A polished big-bang artifact fails `UX-SCENARIO-12`; local surface polish without continuity fails `21`.
- Prior evidence or owner authority replacing new generative research fails `06`; an operational waiver or
  confirmatory research after convergence fails `08`.
- Any prototype before complete whole-specification approval, including one justified by a waiver, fails `13`;
  headings, milestone approval, or a waiver masquerading as whole closure fails `18`.
- Stakeholder, expert, prior-test, prototype-presence, or waiver substitution for direct representative-user
  evaluation fails `22`.
- Identity or authority pressure against accessibility/safety fails `10`; inaccessible evidence or an
  accessibility/safety waiver fails `23`.
- Missing representative access, consent, accommodations, or required evidence fails closed through `07`.
- Cosmetic concept divergence fails `16`; the legitimate one-concept boundary is exercised by `17`.
- Prototype-only repair fails `24`; proxy gaming fails `26`; load-order conflict and child regression fail `27`
  and `28`.

## Orphan sweep, coverage gaps, and decisions

- **Source→scenario sweep:** every load-bearing UX-R1–UX-R14 parent clause appears in the ledger above with at
  least one live case and reserved check.
- **Scenario→obligation sweep:** every `UX-SCENARIO-01`–`UX-SCENARIO-28` case has one observable obligation,
  source trace, and checklist trace. No scenario is exploratory and none is orphaned.
- **Category/case sweep:** all ten categories are selected, every family has a Good case and adversarial face,
  and every empty matrix cell records the property making that type inapplicable.
- **Sensitive evidence decision:** cases name governed evidence pointers and methods only; participant records
  remain in the active project's retention-controlled evidence store.
- **Scale decision:** keep eight families and 28 stable cases. The protected-waiver counterexamples are concrete
  variations of existing cases `08`, `10`, `13`, `18`, `22`, and `23`, so no new case ID is needed.
- **Coverage gaps:** none. A future new parent obligation, family, or distinct discrimination reopens this sweep
  and receives a new stable ID rather than repurposing an existing case.
