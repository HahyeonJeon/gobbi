---
name: gobbi-adversarial-review-d2
description: D2 completeness review (agents+skills) — 53 raw dual-system findings reconciled to 40, with global load-graph
type: reviews
scope: project
feature: null
status: active
created: 2026-06-29
session: 5ac6cf6e-aae6-4e28-85b3-e90b0a10aaaf
tags: [evaluation]
keywords: [adversarial-review, d2, merge, load-graph, dual-system]
author: claude
review_kind: adversarial-review
subject: "gobbi skills + agents surface (Dimension D2 — completeness of agents + skills)"
verdict: needs-attention
---

# D2 Adversarial Review — Completeness of Agents + Skills (consolidated merge)

## Review identity + scope

- **Dimension:** D2 — completeness of the gobbi agent + skill surface (skill internal/between-skill integrity, runtime mirrors, load graph, handoff continuity, count consistency).
- **Method:** dual-system adversarial review. Two independent systems (Claude + Codex) each reviewed the same surface in 6 budget-sized chunks (C1a, C1b, C2, C3a, C3b, C4). 12 partial-finding files total.
- **Raw input:** 53 findings (Claude 27: C1a=3, C1b=4, C2=7, C3a=3, C3b=5, C4=5; Codex 26: C1a=2, C1b=4, C2=8, C3a=4, C3b=5, C4=3).
- **This file:** the merge — pessimistic union, de-duplicated by (location + claim), stably ID'd `D2-001…D2-040`, ordered Severity (Critical→High→Medium→Low) then chunk. 40 consolidated findings; 10 cross-system-corroborated, 30 single-system (14 codex-only, 16 claude-only). Plus the global cross-chunk load-graph reconciliation that no single chunk could compute.
- **Seeds:** the 4 confirmed seeds are NOT re-filed as findings; see § Confirmed-seed siblings.

## Findings summary

