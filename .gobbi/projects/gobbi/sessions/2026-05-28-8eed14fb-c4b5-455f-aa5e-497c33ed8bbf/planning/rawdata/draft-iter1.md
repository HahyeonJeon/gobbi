# Plan — Chat Mode + Auto Mode Redesign (iter1)

> **Session:** 2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf · **Phase:** Planning iter1 WORK · **Mode:** Chat (mini-Plan)
>
> Decomposes the iter2-locked Idea doc into 7 ordered Execution tasks. Chat-mode mini-Plan shape: lighter than the planning skill's full 5-substep procedure — focus on what each executor needs to land its task safely (scope, success criteria, verification commands, dependencies, risk).

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

### T1 — Fill canonical `chat-mode.md`

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
  - "wc -l <worktree>/.gobbi/projects/gobbi/skills/orchestration/chat-mode.md  # expect ≥ 200"
  - "grep -c 'per-task slice' <chat-mode.md>  # expect ≥ 5 (term lock used consistently)"
  - "grep -cE 'Steps preserved|Steps skipped|moment-of-capture|memorization/SKILL.md is unmodified' <chat-mode.md>  # expect ≥ 4"
  - "grep -c 'task-record' <chat-mode.md>  # expect ≥ 3"
  - "grep -cE 'Principle 1|delegation/SKILL.md.*Inline-Paste' <chat-mode.md>  # expect ≥ 2"
  - "test -L <worktree>/.claude/skills/orchestration/chat-mode.md  # symlink still resolves"
  - "find -L <worktree>/.claude/skills/orchestration -maxdepth 1 -name 'chat-mode.md'  # post-edit, mirror resolves"
estimated-risk: Medium
risk-rationale: Long-form spec authoring (§3 has 7 sub-sections + diagram + tables). Highest density of locked decisions (R5 + D-A + D-B + 9 brief locks + 2 term locks). Drift risk on R5's "Steps preserved vs Steps skipped" wording is the leading hazard — Sub-step E self-review of T1's draft must grep for the exact four-bullet skeleton.
agent: executor
required-skills:
  - principles
  - mistake
  - execution
  - claude (documentation standard for .claude/ authoring; mirror-symlink discipline)
  - memorization (base MEMORIZATION procedure being narrowed-overridden; do not edit the skill, only cross-reference)
  - discussion (Always-Ask matrix is referenced by chat-mode.md too)
  - delegation (Inline-Paste Rule cited from §3.4)
required-mistakes:
  - mistakes/design-literal-retire-instruction-without-replacement.md
  - mistakes/section-order-is-part-of-the-contract-not-just-the-set.md
  - mistakes/skills-mirror-symlinks-not-copies.md
  - mistakes/prose-reclassification-target-is-project-level-notes.md  # task-record is session-scope, not project notes
```

### T2 — Fill canonical `auto-mode.md`

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
  - "wc -l <worktree>/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md  # expect ≥ 80"
  - "grep -cE 'Design|Scope|Destructive' <auto-mode.md>  # expect ≥ 3"
  - "grep -c 'discussion/SKILL.md' <auto-mode.md>  # expect ≥ 1"
  - "grep -c 'USER CHALLENGE' <auto-mode.md>  # expect ≥ 1"
  - "grep -c 'Always-Ask' <auto-mode.md>  # expect ≥ 3"
  - "test -L <worktree>/.claude/skills/orchestration/auto-mode.md  # symlink intact"
estimated-risk: Low
risk-rationale: Auto-mode is structurally unchanged; spec is a codification pass — no new state-machine surface, no new schema. Main hazard is mis-citing the Always-Ask matrix path (must be `discussion/SKILL.md § Decision Classification`, not §Discussion or §Decisions). Sub-step E grep catches it.
agent: executor
required-skills:
  - principles
  - mistake
  - execution
  - claude
  - discussion (the doc being referenced — read for the exact section title)
  - planning (USER CHALLENGE primitive being cross-linked)
required-mistakes:
  - mistakes/skills-mirror-symlinks-not-copies.md
  - mistakes/section-order-is-part-of-the-contract-not-just-the-set.md
```

