# Evaluation — Usage (Claude · ideation iter1)

**Verdict: REVISE**

## Artifact Summary + Memory reads

Same as `project.md`. The Idea's consumers: (a) the Planner who decomposes this into Planning tasks; (b) the Executor who later writes `chat-mode.md`, `auto-mode.md`, and the SKILL.md amendment; (c) future-self maintainers of the orchestration skill; (d) the manager runtime that dispatches mode.

## Locked Frame (Stage 1)

**Scenario U1 — Planner produces a task list without going back to the user**
- U1.1 Every directional design decision has implementation specificity (library / pattern / path / function name)
- U1.2 Scenarios map 1:1 to Planning tasks

**Scenario U2 — Executor reads each scenario and knows what file / module / function to change**
- U2.1 Every cited reference resolves (paths / line numbers / docs)
- U2.2 Component / function / path names are stable across the document

**Scenario U3 — Future-self maintainer at 3am understands what was built and why**
- U3.1 The artifact names its consumers explicitly
- U3.2 Glossary terms (e.g., "per-task slice", "Always-Ask", "discuss-first") are defined inline or by reference

**Scenario U4 — Failure modes the artifact promises match what the implementation can deliver**
- U4.1 Each named failure mode (e.g., R1 `maxIterations:0` fail path) has a recovery story
- U4.2 No promised behavior the design cannot deliver

**Scenario U5 — Reader forms a wrong mental model (adversarial)**
- U5.1 Borrowed terms ("Auto Mode", "Chat Mode", "Always-Ask", "discuss-first", "MEMORIZATION", "stage") use the project vocabulary's existing meaning
- U5.2 Where a term is overloaded, the local meaning is stated

**Scenario U6 — Observability / "diagnosable at 3am"**
- U6.1 §6.3 Workflow Status Display update specifies what the user sees during a Chat session
- U6.2 The new state (per-task slice ordinal, sub-step state) is renderable from `state.json`

**Scenario U7 — Accessibility / I18n** (Coverage Matrix: Usage)
- not-applicable: this is an orchestration-skill doc redesign, no user-facing UI surface or strings. Declared.

## Per-scenario per-check results

