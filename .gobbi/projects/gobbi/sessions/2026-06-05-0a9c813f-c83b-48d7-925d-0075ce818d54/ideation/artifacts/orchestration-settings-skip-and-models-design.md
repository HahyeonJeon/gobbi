---
name: orchestration-settings-skip-and-models-design
description: Design spec for adding a boolean skip key, raising maxIterations, and upgrading evaluator models in the orchestration settings templates, plus reconciling the maxIterations:0/R1-lock docs and fixing the broken settings.default.json symlink.
type: design
scope: feature
feature: workflow
status: active
created: 2026-06-05
session: 0a9c813f-c83b-48d7-925d-0075ce818d54
tags: [orchestration, settings, skip-key, maxIterations, evaluator-model, symlink, state-machine]
topic: orchestration-settings-skip-and-models
related: drop-legacy-setup-questions
---

# Orchestration settings: skip key + maxIterations + evaluator models + symlink fix

Design artifact for the Ideation WORK sub-phase. The five scope items (A–E) were locked by
the user before this work began; this artifact produces the precise, complete implementation
spec an executor follows, plus the blast-radius CRUD plan and ordered task list.

---

## 1. Scope recap (A–E, user-locked)

| ID | Change | Locked decision |
|----|--------|-----------------|
| **A** | Evaluator models | Both templates: `models.claude.evaluator` `sonnet → opus`; `models.codex.evaluator` `gpt-5 → gpt-5.5`. Aligns templates with the already-documented `delegation/SKILL.md` model table (evaluator = opus). |
| **B** | maxIterations | `settings.auto.json`: ideation/preparation/planning/execution `3 → 5`, wrap-up `1 → 5`. `settings.chat.json`: ideation/planning/execution `2 → 5`, wrap-up `1 → 5`, preparation stays `0`. |
| **C** | New `skip` boolean | Add `skip` to EVERY workflow step in BOTH templates. Coexists with the `maxIterations: 0` skip convention (R1 lock). Auto: all `skip: false`. Chat: preparation `skip: true` (AND keeps `maxIterations: 0`); all others `skip: false`. Placement: sibling of `discuss`/`evaluate`/`maxIterations`. Precedence: a step is `Skipped` at loop entry when `skip: true` **OR** `maxIterations: 0` — two independent signals, either alone sufficient. |
| **D** | Logic/doc reconciliation | The `skip` key must be honored; the existing `maxIterations:0`/R1-lock language must be reconciled with the new coexisting signal across `orchestration/SKILL.md`, `chat-mode.md`, `auto-mode.md`. Do NOT delete the `maxIterations:0` path — it coexists. |
| **E** | Symlink drift fix | Remove broken `.claude/skills/orchestration/templates/settings.default.json` symlink (target does not exist). Add `.claude/` mirror symlinks for `settings.auto.json` + `settings.chat.json`. Repoint surviving `settings.default.json` references first. |

**Out of scope** (do not touch): this session's resolved `<session>/settings.json`; the #258
drift-detector; runtime/CLI code (the design is markdown-driven — no TS reads these keys);
`state.template.json` / `session.template.json` `skip` field (see §3.5 — NOT needed, evidenced).

---

## 2. Research findings — complete reference inventory (file:line)

Sweep covered the whole `.gobbi/projects/gobbi/skills/` tree, `.claude/`, and project memory
(`features/`, `design/`, `notes/`, `backlogs/`), excluding `sessions/` and `archive/`. Per the
`claude-evaluator-step4-only-vs-codex-whole-file-grep` mistake, the search was repo-wide, not
limited to the named files.

### 2.1 The two template JSON files (the edit targets — A/B/C)

| File | Current state |
|------|---------------|
| `.gobbi/projects/gobbi/skills/orchestration/templates/settings.auto.json` | evaluator models `sonnet`/`gpt-5`; maxIter all `3` except wrap-up `1`; NO `skip` key anywhere. |
| `.gobbi/projects/gobbi/skills/orchestration/templates/settings.chat.json` | evaluator models `sonnet`/`gpt-5`; maxIter ideation/planning/execution `2`, preparation `0`, wrap-up `1`; NO `skip` key. |

Note: in BOTH templates, `models.codex.assistant` is also `gpt-5` (line ~44). The locked
change touches `evaluator` ONLY — `assistant` stays `gpt-5`. The executor must NOT mass
replace `gpt-5 → gpt-5.5`; only the `evaluator` value changes.

### 2.2 `maxIterations: 0` / R1-lock references (D — reconciliation targets)

