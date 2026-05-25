# Perspective 6 — User Perspective
**Evaluator**: claude (iter2)
**Phase**: ideation
**Artifact**: draft-iter2.md — Bundle C foundation follow-ups

## Artifact Summary + Memory reads

(Same artifact summary as p1-project.md; see that file. Memory reads identical.)

---

## Locked Frame (Stage 1)

**Scenario A — User can cleanly answer "what ships, why, in what order"**
- [YES] TL;DR gives a numbered list of exactly 5 deliverables with one-sentence each. Order: CL-1 (smallest, first; "sequenced first because it gates nothing else"), CL-2 (skill stage+promote), CL-3 (mistake/SKILL.md edit + backlog update), CL-4 (design doc), CL-5 (12-skill sweep).
- [YES] The "Why now?" is visible from the TL;DR: "Bundle B deferred follow-up artifacts; triggers have fired."
- [YES] Decisions Locked table maps each DL to its CL and rationale in user-legible language.

**Scenario B — The 5 deliverables are understandable from the user's POV (not just the implementer's)**
- [YES] CL-1: "3-line frontmatter edit" — user-legible; clearly smallest; no implementation needed.
- [YES] CL-2: "Stage + promote gobbi-hook-authoring project skill" — user-legible; explains what a "project skill" is implicitly via the backlog reference.
- [YES] CL-3: "Hooks-domain mistakes resolution" — user-legible; describes both the skill edit and backlog update in one sentence.
- [YES] CL-4: "Theme β design doc" — user-legible; the DL-1 trade-off (shallow lessons) is visible to the user in TL;DR item 4.
- [YES] CL-5: "f-risk-01 M2 docs sweep across 12 skills" — partially legible. A user who does not know what "M2" or "f-risk-01" means must follow the reference chain: "f-risk-01" → backlog file → § "Candidate mitigations" → M2 definition. The DL-5 cell in the Decisions Locked table is the most self-contained explanation, and it is 3 sentences. Accessible but denser than CL-1..CL-4.

**Scenario C — User can tell what is NOT shipping (boundary is visible)**
- [YES] Out-of-Scope list is explicit: M1/M3 not chosen, 3rd hook not implemented, f-risk-01 backlog not closed (stays as alternatives-considered record), Theme β re-litigation closed, T1.h smoke-test deferred.
- [YES] Deferred (recap) section lists exactly what is not shipping and where each deferred item lives.

**Scenario D — Failure modes communicated**
- [YES] S-4 (scope-drift), S-5 (scope-drift), S-6 (M2 mis-application), S-7 (witness staleness challenge), S-8 (DL-1 shallow-lessons challenge) are all user-visible failure scenarios.
- [PARTIAL] S-8 says the pre-recorded justification will be "searchable" in the commit message. Users typically do not search commit messages. See R5-001 finding — the rationale should be in the design doc body, not only in the commit tag.

**Scenario E — User can verify their answers were captured correctly**
- [YES] Decisions Locked table (§ post-AUQ) reproduces the user's verbatim answers ("Locked answer" column).
- [YES] The delta from iter1 is explicit in each DL row ("iter1 leader recommendation" column + "User diverged" notes).

**Scenario F — Accessibility / I18n** (Coverage Matrix: Usage)
- [YES] This is a documentation/skill authoring session, not a UI or user-facing string session. Accessibility and I18n are not applicable to Bundle C's deliverables.
- Marking: `not-applicable: Bundle C deliverables are all internal project documentation and skill files; no user-facing surfaces, UI components, or user-visible strings are introduced or modified.`

**Scenario G — Observability / "diagnosable at 3am"** (Coverage Matrix: Structure + Usage)
- [PARTIAL] The deliverables are documentation; there is no runtime observability concern. However, CL-5 (12-skill sweep) represents a documentation change that is "observable" in the sense that a future agent following the updated skills will emit correct paths instead of wrong ones. The correctness of this documentation change is verified by SC-5 (grep checks). No runtime alerting or log monitoring is needed — but the diagnosability of the *problem* being solved (subagent using wrong session-id) is not addressed beyond documentation. The backlog file notes "operational risk is low given current delegation-prompt practice" — this is the observability baseline.
- Marking: `not-applicable: no runtime-observable surfaces introduced; verification is grep-based (SC-5).`

**Scenario H — A consumer reads the artifact and forms the wrong mental model (adversarial)**
- [PARTIAL] The TL;DR says "Bundle C is materially larger than iter1's recommendation." A user reading only the TL;DR might conclude the bundle is dangerously oversized. The Risk Delta section (later in the document) provides the honest quantification. But TL;DR's framing of "materially larger" without immediately stating why this is OK could create a first-impression of risk without the counterpoint visible on the same page.
- [YES] On close reading, the TL;DR does say "Risk section quantifies the size honestly" — so the reader is directed to the Risk Delta. The framing is candid, not alarmist.

---

## Per-scenario per-check results

The main user-perspective concern: CL-5's failure to surface shallow-lessons rationale in the design doc (R5-001 from Risk perspective) also affects the user perspective — a future user reading the design doc will have no inline context. This is already captured in R5-001.

---

## Typed findings

### U6-001 — CL-5 description requires f-risk-01 + M2 background knowledge to parse in TL;DR

- **Type**: `checklist_gap`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: TL;DR item 5: "CL-5 — f-risk-01 M2 docs sweep across 12 skills." This label is opaque to a user who hasn't read the f-risk-01 backlog or knows what "M2" means. The DL-5 row in the Decisions Locked table (3 sentences) is the best inline explanation, but it is in a different section. For a user scanning the TL;DR to understand what ships, CL-5 is the least self-explanatory of the 5 items.
- **Why it matters**: Minor usability gap. A user approving this bundle from the TL;DR alone may not fully understand CL-5's scope. The risk is low because the user already approved DL-5 via AskUserQuestion and knows the context, but the artifact should be self-contained for future reference.
- **Suggested direction**: Expand TL;DR item 5 with a parenthetical: "CL-5 — f-risk-01 M2 docs sweep across 12 skills (codify that subagents should read session-id from the delegation prompt, not from $CLAUDE_CODE_SESSION_ID)." This makes the TL;DR item legible without reading the backlog.

---

## Per-perspective verdict

**PASS** — One Low finding (U6-001) at Confidence 50. The user perspective is well-served: TL;DR is clear, Decisions Locked table captures the user's verbatim answers, Out-of-Scope and Deferred sections bound what won't ship. No High or Critical findings.

---

## Low-confidence appendix

- U6-001 (Confidence 50, Low): CL-5 TL;DR opacity — low severity and the user already approved the scope via DL-5. The improvement is cosmetic.
