# Perspective 7 — Witness / Principle 10
**Evaluator**: claude (iter2)
**Phase**: ideation
**Artifact**: draft-iter2.md — Bundle C foundation follow-ups

## Artifact Summary + Memory reads

(Same artifact summary as p1-project.md; see that file. Memory reads identical.)

---

## Locked Frame (Stage 1)

This perspective applies Principle 10 (NO CHANGE WITHOUT A REAL MOTIVATOR) to every deliverable. Each CL must cite a witness — a session, error, user request, mistake, or follow-up. Speculation ("while we're here," "for consistency," "preemptively") fails this perspective.

**Scenario A — CL-1 (close f-struct-01 inline) has a real witness**
- [YES] Witness: `.claude/hooks/session-start.sh:73-77` (`printf 'export %s=%q\n'` passthrough re-export) already implements the backlog's Option A. Commit `159eb21`, env-var-audit PR #265, merged 2026-05-22.
- [YES] Verified: read `session-start.sh` lines 73-77; the `printf 'export %s=%q\n'` pattern is present exactly as described.
- [YES] The backlog file `f-struct-01-jq-sh-env-passthrough.md` has `status: open` and specifically recommends Option A (`printf '%q'`). The shipped code uses exactly that pattern.
- Witness quality: STRONG — empirical code match with named commit and line range.

**Scenario B — CL-2 (gobbi-hook-authoring skill) has a real witness**
- [YES] Witness: N=2 hook witnesses — `.claude/hooks/session-start.sh` (79 lines, commit `159eb21`) + `.claude/hooks/post-tool-use-agents.sh` (251 lines, commit `dfb7d6d`).
- [YES] Verified: both files exist; line counts confirmed (79 + 251 via `wc -l`); both commits exist in git log.
- [YES] Backlog `gobbi-hook-authoring-skill.md` § "When to pick up" explicitly sets "T3 ships AND `post-tool-use-agents.sh` is exercised by ≥1 real session" as the trigger. T3 shipped in dfb7d6d. The hook is registered in `.claude/settings.json` (cited in iter1 evidence load); it fires on every Agent/Task tool call including this session's delegation.
- Witness quality: STRONG — N=2 empirical witnesses with named commits.

**Scenario C — CL-3 (mistake/SKILL.md hooks-domain edit + backlog update) has a real witness**
- [YES] Witness: `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` § "Suggested approach" tail bullet: "Add a `hooks` domain tag convention to `mistake/SKILL.md`."
- [YES] Backlog file exists (verified via filesystem read) and contains the cited suggestion.
- [YES] iter1 DL-3 carryover is confirmed (Decisions Log entry).
- Witness quality: ADEQUATE — the backlog file itself is the witness (an explicit prior-session decision to add this domain tag).
- [PARTIAL] The "perpetual-capture-reminder semantics" clarification in the backlog status update is not strictly witnessbound — it clarifies existing semantics rather than introducing new behavior. This is acceptable because the backlog file's current text is ambiguous (it says "ad-hoc per execution session" without specifying whether this means "perpetual reminder" or "will be closed eventually"), and clarifying ambiguous semantics is within scope of CL-3's backlog status update.

**Scenario D — CL-4 (Theme β design doc) has a real witness**
- [YES] Witness: backlog file `session-lifecycle-worktree-boundaries-design-doc.md` § "When to pick up" — "After T1 ships AND N=2 sessions have exercised the worktree-first pattern end-to-end". T1 shipped at `dfb7d6d`. User locked DL-1 = β-1 (this session self-counts as N=2).
- [YES] DL-1 lock is the user's explicit authorization — per Principle 10, a user request IS a valid witness.
- [YES] The pre-recorded rationale in S-8 (DL-1 accepted shallow trade-off) is witness-bound: it traces to the user's AskUserQuestion answer.
- Witness quality: STRONG — user authorization (DL-1) is a real motivator even though the backlog's "After N=2" trigger is partially stretched.

