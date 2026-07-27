---
name: electron-skill-iteration-1-risk
description: Adversarial risk and usage review of the Electron skill design, verdict revise
type: reviews
scope: project
feature: null
status: active
created: 2026-07-26
session: 473fe9ec-3726-40c6-abcf-662d09de9e6f
tags: [evaluation, security]
keywords: [electron, ideation, risk]
author: claude
review_kind: adversarial-review
subject: 1-ideation/outputs/ideation.md
verdict: revise
---

# Ideation evaluation — `electron` skill design (Claude, Risk/Usage emphasis)

**Subject.** `1-ideation/outputs/ideation.md`, 707 lines, iteration 1, dated 2026-07-25.
**Evidence base also evaluated.** `1-ideation/working/iteration-1/research-evidence.md`, 274 lines.
**Evaluator.** Fresh Claude evaluator. Did not design, author, or contribute to either file. Read no other
evaluator's output. All eight perspectives walked; effort weighted to Risk and Usage per the brief.
**Worktree.** `claude-2026-07-25-473fe9ec-3726-40c6-abcf-662d09de9e6f` only. The main checkout was never read.
**Evaluated 2026-07-25.**

## Verdict rules declared before results

Fixed from the delegating contract before any finding was recorded:

- `FAIL` — any Critical finding at confidence >= 75.
- `REVISE` — any High finding at confidence >= 50.
- `PASS` — otherwise.

Confidence anchors: `100` tool-verified or primary-source-quoted; `75` close reading plus citation; `50`
supported inference with a tested alternative; `25` hypothesis with named missing evidence.

## Methods and evidence sources

| Method | Applied to |
|---|---|
| Close reading | The full artifact and the full evidence file |
| Source read | `examples/typescript/extract-blocks.mjs` (168 lines), `examples/typescript/run-examples.sh` (83 lines) |
| Live repository counts | skill directories, `electron` grep, `python`/`typescript` line counts, all seven enumeration sites, `web`/`coding` staleness sweeps |
| Governing-doc read | `principles`, `evaluation`, `mistake`, `planning`, `skill-writing` SKILL.md + P7, `rules/docs/point-dont-restate-workflow-docs.md`, `mistakes/verification/verify-dont-assert-taught-facts.md`, `mistakes/assumption/verify-rule-scope-before-citing.md` |
| Primary-source network fetch | `registry.npmjs.org` dist-tags, `releases.electronjs.org/releases.json`, `releases.electronjs.org/schedule.json`, `raw.githubusercontent.com/electron/electron/v43.2.0/docs/{tutorial/security.md,breaking-changes.md,api/browser-view.md,api/base-window.md,api/notification.md}` |

**Limitation stated up front.** I did not install the Electron harness dependencies, so A-3 remains unsettled
by me as well as by the author. I did not attempt to run `npx @electron/fuses read --app` (no packaged
artifact exists), so EL-R-12's verification command is unproven by either party — see M-12.

**Known caveat, weighted not rediscovered.** The Codex waiver and the un-reviewed EV § 7 tier are disclosed
by the artifact and are not re-reported as findings. Where a design decision leans on that tier beyond what
it can bear, the finding is written against the decision, not the caveat (H-1, M-8).

---

# Part 1 — Electron fact spot-checks against primary sources

Every version-sensitive Electron claim I could reach a primary source for was re-verified independently of
the evidence file. **Zero core Electron facts were refuted.** The core-research tier is strong.

| # | Claim (artifact / EV) | Primary source | Result |
|---|---|---|---|
| 1 | Current stable is **43.2.0** | `registry.npmjs.org/-/package/electron/dist-tags` -> `"latest":"43.2.0"`; `alpha` is `44.0.0-alpha.6`; nightlies are `45.0.0-nightly.*` | **HOLDS** |
| 2 | `nodeIntegration` default `false` **since 5.0.0** | `docs/tutorial/security.md@v43.2.0:161` — "This recommendation is the default behavior in Electron since 5.0.0." | **HOLDS** |
| 3 | `contextIsolation` default `true` **since 12.0.0** | same file, line 226 | **HOLDS** |
| 4 | `sandbox` default `true` **since 20** | same file, line 252 — "since 20.0.0" | **HOLDS** |
| 5 | `event.senderFrame` **nullable since 33**, must be read before the first `await` | `docs/breaking-changes.md@v43.2.0:565-585`, under `## Planned Breaking API Changes (33.0)`. Carries the exact `// ✅ accessed immediately` / `// ❌ returns null due to late access` sample | **HOLDS** |
| 6 | The vendor's own checklist-item-17 sample does **not** null-check `senderFrame` | `security.md@v43.2.0:769-775` — `if (!validateSender(e.senderFrame)) return null` then `new URL(frame.url)` inside `validateSender`. A null frame throws | **HOLDS** |
| 7 | Wholesale `ipcRenderer` over `contextBridge` yields an **empty object since 29**, called a "security footgun" | `breaking-changes.md` under `(29.0)` — "will now result in an empty object on the receiving side… to remove / mitigate a security footgun" | **HOLDS** |
| 8 | The security checklist is **20 items**, and the nine code-only ones are #5, #12, #13, #14, #15, #17, #18, #19, #20 | `security.md@v43.2.0` has exactly 20 `### N.` headings; all nine numbers map to the named subjects | **HOLDS** |
| 9 | `startsWith` origin comparison is unsafe; use `new URL(u).origin` | `security.md:622` (the `example.com.attacker.com` warning) and `:634` (`parsedUrl.origin !== …`) | **HOLDS** |
| 10 | `setWindowOpenHandler` defaults to `{ action: 'deny' }` | `security.md:683` | **HOLDS** |
| 11 | `BrowserWindow` is **not** deprecated; `BaseWindow` needs manual child cleanup | `api/base-window.md@v43.2.0:10` and `:89` ("Unlike with a `BrowserWindow`, if you don't explicitly close the…") | **HOLDS** |
| 12 | macOS notifications need code signing **since 42** (`UNNotification`) | `breaking-changes.md:126-135` under `(42.0)`; `api/notification.md:12-14` | **HOLDS**, with one qualifier — see L-1 |
| 13 | **44.0.0 lands 2026-08-25**, Chromium 152 | `releases.electronjs.org/schedule.json` — `{"version":"44.0.0", "stableDate":"2026-08-25", "chromiumVersion":152}` | **HOLDS** |
| 14 | 8-week major cadence | schedule.json stable dates: 42 -> 2026-05-05, 43 -> 2026-06-30, 44 -> 2026-08-25, 45 -> 2026-10-20. Exactly 56 days apart | **HOLDS** |
| 15 | EOL: 43 -> 2027-01-05, 42 -> 2026-10-20 | schedule.json `eolDate` fields | **HOLDS** |

**Two results that go beyond confirmation:**

- **EV § 10's `BrowserView` deprecation discrepancy is resolvable and I resolved it.** `breaking-changes.md@v43.2.0`
  files `### Deprecated: BrowserView` at line 765 under `## Planned Breaking API Changes (30.0)`.
  `api/browser-view.md@v43.2.0`'s YAML history block carries only a PR URL and
  `breaking-changes-header: deprecated-browserview` — **no version number at all**, so the "29.0.0" half of
  the reported discrepancy is not corroborated by the v43.2.0 tree. The answer is **30**. One `curl` settled
  a gap the artifact carries forward into a rule-violating table row. See **M-5**.
- **The 33.0 breaking change the artifact quotes has a second half the artifact never carries.** Its heading
  is "Behavior Changed: frame properties may retrieve **detached** `WebFrameMain` instances **or none at
  all**." Nullability is one of two documented outcomes. See **H-3**.

---

# Part 2 — Finding ledger

Severity: `Critical` / `High` / `Medium` / `Low`. Every finding states expected, observed, why it matters,
the cause or leading hypothesis, the evidence I inspected, the alternative explanation I tested, and a
corrective direction. Corrections are directions only — I applied nothing.

## HIGH

### H-1 — Nothing in the design obliges the skill's own examples to be run through the harness

