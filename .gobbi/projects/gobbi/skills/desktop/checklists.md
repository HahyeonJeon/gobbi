# Desktop Application Operational Checklist

Be the unchecked operational gate source with the protected-waiver truth table. Policy lives in
[`SKILL.md`](SKILL.md); cases live in [`scenarios.md`](scenarios.md). This source adds no policy.

| Field | Value |
|---|---|
| **Mode** | operational |
| **Owner** | `SKILL.md`, which owns every clause an item enforces |
| **Consumers** | the run working a filled copy; [`evaluation.md`](evaluation.md) selecting applicable items |
| **Source state** | **unchecked** — every box below is unticked, and it stays that way |
| **Run state** | each run works a **fresh filled copy** naming this source's version and the run's identity |
| **Use-style** | declared per pause point below, per run |
| **Items** | 36, across four pause points |
| **Provenance** | each item's `Source` names its parent clause; each item's `Seeds` names the cases that reserved it |

**The source is never worked and never ticked.** A run copies it, fills the copy, and records the copy's
resolutions there. A pre-ticked source, or a run that mutates the source, corrupts every later run.

**No item in this source is advisory.** Every item derives from a mandatory source — a rule, a prohibition, a
floor, or a scenario obligation — and an obligation-derived item stays gate or required so it remains
acceptance-bearing. An advisory row here would be a mandatory obligation quietly dropped out of acceptance.

## Pause points

| Pause point | Work stops | Use-style | Items | Continue only when |
|---|---|---|---|---|
| `DESK-PAUSE-1` — stack and outcome lock | before rung 0 begins | `read-do` | `01`–`05` | the outcome, boundary, stack-fit result, ownership statement, and gate-authority map are accepted |
| `DESK-PAUSE-2` — design acceptance | before `P5` locks the application contract | `do-confirm` | `06`–`17` | the structural-approval decision is confirmed with no visual rung preceding it, the rung register is complete and substantiated, and all four floors are accepted on **both** their member check and their property check |
| `DESK-PAUSE-3` — implementation completion | before `P9` treats the grown slices as complete | `do-confirm` | `18`–`26` | the privilege boundary, security posture, platform obligations, local data contract, and in-scope paths are accepted |
| `DESK-PAUSE-4` — release-readiness handoff | before `P10` publishes readiness or any external release is requested | `do-confirm` | `27`–`36` | every applicable release gate per claimed operating system is accepted, the design record is complete, and the trace and verifier proofs have both run |

**The reserved ranges were extended, and this is the single place that records it.** The design reserved
thirty-four slots; this source authors **thirty-six**. The extension follows the design's own rule — a range
grows at its own pause point's tail and every later range shifts:

| Pause point | Reserved by the design | Authored here | Why |
|---|---|---|---|
| `DESK-PAUSE-1` | `01`–`05` | `01`–`05` | unchanged |
| `DESK-PAUSE-2` | `06`–`15` | `06`–`17` | the four non-waivable floors each need a **member** check and a **property** check — eight acceptance-bearing items — plus the structural-approval gate, the rung register, the ladder method, and the protected-waiver discipline |
| `DESK-PAUSE-3` | `16`–`24` | `18`–`26` | shifted by two; the item count is unchanged |
| `DESK-PAUSE-4` | `25`–`34` | `27`–`36` | shifted by two; the item count is unchanged |

`DESK-CHECK-06` keeps its pinned position at the head of `DESK-PAUSE-2` regardless of the shift, because the
design pins that one identifier and this source may not move it.

**Item counts per pause point, and the two that exceed the generic guidance.** The generic guidance is
roughly five to nine gate-or-required items per operational pause point. `DESK-PAUSE-1` carries 5 and
`DESK-PAUSE-3` carries 9, both inside it. `DESK-PAUSE-4` carries 10 and `DESK-PAUSE-2` carries 12, both
outside it. The deviation is recorded rather than resolved by trimming, for a structural reason: the pause
points are fixed by the design and may not be split here, and eight of `DESK-PAUSE-2`'s twelve items are the
four non-waivable floors' mandatory member-and-property pairs. Dropping one would remove an
acceptance-bearing item that a floor requires.

## Terminal value set

Five terminals. This source uses the owning skill's enum rather than defining one of its own.

| Terminal | Meaning | Closes coverage? | Counts toward acceptance? |
|---|---|---|---|
| `PASS` | the pass condition is verified true against named, inspected evidence | Yes | **Yes** |
| `FAIL:<finding-id>` | verified false; the finding is cited | Yes | No |
| `n/a:<property>` | the applicability predicate is **inspected false**; the property is named | Yes | Not applicable — the item is out of scope for this run |
| `recorded-open:<owner + resolution method>` | still open, with a named owner and how it resolves | Yes | **No** |
| `waived/exception-authorized:<authority + rationale>` | a gate bypassed by a named authority whose mandate covers that item's consequence and stop action | Yes | Only under the bounded exception below, and never as a `PASS` |

**Two gates, kept apart.** *Coverage closure* means every applicable item reached a terminal. *Acceptance*
means every applicable gate and required item resolved `PASS`. A `FAIL`, a `recorded-open`, or an owner
attached to an unmet item closes coverage and **never** acceptance. That separation is the owning skill's
rule, and this source states no predicate of its own for it.

**`n/a` needs inspected evidence, not a label.** An `n/a:<property>` cites the inspection that found the
applicability predicate false. An applicable item can never be relabelled `n/a` to dodge its gate.

**Waiver scope.** The waiver token exists only in operational mode, only on a gate, and only on an item this
source explicitly designates waiver-eligible. Exactly one item is so designated — **`DESK-CHECK-28`** — and
the designation is stated in that item's own record.

## Gate-resolution truth table

The rung-closing rule `SKILL.md` owns has exactly two conditions on its acceptance side. This table is their
four combinations, replayed without restating the predicate.

| Resolution kind recorded | Resolution substantiated | Rung accepted? | Coverage closed? |
|---|---|---|---|
| yes | yes | **yes** | yes |
| yes | no | **no** | yes — the row exists, so the bookkeeping is closed; acceptance is not |
| no | yes | **no** — a resolution kind is required, and evidence with no recorded resolution is not a resolution | no |
| no | no | **no** | no |

**The disjunct exclusion, and why its search is read rather than counted.** No coverage property — an owner,
a plan, a schedule, a sign-off, or an artifact at a higher rung — may appear as a **disjunct** in that
predicate, in any item that implements it, or in any evaluation replay of it.

A token count cannot implement that search. Run over this file, it returns hits the exclusion itself
requires to exist: the words naming the excluded properties appear in the sentence excluding them, in the
terminal definitions above, and in `DESK-CHECK-07`'s own pass condition. **What is forbidden is a coverage
property occupying a disjunctive position in the acceptance predicate**, and only a reader can tell that
position from a mention. An implementation that counted tokens would fail this source for stating the very
rule it is checking — the shape of a gate that forbids the state its own step requires.

## Protected-waiver acceptance truth table

