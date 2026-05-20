# Per-file sweep before commit during docs-cleanup batches

When a docs-cleanup plan lists specific line numbers for a file (e.g., `gobbi/SKILL.md:11,131,145`), executors treat the list as exhaustive. The plan's line numbers reflect what the planner found in a single grep snapshot — but a file with one drift pattern often has more occurrences the planner missed.

---

priority: high
tech-stack: docs, rg
enforcement: advisory
---

**Priority:** High

**What happened:** Wave A.2 (PR #151) plan listed `gobbi/SKILL.md:11,131,145` as the lines containing 5-step / `.gobbi/sessions/{id}/` drift. Executor edited those exact lines and moved on. Post-commit Sweep 4 revealed 3 additional `.gobbi/sessions/` hits at lines 23, 53, 87 of the same file plus 1 in `v050-cli.md`. Caught in Commit E (`fd4eeeb`) — but only because the executor ran the full sweep BEFORE handing back. If the sweep had been deferred to evaluation, the drift would have shipped to PR.

**User feedback:** Surfaced in Wave A.2 Project execution evaluation as F-7 (medium severity); promoted to gotcha during memorization.

**Correct approach:**

1. **Plan instruction:** When listing line numbers in a docs-cleanup plan, append "fix all hits in this file" to make the line numbers descriptive, not exhaustive. Example: *"`gobbi/SKILL.md` lines 11, 131, 145 — fix all hits matching `5[- ]?step|five[- ]?step|\\.gobbi/sessions/`."*

2. **Executor instruction:** Before each commit in a multi-commit docs cleanup, run the relevant sweeps **per-file** for files touched in that commit, not only at the end of the wave. The pattern that worked:

   ```
   # Per-file pre-commit gate (run after editing, before `git add`):
   rg -n '<drift-pattern>' <file-just-edited>
   # If hits > expected: fix them in this commit, not the next one.
   ```

3. **Evaluator instruction:** When reviewing a docs-cleanup commit series, run the verification sweeps independently — never trust the executor's verification.md without re-running.

**Refs:** Wave A.2 PR #151, fixup commit `fd4eeeb`, Project F-7 (eval at `.gobbi/projects/gobbi/sessions/dbaf6f5f-403c-4645-b7c3-8962dc16c2d5/execution/evaluation/project.md`).
