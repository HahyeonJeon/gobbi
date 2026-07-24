# Startup — Evaluation Scenario Set

A coverage-framed scenario set for the completed startup baseline. It conforms to the scenario SOP
(`scenario/SKILL.md`, SR-1…SR-14): a parent coverage index, four bounded logical sets under it, families
derived from ten coverage categories, concrete cases with observable failure oracles, and a two-way trace
from source to scenario to design obligation. It stops at design obligations; the concrete yes/no **checks**
each obligation implies live in the sibling `checklist.md`, and the evaluation **procedure** (perspective
lenses, recommended verifications, verdict routing) lives in the sibling `evaluation.md`.

The evaluator loads this file at Stage 1 (Scenario-Checklist Frame Build) as the seed scenario set. This
file OWNS the parent/set/category/family/case/obligation model and the family→set + family→category map;
`checklist.md` mirrors the hierarchy by reference (it does not reproduce the taxonomy), and `evaluation.md`
routes each family to a perspective by its DECLARED primary category and references — never restates — this
taxonomy.

**Target under evaluation — the completed startup baseline as a set:** the answer ledger and its branch
closures; the four confirmed phase-result readouts (`working/phase-results/phase-{i,ii,iii,iv}.md`) and the
raw `working/discussion-log.md` (both record-level, never promoted — pointer, never quoted); the referenced
decision briefs and evidence; the full staged-draft set including living-index candidates; the approved
promotion manifest and preimages; the actual promoted memory delta and the overlapping prior memory; the
exact-path verification and standing-guard results; and the startup summary. This evaluation is the **P6.5
non-skippable dual-system gate**: two fresh evaluators, one Claude and one Codex, each judge the frozen
post-promotion set through all seven perspectives before P7 may write `baseline_valid: true`. Startup is a
non-loop target, so its evaluation evidence lives under
`sessions/{date}-{session-id}/startup/working/evaluation/iter{n}/{system}/`, NOT a numbered
`{N}-{loop}/evaluation/` path.

**Coverage is not acceptance (two-gate model, preserved).** This set declares COVERAGE — which situations
the baseline must handle and how each would fail a broken baseline. Whether the baseline is ACCEPTED is a
separate gate the sibling `checklist.md` owns (coverage-closure ≠ acceptance-pass). A family being present
here never means a check passes; it means a broken baseline has a named way to fail.

**Stable-ID policy.** Family IDs keep their legacy shape `STARTUP-{PERSPECTIVE}-SCENARIO-{NN}` — the
perspective token is a stable IDENTIFIER, not routing authority (AR-8); the routing perspective comes from
the DECLARED primary category below, which may differ from the legacy prefix. All 29 legacy family IDs are
preserved and `STARTUP-PROJ-SCENARIO-08` is added (30 total). Case IDs are `{family-id}-C{n}` (flat, source
order). Each obligation is `O-{PERSPECTIVE}{NN}-{n}`. Checks are `{family-id}-CHECK-*`, defined 1:1 in
`checklist.md`.

---

## Set-level frame

**Purpose.** Prove that a completed startup baseline is complete, substantive, atomic, secret-free,
traceable, and cold-usable — the reference every later loop and session trusts — and that a broken baseline
has a concrete, observable way to fail on each covered situation.

**Target.** The frozen post-promotion startup baseline set (named above). **Consumer.** The two fresh P6.5
evaluators (seed set + coverage frame) and, downstream, the manager reconciling their verdicts.

**Lifecycle mode.** Evaluation coverage (not design-mode exploration): every family traces to an approved
obligation; there are no `exploratory:` scenarios. The source set is frozen before results are recorded (P9).

**Scope.** The completed baseline's coverage across all 11 topics / 46 required branches, the four phase
readouts, the staged/promoted memory delta, and the P6.5 validity gate. **Non-goals:** constructing or
reading verification checks (checklist-owned); the interview procedure itself (`topics.md`/`SKILL.md`); the
promotion mechanics (`recording.md`); grading any live session other than the frozen baseline.

### Parent coverage index (SR-1 — all ten categories `selected`)

The parent target (the whole baseline) touches every one of the ten coverage categories; each is `selected`
and owned by the named set(s)/families. The four child sets each re-disposition the ten categories from
their own theme (a category a child set does not itself select is `covered-elsewhere` at a named sibling set,
with the SR-7 ledger in that set's register). No category is `n/a` at parent level — every concern can affect
the baseline.

| # | Category (`scenario/SKILL.md`) | Parent disposition | Owning set(s) / representative families |
|---|---|---|---|
| C1 | Purpose / outcomes / scope | selected | S1 (PROJ-01/02/03/05/07/08), S3 (STRUCT-03) |
| C2 | Actors / stakeholders / use-context | selected | S1 (PROJ-06), S3 (USAGE-01) |
| C3 | Behavior / state / data | selected | S3 (STRUCT-01/02, PERF-02), S4 (CONS-01/02, RISK-03/04) |
| C4 | Interfaces / dependencies / structure | selected | S2 (STRUCT-04), S3 (STRUCT-01/02) |
| C5 | Quality attributes / resource economics | selected | S2 (STRUCT-05, PERF-01), S3 (PERF-02/03), S4 (RISK-05 sec) |
| C6 | Failure / recovery / operations | selected | S4 (RISK-04), S2 (STRUCT-04/05 sec, USAGE-03 sec), S3 (USAGE-02 sec) |
| C7 | Trust / harm / governance | selected | S1 (PROJ-04), S4 (RISK-01/02/03/05) |
| C8 | Inclusion / locale | selected | S2 (USAGE-03) |
| C9 | Change / compatibility / reversibility | selected | S3 (USAGE-02, AESTH-02 sec) |
| C10 | Evidence / traceability / clarity | selected | S3 (AESTH-01/02, CONS-03), S4 (CONS-02, RISK-06) |

### Family → set assignment table (MIG-2 — all 30 families, each in exactly one set)

Union = 30 (29 legacy + PROJ-08); zero omissions, zero duplicates. `placement_reason` is family-specific (a
theme-name-only or copy-pasted reason FAILS the anti-cosmetic gaming check — F-STR3-001 symmetric floor).

| family_id | legacy_or_new | set_id | placement_reason |
|---|---|---|---|
| STARTUP-PROJ-SCENARIO-01 | legacy | S1 | Judges whether the problem-space TALK produced complete, substantive topic/branch coverage — the product-definition core of S1. |
| STARTUP-PROJ-SCENARIO-02 | legacy | S1 | Guards product-intent-before-architecture ordering — a product-definition precedence, S1's concern, not a downstream structure check. |
| STARTUP-PROJ-SCENARIO-03 | legacy | S1 | Governs how design-BEARING product directions are decided (prior art + user decision) — product-shape decisions belong to S1. |
| STARTUP-PROJ-SCENARIO-04 | legacy | S1 | Establishes the license/governance/authority PROPERTY of the product itself at Topic 1.4 — a product-definition fact, kept with its product siblings. |
| STARTUP-PROJ-SCENARIO-05 | legacy | S1 | Grounds the load-bearing PROBLEM (the product's reason to exist) in behavioral evidence — the root of the product definition. |
| STARTUP-PROJ-SCENARIO-06 | legacy | S1 | Fixes WHO the product serves and their job — the first-user identity that anchors the whole product shape. |
| STARTUP-PROJ-SCENARIO-07 | legacy | S1 | Judges the product SHAPE (elements/journeys/boundary/non-goals) — the synthesized product direction S1 exists to check. |
| STARTUP-PROJ-SCENARIO-08 | new | S1 | The phase-result synthesis that BUILDS the confirmed problem/product baseline — the process that produces every other S1 claim, so it belongs with them. |
| STARTUP-STRUCT-SCENARIO-04 | legacy | S2 | Dependency/supply-chain/operational contracts decide whether the product can be RUN — a viability concern, not a memory-structure one. |
| STARTUP-STRUCT-SCENARIO-05 | legacy | S2 | Buildability with available skills + sustainability across the product's life — the feasibility core of S2. |
| STARTUP-PERF-SCENARIO-01 | legacy | S2 | Interview-depth ECONOMICS (effort follows evidence-state and risk) — whether the talk itself is a viable, proportionate process. |
| STARTUP-USAGE-SCENARIO-03 | legacy | S2 | Accessibility / i18n / operator-diagnostic INCLUSION — who can use and operate the product — the inclusion half of S2. |
| STARTUP-STRUCT-SCENARIO-01 | legacy | S3 | Record atomicity + memory-type contract — the structural unit of durable MEMORY, S3's subject. |
| STARTUP-STRUCT-SCENARIO-02 | legacy | S3 | Deterministic staging→destination routing of memory records — how memory is placed, an S3 memory-structure concern. |
| STARTUP-STRUCT-SCENARIO-03 | legacy | S3 | Whether a feature DIRECTORY (a durable memory home) represents user value — a memory-organization decision, kept with the memory set. |
| STARTUP-PERF-SCENARIO-02 | legacy | S3 | Baseline SIZE economics — one concept ↔ one record, no fragmentation — a property of the promoted memory set, S3. |
| STARTUP-PERF-SCENARIO-03 | legacy | S3 | READMEs as memory INDEXES (no duplicated bodies) + explicit budgets recorded in typed memory — an S3 memory-and-use concern. |
| STARTUP-AESTH-SCENARIO-01 | legacy | S3 | Cold-readability of every promoted RECORD — whether memory is USABLE without the talk, S3's use half. |
| STARTUP-AESTH-SCENARIO-02 | legacy | S3 | Stable slugs/headings/pointers across the memory set — navigability of memory, S3. |
| STARTUP-USAGE-SCENARIO-01 | legacy | S3 | Whether a downstream loop can USE the baseline memory without re-asking — the direct use case of S3. |
| STARTUP-USAGE-SCENARIO-02 | legacy | S3 | Resume/rerun/completion lifecycle of the memory set across sessions — how memory is re-used and re-derived, S3. |
| STARTUP-CONS-SCENARIO-03 | legacy | S3 | One-to-one traceability of the promoted memory set back to the ledger — the internal consistency of what memory holds, S3. |
| STARTUP-CONS-SCENARIO-01 | legacy | S4 | Cross-topic contradiction resolution BEFORE promotion — a safety pass over what gets committed, S4. |
| STARTUP-CONS-SCENARIO-02 | legacy | S4 | Claim-kind/evidence-status fidelity THROUGH promotion — preventing a strengthened claim from being committed, S4. |
| STARTUP-RISK-SCENARIO-01 | legacy | S4 | Secrets never crossing into durable output — the promotion-safety core of S4. |
| STARTUP-RISK-SCENARIO-02 | legacy | S4 | License/authority/binding-rule/prior-art safety of what is promoted — a promotion-governance concern, S4. |
| STARTUP-RISK-SCENARIO-03 | legacy | S4 | Promotion approved/bounded/collision-safe — the mutation-safety gate of S4. |
| STARTUP-RISK-SCENARIO-04 | legacy | S4 | Promotion finishes verified + recoverable — the failure/rollback safety of the commit, S4. |
| STARTUP-RISK-SCENARIO-05 | legacy | S4 | The P6.5 validity gate that authorizes promotion to count — the acceptance-safety keystone of S4. |
| STARTUP-RISK-SCENARIO-06 | legacy | S4 | The evidence-or-fail teeth over every load-bearing claim before it is trusted — the substance-safety floor of S4. |

### Per-set family + cell counts (SR-8 — thresholds ~12 families / ~40 cells)

A **cell** is one distinct `(selected-category, triggered-case-type)` pair counted once within a set —
derived from the coverage-role entries of the set's cases (each `<case-type> C<n>` entry contributes one
pair). Every set is within both bounds, so no set splits and no seventh child file is needed (AR-7 not
triggered).

| Set | Families | Distinct cells | Within ~12 / ~40? |
|---|---|---|---|
| S1 Problem & product | 8 | 19 | yes |
| S2 Viability & inclusion | 4 | 17 | yes |
| S3 Memory & use | 10 | 24 | yes |
| S4 Promotion & safety | 8 | 15 | yes |

Per-set cell derivations are in each set's coverage register below (the populated `(category, case-type)`
matrix). The largest set, S3, sits at 24 of the ~40 bound with margin; every set is under both thresholds,
so no set splits and no seventh child file is required (AR-7 not triggered).

### Source register (SR-9 — reference, never inline sensitive evidence)

The set derives from, and traces back to: the six startup files at the pinned base — `SKILL.md`,
`topics.md`, `recording.md`, the pre-migration `scenario.md`, `checklist.md`, `evaluation.md`; the locked
Idea scenarios (`SG-1…5`, `SE-1…5`, `SF-1…5`, `SA-1…6`) and assumptions (`AR-1…9`); and the T1 migration
ledger (`startup-migration-evidence.md`, `LEDGER`/`FAMILY_ID`/`CHECK_ID` rows). The baseline's own sensitive
values (secrets, PII, private URLs, customer data) are NEVER inlined into any case here; a case that must
cite such evidence references it by pointer/redaction and names the governing record-level retention policy
(record-level only, never promoted — RISK-01). This scenario set must not itself become a retention hazard.

### Traceability model (SR-6 / SR-14 — both directions swept)

Every case traces `source → scenario` (the legacy face / Idea scenario / ledger clause it derives from) and
`scenario → obligation` (the design obligation it proves); both directions are orphan-swept — a source clause
with no case and a case with no obligation are both defects. `scenario → check` links are OPTIONAL and are
carried as the `{family-id}-CHECK-*` mirror to `checklist.md`; this set never reads or constructs a check.
The set-level omission sweep (SR-14) confirms every load-bearing source obligation — all 29 legacy
Good/Bad/Adversarial faces + every T1 source primitive/relation + the five VA-07 phase-doc properties + the
IP-2-d/IP-3-d Performance properties — maps to ≥1 case.

### Coverage gaps + decisions

- No Aesthetics family routes its PRIMARY perspective to Aesthetics: under the owned design-category→
  perspective map, Aesthetics is only a SECONDARY perspective (of C10). The legacy AESTH-01/02 families
  declare C10 primary (→ Consistency) with Aesthetics secondary; Aesthetics therefore receives real coverage
  as a secondary perspective, not as a family's primary. This is a routing consequence of the map, recorded
  here as a dispositioned decision, not an omission.
- No source primitive or relation from the T1 ledger is dropped: the destination union of cases/obligations
  preserves each; the reverse sweep maps every new unit (PROJ-08 + the depth/cadence obligations) to a user
  lock or named new obligation (D6/D13/D14, IP-1-e, IP-3-d, IP-2-d).

---

## Set S1 — Problem & product

Whether the talk produced the RIGHT product baseline: complete substantive coverage, product intent ahead of
architecture, evidenced problem, clear first user, a bounded shape, explicit governance, and the confirmed
phase synthesis that builds it all.

### S1 coverage register (SR-1 — ten dispositions)

| # | Category | Disposition | Basis |
|---|---|---|---|
| C1 | Purpose / outcomes / scope | selected | PROJ-01/02/03/05/07/08 primary; PROJ-04/06 secondary |
| C2 | Actors / stakeholders / use-context | selected | PROJ-06 primary; PROJ-01 secondary |
| C3 | Behavior / state / data | covered-elsewhere → S3 | ledger below |
| C4 | Interfaces / dependencies / structure | selected | PROJ-02/07 secondary (element coupling / shape connection) |
| C5 | Quality attributes / resource economics | covered-elsewhere → S2, S3 | ledger below |
| C6 | Failure / recovery / operations | selected | PROJ-08 secondary (readout resume/regeneration) |
| C7 | Trust / harm / governance | selected | PROJ-04 primary; PROJ-08 secondary (promotion boundary) |
| C8 | Inclusion / locale | covered-elsewhere → S2 | ledger below |
| C9 | Change / compatibility / reversibility | covered-elsewhere → S3 | ledger below |
| C10 | Evidence / traceability / clarity | selected | PROJ-01/03/05/08 secondary (evidence tuple / decision brief / source register) |

**SR-7 covered-elsewhere ledgers (S1):**
- **C3 Behavior/state/data → S3.** Applicable families S3 STRUCT-01/02, PERF-02; triggered case types
  positive + negative + adversarial; failure oracles = a record bundling unrelated concepts / a survived
  staging-only field / a fragmented concept; applicable actor = the manager promoting records. Covering
  clause: S3 STRUCT-01-C1…C3, STRUCT-02, PERF-02 (record atomicity + type contract + size).
- **C5 Quality/resource → S2, S3.** Applicable families S2 STRUCT-05/PERF-01, S3 PERF-02/03; triggered
  types positive + boundary + adversarial; oracles = an unbuildable shape / a cadence-driven interview / a
  fragmented or duplicated baseline; actor = the team building/running + the manager. Covering clause: S2
  STRUCT-05, PERF-01; S3 PERF-02, PERF-03.
- **C8 Inclusion/locale → S2.** Applicable family S2 USAGE-03; triggered types positive + negative +
  adversarial; oracle = a surface with no accessibility/i18n treatment or an operator with no diagnostic;
  actor = end user / operator. Covering clause: S2 USAGE-03-C1…C3.
- **C9 Change/compatibility → S3.** Applicable families S3 USAGE-02, AESTH-02 (secondary); triggered types
  change/regression + failure/recovery; oracle = a rerun that blind-appends / a slug that breaks across
  reruns; actor = a later session/rerun. Covering clause: S3 USAGE-02, AESTH-02.

**S1 populated cells (19):** C1×{positive, boundary, negative, adversarial, counterfactual}=5;
C2×{positive, negative, adversarial}=3; C4×{positive, change/regression, adversarial}=3;
C6×{failure/recovery}=1; C7×{positive, negative, adversarial, boundary}=4; C10×{positive, negative,
adversarial}=3 = 19 distinct pairs (PROJ-08 contributes the C1 positive/adversarial, the C6 failure/recovery,
and the C7 adversarial pairs). Within ~40.

### STARTUP-PROJ-SCENARIO-01 — Required topic coverage is complete and substantive

- **Set:** S1 · **Declared primary category:** C1 Purpose/outcomes/scope → **Project** perspective ·
  **Secondary tags:** C10 (evidence tuple), C2 (actors named in answers).
- **Primary justification (SR-4):** the family turns on whether the problem-space talk SERVED the right
  outcome — complete, substantive closure of all 11 topics and 46 required branches — the in/out-of-scope of
  "what a finished baseline is." The evidence-tuple standard (C10) and the actors named in answers (C2) are
  the proof and the subjects of that coverage, not the defining discrimination; C1 is declared over the
  order-default C2 because coverage-completeness, not who is named, is what a broken baseline violates here.
- **Source / rationale:** legacy PROJ-01 (golden-path); SG-1, SF-4; T1 ledger for PROJ-01 faces.
- **Actor + outcome:** the manager closes the ledger; a cold evaluator reads it. Outcome: every required
  branch is accounted for exactly once with real evidence.
- **Situation / invariant:** the ledger claims the first-run traversal closed all 11 Level-1 topics and all
  46 required Level-2 branches. Invariant: each required branch appears exactly once, closed as `confirmed` /
  `proven-irrelevant`(+reason) / `recorded-open`(+owner+method).
- **Applicability + priority:** unconditional (every baseline); priority high (gates all downstream).
- **Triggered minimums (SR-2/SR-3):** Boundary TRIGGERED (finite set of 46 required branches) → C2.
  Adversarial TRIGGERED (gameable completeness gate) → C4. Failure/recovery `n/a: no dependency/persistence/
  async surface in coverage accounting`. Change/regression `n/a: no version-change event`. Counterfactual
  `n/a: the "is 46 the right count" premise is owned by the validity gate, not this family`.
- **Obligations:** O-PROJ01-1 the baseline MUST close all 11 checkpoints and record each of the 46 branches
  exactly once with a valid closure state; O-PROJ01-2 a `confirmed` load-bearing answer MUST carry its
  branch's evidence tuple, so a fluent evidence-free paragraph fails identically to a one-word answer;
  O-PROJ01-3 the problem-before-solution premise gate MUST run and confirm each premise between Topic 4 and
  Topic 5.
- **Checklist mirror:** `STARTUP-PROJ-SCENARIO-01-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-01-C1 — Complete substantive closure (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C1 —
  exercises the right-outcome completeness}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** a closed ledger claiming 11/11 topics and 46/46 branches; **When** the evaluator reads each
  closure and the between-Topic-4-and-5 premise gate; **Then** every checkpoint is user-confirmed, every
  branch closes once in a valid state, each `confirmed` load-bearing answer shows its evidence tuple, and the
  premise gate confirmed each premise before Topic 5 opened.
- **Failure oracle:** any checkpoint unconfirmed, any branch missing/duplicated, or the premise gate absent.
- **Evidence tuple:** observed-via the closure register + ledger; method close-read + count; confirms = 46
  distinct valid closures + 11 confirmations + one premise-gate record.
- **Traces:** source legacy PROJ-01 Good → O-PROJ01-1, O-PROJ01-3 → `…-01-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-01-C2 — Exactly 46 required branches, each once (boundary)
- **Primary type:** Boundary/edge (matched {Boundary, Positive}; primary Boundary — the defining
  discrimination is the exact finite-set limit). **Coverage-role:** {boundary C1 — exercises the exact
  finite-set count}.
- **Actor / role:** evaluator (checker).
- **Given** the 46-branch required set; **When** the evaluator counts closures; **Then** the register holds
  EXACTLY 46 required-branch closures — not 45 (a silent drop) and not a 47th improvised branch — each
  present once.
- **Failure oracle:** a required-branch count ≠ 46, or any required branch appearing zero or twice.
- **Evidence tuple:** observed-via the closure register; method exact count against the frozen 46-branch
  list; confirms = |required closures| = 46, each unique.
- **Traces:** source legacy PROJ-01 Good (closure register) → O-PROJ01-1 → `…-01-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-01-C3 — A required branch is dropped or hollow (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C1 — exercises safe
  rejection of an incomplete/hollow closure}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** a ledger that reads complete; **When** a required branch is absent, duplicated, closed without
  its required reason/owner, or marked `confirmed` from an answer missing its evidence tuple (a one-word
  "developers"/"fast"/"standard" OR a polished paragraph naming no behavior); **Then** the family FAILs the
  baseline.
- **Prohibited effects:** the baseline MUST NOT read as `confirmed` while a branch is dropped or hollow.
- **Failure oracle:** a missing/duplicate/reasonless closure, or a `confirmed` answer with no evidence tuple.
- **Evidence tuple:** observed-via closure register + answer bodies; method per-branch evidence-tuple check;
  confirms = at least one branch fails its closure or evidence requirement.
- **Traces:** source legacy PROJ-01 Bad → O-PROJ01-1, O-PROJ01-2 → `…-01-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-01-C4 — Fluent evidence-free paragraph stamped confirmed (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — a
  cosmetically-complete artifact attempts to pass the completeness gate). **Coverage-role:** {adversarial C1
  — exercises the anti-cosmetic gate; C10 — exercises the evidence-tuple discrimination}.
- **Actor / role:** an author producing polished but evidence-free prose / evaluator (checker).
- **Given** a 46/46 count and a load-bearing answer stamped `confirmed`; **When** that answer is the fluent
  paragraph "our users are time-pressed developers who deeply value speed and will adopt this because it fits
  their workflow"; **Then** the family FAILs it — it reads complete, names zero past behavior, and so fails
  the evidence-tuple check identically to a one-word answer.
