---
name: adversarial-review-charter
description: Executable charter for the next-session deep dual-system adversarial review of gobbi (agents + skills + plugin)
type: plans
scope: project
feature: null
status: superseded
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: [planning, process]
keywords: [adversarial-review, charter, dual-system, gobbi-surface, seven-dimensions, review-methodology]
author: claude
task: Author a detailed adversarial-review charter for gobbi (agents + skills + plugin)
task_count: 7
supersedes: null
superseded_by: codex-conducted-adversarial-review-charter
archived_at: 2026-07-20
archive_reason: superseded
---

# Adversarial-Review Charter for gobbi

This document is a **charter**, not a review. It is the executable spec a future session
follows to run a deep, dual-system adversarial review of gobbi — its agents, its skills, and
its plugin package. The next session executes the review from this document alone; it should
not need the session that wrote the charter.

**What this charter gives you:** seven review dimensions (D1–D7) with concrete, checkable
review points; seven end-to-end lifecycle scenarios (S1–S7); a by-dimension run methodology
with a per-pass budget and a background-Codex discipline; a severity/priority/confidence
scheme that reuses gobbi's own enums; a single finding-record shape that passes the memory
validator; a register of pre-verified seed findings; a reference-harness comparison; and
acceptance/exit criteria plus a verification-commands appendix.

**What this charter is NOT:** it is not the review, and it does not fix anything. The review
is **review-only** — it surfaces findings and a clearly-labeled *suggested* direction for the
one staleness gap, but it builds and changes nothing unless the user later opens a separate
Execution session. (Memory-staleness re-sync is a SUGGESTION, never a committed deliverable —
see Decision-5 and S5.)

> **Production note:** this charter was produced in `propose.mode: single` — a deliberate
> Claude-only run. This is NOT degraded mode; there is no Codex proposal to integrate and no
> degraded-mode label. The design it finalizes (`1-ideation/outputs/charter-design.md`) WAS
> dual-system produced and dual-system evaluated (REVISE → revised → frozen). This Execution
> task expands and finalizes that locked design; it does not redesign it.

---

## How to run this review next session

A fresh manager can execute the whole review by following these steps in order. Each step
points at the charter section that details it.

