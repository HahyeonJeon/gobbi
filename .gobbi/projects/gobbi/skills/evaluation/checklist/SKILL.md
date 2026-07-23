---
name: checklist
description: "Use when designing or writing a checklist for operational execution, design obligations, or evaluation coverage — the modes, the five item dimensions, the closed resolution state machine, and the two-gate acceptance rule."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Checklist

Skill for designing and writing a checklist — the small, binary, evidence-anchored list of items a
target must satisfy, each resolved by named evidence at a real pause point. Load it to design a new
checklist, or to rewrite one, for operational execution, design obligations, or evaluation coverage.

A checklist declares its mode and use-style up front, protects a few critical items at each pause
point, and resolves every item through one closed state machine. It reads a scenario set's obligations
when one exists; it does not replace a procedure, a scenario narrative, a test suite, or the evaluation
finding ledger.

---

## Principles

> **A checked box means verified, not done.**

A checklist item is a claim that a condition holds, confirmed by looking at evidence — not a note that
the step was attempted. A box ticked from memory, or because the work "should" have happened, records
confidence instead of a fact. The worth of a checklist is that each mark stands on inspected evidence,
so a reader can trust it without redoing the check.

> **Coverage closed is not acceptance.**

Reaching a terminal state on every item — even a fail, a recorded-open, or a deferral — means the
checklist has been fully worked, not that the target passed. Acceptance is a stronger, separate claim:
every applicable gate and required item actually holds. Folding the two together lets an
owned-but-unmet item slip through as "closed," which is the exact gap a checklist exists to prevent.

> **One artifact; the use-style is per run.**

The same checklist is read forward to guide work and read back to confirm work. Writing two artifacts
for the two readings splits the source and lets them drift. One item list, with the reading declared
per run and worked on a filled copy, keeps design and evaluation anchored to the same items.

> **A few critical items at a real pause point earn the attention a long list loses.**

A checklist earns compliance only when it is short enough to run and placed where a decision actually
stops. A long list of every possible check is skimmed and ignored; a handful of items that would cause
real harm if missed, placed at a genuine pause, get read and acted on. The point is not exhaustive
coverage but reliable attention where it matters.

> **A gate you can game is not a gate.**

An item a cosmetically-conformant target can satisfy without meeting the intent proves nothing. A gate
passes only when inspected evidence shows the condition holds; if a matching label or a
present-but-empty artifact is enough, the gate decorates the process instead of guarding it.

---

## Rules

### Must-Follow

- **CR-1 — MUST declare a mode, keep the source unchecked, and isolate every run in a filled copy.** Every
  checklist declares one mode (operational / design / evaluation coverage register), and the source ships
  with every box UNCHECKED. Each run works a fresh FILLED COPY that identifies the source version and the
  run, and declares a use-style (`read-do` or `do-confirm`) for every pause point it uses (an evaluation
  coverage register has no pause points, so it declares ONE run-level use-style, default `do-confirm`) —
  never the source. A pre-ticked source or a run that mutates the source corrupts every later run.
- **CR-2 — MUST keep an evaluation coverage register gate/required-only and closed to three tokens.** In
  evaluation-coverage-register mode a checklist carries gate and required items only — no advisory item —
  and every row closes to exactly one of `PASS`, `FAIL:<finding-id>`, or `n/a:<property>`. An advisory
  item or any softer token turns a coverage ledger into an opinion column.
- **CR-3 — MUST accept only when every applicable gate and required item is `PASS`.** Acceptance is a
  single positive condition: every applicable gate and required item resolves `PASS`. A
  `FAIL:<id>`, a `recorded-open`, or a `deferred` on any such item is coverage-closed but NOT accepted —
  an owner or a pointer closes coverage, never acceptance. The one bounded exception is an
  operational-mode `waived/exception-authorized` (scoped by CR-4) on a killer, and it holds ONLY when
  its recorded authority mandate covers that item's consequence and stop action (CR-7), the authorization
  evidence is cited, and the rationale is recorded. A waiver substitutes for `PASS` on that item alone and
  is never counted as a `PASS`.