- **Prohibited effects:** cosmetic completeness (a matching count + fluent prose) MUST NOT pass.
- **Failure oracle:** a `confirmed` load-bearing answer whose body names no concrete past behavior/event.
- **Evidence tuple:** observed-via the answer body; method evidence-tuple presence test (source/event/date/
  behavior/consequence); confirms = zero behavioral primitives despite `confirmed`.
- **Traces:** source legacy PROJ-01 Adversarial → O-PROJ01-2 → `…-01-CHECK-*`.

### STARTUP-PROJ-SCENARIO-02 — Product intent constrains architecture and stack

- **Set:** S1 · **Declared primary category:** C1 Purpose/outcomes/scope → **Project** perspective ·
  **Secondary tags:** C4 (architecture/stack contract), C9 (a late technical change reopening intent).
- **Primary justification (SR-4):** the family turns on a PRECEDENCE of scope — confirmed product intent
  (users/outcomes/boundary/capabilities/journeys) must govern later system direction, and a technical choice
  may not silently redefine the target. The architecture/stack contract (C4) is the vehicle being ordered,
  not the defining concern; C1 is declared because the violation is a purpose/scope inversion, not a broken
  interface.
- **Source / rationale:** legacy PROJ-02 (failure-mode); SG-1; T1 ledger for PROJ-02.
- **Actor + outcome:** the manager records system directions after product intent. Outcome: each system
  direction names the confirmed upstream branch it derives from; no post-hoc narrowing of users/scope.
- **Situation / invariant:** Topics 7-9 record system/quality directions after Topics 2-5 fixed users,
  outcomes, boundary, capabilities, journeys. Invariant: no architecture-before-users ordering.
- **Applicability + priority:** unconditional; priority high.
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (a technology preference silently changes the
  target) → C3. Change/regression TRIGGERED (a later technical answer conflicts with intent) → exercised in
  C1/C3 via the reopen obligation. Boundary `n/a: no finite-set/quantity/ordering-limit surface beyond the
  qualitative precedence`. Failure/recovery `n/a: no dependency/persistence failure surface`. Counterfactual
  `n/a: covered by RISK-06 substance teeth`.
- **Obligations:** O-PROJ02-1 Topics 2-5 MUST be confirmed before any architecture/stack direction locks;
  O-PROJ02-2 each system direction MUST name the specific confirmed upstream branch it derives from (not a
  bare "follows from product intent"); O-PROJ02-3 a later technical answer that conflicts with intent MUST
  reopen the earliest affected branch and record the resolution.
- **Checklist mirror:** `STARTUP-PROJ-SCENARIO-02-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-02-C1 — Intent-first, each direction traced (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C1 —
  exercises correct product-intent precedence}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** confirmed Topics 2-5; **When** Topics 7-9 record system/quality directions; **Then** each
  direction names the confirmed upstream branch it derives from and no user/outcome was narrowed after the
  fact.
- **Failure oracle:** a system direction with no named upstream branch.
- **Evidence tuple:** observed-via the ledger direction records; method per-direction upstream-reference
  check; confirms = every direction cites a confirmed branch.
- **Traces:** source legacy PROJ-02 Good → O-PROJ02-1, O-PROJ02-2 → `…-02-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-02-C2 — Architecture-before-users inversion (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C1 — exercises
  rejection of the scope inversion}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** an unconfirmed user/outcome set; **When** architecture or stack is chosen first and then used to
  narrow users, scope, value-features, or journeys after the fact; **Then** the family FAILs (architecture-
  before-users).
- **Prohibited effects:** a technical choice MUST NOT retroactively redefine the target user/outcome.
- **Failure oracle:** a users/scope/journey record whose content was set AFTER and to fit an architecture
  choice.
- **Evidence tuple:** observed-via ledger event order + cross-references; method ordering + derivation
  check; confirms = a downstream product branch dated/derived after the architecture choice it should
  precede.
- **Traces:** source legacy PROJ-02 Bad → O-PROJ02-1 → `…-02-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-02-C3 — Preference silently changes the target (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Change/regression}; primary Adversarial — an
  internally-complete artifact hides a target change). **Coverage-role:** {adversarial C1 — exercises the
  hidden-scope-change probe; change/regression C4 — exercises the before/after target comparison}.
- **Actor / role:** an author dressing a tech preference as a product decision / evaluator (checker).
- **Given** every topic checkpoint reads internally complete; **When** a plausible architecture decision
  cites only a technology preference yet silently changes the target user or outcome; **Then** the family
  FAILs it — internal completeness does not license a silent scope change.
- **Prohibited effects:** a locally-complete checkpoint set MUST NOT hide a cross-topic target change.
- **Failure oracle:** a target user/outcome that differs before vs after an architecture decision with no
  reopened branch.
- **Evidence tuple:** observed-via before/after target comparison across the architecture event; method
  cross-topic diff; confirms = a changed target with no recorded reopen/resolution.
- **Traces:** source legacy PROJ-02 Adversarial → O-PROJ02-3 → `…-02-CHECK-*`.

### STARTUP-PROJ-SCENARIO-03 — Design-bearing directions are researched and user-decided

- **Set:** S1 · **Declared primary category:** C1 Purpose/outcomes/scope → **Project** perspective ·
  **Secondary tags:** C10 (decision brief / prior art / citation), C7 (a hard-to-reverse choice).
- **Primary justification (SR-4):** the family turns on how a design-BEARING product/architecture/stack
  DIRECTION is set — with internal + external prior art and an explicit user decision — a scope/direction
  concern about what the product commits to. The decision-brief evidence (C10) is the proof standard and the
  irreversibility (C7) the stake; C1 is the defining discrimination because the family judges the DIRECTION,
  not merely the citation's followability.
- **Source / rationale:** legacy PROJ-03 (golden-path); SG-1; D14 starting hypothesis (C1, retained on this
  analysis); T1 ledger for PROJ-03.
- **Actor + outcome:** the manager records a decision brief; the user decides. Outcome: the chosen direction
  is reference-informed and user-owned, at direction altitude.
- **Situation / invariant:** a design-bearing branch selects/changes a product, architecture, stack,
  convention, quality, or roadmap direction. Invariant: brief with prior art + distinct alternatives +
  recommendation-first + evidence-to-change + user choice + rejected alternatives; no invented mechanism.
- **Applicability + priority:** predicate — applies when a branch is design-bearing; priority high.
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (a bare preference dressed as a decision) → C3.
  Counterfactual TRIGGERED (the "recommendation stands even if evidence changes" premise) → exercised via the
  evidence-to-change element in C1. Boundary `n/a: no exact quantity/limit surface`. Failure/recovery `n/a:
  no runtime failure surface`. Change/regression `n/a: a direction change is itself the subject, not a
  before/after compat test`.
- **Obligations:** O-PROJ03-1 a design-bearing branch MUST carry a decision brief (internal+external prior
  art, ≥1 source per load-bearing rationale with applicability+constraint, distinct alternatives,
  recommendation-first, evidence-to-change, the user's chosen direction+rationale, rejected alternatives);
  O-PROJ03-2 the recorded direction MUST stay at direction altitude (no interfaces/algorithms/schemas/task
  breakdown invented during startup); O-PROJ03-3 a first user preference MUST NOT be recorded as settled and
  a citation MUST NOT be fabricated.
- **Checklist mirror:** `STARTUP-PROJ-SCENARIO-03-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-03-C1 — Reference-informed, user-decided direction (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C1 —
  exercises a well-formed design decision; C10 — exercises the decision-brief evidence}.
- **Actor / role:** manager (producer) + user (decider) / evaluator (checker).
- **Given** a design-bearing branch; **When** the decision brief is built and the user chooses; **Then** the
  brief carries prior art with per-rationale sources, distinct alternatives, a recommendation named first, an
  evidence-to-change, the user's chosen direction and rationale, and the rejected alternatives — all at
  direction altitude.
- **Failure oracle:** a missing brief element or mechanism-level detail invented during startup.
- **Evidence tuple:** observed-via the decision brief; method element-by-element presence + altitude check;
  confirms = all seven brief elements present, none below direction altitude.
- **Traces:** source legacy PROJ-03 Good → O-PROJ03-1, O-PROJ03-2 → `…-03-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-03-C2 — Preference-as-settled or invented mechanism (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C1 — exercises
  rejection of an unresearched or over-detailed decision}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** a design-bearing branch; **When** the manager records the user's first preference as settled,
  fabricates a citation, presents no recommendation, or designs detailed interfaces/algorithms/schemas/task
  breakdown during startup; **Then** the family FAILs.
- **Prohibited effects:** a first preference MUST NOT be promoted to a settled direction; no fabricated
  citation; no mechanism-altitude design.
- **Failure oracle:** a settled direction with no alternatives/decision record, a fabricated source, or
  mechanism detail in a startup record.
- **Evidence tuple:** observed-via the brief + cited sources; method citation verification + altitude check;
  confirms = a missing element, an unverifiable citation, or mechanism detail.
- **Traces:** source legacy PROJ-03 Bad → O-PROJ03-1, O-PROJ03-2, O-PROJ03-3 → `…-03-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-03-C3 — Bare preference dressed as a decision (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Counterfactual}; primary Adversarial — a
  well-reasoned-looking record with no decision substance). **Coverage-role:** {adversarial C1 — exercises
  the dressed-preference probe; C10 — exercises the missing decision-record discrimination}.
- **Actor / role:** an author presenting a preference as reference-informed / evaluator (checker).
- **Given** a hard-to-reverse choice that looks well reasoned; **When** it has no rejected alternative and no
  user-decision record; **Then** the family FAILs it — a bare preference dressed as a reference-informed
  decision does not pass.
- **Prohibited effects:** persuasive prose MUST NOT substitute for an alternatives-and-decision record.
- **Failure oracle:** an irreversible direction with zero rejected alternatives or no user-decision marker.
- **Evidence tuple:** observed-via the brief; method alternatives + user-decision presence test; confirms =
  no rejected alternative and no decision record on a load-bearing choice.
- **Traces:** source legacy PROJ-03 Adversarial → O-PROJ03-1 → `…-03-CHECK-*`.

### STARTUP-PROJ-SCENARIO-04 — License, distribution, governance, and authority are explicit

- **Set:** S1 · **Declared primary category:** C7 Trust/harm/governance → **Risk** perspective ·
  **Secondary tags:** C1 (Topic 1.4 scope), C10 (repository/license evidence).
- **Primary justification (SR-4):** the family turns on a GOVERNANCE surface — the license/distribution/
  governance decision and WHO has the authority to make it — where the harm is an unauthorized or fabricated
  legal claim. C7 is declared over the topic-scope framing (C1) because the defining discrimination is
  decision authority + license correctness, an abuse/harm surface, not merely whether Topic 1.4 was reached.
- **Source / rationale:** legacy PROJ-04 (coverage-matrix); D14 (C7, retained); T1 ledger for PROJ-04.
- **Actor + outcome:** the authorized decider records license/governance. Outcome: a verified, authorized
  license/distribution/governance answer, or a confirmed internal `not applicable` with a reason.
- **Situation / invariant:** Topic 1.4 must close even when the project is internal or has no external
  distribution. Invariant: repository evidence + recorded authority support the claim; unresolved legal
  constraints have owner+method.
- **Applicability + priority:** unconditional (Topic 1.4 always closes); priority high (governance harm).
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (a common-default guess) → C3. Boundary
  TRIGGERED (the internal `not applicable` edge — the limit case where no external distribution exists) →
  C4. Failure/recovery `n/a: no runtime failure surface`. Change/regression `n/a: no version-change event`.
  Counterfactual `n/a: no load-bearing premise inversion`.
- **Obligations:** O-PROJ04-1 Topic 1.4 MUST record a verified license/distribution/governance answer OR a
  confirmed internal `not applicable`(+reason); O-PROJ04-2 the actual repository evidence AND the recorded
  decision authority MUST support the claim; O-PROJ04-3 any unresolved legal/governance constraint MUST have
  an owner and resolution method.
- **Checklist mirror:** `STARTUP-PROJ-SCENARIO-04-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-04-C1 — Verified, authorized governance answer (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C7 —
  exercises a correctly-governed decision}.
- **Actor / role:** the authorized decider (producer) / evaluator (checker).
- **Given** Topic 1.4; **When** the license/distribution/governance answer is recorded; **Then** it is
  supported by repository evidence, made by the recorded authority, and any unresolved constraint has an
  owner+method.
- **Failure oracle:** a claim unsupported by repo evidence or made without recorded authority.
- **Evidence tuple:** observed-via the license record + repo files + authority marker; method evidence +
  authority verification; confirms = repo-supported claim by an authorized decider.
- **Traces:** source legacy PROJ-04 Good → O-PROJ04-1, O-PROJ04-2 → `…-04-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-04-C2 — Missing, skipped, or unauthorized (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C7 — exercises
  rejection of an ungoverned decision}.
- **Actor / role:** an unauthorized decider / evaluator (checker).
- **Given** Topic 1.4; **When** it is missing, silently skipped, guessed, or decided by someone without the
  recorded authority; **Then** the family FAILs (missing-license).
- **Prohibited effects:** a license/governance decision MUST NOT be settled by an unauthorized actor or
  guessed.
- **Failure oracle:** an absent Topic 1.4 or a decision by a non-authorized actor.
- **Evidence tuple:** observed-via the record + authority marker; method presence + authority check;
  confirms = missing record or wrong authority.
- **Traces:** source legacy PROJ-04 Bad → O-PROJ04-1, O-PROJ04-2 → `…-04-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-04-C3 — "MIT because it's common" (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — a plausible
  default masquerades as a decision). **Coverage-role:** {adversarial C7 — exercises the default-guess
  probe; C10 — exercises the repo-evidence discrimination}.
- **Actor / role:** an author defaulting to a common license / evaluator (checker).
- **Given** no license file, user confirmation, or authorized decision; **When** the baseline confidently
  says "MIT" because that is common; **Then** the family FAILs it — a confident default is not a verified,
  authorized answer.
- **Prohibited effects:** a common default MUST NOT stand in for repository evidence + authority.
- **Failure oracle:** a stated license with no supporting license file, confirmation, or authority.
- **Evidence tuple:** observed-via the repo + record; method file-existence + confirmation check; confirms =
  a stated license unsupported by any of the three.
- **Traces:** source legacy PROJ-04 Adversarial → O-PROJ04-2 → `…-04-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-04-C4 — Internal `not applicable` at the exact edge (boundary)
- **Primary type:** Boundary/edge (matched {Boundary, Positive}; primary Boundary — the exact edge where no
  external distribution exists). **Coverage-role:** {boundary C7 — exercises the `not applicable` limit}.
- **Actor / role:** the authorized decider / evaluator (checker).
- **Given** an internal project with no external distribution; **When** Topic 1.4 closes; **Then** it records
  a CONFIRMED `not applicable`(+reason) — not a silent skip and not an invented external license.
- **Failure oracle:** an internal project whose Topic 1.4 is blank rather than a confirmed reasoned
  `not applicable`.
- **Evidence tuple:** observed-via the Topic 1.4 record; method presence-of-reasoned-n/a check; confirms = a
  confirmed `not applicable` with a stated reason.
- **Traces:** source legacy PROJ-04 Good (internal `not applicable`) → O-PROJ04-1 → `…-04-CHECK-*`.

### STARTUP-PROJ-SCENARIO-05 — The load-bearing problem is grounded in behavioral evidence

- **Set:** S1 · **Declared primary category:** C1 Purpose/outcomes/scope → **Project** perspective ·
  **Secondary tags:** C10 (behavioral evidence), C2 (the named user).
- **Primary justification (SR-4):** the family turns on whether the project's load-bearing PROBLEM — its
  reason to exist — is real, grounded in concrete past behavior for a named user. The behavioral evidence
  (C10) is the proof standard and the user (C2) its subject; C1 is declared over the order-default C2 because
  the defining discrimination is the PROBLEM's reality (a purpose claim), not who holds it.
- **Source / rationale:** legacy PROJ-05 (golden-path); SG-5, SA-4; T1 ledger for PROJ-05.
- **Actor + outcome:** the manager promotes a problem as `confirmed`. Outcome: the problem rests on a
  concrete last instance with past behavior.
- **Situation / invariant:** the baseline promotes a problem as `confirmed` and later loops build design on
  it. Invariant: grounded in a concrete last instance (a workaround built, effort/time/money spent, a
  repeated struggle) for a named user at a stated recurrence.
- **Applicability + priority:** unconditional; priority high (foundational).
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (a fluent evidence-free paragraph) → C3.
  Counterfactual TRIGGERED (invert "the problem is real" → the disconfirmation is the missing past behavior)
  → exercised in C3's oracle. Boundary `n/a: no quantity/limit surface`. Failure/recovery `n/a: no runtime
  failure`. Change/regression `n/a: no version event`.
- **Obligations:** O-PROJ05-1 a `confirmed` load-bearing problem MUST cite a concrete last instance with
  past behavior for a named user at a stated recurrence; O-PROJ05-2 stated interest / "users would love
  this" / a compliment / a hypothetical MUST NOT satisfy the problem-evidence standard.
- **Checklist mirror:** `STARTUP-PROJ-SCENARIO-05-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-05-C1 — Problem grounded in a concrete last instance (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C1 —
  exercises a real, evidenced problem}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** a problem promoted `confirmed`; **When** the evaluator reads its grounding; **Then** it names a
  concrete last instance — a workaround built, effort/time/money spent, or a repeated struggle — for a named
  user at a stated recurrence.
- **Failure oracle:** a `confirmed` problem with no concrete past-behavior instance.
- **Evidence tuple:** observed-via the problem record; method behavioral-instance presence check; confirms =
  a named user + a dated past behavior + a recurrence.