| ID | Sev | System | D2.x | Owner | Location | One-line |
|---|---|---|---|---|---|---|
| D2-001 | Critical | codex | D2.5 | workflow | preparation/SKILL.md:58-62,323-332,372-395 | Preparation PASS never loads `planning/SKILL.md` (Claude: NAMED — divergence) |
| D2-002 | Critical | codex | D2.5 | workflow | planning/SKILL.md:11-20,389-412,439-462 | Planning PASS never loads `execution/SKILL.md` (Claude: NAMED — divergence) |
| D2-003 | Critical | codex | D2.5 | workflow | coding/evaluation.md:3; execution/SKILL.md:167-180 | `coding/evaluation.md`+`review.md` dead-end from Execution EVALUATION |
| D2-004 | High | codex | D2.6 | workflow | orchestration/SKILL.md:251-257 | RECORD postcondition "Memory writes complete" contradicts sole-writer boundary |
| D2-005 | High | claude+codex | D2.5 | workflow | execution/SKILL.md:9-18,175-199,227-251 | Execution final-task → Wrap-up transition unstated (codex Crit / claude Med) |
| D2-006 | High | codex | D2.6 | skill | preparation/SKILL.md:58-62,252-256,434-442; wrap-up/SKILL.md:47-51,306-312 | Generated-skill promotion owner conflicts (Preparation vs Wrap-up) |
| D2-007 | High | claude+codex | D2.6 | skill | record/SKILL.md:41,89-91,303-318; record-map.md:117-120 | `staging/` writer-set + timing self-contradicts (PASS-only vs WORK vs loop-entry) |
| D2-008 | High | codex | D2.6 | skill | record/SKILL.md:45-47,365 | Preparation omitted from the forbidden-memory-write matrix rows |
| D2-009 | High | codex | D2.6 | skill | delegation/SKILL.md:38-40; templates/evaluator.md:59-67 | Evaluator template puts `evaluation/SKILL.md` in tier-1, violating load-tier order |
| D2-010 | High | claude+codex | D2.3/D2.4/D2.8 | skill | `.claude/skills/coding/` (absent) | `.claude` mirror missing canonical `coding` skill (21 of 22) |
| D2-011 | High | codex | D2.6 | memory | memory-map.md:151-153; preparation/SKILL.md:58-62; wrap-up/SKILL.md:51,312-316 | Project `skills/` both excluded-from-memory and a memory write target |
| D2-012 | High | claude | D2.6 | skill | research/SKILL.md:22,168-169; preparation/SKILL.md:421 | research↔Preparation `staging/references/` ownership contradiction (new seed sibling) |
| D2-013 | High | claude | D2.6/D2.2 | skill | codex/SKILL.md:152,153,179,181,350 | Production foreground-vs-background self-contradicts; `timeout 1200` exceeds Bash cap |
| D2-014 | High | codex | D2.6 | skill | codex/SKILL.md:358-363; codex/mistakes.md:24-31 | Codex evaluator vocab-grep gate contradicts its own loaded mistake |
| D2-015 | High | claude | D2.3/D2.4 | skill | scripts/sync-plugin-package.sh:75-90 | `.claude/skills` mirror unmanaged by sync + unvalidated by `--check` (ROOT CAUSE) |
| D2-016 | High | codex | D2.6 | agent | agents/leader.md:39; agents/assistant.md:47 | Leader+assistant prompts deny the existing `agent-writing` skill |
| D2-017 | Medium | codex | D2.3 | docs | orchestration/SKILL.md:108,324-330 | `.claude` hook/script links wrong relative depth (4 `../` not 5) |
| D2-018 | Medium | claude | D2.7 | skill | orchestration/SKILL.md:24,37 | Leader-owns agent-type table drops Preparation |
| D2-019 | Medium | claude | D2.6 | docs | evaluation.md:3; production.md:3; gobbi/SKILL.md:141; .claude/CLAUDE.md | EVALUATION-loop-set enumerated 3 different ways across 4 docs (merge-only) |
| D2-020 | Medium | claude | D2.2 | skill | wrap-up/SKILL.md:541 | Wrap-up RECORD `evaluation_dir` drops the `5-` ordinal; resolves to nothing |
| D2-021 | Medium | claude | D2.1/D2.6 | skill | ideation/preparation/planning/execution/wrap-up SKILL.md:4 | `AskUserQuestion` granted inconsistently across 5 loop skills + to forbidden role |
| D2-022 | Medium | claude+codex | D2.3 | skill | delegation/SKILL.md:292,309 | `.claude` hook/script links wrong relative depth (4 `../` not 5) |
| D2-023 | Medium | claude+codex | D2.3 | skill | delegation/SKILL.md:408 | Cites `rules/docs-cleanup-parallelism.md` — `rules/` dir + file absent |
| D2-024 | Medium | claude+codex | D2.3 | skill | delegation/SKILL.md:292 | Cites `features/agents/backlogs/…session-json.md` — file absent |
| D2-025 | Medium | codex | D2.3 | skill | delegation/templates/executor.md:43 | Concrete example skill paths `bun`/`typescript` do not exist |
| D2-026 | Medium | claude+codex | D2.2/D2.6 | skill | record/SKILL.md:41,303-318; record-map.md:130-144 | record matrix omits Preparation `staging/skills/` (+ `plans/` from brace) |
| D2-027 | Medium | claude | D2.6/D2.7 | skill | delegation/SKILL.md:128; templates/evaluator.md:53-69 | Evaluator writes worktree session-record but is excluded from the git-skill gate |
| D2-028 | Medium | codex | D2.2 | skill | discussion/delegation/coding/principles/claude-plugin/codex/agent-writing/skill-writing SKILL.md | 8 skills omit operational-contract sections (claude: reference-skills — divergence) |
| D2-029 | Medium | claude | D2.4/D2.7 | skill | gobbi/SKILL.md §Skill Map (161-217) | `coding` absent from the master Skill-Map discovery index |
| D2-030 | Medium | claude+codex | D2.3/D2.4 | skill | .claude/skills/gobbi/hook-authoring.md (absent) | `gobbi/SKILL.md` (every-session) relative-links a child doc absent from the mirror |
| D2-031 | Medium | claude+codex | D2.3/D2.4 | skill | .claude/skills/memory/memory-vocabulary.json (absent) | `memory/rules.md` relative-links a json absent from the mirror |
| D2-032 | Medium | claude+codex | D2.3/D2.4 | skill | .claude/skills/*/scripts/*; codex/task-metadata.md | mirror omits 13 scripts + task-metadata (codex: defect / claude: by-design — divergence) |
| D2-033 | Low | claude | D2.6 | skill | gobbi/SKILL.md:208 | memory value-feature row says "the 13 types"; canonical enum is 16 |
| D2-034 | Low | claude | D2.1 | skill | ideation/SKILL.md:3,52,411 | `loop's` apostrophe corrupted to `loop.s` (ideation only) |
| D2-035 | Low | claude | D2.3 | skill | evaluation/SKILL.md:102; record/SKILL.md:91 | Anchor-fragment drift on `+`/em-dash headings (wrong hyphen count) |
| D2-036 | Low | claude | D2.3/D2.2 | skill | evaluation/SKILL.md:551; execution/evaluation.md:7 | Stale "when that skill exists/created" — `coding/evaluation.md` already exists |
| D2-037 | Low | codex | D2.3 | docs | memory/rules.md:351,378 | Two broken markdown links (`diataxis.fr`, `design-literal-retire…`) — backlog-tracked |
| D2-038 | Low | claude | D2.2 | skill | interview/SKILL.md:36,38,331,332 | Retains retired `rawdata`/`artifacts` slot vocab without stated rationale |
| D2-039 | Low | claude | D2.1/D2.2 | skill | skill-writing/SKILL.md:77; agent-writing/SKILL.md:5 | Read-only `allowed-tools` vs documented file-creating procedures |
| D2-040 | Low | claude | D2.10 | skill | interview/SKILL.md:4; templates/project-skill.md:26 | Claude-only `AskUserQuestion` baked into a runtime-neutral skill + generated skills |

## Findings

### D2-001: Preparation PASS never loads `planning/SKILL.md`
- Severity: Critical
- Confidence: 100
- Priority: critical
- System: codex
- Dimension: D2 (D2.5)
- Owner-surface: workflow
- Location: `skills/preparation/SKILL.md:58-62,323-332,372-395`
- Expected: Preparation PASS names successor `planning` and explicitly directs the manager to load `planning/SKILL.md`.
- Observed: Preparation names a Planning transition only for generated-skill copying; its PASS path only "exits the loop" and sets `workflow.preparation` PASS state — no load directive for the successor.
- Description: The PASS-after-RECORD step does not hand control to the next loop. A reader of preparation/SKILL.md alone cannot tell that Planning is entered or that its skill must be loaded.
- Evidence: `nl -ba preparation/SKILL.md` — line 62 "Preparation ITER/EXIT → Planning transition", line 332 "After RECORD, PASS exits the loop", lines 381/395 only set `finishedAt`/verdict.
- Cross-system divergence: Claude (C1b index) classified preparation→Planning as NAMED (preparation:11,62) and filed NO defect. Codex treats the absence of an explicit load directive as a Critical dead-end. User decides whether "named-but-no-load-directive" is a defect.
- Proposed remediation: add a PASS-after-RECORD handoff step — manager loads `../planning/SKILL.md` and enters Planning after any generated-skill promotion.
- Verification: a future session greps preparation/SKILL.md's PASS path for an explicit `planning/SKILL.md` load directive and finds one.
- Disposition: open

### D2-002: Planning PASS never loads `execution/SKILL.md`
- Severity: Critical
- Confidence: 100
- Priority: critical
- System: codex
- Dimension: D2 (D2.5)
- Owner-surface: workflow
- Location: `skills/planning/SKILL.md:11-20,389-412,439-462`
- Expected: Planning PASS names successor `execution` and explicitly directs the manager to load `execution/SKILL.md`.
- Observed: Planning says it runs between Preparation and Execution and produces `3-planning/outputs/`, but PASS only "exits the loop" and marks planning PASS — no load directive.
- Description: Same dead-end class as D2-001 one loop downstream: the successor loop is described as a consumer of outputs but is never entered via an explicit load step.
- Evidence: `nl -ba planning/SKILL.md` — lines 11/16 name Execution downstream, line 398 "PASS exits the loop", line 462 only sets `finishedAt`/verdict.
- Cross-system divergence: Claude (C1b index) classified planning→Execution as NAMED (planning:16,55) and filed NO defect; Codex rates it Critical. Same adjudication as D2-001.
- Proposed remediation: add a PASS-after-RECORD step that loads `../execution/SKILL.md` and starts task 1 from `3-planning/outputs/`.
- Verification: planning/SKILL.md PASS path carries an explicit `execution/SKILL.md` load directive.
- Disposition: open

### D2-003: `coding/evaluation.md` + `review.md` are a dead-end from Execution EVALUATION
- Severity: Critical
- Confidence: 100
- Priority: high
- System: codex
- Dimension: D2 (D2.5)
- Owner-surface: workflow
- Location: `skills/coding/evaluation.md:3`; `skills/execution/SKILL.md:167-180`; `skills/coding/review.md:450`
- Expected: Since Execution EVALUATION names code-quality coverage as living in `coding/evaluation.md`, the Execution evaluation path should name that successor and direct evaluators to load it for code change-sets.
- Observed: `coding/evaluation.md:3` says runtime load-both wiring is deferred; Execution EVALUATION (Stage 0) loads only `execution/evaluation.md`. No `coding/evaluation.md` load directive exists, so code-quality review has no formal successor path.
- Description: The coding skill ships (SKILL+evaluation+review) but is unreachable from the live workflow — it is created-but-unwired. `coding/review.md:450` likewise defers automatic use and RECORD capture.
- Evidence: `nl -ba coding/evaluation.md` line 3 "the runtime load-both wiring is deferred"; `execution/SKILL.md:180` "Run the four-stage procedure per `evaluation/SKILL.md` with `execution/evaluation.md` loaded at Stage 0" — no coding load.
- Cross-system divergence: overlaps D2-036 (claude C3a-03), which frames the same surface narrowly as stale future-tense language (Low). Codex frames it as a Critical structural dead-end. Same surface, two angles — both retained.
- Proposed remediation: wire `coding/evaluation.md` into Execution EVALUATION for code change-sets, OR explicitly declare it standalone and drop the "when that skill exists" successor expectation from the execution evaluation docs.
- Verification: either Execution EVALUATION carries a `coding/evaluation.md` load directive, or the coding child docs state standalone status with no execution-side successor claim.
- Disposition: open

### D2-004: RECORD postcondition contradicts the sole-writer memory boundary
- Severity: High
- Confidence: 100
- Priority: high
- System: codex
- Dimension: D2 (D2.6)
- Owner-surface: workflow
- Location: `skills/orchestration/SKILL.md:251-257`
- Expected: Co-loaded orchestration + RECORD docs give the assistant the same write-surface rule (loop RECORD is session-scoped; memory is written only by Wrap-up).
- Observed: The state-machine table row says RECORD's postcondition is "Memory writes complete," while `orchestration/workflow/record.md:7,324` and `gobbi/SKILL.md:237` say loop RECORD writes are session-scoped and memory is Wrap-up-only.
- Description: A reader following the orchestration table would believe RECORD promotes to memory — the exact boundary violation the rest of the system forbids.
- Evidence: `orchestration/SKILL.md:256` "...memory promotion only in Wrap-up | **Memory writes complete**"; `workflow/record.md:7` "The assistant never writes to memory; Wrap-up is the sole writer there."
- Proposed remediation: change the RECORD postcondition to session-evidence/staging completion; reserve "memory writes complete" for the Wrap-up row only.
- Verification: the orchestration state table's RECORD postcondition no longer asserts memory completion.
- Disposition: open

### D2-005: Execution final-task → Wrap-up transition is unstated
- Severity: High
- Confidence: 100
- Priority: high
- System: claude+codex
- Dimension: D2 (D2.5)
- Owner-surface: workflow
- Location: `skills/execution/SKILL.md:9-18,175-199,227-251` (and :11,184,257,292)
- Expected: Execution names its successor loop after the last planned task and directs the manager to load `wrap-up/SKILL.md` — the way Planning names Execution as its briefing consumer.
- Observed: Execution describes only per-task progression ("PASS advances to the next planned task", "Plan cursor advances"); it never states the cursor-exhausted case nor a Wrap-up load directive. Wrap-up is referenced only as the post-workflow promoter.
- Description: Cross-system-corroborated. The Execution-side analog of the seeded Ideation→Preparation gap. Codex calls it Critical (no load directive); Claude calls it Medium ("not a hard dead-end — Wrap-up IS linked, only the transition is unstated"). Both agree the successor transition is missing.
- Evidence: `grep -i wrap-up execution/SKILL.md` → only promotion/ownership rows (31,35,36,39,69,208,257,264,280,292,293); `nl -ba` lines 11/184/251 show only per-task advance.
- Cross-system divergence: severity Critical (codex) vs Medium (claude); reconciled to High. Existence corroborated by both.
- Proposed remediation: add the cursor-exhausted branch — when the final planned task reaches PASS after RECORD, the manager loads `../wrap-up/SKILL.md` and enters Wrap-up.
- Verification: execution/SKILL.md states the final-task→Wrap-up transition with a load directive.
- Disposition: open

### D2-006: Generated-skill promotion owner conflicts between Preparation and Wrap-up
- Severity: High
- Confidence: 100
- Priority: high
- System: codex
- Dimension: D2 (D2.6)
- Owner-surface: skill
- Location: `skills/preparation/SKILL.md:58-62,252-256,434-442`; `skills/wrap-up/SKILL.md:47-51,306-312,585-588`
- Expected: Co-loaded workflow docs give one owner/timing for promoting `2-preparation/staging/skills/{slug}/SKILL.md` to project skills.
- Observed: Preparation core says the manager promotes generated skills before Planning, but Preparation outputs/constraints say Wrap-up promotes them; Wrap-up says those skills are already-promoted manifest-only and should not be re-promoted unless missing.
- Description: Same write surface, two declared owners and two timings. Closely related to D2-011 (whether project `skills/` is a memory destination at all).
- Evidence: preparation:62 "manager pre-Planning copy", :255/:442 "Wrap-up promotes"; wrap-up:51 "manager promotes before Planning", :312 "Already-promoted (manifest-only)".
- Proposed remediation: make Preparation's output/constraint text match the exception — generated skills are manager-promoted before Planning; Wrap-up only verifies/records that promotion.
- Verification: preparation + wrap-up agree on one owner+timing for generated-skill promotion.
- Disposition: open

### D2-007: `staging/` writer-set + timing self-contradicts across the record docs
- Severity: High
- Confidence: 100
- Priority: high
- System: claude+codex
- Dimension: D2 (D2.6)
- Owner-surface: skill
- Location: `skills/record/SKILL.md:41,89-91,303-318`; `skills/record/record-map.md:117-120`; `skills/preparation/SKILL.md:416`
- Expected: One surface, one consistent writer-set + timing across the three docs that name the `staging/` write.
- Observed: record/SKILL.md:41 frames `staging/` as the assistant's surface, "READ + WRITE (PASS only)"; its own moment-of-capture rule (:91) stages corrections/decisions during WORK; record-map.md:119 lists the writer-set as "executor / leader / assistant" created "at loop/task entry"; preparation/SKILL.md:416 has the leader write `staging/skills/` during WORK. Not reconcilable as written.
- Description: Cross-system-corroborated (claude C2-07 + codex C2-03). This is the structural root that also surfaces as D2-026.
- Evidence: quotes above, all grep-confirmed; record/SKILL.md:304-318 list staging paths as "assistant (RECORD) | PASS only".
- Proposed remediation: pick ONE model — WORK-time staging by producers, or RECORD-time staging by the assistant — then align record/SKILL.md, record-map.md, preparation/SKILL.md, and the evaluation routing.
- Verification: the three docs name the same writer(s) + timing for `staging/`.
- Disposition: open

### D2-008: Preparation omitted from the forbidden-memory-write matrix rows
- Severity: High
- Confidence: 100
- Priority: high
- System: codex
- Dimension: D2 (D2.6)
- Owner-surface: skill
- Location: `skills/record/SKILL.md:45-47,365`
- Expected: The Memory Access Matrix consistently states which loops are forbidden to write durable memory.
- Observed: The feature-memory and memory rows forbid writes for "Ideation / Planning / Execution" — omitting Preparation — while the Wrap-up-exception row (:47) and Constraints (:365) include `preparation` in the forbidden set.
- Description: A literal reader of the two matrix rows concludes Preparation MAY write memory, contradicting the same file's exception clause and constraints. Part of the Preparation-omission class (D2-018, D2-019).
- Evidence: record/SKILL.md:45-46 "FORBIDDEN for Ideation / Planning / Execution loops"; :47 applies "when loop ∈ {preparation, ideation, planning, execution}"; :365 "MUST NEVER write to memory when loop ∈ {preparation, ideation, planning, execution}".
- Proposed remediation: add Preparation to the two Memory Access Matrix forbidden rows.
- Verification: both matrix rows list Preparation among the forbidden loops.
- Disposition: open

### D2-009: Evaluator template violates the required load-tier order
- Severity: High
- Confidence: 100
- Priority: medium
- System: codex
- Dimension: D2 (D2.6)
- Owner-surface: skill
- Location: `skills/delegation/SKILL.md:38-40`; `skills/delegation/templates/evaluator.md:59-67`
- Expected: Delegation prompts load `principles → rules → skills → mistakes`, with skills in the Skills tier.
- Observed: The evaluator template places `evaluation/SKILL.md` under tier "1. Principles" (line 61), before Rules and Skills, even though it is a skill.
- Description: The template contradicts the delegation skill's own mandated tier order with no documented exception.
- Evidence: delegation/SKILL.md:38-40 mandates the order "with no re-ordering"; evaluator.md:61 puts `evaluation/SKILL.md` under `1. Principles`.
- Proposed remediation: move `evaluation/SKILL.md` into the Skills tier, OR document an explicit evaluator-only exception in both the main skill and the template.
- Verification: evaluator.md lists `evaluation/SKILL.md` under the Skills tier, or both docs state the exception.
- Disposition: open

### D2-010: `.claude` mirror missing the canonical `coding` skill (21 of 22)
- Severity: High
- Confidence: 100
- Priority: high
- System: claude+codex
- Dimension: D2 (D2.3/D2.4/D2.8)
- Owner-surface: skill
- Location: `.claude/skills/coding/` (absent) vs `.agents/skills/coding/` + `plugins/gobbi/skills/coding/` (present)
- Expected: One coherent mirror policy — either all runtime mirrors of `coding` are deferred (none exist) or `coding` ships to all three (`.claude/` included), matching `claude-plugin/SKILL.md:254` "ships all 22 canonical skills".
- Observed: `.claude/skills/coding` is entirely absent while `.agents/skills/coding/` and `plugins/gobbi/skills/coding/` each exist with all 3 files. A Claude-Code agent cannot load `coding`; a Codex agent can. This contradicts BOTH `coding/review.md:450` ("runtime mirrors deferred" — yet 2 of 3 exist) AND `claude-plugin/SKILL.md:254`.
- Description: Strongly corroborated — Claude raised it twice (C3a-02 from the coding chunk, C4-01 from the mirror chunk) and Codex once (C4-01). Commit #320 "fix coding mirror" fixed only the `.agents` symlink side; the `.claude` per-file mirror was never created.
- Evidence: `comm -23 <(ls skills|sort) <(ls .claude/skills|sort)` → `coding`; `test -e .claude/skills/coding` → "No such file or directory"; `ls .agents/skills/coding` + `ls plugins/gobbi/skills/coding` → 3 files each.
- Proposed remediation: pick one policy. If shipped: hand-create `.claude/skills/coding/` with one per-file symlink for each of the 3 files (per skill-writing P5) and correct `coding/review.md:450`'s "deferred" claim. If deferred: remove the `.agents/`+`plugins/` coding mirrors and fix `claude-plugin`'s count. Tie to D2-015 (the missing guard).
- Verification: `.claude/skills` count equals canonical (22) OR all three mirrors agree on absence, and the doc claims match.
- Disposition: open

### D2-011: Project `skills/` is both excluded from memory and a memory write target
- Severity: High
- Confidence: 100
- Priority: high
- System: codex
- Dimension: D2 (D2.6)
- Owner-surface: memory
- Location: `skills/memory/memory-map.md:151-153`; `skills/preparation/SKILL.md:58-62`; `skills/wrap-up/SKILL.md:51,312-316`
- Expected: Co-loaded memory / preparation / wrap-up docs classify `.gobbi/projects/{name}/skills/` consistently.
- Observed: `memory-map.md:153` excludes project `skills/` from the memory tables and labels the placement an unresolved contradiction, yet Preparation and Wrap-up call generated skills a memory promotion / memory destination.
- Description: The owning memory doc itself flags this as unresolved. Root of D2-006.
- Evidence: memory-map.md:153 names the "`skills/` placement contradiction ... yet `wrap-up/SKILL.md` lists `skills/` among Wrap-up's memory write targets"; preparation:58-62 "promoted to memory before Planning"; wrap-up:312 "an authoring surface, not a memory type."
- Proposed remediation: decide ONE classification for project `skills/` and align memory-map, preparation, wrap-up, and record around it.
- Verification: all four docs classify project `skills/` identically (memory type vs authoring surface).
- Disposition: open

### D2-012: research↔Preparation `staging/references/` ownership contradiction (new seed sibling)
- Severity: High
- Confidence: 75
- Priority: medium
- System: claude
- Dimension: D2 (D2.6)
- Owner-surface: skill
- Location: `skills/research/SKILL.md:22,168-169`; `skills/preparation/SKILL.md:421`
- Expected: A co-loaded skill pair gives the same role one rule for the same write surface. `research` is co-loaded in Preparation, so its surface rules bind there.
- Observed: research/SKILL.md:169 — "MUST never write to `staging/references/` during WORK ... RECORD promotes to `staging/references/` on PASS"; its matrix (:22) marks `staging/` read-only-during-WORK for the leader. But preparation/SKILL.md:421's Output-paths row gives the writer of `2-preparation/staging/references/` as "leader (WORK) or assistant (RECORD)" — exactly what research forbids.
- Description: A NEW, un-recorded sibling of the seeded research↔ideation contradiction (`mistakes/docs-sync/research-ideation-reference-staging-conflict.md` covers IDEATION only).
- Evidence: quotes above, grep-confirmed.
- Proposed remediation: reconcile identically to the ideation fix — make Preparation's `staging/references/` row assistant-RECORD-only and route Preparation external refs through `working/research/{slug}.md`; OR have research carve out Preparation explicitly. Add the "no co-loaded skill gives the same role opposite instructions for the same subdir" deep-review check.
- Verification: Preparation + research agree on one owner/timing for `staging/references/`.
- Disposition: open

### D2-013: codex production foreground-vs-background self-contradicts; `timeout 1200` exceeds the host Bash cap
- Severity: High
- Confidence: 75
- Priority: medium
- System: claude
- Dimension: D2 (D2.6/D2.2)
- Owner-surface: skill
- Location: `skills/codex/SKILL.md:152,153,179,181,350`; `skills/codex/mistakes.md` ("Codex Exec Large Diff Eval Times Out"); `mistakes/codex/codex-exec-timeout-exceeds-bash-cap.md`
- Expected: One consistent run-mode + a `timeout` that fits the Claude Code Bash per-call wall-clock (~10 min).
- Observed: The Dual-System Production section calls the proposer run both modes — :152/:179 "foreground-blocking" vs :181 "A backgrounded proposer `codex exec` MUST redirect stdin from /dev/null" — and prescribes `timeout 1200` (> ~600s host cap) for a foreground run, which the recorded project mistake (created this session) shows gets SIGTERM-killed mid-run. The :350 evaluation worked example repeats the foreground `timeout 600` pattern the mistake says fails.
- Description: A documented invocation that cannot run as written, contradicting both the skill's own mistakes.md and a project mistake.
- Evidence: codex/SKILL.md:152 "foreground-blocking"; :181 "backgrounded proposer"; :179 "timeout 1200 ... foreground-blocking"; `mistakes/codex/codex-exec-timeout-exceeds-bash-cap.md` "Long codex exec runs ... MUST be launched as BACKGROUND ... not foreground".
- Proposed remediation: decide one proposer mode (per the mistake: BACKGROUND in Claude Code for any run that may exceed the Bash cap), make :152/:179/:181 agree, add a per-runtime-cap sentence, and reconcile the :350 example.
- Verification: codex/SKILL.md states one run-mode + a sub-cap inner timeout consistent with codex/mistakes.md.
- Disposition: open

### D2-014: Codex evaluator vocab-grep gate contradicts its own loaded mistake
- Severity: High
- Confidence: 100
- Priority: medium
- System: codex
- Dimension: D2 (D2.6)
- Owner-surface: skill
- Location: `skills/codex/SKILL.md:358-363`; `skills/codex/mistakes.md:24-31`
- Expected: Co-loaded Codex instructions agree on required evaluator-output validation.
- Observed: `codex/SKILL.md` requires finding-vocabulary grep hits (≥1 per file) as a gate; the co-loaded Codex mistake says that exact gate false-blocks valid clean PASS output and must be demoted to advisory.
- Description: The worked evaluation-wrapper gate enforces a check its own mistakes.md forbids enforcing.
- Evidence: codex/SKILL.md:358-363 "5-Type vocabulary must appear in output ... >= 1 hit per file"; codex/mistakes.md:24-31 "Codex Eval Wrapper Vocab Grep False Blocks Clean Pass" / "Demote the finding-vocab token check to ADVISORY".
- Proposed remediation: change the wrapper gate to require file existence + non-empty + verdict lines; keep vocabulary checks advisory/prompt-side.
- Verification: codex/SKILL.md's wrapper gate no longer hard-blocks on vocab grep.
- Disposition: open

### D2-015: `.claude/skills` mirror is unmanaged by sync + unvalidated by `--check` (ROOT CAUSE)
- Severity: High
- Confidence: 100
- Priority: critical
- System: claude
- Dimension: D2 (D2.3/D2.4)
- Owner-surface: skill
- Location: `scripts/sync-plugin-package.sh:75-90`; `skills/skill-writing/SKILL.md` P5 (:189,194-195,208,222)
- Expected: A mirror-completeness guard detects a missing `.claude/skills/{name}` entry; skill-writing P5 says "the check must exit 0".
- Observed: `sync-plugin-package.sh --check` validates only `.agents/skills/{name}` (loop), the 3 plugin whole-dir symlinks, and `.claude/hooks/*`. It has NO `.claude/skills` validation and exits 0 while `.claude/skills/coding` is entirely absent. The two mirrors are asymmetric: `.agents/skills` = one whole-dir symlink per skill (auto, script-checked) vs `.claude/skills` = per-file hand symlinks (drift-prone, never created or checked by tooling).
- Description: Root cause (Principle 8) of every `.claude/skills` gap — D2-010, D2-030, D2-031, D2-032. Codex corroborates the remediation direction (its C4-01/C4-02 both call for a mirror validator).
- Evidence: ran `bash scripts/sync-plugin-package.sh --check` → "...intact" + exit 0 despite D2-010; script :76-78 loops `.agents/skills` only; skill-writing/SKILL.md:194-195 "It does NOT touch `.claude/skills/`".
- Proposed remediation: extend `sync-plugin-package.sh` (and `--check`) to enumerate canonical skills and assert a `.claude/skills/{name}/` per-file mirror for every agent-exposed file, OR add a dedicated `.claude/skills`-parity guard at the wiring gate.
- Verification: a deliberately-removed `.claude/skills/{name}` entry makes `--check` (or the new guard) exit non-zero.
- Disposition: open

### D2-016: Leader + assistant prompts deny the existing `agent-writing` skill
- Severity: High
- Confidence: 100
- Priority: medium
- System: codex
- Dimension: D2 (D2.6)
- Owner-surface: agent
- Location: `agents/leader.md:39`; `agents/assistant.md:47`; `skills/agent-writing/SKILL.md:9-13`
- Expected: Co-loaded role docs and skills agree on whether agent-authoring work has a dedicated skill to load.
- Observed: leader.md and assistant.md tell agents that, for work touching runtime docs / agents / rules, "no dedicated skill exists for those domains in this tree" — while `agent-writing/SKILL.md:9-11` says to load it when a task touches `.gobbi/projects/{name}/agents/`.
- Description: A direct contradiction: two role prompts deny a skill that exists and self-describes the exact trigger.
- Evidence: leader.md:39 / assistant.md:47 "no dedicated skill exists for those domains"; agent-writing/SKILL.md:9-11 "Load it when a task touches `.gobbi/projects/{project-name}/agents/`".
- Proposed remediation: update leader + assistant load guidance to name `agent-writing` for agent-role work; narrow any "no dedicated skill" statement to domains that truly lack a skill (e.g. raw runtime docs/rules).
- Verification: leader.md + assistant.md name `agent-writing` for agents/ work.
- Disposition: open

### D2-017: orchestration `.claude` hook/script links use the wrong relative depth
- Severity: Medium
- Confidence: 100
- Priority: medium
- System: codex
- Dimension: D2 (D2.3)
- Owner-surface: docs
- Location: `skills/orchestration/SKILL.md:108,324,330`
- Expected: Markdown links from `skills/orchestration/` to the worktree-root `.claude/` dir need five `../`.
- Observed: Three `.claude` links use four `../`, resolving under `.gobbi/.claude/...`; the files exist at repo-root `.claude/...`.
- Description: Sibling of D2-022 (same off-by-one in delegation/SKILL.md). Targets exist; only the depth is wrong.
- Evidence: link-extract + `test -e`: `:108`/`:324` → `../../../../.claude/hooks/post-tool-use-agents.sh` (MISSING), `:108` → `.claude/scripts/reconstruct-agents.sh` (MISSING), `:330` → `.claude/hooks/session-end.sh` (MISSING); root copies exist.
- Proposed remediation: change the three link targets to five `../` (`../../../../../.claude/...`).
- Verification: a markdown-link guard over orchestration/SKILL.md reports 0 broken `.claude` links.
- Disposition: open

### D2-018: Leader-owns agent-type table drops Preparation
- Severity: Medium
- Confidence: 90
- Priority: low
- System: claude
- Dimension: D2 (D2.7)
- Owner-surface: skill
- Location: `skills/orchestration/SKILL.md:24,37` (contradicts same file :291 + `gobbi/SKILL.md:152`)
- Expected: The agent-type section lists Preparation as leader-owned, consistent with the Loop↔agent mapping (Preparation → `leader`) and gobbi/SKILL.md.
- Observed: The leader's `Owns` cell (:37) reads "Ideation, Planning" — Preparation dropped; the intro (:24) "manager MUST NOT perform Ideation, Planning, Execution, or Evaluation directly" also omits Preparation, so a literal reader concludes the manager MAY self-perform the leader-owned Preparation phase.
- Description: Part of the Preparation-omission class (D2-008, D2-019). The Loop↔agent mapping (:291) correctly maps `3 — Preparation | leader`.
- Evidence: :37 "leader | Ideation, Planning | ..."; :24 manager-MUST-NOT list; :291 "3 — Preparation | leader"; gobbi/SKILL.md:152 "leader | ... Ideation / Preparation / Research / Planning sub-phases".
- Proposed remediation: add Preparation to the leader's `Owns` cell (:37) and to the manager-MUST-NOT list (:24).
- Verification: the early role table agrees with the Loop↔agent mapping on Preparation ownership.
- Disposition: open

### D2-019: EVALUATION-loop-set enumerated 3 different ways across 4 docs (merge-only)
- Severity: Medium
- Confidence: 90
- Priority: medium
- System: claude
- Dimension: D2 (D2.6)
- Owner-surface: docs
- Location: `skills/orchestration/workflow/evaluation.md:3`; `skills/orchestration/workflow/production.md:3`; `skills/gobbi/SKILL.md:141`; `.claude/CLAUDE.md` (Core Principles, evaluation block)
- Expected: One enumeration of which loops run EVALUATION.
- Observed: evaluation.md:3 lists 4 loops "(Ideation, Planning, Execution, Wrap-up)" — drops Preparation; production.md:3 lists all 5; gobbi/SKILL.md:141 says "mandatory after Execution and Wrap-up, optional after Ideation / Preparation / Planning" (5); `.claude/CLAUDE.md` says "Evaluation runs inside Ideation, Planning, and Execution" (3 — drops Preparation AND Wrap-up). Three distinct enumerations.
- Description: A merge-only drift: each chunk saw at most a 2-doc subset; only comparing all four surfaces (incl. the out-of-chunk `.claude/CLAUDE.md` Claude flagged for the merge) exposes the 3-way split. Subsumes claude C1a-02's evaluation.md:3 finding and adds the CLAUDE.md variant.
- Evidence: quotes above; Preparation runs EVALUATION (preparation.md § EVALUATION Phase; auto-mode.md Step 3 row 3), so the 4-loop and 3-loop forms are both wrong.
- Proposed remediation: pick the canonical set (all 5 productive loops run EVALUATION, mandatory after Execution+Wrap-up, optional earlier) and rewrite evaluation.md:3, gobbi/SKILL.md:141, and `.claude/CLAUDE.md` to match production.md.
- Verification: all four surfaces enumerate the same EVALUATION-loop set.
- Disposition: open

### D2-020: Wrap-up RECORD `evaluation_dir` drops the `5-` ordinal; resolves to nothing
- Severity: Medium
- Confidence: 90
- Priority: medium
- System: claude
- Dimension: D2 (D2.2)
- Owner-surface: skill
- Location: `skills/wrap-up/SKILL.md:541`
- Expected: `evaluation_dir` is loop-relative `"evaluation/iter{n}/"` (as ideation/preparation/planning use) or session-relative `"5-wrap-up/evaluation/iter{n}/"` (the on-disk dir carries the mandatory `5-` ordinal).
- Observed: line 541 records `evaluation_dir: "wrap-up/evaluation/iter{n}/"` — bare `wrap-up/` with no `5-` prefix. The actual path is `5-wrap-up/evaluation/...`; the recorded value resolves to nothing under either interpretation. Wrap-up is the only loop whose value carries the bare loop name minus its ordinal.
- Description: Contrast ideation:458 / preparation:387 / planning:454 `"evaluation/iter{n}/"`, execution:242 `"4-execution/task-{NN}-{slug}/evaluation/iter{n}/"`.
- Evidence: wrap-up/SKILL.md:541 quoted; sibling-loop values quoted.
- Proposed remediation: change line 541 to `"evaluation/iter{n}/"` (loop-relative) or `"5-wrap-up/evaluation/iter{n}/"` (session-relative) — not the ordinal-less `wrap-up/` form.
- Verification: the Wrap-up `evaluation_dir` value resolves to the real on-disk `5-wrap-up/evaluation/` dir.
- Disposition: open

### D2-021: `AskUserQuestion` granted inconsistently across 5 loop skills + to a forbidden role
- Severity: Medium
- Confidence: 50
- Priority: low
- System: claude
- Dimension: D2 (D2.1/D2.6)
- Owner-surface: skill
- Location: `ideation/SKILL.md:4`, `preparation/SKILL.md:4`, `planning/SKILL.md:4` (present) vs `execution/SKILL.md:4`, `wrap-up/SKILL.md:4` (absent)
- Expected: one consistent rule across the five sibling loop skills, aligned with which role invokes `AskUserQuestion`.
- Observed: ideation/preparation/planning list it; execution/wrap-up do not. Yet execution+wrap-up DISCUSSION are manager-direct (need it MORE), and the leader — owner of ideation/preparation/planning — is explicitly forbidden from calling it (returns NEEDS_CONTEXT). So the tool is granted where forbidden and omitted where exercised.
- Description: Relates to D2-040 (Claude-only `AskUserQuestion` in runtime-neutral surfaces).
- Evidence: frontmatter `allowed-tools` lines quoted; ideation/SKILL.md:60 "the leader returns NEEDS_CONTEXT ... the manager handles the user-question block".
- Proposed remediation: choose one — drop `AskUserQuestion` from all five, or add it to all five — and apply uniformly with a one-line rationale.
- Verification: the five loop skills carry a consistent `AskUserQuestion` rule matching the invoking role.
- Disposition: open

### D2-022: delegation `.claude` hook/script links use the wrong relative depth
- Severity: Medium
- Confidence: 100
- Priority: medium
- System: claude+codex
- Dimension: D2 (D2.3)
- Owner-surface: skill
- Location: `skills/delegation/SKILL.md:292,309`
- Expected: A link from `skills/delegation/` to worktree-root `.claude/` needs five `../`.
- Observed: both links use four `../`, resolving to `.gobbi/.claude/...` which does not exist; target files exist at the worktree root. Cross-system-corroborated (claude C2-01 + codex C2-01).
- Description: Sibling of D2-017 (same off-by-one in orchestration).
- Evidence: `test -e` 4 levels → ABSENT, 5 levels → EXISTS for both `.claude/hooks/post-tool-use-agents.sh` and `.claude/scripts/reconstruct-agents.sh`.
- Proposed remediation: change both targets from `../../../../.claude/...` to `../../../../../.claude/...`.
- Verification: a markdown-link guard over delegation/SKILL.md reports 0 broken `.claude` links.
- Disposition: open

### D2-023: delegation cites `rules/docs-cleanup-parallelism.md` — dir + file absent
- Severity: Medium
- Confidence: 100
- Priority: medium
- System: claude+codex
- Dimension: D2 (D2.3)
- Owner-surface: skill
- Location: `skills/delegation/SKILL.md:408`
- Expected: A load-bearing cross-reference points at an existing rule file.
- Observed: `[docs-cleanup-parallelism rule]` → `../../rules/docs-cleanup-parallelism.md` resolves to a project `rules/` dir that does not exist; the file exists nowhere. Cross-system-corroborated (claude C2-02 + codex C2-01).
- Description: The exact trap delegation's own `mistakes.md` warns about ("Delegation Briefs Reference Nonexistent Rules Dir" — real rules live in `skills/memory/rules.md`).
- Evidence: `[ -d rules ]` → ABSENT; `find . -name docs-cleanup-parallelism.md` → none.
- Proposed remediation: repoint to the rule's actual home or convert to prose without a dead link; if the rule is desired, create it on the project's de-facto rules surface.
- Verification: the citation resolves or is removed.
- Disposition: open

### D2-024: delegation cites `features/agents/backlogs/…session-json.md` — file absent
- Severity: Medium
- Confidence: 100
- Priority: medium
- System: claude+codex
- Dimension: D2 (D2.3)
- Owner-surface: skill
- Location: `skills/delegation/SKILL.md:292`
- Expected: The cited backlog evidence anchor exists.
- Observed: `[...]` → `../../features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md` resolves to a path under `features/agents/` that holds only `decisions/` (no `backlogs/`); the file exists nowhere. Cross-system-corroborated (claude C2-03 + codex C2-01).
- Description: The evidence anchor for the "hook cannot always resolve the worktree's session.json" claim is dangling.
- Evidence: `find features/agents -maxdepth 2 -type d` → no `backlogs/`; `find . -name post-tool-use-hook-cannot-resolve-worktree-session-json.md` → none.
- Proposed remediation: repoint to the backlog's actual location (it may have moved to `backlogs/{area}/` under the namespace schema), recreate it, or state the limitation inline without a dead link.
- Verification: the citation resolves or is removed.
- Disposition: open

### D2-025: Executor template example skill paths `bun`/`typescript` do not exist
- Severity: Medium
- Confidence: 75
- Priority: low
- System: codex
- Dimension: D2 (D2.3)
- Owner-surface: skill
- Location: `skills/delegation/templates/executor.md:43`
- Expected: Concrete skill-path examples in Load Directives point to existing skill dirs, or are clearly abstract.
- Observed: the template gives concrete examples `skills/bun/SKILL.md` and `skills/typescript/SKILL.md`, but neither skill exists. (The `claude` example is the confirmed seed and is not counted.)
- Description: Concrete-looking examples pointing at non-existent skills mislead a reader composing a brief.
- Evidence: `test -e` → MISSING for both `skills/bun/SKILL.md` and `skills/typescript/SKILL.md`.
- Proposed remediation: replace with existing skill paths, create the skills, or make the examples non-concrete placeholders.
- Verification: every concrete skill path in executor.md examples resolves, or the examples are clearly abstract.
- Disposition: open

### D2-026: record matrix omits Preparation `staging/skills/` (and `plans/` from the brace)
- Severity: Medium
- Confidence: 100
- Priority: medium
- System: claude+codex
- Dimension: D2 (D2.2/D2.6)
- Owner-surface: skill
- Location: `skills/record/SKILL.md:41,303-318`; `skills/record/record-map.md:130-144`
- Expected: record/SKILL.md (the assistant's RECORD procedure) lists every session staging write surface the SSOT (record-map.md) declares.
- Observed: record-map.md declares loop-specific `staging/skills/` (Preparation) and `staging/plans/` (Planning). record/SKILL.md documents `plans/` in three places but never lists `staging/skills/` anywhere; its matrix glob (:41) omits both `skills` and `plans`. Cross-system-corroborated (claude C2-04 + codex C2-08).
- Description: Asymmetric omission against the declared SSOT; structurally related to D2-007.
- Evidence: record-map.md:143-144 lists `2-preparation | skills/` + `3-planning | plans/`; `grep -n "staging/skills" record/SKILL.md` → none.
- Proposed remediation: add `staging/skills/` (Preparation) to record/SKILL.md's matrix glob + Output-paths/Templates tables and complete `plans/` in the matrix brace — mirroring how `plans/` is otherwise documented; OR add an explicit note that `skills/` is leader-WORK-written (D2-027/D2-007) and intentionally absent.
- Verification: record/SKILL.md's staging vocabulary matches record-map.md's loop-specific extras.
- Disposition: open

### D2-027: Evaluator writes worktree session-record but is excluded from the git-skill gate
- Severity: Medium
- Confidence: 50
- Priority: low
- System: claude
- Dimension: D2 (D2.6/D2.7)
- Owner-surface: skill
- Location: `skills/delegation/SKILL.md:128`; `skills/delegation/templates/evaluator.md:53-69`
- Expected: delegation/SKILL.md:128 applies the git-skill gate to "any delegation whose subagent writes to the worktree (commits, or writes session-record artifacts / staging)". The evaluator writes per-perspective files under `sessions/.../evaluation/iter{n}/{system}/`, so it qualifies.
- Observed: the rule's enumeration names only executor/leader/assistant; the evaluator template's Load Directives carry no `git/SKILL.md` / `git/mistakes.md` entry. So the evaluator writes to the worktree without the absolute-worktree-path / CWD-reset discipline.
- Description: The documented `git/mistakes.md#executor-wrote-to-main-tree-not-worktree` failure mode applies to the evaluator's write surface.
- Evidence: `grep git/SKILL evaluator.md` → none; evaluation/SKILL.md:33 names the eval dir as the agent's writable surface (worktree-local).
- Proposed remediation: add `git/SKILL.md` + `git/mistakes.md` to the evaluator template's Skills tier and to the rule's enumeration, OR add an explicit carve-out stating why the evaluator's write is exempt.
- Verification: either the evaluator template loads the git skill, or delegation/SKILL.md:128 documents the exemption.
- Disposition: open

### D2-028: Eight skills omit operational-contract sections (Memory Access Matrix / Outputs / Constraints / Exit)
- Severity: Medium
- Confidence: 75
- Priority: low
- System: codex
- Dimension: D2 (D2.2)
- Owner-surface: skill
- Location: `discussion/SKILL.md`, `delegation/SKILL.md`, `coding/SKILL.md`, `principles/SKILL.md`, `claude-plugin/SKILL.md`, `codex/SKILL.md`, `agent-writing/SKILL.md:181-233`, `skill-writing/SKILL.md:200-252`
- Expected: every skill states trigger, Memory Access Matrix / write surfaces, outputs, constraints, and exit/handoff.
- Observed: all eight carry frontmatter + body but lack one or more of Memory Access Matrix / Output paths / Constraints / Exit-handoff. Several declare write-capable `allowed-tools` (claude-plugin, codex) or document file-creating procedures (agent-writing, skill-writing, coding) without a declared write surface.
- Description: Consolidated merge-only pattern from codex C2-06, C2-07, C3a-01, C3b-01, C3b-02, C3b-03, C3b-04 — a uniform D2.2 gap across 8 skills no single chunk could see at once.
- Cross-system divergence: Claude did NOT file these — it treats `principles`/`claude-plugin`/`agent-writing`/`skill-writing` as reference/discipline skills whose contract is implicit, and its C3b-04 instead flags only the `allowed-tools` mismatch (D2-039). Whether gobbi requires a uniform operational-contract footer on every skill is a user decision.
- Evidence: per-file `rg '^## |Memory Access Matrix|Output paths|Constraints|Exit|Handoff'` returns only trigger/principle/guide headings for each (codex C2-06/C2-07/C3a-01/C3b-01..04 traces).
- Proposed remediation: decide the bar. If uniform: add a compact operational footer (write surface / outputs / constraints / exit) to each, declaring read-only where applicable. If not: document which skill classes are exempt so the gap is intentional-and-stated.
- Verification: each in-scope skill either carries the contract sections or is covered by a stated exemption class.
- Disposition: open

### D2-029: `coding` absent from the master Skill-Map discovery index
- Severity: Medium
- Confidence: 100
- Priority: low
- System: claude
- Dimension: D2 (D2.4/D2.7)
- Owner-surface: skill
- Location: `skills/gobbi/SKILL.md` §Skill Map (161-217)
- Expected: a shipped canonical skill appears in the master discovery index every agent loads at session start (Loop / Cross-cutting / Supporting row, or an explicit deferred-wiring note).
- Observed: `grep -n coding gobbi/SKILL.md` → nothing; `coding` is in none of the three Skill-Map tables nor the meta paragraph, yet `claude-plugin/SKILL.md:254` counts it among the 22 canonical skills and the tree has 22 skill dirs. An agent reading the map cannot discover `coding` exists.
- Description: NOT a true orphan — `coding` has inbound edges (claude-plugin, coding/review.md, execution/evaluation.md, evaluation/SKILL.md), so the global orphan count stays 0 (see § Global reconciliation). This is a discoverability gap in the index.
- Evidence: Skill Map = Loop(5)+Cross-cutting(8)+Supporting(3)+mistake+skill-writing/agent-writing — no `coding`; `ls skills | wc -l` = 22.
- Proposed remediation: add a Skill-Map row for `coding` (Supporting, or a labeled "shipped; workflow-wiring deferred" entry).
- Verification: the Skill Map lists `coding` (or an explicit deferred note).
- Disposition: open

### D2-030: `.claude` mirror omits the link-target child doc `gobbi/hook-authoring.md`
- Severity: Medium
- Confidence: 90
- Priority: medium
- System: claude+codex
- Dimension: D2 (D2.3/D2.4)
- Owner-surface: skill
- Location: `.claude/skills/gobbi/hook-authoring.md` (absent) vs `skills/gobbi/SKILL.md:213,215`
- Expected: a per-file symlink for every file the skill exposes; `gobbi/SKILL.md` exposes `hook-authoring.md`, so the mirror should resolve it.
- Observed: `.claude/skills/gobbi/hook-authoring.md` is missing; the relative link `[hook-authoring]` → `hook-authoring.md` (lines 213+215) breaks when SKILL.md is read from the `.claude` mirror dir. Cross-system-corroborated (claude C4-03 + codex C4-02). `gobbi/SKILL.md` loads every session start.
- Description: A symptom of the D2-015 root cause. Confidence 90 — a consumer that `readlink`-dereferences SKILL.md to canonical first resolves siblings there.
- Evidence: `grep -n hook-authoring gobbi/SKILL.md` → 213,215; `test -e .claude/skills/gobbi/hook-authoring.md` → missing; canonical + `.agents` copies present.
- Proposed remediation: `ln -s ../../../.gobbi/projects/gobbi/skills/gobbi/hook-authoring.md .claude/skills/gobbi/hook-authoring.md` (and fix the root via D2-015).
- Verification: `.claude/skills/gobbi/hook-authoring.md` resolves.
- Disposition: open

### D2-031: `.claude` mirror omits the link-target `memory/memory-vocabulary.json`
- Severity: Medium
- Confidence: 90
- Priority: medium
- System: claude+codex
- Dimension: D2 (D2.3/D2.4)
- Owner-surface: skill
- Location: `.claude/skills/memory/memory-vocabulary.json` (absent) vs `skills/memory/rules.md:102,138,141`
- Expected: an exposed link target gets a per-file mirror symlink; `memory-vocabulary.json` is relative-linked, so the mirror should resolve it.
- Observed: `.claude/skills/memory/memory-vocabulary.json` is missing; `[memory-vocabulary.json]` → `memory-vocabulary.json` (rules.md:102,138,141 + §2.5 SKILL.md sites) breaks in the mirror tree. Cross-system-corroborated (claude C4-04 + codex C4-02). The memory skill is widely loaded.
- Description: Same D2-015 root cause + same readlink-dereference mitigation (Confidence 90).
- Evidence: `comm -23` canonical-vs-claude lists `memory/memory-vocabulary.json`; 3 in-text link hits; `.agents` copy present.
- Proposed remediation: `ln -s ../../../.gobbi/projects/gobbi/skills/memory/memory-vocabulary.json .claude/skills/memory/memory-vocabulary.json` (and fix the root via D2-015).
- Verification: `.claude/skills/memory/memory-vocabulary.json` resolves.
- Disposition: open

### D2-032: `.claude` mirror omits 13 scripts + `codex/task-metadata.md` (divergent: defect vs by-design)
- Severity: Medium
- Confidence: 50
- Priority: low
- System: claude+codex
- Dimension: D2 (D2.3/D2.4)
- Owner-surface: skill
- Location: `.claude/skills/*/scripts/*.sh` (13 absent); `.claude/skills/codex/task-metadata.md` (absent)
- Expected: (disputed) either every exposed canonical file is mirrored, or the mirror's docs-only scope is documented.
- Observed: `.claude/skills` carries 0 scripts and omits `codex/task-metadata.md` — a 14-file gap beyond D2-010/D2-030/D2-031.
- Description: Genuine cross-system divergence. Codex (C4-02) rates this a defect (the mirror should hold every exposed file; some scripts are named from mirror-dir SKILL.md, e.g. `git/SKILL.md:200`, `orchestration/SKILL.md:105`). Claude (C4-05) rates it by-design/Low — no doc references a `.claude/skills/{skill}/scripts/...` path (`grep -rn '\.claude/skills/[a-z-]*/scripts'` → empty); scripts are invoked via the canonical path, and `codex/task-metadata.md` is not relative-linked from `codex/SKILL.md`, so it breaks no link. The undocumented "mirror docs, not scripts" rule is itself a corollary of D2-015.
- Evidence: `comm -23` lists 13 `scripts/*.sh` + `codex/task-metadata.md`; Claude's `grep` for a `.claude/skills/.../scripts` reference returns empty; Codex cites `.claude/skills/git/SKILL.md:200` naming `scripts/git-posture-probe.sh`.
- Proposed remediation: decide one policy. Likely: document the "mirror agent-exposed docs, not runtime scripts" rule in skill-writing P5 (make it intentional-and-stated), optionally add `codex/task-metadata.md` for parity. If full parity is intended, mirror the scripts too.
- Verification: skill-writing P5 states the mirror's file-scope rule, and the mirror matches it.
- Disposition: open

