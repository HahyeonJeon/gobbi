---
name: gobbi-adversarial-review-d4
description: D4 naming/conventions/counts/doc-style review (agents+skills) — 85 raw dual-system findings reconciled to 46, with global term+count reconciliation
type: reviews
scope: project
feature: null
status: active
created: 2026-06-29
session: 5ac6cf6e-aae6-4e28-85b3-e90b0a10aaaf
tags: [evaluation]
keywords: [adversarial-review, d4, merge, term-consistency, count-drift, dual-system]
author: claude
review_kind: adversarial-review
subject: "gobbi skills + agents surface (Dimension D4 — naming / conventions / counts / doc-style / quality)"
verdict: needs-attention
---

# D4 Adversarial Review — Naming / Conventions / Counts / Doc-style / Quality (consolidated merge)

## Review identity + scope

- **Dimension:** D4 — naming, term/Glossary consistency, self-reported counts, doc-style uniformity, doc↔path resolution, and dev-doc quality across the gobbi agent + skill surface.
- **Method:** dual-system adversarial review. Two independent systems (Claude + Codex) each reviewed the same surface in 6 budget-sized chunks (C1a orchestration entry + state machine; C1b the 5 loop skills; C2 cross-cutting skills; C3a memory + coding; C3b supporting/meta skills; C4 agent roster + mirrors). 12 partial-finding files total.
- **Raw input:** 85 findings (Claude 37: C1a=8, C1b=4, C2=7, C3a=6, C3b=6, C4=6; Codex 48: C1a=8, C1b=11, C2=8, C3a=7, C3b=9, C4=5).
- **This file:** the merge — pessimistic union, de-duplicated by (location + claim), stably ID'd `D4-001…D4-046`, ordered Severity (Critical→High→Medium→Low) then chunk. **46 consolidated findings; 7 cross-system-corroborated, 39 single-system (21 codex-only, 18 claude-only).** Plus the global cross-chunk term-consistency + count-drift reconciliation no single chunk could compute.
- **Cross-dimension dedup:** 10 candidate defects (15 raw partials) are already covered by the merged D2 review and are NOT re-filed here — see § Already covered by D2.
- **Seeds:** the confirmed doc-style/count seeds (claude-plugin 22-vs-19, memory 13-vs-16, the Preparation-dropped pattern, `loop's→loop.s`, anchor-drift, the `.claude`-depth link, the delegation broken-link seed) are NOT re-filed — see § Confirmed-seed siblings.

## Findings summary