- **Traces:** source legacy PROJ-05 Good → O-PROJ05-1 → `…-05-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-05-C2 — Interest/compliment/hypothetical as grounding (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C1 — exercises
  rejection of non-behavioral grounding}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** a `confirmed` problem; **When** it rests on stated interest, "users would love this", a
  compliment, or a hypothetical with no past behavior; **Then** the family FAILs.
- **Prohibited effects:** stated interest MUST NOT be recorded as behavioral evidence.
- **Failure oracle:** a problem whose only support is intent/opinion/hypothetical.
- **Evidence tuple:** observed-via the problem record; method claim-kind classification; confirms = grounding
  is intent/opinion, not observed behavior.
- **Traces:** source legacy PROJ-05 Bad → O-PROJ05-1, O-PROJ05-2 → `…-05-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-05-C3 — Fluent evidence-free paragraph stamped confirmed (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Counterfactual, Negative}; primary Adversarial
  — polished prose games the evidence gate). **Coverage-role:** {adversarial C1 — exercises the anti-cosmetic
  probe; C10 — exercises the behavioral-evidence discrimination; counterfactual C1 — inverts "the problem is
  real" and finds no disconfirming behavior}.
- **Actor / role:** an author producing fluent evidence-free prose / evaluator (checker).
- **Given** a problem stamped `confirmed`; **When** its grounding is the fluent paragraph "our users are
  time-pressed developers who deeply value speed and will adopt this because it fits their workflow"; **Then**
  the family FAILs it — it reads complete, names zero past behavior, and fails identically to a one-word
  answer.
- **Prohibited effects:** fluent prose MUST NOT pass the behavioral-evidence standard.
- **Failure oracle:** a `confirmed` problem whose body contains no concrete past behavior.
- **Evidence tuple:** observed-via the problem body; method behavioral-primitive count; confirms = zero
  behavioral primitives.
- **Traces:** source legacy PROJ-05 Adversarial → O-PROJ05-1 → `…-05-CHECK-*`.

### STARTUP-PROJ-SCENARIO-06 — One first user and their job are clear

- **Set:** S1 · **Declared primary category:** C2 Actors/stakeholders/use-context → **Usage** perspective
  (secondary Project) · **Secondary tags:** C1 (product-scope of "who we serve").
- **Primary justification (SR-4):** the family turns on WHO the product's first user is and the job they
  hire it for — an actor/use-context identity with a job-to-be-done, a current alternative, and a switching
  force. C2 is the defining discrimination (the actor and their job), with the product-scope framing (C1)
  secondary; this is the one PROJ family whose core is the actor, not the outcome.
- **Source / rationale:** legacy PROJ-06 (golden-path); D14 (C2, retained); T1 ledger for PROJ-06.
- **Actor + outcome:** the manager records the first user + job. Outcome: one named user/segment with a
  concrete job, a current alternative, and a switching force; distinct roles separated.
- **Situation / invariant:** the baseline records who the project serves and the job they hire it for.
  Invariant: one named first user, a job as situation→motivation→outcome, a current alternative, ≥1 switching
  force; user/operator/approver/affected separated where they exist.
- **Applicability + priority:** unconditional; priority high.
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (a named user but a feature-list "job") → C3.
  Boundary `n/a: no finite-set/quantity limit`. Failure/recovery `n/a: no runtime failure`. Change/regression
  `n/a: no version event`. Counterfactual `n/a: covered by RISK-06 substance teeth`.
- **Obligations:** O-PROJ06-1 the baseline MUST name one first user/segment with a concrete job
  (situation→motivation→outcome), the current alternative, and ≥1 switching force; O-PROJ06-2 distinct roles
  (user/operator/approver/affected) MUST be separated where they exist; O-PROJ06-3 "everyone" / a whole
  category / a vague persona MUST NOT satisfy the first-user requirement.
- **Checklist mirror:** `STARTUP-PROJ-SCENARIO-06-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-06-C1 — One named user with a real job (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C2 —
  exercises a clear first-user identity + job}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** the user/job record; **When** the evaluator reads it; **Then** it names one first user/segment, a
  job as situation→motivation→outcome, the current alternative, and ≥1 switching force, with distinct roles
  separated where present.
- **Failure oracle:** no named user, no job structure, or no current alternative.
- **Evidence tuple:** observed-via the user/job record; method element presence check; confirms = user + job
  + alternative + switching force all present.
- **Traces:** source legacy PROJ-06 Good → O-PROJ06-1, O-PROJ06-2 → `…-06-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-06-C2 — "Everyone" / vague persona (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C2 — exercises
  rejection of a non-specific actor}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** the user record; **When** it says "everyone", a whole category, or a vague persona; a "job" that
  is really a feature list; or no current alternative; **Then** the family FAILs.
- **Prohibited effects:** a whole category MUST NOT stand in for one named first user.
- **Failure oracle:** a user field that names a category/everyone, or a job that is a feature list.
- **Evidence tuple:** observed-via the user/job record; method specificity check; confirms = non-specific
  user or feature-list job.
- **Traces:** source legacy PROJ-06 Bad → O-PROJ06-1, O-PROJ06-3 → `…-06-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-06-C3 — Named user, feature-list job, no switching force (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — a
  superficially-specific record hides a missing job/alternative). **Coverage-role:** {adversarial C2 —
  exercises the feature-list-job probe}.
- **Actor / role:** an author naming a user but not the job / evaluator (checker).
- **Given** a named user; **When** the "job" is a feature list and no current alternative or switching force
  is recorded; **Then** the family FAILs it — nothing shows the user would actually change behavior.
- **Prohibited effects:** a named user MUST NOT excuse a missing job/alternative/switching-force.
- **Failure oracle:** a named user with a feature-list job and no alternative/switching force.
- **Evidence tuple:** observed-via the record; method job-structure + switching-force check; confirms = a job
  that is a feature list and no switching evidence.
- **Traces:** source legacy PROJ-06 Adversarial → O-PROJ06-1 → `…-06-CHECK-*`.

### STARTUP-PROJ-SCENARIO-07 — The product shape is solved, bounded, and traceable

- **Set:** S1 · **Declared primary category:** C1 Purpose/outcomes/scope → **Project** perspective ·
  **Secondary tags:** C4 (element connection / boundary coupling).
- **Primary justification (SR-4):** the family turns on whether the product SHAPE is solved at the macro
  level, rough at the detail level (no mechanism), and BOUNDED (explicit non-goals), with each direction
  tracing to a confirmed user/problem constraint. C1 is the defining discrimination (the in/out-of-scope
  product direction); the element-connection (C4) is the supporting structure the shape must cohere over.
- **Source / rationale:** legacy PROJ-07 (failure-mode); SG-4; T1 ledger for PROJ-07.
- **Actor + outcome:** the manager shapes a product direction. Outcome: a macro-solved, mechanism-free,
  bounded shape whose elements connect and trace to confirmed constraints.
- **Situation / invariant:** the baseline shapes a product direction later loops design against. Invariant:
  solved at macro level (elements, critical journeys, failure paths, boundary connect); rough at detail (no
  interface signatures/schemas/algorithms/task breakdown); bounded (explicit non-goals); each direction
  traces to a confirmed user/problem constraint + a studied reference.
- **Applicability + priority:** unconditional; priority high.
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (internally-complete checkpoints, incoherent
  shape) → C3. Boundary `n/a: the boundary here is a qualitative non-goal set, exercised in C1's oracle, not
  a numeric edge`. Failure/recovery `n/a: failure PATHS are part of the shape's macro completeness, not a
  runtime failure injection`. Change/regression `n/a: no version event`. Counterfactual `n/a: covered by
  RISK-06`.
- **Obligations:** O-PROJ07-1 the shaped direction MUST be macro-solved (elements/journeys/failure paths/
  boundary connect) and rough at detail (no mechanism); O-PROJ07-2 the shape MUST be bounded with explicit
  non-goals; O-PROJ07-3 each capability MUST trace to a confirmed user/problem reason and a studied
  reference.
- **Checklist mirror:** `STARTUP-PROJ-SCENARIO-07-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-07-C1 — Macro-solved, bounded, traceable shape (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C1 —
  exercises a well-formed product shape; C4 — exercises element coherence}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** a shaped product direction; **When** the evaluator reads it; **Then** it is macro-solved,
  mechanism-free, bounded with explicit non-goals, and every direction traces to a confirmed constraint + a
  reference.
- **Failure oracle:** a shape missing non-goals, diving into mechanism, or with an untraceable capability.
- **Evidence tuple:** observed-via the shape record; method macro/detail/boundary/trace check; confirms =
  connected elements + non-goals + per-capability trace.
- **Traces:** source legacy PROJ-07 Good → O-PROJ07-1, O-PROJ07-2, O-PROJ07-3 → `…-07-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-07-C2 — Vague, mechanism-diving, or untraceable (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C1 — exercises
  rejection of a malformed shape}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** a shaped direction; **When** the shape is vague (elements don't connect), OR dives into mechanism
  (interface signatures/schemas/algorithms/task breakdown), OR a capability has no traceable user/problem
  reason; **Then** the family FAILs.
- **Prohibited effects:** a shape MUST NOT ship vague, mechanism-level, or with an untraceable capability.
- **Failure oracle:** disconnected elements, mechanism detail, or an untraceable capability.
- **Evidence tuple:** observed-via the shape record; method connection + altitude + trace check; confirms =
  one of the three defects present.
- **Traces:** source legacy PROJ-07 Bad → O-PROJ07-1, O-PROJ07-2, O-PROJ07-3 → `…-07-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-07-C3 — Internally-complete but incoherent shape (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — locally-
  complete checkpoints hide a shape that does not cohere). **Coverage-role:** {adversarial C1 — exercises the
  cross-topic-coherence probe; C4 — exercises the boundary-vs-journey coupling}.
- **Actor / role:** an author whose checkpoints each read complete / evaluator (checker).
- **Given** every topic checkpoint reads internally complete; **When** the shape does not hang together — the
  boundary excludes a capability the primary journey needs, or a "feature" serves no recorded user job;
  **Then** the family FAILs it — local completeness does not prove a coherent shape.
- **Prohibited effects:** per-checkpoint completeness MUST NOT pass a shape whose boundary and journeys
  conflict.
- **Failure oracle:** a boundary that excludes a journey-required capability, or a feature with no user job.
- **Evidence tuple:** observed-via boundary vs journeys vs features cross-read; method coherence check;
  confirms = a boundary/journey/feature contradiction.
- **Traces:** source legacy PROJ-07 Adversarial → O-PROJ07-1, O-PROJ07-3 → `…-07-CHECK-*`.

### STARTUP-PROJ-SCENARIO-08 — Phase-result readouts exist, are really confirmed, faithful, resume-safe, and promotion-excluded

- **Set:** S1 · **Declared primary category:** C1 Purpose/outcomes/scope → **Project** perspective ·
  **Secondary tags:** C10 (confirmation oracle + source-register fidelity), C7 (record/memory promotion
  boundary), C6 (resume regeneration).
- **Primary justification (SR-4):** the family turns on whether the four phase-result readouts legitimately
  SYNTHESIZE and CONFIRM the problem/product baseline the later synthesis consumes — a purpose/process
  discrimination for building the RIGHT baseline (a Project concern: user-owned intent via real
  confirmation). The confirmation oracle + source-register fidelity (C10), the record/memory promotion
  boundary (C7), and resume regeneration (C6) are the supporting discriminations the cases exercise; C1 is
  declared over the higher-order C7/C6 matches because the defining discrimination is the legitimacy of the
  phase-synthesis that produces the confirmed baseline, not the harm surface or the recovery path.
- **Source / rationale:** NEW family (IP-1-e / D6). D1–D5; `recording.md § 1` phase-doc contract; SA-1, SA-3,
  SF-2, SE-2; AR-1/AR-2/AR-3; babok, readout. The reverse-sweep maps this new family to the IP-1-e user lock.
- **Actor + outcome:** the manager writes + separately confirms four phase readouts; a cold evaluator grades
  them. Outcome: four existing, really-confirmed, faithful, resume-safe, promotion-excluded readouts.
- **Situation / invariant:** at each phase close — after Topic 3 (Phase I), the Topic 4 premise gate
  (Phase II), Topic 8 (Phase III), Topic 11 (Phase IV) — a readout is written from the COMPLETE current-phase
  event set and separately confirmed before the next phase (and, after Phase IV, before the P4 synthesis
  step). Phase II's readout states the passed premise-gate result AND still requires its own separate
  confirmation (the Phase-II premise-gate + phase-close two-gate, preserved). The four readouts +
  `discussion-log.md` sit in the frozen P6.5 evaluated set by pointer (never quoted), record-level, never
  promoted. Invariant: existence + real-confirmation + fidelity + resume + promotion-exclusion.
- **Applicability + priority:** unconditional (every baseline has four phase closes); priority high.
- **Triggered minimums (SR-2/SR-3):** Failure/recovery TRIGGERED (resume regeneration + downstream
  invalidation) → C4. Adversarial TRIGGERED (SA-1 confirmation oracle; SA-3 promotion-leak) → C2, C5.
  Boundary `n/a: no exact numeric limit` (the count of four is fixed by the phase structure, graded as
  existence in C1, not a boundary). Change/regression `n/a: resume regeneration is failure/recovery, not a
  version/lifecycle change event`. Counterfactual `n/a: covered by RISK-06`.
- **Obligations:**
  - O-PROJ08-1 (existence): each of the four phase readouts MUST exist and be produced from the COMPLETE
    current-phase event set with a source register whose checkpoint/ledger/probe IDs resolve and belong to
    that phase; Phase II's readout MUST state the passed premise-gate result.
  - O-PROJ08-2 (real confirmation): each readout's gate state MUST become `confirmed` via a SEPARATE
    agree/disagree response about THAT readout in `discussion-log.md`, resolved by `confirmation_ref` — NEVER
    inferred from a topic checkpoint, the premise-gate pass, silence, or a later approval.
  - O-PROJ08-3 (fidelity): each readout body MUST preserve every cited claim's ledger `Status`/`Claim kind`,
    MUST NOT strengthen a claim / omit a contradiction / add a claim absent from the ledger, and every source
    ID MUST resolve AND belong to that phase.
  - O-PROJ08-4 (resume): on resume, each readout's validity MUST be re-derived from the CURRENT ledger — a
    superseded source event or a downstream reopen makes it `stale`, regenerated idempotently (same events →
    the same document) and re-confirmed before its phase gate re-closes; a stored `confirmed` flag MUST NOT
    be trusted.
  - O-PROJ08-5 (promotion-exclusion): the four readouts + `discussion-log.md` MUST stay record-level (in the
    frozen evaluated set by pointer, never quoted) and MUST NEVER be staged or entered into the promotion
    manifest / Wrap-up inventory.
- **Checklist mirror:** `STARTUP-PROJ-SCENARIO-08-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-08-C1 — Four readouts exist from the complete event set (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C1 —
  exercises the phase-doc existence + completeness + premise-gate two-gate}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** the four phase closes; **When** the evaluator inspects `working/phase-results/`; **Then** all
  four readouts (`phase-i/ii/iii/iv.md`) exist, each produced from the COMPLETE current-phase event set with
  a source register whose checkpoint/ledger/probe IDs resolve and belong to that phase, and `phase-ii.md`
  states the passed premise-gate result.
- **Failure oracle:** a missing readout, one built from a partial event set, or a source ID that does not
  resolve / belongs to another phase.
- **Evidence tuple:** observed-via `working/phase-results/` + each source register; method existence +
  source-resolution + phase-membership check; confirms = four complete, source-resolvable readouts.
- **Traces:** source IP-1-e, D1/D3; `recording.md § 1` → O-PROJ08-1 → `…-08-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-08-C2 — confirmation_ref points at a checkpoint, not a separate agree/disagree (adversarial, SA-1)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — the
  confirmation oracle probes real confirmation vs file creation). **Coverage-role:** {adversarial C10 —
  exercises the real-confirmation oracle; C1 — the phase-gate legitimacy}.
- **Actor / role:** an author with polished but falsely-confirmed docs / evaluator (checker).
- **Given** all four phase docs exist with polished prose; **When** a readout's `confirmation_ref` resolves
  to a Topic checkpoint, the premise-gate pass, silence, or a later approval of a downstream artifact rather
  than a SEPARATE agree/disagree response to THAT readout; **Then** the family FAILs it — the oracle proves
  real confirmation, not file creation.
- **Prohibited effects:** a topic-checkpoint / premise-gate / silence / later-approval `confirmation_ref`
  MUST NOT count as a real readout confirmation.
- **Failure oracle:** a `confirmation_ref` resolving to anything other than a separate agree/disagree
  exchange about that readout.
- **Evidence tuple:** observed-via `confirmation_ref` → `discussion-log.md`; method confirmation-source
  classification; confirms = a non-separate confirmation source.
- **Traces:** source SA-1, D4, AR-1; `recording.md § 1` → O-PROJ08-2 → `…-08-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-08-C3 — Readout strengthens / omits / adds a claim (negative, SF-2 fidelity)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C10 — exercises
  rejection of an unfaithful readout}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** a readout + its source register; **When** the readout strengthens a ledger claim, silently omits
  a contradicted/open item, adds a claim absent from the ledger, or cites a source ID that does not resolve
  or belongs to another phase; **Then** the family FAILs (a Consistency FAIL).
- **Prohibited effects:** a readout MUST NOT strengthen / omit / add a claim or cite a cross-phase /
  unresolvable source.
- **Failure oracle:** a readout claim with no resolvable in-phase ledger source, or a status stronger than
  its ledger entry.
- **Evidence tuple:** observed-via each readout claim vs its ledger source; method claim-by-claim fidelity +
  source-resolution; confirms = a strengthened / omitted / added / mis-sourced claim.
- **Traces:** source SF-2, D3, AR-2; `recording.md § 1` → O-PROJ08-3 → `…-08-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-08-C4 — Resume re-derives validity and regenerates stale readouts (failure/recovery, SE-2)
- **Primary type:** Failure/recovery (matched {Failure/recovery, Positive}; primary Failure/recovery — the
  defining discrimination is recovery-by-regeneration on resume). **Coverage-role:** {failure/recovery C6 —
  exercises resume re-derivation + downstream invalidation + re-confirmation working}.
- **Actor / role:** a resumed session (subject) / evaluator (checker).
- **Given** a resume with a corrected/superseded source event or a reopened earlier phase; **When** the
  session resumes; **Then** each readout's validity is re-derived from the CURRENT ledger — a readout with a
  superseded source event or downstream of a reopened phase becomes `stale`, is regenerated idempotently
  (same events → the same document), and is re-confirmed before its phase gate re-closes — never trusting a
  stored `confirmed` flag.
- **Failure oracle:** a resume that trusts a stale `confirmed` flag, or fails to regenerate + re-confirm a
  stale readout.
- **Evidence tuple:** observed-via the resume behavior against a corrected ledger; method re-derivation +
  staleness + idempotent-regeneration check; confirms = correct stale detection + regeneration + re-confirm.
- **Traces:** source SE-2, D4/D5; `recording.md § 1` → O-PROJ08-4 → `…-08-CHECK-*`.

#### STARTUP-PROJ-SCENARIO-08-C5 — Phase doc copied into staging/promotion (adversarial, SA-3 promotion-exclusion)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — record-level
  usefulness tempts a promotion leak). **Coverage-role:** {adversarial C7 — exercises the record/memory
  boundary; C1 — the baseline-build legitimacy}.
- **Actor / role:** an author copying a useful phase doc "for future reference" / evaluator (checker).
- **Given** a useful, user-confirmed phase readout; **When** it is copied into `staging/` or entered into the
  promotion manifest "for future reference", or any `phase-results/` path appears in a staging dir or the
  promotion / Wrap-up inventory; **Then** the family FAILs it — record-level usefulness does not change the
  record/memory boundary; the four readouts + `discussion-log.md` are never promoted.
- **Prohibited effects:** a `phase-results/` path MUST NOT appear in staging or the promotion manifest.
- **Failure oracle:** a `phase-results/` or `discussion-log` path in any staging dir or promotion / Wrap-up
  inventory.
- **Evidence tuple:** observed-via the staging set + promotion manifest (by pointer, never quoted); method
  `phase-results`-path scan; confirms = a staged/promoted phase doc.
- **Traces:** source SA-3, AR-3, D1; `recording.md § 1` (never staged, never promoted) → O-PROJ08-5 →
  `…-08-CHECK-*`.

---

## Set S2 — Viability & inclusion

Whether the product can actually be BUILT, RUN, and USED: dependency and operational structure, buildability
and sustainability, a proportionate evidence-led interview, and accessibility / i18n / operator inclusion.

### S2 coverage register (SR-1 — ten dispositions)

| # | Category | Disposition | Basis |
|---|---|---|---|
| C1 | Purpose / outcomes / scope | covered-elsewhere → S1 | ledger below |
| C2 | Actors / stakeholders / use-context | selected | USAGE-03 secondary (operators / end users) |
| C3 | Behavior / state / data | covered-elsewhere → S3 | ledger below |
| C4 | Interfaces / dependencies / structure | selected | STRUCT-04 primary |
| C5 | Quality attributes / resource economics | selected | STRUCT-05, PERF-01 primary |
| C6 | Failure / recovery / operations | selected | STRUCT-04/05 (dependency + upkeep failure), USAGE-03 (operator diagnosis) |
| C7 | Trust / harm / governance | selected | STRUCT-04 secondary (untrusted dependency source) |
| C8 | Inclusion / locale | selected | USAGE-03 primary |
| C9 | Change / compatibility / reversibility | covered-elsewhere → S3 | ledger below |
| C10 | Evidence / traceability / clarity | selected | PERF-01 (evidence-state), STRUCT-05 secondary |

**SR-7 covered-elsewhere ledgers (S2):**
- **C1 Purpose/scope → S1.** Applicable families S1 PROJ-01/02/03/05/07; triggered types positive + negative
  + adversarial + boundary; oracles = a dropped branch / a scope inversion / an incoherent shape; actor = the
  manager. Covering clause: S1 PROJ-01…07.
- **C3 Behavior/state/data → S3.** Applicable families S3 STRUCT-01/02, PERF-02; triggered types positive +
  negative + adversarial; oracle = a non-atomic record / an off-table destination; actor = the manager.
  Covering clause: S3 STRUCT-01, STRUCT-02, PERF-02.
- **C9 Change/compatibility → S3.** Applicable families S3 USAGE-02 (resume/rerun); triggered types
  change/regression + failure/recovery; oracle = a rerun that blind-appends; actor = a later session.
  Covering clause: S3 USAGE-02.

**S2 populated cells (17):** C4×{positive, negative}=2; C6×{failure/recovery}=1; C7×{positive,
adversarial}=2; C5×{positive, negative, adversarial, counterfactual, boundary}=5; C8×{positive, negative,
adversarial}=3; C10×{positive, adversarial, counterfactual}=3; C2×{positive}=1 = 17. Within ~40.

### STARTUP-STRUCT-SCENARIO-04 — Dependency and operational structure is explicit or proven irrelevant

- **Set:** S2 · **Declared primary category:** C4 Interfaces/dependencies/structure → **Structure**
  perspective (secondary Consistency) · **Secondary tags:** C6 (operational diagnostics / failure fallback),
  C7 (untrusted dependency source).
- **Primary justification (SR-4):** the family turns on dependency CONTRACTS — source, version/constraint,
  license/approval, failure-fallback, structural graph impact — and operational structure being explicit or
  proven irrelevant. C4 is the defining discrimination (the dependency/interface contract); the operational
  diagnostics (C6) and the trust of the dependency source (C7) are the supporting concerns the cases exercise.
- **Source / rationale:** legacy STRUCT-04 (coverage-matrix); D14 (C4, retained); T1 ledger for STRUCT-04.
- **Actor + outcome:** the manager records dependency + operational directions. Outcome: each dependency and
  operational component is specified or proven irrelevant with a reason.
- **Situation / invariant:** Topics 7-9 may establish dependency, supply-chain, trust-boundary, runtime,
  observability, and ownership directions. Invariant: each dependency names source/version/license/fallback/
  graph-impact; each boundary + data-flow is consistent with the architecture + data promises; logs/metrics/
  traces/alerts/runbooks/ownership are recorded or proven irrelevant.
- **Applicability + priority:** predicate — applies where dependency/operational directions exist; priority
  high.
- **Triggered minimums (SR-2/SR-3):** Failure/recovery TRIGGERED (external dependency + fallback) → C3.
  Adversarial TRIGGERED (untrusted supply-chain source) → C4-case. Boundary `n/a: no exact numeric/finite-set
  limit`. Change/regression `n/a: no version-change event within a dependency's own lifecycle here`.
  Counterfactual `n/a: covered by RISK-06`.
- **Obligations:** O-STRUCT04-1 each dependency MUST name source, version/constraint, license/approval,
  failure-fallback, and structural graph impact where applicable; O-STRUCT04-2 each system boundary and
  data-flow MUST be consistent with the recorded architecture and data promises; O-STRUCT04-3 logs/metrics/
  traces/alerts/runbooks/ownership MUST be recorded or the branch proven irrelevant with a reason.
- **Checklist mirror:** `STARTUP-STRUCT-SCENARIO-04-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-04-C1 — Fully specified dependency + operational structure (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C4 —
  exercises complete dependency + operational specification; C7 — exercises the trusted-source / approval
  acceptance (the C7 safe behavior succeeding)}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** dependency and operational directions; **When** the evaluator reads them; **Then** each
  dependency names source/version/license/fallback/graph-impact, each boundary and data-flow is consistent
  with the architecture, and diagnostics/ownership are recorded or proven irrelevant.
- **Failure oracle:** a dependency or operational component with a missing required field and no
  proven-irrelevant reason.
- **Evidence tuple:** observed-via the dependency + operational records; method field-completeness +
  consistency check; confirms = every field present or reasoned-n/a.
- **Traces:** source legacy STRUCT-04 Good → O-STRUCT04-1, O-STRUCT04-2, O-STRUCT04-3 → `…-04-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-04-C2 — Untrusted source / absent graph impact / no ownership (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C4 — exercises
  rejection of an unspecified dependency/operational structure}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** dependency/operational directions; **When** an essential dependency is accepted from an
  untrusted source, its graph impact is absent, or an operationally-important component has no diagnostic or
  ownership; **Then** the family FAILs.
- **Prohibited effects:** an essential dependency MUST NOT be accepted without source/graph-impact, and an
  operational component MUST NOT ship with no owner/diagnostic.
- **Failure oracle:** an untrusted-source dependency, an absent graph impact, or an undiagnosable component.
- **Evidence tuple:** observed-via the dependency + operational records; method source-trust + completeness
  check; confirms = a missing source/graph/ownership field on an essential component.
- **Traces:** source legacy STRUCT-04 Bad → O-STRUCT04-1, O-STRUCT04-3 → `…-04-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-04-C3 — Essential dependency failure-fallback (failure/recovery)
- **Primary type:** Failure/recovery (matched {Failure/recovery, Positive}; primary Failure/recovery — the
  defining discrimination is the injected dependency failure and its fallback). **Coverage-role:**
  {failure/recovery C6 — exercises the dependency-failure fallback + operational diagnosis}.
- **Actor / role:** the running system (subject) / evaluator (checker).
- **Given** an essential dependency the architecture assumes; **When** that dependency fails or is
  unavailable; **Then** the baseline names a failure-fallback and the operational diagnostics needed to
  detect and recover — or the family FAILs.
- **Failure oracle:** an essential dependency with no recorded failure-fallback while the architecture
  assumes availability.
- **Evidence tuple:** observed-via the dependency record + operational directions; method fallback-presence
  check; confirms = a named fallback + diagnosis path, or its absence.
- **Traces:** source legacy STRUCT-04 Good/Bad (fallback + graph impact) → O-STRUCT04-1, O-STRUCT04-3 →
  `…-04-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-04-C4 — "Popular so it's fine" dependency (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — popularity
  masks an unspecified dependency). **Coverage-role:** {adversarial C7 — exercises the untrusted-popularity
  probe}.
- **Actor / role:** an author accepting a popular dependency unspecified / evaluator (checker).
- **Given** a dependency that looks harmless because it is already popular; **When** its version, license,
  failure mode, and authority are absent while the architecture assumes it is always available; **Then** the
  family FAILs it — popularity is not specification.
- **Prohibited effects:** popularity MUST NOT excuse a missing version/license/failure-mode/authority.
- **Failure oracle:** a popular dependency with absent version/license/failure-mode/authority.
- **Evidence tuple:** observed-via the dependency record; method field-presence check on the popular
  dependency; confirms = missing specification behind a popularity claim.
- **Traces:** source legacy STRUCT-04 Adversarial → O-STRUCT04-1 → `…-04-CHECK-*`.

### STARTUP-STRUCT-SCENARIO-05 — The shaped direction is feasible to build and sustainable to run

- **Set:** S2 · **Declared primary category:** C5 Quality attributes/resource economics → **Performance**
  perspective (secondary Risk) · **Secondary tags:** C4 (essential dependencies), C6 (failure-recovery /
  upkeep).
- **Primary justification (SR-4):** the family turns on whether the shaped direction is FEASIBLE to build
  (skills/dependencies available) and SUSTAINABLE to run (capacity/ownership/failure-recovery/upkeep across
  its life) — a resource-economics/feasibility discrimination. The dependency contracts (C4) and the upkeep
  failure-recovery (C6) are the vehicles; C5 is defining because the family judges buildability and
  run-cost-over-life, not the dependency contract itself.
