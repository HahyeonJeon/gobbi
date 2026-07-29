# CSS operational checklist source

## Run contract

- **Purpose/owner/consumer:** verify one CSS operation; owned by the CSS
  operator and consumed by the author, reviewer, and evaluation caller.
- **Mode:** `operational`.
- **Source version:** `css-checklist-v4`. This source remains unchecked:
  `[ ]` is the only resolution stored here. Every run uses a fresh filled copy
  that records this version and its run identity.
- **Pause-point use styles:** Design Gate uses `read-do`; Acceptance Gate uses
  `do-confirm`. A filled run repeats the style on every item.
- **Applicability:** evaluate each predicate from inspected evidence. An
  inapplicable item resolves only as `n/a:<property>` with exact evidence that
  the predicate is false.

The operational resolution enum is closed:

- `PASS`
- `FAIL:<finding/action-id>`
- `n/a:<property>`
- `recorded-open:<owner+resolution-method>`
- `waived/exception-authorized:<authority+rationale>`

`CONSIDERED` and `deferred` are invalid in this mode. The state transition is
`[ ] unresolved → evidence inspected → one permitted terminal`. `PASS`,
`FAIL:<id>`, and `n/a:<property>` require a named evidence identity plus its
decisive value or result. `recorded-open` closes coverage only. A waiver is
valid only for one gate/killer whose named authority mandate covers that
item's consequence and stop action; it substitutes for PASS on that item but
is never counted as PASS.

**Coverage closure:** every gate and required item has a permitted terminal.
**Acceptance:** after coverage closes, every applicable gate and required item
is `PASS`, except one item may use the bounded authorized-waiver rule above.
An inspected-false `n/a` item is not applicable. `FAIL`, `recorded-open`, an
unresolved slot, an invalid token, or an unsupported `n/a` prevents acceptance.

Every record below has a stable ID, pause point, criticality, use style,
applicability, source trace, one atomic binary claim, an explicit pass
condition, a named evidence method, an on-fail route, and one unresolved source
slot. A gate also names its concrete consequence and stop action.

## Design Gate — `read-do`

### C-K01 — Specification class

- **Criticality / applicability:** gate/killer; every material feature.
- **Use style / source trace:** `read-do`; O1/CSS-1/C-S01–C-S03.
- **Atomic claim:** The recorded S1–S4 class equals the current primary
  specification status.
- **Pass condition / evidence:** exact class equality from the named
  specification, status text, and publication date.
- **Consequence / stop:** wrong adoption basis; halt adoption and open a
  compatibility finding.
- **Resolution:** `[ ]`.

### C-K09 — Deployment class

- **Criticality / applicability:** gate/killer; every material feature.
- **Use style / source trace:** `read-do`; O1/CSS-1/C-S01–C-S03/C-S19–C-S22.
- **Atomic claim:** The first-match D4/D3/D2/D1 class equals the exact
  declared-target result.
- **Pass condition / evidence:** class equality from the versioned target
  matrix.
- **Consequence / stop:** unsupported target behavior; block adoption and
  obtain target evidence.
- **Resolution:** `[ ]`.

### C-K16 — Target observations

- **Criticality / applicability:** gate/killer; every material feature.
- **Use style / source trace:** `read-do`; O1/CSS-1/C-S19–C-S22.
- **Atomic claim:** Every declared target has one dated behavior observation.
- **Pass condition / evidence:** declared-target IDs equal observed-target IDs.
- **Consequence / stop:** an unobserved target can be silently dropped; block
  adoption and complete the matrix.
- **Resolution:** `[ ]`.

### C-K17 — Essential-outcome fallback

- **Criticality / applicability:** gate/killer; when any declared target is
  below the established floor.
- **Use style / source trace:** `read-do`; O1/CSS-1/C-S02/C-S19/C-S22.
- **Atomic claim:** Each below-floor target retains the essential outcome
  through a named fallback.
- **Pass condition / evidence:** the fallback result for every applicable
  target meets the essential-outcome assertion.