### T4 — Bundle Chat + Auto default-sets in `settings.default.json`

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
  - "jq . <worktree>/.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json > /dev/null  # valid JSON"
  - "jq -r '.. | .mode? // empty' <settings.default.json> | sort -u  # expect 'auto' and 'chat'"
  - "jq '(.. | .workflow?.preparation?.maxIterations? // empty)' <settings.default.json>  # expect both 0 and 3"
  - "jq '[.. | .evaluate?.mode? // empty] | unique' <settings.default.json>  # expect ['always']"
  - "git diff <pre-T4-rev> -- <settings.default.json> | grep -c '\"models\"'  # expect 0 changed lines in models block"
estimated-risk: Medium
risk-rationale: JSON structural decision — single file with two top-level blocks vs two-key dispatch shape is L-S1 (Idea §8) tactical. Executor picks the on-disk packaging; risk is choosing a shape that breaks an unseen resolver-cascade reader. If JSON-only proves insufficient (resolver code reads single-block shape), executor escalates NEEDS_CONTEXT (F-R1). Bootstrap-path (selecting Chat default-set before settings.mode is resolved) is solved by §6.2 dispatch-at-Step-1-completion — executor follows that contract.
agent: executor
required-skills:
  - principles
  - mistake
  - execution
  - claude
required-mistakes:
  - mistakes/skills-mirror-symlinks-not-copies.md  # templates/ also mirror-symlinked
```

### T5 — Add `workflow.chat.tasks[]` to `state.template.json` + `session.template.json`

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
  - "jq . <worktree>/.gobbi/projects/gobbi/skills/orchestration/templates/state.template.json > /dev/null"
  - "jq . <worktree>/.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json > /dev/null"
  - "jq '.workflow.chat.tasks' <state.template.json>  # expect []"
  - "jq '.workflow.chat.tasks' <session.template.json>  # expect []"
  - "git diff <pre-T5-rev> -- <state.template.json> | grep -cE '^\\-' | grep -q '^0$'  # zero deletions (additive-only); use careful pipe quoting at exec time"
estimated-risk: Low
risk-rationale: Smallest task; additive schema only. Hazard is forgetting one of the two templates or putting the array at the wrong nesting level. Both grepped in verification.
agent: executor
required-skills:
  - principles
  - mistake
  - execution
  - claude
required-mistakes: []
```

### T3 — Amend `orchestration/SKILL.md` (8 anchor changes)