**Which items are protected, and the test that selects them.** An item is protected when its own **claim or
pass condition bears on the accessibility floor's or the safety floor's property**, whether or not the item
is one of those floors' own checks. That is the parent discipline's item-scope test: non-waivability attaches
to any applicable item whose claim or pass condition bears on the protected property, not only to the items
named after a floor.

Applying that test to this source yields **fourteen** protected items:

| Item | Why the test selects it |
|---|---|
| `DESK-CHECK-09`, `DESK-CHECK-10` | the accessibility floor's own member and property checks |
| `DESK-CHECK-11`, `DESK-CHECK-12` | the safety floor's own member and property checks |
| `DESK-CHECK-13`, `DESK-CHECK-14` | the participant floor's own member and property checks; the floor is non-waivable and fails closed |
| `DESK-CHECK-15`, `DESK-CHECK-16` | the direct-evidence floor's own member and property checks; that floor is the acceptance evidence |
| `DESK-CHECK-17` | its claim is that no waiver was accepted on a protected item — waiving it would be circular |
| `DESK-CHECK-20` | its pass condition bears on the update install ending the process mid-write, a named safety member |
| `DESK-CHECK-23` | its pass condition bears on positional argument handling, a named safety member |
| `DESK-CHECK-24` | its pass condition bears on the interrupted write and the migration downgrade path, two named safety members |
| `DESK-CHECK-30` | its pass condition bears on an update install racing live state, a named safety member |
| `DESK-CHECK-31` | its pass condition bears on release irreversibility, a named safety member |

**Why this set is wider than the eight floor checks.** Five items — `20`, `23`, `24`, `30`, and `31` — are
not floor checks and are protected anyway, because each one's pass condition carries a condition the safety
floor names as a member. Protecting only the items titled after a floor would leave a waiver available on the
migration downgrade path and on the update-install race, which are exactly the consequences the floor exists
to make unwaivable.

**Items whose subject is security rather than safety are not selected by this test.**
`DESK-CHECK-19`, `DESK-CHECK-21`, and `DESK-CHECK-22` bear on trust and harm, which the root treats as a
concern distinct from the safety floor's foreseeable-refusable-recoverable property. They remain gates; they
are simply not waiver-immune by this test.

**The table.** Six rows. Each adversarial row holds every other applicable item at `PASS`, so the row
isolates one attempted resolution. Coverage closure and acceptance are evaluated separately in every row.

| Row | Protected class or control | Attempted resolution | Coverage closed? | Accepted? |
|---|---|---|---|---|
| 1 | the accessibility floor, in any applicable item | waiver token | **No** — invalid token | **No** |
| 2 | the safety floor, in any applicable item | waiver token | **No** — invalid token | **No** |
| 3 | the participant consent and protection floor | waiver token | **No** — invalid token | **No** |
| 4 | the direct representative-user evidence floor | waiver token | **No** — invalid token | **No** |
| 5 | the coverage/acceptance separation control | one applicable item is failed or `recorded-open` | **Yes** | **No** |
| 6 | the bounded-waiver control | every protected item passes; `DESK-CHECK-28`, a **non-protected** gate, carries one valid authorized waiver whose named authority covers that item's consequence and stop action | **Yes** | **Yes**, only under the bounded exception |

**Rows 1–4 reject the token outright, and note what that means.** The token closes *neither* gate. It is not
that the item is covered but unaccepted — an invalid token is not a resolution at all, so the item remains
unresolved and coverage stays open.

**Row 6 is what makes rows 1–4 meaningful.** Without a demonstrated legitimate waiver path the protection is
untested: the token would be uniformly invalid and the rows would prove nothing about protection
specifically. This source designates exactly one non-protected waiver-eligible gate, so **row 6 is reachable
rather than structurally unreachable**, and the designation is recorded in `DESK-CHECK-28`'s own item.

## Items by pause point

**Legend.** `[GATE]` is a killer: its miss causes the named consequence, and its on-fail route is the stop
action. `[REQ]` is required: acceptance-bearing, with a stop action of opening a blocking finding.
`[PROTECTED]` marks an item the test above selects — no waiver token is valid on it. Every item carries one
atomic binary claim, an explicit pass condition, a named evidence method, an on-fail route, its `Source`
clauses, its `Seeds` cases, and the obligation conditions its pass condition must own.

### `DESK-PAUSE-1` — stack and outcome lock · `read-do`

- [ ] **`DESK-CHECK-01`** `[GATE]` · *Applicability:* unconditional — the run's outcome record binds one
  outcome with its actors, entry modes, claimed operating systems, visible and system completion evidence,
  and non-goals.
  *Pass:* all six elements are present and mutually consistent, and the claimed-system set in the outcome
  sentence equals the set the entry modes and non-goals assume.
  *Evidence:* direct read of the design record's outcome section.
  *On fail:* halt before rung 0; return to the framing phase.
  *Consequence:* a run that never bounded its outcome cannot tell completion from partial work.
  *Source:* `DESK-R01`, `DESK-R02`, `DESK-N01` · *Seeds:* `DESK-SCENARIO-01`, `DESK-SCENARIO-02`
  *Obligation conditions owned:* actors · entry modes · claimed operating systems · visible completion ·
  system completion · non-goals · the unchanged-behavior list for a run inside an existing application · the
  installed-version reversibility constraint.

- [ ] **`DESK-CHECK-02`** `[GATE]` · *Applicability:* unconditional — the six-criterion wrong-choice test ran
  with an inspected result recorded per criterion.
  *Pass:* six rows exist, each carrying an inspected result against this outcome's own stated requirements,
  and every positive row carries the user's recorded stack decision.
  *Evidence:* direct read of the six-row result table, plus the gate record for any positive row.
  *On fail:* halt; run the test, or route the positive criterion to the user.
  *Consequence:* committing to a stack whose own documented limits contradict a stated product requirement.
  *Source:* `DESK-R03` · *Seeds:* `DESK-SCENARIO-05`, `DESK-SCENARIO-26`
  *Obligation conditions owned:* an inspected result per criterion rather than a summary verdict · a stated
  size or footprint requirement read as a positive first criterion · a positive result routed as a user
  decision rather than absorbed.

- [ ] **`DESK-CHECK-03`** `[REQ]` · *Applicability:* unconditional — the design-ownership boundary is stated.
  *Pass:* the record states that this skill is the sole design owner and holds the acceptance gate, and names
  any project convention that conflicts with that.
  *Evidence:* direct read of the ownership statement.
  *On fail:* open a blocking finding; the run cannot rely on a second design authority that does not exist.
  *Source:* `DESK-R04` · *Seeds:* `DESK-SCENARIO-01`
  *Obligation conditions owned:* sole design ownership · the acceptance gate's location.

- [ ] **`DESK-CHECK-04`** `[GATE]` · *Applicability:* unconditional — every named user gate has an identified
  holder, and no gate the run has reached is unfired.
  *Pass:* the authority map names a holder for each of the eight gates, and every gate reached so far carries
  an explicit recorded decision from that holder.
  *Evidence:* direct read of the authority map and of each reached gate's record.
  *On fail:* halt at the unfired gate and obtain the decision.
  *Consequence:* work proceeding on an authority nobody granted.
  *Source:* `DESK-R27`, `DESK-N10` · *Seeds:* `DESK-SCENARIO-04`
  *Obligation conditions owned:* an explicit decision per gate · silence, continued work, an adjacent
  decision, and enthusiasm each rejected as approval.