- **Consequence / stop:** essential behavior disappears; block adoption and
  repair the fallback.
- **Resolution:** `[ ]`.

### C-K18 — Exact-target tests

- **Criticality / applicability:** gate/killer; when any declared target is
  below the established floor.
- **Use style / source trace:** `read-do`; O1/CSS-1/C-S02/C-S20/C-S22.
- **Atomic claim:** Each below-floor target has a current exact-target test
  result.
- **Pass condition / evidence:** every applicable target ID has a passing test
  result bound to its version.
- **Consequence / stop:** target behavior is assumed; block adoption and run
  the missing test.
- **Resolution:** `[ ]`.

### C-K19 — Reopen or removal predicate

- **Criticality / applicability:** gate/killer; when any feature is not D1
  established.
- **Use style / source trace:** `read-do`; O1/CSS-1/C-S01/C-S02/C-S19/C-S22.
- **Atomic claim:** The feature has one dated measurable reopen or removal
  predicate.
- **Pass condition / evidence:** the ledger names the predicate, threshold,
  owner, and next review date.
- **Consequence / stop:** target-specific debt can become permanent; block
  adoption until the predicate exists.
- **Resolution:** `[ ]`.

### C-K02 — Cascade owner

- **Criticality / applicability:** gate/killer; when declarations compete.
- **Use style / source trace:** `read-do`; O2/CSS-2/C-S04–C-S06/C-S23–C-S24.
- **Atomic claim:** The observed winning declaration matches the intended
  owner/layer identity.
- **Pass condition / evidence:** matched-rule trace resolves to the named
  owner/layer.
- **Consequence / stop:** accidental winners make change unsafe; halt the
  slice and repair cascade ownership.
- **Resolution:** `[ ]`.

### C-K03 — Intrinsic layout matrix

- **Criticality / applicability:** required; when layout changes.
- **Use style / source trace:** `read-do`; O3/CSS-2/C-S07–C-S09/C-S29.
- **Atomic claim:** Essential content is visible in every declared intrinsic
  boundary cell.
- **Pass condition / evidence:** below/at/above plus empty/one/many geometry
  results meet their named bounds.
- **On fail:** repair flow, sizing, overflow, or containment and repeat.
- **Resolution:** `[ ]`.

### C-K11 — Locale and writing-mode matrix

- **Criticality / applicability:** required; when user-facing content exists.
- **Use style / source trace:** `read-do`; O3/CSS-2/C-S07–C-S09/C-S26/C-S28.
- **Atomic claim:** Essential content is visible in every declared
  locale/direction/writing-mode cell.
- **Pass condition / evidence:** the complete matrix meets its geometry and
  rendered expectations.
- **On fail:** repair logical/responsive rules and repeat affected cells.
- **Resolution:** `[ ]`.

### C-K04 — Visible focus

- **Criticality / applicability:** gate/killer; when focusable states exist.
- **Use style / source trace:** `read-do`; O4/CSS-2/C-S07/C-S09/C-S27.
- **Atomic claim:** Keyboard focus is visibly located in every declared color
  mode.
- **Pass condition / evidence:** focus capture plus geometry identifies the
  focused element in normal and forced colors.
- **Consequence / stop:** keyboard location is lost; halt the slice and open
  an accessibility-rendering finding.
- **Resolution:** `[ ]`.

### C-K30 — Non-color state cue

- **Criticality / applicability:** gate/killer; when a required state exists.
- **Use style / source trace:** `read-do`; O4/CSS-2/C-S07/C-S09/C-S27/C-S31.
- **Atomic claim:** Every required state has a perceivable non-color cue.
- **Pass condition / evidence:** state inventory equals the set with a
  non-color cue in the declared modes.
- **Consequence / stop:** state is unavailable to some users; halt the slice
  and open an accessibility-rendering finding.
- **Resolution:** `[ ]`.

### C-K12 — Reduced-motion function

