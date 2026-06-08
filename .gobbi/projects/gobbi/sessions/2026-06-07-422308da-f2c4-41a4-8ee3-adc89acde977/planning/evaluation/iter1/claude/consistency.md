# Planning Eval — Consistency perspective (claude, iter1)

## Artifact Summary + Memory reads
- Lens: do task hand-offs match, fields mutually agree, plan trace back to Idea coherently?
- Memory: `cotouch-enumeration-must-cover-semantic-equivalents.md` — contradiction is semantic, not a string match; an enumeration scoped to one phrasing leaves survivors that override the redesign.

## Locked Frame (Stage 1)
- S1 Each inputs: literally name-matches an upstream outputs:.
- S2 Each traces-to: points to a real Idea item.
- S3 Task field schema uniform.
- S4 Tooling/path conventions consistent.
- S5 No task contradicts a sibling's assumption.
- S6 (adversarial) a task implicitly relies on a later task's shape.

## Per-scenario per-check results
- S1 PASS. outputs→inputs chain verified verbatim (see Usage S4). No paraphrased handoffs.
- S2 PASS. traces-to entries resolve to real Idea sections/decisions (Design File 1/2/3, Problems 1/2/3, D4/D5/D8, Cross-file risks, checklist 6-8, readiness C1).
- S3 PASS. Uniform task field set across all four tasks.
- S4 PASS. Path conventions consistent: canonical `.gobbi/...` for skills, `.claude/CLAUDE.md` direct, repo-relative throughout. C1 split-anchor encoded consistently (T1 verifies(c), T4 verifies(c), Cross-file #3).
- S5 PASS. No sibling contradiction. T1 explicitly does NOT rename headers (verifies(f)) so T2's citations stay valid — the central cross-file invariant is held. C1 split-anchor: T4 verifies "chat-mode.md silent on Stuck/Regression → Chat branch cites evaluation.md behavior, only Iteration-Caps Chat branch may cite chat-mode.md." I verified live: chat-mode.md has zero Stuck/Regression hits (one "silent regression" in unrelated settings prose, line 564) and DOES have budget-exhausted/escalate at lines 154/237. The split-anchor is correctly encoded — strong drift guard. The adversarial risk the task brief flagged (C1 mis-encoded to cite chat-mode.md for Stuck/Regression) is NOT present.
- S6 SEMANTIC GAP (adversarial). The Plan's T4 consistency task verifies that the NAMED escalation sections were mode-split and that named cross-refs resolve, but it does not sweep evaluation.md for OTHER mode-agnostic mid-loop AskUserQuestion sites. Live grep finds at least three unclassified mid-loop escalations the Idea's 3+3 table omits: line 109 (same symptom + different root causes → "Flag for user resolution via AskUserQuestion before DISCUSSION re-entry"), line 137 (any FAIL → escalate to user), line 197 (cost-budget → surface to user). This is the cotouch-enumeration pattern: the enumeration is scoped to specifically-named sections; semantically-equivalent "ask the user mid-loop" sites survive unaddressed. See finding C-1.

## Typed findings

### C-1
- Type: checklist_gap
- Domain: docs-sync
- Disposition: open
- Confidence: 75
- Severity: Medium
- Evidence: Plan T4 verifies (draft lines 133-139) check named sections only. Live `grep -niE "escalate|ask.*user|askuserquestion|...|surface.*to.*user"` on evaluation.md returns mid-loop user-interrupt rows at lines 109, 137, 197 in addition to the 3 mode-split + 3 safety-gate rows the Idea classified. Line 109 ("same symptom + different root causes → Flag for user resolution via AskUserQuestion before DISCUSSION re-entry") is mid-loop, mode-agnostic, and is the strongest routine-triage-equivalent the Idea's D8 table never names. The `cotouch-enumeration-must-cover-semantic-equivalents` mistake is exactly this failure class.
- Why it matters: the Plan's T4 is the one gate meant to catch cross-file drift and leftover contradictions. By verifying only the named sections, it cannot detect a surviving mode-agnostic escalation that would, in Auto mode, reproduce the very "manager asks the user and idles" behavior the whole Idea targets. Whether line 109/137/197 should be mode-split or kept is a design call owned by the locked Idea (I do not re-open it) — but the Plan had the opportunity to add a semantic-survivor sweep to T4 and did not, so the gap is invisible to Execution.
- Suggested direction: add a T4 sub-check: grep evaluation.md for all `AskUserQuestion`/`escalate to user`/`surface to user` occurrences, list each, and confirm each is either (a) one of the 3 mode-split routine-triage sections, or (b) one of the 3 named safety gates, or (c) explicitly adjudicated by the user as out-of-scope for this Idea. Surface line 109/137/197 for a user classification call. User decides.

## Low-confidence appendix
- The substantive classification of line 109/137/197 (routine-triage vs safety-gate vs out-of-scope) is a design decision for the user/leader, not the evaluator. My confidence that the Plan adds NO sweep to catch them: 100. My confidence they SHOULD be mode-split: 25 (out of my scope to decide).