| File:line | Reference | Reconciliation action |
|-----------|-----------|----------------------|
| `orchestration/SKILL.md:183` | `⊘ Skipped` state-value definition (lists "whole step skipped" + "evaluate.mode == 'skip'") | UPDATE — add the explicit `skip: true OR maxIterations: 0` loop-entry precedence (§4.1). |
| `orchestration/SKILL.md:253` | "`maxIterations: 0` resolves to `state: Skipped` at loop entry … (R1 lock)" | UPDATE — restate as: `skip: true` OR `maxIterations: 0` → `Skipped`; two independent signals (§4.2). |
| `orchestration/SKILL.md:269` | `workflow.{step}` schema description (settings-schema row) | UPDATE — add `skip` to the per-step key list (§4.3). |
| `chat-mode.md:50` | "(which resolves to `state: Skipped` at loop entry per R1)" | UPDATE — mention `skip: true` as the now-primary signal for chat preparation (R1 still valid as second signal). |
| `chat-mode.md:86-91` | ASCII workflow diagram Step 3 box: "(R1: settings.workflow.preparation.maxIterations: 0 → …)" | UPDATE — note both signals; chat preparation now carries `skip: true` AND `maxIterations: 0`. |
| `chat-mode.md:161` | "Loop iteration. None. `…preparation.maxIterations: 0` resolves to `state: Skipped` … per the R1 lock" | UPDATE — `skip: true` OR `maxIterations: 0` → Skipped. |
| `chat-mode.md:355` | "Preparation is not present in the directory tree … (the default per R1)" | UPDATE (light) — "(the default per R1 + skip:true)" or equivalent. |
| `chat-mode.md:496-498` | Per-task state-transition table: "loop-entry guard reads `maxIterations: 0` → preparation.state: Skipped \| R1 lock" + opt-in rows | UPDATE — guard reads `skip: true` OR `maxIterations: 0`; opt-in row must clear BOTH signals (§4.4). |
| `auto-mode.md:205` | §4 defaults table: "`workflow.preparation.maxIterations` \| `3` \| Preparation runs — not skipped (contrast Chat's `0 → Skipped`)." | UPDATE — note auto preparation is `skip: false` AND `maxIterations: 5`; contrast Chat's `skip:true`/`0`. |
| `auto-mode.md:209` | `evaluate.mode` (all loops) row — references the `"skip"` evaluate.mode value (distinct concept) | READ-ONLY — `evaluate.mode: "skip"` is a SEPARATE concept (skips EVALUATION, not the whole step). Do NOT conflate with the new step-level `skip` boolean. May add a one-line disambiguation note (§4.5). |
| `auto-mode.md:216-218` | "Preparation runs." paragraph: "the structural contrast with Chat Mode's R1 lock (`maxIterations: 0 → state: Skipped`)." | UPDATE — contrast is now `skip:true`+`maxIterations:0` (Chat) vs `skip:false`+`maxIterations:5` (Auto). |
| `auto-mode.md:277-278` | Cross-references: "R1 lock (`preparation.maxIterations: 0 → state: Skipped`) … Chat-only" | UPDATE — mention `skip: true` as the coexisting Chat-only signal. |

Also note the auto-mode §4 maxIterations rows that change as data (B), not as reconciliation:
`auto-mode.md:204,206,207,208` (`3`/`3`/`3`/`1` → all `5`). And the chat-mode references to
"Chat default = 2" / "max=1" in prose: `chat-mode.md:74,96,102,143,173,191,226` and
`chat-mode.md:298` ("Iteration cap is 2 …"), `chat-mode.md:495,501,506` (state-table "maxIter (2)").
These are prose statements of the cap value → see §4.6 for the disposition decision.

### 2.3 `⊘` glyph references (D — Skipped rendering)

| File:line | Reference | Action |
|-----------|-----------|--------|
| `orchestration/SKILL.md:183` | `⊘ Skipped` state-values table row | UPDATE (same row as §2.2). |
| `chat-mode.md:86` | diagram "Step 3 — Preparation Loop ⊘ state: Skipped at loop entry" | UPDATE (same as §2.2 diagram). |
| `chat-mode.md:458,475,531` | Status-display rendering "⊘ Skipped" for Step 3 | READ-ONLY — rendering is correct as-is; Skipped still renders ⊘ regardless of which signal triggered it. No change needed unless §4 wording cascades. |

### 2.4 `settings.default.json` references (E — repoint targets)

