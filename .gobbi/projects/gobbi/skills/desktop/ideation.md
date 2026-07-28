# Desktop Run Ideation

Run the user-decision tree for one desktop run, including which ladder rungs apply and which are proved
inapplicable. Policy lives in [`SKILL.md`](SKILL.md); rung definitions live in
[`fidelity-ladder.md`](fidelity-ladder.md). This companion adds no policy.

Twenty decision axes, `D0` through `D19`, walked in dependency order. Eight of them stop for an explicit user
decision at a named gate. The gate set and its fire order are fixed by `DESK-R27` and are not this file's to
change; what this file owns is where in the interview each one fires, what evidence is on the table when it
does, and what the run records afterward.

Load this file at `P1` and keep it open across `P1` through `P6`. The tree is not one sitting: the early axes
run before any rung, the middle axes run inside the ladder, and the late axes run once the contract is locked.
An axis may be re-entered whenever later evidence contradicts it.

## Interview conduct

1. Walk `D0`–`D19` in dependency order and discuss one axis per turn. An axis that depends on an unanswered
   earlier axis waits.
2. Inspect the repository, the running application if one exists, and the platform's own documentation before
   asking. Show the verified fact and ask the user to confirm or correct it. An interview that opens with a
   question the evidence already answers spends the user's attention on the wrong thing.
3. Treat each axis's prompts as a bank, not a questionnaire. Ask only what current evidence does not settle
   and what can still change this run's outcome, boundary, design, contract, proof, or release controls.
4. Skipping an axis is governed by [`discussion`](../discussion/SKILL.md), which owns the smart-skip rule. Its
   local application here: an axis is skipped only when current evidence answers it **and** the user has
   already locked that answer for this run, and both facts are recorded. Skipping an axis is not the same as
   proving a rung inapplicable — that is a rung resolution, and `SKILL.md` owns its conditions.
5. Research current authoritative external evidence before any design-bearing recommendation. Present the
   material options, recommend one, and name the evidence that would change the recommendation.
6. Mark every answer `confirmed`, `assumption`, `recorded-open:<owner + method>`, or `contradicted`. Push a
   vague or contradicted answer twice with a concrete example or counterexample, then record it open.
7. Reopen the earliest owning axis when later evidence contradicts it. Re-entry is normal. Repairing a wrong
   scope, design, or trust premise downstream instead of at its owning axis is not.
8. Keep stakeholder decisions, representative-user observations, platform-documentation facts, and forecasts
   as separate entries. They are different evidence classes, and `DESK-R25` forbids merging them.
9. Every question card follows the [`discussion`](../discussion/SKILL.md) shape. That skill owns card
   semantics, the twice-probe limit, and the prohibition on soft agreement.

## Decision record

Each axis records six fields, and a gate axis records two more.

| Field | What it holds |
|---|---|
| Evidence | what was inspected and what it showed, with the source named |
| Options | the material alternatives that existed, including the one not taken |
| Recommendation | the agent's position and the evidence behind it |
| Decision | the user's answer, in the user's own terms |
| Effects | what this answer binds downstream — which axes, phases, rungs, or files it constrains |
| Reopen condition | the observation that would return the run to this axis |
| **Gate** | the `DESK-G` identifier, for a gate axis only |
| **Authority** | who holds the decision, for a gate axis only |

The record is part of the design record `DESK-R29` requires; that rule owns its required content, and the
active project owns its path. A gate axis carrying a recommendation and no decision is an unfired gate, and
`DESK-R27` makes continuing past one a failure — silence is not approval.

## The dependency-ordered decision tree

### `D0` — Current reality, trigger, and authority

Inspect what exists: the application if there is one, its process split, its build and release configuration,
its data locations, its supported platforms, and its test setup.

- What concrete event triggered this work?
- What runs today, and which claim about it is supported by inspected evidence rather than by report?
- Who holds product, design, security, data, and release authority?
- Which shipped versions and installed users make a change expensive to reverse?

**Close with:** the current-reality register, the trigger, the authority map, and the reversibility
constraints.

*Trace:* `DESK-R01` for the authority map; `DESK-R24`, because installed users are why release is
irreversible.

### `D1` — One desktop outcome and its completion evidence

- Which actor reaches what observable result, from which trigger and which entry mode?
- What visible signal and what system signal jointly prove completion?
- What could look finished while the required state or effect is absent?
- Which entry modes exist — launcher, file association, deep link, second instance, auto-start, tray?

