---
name: fix-d4-review-findings
description: "Deferred fix queue for the 46 D4 (naming / conventions / counts / doc-style) adversarial-review findings — review-only → future scoped session."
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-29
session: 5ac6cf6e-aae6-4e28-85b3-e90b0a10aaaf
tags: [evaluation, process]
keywords: [adversarial-review, d4, term-consistency, count-drift, doc-style, fix-queue]
author: claude
priority: high
project-scope: true
shipped_in: null
---

# Fix queue — D4 adversarial-review findings (naming / conventions / counts / doc-style)

## Ownership closure

Historical line citations below remain evidence of the reviewed tree. Any still-open remediation that changes Gobbi manager dispatch, role headers, Load Directives, or status wiring now targets `orchestration/delegation.md` and `orchestration/templates/`; generic delegation semantics remain in `delegation/SKILL.md`.

## Context

The 2026-06-29 D4 adversarial-review session reviewed the **naming / term-Glossary consistency /
self-reported counts / doc-style uniformity / doc↔path resolution / dev-doc quality** of the gobbi
agent + skill surface — **dual-system** (Claude + Codex, six budget-sized chunks each), and produced
**46 consolidated findings** from 85 raw (7 cross-system-corroborated, 39 single-system: 21 codex-only,
18 claude-only). The session was **review-only** (the charter is review-only; fixes are separate
sessions), so no finding was fixed. This backlog is the deferred fix queue. The **source of record**
for every finding (full per-finding record, evidence, proposed remediation, cross-system divergence,
the global term-consistency + count-drift reconciliation, and confirmed-seed siblings) is
`reviews/adversarial-review/2026-06-29-gobbi-adversarial-review-d4.md`.

Severity tally: **Critical 0 · High 7 · Medium 20 · Low 19 = 46.** (No Critical this cycle — unlike D2,
which had 3; D4 is a naming/quality pass, so its findings are doc-consistency, not structural dead-ends.)

## Why deferred

The user chose review-only for this charter slice. Fixing findings is out of scope for a review
session and belongs in a scoped Execution session that can plan, change source, and re-verify.

## When to pick up

Any time after this session — no hard prerequisite. Recommended sequencing: settle the **1 substantive
cross-system divergence (Always-Ask)** first — it decides the path-resolution convention that drives the
single largest cluster (doc↔path) — then take the **7 High findings** (intra-doc instruction
contradictions + stale anchors), then the systemic term-consistency + count-drift sweeps, then the
standalone doc-style Lows. Most D4 findings are doc-only sweeps that can land together; the one
convention question (repo-root-vs-doc-relative paths) is best settled as a deliberate decision, not a
spot-edit.

## Always-Ask before fixing — the substantive cross-system divergence

D4 produced ONE same-location/opposite-verdict divergence the user must adjudicate before the fix,
because the fix differs by verdict. It gates the doc↔path cluster.

1. **Repo-root-vs-doc-relative path convention (D4-002) — the highest-leverage adjudication.** Codex =
   a real per-doc D4.8 defect across ~15 skill/agent docs (bare `.claude/` / `.agents/` / `.codex/` /
   `plugins/gobbi/` / `scripts/` refs fail a doc-local `test -e`); Claude = by-design "mirror-build
   behavior, not a per-doc defect" (consumers `readlink` to canonical first). Either way the fix is to
   **DECLARE** the path-resolution convention once (e.g. in skill-writing / agent-writing) and mark the
   references as repo-root commands / logical names — making the resolution intentional-and-stated. This
   decision sets the direction for the whole doc↔path cluster, so settle it first.

`D4-008` is a *complementary-coverage* split (both systems flagged `MEMO`; Claude additionally caught the
loop-STATE synonym `InProgress`, Codex additionally caught the phase-slot values
`ITER/EXIT` / `PLAN_DRAFT` / `EXECUTION` / `WRAPUP`) — same root, not opposite verdicts, so it is not a
gating Always-Ask; fix the union of both systems' sites.