- **CR-4 — MUST scope each soft token to its permitted modes; this is their sole home.** `CONSIDERED` is
  advisory-only; `recorded-open` is operational and design only; `deferred` is design only;
  `waived/exception-authorized` is operational only. `PASS`, `FAIL:<id>`, and `n/a:<property>` are
  permitted in every mode. A token used outside its permitted modes is an invalid resolution.
- **CR-5 — MUST give every item its complete, type-bounded field set.** Every item carries a stable ID,
  its pause-point or hierarchy group, one criticality (gate/killer, required, or advisory), the run's
  use-style, an applicability declaration (unconditional, conditional-with-predicate, or `n/a:<property>`),
  a source trace, and one resolution slot. A gate or required item also carries one atomic binary claim,
  its explicit pass condition, a named evidence method or source, and an on-fail route (a killer's route
  is its CR-7 consequence and stop action); independently falsifiable clauses are separate items. The sole
  exemption is an advisory item: its decision prompt, source, applicability, and recorded
  decision-plus-rationale replace the binary claim, proof checkbox, evidence, and on-fail fields — and
  only for an item whose declared criticality is `advisory`. `advisory` is legal ONLY for an item with no
  mandatory source: an item whose source trace is a mandatory obligation (a requirement, risk, rule, or
  scenario design-obligation) MUST be gate or required, so it stays acceptance-bearing. An item missing a
  required field cannot be resolved the same way across runs.
- **CR-6 — MUST rest every gate/required terminal on named, inspected evidence.** A gate or required
  item's terminal (`PASS` / `FAIL:<id>` / `n/a:<property>`) is marked only after the evidence it claims is
  named and inspected: a `PASS` cites what proves the pass condition true; an `n/a:<property>` cites the
  inspected evidence that the applicability predicate is FALSE (a bare property label is not evidence, so
  an applicable item can never be relabeled `n/a` to dodge the gate); a `FAIL:<id>` cites its finding or
  action. Never mark from memory, intention, an assigned owner, or a cosmetically-conformant surface. An
  `advisory` item is not acceptance-bearing: its `CONSIDERED:<decision/rationale>` carries its recorded
  decision and rationale per CR-5, not evidence. A gate/required mark a label-match or a present-but-empty
  artifact could earn is a false pass.
- **CR-7 — MUST make every killer name its consequence and its stop action.** A killer (gate) item names
  the concrete harm its miss causes AND the stop action taken on fail — halt, escalate, or open a
  finding. A gate that fails with no defined stop is an alarm no one is required to act on.

### Must-Not-Follow

- **NEVER fold a coverage property into the acceptance predicate** — ownership, `recorded-open`, or a
  filed ticket closes coverage, not acceptance; treating one as a `PASS` is the escape hatch CR-3
  forbids. Fix: accept only on `PASS`; record the rest as coverage-closed-not-accepted.
- **NEVER use a token outside the mode-and-criticality scope CR-4 defines** — the soft tokens are not
  interchangeable across modes. Fix: resolve with a token CR-4 permits for the mode, or change the item's
  criticality.
- **NEVER admit an advisory item into an evaluation coverage register** — it dilutes a coverage ledger
  into opinion. Fix: keep the register gate/required-only (CR-2); route the judgment to design or
  operational mode.
- **NEVER treat a waiver as a general override** — it is the single bounded exception defined by CR-3 and
  scoped by CR-4, nothing wider. Fix: anywhere outside those bounds, a non-`PASS` item stays not-accepted.
- **NEVER relabel a mandatory-source item `advisory` to drop it from acceptance** — an obligation-derived
  `Check` (from a requirement, risk, rule, or scenario design-obligation) stays gate or required. Fix:
  mark it gate or required; reserve `advisory` for an item with no mandatory source.
- **NEVER tick a box without inspecting its named evidence** — a from-memory or label-match tick is a
  false pass. Fix: name and inspect the evidence first (CR-6).
- **NEVER write a broad, unfalsifiable item** ("ensure security is robust") — it cannot be resolved or
  failed. Fix: make it atomic, binary, and evidence-anchored with an on-fail route (CR-5; the § Procedure
  example).

---

## Procedure

Design a checklist in nine steps, grouped **FRAME** (P1–P3) → **BUILD** (P4–P6) → **HARDEN** (P7–P9).
Each step is a bare action that points at the invariant it must satisfy (`apply CR-x`); the invariant
text lives once in § Rules and is never restated here. The blocks below are reference DATA the steps
consult — the modes, the item dimensions, the token definitions and per-mode grid, and the field lists.
This document keeps its current shape as a legacy untyped skill; `skill-writing` now assigns section
contracts by semantic type when a skill is created or substantively revised.

