---
name: electron-skill-iteration-2-cold-load
description: Adversarial cold-read review of the revised Electron skill design, verdict revise
type: reviews
scope: project
feature: null
status: active
created: 2026-07-26
session: 473fe9ec-3726-40c6-abcf-662d09de9e6f
tags: [evaluation, verification]
keywords: [electron, ideation, cold-read]
author: claude
review_kind: adversarial-review
subject: 1-ideation/outputs/ideation.md
verdict: revise
---

# Ideation EVALUATION — iteration 2 — Claude, unprimed cold read

**Subject.** `1-ideation/outputs/ideation.md`, iteration 2, 1,267 lines (live count). Design for a
new `electron` project skill in 13 files.

**Evaluator independence.** Fresh evaluator. Did not author, review, or advise on this artifact or
its evidence. Deliberately did **not** read `evaluation/iteration-1/` — the unprimed-reader
constraint of the dispatch. Every repo claim below was re-read in
`worktrees/claude-2026-07-25-473fe9ec-3726-40c6-abcf-662d09de9e6f`; every Electron claim spot-checked
was fetched live from a primary source on 2026-07-25 and the command is recorded.

**Verdict rules, declared before results.** `FAIL` if any Critical finding at confidence ≥ 75.
`REVISE` if any High at confidence ≥ 50. Otherwise `PASS`. Confidence anchors: 100 = tool-verified
against the owning source; 75 = close reading plus citation; 50 = supported inference; 25 = hypothesis.

**Known caveats, weighted not rediscovered.** Codex waived by user decision → no dual-system
cross-review of the evidence. EV § 7 manager-collected and un-reviewed. `skill-writing` P7 Codex
`cold-load-result` absent by user decision. All three are disclosed in the artifact head-note, § 10
R-4, and § 13. The disclosure is adequate. One decision does lean on the un-reviewed tier harder than
the disclosure admits — see C-03, which is about a *core-tier* citation, not the § 7 tier.

---

## Part 1 — Independent verification log

Nothing below was inherited. Method and result for each.

### 1a. Repository claims — all reproduced

| Artifact claim | Method | Result |
|---|---|---|
| 27 skill directories, named list (§ 1.3) | `ls -d */` in `skills/` | 27, list matches exactly |
| `grep -ri electron` across `skills/` returns zero | `grep -ril electron .` | 0 |
| `python`: 12 files, 2,724 lines, `SKILL.md` 402, children 152–304 (§ 4.1) | `find`/`wc -l` | exact |
| `typescript`: 12 files, 3,523 lines, `SKILL.md` 422, children 124–588 (§ 4.1) | `find`/`wc -l` | exact |
| Seven enumeration sites across six files (§ 9) | read each line | all seven reproduce |
| `coding/review.md` "future" at **472 only** (§ 9 site 6) | `grep -n future` | 472 and 60 only; 60 unrelated; 470 is the heading, 474 the columns paragraph — correct |
| `coding/review.md` `General signal \| Python \| TypeScript` header first 64, last 316, count 14 (§ 14.4) | `grep -c` | 14, 64, 316 — the § 14.4 self-correction is right |
| `gobbi/SKILL.md`: GB-2 floor at 41, contract at 61, map rows 65–74, `python`/`typescript` row at 73 | read | exact |
| Five "future React skill" references across three files (§ 9) | `grep -rn -i` in `web/` | exactly five: `web/SKILL.md:18,107`; `web/ux/SKILL.md:21,201`; `web/ui/SKILL.md:195` |
| `web/SKILL.md:19` claims "React integration outcomes" (§ 2.3) | read | exact |
| `coding/SKILL.md:293` boundary test, heading at 291 (§ 2.1) | read | exact |
| `typescript/SKILL.md:123-125` states the property without a path (§ 8.4) | read | exact; 126 blank |
| `grep` for `run-examples` / `examples/typescript` across all skills returns zero (§ 8.4) | `grep -rn` | 0 |
| `extract-blocks.mjs` lines 74, 98, 101, 112, 120–126, 131, 147, 156–158, header 23–24 (§ 8.3) | `grep -n` / `sed` | **every one exact**, including the 156–158 range |
| `run-examples.sh` lines 37–41, 61 (`-maxdepth 1`), 70–77 (one temp tsconfig, one `tsc` at 77) (§ 8.2) | `grep -n` / `sed` | exact |
| `tsconfig.examples.json` is `lib:["ES2023","ESNext.Disposable","DOM"]`, `types:[]`, `skipLibCheck:true` (§ 8.2) | read | exact |
| `examples/typescript/package.json` declares exactly one devDep `typescript@5.9.3` (§ 8.2) | read | exact |
| `examples/typescript/node_modules` absent (§ 8.4) | `ls -d` | absent |
| Family template `Procedure` runs P1–P8, P2 is the router, author/review mode split exists (D1, § 4.2) | `grep -n "^### P"` in both | P1–P8 in both; `python:220` / `typescript:158` carry the mode split; P2 is "Load the child docs for the forks in play" in both |

**Assessment.** The in-repo verification discipline in this artifact is excellent. I attempted to
break twenty separate line-number and count claims and broke none. § 14.4's claim that "no line
number survives from iteration 1 unverified" is supported.

### 1b. Electron primary-source spot-checks — eight run, six clean, two exposed defects

All fetched 2026-07-25 from `raw.githubusercontent.com/electron/electron/v43.2.0/…`,
`releases.electronjs.org`, and `registry.npmjs.org`.