### D2-033: memory value-feature row says "the 13 types"; canonical enum is 16
- Severity: Low
- Confidence: 85
- Priority: low
- System: claude
- Dimension: D2 (D2.6)
- Owner-surface: skill
- Location: `skills/gobbi/SKILL.md:208` (contradicts `skills/memory/rules.md:256-258`)
- Expected: a type-count claim matches the canonical enum — "16 first-class types" (memory rules §2.3).
- Observed: the `memory` value-feature "Owns" cell says "... + the 13 types". 13 matches neither the 16 first-class types nor the 12 former-promotable subset — a stale count.
- Description: A count drift caught within one chunk (not merge-only). See also the candidate "README + 14 subdirs" (memory/SKILL.md:24) flagged for verification in § Global reconciliation.
- Evidence: gobbi/SKILL.md:208 "...+ the 13 types"; memory/rules.md:258 "16 first-class types ... 12 former promotable + 4 former feature-subdir-only".
- Proposed remediation: replace "the 13 types" with "the 16 types" (or name the precise subset intended).
- Verification: the value-feature row's type count matches memory/rules.md §2.3.
- Disposition: open

### D2-034: `loop's` apostrophe corrupted to `loop.s` in ideation frontmatter + body
- Severity: Low
- Confidence: 90
- Priority: low
- System: claude
- Dimension: D2 (D2.1)
- Owner-surface: skill
- Location: `skills/ideation/SKILL.md:3,52,411`
- Expected: `loop's` (possessive) in the description and prose; clean frontmatter per the claude authoring standard.
- Observed: three occurrences of `loop.s` (apostrophe rendered as a literal period) — ideation only; the other four loops are clean. Line 3 is the frontmatter `description` field.
- Description: Cosmetic but in a session-start-visible frontmatter field.
- Evidence: `grep -n 'loop\.s' ideation/SKILL.md` → 3,52,411; same grep on the other four loop SKILL.md → 0 hits.
- Proposed remediation: replace `loop.s` → `loop's` at lines 3, 52, 411.
- Verification: `grep 'loop\.s' ideation/SKILL.md` → 0 hits.
- Disposition: open

