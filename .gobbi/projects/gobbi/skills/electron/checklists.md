# Electron — Implementation Checklist Register

**Owns** — the binary `EL-CHECK-*` items the reserved slots in [`scenarios.md`](scenarios.md) point at, the
resolution legend they close through, and the split between coverage closure and acceptance.

**Split criterion** — an independently consumed set
([`../skill-writing/SKILL.md`](../skill-writing/SKILL.md)): a reader copies the activated rows, resolves each
against inspected evidence, and reads nothing else. Nothing here is narrative.

This register **deepens, and does not restate,** the Rules. A rule states its check and one defeater; a case
in `scenarios.md` states the situation that produces such a defeater; a row here is the one binary question a
reviewer answers, written so that the conformant-but-wrong artifact its case names resolves `FAIL`. It adds
no policy: every row traces to a live [`SKILL.md`](SKILL.md) clause and to at least one case.

| Borrowed fact | Its one owner |
|---|---|
| Every rule, its check, its defeater, and the strength bar every row below is written to | [`SKILL.md`](SKILL.md) |
| The cases these rows resolve, their design obligations, and the reserved slot numbering | [`scenarios.md`](scenarios.md) |
| The three modes, the resolution-token enum, the item field set, and the coverage-closure versus acceptance split | [`../evaluation/checklist/SKILL.md`](../evaluation/checklist/SKILL.md) |
| The perspectives a filled copy aligns to, and the finding a `FAIL` cites | [`evaluation.md`](evaluation.md) |
| The Electron depth behind each row | the nine content children, named per row |
| The Electron major each version-sensitive behavior is qualified against | [`migration.md`](migration.md) |
| The standing-skill obligations § 6's conformance block reads — the file set, the frontmatter contract, the wiring and its guards, and the cold-load record | [`../skill-writing/SKILL.md`](../skill-writing/SKILL.md) |

## Contents