- **Severity** High · **Confidence** 100 · **Perspective** Risk, Usage · **Type** design_flaw
- **Location** § 11 (EL-OB-01..16, lines 624-641); § 4.5 item 4 (line 280); § 8.4 (lines 557-566); § 1.5.
- **Expected.** The harness exists so every taught Electron example is proven to compile. The design should
  carry an obligation of the form "every fenced `ts` block in `skills/electron/**` was extracted and
  type-checked by `examples/electron/run-examples.sh`, exit 0."
- **Observed.** The sixteen design obligations test the **harness**, never the **docs**. EL-OB-07 counts tsc
  invocations. EL-OB-08 proves a fixture fails. EL-OB-09 proves an untagged fence errors. EL-OB-10 proves the
  marker guard fires. § 4.5's fourth requirement is "**Declare** the process of every fenced example" —
  declaring, not compiling. § 1.5's success signal about the two-pass check is about a *fresh agent's app*,
  not the skill's own text.
- **Why it matters.** Three verified facts compose into a live false-assurance path. (a) § 8.4 records that
  `examples/typescript/node_modules` is **absent in this checkout**, so the precedent harness "is not
  runnable today without an install" — I confirmed `run-examples.sh:37-41` hard-fails on a missing local
  `tsc`. (b) § 8.4 decides the skill will **not name the harness path**, following `typescript`'s precedent —
  I confirmed with `grep -rn "run-examples\|examples/typescript" skills/typescript/` returning **zero
  matches**. (c) There is no obligation that anyone ever points the harness at the skill. So the skill can
  ship 13 files of fenced examples, state the `typescript`-style property "the harness proves it", pass every
  one of EL-OB-01..16, and have had **zero blocks extracted**. The harness becomes a self-testing artifact
  that never tests the thing it exists for.
- **Cause.** The obligation set was derived from § 8 (harness design) rather than from § 1.4 (the outcome).
  The design proves the instrument and never closes the loop back onto the subject.
- **Alternative tested.** Could `skill-writing` P7 cover it? I read P7 (`skill-writing/SKILL.md:199-245`). P7
  requires structural guards, mirror resolution, runtime cold-load, and a `cold-load-result` record — it
  requires no example compilation. It does not cover this.
- **Direction.** Add a design obligation that the harness is run over the skill directory with a recorded
  non-zero-block count, and decide who owns running it (Execution task gate, or a repository script).

### H-2 — EL-R-09 requires a `senderFrame` null-check but never states the safe branch

- **Severity** High · **Confidence** 100 · **Perspective** Risk · **Type** design_flaw
- **Location** § 5.1 EL-R-09 (lines 315-320); § 4.3 `ipc.md` row (line 256).
- **Expected.** A security rule at a trust boundary states the fail-safe action, the way EL-R-06 does:
  "MUST default `setWindowOpenHandler` to `{ action: 'deny' }`."
- **Observed.** EL-R-09 says "read `event.senderFrame` synchronously before the first `await`,
  **null-checked**." Its check is "any `senderFrame` read precedes every `await` in its handler." Neither the
  rule nor the check nor `ipc.md`'s content obligation ("the `event.senderFrame` nullable-since-33 +
  read-synchronously-before-`await` rule") says **what to do when it is null**.
- **Why it matters.** The primary source makes the safe branch unambiguous, and the unsafe branch plausible.
  `breaking-changes.md@v43.2.0` (33.0): "Electron will return `null` in the case of late access **where the
  webpage has changed**." Null therefore means *the sender is not the frame you think it is*. The only safe
  response is to reject the message. A rule that says only "null-checked" is satisfied equally by
  `if (!e.senderFrame) return null` (safe) and by `if (e.senderFrame && !validateSender(e.senderFrame))
  return null` (**fails open** — a null frame skips validation entirely and the handler proceeds). The second
  form passes EL-R-09's stated check verbatim. This is the artifact's own marquee footgun (§ 1.2, fourth
  bullet), so the rule that addresses it carries the most weight of any rule in the set. Confidently
  incomplete security guidance at a trust boundary is worse than none.
- **Cause.** EV § 4 item 5 describes the *symptom* ("throws on current Electron") rather than the *security
  property*, and the rule was written to the symptom. Fixing the throw is not the same as failing safe.
- **Alternative tested.** Does the vendor sample imply the safe branch? `security.md:769` is
  `if (!validateSender(e.senderFrame)) return null` — but `validateSender` immediately dereferences
  `frame.url`, so the vendor sample throws rather than denies. The vendor does not supply the safe form; the
  skill must.
- **Direction.** State the deny branch in the rule text and make the check assert it, e.g. "a null or
  unvalidated `senderFrame` returns without performing the action."

### H-3 — `WebFrameMain.detached` is absent from the artifact and from the evidence

- **Severity** High · **Confidence** 100 · **Perspective** Risk · **Type** scenario_gap
- **Location** § 1.2 bullet 4; § 5.1 EL-R-09; § 4.3 `ipc.md` row; § 7 `ipc.md` row; EV § 4 item 5.
- **Expected.** The child that owns sender validation teaches the full documented behavior of the object it
  validates.
- **Observed.** `grep -in "detach"` over both the artifact and the evidence file returns **zero matches** in
  each. Both teach only the nullability half.
- **Why it matters.** The same v43.2.0 breaking change the artifact relies on is titled "Behavior Changed:
  frame properties may retrieve **detached** `WebFrameMain` instances **or none at all**", and its body
  states: "APIs which provide access to a `WebFrameMain` instance may return an instance with
  `frame.detached` set to `true`, **or possibly return `null`**… In the event of an IPC sent during this
  state, `frame.detached` will be set to `true` with the frame being destroyed shortly thereafter." A
  detached frame is **non-null**, so it survives EL-R-09's null-check, and its `.url` still reads as the
  pre-navigation origin — so it also **passes the origin allowlist**. The taught rule certifies exactly the
  case the vendor added the flag to expose. This is a second fail-open on the same rule, from the same
  paragraph of the same source the artifact already cites.
- **Cause.** EV § 4 compressed the breaking change to its most quotable clause and the artifact inherited the
  compression without re-reading the source. This is precisely the pattern
  `mistakes/verification/verify-dont-assert-taught-facts.md` records: verifying the headline mechanism while
  asserting the fine-grained detail.
- **Alternative tested.** Is `detached` out of the supported window or since-superseded? No — the section
  appears in `breaking-changes.md@v43.2.0` under (33.0), inside the 43/42/41 window, and `api/web-frame-main.md`
  carries the property.
- **Direction.** Re-read `breaking-changes.md@v43.2.0:559-585` in full and carry both outcomes into `ipc.md`,
  EL-R-09, and `migration.md`'s "nullable since 33" row.

### H-4 — § 7 states the rotation costs "exactly two places"; § 7's own table and A-4 say eight

- **Severity** High · **Confidence** 100 · **Perspective** Risk, Consistency · **Type** design_flaw
- **Location** § 7 point 3 (lines 436-438) versus § 7's "Files carrying version-sensitive facts" table
  (lines 446-457) and A-4 (line 608).
- **Expected.** The rotation procedure states the true cost, since § 1.7 rests the entire "reject doing
  nothing" argument on the decay being "explicit and bounded".
- **Observed.** Point 3: "Rotating the window means editing exactly **two** places: the `SKILL.md` block and
  the `migration.md` table." Fourteen lines later the same section tabulates **eight** files as "the complete
  set a rotation must re-read". A-4 independently requires "Re-read `docs/tutorial/security.md` at each
  rotation."