**Scenario E — CL-5 (f-risk-01 M2 docs sweep) has a real witness**
- [YES] Witness: `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` — the backlog exists and describes the risk. Verified: read in full; `status: open`; describes the subagent-UUID failure mode.
- [YES] User authorization DL-4 (absorb into Bundle C) + DL-5 (M2 chosen).
- [YES] I-6 (de-facto delegation-prompt passing already in practice) grounds the claim that M2 is a codification, not new behavior.
- [PARTIAL] I-6's evidence is "this iter2 leader's own delegation prompt header" + "the iter1 leader's prompt (per session.json workflow.ideation.iterations[0])". The second reference requires reading session.json's workflow object, which is manager-owned and evaluator-forbidden per the Three-Tier Memory Access Matrix. This evaluator cannot independently verify the iter1 leader's prompt header contained parent-anchored paths without reading session.json. The claim is plausible (delegation prompts in this session clearly use parent session-id, as the task brief I received demonstrates), but the I-6 evidence citation is partially unverifiable by evaluators.
- Witness quality: ADEQUATE — user authorization DL-4+DL-5 is strong; I-6's supporting evidence is partially self-referential.

**Scenario F — No "while we're here" / "for consistency" / "preemptively" speculative items (adversarial)**
- [YES] All Out-of-Scope entries have explicit Iron Law 10 rationale:
  - "Additional backlog items (e.g., normalize-path-conventions-h3, item-1-2-broader-delegation-contract-verifier) — none has a fired trigger; Iron Law 10."
  - CL-3 explicitly limits to "smallest concrete change the witness supports" (no speculative watchlist).
  - CL-2's "Mistakes / anti-rationalizations section stays sparse (zero hooks-domain mistakes exist)" — correctly witness-bounded.
- [YES] The Risk Delta explicitly calls out R-6 (context overflow mitigation: "avoid bundling additional backlog items").
- [YES] The Deferred section lists items NOT absorbed because they lack fired triggers (normalize-path-conventions-h3, item-1-2 broader delegation contract verifier).

**Scenario G — M2 absorption (DL-4 override of iter1 deferral recommendation): real user motivator vs. scope creep (adversarial)**
- [YES] The user's DL-4 lock came from an explicit AskUserQuestion round. The user challenge follow-up ("USER CHALLENGE follow-up on Q4") is documented in the task brief. This is a user request — the strongest Principle 10 witness.
- [YES] The Risk section's "Counterfactual / steel-man" acknowledges that iter1's steel-man warned against over-bundling and was overridden by user authority (Iron Law 9). The override is documented with rationale, not rationalized.

---

## Per-scenario per-check results

All 5 CLs have real witnesses. No speculative items found. The only partial: I-6 for CL-5 has an unverifiable component (session.json workflow object), but the witness is adequately grounded by the more verifiable DL-4/DL-5 user authorizations.

---

## Typed findings

### W7-001 — I-6 evidence ("iter1 leader's prompt" component) is not independently verifiable by evaluators

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: § Research Insights I-6: "Cross-check: the iter1 leader's prompt (per session.json `workflow.ideation.iterations[0]` in session memory) also used parent-anchored paths in its `ARTIFACT:` line." Per `evaluation/SKILL.md` Three-Tier Memory Access Matrix: `session.json` is FORBIDDEN to evaluators. This evaluator cannot verify the iter1 leader's prompt header. The claim is plausible (the current session's delegation prompt clearly demonstrates parent-session-id passing) but the specific I-6 citation to session.json is unverifiable.
- **Why it matters**: I-6 is support evidence for CL-5's claim that M2 "codifies current de-facto practice" (not a new requirement). If I-6 is wrong, CL-5 is still warranted by the documented risk (backlog f-risk-01) and by user authorization (DL-4+DL-5). So the witness case for CL-5 is not undermined — I-6 is supporting evidence, not the primary witness. Low severity.
- **Suggested direction**: Note in the Ideation artifact that I-6's iter1-prompt component is informal evidence (pattern matching from the current session's delegation prompt header), not formally verifiable. The primary witness for CL-5 is the f-risk-01 backlog + DL-4/DL-5 user locks, not I-6. Clarify I-6's role as corroborating evidence, not primary grounding.

---

## Per-perspective verdict

**PASS** — One Low finding (W7-001) at Confidence 50. All 5 CLs have real, adequately-grounded witnesses. No speculative items detected. No "while we're here" scope expansions. The user's DL-1..DL-5 authorizations are themselves strong Principle 10 witnesses for the user-divergent choices.

---

## Low-confidence appendix

- W7-001 (Confidence 50, Low): I-6 iter1 prompt reference is unverifiable by evaluators — low impact since the primary witness for CL-5 is the backlog + user locks, not I-6.