| Check | Result | Evidence |
|---|---|---|
| U1.1 | PARTIAL | Several decisions are deferred to Planning rather than specified: §1 HOW.5 ("two bundled default sets OR companion file — decision deferred to Execution Planning"); R1 (`maxIterations:0` semantics — Planning verifies); R2/R3 (`session.json`/`state.json` shape — Planning decides); R5 (MEMORIZATION-narrowed contract — Planning decides). For an Idea doc, "Planning will figure it out" is acceptable for some axes but for the on-disk shape (R2/R3) it leaks a foundational design decision into Planning that should be in Ideation. Recorded as F-U1. |
| U1.2 | PARTIAL | The artifact does not have a Scenarios section in the ideation-draft sense (per `ideation/evaluation.md` Project seed: "Scenarios are concrete enough for Planning to map them to tasks 1:1"). §3 + §4 + §7 collectively serve this role but no explicit "Scenarios" header. Recorded as F-U2. |
| U2.1 | PARTIAL | Most cited paths are stable. But the artifact claims placeholder files at `chat-mode.md` and `auto-mode.md` exist at `.gobbi/projects/gobbi/skills/orchestration/` and `.claude/skills/orchestration/` — I verified they exist in the **worktree** but NOT in the main project skills dir (only in this worktree's `.claude/skills/...` and `.gobbi/projects/.../skills/...`). Whether the artifact's "Mirror-symlink under `.claude/skills/orchestration/chat-mode.md` already exists" claim holds outside the worktree is not verifiable from here. Recorded as F-U3 (verification gap). |
| U2.2 | YES | Paths, file names are stable. |
| U3.1 | YES | §1 WHY names the Chat-Mode user, the Auto-Mode user, and (implicitly) the maintainer. |
| U3.2 | PARTIAL | "Always-Ask" is defined-by-reference to `discussion/SKILL.md § Decision Classification` (verified, line 140+ in discussion/SKILL.md). "discuss-first" is named as "Superpowers-borrow" with no inline definition or external pointer. "per-task slice" is defined in §3.1. Recorded as F-A1 in aesthetics. |
| U4.1 | PARTIAL | R1's failure mode ("Chat's 'Preparation skipped by default' will fail to dispatch — the loop will enter DISCUSSION, abort, and stamp a `FAIL` verdict, polluting the audit trail") names the failure but the "recovery story" is "Planning verifies + maybe add `preparation.skip: true` field" — that's a contingent recovery. The other recovery option (re-run, manual fix) is not stated. Acceptable for an Idea but the Recovery row is light. Low. |
| U4.2 | YES | No oversold behavior. |
| U5.1 | YES | Mode names + MEMORIZATION + stage all match existing project vocab. |
| U5.2 | YES | "Mini" Plan / Execution is explicitly defined narrowly (§1 HOW.4). |
| U6.1 | PARTIAL | §6.3 specifies the two-tier Chat display: top tier = session-level rows, per-task tier = sub-table for current task. But the artifact does not state which state.json fields back the new per-task rendering. SKILL.md's current Workflow Status Display is a projection of `state.json` (§245). For the Chat-mode rendering to work, new state.json fields are needed (current task ordinal, current sub-step within slice). R2/R3 acknowledge the state-json shape gap but the rendering-side coupling is not made explicit. Recorded as F-U4. |
| U6.2 | NO | See U6.1 — the rendering implies new state.json fields the artifact does not enumerate. |
| U7 | YES | Declared not-applicable. |

## Typed findings

### F-U1 — Several foundational design decisions are deferred to Planning, blurring the Ideation/Planning boundary

- **Type:** `design_flaw`
- **Domain:** `process`
- **Disposition:** `open`
- **Confidence:** 75
- **Severity:** High
- **Evidence:** The artifact's "flag don't fix" pattern is used 9 times in §8. Several flagged items are not implementation tactics — they are **structural design questions** that should be answered in Ideation:
  - R1: `maxIterations:0` → does it mean "Skipped at entry" or "abort after 0"? This is a state-machine semantics question, not a planning-tactic.
  - R2/R3: per-task slice persistence in `session.json` / `state.json` — array of slices vs overwrite? This is a data-model decision; Planning cannot just choose one without re-doing the design.
  - R5: MEMORIZATION-narrowed contract — does Chat's MEMORIZATION skip Steps 6-7 or does `memorization/SKILL.md` add a mode-branch? This is a contract-shape question.
  - "Two bundled default sets OR companion file" (§1 HOW.5 / §7.3 row 8) — this is a settings-cascade design decision.
- **Why it matters:** Per Usage seed U1.1, every directional design decision needs implementation specificity. Per Iron Law 12 ("NO TASK STARTS WITHOUT CLEAR WHAT / WHY / HOW"), Planning cannot consume an Idea whose How leaves 4 foundational decisions to be re-resolved. The Planner will either (a) bounce back for more Ideation, or (b) make the decisions itself, which violates Iron Law 4 (scope is bounded by contract) and Iron Law 5 (no design without prior art + user alignment). The 9 pre-resolved decisions are user-locked; these 4 deferrals are NOT in the 9 — they are gaps below the locked-decision granularity.

### F-U2 — Missing explicit "Scenarios" + "Implementation Checklist" structure (per ideation/evaluation.md)

- **Type:** `scenario_gap`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** 50
- **Severity:** Medium
- **Evidence:** Per `ideation/evaluation.md` line 5: "The artifact under evaluation is the leader's draft at `sessions/{date}-{session-id}/ideation/rawdata/draft-iter{n}.md`. It contains: Scope Contract, Framed Problem (six forcing questions), Research Insights (internal + external, managed independently), Scenarios, Implementation Checklist, Design (directional decisions)." The artifact has: Scope Contract (§2), an implicit Framed Problem (§1 WHY), Design (§3-§5), and an implicit Implementation Checklist (§6 SKILL amendment delta + §7 CRUD blast radius). It does NOT have explicit "Scenarios" or "Implementation Checklist" sections. §3-§5 are design specifications, not scenario lists.
- **Why it matters:** The Ideation contract per `ideation/evaluation.md` calls these out as required sections; downstream Planning expects them in canonical form. Mapping the existing §3-§7 content into Scenarios + Implementation Checklist would not require new content — but the headers' absence means Planning has to identify and extract scenarios from prose, which is the work the Ideation Loop was supposed to do.

### F-U3 — Placeholder file existence cited but not verified in the canonical project skills dir

- **Type:** `assumption_risk`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** 50
- **Severity:** Medium
- **Evidence:** §7.1 + R12 claim "the placeholder files at `chat-mode.md` and `auto-mode.md` already carry mirror-symlinks under `.claude/skills/orchestration/`" and "Mirror-symlink under `.claude/skills/orchestration/chat-mode.md` already exists." I verified the files exist in the **worktree** at `.gobbi/projects/gobbi/worktrees/.../skills/orchestration/{chat-mode.md, auto-mode.md}` and in the worktree's `.claude/skills/orchestration/` — but the artifact phrases it as if the files already exist in the canonical project skills dir. They do NOT exist at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/orchestration/{chat-mode,auto-mode}.md` (main checkout). They are present only in this worktree.
- **Why it matters:** The artifact's CRUD §7.1 says "Replace the existing placeholder (do not create a new file alongside it)." If the placeholders exist in some checkouts and not others (e.g., a different developer's checkout doesn't have them), the Execution step's `Replace placeholder` operation would silently degrade to `Create new file` — fine on disk, but the symlink-mirror claim is no longer guaranteed. R12 acknowledges this with a pre-flight check, but the Idea phrases it as a known fact rather than a hypothesis to verify. Calibrate the wording.

### F-U4 — Workflow Status Display change implies new state.json fields not enumerated

- **Type:** `design_flaw`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** 50
- **Severity:** Medium
- **Evidence:** §6.3 specifies a "two-tier rendering for Chat" with a "Per-task tier: a sub-table for the current task showing Step 2 / Step 3 / Step 4 / Step 5 / task-record with state + iter + verdict." The Workflow Status Display is a "projection of the session's `state.json`" (SKILL.md line 247). The current `state.json` (verified template) carries `workflow.{step}.{state, verdict, iter, maxIterations, phase}` keyed by step name — single-instance per session. Rendering a per-task table with state + iter + verdict per task requires either: (a) new top-level state field (e.g., `workflow.chat.tasks[]` array), or (b) projection of per-task slice's nested `{ideation, planning, execution}` records. Neither is enumerated.
- **Why it matters:** The Display is a contract; without naming the backing state shape, the rendering can't be implemented. R2/R3 explicitly flag the state.json shape gap — but R2/R3 frame it as a persistence-shape question, not a display-projection question. The two are coupled. Calling out the coupling makes the Planning task crisp.

## Per-perspective verdict

**REVISE.**

F-U1 is High · 75 → REVISE per the verdict rule. F-U2/F-U3/F-U4 are Medium and reinforce the same theme: the Idea defers structural design decisions to Planning that should be resolved here. Each is repairable in one round.

## Low-confidence appendix

- **L-U1:** §1 HOW.8 cites Principle 4 (`SCOPE IS BOUNDED BY THE CONTRACT WITH THE USER`) as the justification for "fresh subagent context per task slice." But the inline-paste discipline is more closely tied to delegation/SKILL.md and arguably Principle 1 (no action without thinking it through). Wrong principle citation; confidence 25 because the artifact also cites `delegation/SKILL.md § Inline-Paste Rule` immediately after, so the substantive direction is correct.