- **Source / rationale:** legacy STRUCT-05 (failure-mode); D14 (C5, retained); T1 ledger for STRUCT-05.
- **Actor + outcome:** the team builds/runs the shaped direction. Outcome: buildable with available skills/
  deps and sustainable across its intended life.
- **Situation / invariant:** the baseline commits to a product direction the team must build and operate.
  Invariant: buildable with available skills/deps (each essential dep names source/version/approval/failure-
  fallback); sustainable across life (capacity/ownership/failure-recovery/upkeep named or proven irrelevant).
- **Applicability + priority:** unconditional; priority high.
- **Triggered minimums (SR-2/SR-3):** Failure/recovery TRIGGERED (sustainability = failure-recovery + upkeep
  across life) → C3. Adversarial TRIGGERED (elegant-but-un-buildable shape) → C4. Counterfactual `n/a:
  covered by RISK-06`. Boundary `n/a: no exact numeric limit`. Change/regression `n/a: no version event`.
- **Obligations:** O-STRUCT05-1 the shaped direction MUST be buildable with the available skills/
  dependencies/constraints, each essential dependency naming source/version/approval/failure-fallback;
  O-STRUCT05-2 the direction MUST be sustainable across its life — capacity, ownership, failure-recovery, and
  upkeep named or proven irrelevant; O-STRUCT05-3 an elegant-but-un-buildable/un-sustainable shape MUST fail
  even when every topic checkpoint reads complete.
- **Checklist mirror:** `STARTUP-STRUCT-SCENARIO-05-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-05-C1 — Buildable and sustainable direction (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C5 —
  exercises feasibility + sustainability}.
- **Actor / role:** the team (builder/operator) / evaluator (checker).
- **Given** a shaped direction; **When** the evaluator checks feasibility and sustainability; **Then** it is
  buildable with available skills/deps (each essential dep specified) and sustainable across life (capacity/
  ownership/failure-recovery/upkeep named or proven irrelevant).
- **Failure oracle:** a required skill/dependency the team lacks, or a missing sustainability direction.
- **Evidence tuple:** observed-via the shape + skills/deps + sustainability records; method feasibility +
  sustainability check; confirms = buildable + sustainable or reasoned-n/a.
- **Traces:** source legacy STRUCT-05 Good → O-STRUCT05-1, O-STRUCT05-2 → `…-05-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-05-C2 — Missing skills/owner/upkeep/capacity (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C5 — exercises
  rejection of an infeasible/unsustainable direction}.
- **Actor / role:** the team (subject) / evaluator (checker).
- **Given** a shaped direction; **When** it assumes skills/deps the team cannot get, an essential component
  has no owner/failure-recovery/upkeep, or a continuously-running capability has no capacity/diagnostic;
  **Then** the family FAILs.
- **Prohibited effects:** a direction MUST NOT depend on unavailable skills/deps or ship a component with no
  owner/upkeep.
- **Failure oracle:** an unavailable-skill assumption or an unowned/unmaintained component.
- **Evidence tuple:** observed-via the skills/deps + sustainability records; method availability + ownership
  check; confirms = an unavailable dependency or a missing owner/upkeep.
- **Traces:** source legacy STRUCT-05 Bad → O-STRUCT05-1, O-STRUCT05-2 → `…-05-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-05-C3 — Sustainability across life (failure/recovery)
- **Primary type:** Failure/recovery (matched {Failure/recovery, Positive}; primary Failure/recovery — the
  defining discrimination is upkeep + recovery across the run life). **Coverage-role:** {failure/recovery C6
  — exercises capacity/ownership/failure-recovery/upkeep across life}.
- **Actor / role:** the operator (subject) / evaluator (checker).
- **Given** a continuously-running capability; **When** it must be operated across its intended life; **Then**
  capacity, ownership, failure-recovery, and upkeep are named or proven irrelevant — or the family FAILs.
- **Failure oracle:** a running capability with no failure-recovery or upkeep direction.
- **Evidence tuple:** observed-via the sustainability directions; method across-life completeness check;
  confirms = named recovery/upkeep or a missing one.
- **Traces:** source legacy STRUCT-05 Good/Bad (sustainable to run) → O-STRUCT05-2 → `…-05-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-05-C4 — Elegant but un-buildable in practice (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Counterfactual}; primary Adversarial — an
  internally-coherent shape hides an un-buildable dependency). **Coverage-role:** {adversarial C5 — exercises
  the elegant-but-infeasible probe}.
- **Actor / role:** an author whose shape reads complete / evaluator (checker).
- **Given** an elegant, internally-coherent product shape; **When** it depends on a capability no one on the
  team can build or maintain, or on a dependency with no fallback; **Then** the family FAILs it — sound on
  paper, un-buildable/un-sustainable in practice, while every checkpoint reads complete.
- **Prohibited effects:** internal coherence MUST NOT pass an un-buildable/un-sustainable dependency.
- **Failure oracle:** a load-bearing capability/dependency with no one able to build/maintain it and no
  fallback.
- **Evidence tuple:** observed-via the shape vs the team's skills/deps; method build-capability check;
  confirms = an un-buildable dependency behind a coherent shape.
- **Traces:** source legacy STRUCT-05 Adversarial → O-STRUCT05-3 → `…-05-CHECK-*`.

### STARTUP-PERF-SCENARIO-01 — Interview depth follows evidence state and design risk

- **Set:** S2 · **Declared primary category:** C5 Quality attributes/resource economics → **Performance**
  perspective (secondary Risk) · **Secondary tags:** C10 (evidence-state classification / probe recording).
- **Primary justification (SR-4):** the family turns on interview-depth ECONOMICS — effort follows each
  answer's EVIDENCE STATE and each choice's design risk (uncertainty × reversibility × magnitude), never a
  fixed cadence or turn/question/probe count. C5 is the defining discrimination (proportionate effort); the
  evidence-state classification and the `{branch}.p{n}` probe recording (C10) are the mechanism the grading
  reads. This family carries the IP-2-d cadence-predicate reframe and the IP-3-d depth grading.
- **Source / rationale:** legacy PERF-01 (golden-path); SG-2, SG-3, SA-2, SE-3; IP-2-d, IP-3-d; VA-09; T1
  ledger for PERF-01 (including the reframed `:148` predicate).
- **Actor + outcome:** the manager runs the interview at evidence-led depth. Outcome: depth is proportional
  to evidence state and risk; no branch closes while under-evidenced; grading never reads a count.
- **Situation / invariant:** all 46 branches are mandatory, but existing evidence and design risk vary by
  branch. Invariant: depth follows evidence state × risk; each supplied axis is its own ledger event; probes
  are flat/monotonic `{branch}.p{n}`; the grade is on evidence state, never on turn/question/probe count.
- **Applicability + priority:** unconditional; priority high (this family is the anti-cadence teeth).
- **Triggered minimums (SR-2/SR-3):** Boundary TRIGGERED (the ≤2 repair cap for a still-vague answer) → C5.
  Adversarial TRIGGERED (a short run that under-scrutinizes an irreversible choice) → C3. Counterfactual
  TRIGGERED (invert "more turns/probes = more depth") → C4. Change/regression `n/a: the two-run grouping
  comparison is realized as the C4 counterfactual invariance, not a version before/after`. Failure/recovery
  `n/a: interview-depth economics inject no dependency/persistence failure; resume checkpoints are graded by
  USAGE-02`.
- **Obligations:** O-PERF01-1 interview depth MUST follow evidence state × design risk — verified low-risk
  facts smart-skip with cited evidence + user confirmation; each design-bearing choice is classified by
  uncertainty × reversibility × magnitude, and an irreversible/high-magnitude choice carries a premise, a
  distinct alternative, a disconfirmation test, and an evidence-to-change; O-PERF01-2 a branch MUST NOT close
  while its evidence state is unresolved, and a design-bearing choice MUST receive evidence scrutiny
  proportional to its risk (never merely the scrutiny of a verified fact) — the grade is on EVIDENCE STATE,
  never on turn/question/probe count; O-PERF01-3 each supplied axis MUST be its own `{branch}` ledger event
  and each probe a flat/monotonic never-reused `{branch}.p{n}`; two runs with equivalent per-axis evidence
  but different turn grouping MUST receive the SAME verdict, and a productive many-question chain MUST NOT be
  penalized on count; O-PERF01-4 a still-vague answer MUST cap at ≤2 repair probes then become `recorded-open`
  — this cap governs repair of the SAME vague answer only and MUST NOT bound evidence-led depth on a concrete
  answer.
- **Checklist mirror:** `STARTUP-PERF-SCENARIO-01-CHECK-*`.

#### STARTUP-PERF-SCENARIO-01-C1 — Depth follows evidence state and risk (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C5 —
  exercises proportionate evidence-led depth; C10 — exercises the per-axis evidence-state classification +
  probe recording}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** 46 mandatory branches with varying evidence and risk; **When** the interview runs; **Then**
  verified low-risk facts smart-skip with cited evidence + user confirmation, each design-bearing choice is
  classified by uncertainty × reversibility × magnitude, irreversible/high-magnitude choices carry the four
  elements, each axis is its own ledger event, and probes are flat/monotonic `{branch}.p{n}`.
- **Failure oracle:** a design-bearing choice with no risk classification, or an axis not recorded as its own
  event.
- **Evidence tuple:** observed-via the ledger events + probe IDs + risk classifications; method per-choice
  classification + probe-ID shape check; confirms = evidence-led depth with per-axis events and monotonic
  probe IDs.
- **Traces:** source legacy PERF-01 Good; IP-3-d → O-PERF01-1, O-PERF01-3 → `…-01-CHECK-*`.

#### STARTUP-PERF-SCENARIO-01-C2 — Under-evidenced close or fact-level scrutiny of a risky choice (negative, IP-2-d reframe)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C5 — exercises
  rejection defined by EVIDENCE STATE, not by count}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** a branch or a design-bearing choice; **When** the branch is closed while its evidence state is
  still vague/unresolved, OR a design-bearing choice receives evidence scrutiny no greater than that given a
  verified repository fact; **Then** the family FAILs — the failure is defined by the UNDER-EVIDENCED STATE,
  NOT by how many questions were or were not asked. (This is the reframe of the legacy cadence predicate: the
  legacy "asks 2-4 questions for every branch / rushes to reduce turn count" is REPLACED by an evidence-state
  failure — a mechanical fixed cadence is neither required nor sufficient; only the evidence state decides.)
- **Prohibited effects:** the grade MUST NOT be driven by a turn/question/probe count in either direction —
  neither a fixed 2-4 cadence nor a low turn count is the failure; an unresolved evidence state is.
- **Failure oracle:** a `confirmed`/closed branch whose evidence state is still vague, or a risky choice with
  fact-level scrutiny.
- **Evidence tuple:** observed-via the ledger evidence state per branch/choice; method evidence-state
  assessment (independent of turn count); confirms = a closed branch under-evidenced for its risk.
- **Traces:** source legacy PERF-01 Bad (`scenario.md:148`, reframed); IP-2-d → O-PERF01-2 → `…-01-CHECK-*`.

#### STARTUP-PERF-SCENARIO-01-C3 — Short run under-scrutinizes an irreversible choice (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — nominal
  closure hides an under-scrutinized irreversible choice). **Coverage-role:** {adversarial C5 — exercises the
  risk-proportionality probe; C10 — exercises the evidence-state basis}.
- **Actor / role:** an author closing branches nominally / evaluator (checker).
- **Given** a run that is short because required branches were nominally closed; **When** an irreversible
  architecture choice received no more scrutiny than a verified repository fact; **Then** the family FAILs it
  — a short run is not the defect; the under-scrutinized irreversible choice is.
- **Prohibited effects:** a low turn count MUST NOT pass an under-scrutinized irreversible choice, and MUST
  NOT itself be scored as a failure.
- **Failure oracle:** an irreversible choice whose evidence scrutiny equals a verified fact's.
- **Evidence tuple:** observed-via the choice's classification vs its evidence; method risk-vs-scrutiny
  comparison; confirms = an irreversible choice with fact-level scrutiny.
- **Traces:** source legacy PERF-01 Adversarial → O-PERF01-2 → `…-01-CHECK-*`.

#### STARTUP-PERF-SCENARIO-01-C4 — Cadence-neutral grading, many-question chain not penalized (counterfactual, VA-09 c/d)
- **Primary type:** Counterfactual/assumption (matched {Counterfactual, Adversarial}; primary Counterfactual
  — inverts the load-bearing premise "turn/probe count measures interview quality"). **Coverage-role:**
  {counterfactual C5 — inverts the count-as-quality premise; C10 — exercises the per-axis evidence
  equivalence}.
- **Actor / role:** two interview runs (subjects) / evaluator (checker).
- **Given** two discussions with EQUIVALENT per-axis answer evidence but DIFFERENT turn grouping / prompt
  partition (one asks several axes in one turn, the other one axis per turn), and a third run whose one turn
  asks many productive questions; **When** the Performance family grades them; **Then** the two equivalent-
  evidence runs receive the SAME verdict, and the many-question productive run is NOT penalized on count —
  each grade rests on evidence + in-scope relevance, never on the grouping or the number of questions.
- **Prohibited effects:** the verdict MUST NOT differ for equivalent evidence under different grouping, and a
  many-question turn MUST NOT be penalized for its count.
- **Failure oracle:** two equivalent-evidence runs receiving different verdicts, or a productive many-question
  run scored down for its count.
- **Evidence tuple:** observed-via the two runs' per-axis ledger events + their verdicts; method verdict-
  invariance comparison under regrouping; confirms = equal verdicts for equal evidence and no count penalty.
- **Traces:** source SA-2, VA-09 (c)+(d); IP-3-d → O-PERF01-3 → `…-01-CHECK-*`.

#### STARTUP-PERF-SCENARIO-01-C5 — The ≤2 repair cap for a still-vague answer (boundary, SE-3)
- **Primary type:** Boundary/edge (matched {Boundary}; primary Boundary — the exact repair-probe limit).
  **Coverage-role:** {boundary C5 — exercises the exact ≤2 repair cap}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** an answer that remains vague after probing; **When** the manager pushes for evidence; **Then**
  the repair chain caps at EXACTLY ≤2 repair probes (push twice, then `recorded-open`) — a THIRD repair probe
  of the same vague answer is over the cap — while this cap does NOT bound evidence-led depth on a CONCRETE
  answer (which may open new in-scope follow-ups).
- **Failure oracle:** a third repair probe of the same still-vague answer, OR a concrete answer blocked from
  a productive follow-up by mis-applying the cap.
- **Evidence tuple:** observed-via the probe chain per vague answer; method repair-count-at-boundary + scope
  check; confirms = ≤2 repairs on a vague answer and no cap mis-applied to a concrete one.
- **Traces:** source SE-3, IP-3-c → O-PERF01-4 → `…-01-CHECK-*`.

### STARTUP-USAGE-SCENARIO-03 — Human and operator quality needs are represented

- **Set:** S2 · **Declared primary category:** C8 Inclusion/locale → **Usage** perspective ·
  **Secondary tags:** C2 (operators / end users), C6 (operator failure diagnosis).
- **Primary justification (SR-4):** the family turns on ACCESS and INCLUSION — accessibility, i18n,
  locale-neutral language — plus the operator's ability to diagnose a failure without the original author. C8
  is the defining discrimination (the inclusion/access need); the operator actor (C2) and the operator's
  failure diagnosis (C6) are the supporting concerns. C8 is declared over C6 because the family's core is
  who can USE and OPERATE the product, not a runtime failure.
- **Source / rationale:** legacy USAGE-03 (coverage-matrix); D14 (C8, retained); T1 ledger for USAGE-03.
- **Actor + outcome:** the end user + the operator. Outcome: accessibility/i18n needs represented and the
  operator can diagnose and recover a failure.
- **Situation / invariant:** Topics 5-9 establish critical journeys, interaction direction, accessibility,
  i18n, failure experience, and operational diagnostics. Invariant: a11y/i18n recorded as directions/
  scenarios or proven irrelevant; terms avoid unexplained idiom/culture-bound metaphor; failure messages
  name a recovery action; operators have the logs/signals/pointers to diagnose a failure at 3am.
- **Applicability + priority:** predicate — applies where a user/agent/operator surface exists; priority
  medium-high.
- **Triggered minimums (SR-2/SR-3):** Failure/recovery TRIGGERED (operator must diagnose + recover a
  failure) → C3. Adversarial TRIGGERED (author-readable but locale-specific + no operator recovery) → C4.
  Boundary `n/a: no exact numeric limit`. Change/regression `n/a: no version event`. Counterfactual `n/a:
  covered by RISK-06`.
- **Obligations:** O-USAGE03-1 accessibility and internationalization needs MUST be recorded as directions/
  scenarios or proven irrelevant with reasons, and terms MUST avoid unexplained idiom/culture-bound metaphor;
  O-USAGE03-2 a failure message/interface MUST name a recovery action; O-USAGE03-3 operators MUST have the
  logs/signals/pointers needed to diagnose a failure without the original author.
- **Checklist mirror:** `STARTUP-USAGE-SCENARIO-03-CHECK-*`.

#### STARTUP-USAGE-SCENARIO-03-C1 — Inclusion + operator diagnostics represented (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C8 —
  exercises the accessibility/i18n/inclusion floor; C2 — exercises the operator / end-user use-context}.
- **Actor / role:** end user + operator (subjects) / evaluator (checker).
- **Given** user/agent/operator surfaces; **When** the evaluator reads the baseline; **Then** a11y/i18n needs
  are recorded as directions/scenarios or proven irrelevant, terms avoid idiom/culture-bound metaphor,
  failure messages name a recovery, and operators have diagnostic signals.
- **Failure oracle:** a surface with no a11y/i18n treatment or reasoned-n/a.
- **Evidence tuple:** observed-via the interaction + operational records; method inclusion + diagnostic
  presence check; confirms = represented a11y/i18n + operator signals.
- **Traces:** source legacy USAGE-03 Good → O-USAGE03-1, O-USAGE03-2, O-USAGE03-3 → `…-03-CHECK-*`.

#### STARTUP-USAGE-SCENARIO-03-C2 — Surface with no a11y/i18n (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C8 — exercises
  rejection of an excluding surface}.
- **Actor / role:** end user (subject) / evaluator (checker).
- **Given** a user-facing or agent-facing surface; **When** it has no accessibility/i18n treatment (and no
  proven-irrelevant reason); **Then** the family FAILs.
- **Prohibited effects:** a user/agent surface MUST NOT ship with no a11y/i18n and no reasoned-n/a.
- **Failure oracle:** a surface with no a11y/i18n direction and no reason.
- **Evidence tuple:** observed-via the surface's records; method inclusion-presence check; confirms = a
  missing a11y/i18n treatment.
- **Traces:** source legacy USAGE-03 Bad → O-USAGE03-1 → `…-03-CHECK-*`.

#### STARTUP-USAGE-SCENARIO-03-C3 — Operator must diagnose a 3am failure (failure/recovery)
- **Primary type:** Failure/recovery (matched {Failure/recovery, Negative}; primary Failure/recovery — the
  defining discrimination is the operator's failure diagnosis + recovery). **Coverage-role:**
  {failure/recovery C6 — exercises the operator diagnostic + recovery direction}.
- **Actor / role:** the operator acting without the author (subject) / evaluator (checker).
- **Given** an operator-facing failure; **When** the operator must diagnose and recover it without the
  original author; **Then** the baseline provides the logs/signals/pointers and a recovery action — or the
  family FAILs.
- **Failure oracle:** an operator-facing failure with no diagnostic and no recovery direction.
- **Evidence tuple:** observed-via the operational + failure-experience records; method diagnostic + recovery
  presence check; confirms = a diagnosable, recoverable failure path, or its absence.
- **Traces:** source legacy USAGE-03 Bad → O-USAGE03-2, O-USAGE03-3 → `…-03-CHECK-*`.

#### STARTUP-USAGE-SCENARIO-03-C4 — Author-readable, locale-specific, no operator recovery (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — author-local
  readability hides an excluding, un-operable baseline). **Coverage-role:** {adversarial C8 — exercises the
  locale-assumption + missing-operator-recovery probe}.
- **Actor / role:** an author whose baseline reads fine to themselves / evaluator (checker).
- **Given** a baseline readable to its author; **When** it uses locale-specific assumptions and provides no
  recovery/diagnostic path for an operator acting without the author; **Then** the family FAILs it — author
  readability is not inclusion.
- **Prohibited effects:** author-local readability MUST NOT pass a locale-specific, un-operable baseline.
- **Failure oracle:** locale-specific assumptions plus no operator recovery/diagnostic.
- **Evidence tuple:** observed-via a cold operator read; method locale-neutrality + operator-recovery check;
  confirms = locale assumptions and no operator recovery path.
- **Traces:** source legacy USAGE-03 Adversarial → O-USAGE03-1, O-USAGE03-3 → `…-03-CHECK-*`.

---

## Set S3 — Memory & use

Whether the DURABLE MEMORY the baseline produces is well-formed and usable: atomic typed records,
deterministic routing, value-bearing feature homes, proportionate size, index-only READMEs, cold-readable
records, stable names/pointers, downstream usability, resume/rerun lifecycle, and one-to-one traceability.

### S3 coverage register (SR-1 — ten dispositions)

| # | Category | Disposition | Basis |
|---|---|---|---|
| C1 | Purpose / outcomes / scope | selected | STRUCT-03 primary; AESTH-01/USAGE-01 secondary |
| C2 | Actors / stakeholders / use-context | selected | USAGE-01 primary; STRUCT-03/USAGE-02 secondary |
| C3 | Behavior / state / data | selected | STRUCT-01/02, PERF-02, CONS-03 secondary (record data invariant) |
| C4 | Interfaces / dependencies / structure | selected | STRUCT-01/02 primary |
| C5 | Quality attributes / resource economics | selected | PERF-02/03 primary |
| C6 | Failure / recovery / operations | selected | USAGE-02 secondary (resume recovery) |
| C7 | Trust / harm / governance | covered-elsewhere → S4 | ledger below |
| C8 | Inclusion / locale | covered-elsewhere → S2 | ledger below |
| C9 | Change / compatibility / reversibility | selected | USAGE-02 primary; AESTH-02 secondary (rerun stability) |
| C10 | Evidence / traceability / clarity | selected | AESTH-01/02, CONS-03 primary; STRUCT-02/PERF-03/USAGE-01 secondary |

**SR-7 covered-elsewhere ledgers (S3):**
- **C7 Trust/harm/governance → S4.** Applicable families S4 RISK-01/02/03/05; triggered types negative +
  adversarial + boundary; oracles = a promoted secret / an unauthorized binding rule / an unapproved
  mutation; actor = the manager promoting. Covering clause: S4 RISK-01, RISK-02, RISK-03, RISK-05.
- **C8 Inclusion/locale → S2.** Applicable family S2 USAGE-03; triggered types positive + negative +
  adversarial; oracle = a surface with no a11y/i18n; actor = end user/operator. Covering clause: S2
  USAGE-03-C1…C4.

**S3 populated cells (24):** C1×{positive, negative, adversarial}=3; C2×{positive, negative, adversarial,
change/regression}=4; C3×{positive, negative, adversarial, change/regression}=4; C4×{positive, negative,
adversarial}=3; C5×{positive, negative, adversarial}=3; C6×{failure/recovery}=1; C9×{positive, adversarial,
change/regression}=3; C10×{positive, negative, adversarial}=3 = 24 distinct pairs. Within ~40.

