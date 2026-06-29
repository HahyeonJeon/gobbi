---
name: gobbi-adversarial-review-d3-d5
description: Cycle-2 adversarial review of gobbi — D3 harness comparison (13 axes) + D5 text-polish (15 candidates), dual-system, review-only
type: reviews
scope: project
feature: null
status: active
created: 2026-06-29
session: 0305008a-4073-428a-8094-fbb6d0808dea-d3d5
tags: [evaluation]
keywords: [adversarial-review, dual-system, harness-comparison, text-polish, dogfooding, cycle-2, d3, d5]
author: claude
review_kind: adversarial-review
subject: "gobbi D3 harness comparison + D5 text-polish"
verdict: needs-attention
---

# Cycle-2 adversarial review — gobbi D3 (harness comparison) + D5 (text-polish)

## Scope

Cycle 2 of the gobbi adversarial-review charter. This pass covered two charter dimensions:

- **D3 — harness comparison.** A 13-axis capability comparison of gobbi against four anchored reference harnesses (superpowers, claude-flow, claude-task-master, Agent OS), plus a refresh-candidate note.
- **D5 — text-polish.** A size-ranked sampling review of gobbi's skill docs for duplicated / oversized prose: `drop` / `compact` / `move` / `centralize` / `keep` candidates.

Both dimensions ran **dual-system** (an independent Claude review and an independent Codex review per dimension), reconciled by pessimistic union. **Review-only:** no skill, agent, or plugin source was edited; every finding is `open` and routed to a fix-backlog for a future scoped session. Charter dimensions **D2 (completeness / between-skill), D4 (naming / counts), and D6 (plugin / mirror) remain deferred** to a later cycle (see the handoff note). Cycle 1 (D7 live-session UX + D1 per-skill depth, 40 findings) shipped earlier on PR #323.

**Verdict: needs-attention.** D3 confirms gobbi's lead differentiator is protected but surfaces 5 both-systems-agree capability gaps (2 High). D5 found 13 duplication / size candidates with zero MUST-safety drops.

## D3 — harness comparison

Source (reconciled): `sessions/2026-06-29-0305008a-4073-428a-8094-fbb6d0808dea-d3d5/4-execution/task-01-d3/staging/reviews/d3-reconciled-findings.md`. Claude scored 13 findings (one per axis); Codex scored 14 (13 axes + 1 refresh note). Merge = per-axis pessimistic union: the more conservative score wins (parity over ahead; behind over parity), severity is the max of the two systems, and a finding survives if either system raised it.

### Axis scoreboard

| # | Axis | Claude | Codex | Consolidated (conservative) | Severity (max) |
|---|---|---|---|---|---|
| 1 | skill discovery | behind | behind | **behind** | Medium |
| 2 | live progress visibility | behind | behind | **behind** | Medium |
| 3 | orchestration / agent-composition | parity | parity-gap | **parity** | Medium |
| 4 | memory model | parity-gap | parity-gap | **parity-gap** | Medium |
| 5 | staleness re-sync | behind | behind | **behind** | **High** |
| 6 | dependency-aware planning | behind | behind | **behind** | **High** |
| 7 | install / onboarding & portability | parity-gap | parity-gap | **parity-gap** | Medium |
| 8 | token economy / doc-density | behind | behind | **behind** | Medium |
| 9 | anti-groupthink evaluation | **ahead** | **ahead** | **ahead (PASS)** | — |
| 10 | permission / sandbox model | parity-gap | **ahead** | **parity-gap** (Divergence) | Low |
| 11 | checkpointing / rollback | parity-gap | **ahead** | **parity-gap** (Divergence) | Low |
| 12 | telemetry / observability | parity-gap | parity-gap | **parity-gap** | Medium |
| 13 | extensibility | parity-gap | parity-gap | **parity-gap** | Medium |

**Consolidated tally (conservative): ahead 1 · parity / parity-gap 7 · behind 5.** Both systems agree on the 5 `behind` axes (1, 2, 5, 6, 8) and the 1 `ahead` axis (9). The split is only on axes 10 and 11 — Codex scored them `ahead`, Claude `parity-with-gap`; the conservative rule resolves both to `parity-gap`. That split is the entire gap between Codex's raw "ahead 3" and the consolidated "ahead 1".

