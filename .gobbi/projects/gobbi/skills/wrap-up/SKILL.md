---
name: wrap-up
description: "MUST load for Wrap-up. Promotes session staging to durable memory, validates it through the non-skippable dual-system gate, writes the handoff, and closes the session."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Wrap-up

Skill for the **Wrap-up Loop** — the session's closing pass. Wrap-up consolidates a whole session's scattered staging output across every prior loop into durable memory (routing, superseding, and archiving each record to one home), then validates that consolidation through a non-skippable dual-system gate before the manager finalizes git. Load it when running Wrap-up.

---

## Principles

> **Wrap-up is the session's single consolidation gate.**

One loop, one promotion pass, is the only writer that turns scattered staging into durable memory. If any loop wrote memory directly, promotions would scatter and drift and no reader could tell which session produced which record; a single consolidation point keeps durable memory coherent across sessions.

> **The session record is evidence; durable memory is the curated result.**

The session record preserves what happened, for future audits. Wrap-up derives durable memory from it without rewriting the evidence — the two surfaces have different jobs, and mutating the evidence to fix the result destroys the audit trail.

> **Every record has one contract-defined home.**

A record routed to a single deterministic destination is findable next session and keeps the promotion idempotent and re-runnable; an improvised destination is unfindable and quietly reshapes the schema. Where the contract resolves no home, the honest move is to surface the decision rather than guess.

> **Memory is append-only history.**

A deletion leaves a vacuum a future reader cannot recover; keeping the full superseded record under `archive/` makes memory an auditable history rather than a lossy cache. Supersession and archival, not removal, are how a record leaves active memory.

> **Consolidation is trusted only after independent evaluation.**

Promotion creates claims future sessions will trust, and a wrong wrap-up poisons every session that loads it. An independent gate must establish the claims before the one irreversible action publishes them — paid once, versus a miss that compounds — which is why the evaluation gates publication.

---

## Rules

### Must-Follow

- **MUST be the sole writer to durable memory for cross-loop session artifacts** — only the named startup-close promotion exception writes memory earlier, so a stray writer scatters promotion authority. Project-specific skills are source artifacts authored and committed by their ordered Execution task, not Wrap-up promotions.
- **MUST leave the session scratch tree (`{N}-{loop}/working/`, `staging/`, `evaluation/`) intact after Wrap-up** — the scratch is the audit trail the promotion is verified against.
- **MUST preserve every prior-loop staging source as read-only evidence** — mutating the evidence to fix the result destroys the audit trail.
- **MUST build and validate one complete promotion manifest (all candidate files plus destination preimages) before the first durable-memory mutation** — a half-finished multi-write has no recovery boundary.
- **MUST account for every expected staging source and every staged file** (promote / backlog / documented drop); `startup/` is excluded — an unaccounted staging file is silent lost work.
- **MUST route only to a declared destination, carrying the authorizing user decision for every judgment fork** — an improvised destination is unfindable and reshapes the schema.
- **MUST key idempotence by stable source identity `{session-id, source-relative-path}` plus the frozen manifest mapping** — a staging-only field stripped at promotion cannot identify the destination on re-run.
- **MUST preserve bidirectional supersession, archival history, and inbound-reference integrity** — a one-directional link leaves two authoritative-looking records.
- **MUST run the non-skippable dual-system gate on every Wrap-up, keeping durable memory and the handoff frozen during it** — an evaluator racing a still-writing producer evaluates a moving target.
- **MUST leave git finalization to the manager and gate it on Stage-3 `PASS`** — git is the one irreversible action; it must not outrun its gate.
- **MUST count every `{type}/{area}` post-promotion and route an over-`hardCap` area to an Always-Ask decision** — a dormant switch let an area reach 44 records against a 15 cap unnoticed.
- **MUST cite a verifiable artifact for every handoff claim** — an unbacked "shipped X" is a phantom the next session acts on.
- **MUST stamp every promotion from its type's template** — a freeform write drifts from the schema.
- **MUST treat DISCUSSION as read-only on memory** — substantive memory promotion is confined to WORK Stage 2; RECORD may only seal the evaluated result and performs no new promotion.

### Must-Not-Follow