### STARTUP-STRUCT-SCENARIO-01 — Records are atomic and match their memory types

- **Set:** S3 · **Declared primary category:** C4 Interfaces/dependencies/structure → **Structure**
  perspective (secondary Consistency) · **Secondary tags:** C3 (record data invariant / supersession
  granularity).
- **Primary justification (SR-4):** the family turns on each record conforming to its memory-TYPE contract
  (one durable concept, the type's section contract, a subject-named slug) — a record-structure/contract
  discrimination that makes right-granularity supersession possible. The data-lifecycle aspect (C3 — one
  concept per record enabling clean supersession) is the supporting concern; C4 is declared because the
  defining discrimination is the type/section CONTRACT the record must satisfy.
- **Source / rationale:** legacy STRUCT-01 (golden-path); D14 (C4, retained); T1 ledger for STRUCT-01.
- **Actor + outcome:** the manager stages/promotes typed records. Outcome: each record holds one durable
  concept in its type's contract.
- **Situation / invariant:** the staged and promoted sets contain decisions, designs, references, rules,
  mistakes, learnings, scenarios, checklists, backlogs, and living indexes. Invariant: each typed record
  holds one durable concept, follows its type's section contract, and carries a subject-named slug; one
  answer may create several atomic records, but no record bundles unrelated concepts.
- **Applicability + priority:** unconditional; priority high.
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (a title-atomic record with a bundled body) →
  C3. Boundary `n/a: no exact numeric limit`. Failure/recovery `n/a: no runtime failure surface`.
  Change/regression `n/a: no version event`. Counterfactual `n/a: covered by RISK-06`.
- **Obligations:** O-STRUCT01-1 each typed record MUST hold exactly one durable concept and follow its
  type's section contract with a subject-named slug; O-STRUCT01-2 one answer MAY create several atomic
  records but no record MUST bundle unrelated concepts (so later supersession lands at the right
  granularity).
- **Checklist mirror:** `STARTUP-STRUCT-SCENARIO-01-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-01-C1 — Atomic, type-conformant records (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C4 —
  exercises the type/section contract; positive-discrimination C3 — exercises the one-concept-per-record data
  invariant}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** the staged/promoted typed records; **When** the evaluator reads each; **Then** each holds one
  durable concept, follows its type's section contract, and carries a subject-named slug.
- **Failure oracle:** a record bundling unrelated concepts or violating its type's section contract.
- **Evidence tuple:** observed-via each typed record; method one-concept + section-contract + slug check;
  confirms = atomic, type-conformant records.
- **Traces:** source legacy STRUCT-01 Good → O-STRUCT01-1 → `…-01-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-01-C2 — Bundled "startup context" document (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C4 — exercises
  rejection of a non-atomic record; negative C3 — exercises the bundled-concept data defect}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** a promoted set; **When** a "startup context" document bundles vision, stack, risks, rules, and
  roadmap, or a single decision record carries unrelated binding choices; **Then** the family FAILs.
- **Prohibited effects:** a record MUST NOT bundle unrelated durable concepts.
- **Failure oracle:** a multi-concept bundle in one record.
- **Evidence tuple:** observed-via the record body; method concept-count check; confirms = >1 unrelated
  concept in one record.
- **Traces:** source legacy STRUCT-01 Bad → O-STRUCT01-1, O-STRUCT01-2 → `…-01-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-01-C3 — Title-atomic, body-bundled record (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — an
  atomic-looking title hides a bundled body). **Coverage-role:** {adversarial C4 — exercises the
  title-vs-body probe; C3 — exercises the supersession-granularity discrimination}.
- **Actor / role:** an author whose record reads atomic by title / evaluator (checker).
- **Given** a record that looks atomic from its title; **When** its body combines a license decision and a
  stack decision; **Then** the family FAILs it — the bundled body makes later supersession impossible at the
  right granularity.
- **Prohibited effects:** an atomic title MUST NOT excuse a bundled body.
- **Failure oracle:** a single record whose body carries two independently-supersedable decisions.
- **Evidence tuple:** observed-via the record body vs title; method body concept-decomposition; confirms =
  two supersedable concepts under one title.
- **Traces:** source legacy STRUCT-01 Adversarial → O-STRUCT01-2 → `…-01-CHECK-*`.

### STARTUP-STRUCT-SCENARIO-02 — Routing and frontmatter are deterministic

- **Set:** S3 · **Declared primary category:** C4 Interfaces/dependencies/structure → **Structure**
  perspective (secondary Consistency) · **Secondary tags:** C3 (frontmatter fields / staging-vs-durable
  state), C10 (manifest trace).
- **Primary justification (SR-4):** the family turns on the deterministic staging→destination ROUTING
  contract — one manifest row, one deterministic destination, validated frontmatter, stripped staging-only
  fields — a structural mapping/coupling discrimination. The frontmatter field state (C3) and the manifest
  trace (C10) are the mechanism; C4 is declared because the defining discrimination is the routing CONTRACT.
- **Source / rationale:** legacy STRUCT-02 (failure-mode); D14 (C4, retained); T1 ledger for STRUCT-02.
- **Actor + outcome:** the manager maps staged records to destinations. Outcome: every staged source has one
  deterministic destination.
- **Situation / invariant:** every staged typed record is mapped through the promotion manifest to an exact
  durable destination. Invariant: each staged source has one manifest row + one deterministic destination;
  type/scope/feature/area/slug/filename validate; staging-only fields stripped, durable base/type fields
  survive; an unresolvable area or collision halts for a user decision.
- **Applicability + priority:** unconditional; priority high.
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (a plausible off-table destination) → C3.
  Boundary `n/a: no exact numeric limit`. Failure/recovery `n/a: a collision halt is a user-decision gate,
  graded as RISK-03 preimage safety, not a runtime recovery here`. Change/regression `n/a: no version event`.
  Counterfactual `n/a: covered by RISK-06`.
- **Obligations:** O-STRUCT02-1 each staged source MUST have one manifest row and one deterministic
  destination with type/scope/feature/area/slug/filename validated; O-STRUCT02-2 staging-only fields MUST be
  stripped and durable base/type fields MUST survive; O-STRUCT02-3 an unresolvable area or a collision MUST
  halt for a user decision, never be improvised.
- **Checklist mirror:** `STARTUP-STRUCT-SCENARIO-02-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-02-C1 — One deterministic destination per source (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C4 —
  exercises the deterministic routing contract; C3 — exercises the frontmatter validation}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** the staged set + manifest; **When** the evaluator dry-runs routing; **Then** each staged source
  has one manifest row and one deterministic destination, all frontmatter validates, staging-only fields are
  stripped, durable fields survive, and any unresolvable area/collision halted.
- **Failure oracle:** a staged source with no row, two rows, or a non-deterministic destination.
- **Evidence tuple:** observed-via the manifest + staged frontmatter; method one-row/one-destination +
  frontmatter dry-run; confirms = deterministic 1:1 routing with valid frontmatter.
- **Traces:** source legacy STRUCT-02 Good → O-STRUCT02-1, O-STRUCT02-2 → `…-02-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-02-C2 — Invented area / missing row / surviving staging field (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C4 — exercises
  rejection of non-deterministic routing}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** the staged set; **When** a free-form area is invented, a staged record has no manifest row, two
  sources target one destination, or a staging-only routing field survives promotion; **Then** the family
  FAILs.
- **Prohibited effects:** a destination MUST NOT be improvised and a staging-only field MUST NOT survive.
- **Failure oracle:** an off-table area, a missing/duplicate row, or a surviving staging-only field.
- **Evidence tuple:** observed-via the manifest + promoted frontmatter; method row-count + field-strip check;
  confirms = an invented area or a surviving staging field.
- **Traces:** source legacy STRUCT-02 Bad → O-STRUCT02-1, O-STRUCT02-2, O-STRUCT02-3 → `…-02-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-02-C3 — Plausible off-table destination (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — an improvised
  destination that passes shallow checks). **Coverage-role:** {adversarial C4 — exercises the off-table
  routing probe}.
- **Actor / role:** an author improvising a destination / evaluator (checker).
- **Given** a plausible off-table destination; **When** it passes link checks and frontmatter parsing yet was
  improvised rather than resolved by the staging-to-destination contract; **Then** the family FAILs it —
  passing link/parse checks is not the same as a contract-resolved destination.
- **Prohibited effects:** passing shallow link/parse checks MUST NOT pass an improvised destination.
- **Failure oracle:** a destination that validates syntactically but has no contract-resolved manifest basis.
- **Evidence tuple:** observed-via the manifest resolution vs the destination; method contract-resolution
  trace; confirms = a destination with no deterministic contract basis.
- **Traces:** source legacy STRUCT-02 Adversarial → O-STRUCT02-1, O-STRUCT02-3 → `…-02-CHECK-*`.

### STARTUP-STRUCT-SCENARIO-03 — Feature directories represent durable user value

- **Set:** S3 · **Declared primary category:** C1 Purpose/outcomes/scope → **Project** perspective ·
  **Secondary tags:** C2 (the user who receives value).
- **Primary justification (SR-4):** the family turns on whether a feature DIRECTORY represents durable USER
  VALUE (an enduring value proposition) versus a task/sprint/epic/subsystem/speculative-idea/mechanism — a
  product-scope discrimination about what earns a durable feature home. The user who receives the value (C2)
  is the beneficiary; C1 is declared because the defining discrimination is the product-value SCOPE of the
  directory, not the actor.
- **Source / rationale:** legacy STRUCT-03 (failure-mode); D14 (C1, retained); T1 ledger for STRUCT-03.
- **Actor + outcome:** the manager creates/updates feature directories. Outcome: each feature dir maps to a
  durable user-value capability.
- **Situation / invariant:** startup creates or updates `features/{feature-name}/` directories and feature
  indexes. Invariant: each new feature dir maps to a user-ratified durable capability with an enduring value
  proposition; each feature-scoped record carries the correct per-file feature target.
- **Applicability + priority:** predicate — applies where a feature dir is created/updated; priority high.
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (a task dressed as a feature) → C3. Boundary
  `n/a: no numeric limit`. Failure/recovery `n/a: no runtime failure`. Change/regression `n/a: no version
  event`. Counterfactual `n/a: covered by RISK-06`.
- **Obligations:** O-STRUCT03-1 each new feature directory MUST map to a user-ratified durable capability
  with an enduring value proposition; O-STRUCT03-2 a feature dir MUST NOT be created for a task/sprint/epic/
  subsystem/speculative-idea/internal-mechanism; O-STRUCT03-3 each feature-scoped record MUST carry the
  correct per-file feature target.
- **Checklist mirror:** `STARTUP-STRUCT-SCENARIO-03-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-03-C1 — Feature dir = durable user-value capability (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C1 —
  exercises the durable-value scope of a feature home}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** a new/updated feature directory; **When** the evaluator reads it; **Then** it maps to a
  user-ratified durable capability with an enduring value proposition and its records carry the correct
  feature target.
- **Failure oracle:** a feature dir with no enduring user-value proposition.
- **Evidence tuple:** observed-via the feature dir + index + records; method value-proposition + target
  check; confirms = a durable-value capability with correct targets.
- **Traces:** source legacy STRUCT-03 Good → O-STRUCT03-1, O-STRUCT03-3 → `…-03-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-03-C2 — Feature dir for a task/sprint/mechanism (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C1 — exercises
  rejection of a non-value feature home}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** feature creation; **When** a directory is created for a task, sprint, epic, subsystem,
  speculative idea, or internal mechanism; **Then** the family FAILs (feature-dir-for-a-task).
- **Prohibited effects:** a task/mechanism MUST NOT receive a durable feature directory.
- **Failure oracle:** a feature dir whose subject is a task/sprint/mechanism, not a user capability.
- **Evidence tuple:** observed-via the feature dir subject; method capability-vs-task classification;
  confirms = a non-value subject in a feature home.
- **Traces:** source legacy STRUCT-03 Bad → O-STRUCT03-2 → `…-03-CHECK-*`.

#### STARTUP-STRUCT-SCENARIO-03-C3 — Migration task with a polished feature name (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — a
  user-facing name masks a task). **Coverage-role:** {adversarial C1 — exercises the dressed-task probe}.
- **Actor / role:** an author naming a task like a feature / evaluator (checker).
- **Given** a one-time migration task; **When** it receives a polished user-facing name and is promoted as a
  feature though no user receives enduring value from that directory's capability; **Then** the family FAILs
  it — a polished name is not enduring value.
- **Prohibited effects:** a user-facing name MUST NOT convert a task into a durable feature.
- **Failure oracle:** a feature dir whose capability delivers no enduring user value despite its name.
- **Evidence tuple:** observed-via the value proposition behind the name; method enduring-value test;
  confirms = a named feature with no durable user value.
- **Traces:** source legacy STRUCT-03 Adversarial → O-STRUCT03-1, O-STRUCT03-2 → `…-03-CHECK-*`.

### STARTUP-PERF-SCENARIO-02 — Baseline size matches durable information value

- **Set:** S3 · **Declared primary category:** C5 Quality attributes/resource economics → **Performance**
  perspective (secondary Risk) · **Secondary tags:** C3 (concept↔record mapping).
- **Primary justification (SR-4):** the family turns on baseline SIZE economics — each durable concept maps
  to exactly one authoritative record and each record to one concept, no duplication, no fragmentation, no
  raw audit promoted (word count diagnostic only) — a resource-economy discrimination. The concept↔record
  mapping (C3) is the data structure the economy rides on; C5 is declared because the defining discrimination
  is the SIZE-vs-information-value economy.
- **Source / rationale:** legacy PERF-02 (failure-mode); D14 (C5, retained); T1 ledger for PERF-02.
- **Actor + outcome:** the manager promotes memory. Outcome: baseline size is proportional to durable
  information learned.
- **Situation / invariant:** the completed run produces a set of atomic records plus root and feature living
  indexes. Invariant: each durable concept ↔ exactly one authoritative record (no duplicate authority, no
  multi-concept bundle); records concise and zero-context; no raw audit/transcript/ledger/manifest/research
  note/scratch thought promoted as memory.
- **Applicability + priority:** unconditional; priority medium-high.
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (per-file-bounded but aggregate-bloated via
  fragmentation) → C3. Boundary `n/a: word count is diagnostic only, not a hard limit`. Failure/recovery
  `n/a: no runtime failure`. Change/regression `n/a: no version event`. Counterfactual `n/a: covered by
  RISK-06`.
- **Obligations:** O-PERF02-1 each durable concept MUST map to exactly one authoritative record and each
  record to one concept (no duplicate authority, no multi-concept bundle; word count diagnostic only);
  O-PERF02-2 no raw audit/transcript/ledger/manifest/research-note/scratch-thought MUST be promoted as
  memory.
- **Checklist mirror:** `STARTUP-PERF-SCENARIO-02-CHECK-*`.

#### STARTUP-PERF-SCENARIO-02-C1 — Size matches information value (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C5 —
  exercises the concept↔record economy; C3 — exercises the one-concept-one-record mapping}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** the promoted set + indexes; **When** the evaluator maps concepts to records; **Then** each
  durable concept maps to exactly one authoritative record and each record to one concept, records are
  concise and zero-context, and no raw audit material was promoted.
- **Failure oracle:** a duplicated authority, a multi-concept bundle, or promoted audit material.
- **Evidence tuple:** observed-via the promoted set; method concept↔record mapping + audit-material scan;
  confirms = a 1:1 concept/record economy with no raw audit.
- **Traces:** source legacy PERF-02 Good → O-PERF02-1, O-PERF02-2 → `…-02-CHECK-*`.

#### STARTUP-PERF-SCENARIO-02-C2 — Scratch-thought files or promoted audit (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C5 — exercises
  rejection of a mis-sized baseline}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** the completed run; **When** startup produces one memory file per scratch thought, a few oversized
  transcript-like bundles, or promotes record-level audit material; **Then** the family FAILs.
- **Prohibited effects:** raw audit/transcript material MUST NOT be promoted, and one concept MUST NOT be
  scattered across scratch files.
- **Failure oracle:** a scratch-per-file explosion, a transcript bundle, or promoted audit material.
- **Evidence tuple:** observed-via the promoted set; method file-purpose classification; confirms = scratch/
  audit material in memory.
- **Traces:** source legacy PERF-02 Bad → O-PERF02-1, O-PERF02-2 → `…-02-CHECK-*`.

#### STARTUP-PERF-SCENARIO-02-C3 — Per-file-bounded but aggregate-bloated (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial —
  per-file compliance hides aggregate bloat). **Coverage-role:** {adversarial C5 — exercises the
  fragmentation probe; C3 — exercises the concept-fragmentation discrimination}.
- **Actor / role:** an author keeping each file small / evaluator (checker).
- **Given** every file is individually within a reasonable line bound; **When** the aggregate baseline far
  exceeds the information learned because one concept was fragmented across many tiny records; **Then** the
  family FAILs it — per-file size is not the measure; concept↔record fidelity is.
- **Prohibited effects:** per-file line bounds MUST NOT pass a fragmented one-concept-many-records baseline.
- **Failure oracle:** one durable concept spread across multiple records.
- **Evidence tuple:** observed-via the concept↔record mapping; method fragmentation detection; confirms = a
  single concept fragmented across records.
- **Traces:** source legacy PERF-02 Adversarial → O-PERF02-1 → `…-02-CHECK-*`.

### STARTUP-PERF-SCENARIO-03 — READMEs are indexes and budgets are explicit

- **Set:** S3 · **Declared primary category:** C5 Quality attributes/resource economics → **Performance**
  perspective (secondary Risk) · **Secondary tags:** C10 (README as index/pointer), C3 (duplication drift).
- **Primary justification (SR-4):** the family turns on recording recurring COST / scale / quality-threshold
  / error-budget directions and keeping READMEs index-only (no duplicated bodies) — a resource-economics +
  duplication-drift discrimination. The README-as-pointer clarity (C10) and the duplication drift (C3) are
  the vehicles; C5 is declared because the defining discrimination is the explicit budget/cost economy.
- **Source / rationale:** legacy PERF-03 (coverage-matrix); D14 (C5, retained); T1 ledger for PERF-03.
- **Actor + outcome:** the manager writes READMEs + records budgets. Outcome: READMEs point, budgets are
  explicit.
- **Situation / invariant:** the root and feature READMEs summarize the baseline, while quality/capacity/
  cost/error-budget directions live in typed records. Invariant: each README summarizes + points without
  restating bodies; recurring token/API/infra/storage costs, scale assumptions, quality thresholds, and
  error-budget/availability impact are recorded with an estimate or a proven-irrelevant rationale.
- **Applicability + priority:** unconditional; priority medium-high.
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (a README that duplicates a typed-record fact) →
  C3. Boundary `n/a: no exact limit`. Failure/recovery `n/a: no runtime failure`. Change/regression `n/a: no
  version event`. Counterfactual `n/a: covered by RISK-06`.
- **Obligations:** O-PERF03-1 each README MUST summarize and point to typed records without restating their
  bodies; O-PERF03-2 recurring cost, scale assumptions, quality thresholds, and error-budget/availability
  impact MUST be recorded with an estimate or a proven-irrelevant rationale (never dismissed as "should be
  fine").
- **Checklist mirror:** `STARTUP-PERF-SCENARIO-03-CHECK-*`.

#### STARTUP-PERF-SCENARIO-03-C1 — Index READMEs + explicit budgets (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C5 —
  exercises the explicit-budget economy; C10 — exercises the README-as-index pointer}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** the READMEs + typed records; **When** the evaluator reads them; **Then** each README summarizes
  and points without restating bodies, and recurring cost/scale/quality/error-budget directions are recorded
  with an estimate or a proven-irrelevant rationale.
- **Failure oracle:** a README restating a body, or a recurring cost/error-budget with no estimate/reason.
- **Evidence tuple:** observed-via the READMEs + budget records; method pointer-vs-body + budget-presence
  check; confirms = index-only READMEs + explicit budgets.
- **Traces:** source legacy PERF-03 Good → O-PERF03-1, O-PERF03-2 → `…-03-CHECK-*`.

#### STARTUP-PERF-SCENARIO-03-C2 — README duplicates bodies / cost dismissed (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C5 — exercises
  rejection of duplication / missing budget}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** the baseline; **When** a README duplicates full design/decision bodies (README-duplicating-
  memory), or a recurring cost and error-budget commitment is omitted or dismissed as "should be fine";
  **Then** the family FAILs.
- **Prohibited effects:** a README MUST NOT hold an authoritative body copy, and a recurring cost MUST NOT be
  dismissed.
- **Failure oracle:** a duplicated body in a README, or a missing/dismissed budget.
- **Evidence tuple:** observed-via the READMEs + budgets; method duplication + budget check; confirms = a
  duplicated body or an absent budget.
- **Traces:** source legacy PERF-03 Bad → O-PERF03-1, O-PERF03-2 → `…-03-CHECK-*`.

#### STARTUP-PERF-SCENARIO-03-C3 — Editing one fact needs a second README edit (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — a hidden
  duplication surfaces only under a change). **Coverage-role:** {adversarial C5 — exercises the
  duplication-drift probe; C3 — exercises the drift discrimination}.
- **Actor / role:** an author duplicating a fact into a README / evaluator (checker).
- **Given** a typed-record fact; **When** changing that one fact would require a second authoritative prose
  edit in the README; **Then** the family FAILs it — the duplication doubles future-session load and creates
  drift.
- **Prohibited effects:** a single fact MUST NOT require two authoritative edits.
- **Failure oracle:** a fact whose authoritative statement exists in both a typed record and a README body.
- **Evidence tuple:** observed-via a fact-edit blast-radius trace; method duplicate-authority detection;
  confirms = two authoritative copies of one fact.
- **Traces:** source legacy PERF-03 Adversarial → O-PERF03-1 → `…-03-CHECK-*`.

### STARTUP-AESTH-SCENARIO-01 — A cold reader can understand every promoted record

- **Set:** S3 · **Declared primary category:** C10 Evidence/traceability/clarity → **Consistency**
  perspective (secondary Aesthetics) · **Secondary tags:** C1 (root README identity).
- **Primary justification (SR-4):** the family turns on whether every promoted record is COLD-READABLE —
  states its concept at the top, follows its type's section order, uses plain literal language, defines
  non-obvious terms, and stands alone without the startup transcript — a clarity/followability discrimination
  (C10). The root README's project-identity clarity (C1) is a supporting instance; C10 is declared because
  the defining discrimination is followability by a cold reader. (Under the owned map, C10 routes primary to
  Consistency with Aesthetics secondary — the recorded routing decision in the frame.)
- **Source / rationale:** legacy AESTH-01 (golden-path); D14 (C10, retained); T1 ledger for AESTH-01.
- **Actor + outcome:** a later agent reads promoted memory. Outcome: each record is understandable without
  the startup record.
- **Situation / invariant:** a later agent reads promoted memory without the startup transcript, ledger, or
  topic tree. Invariant: each record states its durable concept at the top, follows its type's section order,
  uses plain literal language, defines non-obvious terms, stands alone; the root README makes the project's
  identity clear on first read.
- **Applicability + priority:** unconditional; priority high.
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (polished prose depending on an unstated
  interview fact) → C3. Boundary `n/a: no numeric limit`. Failure/recovery `n/a: no runtime failure`.
  Change/regression `n/a: no version event`. Counterfactual `n/a: covered by RISK-06`.