- **Why it matters.** The two-places claim is only true for facts written as historical qualifiers ("removed
  in 14", "since 29"). It is **false for the whole class of doc-state and absence claims** the skill leans on
  most heavily, none of which can carry a "since N" and all of which need re-verification each rotation:
  "`BrowserWindow` is NOT deprecated"; "the checklist stays 20 items"; "`security-warnings.ts` covers only
  items 1, 2, 6, 7, 8, 9, 10, 11"; "the official item-17 sample does not null-check"; "React Router docs do
  not mention `file://` or Electron"; "no official V8 snapshot tutorial page exists"; "no page declares Forge
  recommended over electron-builder". EL-R-14 cannot police these, because EL-R-14 only requires a qualifier
  on claims that *are* written — it has no purchase on a stamped negative that quietly stopped being true. A
  rotation performed to the stated two-place procedure leaves six files unre-verified. **This understates the
  maintenance cost of the artifact's single largest identified risk by roughly fourfold**, which is how the
  decay the design promises to bound actually escapes.
- **Cause.** Point 3 was written about the *version number* surface; the table was written about the
  *version-sensitive fact* surface. Two different scopes, one section, no reconciliation.
- **Alternative tested.** Is point 3 narrowly about "the window" only, making it technically true? Its
  sentence subject is "Rotating the window", and rotating the window is the whole rotation event the section
  defines. There is no narrower reading available to a cold reader.
- **Direction.** Replace point 3 with the table's real scope, and add a distinct marker class for doc-state /
  absence claims (verified-against-doc-at-vN) that a rotation must re-check rather than carry.

### H-5 — `migration.md` has no coverage boundary and no freshness stamp, so absence reads as safety

- **Severity** High · **Confidence** 100 · **Perspective** Risk · **Type** design_flaw
- **Location** § 4.3 `migration.md` row (line 262); § 6 router row (line 411); § 7 point 3 and point 4.
- **Expected.** A lookup index whose answers are consumed as authority states what it covers and when it was
  last verified, so a miss is distinguishable from a clean bill of health.
- **Observed.** `migration.md` is defined as "One table, the single home for every removal and rename" and
  "a lookup index, not a tutorial". The § 6 router sends an agent there for "an API that may have been
  removed or renamed". Nothing in § 4.3, § 7, or § 11 requires the table to state a coverage ceiling ("this
  table covers removals through Electron 44; check `breaking-changes.md` for anything later") or a
  last-verified date. § 7 point 4 stamps "verified against X on 2026-07-25" only on **ecosystem** versions in
  References — not on the migration table.
- **Why it matters.** This is the failure mode of every stale index: the agent queries the API, finds no row,
  and reads **absence of a row as evidence of absence of a removal**. A stale table does not return "I don't
  know" — it returns a confident, wrong "still fine". Because § 4.3 designates this the *single* home for
  every removal, no second surface can catch the miss. Every other version defence in the design (EL-R-14,
  the qualifier discipline, the version block) protects claims that were written; none protects the reader
  from a claim that was never added. The 8-week cadence guarantees new rows are owed every 8 weeks
  indefinitely, and the artifact assumes a rotation actually happens (§ 7 point 5 asserts "The rotation is a
  checkable obligation, not a hope" — but the only thing EL-R-14 makes checkable is qualifier presence on
  existing text, not table completeness).
- **Cause.** The design treats staleness as a property of individual claims (solved by qualifiers) and never
  as a property of an index's completeness.
- **Alternative tested.** Does EL-R-14 cover it? EL-R-14's check is "no bare 'currently', 'the latest
  version', or unqualified behavior claim survives review" — a check on written text. A missing row has no
  text to fail the check.
- **Direction.** Require `migration.md` to open with an explicit coverage ceiling and a last-verified stamp,
  and to instruct the reader to consult `breaking-changes.md` for majors above the ceiling.

### H-6 — EL-R-04's check is a file-existence proxy for the nine security obligations

- **Severity** High · **Confidence** 100 · **Perspective** Risk, Usage · **Type** design_flaw
- **Location** § 5.1 EL-R-04 (lines 302-304); R-2's mitigation (line 614); EL-OB-11 (line 636).
- **Expected.** A check for a semantic security obligation fails a cosmetically-conformant but wrong result.
- **Observed.** EL-R-04's check is: "each of the nine resolves to a **named module**; none is absent." R-2's
  mitigation is "`checklists.md` must have a **binary check per item**, so a list-only treatment fails a
  gate", and EL-OB-11's check is "**Count** `EL-CHECK-*` items mapping to items #5, #12, …".
- **Why it matters.** A `navigation.ts` that allowlists everything, a `permissions.ts` that returns `true`
  unconditionally, and a `window-open.ts` that defaults to `allow` all satisfy "resolves to a named module".
  The check proves nine files exist; the obligation is that nine guards are correct. Two governing documents
  forbid exactly this substitution: `evaluation/SKILL.md` § Must-Not-Follow — "**NEVER infer a pass from
  missing or proxy evidence. File existence**, a green summary, a creator's claim, or an expected result does
  not prove the underlying property"; and `planning/SKILL.md` § Must not follow — "Do not use a test, link
  check, or **file-existence proxy for a semantic obligation it cannot prove**." The compounding problem is
  that R-2 names this exact risk ("the skill teaches *that they exist* rather than *how to write them*") and
  routes its mitigation through EL-OB-11, which is itself a **count** of checks — so the mitigation inherits
  the proxy it was meant to defeat. Nine `EL-CHECK-*` items each reading "does a permission handler exist"
  satisfy EL-OB-11 completely.
- **Cause.** Existence is trivially greppable and correctness is not; the check was written to what tooling
  can assert rather than to what the obligation requires.
- **Alternative tested.** Could `scenarios.md` carry the semantic teeth instead? § 4.4 requires "At least one
  case must fail a cosmetically-conformant but non-working run — the natural candidate is the
  combined-tsconfig false-pass and the wholesale-`ipcRenderer` silent empty object." Both named candidates
  are harness/IPC cases. **No scenario obligation covers the nine security items**, so the gap is not closed
  downstream.
- **Direction.** Restate EL-R-04's check and EL-OB-11 as per-item behavioral assertions (a denied-by-default
  branch exists and is reachable; the allowlist is a closed set; the permission **pair** is both registered),
  and add a scenario whose seeded defect is a present-but-permissive guard.

### H-7 — The copied extractor's prelude/partial linkage is process-blind, with a shared default bucket

- **Severity** High · **Confidence** 100 · **Perspective** Structure, Risk · **Type** design_flaw
- **Location** § 8.3 "The scheme" (lines 518-531); § 8.4 (lines 535-550). Source evidence:
  `examples/typescript/extract-blocks.mjs:100-107`, `:120-126`, `:136-152`, `:156-158`, and the header
  comment at `:23-24`.
- **Expected.** Adding a process axis to a harness whose whole purpose is process separation covers every
  path by which source text reaches a compilation unit.
- **Observed.** § 8.3 adds `PROCESS_WORDS` to the **block** parse and routes units to `units/main|preload|renderer/`.
  It says nothing about the prelude/partial mechanism, which I read in full:
  - `:100-105` — `key` is initialised to `""` and set only by a `key=` token.
  - `:23-24` header — "`key=` **may be omitted — the empty key is the shared default**."
  - `:120-126` — `preludesByKey` is one **global** map, built with no notion of process.
  - `:138-147` — a partial is emitted as `preludes.join("\n") + partial.source`, matched **only** by key.
  - `:156-158` — an orphan prelude is emitted standalone with category `"prelude"` and **no process at all**.
- **Why it matters.** Two concrete silent-failure paths survive the proposed scheme.
  (a) A ` ```ts renderer prelude ` block and a ` ```ts main partial ` block that both omit `key=` share the
  `""` bucket, so the renderer prelude is **concatenated into the main unit** and written to `units/main/`.
  If the prelude is process-neutral it compiles clean and the contamination is invisible; if it is not, the
  failure surfaces in a file whose text the author never wrote there, and the natural fix is to weaken the
  main config. Either way the harness has just done the cross-process mixing it exists to forbid — inside its
  own machinery. (b) An orphan prelude has **no process directory to go to**, and § 8.3's own hard rule ("a
  `ts` block with no process word is a hard error") would make every prelude require a process tag while the
  linkage that consumes it ignores the tag entirely.
- **Cause.** § 8.3 was written from a read of the *block-parsing* loop (lines 96-107, which it cites
  precisely and correctly) and did not extend to the *unit-emission* half of the same file.
- **Alternative tested.** Could the runner catch it? No — the runner receives directories of finished units
  and cannot see which markdown block or prelude produced them. `run-examples.sh:61` also uses
  `find … -maxdepth 1`, which finds nothing under per-process subdirectories; that specific line is being
  replaced by the multi-pass runner, but it confirms the runner has no per-block provenance.
- **Direction.** Decide the linkage semantics explicitly — key preludes by `(process, key)`, forbid keyless
  preludes/partials in the copy, or drop prelude/partial support from the Electron extractor — and record the
  decision as a delta in § 8.3.

