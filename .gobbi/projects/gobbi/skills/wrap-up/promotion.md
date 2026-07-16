# Wrap-up Promotion — Stages 1 & 2

The routing and lookup machinery of the Wrap-up Loop. `wrap-up/SKILL.md` holds the top-level SOP and points
here; this child doc holds the detail an agent opens when running promotion. It covers the two WORK-owned
pipeline stages — **Stage 1 (Validate & plan)** and **Stage 2 (Promotion & consolidate)** — plus the reference
tables both stages look up: the Staging → Memory routing table, area resolution, the frontmatter allowlist,
the collision policy, archive routing, the post-promotion green-check, and the going-forward session-subdir
cleanup. Read it after `SKILL.md` when running Wrap-up's WORK, when inventorying session sources, when
building the promotion manifest, or when auditing a promotion decision.

The pipeline map (which loop phase owns which stage), the five Principles, and the Rules floor live in the
parent [`SKILL.md`](SKILL.md). The compaction sub-procedure (Stage 2's final sub-step) lives in the sibling
[`compaction.md`](compaction.md). This doc does not restate those; it names them where the procedure reaches
them.

## Table of Contents

- [Stage boundary and source contract](#stage-boundary-and-source-contract)
- [Promotion procedure](#promotion-procedure)
  - [P1 — Inventory the immutable sources](#p1--inventory-the-immutable-sources)
  - [P2 — Scan prior-loop staging for compliance](#p2--scan-prior-loop-staging-for-compliance)
  - [P3 — Resolve routes and render every candidate](#p3--resolve-routes-and-render-every-candidate)
  - [P4 — Freeze the complete manifest and preimages](#p4--freeze-the-complete-manifest-and-preimages)
  - [P5 — Recheck preimages, then apply the frozen manifest](#p5--recheck-preimages-then-apply-the-frozen-manifest)
  - [P6 — Complete supersession and archive moves](#p6--complete-supersession-and-archive-moves)
  - [P7 — Run the compaction sub-procedure](#p7--run-the-compaction-sub-procedure)
  - [P8 — Draft the handoff summary](#p8--draft-the-handoff-summary)
  - [P9 — Prove the post-promotion tree is green](#p9--prove-the-post-promotion-tree-is-green)
- [Prior-loop staging compliance scan](#prior-loop-staging-compliance-scan)
- [Staging → Memory routing](#staging--memory-routing)
- [Area resolution on promotion](#area-resolution-on-promotion)
- [Frontmatter allowlist on promotion](#frontmatter-allowlist-on-promotion)
- [Collision and idempotency policy](#collision-and-idempotency-policy)
- [Archive typed-subdir routing on terminal-state moves](#archive-typed-subdir-routing-on-terminal-state-moves)
- [Post-promotion standing-guard green-check](#post-promotion-standing-guard-green-check)
- [Non-standard session-subdir cleanup (going-forward)](#non-standard-session-subdir-cleanup-going-forward)
- [Working artifacts and exit criteria](#working-artifacts-and-exit-criteria)

---

## Stage boundary and source contract

**Stage 1 — Validate & plan.** Reads session evidence and existing memory; may write planning artifacts under
`5-wrap-up/working/`. It MUST NOT mutate durable memory or any prior-loop staging source.

**Stage 2 — Promotion & consolidate.** Applies the frozen Stage-1 manifest only after rechecking every
captured destination preimage. It MUST NOT discover a new source, choose a new route, or change a collision
decision while applying.

**The stable source identity** is `{session-id, source-relative-path}`, where `source-relative-path` is
normalized relative to the **session root** and includes the loop / task / Chat-slice prefix. It never uses an
absolute worktree path — worktrees are temporary. This identity, plus the frozen manifest mapping, is the
durable rerun authority (E5); no stripped staging-only field is.

**Promotion sources** (the enumerated set — owner:
[`record/record-map.md § Wrap-up promotion-inventory rule`](../record/record-map.md#wrap-up-promotion-inventory-rule)):

- Every prior workflow loop's `staging/`: `1-ideation/staging/`, `2-preparation/staging/`,
  `3-planning/staging/`, `4-execution/staging/` and each `4-execution/task-{NN}-{slug}/staging/`.
- In Chat mode only: every `chat/tasks/*/{N}-{loop}/staging/` and `chat/tasks/*/4-execution/task-*/staging/`.
  A non-Chat session has no `chat/tasks/` tree, so this source is simply absent.
- The two Wrap-up-authored **non-staging** inputs the current contract retains: a user-confirmed rule
  candidate and the per-session journal candidate. Each is materialized as ONE deterministic rendered
  candidate under `5-wrap-up/working/` before manifest freeze, so it carries a stable source-relative path.
  This is a named exception, NOT permission to scan `working/` generally.
- A Preparation `generate-now` skill is normally an already-promoted, manifest-only row: verify its
  destination and re-promote only when it is missing and the Preparation contract authorizes recovery.

**Excluded:**

- The entire `startup/` tree — startup runs its own close-promotion, so including it would double-promote.
- `transcripts/`, `working/`, `evaluation/`, and `outputs/` as general promotion sources. A named direct
  candidate above does not widen this rule.
- Any staging tree from another session.

Every enumerated source reaches exactly one accounted outcome — **promote**, **backlog** (with a recorded
reason), **documented drop** (with an explicit rationale), or **already-promoted**. A silent drop is a
constraint violation; the promotion manifest is the audit trail.

---

## Promotion procedure

Run P1–P9 in order. Stages 1 (P1–P4) and 2 (P5–P9) are the WORK-owned half of the pipeline. **Stage 1 mutates
no durable memory** — it renders and validates the whole plan first, so one invalid candidate halts the batch
before any write (E6). A `NEEDS_CONTEXT` result pauses the procedure without changing durable memory; after the
manager records the user's decision, resume at P1 so the complete plan is rebuilt against fresh state.

### P1 — Inventory the immutable sources

**Stage 1.** No memory mutation.

1. Read the manager-confirmed list of expected prior loops, Execution tasks, and Chat slices. Do NOT infer
   completion only from directories that happen to exist.
2. Snapshot the pre-Wrap-up memory tree to `5-wrap-up/working/pre-wrap-up-snapshot.txt` — enumerate
   `.gobbi/projects/{project-name}/` by filesystem listing plus per-file hashes, **never** `git status`. The
   `sessions/` tree is gitignored and worktree-local, so `git status` is not proof of what it contains.
3. Enumerate the permitted source paths recursively (staging only — never `transcripts/`, `working/`,
   `evaluation/`, `outputs/`, or the excluded `startup/`) and write `5-wrap-up/working/staging-inventory.md`:
   each source's session-root-relative path, byte size, content hash, and extracted staging metadata.
4. Sort sources by normalized source-relative path. This stable order controls collision allocation and makes
   a fresh manifest render deterministic across re-runs.
5. Capture a **source-evidence register** (path + hash) for every prior-loop staging file — the before-state
   that P9 uses to prove Stage 1 left source bytes and paths unchanged (E1).
6. Account for every permitted source (promote / backlog / drop with reason / already-promoted).

### P2 — Scan prior-loop staging for compliance

**Stage 1.** No memory mutation. See [Prior-loop staging compliance scan](#prior-loop-staging-compliance-scan)
for the gap table and finding-class routing.

1. Run the compliance scan over every expected staging directory and inventoried source.
2. Treat prior-loop staging as **immutable** — never edit, replace, rename, move, or append to a source file
   to repair a gap. Mutating the evidence to fix the promoted result destroys the audit trail (E1).
3. For a mechanical normalization, write a **correction overlay** under
   `5-wrap-up/working/correction-overlays/` recording the source identity, original source hash, detected gap,
   deterministic normalization delta, and rendered-candidate hash. The overlay is applied **only** while
   rendering the promoted destination candidate (P3) — the original staging file stays byte-for-byte unchanged.
4. A correction that needs semantic judgment (a `design_flaw` / `assumption_risk`, or any missing value that
   cannot be derived without interpreting prose) returns `NEEDS_CONTEXT`; record the gap and the manager's
   later user-authorized decision in the manifest draft before resuming.
5. Re-hash all prior-loop staging sources after the scan. Any source hash or path change is a hard Stage-1
   failure.

### P3 — Resolve routes and render every candidate

**Stage 1.** No memory mutation. For every source in stable order:

1. Apply the [Staging → Memory routing](#staging--memory-routing) table plus every applicable user-confirmed
   modifier (`mistake-candidate: true`, `supersedes:`, `project-scope: true`, `disposition: deferred`, `area:`).
2. Resolve the destination area via [Area resolution on promotion](#area-resolution-on-promotion).
3. Render the complete destination bytes through the destination type's template and the
   [frontmatter allowlist](#frontmatter-allowlist-on-promotion), applying any correction overlay to the
   rendered candidate only.
4. Resolve collisions via [Collision and idempotency policy](#collision-and-idempotency-policy).
5. Render **every related mutation**, not only the main destination: feature-`README.md` updates, skill-owned
   `mistakes.md` section appends, supersession lifecycle flips, archive moves, the per-session journal content,
   and inbound path-reference repoints.
6. If the table or the area rule yields no authorized destination, return `NEEDS_CONTEXT`. Never improvise an
   area, type, scope, schema key, or destination.
7. Validate each rendered candidate. One malformed candidate blocks the whole promotion batch.

### P4 — Freeze the complete manifest and preimages

**Stage 1.** No memory mutation. Render and validate the **complete** promotion manifest before the first
durable-memory write (E6). The manifest carries one **source-accounting row** per inventoried source and one
**mutation row** per filesystem path Stage 2 may change.

A source-accounting row records at least: the stable source identity `{session-id, source-relative-path}` +
source hash; the outcome (promote / backlog / drop / already-promoted, with a reason when no write follows);
the resolved type, scope, area, destination path, and section anchor when the destination is a shared
skill-surface file; a user-decision reference for every judgment fork; the correction-overlay path + delta
hash (or `none`); the rendered-candidate path + hash; and the collision / supersession / archive plan.

A mutation row records at least: the operation (create dir, create file, replace file, append section, move
file, or repoint reference); the target path + candidate hash (or move destination); and the target
**preimage** — `absent` when the path does not exist, or the exact content hash + relevant metadata when it
does (both source and destination preimages for a move; the **whole-file** preimage for a shared destination
such as `skills/{skill}/mistakes.md`, not only the intended section).

The preimage set MUST cover **every** path the batch may mutate — feature READMEs, existing records marked for
supersession, archive targets, inbound-reference carriers, and the journal destination. Capturing only the
primary promotion destinations is incomplete. Validate all candidates and the complete manifest together, then
mark the manifest frozen and record its hash. One invalid source, candidate, route, preimage, or mutation row
means **zero durable-memory writes**.

### P5 — Recheck preimages, then apply the frozen manifest

**Stage 2 — Promotion.** The first sub-phase that writes durable memory.

1. Immediately before applying, recompute **every** preimage in the frozen manifest and compare the whole set
   against the frozen values.
2. If any preimage differs, perform **zero writes**: halt with the exact changed path, expected preimage, and
   observed preimage, and return to Stage 1 to rebuild the complete manifest against fresh state (E6).
3. If every preimage matches, apply only the frozen mutation rows, in their recorded stable order — do NOT
   recalculate routes or suffixes during apply. Lazy-bootstrap each destination's parent directory when
   missing (this creates the `{type}/{area}/` area dir as part of the path); stamp the type's template from
   [`memory/templates/`](../memory/templates/) (freeform writes to memory are forbidden); strip staging-only
   frontmatter per the [allowlist](#frontmatter-allowlist-on-promotion). The per-session journal candidate and
   the user-confirmed rule candidate are applied here as their own manifest rows.
4. After each mutation, verify the resulting path against its candidate hash or expected move state. On a tool
   or I/O failure, stop at that exact row and preserve the manifest as recovery evidence — do not continue with
   later rows.
5. For a re-run, use the stable source identity plus the frozen manifest mapping: if the mapped destination
   already equals the candidate bytes, record a **no-op** rather than rewriting identical bytes.

### P6 — Complete supersession and archive moves

**Stage 2 — Promotion.** Apply each authorized supersession as ONE manifest-planned mutation set:

1. Write the new record; flip the old record's reciprocal lifecycle pointer (`supersedes: <new-slug>` /
   `status: superseded` + `superseded_by: <new-slug>` — plain slugs, never paths, per
   [`memory/rules.md § 2.4`](../memory/rules.md#24-cross-references-and-the-doc-graph)); move the terminal old
   record; and repoint every inbound path reference.
2. Preserve plain-slug lifecycle links across a move; repoint path-bearing references to the archive path.
3. Route every terminal move through [Archive typed-subdir routing](#archive-typed-subdir-routing-on-terminal-state-moves).
   Never delete a record.
4. Verify each moved record remains complete and keeps its original memory `type`.
5. Verify every source-accounting row now has its recorded result, and that no unmanifested memory path
   changed.

### P7 — Run the compaction sub-procedure

**Stage 2 — Promotion**, final consolidation sub-step. Run the compaction sub-procedure per the sibling
[`compaction.md`](compaction.md). Its writes land **inside** Stage 2, so the non-skippable Stage-3 gate
validates them. Wrap-up **always counts** every `{type}/{area}` post-promotion; an over-`hardCap` area cannot
silently pass — it routes to an Always-Ask decision. The `settings.compaction.enabled` flag gates automatic
**merging** only; the count and the hard-cap detection are unconditional. The caps and the consolidated-file
standard are owned by [`memory/rules.md § 5`](../memory/rules.md).

### P8 — Draft the handoff summary

**Stage 2 — Promotion.** Author the canonical handoff at `5-wrap-up/outputs/handoff.md` with the required
sections (Summary, Shipped, Deferred / Open, Decisions to respect, Pointers, Promotion summary). Every claim
cites a verifiable artifact path — a commit hash, a promoted file path, a backlog entry. This step authors the
file only; the manager shows it to the session as the final message, and only after the Stage-3 gate returns
`PASS`. The session-scoped `handoff.md` dies with the worktree; its durable counterpart is the per-session
journal entry (a promoted `notes/{area}/{date}-{slug}.md` record) that survives for the next session.

### P9 — Prove the post-promotion tree is green

**Stage 2 — Promotion**, closing verification (independent of `settings.compaction.enabled`).

1. Diff the post-promotion project tree against the P1 pre-Wrap-up snapshot and reconcile **every** changed
   path to a frozen manifest mutation row. Any unmanifested change is a failure.
2. Re-hash the prior-loop staging sources and compare them with the P1 source-evidence register — prior-loop
   staging remains byte-and-path unchanged after both stages (E1; this is the S-16 immutability property).
3. Run the [post-promotion standing-guard green-check](#post-promotion-standing-guard-green-check).
4. If a guard exposes a legitimate new carrier that requires a tracked allowlist change, treat that change as a
   **new planned mutation**: return to Stage 1, capture its preimage, and rebuild the complete manifest (a
   Stage-2 re-run / `REVISE`). Never patch an allowlist outside the manifest and then claim the original
   manifest covered it.
5. Freeze the final inventory, manifest, applied-delta report, and guard results for the independent Stage-3
   evaluation gate.

---

## Prior-loop staging compliance scan

The compliance scan (P2) checks every expected prior-loop staging directory before any memory mutation. It
validates the evidence; it never repairs the evidence in place.

| Gap category | Condition | Stage-1 action |
|---|---|---|
| `zero-staging` | An expected prior loop has a staging directory but no staged files | Return `NEEDS_CONTEXT`: ask whether the empty result is intentional |
| `directory-absent` | An expected staging directory does not exist | Return `NEEDS_CONTEXT`: verify whether the loop or task ran |
| `shape-mismatch` | A finding violates the per-finding `{slug}.md` shape | Correction overlay ONLY when the normalized shape is mechanically determined; otherwise `NEEDS_CONTEXT` |
| `template-mismatch` | Required staging metadata is missing or off its staging vocabulary | Correction overlay ONLY when the value is mechanically derivable from authoritative metadata; otherwise `NEEDS_CONTEXT` |

The 5-value finding-class vocabulary is owned by
[`evaluation/SKILL.md § Type`](../evaluation/SKILL.md#type-5-values) — use the owner rather than copying or
extending it here. Applying it to overlay-vs-escalate:

- A `scenario_gap` / `checklist_gap` / `general` finding may receive a mechanical correction overlay only when
  no semantic choice is involved.
- A `design_flaw` / `assumption_risk` always requires judgment when the missing or malformed data changes its
  meaning — return `NEEDS_CONTEXT`.
- Missing metadata that cannot be derived without interpreting prose is judgment-required, regardless of class.
- Slug allocation for a rendered candidate follows the stable-identity
  [collision policy](#collision-and-idempotency-policy) — never key a repair on a field that is stripped at
  promotion. The staging-side slug policy is owned by
  [`evaluation/SKILL.md § Slug + collision policy`](../evaluation/SKILL.md#slug--collision-policy).

Append each scan result to the manifest draft (source identity, source hash, gap category, finding class,
overlay or escalation result, decision reference). Stage 1 cannot freeze until every expected directory and
source has a recorded result.

---

## Staging → Memory routing

The canonical promotion routing — this table is the contract for **Stage 2 (Promotion)**, applied mechanically
during Stage-1 candidate rendering. The Wrap-up EVALUATION (Stage 3) verifies adherence (see
[`evaluation.md`](evaluation.md)). All destination paths are relative to `.gobbi/projects/{project-name}/`.

| Session staging path or named direct input | Memory destination | Trigger condition |
|---|---|---|
| `sessions/.../{N}-{loop}/staging/scenarios/{slug}.md` | `features/{feature-name}/scenarios/{area}/{slug}.md` | Always |
| `sessions/.../{N}-{loop}/staging/checklists/{slug}.md` | `features/{feature-name}/checklists/{area}/{slug}.md` | Always |
| `sessions/.../{N}-{loop}/staging/decisions/{slug}.md` (no special modifier) | `features/{feature-name}/decisions/{area}/{date}-{slug}.md` | Default |
| `sessions/.../{N}-{loop}/staging/decisions/{slug}.md` with `mistake-candidate: true` | `skills/{skill}/mistakes.md` `## ` section (skill-owned trap) OR the project `mistakes/` tier `mistakes/{area}/{slug}.md` (cross-cutting / no-owner, project-scope) OR `features/{feature-name}/mistakes/{area}/{slug}.md` (cross-cutting, feature-scope) | Return `NEEDS_CONTEXT`; manager confirms skill-owner-vs-project routing (and the primary skill when applicable) through the active runtime's user-decision primitive |
| `sessions/.../{N}-{loop}/staging/decisions/{slug}.md` with `disposition: deferred` | `features/{feature-name}/backlogs/{area}/{slug}.md` (feature-scope) OR `backlogs/{area}/{slug}.md` (project-scope per `project-scope: true`) | Always — deferred findings route to backlogs |
| `sessions/.../{N}-{loop}/staging/references/{slug}.md` | `features/{feature-name}/references/{area}/{slug}.md` | Always |
| `sessions/.../{N}-{loop}/staging/design/{slug}.md` | `features/{feature-name}/design/{area}/{slug}.md` (default) OR `design/{area}/{slug}.md` (project-wide; rare) | If project-wide, return `NEEDS_CONTEXT`; manager confirms through the active runtime's user-decision primitive |
| `sessions/.../{N}-{loop}/staging/discussions/{slug}.md` | `features/{feature-name}/discussions/{area}/{slug}.md` | Always |
| `sessions/.../{N}-{loop}/staging/backlogs/feature/{slug}.md` | `features/{feature-name}/backlogs/{area}/{slug}.md` | Always |
| `sessions/.../{N}-{loop}/staging/backlogs/project/{slug}.md` | `backlogs/{area}/{slug}.md` | Always |
| `sessions/.../{N}-{loop}/staging/reviews/{slug}.md` | `features/{feature-name}/reviews/{area}/{date}-{slug}.md` (default) OR `reviews/{area}/{date}-{slug}.md` (project-wide; cross-feature) | Default feature-scope; if cross-feature / repo-wide, return `NEEDS_CONTEXT`; manager confirms through the active runtime's user-decision primitive |
| `sessions/.../{N}-{loop}/staging/reports/{slug}.md` | `features/{feature-name}/reports/{area}/{date}-{slug}.md` (default) OR `reports/{area}/{date}-{slug}.md` (project-wide; cross-feature) | Default feature-scope; if cross-feature, return `NEEDS_CONTEXT`; manager confirms through the active runtime's user-decision primitive. `{date}` is the session start date |
| `sessions/.../{N}-{loop}/staging/changelogs/{slug}.md` | `features/{feature-name}/changelogs/{area}/{slug}.md` | Always — feature-scope shipped-work changelog entries (Execution-loop typical) |
| `sessions/.../{N}-{loop}/staging/learnings/{slug}.md` | `features/{feature-name}/learnings/{area}/{slug}.md` (default) OR `learnings/{area}/{slug}.md` (project-wide; cross-feature) | Default feature-scope; if cross-feature, return `NEEDS_CONTEXT`; manager confirms through the active runtime's user-decision primitive |
| `sessions/.../{N}-{loop}/staging/notes/{slug}.md` | `notes/{area}/{date}-{slug}.md` | Always — loop-scope journal entry (rare; the per-session journal is Wrap-up's direct candidate below) |
| `sessions/.../3-planning/staging/plans/{slug}.md` | `features/{feature-name}/plans/{area}/{date}-{slug}.md` | Always — Planning-loop output |
| `sessions/.../2-preparation/staging/skills/{slug}/SKILL.md` | `.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` | Normally already-promoted (manifest-only): the manager promotes these before Planning starts; Wrap-up verifies presence and records the row, recovering a missing destination only under the Preparation contract. **`skills/` is NOT by-area** — an authoring surface, not a memory type, so no `{area}/` segment |
| Named direct input — user-confirmed rule candidate surfaced during Wrap-up | `rules/{area}/{slug}.md` (project-wide) OR `features/{feature-name}/rules/{area}/{slug}.md` (feature-specific) | Return `NEEDS_CONTEXT`; manager confirms scope — rules are rare and load-bearing. Render ONE deterministic direct candidate under `5-wrap-up/working/` before manifest freeze |
| Named direct input — per-session development journal candidate | `notes/{area}/{date}-{slug}.md` | Always — exactly one journal record per session, capturing the work-log narrative. Render ONE deterministic direct candidate under `5-wrap-up/working/` before manifest freeze |

Every by-area destination carries the `{area}/` segment between the type dir and the filename — resolved at
promotion by the [area-resolution rule](#area-resolution-on-promotion); `skills/` is the sole non-by-area
destination. Session-staging paths stay flat (no `{area}/`) — the area is resolved only during Stage-1
candidate rendering. For a skill-owned mistake, write ONE trap in exactly one primary skill home; a secondary
skill receives a `### Related` cross-link, never a duplicate trap.

## Area resolution on promotion

The area-selection rule is owned by
[`memory/rules.md § 1.5`](../memory/rules.md#15-area-namespace-the-second-category-axis-under-each-type) — apply
it exactly; do NOT reproduce or locally modify its algorithm here. It is the SAME rule and priority order the
frontmatter validator's allowlist enforces, so the written path and the validator's path-derived check agree by
construction. How the rule is applied at promotion:

- Resolution happens during Stage-1 candidate rendering (P3) — the single place the destination `{area}/`
  segment is resolved. Record the selected area and its selection basis in the manifest.
- The rule is deterministic (priority-ordered first-match) and **not total**: a record may match no area, which
  returns `NEEDS_CONTEXT`, never a silent fallback area. Creating or extending an area is an Always-Ask edit to
  [`memory-vocabulary.json`](../memory/memory-vocabulary.json) — authorized before the manifest freezes, never
  invented to dodge the decision.
- An explicit staging-time `area:` field (within the type's allowlist) wins; `reviews` / `reports` take their
  area from the REQUIRED `review_kind` / `report_type` value (the kind axis), so they never reach the no-match
  case.
- The resolved area is encoded only in the destination path — the staging `area:` field is not durable
  metadata (see below).

## Frontmatter allowlist on promotion

The durable base fields, per-type extension fields, required fields, enums, and the staging-field-stripping
contract are owned by [`memory/rules.md § 2`](../memory/rules.md#2-frontmatter-standard) (strip rule at
[`§ 2.6`](../memory/rules.md#26-staging-field-stripping-on-promotion)). Derive the destination allowlist from
that owner at promotion time; do NOT copy a second field list into this child doc. The local steps Wrap-up
applies while rendering each candidate:

1. Read routing modifiers before stripping them.
2. Render the candidate with ONLY the owner's allowed durable base fields, the destination type's allowed
   extension fields, and any owner-sanctioned global lifecycle links (`supersedes` / `superseded_by` /
   `related`).
3. Strip every staging-only routing or provenance field from the candidate, leaving the immutable source
   unchanged.
4. Preserve every required durable field per the owner — never strip a required base or per-type extension
   merely because it was also useful during staging. **Auto-stamp** the required base fields Wrap-up owns:
   `author` from `session.json.system` (`claude-code` → `claude`, `codex` → `codex`; a human hand-edit sets
   `user`), and `keywords: []` when the staged file carries none (a non-empty staged list is preserved as-is).
5. Validate the complete rendered candidate before manifest freeze.

`finding-id` is a **staging-time hint** only: it may correlate evaluator material while rendering, but it is
stripped from durable memory and MUST NOT authorize overwrite, idempotency, collision reuse, or suffix
allocation.

The memory frontmatter allowlist does NOT apply to the skill-surface `skills/{skill}/mistakes.md` file — for
that destination, append one conforming `## ` trap section under the skill-owned mistake contract and validate
the whole skill-surface file.

## Collision and idempotency policy

Idempotency is keyed on the stable source identity `{session-id, source-relative-path}` plus the frozen
manifest mapping — **never** a stripped destination field. The manifest, not a field on the destination, is the
durable rerun authority for this session, so re-running Wrap-up over the same immutable inventory resolves to
the identical target set. Allocate destinations in normalized source-relative-path order:

| Scenario | Action |
|---|---|
| The stable source identity has a frozen manifest row and the mapped destination equals the rendered candidate | Record a **no-op** — do not rewrite identical bytes |
| The stable source identity has a frozen mapping, the mapped destination is absent, and its captured preimage still matches | Apply the frozen create operation |
| The stable source identity has a frozen mapping but destination bytes differ from BOTH the captured preimage and the rendered candidate | Halt on preimage drift; rebuild the whole manifest — never overwrite |
| A **distinct** source (different `{session-id, source-relative-path}`) collides on the same slug | Treat as distinct even when `finding-id` matches. Disambiguate deterministically: the source loop / task suffix (`{slug}-planning.md` vs `{slug}-execution.md`) when it resolves the collision, then a numeric suffix (`-2`, `-3`) if needed. Freeze the result |
| New content semantically supersedes an existing record | Record the authorized supersession, reciprocal lifecycle updates, archive move, and inbound-reference repoints as ONE planned mutation set (P6) |
| Two sources in the same batch request the same preferred destination | The earlier normalized source-relative path reserves it; deterministically disambiguate the later source and freeze both mappings |

A matching `finding-id` is only a **staging-time hint** that two records may deserve review — it never proves
stable identity, and a differing `finding-id` never controls suffix choice. Do not overwrite a pre-existing
destination merely because its content looks similar: without a frozen mapping for the same stable source
identity, treat it as a distinct collision, an explicit duplicate/drop decision, or an authorized supersession.

## Archive typed-subdir routing on terminal-state moves

The move-on-terminal procedure and archival file form are owned by
[`memory/templates/archive.md`](../memory/templates/archive.md) — run that procedure rather than restating its
terminal-state table or frontmatter schema here. The promotion manifest routes a terminal artifact (incoming
`status: shipped|superseded|retired|dropped`, or a supersession collision) to:

`archive/{original-type}/{resolved-area}/{YYYY-MM-DD}-{slug}.md`

The **typed** subdir comes first, then the source's **resolved area** — the same area segment the §1.5 rule
resolved on the active file, so `archive/{type}/{area}/` mirrors the originating `{type}/{area}/` home. The
moved file keeps its original memory `type` (`archive` is never a `type` value); the directory marks it
archived. Capture preimages for the active source, the archive destination, and every inbound path-reference
carrier before the manifest freezes (P4). A terminal move is incomplete until the full file has moved, its
lifecycle links are reciprocal, and inbound path references resolve. Never hard-delete a record —
[`memory/rules.md § 2.1`](../memory/rules.md).

## Post-promotion standing-guard green-check

This check runs on **EVERY** wrap-up, independent of `settings.compaction.enabled` and of whether any
compaction work occurred. It evaluates the **post-promotion** tree, not the pre-promotion baseline. A promoted
mistake / journal / plan frequently DOCUMENTS the very vocabulary or pattern a guard scans for, so a promotion
can add a legitimate carrier an allowlist derived before the promotion will not recognize — a green frontmatter
validator alone is NOT enough. Run every standing project guard over the post-promotion project tree
(`<scan-root>` = `.gobbi/projects/{project-name}/`; each prunes `archive/`); ALL must exit 0 before the Stage-3
verdict can advance to `PASS`:

- `validate-frontmatter.sh <scan-root>` — frontmatter well-formedness.
- `check-markdown-links.sh <scan-root>` — relative-link resolution.
- `check-residual-vocab.sh <scan-root>` — residual stale-vocabulary content gate.
- `check-skill-mistakes.sh --all` — skill-surface `mistakes.md` conformance (section structure +
  bare-path / `[[slug]]` ref resolution); it validates the skill-owned-mistake sections a promotion writes into
  `skills/{skill}/mistakes.md`, a surface `validate-frontmatter.sh` never sees.
- `check-workflow-mirror-consistency.sh` — runtime-doc `.claude/` mirror gate (self-locating, zero-arg; checks
  the worktree `.claude/` runtime surface, not the memory tree, so it takes no `<scan-root>`).

`check-merge-ref-integrity.sh <manifest> <scan-root>` is the ONE additional guard that runs only when the
compaction sub-procedure produced a merge manifest — it is enumerated in [`compaction.md`](compaction.md), not
here, because a non-compacting wrap-up has no manifest for it to check; it never replaces or conditions the
five always-run guards above. When a guard flags a legitimately-promoted carrier, extend THAT guard's allowlist
using its own derive-from-a-fresh-run discipline, routed as a **new planned mutation** through a fresh complete
manifest with its own preimage (P9 step 4) — so the guard invariant the session established stays green on the
branch that ships, and the allowlist change is never patched outside the manifest.

## Non-standard session-subdir cleanup (going-forward)

Wrap-up enforces the canonical session-tree shape going forward (see [`orchestration/SKILL.md`](../orchestration/SKILL.md)
for the canonical tree). When Wrap-up touches the active session's loop directories, these non-canonical
subdirs are normalized. **The behavior is UNCHANGED by this redesign** — it is **going-forward + opportunistic
only** (Wrap-up normalizes the shape of the session it is closing, and fixes a reopened closed session
opportunistically; it never mounts a retro-sweep across all closed sessions), and it does not reopen the frozen
Stage-1 promotion manifest.

- **No `followups/` dir.** A `{N}-{loop}/evaluation/followups/` directory is non-canonical — follow-ups are
  findings. Route each to `staging/decisions/` (deferred) or `staging/backlogs/`; do not keep an ad-hoc
  `followups/` dir.
- **Fold `restore/` into `working/`.** A `{N}-{loop}/working/restore/` sub-scratch tier is not sanctioned; any
  resume / restore scratch lives directly in `{N}-{loop}/working/`, keeping its descriptive filenames.
- **Remove `tmp/`.** No `tmp/` scratch tier exists in the canonical tree — `{N}-{loop}/working/` is the only
  scratch surface. A session `tmp/` dir is removed only after confirming it holds scratch and no staging,
  durable candidate, decision evidence, or unaccounted source.

Legacy root `state.json` and root `HANDOFF.md` files in closed sessions remain untouched.

---

## Working artifacts and exit criteria

Stage 1 writes these session-scoped planning artifacts (all under `sessions/{date}-{session-id}/5-wrap-up/`):

| Path | Purpose |
|---|---|
| `working/pre-wrap-up-snapshot.txt` | Baseline project-memory state (filesystem + hashes) the Stage-3 gate diffs against |
| `working/staging-inventory.md` | Complete permitted-source inventory with stable identities + hashes |
| `working/correction-overlays/` | Mechanical normalization deltas (E1); prior-loop sources are never rewritten |
| `working/promotion-manifest.md` | Frozen source-accounting rows, mutation rows, collision decisions, and destination preimages |
| `outputs/handoff.md` | Session-scoped handoff (authored at P8; sealed at RECORD) |

The promotion pass is complete only when:

- Every expected source is inventoried and has one explicit outcome.
- Every mechanical normalization exists only as a correction overlay + promoted candidate; prior-loop staging
  sources remain immutable (verified by the P9 re-hash against the P1 register).
- The complete manifest and every candidate validated before the first durable-memory write.
- Every destination preimage was captured and the complete preimage set was rechecked immediately before apply.
- Every applied path matches a frozen mutation row, and every rerun decision uses
  `{session-id, source-relative-path}` plus the frozen manifest.
- Every archive move uses the typed-subdir route and preserves the complete record.
- The post-promotion tree reconciles to the manifest, and the always-run standing guards all exit 0.
- The inventory, frozen manifest, applied delta, and guard evidence are ready for the independent Stage-3
  evaluation gate.
