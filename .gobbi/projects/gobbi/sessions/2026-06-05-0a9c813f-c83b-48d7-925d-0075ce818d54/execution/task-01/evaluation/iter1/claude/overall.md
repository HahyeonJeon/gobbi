---
name: task-01-orchestration-settings-eval-claude-overall
description: Claude-side dual-system Execution evaluation of the orchestration settings skip+maxIterations+models+symlink commit (scope A–E) — Overall verdict + 8-perspective findings.
type: evaluation
scope: session
status: active
created: 2026-06-05
session: 0a9c813f-c83b-48d7-925d-0075ce818d54
tags: [orchestration, settings, skip-key, maxIterations, evaluator-model, symlink, execution-eval, claude]
topic: orchestration-settings-skip-and-models
related: orchestration-settings-skip-and-models-design
---

# Execution Evaluation — Claude — task-01 (orchestration settings A–E)

VERDICT: PASS

Target: commit `9f77f0e` on `chore/session-2026-06-05-0a9c813f`.
Spec: `ideation/artifacts/orchestration-settings-skip-and-models-design.md` (read in full).
Method: read full diff (`git diff develop..HEAD`); ran jq on both templates; ran `find -xtype l`;
grepped the whole `skills/orchestration/` tree + repo-wide for stale literals; verified symlinks
resolve and the `.claude` mirror serves the live `skip` key.

## Verdict rationale

All five locked scope items (A–E) landed as specified, verified by tool output (below). The single
defect is one stale generic cap literal (`SKILL.md:292` "default `3`") that escaped the design's
named-line inventory — exactly the `claude-evaluator-step4-only-vs-codex-whole-file-grep` /
whole-file-grep pattern the design itself warned about, but for SKILL.md rather than the mode docs.
It is a Low-severity docs-sync inaccuracy (a generic default statement now disagreeing with both
source-of-truth templates), not a Critical/High contract breach, so it does not gate the verdict —
flagged for the user to address in this commit or a docs-sync follow-up. No Critical, no High.

## Tool evidence

**A — evaluator models (jq, both templates):**
- auto: `claude.evaluator = "opus"`, `codex.evaluator = "gpt-5.5"`; `claude.executor = "opus"`
  (unchanged), `codex.assistant = "gpt-5"` (UNCHANGED — the blind-replace bug did NOT happen),
  `claude.assistant = "sonnet"` (unchanged).
- chat: identical models block. A is exact.

**B — maxIterations (jq):**
- auto: ideation/preparation/planning/execution/wrap-up all `5`. ✔
- chat: ideation/planning/execution/wrap-up `5`; preparation `0` (retained). ✔