### Per-axis findings

**D3-001 — Skill discovery (behind, Medium).** gobbi discovery is fully manual: spawned subagents have no Skill tool; "load" = READ the exact SKILL.md paths the manager hand-lists in Load Directives, with a transcript-grep backstop (`skills/delegation/SKILL.md:92-142`). Superpowers runs a skill-search pass on every user message + a getting-started dispatcher that auto-triggers skills. **Fix:** an ADVISORY skill-discovery preflight suggesting candidate SKILL.md paths for the manager's Load Directives — never replacing the deterministic hand-listed contract or the grep backstop. License: pattern-only; verify superpowers license before copying source.

**D3-002 — Live progress visibility (behind, Medium).** gobbi's Workflow Status Display is a 6-row step table projected from `state.json`, rendered at GATE POINTS only (`skills/orchestration/SKILL.md:114-161`); between renders the user sees prose, step-level not item-level — a skipped gate can hide. Superpowers builds live TODO lists from skill checklists. **Fix:** a `todo-from-checklists` projection seeded from gobbi's existing artifacts (Planning task list; Evaluation Stage-1 scenario/checklist frame), surfaced via the runtime's native todo UI (`TodoWrite` / Codex equivalent), `state.json` staying authoritative. Additive UI — no dual-system contact. (User-flagged Seed-A / D7 gap.)

**D3-003 — Orchestration / agent-composition (parity, Medium).** gobbi: manager + four specialist types, strict role boundaries, producer/evaluator separation; implementation tasks SEQUENCE — only research / investigation / evaluation parallelize (`skills/orchestration/SKILL.md:33-61`; `skills/delegation/SKILL.md:327`). claude-flow runs a queen/worker swarm in parallel over shared persistent memory. **Remediation divergence:** Claude — NO fix; document the divergence as intentional (parallel implementation is forbidden because one-worktree-one-branch isolation makes concurrent diffs unattributable). Codex — consider an OPTIONAL shared coordination layer for NON-evaluator teammates only. **Consolidated:** treat as parity; any shared-memory layer is a user-decision and must never reach evaluator contexts (see guardrails).

**D3-004 — Memory model (parity-gap, Medium) · GUARDRAIL.** gobbi: plain-markdown git-tracked memory — 16 typed dirs, area namespacing, frontmatter, supersede-not-delete, compaction; explicitly NO per-session SQLite (`skills/memory/memory-map.md:6-7`; `skills/memory/rules.md`). Retrieval = recursive glob + grep + controlled vocab, no relevance ranking; load cost grows with the tree. claude-flow offers SQLite/AgentDB semantic memory ("150x faster semantic queries"). **Fix:** an ADDITIVE generated semantic index OVER the markdown — rebuildable from markdown, citations back to source, markdown stays canonical. **GUARDRAIL (both systems): the index stays additive — never replace markdown with a DB; doing so erodes the git-native human-readable design value.**

**D3-005 — Staleness re-sync (behind, High) · charter centerpiece.** gobbi memory refreshes REACTIVELY only — supersede-via-frontmatter, compaction (`skills/memory/rules.md:479-528`; `skills/mistake/SKILL.md:52-56`). Nothing re-derives truth FROM the codebase to flag a record gone stale. Witnessed cost: `mistakes/verification/verify-dont-assert-taught-facts.md` — taught facts drifted from source, caught only reactively after the wrong instruction shipped. Agent OS "Discover Standards" extracts current patterns/conventions from the codebase + indexes them. **Fix:** an Agent-OS-style re-extraction pass (Preparation or Wrap-up) that re-derives conventions/facts from the live tree, diffs against stored memory, and stages stale-memory candidates with source-code citations for user-confirmed supersession. **Run it as its OWN dual-system loop** so the re-sync carries the anti-groupthink signal. Labeled a SUGGESTION (review-only per charter Decision-5). License: borrow the re-extract-and-diff concept; author fresh. (User-flagged critical axis S5.)

