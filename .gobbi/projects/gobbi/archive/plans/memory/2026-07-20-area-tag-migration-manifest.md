---
name: area-tag-migration-manifest
description: Row-level migration manifest for moving all 114 flat memory files into area namespaces; the execution spec the deferred-move session consumes.
type: plans
scope: feature
feature: memory
status: completed
created: 2026-06-23
session: d0185dba-cd9b-45ad-93f6-7814c4f0ef4a
tags: [memory, refactor, rename-sweep, docs-sync, verification]
keywords: [area-namespace-migration, file-move-manifest, ref-repoint, layer2-source, deferred-move]
author: claude
supersedes: null
superseded_by: null
task: area+tag de-hardcoding — T07 migration manifest (114-file move plan)
task_count: 8
archived_at: 2026-07-20
archive_reason: completed
---

# Area + tag migration manifest — move all flat memory files into area namespaces

## Idea anchor

Implements [`features/memory/design/memory/memory-namespace-schema.md`](../../design/memory/memory-namespace-schema.md) (the #307 area-namespace schema, Option A — schema + conventions; this manifest is the deferred migration's execution spec). The area allowlists + the tag→area map are now project-owned data in [`memory-vocabulary.json`](../../../../skills/memory/memory-vocabulary.json) (shipped this session, commits `4557c78c` + `ed435550`).

> **RE-DERIVED 2026-06-24 (per-type vocab redesign, session `84e9570c`).** The resolution MODEL below
> was re-derived against the FLAT per-type `memory-vocabulary.json` (L1–L18 of
> `1-ideation/outputs/per-type-vocab-design.md`). The retired 2-table (`spine` / `mistakes`) keying is
> replaced by per-type `.tagAreaMap.{type}`; the `_shared` catch-all is removed (L13); area no-match is
> now a user-decision (L14), not a `_shared` landing. The historical narrative below (which mentions the
> old `_shared` model as past context) is preserved deliberately — it is the record of the prior design,
> not a live instruction. See [§ Re-derived resolution model (2026-06-24)](#re-derived-resolution-model-2026-06-24).

## Scope Contract reference

This is the **plan-only** output of Execution task T07 (session `d0185dba-cd9b-45ad-93f6-7814c4f0ef4a`), re-derived in session `84e9570c`. It does NOT move any file. The bulk move is the deferred backlog [`backlogs/memory/memory-namespace-migration.md`](../../../../backlogs/memory/memory-namespace-migration.md); this manifest is its row-level execution spec. The deferred-move session consumes this doc, performs the `git mv`s + ref repoints, and runs the guards.

> **PLAN ONLY.** No file is moved by this artifact. No skill/doc/memory edit. The resolution below was
> scripted against each file's actual frontmatter + `memory-vocabulary.json` — not hand-guessed. The
> 2026-06-24 re-derivation updates the resolution MODEL and the category-level distribution; the
> authoritative per-file recompute of all 114 rows is the deferred migration's step 1 (see the appendix
> note), because it requires reading each file's live frontmatter under the new per-type pools.

## Re-derived resolution model (2026-06-24)

The resolution model changed with the per-type vocab redesign. The new model:

1. **Per-type map, not 2-table.** Area resolution now uses the per-type `.tagAreaMap.{type}` (one
   priority-ordered map per by-area type) — NOT the retired `.tagAreaMap.spine` /
   `.tagAreaMap.mistakes` 2-table. The selection rule is otherwise unchanged: explicit `area:` field
   (none present in the corpus) > priority-ordered first-match in `.tagAreaMap.{type}` (controlled pool
   tags only; `featureDirNormalization` applied first) > **no-match terminal**.

2. **No `_shared` landings — the terminal is a user-decision (L13/L14).** `_shared` is dropped from
   every type's area list. A record whose controlled tags route to no area no longer falls to `_shared`;
   it is **flagged-for-user-decision** (the write/move agent emits `NEEDS_CONTEXT`; the manager asks the
   user to pick an existing area or create one as an Always-Ask edit). The prior 17 `_shared` records
   re-resolve: MOST route to a real area via the accepted generic-tag routing (design §4a/L12 —
   `design`→`memory`, `hooks`→`codex`, `security`/`refactor`/`rename-sweep`/`vocabulary-sweep`/
   `verification`/`validation`/`docs-sync`→`process`, etc.); the genuine remainder is flagged.

3. **reviews / reports resolve to KIND areas (L5/L6/L16).** `review_kind` (reviews) and `report_type`
   (reports) are now REQUIRED extension fields; the area resolves DIRECTLY from the kind value, not from
   tags. There is no `.tagAreaMap` entry for these two types. The 1 report file
   (`reports/2026-06-16-retro-sweep.md`, `report_type: status`) therefore resolves to the KIND area
   `reports/status/` — NOT the old tag-derived `reports/git/`.

4. **Routing is on controlled pool tags only.** The new per-type model rejects off-vocabulary tags
   (they live in `keywords`, not `tags`). Many legacy records carry off-vocab tags (e.g. `probe`,
   `scope`, `directory-structure`, `mistake-discipline`). Those off-vocab tags do NOT participate in
   routing under the new model; only a record's controlled pool tags do. The legacy off-vocab `tags`
   are a SEPARATE data-fix tracked by [`backlogs/memory/legacy-frontmatter-migration.md`](../../../../backlogs/memory/legacy-frontmatter-migration.md);
   the deferred migration's authoritative per-file recompute (step 1) applies the legacy-tag fix first,
   then resolves the area — so a record flagged-for-user-decision here may home cleanly once its tags
   are corrected.

5. **archive unchanged (L9).** Archived files mirror the source type's resolved area; the find-prune
   already excludes `archive/`. No `_shared` involved.

### Formerly-`_shared` re-resolution (the 17 records, model re-derivation)

Re-derived against the new per-type `.tagAreaMap.{type}` using each record's CONTROLLED pool tags
(priority first-match). 11 of 17 route to a real area; 6 are genuine no-match → flagged-for-user-decision.

| # | Formerly-`_shared` record | Type | New resolution | Basis (controlled tag → area) |
|---|---|---|---|---|
| 1 | `mistakes/staging-a-mistake-candidate-does-not-fix-the-artifact.md` | mistakes | **FLAG-FOR-USER** | only controlled tag `process` is an intentional no-match for mistakes (a trap-class is required; a "where" tag must not auto-route) |
| 2 | `features/git-workflow/decisions/probe-data-source-reliability.md` | decisions | **FLAG-FOR-USER** | no controlled pool tag (all off-vocab); legacy-tag fix needed first |
| 3 | `features/git-workflow/discussions/2026-06-14-post-research-design-decisions.md` | discussions | `codex` | `hooks` → codex |
| 4 | `features/git-workflow/checklists/remediation-must-be-ask-only.md` | checklists | `process` | `security` → process |
| 5 | `features/workflow/decisions/2026-06-08-gap1-verify-session-tree-check.md` | decisions | **FLAG-FOR-USER** | no controlled pool tag (all off-vocab); legacy-tag fix needed first |
| 6 | `features/workflow/decisions/2026-06-08-script-hook-layer-verify-no-change.md` | decisions | `codex` | `hooks` → codex |
| 7 | `features/workflow/decisions/2026-06-13-vocabulary-rename-blast-radius.md` | decisions | `process` | `vocabulary-sweep` → process |
| 8 | `features/workflow/design/claude-md-agents-md-6step-reconcile.md` | design | `memory` | `design` → memory |
| 9 | `features/workflow/design/sweep-manifest-command-derived.md` | design | `memory` | `design` → memory (priority over `vocabulary-sweep`→process / `verification`→process) |
| 10 | `features/workflow/references/agent-trace-tree-scaffolding.md` | references | **FLAG-FOR-USER** | no controlled pool tag (all off-vocab); legacy-tag fix needed first |
| 11 | `features/workflow/references/build-tool-deterministic-output.md` | references | **FLAG-FOR-USER** | no controlled pool tag (all off-vocab); legacy-tag fix needed first |
| 12 | `features/workflow/references/git-layout-mutability-split.md` | references | **FLAG-FOR-USER** | no controlled pool tag (all off-vocab); legacy-tag fix needed first |
| 13 | `features/workflow/discussions/2026-06-13-scope-lock-d12-workflow-feature.md` | discussions | `memory` | `design` → memory |
| 14 | `features/workflow/discussions/2026-06-13-two-skill-hybrid-d10.md` | discussions | `memory` | `design` → memory |
| 15 | `features/workflow/discussions/2026-06-13-vocabulary-d5-d6-d7-lock.md` | discussions | `memory` | `design` → memory |
| 16 | `features/workflow/scenarios/workflow-memorization-doc-rename-scope.md` | scenarios | `process` | `vocabulary-sweep` → process |
| 17 | `features/workflow/checklists/sweep-executor-verification-steps.md` | checklists | `process` | `vocabulary-sweep` → process (priority over `verification`→process; same area) |

Re-route summary: `memory` +5 · `process` +4 · `codex` +2 · **flagged-for-user-decision +6**. Zero
`_shared`.

> The 6 flagged-for-user records all lack a routing-eligible controlled tag under the new model. Five of
> them carry only off-vocabulary tags (rows 2/5/10/11/12) and will likely home cleanly after the
> `legacy-frontmatter-migration` tag fix; row 1 is the structural no-match (a process-only mistake with
> no trap-class). The deferred migration's step 1 (authoritative per-file recompute) re-checks all six
> after the legacy-tag fix and routes whatever still has no area through the L14 user-decision.

## Live count reconciliation (count authority = a fresh `find`)

A fresh filesystem enumeration of every flat by-area file (a `.md` whose immediate parent dir is a by-area type, no `{area}/` segment, excluding `archive/ sessions/ skills/ agents/ tmp/ worktrees/` and `README.md`):

| Tier | Count |
|---|---|
| Project tier | 34 |
| Feature tier | 80 |
| **Total** | **114** |

This matches the briefed expectation (34 / 80 / 114).

**Validator-vs-filesystem discrepancy (resolved).** The validator's `missing required area segment` reports number **110**, not 114. The 4-file gap is the four type-mismatch files below: they live physically under `mistakes/` but declare `type: decisions`, so the validator emits a *different* area message (`by-area type 'decisions' but no 'decisions/' dir in path`) that a `missing required area segment` grep does not catch. The filesystem count (114) is the authority; all 4 are in the manifest, flagged NEEDS-DECISION.

## Resolved-area distribution (all 114) — re-derived 2026-06-24 (ZERO `_shared`)

Under the new per-type model. The `_shared` row is GONE; its 17 records re-route per the table above,
and a new **`flagged-for-user-decision`** category holds the genuine no-match remainder.

| Area | Files | Delta vs prior (`_shared` model) |
|---|---|---|
| `memory` | 25 | +5 (formerly-`_shared` design/discussions records via `design`→memory) |
| `git` | 23 | −1 (the 1 report leaves `git` for its `reports/status/` kind area) |
| `workflow` | 19 | — |
| `wrap-up` | 13 | — |
| `codex` | 8 | +2 (formerly-`_shared` records via `hooks`→codex) |
| `evaluation` | 7 | — |
| **`flagged-for-user-decision`** | **6** | **NEW — replaces the silent `_shared` catch-all (L13/L14)** |
| `process` | 5 | +4 (formerly-`_shared` records via generic-tag routing) |
| `verification` | 3 | — |
| `refactor` | 2 | — |
| `docs-sync` | 1 | — |
| `reports/status` (kind) | 1 | +1 (the 1 report; kind-resolved from REQUIRED `report_type: status`, L16) |
| `tooling` | 1 | — |
| **Total** | **114** | |

> **`flagged-for-user-decision` replaces `_shared`.** The prior model showed `_shared = 17` "legitimate
> no-tag-match fallbacks." Under L13/L14 there is no `_shared`: 11 of those 17 now route to a real area
> via L12 generic-tag routing, and the remaining 6 are flagged for a per-file user area-decision in the
> deferred migration — NEVER auto-`_shared`. Resolution method: §1.5 selection rule applied per file —
> explicit `area:` field (none present) > priority-ordered per-type `.tagAreaMap.{type}` from
> `memory-vocabulary.json` (`featureDirNormalization` applied first) > flagged-for-user-decision (L14).
> reviews/reports resolve from their REQUIRED kind value (L16), not from tags.

## NEEDS-DECISION items (do not move blindly)

### 1. Four type-mismatch files (physical `mistakes/`, declared `type: decisions`)

These four files sit in `mistakes/` but carry `type: decisions` (a legacy frontmatter error tracked by `legacy-frontmatter-migration`). The destination column resolves to `decisions/{area}/` using the **declared** type — which would cement the wrong type. The deferred-move session MUST decide per file: **(A)** fix the type to `mistakes` first, then move into `mistakes/{area}/`; or **(B)** accept `decisions` and move to `decisions/{area}/`. Recommended: **(A)** — three of them are live `layer2-source:` targets whose layer-2 skill copies treat them as mistakes, and their content is mistake-shaped.

| File | Declared type | If (A) mistakes-area | If (B) decisions-area |
|---|---|---|---|
| `mistakes/codex-wrapper-file-persistence-failure.md` | decisions | `mistakes/{area}/` (re-resolve under mistakes map) | `decisions/evaluation/` |
| `mistakes/file-move-needs-link-resolution-check.md` | decisions | `mistakes/{area}/` | `decisions/memory/` |
| `mistakes/plan-rename-must-enumerate-all-ref-classes.md` | decisions | `mistakes/{area}/` | `decisions/workflow/` |
| `mistakes/planning-asserted-skill-without-verifying.md` | decisions | `mistakes/{area}/` | `decisions/workflow/` |

The mistakes-area re-resolution (option A) must be re-run under the **mistakes** tag→area map (these files' current tags include off-vocab values like `rename`, `required-skills`, `assistant-wrapper` that also need the legacy-tag fix). Decide the type FIRST, then resolve the area. (Note: under the new per-type model these off-vocab tags do not route; the `legacy-frontmatter-migration` tag fix precedes the area resolution — see the re-derived model item 4.)

### 2. Two cross-tier slug collisions (informational — not a blocker)

Two slugs appear once in the project tier and once in the feature tier (different destination paths, different tiers — the move itself is fine; flagged so the deferred session does not mistake them for a single file):

- `2026-06-08-session-memory-redesign` — `notes/{area}/` (project) AND `features/workflow/plans/{area}/` (feature)
- `2026-06-14-dual-runtime-git-skill` — `notes/{area}/` (project) AND `features/git-workflow/plans/{area}/` (feature)

## Inbound reference-class enumeration (repoint before/with the move)

A move changes a file's PATH; every inbound PATH reference must be repointed. Enumerate ALL classes up front (`plan-rename-must-enumerate-all-ref-classes`, `label-rename-missed-in-fence-and-cross-doc`, `namespace-sweep-needs-write-vs-ref-enumeration-not-pattern-grep`):

| # | Ref class | Status in the current tree | Action for the deferred move |
|---|---|---|---|
| 1 | Path refs (markdown link targets, relative paths) | ~6 inbound markdown path-links to flat files in durable surfaces (`skills/ features/ rules/ design/ notes/ mistakes/ backlogs/ references/`) | repoint each to the new `{type}/{area}/{slug}` path; grep BOTH old-flat and new-area forms |
| 2 | Prose mentions (area / path named in running text) | present in the design doc, backlog, and several skill docs | repoint named paths; leave generic concept words |
| 3 | Skill-name refs (`required-skills`, Load Directives, `Skill()` arrays) | none point at moving memory files (these name skills, not memory records) | re-scan; expected zero |
| 4 | Inventory / list refs (manifests, capability lists) | none enumerated for these files | re-scan |
| 5 | Wrapper-description refs (agent prompt blocks) | none | re-scan |
| 6 | Pipeline-label refs (hook scripts, sub-phase labels, comments) | none for memory records | re-scan |
| 7 | In-fence example paths (paths inside ```` ```markdown ```` blocks) | the design doc + rules.md carry example paths | repoint example paths that name a moving file's flat path |
| 8 | Cross-doc mentions | covered by classes 1-2 | — |
| 9 | `required-mistakes:` PATH refs (frontmatter field) | **ZERO populated `required-mistakes:` fields exist** — the term appears ONLY as prose explaining the concept (`skills/mistake/SKILL.md`, `rules.md`, `archive.md`, design doc, backlog). No actual field repoint is needed today | re-scan at move time (a new populated field could appear); repoint any that exist |
| 10 | `layer2-source:` PATH refs (frontmatter field) | the three named guards (`check-markdown-links.sh`, `check-residual-vocab.sh`, validator) MISS this YAML field — verified | repoint every `layer2-source:` whose target moves; run the NEW dedicated check (below) |

### `layer2-source:` targets — confirmed

The brief's three confirmed flat mistakes that ARE live `layer2-source:` targets and WILL move:

| `layer2-source:` target (moves) | layer-2 skill file holding the ref |
|---|---|
| `mistakes/planning-asserted-skill-without-verifying.md` | `skills/mistake/layer2-planning-asserted-skill-without-verifying.md` |
| `mistakes/file-move-needs-link-resolution-check.md` | `skills/mistake/layer2-file-move-needs-link-resolution-check.md` |
| `mistakes/sweep-grep-literal-loop-name-blindspot.md` | `skills/mistake/layer2-sweep-grep-form-specific-blindspot.md` |

> NOTE — the first two are also in the type-mismatch set (NEEDS-DECISION #1). Resolve type first; the `layer2-source:` repoint then targets the final path.

**Additional `layer2-source:` finding — ALREADY-DANGLING refs (pre-existing, not move-caused).** The scan found four more `layer2-source:` PATH refs that point at flat `mistakes/` paths that **do not exist** on disk (the source files were never created or already removed). These are already broken and are NOT caused by this migration; the deferred session should fix or drop them as part of the dedicated `layer2-source:` resolution check:

- `skills/mistake/layer2-cotouch-enumeration-must-cover-semantic-equivalents.md` → `mistakes/cotouch-enumeration-must-cover-semantic-equivalents.md` (missing)
- `skills/mistake/layer2-planning-leader-asserted-file-type-without-verifying.md` → `mistakes/planning-leader-asserted-file-type-without-verifying.md` (missing)
- `skills/mistake/layer2-asserted-git-drift-direction-without-running-git.md` → `mistakes/asserted-git-drift-direction-without-running-git.md` + `mistakes/carried-stale-anchor-despite-upstream-correction.md` (both missing)

## Guard strategy (run all to PASS before declaring the move done)

| Guard | How to run | "Pass" means |
|---|---|---|
| `check-markdown-links.sh` | `bash skills/orchestration/scripts/check-markdown-links.sh <changed docs>` (or whole tree) | zero NEW broken links vs the pre-move baseline. KNOWN pre-existing broken links (`diataxis.fr` external typo in `rules.md`; the `design-literal-retire-instruction-without-replacement` link) are NOT regressions |
| `check-residual-vocab.sh` | `bash skills/orchestration/scripts/check-residual-vocab.sh` | zero residual OLD flat-path references to any moved file. NOTE: this guard's `VOCAB` pattern does NOT cover the redesign forms (`_shared`, `.effective.*`, `.tagAreaMap.spine\|mistakes`) — the OF-1 backlog tracks extending it; until then the move sweep also needs explicit per-form `grep -c` |
| **NEW** `layer2-source:` resolution check | a dedicated scan: for every `layer2-source:` PATH field across `skills/` (and the tree), assert the target path EXISTS on disk. The three existing guards do NOT inspect this YAML field (verified) | every `layer2-source:` target resolves to an existing file (zero dangling) |
| `validate-frontmatter.sh` | `bash skills/memory/scripts/validate-frontmatter.sh` | see the expected-vs-regression criterion below |

**Active-mistake-move carve-out applies.** `rules.md` §1.5 + `skills/mistake/SKILL.md` state "active mistakes never move" for NORMAL operation, but the USER-APPROVED (2026-06-21) namespace-refactor carve-out sanctions moving active mistakes between areas, BECAUSE the move (a) preserves each mistake's slug identity (`name`, body `[[slug]]`, `supersedes`/`superseded_by`/`related` plain slugs — rename-robust), (b) is procedured to repoint every inbound `required-mistakes:` + `layer2-source:` PATH ref, and (c) runs all guards to zero.

## Expected-vs-regression validator criterion

Pre-move baseline: **685 violations / 133 files** (area-flat 114, tags 280) — the documented legacy expected-RED, tracked by `backlogs/legacy-frontmatter-migration.md`.

> **Baseline note (re-derived 2026-06-24).** Under the new per-type vocab the `_shared/` dirs are no
> longer a listed area, so any residual `_shared/` path now FAILS the area check (fail-closed, L15) —
> the same direction as before (area-flat is RED until migrated), so the baseline classification holds.
> The 17 `_shared` rows are NOT pre-created on disk; they re-resolve at move time per the model above.

| Outcome | Classification |
|---|---|
| Each moved file clears its `area` violation (`missing required area segment` / `no '{type}/' dir`) | EXPECTED IMPROVEMENT — the area-flat violation count should drop toward ~0 for migrated files |
| The ~280 legacy `tags` violations (off-vocab tags on records) remain | EXPECTED RED — out of THIS migration's scope; tracked by `legacy-frontmatter-migration` (the tag fix is a separate data-fix; it ALSO unblocks the 6 flagged-for-user records — see the model item 4) |
| The 4 type-mismatch files' OTHER violations (status enum, stray `decision_status`, missing `keywords`/`author`) remain unless option (A) also fixes them | EXPECTED RED unless the type-fix is bundled — note in the move PR |
| Any NEW area or tag violation appears | **REGRESSION** — fail |
| Any inbound path ref, `required-mistakes:`, or `layer2-source:` left dangling | **REGRESSION** — fail (caught by the guards) |

**Pass = zero regressions AND the area-flat violation count drops to ~0 for the migrated files** (residual area-RED only for files intentionally left, e.g. a type-mismatch deferred to option B, or a file held pending its flagged-for-user area-decision).

## Write-safety reminder for the deferred-move session

- **Moves: `git mv`** (preserves history; never `rm`+create).
- **Edits (ref repoints): Bash heredoc / `perl -i` / `python3`**, then VERIFY on disk with `git diff` / `cat`. Do NOT trust the `Edit`/`Write` tool on a worktree path — it can silently no-op (`edit-tool-silent-write-failure-on-worktree`).
- **Absolute paths** on every write; re-`cd` the worktree each turn (cwd resets between calls); use `git -C <worktree-abs>` for all git ops.
- **Enumerate by distinction, grep every form.** Classify each path occurrence as write-destination vs reference; grep placeholder / literal-`.md` / date-prefixed / full-repo-relative forms — not one pattern (`namespace-sweep-needs-write-vs-ref-enumeration-not-pattern-grep`, `sweep-grep-literal-loop-name-blindspot`).

## Sub-tasks

| # | Sub-task | Depends on | Verification | Owner type |
|---|---|---|---|---|
| 1 | Authoritative per-file recompute of all 114 rows under the new per-type vocab (apply the `legacy-frontmatter-migration` tag fix first, then resolve area via `.tagAreaMap.{type}`); resolve the 4 type-mismatch files' type (option A/B) + route the 6 flagged-for-user records with the user | — | every row has a real area OR a recorded user area-decision; zero `_shared` | manager + executor |
| 2 | `git mv` the 80 feature-tier files into `features/{f}/{type}/{area}/` per the recomputed row tables | #1 | `find` shows zero flat feature-tier by-area files | executor |
| 3 | `git mv` the 34 project-tier files into `{type}/{area}/` per the recomputed row tables | #1 | `find` shows zero flat project-tier by-area files | executor |
| 4 | Repoint all inbound path / prose / in-fence refs (classes 1-8) | #2,#3 | `check-markdown-links.sh` + explicit per-form `grep -c` zero | executor |
| 5 | Repoint the 3 moving `layer2-source:` refs; fix/drop the 4 dangling ones | #2,#3 | NEW layer2-source check: zero dangling | executor |
| 6 | Re-scan + repoint any populated `required-mistakes:` field (expected zero) | #2,#3 | grep zero stale `required-mistakes:` paths | executor |
| 7 | Run `validate-frontmatter.sh`; confirm area-flat drops to ~0, no new violations | #4,#5,#6 | before/after counts vs the 685/133 baseline | executor |
| 8 | Open the move PR; note expected-RED (legacy tags) vs regressions | #7 | all guards green; PR body states the criterion | manager |

## Dependency graph

`#1 (per-file recompute + type/flag decisions)` gates the two move waves `#2 (feature)` + `#3 (project)`. Ref-repoints `#4/#5/#6` depend on the moves. `#7 (validate)` is the gate; `#8 (PR)` closes. Waves #2 and #3 are independent and may run in parallel.

## Verification strategy summary

The move is done when: (a) a fresh `find` shows zero flat by-area files (modulo any option-B type-mismatch deferral or a file held pending its flagged-for-user area-decision); (b) all four guards pass (`check-markdown-links.sh`, `check-residual-vocab.sh` + explicit per-form greps, the NEW `layer2-source:` check, `validate-frontmatter.sh`); (c) the validator's area-flat violation count drops to ~0 for migrated files with NO new area/tag violations; (d) the only remaining RED is the documented legacy-tag expected-RED tracked by `legacy-frontmatter-migration`; (e) ZERO `_shared` landings — every record has a real area or a recorded user area-decision.

## Open issues

- The 4 type-mismatch files (NEEDS-DECISION #1) need a user/manager type ruling before their rows are final.
- The 6 flagged-for-user-decision records (re-derived model) need a per-file user area-decision (L14) — most are expected to home cleanly after the `legacy-frontmatter-migration` tag fix; only `mistakes/staging-a-mistake-candidate-does-not-fix-the-artifact.md` is a structural no-match (process-only mistake, no trap-class).
- Tighter homing for a flagged record (beyond what the legacy-tag fix achieves) would require either correcting the record's tags or extending the per-type `.tagAreaMap.{type}` / area list in `memory-vocabulary.json` (an Always-Ask edit, like extending §1.5/§2.5) — a deliberate vocabulary change, out of this manifest's scope.

## Related

- [[memory-namespace-schema]] — the design this migration implements
- [[memory-namespace-migration]] — the parent deferred backlog this manifest is the execution spec for
- [[legacy-frontmatter-migration]] — the legacy-tag expected-RED tracker (separate data-fix; also unblocks the 6 flagged-for-user records)
- [[no-match-user-decision-supersedes-shared-resolution]] — the decision (L13/L14) that removed `_shared` and made no-match a user-decision; superseded the prior `_shared`-resolution expectation
- [[plan-rename-must-enumerate-all-ref-classes]] — the reference-class enumeration discipline
- [[namespace-sweep-needs-write-vs-ref-enumeration-not-pattern-grep]] — grep-every-form, classify-every-hit

## Appendix — row-level manifest (all 114 files)

> **APPENDIX STATUS (2026-06-24 re-derivation).** The per-file row tables BELOW are the ORIGINAL
> `_shared`-model resolution, PRESERVED as historical context (they record the prior design's per-file
> output). They are NOT the live target: the `_shared` destination column in these rows is SUPERSEDED by
> the re-derived model above (§ Re-derived resolution model + the formerly-`_shared` re-resolution
> table). **The authoritative per-file recompute of all 114 rows under the new per-type vocab is the
> deferred migration's step 1** (sub-task #1) — it requires reading each file's live frontmatter after
> the `legacy-frontmatter-migration` tag fix. Read the rows below for the non-`_shared` destinations
> (unchanged in area, only the resolution MECHANISM moved from the 2-table to per-type
> `.tagAreaMap.{type}`); for any row whose old destination was a `_shared/` path, use the re-resolution
> table above instead.

## Project-tier manifest (34 files)

### Project · `mistakes/` — 16 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `mistakes/absolute-path-typo-on-write-evades-cwd-guard.md` | mistakes | `tooling` | `mistakes/tooling/absolute-path-typo-on-write-evades-cwd-guard.md` | tag 'write-safety' -> tooling | — |
| 2 | `mistakes/codex-exec-prompt-via-background-heredoc-hangs.md` | mistakes | `codex` | `mistakes/codex/codex-exec-prompt-via-background-heredoc-hangs.md` | tag 'codex' -> codex | — |
| 3 | `mistakes/codex-side-assistant-faked-eval-on-codex-timeout.md` | mistakes | `codex` | `mistakes/codex/codex-side-assistant-faked-eval-on-codex-timeout.md` | tag 'codex' -> codex | — |
| 4 | `mistakes/codex-wrapper-file-persistence-failure.md` | decisions | `evaluation` | `decisions/evaluation/codex-wrapper-file-persistence-failure.md` | tag 'evaluation' -> evaluation | TYPE-MISMATCH (physical `mistakes/`, declared `decisions`) — NEEDS-DECISION |
| 5 | `mistakes/core-principle-framed-as-action-not-documentation.md` | mistakes | `docs-sync` | `mistakes/docs-sync/core-principle-framed-as-action-not-documentation.md` | tag 'docs-sync' -> docs-sync | — |
| 6 | `mistakes/edit-write-tool-success-without-disk-persistence.md` | mistakes | `verification` | `mistakes/verification/edit-write-tool-success-without-disk-persistence.md` | tag 'verification' -> verification | — |
| 7 | `mistakes/executor-git-stash-in-worktree-during-verify.md` | mistakes | `verification` | `mistakes/verification/executor-git-stash-in-worktree-during-verify.md` | tag 'verification' -> verification | — |
| 8 | `mistakes/executor-wrote-to-main-tree-not-worktree.md` | mistakes | `git` | `mistakes/git/executor-wrote-to-main-tree-not-worktree.md` | tag 'git' -> git | — |
| 9 | `mistakes/file-move-needs-link-resolution-check.md` | decisions | `memory` | `decisions/memory/file-move-needs-link-resolution-check.md` | tag 'links' -> memory | TYPE-MISMATCH (physical `mistakes/`, declared `decisions`) — NEEDS-DECISION |
| 10 | `mistakes/grep-absence-claim-needs-exact-pattern.md` | mistakes | `verification` | `mistakes/verification/grep-absence-claim-needs-exact-pattern.md` | tag 'verification' -> verification | — |
| 11 | `mistakes/label-rename-missed-in-fence-and-cross-doc.md` | mistakes | `refactor` | `mistakes/refactor/label-rename-missed-in-fence-and-cross-doc.md` | tag 'rename-sweep' -> refactor | — |
| 12 | `mistakes/pkill-f-pattern-matches-own-shell.md` | mistakes | `codex` | `mistakes/codex/pkill-f-pattern-matches-own-shell.md` | tag 'codex' -> codex | — |
| 13 | `mistakes/plan-rename-must-enumerate-all-ref-classes.md` | decisions | `workflow` | `decisions/workflow/plan-rename-must-enumerate-all-ref-classes.md` | tag 'planning' -> workflow | TYPE-MISMATCH (physical `mistakes/`, declared `decisions`) — NEEDS-DECISION |
| 14 | `mistakes/planning-asserted-skill-without-verifying.md` | decisions | `workflow` | `decisions/workflow/planning-asserted-skill-without-verifying.md` | tag 'planning' -> workflow | TYPE-MISMATCH (physical `mistakes/`, declared `decisions`) — NEEDS-DECISION |
| 15 | `mistakes/staging-a-mistake-candidate-does-not-fix-the-artifact.md` | mistakes | **FLAG-FOR-USER** (was `_shared`) | (held pending L14 user area-decision) | controlled tag `process` is intentional-no-match for mistakes | RE-DERIVED — flagged-for-user-decision (no `_shared`) |
| 16 | `mistakes/sweep-grep-literal-loop-name-blindspot.md` | mistakes | `refactor` | `mistakes/refactor/sweep-grep-literal-loop-name-blindspot.md` | tag 'rename-sweep' -> refactor | — |

### Project · `backlogs/` — 11 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `backlogs/entry-doc-evaluation-block-omits-prep-wrapup.md` | backlogs | `wrap-up` | `backlogs/wrap-up/entry-doc-evaluation-block-omits-prep-wrapup.md` | tag 'wrap-up' -> wrap-up | — |
| 2 | `backlogs/feature-md-mark-skeleton-exception.md` | backlogs | `evaluation` | `backlogs/evaluation/feature-md-mark-skeleton-exception.md` | tag 'evaluation' -> evaluation | — |
| 3 | `backlogs/layer2-skill-promotions-pending.md` | backlogs | `evaluation` | `backlogs/evaluation/layer2-skill-promotions-pending.md` | tag 'evaluation' -> evaluation | — |
| 4 | `backlogs/legacy-frontmatter-migration.md` | backlogs | `memory` | `backlogs/memory/legacy-frontmatter-migration.md` | tag 'memory' -> memory | — |
| 5 | `backlogs/persist-session-memory-past-cleanup.md` | backlogs | `workflow` | `backlogs/workflow/persist-session-memory-past-cleanup.md` | tag 'workflow' -> workflow | — |
| 6 | `backlogs/preexisting-broken-markdown-links.md` | backlogs | `memory` | `backlogs/memory/preexisting-broken-markdown-links.md` | tag 'docs-sync' -> memory | — |
| 7 | `backlogs/reconcile-task-frontmatter-rules-vs-plans-template.md` | backlogs | `memory` | `backlogs/memory/reconcile-task-frontmatter-rules-vs-plans-template.md` | tag 'memory' -> memory | — |
| 8 | `backlogs/references-author-comment-inconsistency.md` | backlogs | `memory` | `backlogs/memory/references-author-comment-inconsistency.md` | tag 'memory' -> memory | — |
| 9 | `backlogs/slug-shape-mismatch-decisions-discussions-changelogs.md` | backlogs | `memory` | `backlogs/memory/slug-shape-mismatch-decisions-discussions-changelogs.md` | tag 'memory' -> memory | — |
| 10 | `backlogs/wrap-up-orchestration-doc-5stage-parity.md` | backlogs | `wrap-up` | `backlogs/wrap-up/wrap-up-orchestration-doc-5stage-parity.md` | tag 'wrap-up' -> wrap-up | — |
| 11 | `backlogs/wrapup-workflow-doc-broken-delegation-link.md` | backlogs | `memory` | `backlogs/memory/wrapup-workflow-doc-broken-delegation-link.md` | tag 'docs-sync' -> memory | — |

### Project · `notes/` — 6 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `notes/2026-06-08-session-memory-redesign.md` | notes | `workflow` | `notes/workflow/2026-06-08-session-memory-redesign.md` | tag 'workflow' -> workflow | — |
| 2 | `notes/2026-06-12-record-memory-wrapup-redesign.md` | notes | `workflow` | `notes/workflow/2026-06-12-record-memory-wrapup-redesign.md` | tag 'workflow' -> workflow | — |
| 3 | `notes/2026-06-14-dual-runtime-git-skill.md` | notes | `git` | `notes/git/2026-06-14-dual-runtime-git-skill.md` | tag 'git' -> git | — |
| 4 | `notes/2026-06-16-git-operation-completeness-finalized.md` | notes | `wrap-up` | `notes/wrap-up/2026-06-16-git-operation-completeness-finalized.md` | tag 'wrap-up' -> wrap-up | — |
| 5 | `notes/2026-06-18-memory-frontmatter-redesign.md` | notes | `evaluation` | `notes/evaluation/2026-06-18-memory-frontmatter-redesign.md` | tag 'evaluation' -> evaluation | — |
| 6 | `notes/2026-06-19-memory-template-redesign.md` | notes | `evaluation` | `notes/evaluation/2026-06-19-memory-template-redesign.md` | tag 'evaluation' -> evaluation | — |

### Project · `reports/` — 1 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `reports/2026-06-16-retro-sweep.md` | reports | `status` (KIND) | `reports/status/2026-06-16-retro-sweep.md` | KIND from REQUIRED `report_type: status` (L16) | RE-DERIVED — kind area (was tag 'git' -> git) |

## Feature-tier manifest (80 files)

### Feature `git-workflow` (29 files)

### `features/git-workflow/decisions/` — 4 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/git-workflow/decisions/codex-skill-prior-art-not-engaged.md` | decisions | `memory` | `features/git-workflow/decisions/memory/codex-skill-prior-art-not-engaged.md` | tag 'docs-sync' -> memory | — |
| 2 | `features/git-workflow/decisions/git-completeness-ideation-decisions.md` | decisions | `wrap-up` | `features/git-workflow/decisions/wrap-up/git-completeness-ideation-decisions.md` | tag 'wrap-up' -> wrap-up | — |
| 3 | `features/git-workflow/decisions/leader-md-git-discipline-claim-wrong.md` | decisions | `process` | `features/git-workflow/decisions/process/leader-md-git-discipline-claim-wrong.md` | tag 'process' -> process | — |
| 4 | `features/git-workflow/decisions/probe-data-source-reliability.md` | decisions | **FLAG-FOR-USER** (was `_shared`) | (held pending L14 user area-decision) | no controlled pool tag (off-vocab); legacy-tag fix first | RE-DERIVED — flagged-for-user-decision (no `_shared`) |

### `features/git-workflow/design/` — 7 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/git-workflow/design/commit-push-split-sandbox-boundary.md` | design | `git` | `features/git-workflow/design/git/commit-push-split-sandbox-boundary.md` | tag 'git' -> git | — |
| 2 | `features/git-workflow/design/dual-runtime-git-environment-model.md` | design | `git` | `features/git-workflow/design/git/dual-runtime-git-environment-model.md` | tag 'git' -> git | — |
| 3 | `features/git-workflow/design/five-trigger-pr-deferred-remediation-menu.md` | design | `git` | `features/git-workflow/design/git/five-trigger-pr-deferred-remediation-menu.md` | tag 'git' -> git | — |
| 4 | `features/git-workflow/design/hooks-additive-git-lifecycle-telemetry.md` | design | `git` | `features/git-workflow/design/git/hooks-additive-git-lifecycle-telemetry.md` | tag 'git' -> git | — |
| 5 | `features/git-workflow/design/merge-conflict-handling-p5-p7.md` | design | `git` | `features/git-workflow/design/git/merge-conflict-handling-p5-p7.md` | tag 'git' -> git | — |
| 6 | `features/git-workflow/design/runtime-posture-probe-script.md` | design | `git` | `features/git-workflow/design/git/runtime-posture-probe-script.md` | tag 'git' -> git | — |
| 7 | `features/git-workflow/design/worktree-cwd-discipline-section.md` | design | `git` | `features/git-workflow/design/git/worktree-cwd-discipline-section.md` | tag 'git' -> git | — |

### `features/git-workflow/backlogs/` — 1 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/git-workflow/backlogs/git-lifecycle-telemetry-in-hooks.md` | backlogs | `git` | `features/git-workflow/backlogs/git/git-lifecycle-telemetry-in-hooks.md` | tag 'git' -> git | — |

### `features/git-workflow/references/` — 9 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/git-workflow/references/cc-gh-tls-excludedcommands.md` | references | `git` | `features/git-workflow/references/git/cc-gh-tls-excludedcommands.md` | tag 'git' -> git | — |
| 2 | `features/git-workflow/references/cc-git-push-ask-rule-and-escape-hatch.md` | references | `git` | `features/git-workflow/references/git/cc-git-push-ask-rule-and-escape-hatch.md` | tag 'git' -> git | — |
| 3 | `features/git-workflow/references/cc-network-no-preallow.md` | references | `git` | `features/git-workflow/references/git/cc-network-no-preallow.md` | tag 'git' -> git | — |
| 4 | `features/git-workflow/references/cc-sandbox-worktree-git.md` | references | `git` | `features/git-workflow/references/git/cc-sandbox-worktree-git.md` | tag 'git' -> git | — |
| 5 | `features/git-workflow/references/codex-approval-policies-and-readonly.md` | references | `git` | `features/git-workflow/references/git/codex-approval-policies-and-readonly.md` | tag 'git' -> git | — |
| 6 | `features/git-workflow/references/codex-commit-ok-push-gh-escalate.md` | references | `git` | `features/git-workflow/references/git/codex-commit-ok-push-gh-escalate.md` | tag 'git' -> git | — |
| 7 | `features/git-workflow/references/codex-default-workspace-write-on-request.md` | references | `git` | `features/git-workflow/references/git/codex-default-workspace-write-on-request.md` | tag 'git' -> git | — |
| 8 | `features/git-workflow/references/codex-network-off-by-default.md` | references | `git` | `features/git-workflow/references/git/codex-network-off-by-default.md` | tag 'git' -> git | — |
| 9 | `features/git-workflow/references/codex-skill-prior-art.md` | references | `git` | `features/git-workflow/references/git/codex-skill-prior-art.md` | tag 'git' -> git | — |

### `features/git-workflow/plans/` — 1 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/git-workflow/plans/2026-06-14-dual-runtime-git-skill.md` | plans | `git` | `features/git-workflow/plans/git/2026-06-14-dual-runtime-git-skill.md` | tag 'git' -> git | — |

### `features/git-workflow/changelogs/` — 1 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/git-workflow/changelogs/2026-06-14-dual-runtime-git-skill-shipped.md` | changelogs | `git` | `features/git-workflow/changelogs/git/2026-06-14-dual-runtime-git-skill-shipped.md` | tag 'git' -> git | — |

### `features/git-workflow/discussions/` — 2 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/git-workflow/discussions/2026-06-14-codex-first-class-scope.md` | discussions | `codex` | `features/git-workflow/discussions/codex/2026-06-14-codex-first-class-scope.md` | tag 'codex' -> codex | — |
| 2 | `features/git-workflow/discussions/2026-06-14-post-research-design-decisions.md` | discussions | `codex` (was `_shared`) | `features/git-workflow/discussions/codex/2026-06-14-post-research-design-decisions.md` | tag 'hooks' -> codex (L12) | RE-DERIVED — re-routed from `_shared` |

### `features/git-workflow/scenarios/` — 2 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/git-workflow/scenarios/git-operation-scenarios.md` | scenarios | `git` | `features/git-workflow/scenarios/git/git-operation-scenarios.md` | tag 'git' -> git | — |
| 2 | `features/git-workflow/scenarios/git-workflow-feature-memory-absent.md` | scenarios | `workflow` | `features/git-workflow/scenarios/workflow/git-workflow-feature-memory-absent.md` | tag 'preparation' -> workflow | — |

### `features/git-workflow/checklists/` — 2 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/git-workflow/checklists/git-operation-checklists.md` | checklists | `git` | `features/git-workflow/checklists/git/git-operation-checklists.md` | tag 'git' -> git | — |
| 2 | `features/git-workflow/checklists/remediation-must-be-ask-only.md` | checklists | `process` (was `_shared`) | `features/git-workflow/checklists/process/remediation-must-be-ask-only.md` | tag 'security' -> process (L12) | RE-DERIVED — re-routed from `_shared` |

### Feature `workflow` (51 files)

### `features/workflow/decisions/` — 19 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/workflow/decisions/2026-06-08-flat-granular-loop-interior.md` | decisions | `workflow` | `features/workflow/decisions/workflow/2026-06-08-flat-granular-loop-interior.md` | tag 'session-memory' -> workflow | — |
| 2 | `features/workflow/decisions/2026-06-08-gap1-verify-session-tree-check.md` | decisions | **FLAG-FOR-USER** (was `_shared`) | (held pending L14 user area-decision) | no controlled pool tag (off-vocab); legacy-tag fix first | RE-DERIVED — flagged-for-user-decision (no `_shared`) |
| 3 | `features/workflow/decisions/2026-06-08-interview-bootstrap-exception.md` | decisions | `workflow` | `features/workflow/decisions/workflow/2026-06-08-interview-bootstrap-exception.md` | tag 'session-memory' -> workflow | — |
| 4 | `features/workflow/decisions/2026-06-08-number-prefixed-loop-dirs.md` | decisions | `workflow` | `features/workflow/decisions/workflow/2026-06-08-number-prefixed-loop-dirs.md` | tag 'session-memory' -> workflow | — |
| 5 | `features/workflow/decisions/2026-06-08-scaffold-script-mechanism.md` | decisions | `workflow` | `features/workflow/decisions/workflow/2026-06-08-scaffold-script-mechanism.md` | tag 'session-memory' -> workflow | — |
| 6 | `features/workflow/decisions/2026-06-08-script-hook-layer-verify-no-change.md` | decisions | `codex` (was `_shared`) | `features/workflow/decisions/codex/2026-06-08-script-hook-layer-verify-no-change.md` | tag 'hooks' -> codex (L12) | RE-DERIVED — re-routed from `_shared` |
| 7 | `features/workflow/decisions/2026-06-08-session-tree-spec-doc.md` | decisions | `workflow` | `features/workflow/decisions/workflow/2026-06-08-session-tree-spec-doc.md` | tag 'session-memory' -> workflow | — |
| 8 | `features/workflow/decisions/2026-06-08-single-root-transcripts.md` | decisions | `workflow` | `features/workflow/decisions/workflow/2026-06-08-single-root-transcripts.md` | tag 'session-memory' -> workflow | — |
| 9 | `features/workflow/decisions/2026-06-13-exclude-filter-over-excludes-layer2.md` | decisions | `workflow` | `features/workflow/decisions/workflow/2026-06-13-exclude-filter-over-excludes-layer2.md` | tag 'planning' -> workflow | — |
| 10 | `features/workflow/decisions/2026-06-13-int3-case-sensitivity-note.md` | decisions | `memory` | `features/workflow/decisions/memory/2026-06-13-int3-case-sensitivity-note.md` | tag 'docs-sync' -> memory | — |
| 11 | `features/workflow/decisions/2026-06-13-load-broken-window-task01-to-04.md` | decisions | `workflow` | `features/workflow/decisions/workflow/2026-06-13-load-broken-window-task01-to-04.md` | tag 'planning' -> workflow | — |
| 12 | `features/workflow/decisions/2026-06-13-manifest-command-grep-dialect-bug.md` | decisions | `memory` | `features/workflow/decisions/memory/2026-06-13-manifest-command-grep-dialect-bug.md` | tag 'docs-sync' -> memory | — |
| 13 | `features/workflow/decisions/2026-06-13-memorization-spread-count-corrected.md` | decisions | `memory` | `features/workflow/decisions/memory/2026-06-13-memorization-spread-count-corrected.md` | tag 'docs-sync' -> memory | — |
| 14 | `features/workflow/decisions/2026-06-13-memory-map-split-seam-decision.md` | decisions | `memory` | `features/workflow/decisions/memory/2026-06-13-memory-map-split-seam-decision.md` | tag 'docs-sync' -> memory | — |
| 15 | `features/workflow/decisions/2026-06-13-stage3-memory-validation-nonskippable.md` | decisions | `wrap-up` | `features/workflow/decisions/wrap-up/2026-06-13-stage3-memory-validation-nonskippable.md` | tag 'wrap-up' -> wrap-up | — |
| 16 | `features/workflow/decisions/2026-06-13-task-09-surfaces-verify-false-pass.md` | decisions | `wrap-up` | `features/workflow/decisions/wrap-up/2026-06-13-task-09-surfaces-verify-false-pass.md` | tag 'wrap-up' -> wrap-up | — |
| 17 | `features/workflow/decisions/2026-06-13-three-surface-loader-fixup.md` | decisions | `codex` | `features/workflow/decisions/codex/2026-06-13-three-surface-loader-fixup.md` | tag 'codex' -> codex | — |
| 18 | `features/workflow/decisions/2026-06-13-vocabulary-rename-blast-radius.md` | decisions | `process` (was `_shared`) | `features/workflow/decisions/process/2026-06-13-vocabulary-rename-blast-radius.md` | tag 'vocabulary-sweep' -> process (L12) | RE-DERIVED — re-routed from `_shared` |
| 19 | `features/workflow/decisions/2026-06-13-workflow-memorization-doc-filename-rename.md` | decisions | `memory` | `features/workflow/decisions/memory/2026-06-13-workflow-memorization-doc-filename-rename.md` | tag 'docs-sync' -> memory | — |

### `features/workflow/design/` — 7 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/workflow/design/claude-md-agents-md-6step-reconcile.md` | design | `memory` (was `_shared`) | `features/workflow/design/memory/claude-md-agents-md-6step-reconcile.md` | tag 'design' -> memory (L12) | RE-DERIVED — re-routed from `_shared` |
| 2 | `features/workflow/design/handoff-artifact-spec.md` | design | `wrap-up` | `features/workflow/design/wrap-up/handoff-artifact-spec.md` | tag 'wrap-up' -> wrap-up | — |
| 3 | `features/workflow/design/session-memory-tree.md` | design | `workflow` | `features/workflow/design/workflow/session-memory-tree.md` | tag 'workflow' -> workflow | — |
| 4 | `features/workflow/design/sweep-manifest-command-derived.md` | design | `memory` (was `_shared`) | `features/workflow/design/memory/sweep-manifest-command-derived.md` | tag 'design' -> memory (L12) | RE-DERIVED — re-routed from `_shared` |
| 5 | `features/workflow/design/two-skill-restructure-memory-record.md` | design | `memory` | `features/workflow/design/memory/two-skill-restructure-memory-record.md` | tag 'memory' -> memory | — |
| 6 | `features/workflow/design/vocabulary-rename-record-memory-split.md` | design | `memory` | `features/workflow/design/memory/vocabulary-rename-record-memory-split.md` | tag 'memory' -> memory | — |
| 7 | `features/workflow/design/wrap-up-5-stage-pipeline.md` | design | `wrap-up` | `features/workflow/design/wrap-up/wrap-up-5-stage-pipeline.md` | tag 'wrap-up' -> wrap-up | — |

### `features/workflow/backlogs/` — 1 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/workflow/backlogs/task-record-template-and-dangling-ref.md` | backlogs | `memory` | `features/workflow/backlogs/memory/task-record-template-and-dangling-ref.md` | tag 'docs-sync' -> memory | — |

### `features/workflow/references/` — 8 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/workflow/references/agent-trace-tree-scaffolding.md` | references | **FLAG-FOR-USER** (was `_shared`) | (held pending L14 user area-decision) | no controlled pool tag (off-vocab); legacy-tag fix first | RE-DERIVED — flagged-for-user-decision (no `_shared`) |
| 2 | `features/workflow/references/audit-log-vs-trail-naming.md` | references | `memory` | `features/workflow/references/memory/audit-log-vs-trail-naming.md` | tag 'memory' -> memory | — |
| 3 | `features/workflow/references/build-tool-deterministic-output.md` | references | **FLAG-FOR-USER** (was `_shared`) | (held pending L14 user area-decision) | no controlled pool tag (off-vocab); legacy-tag fix first | RE-DERIVED — flagged-for-user-decision (no `_shared`) |
| 4 | `features/workflow/references/git-layout-mutability-split.md` | references | **FLAG-FOR-USER** (was `_shared`) | (held pending L14 user area-decision) | no controlled pool tag (off-vocab); legacy-tag fix first | RE-DERIVED — flagged-for-user-decision (no `_shared`) |
| 5 | `features/workflow/references/memory-consolidation-end-of-session-stage.md` | references | `memory` | `features/workflow/references/memory/memory-consolidation-end-of-session-stage.md` | tag 'memory' -> memory | — |
| 6 | `features/workflow/references/pre-post-gate-different-artifacts.md` | references | `wrap-up` | `features/workflow/references/wrap-up/pre-post-gate-different-artifacts.md` | tag 'wrap-up' -> wrap-up | — |
| 7 | `features/workflow/references/release-pipeline-gates-deploy-last.md` | references | `wrap-up` | `features/workflow/references/wrap-up/release-pipeline-gates-deploy-last.md` | tag 'wrap-up' -> wrap-up | — |
| 8 | `features/workflow/references/wal-vs-checkpoint-lifecycle.md` | references | `workflow` | `features/workflow/references/workflow/wal-vs-checkpoint-lifecycle.md` | tag 'lifecycle' -> workflow | — |

### `features/workflow/plans/` — 2 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/workflow/plans/2026-06-08-session-memory-redesign.md` | plans | `workflow` | `features/workflow/plans/workflow/2026-06-08-session-memory-redesign.md` | tag 'workflow' -> workflow | — |
| 2 | `features/workflow/plans/2026-06-13-record-memory-wrapup-redesign.md` | plans | `workflow` | `features/workflow/plans/workflow/2026-06-13-record-memory-wrapup-redesign.md` | tag 'workflow' -> workflow | — |

### `features/workflow/discussions/` — 8 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/workflow/discussions/2026-06-08-session-memory-redesign-decisions.md` | discussions | `workflow` | `features/workflow/discussions/workflow/2026-06-08-session-memory-redesign-decisions.md` | tag 'session-memory' -> workflow | — |
| 2 | `features/workflow/discussions/2026-06-13-pipeline-order-d8-git-last.md` | discussions | `wrap-up` | `features/workflow/discussions/wrap-up/2026-06-13-pipeline-order-d8-git-last.md` | tag 'wrap-up' -> wrap-up | — |
| 3 | `features/workflow/discussions/2026-06-13-planning-iter1-fail-disposition.md` | discussions | `evaluation` | `features/workflow/discussions/evaluation/2026-06-13-planning-iter1-fail-disposition.md` | tag 'evaluation' -> evaluation | — |
| 4 | `features/workflow/discussions/2026-06-13-planning-iter2-revise-quick-patch-close.md` | discussions | `evaluation` | `features/workflow/discussions/evaluation/2026-06-13-planning-iter2-revise-quick-patch-close.md` | tag 'evaluation' -> evaluation | — |
| 5 | `features/workflow/discussions/2026-06-13-scope-lock-d12-workflow-feature.md` | discussions | `memory` (was `_shared`) | `features/workflow/discussions/memory/2026-06-13-scope-lock-d12-workflow-feature.md` | tag 'design' -> memory (L12) | RE-DERIVED — re-routed from `_shared` |
| 6 | `features/workflow/discussions/2026-06-13-stage3-nonskippable-d11-d13.md` | discussions | `wrap-up` | `features/workflow/discussions/wrap-up/2026-06-13-stage3-nonskippable-d11-d13.md` | tag 'wrap-up' -> wrap-up | — |
| 7 | `features/workflow/discussions/2026-06-13-two-skill-hybrid-d10.md` | discussions | `memory` (was `_shared`) | `features/workflow/discussions/memory/2026-06-13-two-skill-hybrid-d10.md` | tag 'design' -> memory (L12) | RE-DERIVED — re-routed from `_shared` |
| 8 | `features/workflow/discussions/2026-06-13-vocabulary-d5-d6-d7-lock.md` | discussions | `memory` (was `_shared`) | `features/workflow/discussions/memory/2026-06-13-vocabulary-d5-d6-d7-lock.md` | tag 'design' -> memory (L12) | RE-DERIVED — re-routed from `_shared` |

### `features/workflow/scenarios/` — 1 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/workflow/scenarios/workflow-memorization-doc-rename-scope.md` | scenarios | `process` (was `_shared`) | `features/workflow/scenarios/process/workflow-memorization-doc-rename-scope.md` | tag 'vocabulary-sweep' -> process (L12) | RE-DERIVED — re-routed from `_shared` |

### `features/workflow/checklists/` — 5 files

| # | Source (flat) | Declared type | Resolved area | Destination | Area basis | Flags |
|---|---|---|---|---|---|---|
| 1 | `features/workflow/checklists/insight-headlines-factual-not-self-graded.md` | checklists | `memory` | `features/workflow/checklists/memory/insight-headlines-factual-not-self-graded.md` | tag 'docs-sync' -> memory | — |
| 2 | `features/workflow/checklists/manifest-verbatim-rerun-reproducibility.md` | checklists | `memory` | `features/workflow/checklists/memory/manifest-verbatim-rerun-reproducibility.md` | tag 'docs-sync' -> memory | — |
| 3 | `features/workflow/checklists/post-split-gate-both-required.md` | checklists | `codex` | `features/workflow/checklists/codex/post-split-gate-both-required.md` | tag 'codex' -> codex | — |
| 4 | `features/workflow/checklists/sweep-executor-verification-steps.md` | checklists | `process` (was `_shared`) | `features/workflow/checklists/process/sweep-executor-verification-steps.md` | tag 'vocabulary-sweep' -> process (L12) | RE-DERIVED — re-routed from `_shared` |
| 5 | `features/workflow/checklists/task-09-evaluation-md-verify.md` | checklists | `wrap-up` | `features/workflow/checklists/wrap-up/task-09-evaluation-md-verify.md` | tag 'wrap-up' -> wrap-up | — |
