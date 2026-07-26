# React — Binary Check Register

The binary `REACT-CHECK-*` register for a React change-set. An evaluator activates the applicable items
through `evaluation.md`; an executor answers the same items as a pre-handoff self-check at Procedure P8.

**Purpose.** Resolve, from inspected evidence, whether a change-set satisfies the `SKILL.md` floor.
**Owner.** This skill. **Consumers.** An evaluator, and an executor self-checking before handoff.

**Mode.** Evaluation coverage register — every item is a gate or a required item, and no item is
advisory. **Use-style.** One run-level style, `do-confirm`: the work exists and each item is confirmed
against it. **Source discipline.** This file is the source and every box in it stays unchecked. A run
works a fresh filled copy that names the source version and the run; a run never marks this file.

Items cite the Rule (`H{n}`), Principle (`P{n}`), and Procedure step (`Procedure P{n}`) identifiers
stamped in `SKILL.md`, and the `REACT-SCENARIO-{nn}` family that obliged them. This register resolves
those identifiers and never renumbers them.

---

## Legend

| Token | Meaning |
|---|---|
| `PASS` | The pass condition is verified true, citing the evidence that proves it. |
| `FAIL:<finding-id>` | Verified false; cite the finding. |
| `n/a:<property>` | The applicability predicate is false; name the property AND cite the inspected evidence that it is false. |

No other token is permitted here. An unchecked box is unresolved, not a token.

**Coverage closure is not acceptance.** Coverage closes when every applicable item holds a terminal
token. Acceptance is the separate, stronger claim: **every applicable gate and required item resolves
`PASS`**. A `FAIL`, a named owner, a filed follow-up, or a promise to fix later closes coverage and does
**not** accept the change-set. There is no waiver in this mode.

**Evidence floor.** A terminal is marked only after the evidence it names has been inspected in this run.
A tick from memory, from an assigned owner, from a matching label, or from a present-but-empty artifact
is a false pass. An `n/a` needs inspected evidence that the item does not apply — an applicable item can
never be relabelled `n/a` to dodge it.

**On fail.** With no runtime pause point, every gate's stop action is: **open a blocking finding and do
not accept the change-set.** Each gate below names the concrete harm its miss causes.

---

## Hard invariants

### From REACT-SCENARIO-01 — render purity

- [ ] **REACT-CHECK-01** · gate · unconditional
  - **Claim.** No component or hook changed by this change-set performs a side effect, a mutation, or a
    subscription during render.
  - **Pass when.** For every changed component and hook, the render path contains no write to state
    outside its own local values, no subscription, and no call that mutates a prop, state, context value,
    or hook argument — including inside a `useMemo`, which runs during render.
  - **Evidence.** Read each changed render path directly, then render the component twice with identical
    props and compare the output and any external state it touches.
  - **Harm on fail.** The optimization the compiler applies is sound only while this holds, so a
    violation produces defects that appear as unexplained stale or duplicated values far from the cause.
  - **Source.** `REACT-SCENARIO-01` · `H1` · `P2`.

- [ ] **REACT-CHECK-02** · gate · unconditional
  - **Claim.** No value is mutated after it has been passed to JSX, and no prop, state, context value, or
    hook return is mutated anywhere in the change.
  - **Pass when.** Every mutation in the change acts on a value the changed code created and has not yet
    handed to JSX; array and object updates on incoming values produce copies.
  - **Evidence.** Trace each mutation site to the value's origin and to whether it has reached JSX.
  - **Harm on fail.** The committed tree disagrees with what was rendered, and the divergence surfaces as
    a rendering bug with no local cause.
  - **Source.** `REACT-SCENARIO-01` · `H11` · `P2`.

### From REACT-SCENARIO-02 — hook call sites and naming

- [ ] **REACT-CHECK-03** · gate · unconditional
  - **Claim.** Every hook call in the change is at the top level of a component or another hook, before
    any early return.
  - **Pass when.** No hook call sits inside a loop, a condition, a nested function, or after an early
    return, in any changed component or hook.
  - **Evidence.** Read each changed hook call site, and confirm the rules-of-hooks lint rule reports
    clean on the changed files.
  - **Harm on fail.** Hook identity is positional, so one conditional call binds every later hook to the
    wrong state — a defect that appears only on the branch that skips it.
  - **Source.** `REACT-SCENARIO-02` · `H2`.