Lock one sentence: "When `<trigger>` occurs, `<actor>` can `<bounded outcome>` on `<claimed systems>`,
evidenced by `<visible signal>` and `<system signal>`."

**Close with:** the locked outcome sentence, the completion and false-completion signals, and the entry-mode
list.

*Trace:* `DESK-R01`; `DESK-N01`, the false-completion prohibition this axis exists to pre-empt.

### `D2` — Claimed operating systems and the scope boundary

Every later axis reads the claim set. A system claimed here needs its own acceptance evidence, its own
installer, its own signing story, and its own conformance work.

- Which operating systems does this outcome claim? Which are explicitly out of the claim set?
- Which paths, states, failures, and recovery routes are necessary to the outcome?
- Which neighbouring outcomes merely share a window, a channel, a data file, or a build?
- Which existing behaviour must not change?

A system nobody will test on is not a claim; it is a wish. Record it out of the claim set rather than carrying
it silently.

**Close with:** the claimed-system set, the in-scope list, the explicit non-goals, and the handoffs.

*Trace:* `DESK-R01` for the claimed systems; `DESK-R02` for the boundary.

### `D3` — Stack fit — the six-criterion wrong-choice test

Run the six-criterion test `DESK-R03` owns and record the **inspected result of each criterion**, not a
summary verdict. Each criterion is answered from this outcome's own stated requirements: a size or footprint
requirement the product actually states, a Linux claim actually made at `D2`, an engine-upgrade cadence the
team has actually agreed to sustain, a remote or user-supplied content source actually loaded, a native
integration actually central to the product, and an architecture actually claimed past its stated end of life.

A positive result on any one criterion is a stack decision for the user. It is not a reason to proceed
carefully.

> **Gate `DESK-G1` — stack fit.** Fires when any criterion is positive. Present the criterion, the mechanism
> that makes it decisive, and the alternative that criterion points at. The user decides whether to continue
> on this stack, change stacks, or stop. Where no criterion fires, record `DESK-G1` as **not triggered** —
> that is a recorded result, not a skipped gate.

**Close with:** the six-row result table with an inspected result per criterion, and the `DESK-G1` decision or
its not-triggered record.

*Trace:* `DESK-R03`; `DESK-R27` for the gate authority.

### `D4` — Design ownership and the co-load boundary

- Does the user expect a separate generic interface or experience review to hold acceptance authority here?
- Which design decisions has the project already made that this run inherits rather than reopens?

This skill is the sole design owner for desktop work and holds the acceptance gate. State that plainly, so a
user expecting a second design authority learns it now rather than at the design-acceptance gate.

**Close with:** the ownership statement, the inherited design decisions, and any conflict with a project
convention.

*Trace:* `DESK-R04`.

### `D5` — Participants, consent, and evidence conditions

This axis runs **before any rung**, because six rungs involve people and the participant floor fails closed.

- Can genuinely representative people be reached, per claimed operating system?
- Are informed consent, needed accommodations, and data minimisation and protection in place?
- Which prior research is available, and what does it actually cover?
- Which observations will be recorded, by whom, and separated from interpretation how?

A missing condition — access to representative users, consent, accommodations, or required evidence — stops
the run and reports missing context. `DESK-FLOOR-03` owns that trigger set and its fail-closed behaviour; this
axis establishes whether the conditions hold before any work depends on them.

**Close with:** the participant plan per claimed system, the consent and accommodation record, and any
missing-context stop.

*Trace:* `DESK-R12`; `DESK-FLOOR-03`.

### `D6` — Rung applicability, rung by rung

Walk all nine rungs. For each, ask what its own question asks of this outcome, and decide how it will be
resolved: by producing the artifact, by citing an existing answer, or by proving it inapplicable.

- Which rungs does existing work already answer, and does that work address the rung's own question?
- Which rung is proposed inapplicable, and what property of *this* outcome makes it so?
- What observation would make a rung proposed inapplicable applicable again?

`SKILL.md` owns what makes each resolution kind substantiated, including what a proof of inapplicability must
name and why a reason is not a property. Read that rule before recording a resolution; do not re-derive it
here. [`fidelity-ladder.md`](fidelity-ladder.md) owns each rung's question, default artifact, done-condition,
and closing evidence.

> **Gate `DESK-G2` — ladder-rung applicability.** The user sees all nine rungs with the proposed resolution
> kind for each, the evidence behind every proposed inapplicability, and the falsifying observation that would
> reopen it. The user approves the applicability set or reopens a rung. An inapplicability approved here still
> has to satisfy the acceptance conditions `SKILL.md` states: this gate approves the plan, not the proof.