| File:line | Reference | Action |
|-----------|-----------|--------|
| `.claude/skills/orchestration/templates/settings.default.json` | BROKEN symlink → `…/templates/settings.default.json` (target absent) | DELETE the symlink (E). |
| `features/workflow/design/drop-legacy-setup-questions.md:18,24,30` | Cites `settings.default.json` as defaults source-of-truth (3 mentions, incl. a `jq` command) | UPDATE — repoint to `settings.auto.json` (the auto-default file; this design doc's "default auto" framing maps to settings.auto.json). PROJECT-MEMORY edit — see Open Question OQ-1. |
| `notes/2026-05-24-…-bundle-b.md:48`, `notes/2026-05-28-chat-auto-mode-redesign.md:32,38` | Historical session-journal mentions of `settings.default.json` | READ-ONLY — `notes/` are immutable session journals (`status: active (immutable)` per `memorization/rules.md` §2.2). Do NOT edit; they record what was true at the time. |
| `backlogs/model-assignment-drift-delegation-vs-settings-default.md` | Backlog documenting the evaluator/executor model inversion between `delegation/SKILL.md` and the settings default | READ + likely CLOSE — change A resolves the evaluator half of this drift. See Open Question OQ-2. |

### 2.5 Negative findings (verified NOT co-update targets)

- **No JSON schema / AJV / validator** constrains these settings files. `grep` of `src/` for
  `maxIterations` / `evaluate` / `workflow.` returns nothing — the v0.4.x settings-IO validator
  was removed in v0.5.0 and nothing replaced it (per `gobbi/SKILL.md:74`). The `skip` key adds
  no schema burden; it is read by the markdown-driven manager only.
- **`memorization/SKILL.md:313`** and **`memory-map.md:30,100`** reference the template files by
  correct path (`settings.chat.json` / `settings.auto.json`) but do NOT enumerate the per-step
  schema or evaluator-model values, and do NOT mention `settings.default.json`. No co-update.
- **`gobbi/SKILL.md`** mentions settings generically ("iteration caps, models") but enumerates
  no per-step schema and no evaluator-model value. No co-update.
- **`preparation/SKILL.md:248`** (`skip` gap-resolution decision) and **`wrap-up/evaluation.md:278,362`**
  ("Skipped" staging items / "Skipped mistake recording") use "skip"/"Skipped" in unrelated
  senses (gap disposition, staging absence). NOT the workflow-step Skipped state. No co-update.
- **`evaluate.mode: "skip"`** (`auto-mode.md:209`, `SKILL.md:278,284,296,299`) is a SEPARATE,
  pre-existing concept: it skips the EVALUATION phase (loop runs WORK→MEMORIZATION, verdict
  absent → treated as Skipped at ITER/EXIT). It is NOT the new step-level `skip` boolean. These
  must NOT be merged; §4.5 adds a disambiguation note so a reader does not conflate them.

### 2.6 The evaluator-model alignment evidence (A)

`delegation/SKILL.md` already documents evaluator = opus in two places — the Model Selection
table (`:289` "`evaluator` … opus") and the role table (`:327` "Opus"). The templates currently
say `sonnet`, which is the drift change A corrects. The codex side: in both templates,
`manager`/`leader`/`executor` are already `gpt-5.5` while `evaluator`/`assistant` are `gpt-5`;
change A lifts `evaluator` to `gpt-5.5`, leaving `assistant` at `gpt-5`.

---

## 3. Exact target spec

### 3.1 `skip`-field placement (C)

`skip` is a **sibling of `discuss` / `evaluate` / `maxIterations`** inside each per-step object.
Placement order within the object: `discuss`, `evaluate`, `skip`, `maxIterations` (put `skip`
immediately before `maxIterations` so the two skip signals read adjacently). Value is a JSON
boolean (`true` / `false`), never a string.

### 3.2 Full target `settings.auto.json`

```json
{
  "schemaVersion": 1,
  "mode": "auto",
  "workflow": {
    "ideation": {
      "discuss":  { "mode": "user" },
      "evaluate": { "mode": "always" },
      "skip": false,
      "maxIterations": 5
    },
    "preparation": {
      "discuss":  { "mode": "user" },
      "evaluate": { "mode": "always" },
      "skip": false,
      "maxIterations": 5
    },
    "planning": {
      "discuss":  { "mode": "agent" },
      "evaluate": { "mode": "always" },
      "skip": false,
      "maxIterations": 5
    },
    "execution": {
      "discuss":  { "mode": "agent" },
      "evaluate": { "mode": "always" },
      "skip": false,
      "maxIterations": 5
    },
    "wrap-up": {
      "discuss":  { "mode": "agent" },
      "evaluate": { "mode": "always" },
      "skip": false,
      "maxIterations": 5
    }
  },
  "models": {
    "claude": {
      "manager":   "opus",
      "leader":    "opus",
      "executor":  "opus",
      "evaluator": "opus",
      "assistant": "sonnet"
    },
    "codex": {
      "manager":   "gpt-5.5",
      "leader":    "gpt-5.5",
      "executor":  "gpt-5.5",
      "evaluator": "gpt-5.5",
      "assistant": "gpt-5"
    }
  },
  "git": {
    "repo":       null,
    "baseBranch": null,
    "pr":       { "open": false, "draft": false },
    "issue":    { "create": false },
    "worktree": { "autoRemove": true },
    "branch":   { "autoRemove": true }
  }
}
```

Per-key delta from current: ideation/preparation/planning/execution `maxIterations 3→5`;
wrap-up `maxIterations 1→5`; add `skip: false` to all 5 steps; `claude.evaluator sonnet→opus`;
`codex.evaluator gpt-5→gpt-5.5`. (Note `claude.executor` stays `opus` and `claude.assistant`
stays `sonnet` — current values; not touched.)

### 3.3 Full target `settings.chat.json`

```json
{
  "schemaVersion": 1,
  "mode": "chat",
  "workflow": {
    "ideation": {
      "discuss":  { "mode": "user" },
      "evaluate": { "mode": "always" },
      "skip": false,
      "maxIterations": 5
    },
    "preparation": {
      "discuss":  { "mode": "user" },
      "evaluate": { "mode": "always" },
      "skip": true,
      "maxIterations": 0
    },
    "planning": {
      "discuss":  { "mode": "user" },
      "evaluate": { "mode": "always" },
      "skip": false,
      "maxIterations": 5
    },
    "execution": {
      "discuss":  { "mode": "user" },
      "evaluate": { "mode": "always" },
      "skip": false,
      "maxIterations": 5
    },
    "wrap-up": {
      "discuss":  { "mode": "user" },
      "evaluate": { "mode": "always" },
      "skip": false,
      "maxIterations": 5
    }
  },
  "models": {
    "claude": {
      "manager":   "opus",
      "leader":    "opus",
      "executor":  "opus",
      "evaluator": "opus",
      "assistant": "sonnet"
    },
    "codex": {
      "manager":   "gpt-5.5",
      "leader":    "gpt-5.5",
      "executor":  "gpt-5.5",
      "evaluator": "gpt-5.5",
      "assistant": "gpt-5"
    }
  },
  "git": {
    "repo":       null,
    "baseBranch": null,
    "pr":       { "open": false, "draft": false },
    "issue":    { "create": false },
    "worktree": { "autoRemove": true },
    "branch":   { "autoRemove": true }
  }
}
```

Per-key delta from current: ideation/planning/execution `maxIterations 2→5`; wrap-up `1→5`;
preparation `maxIterations` stays `0`; add `skip: false` to ideation/planning/execution/wrap-up;
add `skip: true` to preparation (preparation keeps BOTH `skip:true` AND `maxIterations:0`);
`claude.evaluator sonnet→opus`; `codex.evaluator gpt-5→gpt-5.5`.

### 3.4 Precedence-rule wording (D — the canonical sentence to insert)

The single canonical precedence statement, to be inserted at `orchestration/SKILL.md:253` (the
state-machine note) and referenced from `chat-mode.md` / `auto-mode.md`:

> **Loop-entry Skipped resolution (two independent signals).** A workflow step resolves to
> `state: Skipped` at loop entry when **either** `skip: true` **OR** `maxIterations: 0` is set
> for that step — the two are independent signals, and either one alone is sufficient. A Skipped
> step runs no DISCUSSION / WORK / EVALUATION / MEMORIZATION rows, emits no `FAIL` or `Aborted`
> verdict, and stamps `{state: "Skipped", iterations: []}`. The `maxIterations: 0` path (the
> original "R1 lock") is retained and coexists with the explicit `skip` boolean; `skip: true` is
> the preferred explicit signal, `maxIterations: 0` remains valid for back-compatibility. This
> is distinct from `evaluate.mode: "skip"`, which skips only the EVALUATION phase (the loop still
> runs WORK → MEMORIZATION), not the whole step.

`⊘ Skipped` state-value row (`SKILL.md:183`) updated to cross-reference this resolution:

> `⊘ Skipped` — Step bypassed without running `EVALUATION`. Triggered at loop entry by `skip: true`
> OR `maxIterations: 0` (two independent signals — see § Workflow State Machine loop-entry
> resolution), OR mid-loop when `evaluate.mode == 'skip'` (loop ran `WORK` → `MEMORIZATION`, no
> verdict). The `Verdict` column stays `—`.

### 3.5 `state.template.json` / `session.template.json` — NO `skip` field (verified)

**Conclusion: neither template needs a `skip` field.** Evidence:

- `skip` lives in `settings.json` (the policy input). `state.json` / `session.json` record the
  RESOLVED runtime state (`state`, `verdict`, `iter`, `maxIterations`, `phase`), not the policy.
- When `skip: true` (or `maxIterations: 0`), the runtime DERIVES `state: "Skipped"` and stamps
  it — the templates already carry the `state` field that holds `"Skipped"`. No new field is
  needed; the existing `state` field is the recording surface.
- The existing R1 mechanism already works this way: chat preparation's `maxIterations: 0` causes
  the manager to stamp `state: "Skipped"` into `state.json` / `workflow.chat.tasks[].preparation`
  (`SKILL.md:270,376`, `chat-mode.md:496`) WITHOUT any `skip` field in the templates. The new
  `skip: true` signal flows the same way.
- `state.template.json` carries `maxIterations` per step but ships defaults (`3`/`1`) that the
  manager overwrites from resolved settings at Step 1 row 5.5 — it is a seed, not the policy
  source. Adding `skip` there would be redundant policy duplication.

So the templates are READ-ONLY for this change (no edit). This is stated explicitly to close the
question the brief raised.

---

## 4. Doc-reconciliation wording (D — per-file)

### 4.1 `orchestration/SKILL.md:183` — `⊘ Skipped` row
Replace with the §3.4 `⊘ Skipped` wording (adds the two-signal trigger + cross-ref + keeps the
`evaluate.mode == 'skip'` mid-loop case).

### 4.2 `orchestration/SKILL.md:253` — state-machine note
Replace the single-sentence "Note: `maxIterations: 0` resolves to `state: Skipped` …(R1 lock)."
with the §3.4 canonical "Loop-entry Skipped resolution (two independent signals)" block.

### 4.3 `orchestration/SKILL.md:269` — `workflow.{step}` schema description
Amend "Each entry carries `state`, `verdict`, `iter`, `maxIterations`, `phase`." → add a note
that the SETTINGS per-step object additionally carries `skip` (boolean) alongside
`discuss`/`evaluate`/`maxIterations`; the state-machine entry derives `Skipped` from it. (The
`state.json` schema entry itself does NOT gain a `skip` key — only settings does; §3.5.)

### 4.4 `chat-mode.md` updates
- `:50` — "(which resolves to `state: Skipped` at loop entry per R1)" → "(which resolves to
  `state: Skipped` at loop entry — chat preparation carries `skip: true` AND `maxIterations: 0`;
  either signal alone suffices)".
