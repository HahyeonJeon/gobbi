# Plan — Chat Mode + Auto Mode Redesign (iter3)

> **Session:** 2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf · **Phase:** Planning iter3 WORK · **Mode:** Chat (mini-Plan)
>
> Final surgical pass applying G1–G6 (6 reconciled iter2 evaluator findings: 2 Codex High verification-quality fixes + 1 Med session-collision + 1 Med regression placeholder + 1 Low YAML-cleanup + 1 Low triple-escape). 7-task structure / order / scope / locked decisions are unchanged. See §6 Finding Disposition Table.

---

## 1. WHAT / WHY / HOW

**WHAT.** Decompose the locked Idea doc (Chat Mode + Auto Mode redesign) into seven ordered, anchored, verifiable Execution tasks plus a Plan-level cross-task acceptance test. Each task names files / pre-resolved decisions / success criteria / verification commands / Idea-doc anchors.

**WHY.** Idea doc is approved (iter2 PASS-equivalent via Reconcile-honored REVISE → user-locked R1/R2+R3/R5 + D-A + D-B). Execution needs the per-task contract spelled out so executors do not improvise scope, drift away from §7.3 anchors, or duplicate decisions Ideation already locked. Two open backlogs (`chat-mode-tiki-taka-redesign.md`, `auto-mode-silence-vs-always-ask.md`) close on ship; the new `delegation/SKILL.md` ↔ `settings.default.json` drift backlog files as a side effect (T7).

**HOW.** Apply the user-confirmed task order (T1 → T2 → T4 → T5 → T3 → T7; T6 in Wrap-up). T1+T2 land the canonical sub-docs (replace placeholders); T4+T5 land the supporting schema changes; T3 amends SKILL.md against the now-existing sub-docs (so the anchors and links resolve at write-time, not as forward refs); T7 is a 5-minute backlog file; T6 archives the two closed backlogs during Wrap-up via move-on-terminal. Full Idea-doc anchors are §3 (Chat), §4 (Auto), §5 (settings defaults), §6 (SKILL.md amendment shape), §6.7 (`workflow.chat.tasks[]` schema), §7 (CRUD), §9 (backlogs).

For the canonical full-context source, see the Idea doc: `<sessions>/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`.

---

## 2. Scope Contract (this Planning Loop)

```yaml
artifact_type: scope-contract
feature: orchestration
goal: produce a 7-task Execution Plan for the Chat Mode + Auto Mode redesign locked in iter2 idea.md
created-by: planning-loop / sessionId 8eed14fb
created-at: 2026-05-28
```

### In-Scope

The 7 user-confirmed tasks:

- **T1** — Fill canonical `chat-mode.md` (replace 598-byte placeholder).
- **T2** — Fill canonical `auto-mode.md` (replace 636-byte placeholder; codify Always-Ask).
- **T3** — Amend `orchestration/SKILL.md` per Idea §7.3 (8 anchor points).
- **T4** — Bundle Chat + Auto default-sets in `settings.default.json`.
- **T5** — Add `workflow.chat.tasks[]` to `state.template.json` + `session.template.json`.
- **T6** — Archive the two closed backlog files (wrap-up assistant, move-on-terminal).
- **T7** — File new backlog for the `delegation/SKILL.md` ↔ `settings.default.json` model-assignment drift (Idea Finding #8 deferred).

Plus a Plan-level cross-task acceptance test (§4 below).

### Out-of-Scope

The following Idea-doc-cited items are explicitly deferred from this Planning Loop (Bucket B/C/D iter1 findings + iter2 §2 Deferred + §8 R-items):

- Final `task-record.md` frontmatter type / dedicated template (Finding #4 / §8 R10) — `chat-mode.md` documents the deferral; no template file authored here.
- Wrap-up's Chat-input extension procedure change in `wrap-up/SKILL.md` (§8 R6).
- Resolution of the upstream `delegation/SKILL.md` vs `settings.default.json` model-assignment drift (Finding #8) — only the backlog file is created in T7; the drift is NOT fixed.
- Auto-Mode harness banner alignment (§8 R8).
- Settings-cascade resolver code changes if mode-divergent default-set selection requires resolver edits beyond JSON edits (§8 F-R1).
- Chat per-task sub-step layout details beyond D-B's symmetric quartet (§8 Finding #7 carved out — D-B answers the outer-key question; nothing in the §7.3 CRUD targets the inner quartet shape).
- Authoritative-direction rule between `SKILL.md` and mode sub-docs (F-S1) — Planning does not pre-author this; mode docs may state "SKILL.md = workflow contract, sub-doc = mode spec" if Execution determines it is needed.

### Decisions Locked (no re-litigation)

| Source | Lock |
|---|---|
| Idea iter1 brief | 9 pre-resolved decisions (Chat conversational; full Ideation per task; Prep skipped; mini Plan + Execute; Chat MEMORIZATION local override; explicit-end-of-session Wrap-up; Auto codifies Always-Ask; same `settings.json` schema; mode affects workflow structure) |
| Idea iter2 lock R1 | `preparation.maxIterations: 0 → state: Skipped` mapped at loop-entry guard; no new settings field; no FAIL/Aborted noise |
| Idea iter2 lock R2+R3 | `workflow.chat.tasks[]` array-of-slices in BOTH `session.json` and `state.json`; per-task entries hold `{ideation, preparation, planning, execution}` sub-records (same shape as existing top-level `workflow.{loop}`) |
| Idea iter2 lock R5 | Chat MEMORIZATION narrowed PASS path declared **locally in `chat-mode.md`**; `memorization/SKILL.md` stays untouched |
| User D-A | task-record memory type = session-local only at `sessions/.../chat/tasks/{NN}-{slug}/task-record.md`; no promotion to project memory; `memorization/SKILL.md` untouched |
| User D-B | Chat session layout = `sessions/{date}-{ssid}/chat/tasks/{NN}-{slug}/{ideation,planning,execution}/{rawdata,staging,artifacts,evaluation}/` — symmetric quartet rooted under `chat/` |

### Success Criteria

1. All 7 task entries below carry a verifiable success-criteria line + at least one verification command.
2. T3 anchors map 1:1 to the 8 SKILL.md update rows in Idea §7.3 (no missed anchor, no invented anchor).
3. Plan-level acceptance test (§4) passes after Execution: all 4 symlinks remain symlinks; all 3 JSON files parse; all internal `chat-mode.md` ↔ `SKILL.md` ↔ `auto-mode.md` cross-links resolve.
4. No task overlaps on the same file unintentionally — Plan-level conflict flags are zero (§3 dependency table).

### Deferred

| Item | Route |
|---|---|
| Idea Bucket B/C/D residuals (Findings #4, #5, #7 layout details, #8 drift fix, #10 process observation, #11 boundary cleanup) | Out-of-scope; tracked in Idea doc §8 |
| Wrap-up Chat-input extension (R6) | Filed as Planning awareness; `wrap-up/SKILL.md` edit deferred to a separate session |
| Settings-cascade resolver edits if JSON-only proves insufficient (F-R1) | Surface during T4 Execution as a NEEDS_CONTEXT if discovered |
| chat-mode.md per-task state-transition table (F-S2) | Required content of T1 itself (chat-mode.md author writes it) |

---

## 3. Task Table (ordered)

Tasks listed in user-confirmed execution order: **T1 → T2 → T4 → T5 → T3 → T7**. T6 runs in the Wrap-up phase after all Execution tasks PASS.

**Pre-flight convention (applied by F6 to T1/T2/T3)** — every task whose canonical file is mirror-symlinked from `.claude/skills/orchestration/` MUST run the symlink check BEFORE the edit and abort the task if the symlink is broken. The check uses the fully qualified absolute symlink path per task (no placeholder; the absolute path is given inline in each task's verification block).

**Before-state convention (applied by G4 + iter2 F3 to T4 and T5)** — for the "models block unchanged" (T4) and "additive-only / zero deletions" (T5) checks, the executor MUST capture the pre-edit revision explicitly before mutating the file, as an in-session bash variable (no `/tmp/*` file). Idiom:

```bash
WT=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb
# Capture pre-edit revision once at task start, BEFORE any edit
PRE_T4_REV=$(git -C "$WT" rev-parse HEAD)
# ... edit ...
# Verify against the captured rev — read pre-edit content directly from git
git -C "$WT" show "$PRE_T4_REV:.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json" | <assertion>
```

> **Note (G4 caveat):** `PRE_T4_REV` / `PRE_T5_REV` are bash-process-local variables. If verification spawns subshells, either re-capture with `PRE_T4_REV=$(git -C "$WT" rev-parse HEAD)` at the new shell's start (before any edit in that shell) or `export PRE_T4_REV` from the parent shell. The pre-capture MUST happen before any edit; otherwise the captured rev already includes the change.

**FLAG-2 note (applied by G5 to T1/T2/T3/T4/T5)** — A `claude` doc-authoring skill does NOT exist (verified absent — see gobbi/SKILL.md § Skill Map FLAG-2 row at line 187: "claude doc-authoring standard (currently absent)"). For `.claude/` authoring discipline (including mirror-symlink reminders for `skills/` and `templates/`), consult `.claude/CLAUDE.md` directly until FLAG-2 resolves. This note applies to every task whose `required-skills:` list lacks a `claude` entry by design; the YAML block lists only existing skills.

### T1 — Fill canonical `chat-mode.md`

Note: `.claude/skills/claude/SKILL.md` is intentionally absent (FLAG-2 in gobbi/SKILL.md § Skill Map; refer to `.claude/CLAUDE.md` directly for the doc-authoring standard until the row resolves). (G5)

```yaml
id: 01-chat-mode-canonical-spec
what: Replace the 598-byte placeholder at orchestration/chat-mode.md with the full Chat-Mode spec per Idea §3 (posture, per-task slice diagram, §3.3 canonical Chat MEMORIZATION statement (R5), §3.4 per-loop discipline, §3.5 task-record artifact spec, §3.6 explicit-end-of-session Wrap-up trigger, plus a §6.3 worked Status-Display example and an F-S2 per-task state-transition table).
traces-to:
  - "Idea §3.1 — Mode posture (per-task slice term lock)"
  - "Idea §3.2 — Per-task slice workflow diagram"
  - "Idea §3.3 — Chat MEMORIZATION canonical statement (R5)"
  - "Idea §3.4 — Per-loop discipline (forced user-driven DISCUSSION, fresh subagent context, mistake moment-of-capture)"
  - "Idea §3.5 — task-record artifact spec (deferred frontmatter type)"
  - "Idea §3.6 — Wrap-up trigger"
  - "Idea §6.3 — Status Display worked example"
  - "Idea §8 F-S2 — per-task state-transition table"
  - "Idea §7.3 chat-mode.md Update row"
requires: []
files:
  - { path: ".gobbi/projects/gobbi/skills/orchestration/chat-mode.md", op: modify }  # in-place overwrite of placeholder
out-of-scope-files:
  - .claude/skills/orchestration/chat-mode.md  # mirror symlink — DO NOT edit; auto-reflects via symlink
  - any other .claude/ doc
  - memorization/SKILL.md (R5 lock — base stays untouched)
pre-resolved-decisions:
  - R5: narrowed PASS path is local to chat-mode.md
  - D-A: task-record is session-local-only
  - D-B: Chat session layout = sessions/{date}-{ssid}/chat/tasks/{NN}-{slug}/{ideation,planning,execution}/{rawdata,staging,artifacts,evaluation}/
  - Term lock: "per-task slice" canonical (Finding F-A1)
  - Principle citation: Principle 1 (not Principle 4); plus delegation/SKILL.md § Inline-Paste Rule
  - Frontmatter type for task-record DEFERRED — chat-mode.md says "frontmatter type is Planning-decided (Bucket B Finding #4); for this Idea-cited deferral chat-mode.md MUST cite the deferral, not invent a type"
success-criteria:
  - chat-mode.md ≥ 200 lines (placeholder was 598 bytes / ~15 lines)
  - Contains exactly one canonical "Chat MEMORIZATION" statement matching the §3.3 four-bullet structure (steps preserved / steps skipped / moment-of-capture exception / base-unmodified clause)
  - All §3.2 diagram steps present (Step 2 / Step 3 ⊘ Skipped / Step 4 mini / Step 5 mini / task-record / user review gate)
  - task-record spec cites D-A and D-B explicitly; flags frontmatter-type deferral
  - Per-task state-transition table present (F-S2)
  - At least one worked Status-Display example showing a completed prior task plus the active task (§6.3 / codex-usage-0fbc3d75)
  - Front-link to memorization/SKILL.md base + back-link from §3.3 narrowing
verification-commands:
  # Common variables — absolute paths (G3); no placeholders
  - "F1=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/orchestration/chat-mode.md; M1=/playinganalytics/git/gobbi/.claude/skills/orchestration/chat-mode.md"
  # PRE-FLIGHT — mirror symlink intact BEFORE the edit (F6 + G3)
  - "test -L \"$M1\" && echo SYMLINK_OK || { echo BROKEN; exit 1; }"
  # POST-EDIT — binary assertions (F3 + G3 absolute paths)
  - "[ \"$(wc -l < \"$F1\")\" -ge 200 ] && echo OK_lines || echo FAIL_lines"
  - "[ \"$(grep -c 'per-task slice' \"$F1\")\" -ge 5 ] && echo OK_term_lock || echo FAIL_term_lock"
  - "[ \"$(grep -cE 'Steps preserved|Steps skipped|moment-of-capture|memorization/SKILL.md is unmodified' \"$F1\")\" -ge 4 ] && echo OK_four_bullets || echo FAIL_four_bullets"
  - "[ \"$(grep -c 'task-record' \"$F1\")\" -ge 3 ] && echo OK_taskrecord || echo FAIL_taskrecord"
  - "[ \"$(grep -cE 'Principle 1|delegation/SKILL.md.*Inline-Paste' \"$F1\")\" -ge 2 ] && echo OK_principle_citation || echo FAIL_principle_citation"
  - "test -L \"$M1\" && echo OK_symlink_intact || echo FAIL_symlink"
  - "[ \"$(find -L /playinganalytics/git/gobbi/.claude/skills/orchestration -maxdepth 1 -name 'chat-mode.md' | wc -l)\" -eq 1 ] && echo OK_mirror_resolves || echo FAIL_mirror"
estimated-risk: Medium
risk-rationale: Long-form spec authoring (§3 has 7 sub-sections + diagram + tables). Highest density of locked decisions (R5 + D-A + D-B + 9 brief locks + 2 term locks). Drift risk on R5's "Steps preserved vs Steps skipped" wording is the leading hazard — Sub-step E self-review of T1's draft must grep for the exact four-bullet skeleton.
agent: executor
required-skills:
  - principles
  - mistake
  - execution
  - memorization
  - discussion
  - delegation
required-mistakes:
  - mistakes/design-literal-retire-instruction-without-replacement.md
  - mistakes/section-order-is-part-of-the-contract-not-just-the-set.md
  - mistakes/skills-mirror-symlinks-not-copies.md
  - mistakes/prose-reclassification-target-is-project-level-notes.md  # task-record is session-scope, not project notes
```

### T2 — Fill canonical `auto-mode.md`

Note: `.claude/skills/claude/SKILL.md` is intentionally absent (FLAG-2 in gobbi/SKILL.md § Skill Map; refer to `.claude/CLAUDE.md` directly for the doc-authoring standard until the row resolves). (G5)

```yaml
id: 02-auto-mode-canonical-spec
what: Replace the 636-byte placeholder at orchestration/auto-mode.md with the full Auto-Mode spec per Idea §4 (posture: structurally unchanged; §4.2 Always-Ask codification by reference to discussion/SKILL.md § Decision Classification; §4.3 other Auto-Mode tightenings restated; §4.4 banner-conditioning clarification flagged).
traces-to:
  - "Idea §4.1 — Mode posture"
  - "Idea §4.2 — Always-Ask codification (closes auto-mode-silence-vs-always-ask backlog)"
  - "Idea §4.3 — maxIter=3, evaluate.mode: always, Preparation runs, full MEMORIZATION, discuss.mode user/agent split, single mode question"
  - "Idea §4.4 — maxIterations exhaustion silence; banner conditioning; per-step evaluate.mode skip is power-user override"
  - "Idea §7.3 auto-mode.md Update row"
requires: []
files:
  - { path: ".gobbi/projects/gobbi/skills/orchestration/auto-mode.md", op: modify }  # in-place overwrite of placeholder
out-of-scope-files:
  - .claude/skills/orchestration/auto-mode.md  # mirror symlink — auto-reflects
  - discussion/SKILL.md (referenced only, not edited)
  - any harness-side banner injection code (R8 deferred)
pre-resolved-decisions:
  - Always-Ask matrix lives in discussion/SKILL.md § Decision Classification — auto-mode.md REFERENCES, does not duplicate
  - 3 Always-Ask categories: Design / Scope / Destructive (fire AskUserQuestion regardless of discuss.mode: agent)
  - One example per category specific to Auto (mid-Planning library choice / mid-Execution out-of-scope path / mid-Wrap-up git reset --hard)
  - Pointer to planning/SKILL.md § Core Principles § USER CHALLENGE
  - maxIterations exhaustion does NOT interrupt — surfaces in Wrap-up (current SKILL.md 405 contract preserved)
  - Auto banner's "bias toward working without stopping" is conditioned by Always-Ask
success-criteria:
  - auto-mode.md ≥ 80 lines (placeholder was 636 bytes / ~17 lines)
  - Contains exactly three Always-Ask categories named (Design / Scope / Destructive) with one Auto-mode example each
  - References discussion/SKILL.md § Decision Classification with a precise anchor (path + section name)
  - References planning/SKILL.md § Core Principles § USER CHALLENGE
  - Restates the four §4.3 Auto defaults (maxIter / evaluate / Preparation runs / full MEMORIZATION / discuss user-or-agent split)
  - Documents §4.4 banner-conditioning note explicitly
verification-commands:
  # Common variables — absolute paths (G3); no placeholders
  - "F2=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md; M2=/playinganalytics/git/gobbi/.claude/skills/orchestration/auto-mode.md"
  # PRE-FLIGHT — mirror symlink intact BEFORE the edit (F6 + G3)
  - "test -L \"$M2\" && echo SYMLINK_OK || { echo BROKEN; exit 1; }"
  # POST-EDIT — binary assertions (F3 + G3 absolute paths)
  - "[ \"$(wc -l < \"$F2\")\" -ge 80 ] && echo OK_lines || echo FAIL_lines"
  - "[ \"$(grep -cE 'Design|Scope|Destructive' \"$F2\")\" -ge 3 ] && echo OK_categories || echo FAIL_categories"
  - "[ \"$(grep -c 'discussion/SKILL.md' \"$F2\")\" -ge 1 ] && echo OK_discussion_ref || echo FAIL_discussion_ref"
  - "[ \"$(grep -c 'USER CHALLENGE' \"$F2\")\" -ge 1 ] && echo OK_user_challenge || echo FAIL_user_challenge"
  - "[ \"$(grep -c 'Always-Ask' \"$F2\")\" -ge 3 ] && echo OK_always_ask || echo FAIL_always_ask"
  - "test -L \"$M2\" && echo OK_symlink_intact || echo FAIL_symlink"
estimated-risk: Low
risk-rationale: Auto-mode is structurally unchanged; spec is a codification pass — no new state-machine surface, no new schema. Main hazard is mis-citing the Always-Ask matrix path (must be `discussion/SKILL.md § Decision Classification`, not §Discussion or §Decisions). Sub-step E grep catches it.
agent: executor
required-skills:
  - principles
  - mistake
  - execution
  - discussion
  - planning
required-mistakes:
  - mistakes/skills-mirror-symlinks-not-copies.md
  - mistakes/section-order-is-part-of-the-contract-not-just-the-set.md
```

### T4 — Bundle Chat + Auto default-sets in `settings.default.json`

Note: `.claude/skills/claude/SKILL.md` is intentionally absent (FLAG-2 in gobbi/SKILL.md § Skill Map; refer to `.claude/CLAUDE.md` directly for the doc-authoring standard until the row resolves). (G5)

```yaml
id: 04-settings-default-bundled
what: Edit orchestration/templates/settings.default.json to ship two bundled default-sets (Chat + Auto) keyed by mode at the top of the file; preserve every field from the Idea §5 table (Chat preparation.maxIterations: 0 → R1 Skipped; Auto preparation.maxIterations: 3); preserve the existing models.* block unmodified (Finding #8 deferred); no resolver code is touched.
traces-to:
  - "Idea §5 — Defaults table (exhaustive Chat vs Auto)"
  - "Idea §5 R1 footnote — preparation.maxIterations: 0 → state: Skipped at loop entry"
  - "Idea §7.3 settings.default.json Update row"
requires: []  # JSON edit independent of T1/T2/T3
files:
  - { path: ".gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json", op: modify }
out-of-scope-files:
  - any resolver/cascade source code reading this template (§2 Out-of-Scope; F-R1 deferred)
  - models.* block contents (Finding #8 — drift fix deferred to T7's new backlog)
pre-resolved-decisions:
  - Same schema, two default-sets; mode at top of file is dispatch key (brief lock #8)
  - Chat: ideation/planning/execution/wrap-up maxIterations = 2/2/2/1; preparation maxIterations = 0
  - Auto: ideation/preparation/planning/execution maxIterations = 3; wrap-up = 1
  - Both: every evaluate.mode = "always"; every discuss.mode per Idea §5 table
  - R1: 0 in JSON is NOT an error; it's the documented Skipped trigger (rationale lives in chat-mode.md / SKILL.md, not in JSON)
  - models.* block: leave unchanged (Finding #8 deferred — out-of-scope here)
success-criteria:
  - File parses as valid JSON (`jq . settings.default.json` exits 0)
  - Contains both a chat default-set and an auto default-set
  - Chat preparation.maxIterations === 0
  - Auto preparation.maxIterations === 3
  - All evaluate.mode === "always" in both sets
  - models.* block is byte-for-byte unchanged vs pre-T4 baseline (no Finding #8 collateral edit)
verification-commands:
  # Common variables — absolute paths (G3) + worktree
  - "WT=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb; F4=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json"
  # PRE-FLIGHT — capture before-state rev as bash variable (G4 — no /tmp/*); MUST run BEFORE any edit
  - "PRE_T4_REV=$(git -C \"$WT\" rev-parse HEAD); echo \"Pre-T4 rev = $PRE_T4_REV\""
  # POST-EDIT — binary assertions (F3 + G3)
  - "jq . \"$F4\" > /dev/null && echo OK_valid_json || echo FAIL_json"
  # G1 — explicit mode-key extraction (no recursive jq); exactly two top-level mode keys: chat + auto
  - "[ \"$(jq -r '.chat.mode' \"$F4\")\" = \"chat\" -a \"$(jq -r '.auto.mode' \"$F4\")\" = \"auto\" ] && echo OK_MODE_KEYS || echo FAIL_MODE_KEYS"
  - "[ \"$(jq -r '.chat.workflow.preparation.maxIterations' \"$F4\")\" = \"0\" -a \"$(jq -r '.auto.workflow.preparation.maxIterations' \"$F4\")\" = \"3\" ] && echo OK_maxIter || echo FAIL_maxIter"
  # G6 — printf comparison for evaluate.mode (no triple-escape jq embedded JSON literals)
  - "[ \"$(jq -r '.chat.workflow.ideation.evaluate.mode, .auto.workflow.ideation.evaluate.mode' \"$F4\")\" = \"$(printf 'always\\nalways')\" ] && echo OK_EVAL_MODE || echo FAIL_EVAL_MODE"
  # G2 — semantic models-block-unchanged guard via git-show pre-state (no diff-line grep)
  - "[ \"$(jq -S '.chat.models' \"$F4\")\" = \"$(git -C \"$WT\" show \"$PRE_T4_REV:.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json\" | jq -S '.models')\" -a \"$(jq -S '.auto.models' \"$F4\")\" = \"$(git -C \"$WT\" show \"$PRE_T4_REV:.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json\" | jq -S '.models')\" ] && echo OK_MODELS_UNCHANGED || echo FAIL_MODELS_CHANGED"
estimated-risk: Medium
risk-rationale: JSON structural decision — single file with two top-level blocks vs two-key dispatch shape is L-S1 (Idea §8) tactical. Executor picks the on-disk packaging; risk is choosing a shape that breaks an unseen resolver-cascade reader. If JSON-only proves insufficient (resolver code reads single-block shape), executor escalates NEEDS_CONTEXT (F-R1). Bootstrap-path (selecting Chat default-set before settings.mode is resolved) is solved by §6.2 dispatch-at-Step-1-completion — executor follows that contract.
agent: executor
required-skills:
  - principles
  - mistake
  - execution
required-mistakes:
  - mistakes/skills-mirror-symlinks-not-copies.md  # templates/ also mirror-symlinked
```

### T5 — Add `workflow.chat.tasks[]` to `state.template.json` + `session.template.json`

Note: `.claude/skills/claude/SKILL.md` is intentionally absent (FLAG-2 in gobbi/SKILL.md § Skill Map; refer to `.claude/CLAUDE.md` directly for the doc-authoring standard until the row resolves). (G5)

```yaml
id: 05-templates-chat-tasks-array
what: Additively extend orchestration/templates/state.template.json and orchestration/templates/session.template.json with workflow.chat: { tasks: [] } per Idea §6.7 schema; the existing workflow.{loop} shape stays untouched for Auto.
traces-to:
  - "Idea §6.7 — workflow.chat.tasks[] schema (R2 + R3 lock)"
  - "Idea §7.3 state.template.json + session.template.json Update rows"
  - "Idea §5 R2/R3 footnote"
requires: []  # additive JSON change, no upstream/downstream lock
files:
  - { path: ".gobbi/projects/gobbi/skills/orchestration/templates/state.template.json", op: modify }
  - { path: ".gobbi/projects/gobbi/skills/orchestration/templates/session.template.json", op: modify }
out-of-scope-files:
  - any reader code parsing these templates
  - the existing workflow.{loop} fields (preserved as-is — additive only)
pre-resolved-decisions:
  - R2+R3: `workflow.chat: { tasks: [] }` added at the same path in both templates
  - Empty array on bootstrap; Auto sessions ship the same templates and leave tasks[] empty (codex-struct-6f11d0e9 addressed)
  - Per-task entry sub-schema per Idea §6.7: taskNo / slug / startedAt / finishedAt / ideation / preparation / planning / execution / taskRecord (each sub-record matches existing workflow.{loop} shape)
success-criteria:
  - Both files parse as valid JSON
  - Both contain a top-level workflow.chat.tasks key with empty array as its value
  - Existing workflow.{loop} fields byte-for-byte preserved (additive-only change)
  - No new top-level keys outside workflow.chat (no schema bleed)
verification-commands:
  # Common variables — absolute paths (G3) + worktree
  - "WT=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb; F5_STATE=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/orchestration/templates/state.template.json; F5_SESSION=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json"
  # PRE-FLIGHT — capture before-state rev as bash variable (G4 — no /tmp/*); MUST run BEFORE any edit
  - "PRE_T5_REV=$(git -C \"$WT\" rev-parse HEAD); echo \"Pre-T5 rev = $PRE_T5_REV\""
  # POST-EDIT — binary assertions (F3 + G3)
  - "jq . \"$F5_STATE\" > /dev/null && echo OK_state_valid || echo FAIL_state"
  - "jq . \"$F5_SESSION\" > /dev/null && echo OK_session_valid || echo FAIL_session"
  - "[ \"$(jq -c '.workflow.chat.tasks' \"$F5_STATE\")\" = '[]' ] && echo OK_state_tasks || echo FAIL_state_tasks"
  - "[ \"$(jq -c '.workflow.chat.tasks' \"$F5_SESSION\")\" = '[]' ] && echo OK_session_tasks || echo FAIL_session_tasks"
  # Additive-only: zero deletions in state.template.json vs CAPTURED pre-edit rev (G4 in-session var; no /tmp)
  - "[ \"$(git -C \"$WT\" diff -U0 \"$PRE_T5_REV\" -- \"$F5_STATE\" | grep '^-' | grep -v '^---' | wc -l)\" = \"0\" ] && echo OK_state_additive || echo FAIL_state_deletions"
  # Additive-only: zero deletions in session.template.json vs CAPTURED pre-edit rev (G4 + F5 symmetric)
  - "[ \"$(git -C \"$WT\" diff -U0 \"$PRE_T5_REV\" -- \"$F5_SESSION\" | grep '^-' | grep -v '^---' | wc -l)\" = \"0\" ] && echo OK_session_additive || echo FAIL_session_deletions"
estimated-risk: Low
risk-rationale: Smallest task; additive schema only. Hazard is forgetting one of the two templates or putting the array at the wrong nesting level. Both grepped in verification.
agent: executor
required-skills:
  - principles
  - mistake
  - execution
required-mistakes: []
```

### T3 — Amend `orchestration/SKILL.md` (8 anchor changes)

Note: `.claude/skills/claude/SKILL.md` is intentionally absent (FLAG-2 in gobbi/SKILL.md § Skill Map; refer to `.claude/CLAUDE.md` directly for the doc-authoring standard until the row resolves). (G5)

```yaml
id: 03-skill-md-amendment
what: Apply the 8 SKILL.md Update-row anchor changes per Idea §7.3 + §6.1-§6.7 shape (consolidated CORRECTION block at § Orchestration Mode head; trim Chat / Auto inline blocks to one-sentence + link; mode-dispatch branch description before Step 1; replace § Inter-loop transition table; strike-through line 241 (second sentence) + CORRECTION inline; add Chat-mode rendering sub-section to § Workflow Status Display; add per-task user review gate to § Mode-specific gates within a loop; expand § Workflow State Machine with mode-dispatch branch; add workflow.chat.tasks[] schema to § Workflow Metadata + § State persistence).
traces-to:
  - "Idea §6.1 — Locked-constraint supersession (shape only)"
  - "Idea §6.2 — New state-machine description (shape only)"
  - "Idea §6.3 — Workflow Status Display update (shape only)"
  - "Idea §6.4 — Mode-specific gates update (shape only) — per-task user review gate, discuss-first shadows discuss.mode"
  - "Idea §6.5 — Inter-loop transition update (shape only)"
  - "Idea §6.6 — ADR-style supersession note placement"
  - "Idea §6.7 — Workflow Metadata workflow.chat.tasks[] schema"
  - "Idea §7.3 — 8 SKILL.md Update rows"
requires: [01-chat-mode-canonical-spec, 02-auto-mode-canonical-spec]
# Rationale: T3 cross-references chat-mode.md and auto-mode.md by name AND content (worked Status-Display example backed by T1; Always-Ask paragraph backed by T2). Doing T3 before T1/T2 forces forward references that won't resolve at write time.
files:
  - { path: ".gobbi/projects/gobbi/skills/orchestration/SKILL.md", op: modify }  # 459 lines → +~80 lines amendment
out-of-scope-files:
  - .claude/skills/orchestration/SKILL.md  # mirror symlink — auto-reflects
  - CLAUDE.md (workspace + project) — confirmed no Iron Law touch needed (Idea §7.2)
  - any of the workflow/*.md sub-documents
  - memorization/SKILL.md (R5 lock)
  - discussion/SKILL.md (referenced only)
pre-resolved-decisions:
  - 8 anchor points (lines 62-76 / 80-84 / 234-241 / line 241 (second sentence) / 245-290 / 387-405 / 338-405 State Machine / 426+ Metadata) per Idea §7.3 — F4 correction: the lock is on line 241 only (single line containing two sentences), NOT lines 241-242; verification uses grep-anchors not line numbers (which is already T3's discipline — the prose reference must say "line 241 (second sentence)" so future readers don't grep at line 242)
  - Strike-through + CORRECTION pattern from mistakes/design-literal-retire-instruction-without-replacement.md
  - ADR-style CORRECTION block at head of § Orchestration Mode (Idea §6.6)
  - SKILL.md gains the mode-dispatch DECLARATION; full per-mode procedure lives in sub-docs (declared-here / specified-there pattern)
  - R1 `0 → Skipped` mapping appears at the state-machine layer (Idea §6.2)
  - workflow.chat.tasks[] schema added additively (Idea §6.7); existing workflow.{loop} shape preserved
  - The fourth Chat-mode gate (per-task user review gate) is the new gate (Idea §6.4)
  - Auto-mode rendering of Workflow Status Display is UNCHANGED — only Chat gets a new sub-section / pointer
  - SKILL.md is the workflow-governor; mode docs are the per-mode specs (auth-direction rule F-S1 is NOT pre-authored here — left to mode docs if needed)
  - Idea §6 is "shape only" — verbatim prose is the executor's job, NOT pre-baked from §6.1/§6.6's iter1 illustrative text (Idea Finding F-P1 boundary)
success-criteria:
  - 8 distinct anchor edits land — one per Idea §7.3 Update row touching SKILL.md
  - Original line 241 (second sentence) text "Mode controls user gates; it does not relax the workflow." present but struck through (e.g., wrapped in ~~...~~ or HTML <s> with adjacent CORRECTION note)
  - At least one block contains the word "CORRECTION" in § Orchestration Mode area
  - Chat / Auto inline blocks (lines 66-70 + 72-76) now contain a link to chat-mode.md / auto-mode.md respectively
  - § Inter-loop transition table contains TWO Chat transitions (within-slice + at-task-boundary)
  - § Mode-specific gates within a loop names the fourth Chat gate (per-task user review gate)
  - § Workflow Metadata / State persistence contains the workflow.chat.tasks[] schema additively
  - Sub-step E spec-coverage check: each of the 8 §7.3 anchors maps to exactly one applied edit
verification-commands:
  # Common variables — absolute paths (G3)
  - "F3F=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/orchestration/SKILL.md; M3=/playinganalytics/git/gobbi/.claude/skills/orchestration/SKILL.md"
  # PRE-FLIGHT — mirror symlink intact BEFORE the edit (F6 + G3)
  - "test -L \"$M3\" && echo SYMLINK_OK || { echo BROKEN; exit 1; }"
  # POST-EDIT — binary assertions (F3 + G3). Grep-anchors throughout (F4 — never absolute line numbers in verification)
  - "[ \"$(grep -nE 'CORRECTION|2026-05-28' \"$F3F\" | wc -l)\" -ge 1 ] && echo OK_correction_present || echo FAIL_no_correction"
  - "[ \"$(grep -cE '~~|<s>' \"$F3F\")\" -ge 1 ] && echo OK_struck_through || echo FAIL_no_strike"
  - "[ \"$(grep -c 'Mode controls user gates' \"$F3F\")\" -ge 1 ] && echo OK_original_preserved || echo FAIL_original_missing"
  - "[ \"$(grep -cE 'chat-mode\\.md|auto-mode\\.md' \"$F3F\")\" -ge 4 ] && echo OK_subdoc_links || echo FAIL_links"
  - "[ \"$(grep -cE 'workflow\\.chat\\.tasks' \"$F3F\")\" -ge 1 ] && echo OK_schema_present || echo FAIL_schema"
  - "[ \"$(grep -cE 'per-task user review gate|Next task.*Revise.*Wrap up' \"$F3F\")\" -ge 1 ] && echo OK_new_gate || echo FAIL_no_new_gate"
  - "[ \"$(grep -cE 'Skipped.*loop entry|0.*Skipped|state: Skipped' \"$F3F\")\" -ge 1 ] && echo OK_R1_mapping || echo FAIL_no_R1"
  - "test -L \"$M3\" && echo OK_mirror_intact || echo FAIL_mirror"
estimated-risk: High
risk-rationale: 8 anchor edits on a 459-line file is the densest task. Multiple risks: (a) anchor-line numbers may drift as earlier edits land — executor must work top-down or use grep anchors not line numbers; (b) strike-through formatting (Markdown lacks native strike — likely `~~...~~` or `<s>...</s>`) — pick one and use consistently per mistakes/section-order-is-part-of-the-contract-not-just-the-set.md; (c) the boundary between "shape-only" Idea §6 spec and executor's prose authoring is real — executor must NOT lift iter1 verbatim text from §6.1/§6.6 (Finding F-P1); (d) F4 correction — the existing lock is on line 241 only (single line, two sentences); references in this Plan say "line 241 (second sentence)" not "lines 241-242" (grep-verified). Sub-step E spec-coverage check is the safety net.
agent: executor
required-skills:
  - principles
  - mistake
  - execution
  - orchestration
required-mistakes:
  - mistakes/design-literal-retire-instruction-without-replacement.md  # the strike-through + CORRECTION precedent
  - mistakes/section-order-is-part-of-the-contract-not-just-the-set.md
  - mistakes/skills-mirror-symlinks-not-copies.md
```

### T7 — File new backlog for `delegation/SKILL.md` ↔ `settings.default.json` drift

```yaml
id: 07-backlog-delegation-settings-drift
what: Create a new backlog file documenting the upstream drift between delegation/SKILL.md § Model Selection (executor=sonnet / evaluator=opus per the in-skill table) and settings.default.json lines 31-45 (executor=opus / evaluator=sonnet per on-disk default); Finding #8 from Idea iter1 evaluators; the redesign defers fix to a separate backlog rather than baking either inversion into chat-mode.md / auto-mode.md prose.
traces-to:
  - "Idea §5 footnote (Finding #8 acknowledgement)"
  - "Idea §8 Finding #8 — partially-addressed-as-deferred"
  - "Idea §2 Deferred — Upstream drift between delegation/SKILL.md § Model Selection and settings.default.json (Finding #8)"
requires: []
files:
  - { path: ".gobbi/projects/gobbi/backlogs/model-assignment-drift-delegation-vs-settings-default.md", op: create }
out-of-scope-files:
  - delegation/SKILL.md (NOT edited — drift fix is for the new backlog's eventual session)
  - templates/settings.default.json models block (NOT edited — out-of-scope per Idea §2 + T4 success criteria)
pre-resolved-decisions:
  # F8 — slug rule quoted inline (not just cited): "slug uses positive descriptiveness (kebab-case subject; not the record's position-in-list)". Suggested slug per F8: `model-assignment-drift-delegation-vs-settings-default`. Source: memorization/rules.md §1.3.
  - Backlog naming per memorization/rules.md §1.3 — "slug uses positive descriptiveness (kebab-case subject; not the record's position-in-list)". Chosen slug: model-assignment-drift-delegation-vs-settings-default (subject = the drift, kebab-case, not "drift-1" or "model-mismatch")
  - status: active / disposition: open / created: 2026-05-28 / origin: Idea iter1 Finding F-C1 + iter2 §8 Finding #8
  - Body cites BOTH sources: delegation/SKILL.md § Model Selection (the table) AND settings.default.json (the on-disk values) with their respective claims
  - Resolution decision (which is canonical) is NOT made in the backlog — that is the work for the eventual session it gets picked up by
success-criteria:
  - File exists at .gobbi/projects/gobbi/backlogs/model-assignment-drift-delegation-vs-settings-default.md
  - Frontmatter conforms to backlog template conventions (status / disposition / created / origin / type)
  - Body cites the two source-of-truth paths and their conflicting claims
  - Body explicitly says the redesign session deferred fix
  - Slug is subject-descriptive (passes memorization/rules.md §1.3 naming check; F8 inline quote)
verification-commands:
  # Common variables — absolute path (G3)
  - "F7=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/backlogs/model-assignment-drift-delegation-vs-settings-default.md"
  # POST-CREATE — binary assertions (F3 + G3)
  - "test -f \"$F7\" && echo OK_file || echo FAIL_missing"
  - "[ \"$(grep -cE 'delegation/SKILL.md|settings.default.json' \"$F7\")\" -ge 2 ] && echo OK_both_sources || echo FAIL_sources"
  - "[ \"$(grep -c 'status: active' \"$F7\")\" = \"1\" ] && echo OK_status || echo FAIL_status"
  - "[ \"$(grep -c 'disposition: open' \"$F7\")\" = \"1\" ] && echo OK_disposition || echo FAIL_disposition"
  - "[ \"$(grep -c '2026-05-28' \"$F7\")\" -ge 1 ] && echo OK_date || echo FAIL_date"
estimated-risk: Low
risk-rationale: 5-minute task. Only risk is slug-naming — `delegation-settings-drift.md` would be too terse; the subject-descriptive name `model-assignment-drift-delegation-vs-settings-default` follows the rule quoted inline (F8): "slug uses positive descriptiveness (kebab-case subject; not the record's position-in-list)" — per memorization/rules.md §1.3. Executor should check an existing backlog file (e.g., the two being archived in T6) for the canonical frontmatter shape.
agent: executor
required-skills:
  - principles
  - mistake
  - memorization
required-mistakes:
  - mistakes/section-order-is-part-of-the-contract-not-just-the-set.md  # naming-discipline-adjacent
```

### T6 — Archive 2 closed backlogs (Wrap-up phase)

```yaml
id: 06-archive-closed-backlogs
what: At Wrap-up phase, archive the two backlog files that close on ship — chat-mode-tiki-taka-redesign.md (closed by T1+T3) and auto-mode-silence-vs-always-ask.md (closed by T2+T3) — per memorization/templates/archive.md move-on-terminal procedure.
traces-to:
  - "Idea §9 — Backlogs closed"
  - "Idea §7.3 — last two Update rows (frontmatter stamping)"
  - "Idea §2 Success Criteria 6 (Wrap-up archives both backlog files)"
requires: [01-chat-mode-canonical-spec, 02-auto-mode-canonical-spec, 03-skill-md-amendment]
# Rationale: backlog "closed" claim is only true once chat-mode.md, auto-mode.md, AND the SKILL.md amendment have shipped.
files:
  - { path: ".gobbi/projects/gobbi/backlogs/chat-mode-tiki-taka-redesign.md", op: modify }  # frontmatter stamp
  - { path: ".gobbi/projects/gobbi/backlogs/auto-mode-silence-vs-always-ask.md", op: modify }  # frontmatter stamp
  - { path: ".gobbi/projects/gobbi/archive/backlogs/2026-MM-DD-chat-mode-tiki-taka-redesign.md", op: create }  # via git mv (path moves, file content preserved)
  - { path: ".gobbi/projects/gobbi/archive/backlogs/2026-MM-DD-auto-mode-silence-vs-always-ask.md", op: create }  # via git mv
out-of-scope-files:
  - any other backlog file (no collateral closures — T7 creates a NEW backlog and that one is NOT archived)
pre-resolved-decisions:
  - move-on-terminal procedure per memorization/templates/archive.md (project convention, no physical delete)
  - Frontmatter additions: archived_at: 2026-MM-DD (ship date), archive_reason: addressed, status: closed, disposition: addressed, shipped_in: <PR or merge SHA>
  - Body of each backlog preserved verbatim
  - Inbound references checked via `rg` — Idea §9 step 3 (none expected)
success-criteria:
  - Both old paths no longer present (or present only as a git history entry — git mv preserves history)
  - Both new archive/backlogs/2026-MM-DD-{slug}.md paths exist
  - Each archived file's frontmatter shows status: closed, disposition: addressed, shipped_in: <ref>
  - Wrap-up session handoff lists both closures
verification-commands:
  # Common variables — absolute paths (G3); archive filename date stamped on-ship by wrap-up
  - "WT=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb; OLD_CHAT=\"$WT/.gobbi/projects/gobbi/backlogs/chat-mode-tiki-taka-redesign.md\"; OLD_AUTO=\"$WT/.gobbi/projects/gobbi/backlogs/auto-mode-silence-vs-always-ask.md\"; ARCHIVE_DIR=\"$WT/.gobbi/projects/gobbi/archive/backlogs\""
  # POST-ARCHIVE — binary assertions (F3 + G3)
  - "test ! -e \"$OLD_CHAT\" && echo OK_old_chat_gone || echo FAIL_old_chat_present"
  - "test ! -e \"$OLD_AUTO\" && echo OK_old_auto_gone || echo FAIL_old_auto_present"
  - "[ \"$(find \"$ARCHIVE_DIR\" -name '*chat-mode-tiki-taka-redesign*' | wc -l)\" -ge 1 ] && echo OK_archive_chat || echo FAIL_archive_chat"
  - "[ \"$(find \"$ARCHIVE_DIR\" -name '*auto-mode-silence-vs-always-ask*' | wc -l)\" -ge 1 ] && echo OK_archive_auto || echo FAIL_archive_auto"
  - "[ \"$(find \"$ARCHIVE_DIR\" -name '*chat-mode-tiki-taka-redesign*' -exec grep -c 'status: closed' {} \\;)\" = \"1\" ] && echo OK_chat_closed || echo FAIL_chat_status"
  - "[ \"$(find \"$ARCHIVE_DIR\" -name '*auto-mode-silence-vs-always-ask*' -exec grep -c 'status: closed' {} \\;)\" = \"1\" ] && echo OK_auto_closed || echo FAIL_auto_status"
  - "[ \"$(rg -l 'chat-mode-tiki-taka-redesign|auto-mode-silence-vs-always-ask' \"$WT\" | grep -v archive | wc -l)\" = \"0\" ] && echo OK_no_stale_refs || echo FAIL_stale_refs"
estimated-risk: Low
risk-rationale: Mechanical archive following a documented procedure. Hazard is forgetting to repoint an inbound reference — verification command `rg -l` outside archive/ catches it. The wrap-up-assistant owner makes this lower-risk than asking an executor to do it (the assistant has wrap-up workflow context).
agent: wrap-up assistant
required-skills:
  - principles
  - mistake
  - wrap-up
  - memorization
required-mistakes: []
```

---

## 4. Plan-level Acceptance Test

The cross-task gate the entire Plan must pass after Execution completes (T1-T5 + T7) and before Wrap-up's T6 runs. Run from the worktree root.

**F7 correction (carried from iter2):** All `git diff` baselines use `develop..HEAD`, NOT `main..HEAD`. The session branch (`chore/session-2026-05-28-8eed14fb`) descends from `develop`; using `main..HEAD` would inflate the diff scope to include all develop commits since main.

```bash
WT=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb

# 1. Symlinks remain symlinks (skills-mirror-symlinks-not-copies discipline)
for f in chat-mode.md auto-mode.md SKILL.md; do
  test -L "$WT/.claude/skills/orchestration/$f" || { echo "FAIL: $f is not a symlink"; exit 1; }
done

# 2. Mirror symlinks resolve to canonical files (binary assertion — F3)
[ "$(find -L "$WT/.claude/skills/orchestration" -maxdepth 1 -name '*-mode.md' | wc -l)" = "2" ] && echo OK_2_mode_docs || { echo "FAIL: mode docs count"; exit 1; }

# 3. All three JSON files parse
for f in settings.default.json state.template.json session.template.json; do
  jq . "$WT/.gobbi/projects/gobbi/skills/orchestration/templates/$f" > /dev/null || { echo "FAIL: $f invalid JSON"; exit 1; }
done

# 4. Cross-doc links resolve (binary assertions — F3)
[ "$(grep -c 'memorization/SKILL.md' "$WT/.gobbi/projects/gobbi/skills/orchestration/chat-mode.md")" -ge 1 ] && echo OK_chat_links_memorization || { echo FAIL_chat_memorization; exit 1; }
[ "$(grep -c 'discussion/SKILL.md' "$WT/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md")" -ge 1 ] && echo OK_auto_links_discussion || { echo FAIL_auto_discussion; exit 1; }
[ "$(grep -cE 'chat-mode\.md|auto-mode\.md' "$WT/.gobbi/projects/gobbi/skills/orchestration/SKILL.md")" -ge 4 ] && echo OK_skill_subdoc_links || { echo FAIL_skill_subdoc; exit 1; }

# 5. R1 lock visible in two anchored places (binary assertions — F3)
[ "$(grep -cE 'Skipped.*loop entry|state: Skipped|maxIterations.*0' "$WT/.gobbi/projects/gobbi/skills/orchestration/SKILL.md")" -ge 1 ] && echo OK_R1_in_skill || { echo FAIL_R1_skill; exit 1; }
[ "$(grep -cE 'Skipped.*loop entry|state: Skipped|maxIterations.*0' "$WT/.gobbi/projects/gobbi/skills/orchestration/chat-mode.md")" -ge 1 ] && echo OK_R1_in_chat || { echo FAIL_R1_chat; exit 1; }

# 6. workflow.chat.tasks[] schema present in BOTH templates (binary assertions — F3)
[ "$(jq -c '.workflow.chat.tasks' "$WT/.gobbi/projects/gobbi/skills/orchestration/templates/state.template.json")" = "[]" ] && echo OK_state_chat_tasks || { echo FAIL_state_chat_tasks; exit 1; }
[ "$(jq -c '.workflow.chat.tasks' "$WT/.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json")" = "[]" ] && echo OK_session_chat_tasks || { echo FAIL_session_chat_tasks; exit 1; }

# 7. No-bleed check — memorization/SKILL.md NOT edited (R5 lock; D-A reaffirms) — F7: develop..HEAD
git -C "$WT" diff --name-only develop..HEAD | grep -E 'memorization/SKILL.md$' && { echo "FAIL: memorization/SKILL.md touched"; exit 1; } || echo OK_memorization_untouched

# 8. No-bleed check — discussion/SKILL.md NOT edited (referenced only) — F7: develop..HEAD
git -C "$WT" diff --name-only develop..HEAD | grep -E 'discussion/SKILL.md$' && { echo "FAIL: discussion/SKILL.md touched"; exit 1; } || echo OK_discussion_untouched

# 9. New backlog landed (T7) — F8 slug
test -f "$WT/.gobbi/projects/gobbi/backlogs/model-assignment-drift-delegation-vs-settings-default.md" && echo OK_backlog_landed || { echo FAIL_backlog_missing; exit 1; }
```

Plan-level acceptance is binary — all 9 checks pass or the Plan fails and Execution re-enters via REVISE.

---

## 5. Risks + unknowns (Plan-level)

| # | Risk | Severity | Note |
|---|---|---|---|
| P-R1 | T3 anchor-line drift during multi-edit | Medium | Executor MUST use grep-anchors / section headers, not absolute line numbers, since earlier T3 sub-edits invalidate later line counts. Confirmed in T3 risk-rationale. F4 note: prose references use "line 241 (second sentence)" — grep on the literal sentence, not the offset. |
| P-R2 | T1 R5 four-bullet skeleton drift | Medium | The §3.3 four-bullet structure is the most-likely place a long-form executor invents a fifth bullet or merges two — verification command for T1 explicitly counts the four phrases. |
| P-R3 | T4 settings JSON shape (single block with two keys vs two top-level dispatch keys) | Medium | L-S1 tactical decision — executor picks; if resolver code reads only single-block shape, executor surfaces NEEDS_CONTEXT (F-R1). Plan-level acceptance test #3 (JSON valid) catches gross errors but not resolver-compat issues — those surface at first post-merge Chat session. |
| P-R4 | T6 inbound-reference scan misses an exotic link (e.g., a links table in a notes file) | Low | The `rg -l` outside archive/ verification command catches kebab-slug substring matches; a fuzzy-anchored reference (e.g., "the chat-mode backlog") could escape — accepted residual risk. |
| P-R5 | Chat session's first post-merge run (Idea §2 Success Criteria 3-5) is a deferred validation gate, NOT in this Plan's Execution scope | Low | The first Chat session is a future session's signal. This Plan ships the design; the falsifying observation is a separate-session concern. Documented for Wrap-up handoff. |
| P-R6 | Mirror symlinks for chat-mode.md / auto-mode.md verified ONLY for current worktree | Low | Idea Finding #9 dispute showed Codex's iter1 main-tree cwd produced a false-positive "files don't exist". If Execution runs in a different worktree, executor MUST re-verify the symlink + canonical-file pair as a pre-flight (R12 in Idea §8). F6 mirror: T1 / T2 / T3 now each carry the pre-flight `test -L .../<file>.md` check as the first verification-command line — broken symlink aborts the task before any edit. |
| P-R7 | T1's worked Status Display example assumes a Chat session shape that doesn't yet exist on disk | Medium | The example is illustrative — executor writes it from the schema (D-B + §6.7), not from a real session. Risk: the schema and the example drift. Mitigation: schema citation in the example caption. |
| P-R8 | G4 `PRE_T4_REV` / `PRE_T5_REV` subshell-scope hazard | Low | Bash variables are process-local; if executor wraps verification in a subshell (`bash -c '...'` or pipeline that forks the parent), the captured rev evaporates. Mitigation: §3 head G4 note instructs to re-capture at the new shell's start or `export PRE_T4_REV` from the parent shell. |

**Plan-level unknowns I noticed beyond per-task risks:**

- **`.claude/` mirror cardinality.** The two new mode docs already have mirror symlinks (verified by Idea §7.1 finding for Idea-iter2 leader). For SKILL.md, the symlink existed pre-redesign. T4 + T5 touch `templates/` — also confirmed mirror-symlinked. Plan-level test #1 covers the live state.
- **`plugins/` mirror: verified absent at HEAD (deleted in PR #264 pre-rebuild sweep); no plugin-side mirroring required for this redesign.** (F2 — replaces the stale `plugins/gobbi/skills/orchestration/{chat,auto}-mode.md` instruction from iter1. The two-system mirror model post-PR-264 is `.gobbi/...` canonical + `.claude/...` symlink only; the `plugins/` tree is not part of the live mirror set. No NEEDS_CONTEXT investigation required from executors.)
- **D-B layout's downstream implications.** D-B locks the outer key (`chat/tasks/{NN}-{slug}/{ideation,planning,execution}/{rawdata,staging,artifacts,evaluation}/`) but no Plan task explicitly creates a directory at that path — directories materialize at first-Chat-session-runtime. T1's task-record spec MUST cite D-B; T3's SKILL.md state-machine description SHOULD reference D-B (or at least cite chat-mode.md as the per-task layout spec). Documented in T1 + T3 success criteria.

---

## 6. Finding Disposition Table (iter1 + iter2 inheritance)

Per `evaluation/SKILL.md` Stage 1 disposition discipline. Each iter1/iter2 finding inherited into iter3 carries a fresh disposition with a section anchor pointing at where the fix landed (or `acknowledged` / `not-in-iter3-scope` for items outside the surgical brief).

| ID | Source | Sev / Conf | Disposition | Anchor in draft-iter3 |
|---|---|---|---|---|
| **F1** | Codex codex-overall-001 (iter1) | High / 100 | **addressed (carried)** | T1/T2/T3/T4/T5 `required-skills:` blocks plus G5-introduced NOTE prose ABOVE each task's YAML block — `claude` skill removed from YAML; NOTE references gobbi/SKILL.md line 187 FLAG-2 row + `.claude/CLAUDE.md` as the direct .claude/ doc-authoring reference. §6 cross-references no longer lists `.claude/skills/claude/SKILL.md`. |
| **F2** | Codex codex-overall-002 (iter1) | High / 100 | **addressed (carried)** | §5 Plan-level unknowns — `plugins/` row replaced with one-line "verified absent at HEAD (deleted in PR #264 pre-rebuild sweep); no plugin-side mirroring required". Stale `find plugins/...` NEEDS_CONTEXT instruction removed. |
| **F3** | Codex codex-overall-003 (iter1) | High / 100 | **addressed (carried)** | §3 — every `# expect ...` comment converted to a binary shell assertion of the form `[ "$(...)" -ge|-eq|= ... ] && echo OK || echo FAIL_<reason>` across T1, T2, T3, T4, T5, T6, T7. iter3 G4 supersedes iter2's `/tmp/*.txt` mechanism with in-session `PRE_T4_REV` / `PRE_T5_REV` bash variables. New "Before-state convention" preamble at top of §3 spells out the mechanism. §4 acceptance test items #2-#9 likewise converted. |
| **F4** | Claude F-CONS-1 (iter1) | Medium / 75 | **addressed (carried)** | T3 `what:`, `pre-resolved-decisions:`, `success-criteria:`, `risk-rationale:`, plus §5 P-R1 — every prose reference now says "line 241 (second sentence)" or "line 241". T3 verification still uses grep-anchors (already iter1's discipline). |
| **F5** | Codex codex-overall-004 (iter1) | Medium / 75 | **addressed (carried)** | T5 `verification-commands:` — symmetric `session.template.json` zero-deletions check (last verification line). Both `state.template.json` and `session.template.json` now carry parallel additive-only assertions, now keyed off the G4 `PRE_T5_REV` bash variable. |
| **F6** | Claude F-RISK-1 (iter1) | Medium / 50 | **addressed (carried)** | T1, T2, T3 `verification-commands:` — first line after the common-variables line is now the pre-flight `test -L "$M{1,2,3}" && echo SYMLINK_OK || { echo BROKEN; exit 1; }` check that aborts the task if the symlink is broken. G3 absolute paths substitute `$M1` / `$M2` / `$M3` for the placeholder. New "Pre-flight convention" preamble at top of §3 documents the idiom. §5 P-R6 cross-references the F6 mirror. |
| **F7** | Claude F-PROJ-1 (iter1) | Medium / 50 | **addressed (carried)** | §4 acceptance test items #7 and #8 — `main..HEAD` replaced with `develop..HEAD`. F7 explanatory preamble at top of §4 noting the session branch descends from develop. |
| **F8** | Claude F-USAGE-1 (iter1) | Medium / 50 | **addressed (carried)** | T7 `pre-resolved-decisions:`, `success-criteria:`, `risk-rationale:`, plus `files:` and the new-backlog slug across §3 / §4 / §5 / §6 — slug rule quoted inline as "slug uses positive descriptiveness (kebab-case subject; not the record's position-in-list)" per memorization/rules.md §1.3. Suggested slug `model-assignment-drift-delegation-vs-settings-default` adopted; all backlog-path references updated. |
| **G1** | Codex codex-risk-004 (iter2) | High / 100 | **addressed** | T4 `verification-commands:` — the recursive `jq '.. \| .mode? // empty'` form replaced with two explicit `jq -r '.chat.mode'` + `jq -r '.auto.mode'` extractions, compared against literal `"chat"` / `"auto"` via `[ ... = ... -a ... = ... ] && echo OK_MODE_KEYS || echo FAIL_MODE_KEYS`. No recursive walk; exact path. |
| **G2** | Codex codex-risk-006 (iter2) | High / 100 | **addressed** | T4 `verification-commands:` — diff-line-grep for `"models"` replaced with semantic `jq -S` comparison: post-edit `.chat.models` and `.auto.models` must both equal the pre-edit `.models` block read directly from `git show "$PRE_T4_REV:..."`. Structural equivalence, no text-line heuristics. |
| **G3** | Claude F-USAGE2-1 / Codex codex-usage-005 (iter2) | Medium / 100 | **addressed (regression closed)** | All `<chat-mode.md>` / `<auto-mode.md>` / `<settings.default.json>` / `<SKILL.md>` / `<state.template.json>` / `<session.template.json>` / `<new-backlog.md>` / `<archived-*-backlog>` / `<worktree>` / `<pre-T4-rev>` / `<pre-T5-rev>` placeholders eliminated from verification commands across T1-T7 and §4. Each task's verification block opens with a `F<n>=<absolute-path>` (and `M<n>=` for the mirror symlink) common-variable line; all subsequent commands reference `"$F<n>"` / `"$M<n>"` / `"$WT"`. Reference table per task per the brief: T1 chat-mode.md, T2 auto-mode.md, T3 SKILL.md, T4 settings.default.json, T5 both state.template.json and session.template.json. |
| **G4** | Codex codex-risk-005 (iter2) | Medium / 75 | **addressed** | T4 + T5 `verification-commands:` — `/tmp/t4-pre.txt` and `/tmp/t5-pre.txt` eliminated. Pre-edit rev captured as in-session bash variables `PRE_T4_REV` / `PRE_T5_REV` (via `git rev-parse HEAD`). Later references read the pre-edit content directly with `git -C "$WT" show "$PRE_T4_REV:<repo-relative-path>"` or compare diff hunks vs `"$PRE_T5_REV"`. §3 head note documents the subshell-scope caveat (re-capture or `export`). §5 P-R8 row added. |
| **G5** | Claude F-USAGE2-2 (iter2) | Low / 50 | **addressed** | T1/T2/T3/T4/T5 — the YAML-embedded NOTE comment moved OUT of the `required-skills:` block. Each affected task now carries a one-sentence note ABOVE the YAML block: "Note: `.claude/skills/claude/SKILL.md` is intentionally absent (FLAG-2 in gobbi/SKILL.md § Skill Map; refer to `.claude/CLAUDE.md` directly for the doc-authoring standard until the row resolves). (G5)" The YAML `required-skills:` block is now clean — lists only existing skills (principles / mistake / execution / etc.). §3 head also carries a "FLAG-2 note (applied by G5)" paragraph for cross-reference. |
| **G6** | Claude F-STRUCT2-3 (iter2) | Low / 75 | **addressed** | T4 `verification-commands:` — the triple-escaped jq line `'"[\\\"always\\\"]"'` replaced with a plain `printf` comparison: `[ "$(jq -r '.chat.workflow.ideation.evaluate.mode, .auto.workflow.ideation.evaluate.mode' "$F4")" = "$(printf 'always\nalways')" ] && echo OK_EVAL_MODE || echo FAIL_EVAL_MODE`. Extract with `-r`, compare with `=`, no embedded JSON literals, no nested escapes. |
| (lower-conf appendix) | Codex codex-overall-005 (iter1 low-conf) | Low / 25 | **acknowledged — not in iter3 scope** | Iter1 lower-confidence appendix items not enumerated in iter2's F1–F8 or iter3's G1-G6 brief are intentionally not addressed in this surgical pass per Stage-1 inheritance discipline. |
| (claude lower-conf) | Claude appendix items (iter1) | Low / 25 | **acknowledged — not in iter3 scope** | Same — preserved as inherited prior-iter content; no new mitigations applied here. |
| (iter2 lower-conf appendix) | Codex codex-* / Claude F-* items not in G1-G6 | Low / 25-50 | **acknowledged — not in iter3 scope** | Iter2 lower-confidence findings outside the iter3 surgical brief (G1-G6) are not addressed here. Iter3 is the cap iteration; any residuals route through Execution as NEEDS_CONTEXT if they re-surface. |

---

## Cross-references

- **Idea doc (locked input):** `<sessions>/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`
- **iter1 Idea draft (superseded baseline):** `<sessions>/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/rawdata/draft-iter1.md`
- **iter1 Idea evaluator outputs:** `<sessions>/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/evaluation/iter1/{claude,codex}/`
- **iter1 Plan draft (iter2 input):** `<sessions>/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/rawdata/draft-iter1.md`
- **iter2 Plan draft (this file's input):** `<sessions>/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/rawdata/draft-iter2.md`
- **iter1 Plan evaluator outputs (iter2 Stage 1 inheritance source):** `<sessions>/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/{claude,codex}/`
- **iter2 Plan evaluator outputs (iter3 Stage 1 inheritance source):** `<sessions>/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter2/{claude,codex}/`

- **Worktree root:** `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/`

- **Skills consulted by this Plan:**
  - `.claude/skills/principles/SKILL.md` — 13 Iron Laws (P1 think-before-acting; P13 spec-CRUD for doc work)
  - `.claude/skills/planning/SKILL.md` — Planning Loop procedure (this leader's contract)
  - `.claude/skills/orchestration/workflow/planning.md` — workflow phase doc
  - `.claude/skills/orchestration/SKILL.md` — target of T3
  - `.claude/skills/discussion/SKILL.md` — Always-Ask matrix referenced by T2
  - `.claude/skills/memorization/SKILL.md` + `memorization/rules.md` — T1's narrowed PASS-path base reference + slug-naming (T7's F8 inline quote source)
  - `.claude/skills/memorization/templates/archive.md` — T6's archive procedure
  - `.claude/skills/delegation/SKILL.md` — Inline-Paste Rule (cited by T1)
  - `.claude/CLAUDE.md` — direct reference for `.claude/` doc-authoring discipline + mirror-symlink reminders (F1 / G5 — replaces the dangling `.claude/skills/claude/SKILL.md` row from iter1; the `claude` skill does NOT exist per gobbi/SKILL.md line 187 FLAG-2)
  - `.claude/skills/gobbi/SKILL.md` § Skill Map (line 187 FLAG-2 row) — authoritative source for the "`claude` doc-authoring standard currently absent" status
  - `.claude/skills/mistake/SKILL.md` — P2 moment-of-capture (T1 cites)
  - `.claude/skills/evaluation/SKILL.md` — Stage 1 inheritance + disposition values (informs §6 Finding Disposition Table)

- **Project mistakes consulted by the per-task required-mistakes lists:**
  - `mistakes/design-literal-retire-instruction-without-replacement.md` (T1, T3)
  - `mistakes/section-order-is-part-of-the-contract-not-just-the-set.md` (T1, T2, T3, T7)
  - `mistakes/skills-mirror-symlinks-not-copies.md` (T1, T2, T3, T4)
  - `mistakes/prose-reclassification-target-is-project-level-notes.md` (T1 — task-record session-scope discipline)

- **Backlogs touched:**
  - Closed (T6): `backlogs/chat-mode-tiki-taka-redesign.md`, `backlogs/auto-mode-silence-vs-always-ask.md`
  - Created (T7, F8 slug): `backlogs/model-assignment-drift-delegation-vs-settings-default.md`

---

## Self-review (Sub-step E light)

- **Spec coverage** — every Idea §7.3 Update row still maps 1:1 to a task; the 7-task list, dependencies, and ordering are unchanged from iter1/iter2. G1–G6 are surgical name/anchor edits, not structural changes.
- **iter3 placeholder + regression scan** — re-grepped the iter3 brief's verification triggers:
  - Recursive `jq` (`.. | .mode?`) — replaced with explicit `.chat.mode` / `.auto.mode` extraction in T4 (G1). No recursive walks remain in verification commands.
  - `<chat-mode|<auto-mode|<settings|<SKILL|<state|<session|<new-backlog|<archived` placeholders in verification commands — all replaced with `$F<n>` / `$M<n>` / `$WT` absolute-path variables defined at the top of each task's verification block (G3). Placeholder strings appear only inside prose / negation-context (e.g., disposition table descriptions of what got removed).
  - `/tmp/t4-pre.txt` / `/tmp/t5-pre.txt` — both eliminated; replaced with in-session `PRE_T4_REV` / `PRE_T5_REV` bash variables (G4). Zero `/tmp/t[45]-pre` hits remain.
  - Triple-escape `\\\\` jq forms — replaced in T4 with `printf 'always\nalways'` plain comparison (G6). No `\\\\` quadruple-backslash sequences remain.
  - `# expect ...` comments (iter1 F3) — all converted to binary assertions; verified.
  - `lines 241-242` (iter1 F4) — replaced with "line 241 (second sentence)" throughout T3 + §5 P-R1.
  - `plugins` (iter1 F2) — only mention is the §5 unknowns note explaining `plugins/` is verified absent.
  - `main..HEAD` (iter1 F7) — replaced with `develop..HEAD` in §4 items #7 and #8.
- **Type / name consistency** — `workflow.chat.tasks[]` used identically in T3 + T5 + §4 + §6.7 idea-doc reference; "per-task slice" identical in T1 + §5 P-R2; new backlog slug `model-assignment-drift-delegation-vs-settings-default` used identically in T7 `files:`, T7 success-criteria, T7 verification-commands, §4 acceptance test #9, §5/§6 cross-references. The G3 variable family (`F1`/`M1`, `F2`/`M2`, `F3F`/`M3`, `F4`, `F5_STATE`/`F5_SESSION`, `F7`) is internally consistent within each task; no cross-task collision (each task's verification block runs as its own scope at Execution time). No drift.
- **Anchor completeness** — every iter1 finding (F1–F8) plus every iter2 finding (G1–G6 anchors) carries a §6 disposition row pointing at the section anchor where the fix landed.
- **No silently-invented task** — task set, order, and dependency edges unchanged from iter1/iter2. Surgical scope honored.