## MEDIUM

### M-1 — "the two deltas" undercounts § 8.3, which specifies four extractor changes

- **Severity** Medium · **Confidence** 100 · **Perspective** Consistency, Usage · **Type** general
- **Location** § 8.4 line 538 comment ("copied from `examples/typescript/`, with the **two deltas** in § 8.3")
  versus § 8.3's four bullets (lines 520-531); repeated in § 8.4's rationale paragraph, "a header comment in
  the copy naming its origin file and **its two deltas**".
- **Observed.** § 8.3 specifies four changes: (1) a `PROCESS_WORDS` set parsed orthogonally; (2) untagged
  `ts` is a hard error; (3) per-process output directories; (4) a `tsx` marker guard. The nearby "two
  further verified traps" paragraph is about traps, and the second trap (`:131` `.ts` extension) is explicitly
  a **no-change**.
- **Why it matters.** A fresh executor implementing "the two deltas" plausibly ships the process vocabulary
  and the hard error while dropping per-process directories or the `tsx` guard. Dropping either voids
  EL-OB-08 or EL-OB-10. The number is also carried into a required source artifact (the header comment), so
  the wrong count gets written into the code.
- **Direction.** State the count as four and enumerate them where the header comment is specified.

### M-2 — § 9 site 6 and § 2.4 misstate where "future" appears in `coding/review.md`

- **Severity** Medium · **Confidence** 100 · **Perspective** Consistency, Project · **Type** general
- **Location** § 9 row 6 (line 581); § 2.4 last row (line 188).
- **Observed.** I ran `grep -n "future" coding/*.md`. Within `coding/review.md`, "future `python` and
  `typescript` skills" appears at **line 472 only**. Line 470 is the section heading "## Scope —
  language-agnostic, illustrated in Python and TypeScript" (no "future"). Line 474 reads "…the Python and
  TypeScript **columns are examples to reason by, not gates**" — no "future", and it is about the very
  illustration columns the artifact instructs *not* to touch. § 2.4 asserts "Only the word 'future' at
  `coding/review.md:470/472/474` is stale," which is wrong for two of the three cited lines.
- **Why it matters.** The § 9 instruction "Add `electron`, drop 'future'" applied to line 474 would either
  be a no-op the executor cannot perform (there is no "future" to drop) or would push them to add `electron`
  to a sentence about per-language columns — the exact edit § 9's own note forbids. § 9 already warns that
  line numbers are a snapshot, but this is a **content** error, not a line-number drift.
- **Direction.** Re-derive the row from a content grep; line 470 needs only the heading decision (if any) and
  line 474 likely needs no edit.

### M-3 — The "future React skill" staleness is five live references across three files, not one

- **Severity** Medium · **Confidence** 100 · **Perspective** Project, Usage · **Type** assumption_risk
- **Location** § 9 "Adjacent staleness surfaced, not acted on" (lines 588-590); OQ-5 (lines 681-685); § 2.4.
- **Observed.** The artifact reports one site: "`skills/web/SKILL.md` (intro, ~line 19)". I ran
  `grep -rn -i "future.*react\|react skill" web/`:
  - `web/SKILL.md:18` — "The future React skill will own React APIs and ecosystem policy"
  - `web/SKILL.md:107` — "router/state libraries, and ecosystem conventions belong to the future React skill"
  - `web/ux/SKILL.md:21` — same sentence
  - `web/ux/SKILL.md:201` — "the future React skill owns React and ecosystem policy"
  - `web/ui/SKILL.md:195` — "the future React skill owns React policy"
  (Also: the cited sentence is at line 18, not 19; line 19 is the following clause.)
- **Why it matters.** OQ-5 asks the **user** to decide the disposition of this staleness, and presents it as
  a single sentence in one file. The user is being asked to decide on a surface five times larger than
  described, spanning three files, two of which (`web/ui`, `web/ux`) are the exact owners § 2.3 routes
  `electron` readers to for browser-surface work. Under D2 those five references promise a skill that will
  not exist, and the `electron` skill will actively send readers into them. Principle 9's blast-radius pass
  over the affected set is what would have found this. The item stays deferred either way, but a user
  decision made on a 1-of-5 picture is not an informed one.
- **Alternative tested.** Is the artifact only obliged to name what it touches? No — § 9's stated purpose is
  surfacing under Principle 5, and it names a specific file and line as the extent of the issue.
- **Direction.** Correct the surfaced inventory to all five references before OQ-5 reaches the user.

### M-4 — EL-OB-03 cites a project rule outside its own declared scope, repeating a recorded mistake

- **Severity** Medium · **Confidence** 100 · **Perspective** Consistency, Project · **Type** general
- **Location** § 11 EL-OB-03, Source column (line 628): "§ 4.5; project rule `point-dont-restate-workflow-docs`".
- **Observed.** I read the rule. `rules/docs/point-dont-restate-workflow-docs.md:20` scopes it to
  "`workflow/steps/*.md`", and its **§ When NOT to apply** states: "**Outside `workflow/steps/*.md` — the
  rule governs the workflow step-doc surface only**; other surfaces follow their own authoring conventions."
  `skills/electron/*.md` is not a workflow step doc.
- **Why it matters.** This is a verbatim repeat of a promoted project mistake. `mistakes/assumption/verify-rule-scope-before-citing.md`
  records that in the `python`-skill session, "the manager's delegation and evaluation briefs cited
  `rules/docs/point-dont-restate-workflow-docs.md` as the governing rule… That rule is explicitly scoped to
  `workflow/steps/*.md` and does not govern skill child docs… **Both the Claude and Codex evaluators flagged
  the mis-citation.**" The same rule, mis-cited for the same class of document, one skill later. Consequence:
  EL-OB-03 will be copied into Planning task briefs as a governing authority, propagating a citation an
  executor cannot satisfy from the rule's own text.
- **Mitigating.** As that mistake file itself notes, the underlying discipline is independently covered —
  `skill-writing`'s one-owner-per-fact rule genuinely governs here — so the substance of EL-OB-03 is sound.
  The defect is the authority, not the obligation.
- **Direction.** Re-source EL-OB-03 to `skill-writing`'s one-owner-per-fact discipline plus § 4.5.

### M-5 — `migration.md`'s `BrowserView` row cannot satisfy EL-R-14, and the blocking gap was cheaply closable

- **Severity** Medium · **Confidence** 100 · **Perspective** Risk, Consistency · **Type** assumption_risk
- **Location** § 4.3 `migration.md` row and `windows-native.md` row; § 7 file table row for
  `windows-native.md`; § 13 last row; EV § 10.
- **Observed.** EL-R-14 is a Must-Follow: "MUST state the Electron major each version-sensitive claim was
  verified against." Every `migration.md` entry carries one — "removed in 14", "removed in 28", "since 29",
  "since 33" — **except** "`BrowserView` deprecated -> `WebContentsView`", which carries none, because EV § 10
  parks the major as an unresolved discrepancy (API page 29.0.0 vs breaking-changes §30.0). So the design
  ships a rule and, in the same document, a table row that structurally violates it, with no OQ and no note.
- **What I found in one fetch.** `breaking-changes.md@v43.2.0:765` — `### Deprecated: BrowserView` — sits
  under `## Planned Breaking API Changes (30.0)`. `api/browser-view.md@v43.2.0`'s YAML history block contains
  only `pr-url` and `breaking-changes-header: deprecated-browserview` and **no version**, so the "29.0.0"
  side of the discrepancy is not corroborated in the v43.2.0 tree. The answer is 30.
- **Why it matters.** `mistakes/verification/verify-dont-assert-taught-facts.md` requires reading the source
  of truth rather than carrying an inference. Here a gap that one `curl` resolves was carried into the design
  and hardened into a table row that the design's own hard rule forbids. It is a small instance of the same
  pattern as H-3 and points at the same root: EV § 10's "unconfirmed" list was accepted as final rather than
  triaged for cheap closure.
- **Direction.** Close the row at 30 with the breaking-changes citation, and triage the rest of EV § 10 for
  items resolvable at similar cost before Planning.