1. **Pass 0 — scope-lock & context load.** Confirm with the user that this is review-only
   (no source edits). Capture the current commit, branch, session id, and worktree path. Load
   `principles`, project rules, `mistake`, and the core workflow skills BEFORE reviewing. See
   [Methodology § Pass 0](#pass-0--configuration--scope-lock).
2. **Pass 0.5 — inventory & relevance map.** Build the file-list-with-word-counts table (start
   from [Source inventory](#source-inventory--coverage-split)) and the dimension→files
   relevance map. Each later pass reads ONLY its mapped files. See
   [Methodology § Pass 0.5](#pass-05--shared-surface-inventory--relevance-map).
3. **Run one dual-system pass per dimension (D1–D7).** Each pass: a Claude reviewer and a
   Codex reviewer read the same mapped files independently, each applies the dimension's
   checkable points from [The seven review dimensions](#the-seven-review-dimensions-d1d7), and
   writes findings in the [Per-finding record shape](#per-finding-record-shape). **D2 and D4
   are whole-surface passes — they MUST sub-chunk** (see [Methodology](#sub-chunk-fallback-for-whole-surface-passes)).
   **Every Codex pass runs as a background `codex exec` + poll** — never a foreground
   `timeout 1200` (the host Bash tool kills it at ~10 min; Seed D).
4. **Score & record every finding** with the [Severity/priority/confidence scheme](#severity-priority--confidence-scheme),
   into ONE `reviews/` file (frontmatter) + per-finding BODY entries.
5. **Reconcile** the Claude and Codex finding sets per pass (pessimistic union; divergence is
   the signal), collecting into the one `reviews/` file. See [Methodology § Aggregation](#aggregation).
6. **Check the exit criteria** in [Acceptance & exit criteria](#charter-acceptance--next-session-exit-criteria),
   then RECORD and let Wrap-up promote the outputs.

Pass order: Pass 0 → Pass 0.5 → D1 → D2…D7 in any order after the inventory. Schedule **D2 and
D4 when context is freshest** — they are the two expensive sub-chunked passes.

---

## Scope contract & coverage split

> The scope contract below is LOCKED from the Ideation design (Decisions 1–5 are user-locked).
> Do not widen or narrow it without a fresh user decision.

### In-scope (for the next review session)
- Review gobbi's whole SYSTEM surface (agents + skills + plugin package) against (a) its own
  end-to-end lifecycle, (b) cross-document consistency, and (c) peer harnesses.
- Apply all seven dimensions (D1–D6 are the user's original six; D7 is the user-approved
  seventh, live-session UX — Decision-4).
- Sweep for siblings of the pre-verified seed findings (Seeds A/B/C/D + the corrected
  second-mirror fact).
- Review memory-staleness (S5) as a findings area and record a *suggested* future direction
  (review-only — Decision-5).
- Emit findings via RECORD + Wrap-up — never ad-hoc memory writes.

### Coverage split (corpus scope — two tiers, neither silently skipped)
The review surface has two tiers; the charter scopes each EXPLICITLY:

- **SYSTEM surface — EXHAUSTIVE target.** agents + skills (+ plugin package). Verified size
  **≈ 214K words** (skills `.md` 205,446 + agents `.md` 8,523 = **213,969**) across **83 `.md`
  files (78 skill + 5 agent) + 5 agent `.toml` = 88 files**, plus the plugin package. Reviewed
  file-by-file.
- **STORED MEMORY-TREE content — SAMPLED, not exhaustive.** The `.gobbi/projects/gobbi/`
  memory tree (`features`/`mistakes`/`rules`/`decisions`/`design`/`notes`/`backlogs`/
  `references`/`learnings`/`reviews`/`reports`/`plans`/`archive`) adds **≈ 127K words**
  (verified **126,627**). Total project markdown outside `sessions/`/`worktrees/`
  **≈ 341K words** (verified **341,319**). The memory-tree CONTENT is covered via D1's
  staleness review (S5) by **SAMPLING + mechanism review**, NOT a file-by-file audit. The
  memory *mechanism* docs (`memory/rules.md`, `memory-map.md`, templates, vocabulary) ARE in
  the exhaustive system surface, because they are skills.

(All four numbers above were re-verified against the live repo while finalizing this charter.)

### Out-of-scope
- Editing any gobbi skill / agent / plugin / rule (review-only this session).
- Running the actual fixes for any finding (deferred — backlogs `run-deep-adversarial-review`,
  `fix-confirmed-seed-findings`).
- An EXHAUSTIVE file-by-file audit of the full ~341K corpus — memory-tree content is sampled.
- Building the automated cross-layer drift validator (issue #258) — backlog
  `automated-cross-layer-drift-validator`.
- BUILDING a memory-staleness re-sync mechanism — Decision-5 keeps staleness REVIEW-ONLY; the
  charter records the gaps + a labeled SUGGESTED direction, never a committed build.

### Decisions locked (binding; not re-opened)
- **Decision-1** — Charter durable home: `plans/workflow/2026-06-29-adversarial-review-charter.md`;
  the next session's FINDINGS go to a separate file `reviews/adversarial-review/{date}-gobbi-adversarial-review.md`.
- **Decision-2** — Reuse gobbi's existing enums EXACTLY (severity `Critical/High/Medium/Low`;
  confidence `0/25/50/75/100`; priority `critical/high/medium/low`; disposition
  `open/addressed/disputed/deferred/superseded`). No new `S0-S3`/`P0-P3` vocabulary.
- **Decision-3** — Partition is BY DIMENSION (one dual-system pass per dimension), with a
  per-pass budget + sub-chunk fallback for whole-surface passes.
- **Decision-4** — Include live-session UX as the seventh dimension, D7.
- **Decision-5** — Staleness review is review-only; the re-sync mechanism is a labeled
  SUGGESTION, not a deliverable.

---

## Source inventory & coverage split

This table is the seed for the Pass-0.5 inventory. The next session refines exact per-file
word counts at Pass 0.5; the totals below are verified.

| Surface | What it holds | Count / size (verified) | Coverage |
|---|---|---|---|
| Skills (`.gobbi/projects/gobbi/skills/`) | 22 skill dirs, each `SKILL.md` + children (`mistakes.md`, child docs, `templates/`, `scripts/`) | 78 `.md` files; 205,446 words | EXHAUSTIVE |
| Agents (`.gobbi/projects/gobbi/agents/`) | 5 role prompts (`assistant`, `evaluator`, `executor`, `leader`, `manager`) | 5 `.md` + 5 `.toml`; 8,523 words (`.md`) | EXHAUSTIVE |
| Rules docs | `.claude/CLAUDE.md` (Claude) + `AGENTS.md → .codex/AGENTS.md` (Codex) | 2 entry rules docs | EXHAUSTIVE |
| Claude mirror (`.claude/skills/`) | per-FILE symlink mirror | 21 skill dirs (MISSING `coding`); 0 `scripts/` subdirs (INCOMPLETE) | EXHAUSTIVE (D6) |
| Codex mirror (`.agents/skills/`) | whole-DIR symlink mirror | 22 skill dirs (incl. `coding`); 4 `scripts/` via `find -L` (COMPLETE) | EXHAUSTIVE (D6) |
| Plugin package (`plugins/gobbi/`) | `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, whole-dir symlinks `skills`/`agents`/`hooks` | 2 manifests + 3 symlinks | EXHAUSTIVE (D6) |
| Plugin/sync scripts (`scripts/`) | `sync-plugin-package.sh`, `check-codex-plugin-smoke.sh`, `check-plugin-invocability.sh`, `check-codex-compatibility.sh`, `validate-plugin-hooks-fire-once.sh` | 5 scripts | EXHAUSTIVE (D6) |
| Canonical guard scripts (`skills/*/scripts/`) | 13 `.sh` (git 1, memory 1, orchestration 9, record 2) | 13 scripts | EXHAUSTIVE (D2/D4/D6) |
| Codex agent wrappers (`.codex/agents/`) | 5 `.toml` + `config.toml` + `.codex/AGENTS.md` | 5 wrappers | EXHAUSTIVE (D2/D6) |
| Session-runtime surfaces | `session.json` / `settings.json` / `state.json` schemas, loop dirs | schema docs in skills | EXHAUSTIVE (D1/D7) |
| Memory tree (`.gobbi/projects/gobbi/`, non-skill) | 16 memory types incl. `features`/`mistakes`/`rules`/`decisions`/`design`/`notes`/`backlogs`/`references`/`learnings`/`reviews`/`reports`/`plans`/`archive` | 126,627 words | SAMPLED (D1/S5) |

A "stranger-read test" for the inventory: a fresh agent should be able to name what to review
and where, from this table alone, without asking a question.

---

## Dimension vs perspective — disambiguation

The charter's **7 review DIMENSIONS** (D1–D7) are the AXES OF WHAT THE NEXT SESSION REVIEWS.
They are a DIFFERENT axis from gobbi's **7 evaluation PERSPECTIVES** (`project` / `structure` /
`performance` / `aesthetics` / `usage` / `consistency` / `risk`), which are the lenses an
EVALUATOR applies to ANY artifact (including this charter). The two sevens are unrelated; the
numeric coincidence is accidental. A review pass for a dimension may itself be evaluated across
the 7 perspectives.

---

## The seven review dimensions (D1–D7)

Each dimension below carries: its **scope**, the **files the pass reads** (the relevance-map
row), whether it is a **whole-surface (sub-chunked)** pass, and a **checkable review-point
set** grouped by category. Every point states the **check** (file/area + property), the
**pass** condition, and the **fail signal** an observer marks against — plus the **likely
severity** if confirmed. Points are concrete enough to mark pass/fail against real gobbi files;
they are not padding. Where a representative point names a confirmed seed, the next session
treats the seed as instance 1 and sweeps for siblings.

> **Evidence rule for every point (load-bearing).** No grep-only conclusion for an absence
> claim. A grep/`find` result is a *candidate list*, not a finding — READ the owning section
> before concluding. Use `find -L` / `readlink -f` + `test -e` for ANY mirror/symlink check
> (plain `find`/`grep` does not follow symlinks and produced the iter1 false `.agents`
> conclusion — Seed F lesson).

---

### D1 — End-to-end lifecycle (scenarios + checklists)

**Scope:** does gobbi's documented surface support its full lifecycle end to end — install,
run, init, evolve, stay-fresh — with every loop's output matching the next loop's input?
**Files the pass reads:** `orchestration/SKILL.md` + `orchestration/workflow/*`, the 5 loop
skills (`ideation`/`preparation`/`planning`/`execution`/`wrap-up`), `gobbi`, `interview`,
plugin install docs, the session-runtime surface docs (`session.json`/`settings.json`/
`state.json`); plus a SAMPLE of memory records for staleness (S5).
**Whole-surface?** No (mapped subset + sample).
**Detail:** the seven scenarios S1–S7 are in [E2E lifecycle scenarios](#e2e-lifecycle-scenarios-s1s7);
each scenario's checklist is part of this dimension.

Checkable review points:

- **[D1.1] Loop-output ↔ next-loop-input schema match.** Check: for each loop transition
  (ideation→preparation→planning→execution→wrap-up), the producing loop's documented
  `outputs/` shape vs the consuming loop's documented `inputs`. Pass: every output field the
  next loop expects is produced. Fail: a loop expects an input field no prior loop documents
  producing. Severity: High.
- **[D1.2] Skill-load reference resolution.** Check: every "load the X skill" / Load-Directives
  reference inside the lifecycle skills resolves to an existing skill dir. Pass: all resolve.
  Fail: a referenced skill dir is absent (e.g. the `claude` doc-authoring skill — see Seed in
  D2). Severity: High.
- **[D1.3] Sub-phase coverage per loop.** Check: each productive loop documents all four
  sub-phases DISCUSSION → WORK → EVALUATION → RECORD with an owner. Pass: all four present and
  owned. Fail: a loop omits a sub-phase or leaves it unowned. Severity: Medium.
- **[D1.4] Dual-system production + evaluation fire points.** Check: the docs state where
  `propose.mode: dual` production and the two-evaluator EVALUATION run, and where degraded mode
  is stamped. Pass: both are documented with the degraded-mode label. Fail: a loop claims
  dual-system but never names the Codex spawn or the degraded-mode stamp. Severity: Medium.
- **[D1.5] Wrap-up ordering (git finalization last).** Check: `wrap-up/SKILL.md` 5-stage
  pipeline orders promotion before the validation gate and git finalization LAST. Pass: order
  matches CLAUDE.md's stated pipeline. Fail: a stage order in `wrap-up` contradicts CLAUDE.md.
  Severity: High.
- **[D1.6] Failure / REVISE paths are documented, not just PASS.** Check: each loop documents
  what happens on REVISE and FAIL (iteration cap, escalation), not only the golden PASS path.
  Pass: REVISE + FAIL routing is documented per loop. Fail: a loop documents only the PASS
  path. Severity: Medium.
- **[D1.7] Runtime state surfaces match the prose workflow.** Check: `session.json` /
  `settings.json` / `state.json` transitions described in skills match the prose lifecycle
  (e.g. `workflow.{loop}` keys, the `{N}-` loop-dir prefix vs bare session.json keys per
  SEAM-3). Pass: state schema and prose agree. Fail: a phase references a path or state key not
  in the canonical tree. Severity: High.
- **[D1.8] Memory-tree staleness is reviewed (sampled).** Check: run S5a/b/c against the
  staleness MECHANISM docs (read in full) + a SAMPLE of N records per memory type. Pass: the
  staleness gaps are characterized with evidence. Fail: the review skips the staleness family.
  Severity: Critical (this is the user-flagged centerpiece). Review-only per Decision-5.

---

### D2 — Completeness of agents + skills (incl. BETWEEN-skill load)

**Scope:** is each skill/agent self-complete, and does the skill-load graph connect — every
skill reachable, every hand-off naming its successor, no dead-ends or orphans?
**Files the pass reads:** ALL skills + agents (the load graph is inherently whole-surface).
**Whole-surface?** **YES → sub-chunk** (4 ordered sub-chunks + merge — see Methodology).

Checkable review points:

*Category — per-skill self-completeness*
- **[D2.1] Skill frontmatter completeness.** Check: each `SKILL.md` carries `name`,
  `description`, and `allowed-tools`. Pass: all three present. Fail: a SKILL.md omits one.
  Severity: Medium.
- **[D2.2] Skill states trigger + writes + outputs + constraints + exit.** Check: each skill
  documents when it loads (trigger), its write surfaces (Memory Access Matrix), its outputs,
  its constraints, and its exit/handoff. Pass: all five present. Fail: a skill omits one (e.g.
  no exit criteria). Severity: Medium.

*Category — skill→skill handoff graph*
- **[D2.3] Build the load graph; flag referenced-but-absent skills.** Check: from every "load
  the X skill" / Load-Directives / `required-skills` reference, build the directed load graph;
  every target must be an existing skill dir. Pass: every edge resolves. Fail: a referenced
  skill dir does not exist. **Confirmed seed (instance 1):** `.claude/CLAUDE.md:61` and
  `skills/gobbi/SKILL.md:192` (FLAG-2) reference `skills/claude/SKILL.md`, but no `claude`
  skill dir exists. Severity: High. Sweep for any other dangling skill reference.
- **[D2.4] Flag orphan skills (present but unreferenced).** Check: each of the 22 skill dirs is
  the target of at least one load reference (directly or via the skill map). Pass: no orphans.
  Fail: a skill nothing loads. Severity: Medium.
- **[D2.5] Hand-off names the successor + the load directive to reach it.** Check: a skill that
  must pass control onward names the next skill AND the directive to load it. Pass: the
  successor is named and loadable. Fail: a between-skill dead-end (control should advance but no
  successor is named). Severity: Critical (a dead-end can stall a workflow).
- **[D2.6] No contradictory cross-skill instruction for the same role + surface.** Check: two
  co-loaded skills must not give the same role opposite instructions for the same write
  surface. Pass: instructions are consistent. Fail: a contradiction. **Confirmed specimen
  (instance 1):** `research/SKILL.md:30-31` says the leader does NOT write `staging/references/`
  during WORK (the assistant promotes on PASS); `ideation/SKILL.md:81,251` describe the
  leader's external-reference list as "ready for WORK to stage at `staging/references/`". Read
  both in full and resolve whether WORK or RECORD owns the reference-staging write. Severity:
  High.

*Category — role + runtime coverage*
- **[D2.7] The 5 roles cover every sub-phase.** Check: each loop sub-phase (DISCUSSION / WORK /
  EVALUATION / RECORD) maps to a role (`manager` / `leader` / `executor` / `evaluator` /
  `assistant`) in the agent docs. Pass: full coverage. Fail: a sub-phase with no owning role.
  Severity: Medium.
- **[D2.8] TOML wrappers point to matching `.md` prompts.** Check: each `.codex/agents/*.toml`
  (and each `agents/*.toml`) names the `.md` prompt that exists. Pass: every wrapper resolves
  to its prompt. Fail: a `.toml` references a missing or renamed `.md`. Severity: High.

*Category — dual-system production integrity*
- **[D2.9] Producer cannot synthesize a third proposal.** Check: the production docs state the
  producer SELECTS from the frozen Claude/Codex drafts and never authors a blended third draft.
  Pass: selective-integration discipline is stated. Fail: the docs allow a synthesized blend.
  Severity: Medium.
- **[D2.10] No Claude-only-tool dependency where Codex must participate.** Check: a step that
  requires Codex does not depend on a tool only Claude Code has. Pass: Codex-participating
  steps are runtime-portable. Fail: a Codex step needs a Claude-only tool. Severity: Medium.

---

### D3 — Missing features / weaknesses vs reference harnesses

**Scope:** where is gobbi ahead, at parity, or behind the peer harnesses — and for each gap,
what concrete mechanism is the directional fix?
**Files the pass reads:** `staging/references/*` (the four staged harness notes) + gobbi
capability docs (`orchestration`, `memory`, `evaluation`, `delegation`).
**Whole-surface?** No.
**Detail:** the full axis × harness matrix and the candidate set are in
[Reference-harness comparison](#reference-harness-comparison).

Checkable review points:

- **[D3.1] Score every axis with evidence, not marketing.** Check: for each of the ~13
  comparison axes, mark gobbi `ahead` / `at-parity` / `behind` with a cited gobbi mechanism and
  a cited harness mechanism. Pass: each cell has evidence. Fail: a cell rests on a marketing
  claim or no citation. Severity: Medium.
- **[D3.2] Every "behind" cites a concrete directional fix.** Check: for each axis marked
  `behind`, name the harness's concrete mechanism as the directional fix (e.g. superpowers
  todo-from-checklists for live progress; Agent-OS "Discover Standards" for staleness re-sync).
  Pass: each `behind` has a named mechanism. Fail: a `behind` with no proposed direction.
  Severity: Medium.
- **[D3.3] Refresh the candidate set at review time.** Check: the four researched harnesses
  (superpowers / claude-flow / claude-task-master / agent-os) are the anchored baseline; the
  refresh candidates (BMAD, Aider, OpenHands/SWE-agent, LangGraph/LangSmith, CrewAI/AutoGen,
  Cursor/Devin) are checked against current sources, not assumed. Pass: the set is refreshed.
  Fail: the comparison assumes a stale market state. Severity: Low.
- **[D3.4] License/IP check before recommending a borrowed mechanism.** Check: before
  recommending reuse of any harness mechanism, verify the source's license/IP permits the
  pattern's reuse. Pass: a license note accompanies each borrow recommendation. Fail: a
  recommendation to copy a mechanism with no license check. Severity: Medium.
- **[D3.5] Protect the differentiator.** Check: the comparison confirms gobbi's dual-system
  anti-groupthink (create + review) is named as the lead differentiator and not eroded by any
  proposed fix. Pass: differentiator preserved. Fail: a proposed fix that weakens dual-system.
  Severity: Medium.

---

### D4 — Naming / conventions / doc-style / quality

**Scope:** is naming consistent (kebab-case, one term one meaning), do self-reported counts
match reality, is doc-style uniform, and does every doc meet the zero-context readability bar?
**Files the pass reads:** ALL skills + agents (counts + terms + glossary conformance).
**Whole-surface?** **YES → sub-chunk** (4 ordered sub-chunks + merge).

Checkable review points:

*Category — naming conformance*
- **[D4.1] Slug / kebab-case conformance.** Check: file and memory slugs follow the
  `memory/rules.md` §1 naming standard (kebab-case, ≤6 words, no positional/sequence index, no
  status/version words). Pass: slugs name the subject. Fail: a slug uses a session coordinate
  (`task-01`, `row-5-5`, `iter2`) or a status word (`final-`, `v2-`). Severity: Low.
- **[D4.2] Cross-skill term consistency (one term, one meaning).** Check: each canonical state
  / sub-phase / stage name is used with one meaning across skills; no near-synonym for a
  canonical state. Pass: terms are consistent. Fail: two docs use different words for the same
  state, or one word for two states. Severity: Medium.
- **[D4.3] Glossary-vocabulary conformance.** Check: phase / sub-phase / stage / role names
  match the canonical Glossary in `gobbi/SKILL.md`. Pass: names match the Glossary. Fail: a
  skill uses a non-Glossary name for a canonical concept. Severity: Medium.

*Category — count / fact drift*
- **[D4.4] Self-reported counts match reality.** Check: grep every self-reported count (skill
  count, agent count, perspective count, type count, hook count) and assert it matches the live
  repo. Pass: each count is current. Fail: a stale count. **Confirmed seed (instance 1):**
  `claude-plugin/SKILL.md:240` says "22 skill directories" while L243 quotes `claude plugin
  details gobbi` as `Skills (19)` ("now 22 … re-verify on next CLI check") — an internal count
  tension. Live truth: 22 skill dirs, 5 agents. Severity: Low. Sweep all count claims.
- **[D4.5] "Optional vs mandatory" contradictions across docs.** Check: a step described as
  mandatory in one doc is not described as optional/skippable in another. Pass: consistent.
  Fail: e.g. evaluation called mandatory in CLAUDE.md but skippable elsewhere. Severity: High.

*Category — doc-style + quality bar*
- **[D4.6] Doc-style uniformity.** Check: heading depth, table-vs-prose choice, and link form
  follow the surrounding convention; paths/env-vars/commands are backtick-formatted. Pass:
  consistent with the tree. Fail: an emoji where none are used, an unbackticked path, an
  inconsistent heading ladder. Severity: Low.
- **[D4.7] Dev-doc zero-context readability (memory rules §4).** Check: each memory doc body is
  understandable without the originating session — no load-bearing session coordinate, names
  its subject in the first line, obeys its type's section contract, does one type's job. Pass:
  self-contained. Fail: a doc whose meaning needs a vanished session (a `decisions/` doc that
  is really a session journal). Severity: Medium.
- **[D4.8] Doc↔script path resolution (consistency half of Seed C).** Check: every script path
  a skill doc references resolves from the doc's own location. Pass: resolves. Fail: a doc
  references `scripts/...` that does not resolve from where the doc is read (the `.claude`
  mirror case — see D6). Severity: High.

---

### D5 — Text polishing (drop / compact / move / centralize candidates)

**Scope:** where is the prose redundant, duplicated across skills, over-long, or filler against
Principle 7 — and what is the precise, safe cut?
**Files the pass reads:** the large docs ranked by size (`wrap-up`, `evaluation`, `git`,
`orchestration`, `record`, `delegation`, `ideation`, …) + a cross-doc duplication scan.
**Whole-surface?** Partial (size-ranked + duplication scan).

Each D5 candidate carries a **classification** (do not propose a raw delete):
`drop` (duplicated/obsolete, a canonical home exists elsewhere) · `compact` (verbose; preserve
behavior in fewer words) · `move` (specialist detail → child doc) · `centralize` (one rule
duplicated across skills → one owner + pointers) · `keep` (long because safety-critical /
procedural).

Checkable review points:

- **[D5.1] Cross-doc duplication → centralize.** Check: a rule restated in N skills (e.g. the
  dual-system production rule, the worktree write-path rule) has ONE canonical home; the rest
  point to it. Pass: one owner + pointers. Fail: the same rule fully restated in multiple
  skills. Classification: `centralize`. Severity: Low.
- **[D5.2] Intra-doc redundancy → compact.** Check: a section repeats a point already made in
  the same doc. Pass: stated once. Fail: a paragraph restating an earlier paragraph.
  Classification: `compact`. Severity: Low.
- **[D5.3] Over-long sections → split/trim.** Check: list sections over ~1500 words and propose
  a split or a specific trim. Pass: long sections justified as procedural/safety. Fail: a long
  section that is long from verbosity, not necessity. Classification: `compact` or `move`.
  Severity: Low.
- **[D5.4] Filler vs Principle 7.** Check: hedging / throat-clearing / metaphor that Principle
  7 forbids. Pass: plain literal prose. Fail: filler ("it's worth noting that", "basically").
  Classification: `compact`. Severity: Low.
- **[D5.5] Restating CLAUDE.md / the Glossary without local behavior → drop/move.** Check: a
  section that restates the top-block or Glossary without adding local behavior. Pass: adds
  local behavior or points to the canonical text. Fail: a pure restatement. Classification:
  `drop` (with the canonical replacement named) or `move`. Severity: Low.

**Guards (mandatory):** never recommend a deletion without naming the canonical replacement;
never compact a MUST-level safety rule into ambiguity (Principle 7's floor).

---

### D6 — Plugin deployment readiness

**Scope:** are the manifests correct, does install work in both ecosystems, and do BOTH mirrors
expose every canonical skill + `scripts/` subdir (checked by FOLLOWING symlinks)?
**Files the pass reads:** `plugins/gobbi/` (both manifests + the symlinks), the marketplace
config, BOTH mirrors (`.claude/skills/`, `.agents/skills/`), the 13 canonical scripts + the 5
root plugin scripts, `hooks/`, and `codex/SKILL.md`.
**Whole-surface?** No.

> **Symlink discipline (load-bearing):** every mirror/package check uses `find -L` /
> `readlink -f` + `test -e`. Plain `find`/`ls` does NOT follow the `.agents` whole-dir symlinks
> and yields a false-negative (the iter1 error that wrongly blamed `.agents`).

Checkable review points:

*Category — manifest correctness*
- **[D6.1] Claude manifest carries no component keys.** Check: `plugins/gobbi/.claude-plugin/plugin.json`
  has NO `skills`/`agents`/`hooks` keys (CLI v2.1.159 fails to load with them). Pass: metadata
  only. Fail: a component key present. Severity: Critical (breaks install).
- **[D6.2] Codex manifest declares components explicitly.** Check:
  `plugins/gobbi/.codex-plugin/plugin.json` (+ `codex-hooks.json`) declares its skills/hooks as
  Codex requires. Pass: explicit declaration loads. Fail: missing required declaration.
  Severity: High.
- **[D6.3] Version is bumped, not SHA-pinned.** Check: `plugin.json` `version` increments on
  release (no git-SHA-only pin that blocks `claude plugin update`). Pass: semantic version
  bumped. Fail: SHA-only version. Severity: Medium.

*Category — mirror sync (the seed cluster)*
- **[D6.4] Both mirrors expose every canonical skill (symlink-following).** Check:
  `diff <(ls .claude/skills) <(ls .agents/skills)` plus a per-skill `test -e` of the canonical
  `SKILL.md` via each mirror. Verified state: `.agents/skills/` (whole-dir symlinks) is
  COMPLETE (22 skills incl. `coding`); `.claude/skills/` (per-file symlinks) is INCOMPLETE
  (21 skills, MISSING `coding`). Pass: both expose all 22. Fail: a mirror missing a skill — the
  `.claude` mirror is the confirmed fix target. Severity: High.
- **[D6.5] Both mirrors expose every canonical `scripts/` subdir (symlink-following).** Check:
  `find -L .claude/skills -type d -name scripts` and `find -L .agents/skills -type d -name
  scripts`. Verified state: `.agents` → 4 (`record`/`git`/`memory`/`orchestration`, COMPLETE);
  `.claude` → 0 (INCOMPLETE — the per-file mirror copies `*.md`/`templates/` but not
  `scripts/`). Pass: both expose all 4. Fail: a mirror missing `scripts/` — `.claude` is the
  confirmed fix target (Seed B). Severity: High.
- **[D6.6] Doc-referenced script paths resolve from EVERY read location (Seed C).** Check: each
  script path a skill doc references resolves from canonical, from BOTH mirrors (via
  symlink-following), AND from the package symlink. **Confirmed seed (instance 1):**
  `.claude/skills/memory/rules.md` references `scripts/validate-frontmatter.sh` and
  `../orchestration/scripts/*.sh` that do NOT resolve from the `.claude` mirror (canonical
  resolves). Pass: resolves everywhere read. Fail: a path that breaks a guard at runtime from a
  read location. Severity: Critical (a non-resolving path breaks a guard).

*Category — install flow + cache*
- **[D6.7] Package symlinks resolve post-install.** Check: `plugins/gobbi/{skills,agents,hooks}`
  whole-dir symlinks resolve, and `scripts/sync-plugin-package.sh --check` + the within-
  marketplace symlink behavior (dereference vs skip) are documented. Pass: symlinks resolve and
  behavior is documented. Fail: a dangling package symlink or undocumented dereference.
  Severity: High.
- **[D6.8] Installed-cache vs source-package distinction.** Check: `scripts/check-codex-plugin-smoke.sh`
  REPORTS installed-cache omissions as an upstream/plugin-install limitation; docs distinguish
  "source-package support" from "installed-cache behavior" and never materialize (real-copy)
  the source to hide the limitation. Pass: distinction documented; smoke script reports. Fail:
  the repo materializes sources to mask the cache limitation. Severity: High.
- **[D6.9] Codex `codex exec` budget matches the host harness (Seed D).** Check: any documented
  `codex exec` invocation's timeout matches what the calling harness grants. `codex/SKILL.md`
  specifies `timeout 1200` for the proposer (L153/L160/L171), but the Claude Code Bash tool has
  a ~10-min hard cap that kills a foreground run. Pass: documented `codex exec` patterns the
  next session relies on use a background-run + poll. Fail: a documented pattern assumes a
  budget the host does not grant. Severity: Medium. (See Methodology — every Codex review pass
  runs background + poll.)

---

### D7 — Live-session UX / progress-visibility (Decision-4, the seventh dimension)

**Scope:** can the user see what is happening during a running session — current phase /
sub-phase / iteration, the active artifact, the next action, queued work, what each spawned
agent is doing, blockers, and pending user decisions — and is the visible state linked to the
file-backed source of truth?
**Files the pass reads:** `manager`, `orchestration` (+ `agent-teams`), `execution`,
`planning`, `discussion`.
**Whole-surface?** No. Cross-cutting.
**Prior art:** superpowers builds live todo lists from skill checklists.

Checkable review points:

- **[D7.1] Live todo / task surfacing per phase transition.** Check: the session is instructed
  to create/update/close a USER-VISIBLE task list as phases transition. Pass: a live task
  surface is specified. Fail: no instruction to surface a live, user-facing todo. **Confirmed
  seed (instance 1):** only 2 incidental hits for `TaskCreate|TodoWrite|TaskList|TodoRead`
  across skills+agents — `orchestration/agent-teams.md:136` (`TaskCreated` hook-event name) and
  `agents/manager.md:80` (the manager's own delegation tracking); neither surfaces a live
  user-facing todo. Severity: Medium (High if missing visibility can hide a skipped gate or a
  blocker).
- **[D7.2] Status display.** Check: the docs instruct the session to show the current phase /
  sub-phase / iteration / active artifact / next action. Pass: a status surface is specified.
  Fail: status conveyed only by periodic prose. Severity: Medium.
- **[D7.3] Progress feedback for long-running ops.** Check: long-running subagent/tool ops
  (large skill reads, background `codex exec`) are reflected to the user. Pass: progress is
  surfaced. Fail: the user sees silence during a multi-minute op. Severity: Medium. (Ties to
  S7 — the review itself is long-running.)
- **[D7.4] Blocker + pending-user-decision visibility.** Check: blockers and pending Always-Ask
  decisions are surfaced, not buried. Pass: blockers/decisions are visible. Fail: a pending
  user decision the user cannot see. Severity: High.
- **[D7.5] Runtime parity.** Check: the live-UX instruction works on both runtimes (Claude Code
  TaskCreate/TaskList/TodoWrite vs Codex plan-update equivalents). Pass: both runtimes covered.
  Fail: a live-UX mechanism only one runtime has. Severity: Medium.
- **[D7.6] Source-of-truth rule (no drift).** Check: visible task items are linked to the
  file-backed state (`state.json`), so the in-chat todo cannot drift from the file. Pass: the
  visible surface derives from `state.json`. Fail: an in-chat todo with no file-backed link.
  Severity: Medium. (Method: grep the mapped files for live-task/status instructions, then READ
  each hit in context — no grep-only conclusion.)

---

## E2E lifecycle scenarios (S1–S7)

These are D1's detail: each lifecycle stage gets a golden path, failure/edge variants, and a
checklist (representative items; the next session may extend them at review time). The
staleness family (S5) is the CRITICAL centerpiece, REVIEW-ONLY per Decision-5. These scenarios
are LOCKED from the design.

### S1 — Plugin install (fresh machine → working gobbi)
- **Golden:** user runs `claude plugin marketplace add` + `claude plugin install gobbi`;
  `claude plugin details gobbi` reports the expected Skills/Agents/Hooks counts; `/gobbi`
  bootstraps. Codex peer: `codex plugin marketplace add <repo-root>` + `codex plugin add
  gobbi@gobbi-workspace`; project-trust granted before config/hooks/rules load.
- **Failure/edge:** version pinned to git SHA (no `claude plugin update` increment); manifest
  carries a forbidden `skills`/`agents`/`hooks` key (CLI v2.1.159 load failure); within-
  marketplace symlinks dereference vs skip; Codex install vs Claude install parity; install
  docs for the two ecosystems contradict each other.
- **Checklist:** [ ] `plugin.json` version bumped, not SHA-only. [ ] no component keys in the
  Claude manifest. [ ] package symlinks resolve post-install. [ ] Codex `.codex-plugin/plugin.json`
  + `codex-hooks.json` load. [ ] double-fire caveat (dev + installed) documented. [ ] the user
  can tell which command installs Claude Code vs Codex. [ ] project-trust requirement stated
  before config is expected to load.

### S2 — Run an agentic workflow via gobbi (the 6-step machine end to end)
- **Golden:** `/gobbi` → Configuration → Ideation → Preparation → Planning → Execution →
  Wrap-up; each loop runs DISCUSSION → WORK → EVALUATION → RECORD; dual-system production +
  evaluation fire; Wrap-up promotes staging→memory (git finalization runs LAST).
- **Failure/edge:** a skill that should hand off never names the successor (between-skill
  dead-end); a loop's WORK output schema does not match the next loop's expected input; **no
  live progress is surfaced to the user across the whole run (Seed A → D7)**; Codex proposer
  absent → degraded-mode label; a mandatory gate can be skipped by a settings value;
  failure/REVISE paths undocumented vs PASS-only docs; a phase references a path/state-key not
  in the canonical tree.
- **Checklist:** [ ] every loop's outputs match the next loop's documented inputs. [ ] every
  "load the X skill" reference resolves. [ ] the user can see the active step/sub-phase/
  iteration, the active artifact, and the next action (D7). [ ] degraded-mode is stamped when
  Codex is absent. [ ] mandatory evaluation cannot be settings-skipped where the docs say
  mandatory. [ ] `session.json`/`settings.json`/`state.json` transitions match the prose
  workflow.

### S3 — Project initialization (empty repo → populated memory)
- **Golden:** sparse-memory detection (`gobbi/SKILL.md` step 5) → 5-wave bootstrap interview →
  memory tree populated → workflow resumes.
- **Failure/edge:** interview writes to memory (the bootstrap exception) but a later loop
  assumes an interview output shape that drifted; sparse-check passes on a half-populated tree;
  the manager treats MISSING OPTIONAL memory as fatal; a generated skill/rule bypasses user
  confirmation.
- **Checklist:** [ ] interview output conforms to the memory frontmatter standard. [ ]
  sparse-check thresholds match what downstream loops actually need. [ ] project init does not
  fabricate durable memory without user-confirmed facts.

### S4 — Project EVOLUTION via memory updates (session N → N+1)
- **Golden:** session N stages findings/decisions/mistakes; Wrap-up promotes deterministically
  by type/area; session N+1 loads them at start; the handoff note carries the next-session
  pointer.
- **Failure/edge:** a staged file's area resolves to no-match → user-decision
  (`rules.md` §1.5 step 3); compaction over-cap merge loses per-item lifecycle; promotion
  strips a staging key it should keep (or keeps one it should strip); a loop OTHER than Wrap-up
  writes durable memory without a documented exception; a staging artifact is silently dropped
  (not promoted/backlogged/dropped/deferred-with-reason).
- **Checklist:** [ ] promotion routing matches the type/area selection rule. [ ] handoff names
  the next session's pointer AND every durable write is traceable to an artifact path. [ ]
  compaction preserves per-section anchors + split-on-retire. [ ] every staging file is
  accounted for.

### S5 — Memory STALENESS handling (CRITICAL — detect, prevent, repair) [CENTERPIECE; REVIEW-ONLY per Decision-5]
This is the family the user flagged as critical. gobbi today handles staleness only reactively
(supersession + compaction + backlog pruning) with no session-start staleness audit. **The next
session REVIEWS and DOCUMENTS the staleness gaps below as a findings area (a dedicated staleness
report) — it is NOT obligated to BUILD any fix.** This is the dimension that SAMPLES the ~127K
memory-tree content: read the staleness MECHANISM docs exhaustively (they are skills) and SAMPLE
stored records to test the mechanism, rather than auditing all ~127K words file-by-file. A
clearly-labeled SUGGESTED future direction is recorded at the end.

- **S5a — DETECT.** Scenario: a `design/` or `decisions/` doc references a code path / symbol /
  file renamed or removed three sessions ago. Does any gobbi mechanism flag it? *Today: no.*
  Checklist: [ ] is there a session-start staleness scan? [ ] do memory reads carry freshness
  metadata (last-verified date vs codebase mtime)? [ ] can a reader tell, from the doc alone,
  current guidance vs historical note? [ ] does a `references/` link-rot check exist? [ ] are
  `supersedes`/`superseded_by` pairs bidirectional and resolvable? [ ] do terminal records
  leave the live scan surface (moved to `archive/`)? [ ] does memory validation catch stale
  links, stale vocabulary, stale workflow mirrors, and stale skill-mistake references? [ ]
  (sampling) pick N records per memory type and check each against the current codebase.
- **S5b — PREVENT.** Scenario: a session changes the codebase; which memory docs must co-update
  to avoid going stale? *Today: Principle 6/9 behavioral only.* Checklist: [ ] does Wrap-up
  enumerate memory docs affected by the session's code change (a memory-CRUD plan)? [ ] does the
  dev-doc standard require a "still-true-as-of" marker? [ ] is there a co-touch enumeration for
  memory like the one mistakes require for refs? [ ] do Wrap-up standing guards run AFTER
  promotion? [ ] does Stage-2c compaction run a staleness pre-step before merging? [ ] do
  long-lived docs avoid duplicating volatile instructions that should live in one canonical
  file?
- **S5c — REPAIR.** Scenario: stale memory is found — how is it fixed without losing history?
  *Today: supersession + archive (the no-delete invariant).* Checklist: [ ] is the repair path
  documented (supersede→archive, never delete)? [ ] does repair re-point inbound references (the
  §1.5 refactor procedure / a manifest-driven gate)? [ ] is there an Always-Ask path before
  archival/merge/supersession of a stale-but-live record? [ ] can a false guard-positive be
  fixed by updating the guard's allowlist in the same promotion commit? [ ] does the user get to
  decide whether a stale item is wrong / historical / superseded / still-true?
- **Staleness fail signals:** a durable record contradicts current workflow docs without
  detection; a review cites archived memory as live guidance; compaction merges unrelated
  records to hit a cap; the installed plugin cache holds stale skills/hooks with no warning; the
  next session has no required step to read known mistakes before acting.
- **Cross-session adversarial variant:** two concurrent sessions both update the same memory
  area — does the model handle the race (TOCTOU / trust-origin/develop, per memory note
  `project_v050_pr_fin_1e_merged`)?
- **>> SUGGESTED future direction (Decision-5 — SUGGESTION ONLY, NOT a next-session
  deliverable):** an Agent-OS-style "Discover Standards" re-sync — a session-start (or
  on-demand) pass that re-extracts current facts from the codebase and flags memory records that
  no longer match. The charter records this as a candidate for a FUTURE design session; the next
  (review) session is NOT obligated to build it. Frame any related finding as "gap observed +
  this is a possible direction," never as "must implement."

### S6 — Plugin-cache mismatch (installed cache vs source package)
- **Golden:** source-package symlinks are valid; an installed ecosystem cache (notably Codex)
  omits the symlinked component dirs; `scripts/check-codex-plugin-smoke.sh` REPORTS the
  omission; docs tell the user how to interpret it.
- **Failure/edge:** the repo package is materialized (real copies) to HIDE the limitation
  (forbidden — violates the symlink-source rule); the limitation is invisible until a user
  depends on missing installed content; Claude and Codex docs disagree about what is installed.
- **Checklist:** [ ] smoke script reports installed-cache omissions as an upstream/plugin-install
  limitation, not a reason to materialize the source. [ ] the limitation is documented BEFORE
  users depend on it. [ ] "source-package support" vs "installed-cache behavior" is clearly
  distinguished in docs.

### S7 — Long-running review session (the review session itself)
- **Golden:** the review reads many large skills; context compaction occurs mid-review; the
  manager resumes; the visible status and file-backed state (`state.json`/`session.json`) still
  agree; fresh subagents reload mandatory skills (no inherited-context assumption); findings stay
  stable and traceable.
- **Failure/edge:** compaction handoff drops open tasks/decisions; a resumed manager assumes a
  subagent inherited loaded skills; findings lose their IDs/traceability across the compaction
  boundary. *This scenario is self-referential — the deep review WILL compact while reading the
  system surface (made worse by the by-dimension re-reads + sub-chunking), so the charter must be
  robust to its own execution.* It intersects the codex >10-min foreground-cap finding (Seed D;
  the methodology mandates background-run Codex passes).
- **Checklist:** [ ] compaction handoff preserves open tasks + standing decisions. [ ] the
  resumed session reloads mandatory skills (principles / mistake / phase skills). [ ] finding
  IDs are stable across iterations, resumes, AND sub-chunk merges. [ ] long-running
  subagent/tool ops are reflected in user-visible progress (ties to D7).

---

## Seed-findings register

The confirmed seeds are placed here as pre-verified findings, each generalized to a class the
next session sweeps for siblings. All facts below were re-verified against the live repo while
finalizing this charter.

- **Seed A → D7 (live-session UX).** Instance: no live todo-list surfaced. Verified: only 2
  incidental hits for `TaskCreate|TodoWrite|TaskList|TodoRead` (`orchestration/agent-teams.md:136`
  hook-event name; `agents/manager.md:80` manager delegation tracking). Class: does the running
  session show the user what is happening (active step/sub-phase/iteration, active artifact, next
  action, queued work, per-agent activity, blockers, pending decisions)? Now a first-class
  dimension (Decision-4) with the source-of-truth rule (visible items linked to `state.json`).
  Prior art: superpowers todo-from-checklists.
- **Seed B → `.claude/skills/` per-file mirror is INCOMPLETE (homed in D6; grounds D2/D4).**
  Verified: `.claude/skills/` (real dirs of per-FILE symlinks) has 21 skill dirs (MISSING
  `coding`) and 0 `scripts/` subdirs (`find -L .claude/skills -type d -name scripts` → empty).
  Class: every canonical subdir/skill must be EXPOSED by every mirror (checked by FOLLOWING
  symlinks). The fix target is the `.claude` per-file mechanism; sweep for any other per-file
  omission.
- **Corrected second-mirror fact (the iter1 Seed F lesson).** Verified: `.agents/skills/{skill}`
  are WHOLE-DIR symlinks → the `.agents` mirror is COMPLETE: 22 skills (incl. `coding`) and all
  4 `scripts/` subdirs (`find -L .agents/skills -type d -name scripts` → `record`/`git`/`memory`/
  `orchestration`). Plain `find` returns 0 ONLY because it does not follow symlinks — that
  false-negative was the iter1 error. **The two mirrors disagree because they use different
  mechanisms; do NOT mis-blame `.agents`.** Use `find -L`/`readlink` for any mirror check.
- **Seed C → doc↔script drift in `.claude/skills/` (homed in D6 + D4).** Verified:
  `.claude/skills/memory/rules.md` references `scripts/validate-frontmatter.sh` (and
  `../orchestration/scripts/*.sh`) that do NOT resolve from the `.claude` mirror, while the
  canonical path resolves. Class: every doc-referenced path must resolve from every location the
  doc is read (canonical, BOTH mirrors via symlink-following, package); sweep all script +
  cross-skill link references.
- **Seed D → codex >10-min foreground cap (D6 + methodology).** Verified: `codex/SKILL.md`
  specifies `timeout 1200` (20 min) for the proposer (L153/L160/L171), but the Claude Code Bash
  tool has a ~10-min hard cap that kills a foreground `codex exec`. Class: any documented
  `codex exec` pattern that assumes a runtime budget the host harness does not grant — a
  codex-skill ↔ harness mismatch. The methodology mandates background-run + poll for every Codex
  review pass.

---

## Next-session methodology — by-dimension passes

This is the run plan (Decision-3, user-locked). The PRIMARY partition is **BY DIMENSION**: one
dual-system pass per dimension (D1–D7), each pass reading ONLY the files its dimension touches
(per the Pass-0.5 relevance map). Per-dimension coherence — one reviewer holds one whole
dimension in mind — is the chosen benefit; the accepted cost is file re-reads (documented below).

### Pass 0 — Configuration & scope-lock
Confirm review-only scope with the user; capture the current commit / branch / session id /
worktree; read project rules + `principles` + `mistake` + the core workflow skills BEFORE
reviewing; state that there are no source edits unless the user later opens an Execution session.

### Pass 0.5 — Shared surface inventory + relevance map
Produce ONCE: the full file list with word counts by surface (extend the
[Source inventory](#source-inventory--coverage-split), including the system-exhaustive /
memory-sampled split), AND a dimension→files relevance map naming exactly which files each
per-dimension pass reads. Each pass reads ONLY its mapped files.

Illustrative dimension→files relevance map (the next session fills exact file lists at Pass-0.5):

| Dimension | Files the pass reads | Whole-surface? |
|---|---|---|
| D1 — E2E lifecycle | orchestration + `workflow/*`, the 5 loop skills, `gobbi`, `interview`, plugin install docs, session-runtime surfaces; SAMPLE of memory records (staleness) | no (mapped subset + sample) |
| D2 — completeness / between-skill | ALL skills + agents (the load graph is inherently whole-surface) | **YES → sub-chunk** |
| D3 — harness comparison | `staging/references/*` + gobbi capability docs (orchestration, memory, evaluation, delegation) | no |
| D4 — naming / style / consistency | ALL skills + agents (counts + terms + glossary) | **YES → sub-chunk** |
| D5 — text-polish / dedup | the large docs ranked by size (wrap-up, evaluation, git, orchestration, record, delegation, ideation…) + a cross-doc duplication scan | partial |
| D6 — plugin / mirror | `plugins/gobbi`, both manifests, marketplace, BOTH mirrors, scripts, hooks, `codex/SKILL.md` | no |
| D7 — live-session UX | manager, orchestration, execution, planning, discussion, agent-teams | no |

### Per-pass context budget
Each dimension pass (or sub-chunk) reads **≤ ~60K words (~80K tokens) of mapped source in one
read**. Rationale: leaves headroom in a ~200K-token context for the charter (~7–8K words), the
accumulating finding set, dual-system reasoning, and the S7 compaction margin; portable to
non-1M-context runtimes. A pass whose mapped files exceed the budget MUST sub-chunk.

### Sub-chunk fallback for whole-surface passes
D2 and D4 (each ~214K words of skills+agents) exceed the budget, so each splits into **4 ordered
sub-chunks (~50–55K words each):**
1. loop skills + `gobbi` + orchestration/`workflow/*`;
2. cross-cutting skills (`discussion`, `delegation`, `evaluation`, `record`);
3. supporting + meta skills (`principles`, `git`, `codex`, `memory` + children, `mistake`,
   `coding`, `research`, `interview`, `claude-plugin`, `agent-writing`, `skill-writing`);
4. agents (`.md` + `.toml`) + both mirrors.

**Merge step (mandatory):** each sub-chunk emits its partial findings PLUS a running cross-chunk
index (terms seen, counts seen, handoff edges seen); a final MERGE sub-step reconciles
cross-sub-chunk patterns no single sub-chunk can see — a term used inconsistently across
sub-chunks, a count that only drifts when all are compared, a handoff whose two ends live in
different sub-chunks. **Finding IDs are assigned at merge so they are stable** (S7). Any OTHER
pass that exceeds budget at Pass-0.5 uses the same split+merge rule.

### Documented token-cost trade-off (eyes-open risk)
By-dimension RE-READS overlapping files: D2 and D4 each read the whole skill+agent surface, so
the ~214K corpus is read at least twice across those two passes (4 sub-chunks each), plus partial
overlaps in D1/D5/D6/D7. The by-segment alternative (read each segment once, check all dimensions
per segment) avoids the re-reads but loses per-dimension coherence. The user chose by-dimension
for that coherence; the accepted cost is the re-reads, BOUNDED by the per-pass budget +
sub-chunking. **D2 and D4 are the two expensive whole-surface (sub-chunked) passes**, and S7
(compaction mid-pass; reload mandatory skills) applies most to them.

### Codex invocation discipline (Seed D — REQUIRED for EVERY Codex pass)
Each per-dimension Codex reviewer runs as a **BACKGROUND `codex exec` + poll**, never a
foreground call with `timeout 1200` — the Claude Code Bash tool's ~10-min per-call cap kills a
foreground codex run before 20 min (verified Seed D). Pattern: launch the Codex pass in the
background, poll for completion, then read its output file. Do NOT rely on foreground
`timeout 1200`.

### Dual-system per pass + aggregation
Each dimension pass is DUAL-SYSTEM: an independent Claude reviewer and an independent Codex
reviewer read the same mapped files / sub-chunks; the manager reconciles per pass by
**pessimistic union** — keep a finding if EITHER system has credible evidence; cross-system
divergence is the anti-groupthink signal (record it, do not silently drop the minority finding).
All findings collect into the one `reviews/` file in the [Per-finding record shape](#per-finding-record-shape).
Pass order: Pass 0 → Pass 0.5 → D1…D7 (any order after the inventory; schedule D2/D4 when context
is freshest).

---

## Severity, priority & confidence scheme

> LOCKED (Decision-2). Reuses gobbi's existing enums EXACTLY, aligned to
> `skills/evaluation/SKILL.md` § Finding Metadata and `skills/memory/templates/reviews.md`.
> Inventing `S0-S3`/`P0-P3` labels is REJECTED.

**Two axes** — SEVERITY (impact if real) and PRIORITY (repair order) — plus CONFIDENCE.

**SEVERITY** — `Critical / High / Medium / Low` (exact label form per `evaluation/SKILL.md`):
- **Critical** — corrupts memory, silently publishes false durable state, skips a mandatory
  gate, breaks install/startup for a normal user, or makes the workflow impossible to complete
  (a between-skill dead-end; a runtime non-resolving path that breaks a guard).
- **High** — a phase runs with missing required context; an agent violates scope; an evaluation
  failure is hidden; a user decision is lost; plugin deployment breaks in ONE ecosystem; or a
  contradictory cross-skill instruction misdirects an agent.
- **Medium** — repeatable operator confusion; brittle hand-offs; weak evidence; duplicated/
  conflicting instructions; or incomplete-but-recoverable workflow coverage.
- **Low** — wording, naming, polish, local discoverability with limited behavioral risk.

**CONFIDENCE** — the DISCRETE 5-value scale `0 / 25 / 50 / 75 / 100` (NOT continuous), per
`evaluation/SKILL.md` (L346) + the reviews template (L64).

**PRIORITY (repair order)** — reuses the backlog/mistake `priority` enum
`critical / high / medium / low`:
- **critical** — must fix before claiming gobbi is review-ready or deployable.
- **high** — fix in the next quality pass; likely to affect real sessions.
- **medium** — schedule after the above; useful, not blocking.
- **low** — opportunistic cleanup.

**Threshold rules** (mirror `evaluation/SKILL.md`): any Critical finding at confidence ≥ 75 →
must-address; any High at ≥ 50 → REVISE-equivalent. Confidence < 75 with material impact carries
a `needs-confirmation` note; **Critical/High findings must cite primary repo evidence and a
plausible user-visible failure path**.

---

## Per-finding record shape

> LOCKED. The output is memory-validator-compatible: ONE `reviews/` file whose FRONTMATTER is
> exactly the reviews-type allowlist, with all findings in the BODY (so Wrap-up's allowlist strip
> cannot drop them and the no-stray-keys check cannot fail).

**(1) The review is ONE `reviews/` memory file** (frontmatter validates against
`skills/memory/scripts/validate-frontmatter.sh` for the `reviews/` type — base 11 + reviews
extensions only):

```yaml
---
name: {date}-gobbi-adversarial-review        # slug stem; date-prefixed file
description: {one line — what was reviewed + outcome}
type: reviews
scope: project                                # cross-feature whole-system review
feature: null
status: active                                # reviews are append-only; never mutated
created: YYYY-MM-DD
session: {session-id}
tags: [evaluation, ...]                        # from the reviews tag pool (rules.md §2.5)
keywords: []
author: claude | codex | user
review_kind: adversarial-review               # REQUIRED — kind axis; resolves area reviews/adversarial-review/
subject: gobbi full surface (agents + skills + plugin)
verdict: pass | revise | fail | needs-attention | n/a
---
```
Per the reviews template, the reviewer identity, perspective set, cross-references, and ALL
findings live in the BODY — never frontmatter.

**(2) Each finding is a BODY entry** under `## Findings` (the reviews-template `### {Finding}`
shape, extended with the charter's extra bullets — all BODY, never frontmatter):

```
### {dimension}-{nnn}: {short finding title}    # e.g. D6-007 — id stable across iters + sub-chunks
- Severity: Critical | High | Medium | Low
- Confidence: 0 | 25 | 50 | 75 | 100
- Priority: critical | high | medium | low        # repair order (two-axis)
- System: claude | codex                           # which system found it (divergence signal)
- Dimension: D1..D7 | seed-A/B/C/D
- Owner-surface: skill | agent | plugin | memory | workflow | hook | docs | unknown
- Location: {file}:{line-range or #section}        # exact, verifiable
- Expected: {what should be true}
- Observed: {what is actually true}
- Description: {the finding body}
- Evidence: {grep/diff/quote + the command/manual-trace used}
- Proposed remediation: {smallest directional fix — NOT a code recipe}
- Verification: {how a future session proves the fix}
- Disposition: open | addressed | disputed | deferred | superseded
```

**Evidence rule:** no grep-only conclusion for an absence claim — grep finds candidates, then
READ the owning section. A zero-result search is a starting point, not a finding (the iter1
symlink-blind `find` is the cautionary case — Seed B/F).

**Validation:** the review file validates against `skills/memory/scripts/validate-frontmatter.sh`
for the `reviews/` type (base + `review_kind`/`subject`/`verdict` only); findings-as-body carry
the rich shape without tripping the no-stray-keys check.

---

## Reference-harness comparison

> LOCKED. The four researched harnesses are the anchored baseline (staged as
> `staging/references/*`); refresh candidates are checked against current sources at review time.

**Comparison axes (~13):**
1. skill discovery
2. live progress visibility
3. orchestration / agent-composition
4. memory model
5. staleness re-sync
6. dependency-aware planning
7. install / onboarding & portability
8. token economy / documentation-density
9. anti-groupthink evaluation
10. permission / sandbox model
11. checkpointing / rollback
12. telemetry / observability
13. extensibility

**Anchored baseline harnesses:**
- **superpowers** — builds live todo lists from skill checklists; auto-triggers skills via a
  bootstrap dispatcher; brainstorm→plan→worktree→subagent-TDD→fresh-review→finish. Prior art for
  Seed A / D7 (live todos) and the D3 workflow baseline. `[[superpowers-skill-harness]]`.
- **claude-flow / ruflo** — queen/worker swarm + SQLite/AgentDB semantic cross-session memory +
  pattern learning. The orchestration + memory-model contrast (DB vs gobbi's git-native
  markdown). `[[claude-flow-swarm-memory]]`.
- **claude-task-master** — PRD→`tasks.json` with dependencies + complexity scores; serves the
  next dep-satisfied task. The dependency-aware-planning baseline (gobbi has graph+lanes but no
  complexity score / next-task selector). `[[claude-task-master-dependency-tasks]]`.
- **Agent OS v2** — 3-layer context (Standards/Product/Specs) + "Discover Standards" (re-extract
  conventions from the codebase) + "Index Standards". The SUGGESTED future direction for a
  staleness re-sync (Decision-5 — suggestion, not deliverable) and the token-economy /
  progressive-disclosure axis. `[[agent-os-layered-standards]]`.

**Refresh-candidate set (verify against current sources before relying on them):** BMAD-style
structured agent workflows, Aider, OpenHands / SWE-agent-style autonomous coders, LangGraph /
LangSmith-style orchestration+observability, CrewAI / AutoGen-style multi-agent frameworks,
IDE-native agents (Cursor / Devin-like).

**Cross-harness takeaway.** gobbi's dual-system anti-groupthink (create + review) is ahead of all
four; gobbi is behind on live progress visibility (Seed A / D7), staleness re-sync (CRITICAL —
review-only), and progressive disclosure / token economy (D5). The review protects the
differentiator while documenting the three gaps. **License/IP check (D3.4):** before
recommending any borrowed mechanism, verify the source's license/IP permits the reuse.

---

## Charter acceptance & next-session exit criteria

### Charter acceptance (this charter is ready when…)
- It states its locked durable home (`plans/workflow/2026-06-29-adversarial-review-charter.md`)
  and does NOT masquerade as a completed review.
- It covers all six user dimensions PLUS the approved seventh (live-session UX).
- It states the system-exhaustive / memory-sampled coverage split so no surface is silently
  skipped.
- It treats memory staleness as critical and testable, REVIEW-ONLY, with the re-sync direction
  clearly labeled a suggestion.
- It defines severity, priority, and the finding record using gobbi's exact enum forms, with the
  review file memory-validator-compatible.
- It gives the next manager a by-dimension pass plan + relevance map + per-pass budget +
  sub-chunk fallback + background-Codex discipline, with the re-read risk documented.
- It preserves the gobbi boundary — review now, repair later unless the user explicitly changes
  scope.

### Next-session exit criteria (the REVIEW is done when…)
- Every in-scope SYSTEM surface is read or explicitly justified as sampled.
- The memory-tree content is sampled per its plan (the coverage split).
- Each dimension D1–D7 has ≥ 1 pass-specific report.
- The whole-surface passes (D2, D4) show their sub-chunk + merge records.
- All Critical/High findings have a recommended next action and cite primary repo evidence.
- Outputs are emitted via RECORD + Wrap-up — not ad-hoc memory writes.

### Expected outputs of the next session
- A project-level review artifact under `reviews/adversarial-review/` (the Per-finding record
  shape).
- A findings table in the body shape.
- A scenario-trace appendix (S1–S7).
- A memory-staleness appendix (review-only, sampled, with the suggested direction labeled a
  suggestion).
- A plugin-deployment appendix.
- A naming / text-polish backlog.
- Mistake-candidates only for repeatable traps.
- Backlog entries for accepted repairs.
- A Wrap-up handoff citing every durable memory write.

---

## Verification-commands appendix

> LOCKED. Seed commands per dimension. For ANY mirror/symlink check use `find -L` (or
> `readlink -f` + `test -e`) — plain `find` does NOT follow the `.agents` whole-dir symlinks and
> yields a false-negative (the iter1 error). For every absence claim, READ the owning section
> after the search; a zero-result search is a starting point, not a finding.

```bash
# Pass 0 — scope-lock / context (run with the worktree absolute path)
git -C <worktree> status --short && git -C <worktree> rev-parse --show-toplevel

# Pass 0.5 — inventory
find .gobbi/projects/gobbi/skills -name SKILL.md | sort                       # 22 skill dirs
find .gobbi/projects/gobbi/agents -maxdepth 1 -type f | sort                  # 5 .md + 5 .toml
find plugins/gobbi -maxdepth 3 -print | sort                                  # package layout
find .gobbi/projects/gobbi/skills -name '*.md' | xargs wc -w | tail -1        # ~205,446 (skills)
find .gobbi/projects/gobbi/agents -maxdepth 1 -name '*.md' | xargs wc -w | tail -1   # ~8,523 (agents)

# D6 — mirror completeness (SYMLINK-FOLLOWING)
diff <(ls .claude/skills) <(ls .agents/skills)               # .claude misses `coding` (Seed B)
find -L .claude/skills -type d -name scripts                  # expect EMPTY (.claude incomplete)
find -L .agents/skills -type d -name scripts                  # expect 4 (.agents complete, whole-dir)
for s in .claude/skills/*/ ; do n=$(basename "$s"); \
  test -e ".gobbi/projects/gobbi/skills/$n/SKILL.md" || echo "MISSING canonical for $n"; done

# D6 — plugin manifests + sync/smoke
scripts/sync-plugin-package.sh --check
scripts/check-codex-plugin-smoke.sh

# D6/D4 — Seed C: doc-referenced script paths that don't resolve from the .claude mirror
grep -nE "scripts/" .claude/skills/memory/rules.md
test -e .claude/skills/memory/scripts/validate-frontmatter.sh && echo RESOLVES || echo "BROKEN from .claude"

# D7 — live-UX candidates (then READ each hit in context)
rg -n "TaskCreate|TaskList|TodoWrite|state.json|status display" .gobbi/projects/gobbi .claude .agents plugins

# D1/S5 — staleness mechanism candidates (then READ the owning section)
rg -n "supersedes|superseded_by|stale|archive|compaction|move-on-terminal" .gobbi/projects/gobbi

# D4 — count drift candidates (then READ each hit)
rg -n "Skills \(|22 skill|19" .gobbi/projects/gobbi/skills/claude-plugin/SKILL.md
```

---

## Dogfooding-friction register

Frictions observed while researching/designing this charter — surfaced for the next session and
as mistake-candidates (the next session sweeps for siblings):

- **research-vs-ideation reference-staging contradiction** — `research/SKILL.md:30-31` (leader
  does NOT write `staging/references/` during WORK; assistant promotes on PASS) vs
  `ideation/SKILL.md:81,251` (leader's external-reference list "ready for WORK to stage at
  `staging/references/`"). A between-skill instruction conflict (D2.6 instance 1).
- **dangling `claude` skill reference** — `.claude/CLAUDE.md:61` and `gobbi/SKILL.md:192`
  (FLAG-2) link `skills/claude/SKILL.md`, but no `claude` skill dir exists (D2.3 instance 1).
- **claude-plugin self-count tension** — `claude-plugin/SKILL.md:240` "22 skill directories"
  vs L243 quoting `Skills (19)` (D4.4 instance 1).
- **codex >10-min foreground cap** — `codex/SKILL.md` `timeout 1200` vs the Claude Code Bash
  ~10-min cap (Seed D; D6.9). Mitigation: background-run Codex passes.
- **symlink-blind verification lesson** — the iter1 plain `find` produced a false `.agents/skills`
  conclusion; ALWAYS use `find -L` / `readlink` for symlinked mirrors, never plain `find`/`grep`.

---

## Source

- Finalized from the Ideation design: `1-ideation/outputs/charter-design.md` (dual-system
  produced + dual-system evaluated: REVISE → revised → frozen).
- Internal recon: `1-ideation/working/research/internal-surface-map.md`
- External recon: `1-ideation/working/research/external-harness-axes.md`
- Staged references: `staging/references/{superpowers-skill-harness,claude-flow-swarm-memory,claude-task-master-dependency-tasks,agent-os-layered-standards}.md`
- All factual claims (word counts, file counts, mirror/symlink facts, seed findings, enum forms)
  re-verified against the live repo during this Execution task.