- [ ] **REACT-CHECK-04** · required · conditional — applies when the change adds or edits a function that
  calls a hook
  - **Claim.** Every function in the change that calls a hook is named `use` followed by a capital letter.
  - **Pass when.** Each hook-calling function's name matches that shape; a helper that was extracted and
    calls no hook is not required to.
  - **Evidence.** List the functions in the change that call a hook and read their names.
  - **On fail.** Required item: open a finding. React's linter identifies a hook by its name, so a
    misnamed one loses its enforcement.
  - **`n/a` form.** `n/a: the change adds or edits no hook-calling function` — cited by the diff.
  - **Source.** `REACT-SCENARIO-02` · `H3`.

### From REACT-SCENARIO-03 — list identity

- [ ] **REACT-CHECK-05** · gate · conditional — applies when the change renders a list
  - **Claim.** Every list rendered by the change gives each item a key that is an identity carried in the
    data.
  - **Pass when.** For each rendered list, the key expression reads a field that identifies the item in
    the data and is unique among its siblings.
  - **Evidence.** Read each key expression and confirm uniqueness against a representative data sample.
  - **Harm on fail.** Item state attaches to a position instead of an item, so user input moves to the
    wrong row on reorder — silent data corruption from the user's point of view.
  - **`n/a` form.** `n/a: the change renders no list` — cited by the diff.
  - **Source.** `REACT-SCENARIO-03` · `H4`.

- [ ] **REACT-CHECK-06** · required · conditional — applies when a rendered list can reorder, receive an
  insertion, or lose an item
  - **Claim.** No key in such a list is an array index or a value generated during render.
  - **Pass when.** No key expression reads an index parameter or calls a value generator.
  - **Evidence.** Read each key expression in the qualifying lists.
  - **On fail.** Required item: open a finding.
  - **`n/a` form.** `n/a: the list is static — never reordered, inserted into, or deleted from, and its
    items hold no state` — cited by the code paths that produce the list, not by the current fixture.
  - **Source.** `REACT-SCENARIO-03` · `H12`.

### From REACT-SCENARIO-04 — Effects as an escape hatch

- [ ] **REACT-CHECK-07** · gate · conditional — applies when the change adds or edits an Effect
  - **Claim.** Every Effect in the change synchronizes with a named system outside React.
  - **Pass when.** For each Effect, the external system it synchronizes with is named — a network call, a
    subscription, a timer, the browser DOM, a non-React widget, or a process bridge. An Effect that only
    computes a value from props or state, resets state on a prop change, or runs what an event handler
    caused does not pass.
  - **Evidence.** For each Effect, name its external system, or name which alternative it should have
    used: computed during render, handled in the event handler, or reset by `key`.
  - **Harm on fail.** Every such Effect adds a render pass and a causal step nothing traces, and the
    intermediate frame renders stale data to the user.
  - **`n/a` form.** `n/a: the change adds and edits no Effect` — cited by the diff.
  - **Source.** `REACT-SCENARIO-04` · `H5` · `P2`.

- [ ] **REACT-CHECK-08** · required · conditional — applies when the change contains two or more Effects
  in one tree region
  - **Claim.** No Effect in the change sets state that another Effect watches.
  - **Pass when.** For each Effect's state writes, no other Effect lists that state among its
    dependencies — including through a value derived from it.
  - **Evidence.** Build the write-to-dependency map across the change's Effects and look for an edge.
  - **On fail.** Required item: open a finding. Collapsing a chain into one Effect with several writes
    hides the cascade rather than removing it and does not pass.
  - **`n/a` form.** `n/a: the change contains fewer than two Effects in any one tree region` — cited by
    the diff.
  - **Source.** `REACT-SCENARIO-04` · `H13` · `P3`.

### From REACT-SCENARIO-05 — cleanup and staleness

- [ ] **REACT-CHECK-09** · gate · conditional — applies when an Effect in the change creates a
  subscription, a timer, or a listener
  - **Claim.** Every such Effect returns a cleanup that removes what it created.
  - **Pass when.** For each created subscription, timer, and listener there is a matching removal in the
    returned cleanup, and the cleanup performs that removal rather than returning an empty function.
  - **Evidence.** Pair each creation with its removal by reading the Effect, then unmount the component
    and confirm no listener or timer remains live.
  - **Harm on fail.** A long-lived surface accumulates leaked subscriptions across mounts until memory
    and duplicate handlers degrade the running application.
  - **`n/a` form.** `n/a: no Effect in the change creates a subscription, timer, or listener` — cited by
    the diff.
  - **Source.** `REACT-SCENARIO-05` · `H6`.