### M-6 — `security.md`'s two-bucket partition leaves checklist item 16 unhomed

- **Severity** Medium · **Confidence** 75 · **Perspective** Structure · **Type** design_flaw
- **Location** § 4.3 `security.md` row (line 255): "the full 20 items, explicitly partitioned: the
  `webPreferences` flags that are already correct by default … **vs** the nine code-only items".
- **Observed.** I listed the real headings of `security.md@v43.2.0`. Of the 20: eight are covered by
  `security-warnings.ts` per EV § 3 (1, 2, 6, 7, 8, 9, 10, 11); nine are the named code-only items; items 3
  and 4 are the context-isolation and sandbox defaults. That leaves **item 16, "Use a current version of
  Electron"** — not a `webPreferences` flag, not one of the nine, not a warning.
- **Why it matters.** A partition is the child's central organizing device, and a partition with an unhomed
  member is a defect an executor will discover mid-write and resolve by improvisation. The specific orphan is
  the worst possible one: item 16 is the *version-currency* item, the single checklist entry that ties
  directly to § 7 and to the artifact's own § 1.7 steelman. It should be the easiest item to place.
- **Alternative tested.** Could item 16 be read as a code-only item and simply be missing from the nine? EV
  § 3 fixes the nine at exactly #5, #12, #13, #14, #15, #17, #18, #19, #20, and I confirmed those numbers
  against the live headings. The nine are not a superset.
- **Direction.** Make the partition three-way (default-correct / code-you-must-write / process-and-upkeep) or
  explicitly route item 16 to § 7 and say so.

### M-7 — EL-R-03 names four `webPreferences` flags where its own evidence lists twelve

- **Severity** Medium · **Confidence** 75 · **Perspective** Risk · **Type** design_flaw
- **Location** § 5.1 EL-R-03 (lines 298-300) against EV § 2's defaults table (lines 42-48).
- **Observed.** EL-R-03 covers `nodeIntegration`, `contextIsolation`, `sandbox`, `webSecurity`. EV § 2's own
  table adds eight more false-by-default options: `nodeIntegrationInWorker`, `nodeIntegrationInSubFrames`,
  `webviewTag`, `allowRunningInsecureContent`, `experimentalFeatures`, `safeDialogs`, `navigateOnDragDrop`,
  `plugins`. EL-R-03's check is "grep every `BrowserWindow` / `BaseWindow` construction site **for an
  override**" without naming the option set.
- **Why it matters.** § 4.2 makes `SKILL.md` the cold-load floor that must carry an ordinary feature "without
  opening a child", and the full table only lands in `security.md`. An agent working at the floor who sets
  `webviewTag: true` or `allowRunningInsecureContent: true` violates no floor rule. Items 8, 9, 10 and 11 of
  the checklist exist precisely for these flags, and they are the eight the runtime warning does cover — but
  EL-N-01 has already (correctly) told the agent that a clean dev console is not an acceptance signal, so the
  compensating control has been disabled by design.
- **Alternative tested.** Does EL-R-04 catch them? EL-R-04 covers the nine code-only items; these are
  config-default items, outside it.
