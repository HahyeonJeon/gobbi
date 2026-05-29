# Usage Perspective — chat-mode.md (T1, iter1)

**Verdict:** PASS

**Scope:** Can a fresh manager / executor / evaluator agent USE this doc to actually run a Chat-Mode session? Walk-through tests for each likely consumer.

## Consumer #1 — A fresh manager handed "Chat" at Configuration

Question stack the manager must answer from this doc:
1. **"What does Chat dispatch?"** → §2 L34 ("The user types one task at a time; the manager runs a full per-task slice and returns to the user."). Answered. ✓
2. **"What's the loop shape per slice?"** → §3 diagram L61-L120. Answered with explicit Step 2 / 3 / 4 / 5 + boundary + gate. ✓
3. **"What gates appear, and to whom?"** → §5 L188-L190 (three mode-specific gates within a loop) + §3 diagram USER REVIEW GATE at end. Answered. ✓
4. **"What's the iteration cap?"** → §5 L191-L193: 2 for Ideation / Planning / Execution; §9 confirms via settings table. Answered. ✓
5. **"When does Wrap-up trigger?"** → §7 L309-L320: three explicit user signals; manager does NOT auto-trigger. Answered. ✓
6. **"What artifact must the manager verify at the user-review gate?"** → §6.4 L296-L297: manager verifies presence of task-record before presenting AskUserQuestion. Answered. ✓

The manager has the operational protocol needed to run a Chat session.

## Consumer #2 — A MEMORIZATION assistant in a per-task loop

1. **"Do I write the full memorization typed-finding staging, or a narrowed subset?"** → §4 four-bullet skeleton: preserve Steps 5 + 8 (+ every-iter Steps 2 + 3); skip Steps 6 + 7. Answered explicitly. ✓
2. **"Do I still write mistake-candidates moment-of-capture?"** → §4 third bullet L151-L157 + §5 L202-L206: YES, this is the exception. Answered. ✓
3. **"On execution-loop PASS, do I write the task-record?"** → §6.4 L291-L297: yes, on PASS of the last sub-step. Answered. ✓

## Consumer #3 — A wrap-up assistant consolidating chat output

1. **"What sources must I mine?"** → §4 trailing paragraph L163-L170 lists (a) transcript, (b) every `chat/tasks/*/task-record.md`, (c) reconstruct typed findings from per-loop evaluation files. Answered. ✓
2. **"Can I reclassify task-record body narrative into project notes/?"** → §6.5 L302-L304 yes, per the `prose-reclassification-target-is-project-level-notes` mistake. Answered. ✓
3. **"Wrap-up runs once, when?"** → §7 L309-L320 explicit user signals. Answered. ✓

## Consumer #4 — A status-display renderer

1. **"Where's the data source?"** → §8.1 L343 ("backed by `state.json.workflow.chat.tasks[currentIndex]`"). Answered. ✓
2. **"What format?"** → §8.1 header form L347-L349 + body form (top tier + per-task tier tables) L356-L373. Answered. ✓
3. **"How are completed prior tasks shown?"** → §8.3 L420-L422 worked example shows "Completed tasks" section with one-line-per-task summary. The literal format is shown by example, not by formal spec (Low severity gap, see findings).
4. **"How does the per-task sub-table show in-progress vs done?"** → §8.3 example rows L425-L428: state column ("✓ Done" / "▸ InProgress" / "⊘ Skipped"), iter column, verdict column. Answered. ✓

## Consumer #5 — A planner deciding the task-record frontmatter type

§6.2 L251-L266: explicit deferral with two options labelled (a) and (b), with a default-while-deferred recommendation. A planner has actionable guidance: pick one of the two options, or carry the default. ✓

## Consumer #6 — A test author writing per-task lifecycle assertions

§8.2 18-row state-transition table — every transition has guard / event / target. A test author can derive 18 unit-test cases from this table directly. ✓

## Findings

**No findings above Low severity.**

Low / observational:
- §8.3 worked example renders "Completed tasks" rows by example only — no formal "Completed tasks" sub-table spec. A renderer implementer could be ambiguous about column count / collapsed format. Confidence: 50. Severity: Low. Type: `checklist_gap`. Domain: `docs-sync`.
- §6.2 default recommendation L264-L266 ("agents authoring a task-record should use the `artifacts/` frontmatter schema as a default") — this gives concrete usage guidance but might silently lock in option (a) before Planning explicitly chooses. A planner reading this could either (a) ratify the default or (b) reject and pick option (b) — the deferral is preserved but the prose tilts toward (a). Confidence: 50. Severity: Low. Type: `assumption_risk`. Domain: `process`.
- §7 L317 mentions `/gobbi wrap-up` "if such a command exists; otherwise the message form above" — this conditional is operationally fine but could leave a user / agent uncertain in the moment. The fallback ("message form") resolves the ambiguity. Confidence: 25. Severity: Low.
- §5 L186-L187 cites `discuss.mode` settings as "still resolve to `user` everywhere in the Chat defaults" — accurate per §9, but if a user manually flips a discuss.mode field, the §10 "mode-level contract still forces user-driven DISCUSSION" lock kicks in. A user reading just §5 might miss the §10 reinforcement. Mitigated by §10 itself being prominent. Confidence: 25. Severity: Low.

## Must-preserve list

- §6.4 "manager verifies presence of the task-record at the user review gate" — this is the operational atom that makes the gate work; do not soften to "may verify".
- §7 explicit list of three user signals + the explicit NOT-auto-trigger triplet (no auto on "no more tasks", idle, N tasks). The negative list is the discipline.
- §4 trailing paragraph (wrap-up's input under narrowed staging) — without this, the wrap-up assistant doesn't know what to do.
- §8.1 backing-data citation (state.json path) — this is what makes the status display deterministic.
- §10 mode-level discuss-first contract as a regression-prevention measure — without it, a settings flip would silently regress.

## Overall verdict

**PASS.** Every consumer of this doc (manager, MEMORIZATION assistant, wrap-up assistant, status renderer, planner, test author) finds actionable guidance for their decisions. No critical operational gaps.