- [ ] **`DESK-CHECK-05`** `[REQ]` · *Applicability:* unconditional — every version-dependent statement names
  the version it depends on, and every load-bearing external claim reaches a named owner document.
  *Pass:* no version-dependent statement stands without its version named in the same statement; no
  load-bearing claim is written as fact with an unnamed owner document; and each unknown carries its marking
  rather than an assertion or a hedge.
  *Evidence:* direct read of the claim-to-owner register against the run's own statements.
  *On fail:* open a blocking finding; mark the unknown.
  *Source:* `DESK-R26` · *Seeds:* `DESK-SCENARIO-23`, `DESK-SCENARIO-25`
  *Obligation conditions owned:* the version named in the same statement · a named owner document per
  load-bearing claim · an unknown marked rather than asserted or hedged.

### `DESK-PAUSE-2` — design acceptance · `do-confirm`

- [ ] **`DESK-CHECK-06`** `[GATE]` · *Applicability:* unconditional — the structural-approval decision is
  recorded, and no visual rung began before it.
  *Pass:* the rung register's structural row records an explicit **approval decision** rather than an
  artifact pointer, and the earliest visual artifact's creation timestamp is later than that decision's.
  *Evidence:* direct read of the register row, plus a timestamp comparison against the earliest visual
  artifact.
  *On fail:* halt; return to the structural rung, and no visual rung proceeds.
  *Consequence:* the person first sees the structure after the visual artifacts exist, inverting what a
  structure-before-visuals ladder is for.
  *Source:* `DESK-R27` — its structural-approval leg · *Seeds:* `DESK-SCENARIO-09`
  *Obligation conditions owned:* an explicit approval-or-reopen decision · the decision recorded rather than
  the artifact · no visual rung preceding it.

- [ ] **`DESK-CHECK-07`** `[GATE]` · *Applicability:* unconditional — all nine rung rows carry a resolution
  kind substantiated against that kind's own conditions.
  *Pass:* nine rows, each with one of the three resolution kinds, and each with inspected evidence satisfying
  **that kind's** conditions — a produced artifact resolving to substantive content answering the rung's own
  question; a citation meeting all five citation conditions including its stated remainder; or an
  inapplicability naming a property with its inspected evidence and its falsifying observation. **No coverage
  property closes a row**, and none occupies a disjunctive position in the predicate as applied.
  *Evidence:* direct read of each row, opening every pointer and reading what it contains rather than
  confirming that it resolves.
  *On fail:* halt; return to the owning rung.
  *Consequence:* a register that looks complete while a rung was never answered.
  *Source:* `DESK-R05`, `DESK-R06`, `DESK-N02` · *Seeds:* `DESK-SCENARIO-07`, `DESK-SCENARIO-48`,
  `DESK-SCENARIO-49`
  *Obligation conditions owned:* one of three kinds per rung · substantiation against that kind's own
  conditions · the citation branch's five conditions including the remainder resolved in its own right · a
  pointer resolving to substantive content rather than merely to a valid path · no coverage property closing
  acceptance.

- [ ] **`DESK-CHECK-08`** `[REQ]` · *Applicability:* unconditional — each rung used its own validation method
  in its own order, and each visual artifact states three independent fidelity positions.
  *Pass:* the generative method precedes the evaluative one at each rung that has both; the structural rung
  carries no visual design; iteration ran as several small rounds rather than one large one; each visual
  artifact records interactivity, visuals, and content-and-navigation separately; and the wireflow default
  applies or the record states why this product's shape differs.
  *Evidence:* direct read of each rung's recorded method and order, and of each visual artifact's axis record.
  *On fail:* open a blocking finding; return to the owning rung.
  *Source:* `DESK-R07`, `DESK-R08`, `DESK-R09`, `DESK-N03` · *Seeds:* `DESK-SCENARIO-54`
  *Obligation conditions owned:* generative before evaluative · the structural rung needing no visual design ·
  several small rounds · three independent axis positions per visual artifact · the wireflow default or a
  recorded reason for differing.

- [ ] **`DESK-CHECK-09`** `[GATE, PROTECTED]` · *Applicability:* unconditional — every required action, state,
  and meaning of the outcome is available through every applicable modality.
  *Pass:* the run's action, state, and meaning inventory is swept against the modality set its surfaces
  actually require, with a direct behavioral result recorded per pairing, per claimed operating system.
  *Evidence:* direct behavioral results per system — not a member-by-member roll-up, and not a captured
  rendering.
  *On fail:* halt; acceptance is blocked and the run returns to the owning rung.
  *Consequence:* a person cannot reach a required action at all.
  *Source:* `DESK-R10` · *Seeds:* `DESK-SCENARIO-37`, `DESK-SCENARIO-38`, `DESK-SCENARIO-39`,
  `DESK-SCENARIO-40`
  *Obligation conditions owned:* availability across every applicable modality · each input alternative
  operable with focus flow and focus visibility preserved · reduced motion honored from the renderer's own
  media query · the third system's assistive-technology gap stated rather than implied away.

- [ ] **`DESK-CHECK-10`** `[GATE, PROTECTED]` · *Applicability:* **unconditional** — this check is never
  conditional and never resolves `n/a`, because the property it claims holds of every desktop outcome.
  *Claim:* every required action, state, and meaning of this outcome is available through every applicable
  modality — the property itself.
  *Pass:* an inventory sweep with direct behavioral results. **Explicitly not satisfied by "members 1–16 all
  passed."**
  *Evidence:* the recorded sweep of the run's own action, state, and meaning inventory.
  *On fail:* halt; block acceptance and return to the owning rung or phase.
  *Consequence:* a modality loss that no member names ships unnoticed.
  *Source:* the accessibility floor's property check · *Seeds:* `DESK-SCENARIO-39`, `DESK-SCENARIO-41`
  *Obligation conditions owned:* the property held over the run's own inventory · a member roll-up explicitly
  rejected as evidence.

- [ ] **`DESK-CHECK-11`** `[GATE, PROTECTED]` · *Applicability:* unconditional — no clause of the run permits
  an action whose consequence the actor cannot foresee, refuse, or recover from, across the named members.
  *Pass:* each named safety member is dispositioned with its inspected evidence, including the
  argument-matching rule, the durable-or-detectably-incomplete write, the migration downgrade path, and the
  fail-closed at-rest store.
  *Evidence:* direct read plus a targeted test per member.
  *On fail:* halt; block acceptance and return to the clause's owning phase.
  *Consequence:* an ordinary action destroys work the person cannot recover.
  *Source:* `DESK-R11` · *Seeds:* `DESK-SCENARIO-16`
  *Obligation conditions owned:* the argument list parsed by matching and never by position · the positional
  read treated as a safety defect rather than a correctness preference.