- **Obligations:** O-AESTH01-1 each promoted record MUST state its durable concept at the top, follow its
  type's section order, use plain literal language, define non-obvious terms, and stand alone without session
  context; O-AESTH01-2 the root README MUST make the project's identity clear on first read.
- **Checklist mirror:** `STARTUP-AESTH-SCENARIO-01-CHECK-*`.

#### STARTUP-AESTH-SCENARIO-01-C1 — Every record stands alone (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C10 —
  exercises cold-readability; C1 — exercises the README identity}.
- **Actor / role:** a later cold agent (reader) / evaluator (checker).
- **Given** promoted memory read without the startup record; **When** the cold agent reads each record;
  **Then** each states its concept at the top, follows its section order, uses plain literal language, defines
  non-obvious terms, and stands alone, and the root README makes the project identity clear.
- **Failure oracle:** a record that needs the talk to make sense.
- **Evidence tuple:** observed-via a cold read with the startup record withheld; method stand-alone
  comprehension check; confirms = every record self-contained.
- **Traces:** source legacy AESTH-01 Good → O-AESTH01-1, O-AESTH01-2 → `…-01-CHECK-*`.

#### STARTUP-AESTH-SCENARIO-01-C2 — Record needs the talk / placeholder prose (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C10 — exercises
  rejection of a non-cold-readable record}.
- **Actor / role:** a later cold agent (reader) / evaluator (checker).
- **Given** promoted memory; **When** a record requires the talk to make sense, hides its point under session
  narrative, or uses placeholder prose; **Then** the family FAILs.
- **Prohibited effects:** a promoted record MUST NOT depend on the transcript or ship placeholder prose.
- **Failure oracle:** a record whose meaning requires the startup transcript.
- **Evidence tuple:** observed-via a cold read; method dependency-on-session check; confirms = a
  session-dependent or placeholder record.
- **Traces:** source legacy AESTH-01 Bad → O-AESTH01-1 → `…-01-CHECK-*`.

#### STARTUP-AESTH-SCENARIO-01-C3 — Polished prose hides an unstated interview fact (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — surface
  polish hides a hidden dependency). **Coverage-role:** {adversarial C10 — exercises the hidden-dependency
  probe}.
- **Actor / role:** an author whose prose reads complete to themselves / evaluator (checker).
- **Given** polished prose; **When** it still depends on an unstated interview fact; **Then** the family FAILs
  it — it feels complete to the author but loses meaning when `sessions/.../startup/` is unavailable.
- **Prohibited effects:** author-local completeness MUST NOT pass a record with a hidden session dependency.
- **Failure oracle:** a record that reads complete but is unresolvable once the startup record is withheld.
- **Evidence tuple:** observed-via a cold read with the startup record removed; method meaning-preservation
  check; confirms = lost meaning without the transcript.
- **Traces:** source legacy AESTH-01 Adversarial → O-AESTH01-1 → `…-01-CHECK-*`.

### STARTUP-AESTH-SCENARIO-02 — Names, headings, and pointers are stable

- **Set:** S3 · **Declared primary category:** C10 Evidence/traceability/clarity → **Consistency**
  perspective (secondary Aesthetics) · **Secondary tags:** C9 (stability across reruns).
- **Primary justification (SR-4):** the family turns on durable-concept naming and resolvable pointers — no
  leftover topic/ledger/checkpoint coordinate, no dangling pointer, no unfinished section — a traceability/
  clarity discrimination that keeps the baseline navigable (C10). Stability across reruns (C9) is the change
  concern the naming enables; C10 is declared because the defining discrimination is followable, coordinate-
  free naming and resolvable references.
- **Source / rationale:** legacy AESTH-02 (coverage-matrix); D14 (C10, retained); T1 ledger for AESTH-02.
- **Actor + outcome:** the manager names/links records. Outcome: durable, coordinate-free names and resolving
  pointers, stable across reruns.
- **Situation / invariant:** staged and promoted records use slugs, headings, internal links, and
  cross-record pointers. Invariant: titles/slugs name durable concepts not topics/checkpoints; typed docs +
  living indexes match the section order; no `TBD`/`TODO`/`???`/unfinished sentence / load-bearing topic/
  ledger/checkpoint coordinate; all pointers resolve.
- **Applicability + priority:** unconditional; priority medium-high.
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (scannable but coordinate-encoded names) → C3.
  Change/regression TRIGGERED (name stability across reruns — a rerun re-touches existing memory files) →
  C4. Boundary `n/a: no numeric limit`. Failure/recovery `n/a: no runtime failure`. Counterfactual `n/a:
  covered by RISK-06`.
- **Obligations:** O-AESTH02-1 titles and slugs MUST name durable concepts (not topics/checkpoints) and typed
  docs + living indexes MUST match the section order; O-AESTH02-2 no `TBD`/`TODO`/`???`/unfinished sentence /
  load-bearing topic/ledger/checkpoint coordinate MUST remain and all pointers MUST resolve; O-AESTH02-3 a
  durable-concept slug/heading MUST remain stable across a rerun (a coordinate-encoded one breaks).
- **Checklist mirror:** `STARTUP-AESTH-SCENARIO-02-CHECK-*`.

#### STARTUP-AESTH-SCENARIO-02-C1 — Durable names + resolving pointers (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C10 —
  exercises coordinate-free naming + resolvable pointers}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** the staged/promoted records; **When** the evaluator reads names, headings, and pointers; **Then**
  titles/slugs name durable concepts, typed docs + indexes match the section order, no `TBD`/coordinate
  remains, and all pointers resolve.
- **Failure oracle:** a topic/checkpoint-coordinate slug, a leftover `TBD`/coordinate, or a dangling pointer.
- **Evidence tuple:** observed-via the names + pointers; method coordinate-scan + link-resolution; confirms =
  durable names + resolving pointers.
- **Traces:** source legacy AESTH-02 Good → O-AESTH02-1, O-AESTH02-2 → `…-02-CHECK-*`.

#### STARTUP-AESTH-SCENARIO-02-C2 — Coordinate name / dangling pointer / empty section (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C10 — exercises
  rejection of coordinate names / broken pointers}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** the records; **When** a file is named `topic-7-decision.md`, a body says "per checkpoint 3", a
  required section is empty, or a pointer dangles; **Then** the family FAILs.
- **Prohibited effects:** a load-bearing topic/checkpoint coordinate MUST NOT remain and a pointer MUST NOT
  dangle.
- **Failure oracle:** a coordinate name/body, an empty required section, or a dangling pointer.
- **Evidence tuple:** observed-via the names + sections + pointers; method coordinate + emptiness + link
  check; confirms = a coordinate/dangling defect.
- **Traces:** source legacy AESTH-02 Bad → O-AESTH02-1, O-AESTH02-2 → `…-02-CHECK-*`.

#### STARTUP-AESTH-SCENARIO-02-C3 — Scannable but position-encoded names (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — good
  formatting hides position-coded slugs). **Coverage-role:** {adversarial C10 — exercises the
  position-encoded-name probe}.
- **Actor / role:** an author with well-formatted but position-coded records / evaluator (checker).
- **Given** a scannable, well-formatted document; **When** its slug and first heading encode only the startup
  interview position; **Then** the family FAILs it — it is inaccessible to a cold agent and unstable across
  reruns.
- **Prohibited effects:** good formatting MUST NOT excuse a position-encoded slug/heading.
- **Failure oracle:** a slug/first-heading that encodes an interview position rather than a durable concept.
- **Evidence tuple:** observed-via the slug/heading semantics; method concept-vs-coordinate classification;
  confirms = a position-encoded identifier.
- **Traces:** source legacy AESTH-02 Adversarial → O-AESTH02-1, O-AESTH02-3 → `…-02-CHECK-*`.

#### STARTUP-AESTH-SCENARIO-02-C4 — Names survive a rerun (change/regression)
- **Primary type:** Change/regression/compat (matched {Change/regression}; primary Change/regression — the
  defining discrimination is name stability across a rerun). **Coverage-role:** {change/regression C9 —
  exercises before/after name stability across a rerun}.
- **Actor / role:** a later rerun (subject) / evaluator (checker).
- **Given** a promoted record with a durable-concept slug; **When** startup reruns and regenerates; **Then**
  the slug/heading stays stable (a durable-concept name survives; a coordinate-encoded one would break).
- **Failure oracle:** a slug/heading that changes across an otherwise-equivalent rerun.
- **Evidence tuple:** observed-via the record's slug before vs after a rerun; method rerun-stability compare;
  confirms = stable durable-concept naming across the rerun.
- **Traces:** source legacy AESTH-02 Adversarial (unstable across reruns) → O-AESTH02-3 → `…-02-CHECK-*`.

### STARTUP-USAGE-SCENARIO-01 — Downstream loops can start from the baseline safely

- **Set:** S3 · **Declared primary category:** C2 Actors/stakeholders/use-context → **Usage** perspective
  (secondary Project) · **Secondary tags:** C1 (baseline completeness), C10 (decided-vs-open distinction).
- **Primary justification (SR-4):** the family turns on whether a downstream CONSUMER — the Ideation/
  Preparation loop that loads the baseline — can act from it without re-asking, an actor/use-context
  discrimination where the consumer is the later loop. The completeness (C1) and the decided-vs-open clarity
  (C10) are what the consumer relies on; C2 is declared because the defining discrimination is the
  consumer's ability to USE the baseline.
- **Source / rationale:** legacy USAGE-01 (golden-path); D14 (C2, retained); T1 ledger for USAGE-01.
- **Actor + outcome:** the next loop loads the baseline. Outcome: it can act without re-asking a startup
  question.
- **Situation / invariant:** Ideation and Preparation load the promoted baseline after startup closes.
  Invariant: the README + typed records answer what/who/boundary/value-features/decided-directions/
  constraints/risks/evidence; decided directions are distinguishable from open mechanism questions; every
  recorded-open item has an owner, a resolution method, and a trigger/next action.
- **Applicability + priority:** unconditional; priority high.
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (a cold Ideation start that must re-litigate a
  settled decision) → C3. Boundary `n/a: no numeric limit`. Failure/recovery `n/a: resume is graded by
  USAGE-02`. Change/regression `n/a: no version event`. Counterfactual `n/a: the cold-start simulation is
  realized as the C3 adversarial probe`.
- **Obligations:** O-USAGE01-1 the README + typed records MUST answer what/who/boundary/value-features/
  decided-directions/constraints/risks/evidence; O-USAGE01-2 decided directions MUST be distinguishable from
  open mechanism questions; O-USAGE01-3 every recorded-open item MUST carry an owner, a resolution method,
  and a trigger/next action.
- **Checklist mirror:** `STARTUP-USAGE-SCENARIO-01-CHECK-*`.

#### STARTUP-USAGE-SCENARIO-01-C1 — Next loop acts without re-asking (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C2 —
  exercises the downstream-consumer usability; C1 — exercises baseline completeness; C10 — exercises the
  decided-vs-open clarity}.
- **Actor / role:** the next loop (consumer) / evaluator (checker).
- **Given** the promoted baseline; **When** Ideation/Preparation load it; **Then** the README + typed records
  answer what/who/boundary/value-features/decided-directions/constraints/risks/evidence, decided directions
  are distinguishable from open ones, and every recorded-open item has an owner+method+trigger.
- **Failure oracle:** a question the next loop must re-ask, or a recorded-open item with no owner/resolution.
- **Evidence tuple:** observed-via a simulated downstream load; method question-answerability + open-item
  completeness; confirms = the consumer acts without re-asking.
- **Traces:** source legacy USAGE-01 Good → O-USAGE01-1, O-USAGE01-2, O-USAGE01-3 → `…-01-CHECK-*`.

#### STARTUP-USAGE-SCENARIO-01-C2 — Next loop must re-ask / bare TBD open item (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C2 — exercises
  rejection of an unusable baseline}.
- **Actor / role:** the next loop (consumer) / evaluator (checker).
- **Given** the baseline; **When** the next loop must re-ask a startup question, or an open item says only
  `TBD` / "figure it out later" with no owner or resolution path; **Then** the family FAILs.
- **Prohibited effects:** the baseline MUST NOT force a re-ask and an open item MUST NOT be a bare `TBD`.
- **Failure oracle:** a re-asked startup question or an ownerless open item.
- **Evidence tuple:** observed-via a downstream load; method re-ask + open-item check; confirms = a re-ask or
  a bare-TBD item.
- **Traces:** source legacy USAGE-01 Bad → O-USAGE01-1, O-USAGE01-3 → `…-01-CHECK-*`.

#### STARTUP-USAGE-SCENARIO-01-C3 — Cold Ideation start re-litigates a settled decision (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Counterfactual}; primary Adversarial — a
  cold-start simulation exposes an ambiguous decided/open boundary). **Coverage-role:** {adversarial C2 —
  exercises the cold-consumer probe; C10 — exercises the decided-vs-open discrimination}.
- **Actor / role:** a cold Ideation start with no startup record / evaluator (checker).
- **Given** a simulated cold Ideation start with no startup record; **When** the agent cannot tell whether an
  architecture direction is locked or an unresolved mechanism; **Then** the family FAILs it — the baseline
  must let the consumer distinguish a settled decision from an open one without re-litigating.
- **Prohibited effects:** the baseline MUST NOT leave a settled decision indistinguishable from an open one.
- **Failure oracle:** a direction the cold consumer cannot classify as locked vs open.
- **Evidence tuple:** observed-via the cold-start simulation; method decided/open classifiability check;
  confirms = an unclassifiable direction forcing re-litigation.
- **Traces:** source legacy USAGE-01 Adversarial → O-USAGE01-2 → `…-01-CHECK-*`.

### STARTUP-USAGE-SCENARIO-02 — Resume, rerun, and completion states are usable

- **Set:** S3 · **Declared primary category:** C9 Change/compatibility/reversibility → **Consistency**
  perspective (secondary Risk) · **Secondary tags:** C6 (resume recovery), C2 (later-session actor).
- **Primary justification (SR-4):** the family turns on the resume / rerun / completion LIFECYCLE — regenerate
  from the current event set, classify each rerun output against existing memory, and never trust the
  gitignored summary as durable proof — a change/reversibility discrimination. The resume recovery (C6) and
  the later-session actor (C2) are the mechanism and the subject; C9 is declared because the defining
  discrimination is the version/lifecycle behavior across reruns and sessions.
- **Source / rationale:** legacy USAGE-02 (failure-mode); D14 (C9, retained); SE-2, AR-3; T1 ledger for
  USAGE-02.
- **Actor + outcome:** a later session resumes/reruns startup. Outcome: resume continues correctly; rerun
  classifies outputs; the summary never poses as durable proof.
- **Situation / invariant:** startup may be interrupted, resumed in the live session, or invoked later
  against an established baseline. Invariant: stable answer IDs + confirmed Level-1 checkpoint markers;
  resume regenerates staged drafts from the current event set and continues from the first unconfirmed
  checkpoint; a rerun classifies each output as unchanged / living-index-update / new / superseding /
  deferred-open; the summary records live-session completion + rerun triggers without posing as cross-session
  durable evidence.
- **Applicability + priority:** predicate — applies on resume/rerun; priority high.
- **Triggered minimums (SR-2/SR-3):** Change/regression TRIGGERED (rerun classifies each output against
  existing memory) → C2. Failure/recovery TRIGGERED (resume from interruption/correction) → C3. Adversarial
  TRIGGERED (a summary that poses as durable proof) → C4. Boundary `n/a: no numeric limit`. Counterfactual
  `n/a: covered by RISK-06`.
- **Obligations:** O-USAGE02-1 the ledger MUST carry stable answer IDs + confirmed Level-1 checkpoint
  markers, and resume MUST regenerate staged drafts from the current event set and continue from the first
  unconfirmed checkpoint; O-USAGE02-2 a rerun MUST classify each output as unchanged / living-index-update /
  new / superseding / deferred-open; O-USAGE02-3 the summary MUST record live-session completion + rerun
  triggers without posing as cross-session durable evidence.
- **Checklist mirror:** `STARTUP-USAGE-SCENARIO-02-CHECK-*`.

#### STARTUP-USAGE-SCENARIO-02-C1 — Resume/rerun/summary states usable (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C9 —
  exercises the resume/rerun/completion lifecycle}.
- **Actor / role:** a later session (subject) / evaluator (checker).
- **Given** an interruptible startup; **When** it resumes or reruns; **Then** the ledger has stable answer IDs
  + confirmed checkpoint markers, resume regenerates from the current event set and continues from the first
  unconfirmed checkpoint, a rerun classifies each output, and the summary records completion without posing
  as durable proof.
- **Failure oracle:** a resume that restarts wrongly, an unclassified rerun output, or a summary posed as
  durable proof.
- **Evidence tuple:** observed-via the ledger + resume behavior + summary; method lifecycle-state check;
  confirms = correct resume/rerun/summary states.
- **Traces:** source legacy USAGE-02 Good → O-USAGE02-1, O-USAGE02-2, O-USAGE02-3 → `…-02-CHECK-*`.

#### STARTUP-USAGE-SCENARIO-02-C2 — Rerun classifies each output vs existing memory (change/regression)
- **Primary type:** Change/regression/compat (matched {Change/regression, Negative}; primary
  Change/regression — the defining discrimination is classifying a rerun against existing memory).
  **Coverage-role:** {change/regression C9 — exercises the rerun-vs-existing-memory classification; C2 — the
  later-session actor}.
- **Actor / role:** a rerun against an established baseline (subject) / evaluator (checker).
- **Given** an established baseline; **When** startup reruns; **Then** each output is classified as unchanged
  / living-index-update / new / superseding / deferred-open — a rerun MUST NOT blind-append over current
  memory.
- **Prohibited effects:** a rerun MUST NOT blind-append or silently overwrite current memory.
- **Failure oracle:** a rerun output with no classification, or a blind append over existing memory.
- **Evidence tuple:** observed-via the rerun outputs vs prior memory; method per-output classification check;
  confirms = every output classified against existing memory.
- **Traces:** source legacy USAGE-02 Bad (blind-append) → O-USAGE02-2 → `…-02-CHECK-*`.

#### STARTUP-USAGE-SCENARIO-02-C3 — Resume re-derives from the current ledger (failure/recovery)
- **Primary type:** Failure/recovery (matched {Failure/recovery, Positive}; primary Failure/recovery — the
  defining discrimination is recovery-by-regeneration after an interruption/correction). **Coverage-role:**
  {failure/recovery C6 — exercises resume regeneration + downstream invalidation working}.
- **Actor / role:** a resumed session (subject) / evaluator (checker).
- **Given** an interrupted startup with a corrected/superseded source event; **When** the session resumes;
  **Then** resume re-derives validity from the CURRENT ledger — regenerating a draft whose source event was
  superseded and continuing from the first unconfirmed checkpoint — rather than replaying confirmed questions.
- **Failure oracle:** a resume that replays confirmed questions or trusts a stale regenerated draft.
- **Evidence tuple:** observed-via the resume behavior against a corrected ledger; method re-derivation
  check; confirms = regeneration from current events, no confirmed-question replay.
- **Traces:** source legacy USAGE-02 Bad (replay); SE-2 → O-USAGE02-1 → `…-02-CHECK-*`.

#### STARTUP-USAGE-SCENARIO-02-C4 — Summary says complete, memory incomplete (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — a summary
  posed as durable completion proof). **Coverage-role:** {adversarial C9 — exercises the summary-trust
  probe}.
- **Actor / role:** an author trusting the gitignored summary / evaluator (checker).
- **Given** a live-session summary that says complete; **When** durable memory lacks the required root index
  or typed records; **Then** the family FAILs it — a later classifier would wrongly infer completion if it
  trusted the summary, which is not cross-session durable evidence.
- **Prohibited effects:** the gitignored summary MUST NOT be treated as proof of durable completion.
- **Failure oracle:** a "complete" summary while durable memory is missing required records.
- **Evidence tuple:** observed-via the summary vs the actual memory delta; method summary-vs-memory
  reconciliation; confirms = a completion claim unsupported by durable memory.
- **Traces:** source legacy USAGE-02 Adversarial; AR-3 → O-USAGE02-3 → `…-02-CHECK-*`.

### STARTUP-CONS-SCENARIO-03 — The full baseline set traces one-to-one

- **Set:** S3 · **Declared primary category:** C10 Evidence/traceability/clarity → **Consistency**
  perspective (secondary Aesthetics) · **Secondary tags:** C3 (set-consistency of memory/manifest/staging).
- **Primary justification (SR-4):** the family turns on the full baseline set tracing ONE-TO-ONE — memory →
  manifest row → staged source → ledger answer/decision → evidence — with every candidate and every memory
  change carrying exactly one disposition. C10 is the defining discrimination (followable end-to-end
  traceability); the set-consistency of the artifacts (C3) is the supporting data invariant.
- **Source / rationale:** legacy CONS-03 (coverage-matrix); D14 (C10, retained); T1 ledger for CONS-03.
- **Actor + outcome:** the manager promotes + indexes. Outcome: every promoted claim/destination traces
  end-to-end with one disposition.
- **Situation / invariant:** each promoted claim and destination should trace through the completed baseline
  set. Invariant: sampled claims trace memory → manifest → staged source → ledger answer/decision → evidence/
  brief; every candidate + memory change has exactly one manifest disposition; README pointers + summary
  paths match the actual delta; unchanged records were not rewritten; supersessions carry paired links +
  archive moves.
- **Applicability + priority:** unconditional; priority high.
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (manifest + summary agree with each other but
  both omit a real change) → C3. Change/regression TRIGGERED (unchanged records not rewritten; supersession
  paired links across the delta) → exercised via C1's supersession/unchanged check (coverage-role notes it).
  Boundary `n/a: no numeric limit`. Failure/recovery `n/a: no runtime failure`. Counterfactual `n/a: covered
  by RISK-06`.
- **Obligations:** O-CONS03-1 sampled claims MUST trace memory → manifest → staged source → ledger answer/
  decision → evidence, and every candidate + memory change MUST have exactly one manifest disposition;
  O-CONS03-2 README pointers + summary paths MUST match the actual delta, unchanged records MUST NOT be
  rewritten, and supersessions MUST carry paired links + archive moves.
- **Checklist mirror:** `STARTUP-CONS-SCENARIO-03-CHECK-*`.

#### STARTUP-CONS-SCENARIO-03-C1 — End-to-end one-to-one trace (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C10 —
  exercises the end-to-end trace; change/regression C3 — exercises the unchanged-not-rewritten +
  supersession-paired-links across the delta}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** the completed baseline set; **When** the evaluator samples claims; **Then** each traces memory →
  manifest → staged source → ledger → evidence, every candidate/change has one disposition, README/summary
  paths match the delta, unchanged records are untouched, and supersessions carry paired links + archive
  moves.
- **Failure oracle:** a claim with no source trace, or a change with no disposition.
- **Evidence tuple:** observed-via a sampled end-to-end trace; method five-hop trace + disposition-count;
  confirms = one-to-one traceability.
- **Traces:** source legacy CONS-03 Good → O-CONS03-1, O-CONS03-2 → `…-03-CHECK-*`.

#### STARTUP-CONS-SCENARIO-03-C2 — Orphan claim / disappeared candidate / unlisted change (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C10 — exercises
  rejection of a broken trace}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** the baseline set; **When** a promoted claim has no source evidence, a staged candidate
  disappears, an unlisted memory change appears, or summary/index paths disagree with the promoted set;
  **Then** the family FAILs.