```yaml
id: 03-skill-md-amendment
what: Apply the 8 SKILL.md Update-row anchor changes per Idea §7.3 + §6.1-§6.7 shape (consolidated CORRECTION block at § Orchestration Mode head; trim Chat / Auto inline blocks to one-sentence + link; mode-dispatch branch description before Step 1; replace § Inter-loop transition table; strike-through 241-242 + CORRECTION inline; add Chat-mode rendering sub-section to § Workflow Status Display; add per-task user review gate to § Mode-specific gates within a loop; expand § Workflow State Machine with mode-dispatch branch; add workflow.chat.tasks[] schema to § Workflow Metadata + § State persistence).
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
  - 8 anchor points (lines 62-76 / 80-84 / 234-241 / 241-242 / 245-290 / 387-405 / 338-405 State Machine / 426+ Metadata) per Idea §7.3
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
  - Original line 241-242 text "Mode controls user gates; it does not relax the workflow." present but struck through (e.g., wrapped in ~~...~~ or HTML <s> with adjacent CORRECTION note)
  - At least one block contains the word "CORRECTION" in § Orchestration Mode area
  - Chat / Auto inline blocks (lines 66-70 + 72-76) now contain a link to chat-mode.md / auto-mode.md respectively
  - § Inter-loop transition table contains TWO Chat transitions (within-slice + at-task-boundary)
  - § Mode-specific gates within a loop names the fourth Chat gate (per-task user review gate)
  - § Workflow Metadata / State persistence contains the workflow.chat.tasks[] schema additively
  - Sub-step E spec-coverage check: each of the 8 §7.3 anchors maps to exactly one applied edit
verification-commands:
  - "grep -nE 'CORRECTION|2026-05-28' <worktree>/.gobbi/projects/gobbi/skills/orchestration/SKILL.md | head"
  - "grep -nE '~~|<s>' <SKILL.md>  # struck-through original lock present"
  - "grep -c 'Mode controls user gates' <SKILL.md>  # expect ≥ 1 (still present, just struck through)"
  - "grep -cE 'chat-mode\\.md|auto-mode\\.md' <SKILL.md>  # expect ≥ 4 (links from §Orchestration Mode + State Machine + others)"
  - "grep -cE 'workflow\\.chat\\.tasks|workflow.chat.tasks' <SKILL.md>  # expect ≥ 1"
  - "grep -cE 'per-task user review gate|Next task.*Revise.*Wrap up' <SKILL.md>  # expect ≥ 1"
  - "grep -cE 'Skipped.*loop entry|0.*Skipped|state: Skipped' <SKILL.md>  # expect ≥ 1 (R1 mapping documented)"
  - "test -L <worktree>/.claude/skills/orchestration/SKILL.md  # mirror symlink intact"
estimated-risk: High
risk-rationale: 8 anchor edits on a 459-line file is the densest task. Multiple risks: (a) anchor-line numbers may drift as earlier edits land — executor must work top-down or use grep anchors not line numbers; (b) strike-through formatting (Markdown lacks native strike — likely `~~...~~` or `<s>...</s>`) — pick one and use consistently per mistakes/section-order-is-part-of-the-contract-not-just-the-set.md; (c) the boundary between "shape-only" Idea §6 spec and executor's prose authoring is real — executor must NOT lift iter1 verbatim text from §6.1/§6.6 (Finding F-P1). Sub-step E spec-coverage check is the safety net.
agent: executor
required-skills:
  - principles
  - mistake
  - execution
  - claude
  - orchestration (the SKILL being amended — full read required)
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
  - { path: ".gobbi/projects/gobbi/backlogs/delegation-skill-md-vs-settings-default-json-model-assignment-drift.md", op: create }
out-of-scope-files:
  - delegation/SKILL.md (NOT edited — drift fix is for the new backlog's eventual session)
  - templates/settings.default.json models block (NOT edited — out-of-scope per Idea §2 + T4 success criteria)
pre-resolved-decisions:
  - Backlog naming per memorization/rules.md §1.3 — subject-descriptive kebab-case (not "drift-1" or "model-mismatch")
  - status: active / disposition: open / created: 2026-05-28 / origin: Idea iter1 Finding F-C1 + iter2 §8 Finding #8
  - Body cites BOTH sources: delegation/SKILL.md § Model Selection (the table) AND settings.default.json (the on-disk values) with their respective claims
  - Resolution decision (which is canonical) is NOT made in the backlog — that is the work for the eventual session it gets picked up by
success-criteria:
  - File exists at .gobbi/projects/gobbi/backlogs/delegation-skill-md-vs-settings-default-json-model-assignment-drift.md
  - Frontmatter conforms to backlog template conventions (status / disposition / created / origin / type)
  - Body cites the two source-of-truth paths and their conflicting claims
  - Body explicitly says the redesign session deferred fix
  - Slug is subject-descriptive (passes memorization/rules.md §1.3 naming check)
verification-commands:
  - "test -f <worktree>/.gobbi/projects/gobbi/backlogs/delegation-skill-md-vs-settings-default-json-model-assignment-drift.md"
  - "grep -cE 'delegation/SKILL.md|settings.default.json' <new-backlog.md>  # expect ≥ 2"
  - "grep -c 'status: active' <new-backlog.md>  # expect 1"
  - "grep -c 'disposition: open' <new-backlog.md>  # expect 1"
  - "grep -c '2026-05-28' <new-backlog.md>  # expect ≥ 1"
estimated-risk: Low
risk-rationale: 5-minute task. Only risk is slug-naming — `delegation-settings-drift.md` would be too terse; the long subject-descriptive name above is preferred per the project's naming convention. Executor should check an existing backlog file (e.g., the two being archived in T6) for the canonical frontmatter shape.
agent: executor
required-skills:
  - principles
  - mistake
  - memorization (rules.md §1.3 naming convention; backlog template shape)
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
  - "test ! -e <worktree>/.gobbi/projects/gobbi/backlogs/chat-mode-tiki-taka-redesign.md"
  - "test ! -e <worktree>/.gobbi/projects/gobbi/backlogs/auto-mode-silence-vs-always-ask.md"
  - "find <worktree>/.gobbi/projects/gobbi/archive/backlogs -name '*chat-mode-tiki-taka-redesign*'  # one match"
  - "find <worktree>/.gobbi/projects/gobbi/archive/backlogs -name '*auto-mode-silence-vs-always-ask*'  # one match"
  - "grep -c 'status: closed' <archived-chat-backlog>  # expect 1"
  - "grep -c 'status: closed' <archived-auto-backlog>  # expect 1"
  - "rg -l 'chat-mode-tiki-taka-redesign|auto-mode-silence-vs-always-ask' <worktree> | grep -v archive  # expect zero hits outside archive (no stale inbound refs)"
estimated-risk: Low
risk-rationale: Mechanical archive following a documented procedure. Hazard is forgetting to repoint an inbound reference — verification command `rg -l` outside archive/ catches it. The wrap-up-assistant owner makes this lower-risk than asking an executor to do it (the assistant has wrap-up workflow context).
agent: wrap-up assistant
required-skills:
  - principles
  - mistake
  - wrap-up
  - memorization (archive.md template)
required-mistakes: []
```