- [ ] **REACT-CHECK-10** · gate · conditional — applies when an Effect in the change awaits a result
  - **Claim.** Every awaited result is stopped or discarded when the render that requested it is no
    longer current.
  - **Pass when.** Each async Effect either cancels the in-flight work in its cleanup or carries a
    staleness discriminator that its cleanup sets, with the result applied only while the discriminator
    says the render is current. Either mechanism satisfies this item; neither does not.
  - **Evidence.** Issue two requests whose responses resolve in inverted order and read the rendered
    result; the later request's result must be the one displayed.
  - **Harm on fail.** An earlier response overwrites a later one, so the user sees a result that answers
    a query they have already replaced — and it reproduces only on a slow network.
  - **`n/a` form.** `n/a: no Effect in the change awaits a result` — cited by the diff.
  - **Source.** `REACT-SCENARIO-05` · `H6`.

- [ ] **REACT-CHECK-35** · required · conditional — applies when an Effect in the change starts
  cancellable work on an input that can change again before it finishes
  - **Claim.** The change records which of `cancel` and `ignore` it chose, and the choice matches what
    the surface does to the work that is already running.
  - **Pass when.** Where the work is left running deliberately, the change says so and the work is cheap
    and bounded; where the input changes rapidly, the surface is long-lived, or the request is expensive,
    the cleanup cancels it. Discarding the result while every superseded request runs to completion does
    not pass on those three conditions — that is the case this item exists for.
  - **Evidence.** Change the input several times in quick succession and observe the requests still in
    flight; a cancelling implementation leaves at most the current one.
  - **On fail.** Required item: open a finding. `REACT-CHECK-10` passing is not evidence for this item:
    ignoring a result satisfies that item and leaves the work running, which is exactly the gap.
  - **`n/a` form.** `n/a: no Effect in the change starts cancellable work, or the input cannot change
    before the work finishes` — cited by the diff and the surface's lifetime.
  - **Source.** `REACT-SCENARIO-05` · `H6` · `P2`.

### From REACT-SCENARIO-06 — the server and client boundary

- [ ] **REACT-CHECK-11** · gate · conditional — applies when a value in the change crosses the
  server/client boundary
  - **Claim.** Every value crossing the boundary has its direction recorded and is legal for that
    direction.
  - **Pass when.** For each crossing value, the change records which direction it crosses, and the value
    is checked against the set that applies to that direction rather than against one merged notion of
    serializable.
  - **Evidence.** For each crossing value, the recorded direction plus the direction-specific check;
    confirmed by passing the value across the real boundary.
  - **Harm on fail.** The failure lands on the network hop rather than the call site, so it surfaces in
    production as an opaque serialization error far from the code that caused it.
  - **`n/a` form.** `n/a: no value in the change crosses the server/client boundary` — cited by the
    absence of a boundary module in the affected set.
  - **Source.** `REACT-SCENARIO-06` · `H7` · `P6`.

- [ ] **REACT-CHECK-12** · required · conditional — applies when a value the change needs on the other
  side cannot legally cross
  - **Claim.** Each such value is replaced by an identifier that the other side re-reads.
  - **Pass when.** The non-crossable value is not passed; an identifier crosses and the receiving side
    resolves it.
  - **Evidence.** Read the boundary call and the receiving side's resolution.
  - **On fail.** Required item: open a finding. Marking the module as client code to silence the error
    moves the boundary instead of fixing the value and does not pass.
  - **`n/a` form.** `n/a: every value the change needs on the other side may legally cross` — cited by
    the per-value direction check from `REACT-CHECK-11`.
  - **Source.** `REACT-SCENARIO-06` · `H7`.