### D2-035: Anchor-fragment drift on `+`/em-dash headings (wrong hyphen count)
- Severity: Low
- Confidence: 50
- Priority: low
- System: claude
- Dimension: D2 (D2.3)
- Owner-surface: skill
- Location: `skills/evaluation/SKILL.md:102`; `skills/record/SKILL.md:91`
- Expected: an `#anchor` fragment equals the GitHub-slugged target heading.
- Observed: (a) evaluation/SKILL.md:102 cites `../record/SKILL.md#per-perspective-evaluation-file-naming-the-execution-per-task-quartet` (single hyphen), but the heading slugs to `…file-naming--the-execution-per-task-quartet` (double hyphen — the `+` drops, collapsing two spaces to `--`). (b) record/SKILL.md:91 cites `../mistake/SKILL.md#p2----detect-a-correction-during-work` (four hyphens), but `### P2 — Detect a correction during work` slugs to `p2--detect-a-correction-during-work` (two hyphens).
- Description: Confidence 50 — target headings exist; renderers that single-collapse hyphens may still resolve, so impact is renderer-dependent.
- Evidence: heading text grep-confirmed (record/SKILL.md:162, mistake/SKILL.md:83); GitHub slug algorithm drops `+`/`—`.
- Proposed remediation: fix the fragments to the computed slugs, or rename the headings to drop `+`/em-dash so the slug is unambiguous.
- Verification: both cross-doc anchors resolve under the GitHub slug algorithm.
- Disposition: open