- **Criticality / applicability:** required; when nonessential motion exists.
- **Use style / source trace:** `read-do`; O4/CSS-2/C-S07/C-S09/C-S31.
- **Atomic claim:** The reduced-motion rendering preserves the named function.
- **Pass condition / evidence:** reduced-motion result satisfies the function
  assertion.
- **On fail:** repair motion rules and repeat the preference case.
- **Resolution:** `[ ]`.

### C-K20 — Forced-colors function

- **Criticality / applicability:** required; when authored colors affect a
  required cue.
- **Use style / source trace:** `read-do`; O4/CSS-2/C-S07/C-S09/C-S31/C-S33.
- **Atomic claim:** The forced-colors rendering preserves the named function.
- **Pass condition / evidence:** forced-colors result satisfies the function
  assertion.
- **On fail:** repair color-adjustment rules and repeat the mode.
- **Resolution:** `[ ]`.

### C-K21 — Contrast threshold

- **Criticality / applicability:** required; when text or a required visual
  cue has a project threshold.
- **Use style / source trace:** `read-do`; O4/CSS-2/C-S07/C-S09/C-S33.
- **Atomic claim:** Every applicable state/theme pair meets its named contrast
  threshold.
- **Pass condition / evidence:** measured ratio is greater than or equal to
  the project threshold in each pair.
- **On fail:** repair color values and repeat the measurement.
- **Resolution:** `[ ]`.

### C-K22 — Font-failure readability

- **Criticality / applicability:** required; when a custom font is requested.
- **Use style / source trace:** `read-do`; O4/CSS-2/C-S09/C-S30/C-S33.
- **Atomic claim:** The failed-font fixture keeps essential text readable
  within its declared geometry.
- **Pass condition / evidence:** fallback-font text remains visible and within
  its exact bounds.
- **On fail:** repair the font stack or sizing and repeat the failure fixture.
- **Resolution:** `[ ]`.

## Acceptance Gate — `do-confirm`

### C-K31 — Exact source identity

- **Criticality / applicability:** gate/killer; every output.
- **Use style / source trace:** `do-confirm`; O5/CSS-3/C-S10–C-S12/C-S38.
- **Atomic claim:** The evidence chain names the exact accepted source bytes.
- **Pass condition / evidence:** recorded source digest equals the inspected
  source digest.
- **Consequence / stop:** evidence can bind to another source; halt acceptance
  and repair the identity.
- **Resolution:** `[ ]`.

### C-K32 — Exact transform identity

- **Criticality / applicability:** gate/killer; when output is transformed.
- **Use style / source trace:** `do-confirm`; O5/CSS-3/C-S11/C-S12/C-S38.
- **Atomic claim:** The evidence chain names the exact transform invocation.
- **Pass condition / evidence:** tool, version, configuration, flags, plugins,
  and order equal the invocation record.
- **Consequence / stop:** output cannot be reproduced; halt acceptance and
  repair the transform record.
- **Resolution:** `[ ]`.

### C-K05 — Exact emitted identity

- **Criticality / applicability:** gate/killer; every output.
- **Use style / source trace:** `do-confirm`; O5/CSS-3/C-S10–C-S12/C-S38.
- **Atomic claim:** The evidence chain names the exact emitted CSS bytes.
- **Pass condition / evidence:** recorded emitted digest equals the inspected
  emitted digest.
- **Consequence / stop:** evidence can approve different bytes; halt
  acceptance and regenerate when applicable.
- **Resolution:** `[ ]`.

### C-K13 — Observable fourth link

- **Criticality / applicability:** gate/killer; every output.
- **Use style / source trace:** `do-confirm`; O5/CSS-3/C-S10–C-S12/C-S25/C-S38.
- **Atomic claim:** One accepted observation is bound to the emitted digest.
- **Pass condition / evidence:** observation digest equals the accepted
  emitted digest.
- **Consequence / stop:** behavior evidence can describe other bytes; halt
  acceptance, rebind, and rerun.
- **Resolution:** `[ ]`.

### C-K10 — Computed cascade result