- [ ] **REACT-CHECK-34** · gate · conditional — applies when the change adds or edits a Server Function
  - **Claim.** Every Server Function the change adds or edits validates its arguments and authorizes the
    mutation inside its own body.
  - **Pass when.** For each such function, the body checks the caller's authority before performing any
    mutation, and checks each argument it uses rather than assuming the shape a component would have sent.
    A check performed only in the calling component does not pass, and a type annotation on the parameter
    does not pass — neither runs when the endpoint is called directly.
  - **Evidence.** Read each added or edited Server Function body for the authority check and the argument
    checks, then call the function directly with an argument no component would produce and confirm it
    refuses before mutating.
  - **Harm on fail.** The function is reachable by anything that can reach the endpoint, so an
    unauthorized mutation needs no UI, no session in your application, and no bug in your components.
  - **`n/a` form.** `n/a: the change adds and edits no Server Function` — cited by the diff.
  - **Source.** `REACT-SCENARIO-06` · `H18` · `P6`.

### From REACT-SCENARIO-10 — host assumptions and the renderer bridge

- [ ] **REACT-CHECK-19** · gate · unconditional
  - **Claim.** The change uses no Server Component, Server Function, or streaming server render on a host
    that has no implementation for it.
  - **Pass when.** The recorded host either implements them, or the change uses none of them.
  - **Evidence.** The host recorded at Procedure P1, read against the server-dependent constructs the
    change actually uses.
  - **Harm on fail.** The feature cannot work on its target at all, and the failure appears only when the
    code runs on that host rather than at build time.
  - **Source.** `REACT-SCENARIO-10` · `H17` · `P6`.

- [ ] **REACT-CHECK-20** · gate · conditional — applies when the change runs in a renderer that reaches a
  privileged process
  - **Claim.** The surface exposed to the renderer is an enumerable list of named operations.
  - **Pass when.** Every exposed entry is a named operation with its own arguments, and every incoming
    message is validated where it arrives. A single generic invoke-by-channel entry point does not pass:
    it re-exposes the whole surface under one name.
  - **Evidence.** Enumerate the exposed surface from the shipped preload code and, from page-context
    code, call it and record what it can reach.
  - **Harm on fail.** A content-injection bug in the page becomes access to whatever the privileged side
    can do, which is the difference between a display defect and code execution.
  - **`n/a` form.** `n/a: the change runs on no host with a privileged process` — cited by the recorded
    host.
  - **Source.** `REACT-SCENARIO-10` · `H16` · `P6`.

- [ ] **REACT-CHECK-28** · gate · conditional — applies when the change runs in a renderer that reaches a
  privileged process
  - **Claim.** The shipped window configuration has Node integration off and context isolation on.
  - **Pass when.** Both settings hold in the configuration the packaged application uses.
  - **Evidence.** Read the shipped configuration, not the development one; confirm the packaged build
    carries the same values.
  - **Harm on fail.** Without context isolation the bridge and the page share one world, so every other
    protection on this surface becomes decorative.
  - **`n/a` form.** `n/a: the change runs on no host with a privileged process` — cited by the recorded
    host.
  - **Source.** `REACT-SCENARIO-10` · `H16`.

---

## Design judgment

### From REACT-SCENARIO-07 — the compiler baseline and legacy memoization

- [ ] **REACT-CHECK-13** · gate · conditional — applies when the recorded contract says the React
  Compiler is enabled
  - **Claim.** No manual memoization added by the change lacks a named reason at its call site.
  - **Pass when.** Each new `useMemo`, `useCallback`, or `memo` states which of the rule's exceptions it
    takes: a memoized value held stable as an Effect dependency, or precise control the compiler's
    analysis cannot express.
  - **Evidence.** Read each added memoization site for its stated reason.
  - **Harm on fail.** Memoization written without a reason is noise the compiler already handles, and it
    accumulates as maintenance cost that later readers cannot distinguish from load-bearing code.
  - **`n/a` form.** `n/a: the recorded contract says the compiler is not enabled` — cited by the P1
    record. This item and `REACT-CHECK-32` split the compiler switch between them, so an `n/a` here
    obliges `REACT-CHECK-32` instead; a run that resolves both `n/a` has not read the switch.
  - **Source.** `REACT-SCENARIO-07` · `H8` · `P5`.