1. [Frame — subject, mode, and how a box is ticked](#1-frame--subject-mode-and-how-a-box-is-ticked)
2. [Legend — resolution, coverage closure, and acceptance](#2-legend--resolution-coverage-closure-and-acceptance)
3. [Group A — entry, placement, and proof](#3-group-a--entry-placement-and-proof)
4. [Group B — the trust boundary](#4-group-b--the-trust-boundary)
5. [Group C — the shipped artifact](#5-group-c--the-shipped-artifact)
6. [Group D — the skill itself](#6-group-d--the-skill-itself)
7. [The six cosmetic-conformance probes](#7-the-six-cosmetic-conformance-probes)
8. [Coverage map, both directions](#8-coverage-map-both-directions)
9. [Pilot dispositions and stated residues](#9-pilot-dispositions-and-stated-residues)

---

## 1. Frame — subject, mode, and how a box is ticked

**Purpose** — to convert every design obligation in `scenarios.md` into one binary question whose answer rests
on inspected evidence.

**Owner** — the maintainer of `skills/electron/`. **Consumer** — the executor running
[`SKILL.md` P8](SKILL.md#p8--review-on-three-axes-then-trace) before handoff, and an independent evaluator
entering through [`evaluation.md`](evaluation.md), which selects the activated rows.

**Subject** — groups A to C read against the change-set under review; group D reads against
`skills/electron/` itself, and says so again in its heading.

**Mode** — evaluation coverage register. Every row is **gate** or **required**; there is no advisory row, and
the only resolutions are the three terminal tokens in § 2. The register carries more than nine rows and is
grouped by the scenario families, which is what this mode is for. It has no runtime pause point, so a gate's
stop action reads as *halt the handoff and open a blocking finding*.

**Use-style** — one run-level style, `do-confirm`: the work exists and the register confirms it. An author
reading forward before writing is reading `SKILL.md`'s Rules, not this file.

**The source ships unchecked.** Every box below is empty and stays empty. A run copies the activated rows into
its own filled copy, records the source version and the run identity there, and resolves them there. A tick
written into this file corrupts every later run.

**One positive outcome per row.** A box passes if and only if its stated outcome holds. The outcome may
require a conjunction — all conjuncts must hold, and a compound outcome is still one outcome — but never a
disjunction and never a sign-off. The `FAIL` clause only lists the forms the outcome can be violated in.
Ownership, a filed ticket, an assigned reviewer, and a recorded intention never stand in for the outcome.

**Presence is not the question.** Every row is written so that a wrong-but-conformant implementation resolves
`FAIL`: the guard that exists and denies the wrong thing, the pass that ran three times against one module
view, the bridge that widens through data. A row a cosmetically-conformant artifact would pass converts an
unchecked risk into a false assurance, which is worse than no row at all — the reason is
[`SKILL.md`](SKILL.md) Principle 2, and § 7 names the six artifacts that hold this register to it.

## 2. Legend — resolution, coverage closure, and acceptance

```text
[ ]                 unresolved — not a token, and never a terminal state
PASS                the outcome is verified true, citing what proves it
FAIL:<finding-id>   the outcome is verified false, citing the finding it opened
n/a:<property>      the applicability predicate is false, citing the evidence that it is
```

Those three tokens are the whole enum for this mode. There is no `recorded-open`, no `deferred`, and no
waiver: nothing here lets an owned-but-unmet gate close as anything other than `FAIL`.

- **Applicability.** A row with no `n/a when:` clause is unconditional and cannot be resolved `n/a`. A row
  that carries one may be resolved `n/a:<property>` only after inspecting the evidence that its predicate is
  false — the dependency manifest, the window inventory, the channel list. A bare property label is not
  evidence, so an applicable row can never be relabelled to dodge a gate.
- **Coverage closure.** Every applicable row holds a terminal token. That means the register was fully worked.
  It is not acceptance.
- **Acceptance.** Every applicable gate and required row resolves `PASS`. One `FAIL:<id>` leaves the run
  coverage-closed and **not accepted**. No count, no proportion, and no sign-off substitutes.
- **Evidence.** A terminal is marked only after the evidence the row names has been inspected. A tick from
  memory, from a plan, or from a label that matched is a false pass, and that is the defect this register
  exists to prevent.

## 3. Group A — entry, placement, and proof

Subject: the change-set. Families 01 to 03 of [`scenarios.md` § 6](scenarios.md#6-the-twelve-families).

- [ ] `EL-CHECK-01a` **[REQ]** — PASS if the recorded route resolves every fork the change activates to
  exactly one child doc, and the affected set names all three processes; FAIL if a fork resolves to two
  children, resolves to none, or the affected set covers only the process being edited. *Evidence:* the P1 and
  P2 record read against [`SKILL.md` P2](SKILL.md#p2--route-to-the-child-docs-for-the-forks-in-play)'s router
  table. *On fail:* return to P2 and re-route before any further edit. *(Procedure P1, P2 · `EL-SC-01a`)*
- [ ] `EL-CHECK-01b` **[REQ]** — PASS if a review-mode run reconstructed and graded the existing design packet
  first, and every edit it made to the reviewed tree is covered by a recorded authorization; FAIL if the
  review produced a diff no authorization covers, or graded the design without reconstructing the packet.
  *n/a when:* the run declared author mode. *Evidence:* the declared mode, the reconstructed packet, and the
  reviewed tree's status. *On fail:* revert the unauthorized edit and return to P1.
  *(Procedure P1 to P4 · `EL-SC-01b`)*
- [ ] `EL-CHECK-01c` **[GATE]** — PASS if each of the three review axes — the language-agnostic property, the
  TypeScript idiom, and the Electron idiom — carries its own findings list against a named artifact; FAIL if
  an axis is named with no findings and no artifact, or one axis's findings are cited for another.
  *Evidence:* three separate findings lists, each naming what it was run against. *On fail:* two of the three
  axes are unexamined behind a complete-looking record — halt the handoff and open a blocking finding.
  *(Procedure P8 · `EL-SC-01c`)*
- [ ] `EL-CHECK-01d` **[REQ]** — PASS if the route record is newer than the design packet it must cover, so
  routing was re-derived after the design's last move — a changed transport, a changed process placement, an
  added window; FAIL if the route was derived once at entry and the design moved after it. *Evidence:* the
  route record read against the design packet's final state. *On fail:* re-run P2 for the forks the new design activates.
  *(Procedure P2 · `EL-SC-01d`)*
- [ ] `EL-CHECK-02a` **[GATE]** — PASS if every source file and every fenced `ts` block in the change carries
  a process word and type-checks in that process's pass, under that process's `lib`, `types` and `electron`
  module view; FAIL if any unit is untagged, or is checked under a config belonging to another process.
  *Evidence:* the per-process unit counts from the harness run, and the tag on each changed file.
  *On fail:* a unit was certified against the wrong process boundary — halt the handoff and return to P5.
  *(EL-R-01 · `EL-SC-02a`; depth
  [`process-model.md` § 1](process-model.md#1-three-processes-one-placement-rule))*
- [ ] `EL-CHECK-02b` **[REQ]** — PASS if every unit that occupies the CPU beyond a frame runs in
  `utilityProcess.fork()`, with main's loop latency measured across the workload; FAIL if the work runs in
  main, or the claim rests on nobody having complained rather than on a measurement. *n/a when:* the change
  adds no sustained CPU work. *Evidence:* the latency measurement, and the process the unit is forked into.
  *On fail:* return to P3 step 1. *(Judgment default, Procedure P3 · `EL-SC-02b`; depth
  [`process-model.md` § 5](process-model.md#5-utilityprocessfork--the-sanctioned-offload-target))*
- [ ] `EL-CHECK-02c` **[GATE]** — PASS if a deliberate fixture importing `ipcRenderer` from `electron` inside
  a `main` unit raises `TS2305` in the main target's own pass, against that target's own generated `electron`
  module view; FAIL if the fixture compiles clean under the main pass, or the main config resolves `electron`
  to the vendor's un-scoped typings. *Evidence:* the recorded compiler output for that fixture, and the main
  config's `paths` entry. *On fail:* the privilege boundary is enforced by nothing and a wrong-process import
  ships compiling clean — halt the handoff and return to
  [`tooling-config.md` § 4](tooling-config.md#4-per-process-electron-module-views).
  *(EL-R-01, EL-R-02 · `EL-SC-02c`)*
- [ ] `EL-CHECK-02d` **[GATE]** — PASS if the preload build emits one file and **the emitted bundle**
  references nothing outside the sandboxed module surface EL-R-10 lists; FAIL if the inspected artifact is the
  preload's own import list rather than the bundle, or the bundle reaches a module outside that set.
  *Evidence:* a read of the emitted bundle. *On fail:* the preload reaches past the sandbox at runtime from a
  clean-looking source — halt the handoff and return to
  [`process-model.md` § 3](process-model.md#3-the-sandboxed-preload-surface-and-the-one-file-consequence).
  *(EL-R-10 · `EL-SC-02d`)*
- [ ] `EL-CHECK-02e` **[REQ]** — PASS if every crash-prone native unit runs outside main, with the parent
  observing its exit and reporting the failure, proven by driving the input that kills it and observing that a
  window survives; FAIL if the malformed input takes the application down, or the offload rationale names
  throughput only. *n/a when:* the change adds no crash-prone native unit. *Evidence:* the driven input and
  the surviving window. *On fail:* return to P3 step 1. *(Judgment default, Principle 1 · `EL-SC-02e`)*
- [ ] `EL-CHECK-03a` **[REQ]** — PASS if `TS2584`, `TS2591` and `TS2305` are each observed at least once in
  recorded output from a deliberate fixture; FAIL if any of the three has never been made to fire, however
  green the ordinary run is. *Evidence:* the fixture output carrying the three codes. *On fail:* return to
  [`tooling-config.md` § 3](tooling-config.md#3-the-three-target-tsconfig-split). *(EL-R-02 · `EL-SC-03a`)*
- [ ] `EL-CHECK-03b` **[GATE]** — PASS if the type-check evidence records one `tsc` invocation per declared
  process target, each against its own config, and states that pass count; FAIL if one invocation covers more
  than one process's sources, or the evidence cannot state a per-target pass count. *Evidence:* the command
  lines the build actually runs, and the recorded count. *On fail:* the boundary this skill exists to protect
  was certified by a run that cannot see it — halt the handoff and return to
  [`tooling-config.md` § 3](tooling-config.md#3-the-three-target-tsconfig-split).
  *(EL-R-02, EL-N-08 · `EL-SC-03b`)*
- [ ] `EL-CHECK-03c` **[GATE]** — PASS if each target's config resolves `electron` through its own generated
  view, so the `paths` entries differ one per target; FAIL if two configs resolve `electron` to the same view,
  or any of them reaches the vendor's un-scoped typings — however many passes ran. *Evidence:* the three
  `paths` entries, read after every `extends` is resolved. *On fail:* three green passes certify every
  wrong-process import — halt the handoff and return to
  [`tooling-config.md` § 4](tooling-config.md#4-per-process-electron-module-views).
  *(EL-R-02, EL-N-08 · `EL-SC-03c`)*
- [ ] `EL-CHECK-03d` **[REQ]** — PASS if the module-view generator exits non-zero unless its substitution
  matches exactly one line; FAIL if a zero-match or a multi-match run still emits a view. *Evidence:* the
  generator driven against a source its substitution does not match. *On fail:* return to
  [`tooling-config.md` § 4](tooling-config.md#4-per-process-electron-module-views). *(EL-R-02 · `EL-SC-03d`)*
- [ ] `EL-CHECK-03e` **[REQ]** — PASS if every changed unit that touches neither an ambient global nor the
  `electron` module has its process tag confirmed by a reviewer against the module's role, and the change's
  evidence does not cite the type-check for those units; FAIL if a green pass is offered as proof of such a
  unit's tag. *Evidence:* the reviewer's per-unit confirmation. *On fail:* return to P3 step 1.
  *(EL-R-01 residue · `EL-SC-03e`)*

## 4. Group B — the trust boundary

Subject: the change-set. Families 04 to 08.

- [ ] `EL-CHECK-04a` **[GATE]** — PASS if every exposed function names its own channel as a literal in its own
  body and the exposed key set is written out; FAIL if any exposed key is generated, or takes a channel name
  as a parameter. *Evidence:* the object passed to `exposeInMainWorld`, read key by key. *On fail:* the
  renderer's reachable surface is not the reviewed one — halt the handoff and return to
  [`ipc.md` § 5](ipc.md#5-the-bridge-surface-one-method-per-message). *(EL-R-07 · `EL-SC-04a`)*
- [ ] `EL-CHECK-04b` **[GATE]** — PASS if the exposed key set is diffed across the change and every added key
  appears as an edited line in the preload; FAIL if the surface can widen through a data edit — a manifest, a
  map, a generated loop — with no line in the preload diff. *Evidence:* the exposed key set before and after,
  compared against the preload diff. *On fail:* the bridge widens with nothing in review to see, and
  `EL-CHECK-04a` passes the same artifact because every generated function does close over a literal — halt
  the handoff and open a blocking finding against
  [`ipc.md` § 6](ipc.md#6-the-four-bridge-anti-patterns). *(EL-R-07 · `EL-SC-04b`)*
- [ ] `EL-CHECK-04c` **[GATE]** — PASS if a test asserts, key by key, that every key of the object **the
  renderer receives** is a function of the expected arity; FAIL if any expected key is missing or is not such
  a function there, or the evidence is only that the exposed object is defined. *Evidence:* the assertion run
  in the renderer against the received object, never against the object the preload passed in. *On fail:* the
  bridge reported nothing and every call site is dead — halt the handoff and return to
  [`ipc.md` § 6](ipc.md#6-the-four-bridge-anti-patterns), whose behavior
  [`migration.md` § 2](migration.md#2-the-removal-and-deprecation-index) indexes and qualifies.
  *(EL-N-03, EL-R-07 · `EL-SC-04c`)*
- [ ] `EL-CHECK-04d` **[GATE]** — PASS if every argument every exposed callback receives comes from the
  message payload alone; FAIL if a value read from the internal event reaches the renderer in any argument
  position, including a later one. *Evidence:* each listener wrapper's forwarded arguments, traced to their
  source. *On fail:* the renderer holds a main-process object, and the naive reading — "forwards no first
  parameter" — passes the same wrapper: halt the handoff and return to
  [`ipc.md` § 5](ipc.md#5-the-bridge-surface-one-method-per-message). *(EL-R-08 · `EL-SC-04d`)*
- [ ] `EL-CHECK-04e` **[REQ]** — PASS if every value crossing a boundary is checked against the table for
  **that** direction, with its arrival asserted on the far side of each direction separately; FAIL if one
  round-trip on the permissive direction is the evidence for both. *Evidence:* the per-direction arrival
  assertions. *On fail:* return to [`ipc.md` § 4](ipc.md#4-where-the-two-tables-disagree).
  *(EL-N-04 · `EL-SC-04e`)*
- [ ] `EL-CHECK-04f` **[REQ]** — PASS if every main-to-renderer subscription returns a disposer that the
  consumer calls in its cleanup path, proven by a mount, unmount and remount with a live-listener count; FAIL
  if a single-mount test is the evidence, or listeners accumulate across remounts. *n/a when:* the change adds
  no main-to-renderer push. *Evidence:* the listener count across the remount cycle. *On fail:* return to
  [`renderer-react.md` § 4](renderer-react.md#4-moving-an-ipc-push-into-react-state).
  *(Procedure P6 · `EL-SC-04f`)*
- [ ] `EL-CHECK-05a` **[GATE]** — PASS if, per handler, a null frame, a frame with `detached === true`, an
  off-allowlist origin and a malformed payload are each driven through it and the action is not performed in
  any of the four; FAIL if any of the four is untested, or one branch's verdict is generalized to the rest.
  *Evidence:* four driven inputs per handler, each with the action's effect unobserved. *On fail:* a handler
  acts for a sender it cannot prove — halt the handoff and return to
  [`testing.md` § 4](testing.md#4-the-sender-seam-producing-a-null-and-a-detached-frame).
  *(EL-R-09 · `EL-SC-05a`)*
- [ ] `EL-CHECK-05b` **[GATE]** — PASS if every guard denies on `detached === true` through a branch separate
  from its null branch, proven by driving a non-null frame with `detached === true` whose `.url` reads as an
  allowlisted origin and observing the denial; FAIL if such a frame reaches the action, or the guard's only
  frame test is a null check. *Evidence:* the detached-frame input and the observed denial. *On fail:* a
  mid-navigation frame acts with the previous origin's authority — halt the handoff and return to
  [`ipc.md` § 7](ipc.md#7-the-sender-contract-two-failure-outcomes-two-deny-branches).
  *(EL-R-09 `DERIVED` · `EL-SC-05b`)*
- [ ] `EL-CHECK-05c` **[GATE]** — PASS if every `event.senderFrame` read is lexically before the first `await`
  in its handler, confirmed by reading each handler, and the change's evidence does not cite the behavioral
  suite for that position; FAIL if a read sits inside a `.then()` callback or after an `await`, or a green
  behavioral suite is offered as proof of the read's position. *Evidence:* a per-handler read of the source.
  *On fail:* the frame is resolved after the navigation that invalidates it, and no runner can stage the race
  — halt the handoff and return to
  [`ipc.md` § 7](ipc.md#7-the-sender-contract-two-failure-outcomes-two-deny-branches).
  *(EL-R-09 · `EL-SC-05c`)*
- [ ] `EL-CHECK-05d` **[GATE]** — PASS if every `ipcMain.handle` and `ipcMain.on` in the change carries the
  full sender guard; FAIL if any handler is exempted, and in particular if an exemption is justified by the
  calling renderer being first-party. *Evidence:* the handler inventory, each entry mapped to its guard.
  *On fail:* a navigated frame or an injected script reaches an unguarded handler — halt the handoff and
  return to P3 step 3. *(Principle 3, EL-R-09 · `EL-SC-05d`)*
- [ ] `EL-CHECK-05e` **[GATE]** — PASS if every handler narrows its payload at runtime on the main side before
  use, proven by sending a payload that violates the declared shape and observing that the action is not
  performed; FAIL if a parameter annotation is the only validation, or the malformed payload reaches the
  action. *Evidence:* the violating payload and the unobserved action. *On fail:* the annotation is gone by
  the time the message arrives and main acts on an attacker's shape — halt the handoff and return to
  [`ipc.md` § 8](ipc.md#8-runtime-validation-lives-on-the-main-side).
  *(EL-R-09 `DERIVED` · `EL-SC-05e`)*
- [ ] `EL-CHECK-06a` **[GATE]** — PASS if the security evidence names each of the nine code-only items
  individually and gives each its own result with a reason; FAIL if any item carries a verdict with no reason,
  including a blanket "not applicable" across the list. *Evidence:* the nine per-item results. *On fail:* the
  list is present and the property unexamined — halt the handoff and return to
  [`security.md` § 4](security.md#4-bucket-b-the-ten-controls-you-must-write).
  *(EL-R-04, EL-N-01 · `EL-SC-06a`)*
- [ ] `EL-CHECK-06b` **[GATE]** — PASS if, for each origin-sensitive item, a test drives an **allowed** input
  from a **disallowed origin** and observes the denial; FAIL if the guard's decision reads only the capability
  or the URL and never the requesting origin, or the origin-sensitive evidence consists of disallowed-input
  tests alone. *Evidence:* the inverted test per origin-sensitive item, per
  [`testing.md` § 5](testing.md#5-the-five-origin-sensitive-adversarial-tests). *On fail:* an unrelated origin
  holds a granted capability — halt the handoff and return to
  [`security.md` § 5](security.md#5-item-5-permissions-are-a-pair). *(EL-R-04 · `EL-SC-06b`)*
- [ ] `EL-CHECK-06c` **[GATE]** — PASS if the permission request handler and the permission check handler are
  both registered and decide by the same verdict, proven by driving a capability through the check path; FAIL
  if one of the two is registered, or the evidence exercises the request path only. *Evidence:* both
  registrations, and the check-path capability driven. *On fail:* the unregistered half sits at its default
  and grants what the registered half denies — halt the handoff and return to
  [`security.md` § 5](security.md#5-item-5-permissions-are-a-pair).
  *(EL-R-04 `DERIVED` pair · `EL-SC-06c`)*
- [ ] `EL-CHECK-07a` **[GATE]** — PASS if the navigation guard is registered on `will-frame-navigate` and on
  `will-redirect`, with a subframe navigation and a redirect each observed reaching it; FAIL if the evidence
  drives the main frame only, so the tests cannot tell the events apart. *Evidence:* an in-allowlist URL
  driven from a subframe and from a redirect, with the guard observed consulted. *On fail:* every subframe
  navigation is admitted — halt the handoff and return to
  [`security.md` § 6](security.md#6-item-13-the-navigation-event-surface). *(EL-R-05 · `EL-SC-07a`)*
- [ ] `EL-CHECK-07b` **[GATE]** — PASS if the guard's registration covers the frames at risk, so an
  off-allowlist navigation from a **subframe** is denied; FAIL if the allowlist is attached to `will-navigate`
  alone, however defect-free the origin comparison inside it is. *Evidence:* the subframe navigation and its
  denial. *On fail:* the guard was never called for the frame that mattered — halt the handoff and return to
  [`security.md` § 6](security.md#6-item-13-the-navigation-event-surface). *(EL-R-05 · `EL-SC-07b`)*
- [ ] `EL-CHECK-07c` **[GATE]** — PASS if every `webContents` the app creates, including one created after
  startup, has a deny-by-default window-open handler registered at its creation, proven by opening a
  non-allowlisted URL from the most recently created surface; FAIL if the handler is registered on the first
  window only, or a single-window test is the evidence. *Evidence:* the `webContents` inventory with each
  registration site, and the open driven from the newest surface. *On fail:* the second window opens anything
  — halt the handoff and return to
  [`security.md` § 7](security.md#7-items-14-and-15-opening-windows-and-opening-urls).
  *(EL-R-06 · `EL-SC-07c`)*
- [ ] `EL-CHECK-07d` **[GATE]** — PASS if every URL parse-failure path denies, proven by driving a malformed
  and a relative URL and observing both denials; FAIL if a `catch` returns allow, or the parse-failure path is
  untested. *Evidence:* the two driven URLs and their denials. *On fail:* a malformed URL is admitted by a
  check that reads as correct — halt the handoff and return to
  [`security.md` § 6](security.md#6-item-13-the-navigation-event-surface). *(EL-R-05 · `EL-SC-07d`)*
- [ ] `EL-CHECK-07e` **[GATE]** — PASS if every main-process `loadURL` and `loadFile` call site receives a URL
  that is not derived from renderer input and not derived from any other untrusted source, confirmed by
  reading each call site; FAIL if one takes an untrusted value, or the navigation guard is cited as covering
  the call. *Evidence:* the
  `loadURL` and `loadFile` call-site inventory, each argument traced to its source. *On fail:* the navigation
  that neither event emits for is performed by main itself — halt the handoff and return to
  [`security.md` § 6](security.md#6-item-13-the-navigation-event-surface). *(EL-R-05 residue · `EL-SC-07a`)*
- [ ] `EL-CHECK-07f` **[GATE]** — PASS if a packaged non-special custom-scheme URL is matched by an exact
  parsed `.protocol` + `.host` pair, the legitimate packaged entry is admitted, and `file:`, `data:`,
  `about:`, and a lookalike custom host are all denied; FAIL if the guard compares the custom URL's
  `.origin`, derives an allowlist containing `"null"`, or admits any other opaque-origin scheme.
  *Evidence:* the allowed packaged entry plus the four denied adversarial URLs. *On fail:* distinct opaque
  origins collapse to the same serialized sentinel and the allowlist either denies the app or fails open —
  halt the handoff and return to
  [`security.md` § 6](security.md#compare-the-parsed-security-identity-never-a-string-prefix).
  *(EL-R-05 · `EL-SC-07e`)*
- [ ] `EL-CHECK-08a` **[GATE]** — PASS if every key present in each `webPreferences` object is compared
  against its documented default and each deviation carries a recorded justification; FAIL if the compared set
  is smaller than the object's own key set, or a deviation ships with no justification. *Evidence:* the
  key-by-key diff at every window construction site. *On fail:* a key silently weakens the posture the
  defaults carry — halt the handoff and return to
  [`security.md` § 3](security.md#3-the-webpreferences-defaults). *(EL-R-03 · `EL-SC-08a`)*
- [ ] `EL-CHECK-08b` **[GATE]** — PASS if each present key's documented default is resolved from the
  `webPreferences` structures document that [`security.md` § 3](security.md#3-the-webpreferences-defaults)
  names as its single owner; FAIL if a present key is passed over because no summary row covers it.
  *Evidence:* the resolved default for each key, with its source named. *On fail:* a deviation outside the
  summarized rows is invisible and the posture reads clean — halt the handoff and open a blocking finding.
  *(EL-R-03 · `EL-SC-08b`)*
- [ ] `EL-CHECK-08c` **[GATE]** — PASS if the key-by-key diff flags every key set to a value less safe than
  its documented default, including a key that restores a capability a named prohibition removed; FAIL if the
  evidence for the prohibition is a grep for the forbidden line. *Evidence:* the diff's flagged set, compared
  against the object's keys. *On fail:* the prohibition is honored by name and the capability is back — halt
  the handoff and return to
  [`process-model.md` § 6](process-model.md#6-what-nodeintegration-true-does-to-this-map).
  *(EL-N-02 · `EL-SC-08c`)*

## 5. Group C — the shipped artifact

Subject: the change-set and what it packages. Families 09 to 11.

- [ ] `EL-CHECK-09a` **[GATE]** — PASS if every packaged-only result names the packaged, signed artifact it
  was read from; FAIL if any such result was read from an unpackaged run. *Evidence:* the artifact identifier
  beside each result. *On fail:* a property was demonstrated in the one runtime nobody ships — halt the
  handoff and re-run P7 against the artifact. *(Principle 8, Procedure P7 · `EL-SC-09a`)*
- [ ] `EL-CHECK-09b` **[REQ]** — PASS if the router choice is justified against the packaged load path, with a
  nested-route reload of the packaged app resolving; FAIL if a dev-server reload is the evidence. *n/a when:*
  the renderer has no client-side router. *Evidence:* the packaged reload at a deep route. *On fail:* return
  to [`renderer-react.md` § 1](renderer-react.md#1-routing-under-the-packaged-origin).
  *(Judgment default · `EL-SC-09b`)*
- [ ] `EL-CHECK-09c` **[GATE]** — PASS if every one of the nine code-only items carries evidence of its own,
  none of which is the absence of renderer console output; FAIL if a clean development console appears as
  evidence for any of them. *Evidence:* the nine results and what each was read from. *On fail:* the code-only
  surface, which no warning covers, is unexamined — halt the handoff and return to
  [`security.md` § 2](security.md#2-why-a-clean-dev-console-proves-almost-nothing).
  *(EL-N-01 · `EL-SC-09c`)*
- [ ] `EL-CHECK-09d` **[GATE]** — PASS if a search of the packaged artifact for the development server's URL
  literal returns nothing, and exactly one build-time branch decides the load path; FAIL if the literal is
  present, however dead the branch that would use it. *Evidence:* the search over the packaged artifact.
  *On fail:* the shipped bundle carries a live pointer at a development origin — halt the handoff and return
  to [`tooling-config.md` § 6](tooling-config.md#6-the-dev-vs-production-renderer-load-path).
  *(EL-R-11 · `EL-SC-09d`)*
- [ ] `EL-CHECK-09e` **[GATE]** — PASS if the fuse posture is read back from every signed platform and
  architecture that ships and compared entry by entry against the intended posture, with an entry the read
  does not report counted as a failure; FAIL if one artifact stands for the shipped set, or the comparison is
  scored over the entries the tool happened to report. *Evidence:* one read per shipped artifact, compared
  against the intended posture. *Residue:* the read invocation this row depends on carries `SKILL.md`'s
  `UNVERIFIED-AGAINST-ARTIFACT` marker — it is verified against the tool's own documentation, not against a
  packaged build. *On fail:* an unflipped artifact ships and cannot be recalled — halt the handoff and return
  to [`packaging-distribution.md` § 3](packaging-distribution.md#3-flipping-the-fuses-before-signing).
  *(EL-R-12 · `EL-SC-09e`)*
- [ ] `EL-CHECK-09f` **[GATE]** — PASS if `open-url` and `open-file` are attached during the entry module's
  first synchronous evaluation, confirmed by reading the entry module's own statements, with a cold start of
  the packaged app from a link delivering the URL; FAIL if the module carrying the registration is reached
  through a dynamic import or through a helper called after ready — textual top level is not the property.
  *n/a when:* the app registers no deep-link scheme. *Evidence:* the entry module read, plus the cold start.
  *On fail:* the launching URL is lost on every cold start — halt the handoff and return to
  [`windows-native.md` § 2](windows-native.md#2-lifecycle-ordering-what-is-registered-before-ready).
  *(EL-R-13 · `EL-SC-09f`)*
- [ ] `EL-CHECK-09g` **[REQ]** — PASS if every asset a renderer component addresses resolves in the packaged
  app, with no main-side filesystem path having crossed to build its URL, confirmed by loading the packaged
  app and observing the asset; FAIL if the packaged path points inside the archive, or the development run is
  the evidence. *Evidence:* the packaged load and the observed asset. *On fail:* return to
  [`renderer-react.md` § 3](renderer-react.md#3-__dirname-asar-and-the-paths-a-component-must-never-build).
  *(Principle 8 · `EL-SC-09g`)*
- [ ] `EL-CHECK-09h` **[GATE]** — PASS if `requestSingleInstanceLock()` is called before any deep-link URL is
  handled; FAIL if a link is processed before the lock, or a second instance handles one. *n/a when:* the app
  registers no deep-link scheme. *Evidence:* the call order in the entry module, and a second launch driven
  against a running instance. *On fail:* two instances answer the same link and one of them holds no state —
  halt the handoff and return to
  [`windows-native.md` § 3](windows-native.md#3-deep-links-arrive-by-three-routes).
  *(EL-R-13 · `EL-SC-09f`)*
- [ ] `EL-CHECK-10a` **[GATE]** — PASS if no credential is recoverable from the app's shipped and
  runtime-written surfaces — the packed archive, the unpacked tree, and everything it writes at runtime, all
  three inspected; FAIL if the evidence is bundle-scoped, or a fetched token is cached in plaintext under the
  user-data path. *n/a when:* the change handles no secret. *Evidence:* the three inspections, named
  individually. *On fail:* the secret is readable on every user's disk — halt the handoff
  and return to
  [`packaging-distribution.md` § 2](packaging-distribution.md#2-what-goes-into-the-artifact-and-what-asar-is-not).
  *(EL-N-06 · `EL-SC-10a`)*
- [ ] `EL-CHECK-10b` **[REQ]** — PASS if the platform keystore's availability result is read before a secret
  is stored, with a run on a machine where no backend is available storing nothing; FAIL if a happy-path run
  on a machine that has a keystore is the evidence. *n/a when:* the change stores no secret. *Evidence:* the
  backend-unavailable run and the bytes it did not write. *On fail:* return to
  [`windows-native.md` § 6](windows-native.md#6-the-four-platform-failure-modes).
  *(Principle 8 · `EL-SC-10b`)*
- [ ] `EL-CHECK-10c` **[GATE]** — PASS if every native call whose failure arrives as a return value is
  asserted on per platform, with the failing condition driven; FAIL if a `try`/`catch` around the call is the
  evidence, or the return value is discarded. *Evidence:* the asserted return value on each platform that
  ships. *On fail:* the feature does nothing, nothing is raised, and the code path looks taken — halt the
  handoff and return to
  [`windows-native.md` § 6](windows-native.md#6-the-four-platform-failure-modes).
  *(Principle 2 · `EL-SC-10c`)*
- [ ] `EL-CHECK-11a` **[REQ]** — PASS if the change sweeps for the stale-idiom tells
  [`migration.md` § 3](migration.md#3-stale-training-data-tells) lists and confirms every guard it relies on
  is reached at all; FAIL if a successful build is the evidence, or a guard's reachability is assumed.
  *Evidence:* the sweep output and the reachability observation. *On fail:* return to
  [`migration.md` § 2](migration.md#2-the-removal-and-deprecation-index).
  *(EL-N-05, Principle 7 · `EL-SC-11a`)*
- [ ] `EL-CHECK-11b` **[GATE]** — PASS if the removed-API sweep covers the bundled dependency tree as well as
  the authored source; FAIL if it covers the authored source only. *Evidence:* the sweep's scope, read from
  the command that ran it. *On fail:* the app breaks at runtime on a supported major from a clean source —
  halt the handoff and replace or pin the dependency. *(EL-N-05 · `EL-SC-11b`)*
- [ ] `EL-CHECK-11c` **[REQ]** — PASS if a lookup the removal index does not cover is distinguishable from one
  it answered, the index stating its ceiling and its non-exhaustiveness and routing the unmatched query to the
  vendor's breaking-changes document at the target major; FAIL if absence from the index reads as a clean bill
  of health. *Evidence:* [`migration.md` § 1](migration.md#1-coverage-ceiling-and-freshness-stamp) read, and
  one unmatched query followed. *On fail:* return to that section. *(Principle 7 · `EL-SC-11c`)*
- [ ] `EL-CHECK-11d` **[GATE]** — PASS if every native module in the change loads under the shipped Electron
  runtime on a machine that did not build it, its binary built against Electron's ABI rather than the system
  Node's; FAIL if the fix was a system-Node rebuild, or the only load evidence comes from the building
  machine. *n/a when:* the change ships no native module. *Evidence:* the runtime the binary was built
  against, and a load on a second machine. *On fail:* the module fails only on the user's machine — halt the
  handoff and return to [`packaging-distribution.md` § 5](packaging-distribution.md#5-native-modules).
  *(EL-N-07 · `EL-SC-11d`)*

## 6. Group D — the skill itself

Subject: `skills/electron/`, not a change-set. These five rows bind whoever maintains this skill, and
correspond to the three maintainer rules in [`SKILL.md`](SKILL.md#rules-for-this-skills-maintainer). Five
further standing properties — the file set, the frontmatter, the enumeration sites, the guards, and the
cold-load record — sit in the conformance block below the rows, outside the `EL-CHECK-*` set.

- [ ] `EL-CHECK-12a` **[GATE]** — PASS if the behavior-claim register is walked in both directions, so every
  register entry resolves to a qualified claim in the file it names **and** every version-sensitive behavior
  claim in the skill has an entry; FAIL if only the register-to-text direction was walked. *Evidence:* the two
  walks, each recorded with what it examined. *On fail:* an unregistered claim sits unqualified while every
  row checks out — halt and open a blocking finding against
  [`migration.md` § 4](migration.md#4-the-behavior-claim-register). *(EL-R-14 · `EL-SC-12a`)*
- [ ] `EL-CHECK-12b` **[GATE]** — PASS if the extracted unit count plus the counted `uncompiled` `tsx` blocks
  equals the number of fenced code blocks in the skill, both numbers recorded with the run, and an unsupported
  fence language is a hard error; FAIL if a unit count is recorded with no denominator, or a fence in another
  language is discarded silently. *Evidence:* the harness run's two counts and the fenced-block total.
  *On fail:* examples transcribed into another fence language are unverified and uncounted — halt and fix the
  fences before the run is claimed. *(EL-R-16 · `EL-SC-12b`)*
- [ ] `EL-CHECK-12c` **[GATE]** — PASS if each rotation entry carries the quoted sentence with its current
  line number in the re-fetched source; FAIL if the entry names its sources and a date only. *Evidence:* the
  quoted line and its number, per entry. *On fail:* a self-report and a real rotation are indistinguishable —
  halt and re-fetch. *(EL-R-15 · `EL-SC-12c`)*
- [ ] `EL-CHECK-12d` **[GATE]** — PASS if the next-rotation date is re-derived from the published release
  schedule at review time and lies in the future; FAIL if it is read from the file rather than derived, or it
  has already passed. *Evidence:* the derived date beside the one written in
  [`SKILL.md`](SKILL.md#version-window). *On fail:* the window points at a rotation that already happened —
  halt and rotate. *(EL-R-15 · `EL-SC-12d`)*
- [ ] `EL-CHECK-12e` **[REQ]** — PASS if every version-sensitive behavior claim the change adds carries its
  register row in the same change; FAIL if the claim ships and its row is left for later. *Evidence:* the
  change's diff, with each added claim matched to an added row. *On fail:* return to
  [`migration.md` § 4](migration.md#4-the-behavior-claim-register). *(EL-R-14 · `EL-SC-12a`)*

### The standing-skill conformance block

The five rows above read the skill's **content**. Five further properties hold of it as a **file set and a
wired artifact**, and no content row can reach them. They are entries here rather than `EL-CHECK-*` rows for
two reasons: their policy owner is [`../skill-writing/SKILL.md`](../skill-writing/SKILL.md) and not a
[`SKILL.md`](SKILL.md) clause, and they reserve no case in [`scenarios.md`](scenarios.md), so they close
through no slot. Work them whenever the file set, the frontmatter, or the wiring changes. Each is read from a
command or a named artifact, never from recollection.

| # | The standing property | Evidence that reads it | Its owner |
|---|---|---|---|
| 1 | The directory holds exactly the twelve files [`SKILL.md` P2](SKILL.md#p2--route-to-the-child-docs-for-the-forks-in-play) routes to, plus `SKILL.md` — thirteen, with no subdirectory | `ls -1` over the skill directory read against the P2 router table, and a `find -mindepth 1 -type d` that returns nothing | P4's altitude decision, which keeps every child one hop from `SKILL.md` |
| 2 | `SKILL.md` carries the four required frontmatter keys in order — `name`, `description`, `allowed-tools`, `skill-type` — with `skill-type` reading `operation`, and no key outside the named allowlist | the frontmatter block itself, read key by key | P2's frontmatter contract |
| 3 | Every site in this project that enumerates its skills names `electron`, and no site still calls a shipped skill "future" | a sweep across the skills tree scoped to exclude this directory, with every hit read rather than counted | P7 step 4, the index-placement convention |
| 4 | The project sync mechanism and the guard scripts run and exit 0, and no runtime mirror was built by hand | `scripts/sync-plugin-package.sh --check`, `scripts/test-sync-plugin-package.sh`, `scripts/check-codex-plugin-smoke.sh`, and `scripts/check-markdown-links.sh` over this directory — each exit code recorded with its run | P7 steps 1 to 3 |
| 5 | One cold-load record exists for each target runtime, carrying exactly P7's field set and no other field | the records themselves, one per runtime, read field by field | P7's record contract |

**Entry 5 is the one that degrades quietly.** A runtime with no record reads the same as a runtime that was
never a target. Name every target runtime first, then match a record to each; a runtime left without one is an
unmet obligation and is reported as one, not dropped from the list. Entry 3 has the same shape in reverse: a
count of enumeration sites proves nothing unless each site was read, because a site that never mentioned any
skill is indistinguishable from one that mentions the wrong set.

## 7. The six cosmetic-conformance probes

Each row below names an artifact that compiles, runs, and looks complete. This register is correct only if
every one of them resolves `FAIL` on the row named. Re-run these against any row this file gains later: a row
one of these artifacts would pass has lost its discriminating power and must be rewritten, not annotated. The
cases are owned by [`scenarios.md` § 7](scenarios.md#7-the-six-cosmetic-conformance-cases).

| # | The conformant artifact | Resolves `FAIL` on | Because the row asks for |
|---|---|---|---|
| 1 | one tsconfig whose `lib` and `types` cover every process; the project type-checks green | `EL-CHECK-03b` | a per-target pass count, which this evidence cannot state |
| 2 | a preload that hands the whole renderer IPC module across the bridge; nothing throws at exposure | `EL-CHECK-04c` | each key of the object **the renderer receives** asserted to be a function of the expected arity |
| 3 | a permission handler whose default branch denies, whose twin is registered, and which passes every disallowed-permission test | `EL-CHECK-06b` | an **allowed** capability driven from a **disallowed origin**, denied |
| 4 | a defect-free parsed-`origin` allowlist attached to the main-frame navigation event alone, or a packaged custom scheme represented by its opaque `"null"` origin | `EL-CHECK-07b`, `EL-CHECK-07f` | an off-allowlist navigation from a **subframe**, denied; and an exact custom-scheme `.protocol` + `.host` match that rejects every other opaque origin |
| 5 | a sender guard that null-checks the frame and compares its origin against a literal allowlist | `EL-CHECK-05b` | a non-null frame with `detached === true` and an allowlisted `.url`, denied |
| 6 | a `main`-tagged module importing the renderer-side IPC module; three passes run and all are green | `EL-CHECK-02c` | `TS2305` from the main target's **own** generated `electron` view |

Two more artifacts are the reason a neighbouring row exists rather than being folded away: the manifest-built
bridge passes `EL-CHECK-04a`, so `EL-CHECK-04b` carries the widening property; the handler whose sender read
moved past the first `await` passes `EL-CHECK-05a`, so `EL-CHECK-05c` carries the static one.

## 8. Coverage map, both directions

**Row to source.** Every row above ends in its trace: one or more `SKILL.md` clauses and the case it resolves.
No row traces to a clause this skill does not teach.

**Case to row.** Every case `EL-SC-NNx` in [`scenarios.md` § 6](scenarios.md#6-the-twelve-families) resolves
to `EL-CHECK-NNx`, the slot it reserved. Three cases carry a second row, because their obligation held two
independently falsifiable clauses: `EL-SC-07a` also owns `EL-CHECK-07e`, `EL-SC-09f` also owns
`EL-CHECK-09h`, and `EL-SC-12a` also owns `EL-CHECK-12e`. One later case uses the next free row because
`EL-CHECK-07e` was already reserved: `EL-SC-07e` owns `EL-CHECK-07f`. No case is unreached: 54 cases,
57 rows.

**Clause to row.** Every hard rule and every prohibition reaches at least one row.

| Clause | Rows |
|---|---|
| EL-R-01 | `EL-CHECK-02a`, `EL-CHECK-02c`, `EL-CHECK-03e` |
| EL-R-02 | `EL-CHECK-02c`, `EL-CHECK-03a`, `EL-CHECK-03b`, `EL-CHECK-03c`, `EL-CHECK-03d` |
| EL-R-03 | `EL-CHECK-08a`, `EL-CHECK-08b` |
| EL-R-04 | `EL-CHECK-06a`, `EL-CHECK-06b`, `EL-CHECK-06c` |
| EL-R-05 | `EL-CHECK-07a`, `EL-CHECK-07b`, `EL-CHECK-07d`, `EL-CHECK-07e`, `EL-CHECK-07f` |
| EL-R-06 | `EL-CHECK-07c` |
| EL-R-07 | `EL-CHECK-04a`, `EL-CHECK-04b`, `EL-CHECK-04c` |
| EL-R-08 | `EL-CHECK-04d` |
| EL-R-09 | `EL-CHECK-05a`, `EL-CHECK-05b`, `EL-CHECK-05c`, `EL-CHECK-05d`, `EL-CHECK-05e` |
| EL-R-10 | `EL-CHECK-02d` |
| EL-R-11 | `EL-CHECK-09d` |
| EL-R-12 | `EL-CHECK-09e` |
| EL-R-13 | `EL-CHECK-09f`, `EL-CHECK-09h` |
| EL-R-14 | `EL-CHECK-12a`, `EL-CHECK-12e` |
| EL-R-15 | `EL-CHECK-12c`, `EL-CHECK-12d` |
| EL-R-16 | `EL-CHECK-12b` |
| EL-N-01 | `EL-CHECK-06a`, `EL-CHECK-09c` |
| EL-N-02 | `EL-CHECK-08c` |
| EL-N-03 | `EL-CHECK-04c` |
| EL-N-04 | `EL-CHECK-04e` |
| EL-N-05 | `EL-CHECK-11a`, `EL-CHECK-11b` |
| EL-N-06 | `EL-CHECK-10a` |
| EL-N-07 | `EL-CHECK-11d` |
| EL-N-08 | `EL-CHECK-03b`, `EL-CHECK-03c` |
| Principle 1 · 2 · 3 · 7 · 8 | `EL-CHECK-02e` · `EL-CHECK-10c` · `EL-CHECK-05d` · `EL-CHECK-11a`, `EL-CHECK-11c` · `EL-CHECK-09a`, `EL-CHECK-09g`, `EL-CHECK-10b` |
| Procedure P1 to P8 | `EL-CHECK-01a`, `EL-CHECK-01b`, `EL-CHECK-01c`, `EL-CHECK-01d`, `EL-CHECK-02b`, `EL-CHECK-04f`, `EL-CHECK-09a` |
| Judgment defaults | `EL-CHECK-02b`, `EL-CHECK-02e`, `EL-CHECK-09b` |

## 9. Pilot dispositions and stated residues

**Pilot runs.** Five runs on concrete targets, showing what the register does rather than asserting that it
works.

| Run | Target | Disposition |
|---|---|---|
| Passing | one new `invoke` / `handle` channel in a single-window app | every applicable gate `PASS`; `EL-CHECK-09e`, `EL-CHECK-10a` and `EL-CHECK-11d` resolve `n/a` with their predicates evidenced; coverage closed **and** accepted |
| Failing | the permission handler that answers from a set of allowed capability names | `EL-CHECK-06b` resolves `FAIL:<id>` while `EL-CHECK-06a` and `EL-CHECK-06c` pass; coverage closed, **not** accepted |
| Non-applicable | a renderer-only change shipping no native module | `EL-CHECK-11d` resolves `n/a:no-native-module`, citing the inspected dependency manifest — not the author's recollection |
| Boundary | a second window created after startup | `EL-CHECK-07c` is the row that moves; a single-window suite leaves it at `[ ]`, which is unresolved, not a pass |
| Adversarial | a bridge assembled by iterating a channel manifest | `EL-CHECK-04a` resolves `PASS` and `EL-CHECK-04b` resolves `FAIL:<id>`; that pair is why both rows exist |

**Stated residues.** Each is a place this register cannot be made binary. A residue named here is honest; the
same gap left as a soft row that always passes is the defect.

1. **`EL-CHECK-09e` rests on an unverified invocation.** The fuse read is its evidence, and the invocation
   shape carries `SKILL.md`'s `UNVERIFIED-AGAINST-ARTIFACT` marker. The row is runnable; its command has not
   been run against a packaged build here.
2. **`EL-CHECK-05c` has no behavioral evidence, by construction.** It is a read of one line per handler,
   because producing the failing state needs a navigation raced against the read and no runner can stage that.
   `EL-CHECK-05a` cannot substitute — it passes the same handler.
3. **`EL-CHECK-03e` is a reviewer's judgment, not a compiler signal.** A unit touching neither an ambient
   global nor the `electron` module cannot be discriminated by any pass, so the row names who looks instead.
4. **Five of the eight judgment defaults are graded, not probed.** Three reach rows above; the other five are
   properties of this skill's own prose and are graded through [`evaluation.md`](evaluation.md), which is
   where a finding against them belongs.
5. **Inclusion and locale have no row.** No live clause covers an access need, an input method, or a locale,
   which is why that category is dispositioned `n/a` in
   [`scenarios.md` § 2](scenarios.md#2-coverage-register). It becomes coverable when a clause exists.
6. **The authoring *reasoning* behind this skill's file set is outside this register's subject.** A row reads
   a change-set or the standing skill; it cannot read why a child was split out or a section placed where it
   is. The standing properties that reasoning produced — the thirteen-file set, the frontmatter contract, the
   enumeration sites, the guard runs and the cold-load record — are read by
   [§ 6's conformance block](#the-standing-skill-conformance-block), whose owner is `skill-writing` rather
   than a [`SKILL.md`](SKILL.md) clause, which is why they are entries there and not rows. What stays
   uncovered is the judgment itself, and it belongs to whoever changes the file set.