**Close with:** the nine-row rung register seeded with a proposed resolution kind per rung, and the `DESK-G2`
decision.

*Trace:* `DESK-R05` and `DESK-R06` for the rung obligation; `DESK-N02` for the silent-skip prohibition;
`DESK-R27` for the gate authority.

### `D7` — Fidelity per visual rung

- For each visual rung, what is this artifact for, and what question does it have to answer?
- Where does it sit on interactivity, on visuals, and on content and navigation — each decided separately?
- Which axis is deliberately low, and what does that cost?

Three independent axes, never one dial. The ladder owns the axis definitions and their selection consequence;
this axis records the run's position per artifact. The structural rung is non-visual and owes no fidelity
statement.

**Close with:** the per-artifact three-axis position for each visual rung, each with its reason.

*Trace:* `DESK-R07`; `DESK-N03`.

### `D8` — The structural skeleton, and its approval

The structural rung is resolved first among the later rungs, and the run stops here **before any visual rung
begins**.

- Does one whole structure hold the outcome together, with no surface, layout, or visual decision made yet?
- Does every claimed surface map onto that one structure?
- Which questions about the structure are still open, and who owns each?

> **Gate `DESK-G3` — structural-skeleton approval.** Present the surface-neutral structure, its state and path
> map, its surface mapping, and its open-question register. The user explicitly approves it or reopens it. A
> reopening returns to the structural rung and no visual rung starts. Starting a visual rung with this gate
> unresolved is itself a `DESK-R27` failure. The register row records the **approval decision**, not merely
> the artifact.

This gate is why the user sees the structure before the visual artifacts exist rather than after.

**Close with:** the approved structural specification, the `DESK-G3` decision, and any reopening condition.

*Trace:* `DESK-R27` for the gate authority; `DESK-R09` for the structure-before-visuals order.

### `D9` — Design acceptance

- Is every one of the nine rungs resolved and substantiated?
- Does direct representative-user evidence exist, from this run's own artifacts, on each claimed operating
  system?
- Does that evidence cover every applicable observation dimension?
- Do all four floors hold on both their union check and their property check?

Evidence from one operating system does not support a claim about another, and a captured rendering or a
static high-fidelity artifact is context only. `DESK-FLOOR-04` owns the observation-dimension set and the
per-system evidence rule.

> **Gate `DESK-G4` — design acceptance.** Present the complete design record: the rung register, the
> three-axis statements, the four floor resolutions with their property checks, the participant records, and
> the stated evidence limits. The user accepts the design or returns it to the owning rung. Acceptance is
> unavailable while the participant floor or the direct-evidence floor is unmet, and no floor is waivable.

**Close with:** the complete design record and the `DESK-G4` decision.

*Trace:* `DESK-R13` for the acceptance evidence; `DESK-R25` and `DESK-N04` for what is context only;
`DESK-R27` for the gate authority.

### `D10` — The privilege boundary and the channel inventory

The contract axes begin here, after design acceptance.

- Which unit of the outcome runs in which execution context?
- Which channels cross the privilege boundary, and what does each carry?
- What validates each payload into a domain type, and what verifies each caller?
- Which values cross the bridge, and does every one of them survive the crossing?

[`process-model.md`](process-model.md) owns the context split, the pattern table, the validation obligation,
and the crossable-type boundary. This axis produces the run's own channel inventory against it.

A typed inter-process-communication library, if one is proposed, is a new production dependency. Record it as
a candidate here and decide it at `D15`.

**Close with:** the context assignment per unit, the channel inventory with a payload type, a validation, and
a sender rule per channel, and any candidate dependency.

*Trace:* `DESK-R14`, `DESK-R15`, `DESK-R16`, `DESK-R17`, and `DESK-R18`; `DESK-N06` and `DESK-N07`.

### `D11` — Window lifecycle, native integration, and local data

- Which per-operating-system behaviours does this outcome touch, and what is the named mechanism for each?
- Does window state need to survive a restart, and if so, how?
- Which native integrations are in scope — menus, the tray and the dock, shortcuts, notifications, dialogs,
  drag-and-drop, chrome, theming, file associations?
- If the outcome is tray-resident, which system's activation gesture is being assumed, and does that system's
  own specification fix one?
- What is written locally, where, in what format, and what happens when a write is interrupted?
- Does a schema exist, and what is its migration path in **both** directions?