| ID | Sev | System | D4.x | Owner | Location | One-line |
|---|---|---|---|---|---|---|
| D4-001 | High | claude+codex | D4.5 | workflow | gobbi/SKILL.md:141; orchestration/SKILL.md:259; auto-mode.md:210,284; delegation/SKILL.md:429; manager.md:142 | Eval mandatory/optional/skip policy framed inconsistently across ≥5 surfaces |
| D4-002 | High | codex (claude: by-design) | D4.8 | docs | gobbi/SKILL.md, hook-authoring, agent-teams, chat/auto-mode, execution/preparation/planning SKILL, delegation:17,422, executor.md:128, codex/claude-plugin/skill-writing/agent-writing, agents/*.md | Repo-root path refs (`.claude/`/`.agents/`/`.codex/`/`plugins/`/`scripts/`) don't resolve doc-relative; convention undeclared |
| D4-003 | High | codex | D4.8 | skill | planning/mistakes.md:31 | Runnable example cites missing `<PM>/scripts/check-skill-mistakes.sh` (real home is `skills/orchestration/scripts/`) |
| D4-004 | High | codex | D4.5 | skill | delegation/SKILL.md:355 | Evaluator anti-trust block forbids "cover multiple perspectives" — contradicts mandatory 7-perspective coverage |
| D4-005 | High | codex | D4.5 | skill | mistake/SKILL.md:24,95,99-101,130,143 | Mistake-capture write timing incompatible (matrix "PASS-only RECORD" vs P2 "immediate" vs P3 "RECORD on PASS") |
| D4-006 | High | claude | D4.5 | skill | skill-writing/SKILL.md:260-261 | Constraint "exactly three frontmatter keys … and no others" contradicts its own P1/P2 (optional official fields) |
| D4-007 | High | claude | D4.8 | skill | git/SKILL.md:325 | Stale line anchors for the `git -C` discipline (`executor.md:99-101`/`leader.md:112`; real `:107`/`:118`) |
| D4-008 | Medium | claude+codex | D4.2/D4.3 | workflow | chat-mode.md:91,511-529,552; orchestration/SKILL.md:245; auto-mode.md:115,133,151 | Non-Glossary tokens in phase/sub-phase/state slots (`InProgress`/`MEMO`/`EVAL`/`ITER/EXIT`/`PLAN_DRAFT`/`EXECUTION`/`WRAPUP`) |
| D4-009 | Medium | codex | D4.7 | workflow | chat-mode.md:22-28,319-321,379-390,583-586 | Normative prose embeds load-bearing session coordinates (session id, `L-P1/L-C2`, `iter1`, `R2/R3/R5`) |
| D4-010 | Medium | codex | D4.2 | workflow | ideation.md:98 vs :133 | Verdict text says "PASS or REVISE" while the same ITER/EXIT table handles `FAIL` |
| D4-011 | Medium | claude+codex | D4.3/D4.2 | skill | 5 loop SKILL.md:9 + every `## X Phase` header; research/SKILL.md:31 | DISCUSSION/WORK/EVALUATION/RECORD called "phases"/"## X Phase" vs Glossary "sub-phase" |
| D4-012 | Medium | codex | D4.2 | skill | wrap-up/SKILL.md:420 vs wrap-up/evaluation.md:176-177 | Handoff required-section contract disagrees (SKILL 6 incl. Promotion summary vs evaluation 5 incl. Next Actions) |
| D4-013 | Medium | codex | D4.3 | skill | wrap-up/evaluation.md:284 | Invents non-canonical disposition `still open` (canonical is `open`) |
| D4-014 | Medium | codex | D4.3 | skill | ideation/evaluation.md:255,279; preparation/evaluation.md:212 | Non-canonical role names `Planner` / `Plan agent` (no such role) |
| D4-015 | Medium | codex | D4.3 | skill | wrap-up/mistakes.md:8,12 | Non-canonical phase spellings `Wrap-Up` / `Wrap Up` (canonical `Wrap-up`) |
| D4-016 | Medium | codex | D4.3 | skill | delegation/SKILL.md:58,300,427; templates/leader.md:8 | `research` / `Research` used as a phase / sub-phase value |
| D4-017 | Medium | claude+codex | D4.4/D4.2 | skill | evaluation/SKILL.md:27-39 | "Three-Tier Memory Access Matrix" header labels a 7-row table; peers use unqualified name |
| D4-018 | Medium | claude | D4.8 | skill | evaluation/SKILL.md:118 | Stale self-citation `evaluation/SKILL.md:385-393` for the Slug+collision policy (actual §392-400) |
| D4-019 | Medium | claude+codex | D4.7/D4.2 | memory | rules.md §4.2 (:367) vs templates/design.md:50-71 | §4.2 gives `design` the ADR shape, but the design template body differs entirely |
| D4-020 | Medium | codex | D4.2 | memory | memory-map.md:121,125,141 vs rules.md:37,40 | Date-prefixed types (notes/changelogs/discussions) shown with bare `{slug}.md`, dropping the `YYYY-MM-DD-` prefix |
| D4-021 | Medium | codex | D4.2 | memory | templates/archive.md:27,38 vs rules.md:235,238-239 | Archive template lists non-enum backlog terminal states + says reviews/reports supersede via `status:` (only `active`) |
| D4-022 | Medium | codex | D4.2 | memory | templates/feature.md:147 vs templates/archive.md:53 | Retired-feature archive destination conflicts (whole dir vs dated README file) |
| D4-023 | Medium | claude+codex | D4.8/D4.7/D4.6 | skill | codex/SKILL.md:243,329,297,396 | codex/SKILL.md reference rot: missing mistake file, vanished session record, stale `Section 2(d)` ×2 |
| D4-024 | Medium | codex | D4.2 | skill | codex/SKILL.md:358-359 | "8 per-perspective output files (one per evaluation perspective)" counts Overall as a perspective |
| D4-025 | Medium | claude+codex | D4.2 | agent | gobbi/SKILL.md:155; delegation/SKILL.md:430,61; assistant.md:3 | Assistant taxonomy/frontmatter says "Read-only" / "bounded to session staging" — it is the sole memory writer |
| D4-026 | Medium | claude | D4.8/D4.2 | agent | manager.md:35 | Cites a `gobbi workflow init` CLI that does not exist (contradicts the markdown-driven/no-CLI model) |
| D4-027 | Medium | claude | D4.8 | agent | executor.md:61,89,130-136 | Targets an absent TypeScript/Bun codebase (`packages/cli/`, `bun test`, "2197/0") |
| D4-028 | Low | claude | D4.4 | workflow | preparation.md:34 vs :36-41 | "five sub-steps" prose vs a four-row (A–D) table |
| D4-029 | Low | claude | D4.4/D4.2 | skill | orchestration/SKILL.md:50-58 | "The five agent types divide into two classes" but the table classifies only four |
| D4-030 | Low | claude | D4.3 | skill | gobbi/SKILL.md:108-124 | Glossary has no `Stage` entry / Wrap-up stage names it is treated as owning |
| D4-031 | Low | codex | D4.4 | hook | hook-authoring.md:7-8,271-272 | Hook script line counts stale (`79`/`251` vs live `82`/`305`) |
| D4-032 | Low | codex | D4.4 | workflow | auto-mode.md:64 vs orchestration/SKILL.md:104-108 | Auto Mode cites a four-row Configuration that is now five rows (omits `Init Record Skeleton`) |
| D4-033 | Low | claude | D4.5/D4.4 | skill | planning/SKILL.md:435,446 vs :459-460,493 | `artifact_type: dependencies` mandated in prose but absent from PASS checklist + Output-paths mandatory line |
| D4-034 | Low | codex | D4.1 | skill | record/SKILL.md:144; planning/SKILL.md:300 | Docs teach/permit banned slugs (`framed-problem-iter2.md`/`-v2.md`; `plans/main.md`) |
| D4-035 | Low | codex | D4.6 | skill | preparation/evaluation.md:1-7 | Lone YAML frontmatter among the 5 sibling `evaluation.md` child docs |
| D4-036 | Low | codex | D4.6 | skill | ideation/SKILL.md:426 | `each agent.s raw transcript` — apostrophe corrupted to a period |
| D4-037 | Low | claude | D4.6 | skill | execution:73,107 + wrap-up:98,131 vs ideation/preparation/planning | Phase-header parenthetical annotation drift across the 5-sibling heading ladder (advisory) |
| D4-038 | Low | claude | D4.4 | memory | memory-vocabulary.json:2 | `$schema`-note blames `archive` for the 16→15 type-key gap; the real exception is `features` |
| D4-039 | Low | claude | D4.4 | skill | coding/SKILL.md:318 vs :301-316 | Appendix coverage-check line contradicts its own traceability table (P2/P3 inverse map) |
| D4-040 | Low | claude | D4.2 | memory | rules.md:368; templates/mistakes.md:49-62 vs :101-104,120; mistakes.md:16-19 | `mistakes` 4-element ORDER differs between memory-tier contract and skill-surface schema |
| D4-041 | Low | codex | D4.4 | memory | templates/feature.md:38 | "features/workflow/ currently has 8 subdirs + README" — live count is 9 |
| D4-042 | Low | claude | D4.4 | skill | claude-plugin/SKILL.md:243 vs :193,226,241 | `Hooks (3)` left un-reconciled beside the doc's "4 event groups" claim |
| D4-043 | Low | codex | D4.6 | skill | principles/SKILL.md:7 | Skips the canonical `# Title` H1 (starts at `## Principle 1`) |
| D4-044 | Low | claude | D4.6 | skill | codex/SKILL.md:3 | `description` opens "Use **for** …" vs skill-writing's prescribed `Use when` / `Load when` |
| D4-045 | Low | claude | D4.4/D4.2 | skill | agent-writing/SKILL.md:127 | Continuable roles "(executor, leader)" omits the assistant (2 of 3) |
| D4-046 | Low | claude | D4.6 | agent | evaluator.md:34,37 | Lists `evaluation/SKILL.md` twice in the mandatory "Before You Start" load ladder |

## Findings

### D4-001: Evaluation mandatory/optional/skip policy is stated inconsistently across surfaces
- Severity: High / Confidence: 100 / Priority: high / System: claude+codex / Dimension: D4 (D4.5) / Owner-surface: workflow
- Location: `skills/gobbi/SKILL.md:141`; `skills/orchestration/SKILL.md:255-259`; `skills/orchestration/auto-mode.md:201,210,284-285`; `skills/delegation/SKILL.md:429`; `agents/manager.md:142`
- Expected: one consistent statement of which loops MUST run EVALUATION and where `evaluate.mode: skip` is permitted — mandatory after Execution + Wrap-up, optional at Ideation/Preparation/Planning per the orchestration setting.
- Observed: gobbi/SKILL.md:141 calls Ideation/Preparation/Planning eval "optional" while auto-mode §7.1 says EVALUATION is "mandatory and never a question … on every loop" with `evaluate.mode (all loops) = always` "not overridden at the session level"; orchestration/SKILL.md:259 lets `evaluate.mode == 'skip'` bypass EVALUATION generically (no Execution/Wrap-up guard); delegation/SKILL.md:429 says "mandatory after Execution; optional after Ideation / Planning" (drops Preparation AND mandatory Wrap-up); manager.md:142 names only Execution mandatory. Only the Wrap-up loop documents its own status in-skill, and only Wrap-up's eval section emphatically states non-skippability — the other four loops' EVALUATION sections are silent (claude C1b-02).
- Description: Five surfaces give four different mandatory/optional/skip framings for the same policy. Distinct from D2-019, which covers the loop-SET enumeration count drift; this is the mandatory/optional/skip POLICY framing + the skip-mechanism scope.
- Evidence: gobbi/SKILL.md:141 "optional after Ideation / Preparation / Planning"; auto-mode.md:285 "runs dual-system EVALUATION on every loop"; orchestration/SKILL.md:259 "If `evaluate.mode == 'skip'`, the loop bypasses `EVALUATION`"; delegation/SKILL.md:429 "mandatory after Execution; optional after Ideation / Planning"; manager.md:142 "Evaluation after Execution is mandatory. Optional at earlier phases".
- Proposed remediation: pick the canonical policy (mandatory after Execution+Wrap-up; optional earlier per `evaluate.mode`; `skip` rejected for Execution+Wrap-up) and restate it identically at all five sites; add a one-line status to each loop's EVALUATION Purpose.
- Verification: all five surfaces enumerate the same mandatory/optional/skip policy; `evaluate.mode: skip` is documented as inert for Execution + Wrap-up.
- Disposition: open

### D4-002: Repo-root-relative path references in skill + agent docs do not resolve doc-relative; the convention is undeclared
- Severity: High / Confidence: 75 / Priority: high / System: codex (Claude divergence: by-design) / Dimension: D4 (D4.8) / Owner-surface: docs
- Location: `gobbi/SKILL.md:41,67`; `gobbi/hook-authoring.md:7-8,47-53`; `orchestration/agent-teams.md:50-56,187-189`; `chat-mode.md:603-605`; `auto-mode.md:410-412`; `execution/SKILL.md:37`; `preparation/SKILL.md:100,186`; `planning/SKILL.md:241`; `delegation/SKILL.md:17,422`; `delegation/templates/executor.md:128`; `codex/SKILL.md:91-94`; `claude-plugin/SKILL.md:206-219`; `skill-writing/SKILL.md:193,220,224`; `agent-writing/SKILL.md:193-218`; `agents/manager.md:14,36-40`; `agents/evaluator.md:39,43`; `agents/assistant.md:19-20`
- Expected: a path / command reference in a doc resolves from the doc's own directory, OR the doc explicitly marks it as repo-root-relative and states the resolver convention.
- Observed: across ~15 skill/agent docs, bare references to runtime mirrors (`.claude/`, `.agents/`, `.codex/`, `plugins/gobbi/`) and to repo-root scripts (`scripts/sync-plugin-package.sh`, `scripts/check-codex-plugin-smoke.sh`) exist only at the worktree root — `test -e` from each owning doc's directory reports MISSING, while the root copies are OK. No doc declares whether these are repo-root or doc-relative. Agent prompts additionally cite logical skill names (`delegation/SKILL.md`, `record/SKILL.md`) that read like paths but are Load-Directive logical names.
- Description: A systemic D4.8 path-convention gap. **Cross-system divergence:** Codex files this across C1a-05/C1b-07/C2-06/C3b-03/C4-03/C4-05 as a defect; Claude (C3b doc-path-refs note) classified the same behavior as "Cross-cutting mirror-build behavior, not a per-doc defect — noted, not filed" (consumers `readlink` to canonical first). The specific wrong-DEPTH markdown links (orchestration:108/324/330, delegation:292/309) are EXCLUDED — they are D2-017/D2-022.
- Evidence: `test -e "$docdir/.claude/…"` / `"$docdir/scripts/sync-plugin-package.sh"` → MISSING from each owning dir; root copies → OK (codex C1a-05/C1b-07/C2-06/C3b-03/C4-05 traces).
- Proposed remediation: decide ONE convention. Either rewrite as doc-relative paths, or declare a repo-root path convention once (e.g., in skill-writing/agent-writing) and mark these references as repo-root commands / logical names — making the resolution intentional-and-stated.
- Verification: a documented convention exists and a doc-path resolver (or stated exemption) agrees with every such reference.
- Disposition: open

### D4-003: Planning mistake example cites a missing `<PM>/scripts/check-skill-mistakes.sh`
- Severity: High / Confidence: 100 / Priority: high / System: codex / Dimension: D4 (D4.8) / Owner-surface: skill
- Location: `skills/planning/mistakes.md:31`
- Expected: a script path in a runnable example resolves to an existing script.
- Observed: the example runs `bash <PM>/scripts/check-skill-mistakes.sh <file>`, but `<PM>/scripts/check-skill-mistakes.sh` does not exist — the script lives at `skills/orchestration/scripts/check-skill-mistakes.sh`.
- Description: a copy-pasteable example points at a nonexistent path, so a reader following it fails.
- Evidence: `test -e .../scripts/check-skill-mistakes.sh` → MISSING; `find -L . -path '*check-skill-mistakes.sh'` → `skills/orchestration/scripts/check-skill-mistakes.sh`.
- Proposed remediation: repoint the example to the actual orchestration script path.
- Verification: the example path resolves.
- Disposition: open

### D4-004: Evaluator anti-trust block forbids the required multi-perspective coverage
- Severity: High / Confidence: 100 / Priority: high / System: codex / Dimension: D4 (D4.5) / Owner-surface: skill
- Location: `skills/delegation/SKILL.md:349-357` (line 355)
- Expected: evaluator instructions require all seven perspectives + Overall without prohibiting multi-perspective coverage.
- Observed: the anti-trust boilerplate's `DO NOT:` list includes "cover multiple perspectives", while evaluation/SKILL.md:100 mandates "Every evaluation runs all seven perspectives + Overall. No pruning." A literal reader is told both to cover and not to cover multiple perspectives.
- Description: the prohibition almost certainly intends "blend perspectives" (per `templates/evaluator.md`), but as written it negates the mandatory coverage.
- Evidence: delegation/SKILL.md:355 "…; cover multiple perspectives; propose fixes."; evaluation/SKILL.md:100 "all seven perspectives + Overall. No pruning."
- Proposed remediation: replace "cover multiple perspectives" with the intended "blend perspectives," matching the evaluator template.
- Verification: the anti-trust list no longer forbids covering the required perspective set.
- Disposition: open

### D4-005: Mistake-capture write timing is mutually incompatible across the mistake skill
- Severity: High / Confidence: 100 / Priority: high / System: codex / Dimension: D4 (D4.5) / Owner-surface: skill
- Location: `skills/mistake/SKILL.md:24,95,99-101,130,143`
- Expected: one obeyable capture path + timing for working-loop agents.
- Observed: the Memory Access Matrix (:24) says session staging is writable "WRITE (PASS only, during RECORD)"; P2 (:95) and Constraints (:130) say write/stage the candidate "immediately — do not defer to RECORD"; P3 (:99-101) and the output table (:143) then say the staging file is written during RECORD on PASS. A working-loop agent cannot satisfy all three.
- Description: same class as D2-007 but a different doc (mistake/SKILL.md, not record/SKILL.md) — the "immediate note" vs "RECORD staging" surfaces are not reconciled.
- Evidence: mistake/SKILL.md:24 "WRITE (PASS only, during RECORD)"; :95 "Write the candidate note immediately — do not defer to RECORD"; :101 "during RECORD … write a staging file"; :143 "assistant (RECORD) | PASS only".
- Proposed remediation: split the "immediate note" surface from the "RECORD staging" surface with a concrete immediate write target, OR make RECORD the sole write and drop the immediate-staging mandate — then align all five sites.
- Verification: the matrix, P2, P3, and Constraints name one consistent capture surface + timing.
- Disposition: open

### D4-006: skill-writing "exactly three frontmatter keys … and no others" contradicts its own P1/P2
- Severity: High / Confidence: 100 / Priority: high / System: claude / Dimension: D4 (D4.5) / Owner-surface: skill
- Location: `skills/skill-writing/SKILL.md:260-261` vs `:66-71` (P1) and `:99-114` (P2)
- Expected: the mandatory Constraints floor agrees with the procedure on whether the frontmatter key set is closed.
- Observed: Constraint L260-261 says "MUST carry exactly the three frontmatter keys … and no others"; P1 (:70-71) calls the three "the baseline, not a closed set" and allows optional official fields `user-invocable` / `disable-model-invocation`, which P2's table instructs the author to SET. A reader obeying the Constraint would never add the key P2 mandates.
- Description: the EXACT recorded `verify-dont-assert-taught-facts` trap recurring in the skill that teaches skills. (All 22 live skills currently carry 3 keys, so it is a self-inconsistency, not yet a factual miss.)
- Evidence: skill-writing/SKILL.md:260-261 "exactly the three frontmatter keys … and no others"; :70-71 "the three below are the baseline, not a closed set".
- Proposed remediation: reword L260-261 to "MUST carry the three STANDARD keys … plus only the official optional fields when non-default behavior is needed — and no ad-hoc keys."
- Verification: the Constraint and P1/P2 agree the key set is base-plus-official-optional, not closed-at-three.
- Disposition: open

### D4-007: git/SKILL.md cites stale line anchors for the `git -C` discipline
- Severity: High / Confidence: 100 / Priority: high / System: claude / Dimension: D4 (D4.8) / Owner-surface: skill
- Location: `skills/git/SKILL.md:325`
- Expected: the cited anchors resolve to the lines carrying the `git -C <worktree-abs>` rule.
- Observed: L325 cites "`agents/executor.md:99-101`, `agents/leader.md:112`" but the `git -C` rule is at `executor.md:107` and `leader.md:118`; `:99-101`/`:112` are the `## Continuation discipline` heading + intro. Both refs are stale by ~6-7 lines.
- Description: the recorded `verify-state-from-authoritative-source-not-proxy` trap (Instance 2: stale line anchor).
- Evidence: `grep -n 'git -C' agents/executor.md` → 107; `… leader.md` → 118; `sed -n '99,101p' executor.md` shows the Continuation-discipline heading.
- Proposed remediation: repoint to `executor.md:107` / `leader.md:118`, or cite the `## Continuation discipline` section by name (drift-robust).
- Verification: both anchors resolve to the `git -C` lines.
- Disposition: open

### D4-008: Non-Glossary tokens appear in phase/sub-phase/state slots
- Severity: Medium / Confidence: 100 / Priority: medium / System: claude+codex / Dimension: D4 (D4.2/D4.3) / Owner-surface: workflow
- Location: `chat-mode.md:91,511-529,515,552`; `orchestration/SKILL.md:245`; `auto-mode.md:115,133,151`
- Expected: state slots carry the canonical loop-state enum (`Pending/Active/Revising/Done/Skipped/Aborted`) and phase slots carry the canonical sub-phases (`DISCUSSION/WORK/EVALUATION/RECORD`); work verbs and iteration routing are not stored as phase values.
- Observed: chat-mode.md uses `InProgress` (~21 sites) as a synonym for the canonical state `Active` and renders `▸ InProgress` (claude); chat-mode.md:91,515 use `MEMO` (the pre-rename RECORD name) + `EVAL` (claude + codex corroborate `MEMO`); orchestration/SKILL.md:245 stores `ITER/EXIT` as a phase, and auto-mode.md:115/133/151 use `PLAN_DRAFT`/`EXECUTION`/`WRAPUP` as Phase-table values (codex). The repo's own `check-residual-vocab.sh` targets `MEMORIZATION` but matches `\bMEMORIZATION\b`, so the shorter `MEMO` slips past.
- Description: corroborated on `MEMO`; the `InProgress` and `ITER/EXIT`/`PLAN_DRAFT`/`EXECUTION`/`WRAPUP` sites are single-system. All are "a canonical-vocabulary slot carrying a non-canonical token."
- Evidence: orchestration/SKILL.md:245 "`state` ∈ Pending/Active/Revising/Done/Skipped/Aborted"; chat-mode.md:512 "ideation.state: InProgress"; chat-mode.md:515 "no DISCUSSION/WORK/EVAL/MEMO rows run"; auto-mode.md:115/133/151 Phase values `PLAN_DRAFT`/`EXECUTION`/`WRAPUP`.
- Proposed remediation: `InProgress`→`Active`, `MEMO`→`RECORD`, `EVAL`→`EVALUATION`; express `ITER/EXIT` and work verbs as action/state labels outside the phase/sub-phase vocabulary.
- Verification: every phase/sub-phase/state slot carries only a Glossary value.
- Disposition: open

### D4-009: chat-mode.md embeds load-bearing session coordinates in normative prose
- Severity: Medium / Confidence: 75 / Priority: medium / System: codex / Dimension: D4 (D4.7) / Owner-surface: workflow
- Location: `skills/orchestration/chat-mode.md:22-28,319-321,379-390,583-586`
- Expected: dev-doc prose is understandable without originating-session coordinates (memory/rules.md:341-347).
- Observed: the doc relies on session id `2026-05-28-8eed14fb`, old line coordinates, a `CORRECTION annotation`, `iter1`, `L-P1/L-C2/L-U1`, `D-A`, and `R2/R3/R5` labels — none resolvable by a zero-context reader.
- Description: load-bearing session-only coordinates in an evergreen workflow doc.
- Evidence: chat-mode.md:25 names session `2026-05-28-8eed14fb`; :320 cites "§8 L-P1/L-C2/L-U1"; rules.md:341-347 "zero-context docs need no originating session."
- Proposed remediation: replace session-local labels with self-contained rationale; move provenance to a single `## Source` footer if needed.
- Verification: no body reference requires the originating session to resolve.
- Disposition: open

### D4-010: Ideation verdict text excludes `FAIL` while the same doc handles it
- Severity: Medium / Confidence: 100 / Priority: medium / System: codex / Dimension: D4 (D4.2) / Owner-surface: workflow
- Location: `skills/orchestration/workflow/ideation.md:98,129-134`
- Expected: verdict vocabulary stays `PASS` / `REVISE` / `FAIL`.
- Observed: ideation.md:98 says "Verdict is `PASS` or `REVISE`," but the same ITER/EXIT table (:133) includes a `FAIL` row.
- Evidence: gobbi/SKILL.md:118 defines "PASS / REVISE / FAIL"; ideation.md:98 "PASS or REVISE"; ideation.md:133 `| FAIL | Escalate… |`.
- Proposed remediation: state that Ideation can emit `PASS` / `REVISE` / `FAIL`, calling out any phase-specific handling separately.
- Verification: the verdict prose and the table agree on the three-value enum.
- Disposition: open

### D4-011: The four loop sub-phases are called "phases" / "## X Phase" against the Glossary "sub-phase"
- Severity: Medium / Confidence: 100 / Priority: medium / System: claude+codex / Dimension: D4 (D4.3/D4.2) / Owner-surface: skill
- Location: `ideation/SKILL.md:9`, `preparation/SKILL.md:9`, `planning/SKILL.md:9`, `execution/SKILL.md:9`, `wrap-up/SKILL.md:9` + every `## DISCUSSION/WORK/EVALUATION/RECORD Phase` header; `research/SKILL.md:31`
- Expected: per the Glossary (gobbi/SKILL.md:116), DISCUSSION/WORK/EVALUATION/RECORD are **sub-phases**.
- Observed: all 5 loop skills' line-9 intro says "each of the four phases" and every section header is `## X Phase`, yet each same file ALSO calls them "sub-phase" in its RECORD callout (intra-file split); research/SKILL.md:31 says "the assistant (RECORD phase)". Compounded in execution/SKILL.md, where "phase" is also the executor 5-step lifecycle (Study→…→Commit).
- Description: glossary deviation + intra-file term split, uniform across all 5 loops (claude) plus research (codex).
- Evidence: gobbi/SKILL.md:116 "Sub-phase | One of the 4 phases inside a loop…"; ideation/SKILL.md:9 "the four phases"; ideation/SKILL.md:408 "RECORD is the per-loop capture sub-phase"; research/SKILL.md:31 "RECORD phase".
- Proposed remediation: pick one term and sweep all 5 loop intros + headers + research (rename to "sub-phase"/"## X Sub-phase", OR amend the Glossary if "Phase" is the deliberate in-loop convention).
- Verification: the loop intros/headers + research use one consistent term aligned with the Glossary.
- Disposition: open

### D4-012: Wrap-up handoff required-section contract disagrees between SKILL and its evaluation child
- Severity: Medium / Confidence: 100 / Priority: medium / System: codex / Dimension: D4 (D4.2) / Owner-surface: skill
- Location: `skills/wrap-up/SKILL.md:420`; `skills/wrap-up/evaluation.md:176-177`
- Expected: the handoff artifact has one required-section contract used by producer + evaluator.
- Observed: SKILL.md:420 requires six sections (Summary, Shipped, Deferred / Open, Decisions to respect, Pointers, Promotion summary); evaluation.md:177 checks five (Summary / Shipped / Open Items / Next Actions / Pointers). The names and counts diverge.
- Evidence: wrap-up/SKILL.md:420 lists 6 incl. "Promotion summary"; wrap-up/evaluation.md:177 lists 5 incl. "Open Items / Next Actions".
- Proposed remediation: pick one section contract and make both docs use it verbatim.
- Verification: producer + evaluator name the identical required-section set.
- Disposition: open

### D4-013: Wrap-up evaluation invents the non-canonical disposition `still open`
- Severity: Medium / Confidence: 100 / Priority: medium / System: codex / Dimension: D4 (D4.3) / Owner-surface: skill
- Location: `skills/wrap-up/evaluation.md:284`
- Expected: dispositions match the canonical set `open / addressed / disputed / deferred / superseded` (gobbi/SKILL.md:119).
- Observed: the closure audit lists "still open" as a disposition value.
- Evidence: wrap-up/evaluation.md:284 "one of five dispositions: … / still open"; gobbi/SKILL.md:119 "open / addressed / disputed / deferred / superseded".
- Proposed remediation: replace `still open` with `open`.
- Verification: the disposition list matches the canonical five.
- Disposition: open

### D4-014: Evaluation frames use non-canonical `Planner` / `Plan agent` role names
- Severity: Medium / Confidence: 100 / Priority: medium / System: codex / Dimension: D4 (D4.3) / Owner-surface: skill
- Location: `skills/ideation/evaluation.md:255,279`; `skills/preparation/evaluation.md:212`
- Expected: role names match the taxonomy (manager / leader / executor / evaluator / assistant).
- Observed: the evaluation frames use `Planner` and `Plan agent`; no such role exists.
- Evidence: ideation/evaluation.md:279 "No 'the Planner' vs 'the Plan agent' oscillation"; canonical roles gobbi/SKILL.md:151-155.
- Proposed remediation: use `Planning leader` / `leader` consistently; drop the invented labels.
- Verification: no `Planner` / `Plan agent` remains in the evaluation frames.
- Disposition: open

### D4-015: Wrap-up mistakes file uses non-canonical `Wrap-Up` / `Wrap Up` spellings
- Severity: Medium / Confidence: 100 / Priority: medium / System: codex / Dimension: D4 (D4.3) / Owner-surface: skill
- Location: `skills/wrap-up/mistakes.md:8,12`
- Expected: the canonical phase name is `Wrap-up`.
- Observed: the title is `# Wrap-Up — Mistakes` (:8) and a heading reads `## Wrap Up Green Check …` (:12).
- Evidence: wrap-up/mistakes.md:8,12; canonical `gobbi/SKILL.md:139 | **Wrap-up** |`.
- Proposed remediation: normalize to `Wrap-up` in the title + heading (the heading slug used by `check-skill-mistakes.sh` anchors changes — repoint any inbound anchor).
- Verification: the file uses `Wrap-up` consistently.
- Disposition: open

### D4-016: `research` is used as a phase / sub-phase value
- Severity: Medium / Confidence: 100 / Priority: medium / System: codex / Dimension: D4 (D4.3) / Owner-surface: skill
- Location: `skills/delegation/SKILL.md:58,300,427`; `skills/delegation/templates/leader.md:8`
- Expected: `phase` values are Glossary phases; sub-phases are DISCUSSION/WORK/EVALUATION/RECORD. `research` is a skill, not a phase.
- Observed: delegation uses `Research` as a sub-phase and `research` as a `Your phase:` value.
- Evidence: gobbi/SKILL.md:112-116 phase/sub-phase enums; delegation/SKILL.md:58,300,427 + templates/leader.md:8 use `research` as a phase/sub-phase value.
- Proposed remediation: treat research as a skill / task kind / sub-step under a canonical phase, not a phase value.
- Verification: no phase/sub-phase slot carries `research`.
- Disposition: open

### D4-017: "Three-Tier Memory Access Matrix" header labels a 7-row table
- Severity: Medium / Confidence: 100 / Priority: medium / System: claude+codex / Dimension: D4 (D4.4/D4.2) / Owner-surface: skill
- Location: `skills/evaluation/SKILL.md:27-39`
- Expected: a numeric header matches its table, and the section name matches the cross-skill convention.
- Observed: the header says "Three-Tier" but the `Memory tier` column has 7 rows (own perspective dir / prior iter / current-loop working+staging / prior loops / session.json / feature memory / memory), and the body never enumerates three conceptual tiers. Peers (record/mistake/git) all use the unqualified "## Memory Access Matrix".
- Evidence: evaluation/SKILL.md:27 "## Three-Tier Memory Access Matrix"; rows 33-39 = 7; record/SKILL.md:32 "## Memory Access Matrix".
- Proposed remediation: rename to "## Memory Access Matrix" (match peers), or add a "three tiers = {session record, feature memory, memory}" gloss so the count is legible.
- Verification: the header no longer makes an unsatisfied numeric claim.
- Disposition: open

### D4-018: evaluation/SKILL.md carries a stale self-citation for the Slug+collision policy
- Severity: Medium / Confidence: 95 / Priority: medium / System: claude / Dimension: D4 (D4.8) / Owner-surface: skill
- Location: `skills/evaluation/SKILL.md:118`
- Expected: the cited line range bounds the "### Slug + collision policy" section.
- Observed: the Coverage Ownership Matrix cell cites "`evaluation/SKILL.md:385-393`", but the heading is at line 392 and the section runs ~392-400; 385-391 is the tail of the Domain-routing table. The range points mostly at the wrong content and truncates the section.
- Description: same class as the recorded stale-line-anchor trap.
- Evidence: `grep -n '### Slug + collision policy'` → 392; `sed -n '384,393p'` shows the routing-table tail.
- Proposed remediation: change the citation to `evaluation/SKILL.md § Slug + collision policy` (rename-robust) or the corrected range 392-400.
- Verification: the citation resolves to the slug policy section.
- Disposition: open

### D4-019: rules.md §4.2 gives `design` the ADR contract, but the design template body differs
- Severity: Medium / Confidence: 100 / Priority: medium / System: claude+codex / Dimension: D4 (D4.7/D4.2) / Owner-surface: memory
- Location: `skills/memory/rules.md:367` vs `skills/memory/templates/design.md:50-71`
- Expected: §4.2 says "the promoted body matches its type's template contract," so the §4.2 `design` row must equal the design template body.
- Observed: §4.2 gives `design` the ADR shape (`Context → Decision/Approach → Rationale → Alternatives considered → Consequences`), but `templates/design.md` is `Problem → Scope → Approach → Scenarios → Validation → Trade-offs → Open issues`. Only `Approach` overlaps. (`decisions` in the same row DOES match its template; `design` does not.)
- Evidence: rules.md:367 ADR shape; `grep '^## ' templates/design.md` → Problem/Scope/Approach/Scenarios/Validation/Trade-offs/Open issues.
- Proposed remediation: split the §4.2 row — give `design` its own contract matching `templates/design.md`; keep `decisions` on the ADR shape.
- Verification: §4.2's `design` contract equals the design template body.
- Disposition: open

### D4-020: memory-map.md drops the required date prefix on date-prefixed types
- Severity: Medium / Confidence: 100 / Priority: medium / System: codex / Dimension: D4 (D4.2) / Owner-surface: memory
- Location: `skills/memory/memory-map.md:121,125,141`
- Expected: `notes`, `changelogs`, `discussions` paths use `YYYY-MM-DD-{slug}.md` (rules.md §1.2).
- Observed: the durable path index lists those date-prefixed types as bare `{slug}.md` (`…/discussions/{area}/{slug}.md`, `…/changelogs/{area}/{slug}.md`, `notes/{area}/{slug}.md`).
- Evidence: rules.md:37,40 mark them date-prefixed; memory-map.md:121/125/141 show bare `{slug}.md`.
- Proposed remediation: update the path rows to the `{area}/{YYYY-MM-DD}-{slug}.md` shape.
- Verification: memory-map's date-prefixed-type rows carry the date prefix.
- Disposition: open

### D4-021: Archive template mixes status-enum values with archive reasons
- Severity: Medium / Confidence: 100 / Priority: medium / System: codex / Dimension: D4 (D4.2) / Owner-surface: memory
- Location: `skills/memory/templates/archive.md:21-38,60-78` vs `skills/memory/rules.md:226-239`
- Expected: terminal `status` values match each type's status enum; `archive_reason` is a separate field.
- Observed: archive.md:27 lists `backlogs/` terminal states `shipped / closed / addressed / dropped` (only `open/deferred/closed` are valid), and archive.md:38 says reviews/reports "supersede via `status:`" although their only status is `active`.
- Evidence: rules.md:235 "backlogs | open | deferred | closed"; :238-239 reviews/reports `active`; archive.md:27,38.
- Proposed remediation: separate terminal status from archive reason; align archive wording to each type's status enum.
- Verification: archive.md uses only enum-valid status values and a distinct `archive_reason`.
- Disposition: open

### D4-022: Retired-feature archive destination conflicts between feature.md and archive.md
- Severity: Medium / Confidence: 100 / Priority: medium / System: codex / Dimension: D4 (D4.2) / Owner-surface: memory
- Location: `skills/memory/templates/feature.md:147` vs `skills/memory/templates/archive.md:40-53`
- Expected: retired features have one canonical archive destination shape.
- Observed: feature.md:147 says the entire feature directory is `git mv`'d to `archive/features/{feature-name}/`; archive.md:53 says archive stores a dated feature README file `features/{YYYY-MM-DD}-{feature-name}.md`.
- Evidence: feature.md:147 (whole dir); archive.md:40 "features/ are not by-area types"; archive.md:53 (dated README file).
- Proposed remediation: choose directory-archive or README-file-archive and reconcile the other doc.
- Verification: both templates name one retired-feature archive shape.
- Disposition: open

### D4-023: codex/SKILL.md carries multiple dangling / stale internal references
- Severity: Medium / Confidence: 100 / Priority: medium / System: claude+codex / Dimension: D4 (D4.8/D4.7/D4.6) / Owner-surface: skill
- Location: `skills/codex/SKILL.md:243,329,297,396`
- Expected: provenance citations resolve to a real file or a stable heading.
- Observed: (a) :243 cites recorded mistake `codex-eval-session-write-path-nested-in-worktree.md` — exists nowhere in `mistakes/` or `archive/` (claude C3b-04); (b) :329 cites a `sessions/2026-05-23-…/planning/staging/decisions/…` record that resolves from neither doc nor root (codex C3b-07, a D4.7 session-coordinate leak); (c) :297 and :396 cite "Section 2(d)", but no such heading exists (the sections are `### Dual-System Evaluation`, `### (a) Dual-system evaluator spawn`) (codex C3b-08).
- Description: three reference-rot defects in one durable skill; the lessons are inlined, so no content is lost, but the citations are undiscoverable.
- Evidence: `find -name 'codex-eval-session-write-path*'` → only the citer; `test -e sessions/2026-05-23-…` → MISSING; `rg '^(##|###) ' codex/SKILL.md` shows no `2(d)`.
- Proposed remediation: repoint :243 to the surviving home (likely `skills/codex/mistakes.md`) or drop the dangling filename; replace :329 with a durable memory link or inline the lesson; replace "Section 2(d)" with a stable heading link.
- Verification: every internal reference in codex/SKILL.md resolves.
- Disposition: open

### D4-024: codex/SKILL.md counts Overall as a perspective ("8 per-perspective files")
- Severity: Medium / Confidence: 100 / Priority: medium / System: codex / Dimension: D4 (D4.2) / Owner-surface: skill
- Location: `skills/codex/SKILL.md:358-359`
- Expected: evaluation output is "seven perspective files plus `overall.md`" (evaluation/SKILL.md:100,574).
- Observed: the wrapper check says "Must be 8 per-perspective output files (one per evaluation perspective)", conflating Overall with the seven perspectives.
- Evidence: codex/SKILL.md:358 "8 per-perspective output files"; evaluation/SKILL.md:574 lists only 7 perspective slugs + separate Overall.
- Proposed remediation: reword to "8 expected files: seven perspective files plus `overall.md`."
- Verification: the check no longer treats Overall as a perspective.
- Disposition: open

### D4-025: Assistant write-surface is mis-described across taxonomy + frontmatter
- Severity: Medium / Confidence: 100 / Priority: medium / System: claude+codex / Dimension: D4 (D4.2) / Owner-surface: agent
- Location: `skills/gobbi/SKILL.md:155`; `skills/delegation/SKILL.md:430,61`; `agents/assistant.md:3`
- Expected: one consistent assistant tool-surface description — read-only in lookup mode, but write-capable in RECORD (session staging) and Wrap-up WORK (memory).
- Observed: the two taxonomy tables call the assistant's surface "Read-only tool surface" (gobbi:155, delegation:430, :61 "Narrow read-only support") and the frontmatter description (assistant.md:3) says "bounded to session staging" — yet assistant.md:4 grants `Write, Edit` and :20 names Wrap-up WORK "the sole memory write surface in the entire workflow"; agent-writing/SKILL.md:109-110 explicitly says the assistant carries "the widest non-manager surface … not because it is read-only."
- Description: corroborated (claude C4-01 + codex C4-01); the frontmatter understatement is claude C4-05.
- Evidence: gobbi/SKILL.md:155 / delegation/SKILL.md:430 "Read-only tool surface."; assistant.md:4 `tools: …, Write, Edit…`; assistant.md:20 "sole memory write surface".
- Proposed remediation: in both taxonomy cells and the frontmatter, replace "Read-only" / "bounded to session staging" with "Write/Edit scoped to session staging (RECORD) + memory (Wrap-up WORK, sole memory writer); read-only in lookup mode."
- Verification: taxonomy + frontmatter match assistant.md's actual write scope.
- Disposition: open

### D4-026: manager.md references a `gobbi workflow init` CLI that does not exist
- Severity: Medium / Confidence: 100 / Priority: medium / System: claude / Dimension: D4 (D4.8/D4.2) / Owner-surface: agent
- Location: `agents/manager.md:35`
- Expected: Configuration is markdown/script-driven; the top-block states the workflow is "markdown-driven, no CLI."
- Observed: manager.md:35 says "Configuration → driven by `gobbi workflow init` CLI." A tree-wide grep finds this is the only `gobbi workflow init` reference; the actual Configuration (orchestration/SKILL.md Step 1) is driven by git §P2 + `init-record-map.sh` + JSON stamping; no `gobbi` binary exists.
- Evidence: `grep -rn "gobbi workflow init"` → single hit at manager.md:35; `orchestration/SKILL.md:104-108` rows are script+markdown.
- Proposed remediation: replace with "Configuration → handled in `orchestration/SKILL.md` § Step 1 (worktree + `init-record-map.sh` + session.json/state.json stamping); no extra phase skill."
- Verification: manager.md names no nonexistent CLI.
- Disposition: open

### D4-027: executor.md targets an absent TypeScript/Bun codebase
- Severity: Medium / Confidence: 100 / Priority: medium / System: claude / Dimension: D4 (D4.8) / Owner-surface: agent
- Location: `agents/executor.md:61,89,130-136`
- Expected: path/toolchain references in a role doc resolve in the tree the role operates on (markdown/skills-only).
- Observed: the "## TypeScript / Codebase Constraints" branch references `packages/cli/`, `bun test`, `tsc`, and a "2197/0 with `bun test`" verification example; `test -e packages/cli` → absent and no `package.json`/`tsconfig.json`/`bun.lockb` exists. Only the "runtime documentation" branch matches actual work.
- Evidence: executor.md:130 "`packages/cli/` code"; :89 "2197/0 with `bun test`"; `test -e packages/cli` → NO.
- Proposed remediation: gate or remove the TS branch (e.g., "If the project ships a TypeScript package …") and replace the `bun test`/"2197" example with a markdown-tree verification (the `skills/orchestration/scripts/` guards).
- Verification: executor.md's path/toolchain references resolve in the current tree or are explicitly conditional.
- Disposition: open

### D4-028: preparation.md says "five sub-steps" but the table lists four
- Severity: Low / Confidence: 100 / Priority: low / System: claude / Dimension: D4 (D4.4) / Owner-surface: workflow
- Location: `skills/orchestration/workflow/preparation.md:34` vs `:36-41`
- Expected: a self-reported count matches the list; siblings agree on four (ideation.md:49; gobbi Skill Map = 4).
- Observed: "the manager runs the user through five sub-steps" precedes a table with only A–D (four rows).
- Evidence: preparation.md:34 "five sub-steps"; :36-41 rows A–D; ideation.md:49 "four sub-steps".
- Proposed remediation: "five sub-steps" → "four sub-steps" (or add the missing 5th row if intended; the Skill Map says four).
- Verification: the count matches the table.
- Disposition: open

### D4-029: "The five agent types divide into two classes" but the table classifies four
- Severity: Low / Confidence: 100 / Priority: low / System: claude / Dimension: D4 (D4.4/D4.2) / Owner-surface: skill
- Location: `skills/orchestration/SKILL.md:50-58`
- Expected: a count claim matches its enumeration.
- Observed: "The five agent types divide into two classes:" introduces a 2-class table whose members are Teammates {leader, executor, assistant} + Subagent {evaluator} — four roles; the manager is then named separately (in neither class). So four, not five, divide into the two classes.
- Evidence: orchestration/SKILL.md:50 "five agent types divide into two classes"; rows 54-55 list 4; :56 "The manager is the team lead."
- Proposed remediation: reword to "Of the five agent types, four divide into two classes (the manager is the team lead, in neither)."
- Verification: the count claim matches the classified roster.
- Disposition: open

### D4-030: gobbi Glossary omits the `Stage` / Wrap-up stage-name vocabulary it is treated as owning
- Severity: Low / Confidence: 50 / Priority: low / System: claude / Dimension: D4 (D4.3) / Owner-surface: skill
- Location: `skills/gobbi/SKILL.md:108-124` (Glossary)
- Expected: the Glossary is the single home for "loop / sub-phase / stage vocabulary — including the stage names" (CLAUDE.md top-block).
- Observed: the Glossary defines Phase/Loop/Sub-phase/Iter/Verdict/Disposition/Staging/etc. but has no `Stage` entry and no Wrap-up stage names (promotion, handoff). A reader sent to the Glossary for a stage name finds nothing.
- Description: confidence 50 — the "Glossary owns stage names" assertion originates in CLAUDE.md (out of the C1a chunk scope); within scope this is an omission.
- Evidence: gobbi/SKILL.md:112-124 (no "Stage"); CLAUDE.md top-block "the stage names — lives in one place: the gobbi skill Glossary".
- Proposed remediation: add a `Stage` row + the Wrap-up stage names to the Glossary, or correct the "Glossary owns stage names" claim in CLAUDE.md.
- Verification: the Glossary defines `Stage` (and the Wrap-up stage names), or the owning claim is moved.
- Disposition: open

### D4-031: Hook script line counts are stale
- Severity: Low / Confidence: 100 / Priority: low / System: codex / Dimension: D4 (D4.4) / Owner-surface: hook
- Location: `skills/gobbi/hook-authoring.md:7-8,271-272`
- Expected: self-reported hook line counts match the live scripts.
- Observed: the doc says `session-start.sh` is 79 lines and `post-tool-use-agents.sh` is 251; live files are 82 and 305.
- Evidence: `wc -l .claude/hooks/session-start.sh .claude/hooks/post-tool-use-agents.sh` → 82, 305; hook-authoring.md:7-8,271-272 quote 79/251.
- Proposed remediation: refresh or remove the volatile line-count claims.
- Verification: the cited counts match the live scripts (or are removed).
- Disposition: open

### D4-032: Auto Mode cites a four-row Configuration procedure that is now five rows
- Severity: Low / Confidence: 100 / Priority: low / System: codex / Dimension: D4 (D4.4) / Owner-surface: workflow
- Location: `skills/orchestration/auto-mode.md:64` vs `skills/orchestration/SKILL.md:104-108`
- Expected: the Auto Mode summary matches the canonical Configuration table.
- Observed: auto-mode.md:64 says "rows 1-4: Create Worktree → Resolve Settings → Init state.json → Init session.json" and omits `Init Record Skeleton`; the canonical table has rows 1-5 including row 2 `Init Record Skeleton`.
- Evidence: auto-mode.md:64 "rows 1-4"; orchestration/SKILL.md:104-108 rows 1-5.
- Proposed remediation: update the Auto Mode summary to the five-row table.
- Verification: the summary enumerates all five Configuration rows.
- Disposition: open

### D4-033: planning `artifact_type: dependencies` is required in prose but absent from the mandatory checklist + table
- Severity: Low / Confidence: 100 / Priority: low / System: claude / Dimension: D4 (D4.5/D4.4) / Owner-surface: skill
- Location: `skills/planning/SKILL.md:435,446` vs `:459-460,493`
- Expected: a required artifact is mandated consistently across the Procedure note, Outputs, PASS exit-checklist, and the Output-paths mandatory line — or clearly marked optional.
- Observed: `dependencies` appears in the RECORD Procedure note (:435) and Outputs (:446), but not in the PASS checklist (:459-460, only task-list + memory-reads) nor the Output-paths mandatory line (:493). A reader cannot tell whether it is required. (Sibling Execution mandates all three of its artifacts in both places, so this is planning-specific.)
- Evidence: planning/SKILL.md:435 "one with `artifact_type: dependencies`"; :493 "Mandatory: ≥ 1 task-list, ≥ 1 memory-reads".
- Proposed remediation: decide required vs optional and make the four sites agree.
- Verification: `dependencies` is consistently required or consistently optional.
- Disposition: open

### D4-034: Docs teach / permit banned slug patterns
- Severity: Low / Confidence: 100 / Priority: low / System: codex / Dimension: D4 (D4.1) / Owner-surface: skill
- Location: `skills/record/SKILL.md:144`; `skills/planning/SKILL.md:300`
- Expected: file slugs avoid positional/sequence and status/version tokens, and the uninformative generic `main` (rules.md §1.3).
- Observed: record/SKILL.md:144 suggests artifact filenames `framed-problem-iter2.md` / `framed-problem-v2.md` (iter/version tokens); planning/SKILL.md:300 says "on simple workflows a single `plans/main.md` is acceptable" (`main` is the named generic anti-pattern).
- Evidence: record/SKILL.md:144 "`framed-problem-iter2.md` or `framed-problem-v2.md`"; planning/SKILL.md:300 "`plans/main.md`"; rules.md:50-57 marks `task-01`/`v2-`/`main` bad.
- Proposed remediation: teach subject-distinct filenames; keep iteration/version state in frontmatter + supersession metadata; require a subject-descriptive plan slug even for simple workflows.
- Verification: the example slugs name their subject and carry no iter/version/`main` token.
- Disposition: open

### D4-035: preparation/evaluation.md has unique frontmatter among the sibling evaluation child docs
- Severity: Low / Confidence: 100 / Priority: low / System: codex / Dimension: D4 (D4.6) / Owner-surface: skill
- Location: `skills/preparation/evaluation.md:1-7`
- Expected: the five sibling loop `evaluation.md` docs share one opening style.
- Observed: only Preparation has YAML frontmatter; Ideation/Planning/Execution/Wrap-up start directly at an H1.
- Evidence: `sed -n '1p'` across the five → only preparation/evaluation.md starts with `---`.
- Proposed remediation: remove the lone frontmatter, or add equivalent frontmatter to all five.
- Verification: the five evaluation docs share one opening style.
- Disposition: open

### D4-036: ideation/SKILL.md RECORD table has an `agent.s` typo
- Severity: Low / Confidence: 100 / Priority: low / System: codex / Dimension: D4 (D4.6) / Owner-surface: skill
- Location: `skills/ideation/SKILL.md:426`
- Expected: possessive text uses `agent's` (or a plural rewrite).
- Observed: the row reads "Copy each agent.s raw transcript …" — apostrophe rendered as a literal period (same corruption class as the `loop's→loop.s` seed, a different word/site).
- Evidence: ideation/SKILL.md:426 "each agent.s raw transcript".
- Proposed remediation: correct the typo without changing the RECORD procedure.
- Verification: `grep 'agent\.s' ideation/SKILL.md` → 0 hits.
- Disposition: open

### D4-037: Phase-header parenthetical-annotation drift across the 5-sibling heading ladder
- Severity: Low / Confidence: 75 / Priority: low / System: claude / Dimension: D4 (D4.6, advisory) / Owner-surface: skill
- Location: `execution/SKILL.md:73,107` + `wrap-up/SKILL.md:98,131` vs `ideation/SKILL.md:64,292`, `preparation/SKILL.md:90,230`, `planning/SKILL.md:93,286`
- Expected: the 5 sibling loops share one heading ladder; phase headers read uniformly.
- Observed: Execution + Wrap-up annotate their phase headers (`## DISCUSSION Phase (manager + user, direct)`, `## WORK Phase (delegated to \`assistant\`)`) while Ideation/Preparation/Planning use bare headers. The annotation is justified (different owner), so this is advisory drift, not a defect.
- Evidence: execution/SKILL.md:73; wrap-up/SKILL.md:131; ideation/SKILL.md:64 (bare).
- Proposed remediation: either drop the parentheticals (move the owner note to the first prose line) or add an equivalent "(leader-led)" annotation to the three leader loops.
- Verification: the 5 loops' phase headers read uniformly.
- Disposition: open

### D4-038: The vocab `$schema`-note mis-explains the 16→15 type-key gap
- Severity: Low / Confidence: 85 / Priority: low / System: claude / Dimension: D4 (D4.4) / Owner-surface: memory
- Location: `skills/memory/memory-vocabulary.json:2`
- Expected: the note justifying "15 keys for 16 types" names the type that lacks a key.
- Observed: the note says "(15 active type keys; archive has no key …)", but `archive` is NOT one of the 16 first-class types (rules.md:265), so it never accounts for the gap. The type with no key is `features` (the §1.5 structural exception, rules.md:130); `.types` confirms 15 keys = all 16 except `features`.
- Evidence: `.types` has no `features` key; rules.md:130 features = "no config key"; rules.md:265 archive ≠ type.
- Proposed remediation: reword to "15 active type keys (all 16 first-class types except `features`, the structural exception that owns no area list); `archive` likewise has no key (mirrors its source type's area)."
- Verification: the note names `features` as the keyless type.
- Disposition: open

### D4-039: The coding Appendix coverage-check contradicts its own traceability table
- Severity: Low / Confidence: 88 / Priority: low / System: claude / Dimension: D4 (D4.4) / Owner-surface: skill
- Location: `skills/coding/SKILL.md:318` vs `:301-316`
- Expected: the Appendix-A "Coverage check" inverse map (line 318) equals the per-row table.
- Observed: (a) :318 `P2→2/4/7` omits coding principle 6, yet :306 maps "6 Design for Verification → P2"; (b) :318 `P3→1/2/3/5` includes coding principle 1, yet :301 maps "1 Study First → P1, P4" with no P3. Either the coverage line or the table cells are wrong.
- Evidence: coding/SKILL.md:306 (coding-6→P2); :301 (coding-1→P1,P4); :318 `P2→2/4/7`, `P3→1/2/3/5`.
- Proposed remediation: correct line 318 to `P2→2/4/6/7` and `P3→2/3/5` (or fix the coding-1 cell). Maintainer-only appendix, but a verifiable claim that fails.
- Verification: the coverage line equals the traceability table.
- Disposition: open

### D4-040: `mistakes` 4-element ORDER differs between memory-tier and skill-surface schema
- Severity: Low / Confidence: 90 / Priority: low / System: claude / Dimension: D4 (D4.2) / Owner-surface: memory
- Location: `skills/memory/rules.md:368` + `skills/memory/templates/mistakes.md:49-62` vs `templates/mistakes.md:101-104,120` + `skills/memory/mistakes.md:16-19`
- Expected: the four mistake elements appear in one canonical order across memory's docs.
- Observed: the memory-tier order (§4.2 + memory-tier template body) is `What happened → Why it happens → Correct approach → How to detect`; the skill-surface schema (and the live `skills/memory/mistakes.md` sections) use `What happened → Why it happens → How to detect → Correct approach` — the last two swapped. Each home is internally consistent; the two disagree.
- Evidence: rules.md:368 "Correct approach → How to detect"; templates/mistakes.md:120 "How to detect / Correct approach"; mistakes.md:18-19 detect-before-correct.
- Proposed remediation: pick one order (the §4.2 SSOT is `Correct approach → How to detect`) and reconcile the skill-surface schema + filled example, or add a one-line note that the skill-surface intentionally reorders.
- Verification: both homes use one element order, or the deviation is documented.
- Disposition: open

### D4-041: Feature template carries a stale live subdir count
- Severity: Low / Confidence: 100 / Priority: low / System: codex / Dimension: D4 (D4.4) / Owner-surface: memory
- Location: `skills/memory/templates/feature.md:38`
- Expected: a "currently has" count matches the live repo, or the doc avoids live-count claims.
- Observed: the doc says `features/workflow/` currently has 8 subdirs + README; the live directory has 9 (`backlogs changelogs checklists decisions design discussions plans references scenarios`).
- Evidence: `find -L features/workflow -mindepth 1 -maxdepth 1 -type d` → 9; feature.md:38 "8 subdirs + README".
- Proposed remediation: update the count or remove the live example.
- Verification: the count matches the live directory (or the live claim is dropped).
- Disposition: open

### D4-042: claude-plugin "Hooks (3)" left un-reconciled beside "4 event groups"
- Severity: Low / Confidence: 50 / Priority: low / System: claude / Dimension: D4 (D4.4) / Owner-surface: skill
- Location: `skills/claude-plugin/SKILL.md:243` vs `:193,226,241`
- Expected: the L243 CLI-snapshot reconciliation parenthetical covers every drifted count, not only Skills.
- Observed: L243 reports `Skills (19), Agents (5), Hooks (3)` and the "(now 22 …)" note updates only Skills. `Hooks (3)` sits un-annotated beside the doc's repeated "4 event groups." Verified: hooks.json has 4 event groups; the hooks dir has 3 `.sh` scripts — different units, not a hard contradiction, but a reader cannot tell whether `Hooks (3)` is current.
- Evidence: `ls hooks/` → 3 `.sh`; 4 event registrations in hooks.json; claude-plugin/SKILL.md:243 vs :241.
- Proposed remediation: extend the L243 parenthetical to state the `Hooks (3)` unit ("3 hook scripts; 4 event registrations"), the treatment Skills already gets.
- Verification: the CLI-snapshot counts are each annotated as current or unit-clarified.
- Disposition: open

### D4-043: principles/SKILL.md skips the canonical `# Title` H1
- Severity: Low / Confidence: 100 / Priority: low / System: codex / Dimension: D4 (D4.6) / Owner-surface: skill
- Location: `skills/principles/SKILL.md:7`
- Expected: a `SKILL.md` body starts with `# Title` per the skill-writing skeleton (each sibling has a line-7 H1).
- Observed: principles/SKILL.md starts directly at `## Principle 1`, with no `# Principles` heading.
- Evidence: principles/SKILL.md:7 "## Principle 1 …"; skill-writing/SKILL.md:133 "`# Title` — the skill's name, Title Case"; siblings carry a line-7 H1.
- Proposed remediation: add `# Principles` + a short intro before the principle sections.
- Verification: principles/SKILL.md opens with an H1.
- Disposition: open

### D4-044: codex skill description grammar deviates from the prescribed on-demand opener
- Severity: Low / Confidence: 75 / Priority: low / System: claude / Dimension: D4 (D4.6) / Owner-surface: skill
- Location: `skills/codex/SKILL.md:3`
- Expected: per skill-writing P1 (:86-88), an on-demand skill's `description` opens with `Use when …` or `Load when …`.
- Observed: codex opens with "Use **for** native Codex Gobbi work …"; peers correctly use "Use when …" (claude-plugin) / "Load when …" (git).
- Evidence: skill-writing/SKILL.md:86-88 sanctioned openers; codex/SKILL.md:3 "Use for".
- Proposed remediation: reword to "Use when running native Codex Gobbi work or bridging Claude Code to Codex …".
- Verification: the description opens with a sanctioned opener.
- Disposition: open

### D4-045: agent-writing enumerates continuable roles as "(executor, leader)" — omits the assistant
- Severity: Low / Confidence: 100 / Priority: low / System: claude / Dimension: D4 (D4.4/D4.2) / Owner-surface: skill
- Location: `skills/agent-writing/SKILL.md:127`
- Expected: the continuable-role roster matches which agent docs actually carry `## Continuation discipline`.
- Observed: agent-writing:127 says "(executor, leader)", but assistant.md:102-110 carries a full `## Continuation discipline` section and delegation/SKILL.md:164 documents the assistant as continuable. The enumeration lists 2 of 3.
- Evidence: agent-writing/SKILL.md:127 "(executor, leader)"; assistant.md:102 "## Continuation discipline"; delegation/SKILL.md:164 assistant CONTINUE.
- Proposed remediation: change "(executor, leader)" → "(executor, leader, assistant)".
- Verification: the roster matches the agent docs that carry Continuation discipline.
- Disposition: open

### D4-046: evaluator.md lists `evaluation/SKILL.md` twice in the mandatory load ladder
- Severity: Low / Confidence: 100 / Priority: low / System: claude / Dimension: D4 (D4.6) / Owner-surface: agent
- Location: `agents/evaluator.md:34,37`
- Expected: each mandatory load appears once; the ladder reads like the other 4 agent docs (item 1 = `principles` alone).
- Observed: item 1 (:34) names `principles` AND `evaluation/SKILL.md`; item 4 (:37) is the canonical `evaluation` load — so `evaluation/SKILL.md` is mandatory twice.
- Evidence: evaluator.md:34 (item 1 incl. evaluation/SKILL.md) + :37 (item 4 evaluation skill).
- Proposed remediation: drop the "and `evaluation/SKILL.md`" clause from item 1 (keep the producer/evaluator-separation note as prose), leaving item 4 as the single canonical load.
- Verification: `evaluation/SKILL.md` appears once in the load ladder.
- Disposition: open

## Global reconciliation

The merge-only reconciliation no single chunk could compute: term consistency, count drift, and Glossary/stage vocabulary across all 12 indices.

### Term consistency (D4.2 / D4.3)

| Canonical | Non-canonical token(s) found | Sites | Finding |
|---|---|---|---|
| loop state `Active` | `InProgress` (~21 sites) | chat-mode.md:511-529,552 | D4-008 |
| sub-phase `RECORD` | `MEMO` | chat-mode.md:91,515 (claude+codex) | D4-008 |
| sub-phase `EVALUATION` | `EVAL` | chat-mode.md:91,515 | D4-008 |
| phase/state slots | `ITER/EXIT`, `PLAN_DRAFT`, `EXECUTION`, `WRAPUP` | orchestration/SKILL.md:245; auto-mode.md:115,133,151 | D4-008 |
| sub-phase (term) | DISCUSSION/WORK/EVALUATION/RECORD called "phase"/"## X Phase" | 5 loop SKILL.md:9 + headers; research/SKILL.md:31 | D4-011 |
| phase name `Wrap-up` | `Wrap-Up`, `Wrap Up` | wrap-up/mistakes.md:8,12 | D4-015 |
| disposition `open` | `still open` | wrap-up/evaluation.md:284 | D4-013 |
| role `leader` | `Planner`, `Plan agent` | ideation/evaluation.md:255,279; preparation/evaluation.md:212 | D4-014 |
| role `assistant` (writer) | "Read-only tool surface" / "bounded to session staging" | gobbi:155; delegation:430,61; assistant.md:3 | D4-025 |
| verdict `PASS/REVISE/FAIL` | prose says "PASS or REVISE" | ideation.md:98 | D4-010 |
| skill `research` (not a phase) | `research`/`Research` as a phase/sub-phase value | delegation:58,300,427; leader.md:8 | D4-016 |
| perspective set (7 + Overall) | "8 per-perspective files (one per perspective)" | codex/SKILL.md:358-359 | D4-024 |
| date-prefix convention | bare `{slug}.md` for notes/changelogs/discussions | memory-map.md:121,125,141 | D4-020 |

### Count drift (claim | values found | status)

| Claim | Values found | Status |
|---|---|---|
| claude-plugin skills | CLI snapshot `Skills (19)` vs canonical/.agents = 22 | KNOWN SEED (instance 1) — not re-filed; sibling `Hooks (3)` un-reconciled → D4-042 |
| memory `type` enum | gobbi/SKILL.md:208 = 13 vs canonical 16 | KNOWN SEED (D2-033, instance 1) — not re-filed |
| Preparation in loop enumerations | dropped at evaluation.md:278, workflow/record.md:121-128, wrap-up/evaluation.md:282-284, templates/decisions.md+discussions.md:15 | KNOWN SEED (Preparation-dropped) — siblings listed, not re-filed |
| eval mandatory/optional/skip policy | gobbi:141 / orchestration:259 / auto-mode:285 / delegation:429 / manager:142 disagree | NEW → D4-001 |
| Hooks (3) vs 4 event groups | 3 hook scripts / 4 event registrations | NEW → D4-042 (different units, un-reconciled) |
| continuable roles | agent-writing "(executor, leader)" = 2 vs actual 3 (incl. assistant) | NEW → D4-045 |
| preparation sub-steps | prose "five" vs table A–D = 4 | NEW → D4-028 |
| agent types in two classes | prose "five" vs table classifies 4 | NEW → D4-029 |
| Configuration rows | auto-mode "rows 1-4" vs canonical 5 | NEW → D4-032 |
| hook line counts | doc 79/251 vs live 82/305 | NEW → D4-031 |
| features/workflow subdirs | doc "8 + README" vs live 9 | NEW → D4-041 |
| memory vocab type keys | note blames `archive` for the 16→15 gap; real exception is `features` | NEW → D4-038 |
| coding principle→P inverse map | line 318 `P2→2/4/7`,`P3→1/2/3/5` vs table (P2 incl 6; P3 excl 1) | NEW → D4-039 |
| eval Memory-Access-Matrix tiers | "Three-Tier" header vs 7 rows | NEW → D4-017 |
| planning `dependencies` artifact | mandated in prose, absent from checklist + table | NEW → D4-033 |
| principles | 10 everywhere (gobbi, manager.md, C3b, C4) | CONSISTENT |
| agent roles | 5 everywhere (C3b, C4, agent-writing) | CONSISTENT |
| perspectives | "7 + Overall" everywhere (C1a, C1b, C2, C3b, C4) | CONSISTENT |
| evaluators | "exactly 2, one per system" (C1a, C2, C4) | CONSISTENT |
| 6-step state machine · 16 canonical types (canonical sites) · softCap 12 / hardCap 15 · 11 base fields | consistent across their canonical sites | CONSISTENT |

### Glossary / Stage vocabulary

- The Glossary (gobbi/SKILL.md:108-124) defines Phase/Loop/Sub-phase/Iter/Verdict/Disposition/Staging/Sole-writer/Proposer/etc., but has **no `Stage` entry** and no Wrap-up stage names (promotion / handoff), although CLAUDE.md says it owns the stage names → D4-030.
- Non-Glossary tokens used in canonical slots: `InProgress`, `MEMO`, `EVAL`, `ITER/EXIT`, `PLAN_DRAFT`, `EXECUTION`, `WRAPUP` (D4-008); "phase" for the four sub-phases (D4-011); `still open` (D4-013); `Planner`/`Plan agent` (D4-014); `Wrap-Up`/`Wrap Up` (D4-015); `research` as a phase (D4-016).

## Cross-system divergence

**Cross-system corroborations (7 findings — the strongest anti-groupthink signal):** D4-001 (eval policy), D4-008 (`MEMO` slot token), D4-011 (phase-vs-sub-phase), D4-017 (Three-Tier matrix), D4-019 (design section-contract), D4-023 (codex/SKILL.md `:243` reference rot), D4-025 (assistant write-surface mislabel). When both independent systems land on the same defect at the same location, treat the repair as highest-confidence.

**Single-system codex (21):** D4-002, D4-003, D4-004, D4-005, D4-009, D4-010, D4-012, D4-013, D4-014, D4-015, D4-016, D4-020, D4-021, D4-022, D4-024, D4-031, D4-032, D4-034, D4-035, D4-036, D4-041. Codex's distinctive D4 lens: doc-local path resolution (D4-002/003), intra-skill instruction contradictions (D4-004/005/012), and Glossary-token deviations across child docs (D4-013/014/015/016/024).

**Single-system claude (18):** D4-006, D4-007, D4-018, D4-026, D4-027, D4-028, D4-029, D4-030, D4-033, D4-037, D4-038, D4-039, D4-040, D4-042, D4-043(*codex*)… — claude's distinctive lens: stale line-anchor / nonexistent-mechanism references (D4-007/018/026/027), self-reported count drift (D4-028/029/033/038/039/042), and frontmatter/heading micro-consistency (D4-040/045/046). (Note: D4-043 principles-H1 is codex; D4-044 description-grammar is claude.)

**Notable substantive divergences (same surface, opposite verdict — user must adjudicate):**
1. **Repo-root path references (D4-002):** Codex = a real per-doc D4.8 defect across ~15 docs (bare `.claude/`/`scripts/` refs fail doc-local `test -e`); Claude = by-design "mirror-build behavior, not a per-doc defect" (consumers `readlink` to canonical first). The fix either way is to DECLARE the path-resolution convention. Highest-leverage adjudication in D4.
2. **`MEMO` vs the broader phase-token set (D4-008):** both flag `MEMO`; Claude additionally caught `InProgress` (a loop-STATE synonym Codex missed), Codex additionally caught `ITER/EXIT`/`PLAN_DRAFT`/`EXECUTION`/`WRAPUP` (phase-slot values Claude missed) — complementary coverage, same root.

## Already covered by D2

These D4 candidates target the SAME defect at the SAME location already filed in the merged D2 review, so they are NOT re-filed as D4 findings (cross-dimension dedup). D4.8 (doc↔path) overlaps D2.3 most.

| D4 candidate(s) | D2 | Note |
|---|---|---|
| Claude C1a-03 (`../delegation/SKILL.md` shallow at workflow/wrap-up.md:17 + execution.md:17) | D2 delegation broken-link **seed** | the exact seed instance-1 (confirmed-seed table) |
| Claude C2-01 + Codex C2-07 (delegation:408 → `rules/docs-cleanup-parallelism.md`) | D2-023 | dead link into nonexistent `rules/` dir |
| Claude C2-02 + Codex C2-08 (delegation:292 → `features/agents/backlogs/…session-json.md`) | D2-024 | dangling backlog citation |
| Claude C2-03 (record/SKILL.md omits 2-preparation `staging/skills/`) | D2-026 | record matrix omits the SSOT-declared staging surface |
| Claude C2-05 (evaluator.md files `evaluation/SKILL.md` under tier-1 Principles) | D2-009 | load-tier-order violation |
| Claude C3a-01 + Claude C3a-06 + Codex C3a-01 (rules.md:351 `diataxis.fr`, :378 design-literal dead link) | D2-037 | two broken markdown links (backlog-tracked) |
| Claude C3b-03 (interview/SKILL.md `rawdata` retired slot vocab) | D2-038 | sole residual `rawdata` user |
| Codex C3b-09 + Codex C4-04 (`.claude/skills/coding` missing — mirror count 21/22) | D2-010 | `.claude` mirror missing canonical `coding` |
| Codex C3b-01 (codex evaluator vocab-grep gate contradicts its loaded mistake) | D2-014 | wrapper gate enforces a check its mistakes.md forbids |
| Codex C1b-01 (Preparation generated-skill promotion contract contradicts itself) | D2-006 | generated-skill promotion owner/timing conflict |

## Confirmed-seed siblings

The confirmed D4 seeds are instance-1 and NOT re-filed. Their consolidated siblings:

| Seed (instance 1) | Sibling findings / instances (same class) |
|---|---|
| **Preparation-dropped pattern** | maxIterations enum `evaluation.md:278` (claude C1a-06); RECORD per-loop summary table `workflow/record.md:121-128` (codex C1a-07); Wrap-up closure audit `wrap-up/evaluation.md:282-284` (codex C1b-02); `templates/decisions.md`+`discussions.md:15` loop lists (codex C3a-03); the Preparation-drop aspect of **D4-001** (delegation:429). All omit Preparation from a "every loop" enumeration. |
| **`loop's → loop.s` apostrophe corruption** (ideation/SKILL.md:3,52,411 — D2-034) | **D4-036** (`agent.s` at ideation/SKILL.md:426 — the same apostrophe→period corruption, a distinct word/site). |
| **claude-plugin 22-vs-19 skills CLI snapshot** | **D4-042** (`Hooks (3)` un-reconciled in the same CLI snapshot). |
| **`.claude`-depth wrong-relative-link seed** (orchestration + delegation, D2-017/D2-022) | **D4-002** (the broader repo-root-vs-doc-relative convention gap; the specific wrong-DEPTH links remain D2-017/D2-022 and are excluded). |
| **memory 13-vs-16 type enum** (gobbi/SKILL.md:208, D2-033) | no new D4 sibling — memory's canonical type/count sites are internally consistent (16 types, 14 feature subdirs, 12 subsystem types, 11 base fields). |

## Related

- [[2026-06-29-gobbi-adversarial-review-d2]] — the merged D2 review this D4 pass dedups against
- [[fix-d2-review-findings]] — the deferred fix queue (D2; a D4 sibling queue should follow)
- [[adversarial-review-charter-authored]] — the charter this review executes against
- [[run-deep-adversarial-review]] — the parent charter-execution backlog
