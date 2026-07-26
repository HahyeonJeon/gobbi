---
name: eval-claude-execution-i1
description: Fresh independent Claude evaluation of the shipped react project skill, execution EVALUATION iteration 1, seven perspectives plus Overall.
type: reviews
scope: project
feature: null
status: active
created: 2026-07-26
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [process, docs-sync]
keywords: [react-skill, evaluation, seven-perspectives, rule-source-narrowing, quotation-fidelity]
author: claude
review_kind: adversarial-review
subject: .gobbi/projects/gobbi/skills/react/
verdict: revise
---

# Evaluation — `react` project skill · execution / EVALUATION / 1

**Assignment.** `eval-claude-execution-i1` · Claude system · fresh independent evaluator.

## 1. Subject, version, and independence

| | |
|---|---|
| Subject | `<worktree>/.gobbi/projects/gobbi/skills/react/` — 14 `.md` files |
| Digest | `eeb13a82ffb8109829c0c395335a62f2815c0f69d481384ef0dfb1880ee84eeb` — **recomputed and matched** |
| Digest command | `ls -1 *.md \| sort \| xargs sha256sum \| sha256sum` |
| Worktree HEAD | `84f2c646` · working tree clean |
| Independence | I did not design, author, plan, or implement any part of this skill, and I read no peer evaluator output. No conflict. |

Supporting read-only inputs: the P7 cold-load proof and the planning synthesis, both at the paths named
in the brief. Both exist and were read in full.

## 2. Governing contract and declared verdict rules

`skills/evaluation/SKILL.md` governs method. **Schema discrepancy, recorded rather than absorbed:** the
brief and `agents/evaluator.md` both direct me to load a `Type / Domain / Disposition / Confidence /
Severity` finding schema from `evaluation/SKILL.md` § *Finding Metadata*. **That section does not exist in
the current `evaluation/SKILL.md`.** Per the brief's escape path (method skill wins), I used the method
skill's own finding field set — Procedure step 5.5: expected condition, observed condition, impact, root
cause or leading hypothesis, evidence, tested alternative, uncertainty, severity, confidence, corrective
direction — and adopted the verdict thresholds from `agents/evaluator.md` as the applicable governing
contract, declared here **before** any verdict was computed:

- any **Critical** finding at confidence ≥ 75 → `FAIL`
- else any **High** at confidence ≥ 50 → `REVISE`
- else → `PASS`

Confidence anchors: `100` tool-verified against a primary artifact; `75` close reading plus citation;
`50` reasoned from the artifact without external confirmation; `25` hypothesis.

**Project rules.** `NO_PROJECT_RULES` does **not** apply: `.gobbi/projects/gobbi/rules/` exists and is
non-empty. Its one file, `rules/docs/point-dont-restate-workflow-docs.md`, was read; its scope is
`workflow/steps/*.md` only and it does not bind this subject.

## 3. Methods and coverage

Text-only artifact with live external sources, so: close reading of all 14 files in full, plus tool
verification wherever a claim was mechanically checkable.

| Method | What it covered | Result |
|---|---|---|
| Digest recompute | subject freeze | matched |
| Fetch of all 55 cited URLs | primary-source corpus, 2.3 MB normalized | 55/55 fetched |
| Scripted quotation sweep | **226** quotations, markup-robust alphanumeric match | 225 resolve verbatim; 1 partial |
| Rule-vs-source audit | all 18 `H{n}` against their own cited pages | 3 narrowings found |
| npm registry re-resolution | **36** `ecosystem.md` package rows | 34 exact; 2 method mismatches |
| Legend substring check | all 33 `Resolves to` clauses vs `SKILL.md` | 33/33 live substrings |
| Anchor sweep, both ways | `H{n}`, `REACT-CHECK-*`, `REACT-SCENARIO-*` | no orphans, no dangling |
| Count reproduction | 35 items / 20 gates / 15 required / 25 conditional / 48 cells | all reproduced |
| Link guard | `scripts/check-markdown-links.sh` over the skill | 58 paths + 1 anchor, exit 0 |
| Topology + fixture + smoke guards | the three `scripts/` guards | exit 0, 0, 0 |
| Mirror parity | `.claude/`, `plugins/gobbi/`, `.agents/` | identical digest; 14/14 mode `120000` |
| Diff-vs-contract | change set against plan §6 | one out-of-boundary edit |

**Sampling rationale.** Quotation checking was complete, not sampled (all 226). Registry re-resolution was
complete for every package named. The rule-vs-source audit was complete for all 18 rules. The one place I
sampled rather than enumerated is the CR-5 conjunction scan, where I read every gate/required item and
report the clearest instances.

## 4. Finding ledger

Ordered most severe first. IDs are stable.

---

### RX-01 · High · confidence 100 · Risk

**`H16` is narrower than the security-checklist item it cites, and `REACT-CHECK-28` passes clean on a
renderer the cited source says must not ship.**