- [ ] **`DESK-CHECK-12`** `[GATE, PROTECTED]` · *Applicability:* **unconditional** — never conditional and
  never `n/a`, because the property holds of every desktop outcome.
  *Claim:* no clause of this run permits an action whose consequence the actor cannot foresee, refuse, or
  recover from — the property itself.
  *Pass:* a sweep of the run's **own clause inventory** — every rule, phase step, channel, native
  integration, data operation, and release control it actually contains — each dispositioned foreseeable,
  refusable, recoverable, or handled. **Explicitly not satisfied by "members 1–9 all passed."**
  *Evidence:* the recorded clause-inventory sweep.
  *On fail:* halt; block acceptance and return to the clause's owning phase.
  *Consequence:* an unlisted clause reaches an unrecoverable consequence while every listed member passes.
  *Source:* the safety floor's property check · *Seeds:* `DESK-SCENARIO-35`
  *Obligation conditions owned:* the property held over the run's own clause inventory · a member roll-up
  explicitly rejected as evidence.

- [ ] **`DESK-CHECK-13`** `[GATE, PROTECTED]` · *Applicability:* unconditional — every participant activity
  was governed before it ran, and the fail-closed trigger set is honored.
  *Pass:* informed consent, needed accommodations, minimization, and a protection and retention record exist
  **before** each activity; observation is recorded separately from interpretation; and any one of missing
  representative access, missing consent, missing accommodations, or missing required evidence produced a
  missing-context stop rather than a continuation.
  *Evidence:* direct read of each activity record against that activity's own timestamps.
  *On fail:* **stop and report missing context**; no design is accepted.
  *Consequence:* a person participated without consent, or a design was accepted on whoever was available.
  *Source:* `DESK-R12` · *Seeds:* `DESK-SCENARIO-06`, `DESK-SCENARIO-10`
  *Obligation conditions owned:* consent preceding the activity it covers · accommodations · minimization ·
  protection and retention · observation separate from interpretation · the four fail-closed triggers in full.

- [ ] **`DESK-CHECK-14`** `[GATE, PROTECTED]` · *Applicability:* **unconditional** — never conditional and
  never `n/a`.
  *Claim:* every activity of this run involving a person, and every observation from a person used as
  evidence, was governed by the floor at the time it ran — the property itself.
  *Pass:* a sweep of the run's **own activity inventory** — every round, interview, observation, card sort,
  tree test, informal walkthrough, recruitment screening, and post-release contact whose output is cited as
  evidence anywhere — each carrying its consent, accommodation, minimization, protection, and
  representativeness record. **Explicitly not satisfied by "members 1–7 all passed," and not satisfied by
  governing only the activities the ladder happens to name.**
  *Evidence:* the recorded activity-inventory sweep.
  *On fail:* **stop and report missing context**; no design is accepted.
  *Consequence:* an ungoverned activity's observations are cited as evidence.
  *Source:* the participant floor's property check · *Seeds:* `DESK-SCENARIO-11`
  *Obligation conditions owned:* the governed set is the activity inventory rather than the ladder's named
  rounds · a named-round roll-up explicitly rejected as evidence.

- [ ] **`DESK-CHECK-15`** `[GATE, PROTECTED]` · *Applicability:* unconditional — acceptance rests on direct
  representative-user evidence from this run's own artifacts, per claimed operating system.
  *Pass:* every human-outcome claim resolves to a participant record from this run's own artifacts on the
  system the claim is about, covering every applicable observation dimension, with prior research, expert
  review, analytics, standards conformance, stakeholder approval, captured renderings, and static
  high-fidelity artifacts all recorded as context only.
  *Evidence:* direct read of the evidence table, per claimed system.
  *On fail:* halt; acceptance is unavailable and the run returns to the owning rung.
  *Consequence:* a design accepted on evidence that proves something else.
  *Source:* `DESK-R13`, `DESK-N04` · *Seeds:* `DESK-SCENARIO-08`
  *Obligation conditions owned:* this run's own artifacts · per claimed operating system · the full
  observation-dimension set · every other signal context only.

- [ ] **`DESK-CHECK-16`** `[GATE, PROTECTED]` · *Applicability:* **unconditional** — never conditional and
  never `n/a`.
  *Claim:* every human-outcome claim this run makes is supported by direct representative-user evidence from
  this run's own artifacts, on the operating system the claim is about — the property itself.
  *Pass:* a sweep of the run's **own claim inventory** — every claim about what a person can perceive,
  understand, operate, complete, or recover from — each mapped to the participant record and the operating
  system that supports it, with any unsupported claim removed or restated as context. **Explicitly not
  satisfied by "members 1–7 all passed."**
  *Evidence:* the recorded claim-inventory sweep.
  *On fail:* halt; block acceptance, and rerun the owning rung or report missing context.
  *Consequence:* a claim about people that no participant record supports ships as a finding of the run.
  *Source:* the direct-evidence floor's property check · *Seeds:* `DESK-SCENARIO-55`
  *Obligation conditions owned:* the property held over the run's own claim inventory · the supporting system
  named per claim · unsupported claims removed or restated as context · a member roll-up explicitly rejected.

- [ ] **`DESK-CHECK-17`** `[GATE, PROTECTED]` · *Applicability:* unconditional — no waiver token was accepted
  on any protected item, and no coverage property was counted as acceptance.
  *Pass:* every waiver-token use in the filled copy sits on `DESK-CHECK-28` and nowhere else; every
  `recorded-open` is counted as coverage-closed and not accepted; and the six-row table above is reproduced
  by the filled copy's own resolutions.
  *Evidence:* direct read of every non-`PASS` resolution in the filled copy against the protected-item list.
  *On fail:* halt; the resolution is invalid and the item returns to unresolved.
  *Consequence:* a non-waivable floor closed by a token — the exact escape hatch the floors exist to prevent.
  *Source:* `DESK-N05` · *Seeds:* `DESK-SCENARIO-51`
  *Obligation conditions owned:* the token invalid on all four floors · closing neither coverage nor
  acceptance there.

### `DESK-PAUSE-3` — implementation completion · `do-confirm`

- [ ] **`DESK-CHECK-18`** `[GATE]` · *Applicability:* unconditional — the privilege boundary and the three
  compilation targets are as specified.
  *Pass:* each unit states its execution context; the three targets exist with their own library, type, and
  module settings over one type-only shared layer; the renderer target excludes the runtime's ambient types;
  the bridge contract carries only structured-cloneable values and plain asynchronous functions; and every
  statement of the three-target split carries its derived marking.
  *Evidence:* direct read of the three target configurations plus the bridge contract type.
  *On fail:* halt; return to the contract phase rather than patching a body.
  *Consequence:* a green type-check certifying code the sandbox rejects at run time.
  *Source:* `DESK-R14`, `DESK-R16`, `DESK-R17`, `DESK-N07` · *Seeds:* `DESK-SCENARIO-18`,
  `DESK-SCENARIO-19`, `DESK-SCENARIO-21`, `DESK-SCENARIO-22`
  *Obligation conditions owned:* each unit's execution context · the renderer target excluding the runtime's
  ambient types · one source-of-truth contract type · structured-cloneable values and plain asynchronous
  functions only · no classes, constructors, or symbol-keyed members · the derived marking travelling with
  the split.

