# Codex adversarial evaluation — orchestration settings change

You are an independent adversarial evaluator. DO NOT TRUST the producer's claims. Verify everything yourself by reading files and running commands. Your job is to FIND PROBLEMS, not confirm success. Do not propose or apply fixes — only report findings + a verdict.

## What was changed (the producer's claim — verify, do not trust)

A single commit `9f77f0e` on this worktree branch (`chore/session-2026-06-05-0a9c813f`) edits the gobbi orchestration skill. Locked scope (A–E):

- **A. Evaluator models** in BOTH `skills/orchestration/templates/settings.auto.json` and `settings.chat.json`: `models.claude.evaluator` sonnet→opus; `models.codex.evaluator` gpt-5→gpt-5.5. `models.codex.assistant` must STAY `gpt-5`; `models.claude.executor` must STAY `opus` (untouched).
- **B. maxIterations:** auto — all 5 steps now `5`. chat — ideation/planning/execution/wrap-up `5`; preparation stays `0`.
- **C. New `skip` boolean** on every step in both templates (sibling before `maxIterations`). auto: all `skip:false`. chat: preparation `skip:true` (keeps `maxIterations:0`); all others `skip:false`. Precedence (must be documented): a step is `Skipped` at loop entry when `skip:true` OR `maxIterations:0` — two INDEPENDENT signals; the `maxIterations:0` ("R1 lock") path must be RETAINED (coexists, NOT deleted).
- **D. Doc reconciliation** across `skills/orchestration/SKILL.md`, `chat-mode.md`, `auto-mode.md`: the precedence rule, the `⊘ Skipped` definition, the settings-schema description, the cap-value prose (old "default = 2"/"= 3" → 5), and the wrap-up "runs once" prose. `evaluate.mode: "skip"` is a SEPARATE concept (skips only EVALUATION) and must NOT be conflated with the step-level `skip`.
- **E. Symlink fix:** `.claude/skills/orchestration/templates/settings.default.json` (broken symlink) deleted; new `.claude/` symlinks for `settings.auto.json` + `settings.chat.json` added. Stale `settings.default.json` references in `features/workflow/design/drop-legacy-setup-questions.md` repointed to `settings.auto.json`. `notes/*.md` mentions intentionally LEFT (immutable journals). The drift backlog file intentionally LEFT (out of scope).

The design artifact (authoritative spec) is at:
`.gobbi/projects/gobbi/sessions/2026-06-05-0a9c813f-c83b-48d7-925d-0075ce818d54/ideation/artifacts/orchestration-settings-skip-and-models-design.md`

## How to evaluate

1. Read the diff: `git show 9f77f0e` and/or `git diff develop..HEAD` from this worktree root.
2. Read the design artifact and the changed files in full.
3. Adversarially check across these perspectives (the gobbi 7 + Overall): **project** (every locked A–E item landed exactly; nothing out-of-scope changed), **structure** (JSON valid + correct shape; symlinks genuine + resolve; skip placed correctly), **consistency** (docs ↔ templates ↔ schema all agree; NO missed `maxIterations:0`/R1/`⊘ Skipped`/cap-value reference; `evaluate.mode:"skip"` NOT conflated with step-`skip`; coexist precedence stated unambiguously), **risk** (did adding `skip` or raising caps break any documented invariant; is the R1 path still present; any way a reader/runtime now mis-resolves Skipped), **usage** (is the new `skip` key understandable to a config author; opt-in-to-run-preparation path still correct), **performance** (n/a-ish — note if maxIterations=5 has any documented cost implication), **aesthetics** (prose clarity, Principle 14 plain-language).
4. Run concrete checks: `jq` the two templates; `find .claude/skills/orchestration/templates -xtype l` (must be empty); `grep -rn "settings.default.json"` across skills/features/design (only notes/ should remain); `grep -rn "maxIterations: 0\|R1 lock" skills/orchestration/` (must be NON-zero — coexist); grep for stale cap literals.

## Output (write these files; use workspace-write under this worktree)

Write to `.gobbi/projects/gobbi/sessions/2026-06-05-0a9c813f-c83b-48d7-925d-0075ce818d54/execution/task-01/evaluation/iter1/codex/`:

- `overall.md` — MUST contain a line `VERDICT: PASS` or `VERDICT: REVISE` or `VERDICT: FAIL`, a one-paragraph rationale, and a findings list. Each finding tagged with a type from: `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`, plus severity (Critical/High/Medium/Low), file:line, and what's wrong.
- Optionally `per-perspective.md` with per-perspective notes.

Be specific with file:line evidence. A finding without evidence is noise. If everything is correct, say so explicitly and PASS — do not invent problems.