**D3-006 — Dependency-aware planning (behind, High) · severity divergence.** gobbi's Planning leader decomposes into ordered tasks with explicit `requires` deps + parallel lanes (`skills/planning/SKILL.md:199-223`), but there is NO machine complexity/priority score and NO "next dependency-satisfied task" selector — the manager picks by hand. claude-task-master parses a PRD into `tasks.json` with deps AND complexity scores, returns the highest-priority deps-satisfied task, with `expand_task`. **Fix:** add (a) a per-task complexity/priority score, (b) a deterministic "next = highest-priority task whose deps are all satisfied" selector, (c) an `expand_task` split for high complexity. **Divergence: severity Medium (Claude) vs High (Codex) → pessimistic max = High.** License: claude-task-master's license has VARIED across versions — verify before reusing code; the scheduling rule itself is a general algorithm, reimplement fresh.

**D3-007 — Install / onboarding & portability (parity-gap, Medium).** gobbi is dual-runtime by construction — one canonical prompt, two wrappers (`.claude/agents/{role}.md` symlink; `.codex/agents/{role}.toml`) + a per-runtime primitive map (`skills/orchestration/SKILL.md:13-22`). Deeper than single-host harnesses. **Emphasis divergence (both parity-gap):** Claude — portability DEPTH across runtimes is ahead; BREADTH trails CLI-installer harnesses (BMAD multi-host) only matters IF multi-host becomes a goal (scope question, not a defect). Codex — add a first-run portability diagnostic (verify plugin install, skill paths, custom-agent availability, hook parity, memory roots) producing one pass/fail report. License: BMAD is MIT (patterns safe, author fresh).

**D3-008 — Token economy / doc-density (behind, Medium) · GUARDRAIL · ties to D5.** gobbi "load" = READ the whole SKILL.md (`skills/delegation/SKILL.md:92-142`); loaded skills are large (orchestration ~441L, evaluation ~597L, memory/rules ~537L). gobbi DOES split some content into `workflow/{step}.md` children (partial), but within any loaded skill it is all-or-nothing. Agent OS injects 3-layer context (Standards / Product / Specs) at different workflow points — progressive disclosure by construction. **Fix:** extend gobbi's child-doc layering toward staged injection — push reference-heavy sections into on-demand children; Load Directives list only the slice a phase needs, with full-doc escalation when needed. Pairs directly with the D5 text-polish pass. **GUARDRAIL (both systems, hard constraint): progressive disclosure must NEVER drop the dual-system docs (`orchestration/workflow/production.md` producer/proposer integration; `evaluation/SKILL.md` producer/evaluator separation) from the load path — slicing them out erodes the differentiator.**

**D3-009 — Anti-groupthink evaluation (AHEAD — PASS, the lead differentiator).** gobbi runs two INDEPENDENT model families at BOTH creation and review. Production = Claude producer + Codex proposer generating independently; producer selectively integrates the frozen proposal, never blends (`skills/orchestration/workflow/production.md:11-17`; `skills/delegation/SKILL.md:361-377`). Evaluation = two evaluators in parallel, one per system, each covering all 7 perspectives + Overall, cross-system divergence as the signal (`skills/orchestration/workflow/evaluation.md:40-53`; `skills/evaluation/SKILL.md:51-57`). No harness matches: superpowers fresh-agent review is same-family fresh CONTEXT (review-only, no dual creation); claude-flow is same-family coordination; task-master and Agent OS have no adversarial dual-system at all. **Fix: none — PRESERVE.** Every fix in this review was checked against this differentiator; none erodes it.

**D3-010 — Permission / sandbox model (parity-gap, Low) · SCORE DIVERGENCE.** gobbi documents and PROBES the HOST sandbox posture (Claude Code OS sandbox; Codex read-only / workspace-write / danger-full-access + approval policies; evaluator read-only, side-effect preflight — `skills/git/SKILL.md:39-65`; `skills/codex/SKILL.md:61-130`); it implements no sandbox of its own. OpenHands runs agents in a Docker sandbox, every action containerized/logged (refresh candidate). **Divergence: Claude parity-gap vs Codex ahead → conservative parity-gap.** **Fix:** none for current scope — keep delegating to the host sandbox; adopt OpenHands-style Docker + audited-action-log ONLY if gobbi ever executes untrusted code.