### D2-036: Stale "when that skill exists/created" — `coding/evaluation.md` already exists
- Severity: Low
- Confidence: 100
- Priority: low
- System: claude
- Dimension: D2 (D2.3/D2.2)
- Owner-surface: skill
- Location: `skills/evaluation/SKILL.md:551`; `skills/execution/evaluation.md:7`
- Expected: cross-references describe the current tree state.
- Observed: evaluation/SKILL.md:551 — "Detailed coding-domain quality checks live in the `coding` skill's evaluation child when that skill exists"; execution/evaluation.md:7 — "...when that skill is created". Both `coding/evaluation.md` and `coding/review.md` are present, so the conditional language is stale (the child exists; only load-wiring is deferred).
- Description: The narrow stale-language angle on the same surface as D2-003 (the codex Critical dead-end). Both retained per the partial-overlap rule.
- Evidence: `test -e skills/coding/evaluation.md` → EXISTS; two `when that skill exists/created` clauses at the cited lines.
- Proposed remediation: reword both to present tense ("live in `coding/evaluation.md` (present; runtime load-wiring deferred)"), keeping the deferral honest.
- Verification: neither cited line implies the coding eval child is absent.
- Disposition: open

### D2-037: `memory/rules.md` two broken markdown links (backlog-tracked)
- Severity: Low
- Confidence: 100
- Priority: low
- System: codex
- Dimension: D2 (D2.3)
- Owner-surface: docs
- Location: `skills/memory/rules.md:351,378`
- Expected: markdown links resolve to an existing file, or external links carry a URL scheme.
- Observed: `[Diátaxis]` → `diataxis.fr` (bare domain, no `https://`) parses as a broken relative link; `../../mistakes/design-literal-retire-instruction-without-replacement.md` exists nowhere in the live tree (and omits the `{area}/` segment the §1.5 namespace requires).
- Description: Cross-system divergence on status: Codex (C3a-04) raises both as new High findings; Claude (C3a) documents them as ALREADY-TRACKED in `backlogs/memory/preexisting-broken-markdown-links.md` (L32-34, L61-65) and therefore not new. Recorded here as Low + backlog-tracked rather than new High, with both views preserved.
- Evidence: `check-markdown-links.sh` over memory+coding = "2 broken link(s) across 290 checked" — exactly these two; `test -e` MISSING for both targets.
- Proposed remediation: add `https://` to the Diátaxis URL; repoint or recreate the missing mistake link (under its `{area}/` namespace) — or close via the existing backlog.
- Verification: `check-markdown-links.sh` over memory reports 0 broken links, or the backlog explicitly owns them.
- Disposition: open