## The fix queue — by cluster

Each entry: **ID** (severity) — one-line. `location`. → directional fix (see the review artifact for the
full proposed remediation + verification step). A finding that spans two clusters is cross-noted.
Cross-system-corroborated findings (7) are marked **[corroborated]** — highest-confidence repair.

### Cluster A — term / Glossary consistency (D4.2 / D4.3)

Canonical-vocabulary slots carrying non-canonical tokens. Sweep against the gobbi Glossary
(`gobbi/SKILL.md:108-124`).

- **D4-008** (Medium, **[corroborated on `MEMO`]**) — non-Glossary tokens in phase/sub-phase/state slots
  (`InProgress`/`MEMO`/`EVAL`/`ITER/EXIT`/`PLAN_DRAFT`/`EXECUTION`/`WRAPUP`).
  `chat-mode.md:91,511-529,552`; `orchestration/SKILL.md:245`; `auto-mode.md:115,133,151`.
  → `InProgress`→`Active`, `MEMO`→`RECORD`, `EVAL`→`EVALUATION`; express `ITER/EXIT` + work verbs as
  action/state labels outside the phase vocabulary. (Note: `check-residual-vocab.sh` matches the longer
  `MEMORIZATION`, so the shorter `MEMO` slips past — extend the gate.)
- **D4-010** (Medium) — verdict prose "PASS or REVISE" excludes `FAIL` while the same table handles it.
  `orchestration/workflow/ideation.md:98,129-134`. → state the three-value `PASS`/`REVISE`/`FAIL` enum.
- **D4-011** (Medium, **[corroborated]**) — DISCUSSION/WORK/EVALUATION/RECORD called "phases" / "## X Phase"
  vs Glossary "sub-phase". `5 loop SKILL.md:9` + every `## X Phase` header; `research/SKILL.md:31`.
  → pick one term and sweep all 5 loop intros + headers + research (or amend the Glossary).
- **D4-013** (Medium) — invents non-canonical disposition `still open` (canonical `open`).
  `wrap-up/evaluation.md:284`. → replace `still open` → `open`.
- **D4-014** (Medium) — non-canonical role names `Planner` / `Plan agent`. `ideation/evaluation.md:255,279`;
  `preparation/evaluation.md:212`. → use `Planning leader` / `leader`; drop the invented labels.
- **D4-015** (Medium) — non-canonical phase spellings `Wrap-Up` / `Wrap Up` (canonical `Wrap-up`).
  `wrap-up/mistakes.md:8,12`. → normalize to `Wrap-up` (the heading slug changes — repoint inbound anchors).
- **D4-016** (Medium) — `research` / `Research` used as a phase / sub-phase value. `delegation/SKILL.md:58,300,427`;
  `templates/leader.md:8`. → treat research as a skill / task kind under a canonical phase, not a phase value.
- **D4-020** (Medium) — date-prefixed types (notes/changelogs/discussions) shown with bare `{slug}.md`,
  dropping the `YYYY-MM-DD-` prefix. `memory-map.md:121,125,141` vs `rules.md:37,40`.
  → update the path rows to the `{area}/{YYYY-MM-DD}-{slug}.md` shape.
- **D4-024** (Medium) — "8 per-perspective output files (one per evaluation perspective)" counts Overall
  as a perspective. `codex/SKILL.md:358-359`. → reword to "8 expected files: seven perspectives plus `overall.md`."
- **D4-025** (Medium, **[corroborated]**) — assistant taxonomy/frontmatter says "Read-only" / "bounded to
  session staging" — it is the sole memory writer. `gobbi/SKILL.md:155`; `delegation/SKILL.md:430,61`;
  `agents/assistant.md:3`. → replace with "Write/Edit scoped to session staging (RECORD) + memory
  (Wrap-up WORK, sole memory writer); read-only in lookup mode."
