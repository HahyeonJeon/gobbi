# Structure Perspective — Memory-System Redesign (iter1, claude)

## Artifact Summary + Memory reads

(See project.md for full summary — shared across perspectives.)

## Locked Frame (Stage 1)

**S1: Components cohere — each type owns one concern**
- 13 types each have a single-sentence Purpose. Are they non-overlapping?
- Hard boundary ("use-this-not-that") decision rule exists for each adjacent pair.

**S2: The taxonomy decomposition is the right level of granularity**
- Not too fine (1:1 skills = mechanism, not value), not too coarse.
- L3 explicitly keeps 13 types; justification is in the audit's "fuzzy boundaries" finding.

**S3: Type boundaries are truly crisp (adversarial — find the ambiguous case)**
- The decisions/design/notes/learnings cluster: can a reader correctly route any real content?
- The reviews/reports boundary: is the "did someone do a review?" test sharp enough?
- The rules/mistakes/learnings triple: the decision tree is stated; does it work for edge cases?

**S4: 4 extra template types have no §2 spec — gap in structural completeness**
- Templates exist for: discussions, changelogs, scenarios, checklists (17 total, §2 specs only 13).
- These are feature-subdir types that fall outside the 13 project-level types.
- The design mentions this for changelogs (§4.2 note) but not for discussions/scenarios/checklists.

