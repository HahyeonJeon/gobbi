---
artifact_type: per-perspective-evaluation
system: claude
perspective: usage
loop: ideation
iter: 1
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
verdict: PASS
---

# Usage — Claude evaluator iter1

## Artifact Summary + Memory reads

Same as project.md.

## Locked Frame (Stage 1)

**S-U1 — Planner produces a task list without clarifying questions.**
**S-U2 — Executor knows what file / module / function to change.**
**S-U3 — 3am maintainer test.**
**S-U4 — Failure modes the artifact names match implementation behavior.**
**S-U5 (adversarial) — Consumer forms wrong mental model.**
**S-U6 — Coverage Matrix: Observability / "diagnosable at 3am"** (Structure + Usage owners).
**S-U7 — Coverage Matrix: Accessibility / I18n** — `not-applicable: this bundle is internal docs/skill edits with no UI surface`.

## Per-scenario per-check results

- [partial] S-U1: 7 items have Design directions, but Item E's exact text is explicitly open (concern 3); Item D's classification-rule wording is also deferred.
- [yes] S-U2: file paths + line ranges named for each touched skill.
- [partial] S-U3: see F-CLAUDE-U-01 below.
- [yes] S-U4: Step 2.5's two output classes (mechanical/judgment-required) are explicit; Codex hang behavior named.
- [partial] S-U5: see F-CLAUDE-U-02 on the "Decisions Locked" preamble's claim that "user has pre-approved the 7-item scope above via DISCUSSION lock" (Success Criterion #8) — this is true for the *scope* but glosses over the AskUserQuestion-per-edit discipline in `.claude/CLAUDE.md`.
- [yes] S-U6: Step 2.5 gap report written to `rawdata/promotion-manifest.md` — observable. Codex skill says "ASK USER on hang" — observable to user.
- [yes/`not-applicable`] S-U7: no UI / no user-facing strings touched. Recorded as `not-applicable`.

## Typed findings

### F-CLAUDE-U-01 — Item E's deferred-text concern leaves the Planner needing to re-DISCUSS

- **Type**: general
- **Domain**: process
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: Draft Open Concerns §1 explicitly says "Item E's exact text for the new Coverage Ownership Matrix row" is a Planning-phase clarification. The draft itself acknowledges this is a non-blocking gap for ideation evaluation. But the Planner's first task on Item E will be to re-ask the user — exactly what `ideation/evaluation.md § Usage` anti-pattern says is a failure mode of the Ideation artifact.
- **Why it matters**: Planning DISCUSSION will need at least one user-input question to lock Item E text. This is acceptable for one item — but combined with concern #3 (still open) means Planning won't be a clean read.
- **Suggested direction**: in Planning DISCUSSION's first card, surface Item E text as the first decision point. Don't blocker Item E text on the entire bundle.

### F-CLAUDE-U-02 — Success Criterion #8 says "user has pre-approved the 7-item scope ... via DISCUSSION lock" — but `.claude/CLAUDE.md` rule "Never edit gobbi skills without asking the user with AskUserQuestion" is not the same as a scope pre-approval

- **Type**: general
- **Domain**: process
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Medium
- **Evidence**: Draft Success Criterion 8 (line 76): "All edits respect `.claude/CLAUDE.md` 'Never edit gobbi skills without asking the user with AskUserQuestion' — but the user has pre-approved the 7-item scope above via DISCUSSION lock." This conflates two things: (a) scope approval (user said "do these 7"), and (b) per-edit approval (the rule asks for AskUserQuestion **at every edit**, not just at scope time). The current `.claude/CLAUDE.md` I just read does NOT actually contain the literal "Never edit gobbi skills without asking" rule — it does say "Every agent MUST load the `mistake` skill before starting work" and "Iron Laws" but the specific quoted rule is not verifiable in the loaded CLAUDE.md text.
- **Why it matters**: at Execution, the Executor will either (a) pause at every edit for AskUserQuestion (which user did NOT consent to in DISCUSSION), or (b) skip the pause based on Success Criterion 8 — possibly violating an actual rule that exists elsewhere (perhaps in `agents/leader.md` or another rule doc). The draft cites the rule from memory, not from a verifiable path.
- **Suggested direction**: Planning DISCUSSION verifies the exact rule wording and path. If the rule is "AskUserQuestion at scope lock only" → success criterion 8 is correct. If the rule is "AskUserQuestion at every edit" → Execution will need a different shape. (Verification: `grep -rn "AskUserQuestion\|ask the user" /playinganalytics/git/gobbi/.claude/CLAUDE.md /playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/`.)

## Per-perspective verdict: **PASS**

Two `Medium` findings, both `Confidence 50–75`; no `High` ≥ 50.

## Low-confidence appendix

None.