**C — skip key (jq):**
- auto: every step `skip:false`. ✔
- chat: preparation `skip:true` + `maxIterations:0` (BOTH signals); all others `skip:false`. ✔
- Placement: `skip` is the sibling immediately before `maxIterations` in the diff for every step. ✔
- Precedence block landed verbatim at `SKILL.md:255-262` ("two independent signals … `maxIterations: 0`
  path … retained and coexists … distinct from `evaluate.mode: "skip"`"). R1 path NOT deleted. ✔

**D — reconciliation grep across `skills/orchestration/`:**
- R1/`maxIterations:0` STILL PRESENT (NON-zero hits at SKILL.md:66/183/256/260/261/386,
  chat-mode.md:51/89/90/164/358/499, auto-mode.md:205/219/278/279) — coexists, not deleted. ✔
- Stale cap literals (`default = 2`, `default = 3`, `max=1`, `maxIter (2)`, `cap is 2/3`): grep EMPTY. ✔
- Leftover `maxIterations: 3/2/1` in prose: grep EMPTY (chat prep `0` intentionally retained). ✔
- `evaluate.mode:skip` NOT conflated with step-`skip`: explicit disambiguation present at
  SKILL.md:183, SKILL.md:262, auto-mode.md:209. Pre-existing evaluate.mode logic (SKILL.md:288/294/309)
  untouched and correct. ✔
- wrap-up "runs once per session" prose updated for up-to-5 REVISE (auto-mode.md:206/188,
  chat-mode.md:47/325). ✔

**E — symlinks + repoint:**
- `find .claude/skills/orchestration/templates -xtype l` → EMPTY (no broken symlinks). ✔
- `settings.default.json` symlink DELETED (diff: `deleted file mode 120000`). ✔
- New `settings.{auto,chat}.json` symlinks added; both `readlink` resolve to existing targets;
  `jq .workflow.preparation.skip` via the `.claude` symlink returns `true` (mirror serves live key). ✔
- `grep -rn settings.default.json` over `skills/ .claude/ features/ design/ rules/` → ZERO live refs;
  `drop-legacy-setup-questions.md:18,24,30` repointed to `settings.auto.json` (file kept). ✔
- `notes/*.md` + `backlogs/model-assignment-drift…` intentionally untouched (immutable / OQ-2). ✔

**JSON validity:** `jq -e .` on both templates → VALID. Working tree clean (no stray edits).

## Findings

### F1 — Stale generic maxIterations default "3" in SKILL.md survives the B cap raise
- Type: checklist_gap
- Domain: docs-sync
- Disposition: open
- Confidence: 90
- Severity: Low
- Evidence: `.gobbi/projects/gobbi/skills/orchestration/SKILL.md:292` —
  "`maxIterations` is read from `workflow.{step}.maxIterations` (default `3`)." Line was NOT touched
  by this commit (confirmed against `develop`). After scope B, NO step in either source-of-truth
  template holds the value `3` (auto = all 5; chat = 5 except prep 0). The generic "default `3`"
  now contradicts the templates it describes.
- Why it matters: Principle 8 — docs are a deliverable; a reader trusting this line believes the
  per-step cap defaults to 3 when it is 5. This is the same whole-file-grep miss the design's §4.6
  explicitly warned the executor to guard against ("grep for the OLD cap literals … not just the
  named lines"), but the design's own reference inventory (§2.2/§4) listed only the mode-doc cap
  lines and omitted this SKILL.md line — so the executor's named-line edits were complete, but the
  unenumerated literal slipped through.
- Suggested direction (NOT a prescription — user decides): repoint to `5` (or to a non-numeric
  "per the active settings template" phrasing to avoid future drift) in this commit, OR defer to a
  scoped docs-sync follow-up. Either is defensible; flagged for the user's call.

### F2 — (NOTE, not a finding against this commit) delegation says executor=sonnet but templates keep executor=opus
- Type: assumption_risk
- Domain: consistency
- Disposition: deferred
- Confidence: 100
- Severity: Low
- Evidence: `delegation/SKILL.md:288` ("`executor` … sonnet") vs both templates' `claude.executor: "opus"`.
- Why it matters: A residual model-inversion between delegation's role table and the settings
  defaults remains. It is the "executor half" of the drift backlog that the design (OQ-2) EXPLICITLY
  scoped OUT of this change — locked scope A touched evaluator only. This is therefore NOT a
  regression introduced by this commit and NOT a verdict gate; recorded so the user can decide at
  Wrap-up whether to annotate or close `backlogs/model-assignment-drift-delegation-vs-settings-default.md`.

## Per-perspective summary

- **project**: PASS. Every A–E item landed; nothing extra. The only out-of-named-scope edit
  (drop-legacy-setup-questions.md repoint) is the design-sanctioned E co-update (OQ-1), not creep.
- **structure**: PASS. Both JSON files valid (`jq -e`); `skip` placed as sibling before
  `maxIterations`; symlinks are genuine relative links matching the `session.template.json` pattern
  and all resolve; no broken symlinks remain.
- **consistency**: PASS with one Low finding (F1). R1/`maxIterations:0` retained everywhere;
  no stale cap literal in either mode doc; `evaluate.mode:skip` cleanly disambiguated from step-skip;
  no other doc in the skills tree claims evaluator=sonnet. Lone miss is the unenumerated
  SKILL.md:292 generic "default 3".
- **risk**: PASS. The two-signal precedence is unambiguous ("either alone sufficient"); the R1
  back-compat path is preserved (not deleted); chat-prep carries BOTH signals so neither a
  skip-only nor a maxIterations-only reader is misled; opt-in correctly requires clearing BOTH.
  No documented invariant (per-loop MEMORIZATION, evaluate.mode:always, R1) broken.
- **performance**: PASS. N/A surface — markdown + JSON config only; no runtime/CLI reads these keys
  (design §2.5 verified no validator). Cap raise 3→5 / 1→5 widens iteration budget; within the
  user-locked B decision; auto wrap-up 1→5 behavioral note correctly documented (OQ-4).
- **usage**: PASS. Opt-in prose, status-display `⊘ Skipped` row, and both-signal wording give the
  user a coherent mental model; the disambiguation note prevents the evaluate.mode/step-skip trap.
- **aesthetics**: PASS (minor). chat-mode.md:358 concatenates two sentences on a long line after the
  edit (readability nit, pre-flagged in design); cosmetic only, no action required.

## Must-preserve list (remediation must not break)

1. `codex.assistant` MUST stay `gpt-5` in both templates (the blind-replace bug was correctly avoided).
2. `claude.executor` stays `opus`; `claude.assistant` stays `sonnet`.
3. chat preparation keeps BOTH `skip:true` AND `maxIterations:0` — do not drop either signal.
4. The R1/`maxIterations:0` path and its doc mentions — retained by design; do not delete when
   fixing F1.
5. The `evaluate.mode:"skip"` vs step-`skip` disambiguation notes (SKILL.md:183/262, auto-mode.md:209).
6. The three new/retained `.claude` template symlinks resolving to the live canonical files.

VERDICT: PASS