### D2-038: interview retains the retired `rawdata`/`artifacts` slot vocabulary
- Severity: Low
- Confidence: 25
- Priority: low
- System: claude
- Dimension: D2 (D2.2)
- Owner-surface: skill
- Location: `skills/interview/SKILL.md:36,38,331,332`
- Expected: session-record slot names are uniform; every loop renamed `rawdata`→`working` and `artifacts`→`outputs` (SSOT record/record-map.md:67 "4 slots only").
- Observed: interview still uses `sessions/{…}/interview/rawdata/` and labels `sessions/{…}/interview/` "interview artifacts". record-map.md declares interview a BOOTSTRAP EXCEPTION "out of scope for this spec" but never DEFINES that shape — so a zero-context reader cannot tell whether the retired tokens are intentional or stale.
- Description: Defensible via the carve-out, but un-justified drift — interview is the only surface still carrying the system-wide-retired tokens.
- Evidence: interview/SKILL.md:36 "...interview/rawdata/"; record-map.md:64 "Keeps its own bootstrap shape. Explicitly out of scope for this spec."
- Proposed remediation: either rename interview's slots to `working/`/`outputs/`, OR add one sentence (in interview/SKILL.md or record-map's exception block) stating the bootstrap shape deliberately uses `rawdata`/`artifacts` and why.
- Verification: interview's slot vocabulary is either uniform or documented as a deliberate exception.
- Disposition: open