- **Direction.** Either name the full default set in EL-R-03 or state the rule as a closed property ("no
  `webPreferences` key is set to a value less safe than its default; the authoritative table is in
  `security.md`") so the check is complete without enumerating at the floor.

### M-8 — A-6 and A-8 are stated as assumptions but carry no disconfirming signal

- **Severity** Medium · **Confidence** 75 · **Perspective** Risk · **Type** assumption_risk
- **Location** § 10 header ("Each is falsifiable, with what fails if it is wrong and what would settle it"),
  A-6 (line 610) and A-8 (line 612).
- **Observed.** A-1, A-2, A-4, A-5 and A-7 each name a concrete experiment or re-read that would settle them
  — A-2 goes further and routes itself to OQ-1. By contrast:
  - **A-6, "The evidence base is correct."** Settling evidence: "Fresh independent evaluation is required and
    is not optional." That is a **process step**, not an observable signal. The assumption has no bounded
    claim, no threshold, and no way to be shown false other than by finding an unspecified error somewhere.
    As written it cannot fail, and an assumption that cannot fail cannot inform a decision.
  - **A-8, "Copying the extractor is cheaper than sharing it."** Settling evidence: "Settled by **whether the
    shared-extractor refactor is ever done**." That is circular — a future decision is offered as evidence
    for the assumption that would motivate it. The observable signal exists and is different: the two
    extractors produce divergent behavior on the same fixture.
- **Why it matters.** A-6 is labelled "**This is the session's largest risk**", so the register's most
  important entry is its least actionable. It also crowds out the specific re-verifications that would
  actually reduce it — the EV § 7 single-sourced tool facts, the EV § 10 unresolved items (two of which I
  closed in this evaluation, H-3 and M-5), and the unsourced EV § 5 claims. Decomposed, A-6 becomes a work
  list; as written it is a disclaimer.
- **Direction.** Split A-6 into the specific single-sourced claims with a named re-verification each, and
  restate A-8's signal as observable extractor divergence.

### M-9 — The version block names one rotation date and no rule for deriving the next

- **Severity** Medium · **Confidence** 100 · **Perspective** Risk · **Type** design_flaw
- **Location** § 7 point 1 (lines 430-433).
- **Observed.** The block states "the next rotation date (2026-08-25, when 44 lands and 41 goes EOL)". No
  rule is given for computing the successor date. § 7 point 5 asserts "The rotation is a checkable
  obligation, not a hope", but the only enforcement named is EL-R-14, which polices qualifiers on claims, not
  the block's own freshness.
- **Why it matters.** On 2026-08-26 the block's "next rotation date" is in the past and points nowhere. The
  one field whose job is to tell a reader the document is due is the field that expires first, and it expires
  silently. I confirmed the successor is derivable at zero cost: `releases.electronjs.org/schedule.json`
  returns `{"version":"45.0.0","stableDate":"2026-10-20"}`. Stating the derivation rule ("the rotation date
  is the next `stableDate` in `releases.electronjs.org/schedule.json`") converts a value that rots into a
  procedure that does not — which is the same move § 7 point 2 already makes successfully for behavior facts.
- **Direction.** Carry the derivation rule alongside the current date, and make a past rotation date a review
  failure under EL-R-14.

### M-10 — The `tsx` "uncompiled" marker is gated by EL-OB-10 but has no defined form or location

- **Severity** Medium · **Confidence** 100 · **Perspective** Usage · **Type** checklist_gap
- **Location** § 8.3 fourth bullet (lines 528-531); EL-OB-10 (line 635); D3 (line 215).
- **Observed.** "React examples use a `tsx` fence and carry a visible '**not compiled by this harness**'
  marker… a second guard is required: fail if any `tsx` fence **lacks the marker**." EL-OB-10 makes the guard
  a gate. Nowhere is the marker's syntax or position specified: an info-string token (` ```tsx uncompiled `),
  a first-line comment inside the body, or a prose sentence preceding the fence are all consistent with the
  text, and they require three different implementations.
- **Why it matters.** A planner writing the harness task must invent the contract for a **gated** deliverable
  and then every child author must match the invention. The implementation is also non-trivial in a way § 8.4
  does not budget: `extract-blocks.mjs:98` `continue`s on any non-`ts` language **before** the block is
  recorded, so a `tsx` guard requires restructuring the parse loop to retain blocks it currently discards —
  not a delta to the token loop § 8.3 cites. § 12 lists six open questions and this is not among them,
  despite being less resolved than OQ-3.
- **Direction.** Fix the marker as an info-string token (machine-checkable, co-located with the fence) or add
  it to § 12 as an explicit open question with a recommendation.

### M-11 — `skill-writing` P7 requires a Codex `cold-load-result`, which the session's own waiver blocks

- **Severity** Medium · **Confidence** 75 · **Perspective** Project, Usage · **Type** assumption_risk
- **Location** A-7 (line 611, "Settled by the fresh-agent cold-use proof at `skill-writing` P7"); § 9
  "Mirror and wiring" (lines 592-595); § 2.5.
- **Observed.** I read P7 (`skill-writing/SKILL.md:199-245`). Step 6 is "Cold-load the skill through its
  normal entrypoint **in every target runtime**"; step 7 requires a fresh agent to perform the capability;
  and "The fresh agent writes one `cold-load-result` record **for each target runtime**", with
  `runtime: claude-code | codex` as a required field. P7 "passes only when structural checks, runtime
  loading, and fresh-agent use all pass" and must be rejected "when a required record or field is missing".
  Codex is waived for this session by user decision (EV § 9), and the Claude subagent cap already killed two
  agents at ~11:39Z.
- **Why it matters.** A-7 — the assumption that the 13-file, ~3,100-3,800-line shape is right — is settled
  *only* by P7, and P7 as written cannot pass without a Codex record. The artifact never surfaces the
  collision, so Planning inherits it as a late discovery on the skill's completion gate. Neither § 12 nor
  § 2.4 routes it.
- **Alternative tested.** Could the Codex cold-load be a mirror-topology check that survives the waiver? P7
  steps 1-5 are structural and would survive, but steps 6-7 and the per-runtime record explicitly require a
  fresh agent to load and use the skill in that runtime. The waiver bites. I hold this at 75 rather than 100
  because the waiver's exact scope (dual-system WORK/EVALUATION vs any Codex invocation) is a manager-owned
  reading I do not have the authority to fix.
- **Direction.** Surface it as an open question with a named disposition (defer the Codex cold-load record,
  or waive P7's per-runtime requirement for this skill) before Planning writes the wiring task.

### M-12 — EL-R-12's verification command is taught but never executed

- **Severity** Medium · **Confidence** 50 · **Perspective** Risk · **Type** assumption_risk
- **Location** § 5.1 EL-R-12 (lines 330-333); § 4.3 `packaging-distribution.md` row; EV § 6.
- **Observed.** `npx @electron/fuses read --app …` is made the *check* for the entire production fuse
  posture — the design's strongest packaging-security control. Neither the artifact nor EV records the
  command having been run; EV § 1 confirms only the package **version** (`@electron/fuses` 2.1.3).
- **Why it matters.** `mistakes/verification/verify-dont-assert-taught-facts.md` is explicit: "Any **COMMAND**
  a doc tells the reader to run must itself be **executed once as written** and the output confirmed", and
  the file's own worked example of the trap is a script taught with the wrong argument shape. If the CLI's
  subcommand or flag differs, the only verification for EL-R-12 fails at the reader's terminal, and an
  executor with no packaged artifact to test against will most likely transcribe it anyway.
- **Alternative tested.** Is running it feasible pre-Execution? Not fully — `read --app` needs a packaged
  app. But `npx @electron/fuses --help` establishes the subcommand and flag names at near-zero cost, which is
  the part at risk. I did not run it myself: installing an npm package into this worktree is a write action
  outside an evaluator's authority.
- **Confidence note.** 50, not higher: I have not shown the command is wrong, only that it is unverified
  while a loaded project mistake requires verification.
- **Direction.** Run `npx @electron/fuses --help` once and pin the exact invocation, or mark the command
  `UNVERIFIED` until the first packaged artifact exists.

## LOW

### L-1 — "the four silent platform failure modes" includes one that emits an observable event

- **Severity** Low · **Confidence** 100 · **Perspective** Consistency, Aesthetics · **Type** general
- **Location** § 4.3 `windows-native.md` row (line 257).
- **Observed.** The fourth of the "four silent platform failure modes" is "macOS notifications need code
  signing". `api/notification.md@v43.2.0:12-14`: "Unsigned binaries will **emit a `failed` event** when
  notifications [fail to] appear." `breaking-changes.md` (42.0): "notifications will emit a `failed` event on
  the `Notification` object." The other three (Linux tray `setContextMenu`, `globalShortcut.register()`'s
  boolean, `safeStorage`'s `basic_text` backend) are genuinely silent or poll-only.
- **Why it matters.** Small, but it cuts against the artifact's thesis, stated at § 1.2: "the dangerous
  mistakes are **silent**". Filing a signalled failure under "silent" teaches the agent not to look for the
  signal that exists — the `failed` handler is exactly the guidance this bullet should produce.
- **Direction.** Say "three silent and one signalled via a `failed` event", and teach the handler.

### L-2 — Citation drift on the `typescript` harness-property quote

- **Severity** Low · **Confidence** 100 · **Perspective** Consistency · **Type** general
- **Location** § 8.4 line 564: "`typescript/SKILL.md:124-126`".
- **Observed.** The quoted rule spans lines **123-125** (123 opens "- **MUST make every taught `ts` example
  type-check** —"; 125 ends "not decoration."). Line 126 is blank. The quoted text itself is exact.
- **Why it matters.** Minor on its own; noted because the artifact's own § 9 discipline ("re-locate by
  content, not by number") is applied to the enumeration sites and not to its other repository citations.
- **Direction.** Correct to 123-125, or drop the range and cite by content.

### L-3 — OQ-1 attributes the three-target tsconfig split to D6, then proposes changing it

- **Severity** Low · **Confidence** 100 · **Perspective** Consistency, Usage · **Type** general
- **Location** OQ-1 (lines 650-658) against D6 (line 218).
- **Observed.** OQ-1 argues for three passes "because `tooling-config.md` teaches a three-target split
  **(D6)**". D6 reads in full: "13 files: `SKILL.md` + 9 content children + `scenarios.md` / `checklists.md`
  / `evaluation.md`." It says nothing about tsconfig targets. Two sentences later OQ-1's fallback is "fall
  back to two passes and **narrow what `tooling-config.md` claims**" — impossible if the claim were
  user-locked by D6.
- **Why it matters.** § 3 exists so "a fresh planner does not reopen" locked decisions. Mislabelling a design
  choice as user-locked either freezes something that should stay negotiable or, once the reader notices the
  contradiction, weakens confidence in the D-references generally.
- **Direction.** Cite § 2.2 / § 4.3 for the three-target split and drop the D6 attribution.

### L-4 — The two heaviest child budgets are tight against the artifact's own precedent and obligations

- **Severity** Low · **Confidence** 50 · **Perspective** Performance, Usage · **Type** assumption_risk
- **Location** § 4.1 and § 4.3 budgets; A-7.
- **Verified precedent.** I measured both skills. `python`: 12 files, 2,724 lines, `SKILL.md` 402, children
  152-304. `typescript`: 12 files, 3,523 lines, `SKILL.md` 422, children 124-588. Both match § 4.1 exactly,
  and § 4.1's totals (3,110 / 3,820) are arithmetically correct.
- **Observed tension.** `typescript`'s heaviest child is 588 lines. `electron`'s heaviest budget is
  `ipc.md` at 330-400, which must carry the mechanism decision across four transports, **two** full
  serialization tables side by side, four sourced anti-patterns, the `senderFrame` rule, the `interface.d.ts`
  contract, and a DERIVED principle — plus, per § 8.3, a process-tagged compiled example for each. Likewise
  `security.md` at 300-360 must carry all 20 items **and** implementation depth for nine — and R-2 names
  precisely the failure that a tight budget invites ("an executor under budget pressure writes them as a list
  without the implementation depth"). `SKILL.md` at 420-480 must hold 22 hard rules, 7 soft rules, 7-8
  principles, P1-P8 with an author/review split, an 11-row router, the version block, References, and enough
  example code for EL-OB-02's "write an ordinary IPC channel from `SKILL.md` alone".
- **Why it matters.** § 4.1 says budgets are "directional, not gates", which is the right call — so this is a
  signal, not a defect. It is recorded because the structural pressure points at the same content R-2 flags
  as the highest-value and most tedious, and because H-6 shows the gate meant to catch that failure is a
  count.
- **Direction.** Treat the `security.md` and `ipc.md` budgets as soft floors rather than ranges, or accept a
  split if depth demands it — noting D1's flat one-hop constraint bounds the options.

### L-5 — EL-OB-13's second grep has no derivable expected count

- **Severity** Low · **Confidence** 75 · **Perspective** Usage · **Type** checklist_gap
- **Location** EL-OB-13 (line 638): "Grep for `electron` across `skills/`; expect **the seven sites plus the
  skill itself**."
- **Observed.** The seven "sites" span six files, and site 6 spans three line numbers of which only one
  carries the stale wording (M-2) — so the number of grep hits after the edit is indeterminate from the
  obligation's own text. The `electron` skill itself will contribute hundreds of matches across 13 files,
  which the phrase "plus the skill itself" does not bound.
- **Why it matters.** A check whose pass condition cannot be computed is not atomic and cannot be resolved
  `PASS` / `FAIL` from evidence, which `evaluation/SKILL.md` requires of every check.
- **Direction.** Scope the grep to exclude `skills/electron/` and state an exact expected hit count per file.

---

# Part 3 — Perspective checklist

Every row resolved from inspected evidence. `PASS` / `FAIL:<id>` / `n/a:<property>`.

## Project

| # | Check | Result |
|---|---|---|
| P-1 | The problem, its root cause, and the reason to act now are stated and evidenced | **PASS** — § 1.1-1.3; the gap claim re-verified (27 skill dirs, zero `electron` matches) |
| P-2 | The intended outcome is concrete and testable | **PASS** — § 1.4 + § 1.5's three signals |
| P-3 | The steelman for doing nothing is stated and answered on evidence | **PASS** — § 1.7; the 8-week cadence it rests on is confirmed against schedule.json |
| P-4 | Scope has a governing boundary test with named owners for every exclusion | **PASS** — § 2.1-2.3; the `coding/SKILL.md:293` anchor verified |
| P-5 | Deferred items each carry a destination or an explicit drop | **PASS** — § 2.4, seven rows, each disposed |
| P-6 | All six locked decisions are applied without silent reopening | **FAIL:L-3** — OQ-1 attributes a non-D6 claim to D6 |
| P-7 | Adjacent staleness is surfaced accurately, not acted on | **FAIL:M-3** — surfaced at 1 of 5 references |
| P-8 | The affected-file map matches the live tree | **FAIL:M-2** — `coding/review.md` "future" sites misstated |
| P-9 | Governing-skill completion gates are reachable under session constraints | **FAIL:M-11** — P7's Codex `cold-load-result` vs the waiver |
| P-10 | Falsification signals are stated for the design itself | **PASS** — § 1.6 |

## Structure

| # | Check | Result |
|---|---|---|
| S-1 | The file set is flat, one hop, and matches D6's count | **PASS** — 13 = 1 + 9 + 3; `skill-writing/SKILL.md:91` never-nest rule verified |
| S-2 | Every child has a distinct fork, owned content, and point-don't-restate targets | **PASS** — § 4.3, nine rows, no overlap left unassigned |
| S-3 | Overlapping ownership between children is adjudicated | **PASS** — § 6 design note splits `security.md` / `ipc.md` on #17 and #20 |
| S-4 | Each child's organizing device covers its whole subject | **FAIL:M-6** — the `security.md` partition orphans item 16 |
| S-5 | The harness's structural changes cover every path from text to compiled unit | **FAIL:H-7** — prelude/partial linkage is process-blind |
| S-6 | The triad is authored last, in the order its owning skill fixes | **PASS** — § 4.4; `operation-skill.md` S8-S10 verified at lines 113/123/133 |
| S-7 | The sibling-harness decision is argued from read source, not inference | **PASS** — all three § 8.2 reasons verified in-file |
| S-8 | Version-sensitive content is centralized rather than scattered | **PASS in intent, FAIL:H-4 in procedure** — the table is right, point 3 contradicts it |

## Performance

| # | Check | Result |
|---|---|---|
| Pf-1 | Cold-load cost of the parent is in line with precedent | **PASS** — 420-480 vs `python` 402 / `typescript` 422, both measured |
| Pf-2 | Total size is justified against a measured reference class | **PASS** — § 4.1's precedent table reproduces exactly; totals arithmetically correct |
| Pf-3 | Per-child budgets can carry their stated obligations | **FAIL:L-4** — `ipc.md` and `security.md` are tight against their own content lists |
| Pf-4 | The router keeps the common path child-free | **PASS** — § 6 states an ordinary single-window feature needs no child |
| Pf-5 | Recurring maintenance cost is stated accurately | **FAIL:H-4** — understated as two files against a documented eight |
| Pf-6 | Harness runtime cost is bounded | **n/a:not-measured** — A-3 (install weight) is unsettled by the author and by me |

## Aesthetics

| # | Check | Result |
|---|---|---|
| A-1 | Plain words, short sentences, no filler (Principle 7) | **PASS** — consistently plain; jargon defined on first use ("EV § n" at line 14) |
| A-2 | Lookup content is tabular | **PASS** — § 2.3, § 3, § 4.1, § 4.3, § 7, § 9, § 10, § 11, § 13 |
| A-3 | Markers are used as declared | **PASS** — `DERIVED` appears 11 times and is always sourced; `INFERRED` is declared and legitimately unused |
| A-4 | Claims are stated literally, not rhetorically | **FAIL:L-1** — "four silent failure modes" overstates one member |
| A-5 | Internal counts and cross-references agree | **FAIL:M-1** — "the two deltas" vs four |
| A-6 | Citations are precise | **FAIL:L-2** — `typescript/SKILL.md:124-126` should be 123-125 |

## Usage — the fresh planner as consumer

| # | Check | Result |
|---|---|---|
| U-1 | A fresh planner can identify every deliverable | **PASS** — § 4 gives 13 files with owner, fork, budget; § 8.4 gives 6-7 harness files |
| U-2 | A fresh planner can order the work | **PASS** — OQ-2 supplies the ordering recommendation with its reason |
| U-3 | Every task input resolves to a named, existing file | **PASS with M-2/M-3 corrections** — all seven enumeration sites verified live |
| U-4 | The six open questions are genuinely deferrable | **PASS** — I tested each; none blocks decomposition. OQ-1 has a named fallback; OQ-2 and OQ-3 carry recommendations; OQ-4/5/6 are user-owned but bounded, and Planning can proceed with the artifact's stated default in each case |
| U-5 | No **unlisted** open question forces a guess on a gated deliverable | **FAIL:M-10** — the `tsx` marker form is undefined and EL-OB-10 gates it |
| U-6 | The verification instrument is proven against the actual subject | **FAIL:H-1** — no obligation runs the harness over the skill |
| U-7 | Security rules are actionable without inventing the safe branch | **FAIL:H-2** — EL-R-09 stops at "null-checked" |
| U-8 | Obligation checks can distinguish a correct result from a cosmetic one | **FAIL:H-6** — EL-R-04 and EL-OB-11 are existence/count proxies |
| U-9 | Checks have computable pass conditions | **FAIL:L-5** — EL-OB-13's second grep |
| U-10 | The user's open decisions are posed on accurate facts | **FAIL:M-3** — OQ-5 undercounts its own surface |

## Consistency

| # | Check | Result |
|---|---|---|
| C-1 | Sections do not contradict each other | **FAIL:H-4** (§ 7.3 vs § 7 table vs A-4), **FAIL:L-3** (OQ-1 vs D6) |
| C-2 | Repository claims match the live worktree | **PASS with FAIL:M-2** — 27 dirs, zero `electron`, line counts, `run-examples.sh:70-77`, `tsconfig.examples.json`, single devDep, absent `node_modules`, extractor lines 96-107/98/112/131: **all verified exactly**; only the `coding/review.md` "future" sites are wrong |
| C-3 | Cited rules govern the documents they are cited for | **FAIL:M-4** — `point-dont-restate-workflow-docs` is scoped to `workflow/steps/*.md` |
| C-4 | Every hard rule is satisfiable by the design's own content | **FAIL:M-5** — the `BrowserView` row cannot satisfy EL-R-14 |
| C-5 | Evidence-file claims are faithfully carried, not amplified | **PASS** — I compared every EV-cited claim in §§ 1, 4, 5, 7, 8 against EV; no amplification found. The artifact is notably careful where EV hedges (Forge vs electron-builder; HashRouter as DERIVED; Playwright's experimental status) |
| C-6 | Counts agree across sections | **PASS** — 13 files, 9 children, 20 items, nine code-only, 14 + 8 rules, 7 sites / 6 files: all internally consistent |

## Risk

| # | Check | Result |
|---|---|---|
| R-1 | Version-sensitive facts carry a durable qualifier form | **PASS** — the "since N / removed in N" discipline is sound and I confirmed each such fact against primary sources |
| R-2 | The rotation procedure covers every decaying surface | **FAIL:H-4** — doc-state and absence claims are uncovered |
| R-3 | The freshness marker itself survives a rotation | **FAIL:M-9** — one date, no derivation rule |
| R-4 | The migration index defends against its own staleness | **FAIL:H-5** — no coverage ceiling, no stamp; absence reads as safety |
| R-5 | Trust-boundary rules fail safe | **FAIL:H-2**, **FAIL:H-3**, **FAIL:M-7** |
| R-6 | The false-pass harness argument is reproduced, not asserted | **PASS** — § 8.1's three configs and exit codes are a real local experiment with named error codes |
| R-7 | The fence-tagging scheme closes the silent-failure paths it identifies | **PARTIAL / FAIL:H-7, FAIL:M-10** — the untagged-is-an-error rule is exactly right and is the strongest single decision in § 8; the linkage path and the `tsx` guard are left open |
| R-8 | Each assumption is falsifiable with a stated disconfirming signal | **FAIL:M-8** — A-6 and A-8 are not |
| R-9 | Taught commands have been executed as written | **FAIL:M-12** — `npx @electron/fuses read --app …` has not |
| R-10 | Design decisions do not lean past what the un-reviewed EV § 7 tier can bear | **PASS** — every EV § 7 fact is carried with its provenance attached (electron-vite as community/`alex8088`; Playwright as experimental and underscore-prefixed; HashRouter as `DERIVED` because the docs are silent). A-5 even names the fork. This is the correct handling of a weak tier |
| R-11 | The riskiest child has a compensating control | **FAIL** (folded into H-1) — `renderer-react.md` is simultaneously derived (A-5), uncompilable under D3, and sourced from the un-reviewed tier, with no compensating verification |

## Overall

| # | Check | Result |
|---|---|---|
| O-1 | Cross-perspective tensions are resolved, not hidden | Partly. The Risk/Performance tension (currency vs maintenance cost) is confronted in § 1.7 and § 7, but resolved with a procedure that understates itself (H-4) |
| O-2 | The design's own thesis is carried through to its checks | **No.** The thesis is "the dangerous mistakes are silent" (§ 1.2). Four of the seven High findings are places where the design's *own* checks are silent: an existence proxy (H-6), a missing safe branch (H-2), a half-taught behavior (H-3), and an index whose absence reads as safety (H-5) |
| O-3 | Mechanism is not substituted for an outcome contract | **No.** The harness (mechanism) is fully specified and gated; "every taught example compiles" (outcome) is never contracted (H-1) |
| O-4 | Loaded project mistakes were applied | Partly. `verify-dont-assert-taught-facts` was applied well to the big mechanisms (extractor, tsconfig experiment, repo counts — all reproduced) and missed on fine detail (H-3, M-5, M-12), which is that mistake's documented second half. `verify-rule-scope-before-citing` was not applied (M-4) |
| O-5 | Strengths are identified for preservation | Yes — see the preserve list |

---

# Part 4 — Strengths and must-preserve list

Remediation must not damage these. Each is evidence-backed.

1. **The false-pass argument (§ 8.1) and the untagged-is-a-hard-error rule (§ 8.3).** The single strongest
   idea in the artifact. The three-config experiment is real, the error codes (`TS2584` / `TS2591`) are named
   as guard signals, and the refusal to make an untagged fence default to one pass is exactly the reasoning
   that keeps the guard honest. H-7 and M-10 are gaps *around* this design, not arguments against it.
2. **Electron core-fact accuracy.** Fifteen independent primary-source spot-checks, **zero refutations**,
   including four that are easy to get wrong: `senderFrame` nullable under (33.0) with the exact ✅/❌
   sample, wholesale `ipcRenderer` -> empty object under (29.0) with the "security footgun" wording, the
   20-item checklist with all nine code-only numbers correct, and the non-obvious "`BrowserWindow` is NOT
   deprecated while `BrowserView` IS". Preserve the version qualifiers verbatim.
3. **Repository-fact accuracy.** Every in-repo claim I re-checked verified exactly: 27 skill directories,
   zero `electron` matches, `python` 12/2,724/402/152-304, `typescript` 12/3,523/422/124-588,
   `extract-blocks.mjs` lines 96-107 / 98 / 112 / 131, `run-examples.sh:70-77`, `tsconfig.examples.json`'s
   combined lib surface, the single devDep, the absent `node_modules`, all seven enumeration sites, and the
   zero-match `grep` proving `typescript` never names its harness path. The one exception is M-2.
4. **Correct handling of the weak evidence tier.** Every EV § 7 fact travels with its provenance
   (community-maintained, experimental, docs-are-silent), HashRouter is marked `DERIVED` rather than
   attributed to React Router, and A-5 names the counterfactual that would turn it into a fork. This is the
   right response to an un-reviewed tier and should not be simplified away.
5. **Disciplined non-overstatement.** The Forge / electron-builder treatment (§ 5.3, § 4.3) explicitly
   refuses the overstatement EV § 10 warns against. The `security.md` / `ipc.md` ownership split (§ 6) is
   adjudicated rather than left to collide.
6. **The "since N / removed in N" qualifier discipline (EL-R-14, § 7 point 2).** Genuinely durable for
   historical behavior facts. H-4's fix is to **extend** its coverage to doc-state claims, not to replace it.
7. **§ 2.3's owner-named exclusion table and § 1.7's steelman-then-reject.** Both are models of scope
   discipline under Principle 5.
8. **OQ-1's format** — recommendation, reason, explicit falsifier, named owner. The other five open questions
   follow it and it is why U-4 passes.

---

# Part 5 — Verdict

| Severity | Count | IDs |
|---|---|---|
| Critical | 0 | — |
| High | 7 | H-1, H-2, H-3, H-4, H-5, H-6, H-7 |
| Medium | 12 | M-1 … M-12 |
| Low | 5 | L-1 … L-5 |
| **Total** | **24** | |

All seven High findings are at confidence 100.

**Derivation.** No Critical finding exists, so `FAIL` does not apply. Seven High findings sit at confidence
100, far above the `REVISE` threshold of one High at confidence >= 50. Verdict is therefore `REVISE`.

## VERDICT: REVISE

**Reasoning.** The artifact's factual base is strong — fifteen primary-source spot-checks returned zero
refutations, and every in-repo claim I re-checked verified except one. A fresh planner *can* decompose this
into ordered tasks; U-1 through U-4 pass, and the six open questions are genuinely deferrable. The defects
are not in what the design knows; they are in what its **checks can prove**.

Four of the seven High findings are the same failure repeated: the design identifies a silent failure mode,
writes a rule against it, and then attaches a check that the failure passes. The verification instrument is
fully specified but never contracted against the subject (H-1). The flagship trust-boundary rule stops one
clause short of the safe branch (H-2) and teaches one of the source's two documented outcomes (H-3). The
nine highest-value security obligations are gated by file existence (H-6). The migration index — the design's
answer to its own central risk — treats a missing row as a clean answer (H-5). And the rotation procedure that
bounds the decay understates its own cost fourfold (H-4). The artifact's thesis is that Electron's dangerous
mistakes are silent; its own checks are silent in the same places.

These are correctable in one iteration and none requires reopening a locked decision or redoing research.
Two of them (H-3, M-5) I closed against primary sources during this evaluation. The remaining High findings
are edits to rule text, check text, and the obligation list — not to the design's shape.

---

## Reopen conditions

Rebind and re-run this evaluation in full if the file set (D6), the harness architecture (§ 8), the Rules set
(§ 5), or the version-currency strategy (§ 7) changes materially. Prior results are history, not proof for a
changed subject.

## Evaluator limitations

- No dual-system cross-review of **this evaluation** exists either; the Codex waiver applies to me.
- A-3 (harness install weight) is unsettled by me as well as by the author — installing into the worktree is
  outside an evaluator's authority.
- M-12 is at confidence 50 because I did not run `npx @electron/fuses --help`; I show the command is
  unverified, not that it is wrong.
- M-11 is at confidence 75 because the exact scope of the Codex waiver is a manager-owned reading.
- I read no other evaluator's output before writing this.