- **D4-030** (Low) — gobbi Glossary omits the `Stage` / Wrap-up stage-name vocabulary it is treated as
  owning. `gobbi/SKILL.md:108-124`. → add a `Stage` row + the Wrap-up stage names, or correct the
  "Glossary owns stage names" claim in CLAUDE.md.

### Cluster B — count drift (self-reported counts vs reality, D4.4)

Each is a "currently has N" / "N rows" / "N classes" claim that no longer matches the live surface.

- **D4-001** (High, **[corroborated]**) — eval mandatory/optional/skip policy framed inconsistently across
  ≥5 surfaces. `gobbi/SKILL.md:141`; `orchestration/SKILL.md:255-259`; `auto-mode.md:201,210,284-285`;
  `delegation/SKILL.md:429`; `manager.md:142`. → pick the canonical policy (mandatory after
  Execution+Wrap-up; optional earlier; `skip` inert for Execution+Wrap-up) and restate identically at all
  five sites. (Also Cluster C — optional-vs-mandatory; distinct from D2-019 which covers the loop-SET count.)
- **D4-017** (Medium, **[corroborated]**) — "Three-Tier Memory Access Matrix" header labels a 7-row table.
  `evaluation/SKILL.md:27-39`. → rename to "## Memory Access Matrix" (match peers) or add a 3-tier gloss.
- **D4-028** (Low) — "five sub-steps" prose vs a four-row (A–D) table. `preparation.md:34` vs `:36-41`.
  → "five sub-steps" → "four sub-steps" (the Skill Map says four).
- **D4-029** (Low) — "The five agent types divide into two classes" but the table classifies only four.
  `orchestration/SKILL.md:50-58`. → "Of the five agent types, four divide into two classes (manager is in
  neither)."
- **D4-031** (Low) — hook script line counts stale (`79`/`251` vs live `82`/`305`).
  `hook-authoring.md:7-8,271-272`. → refresh or remove the volatile line-count claims.
- **D4-032** (Low) — Auto Mode cites a four-row Configuration that is now five rows (omits `Init Record
  Skeleton`). `auto-mode.md:64` vs `orchestration/SKILL.md:104-108`. → update to the five-row table.
- **D4-033** (Low) — `artifact_type: dependencies` mandated in prose but absent from PASS checklist +
  Output-paths mandatory line. `planning/SKILL.md:435,446` vs `:459-460,493`. → decide required vs
  optional and make the four sites agree. (Also Cluster C.)
- **D4-038** (Low) — the `$schema`-note blames `archive` for the 16→15 type-key gap; the real exception is
  `features`. `memory-vocabulary.json:2`. → reword to name `features` as the keyless type.
- **D4-039** (Low) — Appendix coverage-check line contradicts its own traceability table (P2/P3 inverse map).
  `coding/SKILL.md:318` vs `:301-316`. → correct line 318 to `P2→2/4/6/7`, `P3→2/3/5` (or fix the coding-1 cell).
- **D4-041** (Low) — "features/workflow/ currently has 8 subdirs + README" — live count is 9.
  `templates/feature.md:38`. → update the count or remove the live example.
- **D4-042** (Low) — `Hooks (3)` left un-reconciled beside the doc's "4 event groups" claim.
  `claude-plugin/SKILL.md:243` vs `:193,226,241`. → annotate the unit ("3 hook scripts; 4 event registrations").
- **D4-045** (Low) — continuable roles "(executor, leader)" omits the assistant (2 of 3).
  `agent-writing/SKILL.md:127`. → change to "(executor, leader, assistant)".

### Cluster C — optional-vs-mandatory / intra-doc instruction contradictions (D4.5)

One doc gives a role two incompatible instructions for the same act. These are obeyability bugs, not
cosmetics — a literal reader cannot satisfy both.

- **D4-004** (High) — evaluator anti-trust block forbids "cover multiple perspectives" — contradicts the
  mandatory 7-perspective coverage. `delegation/SKILL.md:349-357` (line 355). → replace with the intended
  "blend perspectives," matching the evaluator template.