### D2-039: skill-writing/agent-writing declare read-only `allowed-tools` yet document file-creating procedures
- Severity: Low
- Confidence: 25
- Priority: low
- System: claude
- Dimension: D2 (D2.1/D2.2)
- Owner-surface: skill
- Location: `skills/skill-writing/SKILL.md:77` (vs :205,231,240,258); `skills/agent-writing/SKILL.md:5` (vs :185,203)
- Expected: skill-writing's own rule (:90) — a read-only reference skill lists `Read, Grep, Glob, Bash`; a skill whose work edits files adds `Write, Edit`.
- Observed: both skills omit `Write, Edit` yet document procedures that CREATE `SKILL.md`/`{role}.md` and EDIT `.claude/settings.json` + `gobbi/SKILL.md`. Defensible reading: the authoring is performed by the loading role's tools (executor brings Write/Edit; symlink steps go through Bash) — but by the skills' own stated rule the mismatch is internal.
- Description: Adjacent to D2-028 (codex's "no write-surface section" for the same two skills), but a distinct claim (frontmatter `allowed-tools` vs documented action).
- Evidence: skill-writing/SKILL.md:90 "a skill whose work edits files adds `Write, Edit`"; :258 "create ... SKILL.md"; frontmatter :77 lists no Write/Edit.
- Proposed remediation: either add a one-line note that these are reference skills whose file-creating steps are performed by the loading role's tools, or add `Write, Edit` to match the documented procedure. Manager/user to adjudicate.
- Verification: the frontmatter `allowed-tools` and documented procedure are reconciled (note or tool-add).
- Disposition: open

### D2-040: Claude-only `AskUserQuestion` baked into a runtime-neutral skill + generated skills
- Severity: Low
- Confidence: 25
- Priority: low
- System: claude
- Dimension: D2 (D2.10)
- Owner-surface: skill
- Location: `skills/interview/SKILL.md:4`; `skills/interview/templates/project-skill.md:26`
- Expected: a runtime-neutral skill (interview body uses "the active runtime's user-decision primitive" throughout; body `AskUserQuestion` count = 0) should not bake a Claude-only tool into generated artifacts that downstream non-manager roles load.
- Observed: interview's frontmatter lists `AskUserQuestion` (Claude-only; Codex's primitive is `request_user_input`), and `project-skill.md:26` stamps `AskUserQuestion` into EVERY generated conventions skill — skills a leader/executor loads but should not invoke it from.
- Description: A permission ceiling, not a mandate, so impact is low; but a Claude-only token in a runtime-neutral surface. Relates to D2-021.
- Evidence: interview/SKILL.md:4 `allowed-tools: …, AskUserQuestion`; project-skill.md:26 `allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion`; interview body neutral-primitive phrasing (grep `AskUserQuestion` in body → 0).
- Proposed remediation: drop `AskUserQuestion` from the `project-skill.md` template default (a conventions skill never prompts), and/or note that interview's frontmatter `AskUserQuestion` is the Claude permission while the runtime-neutral primitive governs behavior.
- Verification: generated project skills no longer carry `AskUserQuestion` by default, or the runtime-neutral rationale is documented.
- Disposition: open

## Global load-graph reconciliation

Built from the union of all 12 chunk indices (skills-defined / load-edges-out / counts-claimed / handoff-edges). The 22 canonical skills: `agent-writing, claude-plugin, codex, coding, delegation, discussion, evaluation, execution, git, gobbi, ideation, interview, memory, mistake, orchestration, planning, preparation, principles, record, research, skill-writing, wrap-up`.

