# Evaluation — Structure (Claude · ideation iter1)

**Verdict: REVISE**

## Artifact Summary + Memory reads

Same artifact + memory reads as `project.md`. See that file's "Artifact Summary + Memory reads" section. Highlights relevant to Structure:

- The artifact decomposes the redesign into **two sub-doc files** (`chat-mode.md`, `auto-mode.md`) plus an amendment delta to `orchestration/SKILL.md`. Cascading edits enumerated in §7 CRUD blast radius.
- Mode-dispatched state machine introduced at Step-1-completion as one branch point.
- "Mini" Plan / Execution loops are claimed to share the 5-row shape with `maxIter=2`.

## Locked Frame (Stage 1)

**Scenario S1 — Proposed sub-doc decomposition coheres; each owns one concern**
- S1.1 `chat-mode.md` owns the full Chat spec; `auto-mode.md` owns the full Auto spec; SKILL.md stays workflow-governor — no overlap
- S1.2 Coupling between the three files is unidirectional (SKILL.md points to mode sub-docs; mode sub-docs reference SKILL.md but do not redefine SKILL.md's contracts)

**Scenario S2 — Mode dispatch as a single branch point is locatable in the state-machine description**
- S2.1 The branch point is at Step-1 completion (mode dispatch), not scattered across multiple loop entries
- S2.2 The branch is "declared in SKILL.md but specified in the sub-documents" — single source of truth holds

**Scenario S3 — "Mini" Planning / Execution loops are defined narrowly enough that an executor can implement them**
- S3.1 "Mini" is defined by precise reductions (one task's worth of plan / one sub-step's worth of execution / maxIter=2), not by "smaller"
- S3.2 No reduction in rigor (evaluation always runs, memorization always runs)
- S3.3 The Chat per-task loop's internal structure is locatable

**Scenario S4 — Per-task `task-record.md` artifact fits the existing memorization standard**
- S4.1 §3.4 frontmatter conforms to `memorization/rules.md § 2.1` shared base
- S4.2 Path layout `chat/tasks/{NN}-{slug}/` does not conflict with the per-task Execution quartet documented at `memorization/SKILL.md` §151+
- S4.3 The writer (mini Execution MEMORIZATION assistant, or mini Planning if Execution skipped) has clear ownership

**Scenario S5 — Boring-by-default holds; no novel pattern where existing one suffices**
- S5.1 Sub-document pattern is parallel to existing `workflow/*.md`
- S5.2 ADR-style CORRECTION note matches the precedent in `mistakes/design-literal-retire-instruction-without-replacement.md`

**Scenario S6 — Two-week smell test passes**
- S6.1 A maintainer two weeks from now can read SKILL.md + chat-mode.md and know the Chat-mode shape
- S6.2 No "magic" structural elements

**Scenario S7 — Testability is first-class**
- S7.1 The artifact identifies how the redesign would be verified (smoke-test gate equivalent of T1.h, or similar)
- S7.2 Acceptance criteria are testable

**Scenario S8 — Decomposition silently introduces circular dependency or shared-state hub (adversarial)**
- S8.1 SKILL.md → chat-mode.md → SKILL.md does not create a circular MUST-load
- S8.2 No coordinator-object touching every component (the manager is the only durable cross-task agent — §1 HOW.8 — but this is by design, not anti-pattern)

**Scenario S9 — Nested per-task layout (Chat) vs flat per-task quartet (Execution) coheres or conflicts (adversarial)**
- S9.1 `sessions/{date}-{ssid}/chat/tasks/{NN}-{slug}/{ideation,planning,execution}/...` does NOT conflict with `execution/task-{NN}/{rawdata,staging,evaluation,artifacts}` (the Execution quartet)
- S9.2 The nesting is one ordinal deep, not two — confirmed by R4

## Per-scenario per-check results

| Check | Result | Evidence |
|---|---|---|
| S1.1 | YES | §1 WHAT/HOW splits ownership cleanly — SKILL.md is "workflow governor and state-machine source of truth"; sub-docs own per-mode specs. |
| S1.2 | PARTIAL | The artifact says SKILL.md "carries a short 'see chat-mode.md § Status Display' for the Chat-mode rendering" (§6.3), and `chat-mode.md` "states the contract explicitly; the SKILL.md updates cross-link" (R9). This is bidirectional referencing, not unidirectional. That is fine for sibling docs but the artifact does not name an authoritative-direction rule (which doc wins on conflict). Recorded as F-S1. |
| S2.1 | YES | §6.2 puts the dispatch at Step-1 completion explicitly. |
| S2.2 | YES | §1 HOW.1 and §6.2 both state "declared in SKILL.md but specified in the sub-documents." |
| S3.1 | YES | §1 HOW.4 defines "mini" narrowly: same 5-row shape, `maxIter=2`, scope one task / one sub-step. |
| S3.2 | YES | §3.3 + §1 HOW.4 explicit: "no evaluation skip, no memorization skip, no eval-mode toggle." |
| S3.3 | PARTIAL | The per-task loop's internal structure is described in §3.2 diagram but no row-by-row state-transition table parallel to SKILL.md § Workflow State Machine is provided. The current SKILL.md uses such a table; the Chat per-task slice should have one too (or the deliverable cannot be reviewed against the SKILL contract). Recorded as F-S2. |
| S4.1 | YES | §3.4 frontmatter lists `type: notes, scope: project, feature: null, status: active, created, session, tags`, plus `features_touched`. This conforms to memorization/rules.md §2.1+§2.2 (notes extension). |
| S4.2 | PARTIAL | The Chat tasks dir is `chat/tasks/{NN}-{slug}/`. The Execution quartet (memorization/SKILL.md §151+) is `execution/task-{NN}/...`. The artifact's R4 acknowledges the layout tension explicitly and proposes resolution ("pick canonical names… do not nest `execution/task-{NN}/` inside"). But "do not nest" is an instruction, not yet a chosen layout. The layout itself is not resolved here, only flagged for Planning. Recorded as F-S3. |
| S4.3 | YES | §3.4 names the writer (mini Execution MEMORIZATION assistant on last sub-step PASS, OR mini Planning MEMORIZATION assistant if Execution skipped). |
| S5.1 | YES | §1 HOW.1 names the parallel sub-doc pattern. |
| S5.2 | YES | §6.6 follows the CORRECTION pattern from the cited precedent mistake. |
| S6.1 | PARTIAL | The artifact specifies the supersession + dispatch + sub-doc layout. But a maintainer would need both `chat-mode.md` and the SKILL.md amendment to be readable end-to-end. The §6 amendment is internally consistent. However, the maintainer also needs to understand what "mini Plan with maxIter=2" looks like as a state-machine row — and §3.2's diagram is ASCII-art, not a state-table. Recorded as Low. |
| S6.2 | YES | No magic elements. |
| S7.1 | NO | The artifact does not identify a smoke-test gate or empirical verification for the redesigned Chat shape (parallel to the §124 T1.h smoke-test for worktree creation). Per Structure seed S7. Recorded as F-S4. |
| S7.2 | NO | Same as S7.1. |
| S8.1 | YES | No circular MUST-load. SKILL.md is the governor; mode docs MAY be loaded after orientation. |
| S8.2 | YES | Manager-as-only-cross-task-agent is by-design per delegation/SKILL.md Inline-Paste Rule. |
| S9.1 | PARTIAL | R4 explicitly flags the nesting collision. The artifact recommends `chat/tasks/{NN}-{slug}/{ideation,planning,execution}/...` (where `execution` is the **mini** Execution Loop per sub-step). But the existing Execution quartet is `execution/task-{NN}/{rawdata,staging,evaluation,artifacts}` — and the artifact's recommended Chat layout REPLACES `task-{NN}` with `{NN}-{slug}` and moves the loop-per-step under it. Two collisions: (a) the directory key changes from `task-{NN}` to `{NN}-{slug}` (different shape between Chat and Auto Execution); (b) the inner contents change — under Chat there's `{ideation, planning, execution}` per task, under Auto Execution there's only `{rawdata, staging, evaluation, artifacts}`. This is a structural divergence that needs explicit reconciliation. Recorded as F-S3 (combined). |
| S9.2 | YES | The artifact does call out the ordinal-depth concern explicitly. |

## Typed findings

### F-S1 — Authoritative-direction rule between SKILL.md and mode sub-docs is unspecified

- **Type:** `design_flaw`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** 50
- **Severity:** Medium
- **Evidence:** §1 HOW.1 + §6 establish bidirectional referencing (SKILL.md links to mode docs for the per-mode spec; mode docs reference SKILL.md for the state-machine state table). When the two diverge — say a future PR amends SKILL.md but forgets to amend `chat-mode.md`, or vice versa — which doc wins? The artifact does not state an explicit "SKILL.md is authoritative on workflow contracts; mode sub-docs are authoritative on per-mode specs; conflicts resolve in favor of the more specific doc" rule.
- **Why it matters:** This is the project's own pre-existing pattern problem: the `mistakes/section-order-is-part-of-the-contract-not-just-the-set.md` and `mistakes/design-literal-retire-instruction-without-replacement.md` precedents both came from doc-vs-doc divergence. Without an authoritative-direction rule, the redesign reproduces the same shape.

### F-S2 — No per-task state-transition table for Chat (parallel to SKILL.md § Workflow State Machine)

- **Type:** `scenario_gap`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** SKILL.md § Loop states (worktree lines 358-365) carries a state-table for the existing loop shape: `DISCUSSION → WORK → EVALUATION → MEMORIZATION → ITER / EXIT` with Precondition / Owner / Action / Postcondition per row. The artifact's §3.2 gives an ASCII diagram for the Chat per-task slice but does not provide the parallel state-table. Per Structure seed S3.3: "The Chat per-task loop's internal structure is locatable."
- **Why it matters:** The state-table is the contract — the diagram is a teaching aid. Without the table, the per-task slice's invariants (what state precedes WORK, what the postcondition of MEMORIZATION is in the Chat-narrowed contract, …) are implicit. Planning will have to invent the table; Execution will have nothing to evaluate against. This is the steel-man Structure form of the F-P1 ambiguity from the Project perspective: not enough spec for an Executor, despite being "specification."

### F-S3 — Chat per-task layout still collides with Execution quartet shape

- **Type:** `design_flaw`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** 75
- **Severity:** High
- **Evidence:** Existing per-task Execution layout (`memorization/SKILL.md §151+`): `execution/task-{NN}/{rawdata, staging, evaluation, artifacts}` — quartet rooted under `task-{NN}`. Artifact §3.4 + R4: Chat tasks live at `sessions/{date}-{ssid}/chat/tasks/{NN}-{slug}/`, with the **inner** per-loop directory structure containing `{ideation, planning, execution}` sub-loops. R4 says "do not nest `execution/task-{NN}/` inside (Chat's mini Execution is per-sub-step, not per-task)." That instruction is welcome but does not resolve: what does the **inside** of the Chat task's `execution/` look like? If it follows mini Execution Loop per-sub-step, is it `execution/sub-step-{MM}/{rawdata, staging, evaluation, artifacts}`? The naming is `sub-step-{MM}` (also a positional anti-pattern per memorization/rules.md §1.3) or `{MM}-{slug}`? The artifact does not resolve this.
- **Why it matters:** The whole canonical session tree (`orchestration/SKILL.md § Canonical session tree`) is precisely-specified for the Auto-mode 6-step. Chat's per-task slice is a major structural addition and the on-disk shape is the contract Wrap-up reads to promote staging. If Chat's mini-Execution per-sub-step layout is ambiguous, the Wrap-up scanner has to guess. R4 acknowledges the gap; Planning needs the resolution, not the flag. This is the High-severity Structure finding.

### F-S4 — No empirical smoke-test gate stated

- **Type:** `checklist_gap`
- **Domain:** `test`
- **Disposition:** `open`
- **Confidence:** 50
- **Severity:** Medium
- **Evidence:** SKILL.md §124-134 ("Smoke-test gate (T1.h)") sets the precedent: after a workflow-affecting feature merges, a concrete `jq -r` check verifies the new field shape. The artifact proposes a workflow-affecting redesign but names no equivalent smoke-test gate. Per Structure seed S7.
- **Why it matters:** The redesign changes the per-session on-disk shape (Chat introduces `chat/tasks/` tree; mode-dispatched state machine). Without a smoke-test gate, the first post-merge Chat session has no automated verification its directory layout matches the contract. The pre-existing T1.h precedent is the boring-default; not invoking it is a coverage omission.

## Per-perspective verdict

**REVISE.**

F-S3 is High · 75-confidence → REVISE per Stage 2 verdict rule. F-S1, F-S2, F-S4 are Medium and reinforce the same theme: the Idea is shape-clear but structure-ambiguous in three places that Planning will have to disambiguate (auth direction, per-task state-table, sub-step layout, smoke-test). These four are all repairable in a single REVISE round; none challenge the 9 locked decisions.

## Low-confidence appendix

- **L-S1:** §1 HOW.5 ("Same settings schema, divergent defaults") proposes either "two bundled default sets" or "a single default file + a `settings.chat.default.json` companion the resolver selects on `mode: chat`." The artifact defers the decision to Execution Planning. This is acceptable defer-rather-than-prescribe behavior at Ideation but worth flagging because the resolver cascade is currently single-default — adding mode-divergent defaults is itself a non-trivial structural change to the cascade. Confidence 25 because the artifact does acknowledge the open question.