- **NEVER rewrite prior-loop staging as "auto-backfill."** Fix: normalize only the promoted destination through a correction overlay under `4-wrap-up/working/`; never touch the source file.
- **NEVER promote from `working/`, `outputs/`, `evaluation/`, or `transcripts/`.** Fix: promote from `staging/` — plus the two Wrap-up-authored non-staging sources the current contract defines (a session-surfaced rule candidate and the per-session journal, both user-confirmed and manifest-recorded).
- **NEVER re-promote `startup/`.** Fix: verify its startup-close destinations and record zero manifest rows.
- **NEVER use a stripped staging-only field (e.g. `finding-id`) as the durable rerun identity.** Fix: key on `{session-id, source-relative-path}` plus the frozen manifest.
- **NEVER improvise an area, type, destination, or schema extension.** Fix: return the no-match as a user-decision before freezing the manifest.
- **NEVER hard-delete an active or archived memory record.** Fix: supersede it, then `git mv` the full file to `archive/`.
- **NEVER treat a conditional guard subset as the complete post-promotion guard set.** Fix: re-run every applicable standing guard over the post-promotion tree.
- **NEVER let Stage-3 certify Stage-5 (git) outcomes that cannot exist before finalization.** Fix: Stage-3 checks "no premature finalization plus a valid plan" only.
- **NEVER use `git status` as proof of the gitignored session tree's contents.** Fix: use filesystem enumeration or content hashes.
- **NEVER let an over-`hardCap` area reach `PASS` silently.** Fix: route it to the Always-Ask decision.

---

## Procedure

Wrap-up runs the four loop phases as a five-stage gated pipeline. The stages are ordered on the `PASS` path across three owners, with verdict-dependent re-entry: a Stage-3 `REVISE` returns to Stage 1 and re-runs source inventory, validation, and the E6 complete-preimage preflight before re-promotion. The one irreversible action — git — is last. The Stage-1/2 detail (routing, area resolution, the frontmatter strip allowlist, collision policy, archive routing, the compliance scan, the session-subdir cleanup, and the post-promotion green-check) lives in [`promotion.md`](promotion.md); the compaction sub-procedure lives in [`compaction.md`](compaction.md).

### Loop and pipeline map

| Loop phase | Pipeline stage | Top-level action |
|---|---|---|
| DISCUSSION | Pre-stage | Confirm closure readiness; name the expected loops / slices; capture final user-added items. |
| WORK | Stage 1 — Validate & plan | Inventory the immutable session sources; validate them (compliance scan); build the complete manifest plus candidates, collision decisions, and destination preimages. No memory mutation. |
| WORK | Stage 2 — Promotion & consolidate | Recheck preimages; apply the frozen manifest; write the journal; supersede and archive; run the compaction sub-procedure; draft the handoff. |
| EVALUATION | Stage 3 — Validate memory & handoff | Both systems evaluate the frozen inventory / manifest / delta / guards / handoff. Each verdict advances to RECORD first. `REVISE` → Stage 1; `FAIL` → escalate; neither permits Stage 5. |
| RECORD | Stage 4 — Seal closure evidence | On `PASS`, seal the evaluated working handoff draft to `outputs/handoff.md` with the memory-reads audit and resolution log; on every verdict, seal iter state. No new promotion. |
| Manager exit | Stage 5 — Finalize & close | Manager runs git finalization after `PASS`, presents the handoff and result, emits `workflow.finish`, cleans the worktree. |

### Child docs