**S5: memorization/rules.md naming vs memorization/templates/rules.md path collision (adversarial)**
- The new `memorization/rules.md` sibling (§4/§7 #4) will live adjacent to `memorization/templates/rules.md` (the existing TYPE template for rules/).
- Same parent dir, similar filename, different purpose.

**S6: Plans naming inconsistency across scopes**
- Feature-level plans: `{date}-{slug}` (memory-map line 90, design §2.10).
- Project-level plans: `{slug}` bare (memory-map line 108).
- Design §4.2 temporal split classifies plans universally as date-prefixed.

**S7: Boring-by-default check**
- Does the design spend innovation tokens appropriately?
- A new Principle (#13), a new rules.md sibling, a new feature taxonomy — each justified?

---

## Per-scenario per-check results

| Scenario | Result | Evidence |
|---|---|---|
| S1: Types cohere, non-overlapping | PASS | Each §2 spec has Purpose + Hard boundary + explicit decision rules |
| S2: Right granularity | PASS | L3 justification in locked decisions; audit confirms taxonomy problems solved |
| S3: Boundary edge-cases (adversarial) | PARTIAL FAIL | See F-STR-01: one reviews/reports case is unclear; rules/mistakes/learnings triple passes |
| S4: 4 extra templates without specs | FAIL | See F-STR-02 |
| S5: memorization/rules.md path collision risk | PARTIAL | See F-STR-03 |
| S6: Plans naming inconsistency | FAIL | See F-STR-04 |
| S7: Innovation tokens appropriate | PASS | P13 and rules.md sibling both have clear motivators; no gratuitous invention |

---

## Typed findings

### F-STR-01 — reviews/reports boundary has one ambiguous case

- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** §2.11 states: "a *post-mortem of a security incident* → reports." §2.12 states the reports boundary "vs reviews: see §2.11." But consider: a "retrospective" (mentioned in §2.11 as a review kind in `review_kind: adversarial|code|audit|retrospective`) — is a Sprint retrospective a review or a report? The decision tree "Did someone *do a review*?" doesn't cleanly answer for retrospectives that produce status-like summaries. The `review_kind` enum includes `retrospective` under reviews, but a meeting-based retrospective that produces a long-form outcome document could equally land in reports. The test depends on whether the human interprets "review activity" broadly or narrowly.
- **Why it matters:** An Executor updating templates or a future Wrap-up agent would make different choices for the same artifact depending on interpretation. The ambiguity will produce drift.
- **Suggested direction:** Add one more sentence to §2.11/2.12 distinguishing retrospective outputs that are activity-records (reviews) from ones that are status-period-summaries (reports). A single example would resolve it.

### F-STR-02 — 4 template types (discussions, changelogs, scenarios, checklists) have no §2 per-type spec

- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Medium
- **Evidence:** `ls memorization/templates/` returns 17 files: the 13 expected (archive, backlogs, decisions, design, feature-readme, learnings, mistakes, notes, plans, references, reports, reviews, rules) + 4 extras: `discussions.md`, `changelogs.md`, `scenarios.md`, `checklists.md`. These 4 exist in feature subdirs (verified `ls features/session-foundations-bundle-b/`) and in session staging dirs (see memory-map). §2 per-type specs only cover 13 types; no spec exists for the 4 extras. §4.2 temporal split table adds a note for changelogs ("not in the original 13-list") but provides no spec. Discussions, scenarios, and checklists are unaddressed.
- **Why it matters:** §7 #8 tasks the Executor with aligning all 17 templates to "the naming section, frontmatter block, and Location/Scope" per the design. But discussions/changelogs/scenarios/checklists have no authoritative spec in §2 to align TO. The Executor will have to guess. Alternatively, the Executor will skip these 4 templates, leaving them misaligned.
- **Suggested direction:** Either (a) add lightweight specs for the 4 types (3-4 fields each — purpose, scope: feature-only, naming rule, frontmatter extensions) as a §2.14-2.17 or appendix section; or (b) explicitly state "these 4 are feature-subdir types only, governed by the feature-subdir rules already in §2.1" and add a one-paragraph note in §2 to that effect. Option (b) is lower lift.

### F-STR-03 — memorization/rules.md sibling creates a path-similarity trap with memorization/templates/rules.md

- **Type:** assumption_risk
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** The design creates a NEW file at `memorization/rules.md` (§4, §7 #4). The existing file at `memorization/templates/rules.md` is the TYPE template for the `rules/` memory type. Both live under `memorization/` with the name `rules.md` (one directly, one in `templates/`). The design adds a disambiguation note in §8 ("NOTE: the template `memorization/templates/rules.md` (a TYPE template) is DISTINCT from the new `memorization/rules.md` sibling (the consolidated memory-rules doc)") but this note is buried in the propagation plan, not in the spec (§4) itself.
- **Why it matters:** Any future executor or agent loading `memorization/rules.md` may confuse it with the template. The disambiguation note exists but only in §7 #8 — not in §4 where the sibling is defined, not in §2.6 where the rules type is defined, not in the new doc's own spec.
- **Suggested direction:** Add the disambiguation note directly to §4 (the home of the new sibling's spec) in addition to the §7 #8 location. Also add it to the new doc's own frontmatter `description` field.

### F-STR-04 — Plans naming rule is inconsistent between feature-level and project-level in memory-map.md

- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Medium
- **Evidence:** `memory-map.md` line 90: `features/{feature-name}/plans/{date}-{slug}.md` (date-prefixed). `memory-map.md` line 108: `plans/{slug}.md` (bare slug, no date). Design §4.2 temporal split classifies "plans" as date-prefixed universally. Design §2.10 says "Date-prefixed." The propagation plan §7 #3 says to update memory-map.md but does not call out this inconsistency as one of the specific fixes.
- **Why it matters:** An Executor editing memory-map.md per §7 #3 will update the archive row and the session.json.lock row, but without a specific instruction to fix plans line 108, the inconsistency will survive the migration. The design claims to establish a unified naming standard but leaves this drift.
- **Suggested direction:** Add an explicit note in §7 #3 or §2.10 that project-level `plans/{slug}.md` in the current memory-map uses bare slug inconsistently with the date-prefix rule, and that the update should standardize to `plans/{date}-{slug}.md` at the project level as well.

---

## Low-confidence appendix

None.

---

## Per-perspective verdict: REVISE

Rationale: F-STR-02 (4 template types without specs) is Medium/100. F-STR-04 (plans naming inconsistency not flagged for fix) is Medium/100. F-STR-01 and F-STR-03 are Medium/75. Multiple Medium/100 findings together with the High from Project perspective confirm REVISE.
