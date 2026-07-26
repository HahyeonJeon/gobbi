# Desktop Application Scenario Set

Be the authoritative scenario source and the authoritative case-to-check relation for one desktop application
outcome. Policy lives in [`SKILL.md`](SKILL.md). Its consumers are [`checklists.md`](checklists.md) and
[`evaluation.md`](evaluation.md). It exercises the parent contract and adds no policy.

**Purpose:** ten coverage families and **fifty-five cases** that a desktop run must handle, each with an
observable outcome a wrong run would produce differently, and each converted into the design obligation it
proves. **Target:** one bounded desktop application outcome as `SKILL.md` defines it. **Consumer:** the run
itself while designing, and an evaluator afterward. **Lifecycle mode:** design obligations, consumed in
evaluation.

**Scale, and the thresholds this set records.** Ten families, fifty-five cases, and **51 populated cells**,
where a cell is one distinct `(category, triggered case type)` pair. Every figure here is reproduced by
scanning this file rather than carried from a plan.

The generic defaults are roughly twelve families and forty cells, and this set **records its own cell
threshold as 55**. Two reasons, and the first is the load-bearing one. The family count is not this author's
to tune: `SKILL.md`'s design fixes exactly ten families, one per coverage category, so splitting the set
under a parent index would contradict the parent rather than bound this file — the split remedy the generic
threshold prescribes is unavailable here. And fifty-one cells across ten locked families is close to the
floor for this target, because each family owes a positive case and an adversarial face before any
risk-triggered minimum is discharged, which is twenty cells before the first stress case exists.

**Non-goals.** This set constructs no verification checks and reads none. It reserves check IDs and states
obligations; [`checklists.md`](checklists.md) authors the checks themselves. It states no policy — every
obligation traces to a clause `SKILL.md` already carries, and a case with no such clause is a parent-policy
finding rather than a licence to write one here.

## Coverage register

All ten categories are `selected`. None is `covered-elsewhere` and none is `n/a`: a desktop application
outcome touches every one of them, which is why the family set is exactly ten.

| # | Category | Disposition | Carrier | The desktop discrimination it carries |
|---|---|---|---|---|
| 1 | Purpose / outcomes / scope | `selected` | `DESK-FAMILY-01` | one bounded desktop outcome, the stack-fit decision, the ownership boundary |
| 2 | Actors / stakeholders / use-context | `selected` | `DESK-FAMILY-02` | the ladder's participant activities, consent, per-system representativeness |
| 3 | Behavior / state / data | `selected` | `DESK-FAMILY-03` | window and application lifecycle state, local data, migration including downgrade |
| 4 | Interfaces / dependencies / structure | `selected` | `DESK-FAMILY-04` | the privilege boundary, the channel inventory, the three compilation targets |
| 5 | Quality attributes / resource economics | `selected` | `DESK-FAMILY-05` | startup and responsiveness against a named platform version, privileged-process blocking, footprint |
| 6 | Failure / recovery / operations | `selected` | `DESK-FAMILY-06` | crash and reload, interrupted write, failed update, corrupt-state recovery |
| 7 | Trust / harm / governance | `selected` | `DESK-FAMILY-07` | the two kinds of security work, build-time hardening, secrets, untrusted content |
| 8 | Inclusion / locale | `selected` | `DESK-FAMILY-08` | the accessibility union, per-system assistive technology, locale and language |
| 9 | Change / compatibility / reversibility | `selected` | `DESK-FAMILY-09` | release irreversibility, the supported-old-version window, signing and update |
| 10 | Evidence / traceability / clarity | `selected` | `DESK-FAMILY-10` | the rung register, the claim ledger, evidence-class separation, the trace and verifier proof |

**No `covered-elsewhere` disposition appears**, so no condition-to-clause ledger is required. Two adjacent
skills own material this set points at rather than covering — the language skill owns general idiom and the
generic evaluation skill owns perspectives — but neither owns a *coverage category* of this set.

## Category × case-type matrix

Every cell is dispositioned. A populated cell names the cases; an unpopulated cell names the **property**
that makes that case type inapplicable to that family. No cell is a bare `n/a`.

Abbreviations: **Pos** positive · **Alt** alternative-valid · **Neg** negative · **Bnd** boundary ·
**F/R** failure/recovery · **Adv** adversarial · **Chg** change/regression · **Ctf** counterfactual.

| Family | Pos | Alt | Neg | Bnd | F/R | Adv | Chg | Ctf |
|---|---|---|---|---|---|---|---|---|
| `01` Purpose | 01 | 02 | 03 | `n/a: the outcome contract has no quantity, ordering, or time-window property to sit at a limit of` | `n/a: a scope contract is a written agreement, not a runtime component that can fail partway` | 04 | `n/a: this family fixes the contract before any version of it exists to change` | 05 |
| `02` Actors | 06, 54 | 07 | 08 | 09 | 10 | 11 | `n/a: participant conditions are re-established per activity, so there is no before/after version of them to compare` | `n/a: the participant floor's premise is fail-closed by construction, leaving no load-bearing premise to invert` |
| `03` Behavior | 12 | `n/a: the state machine's valid entry paths are enumerated by DESK-FAMILY-01's entry-mode inventory, so a second valid class here would duplicate that family's coverage` | 13 | 14 | 15 | 16 | 17 | `n/a: this family asserts no premise beyond the platform mechanisms its siblings verify at their owners` |
| `04` Interfaces | 18 | `n/a: the four execution contexts are one enumerated set, not alternative valid routes through one contract` | 19 | `n/a: the crossable-type set is a membership question, not a limit with an adjacent value` | 20 | 21 | 22 | `n/a: the boundary's premise — that a declared type does not validate — is exercised directly by case 21 rather than inverted` |
| `05` Quality | 23 | `n/a: a measurement has one valid method here; a second would vary the subject, not the class` | `n/a: an invalid measurement is an unsourced claim, which DESK-FAMILY-10 owns as an evidence defect` | 24 | `n/a: a resource bound that is exceeded is this family's boundary case, not a separate injected failure` | 25 | `n/a: a cross-version comparison of a measurement is exactly what case 24's version-naming obligation exists to make possible, and is covered there` | 26 |
| `06` Failure | 27 | `n/a: recovery has one correct path per failure here; a second valid route would be a different failure` | `n/a: rejecting an invalid input is DESK-FAMILY-04's crossing validation, not a recovery concern` | 28 | 29 | 30 | `n/a: a failed update's version change is exercised by DESK-FAMILY-09, which owns the version axis` | `n/a: this family's premise — that interruption is ordinary — is asserted by the safety floor and not inverted here` |
| `07` Trust | 31 | `n/a: a control is written or it is not; there is no materially different valid way to leave a default intact` | 32 | 33 | `n/a: a security control that fails open is an adversarial case here, and case 34 carries it` | 34, 35 | 36 | `n/a: the premise that packaging is not a boundary is stated by its own documentation and needs no inversion` |
| `08` Inclusion | 37 | 38 | 39 | 40 | `n/a: assistive technology failing is an availability loss, which this family's positive and boundary cases already observe directly` | 41 | `n/a: a locale or modality change is a re-run of case 37's own union, not a version event` | `n/a: the union is a stated minimum with a residual clause, so its premise is open by construction` |
| `09` Change | 42 | `n/a: each claimed system's release chain is its own required path, covered per system inside case 42 rather than as an alternative` | 43 | 44 | 45 | 46 | 47 | `n/a: irreversibility is a property of the world here, not a premise this set could invert` |
| `10` Evidence | 48 | `n/a: a resolution kind is one of three enumerated values, and all three are exercised inside case 48` | 49 | 50 | `n/a: a missing record is an evidence defect this family observes directly, not an injected runtime failure` | 51, 52, 55 | `n/a: the record's own version history is the run's concern, not this skill's` | 53 |

## Sources and IDs

**Sources.** Every case derives from a clause `SKILL.md` already carries — a `DESK-R` rule, a `DESK-N`
prohibition, a `DESK-FLOOR` floor with its property check, a `DESK-G` gate, or a named phase. The mechanics
children supply the concrete mechanism each case exercises. No case derives from a source outside the
family, and no case introduces a mechanism its owning child does not state.

**Stable-ID policy.** `DESK-FAMILY-01`–`10` and `DESK-SCENARIO-01`–`55` are permanent — fifty-five cases,
numbered without gaps, reproduced by scan. The last two identifiers were allocated after a coverage sweep
found two reserved checks with no seeding case, so they sit at the end of the sequence rather than inside
their families' runs; identifiers are allocation-ordered and never renumbered. Renaming a title
never changes an identifier. A case whose *discrimination* changes — it now tests something different — gets
a new identifier rather than reusing the old one, so a finding stays resolvable across revisions. A retired
identifier is never reallocated.

**Sensitive evidence is referenced, never inlined.** Participant records, consent records, and any captured
personal data are named by pointer to the run's own design record, with the run's retention policy governing
them. No case reproduces a participant's own words or data here.

## The authoritative relation

**Each case's `Trace:` field is the authoritative case-to-check relation for this family.** Three other
projections must be exact projections of it — each check's `Seeds` field and the guaranteed coverage map in
[`checklists.md`](checklists.md), and the check-to-obligation union audit in the same file. No forward-only,
reverse-only, grouped, or inferred edge is valid.

There are **four** projections, not five. A check's `Source` field is a *(check, rule)* relation while these
four are *(case, check)* relations; a relation over one pair of sets cannot be an exact projection of a
relation over a different pair, so requiring equality across all five is a test no correct bundle can pass.
`Source` closes its own direction through the crosswalk [`evaluation.md`](evaluation.md) owns.