- [ ] **REACT-CHECK-32** · gate · conditional — applies when the recorded contract says the React Compiler
  is not enabled
  - **Claim.** Every manual memoization the change adds names the criterion that selected it.
  - **Pass when.** Each new `useMemo`, `useCallback`, or `memo` states which criterion earned it — render
    cost, where the component re-renders often with the same props and its render work is expensive;
    referential identity, where the value is a prop of a `memo`'d component or a dependency of another
    hook; or an Effect dependency whose identity must be held stable. A `useCallback` wrapping a `useState`
    setter does not pass: that identity is already stable, so no criterion can be named for it.
  - **Evidence.** Read each added memoization site for its stated criterion, then read where the memoized
    value is consumed and confirm the stated criterion is the one that actually holds there.
  - **Harm on fail.** With no compiler, manual memoization is the mechanism, so an unreasoned memo is not
    merely noise — it is indistinguishable from the load-bearing ones, and the next reader cannot tell
    which removal is safe.
  - **`n/a` form.** `n/a: the recorded contract says the compiler is enabled` — cited by the P1 record;
    `REACT-CHECK-13` applies on that branch instead.
  - **Source.** `REACT-SCENARIO-07` · `H8` · `P5`.

- [ ] **REACT-CHECK-33** · required · conditional — applies when the recorded contract says the React
  Compiler is not enabled and the change adds, edits, or passes props to a `memo`'d component
  - **Claim.** Every prop that `memo`'d component receives keeps its identity across the parent's renders.
  - **Pass when.** At each call site, no prop is an object, array, or function created during the parent's
    render unless it is itself memoized or declared outside the component. A `useState` setter satisfies
    this without wrapping.
  - **Evidence.** Read every call site of the `memo`'d component and trace each non-primitive prop to where
    it is created.
  - **On fail.** Required item: open a finding. Repairing the prop's identity and dropping the `memo` are
    both valid resolutions; keeping the `memo` beside a prop rebuilt every render is not.
  - **`n/a` form.** `n/a: the compiler is enabled, or the change adds, edits, and calls no memo'd
    component` — cited by the P1 record or the diff.
  - **Source.** `REACT-SCENARIO-07` · `H8` · `P5`.

- [ ] **REACT-CHECK-14** · gate · conditional — applies when the change removes existing manual
  memoization
  - **Claim.** Each removal is covered by test evidence that would show a behavioral difference.
  - **Pass when.** For each removed memoization, a test exercises a path where the memoized value's
    identity is observed — including any Effect that lists it as a dependency — and that test passed
    after the removal.
  - **Evidence.** The named test plus its result, and the dependency trace showing what observed the old
    identity.
  - **Harm on fail.** Removing existing memoization can change compilation output, so an Effect
    downstream can start over-firing or under-firing with no local sign of why.
  - **`n/a` form.** `n/a: the change removes no existing manual memoization` — cited by the diff.
  - **Source.** `REACT-SCENARIO-07` · `H14`.

- [ ] **REACT-CHECK-25** · required · unconditional
  - **Claim.** The change records the React contract it was written against: the host, whether the
    compiler is enabled, and whether the source is TypeScript or plain JavaScript.
  - **Pass when.** All three are recorded in the change's own materials, as facts read from the codebase
    rather than assumed.
  - **Evidence.** The recorded contract, compared against the configuration files it claims to describe.
  - **On fail.** Required item: open a finding. Several items in this register resolve their
    applicability from this record, so its absence blocks them.
  - **Source.** `REACT-SCENARIO-07`, `REACT-SCENARIO-10` · `P1` · `Procedure P1`.

### From REACT-SCENARIO-08 — state placement

> `H15` is the one rule in `SKILL.md` labelled ecosystem convention. A finding from the two items below
> is a violation of this skill's house default and must be reported as such — never as a React-team
> position.

- [ ] **REACT-CHECK-15** · required · unconditional
  - **Claim.** Every datum the change introduces or moves has exactly one recorded owner.
  - **Pass when.** For each datum, the change names one home — local, lifted, context, a client store, or
    a server cache — and no datum is stored in two of them.
  - **Evidence.** The state-placement record from the design, read against where the code actually keeps
    each value.
  - **On fail.** Required item: open a finding.
  - **Source.** `REACT-SCENARIO-08` · `P3` · `Procedure P3`.