- `:86-91` (diagram Step 3 box) — update the R1 parenthetical to name both signals:
  "(R1 + skip: settings.workflow.preparation = `{skip: true, maxIterations: 0}` → manager skips
  DISCUSSION+WORK+EVAL+MEMO; stamps state: Skipped; …)".
- `:161` — "`…preparation.maxIterations: 0` resolves to `state: Skipped` … per the R1 lock" →
  "preparation is `{skip: true, maxIterations: 0}`; either signal resolves to `state: Skipped` at
  loop entry (loop-entry Skipped resolution, two independent signals) — no DISCUSSION / WORK /
  EVALUATION / MEMORIZATION rows execute; no FAIL or Aborted verdict is emitted."
- `:163` (Opt-in paragraph) — "A complex slice can opt back in by raising
  `workflow.preparation.maxIterations` via the customize gate" → opt-in must clear BOTH signals:
  "set `skip: false` AND raise `workflow.preparation.maxIterations` above 0".
- `:355` — light: "(the default per R1)" → "(the default — chat preparation is
  `{skip: true, maxIterations: 0}`)".
- `:496` (state-transition table guard) — "loop-entry guard reads `maxIterations: 0`" →
  "loop-entry guard reads `skip: true` OR `maxIterations: 0`"; keep the "R1 lock" note but add
  "+ skip signal".
