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
    subscription during render outside H1's deterministic ref-initialization exception.
  - **Pass when.** For every changed component and hook, the render path contains no write to state
    outside its own local values, no subscription, and no call that mutates a prop, state, context value,
    or hook argument — including inside a `useMemo`, which runs during render. A render-time ref write
    passes only when it tests `ref.current === null`, performs deterministic stable construction, produces
    the same result across replay, performs no I/O, and has no user-visible or external side effect.
  - **Evidence.** Read each changed render path directly, then render the component twice with identical
    props and compare the output and any external state it touches. Record six independent ref cases:
    deterministic null-guard construction passes; changing-ref JSX, every-render assignment, I/O
    construction, time or randomness, and replay-dependent construction each fail for the stated reason.
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

- [ ] **REACT-CHECK-09** · gate · conditional — applies when an Effect in the change opens a connection
  or creates a subscription, a timer, or a listener
  - **Claim.** Every such Effect returns a cleanup that closes or removes what it created.
  - **Pass when.** For each opened connection and each created subscription, timer, and listener there is
    a matching close or removal in the returned cleanup, and the cleanup performs it rather than returning
    an empty function. The rule's pairing is the test: a connect needs its disconnect exactly as a
    subscribe needs its unsubscribe.
  - **Evidence.** Pair each creation with its teardown by reading the Effect, then unmount the component
    and confirm no connection, listener, or timer remains live.
  - **Harm on fail.** A long-lived surface accumulates leaked connections and subscriptions across mounts
    until memory, duplicate handlers, and open sockets degrade the running application.
  - **`n/a` form.** `n/a: no Effect in the change opens a connection or creates a subscription, timer, or
    listener` — cited by the diff.
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
  - **Claim.** The change records whether superseded work is cancelled or left running while its result
    is ignored.
  - **Pass when.** The change names exactly one of `cancel` or `ignore` for each qualifying work path and
    the implementation performs the recorded choice.
  - **Evidence.** Read the recorded choice, then change the input twice and compare the request lifecycle
    with that record.
  - **On fail.** Required item: open a finding. An implementation choice with no record leaves the
    resource policy unauditable.
  - **`n/a` form.** `n/a: no Effect in the change starts cancellable work, or the input cannot change
    before the work finishes` — cited by the diff and the surface's lifetime.
  - **Source.** `REACT-SCENARIO-05` · `H6` · `P2`.

- [ ] **REACT-CHECK-57** · required · conditional — applies when an Effect in the change starts
  cancellable work on an input that can change again before it finishes
  - **Claim.** The selected cancel-or-ignore policy matches the cost and lifetime of the work already
    running.
  - **Pass when.** Ignored work is cheap and bounded. Rapidly changing inputs, long-lived surfaces, or
    expensive requests cancel superseded work; letting every superseded request finish does not pass.
  - **Evidence.** Change the input several times in quick succession and observe the requests still in
    flight; a path that requires cancellation leaves at most the current request.
  - **On fail.** Required item: open a finding. `REACT-CHECK-10` and `REACT-CHECK-35` passing do not prove
    this resource decision: a stale result may be ignored and the choice may be documented while all
    obsolete work still runs.
  - **`n/a` form.** `n/a: no Effect in the change starts cancellable work, or the input cannot change
    before the work finishes` — cited by the diff and the surface's lifetime.
  - **Source.** `REACT-SCENARIO-05` · `H6` · `P2` · split from `REACT-CHECK-35`.

### From REACT-SCENARIO-06 — the server and client boundary

- [ ] **REACT-CHECK-11** · gate · conditional — applies when a value in the change crosses the
  server/client boundary
  - **Claim.** Every value crossing the boundary has its direction recorded.
  - **Pass when.** Each crossing value is identified as server-to-client or client-to-server at the
    boundary where it crosses.
  - **Evidence.** Read the boundary record and map every crossing value to one recorded direction.
  - **Harm on fail.** The failure lands on the network hop rather than the call site, so it surfaces in
    production as an opaque serialization error far from the code that caused it.
  - **`n/a` form.** `n/a: no value in the change crosses the server/client boundary` — cited by the
    absence of a boundary module in the affected set.
  - **Source.** `REACT-SCENARIO-06` · `H7` · `P6`.

- [ ] **REACT-CHECK-38** · gate · conditional — applies when a value in the change crosses the
  server/client boundary
  - **Claim.** Every crossing value is legal for its recorded direction.
  - **Pass when.** Each value is checked against the serialization set for its recorded direction, not
    against one merged notion of serializable.
  - **Evidence.** Pass each value across the real boundary in its recorded direction and inspect the
    direction-specific result.
  - **Harm on fail.** A value can have a correct direction label and still fail at the network hop,
    producing an opaque serialization error far from its source.
  - **`n/a` form.** `n/a: no value in the change crosses the server/client boundary` — cited by the
    absence of a boundary module in the affected set.
  - **Source.** `REACT-SCENARIO-06` · `H7` · `P6` · split from `REACT-CHECK-11`.