[`windows-lifecycle.md`](windows-lifecycle.md), [`native-integration.md`](native-integration.md), and
[`filesystem-data.md`](filesystem-data.md) own these mechanics. Window state restoration has no built-in
mechanism, so satisfying it means either a third-party dependency or an implementation this run owns — record
the candidate here and decide it at `D15`.

**Close with:** the per-system behaviour obligations with their mechanisms, the native-integration set, the
data and migration map, and any candidate dependency.

*Trace:* `DESK-R22` for the per-system obligations; `DESK-R18` for lifecycle-keyed disposal.

### `D12` — Security posture as two distinct kinds of work

- Which safe defaults are in place, and is anything in this outcome about to break one?
- Which positive controls does this outcome need, and which are actually written today?
- Where does untrusted content enter, and which privileged effect follows it?
- Which build-time hardening applies, and what does each fuse cost?

The two kinds of work differ: for the default group the correct action is inaction, and for the positive group
the control does not exist until someone writes it. [`security.md`](security.md) owns the split, the delivery
mechanisms, and the fuse set.

**Close with:** the default-group audit, the positive-control inventory with a written-or-missing state per
item, and the untrusted-input map.

*Trace:* `DESK-R19`; `DESK-R20`; `DESK-N08`.

### `D13` — The build matrix: hardening against testability

Two first-party sources conflict here, and this skill does not resolve the conflict on the reader's behalf.
Disabling the runtime-inspection fuse is documented hardening; the documented end-to-end test framework
requires that same fuse enabled. No documented reconciliation exists.

- Does this run need automated end-to-end coverage of the artifact that ships?
- Or does it need the fully hardened release build, with automation exercising a different build?

> **Gate `DESK-G5` — the hardening-versus-testability build matrix.** Present **both horns** with their
> consequences named. Either the release build is not automatable by that path, or the automated build is not
> the hardened one. The user decides. Whichever horn is chosen, its consequence is carried forward as a stated
> verification limit rather than absorbed into a green summary.

**Close with:** the build-matrix decision, both horns as presented, and the resulting stated verification
limit.

*Trace:* `DESK-R27` for the gate authority; `DESK-N10`, which forbids resolving this on the reader's behalf.

### `D14` — Build-tool selection

- Does the requirement set name differential updates, staged rollout, or a non-default update provider?
- Which tool does the project already use, and what would changing it cost?

The skill states a selection **criterion**, never a mandate, and
[`packaging-distribution.md`](packaging-distribution.md) owns it. Apply the criterion to this run's own stated
requirements and present the result.

> **Gate `DESK-G6` — build-tool selection.** Present the criterion, this run's requirement set, and which side
> of the criterion it falls on. The user selects the tool. A tool chosen against the criterion is a valid user
> decision; record the reason.

**Close with:** the requirement set, the criterion applied to it, and the `DESK-G6` decision.

*Trace:* `DESK-R27` for the gate authority; `DESK-N10` for the criterion-not-mandate rule.

### `D15` — New production dependencies

Every candidate collected at `D10`, `D11`, and elsewhere is decided here, as one set, so the user sees the
whole cost rather than approving each in isolation.

- What does each candidate do that this run would otherwise write itself?
- Is it maintained, and what happens to this outcome if it stops being maintained?
- What does it add to the shipped artifact, and what does it reach at run time?

No end-to-end typed inter-process-communication guidance is published and no library in that space is
canonical, so every such library is a candidate rather than a default. The same holds for window-state
restoration.

> **Gate `DESK-G7` — production-dependency adoption.** Present the candidate set with a maintenance state, a
> cost, and a build-it-here alternative per candidate. The user adopts, rejects, or defers each. A dependency
> is never adopted as a default.

**Close with:** the candidate register with the `DESK-G7` decision per candidate.

*Trace:* `DESK-R27` for the gate authority.

### `D16` — Release controls, channels, and the supported-version window

- Which installer target ships per claimed operating system?
- What is signed, by what, and what does signing gate on each system?
- How does an installed copy learn about an update, and on which systems is that automatic?
- Which channels exist, and what does a staged rollout look like here?
- How long is a shipped version supported once a newer one exists?

[`signing-updates.md`](signing-updates.md) owns the signing and update mechanics. Release is irreversible: a
shipped build cannot be recalled and old versions persist on user machines indefinitely, so rollback means a
forward fix plus a stated supported-old-version window.