- `:498` (opt-in row) — "user raises `maxIterations` explicitly" → "user sets `skip: false` AND
  raises `maxIterations` explicitly".

### 4.5 `auto-mode.md` updates
- `:204,206,207,208` (defaults table maxIter rows) — DATA change (B): `3`/`3`/`3`/`1` → all `5`.
  Update the "Notes" cells if they state the old cap.
- `:205` (preparation row) — "Preparation runs — not skipped (contrast Chat's `0 → Skipped`)." →
  "Preparation runs — `skip: false`, `maxIterations: 5` (contrast Chat's `skip: true` /
  `maxIterations: 0` → Skipped)."
- `:209` (evaluate.mode row) — add a one-line disambiguation: "`evaluate.mode: skip` skips only
  the EVALUATION phase; the step-level `skip: true` boolean (new) skips the WHOLE step. Distinct
  signals."
- `:216-218` ("Preparation runs." paragraph) — update the `maxIterations: 3` mention to `5` and
  restate the Chat contrast as `skip: true` + `maxIterations: 0` vs Auto `skip: false` +
  `maxIterations: 5`.
- `:277-278` (cross-references) — "R1 lock (`preparation.maxIterations: 0 → state: Skipped`)" →
  "R1 lock + `skip: true` (`preparation = {skip: true, maxIterations: 0} → state: Skipped`)".