- [ ] **REACT-CHECK-12** · required · conditional — applies when a value the change needs on the other
  side cannot legally cross
  - **Claim.** Each such value is replaced by an identifier that the other side re-reads.
  - **Pass when.** The non-crossable value is not passed; an identifier crosses and the receiving side
    resolves it.
  - **Evidence.** Read the boundary call and the receiving side's resolution.
  - **On fail.** Required item: open a finding. Marking the module as client code to silence the error
    moves the boundary instead of fixing the value and does not pass.
  - **`n/a` form.** `n/a: every value the change needs on the other side may legally cross` — cited by
    the per-value legality check from `REACT-CHECK-38`.
  - **Source.** `REACT-SCENARIO-06` · `H7`.

- [ ] **REACT-CHECK-34** · gate · conditional — applies when the change adds or edits a Server Function
  - **Claim.** Every Server Function the change adds or edits validates each argument inside its own
    body.
  - **Pass when.** The body checks every argument it uses rather than assuming the shape a component
    would have sent. A caller-side check or parameter type does not pass because neither runs when the
    endpoint is called directly.
  - **Evidence.** Call the function directly with an argument no component would produce and confirm it
    refuses before using or persisting that value.
  - **Harm on fail.** The function is reachable by anything that can reach the endpoint, so an
    invalid mutation needs no UI and no bug in the calling component.
  - **`n/a` form.** `n/a: the change adds and edits no Server Function` — cited by the diff.
  - **Source.** `REACT-SCENARIO-06` · `H18` · `P6`.

- [ ] **REACT-CHECK-56** · gate · conditional — applies when the change adds or edits a Server Function
  - **Claim.** Every Server Function authorizes its mutation inside its own body.
  - **Pass when.** The function checks the caller's authority before any mutation. Caller-side UI,
    route, or component checks do not pass.
  - **Evidence.** Call the function directly as an unauthorized caller and confirm it refuses before
    mutating.
  - **Harm on fail.** A well-shaped argument can still perform an unauthorized mutation without the UI
    or component that normally calls the endpoint.
  - **`n/a` form.** `n/a: the change adds and edits no Server Function` — cited by the diff.
  - **Source.** `REACT-SCENARIO-06` · `H18` · `P6` · split from `REACT-CHECK-34`.

### From REACT-SCENARIO-10 — producer assumptions and the renderer bridge

- [ ] **REACT-CHECK-19** · gate · unconditional
  - **Claim.** Every Server Component, Server Function, or streaming server render has an identified
    producer implementation independent of its browser or Electron presentation surface.
  - **Pass when.** Each presentation/producer combination records client-only and uses no server-dependent
    feature, or names the framework or bundler that produces the feature's output.
  - **Evidence.** The presentation surface and producer architecture recorded separately at Procedure P1,
    read against the server-dependent constructs the change actually uses.
  - **Harm on fail.** The feature cannot work on its target at all, and the failure appears only when the
    client consumes output the assumed producer never created.
  - **Source.** `REACT-SCENARIO-10` · `H17` · `P6`.

- [ ] **REACT-CHECK-20** · gate · conditional — applies when the change runs in a renderer that reaches a
  privileged process
  - **Claim.** The surface exposed to the renderer is an enumerable list of named operations.
  - **Pass when.** Every reachable privileged capability appears as a distinct named entry in the shipped
    preload surface.
  - **Evidence.** Enumerate the shipped preload surface from page-context code and map each entry to the
    privileged capability it reaches.
  - **Harm on fail.** A content-injection bug in the page becomes access to whatever the privileged side
    can do, which is the difference between a display defect and code execution.
  - **`n/a` form.** `n/a: the change runs on no host with a privileged process` — cited by the recorded
    host.
  - **Source.** `REACT-SCENARIO-10` · `H16` · `P6`.

- [ ] **REACT-CHECK-42** · gate · conditional — applies when the change runs in a renderer that reaches a
  privileged process
  - **Claim.** Every exposed renderer operation has its own operation-specific argument contract.
  - **Pass when.** Each named operation accepts only the arguments needed for that capability rather
    than forwarding an arbitrary payload.
  - **Evidence.** Read every exposed signature and call it with an extra or wrong-shaped argument.
  - **Harm on fail.** A finite method list still becomes an unbounded privileged surface when each method
    forwards arbitrary data.
  - **`n/a` form.** `n/a: the change runs on no host with a privileged process` — cited by the recorded
    host.
  - **Source.** `REACT-SCENARIO-10` · `H16` · `P6` · split from `REACT-CHECK-20`.

- [ ] **REACT-CHECK-43** · gate · conditional — applies when the change runs in a renderer that reaches a
  privileged process
  - **Claim.** Every incoming privileged-process message is validated where it arrives.
  - **Pass when.** The receiver validates the operation's arguments before the first privileged action;
    preload-only validation does not substitute for receiver validation.
  - **Evidence.** Call each receiver with a payload no preload method would send and confirm rejection
    before privileged work.
  - **Harm on fail.** Another sender can bypass the page-facing wrapper and reach a privileged sink with
    unchecked input.
  - **`n/a` form.** `n/a: the change runs on no host with a privileged process` — cited by the recorded
    host.
  - **Source.** `REACT-SCENARIO-10` · `H16` · `P6` · split from `REACT-CHECK-20`.