- **Expected.** A rule citing four numbered checklist items carries the obligation of all four.
- **Observed.** `SKILL.md:230-234` — `H16` reads "NEVER expose a raw process bridge to a renderer, and
  never run one with Node integration enabled or context isolation disabled. … Source: electronjs.org
  security checklist, **items 2, 3, 4, and 20**." Item 4 is *Enable process sandboxing*: *"You should
  enable the sandbox in all renderers."* The rule's obligation names Node integration (item 2) and context
  isolation (item 3) and omits the sandbox entirely. `grep -i sandbox` over `SKILL.md`, `scenarios.md`,
  `checklists.md`, `evaluation.md` returns exactly one hit — `SKILL.md:493`, References prose, which even
  states the source covers "context isolation **and the sandbox** enabled."
- **Impact.** `REACT-CHECK-28` (`checklists.md:259-269`) is a **gate** whose whole claim is "Node
  integration off and context isolation on." `runtime.md:127-129` quotes the coupling itself — *"Disabling
  context isolation (see above) also disables process sandboxing, regardless of the default, `sandbox:
  false` or globally enabled sandboxing!"* — which proves the implication runs one way only: context
  isolation on does **not** imply the sandbox on. A renderer shipped with `contextIsolation: true` and
  `sandbox: false` resolves `-28` `PASS`, resolves `-20` `PASS`, and violates the item `H16` cites.
- **Root cause.** The rule was written from the two flags that name themselves in its own sentence, and
  the citation list was assembled from the material `runtime.md` covers rather than from the obligations
  the rule states. `runtime.md` carries the sandbox fact correctly; the normative layer never received it.
- **Alternative tested.** That the sandbox is subsumed by context isolation — refuted by the source
  sentence the skill itself quotes. That the sandbox is out of scope as an Electron-configuration concern
  rather than React — refuted by `H16` already carrying `nodeIntegration` and `contextIsolation`, which
  are the same class of concern.
- **Verification.** `curl` of `electronjs.org/docs/latest/tutorial/security`, checklist enumerated to
  confirm item 4 = "Enable process sandboxing" and item 20 = "Do not expose Electron APIs to untrusted web
  content"; `grep -n -i sandbox` over the four normative files.
- **Corrective direction.** Either extend `H16`'s obligation and `-28`'s claim to the sandbox, or narrow
  the citation to items 2, 3, 20 and record the sandbox as deliberately out of the rule. Do not leave the
  citation asserting an obligation the rule does not carry.

---

### RX-02 · High · confidence 100 · Usage

**`H9`'s return-focus obligation is unconditional where its cited source is conditional, so gate
`REACT-CHECK-18` fails an implementation the source explicitly sanctions.**

- **Expected.** `H9` matches the WAI-ARIA APG modal-dialog pattern it cites.
- **Observed.** `SKILL.md:171-181` — "when it closes, focus returns to the element that invoked it", with
  an `Exceptions —` block listing only the three First-Rule-of-ARIA circumstances. `SKILL.md:105-106` sets
  the reading rule: *"A rule with no stated exception has none."* The APG source states:
  > "When a dialog closes, focus returns to the element that invoked the dialog **unless either**: The
  > invoking element no longer exists. Then, focus is set on another element that provides logical work
  > flow. [or] The work flow design includes the following conditions … For example, a grid has an
  > associated toolbar with a button for adding rows. The Add Rows button opens a dialog that prompts for
  > the number of rows. After the dialog closes, focus is placed in the first cell of the first new row."
- **Impact.** `REACT-CHECK-18` (`checklists.md:405-414`) is a **gate**: "Pass when … immediately after
  close, the focused element is **the control that invoked it**." A confirm-delete dialog whose action
  removes its own invoking row, and the APG's own Add-Rows case, cannot resolve `PASS`. The register
  forbids relabelling an applicable item `n/a`, and forbids waivers (correctly — `checklist/SKILL.md` CR-4
  scopes `waived` to operational mode only). A correct, source-sanctioned implementation is therefore
  blocked, or the gate is resolved dishonestly.
- **Root cause.** This is the *same* defect class already repaired once on this rule. Commit `52f20f24`
  restored `H9`'s third circumstance from *Using ARIA*; the rule's **other** cited source, the APG modal
  dialog pattern, was never audited for the same narrowing. The repair was scoped to the finding, not to
  the rule.
- **Alternative tested.** That the APG conditions are guidance rather than part of the pattern — refuted:
  they sit inside the pattern's own Keyboard Interaction/focus notes, in the same normative voice as the
  open-focus sentence `H9` does carry.
- **Verification.** `curl` of `w3.org/WAI/ARIA/apg/patterns/dialog-modal/`, passage extracted verbatim.
- **Corrective direction.** Carry the two `unless either` conditions into `H9` as stated exceptions and
  give `-18` the matching `n/a`/alternate-pass form, or restate the obligation as "focus is moved
  deliberately and its destination is recorded" so a sanctioned alternative destination can pass.

---

### RX-03 · High · confidence 100 · Risk

**`REACT-CHECK-31` drops the second half of Procedure P7's acceptance condition, so a bug fix can resolve
every check `PASS` while its reproducer still fires.**

- **Expected.** The single item the coverage map assigns to `Procedure P7` resolves P7's stated pass
  condition.