- [ ] **REACT-CHECK-16** · required · conditional — applies when the change holds server-owned data
  anywhere on the client: a client store, context, or a component's own state
  - **Claim.** After the server value changes out of band, every screen reading it converges on the new
    value.
  - **Pass when.** With the record mutated from a second client or an equivalent out-of-band write, each
    reading screen shows the new value once its recorded invalidation trigger fires, without a manual
    reload. A form draft held for local editing is client state and is outside this item until it is
    submitted. Holding the data in a component's own state does not remove the obligation — it relocates
    it, so the trigger has to be somewhere in that component's own code.
  - **Evidence.** The two-client observation, or the recorded invalidation trigger exercised and the
    re-read value compared.
  - **On fail.** Required item: open a finding **against this skill's house default**, stating that
    `H15` is ecosystem convention.
  - **`n/a` form.** `n/a: the change holds no server-owned data on the client in any slot` — cited by the
    ownership record from `REACT-CHECK-15`. Local state is a slot: absence of a store or a context is not
    evidence for this `n/a`.
  - **Source.** `REACT-SCENARIO-08` · `H15`.

- [ ] **REACT-CHECK-26** · required · conditional — applies when a client copy of server-owned data
  exists after the change
  - **Claim.** The copy records what invalidates it.
  - **Pass when.** The change names the trigger that refreshes or discards the copy, and that trigger
    exists in the code. `state.md` § 6 carries the trigger menu and the basis for choosing one; naming a
    trigger that cannot fire while the surface stays mounted does not pass.
  - **Evidence.** The named trigger, located in the change.
  - **On fail.** Required item: open a finding against this skill's house default, as above.
  - **`n/a` form.** `n/a: no client copy of server-owned data exists after the change` — cited by the
    ownership record.
  - **Source.** `REACT-SCENARIO-08` · `H15`.

### From REACT-SCENARIO-09 — the rendered markup

- [ ] **REACT-CHECK-17** · gate · conditional — applies when the change adds or edits an interactive
  element
  - **Claim.** Every interactive element the change produces is operable by keyboard and exposes a role
    and an accessible name.
  - **Pass when.** Each element can be reached and activated with the keyboard alone, and a query by role
    and accessible name finds it. A generic element carrying a role and a tab index but no keyboard
    activation does not pass.
  - **Evidence.** Operate each element with the keyboard only, and query it by role and accessible name.
  - **Harm on fail.** The feature is unusable for anyone not using a mouse, and the defect is invisible
    to the mouse-driven check that produced it.
  - **`n/a` form.** `n/a: the change adds and edits no interactive element` — cited by the diff.
  - **Source.** `REACT-SCENARIO-09` · `H9` · `P4`.

- [ ] **REACT-CHECK-18** · gate · conditional — applies when the change adds or edits a dialog or overlay
  - **Claim.** Focus moves into the dialog when it opens and returns to the invoking control when it
    closes.
  - **Pass when.** Immediately after open, the focused element is inside the dialog; immediately after
    close, the focused element is the control that invoked it.
  - **Evidence.** Read the focused element at both transitions while operating the flow by keyboard.
  - **Harm on fail.** A keyboard or assistive-technology user is left in the page behind the dialog with
    no route into it, so the interaction cannot be completed at all.
  - **`n/a` form.** `n/a: the change adds and edits no dialog or overlay` — cited by the diff.
  - **Source.** `REACT-SCENARIO-09` · `H9`.

- [ ] **REACT-CHECK-27** · required · conditional — applies when the change adds an ARIA role, state, or
  property
  - **Claim.** Each addition records which of the rule's stated exceptions justifies it.
  - **Pass when.** For each addition, the change names the reason no native element carries the
    semantics: the native element is not implemented, lacks accessibility support, or is ruled out by a
    stated visual design constraint.
  - **Evidence.** The recorded justification, read against the native element it replaces.
  - **On fail.** Required item: open a finding.
  - **`n/a` form.** `n/a: the change adds no ARIA role, state, or property` — cited by the diff.
  - **Source.** `REACT-SCENARIO-09` · `H9`.

---

## Bottom-up operation

### From REACT-SCENARIO-11 — skeleton first, then slices

- [ ] **REACT-CHECK-21** · required · conditional — applies in author mode
  - **Claim.** A skeleton state exists in which every planned unit is present, the tree renders, the
    type-check passes where the source is TypeScript, and no behavior is implemented.
  - **Pass when.** At that state every unit named in the approved design resolves to a definition, the
    top unit renders its static markup, the type-check exits clean, and no unit contains conditional
    logic, data access, a state transition, or event handling.
  - **Evidence.** The skeleton commit or the recorded pre-behavior state, inspected directly, plus the
    type-check output produced from it.
  - **On fail.** Required item: open a finding. A skeleton that already carries behavior does not pass —
    the last clause is what the item turns on.
  - **`n/a` form.** `n/a: the run is review mode, which does not build` — cited by the declared mode.
  - **Source.** `REACT-SCENARIO-11` · `Procedure P5`.