**Every case carries six fields**: primary type with its coverage-role set, Given/When/Then, a failure
oracle, an evidence tuple, an obligation, and the trace. **A case's primary category and primary type are
author-declared with a one-line justification, never derived from the matched set** — no mechanical rule is
correct for every family, and four design iterations proved it by counterexample before the declared form
was settled. The primary label carries stable IDs, grouping, and perspective routing only; it never
discharges coverage.

## The ten families

### `DESK-FAMILY-01` — One bounded outcome, the stack decision, and the ownership boundary

*Declared primary category:* **1 Purpose / outcomes / scope** — the family's defining discrimination is
whether the right outcome and the right in-or-out-of-scope boundary are served. *Secondary tags:* 2 Actors,
10 Evidence. *Applicability:* unconditional. *Priority:* first — every later family reads this one's claim
set.

*Actor:* the run's decision-holder. *Outcome:* a bounded desktop outcome with its claimed systems, its entry
modes, its completion signals, and its stack decision recorded. *Invariant:* nothing downstream may widen
the claim set without returning here.

#### `DESK-SCENARIO-01` — The outcome, the boundary, and the ownership statement are locked together

*Primary type:* **Positive** — it exercises the ordinary valid path of framing a run. *Coverage-role:*
`positive` (exercises the intended framing outcome end to end).
*Given* a trigger and an application that may or may not exist yet. *When* the run frames the outcome per
`DESK-R01`, states the claimed systems, and states the design-ownership boundary per `DESK-R04`. *Then* one
outcome sentence, the claimed-system set, the entry modes, the visible and system completion signals, the
non-goals, and the ownership statement are all recorded and mutually consistent.
*Failure oracle:* any claimed system with no named evidence route, or an entry mode named in the outcome
that appears in no path, or an ownership statement absent while a second design authority is assumed.
*Evidence:* read the run's own design record; confirm each field is present and that the claimed-system set
in the outcome sentence equals the set the entry modes and non-goals assume.
*Obligation:* the design MUST bind one outcome with its actors, entry modes, claimed operating systems,
visible and system completion evidence, non-goals, and the statement that this skill is the sole design
owner holding the acceptance gate.
*Trace:* `DESK-CHECK-01`, `DESK-CHECK-03`

#### `DESK-SCENARIO-02` — An alternative-valid framing: an existing application rather than a new one

*Primary type:* **Alternative-valid** — a materially different valid starting state, not a second happy
path. *Coverage-role:* `alternative-valid` (exercises the inherited-constraint route the greenfield case
cannot).
*Given* a shipped application with installed users and a live release chain. *When* the run frames a bounded
outcome inside it. *Then* the frame additionally records what must not change, which compatibility promises
bind, and which installed versions make the change expensive to reverse.
*Failure oracle:* a frame that reads identically to a greenfield frame — no unchanged-behavior list and no
installed-version constraint — while a shipped version exists.
*Evidence:* read the frame against the release history; confirm the unchanged-behavior list is non-empty and
names real current behavior.
*Obligation:* the design MUST record, for a run inside an existing application, the behavior that must not
change and the installed versions that constrain reversibility.
*Trace:* `DESK-CHECK-01`, `DESK-CHECK-25`

#### `DESK-SCENARIO-03` — A packaged artifact offered as a finished outcome

*Primary type:* **Negative** — it supplies an invalid completion claim and expects rejection.
*Coverage-role:* `negative` (exercises safe rejection of a false completion).
*Given* a run whose designed paths include a cancelled-operation recovery route that was never implemented.
*When* the run offers a packaged, installing artifact as the finished outcome. *Then* the claim is rejected
and the run returns to close the missing path, with no release authority sought.
*Failure oracle:* release readiness reported while a path named in the run's own flow set has no
implementation; or a green build presented as outcome completion.
*Evidence:* diff the run's designed path set against its implemented path set; any designed path with no
implementation and no recorded scope removal fails.
*Obligation:* the design MUST NOT treat a window, a handler, a passing development build, or a packaged
artifact as a finished outcome while any in-scope designed path is unimplemented.
*Trace:* `DESK-CHECK-25`

#### `DESK-SCENARIO-04` — Continued work offered as gate approval

*Primary type:* **Adversarial** — a cosmetically compliant run attempts to pass an authority gate without
the decision. *Coverage-role:* `adversarial` (attacks the gate-authority invariant).
*Given* a run that reached a named gate, presented its material, received no answer, and continued.
*When* the run later cites the completed downstream work as evidence the gate was approved. *Then* the gate
is treated as unfired, the downstream work does not substitute for the decision, and the run stops for the
explicit answer.
*Failure oracle:* a gate row carrying a recommendation and downstream artifacts but no recorded decision,
accepted as approved. Silence, continued work, an earlier decision on a different axis, or a stakeholder's
enthusiasm each read as approval.
*Evidence:* read the gate record; a gate without an explicit recorded decision from the named authority is
unfired regardless of what followed it.
*Obligation:* the design MUST stop at each named gate for an explicit decision, and MUST NOT accept silence,
continued work, an adjacent decision, or enthusiasm in its place.
*Trace:* `DESK-CHECK-04`, `DESK-CHECK-36`

#### `DESK-SCENARIO-05` — The stack-fit premise is inverted: a criterion fires

*Primary type:* **Counterfactual** — it inverts the load-bearing premise that this stack suits the outcome.
*Coverage-role:* `counterfactual` (inverts the stack premise and requires a named disconfirmation response).
*Given* an outcome whose stated requirements make one of the six wrong-choice criteria positive on
inspection. *When* the run reaches the stack decision. *Then* the positive criterion, the mechanism that
makes it decisive, and the alternative it points at are presented to the user as a stack decision, and the
run does not proceed on the strength of a plan to be careful.
*Failure oracle:* a positive criterion recorded and the run continuing on this stack with no user decision;
or six criteria answered as a summary verdict rather than as six inspected results.
*Evidence:* read the six-row result table; each row carries an inspected result against this outcome's own
stated requirements, and any positive row carries the user's decision.
*Obligation:* the design MUST run the six-criterion test with a recorded inspected result per criterion, and
MUST route any positive result to the user as a stack decision rather than absorbing it.
*Trace:* `DESK-CHECK-02`

### `DESK-FAMILY-02` — Participants, consent, representativeness, and the design gates

*Declared primary category:* **2 Actors / stakeholders / use-context** — the defining discrimination is who
participates, under what conditions, and whether they genuinely represent the claimed population. *Secondary
tags:* 7 Trust (consent and data protection), 10 Evidence. *Applicability:* unconditional — six ladder rungs
involve people. *Priority:* high; a failure here fails closed and stops the run.

*Actor:* participants and the run's researcher. *Outcome:* every participant activity governed, and the
design accepted only on direct evidence from representative people per claimed system. *Invariant:* a
missing participant condition stops the run and reports missing context.

#### `DESK-SCENARIO-06` — Participant conditions in place before the first activity

*Primary type:* **Positive** — the ordinary valid path of running a participant activity.
*Coverage-role:* `positive` (exercises the governed-activity path end to end).
*Given* a run about to hold contextual interviews at the research rung. *When* the activity is prepared.
*Then* informed consent, needed accommodations, data minimization, and a retention and protection record
exist **before** the first session, and observation is recorded separately from interpretation.
*Failure oracle:* a consent record dated after the session it governs; or interpretation and observation
recorded as one field.
*Evidence:* read the activity record against the session timestamps; consent must precede the activity it
covers.
*Obligation:* the design MUST establish informed consent, accommodations, minimization, and protection
before any activity involving a person, and MUST keep observation separate from interpretation.
*Trace:* `DESK-CHECK-13`

#### `DESK-SCENARIO-07` — An alternative-valid participant route: cited prior research

*Primary type:* **Alternative-valid** — a materially different valid way to satisfy a rung's evidence.
*Coverage-role:* `alternative-valid` (exercises the citation route rather than the fresh-activity route).
*Given* an existing study whose participants match this outcome's claimed population. *When* the run closes
a rung by citing it. *Then* the citation addresses that rung's own question, resolves to an inspectable and
substantive artifact, states why it is still valid, states what it does not cover, and does not point
forward — and the uncovered remainder is answered or proved inapplicable in its own right.
*Failure oracle:* a citation that closes a whole rung while answering part of its question, with no recorded
remainder.
*Evidence:* open the cited artifact and read it against the rung's question text; confirm the remainder
statement exists and that the remainder itself carries a resolution.
*Obligation:* the design MUST let an existing answer close only the part of a rung's question it actually
addresses, with the remainder resolved in its own right.
*Trace:* `DESK-CHECK-07`

#### `DESK-SCENARIO-08` — Acceptance sought without direct evidence from representative people

*Primary type:* **Negative** — an invalid acceptance precondition, expecting refusal.
*Coverage-role:* `negative` (exercises refusal of acceptance on context-only evidence).
*Given* a design record whose human-outcome claims rest on expert review, heuristic review, analytics, and
stakeholder approval. *When* acceptance is sought. *Then* acceptance is unavailable, because every one of
those is context only, and the run returns to obtain direct evidence from representative people using this
run's own artifacts.
*Failure oracle:* acceptance granted with no participant record from this run's own artifacts; or a
stakeholder's approval presented as user evidence.
*Evidence:* read the design record's evidence table; each human-outcome claim resolves to a participant
record from this run, or acceptance fails.
*Obligation:* the design MUST make direct representative-user evidence from this run's own artifacts the
acceptance evidence, and MUST treat prior research, expert review, analytics, and approval as context only.
*Trace:* `DESK-CHECK-15`

#### `DESK-SCENARIO-09` — The structural skeleton is approved before any visual rung begins

