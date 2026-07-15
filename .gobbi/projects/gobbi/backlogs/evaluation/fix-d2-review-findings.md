---
name: fix-d2-review-findings
description: "Deferred fix queue for the 40 D2 (completeness of agents + skills) adversarial-review findings — review-only → future scoped session."
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-29
session: 5ac6cf6e-aae6-4e28-85b3-e90b0a10aaaf
tags: [evaluation, process]
keywords: [adversarial-review, d2, completeness, load-graph, mirror, fix-queue]
author: claude
priority: high
project-scope: true
shipped_in: null
---

# Fix queue — D2 adversarial-review findings (completeness of agents + skills)

## Ownership closure

Historical finding locations below remain evidence of the reviewed tree. For any still-open Gobbi dispatch or Load-Directives remediation, the live owner is now `orchestration/delegation.md` with its templates under `orchestration/templates/`; generic delegation semantics remain in `delegation/SKILL.md`.

## Context

The 2026-06-29 D2 adversarial-review session reviewed the **completeness of the gobbi agent +
skill surface** — skill internal/between-skill integrity, runtime mirrors, the global load graph,
handoff continuity, and count consistency — **dual-system** (Claude + Codex, six budget-sized chunks
each), and produced **40 consolidated findings** from 53 raw (10 cross-system-corroborated, 30
single-system). The session was **review-only** (the charter is review-only; fixes are separate
sessions), so no finding was fixed. This backlog is the deferred fix queue. The **source of record**
for every finding (full per-finding record, evidence, proposed remediation, cross-system divergence,
the global load-graph reconciliation, count-drift table, and confirmed-seed siblings) is
`reviews/adversarial-review/2026-06-29-gobbi-adversarial-review-d2.md`.

Severity tally: **Critical 3 · High 13 · Medium 16 · Low 8 = 40.**

## Why deferred

The user chose review-only for this charter slice. Fixing findings is out of scope for a review
session and belongs in a scoped Execution session that can plan, change source, and re-verify.

## When to pick up

Any time after this session — no hard prerequisite. Recommended sequencing: resolve the **5 substantive
cross-system divergences (Always-Ask)** first — they decide the disposition direction for whole
clusters — then take the **root-cause + Critical head**, then the systemic clusters, then the
standalone Lows. Several findings are doc-only sweeps that can land together; the two structural
questions (the dead-end-handoff class and the staging-ownership contradiction) are best settled as
deliberate design decisions, not spot-edits.

## Always-Ask before fixing — the 5 substantive cross-system divergences

Each is the SAME location with OPPOSITE verdicts; the user must adjudicate the direction before any
edit, because the fix differs by verdict. These gate their clusters.

1. **Named-successor-without-load-directive = dead-end? (D2-001, D2-002).** Codex = Critical dead-end
   (no explicit load directive); Claude = NAMED, no defect. Resolving this also settles whether the
   seeded Ideation→Preparation gap is structurally unique or one of three. Gates the dead-end cluster.
2. **coding eval wiring (D2-003 vs D2-036).** Codex = Critical structural dead-end (coding ships but is
   unreachable from the live workflow); Claude = Low stale-language. Decide: wire `coding/evaluation.md`
   into Execution EVALUATION, or declare it standalone and drop the successor expectation.
3. **Mirror scripts (D2-032).** Codex = defect (mirror every exposed file); Claude = by-design (mirror
   docs, not runtime scripts). Either way the fix is to DOCUMENT the rule (a D2-015 corollary).
4. **D2.2 operational-contract bar (D2-028).** Codex applies a uniform "every skill needs Memory Access
   Matrix / Outputs / Constraints / Exit" bar to 8 skills; Claude treats reference/discipline skills as
   implicitly-contracted and files none. A skill-authoring-standard policy decision.
5. **memory/rules.md broken links (D2-037).** Codex = new High; Claude = already backlog-tracked. A
   provenance disagreement — resolve by closing via the existing backlog (see overlap note below).