### Reference data — structural terms

- **Check** — one atomic verification item: a single claim whose pass condition resolves from named
  evidence without first resolving another independently falsifiable claim. This skill owns this term.
- **Checklist source** — the reusable, versioned checklist whose items stay unresolved and unchecked.
- **Filled copy** — one run-specific instance of a source; it records the run identity, use-style,
  evidence, and terminal resolutions without changing the source.
- **Source trace** — an exact pointer from an item to the requirement, obligation, decision, or scenario
  clause that made the item exist.
- **Pause point** — a named point before an irreversible action, handoff, or release where a failed item
  can still change the next action.
- **Coverage closure** — every item in the mode's closure population (per the per-mode grid) has a
  terminal resolution; it is not acceptance (CR-3).
- **Acceptance** — the separate approve-or-continue outcome computed only by CR-3 after coverage closure.
- **Cosmetic compliance** — the target matches an item's expected words, labels, or shape while the
  property its pass condition names is absent.
- **False pass / false fail** — an item resolves `PASS` though the target violates its pass condition, or
  `FAIL` though the target satisfies it.

### Reference data — checklist modes (3)

| Mode | Use | Item criticality + size |
|---|---|---|
| **Operational** | repeated execution where omission is dangerous | gate(killer) / required / advisory; ~5–9 killer/required per pause point |
| **Design** | prospective obligations plus decision gates | gate / required / advisory; grouped by pause point or scenario category |
| **Evaluation coverage register** | evidence-based review of a broad frame | gate / required ONLY — no advisory (CR-2); may exceed nine rows; grouped by category + family |

In evaluation-coverage-register mode a check is **gate/killer** when its miss is the most costly or
irreversible (a load-bearing acceptance claim, or a safety / data-loss / trust-boundary check) and
**required** otherwise; with no runtime pause point, the CR-7 stop action reads as *open a blocking
finding*.

### Reference data — the five item dimensions

Every item is placed on five orthogonal dimensions:

- **Use style** — `read-do` or `do-confirm`, declared per pause point and per run.
- **Criticality** — `gate/killer`, `required`, or `advisory` (an evaluation register uses gate/required
  only — CR-2).
- **Resolution** — one token from the closed enum below.
- **Evidence** — direct/tool · trace/citation · human confirmation · bounded inference.
- **Applicability** — unconditional · conditional-with-predicate · `n/a:<property>`.

By default a design run reads `read-do`, an evaluation run reads `do-confirm`, and an operational run
picks the style that matches each pause point; the source is identical in every use.

### Reference data — resolution tokens and the per-mode grid

**Token definitions (bare meaning only; the per-mode scoping invariant is owned solely by CR-4, the
acceptance invariant by CR-3, the evidence floor for every gate/required terminal by CR-6):**

- `PASS` — the pass condition is verified true with named evidence.
- `FAIL:<finding/action-id>` — verified false; cite the finding or action.
- `n/a:<property>` — the applicability predicate is false; name the property.
- `CONSIDERED:<decision/rationale>` — a recorded advisory judgment.
- `recorded-open:<owner+resolution-method>` — a still-open item with a named owner and how it resolves.
- `deferred:<pointer+owner>` — moved out of this run, with a pointer and an owner.
- `waived/exception-authorized:<authority+rationale>` — a gate bypassed by a named authority, with
  rationale.

The unchecked marker is an unresolved (non-terminal) state, not another token.

**Per-mode grid (a thin reference; permitted-token scoping is NOT re-encoded here — see CR-4):**

| Mode | Permitted tokens | Coverage-closure | Acceptance-pass |
|---|---|---|---|
| Eval coverage register | per CR-2 + CR-4 | every applicable row terminal | per CR-3 |
| Design | per CR-4 | every gate/required row terminal | per CR-3 |
| Operational | per CR-4 | every gate/required item terminal | per CR-3 |

### Reference data — one-way scenario input