- [ ] **REACT-CHECK-44** · gate · conditional — applies when the change runs in a renderer that reaches a
  privileged process
  - **Claim.** The renderer exposes no generic invoke-by-channel entry point.
  - **Pass when.** Page-context code cannot supply a channel or operation name that selects an otherwise
    unenumerated privileged capability.
  - **Evidence.** Search the shipped preload surface for generic dispatch and attempt to call an
    unlisted channel from page context.
  - **Harm on fail.** One generic dispatcher re-exposes the whole privileged surface under a cosmetic
    single method name.
  - **`n/a` form.** `n/a: the change runs on no host with a privileged process` — cited by the recorded
    host.
  - **Source.** `REACT-SCENARIO-10` · `H16` · `P6` · split from `REACT-CHECK-20`.

- [ ] **REACT-CHECK-28** · gate · conditional — applies when the change runs in a renderer that reaches a
  privileged process
  - **Claim.** The shipped renderer has Node integration disabled.
  - **Pass when.** `nodeIntegration` is false in the window configuration used by the packaged
    application.
  - **Evidence.** Read the packaged window configuration and confirm the effective value.
  - **Harm on fail.** Page content receives Node capability directly, so a content defect becomes
    operating-system access.
  - **`n/a` form.** `n/a: the change runs on no host with a privileged process` — cited by the recorded
    host.
  - **Source.** `REACT-SCENARIO-10` · `H16`.

- [ ] **REACT-CHECK-52** · gate · conditional — applies when the change runs in a renderer that reaches a
  privileged process
  - **Claim.** The shipped renderer has context isolation enabled.
  - **Pass when.** `contextIsolation` is true in the window configuration used by the packaged
    application.
  - **Evidence.** Read the packaged window configuration and confirm the effective value.
  - **Harm on fail.** The bridge and page share one JavaScript world, making the narrow exposed surface
    decorative.
  - **`n/a` form.** `n/a: the change runs on no host with a privileged process` — cited by the recorded
    host.
  - **Source.** `REACT-SCENARIO-10` · `H16` · split from `REACT-CHECK-28`.

- [ ] **REACT-CHECK-53** · gate · conditional — applies when the change runs in a renderer that reaches a
  privileged process
  - **Claim.** The shipped renderer has the sandbox enabled.
  - **Pass when.** `sandbox` is true in the window configuration used by the packaged application;
    context isolation is not accepted as proxy evidence.
  - **Evidence.** Read the packaged window configuration and confirm the sandbox's own effective value.
  - **Harm on fail.** The renderer retains operating-system access that the sandbox exists to remove.
  - **`n/a` form.** `n/a: the change runs on no host with a privileged process` — cited by the recorded
    host.
  - **Source.** `REACT-SCENARIO-10` · `H16` · split from `REACT-CHECK-28`.

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
  - **Pass when.** Each new `useMemo`, `useCallback`, or `memo` states which criterion earned it —
    calculation cost, where the wrapped calculation is measurably slow and its dependencies hold still
    between renders; render cost, where the component re-renders often with the same props and its render
    work is expensive; referential identity, where the value is a prop of a `memo`'d component or a
    dependency of another hook; or an Effect dependency whose identity must be held stable. A
    `useCallback` wrapping a `useState` setter does not pass: that identity is already stable, so no
    criterion can be named for it. A calculation-cost claim asserted without a measurement does not pass
    either — the criterion is that it was measured, not that it looked expensive.
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
  - **Claim.** The change records its presentation surface.
  - **Pass when.** The change identifies browser or Electron presentation from the codebase rather than
    inferring it from an example.
  - **Evidence.** The recorded presentation surface compared with the host entry and packaging
    configuration.
  - **On fail.** Required item: open a finding. Several items in this register resolve their
    applicability from this record, so its absence blocks them.
  - **Source.** `REACT-SCENARIO-07`, `REACT-SCENARIO-10` · `P1` · `Procedure P1`.

- [ ] **REACT-CHECK-49** · required · unconditional
  - **Claim.** The change records its producer architecture independently of its presentation surface.
  - **Pass when.** The change identifies client-only, build-time, or request-time/remote production from
    the actual producer implementation.
  - **Evidence.** The recorded producer architecture compared with the framework, bundler, or request
    entry that produces the output.
  - **On fail.** Required item: open a finding. A presentation label is not producer evidence.
  - **Source.** `REACT-SCENARIO-07`, `REACT-SCENARIO-10` · `P1` · `Procedure P1` · split from
    `REACT-CHECK-25`.