- **D4-005** (High) — mistake-capture write timing incompatible (matrix "PASS-only RECORD" vs P2 "immediate"
  vs P3 "RECORD on PASS"). `mistake/SKILL.md:24,95,99-101,130,143`. → split the "immediate note" surface
  from the "RECORD staging" surface (or make RECORD the sole write) and align all five sites. (Same class as
  D2-007, different doc.)
- **D4-006** (High) — Constraint "exactly three frontmatter keys … and no others" contradicts its own P1/P2
  (optional official fields). `skill-writing/SKILL.md:260-261` vs `:66-71`, `:99-114`. → reword to "three
  STANDARD keys plus only the official optional fields … no ad-hoc keys."
- **D4-012** (Medium) — handoff required-section contract disagrees (SKILL 6 incl. Promotion summary vs
  evaluation child 5 incl. Next Actions). `wrap-up/SKILL.md:420` vs `wrap-up/evaluation.md:176-177`.
  → pick one section contract and make both docs use it verbatim.
- Cross-noted here: **D4-001** (eval mandatory/optional/skip — primary in Cluster B) and **D4-033**
  (`dependencies` required vs optional — primary in Cluster B) are also instruction-consistency items.

### Cluster D — doc-style uniformity + dev-doc quality + memory-template consistency (D4.6 / D4.7 / D4.2)

Micro-consistency across the sibling heading ladder, frontmatter, prose voice, and the memory templates.

- **D4-009** (Medium) — normative prose embeds load-bearing session coordinates (session id, `L-P1/L-C2`,
  `iter1`, `R2/R3/R5`). `chat-mode.md:22-28,319-321,379-390,583-586`. → replace session-local labels with
  self-contained rationale; move provenance to a single `## Source` footer (dev-doc quality, rules.md §4.3).
- **D4-019** (Medium, **[corroborated]**) — §4.2 gives `design` the ADR shape, but the design template body
  differs entirely. `rules.md §4.2 (:367)` vs `templates/design.md:50-71`. → split the §4.2 row — give
  `design` its own contract matching the template; keep `decisions` on the ADR shape.
- **D4-021** (Medium) — archive template lists non-enum backlog terminal states + says reviews/reports
  supersede via `status:` (only `active`). `templates/archive.md:27,38` vs `rules.md:235,238-239`.
  → separate terminal status from `archive_reason`; align to each type's status enum.
- **D4-022** (Medium) — retired-feature archive destination conflicts (whole dir vs dated README file).
  `templates/feature.md:147` vs `templates/archive.md:53`. → choose directory-archive or README-file-archive
  and reconcile the other doc.
- **D4-034** (Low) — docs teach/permit banned slugs (`framed-problem-iter2.md`/`-v2.md`; `plans/main.md`).
  `record/SKILL.md:144`; `planning/SKILL.md:300`. → teach subject-distinct filenames; keep iter/version in
  frontmatter; require a subject-descriptive plan slug even for simple workflows.
- **D4-035** (Low) — lone YAML frontmatter among the 5 sibling `evaluation.md` child docs.
  `preparation/evaluation.md:1-7`. → remove the lone frontmatter, or add equivalent frontmatter to all five.
- **D4-036** (Low) — `each agent.s raw transcript` — apostrophe corrupted to a period (sibling of the
  `loop's→loop.s` seed). `ideation/SKILL.md:426`. → correct the typo.
- **D4-037** (Low, advisory) — phase-header parenthetical annotation drift across the 5-sibling heading
  ladder. `execution:73,107` + `wrap-up:98,131` vs ideation/preparation/planning. → drop the parentheticals
  or add an equivalent "(leader-led)" annotation to the three leader loops.
- **D4-040** (Low) — `mistakes` 4-element ORDER differs between memory-tier contract and skill-surface schema.
  `rules.md:368`; `templates/mistakes.md:49-62` vs `:101-104,120`; `mistakes.md:16-19`. → pick one order (the
  §4.2 SSOT is `Correct approach → How to detect`) and reconcile, or document the deviation.
