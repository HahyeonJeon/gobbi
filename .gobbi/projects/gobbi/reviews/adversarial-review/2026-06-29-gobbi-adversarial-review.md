---
name: gobbi-adversarial-review
description: "D7 + D1 dual-system adversarial review of gobbi — 40 findings (live-session UX + E2E lifecycle/staleness)."
type: reviews
scope: project
feature: null
status: active
created: 2026-06-29
session: 0305008a-4073-428a-8094-fbb6d0808dea
tags: [evaluation]
keywords: [adversarial-review, d7, d1, live-session-ux, lifecycle, staleness, dual-system, s5]
author: claude
review_kind: adversarial-review
subject: "gobbi full surface — D7 live-session UX + D1 E2E lifecycle/staleness"
verdict: needs-attention
---

# gobbi adversarial review — D7 live-session UX + D1 E2E lifecycle/staleness

Consolidated source-of-record for this session's slice of the charter-driven adversarial review
(`plans/workflow/2026-06-29-adversarial-review-charter.md`, Decisions 1-5). Two dimensions ran this
session — **D7** (live-session UX / progress-visibility) and **D1** (E2E lifecycle + the S1-S7
scenarios, with S5 memory-staleness as the review-only centerpiece). Each ran **dual-system**: an
independent Claude reviewer plus an independent background `codex exec` reviewer, reconciled by the
manager via **pessimistic union** (every single-system finding kept; on severity divergence the
HIGHER is taken and the divergence recorded). **Review-only** — no source edits; all dispositions are
`open` and route to the fix-backlog.

## Scope

**Dimensions covered (this session):**
- **D7 — live-session UX / progress-visibility** (D7.1-D7.6; charter Seed A is instance 1). One dual-system pass. 8 reconciled findings (`D7-R1 … D7-R8`).
- **D1 — E2E lifecycle** (D1.1-D1.8) plus the **S1-S7 scenarios/checklists**. Sub-chunked A (orchestration spine) + B (skill-level handoffs) + **S5** (memory-staleness, sampled). 32 reconciled findings (`D1-001 … D1-032`).
- **S5 memory-staleness** is sampled, not exhaustive — ~17 (claude) / 21 (codex) records close-read against live code; the ~127K memory tree is NOT audited file-by-file (charter out-of-scope).

**Method:** independent Claude reviewer + background Codex reviewer per pass; manager reconciles by pessimistic union; cross-system divergence preserved as the anti-groupthink signal. Execution EVALUATION adversarially re-verified the 4 Codex-only High findings (path/field/routing checks) before this artifact was written.

**Out of scope (handed off):** D2 (completeness / between-skill), D3 (harness comparison), D4 (naming / counts), D5 (text-polish), D6 (plugin / mirror). Any FIX of any finding (charter is review-only; fixes are separate Execution sessions). Building the S5 re-sync mechanism (Decision-5 — suggestion only).

**Source detail (session record, this session):** raw reviewer files under
`sessions/2026-06-29-0305008a-…/4-execution/task-01-d7/working/` (D7) and `task-02-d1/working/` (D1);
reconciled inputs at `task-01-d7/staging/reviews/d7-reconciled-findings.md` +
`task-02-d1/staging/reviews/d1-reconciled-findings.md`.

**Severity tally.**
- **D7 (8):** 1 High · 7 Medium.
- **D1 (32), post-verification:** Critical 2 · High 5 · Medium 18 · Low 7 (the Execution EVALUATION re-verified and reconciled D1-003 High→Medium, D1-004 High→Low, D1-007 High→Medium, D1-009 High→Medium; see `## Findings` annotations and `## Cross-system divergences`).
- **Combined (40):** Critical 2 · High 6 · Medium 25 · Low 7.

## Findings

All 40 findings in per-finding record shape, IDs preserved. Disposition `open` for all (review-only → fix-backlog). The four D1 findings re-verified at Execution EVALUATION carry a **Verified severity** line.

### D7 — live-session UX / progress-visibility (8: 1 High, 7 Medium)

Both reviewers independently produced 7 findings mapping ~1:1 — strong cross-system agreement. Divergence: Codex split per-agent-activity vs active-artifact into two findings; Claude isolated the `state.json` per-task cursor as the file-backed root cause (D7-R5).

#### D7-R1: Blockers & pending decisions are not file-backed live state
- Severity: High | Confidence: 75 | Priority: high | System: claude+codex (both)
- Dimension: D7 | Owner-surface: workflow
- Location: `orchestration/SKILL.md:133-143,245` (state enum); `agents/manager.md:121-129` (BLOCKED report state); `auto-mode.md:254-326` (defers aborts/triage to Wrap-up)
- Observed: `state.json` state enum = Pending/Active/Revising/Done/Skipped/Aborted — no Blocked/Waiting — but the manager report enum has BLOCKED; Auto-mode defers aborts/triage to Wrap-up. A parked session shows "▸ {phase}" with no blocker marker.
- Proposed remediation: add Blocked/Waiting to the state.json state enum + status-display table; add state-backed queues for blockers and pending user decisions.
- Disposition: open

#### D7-R2: No user-visible live task list required at phase transitions (Seed A, instance 1)
- Severity: Medium | Confidence: 100 | Priority: medium | System: claude+codex (both)
- Dimension: D7 | Owner-surface: workflow | Seed: A (instance 1)
- Location: `agents/manager.md:74-81`; `orchestration/SKILL.md:114-161`; `agent-teams.md:113-139`
- Observed: only 2 incidental task-primitive refs (manager delegation tracking + a hook-event name); neither a user-facing live todo. Status Display is step-level, not a per-task checklist.
- Proposed remediation: add a live session task-list contract — manager maintains a user-visible task surface mirroring the Plan's tasks, updated per transition, each item linked to its state.json entry, with gate-open/close rules.
- Disposition: open

#### D7-R3: Status display omits the active-artifact path
- Severity: Medium | Confidence: 100 | Priority: medium | System: claude+codex (both)
- Dimension: D7 | Owner-surface: workflow
- Location: `orchestration/SKILL.md:114-161`; `chat-mode.md:463-560`; `record/record-map.md:35-48`
- Observed: display shows phase/state/iter/verdict + a prose Active line, never the file being written/reviewed (draft-iter, eval file, staging, output).
- Proposed remediation: add an "Artifact" field projecting the current working/eval/staging/output path; "—" only when none.
- Disposition: open

#### D7-R4: Status display omits per-agent activity
- Severity: Medium | Confidence: 100 | Priority: medium | System: claude+codex (both)
- Dimension: D7 | Owner-surface: workflow
- Location: `orchestration/SKILL.md:114-161,304-386` (agents[] is token telemetry); `agent-teams.md:113-148`
- Observed: agents[] records identity/routing/tokens post-hoc; the display has no row for which leader/executor/evaluator/Codex job is active now. Hidden during parallel evaluators / background Codex.
- Proposed remediation: add a per-agent activity projection to the live display (active agents, owning phase/task, terminal status), sourced from the same state/session model.
- Disposition: open