### 4.6 maxIterations cap-value prose (B cascade — DECISION REQUIRED, see OQ-3)
The Chat docs state the cap as a literal "2" in prose (`chat-mode.md:74,96,102,143,173,191,298,
495,501,506`) and Auto as "3" (`auto-mode.md:73,91,109,127,145`). Since B raises the live caps
to `5` (chat ideation/planning/execution) and `5` (auto all), these prose statements become
stale. **Recommended disposition:** update each "(Chat default = 2)" / "(Auto default = 3)" prose
mention to the new value (`5`), and the state-table "maxIter (2)" / "max=1" mentions likewise, so
the docs match the templates (Principle 8 — docs are a deliverable; stale docs are a defect). This
is mechanical but wide; it is flagged as OQ-3 because the brief's named line list did not include
all of these and the user may prefer to scope the prose-cap sync separately. Per the whole-file-grep
mistake, the executor MUST grep for the OLD cap literals (`= 2`, `= 3`, `max=1`, `maxIter (2)`,
`maxIterations (Chat default = 2)`, `(Auto default = 3)`) across both mode docs, not just the
named lines.

---

## 5. CRUD blast-radius plan (Principle 13)

**SPEC.** Three file-classes change: (1) two settings TEMPLATE json files (type: non-memory skill
asset) — get A+B+C edits; (2) three orchestration SKILL docs (type: non-memory skill docs) — get
D reconciliation; (3) the `.claude/` template symlink mirror (type: filesystem symlinks) — get E
delete+create. Plus one project-memory design doc repoint (E, project-memory `design` type).
Adjacent types this must NOT bleed into: `state.template.json`/`session.template.json` (no `skip`
field — §3.5); `notes/` (immutable, no edit); `evaluate.mode: skip` semantics (separate concept).

### CREATE
| Path | What |
|------|------|
| `.claude/skills/orchestration/templates/settings.auto.json` (symlink) | New symlink → `../../../../.gobbi/projects/gobbi/skills/orchestration/templates/settings.auto.json` (mirror the `session.template.json` symlink pattern: `lrwxrwxrwx … -> ../../../../.gobbi/projects/gobbi/skills/orchestration/templates/<file>`). |
| `.claude/skills/orchestration/templates/settings.chat.json` (symlink) | New symlink → `…/templates/settings.chat.json`, same relative form. |

### READ (consulted for coherence)
| Path | Why |
|------|-----|
| `delegation/SKILL.md:289,327` | Confirm evaluator = opus (change A alignment source). |
| `.claude/skills/orchestration/templates/session.template.json` (symlink) | Copy the exact relative symlink form for the two new symlinks. |
| `backlogs/model-assignment-drift-delegation-vs-settings-default.md` | Determine whether change A closes it (OQ-2). |
| `memorization/rules.md` §2.2 | Confirm `notes/` immutability (so notes refs are READ-ONLY). |

### UPDATE
| Path | Lines / sections |
|------|------------------|
| `…/templates/settings.auto.json` | A: `claude.evaluator`, `codex.evaluator`. B: 5 `maxIterations`. C: 5 `skip: false`. (Full target §3.2.) |
| `…/templates/settings.chat.json` | A: `claude.evaluator`, `codex.evaluator`. B: 4 `maxIterations` (prep stays 0). C: prep `skip: true`, 4 others `skip: false`. (Full target §3.3.) |
| `orchestration/SKILL.md` | `:183` (⊘ Skipped row), `:253` (state-machine note → precedence block), `:269` (workflow.{step} schema row). §4.1-4.3. |
| `orchestration/chat-mode.md` | `:50, :86-91, :161, :163, :355, :496, :498` + cap-prose (OQ-3). §4.4, §4.6. |
| `orchestration/auto-mode.md` | `:204-209, :216-218, :277-278` + cap-prose (OQ-3). §4.5, §4.6. |
| `features/workflow/design/drop-legacy-setup-questions.md` | `:18, :24, :30` — repoint `settings.default.json` → `settings.auto.json`. PROJECT-MEMORY (OQ-1). |