- [ ] **`DESK-CHECK-19`** `[GATE]` · *Applicability:* unconditional — every privileged crossing validates both
  its payload and its caller.
  *Pass:* every registered privileged handler runtime-validates its payload into a domain type and verifies
  the sending frame **in the handler** before any privileged effect, and the handler set enumerated from
  source equals the channel inventory.
  *Evidence:* caller trace plus a targeted test that sends from an unintended frame and observes the
  privileged sink for any effect.
  *On fail:* halt; open a security finding.
  *Consequence:* an unexpected frame reaches a privileged effect.
  *Source:* `DESK-R15`, `DESK-N06` · *Seeds:* `DESK-SCENARIO-18`, `DESK-SCENARIO-21`, `DESK-SCENARIO-32`
  *Obligation conditions owned:* payload validated into a domain type · sending frame verified · the check in
  the handler rather than in a bypassable wrapper · context isolation not relied on to prevent the send · the
  inventory equal to the enumerated handler set.

- [ ] **`DESK-CHECK-20`** `[GATE, PROTECTED]` · *Applicability:* unconditional — every cross-process resource
  names the lifecycle event that releases it.
  *Pass:* each privileged resource held on behalf of a renderer names a window or contents lifecycle event as
  its release point, with the last-resort terminal named and none keyed to scope exit; and the
  pre-quit-for-update hook is handled so an install does not end the process mid-write.
  *Evidence:* direct read plus a test under collection pressure confirming delivery survives.
  *On fail:* halt; return to the contract phase.
  *Consequence:* a channel that works under test and silently stops in the field, or work lost to an update.
  *Source:* `DESK-R18` · *Seeds:* `DESK-SCENARIO-20`, `DESK-SCENARIO-30`
  *Obligation conditions owned:* disposal keyed to a named lifecycle event rather than to scope exit · the
  last-resort terminal named · the pre-quit-for-update hook handled.

- [ ] **`DESK-CHECK-21`** `[GATE]` · *Applicability:* unconditional — both kinds of security work are
  complete.
  *Pass:* a twenty-row inventory where each of the eight defaults is confirmed unchanged, or carries a
  recorded reason, and each of the twelve applicable positive controls is confirmed **written**, naming the
  file and line; and no secret is present in the shipped artifact.
  *Evidence:* direct read of the inventory plus an unpack-and-search of the shipped artifact.
  *On fail:* halt; open a security finding.
  *Consequence:* an application that passes every default check while having written none of the controls.
  *Source:* `DESK-R19`, `DESK-N08` · *Seeds:* `DESK-SCENARIO-31`, `DESK-SCENARIO-34`
  *Obligation conditions owned:* the eight defaults intact · the twelve positive controls written rather than
  assumed · packaging, minification, and the archive rejected as security boundaries · no secret in the
  shipped artifact.

- [ ] **`DESK-CHECK-22`** `[GATE]` · *Applicability:* unconditional — build-time hardening is set, and the
  build-matrix decision is recorded with both horns.
  *Pass:* the built artifact's fuse configuration is read and recorded; the two archive fuses are both set,
  or neither is with a recorded reason; and the hardening-versus-testability decision names both horns, the
  user's choice, and the resulting stated verification limit.
  *Evidence:* direct read of the built artifact's fuse configuration, plus the recorded decision.
  *On fail:* halt; open a finding, and route the undecided matrix to the user.
  *Consequence:* unvalidated code loadable, or an automated suite silently exercising a different artifact
  than the one shipping.
  *Source:* `DESK-R20`, `DESK-R27` — its build-matrix leg, `DESK-N10` · *Seeds:* `DESK-SCENARIO-33`,
  `DESK-SCENARIO-36`
  *Obligation conditions owned:* the two archive fuses set as a pair · both horns named with their
  consequences · the user deciding · the chosen horn's consequence carried as a stated verification limit.

- [ ] **`DESK-CHECK-23`** `[GATE, PROTECTED]` · *Applicability:* unconditional — every per-operating-system
  behavior obligation the outcome touches is satisfied by its named mechanism.
  *Pass:* first paint uses the hidden-window-plus-ready-event mechanism **and** a background color; window
  state restoration validates saved bounds against the currently attached displays with a visible fallback;
  quit and activation semantics match each claimed system; the second-instance argument list is parsed by
  matching and never by position; the deep-link route is per system; theming is a three-state machine; one
  shortcut map exists per platform excluding system-reserved combinations; and no unverified platform
  convention is asserted.
  *Evidence:* direct behavioral test per claimed system, including a launch recording and a detached-display
  relaunch.
  *On fail:* halt; open a finding against the owning obligation.
  *Consequence:* a second launch acting on a target the person did not choose, or a window restored where
  nothing can reach it.
  *Source:* `DESK-R21`, `DESK-R22`, `DESK-N09` · *Seeds:* `DESK-SCENARIO-12`, `DESK-SCENARIO-14`,
  `DESK-SCENARIO-16`
  *Obligation conditions owned:* both first-paint mechanisms rather than either · restored bounds validated
  against attached displays with a visible fallback · the argument list parsed by matching · no unverified
  platform convention asserted.

- [ ] **`DESK-CHECK-24`** `[GATE, PROTECTED]` · *Applicability:* unconditional — the local data contract holds
  in both directions.
  *Pass:* every local write is durable or detectably incomplete, replacing the target atomically and carrying
  a marker a reader can reject; every persisted structure carries an explicit version; and the downgrade path
  preserves, refuses, or copies, never silently rewriting newer data into an older shape.
  *Evidence:* an interruption test at several offsets including one leaving valid syntax, plus the
  install-newer / create / install-older / reinstall-newer round trip across the stated support window.
  *On fail:* halt; open a data-integrity finding.
  *Consequence:* a person who reinstalls a previous version loses their work.
  *Source:* `DESK-R11` — its data members · *Seeds:* `DESK-SCENARIO-13`, `DESK-SCENARIO-15`,
  `DESK-SCENARIO-17`, `DESK-SCENARIO-28`
  *Obligation conditions owned:* durable or detectably incomplete · atomic replacement · a truncation marker
  distinguishable from valid syntax · an explicit structure version · the downgrade path proved by round trip
  rather than only forward.

- [ ] **`DESK-CHECK-25`** `[REQ]` · *Applicability:* unconditional — every entry mode and every designed
  in-scope path is implemented or explicitly removed from scope.
  *Pass:* the entry-mode inventory is complete; each mode reaches the outcome or is proved out of scope; and
  no designed path lacks an implementation without a recorded scope removal.
  *Evidence:* diff the designed path set against the implemented path set.
  *On fail:* open a blocking finding; the outcome is not finished.
  *Source:* `DESK-R01`, `DESK-N01` · *Seeds:* `DESK-SCENARIO-02`, `DESK-SCENARIO-03`
  *Obligation conditions owned:* the entry modes enumerated · cold-start and warm-start paths distinguished ·
  no designed path unimplemented without a recorded removal.