## The fix queue — by cluster

Each entry: **ID** (severity) — one-line. `location`. → directional fix (see the review artifact for
the full proposed remediation + verification step). A finding that spans two clusters is cross-noted.

### Cluster A — `.claude/skills` mirror (root cause D2-015)

The asymmetric mirror is the Principle-8 root of every `.claude/skills` gap. Fix the root first, then
the symptoms collapse together.

- **D2-015** (High, ROOT) — `.claude/skills` mirror is unmanaged by `sync-plugin-package.sh` and
  unvalidated by `--check` (exits 0 while `.claude/skills/coding` is absent). `scripts/sync-plugin-package.sh:75-90`.
  → extend sync + `--check` to assert a per-file `.claude/skills/{name}/` mirror for every agent-exposed
  file, OR add a dedicated `.claude/skills`-parity guard at the wiring gate.
- **D2-010** (High) — `.claude` mirror missing the canonical `coding` skill (21 of 22; `.agents` + plugin have it).
  `.claude/skills/coding/` (absent). → pick one policy: ship `.claude/skills/coding/` per-file symlinks and
  correct `coding/review.md:450`'s "deferred" claim, OR remove the other two mirrors and fix the count.
- **D2-030** (Medium) — `.claude` mirror omits link-target child `gobbi/hook-authoring.md` (gobbi loads every session).
  `.claude/skills/gobbi/hook-authoring.md` (absent). → add the per-file symlink (+ fix root via D2-015).
- **D2-031** (Medium) — `.claude` mirror omits link-target `memory/memory-vocabulary.json` (memory widely loaded).
  `.claude/skills/memory/memory-vocabulary.json` (absent). → add the per-file symlink (+ fix root).