| # | Claim | Source read | Result |
|---|---|---|---|
| 1 | Electron 43.2.0 / Chromium 150.0.7871.129 / Node 24.18.0 / `NODE_MODULE_VERSION` 148, released 2026-07-21; supported 43/42/41; 44.0.0 stable 2026-08-25 (Chromium 152), 45.0.0 2026-10-20; 41 EOL 2026-08-25 (EV § 1, § 7) | `releases.json`, `schedule.json` | **PASS — every field exact** |
| 2 | Security checklist is 20 items; item 16 "Use a current version of Electron" at 717; item 17 at 745; the vendor item-17 sample compares `.host` and dereferences `frame.url` without a null check (§ 1.2, § 13, EL-R-05) | `docs/tutorial/security.md` | **PASS** — 20 `### N.` headings; 717 / 745 exact; sample is `if (!validateSender(e.senderFrame)) return null` with `(new URL(frame.url)).host === 'electronjs.org'` |
| 3 | `senderFrame` has two documented outcomes since 33 — `null` and `detached === true`; header `(33.0)` at 548, change at 559–586; `frame.detached` exists on `WebFrameMain` (§ 1.2, EL-R-09) | `docs/breaking-changes.md`, `docs/api/web-frame-main.md:290` | **PASS — quotes verbatim, line ranges exact.** The strongest content in the artifact |
| 4 | `BrowserView` deprecated in 30 (`### Deprecated: BrowserView` at 765 under `(30.0)` at 739); 44.0 section at 15 removes macOS 12, `win32-ia32`, `linux-armv7l`, renderer `clipboard` (RFC 0019) (§ 13, `migration.md`) | `docs/breaking-changes.md` | **PASS — all exact** |
| 5 | `BrowserWindow` is not deprecated (`base-window.md`: "may be a simpler option"); macOS notifications emit a `failed` event when unsigned (`notification.md:12-14`, `Event: 'failed'` at 335) (§ 4.3, § 13, L-1) | `docs/api/base-window.md:10`, `docs/api/notification.md` | **PASS — both exact** |
| 6 | `electron@43.2.0` declares no `scripts` key, `types: electron.d.ts`, unpacked 1,142,726 B; `@electron/fuses` 2.1.3; `npx @electron/fuses read --app <path>` (§ 8.1a, § 13, EL-R-12) | npm registry; `electron/fuses` README:41-42 | **PASS — all exact, invocation verbatim** |
| 7 | `lib/renderer/security-warnings.ts@v43.2.0` covers only checklist items 1, 2, 6, 7, 8, 9, 10, 11 and its comments say the rest cannot be checked (§ 1.2, EL-N-01, § 7) | `lib/renderer/security-warnings.ts` | **DEFECT — see C-04 and C-14.** The coverage set is right; the source's own numbering is one off from the live doc, the artifact never records the offset, and the "the rest" attribution overstates what the comment says |
| 8 | The `webPreferences` defaults table with a "Since" column is quoted from `docs/tutorial/security.md@v43.2.0` and covers twelve options (EV § 2, § 4.3, EL-R-03) | `docs/tutorial/security.md`, `docs/api/structures/web-preferences.md` | **DEFECT — see C-03.** `security.md` contains **zero** Markdown tables; four of the twelve keys appear in it 0 times |

Two further primary-source reads, not on the artifact's claim list, produced findings C-01 and C-02.

---

## Part 2 — Finding ledger

Each finding: severity · perspective · type · confidence · exact location · expected vs observed ·
why it matters · cause · alternative tested · corrective direction.

---

### C-01 — The security partition files "Define a Content Security Policy" as already-correct-by-default

- **Severity:** High · **Perspective:** Risk (also Project) · **Type:** design_flaw · **Confidence:** 100
- **Location:** ideation.md § 4.3 `security.md` row (line 344); § 1.2 (lines 70–72); § 2.2 (line 177);
  EL-R-04 (lines 445–455); EL-OB-24 (line 1049). Inherited from EV § 3 (lines 87–91).
- **Expected.** The three-way partition assigns each of the 20 checklist items to the bucket that
  describes the work it actually requires.
- **Observed.** The partition is stated as (a) already correct by default, (b) the nine you must
  write — enumerated as #5, #12, #13, #14, #15, #17, #18, #19, #20 — and (c) process-and-upkeep,
  described only as "where item 16 lands". Under that closed assignment, item **7, "Define a Content
  Security Policy"**, falls into bucket (a). It does not belong there. `docs/tutorial/security.md@v43.2.0:357-400`
  (read 2026-07-25) gives item 7 a `#### How?` section whose answer is main-process code —
  `session.defaultSession.webRequest.onHeadersReceived(...)` setting a `Content-Security-Policy`
  header. Electron ships **no** default CSP. Item **1, "Only load secure content"**, is likewise a
  practice, not a default.
- **Why it matters.** This is security guidance that fails **unsafe**: it tells the author a control
  is already handled when nothing has been done. A missing CSP is the difference between a contained
  XSS and a renderer-to-native escalation path. It is also invisible in production — the renderer
  security warning for a missing CSP fires only in unpackaged dev builds, which is the artifact's own
  EL-N-01 thesis turned against it.
- **Cause.** EV § 3's compression — "the `webPreferences` flags are **already correct by default**" —
  was carried into a partition label. The partition's real axis is *does a dev-console warning fire*;
  the label claims the axis is *is it secure by default*. The two coincide for items 2, 6, 8, 9, 10, 11
  and diverge for 1 and 7.
- **Alternative tested.** Could item 7 be intended for bucket (c) process-and-upkeep? § 4.3 names
  only item 16 for (c), and § 1.2 states flatly "Nine of the twenty security-checklist items are code
  the author must write" — a closed count that excludes 7. So no.
- **Check-strength note.** EL-OB-24's defeater is "a two-way partition that silently orphans item 16."
  A partition that gives item 7 a *wrong* home is not an orphan and passes the check. This is the
  § 5.0 defect surviving inside § 5.0's own flagship obligation.
- **Corrective direction.** Re-derive the partition from the live doc item by item, name the axis
  explicitly, and either widen bucket (b) past nine or add a fourth bucket for author-written controls
  that a dev warning happens to cover. Give EL-OB-24 a defeater that fails a *mislabelled* item, not
  only a missing one.

---

### C-02 — The navigation control never names its hook, and `will-navigate` misses subframes

- **Severity:** High · **Perspective:** Risk · **Type:** scenario_gap · **Confidence:** 100
- **Location:** EL-R-05 (lines 456–463); EL-R-04's item-#13 clause (line 446); § 4.3 `security.md`
  row (line 344); § 6 router row for `security.md` (line 653).
- **Expected.** A rule that owns "navigation allowlist" as one of the nine code-only items names the
  event the guard attaches to, because the guard's coverage is a property of the event, not of the
  comparison.