- [ ] **REACT-CHECK-50** · required · unconditional
  - **Claim.** The change records whether the React Compiler is enabled.
  - **Pass when.** The compiler switch is read from current configuration and recorded as enabled or not
    enabled before memoization items are selected.
  - **Evidence.** The recorded switch compared with the current compiler configuration.
  - **On fail.** Required item: open a finding. `REACT-CHECK-13`, `-32`, and `-33` cannot all be resolved
    honestly without this switch.
  - **Source.** `REACT-SCENARIO-07` · `P1` · `P5` · `Procedure P1` · split from `REACT-CHECK-25`.

- [ ] **REACT-CHECK-51** · required · unconditional
  - **Claim.** The change records whether its source is TypeScript or plain JavaScript.
  - **Pass when.** The source language is read from the affected files and project configuration before
    language-specific companions or review axes are selected.
  - **Evidence.** The recorded language compared with the affected file extensions and project
    configuration.
  - **On fail.** Required item: open a finding. The TypeScript companion and third review axis cannot be
    selected from an assumed language.
  - **Source.** `REACT-SCENARIO-07` · `P1` · `Procedure P1` · split from `REACT-CHECK-25`.

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
  - **Claim.** Every interactive element the change produces is operable by keyboard.
  - **Pass when.** Each element can be reached and activated with the keyboard alone. A generic element
    carrying a role and tab index but no keyboard activation does not pass.
  - **Evidence.** Operate each element with the keyboard only.
  - **Harm on fail.** The feature is unusable for anyone not using a mouse, and the defect is invisible
    to the mouse-driven check that produced it.
  - **`n/a` form.** `n/a: the change adds and edits no interactive element` — cited by the diff.
  - **Source.** `REACT-SCENARIO-09` · `H9` · `P4`.

- [ ] **REACT-CHECK-39** · gate · conditional — applies when the change adds or edits an interactive
  element
  - **Claim.** Every interactive element exposes the correct role.
  - **Pass when.** A role query returns each control under the semantics of the element it renders.
  - **Evidence.** Query every changed control by its expected role.
  - **Harm on fail.** Assistive technology cannot identify what operation the control performs even when
    it remains keyboard-operable.
  - **`n/a` form.** `n/a: the change adds and edits no interactive element` — cited by the diff.
  - **Source.** `REACT-SCENARIO-09` · `H9` · `P4` · split from `REACT-CHECK-17`.

- [ ] **REACT-CHECK-40** · gate · conditional — applies when the change adds or edits an interactive
  element
  - **Claim.** Every interactive element exposes an accessible name.
  - **Pass when.** A query by the element's expected accessible name returns it without relying on
    implementation-only text.
  - **Evidence.** Query every changed control by its accessible name.
  - **Harm on fail.** A user can encounter an unnamed control and cannot distinguish it from its sibling
    controls even when its role and keyboard behavior are correct.
  - **`n/a` form.** `n/a: the change adds and edits no interactive element` — cited by the diff.
  - **Source.** `REACT-SCENARIO-09` · `H9` · `P4` · split from `REACT-CHECK-17`.

- [ ] **REACT-CHECK-18** · gate · conditional — applies when the change adds or edits a dialog or overlay
  - **Claim.** Focus moves into the dialog when it opens.
  - **Pass when.** Immediately after open, the focused element is inside the dialog.
  - **Evidence.** Read the focused element immediately after opening the flow by keyboard.
  - **Harm on fail.** A keyboard or assistive-technology user is left in the page behind the dialog with
    no route into it, so the interaction cannot be completed at all.
  - **`n/a` form.** `n/a: the change adds and edits no dialog or overlay` — cited by the diff.
  - **Source.** `REACT-SCENARIO-09` · `H9`.

- [ ] **REACT-CHECK-41** · gate · conditional — applies when the change adds or edits a dialog or overlay
  - **Claim.** Focus lands on a rule-sanctioned destination when the dialog closes.
  - **Pass when.** Immediately after close, focus is on the invoking control, or the change records the
    applicable exception: the logical workflow element when the invoker no longer exists, or the next
    step's element when workflow makes it more logical. An unrecorded destination does not pass.
  - **Evidence.** Close the dialog by keyboard, read the focused element, and inspect any recorded
    exception condition.
  - **Harm on fail.** The user loses their place after completing or abandoning the dialog and must
    reconstruct the workflow.
  - **`n/a` form.** `n/a: the change adds and edits no dialog or overlay` — cited by the diff.
  - **Source.** `REACT-SCENARIO-09` · `H9` · split from `REACT-CHECK-18`.

- [ ] **REACT-CHECK-27** · required · conditional — applies when the change adds an ARIA role, state, or
  property
  - **Claim.** Each addition records which of the rule's stated exceptions justifies it.
  - **Pass when.** For each addition, the change names which of the rule's three circumstances applies:
    the native element is not implemented or lacks accessibility support; it is ruled out by a stated
    visual design constraint; or HTML has no element or attribute for the feature at all. The third is
    the one that fits a state such as marking the current item in a set, and naming a different one to
    make the item resolve does not pass.
  - **Evidence.** The recorded justification, read against the native element it replaces.
  - **On fail.** Required item: open a finding.
  - **`n/a` form.** `n/a: the change adds no ARIA role, state, or property` — cited by the diff.
  - **Source.** `REACT-SCENARIO-09` · `H9`.

