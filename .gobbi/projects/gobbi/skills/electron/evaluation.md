# Electron — Idiom Review Frame

The entrypoint an independent evaluator uses to grade a change-set for **Electron idiom** — the desktop-runtime
companion to [`../coding/evaluation.md`](../coding/evaluation.md) and
[`../typescript/evaluation.md`](../typescript/evaluation.md). It is also the executor's own route into the triad
at [`SKILL.md` P8](SKILL.md#p8--review-on-three-axes-then-trace).

This file **routes; it does not restate**. The general method — the seven perspectives plus Overall, causal
findings, resolved checks, and verdict derivation — is owned by
[`../evaluation/SKILL.md`](../evaluation/SKILL.md), and the caller owns the report shape, output path, and
storage. The probes live in [`scenarios.md`](scenarios.md) (`EL-SC-*`), the binary items in
[`checklists.md`](checklists.md) (`EL-CHECK-*`), and every rule they exercise lives in
[`SKILL.md`](SKILL.md). What this file owns: the three-axis split, the rule-key legend, the case and check
selection procedure, the per-perspective Electron lenses and anti-patterns, the grading of the five judgment
defaults no row reaches, the recommended verifications, and the Overall anchors.

It **adds no policy**. Every clause below resolves to a `SKILL.md` rule, principle, or Procedure step; a clause
here with no such origin is a defect in this file, not a new obligation. It adds no evaluator artifact either —
the caller's output set is unchanged.

| Borrowed fact | Its one owner |
|---|---|
| The perspectives, findings, checklist resolution, verdict rules, and evaluator independence | [`../evaluation/SKILL.md`](../evaluation/SKILL.md) |
| Every rule, its check, its defeater, and the strength bar | [`SKILL.md`](SKILL.md) |
| The cases, their failure oracles, and the coverage frame | [`scenarios.md`](scenarios.md) |
| The binary rows, the resolution enum, and coverage closure versus acceptance | [`checklists.md`](checklists.md) |
| The language-agnostic property and the TypeScript idiom | [`../coding/evaluation.md`](../coding/evaluation.md), [`../typescript/evaluation.md`](../typescript/evaluation.md) |
| The Electron depth behind any finding | the nine content children, through the [`SKILL.md` P2 router](SKILL.md#p2--route-to-the-child-docs-for-the-forks-in-play) |
| The Electron major each version-sensitive behavior is qualified against | [`migration.md`](migration.md) |

---

## The three axes — what each one owns

This skill declares two parents, so an Electron change-set is graded on three independent axes. All three run;
none substitutes for another, and `EL-CHECK-01c` fails a record that names an axis it did not exercise.

| Axis | Frame | Owns |
|---|---|---|
| Property | [`../coding/evaluation.md`](../coding/evaluation.md) | whether the change is good software at all — decomposition, naming, error handling, test seams, blast radius |
| TypeScript idiom | [`../typescript/evaluation.md`](../typescript/evaluation.md) | whether the property is expressed in strict, idiomatic TypeScript — `any`, `as`, floating promises, erasable syntax, the exported type surface |
| Electron idiom | this file | only what the multi-process desktop runtime adds — process placement, the per-target type-check, the bridge, the sender contract, the security posture, the packaged artifact |

**The boundary test is `SKILL.md`'s own:** advice that would still hold in a plain Node and browser application
belongs to one of the two parents, not here. Apply it to findings as well as to rules.

**Grade each defect once, on the axis that owns its cause.** Two axes may each carry a finding about the same
line only when their causes differ and the corrections differ. One cause plus one correcting edit is one
finding, recorded on the owning axis and cross-referenced from the other.

```text
Same line, two findings?  Ask: does each axis name a different cause AND a different correction?
  yes -> two findings, one per axis, cross-referenced
  no  -> one finding, on the axis that owns the cause; the other axis cites it

Worked routing:
  an un-awaited promise in a main handler            -> TypeScript (promise handling)
  a god-object main module                           -> property (decomposition)
  `event.senderFrame` read after the first `await`   -> Electron (EL-R-09; the await is incidental)
  `any` on an IPC payload parameter                  -> TypeScript (the ban) AND Electron (EL-R-09 runtime
                                                        narrowing is absent) — different causes, different fixes
```

---

## Rule-key legend — the single crosswalk

Every `EL-SC-*` case and `EL-CHECK-*` row ends in its trace: an `EL-R-*` rule, an `EL-N-*` prohibition, a
`Principle {n}`, a `Procedure P{n}`, or `Judgment default`. Each resolves here to the opening clause of the
`SKILL.md` clause it names — the **sole crosswalk**, so a rule edit propagates through one legend rather than
three copies. Edit this legend in the same change that edits the rule text.

**Disambiguation.** `Principle {n}` is a [`SKILL.md` Principle](SKILL.md#principles); `Procedure P{n}` is a
[`SKILL.md` Procedure step](SKILL.md#procedure). A trace ending `DERIVED` names a derived sub-claim inside the
rule, marked as such in the rule text; a trace ending `residue` names the gap the rule states it cannot see.
Both resolve to their parent rule below.

### Author rules ([`Must-Follow`](SKILL.md#must-follow))

| Key | Resolves to |
|---|---|
| `EL-R-01` | "MUST declare the process of every module and every taught example" |
| `EL-R-02` | "MUST type-check each process target separately" |
| `EL-R-03` | "MUST leave every secure `webPreferences` default at its default" |
| `EL-R-04` | "MUST write all nine code-only security items so that each denies by default" |
| `EL-R-05` | "MUST attach the navigation guard to the event that covers the frames at risk" |
| `EL-R-06` | "MUST default `setWindowOpenHandler` to `{ action: 'deny' }`" |
| `EL-R-07` | "MUST expose one bridge method per IPC message, with an explicit argument list" |
| `EL-R-08` | "MUST wrap every listener callback so nothing derived from the internal `event`" reaches the renderer |
| `EL-R-09` | "MUST reject the message whenever the sender cannot be proven" |
| `EL-R-10` | "MUST bundle the preload to a single file" |
| `EL-R-11` | "MUST switch the renderer load path explicitly between development and production" |
| `EL-R-12` | "MUST flip the production fuse posture at packaging time, before code signing" |
| `EL-R-13` | "MUST register `open-url` / `open-file` during initial module evaluation" |

### Prohibitions ([`Must-Not-Follow`](SKILL.md#must-not-follow))

| Key | Resolves to |
|---|---|
| `EL-N-01` | "NEVER treat a clean dev console as an acceptance signal" |
| `EL-N-02` | "NEVER set `nodeIntegration: true`" |
| `EL-N-03` | "NEVER expose `ipcRenderer`, a `send` / `invoke` passthrough" or a channel-parameterized generic |
| `EL-N-04` | "NEVER assume one serialization table" |
| `EL-N-05` | "NEVER use `remote`, `enableRemoteModule`, or `ipcRenderer.sendTo()`" |
| `EL-N-06` | "NEVER treat ASAR as a security or secret boundary" |
| `EL-N-07` | "NEVER fix a native-module ABI mismatch by changing the Node version" |
| `EL-N-08` | "NEVER type-check the whole application under one combined tsconfig" |

### Maintainer rules ([`Rules for this skill's maintainer`](SKILL.md#rules-for-this-skills-maintainer))

These three resolve only when the subject is `skills/electron/` itself.

| Key | Resolves to |
|---|---|
| `EL-R-14` | "MUST state the Electron major each version-sensitive *behavior* claim was" verified against |
| `EL-R-15` | "MUST stamp every doc-state and absence claim" |
| `EL-R-16` | "MUST have every fenced code block in `skills/electron/` extracted" and type-checked |

### Principles and Procedure steps

| Key | Resolves to |
|---|---|
| `Principle 1` | "The process is the first design decision, and it is a trust boundary." |
| `Principle 2` | "The dangerous mistakes are silent." |
| `Principle 3` | "Everything crossing into main is untrusted input." |
| `Principle 4` | "The secure defaults are the posture; changing one is a decision that needs a reason." |
| `Principle 5` | "The bridge is the application's public API, and its width is its attack surface." |
| `Principle 6` | "A green type-check must mean the process boundary held." |
| `Principle 7` | "Electron facts expire; anchor every one of them." |
| `Principle 8` | "Development and production are different runtimes — prove the property on the shipped artifact." |
| `Procedure P1` | "Study and lock the task, the process map, and the version window" |
| `Procedure P2` | "Route to the child docs for the forks in play" |
| `Procedure P3` | "Design the process placement, the bridge, and the window" |
| `Procedure P4` | "Confirm the design with the user" |
| `Procedure P5` | "Build the three-target skeleton first" |
| `Procedure P6` | "Grow in minimal verified slices" |
| `Procedure P7` | "Verify the whole change, per process and on the packaged artifact" |
| `Procedure P8` | "Review on three axes, then trace" |
| `Judgment default` | the eight soft defaults in [`Judgment defaults`](SKILL.md#judgment-defaults), each with its check and its defeater |

---

## Selecting cases and checks

Run this once the subject and its version are fixed, before the frame is frozen — the step is
[`../evaluation/SKILL.md` § 3](../evaluation/SKILL.md#3-build-the-scenario-and-checklist-frame), and this
procedure only tells that step which Electron cases and rows to take.

1. **Load all three siblings** — this file, [`scenarios.md`](scenarios.md), and
   [`checklists.md`](checklists.md) — plus the two parent frames named above, which run as their own axes.
2. **Fix the subject class.** Families 01 to 11 and their rows read against the **change-set**; family 12 and
   its rows read against **`skills/electron/` itself**. A change that edits both is graded on both, with the
   subject named per finding. [`checklists.md` § 1](checklists.md#1-frame--subject-mode-and-how-a-box-is-ticked)
   owns this split.
3. **Map the diff to its Electron surfaces**, then activate families by the triggers below.
4. **Take every activated case and its reserved rows**, plus any row whose clause applies directly with no
   matching case. Record a specific `n/a:<property>` — with the inspected evidence that its predicate is false —
   for an inapplicable row the surface could plausibly activate. Never drop one silently; the token semantics
   are owned by [`checklists.md` § 2](checklists.md#2-legend--resolution-coverage-closure-and-acceptance).
5. **Copy the rows into the run's own filled copy.** The register ships unchecked and stays unchecked.
6. **Run the six cosmetic-conformance probes** in
   [`checklists.md` § 7](checklists.md#7-the-six-cosmetic-conformance-probes) against every activated surface.
   A guard that exists is not a guard that holds — `Principle 2` is why every row was written to reject a
   complete-looking artifact, and a run that never drove a conformant-but-wrong input has not tested that.
7. **Search past the frame.** These twelve families are the known coverage floor. The gaps they do not close
   are stated in [`scenarios.md` § 8](scenarios.md#8-coverage-gaps-decisions-and-candidates) and
   [`checklists.md` § 9](checklists.md#9-pilot-dispositions-and-stated-residues); read both before concluding
   that a surface is covered.

| Family | Activates when the subject | Rows |
|---|---|---|
| 01 entry and route | is any Electron change — this family is unconditional | `EL-CHECK-01a`–`-01d` |
| 02 process placement | adds or moves a unit, changes a preload, or offloads work | `EL-CHECK-02a`–`-02e` |
| 03 the type-check as proof | touches a tsconfig, a module view, or the build's pass set | `EL-CHECK-03a`–`-03e` |
| 04 the bridge surface | changes an exposed key, a listener wrapper, or a value that crosses | `EL-CHECK-04a`–`-04f` |
| 05 the sender contract | adds or changes an `ipcMain` handler | `EL-CHECK-05a`–`-05e` |
| 06 the nine code-only items | touches a window, a session, or a permission posture | `EL-CHECK-06a`–`-06c` |
| 07 navigation and window-open | touches navigation, redirects, window-open, `openExternal`, or a custom-protocol URL identity | `EL-CHECK-07a`–`-07f` |
| 08 the `webPreferences` posture | constructs a window or edits a `webPreferences` object | `EL-CHECK-08a`–`-08c` |
| 09 development versus the artifact | changes the load path, packaging, fuses, deep links, or a renderer asset path | `EL-CHECK-09a`–`-09h` |
| 10 secrets and native returns | handles a secret, or calls a native capability whose failure returns | `EL-CHECK-10a`–`-10c` |
| 11 upgrading across a major | moves the Electron major, or ships a dependency or a native module | `EL-CHECK-11a`–`-11d` |
| 12 maintaining the skill | is `skills/electron/` itself | `EL-CHECK-12a`–`-12e` |

---

## Perspectives

Each lens is the general perspective — defined in
[`../evaluation/SKILL.md` § 5](../evaluation/SKILL.md#5-investigate-the-subject-across-perspectives) — narrowed
to what the desktop runtime adds. Every one of the 56 rows appears under exactly one lens: that lens is where
its finding is recorded, not a claim that no other lens may observe the condition. All seven are walked even
when the change does not exercise one; that lens may record zero findings.

### Project

**Lens**: does the change reach the right owner, in the right mode, inside the app's declared Electron window —
routed to every fork it activates, and graded on all three axes rather than one?

**Activated**: `EL-SC-01a`–`-01d`, `EL-SC-09a`, `EL-SC-11a`, `EL-SC-11c` · `EL-CHECK-01a`–`-01d`,
`EL-CHECK-09a`, `EL-CHECK-11a`, `EL-CHECK-11c`.

| Anti-pattern | Correction |
|---|---|
| **Three axes named, one run** | Give each axis its own findings list against a named artifact; a record that names all three and exercises one reads complete (`EL-CHECK-01c`) |
| **Routing frozen at entry** | Re-run the router after the design moves — a changed transport or a second window activates a fork nobody read (`Procedure P2`) |
| **A completion claim read from the wrong runtime** | Name the artifact each packaged-only result was read from; an unpackaged run is not evidence for a packaged property (`Principle 8`) |

### Structure

**Lens**: are the **process placement, the module surface, the tsconfig split, and the bridge shape** right —
each unit on the side its work belongs to, each target checked against its own `electron` view, and the exposed
surface written out rather than derived?

**Activated**: `EL-SC-02a`, `-02c`, `-02d`, `EL-SC-03c`, `-03d`, `EL-SC-04a`, `-04b`, `EL-SC-09f` ·
`EL-CHECK-02a`, `-02c`, `-02d`, `-03c`, `-03d`, `-04a`, `-04b`, `-09f`, `-09h`.

| Anti-pattern | Correction |
|---|---|
| **One `electron` module view behind three configs** | Give each target its own generated view; three passes over one view certify every wrong-process import (`EL-R-02`, `EL-N-08`) |
| **A bridge that widens through data** | Write the exposed key set out; a manifest-driven surface widens with no line in the preload diff for a reviewer to see (`EL-R-07`) |
| **A preload judged by its source imports** | Read the emitted bundle; a helper's import leaves the sandboxed surface while the preload's own source stays clean (`EL-R-10`) |

### Performance

**Lens**: does the change keep **main responsive and its listeners bounded** — CPU-heavy and crash-prone work
off the process that owns the windows, the transport matched to the traffic, and subscriptions disposed?

**Activated**: `EL-SC-02b`, `-02e`, `EL-SC-04f` · `EL-CHECK-02b`, `-02e`, `-04f`.

| Anti-pattern | Correction |
|---|---|
| **CPU-heavy work left in main** | Fork it to a utility process, and measure main's loop latency across the workload rather than resting on nobody having complained (`Judgment default`) |
| **Offload justified by throughput alone** | State crash isolation as its own reason; a native unit that dies takes the windows with it (`EL-CHECK-02e`) |
| **A subscription with no disposer** | Return a disposer and call it from the consumer's cleanup path; a single-mount test never sees the accumulation (`EL-CHECK-04f`) |

### Aesthetics

**Lens**: does the change read like **one disciplined Electron codebase** — every process tag truthful where no
compiler can check it, and every provenance caveat attached to the subject it qualifies?

**Activated**: `EL-SC-03e`, `EL-SC-12b` · `EL-CHECK-03e`, `-12b`; plus the electron-vite and Playwright
judgment defaults below. Whether a tag also *compiles* in its process is graded under Structure
(`EL-CHECK-02a`).

| Anti-pattern | Correction |
|---|---|
| **A tag no pass can discriminate** | Confirm the tag against the module's role by reading it; a unit touching neither an ambient global nor the `electron` module leaves all three signals silent (`EL-R-01`) |
| **A caveat attached to the neighbouring subject** | Attach each caveat to the thing it qualifies, in the same paragraph as the recommendation — every required word can be present and still point at the wrong noun (`Judgment default`) |
| **Examples the harness never compiles** | Keep taught examples in a fence the extractor compiles, and record the ratio rather than the count (`EL-R-16`) |

### Usage

**Lens**: for the **renderer developer and the shipped app's user** — is the bridge usable from what it hands
back, does each crossing value survive its direction, and does the packaged app resolve what a component asks
for?

**Activated**: `EL-SC-04c`, `-04e`, `EL-SC-09b`, `-09g` · `EL-CHECK-04c`, `-04e`, `-09b`, `-09g`; plus the
window-class and transport judgment defaults below.

| Anti-pattern | Correction |
|---|---|
| **A bridge the renderer receives as an empty object** | Assert key by key, in the renderer, that every received key is a function of the expected arity (`EL-N-03`) |
| **A value legal in one direction only** | Check each crossing value against the table for that direction, asserting arrival on each side separately (`EL-N-04`) |
| **A path built where there is no filesystem** | Keep filesystem paths on the side that has one and send bytes or an app-protocol URL instead (`EL-CHECK-09g`) |

### Consistency

**Lens**: did **everything that must agree, agree** — the claim and its register row, the stamp and its fetch,
the key and the document that owns its default, the three processes' declarations, and the evidence each
config actually produces?

**Activated**: `EL-SC-03a`, `-03b`, `EL-SC-08b`, `EL-SC-12a`, `-12c`, `-12d` · `EL-CHECK-03a`, `-03b`, `-08b`,
`-12a`, `-12c`, `-12d`, `-12e`; plus the Electron Forge judgment default below.

| Anti-pattern | Correction |
|---|---|
| **A claim in the text and no row in the register** | Walk the behavior-claim register from the text as well as from the register; the register-to-text direction always checks out (`EL-R-14`) |
| **A stamp with no fetch behind it** | Require the quoted sentence and its current line number per rotation entry; a self-report and a real rotation are otherwise indistinguishable (`EL-R-15`) |
| **A default resolved from a summary** | Resolve each present key's default from the owner `security.md` names, never from the rows a summary happened to carry (`EL-R-03`) |

### Risk

**Lens**: which **Electron footgun** leaves the machine reachable from a frame nobody wrote — a guard that
denies the wrong thing, a handler that fails open, a posture that ships unflipped, or a secret on disk?

**Activated**: `EL-SC-04d`, `EL-SC-05a`–`-05e`, `EL-SC-06a`–`-06c`, `EL-SC-07a`–`-07e`, `EL-SC-08a`, `-08c`,
`EL-SC-09c`, `-09d`, `-09e`, `EL-SC-10a`–`-10c`, `EL-SC-11b`, `-11d` · `EL-CHECK-04d`, `-05a`–`-05e`,
`-06a`–`-06c`, `-07a`–`-07f`, `-08a`, `-08c`, `-09c`, `-09d`, `-09e`, `-10a`–`-10c`, `-11b`, `-11d`.

| Anti-pattern | Correction |
|---|---|
| **A guard that denies the unknown and grants the known to anyone** | Drive an allowed input from a disallowed origin through every origin-sensitive item and observe the denial (`EL-R-04`) |
| **A flawless allowlist on the wrong event** | Cover the frames at risk, and drive a subframe and a redirect through the guard — a main-frame test cannot tell the events apart (`EL-R-05`) |
| **A custom-scheme allowlist containing `"null"`** | Admit the exact packaged `.protocol` + `.host` pair, then reject `file:`, `data:`, `about:`, and a lookalike custom host (`EL-R-05`) |
| **A sender read that moved past the first `await`** | Read each handler for the read's lexical position; the behavioral suite passes the same handler, because no runner can stage the race (`EL-R-09`) |

---

## The five judgment defaults graded here

Eight soft defaults sit in [`SKILL.md`](SKILL.md#judgment-defaults). Three are probed by a case and a row —
the offload target (`EL-CHECK-02b`, `-02e`), the packaged renderer's origin (`EL-CHECK-09b`), and the N-API
preference (`EL-CHECK-11d`). The other five are properties of **this skill's own prose**, which no row can
read; [`checklists.md` § 9](checklists.md#9-pilot-dispositions-and-stated-residues) states that gap and sends
it here. They activate when the subject includes `skills/electron/` itself.

**How each is judged.** Read the paragraph that carries the recommendation. Confirm every conjunct of the
rule's stated *check* holds **in that paragraph and attached to that subject** — a required word present but
qualifying the neighbouring noun does not satisfy it. Then confirm the paragraph is not the *defeater* shape
the rule names: a wrong-but-conformant paragraph in which every named element is present and the reader still
leaves with the wrong conclusion. `SKILL.md` owns both the check and the defeater text; this file owns only
which lens records the finding.

| Judgment default | The prose property graded | Finding recorded under |
|---|---|---|
| `BrowserWindow` for a single full-size web view | the reader cannot leave believing `BrowserWindow` is legacy, and the composed-window branch carries its cleanup obligation | Usage |
| `invoke` / `handle`, `send` / `on`, `MessagePort` by traffic shape | each transport names its selecting condition, and the synchronous one carries the avoid verdict, not a neutral mention | Usage |
| Electron Forge as the default packaging path | the recommendation claims no more than the sources in [`References`](SKILL.md#references) support about the alternatives | Consistency |
| electron-vite for a Vite-based three-target build | the maintenance caveat is attached to electron-vite itself, in the same paragraph | Aesthetics |
| Playwright `_electron` for end-to-end tests | the experimental hedge names Electron support as its subject, not the tool in general | Aesthetics |

---

## Recommended verifications

Capabilities are binding; the commands are examples. First run the ordered pipeline
[`SKILL.md` P7](SKILL.md#p7--verify-the-whole-change-per-process-and-on-the-packaged-artifact) activates, then
add the Electron-idiom verifications below. Each names the rows it produces evidence for.

| Capability | Confirms |
|---|---|
| Run one `tsc` per declared target, each against its own generated `electron` view, and record the pass count | `EL-R-02`, `EL-N-08` (`EL-CHECK-03b`, `-03c`) |
| Drive a deliberate wrong-process fixture through each target and capture the guard signals | `EL-R-01`, `EL-R-02` (`EL-CHECK-02c`, `-03a`) |
| Read the emitted preload bundle — not the source import list — against the sandboxed module surface | `EL-R-10` (`EL-CHECK-02d`) |
| Read the object passed to `exposeInMainWorld` key by key, diff the exposed key set across the change, then assert in the renderer that every received key is a function of the expected arity | `EL-R-07`, `EL-R-08`, `EL-N-03` (`EL-CHECK-04a`–`-04d`) |
| Per handler, drive a null frame, a detached frame, an off-allowlist origin, and a malformed payload; separately, read each handler for the sender read's lexical position | `EL-R-09`, both conjuncts (`EL-CHECK-05a`–`-05e`) |
| Per origin-sensitive security item, drive an **allowed** input from a **disallowed** origin | `EL-R-04` (`EL-CHECK-06a`–`-06c`) |
| Navigate a subframe and a redirect through the guard, drive a malformed URL, prove a custom-scheme packaged entry does not share authority with other opaque origins, and trace every main-process `loadURL` / `loadFile` argument to its source | `EL-R-05` (`EL-CHECK-07a`, `-07b`, `-07d`–`-07f`) |
| Inventory every `webContents` the app creates and the window-open registration at each creation site | `EL-R-06` (`EL-CHECK-07c`) |
| Diff every key present in each `webPreferences` object against the default its owning document records | `EL-R-03`, `EL-N-02` (`EL-CHECK-08a`–`-08c`) |
| Search the packaged artifact for the development server's URL literal | `EL-R-11` (`EL-CHECK-09d`) |
| Read the fuse posture back from every signed platform and architecture that ships, entry by entry | `EL-R-12` (`EL-CHECK-09e`; its residue is stated in [`checklists.md` § 9](checklists.md#9-pilot-dispositions-and-stated-residues)) |
| Cold-start the packaged app from a link, and read the entry module for the registration and lock order | `EL-R-13` (`EL-CHECK-09f`, `-09h`) |
| Inspect the packed archive, the unpacked tree, and everything the app writes at runtime for recoverable secrets | `EL-N-06` (`EL-CHECK-10a`, `-10b`) |
| Sweep the bundled dependency tree, not only the authored source, for the removed-API tells | `EL-N-05` (`EL-CHECK-11a`, `-11b`) |
| Load every native module on a machine that did not build it | `EL-N-07` (`EL-CHECK-11d`) |
| Run the example harness over `skills/electron/` and record extracted units, counted uncompiled blocks, and the fenced-block total | `EL-R-16` (`EL-CHECK-12b`) |
| Walk the behavior-claim register in both directions, and re-derive the rotation date from the published schedule | `EL-R-14`, `EL-R-15` (`EL-CHECK-12a`, `-12c`–`-12e`) |

---

## Overall — Electron-specific anchors

Step back from the per-lens passes and read the change against the five failure modes below, then against what
exists only **between** lenses: a clean bridge over an unproven sender, a measured offload that lost its
disposer, a green three-target run whose configs share one view. Verdict derivation itself is owned by
[`../evaluation/SKILL.md` § 7](../evaluation/SKILL.md#7-derive-the-perspective-and-overall-verdicts).

| Mode | What it looks like in an Electron change-set |
|---|---|
| **Present and wrong** | Every guard exists, every list is complete, nothing throws, and the property is unexamined — the failure `Principle 2` exists to name |
| **A boundary certified by a run that cannot see it** | One combined pass, three passes over one `electron` view, or a green build offered as proof of a tag no compiler can discriminate |
| **Proven in the runtime nobody ships** | A clean development console, an unpackaged run, or one architecture's artifact standing for the shipped set |
| **A fact that quietly expired** | An unqualified behavior claim, a stamp with no re-fetch artifact behind it, or a rotation date already in the past |
| **Three axes on the record, one in the evidence** | The property, the TypeScript idiom, and the Electron idiom are all named, and only one carries findings against a named artifact |

**Preserve-list anchors specific to Electron idiom** — what a strong change already got right, and which a
revision must not undo: units whose process is declared and checked against that process's own module view;
a written-out bridge whose every widening is an edit a reviewer sees; handlers that prove the sender before
the first `await` and narrow the payload at runtime; origin-scoped guards with their inverted tests; a
key-by-key `webPreferences` diff with each deviation justified; evidence read from the packaged, signed
artifact; and version-sensitive claims that carry both a qualifier and a register row. If none apply, state
`none — every Electron-idiom surface needs revision`.