**D3-011 — Checkpointing / rollback (parity-gap, Low) · SCORE DIVERGENCE.** gobbi durable rollback is git-native and strong — one worktree+branch per session, one focused commit per verified task, supersede-not-delete + `archive/`, `state.json` recovering position after `/clear` / `/compact` / resume (`skills/orchestration/SKILL.md:90-110`). Behind only on ACTION-level (sub-task) in-session undo, left to the host (`/rewind`). Cline offers per-action checkpoint+rollback (refresh candidate). **Divergence: Claude parity-gap vs Codex ahead → conservative parity-gap.** **Fix:** none — task-commit granularity is intentional; finer undo is a host concern.

**D3-012 — Telemetry / observability (parity-gap, Medium).** gobbi has per-agent `tokensUsed`, `usage.*` rollups, and a purpose-built dual-system VALUE telemetry — `workflow.{loop}.integration` counts (changing / kept-own / total / escalated rows) measuring whether the Codex proposal moved the canonical artifact, plus per-task counts (`skills/orchestration/SKILL.md:304-441`). Richer than a generic trace. Behind only on VISUAL surface — telemetry is JSON read via jq/grep, no live trace viewer. LangGraph/LangSmith offer trace dashboards (LangSmith commercial). **Fix:** a read-only projection/dashboard OVER `session.json` (+ transcripts, evaluation outputs, integration logs) — a derived view, not new data. License: LangSmith commercial — do NOT copy; borrow only the concept.

**D3-013 — Extensibility (parity-gap, Medium).** gobbi is highly extensible by construction — skills are markdown dirs, agents are canonical prompts + per-runtime wrappers, vocabulary is a closed-but-extensible `memory-vocabulary.json`. But extension is MANUAL — hand-author the dir, hand-wire the Load-Directives companion paths, hand-extend the vocab; forgetting the `skills/{x}/mistakes.md` companion line means a skill's traps never load. BMAD has a "BMad Builder" scaffolder; Agent OS indexes standards. **Fix:** Claude — a BMAD-BMB-style scaffolder (`gobbi new-skill` / `new-agent`) that stamps the dir, wires companion paths, appends vocab entries. Codex — generated extension indexes fed into the D3-001 skill-discovery preflight. The two compose. License: BMAD MIT (author fresh).

**D3-014 — Refresh-candidate note (informational).** The four anchored harnesses remain the D3 baseline; a shallow refresh queue should be noted, not deep-researched this pass — BMAD/Aider, OpenHands/SWE-agent, LangGraph/LangSmith, CrewAI/AutoGen, Cursor/Devin. Treat older claims in the four notes as stale until rechecked. **Fix:** run a later shallow reference refresh producing a dated matrix (mechanism / source URL / license / copy-adapt-ignore) BEFORE any implementation; no reuse from refresh candidates until licenses are checked.

### Differentiator + guardrails

**Differentiator — PROTECTED (D3-009, both systems ahead).** gobbi's dual-system anti-groupthink — two independent model families (Claude + Codex) at BOTH creation and review — is the confirmed lead differentiator, ahead of all four harnesses. Every proposed fix was checked against it; none erodes it.

Two hard guardrails recorded on the fixes:

1. **Semantic memory index (D3-004) must stay ADDITIVE** over the canonical markdown — a rebuildable read-side index, never a DB replacement. Replacing markdown would erode the git-native human-readable design value.
2. **Progressive disclosure (D3-008) must NEVER drop the dual-system load-bearing docs** (`orchestration/workflow/production.md`; `evaluation/SKILL.md` producer/evaluator separation) from the load path. Any slicing work treats their presence as a hard invariant.

Reinforcement, not bypass: the D3-005 staleness re-sync fix is recommended to RUN as its own dual-system loop, and the D3-003 shared-memory idea must never cross into evaluator contexts.

### Score divergences

- **Axes 10 + 11 (sandbox, checkpoint):** Codex `ahead`, Claude `parity-with-gap` → resolved conservatively to `parity-gap`. This is the whole gap between Codex's raw "ahead 3" and the consolidated "ahead 1".
- **Axis 6 (dependency planning):** severity Medium (Claude) vs High (Codex) → pessimistic max = High.
- **Axis 3 (orchestration):** remediation divergence — Claude "no fix, deliberate divergence" vs Codex "optional non-evaluator shared-memory layer". Both kept; shared-memory is a user-decision bounded by evaluator isolation.
- **Axis 7 (install/portability):** both parity-gap, different sub-gap — Claude multi-host breadth vs Codex first-run onboarding diagnostic. Both kept.