- [ ] **`DESK-CHECK-26`** `[REQ]` · *Applicability:* conditional — applies when the run records any
  performance or footprint measurement. An `n/a:<property>` requires the inspected finding that it records
  none.
  *Pass:* every recorded measurement names the platform version it was taken on; no comparison attributes a
  difference to the run's own work across differing versions; and file and parsing work is kept off the
  privileged process's own thread.
  *Evidence:* direct read of each measurement record, plus a multi-window responsiveness observation during a
  privileged read.
  *On fail:* open a blocking finding.
  *Source:* `DESK-R26` — its measurement leg · *Seeds:* `DESK-SCENARIO-23`, `DESK-SCENARIO-24`,
  `DESK-SCENARIO-25`
  *Obligation conditions owned:* the version named in the same statement · no cross-version attribution ·
  blocking work kept off the privileged process's thread.

### `DESK-PAUSE-4` — release-readiness handoff · `do-confirm`

- [ ] **`DESK-CHECK-27`** `[GATE]` · *Applicability:* unconditional — one installer target exists per claimed
  operating system, and the update path is stated per system.
  *Pass:* the release matrix carries a row per claimed system with its produced installer, and its update row
  names that system's own mechanism rather than a uniform claim across all of them.
  *Evidence:* direct inspection of the produced artifacts plus the release matrix.
  *On fail:* halt the release; either remove the system from the claim set or produce its installer.
  *Consequence:* claiming a system the run cannot deliver.
  *Source:* `DESK-R23` — its packaging gate · *Seeds:* `DESK-SCENARIO-42`, `DESK-SCENARIO-46`
  *Obligation conditions owned:* an installer per claimed system · the update path stated per system · no
  built-in automatic updating claimed for the system that has none.

- [ ] **`DESK-CHECK-28`** `[GATE]` · *Applicability:* unconditional — the packaged artifact installs and
  smoke-tests in a clean environment, per claimed operating system.
  *Pass:* each claimed system has a recorded install and smoke test on a machine that has not previously
  hosted this application or its dependencies.
  *Evidence:* the recorded clean-environment install result per system, naming the environment.
  *On fail:* halt the release for that system.
  *Consequence:* an artifact that installs only where the build machine's dependencies already exist.
  *Source:* `DESK-R23` — its install gate · *Seeds:* `DESK-SCENARIO-42`
  *Obligation conditions owned:* a clean environment rather than a development machine · one result per
  claimed system.
  > **This is the single waiver-eligible gate in this source, and it is not protected.** Its claim bears on
  > release readiness rather than on the accessibility or safety floor's property. A waiver here is valid
  > only when the named release authority's mandate covers **this item's** consequence — that first-install
  > behavior on the named system is unproven for this release — and its stop action, and when the
  > authorization evidence and the rationale are both recorded. The waiver substitutes for `PASS` on this
  > item alone, is never counted as a `PASS`, and carries forward as a stated verification limit rather than
  > disappearing into a green summary.

- [ ] **`DESK-CHECK-29`** `[GATE]` · *Applicability:* conditional — applies per claimed system that has a
  signing story. An `n/a:<property>` requires the inspected finding that the system has none.
  *Pass:* signature and, where the system requires it, notarization are verified **on the real packaged
  artifact**; and any behavior whose precondition is a signature was proved on that signed artifact rather
  than on a development build.
  *Evidence:* signature and notarization verification run against the shipped artifact, plus the artifact
  identity behind each signature-dependent claim.
  *On fail:* halt the release for that system.
  *Consequence:* shipping an artifact the operating system treats as unsigned.
  *Source:* `DESK-R23` — its signing gate · *Seeds:* `DESK-SCENARIO-42`, `DESK-SCENARIO-45`
  *Obligation conditions owned:* verification on the real artifact · both mandatory steps where the system
  requires two · signature-dependent evidence taken from the signed artifact.

- [ ] **`DESK-CHECK-30`** `[GATE, PROTECTED]` · *Applicability:* conditional — applies per claimed system with
  an update path. An `n/a:<property>` requires the inspected finding that the system has none and that
  updates go through its package manager.
  *Pass:* an update was rehearsed **from the previously released version** rather than from a fresh install;
  live work survives the install through the pre-quit hook; and a failure partway leaves the installed
  version working with the failure surfaced rather than retried silently.
  *Evidence:* the rehearsal record naming its starting version, plus an interrupted-update test at the
  download and install stages separately.
  *On fail:* halt the release.
  *Consequence:* an update that destroys work the person had open, or leaves a partially replaced
  application.
  *Source:* `DESK-R23` — its update gate, `DESK-R24` · *Seeds:* `DESK-SCENARIO-27`, `DESK-SCENARIO-29`,
  `DESK-SCENARIO-30`, `DESK-SCENARIO-42`, `DESK-SCENARIO-45`, `DESK-SCENARIO-46`, `DESK-SCENARIO-47`
  *Obligation conditions owned:* the rehearsal starting from the previously released version · work flushed
  at the pre-quit hook · a failed update leaving the installed version working · the failure surfaced rather
  than retried silently · unsaved work treated as a stop.

- [ ] **`DESK-CHECK-31`** `[GATE, PROTECTED]` · *Applicability:* unconditional — the release is treated as
  irreversible, and the supported-old-version window is stated.
  *Pass:* the record states how far back a version receives a forward fix, what happens to a version outside
  the window, and that rollback means a forward fix; and both the oldest supported version and one below it
  were exercised against the stated behavior.
  *Evidence:* direct read of the stated window plus the edge-and-beyond test result.
  *On fail:* halt the release.
  *Consequence:* a person on an old version left with an unhandled failure and no route forward.
  *Source:* `DESK-R24` · *Seeds:* `DESK-SCENARIO-17`, `DESK-SCENARIO-44`
  *Obligation conditions owned:* a stated window · a defined out-of-window behavior · rollback as a forward
  fix · the edge and the case beyond it both proved.

- [ ] **`DESK-CHECK-32`** `[GATE]` · *Applicability:* unconditional — every evidence class is reported as its
  own claim.
  *Pass:* the claim ledger carries nine separate rows — design acceptance, implementation correctness,
  packaged-artifact evidence, signature and notarization evidence, update-rehearsal evidence, per-system
  evidence, release readiness, release authority, and post-release outcome — each with its evidence class,
  owner, and per-system scope; and each unrunnable gate is recorded as a limitation blocking its claim.
  *Evidence:* direct read of the claim ledger.
  *On fail:* halt the release handoff.
  *Consequence:* a green summary concealing which of nine distinct claims was never proved.
  *Source:* `DESK-R25` · *Seeds:* `DESK-SCENARIO-52`
  *Obligation conditions owned:* nine distinct claims · per-claim scope · an unrunnable gate recorded as a
  limitation blocking its claim rather than widened into a weaker signal.

- [ ] **`DESK-CHECK-33`** `[REQ]` · *Applicability:* unconditional — the design record carries resolved
  content in every required element.
  *Pass:* the rung register, the three-axis statements, the four floor resolutions with their property
  checks, the participant consent and accommodation records, the locked application contract, the claim-owner
  verification matrix, and the run's own unknown and gap register are each present **with content**.
  *Evidence:* direct read of each required element for resolved content rather than for its heading.
  *On fail:* open a blocking finding.
  *Source:* `DESK-R29` · *Seeds:* `DESK-SCENARIO-50`
  *Obligation conditions owned:* each required element present with resolved content · a heading alone
  rejected as satisfaction.