- [ ] **REACT-CHECK-22** · required · unconditional
  - **Claim.** Every affected caller, test, story, and type moved in the same slice as the behavior it
    covers.
  - **Pass when.** No file in the affected set is left for a follow-up change, and each slice in the
    history contains its own dependents.
  - **Evidence.** The affected set recorded at Procedure P1, compared against the changed-file list.
  - **On fail.** Required item: open a finding.
  - **Source.** `REACT-SCENARIO-11` · `Procedure P6`.

### From REACT-SCENARIO-12 — review, traceability, and taught examples

- [ ] **REACT-CHECK-23** · gate · unconditional
  - **Claim.** The change-set carries one verdict per applicable review axis.
  - **Pass when.** The number of verdicts equals the number of axes applicable to the recorded source
    language — three where the source is TypeScript, two where it is plain JavaScript — and each verdict
    names the axis it graded.
  - **Evidence.** The verdicts themselves, each naming the axis it graded, counted against the source
    language recorded by `REACT-CHECK-25`.
  - **Harm on fail.** One conflated pass lets a change that is fluent React but shallow as software
    through, which is the failure the three axes exist to separate.
  - **Source.** `REACT-SCENARIO-12` · `Procedure P8`.

- [ ] **REACT-CHECK-24** · gate · conditional — applies when the change adds or edits a taught React
  example
  - **Claim.** Every taught example added or edited by the change resolves to a located sentence, in a
    named primary source, that states what the example shows.
  - **Pass when.** For each example the run holds three things: the source name, the exact location
    within it, and the quoted sentence — and that sentence states the behavior the example demonstrates,
    not merely the API the example happens to use. An example described as coming from the documentation,
    with no locatable sentence, fails. "The examples were reviewed" is not a resolution of this item.
  - **Evidence.** The quoted sentence beside each example with its source location, opened and read
    during this run, not carried forward from an earlier review.
  - **Harm on fail.** A wrong example ships as a taught fact and is copied into code. Examples here are
    cite-and-review by decision — no harness checks them — so this item is the only mechanical guard, and
    a soft resolution of it leaves none.
  - **`n/a` form.** `n/a: the change adds and edits no taught example` — cited by the diff.
  - **Source.** `REACT-SCENARIO-12` · `Procedure P8`.

- [ ] **REACT-CHECK-29** · required · conditional — applies when the change adds or edits a component test
  - **Claim.** Each such test finds its subject through the user-visible surface and imports `act` from
    `react` where it uses it.
  - **Pass when.** Queries locate elements by role, accessible name, or visible text rather than by
    component internals, state, or tree structure; any `act` import comes from `react`.
  - **Evidence.** Read the queries and imports in the added or edited tests.
  - **On fail.** Required item: open a finding. A test that asserts implementation fails on a correct
    refactor and passes on a broken rewrite.
  - **`n/a` form.** `n/a: the change adds and edits no component test` — cited by the diff.
  - **Source.** `REACT-SCENARIO-12` · `H10` · `P7`.

- [ ] **REACT-CHECK-30** · required · unconditional
  - **Claim.** Every approved design item maps to an implemented unit, and every file in the affected set
    is updated or recorded as a justified no-op.
  - **Pass when.** Each item in the approved design resolves to code in the change, and each affected-set
    file is either changed or carries a stated reason it needed no change.
  - **Evidence.** The approved design and the affected set, each walked against the diff.
  - **On fail.** Required item: open a finding.
  - **Source.** `REACT-SCENARIO-12` · `Procedure P4` · `Procedure P8`.

- [ ] **REACT-CHECK-31** · gate · unconditional
  - **Claim.** Every applicable verification gate ran on the final tree and exited clean.
  - **Pass when.** Each gate in the parent's fixed order — format, lint including the hooks rules,
    type-check, component tests, the full suite, end-to-end tests, build, and for a desktop host the
    packaged build rather than only the development server — either produced clean output on the tree
    being accepted or names why it does not apply. A gate with neither fails this item.
  - **Evidence.** Fresh command output from the final tree, not a summary and not a previous run.
  - **Harm on fail.** An unverified claim of verification is worse than none, because later work treats
    the change as proven.
  - **Source.** `REACT-SCENARIO-05`, `REACT-SCENARIO-07` · `Procedure P7`.