- **Prohibited effects:** a promoted claim MUST NOT be an orphan and a memory change MUST NOT be unlisted.
- **Failure oracle:** an orphan claim, a missing candidate, or an unlisted change.
- **Evidence tuple:** observed-via the trace + manifest vs delta; method orphan + unlisted-change scan;
  confirms = a broken or unlisted trace.
- **Traces:** source legacy CONS-03 Bad → O-CONS03-1, O-CONS03-2 → `…-03-CHECK-*`.

#### STARTUP-CONS-SCENARIO-03-C3 — Manifest and summary agree but both omit a real change (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — two internal
  documents corroborate each other while both omit reality). **Coverage-role:** {adversarial C10 — exercises
  the two-document-collusion probe; C3 — exercises the set-consistency discrimination}.
- **Actor / role:** an author relying on internal cross-agreement / evaluator (checker).
- **Given** a manifest and a summary that agree with each other; **When** both omit a real staged file or
  actual memory edit; **Then** the family FAILs it — an internal two-document comparison falsely passes; the
  trace must reach the actual filesystem delta.
- **Prohibited effects:** internal cross-agreement MUST NOT substitute for a trace to the actual delta.
- **Failure oracle:** a staged file or memory edit present on disk but absent from BOTH manifest and summary.
- **Evidence tuple:** observed-via the actual `git`/filesystem delta vs manifest+summary; method
  delta-vs-documents reconciliation; confirms = a real change omitted by both documents.
- **Traces:** source legacy CONS-03 Adversarial → O-CONS03-1 → `…-03-CHECK-*`.

---

## Set S4 — Promotion & safety

The safety gate over what the baseline COMMITS: cross-topic contradictions resolved, claim status preserved
through promotion, secrets excluded, license/authority/binding-rules safe, promotion approved/bounded/
collision-safe, promotion recoverable, the P6.5 validity gate, and the evidence-or-fail floor over every
load-bearing claim.

### S4 coverage register (SR-1 — ten dispositions)

| # | Category | Disposition | Basis |
|---|---|---|---|
| C1 | Purpose / outcomes / scope | selected | RISK-06 secondary (design-substance dimensions); RISK-02 secondary |
| C2 | Actors / stakeholders / use-context | covered-elsewhere → S1, S3 | ledger below |
| C3 | Behavior / state / data | selected | CONS-01/02 secondary (claim invariant); RISK-03/04 secondary (mutation state) |
| C4 | Interfaces / dependencies / structure | covered-elsewhere → S2, S3 | ledger below |
| C5 | Quality attributes / resource economics | selected | RISK-05 secondary (cost / error-budget) |
| C6 | Failure / recovery / operations | selected | RISK-04 primary; RISK-03/05 secondary |
| C7 | Trust / harm / governance | selected | RISK-01/02/03/05 primary; RISK-06 secondary |
| C8 | Inclusion / locale | covered-elsewhere → S2 | ledger below |
| C9 | Change / compatibility / reversibility | covered-elsewhere → S3 | ledger below |
| C10 | Evidence / traceability / clarity | selected | CONS-01/02, RISK-06 primary; RISK-01/02 secondary |

**SR-7 covered-elsewhere ledgers (S4):**
- **C2 Actors → S1, S3.** Applicable families S1 PROJ-06, S3 USAGE-01; triggered types positive + negative +
  adversarial; oracle = a vague first user / a consumer forced to re-ask; actor = the first user / the next
  loop. Covering clause: S1 PROJ-06, S3 USAGE-01.
- **C4 Interfaces/dependencies → S2, S3.** Applicable families S2 STRUCT-04, S3 STRUCT-01/02; triggered types
  positive + negative + adversarial; oracle = an unspecified dependency / an off-table destination; actor =
  the manager. Covering clause: S2 STRUCT-04, S3 STRUCT-01, STRUCT-02.
- **C8 Inclusion/locale → S2.** Applicable family S2 USAGE-03; triggered types positive + negative +
  adversarial; oracle = a surface with no a11y/i18n; actor = end user/operator. Covering clause: S2 USAGE-03.
- **C9 Change/compatibility → S3.** Applicable family S3 USAGE-02; triggered types change/regression +
  failure/recovery; oracle = a blind-append rerun / a bad resume; actor = a later session. Covering clause:
  S3 USAGE-02.

**S4 populated cells (15):** C10×{positive, negative, adversarial}=3; C7×{positive, negative, adversarial}=3;
C6×{positive, negative, failure/recovery, adversarial}=4; C1×{positive}=1; C3×{positive, negative,
adversarial}=3; C5×{positive}=1 = 15. Within ~40.

### STARTUP-CONS-SCENARIO-01 — Cross-topic contradictions are resolved

- **Set:** S4 · **Declared primary category:** C10 Evidence/traceability/clarity → **Consistency**
  perspective (secondary Aesthetics) · **Secondary tags:** C3 (claim invariants across topics).
- **Primary justification (SR-4):** the family turns on the §7 cross-topic contradiction pass detecting and
  resolving conflicts so the baseline tells ONE coherent story — a coherence/traceability discrimination
  (C10). The claim invariants being compared (C3) are the data the pass reads; C10 is declared because the
  defining discrimination is whether the set's claims are mutually coherent and each conflict is traced to a
  recorded resolution.
- **Source / rationale:** legacy CONS-01 (failure-mode); D14 (C10, retained); T1 ledger for CONS-01.
- **Actor + outcome:** the manager runs the §7 contradiction pass. Outcome: every cross-topic conflict is
  reopened + resolved or recorded-open with an owner.
- **Situation / invariant:** later topics test and may contradict earlier product, data, quality, risk, or
  roadmap decisions. Invariant: the §7 pass explicitly checks vision vs scope, users vs journeys, non-goals
  vs roadmap, quality vs stack, data-promises vs architecture, risk-mitigations vs schedule/capacity, and
  binding-rules vs live-examples; each contradiction reopens the earliest owning branch + records authority/
  resolution, or remains recorded-open with an owner.
- **Applicability + priority:** unconditional; priority high.
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (a contradiction plausible in isolation) → C3.
  Boundary `n/a: no numeric limit`. Failure/recovery `n/a: no runtime failure`. Change/regression `n/a: no
  version event`. Counterfactual `n/a: covered by RISK-06`.
- **Obligations:** O-CONS01-1 the §7 pass MUST explicitly check the seven contradiction pairs; O-CONS01-2
  each contradiction MUST reopen the earliest owning branch and record authority/resolution, or remain
  recorded-open with an owner — synthesis MUST NOT hide a conflict by choosing one side without a ledger
  resolution.
- **Checklist mirror:** `STARTUP-CONS-SCENARIO-01-CHECK-*`.

#### STARTUP-CONS-SCENARIO-01-C1 — Contradiction pass runs and resolves (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C10 —
  exercises the coherence pass; positive-discrimination C3 — exercises the claim-invariant consistency}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** later topics that may contradict earlier decisions; **When** the §7 pass runs; **Then** it
  explicitly checks the seven pairs and each contradiction reopens the earliest owning branch + records
  authority/resolution, or remains recorded-open with an owner.
- **Failure oracle:** a contradiction pair not checked, or a conflict with no resolution/owner.
- **Evidence tuple:** observed-via the §7 pass record + the resolutions; method pair-coverage + resolution
  check; confirms = all pairs checked + each conflict resolved/owned.
- **Traces:** source legacy CONS-01 Good → O-CONS01-1, O-CONS01-2 → `…-01-CHECK-*`.

#### STARTUP-CONS-SCENARIO-01-C2 — Two claims conflict / conflict hidden (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C10 — exercises
  rejection of an unresolved contradiction; negative C3 — the conflicting claim invariant}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** the baseline; **When** two baseline claims conflict, or synthesis hides the conflict by choosing
  one without a ledger resolution; **Then** the family FAILs (cross-topic-contradiction).
- **Prohibited effects:** synthesis MUST NOT silently pick one side of a contradiction.
- **Failure oracle:** two conflicting claims with no recorded resolution.
- **Evidence tuple:** observed-via the claim set + §7 record; method contradiction detection; confirms = an
  unresolved conflict.
- **Traces:** source legacy CONS-01 Bad → O-CONS01-2 → `…-01-CHECK-*`.

#### STARTUP-CONS-SCENARIO-01-C3 — Each record plausible in isolation, set contradicts (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — per-record
  plausibility hides a cross-record contradiction). **Coverage-role:** {adversarial C10 — exercises the
  isolation-plausible probe; C3 — the cross-record invariant}.
- **Actor / role:** an author whose records each read plausibly / evaluator (checker).
- **Given** each individual record is plausible in isolation; **When** the non-goals exclude a capability
  that appears in "now", or the data-deletion promise cannot be met by the chosen architecture; **Then** the
  family FAILs it — per-record plausibility does not prove set coherence.
- **Prohibited effects:** per-record plausibility MUST NOT pass a set-level contradiction.
- **Failure oracle:** a non-goal/roadmap or data-promise/architecture contradiction across records.
- **Evidence tuple:** observed-via a cross-record consistency read; method pairwise-claim reconciliation;
  confirms = a cross-record contradiction unresolved.
- **Traces:** source legacy CONS-01 Adversarial → O-CONS01-1, O-CONS01-2 → `…-01-CHECK-*`.

### STARTUP-CONS-SCENARIO-02 — Claim kind and evidence status survive promotion

- **Set:** S4 · **Declared primary category:** C10 Evidence/traceability/clarity → **Consistency**
  perspective (secondary Aesthetics) · **Secondary tags:** C3 (claim-status state).
- **Primary justification (SR-4):** the family turns on each claim's KIND (observed fact / user intent /
  forecast / preference / decision / open question) and its evidence status surviving promotion unchanged —
  no load-bearing claim silently strengthened — an evidence-status-fidelity discrimination (C10). The
  claim-status state (C3) is the data preserved; C10 is declared because the defining discrimination is the
  fidelity of the evidence status through synthesis.
- **Source / rationale:** legacy CONS-02 (failure-mode); D14 (C10, retained); T1 ledger for CONS-02.
- **Actor + outcome:** the manager synthesizes + promotes. Outcome: claim kind + evidence status preserved.
- **Situation / invariant:** the ledger distinguishes observed fact, user intent, forecast, preference,
  decision, and open question, with a separate evidence status. Invariant: promoted prose preserves those
  distinctions — verified facts cite evidence, user intent is presented as intent, assumptions/open claims
  stay qualified or recorded-open, and no load-bearing claim becomes stronger during synthesis.
- **Applicability + priority:** unconditional; priority high.
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (a forecast rewritten to present tense) → C3.
  Boundary `n/a: no numeric limit`. Failure/recovery `n/a: no runtime failure`. Change/regression `n/a: no
  version/lifecycle change event — the ledger→promoted comparison is a fidelity check, not a version change`.
  Counterfactual `n/a: covered by RISK-06`.
- **Obligations:** O-CONS02-1 promoted prose MUST preserve each claim's kind and evidence status — verified
  facts cite evidence, user intent stays intent, assumptions/open claims stay qualified or recorded-open;
  O-CONS02-2 no load-bearing claim MUST become stronger during synthesis (no `unverified` → present-tense
  fact).
- **Checklist mirror:** `STARTUP-CONS-SCENARIO-02-CHECK-*`.

#### STARTUP-CONS-SCENARIO-02-C1 — Claim kind + evidence status preserved (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C10 —
  exercises the claim-status fidelity; C3 — the preserved claim state}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** a ledger distinguishing claim kinds + evidence status; **When** synthesis promotes prose;
  **Then** verified facts cite evidence, user intent is presented as intent, assumptions/open claims stay
  qualified or recorded-open, and no load-bearing claim is stronger than its ledger status.
- **Failure oracle:** a promoted claim whose status is stronger than its ledger entry.
- **Evidence tuple:** observed-via the promoted prose vs the ledger status; method claim-status comparison;
  confirms = preserved kind + status.
- **Traces:** source legacy CONS-02 Good → O-CONS02-1, O-CONS02-2 → `…-02-CHECK-*`.

#### STARTUP-CONS-SCENARIO-02-C2 — Unverified claim promoted as confirmed fact (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C10 — exercises
  rejection of a strengthened claim}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** the ledger; **When** an unverified market/scale/security/license/operational claim is promoted as
  an unqualified confirmed fact; **Then** the family FAILs (unverified-claim-promoted).
- **Prohibited effects:** an unverified claim MUST NOT be promoted as an unqualified fact.
- **Failure oracle:** an unqualified promoted fact whose ledger status is `unverified`.
- **Evidence tuple:** observed-via the promoted claim vs ledger; method status comparison; confirms = a
  strengthened claim.
- **Traces:** source legacy CONS-02 Bad → O-CONS02-1, O-CONS02-2 → `…-02-CHECK-*`.

#### STARTUP-CONS-SCENARIO-02-C3 — Forecast rewritten to present tense (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — a tense
  rewrite launders a forecast into observed reality). **Coverage-role:** {adversarial C10 — exercises the
  claim-strengthening probe; C3 — the claim-status invariant}.
- **Actor / role:** an author rewriting a forecast during synthesis / evaluator (checker).
- **Given** a plausible load-bearing forecast marked `unverified`; **When** it is rewritten into the present
  tense during synthesis; **Then** the family FAILs it — readers treat it as observed reality though the
  ledger marks it `unverified`.
- **Prohibited effects:** a forecast MUST NOT be laundered into a present-tense fact.
- **Failure oracle:** a present-tense promoted claim whose ledger source is a `forecast`/`unverified`.
- **Evidence tuple:** observed-via the promoted tense vs ledger claim kind; method tense/claim-kind
  comparison; confirms = a forecast promoted as observed reality.
- **Traces:** source legacy CONS-02 Adversarial → O-CONS02-2 → `…-02-CHECK-*`.

### STARTUP-RISK-SCENARIO-01 — Secrets and sensitive values never cross into durable output

- **Set:** S4 · **Declared primary category:** C7 Trust/harm/governance → **Risk** perspective (secondary
  Consistency) · **Secondary tags:** C10 (scan coverage of sources + destinations).
- **Primary justification (SR-4):** the family turns on sensitive values (secrets, credentials, PII, customer
  data, private URLs, user-marked-sensitive) staying record-level and never reaching any promoted destination
  or evaluation-evidence file — a data-harm/privacy discrimination (C7). The scan coverage (C10) is the
  mechanism; C7 is declared because the defining discrimination is the privacy/retention harm surface.
- **Source / rationale:** legacy RISK-01 (failure-mode); D14 (C7, retained); AR-1; T1 ledger for RISK-01. Per
  SR-9, every sensitive value below is referenced generically ("a user-marked sensitive token"), never
  inlined; the governing policy is record-level retention (never promoted).
- **Actor + outcome:** the manager promotes memory + writes evaluation evidence. Outcome: no sensitive value
  crosses into durable output.
- **Situation / invariant:** the raw log and ledger may hold credentials, private URLs, PII, customer data,
  or user-marked sensitive values. Invariant: sensitive values remain record-level and are stripped or safely
  generalized in every staged candidate, living-index candidate, summary, evaluation-evidence file, and
  promoted destination; the secret scan covers sources AND destinations, not only the ledger flag.
- **Applicability + priority:** unconditional; priority high (privacy harm).
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (a sensitive token surviving inside a valid
  record because the scan covered only typed fields) → C3. Boundary `n/a: no numeric limit`. Failure/recovery
  `n/a: no runtime failure`. Change/regression `n/a: no version event`. Counterfactual `n/a: covered by
  RISK-06`.
- **Obligations:** O-RISK01-1 sensitive values MUST remain record-level and be stripped/generalized in every
  staged candidate, living-index candidate, summary, evaluation-evidence file, and promoted destination;
  O-RISK01-2 the secret scan MUST cover sources AND destinations (prose + indexes, not only typed fields or
  the ledger flag).
- **Checklist mirror:** `STARTUP-RISK-SCENARIO-01-CHECK-*`.

#### STARTUP-RISK-SCENARIO-01-C1 — Sensitive values stay record-level (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C7 —
  exercises the privacy containment; C10 — exercises the source+destination scan}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** a raw log/ledger holding sensitive values (referenced by pointer, not inlined); **When**
  promotion + evaluation-evidence writing occur; **Then** each sensitive value is stripped or generalized in
  every staged candidate, living-index candidate, summary, evaluation-evidence file, and promoted
  destination, and the scan covered sources AND destinations.
- **Failure oracle:** a sensitive value present in any durable or evaluation-evidence output.
- **Evidence tuple:** observed-via a secret scan of sources + destinations (pointer/redaction, never inline);
  method source-and-destination scan; confirms = zero sensitive values in durable output.
- **Traces:** source legacy RISK-01 Good → O-RISK01-1, O-RISK01-2 → `…-01-CHECK-*`.

#### STARTUP-RISK-SCENARIO-01-C2 — A secret reaches promoted memory (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C7 — exercises
  rejection of a leaked secret}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** promotion; **When** a secret, credential, personal datum, customer name, private URL, or
  user-marked sensitive value reaches promoted memory or evaluation evidence; **Then** the family FAILs
  (promoted-secret).
- **Prohibited effects:** a sensitive value MUST NOT reach any durable or evaluation-evidence output.
- **Failure oracle:** any sensitive value in a promoted or evaluation-evidence file.
- **Evidence tuple:** observed-via a secret scan of the delta (by pointer/redaction); method destination
  scan; confirms = a leaked sensitive value.
- **Traces:** source legacy RISK-01 Bad → O-RISK01-1 → `…-01-CHECK-*`.

#### STARTUP-RISK-SCENARIO-01-C3 — Sensitive token survives in a valid record (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — a partial
  scan misses prose/indexes). **Coverage-role:** {adversarial C7 — exercises the scan-coverage probe}.
- **Actor / role:** an author scanning only typed fields / evaluator (checker).
- **Given** an otherwise-valid decision record; **When** a user-marked sensitive token survives inside it and
  is absorbed by the standalone commit because the scan covered only typed fields, not prose and indexes;
  **Then** the family FAILs it — a typed-field-only scan is not coverage.
- **Prohibited effects:** a typed-field-only scan MUST NOT be treated as complete secret coverage.
- **Failure oracle:** a sensitive token in prose/indexes that a typed-field scan misses.
- **Evidence tuple:** observed-via a full prose+index scan (by pointer/redaction); method whole-record scan;
  confirms = a token surviving a partial scan.
- **Traces:** source legacy RISK-01 Adversarial → O-RISK01-2 → `…-01-CHECK-*`.

### STARTUP-RISK-SCENARIO-02 — License, authority, binding-rule, and prior-art use are safe

- **Set:** S4 · **Declared primary category:** C7 Trust/harm/governance → **Risk** perspective (secondary
  Consistency) · **Secondary tags:** C1 (binding-rule scope), C10 (license/prior-art evidence).
- **Primary justification (SR-4):** the family turns on license/authority/binding-rule/prior-art reuse being
  SAFE — authorized decisions, license-compatible reuse, user-confirmed binding rules, an owned or
  validity-blocking compliance issue — a governance/compliance-harm discrimination (C7). The binding-rule
  scope (C1) and the license/prior-art evidence (C10) are the supporting concerns; C7 is declared because the
  defining discrimination is the legal/authority harm surface.
- **Source / rationale:** legacy RISK-02 (coverage-matrix); D14 (C7, retained); T1 ledger for RISK-02.
- **Actor + outcome:** the manager records license/binding-rule/prior-art decisions. Outcome: each is
  authorized, compatible, confirmed, or owned.
- **Situation / invariant:** startup records license/governance and binding-rule decisions and uses external
  prior art for design-bearing choices. Invariant: repository evidence supports the license; the deciding
  person has recorded authority; every promoted binding rule has explicit user confirmation of invariant/
  scope/reason/exception; borrowed code/content/patterns are identifiable + license-compatible; essential
  dependencies have trusted sources + approval; an unresolved compliance issue blocks validity or stays
  owned.
- **Applicability + priority:** predicate — applies where license/binding-rule/prior-art decisions exist;
  priority high.
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (a reference that supports the idea but whose
  license forbids the reuse) → C3. Boundary `n/a: no numeric limit`. Failure/recovery `n/a: no runtime
  failure`. Change/regression `n/a: no version event`. Counterfactual `n/a: covered by RISK-06`.
- **Obligations:** O-RISK02-1 repository evidence MUST support the license, the deciding person MUST have
  recorded authority, and every promoted binding rule MUST have explicit user confirmation of its invariant/
  scope/reason/exception; O-RISK02-2 borrowed code/content/patterns MUST be identifiable + license-compatible,
  essential dependencies MUST have trusted sources + approval, and an unresolved compliance issue MUST block
  validity or stay owned (never guessed).
- **Checklist mirror:** `STARTUP-RISK-SCENARIO-02-CHECK-*`.

#### STARTUP-RISK-SCENARIO-02-C1 — Authorized, compatible, confirmed (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C7 —
  exercises the governance safety; C1 — the binding-rule scope; C10 — the license/prior-art evidence}.
- **Actor / role:** the authorized decider + user (confirmer) / evaluator (checker).
- **Given** license/binding-rule/prior-art decisions; **When** the evaluator reads them; **Then** the license
  is repo-supported, the decider is authorized, each binding rule is user-confirmed (invariant/scope/reason/
  exception), borrowed material is identifiable + license-compatible, and any unresolved compliance blocks
  validity or is owned.
- **Failure oracle:** an unauthorized decision, an unconfirmed binding rule, or license-incompatible reuse.
- **Evidence tuple:** observed-via the license/binding-rule/prior-art records + authority markers; method
  authority + compatibility + confirmation check; confirms = safe governance.
- **Traces:** source legacy RISK-02 Good → O-RISK02-1, O-RISK02-2 → `…-02-CHECK-*`.

#### STARTUP-RISK-SCENARIO-02-C2 — Fabricated license / unconfirmed rule / incompatible copy (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C7 — exercises
  rejection of unsafe governance}.
- **Actor / role:** an unauthorized decider / evaluator (checker).
- **Given** governance decisions; **When** license is omitted or fabricated, a preference is hardened into a
  binding rule with no user confirmation, prior art is copied without compatible terms, or an unauthorized
  person settles a binding legal/security direction; **Then** the family FAILs.
- **Prohibited effects:** a binding rule MUST NOT ship without user confirmation and prior art MUST NOT be
  copied without compatible terms.
- **Failure oracle:** a fabricated license, an unconfirmed binding rule, or an incompatible copy.
- **Evidence tuple:** observed-via the records + authority + license terms; method confirmation + license
  check; confirms = an unsafe governance decision.
- **Traces:** source legacy RISK-02 Bad → O-RISK02-1, O-RISK02-2 → `…-02-CHECK-*`.

#### STARTUP-RISK-SCENARIO-02-C3 — Reference supports the idea but its license forbids reuse (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — a valid
  reference masks an incompatible reuse). **Coverage-role:** {adversarial C7 — exercises the learning-vs-
  copying probe}.
- **Actor / role:** an author reusing a reference without checking its license / evaluator (checker).
- **Given** a cited reference that supports the design idea; **When** its code/content license does not permit
  the intended reuse and the baseline records the choice without checking learning-from vs copying; **Then**
  the family FAILs it — supporting an idea is not the same as licensing its reuse.
- **Prohibited effects:** a reference's support for an idea MUST NOT be treated as license to reuse its
  material.
- **Failure oracle:** a reuse whose source license forbids it, recorded without the distinction.
- **Evidence tuple:** observed-via the reference license vs the reuse; method license-compatibility check;
  confirms = an incompatible reuse.
- **Traces:** source legacy RISK-02 Adversarial → O-RISK02-2 → `…-02-CHECK-*`.