- **Observed.** `SKILL.md:410-413`: "For a bug, re-run the P1 reproducer last. **P7 passes only when**
  every applicable gate exits clean on fresh output **and the reproducer no longer fires**."
  `checklists.md:552-557` coverage map: `Procedure P7` → item `31`, and nothing else.
  `REACT-CHECK-31` (`checklists.md:506-515`) enumerates the seven gates plus the desktop packaged-build
  rider and stops. `grep -n -i reproduc` over `scenarios.md` and `checklists.md` returns **zero** hits.
  `SKILL.md:290,303` also make the reproducer a P1 completion condition; `REACT-CHECK-25`, the item that
  records the P1 contract, records only host, compiler switch, and source language.
- **Impact.** The whole bug-fix path — reproduce at P1, fix, re-verify at P7 — has no scenario family and
  no check. On a bug-fix change-set the register closes coverage and reports acceptance with the original
  defect unproven-gone. This is the failure shape the brief flagged as recurrent, in its purest form: the
  check passes, the defect ships.
- **Root cause.** `-31` was derived from P7's *gate list*, which is a bulleted sequence and reads as the
  whole of P7, rather than from P7's *pass condition sentence*, which adds a second conjunct outside the
  list.
- **Alternative tested.** That the reproducer is covered by "component tests" or "full test suite" inside
  `-31` — refuted: those gates prove the suite is green, which is exactly what a regression test added
  *without* reproducing the original failure also proves; `SKILL.md` states the reproducer as a separate
  conjunct precisely because the suite does not imply it.
- **Corrective direction.** Add the reproducer conjunct to `-31`, or add a separate conditional item
  predicated on "the change fixes a reported bug", with `n/a` cited from the change's own trigger.

---

### RX-04 · High · confidence 75 · Usage

**The register is bound to two consumers with different evidence availability, and its mode forbids the
tokens the second consumer needs — so the executor's P8 self-check has no honest resolution on several
unconditional gates.**

- **Expected.** Both declared consumers can resolve every applicable item from evidence they can obtain.
- **Observed.** `checklists.md:3-4` names two consumers: "An evaluator activates the applicable items
  through `evaluation.md`; **an executor answers the same items as a pre-handoff self-check at Procedure
  P8.**" `checklists.md:9` declares mode "Evaluation coverage register". `:22-28` admits only
  `PASS` / `FAIL:<id>` / `n/a:<property>`; `:33` "There is no waiver in this mode"; `:35-38` sets a hard
  evidence floor. `checklist/SKILL.md` CR-4 confirms this is *mandated*, not self-imposed:
  `recorded-open` is operational-and-design only, `deferred` design only, `waived` operational only.
  Several gates then name bespoke runtime experiments as their evidence:
  - `-01` **unconditional gate** — "render the component twice with identical props and compare the output
    and any external state it touches"
  - `-09` gate — "unmount the component and confirm no listener or timer remains live"
  - `-10` gate — "Issue two requests whose responses resolve in inverted order"
  - `-17` / `-18` gates — "Operate each element with the keyboard only"
  - `-20` gate — "from page-context code, call it and record what it can reach"

  `SKILL.md`'s Procedure P7 gate list (format, lint, type-check, component tests, full suite, e2e, build)
  produces none of this, and P8 runs after P7.
- **Impact.** The executor either fabricates a `PASS` from reading — the exact false pass `:35-38`
  forbids — or the change-set can never reach acceptance. Acceptance is defined as "every applicable gate
  and required item resolves `PASS`" with no waiver, so a single unobtainable gate blocks the whole run.
- **Supporting signal that the shape was seen.** `checklists.md:600-602` grants a weaker-observation
  fallback to exactly one item: "`REACT-CHECK-16` depends on a second client … Where neither is available
  in the review environment, the item resolves from the recorded invalidation trigger being exercised — a
  weaker observation … and the run should say which it used." No equivalent relief is given to `-01`,
  `-09`, `-10`, `-17`, `-18`, `-20`, and none of them appears in the Coverage-gaps section.