A scenario set, when one exists, is a READ input: preserve its hierarchy, stable IDs, obligations, and
gaps as source traces, and turn each obligation into a `Check`. Do NOT reproduce its category or case
taxonomy inside the checklist. An evaluation register may import the set's family grouping and each
family's owning-category header as traceability scaffold — that scaffold is NOT the scenario skill's
10-category coverage register or its 8 case-type taxonomy, which stay owned there. The scenario set is
never modified, so the dependency stays one-way.

### Reference data — a well-formed checklist (field lists)

- **Checklist level** — purpose + owner + consumer · mode · use-style per pause point plus the per-run
  declaration · scope + applicability · pause points OR category hierarchy · legend = the resolution
  enum plus the two-gate meaning — the coverage-closure-vs-acceptance split (per CR-3) · stable item IDs ·
  source / version distinction · completion rule (per the per-mode grid) · traceability + counts.
- **Item level** — the CR-5 required fields. An advisory item carries a recorded decision, rationale, and
  source, and no proof checkbox.

Concrete contrast (write items the second way):

- **Bad:** `- [ ] Ensure security is robust.`
- **Better:** `- [ ] CHK-RISK-03 [GATE, do-confirm] Verify every new untrusted-input path is validated
  before its first privileged sink; evidence: caller trace plus targeted test; on fail: stop release and
  open a security finding; source: SCN-TRUST-02.`

### P1 — Frame the checklist and declare mode plus use-style

State the purpose, owner, and consumer; declare the mode and the per-run use-style. Apply CR-1.

### P2 — Lay the skeleton before any item

Lay the mode-appropriate skeleton — pause points for operational/design, the imported category + family
hierarchy for an evaluation register — with empty item slots, before writing item prose. Apply CR-1.

### P3 — Build the source-to-check coverage map

Read the scenario set's obligations when one exists, map each to ≥1 item, and sweep both directions for
orphans. Apply CR-5.

### P4 — Select criticality and place the killers

Mark each item gate/killer, required, or advisory, and keep ~5–9 killer/required items per operational
pause point. Apply CR-2, CR-5, CR-7.

### P5 — Assign stable IDs and write the item records

Give every item a stable ID and write its record to the CR-5 field contract. Apply CR-5.

### P6 — Fix the resolution semantics

Bind the legend to the token enum, the permitted tokens per mode, the acceptance rule, and the
evidence-based tick. Apply CR-2, CR-3, CR-4, CR-6.

### P7 — Pilot on concrete cases

Run the checklist against concrete cases — at least one passing, one boundary/failure/adversarial, one
non-applicable where `n/a` is permitted, and one failed gate. Apply CR-3, CR-4, CR-6, CR-7.

### P8 — Stress for false-pass, false-fail, and gaming

Construct false-pass, false-fail, and cosmetic-compliance probes; on any hit, fix the root item or
category model. Apply CR-3, CR-5, CR-6.

### P9 — Freeze the source and resolve the filled copies

Freeze the source version, resolve each run on a filled copy, record coverage-closure and acceptance
separately, and in evaluation mode load the causal finding, coverage, verdict, and handoff requirements from
`../SKILL.md`. Apply CR-1, CR-3, CR-4, CR-6.

---

## References

One owner per borrowed fact; this skill OWNS the `Check` definition, the resolution-token enum, the
three modes, the five item dimensions, and the two-gate / acceptance state machine, so those have no
external owner.

- [`../scenario/SKILL.md`](../scenario/SKILL.md) validates the scenario set this skill reads as a P3
  input, and the consumer relationship in which a scenario set references this skill's `Check` definition
  and two-gate / acceptance machinery.
- [`../SKILL.md` § Rules](../SKILL.md#rules) validates the seven perspectives and
  fixed order an evaluation-register grouping and its filled copy align to.
- [`../SKILL.md` § Close coverage](../SKILL.md#6-close-coverage-and-challenge-the-results)
  validates the evidence-bearing completed checklist that an evaluation-mode filled copy supplies.
- [`../SKILL.md` § Perspective investigation](../SKILL.md#5-investigate-the-subject-across-perspectives)
  validates the causal finding content a failed checklist row cites.
- [`../../skill-writing/SKILL.md`](../../skill-writing/SKILL.md) validates the shared authoring gates and the
  type-specific section contract that will apply when this legacy skill is substantively revised.
