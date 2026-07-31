---
name: desktop
description: Use when designing, building, and releasing one desktop application outcome as an Electron and TypeScript vertical slice, from the design fidelity ladder through a signed, update-rehearsed per-OS release.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Desktop Application Delivery

Deliver one desktop application outcome — a windowed program a user installs on macOS, Windows, or Linux and
launches outside a browser — as an Electron and TypeScript vertical slice. One outcome spans the design
fidelity ladder, the privilege boundary between the three execution contexts, and a packaged, signed,
update-rehearsed release on every operating system claimed. Load this skill when the work targets an
installed windowed application; do not load it for a browser page, a command-line tool, a library, or a
service.

The skill also states when Electron is the wrong answer. `DESK-R03` carries the six-criterion test and the
alternative each positive criterion points at, and `P1` runs that test as its first action, before the stack
is committed.

## Principles

> **P-1 — One desktop outcome spans design, three processes, and a release that cannot be recalled.**
> The unit of work is not a window, an inter-process handler, a packaged build, or a happy path. It is the
> bounded outcome from entry through verified completion on every operating system claimed, including the
> installed and updated state on a user's machine that no later change can reach.

> **P-2 — The design progression is a ladder of questions, not a stack of artifacts.**
> Each rung asks something the next rung cannot answer for it. A named artifact is the default way to answer
> a rung, and an existing answer may close it, but an unanswered rung stays open no matter how polished the
> artifacts above it look. The progression is iterative scaffolding and is re-enterable, not a one-way gate
> chain.

> **P-3 — The privilege boundary is the product's real perimeter, and the type system cannot see it.**
> The boundary between the privileged process and the presentation process presents as an ordinary typed
> function call while carrying data an attacker can shape. A declared type states a shape; it never
> validates one. Every crossing is validated at run time, on both the payload and the caller.

> **P-4 — Platform conformance is a behavior contract, not a visual style.**
> Each operating system's users expect specific behavior — where a window reopens, what a right-click on the
> frame does, which key combination is reserved, how the application behaves with no window open. Matching an
> appearance while breaking one of those behaviors reads as a broken application, and no amount of visual
> polish repairs it.

> **P-5 — A claim is only as strong as the evidence class that owns it.**
> Source inspection, a passing test, a rendered image, a running development build, an installed packaged
> build, a verified signature, a rehearsed update, and a representative user's own use each prove a different
> thing. Merging them into one status is how an unproved property ships.

> **P-6 — Where the platform's authority cannot be read, say so.**
> An unverifiable convention must not be filled in from a plausible summary, and it must not be softened into
> a hedge either. A hedge is a positive claim about the world and can be false in the same way the assertion
> was. Mark the gap, name what would close it, and write the rule so it does not depend on the answer.

## Rules

Every clause below carries a permanent identifier. `DESK-R01`–`DESK-R31` name Must-Follow policy and
`DESK-N01`–`DESK-N12` name prohibitions; two identifiers were withdrawn during design and are never
reallocated, which leaves **thirty** live rules and **eleven** live prohibitions. `DESK-FLOOR-01`–`04` name
the protected floors and `DESK-FLOOR-01-PROPERTY`–`04-PROPERTY` their property checks. The remaining
namespaces belong to the siblings that own them: `DESK-RUNG-0`–`8` to the ladder, `DESK-G1`–`DESK-G8` to the
decision tree, `DESK-PAUSE-1`–`4` and `DESK-CHECK-NN` to the checklist, `DESK-FAMILY-01`–`10` and
`DESK-SCENARIO-NN` to the scenario source. Renaming a title never changes an identifier; a clause whose
discrimination changes gets a new identifier rather than reusing the old one, so a finding stays resolvable
across revisions.

### Must-Follow

**Frame and scope**

- **`DESK-R01` — MUST bind one complete desktop application outcome and its boundary.** Name the actors, the
  trigger, the entry modes, visible and system completion, false completion, the paths, states, failures, and
  recovery routes, the local data effects, the support route, every claimed operating system, the scope, and
  the non-goals.
- **`DESK-R02` — MUST stop at the desktop application boundary.** Whole-product discovery, project startup, a
  second application, a component-library or renderer-framework policy, and unrelated cleanup are out of
  scope until the user changes the contract.

  Nested per-surface bundles for desktop interface mechanics and desktop experience research are planned for
  a later session and do not exist today. Nothing in this skill loads or requires them; the design authority
  for desktop work is complete in this family as shipped.
- **`DESK-R03` — MUST run the wrong-choice test before committing to the stack.** Check each of the six
  criteria below, record the inspected result of each, and route a positive result to the user as a stack
  decision rather than proceeding. A positive result on **any one** criterion is a decision for the user, not
  a reason to proceed carefully.

  | # | Electron is the wrong answer when … | The mechanism that makes it decisive |
  |---|---|---|
  | 1 | distribution size or memory footprint is a stated product requirement | the bundled browser-engine baseline is structural and is not tunable away |
  | 2 | Linux must be first-class with update parity | there is no built-in Linux auto-updater and no Linux ASAR-integrity support; both are built and maintained by hand |
  | 3 | the team cannot sustain a continuous engine-upgrade treadmill | only the supported-major window named in the version baseline is supported, on the cadence it names, while browser-engine vulnerabilities reach the platform continuously through the engine roll; staying on one major for years is not available |
  | 4 | the renderer must load third-party or user-supplied remote content | the platform's own documentation advises against loading, reading, or processing untrusted content in an unsandboxed process, **including the privileged process** — doable, but the expensive path |
  | 5 | deep native integration or a platform-exclusive interface is the point | native frameworks supply platform behaviors for free; here each one is re-implemented per operating system |
  | 6 | 32-bit Windows or older-ARM Linux must be supported past the end-of-life date named in the version baseline | the last series shipping those prebuilts, and the date support ends, are both pinned in the version baseline |

  Each criterion points at the alternative that answers it. This table names conditions and mechanisms only;
  it ranks nothing, quotes no size figure as a fact, and says nothing comparative about frameworks this
  design did not research.

  | Criterion that fired | The alternative that answers it | Why, from the same mechanism |
  |---|---|---|
  | 1 | a **native app** per claimed system; **Tauri** where a web renderer must be kept | the bundled engine baseline is structural. Published size figures for the alternatives are secondary-lead only and are usable as order-of-magnitude context, never as a quoted fact or a ranking |
  | 2 | a **PWA** or a **plain web app** | the missing piece is a per-OS installer and updater that must be hand-built for Linux. A browser-delivered application has neither to build |
  | 3 | a **PWA** or a **plain web app** | the treadmill exists because the application ships and therefore owns the engine. When the user's own browser owns it, the upgrade is not the team's work |
  | 4 | a **plain web app** or a **PWA** | a browser's origin model and its own sandbox are built for exactly this input class |
  | 5 | a **native app** per claimed system | native frameworks supply the platform behaviors; here each is re-implemented per system |
  | 6 | a **plain web app**, or a **native app** built for that architecture | the prebuilts end with the stated series. A browser-delivered application inherits whatever the platform's own browser supports |
- **`DESK-R04` — MUST treat this skill as the sole design owner for desktop work.** This skill owns the design
  progression and its acceptance gate. The generic interface and experience skills are not co-loaded for
  desktop work and hold no acceptance authority on this path, so nothing upstream supplies the four floors
  below and this skill reconstructs all four itself.

**The design ladder**

- **`DESK-R05` — MUST resolve every one of the nine ladder rungs.** Each rung is answered by producing its
  default artifact, by citing an existing answer that addresses that rung's own question, or by proving the
  rung inapplicable from inspected evidence. The rung definitions live in
  [`fidelity-ladder.md`](fidelity-ladder.md); this rule is what makes them binding.