- **Criticality / applicability:** required; when cascade behavior changes.
- **Use style / source trace:** `do-confirm`; O2/CSS-2/C-S04–C-S06/C-S23/C-S25.
- **Atomic claim:** The exact computed assertion equals the intended winner.
- **Pass condition / evidence:** assertion output is `PASS` for the named
  property/value/element.
- **On fail:** repair CSS ownership and repeat the cascade layers.
- **Resolution:** `[ ]`.

### C-K06 — Representative performance metric

- **Criticality / applicability:** required; when a performance claim exists.
- **Use style / source trace:** `do-confirm`; O6/CSS-4/C-S13–C-S16.
- **Atomic claim:** The representative before/after metric meets the declared
  improvement threshold.
- **Pass condition / evidence:** exact raw values satisfy the named threshold
  on the versioned fixture.
- **On fail:** reject the claim or remove the optimization.
- **Resolution:** `[ ]`.

### C-K14 — Performance behavior guard

- **Criticality / applicability:** gate/killer; when a performance claim exists.
- **Use style / source trace:** `do-confirm`; O6/CSS-4/C-S13/C-S15/C-S16.
- **Atomic claim:** The optimization preserves the named behavior guard.
- **Pass condition / evidence:** the exact behavior assertion is `PASS`.
- **Consequence / stop:** optimization changes required behavior; halt
  acceptance and revert or repair it.
- **Resolution:** `[ ]`.

### C-K23 — Performance accessibility guard

- **Criticality / applicability:** gate/killer; when a performance claim exists.
- **Use style / source trace:** `do-confirm`; O6/CSS-4/C-S13/C-S15/C-S16.
- **Atomic claim:** The optimization preserves the named
  accessibility-rendering guard.
- **Pass condition / evidence:** the exact accessibility-rendering assertion
  is `PASS`.
- **Consequence / stop:** optimization removes an accessibility-controlled
  behavior; halt acceptance and revert or repair it.
- **Resolution:** `[ ]`.

### C-K24 — Performance removal criterion

- **Criticality / applicability:** gate/killer; when a performance claim exists.
- **Use style / source trace:** `do-confirm`; O6/CSS-4/C-S13/C-S15/C-S16.
- **Atomic claim:** The optimization has one measurable removal criterion.
- **Pass condition / evidence:** the record names metric, threshold, owner, and
  review date.
- **Consequence / stop:** optimization can persist without benefit; halt
  acceptance until the criterion exists.
- **Resolution:** `[ ]`.

### C-K07 — Foreign owner

- **Criticality / applicability:** gate/killer; when a security, generator,
  document, JavaScript, Electron-process, or product concern exists.
- **Use style / source trace:** `do-confirm`; O5/O7/CSS-3/C-S12/C-S18/C-S35–C-S37.
- **Atomic claim:** Each foreign concern has one named owning authority.
- **Pass condition / evidence:** concern IDs equal owner-map concern IDs.
- **Consequence / stop:** CSS can exceed its authority; route to the owner and
  pause.
- **Resolution:** `[ ]`.

### C-K33 — Foreign-owner decision

- **Criticality / applicability:** gate/killer; when a foreign concern exists.
- **Use style / source trace:** `do-confirm`; O5/O7/CSS-3/C-S12/C-S18/C-S35–C-S37.
- **Atomic claim:** Each foreign concern has the required owner decision.
- **Pass condition / evidence:** every concern ID resolves to a decision
  pointer from its named authority.
- **Consequence / stop:** owner naming can impersonate authorization; pause
  until the decision is present.
- **Resolution:** `[ ]`.

### C-K08 — Evidence claim ceiling

- **Criticality / applicability:** gate/killer; every completion claim.
- **Use style / source trace:** `do-confirm`; O7/CSS-4/C-S17–C-S18.
- **Atomic claim:** Final wording stays within the selected evidence ceiling.
- **Pass condition / evidence:** no runtime skill-use, product accessibility,
  UI/UX acceptance, deployment, or release claim lacks direct evidence.