- **Provenance.** The P7 cold-load proof named this as defect **5(c)** ("`checklists.md`'s evidence floor
  makes pre-runtime self-review structurally unresolvable"). It shipped unrepaired and undisclosed.
- **Root cause.** One register was given two consumers whose evidence budgets differ by an order of
  magnitude, and the mode that fits the evaluator consumer removes the tokens the executor consumer needs.
- **Alternative tested.** That a mature project test suite already yields this evidence — partly true for
  `-01` and `-10` where a test happens to exist, but `-09`'s live-listener check and `-20`'s
  page-context enumeration require instrumentation no ordinary suite carries; and `-01` is
  **unconditional**, so it applies to change-sets that add no test at all.
- **Uncertainty (why 75, not 100).** I could not run the register against a real React change-set, so I
  cannot quantify how often the evidence is in fact unobtainable — only that the mode admits no legal
  resolution when it is.
- **Corrective direction.** Choices for the owner: split the executor self-check into a design-mode
  companion where `recorded-open` is legal; or generalize `-16`'s weaker-observation clause into a
  register-level evidence-substitution rule; or narrow the named evidence to what P7's gates actually
  produce and move the experiments into scenario oracles.

---

### RX-05 · Medium · confidence 75 · Structure

**Several gate/required items fuse independently falsifiable clauses into one binary claim, against
`checklist/SKILL.md` CR-5 — including the one the cold-load proof already named.**

- **Expected.** CR-5: "A gate or required item also carries one atomic binary claim … **independently
  falsifiable clauses are separate items**."
- **Observed.**
  - `-29` (`checklists.md:486-495`): "Each such test finds its subject through the user-visible surface
    **and** imports `act` from `react` where it uses it." `testing.md:140-141` lists these under two
    different owners (Testing Library's query priority; react.dev's `act` reference). They fail
    independently and their fixes are unrelated — one is a query rewrite, one is an import path.
  - `-28` (`:259-269`): "Node integration off **and** context isolation on" — two separate configuration
    flags with separate failure modes.
  - Further instances: `-11` ("has its direction recorded **and** is legal for that direction"), `-30`,
    `-25`.
- **Impact.** A `FAIL:<finding-id>` on a fused item does not locate which clause failed — the project
  mistake `verification/finding-location-understates-blast-radius`. It also lets one satisfied clause
  carry rhetorical weight for the other during review.
- **Provenance.** The cold-load proof's defect **5(g)** named `-29`'s fusion exactly: "H10 fuses two
  independent obligations … They fail independently; References lists them separately." `SKILL.md:182-189`
  answers by assertion — "that is not a second obligation but the precondition that makes an assertion
  about the visible surface true" — which is a coherent argument about the *rule*, but does not discharge
  CR-5's constraint on the *item*.
- **Alternative tested.** That `-25`'s three clauses are one artifact ("the recorded contract") and so
  legitimately atomic — accepted; that is why `-25` is listed as a lesser instance and `-29`/`-28` as the
  clear ones.
- **Corrective direction.** Split `-29` and `-28`; reuse the reserved-ID discipline already in force so no
  identifier is renumbered.

---

### RX-06 · Medium · confidence 100 · Performance / Project

**RB-08's approved correction was not discharged, and the staged backlog record asserts that it was.**

- **Expected.** Planning §7 records: "**RB-08 — load cost (deferred).** A deterministically-loaded skill
  has no load-cost evidence and no child owns React performance measurement. **Stated as a known
  limitation; no measurement is attempted.**" The correction ledger routes it accordingly.
- **Observed.** No such limitation exists anywhere in the 14 shipped files.
  `grep -rn -iE "load cost|read cost|cost of loading|token budget|not measured|unmeasured"` over
  `skills/react/*.md` returns only unrelated prose (`ecosystem.md`'s "measured in days", `rendering.md`'s
  "measure or reason about frequency"). Meanwhile the staged backlog
  `1-ideation/staging/backlogs/project/measure-react-skill-deterministic-load-cost.md` states: "The
  finding is recorded as **a stated limitation in the artifact itself**; this backlog entry is the durable
  pointer to the follow-up measurement work."
- **Impact.** Two compounding effects. The skill loads 14 files deterministically with no load-cost
  evidence *and* no acknowledgement that this is unmeasured — a reader has no signal that the cost was
  considered. And a record that Wrap-up will **promote into durable project memory** carries a false
  completion claim, so the next session inherits "already disclosed" when nothing was disclosed. Planning
  §1 is explicit that there is no second net: "each correction now has exactly one carrier — the task
  contract."
- **Root cause.** RB-08 was routed to "§7 (no task)". A correction with no task has no executor and no
  verification clause, so nothing carried it into a file; the backlog was then written from the plan's
  intent rather than from the artifact.
- **Alternative tested.** That the limitation is expressed indirectly — e.g. `SKILL.md:18-21`'s claim that
  the floor carries an ordinary component "without opening anything else". That is a *sufficiency* claim,
  the opposite of a cost disclosure, and it names no cost.
- **Corrective direction.** Add the one-sentence limitation to `SKILL.md`, or correct the backlog's claim
  so the durable record matches the artifact. The two must not disagree.

---

### RX-07 · Medium · confidence 100 · Consistency

**`SKILL.md`'s References register says the First Rule of ARIA Use has four exception conditions; the
source and four other places in this skill say three.**

- **Observed.** `SKILL.md:488-489`: "[Using ARIA] — the First Rule of ARIA Use and its **four** exception
  conditions (H9)." The live source (`w3.org/TR/using-aria/` §2.1, fetched 2026-07-26) lists exactly
  three under "Under what circumstances may this not be possible?". The skill says **three** at
  `SKILL.md:175`, `design.md:113`, `design.md:120`, `design.md:178`, and `checklists.md:419`.
- **Impact.** References is the skill's evidence spine — the register a reader consults to check a rule
  against its source. The one number a careful reader would use to audit `H9` is the wrong one, and it
  points the other way from the rule, so the discrepancy reads as the rule having dropped one.
- **Root cause.** Residue of the repair itself. Commit `52f20f24` "restore H9's third ARIA circumstance"
  corrected the rule body and did not co-touch the citation that describes it — a Principle 9 blast-radius
  miss inside a fix for a Principle 9 blast-radius miss.
- **Corrective direction.** `four` → `three` at `SKILL.md:488`.

---

### RX-08 · Medium · confidence 100 · Consistency

**`ecosystem.md`'s documented re-resolution command does not reproduce the two rows the file exists to
flag.**

- **Observed.** `ecosystem.md:27-28` instructs: "`npm view <package> version` gives the current release,
  and **`npm view <package> time.modified` gives the last publish date**." `time.modified` is the last
  *metadata* modification, which includes deprecations and ownership changes, not necessarily a publish.
  Live registry values (2026-07-26):
  - `recoil` — `time["0.7.7"] = 2023-03-01`, `time.modified = 2024-02-12`. The file states
    "**2023-03-01** … over three years without a publish" (`:98`).
  - `enzyme` — `time["3.11.0"] = 2019-12-20`, `time.modified = 2022-06-17`. The file states "last
    published 2019-12-20, dormant for over six years" (`:133`).
- **Corroborating evidence that two methods were used.** I re-resolved all 36 packages named in the file.
  **34 rows match `time.modified` exactly** — `react-aria-components` (2026-07-25 modified vs 2026-06-18
  published), `@headlessui/react` (2026-04-13 vs 2026-04-07), `vitest`, `@playwright/test`,
  `@tanstack/react-router`, `vite`, `swr`, `jotai`, `styled-components`, `@pandacss/dev`, `electron-vite`
  and others all track `modified`, not the latest version's publish date. The two dormant rows track the
  publish date instead. One method is documented; two were applied.
- **Impact.** The file's stated purpose is that every row is "a starting point to verify, not a fact to
  repeat", and it advertises a thirty-second check. Running that check on `recoil` returns 2024-02-12,
  which contradicts the file's own headline figure by seventeen months. The *verdict* (dormant) survives
  under the file's status rule; the number does not, and the number is what a reader is told to confirm.
- **Alternative tested.** That `time.modified` genuinely is the last publish for well-behaved packages —
  true for the 34, which is precisely why the exception is invisible and why the two rows that break it
  are the two the table was written for.
- **Corrective direction.** Either document both commands and say which column uses which, or restate the
  dormant rows' figures as `time[latest]` and label the column accordingly.

---

### RX-09 · Low · confidence 100 · Structure

**A deferral in `scenarios.md` states a hold condition that was discharged earlier in the same session.**

- **Observed.** `scenarios.md:466-468`: "**Suspense and transition scheduling** — a family on what a
  suspended boundary reveals and what a transition defers. **Held until the child that owns asynchronous
  work exists**, because the floor states no rule this family would exercise." `async.md` was created in
  commit `8d35f33f`, before `scenarios.md` reached its shipped state, and owns exactly that material
  (§4 Suspense activation and reveal, §5 `use`, §6 `useTransition`).
- **Impact.** Low as a defect, real as a signal: the second conjunct (no floor rule to exercise) still
  holds, so the deferral is defensible, but the stated *condition* is now false and a reader checking
  whether it has been met will conclude it has. This is the `docs-sync/mistake-trap-must-not-enforce-a-
  deferred-behavior` shape inverted — a trap whose trigger has already fired.
- **Related.** The brief's self-reported item that `useDeferredValue` appears as scheduling in
  `rendering.md` §8 and as an async primitive nowhere is the same seam; `async.md` §6 points at
  `rendering.md` §8 for scheduling and never claims the primitive.
- **Corrective direction.** Restate the hold on the surviving reason alone.

---

### RX-10 · Low · confidence 75 · Consistency

**`H11` attributes context-value immutability to a page that does not state it.**

- **Observed.** `SKILL.md:201-204`: "NEVER mutate props, state, **context values**, hook arguments or
  return values, or a value already passed to JSX. … Source: react.dev Rules of React." The cited page's
  purity section names exactly three immutability clauses: "Props and state are immutable", "Return values
  and arguments to Hooks are immutable", "Values are immutable after being passed to JSX". Context values
  appear on that page only in the *idempotence* clause ("the same output with respect to their inputs –
  props, state, and context"), which is `H1`'s, not `H11`'s.
- **Impact.** `SKILL.md:98-100` sets the contract: "Every rule below names its evidence in its own text:
  either the primary source that states it, or the explicit label *ecosystem convention*." The rule is
  substantively correct — a context value is some provider's props or state — but the citation over-reaches
  by one term, so a reader auditing `H11` against the named page will not find one of its five objects.
- **Uncertainty (why 75).** The claim may be stated on an adjacent react.dev page not cited by `H11`; I
  checked only the page the rule names, which is the page the skill's own contract makes load-bearing.
- **Corrective direction.** Either derive the context clause explicitly from the props/state clause in the
  rule text, or add the page that states it.

---

### RX-11 · Low · confidence 100 · Consistency

**One quotation of 226 is truncated mid-source-sentence in a way that changes how "an exception" reads.**

- **Observed.** `design.md:102-104` quotes react.dev `Component`'s not-caught list and closes at
  "…returned by the `useTransition` Hook." The source's fourth bullet continues, in the same sentence
  group: "**Errors thrown inside the transition function are caught by error boundaries**."
- **Impact.** `design.md:101` introduces the list as "quoted, because every item is a case where a
  boundary looks like it should help and does not." Truncated there, "an exception is the usage of the
  `startTransition` function" is ambiguous — a reader can take "exception" to mean *also not caught*,
  which inverts it. This is the only one of 226 quotations that does not resolve verbatim end to end; the
  other 225 do, including the four `reducerAction` strings on `useActionState` that a stale model would
  wrongly "correct" to `fn`.
- **Corrective direction.** Restore the closing sentence, or move it outside the quotation as a gloss.

---

### RX-12 · Low · confidence 100 · Consistency

**`H4` omits one of the three named "Rules of keys" on the page it cites.**

- **Observed.** `SKILL.md:122-127` `H4` requires "a key that is a stable identity from the data" and that
  it not be invented during render. The cited page's own "Rules of keys" section states three: "**Keys
  must be unique among siblings.** … Keys must not change … Don't generate them while rendering."
  Uniqueness is absent from the rule text. It is present at `SKILL.md:455-456` (References), at
  `REACT-CHECK-05`'s pass condition ("and is unique among its siblings"), and as
  `REACT-SCENARIO-03`'s cosmetic form ("a display name that repeats").
- **Impact.** Practically contained — the check catches it — but "a stable identity from the data" does
  not entail uniqueness (a `status` field is stable and from the data), so the rule as stated permits what
  its own source forbids and its own check fails.
- **Corrective direction.** Add "unique among its siblings" to `H4`.

---

### RX-13 · Low · confidence 75 · Project

**The plugin manifest version bump sits outside the plan's declared change-set boundary with no recorded
authorization.**

- **Observed.** Planning §6: "The change set is **the `react/` directory plus exactly four registration
  sites** — and nothing else. … A Planning or Execution task proposing an edit to … any fifth registration
  site is **out of contract and must be raised, not absorbed**." Commit `5421faca` ("fix(plugin): restore
  plugin manifest version to 0.5.4") changes `plugins/gobbi/.claude-plugin/plugin.json` and
  `.codex-plugin/plugin.json` from `0.5.3` to `0.5.4`.
- **Mitigating and verified.** `scripts/sync-plugin-package.sh` `topology_fail`s unless the Codex
  manifest, Claude manifest, and `.claude-plugin/marketplace.json` versions are non-empty and equal;
  marketplace already read `0.5.4` on develop. T06's verification clause requires `--check` to exit 0, so
  the in-scope gate was unreachable without this edit. It repairs pre-existing debt rather than
  introducing a new version.
- **Uncertainty (why 75).** I found no decision or note for it under the session's `staging/decisions/`.
  I cannot rule out an unrecorded verbal approval.
- **Corrective direction.** Record the disposition so the change set and the contract agree; this is the
  manager's call, not a defect in the artifact.

---

## 5. What I checked that passed — with the evidence

An empty perspective is suspect, so these are the strengths I verified rather than assumed.

- **Quotation fidelity is exceptional.** All 226 `*"…"*` quotations extracted by script and matched
  against a 2.3 MB corpus built from all 55 cited URLs, markup-normalized. **225 resolve verbatim.**
  Given the brief reported eight fidelity defects across five classes during authoring, and given that my
  own stale expectation about `useActionState`'s parameter name was wrong and the skill was right, the
  re-location discipline demonstrably worked.
- **Registry claims reproduce.** All 36 `ecosystem.md` package rows re-resolved live: 34 exact matches on
  line and date; the compiler's `1.0.0 = 2025-10-07` cross-check holds; `react-router` 8.x, `recoil`
  dormant since 2023-03-01, `enzyme` since 2019-12-20, `react-test-renderer` 19.2 published in lockstep
  yet deprecated — all confirmed. `react.dev/versions` confirms "Latest version: 19.2", so the one pinned
  line is current.
- **Both-way anchor closure holds with no orphans.** All 18 rules, 7 principles, and 8 procedure steps
  reach a scenario family; all 35 `REACT-CHECK-*` are defined, all are cited, all 12 `REACT-SCENARIO-*`
  are defined and cited; every one of the 35 items appears in exactly the perspective Activated lists in
  `evaluation.md` (union = 35/35, scenario union = 12/12).
- **The legend's strongest claim is true.** "Every 'Resolves to' clause below is a live substring of
  `SKILL.md`" — scripted check over all 33 clauses, whitespace-normalized: **33/33**.
- **Every self-reported count reproduces.** 35 items = 20 gates + 15 required; 25 conditional + 10
  unconditional; 48 cells across 12 families (recounted cell by cell); 18 rules each carrying either a
  `Source:` or the `ecosystem convention` label, with `H15` the sole convention rule and labelled as such
  in all four places that touch it.
- **The compiler-switch partition is sound.** `-13` on the enabled branch, `-32`/`-33` on the not-enabled
  branch; I traced the branch logic and the claim "a run that resolves every one of the three `n/a` has
  not resolved `REACT-CHECK-25`" holds.
- **The scenario split threshold is correctly applied.** `scenario/SKILL.md` SR-8 splits a set
  *exceeding* its thresholds; at 12 families against a recorded 12, "a thirteenth family splits it" is the
  right reading, not a violation.
- **Guards are green on fresh runs, not asserted.** `sync-plugin-package.sh --check` exit 0;
  `test-sync-plugin-package.sh` exit 0 (13 reconciliation tests); `check-codex-plugin-smoke.sh` exit 0
  (its 3 warnings are the documented installed-cache limitation CLAUDE.md forbids papering over);
  `check-markdown-links.sh` over the skill: 58 relative paths + 1 anchor, exit 0.
- **Mirrors are real mirrors.** `.claude/skills/react`, `plugins/gobbi/skills/react` and
  `.agents/skills/react` all resolve to the canonical tree; `.claude/` digest is byte-identical to the
  subject digest; `git ls-files -s` shows mode `120000` on all 14 entries — no hand-created mirror.
- **Scope conformance is verified, not claimed.** `git diff` against the merge base shows `coding/`
  untouched (the session's hardest lock), exactly the four registration sites edited, and the P2 router
  complete in both directions (13 rows, 13 sibling files, no dangling row, no unrouted file — SC-6 met
  retroactively).
- **Locked decisions are implemented, and consistently.** `skill-type: operation` after `allowed-tools`;
  the four-file operation artifact set present; Rules split Must-Follow / Must-Not-Follow; `typing.md`
  owned by `react` and pointing per-section into `typescript/typing.md`; compiler-first baseline with the
  not-enabled branch fully written; version pinning confined to React 19.2 + 2025-10-07, with
  `ecosystem.md` the sole product-naming file and every other child stating its no-pins policy; Electron
  folded into `runtime.md` as host deltas; accessibility mechanics in and design judgment out; React
  Native out with no successor named; `rules.md` dropped with zero residual references (grep-confirmed).

## 6. Completed checklist — coverage closure

| # | Check | Result |
|---|---|---|
| C1 | Subject digest recomputed and matched | `PASS` |
| C2 | All cited relative paths resolve | `PASS` — 58 + 1 anchor, exit 0 |
| C3 | Every taught quotation resolves verbatim in its named source | `FAIL:RX-11` — 225/226 |
| C4 | Every rule is no narrower than its own cited source | `FAIL:RX-01`, `FAIL:RX-02`, `FAIL:RX-12` |
| C5 | Every rule carries a primary source or the convention label | `PASS` — 18/18 |
| C6 | `H{n}` / `REACT-CHECK-*` / `REACT-SCENARIO-*` resolve both ways, no orphans | `PASS` |
| C7 | Legend clauses are live `SKILL.md` substrings | `PASS` — 33/33 |
| C8 | No check can pass while the defect it targets ships | `FAIL:RX-01`, `FAIL:RX-03` |
| C9 | Every item is atomic per CR-5 | `FAIL:RX-05` |
| C10 | Every item is resolvable by every declared consumer | `FAIL:RX-04` |
| C11 | Self-reported counts reproduce | `PASS` — items, gates, required, conditional, cells |
| C12 | Volatile claims re-resolve against their live source | `FAIL:RX-08` — 34/36 by the documented method |
| C13 | Change set matches the declared contract | `FAIL:RX-13` |
| C14 | Approved correction obligations discharged in the artifact | `FAIL:RX-06` |
| C15 | Records agree with the artifact they describe | `FAIL:RX-06` |
| C16 | Deferral conditions still hold as written | `FAIL:RX-09` |
| C17 | Runtime mirrors match canonical and are symlinks | `PASS` — digest identical, 14/14 mode 120000 |
| C18 | Topology, fixture, smoke, and link guards green on fresh runs | `PASS` — exit 0 ×4 |
| C19 | Operation-skill artifact set and section shape conform | `PASS` |
| C20 | Locked decisions implemented and internally consistent | `PASS` |
| C21 | P2 router complete in both directions (SC-6) | `PASS` — 13/13, no dangling |
| C22 | Internal cross-references between rule, References, scenario, and check agree | `FAIL:RX-07`, `FAIL:RX-10` |

Coverage is closed: every row holds a terminal token. Coverage closure is not acceptance.

## 7. Perspective results

| Perspective | Findings | Result |
|---|---|---|
| **Project** | RX-06 (Med), RX-13 (Low) | `PASS` with findings — scope conformance is verified and strong; the gap is one undischarged approved obligation |
| **Structure** | RX-05 (Med), RX-09 (Low) | `PASS` with findings — decomposition, ownership lines, and both-way traceability are sound |
| **Performance** | RX-06 (Med) | `PASS` with findings — 14 files load deterministically with no cost evidence and no disclosure |
| **Aesthetics** | none | `PASS` — naming, hierarchy, evidence labelling, and convention fit are consistent throughout; no placeholder, no filler, no unlabelled convention claim found |
| **Usage** | RX-02 (High), RX-04 (High) | `REVISE` |
| **Consistency** | RX-07 (Med), RX-08 (Med), RX-10 (Low), RX-11 (Low), RX-12 (Low) | `PASS` with findings |
| **Risk** | RX-01 (High), RX-03 (High) | `REVISE` |
| **Overall** | see §8 | `REVISE` |

## 8. Overall

**Cross-perspective effect the per-lens passes miss.** RX-01, RX-02, RX-03 and RX-12 are one failure
mode wearing four faces: **the rule layer and the check layer were each derived from a summary of their
source rather than from the source's acceptance sentence.** `H16` from the flags in its own sentence
rather than from the four items it cites. `H9` from the APG's open-focus sentence rather than its
close-focus sentence with its `unless either`. `-31` from P7's bullet list rather than P7's "passes only
when" sentence. `H4` from the intent of keys rather than the page's three named "Rules of keys". The
session already repaired three instances of exactly this (`H8`, `H6`, `H9`-Using-ARIA) and the brief asked
whether any remained. Four do, and one of them — RX-02 — is on the *same rule* that was repaired, from its
*other* source. That is the load-bearing result of this evaluation: the repairs were scoped to the findings
rather than to the pattern, so the pattern survived on every rule nobody happened to look at.

**A second cross-perspective effect.** RX-01, RX-03 and RX-04 interact badly. The register's acceptance
bar is absolute (no waiver, every applicable gate `PASS`), which is a strength — but the same absoluteness
makes an unobtainable gate (RX-04) and a falsely-obtainable gate (RX-01, RX-03) equally invisible in the
final result. A run that reports full coverage closure and acceptance tells the reader nothing about which
of those it survived.

**Karpathy failure modes.** *Mechanism in place of an outcome contract:* `-29` and `-28` fuse clauses so
the mechanism (one tick) stands in for the outcome (two independently provable properties) — RX-05.
*Process-result contradiction:* the backlog says the limitation is in the artifact; it is not — RX-06.
*Cosmetic compliance:* not found, and deliberately hunted — every scenario family carries a "Cosmetic
form", `-24` explicitly rejects "the examples were reviewed", `-16` explicitly rejects local state as
evidence for `n/a`, and `-35` explicitly rejects `-10` passing as evidence for itself. This artifact is
markedly better than average at anticipating its own gaming.
*Unnecessary complexity:* not found. Every one of the ten children states and passes a `skill-writing` P4
split criterion, and `rules.md` was dropped on evidence rather than padded.

**Out-of-scope note, recorded once and clearly separated, per the brief's escape path.** I am not raising
this as a finding. The decision to make the pre-handoff self-check and the evaluator run share a single
evaluation-coverage-register was locked, and RX-04 is a consequence of it rather than a defect in its
execution. If the manager finds RX-04's corrective directions unattractive, the locked decision itself is
the cheaper thing to revisit.

**Must-preserve list — a revision must not undo these.**

1. The **cite-and-review discipline**, which measurably worked: 225/226 verbatim, and correct on a live
   fact (`useActionState`'s `reducerAction`) where a stale reviewer would introduce an error.
2. **`ecosystem.md`'s containment design** — one file for everything that goes stale, a reproducible
   status rule, a per-package resolution date, and an explicit refusal to recommend between active
   entries. Fix RX-08's method sentence; do not touch the architecture.
3. **Both-way anchor closure and the reserved-ID discipline.** Any split done for RX-05 must add
   identifiers, never renumber.
4. The **evidence-class labelling** — every convention claim marked *ecosystem convention* at the point of
   use, `H15` marked in all four places that touch it, and the two genuinely open items (`server-client.md`
   §7's framework split, `runtime.md`'s bridged-API typing) carried as UNVERIFIED rather than guessed.
5. **`SKILL.md`'s exception-ownership rule** ("An exception condition is policy, so it lives here … A rule
   with no stated exception has none"). RX-02 is a failure to *apply* it, not a reason to weaken it — it is
   the rule that makes RX-02 detectable at all.
6. The **register's no-waiver acceptance bar** and its refusal of ownership, labels, and filed follow-ups
   as substitutes for `PASS`.
7. **Scope discipline**: `coding/` untouched, four registration sites exactly, `rules.md` dropped with
   `O-11` discharged by removal and zero dangling references.

**Verdict: `REVISE`.** Four High findings at confidence ≥ 50 (RX-01, RX-02, RX-03 at 100; RX-04 at 75);
no Critical. Derived strictly from the thresholds declared in §2 before the evidence was scored.

This is a strong artifact with a specific, repeating, and repairable defect class. The four High findings
are all narrow, located, and cheap to fix; none requires rework of the design.

## 9. Limitations and what I could not verify

- **I could not run the register against a real React change-set.** RX-04's frequency is therefore
  reasoned from the named evidence methods, not measured — hence confidence 75.
- **I did not verify claims against pages the skill does not cite.** RX-10 is scoped to the page `H11`
  names, which is what the skill's own evidence contract makes load-bearing.
- **I could not confirm the absence of a verbal authorization** for the plugin version bump (RX-13); I
  confirmed only that no decision record exists under the session's staging.
- **The `.codex-plugin` installed-cache warnings** are pre-existing and out of this subject's scope; I ran
  the smoke script and report its exit 0 rather than adjudicating the warnings.
- **Load cost was not measured.** I report its non-disclosure (RX-06), not its magnitude; measuring it is
  the already-staged backlog's job.
- **Process context I weighed but did not re-litigate:** Ideation ended REVISE and Planning was never
  evaluated, both by user decision. This evaluation is the only end-to-end independent review, which is
  why I ran complete rather than sampled coverage on quotations, rules, registry rows, and anchors.

## 10. Reopen conditions

Rebind and re-run every applicable perspective if any subject file changes. Specifically: any edit to
`H9`, `H16`, `H4`, `REACT-CHECK-18`, `-28`, `-31`, `-29`, or `checklists.md`'s Legend/evidence-floor block
invalidates §6 rows C3, C4, C8, C9, C10 and both `REVISE` perspectives.