- **D2-032** (Medium, **Always-Ask #3**) — `.claude` mirror omits 13 scripts + `codex/task-metadata.md`.
  `.claude/skills/*/scripts/*`. → document the "mirror docs, not scripts" rule in skill-writing P5 (or mirror them).
- **D2-029** (Medium) — `coding` absent from the gobbi master Skill-Map discovery index (not a true orphan; it has
  inbound edges). `gobbi/SKILL.md §Skill Map (161-217)`. → add a Skill-Map row for `coding` (or an explicit deferred note).

### Cluster B — dead-end handoffs (gated by Always-Ask #1)

The successor-transition class. The seed `Ideation → Preparation` is instance 1 (not re-filed); these are siblings.

- **D2-001** (Critical, **Always-Ask #1**) — Preparation PASS never loads `planning/SKILL.md`. `preparation/SKILL.md:58-62,323-332,372-395`.
  → add a PASS-after-RECORD handoff step that loads `../planning/SKILL.md`. (Claude: NAMED — divergence.)
- **D2-002** (Critical, **Always-Ask #1**) — Planning PASS never loads `execution/SKILL.md`. `planning/SKILL.md:11-20,389-412,439-462`.
  → add a PASS-after-RECORD step that loads `../execution/SKILL.md` and starts task 1. (Claude: NAMED — divergence.)
- **D2-003** (Critical, **Always-Ask #2**) — `coding/evaluation.md` + `review.md` dead-end from Execution EVALUATION.
  `coding/evaluation.md:3`; `execution/SKILL.md:167-180`. → wire it in for code change-sets, OR declare standalone. (See also D2-036.)
- **D2-005** (High, corroborated) — Execution final-task → Wrap-up transition unstated. `execution/SKILL.md:9-18,175-199,227-251`.
  → add the cursor-exhausted branch: final task PASS → manager loads `../wrap-up/SKILL.md`.

### Cluster C — staging-ownership / write-surface contradictions (structural; gated by Always-Ask #1 partly)

The `staging/` writer-set + memory-classification root tangle. D2-007 is the structural root; D2-011 is the memory-doc root.

- **D2-007** (High, corroborated) — `staging/` writer-set + timing self-contradicts (PASS-only vs WORK vs loop-entry).
  `record/SKILL.md:41,89-91,303-318`; `record-map.md:117-120`. → pick ONE model (WORK-time producers vs RECORD-time assistant), align all three docs.
- **D2-011** (High) — Project `skills/` is both excluded-from-memory and a memory write target (the owning memory doc flags it unresolved).
  `memory-map.md:151-153`; `preparation/SKILL.md:58-62`; `wrap-up/SKILL.md:51,312-316`. → decide ONE classification, align memory-map/preparation/wrap-up/record.
- **D2-006** (High) — Generated-skill promotion owner conflicts (Preparation pre-Planning vs Wrap-up). `preparation/SKILL.md:58-62,252-256,434-442`; `wrap-up/SKILL.md:47-51,306-312`.
  → make Preparation text match the exception: manager-promotes-before-Planning; Wrap-up only verifies/records. (Root: D2-011.)
- **D2-012** (High, conf 75) — research↔Preparation `staging/references/` ownership contradiction (NEW seed sibling of the ideation case).
  `research/SKILL.md:22,168-169`; `preparation/SKILL.md:421`. → reconcile like the ideation fix; route Preparation externals via `working/research/`.
- **D2-026** (Medium, corroborated) — record matrix omits Preparation `staging/skills/` (+ `plans/` from the brace). `record/SKILL.md:41,303-318`; `record-map.md:130-144`.
  → add `staging/skills/` + complete `plans/` in record/SKILL.md, OR note it is leader-WORK-written and intentionally absent. (Related to D2-007.)
- **D2-008** (High) — Preparation omitted from the forbidden-memory-write matrix rows (contradicts the file's own exception clause).
  `record/SKILL.md:45-47,365`. → add Preparation to the two Memory Access Matrix forbidden rows. (Also Cluster E.)

### Cluster D — broken / wrong-depth links (sibling of the delegation-link seed)

Mechanical link fixes; the delegation-link seed is instance 1.

- **D2-017** (Medium, corroborated class) — orchestration `.claude` hook/script links use 4 `../` not 5. `orchestration/SKILL.md:108,324,330`.
  → repoint the three targets to five `../`.
- **D2-022** (Medium, corroborated) — delegation `.claude` hook/script links use 4 `../` not 5. `delegation/SKILL.md:292,309`.
  → repoint both to five `../`. (Sibling of D2-017.)
- **D2-023** (Medium, corroborated) — delegation cites `rules/docs-cleanup-parallelism.md` — dir + file absent. `delegation/SKILL.md:408`.
  → repoint to the rule's real home (`skills/memory/rules.md`) or convert to prose. (The exact trap delegation's own mistakes.md warns about.)
- **D2-024** (Medium, corroborated) — delegation cites `features/agents/backlogs/…session-json.md` — file absent. `delegation/SKILL.md:292`.
  → repoint to the backlog's real location (likely moved under the `{area}/` schema), recreate, or inline the limitation.
- **D2-025** (Medium, conf 75) — executor template example skill paths `bun`/`typescript` do not exist. `delegation/templates/executor.md:43`.
  → replace with existing skill paths or make the examples clearly abstract. (Sibling of the `skills/claude/SKILL.md` seed.)

### Cluster E — Preparation-omission pattern

Preparation was inserted into the lifecycle; several enumerations were never updated.

- **D2-008** (High) — forbidden-memory-write matrix omits Preparation (see Cluster C).
- **D2-018** (Medium, conf 90) — leader-owns agent-type table drops Preparation. `orchestration/SKILL.md:24,37` (contradicts :291 + `gobbi/SKILL.md:152`).
  → add Preparation to the leader `Owns` cell (:37) and the manager-MUST-NOT list (:24).
- **D2-019** (Medium, conf 90, **merge-only**) — EVALUATION-loop-set enumerated 3 different ways across 4 docs.
  `evaluation.md:3` (4, no Prep); `production.md:3` (5); `gobbi/SKILL.md:141` (5); `.claude/CLAUDE.md` (3). → rewrite the three outliers to match production.md's all-5 set. (Also Cluster F.)

### Cluster F — count drift

- **D2-019** (Medium) — EVALUATION-loop-set 3-way drift (see Cluster E).
- **D2-033** (Low, conf 85) — memory value-feature row says "the 13 types"; canonical enum is 16. `gobbi/SKILL.md:208` (vs `memory/rules.md:256-258`).
  → replace "the 13 types" with "the 16 types" (or name the precise subset). (Note: `memory/SKILL.md:24` "README + 14 subdirs" flagged for verification in the review's global reconciliation, not separately filed.)

### Standalone High

- **D2-004** (High) — RECORD postcondition "Memory writes complete" contradicts the sole-writer boundary. `orchestration/SKILL.md:251-257`.
  → change the RECORD postcondition to session-evidence/staging completion; reserve "memory writes complete" for the Wrap-up row.
- **D2-009** (High) — Evaluator template puts `evaluation/SKILL.md` in the Principles tier, violating the load-tier order. Historical locations: `delegation/SKILL.md:38-40`; `templates/evaluator.md:59-67`.
  → apply the remediation in `orchestration/delegation.md` and `orchestration/templates/evaluator.md`: move it to the Skills tier, OR document an explicit evaluator-only exception in both docs.
- **D2-013** (High, conf 75) — codex production foreground-vs-background self-contradicts; `timeout 1200` exceeds the host Bash cap. `codex/SKILL.md:152,153,179,181,350`.
  → decide one proposer mode (BACKGROUND for runs over the cap), reconcile :152/:179/:181 + the :350 example, add a per-runtime-cap sentence. (Contradicts a project mistake created this session.)
- **D2-014** (High) — Codex evaluator vocab-grep gate contradicts its own loaded mistake. `codex/SKILL.md:358-363`; `codex/mistakes.md:24-31`.
  → make the wrapper gate require file-exists + non-empty + verdict lines; keep vocab checks advisory.
- **D2-016** (High) — leader + assistant prompts deny the existing `agent-writing` skill. `agents/leader.md:39`; `agents/assistant.md:47`.
  → name `agent-writing` for agents/ work; narrow any "no dedicated skill" statement to domains that truly lack one.

### Standalone Medium

- **D2-020** (Medium, conf 90) — Wrap-up RECORD `evaluation_dir` drops the `5-` ordinal; resolves to nothing. `wrap-up/SKILL.md:541`.
  → change to `"evaluation/iter{n}/"` (loop-relative) or `"5-wrap-up/evaluation/iter{n}/"` (session-relative).
- **D2-021** (Medium, conf 50) — `AskUserQuestion` granted inconsistently across 5 loop skills + to a forbidden role. `ideation/preparation/planning vs execution/wrap-up SKILL.md:4`.
  → choose one rule (drop from all five or add to all five) aligned with the invoking role. (Relates to D2-040.)
- **D2-027** (Medium, conf 50) — evaluator writes worktree session-record but is excluded from the git-skill gate. Historical locations: `delegation/SKILL.md:128`; `templates/evaluator.md:53-69`.
  → apply the remediation in `orchestration/delegation.md` and `orchestration/templates/evaluator.md`: add `git/SKILL.md` + `git/mistakes.md` to the evaluator template + the rule's enumeration, OR document the exemption.
- **D2-028** (Medium, conf 75, **Always-Ask #4**) — 8 skills omit operational-contract sections. `discussion/delegation/coding/principles/claude-plugin/codex/agent-writing/skill-writing SKILL.md`.
  → decide the bar: uniform operational footer, or a stated exemption class. (Claude: reference-skills exempt — divergence.)

### Standalone Low

- **D2-034** (Low, conf 90) — `loop's` apostrophe corrupted to `loop.s` (ideation only). `ideation/SKILL.md:3,52,411`. → replace `loop.s` → `loop's`.
- **D2-035** (Low, conf 50) — anchor-fragment drift on `+`/em-dash headings (wrong hyphen count). `evaluation/SKILL.md:102`; `record/SKILL.md:91`. → fix the fragments to the computed GitHub slugs (renderer-dependent).
- **D2-036** (Low, **Always-Ask #2**) — stale "when that skill exists/created" — `coding/evaluation.md` already exists. `evaluation/SKILL.md:551`; `execution/evaluation.md:7`. → reword to present tense (load-wiring deferred). (Narrow angle on D2-003.)
- **D2-037** (Low, **Always-Ask #5**, backlog-tracked) — two broken markdown links. `memory/rules.md:351,378`. → add `https://` to the Diátaxis URL; repoint/recreate the missing mistake link — or close via the existing backlog (see overlap).
- **D2-038** (Low, conf 25) — interview retains the retired `rawdata`/`artifacts` slot vocabulary. `interview/SKILL.md:36,38,331,332`. → rename to `working/`/`outputs/`, OR document the bootstrap-shape exception.
- **D2-039** (Low, conf 25) — skill-writing/agent-writing declare read-only `allowed-tools` yet document file-creating procedures. `skill-writing/SKILL.md:77`; `agent-writing/SKILL.md:5`. → add a reference-skill note, OR add `Write, Edit`.
- **D2-040** (Low, conf 25) — Claude-only `AskUserQuestion` baked into a runtime-neutral skill + generated skills. `interview/SKILL.md:4`; `templates/project-skill.md:26`. → drop it from the `project-skill.md` default, and/or document the permission-vs-behavior split. (Relates to D2-021.)

## Note on overlap with existing backlogs

- **D2-037** overlaps `backlogs/memory/preexisting-broken-markdown-links.md` (L32-34, L61-65 already track both `memory/rules.md` broken links). The fix session should close D2-037 through that existing backlog rather than re-filing — this is the substance of Always-Ask #5.
- The **D2 confirmed seeds** are tracked from cycle 1: the `skills/claude/SKILL.md` dangling reference overlaps `backlogs/process/claude-skill-dangling-ref.md` (↔ prior D1-006); the `delegation/SKILL.md` wrong-path link overlaps `backlogs/process/wrapup-workflow-doc-broken-delegation-link.md` (↔ prior D1-007). D2's broken-link cluster (D2-017/022/023/024/025) and dead-end cluster are SIBLINGS of those seeds — reconcile the consolidated fix against the narrow entries (close/supersede once the consolidated fix lands) rather than fixing the same surface twice.
- A future fix campaign should reconcile this queue against the cycle-1 (`fix-d7-d1-review-findings`) and cycle-2 (`fix-d3-d5-review-findings`) backlogs — the Preparation-omission pattern, the staleness machinery, and the doc-density/duplication items recur across cycles.

## Suggested approach

Run as a future scoped session: pick up this backlog, settle the 5 Always-Ask divergences with the
user first, then frame the chosen subset (the structural questions — dead-end class + staging-ownership
— likely a design session; the mirror-root + link + count clusters a focused doc/tooling session) and
run gobbi's normal Ideation→Planning→Execution loops. Read the review artifact for the per-finding
evidence and exact file locations before editing. The user decides scope and priority at pick-up.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-29-5ac6cf6e-aae6-4e28-85b3-e90b0a10aaaf/`

## Related

- [[gobbi-adversarial-review-d2]] — the source-of-record reviews artifact (all 40 findings + global load-graph)
- [[d2-adversarial-review-executed]] — the session journal
- [[review-handoff-d4-d6]] — the next-session handoff (D4 + D6 remain)
- [[run-deep-adversarial-review]] — the standing review backlog this slice executes against