*Primary type:* **Boundary** — it sits at the exact transition between the structural rung and the first
visual rung. *Coverage-role:* `boundary` (exercises the exact gate transition).
*Given* a completed surface-neutral structural specification with its state and path map, its surface
mapping, and its open-question register. *When* the run reaches the point where a visual rung would begin.
*Then* the run stops, the user explicitly approves the structure or reopens it, the register row records the
**approval decision** rather than merely the artifact, and no visual rung starts until that decision exists.
*Failure oracle:* a wireflow, mockup, or interactive prototype whose creation timestamp precedes the
recorded structural-approval decision; or a register row citing the specification artifact with no decision.
*Evidence:* compare the recorded approval decision's timestamp against the earliest visual artifact's; and
read the register row for a decision, not an artifact pointer.
*Obligation:* the design MUST obtain an explicit structural-approval decision before any visual rung begins,
and MUST record the decision itself in the rung register.
*Trace:* `DESK-CHECK-06`

#### `DESK-SCENARIO-10` — A required participant condition is missing

*Primary type:* **Failure / recovery** — a required precondition is absent and the run must fail closed.
*Coverage-role:* `failure/recovery` (exercises the fail-closed stop and its recovery route).
*Given* a run that cannot reach genuinely representative users for one claimed operating system. *When* the
run reaches an activity that needs them. *Then* the run stops and reports missing context; it may record an
assumptions register and a test plan, and it may not accept a design.
*Failure oracle:* the run proceeding with whoever was available and describing them as representative; or a
missing accommodation absorbed as a limitation while acceptance proceeds.
*Evidence:* read the participant record per claimed system; a system with no representative-participant
record and an accepted design fails.
*Obligation:* the design MUST fail closed on any one of missing access to representative users, missing
consent, missing accommodations, or missing required evidence, and MUST report missing context rather than
proceeding.
*Trace:* `DESK-CHECK-13`

#### `DESK-SCENARIO-11` — An unlisted participant activity whose observations are cited

*Primary type:* **Adversarial** — a cosmetically compliant run whose named activities all pass while an
unnamed one is ungoverned. *Coverage-role:* `adversarial` (attacks the floor through the gap between the
named list and the actual inventory).
*Given* a run where every ladder round carries a complete consent and accommodation record. *When* the
design record additionally cites observations from a recruitment screening call that no round names, and
that call ran with no consent record. *Then* the floor fails, because the governed set is the run's own
**activity inventory** and not the ladder's named rounds.
*Failure oracle:* a floor passing on the strength of its named rounds while an activity whose output is
cited as evidence anywhere carries no consent record.
*Evidence:* sweep every activity whose output is cited as evidence anywhere in the design record — rounds,
interviews, screenings, informal walkthroughs, post-release contact — and require a consent, accommodation,
minimization, protection, and representativeness record for each.
*Obligation:* the design MUST govern every activity involving a person whose output is cited as evidence,
whether or not the activity type appears in the ladder, and MUST NOT accept a named-round roll-up as the
property check's evidence.
*Trace:* `DESK-CHECK-14`

#### `DESK-SCENARIO-54` — The ladder's own method order, and three axes stated per visual artifact

*Primary type:* **Positive** — the ordinary valid path of running the ladder's methods in their own order.
*Coverage-role:* `positive` (exercises the method order and the three-axis statement together).
*Given* a run at the information-architecture and visual rungs. *When* each rung is resolved. *Then* the
generative method runs before the evaluative one — a card sort producing the users' own grouping, then a
tree test grading it — the structural rung needs no visual design, iteration budget goes to several small
rounds rather than one large one, and **each visual artifact states its position on all three fidelity axes
independently**. The shape-conditioned default applies: a desktop application is few windows with heavy
in-place state change, so the wireflow is the default primary artifact rather than page wireframes plus a
site map.
*Failure oracle:* a tree test run on a structure no card sort shaped, or a card sort with no tree test
grading it; a single low-to-high fidelity dial in place of three independent axis positions; or a
page-oriented site map produced as the default deliverable for this product shape with no recorded reason.
*Evidence:* read each rung's recorded method and its order against the rung's own stated validator; and read
each visual artifact's record for three separately stated axis positions.
*Obligation:* the design MUST use each rung's own validation method in its own generative-then-evaluative
order, MUST state interactivity, visuals, and content-and-navigation as three independent positions per
visual artifact, and MUST apply the wireflow default for this product shape or record why the shape differs.
*Trace:* `DESK-CHECK-08`

### `DESK-FAMILY-03` — Window lifecycle, local data, and migration

*Declared primary category:* **3 Behavior / state / data** — the defining discrimination is a pre/post state,
a transition, or a data-lifecycle step. *Secondary tags:* 6 Failure/recovery, 9 Change, 7 Trust. *Note on
the declared primary:* the order-default for a family matching {3, 6, 7, 9} would be 7, but this family's
cases turn on the state and the data rather than on a harm surface or a version event; the harm and version
faces are carried by families 07 and 09, which declare those categories. *Applicability:* unconditional.
*Priority:* high.

*Actor:* the person using the installed application. *Outcome:* windows and data behave correctly across
launch, quit, interruption, and version change. *Invariant:* no ordinary action reaches a state the person
cannot foresee, refuse, or recover from.

#### `DESK-SCENARIO-12` — First paint uses both mechanisms

*Primary type:* **Positive** — the ordinary valid launch path. *Coverage-role:* `positive` (exercises a
correct first paint).
*Given* an application configured with a hidden initial window, a ready-to-show handler, **and** a background
color. *When* it launches. *Then* the window appears with neither a white flash nor a period in which the
application appears not to have launched.
*Failure oracle:* a visible flash on show, or a measurable gap between launch and any visible window; either
one indicates only one of the two mechanisms is in place.
*Evidence:* record the launch on each claimed system and inspect the frames between process start and first
paint.
*Obligation:* the design MUST create the window hidden and show it on the ready-to-show event **and** set a
background color, because each mechanism alone leaves one bad case.
*Trace:* `DESK-CHECK-23`

#### `DESK-SCENARIO-13` — A downgrade rewrites newer data into an older shape

*Primary type:* **Negative** — an invalid migration behavior expecting refusal or preservation.
*Coverage-role:* `negative` (exercises rejection of the destructive downgrade path).
*Given* data written by a newer version, carrying an explicit structure version. *When* an older version
opens it. *Then* the older version either reads what it understands while preserving what it does not,
refuses explicitly and leaves the data intact, or works on a copy — and it never silently rewrites the newer
structure into the older shape.
*Failure oracle:* open with the newer version after the round trip; any field written by the newer version
that is absent, and any structure-version downgrade written back, is data loss.
*Evidence:* install newer, create real data, install older, open it, reinstall newer, and diff the data
against the pre-downgrade state.
*Obligation:* the design MUST carry an explicit structure version and a downgrade path that preserves,
refuses, or copies — and MUST NOT silently rewrite newer data into an older shape.
*Trace:* `DESK-CHECK-24`

#### `DESK-SCENARIO-14` — A monitor disappears between sessions

*Primary type:* **Boundary** — it sits at the exact transition where saved bounds stop intersecting an
attached display. *Coverage-role:* `boundary` (exercises the exact display-attachment transition).
*Given* saved window bounds on a secondary display. *When* the application is relaunched with that display
detached. *Then* the restore validates the saved bounds against the currently attached displays and falls
back to a visible default rather than placing the window where nothing can reach it.
*Failure oracle:* a window restored to coordinates outside every attached display's area — invisible, and
unreachable without editing state by hand.
*Evidence:* set bounds on a second display, detach it, relaunch, and confirm the window is visible and
focusable on an attached display.
*Obligation:* the design MUST validate restored window bounds against the currently attached displays and
fall back to a visible position when they do not intersect one.
*Trace:* `DESK-CHECK-23`

#### `DESK-SCENARIO-15` — A local write is interrupted

*Primary type:* **Failure / recovery** — an interruption is injected and detection plus containment is
expected. *Coverage-role:* `failure/recovery` (exercises interruption detection and recovery).
*Given* an application writing a data file. *When* the process is killed mid-write. *Then* the next read
observes either the whole previous content or the whole new content, or detects the file as incomplete and
refuses it — and never parses a truncated file into a plausible-looking value.
*Failure oracle:* a post-interruption read that succeeds and returns a structurally valid value whose
content is half of each version.
*Evidence:* interrupt a write repeatedly under load, then read; classify each result as old, new, or
detected-incomplete, and fail on any fourth outcome.
*Obligation:* the design MUST make every local write durable or detectably incomplete, replacing the target
atomically and carrying a marker that lets a reader reject a truncated file.
*Trace:* `DESK-CHECK-24`

#### `DESK-SCENARIO-16` — A second instance's arguments are read by position

*Primary type:* **Adversarial** — an ordinary launch produces an argument list whose order the run assumed.
*Coverage-role:* `adversarial` (attacks the argument-handling invariant with a legitimate but unexpected
launch).
*Given* an application that reads the deep link from a fixed index of the second-instance argument list.
*When* the operating system delivers that list with a changed order or an appended argument. *Then* the run
acts on the wrong target — which is why the argument must be found by matching what it is rather than by
where it sits.
*Failure oracle:* a second launch that opens a document or navigates to a target the person did not choose;
the platform documents that the list's order can change and that arguments can be appended.
*Evidence:* launch a second instance with additional arguments present and in varied order; confirm the run
resolves the intended target in every ordering.
*Obligation:* the design MUST parse the second-instance argument list by matching, never by position, and
MUST treat a positional read as a safety defect rather than a correctness preference.
*Trace:* `DESK-CHECK-23`, `DESK-CHECK-11`