- Read [`promotion.md`](promotion.md) when running WORK Stages 1–2 — it owns the promotion procedure, the [Staging → Memory routing](promotion.md#staging--memory-routing) table, area resolution, the frontmatter strip / preserve allowlist, the collision and idempotency policy, archive routing, the prior-loop compliance scan, the session-subdir cleanup, and the post-promotion standing-guard green-check.
- Read [`compaction.md`](compaction.md) when Stage 2 reaches the compaction sub-procedure — it owns the always-count, the over-`hardCap` Always-Ask gate, cluster / merge / repoint / verify, the merged-file (MoC) mechanics, and the merge-manifest fields.

### Memory Access Matrix

The assistant owns Wrap-up's WORK and has broader write privileges than any other loop — this is the documented loop exception.

| Memory tier | Path root | Access |
|---|---|---|
| Session record — own loop | `sessions/{date}-{session-id}/4-wrap-up/{working,outputs}/` | READ + WRITE — manifest, inventory, snapshot, reconciliation log, handoff |
| Session record — all prior loops | `sessions/{date}-{session-id}/{1-ideation..3-execution}/` (plus the Chat per-slice trees) | READ-ONLY — the immutable promotion sources and evidence |
| Session record — `session.json` | `sessions/{date}-{session-id}/session.json` | READ triplet; UPSERT own `workflow.wrap-up.iterations[]` |
| Feature memory | `.gobbi/projects/{project-name}/features/{feature-name}/` | WRITE + UPSERT — bootstrapped lazily on first write per sub-directory |
| Memory | `.gobbi/projects/{project-name}/{mistakes,rules,design,notes,backlogs,references,decisions,plans,reviews,reports,learnings,archive,skills}/` | WRITE + UPSERT — project-scope promotions |

Wrap-up NEVER deletes: supersede via frontmatter, then `git mv` the terminal file to `archive/{type}/{area}/`. Re-running Wrap-up on the same session produces identical memory (deterministic targets; stable-identity collision keys). A write outside these WRITE rows is a violation — return `NEEDS_CONTEXT`.

### DISCUSSION — Pre-stage (manager + user, direct)

The leader is not spawned; the design is locked across the prior loops. The manager reads every prior loop's PASS-iter `outputs/` and builds a short outcome summary (what shipped, what was deferred, evaluator verdicts) plus an explicit expected-source register — naming each completed loop, Execution task, and Chat slice, not inferred only from the directories that happen to exist. The manager then runs the active runtime's user-decision primitive: is anything deferred, open, or observed to log before close — a rule discovered mid-session, a mistake candidate, a backlog candidate, a supersession decision? Additions are captured in `4-wrap-up/working/discussion-log.md`. The manager constructs the assistant delegation prompt and verifies it has zero unfilled slots.

### WORK — Stages 1–2 (delegated to `assistant`)

The substantive memory promotion happens in WORK Stage 2. RECORD is the uniquely permitted memory-writing RECORD across loops, but it only seals the evaluated result and performs no new promotion; Stage 4 does not promote. The assistant runs the [`promotion.md`](promotion.md) procedure in order; the summary below maps its two WORK stages.

**Stage 1 — Validate & plan (no memory mutation).** Snapshot the pre-Wrap-up `.gobbi/projects/{project-name}/` state as the evaluation baseline. Inventory `staging/` across every expected prior loop — and every Chat per-slice `staging/` in a Chat session — and ONLY `staging/`; never `working/`, `outputs/`, `evaluation/`, or `transcripts/`, and never the `startup/` surface (startup owns its startup-close promotion). Run the prior-loop compliance scan (read-only: a mechanical gap normalizes only into the promoted candidate through a correction overlay, never into the source; a judgment gap escalates via `NEEDS_CONTEXT`). Resolve every route, render every candidate, and freeze one complete manifest plus destination preimages before any write.

**Stage 2 — Promotion & consolidate.** Recheck the preimages, then apply the frozen manifest: bootstrap each destination lazily, stamp its type template, write each promoted file, and for a terminal collision supersede plus `git mv` the old file to `archive/`. Write the one per-session journal entry at `notes/{area}/{date}-{slug}.md` (the durable cross-session handoff). Run the compaction sub-procedure ([`compaction.md`](compaction.md)) as Stage 2's final sub-step, so the non-skippable Stage-3 gate validates its writes. Draft the handoff at `4-wrap-up/working/handoff-draft.md`; Stage 3 evaluates that working draft, and Stage 4 seals it to `4-wrap-up/outputs/handoff.md` only on `PASS`. When `propose.mode: dual`, integrate the frozen Codex proposal per [`production.md`](../orchestration/workflow/production.md) and log deltas to `reconciliation-iter{n}.md`; a missing proposal is not a gate — degraded mode stamps `production_mode: claude-only`.

### EVALUATION — Stage 3 (the non-skippable dual-system gate)

This phase IS pipeline Stage 3 — memory validation — and it is NON-SKIPPABLE: no setting removes it, and it always gates the irreversible git Stage 5. Two independent systems (Claude Code + Codex) evaluate the frozen working handoff draft, promotion manifest, staging inventory, original pre-Wrap-up snapshot, and the post-promotion project delta across all seven perspectives plus Overall; the manager reconciles them to one `PASS` / `REVISE` / `FAIL` verdict. Stage 3 verifies only "no premature finalization plus a valid manager plan / ownership" — it never certifies a Stage-5 git outcome that cannot exist before finalization. The post-promotion standing-guard green-check that gates `PASS` re-runs every standing guard — `validate-frontmatter.sh`, `check-markdown-links.sh`, `check-residual-vocab.sh`, `check-skill-mistakes.sh`, and `check-workflow-mirror-consistency.sh` — over the post-promotion tree per [`promotion.md`](promotion.md#post-promotion-standing-guard-green-check); the compaction sub-procedure adds `check-merge-ref-integrity.sh` when it runs a merge. `REVISE` returns to Stage 1; `FAIL` escalates through the user-decision primitive; neither lets Stage 5 run.

### RECORD — Stage 4 (seal closure evidence)

RECORD runs after every EVALUATION (any verdict) and seals — it performs no new promotion. On every verdict, it upserts `session.json` and preserves the transcript. On `PASS`, it copies the evaluated `4-wrap-up/working/handoff-draft.md` to the PASS-only `4-wrap-up/outputs/handoff.md`, stamps the handoff frontmatter, and writes the `memory-reads` and `resolution-log` audits, per [`record/SKILL.md`](../record/SKILL.md). Any new promotable finding from Wrap-up's own EVALUATION routes through the promotion contract — RECORD improvises no destination.

### EXIT — Stage 5 (manager-owned; runs LAST)

Stage 5 is the manager's and runs ONLY after Stage-3 `PASS`. The gitignored `sessions/` tree is never committed; Stage 5 commits the Stage-2 memory promotion writes (under `features/`, `mistakes/`, `rules/`, `notes/`, …) with the `AI-Provenance-Record:` trailer, then pushes and opens or reuses the PR ([`git/SKILL.md`](../git/SKILL.md) § P4), merges and cleans up the worktree ([`git/SKILL.md`](../git/SKILL.md) § P5), and emits `workflow.finish`. A blocked push defers the PR; the commit still lands. The assistant performs no Stage-5 action; a `REVISE` or `FAIL` at Stage 3 means Stage 5 does not run.

### Output paths

Session writes are scoped to `4-wrap-up/`; memory writes follow the [Staging → Memory routing](promotion.md#staging--memory-routing) table. `{date}` = session start date; `{session-id}` = the manager-supplied parent session id; `{project-name}` / `{feature-name}` from `session.json`; `{n}` = the manager-supplied iter.

| Path | Written by |
|---|---|
| `4-wrap-up/working/{pre-wrap-up-snapshot.txt, snapshot-iter{n}.txt, staging-inventory.md, promotion-manifest.md, reconciliation-iter{n}.md, discussion-log.md, handoff-draft.md}` | assistant (WORK) / manager (DISCUSSION) |
| `4-wrap-up/working/proposals/codex/draft-iter{n}.md` | Codex proposer — frozen before integration |
| `4-wrap-up/outputs/{handoff.md, memory-reads.md, resolution-log.md}` | assistant (RECORD) — PASS only |
| `4-wrap-up/evaluation/iter{n}/{claude,codex}/{perspective}.md` + `checklist.md` | evaluator (EVALUATION) |
| memory promotions per the routing table, plus the `notes/{area}/{date}-{slug}.md` journal | assistant (WORK Stage 2) |
| `session.json` (`workflow.wrap-up` upsert) | assistant (RECORD) |
| `workflow.finish` | manager (Stage 5) |

---

## References

One owner per borrowed claim, drawn from the design's claim-owner ledger. Guard scripts are named as code-spans, not `../` links, because a repo-root climb resolves from the canonical path but breaks through the runtime mirror; sibling-skill and same-directory owners keep a resolvable link.

| Borrowed claim | Owner |
|---|---|
| Area resolution and the area allowlist rule | [`memory/rules.md`](../memory/rules.md) § 1.5 |
| Frontmatter base plus per-type extensions and staging-field stripping | [`memory/rules.md`](../memory/rules.md) § 2 |
| Compaction standard (MoC, caps, split-on-retire) | [`memory/rules.md`](../memory/rules.md) § 5 |
| Area allowlist and cap VALUES | [`memory-vocabulary.json`](../memory/memory-vocabulary.json) |
| Promotion inventory sources and session-tree facts | [`record/record-map.md`](../record/record-map.md) § Wrap-up promotion-inventory rule |
| RECORD-versus-promotion distinction; the capture side | [`record/SKILL.md`](../record/SKILL.md) § RECORD Phase |
| The dual-system gate, seven perspectives, and finding routing | [`evaluation/SKILL.md`](../evaluation/SKILL.md) |
| Proposer freeze and selective integration | [`production.md`](../orchestration/workflow/production.md) |
| Git finalization — push / open PR | [`git/SKILL.md`](../git/SKILL.md) § P4 |
| Git finalization — land PR / merge / cleanup | [`git/SKILL.md`](../git/SKILL.md) § P5 |
| Archive move-on-terminal file form | [`memory/templates/archive.md`](../memory/templates/archive.md) |
| Per-type templates stamped on promotion | [`memory/templates/`](../memory/templates/) |
| Always-Ask decision classification | [`discussion/SKILL.md`](../discussion/SKILL.md) § Decision Classification |
| Manager spawn / orchestration and the commit boundary | [`orchestration/workflow/wrap-up.md`](../orchestration/workflow/wrap-up.md) |
| Routing / promotion child-doc contract | [`promotion.md`](promotion.md) |
| Compaction child-doc contract | [`compaction.md`](compaction.md) |
| Frontmatter well-formedness guard | `validate-frontmatter.sh` |
| Relative-link resolution guard | `check-markdown-links.sh` |
| Residual stale-vocabulary guard | `check-residual-vocab.sh` |
| Skill-surface `mistakes.md` conformance guard | `check-skill-mistakes.sh` |
| Runtime-doc mirror guard | `check-workflow-mirror-consistency.sh` |
| Merge ref-integrity gate (compaction only) | `check-merge-ref-integrity.sh` |