#### D7-R5: Auto-mode Execution has no per-task cursor in state.json (queued-work root cause)
- Severity: Medium | Confidence: 75 | Priority: medium | System: claude (root cause); codex (queued-work symptom)
- Dimension: D7 | Owner-surface: workflow
- Location: `orchestration/templates/state.template.json` (workflow.execution single object); `orchestration/SKILL.md:246,352` (chat.tasks[] exists, Auto has none)
- Observed: state.json workflow.execution is one object; Chat has workflow.chat.tasks[] but Auto has no per-task cursor. Per-task records live in session.json (telemetry), not live state.json. User can't see task N-of-M.
- Proposed remediation: add an Auto per-task tasks[] cursor (taskNo/slug/state) to state.json workflow.execution. PARENT fix that R2/R3/R4 derive from.
- Disposition: open

#### D7-R6: No user-visible progress during long-running ops
- Severity: Medium | Confidence: 75 | Priority: medium | System: claude+codex (both)
- Dimension: D7 | Owner-surface: skill
- Location: `orchestration/SKILL.md:152-158` (renders at boundaries only); `codex/SKILL.md:281-315,442` (lazy background notifications)
- Observed: status renders only at loop boundaries; a multi-minute background codex exec is silent to the user; background notifications are lazy (batched on the manager's next tool call).
- Proposed remediation: add a long-op progress rule (announce start, watched file/path, expected cap, transition updates until DONE/BLOCKED), tied to the background-codex pattern.
- Disposition: open

#### D7-R7: Runtime task-tracker parity is only named, not specified
- Severity: Medium | Confidence: 100 | Priority: medium | System: claude+codex (both)
- Dimension: D7 | Owner-surface: workflow
- Location: `agents/manager.md:74-81` ("plan updates in Codex"); `orchestration/SKILL.md:13-22` (primitive map has no live-task row); `codex/SKILL.md:18-31`
- Observed: "plan updates in Codex" is defined nowhere (item shape, call timing, state.json mapping); the Runtime primitive map has no live-task/status row. Live-UX surface not portable to Codex.
- Proposed remediation: define a runtime-neutral live-progress model, map it to Claude task primitives + Codex plan-update, add a "Live task/status surface" row to the primitive map (or mark Codex side explicitly deferred with the markdown status display as fallback).
- Disposition: open

#### D7-R8: activeNote orphaned; Active line not state-backed (source-of-truth drift)
- Severity: Medium | Confidence: 100 | Priority: medium | System: claude+codex (both)
- Dimension: D7 | Owner-surface: workflow
- Location: `orchestration/SKILL.md:116,149,159` (projection claim + Active line); `orchestration/templates/state.template.json:13` (activeNote)
- Observed: display declared "a projection of state.json", but the Active line maps to no state field (manager prose); template's activeNote is referenced by no skill (orphaned). The most user-relevant line can drift.
- Proposed remediation: either make activeNote the canonical source for the Active line with defined update points (subagent spawn/return, decision wait, blocker, artifact transition), or drop the projection claim for that line and remove/wire the orphaned field.
- Disposition: open

### D1 — E2E lifecycle + memory staleness (32: post-verification Critical 2 / High 5 / Medium 18 / Low 7)

Six independent reviewers (Claude + Codex across sub-chunks D1-A, D1-B, S5) produced 45 raw findings, reconciled by pessimistic union into 32 stable-ID findings. Raw IDs (`D1A-*`, `D1B-*`, `S5-*`) are provenance refs, system-prefixed.

#### D1-001: No always-on staleness DETECT scan — durable records drift from code undetected (S5 CENTERPIECE)
- Severity: Critical | Confidence: 100 | Priority: critical | System: both
- Dimension: D1.8 / S5a | Owner-surface: workflow / memory
- Location: `skills/gobbi/SKILL.md` (session-start memory check) · `skills/wrap-up/SKILL.md` (EVALUATION green-check L468-479)
- Observed: session-start runs only a sparse-PRESENCE check (README/`design/`/`features/` empty → offer interview), never a freshness check; the only stale-live review lives inside dormant Stage-2c compaction. No pass re-extracts current facts from code and compares.
- Description: the user-flagged centerpiece gap (charter D1.8 = Critical class). The CLASS lets false durable state persist and mislead a future session. Witnessed: `backlogs/process/layer2-references-stale-after-system-dropped.md` is `open` and asserts three files still document Layer-2 — all three carry 0 Layer-2 mentions (replaced by PR#319).
- Proposed remediation: treat as a gap; the directional fix is the SUGGESTED re-sync pass (see `## S5 memory-staleness appendix`) — NOT a build mandate.
- Provenance: claude:S5-001, codex:S5-001
- Divergence: severity — claude rated High, codex rated Critical (folded "no freshness signal" into one Critical). Reconciled to the HIGHER (Critical). Codex's S5-001 also covers the freshness-metadata half (D1-021).
- Disposition: open

#### D1-002: Sampled live memory contains concrete stale active guidance (staleness is real, not theoretical)
- Severity: Critical | Confidence: 100 | Priority: critical | System: both
- Dimension: D1.8 / S5a | Owner-surface: memory
- Location: codex witnesses — `features/workflow/decisions/workflow/2026-06-08-session-tree-spec-doc.md`, `features/workflow/design/workflow/session-memory-tree.md`, `features/memory/design/memory/memory-namespace-schema.md`, `features/coding/design/memory/review-md-procedure.md`; shared witness — `backlogs/process/layer2-references-stale-after-system-dropped.md`
- Observed: multiple sampled `active` records contradict the current codebase: cite absent paths (`orchestration/templates/session-tree.md`, `skills/memorization/SKILL.md`, `verify-session-tree.sh`) where the live machinery is `record/record-map.md` + `record/scripts/verify-record-map.sh`; describe the retired catch-all area, effective-vocabulary, and two-table tag-area vocab model; list a `rejected` disposition value the live evaluation vocab does not define.
- Description: the sample proves the staleness CLASS produces live, authoritative-looking records that mislead. Codex sample: 21 records, 6 stale; Claude sample: ~17 records, 6 stale (overlap: the Layer-2 backlog).
- Proposed remediation: a stale-record repair queue (Always-Ask `wrong / historical / superseded / still-true`) — directional only.
- Provenance: codex:S5-004, claude:S5-001 (sampling) + claude:S5-005 (terminal-but-live witnesses)
- Divergence: codex filed concrete stale records as a standalone Critical; claude carried the same witnesses as evidence inside S5-001/002/005. Reconciled to codex's Critical.
- Disposition: open

#### D1-003: Ideation PASS transition routes to Planning, skipping Preparation (orchestration ITER/EXIT)
- Severity: High → **Verified severity: Medium** (Execution EVALUATION CONFIRMED: `ideation.md:131` PASS row says "advance to Planning Loop" while `ideation.md:44` names Ideation→Preparation→Planning — an internal contradiction / doc-precision miss, part of the systemic Preparation-omission pattern; not a real runtime skip)
- Confidence: 100 | Priority: high (→ medium post-verify) | System: codex
- Dimension: D1.1 | Owner-surface: workflow
- Location: `skills/orchestration/workflow/ideation.md:125-136` (esp. :131) vs `skills/orchestration/workflow/preparation.md:5`, `skills/gobbi/SKILL.md:11`
- Observed: Ideation's PASS row says "advance to Planning Loop," bypassing Preparation; other docs place Preparation between Ideation and Planning.
- Proposed remediation: change Ideation's PASS handoff to Preparation; leave Planning next only after Preparation PASS or configured skip.
- Provenance: codex:D1A-003
- Divergence: single-system (codex); claude reviewed the same docs and did not flag it (neither confirmed nor contradicted). Related to D1-005.
- Disposition: open

#### D1-004: Preparation generated-skill exception conflicts with the sole-writer contract
- Severity: High → **Verified severity: Low** (Execution EVALUATION DOWNGRADED: `preparation/SKILL.md:58-62` documents the generated-skill pre-Planning promotion as a NARROW, USER-APPROVED, sanctioned exception, manager-owned — not an unresolved conflict; Codex over-rated. Residual = a cross-reference gap: not all sole-writer statements name this second exception)
- Confidence: 100 | Priority: high (→ low post-verify) | System: codex
- Dimension: D1.1 / lifecycle | Owner-surface: workflow
- Location: `skills/orchestration/workflow/preparation.md:64-72,89-104` vs `skills/gobbi/SKILL.md:120-121,235-237`, `skills/orchestration/workflow/record.md:214-225`
- Observed: Preparation says generated skills are copied to `.gobbi/projects/{name}/skills/{slug}/SKILL.md` before Planning (a real commit), but the glossary/core-principle name Wrap-up RECORD as the sole memory writer, and RECORD validation treats a non-Wrap-up memory write as a stop-the-line boundary violation.
- Proposed remediation: document the named Preparation exception everywhere the sole-writer rule is stated (and add validation), OR keep generated skills staged and define how Planning consumes them without promotion.
- Provenance: codex:D1A-004
- Divergence: single-system (codex). Claude D1-A touched Preparation outputs from the no-consumer angle only (D1-012).
- Disposition: open

#### D1-005: Ideation→Preparation handoff documentation is unclear (memory-reads register / consumer naming)
- Severity: High | Confidence: 100 | Priority: high | System: both
- Dimension: D1.1 | Owner-surface: skill (ideation / preparation)
- Location: `skills/ideation/SKILL.md:50-52,429,443-497` · `skills/preparation/SKILL.md:96,121-146`
- Observed: (codex) Preparation Sub-step A reads a `memory-reads register` from `1-ideation/outputs/`, but Ideation's RECORD/Output-paths document no `memory-reads` artifact there. (claude) Ideation calls its `outputs/` "the Planning Loop's input/briefing source" in 3 places, never naming Preparation — the loop that actually reads `1-ideation/outputs/` first.
- Description: cross-chunk edge #2. The two systems disagree on severity of the SAME doc-handoff: codex reads it as a schema break (named output that does not exist); claude traced the full chain and found NO broken handoff (Planning also consumes `1-ideation/outputs/`; the input is available; it is a doc-naming staleness, likely written before Preparation was inserted).
- Proposed remediation: reconcile the artifact name across the transition — make Ideation produce a documented `1-ideation/outputs/memory-reads.md`, or change Preparation to consume the Decisions-Log entry; AND reword Ideation to name Preparation as the immediate consumer.
- Provenance: claude:D1B-001, codex:D1B-001
- Divergence: severity — claude Low (doc-naming nit, no broken handoff) vs codex High (schema break). Reconciled to the HIGHER (High). The divergence is the signal: a literal-following agent hits codex's failure; a chain-tracing agent finds claude's "input still available." Edge #2.
- Disposition: open

#### D1-006: CLAUDE.md links a `claude` doc-authoring skill that does not exist (uncaveated dangling reference)
- Severity: High | Confidence: 100 | Priority: high | System: both
- Dimension: D1.2 | Owner-surface: docs (always-loaded rules doc) / skill
- Location: `.claude/CLAUDE.md:61` (the dangling link) vs `skills/gobbi/SKILL.md:192` (the caveated twin)
- Observed: `CLAUDE.md:61` presents a "claude skill" navigation row whose target is `skills/claude/SKILL.md` (link text "claude skill") as a live navigable doc with NO caveat; no `claude` skill dir exists. `gobbi/SKILL.md:192` honestly flags the same target as `[FLAG-2] currently absent` (a PASS).
- Description: a fresh manager following CLAUDE.md's "Navigate deeper" table to learn the `.claude/` authoring standard hits a non-resolving path. Both systems confirmed absence three+ ways (`test -d/-e` × 3 + `find -L` → only `claude-plugin`, a different skill).
- Proposed remediation: repoint `CLAUDE.md:61` to the real home of the `.claude/` authoring standard, OR remove the row, OR add the same `[absent]` caveat; resolve the FLAG-2 follow-up so the two docs agree.
- Provenance: claude:D1A-001, codex:D1A-001
- Divergence: none — both High, conf 100, fully convergent.
- Disposition: open

#### D1-007: Workflow docs link `delegation/SKILL.md` one directory too shallow
- Severity: High → **Verified severity: Medium** (Execution EVALUATION CONFIRMED: `workflow/wrap-up.md:17` + `workflow/execution.md:17` link `../delegation/SKILL.md` → non-existent `skills/orchestration/delegation/`; the other workflow docs correctly use `../../delegation/SKILL.md`. Two genuinely broken cross-refs Claude's reviewer passed — dual-system catch validated; Medium because non-fatal navigation)
- Confidence: 100 | Priority: high (→ medium post-verify) | System: codex
- Dimension: D1.2 | Owner-surface: workflow
- Location: `skills/orchestration/workflow/execution.md:17` · `skills/orchestration/workflow/wrap-up.md:17`
- Observed: both docs link `../delegation/SKILL.md`, which resolves to `skills/orchestration/delegation/SKILL.md` (missing); the real skill is `skills/delegation/SKILL.md`, reachable as `../../delegation/SKILL.md`.
- Proposed remediation: repoint both links to `../../delegation/SKILL.md`.
- Provenance: codex:D1A-002
- Divergence: single-system (codex). Claude D1-A did not catch this broken link (a genuine miss, not a contradiction). High-value codex-only catch; pessimistic union keeps it.
- Disposition: open

#### D1-008: Manager-facing `workflow/wrap-up.md` never documents the 5-stage Wrap-up pipeline ordering
- Severity: High | Confidence: 100 | Priority: high | System: both
- Dimension: D1.5 | Owner-surface: workflow
- Location: `skills/orchestration/workflow/wrap-up.md` (whole doc; leaks undefined "stage-3" at L25) vs `.claude/CLAUDE.md:13,25` (the canonical 5-stage pipeline)
- Observed: the doc frames Wrap-up as the generic 4-sub-phase loop, never enumerates the 5 stages, does not order promotion before the gate, and never states git-finalization-LAST; it even leaks "stage-3 evaluation" while defining no stages.
- Description: cross-chunk edge #1. Resolution: the authoritative loop skill is CORRECT — `wrap-up/SKILL.md:140-146` orders promotion (stage 2) before the gate (stage 3), git LAST (stage 5), matching CLAUDE.md (BOTH D1-B reviewers PASSED D1.5). So this is a manager-facing-doc COMPLETENESS gap, NOT a behavior contradiction: a manager reading only `workflow/wrap-up.md` cannot reconstruct the order.
- Proposed remediation: add a manager-facing 5-stage-order section to `workflow/wrap-up.md` (promotion-before-gate, git-LAST), or a hard pointer to the canonical pipeline; define "stage-3" where first used.
- Provenance: claude:D1A-002, codex:D1A-005
- Divergence: both High (no split). Reframed as a completeness gap; severity held at High. Edge #1.
- Disposition: open

#### D1-009: `session.template.json` omits the `iterations[]` array that RECORD prose requires
- Severity: High → **Verified severity: Medium** (Execution EVALUATION CONFIRMED: `session.template.json` has NO `iterations` key, but `execution/SKILL.md:222/231/242` + `workflow/record.md:15-16` require `workflow.execution.iterations[]` and tie crash-recovery to it. Real template/doc inconsistency; runtime jq-upsert partially mitigates → Medium. Dual-system catch validated — Claude D1-A explicitly passed D1.7)
- Confidence: 100 | Priority: high (→ medium post-verify) | System: codex
- Dimension: D1.7 | Owner-surface: workflow
- Location: `skills/orchestration/workflow/record.md:15-16,65,155-158,307` vs `skills/orchestration/templates/session.template.json:20-27`
- Observed: `record.md` requires `session.json.workflow.{loop}.iterations[]` (entries `{iter, verdict, finishedAt, evaluation_dir}`) and makes it a validation gate; `session.template.json` seeds each loop with only `startedAt/finishedAt/iter/verdict/integration` — no `iterations` array.
- Proposed remediation: add the documented `iterations: []` shape to every productive loop record in the template, OR revise the prose to the scalar `iter` model and drop the `iterations[]` validation.
- Provenance: codex:D1A-006
- Divergence: direct cross-system divergence (edge #4) — codex High; claude D1-A explicitly PASSED D1.7 (validated bare-key + integration surface, not the per-iter array). The single clearest "Codex caught what Claude passed" edge in the D1 batch.
- Disposition: open

#### D1-010: Wrap-up has no memory-CRUD co-update plan for the session's code change (PREVENT gap)
- Severity: High | Confidence: 100 | Priority: high | System: both
- Dimension: D1.8 / S5b | Owner-surface: workflow
- Location: `skills/wrap-up/SKILL.md` (WORK 5-stage pipeline, Staging→Memory routing) · `skills/principles/SKILL.md` P6/P9 · `skills/memory/rules.md` §4 / §1.5
- Observed: Wrap-up WORK promotes *new* staging → memory; no step diffs the session's code change against existing memory to list docs to revise. Prevention rests entirely on Principle 6/9 behavior, with no procedural enumeration and no gate.
- Description: the root PREVENT gap that CREATES the records D1-001 must later detect. Each code change that silently invalidates an existing `design/`/`decisions/`/`rules/` doc adds to the stale backlog because nothing forces the co-update when the change lands.
- Proposed remediation: a Wrap-up "memory co-touch" step enumerating existing memory docs referencing the changed code surfaces, surfaced for revise-or-supersede (Always-Ask) — directional, pairs with the SUGGESTED re-sync.
- Provenance: claude:S5-007, codex:S5-002
- Divergence: none — both High, conf 100, convergent.
- Disposition: open

#### D1-011: The only staleness-review mechanism (Stage-2c pre-step) is doubly-gated — dormant AND over-cap-only
- Severity: High | Confidence: 100 | Priority: high | System: both
- Dimension: D1.8 / S5b | Owner-surface: workflow
- Location: `skills/wrap-up/SKILL.md` Stage-2c (b) (L385) + settings gate (L378) · `skills/memory/memory-vocabulary.json` `compaction`
- Observed: the SOLE staleness-review step (Stage-2c (b) "Always-Ask staleness review") is reachable only when BOTH hold: (1) `settings.compaction.enabled == true` (ships `false`, dormant), AND (2) the `{type}/{area}/` area is over softCap (12). In default config it NEVER runs; under-cap areas are never reviewed even with compaction on (sampled live counts: decisions 3, references 4, learnings 9 — all under cap).
- Proposed remediation: decouple staleness review from compaction (run independent of over-cap and of `compaction.enabled`), or fold into the SUGGESTED always-on re-sync; keep Always-Ask for `mistakes`/`rules` — directional.
- Provenance: claude:S5-008, codex:S5-003
- Divergence: none — both High, conf 100, convergent.
- Disposition: open

#### D1-012: Preparation's readiness `outputs/` has no documented consumer in the next loop's inputs
- Severity: Medium | Confidence: 75 | Priority: medium | System: claude
- Dimension: D1.1 | Owner-surface: workflow
- Location: `skills/orchestration/workflow/preparation.md:12,132` (produces `2-preparation/outputs/preparation.md`) vs `skills/orchestration/workflow/planning.md:28,43` (Planning Sub-step A reads `1-ideation/outputs/`, never `2-preparation/outputs/`)
- Observed: Preparation RECORD synthesizes a canonical readiness doc into `2-preparation/outputs/`, but no Planning input reads it; Preparation's real downstream effect is its side effects (promoted generated skills + closed/deferred gaps).
- Proposed remediation: add Planning Sub-step A reading of `2-preparation/outputs/`, OR state in the docs that `2-preparation/outputs/preparation.md` is a record whose actionable effect reaches Planning via promoted skills + closed gaps.
- Provenance: claude:D1A-007
- Divergence: single-system (claude). Distinct from D1-004 (sole-writer conflict) — same loop, different concern (consumer vs write-route).
- Disposition: open

#### D1-013: Preparation (and Planning) sub-step counts drift across docs
- Severity: Medium | Confidence: 100 | Priority: medium | System: both
- Dimension: D1.3 | Owner-surface: workflow
- Location: `skills/orchestration/workflow/preparation.md:32-41` (says "five", lists A-D = four) · `skills/orchestration/workflow/planning.md:37-46` (lists A-D = four) · `skills/gobbi/SKILL.md:167-169` (Preparation = four named checks; Planning = "Sub-steps A-E" incl. self-review)
- Observed: Preparation says five sub-steps but lists four (A-D); `gobbi/SKILL.md` summarizes Preparation as four. Planning's workflow table lists four (A-D) while `gobbi/SKILL.md` advertises Planning "A-E" including self-review.
- Description: cross-chunk edge #3. Part of the recurring "Preparation dropped/miscounted in enumerations" pattern.
- Proposed remediation: make counts/tables match the canonical loop SKILLs — fix `preparation.md:34` "five"→"four" (or add the 5th row if real); reconcile Planning A-E. Confirm against `preparation/SKILL.md` + `planning/SKILL.md`.
- Provenance: claude:D1A-004, codex:D1A-010
- Divergence: severity — claude Low (Preparation-only typo), codex Medium (adds the Planning A-E drift). Reconciled to the HIGHER (Medium).
- Disposition: open

#### D1-014: Leader-loop DISCUSSION ownership is contradictory (manager-direct boilerplate vs Leader-assigned steps)
- Severity: Medium | Confidence: 100 | Priority: medium | System: codex
- Dimension: D1.3 | Owner-surface: skill (ideation / preparation / planning)
- Location: `skills/ideation/SKILL.md:60,118-129` · `skills/preparation/SKILL.md:13,86,133-140` · `skills/planning/SKILL.md:18,89,155-163`
- Observed: Ideation, Preparation, and Planning each carry manager-direct DISCUSSION boilerplate ("subagents do not run DISCUSSION") while the same skills assign DISCUSSION work to the Leader (and Preparation/Planning top-matter says "Leader spans DISCUSSION and WORK").
- Proposed remediation: pick one DISCUSSION ownership model for the Leader-led loops; make boilerplate, phase table, and procedure agree.
- Provenance: codex:D1B-002
- Divergence: single-system (codex). Claude D1-B passed D1.3 sub-phase coverage (confirmed all 4 sub-phases owned, did not test for the boilerplate-vs-procedure contradiction).
- Disposition: open

#### D1-015: Evaluation fire-point enumeration drops Preparation (and Wrap-up in CLAUDE.md)
- Severity: Medium | Confidence: 100 | Priority: medium | System: both
- Dimension: D1.4 | Owner-surface: docs / workflow
- Location: `.claude/CLAUDE.md:31` · `skills/orchestration/workflow/evaluation.md:3` vs canonical `skills/gobbi/SKILL.md:141`, `skills/orchestration/workflow/production.md:3`, `settings.{auto,chat}.json`
- Observed: `CLAUDE.md:31` says eval runs in "Ideation, Planning, and Execution — mandatory after Execution" (omits Preparation AND Wrap-up, and the mandatory-after-Wrap-up clause); `evaluation.md:3` lists "(Ideation, Planning, Execution, Wrap-up)" (omits Preparation). Canonical: `gobbi/SKILL.md:141` = mandatory after Execution + Wrap-up, optional after Ideation/Preparation/Planning.
- Description: CLAUDE.md is always-loaded, so its claim is the one a manager internalizes; the highest-risk reading ("mandatory after Execution", Wrap-up absent) could lead a manager to treat the Wrap-up eval gate as skippable.
- Proposed remediation: update `CLAUDE.md:31` to enumerate all five productive loops with the correct mandatory/optional split (match `gobbi/SKILL.md:141`); add Preparation to `evaluation.md:3`'s parenthetical.
- Provenance: claude:D1A-003, codex:D1A-009
- Divergence: both Medium. Scope union — claude flagged CLAUDE.md AND evaluation.md (and the missing Wrap-up); codex flagged evaluation.md. Merged to the broader claude scope. Part of the Preparation-omission pattern.
- Disposition: open

#### D1-016: EVALUATION-side dual-system lacks a degraded-mode / absent-Codex stamp (WORK side has one)
- Severity: Medium | Confidence: 100 | Priority: medium | System: codex
- Dimension: D1.4 | Owner-surface: skill (all 5 loops)
- Location: WORK degraded stamp present at `ideation/SKILL.md:358-365`, `preparation/SKILL.md:298-305`, `planning/SKILL.md:365-372`, `execution/SKILL.md:151-158`, `wrap-up/SKILL.md:279-286`; EVALUATION sections (`ideation:371-392`, `preparation:309-332`, `planning:376-398`, `execution:162-184`, `wrap-up:440-466`) name only "one evaluator per system" with no absent-Codex field.
- Observed: the WORK side has auditable degraded-mode metadata (`production_mode: claude-only` + `codex_proposal_absent_reason`); the EVALUATION side defines no `codex_evaluator_absent_reason` / `evaluation_mode` / hard-fail field.
- Proposed remediation: add one loop-side rule for missing Codex evaluation (hard-fail with a required record field, or a degraded-evaluation stamp with a reason field) — or a pointer to the central `evaluation.md` policy.
- Provenance: codex:D1B-003
- Divergence: single-system (codex). Claude D1-A noted the CENTRAL `evaluation.md:208-221` degraded-policy as a PASS; codex flags the PER-LOOP SKILL gap. Not contradictory — the central policy lowers practical risk.
- Disposition: open

#### D1-017: Wrap-up Stage-2 name diverges (CLAUDE.md "promotion" vs wrap-up "Memorization"); Glossary holds no stage names
- Severity: Medium | Confidence: 75 | Priority: medium | System: claude
- Dimension: D1.5 | Owner-surface: workflow / docs
- Location: `skills/wrap-up/SKILL.md:140-146,154` (stage-2 = "Memorization") · `.claude/CLAUDE.md:13,25` ("the promotion stage (stage 2)" + "the Glossary holds the canonical name for each stage") · `skills/gobbi/SKILL.md:112-125` (Glossary — no stage rows)
- Observed: CLAUDE.md names stage 2 "promotion"; wrap-up names it "Memorization". CLAUDE.md asserts twice that canonical stage names live in the Glossary, but the Glossary table contains NO stage rows.
- Proposed remediation: add the 5 stage names to the Glossary; pick ONE term for stage 2 (recommend "memorization") and make CLAUDE.md use it.
- Provenance: claude:D1B-002
- Divergence: single-system (claude). Codex flagged the ordering (D1-008) but not the naming/Glossary gap.
- Disposition: open

#### D1-018: Iteration-cap escalation documentation is inconsistent and incomplete
- Severity: Medium | Confidence: 100 | Priority: medium | System: codex
- Dimension: D1.6 | Owner-surface: workflow / skill
- Location: (a) mode-split contradiction — `skills/orchestration/workflow/evaluation.md:275-280` vs `ideation.md:136`, `preparation.md:120`, `planning.md:115`; (b) caps not named in loop bodies — `skills/{ideation,preparation,planning,execution,wrap-up}/SKILL.md` EVALUATION sections (`execution/SKILL.md:18` defers cap to orchestration; `wrap-up` says REVISE "typically 1")
- Observed: (a) `evaluation.md` makes cap exhaustion mode-specific (Chat escalates; Auto records the abort and surfaces later unless unsafe), while ideation/preparation/planning each say the manager "forces user escalation" unconditionally — erasing Auto's non-interrupt contract. (b) The loop SKILL bodies describe REVISE/FAIL flow but do not consistently name a concrete cap, default, or setting key.
- Proposed remediation: normalize per-loop cap language to point to the central mode-specific rule (keep only loop-specific unsafe-to-proceed examples local); add a short "iteration cap and escalation" pointer to each loop skill.
- Provenance: codex:D1A-007, codex:D1B-004
- Divergence: single-system (codex), confidence union (D1A-007 conf 100, D1B-004 conf 75). Claude passed D1.6 routing as a "uniform separation"; codex saw an under-specified loop body. Reconciled to Medium.
- Disposition: open

#### D1-019: Canonical record map defines `{session-id}` as Claude-only (not runtime-neutral for Codex)
- Severity: Medium | Confidence: 100 | Priority: medium | System: codex
- Dimension: D1.7 | Owner-surface: workflow
- Location: `skills/record/record-map.md:86-89` vs `skills/gobbi/SKILL.md:34-39,55-62`, `skills/orchestration/workflow/evaluation.md:313-315`
- Observed: `record-map.md` defines `{session-id}` as the parent session's Claude Code UUID; other runtime docs say native Codex uses `CODEX_THREAD_ID`.
- Proposed remediation: generalize `{session-id}` in `record-map.md` to "parent runtime session id" with Claude/Codex examples.
- Provenance: codex:D1A-008
- Divergence: single-system (codex). Claude passed D1.7 SEAM-3 (bare keys) but did not test `{session-id}` runtime-neutrality.
- Disposition: open

#### D1-020: `claude-plugin` skill underdocuments the Codex install path (install command + project-trust + cache-mismatch)
- Severity: Medium | Confidence: 75 | Priority: medium | System: both
- Dimension: D1 scenario S1 / S6 | Owner-surface: plugin / docs
- Location: `skills/claude-plugin/SKILL.md:144-164,202-219,235-250` · `plugins/gobbi/.codex-plugin/plugin.json` · `scripts/check-codex-plugin-smoke.sh`
- Observed: three Codex-path gaps in one skill: (a) no Codex install command (only the `claude plugin marketplace add/install/update` flow); (b) no statement that a Codex install needs project-trust before config/hooks/rules load (the S1 golden-path gate); (c) no "source package stays symlinked; installed-cache omissions are a Codex install limitation" decision tied to the smoke script. S1 manifest-correctness itself PASSED on both systems (metadata-only Claude manifest; Codex manifest declares skills+hooks; symlinks resolve to 22 skills).
- Proposed remediation: add a Codex install/cache subsection to the plugin skill — install flow, project-trust prerequisite, a pointer to `check-codex-plugin-smoke.sh`, and the expected decision for installed-cache symlink omissions; cross-link `codex/SKILL.md`.
- Provenance: claude:D1B-003, claude:D1B-004, codex:D1B-005
- Divergence: confidence — claude held 50 pending the `codex/SKILL.md` read; codex held 75. Convergent sub-gap: the Codex install command (both); project-trust claude-only; cache-interpretation codex-only. Reconciled to Medium.
- Disposition: open

#### D1-021: No freshness metadata + no "still-true-as-of" marker on memory records
- Severity: Medium | Confidence: 100 | Priority: medium | System: both
- Dimension: D1.8 / S5a | Owner-surface: memory
- Location: `skills/memory/rules.md` §2.1 (base frontmatter) + §4 (dev-doc standard)
- Observed: base frontmatter carries `created` + `session` only; no `last-verified` / `still-true-as-of`, and §4 requires none. Only `references` has `accessed`, never re-evaluated. A stale-but-`active` record looks identical to a fresh one.
- Description: without freshness metadata there is nothing for a DETECT scan (D1-001) to compare against, and no human signal that an `active` record may have drifted.
- Proposed remediation: an optional `last-verified: YYYY-MM-DD` base field stamped on re-confirmation, surfaced by the SUGGESTED re-sync (evergreen types only; `notes/` keep journal voice) — directional.
- Provenance: claude:S5-002, codex:S5-001
- Divergence: codex folded this into its Critical S5-001 (freshness-signal half); claude filed it standalone at Medium. Reconciled to Medium for the metadata gap on its own.
- Disposition: open

#### D1-022: supersedes/superseded_by has no runnable resolvability/bidirectionality guard (outside compaction)
- Severity: Medium | Confidence: 100 | Priority: medium | System: claude
- Dimension: D1.8 / S5a | Owner-surface: memory
- Location: `skills/memory/scripts/validate-frontmatter.sh:520-548` · `skills/orchestration/scripts/check-merge-ref-integrity.sh` (Family 2, Stage-2c-only)
- Observed: `validate-frontmatter.sh` checks only VALUE-SHAPE (plain-slug, scalar-vs-list, null-ok) — not that `superseded_by: X` resolves to a real file nor that `X` names it back. The only bidirectional check is `check-merge-ref-integrity.sh` Family 2, which runs solely against a Stage-2c merge manifest (dormant).
- Proposed remediation: extend `validate-frontmatter.sh` (or a companion) to resolve every supersedes/superseded_by slug to a live-or-archived file and assert the reciprocal, run in the always-on green-check — directional.
- Provenance: claude:S5-004
- Divergence: single-system (claude). Distinct from codex's D1-025 (invocation/scan-surface).
- Disposition: open

#### D1-023: Move-on-terminal is documented but unenforced — terminal records accumulate in the live scan surface
- Severity: Medium | Confidence: 100 | Priority: medium | System: claude
- Dimension: D1.8 / S5a | Owner-surface: memory
- Location: `skills/memory/templates/archive.md` (When to move) · `skills/wrap-up/SKILL.md` (WORK Step 5 move-on-terminal) · live `backlogs/`
- Observed: the move fires only on a promotion collision in the same session that terminates the record; a backlog that closes in a LATER session is never moved. 4 of 4 sampled closed backlogs are still live; `archive/` holds 0 backlogs. No guard scans for terminal-but-live records.
- Proposed remediation: a Wrap-up (or session-start advisory) sweep flags any live record with a terminal `status:` and offers the move-on-terminal `git mv` (Always-Ask, no-delete) — directional.
- Provenance: claude:S5-005
- Divergence: single-system as a standalone finding (claude). Codex's D1-002 included closed/terminal stale records as evidence but did not file the move-on-terminal-unenforced framing.
- Disposition: open

#### D1-024: Standing memory-validation guards are syntactic only — no semantic code-vs-record check
- Severity: Medium | Confidence: 100 | Priority: medium | System: claude
- Dimension: D1.8 / S5a | Owner-surface: workflow
- Location: `skills/wrap-up/SKILL.md` EVALUATION green-check (L468-479)
- Observed: the green-check (`validate-frontmatter` + `check-markdown-links` + `check-residual-vocab` + `check-skill-mistakes` + `check-workflow-mirror-consistency`) is strong but entirely SYNTACTIC. None reads a record's PROSE to ask whether the file/symbol/count it describes still exists.
- Description: why the Layer-2 open backlog (D1-001) and the namespace note (D1-021) pass every gate while stale — their breakage is semantic, not a broken link or bad token.
- Proposed remediation: the SUGGESTED re-sync pass is the natural home for the semantic check; the green-check could host it as an advisory (non-gating) step — directional.
- Provenance: claude:S5-006
- Divergence: single-system (claude). Distinct from codex's D1-025 (guard commands don't run as documented). Both kept.
- Disposition: open

#### D1-025: Guard invocation + scan-surface drift weaken staleness validation
- Severity: Medium | Confidence: 100 | Priority: medium | System: codex
- Dimension: D1.8 / S5a | Owner-surface: skill / tooling
- Location: `skills/wrap-up/SKILL.md:468-479` · `skills/memory/scripts/validate-frontmatter.sh:49-58,92-100` · `skills/orchestration/scripts/check-markdown-links.sh:51-58` · `skills/orchestration/scripts/check-residual-vocab.sh:80-85`
- Observed: Wrap-up documents `validate-frontmatter.sh <scan-root>`, but the script's own usage rejects a directory root — a `.gobbi/projects/gobbi` run produced "skipping non-.md arg" + usage failure, while no-args validated the live tree (281 files). Separately, the local-link guard walks every `*.md` with no pruning, so a project-root run includes `worktrees/` copies (duplicated broken-link hits).
- Proposed remediation: align Wrap-up guard commands with the scripts' actual interfaces; define one canonical live-memory scan root that prunes `archive/`, `sessions/`, `skills/`, `agents/`, `tmp/`, `worktrees/` consistently — directional.
- Provenance: codex:S5-006
- Divergence: single-system (codex). Claude's D1-024 judged the guards "strong" syntactically; codex found the documented INVOCATION itself drifts. Complementary, both kept.
- Disposition: open

#### D1-026: External `source:` URLs in `references/` have no link-rot check
- Severity: Medium | Confidence: 100 | Priority: medium | System: both
- Dimension: D1.8 / S5a | Owner-surface: memory / docs
- Location: `skills/orchestration/scripts/check-markdown-links.sh` (header L13-14; L95-98) · `skills/memory/templates/references.md:43-59` · `references/memory/*.md` (`source:` lines)
- Observed: `check-markdown-links.sh` explicitly IGNORES `http(s)://` / `mailto:` — it validates only relative markdown paths. Sampled `source:` URLs (e.g. `https://buildermethods.com/agent-os/v2`) are never tested; the recorded `accessed` date is never re-checked.
- Proposed remediation: an opt-in, advisory liveness probe (HEAD request) over `references/` `source:` URLs, re-stamping `accessed` or flagging rot; never a hard gate (offline/sandbox would false-fail) — directional.
- Provenance: claude:S5-003, codex:S5-005
- Divergence: severity — claude Low, codex Medium. Reconciled to the HIGHER (Medium).
- Disposition: open

#### D1-027: REPAIR machinery is detection-gated — no always-on path / general stale-record repair taxonomy
- Severity: Medium | Confidence: 75 | Priority: medium | System: both
- Dimension: D1.8 / S5c | Owner-surface: workflow
- Location: `skills/wrap-up/SKILL.md` (Stage-2c b; collision/supersession policy) · `skills/mistake/SKILL.md` (supersede→archive) · `skills/memory/templates/archive.md`, `templates/backlogs.md`
- Observed: every REPAIR primitive EXISTS and is well-documented (supersede→archive, repoint inbound refs, false-guard-positive allowlist-in-same-commit, no-delete). But repair is only TRIGGERED by (a) a same-session promotion collision, or (b) the dormant/over-cap Stage-2c (b) review. There is no cross-type "repair card" that classifies an arbitrary stale live record as wrong/historical/superseded/still-true.
- Proposed remediation: give REPAIR a standing entry point by feeding the SUGGESTED re-sync's flagged records into the existing Always-Ask supersede→archive path (no new mechanism — only a trigger + a 4-way decision card) — directional.
- Provenance: claude:S5-009, codex:S5-007
- Divergence: none material — both Medium, conf 75 (composition/coverage judgment).
- Disposition: open

#### D1-028: Wrap-up lists a phantom bare `4-execution/staging/` promotion source that Execution never writes
- Severity: Low | Confidence: 75 | Priority: low | System: claude
- Dimension: D1.1 / scenario S4 | Owner-surface: skill (wrap-up)
- Location: `skills/wrap-up/SKILL.md:75,159` (enumerate `4-execution/staging/`) vs `skills/execution/SKILL.md:31,274` (Execution writes only `4-execution/task-{NN}-{slug}/staging/`)
- Observed: Wrap-up names a bare top-level `4-execution/staging/`; Execution only ever writes per-task `4-execution/task-{NN}-{slug}/staging/`. The operational Step-2 "recursively list staging/" captures the per-task dirs (promotion not lost), but the bare bullet read literally is a dir that never exists, and Step 2.5's `directory-absent` rule could trigger a spurious `NEEDS_CONTEXT`.
- Proposed remediation: change the bullet to `4-execution/task-{NN}-{slug}/staging/` or `4-execution/**/staging/` (per-task, recursive); drop the bare top-level form.
- Provenance: claude:D1B-005
- Divergence: single-system (claude). Pessimistic union keeps it.
- Disposition: open

#### D1-029: Planning RECORD says outputs "should include" a `dependencies` artifact but only mandates task-list + memory-reads
- Severity: Low | Confidence: 75 | Priority: low | System: claude
- Dimension: D1.1 (internal consistency) | Owner-surface: skill (planning)
- Location: `skills/planning/SKILL.md:435` (RECORD note: "should include … `artifact_type: dependencies`") vs PASS exit checklist `:459-460` + Output-paths mandate `:493` (only `≥1 task-list`, `≥1 memory-reads`)
- Observed: the RECORD note lists three "should include" artifacts; the checklist and Output-paths mandate only two — `dependencies` is "should", not "must". No broken handoff (Execution consumes the mandatory task-list); the defect is an intra-Planning "should vs must" mismatch.
- Proposed remediation: either add `≥1 artifact_type: dependencies` to the PASS checklist + Output-paths mandate, or soften the RECORD note to "optionally a `dependencies` artifact".
- Provenance: claude:D1B-006
- Divergence: single-system (claude). Pessimistic union keeps it.
- Disposition: open

#### D1-030: Glossary fixes "4 sub-phases" but the state machine surfaces ITER/EXIT as a 5th phase value
- Severity: Low | Confidence: 75 | Priority: low | System: claude
- Dimension: D1.3 | Owner-surface: docs / workflow
- Location: `skills/gobbi/SKILL.md:115-116` (Loop = 4 sub-phases) vs `skills/orchestration/SKILL.md:138,245,251-257` (status phase + `state.json.phase` include `ITER/EXIT`; 5-row Loop-states table)
- Observed: the Glossary says exactly 4 sub-phases and never lists ITER/EXIT; the state machine renders `▸ ITER/EXIT` as a phase value the same way as the 4 sub-phases and `state.json.phase` can hold it. A terminology tension, not a behavioral break.
- Proposed remediation: add a Glossary note that ITER/EXIT is a state-machine decision transition (a 5th `state.json.phase` value), distinct from the 4 productive sub-phases.
- Provenance: claude:D1A-005
- Divergence: single-system (claude). Codex's CROSS-CHUNK index treated ITER/EXIT as a known transition without flagging a contradiction.
- Disposition: open

#### D1-031: Status-display WORK-verb enumeration omits Preparation's loop verb
- Severity: Low | Confidence: 100 | Priority: low | System: claude
- Dimension: D1.3 / D1.7 | Owner-surface: workflow (status display)
- Location: `skills/orchestration/SKILL.md:138`
- Observed: L138 — "`WORK` is replaced by the loop's verb — `IDEATION`, `PLAN_DRAFT`, `EXECUTION`, `WRAPUP`": four verbs for five loops; Preparation has no listed WORK verb. Another instance of the recurring Preparation-omission pattern.
- Proposed remediation: add Preparation's WORK verb (e.g. `PREP_CHECK` / `READINESS`) so all five productive loops have a named WORK verb.
- Provenance: claude:D1A-006
- Divergence: single-system (claude). Pessimistic union keeps it.
- Disposition: open

#### D1-032: Plugin component counts are self-reported inconsistently (22 vs 19 skills)
- Severity: Low | Confidence: 100 | Priority: low | System: codex
- Dimension: D1 scenario S1 | Owner-surface: docs / plugin
- Location: `skills/claude-plugin/SKILL.md:235-258` · `plugins/gobbi/.claude-plugin/plugin.json` · `plugins/gobbi/.codex-plugin/plugin.json`
- Observed: the skill says the package should expose 22 skills / 5 agents / 4 hook groups, then reports a prior CLI result of 19 skills / 5 agents / 3 hooks with a "re-verify" note. The package currently resolves to 22 skill dirs via symlink traversal. Ambiguity for S1 install verification.
- Proposed remediation: replace the stale empirical count with a current verified count, or move it to a clearly historical note that cannot be mistaken for the expected install result.
- Provenance: codex:D1B-006
- Divergence: codex filed it (Low, conf 100); claude OBSERVED the same tension but explicitly DEFERRED it to D4.4 (text-polish). Pessimistic union keeps it as a D1 finding, noting claude's defer.
- Disposition: open

## Cross-system divergences

The anti-groupthink signal — preserved, never averaged.

- **Severity-temperature (charter-named).** Codex ran HOTTER than Claude on D1-A: **codex 6 High / 4 Medium / 0 Low** vs **claude 2 High / 2 Medium / 3 Low**. The gap is the signal. Codex's extra Highs (D1-003, D1-004, D1-007, D1-009) are all single-system codex catches kept by pessimistic union and flagged for verification. On S5 the temperatures inverted: codex rated the DETECT centerpiece Critical (vs claude High) and filed concrete stale records as a standalone Critical (D1-002).
- **Real Codex-only catches Claude passed (validated at Execution EVALUATION):** **D1-007** (delegation link `../delegation/SKILL.md` resolves to a missing path — two genuinely broken cross-refs) and **D1-009** (`session.template.json` omits the `iterations[]` array `record.md` requires and ties crash-recovery to). Both CONFIRMED real bugs; both reconciled High→Medium (non-fatal / runtime-mitigated). These validate the dual-system method — Claude's reviewer passed both.
- **Codex over-rating corrected:** **D1-004** (generated-skill vs sole-writer) DOWNGRADED High→Low — `preparation/SKILL.md:58-62` documents the pre-Planning promotion as a narrow, user-approved, sanctioned exception; the residual is only a cross-reference gap. One over-rated High does not ship in the deliverable.
- **D1-005 broken-handoff-vs-doc-nit split (edge #2):** codex read the Ideation→Preparation `memory-reads register` as a schema break (High); claude traced the chain and found NO broken handoff — the input is still available — calling it a doc-naming staleness (Low). Reconciled High, divergence recorded: a literal-following agent meets codex's failure, a chain-tracer meets claude's "input still available."
- **Edge #1 (D1-008):** the manager-facing `workflow/wrap-up.md` cannot reconstruct the 5-stage order, but the authoritative loop skill `wrap-up/SKILL.md:140-146` IS correct (both D1-B reviewers PASSED D1.5). Reframed as a completeness gap, not a behavior break; held High.
- **Edge #4 (D1-009):** the single clearest "Codex caught what Claude passed" edge — claude D1-A explicitly PASSED D1.7 while codex found the template/prose mismatch.

**Execution EVALUATION verdict: PASS** — the review is sound; 2 real Codex-only bugs confirmed (validating dual-system), 1 over-rating corrected; no false-positive Highs ship in the deliverable.

## S5 memory-staleness appendix

S5 was the review-only centerpiece (charter Decision-5). The staleness CLASS decomposes into three phase gaps:

- **DETECT gap (D1-001, D1-002, D1-021, D1-024):** no always-on scan re-extracts current facts from code and compares them to durable records; session-start checks only sparseness, the green-check is syntactic-only, and no freshness metadata exists for a scan to compare against.
- **PREVENT gap (D1-010):** Wrap-up promotes *new* staging → memory but never diffs the session's code change against existing memory to co-update the docs the change made stale. This CREATES the records DETECT must later find.
- **REPAIR gap (D1-011, D1-023, D1-027):** every repair primitive exists (supersede→archive, repoint refs, no-delete), but the only trigger is a same-session collision or the dormant/over-cap Stage-2c review — so repair sits idle for stale records that already exist.

**Sampled-records result:** both systems sampled live memory and both found stale `active` records — **6 of ~17** (claude) and **6 of 21** (codex), overlapping on `backlogs/process/layer2-references-stale-after-system-dropped.md` (asserts three files still document Layer-2; all three carry 0 mentions post-PR#319). Staleness is real, not theoretical.

>> **SUGGESTED future direction (REVIEW-ONLY — never a deliverable of this charter).** Both S5 reviewers independently converged on an **Agent-OS-style "Discover Standards" re-sync pass** (prior art: `references/memory/agent-os-layered-standards.md`). The convergence is itself the signal that this is the right shape for the DETECT hole. The suggested pass (on-demand or session-start, advisory only): re-extracts current facts from the codebase (paths, symbols, counts, script names); flags every record whose body/frontmatter no longer matches (closes DETECT — D1-001/002); optionally stamps a `last-verified` marker (D1-021); feeds flagged records into the EXISTING Always-Ask supersede→archive path with a 4-way `wrong / historical / superseded / still-true` decision card (D1-027); is the natural home for the semantic code-vs-record check (D1-024), the terminal-but-live sweep (D1-023), and the prevent-side co-touch enumeration (D1-010); and decouples staleness review from the dormant/over-cap compaction (D1-011). It MUST stay advisory and preserve the no-delete / supersede / archive model. Recorded as a candidate for a FUTURE design session — this review is NOT obligated to build it.

## Plugin-deployment notes

- **S1 manifest-correctness PASSED on both systems.** The Claude manifest is metadata-only; the Codex manifest declares skills + hooks; symlink traversal resolves to 22 skill dirs.
- **Codex install/cache underdocumented (D1-020).** The `claude-plugin` skill omits the Codex install command, the project-trust prerequisite (the S1 golden-path gate), and the "installed-cache omissions are a Codex install limitation" decision tied to `check-codex-plugin-smoke.sh`. A Codex user cannot complete or diagnose install from the skill alone. Self-reported component counts also drift (22 vs 19 skills — D1-032).

## Live-UX real-world corroboration

This very session's in-chat task list was lost on an MCP reconnect because it is not `state.json`-backed — a live witness corroborating **D7-R6** (no progress surface for long/background ops) and **D7-R8** (the most user-relevant live line is not state-backed and can drift). The UX gaps D7 names are not hypothetical; they were felt during the review that found them.

## Deferred (next sessions)

Per the charter, five dimensions remain unrun:
- **D2** — completeness / between-skill coverage.
- **D3** — harness comparison (reference inputs already promoted at `references/memory/{superpowers,claude-flow,claude-task-master,agent-os}*.md`).
- **D4** — naming / counts (claude already pre-deferred D1-032's count tension here).
- **D5** — text-polish.
- **D6** — plugin / mirror.

## Outcome

Review-only: no source changed this session. All 40 findings are queued for a future scoped Execution session in `backlogs/evaluation/fix-d7-d1-review-findings.md` (this file is the source of record). The S5 re-sync is a SUGGESTED future design session, not a deliverable.

## Open items

All 40 dispositions are `open`. Priority head for the fix-backlog: the 2 Critical staleness items (D1-001, D1-002) + the 5 D1 post-verification High (D1-005, D1-006, D1-008, D1-010, D1-011) + the D7 High (D7-R1).

## Related

- [[fix-d7-d1-review-findings]] — the deferred fix queue sourced from this review
- [[coding-as-value-feature-taxonomy-question]] — a D2-review item raised this session
- [[d7-d1-adversarial-review-executed]] — the session journal
- [[review-handoff-next-session]] — the next-session handoff
- [[adversarial-review-charter-authored]] — the charter this session operates inside