- **Observed.** EL-R-05 specifies the comparison completely (`new URL(...)`, `.origin`, a closed
  allowlist, deliberately stricter than the vendor's `.host`) and specifies the hook not at all. No
  `SKILL.md` rule, no `security.md` Owns entry, and no § 6 router row mentions `will-navigate`,
  `will-frame-navigate`, or `will-redirect`. `docs/api/web-contents.md@v43.2.0:246-300` (read
  2026-07-25): `will-navigate` is "Emitted when a user or the page wants to start navigation **on the
  main frame**"; `will-frame-navigate` is documented as "Unlike `will-navigate`, `will-frame-navigate`
  is fired when the main frame **or any of its subframes** attempts to navigate." The vendor's own
  item-13 sample (`security.md@v43.2.0:595-641`) uses `will-navigate`.
- **Why it matters.** A guard that parses `.origin` perfectly and attaches to `will-navigate` silently
  admits every subframe navigation to an attacker origin. It is exactly the artifact's own signature
  failure shape — code that exists, compiles, reviews clean, and does not do the thing — and exactly
  the trap the artifact congratulates itself for catching at item 17: the vendor's sample carries a
  coverage gap the vendor does not flag. The artifact caught it once and walked past it the second time.
- **Cause.** EV § 3 recorded item 13 as a *string-comparison* lesson ("compare `origin`, never
  `startsWith`") because that is what the doc's prose emphasises. The event surface was never
  collected, so the rule inherited the narrower framing.
- **Alternative tested.** Is the hook a `tooling-config.md` or `windows-native.md` concern instead?
  No — § 4.3 gives `security.md` "the nine you must write" including #13, and § 6 routes "navigation"
  to `security.md` alone.
- **Check-strength note.** EL-R-05's entire defeater set (`startsWith`, `includes`, `host.endsWith`)
  probes the comparison. A correct `.origin` comparison on `will-navigate` passes every defeater.
- **Corrective direction.** Add the event surface to EL-R-05's rule text and to `security.md`'s Owns
  list, and add a defeater of the form "a correct `.origin` allowlist attached to `will-navigate`
  alone must fail." Verify `will-redirect` and `setWindowOpenHandler` coverage in the same pass.

---

### C-03 — The twelve-option `webPreferences` table is cited to a source that does not contain it, and the rule it backs is not closed

- **Severity:** High · **Perspective:** Consistency (also Risk) · **Type:** assumption_risk · **Confidence:** 100
- **Location:** EL-R-03 (lines 438–444); § 4.3 `security.md` row (line 344, "the **sole**
  `webPreferences` defaults table, with its 'Since' column (EV § 2), covering all twelve options");
  § 7's rotation table row for `security.md` (line 749). Inherited from EV § 2 (lines 46–55).
- **Expected.** The artifact's most security-load-bearing lookup table resolves to a named source
  that contains it, and the check built on it is as closed as the rule it enforces.
- **Observed, two defects.**
  1. **The citation does not hold.** EV § 2 states "Each default below is quoted from
     `docs/tutorial/security.md@v43.2.0` with the version it changed in." That file contains **zero**
     Markdown tables (`grep -n "^|"` → no output). Four of the twelve keys — `nodeIntegrationInSubFrames`,
     `webviewTag`, `safeDialogs`, `navigateOnDragDrop` — appear in it **0 times**. Their real owner is
     `docs/api/structures/web-preferences.md@v43.2.0`. Only three "Since" values are sourced anywhere,
     and they are prose, not a column: `security.md:161` (5.0.0), `:226` (12.0.0), `:252` (20.0.0).
     `nodeIntegrationInSubFrames` has no stated default in either file.
  2. **The check is narrower than the rule.** EL-R-03 states a deliberately **closed** property — "no
     `webPreferences` key is set to a value less safe than its documented default" — and then
     specifies the check as a key-by-key diff "against that table". `WebPreferences` has **44**
     top-level keys, 27 boolean. The table has twelve. `enableBlinkFeatures` — which is checklist item
     **10**, a security item in its own right — is outside the twelve. So `enableBlinkFeatures: 'CSSVariables'`
     passes EL-R-03's check while violating EL-R-03's rule and the vendor's item 10.
- **Why it matters.** § 14.1 names the artifact's central defect as "the check answers yes for exactly
  the cases the rule was written to catch," and § 14.3 M-7 records the iteration-2 fix as widening the
  rule from four keys to twelve. Twelve is not closed either. The fix moved the boundary; it did not
  remove it. Separately, an executor who follows the `(EV § 2)` citation to build the authoritative
  table will find no table and will fill nine rows from the model's prior — the precise failure mode
  `mistakes/verification/verify-dont-assert-taught-facts.md` records for this project.
- **Cause.** A composite table was assembled from prose in one file and bullets in another, then
  attributed wholesale to the first.
- **Alternative tested.** Is the table perhaps in `docs/api/browser-window.md`? The defaults are
  documented in `structures/web-preferences.md` as prose bullets; no file at v43.2.0 carries a
  twelve-row defaults table with a Since column. The artifact is asking Execution to *construct* one
  and describing it as *quoted*.
- **Aggravating.** The defaults table does not appear in § 7 point 4's seven-member stamped register,
  so EL-R-15's re-fetch discipline never reaches it. It is a doc-state claim outside the doc-state class.
- **Corrective direction.** Re-cite each row to its owning file; mark the three `Since` values as
  prose-derived and the rest as absent; add the table to the § 7 stamped register; and either close
  EL-R-03's check over the full `WebPreferences` surface (diff every key present against
  `structures/web-preferences.md`, which is mechanically possible) or state the residue § 5.0 requires
  and name who inspects the other 32 keys.

---

### C-04 — `security-warnings.ts` numbers its own checklist one off from the live doc; the artifact records the answer but not the offset, and sends the maintainer to the untranslated source

- **Severity:** High · **Perspective:** Consistency (also Risk) · **Type:** assumption_risk · **Confidence:** 100
- **Location:** § 7 point 4's stamped register row 3 (line 718); EL-N-01 (lines 560–565); § 1.2
  (lines 73–76); EL-R-15 (lines 541–548). Inherited from EV § 3 (lines 93–95).
- **Expected.** A stamped doc-state claim, plus a re-fetch instruction, that together lead a future
  maintainer to the right conclusion.
- **Observed.** `lib/renderer/security-warnings.ts@v43.2.0` uses an **internal checklist numbering
  that is stale relative to the live 20-item doc from item 4 onward**. Its own comments read:
  `#2` Node integration, `#3` context isolation (missing, "still experimental"), `#4`
  `setPermissionRequestHandler` (missing), `#5` webSecurity, `#6` CSP, `#7` allowRunningInsecureContent,
  `#8` experimental features, `#9` enableBlinkFeatures, `#10` allowpopups, and at line 251 a block
  naming `#11` webview options, `#12` navigation, `#13` new windows, `#14` openExternal as missing.
  The live doc numbers these 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15. The artifact's stated
  coverage — items **1, 2, 6, 7, 8, 9, 10, 11** — is the **correct translation** into doc numbering.
  The translation itself is recorded nowhere.
- **Why it matters.** § 7 point 4 instructs the rotator to re-fetch `lib/renderer/security-warnings.ts`
  and confirm the claim, and EL-R-15's defeater makes re-fetching mandatory ("re-reading the skill must
  not satisfy this check"). A maintainer who obeys will open the source, read "#5 on the checklist: Do
  not disable websecurity", compare it to a claim that says item 5 is *not* covered, and conclude the
  skill is wrong. The likeliest repair is to "correct" the skill to the source's stale numbering — at
  which point `security.md`'s nine-item code-only partition, which is keyed to the live doc's numbers,
  silently mis-maps. The verification procedure, executed correctly, produces the wrong answer.
- **Cause.** The translation was performed during research and discarded as intermediate work rather
  than recorded as the load-bearing fact it is.
- **Alternative tested.** Could the doc numbering have changed after v43.2.0, making the source
  current? No — both artifacts are from the same tag, `v43.2.0`. The source file is internally stale
  against its own repo.
- **Corrective direction.** Record the offset explicitly in the stamped register row and in
  `security.md`, with the mapping table (source `#N` → doc `#N+1` for N ≥ 4), and make EL-R-15's
  rotation step re-derive the translation rather than re-compare the numbers.

---

### C-05 — EL-OB-14's check is unsatisfiable against § 4.3's own content obligation

- **Severity:** Medium · **Perspective:** Usage · **Type:** checklist_gap · **Confidence:** 100
- **Location:** EL-OB-14 (line 1039); § 4.3 `renderer-react.md` row (line 347); § 2.3 row 3 (line 201).
- **Expected.** A check that a compliant skill passes.
- **Observed.** EL-OB-14 reads: "Case-**insensitive** grep of the skill directory for `react` and
  `skill` on the same line; expect zero." § 4.3 simultaneously requires `renderer-react.md` to carry
  "the explicit statement that general React idioms are out of scope," and § 2.3 requires the exclusion
  to be "named as out of scope **in the skill text**." Every natural phrasing of that required sentence
  — "General React idioms are out of scope for this skill" — contains `react` and `skill` on one line
  and trips the check. So does the file's own Points-at note, "Names no `react` skill (D2)."
- **Why it matters.** An executor hits a red check on correct content. The two available responses are
  both bad: contort the prose into unnatural phrasing, or weaken the check. § 14.2 F-12 records that
  iteration 2 *widened* this grep from case-sensitive to case-insensitive to catch "future **React**
  skill" — the widening is what made it unsatisfiable.
- **Cause.** The check tests a lexical co-occurrence as a proxy for a semantic property (does the skill
  promise a `react` skill), and the proxy's false-positive class overlaps the required content.
- **Corrective direction.** Test the property, not the co-occurrence: grep for a *reference form* —
  `react/SKILL.md`, `../react/`, "future React skill", "the `react` skill" — and state the residue.

---

### C-06 — `## Maintaining this skill` after References breaks the fixed operation shape

- **Severity:** Medium · **Perspective:** Structure · **Type:** design_flaw · **Confidence:** 100
- **Location:** § 4.2 "Cold-load floor definition" (lines 297–302); § 5.1b preamble (lines 530–532).
- **Expected.** `SKILL.md` conforms to the shape its own hard constraints name.
- **Observed.** `skill-writing/operation-skill.md` § Required artifact set fixes the shape as
  `Frontmatter → Intro → Principles → Rules → Procedure → References` and closes with shape-based
  Completion checks. D1 (§ 3) and § 2.6 both make the `python`/`typescript` family template the shape
  contract; `python/SKILL.md` ends at `## References` (line 371) and `typescript/SKILL.md` at line 396
  — neither has any section after References. The artifact adds a fourth top-level section **after**
  References and then excludes it from the cold-load floor measurement.
- **Why it matters.** The carve-out is a measurement convenience with no owner rule behind it: the
  budget "460–540 lines" is defined over a subset of the file that no guard can identify. It also puts
  three normative `MUST` rules outside the section the type contract says holds Rules, where a cold
  loader that stops at References will never see them — including EL-R-16, the rule that makes the
  example harness binding.
- **Alternative tested.** Does `skill-writing` permit extra sections? Its Must-Follow requires the
  dominant section stay dominant and the P5 table gives the target shape as a closed sequence; nothing
  authorises a post-References section. § 4.2 does not cite an authority for it.
- **Corrective direction.** Either move the three document-author rules into `evaluation.md` (whose
  consumer is the maintainer/evaluator) or into a separate maintenance child, or get an explicit user
  decision to deviate from the fixed shape and record it as a D-decision.

---

### C-07 — A declared success signal has no obligation, no check, and no deferral

- **Severity:** Medium · **Perspective:** Project · **Type:** scenario_gap · **Confidence:** 100
- **Location:** § 1.5 (lines 121–123) vs § 11 (lines 1024–1049).
- **Expected.** Every § 1.5 success signal maps to an obligation, or to an explicit deferral.
  `planning` P-3 requires bidirectional trace; § 1.5's other three signals all map (EL-OB-02, EL-R-14/15,
  EL-R-16/EL-OB-17).
- **Observed.** "A fresh evaluator, entering through `evaluation.md`, catches a seeded process-boundary
  violation, a seeded generic-bridge footgun, and a seeded **present-but-permissive** security guard"
  appears in no obligation. `grep -n "seeded"` over the artifact returns exactly two locations: § 1.5
  and § 4.4's `scenarios.md` row, which obliges the *authoring* of seeds, not the running of the
  fresh-evaluator proof. EL-OB-02 covers the fresh-*author* proof only.
- **Why it matters.** This is the only signal that tests whether the skill works in **review** mode —
  half of the family template's declared operating modes (`python/SKILL.md:220`) and the whole of D4's
  three-axis P8. A planner running P-3 finds an Ideation obligation with no task and, under P-2, has
  to route it back upstream rather than invent one.
- **Corrective direction.** Add an EL-OB with the seeded-defect fixture set named, or record an
  explicit user-approved deferral with a destination.

---

### C-08 — The P7 wiring obligation names a category where every other verification names a command

- **Severity:** Medium · **Perspective:** Usage · **Type:** checklist_gap · **Confidence:** 100
- **Location:** § 9 "Mirror and wiring" (lines 983–987); § 10 R-4 (line 1013); EL-OB-21 (line 1046).
- **Expected.** The one hard gate the artifact already flags as partly unsatisfiable is otherwise
  specified precisely enough to run.
- **Observed.** § 9 says the mirrors "are produced by the project-owned sync mechanism" and defers
  "which step runs it" to Planning. The artifact names **no script anywhere** — `grep -in sync` returns
  a single prose hit at line 985. The worktree has `scripts/sync-plugin-package.sh`,
  `scripts/check-markdown-links.sh`, `scripts/check-codex-plugin-smoke.sh`,
  `scripts/test-sync-plugin-package.sh`. `skill-writing` P7 step 2 demands "mirror, link, reference,
  compatibility, and retired-vocabulary guards" — five classes against four scripts, with no mapping
  anywhere in the artifact.
- **Why it matters.** The contrast is stark: EL-R-16 names `examples/electron/run-examples.sh` and
  EL-R-12 names `npx @electron/fuses read --app <path>` verbatim. The wiring gate — where R-4 already
  records that Codex-class mirror-topology defects go unverified — is the one left as a category. A
  planner writing that task's verification will guess, and a wrong guess is invisible until the mirror
  drifts. `skill-writing`'s own Must-Not-Follow forbids hand-editing mirrors, which raises the cost of
  guessing wrong.
- **Corrective direction.** Name the script, its `--check` mode, and the four-to-five guard mapping, or
  state explicitly that the mapping is a Planning input the artifact does not supply.

---

### C-09 — OQ-1's fallback silently reshapes five other decisions

- **Severity:** Medium · **Perspective:** Structure · **Type:** assumption_risk · **Confidence:** 75
- **Location:** OQ-1 (lines 1060–1069); § 8.3 deltas 1 and 3 (lines 861–870); § 8.4 (lines 885–896);
  EL-R-02 (lines 431–437); EL-OB-17 (line 1042); A-2 (line 999).
- **Expected.** § 12's claim that "None blocks decomposition; each changes one bounded piece of work"
  holds for OQ-1.
- **Observed.** OQ-1's fallback is stated as "fall back to two passes and narrow what
  `tooling-config.md` claims." It does not say what becomes of: `preload` as a member of `PROCESS_WORDS`
  (delta 1); the `units/preload/` output directory (delta 3); `tsconfig.preload.json`, one of the "six
  top-level files" (§ 8.4); EL-R-02's "one `tsc` pass per declared target"; or EL-OB-17's "non-zero
  unit count in **every** declared process directory." Under two passes, a `ts preload` fence has no
  config, and delta 2 makes an untagged fence a hard error — so preload examples become unwritable
  until the vocabulary is re-decided.
- **Why it matters.** The harness task is OQ-2's recommended *first* task. Its file set, its extractor
  vocabulary, and two obligations all shift on an unresolved experiment. "Bounded" understates it.
- **Alternative tested.** Could Planning simply run the experiment first and never see the fallback?
  Yes, and that is the likely path — which is why this is Medium, not High. But if the experiment fails,
  the plan needs an answer the artifact does not contain.
- **Corrective direction.** Write the two-pass fallback out concretely: which process word survives,
  where preload blocks compile, and what EL-OB-17 counts.

---

### C-10 — Roughly half the defeaters restate the corrected defect instead of probing the strengthened check

- **Severity:** Medium · **Perspective:** Consistency · **Type:** design_flaw · **Confidence:** 75
- **Location:** § 5.0 (lines 402–420) and its application in § 5.1a, § 5.2, § 5.3, § 11.
- **Expected.** § 5.0 defines a defeater as "one concrete *wrong-but-conformant* result that the check
  must reject" — conformant with the check **as written**, so that the defeater retains force after the
  fix.
- **Observed.** Many defeaters are conformant only with the *pre-fix* check and are trivially caught by
  the current one. Examples:
  - **EL-OB-06** — check greps `43.2.0`, `Electron 43`, and `43, 42, 41`; defeater is "a second file
    saying 'Electron 43' without the patch number," which the check's own second pattern catches.
  - **EL-R-12** — check specifies "on the signed, shipped artifact"; defeater is "a posture read from an
    unsigned intermediate," which the check already excludes by construction.
  - **EL-R-03** — check diffs against the twelve-key table; defeater is `webviewTag: true`, a key inside
    the table. (The genuine defeater lies outside it — see C-03.)
  - **EL-R-13** — check requires attachment "at module top level"; defeater is a registration inside a
    post-ready function, already excluded.
  Genuine live probes do exist — EL-R-01 (`document` tagged `main` → `TS2584`), EL-R-08's
  `cb(e.senderFrame, ...a)`, EL-R-09's "the vendor's item-17 sample copied verbatim must fail both ways"
  — and they are excellent.
- **Why it matters.** The defeater column is the artifact's central control. Where it records history
  instead of probing the current check, EL-OB-* can be satisfied cosmetically while the check retains
  an unprobed blind spot. C-01, C-02, and C-03 are each an instance of exactly that blind spot in a
  rule whose defeater looked satisfied.
- **Corrective direction.** Re-derive each defeater against the *current* check text and reject any
  defeater the current check already names. Where the only defeater found is the historical one, that
  is the signal to look harder — or to state the residue § 5.0 requires.

---

### C-11 — The permission "pair" is a derived security obligation that the derived-claim register omits

- **Severity:** Medium · **Perspective:** Consistency · **Type:** assumption_risk · **Confidence:** 100
- **Location:** § 4.3 `security.md` row (line 344, "the permission **pair**"); EL-R-04's defeater set
  (line 454); § 2.5 (line 233); OQ-4 (lines 1088–1099); EL-OB-16 (line 1041).
- **Expected.** § 2.5's hard constraint — every Electron claim traces to EV, to a cited primary source,
  or is marked `DERIVED` — applied uniformly, and OQ-4's and EL-OB-16's registers complete.
- **Observed.** `setPermissionCheckHandler` appears **0 times** in `docs/tutorial/security.md@v43.2.0`.
  Checklist item 5 prescribes only `setPermissionRequestHandler` (sample at line 296). The pairing
  derives from `docs/api/session.md@v43.2.0:951` — "Most web APIs do a permission check and then make a
  permission request if the check is denied" — which I verified verbatim. The inference is sound. But
  EL-R-04 turns it into a hard defeater ("registering `setPermissionRequestHandler` **without**
  `setPermissionCheckHandler`" must fail) while OQ-4 opens by naming "**Three** claims in § 5 [that] are
  `DERIVED` rather than quoted" and EL-OB-16's register names five derived claims. This is neither.
- **Why it matters.** OQ-4 asks the user to decide whether derived security claims are strong enough to
  be hard rules. A derived security claim that never reaches the register is decided by omission. The
  register is also the artifact's only defence against a future maintainer promoting a derivation to a
  vendor attribution.
- **Corrective direction.** Mark it `DERIVED` from `api/session.md`, add it to EL-OB-16's register and
  to OQ-4's list, and correct OQ-4's "three" to the live count.

---

### C-12 — Roughly one line in seven is process narration aimed at the previous evaluators, not the stated consumer

- **Severity:** Medium · **Perspective:** Aesthetics (also Usage) · **Type:** general · **Confidence:** 100
- **Location:** § 14 (lines 1150–1267, **118 lines**, 9.3% of the file); 24 "Iteration 1 said X, that
  was wrong" asides across §§ 1.7, 4.1, 4.2.1, 5.1b, 5.3, 7, 8.4, 9, 10, 12; opaque finding-ID
  citations at EL-OB-04 (`F-07`), EL-OB-11 (`R-2; H-6`), EL-OB-13 (`L-5`), EL-OB-17 (`H-1`),
  EL-OB-18 (`H-5`), EL-OB-19 (`H-7`), EL-OB-20 (`F-06`), EL-OB-22 (`H-4`), EL-OB-23 (`F-01`),
  EL-OB-24 (`M-6`), § 8.4 (`H-1`), § 7 (`H-4`).
- **Expected.** The head-note's contract: "A fresh planner decomposes from this file alone."
- **Observed.** § 11's Source column — the trace-to field a planner needs most under `planning` P-3 —
  cites identifiers like `H-6` and `F-07` that resolve only into § 14, which in turn summarises two
  evaluation reports the planner does not receive. "Source: H-6" is a dangling reference for the stated
  consumer. Separately, the 24 self-corrections make the reader hold two versions of several facts
  (line budgets, rotation cost, site 6's line count, the delta count) when only the current one is
  actionable.
- **Why it matters.** Principle 7 (plainly, briefly, literally) and Principle 6 (documents are the
  team's memory — for the *next* reader). The revision log is genuine, valuable evidence; its consumer
  is the RECORD stage and the disposition audit, not the planner. Keeping it inside the plan-ready
  output makes the planner pay for it on every read.
- **Blunt answer.** Yes, the document should be shorter — but the cut is specific, not general. Move
  § 14 to `1-ideation/staging/` and cite it once from the head-note; collapse the 24 asides to the
  corrected statement (keeping the correction only where a reader could otherwise re-introduce the
  error — § 8.4's five-delta count is the one case that earns it); and replace § 11's finding-ID Source
  entries with section references. That is roughly 160–180 lines. The remaining ~1,090 lines are dense
  and load-bearing; I found no padding in §§ 2–9. Do **not** cut § 5's defeaters, § 7's rotation
  table, § 8.1a's measurement, or § 10 — those are the artifact's substance.

---

### C-13 — § 9's `gobbi`-map arithmetic does not close

- **Severity:** Low · **Perspective:** Consistency · **Type:** general · **Confidence:** 100
- **Location:** § 9 adjacent-staleness item 2 (lines 973–981); § 2.4 last row (line 224); OQ-3 (line 1083).
- **Observed.** "The floor is exactly five … leaving **22** skills to index; the map at lines 65-74 has
  **ten rows covering eleven skills**. **Ten** are missing." 22 − 11 = 11. The enumerated list has
  exactly ten because it silently omits `gobbi` itself. Verified live: 27 dirs, floor of 5
  (`gobbi/SKILL.md:41`), map rows at 65–74 covering `mistake, memory, workflow, startup, planning,
  execution, wrap-up, coding, python, typescript, codex` = 11.
- **Why it matters.** Low impact — but this is a passage whose entire purpose is correcting an earlier
  miscount, and OQ-3 asks the user to decide using these numbers.
- **Corrective direction.** State the convention (does the indexing skill index itself?) and make the
  three numbers agree.

---

### C-14 — The `security-warnings.ts` "currently missing" quote is applied to a wider set than the source claims

- **Severity:** Low · **Perspective:** Consistency · **Type:** general · **Confidence:** 100
- **Location:** § 1.2 (lines 73–76); EL-N-01 (lines 560–565). Inherited from EV § 3 (line 94).
- **Observed.** The artifact writes "its own comments say **the rest** are *'currently missing since we
  can't easily programmatically check for those cases'*." The quote is real (`security-warnings.ts:143`).
  Its scope is not "the rest": line 140 names item 3 as missing for a *different* reason ("has
  ramifications and is still experimental"), line 143 covers one item, and line 251 covers four more.
  The comments are silent on doc items 16–20 — five of the nine the artifact's argument turns on.
- **Why it matters.** The claim it supports ("an agent has no feedback at all on the nine that matter
  most") is true and provable by disjointness; over-attributing it to a quote weakens it against a
  reader who checks, and the artifact elsewhere insists on exactly this precision.
- **Corrective direction.** Cite the quote for the items it names and prove the remainder by
  disjointness with the coverage set.

---

### C-15 — `allowed-tools` diverges from the declared family template without acknowledging it

- **Severity:** Low · **Perspective:** Consistency · **Type:** general · **Confidence:** 100
- **Location:** § 4.2.1 (lines 310–324).
- **Observed.** The drafted block is `Read, Grep, Glob, Bash, Write, Edit`. `python/SKILL.md:4` and
  `typescript/SKILL.md:4` are both `Read, Grep, Glob, Bash`. D1 and § 2.6 make the family template the
  shape contract. The stated rationale — "reading and searching the project, writing **skill** and
  application files, and running the harness" — folds maintainer work into the skill's own surface,
  which `skill-writing` P2 explicitly excludes ("`allowed-tools` describes the target skill's work, not
  the tools used to research it") and whose standard is "the smallest surface the skill's own work needs."
- **Corrective direction.** Either match the family (`Read, Grep, Glob, Bash`) or justify `Write, Edit`
  from the skill's own work alone and note the deliberate divergence from `python`/`typescript`.

---

### C-16 — § 8.4's harness file set omits a lockfile and undercounts fixtures

- **Severity:** Low · **Perspective:** Structure · **Type:** general · **Confidence:** 75
- **Location:** § 8.4 (lines 885–896, "Six top-level files plus a `fixtures/` directory"); § 9 CRUD
  summary (lines 949–951, "13 skill files + 6 harness files + a `fixtures/` directory").
- **Observed.** `examples/typescript/` commits `bun.lock`, and `run-examples.sh:37-41` hard-fails
  unless a *local* pinned `tsc` exists ("LOCAL tsc is the contract (never a global tsc): the harness
  pins the skill's TS version via the committed devDep + lockfile"). § 8.4's six files include no lock.
  Separately, § 8.4 requires four mirrored fixtures plus four must-fail fixtures — at least eight files
  — while the CRUD summary counts the directory as one item.
- **Why it matters.** A harness whose TS/electron versions float will produce different `TS2584`/`TS2591`
  behaviour across machines, undermining EL-OB-08. The CRUD undercount understates the create surface a
  planner sizes against.
- **Corrective direction.** Add the lockfile to the file set with the pinning rationale, and give the
  fixture count in the CRUD summary.

---

### C-17 — Two `P<n>` namespaces collide throughout

- **Severity:** Low · **Perspective:** Aesthetics · **Type:** general · **Confidence:** 100
- **Location:** § 3 D1 and § 4.2 ("Procedure P1–P8"); § 6 title ("The P2 router table"); § 4.2.1
  ("`skill-writing/SKILL.md` P2 makes four keys mandatory"); § 9 ("`skill-writing/SKILL.md` P7"); § 4.4
  ("`operation-skill.md` S8/S9/S10"); D4 ("three-axis review at P8").
- **Observed.** `P2` means both "the electron skill's Procedure step 2, the child router" and
  "`skill-writing`'s classification step". `P7` and `P8` collide the same way. `S8–S10` adds a third
  namespace.
- **Why it matters.** Principle 7's anti-pattern list names exactly this — "replace a plain, full term
  with a cryptic abbreviation the reader must expand." Here the same abbreviation expands two ways in
  adjacent paragraphs.
- **Corrective direction.** Qualify every occurrence on first use in each section (`electron P2` vs
  `skill-writing P2`).

---

## Part 3 — Completed checklist, eight perspectives

Resolution semantics: `PASS` / `FAIL:<id>` / `n/a:<property>`. Every row resolved from inspected
evidence.

### Project

| # | Check | Result |
|---|---|---|
| PR-1 | Problem, trigger, and root cause stated and evidenced | PASS — § 1.1–1.3; the "no owner" claim reproduced by live `grep` |
| PR-2 | Intended outcome stated as an observable | PASS — § 1.4 |
| PR-3 | Every success signal maps to an obligation or a deferral | **FAIL:C-07** |
| PR-4 | Falsification signals stated and able to fire | PASS — § 1.6; all four are observable |
| PR-5 | The strongest do-nothing case is stated and rebutted at its real price | PASS — § 1.7, honest about the iteration-1 overstatement |
| PR-6 | Scope contract has explicit in / out with named owners | PASS — § 2.2, § 2.3; ten out-of-scope rows each name an owner |
| PR-7 | Every deferral has a destination or an explicit drop | PASS — § 2.4, eight rows, each dispositioned |
| PR-8 | Locked decisions applied, not relitigated | PASS — D1–D6 applied coherently; L-3 corrects a mis-attribution to D6 without touching D6 |
| PR-9 | Principle 5 boundary respected (no out-of-contract edits) | PASS — three refusals recorded and verified untouched (`typescript` harness, `web/SKILL.md`, `coding/review.md` columns) |
| PR-10 | Principle 10 respected (no in-scope work deferred) | PASS — § 12 preamble decides the `tsx` marker and linkage semantics rather than deferring them |
| PR-11 | The 20-item security scope is correctly partitioned | **FAIL:C-01** |

**Project result: REVISE.**

### Structure

| # | Check | Result |
|---|---|---|
| ST-1 | File set is flat, one hop, 13 files, matching D6 | PASS — § 4.3 + § 4.4 = 9 + 3 + `SKILL.md` = 13 |
| ST-2 | Every file has a distinct Owns list with no double-homed lookup table | PASS — § 4.3 declared sole ownership authority; EL-OB-23 enforces |
| ST-3 | Seam conflicts resolved by a named owner | PASS — § 6 design notes 1–3 resolve security/ipc, load path, and fuses |
| ST-4 | `SKILL.md` conforms to the operation shape and the family template | **FAIL:C-06** |
| ST-5 | Budgets are internally consistent and arithmetically sound | PASS — children 2,320–2,890 + `SKILL.md` 460–540 + triad 500–630 = 3,280–4,060; the "~15% over `typescript`" claim computes (4,060/3,523 = 1.152) |
| ST-6 | Budgets are realistic against the measured precedent | PASS with reservation — `security.md` at 340–420 and `ipc.md` at 380–460 are tight against content lists longer than any `python` child; R-3 discloses this and § 4.1 makes budgets floors, so the risk is stated rather than hidden. C-01 and C-03 both add content to `security.md` |
| ST-7 | The harness file set is complete | **FAIL:C-16** |
| ST-8 | Open questions do not reshape committed structure | **FAIL:C-09** |
| ST-9 | The triad is authored last, in scenario→checklist→evaluation order, via the owning skills | PASS — § 4.4, citing `operation-skill.md` S8/S9/S10 at lines 113/123/133 |

**Structure result: REVISE.**

### Performance

| # | Check | Result |
|---|---|---|
| PF-1 | Cold-load cost bounded and stated | PASS — § 4.2 defines the floor and a containment rule for growth |
| PF-2 | Maintenance cost stated honestly | PASS — § 7's "true cost of a rotation" replaces the iteration-1 "two places" with two edits plus an eight-file re-verification pass, and § 1.7 is restated at that price |
| PF-3 | Rotation cadence bounded and schedulable | PASS — 8-week cadence verified against `schedule.json`; the derivation rule (next `stableDate`) removes the expiring-date failure |
| PF-4 | Verification-instrument cost measured, not assumed | PASS — § 8.1a: 1.08 s install, 1.2 MB, no binary; independently corroborated by me against the npm registry (no `scripts` key, unpacked 1,142,726 B) |
| PF-5 | No unbounded or runaway cost introduced | PASS |
| PF-6 | Router keeps per-decision read cost to one child | PASS — § 6 plus the seven-task completeness test |

**Performance result: PASS.**

### Aesthetics

| # | Check | Result |
|---|---|---|
| AE-1 | Tables used where content is a lookup | PASS — § 2.3, § 4.3, § 7, § 9, § 10, § 11 |
| AE-2 | Naming accurate and self-evident | PASS — file names map to their forks without a legend |
| AE-3 | Written plainly and literally (Principle 7) | PASS in the design sections |
| AE-4 | No abbreviation expanding two ways | **FAIL:C-17** |
| AE-5 | Content proportionate to the stated consumer | **FAIL:C-12** |
| AE-6 | Provenance caveats co-located with their recommendation | PASS — § 4.5 item 5 makes this a per-child obligation and § 5.3 checks it for all eight soft rules |

**Aesthetics result: REVISE.**

### Usage

| # | Check | Result |
|---|---|---|
| US-1 | A fresh planner can decompose from this file alone | PASS with reservation — the file set, ownership, obligations, and order hints are all present; the guessing points are C-08 (the sync command), C-09 (the OQ-1 fallback), and C-12 (unresolvable `H-n`/`F-nn` Source citations) |
| US-2 | Each per-file content obligation is specific enough to write against | Mostly PASS — the nine Owns lists are unusually concrete. Two divergence points: the security partition's bucket membership for items 1, 3, 4, 7, 10, 11 (**FAIL:C-01**) and `SKILL.md`'s "7–8 Principles", which two executors will fill differently |
| US-3 | Every check a reader must run is runnable as written | **FAIL:C-08** |
| US-4 | No check fails on compliant content | **FAIL:C-05** |
| US-5 | The eventual skill-loading agent gets the mechanism, not only the property | **FAIL:C-02** — the navigation control teaches the comparison and omits the hook |
| US-6 | Version-sensitive facts are qualified so a reader can judge staleness | PASS — EL-R-14/EL-R-15 split behavior claims from doc-state claims; the seven-member stamped register is the right idea and correctly populated |
| US-7 | The reader is told where guidance is derived rather than vendor-stated | **FAIL:C-11** (one omission in an otherwise complete register) |
| US-8 | Open questions genuinely deferrable | PASS for OQ-2/3/5/6; **FAIL:C-09** for OQ-1; OQ-4 is a real user decision correctly routed |

**Usage result: REVISE.**

### Consistency

| # | Check | Result |
|---|---|---|
| CO-1 | Every in-repo line number and count reproduces | PASS — 20 of 20 verified (Part 1a) |
| CO-2 | Every cited Electron primary source contains what is attributed to it | **FAIL:C-03** (the `webPreferences` table), **FAIL:C-14** (the "currently missing" scope) |
| CO-3 | Stamped doc-state claims lead a re-verifier to the right answer | **FAIL:C-04** |
| CO-4 | Internal arithmetic closes | **FAIL:C-13**; budgets and file counts otherwise close exactly |
| CO-5 | Defeaters conform to § 5.0's own definition | **FAIL:C-10** |
| CO-6 | Frontmatter matches the family template and `skill-writing` P2 | **FAIL:C-15** on `allowed-tools`; key set and order otherwise correct, and the omit-both-invocation-keys decision is right |
| CO-7 | Cross-section references resolve | PASS internally; **FAIL:C-12** for the finding-ID citations |
| CO-8 | The derived-claim register is complete | **FAIL:C-11** |
| CO-9 | Evidence tiers stated and not silently promoted | PASS — § 13's tier column is honest, and § 7 point 6 requires the tier to reach References |
| CO-10 | `point-dont-restate-workflow-docs` applied correctly | PASS — EL-OB-03 correctly reads that rule's own § When NOT to apply as scoping it to `workflow/steps/*.md`, and repoints to `skill-writing` § Principles. Verified against the rule text |

**Consistency result: REVISE.**

### Risk

| # | Check | Result |
|---|---|---|
| RI-1 | Security guidance fails safe where it is wrong or incomplete | **FAIL:C-01** — item 7 labelled already-correct-by-default fails unsafe |
| RI-2 | Each of the nine code-only items is complete enough to implement correctly | **FAIL:C-02** for item 13; PASS for #17 (EL-R-09 is the artifact's best work), #14, #20 |
| RI-3 | The closed-property rules are actually closed | **FAIL:C-03** — EL-R-03's check covers 12 of 44 keys |
| RI-4 | Derived security rules are marked and routed to a user decision | **FAIL:C-11** for the permission pair; PASS for the three in OQ-4 |
| RI-5 | Version decay is bounded and detectable | PASS — the qualifier/stamp split plus the derivation rule for the rotation date; a past rotation date is a stated review failure |
| RI-6 | A stale lookup table cannot read as an authoritative negative | PASS — `migration.md`'s coverage ceiling and freshness stamp (EL-OB-18) directly address the "absence reads as safety" failure. Strong |
| RI-7 | Un-reviewed evidence tiers disclosed and not load-bearing beyond their tier | PASS for EV § 7 (disclosed, and § 5.3's checks force the caveat into the body); **FAIL:C-03** shows a *core*-tier citation that does not hold |
| RI-8 | The unverifiable P7 gate is not reported as satisfied | PASS — R-4 and EL-OB-21 state plainly that P7 is not fully satisfied and name what stays unverified. Exemplary handling |
| RI-9 | Taught commands verified as written | PASS — I re-verified `npx @electron/fuses read --app <path>` against the README; `UNVERIFIED-AGAINST-ARTIFACT` is the correct marker for the untested half |

**Risk result: REVISE.**

### Overall

| # | Check | Result |
|---|---|---|
| OV-1 | Cross-perspective tensions surfaced | PASS — budget vs depth (R-3), copy-vs-share (A-8), scope vs adjacent staleness (OQ-5) are all held open rather than resolved silently |
| OV-2 | The stated root fix actually reaches the root | **PARTIAL — FAIL:C-10.** § 5.0's defeater contract is the right root fix and the § 14.1 sweep is real work. But the sweep re-derived defeaters against the *rules* and not against the *strengthened checks*, so three of the four Highs here (C-01, C-02, C-03) are the same silent-check pattern surviving in rules the sweep touched |
| OV-3 | No mechanism substituted for an outcome contract | PASS — EL-OB-02 and EL-OB-17 both demand produced artifacts, not the existence of a procedure |
| OV-4 | Process-result contradictions absent | PASS — § 14.4 records the one evaluator claim that did not reproduce and correctly changes nothing |
| OV-5 | Preserve list identified | PASS — see Part 4 |
| OV-6 | Unnecessary complexity absent | **FAIL:C-12** |

**Overall result: REVISE.**

---

## Part 4 — Must-preserve list

Remediation must not damage these. Each is verified, not assumed.

1. **§ 8.1's false-pass argument and the `TS2584`/`TS2591` guard signals.** I re-derived the mechanism
   from the tsconfig semantics and it holds. This is the single best idea in the artifact.
2. **EL-R-09's six-part ordered sender rule.** Verified verbatim against
   `breaking-changes.md@v43.2.0:559-586`. The observation that the vendor's item-17 sample *throws* on
   the null outcome and *accepts* the detached outcome is correct against `security.md@v43.2.0:745-780`,
   which I read. Do not compress it back to a null check.
3. **EL-R-05's `.origin`-over-`.host` strengthening**, and its honest framing as deliberately stricter
   than the vendor. Verified: the vendor sample compares `(new URL(frame.url)).host === 'electronjs.org'`.
4. **The EL-R-14 / EL-R-15 split** between version-qualified behavior claims and stamped doc-state and
   absence claims. This is a genuinely original control and the seven-member register is correctly built.
5. **§ 7 point 2's rotation-date derivation rule.** Verified live: `schedule.json` gives 44.0.0 at
   2026-08-25 and 45.0.0 at 2026-10-20. A rule beats a date.
6. **`migration.md`'s coverage ceiling and freshness stamp** (EL-OB-18) — the only defence in the
   artifact against a stale index returning a confident wrong answer.
7. **§ 8.3 delta 2** ("an untagged `ts` fence is a hard error, not a default") and **delta 5**
   (process-keyed prelude/partial linkage, keyless rejected). Both close real silent paths in the
   existing extractor, which I read and confirmed.
8. **R-4 and EL-OB-21's refusal to report P7 as passed.** The honest statement that one of two runtimes
   is proven and Codex-class mirror-topology defects remain unverified is the right handling of the waiver.
9. **The three Principle-5 refusals** — the `typescript` harness, `web/SKILL.md`, and `coding/review.md`'s
   illustration columns all left untouched. I verified all three are unmodified.
10. **§ 13's provenance tiering** and § 7 point 6's requirement that the tier, not just the version,
    reaches References.
11. **The whole in-repo verification discipline of § 8.2, § 8.3, § 9, and § 14.4.** Twenty claims, twenty
    reproductions. Whatever else changes, this standard should be the floor for iteration 3.

---

## Part 5 — Verdict

**Findings:** 17 — **4 High**, **8 Medium**, **5 Low**. No Critical.

**Perspective results:** Project REVISE · Structure REVISE · Performance PASS · Aesthetics REVISE ·
Usage REVISE · Consistency REVISE · Risk REVISE · Overall REVISE.

**Derivation.** No Critical finding at confidence ≥ 75, so the `FAIL` condition does not hold. Four
High findings at confidence 100 (C-01, C-02, C-03, C-04), each verified against a primary source and
each correctable inside Ideation without redesign, so the `REVISE` condition holds.

# VERDICT: REVISE

**Reasoning.** The artifact's method is strong and its self-verification of repository facts is the
best I have audited in this project — twenty line-number and count claims, twenty reproductions. Its
§ 5.0 defeater contract is the right diagnosis of the right root cause. What it did not do is finish
applying that contract to itself. Three of the four High findings are the same pattern the artifact
names as its central defect, surviving in rules the iteration-2 sweep touched: a rule stated as a
closed property with a check that covers a subset (C-03), a security control specified at the layer
where the silent failure is *not* (C-02), and a partition label that is confidently wrong about
whether a control is already handled (C-01). The fourth (C-04) is a verification instruction that,
executed correctly, produces the wrong answer. All four are in security material, which is where a
confident wrong answer costs most.

**Reopen conditions.** Rebind and re-run every perspective if the security partition, EL-R-03's check
surface, EL-R-05's rule text, or the § 7 stamped register changes. C-01, C-02, and C-03 each require
a fresh primary-source read, not an edit to the prose.

**Limitations of this evaluation.** No dual-system cross-review of my own findings exists (Codex
waived). I did not read `evaluation/iteration-1/` by instruction, so overlap with the prior reports is
unknown to me and any of my findings may duplicate one already dispositioned. I did not build the
harness or run `tsc`, so § 8.1a's 13-typings-error measurement and the `skipLibCheck` conclusion are
unverified by me — I corroborated only the package facts they rest on. I spot-checked eight
Electron claim clusters, not all of them.