### Orphans (D2.4) — DEFINED with NO inbound load edge across ALL chunks
**Count: 0 true orphans.** Every one of the 22 skills has at least one verified inbound edge:
- Loop skills (ideation/preparation/planning/execution/wrap-up) — gobbi Skill Map + workflow/*.md + agent prompts.
- Cross-cutting (discussion/delegation/evaluation/record/mistake/git/codex/research/memory/principles) — agent Load-Directives + skill cross-refs.
- Supporting (interview/claude-plugin/agent-writing/skill-writing) — C3b orphan sweep confirmed all reachable (interview+claude-plugin via gobbi map / on-demand; agent-writing+skill-writing via the gobbi:217 value-feature paragraph + mutual cites).
- gobbi (entry), orchestration (manager + gobbi).
- **`coding` — the sole orphan CANDIDATE, REFUTED.** It has inbound edges from `claude-plugin/SKILL.md:254`, `coding/review.md`, `execution/evaluation.md:7`, `evaluation/SKILL.md:551`. It is therefore NOT an orphan — but it is absent from the gobbi Skill-Map discovery index (D2-029) and from the `.claude` runtime mirror (D2-010). Verified before declaring: every chunk that references `coding` was cross-checked.

### Dangling (D2.3) — load-edges whose target does not exist
Beyond the confirmed `skills/claude/SKILL.md` seed:
- delegation/SKILL.md → `.claude/hooks/post-tool-use-agents.sh`, `.claude/scripts/reconstruct-agents.sh` (wrong depth; targets exist at root) — **D2-022**.
- delegation/SKILL.md → `rules/docs-cleanup-parallelism.md` (absent everywhere) — **D2-023**.
- delegation/SKILL.md → `features/agents/backlogs/…session-json.md` (absent everywhere) — **D2-024**.
- orchestration/SKILL.md → `.claude/hooks/post-tool-use-agents.sh`, `.claude/scripts/reconstruct-agents.sh`, `.claude/hooks/session-end.sh` (wrong depth; targets exist at root) — **D2-017**.
- delegation/templates/executor.md → `skills/bun/SKILL.md`, `skills/typescript/SKILL.md` (absent) — **D2-025**.
- memory/rules.md → `diataxis.fr` (no scheme), `../../mistakes/design-literal-retire-instruction-without-replacement.md` (absent) — **D2-037** (backlog-tracked).
- `.claude/skills` mirror-local dangling: `coding/*` (**D2-010**), `gobbi/hook-authoring.md` (**D2-030**), `memory/memory-vocabulary.json` (**D2-031**), 13 scripts + `codex/task-metadata.md` (**D2-032**, divergent).
- Anchor-level (renderer-dependent): evaluation/SKILL.md:102, record/SKILL.md:91 (**D2-035**).
- All other load-edges across all 12 chunks RESOLVE (each chunk ran `test -e`/`check-markdown-links.sh`; C1b, C3a, C3b, C4 report 0 new dangling beyond the above + seeds).

### Dead-end handoffs (D2.5) — loop/phase whose successor is unnamed/unloadable
Consolidated dead-end class (the seed is instance 1):
- `Ideation → Preparation` — **confirmed seed** (instance 1; ideation.md:131 advances to Planning, skipping Preparation). Not re-filed.
- `Preparation → Planning` — no load directive (**D2-001**, codex Critical; Claude found NAMED — divergence).
- `Planning → Execution` — no load directive (**D2-002**, codex Critical; Claude found NAMED — divergence).
- `Execution(final task) → Wrap-up` — transition unstated (**D2-005**, claude+codex corroborated).
- `Execution EVALUATION → coding/evaluation.md` + `coding/review.md` — wiring deferred, no successor path (**D2-003**, codex Critical; **D2-036** claude stale-language angle).
- `Wrap-up → workflow.finish / session close` — correct TERMINAL, not a dead-end (verified by C1a, C1b, C1a-codex indices).

### Count drift — reconciled across all chunks
| Claim | Values found | Status |
|---|---|---|
| memory `type` enum | gobbi/SKILL.md:208 = **13**; memory/rules.md:258 + memory-map.md:78 + memory/SKILL.md:23 = **16** | DRIFT → **D2-033** (gobbi is the outlier) |
| memory subdirs | memory/SKILL.md:24 "README + 14 subdirs" | CANDIDATE — verify against 16-type model; not separately filed (flagged here) |
| EVALUATION-loop set | evaluation.md:3 = **4** (no Preparation); production.md:3 = **5**; gobbi/SKILL.md:141 = **5**; `.claude/CLAUDE.md` = **3** (no Preparation, no Wrap-up) | 3-WAY DRIFT → **D2-019** (merge-only) |
| canonical skills | claude-plugin = **22**; canonical dirs = **22**; `.agents/skills` = **22**; `.claude/skills` = **21** (missing `coding`) | DRIFT (mirror) → **D2-010** |
| principles | 10 everywhere (gobbi, manager.md, C3b grep, C4) | CONSISTENT — no drift |
| agent roles | 5 everywhere (C3b, C4, agent-writing) | CONSISTENT — no drift |
| perspectives | "7 + Overall" everywhere (C1a, C1b, C2, C3b, C4) | CONSISTENT — no drift |
| evaluators | "exactly 2, one per system" (C1a, C2, C4) | CONSISTENT — no drift |

## Cross-system divergence

**Cross-system corroborations (10 findings, System: claude+codex — the anti-groupthink signal at its strongest):** D2-005 (Execution→Wrap-up), D2-007 (staging writer-set contradiction), D2-010 (`.claude/skills/coding` missing — Claude raised it twice + Codex once), D2-022/D2-023/D2-024 (the three delegation broken links), D2-026 (record matrix omits staging surfaces), D2-030/D2-031/D2-032 (mirror omits child docs/scripts). When both independent systems land on the same defect at the same location, confidence is highest — these should be treated as the most reliable repairs.

**Single-system codex (14):** D2-001, D2-002, D2-003, D2-004, D2-006, D2-008, D2-009, D2-011, D2-014, D2-016, D2-017, D2-025, D2-028, D2-037. Codex's distinctive lens: workflow handoff continuity (the dead-end class D2-001/002/003), the uniform D2.2 operational-contract bar (D2-028), and intra-skill instruction/mistake contradictions (D2-014, D2-016).

**Single-system claude (16):** D2-012, D2-013, D2-015, D2-018, D2-019, D2-020, D2-021, D2-027, D2-029, D2-033, D2-034, D2-035, D2-036, D2-038, D2-039, D2-040. Claude's distinctive lens: mirror root-cause analysis (D2-015), count/enumeration drift (D2-019, D2-033), and frontmatter/anchor/slot micro-consistency (D2-020, D2-034, D2-035, D2-038).

**Notable substantive divergences (same location, opposite verdict — user must adjudicate):**
1. **Prep→Planning / Planning→Execution (D2-001, D2-002):** Codex = Critical dead-end (no load directive); Claude = NAMED, no defect. The crux: does "named successor without an explicit load directive" count as a dead-end? Resolving this also settles whether the seeded Ideation→Preparation gap is structurally unique or one of three.
2. **coding eval wiring (D2-003 vs D2-036):** Codex = Critical structural dead-end; Claude = Low stale-language. Both about `coding/evaluation.md` being deferred-but-referenced.
3. **mirror scripts (D2-032):** Codex = defect (mirror every exposed file); Claude = by-design (mirror docs, not scripts). The fix either way is to DOCUMENT the rule (D2-015 corollary).
4. **D2.2 operational sections (D2-028):** Codex applies a uniform "every skill needs Matrix/Outputs/Constraints/Exit" bar to 8 skills; Claude treats reference/discipline skills as implicitly-contracted and files none. A policy decision about the skill-authoring standard.
5. **memory/rules.md broken links (D2-037):** Codex = new High; Claude = already backlog-tracked (not new). A provenance disagreement, not a substance one.

## Confirmed-seed siblings

The 4 known seeds are instance-1 and NOT re-filed. Each seed's consolidated siblings:

| Seed (instance 1) | Sibling findings (same class) |
|---|---|
| `skills/claude/SKILL.md` dangling (gobbi/SKILL.md:192) | **D2-025** (executor template names absent `bun`/`typescript` skills — same "Load Directive cites a nonexistent skill" class). Mirror-completeness cousins: **D2-010**. |
| `delegation/SKILL.md` link broken (workflow/wrap-up.md:17 + execution.md:17) | **D2-022, D2-023, D2-024** (other broken links inside delegation/SKILL.md) + **D2-017** (the same `.claude` wrong-depth off-by-one in orchestration/SKILL.md). |
| `Ideation → Preparation` handoff gap | **D2-001** (Preparation→Planning), **D2-002** (Planning→Execution), **D2-005** (Execution→Wrap-up), **D2-003** (Execution EVALUATION→coding) — the full dead-end class. |
| research↔ideation `staging/references/` ownership contradiction (`mistakes/docs-sync/research-ideation-reference-staging-conflict.md`) | **D2-012** (research↔Preparation `staging/references/` — the new, un-recorded second instance). Structural root: **D2-007** (the `staging/` writer-set contradiction generally). |

## Related

- [[fix-d2-review-findings]] — the deferred fix queue sourced from this review (all 40 findings)
- [[d2-adversarial-review-executed]] — the session journal for this D2 pass
- [[review-handoff-d4-d6]] — the next-session handoff (D4 + D6 remain)
- [[gobbi-adversarial-review]] — cycle-1 review (D7 + D1, 40 findings)
- [[gobbi-adversarial-review-d3-d5]] — cycle-2 review (D3 + D5, 29 findings)
- [[adversarial-review-charter-authored]] — the charter this review executes against
- [[run-deep-adversarial-review]] — the parent charter-execution backlog