#### `DESK-SCENARIO-17` — A schema change ships and the previous version is still installed

*Primary type:* **Change / regression** — it compares behavior across a version change.
*Coverage-role:* `change/regression` (exercises the mixed-version data state).
*Given* two installed versions in the field and one shared data location. *When* the newer version writes
and the older version subsequently reads. *Then* both directions are exercised and recorded, and the
supported-old-version window states which older versions this obligation covers.
*Failure oracle:* a migration proved only forward, with the reverse direction untested and undocumented.
*Evidence:* the round-trip test from case 13 run against every version inside the stated support window.
*Obligation:* the design MUST state which older versions its data contract supports, and MUST prove the data
round trip across that stated window rather than only forward.
*Trace:* `DESK-CHECK-24`, `DESK-CHECK-31`

### `DESK-FAMILY-04` — The privilege boundary, the channel inventory, and the three targets

*Declared primary category:* **4 Interfaces / dependencies / structure** — the defining discrimination is a
contract between components across a boundary. *Secondary tags:* 7 Trust, 3 Behavior. *Applicability:*
unconditional. *Priority:* high — this is the product's real perimeter.

*Actor:* the code on either side of the boundary, and an attacker shaping what crosses it. *Outcome:* every
crossing validated on both payload and caller, and every unit's execution context stated. *Invariant:* a
declared type states a shape and never validates one.

#### `DESK-SCENARIO-18` — Every channel carries its type, its validation, and its sender rule

*Primary type:* **Positive** — the ordinary valid path of a complete channel inventory.
*Coverage-role:* `positive` (exercises a correctly specified privileged crossing).
*Given* an outcome whose privileged effects are reached over named channels. *When* the contract is locked.
*Then* every channel in the inventory names its payload type, the runtime validation that parses it into a
domain type, the sender rule that verifies the calling frame, and the privileged effect it reaches — and
every unit of the outcome states which execution context it runs in.
*Failure oracle:* a privileged handler reachable over a channel absent from the inventory; or an inventory
row with a payload type and no runtime validation.
*Evidence:* enumerate the registered handlers from the source and compare against the inventory; the two
sets must be equal.
*Obligation:* the design MUST enumerate every channel with its payload type, runtime validation, sender
rule, and privileged effect, and MUST state each unit's execution context.
*Trace:* `DESK-CHECK-19`, `DESK-CHECK-18`

#### `DESK-SCENARIO-19` — The renderer target includes the runtime's ambient types

*Primary type:* **Negative** — an invalid configuration expecting rejection.
*Coverage-role:* `negative` (exercises rejection of the type-check inversion).
*Given* a renderer target configured with the runtime's ambient types while renderer runtime integration is
off. *When* renderer code calls a file-system or process interface. *Then* the type-check passes and the
call throws at run time — which is why the configuration is a defect rather than a preference.
*Failure oracle:* a green type-check over a renderer call that the sandbox rejects when executed.
*Evidence:* read the renderer target's type configuration; and run the renderer path that the ambient types
would permit, observing the runtime failure.
*Obligation:* the design MUST exclude the runtime's ambient types from the renderer target, because a green
type-check over code the sandbox rejects is a correctness and security inversion.
*Trace:* `DESK-CHECK-18`

#### `DESK-SCENARIO-20` — A port closes when nothing named its lifetime

*Primary type:* **Failure / recovery** — an async resource is lost and the failure must be detected and
contained. *Coverage-role:* `failure/recovery` (exercises lifetime loss and its recovery route).
*Given* a message port held only by a local variable in a function that returns. *When* collection runs.
*Then* the port closes at a time nothing in the code names, and the channel silently stops delivering —
which is why every privileged resource held for a renderer names the lifecycle event that releases it.
*Failure oracle:* a channel that works under test and stops under memory pressure or after idle time, with
no error at the point of closure.
*Evidence:* hold the port, force collection pressure, and observe delivery; then repeat with the lifetime
keyed to a named window or contents lifecycle event.
*Obligation:* the design MUST key every cross-process resource's disposal to a named lifecycle event rather
than to scope exit, with the last-resort terminal named.
*Trace:* `DESK-CHECK-20`

#### `DESK-SCENARIO-21` — A class instance is sent across the bridge

*Primary type:* **Adversarial** — a fully typed call delivers a value the type system cannot describe.
*Coverage-role:* `adversarial` (attacks the assumption that a declared type describes what arrives).
*Given* a bridge contract whose declared type names a class. *When* an instance is sent across. *Then* the
receiving side gets a prototype-stripped object: the data arrives, the methods do not, and the compiler
reports nothing — and a symbol-keyed member does not cross at all.
*Failure oracle:* a call that type-checks and fails at run time on a missing method; or a contract typed in
terms of classes rather than plain data and asynchronous functions.
*Evidence:* send an instance across and inspect the received value's prototype and own keys on the receiving
side.
*Obligation:* the design MUST give the bridge one source-of-truth contract type carrying only
structured-cloneable values and plain asynchronous functions, and MUST NOT type it in terms of classes,
constructors, or symbol-keyed members.
*Trace:* `DESK-CHECK-18`, `DESK-CHECK-19`

#### `DESK-SCENARIO-22` — The three-target split is taught as documented fact