### DELETE
| Path | What |
|------|------|
| `.claude/skills/orchestration/templates/settings.default.json` (broken symlink) | `rm` the symlink (target absent — E). Filesystem symlink delete, NOT a project-memory delete (the supersede-not-delete rule governs memory files, not broken `.claude/` symlinks). |

### Blast-radius co-update verification (the "did I miss a file" check)
- Settings schema described in `SKILL.md:269` — co-updated (UPDATE list). ✔
- Both mode docs' R1 references — co-updated. ✔
- `delegation/SKILL.md` already says opus — no change needed (it is the alignment TARGET). ✔
- `state.template.json`/`session.template.json` — verified NO change (§3.5). ✔
- `notes/` mentions — verified READ-ONLY (immutable). ✔
- `memorization/*` template-path mentions — verified correct + no `settings.default.json`. ✔

---

## 6. Ordered execution task list

Sequenced so JSON edits, doc edits, and symlink ops do not conflict. All edits use the CANONICAL
worktree-absolute path under `.gobbi/projects/gobbi/skills/…` — NOT the `.claude/` symlink path
(per `edit-tool-refuses-symlink-paths` mistake: the Edit tool refuses symlink paths).

**Task 1 — Settings templates A+B+C (the two JSON files).**
- *What:* Apply the full target spec in §3.2 to `settings.auto.json` and §3.3 to `settings.chat.json`.
- *Why:* Realize locked scope A (evaluator models), B (maxIterations), C (skip key). Trigger: user-locked decision.
- *How:* Edit the canonical files. Add `skip` as sibling before `maxIterations` in every step. Change only `evaluator` model values (NOT `assistant`). Verify: `jq` each file parses; assert per-key values match §3.2/§3.3 (e.g., `jq '.workflow.preparation.skip' settings.chat.json` → `true`; `jq '.workflow.preparation.maxIterations' settings.chat.json` → `0`; `jq '.models.codex.assistant' settings.auto.json` → `"gpt-5"` unchanged; `jq '.models.codex.evaluator'` → `"gpt-5.5"`).

**Task 2 — `orchestration/SKILL.md` reconciliation (D core).**
- *What:* Insert the §3.4 precedence block at `:253`; update the `⊘ Skipped` row `:183`; update the `workflow.{step}` schema row `:269`.
- *Why:* The `skip` key must be honored by the state machine; the canonical precedence rule lives here and the mode docs point to it. Trigger: C/D locked scope.
- *How:* Edit canonical file. Verify: the two-signal sentence ("`skip: true` OR `maxIterations: 0`") appears at `:253`; `evaluate.mode: "skip"` disambiguation preserved; `grep -c "R1 lock" SKILL.md` shows R1 retained (coexists, not deleted).

**Task 3 — `chat-mode.md` reconciliation (D, depends on Task 2 for the cross-ref target).**
- *What:* Apply §4.4 edits (`:50,:86-91,:161,:163,:355,:496,:498`) + cap-prose per §4.6/OQ-3.
- *Why:* Chat preparation now carries `skip:true` AND `maxIterations:0`; opt-in must clear both; docs must match the template. Trigger: C/D/B.
- *How:* Edit canonical file. Verify: chat preparation described as both-signals; opt-in clears both; `grep` for old cap literal `= 2` returns only intentional/historical mentions (or zero in live prose if OQ-3 = sync).

**Task 4 — `auto-mode.md` reconciliation (D + B data).**
- *What:* Apply §4.5 edits (`:204-209,:216-218,:277-278`) including maxIter `3/1 → 5` and the `evaluate.mode:skip` vs step-`skip` disambiguation + cap-prose per §4.6/OQ-3.
- *Why:* Auto caps rise to 5; auto steps are `skip:false`; the two skip concepts must not be conflated. Trigger: B/C/D.
- *How:* Edit canonical file. Verify: §4 defaults table shows `5` for ideation/prep/planning/execution/wrap-up; `evaluate.mode:skip` note present; Chat-contrast restated.