## D5 — text-polish

Source (reconciled): `sessions/2026-06-29-0305008a-4073-428a-8094-fbb6d0808dea-d3d5/4-execution/task-02-d5/staging/reviews/d5-reconciled-findings.md`. Claude found 9 candidates, Codex 8; 17 raw deduped to 15 (2 convergent pairs merged). Both halves were a size-ranked SAMPLING of the largest docs + a cross-doc duplication scan — not exhaustive. GUARD preserved: every `drop` names its canonical replacement (drop count = 0); MUST-safety rules stay `keep`-one-full-statement, repeats → pointers.

### Candidates by classification

| Classification | Count | Findings |
|---|---|---|
| `centralize` | 7 | D5-001, D5-002, D5-003, D5-004, D5-005, D5-006, D5-007 |
| `centralize` + `compact` (split) | 1 | D5-008 (worktree write-root — Codex centralize / Claude compact) |
| `compact` | 4 | D5-009, D5-010, D5-011, D5-012 |
| `move` | 1 | D5-013 |
| `keep` | 2 | D5-014, D5-015 |
| `drop` | 0 | — none; no MUST-safety rule marked for deletion |

**Total: 15 deduped findings.** Grouping the split D5-008 under `centralize` gives the headline split **7 centralize / 4 compact / 1 move / 2 keep / 0 drop** (D5-008 carries a compact facet too).

### Per-candidate findings

**D5-001 — Dual-system production "Codex proposer" block restated in all 5 loop skills · centralize · BOTH.** The identical 4-bullet block (proposal artifact / two-phase freeze / producer selective integration "never naive-blend" / degraded-mode label) is fully restated in ideation / preparation / planning / execution / wrap-up SKILLs; only the loop's proposal path differs. ~1.25K duplicated MUST-level words; a freeze/degraded-rule change needs six edits. Canonical owner exists: `orchestration/workflow/production.md`. **Fix:** keep only the loop-specific proposal-path bullet + a one-line pointer to `production.md`. **SAFETY FLOOR:** the MUST-checkable degraded-mode label rule (`production_mode: claude-only` + `codex_proposal_absent_reason`) stays FULLY stated in `production.md` + the `record/SKILL.md:260` mechanical gate.

**D5-002 — Value-telemetry integration-count rule + worked example duplicated (record ↔ orchestration) · centralize · Claude.** The full four-count rule and the worked example ("16 rows split took-codex 4 / merged-selective 9 / kept-own 2 / escalated 1 → ...") are byte-identical in `record/SKILL.md:200-217` and `orchestration/SKILL.md`. **Fix:** keep the rule + example in `record/SKILL.md` (canonical); in orchestration keep the `session.json` field SHAPE, replace the duplicated prose with a pointer.

**D5-003 — Per-perspective evaluation file-naming rule restated in 3 docs · centralize · Claude.** evaluation/orchestration/record all restate the "bare 7-perspective names / no `pN-` prefix / same vocab both systems" rule though `evaluation/SKILL.md:102` is declared the single source. **Fix:** in orchestration + record compact to the local path shape + the existing pointer; drop the re-stated clause. (Mildest centralize candidate.)

**D5-004 — EVALUATION-phase generic procedure table near-identical across loop skills · centralize · Claude.** The 4-row spawn/reconcile/record table is near-identical in ideation / planning / wrap-up; each loop already points to `orchestration/workflow/evaluation.md`. **Fix:** keep each loop's loop-specific Inputs + FAIL-semantics; compact the generic table to a pointer. Do NOT remove loop-specific verdict-routing prose.

**D5-005 — Wrap-up re-derives the area-selection algorithm · centralize · Codex.** `wrap-up/SKILL.md:318-326` names `memory/rules.md §1.5` then repeats explicit-`area:`-wins / tag-map first-match / no-match user-decision / kind-axis / feature normalization almost verbatim. Controlled-vocab rule — duplicated prose invites spec/procedure mismatch. **Fix:** replace with "Apply `memory/rules.md §1.5` exactly. If it resolves no area, return `NEEDS_CONTEXT`. Record the resolved area in the promotion manifest." Keep Wrap-up-specific manifest behavior.