---

## 4. Plan-level Acceptance Test

The cross-task gate the entire Plan must pass after Execution completes (T1-T5 + T7) and before Wrap-up's T6 runs. Run from the worktree root:

```bash
WT=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb

# 1. Symlinks remain symlinks (skills-mirror-symlinks-not-copies discipline)
for f in chat-mode.md auto-mode.md SKILL.md; do
  test -L "$WT/.claude/skills/orchestration/$f" || { echo "FAIL: $f is not a symlink"; exit 1; }
done

# 2. Mirror symlinks resolve to canonical files
find -L "$WT/.claude/skills/orchestration" -maxdepth 1 -name '*-mode.md' | wc -l  # expect 2

# 3. All three JSON files parse
for f in settings.default.json state.template.json session.template.json; do
  jq . "$WT/.gobbi/projects/gobbi/skills/orchestration/templates/$f" > /dev/null || { echo "FAIL: $f invalid JSON"; exit 1; }
done

# 4. Cross-doc links resolve — chat-mode.md ↔ auto-mode.md ↔ SKILL.md ↔ memorization/SKILL.md
grep -c 'memorization/SKILL.md' "$WT/.gobbi/projects/gobbi/skills/orchestration/chat-mode.md"  # ≥ 1
grep -c 'discussion/SKILL.md' "$WT/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md"   # ≥ 1
grep -c 'chat-mode.md\|auto-mode.md' "$WT/.gobbi/projects/gobbi/skills/orchestration/SKILL.md"  # ≥ 4

# 5. R1 lock visible in two anchored places (chat-mode.md spec + SKILL.md state-machine description)
grep -cE 'Skipped.*loop entry|state: Skipped|maxIterations.*0' "$WT/.gobbi/projects/gobbi/skills/orchestration/SKILL.md"     # ≥ 1
grep -cE 'Skipped.*loop entry|state: Skipped|maxIterations.*0' "$WT/.gobbi/projects/gobbi/skills/orchestration/chat-mode.md" # ≥ 1

# 6. workflow.chat.tasks[] schema present in BOTH templates
jq '.workflow.chat.tasks' "$WT/.gobbi/projects/gobbi/skills/orchestration/templates/state.template.json"     # []
jq '.workflow.chat.tasks' "$WT/.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json"  # []

# 7. No-bleed check — memorization/SKILL.md NOT edited (R5 lock; D-A reaffirms)
git -C "$WT" diff --name-only main..HEAD | grep -E 'memorization/SKILL.md$' && { echo "FAIL: memorization/SKILL.md touched"; exit 1; }

# 8. No-bleed check — discussion/SKILL.md NOT edited (referenced only)
git -C "$WT" diff --name-only main..HEAD | grep -E 'discussion/SKILL.md$' && { echo "FAIL: discussion/SKILL.md touched"; exit 1; }

# 9. New backlog landed (T7)
test -f "$WT/.gobbi/projects/gobbi/backlogs/delegation-skill-md-vs-settings-default-json-model-assignment-drift.md"
```