**Close with:** the per-system release chain, the channel and rollout plan, the stop conditions, and the
supported-old-version window.

*Trace:* `DESK-R23`; `DESK-R24`.

### `D17` — Evidence classes and the claim ledger

- Which claim does this run intend to make at the end, and what evidence class owns each one?
- Which gate is unrunnable in this environment, and which claim does that block?
- Which version does each version-dependent claim depend on?

Design acceptance, implementation correctness, packaged-artifact evidence, signature and notarisation
evidence, update-rehearsal evidence, per-system evidence, release readiness, release authority, and
post-release outcome are nine separate claims. An unrunnable gate is recorded as a limitation and blocks the
claim it would have proved; it is never widened into a weaker signal.
[`runtime-deltas.md`](runtime-deltas.md) owns every version literal the ledger points at.

**Close with:** the claim ledger with an evidence class and an owner per claim, and the known verification
limits.

*Trace:* `DESK-R25`; `DESK-R26`.

### `D18` — Release authority

- Is every applicable gate passed, with its evidence recorded?
- Does the installable artifact exist, installed and smoke-tested in a clean environment?
- Was an update rehearsed from the previously released version?
- Are the stop conditions and the forward-fix route agreed?

> **Gate `DESK-G8` — release authority.** Present the release-readiness state: what is proved, what is a
> stated limit, the supported-old-version window, and the stop conditions. The user authorises the release or
> withholds authority. Nothing about this decision is recoverable afterward, which is why it is a gate rather
> than a step.

**Close with:** the release-readiness statement and the `DESK-G8` decision.

*Trace:* `DESK-R24`; `DESK-R27` for the gate authority.

### `D19` — Final contract checkpoint

Present the accumulated result in this order:

1. current reality, trigger, authority, and reversibility constraints;
2. the locked outcome, the claimed systems, the scope boundary, and the non-goals;
3. the stack-fit result and the design-ownership statement;
4. the rung register, the fidelity positions, and the design-acceptance state with its evidence limits;
5. the privilege boundary, the channel inventory, the per-system behaviour obligations, the data and
   migration map, and the security posture;
6. the build matrix, the build tool, the adopted dependencies, and the release chain;
7. the claim ledger, the open items with owners and methods, and every reopen condition.

Ask the user to confirm the whole contract or reopen the earliest owning axis. Do not enter implementation
with an applicable `recorded-open` item that can change scope, design acceptance, trust, data integrity, or
release safety.

*Trace:* `DESK-R01` for the bound contract; `DESK-R29`, whose design record this checkpoint populates.

## Completion audit

The tree is complete when all six conditions hold. Each is checked against the record, not against memory of
the conversation.

1. **Every axis is closed.** `D0` through `D19` is each confirmed, skipped under the conduct rule above with
   both facts recorded, or recorded open with an owner and a method.
2. **Every gate is fired and recorded.** All eight — `DESK-G1`, `DESK-G2`, `DESK-G3`, `DESK-G4`, `DESK-G5`,
   `DESK-G6`, `DESK-G7`, and `DESK-G8` — carries either a recorded user decision or, for `DESK-G1` alone, a
   recorded not-triggered result. A gate reached but not decided leaves the tree incomplete regardless of how
   much later work exists.
3. **The gates fired in order, and each before the work it governs.** `DESK-G3` fired before any visual rung
   began; `DESK-G4` fired before any contract axis; `DESK-G7` fired before any candidate dependency entered
   the build; `DESK-G8` fired before anything was published.
4. **The rung register is complete and its rows are substantiated.** Nine rows, each carrying a resolution
   kind and the inspected evidence behind it. Whether a row is substantiated is decided by the rung-closing
   rule in `SKILL.md`, which owns the conditions per resolution kind. This audit confirms the rows exist and
   were tested against that rule; it does not restate the rule and does not apply a second, looser one.
5. **No open item can still change a protected property.** An applicable `recorded-open` item that could
   change scope, design acceptance, trust, data integrity, or release safety blocks implementation. An item
   that cannot is carried forward with its owner and method.
6. **The user confirmed `D19`.** The whole contract was presented in one place and confirmed, or the earliest
   owning axis was reopened.

**What this audit deliberately does not do.** It does not accept a rung, close a floor, or discharge a gate.
Those belong to `SKILL.md`, which owns the acceptance rule for each. This audit checks that the interview
produced the decisions the phases need, in the order they need them — nothing more. A run whose tree is
complete can still fail acceptance, and that is the correct division: a decision recorded is not a property
proved.