**D5-006 — Staging-field stripping field list has multiple owners · centralize · Codex.** The same strip list + rationale (`mistake-candidate`, `area`, `finding-id`, `disposition`, `promoted-from`, `promoted-at`) repeats in memory / record / wrap-up, with `mistake-candidate` also in mistake. Validator-facing — a future field added to one surface but not others drifts. **Fix:** make `memory/rules.md §2.6` canonical; replace the per-field copies with pointers (keep Wrap-up's `author`/`keywords` auto-stamp behavior).

**D5-007 — Load-Directives companion-path mechanism re-explained outside delegation · centralize · Codex.** Mistake and Wrap-up repeat enough of the companion-path mechanism ("no Skill tool", exact-path loading, `SKILLS LOADED` checklist, per-skill `mistakes.md` companion) to partially define loading outside `delegation/SKILL.md:92-130`. **Fix:** keep delegation canonical; cut the "no Skill tool" mechanism in mistake/wrap-up → pointers; keep gobbi's one-line bootstrap orientation.

**D5-008 — Worktree write-root / `worktreePath` null→error rule has multiple full copies · centralize+compact (SPLIT) · BOTH · SAFETY.** The full clause ("`worktreePath` is always set in normal operation; a `null` value indicates a malformed/partial `session.json` and must be surfaced as an error, not used as a main-tree write signal" + transcript-path exclusion + `git -C` discipline) appears ~6× inside `git/SKILL.md` and again in delegation + orchestration + executor template. Most dangerous drift: one surface preserving null-is-error while another implies main-tree fallback. **Classification divergence:** Codex `centralize` (cross-doc) vs Claude `compact` (intra-doc) — combined fix does both. **Fix:** make `git/SKILL.md § Worktree CWD discipline` the single canonical full statement; compact intra-git mentions and the delegation/orchestration copies to terse pointers; KEEP `executor.md:75-78` as point-of-use commands. **SAFETY FLOOR (both systems): keep ONE complete statement of the irreversible-write null→error rule — never compact it into ambiguity (Principle 7 floor).**

**D5-009 — wrap-up supersede / move-on-terminal "never delete" rule restated 4× in-doc · compact · Claude · SAFETY.** The full mechanic (no-delete invariant + `supersedes`/`superseded_by` plain slugs + `git mv` to `archive/{type}/{area}/{date}-{slug}.md`) restated at `wrap-up/SKILL.md:35`, `:84-86`, `:353`, `:593`. **Fix:** keep the Core Principles statement (`:84-86`) as the single canonical full statement; compact the other three to pointers. **SAFETY FLOOR: do NOT compress the rule itself.**

**D5-010 — wrap-up idempotency stated twice (Matrix + Core Principles) · compact · Claude.** Both `wrap-up/SKILL.md:37` and `:88-90` say the same (re-running produces identical memory; targets deterministic; collision keyed by stable finding-ID). Not a safety rule — clean compact. **Fix:** keep Core Principles; compact the Matrix row to a pointer.

**D5-011 — coding/review.md "available now vs deferred wiring" caveat restated 3-4× · compact · Claude.** The same caveat (manual/standalone use available now; automatic EVALUATION-phase wiring + Load-Directives entry + mirrors + back-links DEFERRED) restated at `review.md:26`, `:358`, `:450`, partially `:464`. **Fix:** keep ONE prominent "Status — available now vs deferred" note (the `:358` callout); compact the others to a pointer. The repetition guards against assuming the doc is wired in — keep one prominent statement.

**D5-012 — Ideation RECORD section repeats shared RECORD mechanics · compact · Codex.** `ideation/SKILL.md:406-452` reprints a full RECORD procedure table, finding-routing + cumulative staging, and declares discussion-log lifecycle canonical though `record/SKILL.md` owns it — with an older narrower staging list. **Fix:** cut `:422-439` → "Run `record/SKILL.md § RECORD Phase` with `loop=ideation`, `N=1`, and the inputs above." Change `:441` to a pointer; keep inputs/outputs (update to canonical output vocabulary).

**D5-013 — Code-review taxonomy too large for the parent playbook · move (the only move candidate) · Codex.** `coding/review.md:42-346` (~3,700 words, 13 review points) is reference taxonomy, not a step-by-step safety gate; it delays the Review Procedure at `:347`. **Fix:** move the taxonomy to a child doc (`skills/coding/review-taxonomy.md`); leave a compact index table (13 point names + one-line checks + link); keep `review.md:347+` procedure inline. **Canonical replacement is the new child doc — NOT deletion.**

**D5-014 — wrap-up Staging→Memory routing table + 5-stage pipeline — long because procedural/safety · keep · Claude.** The largest target (~10K words); its longest sections are the promotion ROUTING CONTRACT and the gated 5-stage pipeline (non-skippable Stage-3 gate, irreversible-git-last). Length is necessity — distinct routing rows + ordered gated stages, not repeated prose. **Fix: NO cut.** The genuine intra-doc redundancy is handled by D5-009 + D5-010.

**D5-015 — git Procedures section long but should stay inline · keep · Codex.** `git/SKILL.md:192-316` (P1-P8) holds the ordered git lifecycle, destructive-operation gates, PR merge ordering, squash-merge branch-deletion carve-out, worktree cleanup guard, CI recovery, retro-sweep TOCTOU discipline. Splitting would make operators jump between docs during destructive/network actions. **Fix: NO content cut.** At most a short procedure index; keep P1-P8 in the same file with exact destructive-operation wording.

### MUST-safety confirmation + filler PASS

- **No `drop` candidate exists — drop count = 0.** No MUST-safety rule was marked for deletion. Every safety-relevant rule is `compact` / `centralize` with an explicit keep-one-full-statement floor: D5-008 (`worktreePath` null→error), D5-009 (wrap-up no-delete / move-on-terminal), and the degraded-mode label rule inside D5-001. The two `keep` candidates (D5-014, D5-015) confirm the safety-critical procedural sections stay whole.
- **D5.4 filler scan — ZERO hits (PASS).** A scan for common filler/hedging phrases (`it's worth noting`, `basically`, `in order to`, `at the end of the day`, …) returned ZERO hits across all 10 sampled targets — the sampled corpus is Principle-7 clean. D5.4 produced no material finding.
- **Negative scans (no finding):** "find -L for symlinks" charter candidate — hits only 2 SCRIPT files, not duplicated skill prose. Background-Codex / Seed-D scan — one owning hit only (`skills/codex/mistakes.md:12`), no duplication.

## Cross-dimension triangulation

D3 independently surfaced **staleness re-sync (D3-005, High)** and **live progress visibility (D3-002, Medium)** as its two top capability gaps — from a harness-comparison lens, with no knowledge of cycle 1. These are the SAME two issues cycle 1 found from different angles: D1-S5 raised the staleness gap as a per-skill memory-discipline concern, and D7 raised live progress visibility as a live-session UX concern (the todo-list seed finding). Three independent lenses — harness comparison (D3), per-skill depth (D1), and live-session UX (D7) — converging on the same two gaps is a strong priority signal: these are not lens artifacts, they are real top-priority gaps. The fix-backlog flags both as the highest-value items. D5-008 / D5-001 (token-economy duplication) also tie to D3-008 (progressive disclosure), linking the text-polish pass to the doc-density capability gap.

## Outcome

Review-only. 29 findings (D3 14 + D5 15) staged for the fix-backlog at `backlogs/evaluation/fix-d3-d5-review-findings.md`; no source edited. The differentiator (D3-009) is confirmed and protected by two hard guardrails. The 5 both-agree `behind` axes are the highest-value capability gaps, with staleness re-sync (D3-005) and dependency-aware planning (D3-006) carrying the High severities. The user decides scope and priority for any fix work in a future scoped session.

## Open items

All 29 findings `open`; none auto-applied. The two D3 guardrails (additive index; progressive disclosure must keep dual-system docs) are constraints on any future fix, not fixes themselves. D2 / D4 / D6 charter dimensions remain unreviewed — see the handoff note.

## Related

- [[fix-d3-d5-review-findings]] — the fix-backlog queuing these 29 findings
- [[d3-d5-adversarial-review-executed]] — the session journal for this cycle-2 review
- [[review-handoff-d2-d4-d6]] — the next-session handoff (D2 / D4 / D6 remain)
- [[adversarial-review-charter-authored]] — cycle-0 note: the charter this review executes