---

## Bottom-up operation

### From REACT-SCENARIO-11 — skeleton first, then slices

- [ ] **REACT-CHECK-21** · required · conditional — applies in author mode
  - **Claim.** Every planned unit is present in the skeleton state.
  - **Pass when.** Each unit named in the approved design resolves to a definition in the recorded
    pre-behavior state.
  - **Evidence.** The approved unit list walked against the skeleton commit or recorded pre-behavior
    state.
  - **On fail.** Required item: open a finding. A partial unit graph cannot establish the intended
    composition.
  - **`n/a` form.** `n/a: the run is review mode, which does not build` — cited by the declared mode.
  - **Source.** `REACT-SCENARIO-11` · `Procedure P5`.

- [ ] **REACT-CHECK-45** · required · conditional — applies in author mode
  - **Claim.** The skeleton state's top unit renders its static composition.
  - **Pass when.** Rendering the top unit exercises the planned unit composition without needing feature
    behavior.
  - **Evidence.** Render output from the skeleton commit or recorded pre-behavior state.
  - **On fail.** Required item: open a finding. Empty stubs that never compose can pass a file-existence
    check while proving no structure.
  - **`n/a` form.** `n/a: the run is review mode, which does not build` — cited by the declared mode.
  - **Source.** `REACT-SCENARIO-11` · `Procedure P5` · split from `REACT-CHECK-21`.

- [ ] **REACT-CHECK-46** · required · conditional — applies in author mode when the source is TypeScript
  - **Claim.** The skeleton state passes the type-check.
  - **Pass when.** The project type-check exits clean on the skeleton commit before behavior is added.
  - **Evidence.** Fresh type-check output from the skeleton state.
  - **On fail.** Required item: open a finding. A later green type-check does not prove the skeleton's
    interfaces were coherent before behavior.
  - **`n/a` form.** `n/a: the run is review mode, or the recorded source language is plain JavaScript` —
    cited by the declared mode and `REACT-CHECK-51`.
  - **Source.** `REACT-SCENARIO-11` · `Procedure P5` · split from `REACT-CHECK-21`.

- [ ] **REACT-CHECK-47** · required · conditional — applies in author mode
  - **Claim.** The skeleton state implements no feature behavior.
  - **Pass when.** No skeleton unit contains conditional feature logic, data access, a state transition,
    or event handling.
  - **Evidence.** Inspect every skeleton unit in the pre-behavior state.
  - **On fail.** Required item: open a finding. A skeleton that already carries behavior cannot
    discriminate bottom-up construction from a whole-feature pass.
  - **`n/a` form.** `n/a: the run is review mode, which does not build` — cited by the declared mode.
  - **Source.** `REACT-SCENARIO-11` · `Procedure P5` · split from `REACT-CHECK-21`.

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
    language recorded by `REACT-CHECK-51`.
  - **Harm on fail.** One conflated pass lets a change that is fluent React but shallow as software
    through, which is the failure the three axes exist to separate.
  - **Source.** `REACT-SCENARIO-12` · `Procedure P8`.

- [ ] **REACT-CHECK-24** · gate · conditional — applies when the change adds or edits a taught React
  example
  - **Claim.** Every taught example resolves to one named primary source, exact location, and quoted
    sentence.
  - **Pass when.** For each example the run holds three things: the source name, the exact location
    within it, and the quoted sentence. An example described as coming from the documentation, with no
    locatable sentence, fails.
  - **Evidence.** The quoted sentence beside each example with its source location, opened and read
    during this run, not carried forward from an earlier review.
  - **Harm on fail.** An example with no reproducible source trace cannot be checked before it is copied
    into code.
  - **`n/a` form.** `n/a: the change adds and edits no taught example` — cited by the diff.
  - **Source.** `REACT-SCENARIO-12` · `Procedure P8`.

- [ ] **REACT-CHECK-48** · gate · conditional — applies when the change adds or edits a taught React
  example
  - **Claim.** The located source sentence states the behavior the example teaches.
  - **Pass when.** The quoted sentence supports the demonstrated behavior, not merely an API name the
    example happens to use.
  - **Evidence.** Compare the example's taught claim with the opened source sentence's complete
    normative scope.
  - **Harm on fail.** A locatable but irrelevant citation gives a wrong taught fact the appearance of
    primary-source support.
  - **`n/a` form.** `n/a: the change adds and edits no taught example` — cited by the diff.
  - **Source.** `REACT-SCENARIO-12` · `Procedure P8` · split from `REACT-CHECK-24`.

- [ ] **REACT-CHECK-29** · required · conditional — applies when the change adds or edits a component test
  - **Claim.** Each component test finds its subject through the user-visible surface.
  - **Pass when.** Queries locate elements by role, accessible name, or visible text rather than by
    component internals, state, or tree structure.
  - **Evidence.** Read the queries in the added or edited tests.
  - **On fail.** Required item: open a finding. A test that asserts implementation fails on a correct
    refactor and passes on a broken rewrite.
  - **`n/a` form.** `n/a: the change adds and edits no component test` — cited by the diff.
  - **Source.** `REACT-SCENARIO-12` · `H10` · `P7`.