- [ ] **`DESK-CHECK-34`** `[GATE]` · *Applicability:* unconditional — the trace and the verifier are both
  proved.
  *Pass:* the relation test exits zero across all four projections; the verifier is proved at **both** ends,
  rejecting each planted fixture and accepting the real bundle; and the obligation test's result is recorded
  **per case**, with the reviewer's identity, across every mapped check for a case with more than one.
  *Evidence:* the recorded exit statuses and messages for the script-proved legs, and the reviewer's recorded
  per-case results for the review-proved leg.
  *On fail:* halt the handoff; the trace is unproved.
  *Consequence:* a correctly-routed check whose wording dropped a named primitive ships unnoticed behind a
  green relation test.
  *Source:* `DESK-R28` · *Seeds:* `DESK-SCENARIO-53`
  *Obligation conditions owned:* the relation test over four projections · the two-ended verifier proof · the
  obligation test recorded per case with the reviewer's identity · a green relation test rejected as a
  complete trace proof.

- [ ] **`DESK-CHECK-35`** `[REQ]` · *Applicability:* conditional — applies when the run names any
  planned-but-absent capability. An `n/a:<property>` requires the inspected finding that it names none.
  *Pass:* every forward mention is prose only, carrying no path, no link, and no path-shaped code span, and
  states that nothing here loads or requires it.
  *Evidence:* a scan of every forward mention for a path, a link, or a path-shaped span.
  *On fail:* open a blocking finding.
  *Source:* `DESK-R31`, `DESK-N12` · *Seeds:* `DESK-SCENARIO-43`
  *Obligation conditions owned:* prose only · no path, link, or load target · a statement that nothing loads
  or requires it.

- [ ] **`DESK-CHECK-36`** `[GATE]` · *Applicability:* unconditional — release authority is explicitly granted
  against a stated readiness position.
  *Pass:* the release-authority decision is recorded by its named holder, against a presented readiness
  statement naming what is proved, what is a stated limit, the supported-old-version window, and the stop
  conditions.
  *Evidence:* direct read of the recorded decision and of the readiness statement it was made against.
  *On fail:* halt; no external release action is taken.
  *Consequence:* an irreversible action taken without the authority for it.
  *Source:* `DESK-R27` — its release-authority leg · *Seeds:* `DESK-SCENARIO-04`
  *Obligation conditions owned:* an explicit decision from the named holder · the readiness position it was
  made against · silence and continued work rejected as approval.

## Guaranteed coverage map

Every check and the cases that seeded it. This is the second exact projection of the authoritative relation
in [`scenarios.md`](scenarios.md), verifiable independently of each item's own `Seeds` field above.

| Check | Seeding cases | Pause point |
|---|---|---|
| `DESK-CHECK-01` | `DESK-SCENARIO-01`, `DESK-SCENARIO-02` | `DESK-PAUSE-1` |
| `DESK-CHECK-02` | `DESK-SCENARIO-05`, `DESK-SCENARIO-26` | `DESK-PAUSE-1` |
| `DESK-CHECK-03` | `DESK-SCENARIO-01` | `DESK-PAUSE-1` |
| `DESK-CHECK-04` | `DESK-SCENARIO-04` | `DESK-PAUSE-1` |
| `DESK-CHECK-05` | `DESK-SCENARIO-23`, `DESK-SCENARIO-25` | `DESK-PAUSE-1` |
| `DESK-CHECK-06` | `DESK-SCENARIO-09` | `DESK-PAUSE-2` |
| `DESK-CHECK-07` | `DESK-SCENARIO-07`, `DESK-SCENARIO-48`, `DESK-SCENARIO-49` | `DESK-PAUSE-2` |
| `DESK-CHECK-08` | `DESK-SCENARIO-54` | `DESK-PAUSE-2` |
| `DESK-CHECK-09` | `DESK-SCENARIO-37`, `DESK-SCENARIO-38`, `DESK-SCENARIO-39`, `DESK-SCENARIO-40` | `DESK-PAUSE-2` |
| `DESK-CHECK-10` | `DESK-SCENARIO-39`, `DESK-SCENARIO-41` | `DESK-PAUSE-2` |
| `DESK-CHECK-11` | `DESK-SCENARIO-16` | `DESK-PAUSE-2` |
| `DESK-CHECK-12` | `DESK-SCENARIO-35` | `DESK-PAUSE-2` |
| `DESK-CHECK-13` | `DESK-SCENARIO-06`, `DESK-SCENARIO-10` | `DESK-PAUSE-2` |
| `DESK-CHECK-14` | `DESK-SCENARIO-11` | `DESK-PAUSE-2` |
| `DESK-CHECK-15` | `DESK-SCENARIO-08` | `DESK-PAUSE-2` |
| `DESK-CHECK-16` | `DESK-SCENARIO-55` | `DESK-PAUSE-2` |
| `DESK-CHECK-17` | `DESK-SCENARIO-51` | `DESK-PAUSE-2` |
| `DESK-CHECK-18` | `DESK-SCENARIO-18`, `DESK-SCENARIO-19`, `DESK-SCENARIO-21`, `DESK-SCENARIO-22` | `DESK-PAUSE-3` |
| `DESK-CHECK-19` | `DESK-SCENARIO-18`, `DESK-SCENARIO-21`, `DESK-SCENARIO-32` | `DESK-PAUSE-3` |
| `DESK-CHECK-20` | `DESK-SCENARIO-20`, `DESK-SCENARIO-30` | `DESK-PAUSE-3` |
| `DESK-CHECK-21` | `DESK-SCENARIO-31`, `DESK-SCENARIO-34` | `DESK-PAUSE-3` |
| `DESK-CHECK-22` | `DESK-SCENARIO-33`, `DESK-SCENARIO-36` | `DESK-PAUSE-3` |
| `DESK-CHECK-23` | `DESK-SCENARIO-12`, `DESK-SCENARIO-14`, `DESK-SCENARIO-16` | `DESK-PAUSE-3` |
| `DESK-CHECK-24` | `DESK-SCENARIO-13`, `DESK-SCENARIO-15`, `DESK-SCENARIO-17`, `DESK-SCENARIO-28` | `DESK-PAUSE-3` |
| `DESK-CHECK-25` | `DESK-SCENARIO-02`, `DESK-SCENARIO-03` | `DESK-PAUSE-3` |
| `DESK-CHECK-26` | `DESK-SCENARIO-23`, `DESK-SCENARIO-24`, `DESK-SCENARIO-25` | `DESK-PAUSE-3` |
| `DESK-CHECK-27` | `DESK-SCENARIO-42`, `DESK-SCENARIO-46` | `DESK-PAUSE-4` |
| `DESK-CHECK-28` | `DESK-SCENARIO-42` | `DESK-PAUSE-4` |
| `DESK-CHECK-29` | `DESK-SCENARIO-42`, `DESK-SCENARIO-45` | `DESK-PAUSE-4` |
| `DESK-CHECK-30` | `DESK-SCENARIO-27`, `DESK-SCENARIO-29`, `DESK-SCENARIO-30`, `DESK-SCENARIO-42`, `DESK-SCENARIO-45`, `DESK-SCENARIO-46`, `DESK-SCENARIO-47` | `DESK-PAUSE-4` |
| `DESK-CHECK-31` | `DESK-SCENARIO-17`, `DESK-SCENARIO-44` | `DESK-PAUSE-4` |
| `DESK-CHECK-32` | `DESK-SCENARIO-52` | `DESK-PAUSE-4` |
| `DESK-CHECK-33` | `DESK-SCENARIO-50` | `DESK-PAUSE-4` |
| `DESK-CHECK-34` | `DESK-SCENARIO-53` | `DESK-PAUSE-4` |
| `DESK-CHECK-35` | `DESK-SCENARIO-43` | `DESK-PAUSE-4` |
| `DESK-CHECK-36` | `DESK-SCENARIO-04` | `DESK-PAUSE-4` |