**Task 5 — Symlink fix (E, independent; can run any time but place last to avoid mid-edit confusion).**
- *What:* `rm .claude/skills/orchestration/templates/settings.default.json`; create the two new symlinks (§5 CREATE) using the relative form copied from `session.template.json`.
- *Why:* The default symlink is broken (target absent); the two live templates have no `.claude/` mirror. Trigger: E locked scope + observed broken symlink.
- *How:* `ln -s ../../../../.gobbi/projects/gobbi/skills/orchestration/templates/settings.auto.json .claude/skills/orchestration/templates/settings.auto.json` (and `.chat.json`). Verify: `find .claude/skills/orchestration/templates -xtype l` returns EMPTY (no broken symlinks); `readlink` each new symlink resolves to an existing file; `ls -la` shows both new symlinks + no `settings.default.json`.

**Task 6 — Repoint `settings.default.json` references (E co-update, GATED on OQ-1).**
- *What:* In `features/workflow/design/drop-legacy-setup-questions.md:18,24,30`, replace `settings.default.json` → `settings.auto.json`.
- *Why:* These references will be even more misleading once the symlink is deleted; the file they cite no longer exists. Trigger: E + the stale-reference being load-bearing for a future reader. Per `proposed-deleting-model-instead-of-fixing-stale-mechanism`: fix the stale mechanism reference, do not delete the model.
- *How:* Edit canonical project-memory file. Verify: `grep -rn "settings.default.json" features/ design/ rules/` returns zero outside `notes/`. NOTE: this is a project-memory `design` file edit during Ideation — see OQ-1; the executor (Execution step), not this Ideation leader, performs it, and only if the user/manager confirms the in-scope repoint.

**Final verification (whole-repo grep gate, per the whole-file-grep mistake).**
- `grep -rn "settings.default.json" .gobbi/projects/gobbi/skills/ .claude/ features/ design/ rules/` → only `notes/` historical mentions remain.
- `find .claude/skills/orchestration/templates -xtype l` → empty.
- `grep -rn "maxIterations: 0\|R1 lock" skills/orchestration/` → R1/`maxIterations:0` STILL PRESENT (coexists — must NOT be zero; deleting it would be the regression).
- `jq` both templates parse and match §3.2/§3.3 exactly.

---

## 7. Open questions

- **OQ-1 (project-memory edit during the change).** Repointing `drop-legacy-setup-questions.md`
  (a `features/workflow/design/` project-memory file) is the correct blast-radius co-update for E,
  but it is a project-memory edit. Ideation leaders are READ-ONLY on project memory; the EDIT
  belongs to the Execution step (executor), and Wrap-up normally owns project-memory promotion.
  **Recommendation:** include the repoint as Execution Task 6 (executor edits the canonical design
  file directly, since it is an existing tracked file in the worktree, not a staging→promotion
  flow). Confirm with the user that editing this design doc in-place is acceptable vs. deferring
  to a separate docs-sync follow-up. *Either way, do NOT delete the design doc — only repoint the
  stale path.*

- **OQ-2 (drift backlog closure).** `backlogs/model-assignment-drift-delegation-vs-settings-default.md`
  documents the evaluator/executor model inversion between `delegation/SKILL.md` and the settings
  defaults. Change A resolves the EVALUATOR half (templates now match delegation's opus/gpt-5.5).
  Does change A also resolve the EXECUTOR half, or does that remain open? Current templates have
  `claude.executor: opus` while `delegation/SKILL.md` says executor = sonnet — that inversion is
  NOT in this change's locked scope. **Recommendation:** leave the backlog OPEN (executor half
  unresolved); add a note that the evaluator half is closed by this session. User decides at
  Wrap-up whether to close or annotate.

- **OQ-3 (cap-value prose sync scope).** §4.6 — the literal "Chat default = 2" / "Auto default = 3"
  prose in both mode docs becomes stale once B raises caps to 5. Recommended: sync them in Tasks
  3-4 (Principle 8). The brief's named line list did not enumerate all cap-prose lines, so confirm
  the user wants the full prose-cap sync inside this change vs. a scoped follow-up. *If deferred,
  the templates and the prose will disagree — a docs-sync defect — so in-scope sync is the
  Principle-8-correct default.*

- **OQ-4 (auto wrap-up maxIterations 1→5 semantics).** B raises auto wrap-up `1→5`. Wrap-up is
  documented as "runs once per session" (`auto-mode.md:208`, `chat-mode.md:226`). Raising its cap
  to 5 means up to 5 REVISE iterations are now permitted before abort — a behavioral change, not
  just a number. This is within the user's locked B decision, so no re-open; flagged only so the
  executor updates the "runs once per session" prose to "runs once per session; up to 5 remediation
  iterations on REVISE" (or equivalent) for doc/template consistency.