- [ ] **REACT-CHECK-54** · required · conditional — applies when an added or edited component test uses
  `act`
  - **Claim.** Every `act` import comes from `react`.
  - **Pass when.** No added or edited component test imports `act` from a deprecated testing package.
  - **Evidence.** Read every `act` import in the affected tests.
  - **On fail.** Required item: open a finding.
  - **`n/a` form.** `n/a: no added or edited component test uses act` — cited by the imports.
  - **Source.** `REACT-SCENARIO-12` · `H10` · `P7` · split from `REACT-CHECK-29`.

- [ ] **REACT-CHECK-30** · required · unconditional
  - **Claim.** Every approved design item maps to an implemented unit.
  - **Pass when.** Each item in the approved design resolves to code in the change.
  - **Evidence.** Walk the approved design item by item against the implementation.
  - **On fail.** Required item: open a finding.
  - **Source.** `REACT-SCENARIO-12` · `Procedure P4` · `Procedure P8`.

- [ ] **REACT-CHECK-55** · required · unconditional
  - **Claim.** Every file in the affected set is updated or recorded as a justified no-op.
  - **Pass when.** Each affected-set file appears in the diff or carries a specific reason that the
    behavior change requires no edit there.
  - **Evidence.** Walk the affected-set file list against the diff and no-op record.
  - **On fail.** Required item: open a finding. Design-to-code closure does not prove caller, test, story,
    type, or documentation closure.
  - **Source.** `REACT-SCENARIO-12` · `Procedure P4` · `Procedure P8` · split from
    `REACT-CHECK-30`.

- [ ] **REACT-CHECK-37** · required · conditional — applies in author mode, where a design packet exists
  - **Claim.** The design packet carries every element Procedure P4 names, including where an error
    boundary catches and where a loading state is revealed.
  - **Pass when.** The packet presented and approved at P4 contains each of its named elements — the
    component-tree sketch, the prop and type surface, the state-placement table with owners, the
    server/client, presentation-surface, and producer-architecture boundary map, the error and loading
    boundary placement, and one credible alternative. A packet that simply omits the error and loading
    boundary placement fails: silence is not a placement decision.
  - **Evidence.** The approved packet read against P4's list of elements, element by element.
  - **On fail.** Required item: open a finding. An incomplete packet leaves a required design decision
    unrecorded; `REACT-CHECK-30` separately asks whether the recorded decisions reached the code.
  - **`n/a` form.** `n/a: the run is review mode, which reconstructs a packet rather than presenting one`
    — cited by the declared mode.
  - **Source.** `REACT-SCENARIO-12` · `Procedure P3` · `Procedure P4`.

### From REACT-SCENARIO-13 — Error Boundary fallback, recovery, and reach

- [ ] **REACT-CHECK-58** · gate · conditional — applies when the design claims a React Error Boundary
  catches a component-region failure
  - **Claim.** A descendant render failure shows a specific usable fallback in the claimed region.
  - **Pass when.** Injecting a deterministic descendant render throw commits intelligible fallback
    content for that region.
  - **Evidence.** The committed tree after the injected descendant render throw, including the fallback
    content.
  - **Harm on fail.** The claimed containment leaves the user with a blank or inert region and no way to
    understand or continue from the failure.
  - **`n/a` form.** `n/a: the design claims no React Error Boundary for a component-region failure` —
    cited by the reconstructed or approved boundary map.
  - **Source.** `REACT-SCENARIO-13` obligations `EB-1`, `EB-6` · `Procedure P3`.

- [ ] **REACT-CHECK-59** · gate · conditional — applies when the design claims a React Error Boundary
  catches a component-region failure
  - **Claim.** A descendant render failure leaves unaffected sibling regions usable.
  - **Pass when.** Injecting the failure replaces only the claimed failure region, and an interaction in
    an unaffected sibling still completes.
  - **Evidence.** The committed region tree after the injected throw plus one completed sibling
    interaction.
  - **Harm on fail.** A local defect removes unrelated useful work, so the boundary does not provide the
    containment its placement claims.
  - **`n/a` form.** `n/a: the design claims no React Error Boundary for a component-region failure` —
    cited by the reconstructed or approved boundary map.
  - **Source.** `REACT-SCENARIO-13` obligation `EB-1` · `Procedure P3`.

- [ ] **REACT-CHECK-60** · gate · conditional — applies when the design claims a React Error Boundary
  catches a component-region failure
  - **Claim.** The failed region has one named recovery action that returns it to its normal rendering.
  - **Pass when.** The documented reset, retry, route change, or boundary-key change supplies corrected
    input and the failed child renders again without a full application reload.
  - **Evidence.** The named recovery action exercised from the visible fallback through the recovered
    child tree.
  - **Harm on fail.** The fallback becomes a permanent dead end even after the underlying input can be
    corrected.
  - **`n/a` form.** `n/a: the design claims no React Error Boundary for a component-region failure` —
    cited by the reconstructed or approved boundary map.
  - **Source.** `REACT-SCENARIO-13` obligations `EB-2`, `EB-6` · `Procedure P3`.

