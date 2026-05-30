# Idea — Chat Mode + Auto Mode Redesign

> **Session:** 2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf · **Phase:** Ideation iter1 WORK · **Leader:** orchestration redesign
>
> Produces the design memo that becomes input to Planning. No final canonical files are written here. Pre-resolved locks (decisions 1–9 in the brief) are treated as inputs and are not re-litigated.

---

## 1. WHAT / WHY / HOW

### WHAT — the concrete deliverables

Three first-class artifacts and one set of consequential edits:

1. A canonical `orchestration/chat-mode.md` — sub-document of the `orchestration` skill, owning the **full** Chat-Mode specification: posture, the per-user-typed-task workflow shape, per-loop discipline, the per-task `task-record.md` artifact contract, and the explicit-end-of-session Wrap-up trigger.
2. A canonical `orchestration/auto-mode.md` — sub-document of the `orchestration` skill, owning the **full** Auto-Mode specification: posture, the codified Always-Ask categories (referencing `discussion/SKILL.md § Decision Classification`), and the discipline that Preparation runs, evaluation always runs, full per-loop MEMORIZATION runs, and the 6-step state machine is structurally unchanged.
3. An amendment to `orchestration/SKILL.md` that supersedes the current global lock at lines 241–242 (`Mode controls user gates; it does not relax the workflow.`) and introduces a **mode-dispatched** state machine: Auto Mode keeps the existing linear 6-step shape; Chat Mode resolves a different per-user-typed-task shape (full Ideation Loop + skipped Preparation + mini Planning + mini Execution per sub-step + per-task task-record + user review gate, with Wrap-up triggered only on explicit end-of-session signal). The supersession is an ADR-style note in the SKILL.md body, with the old lock struck through and a dated CORRECTION pointing at this Idea doc and the two new sub-documents.
4. Cascading edits: an in-place revision of `orchestration/SKILL.md § Chat Mode` (lines 66–70) and `§ Auto Mode` (lines 72–76) to **link to** the new sub-documents (the SKILL stays the workflow-governor; the sub-documents own each mode's full spec); an update to `§ Workflow Status Display` so Chat-Mode status reflects the per-user-typed-task shape (current state machine fields are step + iter + phase only); an update to `§ Mode-specific gates within a loop` (lines 387–405) acknowledging that Chat now selects a different per-task shape — not just additional gates inside one shape; an update to `§ Inter-loop transition` (lines 234–242) to encode the Chat-Mode "next-task / revise / wrap-up" user review gate that replaces the linear Step-N→Step-N+1 advance for Chat; **archive** the two backlog files closing this work (`chat-mode-tiki-taka-redesign.md` + `auto-mode-silence-vs-always-ask.md`) via Wrap-up's move-on-terminal procedure.

The deliverable is the **specification**. Final prose authoring lives in Execution.

### WHY — the trigger and the value

Two converging witnesses:

- **The two open backlogs.** `chat-mode-tiki-taka-redesign.md` (closed 2026-05-23 with the explicit note "needs many discussions — this session IS those discussions") names the friction: today's Chat Mode is a linear 6-step march dressed up with per-step `AskUserQuestion` confirmations, which is a poor fit for the user's actual conversational pattern — short user-typed tasks, per-task Ideation each time, no upfront task list, no full Preparation per task. `auto-mode-silence-vs-always-ask.md` (closed same day) names the symmetric Auto-Mode gap: Auto biases toward proceeding silently, but several decision categories (Design, Scope, Destructive) MUST trigger `AskUserQuestion` regardless of mode — that discipline is implicit in `discussion/SKILL.md § Decision Classification` (the Always-Ask matrix is fully specified there) but **not codified in the mode contract itself**, so an Auto-mode manager can silently rationalize past it.
- **The existing SKILL.md lock at 241–242** ("Mode controls user gates; it does not relax the workflow.") is structurally incompatible with the user-ratified Chat-Mode shape. Chat Mode now skips Preparation by default and reshapes Planning + Execution into mini-loops per-task — that IS the workflow shape changing, not just the user-gate density. The lock was written when Chat = Auto + extra `AskUserQuestion` calls; that assumption no longer holds. Leaving the lock in place produces design-instruction conflict the next time the SKILL is read end-to-end.

Both witnesses are real (linked backlogs, exact line numbers in the source-of-truth SKILL). The change has a witness per Principle 10.

User-value: the Chat-Mode user gets a conversational loop that matches how they actually work (short typed tasks, no upfront decomposition pressure, full Ideation per task because the idea is what is being explored, lightweight Plan + Execute per task, a durable per-task record at the boundary, and a Wrap-up they explicitly trigger when the conversation is genuinely done). The Auto-Mode user keeps the autonomous linear runway but gets explicit, citable protection against silent decisions in the three categories where the user actually wants gates. Both modes share one settings schema, so the cognitive model stays single-source.

### HOW — the approach

1. **Sub-document the two modes.** Move each mode's full spec into its own sub-doc under `orchestration/`. `orchestration/SKILL.md` stays the workflow governor and the state-machine source-of-truth; `chat-mode.md` and `auto-mode.md` become the canonical per-mode specs that downstream readers consult after orienting on the workflow. This is the same pattern already established in this skill — `workflow/ideation.md` / `workflow/preparation.md` / `workflow/planning.md` / `workflow/execution.md` / `workflow/wrap-up.md` / `workflow/evaluation.md` / `workflow/memorization.md` are sub-documents of the same SKILL. The mode docs slot in beside them.
2. **Replace the global "mode never changes structure" lock with a documented supersession.** Old lock: "Mode controls user gates; it does not relax the workflow." New lock: "Mode dispatches the per-user-typed-task workflow shape; both shapes preserve Ideation rigor, evaluation, and MEMORIZATION." The supersession is recorded ADR-style in SKILL.md (struck-through original + CORRECTION note dated 2026-05-28 pointing at this Idea doc + the new sub-docs) per the project's design-of-record amendment pattern (`mistakes/design-literal-retire-instruction-without-replacement.md` documents the precedent: amend with CORRECTION annotations, do not silently rewrite).
3. **Encode mode-dispatched shapes in the state machine.** Introduce one explicit branch point in the state-machine section: at Step-1 completion, the manager dispatches based on resolved `settings.mode`. Auto → unchanged linear 6-step. Chat → enter the per-user-typed-task loop (full Ideation Loop with `maxIter=2` and forced user-driven DISCUSSION, Preparation skipped, mini Planning Loop with `maxIter=2`, mini Execution Loop per Plan sub-step with `maxIter=2`, per-task `task-record.md` at boundary, user review gate (next task / revise / wrap-up). Wrap-up triggers only on explicit user end-of-session signal; per-loop MEMORIZATION is **skipped** in Chat (mistake-stage moment-of-capture preserved), with full memorization consolidation deferred to the Wrap-up Loop.
4. **Codify "mini" Planning + Execution.** "Mini" is defined narrowly: same 5-row loop shape (DISCUSSION → WORK → EVALUATION → MEMORIZATION → ITER/EXIT) but maxIter=2, scope is one user-typed task only, evaluator runs (always), and the EVALUATION and MEMORIZATION rows persist the same artifacts. The reduction is in **breadth** (one task's worth of plan / one sub-step's worth of execution), not in **rigor** (no evaluation skip, no memorization skip, no eval-mode toggle).
5. **Same settings schema, divergent defaults.** Use the existing `settings.default.json` shape; ship two **default sets** (one for Chat, one for Auto). The mode field at the top of `settings.json` is the dispatch key. The cascaded resolver does not change; only the bundled default values per mode change.
6. **Codify Always-Ask categories in `auto-mode.md`.** The categories already exist in `discussion/SKILL.md § Decision Classification` (Design / Scope / Destructive). `auto-mode.md` references that section and re-states the contract: Auto Mode silence is over-ridden for those three categories regardless of any per-step `discuss.mode: agent` setting. This is the closure of backlog `auto-mode-silence-vs-always-ask.md`.
7. **Per-task task-record.md (GSD-borrow).** Each Chat task closes with a 5–10 line `task-record.md` under `sessions/{date}-{ssid}/chat/tasks/{NN}-{slug}/task-record.md` summarizing: what the user asked, what shipped, decisions taken, open threads. This becomes Wrap-up's MEMORIZATION input — when the user signals end-of-session, the Wrap-up assistant mines the transcript + per-task records to consolidate the session's memory.
8. **Fresh subagent context per task slice.** Codified at Chat-Mode level: every per-task slice spawns leaders / executors / evaluators with their context inline-pasted (Principle 4 + `delegation/SKILL.md § Inline-Paste Rule`); the manager does not lean on cross-task subagent memory.
9. **Discuss-first default.** In Chat Mode, every loop entry forces user-driven DISCUSSION (the leader proposes; the user decides), regardless of `discuss.mode` value. This is the Superpowers-borrow — discuss-first is a Chat-Mode property, not a per-step setting. (Auto-Mode keeps `discuss.mode: user` for Ideation + Preparation and `agent` for Planning / Execution / Wrap-up.)

---

## 2. Scope Contract (this Ideation Loop)

| Axis | Value |
|---|---|
| **Project** | gobbi |
| **Feature** | `orchestration` (the skill being amended; the two sub-documents are part of this skill) |
| **Task** | redesign `chat-mode.md` (primary), adjust `auto-mode.md` (secondary), supersede the global mode lock in `orchestration/SKILL.md`, and identify every co-update site so Planning can decompose into bounded tasks |
| **Locked input decisions (no re-litigation)** | The 9 pre-resolved decisions in the brief: (1) conversational per-task in Chat, (2) Full Ideation Loop per task, (3) Preparation skipped by default in Chat, (4) mini Plan + mini Execute, (5) per-loop MEMORIZATION skipped in Chat / mistake-stage moment-of-capture preserved / per-task `task-record.md`, (6) explicit end-of-session triggers Wrap-up in Chat, (7) Auto codifies Always-Ask, (8) same `settings.json` schema with mode-divergent defaults, (9) mode now affects workflow structure. Plus: single mode question at session start (PR #267); the two retired setup questions (eval-mode, git-workflow-mode) stay retired. |
| **In-scope artifact** | This Idea doc only (`draft-iter1.md`) |
| **Out-of-scope (deferred to Execution)** | Writing final `chat-mode.md` / `auto-mode.md` prose; editing `orchestration/SKILL.md` directly; changing `settings.default.json` values; any cross-skill edit beyond what the mode-dispatched state machine requires (flag don't fix) |
| **Backlogs closed by this work (Wrap-up archives)** | `backlogs/chat-mode-tiki-taka-redesign.md` and `backlogs/auto-mode-silence-vs-always-ask.md` (both move to `archive/backlogs/` per `memorization/templates/archive.md` move-on-terminal model) |

---

## 3. Chat Mode — proposed shape

### 3.1 Mode posture

Chat Mode is the user-driven, conversational orchestration mode. **The user types one task at a time; the manager runs a full per-task workflow slice and returns to the user.** No upfront task list. No autonomous multi-task runway. The session's shape is the union of all per-task slices the user types between session start and the user's explicit end-of-session signal.

This re-frames the 6-step state machine. Configuration runs once at session start (unchanged). Wrap-up runs once at session end (triggered only on explicit user signal). Between them, the manager runs **per-user-typed-task slices**, not linear Ideation → Preparation → Planning → Execution → Wrap-up. Each slice contains its own Ideation, its own (skipped-by-default) Preparation, its own mini Planning, its own mini Execution, and its own task-record boundary.

This is the structural change that supersedes the SKILL.md 241–242 lock. Mode no longer just controls **whether** the manager pauses for `AskUserQuestion`; mode now controls **which state machine** runs between Configuration and Wrap-up.

### 3.2 Per-task workflow shape (diagram)

```
Step 1 — Configuration (once per session)
   │
   ▼
┌──────── Per user-typed task ──────────────────────────────────────┐
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
│      MEMORIZATION  — mistake-stage moment-of-capture only          │
│                      (no full session-staging promotion)           │
│           ↓                                                        │
│      ITER / EXIT (PASS → next; REVISE → back to DISCUSSION)        │
│   │                                                                │
│   ▼                                                                │
│  Step 3 — Preparation Loop  ⊘  SKIPPED by default                  │
│      (settings.workflow.preparation.maxIterations: 0)              │
│      User MAY opt in for a complex task — when opted in, the loop  │
│      runs the standard contract; default is skip.                  │
│   │                                                                │
│   ▼                                                                │
│  Step 4 — mini Planning Loop  (maxIter=2)                          │
│      Same 5-row loop, scope = this one task's worth of plan        │
│      (one or a few sub-steps, ordered).                            │
│   │                                                                │
│   ▼                                                                │
│  Step 5 — mini Execution Loop per Plan sub-step  (maxIter=2)       │
│      Same 5-row loop per sub-step (fresh executor each time);      │
│      sub-steps sequence as the mini-Plan ordered them.             │
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
- **Per-task slice = Steps 2 → 3 → 4 → 5 (with 3 skipped by default).** This is the new structural unit Chat dispatches.
- **EVALUATION runs every loop.** No mode-driven skip. Iron Law 7 holds.
- **MEMORIZATION runs every loop, but with a Chat-narrowed contract.** In Chat, per-loop MEMORIZATION preserves the iteration's transcript + upserts `session.json.workflow.{loop}.iterations[]` per the existing contract (audit-trail must survive) and writes the PASS-iter `artifacts/`, but it **does NOT** stage typed-finding artifacts under `staging/{decisions,scenarios,checklists,...}/`. Staging is consolidated by the Wrap-up Loop at session end from the transcript + per-task `task-record.md` files. The mistake-stage moment-of-capture exception remains live (per `mistake/SKILL.md § P2` — staged the moment a correction is detected, not deferred). This is the pre-resolved decision #5 expressed precisely.

### 3.3 Per-loop discipline

Inside any Chat-Mode loop slice (Ideation / mini Planning / mini Execution):

- **DISCUSSION is forced user-driven**, regardless of the resolved `discuss.mode`. The leader proposes (research-backed); the user decides via `AskUserQuestion`. This is the discuss-first Chat-Mode property (Superpowers-borrow); it does not override `discuss.mode` in settings — settings still resolve to `user` everywhere in the Chat defaults — but it is documented at Chat-Mode level so a future settings change cannot accidentally regress it.
- **Three mode-specific gates within a loop** still apply (per SKILL.md 387–405): after DISCUSSION → confirm delegation prompt; after EVALUATION → discuss findings and remediation; at ITER/EXIT → confirm exit. These remain Chat's per-loop user gates.
- **Iteration cap is 2** for Ideation / Planning / Execution (Auto's default is 3). The narrower budget reflects Chat's per-task scope: a user-typed task that needs three iterations is a signal the user should reframe or split, not iterate further.
- **Evaluation always runs.** `evaluate.mode: always` across all loops in Chat. (Auto: same.)
- **Fresh subagent context per slice.** Every leader / executor / evaluator spawn pastes its context inline — no cross-task subagent memory. The manager is the only durable cross-task agent.
- **mistake-stage moment-of-capture.** Every correction the manager or any subagent identifies in a Chat slice is staged immediately at `sessions/.../{loop}/staging/decisions/{slug}.md` with `mistake-candidate: true`, per `mistake/SKILL.md § P2`. Deferral to Wrap-up is a known failure mode (`mistakes/section-order-is-part-of-the-contract-not-just-the-set.md` and the moment-of-capture witness in `memorization/SKILL.md`).

### 3.4 task-record artifact spec

Per Chat task, written at the task boundary (after the mini Execution Loop's last sub-step exits):

| Field | Value |
|---|---|
| Path | `sessions/{date}-{session-id}/chat/tasks/{NN}-{slug}/task-record.md` (kebab-case slug; `{NN}` is a zero-padded ordinal within the session) |
| Frontmatter | `type: notes`, `scope: project`, `feature: null`, `status: active`, `created: YYYY-MM-DD`, `session: {session-id}`, `tags: [chat-mode, task-record]`, plus a `features_touched: [...]` field per `memorization/rules.md` §2.2 (notes extension) when applicable |
| Body (5–10 lines) | `## What the user asked` (1–2 lines, the user's verbatim or paraphrased ask) → `## What shipped` (1–3 lines, the concrete deliverable + path) → `## Decisions taken` (1–3 lines, citing decisions staged during the task) → `## Open threads` (1–2 lines, anything deferred or flagged) → `## Pointers` (1–2 lines, paths to the slice's `artifacts/` files) |
| Writer | the mini Execution Loop's MEMORIZATION assistant on PASS of the last sub-step, OR — if mini Execution skipped — the mini Planning Loop's MEMORIZATION assistant on PASS. Either way, it is the assistant role; manager verifies presence at the user review gate. |
| Wrap-up role | Wrap-up's MEMORIZATION reads every `task-record.md` in the session, plus the session transcript, and consolidates into project-memory promotions (per `wrap-up/SKILL.md`). Wrap-up may also reclassify task-record bodies' narrative into project-level `notes/` per the project's "reclassification target is project-level notes" mistake (`mistakes/prose-reclassification-target-is-project-level-notes.md`). |
| Filename naming | per `memorization/rules.md` §1.3 — name the **subject** (the task's deliverable concept), not the ordinal. The `{NN}-` prefix is a chronological aid only; the slug must be subject-descriptive (e.g., `03-chat-mode-redesign-idea-doc`, not `03-task-3`). |

### 3.5 Wrap-up trigger (explicit end-of-session)

In Chat Mode, Wrap-up runs **only when the user explicitly signals end-of-session**. The signal is one of:

- The user selects "Wrap up the session" at the per-task user review gate.
- The user types an explicit end-of-session message (e.g., "we're done", "wrap up", "end session").
- The user invokes `/gobbi wrap-up` (if and when such a command exists; otherwise the message form above).

The manager does NOT auto-trigger Wrap-up on any other signal (no auto-trigger on "no more tasks for now", no auto-trigger on idle, no auto-trigger after N tasks). The discipline is symmetric to the Always-Ask Destructive category: ending the session changes durable memory (mistake promotion, archive moves, handoff write) — that decision is the user's.

If the user closes the session without an explicit Wrap-up signal (terminal hang-up), the partial session-memory survives (every loop's MEMORIZATION ran), and a future session can resume per the existing 3-state worktree idempotency guard (`orchestration/SKILL.md § Step 1` row 5).

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
- Full per-loop MEMORIZATION runs (not deferred to Wrap-up).
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
| `workflow.preparation.maxIterations` | `0` (skipped) | `3` | brief lock |
| `workflow.planning.discuss.mode` | `"user"` (Chat forces user-driven DISCUSSION at the mode level — see §3.3) | `"agent"` | brief lock |
| `workflow.planning.evaluate.mode` | `"always"` | `"always"` | brief lock |
| `workflow.planning.maxIterations` | `2` | `3` | brief lock |
| `workflow.execution.discuss.mode` | `"user"` (Chat forces user-driven DISCUSSION at the mode level) | `"agent"` | brief lock |
| `workflow.execution.evaluate.mode` | `"always"` | `"always"` | brief lock |
| `workflow.execution.maxIterations` | `2` | `3` | brief lock |
| `workflow.wrap-up.discuss.mode` | `"user"` (Chat forces user-driven DISCUSSION) | `"agent"` | brief lock |
| `workflow.wrap-up.evaluate.mode` | `"always"` | `"always"` | brief lock |
| `workflow.wrap-up.maxIterations` | `1` | `1` | brief lock |
| `models.{system}.{role}` | unchanged (per-role model assignments are mode-independent) | unchanged | not in scope |
| `git.repo / baseBranch / pr / issue / worktree / branch` | unchanged | unchanged | not in scope |

Notes on the table:

- **Chat's `preparation.maxIterations: 0` is the encoding of "skip by default."** The cascaded resolver MUST treat `maxIterations: 0` as `state: Skipped` at loop entry (no DISCUSSION row runs, no WORK row runs, no EVALUATION/MEMORIZATION). The user MAY override per-session if a complex task warrants Preparation. Verify this `0 → Skipped` mapping is wired in the loop-entry guard; if it currently maps to "run once with cap 0 then abort", that is a Wrap-up-blocking divergence and Planning must include a verification task. (Flagged in §8.)
- **`discuss.mode: "user"` on Chat across all loops is intentional**, but the **mode-level discuss-first contract in `chat-mode.md`** is the binding contract — if a future settings change flips a step to `"agent"`, the mode-level contract still forces user-driven DISCUSSION at every loop entry. Documenting both layers prevents silent regression.
- The `models.*` block stays mode-independent: the role decides the model (Opus for manager / leader / evaluator; Sonnet for executor / assistant), not the mode. Per `delegation/SKILL.md § Model Selection`.

---

## 6. orchestration/SKILL.md amendment delta

### 6.1 Locked-constraint supersession (the headline change)

**Lines 241–242 (current):**

> In both modes, the manager NEVER skips `EVALUATION` (unless `evaluate.mode == 'skip'`) or `MEMORIZATION`. Mode controls user gates; it does not relax the workflow.

**Proposed amended text (with the ADR-style supersession note inline; old wording struck through, new wording locked):**

> ~~Mode controls user gates; it does not relax the workflow.~~ **CORRECTION (2026-05-28, this Idea doc + `chat-mode.md` + `auto-mode.md`):** mode **dispatches the per-user-typed-task workflow shape**. Auto Mode runs the linear 6-step state machine (Configuration → Ideation → Preparation → Planning → Execution → Wrap-up). Chat Mode runs Configuration once, then a **per-user-typed-task slice** between Configuration and Wrap-up (Full Ideation Loop + skipped Preparation + mini Planning Loop + mini Execution Loop per sub-step + per-task `task-record.md` + user review gate), with Wrap-up triggered only on explicit user end-of-session signal. **Both shapes preserve evaluation rigor (`evaluate.mode: always` is the Chat + Auto default) and MEMORIZATION durability (every loop's MEMORIZATION runs to preserve the iteration's transcript + `session.json` audit trail; Chat narrows the staging contract per `chat-mode.md`).** The manager NEVER skips `EVALUATION` (unless `evaluate.mode == 'skip'` per power-user override) or `MEMORIZATION` in either mode.

Place the CORRECTION inline at lines 241–242 (per the project's amendment pattern in `mistakes/design-literal-retire-instruction-without-replacement.md`). Do not delete the original wording; strike it through so the historical lock is auditable.

### 6.2 New state-machine description

In `§ Workflow` (around line 80–84) and `§ Workflow State Machine` (line 338+), add a **mode-dispatch branch** to the state-machine description:

```
Step 1 — Configuration  (single pass, both modes)
        │
        ▼
    [mode dispatch from resolved settings.mode]
       │                                    │
   mode = auto                          mode = chat
       │                                    │
       ▼                                    ▼
 Linear 6-step state machine     Per-user-typed-task slice loop:
 (Steps 2 → 3 → 4 → 5 → 6        repeat { Step 2 → (Step 3 skipped)
 in order, single pass)           → Step 4 (mini) → Step 5 (mini)
                                  → task-record → user review gate }
                                  until user signals end-of-session
                                    │
                                    ▼
                                  Step 6 — Wrap-up (full MEMORIZATION
                                  consolidation; triggered explicitly)
```

The branch is **declared in SKILL.md but specified in the sub-documents.** SKILL.md says "Chat dispatches per `chat-mode.md`; Auto dispatches per `auto-mode.md`". The full per-mode procedure lives in the sub-doc to keep SKILL.md scannable.

### 6.3 § Workflow Status Display update

Current `§ Workflow Status Display` (line 245+) renders a single 6-row table:

| # | Step | State | Iter | Verdict |
|---|---|---|---|---|
| 1 | Configuration | ... | — | — |
| 2 | Ideation Loop | ... | ... | ... |
| ... | ... | ... | ... | ... |
| 6 | Wrap-up Loop | ... | ... | ... |

For Chat Mode, the display must reflect the per-user-typed-task structure. Proposed update:

- **Header** stays: `Workflow Status — Mode: chat — Active: Task {NN} — {step-in-slice} of 4` (the 4 is the per-task slice's structural length: Step 2 + Step 4 + Step 5 + task-record; Step 3 is shown as `⊘ Skipped` when default).
- **Body** becomes a two-tier rendering for Chat:
  - Top tier: session-level rows (Configuration, current task ordinal, Wrap-up trigger status). Configuration: `✓ Done`. Wrap-up: `… Pending — awaiting user signal`.
  - Per-task tier: a sub-table for the current task showing Step 2 / Step 3 / Step 4 / Step 5 / task-record with state + iter + verdict.
- **Render points** unchanged (every `AskUserQuestion` in Chat; every loop boundary in Auto).
- **Auto Mode rendering unchanged** — the existing 6-row table is the canonical view.

The change is additive; the existing Auto rendering is preserved verbatim. `chat-mode.md` owns the full Chat rendering spec; SKILL.md `§ Workflow Status Display` carries a short "see `chat-mode.md § Status Display` for the Chat-mode rendering" pointer.

### 6.4 § Mode-specific gates within a loop update

Current `§ Mode-specific gates within a loop` (line 387–405) describes three Chat-mode gates and the Auto-mode advance contract. Proposed update:

- The three Chat-mode gates (after DISCUSSION / after EVALUATION / at ITER-EXIT) **stay** — they are the loop-internal user gates. Within Chat's per-task slice, every loop hits them.
- Add a **fourth Chat-mode gate**: the **per-task user review gate** at task boundary, after `task-record.md` writes. Options: next task / revise / wrap up. This is the new gate the redesign introduces.
- Add a paragraph noting that in Chat Mode, the per-step `discuss.mode` setting is **shadowed** by the mode-level discuss-first contract: regardless of step setting, every loop entry forces user-driven DISCUSSION. Point at `chat-mode.md § Per-loop discipline`.

### 6.5 § Inter-loop transition update

Current `§ Inter-loop transition` (line 234+) is a simple 2-row table: Chat asks-to-advance Step N → Step N+1; Auto auto-advances. Proposed update:

| Mode | Behavior at the `ITER / EXIT` exit of step `N` |
|---|---|
| Chat | **Within a per-user-typed-task slice**: AskUserQuestion to confirm advance to the next slice-step (Step 2 → Step 4 → Step 5). **At task boundary**: AskUserQuestion the per-task user review gate (next task / revise / wrap up). **Only on "wrap up"** does the manager advance to Step 6. |
| Auto | Auto-advance to step `N+1`. Halt only if a `maxIterations` abort makes downstream infeasible or a user-authority decision is required. |

The Auto row is unchanged. The Chat row is restructured to encode the per-task slice and the user review gate.

### 6.6 ADR-style supersession note

A consolidated CORRECTION block placed at the head of `§ Orchestration Mode` (around line 62), referencing this Idea doc:

```
> CORRECTION — 2026-05-28
>
> The historical lock "Mode controls user gates; it does not relax the workflow."
> (formerly at this skill's `§ Mode-specific gates within a loop` / SKILL.md:241-242)
> is superseded. Mode now dispatches the per-user-typed-task workflow shape.
> See:
>   - chat-mode.md  — full Chat-Mode specification
>   - auto-mode.md  — full Auto-Mode specification
>   - sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/rawdata/draft-iter1.md
>     — the Idea doc that drove the supersession (this artifact is staged to
>     `staging/decisions/` at PASS per the standard memorization contract)
>
> Both shapes preserve evaluation (always) and MEMORIZATION (every loop) — the
> rigor floor is unchanged; only the shape between Configuration and Wrap-up
> dispatches.
```

This pattern follows the precedent in `mistakes/design-literal-retire-instruction-without-replacement.md` — original is struck through but preserved; CORRECTION is dated and points at the witnessing artifact + replacement docs.

---

## 7. CRUD blast radius

Per Principle 13: enumerate every file the same change must co-touch. Implementation belongs to Execution; this section is the spec the planner reads to decompose.

### 7.1 Create

| Path | Type | Notes |
|---|---|---|
| `.gobbi/projects/gobbi/skills/orchestration/chat-mode.md` | skill sub-document | Replace the existing placeholder (do not create a new file alongside it). Full Chat-Mode spec per §3. Mirror-symlink under `.claude/skills/orchestration/chat-mode.md` already exists. |
| `.gobbi/projects/gobbi/skills/orchestration/auto-mode.md` | skill sub-document | Replace the existing placeholder. Full Auto-Mode spec per §4. Mirror-symlink under `.claude/skills/orchestration/auto-mode.md` already exists. |

No new directories created. No new templates needed (the modes are skill sub-documents, not new memory types).

### 7.2 Read (consulted for consistency)

| Path | Purpose |
|---|---|
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | The doc being amended; full read required. Anchors at lines 64–74 (Chat / Auto descriptions), 80–84 (Workflow header), 234–242 (Inter-loop transition + the lock), 245–290 (Workflow Status Display), 338–405 (Workflow State Machine + Mode-specific gates), 407–420 (Loop ↔ agent type). |
| `.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json` | The current Auto-flavored default. Read to confirm shape; write deferred to Execution. |
| `.gobbi/projects/gobbi/skills/discussion/SKILL.md` | `§ Decision Classification` — the Always-Ask matrix `auto-mode.md` references. |
| `.gobbi/projects/gobbi/skills/delegation/SKILL.md` | `§ Model Selection`, `§ Inline-Paste Rule` — the fresh-context-per-task discipline `chat-mode.md` codifies. |
| `.gobbi/projects/gobbi/skills/memorization/SKILL.md` + `rules.md` + `templates/notes.md` | The `task-record.md` artifact contract (frontmatter, naming, project-only `notes/` type-placement). |
| `.gobbi/projects/gobbi/skills/memorization/templates/archive.md` | The move-on-terminal contract Wrap-up uses to archive the two closed backlog files. |
| `.gobbi/projects/gobbi/skills/mistake/SKILL.md` | `§ P2 — moment-of-capture` — the discipline `chat-mode.md` preserves even when per-loop staging is narrowed. |
| `.gobbi/projects/gobbi/skills/planning/SKILL.md` | `§ Core Principles § USER CHALLENGE` — referenced from `auto-mode.md`. |
| `.gobbi/projects/gobbi/backlogs/chat-mode-tiki-taka-redesign.md` | The backlog being closed. Read for the original framing; archived by Wrap-up. |
| `.gobbi/projects/gobbi/backlogs/auto-mode-silence-vs-always-ask.md` | The backlog being closed. Read for the original framing; archived by Wrap-up. |
| `.gobbi/projects/gobbi/mistakes/design-literal-retire-instruction-without-replacement.md` | The amendment-pattern precedent (CORRECTION-with-struck-through-original). |
| `.gobbi/projects/gobbi/mistakes/section-order-is-part-of-the-contract-not-just-the-set.md` | The contract-shape precedent for ADR-section-order in mode docs. |
| `.gobbi/projects/gobbi/mistakes/prose-reclassification-target-is-project-level-notes.md` | The `notes/` type-placement gotcha — `task-record.md` is project-tier, not feature-tier `notes/`. |
| `.gobbi/projects/gobbi/rules/stub-redirect-format.md` | Not applicable here (no doc is being stubbed); read to confirm we are NOT creating stubs (the placeholders are being replaced in place). |
| `CLAUDE.md` (workspace + project) | Read to verify no Iron Law row need re-numbering. Confirmed: the amendment touches `orchestration` skill text only; no principle is added or removed. |

### 7.3 Update (with anchors)

| Path | Anchors (lines / sections) | Change |
|---|---|---|
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | Lines 64–74 — `## Orchestration Mode` + `### Chat Mode` + `### Auto Mode` blocks | Add the consolidated CORRECTION block (§6.6) at the head of `## Orchestration Mode`. Trim the Chat / Auto inline descriptions to one sentence each + a link to the sub-doc (`See chat-mode.md` / `See auto-mode.md` for the full spec). |
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | Lines 80–84 — `## Workflow` header | Insert the mode-dispatch branch description (§6.2) before the Step-1 sub-heading. |
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | Lines 234–242 — `### Inter-loop transition` | Replace the 2-row table per §6.5. |
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | Line 241–242 — the lock | Strike through the original sentence; add the CORRECTION inline per §6.1. |
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | Lines 245–290 — `## Workflow Status Display` | Add a sub-section "Chat-mode rendering" with the two-tier display (or a pointer to `chat-mode.md § Status Display`) per §6.3. Auto rendering unchanged. |
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | Lines 387–405 — `### Mode-specific gates within a loop` | Add the per-task user review gate as a fourth Chat-mode gate; add the discuss-first-shadows-discuss.mode paragraph per §6.4. |
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | `## Workflow State Machine` (line 338+) | Add the mode-dispatch branch description; cross-link to `chat-mode.md` for the Chat per-task slice's state-transition table. |
| `.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json` | Whole file | Replace the single default-set with **two bundled default sets** (Chat + Auto), or keep a single default file and ship a `settings.chat.default.json` companion the resolver selects on `mode: chat`. Decision deferred to Execution Planning — flag for Planning. |
| `.gobbi/projects/gobbi/skills/orchestration/chat-mode.md` | Whole file (currently a placeholder) | Replace with full spec per §3. |
| `.gobbi/projects/gobbi/skills/orchestration/auto-mode.md` | Whole file (currently a placeholder) | Replace with full spec per §4. |
| `.gobbi/projects/gobbi/backlogs/chat-mode-tiki-taka-redesign.md` | Frontmatter | Wrap-up: set `status: closed`, `disposition: addressed`, add `shipped_in: <PR>`, then `git mv` to `.gobbi/projects/gobbi/archive/backlogs/2026-05-28-chat-mode-tiki-taka-redesign.md` per `memorization/templates/archive.md`. |
| `.gobbi/projects/gobbi/backlogs/auto-mode-silence-vs-always-ask.md` | Frontmatter | Same archive procedure as above. |

**Flag (don't fix):** the Auto-mode banner is harness-injected, not file-resident. If the redesign wants the banner text aligned with the Always-Ask matrix language, that is a separate hook / harness change — flagged for Planning to decide whether to scope in.

### 7.4 Delete (none)

Per the project's no-delete model. Backlogs are moved, not deleted (move-on-terminal). The SKILL.md lock is struck through, not deleted. The placeholders at `chat-mode.md` and `auto-mode.md` are overwritten in place (overwrite is not delete; the file path persists).

---

## 8. Risks + unknowns

| # | Risk / unknown | Severity | Proposed handling |
|---|---|---|---|
| R1 | **`preparation.maxIterations: 0` semantics.** If the loop-entry guard currently treats `maxIterations: 0` as "run once with cap 0 then abort", Chat's "Preparation skipped by default" will fail to dispatch — the loop will enter DISCUSSION, abort, and stamp a `FAIL` verdict, polluting the audit trail. The intended semantics is `state: Skipped` at loop entry with no rows running. | High | Planning includes a verification task: grep the SKILL.md state-machine description + the loop-entry handler reference (currently markdown-only) for how `maxIterations: 0` is interpreted. If it maps to "Skipped at entry", proceed. If it maps to "abort after cap 0", add a settings field — `preparation.skip: true` — and document the `0 → Skipped` mapping. |
| R2 | **`session.json.workflow.preparation.iterations[]` shape under "Skipped".** When Preparation is skipped per task in Chat, every per-task slice would write an `iterations: []` (empty array) and `verdict: Skipped` to `session.json.workflow.preparation`. But `session.json.workflow.{loop}` is currently single-instance (one Preparation record per session). Chat's per-task slice would either overwrite or require an array-of-slices structure. | High | Flag for Planning: decide whether Chat's per-task slice writes to a new `session.json.workflow.chat.tasks[]` array (each entry containing the per-task `{ideation, preparation, planning, execution}` records) OR whether the existing `workflow.{loop}` shape stays and Chat overwrites. Recommend the array-of-slices approach for auditability; flag because it touches the `session.json` schema. |
| R3 | **state.json shape.** `state.json.workflow.{loop}` is currently single-instance per session. Same risk as R2. | High | Same handling — Planning decides the per-task slice persistence shape across `state.json` and `session.json` together. |
| R4 | **mini Execution loop and the per-task quartet.** `memorization/SKILL.md § Per-task Execution layout (the quartet)` declares each Execution task lives under `execution/task-{NN}/{rawdata,staging,evaluation,artifacts}`. Chat's per-task slice nests this inside its own per-task scope. The nested path becomes `chat/tasks/{NN}-{slug}/execution/task-{MM}/...`, which is two ordinals deep. Confirm the layout is unambiguous and the assistant can resolve `task-{NN}` correctly. | Medium | Planning: include a layout-spec task for the Chat-mode session tree under `sessions/{date}-{ssid}/chat/`. Pick canonical names (e.g., `chat/tasks/{NN}-{slug}/{ideation,planning,execution}/...`); do not nest `execution/task-{NN}/` inside (Chat's mini Execution is per-sub-step, not per-task). |
| R5 | **Per-loop MEMORIZATION "narrowed contract" in Chat.** §3.2 says MEMORIZATION still preserves the iteration's transcript + `session.json` upsert + PASS-iter `artifacts/`, but does NOT stage typed-finding artifacts under `staging/{decisions,scenarios,checklists,...}/`. The current MEMORIZATION procedure (`memorization/SKILL.md § MEMORIZATION Phase`) ties staging to PASS Steps 5–7. Implementing the Chat-narrowed contract requires either a mode-aware MEMORIZATION procedure OR Chat skips Steps 6–7 of MEMORIZATION explicitly. | High | Surface at Planning: decide whether `memorization/SKILL.md` adds a Chat-mode branch (Steps 5 + 8 only, skip Steps 6 + 7), or whether `chat-mode.md` overrides the contract for its loops. **The mistake-stage moment-of-capture (decision #5) MUST remain live regardless of which approach is taken**, per `mistake/SKILL.md § P2`. |
| R6 | **Wrap-up's input under Chat.** Wrap-up's MEMORIZATION currently consumes accumulated `staging/` across loops. If Chat narrows per-loop staging (R5), Wrap-up's input shrinks. Wrap-up must mine the per-task `task-record.md` files + the transcript to recover what would otherwise have been staged. | Medium | Surface at Planning: extend `wrap-up/SKILL.md` Chat-mode procedure to walk `chat/tasks/*/task-record.md` and the transcript. Promotion routing is unchanged. |
| R7 | **`maxIterations: 2` for Chat Ideation vs Auto's `3`.** The 2-cap forces the user to reframe at iter 3 instead of iterating once more. This is a deliberate choice but worth surfacing: a complex Chat task may hit the cap before reaching PASS, and the user may experience this as friction. | Medium | `chat-mode.md` should state the cap is intentional and provide guidance: cap-exhaustion is a reframe signal, not a failure. Auto's `3` cap is the autonomy-budget; Chat's `2` is the conversation-rhythm budget. |
| R8 | **Auto-Mode banner alignment.** The harness-injected Auto Mode banner says "make the reasonable call and keep going" — a phrase that may rationalize past Always-Ask categories if read in isolation. | Medium | Flag for Planning: decide whether to align the harness banner with `auto-mode.md § Always-Ask codification`, or whether `auto-mode.md` simply states "the harness banner's bias is conditioned by the Always-Ask matrix." Recommend the latter (file-resident docs are the contract; the banner is hint text). |
| R9 | **Discuss-first as a Chat mode-level property, not a step setting.** `settings.json.workflow.{step}.discuss.mode` exists as the per-step toggle. In Chat, this toggle is **shadowed** by the mode-level discuss-first contract. A future setting that flips a Chat step to `agent` would silently regress the contract unless the mode contract is documented as binding. | Medium | `chat-mode.md` states the contract explicitly; the SKILL.md `§ Mode-specific gates within a loop` update (§6.4) cross-links. Optional: add a settings-validator gate that warns if a Chat session resolves to `discuss.mode: agent` on any loop. Flag don't fix — gate is out of scope; documentation is in scope. |
| R10 | **Per-task `task-record.md` template absence.** There is no `task-record.md` template in `memorization/templates/`. §3.4 specifies the body shape, but a template artifact would help executors stamp consistently. | Low | Flag for Planning: decide whether to add `memorization/templates/task-record.md` (a new template) or whether the body shape can stay in `chat-mode.md` as a fenced example. Recommend a template if the body shape stabilizes after a few sessions. |
| R11 | **Backlog archive procedure.** Both closed backlogs were created in session `1b26cf20`. The archive move stamps `archived_at` with today's date. Verify the Wrap-up assistant can resolve both backlog paths (they live at `.gobbi/projects/gobbi/backlogs/`, not under `features/{f}/backlogs/`) — they are project-scope per their frontmatter (`scope: project`, `feature: null`). | Low | The archive procedure in `memorization/templates/archive.md` handles project-scope backlogs cleanly (`archive/backlogs/{YYYY-MM-DD}-{slug}.md`). No action needed beyond stamping the archive frontmatter. |
| R12 | **The placeholder files at `chat-mode.md` and `auto-mode.md` already carry mirror-symlinks under `.claude/skills/orchestration/`.** Editing the canonical files at `.gobbi/projects/gobbi/skills/orchestration/{chat,auto}-mode.md` automatically reflects via symlink. Verify before Execution. | Low | `find -L .claude/skills/orchestration -type f -name '*-mode.md'` should resolve to the canonical files. Pre-flight check in Execution Planning. |
| R13 | **Unknown — interaction with the `gobbi` skill's session-bootstrap mode question.** `gobbi/SKILL.md § Session Bootstrap Order` asks the single mode question at session start (per PR #267). The redesign does not change this, but the mode question's option descriptions in the `AskUserQuestion` card may need a small wording refresh to reflect the new Chat shape ("Chat — per-typed-task workflow; Auto — autonomous 6-step"). | Low | Flag for Planning: optionally include a one-line wording refresh task on `gobbi/SKILL.md`'s bootstrap question. |

---

## 9. Backlogs closed

Two backlogs reach a terminal state when the redesign ships. Both follow the `memorization/templates/archive.md` move-on-terminal procedure (executed by Wrap-up):

| Backlog | Terminal state | Archive destination |
|---|---|---|
| `.gobbi/projects/gobbi/backlogs/chat-mode-tiki-taka-redesign.md` | `closed` / `addressed` (redesign shipped) | `.gobbi/projects/gobbi/archive/backlogs/2026-05-28-chat-mode-tiki-taka-redesign.md` |
| `.gobbi/projects/gobbi/backlogs/auto-mode-silence-vs-always-ask.md` | `closed` / `addressed` (Always-Ask codified in `auto-mode.md`) | `.gobbi/projects/gobbi/archive/backlogs/2026-05-28-auto-mode-silence-vs-always-ask.md` |

Wrap-up's archive procedure for each:

1. Stamp `archived_at: 2026-05-28`, `archive_reason: addressed`, `status: closed`, `disposition: addressed`, and `shipped_in: <PR-or-merge-commit>` on the backlog file (preserve the body verbatim).
2. `git mv backlogs/{slug}.md archive/backlogs/2026-05-28-{slug}.md`.
3. Repoint any inbound references (none expected — neither backlog has incoming `[[slug]]` or `required-mistakes:` links; verify with `rg`).
4. Confirm Wrap-up's session handoff lists both closures.

No physical deletion. The active `backlogs/` directory stays clean.

---

## Cross-references

- `orchestration/SKILL.md` — the workflow governor being amended (lines 64–74, 80–84, 234–242, 245–290, 338–405, 387–405).
- `orchestration/chat-mode.md` (placeholder → spec target) — Chat-Mode canonical sub-document.
- `orchestration/auto-mode.md` (placeholder → spec target) — Auto-Mode canonical sub-document.
- `discussion/SKILL.md § Decision Classification` — Always-Ask matrix source of truth.
- `delegation/SKILL.md § Inline-Paste Rule` — fresh-context-per-task discipline.
- `memorization/SKILL.md § MEMORIZATION Phase` + `rules.md` + `templates/notes.md` + `templates/archive.md` — staging contract, project-tier `notes/` type-placement, and move-on-terminal archive procedure.
- `mistake/SKILL.md § P2` — moment-of-capture (preserved in Chat regardless of narrowed per-loop staging).
- `planning/SKILL.md § Core Principles` — USER CHALLENGE escalation primitive (referenced from `auto-mode.md`).
- `backlogs/chat-mode-tiki-taka-redesign.md` + `backlogs/auto-mode-silence-vs-always-ask.md` — closed by this work.
- `mistakes/design-literal-retire-instruction-without-replacement.md` — the amendment-pattern precedent (struck-through original + CORRECTION).
- `mistakes/section-order-is-part-of-the-contract-not-just-the-set.md` — section-order discipline for the new mode docs' ADR sections.
- `mistakes/prose-reclassification-target-is-project-level-notes.md` — `task-record.md` is project-tier `notes/`, not feature-tier.