- **D4-043** (Low) — skips the canonical `# Title` H1 (starts at `## Principle 1`). `principles/SKILL.md:7`.
  → add `# Principles` + a short intro.
- **D4-044** (Low) — `description` opens "Use **for** …" vs skill-writing's prescribed `Use when` / `Load when`.
  `codex/SKILL.md:3`. → reword to a sanctioned opener.
- **D4-046** (Low) — lists `evaluation/SKILL.md` twice in the mandatory "Before You Start" load ladder.
  `evaluator.md:34,37`. → drop the "and `evaluation/SKILL.md`" clause from item 1; keep item 4 as the single load.

### Cluster E — stale CLI / toolchain references (D4.8)

References to a binary or codebase that does not exist in this markdown/skills-only tree.

- **D4-026** (Medium) — cites a `gobbi workflow init` CLI that does not exist (contradicts the
  markdown-driven/no-CLI model). `agents/manager.md:35`. → replace with the `orchestration/SKILL.md § Step 1`
  Configuration description (worktree + `init-record-map.sh` + JSON stamping; no CLI).
- **D4-027** (Medium) — targets an absent TypeScript/Bun codebase (`packages/cli/`, `bun test`, "2197/0").
  `agents/executor.md:61,89,130-136`. → gate or remove the TS branch and replace the `bun test`/"2197" example
  with a markdown-tree verification (the `skills/orchestration/scripts/` guards).

### Cluster F — doc↔path resolution (D4.8; gated by Always-Ask #1)

Path refs, line anchors, and citations that do not resolve. D4-002 sets the convention that decides how the
bare-root-path subset is treated.

- **D4-002** (High, **Always-Ask #1**) — repo-root path refs (`.claude/`/`.agents/`/`.codex/`/`plugins/`/
  `scripts/`) don't resolve doc-relative; convention undeclared. ~15 skill/agent docs (see the review for the
  full site list). → DECLARE the path-resolution convention once and mark refs as repo-root / logical names
  (Codex defect vs Claude by-design — the user adjudicates). Excludes the wrong-DEPTH links (those are
  D2-017/D2-022).
- **D4-003** (High) — runnable example cites missing `<PM>/scripts/check-skill-mistakes.sh` (real home is
  `skills/orchestration/scripts/`). `planning/mistakes.md:31`. → repoint the example to the orchestration path.
- **D4-007** (High) — stale line anchors for the `git -C` discipline (`executor.md:99-101`/`leader.md:112`;
  real `:107`/`:118`). `git/SKILL.md:325`. → repoint to `executor.md:107`/`leader.md:118`, or cite the
  `## Continuation discipline` section by name (drift-robust).
- **D4-018** (Medium) — stale self-citation `evaluation/SKILL.md:385-393` for the Slug+collision policy
  (actual §392-400). `evaluation/SKILL.md:118`. → change to `§ Slug + collision policy` (rename-robust) or
  the corrected range.
- **D4-023** (Medium, **[corroborated]**) — codex/SKILL.md reference rot: missing mistake file, vanished
  session record, stale `Section 2(d)` ×2. `codex/SKILL.md:243,329,297,396`. → repoint :243 to the surviving
  home (likely `codex/mistakes.md`), replace :329 with a durable link / inline the lesson, replace
  "Section 2(d)" with a stable heading link.

## Cross-dimension overlaps — already on the D2 fix-backlog (do NOT duplicate)

The review's `## Already covered by D2` section lists 10 candidate D4 defects that target the SAME defect at
the SAME location already filed in the merged D2 review, so they are NOT re-filed here and are NOT in the
clusters above. They are tracked on `backlogs/evaluation/fix-d2-review-findings.md`; the D4 fix session should
fix them through THAT queue (or confirm the D2 fix closes them), never re-file:

| D4 candidate(s) | D2 finding | Note |
|---|---|---|
| `../delegation/SKILL.md` shallow link (wrap-up.md:17 + execution.md:17) | D2 delegation broken-link **seed** | seed instance-1 |
| delegation:408 → `rules/docs-cleanup-parallelism.md` | D2-023 | dead link into nonexistent `rules/` dir |
| delegation:292 → `features/agents/backlogs/…session-json.md` | D2-024 | dangling backlog citation |
| record/SKILL.md omits 2-preparation `staging/skills/` | D2-026 | record matrix omits SSOT-declared surface |
| evaluator.md files `evaluation/SKILL.md` under tier-1 Principles | D2-009 | load-tier-order violation (≠ D4-046, which is the duplicate-load) |
| rules.md:351 `diataxis.fr`, :378 design-literal dead link | D2-037 | two broken markdown links (backlog-tracked) |
| interview/SKILL.md `rawdata` retired slot vocab | D2-038 | sole residual `rawdata` user |
| `.claude/skills/coding` missing — mirror count 21/22 | D2-010 | `.claude` mirror missing canonical `coding` |
| codex evaluator vocab-grep gate contradicts its loaded mistake | D2-014 | wrapper gate vs mistakes.md |
| Preparation generated-skill promotion contract self-contradicts | D2-006 | generated-skill promotion owner/timing conflict |

## Note on confirmed-seed siblings (not re-filed)

The confirmed D4 seeds are instance-1 and NOT re-filed; their consolidated siblings live in the review's
`## Confirmed-seed siblings` table:

- **Preparation-dropped pattern** — D4-001's Preparation-drop aspect + the evaluation.md / workflow/record.md
  / wrap-up/evaluation.md / templates loop-list siblings (all omit Preparation from an "every loop"
  enumeration). Same cross-cycle pattern D2 (D2-008/018/019) and cycle-1 (D1-013/015/031) found.
- **`loop's → loop.s` apostrophe corruption** (D2-034) → sibling **D4-036** (`agent.s`).
- **claude-plugin 22-vs-19 skills CLI snapshot** → sibling **D4-042** (`Hooks (3)` un-reconciled).
- **`.claude`-depth wrong-relative-link seed** (D2-017/D2-022) → sibling **D4-002** (the broader
  repo-root-vs-doc-relative convention gap; the specific wrong-DEPTH links stay D2-017/D2-022, excluded).
- **memory 13-vs-16 type enum** (D2-033) → no new D4 sibling (memory's canonical type/count sites are
  internally consistent).

## Suggested approach

Run as a future scoped session: pick up this backlog, settle the **1 Always-Ask divergence (D4-002,
path-resolution convention)** with the user first, then frame the chosen subset and run gobbi's normal
Ideation→Planning→Execution loops. The term-consistency + count-drift + doc-style clusters are
high-volume but low-risk doc sweeps that can land together; the 7 Highs (intra-doc instruction
contradictions + stale anchors) carry the obeyability bugs and should lead. A future fix campaign should
reconcile this queue against the cycle-1 (`fix-d7-d1-review-findings`), cycle-2 (`fix-d3-d5-review-findings`),
and D2 (`fix-d2-review-findings`) backlogs — the Preparation-omission pattern and the doc-density / count-drift
items recur across cycles. Read the review artifact for the per-finding evidence and exact file locations
before editing. The user decides scope and priority at pick-up.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-29-5ac6cf6e-aae6-4e28-85b3-e90b0a10aaaf-d4/`

## Related

- [[gobbi-adversarial-review-d4]] — the source-of-record reviews artifact (all 46 findings + global term/count reconciliation)
- [[d4-adversarial-review-executed]] — the session journal
- [[fix-d2-review-findings]] — the D2 fix-backlog that owns the 10 cross-dimension overlaps above
- [[review-handoff-d6]] — the next-session handoff (D6 is the sole remaining dimension)
- [[run-deep-adversarial-review]] — the standing review backlog this slice executes against