## Check-to-obligation union audit

The **reverse** sweep, and the fourth projection of the authoritative relation. The three tables above run
forward — case to check. This one runs back: for each check, which case obligations it consumes, and whether
its **actual pass wording** preserves every named condition in them.

**This is the table that catches a check whose routing is correct and whose wording is not.** The relation
test proves the four projections agree on their edges; it says nothing about whether a check's `Pass:` and
`Evidence:` wording still owns each named primitive the obligation asserts. A condition-level check that
confirms the topic survived is not sufficient — a named primitive can be dropped inside a surviving
condition.

**The result column ships empty, and that is deliberate.** This source is unchecked. The audit is a
**review-proved** gate rather than a script: no fixed-string comparison can distinguish an asserted
primitive from a negated one, or a dropped primitive from one carried in an unrelated clause. A named
reviewer reads each selected case's `Obligation` and **every** mapped check's actual `Pass:` and `Evidence:`
wording, and records the result **per case** with their own identity. A per-file result, or an unrecorded
case, is an unrun test.

Matching identifiers, equal counts, and this table's own summary prose close nothing. The `Conditions` column
is a count for the reviewer's convenience and is **not** evidence — the conditions themselves are enumerated
in each item's `Obligation conditions owned` field above, and the reviewer reads those against the wording.

| Check | Obligations it consumes | Conditions | Reviewer | Result |
|---|---|---|---|---|
| `DESK-CHECK-01` | `DESK-SCENARIO-01`, `DESK-SCENARIO-02` | 8 | | |
| `DESK-CHECK-02` | `DESK-SCENARIO-05`, `DESK-SCENARIO-26` | 3 | | |
| `DESK-CHECK-03` | `DESK-SCENARIO-01` | 2 | | |
| `DESK-CHECK-04` | `DESK-SCENARIO-04` | 2 | | |
| `DESK-CHECK-05` | `DESK-SCENARIO-23`, `DESK-SCENARIO-25` | 4 | | |
| `DESK-CHECK-06` | `DESK-SCENARIO-09` | 3 | | |
| `DESK-CHECK-07` | `DESK-SCENARIO-07`, `DESK-SCENARIO-48`, `DESK-SCENARIO-49` | 5 | | |
| `DESK-CHECK-08` | `DESK-SCENARIO-54` | 5 | | |
| `DESK-CHECK-09` | `DESK-SCENARIO-37`, `DESK-SCENARIO-38`, `DESK-SCENARIO-39`, `DESK-SCENARIO-40` | 4 | | |
| `DESK-CHECK-10` | `DESK-SCENARIO-39`, `DESK-SCENARIO-41` | 2 | | |
| `DESK-CHECK-11` | `DESK-SCENARIO-16` | 2 | | |
| `DESK-CHECK-12` | `DESK-SCENARIO-35` | 2 | | |
| `DESK-CHECK-13` | `DESK-SCENARIO-06`, `DESK-SCENARIO-10` | 6 | | |
| `DESK-CHECK-14` | `DESK-SCENARIO-11` | 2 | | |
| `DESK-CHECK-15` | `DESK-SCENARIO-08` | 4 | | |
| `DESK-CHECK-16` | `DESK-SCENARIO-55` | 4 | | |
| `DESK-CHECK-17` | `DESK-SCENARIO-51` | 3 | | |
| `DESK-CHECK-18` | `DESK-SCENARIO-18`, `DESK-SCENARIO-19`, `DESK-SCENARIO-21`, `DESK-SCENARIO-22` | 6 | | |
| `DESK-CHECK-19` | `DESK-SCENARIO-18`, `DESK-SCENARIO-21`, `DESK-SCENARIO-32` | 5 | | |
| `DESK-CHECK-20` | `DESK-SCENARIO-20`, `DESK-SCENARIO-30` | 3 | | |
| `DESK-CHECK-21` | `DESK-SCENARIO-31`, `DESK-SCENARIO-34` | 4 | | |
| `DESK-CHECK-22` | `DESK-SCENARIO-33`, `DESK-SCENARIO-36` | 4 | | |
| `DESK-CHECK-23` | `DESK-SCENARIO-12`, `DESK-SCENARIO-14`, `DESK-SCENARIO-16` | 4 | | |
| `DESK-CHECK-24` | `DESK-SCENARIO-13`, `DESK-SCENARIO-15`, `DESK-SCENARIO-17`, `DESK-SCENARIO-28` | 5 | | |
| `DESK-CHECK-25` | `DESK-SCENARIO-02`, `DESK-SCENARIO-03` | 3 | | |
| `DESK-CHECK-26` | `DESK-SCENARIO-23`, `DESK-SCENARIO-24`, `DESK-SCENARIO-25` | 4 | | |
| `DESK-CHECK-27` | `DESK-SCENARIO-42`, `DESK-SCENARIO-46` | 3 | | |
| `DESK-CHECK-28` | `DESK-SCENARIO-42` | 2 | | |
| `DESK-CHECK-29` | `DESK-SCENARIO-42`, `DESK-SCENARIO-45` | 3 | | |
| `DESK-CHECK-30` | `DESK-SCENARIO-27`, `DESK-SCENARIO-29`, `DESK-SCENARIO-30`, `DESK-SCENARIO-42`, `DESK-SCENARIO-45`, `DESK-SCENARIO-46`, `DESK-SCENARIO-47` | 5 | | |
| `DESK-CHECK-31` | `DESK-SCENARIO-17`, `DESK-SCENARIO-44` | 4 | | |
| `DESK-CHECK-32` | `DESK-SCENARIO-52` | 3 | | |
| `DESK-CHECK-33` | `DESK-SCENARIO-50` | 2 | | |
| `DESK-CHECK-34` | `DESK-SCENARIO-53` | 4 | | |
| `DESK-CHECK-35` | `DESK-SCENARIO-43` | 3 | | |
| `DESK-CHECK-36` | `DESK-SCENARIO-04` | 3 | | |