- [ ] **REACT-CHECK-61** · required · conditional — applies when the design claims a React Error Boundary
  catches a component-region failure
  - **Claim.** Recovering the failed region preserves unrelated usable state.
  - **Pass when.** State changed in an unaffected sibling before the failure has the same value after the
    named recovery action restores the child.
  - **Evidence.** The sibling state recorded before failure and compared after recovery.
  - **On fail.** Required item: open a finding. Recovery that resets unrelated work exceeds the claimed
    failure region.
  - **`n/a` form.** `n/a: the design claims no React Error Boundary for a component-region failure` —
    cited by the reconstructed or approved boundary map.
  - **Source.** `REACT-SCENARIO-13` obligation `EB-2` · `Procedure P3`.

- [ ] **REACT-CHECK-62** · required · conditional — applies when the design claims a React Error Boundary
  catches a component-region failure
  - **Claim.** The boundary placement is justified by the largest useful region that may fail together.
  - **Pass when.** The boundary map names the useful failure region and rejects both a cosmetic-leaf
    placement that fragments the interface and a page-wide placement that removes unrelated useful work.
  - **Evidence.** The recorded granularity decision compared with the region tree and with leaf, region,
    and page failure placements.
  - **On fail.** Required item: open a finding. Boundary-shaped syntax does not justify where the user
    loses and retains work.
  - **`n/a` form.** `n/a: the design claims no React Error Boundary for a component-region failure` —
    cited by the reconstructed or approved boundary map.
  - **Source.** `REACT-SCENARIO-13` obligation `EB-3` · `Procedure P3`.

- [ ] **REACT-CHECK-63** · gate · conditional — applies when the design claims a React Error Boundary
  catches a component-region failure
  - **Claim.** The boundary is not credited with catching event-handler, ordinary asynchronous, or
    server-render failures.
  - **Pass when.** One injected throw in each named class follows a route other than the boundary
    fallback, and the design records all three classes as outside the boundary's reach.
  - **Evidence.** Independent event-handler, timer-callback, and server-render throws compared with the
    boundary fallback route.
  - **Harm on fail.** The design relies on containment React does not provide, leaving production failure
    paths without their actual handler.
  - **`n/a` form.** `n/a: the design claims no React Error Boundary for a component-region failure` —
    cited by the reconstructed or approved boundary map.
  - **Source.** `REACT-SCENARIO-13` obligation `EB-4` · `Procedure P3`.

- [ ] **REACT-CHECK-64** · required · conditional — applies when the design claims a React Error Boundary
  catches a component-region failure
  - **Claim.** Each unsupported failure class has its own named handling owner.
  - **Pass when.** The boundary map assigns event-handler, ordinary asynchronous, and server-render
    failures to the concrete route that observes or handles each class.
  - **Evidence.** The three owner records traced to their handling entry points.
  - **On fail.** Required item: open a finding. Correctly denying boundary coverage is incomplete when
    the unsupported failures have nowhere to go.
  - **`n/a` form.** `n/a: the design claims no React Error Boundary for a component-region failure` —
    cited by the reconstructed or approved boundary map.
  - **Source.** `REACT-SCENARIO-13` obligation `EB-4` · `Procedure P3`.

- [ ] **REACT-CHECK-65** · required · conditional — applies when the design claims a React Error Boundary
  catches a component-region failure and uses `startTransition`
  - **Claim.** A throw from work invoked inside the `startTransition` function reaches the nearest Error
    Boundary.
  - **Pass when.** Equivalent transition and timer-callback throws are injected independently, and only
    the transition throw commits the boundary fallback.
  - **Evidence.** The two injected throws and their distinct observed routes.
  - **On fail.** Required item: open a finding. Treating transition work as ordinary asynchronous work
    removes a supported containment path.
  - **`n/a` form.** `n/a: the design claims no React Error Boundary for a component-region failure, or
    the change uses no startTransition work in that region` — cited by the boundary map and affected code.
  - **Source.** `REACT-SCENARIO-13` obligation `EB-5` · `Procedure P3`.

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

- [ ] **REACT-CHECK-36** · gate · conditional — applies when the change fixes a reported defect
  - **Claim.** The reproducer recorded at Procedure P1 no longer fires on the final tree.
  - **Pass when.** The exact reproduction from P1 — the steps, input, or failing case the change was
    opened against — is re-run last, after every other gate, and does not reproduce. A green suite is not
    evidence for this item: a regression test added without first reproducing the original failure makes
    the suite green while proving nothing about the defect.
  - **Evidence.** The P1 reproducer re-run on the tree being accepted, with its output, beside the same
    reproducer's recorded failure from before the change.
  - **Harm on fail.** The change-set is accepted with the reported defect unproven-gone, which is the one
    thing a bug fix exists to establish.
  - **`n/a` form.** `n/a: the change fixes no reported defect` — cited by the change's own trigger, never
    by the absence of a recorded reproducer, which is itself a Procedure P1 failure.
  - **Source.** `REACT-SCENARIO-05` · `Procedure P1` · `Procedure P7`.

