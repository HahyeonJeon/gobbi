# Idea — Chat Mode + Auto Mode Redesign (iter2)

> **Session:** 2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf · **Phase:** Ideation iter2 WORK · **Leader:** orchestration redesign
>
> Iter1 was reconciled `REVISE` (Claude `FAIL` on F-C1 Consistency Critical · 100; Codex `REVISE` on three High findings). The user honored `REVISE` and locked three design decisions (R1, R2+R3, R5) that this iter2 promotes from "flagged for Planning" status into resolved Ideation decisions. Bucket B/C/D findings are user-deferred to Planning and noted as `disposition: deferred` in §8.
>
> Section numbering is inherited from iter1. Sections preserved verbatim except where Bucket A changes were applied: §2 (canonical Scope Contract schema), §3.2 / §3.3 / §6 / HOW (single canonical Chat MEMORIZATION statement, per R5), §3 / §5 / §6 (R1 + R2/R3 promoted), §5 footnote (Finding #8 acknowledgement), §8 (per-finding `disposition:` table).

---

## 1. WHAT / WHY / HOW

### WHAT — the concrete deliverables

Three first-class artifacts and one set of consequential edits:

1. A canonical `orchestration/chat-mode.md` — sub-document of the `orchestration` skill, owning the **full** Chat-Mode specification: posture, the per-user-typed-task workflow shape, per-loop discipline, the per-task `task-record.md` artifact contract, the explicit-end-of-session Wrap-up trigger, and the locally-overridden Chat MEMORIZATION procedure (R5 lock; see §3.3 for the canonical statement).
2. A canonical `orchestration/auto-mode.md` — sub-document of the `orchestration` skill, owning the **full** Auto-Mode specification: posture, the codified Always-Ask categories (referencing `discussion/SKILL.md § Decision Classification`), and the discipline that Preparation runs, evaluation always runs, full per-loop MEMORIZATION runs, and the 6-step state machine is structurally unchanged.
3. An amendment to `orchestration/SKILL.md` that supersedes the current global lock at lines 241–242 (`Mode controls user gates; it does not relax the workflow.`) and introduces a **mode-dispatched** state machine: Auto Mode keeps the existing linear 6-step shape; Chat Mode resolves a different per-user-typed-task shape (full Ideation Loop + Preparation `state: Skipped` per R1 + mini Planning + mini Execution per sub-step + per-task task-record + user review gate, with Wrap-up triggered only on explicit end-of-session signal). The supersession is an ADR-style note in the SKILL.md body, with the old lock struck through and a dated CORRECTION pointing at this Idea doc and the two new sub-documents.
4. Cascading edits: an in-place revision of `orchestration/SKILL.md § Chat Mode` (lines 66–70) and `§ Auto Mode` (lines 72–76) to **link to** the new sub-documents (the SKILL stays the workflow-governor; the sub-documents own each mode's full spec); an update to `§ Workflow Status Display` so Chat-Mode status reflects the per-user-typed-task shape (current state machine fields are step + iter + phase only); an update to `§ Mode-specific gates within a loop` (lines 387–405) acknowledging that Chat now selects a different per-task shape — not just additional gates inside one shape; an update to `§ Inter-loop transition` (lines 234–242) to encode the Chat-Mode "next-task / revise / wrap-up" user review gate that replaces the linear Step-N→Step-N+1 advance for Chat; an additive update to `§ Workflow Metadata` documenting the new `workflow.chat.tasks[]` array-of-slices schema (R2+R3 lock; see §6.7); and the `0 → Skipped` semantic note for `preparation.maxIterations: 0` at the state-machine description (R1 lock; see §6.2); **archive** the two backlog files closing this work (`chat-mode-tiki-taka-redesign.md` + `auto-mode-silence-vs-always-ask.md`) via Wrap-up's move-on-terminal procedure.

The deliverable is the **specification**. Final prose authoring lives in Execution.

### WHY — the trigger and the value

Two converging witnesses:

- **The two open backlogs.** `chat-mode-tiki-taka-redesign.md` (created 2026-05-23, currently `status: active` / `disposition: open` — will close when this redesign ships) names the friction: today's Chat Mode is a linear 6-step march dressed up with per-step `AskUserQuestion` confirmations, which is a poor fit for the user's actual conversational pattern — short user-typed tasks, per-task Ideation each time, no upfront task list, no full Preparation per task. `auto-mode-silence-vs-always-ask.md` (created 2026-05-23, currently `status: active` / `disposition: open`) names the symmetric Auto-Mode gap: Auto biases toward proceeding silently, but several decision categories (Design, Scope, Destructive) MUST trigger `AskUserQuestion` regardless of mode — that discipline is implicit in `discussion/SKILL.md § Decision Classification` (the Always-Ask matrix is fully specified there) but **not codified in the mode contract itself**, so an Auto-mode manager can silently rationalize past it.
- **The existing SKILL.md lock at 241–242** ("Mode controls user gates; it does not relax the workflow.") is structurally incompatible with the user-ratified Chat-Mode shape. Chat Mode now skips Preparation by default and reshapes Planning + Execution into mini-loops per-task — that IS the workflow shape changing, not just the user-gate density. The lock was written when Chat = Auto + extra `AskUserQuestion` calls; that assumption no longer holds. Leaving the lock in place produces design-instruction conflict the next time the SKILL is read end-to-end.

Both witnesses are real (linked backlogs, exact line numbers in the source-of-truth SKILL). The change has a witness per Principle 10.

User-value: the Chat-Mode user gets a conversational loop that matches how they actually work (short typed tasks, no upfront decomposition pressure, full Ideation per task because the idea is what is being explored, lightweight Plan + Execute per task, a durable per-task record at the boundary, and a Wrap-up they explicitly trigger when the conversation is genuinely done). The Auto-Mode user keeps the autonomous linear runway but gets explicit, citable protection against silent decisions in the three categories where the user actually wants gates. Both modes share one settings schema, so the cognitive model stays single-source.

### HOW — the approach

1. **Sub-document the two modes.** Move each mode's full spec into its own sub-doc under `orchestration/`. `orchestration/SKILL.md` stays the workflow governor and the state-machine source-of-truth; `chat-mode.md` and `auto-mode.md` become the canonical per-mode specs that downstream readers consult after orienting on the workflow. This is the same pattern already established in this skill — `workflow/ideation.md` / `workflow/preparation.md` / `workflow/planning.md` / `workflow/execution.md` / `workflow/wrap-up.md` / `workflow/evaluation.md` / `workflow/memorization.md` are sub-documents of the same SKILL. The mode docs slot in beside them.
2. **Replace the global "mode never changes structure" lock with a documented supersession.** Old lock: "Mode controls user gates; it does not relax the workflow." New lock: "Mode dispatches the per-user-typed-task workflow shape; both shapes preserve Ideation rigor, evaluation, and MEMORIZATION." The supersession is recorded ADR-style in SKILL.md (struck-through original + CORRECTION note dated 2026-05-28 pointing at this Idea doc + the new sub-docs) per the project's design-of-record amendment pattern (`mistakes/design-literal-retire-instruction-without-replacement.md` documents the precedent: amend with CORRECTION annotations, do not silently rewrite).
3. **Encode mode-dispatched shapes in the state machine.** Introduce one explicit branch point in the state-machine section: at Step-1 completion, the manager dispatches based on resolved `settings.mode`. Auto → unchanged linear 6-step. Chat → enter the per-user-typed-task loop (full Ideation Loop with `maxIter=2` and forced user-driven DISCUSSION, Preparation Loop **resolves to `state: Skipped` at loop entry** because `workflow.preparation.maxIterations: 0` (R1 lock — see §6.2), mini Planning Loop with `maxIter=2`, mini Execution Loop per Plan sub-step with `maxIter=2`, per-task `task-record.md` at boundary, user review gate (next task / revise / wrap-up)). Wrap-up triggers only on explicit user end-of-session signal; per-loop MEMORIZATION runs every iter with a Chat-narrowed PASS path declared locally in `chat-mode.md` (R5 lock — see §3.3 for the canonical statement).
4. **Codify "mini" Planning + Execution.** "Mini" is defined narrowly: same 5-row loop shape (DISCUSSION → WORK → EVALUATION → MEMORIZATION → ITER/EXIT) but maxIter=2, scope is one user-typed task only, evaluator runs (always), and the EVALUATION and MEMORIZATION rows persist the same artifacts (with the Chat MEMORIZATION narrowed path of §3.3 applied). The reduction is in **breadth** (one task's worth of plan / one sub-step's worth of execution), not in **rigor** (no evaluation skip, no memorization skip, no eval-mode toggle).
5. **Same settings schema, divergent defaults.** Use the existing `settings.default.json` shape; ship two **default sets** (one for Chat, one for Auto). The mode field at the top of `settings.json` is the dispatch key. The cascaded resolver does not change shape; only the bundled default values per mode change. The R1 lock for `preparation.maxIterations: 0` is the encoded "skip cleanly at loop entry" semantic — no new settings field is introduced.
6. **Codify Always-Ask categories in `auto-mode.md`.** The categories already exist in `discussion/SKILL.md § Decision Classification` (Design / Scope / Destructive). `auto-mode.md` references that section and re-states the contract: Auto Mode silence is over-ridden for those three categories regardless of any per-step `discuss.mode: agent` setting. This is the closure of backlog `auto-mode-silence-vs-always-ask.md`.
7. **Per-task task-record.md (GSD-borrow).** Each Chat task closes with a 5–10 line `task-record.md` under `sessions/{date}-{ssid}/chat/tasks/{NN}-{slug}/task-record.md` summarizing: what the user asked, what shipped, decisions taken, open threads. This becomes Wrap-up's MEMORIZATION input — when the user signals end-of-session, the Wrap-up assistant mines the transcript + per-task records to consolidate the session's memory. Note: the task-record's frontmatter `type` is deferred to Planning per Bucket B Finding #4 — the iter1 choice of `type: notes` collides with the project-level chronological notes convention; Planning will pick `artifact_type: task-record` or a dedicated template.
8. **Fresh subagent context per task slice.** Codified at Chat-Mode level: every per-task slice spawns leaders / executors / evaluators with their context inline-pasted (`delegation/SKILL.md § Inline-Paste Rule`; the in-loop discipline is anchored to Principle 1 — "no action without thinking it through" — not Principle 4 as iter1 mis-cited — see §8 Finding L-P1/L-C2/L-U1); the manager does not lean on cross-task subagent memory.
9. **Discuss-first default.** In Chat Mode, every loop entry forces user-driven DISCUSSION (the leader proposes; the user decides), regardless of `discuss.mode` value. This is the Superpowers-borrow — discuss-first is a Chat-Mode property, not a per-step setting. (Auto-Mode keeps `discuss.mode: user` for Ideation + Preparation and `agent` for Planning / Execution / Wrap-up.)

---

## 2. Scope Contract (this Ideation Loop)

Re-shaped to the canonical Scope Contract schema (`evaluation/SKILL.md § Scope Contract Schema`). The five required body sections (In-Scope, Out-of-Scope, Decisions Locked, Success Criteria, Deferred) replace iter1's compact table. Frontmatter:

```yaml
artifact_type: scope-contract
feature: orchestration
goal: redesign Chat Mode (per-user-typed-task shape) + adjust Auto Mode (codify Always-Ask) in the gobbi orchestration skill
created-by: ideation-loop / sessionId 8eed14fb
created-at: 2026-05-28
```

### In-Scope

- Produce **this Idea doc** (`draft-iter2.md`) as the canonical Ideation-Loop output specifying the Chat-Mode + Auto-Mode redesign at the spec level.
- Specify the structural shape of the `orchestration/SKILL.md` amendment (which sections change, which line ranges are touched, what the ADR-style supersession says in shape — NOT verbatim Execution-stage prose; see Out-of-Scope below).
- Specify the full Chat-Mode contract: per-user-typed-task slice shape, per-loop discipline, the locally-overridden MEMORIZATION procedure (R5), the `task-record.md` artifact's role and writer (frontmatter `type` deferred to Planning), the explicit-end-of-session Wrap-up trigger.
- Specify the full Auto-Mode contract: Always-Ask codification by reference, per-loop discipline restatement, the harness-banner conditioning clarification.
- Specify the settings-defaults shape: same `settings.default.json` schema, two bundled default sets keyed by `mode`, including the R1-locked `preparation.maxIterations: 0 → state: Skipped` semantic.
- Specify the new `workflow.chat.tasks[]` array-of-slices schema for both `session.json` and `state.json` (R2+R3 lock).
- Enumerate the CRUD blast radius (§7).
- Enumerate the risks + unknowns that survive into Planning (§8).

### Out-of-Scope

- Writing the final prose of `orchestration/chat-mode.md` / `orchestration/auto-mode.md` (Execution stage).
- Editing `orchestration/SKILL.md` directly during this loop — including writing the verbatim amended SKILL.md sentence or the verbatim CORRECTION blockquote. iter1's §6.1 + §6.6 carried verbatim Execution-stage prose; in iter2 those sections specify the **shape** of the amendment, not its final wording (Finding F-P1 addressed — see §6.1 / §6.6 below).
- Changing the resolver/cascade code that reads settings (no resolver implementation; only the on-disk default-set shape is in scope).
- Cross-skill edits beyond what mode-dispatch requires (`memorization/SKILL.md`, `discussion/SKILL.md`, `wrap-up/SKILL.md` are READ for consistency, not WRITTEN). Note: the R5 lock places the Chat MEMORIZATION local override in `chat-mode.md`, NOT in `memorization/SKILL.md` — the base MEMORIZATION skill stays untouched.
- Implementing the Wrap-up Chat-input extension (the procedure change in `wrap-up/SKILL.md` that walks `chat/tasks/*/task-record.md`) — flagged in §8 R6 as a Planning decision; not authored here.
- Fixing the upstream drift between `delegation/SKILL.md § Model Selection` and `settings.default.json` (Finding #8 deferred; see §5 footnote and §8).

### Decisions Locked

The 9 pre-resolved decisions from the brief (no re-litigation):

| # | Decision (pre-resolved) | One-line rationale |
|---|---|---|
| 1 | Chat is conversational per-task | User-ratified shape; matches actual usage pattern |
| 2 | Full Ideation Loop per task | The idea is what's being explored; can't skip |
| 3 | Preparation skipped by default in Chat | Per-task scope rarely needs readiness check |
| 4 | mini Plan + mini Execute | Same rigor, narrower breadth, maxIter=2 |
| 5 | Per-loop MEMORIZATION skipped in Chat / mistake-stage moment-of-capture preserved / per-task `task-record.md` | iter1 phrasing; superseded by R5's canonical statement (§3.3) which specifies "narrowed PASS path, not skipped" |
| 6 | Explicit end-of-session triggers Wrap-up in Chat | Symmetric to Always-Ask Destructive — durable-memory change is user's call |
| 7 | Auto codifies Always-Ask | Closes backlog auto-mode-silence-vs-always-ask |
| 8 | Same `settings.json` schema with mode-divergent defaults | Single cognitive model; two bundled default sets keyed by `mode` |
| 9 | Mode now affects workflow structure | Supersedes the SKILL.md 241–242 global lock |

Plus four user-locked decisions from iter1 evaluator-driven Reconcile (this iter2 promotes them into the body):

| # | Decision (this iter2) | One-line rationale | Body location |
|---|---|---|---|
| R1 | `preparation.maxIterations: 0` means **state: Skipped at loop entry** — no DISCUSSION row runs, no WORK row runs, no audit-trail FAIL noise; mapped at the loop-entry guard | Documented as a state-machine semantic in the SKILL.md amendment; no new settings field | §3.2 + §5 footnote + §6.2 |
| R2 | Per-task slice persistence in `session.json` is the **array-of-slices** shape: new `workflow.chat.tasks[]` field; each entry holds `{ideation, preparation, planning, execution}` for that task | Existing `workflow.{loop}` shape coexists for Auto (single-instance per session) | §5 + §6.7 |
| R3 | Per-task slice persistence in `state.json` matches R2 — `workflow.chat.tasks[]` array, each entry holding the per-task per-loop state-machine records | Display projection (§6.3) consumes this directly | §5 + §6.7 |
| R5 | The Chat MEMORIZATION-narrowed contract is **declared locally in `chat-mode.md`** as an override; `memorization/SKILL.md` stays untouched | Localizing the override keeps the base skill clean; chat-mode.md cross-links to memorization/SKILL.md for the unmodified base | §3.3 + §6.1 + §6.6 |

Plus single mode question at session start (PR #267 lock); the two retired setup questions (eval-mode, git-workflow-mode) stay retired.

### Success Criteria

Observable signals — used by Planning to write verification tasks, and by the first post-merge Chat session to confirm the redesign worked.

1. **Files-exist gate (smoke-test, analogous to SKILL.md T1.h):** after this work merges, `find -L /playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/orchestration -maxdepth 1 -name 'chat-mode.md' -o -name 'auto-mode.md'` resolves to both files; the corresponding `.claude/skills/orchestration/{chat,auto}-mode.md` symlinks resolve via `-L`.
2. **SKILL.md amendment landed:** `grep -n 'CORRECTION' /playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/orchestration/SKILL.md` returns at least one match in the `§ Orchestration Mode` block; the original line-241 sentence is still present (struck through, per `mistakes/design-literal-retire-instruction-without-replacement.md`).
3. **First post-merge Chat session produces at least one `chat/tasks/{NN}-{slug}/task-record.md`** conforming to the per-task-record frontmatter chosen during Planning (deferred Finding #4); the `{slug}` is subject-descriptive (passes `memorization/rules.md § 1.3` naming check).
4. **`workflow.chat.tasks[]` populated in session.json** when the first post-merge Chat session ends: `jq '.workflow.chat.tasks | length' <session.json>` returns ≥ 1; each entry validates against the schema in §6.7.
5. **No audit-trail FAIL noise for skipped Preparation:** the first post-merge Chat session's `session.json.workflow.preparation` is `{state: "Skipped", iterations: []}` (R1 verification), not `{state: "Aborted", ...}`.
6. **Wrap-up archives both backlog files** (`chat-mode-tiki-taka-redesign.md`, `auto-mode-silence-vs-always-ask.md`) — their frontmatter ends up at `status: closed`, `disposition: addressed`, `shipped_in: <PR>`, and they `git mv` to `archive/backlogs/2026-MM-DD-{slug}.md`.
7. **Counterfactual falsifier:** if a fresh Chat-Mode reader (manager or human) cannot describe the per-task slice shape from `chat-mode.md` alone (without consulting iter1 or the discussion log), the redesign failed at the Aesthetics + Usage level; re-evaluate the prose.

### Deferred

These move forward as Planning-tracked work or open backlogs. Routing is explicit.

| Deferred item | Pointer | Route |
|---|---|---|
| Bucket B/C/D Findings #4–#11 from iter1 evaluators | §8 of this doc + iter1 evaluator files at `<sessions>/ideation/evaluation/iter1/{claude,codex}/` | Planning decides per finding |
| Wrap-up Chat-input extension (procedure change in `wrap-up/SKILL.md` that walks `chat/tasks/*/task-record.md`) | §8 R6 | Planning |
| Upstream drift between `delegation/SKILL.md § Model Selection` and `settings.default.json` (Finding #8) | §5 footnote + §8 Finding #8 | Separate backlog (not in this redesign) |
| Auto-Mode banner alignment with Always-Ask matrix | §8 R8 | Planning |
| Settings-cascade resolver behavior change (if mode-divergent default-set selection requires resolver edits beyond JSON edits) | §8 F-R1 | Planning |
| Per-task `task-record.md` template artifact + canonical frontmatter type | §8 R10 + Finding #4 | Planning |
| Chat per-sub-step layout under `chat/tasks/{NN}-{slug}/execution/...` (the F-S3 layout collision) | §8 Finding #7 | Planning |

---

## 3. Chat Mode — proposed shape

### 3.1 Mode posture

Chat Mode is the user-driven, conversational orchestration mode. **The user types one task at a time; the manager runs a full per-task workflow slice and returns to the user.** No upfront task list. No autonomous multi-task runway. The session's shape is the union of all per-task slices the user types between session start and the user's explicit end-of-session signal.

**Term lock — "per-task slice."** From this point in the document forward, the single canonical term for the unit Chat dispatches is **per-task slice** (synonym drift in iter1 — "per-user-typed-task slice", "task slice", "Chat task" — is resolved per Finding F-A1 / codex-aes-3d91be4a; downstream prose in `chat-mode.md` inherits this term).

This re-frames the 6-step state machine. Configuration runs once at session start (unchanged). Wrap-up runs once at session end (triggered only on explicit user signal). Between them, the manager runs **per-task slices**, not linear Ideation → Preparation → Planning → Execution → Wrap-up. Each slice contains its own Ideation, its own Preparation (which resolves to `state: Skipped` at loop entry per R1), its own mini Planning, its own mini Execution, and its own task-record boundary.

This is the structural change that supersedes the SKILL.md 241–242 lock. Mode no longer just controls **whether** the manager pauses for `AskUserQuestion`; mode now controls **which state machine** runs between Configuration and Wrap-up.

### 3.2 Per-task slice workflow shape (diagram)

```
Step 1 — Configuration (once per session)
   │
   ▼
┌──────── Per-task slice ───────────────────────────────────────────┐
│  user types a task                                                 │
│   │                                                                │
│   ▼                                                                │
│  Step 2 — Full Ideation Loop  (maxIter=2)                          │
│      DISCUSSION (forced user-driven, regardless of discuss.mode)   │
│           ↓                                                        │
│      WORK     (leader; full 4 sub-steps A–D)                       │
│           ↓                                                        │
│      EVALUATION (always)                                           │
│           ↓                                                        │
│      MEMORIZATION  — Chat narrowed PASS path (see §3.3 canonical)  │
│           ↓                                                        │
│      ITER / EXIT (PASS → next; REVISE → back to DISCUSSION)        │
│   │                                                                │
│   ▼                                                                │
│  Step 3 — Preparation Loop  ⊘  state: Skipped at loop entry        │
│      (R1: settings.workflow.preparation.maxIterations: 0           │
│       → manager skips DISCUSSION+WORK+EVAL+MEMO rows entirely;     │
│       stamps state: Skipped; no audit-trail noise; persists        │
│       workflow.chat.tasks[i].preparation = {state: "Skipped",      │
│       iterations: []}.)                                            │
│      The user MAY opt in for a complex task by typing an explicit  │
│      prep override; opt-in runs the standard contract.             │
│   │                                                                │
│   ▼                                                                │
│  Step 4 — mini Planning Loop  (maxIter=2)                          │
│      Same 5-row loop, scope = this one task's worth of plan        │
│      (one or a few sub-steps, ordered).                            │
│      MEMORIZATION = Chat narrowed PASS path (§3.3).                │
│   │                                                                │
│   ▼                                                                │
│  Step 5 — mini Execution Loop per Plan sub-step  (maxIter=2)       │
│      Same 5-row loop per sub-step (fresh executor each time);      │
│      sub-steps sequence as the mini-Plan ordered them.             │
│      MEMORIZATION = Chat narrowed PASS path (§3.3).                │
│   │                                                                │
│   ▼                                                                │
│  Task boundary: per-task task-record.md (5–10 lines)               │
│   │                                                                │
│   ▼                                                                │
│  USER REVIEW GATE (AskUserQuestion):                               │
│      ▸ Next task                                                   │
│      ▸ Revise this task                                            │
│      ▸ Wrap up the session                                         │
└────────────────────────────────────────────────────────────────────┘
   │ (user signals "wrap up")
   ▼
Step 6 — Wrap-up Loop  (maxIter=1)
   FULL MEMORIZATION consolidation:
   - mine the session transcript
   - read every per-task task-record.md
   - promote staged mistakes (Layer 1 + Layer 2)
   - archive shipped backlogs (move-on-terminal)
   - write the session handoff
```

Notes on the shape:

- **Configuration once, Wrap-up once.** Steps 1 and 6 retain their session-level identity. They do not repeat per task.
- **Per-task slice = Steps 2 → 3 → 4 → 5 (with 3 resolving to `Skipped` at loop entry per R1).** This is the new structural unit Chat dispatches.
- **EVALUATION runs every loop.** No mode-driven skip. Iron Law 7 holds.
- **MEMORIZATION runs every loop, with a Chat-narrowed PASS path declared locally in `chat-mode.md`.** See §3.3 for the **single canonical statement** that resolves the iter1 self-contradiction (Finding #1).

### 3.3 Chat MEMORIZATION — canonical statement (R5 lock)

**Single canonical statement (no other section may state Chat MEMORIZATION otherwise; all cross-references in §3.2, §6, and HOW point here):**

> **In Chat Mode, every loop's MEMORIZATION sub-phase runs after every EVALUATION verdict (PASS / REVISE / FAIL) — it is never skipped.** Locally in `chat-mode.md`, the PASS path is **narrowed** relative to the base `memorization/SKILL.md` procedure:
>
> - **Steps preserved:** Step 5 (CREATE `artifacts/{free-filename}.md`) and Step 8 (UPDATE `session.json.workflow.{loop}.finishedAt` + `verdict: PASS`). Plus every-iter Step 2 (CREATE `rawdata/transcript-iter{n}.jsonl`) and Step 3 (UPSERT `session.json.workflow.{loop}.iterations[]`) — every-iter steps are not Chat-specific.
> - **Steps skipped:** Step 6 (CREATE typed-finding stagings under `staging/{scenarios,checklists,decisions,references,…}/`) and Step 7 (CREATE `staging/{design,discussions,reviews,reports}/`). These are deferred — the staging surface is mined from the session transcript and the per-task `task-record.md` files by the Wrap-up Loop's MEMORIZATION at session end.
> - **Moment-of-capture preserved.** The `mistake/SKILL.md § P2` discipline — stage a mistake-candidate at the moment a correction is detected, not at end-of-loop — is **NOT** part of Steps 6–7's deferred typed-finding staging. Mistake-candidates are written immediately to `sessions/.../{loop}/staging/decisions/{slug}.md` with `mistake-candidate: true` per `mistake/SKILL.md § P2` regardless of Chat's narrowed PASS path. This exception holds because the moment-of-capture discipline is governed by the `mistake` skill, not by `memorization/SKILL.md`.
> - **`memorization/SKILL.md` is unmodified.** The narrowed PASS path is a Chat-Mode local override, declared in `chat-mode.md`'s body and cross-linked to `memorization/SKILL.md` for the unmodified base procedure. A reader of `memorization/SKILL.md` sees the full base; a reader of `chat-mode.md` sees the base + the Chat override.

**Wrap-up's input under Chat narrowed staging.** Because Steps 6–7 don't run per-loop in Chat, Wrap-up MEMORIZATION must (a) mine the session transcript, (b) walk every `chat/tasks/{NN}-{slug}/task-record.md`, and (c) reconstruct typed findings from the per-loop evaluation files (`{loop}/evaluation/iter{n}/{system}/{perspective}.md` — which DO get written every iter regardless of Chat's narrowing). Wrap-up's procedure extension is `wrap-up/SKILL.md`-side and is flagged in §8 R6 as a deferred Planning task. The `task-record.md` body shape (§3.4) is designed to make this reconstruction tractable — it surfaces decisions taken + open threads + pointers.

This is the single statement. References elsewhere in this doc to "MEMORIZATION runs every loop with a narrowed PASS path" or "Chat narrowed staging" are short-form pointers to this section.

### 3.4 Per-loop discipline

Inside any Chat-Mode loop slice (Ideation / Preparation when not skipped / mini Planning / mini Execution):

- **DISCUSSION is forced user-driven**, regardless of the resolved `discuss.mode`. The leader proposes (research-backed); the user decides via `AskUserQuestion`. This is the discuss-first Chat-Mode property (Superpowers-borrow); it does not override `discuss.mode` in settings — settings still resolve to `user` everywhere in the Chat defaults — but it is documented at Chat-Mode level so a future settings change cannot accidentally regress it.
- **Three mode-specific gates within a loop** still apply (per SKILL.md 387–405): after DISCUSSION → confirm delegation prompt; after EVALUATION → discuss findings and remediation; at ITER/EXIT → confirm exit. These remain Chat's per-loop user gates.
- **Iteration cap is 2** for Ideation / Planning / Execution (Auto's default is 3). The narrower budget reflects Chat's per-task scope: a user-typed task that needs three iterations is a signal the user should reframe or split, not iterate further.
- **Evaluation always runs.** `evaluate.mode: always` across all loops in Chat. (Auto: same.)
- **MEMORIZATION runs every loop with the §3.3 narrowed PASS path.**
- **Fresh subagent context per slice.** Every leader / executor / evaluator spawn pastes its context inline — no cross-task subagent memory. The manager is the only durable cross-task agent. Citation: `delegation/SKILL.md § Inline-Paste Rule` (the discipline) and Principle 1 (the underlying behavioral law — iter1's Principle 4 citation was a wrong-number reference; see §8 L-P1/L-C2/L-U1).
- **mistake-stage moment-of-capture.** Every correction the manager or any subagent identifies in a Chat slice is staged immediately at `sessions/.../{loop}/staging/decisions/{slug}.md` with `mistake-candidate: true`, per `mistake/SKILL.md § P2`. This is the explicit exception to §3.3's "Steps 6–7 skipped" narrowing — the moment-of-capture is governed by the `mistake` skill, not by `memorization/SKILL.md`.

### 3.5 task-record artifact spec

Per Chat task, written at the task boundary (after the mini Execution Loop's last sub-step exits):

| Field | Value |
|---|---|
| Path | `sessions/{date}-{session-id}/chat/tasks/{NN}-{slug}/task-record.md` (kebab-case subject-descriptive slug per `memorization/rules.md § 1.3`; `{NN}` is a zero-padded ordinal within the session) |
| Frontmatter `type` / artifact type | **Deferred to Planning** (Bucket B Finding #4 — iter1 picked `type: notes` but that collides with the project-level chronological journal convention in `memorization/templates/notes.md`). Planning chooses one of: (a) `artifact_type: task-record` aligned to the `artifacts/` schema in `memorization/SKILL.md § Artifact frontmatter schema`, or (b) a new dedicated `task-record` template under `memorization/templates/`. Either way the per-task record is **session-scope**, not project-tier `notes/`. |
| Body (5–10 lines) | `## What the user asked` (1–2 lines, the user's verbatim or paraphrased ask — privacy note: prefer paraphrase if the ask contains secrets or PII; cf. Codex codex-risk-79f7e024) → `## What shipped` (1–3 lines, the concrete deliverable + path) → `## Decisions taken` (1–3 lines, citing decisions staged during the task) → `## Open threads` (1–2 lines, anything deferred or flagged) → `## Pointers` (1–2 lines, paths to the slice's `artifacts/` files) |
| Writer | the mini Execution Loop's MEMORIZATION assistant on PASS of the last sub-step, OR — if mini Execution skipped — the mini Planning Loop's MEMORIZATION assistant on PASS. Either way, it is the assistant role; manager verifies presence at the user review gate. |
| Wrap-up role | Wrap-up's MEMORIZATION reads every `task-record.md` in the session, plus the session transcript, and consolidates into project-memory promotions (per `wrap-up/SKILL.md`). Wrap-up may reclassify task-record body narrative into project-level `notes/` per `mistakes/prose-reclassification-target-is-project-level-notes.md` (notes are project-tier, not feature-tier). |
| Filename naming | per `memorization/rules.md` §1.3 — name the **subject** (the task's deliverable concept), not the ordinal. The `{NN}-` prefix is a chronological aid only; the slug must be subject-descriptive (e.g., `03-chat-mode-redesign-idea-doc`, not `03-task-3`). |

### 3.6 Wrap-up trigger (explicit end-of-session)

In Chat Mode, Wrap-up runs **only when the user explicitly signals end-of-session**. The signal is one of:

- The user selects "Wrap up the session" at the per-task user review gate.
- The user types an explicit end-of-session message (e.g., "we're done", "wrap up", "end session").
- The user invokes `/gobbi wrap-up` (if and when such a command exists; otherwise the message form above).

The manager does NOT auto-trigger Wrap-up on any other signal (no auto-trigger on "no more tasks for now", no auto-trigger on idle, no auto-trigger after N tasks). The discipline is symmetric to the Always-Ask Destructive category: ending the session changes durable memory (mistake promotion, archive moves, handoff write) — that decision is the user's.

If the user closes the session without an explicit Wrap-up signal (terminal hang-up), the partial session-memory survives (every loop's MEMORIZATION ran, transcript + session.json + artifacts all written), and a future session can resume per the existing 3-state worktree idempotency guard (`orchestration/SKILL.md § Step 1` row 5).

---

## 4. Auto Mode — proposed adjustments

### 4.1 Mode posture

Auto Mode is **structurally unchanged**. The linear 6-step state machine (Configuration → Ideation → Preparation → Planning → Execution → Wrap-up) runs end-to-end with minimal user intervention. The manager initiates each step and proceeds; the user is consulted only when (a) eval findings imply scope changes the manager cannot resolve, (b) a step fails in a way the manager cannot resolve under existing authority, (c) any decision in the Always-Ask categories arises, or (d) the user explicitly intervenes.

The only adjustments in this redesign are codification of existing-but-implicit discipline. Nothing about Auto's runtime shape changes.

### 4.2 Always-Ask codification

The full Always-Ask matrix lives in `discussion/SKILL.md § Decision Classification`. `auto-mode.md` **references that section as the authoritative source** and re-states the contract in Auto-Mode-specific language so an Auto-mode manager reading the mode doc cannot rationalize past the gate.

The three Always-Ask categories — Design / Scope / Destructive — fire `AskUserQuestion` in Auto Mode regardless of any per-step `discuss.mode: agent` setting. `auto-mode.md` provides:

- A pointer to `discussion/SKILL.md § Always-Ask categories (override auto-decide; the user decides)` as the source of truth.
- A short Auto-mode-flavored restatement: "In Auto Mode, the manager auto-decides everything in the Auto-decide class without pausing. The manager MUST NOT auto-decide anything in the Always-Ask class (Design / Scope / Destructive). For those three categories, `AskUserQuestion` fires the same as in Chat Mode."
- A short example per category specific to a typical Auto-mode scenario (e.g., a leader's mid-Planning library choice → Design ask; a mid-Execution Edit that would touch a path outside the staged `files:` list → Scope ask; a `git reset --hard` proposal mid-Wrap-up → Destructive ask).
- A pointer to the `User Challenge` escalation primitive in `planning/SKILL.md` for the case when the leader's research substantively disagrees with the user's stated direction.

### 4.3 Other Auto-Mode tightenings

Already locked by the brief; restated for completeness in `auto-mode.md`:

- `maxIterations: 3` (Ideation / Preparation / Planning / Execution) and `1` (Wrap-up).
- `evaluate.mode: always` for every loop.
- Preparation runs (not skipped).
- Full per-loop MEMORIZATION runs (not narrowed) — Auto uses the unmodified `memorization/SKILL.md` PASS path, including Steps 6–7 staging.
- `discuss.mode: user` for Ideation + Preparation; `agent` for Planning / Execution / Wrap-up.
- Single mode question at session start (per PR #267 lock; the two retired setup questions stay retired).

### 4.4 Anything else worth tightening (flag don't fix)

- **`maxIterations` exhaustion silence.** Per current SKILL.md 405, in Auto Mode `maxIterations` exhaustion does NOT interrupt the user — the loop aborts and the failure surfaces in Wrap-up. This is by design but worth restating in `auto-mode.md` so a future reader does not mistake the silence for a bug.
- **The Auto-Mode banner.** The session-start system-reminder banner ("Auto Mode Active — bias toward working without stopping for clarifying questions") is currently injected by harness; `auto-mode.md` should state that the banner's bias is **conditioned by** the Always-Ask matrix — the banner's "make the reasonable call and keep going" applies to the Auto-decide class only.
- **No per-step `evaluate.mode` skip.** The current `settings.default.json` permits `evaluate.mode: skip` per step. `auto-mode.md` should state that Auto's default is `always` everywhere and that `skip` is a power-user override; the redesign does not change this, but documenting it preempts future drift.

---

## 5. settings.json defaults table (Chat vs Auto, exhaustive)

Same schema, different defaults. The table is exhaustive for the redesign's purposes — every field that differs is listed; every field that is identical is listed for completeness.

| Field | Chat default | Auto default | Locked by |
|---|---|---|---|
| `schemaVersion` | `1` | `1` | (schema invariant) |
| `mode` | `"chat"` | `"auto"` | brief lock |
| `workflow.ideation.discuss.mode` | `"user"` | `"user"` | brief lock |
| `workflow.ideation.evaluate.mode` | `"always"` | `"always"` | brief lock |
| `workflow.ideation.maxIterations` | `2` | `3` | brief lock |
| `workflow.preparation.discuss.mode` | `"user"` | `"user"` | brief lock |
| `workflow.preparation.evaluate.mode` | `"always"` | `"always"` | brief lock |
| `workflow.preparation.maxIterations` | `0` ⇒ **state: Skipped at loop entry** (R1 lock — see §6.2) | `3` | R1 lock (Chat); brief lock (Auto) |
| `workflow.planning.discuss.mode` | `"user"` (Chat forces user-driven DISCUSSION at the mode level — see §3.4) | `"agent"` | brief lock |
| `workflow.planning.evaluate.mode` | `"always"` | `"always"` | brief lock |
| `workflow.planning.maxIterations` | `2` | `3` | brief lock |
| `workflow.execution.discuss.mode` | `"user"` (Chat forces user-driven DISCUSSION at the mode level) | `"agent"` | brief lock |
| `workflow.execution.evaluate.mode` | `"always"` | `"always"` | brief lock |
| `workflow.execution.maxIterations` | `2` | `3` | brief lock |
| `workflow.wrap-up.discuss.mode` | `"user"` (Chat forces user-driven DISCUSSION) | `"agent"` | brief lock |
| `workflow.wrap-up.evaluate.mode` | `"always"` | `"always"` | brief lock |
| `workflow.wrap-up.maxIterations` | `1` | `1` | brief lock |
| `models.{system}.{role}` | unchanged (per-role model assignments are mode-independent) — see footnote | unchanged | not in scope |
| `git.repo / baseBranch / pr / issue / worktree / branch` | unchanged | unchanged | not in scope |

Notes on the table:

- **R1 lock — `preparation.maxIterations: 0` semantics (resolves iter1 R1 flag).** When the loop-entry guard reads `workflow.preparation.maxIterations == 0`, it stamps `state.json.workflow.preparation.state = "Skipped"` and `session.json.workflow.chat.tasks[i].preparation = {state: "Skipped", iterations: []}` (per the array-of-slices schema in §6.7), and proceeds directly to Step 4. **No DISCUSSION row runs, no WORK row runs, no EVALUATION / MEMORIZATION rows run.** No `FAIL` or `Aborted` verdict is stamped. The `0 → Skipped` mapping is documented at the state-machine level in the SKILL.md amendment (§6.2); no new settings field is introduced. The user MAY override per-session by raising `preparation.maxIterations` for a complex task, in which case the loop runs the standard contract.
- **R2/R3 lock — per-task slice persistence shape.** Both `session.json` and `state.json` gain a new `workflow.chat.tasks[]` field (array-of-slices). Each entry has the per-task per-loop sub-records (ideation / preparation / planning / execution). The existing `workflow.{loop}` field coexists for Auto Mode (single-instance per session). The full schema is documented in §6.7 and additively in the SKILL.md `§ Workflow Metadata` amendment (§6.7 below).
- **Chat's `discuss.mode: "user"` on every loop is intentional**, but the **mode-level discuss-first contract in `chat-mode.md`** is the binding contract — if a future settings change flips a step to `"agent"`, the mode-level contract still forces user-driven DISCUSSION at every loop entry. Documenting both layers prevents silent regression.

**Footnote — `models.*` block (Finding #8 acknowledgement).** The role decides the model, not the mode. iter1's §5 footnote stated "Opus for manager / leader / evaluator; Sonnet for executor / assistant" and cited `delegation/SKILL.md § Model Selection`. **This iter2 acknowledges two cited sources of truth**: (a) `delegation/SKILL.md § Model Selection` (which iter1 cited), and (b) `templates/settings.default.json` lines 31–45 (which iter1's leader did not ground-truth, and which records `"executor": "opus", "evaluator": "sonnet"` — the opposite ratio from delegation/SKILL.md's table). **The redesign treats the `models.*` block as mode-independent — that fact survives.** The upstream drift between `delegation/SKILL.md` and `settings.default.json` (executor vs evaluator → opus vs sonnet) is real, but it is **out-of-scope for this redesign**. It is routed to a separate backlog (see §8 Finding #8 deferred). `chat-mode.md` and `auto-mode.md` will NOT re-document the per-role model assignments — they will point to `delegation/SKILL.md § Model Selection` AND `settings.default.json` as the two cited sources, deferring resolution of which is canonical to that separate backlog. This prevents this redesign from baking either inversion into the mode docs.

---

## 6. orchestration/SKILL.md amendment delta

iter2 specifies the **shape** of the amendment, not its verbatim Execution-stage prose. Where iter1 carried verbatim sentences (§6.1) or verbatim blockquotes (§6.6), iter2 describes the structural intent so the Execution stage author writes the final wording. This addresses Finding F-P1 (Project — Medium) and Finding F-O2 partial (Overall — High via "flag don't fix" overuse). The verbatim wording belongs to Execution; the shape belongs here.

### 6.1 Locked-constraint supersession (the headline change) — shape only

**Anchor:** SKILL.md worktree lines 241–242, currently:

> In both modes, the manager NEVER skips `EVALUATION` (unless `evaluate.mode == 'skip'`) or `MEMORIZATION`. Mode controls user gates; it does not relax the workflow.

**Shape of the amendment (Execution writes the final prose):**

- Strike through the second sentence ("Mode controls user gates; it does not relax the workflow.") per the `mistakes/design-literal-retire-instruction-without-replacement.md` precedent — original wording preserved, not deleted.
- Append an ADR-style CORRECTION annotation immediately after the strikethrough. The annotation must convey four facts: (1) supersession is dated 2026-05-28 and points at this Idea doc + `chat-mode.md` + `auto-mode.md`; (2) the new lock is "mode dispatches the per-user-typed-task workflow shape" — Auto = linear 6-step, Chat = per-task slice + explicit-end-of-session Wrap-up; (3) both shapes preserve `evaluate.mode: always` and per-loop MEMORIZATION (with Chat's narrowed PASS path declared locally in `chat-mode.md` per §3.3); (4) the first sentence ("the manager NEVER skips `EVALUATION` … or `MEMORIZATION`") is retained — only the second sentence is superseded.
- The annotation is shape-specified here; Execution authors the final wording. iter1's §6.1 verbatim text is **NOT** the locked prose — it was illustrative of the shape only.

### 6.2 New state-machine description — shape only

In `§ Workflow` (around lines 80–84) and `§ Workflow State Machine` (line 338+), add a **mode-dispatch branch** to the state-machine description. The Execution-stage author writes the actual prose; the iter2 shape is:

- A single explicit branch point at Step-1 completion (mode dispatch from resolved `settings.mode`).
- Auto branch: linear 6-step state machine (unchanged).
- Chat branch: per-task slice loop (Step 2 → Step 3 `Skipped` → Step 4 mini → Step 5 mini → task-record → user review gate), repeating until the user signals end-of-session; then Step 6.
- An explicit note on the **R1 `preparation.maxIterations: 0` mapping**: the loop-entry guard for the Preparation Loop reads `maxIterations: 0` as `state: Skipped`, stamps the state.json + session.json fields per §6.7, and proceeds without running DISCUSSION / WORK / EVALUATION / MEMORIZATION rows. **No FAIL or Aborted verdict.** This is the R1 lock encoded at the state-machine layer.
- A pointer for the full per-mode procedure: "Chat dispatches per `chat-mode.md`; Auto dispatches per `auto-mode.md`."

The branch is **declared in SKILL.md but specified in the sub-documents.** SKILL.md gains the declaration; the sub-docs gain the full procedure.

### 6.3 § Workflow Status Display update — shape only

Current `§ Workflow Status Display` (line 245+) renders a single 6-row table for any session. For Chat Mode, the display must reflect the per-task slice structure (consuming `session.json.workflow.chat.tasks[]` and `state.json.workflow.chat.tasks[]` per §6.7).

Shape of the update:

- **Header form** (Chat): `Workflow Status — Mode: chat — Active: Task {NN} — {step-in-slice} of 4` (where 4 is the per-task slice's structural length: Step 2 + Step 4 + Step 5 + task-record; Step 3 renders as `⊘ Skipped` when default).
- **Body form** (Chat): two-tier rendering.
  - Top tier (session-level): Configuration row, current task ordinal row, Wrap-up trigger status row. Example states: Configuration `✓ Done`; current task ordinal `▸ Task 03`; Wrap-up `… Pending — awaiting user signal`.
  - Per-task tier (current task): sub-table for Step 2 / Step 3 / Step 4 / Step 5 / task-record with state + iter + verdict columns. **The backing data is `state.json.workflow.chat.tasks[currentIndex]` (R3 lock, §6.7).**
- **Render points** unchanged (every `AskUserQuestion` in Chat; every loop boundary in Auto).
- **Auto Mode rendering unchanged** — the existing 6-row table is the canonical view.

`chat-mode.md` owns the full Chat rendering spec including at least one **worked example** showing a completed prior task plus the active task (addresses Codex codex-usage-0fbc3d75 — Medium; required so a future manager has a concrete reference for multi-task display). SKILL.md `§ Workflow Status Display` carries a short pointer.

### 6.4 § Mode-specific gates within a loop update — shape only

Current `§ Mode-specific gates within a loop` (line 387–405) describes three Chat-mode gates and the Auto-mode advance contract. Proposed shape:

- The three Chat-mode gates (after DISCUSSION / after EVALUATION / at ITER-EXIT) **stay** — they are the loop-internal user gates. Within Chat's per-task slice, every loop hits them.
- Add a **fourth Chat-mode gate**: the **per-task user review gate** at task boundary, after `task-record.md` writes. Options: next task / revise / wrap up. This is the new gate the redesign introduces.
- Add a paragraph noting that in Chat Mode, the per-step `discuss.mode` setting is **shadowed** by the mode-level discuss-first contract: regardless of step setting, every loop entry forces user-driven DISCUSSION. Point at `chat-mode.md § Per-loop discipline` (§3.4 in this doc).

### 6.5 § Inter-loop transition update — shape only

Current `§ Inter-loop transition` (line 234+) is a simple 2-row table: Chat asks-to-advance Step N → Step N+1; Auto auto-advances. Proposed shape:

- The Auto row is unchanged.
- The Chat row is restructured to encode **two transitions**: (a) **within a per-task slice**, AskUserQuestion to confirm advance to the next slice-step (Step 2 → Step 4 → Step 5, with Step 3 silently `Skipped` per R1); (b) **at task boundary**, AskUserQuestion the per-task user review gate (next task / revise / wrap up). **Only on "wrap up"** does the manager advance to Step 6.

### 6.6 ADR-style supersession note placement — shape only

A consolidated CORRECTION block is placed at the head of `§ Orchestration Mode` (around line 62), referencing this Idea doc. The shape of the block:

- Dated 2026-05-28.
- Names the superseded clause (the second sentence at 241–242).
- Cites: `chat-mode.md`, `auto-mode.md`, and `<sessions>/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/rawdata/draft-iter2.md` (this Idea doc — staged to `staging/decisions/` at PASS per the standard memorization contract).
- States the rigor-preservation invariant: both shapes preserve `evaluate.mode: always` and per-loop MEMORIZATION (Chat's narrowed PASS path is in `chat-mode.md § Chat MEMORIZATION` per §3.3 of this Idea doc).

iter1's §6.6 verbatim blockquote is illustrative; Execution authors the final prose.

### 6.7 § Workflow Metadata update — `workflow.chat.tasks[]` schema (R2 + R3 lock)

**Additive change** to `§ Workflow Metadata` (line 426+) and `§ State persistence` (line 343+). The existing `workflow.{loop}` shape stays unchanged for Auto. A new `workflow.chat.tasks[]` field is added for Chat sessions.

**Schema (both `session.json` and `state.json`):**

```yaml
workflow:
  configuration: { ... }       # unchanged
  ideation:        { ... }     # used by Auto only; Chat populates within tasks[]
  preparation:     { ... }     # used by Auto only; Chat populates within tasks[]
  planning:        { ... }     # used by Auto only; Chat populates within tasks[]
  execution:       { ... }     # used by Auto only; Chat populates within tasks[]
  wrap-up:         { ... }     # used by both modes (session-level)
  chat:                         # NEW — populated only when settings.mode == "chat"
    tasks:
      - taskNo: 01              # zero-padded ordinal within session
        slug: chat-mode-redesign-idea-doc   # subject-descriptive kebab-case
        startedAt: ISO-8601
        finishedAt: ISO-8601 | null
        ideation:    { state, verdict, iter, maxIterations, phase, iterations[] }
        preparation: { state: "Skipped", iterations: [] }    # R1 default
        planning:    { state, verdict, iter, maxIterations, phase, iterations[] }
        execution:   { state, verdict, iter, maxIterations, phase, iterations[] }
        taskRecord:  { path, writtenAt }    # pointer to task-record.md
      - taskNo: 02 ...
```

Notes:

- The per-task `{ideation, preparation, planning, execution}` sub-records carry the same shape as the existing top-level `workflow.{loop}` entries — same `state` / `verdict` / `iter` / `maxIterations` / `phase` / `iterations[]` fields. Existing readers parse the same per-loop record shape; only the path changes (`workflow.chat.tasks[i].ideation` vs `workflow.ideation`).
- `state.json.workflow.chat.tasks[]` and `session.json.workflow.chat.tasks[]` are mirrored — the `state.json` shape is the live state-machine projection (R3); the `session.json` shape archives the final iter + verdict + tokensUsed per slice (R2).
- The `Workflow Status Display` (§6.3) consumes `state.json.workflow.chat.tasks[currentIndex]` for the per-task tier.
- **Templates updated:** `templates/state.template.json` and `templates/session.template.json` both gain the empty `workflow.chat: { tasks: [] }` field. Both Chat and Auto sessions ship the same templates; an Auto session leaves `workflow.chat.tasks: []` empty. Addressed Codex codex-struct-6f11d0e9 (Medium) — the CRUD §7.3 now enumerates template updates.

The schema is additive — no existing field changes shape. An Auto-mode reader sees the existing `workflow.{loop}` shape; a Chat-mode reader sees both (and uses `chat.tasks[]`).

---

## 7. CRUD blast radius

Per Principle 13: enumerate every file the same change must co-touch. Implementation belongs to Execution; this section is the spec the planner reads to decompose.

### 7.1 Create

| Path | Type | Notes |
|---|---|---|
| `.gobbi/projects/gobbi/skills/orchestration/chat-mode.md` | skill sub-document | Replace the existing placeholder (verified to exist in the worktree at this path; confirmed mirror-symlink at `.claude/skills/orchestration/chat-mode.md`). Full Chat-Mode spec per §3. |
| `.gobbi/projects/gobbi/skills/orchestration/auto-mode.md` | skill sub-document | Replace the existing placeholder (verified to exist in the worktree at this path; confirmed mirror-symlink at `.claude/skills/orchestration/auto-mode.md`). Full Auto-Mode spec per §4. |

**Note on Codex iter1 "files don't exist" finding (Finding #9, false positive — see §8).** Codex's iter1 evaluator was run with cwd `/playinganalytics/git/gobbi` (main tree), where the placeholders genuinely do not exist. The placeholders exist in the **worktree** at `.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/{chat,auto}-mode.md` with matching `.claude/skills/orchestration/{chat,auto}-mode.md` symlinks (verified by this iter2 leader: `ls -la` confirmed both 598/636-byte canonical files plus symlinks). The CRUD "replace placeholder" semantic is correct for this worktree. Planning's pre-flight check should confirm the placeholders are still present in whatever worktree Execution uses.

### 7.2 Read (consulted for consistency)

| Path | Purpose |
|---|---|
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | The doc being amended; full read required. Anchors at lines 62–76 (Orchestration Mode + Chat / Auto descriptions), 80–84 (Workflow header), 234–241 (Inter-loop transition + the lock), 245–290 (Workflow Status Display), 338–405 (Workflow State Machine + Mode-specific gates), 407–420 (Loop ↔ agent type), 426+ (Workflow Metadata for R2/R3 additive change). |
| `.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json` | The current Auto-flavored default. Read to confirm shape; write deferred to Execution. |
| `.gobbi/projects/gobbi/skills/orchestration/templates/state.template.json` | Read to confirm shape; updated per §6.7 (gains `workflow.chat: { tasks: [] }`). |
| `.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json` | Read to confirm shape; updated per §6.7. |
| `.gobbi/projects/gobbi/skills/discussion/SKILL.md` | `§ Decision Classification` — the Always-Ask matrix `auto-mode.md` references. |
| `.gobbi/projects/gobbi/skills/delegation/SKILL.md` | `§ Model Selection`, `§ Inline-Paste Rule` — the fresh-context-per-task discipline `chat-mode.md` codifies. **Also cited (along with `settings.default.json`) for the per-role model assignments per §5 footnote.** |
| `.gobbi/projects/gobbi/skills/memorization/SKILL.md` | The unmodified base referenced by `chat-mode.md`'s narrowed PASS path (R5 lock per §3.3). |
| `.gobbi/projects/gobbi/skills/memorization/rules.md` + `templates/notes.md` | The slug-naming and notes-type-placement convention. Per-task `task-record.md`'s frontmatter type is deferred to Planning (Finding #4). |
| `.gobbi/projects/gobbi/skills/memorization/templates/archive.md` | The move-on-terminal contract Wrap-up uses to archive the two closed backlog files. |
| `.gobbi/projects/gobbi/skills/mistake/SKILL.md` | `§ P2 — moment-of-capture` — preserved in Chat regardless of §3.3's narrowed PASS path. |
| `.gobbi/projects/gobbi/skills/planning/SKILL.md` | `§ Core Principles § USER CHALLENGE` — referenced from `auto-mode.md`. |
| `.gobbi/projects/gobbi/skills/wrap-up/SKILL.md` | Read for the Chat-input extension surface (R6 deferred). |
| `.gobbi/projects/gobbi/backlogs/chat-mode-tiki-taka-redesign.md` | The backlog being closed (currently `status: active` / `disposition: open` — closes when this redesign ships). |
| `.gobbi/projects/gobbi/backlogs/auto-mode-silence-vs-always-ask.md` | The backlog being closed (currently `status: active` / `disposition: open`). |
| `.gobbi/projects/gobbi/mistakes/design-literal-retire-instruction-without-replacement.md` | The amendment-pattern precedent (CORRECTION-with-struck-through-original). |
| `.gobbi/projects/gobbi/mistakes/section-order-is-part-of-the-contract-not-just-the-set.md` | The contract-shape precedent for ADR-section-order in mode docs. |
| `.gobbi/projects/gobbi/mistakes/prose-reclassification-target-is-project-level-notes.md` | The `notes/` type-placement gotcha — `task-record.md` is **session-scope**, not project-tier `notes/` (cross-checked against Codex codex-usage-d44ce0b9 Finding #4 deferred). |
| `.gobbi/projects/gobbi/mistakes/skills-mirror-symlinks-not-copies.md` | The mirror-symlink discipline; Planning's pre-flight verifies symlinks are symlinks, not copies. |
| `.gobbi/projects/gobbi/rules/stub-redirect-format.md` | Not applicable here (no doc is being stubbed); read to confirm we are NOT creating stubs (the placeholders are being replaced in place). |
| `CLAUDE.md` (workspace + project) | Read to verify no Iron Law row need re-numbering. Confirmed: the amendment touches `orchestration` skill text only; no principle is added or removed. |

### 7.3 Update (with anchors)

| Path | Anchors (lines / sections) | Change |
|---|---|---|
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | Lines 62–76 — `## Orchestration Mode` + `### Chat Mode` + `### Auto Mode` blocks | Add the consolidated CORRECTION block (§6.6 shape) at the head of `## Orchestration Mode`. Trim the Chat / Auto inline descriptions to one sentence each + a link to the sub-doc. |
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | Lines 80–84 — `## Workflow` header | Insert the mode-dispatch branch description (§6.2 shape) before the Step-1 sub-heading. Include the R1 `0 → Skipped` mapping note. |
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | Lines 234–241 — `### Inter-loop transition` | Replace the 2-row table per §6.5 shape. |
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | Line 241–242 — the lock | Strike through the second sentence; add the CORRECTION inline per §6.1 shape. |
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | Lines 245–290 — `## Workflow Status Display` | Add a sub-section "Chat-mode rendering" (or a pointer to `chat-mode.md § Status Display`) per §6.3 shape. Auto rendering unchanged. |
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | Lines 387–405 — `### Mode-specific gates within a loop` | Add the per-task user review gate as a fourth Chat-mode gate; add the discuss-first-shadows-discuss.mode paragraph per §6.4 shape. |
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | `## Workflow State Machine` (line 338+) | Add the mode-dispatch branch description; cross-link to `chat-mode.md` for the Chat per-task slice's state-transition table. Include the R1 `0 → Skipped` mapping. |
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | `## Workflow Metadata` (line 426+) + `### State persistence` (line 343+) | Add the `workflow.chat.tasks[]` schema per §6.7. Additive; existing `workflow.{loop}` shape unchanged. |
| `.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json` | Whole file | Replace the single default-set with **two bundled default sets** (Chat + Auto). Per the brief lock #8 — same schema, different defaults; selection key is `mode` at the top of the file. Bootstrap-path for selecting the Chat default-set before `settings.mode` is resolved is a Planning detail (cf. Codex codex-struct-91cf42d0 — High; addressed in §6.2 by explicitly placing the dispatch at Step-1 completion, after Step 1 row 1's "ask the mode question" already resolves mode). |
| `.gobbi/projects/gobbi/skills/orchestration/templates/state.template.json` | Whole file | Add `workflow.chat: { tasks: [] }` per §6.7. |
| `.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json` | Whole file | Add `workflow.chat: { tasks: [] }` per §6.7. |
| `.gobbi/projects/gobbi/skills/orchestration/chat-mode.md` | Whole file (currently a 598-byte placeholder) | Replace with full spec per §3. Include the §3.3 canonical Chat MEMORIZATION statement (R5 lock), the §3.4 per-loop discipline, the §3.5 task-record spec, and the §6.3 worked-example multi-task status display. |
| `.gobbi/projects/gobbi/skills/orchestration/auto-mode.md` | Whole file (currently a 636-byte placeholder) | Replace with full spec per §4. |
| `.gobbi/projects/gobbi/backlogs/chat-mode-tiki-taka-redesign.md` | Frontmatter | Wrap-up: set `status: closed`, `disposition: addressed`, add `shipped_in: <PR>`, then `git mv` to `.gobbi/projects/gobbi/archive/backlogs/2026-MM-DD-chat-mode-tiki-taka-redesign.md` per `memorization/templates/archive.md`. |
| `.gobbi/projects/gobbi/backlogs/auto-mode-silence-vs-always-ask.md` | Frontmatter | Same archive procedure as above. |

**Flag (don't fix):** the Auto-mode banner is harness-injected, not file-resident. If the redesign wants the banner text aligned with the Always-Ask matrix language, that is a separate hook / harness change — flagged for Planning to decide whether to scope in (§8 R8).

### 7.4 Delete (none)

Per the project's no-delete model. Backlogs are moved, not deleted (move-on-terminal). The SKILL.md lock is struck through, not deleted. The placeholders at `chat-mode.md` and `auto-mode.md` are overwritten in place (overwrite is not delete; the file path persists).

---

## 8. Risks + unknowns + iter1 finding dispositions

### 8.1 Bucket A — iter1 findings addressed in this iter2

Per `evaluation/SKILL.md § Finding Metadata § Disposition (5 values)`: an inherited prior-iter finding must carry a current `disposition:` value (`addressed` / `open` / `disputed` / `deferred` / `superseded`). Bucket A findings are the three the manager identified for this iter2 to resolve.

| # | Finding | Severity (iter1) | Surfaced by | Disposition (iter2) | Evidence (this doc) |
|---|---|---|---|---|---|
| 1 | Chat MEMORIZATION contract self-contradictory across §3.2 / §3.3 / §6 / HOW | High | Codex (Consistency — codex-cons-5708c2f3) | **addressed** | §3.3 carries the single canonical statement (R5 lock). §3.2 diagram, §1 HOW.3, §3.4 per-loop discipline, and §6.1 + §6.6 all now point at §3.3 as the source of truth instead of stating Chat MEMORIZATION semantics inline. iter1's contradictions at draft-iter1.md:37 (`skipped`), :88-89 (`mistake-only`), :134 (`runs every loop, narrowed`), :256 (`never skips`) collapse to one statement: "MEMORIZATION runs every loop with a narrowed PASS path locally declared in `chat-mode.md`; Steps 5+8 preserved, Steps 6+7 deferred to Wrap-up; moment-of-capture exception lives in `mistake/SKILL.md § P2`." |
| 2 | Scope Contract §2 missing canonical schema sections | High | Codex (Project — codex-proj-a13f0c91) | **addressed** | §2 now uses the canonical Scope Contract schema from `evaluation/SKILL.md § Scope Contract Schema` — frontmatter (artifact_type / feature / goal / created-by / created-at), and the five required body sections (In-Scope / Out-of-Scope / Decisions Locked / Success Criteria / Deferred). The Success Criteria section has 7 observable signals — the falsifying smoke-test gates Codex's Frame Scenario 3 required. |
| 3 | Promote R1 / R2 / R3 / R5 from §8 "flag for Planning" into resolved Ideation decisions | High | Claude (Usage F-U1 + Overall F-O2) + Codex (Overall codex-overall-5e2d77f4) | **addressed** | R1 promoted to §3.2 + §5 + §6.2 (state-machine-layer `0 → Skipped` semantic, no new settings field). R2+R3 promoted to §5 + §6.7 + §7.3 (new `workflow.chat.tasks[]` array-of-slices schema; templates updated). R5 promoted to §3.3 (single canonical statement, narrowed PASS path declared locally in `chat-mode.md`, base `memorization/SKILL.md` untouched). Each is a resolved Ideation decision now, not a "flag for Planning." |

### 8.2 Bucket B/C/D — iter1 findings deferred to Planning

These are user-deferred per the iter2 brief; documented with `disposition: deferred` and a one-line route-to-Planning rationale. Do not address in this iter; do not silently drop.

| # | Finding | Severity (iter1) | Surfaced by | Disposition (iter2) | Route-to-Planning rationale |
|---|---|---|---|---|---|
| 4 | `task-record.md` frontmatter `type: notes` collides with `memorization/templates/notes.md` (project-tier journal convention; one entry per session is the norm) | High | Codex (Usage — codex-usage-d44ce0b9) | **deferred** | Planning picks one of: (a) `artifact_type: task-record` aligned to the artifacts/ schema, or (b) a new dedicated `task-record` template under `memorization/templates/`. Either way the per-task record is session-scope. iter2 §3.5 acknowledges this and removes the `type: notes` frontmatter prescription from this Idea doc. |
| 5 | Chat session cost / context runaway is unbounded; iter1 §8 has no ceiling scenario for long Chat sessions (no auto-trigger after N tasks; always-on evaluation; unbounded transcript mining for Wrap-up) | High | Codex (Performance — codex-perf-78ab2c64; Risk — codex-risk-3af0c72e; Overall — codex-overall-b60bb421) | **deferred** | Planning decides whether to add: (a) a soft-cap status budget warning at task N, (b) a user-confirmed continuation prompt at a threshold, (c) a Wrap-up suggestion that is advisory rather than automatic, or (d) some combination. The Chat default `maxIter=2` is preserved; only the session-level task-count surface is open. |
| 6 | "Flag don't fix" overused in iter1 §8 — 4 of 13 are structural decisions, not flags | High | Claude (Overall F-O2) | **partially addressed in this iter; residual deferred** | R1 / R2+R3 / R5 are now resolved (Bucket A Finding #3). Residual: R6 (Wrap-up Chat-input extension), R8 (Auto-Mode banner alignment), F-R1 (settings-cascade resolver behavior change) remain "flag for Planning" — these ARE tactical decisions that Planning can resolve within the brief; not structural design questions Ideation needed to answer. The 4 → 0 (structural) + 3 (tactical) shape is acceptable. |
| 7 | Chat per-task layout (`chat/tasks/{NN}-{slug}/`) collides with Execution quartet shape (`execution/task-{NN}/{rawdata,staging,evaluation,artifacts}`) | High | Claude (Structure F-S3) + Codex (cross-cited under Structure) | **deferred** | Planning decides the canonical layout. iter1 R4 named the collision; iter2 does not yet pick the resolution. Candidates: (a) `chat/tasks/{NN}-{slug}/{ideation,planning,execution}/...` with each sub-loop's inner quartet preserved; (b) `chat/task-{NN}/{ideation,planning,execution}/...` to match Execution quartet shape on the outer key; (c) other. The decision is non-trivial because the Wrap-up scanner relies on the on-disk shape to promote staging. |
| 8 | Model-assignment footnote in iter1 §5:242 inverted vs `settings.default.json` (claimed evaluator=opus / executor=sonnet; on-disk has executor=opus / evaluator=sonnet) | Critical-claimed | Claude (Consistency F-C1) | **partially-addressed-as-deferred** | iter2 §5 footnote acknowledges BOTH cited sources (`delegation/SKILL.md § Model Selection` AND `templates/settings.default.json` lines 31–45) and notes the upstream drift between them. **The real bug is the drift between delegation/SKILL.md and settings.default.json, not iter1's footnote per se.** This redesign's `chat-mode.md` + `auto-mode.md` will NOT bake either inversion into their prose — they will point at both sources and defer canonical-source resolution to a separate backlog. The drift fix is **out-of-scope** for this redesign; routed to a separate backlog to be filed by Wrap-up. iter1's Critical · 100 Consistency `FAIL` verdict is correctly downgraded to `addressed-as-deferred` here because the redesign no longer depends on the model-assignment statement being correct in either direction. |
| 9 | Codex (iter1) finding: placeholder files at `chat-mode.md` and `auto-mode.md` "don't exist" | Critical-claimed | Codex (Structure codex-struct-2e4a90bc; Risk codex-risk-484af650; Consistency codex-cons-2e4a90bc) | **disputed (false positive)** | The iter2 leader verified the placeholders ARE present in the worktree at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/{chat-mode.md,auto-mode.md}` (598/636 bytes respectively, dated 2026-05-28 04:48), with matching mirror-symlinks at `.claude/skills/orchestration/{chat-mode.md,auto-mode.md}` (verified via `ls -la`). Codex's iter1 evaluator was run with `--cd /playinganalytics/git/gobbi` (main tree), where the placeholders genuinely do not exist on `develop`. **Process finding (not a design finding):** the iter2 evaluator brief for Codex MUST pre-annotate the worktree path explicitly so Codex's file-existence checks run inside the worktree. The CRUD §7.1 "replace placeholder" semantic is correct for this worktree. |
| 10 | Aesthetics-PASS masked Consistency-Critical (meta-finding) | Meta | Claude (Stage 3 — F-O1 + Tension 2) | **noted as process observation** | Documented for the evaluator pipeline's awareness. Not a doc-level fix. The pattern (well-written prose hides a verifiable factual error) is the same shape as `mistakes/section-order-is-part-of-the-contract-not-just-the-set.md` — flagged for potential future Layer-2 promotion (e.g., a leader-step discipline: "for every claim made about an on-disk source-of-truth, run a verification command and record its output in `research/{slug}.md`"). |
| 11 | §6.1 + §6.6 cross into prose-of-what-to-write (over-specification of Execution-stage prose) | Medium | Claude (Project F-P1) | **deferred (boundary cleanup)** | iter2 §6 already moves the verbatim prose to "shape only" (see §6.1 / §6.6 above — iter2 specifies the structural intent and explicitly defers verbatim wording to Execution). The remaining Ideation/Execution boundary cleanup is a Planning-stage hygiene check — Planning's evaluator should confirm `chat-mode.md` / `auto-mode.md` / SKILL.md amendment prose is authored at Execution, not pre-baked from this Idea doc. |

### 8.3 Additional iter1 evaluator findings (lower-confidence / Low-appendix) — dispositions

These are the remaining iter1 findings not captured in Bucket A or B/C/D. Per `evaluation/SKILL.md`, every iter1 finding must have a current `disposition:` — none stay `open` by silence.

| iter1 Finding | Severity (iter1) | Surfaced by | Disposition (iter2) | Notes |
|---|---|---|---|---|
| F-P2 — Counterfactual not steel-manned (the "do nothing structurally; add 3 more AskUserQuestion gates" alternative is not engaged) | Medium | Claude (Project) | **disputed** | The 9 pre-resolved decisions in the brief explicitly ratify the structural supersession — the user-decided counterfactual choice is captured in the brief, not re-derivable here. iter2's §2 Decisions Locked names this as a brief-side lock. The steel-man would be re-derived from "could 3 more AskUserQuestion gates produce the same per-task slice shape?" — and the user-ratified answer is no (the linear 6-step shape is structurally wrong, not just gate-density wrong). Recording the dispute rather than addressing because the brief locked the direction. |
| F-P3 — Success criteria not observable; falsification signal absent | Medium | Claude (Project) | **addressed** | iter2 §2 Success Criteria section (added per Bucket A Finding #2) lists 7 observable signals — the "first post-merge Chat session produces a `task-record.md`" gate is the falsifying observation. |
| F-P4 — Re-framing check (Sub-step A question 6) outcome not recorded | Low | Claude (Project) | **noted** | Not addressed in this iter; deferred to the Planning evaluator's audit-trail check. The brief explicitly skipped re-litigation of the 9 decisions — Sub-step A's six forcing questions are not re-run when the user has pre-ratified the framed problem. |
| F-P5 — "Superpowers-borrow" / "GSD-borrow" lack reference paths | Low | Claude (Project) | **noted** | Not addressed in this iter; deferred to Planning. The references are pattern-level (no inline code); the audit cost of adding a URL/commit reference is low but not load-bearing. |
| F-S1 — Authoritative-direction rule between SKILL.md and mode sub-docs unspecified | Medium | Claude (Structure) | **deferred** | Planning decides the auth-direction rule. Suggested resolution: "SKILL.md authoritative on workflow contracts; mode sub-docs authoritative on per-mode specs; conflicts resolve in favor of the more specific doc." Out-of-scope here. |
| F-S2 — No per-task state-transition table for Chat (parallel to SKILL.md § Workflow State Machine) | Medium | Claude (Structure) | **addressed (deferred to chat-mode.md authoring)** | The Execution-stage author of `chat-mode.md` MUST include a per-task slice state-transition table parallel to SKILL.md `§ Loop states`. This is now a Planning-tracked requirement (added to §6.3 via the worked-example mandate and to §7.3's Update row for chat-mode.md). |
| F-S4 — No empirical smoke-test gate stated | Medium | Claude (Structure) | **addressed** | iter2 §2 Success Criteria includes 5 verifiable smoke-test gates (files-exist, SKILL.md amendment landed, post-merge `task-record.md` produced, `workflow.chat.tasks[]` populated, no FAIL noise for skipped Preparation). |
| F-U2 — Missing explicit Scenarios / Implementation Checklist headers | Medium | Claude (Usage) | **deferred** | Planning evaluator audits per-section structure. §3-§7 collectively serve the Scenarios + Implementation Checklist roles; explicit header renaming is a hygiene tweak Planning can apply. |
| F-U3 — Placeholder files cited but not verified in canonical project skills dir | Medium | Claude (Usage) | **addressed** | iter2 §7.1 + the Codex Finding #9 dispute documents the worktree verification explicitly. Pre-flight check is still recommended at Execution. |
| F-U4 — Workflow Status Display change implies new state.json fields not enumerated | Medium | Claude (Usage) | **addressed** | iter2 §6.3 + §6.7 explicitly enumerate the backing state shape — `state.json.workflow.chat.tasks[currentIndex]` powers the per-task tier. R3 lock resolves this. |
| F-A1 — Synonym drift on "per-task slice" | Low | Claude (Aesthetics) + Codex (Aesthetics codex-aes-3d91be4a) | **addressed** | iter2 §3.1 locks the canonical term "per-task slice" once and the rest of the document uses it consistently. |
| F-R1 — Settings-cascade rollback story incomplete | Medium | Claude (Risk) | **deferred** | Planning decides whether the resolver code (not just JSON) needs editing to select between two bundled default sets. The shape is in §6.2 (Step-1 dispatch); the resolver-edit decision is tactical. |
| F-R2 — Inter-loop transition table rewrite scope ambiguous | Medium | Claude (Risk) | **addressed** | iter2 §6.5 explicitly states the two transitions (within-slice + at-task-boundary) and §6.1's shape-only spec separates the table-replace from the strikethrough — they are two distinct edits, both documented in §7.3. |
| F-R3 — No empirical Chat-Mode validation gate | Medium | Claude (Risk) | **addressed** | Same as F-S4 — §2 Success Criteria carries the empirical gates. |
| F-C1 — Model assignments inverted vs settings.default.json | Critical | Claude (Consistency) | **partially-addressed-as-deferred** | See Bucket B/C/D Finding #8 above. The upstream drift fix is out-of-scope for this redesign; the iter2 §5 footnote acknowledges both cited sources and defers canonical resolution to a separate backlog. The redesign no longer bakes either inversion into mode-doc prose. |
| F-C2 — "Mirror-symlinks already exist" not verified | Low | Claude (Consistency) | **addressed** | iter2 §7.1 verified the symlinks via `ls -la` (per-file symlinks in `.claude/skills/orchestration/` resolve to canonical files in `.gobbi/projects/gobbi/skills/orchestration/`). Pre-flight check still recommended at Execution. |
| codex-cons-8d66ab12 / codex-aes-3d91be4a — Backlog status "closed 2026-05-23" vs `status: active` | Medium | Codex (Consistency, Aesthetics) | **addressed** | iter2 §1 WHY now says "created 2026-05-23, currently `status: active` / `disposition: open` — will close when this redesign ships." §9 also clarified. |
| codex-perf-6c209df1 — No user-visible budget / health signal | Medium | Codex (Performance) | **deferred (with Finding #5)** | Routed to Planning along with Finding #5 (cost/context runaway). The observability piece is part of the same family. |
| codex-risk-79f7e024 — Task-record may capture user content verbatim; no privacy/retention note | Medium | Codex (Risk) | **partially addressed** | iter2 §3.5 body row now reads "verbatim or paraphrased — privacy note: prefer paraphrase if the ask contains secrets or PII." Wrap-up routing remains session-scope; Planning can add a sanitization step if needed. |
| codex-usage-0fbc3d75 — Status display under-specified for multi-task Chat | Medium | Codex (Usage) | **addressed (deferred to chat-mode.md authoring)** | iter2 §6.3 explicitly requires `chat-mode.md` to include "at least one worked example showing a completed prior task plus the active task." Planning's evaluator audits this. |
| L-P1 / L-C2 / L-U1 — Principle 4 mis-cited; should be delegation/SKILL.md Inline-Paste Rule or Principle 1 | Low | Claude (Project, Consistency, Usage low-conf) | **addressed** | iter2 §1 HOW.8 + §3.4 now cite `delegation/SKILL.md § Inline-Paste Rule` (the discipline) and Principle 1 (the underlying behavioral law), not Principle 4. |
| L-S1 — "Two bundled default sets vs companion file" deferred to Execution Planning | Low | Claude (Structure) | **partially addressed** | iter2 §1 HOW.5 + §6.2 specify the "two bundled default sets, mode-keyed selection at Step-1 completion" choice. The on-disk packaging detail (single JSON with two top-level blocks vs two JSON files) is genuinely a Planning tactical decision. |
| L-R1 — Concurrent-session collision (R-Sc11) | Low | Claude (Risk) | **noted** | Session-id partitioning prevents collision; documented as benign for the audit trail. |
| L-R2 — R-Sc5.1 two-week smell test intersects F-P3 | Low | Claude (Risk) | **subsumed** | Addressed by §2 Success Criteria. |
| codex-cons-low-1 — Auto-mode `evaluate.mode: skip` power-user override may conflict | Low | Codex (Consistency, low-conf) | **noted** | §4.4 already states `skip` is a power-user override; documented for completeness. |
| codex-overall-low-1 — Whether `.claude` symlinks are still required for new sub-documents | Low | Codex (Overall, low-conf) | **addressed** | iter2 §7.1 + Finding #9 dispute confirm the symlinks exist in the worktree and resolve correctly via `-L`. |
| codex-aes-low-1 — ASCII diagram density | Low | Codex (Aesthetics, low-conf) | **noted** | Style preference; the diagram serves an orientation purpose. iter2 retains it. |
| codex-perf-low-1 / codex-usage-low-1 / codex-risk-low-1 — various low-conf items | Low | Codex (various, low-conf) | **noted** | Documented in iter1 evaluator low-confidence appendix; not load-bearing for iter2. |

### 8.4 Remaining risks + unknowns (forward-looking, not iter1 inheritances)

Iter2 carries forward the iter1 risk inventory as Planning-tracked work. Items already resolved above are not re-listed.

| # | Risk / unknown | Severity | Proposed handling |
|---|---|---|---|
| R4 | mini Execution loop and the per-task quartet layout (Bucket Finding #7 deferred) | Medium | Planning: pick the canonical Chat session layout. |
| R6 | Wrap-up's input under Chat narrowed staging | Medium | Planning: extend `wrap-up/SKILL.md` Chat-mode procedure to walk `chat/tasks/*/task-record.md` + per-loop `evaluation/iter{n}/{system}/{perspective}.md`. Promotion routing unchanged. |
| R7 | `maxIterations: 2` for Chat Ideation vs Auto's `3` | Medium | `chat-mode.md` states the cap is intentional (cap-exhaustion = reframe signal). |
| R8 | Auto-Mode banner alignment with Always-Ask matrix (harness-injected) | Medium | Planning: decide whether to update the harness banner text or accept "harness banner's bias is conditioned by Always-Ask per `auto-mode.md`." |
| R9 | Discuss-first as a Chat mode-level property, not a step setting | Medium | `chat-mode.md` documents the contract explicitly; SKILL.md §6.4 cross-links. Optional settings-validator gate is a separate Planning question. |
| R10 | Per-task `task-record.md` template absence (Bucket Finding #4 deferred) | Low | Planning: decide whether to add a dedicated template under `memorization/templates/task-record.md`. |
| R11 | Backlog archive procedure | Low | Standard `memorization/templates/archive.md` move-on-terminal; no special handling needed. |
| R12 | Mirror-symlink pre-flight check at Execution | Low | Pre-flight: `find -L .claude/skills/orchestration -maxdepth 1 -type f -name '*-mode.md'` resolves to canonical files. Verified for this worktree (Finding #9 dispute); re-run at Execution if cross-checkout. |
| R13 | Mode-question wording refresh at session start (`gobbi/SKILL.md`) | Low | Planning: optionally include a one-line refresh — "Chat — per-task slice workflow; Auto — autonomous 6-step." |

---

## 9. Backlogs closed

Two backlogs reach a terminal state when the redesign ships. Both follow the `memorization/templates/archive.md` move-on-terminal procedure (executed by Wrap-up):

| Backlog | Current state | Terminal state (post-ship) | Archive destination |
|---|---|---|---|
| `.gobbi/projects/gobbi/backlogs/chat-mode-tiki-taka-redesign.md` | `status: active` / `disposition: open` (created 2026-05-23) | `closed` / `addressed` (redesign shipped) | `.gobbi/projects/gobbi/archive/backlogs/2026-MM-DD-chat-mode-tiki-taka-redesign.md` |
| `.gobbi/projects/gobbi/backlogs/auto-mode-silence-vs-always-ask.md` | `status: active` / `disposition: open` (created 2026-05-23) | `closed` / `addressed` (Always-Ask codified in `auto-mode.md`) | `.gobbi/projects/gobbi/archive/backlogs/2026-MM-DD-auto-mode-silence-vs-always-ask.md` |

Wrap-up's archive procedure for each:

1. Stamp `archived_at: 2026-MM-DD` (ship date), `archive_reason: addressed`, `status: closed`, `disposition: addressed`, and `shipped_in: <PR-or-merge-commit>` on the backlog file (preserve the body verbatim).
2. `git mv backlogs/{slug}.md archive/backlogs/2026-MM-DD-{slug}.md`.
3. Repoint any inbound references (none expected — neither backlog has incoming `[[slug]]` or `required-mistakes:` links; verify with `rg`).
4. Confirm Wrap-up's session handoff lists both closures.

No physical deletion. The active `backlogs/` directory stays clean.

---

## Cross-references

- `orchestration/SKILL.md` — the workflow governor being amended (lines 62–76, 80–84, 234–241, 245–290, 338–405, 387–405, 426+).
- `orchestration/chat-mode.md` (placeholder → spec target) — Chat-Mode canonical sub-document. Houses the **R5-locked local override** of the Chat MEMORIZATION procedure (cross-link to `memorization/SKILL.md` for the unmodified base).
- `orchestration/auto-mode.md` (placeholder → spec target) — Auto-Mode canonical sub-document.
- `orchestration/templates/{settings,state,session}.default.json` (and `.template.json`) — schema templates updated additively for `workflow.chat.tasks[]` (R2/R3 lock).
- `evaluation/SKILL.md § Scope Contract Schema` — the canonical schema §2 of this Idea doc now conforms to.
- `discussion/SKILL.md § Decision Classification` — Always-Ask matrix source of truth.
- `delegation/SKILL.md § Inline-Paste Rule` — fresh-context-per-task discipline (cited along with Principle 1, not Principle 4 — iter1 mis-citation corrected).
- `delegation/SKILL.md § Model Selection` + `settings.default.json` lines 31–45 — BOTH cited for per-role model assignments (Finding #8 — upstream drift deferred to a separate backlog).
- `memorization/SKILL.md § MEMORIZATION Phase` — the unmodified base referenced from `chat-mode.md`'s local override (R5).
- `memorization/rules.md` + `templates/notes.md` + `templates/archive.md` — slug-naming, notes-type-placement, and move-on-terminal archive procedure.
- `mistake/SKILL.md § P2` — moment-of-capture (preserved in Chat regardless of §3.3 narrowed PASS path).
- `planning/SKILL.md § Core Principles` — USER CHALLENGE escalation primitive (referenced from `auto-mode.md`).
- `backlogs/chat-mode-tiki-taka-redesign.md` + `backlogs/auto-mode-silence-vs-always-ask.md` — closed by this work.
- `mistakes/design-literal-retire-instruction-without-replacement.md` — the amendment-pattern precedent (struck-through original + CORRECTION).
- `mistakes/section-order-is-part-of-the-contract-not-just-the-set.md` — section-order discipline for the new mode docs' ADR sections; also the prior-art for the "Aesthetics-PASS masked Consistency-Critical" pattern noted in Finding #10.
- `mistakes/prose-reclassification-target-is-project-level-notes.md` — task-record is **session-scope** (Finding #4 deferred).
- `mistakes/skills-mirror-symlinks-not-copies.md` — symlink-vs-copy pre-flight discipline.
- iter1 artifact: `<sessions>/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/rawdata/draft-iter1.md`.
- iter1 evaluator outputs: `<sessions>/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/evaluation/iter1/{claude,codex}/`.