*Primary type:* **Change / regression** — it compares the claim's status before and after someone checks
its source. *Coverage-role:* `change/regression` (exercises the marking's survival across restatement).
*Given* the three-target compilation split, which no primary source states and which follows from the
verified preload-context sentence. *When* the split is restated in a rule, a phase, a case, or a mechanics
child. *Then* the derived marking travels with it at every one of those sites, and the split is never
presented as documented.
*Failure oracle:* any site stating the three-target split without its derived marking.
*Evidence:* enumerate every site that states the split and confirm the marking is present at each; the
design names the rule, the build phase, this family, and the mechanics child as those sites.
*Obligation:* the design MUST carry the derived marking with the three-target split wherever the split is
restated, taught, or exercised.
*Trace:* `DESK-CHECK-18`

### `DESK-FAMILY-05` — Startup, responsiveness, and resource economics

*Declared primary category:* **5 Quality attributes / resource economics** — the defining discrimination is
a latency, capacity, or footprint bound. *Secondary tags:* 10 Evidence, 1 Purpose. *Applicability:*
conditional on the outcome stating a performance or footprint property; unconditional for the
version-naming obligation, which binds any measurement the run records. *Priority:* medium.

*Actor:* the person waiting for the application. *Outcome:* measurements that mean something a version
later. *Invariant:* a measurement without its platform version measures nothing.

#### `DESK-SCENARIO-23` — A startup measurement names its platform version

*Primary type:* **Positive** — the ordinary valid path of recording a measurement.
*Coverage-role:* `positive` (exercises a correctly qualified measurement).
*Given* a startup measurement taken on a specific platform version. *When* it is recorded. *Then* the record
names that version in the same statement, so a later reader can tell whether the number still applies.
*Failure oracle:* a startup number in the record with no version beside it; the platform's own startup
baseline changed with a recent release, so an unqualified number cannot be compared to anything.
*Evidence:* read each recorded measurement; every one carries the platform version it was taken on.
*Obligation:* the design MUST name the platform version any version-dependent statement depends on, in the
same statement, so a stale statement identifies itself.
*Trace:* `DESK-CHECK-26`, `DESK-CHECK-05`

#### `DESK-SCENARIO-24` — A synchronous read runs in the privileged process

*Primary type:* **Boundary** — it sits at the exact transition where one blocking call stops every window.
*Coverage-role:* `boundary` (exercises the exact blocking threshold across all windows at once).
*Given* an application with several windows open. *When* the privileged process performs one synchronous
file read or one large parse. *Then* every window stops responding simultaneously, because that process owns
the interface thread across all of them.
*Failure oracle:* interaction stalling in a window that is doing no work of its own, at the moment another
window triggers a privileged read.
*Evidence:* open several windows, trigger the synchronous path, and record responsiveness in a window not
involved in the operation.
*Obligation:* the design MUST keep file and parsing work off the privileged process's own thread, because a
blocking call there freezes every window at once rather than one.
*Trace:* `DESK-CHECK-26`

#### `DESK-SCENARIO-25` — An unqualified number is offered as an improvement

*Primary type:* **Adversarial** — a cosmetically valid measurement is used to support a claim it cannot
carry. *Coverage-role:* `adversarial` (attacks the measurement's claim boundary).
*Given* two startup numbers taken on different platform versions. *When* their difference is presented as
the run's own improvement. *Then* the claim is rejected, because a platform upgrade is itself a
startup-performance action and the comparison does not isolate the run's work.
*Failure oracle:* a before/after performance claim whose two measurements name different platform versions,
or name none.
*Evidence:* read both measurements' recorded versions; equal versions are required before the difference is
attributed to the run.
*Obligation:* the design MUST NOT attribute a measured difference to its own work when the platform version
differs between the two measurements.
*Trace:* `DESK-CHECK-26`, `DESK-CHECK-05`

#### `DESK-SCENARIO-26` — The footprint premise is inverted

*Primary type:* **Counterfactual** — it inverts the premise that this stack's footprint suits the outcome.
*Coverage-role:* `counterfactual` (inverts the footprint premise and requires the named response).
*Given* a product requirement that states a distribution-size or memory bound. *When* the stack-fit test
runs. *Then* the first wrong-choice criterion is positive, and the run routes a stack decision to the user
rather than planning to optimize the bundled engine away.
*Failure oracle:* a stated size or memory requirement recorded, the first criterion answered negative, and
the run continuing on this stack with an optimization plan.
*Evidence:* read the product requirements for a stated size or footprint bound, then read the criterion's
inspected result against it.
*Obligation:* the design MUST treat a stated distribution-size or footprint requirement as a positive
wrong-choice criterion, because the bundled engine baseline is structural rather than tunable.
*Trace:* `DESK-CHECK-02`

### `DESK-FAMILY-06` — Crash, interruption, failed update, and recovery

*Declared primary category:* **6 Failure / recovery / operations** — the defining discrimination is a partial
or full failure and its detection, containment, and recovery. *Secondary tags:* 3 Behavior, 9 Change.
*Applicability:* unconditional. *Priority:* high.

*Actor:* the person mid-task when something fails. *Outcome:* every failure detected, contained, and
recoverable. *Invariant:* interruption is ordinary, not exceptional.

#### `DESK-SCENARIO-27` — An update install flushes live work first

*Primary type:* **Positive** — the ordinary valid path of a correct update install. Note that for this
family the positive discrimination is the handled path succeeding, not a happy path with no failure in it.
*Coverage-role:* `positive` (exercises correct containment of the install race).
*Given* an application with unsaved work and an update ready to install. *When* the install begins. *Then*
the pre-quit-for-update hook fires, work is flushed durably, resources are released, the person's position
is recorded, and the restart resumes where they were.
*Failure oracle:* work present before the update and absent after it; or a restart that lands the person at
a default state with no record of where they were.
*Evidence:* create unsaved work, trigger the install, and compare the post-restart state against the
pre-install state.
*Obligation:* the design MUST handle the pre-quit-for-update event to flush work and release resources
before the updater ends the process.
*Trace:* `DESK-CHECK-30`

#### `DESK-SCENARIO-28` — A corrupt data file is opened

*Primary type:* **Boundary** — it sits at the exact transition between a parseable file and a rejected one.
*Coverage-role:* `boundary` (exercises the exact truncation boundary).
*Given* a data file truncated at a point where the remaining content still parses as valid.
*When* the application opens it. *Then* the marker or length check rejects it and the run reports a
detectable failure, rather than proceeding on a value that is structurally valid and semantically half.
*Failure oracle:* a truncated file that opens successfully and yields a value the application acts on.
*Evidence:* truncate a real file at several offsets, including one that leaves valid syntax, and confirm
each is rejected.
*Obligation:* the design MUST let a reader distinguish a complete file from a truncated one by a length,
checksum, or terminal marker rather than by whether the content parses.
*Trace:* `DESK-CHECK-24`

#### `DESK-SCENARIO-29` — An update fails partway

*Primary type:* **Failure / recovery** — an injected failure during the update, expecting containment.
*Coverage-role:* `failure/recovery` (exercises detection plus recovery of a failed update).
*Given* an update download or install that fails partway. *When* the failure occurs. *Then* the installed
version continues to work, the failure is surfaced rather than silent, and the person is not left with a
partially replaced application.
*Failure oracle:* an application that will not start after a failed update; or a failure that leaves no
record and simply retries forever.
*Evidence:* interrupt the update at the download and install stages separately, and confirm the previous
version launches and functions after each.
*Obligation:* the design MUST leave the installed version working after a failed update, and MUST surface
the failure rather than retrying silently.
*Trace:* `DESK-CHECK-30`

#### `DESK-SCENARIO-30` — The install races a live write with no pre-quit handling

*Primary type:* **Adversarial** — an ordinary update sequence reaches an unrecoverable state.
*Coverage-role:* `adversarial` (attacks the safety invariant through a mechanism the person did not
initiate).
*Given* an application writing data and an updater that calls quit-and-install. *When* the two coincide.
*Then* the process ends mid-write — a consequence the person could not foresee, refuse, or recover from,
because the updater chose the moment and not them.
*Failure oracle:* data loss after an update, reproducible by triggering the install during a write.
*Evidence:* trigger the install during an active write and inspect the data afterward; then repeat with the
pre-quit hook handled and confirm the loss disappears.
*Obligation:* the design MUST treat an update install racing live state as a safety member, handling the
pre-quit event and treating unsaved work as a stop rather than an acceptable hazard.
*Trace:* `DESK-CHECK-30`, `DESK-CHECK-20`

### `DESK-FAMILY-07` — The two kinds of security work, hardening, and untrusted content

*Declared primary category:* **7 Trust / harm / governance** — the defining discrimination is an abuse or
harm surface. *Secondary tags:* 4 Interfaces, 3 Behavior. *Applicability:* unconditional. *Priority:*
highest.

*Actor:* an attacker shaping content, and the run deciding what to write. *Outcome:* every default intact
and every applicable positive control written. *Invariant:* the defaults are not the work.

#### `DESK-SCENARIO-31` — Both kinds of security work are complete

*Primary type:* **Positive** — the ordinary valid path of a complete posture. The positive discrimination
here is the defence holding, not a feature working.
*Coverage-role:* `positive` (exercises both kinds of security work succeeding together).
*Given* an application with the eight defaults intact. *When* the posture is audited. *Then* each of the
eight is confirmed unchanged with a recorded reason for any exception, and each of the twelve applicable
positive controls is confirmed **written**, with the file and line naming it.
*Failure oracle:* an audit that reports the posture complete while any of the twelve resolves to "the
default covers it" — the twelve do not exist until written.
*Evidence:* a twenty-row inventory, each row naming either the untouched default or the written control's
location.
*Obligation:* the design MUST leave the eight safe defaults intact and write every applicable one of the
twelve positive controls, treating the two as distinct kinds of work.
*Trace:* `DESK-CHECK-21`

#### `DESK-SCENARIO-32` — An unexpected frame sends a privileged message

*Primary type:* **Negative** — an invalid caller expecting safe rejection.
*Coverage-role:* `negative` (exercises rejection of an unauthorized sender with no privileged side effect).
*Given* a privileged handler reachable from any web frame, including an iframe or a child window.
*When* an unexpected frame sends a well-formed message. *Then* the handler verifies the sending frame and
refuses before any privileged effect, and no state changes.
*Failure oracle:* a privileged effect observable after a message from a frame the run did not intend to
authorize; context isolation does not prevent the send.
*Evidence:* send the message from an unintended frame and observe the privileged sink for any effect; the
sink, not the handler's return value, is the oracle.
*Obligation:* the design MUST verify the sending frame before any privileged effect, in the handler itself,
and MUST NOT rely on context isolation to prevent an unexpected sender.
*Trace:* `DESK-CHECK-19`

#### `DESK-SCENARIO-33` — The archive-integrity fuses are enabled singly

*Primary type:* **Boundary** — it sits at the exact configuration transition where one fuse of a pair is
set. *Coverage-role:* `boundary` (exercises the exact paired-fuse boundary).
*Given* a build with archive integrity validation enabled and the archive-only load path left disabled.
*When* the artifact runs. *Then* validated code is verified and unvalidated code can still load from outside
the archive — the path the pairing exists to close.
*Failure oracle:* a build whose fuse configuration sets one of the two without the other.
*Evidence:* read the built artifact's fuse configuration and confirm both are set, or that neither is and
the reason is recorded.
*Obligation:* the design MUST set the two archive fuses as a pair, because integrity validation without an
archive-only load path leaves unvalidated code loadable.
*Trace:* `DESK-CHECK-22`

#### `DESK-SCENARIO-34` — A secret in the bundle defended as protected

*Primary type:* **Adversarial** — a cosmetically compliant artifact claims a property it does not have.
*Coverage-role:* `adversarial` (attacks the packaging-as-boundary assumption).
*Given* a credential placed inside the packaged archive. *When* the run defends it as protected because the
archive conceals source and the build is minified. *Then* the claim fails: the archive is read-only,
conceals source from cursory inspection only, and some interfaces extract silently to a temporary directory.
*Failure oracle:* any credential recoverable from the shipped artifact by unpacking it; effort is not a
security property.
*Evidence:* unpack the shipped artifact and search it for the credential; recovery of the value is the
failure.
*Obligation:* the design MUST NOT treat packaging, minification, or the archive as a security boundary, and
MUST NOT place a secret in the shipped artifact.
*Trace:* `DESK-CHECK-21`

#### `DESK-SCENARIO-35` — An unlisted clause reaches an unrecoverable consequence

*Primary type:* **Adversarial** — every listed member passes while the property is violated elsewhere.
*Coverage-role:* `adversarial` (attacks the floor through the gap between the member list and the run's own
clause inventory).
*Given* a run where all nine listed safety members pass. *When* a tray-menu action empties the capture cache
with no confirmation and no recovery route — a tenth clause the list does not name. *Then* the floor fails,
because that clause is a member **by the property**, and a longer list would not have caught it either.
*Failure oracle:* a floor reported as passing on a member-by-member roll-up while any clause of the run
permits an unforeseeable, unrefusable, or unrecoverable consequence.
*Evidence:* sweep the run's own clause inventory — every rule, phase step, channel, native integration, data
operation, and release control it actually contains — and disposition each as foreseeable, refusable,
recoverable, or handled.
*Obligation:* the design MUST hold each floor as a property over the run's own clause inventory, and MUST
NOT accept a member roll-up as the property check's evidence.
*Trace:* `DESK-CHECK-12`

#### `DESK-SCENARIO-36` — The hardening-versus-testability decision is recorded with one horn

*Primary type:* **Change / regression** — it compares the build's properties before and after the decision.
*Coverage-role:* `change/regression` (exercises the decision's effect on what the shipped artifact is).
*Given* two first-party sources in direct conflict over one runtime-inspection fuse, with no documented
reconciliation. *When* the run records its build-matrix decision. *Then* both horns are stated with their
consequences, the user decides, and the chosen horn's consequence is carried forward as a stated
verification limit.
*Failure oracle:* a build matrix recorded with one option and no statement of what the other would have
bought; or an automated suite reported as covering the shipped artifact when it exercises a differently
fused build.
*Evidence:* read the recorded decision for both horns and for the named verification limit; then compare the
fuse configuration of the tested build against the shipped one.
*Obligation:* the design MUST present the hardening-versus-testability conflict as a user decision with both
horns named, and MUST carry the chosen horn's consequence as a stated verification limit.
*Trace:* `DESK-CHECK-22`

### `DESK-FAMILY-08` — The accessibility union, assistive technology, and locale

*Declared primary category:* **8 Inclusion / locale** — the defining discrimination is an access need, input
method, language, or locale. *Secondary tags:* 2 Actors, 10 Evidence. *Applicability:* unconditional and
non-waivable. *Priority:* highest.

*Actor:* a person using any applicable modality. *Outcome:* every required action, state, and meaning
available through every applicable modality. *Invariant:* no identity choice, platform convention, aesthetic
decision, or component library reduces that availability.

#### `DESK-SCENARIO-37` — Every required action, state, and meaning is available

*Primary type:* **Positive** — the ordinary valid path of a run holding the floor.
*Coverage-role:* `positive` (exercises the floor's property holding across the modality set).
*Given* the run's own inventory of required actions, states, and meanings. *When* the floor is resolved.
*Then* each one is available through every modality the outcome's surfaces actually require, with direct
behavioral results per claimed system rather than a member-by-member roll-up.
*Failure oracle:* a required action reachable through only one modality; or a state whose meaning is carried
by color alone.
*Evidence:* sweep the action, state, and meaning inventory against the required modality set, recording a
direct behavioral result for each pairing.
*Obligation:* the design MUST hold the accessibility floor as a property across at least the complete named
union, evidenced by a sweep of the run's own inventory rather than by a member roll-up.
*Trace:* `DESK-CHECK-09`

#### `DESK-SCENARIO-38` — An alternative-valid modality: keyboard-only operation

*Primary type:* **Alternative-valid** — a materially different valid input method, not a second happy path.
*Coverage-role:* `alternative-valid` (exercises a distinct valid input modality end to end).
*Given* the same required actions. *When* they are performed with the keyboard alone. *Then* every one is
reachable, focus order follows the reading order, the focused element is visibly identifiable at all times,
and no action requires a pointer.
*Failure oracle:* an action reachable only by pointer; or a focus position that becomes invisible during a
transition.
*Evidence:* perform each required action keyboard-only on each claimed system, recording focus visibility
throughout.
*Obligation:* the design MUST make every required action operable through each applicable input alternative,
with focus flow and focus visibility preserved.
*Trace:* `DESK-CHECK-09`

#### `DESK-SCENARIO-39` — Assistive-technology parity claimed across three systems

*Primary type:* **Negative** — an unsupported claim expecting refusal.
*Coverage-role:* `negative` (exercises rejection of an unevidenced per-system claim).
*Given* platform documentation that names a screen reader for two systems and none for the third. *When* the
run claims assistive-technology support on all three. *Then* the claim on the third is refused, because it
rests on documentation that does not exist, and the run states what evidence it actually has instead.
*Failure oracle:* a support claim covering a system for which neither platform guidance nor the run's own
testing supplies evidence.
*Evidence:* read the per-system evidence record; a claimed system with no named screen reader and no
recorded direct testing cannot carry the claim.
*Obligation:* the design MUST state the assistive-technology gap for the system with no platform guidance
rather than implying parity, and MUST support any per-system claim with that system's own evidence.
*Trace:* `DESK-CHECK-09`, `DESK-CHECK-10`

#### `DESK-SCENARIO-40` — Reduced motion is read from the theme interface

*Primary type:* **Boundary** — it sits at the exact boundary of what the theme interface exposes.
*Coverage-role:* `boundary` (exercises the exact edge of the interface's signal set).
*Given* a theme interface exposing high-contrast, inverted-scheme, reduced-transparency, and
differentiate-without-color signals, and **no** reduced-motion signal. *When* the run looks there for
reduced motion. *Then* it finds nothing — and the correct source is the renderer's own reduced-motion media
query, not an invented theme property and not the conclusion that the signal is unavailable.
*Failure oracle:* animation continuing at full motion for a person who has set the system preference; or a
run that concludes reduced motion cannot be honored because the theme interface lacks it.
*Evidence:* set the system reduced-motion preference and observe the rendered motion; and read the source
for where the signal is obtained.
*Obligation:* the design MUST honor reduced motion from the renderer's own media query, because the theme
interface exposes no such property, and MUST NOT treat that absence as the signal being unavailable.
*Trace:* `DESK-CHECK-09`

#### `DESK-SCENARIO-41` — A member roll-up offered as the property check's evidence

*Primary type:* **Adversarial** — a cosmetically complete floor resolution attempts to close the property
check. *Coverage-role:* `adversarial` (attacks the property check's own pass condition).
*Given* a floor whose every listed member passes. *When* the run offers "all members passed" as the property
check's evidence. *Then* the property check is not satisfied, because its claim is the property itself and
its evidence is the inventory sweep — which is what would catch a modality loss no member names.
*Failure oracle:* a property check resolved with a member-count roll-up and no inventory sweep recorded.
*Evidence:* read the property check's recorded evidence; it must be the sweep of the run's own inventory,
not a summary of the member results.
*Obligation:* the design MUST make each floor's property check explicitly unsatisfiable by a member
roll-up, requiring the inventory sweep as its evidence.
*Trace:* `DESK-CHECK-10`

### `DESK-FAMILY-09` — Release irreversibility, signing, and the update chain

*Declared primary category:* **9 Change / compatibility / reversibility** — the defining discrimination is a
version or lifecycle change event. *Secondary tags:* 6 Failure/recovery, 7 Trust. *Applicability:*
unconditional. *Priority:* high — this family's failures are the ones that cannot be undone.

*Actor:* the person with an installed copy. *Outcome:* a signed, installable, update-rehearsed release per
claimed system. *Invariant:* a shipped version cannot be recalled.

#### `DESK-SCENARIO-42` — The four release gates each pass per claimed system

*Primary type:* **Positive** — the ordinary valid path of a complete release chain.
*Coverage-role:* `positive` (exercises the whole chain succeeding per system).
*Given* a run claiming more than one operating system. *When* release readiness is assessed. *Then* each
claimed system has its own installer produced, its own clean-environment install and smoke test, its own
signature and notarization verification on the real artifact, and its own rehearsed update — four results
per system, not four results total.
*Failure oracle:* a release-readiness table with fewer rows than claimed systems; or one system's result
presented as covering another.
*Evidence:* read the release matrix; every claimed system carries all four results, each naming the artifact
it was run against.
*Obligation:* the design MUST prove the packaged, installed, signed, and updated gates per claimed operating
system, and MUST NOT let one system's result support another's claim.
*Trace:* `DESK-CHECK-27`, `DESK-CHECK-28`, `DESK-CHECK-29`, `DESK-CHECK-30`

#### `DESK-SCENARIO-43` — A deferred capability named with a path

*Primary type:* **Negative** — an invalid forward reference expecting rejection.
*Coverage-role:* `negative` (exercises rejection of a dangling-but-resolving pointer).
*Given* a capability that is planned and absent today. *When* it is mentioned. *Then* the mention is prose
only — no path, no link, no path-shaped code span — and states that nothing here loads or requires it.
*Failure oracle:* a link or path naming a capability that does not exist; a pointer that resolves to
something is worse than one that visibly breaks, because nothing flags it.
*Evidence:* scan every forward mention for a path, link, or path-shaped span; any occurrence fails.
*Obligation:* the design MUST state a planned-but-absent capability as prose only, with no path, link, or
load target.
*Trace:* `DESK-CHECK-35`

#### `DESK-SCENARIO-44` — A version at the edge of the supported-old-version window

*Primary type:* **Boundary** — it sits at the exact edge of the stated support window.
*Coverage-role:* `boundary` (exercises the exact oldest-supported version and the one below it).
*Given* a stated supported-old-version window. *When* an installed copy at the oldest supported version, and
another one release older, each attempt to update and to read current data. *Then* the version at the edge
is supported as stated, and the one below it receives the stated out-of-window behavior — told, blocked, or
left alone — rather than an unhandled failure.
*Failure oracle:* an out-of-window version that fails in an unstated way; or a window stated without a
defined behavior for what falls outside it.
*Evidence:* run the update and data-read paths from the oldest supported version and from one below it, and
compare each against the stated behavior.
*Obligation:* the design MUST state a supported-old-version window and the behavior for versions outside it,
and MUST prove both the edge and the case beyond it.
*Trace:* `DESK-CHECK-31`

#### `DESK-SCENARIO-45` — Signing is deferred and dependent behavior is proved on an unsigned build

*Primary type:* **Failure / recovery** — a missing precondition surfaces late, and the recovery is a re-run.
*Coverage-role:* `failure/recovery` (exercises detection of an invalid proof and its correction).
*Given* a run that proves notification behavior and update behavior against an unsigned development build.
*When* signing is applied at the end. *Then* both proofs are invalid on the system that requires signing for
each, and both must be re-run against the signed artifact.
*Failure oracle:* a notification or update claim whose evidence names a development build on a system where
signing is a precondition for that behavior.
*Evidence:* read each claim's evidence for the artifact it was obtained from; a development build cannot
support a claim whose precondition is a signature.
*Obligation:* the design MUST obtain evidence for signature-dependent behavior from the signed artifact, and
MUST NOT carry forward a proof taken on a build that could not exhibit the behavior.
*Trace:* `DESK-CHECK-29`, `DESK-CHECK-30`

#### `DESK-SCENARIO-46` — Three-platform automatic updating claimed through the built-in updater

*Primary type:* **Adversarial** — a plausible release claim that the platform does not support.
*Coverage-role:* `adversarial` (attacks the release claim with the platform's own asymmetry).
*Given* three claimed operating systems. *When* the run states that all three update automatically through
the built-in updater. *Then* the claim is false: one of the three has no built-in updater at all, and its
updates go through the system's own package manager.
*Failure oracle:* a release plan whose update row is identical across three systems; the per-system update
mechanism is not uniform.
*Evidence:* read the update row per claimed system against the platform's documented per-system mechanism;
a uniform claim across all three is the failure.
*Obligation:* the design MUST state the update path per claimed operating system, and MUST NOT claim
built-in automatic updating for the system that has none.
*Trace:* `DESK-CHECK-27`, `DESK-CHECK-30`

#### `DESK-SCENARIO-47` — A rehearsed update from a fresh install rather than the previous release

*Primary type:* **Change / regression** — it compares the two candidate baselines for the same gate.
*Coverage-role:* `change/regression` (exercises the version-transition the fresh path never crosses).
*Given* an update-rehearsal gate. *When* the rehearsal is run from a fresh install of the new version rather
than from the previously released one. *Then* the gate has proved first-time installation and not the update
path — a different claim, and the one nearly every user will not take.
*Failure oracle:* an update-rehearsal record whose starting state is a clean machine rather than the
previous release; migration defects live in the transition the fresh path skips.
*Evidence:* read the rehearsal record's starting version; it must name the previously released version.
*Obligation:* the design MUST rehearse the update from the previously released version, because a fresh
install proves a different claim and never crosses the data transition.
*Trace:* `DESK-CHECK-30`

### `DESK-FAMILY-10` — The rung register, the claim ledger, and the trace proof

*Declared primary category:* **10 Evidence / traceability / clarity** — the defining discrimination is
whether a source, proof, or trace is followable by a cold reader. *Secondary tags:* 1 Purpose, 2 Actors.
*Applicability:* unconditional. *Priority:* high — this family is what makes every other family's result
readable.

*Actor:* a cold reader, and an evaluator. *Outcome:* a record another operator can act on with no hidden
session context. *Invariant:* a decision recorded is not a property proved.

#### `DESK-SCENARIO-48` — Nine rung rows, each substantiated by its own kind's conditions

*Primary type:* **Positive** — the ordinary valid path of a complete rung register. All three resolution
kinds are exercised within this one case, which is why no alternative-valid case is separately required.
*Coverage-role:* `positive` (exercises a complete and substantiated register).
*Given* a run that has walked all nine rungs. *When* the register is read. *Then* every row carries one of
the three resolution kinds and evidence that satisfies **that kind's** own conditions — a produced artifact
resolving to substantive content answering the rung's own question, a citation meeting all five citation
conditions, or a proved inapplicability naming a property with its inspected evidence and its falsifying
observation.
*Failure oracle:* a row whose kind is recorded and whose evidence satisfies a different kind's conditions;
or a row closed on a coverage property such as an owner, a plan, or a sign-off.
*Evidence:* read each of the nine rows against the conditions its own recorded kind imposes.
*Obligation:* the design MUST record one of three resolution kinds per rung and MUST substantiate it against
that kind's own conditions, with no coverage property closing acceptance.
*Trace:* `DESK-CHECK-07`

#### `DESK-SCENARIO-49` — A hollow pointer in an otherwise complete register

*Primary type:* **Negative** — an invalid resolution presented in valid form.
*Coverage-role:* `negative` (exercises rejection of a structurally complete but substantively empty row).
*Given* all nine rows present with a resolution kind recorded on each. *When* one row's pointer resolves to
an empty file, a heading-only outline, or a placeholder. *Then* that row fails: the condition is what the
inspection **found**, so a valid path to an empty artifact is not a resolution.
*Failure oracle:* a register that passes a completeness count while one pointer opens to nothing; a valid
file can still be the wrong content.
*Evidence:* open every pointer in the register and read what it contains, rather than confirming it
resolves.
*Obligation:* the design MUST require a resolution's named evidence to resolve to substantive content
answering the rung's own question, not merely to a valid path.
*Trace:* `DESK-CHECK-07`

#### `DESK-SCENARIO-50` — A design record with headings and no resolved content

*Primary type:* **Boundary** — it sits at the exact transition between an outlined record and a resolved
one. *Coverage-role:* `boundary` (exercises the exact completeness edge of the record).
*Given* a design record containing every required section heading. *When* completeness is assessed. *Then* a
heading with no resolved content does not satisfy the record obligation, and each required element — the
rung register, the three-axis statements, the four floor resolutions with their property checks, the
participant records, the locked contract, the claim-owner matrix, and the run's own gap register — is
present with content.
*Failure oracle:* a record whose section count is complete and whose sections are empty.
*Evidence:* read each required section for resolved content rather than for its heading.
*Obligation:* the design MUST require the design record's each required element to carry resolved content,
because a heading alone does not satisfy the obligation.
*Trace:* `DESK-CHECK-33`

#### `DESK-SCENARIO-51` — A waiver token on a protected floor

*Primary type:* **Adversarial** — a legitimate mechanism is applied where it is invalid.
*Coverage-role:* `adversarial` (attacks the non-waivability of the four floors).
*Given* a run with an authorized waiver mechanism available for operational gates. *When* the token is
applied to an item bearing on one of the four floors. *Then* the token is invalid there: it closes neither
coverage nor acceptance, and the item resolves through a permitted terminal or fails.
*Failure oracle:* a floor-bearing item resolved by a waiver token and counted toward either coverage or
acceptance.
*Evidence:* read every waiver-token use against the item's protected status; any token on a floor-bearing
item fails both gates.
*Obligation:* the design MUST make a waiver token invalid on all four protected floors, closing neither
coverage nor acceptance there.
*Trace:* `DESK-CHECK-17`

#### `DESK-SCENARIO-52` — Nine claims merged into one release status

*Primary type:* **Adversarial** — a green summary is offered in place of separate claims.
*Coverage-role:* `adversarial` (attacks the claim-separation invariant with a plausible aggregate).
*Given* design acceptance, implementation correctness, packaged-artifact evidence, signature and
notarization evidence, update-rehearsal evidence, per-system evidence, release readiness, release authority,
and post-release outcome. *When* they are reported as one tested status. *Then* the report fails, because
each proves a different thing and the merge hides which one is missing.
*Failure oracle:* a release report with one overall status and no per-claim rows; or an unrunnable gate
widened into a weaker signal supporting the claim it could not prove.
*Evidence:* read the claim ledger for nine separate rows, each with its own evidence class, owner, and
per-system scope, and each unrunnable gate recorded as a limitation that blocks its claim.
*Obligation:* the design MUST report each evidence class as a distinct claim with its own scope, and MUST
record an unrunnable gate as a limitation blocking its claim rather than as a weaker signal.
*Trace:* `DESK-CHECK-32`

#### `DESK-SCENARIO-53` — A green relation test offered as a complete trace proof

*Primary type:* **Counterfactual** — it inverts the premise that a passing mechanical gate proves the whole
trace. *Coverage-role:* `counterfactual` (inverts the verifier-completeness premise and requires the named
disconfirmation).
*Given* four projections whose edge sets agree exactly, so the relation test exits zero. *When* that result
is offered as proof the trace is sound. *Then* it is not: the relation test proves routing, and a
correctly-routed check whose pass wording dropped a named primitive from the obligation it carries passes it
unchanged. The obligation test is a separate, review-proved gate, and an unrecorded case is an unrun test.
*Failure oracle:* a trace proof citing only the relation test's exit code; or an obligation-test result
recorded per file rather than per case, or with no reviewer identity.
*Evidence:* read the recorded obligation-test result per selected case, with the reviewer's identity, across
every mapped check for a case with more than one; and confirm the verifier's own output states which legs
are script-proved and which is review-proved.
*Obligation:* the design MUST prove the trace with both the mechanical relation test and the review-proved
obligation test, recording the second per case with the reviewer's identity, and MUST NOT present a green
relation test as a complete trace proof.
*Trace:* `DESK-CHECK-34`

#### `DESK-SCENARIO-55` — A human-outcome claim with no participant record behind it

*Primary type:* **Adversarial** — a complete-looking claim set conceals one claim nothing supports.
*Coverage-role:* `adversarial` (attacks the direct-evidence floor through the run's own claim inventory).
*Given* a run whose participant records cover the claimed systems and whose floor members all pass.
*When* the design record additionally asserts that people can recover from a particular error state — a
claim no participant record covers, on any system. *Then* the property check fails, because its evidence is
a sweep of the run's **own claim inventory** mapping every claim about what a person can perceive,
understand, operate, complete, or recover from to the participant record and the operating system that
supports it.
*Failure oracle:* a human-outcome claim in the record with no participant record behind it; or a claim
supported by evidence gathered on a different operating system than the claim is about.
*Evidence:* enumerate every claim about human capability in the design record and map each to its
supporting participant record and system; an unmapped claim is removed or restated as context, and a
member-by-member roll-up does not satisfy this check.
*Obligation:* the design MUST support every human-outcome claim with direct representative-user evidence
from this run's own artifacts on the operating system the claim is about, removing or restating any
unsupported claim as context.
*Trace:* `DESK-CHECK-16`

## Obligation-to-check reservation

Every case's obligation and the check identifier it reserves. This table is the **forward** direction of the
trace — policy and case to check — and it is generated from the `Trace:` fields above rather than maintained
beside them, so the two cannot drift apart.

**No case in this set is exploratory**, so all fifty-five carry an obligation and appear here. An exploratory
case would be exempt from the obligation trace only while explicitly marked as one, and the exemption would
end the moment it became an approved constraint.

**The reserved ranges, and the extension this set required.** The design fixes four pause points and reserves
thirty-four check slots across them. This set reserves **thirty-six**, because the four protected floors each
need a member check *and* a property check — eight slots where the original allocation left room for fewer —
and the protected-waiver table needs its own. The extension follows the rule the design states: the range
grows at its own pause point's tail and every later range shifts. [`checklists.md`](checklists.md) records
the final ranges once, as their owner.

| Pause point | Reserved range | Confirms |
|---|---|---|
| `DESK-PAUSE-1` — stack and outcome lock | `01`–`05` | outcome, boundary, stack-fit result, ownership statement, gate-authority map |
| `DESK-PAUSE-2` — design acceptance | `06`–`17`, with **`06` reserved for the structural-approval check** | the structural-approval decision, the rung register, and all four floors on both their member and property checks |
| `DESK-PAUSE-3` — implementation completion | `18`–`26` | the privilege boundary, security posture, platform obligations, local data, and in-scope paths |
| `DESK-PAUSE-4` — release-readiness handoff | `27`–`36` | every applicable release gate per claimed system, the design record, and the trace and verifier proofs |

`DESK-CHECK-06` is pinned by the design rather than chosen here: the restored structural-approval gate
requires a reserved check, and it sits at the head of its pause point's range because it is the earliest item
that pause point confirms. Every other number is this author's allocation. What binds is not a range width
but the crosswalk [`evaluation.md`](evaluation.md) owns — every live rule and prohibition reaching at least
one check cluster.

| Case | The obligation it proves | Reserves | Confirmed at |
|---|---|---|---|
| `DESK-SCENARIO-01` | The outcome, the boundary, and the ownership statement are locked together | `DESK-CHECK-01`, `DESK-CHECK-03` | `DESK-PAUSE-1` |
| `DESK-SCENARIO-02` | An alternative-valid framing: an existing application rather than a new one | `DESK-CHECK-01`, `DESK-CHECK-25` | `DESK-PAUSE-1`, `DESK-PAUSE-3` |
| `DESK-SCENARIO-03` | A packaged artifact offered as a finished outcome | `DESK-CHECK-25` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-04` | Continued work offered as gate approval | `DESK-CHECK-04`, `DESK-CHECK-36` | `DESK-PAUSE-1`, `DESK-PAUSE-4` |
| `DESK-SCENARIO-05` | The stack-fit premise is inverted: a criterion fires | `DESK-CHECK-02` | `DESK-PAUSE-1` |
| `DESK-SCENARIO-06` | Participant conditions in place before the first activity | `DESK-CHECK-13` | `DESK-PAUSE-2` |
| `DESK-SCENARIO-07` | An alternative-valid participant route: cited prior research | `DESK-CHECK-07` | `DESK-PAUSE-2` |
| `DESK-SCENARIO-08` | Acceptance sought without direct evidence from representative people | `DESK-CHECK-15` | `DESK-PAUSE-2` |
| `DESK-SCENARIO-09` | The structural skeleton is approved before any visual rung begins | `DESK-CHECK-06` | `DESK-PAUSE-2` |
| `DESK-SCENARIO-10` | A required participant condition is missing | `DESK-CHECK-13` | `DESK-PAUSE-2` |
| `DESK-SCENARIO-11` | An unlisted participant activity whose observations are cited | `DESK-CHECK-14` | `DESK-PAUSE-2` |
| `DESK-SCENARIO-54` | The ladder's own method order, and three axes stated per visual artifact | `DESK-CHECK-08` | `DESK-PAUSE-2` |
| `DESK-SCENARIO-12` | First paint uses both mechanisms | `DESK-CHECK-23` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-13` | A downgrade rewrites newer data into an older shape | `DESK-CHECK-24` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-14` | A monitor disappears between sessions | `DESK-CHECK-23` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-15` | A local write is interrupted | `DESK-CHECK-24` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-16` | A second instance's arguments are read by position | `DESK-CHECK-23`, `DESK-CHECK-11` | `DESK-PAUSE-2`, `DESK-PAUSE-3` |
| `DESK-SCENARIO-17` | A schema change ships and the previous version is still installed | `DESK-CHECK-24`, `DESK-CHECK-31` | `DESK-PAUSE-3`, `DESK-PAUSE-4` |
| `DESK-SCENARIO-18` | Every channel carries its type, its validation, and its sender rule | `DESK-CHECK-19`, `DESK-CHECK-18` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-19` | The renderer target includes the runtime's ambient types | `DESK-CHECK-18` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-20` | A port closes when nothing named its lifetime | `DESK-CHECK-20` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-21` | A class instance is sent across the bridge | `DESK-CHECK-18`, `DESK-CHECK-19` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-22` | The three-target split is taught as documented fact | `DESK-CHECK-18` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-23` | A startup measurement names its platform version | `DESK-CHECK-26`, `DESK-CHECK-05` | `DESK-PAUSE-1`, `DESK-PAUSE-3` |
| `DESK-SCENARIO-24` | A synchronous read runs in the privileged process | `DESK-CHECK-26` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-25` | An unqualified number is offered as an improvement | `DESK-CHECK-26`, `DESK-CHECK-05` | `DESK-PAUSE-1`, `DESK-PAUSE-3` |
| `DESK-SCENARIO-26` | The footprint premise is inverted | `DESK-CHECK-02` | `DESK-PAUSE-1` |
| `DESK-SCENARIO-27` | An update install flushes live work first | `DESK-CHECK-30` | `DESK-PAUSE-4` |
| `DESK-SCENARIO-28` | A corrupt data file is opened | `DESK-CHECK-24` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-29` | An update fails partway | `DESK-CHECK-30` | `DESK-PAUSE-4` |
| `DESK-SCENARIO-30` | The install races a live write with no pre-quit handling | `DESK-CHECK-30`, `DESK-CHECK-20` | `DESK-PAUSE-3`, `DESK-PAUSE-4` |
| `DESK-SCENARIO-31` | Both kinds of security work are complete | `DESK-CHECK-21` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-32` | An unexpected frame sends a privileged message | `DESK-CHECK-19` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-33` | The archive-integrity fuses are enabled singly | `DESK-CHECK-22` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-34` | A secret in the bundle defended as protected | `DESK-CHECK-21` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-35` | An unlisted clause reaches an unrecoverable consequence | `DESK-CHECK-12` | `DESK-PAUSE-2` |
| `DESK-SCENARIO-36` | The hardening-versus-testability decision is recorded with one horn | `DESK-CHECK-22` | `DESK-PAUSE-3` |
| `DESK-SCENARIO-37` | Every required action, state, and meaning is available | `DESK-CHECK-09` | `DESK-PAUSE-2` |
| `DESK-SCENARIO-38` | An alternative-valid modality: keyboard-only operation | `DESK-CHECK-09` | `DESK-PAUSE-2` |
| `DESK-SCENARIO-39` | Assistive-technology parity claimed across three systems | `DESK-CHECK-09`, `DESK-CHECK-10` | `DESK-PAUSE-2` |
| `DESK-SCENARIO-40` | Reduced motion is read from the theme interface | `DESK-CHECK-09` | `DESK-PAUSE-2` |
| `DESK-SCENARIO-41` | A member roll-up offered as the property check's evidence | `DESK-CHECK-10` | `DESK-PAUSE-2` |
| `DESK-SCENARIO-42` | The four release gates each pass per claimed system | `DESK-CHECK-27`, `DESK-CHECK-28`, `DESK-CHECK-29`, `DESK-CHECK-30` | `DESK-PAUSE-4` |
| `DESK-SCENARIO-43` | A deferred capability named with a path | `DESK-CHECK-35` | `DESK-PAUSE-4` |
| `DESK-SCENARIO-44` | A version at the edge of the supported-old-version window | `DESK-CHECK-31` | `DESK-PAUSE-4` |
| `DESK-SCENARIO-45` | Signing is deferred and dependent behavior is proved on an unsigned build | `DESK-CHECK-29`, `DESK-CHECK-30` | `DESK-PAUSE-4` |
| `DESK-SCENARIO-46` | Three-platform automatic updating claimed through the built-in updater | `DESK-CHECK-27`, `DESK-CHECK-30` | `DESK-PAUSE-4` |
| `DESK-SCENARIO-47` | A rehearsed update from a fresh install rather than the previous release | `DESK-CHECK-30` | `DESK-PAUSE-4` |
| `DESK-SCENARIO-48` | Nine rung rows, each substantiated by its own kind's conditions | `DESK-CHECK-07` | `DESK-PAUSE-2` |
| `DESK-SCENARIO-49` | A hollow pointer in an otherwise complete register | `DESK-CHECK-07` | `DESK-PAUSE-2` |
| `DESK-SCENARIO-50` | A design record with headings and no resolved content | `DESK-CHECK-33` | `DESK-PAUSE-4` |
| `DESK-SCENARIO-51` | A waiver token on a protected floor | `DESK-CHECK-17` | `DESK-PAUSE-2` |
| `DESK-SCENARIO-52` | Nine claims merged into one release status | `DESK-CHECK-32` | `DESK-PAUSE-4` |
| `DESK-SCENARIO-53` | A green relation test offered as a complete trace proof | `DESK-CHECK-34` | `DESK-PAUSE-4` |
| `DESK-SCENARIO-55` | A human-outcome claim with no participant record behind it | `DESK-CHECK-16` | `DESK-PAUSE-2` |