Plan-level acceptance is binary — all 9 checks pass or the Plan fails and Execution re-enters via REVISE.

---

## 5. Risks + unknowns (Plan-level)

| # | Risk | Severity | Note |
|---|---|---|---|
| P-R1 | T3 anchor-line drift during multi-edit | Medium | Executor MUST use grep-anchors / section headers, not absolute line numbers, since earlier T3 sub-edits invalidate later line counts. Confirmed in T3 risk-rationale. |
| P-R2 | T1 R5 four-bullet skeleton drift | Medium | The §3.3 four-bullet structure is the most-likely place a long-form executor invents a fifth bullet or merges two — verification command for T1 explicitly counts the four phrases. |
| P-R3 | T4 settings JSON shape (single block with two keys vs two top-level dispatch keys) | Medium | L-S1 tactical decision — executor picks; if resolver code reads only single-block shape, executor surfaces NEEDS_CONTEXT (F-R1). Plan-level acceptance test #3 (JSON valid) catches gross errors but not resolver-compat issues — those surface at first post-merge Chat session. |
| P-R4 | T6 inbound-reference scan misses an exotic link (e.g., a links table in a notes file) | Low | The `rg -l` outside archive/ verification command catches kebab-slug substring matches; a fuzzy-anchored reference (e.g., "the chat-mode backlog") could escape — accepted residual risk. |
| P-R5 | Chat session's first post-merge run (Idea §2 Success Criteria 3-5) is a deferred validation gate, NOT in this Plan's Execution scope | Low | The first Chat session is a future session's signal. This Plan ships the design; the falsifying observation is a separate-session concern. Documented for Wrap-up handoff. |
| P-R6 | Mirror symlinks for chat-mode.md / auto-mode.md verified ONLY for current worktree | Low | Idea Finding #9 dispute showed Codex's iter1 main-tree cwd produced a false-positive "files don't exist". If Execution runs in a different worktree, executor MUST re-verify the symlink + canonical-file pair as a pre-flight (R12 in Idea §8). |
| P-R7 | T1's worked Status Display example assumes a Chat session shape that doesn't yet exist on disk | Medium | The example is illustrative — executor writes it from the schema (D-B + §6.7), not from a real session. Risk: the schema and the example drift. Mitigation: schema citation in the example caption. |

**Plan-level unknowns I noticed beyond per-task risks:**

- **`.claude/` mirror cardinality.** The two new mode docs already have mirror symlinks (verified by Idea §7.1 finding for Idea-iter2 leader). For SKILL.md, the symlink existed pre-redesign. T4 + T5 touch `templates/` — also confirmed mirror-symlinked. Plan-level test #1 covers the live state.
- **`plugins/` mirror.** The PR #260/#261 mirror discipline (plugins/gobbi/skills/orchestration/{chat,auto}-mode.md) is not mentioned in Idea §7.1, but the plugin mirror IS part of the project's "two-system mirror" model (per project_pr257_adversarial_review_complete memory entry). Executor MUST check `find plugins/gobbi/skills/orchestration -name '*-mode.md'` to confirm whether plugin-side mirrors exist and need updating, or whether the symlink already covers them. Surface as NEEDS_CONTEXT if ambiguous.
- **D-B layout's downstream implications.** D-B locks the outer key (`chat/tasks/{NN}-{slug}/{ideation,planning,execution}/{rawdata,staging,artifacts,evaluation}/`) but no Plan task explicitly creates a directory at that path — directories materialize at first-Chat-session-runtime. T1's task-record spec MUST cite D-B; T3's SKILL.md state-machine description SHOULD reference D-B (or at least cite chat-mode.md as the per-task layout spec). Documented in T1 + T3 success criteria.