### STARTUP-RISK-SCENARIO-03 — Promotion is approved, bounded, and collision-safe

- **Set:** S4 · **Declared primary category:** C7 Trust/harm/governance → **Risk** perspective (secondary
  Consistency) · **Secondary tags:** C6 (collision/TOCTOU recovery), C3 (memory mutation state).
- **Primary justification (SR-4):** the family turns on memory promotion being APPROVED (Always-Ask over
  exact destinations), BOUNDED (validate-before-write), and COLLISION-SAFE (per-mutation TOCTOU preimage
  recheck; collision halts) — an irreversible-mutation governance discrimination (C7). The collision/TOCTOU
  recovery (C6) and the mutation state (C3) are the mechanism; C7 is declared because the defining
  discrimination is the authority + irreversibility of the memory mutation.
- **Source / rationale:** legacy RISK-03 (failure-mode); D14 (C7, retained); T1 ledger for RISK-03.
- **Actor + outcome:** the manager mutates memory at P6. Outcome: no memory changes before validation +
  approval; each mutation is preimage-safe.
- **Situation / invariant:** P5 validates and approves the whole manifest before P6 performs any memory
  mutation. Invariant: every candidate validates before the first write; the final Always-Ask approval
  covers exact destinations + operations; each mutation rechecks its recorded preimage; every actual memory
  change is listed; a create collision halts or becomes an explicit supersession; no memory changed before
  validation + approval.
- **Applicability + priority:** unconditional; priority high (irreversible mutation).
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (a TOCTOU write after a stale preimage) → C3.
  Boundary `n/a: the check-to-use interleave is exercised as the C3 adversarial probe`. Failure/recovery
  `n/a: full rollback + recovery is graded by RISK-04`. Change/regression `n/a: no version event`.
  Counterfactual `n/a: covered by RISK-06`.
- **Obligations:** O-RISK03-1 every candidate MUST validate before the first write and the final Always-Ask
  approval MUST cover the exact destinations + operations; O-RISK03-2 each mutation MUST recheck its recorded
  preimage, every actual change MUST be listed, and a create collision MUST halt or become an explicit
  supersession — no memory changes before validation + approval.
- **Checklist mirror:** `STARTUP-RISK-SCENARIO-03-CHECK-*`.

#### STARTUP-RISK-SCENARIO-03-C1 — Validated, approved, preimage-safe promotion (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C7 —
  exercises the approved/bounded mutation}.
- **Actor / role:** manager (producer) + user (approver) / evaluator (checker).
- **Given** the P5 manifest; **When** P6 promotes; **Then** every candidate validated before the first write,
  the Always-Ask approval covered exact destinations + operations, each mutation rechecked its preimage,
  every actual change was listed, and a collision halted or became a supersession.
- **Failure oracle:** a write before validation/approval, or a mutation with no preimage recheck.
- **Evidence tuple:** observed-via the manifest + approval + per-mutation preimage records; method
  validate-before-write + preimage-recheck check; confirms = an approved, preimage-safe promotion.
- **Traces:** source legacy RISK-03 Good → O-RISK03-1, O-RISK03-2 → `…-03-CHECK-*`.

#### STARTUP-RISK-SCENARIO-03-C2 — Write before gate / collision overwrite / clobber (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C7 — exercises
  rejection of an ungoverned mutation; negative C3 — the clobbered memory state}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** promotion; **When** memory changes before the gate, an unlisted or colliding destination is
  overwritten, or a concurrent edit is clobbered after a stale P5 preimage; **Then** the family FAILs.
- **Prohibited effects:** memory MUST NOT change before validation/approval and a collision MUST NOT
  overwrite.
- **Failure oracle:** a pre-gate write, an unlisted overwrite, or a clobbered concurrent edit.
- **Evidence tuple:** observed-via the write order + preimage + change list; method order + preimage check;
  confirms = a pre-gate or colliding write.
- **Traces:** source legacy RISK-03 Bad → O-RISK03-1, O-RISK03-2 → `…-03-CHECK-*`.

#### STARTUP-RISK-SCENARIO-03-C3 — User edit lands in the check-to-use window (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Boundary}; primary Adversarial — a concurrent
  edit exploits the TOCTOU interleave). **Coverage-role:** {adversarial C7 — exercises the TOCTOU probe;
  C3 — the preimage/mutation state}.
- **Actor / role:** a concurrent user edit (subject) / evaluator (checker).
- **Given** a manifest valid at P5; **When** a user edit lands before P6 and promotion writes anyway because
  no per-mutation TOCTOU recheck enforced the preimage; **Then** the family FAILs it — validity at P5 is not
  validity at the exact moment of the write.
- **Prohibited effects:** a P5-valid preimage MUST NOT authorize a write when the target changed before P6.
- **Failure oracle:** a P6 write over a target edited after its recorded preimage, with no recheck.
- **Evidence tuple:** observed-via the preimage vs the target at write time; method per-mutation TOCTOU
  recheck; confirms = a stale-preimage write.
- **Traces:** source legacy RISK-03 Adversarial → O-RISK03-2 → `…-03-CHECK-*`.

### STARTUP-RISK-SCENARIO-04 — Promotion finishes in a verified, recoverable state

- **Set:** S4 · **Declared primary category:** C6 Failure/recovery/operations → **Risk** perspective
  (secondary Structure, Usage) · **Secondary tags:** C7 (memory-corruption harm), C3 (write verification).
- **Primary justification (SR-4):** the family turns on promotion finishing in a VERIFIED, RECOVERABLE state
  — destinations + content verify, guards pass, and any partial write is fully rolled back or routed through
  the recovery contract — a failure-recovery discrimination (C6). The memory-corruption harm (C7) and the
  write verification (C3) are the stakes; C6 is declared because the defining discrimination is completion-or-
  rollback after a partial failure.
- **Source / rationale:** legacy RISK-04 (failure-mode); D14 (C6, retained); T1 ledger for RISK-04.
- **Actor + outcome:** the manager writes records + verifies + runs guards. Outcome: promotion is complete or
  fully rolled back.
- **Situation / invariant:** P6 writes typed records, supersessions, archive moves, and indexes, then
  verifies destinations and runs standing guards. Invariant: exact destinations + content verify;
  supersession links + archive moves pair; indexes update last + their pointers resolve; all standing guards
  pass; promotion is complete or fully rolled back, with any partial state routed through the Always-Ask
  recovery contract.
- **Applicability + priority:** unconditional; priority high.
- **Triggered minimums (SR-2/SR-3):** Failure/recovery TRIGGERED (a partial write → rollback/recovery) → C3.
  Adversarial TRIGGERED (a README hides a partial state) → C4. Boundary `n/a: no numeric limit`.
  Change/regression `n/a: no version event`. Counterfactual `n/a: covered by RISK-06`.
- **Obligations:** O-RISK04-1 exact destinations + content MUST verify, supersession links + archive moves
  MUST pair, indexes MUST update last with resolving pointers, and all standing guards MUST pass; O-RISK04-2
  promotion MUST be complete or fully rolled back, with any partial state routed through the Always-Ask
  recovery contract (never deleting/overwriting pre-existing memory outside the narrow carve-out).
- **Checklist mirror:** `STARTUP-RISK-SCENARIO-04-CHECK-*`.

#### STARTUP-RISK-SCENARIO-04-C1 — Verified, complete promotion (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C6 —
  exercises the verified-completion + recovery-ready state}.
- **Actor / role:** manager (producer) / evaluator (checker).
- **Given** P6 writes; **When** the evaluator verifies; **Then** exact destinations + content verify,
  supersession links + archive moves pair, indexes update last with resolving pointers, and all standing
  guards pass.
- **Failure oracle:** an unverified destination, an unpaired supersession, or a red guard.
- **Evidence tuple:** observed-via the destinations + guards + index pointers; method destination + guard +
  pointer verification; confirms = a verified, complete promotion.
- **Traces:** source legacy RISK-04 Good → O-RISK04-1 → `…-04-CHECK-*`.

#### STARTUP-RISK-SCENARIO-04-C2 — Partial/unverified / index-to-missing / unsafe recovery (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C6 — exercises
  rejection of an unverified/partial promotion}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** P6; **When** promotion is partial or unverified, a guard is red, an index points to a missing
  record, or recovery deletes/overwrites pre-existing memory outside the narrow carve-out; **Then** the
  family FAILs.
- **Prohibited effects:** recovery MUST NOT delete/overwrite pre-existing memory outside the carve-out.
- **Failure oracle:** a partial/unverified state, a red guard, or a dangling index.
- **Evidence tuple:** observed-via the destinations + guards + indexes; method completeness + guard check;
  confirms = a partial/unverified promotion.
- **Traces:** source legacy RISK-04 Bad → O-RISK04-1, O-RISK04-2 → `…-04-CHECK-*`.

#### STARTUP-RISK-SCENARIO-04-C3 — Partial write rolls back or routes to recovery (failure/recovery)
- **Primary type:** Failure/recovery (matched {Failure/recovery, Positive}; primary Failure/recovery — the
  defining discrimination is completion-or-rollback after a partial write). **Coverage-role:**
  {failure/recovery C6 — exercises the full rollback / Always-Ask recovery on a partial write}.
- **Actor / role:** the promotion process (subject) / evaluator (checker).
- **Given** a partial promotion (a typed-record write or archive move failed midway); **When** the failure is
  detected; **Then** promotion is fully rolled back OR the partial state is routed through the Always-Ask
  recovery contract — never left partial and never masked.
- **Failure oracle:** a partial state left in place with no rollback or recovery routing.
- **Evidence tuple:** observed-via the post-failure memory state; method rollback/recovery completeness
  check; confirms = a fully rolled-back or recovery-routed state.
- **Traces:** source legacy RISK-04 Good/Bad (recovery contract) → O-RISK04-2 → `…-04-CHECK-*`.

#### STARTUP-RISK-SCENARIO-04-C4 — README hides an earlier partial failure (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — a complete-
  looking README masks a partial state). **Coverage-role:** {adversarial C6 — exercises the hidden-partial-
  state probe}.
- **Actor / role:** an author whose README reads complete / evaluator (checker).
- **Given** a root README that makes the baseline appear complete; **When** a typed-record write or an
  archive move failed earlier and the summary hides the partial state; **Then** the family FAILs it — a
  complete-looking README is not a verified complete promotion.
- **Prohibited effects:** a complete-looking README/summary MUST NOT mask a partial promotion.
- **Failure oracle:** a "complete" README while a destination write/archive move actually failed.
- **Evidence tuple:** observed-via the README vs the actual destination/guard state; method README-vs-actual
  reconciliation; confirms = a masked partial state.
- **Traces:** source legacy RISK-04 Adversarial → O-RISK04-1, O-RISK04-2 → `…-04-CHECK-*`.

### STARTUP-RISK-SCENARIO-05 — P6.5 gates validity and records cost / error-risk commitments

- **Set:** S4 · **Declared primary category:** C7 Trust/harm/governance → **Risk** perspective (secondary
  Consistency) · **Secondary tags:** C5 (cost / error-budget economics), C6 (verdict routing).
- **Primary justification (SR-4):** the family turns on the P6.5 two-fresh-evaluator gate authorizing
  `baseline_valid: true` ONLY on a real dual-system PASS (never one system, never a stamp before exact
  verification), plus bounded cost/error-risk commitments — a validity-governance discrimination (C7). The
  cost/error-budget economics (C5) and the verdict routing (C6) are the supporting concerns; C7 is declared
  because the defining discrimination is the anti-groupthink validity AUTHORITY.
- **Source / rationale:** legacy RISK-05 (coverage-matrix); D14 (C7, retained); T1 ledger for RISK-05.
- **Actor + outcome:** two fresh evaluators + the manager. Outcome: validity is authorized only by a real
  dual-system PASS; cost/error risks are bounded.
- **Situation / invariant:** two fresh evaluators review the frozen promoted baseline after the guards and
  before P7; the baseline may also encode recurring-cost, error-budget, rollback, and irreversible
  commitments. Invariant: both systems produce all nine evaluation files; the manager reconciles their
  verdicts; `PASS` alone permits P7 + `baseline_valid: true`; `REVISE` returns to the earliest owning phase
  and `FAIL` halts; cost/error-budget/rollback/irreversibility risks are recorded with limits or
  proven-irrelevant reasons.
- **Applicability + priority:** unconditional; priority high (validity keystone).
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (a single-system stamp) → C3. Boundary `n/a: the
  two-vs-one evaluator edge is exercised as the C3 single-system probe`. Failure/recovery `n/a: verdict
  routing is graded here, rollback by RISK-04`. Change/regression `n/a: no version event`. Counterfactual
  `n/a: covered by RISK-06`.
- **Obligations:** O-RISK05-1 both systems MUST produce all nine evaluation files, the manager MUST reconcile
  their verdicts, `PASS` alone permits P7 + `baseline_valid: true`, `REVISE` returns to the earliest owning
  phase, and `FAIL` halts; O-RISK05-2 cost/error-budget/rollback/irreversibility risks MUST be recorded with
  limits or proven-irrelevant reasons.
- **Checklist mirror:** `STARTUP-RISK-SCENARIO-05-CHECK-*`.

#### STARTUP-RISK-SCENARIO-05-C1 — Dual-system PASS gates validity + bounded risks (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C7 —
  exercises the dual-system validity gate; C5 — exercises the recorded cost/error-budget limits}.
- **Actor / role:** two fresh evaluators + manager (producers) / evaluator (checker).
- **Given** the frozen promoted baseline; **When** P6.5 runs; **Then** both systems produce all nine files,
  the manager reconciles the verdicts, `PASS` alone permits P7 + `baseline_valid: true`, `REVISE`/`FAIL`
  route correctly, and cost/error-budget/rollback/irreversibility risks are recorded with limits or
  proven-irrelevant reasons.
- **Failure oracle:** a validity stamp without both nine-file sets, or an unbounded cost/error commitment.
- **Evidence tuple:** observed-via the two evaluation sets + the verdict routing + the risk records; method
  dual-set completeness + routing + budget check; confirms = a real dual-system gate + bounded risks.
- **Traces:** source legacy RISK-05 Good → O-RISK05-1, O-RISK05-2 → `…-05-CHECK-*`.

#### STARTUP-RISK-SCENARIO-05-C2 — Premature validity / missing evaluator / unbounded risk (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C7 — exercises
  rejection of an unauthorized validity stamp}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** P6.5; **When** `baseline_valid: true` is set before exact verification + P6.5 PASS, one evaluator
  is missing, a divergence is ignored, or a cost/error-risk commitment has no bound or recovery direction;
  **Then** the family FAILs.
- **Prohibited effects:** validity MUST NOT be stamped before a real dual-system PASS and a risk MUST NOT be
  unbounded.
- **Failure oracle:** a premature validity stamp, a missing evaluator, or an unbounded risk.
- **Evidence tuple:** observed-via the validity flag vs the gate state; method gate-precondition check;
  confirms = a premature or single-system validity.
- **Traces:** source legacy RISK-05 Bad → O-RISK05-1, O-RISK05-2 → `…-05-CHECK-*`.

#### STARTUP-RISK-SCENARIO-05-C3 — Valid stamped after only one system passes (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Negative}; primary Adversarial — a
  single-system pass masquerades as the dual-system gate). **Coverage-role:** {adversarial C7 — exercises the
  single-system-stamp probe}.
- **Actor / role:** an author stamping validity on one system / evaluator (checker).
- **Given** the P6.5 gate; **When** the summary is stamped valid after only one system passes while the other
  is absent or has a Critical finding; **Then** the family FAILs it — a superficially-complete baseline MUST
  NOT enter later loops without the anti-groupthink gate.
- **Prohibited effects:** a single-system pass MUST NOT authorize validity.
- **Failure oracle:** a validity stamp with only one system's PASS or an unresolved Critical from the other.
- **Evidence tuple:** observed-via both systems' verdicts vs the validity stamp; method dual-system-PASS
  precondition check; confirms = a single-system validity stamp.
- **Traces:** source legacy RISK-05 Adversarial → O-RISK05-1 → `…-05-CHECK-*`.

### STARTUP-RISK-SCENARIO-06 — Load-bearing design claims are evidenced or fail

- **Set:** S4 · **Declared primary category:** C10 Evidence/traceability/clarity → **Consistency**
  perspective (secondary Aesthetics) · **Secondary tags:** C1 (design-substance dimensions), C7 (fabrication/
  laundering integrity harm).
- **Primary justification (SR-4):** the family turns on whether EVERY load-bearing design claim (problem
  reality, user clarity, product-shape soundness, feasibility & sustainability) is EVIDENCED to its standard
  or proven-irrelevant — no bare assertion, no fabricated citation, no laundered `n/a` — an evidence-
  sufficiency discrimination (C10) that drives REVISE/FAIL. The design-substance dimensions (C1) are the
  subject and the fabrication/laundering harm (C7 — routing secondary Risk) the stake; C10 is declared over
  C7 because the defining discrimination is evidence sufficiency, not an abuse surface.
- **Source / rationale:** legacy RISK-06 (failure-mode); D14 (C10, retained over C7); SG-5, SA-4; T1 ledger
  for RISK-06.
- **Actor + outcome:** the P6.5 evaluators + manager. Outcome: no un-evidenced load-bearing claim is
  accepted.
- **Situation / invariant:** the baseline carries load-bearing claims across problem reality, user clarity,
  product-shape soundness, and feasibility & sustainability that later loops will trust. Invariant: every
  load-bearing design claim is evidenced to its standard or proven-irrelevant; none is a bare assertion; no
  fabricated citation and no laundered `n/a`.
- **Applicability + priority:** unconditional; priority high (the substance floor).
- **Triggered minimums (SR-2/SR-3):** Adversarial TRIGGERED (process-perfect, substance-hollow) → C3.
  Counterfactual TRIGGERED (invert "the claim is evidenced") → exercised in C2/C3 oracles. Boundary `n/a: no
  numeric limit`. Failure/recovery `n/a: no runtime failure`. Change/regression `n/a: no version event`.
- **Obligations:** O-RISK06-1 every load-bearing design claim across the four substance dimensions MUST be
  evidenced to its standard or proven-irrelevant, with `recorded-open` treated as COVERAGE not acceptance (an
  applicable un-evidenced load-bearing claim drives ≥REVISE, ownership does not excuse it); O-RISK06-2 a
  fabricated citation, a silently-strengthened claim status, or an `n/a` with no genuine claim-specific reason
  drives FAIL.
- **Checklist mirror:** `STARTUP-RISK-SCENARIO-06-CHECK-*`.

#### STARTUP-RISK-SCENARIO-06-C1 — Every load-bearing claim evidenced or proven-irrelevant (positive)
- **Primary type:** Positive/`Good` (matched {Positive}). **Coverage-role:** {positive-discrimination C10 —
  exercises evidence sufficiency; C1 — exercises the four design-substance dimensions}.
- **Actor / role:** the evaluators + manager (producers) / evaluator (checker).
- **Given** the baseline's load-bearing claims across the four dimensions; **When** the evaluator checks each;
  **Then** each is evidenced to its standard or proven-irrelevant, none is a bare assertion, and no citation
  is fabricated and no `n/a` laundered.
- **Failure oracle:** a load-bearing claim that is a bare assertion or a laundered `n/a`.
- **Evidence tuple:** observed-via each load-bearing claim + its evidence; method per-claim
  evidence-sufficiency check; confirms = every claim evidenced or genuinely proven-irrelevant.
- **Traces:** source legacy RISK-06 Good → O-RISK06-1, O-RISK06-2 → `…-06-CHECK-*`.

#### STARTUP-RISK-SCENARIO-06-C2 — Un-evidenced claim / fabrication / laundered n/a (negative)
- **Primary type:** Negative/`Bad` (matched {Negative}). **Coverage-role:** {negative C10 — exercises
  rejection of an un-evidenced or laundered claim}.
- **Actor / role:** manager (producer of the defect) / evaluator (checker).
- **Given** the baseline; **When** a load-bearing design claim is un-evidenced and not proven-irrelevant
  (ownership does not excuse it; `recorded-open` is coverage, not acceptance → drives ≥REVISE), OR a
  fabricated citation / a silently-strengthened claim status / an `n/a` with no genuine claim-specific reason
  appears (→ drives FAIL); **Then** the family FAILs.
- **Prohibited effects:** ownership or `recorded-open` MUST NOT make an un-evidenced load-bearing claim
  acceptable, and no `n/a` may be laundered.
- **Failure oracle:** an applicable un-evidenced load-bearing claim, a fabricated citation, or a laundered
  `n/a`.
- **Evidence tuple:** observed-via each claim's evidence + citation validity; method evidence + citation +
  n/a-genuineness check; confirms = an un-evidenced or laundered claim.
- **Traces:** source legacy RISK-06 Bad → O-RISK06-1, O-RISK06-2 → `…-06-CHECK-*`.

#### STARTUP-RISK-SCENARIO-06-C3 — Process-perfect, substance-hollow baseline (adversarial)
- **Primary type:** Adversarial/gaming (matched {Adversarial, Counterfactual}; primary Adversarial — full
  process compliance masks empty substance). **Coverage-role:** {adversarial C10 — exercises the
  process-perfect-substance-hollow probe}.
- **Actor / role:** an author whose baseline is process-perfect / evaluator (checker).
- **Given** a baseline that is fully covered, atomic, secret-free, and traceable; **When** its core problem /
  user / product-shape / feasibility claims have no behavioral or verified evidence; **Then** the family FAILs
  it — process perfection is not substance; the core claims must still be evidenced.
- **Prohibited effects:** process compliance (coverage/atomicity/secret-free/traceable) MUST NOT pass a
  substance-hollow baseline.
- **Failure oracle:** a process-perfect baseline whose core load-bearing claims lack evidence.
- **Evidence tuple:** observed-via the core claims' evidence despite process compliance; method
  substance-vs-process check; confirms = process-perfect but substance-hollow.
- **Traces:** source legacy RISK-06 Adversarial → O-RISK06-1 → `…-06-CHECK-*`.

---

## Conformance and ownership

This set is written to the scenario SOP and borrows the facts it does not own from one owner each.

- The category / family / case / obligation model, the ten coverage categories and their match predicates,
  the primary-declaration mechanism, the coverage-role + n-ary inseparability model, the SR-8 thresholds, and
  the design-category → evaluation-perspective map are owned by `scenario/SKILL.md` (SR-1…SR-14 + Reference
  data). This file APPLIES that map to route each family's declared primary category to a perspective; it
  does not restate the map.
- The seven perspective filenames and their fixed order are owned by `evaluation/SKILL.md § Perspectives`;
  the startup-specific perspective lenses, recommended verifications, verdict routing, and the nine-output
  P6.5 contract are owned by the sibling `evaluation.md`. This file names the routed perspective per family;
  it does not define the lens.
- The concrete yes/no checks, the item field schema, the two closed terminals, and the coverage-closure ≠
  acceptance two-gate are owned by the sibling `checklist.md` (and `checklist/SKILL.md`). This file traces
  each family to its `{family-id}-CHECK-*` namespace by reference; it never reads or constructs a check.
- The phase-result readout schema, body, confirmation oracle, resume rules, and promotion-exclusion that
  PROJ-08 grades are owned by `recording.md § 1`. This file grades their observable properties; it does not
  restate the schema.
- The migration losslessness ledger (source primitives + logical relations) is owned by the T1 evidence rows
  in `startup-migration-evidence.md`; this file's cases + obligations are the destination union those rows
  map to.
