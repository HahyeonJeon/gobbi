# Usage — Planning iter1 (Claude)

**Verdict:** PASS

## Artifact Summary

- Plan must be actionable by a fresh executor reading only the Plan + the Idea doc (no Plan-leader transcript). Tested by the "3am executor" simulation.

## Frame (Usage)

- **S-U1 Each task's `what:` answers "what file(s) do I edit and to what shape"** without forcing the executor to re-read the Idea doc.
- **S-U2 Verification commands are copy-pasteable** with explicit `<worktree>` markers and clear expected outputs.
- **S-U3 Pre-resolved decisions are surfaced inline per task** — no "see §X of Idea" without restating the decision.
- **S-U4 Required-skills + required-mistakes lists are complete** for the executor's pre-load.
- **S-U5 Out-of-scope files are named** so the executor knows what NOT to touch.

## Per-scenario Findings

- **S-U1 ✓** — Each task's `what:` field names the exact file + the change shape. Example: T1 says "Replace the 598-byte placeholder at orchestration/chat-mode.md with the full Chat-Mode spec per Idea §3 (posture, per-task slice diagram, §3.3 canonical Chat MEMORIZATION statement (R5), §3.4 per-loop discipline, §3.5 task-record artifact spec, §3.6 explicit-end-of-session Wrap-up trigger, plus a §6.3 worked Status-Display example and an F-S2 per-task state-transition table)." Executor sees: exact file, exact shape, exact Idea-doc subsections to consume.
- **S-U2 ✓** — Verification commands include `<worktree>/...` paths with literal sub-paths. Each command has an inline `# expect ...` annotation. Example T1 lines 127-134: `wc -l <worktree>/.../chat-mode.md  # expect ≥ 200`. Executable after substituting `<worktree>` with the absolute path provided in §6.
- **S-U3 ✓** — Each task carries `pre-resolved-decisions:` (T1 lines 112-118; T2 171-177; T3 320-330; T4 222-228; T5 270-273; T6 425-429; T7 379-383). Decisions are restated, not just cited. Example T4 line 224 actually states "Chat: ideation/planning/execution/wrap-up maxIterations = 2/2/2/1; preparation maxIterations = 0" — the executor doesn't need to re-derive from Idea §5 table.
- **S-U4 ✓** — required-skills + required-mistakes are explicit per task and load-ordered (principles first, then mistake, then execution, then domain-specific). T1 lists 7 required skills + 4 mistakes. T3 lists 5 skills + 3 mistakes. T6 lists 4 skills + 0 mistakes (acceptable for a mechanical archive task).
- **S-U5 ✓** — `out-of-scope-files:` blocks: T1 (lines 108-111), T2 (lines 167-170), T3 (lines 314-319), T4 (lines 219-221), T5 (lines 267-269), T6 (lines 423-424), T7 (lines 376-378). The `.claude/skills/orchestration/*` mirror is consistently marked "DO NOT edit" with the symlink rationale.

## New typed findings

- **F-USAGE-1 (Medium · Confidence 50 · `checklist_gap` · `process`)** — T7 line 380 says "Backlog naming per memorization/rules.md §1.3 — subject-descriptive kebab-case". An executor lacking prior context will look up rules.md to find §1.3. Plan does not restate the convention inline (the way other pre-resolved decisions are). An executor at 3am may either: (a) load memorization/rules.md (small cost), or (b) infer from the slug already provided in T7. Slug IS already provided in T7 `files:` (`delegation-skill-md-vs-settings-default-json-model-assignment-drift.md`), so the convention is implicitly demonstrated. Informational. Confidence 50.
- **F-USAGE-2 (Low · Confidence 75 · `general` · `process`)** — Verification commands use `<chat-mode.md>` shorthand inside the `wc -l` and `grep -c` calls (T1 lines 129-132) after first establishing the full `<worktree>/.../chat-mode.md` path on line 128. This is a reader-substitution shorthand. An executor running the commands literally will hit "file not found". Plan §Self-review acknowledges the shorthand explicitly (lines 558). Informational; convention is reasonable but worth a one-line callout. Confidence 75.
- **F-USAGE-3 (Low · Confidence 75 · `checklist_gap` · `process`)** — T1 success-criterion "Front-link to memorization/SKILL.md base + back-link from §3.3 narrowing" (line 126) — describes a cross-link requirement but the Plan-level acceptance test §4 check #4 only asserts `grep -c 'memorization/SKILL.md' chat-mode.md >= 1`, which is the front-link. The "back-link from §3.3 narrowing" is the chat-mode.md text pointing AT memorization/SKILL.md from inside the §3.3 narrowing section — that's the same grep. The "back-link from memorization/SKILL.md → chat-mode.md" is NOT in the Plan (R5 lock keeps memorization/SKILL.md untouched). So the success-criterion's "back-link" phrasing may confuse the executor into thinking they need to edit memorization/SKILL.md (which is explicitly forbidden by R5). Direction: clarify "front-link" vs "back-link" wording is ALL inside chat-mode.md. Confidence 75.

## Verdict & Must-preserve

- **Verdict: PASS.** A 3am executor can act on each task without re-reading the Idea doc. The Plan honors the inline-paste discipline.
- **Must-preserve:**
  - Inline `pre-resolved-decisions:` per task.
  - `<worktree>` markers in verification commands.
  - `out-of-scope-files:` block (especially T1's `memorization/SKILL.md` carve-out which protects R5).
  - The `required-skills:` + `required-mistakes:` lists per task.

## Low-confidence appendix

- F-USAGE-3 hinges on how an executor interprets "back-link from §3.3 narrowing"; my best reading is "the narrowing-section's outbound link to the base memorization skill", but the phrasing is ambiguous. Confidence 75.