---

## 6. Cross-references

- **Idea doc (locked input):** `<sessions>/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`
- **iter1 Idea draft (superseded baseline):** `<sessions>/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/rawdata/draft-iter1.md`
- **iter1 Idea evaluator outputs:** `<sessions>/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/evaluation/iter1/{claude,codex}/`

- **Worktree root:** `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/`

- **Skills consulted by this Plan:**
  - `.claude/skills/principles/SKILL.md` — 13 Iron Laws (P1 think-before-acting; P13 spec-CRUD for doc work)
  - `.claude/skills/planning/SKILL.md` — Planning Loop procedure (this leader's contract)
  - `.claude/skills/orchestration/workflow/planning.md` — workflow phase doc
  - `.claude/skills/orchestration/SKILL.md` — target of T3
  - `.claude/skills/discussion/SKILL.md` — Always-Ask matrix referenced by T2
  - `.claude/skills/memorization/SKILL.md` + `memorization/rules.md` — T1's narrowed PASS-path base reference + slug-naming
  - `.claude/skills/memorization/templates/archive.md` — T6's archive procedure
  - `.claude/skills/delegation/SKILL.md` — Inline-Paste Rule (cited by T1)
  - `.claude/skills/claude/SKILL.md` — `.claude/` doc authoring standard (mirror discipline)
  - `.claude/skills/mistake/SKILL.md` — P2 moment-of-capture (T1 cites)

- **Project mistakes consulted by the per-task required-mistakes lists:**
  - `mistakes/design-literal-retire-instruction-without-replacement.md` (T1, T3)
  - `mistakes/section-order-is-part-of-the-contract-not-just-the-set.md` (T1, T2, T3, T7)
  - `mistakes/skills-mirror-symlinks-not-copies.md` (T1, T2, T3, T4)
  - `mistakes/prose-reclassification-target-is-project-level-notes.md` (T1 — task-record session-scope discipline)

- **Backlogs touched:**
  - Closed (T6): `backlogs/chat-mode-tiki-taka-redesign.md`, `backlogs/auto-mode-silence-vs-always-ask.md`
  - Created (T7): `backlogs/delegation-skill-md-vs-settings-default-json-model-assignment-drift.md`

---

## Self-review (Sub-step E light)

- **Spec coverage** — every Idea §7.3 Update row maps to a task: T1 covers chat-mode.md row; T2 covers auto-mode.md row; T3 covers the 8 SKILL.md rows; T4 covers settings.default.json row; T5 covers state.template.json + session.template.json rows; T6 covers the two backlog frontmatter+archive rows; T7 is anchored to Finding #8 / §2 Deferred (the new backlog isn't in §7.3's Update table because it's a Create — anchor still holds).
- **Placeholder scan** — searched for TBD / TODO / `<...>` / FIXME in this Plan; the only `{NN}` / `{date}` / `{ssid}` / `{slug}` patterns are template placeholders inside path specifications (not gaps), and `<PR>` / `<chat-mode.md>` / `<sessions>` are reader-substitution markers used in verification commands. No drift placeholders.
- **Type / name consistency** — `workflow.chat.tasks[]` (used identically in T3 + T5 + §6.7 reference); `per-task slice` (used identically in T1 + Plan-level acceptance test #5 + §5 P-R2); slug for new backlog (T7 uses the long subject-descriptive form; cited identically in T7 verification + §6 cross-refs). No `clearLayers/clearFullLayers` drift found.
- **Anchor completeness** — every task has a `traces-to:` field naming the Idea-doc anchor(s) it implements.
- **No silently-invented task** — the 7 tasks are the user-confirmed set. T7 is in the user-confirmed set as "T7 — file new backlog... (executor, 5 min)."