- **Consequence / stop:** overclaiming misleads release decisions; narrow the
  claim and block handoff.
- **Resolution:** `[ ]`.

### C-K15 — Original failure record

- **Criticality / applicability:** gate/killer; when any failure occurred.
- **Use style / source trace:** `do-confirm`; O5/CSS-3/CSS-4/C-S09/C-S11/C-S12/C-S32/C-S34.
- **Atomic claim:** The original failure remains reproducible from a named
  record.
- **Pass condition / evidence:** the preserved trigger reproduces the recorded
  failure result.
- **Consequence / stop:** recovery can hide the defect; halt handoff until the
  failure is preserved.
- **Resolution:** `[ ]`.

### C-K25 — Owner repair

- **Criticality / applicability:** gate/killer; when any failure occurred.
- **Use style / source trace:** `do-confirm`; O5/CSS-3/CSS-4/C-S11/C-S12/C-S30/C-S34/C-S36.
- **Atomic claim:** The failure's named owner has an exact repair record.
- **Pass condition / evidence:** changed source/configuration/decision identity
  equals the classified owner surface.
- **Consequence / stop:** symptom repair can bypass authority; return to the
  owner and halt handoff.
- **Resolution:** `[ ]`.

### C-K26 — Regenerated output

- **Criticality / applicability:** gate/killer; when output is generated after
  a repair.
- **Use style / source trace:** `do-confirm`; O5/CSS-3/C-S11/C-S12/C-S34.
- **Atomic claim:** The repaired source produced a new generated output.
- **Pass condition / evidence:** post-repair emitted digest differs from the
  preserved failed digest through the recorded invocation.
- **Consequence / stop:** stale output can ship; halt handoff and regenerate.
- **Resolution:** `[ ]`.

### C-K27 — Rebound observation

- **Criticality / applicability:** gate/killer; when emitted bytes changed
  after a repair.
- **Use style / source trace:** `do-confirm`; O5/CSS-3/C-S11/C-S12/C-S34.
- **Atomic claim:** Post-repair observations bind to the new emitted digest.
- **Pass condition / evidence:** each selected observation digest equals the
  new emitted digest.
- **Consequence / stop:** stale evidence can approve the repair; halt handoff,
  rebind, and rerun.
- **Resolution:** `[ ]`.

### C-K28 — Affected-layer retest

- **Criticality / applicability:** gate/killer; when any failure occurred.
- **Use style / source trace:** `do-confirm`; O5/CSS-4/C-S09/C-S11/C-S30/C-S32/C-S34.
- **Atomic claim:** Every affected verification layer has a post-repair result.
- **Pass condition / evidence:** affected-layer IDs equal post-repair result
  IDs.
- **Consequence / stop:** an untested layer can retain the defect; halt
  handoff and run the missing layer.
- **Resolution:** `[ ]`.

### C-K29 — Repeated-selection success

- **Criticality / applicability:** gate/killer; when any failure occurred.
- **Use style / source trace:** `do-confirm`; O5/CSS-4/C-S09/C-S11/C-S30/C-S32/C-S34.
- **Atomic claim:** The complete affected selection passes after repair.
- **Pass condition / evidence:** the repeated selection's aggregate result is
  `PASS`.
- **Consequence / stop:** partial recovery can ship; return to the owner and
  halt handoff.
- **Resolution:** `[ ]`.

## Trace and pilot route

O1→C-K01/C-K09/C-K16–C-K19; O2→C-K02/C-K10;
O3→C-K03/C-K11; O4→C-K04/C-K12/C-K20–C-K22/C-K30;
O5→C-K05/C-K07/C-K13/C-K15/C-K25–C-K29/C-K31–C-K33;
O6→C-K06/C-K14/C-K23/C-K24; O7→C-K07/C-K08/C-K33.
Every source item maps to at least one scenario obligation, and every
obligation maps to an item.

Filled passing, failing, non-applicable, boundary, and adversarial runs are
preserved in the current Task 02 WORK evidence at
`research/checklist-pilots.md`; they do not mutate this source.