- **`DESK-R06` — MUST make a rung's resolution recorded and substantiated, because an unresolved rung fails
  the run.** A rung with no recorded resolution, or a resolution whose inspected evidence does not satisfy
  that resolution kind's own conditions, is a silent skip and blocks acceptance. The acceptance predicate and
  its per-kind conditions are [the rung-closing decision rule](#the-rung-closing-decision-rule), stated in Procedure at
  the point it governs.
- **`DESK-R07` — MUST treat fidelity as three independent axes.** Interactivity, visuals, and content and
  navigation vary separately; an artifact may legitimately be high in one and low in another, so no single
  low-to-high dial may govern the progression.
- **`DESK-R08` — MUST apply the desktop instantiation of the ladder's shape-conditioned default at the
  wireframe and mockup rungs: the primary artifact is a wireflow.** The ladder states the selection rule in
  product-shape terms; this rule states that a desktop application satisfies the wireflow condition — few
  windows with heavy in-place state change — so a formal page-oriented site map is not the default
  deliverable for this shape, because a desktop application has windows and modes rather than pages. The
  default is a default and not a mandate: a run may choose page wireframes and a site map, and records why
  its product's shape differs from the stated condition. What it may not do is skip the rung. This rule is a
  desktop override and lives here, never inside a generic rung definition.
- **`DESK-R09` — MUST use each rung's own validation method in its own order.** Generative structure work
  precedes evaluative structure validation, structural validation needs no visual design, and iteration
  budget goes to several small rounds rather than one large one.

  This rule binds the round cadence, never a participant count for acceptance. `DESK-R13` sets no fixed
  count: the method, the sample, and the claim boundary are derived from the question, the diversity of the
  affected people, the uncertainty, the impact, and the risk. The five-user figure the cadence uses is the
  iteration heuristic and is never the acceptance threshold.

**The four protected floors**

- **`DESK-R10` — MUST hold the accessibility floor as a property across at least the complete named union.**
  Every required action, state, and meaning of the outcome stays available through every applicable modality;
  no identity, platform convention, aesthetic choice, or child convention reduces that availability. The
  enumerated union is a stated minimum, not the extent of the obligation. The floor is non-waivable, and its
  full statement is `DESK-FLOOR-01`.
- **`DESK-R11` — MUST hold the safety floor as a property across at least the complete named union.** No
  clause of the run permits an action whose consequence the actor cannot foresee, refuse, or recover from.
  The enumerated union is a stated minimum, not the extent of the obligation. The floor is non-waivable, and
  its full statement is `DESK-FLOOR-02`.
- **`DESK-R12` — MUST hold participant consent and protection at every activity that involves a person, and
  fail closed when any required condition is missing.** Informed consent, needed accommodations, and data
  minimization and protection precede any participant activity at any rung. The fail-closed triggers are
  missing access to representative users, missing consent, missing accommodations, and missing required
  evidence; any one of them stops the run and reports missing context rather than proceeding. The enumerated
  union is a stated minimum. The floor is non-waivable, and its full statement is `DESK-FLOOR-03`.
- **`DESK-R13` — MUST make direct representative-user evidence the acceptance evidence, across the full
  observation-dimension set.** Acceptance requires representative people using this run's own artifacts, per
  claimed operating system, with observations covering every applicable dimension the generic parent names.
  No fixed participant count applies; every other signal is context only. The enumerated union is a stated
  minimum. The floor is non-waivable, and its full statement is `DESK-FLOOR-04`.

**Architecture and implementation**

- **`DESK-R14` — MUST keep the four execution contexts and their privileges explicit.** The privileged main
  process owns native access and lifecycle, the renderer process is web-standards-only, the preload script is
  the single sanctioned privilege channel, and a `utilityProcess` is used for isolated work; state which
  context each unit of the outcome runs in.
- **`DESK-R15` — MUST validate both the payload and the caller at every privileged inter-process crossing.**
  Every `ipcMain.handle` and `ipcMain.on` handler runtime-validates its payload into a domain type and
  verifies `event.senderFrame` before any privileged effect; `contextIsolation` does not prevent an
  unexpected frame from sending.
- **`DESK-R16` — MUST give the `contextBridge` surface one source-of-truth contract type and cross it with
  cloneable shapes only.** One type module is imported type-only by both sides; only structured-cloneable
  values and plain asynchronous functions cross; prototypes, classes, constructors, and `Symbol`-keyed
  members do not survive the crossing.
- **`DESK-R17` — MUST configure three separate compilation targets and keep `@types/node` out of the renderer
  target — and MUST carry the derived marking with this rule.** Three tsconfig projects with their own `lib`,
  `types`, and module settings, wired by project references over one type-only shared layer; including `node`
  in the renderer's `types` is a defect because it type-checks green over code that throws at run time.
  **INFERRED — the three-target split itself is derived, not documented.** No primary source states it; it
  follows from the verified sentence that the preload context has DOM APIs and a limited subset of Node and
  Electron APIs, and following-from is not documented-as. That marking travels with this rule wherever the
  rule is restated, taught, or exercised, including `P7`.
- **`DESK-R18` — MUST key cross-process resource disposal to lifecycle, not to scope exit.** Every privileged
  resource held on behalf of a renderer names the window or `webContents` lifecycle event that releases it,
  with `will-quit` as the last-resort terminal.

**Security**

- **`DESK-R19` — MUST leave the safe defaults intact and write every applicable positive control.** The two
  kinds of work are distinct: for the default group the correct action is inaction, and for the positive
  group the control does not exist until it is written — the session permission-request handler, the Content
  Security Policy, `will-navigate` and `setWindowOpenHandler` limits, `shell.openExternal` handling, IPC
  sender validation, and the rest of the positive group.
- **`DESK-R20` — MUST harden with Electron fuses at build time and never treat the ASAR archive as a security
  boundary.** Set the build-time fuses; **pair `enableEmbeddedAsarIntegrityValidation` with
  `onlyLoadAppFromAsar`** so unvalidated code cannot load; and never place a secret in the bundle — ASAR
  conceals source from cursory inspection and nothing more.

**Platform conformance**

- **`DESK-R21` — MUST build the platform-standard menu from Electron's documented `role` values and assert no
  unverified platform convention.** Specify `role` for any item matching a standard role rather than
  reimplementing the behavior in a `click` handler. **UNVERIFIED — the vendor's own prescriptive design
  guidance could not be read**, because its pages are client-rendered and return no body content to a fetch,
  so this skill states no macOS minimum menu set, no menu ordering, and no Window-menu document-ordering
  convention as fact.
- **`DESK-R22` — MUST satisfy the per-operating-system behavior obligations the outcome touches, each with
  its named mechanism.** Window state restoration (not built in — a dependency decision); the first-paint
  pair (`show: false` plus `ready-to-show`, **and** `backgroundColor` set anyway); `window-all-closed` and
  macOS `activate` semantics with no window open; `requestSingleInstanceLock()` plus `second-instance` with
  `commandLine` parsed by matching and never by position; the deep-link route per operating system
  (`open-url` on macOS; `second-instance` with the link as the **last** element on Windows and Linux); a
  three-state theme driven by `nativeTheme.themeSource` (`'system' | 'dark' | 'light'`) with its `updated`
  event handled live; one shortcut map per platform using `CommandOrControl`, excluding system-reserved
  combinations; and, where the outcome is entered from or resident in a status-area icon, the tray mechanism —
  an icon with a context menu, re-set rather than mutated in place to change an item — with no activation
  gesture promised on a system whose own specification leaves the gesture to the environment.

**Release**

- **`DESK-R23` — MUST extend the verification order with the packaged, installed, signed, and updated
  gates.** After the language-level order terminates at build, add: package a per-operating-system installer,
  install and smoke-test that artifact in a clean environment, verify signature and notarization on the real
  artifact, and rehearse an update from the previously released version.
- **`DESK-R24` — MUST treat release as irreversible.** A shipped version cannot be recalled and old versions
  persist on user machines indefinitely, so rollback means a forward fix plus a stated supported-old-version
  window, and the release gate proves the installable artifact and the rehearsed update from the previous
  release.

**Evidence and honesty**

- **`DESK-R25` — MUST keep every evidence class and its claim boundary separate.** Report design acceptance,
  implementation correctness, packaged-artifact evidence, signature and notarization evidence,
  update-rehearsal evidence, per-operating-system evidence, release readiness, release authority, and
  post-release outcome as distinct claims; never merge them into one tested status.
- **`DESK-R26` — MUST pin every version-sensitive statement, verify each claim at its owner, and mark what is
  unknown.** Name the platform version any version-dependent statement depends on, so a stale statement is
  self-identifying rather than silently wrong; keep every version literal in the single owner block in
  [`runtime-deltas.md`](runtime-deltas.md) and point there rather than restating one; verify a mechanism
  claim by reading the owner document for it; mark an unverified or unknown fact as such instead of asserting
  or hedging it; and surface a genuine conflict between two authorities to the reader as a decision rather
  than resolving it silently.

**Authority, trace, and the record**

- **`DESK-R27` — MUST stop at every named user gate and obtain an explicit decision.** The named gates, in
  fire order, which is what fixes their identifiers: `DESK-G1` the stack-fit decision when any wrong-choice
  criterion is positive; `DESK-G2` ladder-rung applicability; **`DESK-G3` the structural-skeleton approval
  gate — the user explicitly approves the surface-neutral structure, or reopens it, before any visual rung
  begins**; `DESK-G4` the design acceptance gate; `DESK-G5` the hardening-versus-testability build-matrix
  decision; `DESK-G6` the build-tool selection; `DESK-G7` the adoption of any new production dependency,
  including a window-state library or a typed-IPC library; and `DESK-G8` release authority. Silence,
  continued work, an earlier decision on a different axis, or a stakeholder's enthusiasm is not approval.
  This rule is the parent owner of the gate authority that [`ideation.md`](ideation.md) runs.
- **`DESK-R28` — MUST prove the bidirectional trace and prove the verifier itself.** Every load-bearing rule
  resolves to at least one scenario family and one check; every case and check resolves to a live rule; the
  four projections of the authoritative case-to-check relation agree exactly; and the verifier is proved at
  both ends and against every planted fixture before its result is cited. This rule is the parent owner of
  the trace obligation [`scenarios.md`](scenarios.md), [`checklists.md`](checklists.md), and
  [`evaluation.md`](evaluation.md) implement. Run the mechanical leg through
  [`scripts/check_relation.py`](scripts/check_relation.py); its output distinguishes the script-proved
  relation leg from the review-proved obligation leg.
- **`DESK-R29` — MUST keep one design record for the run, whose location the active project owns.** The
  record carries the rung register, the three-axis statement for each artifact at rungs 6–8, the four floor
  resolutions with their union checks and property checks, the participant consent and accommodation records,
  the locked application contract, the claim-owner verification matrix, and the run's own unknown and gap
  register. This skill defines the record's required content; the active project or workflow owns its path,
  and no universal project-wide file name is prescribed. A heading with no resolved content does not satisfy
  this rule.
- **`DESK-R31` — MUST state a planned-but-absent capability as prose only, with no path, link, or load
  target.** A forward mention says the capability is planned and not present today, names no path or file,
  carries no markdown link or path-shaped code span, and states that nothing in this skill loads or requires
  it. Pointing at content an owner does not hold is a dangling pointer that resolves, which is worse than a
  broken one.

### Must-Not-Follow

Each entry is the negative face of a named Must-Follow rule, so a finding can cite it and it is reachable
from both trace directions.

- **`DESK-N01` — NEVER call a window, an inter-process handler, a passing development build, or a packaged
  artifact a finished outcome.** Fix: return to `DESK-R01` and close the missing layers, paths, and operating
  systems. *Positive counterpart:* `DESK-R01`.
- **`DESK-N02` — NEVER skip a ladder rung silently, or answer a rung with an artifact produced after a later
  rung.** Fix: record the rung's resolution with its substantiating evidence, or prove it inapplicable from
  inspected evidence. *Positive counterparts:* `DESK-R05`, `DESK-R06`.
- **`DESK-N03` — NEVER present fidelity as one low-to-high dial.** Fix: state the three axes independently
  for the artifact in question. *Positive counterpart:* `DESK-R07`.
- **`DESK-N04` — NEVER treat a mockup, a rendered capture, or a running development build as behavioral,
  accessibility, or acceptance evidence.** Fix: take each claim to the evidence class that owns it.
  *Positive counterparts:* `DESK-R13`, `DESK-R25`.
- **`DESK-N05` — NEVER weaken, narrow, soften, or waive any of the four protected floors, and never accept a
  waiver token on one.** Fix: resolve the item with a permitted terminal; the token closes neither coverage
  nor acceptance. *Positive counterparts:* `DESK-R10`–`DESK-R13`.
- **`DESK-N06` — NEVER trust an inter-process payload or its sender because the declared type says it is
  safe.** Fix: validate the payload into a domain type and verify the sending frame before the privileged
  effect. *Positive counterpart:* `DESK-R15`.
- **`DESK-N07` — NEVER include `@types/node` in the renderer target's configuration.** Fix: remove it; a
  green type-check over code the sandbox rejects is a correctness and security inversion. *Positive
  counterpart:* `DESK-R17`.
- **`DESK-N08` — NEVER treat the ASAR archive, minification, or packaging as a security boundary, and never
  bundle a secret.** Fix: move the secret out of the artifact and rely on the fuses and the ASAR-integrity
  pair for load-time integrity. *Positive counterpart:* `DESK-R20`.
- **`DESK-N09` — NEVER state an unverified platform convention as fact, and never hedge it into a claim about
  what has not shipped.** Fix: mark the gap, name the retrieval or test that would close it, and write the
  rule so it does not depend on the answer. *Positive counterparts:* `DESK-R21`, `DESK-R26`.
- **`DESK-N10` — NEVER resolve the hardening-versus-testability conflict or the build-tool choice on the
  reader's behalf.** Fix: present both horns with their consequences as an explicit user decision, and state
  the selection criterion rather than a mandate. *Positive counterpart:* `DESK-R27`.
- **`DESK-N12` — NEVER name a deferred nested bundle as an existing owner, load target, or link
  destination.** Fix: state in prose that it is planned and absent, with no path and no link. *Positive
  counterpart:* `DESK-R31`.

### The four protected floors

Because this skill is the sole design owner for desktop work, nothing upstream supplies the floors the
generic interface and experience skills protect. All four are reconstructed here at full strength.

**Reconstruction form.** Each floor is a **property**, never an enumerated list of sufficient constructs,
because a property is closed against the cases nobody thought of and a construct list is defeated by the
first case absent from it. Each floor then carries three further parts, applied uniformly so no floor is left
with its closure at a larger number:

1. **Stated minimum.** Every union is a minimum enumeration, never the extent of the obligation. Lengthening
   a member list is not a fix for a closed list; it reproduces the closure at a larger number.
2. **Residual clause.** Any further instance that satisfies the floor's property is a member of that floor by
   the property, whether or not it appears in the list. Discovering one **adds** a member; it never narrows
   the floor.
3. **Property check.** Each floor carries one check whose **claim is the property itself**, evidenced by a
   sweep of the run's own clause, activity, or claim inventory. Its pass condition is explicitly **not
   satisfiable** by "every listed member passed" — that is the member check, a different check with a
   different claim. A run in which every listed member passes and one unlisted instance of the property is
   unhandled **fails the floor**.

**Deliberate widening 1, marked.** Parts 1–3 apply to **all four** floors, not only to the two whose parent
states an open property. `DESK-FLOOR-01` and `DESK-FLOOR-04` face a parent that *enumerates*, so their union
additionally works as a drop-detector: the stated count and members let an auditor prove no parent-named
dimension was lost. They keep that job unchanged and gain the minimum, the residual, and the property check
on top of it. Applying the triad uniformly is stricter than the parent, which is permitted.

**Strictness may relax; coverage may not.** No clause may present a floor as weaker, narrower, or waivable
than the generic parent states it. Widening is permitted, happens **four** times, and each instance is marked
as such — this one, plus one in `DESK-FLOOR-03`'s reach, one in `DESK-FLOOR-03`'s placement, and one in
`DESK-FLOOR-04`'s evidence axis. Where the parent states the same union twice at different granularities,
this skill takes the **wider** reading and records the discrepancy at the point of use.

**Non-waivability, uniformly.** For all four: a waiver token is invalid and closes neither coverage nor
acceptance. A failed or recorded-open resolution closes coverage only, never acceptance. No child convention,
platform authority, co-loaded contract, precedence rule, or load order can authorize or widen an exception.

**Acceptance reuses the operational checklist's own terminal enum; this skill defines no floor acceptance
predicate of its own.**

> A floor is **accepted** when every one of its items resolves **`PASS`**. An item that does not apply
> resolves **`n/a:<property>`** and is not an applicable item. Nothing else accepts a floor.

Every term above is defined by [`evaluation/checklist/SKILL.md`](../evaluation/checklist/SKILL.md), not here:
its **CR-3** makes acceptance the single positive condition that every applicable gate and required item
resolves `PASS`, and states that a `FAIL:<id>`, a `recorded-open`, or a `deferred` is coverage-closed but not
accepted — an owner or a pointer closes coverage, never acceptance. Its **CR-6** is the evidence floor: a
`PASS` cites what proves the pass condition true, and an `n/a:<property>` cites the inspected evidence that
the applicability predicate is false, so an applicable item can never be relabeled `n/a` to dodge the gate.
Its **CR-4** scopes every soft token to its permitted modes.

#### `DESK-FLOOR-01` — Accessibility

**Property.** Every required action, state, and meaning of the outcome remains available through every
applicable modality, and no identity choice, platform convention, aesthetic decision, component library, or
child convention reduces that availability.

**Union check — 16 members, a stated minimum.** Members 1–14 are the generic parent's own named dimensions;
15–16 are desktop additions.

1. perception · 2. operation · 3. focus or cursor flow · 4. reading or announcement order · 5. input
alternatives · 6. status · 7. error identification · 8. recovery · 9. timing · 10. motion · 11. contrast or
non-color cues · 12. language · 13. locale · 14. adaptation · 15. per-operating-system assistive-technology
behavior, using the verified named screen readers for the claimed systems — **UNVERIFIED: no Linux
screen-reader guidance exists**, and that gap is recorded rather than implied away · 16. reduced motion
honored from the renderer's own media query, because no such property exists on the platform theme API.

**Union-count note, recorded deliberately.** The generic parent states this union twice at different
granularities: its rule text lists 14 items with `language` and `locale` separate, and its checklist item
lists 13 with `language/locale` combined. This floor takes the **wider** reading — 14 — because a union may
not narrow. Anyone auditing this floor against the parent will see 13 in one place and 14 in another; that is
the reason.

**Residual clause.** The sixteen are a minimum. Any further modality, dimension, or mechanism through which a
required action, state, or meaning of *this* outcome becomes unavailable is a member of this floor by the
property, whether or not it is listed. Discovering one adds a member and never narrows the floor.

**Property check — `DESK-FLOOR-01-PROPERTY`.** *Claim:* every required action, state, and meaning of this
outcome is available through every applicable modality. *Evidence:* a sweep of the run's own action, state,
and meaning inventory against the modality set the outcome's surfaces actually require, with direct
behavioral results — not a member-by-member roll-up.
*Criticality:* **gate**. *Applicability:* **unconditional** — this check is never conditional and never
resolves `n/a`, because the property it claims holds of every desktop outcome; an applicability declaration
is a required field, and leaving it open would let an author close a non-waivable floor with
`n/a:<property>`. *Explicitly not satisfied by:* "members 1–16 all passed." *On fail:* block acceptance and
return to the owning rung or phase.

**Why members 15 and 16 are additions and not restatement.** The renderer is a browser engine, so web
accessibility applies unchanged. Member 15 exists because assistive-technology behavior is
per-operating-system. Member 16 exists because the platform theme API exposes high-contrast,
inverted-scheme, reduced-transparency, and differentiate-without-color signals but has **no** reduced-motion
property — reduced motion comes from the renderer's media query, and inventing a theme property for it is a
defect.

#### `DESK-FLOOR-02` — Safety

**Property.** No clause of the run permits an action whose consequence the actor cannot foresee, refuse, or
recover from.

The generic parent protects safety in **any** applicable item's claim or pass condition — an open property
over the whole run, with no enumeration anywhere. The nine members below are therefore a minimum enumeration
of the surfaces already known, never the extent of the obligation.

**Union check — 9 members, a stated minimum.** Each is a desktop surface where an unforeseeable,
unrefusable, or unrecoverable consequence is reachable:

1. a destructive action on the user's own data, which pairs with an explicit confirmation and a recovery
route · 2. an accelerator misfire, which pairs with undo, because an accelerator with no undo makes an
accidental trigger unrecoverable · 3. a local data write that can be interrupted, which is durable or
detectably incomplete · 4. a schema migration, **including its downgrade path**, because a user who installs
an older version after a newer one must not lose or corrupt data · 5. an at-rest secret store failure, which
fails closed rather than silently storing in the clear · 6. opening an external target derived from untrusted
content · 7. an update install racing live application state, which uses the platform's own
pre-quit-for-update hook rather than quitting under the application's feet · 8. a shipped release, which is
irreversible and therefore gated per `DESK-R24` · 9. a second-instance launch whose arguments are neither
ordered nor complete as expected, which is parsed by matching rather than by position.

**Residual clause.** Any other clause of this run that permits an action whose consequence the actor cannot
foresee, refuse, or recover from is a member of this floor **by the property**, whether or not it appears
above. Discovering one adds a member; it never narrows the floor. A run that satisfies members 1–9 and leaves
such a clause unhandled **fails this floor**. Lengthening this list is not a substitute for the property — a
longer list is still a closed list.

**Property check — `DESK-FLOOR-02-PROPERTY`.** *Claim:* no clause of this run permits an action whose
consequence the actor cannot foresee, refuse, or recover from. *Evidence:* a sweep of the run's **own clause
inventory** — every rule, phase step, channel, native integration, data operation, and release control the
run actually contains — each dispositioned foreseeable / refusable / recoverable or handled.
*Criticality:* **gate**. *Applicability:* **unconditional** — this check is never conditional and never resolves `n/a`,
because the property it claims holds of every desktop outcome; an applicability declaration is a required
field, and leaving it open would let an author close a non-waivable floor with `n/a:<property>`.
*Explicitly not satisfied by:* "members 1–9 all passed."
*On fail:* block acceptance and return to the clause's owning phase.

**Why member 9 is a safety member and not merely a correctness one.** The platform documents that the
argument list on a second instance is not exactly the same list, that its order might change, and that
additional arguments might be appended. Positional indexing therefore silently acts on the wrong argument —
for a deep link or a file-open request, an action on a target the user did not choose.

#### `DESK-FLOOR-03` — Participant consent and protection

**Property.** No activity involving a person begins, and no observation from one is used as evidence, unless
informed consent, needed accommodations, access to genuinely representative people, and the required evidence
conditions are in place, with collected data minimized and protected; a missing condition stops the run and
reports missing context rather than proceeding.

The parent states this as an obligation over **any** activity involving a person, with a fail-closed trigger
set rather than a member list. The seven members below are a minimum enumeration, never the extent of the
obligation.

**Union check — 7 members, a stated minimum.**

1. informed consent · 2. needed accommodations · 3. data minimization · 4. data protection and retention ·
5. observation kept separate from interpretation · 6. stated evidence limits · 7. **fail closed on the
parent's complete trigger set** — any one of **missing access to representative users, missing informed
consent, missing needed accommodations, or missing required evidence** yields a missing-context stop; the run
may record an assumptions register and a test plan but may not accept a design.

**The trigger set is the parent's four, in full.** Dropping either access to representative users or required
evidence is the difference between a floor that stops a run with no representative access and one that lets
it proceed on whoever was available.

**Residual clause.** Any other activity of this run that involves a person, or any other observation from a
person used as evidence, is governed by this floor **by the property**, whether or not the activity type
appears in the ladder or in the list above. A newly recognized participant activity adds a governed activity;
it never narrows the floor.

**Property check — `DESK-FLOOR-03-PROPERTY`.** *Claim:* every activity of this run that involves a person,
and every observation from a person used as evidence, was governed by this floor at the time it ran.
*Evidence:* a sweep of the run's **own activity inventory** — every rung round, interview, observation, card
sort, tree test, informal walkthrough, recruitment screening, and post-release contact whose output is cited
as evidence anywhere — each carrying its consent, accommodation, minimization, protection, and
representativeness record. *Criticality:* **gate**. *Applicability:* **unconditional** — this check is never
conditional and never resolves `n/a`, because the property it claims holds of every desktop outcome; an
applicability declaration is a required field, and leaving it open would let an author close a non-waivable
floor with `n/a:<property>`. *Explicitly not satisfied by:* "members 1–7 all passed," and explicitly not
satisfied by governing only the activities the ladder happens to name. *On fail:* stop and report missing
context; no design is accepted.

**Deliberate widening 2, marked — reach.** The generic parent's participant activity is concentrated at one
post-approval prototype test. This ladder puts people at **six** rungs — interviews at rung 0, observation at
rung 1, a card sort and a tree test at rung 2, a tree test at rung 3, a round at rung 6, and a round at rung
8 — so the floor applies at **every** participant activity, not only the last one. That is a widening of
reach, not a relaxation.

**Deliberate widening 3, marked — placement.** The parent declares four explicitly non-waivable protected
classes: accessibility, safety, current direct representative-user prototype testing, and complete
whole-specification approval before every prototype. Participant consent and protection lives in the parent's
rules and in the applicability conditions of its direct-evidence check, rather than as a separately numbered
protected class. This skill reconstructs it as a **first-class non-waivable floor** in its own right, which is
stricter than the parent's own placement and is why it is not folded into `DESK-FLOOR-04`.

#### `DESK-FLOOR-04` — Direct representative-user evidence is the acceptance evidence

**Property.** Acceptance of the design requires direct evidence from representative people using this run's
own artifacts, across the full observation-dimension set, per claimed operating system; every other signal is
context only.

**Union check — 7 members, a stated minimum.**

1. no fixed participant count — the method, sample, and claim boundary are derived from the question, the
diversity of affected people, the uncertainty, the impact, and the risk · 2. prior research, earlier tests,
analytics, expert review, heuristic review, standards conformance, and stakeholder approval are context only
· 3. a captured rendering and a static high-fidelity artifact are context only and never behavioral or
accessibility evidence · 4. the project owner counts as representative only when evidence shows that person
genuinely is · 5. claims stay bounded to the evidence, with observation separated from interpretation ·
6. **per claimed operating system** — evidence obtained on one operating system does not support a claim
about another · 7. **the complete observation-dimension set — fourteen dimensions**: perception,
comprehension, operation, completion, alternatives, errors, recovery, feedback, status recognition, trust,
accessibility, adaptation, workarounds, and unintended harm, each as applicable.

**Member 7 takes the wider of the parent's two statements.** The parent names **13** dimensions in its
checklist item and **14** in its own procedure step — the checklist item omits `feedback`, shortens `status
recognition` to `status`, and shortens `unintended harm` to `harm`. Presenting a non-waivable parent floor at
the narrower count would be a narrowing, so this floor carries **14**. Workflow, affordance, and realistic
response speed remain what the acceptance rung's *question* asks; the fourteen are the observation coverage
the acceptance evidence must carry. This is the set the ladder's acceptance rung points at by role, and it is
enumerated here and nowhere else, because a set enumerated twice drifts.

**Residual clause.** The seven are a minimum. Any further dimension the outcome makes material, and any
further claimed target axis the run declares, is a member of this floor by the property. Discovering one adds
a member; it never narrows the floor.

**Property check — `DESK-FLOOR-04-PROPERTY`.** *Claim:* every human-outcome claim this run makes is supported
by direct representative-user evidence from this run's own artifacts, on the operating system the claim is
about. *Evidence:* a sweep of the run's **own claim inventory** — every claim about what a person can
perceive, understand, operate, complete, or recover from — each mapped to the participant record and the
operating system that supports it, with unsupported claims removed or restated as context.
*Criticality:* **gate**. *Applicability:* **unconditional** — this check is never conditional and never resolves `n/a`,
because the property it claims holds of every desktop outcome; an applicability declaration is a required
field, and leaving it open would let an author close a non-waivable floor with `n/a:<property>`.
*Explicitly not satisfied by:* "members 1–7 all passed."
*On fail:* block acceptance and rerun the owning rung or report missing context.

**Deliberate widening 4, marked — evidence axis.** Member 6 is a desktop addition. The generic parent
requires separate evidence per claimed *surface*; here the operating system is itself an evidence axis, because window
behavior, menu structure, notification behavior, shortcut mapping, and assistive-technology behavior all
differ per system. Claiming three systems from evidence on one is the specific failure this member blocks.
This is the second desktop instantiation held here rather than in a generic rung definition: the ladder's
acceptance rung states its closing evidence generically, per claimed surface or delivery target the run
declares, and the fact that a desktop run's claimed targets are operating systems is a desktop override.

#### The parent's fourth protected class, and what carries its function here

The generic parent's fourth non-waivable class is **complete whole-specification approval before every
prototype**, including both document closure and chronology. It is deliberately **not** reconstructed, and
that is a direct consequence of this skill being the sole design owner rather than an omission:

- That class is the surface the ownership boundary routes around. Its pass condition requires that repository
  or artifact history prove no mockup, wireframe, coded demo, command stub, or other prototype predates the
  whole-specification approval. This skill's ladder *requires* wireflows at rung 6, a high-fidelity artifact
  at rung 7, and an interactive prototype at rung 8 — all before build. Under the parent's class those
  artifacts are prohibited before approval; under the behavioral-principle instruction to bring concrete
  materials generated before the prose they are required. The contradiction is real, surface-neutral, and
  pre-existing. Not co-loading the parent routes around it; it does not resolve it.
- **What carries its protective function here.** Three mechanisms, named so the loss is not silent: the rung
  order itself (`DESK-R05`); the citation chronology condition and its adversarial counterexample C1, which
  reject an answer produced after a later rung; and the design acceptance gate at `P4`, which requires the
  complete rung register plus all four floors before implementation begins.
- **Residual gap, stated — narrowed by `DESK-G3`, and not closed.** Those three mechanisms enforce *ordering
  within the ladder* and *completeness at the gate*. The structural-approval gate `DESK-G3` fires before any
  visual rung, so this design does have a pre-prototype approval point. What that point approves is the
  surface-neutral *structure*, not the whole specification — so the parent's stronger property, that no
  artifact of any prototype kind may exist before a single whole-specification approval, is still not
  reproduced. The gap is narrower and it survives. **Route any future proposal to close it back to the
  ownership decision that created it, because reconstructing the class would reintroduce the contradiction
  that decision routes around.**

## Procedure

Ten phases, in order. Each states its input, its action, the evidence it produces, and the branch it takes on
success, failure, or missing context. Ladder rungs 0–8 belong to `P3` and `P4`; the ladder's Build terminus
is `P7` and `P8`.

One worked example runs through all ten phases, marked **Clipmark** at each. It is this skill's only
illustration of the ladder, so it walks the ladder rung by rung rather than summarizing it. Clipmark is a
screen-capture annotator; the bounded outcome is *capture a region of the screen, annotate it, and save the
result to a folder the user chooses*. No such application exists in this repository — the example is written
to be followed, not to be pointed at.

### `P1` — Frame the outcome, the authority, and the stack fit

*Input:* the user trigger, the live application if one exists, project rules, applicable mistakes, and the
decision authority.

*Action:* **load [`ideation.md`](ideation.md) first and keep it open through `P6`** — it is the run's decision
tree, it fires every `DESK-R27` gate in interview order, and its `D5` establishes the participant conditions
before any rung begins, so a run that reaches `P3` without it has already passed a fail-closed axis. Then write
the one-sentence outcome and expand it per `DESK-R01`; enumerate the claimed operating systems; run the
six-criterion wrong-choice test per `DESK-R03`; state the ownership boundary per `DESK-R04`; open the design
record per `DESK-R29`.

*Evidence:* the locked outcome and scope contract, the operating-system claim set, the wrong-choice result
table with an inspected result per criterion, and the authority map naming every `DESK-R27` gate and who
holds it.

*Next:* a positive wrong-choice criterion routes to the user at `DESK-G1` as a stack decision and may end the
run; an unresolved scope or authority conflict stays in `P1`; otherwise `P2`.

> **Clipmark — `P1`.** Outcome: capture a screen region, annotate it, save it where the user chooses.
> Claimed systems: macOS and Windows; Linux is explicitly out of the claim set, which is recorded as a scope
> statement rather than left implicit. Wrong-choice test, inspected result per criterion: 1 no stated size
> requirement; 2 negative, because Linux is not claimed; 3 the team accepts the engine cadence; 4 no remote
> content is loaded; 5 **positive-looking** — screen capture and a global shortcut are native integrations —
> inspected and resolved negative, because the platform exposes both and no platform-exclusive interface is
> the point; 6 no legacy architecture is claimed. No criterion fires, so `DESK-G1` is recorded as not
> triggered rather than skipped. Ownership boundary: this skill owns the design progression; a separate
> cloud-sync product idea is named as out of scope under `DESK-R02`.

### `P2` — Establish the platform, version, and evidence foundation

*Input:* the locked outcome, the operating-system claim set, and the governing sources the outcome touches.

*Action:* pin the version baseline in [`runtime-deltas.md`](runtime-deltas.md) as the single owner of every
version literal; inspect the existing application's configuration, privilege boundary, data locations, and
release setup; reach a named owner document for every load-bearing external claim before it is written as a
fact; assess each source for authority, currency, and applicability; record every gap as a gap.

*Evidence:* the version-baseline block, the claim-to-owner register with no row left unnamed, and the gap
register with a named closing condition per gap.

*Next:* a material claim with no named owner document returns to a bounded study of that exact question; a
missing governing source is recorded as a gap, never filled in; otherwise `P3`.

> **Clipmark — `P2`.** The version baseline is pinned once and every later statement whose truth depends on
> it names that version in the same sentence. Two gaps are opened rather than closed by inference: the
> vendor's prescriptive design guidance cannot be retrieved (`DESK-R21`), so no menu-ordering claim is made;
> and the three-target compilation split is recorded with its `INFERRED` marking from `DESK-R17` rather than
> as a documented fact.

### The rung-closing decision rule

`DESK-R05` and `DESK-R06` make the nine rungs binding; this is the decision rule that closes one, and it
governs every rung resolution recorded in `P3` and `P4` below. It is stated **positively and
substantively** — each condition is about what the inspection *found*, not about whether an inspection
happened, because a procedural condition ("the pointer was inspected") is satisfied by an empty file at a
valid path.

> A rung is **accepted** when **both** of exactly two conditions hold: (1) its register row carries one of
> the three resolution kinds, and (2) that resolution is **substantiated** — what the inspection of the named
> evidence found satisfies every condition this rung's own question and this resolution kind impose. Nothing
> else accepts a rung.

**Arity, stated once and only here: exactly two conditions, conjoined, on the acceptance side.** Both are
necessary, and the truth table below is the four combinations of the two. Conjoining on the *acceptance* side
narrows what is accepted, which is the safe direction; the escape-hatch defect this guards against was an AND
on a *failure* condition, where each extra conjunct shrinks the set that fails. Condition (2) is itself the
conjunction of that kind's own conditions, each individually necessary.

**The coverage-only exclusion, stated as an exclusion.** A named owner, a recorded plan to answer the rung
later, a scheduled study, a stakeholder's approval, a sign-off, or an artifact at a higher rung closes
*coverage* of the run's own bookkeeping and **never** acceptance. None of these may appear as a **disjunct**
anywhere in this predicate, in any check that implements it, or in any evaluation replay of it.

#### The three resolution kinds

One row per rung in the rung register, nine rows.

| Resolution kind | Recorded value |
|---|---|
| Answered by producing the artifact | `answered:<pointer to the artifact produced in this run>` |
| Answered by citing an existing answer | `answered-by-citation:<pointer + scope statement>` |
| Proved inapplicable | `n-a:<the property proved false + the inspected evidence that proves it>` |

#### Substantive conditions per resolution kind

**`answered:` — answered by producing the artifact in this run.**

- **A1 — the named artifact resolves to substantive content.** The pointer opens, and what it opens is not
  empty, not a heading-only outline, and not a placeholder. A valid file can still be the wrong content.
- **A2 — the content answers this rung's own question text**, not the rung's topic.
- **A3 — the rung's `Done-condition` holds, read off the inspected artifact** rather than off a claim that it
  holds.
- **A4 — the rung's own `Closing evidence` exists and was inspected**, and where that evidence involves a
  person, `DESK-FLOOR-03`'s conditions held for that activity at the time it ran.
- **A5 — chronology, with sanctioned re-entry distinguished from a back-fill.** The condition rejects an
  artifact produced after a later rung's artifact **and left unreconciled**. It does not reject a revision
  reached through the re-entry the ladder itself mandates. Precisely:
  - **Rejected** — the row's artifact post-dates a later rung's artifact, the row records **no** re-entry,
    and no downstream rung that depended on the earlier answer carries a re-check. That is the back-fill this
    condition exists to catch: an answer produced late to make the register look complete.
  - **Accepted** — the row's artifact post-dates a later rung's artifact **because** a later rung's answer
    invalidated it and the run re-entered the earliest affected rung, the row records the re-entry and what
    triggered it, and every downstream rung that depended on the earlier answer carries a re-check against
    the revision. Re-entry is normal; leaving the downstream rungs unreconciled is not.

  Both ends are load-bearing. The ladder is explicitly re-enterable and `P3` and `P4` mandate returning to
  the earliest affected rung, so a bare "not produced after a later rung's artifact" would forbid the exact
  state the procedure requires.

**`answered-by-citation:` — a citation closes a rung only when all five conditions hold.** These five are not
advice adjacent to the predicate; they **are** its `answered-by-citation` branch.

1. **It addresses this rung's own question.** A citation is checked against the rung's question text, not
   against the rung's topic. A content inventory does not close the navigation rung; a task analysis does not
   close the information-architecture rung.
2. **It resolves to an inspectable artifact whose inspected content is substantive**, per A1's standard. The
   pointer names a path, a document and section, a prior session record, or another artifact a reader can
   open. A remembered decision, a conversation, or an assertion that the answer exists somewhere is not a
   citation.
3. **It states why it is still valid for this outcome.** The row records what has not changed since the cited
   answer was produced. A cited answer whose subject has since changed does not close the rung.
4. **It states what it does not cover.** A citation that answers part of the rung's question closes only that
   part; the remainder stays open and is answered or proved inapplicable in its own right. This is the clause
   that stops a partially-covering citation from silently closing a whole rung.
5. **It does not point forward or at itself.** A citation may not name an artifact produced later in this
   run, and may not name the rung's own output. This is the chronology condition, and it is unchanged by A5:
   a re-entered rung is re-*answered*, not closed by a forward-pointing citation.

**`n-a:` — proved inapplicable.**

- **N1 — it names a property, not a reason.** The row names the specific property of *this* outcome that
  makes the rung's question unanswerable or moot. "Small project," "no budget," "not needed here," and "the
  team already knows this" are reasons, not properties, and none of them closes a rung.
- **N2 — the property is proved from inspected evidence about this run's own outcome.** The inspection found
  the property; a plausible written account of why the rung does not apply is not a proof.
- **N3 — it is falsifiable.** The row names the observation that would make the rung applicable again.
- **N4 — it does not rest on a coverage property.** An owner, a plan, a schedule, or a sign-off cannot make a
  rung inapplicable.

#### Truth table

| Resolution kind recorded | Resolution substantiated | Rung accepted? | Coverage closed? |
|---|---|---|---|
| yes | yes | yes | yes |
| yes | no | **no** | yes — the row exists, so the bookkeeping is closed; acceptance is not |
| no | yes | **no** — a resolution kind is required, and evidence with no recorded resolution is not a resolution | no |
| no | no | **no** | no |

#### The disjunct escape-hatch probe

The recorded defect this probe exists to catch is an acceptance predicate that admitted a coverage property
as a **disjunct**. Probe it directly, and note that the *conjunct* form of this question is vacuous: adding a
conjunct only shrinks an accepted set, so it passes a defective predicate. Only the disjunct form fails one.

| Step | What is done | Expected result |
|---|---|---|
| 1 | Construct the three-term form `accepted ⇔ (kind recorded ∧ substantiated) ∨ owned` and evaluate it on the case *(kind recorded, **not** substantiated, owner named)* | the three-term form returns **accepted** — the escape hatch is real and reachable |
| 2 | Evaluate the shipped two-condition predicate on the same case | the shipped predicate returns **not accepted** |
| 3 | Search the shipped predicate text, every check that implements it, and every evaluation replay of it for `owned`, `recorded-open`, `planned`, `scheduled`, or `signed-off` in a disjunctive position | zero occurrences |

The probe **passes** when step 1 reproduces the hatch, step 2 rejects the same case, and step 3 returns zero.
Any step failing means the predicate has the hatch, and the repair belongs to this predicate, never to the
check that implements it.

#### The five adversarial counterexamples — four rejected, one accepted

| # | Counterexample | Disposition | Why |
|---|---|---|---|
| C1 | **Back-filled chronology** — a rung answered by an artifact produced after a later rung's artifact, with no recorded re-entry and no downstream re-check | **reject** | `answered` A5's reject end, or citation condition 5; the chronology condition is inside the predicate, not adjacent to it |
| C2 | **Wrong-target citation** — a rung closed by citing a real, inspectable, current artifact that answers a *different* rung's question | **reject** | citation condition 1; the citation branch's conditions are the predicate's conditions, so the question-versus-topic test is a condition of acceptance |
| C3 | **Uninspected inapplicability** — a rung marked inapplicable with a plausible written reason and no inspected evidence that the property is false | **reject** | `n-a` N1 **and** N2: a reason is not a property, and no inspection found the property |
| C4 | **Hollow pointer** — all nine rows present, every resolution kind recorded, one row's pointer resolving to an empty or placeholder artifact | **reject** | `answered` A1, and A2 and A3 in turn; the condition is what the inspection *found*, so an inspected empty file fails A1 outright |
| C5 | **Sanctioned re-entry** — a rung-8 round shows the taxonomy is wrong; the run re-enters rung 2, the row records the re-entry and its trigger, and rungs 3, 4, and 5 each carry a re-check against the revised taxonomy | **accept** | A5's accept end holds. A predicate that rejects this case forbids the state `P3` and `P4` mandate, and is unsound in the opposite direction from C1 |

A predicate that admits any of C1–C4, that rejects C5, or that fails any step of the probe above is unsound,
and the repair belongs here rather than to a check. Each counterexample is constructed as a disposable
fixture, run, proved rejected or accepted, and discarded; the recorded proof is the disposition and the
condition that produced it, never a summary of it.

### `P3` — Walk ladder rungs 0 through 4

*Input:* the locked outcome, the foundation, and the participant conditions from `DESK-R12`.

*Action:* resolve the research, task-analysis, information-architecture, navigation, and user-flow rungs,
each by its own question and validation method, in the generative-then-evaluative order per `DESK-R09`;
record each rung's resolution and its substantiating evidence. Each rung's question, default artifact,
done-condition, and closing evidence are [`fidelity-ladder.md`](fidelity-ladder.md)'s; the applicability
decision for each was taken at [`ideation.md`](ideation.md)'s `D6`.

*Evidence:* rung register rows 0–4, each with its resolution kind, artifact or citation pointer, and the
inspected findings that satisfy that kind's conditions; the participant consent and accommodation record for
every activity involving a person.

*Next:* a missing participant condition — access, consent, accommodations, or required evidence — stops the
run and reports missing context; a rung whose answer invalidates an earlier rung returns to the earliest
affected rung; otherwise `P4`.

> **Clipmark — `P3`, rung by rung.**
>
> - **Rung 0, research and problem definition.** Question: is this the right problem, for whom, in what
>   situation? Six contextual interviews with support engineers who annotate screenshots daily. Consent,
>   accommodations, and data minimization recorded per `DESK-FLOOR-03` *before* the first session, not after.
>   Resolution: `answered:` the persona set and interview guide in the design record.
> - **Rung 1, task analysis.** Question: what does the user actually do, in what order, at what cognitive
>   cost? Observation in the real work context, because a self-report alone does not close this rung. The
>   observed cost concentrates in re-finding the saved file, not in the capture. Resolution: `answered:` the
>   hierarchical task-analysis diagram.
> - **Rung 2, information architecture.** Question: what exists, how is it organized, and what is it called?
>   A generative card sort produced the users' own grouping and vocabulary, then an evaluative tree test
>   graded it — in that order, because running only a card sort leaves the structure ungraded and running
>   only a tree test grades a structure the users never shaped. Resolution: `answered:` the inventory and
>   taxonomy.
> - **Rung 3, navigation design.** Question: can users reach it? Tree testing reported both success rate and
>   directness; the first round passed success and failed directness on "recent captures," which was found
>   by wandering. Resolution: `answered:` the revised command structure.
> - **Rung 4, user flows.** Question: what is the path through a task, end to end? Each task from rung 1 has
>   a complete path including decision points, waits, failures, and recovery routes. The walkthrough named
>   one task with no flow — "capture cancelled mid-selection" — which was then designed rather than
>   discovered later. Resolution: `answered:` the flow set.
>
> No rung is closed by a citation here, so citation conditions 1–5 do not apply to this run's rows 0–4. Had
> an existing taxonomy been cited at rung 2, it would have had to address rung 2's own question, resolve to
> an inspectable and substantive artifact, state why it is still valid, state what it does not cover, and
> not point forward.

### `P4` — Walk ladder rungs 5 through 8, through two user gates

*Input:* rung register rows 0–4 and the three-axis fidelity decision per rung.

*Action:* resolve the structural-skeleton rung first and **stop at `DESK-G3`** — present the surface-neutral
structure, its state and path map, its surface mapping, and its open questions, and obtain the user's
explicit approval or reopening before any visual rung begins; then resolve the wireflow, mockup, and
interactive-prototype rungs, stating each visual artifact's position on all three fidelity axes; run the
round cadence per `DESK-R09`; hold the four floors per `DESK-R10`–`DESK-R13`, including each floor's property
check and residual clause; present the complete design record at `DESK-G4`, the design acceptance gate, per
`DESK-R27`. The rung questions and the three axis definitions are [`fidelity-ladder.md`](fidelity-ladder.md)'s;
the two gates run through [`ideation.md`](ideation.md)'s `D8` and `D9`.

*Evidence:* rung register row 5 carrying the `DESK-G3` decision; rung register rows 6–8 with the
per-visual-artifact three-axis statement; the direct representative-user records per claimed operating system
covering the full observation-dimension set; the four floor resolutions with their union checks and property
checks; and the explicit user decisions at both gates.

*Next:* a reopening at `DESK-G3` returns to the structural rung and no visual rung starts; starting a visual
rung with `DESK-G3` unresolved is itself a `DESK-R27` failure; an unresolved rung or an unmet floor blocks
`DESK-G4` and returns to the owning rung; acceptance is unavailable while `DESK-R12` or `DESK-R13` is unmet;
otherwise `P5`.

> **Clipmark — `P4`, rung by rung.**
>
> - **Rung 5, structural skeleton, surface-neutral.** Question: does one whole structure hold the outcome
>   together before any surface, layout, or visual decision is made? The specification names the hierarchy,
>   the stages, the command structure, action priority, information flow, system status, state
>   relationships, decision points, failure zones, recovery routes, handoffs, adaptation, and completion
>   evidence — without assuming a graphical layout — plus the mapping of each claimed surface onto that one
>   structure. Being non-visual, this rung carries no position on the visuals axis and owes no fidelity
>   statement. **The run stops at `DESK-G3`.** The user approved with one reopening condition, and the
>   register row records the *approval decision*, not merely the artifact. Resolution: `answered:`.
> - **Rung 6, low-fidelity structure.** Question: does the structure hold when a person tries to use it?
>   Clipmark is few windows with heavy in-place state change, so per `DESK-R08` the default primary artifact
>   is a **wireflow**, not page wireframes plus a site map. Three axes stated independently: interactivity
>   low (a facilitator simulates the response), visuals low, content medium (real capture filenames, no
>   final chrome). A round with representative users found a dead end after a cancelled capture. That round
>   is **iteration evidence, not acceptance evidence**. Resolution: `answered:`.
> - **Rung 7, high-fidelity presentation.** Question: do hierarchy and affordance read correctly with real
>   content and every state present? The rung-6 artifact carried to high visual and content fidelity, with
>   every state named in the design record present. Axes: interactivity low, visuals high, content high.
>   This artifact is a static simulation, so per `DESK-N04` it is not offered as behavioral or accessibility
>   evidence. Resolution: `answered:` plus heuristic review and component-level checks.
> - **Rung 8, interactive prototype.** Question: can the task be completed unaided, at a realistic response
>   speed? Axes: interactivity high, visuals high, content high. A round with representative users on this
>   run's own post-approval artifact, **run separately on macOS and on Windows** because `DESK-FLOOR-04`
>   member 6 makes the operating system an evidence axis, covering every applicable dimension of the
>   fourteen, with observations separated from interpretation. Resolution: `answered:`.
>
> All four floors are then resolved on both their member check and their property check. The safety property
> check caught what the member list did not: an unlisted tray-menu action cleared the capture cache with no
> confirmation and no recovery route — the `X5` shape, found by sweeping the run's own clause inventory
> rather than by re-reading members 1–9. `DESK-G4` is presented only after that is fixed.

### `P5` — Lock the desktop application contract

*Input:* the accepted design record and the platform foundation.

*Action:* fix the process split and the privileged surface, and enumerate every inter-process channel with its
payload type, its validation, and its sender rule ([`process-model.md`](process-model.md)); fix the window and
lifecycle contract, including the entry-mode inventory
([`windows-lifecycle.md`](windows-lifecycle.md)); the local data contract including the migration and downgrade
path ([`filesystem-data.md`](filesystem-data.md)); the native integration set, tray and dock included
([`native-integration.md`](native-integration.md)); the security posture as the two distinct kinds of work
([`security.md`](security.md)); and the per-operating-system deltas
([`runtime-deltas.md`](runtime-deltas.md)).

*Evidence:* the approved application contract with a channel inventory, a lifecycle and window-state map, a
data and migration map, and a per-operating-system delta matrix.

*Next:* a contradiction with the existing application or with the accepted design returns to its owner before
implementation; otherwise `P6`.

> **Clipmark — `P5`.** Three channels are enumerated: `capture:region`, `annotate:commit`, and `file:save`.
> Each names its payload type, its runtime validation into a domain type, and its `event.senderFrame` check,
> because a declared type states a shape and never validates one (`P-3`, `DESK-R15`). `file:save` writes
> outside the application's own data directory, so it is main-only and the renderer never receives a path.
> Window state restoration is not built in, so restoring the last capture-window bounds is a dependency
> decision routed to `DESK-G7` rather than assumed.

### `P6` — Plan proof, the build matrix, and release controls

*Input:* the locked application contract.

*Action:* select the applicable scenario cases ([`scenarios.md`](scenarios.md)) and checks
([`checklists.md`](checklists.md)); set the quality targets from a project owner or current evidence; decide
the hardening-versus-testability build matrix as an explicit user decision at `DESK-G5`; apply the build-tool
selection criterion at `DESK-G6` ([`packaging-distribution.md`](packaging-distribution.md)); plan the signing,
notarization, update, channel, staged-rollout, and stop-condition controls
([`signing-updates.md`](signing-updates.md)).

*Evidence:* the case and check register, the quality-target table with a source per target, the recorded
build-matrix decision with both horns stated, and the release-control plan.

*Next:* an undecided build matrix or an unsourced target stays in `P6`; any irreversible external step is
marked as needing its own authority; otherwise `P7`.

> **Clipmark — `P6`.** The hardening-versus-testability conflict is presented at `DESK-G5` with both horns
> named and neither resolved on the reader's behalf (`DESK-N10`): either the release build is not automatable
> by the inspect-fuse path, or the automated build is not the hardened one. The user chose a hardened release
> build plus a separate automatable build, and the decision is recorded with its consequence — the automated
> suite does not exercise the artifact that ships, which is carried forward as a stated verification limit
> rather than absorbed.

### `P7` — Build the thin three-target vertical code skeleton

*Input:* the locked contract and the accepted design record.

*Action:* materialize the three compilation projects — and carry `DESK-R17`'s `INFERRED` marking into this
phase's own record, because the three-target split is derived from the verified preload-context sentence and
is not documented by any primary source, so the phase states it as derived wherever it states it — plus the
shared contract type, the bridge surface, the channel signatures with stub handlers, the window creation
path, and the instrumentation points ([`process-model.md`](process-model.md) owns the context split and the
crossable-type boundary); connect the smallest real path from a window through the bridge to a privileged
effect and a truthful completion.

*Evidence:* a green type-check per target, an import and build check, and one end-to-end trace with the
effect observed at its authoritative source.

*Next:* a structural defect returns to `P5`; a privilege or type-boundary defect returns to `P5` and not to a
body; otherwise `P8`.

> **Clipmark — `P7`.** The vertical path is: window → bridge → `file:save` → a real file on disk, observed by
> reading the disk rather than by trusting the handler's return value. The renderer target excludes
> `@types/node` (`DESK-N07`); adding it would have type-checked green over a `fs` call the sandbox rejects at
> run time.

### `P8` — Grow behavior one verified slice at a time

*Input:* the verified code skeleton and the case register.

*Action:* add the ordinary path, then the alternative-valid classes, the exact boundaries, the failures and
recovery, the adversarial behavior, the per-operating-system deltas, and the compatibility and migration
behavior — the case classes are [`scenarios.md`](scenarios.md)'s and the deltas are
[`runtime-deltas.md`](runtime-deltas.md)'s; move code, contract, data, configuration, documentation, tests,
and instrumentation together in each slice and verify that slice before the next.

*Evidence:* an ordered slice log, each entry carrying its own fresh focused verification and its updated
affected-surface trace.

*Next:* a slice that breaks the contract returns to `P5`; an in-scope path left unimplemented blocks `P9`;
otherwise `P9`.

> **Clipmark — `P8`.** The cancelled-capture recovery path found at rung 6 is implemented as its own slice
> rather than deferred, because rung 4's flow set named it and `DESK-N01` forbids calling the outcome
> finished with a designed path unimplemented.

### `P9` — Verify the whole change through the extended order

*Input:* the grown implementation and the quality targets.

*Action:* run the language-level order to build, then the four added gates per `DESK-R23` — package per
operating system ([`packaging-distribution.md`](packaging-distribution.md)), install and smoke-test in a clean
environment, verify signature and notarization on the real artifact, rehearse an update from the previously
released version ([`signing-updates.md`](signing-updates.md)) — resolve the applicable items of
[`checklists.md`](checklists.md)'s implementation pause point, and take each remaining claim to the evidence
class that owns it per `DESK-R25`.

*Evidence:* the claim-owner verification matrix naming the exact command or action, environment, version and
configuration, fresh result, artifact pointer, and limitation for each claim; a per-operating-system row for
each claimed system.

*Next:* a failed gate returns to its owning phase; an unrunnable gate is recorded as a limitation and blocks
the claim it would have proved, never widened into a weaker signal; otherwise `P10`.

> **Clipmark — `P9`.** The update rehearsal is run from the previously released version, not from a fresh
> install, because a fresh install proves a different claim. The macOS notarization check runs against the
> real packaged artifact rather than against the development build, and the two results stay separate rows
> in the matrix per `DESK-R25`.

### `P10` — Evaluate independently and hand off release readiness

*Input:* the complete evidence bundle.

*Action:* route independent review through [`evaluation.md`](evaluation.md); prove the trace and the verifier
per `DESK-R28`; keep the claims separate per `DESK-R25`; publish the contract, the design acceptance state,
the verification limits, the per-operating-system support matrix, the signing and update configuration, the
channel and rollout plan, the stop conditions, the supported-old-version window per `DESK-R24`, and the
release-authority state at `DESK-G8`.

*Evidence:* the evaluation outputs, the filled checklist copy, the claim ledger, and a cold-reader handoff
that lets another operator release or forward-fix with no hidden session context.

*Next:* any applicable gate not passing blocks release readiness; a finding returns to its earliest owning
rule and reruns the affected gate and any dependent whole-outcome proof.

> **Clipmark — `P10`.** Release authority is asked for at `DESK-G8` with the supported-old-version window
> stated, because the release is irreversible: the shipped build cannot be recalled and old versions persist
> on user machines indefinitely, so rollback means a forward fix (`DESK-R24`). The handoff records that the
> automated suite exercised the non-hardened build — the `P6` limit — rather than letting it disappear into
> a green summary.

## References

Every borrowed fact has one owner. This section names the owner; it never restates what the owner holds.

**Inside this family — the thirteen siblings.** Each owns its own mechanics; this file owns all policy.

- [`fidelity-ladder.md`](fidelity-ladder.md) owns the nine generic rungs, the three fidelity axes, the
  shape-conditioned selection rule, the card-sort-then-tree-test order, the round cadence, and the
  deliverable vocabulary. Every desktop instantiation of one of its defaults lives here instead.
- [`ideation.md`](ideation.md) owns the per-run decision tree and the content of the `DESK-G` gates that
  `DESK-R27` makes binding.
- [`process-model.md`](process-model.md) owns the four execution contexts, the IPC pattern table, sender and
  payload validation, the `contextBridge` crossable-type boundary, `MessagePort` lifetime, and the
  three-target split.
- [`security.md`](security.md) owns the two kinds of security work, CSP delivery, the fuse set and the paired
  ASAR fuses, what ASAR is not, and the supply-chain scanner gap.
- [`windows-lifecycle.md`](windows-lifecycle.md) owns creation and first paint, state restoration, per-OS
  quit and activation, single-instance and argument handling, deep links, and the entry-mode inventory.
- [`native-integration.md`](native-integration.md) owns menus, the tray and menu-bar residency, the macOS dock
  property, shortcuts, notifications, dialogs, clipboard, drag-and-drop, custom window chrome, theming, and
  file associations.
- [`filesystem-data.md`](filesystem-data.md) owns user-data locations, durable writes, schema migration
  including the downgrade path, at-rest secret handling, and the never-write list.
- [`packaging-distribution.md`](packaging-distribution.md) owns per-OS targets, the build-tool selection
  criterion, ASAR packaging, native-module rebuild, and resource-path resolution.
- [`signing-updates.md`](signing-updates.md) owns signing, notarization, update feeds, channels, staged
  rollout, and the supported-old-version window.
- [`runtime-deltas.md`](runtime-deltas.md) is the **sole owner of every version literal in this family** —
  the platform, engine, and runtime versions, the supported-major set, the cadence, the end-of-life date, the
  per-feature availability versions, and the archive-integrity per-system minimums. Every other file states
  the property and points here.
- [`scenarios.md`](scenarios.md) owns the ten families, the case set, and the authoritative case-to-check
  relation.
- [`checklists.md`](checklists.md) owns the `DESK-CHECK-NN` items, the pause points, the two projection
  tables, and the two truth tables — the gate-resolution table and the protected-waiver acceptance table that
  exercises the non-waivability rule stated above. This file states the rule; that file tables it.
- [`evaluation.md`](evaluation.md) owns the evaluator entrypoint, the rule-to-coverage crosswalk, and the
  desktop lenses.

**Outside this family.**

- [`coding`](../coding/SKILL.md) owns language-agnostic construction quality, including the trust-boundary
  property this skill instantiates at the privilege boundary.
- [`typescript`](../typescript/SKILL.md) owns general language idiom, with
  [`typing.md`](../typescript/typing.md) for declaration-versus-verification and declaration-file authoring,
  [`modules-tooling.md`](../typescript/modules-tooling.md) for the flag set and the import-extension fork,
  and [`async-resources.md`](../typescript/async-resources.md) for disposal.
- [`evaluation`](../evaluation/SKILL.md) owns the evaluator perspectives, causal findings, and verdict
  derivation. [`evaluation/checklist`](../evaluation/checklist/SKILL.md) owns perspective-led scenario and
  checklist-source construction, including the scenario classes and nested checklist rows this skill reuses.
- [`discussion`](../discussion/SKILL.md) owns question and decision quality at every `DESK-R27` gate.
- [`skill-writing`](../skill-writing/SKILL.md) owns the authoring standard this file is written against.

### Gap register

Fourteen items this skill carries as gaps rather than as facts. Each keeps its marking word at its point of
use, and each row below names what would close it, so a later session can close one without re-deriving the
search. This register is the skill's own; it is not the per-run unknown and gap register that `DESK-R29`
requires inside the design record.

The `#` column keeps the design's own item numbers so a later session can cross-reference them, which is why
the sequence has gaps: items 6 and 8 are secondary-lead-only leads whose treatment is already fixed and which
need no closing condition, and items 16 and 17 are reader-owned decisions rather than facts to close.

| # | Marking | Gap | Closing condition | Kind |
|---|---|---|---|---|
| 1 | **INFERRED** | the three-configuration split — main gets `@types/node` and no DOM, the renderer gets the DOM and must exclude `node`, preload is a third and narrowest target | a primary source states the three-target split, or the derived label stands permanently | retrieval |
| 2 | **UNKNOWN** | whether the main process can run a TypeScript entry directly through the runtime's own type stripping | one test: run a TypeScript main entry under the pinned runtime version and record the result | test |
| 3 | **UNVERIFIED** | the Windows update signature-verification mechanism — the updater documentation provides no details | the vendor documents the mechanism | retrieval |
| 4 | **UNVERIFIED** | whether a custom V8 startup-snapshot workflow for application code is documented | the vendor documents such a workflow for application code | retrieval |
| 5 | **UNVERIFIED** | bundle-size and memory-leak lore, secondary-lead only | an authoritative source replaces the lore; otherwise it stays unstated permanently | retrieval, low value |
| 7 | **NOT RESEARCHED** | Flutter desktop and .NET/MAUI — no comparative claim about either appears anywhere in this skill | a bounded study of the two, if a future run needs the comparison | research |
| 9 | **UNVERIFIED** | the vendor's whole prescriptive design-guidance surface; its pages are client-rendered and return no body content to a fetch | a JavaScript-rendering retrieval path for that guidance | tooling |
| 10 | **UNVERIFIED** | macOS hardened runtime and entitlements — the code-signing document does not cover them | that document, or another authoritative source, covers hardened runtime and entitlements | retrieval |
| 11 | **UNVERIFIED** | Linux screen-reader guidance — none exists, which is why `DESK-FLOOR-01` member 15 states the gap instead of implying parity across three systems | platform guidance for the third operating system's screen reader appears | retrieval |
| 12 | **NOT FOUND** | a maintained free replacement for the standard static scanner, which its own maintainers state is no longer maintained | a maintained free scanner appears, or the gap is accepted permanently | retrieval |
| 13 | **UNVERIFIED** | information density and dense professional layouts, and offline-first desktop behavior — no authoritative source found, and the platform's own calm-design principle pulls against density | an authoritative source on either is found | research |
| 14 | **UNVERIFIED** | a rationale for the removal of the former remote module — the process-model document gives none | a maintainer statement on the removal rationale is found | retrieval |
| 15 | **UNVERIFIED** | end-to-end typed IPC guidance — no official guidance exists and no community library is canonical, so every such library is a new production dependency and therefore a `DESK-G7` decision, never a default | official guidance appears, or one library becomes canonical | retrieval |
| 18 | **UNVERIFIED** | the dock interface's own hide, show, and activation-policy operations — the property's per-system presence is documented, but the operations live on a separate page that was not retrieved, so nothing about their behaviour is stated | that page is read, or another authoritative source covers those operations | retrieval |

Two further items are **not** gaps and are not listed above, because they are decisions the reader owns
rather than facts to close: which build tool is the default, which `DESK-R27` routes to `DESK-G6` as a stated
criterion; and the build-time-hardening-versus-test-automation conflict, which `DESK-R27` routes to `DESK-G5`
as an explicit build-matrix decision with both horns named.

**This skill has not been exercised on a real project.** No desktop application exists in this repository, so
the worked example in `P1`–`P10` and a bounded cold-load proof are its only exercise before first real use.
Do not mistake its completeness for field validation.