---

## Guaranteed coverage map

Every Rule and every Principle in `SKILL.md` is anchored by at least one item, and every item traces to
at least one scenario family. Both directions were swept for orphans.

### Rules

| Rule | Items | Rule | Items |
|---|---|---|---|
| `H1` | 01 | `H10` | 29 |
| `H2` | 03 | `H11` | 02 |
| `H3` | 04 | `H12` | 06 |
| `H4` | 05 | `H13` | 08 |
| `H5` | 07 | `H14` | 14 |
| `H6` | 09, 10, 35 | `H15` | 16, 26 |
| `H7` | 11, 12 | `H16` | 20, 28 |
| `H8` | 13, 32, 33 | `H17` | 19 |
| `H9` | 17, 18, 27 | `H18` | 34 |

### Principles

| Principle | Items |
|---|---|
| `P1` Study the React contract | 25 |
| `P2` Render is pure; an Effect is an escape hatch | 01, 02, 07, 35 |
| `P3` One owner per piece of state | 08, 15 |
| `P4` Compose, narrow props, markup is contract | 17 |
| `P5` Memoize by the recorded compiler switch | 13, 32, 33 |
| `P6` Know the boundary | 11, 19, 20, 34 |
| `P7` Prove behavior the way a user reaches it | 29 |

### Procedure steps

| Step | Items | Step | Items |
|---|---|---|---|
| `Procedure P1` | 25 | `Procedure P5` | 21 |
| `Procedure P2` | none — see gaps | `Procedure P6` | 22 |
| `Procedure P3` | 15 | `Procedure P7` | 31 |
| `Procedure P4` | 30 | `Procedure P8` | 23, 24, 30 |

### Items to families

| Family | Items |
|---|---|
| `REACT-SCENARIO-01` | 01, 02 |
| `REACT-SCENARIO-02` | 03, 04 |
| `REACT-SCENARIO-03` | 05, 06 |
| `REACT-SCENARIO-04` | 07, 08 |
| `REACT-SCENARIO-05` | 09, 10, 31, 35 |
| `REACT-SCENARIO-06` | 11, 12, 34 |
| `REACT-SCENARIO-07` | 13, 14, 25, 31, 32, 33 |
| `REACT-SCENARIO-08` | 15, 16, 26 |
| `REACT-SCENARIO-09` | 17, 18, 27 |
| `REACT-SCENARIO-10` | 19, 20, 25, 28 |
| `REACT-SCENARIO-11` | 21, 22 |
| `REACT-SCENARIO-12` | 23, 24, 29, 30 |

### Counts

35 items — 20 gates and 15 required, no advisory item. Identifiers `REACT-CHECK-01` through `-24` are the
slots the scenario families reserved and keep their reserved family; `-25` through `-35` were added where
a family carried more than two independently falsifiable obligations. An identifier is never reused or
renumbered once published.

Twenty-five items are conditional on a stated predicate. Three of those read the compiler switch and they
partition it: `-13` applies on the enabled branch, `-32` and `-33` on the not-enabled branch. `H8` is
therefore covered whichever way the switch is recorded, and a run that resolves every one of the three
`n/a` has not resolved `REACT-CHECK-25`.

---

## Coverage gaps

- **Procedure P2, loading the companion for the fork in play, has no item.** Reading a document leaves no
  artifact an evaluator can inspect, so any check would resolve from the reader's assertion. Its effect is
  observable only through the items that depend on the depth it carries, and those are already here.
- **Procedure P3 act 6 — error and loading boundary placement — has no item, deliberately.** No scenario
  family turns on where a boundary is placed or what it catches; `REACT-SCENARIO-11` reaches the design
  acts structurally, not this one. A check written here would have no case behind it and could not fail an
  artifact that ignored boundary placement entirely. Recorded as a gap rather than filled: the scenario
  set needs a family first.
- **`REACT-CHECK-16` depends on a second client or an equivalent out-of-band write.** Where neither is
  available in the review environment, the item resolves from the recorded invalidation trigger being
  exercised — a weaker observation than the two-client one, and the run should say which it used.