---

## Guaranteed coverage map

Every Rule and every Principle in `SKILL.md` is anchored by at least one item, and every item traces to
at least one scenario family. Both directions were swept for orphans.

### Rules

| Rule | Items | Rule | Items |
|---|---|---|---|
| `H1` | 01 | `H10` | 29, 54 |
| `H2` | 03 | `H11` | 02 |
| `H3` | 04 | `H12` | 06 |
| `H4` | 05 | `H13` | 08 |
| `H5` | 07 | `H14` | 14 |
| `H6` | 09, 10, 35, 57 | `H15` | 16, 26 |
| `H7` | 11, 12, 38 | `H16` | 20, 28, 42, 43, 44, 52, 53 |
| `H8` | 13, 32, 33 | `H17` | 19 |
| `H9` | 17, 18, 27, 39, 40, 41 | `H18` | 34, 56 |

### Principles

| Principle | Items |
|---|---|
| `P1` Study the React contract | 25, 49, 50, 51 |
| `P2` Render is pure; an Effect is an escape hatch | 01, 02, 07, 35, 57 |
| `P3` One owner per piece of state | 08, 15 |
| `P4` Compose, narrow props, markup is contract | 17, 39, 40 |
| `P5` Memoize by the recorded compiler switch | 13, 32, 33 |
| `P6` Know the boundary | 11, 19, 20, 34, 38, 42, 43, 44, 56 |
| `P7` Prove behavior the way a user reaches it | 29, 54 |

### Procedure steps

| Step | Items | Step | Items |
|---|---|---|---|
| `Procedure P1` | 25, 36, 49, 50, 51 | `Procedure P5` | 21, 45, 46, 47 |
| `Procedure P2` | none — see gaps | `Procedure P6` | 22 |
| `Procedure P3` | 15, 37, 58, 59, 60, 61, 62, 63, 64, 65 | `Procedure P7` | 31, 36 |
| `Procedure P4` | 30, 37, 55 | `Procedure P8` | 23, 24, 30, 48, 55 |

### Items to families

| Family | Items |
|---|---|
| `REACT-SCENARIO-01` | 01, 02 |
| `REACT-SCENARIO-02` | 03, 04 |
| `REACT-SCENARIO-03` | 05, 06 |
| `REACT-SCENARIO-04` | 07, 08 |
| `REACT-SCENARIO-05` | 09, 10, 31, 35, 36, 57 |
| `REACT-SCENARIO-06` | 11, 12, 34, 38, 56 |
| `REACT-SCENARIO-07` | 13, 14, 25, 31, 32, 33, 49, 50, 51 |
| `REACT-SCENARIO-08` | 15, 16, 26 |
| `REACT-SCENARIO-09` | 17, 18, 27, 39, 40, 41 |
| `REACT-SCENARIO-10` | 19, 20, 25, 28, 42, 43, 44, 49, 52, 53 |
| `REACT-SCENARIO-11` | 21, 22, 45, 46, 47 |
| `REACT-SCENARIO-12` | 23, 24, 29, 30, 37, 48, 54, 55 |
| `REACT-SCENARIO-13` | 58, 59, 60, 61, 62, 63, 64, 65 |

### Counts

65 items — 36 gates and 29 required, no advisory item. Identifiers `REACT-CHECK-01` through `-37` retain
their published identities. Identifiers `-38` through `-57` hold clauses split from those published items;
`-58` through `-65` close the obligations added by `REACT-SCENARIO-13`. An identifier is never reused or
renumbered once published.

Fifty-one items are conditional on a stated predicate. Three of those read the compiler switch and they
partition it: `-13` applies on the enabled branch, `-32` and `-33` on the not-enabled branch. `H8` is
therefore covered whichever way the switch is recorded, and a run that resolves every one of the three
`n/a` has not resolved `REACT-CHECK-50`. Contract selection begins with `-25`, `-49`, `-50`, and `-51`;
no one contract item stands in for the other three.

---

## Coverage gaps

- **Procedure P2, loading the companion for the fork in play, has no item.** Reading a document leaves no
  artifact an evaluator can inspect, so any check would resolve from the reader's assertion. Its effect is
  observable only through the items that depend on the depth it carries, and those are already here.
- **Procedure P3 act 6's loading-boundary behavior has no dedicated family.** `REACT-CHECK-37` detects a
  missing placement decision, and `REACT-SCENARIO-13` plus `REACT-CHECK-58` through `-65` close the Error
  Boundary behavior. No current child scenario specifies loading-state reveal behavior beyond recording
  its placement, so this register does not invent that upstream obligation.
- **`REACT-CHECK-16` depends on a second client or an equivalent out-of-band write.** Where neither is
  available in the review environment, the item resolves from the recorded invalidation trigger being
  exercised — a weaker observation than the two-client one, and the run should say which it used.
